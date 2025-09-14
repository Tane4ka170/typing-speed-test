let params = new URLSearchParams(window.location.search);
let level = params.get("level");
let passageTime = 60;
let currentPara = "";
let content = [];
let written_content = [];
let content_box = document.querySelector(".content_box");

async function getData() {
  let res = await fetch("dataset.json");
  console.log(res);
  let data = await res.json();
  console.log(data);

  let paras = data[level].para;
  passageTime = data[level].time;

  let random_para = paras[Math.floor(Math.random() * paras.length)];

  return random_para;
}

getData().then((passage) => {
  currentPara = passage;
  content = passage.split("");
  content_box.value = passage;

  content_box.addEventListener("keydown", (event) => {});
});
