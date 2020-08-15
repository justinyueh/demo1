const languages = {
  "en-US": {
    title: "Address Book",
    ID: "ID",
    Name: "Name",
    Location: "Location",
    Office: "Office",
    Phone: "Phone",
    Cell: "Cell",
    Delete: "Delete",
    Update: "Update",
    Add: "Add",
    Close: "Close",
    text1: "Nothing changed.",
    text2: "Invalid phone number."
  },
  "zh-CN": {
    title: "通讯录",
    ID: "标示",
    Name: "姓名",
    Location: "地址",
    Office: "办公室",
    Phone: "电话",
    Cell: "手机",
    Delete: "删除",
    Update: "更新",
    Add: "添加",
    Close: "关闭",
    text1: "没有变化。",
    text2: "手机号码格式有误."
  }
};

const locale = languages[window.navigator.language] || languages["en-US"];
console.log(window.navigator.language);

export default function locales(text) {
  return locale[text] || text;
}
