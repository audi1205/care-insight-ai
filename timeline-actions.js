/* Care Insight AI - timeline-actions.js */

/* ===========================
   Timeline 개별 삭제
=========================== */

function deleteTimelineEvent(eventId) {
  const targetEvent = events.find(
    event => event.id === eventId
  );

  if (!targetEvent) {
    alert("삭제할 기록을 찾을 수 없습니다.");
    return;
  }

  let eventTypeText = "관찰 기록";

  if (targetEvent.type === "ai") {
    eventTypeText = "AI 분석 기록";
  } else if (targetEvent.type === "action") {
    eventTypeText = "조치 기록";
  } else if (targetEvent.type === "evaluation") {
    eventTypeText = "평가 기록";
  }

  const ok = confirm(
    `${targetEvent.date} ${targetEvent.time}\n` +
    `${eventTypeText}을 삭제하시겠습니까?`
  );

  if (!ok) return;

  /*
   * 관찰 삭제
   * 연결 조치와 평가도 함께 삭제
   */
  if (targetEvent.type === "observation") {
    const connectedActionIds = events
      .filter(
        event =>
          event.type === "action" &&
          event.parentEventId === targetEvent.id
      )
      .map(event => event.id);

    events = events.filter(event => {
      const isConnectedAction =
        connectedActionIds.includes(event.id);

      const isConnectedEvaluation =
        event.type === "evaluation" &&
        connectedActionIds.includes(
          event.parentEventId
        );

      return (
        !isConnectedAction &&
        !isConnectedEvaluation
      );
    });

    let recordIndex = records.findIndex(
      record =>
        record.eventId === eventId
    );

    /*
     * eventId가 없는 구형 기록 대응
     */
    if (recordIndex === -1) {
      recordIndex = records.findIndex(
        record =>
          record.residentId ===
            targetEvent.residentId &&
          record.date === targetEvent.date &&
          record.time === targetEvent.time &&
          record.type === targetEvent.title
      );
    }

    if (recordIndex !== -1) {
      records.splice(recordIndex, 1);
      saveRecords();
    }
  }

  /*
   * 조치 삭제
   * 연결 평가도 함께 삭제
   */
  if (targetEvent.type === "action") {
    events = events.filter(
      event =>
        event.parentEventId !==
        targetEvent.id
    );
  }

  /*
   * AI 기록 삭제
   */
  if (targetEvent.type === "ai") {
    let aiRecordIndex =
      aiRecords.findIndex(
        record =>
          record.eventId === eventId
      );

    /*
     * eventId가 없는 구형 AI 기록 대응
     */
    if (aiRecordIndex === -1) {
      aiRecordIndex =
        aiRecords.findIndex(
          record =>
            record.residentId ===
              targetEvent.residentId &&
            record.date ===
              targetEvent.date &&
            record.time ===
              targetEvent.time &&
            record.text ===
              targetEvent.body
        );
    }

    if (aiRecordIndex !== -1) {
      aiRecords.splice(
        aiRecordIndex,
        1
      );

      saveAIRecords();
    }
  }

  /*
   * 선택한 이벤트 삭제
   */
  events = events.filter(
    event =>
      event.id !== targetEvent.id
  );

  saveEvents();

  /*
   * 관찰 삭제 시 AI 재분석
   */
  if (
    targetEvent.type ===
    "observation"
  ) {
    refreshAIAnalysis(true);
  }

  refreshAllViews();

  alert(
    "선택한 기록이 삭제되었습니다."
  );
}


/* ===========================
   날짜별 기록 삭제
=========================== */

function deleteRecordsByDate() {
  const dateInput =
    document.getElementById(
      "timelineDeleteDate"
    );

  const selectedDateValue =
    dateInput.value;

  if (!selectedDateValue) {
    alert(
      "삭제할 날짜를 선택해주세요."
    );
    return;
  }

  const resident =
    residents[currentResident];

  if (!resident) {
    alert(
      "선택된 어르신 정보가 없습니다."
    );
    return;
  }

  const selectedDate =
    formatDateToKorean(
      selectedDateValue
    );

  const observationCount =
    records.filter(
      record =>
        record.residentId ===
          currentResident &&
        record.date === selectedDate
    ).length;

  const aiCount =
    aiRecords.filter(
      record =>
        record.residentId ===
          currentResident &&
        record.date === selectedDate
    ).length;

  const timelineCount =
    events.filter(
      event =>
        event.residentId ===
          currentResident &&
        event.date === selectedDate
    ).length;

  if (
    observationCount === 0 &&
    aiCount === 0 &&
    timelineCount === 0
  ) {
    alert(
      `${selectedDate}에 저장된 기록이 없습니다.`
    );
    return;
  }

  const ok = confirm(
    `${resident.name}의 ${selectedDate} 기록을 삭제하시겠습니까?\n\n` +
    `관찰 기록: ${observationCount}건\n` +
    `AI 분석 기록: ${aiCount}건\n` +
    `Timeline 기록: ${timelineCount}건`
  );

  if (!ok) return;

  records = records.filter(
    record =>
      !(
        record.residentId ===
          currentResident &&
        record.date ===
          selectedDate
      )
  );

  aiRecords = aiRecords.filter(
    record =>
      !(
        record.residentId ===
          currentResident &&
        record.date ===
          selectedDate
      )
  );

  events = events.filter(
    event =>
      !(
        event.residentId ===
          currentResident &&
        event.date ===
          selectedDate
      )
  );

  saveRecords();
  saveAIRecords();
  saveEvents();

  const today =
    new Date().toLocaleDateString(
      "ko-KR"
    );

  if (selectedDate === today) {
    refreshAIAnalysis(false);
  }

  refreshAllViews();

  dateInput.value = "";

  alert(
    `${selectedDate} 기록이 삭제되었습니다.`
  );
}