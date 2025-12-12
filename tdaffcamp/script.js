// --- Trackdesk CID Retrieval Function (Robust Version) ---
function getTrackdeskCid() {
    // 1. Check if the global variable was set by the head script
    if (window.tdCid) {
        console.log("Debug: CID found in window.tdCid -> " + window.tdCid);
        return window.tdCid;
    }

    // 2. Helper to read cookies by name
    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return decodeURIComponent(match[2]);
        return null;
    }

    // 3. Check BOTH spellings (Documentation has 'trakdesk', reality is likely 'trackdesk')
    var raw = getCookie("trackdesk_cid") || getCookie("trakdesk_cid");

    if (!raw) {
        console.log("Debug: No Trackdesk cookie found.");
        return null;
    }

    // 4. Parse if JSON
    if (raw.charAt(0) === "{") {
        try {
            var obj = JSON.parse(raw);
            return obj && obj.cid ? obj.cid : null;
        } catch (e) {
            console.warn("Trackdesk cookie JSON parse failed:", e);
            return null;
        }
    }
    
    console.log("Debug: CID found in cookie -> " + raw);
    return raw;
}
// --- End CID Function ---

document.addEventListener("DOMContentLoaded", function () {
    let currentQuestionIndex = 2;
    let answers = {
        question1: null,
        question2: null,
        question3: null
    };

    // --- TRACKING: Header Call Button ---
    const headerCallBtn = document.getElementById("headerCallBtn");
    if (headerCallBtn) {
        headerCallBtn.addEventListener("click", () => {
            console.log("Debug: Header button clicked.");
            
            // fbq is handled by the inline onclick in HTML.
            
            var cid = getTrackdeskCid();
            if (cid) {
                var url = "https://tsh.trackdesk.com/tracking/conversion/v1"
                    + "?status=CONVERSION_STATUS_APPROVED"
                    + "&cid=" + encodeURIComponent(cid)
                    + "&conversionTypeCode=callbutton";
                
                // Fire the pixel
                var pixel = new Image();
                pixel.src = url;
                console.log("Debug: Conversion pixel FIRED to: " + url);
            } else {
                console.warn("Debug: Trackdesk CID not found. Conversion NOT sent. (Did you visit with ?linkId= parameters?)");
            }
        });
    }

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

    function showDisqualification() {
        alert("Unfortunately, you do not qualify at this time.");
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
                    <h3>Congratulations! You Qualify for a CGM from medicare Benefits.</h3>
                    <h1>CALL NOW TO CLAIM YOUR CGM </h1>
                    <a href="tel:18338070586" class="call-button" id="callNowBtn">
                        <i class="fas fa-phone"></i> 1-833-807-0586   
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

                // --- TRACKING: Final Call Button ---
                const callBtn = document.getElementById("callNowBtn");
                if (callBtn) {
                    callBtn.addEventListener("click", () => {
                        console.log("Debug: Final call button clicked.");
                        if (typeof fbq === "function") {
                            fbq("track", "Lead");
                        }
                        
                        var cid = getTrackdeskCid();
                        if (cid) {
                            var url = "https://tsh.trackdesk.com/tracking/conversion/v1"
                                + "?status=CONVERSION_STATUS_APPROVED"
                                + "&cid=" + encodeURIComponent(cid)
                                + "&conversionTypeCode=callbutton";
                            
                            // Fire the pixel
                            var pixel = new Image();
                            pixel.src = url;
                            console.log("Debug: Conversion pixel FIRED to: " + url);
                        } else {
                            console.warn("Debug: Trackdesk CID not found. Conversion NOT sent.");
                        }
                    });
                }
            }, 10);
        }
    }

    document.querySelectorAll("#question2 .answer-button").forEach((button, index) => {
        button.addEventListener("click", function () {
            const answer = index === 0 ? 'yes' : 'no';
            
            // Logic for the 'Yes' button
            if (index === 0) {
                setTimeout(() => {
                    const hides = document.querySelectorAll('#hides');
                    hides.forEach(el => el.style.display = 'none');
                }, 600);
            }
            
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

