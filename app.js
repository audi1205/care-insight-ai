/* Care Insight Portal - app.js 정리본 */

/* ===========================
   관찰 기록
=========================== */

let records = JSON.parse(localStorage.getItem("careRecords")) || [];

/* ===========================
   Observation Engine
=========================== */

let currentObservationType = null;

/*
 * 관찰 항목별 입력 구조
 *
 * 새로운 관찰 항목을 추가할 때는
 * 이 객체에 Schema만 추가하면 된다.
 */
const observationSchemas = {
  "통증호소": {
    title: "통증호소 상세 기록",

    fields: [
      {
        id: "bodyPart",
        label: "통증 부위",
        type: "select",
        required: true,
        options: [
          "머리",
          "목",
          "어깨",
          "팔",
          "손",
          "가슴",
          "복부",
          "허리",
          "엉덩이",
          "무릎",
          "다리",
          "발",
          "기타"
        ]
      },
      {
        id: "side",
        label: "통증 방향",
        type: "select",
        required: true,
        options: [
          "왼쪽",
          "오른쪽",
          "양쪽",
          "중앙",
          "구분 어려움"
        ]
      },
      {
        id: "intensity",
        label: "통증 강도",
        type: "select",
        required: true,
        options: [
          "약함",
          "보통",
          "심함",
          "매우 심함"
        ]
      },
      {
        id: "situation",
        label: "발생 상황",
        type: "select",
        required: true,
        options: [
          "안정 중",
          "움직일 때",
          "보행할 때",
          "식사 중",
          "체위 변경 시",
          "케어 중",
          "기타 상황"
        ]
      },
      {
        id: "note",
        label: "추가 내용",
        type: "textarea",
        required: false,
        placeholder:
          "통증을 호소한 말이나 표정, 행동 등을 입력해주세요."
      }
    ],

    buildSummary(values) {
      let summary =
        `${values.situation} ${values.side} ` +
        `${values.bodyPart} 부위에 ${values.intensity} 통증을 호소함.`;

      if (values.note) {
        summary += ` 추가 관찰: ${values.note}`;
      }

      return summary;
    }
  },

  "식사저하": {
    title: "식사저하 상세 기록",

    fields: [
      {
        id: "mealType",
        label: "식사 구분",
        type: "select",
        required: true,
        options: [
          "아침",
          "점심",
          "저녁",
          "간식"
        ]
      },
      {
        id: "amount",
        label: "섭취량",
        type: "select",
        required: true,
        options: [
          "전량 섭취",
          "1/2 이상 섭취",
          "1/2 이하 섭취",
          "거의 섭취하지 않음",
          "전혀 섭취하지 않음"
        ]
      },
      {
        id: "foodType",
        label: "제공 식이",
        type: "select",
        required: false,
        options: [
          "일반식",
          "죽",
          "미음",
          "연식",
          "다진식",
          "유동식",
          "영양보충음료",
          "기타"
        ]
      },
      {
         id: "foodTypeEtc",
         label: "기타 제공 식이",
         type: "text",
         required: true,
         placeholder: "제공한 식이를 입력해주세요.",
          showWhen: {
          field: "foodType",
         equals: "기타"
         }
      },

      {
        id: "reason",
        label: "식사 저하 사유",
        type: "select",
        required: false,
        options: [
          "식욕 없음",
          "반찬 기호에 맞지 않음",
          "통증 호소",
          "기침 또는 가래",
          "연하 불편",
          "졸림 또는 기면",
          "식사 거부",
          "원인 확인 어려움",
          "기타"
        ]
      },
      {
        id: "reasonEtc",
        label: "기타 식사 저하 사유",
        type: "text",
        required: true,
        placeholder: "식사 저하 사유를 입력해주세요.",
        showWhen: {
        field: "reason",
        equals: "기타"
        }
      },
      
      {
        id: "note",
        label: "추가 내용",
        type: "textarea",
        required: false,
        placeholder:
          "대체식 제공, 격려 여부, 어르신의 표현 등을 입력해주세요."
      }
    ],

    buildSummary(values) {
  let amountText = "";

  switch (values.amount) {
    case "전량 섭취":
      amountText = "전량 섭취함";
      break;

    case "1/2 이상 섭취":
      amountText = "절반 이상 섭취함";
      break;

    case "1/2 이하 섭취":
      amountText = "절반 이하 섭취함";
      break;

    case "거의 섭취하지 않음":
      amountText = "거의 섭취하지 않음";
      break;

    case "전혀 섭취하지 않음":
      amountText = "전혀 섭취하지 않음";
      break;

    default:
      amountText = values.amount;
  }

  let summary =
    `${values.mealType} 식사를 ${amountText}.`;

  if (values.foodType) {
  const foodTypeText =
    values.foodType === "기타"
      ? values.foodTypeEtc
      : values.foodType;

  summary += ` 제공 식이는 ${foodTypeText}임.`;
}

if (values.reason) {
  const reasonText =
    values.reason === "기타"
      ? values.reasonEtc
      : values.reason;

  summary +=
    ` 식사 저하 사유는 ${reasonText}으로 확인됨.`;
}

  if (values.note) {
    summary += ` 추가 관찰: ${values.note}`;
  }

  return summary;
}
  },

"배회": {
  title: "배회 상세 기록",

  fields: [
    {
      id: "location",
      label: "발생 공간",
      type: "select",
      required: true,
      options: [
        "침실",
        "생활실",
        "프로그램실",
        "복도",
        "화장실 주변",
        "출입문 주변",
        "식당",
        "기타"
      ]
    },
    {
       id: "locationEtc",
      label: "기타 발생 공간",
      type: "text",
      required: true,
      placeholder: "배회가 발생한 공간을 입력해주세요.",
      showWhen: {
      field: "location",
      equals: "기타"
       }
    },
    {
      id: "timePeriod",
      label: "발생 시간대",
      type: "select",
      required: true,
      options: [
        "오전",
        "오후",
        "저녁",
        "야간",
        "새벽"
      ]
    },
    {
      id: "frequency",
      label: "배회 빈도",
      type: "select",
      required: true,
      options: [
        "1회",
        "2~3회",
        "4~5회",
        "반복적",
        "지속적"
      ]
    },
    {
      id: "behavior",
      label: "배회 행동",
      type: "select",
      required: false,
      options: [
        "목적 없이 이동함",
        "특정 장소를 반복적으로 오감",
        "출입문을 찾음",
        "가족을 찾음",
        "귀가하겠다고 말함",
        "다른 어르신 방에 들어감",
        "물건을 찾으며 이동함",
        "기타"
      ]
    },
    {
  id: "behaviorEtc",
  label: "기타 배회 행동",
  type: "text",
  required: true,
  placeholder: "구체적인 배회 행동을 입력해주세요.",
  showWhen: {
    field: "behavior",
    equals: "기타"
  }
},
    {
      id: "support",
      label: "직원 대응",
      type: "select",
      required: false,
      options: [
        "말벗 및 정서적 안정 지원",
        "생활실로 안내",
        "침실로 안내",
        "프로그램 참여 유도",
        "화장실 이용 지원",
        "낙상 예방을 위해 동행",
        "지속 관찰",
        "기타"
      ]
    },
    {
  id: "supportEtc",
  label: "기타 직원 대응",
  type: "text",
  required: true,
  placeholder: "직원이 실시한 대응을 입력해주세요.",
  showWhen: {
    field: "support",
    equals: "기타"
  }
},
    {
      id: "note",
      label: "추가 내용",
      type: "textarea",
      required: false,
      placeholder:
        "배회 당시 어르신의 말, 표정, 행동과 특이사항을 입력해주세요."
    }
  ],

buildSummary(values) {
  const locationText =
    values.location === "기타"
      ? values.locationEtc
      : values.location;

  let summary =
    `${values.timePeriod} ${locationText}에서 ` +
    `${values.frequency} 배회 행동이 관찰됨.`;

  if (values.behavior) {
    const behaviorText =
      values.behavior === "기타"
        ? values.behaviorEtc
        : values.behavior;

    summary +=
      ` 구체적인 행동은 '${behaviorText}'으로 확인됨.`;
  }

  if (values.support) {
    const supportText =
      values.support === "기타"
        ? values.supportEtc
        : values.support;

    summary +=
      ` 직원은 ${supportText}을 실시함.`;
  }

  if (values.note) {
    summary += ` 추가 관찰: ${values.note}`;
  }

  return summary;
}
  },

    "반복질문": {
    title: "반복질문 상세 기록",

    fields: [
      {
        id: "questionContent",
        label: "반복한 질문 내용",
        type: "textarea",
        required: true,
        placeholder:
          "예: 아들이 언제 오나요?, 집에 언제 가나요?"
      },
      {
        id: "questionType",
        label: "질문 유형",
        type: "select",
        required: true,
        options: [
          "가족 관련",
          "귀가 관련",
          "식사 관련",
          "시간 또는 날짜 관련",
          "물건 찾기",
          "일정 또는 프로그램 관련",
          "신체 불편 관련",
          "기타"
        ]
      },
      {
        id: "questionTypeEtc",
        label: "기타 질문 유형",
        type: "text",
        required: true,
        placeholder:
          "질문 유형을 입력해주세요.",
        showWhen: {
          field: "questionType",
          equals: "기타"
        }
      },
      {
        id: "frequency",
        label: "반복 횟수",
        type: "select",
        required: true,
        options: [
          "2~3회",
          "4~5회",
          "6~10회",
          "10회 이상",
          "지속적으로 반복함",
          "정확한 횟수 확인 어려움"
        ]
      },
      {
        id: "timePeriod",
        label: "발생 시간대",
        type: "select",
        required: true,
        options: [
          "오전",
          "오후",
          "저녁",
          "야간",
          "새벽"
        ]
      },
      {
        id: "location",
        label: "발생 장소",
        type: "select",
        required: true,
        options: [
          "침실",
          "생활실",
          "프로그램실",
          "복도",
          "식당",
          "화장실 주변",
          "기타"
        ]
      },
      {
        id: "locationEtc",
        label: "기타 발생 장소",
        type: "text",
        required: true,
        placeholder:
          "질문이 반복된 장소를 입력해주세요.",
        showWhen: {
          field: "location",
          equals: "기타"
        }
      },
      {
        id: "support",
        label: "직원 대응",
        type: "select",
        required: false,
        options: [
          "현재 상황을 반복 설명함",
          "가족 방문 일정을 안내함",
          "달력 또는 시계를 보여드림",
          "다른 활동으로 관심을 전환함",
          "말벗 및 정서적 안정 지원",
          "요구 내용을 확인함",
          "지속 관찰함",
          "기타"
        ]
      },
      {
        id: "supportEtc",
        label: "기타 직원 대응",
        type: "text",
        required: true,
        placeholder:
          "직원이 실시한 대응을 입력해주세요.",
        showWhen: {
          field: "support",
          equals: "기타"
        }
      },
      {
        id: "note",
        label: "추가 관찰",
        type: "textarea",
        required: false,
        placeholder:
          "질문 당시 어르신의 표정, 감정, 반응 등을 입력해주세요."
      }
    ],

    buildSummary(values) {
      const questionTypeText =
        values.questionType === "기타"
          ? values.questionTypeEtc
          : values.questionType;

      const locationText =
        values.location === "기타"
          ? values.locationEtc
          : values.location;

      let summary =
        `${values.timePeriod} ${locationText}에서 ` +
        `"${values.questionContent}"라는 질문을 ` +
        `${values.frequency} 반복함. ` +
        `질문 유형은 ${questionTypeText}으로 확인됨.`;

      if (values.support) {
        const supportText =
          values.support === "기타"
            ? values.supportEtc
            : values.support;

        summary +=
          ` 직원은 ${supportText}.`;
      }

      if (values.note) {
        summary +=
          ` 추가 관찰: ${values.note}`;
      }

      return summary;
    }
  },
    "수면장애": {
    title: "수면장애 상세 기록",

    fields: [
      {
        id: "sleepType",
        label: "수면 문제 유형",
        type: "select",
        required: true,
        options: [
          "잠들기 어려움",
          "자주 깸",
          "새벽에 일찍 깸",
          "밤낮이 바뀜",
          "야간 배회",
          "잠꼬대 또는 큰소리",
          "침상에서 반복적으로 일어남",
          "기타"
        ]
      },
      {
        id: "sleepTypeEtc",
        label: "기타 수면 문제",
        type: "text",
        required: true,
        placeholder:
          "구체적인 수면 문제를 입력해주세요.",
        showWhen: {
          field: "sleepType",
          equals: "기타"
        }
      },
      {
        id: "timePeriod",
        label: "발생 시간대",
        type: "select",
        required: true,
        options: [
          "저녁",
          "야간",
          "새벽",
          "오전",
          "낮잠 시간"
        ]
      },
      {
        id: "duration",
        label: "지속 시간",
        type: "select",
        required: true,
        options: [
          "30분 미만",
          "30분~1시간",
          "1~2시간",
          "2시간 이상",
          "밤새 지속됨",
          "정확한 시간 확인 어려움"
        ]
      },
      {
        id: "frequency",
        label: "발생 횟수",
        type: "select",
        required: true,
        options: [
          "1회",
          "2~3회",
          "4~5회",
          "6회 이상",
          "지속적으로 반복함",
          "정확한 횟수 확인 어려움"
        ]
      },
      {
        id: "behavior",
        label: "동반 행동",
        type: "select",
        required: false,
        options: [
          "침상에서 뒤척임",
          "반복적으로 일어남",
          "직원을 부름",
          "화장실을 찾음",
          "가족을 찾음",
          "귀가하려고 함",
          "불안한 모습을 보임",
          "큰소리를 냄",
          "기타"
        ]
      },
      {
        id: "behaviorEtc",
        label: "기타 동반 행동",
        type: "text",
        required: true,
        placeholder:
          "구체적인 동반 행동을 입력해주세요.",
        showWhen: {
          field: "behavior",
          equals: "기타"
        }
      },
      {
        id: "support",
        label: "직원 대응",
        type: "select",
        required: false,
        options: [
          "정서적 안정 지원",
          "침상 환경 정리",
          "조명 및 소음 조절",
          "화장실 이용 지원",
          "수분 제공",
          "침실로 재안내",
          "낙상 예방을 위해 동행",
          "지속 관찰",
          "간호사에게 보고",
          "기타"
        ]
      },
      {
        id: "supportEtc",
        label: "기타 직원 대응",
        type: "text",
        required: true,
        placeholder:
          "직원이 실시한 대응을 입력해주세요.",
        showWhen: {
          field: "support",
          equals: "기타"
        }
      },
      {
        id: "note",
        label: "추가 관찰",
        type: "textarea",
        required: false,
        placeholder:
          "수면 상태, 어르신의 표현, 낮 시간 졸림 여부 등을 입력해주세요."
      }
    ],

    buildSummary(values) {
      const sleepTypeText =
        values.sleepType === "기타"
          ? values.sleepTypeEtc
          : values.sleepType;

      let summary =
        `${values.timePeriod}에 ${sleepTypeText} 양상이 ` +
        `${values.duration} 지속되었으며, ` +
        `${values.frequency} 발생함.`;

      if (values.behavior) {
        const behaviorText =
          values.behavior === "기타"
            ? values.behaviorEtc
            : values.behavior;

        summary +=
          ` 동반 행동은 ${behaviorText}으로 확인됨.`;
      }

      if (values.support) {
        const supportText =
          values.support === "기타"
            ? values.supportEtc
            : values.support;

        summary +=
          ` 직원은 ${supportText}을 실시함.`;
      }

      if (values.note) {
        summary +=
          ` 추가 관찰: ${values.note}`;
      }
      return summary;
    }
  },
  "공격행동": {
    title: "공격행동 상세 기록",

    fields: [
      {
        id: "behaviorType",
        label: "공격행동 유형",
        type: "select",
        required: true,
        options: [
          "욕설 또는 위협적인 말",
          "큰소리로 화냄",
          "손으로 밀침",
          "때리려고 함",
          "발로 차려고 함",
          "물건을 던짐",
          "물건을 내리침",
          "침을 뱉음",
          "꼬집거나 할퀴려고 함",
          "기타"
        ]
      },
      {
        id: "behaviorTypeEtc",
        label: "기타 공격행동",
        type: "text",
        required: true,
        placeholder:
          "구체적인 공격행동을 입력해주세요.",
        showWhen: {
          field: "behaviorType",
          equals: "기타"
        }
      },
      {
        id: "target",
        label: "행동 대상",
        type: "select",
        required: true,
        options: [
          "직원",
          "다른 어르신",
          "보호자",
          "본인",
          "주변 물건",
          "대상 불분명",
          "기타"
        ]
      },
      {
        id: "targetEtc",
        label: "기타 행동 대상",
        type: "text",
        required: true,
        placeholder:
          "행동 대상을 입력해주세요.",
        showWhen: {
          field: "target",
          equals: "기타"
        }
      },
      {
        id: "situation",
        label: "발생 상황",
        type: "select",
        required: true,
        options: [
          "신체 케어 중",
          "식사 지원 중",
          "이동 지원 중",
          "투약 또는 간호 처치 중",
          "프로그램 참여 권유 중",
          "귀가 요구 상황",
          "물건을 찾는 상황",
          "다른 어르신과의 갈등",
          "원인 확인 어려움",
          "기타"
        ]
      },
      {
        id: "situationEtc",
        label: "기타 발생 상황",
        type: "text",
        required: true,
        placeholder:
          "공격행동이 발생한 상황을 입력해주세요.",
        showWhen: {
          field: "situation",
          equals: "기타"
        }
      },
      {
        id: "location",
        label: "발생 장소",
        type: "select",
        required: true,
        options: [
          "침실",
          "생활실",
          "프로그램실",
          "복도",
          "식당",
          "화장실",
          "출입문 주변",
          "기타"
        ]
      },
      {
        id: "locationEtc",
        label: "기타 발생 장소",
        type: "text",
        required: true,
        placeholder:
          "발생 장소를 입력해주세요.",
        showWhen: {
          field: "location",
          equals: "기타"
        }
      },
      {
        id: "frequency",
        label: "발생 횟수",
        type: "select",
        required: true,
        options: [
          "1회",
          "2~3회",
          "4~5회",
          "6회 이상",
          "지속적으로 반복함",
          "정확한 횟수 확인 어려움"
        ]
      },
      {
        id: "riskLevel",
        label: "위험 정도",
        type: "select",
        required: true,
        options: [
          "낮음",
          "중간",
          "높음",
          "매우 높음"
        ]
      },
      {
        id: "injury",
        label: "상해 발생 여부",
        type: "select",
        required: true,
        options: [
          "상해 없음",
          "가벼운 상해 있음",
          "상해 확인 필요",
          "즉시 의료 확인 필요"
        ]
      },
      {
        id: "support",
        label: "직원 대응",
        type: "select",
        required: false,
        options: [
          "대상자와 거리를 확보함",
          "주변 어르신을 분리함",
          "위험 물건을 제거함",
          "정서적 안정 지원",
          "다른 직원의 도움을 요청함",
          "간호사에게 보고함",
          "보호자에게 공유함",
          "지속 관찰함",
          "기타"
        ]
      },
      {
        id: "supportEtc",
        label: "기타 직원 대응",
        type: "text",
        required: true,
        placeholder:
          "직원이 실시한 대응을 입력해주세요.",
        showWhen: {
          field: "support",
          equals: "기타"
        }
      },
      {
        id: "note",
        label: "추가 관찰",
        type: "textarea",
        required: false,
        placeholder:
          "공격행동 전후 어르신의 표현, 표정, 유발 요인, 진정 여부 등을 입력해주세요."
      }
    ],

    buildSummary(values) {
      const behaviorTypeText =
        values.behaviorType === "기타"
          ? values.behaviorTypeEtc
          : values.behaviorType;

      const targetText =
        values.target === "기타"
          ? values.targetEtc
          : values.target;

      const situationText =
        values.situation === "기타"
          ? values.situationEtc
          : values.situation;

      const locationText =
        values.location === "기타"
          ? values.locationEtc
          : values.location;

      let summary =
        `${locationText}에서 ${situationText} 중 ` +
        `${targetText}을 대상으로 ${behaviorTypeText} 행동을 ` +
        `${values.frequency} 보임. ` +
        `위험 정도는 ${values.riskLevel}으로 확인됨. ` +
        `${values.injury}.`;

      if (values.support) {
        const supportText =
          values.support === "기타"
            ? values.supportEtc
            : values.support;

        summary +=
          ` 직원은 ${supportText}.`;
      }

      if (values.note) {
        summary +=
          ` 추가 관찰: ${values.note}`;
      }

      return summary;
    }
  },
    "기침/가래": {
    title: "기침/가래 상세 기록",

    fields: [
      {
        id: "symptomType",
        label: "증상 유형",
        type: "select",
        required: true,
        options: [
          "기침만 있음",
          "가래만 있음",
          "기침과 가래 모두 있음"
        ]
      },
      {
        id: "frequency",
        label: "발생 빈도",
        type: "select",
        required: true,
        options: [
          "1회",
          "2~3회",
          "4~5회",
          "6회 이상",
          "간헐적으로 반복함",
          "지속적으로 반복함",
          "정확한 횟수 확인 어려움"
        ]
      },
      {
        id: "timePeriod",
        label: "발생 시간대",
        type: "select",
        required: true,
        options: [
          "오전",
          "오후",
          "저녁",
          "야간",
          "새벽",
          "식사 중",
          "식사 후",
          "누워 있을 때"
        ]
      },
      {
        id: "sputumAmount",
        label: "가래 양",
        type: "select",
        required: true,
        options: [
          "가래 없음",
          "소량",
          "중간 정도",
          "많음",
          "양 확인 어려움"
        ]
      },
      {
        id: "sputumColor",
        label: "가래 색",
        type: "select",
        required: false,
        options: [
          "투명",
          "흰색",
          "노란색",
          "녹색",
          "붉은색 또는 피가 섞임",
          "색 확인 어려움",
          "기타"
        ]
      },
      {
        id: "sputumColorEtc",
        label: "기타 가래 색",
        type: "text",
        required: true,
        placeholder:
          "가래 색이나 상태를 입력해주세요.",
        showWhen: {
          field: "sputumColor",
          equals: "기타"
        }
      },
      {
        id: "relatedSymptom",
        label: "동반 증상",
        type: "select",
        required: false,
        options: [
          "호흡곤란",
          "숨소리 거침",
          "발열",
          "목 통증",
          "흉통",
          "식사 중 사레",
          "구토",
          "기력 저하",
          "동반 증상 없음",
          "기타"
        ]
      },
      {
        id: "relatedSymptomEtc",
        label: "기타 동반 증상",
        type: "text",
        required: true,
        placeholder:
          "동반 증상을 입력해주세요.",
        showWhen: {
          field: "relatedSymptom",
          equals: "기타"
        }
      },
      {
        id: "support",
        label: "직원 대응",
        type: "select",
        required: false,
        options: [
          "수분 제공",
          "상체를 올려 자세 조정",
          "구강 상태 확인",
          "식사 중단 및 안정 지원",
          "산소포화도 확인 요청",
          "간호사에게 보고",
          "의료진 확인 요청",
          "지속 관찰",
          "기타"
        ]
      },
      {
        id: "supportEtc",
        label: "기타 직원 대응",
        type: "text",
        required: true,
        placeholder:
          "직원이 실시한 대응을 입력해주세요.",
        showWhen: {
          field: "support",
          equals: "기타"
        }
      },
      {
        id: "note",
        label: "추가 관찰",
        type: "textarea",
        required: false,
        placeholder:
          "기침 소리, 호흡 상태, 식사와의 관련성 등을 입력해주세요."
      }
    ],

    buildSummary(values) {
      const sputumColorText =
        values.sputumColor === "기타"
          ? values.sputumColorEtc
          : values.sputumColor;

      const relatedSymptomText =
        values.relatedSymptom === "기타"
          ? values.relatedSymptomEtc
          : values.relatedSymptom;

      let summary =
        `${values.timePeriod}에 ${values.symptomType} 증상이 ` +
        `${values.frequency} 관찰됨. ` +
        `가래 양은 ${values.sputumAmount}으로 확인됨.`;

      if (
        values.sputumAmount !== "가래 없음" &&
        sputumColorText
      ) {
        summary +=
          ` 가래 색은 ${sputumColorText}으로 확인됨.`;
      }

      if (
        relatedSymptomText &&
        relatedSymptomText !== "동반 증상 없음"
      ) {
        summary +=
          ` 동반 증상은 ${relatedSymptomText}으로 확인됨.`;
      }

      if (values.support) {
        const supportText =
          values.support === "기타"
            ? values.supportEtc
            : values.support;

        summary +=
          ` 직원은 ${supportText}을 실시함.`;
      }

      if (values.note) {
        summary +=
          ` 추가 관찰: ${values.note}`;
      }

      return summary;
    }
  },
    "거부/저항": {
    title: "거부/저항 상세 기록",

    fields: [
      {
        id: "careType",
        label: "거부한 케어 유형",
        type: "select",
        required: true,
        options: [
          "세면 또는 구강관리",
          "의복 교환",
          "목욕",
          "기저귀 교환",
          "배변·배뇨 지원",
          "식사 지원",
          "투약",
          "간호 처치",
          "이동 지원",
          "프로그램 참여",
          "수면 또는 침상 안내",
          "기타"
        ]
      },
      {
        id: "careTypeEtc",
        label: "기타 케어 유형",
        type: "text",
        required: true,
        placeholder:
          "거부한 케어 내용을 입력해주세요.",
        showWhen: {
          field: "careType",
          equals: "기타"
        }
      },
      {
        id: "behavior",
        label: "거부 행동",
        type: "select",
        required: true,
        options: [
          "고개를 돌림",
          "입을 다묾",
          "손으로 밀어냄",
          "몸을 움츠림",
          "이불을 덮고 나오지 않음",
          "큰소리로 거부함",
          "욕설 또는 위협적인 말을 함",
          "자리를 피함",
          "직원의 손을 잡거나 뿌리침",
          "기타"
        ]
      },
      {
        id: "behaviorEtc",
        label: "기타 거부 행동",
        type: "text",
        required: true,
        placeholder:
          "구체적인 거부 행동을 입력해주세요.",
        showWhen: {
          field: "behavior",
          equals: "기타"
        }
      },
      {
        id: "situation",
        label: "발생 상황",
        type: "select",
        required: true,
        options: [
          "케어 시작 전",
          "케어 진행 중",
          "설명 직후",
          "수면 중 깨운 뒤",
          "식사 전",
          "식사 중",
          "통증을 호소한 뒤",
          "피로 또는 졸림 상태",
          "원인 확인 어려움",
          "기타"
        ]
      },
      {
        id: "situationEtc",
        label: "기타 발생 상황",
        type: "text",
        required: true,
        placeholder:
          "거부가 발생한 상황을 입력해주세요.",
        showWhen: {
          field: "situation",
          equals: "기타"
        }
      },
      {
        id: "intensity",
        label: "거부 강도",
        type: "select",
        required: true,
        options: [
          "약함",
          "보통",
          "강함",
          "매우 강함"
        ]
      },
      {
        id: "frequency",
        label: "반복 횟수",
        type: "select",
        required: true,
        options: [
          "1회",
          "2~3회",
          "4~5회",
          "6회 이상",
          "지속적으로 반복함",
          "정확한 횟수 확인 어려움"
        ]
      },
      {
        id: "support",
        label: "직원 대응",
        type: "select",
        required: false,
        options: [
          "케어 목적을 다시 설명함",
          "잠시 기다린 뒤 재시도함",
          "다른 직원이 접근함",
          "선호하는 방법으로 변경함",
          "정서적 안정 지원",
          "통증 여부를 확인함",
          "간호사에게 보고함",
          "보호자에게 공유함",
          "케어를 중단하고 관찰함",
          "기타"
        ]
      },
      {
        id: "supportEtc",
        label: "기타 직원 대응",
        type: "text",
        required: true,
        placeholder:
          "직원이 실시한 대응을 입력해주세요.",
        showWhen: {
          field: "support",
          equals: "기타"
        }
      },
      {
        id: "retryResult",
        label: "재시도 결과",
        type: "select",
        required: true,
        options: [
          "재시도 후 케어 완료",
          "일부만 수행함",
          "계속 거부하여 중단함",
          "다른 직원이 수행함",
          "추후 다시 시도 예정",
          "재시도하지 않음"
        ]
      },
      {
        id: "note",
        label: "추가 관찰",
        type: "textarea",
        required: false,
        placeholder:
          "거부 전후의 표정, 말, 통증 여부, 진정 여부 등을 입력해주세요."
      }
    ],

    buildSummary(values) {
      const careTypeText =
        values.careType === "기타"
          ? values.careTypeEtc
          : values.careType;

      const behaviorText =
        values.behavior === "기타"
          ? values.behaviorEtc
          : values.behavior;

      const situationText =
        values.situation === "기타"
          ? values.situationEtc
          : values.situation;

      let summary =
        `${situationText} ${careTypeText} 과정에서 ` +
        `${behaviorText} 행동을 ${values.frequency} 보임. ` +
        `거부 강도는 ${values.intensity}으로 확인됨.`;

      if (values.support) {
        const supportText =
          values.support === "기타"
            ? values.supportEtc
            : values.support;

        summary +=
          ` 직원은 ${supportText}.`;
      }

      summary +=
        ` 재시도 결과는 ${values.retryResult}.`;

      if (values.note) {
        summary +=
          ` 추가 관찰: ${values.note}`;
      }

      return summary;
    }
  },
    "낙상위험": {
    title: "낙상위험 상세 기록",

    fields: [
      {
        id: "riskBehavior",
        label: "위험 행동",
        type: "select",
        required: true,
        options: [
          "침상에서 혼자 일어나려 함",
          "휠체어에서 혼자 일어나려 함",
          "보행 시 휘청거림",
          "보조기구 없이 이동하려 함",
          "바닥에 주저앉음",
          "의자 또는 침상 가장자리에 걸터앉음",
          "화장실을 급하게 가려고 함",
          "야간에 혼자 이동함",
          "미끄러운 바닥에서 이동함",
          "기타"
        ]
      },
      {
        id: "riskBehaviorEtc",
        label: "기타 위험 행동",
        type: "text",
        required: true,
        placeholder:
          "구체적인 낙상 위험 행동을 입력해주세요.",
        showWhen: {
          field: "riskBehavior",
          equals: "기타"
        }
      },
      {
        id: "location",
        label: "발생 장소",
        type: "select",
        required: true,
        options: [
          "침실",
          "생활실",
          "프로그램실",
          "복도",
          "식당",
          "화장실",
          "출입문 주변",
          "기타"
        ]
      },
      {
        id: "locationEtc",
        label: "기타 발생 장소",
        type: "text",
        required: true,
        placeholder:
          "발생 장소를 입력해주세요.",
        showWhen: {
          field: "location",
          equals: "기타"
        }
      },
      {
        id: "timePeriod",
        label: "발생 시간대",
        type: "select",
        required: true,
        options: [
          "오전",
          "오후",
          "저녁",
          "야간",
          "새벽"
        ]
      },
      {
        id: "gaitStatus",
        label: "보행 상태",
        type: "select",
        required: true,
        options: [
          "안정적",
          "약간 불안정",
          "휘청거림",
          "직원 부축 필요",
          "보행 불가",
          "확인 어려움"
        ]
      },
      {
        id: "assistiveDevice",
        label: "보조기구 사용",
        type: "select",
        required: true,
        options: [
          "사용하지 않음",
          "지팡이 사용",
          "워커 사용",
          "휠체어 사용",
          "침상 난간 사용",
          "기타"
        ]
      },
      {
        id: "assistiveDeviceEtc",
        label: "기타 보조기구",
        type: "text",
        required: true,
        placeholder:
          "사용한 보조기구를 입력해주세요.",
        showWhen: {
          field: "assistiveDevice",
          equals: "기타"
        }
      },
      {
        id: "fallOccurred",
        label: "실제 낙상 여부",
        type: "select",
        required: true,
        options: [
          "낙상하지 않음",
          "넘어질 뻔함",
          "바닥에 주저앉음",
          "실제 낙상함"
        ]
      },
      {
        id: "injury",
        label: "상해 여부",
        type: "select",
        required: true,
        options: [
          "상해 없음",
          "통증 호소",
          "찰과상 또는 멍",
          "출혈 있음",
          "상해 확인 필요",
          "즉시 의료 확인 필요"
        ]
      },
      {
        id: "support",
        label: "직원 개입",
        type: "select",
        required: false,
        options: [
          "즉시 부축함",
          "침상 또는 의자로 안내함",
          "휠체어로 이동 지원함",
          "보조기구 사용을 안내함",
          "바닥과 이동 동선을 정리함",
          "낙상 방지 매트를 확인함",
          "침상 난간을 확인함",
          "간호사에게 보고함",
          "보호자에게 공유함",
          "지속 관찰함",
          "기타"
        ]
      },
      {
        id: "supportEtc",
        label: "기타 직원 개입",
        type: "text",
        required: true,
        placeholder:
          "직원이 실시한 개입을 입력해주세요.",
        showWhen: {
          field: "support",
          equals: "기타"
        }
      },
      {
        id: "note",
        label: "추가 관찰",
        type: "textarea",
        required: false,
        placeholder:
          "낙상 전후 상황, 어르신의 표현, 통증 부위, 환경적 요인 등을 입력해주세요."
      }
    ],

    buildSummary(values) {
      const riskBehaviorText =
        values.riskBehavior === "기타"
          ? values.riskBehaviorEtc
          : values.riskBehavior;

      const locationText =
        values.location === "기타"
          ? values.locationEtc
          : values.location;

      const assistiveDeviceText =
        values.assistiveDevice === "기타"
          ? values.assistiveDeviceEtc
          : values.assistiveDevice;

      let summary =
        `${values.timePeriod} ${locationText}에서 ` +
        `${riskBehaviorText} 행동이 관찰됨. ` +
        `보행 상태는 ${values.gaitStatus}, ` +
        `보조기구는 ${assistiveDeviceText}으로 확인됨. ` +
        `낙상 여부는 ${values.fallOccurred}, ` +
        `상해 여부는 ${values.injury}으로 확인됨.`;

      if (values.support) {
        const supportText =
          values.support === "기타"
            ? values.supportEtc
            : values.support;

        summary +=
          ` 직원은 ${supportText}.`;
      }

      if (values.note) {
        summary +=
          ` 추가 관찰: ${values.note}`;
      }

      return summary;
    }
  }

};

/*
 * Schema의 필드 하나를 HTML로 변환
 */
function createObservationFieldHTML(field) {
  const fieldId = `observation_${field.id}`;
  const requiredMark = field.required ? " *" : "";

  const conditionalClass = field.showWhen
    ? " observation-field-conditional"
    : "";

  const conditionalAttributes = field.showWhen
    ? `
      data-condition-field="${field.showWhen.field}"
      data-condition-value="${field.showWhen.equals}"
      style="display: none;"
    `
    : "";

  if (field.type === "select") {
    const optionsHTML = field.options
      .map(option => {
        return `<option value="${option}">${option}</option>`;
      })
      .join("");

    return `
      <div
        class="observation-field${conditionalClass}"
        data-field-id="${field.id}"
        ${conditionalAttributes}
      >
        <label for="${fieldId}">
          ${field.label}${requiredMark}
        </label>

        <select
          id="${fieldId}"
          data-observation-field="${field.id}"
        >
          <option value="">선택해주세요</option>
          ${optionsHTML}
        </select>
      </div>
    `;
  }

  if (field.type === "textarea") {
    return `
      <div
        class="observation-field${conditionalClass}"
        data-field-id="${field.id}"
        ${conditionalAttributes}
      >
        <label for="${fieldId}">
          ${field.label}${requiredMark}
        </label>

        <textarea
          id="${fieldId}"
          data-observation-field="${field.id}"
          placeholder="${field.placeholder || ""}"
        ></textarea>
      </div>
    `;
  }

  return `
    <div
      class="observation-field${conditionalClass}"
      data-field-id="${field.id}"
      ${conditionalAttributes}
    >
      <label for="${fieldId}">
        ${field.label}${requiredMark}
      </label>

      <input
        id="${fieldId}"
        data-observation-field="${field.id}"
        type="${field.type || "text"}"
        placeholder="${field.placeholder || ""}"
      />
    </div>
  `;
}

function updateConditionalObservationFields() {
  const conditionalFields = document.querySelectorAll(
    ".observation-field-conditional"
  );

  conditionalFields.forEach(container => {
    const sourceFieldId =
      container.dataset.conditionField;

    const expectedValue =
      container.dataset.conditionValue;

    const sourceInput = document.getElementById(
      `observation_${sourceFieldId}`
    );

    const targetInput = container.querySelector(
      "input, select, textarea"
    );

    if (!sourceInput || !targetInput) {
      return;
    }

    const shouldShow =
      sourceInput.value === expectedValue;

    container.style.display =
      shouldShow ? "block" : "none";

    if (!shouldShow) {
      targetInput.value = "";
    }
  });
}

function bindObservationFieldEvents() {
  const inputs = document.querySelectorAll(
    "#observationModalBody select, " +
    "#observationModalBody input, " +
    "#observationModalBody textarea"
  );

  inputs.forEach(input => {
    input.addEventListener(
      "change",
      updateConditionalObservationFields
    );
  });
}

/*
 * 공통 모달 열기
 */
function openObservationModal(type) {
  const schema = observationSchemas[type];

  /*
   * Schema가 없는 기존 관찰 항목은
   * 이전처럼 바로 단순 기록으로 저장
   */
  if (!schema) {
    addRecord(type);
    return;
  }

  currentObservationType = type;

  const modal = document.getElementById("observationModal");
  const title = document.getElementById("observationModalTitle");
  const body = document.getElementById("observationModalBody");

  title.textContent = schema.title;

body.innerHTML = schema.fields
  .map(field => createObservationFieldHTML(field))
  .join("");

bindObservationFieldEvents();
updateConditionalObservationFields();

modal.classList.add("show");
}


/*
 * 공통 모달 닫기
 */
function closeObservationModal() {
  const modal = document.getElementById("observationModal");
  const body = document.getElementById("observationModalBody");

  modal.classList.remove("show");
  body.innerHTML = "";

  currentObservationType = null;
}


/*
 * Schema에 정의된 입력값 수집
 */
function collectObservationValues(schema) {
  const values = {};

  for (const field of schema.fields) {
    const input = document.getElementById(
      `observation_${field.id}`
    );

    if (!input) continue;

    const container = input.closest(
      ".observation-field"
    );

    const isHidden =
      container &&
      container.style.display === "none";

    if (isHidden) {
      values[field.id] = "";
      continue;
    }

    const value = input.value.trim();

    if (field.required && !value) {
      alert(`${field.label} 항목을 입력해주세요.`);
      input.focus();

      return null;
    }

    values[field.id] = value;
  }

  return values;
}


/*
 * 공통 관찰 기록 저장
 */
function saveObservationDetail() {
  const schema = observationSchemas[currentObservationType];

  if (!schema) {
    alert("관찰 항목 정보를 찾을 수 없습니다.");
    return;
  }

  const values = collectObservationValues(schema);

  if (!values) return;

  const summary = schema.buildSummary(values);
  const now = new Date();

  const date = now.toLocaleDateString("ko-KR");

  const time = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const observationType = currentObservationType;

  /*
   * Timeline 이벤트 생성
   */
  const timelineEvent = createEvent({
    type: "observation",
    residentId: currentResident,
    residentName: residents[currentResident].name,
    title: observationType,
    body: summary
  });

  /*
   * 관찰 기록 저장
   */
  records.push({
    id:
      "record_" +
      Date.now() +
      "_" +
      Math.random().toString(16).slice(2),

    eventId: timelineEvent.id,
    residentId: currentResident,
    residentName: residents[currentResident].name,

    type: observationType,
    details: values,
    summary,

    date,
    time,
    timestamp: now.getTime()
  });

  saveRecords();

/*
 * 저장이 완료되면 모달부터 닫는다.
 * 이후 화면 갱신에서 오류가 생겨도 모달은 정상 종료된다.
 */
closeObservationModal();

refreshAllViews();

alert(`${observationType} 기록이 저장되었습니다.`);
}


function addRecord(type) {
  const now = new Date();

  const date = now.toLocaleDateString("ko-KR");
  const time = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  // Timeline 이벤트를 먼저 생성
  const timelineEvent = createEvent({
    type: "observation",
    residentId: currentResident,
    residentName: residents[currentResident].name,
    title: type,
    body: `${type} 항목이 관찰됨.`
  });

  // 관찰 기록과 Timeline 이벤트를 eventId로 연결
  records.push({
    id: "record_" + Date.now(),
    eventId: timelineEvent.id,
    residentId: currentResident,
    residentName: residents[currentResident].name,
    date,
    time,
    timestamp: now.getTime(),
    type
  });

saveRecords();
refreshAllViews();
}

function renderRecords() {
  const list = document.getElementById("recordList");
  list.innerHTML = "";

  const today = new Date().toLocaleDateString("ko-KR");

  const filteredRecords = records.filter(
    record =>
      record.residentId === currentResident &&
      record.date === today
  );

  if (filteredRecords.length === 0) {
    const li = document.createElement("li");
    li.textContent = "오늘 기록이 없습니다.";
    list.appendChild(li);
    return;
  }

  filteredRecords.forEach(record => {
  const li = document.createElement("li");

  if (record.summary) {
    li.textContent =
      `${record.time} - ${record.type}: ${record.summary}`;
  } else {
    li.textContent =
      `${record.time} - ${record.type}`;
  }

  list.appendChild(li);
});

}

function renderAllRecords() {
  const list = document.getElementById("recordList");
  list.innerHTML = "";

  const filteredRecords = records.filter(
    record => record.residentId === currentResident
  );

  if (filteredRecords.length === 0) {
    const li = document.createElement("li");
    li.textContent = "저장된 기록이 없습니다.";
    list.appendChild(li);
    return;
  }

  filteredRecords.forEach(record => {
  const li = document.createElement("li");

  if (record.summary) {
    li.textContent =
      `${record.date} ${record.time} - ` +
      `${record.type}: ${record.summary}`;
  } else {
    li.textContent =
      `${record.date} ${record.time} - ${record.type}`;
  }

  list.appendChild(li);
});
}

function clearCurrentResidentRecords() {
  const resident = residents[currentResident];

  if (!resident) {
    alert("삭제할 어르신 정보가 없습니다.");
    return;
  }

  const confirmDelete = confirm(
    `${resident.name}의 관찰 기록, AI 분석 기록, Timeline 기록을 모두 삭제하시겠습니까?`
  );

  if (!confirmDelete) return;

  // 관찰 기록 삭제
  records = records.filter(
    record => record.residentId !== currentResident
  );
  saveRecords();

  // AI 분석 기록 삭제
  aiRecords = aiRecords.filter(
    record => record.residentId !== currentResident
  );
  saveAIRecords();

  // Timeline 기록 삭제
  events = events.filter(
    event => event.residentId !== currentResident
  );
  saveEvents();

  // 화면 갱신
  refreshAllViews();
  resetAIAnalysis();

  document.getElementById("aiText").textContent =
    "아직 생성된 기록이 없습니다.";

  document.getElementById("aiRisk").textContent =
    "아직 분석된 위험도가 없습니다.";

  document.getElementById("aiAction").textContent =
    "아직 추천 조치가 없습니다.";

  document.getElementById("reportContent").textContent =
    "아직 생성된 보고서가 없습니다.";

  alert(`${resident.name}의 전체 기록이 삭제되었습니다.`);
}

/* ===========================
   CSV 다운로드
=========================== */

function downloadCSV() {
  if (records.length === 0) {
    alert("다운로드할 기록이 없습니다.");
    return;
  }

  let csv = "날짜,시간,어르신,관찰항목\n";

  records.forEach(record => {
    csv += `${record.date},${record.time},${record.residentName},${record.type}\n`;
  });

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "care_records.csv";
  link.click();
}

/* ===========================
   화면 전체 갱신
=========================== */

function refreshAllViews() {
  if (typeof renderRecords === "function") {
    renderRecords();
  }

  if (typeof renderTimeline === "function") {
    renderTimeline();
  }

  if (typeof renderCareFlow === "function") {
    renderCareFlow();
  }

  if (
    typeof refreshReportIfGenerated === "function"
  ) {
    refreshReportIfGenerated();
  }
}

/* ===========================
   초기 실행
=========================== */

function initializeApp() {
  const idInput =
    document.getElementById("userId");

  const pwInput =
    document.getElementById("userPw");

  /*
   * 1. 로그인 상태를 가장 먼저 복원
   */
  const isLoggedIn =
    localStorage.getItem("isLogin") === "true";

  if (isLoggedIn) {
    showPortal();
    initializeSummaryDashboard();
      // 스크롤 위치에 따른 메뉴 자동 활성화
    initializeSectionNavigationObserver();
    initializeMobileMoreMenu();
  } else {
    showLogin();
  }
  document.documentElement.classList.add(
    "auth-ready"
  );
  document.addEventListener("click", (event) => {
  const menu =
    document.getElementById("mobileMoreMenu");

  const button =
    document.getElementById("mobileMoreMenuButton");

  if (!menu || !button) {
    return;
  }

  if (menu.hasAttribute("hidden")) {
    return;
  }

  const clickedInsideMenu =
    menu.contains(event.target);

  const clickedButton =
    button.contains(event.target);

  if (!clickedInsideMenu && !clickedButton) {
    closeMobileMoreMenu();
  }
});
  window.addEventListener(
    "resize",
    updateMobileMoreMenuVisibility
  );

  /*
   * 2. Enter 로그인 연결
   */
  function handleLoginEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      login();
    }
  }

  if (idInput) {
    idInput.addEventListener(
      "keydown",
      handleLoginEnter
    );
  }

  if (pwInput) {
    pwInput.addEventListener(
      "keydown",
      handleLoginEnter
    );
  }

  /*
   * 3. 조치 기타 항목 연결
   */
  const actionTypeSelect =
    document.getElementById("careActionType");

  if (actionTypeSelect) {
    actionTypeSelect.addEventListener(
      "change",
      updateActionEtcField
    );
  }

/*
 * 4. 화면 데이터 초기화
 *
 * renderResidentSelect() 내부에서 changeResident()가 실행되고,
 * changeResident()가 기록·Timeline·Care Flow·보고서를 갱신한다.
 */
try {
  renderResidentSelect();
} catch (error) {
  console.error(
    "초기 화면 구성 오류:",
    error
  );
}
/*
 * 5. 로그인 확인과 초기 화면 구성이 끝난 후 화면 표시
 */
  document.documentElement.classList.add(
  "auth-ready"
);
}


/* ===========================
   통합 Timeline 이벤트
=========================== */


/*
 * 기존 Timeline 데이터 마이그레이션
 * ID가 없는 과거 이벤트에 새로운 ID를 부여한다.
 */
function migrateTimelineEvents() {
  let changed = false;

  events = events.map((event, index) => {
    if (!event.id) {
      changed = true;

      return {
        ...event,
        id:
          "event_migrated_" +
          Date.now() +
          "_" +
          index +
          "_" +
          Math.random()
            .toString(16)
            .slice(2)
      };
    }

    return event;
  });

  if (changed) {
    saveEvents();

    console.log(
      "기존 Timeline 기록에 ID를 자동 부여했습니다."
    );
  }
}

migrateTimelineEvents();


function sortEventsByOldest(eventsToSort) {
  return [...eventsToSort].sort(
    (a, b) => a.timestamp - b.timestamp
  );
}
function createReportEvaluationHTML(evaluationEvent) {
  return `
    <div class="report-flow-evaluation">
      <div class="report-flow-label">
        📈 평가
      </div>

      <div class="report-flow-time">
        ${escapeHTML(evaluationEvent.date)}
        ${escapeHTML(evaluationEvent.time)}
      </div>

      <div class="report-flow-body">
        ${escapeHTML(evaluationEvent.body)}
      </div>
    </div>
  `;
}

function createReportActionHTML(actionEvent) {
  const evaluations = sortEventsByOldest(
    events.filter(
      event =>
        event.type === "evaluation" &&
        event.parentEventId === actionEvent.id
    )
  );

  const evaluationsHTML =
    evaluations.length > 0
      ? evaluations
          .map(evaluationEvent =>
            createReportEvaluationHTML(evaluationEvent)
          )
          .join("")
      : `
          <div class="report-flow-empty">
            등록된 평가가 없습니다.
          </div>
        `;

  return `
    <div class="report-flow-action">
      <div class="report-flow-label">
        ✅ 조치
      </div>

      <div class="report-flow-time">
        ${escapeHTML(actionEvent.date)}
        ${escapeHTML(actionEvent.time)}
      </div>

      <div class="report-flow-body">
        ${escapeHTML(actionEvent.body)}
      </div>

      <div class="report-flow-evaluations">
        ${evaluationsHTML}
      </div>
    </div>
  `;
}


function createReportCareCaseHTML(
  observationEvent,
  caseNumber
) {
  const actions = sortEventsByOldest(
    events.filter(
      event =>
        event.type === "action" &&
        event.parentEventId === observationEvent.id
    )
  );

  const actionsHTML =
    actions.length > 0
      ? actions
          .map(actionEvent =>
            createReportActionHTML(actionEvent)
          )
          .join("")
      : `
          <div class="report-flow-empty">
            등록된 조치가 없습니다.
          </div>
        `;

  return `
    <section class="report-care-case">
      <div class="report-case-header">
        <div>
          <div class="report-case-number">
            CARE CASE ${caseNumber}
          </div>

          <h3>
            📝 ${escapeHTML(observationEvent.title)}
          </h3>
        </div>

        <div class="report-case-time">
          ${escapeHTML(observationEvent.date)}
          ${escapeHTML(observationEvent.time)}
        </div>
      </div>

      <div class="report-observation-body">
        ${escapeHTML(observationEvent.body)}
      </div>

      <div class="report-flow-actions">
        ${actionsHTML}
      </div>
    </section>
  `;
}

function createReportAISectionHTML() {
  const aiEvents = events
    .filter(
      event =>
        event.residentId === currentResident &&
        event.type === "ai"
    )
    .sort((a, b) => b.timestamp - a.timestamp);

  if (aiEvents.length === 0) {
    return `
      <section class="report-ai-section">
        <h3>AI 분석 이력</h3>

        <div class="report-flow-empty">
          저장된 AI 분석 기록이 없습니다.
        </div>
      </section>
    `;
  }

  const aiHTML = aiEvents
    .map(event => {
      return `
        <div class="report-ai-item">
          <div class="report-ai-header">
            <strong>🤖 AI 상태분석</strong>

            <span>
              ${escapeHTML(event.date)}
              ${escapeHTML(event.time)}
            </span>
          </div>

          <div class="report-ai-body">
            ${escapeHTML(event.body)}
          </div>

          ${
            event.risk
              ? `
                <div class="report-ai-risk">
                  위험도: ${escapeHTML(event.risk)}
                </div>
              `
              : ""
          }

          ${
            event.action
              ? `
                <div class="report-ai-action">
                  <strong>추천 조치</strong><br>
                  ${escapeHTML(event.action)}
                </div>
              `
              : ""
          }
        </div>
      `;
    })
    .join("");

  return `
    <section class="report-ai-section">
      <h3>AI 분석 이력</h3>
      ${aiHTML}
    </section>
  `;
}
function refreshReportIfGenerated() {
  const reportContent =
    document.getElementById("reportContent");

  if (!reportContent) return;

  const reportText =
    reportContent.textContent.trim();

  const reportNotGenerated =
    reportText === "아직 생성된 보고서가 없습니다." ||
    reportText === "보고서로 만들 기록이 없습니다." ||
    reportText === "선택된 어르신 정보가 없습니다.";

  if (reportNotGenerated) {
    return;
  }

  try {
    generateReport();
  } catch (error) {
    console.error(
      "보고서 자동 갱신 중 오류가 발생했습니다.",
      error
    );
  }
}


function generateReport() {
  const reportContent =
    document.getElementById("reportContent");

  const resident = residents[currentResident];

  if (!resident) {
    reportContent.textContent =
      "선택된 어르신 정보가 없습니다.";

    return;
  }

  const observationEvents = events
    .filter(
      event =>
        event.residentId === currentResident &&
        event.type === "observation"
    )
    .sort((a, b) => b.timestamp - a.timestamp);

  const aiEvents = events.filter(
    event =>
      event.residentId === currentResident &&
      event.type === "ai"
  );

  if (
    observationEvents.length === 0 &&
    aiEvents.length === 0
  ) {
    reportContent.textContent =
      "보고서로 만들 기록이 없습니다.";

    return;
  }

  const careCasesHTML =
    observationEvents.length > 0
      ? observationEvents
          .map((observationEvent, index) =>
            createReportCareCaseHTML(
              observationEvent,
              observationEvents.length - index
            )
          )
          .join("")
      : `
          <div class="report-flow-empty">
            저장된 관찰 기록이 없습니다.
          </div>
        `;

  reportContent.innerHTML = `
    <div class="report-title">
      <h2>
        ${escapeHTML(resident.name)}
        Care Flow 돌봄 보고서
      </h2>

      <p>
        ${escapeHTML(resident.info)}
      </p>

      <p>
        생성일:
        ${escapeHTML(
          new Date().toLocaleString("ko-KR")
        )}
      </p>
    </div>

    <section class="report-care-section">
      <h3>관찰·조치·평가 기록</h3>

      ${careCasesHTML}
    </section>

    ${createReportAISectionHTML()}
  `;
}
function printReport() {
  const reportContent =
    document.getElementById("reportContent");

  if (!reportContent) {
    alert("보고서 영역을 찾을 수 없습니다.");
    return;
  }

  const reportText =
    reportContent.textContent.trim();

  if (
    reportText === "아직 생성된 보고서가 없습니다." ||
    reportText === "보고서로 만들 기록이 없습니다." ||
    reportText === "선택된 어르신 정보가 없습니다."
  ) {
    alert("먼저 보고서를 생성해주세요.");
    return;
  }

  const printWindow =
    window.open("", "_blank");

  if (!printWindow) {
    alert(
      "인쇄 창이 차단되었습니다. 브라우저의 팝업 차단을 허용해주세요."
    );
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      >

      <title>Care Flow 돌봄 보고서</title>

      <style>
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 36px;
          font-family:
            Arial,
            "Noto Sans KR",
            sans-serif;
          color: #1f2937;
          line-height: 1.7;
          background: white;
        }

        h2,
        h3,
        p {
          margin-top: 0;
        }

        .report-title {
          padding-bottom: 20px;
          border-bottom: 2px solid #1e293b;
        }

        .report-title h2 {
          margin-bottom: 8px;
        }

        .report-title p {
          margin-bottom: 4px;
          color: #475569;
        }

        .report-care-section,
        .report-ai-section {
          margin-top: 30px;
        }

        .report-care-section > h3,
        .report-ai-section > h3 {
          margin-bottom: 18px;
        }

        .report-care-case {
          margin-top: 20px;
          padding: 18px;
          border: 1px solid #bfdbfe;
          border-left: 5px solid #2563eb;
          border-radius: 10px;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .report-case-header,
        .report-ai-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .report-case-header h3 {
          margin: 5px 0 0;
          color: #1e3a8a;
        }

        .report-case-number,
        .report-case-time,
        .report-flow-time,
        .report-ai-header span {
          color: #64748b;
          font-size: 12px;
        }

        .report-observation-body,
        .report-flow-body,
        .report-ai-body,
        .report-ai-action {
          margin-top: 10px;
          line-height: 1.65;
        }

        .report-flow-actions {
          margin-top: 16px;
          margin-left: 14px;
          padding-left: 18px;
          border-left: 2px solid #bbf7d0;
        }

        .report-flow-action {
          margin-top: 12px;
          padding: 14px;
          border-radius: 8px;
          background: #f0fdf4;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .report-flow-label {
          font-weight: bold;
          color: #166534;
        }

        .report-flow-evaluations {
          margin-top: 12px;
          margin-left: 12px;
          padding-left: 16px;
          border-left: 2px solid #fde68a;
        }

        .report-flow-evaluation {
          margin-top: 10px;
          padding: 12px;
          border-radius: 8px;
          background: #fffbeb;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .report-flow-evaluation .report-flow-label {
          color: #92400e;
        }

        .report-flow-empty {
          margin-top: 10px;
          padding: 10px;
          border-radius: 8px;
          color: #64748b;
          background: #f8fafc;
        }

        .report-ai-section {
          padding-top: 22px;
          border-top: 1px dashed #cbd5e1;
        }

        .report-ai-item {
          margin-top: 12px;
          padding: 16px;
          border-left: 4px solid #7c3aed;
          border-radius: 8px;
          background: #faf5ff;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .report-ai-risk {
          margin-top: 10px;
          font-weight: bold;
          color: #b91c1c;
        }

        @page {
          size: A4;
          margin: 15mm;
        }

        @media print {
          body {
            padding: 0;
          }

          .report-care-case,
          .report-flow-action,
          .report-flow-evaluation,
          .report-ai-item {
            box-shadow: none;
          }
        }
      </style>
    </head>

    <body>
      ${reportContent.innerHTML}
    </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = function () {
    printWindow.focus();
    printWindow.print();

    /*
     * 인쇄창이 뜨기 전에 창이 닫히는 현상을 방지하기 위해
     * printWindow.close()는 호출하지 않습니다.
     */
  };
}


/* ===========================
   App Start
=========================== */

document.addEventListener("DOMContentLoaded", initializeApp);
window.addEventListener(
  "load",
  registerServiceWorker
);

/* ========================================
   요약 대시보드
======================================== */

/**
 * 화면에 표시된 기존 분석 결과를 요약 대시보드에 반영합니다.
 */
function updateSummaryDashboard() {
  updateDashboardCareScore();
  updateDashboardTodayCount();
  updateDashboardCareAlert();
  updateDashboardCarePlan();
}

/**
 * AI Care Score 반영
 */
function updateDashboardCareScore() {
  const sourceValue = document.getElementById("careScoreValue");
  const sourceDescription = document.getElementById(
    "careScoreDescription"
  );

  const dashboardValue = document.getElementById(
    "dashboardCareScore"
  );
  const dashboardText = document.getElementById(
    "dashboardCareScoreText"
  );

  if (!dashboardValue || !dashboardText) {
    return;
  }

  dashboardValue.textContent =
    sourceValue?.textContent?.trim() || "-";

  dashboardText.textContent =
    sourceDescription?.textContent?.trim() || "분석 전";
}

/**
 * 오늘 기록 수 반영
 */
function updateDashboardTodayCount() {
  const recordList = document.getElementById("recordList");
  const dashboardCount = document.getElementById(
    "dashboardTodayCount"
  );

  if (!dashboardCount) {
    return;
  }

  if (!recordList) {
    dashboardCount.textContent = "0";
    return;
  }

  const recordItems = Array.from(
    recordList.querySelectorAll("li")
  ).filter((item) => {
    const text = item.textContent.trim();

    return (
      text &&
      !text.includes("기록이 없습니다") &&
      !text.includes("표시할 기록이 없습니다")
    );
  });

  dashboardCount.textContent = String(recordItems.length);
}

/**
 * AI Care Alert 반영
 */
function updateDashboardCareAlert() {
  const sourceLevel = document.getElementById(
    "careAlertLevel"
  );
  const sourceText = document.getElementById(
    "careAlertText"
  );

  const dashboardLevel = document.getElementById(
    "dashboardAlertLevel"
  );
  const dashboardText = document.getElementById(
    "dashboardAlertText"
  );

  if (!dashboardLevel || !dashboardText) {
    return;
  }

  const levelText =
    sourceLevel?.textContent?.trim() || "분석 전";

  dashboardLevel.textContent = levelText;
  dashboardText.textContent =
    sourceText?.textContent?.trim() ||
    "현재 생성된 알림이 없습니다.";

  const card = dashboardLevel.closest(".summary-card");

  if (!card) {
    return;
  }

  card.classList.remove(
    "dashboard-status-safe",
    "dashboard-status-warning",
    "dashboard-status-danger"
  );

  if (
    levelText.includes("위험") ||
    levelText.includes("높음") ||
    levelText.includes("긴급")
  ) {
    card.classList.add("dashboard-status-danger");
    return;
  }

  if (
    levelText.includes("주의") ||
    levelText.includes("중간")
  ) {
    card.classList.add("dashboard-status-warning");
    return;
  }

  if (
    levelText.includes("안정") ||
    levelText.includes("낮음") ||
    levelText.includes("정상")
  ) {
    card.classList.add("dashboard-status-safe");
  }
}

/**
 * 완료하지 않은 Care Plan 수 반영
 */
function updateDashboardCarePlan() {
  const carePlanList = document.getElementById(
    "carePlanList"
  );
  const dashboardPending = document.getElementById(
    "dashboardPendingPlan"
  );

  if (!dashboardPending) {
    return;
  }

  if (!carePlanList) {
    dashboardPending.textContent = "0";
    return;
  }

  const checkboxes = Array.from(
    carePlanList.querySelectorAll(
      'input[type="checkbox"]'
    )
  );

  const pendingCount = checkboxes.filter(
    (checkbox) => !checkbox.checked
  ).length;

  dashboardPending.textContent = String(pendingCount);
}

/**
 * 기존 화면 내용이 변경되면 대시보드를 자동 갱신합니다.
 */
function initializeSummaryDashboard() {
  updateSummaryDashboard();

  const targetIds = [
    "careScoreValue",
    "careScoreDescription",
    "careAlertLevel",
    "careAlertText",
    "carePlanList",
    "recordList"
  ];

  const observer = new MutationObserver(() => {
    updateSummaryDashboard();
  });

  targetIds.forEach((id) => {
    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    observer.observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
  });

  document.addEventListener("change", (event) => {
    if (
      event.target.matches(
        '#carePlanList input[type="checkbox"]'
      )
    ) {
      updateDashboardCarePlan();
    }
  });
}
/* ========================================
   사이드바 화면 이동
======================================== */

/**
 * 사이드바 버튼을 눌렀을 때 해당 화면으로 이동합니다.
 *
 * @param {string} sectionId 이동할 영역의 id
 * @param {HTMLButtonElement} clickedButton 클릭한 메뉴 버튼
 */
function navigateToSection(sectionId, clickedButton) {
  const targetSection =
    document.getElementById(sectionId);

  if (!targetSection) {
    console.warn(
      `이동할 영역을 찾을 수 없습니다: ${sectionId}`
    );
    return;
  }

  setActiveNavigationButton(clickedButton);

  const isMobile =
    window.matchMedia("(max-width: 768px)").matches;

  const sidebar =
    document.querySelector("#portalPage .sidebar");

  const mainContainer =
    document.querySelector("#portalPage .main") ||
    document.querySelector("#portalPage main") ||
    document.querySelector("#portalPage .main-content");

  const headerHeight =
    isMobile && sidebar
      ? sidebar.getBoundingClientRect().height
      : 0;

  if (mainContainer) {
    const containerTop =
      mainContainer.getBoundingClientRect().top;

    const targetTop =
      targetSection.getBoundingClientRect().top;

    const scrollPosition =
      mainContainer.scrollTop +
      targetTop -
      containerTop -
      headerHeight -
      12;

    mainContainer.scrollTo({
      top: Math.max(scrollPosition, 0),
      behavior: "smooth"
    });

    return;
  }

  const targetTop =
    targetSection.getBoundingClientRect().top +
    window.scrollY -
    headerHeight -
    12;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: "smooth"
  });
}

/**
 * 선택한 사이드바 메뉴에 active 클래스를 적용합니다.
 *
 * @param {HTMLButtonElement} activeButton 활성화할 버튼
 */
function setActiveNavigationButton(activeButton) {
  const sidebarNav =
    document.getElementById("sidebarNav");

  if (!sidebarNav || !activeButton) {
    return;
  }

  const navigationButtons =
    sidebarNav.querySelectorAll("button");

  navigationButtons.forEach((button) => {
    button.classList.remove("active");
  });

  activeButton.classList.add("active");
}

/**
 * 아직 구현되지 않은 설정 메뉴 안내
 *
 * @param {HTMLButtonElement} clickedButton 클릭한 설정 버튼
 */
function openSettingsNotice(clickedButton) {
  setActiveNavigationButton(clickedButton);

  alert(
    "설정 화면은 아직 준비 중입니다.\n다음 개발 단계에서 추가할 예정입니다."
  );
}
let sectionNavigationObserver = null;

function initializeSectionNavigationObserver() {
  const sectionIds = [
  "summaryDashboardSection",
  "residentManagerSection",
  "searchSection",
  "observationSection",
  "aiSection",
  "reportSection"
];

  const sections = sectionIds
    .map((sectionId) =>
      document.getElementById(sectionId)
    )
    .filter(Boolean);

  if (sections.length === 0) {
    console.warn(
      "메뉴와 연결된 화면 영역을 찾을 수 없습니다."
    );
    return;
  }

  if (sectionNavigationObserver) {
    sectionNavigationObserver.disconnect();
  }

  const firstSection = sections[0];

  const scrollContainer =
    findScrollableParent(firstSection);

  const observerRoot =
    scrollContainer === document.documentElement
      ? null
      : scrollContainer;

  const observerOptions = {
    root: observerRoot,
    rootMargin: "-25% 0px -60% 0px",
    threshold: 0
  };

  sectionNavigationObserver =
    new IntersectionObserver(
      handleSectionNavigationIntersection,
      observerOptions
    );

  sections.forEach((section) => {
    sectionNavigationObserver.observe(section);
  });
}
function handleSectionNavigationIntersection(entries) {
  const visibleEntries = entries
    .filter((entry) => entry.isIntersecting)
    .sort(
      (entryA, entryB) =>
        entryA.boundingClientRect.top -
        entryB.boundingClientRect.top
    );

  if (visibleEntries.length === 0) {
    return;
  }

  const activeSection =
    visibleEntries[0].target;

  setActiveNavigationBySectionId(
    activeSection.id
  );
}
function setActiveNavigationBySectionId(sectionId) {

    // 1. 모든 메뉴 active 제거
    document
        .querySelectorAll(".sidebar button")
        .forEach(button => {
            button.classList.remove("active");
        });

    // 2. 현재 section 찾기
    const targetSection =
        document.getElementById(sectionId);

    if (!targetSection) return;

    // 3. 해당 메뉴 찾기
    const targetButton =
        document.querySelector(
            `.sidebar button[onclick*="${sectionId}"]`
        );

    if (!targetButton) return;

    // 4. 현재 메뉴만 active
    targetButton.classList.add("active");
}
/**
 * 지정한 요소를 실제로 스크롤하는 부모 영역을 찾습니다.
 *
 * @param {HTMLElement} element 기준 요소
 * @returns {HTMLElement} 스크롤 부모 또는 documentElement
 */
function findScrollableParent(element) {
  let parent = element.parentElement;

  while (parent) {
    const style =
      window.getComputedStyle(parent);

    const overflowY =
      style.overflowY;

    const canScroll =
      overflowY === "auto" ||
      overflowY === "scroll";

    const hasScrollableContent =
      parent.scrollHeight >
      parent.clientHeight;

    if (
      canScroll &&
      hasScrollableContent
    ) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return document.documentElement;
}
/**
 * 기존 사이드바 메뉴를 복제하여 모바일 전체 메뉴를 구성합니다.
 */
function initializeMobileMoreMenu() {
  const sidebarNav =
    document.getElementById("sidebarNav");

  if (!sidebarNav) {
    return;
  }

  updateMobileMoreMenuVisibility();
}
/**
 * 현재 화면에서 실제로 잘려 보이지 않는 메뉴만
 * ⋯ 목록에 생성합니다.
 */

/**
 * 모바일 전체 메뉴를 열거나 닫습니다.
 */
function toggleMobileMoreMenu(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const menu =
    document.getElementById("mobileMoreMenu");

  const button =
    document.getElementById(
      "mobileMoreMenuButton"
    );

  if (!menu || !button) {
    return;
  }

  const isCurrentlyClosed =
    menu.hasAttribute("hidden");

  if (isCurrentlyClosed) {
    /*
     * 현재 화면에서 잘린 메뉴만 다시 구성
     */
   
    menu.removeAttribute("hidden");

    button.setAttribute(
      "aria-expanded",
      "true"
    );
  } else {
    closeMobileMoreMenu();
  }
}
/**
 * 모바일 전체 메뉴를 닫습니다.
 */
function closeMobileMoreMenu() {
  const menu =
    document.getElementById("mobileMoreMenu");

  const button =
    document.getElementById("mobileMoreMenuButton");

  if (menu) {
    menu.setAttribute("hidden", "");
  }

  if (button) {
    button.setAttribute(
      "aria-expanded",
      "false"
    );
  }
}
/**
 * 모바일 메뉴가 화면을 벗어날 때만
 * ⋯ 버튼을 표시합니다.
 */
function updateMobileMoreMenuVisibility() {
  const sidebar =
    document.querySelector("#portalPage .sidebar");

  const sidebarNav =
    document.getElementById("sidebarNav");

  const moreButton =
    document.getElementById("mobileMoreMenuButton");

  const moreMenu =
    document.getElementById("mobileMoreMenu");

  if (
    !sidebar ||
    !sidebarNav ||
    !moreButton ||
    !moreMenu
  ) {
    return;
  }

  const isMobile =
    window.matchMedia("(max-width: 768px)").matches;

  const menuItems =
    Array.from(
      sidebarNav.querySelectorAll("button, a")
    );

  /*
   * PC에서는 모든 메뉴 표시
   */
  if (!isMobile) {
    menuItems.forEach((item) => {
      item.style.display = "";
    });

    sidebar.classList.remove("has-mobile-more");
    moreMenu.innerHTML = "";
    closeMobileMoreMenu();

    return;
  }

  /*
   * 계산 전에 모든 메뉴를 표시
   */
  menuItems.forEach((item) => {
    item.style.display = "";
  });

  sidebar.classList.remove("has-mobile-more");
  moreMenu.innerHTML = "";

  requestAnimationFrame(() => {
    /*
     * nav가 실제 사용할 수 있는 전체 너비
     */
    const availableWidth =
      sidebarNav.clientWidth;

    /*
     * ⋯ 버튼이 필요할 경우 확보할 공간
     */
    const moreButtonWidth = 50;

    const gap = 6;

    let usedWidth = 0;

    /*
     * 우선 모든 메뉴가 그냥 들어가는지 확인
     */
    const totalWidth =
      menuItems.reduce((sum, item, index) => {
        return (
          sum +
          item.offsetWidth +
          (index > 0 ? gap : 0)
        );
      }, 0);

    /*
     * 모두 들어가면 ⋯ 불필요
     */
    if (totalWidth <= availableWidth) {
      sidebar.classList.remove(
        "has-mobile-more"
      );

      closeMobileMoreMenu();
      return;
    }

    /*
     * 일부 메뉴가 숨겨져야 하므로
     * ⋯ 버튼 표시
     */
    sidebar.classList.add(
      "has-mobile-more"
    );

    const menuAvailableWidth =
      availableWidth - moreButtonWidth;

    const hiddenItems = [];

    menuItems.forEach((item, index) => {
      const itemWidth =
        item.offsetWidth;

      const requiredWidth =
        itemWidth +
        (usedWidth > 0 ? gap : 0);

      if (
        usedWidth + requiredWidth <=
        menuAvailableWidth
      ) {
        /*
         * 화면에 표시
         */
        item.style.display = "";

        usedWidth += requiredWidth;
      } else {
        /*
         * 화면에서는 숨김
         */
        item.style.display = "none";

        hiddenItems.push(item);
      }
    });

    /*
     * 화면에서 숨긴 메뉴만 ⋯에 생성
     */
    hiddenItems.forEach((originalItem) => {
      const moreMenuItem =
        document.createElement("button");

      moreMenuItem.type = "button";

      moreMenuItem.className =
        "mobile-more-menu-item";

      moreMenuItem.textContent =
        originalItem.textContent.trim();

      moreMenuItem.addEventListener(
        "click",
        () => {
          closeMobileMoreMenu();

          /*
           * 원래 메뉴 기능 실행
           */
          originalItem.click();
        }
      );

      moreMenu.appendChild(
        moreMenuItem
      );
    });
  });
}
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.log(
      "이 브라우저는 Service Worker를 지원하지 않습니다."
    );

    return;
  }

  navigator.serviceWorker
    .register("./service-worker.js", {
      /*
       * Service Worker 자체도
       * 브라우저 캐시 대신 최신 버전을 확인
       */
      updateViaCache: "none"
    })
    .then((registration) => {
      console.log(
        "Care Insight Service Worker 등록 완료:",
        registration.scope
      );

      /*
       * 페이지를 열 때마다
       * 새 Service Worker가 있는지 확인
       */
      registration.update();
    })
    .catch((error) => {
      console.error(
        "Service Worker 등록 실패:",
        error
      );
    });
}