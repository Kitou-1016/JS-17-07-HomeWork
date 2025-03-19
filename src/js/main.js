import "../css/normalize.css";
import "../css/style.css";
import axios from "axios";
// import Cookies from "js-cookie";
import { local } from "./utils/useLocalSave.js";
import { useGetRef } from "./utils/useGetRef.js";
import { info, parseReq } from "./utils/useInputData.js";

const { username, password, usernameError, passwordError, terms, btn, loginPage, successPage, logup } = useGetRef();

let isLogin = false;
let initToken = local.get("token");
// let initToken = Cookies.get("token");

const errorMessageShow = () => {
  isLogin = false;
  if (info.username.error) {
    usernameError.classList.remove("hidden");
    usernameError.textContent = info.username.error;
  }
  if (info.password.error) {
    passwordError.classList.remove("hidden");
    passwordError.textContent = info.password.error;
  }
};

const checkPageStatus = () => {
  // 檢查登入資料

  const token = local.get("token");

  // const token = Cookies.get("token");

  if (token) {
    loginPage.classList.add("hidden");
    successPage.classList.remove("hidden");
    initToken = token;
  } else {
    loginPage.classList.remove("hidden");
    successPage.classList.add("hidden");
    initToken = null;
    isLogin = false;
  }
};

const sendLogin = async (req) => {
  try {
    const res = await axios.post("https://vue-lessons-api.vercel.app/auth/login", req);
    console.log(res);

    return res.data;
  } catch (err) {
    const errorRes = err.response.data.error_message;
    Object.keys(errorRes).forEach((key) => {
      info[key].error = errorRes[key];
    });
    errorMessageShow();
    return { success: false, data: {} };
  }
};

const inputUpdate = (e) => {
  const isTerms = e.target.id === "terms";

  info[e.target.id].value = !isTerms ? e.target.value : e.target.checked;
};

username.addEventListener("input", inputUpdate);
password.addEventListener("input", inputUpdate);
terms.addEventListener("input", inputUpdate);

/**
  { username: "mike", password: "7654321" }
*/
// 登入
btn.addEventListener("click", async () => {
  if (isLogin) return;
  isLogin = true;
  const req = parseReq();
  if (!req.terms) {
    alert("請閱讀使用者條款");
    isLogin = false;
    return;
  }
  const data = await sendLogin(req);

  local.set("token", data.data.token);
  local.set("name", { name: "kitou" });
  local.set("age", 30);
  local.set("email", "12345@gmail.com");

  setTimeout(() => {
    const data4 = local.get("all");
    console.log("data4:", data4);
  }, 2000);
});

// 登出
logup.addEventListener("click", () => {
  // Cookies.remove("token");
  username.value = "";
  password.value = "";
  local.remove("token");
});

setInterval(() => {
  if (initToken !== local.get("token")) {
    checkPageStatus();
  }
}, 1000);
