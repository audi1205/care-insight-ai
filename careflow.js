/* Care Insight AI - careflow.js */

/* ===========================
   Care Flow 데이터 조회
=========================== */

function getActionsForObservation(observationId) {
  return events
    .filter(
      event =>
        event.type === "action" &&
        event.parentEventId === observationId
    )
    .sort(
      (a, b) =>
        a.timestamp - b.timestamp
    );
}

function getEvaluationsForAction(actionId) {
  return events
    .filter(
      event =>
        event.type === "evaluation" &&
        event.parentEventId === actionId
    )
    .sort(
      (a, b) =>
        a.timestamp - b.timestamp
    );
}


/* ===========================
   조치 및 평가 HTML
=========================== */

function createCareFlowActionHTML(actionEvent) {
  const evaluations =
    getEvaluationsForAction(
      actionEvent.id
    );

  const evaluationsHTML =
    evaluations.length > 0
      ? evaluations
          .map(evaluation => {
            return `
              <div class="care-flow-evaluation">
                <div class="care-flow-node-icon">
                  📈
                </div>

                <div class="care-flow-node-content">
                  <div class="care-flow-node-header">
                    <strong>평가</strong>

                    <span>
                      ${escapeHTML(evaluation.date)}
                      ${escapeHTML(evaluation.time)}
                    </span>
                  </div>

                  <p>
                    ${escapeHTML(evaluation.body)}
                  </p>

                  <button
                    type="button"
                    class="
                      timeline-delete-btn
                      care-flow-delete-btn
                    "
                    onclick="
                      deleteTimelineEvent(
                        '${evaluation.id}'
                      )
                    "
                  >
                    평가 삭제
                  </button>
                </div>
              </div>
            `;
          })
          .join("")
      : `
          <div class="care-flow-empty-child">
            아직 등록된 평가가 없습니다.
          </div>
        `;

  return `
    <div class="care-flow-action">
      <div class="care-flow-node-icon">
        ✅
      </div>

      <div class="care-flow-node-content">
        <div class="care-flow-node-header">
          <strong>조치</strong>

          <span>
            ${escapeHTML(actionEvent.date)}
            ${escapeHTML(actionEvent.time)}
          </span>
        </div>

        <p>
          ${escapeHTML(actionEvent.body)}
        </p>

        <div class="care-flow-buttons">
          <button
            type="button"
            class="timeline-evaluation-btn"
            onclick="
              openEvaluationModal(
                '${actionEvent.id}'
              )
            "
          >
            평가 추가
          </button>

          <button
            type="button"
            class="timeline-delete-btn"
            onclick="
              deleteTimelineEvent(
                '${actionEvent.id}'
              )
            "
          >
            조치 삭제
          </button>
        </div>

        <div class="care-flow-evaluations">
          ${evaluationsHTML}
        </div>
      </div>
    </div>
  `;
}


/* ===========================
   관찰 Case HTML
=========================== */

function createCareFlowCaseHTML(
  observationEvent,
  caseNumber
) {
  const actions =
    getActionsForObservation(
      observationEvent.id
    );

  const actionsHTML =
    actions.length > 0
      ? actions
          .map(actionEvent =>
            createCareFlowActionHTML(
              actionEvent
            )
          )
          .join("")
      : `
          <div class="care-flow-empty-child">
            아직 등록된 조치가 없습니다.
          </div>
        `;

  return `
    <article class="care-flow-case">
      <div class="care-flow-case-header">
        <div>
          <span class="care-flow-case-number">
            Care Case ${caseNumber}
          </span>

          <h4>
            📝
            ${escapeHTML(
              observationEvent.title
            )}
          </h4>
        </div>

        <div class="care-flow-case-time">
          ${escapeHTML(
            observationEvent.date
          )}
          ${escapeHTML(
            observationEvent.time
          )}
        </div>
      </div>

      <div class="care-flow-observation-body">
        ${escapeHTML(
          observationEvent.body
        )}
      </div>

      <div class="care-flow-buttons">
        <button
          type="button"
          class="timeline-action-btn"
          onclick="
            openActionModal(
              '${observationEvent.id}'
            )
          "
        >
          조치 추가
        </button>

        <button
          type="button"
          class="timeline-delete-btn"
          onclick="
            deleteTimelineEvent(
              '${observationEvent.id}'
            )
          "
        >
          관찰 삭제
        </button>
      </div>

      <div class="care-flow-children">
        ${actionsHTML}
      </div>
    </article>
  `;
}


/* ===========================
   AI 분석 이력 HTML
=========================== */

function createCareFlowAISectionHTML() {
  const aiEvents = events
    .filter(
      event =>
        event.residentId ===
          currentResident &&
        event.type === "ai"
    )
    .sort(
      (a, b) =>
        b.timestamp - a.timestamp
    );

  if (aiEvents.length === 0) {
    return "";
  }

  const aiItemsHTML =
    aiEvents
      .map(event => {
        return `
          <div class="care-flow-ai-item">
            <div class="care-flow-node-header">
              <strong>
                🤖 AI 상태분석
              </strong>

              <span>
                ${escapeHTML(event.date)}
                ${escapeHTML(event.time)}
              </span>
            </div>

            <p>
              ${escapeHTML(event.body)}
            </p>

            ${
              event.risk
                ? `
                  <div class="care-flow-ai-risk">
                    위험도:
                    ${escapeHTML(
                      event.risk
                    )}
                  </div>
                `
                : ""
            }

            ${
              event.action
                ? `
                  <div class="care-flow-ai-action">
                    <strong>
                      추천 조치
                    </strong>
                    <br>
                    ${escapeHTML(
                      event.action
                    )}
                  </div>
                `
                : ""
            }
          </div>
        `;
      })
      .join("");

  return `
    <section class="care-flow-ai-section">
      <h4>AI 분석 이력</h4>
      ${aiItemsHTML}
    </section>
  `;
}


/* ===========================
   Care Flow 화면 출력
=========================== */

function renderCareFlow() {
  const careFlow =
    document.getElementById(
      "careFlow"
    );

  if (!careFlow) {
    return;
  }

  const observationEvents =
    events
      .filter(
        event =>
          event.residentId ===
            currentResident &&
          event.type ===
            "observation"
      )
      .sort(
        (a, b) =>
          b.timestamp - a.timestamp
      );

  if (
    observationEvents.length === 0
  ) {
    careFlow.innerHTML = `
      <div class="care-flow-empty">
        저장된 관찰 기반
        Care Flow가 없습니다.
      </div>

      ${createCareFlowAISectionHTML()}
    `;

    return;
  }

  const casesHTML =
    observationEvents
      .map(
        (
          observationEvent,
          index
        ) =>
          createCareFlowCaseHTML(
            observationEvent,
            observationEvents.length -
              index
          )
      )
      .join("");

  careFlow.innerHTML =
    casesHTML +
    createCareFlowAISectionHTML();
}