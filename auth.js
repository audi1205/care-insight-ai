/* Care Insight AI - auth.js */

/* ===========================
   로그인 화면 표시
=========================== */

function showPortal() {
  const loginPage =
    document.getElementById("loginPage");

  const portalPage =
    document.getElementById("portalPage");

  if (loginPage) {
    loginPage.style.display = "none";
  }

  if (portalPage) {
    portalPage.style.display = "flex";
  }
  if (
  typeof initializeMobileMoreMenu === "function"
  ) {
    initializeMobileMoreMenu();
  }
}

function showLogin() {
  const loginPage =
    document.getElementById("loginPage");

  const portalPage =
    document.getElementById("portalPage");

  if (portalPage) {
    portalPage.style.display = "none";
  }

  if (loginPage) {
    loginPage.style.display = "flex";
  }
}


/* ===========================
   로그인 / 로그아웃
=========================== */

function login() {
  const idInput =
    document.getElementById("userId");

  const pwInput =
    document.getElementById("userPw");

  if (!idInput || !pwInput) {
    alert("로그인 입력창을 찾을 수 없습니다.");
    return;
  }

  const id =
    idInput.value.trim();

  const pw =
    pwInput.value.trim();

  if (id === "admin" && pw === "1234") {
    localStorage.setItem(
      "isLogin",
      "true"
    );

    showPortal();

    /*
     * 로그인 직후 데이터 화면 갱신
     */
    if (
      typeof renderResidentSelect === "function"
    ) {
      renderResidentSelect();
    }
  } else {
    alert(
      "아이디 또는 비밀번호가 올바르지 않습니다."
    );

    pwInput.focus();
  }
}

function logout() {
  localStorage.removeItem("isLogin");

  showLogin();

  const idInput =
    document.getElementById("userId");

  const pwInput =
    document.getElementById("userPw");

  if (idInput) {
    idInput.value = "";
    idInput.focus();
  }

  if (pwInput) {
    pwInput.value = "";
  }
}