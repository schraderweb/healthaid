const q1BtnYes = document.querySelector(".q1-btn-yes");
const q1BtnNo = document.querySelector(".q1-btn-no");
const q2BtnYes = document.querySelector(".q2-btn-yes");
const q2BtnNo = document.querySelector(".q2-btn-no");
const loading3 = document.getElementById("loading3");
const loading2 = document.getElementById("loading2");
const loading1 = document.getElementById("loading1");
const q2Btn = document.querySelector("#q2");
const q1Btn = document.querySelector("#q1");
const timerElement = document.getElementById('timer');

let choiceUnder = null;
let choiceMedical = null;

const timeLimitInMinutes = 4;
let timeLimitInSeconds = timeLimitInMinutes * 60;
let timerInterval;

function startTimer() {
  timeLimitInSeconds--;
  let minutes = Math.floor(timeLimitInSeconds / 60);
  let seconds = timeLimitInSeconds % 60;

  if (timeLimitInSeconds < 0) {
    timerElement.textContent = '00:00';
    clearInterval(timerInterval);
    return;
  }

  timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function showText4() {
  if (choiceUnder === false || choiceMedical === true) {
    timerInterval = setInterval(startTimer, 1000);
    document.getElementById("qualify").style.display = "block";
  } else {
    document.getElementById("dontqualify").style.display = "block";
  }
}

function showText3() {
  loading3.style.display = "block";
  setTimeout(() => {
    loading3.style.display = "none";
    showText4();
  }, 1000);
}

function showText2() {
  loading2.style.display = "block";
  setTimeout(() => {
    loading2.style.display = "none";
    showText3();
  }, 1000);
}

function showText1() {
  loading1.style.display = "block";
  setTimeout(() => {
    loading1.style.display = "none";
    showText2();
  }, 1000);
}

q1BtnYes.addEventListener("click", () => {
  q1Btn.style.display = "none";
  q2Btn.style.display = "block";
  choiceUnder = true;
});

q1BtnNo.addEventListener("click", () => {
  q1Btn.style.display = "none";
  q2Btn.style.display = "block";
  choiceUnder = false;
});

q2BtnYes.addEventListener("click", () => {
  q2Btn.style.display = "none";
  choiceMedical = true;
  showText1();
});

q2BtnNo.addEventListener("click", () => {
  q2Btn.style.display = "none";
  choiceMedical = false;
  loading1.style.display = "block";
  setTimeout(() => {
    loading1.style.display = "none";
    loading2.style.display = "block";
    setTimeout(() => {
      loading2.style.display = "none";
      loading3.style.display = "block";
      setTimeout(() => {
        loading3.style.display = "none";
        document.getElementById("dontqualify").style.display = "block";
      }, 1000);
    }, 1000);
  }, 1000);
});
