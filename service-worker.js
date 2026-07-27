const CACHE_NAME = "care-insight-runtime";

const CORE_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./mobile.css",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

/*
 * Service Worker 설치
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_FILES))
  );

  /*
   * 새 Service Worker가 즉시 대기 상태를 벗어나도록 함
   */
  self.skipWaiting();
});

/*
 * Service Worker 활성화
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName !== CACHE_NAME
            )
            .map((cacheName) =>
              caches.delete(cacheName)
            )
        );
      })
      .then(() => self.clients.claim())
  );
});

/*
 * 네트워크 우선 전략
 *
 * 온라인:
 *   최신 파일 다운로드 → 캐시 갱신 → 화면 표시
 *
 * 오프라인:
 *   기존 캐시 사용
 */
self.addEventListener("fetch", (event) => {
  const request = event.request;

  /*
   * GET 요청만 캐시 처리
   */
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        /*
         * 정상 응답이면 최신 내용을 캐시에 저장
         */
        if (
          networkResponse &&
          networkResponse.status === 200
        ) {
          const responseClone =
            networkResponse.clone();

          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(
                request,
                responseClone
              );
            });
        }

        return networkResponse;
      })
      .catch(() => {
        /*
         * 인터넷 연결 실패 시 캐시 사용
         */
        return caches.match(request);
      })
  );
});