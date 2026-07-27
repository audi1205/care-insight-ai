/* Care Insight AI - care-actions.js */

/* ===========================
   Care Action 상태
=========================== */

let currentActionParentEventId = null;
let currentEvaluationParentEventId = null;


/* ===========================
   조치 입력
=========================== */

function openActionModal(eventId) {
  const parentEvent = events.find(
    event => event.id === eventId
  );

  if (!parentEvent) {
    alert("연결할 관찰 기록을 찾을 수 없습니다.");
    return;
  }

  currentActionParentEventId = eventId;

  document.getElementById("actionModalTitle").textContent =
    `${parentEvent.title} 조치 기록`;

  document.getElementById("careActionType").value = "";
  document.getElementById("careActionEtc").value = "";
  document.getElementById("careActionNote").value = "";

  document.getElementById("actionEtcField").style.display =
    "none";

  document
    .getElementById("actionModal")
    .classList.add("show");
}

function closeActionModal() {
  document
    .getElementById("actionModal")
    .classList.remove("show");

  currentActionParentEventId = null;
}

function updateActionEtcField() {
  const actionType =
    document.getElementById("careActionType").value;

  const etcField =
    document.getElementById("actionEtcField");

  const etcInput =
    document.getElementById("careActionEtc");

  const shouldShow =
    actionType === "기타";

  etcField.style.display =
    shouldShow ? "block" : "none";

  if (!shouldShow) {
    etcInput.value = "";
  }
}

function saveCareAction() {
  const parentEvent = events.find(
    event =>
      event.id === currentActionParentEventId
  );

  if (!parentEvent) {
    alert("연결할 관찰 기록을 찾을 수 없습니다.");
    return;
  }

  const actionType =
    document.getElementById("careActionType").value;

  const actionEtc =
    document
      .getElementById("careActionEtc")
      .value
      .trim();

  const actionNote =
    document
      .getElementById("careActionNote")
      .value
      .trim();

  if (!actionType) {
    alert("조치 유형을 선택해주세요.");
    return;
  }

  if (
    actionType === "기타" &&
    !actionEtc
  ) {
    alert("기타 조치 내용을 입력해주세요.");

    document
      .getElementById("careActionEtc")
      .focus();

    return;
  }

  const actionText =
    actionType === "기타"
      ? actionEtc
      : actionType;

  let summary =
    `${actionText}을 실시함.`;

  if (actionNote) {
    summary +=
      ` 조치 내용: ${actionNote}`;
  }

  createEvent({
    type: "action",
    residentId: currentResident,
    residentName:
      residents[currentResident].name,
    title: "조치",
    body: summary,
    parentEventId: parentEvent.id,
    parentTitle: parentEvent.title
  });

  closeActionModal();

  refreshAllViews();

  alert("조치 기록이 저장되었습니다.");
}


/* ===========================
   Care Evaluation
=========================== */

function openEvaluationModal(eventId) {
  const parentAction = events.find(
    event => event.id === eventId
  );

  if (
    !parentAction ||
    parentAction.type !== "action"
  ) {
    alert("연결할 조치 기록을 찾을 수 없습니다.");
    return;
  }

  currentEvaluationParentEventId =
    eventId;

  document
    .getElementById("evaluationModalTitle")
    .textContent =
      `${
        parentAction.parentTitle ||
        "관찰"
      } 조치 결과 평가`;

  document
    .getElementById("evaluationResult")
    .value = "";

  document
    .getElementById("evaluationTime")
    .value = "";

  document
    .getElementById("evaluationNote")
    .value = "";

  document
    .getElementById("evaluationModal")
    .classList.add("show");
}

function closeEvaluationModal() {
  document
    .getElementById("evaluationModal")
    .classList.remove("show");

  currentEvaluationParentEventId =
    null;
}

function saveCareEvaluation() {
  const parentAction = events.find(
    event =>
      event.id ===
      currentEvaluationParentEventId
  );

  if (!parentAction) {
    alert("연결할 조치 기록을 찾을 수 없습니다.");
    return;
  }

  const result =
    document
      .getElementById("evaluationResult")
      .value;

  const evaluationTime =
    document
      .getElementById("evaluationTime")
      .value;

  const note =
    document
      .getElementById("evaluationNote")
      .value
      .trim();

  if (!result) {
    alert("결과 상태를 선택해주세요.");
    return;
  }

  if (!evaluationTime) {
    alert("평가 시점을 선택해주세요.");
    return;
  }

  let summary =
    `${evaluationTime} 평가 결과 ${result}.`;

  if (note) {
    summary +=
      ` 평가 내용: ${note}`;
  }

  createEvent({
    type: "evaluation",
    residentId: currentResident,
    residentName:
      residents[currentResident].name,
    title: "평가",
    body: summary,
    parentEventId: parentAction.id,
    parentTitle:
      parentAction.parentTitle ||
      parentAction.title
  });

  closeEvaluationModal();

  refreshAllViews();

  alert("평가 기록이 저장되었습니다.");
}