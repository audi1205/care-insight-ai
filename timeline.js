/* Care Insight AI - timeline.js */

/* ===========================
   Timeline 데이터
=========================== */

let events =
  JSON.parse(
    localStorage.getItem("careEvents")
  ) || [];


/* ===========================
   Timeline 이벤트 생성
=========================== */

function createEvent({
  type,
  residentId,
  residentName,
  title,
  body,
  risk = "",
  action = "",
  parentEventId = null,
  parentTitle = ""
}) {
  const now = new Date();

  const event = {
    id:
      "event_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(16)
        .slice(2),

    type,
    residentId,
    residentName,
    title,
    body,
    risk,
    action,
    parentEventId,
    parentTitle,

    date:
      now.toLocaleDateString("ko-KR"),

    time:
      now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit"
      }),

    timestamp:
      now.getTime()
  };

  events.push(event);
  saveEvents();

  return event;
}


/* ===========================
   Timeline 화면 출력
=========================== */

function renderTimeline() {
  const timeline =
    document.getElementById("timeline");

  if (!timeline) {
    return;
  }

  timeline.innerHTML = "";

  const filteredEvents = events
    .filter(
      event =>
        event.residentId === currentResident
    )
    .sort(
      (a, b) =>
        b.timestamp - a.timestamp
    );

  if (filteredEvents.length === 0) {
    timeline.textContent =
      "저장된 Timeline 기록이 없습니다.";

    return;
  }

  filteredEvents.forEach(event => {
    const item =
      document.createElement("div");

    if (event.type === "ai") {
      item.className =
        "timeline-item ai-event";
    } else if (
      event.type === "action"
    ) {
      item.className =
        "timeline-item action-event";
    } else if (
      event.type === "evaluation"
    ) {
      item.className =
        "timeline-item evaluation-event";
    } else {
      item.className =
        "timeline-item";
    }

    let icon = "📝";

    if (event.type === "ai") {
      icon = "🤖";
    } else if (
      event.type === "action"
    ) {
      icon = "✅";
    } else if (
      event.type === "evaluation"
    ) {
      icon = "📈";
    }

    item.innerHTML = `
      <div class="timeline-item-header">
        <div class="timeline-time">
          ${escapeHTML(event.date)}
          ${escapeHTML(event.time)}
        </div>

        <div class="timeline-item-actions">
          ${
            event.type === "observation"
              ? `
                <button
                  type="button"
                  class="timeline-action-btn"
                  onclick="openActionModal('${event.id}')"
                >
                  조치 추가
                </button>
              `
              : ""
          }

          ${
            event.type === "action"
              ? `
                <button
                  type="button"
                  class="timeline-evaluation-btn"
                  onclick="openEvaluationModal('${event.id}')"
                >
                  평가 추가
                </button>
              `
              : ""
          }

          <button
            type="button"
            class="timeline-delete-btn"
            onclick="deleteTimelineEvent('${event.id}')"
          >
            삭제
          </button>
        </div>
      </div>

      <div class="timeline-title">
        ${icon}
        ${escapeHTML(event.title)}
      </div>

      ${
        event.type === "action" &&
        event.parentTitle
          ? `
            <div class="timeline-parent">
              연결 관찰:
              ${escapeHTML(event.parentTitle)}
            </div>
          `
          : ""
      }

      ${
        event.type === "evaluation" &&
        event.parentTitle
          ? `
            <div class="timeline-parent evaluation-parent">
              연결 조치:
              ${escapeHTML(event.parentTitle)}
            </div>
          `
          : ""
      }

      <div class="timeline-body">
        ${escapeHTML(event.body)}
      </div>

      ${
        event.risk
          ? `
            <div class="timeline-risk">
              위험도:
              ${escapeHTML(event.risk)}
            </div>
          `
          : ""
      }

      ${
        event.action
          ? `
            <div class="timeline-body">
              <strong>추천 조치</strong><br>
              ${escapeHTML(event.action)}
            </div>
          `
          : ""
      }
    `;

    timeline.appendChild(item);
  });
}