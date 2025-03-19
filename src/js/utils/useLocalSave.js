import Cookies from "js-cookie"; // 載入第三方套件

const cookie = {
  set: (key, value) => {
    let val = value;
    if (typeof val === "object") {
      val = JSON.stringify(val);
    }
    Cookies.set(key, val);
  },

  get: (key) => {
    let content = Cookies.get(key);
    if (!content) {
      return null;
    }
    if (content[0] === "{" && content[content.length - 1] === "}") {
      content = JSON.parse(Cookies.get(key));
    }
    return content;
  },

  remove: (key) => {
    if (key === "all") {
      Object.keys(Cookies.get()).forEach((itemKey) => {
        Cookies.remove(itemKey);
      });
      return;
    }
    Cookies.remove(key);
  },
};

const local = {
  set: (key, value) => {
    let val = value;
    if (typeof val === "object") {
      val = JSON.stringify(val);
    }
    localStorage.setItem(key, val);
  },

  get: (key) => {
    if (key === "all") {
      const allData = {};

      for (let i = 0; i < localStorage.length; i += 1) {
        const localKey = localStorage.key(i);
        let loacVal = localStorage.getItem(localKey);

        try {
          loacVal = JSON.parse(loacVal);
        } catch (e) {
          console.log("");
        }

        allData[localKey] = loacVal;
      }
      return allData;
    }

    let content = localStorage.getItem(key);
    if (content === null) {
      return content;
    }
    if (content[0] === "{" && content[content.length - 1] === "}") {
      content = JSON.parse(content);
    }
    return content;
  },

  remove: (key) => {
    if (key === "all") {
      localStorage.clear();
      return;
    }
    localStorage.removeItem(key);
  },
};

export { local, cookie };
