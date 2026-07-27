/* Care Insight AI - utils.js */

/* ===========================
   HTML 문자열 안전 처리
=========================== */

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* ===========================
   날짜 형식 변환
=========================== */

function formatDateToKorean(dateValue) {
  const selectedDate =
    new Date(dateValue + "T00:00:00");

  return selectedDate.toLocaleDateString("ko-KR");
}