let params = new URLSearchParams(window.location.search);
let level = params.get("level");
let passageTime = 60;
let currentPara = "";
let content = [];
let written_content = [];
let content_box = document.querySelector(".content_box");
let content_cover = document.querySelector(".content_cover");
let overlay = document.querySelector(".overlay");
let start = document.querySelector(".start");
let timer = document.querySelector(".timer");
let isActive = false;

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

  content_box.addEventListener("keydown", (event) => {
    if (!isActive) {
      return;
    }
    if (
      event.key === "Alt" ||
      event.key === "Shift" ||
      event.ctrlKey ||
      event.key === "CapsLock"
    ) {
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      if (written_content.length > 0) {
        written_content.pop();
        if (overlay.lastChild) {
          overlay.removeChild(overlay.lastChild);
        }
      }
      return;
    }

    if (event.key.length === 1) {
      written_content.push(event.key);
      check();
    }
  });
});

function check() {
  let i = written_content.length - 1;
  let span = document.createElement("span");
  span.className = "bg-blue-100 inline-block";
  if (written_content[i] == content[i]) {
    span.className += " " + "text-blue-500";
  } else {
    span.className += " " + "text-red-900";
  }
  span.textContent = content[i] == " " ? "\u00a0" : content[i];
  overlay.appendChild(span);
}

start.addEventListener("click", () => {
  isActive = true;
  let count = passageTime;
  timer.innerText = count;

  let counter = setInterval(() => {}, 1000);
});
