/* Care Insight AI - resident.js */

/* ===========================
   어르신 데이터
=========================== */

let residents =
  JSON.parse(
    localStorage.getItem("residents")
  ) || {
    kim: {
      name: "김OO 어르신",
      info:
        "M / 82세 · 등급 2등급 · 담당: 홍길동 요양보호사"
    },

    lee: {
      name: "이OO 어르신",
      info:
        "F / 87세 · 등급 3등급 · 담당: 김영희 요양보호사"
    },

    park: {
      name: "박OO 어르신",
      info:
        "M / 79세 · 등급 2등급 · 담당: 이순자 요양보호사"
    }
  };

let currentResident =
  localStorage.getItem("currentResident") || "kim";

let editingResidentId = null;


/* ===========================
   어르신 선택 목록
=========================== */

function renderResidentSelect() {
  const select =
    document.getElementById("residentSelect");

  if (!select) {
    console.error(
      "어르신 선택 목록을 찾을 수 없습니다."
    );
    return;
  }

  select.innerHTML = "";

  if (
    !residents ||
    typeof residents !== "object" ||
    Array.isArray(residents) ||
    Object.keys(residents).length === 0
  ) {
    residents = {
      kim: {
        name: "김OO 어르신",
        info:
          "M / 82세 · 등급 2등급 · 담당: 홍길동 요양보호사"
      },

      lee: {
        name: "이OO 어르신",
        info:
          "F / 87세 · 등급 3등급 · 담당: 김영희 요양보호사"
      },

      park: {
        name: "박OO 어르신",
        info:
          "M / 79세 · 등급 2등급 · 담당: 이순자 요양보호사"
      }
    };

    saveResidents();
  }

  const residentIds =
    Object.keys(residents);

  residentIds.forEach(id => {
    const resident = residents[id];

    if (!resident || !resident.name) {
      return;
    }

    const option =
      document.createElement("option");

    option.value = id;
    option.textContent = resident.name;

    select.appendChild(option);
  });

  if (!residents[currentResident]) {
    currentResident =
      residentIds[0];

    saveCurrentResident();
  }

  select.value =
    currentResident;

  changeResident();
}


/* ===========================
   어르신 변경
=========================== */

function changeResident() {
  const select =
    document.getElementById("residentSelect");

  if (!select) {
    console.error(
      "어르신 선택 목록이 없습니다."
    );
    return;
  }

  const selectedId =
    select.value;

  if (
    !selectedId ||
    !residents[selectedId]
  ) {
    const firstResidentId =
      Object.keys(residents)[0];

    if (!firstResidentId) {
      console.error(
        "등록된 어르신 정보가 없습니다."
      );
      return;
    }

    currentResident =
      firstResidentId;

    select.value =
      firstResidentId;
  } else {
    currentResident =
      selectedId;
  }

  saveCurrentResident();

  const resident =
    residents[currentResident];

  const residentName =
    document.getElementById("residentName");

  const residentInfo =
    document.getElementById("residentInfo");

  if (residentName) {
    residentName.textContent =
      resident.name;
  }

  if (residentInfo) {
    residentInfo.textContent =
      resident.info;
  }

  const nameInput =
    document.getElementById(
      "newResidentName"
    );

  const infoInput =
    document.getElementById(
      "newResidentInfo"
    );

  if (nameInput) {
    nameInput.value =
      resident.name;
  }

  if (infoInput) {
    infoInput.value =
      resident.info;
  }

  if (
    typeof renderRecords === "function"
  ) {
    renderRecords();
  }

  if (
    typeof renderTimeline === "function"
  ) {
    renderTimeline();
  }

  if (
    typeof renderCareFlow === "function"
  ) {
    renderCareFlow();
  }

  if (
    typeof resetAIAnalysis === "function"
  ) {
    resetAIAnalysis();
  }

  const reportContent =
    document.getElementById("reportContent");

  if (
    reportContent &&
    typeof generateReport === "function"
  ) {
   generateReport();
  }
}


/* ===========================
   어르신 추가 / 수정
=========================== */

function addResident() {
  const nameInput =
    document.getElementById(
      "newResidentName"
    );

  const infoInput =
    document.getElementById(
      "newResidentInfo"
    );

  if (!nameInput || !infoInput) {
    alert(
      "어르신 입력창을 찾을 수 없습니다."
    );
    return;
  }

  const name =
    nameInput.value.trim();

  const info =
    infoInput.value.trim();

  if (!name || !info) {
    alert(
      "어르신 이름과 정보를 모두 입력해주세요."
    );
    return;
  }

  if (editingResidentId) {
    residents[editingResidentId] = {
      name,
      info
    };

    currentResident =
      editingResidentId;

    editingResidentId = null;

    saveResidents();
    saveCurrentResident();
    renderResidentSelect();

    nameInput.value = "";
    infoInput.value = "";

    alert(
      "어르신 정보가 수정되었습니다."
    );

    return;
  }

  const duplicate =
    Object.values(residents).some(
      resident =>
        resident.name === name &&
        resident.info === info
    );

  if (duplicate) {
    alert(
      "이미 등록된 어르신입니다."
    );
    return;
  }

  const id =
    "resident_" + Date.now();

  residents[id] = {
    name,
    info
  };

  currentResident =
    id;

  saveResidents();
  saveCurrentResident();
  renderResidentSelect();

  nameInput.value = "";
  infoInput.value = "";

  alert(
    "어르신이 추가되었습니다."
  );
}


/* ===========================
   어르신 수정 준비
=========================== */

function loadResidentForEdit() {
  const resident =
    residents[currentResident];

  if (!resident) {
    alert(
      "수정할 어르신이 없습니다."
    );
    return;
  }

  const nameInput =
    document.getElementById(
      "newResidentName"
    );

  const infoInput =
    document.getElementById(
      "newResidentInfo"
    );

  if (nameInput) {
    nameInput.value =
      resident.name;
  }

  if (infoInput) {
    infoInput.value =
      resident.info;
  }

  editingResidentId =
    currentResident;

  alert(
    "수정할 내용을 입력한 뒤 '어르신 추가' 버튼을 누르면 저장됩니다."
  );
}


/* ===========================
   어르신 삭제
=========================== */

function deleteResident() {
  const resident =
    residents[currentResident];

  if (!resident) {
    alert(
      "삭제할 어르신이 없습니다."
    );
    return;
  }

  const deletedResidentId =
    currentResident;

  const ok =
    confirm(
      `${resident.name} 정보를 삭제하시겠습니까?\n` +
      "관련 기록도 함께 삭제됩니다."
    );

  if (!ok) return;

  delete residents[
    deletedResidentId
  ];

  if (
    typeof records !== "undefined"
  ) {
    records = records.filter(
      record =>
        record.residentId !==
        deletedResidentId
    );

    saveRecords();
  }

  if (
    typeof aiRecords !== "undefined"
  ) {
    aiRecords = aiRecords.filter(
      record =>
        record.residentId !==
        deletedResidentId
    );

    saveAIRecords();
  }

  if (
    typeof events !== "undefined"
  ) {
    events = events.filter(
      event =>
        event.residentId !==
        deletedResidentId
    );

    saveEvents();
  }

  const ids =
    Object.keys(residents);

  if (ids.length === 0) {
    const id =
      "resident_" + Date.now();

    residents[id] = {
      name: "신규 어르신",
      info:
        "성별 / 나이 · 등급 · 담당자"
    };

    currentResident =
      id;
  } else {
    currentResident =
      ids[0];
  }

  editingResidentId = null;

  saveResidents();
  saveCurrentResident();
  renderResidentSelect();

  alert(
    `${resident.name} 정보가 삭제되었습니다.`
  );
}