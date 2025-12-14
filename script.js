/* ------------ STARFIELD BACKGROUND ------------ */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

let stars = [];
for (let i = 0; i < 1000; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3,
        s: Math.random() * 0.5 + 0.2
    });
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.s;
        if (star.y > canvas.height) star.y = 0;
    });
    requestAnimationFrame(animateStars);
}
animateStars();

/* ------------ REAL TIME CLOCK ------------ */
function updateClock() {
    document.getElementById("realTime").innerText =
        new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000);

/* ------------ SOUND SYSTEM ------------ */
const enableBtn = document.createElement("button");
enableBtn.innerText = "Enable Sound (click once)";
Object.assign(enableBtn.style, {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    padding: "14px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#00eaff",
    color: "black",
    fontWeight: "700",
    cursor: "pointer",
    zIndex: 99999
});
document.body.appendChild(enableBtn);

let audioCtx = null;
let masterGain = null;
let audioUnlocked = false;

async function enableAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 1.25;
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") await audioCtx.resume();
    audioUnlocked = true;
    enableBtn.style.display = "none";
}

function playTick() {
    if (!audioUnlocked) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    osc.type = "square";
    osc.frequency.value = 1000;

    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(1.0, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(g);
    g.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.11);
}

let tickInterval = null;
function startTicks() {
    if (tickInterval) return;
    playTick();
    tickInterval = setInterval(playTick, 1000);
}

enableBtn.addEventListener("click", async () => {
    await enableAudio();
    startTicks();
});

/* ------------ COUNTDOWN ------------ */
function updateCountdown() {
    let target = localStorage.getItem("targetDate");
    if (!target) return;

    let diff = new Date(target) - new Date();
    if (diff <= 0) {
        document.getElementById("countdown").innerText = "TIME'S UP!";
        return;
    }

    let secs = Math.floor(diff / 1000);
    let years = Math.floor(secs / 31536000);
    let months = Math.floor((secs % 31536000) / 2592000);
    let days = Math.floor((secs % 2592000) / 86400);
    let hrs = Math.floor((secs % 86400) / 3600);
    let mins = Math.floor((secs % 3600) / 60);
    let s = secs % 60;

    document.getElementById("countdown").innerHTML =
        `${years}y • ${months}m • ${days}d<br>${hrs}h : ${mins}m : ${s}s`;
}
setInterval(updateCountdown, 1000);

/* ------------ GOAL SETUP ------------ */
function saveGoal() {
    const task = taskInput.value;
    const date = dateInput.value;

    if (!task || !date) {
        alert("Enter task & date");
        return;
    }

    localStorage.setItem("taskName", task);
    localStorage.setItem("targetDate", date);

    taskName.innerText = task;
    setupBox.style.display = "none";
}

function editGoal() {
    setupBox.style.display = "block";
}

window.onload = () => {
    if (localStorage.getItem("targetDate")) {
        taskName.innerText = localStorage.getItem("taskName");
    } else {
        setupBox.style.display = "block";
    }
};
