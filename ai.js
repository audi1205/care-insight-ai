/* Care Insight AI - ai.js */

/* ===========================
   AI 기록 데이터
=========================== */

let aiRecords =
  JSON.parse(
    localStorage.getItem("aiRecords")
  ) || [];

  /* ===========================
   AI 화면 초기화
=========================== */

function resetAIAnalysis() {
  const aiText =
    document.getElementById("aiText");

  const aiRisk =
    document.getElementById("aiRisk");

  const aiAction =
    document.getElementById("aiAction");

  if (aiText) {
    aiText.textContent =
      "아직 생성된 기록이 없습니다.";
  }

  if (aiRisk) {
    aiRisk.textContent =
      "아직 분석된 위험도가 없습니다.";
  }

  if (aiAction) {
    aiAction.textContent =
      "아직 추천 조치가 없습니다.";
  }
  const scoreValue =
  document.getElementById(
    "careScoreValue"
  );

const scoreBadge =
  document.getElementById(
    "careScoreBadge"
  );

const scoreBar =
  document.getElementById(
    "careScoreBar"
  );

const scoreDescription =
  document.getElementById(
    "careScoreDescription"
  );

const alertCard =
  document.getElementById(
    "careAlertCard"
  );

const alertLevel =
  document.getElementById(
    "careAlertLevel"
  );

const alertText =
  document.getElementById(
    "careAlertText"
  );

    if (scoreValue) {
        scoreValue.textContent = "-";
    }

    if (scoreBadge) {
      scoreBadge.textContent =
        "분석 전";

      scoreBadge.className =
        "care-score-badge score-empty";
    }

    if (scoreBar) {
      scoreBar.style.width = "0%";
    }

    if (scoreDescription) {
      scoreDescription.textContent =
        "관찰 기록을 분석하면 돌봄 상태 점수가 표시됩니다.";
    }

    if (alertCard) {
      alertCard.className =
        "ai-card care-alert-card alert-empty";
    }

    if (alertLevel) {
      alertLevel.textContent =
        "분석 전";
    }

    if (alertText) {
      alertText.textContent =
        "현재 생성된 Care Alert가 없습니다.";
    }
      const carePlanList =
        document.getElementById("carePlanList");

      const carePlanProgressBadge =
        document.getElementById("carePlanProgressBadge");

      const carePlanProgressBar =
        document.getElementById("carePlanProgressBar");

      if (carePlanList) {
        carePlanList.innerHTML = `
          <p class="care-plan-empty">
            AI 분석을 실행하면 Care Plan이 생성됩니다.
          </p>
        `;
      }

      if (carePlanProgressBadge) {
        carePlanProgressBadge.textContent = "0 / 0 완료";
      }

      if (carePlanProgressBar) {
        carePlanProgressBar.style.width = "0%";
      }
}

function deleteTodayAIAnalysisRecords() {
  const today =
    new Date().toLocaleDateString(
      "ko-KR"
    );

  const targetAIEventIds =
    aiRecords
      .filter(
        record =>
          record.residentId ===
            currentResident &&
          record.date === today
      )
      .map(
        record =>
          record.eventId
      )
      .filter(Boolean);

  aiRecords =
    aiRecords.filter(
      record =>
        !(
          record.residentId ===
            currentResident &&
          record.date === today
        )
    );

  events =
    events.filter(event => {
      if (
        event.residentId !==
        currentResident
      ) {
        return true;
      }

      if (event.type !== "ai") {
        return true;
      }

      if (
        targetAIEventIds.includes(
          event.id
        )
      ) {
        return false;
      }

      if (event.date === today) {
        return false;
      }

      return true;
    });

  saveAIRecords();
  saveEvents();
}

function refreshAIAnalysis(
  updateTimeline = false
) {
  const today =
    new Date().toLocaleDateString(
      "ko-KR"
    );

  const todayRecords =
    records.filter(
      record =>
        record.residentId ===
          currentResident &&
        record.date === today
    );

  if (todayRecords.length === 0) {
    resetAIAnalysis();

    if (updateTimeline) {
      deleteTodayAIAnalysisRecords();
    }

    return;
  }

  if (updateTimeline) {
    deleteTodayAIAnalysisRecords();
    generateAIRecord(true);
    return;
  }

  generateAIRecord(false);
}
/* ===========================
   AI Care Score
=========================== */

function calculateCareScore(riskScore) {
  /*
   * 위험점수가 올라갈수록 Care Score는 내려간다.
   * 최저점은 20점으로 제한한다.
   */
  const score =
    Math.max(
      20,
      100 - riskScore * 7
    );

  if (score >= 85) {
    return {
      score,
      level: "안정",
      badgeClass: "score-good",
      barColor: "#22c55e",
      description:
        "현재 관찰 기록상 전반적인 상태가 비교적 안정적입니다."
    };
  }

  if (score >= 70) {
    return {
      score,
      level: "관찰",
      badgeClass: "score-watch",
      barColor: "#eab308",
      description:
        "일부 변화가 확인되어 지속적인 관찰이 필요합니다."
    };
  }

  if (score >= 50) {
    return {
      score,
      level: "주의",
      badgeClass: "score-risk",
      barColor: "#f97316",
      description:
        "여러 위험요인이 확인되어 적극적인 상태 확인과 조치가 필요합니다."
    };
  }

  return {
    score,
    level: "고위험",
    badgeClass: "score-critical",
    barColor: "#ef4444",
    description:
      "중요한 위험요인이 확인되어 즉각적인 확인과 보고가 필요합니다."
  };
}
function renderCareScore(riskScore) {
  const scoreValue =
    document.getElementById(
      "careScoreValue"
    );

  const scoreBadge =
    document.getElementById(
      "careScoreBadge"
    );

  const scoreBar =
    document.getElementById(
      "careScoreBar"
    );

  const scoreDescription =
    document.getElementById(
      "careScoreDescription"
    );

  if (
    !scoreValue ||
    !scoreBadge ||
    !scoreBar ||
    !scoreDescription
  ) {
    return;
  }

  const result =
    calculateCareScore(riskScore);

  scoreValue.textContent =
    result.score;

  scoreBadge.textContent =
    result.level;

  scoreBadge.className =
    `care-score-badge ${result.badgeClass}`;

  scoreBar.style.width =
    `${result.score}%`;

  scoreBar.style.background =
    result.barColor;

  scoreDescription.textContent =
    result.description;
}
/* ===========================
   AI Care Alert
=========================== */

function createCareAlert(
  todayRecords,
  riskScore
) {
  const types =
    todayRecords.map(
      record => record.type
    );

  const hasType = type =>
    types.includes(type);

  const alerts = [];

  /*
   * 낙상 관련 위험조합
   */
  if (
    hasType("낙상위험") &&
    (
      hasType("배회") ||
      hasType("수면장애")
    )
  ) {
    alerts.push(
      "낙상위험과 배회 또는 수면장애가 함께 관찰되어 낙상 고위험 상태로 판단됩니다."
    );
  }

  /*
   * 흡인·호흡 위험조합
   */
  if (
    hasType("기침/가래") &&
    hasType("식사저하")
  ) {
    alerts.push(
      "식사저하와 기침·가래가 함께 관찰되어 흡인, 탈수 또는 영양 저하 위험을 확인해야 합니다."
    );
  }

  /*
   * 행동 안전 위험조합
   */
  if (
    hasType("공격행동") &&
    hasType("거부/저항")
  ) {
    alerts.push(
      "공격행동과 케어 거부가 함께 관찰되어 직원과 다른 어르신의 안전 확보가 필요합니다."
    );
  }

  /*
   * 불안·인지 변화 조합
   */
  if (
    hasType("반복질문") &&
    (
      hasType("배회") ||
      hasType("수면장애")
    )
  ) {
    alerts.push(
      "반복질문과 배회 또는 수면장애가 함께 나타나 불안감이나 인지 상태 변화를 확인할 필요가 있습니다."
    );
  }

  /*
   * 통증과 거부
   */
  if (
    hasType("통증호소") &&
    hasType("거부/저항")
  ) {
    alerts.push(
      "통증호소와 케어 거부가 함께 확인되어 거부 원인이 통증과 관련되는지 평가해야 합니다."
    );
  }

  if (
    riskScore >= 10 &&
    alerts.length === 0
  ) {
    alerts.push(
      "여러 관찰 항목의 위험점수가 높아 간호사 보고와 집중 관찰이 필요합니다."
    );
  }

  let level =
    "정상";

  let className =
    "alert-normal";

  if (
    alerts.length >= 2 ||
    riskScore >= 12
  ) {
    level =
      "긴급";

    className =
      "alert-critical";
  } else if (
    alerts.length === 1 ||
    riskScore >= 8
  ) {
    level =
      "위험";

    className =
      "alert-danger";
  } else if (riskScore >= 4) {
    level =
      "주의";

    className =
      "alert-warning";
  }

  const text =
    alerts.length > 0
      ? alerts.join(" ")
      : "현재 관찰 기록에서 즉각적인 복합 위험 조합은 확인되지 않았습니다.";

  return {
    level,
    className,
    text
  };
}
function renderCareAlert(
  todayRecords,
  riskScore
) {
  const alertCard =
    document.getElementById(
      "careAlertCard"
    );

  const alertLevel =
    document.getElementById(
      "careAlertLevel"
    );

  const alertText =
    document.getElementById(
      "careAlertText"
    );

  if (
    !alertCard ||
    !alertLevel ||
    !alertText
  ) {
    return;
  }

  const result =
    createCareAlert(
      todayRecords,
      riskScore
    );

  alertCard.className =
    `ai-card care-alert-card ${result.className}`;

  alertLevel.textContent =
    result.level;

  alertText.textContent =
    result.text;
}

function generateAIRecord(saveResult = true) {
  const today = new Date().toLocaleDateString("ko-KR");

  const todayRecords = records.filter(
    record =>
      record.residentId === currentResident &&
      record.date === today
  );

  if (todayRecords.length === 0) {
    document.getElementById("aiText").textContent =
      "선택된 관찰 기록이 없습니다.";
    document.getElementById("aiRisk").textContent =
      "아직 분석된 위험도가 없습니다.";
    document.getElementById("aiAction").textContent =
      "아직 추천 조치가 없습니다.";
    return;
  }

  const types = todayRecords.map(r => r.type);

  let sentence = `${residents[currentResident].name}은 금일 `;
  let riskScore = 0;
  let actions = [];

  if (types.includes("식사저하")) {
  const mealRecords = todayRecords.filter(
    record => record.type === "식사저하"
  );

  const detailedMealRecords = mealRecords.filter(
    record => record.summary
  );

  if (detailedMealRecords.length > 0) {
    detailedMealRecords.forEach(record => {
      sentence += `${record.summary} `;
    });
  } else {
    sentence += "평소 대비 식사량 감소가 관찰됨. ";
  }

  riskScore += 2;

  const noIntake = mealRecords.some(
    record =>
      record.details &&
      record.details.amount === "전혀 섭취하지 않음"
  );

  const veryLowIntake = mealRecords.some(
    record =>
      record.details &&
      record.details.amount === "거의 섭취하지 않음"
  );

  const belowHalf = mealRecords.some(
    record =>
      record.details &&
      record.details.amount === "1/2 이하 섭취"
  );

  if (noIntake) {
    riskScore += 3;

    actions.push(
      "식사를 전혀 섭취하지 않아 수분 및 영양 상태를 확인하고 간호사에게 즉시 공유할 필요가 있음."
    );
  } else if (veryLowIntake) {
    riskScore += 2;

    actions.push(
      "식사 섭취량이 매우 적어 대체식 또는 영양보충음료 제공 여부를 확인하고 지속 관찰이 필요함."
    );
  } else if (belowHalf) {
    riskScore += 1;

    actions.push(
      "식사량이 절반 이하로 확인되어 다음 식사의 섭취량과 전반적인 영양 상태를 관찰할 필요가 있음."
    );
  } else {
    actions.push(
      "식사량 감소가 지속되는지 확인하고 필요 시 보호자 및 간호사와 공유할 필요가 있음."
    );
  }
}

  if (types.includes("기침/가래")) {
  const coughRecords =
    todayRecords.filter(
      record =>
        record.type === "기침/가래"
    );

  const detailedCoughRecords =
    coughRecords.filter(
      record => record.summary
    );

  if (detailedCoughRecords.length > 0) {
    detailedCoughRecords.forEach(
      record => {
        sentence +=
          `${record.summary} `;
      }
    );
  } else {
    sentence +=
      "기침 또는 가래 증상이 관찰됨. ";
  }

  riskScore += 2;

  const frequentCough =
    coughRecords.some(
      record =>
        record.details &&
        (
          record.details.frequency ===
            "6회 이상" ||
          record.details.frequency ===
            "지속적으로 반복함"
        )
    );

  const largeSputumAmount =
    coughRecords.some(
      record =>
        record.details &&
        record.details.sputumAmount ===
          "많음"
    );

  const concerningSputumColor =
    coughRecords.some(
      record =>
        record.details &&
        [
          "노란색",
          "녹색",
          "붉은색 또는 피가 섞임"
        ].includes(
          record.details.sputumColor
        )
    );

  const breathingDifficulty =
    coughRecords.some(
      record =>
        record.details &&
        (
          record.details.relatedSymptom ===
            "호흡곤란" ||
          record.details.relatedSymptom ===
            "숨소리 거침" ||
          record.details.relatedSymptom ===
            "흉통"
        )
    );

  const aspirationRisk =
    coughRecords.some(
      record =>
        record.details &&
        (
          record.details.timePeriod ===
            "식사 중" ||
          record.details.relatedSymptom ===
            "식사 중 사레"
        )
    );

  const fever =
    coughRecords.some(
      record =>
        record.details &&
        record.details.relatedSymptom ===
          "발열"
    );

  if (frequentCough) {
    riskScore += 1;

    actions.push(
      "기침이 반복되어 증상 지속 시간과 호흡 상태를 관찰하고 간호사에게 공유할 필요가 있음."
    );
  }

  if (largeSputumAmount) {
    riskScore += 1;

    actions.push(
      "가래 양이 많아 배출 상태와 호흡 불편 여부를 확인하고 수분 제공과 자세 조정이 필요함."
    );
  }

  if (concerningSputumColor) {
    riskScore += 2;

    actions.push(
      "가래 색의 변화가 확인되어 감염 또는 출혈 가능성을 고려해 간호사나 의료진의 확인이 필요함."
    );
  }

  if (breathingDifficulty) {
    riskScore += 3;

    actions.push(
      "호흡곤란 또는 흉부 불편이 동반되어 산소포화도와 활력징후를 확인하고 즉시 간호사에게 보고할 필요가 있음."
    );
  }

  if (aspirationRisk) {
    riskScore += 2;

    actions.push(
      "식사 중 기침이나 사레가 확인되어 식사를 중단하고 연하 상태와 흡인 위험을 확인할 필요가 있음."
    );
  }

  if (fever) {
    riskScore += 2;

    actions.push(
      "발열이 동반되어 감염 가능성을 고려해 체온과 전반적인 상태를 지속 관찰할 필요가 있음."
    );
  }

  if (
    !frequentCough &&
    !largeSputumAmount &&
    !concerningSputumColor &&
    !breathingDifficulty &&
    !aspirationRisk &&
    !fever
  ) {
    actions.push(
      "기침과 가래의 빈도, 양, 색을 지속적으로 관찰하고 증상이 지속되면 간호사에게 공유할 필요가 있음."
    );
  }
}



  if (types.includes("배회")) {
  const wanderingRecords = todayRecords.filter(
    record => record.type === "배회"
  );

  const detailedWanderingRecords = wanderingRecords.filter(
    record => record.summary
  );

  if (detailedWanderingRecords.length > 0) {
    detailedWanderingRecords.forEach(record => {
      sentence += `${record.summary} `;
    });
  } else {
    sentence += "배회 행동이 관찰됨. ";
  }

  riskScore += 2;

  const continuousWandering = wanderingRecords.some(
    record =>
      record.details &&
      record.details.frequency === "지속적"
  );

  const repeatedWandering = wanderingRecords.some(
    record =>
      record.details &&
      record.details.frequency === "반복적"
  );

  const nightWandering = wanderingRecords.some(
    record =>
      record.details &&
      (
        record.details.timePeriod === "야간" ||
        record.details.timePeriod === "새벽"
      )
  );

  const exitSeeking = wanderingRecords.some(
    record =>
      record.details &&
      (
        record.details.location === "출입문 주변" ||
        record.details.behavior === "출입문을 찾음" ||
        record.details.behavior === "귀가하겠다고 말함"
      )
  );

  if (continuousWandering) {
    riskScore += 2;

    actions.push(
      "지속적인 배회가 확인되어 낙상 예방을 위한 동행과 수시 관찰이 필요함."
    );
  } else if (repeatedWandering) {
    riskScore += 1;

    actions.push(
      "반복적인 배회가 확인되어 이동 동선의 위험 요소를 점검하고 관찰할 필요가 있음."
    );
  } else {
    actions.push(
      "배회 행동의 발생 시간과 장소를 지속적으로 관찰할 필요가 있음."
    );
  }

  if (nightWandering) {
    riskScore += 1;

    actions.push(
      "야간 또는 새벽 배회가 확인되어 수면 상태와 낙상 위험을 함께 관찰할 필요가 있음."
    );
  }

  if (exitSeeking) {
    riskScore += 2;

    actions.push(
      "출입문 접근 또는 귀가 요구가 확인되어 무단이탈 예방과 정서적 안정 지원이 필요함."
    );
  }
}




  if (types.includes("반복질문")) {
  const repeatedQuestionRecords =
    todayRecords.filter(
      record =>
        record.type === "반복질문"
    );

  const detailedRecords =
    repeatedQuestionRecords.filter(
      record => record.summary
    );

  if (detailedRecords.length > 0) {
    detailedRecords.forEach(record => {
      sentence += `${record.summary} `;
    });
  } else {
    sentence +=
      "동일 질문을 반복하는 양상이 관찰됨. ";
  }

  riskScore += 1;

  const veryFrequentQuestion =
    repeatedQuestionRecords.some(
      record =>
        record.details &&
        (
          record.details.frequency ===
            "10회 이상" ||
          record.details.frequency ===
            "지속적으로 반복함"
        )
    );

  const returnHomeQuestion =
    repeatedQuestionRecords.some(
      record =>
        record.details &&
        record.details.questionType ===
          "귀가 관련"
    );

  const nightQuestion =
    repeatedQuestionRecords.some(
      record =>
        record.details &&
        (
          record.details.timePeriod ===
            "야간" ||
          record.details.timePeriod ===
            "새벽"
        )
    );

  if (veryFrequentQuestion) {
    riskScore += 1;

    actions.push(
      "질문이 매우 자주 반복되어 불안감, 인지 상태 및 요구 내용을 지속적으로 확인할 필요가 있음."
    );
  } else {
    actions.push(
      "반복질문의 내용과 빈도를 관찰하고 일관된 설명과 정서적 안정 지원이 필요함."
    );
  }

  if (returnHomeQuestion) {
    actions.push(
      "귀가 관련 질문이 반복되어 무단이탈 위험 여부를 확인하고 출입문 주변 관찰이 필요함."
    );
  }

  if (nightQuestion) {
    riskScore += 1;

    actions.push(
      "야간 또는 새벽 반복질문이 확인되어 수면 상태와 불안 요인을 함께 관찰할 필요가 있음."
    );
  }
}

  if (types.includes("수면장애")) {
  const sleepRecords =
    todayRecords.filter(
      record =>
        record.type === "수면장애"
    );

  const detailedSleepRecords =
    sleepRecords.filter(
      record => record.summary
    );

  if (detailedSleepRecords.length > 0) {
    detailedSleepRecords.forEach(
      record => {
        sentence +=
          `${record.summary} `;
      }
    );
  } else {
    sentence +=
      "수면장애 양상이 관찰됨. ";
  }

  riskScore += 2;

  const severeDuration =
    sleepRecords.some(
      record =>
        record.details &&
        (
          record.details.duration ===
            "2시간 이상" ||
          record.details.duration ===
            "밤새 지속됨"
        )
    );

  const frequentAwakening =
    sleepRecords.some(
      record =>
        record.details &&
        (
          record.details.frequency ===
            "6회 이상" ||
          record.details.frequency ===
            "지속적으로 반복함"
        )
    );

  const fallRiskBehavior =
    sleepRecords.some(
      record =>
        record.details &&
        (
          record.details.behavior ===
            "반복적으로 일어남" ||
          record.details.sleepType ===
            "야간 배회" ||
          record.details.behavior ===
            "귀가하려고 함"
        )
    );

  const nurseReported =
    sleepRecords.some(
      record =>
        record.details &&
        record.details.support ===
          "간호사에게 보고"
    );

  if (severeDuration) {
    riskScore += 2;

    actions.push(
      "수면장애가 장시간 지속되어 야간 수면 상태와 다음 날 피로·기면 여부를 확인하고 간호사에게 공유할 필요가 있음."
    );
  }

  if (frequentAwakening) {
    riskScore += 1;

    actions.push(
      "각성이 반복되어 수면 방해 요인, 배뇨 요구, 통증 및 불안 여부를 확인할 필요가 있음."
    );
  }

  if (fallRiskBehavior) {
    riskScore += 2;

    actions.push(
      "야간 이동 또는 반복적인 기상이 확인되어 낙상 예방을 위한 동행과 주변 환경 점검이 필요함."
    );
  }

  if (!severeDuration && !frequentAwakening) {
    actions.push(
      "수면 시간대와 각성 횟수를 지속 관찰하고 조명·소음 등 수면 환경을 점검할 필요가 있음."
    );
  }

  if (nurseReported) {
    actions.push(
      "간호사에게 보고한 이후 추가 지시와 상태 변화를 확인할 필요가 있음."
    );
  }
}

  if (types.includes("통증호소")) {
  const painRecords = todayRecords.filter(
    record => record.type === "통증호소"
  );

  const detailedPainRecords = painRecords.filter(
    record => record.summary
  );

  if (detailedPainRecords.length > 0) {
    detailedPainRecords.forEach(record => {
      sentence += `${record.summary} `;
    });
  } else {
    sentence += "통증 호소가 확인됨. ";
  }

  riskScore += 3;

  const severePain = painRecords.some(
    record =>
      record.details &&
      (
        record.details.intensity === "심함" ||
        record.details.intensity === "매우 심함"
      )
  );

  if (severePain) {
    riskScore += 2;

    actions.push(
      "심한 통증이 확인되어 통증 부위와 상태를 즉시 간호사에게 공유하고 의료적 확인이 필요함."
    );
  } else {
    actions.push(
      "통증 부위와 강도를 지속 관찰하고 간호사에게 공유할 필요가 있음."
    );
  }
}



  if (types.includes("거부/저항")) {
  const refusalRecords =
    todayRecords.filter(
      record =>
        record.type === "거부/저항"
    );

  const detailedRefusalRecords =
    refusalRecords.filter(
      record => record.summary
    );

  if (detailedRefusalRecords.length > 0) {
    detailedRefusalRecords.forEach(
      record => {
        sentence +=
          `${record.summary} `;
      }
    );
  } else {
    sentence +=
      "케어 과정에서 거부 또는 저항 반응이 관찰됨. ";
  }

  riskScore += 2;

  const strongRefusal =
    refusalRecords.some(
      record =>
        record.details &&
        (
          record.details.intensity ===
            "강함" ||
          record.details.intensity ===
            "매우 강함"
        )
    );

  const repeatedRefusal =
    refusalRecords.some(
      record =>
        record.details &&
        (
          record.details.frequency ===
            "6회 이상" ||
          record.details.frequency ===
            "지속적으로 반복함"
        )
    );

  const essentialCareRefusal =
    refusalRecords.some(
      record =>
        record.details &&
        [
          "식사 지원",
          "투약",
          "간호 처치",
          "기저귀 교환",
          "배변·배뇨 지원"
        ].includes(
          record.details.careType
        )
    );

  const careNotCompleted =
    refusalRecords.some(
      record =>
        record.details &&
        (
          record.details.retryResult ===
            "계속 거부하여 중단함" ||
          record.details.retryResult ===
            "재시도하지 않음"
        )
    );

  const aggressiveResistance =
    refusalRecords.some(
      record =>
        record.details &&
        (
          record.details.behavior ===
            "손으로 밀어냄" ||
          record.details.behavior ===
            "욕설 또는 위협적인 말을 함" ||
          record.details.behavior ===
            "직원의 손을 잡거나 뿌리침"
        )
    );

  if (strongRefusal) {
    riskScore += 2;

    actions.push(
      "강한 거부 반응이 확인되어 즉시 강행하지 말고 원인과 통증 여부를 확인한 뒤 접근 방식을 조정할 필요가 있음."
    );
  }

  if (repeatedRefusal) {
    riskScore += 1;

    actions.push(
      "거부가 반복되어 발생 시간, 케어 종류, 접근한 직원과 유발 요인을 기록하고 일관된 대응이 필요함."
    );
  }

  if (essentialCareRefusal) {
    riskScore += 2;

    actions.push(
      "식사·투약·배설·간호 처치와 같은 필수 케어가 거부되어 간호사에게 공유하고 대체 방법과 재시도 계획을 확인할 필요가 있음."
    );
  }

  if (careNotCompleted) {
    riskScore += 1;

    actions.push(
      "필요한 케어가 완료되지 않아 다음 근무자에게 인계하고 재시도 시점과 방법을 기록할 필요가 있음."
    );
  }

  if (aggressiveResistance) {
    riskScore += 2;

    actions.push(
      "신체적 또는 위협적인 저항이 확인되어 안전거리를 확보하고 다른 직원의 지원을 받아 접근할 필요가 있음."
    );
  }

  if (
    !strongRefusal &&
    !repeatedRefusal &&
    !essentialCareRefusal &&
    !careNotCompleted &&
    !aggressiveResistance
  ) {
    actions.push(
      "거부 원인을 확인하고 충분히 설명한 뒤 정서적 안정 후 선호하는 방식으로 재시도할 필요가 있음."
    );
  }
}

  if (types.includes("공격행동")) {
  const aggressionRecords =
    todayRecords.filter(
      record =>
        record.type === "공격행동"
    );

  const detailedAggressionRecords =
    aggressionRecords.filter(
      record => record.summary
    );

  if (
    detailedAggressionRecords.length > 0
  ) {
    detailedAggressionRecords.forEach(
      record => {
        sentence +=
          `${record.summary} `;
      }
    );
  } else {
    sentence +=
      "공격적 언행 또는 행동이 관찰됨. ";
  }

  riskScore += 3;

  const highRiskBehavior =
    aggressionRecords.some(
      record =>
        record.details &&
        (
          record.details.riskLevel ===
            "높음" ||
          record.details.riskLevel ===
            "매우 높음"
        )
    );

  const repeatedBehavior =
    aggressionRecords.some(
      record =>
        record.details &&
        (
          record.details.frequency ===
            "6회 이상" ||
          record.details.frequency ===
            "지속적으로 반복함"
        )
    );

  const physicalAttack =
    aggressionRecords.some(
      record =>
        record.details &&
        [
          "손으로 밀침",
          "때리려고 함",
          "발로 차려고 함",
          "물건을 던짐",
          "물건을 내리침",
          "침을 뱉음",
          "꼬집거나 할퀴려고 함"
        ].includes(
          record.details.behaviorType
        )
    );

  const injuryOccurred =
    aggressionRecords.some(
      record =>
        record.details &&
        record.details.injury !==
          "상해 없음"
    );

  const vulnerableTarget =
    aggressionRecords.some(
      record =>
        record.details &&
        (
          record.details.target ===
            "다른 어르신" ||
          record.details.target ===
            "본인"
        )
    );

  if (highRiskBehavior) {
    riskScore += 3;

    actions.push(
      "위험도가 높은 공격행동이 확인되어 안전거리를 확보하고 주변 인원을 분리하며 간호사에게 즉시 보고할 필요가 있음."
    );
  }

  if (repeatedBehavior) {
    riskScore += 2;

    actions.push(
      "공격행동이 반복되어 유발 상황과 시간대, 선행 행동을 기록하고 지속적인 관찰이 필요함."
    );
  }

  if (physicalAttack) {
    riskScore += 2;

    actions.push(
      "신체적 공격행동이 확인되어 직원과 타 어르신의 안전을 우선 확보하고 위험 물건을 제거할 필요가 있음."
    );
  }

  if (injuryOccurred) {
    riskScore += 3;

    actions.push(
      "상해 가능성이 확인되어 상처와 통증 여부를 확인하고 필요한 경우 즉시 의료적 평가를 요청해야 함."
    );
  }

  if (vulnerableTarget) {
    riskScore += 1;

    actions.push(
      "다른 어르신 또는 본인을 향한 행동이 확인되어 대상자 분리와 추가 사고 예방 조치가 필요함."
    );
  }

  if (
    !highRiskBehavior &&
    !repeatedBehavior &&
    !physicalAttack &&
    !injuryOccurred
  ) {
    actions.push(
      "공격행동의 유발 요인을 줄이고 정서적 안정 지원 후 행동 변화를 지속 관찰할 필요가 있음."
    );
  }
}

  if (types.includes("낙상위험")) {
  const fallRiskRecords =
    todayRecords.filter(
      record =>
        record.type === "낙상위험"
    );

  const detailedFallRiskRecords =
    fallRiskRecords.filter(
      record => record.summary
    );

  if (detailedFallRiskRecords.length > 0) {
    detailedFallRiskRecords.forEach(
      record => {
        sentence +=
          `${record.summary} `;
      }
    );
  } else {
    sentence +=
      "낙상 위험 행동이 관찰됨. ";
  }

  riskScore += 4;

  const unstableGait =
    fallRiskRecords.some(
      record =>
        record.details &&
        (
          record.details.gaitStatus ===
            "휘청거림" ||
          record.details.gaitStatus ===
            "직원 부축 필요"
        )
    );

  const noAssistiveDevice =
    fallRiskRecords.some(
      record =>
        record.details &&
        record.details.assistiveDevice ===
          "사용하지 않음"
    );

  const nearFall =
    fallRiskRecords.some(
      record =>
        record.details &&
        (
          record.details.fallOccurred ===
            "넘어질 뻔함" ||
          record.details.fallOccurred ===
            "바닥에 주저앉음"
        )
    );

  const actualFall =
    fallRiskRecords.some(
      record =>
        record.details &&
        record.details.fallOccurred ===
          "실제 낙상함"
    );

  const injuryOccurred =
    fallRiskRecords.some(
      record =>
        record.details &&
        record.details.injury !==
          "상해 없음"
    );

  const nightRisk =
    fallRiskRecords.some(
      record =>
        record.details &&
        (
          record.details.timePeriod ===
            "야간" ||
          record.details.timePeriod ===
            "새벽"
        )
    );

  if (unstableGait) {
    riskScore += 2;

    actions.push(
      "보행 불안정이 확인되어 이동 시 직원 동행과 부축이 필요하며 보조기구 상태를 점검할 필요가 있음."
    );
  }

  if (noAssistiveDevice) {
    riskScore += 1;

    actions.push(
      "보조기구 없이 이동하려는 위험이 있어 반복 안내와 가까운 위치에 보조기구를 배치할 필요가 있음."
    );
  }

  if (nearFall) {
    riskScore += 2;

    actions.push(
      "낙상 직전 상황이 확인되어 당시 이동 동선과 환경 요인을 점검하고 예방 조치를 강화할 필요가 있음."
    );
  }

  if (actualFall) {
    riskScore += 4;

    actions.push(
      "실제 낙상이 발생하여 움직임을 최소화하고 통증·의식·상해 여부를 확인한 뒤 즉시 간호사와 의료진에게 보고해야 함."
    );
  }

  if (injuryOccurred) {
    riskScore += 3;

    actions.push(
      "상해 또는 통증이 확인되어 부위와 정도를 확인하고 필요한 의료적 평가를 요청해야 함."
    );
  }

  if (nightRisk) {
    riskScore += 1;

    actions.push(
      "야간 또는 새벽 낙상 위험이 확인되어 조명, 침상 주변 환경, 화장실 이동 동선을 점검할 필요가 있음."
    );
  }

  if (
    !unstableGait &&
    !noAssistiveDevice &&
    !nearFall &&
    !actualFall &&
    !injuryOccurred &&
    !nightRisk
  ) {
    actions.push(
      "침상·휠체어·보행 동선을 점검하고 이동 시 낙상 예방을 위한 관찰과 안내가 필요함."
    );
  }
}

  let riskText = "";

  if (riskScore >= 6) {
    riskText = "위험";
  } else if (riskScore >= 3) {
    riskText = "주의";
  } else {
    riskText = "관찰";
  }

  document.getElementById("aiText").textContent = sentence;
  document.getElementById("aiRisk").textContent =
    `${riskText} 단계 / 위험점수 ${riskScore}점`;

  document.getElementById("aiAction").innerHTML =
    actions.map(action => `• ${action}`).join("<br>");
  renderCareScore(riskScore);

  renderCareAlert(
    todayRecords,
    riskScore
  );

  renderCarePlan(todayRecords);

    if (saveResult) {
    saveAIRecord(false);
  }
}




function saveAIRecord(showAlert = true) {
  const aiTextElement =
    document.getElementById("aiText");

  const aiRiskElement =
    document.getElementById("aiRisk");

  const aiActionElement =
    document.getElementById("aiAction");

  if (
    !aiTextElement ||
    !aiRiskElement ||
    !aiActionElement
  ) {
    console.error(
      "AI 분석 결과 요소를 찾을 수 없습니다."
    );
    return;
  }

  const aiText =
    aiTextElement.textContent.trim();

  const aiRisk =
    aiRiskElement.textContent.trim();

  const aiAction =
    aiActionElement.innerText.trim();

  /*
   * 실제 AI 분석 결과가 없으면 저장하지 않음
   */
  if (
    aiText === "아직 생성된 기록이 없습니다." ||
    aiText === "선택된 관찰 기록이 없습니다." ||
    !aiText
  ) {
    if (showAlert) {
      alert("먼저 AI 기록을 생성해주세요.");
    }

    return;
  }

  const resident =
    residents[currentResident];

  if (!resident) {
    alert("선택된 어르신 정보를 찾을 수 없습니다.");
    return;
  }

  const now =
    new Date();

  /*
   * Timeline용 AI 이벤트 생성
   */
  const timelineEvent = createEvent({
    type: "ai",
    residentId: currentResident,
    residentName: resident.name,
    title: "AI 상태분석",
    body: aiText,
    risk: aiRisk,
    action: aiAction
  });

  /*
   * 저장 AI 기록 생성
   */
  const record = {
    id:
      "ai_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(16)
        .slice(2),

    eventId:
      timelineEvent.id,

    residentId:
      currentResident,

    residentName:
      resident.name,

    date:
      now.toLocaleDateString("ko-KR"),

    time:
      now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit"
      }),

    timestamp:
      now.getTime(),

    text:
      aiText,

    risk:
      aiRisk,

    action:
      aiAction
  };

  /*
   * AI 기록은 한 번만 추가
   */
  aiRecords.push(record);
  saveAIRecords();

  /*
   * 관련 화면 갱신
   */
  refreshAllViews();

  if (showAlert) {
    alert("AI 기록이 저장되었습니다.");
  }
}
function deleteAIRecord(index) {
  const targetRecord =
    aiRecords[index];

  if (!targetRecord) {
    alert(
      "삭제할 AI 기록을 찾을 수 없습니다."
    );
    return;
  }

  const ok =
    confirm(
      "이 AI 기록을 삭제하시겠습니까?"
    );

  if (!ok) return;

  /*
   * 연결된 Timeline AI 이벤트도 삭제
   */
  if (targetRecord.eventId) {
    events =
      events.filter(
        event =>
          event.id !==
          targetRecord.eventId
      );

    saveEvents();
  }

  aiRecords.splice(index, 1);
  saveAIRecords();

  if (
    typeof renderSavedAIRecords ===
    "function"
  ) {
    renderSavedAIRecords();
  }

  refreshAllViews();

  alert(
    "AI 기록이 삭제되었습니다."
  );
}
function renderSavedAIRecords() {
  const list =
    document.getElementById(
      "savedAIList"
    );

  if (!list) {
    return;
  }

  list.innerHTML = "";

  const filtered =
    aiRecords
      .map(
        (record, index) => ({
          ...record,
          originalIndex: index
        })
      )
      .filter(
        record =>
          record.residentId ===
          currentResident
      );

  if (filtered.length === 0) {
    const li =
      document.createElement("li");

    li.textContent =
      "저장된 AI 기록이 없습니다.";

    list.appendChild(li);
    return;
  }

  filtered.forEach(record => {
    const li =
      document.createElement("li");

    li.innerHTML = `
      <strong>
        ${escapeHTML(record.date)}
        ${escapeHTML(record.time)}
      </strong>
      <br>

      ${escapeHTML(record.text)}
      <br>

      <strong>위험도:</strong>
      ${escapeHTML(record.risk)}
      <br>

      <strong>추천 조치:</strong>
      <br>

      ${escapeHTML(record.action)}
      <br>

      <button
        type="button"
        onclick="
          deleteAIRecord(
            ${record.originalIndex}
          )
        "
      >
        삭제
      </button>
    `;

    list.appendChild(li);
  });
}

let selectedCarePlan = null;

function createCarePlan(todayRecords) {
  const plans = [];

  const hasType = (type) =>
    todayRecords.some((record) => record.type === type);

  if (hasType("식사저하")) {
    plans.push({
      id: "meal-check",
      priority: 1,
      title: "식사량과 수분 섭취량을 재확인합니다.",
      source: "식사저하"
    });
  }

  if (hasType("기침/가래")) {
    plans.push({
      id: "cough-check",
      priority: 1,
      title: "식사 중 사레와 기침 여부를 관찰합니다.",
      source: "기침/가래"
    });
  }

  if (hasType("낙상위험")) {
    plans.push({
      id: "fall-prevention",
      priority: 1,
      title: "이동 시 직원이 동행하고 주변 환경을 정리합니다.",
      source: "낙상위험"
    });
  }

  if (hasType("배회")) {
    plans.push({
      id: "wandering-check",
      priority: 2,
      title: "배회 시간과 장소를 확인하고 안전하게 안내합니다.",
      source: "배회"
    });
  }

  if (hasType("수면장애")) {
    plans.push({
      id: "sleep-check",
      priority: 2,
      title: "야간 수면 상태와 낮 시간 졸림 여부를 확인합니다.",
      source: "수면장애"
    });
  }

  if (hasType("통증호소")) {
    plans.push({
      id: "pain-check",
      priority: 1,
      title: "통증 부위와 강도를 재평가하고 간호사에게 보고합니다.",
      source: "통증호소"
    });
  }

  if (hasType("반복질문")) {
    plans.push({
      id: "question-support",
      priority: 3,
      title: "불안 요인을 확인하고 반복적으로 안정감을 제공합니다.",
      source: "반복질문"
    });
  }

  if (hasType("거부/저항")) {
    plans.push({
      id: "refusal-support",
      priority: 2,
      title: "거부 원인을 확인하고 충분한 설명 후 다시 시도합니다.",
      source: "거부/저항"
    });
  }

  if (hasType("공격행동")) {
    plans.push({
      id: "aggression-safety",
      priority: 1,
      title: "주변 안전을 확보하고 자극을 최소화합니다.",
      source: "공격행동"
    });
  }

  return plans.sort((a, b) => a.priority - b.priority);
}

function renderCarePlan(todayRecords) {
  const listElement =
    document.getElementById("carePlanList");

  const badgeElement =
    document.getElementById("carePlanProgressBadge");

  const barElement =
    document.getElementById("carePlanProgressBar");

  if (
    !listElement ||
    !badgeElement ||
    !barElement
  ) {
    return;
  }

  const plans =
    createCarePlan(todayRecords);

  if (plans.length === 0) {
    listElement.innerHTML = `
      <p class="care-plan-empty">
        생성된 Care Plan이 없습니다.
      </p>
    `;

    badgeElement.textContent =
      "0 / 0 완료";

    barElement.style.width =
      "0%";

    return;
  }

  listElement.innerHTML = plans
    .map((plan, index) => {
      return `
        <div class="care-plan-item">
          <input
            type="checkbox"
            id="carePlanCheckbox-${plan.id}"
            data-care-plan-id="${plan.id}"
            onchange="updateCarePlanProgress()"
          />

          <div class="care-plan-item-content">
            <label
              for="carePlanCheckbox-${plan.id}"
              class="care-plan-item-title"
            >
              ${plan.title}
            </label>

            <div class="care-plan-item-meta">
              <span class="care-plan-priority">
                우선순위 ${index + 1}
              </span>

              <span class="care-plan-source">
                ${plan.source}
              </span>
            </div>

            <button
              type="button"
              class="care-plan-action-btn"
              data-plan-id="${plan.id}"
            >
              조치 기록
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  const actionButtons =
    listElement.querySelectorAll(
      ".care-plan-action-btn"
    );

  actionButtons.forEach((button) => {
    button.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const planId =
          button.dataset.planId;

        const selectedPlan =
          plans.find(
            plan =>
              plan.id === planId
          );

        if (!selectedPlan) {
          console.error(
            "선택한 Care Plan을 찾을 수 없습니다."
          );
          return;
        }

        openCarePlanActionModal(
          selectedPlan.id,
          selectedPlan.title,
          selectedPlan.source
        );
      }
    );
  });

  updateCarePlanProgress();
}

function updateCarePlanProgress() {
  const checkboxes = document.querySelectorAll(
    "#carePlanList input[type='checkbox']"
  );

  const badgeElement = document.getElementById("carePlanProgressBadge");
  const barElement = document.getElementById("carePlanProgressBar");

  if (!badgeElement || !barElement) {
    return;
  }

  const total = checkboxes.length;

  const completed = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  ).length;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  badgeElement.textContent = `${completed} / ${total} 완료`;
  barElement.style.width = `${progress}%`;

  checkboxes.forEach((checkbox) => {
    const item = checkbox.closest(".care-plan-item");

    if (!item) {
      return;
    }

    item.classList.toggle(
      "completed",
      checkbox.checked
    );
  });
}
window.openCarePlanActionModal = function (
  planId,
  planTitle,
  planSource
) {
  const actionModal =
    document.getElementById("actionModal");

  if (!actionModal) {
    console.error(
      "actionModal 요소를 찾을 수 없습니다."
    );
    return;
  }

  /*
   * Care Plan의 원인이 된 관찰 Timeline 이벤트 찾기
   */
  const matchingEvents = events
    .filter((event) => {
      const sameResident =
        event.residentId === currentResident;

      const sameObservation =
        event.title === planSource ||
        event.observationType === planSource ||
        event.recordType === planSource;

      const isObservationEvent =
        event.type !== "ai" &&
        event.type !== "action";

      return (
        sameResident &&
        sameObservation &&
        isObservationEvent
      );
    })
    .sort((a, b) => {
      const timeA =
        a.timestamp || a.createdAt || 0;

      const timeB =
        b.timestamp || b.createdAt || 0;

      return timeB - timeA;
    });

  const parentEvent =
    matchingEvents[0];

  if (!parentEvent) {
    alert(
      `${planSource} 관찰 기록을 찾을 수 없습니다.\n` +
      "관찰 기록을 저장한 후 다시 시도해주세요."
    );

    console.error(
      "Care Plan 연결 관찰 기록 없음:",
      {
        planId,
        planSource,
        currentResident,
        events
      }
    );

    return;
  }

  /*
   * 기존 조치 저장 함수가 사용할 연결 ID
   */
  currentActionParentEventId =
    parentEvent.id;

  selectedCarePlan = {
    id: planId,
    title: planTitle,
    source: planSource,
    parentEventId: parentEvent.id
  };

  const actionModalTitle =
    document.getElementById(
      "actionModalTitle"
    );

  const actionType =
    document.getElementById(
      "careActionType"
    );

  const actionEtc =
    document.getElementById(
      "careActionEtc"
    );

  const actionNote =
    document.getElementById(
      "careActionNote"
    );

  const actionEtcField =
    document.getElementById(
      "actionEtcField"
    );

  if (actionModalTitle) {
    actionModalTitle.textContent =
      `${planSource} AI Care Plan 조치 기록`;
  }

  if (actionType) {
    actionType.value = "";
  }

  if (actionEtc) {
    actionEtc.value = "";
  }

  if (actionNote) {
    actionNote.value =
      `AI Care Plan: ${planTitle}`;
  }

  if (actionEtcField) {
    actionEtcField.style.display =
      "none";
  }

  actionModal.classList.add("show");
};