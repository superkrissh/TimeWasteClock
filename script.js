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

/* ------------ SOUND SYSTEM (WEB AUDIO API) ------------ */

const enableBtn = document.createElement("button");
enableBtn.innerText = "Enable Sound (click once)";
enableBtn.style.position = "fixed";
enableBtn.style.right = "20px";
enableBtn.style.bottom = "20px";
enableBtn.style.padding = "14px 18px";
enableBtn.style.borderRadius = "10px";
enableBtn.style.border = "none";
enableBtn.style.background = "#00eaff";
enableBtn.style.color = "black";
enableBtn.style.fontWeight = "700";
enableBtn.style.cursor = "pointer";
enableBtn.style.zIndex = 99999;
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
    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }
    audioUnlocked = true;
    enableBtn.style.display = "none";
}

function playTick() {
    if (!audioUnlocked || !audioCtx) return;

    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 1000;

    const g = audioCtx.createGain();
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

window.addEventListener("click", async () => {
    if (!audioUnlocked) {
        await enableAudio();
        startTicks();
    }
});

/* ------------ COUNTDOWN ------------ */
function updateCountdown() {
    let target = localStorage.getItem("targetDate");
    if (!target) return;

    let now = new Date();
    let end = new Date(target);
    let diff = end - now;

    if (diff <= 0) {
        document.getElementById("countdown").innerHTML = "TIME'S UP!";
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
    let task = document.getElementById("taskInput").value;
    let date = document.getElementById("dateInput").value;

    if (!task || !date) {
        alert("Enter task & date");
        return;
    }

    localStorage.setItem("taskName", task);
    localStorage.setItem("targetDate", date);

    document.getElementById("taskName").innerText = task;
    document.getElementById("setupBox").style.display = "none";
}

function editGoal() {
    document.getElementById("setupBox").style.display = "block";
}

window.onload = () => {
    if (localStorage.getItem("targetDate")) {
        document.getElementById("taskName").innerText =
            localStorage.getItem("taskName");
    } else {
        document.getElementById("setupBox").style.display = "block";
    }
};

/* ------------ EGO-KILLER MOTIVATION MESSAGES ------------ */

const egoMessages = [
    "Stay cool!",
    "Raise your Ego so high...Losing people fells like blessing not a loss",
    "Level up so hard...their biggest flex is that they used to know you",
    "Their is still time To Be who you wanted to be",
    "Yor life isn't yours if you always care what other think",
    "Darling they always came back when they see you are glowing without them",
    "Grow your one skill everyday and one day that skill became your SuperPower!",
    "I am Billionaire...Ilive Billionaire...I fell Billionaire...I Atrract Billionaire...I think Billionaire...I become Billionaire",
    "If people don't match your mindset, then change people ,Not the Mindset",
    "When you start getting in shape and suddenly they start liking you for your personality",
    "Dont stop when you are tired..stop when you are done",
    "The day you start respecting yourself and your work... you will unstopable",
    "Practice makes perfect",
    "Fuck fellings bro...Focus on the come back",
    "Mein tujhe bhav hi kha deti hoon.",
    "Chal tu ab bhag yaha se.",
    "Tu seriously lene layak hi nahi hai.",
    "Dont compare yourself to me... to train to impress girls,I train to be the Best",
    "DSA padhle… warna fir rona mat.",
    "Uske peeche apna time waste mat kar.",
    "Focus. Tu bas time barbaad kar raha hai.",
    "Aaj nahi karegaa toh kabhi nahi karega.",
    "Jo kaam abhi hai, woh abhi kar.",
    "Aaj ka pain = Kal ka respect.",
    "Tu karta hi kya hai poore din?",
    "Bas phone scroll karna hai kya life me?",
    "Tu itna potential waste kyu karta rehta hai?",
    "Time kam hai, excuses zyada mat bana.",
    "Tu khud se hi peeche reh jayega.",
    "Failure is just Perception... Not The End",
    "Ask Yourself Who you are?",
    "You are not a man...a man doesn't waste hrs on scrolling",
    "People start missing you when they fail to replace you",
    "Aage badh — ruk mat, warna pachhtayega."
];

function showEgoMessage() {
    const msg ;
    // const msg = egoMessages[Math.floor(Math.random() * egoMessages.length)];
    for(let i = 0 ; i<egoMessages.length ;i++){
        msg = egoMessages[i];
        document.getElementById("motiLine").innerHTML =
        `<span>${msg}</span>`;
    }
}

setInterval(showEgoMessage, 10000);
setTimeout(showEgoMessage, 2000);
