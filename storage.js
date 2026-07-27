/* Care Insight AI - storage.js */

/* ===========================
   어르신 저장
=========================== */

function saveResidents() {
  localStorage.setItem(
    "residents",
    JSON.stringify(residents)
  );
}

function saveCurrentResident() {
  localStorage.setItem(
    "currentResident",
    currentResident
  );
}


/* ===========================
   관찰 기록 저장
=========================== */

function saveRecords() {
  localStorage.setItem(
    "careRecords",
    JSON.stringify(records)
  );
}


/* ===========================
   Timeline 저장
=========================== */

function saveEvents() {
  localStorage.setItem(
    "careEvents",
    JSON.stringify(events)
  );
}


/* ===========================
   AI 기록 저장
=========================== */

function saveAIRecords() {
  localStorage.setItem(
    "aiRecords",
    JSON.stringify(aiRecords)
  );
}