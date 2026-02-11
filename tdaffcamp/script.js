document.addEventListener("DOMContentLoaded", function () {
            let currentQuestionIndex = 2;
            let answers = {
                question1: null,
                question2: null,
                question3: null
            };

            function nextQuestion(nextIndex, answer) {
                const currentQuestion = document.querySelector(`#question${currentQuestionIndex}`);
                const nextQuestion = document.querySelector(`#question${nextIndex}`);

                answers[`question${currentQuestionIndex}`] = answer;

                if (currentQuestion) {
                    currentQuestion.classList.remove('fade-in');
                    
                    setTimeout(() => {
                        currentQuestion.classList.remove('active');
                        currentQuestion.style.display = "none";
                        
                        if (nextQuestion) {
                            nextQuestion.classList.add('active');
                            nextQuestion.style.display = "block";
                            
                            setTimeout(() => {
                                nextQuestion.classList.add('fade-in');
                                currentQuestionIndex = nextIndex;
                            }, 10);
                        }
                        
                        if (nextIndex === 4) {
                            checkQualification();
                        }
                    }, 600);
                }
            }

            function checkQualification() {
                const qualifies = answers.question2 === 'yes' && 
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
          
            function showSections() {
                const sections = ["section1", "section2"];
                let currentSectionIndex = 0;

                function showNextSection() {
                    if (currentSectionIndex < sections.length) {
                        const currentSection = document.querySelector(`#${sections[currentSectionIndex]}`);
                        if (currentSection) {
                            currentSection.classList.add('active');
                            currentSection.style.display = "block";
                            
                            setTimeout(() => {
                                currentSection.classList.add('fade-in');
                            }, 10);

                            setTimeout(() => {
                                currentSection.classList.remove('fade-in');
                                
                                setTimeout(() => {
                                    currentSection.classList.remove('active');
                                    currentSection.style.display = "none";
                                    currentSectionIndex++;
                                    showNextSection();
                                }, 600);
                            }, 600);
                        }
                    } else {
                        showApproval();
                    }
                }

                showNextSection();
            }

            function showApproval() {
                const finalSection = document.querySelector("#finalSection");
                if (finalSection) {
                    finalSection.innerHTML = `
                        <div class="finalsection">
                            
                            <h3>Congratulations! You Qualify for a CGM from
medicare Benefits.
</h3>
                            
                            
                            <h1>CALL NOW TO CLAIM YOUR CGM </h1>
                            <a href="tel:18333803691" class="call-button" id="callNowBtn">
                                <i class="fas fa-phone"></i> 1-833-380-3691   
                            </a>
                            <h4>Pre-Order Hold Expires in: <span style="color: #ff0000;">00:00</span></h4>
                            <p><i class="fas fa-exclamation-triangle"></i> LOW STOCK ALERT</p>
                        </div>
                    `;
                    
                    finalSection.classList.add('active');
                    finalSection.style.display = "block";
                    
                    setTimeout(() => {
                        finalSection.classList.add('fade-in');
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

            document.querySelectorAll("#question2 .answer-button").forEach((button, index) => {
                button.addEventListener("click", function () {
                    const answer = index === 0 ? 'yes' : 'no';
                    nextQuestion(3, answer);
                });
            });

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

