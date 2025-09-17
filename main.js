let params = new URLSearchParams(window.location.search);
let level = params.get("level");
let passageTime = 60;
let currentPara = "";
let content = [];
let written_content = [];
let startTime = null;
let mistakes_count = 0;
let content_box = document.querySelector(".content_box");
let content_cover = document.querySelector(".content_cover");
let overlay = document.querySelector(".overlay");
let start = document.querySelector(".start");
let timer = document.querySelector(".timer");
let wpm = document.querySelector(".wpm");
let cpm = document.querySelector(".cpm");
let accuracy = document.querySelector(".accuracy");
let mistake = document.querySelector(".mistake");
let typing_level = document.querySelector(".level");
let isActive = false;

async function getData() {
  let res = await fetch("dataset.json");
  let data = await res.json();

  let paras = data[level].para;
  passageTime = data[level].time;
  typing_level.innerText = level;

  let random_para = paras[Math.floor(Math.random() * paras.length)];

  return random_para;
}

getData().then((passage) => {
  currentPara = passage;
  content = passage.split("");
  content_box.value = passage;
  timer.innerText = passageTime;

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
    mistakes_count++;
  }
  span.textContent = content[i] == " " ? "\u00a0" : content[i];
  overlay.appendChild(span);
}

start.addEventListener("click", () => {
  isActive = true;
  startTime = new Date();
  let count = passageTime;

  let counter = setInterval(() => {
    timer.innerText = --count;
    if (count <= 0) {
      clearInterval(counter);
      isActive = false;
      calculateResult();
    }
  }, 1000);
});

// Result
function calculateResult() {
  let endTime = new Date().getTime();
  let timeTaken = (endTime - startTime) / 1000;
  let takenMinutes = timeTaken / 60;

  let correctChars = written_content.filter(
    (char, index) => char === content[index]
  ).length;
  let totalTyped = written_content.length;

  let cpm_count = Math.round(correctChars / takenMinutes);
  let wpm_count = Math.round(correctChars / 5 / takenMinutes);
  let acc =
    totalTyped > 0
      ? Math.round((correctChars / totalTyped) * 100).toFixed(2)
      : 0;
  cpm.innerText = cpm_count;
  wpm.innerText = wpm_count;
  accuracy.innerText = acc;
  mistake.innerHTML = mistakes_count;
}
