let timer;
let isRunning = false;
let timeLeft = 25 * 60; // 25 minutes in seconds
let sessionCount = 0;
let currentSession = 'work';
let paused = false;

const workDurationInput = document.getElementById('work-duration');
const shortBreakDurationInput = document.getElementById('short-break-duration');
const longBreakDurationInput = document.getElementById('long-break-duration');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const resetButton = document.getElementById('reset');
const shortBreakButton = document.getElementById('short-break');
const longBreakButton = document.getElementById('long-break');
const sessionTypeDisplay = document.getElementById('session-type');
const sessionCountDisplay = document.getElementById('session-count');
const audio = document.getElementById('audio');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function playSound() {
    audio.play();
}

function startTimer(duration, callback) {
    if (isRunning) return;

    timeLeft = duration;
    updateDisplay();
    isRunning = true;

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            playSound();
            if (callback) callback();
        }
    }, 1000);
}

function startWorkSession() {
    currentSession = 'work';
    sessionTypeDisplay.textContent = 'Work Session';
    const workDuration = parseInt(workDurationInput.value) * 60;
    startTimer(workDuration, () => {
        sessionCount++;
        sessionCountDisplay.textContent = sessionCount;
        if (sessionCount % 4 === 0) {
            startLongBreak();
        } else {
            startShortBreak();
        }
    });
}

function startShortBreak() {
    currentSession = 'short break';
    sessionTypeDisplay.textContent = 'Short Break';
    const shortBreakDuration = parseInt(shortBreakDurationInput.value) * 60;
    startTimer(shortBreakDuration, () => {
        startWorkSession();
    });
}

function startLongBreak() {
    currentSession = 'long break';
    sessionTypeDisplay.textContent = 'Long Break';
    const longBreakDuration = parseInt(longBreakDurationInput.value) * 60;
    startTimer(longBreakDuration, () => {
        startWorkSession();
    });
}

function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timer);
    isRunning = false;
    paused = true;
}

function resumeTimer() {
    if (!paused) return;

    paused = false;
    isRunning = true;

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            playSound();
            if (currentSession === 'work') {
                sessionCount++;
                sessionCountDisplay.textContent = sessionCount;
                if (sessionCount % 4 === 0) {
                    startLongBreak();
                } else {
                    startShortBreak();
                }
            } else {
                startWorkSession();
            }
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    paused = false;
    sessionCount = 0;
    timeLeft = parseInt(workDurationInput.value) * 60;
    currentSession = 'work';
    sessionTypeDisplay.textContent = 'Work Session';
    sessionCountDisplay.textContent = sessionCount;
    updateDisplay();
}

startButton.addEventListener('click', startWorkSession);
pauseButton.addEventListener('click', pauseTimer);
resumeButton.addEventListener('click', resumeTimer);
resetButton.addEventListener('click', resetTimer);
shortBreakButton.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    paused = false;
    startShortBreak();
});
longBreakButton.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    paused = false;
    startLongBreak();
});

updateDisplay(); // Initialize the display

// Dark mode toggle
const darkModeToggle = document.createElement('button');
darkModeToggle.textContent = 'Toggle Dark Mode';
darkModeToggle.className = 'dark-mode-toggle';
darkModeToggle.style.padding = '10px';
darkModeToggle.style.fontSize = '16px';
darkModeToggle.style.cursor = 'pointer';
darkModeToggle.style.border = 'none';
darkModeToggle.style.borderRadius = '5px';
darkModeToggle.style.background = '#007BFF';
darkModeToggle.style.color = 'white';
darkModeToggle.style.marginTop = '10px';
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
