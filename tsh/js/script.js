document.addEventListener("DOMContentLoaded", function () {
  let currentQuestionIndex = 1;
  let answers = {
    question1: null,
    question2: null,
    question3: null
  };

  // Function to show the next question
  function nextQuestion(nextIndex, answer) {
    const currentQuestion = document.querySelector(`#question${currentQuestionIndex}`);
    const nextQuestion = document.querySelector(`#question${nextIndex}`);

    // Store the answer
    answers[`question${currentQuestionIndex}`] = answer;

    if (currentQuestion) {
      currentQuestion.style.opacity = 0;
      setTimeout(() => {
        currentQuestion.style.display = "none";
        if (nextQuestion) {
          nextQuestion.style.display = "block";
          setTimeout(() => {
            nextQuestion.style.opacity = 1;
            currentQuestionIndex = nextIndex;
          }, 10);
        }
        // If the third question is answered, check qualification
        if (nextIndex === 4) {
          checkQualification();
        }
      }, 1000);
    }
  }

  // Function to check if user qualifies
  function checkQualification() {
    const qualifies = answers.question1 === 'yes' && 
                     answers.question2 === 'yes' && 
                     answers.question3 === 'before1961';

    if (qualifies) {
      showSections();
    } else {
      showDisqualification();
    }
  }

  // Function to show disqualification message
  function showDisqualification() {
  window.location.href = "non-qualified.html";
}

  // Function to show sections 1, 2, and 3 one by one
  function showSections() {
    const sections = ["section1", "section2", "section3"];
    let currentSectionIndex = 0;

    function showNextSection() {
      if (currentSectionIndex < sections.length) {
        const currentSection = document.querySelector(`#${sections[currentSectionIndex]}`);
        if (currentSection) {
          currentSection.style.display = "block";
          setTimeout(() => {
            currentSection.style.opacity = 1;
          }, 10);

          setTimeout(() => {
            currentSection.style.opacity = 0;
            setTimeout(() => {
              currentSection.style.display = "none";
              currentSectionIndex++;
              showNextSection();
            }, 1000);
          }, 2000);
        }
      } else {
        showApproval();
      }
    }

    showNextSection();
  }

  // Function to show approval and call button
  function showApproval() {
  const finalSection = document.querySelector("#finalSection");
  if (finalSection) {
    finalSection.innerHTML = `
      <div class="finalsection">
        <p><i class="fas fa-exclamation-triangle"></i> LOW STOCK ALERT</p>
        <h3>YOUR ORDER IS CONFIRMED</h3>
        <img src="./images/Libre-Confirmed.png" alt="">
        <p style="color: #222222; font-weight: 500;">
          You qualify for a CGM from Medicare!
        </p>
          <h5>YOU MUST <span style="color: #ff0000;">CALL"</span> </span> to confirm shipping details & complete your order</h5>
          
        <h1>TAP TO CALL</h1>
        <a href="tel:18337230131" class="call-button" id="callNowBtn">
          <i class="fas fa-phone"></i> CLICK HERE TO CALL NOW AND CONFIRM YOUR ORDER
        </a>
        <h4>Pre-Order Hold Expires in: <span style="color: #ff0000;">00:00</span></h4>
      </div>
    `;
    finalSection.style.display = "block";
    setTimeout(() => {
      finalSection.style.opacity = 1;
      const countdownDuration = 2 * 60;
      const display = finalSection.querySelector("h4 span");
      startCountdown(countdownDuration, display);

      const callBtn = document.getElementById("callNowBtn");
      if (callBtn) {
        callBtn.addEventListener("click", () => {
          if (typeof fbq === "function") {
            fbq("track", "Lead");
          }
        });
      }
    }, 10);
  }
}


  // Assign click handlers to question 1 buttons
  document.querySelectorAll("#question1 .answer-button").forEach((button, index) => {
    button.addEventListener("click", function () {
      const answer = index === 0 ? 'yes' : 'no';
      nextQuestion(2, answer);
    });
  });

  // Assign click handlers to question 2 buttons
  document.querySelectorAll("#question2 .answer-button").forEach((button, index) => {
    button.addEventListener("click", function () {
      const answer = index === 0 ? 'yes' : 'no';
      nextQuestion(3, answer);
    });
  });

  // Assign click handlers to question 3 buttons
  document.querySelectorAll("#question3 .answer-button").forEach((button, index) => {
    button.addEventListener("click", function () {
      let answer;
      if (index === 0) answer = 'before1961';
      else if (index === 1) answer = '1961-2000';
      else answer = 'after2000';
      nextQuestion(4, answer);
    });
  });
});

function startCountdown(duration, display) {
  let timer = duration, minutes, seconds;
  const interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(interval);
      display.textContent = "00:00";
    }
  }, 1000);

}
