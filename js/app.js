const q1BtnYes = document.querySelector(".q1-btn-yes");
const q1BtnNo = document.querySelector(".q1-btn-no");
const q2BtnYes = document.querySelector(".q2-btn-yes");
const q2BtnNo = document.querySelector(".q2-btn-no");
const loading3 = document.getElementById("loading3");
const loading2 = document.getElementById("loading2");
const loading1 = document.getElementById("loading1");

const q2Btn = document.querySelector("#q2");
const q1Btn = document.querySelector("#q1");
let choiceUnder = true;
let choiceMedical = true;

const showText4 = () => {

    if(choiceMedical == false && choiceUnder == true ) {
        document.getElementById("qualify").style.display = "block";
    }else {
        document.getElementById("dontqualify").style.display = "block";
    }
}
const showText3 = () => {
    
    loading3.style.display = "block";
    setTimeout(() => {
        console.log('Foo bar1');
        loading3.style.display = "none";
        showText4();
      }, 1000)
}
const showText2 = () => {
    
    loading2.style.display = "block";
    setTimeout(() => {
        console.log('Foo bar1');
        loading2.style.display = "none";
        showText3();
      }, 1000)
}
const showText1 = () => {
    
    loading1.style.display = "block";
    setTimeout(() => {
        console.log('Foo bar');
        loading1.style.display = "none";
        showText2();
      }, 1000)
}

q1BtnYes.addEventListener("click", () => {
    q1Btn.style.display = "none";
    q2Btn.style.display = "block";
    q1Btn.classList.add("fade-in");
    q2Btn.classList.add("fade-out");
    choiceUnder = true;
});
q1BtnNo.addEventListener("click", () => {
    q1Btn.style.display = "none";
    q2Btn.style.display = "block";
    q2Btn.classList.add("fade-in");
    loading1.classList.add("fade-out");
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
    showText1();
});




