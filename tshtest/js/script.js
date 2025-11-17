document.addEventListener("DOMContentLoaded", function () {
  // Current question index starts at 1, as the original Q1 was removed.
  let currentQuestionIndex = 1;
  let answers = {
    // question1 is now the 'insulin' question (old Q2)
    question1: null,
    // question2 is now the 'birth year' question (old Q3)
    question2: null
  };
  
  // Cache the quiz button to show/hide the quiz
  const quizButton = document.querySelector('.quiz-button');
  const questionSection = document.querySelector('.question-section');
  const infoSection = document.querySelector('.info-section');
  
  // Hide questions initially and set up quiz start button
  if (questionSection) questionSection.style.display = 'none';

  if (quizButton) {
      quizButton.addEventListener('click', function() {
          if (infoSection) infoSection.style.display = 'none';
          if (questionSection) questionSection.style.display = 'block';
          
          // Ensure the first question is visible
          const firstQuestion = document.querySelector("#question1");
          if (firstQuestion) {
              firstQuestion.style.opacity = 1;
          }
      });
  }


  // Function to show the next question
  function nextQuestion(nextIndex, answer) {
    const currentQuestion = document.querySelector(`#question${currentQuestionIndex}`);
    const nextQuestion = document.querySelector(`#question${nextIndex}`);

    // Store the answer.
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
        
        // If the qualification check index (3) is reached, run the check
        if (nextIndex === 3) {
          checkQualification();
        }
      }, 1000);
    }
  }

  // Function to check if user qualifies
  function checkQualification() {
    // Qualification: Must take insulin ('yes') AND be born before 1961 ('before1961').
    const qualifies = answers.question1 === 'yes' &&
                      answers.question2 === 'before1961';

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

  // Function to show sections 1, 2, and 3 one by one (Fastened)
  function showSections() {
    const sections = ["section1", "section2", "section3"];
    let currentSectionIndex = 0;
    const DISPLAY_TIME = 500; // 0.5 seconds for quick loading transition

    // Ensure the question section is hidden when we start loading
    if (questionSection) {
         questionSection.style.display = "none";
    }

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
            }, DISPLAY_TIME); // Fade out time
          }, DISPLAY_TIME); // Display time
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
      // Re-populate innerHTML with updated text and phone number
      finalSection.innerHTML = `
        <div class="finalsection">
          <p><i class="fas fa-exclamation-triangle"></i> LOW STOCK ALERT</p>
          <h3>YOU QUALIFY FOR MEDICARE CGM!</h3>
          <img src="./images/Libre-Confirmed.png" alt="">
          <p style="color: #222222; font-weight: 500;">
            You qualify for a CGM from Medicare!
          </p>
          <h5>YOU MUST <span style="color: #ff0000;">TAP <span style="text-decoration: underline;">"CALL"</span> </span> to confirm shipping details & complete your order</h5>
          <h1>TAP TO CALL</h1>
          <a href="tel:18334483410" class="call-button" id="callNowBtn">
            <i class="fas fa-phone"></i> CLICK HERE TO CALL NOW AND CONFIRM YOUR ORDER 1-833-448-3410
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


  // --- Event Listeners for Quiz Buttons (NO INLINE ONCLICK) ---

  // Assign click handlers to question 1 buttons ('Do you take insulin...')
  document.querySelectorAll("#question1 .answer-button").forEach((button, index) => {
    button.addEventListener("click", function () {
      const answer = index === 0 ? 'yes' : 'no';
      // Go to the next question (which is now question 2)
      nextQuestion(2, answer);
    });
  });

  // Assign click handlers to question 2 buttons ('What year were you born?')
  document.querySelectorAll("#question2 .answer-button").forEach((button, index) => {
    button.addEventListener("click", function () {
      let answer;
      if (index === 0) answer = 'before1961';
      else if (index === 1) answer = '1961-2000';
      else answer = 'after2000';
      // Go to the qualification check (next index is 3)
      nextQuestion(3, answer);
    });
  });
});

// Global function for the countdown timer
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
