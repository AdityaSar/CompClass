// --- PHISHING GAME LOGIC ---
const emails = [
    {
        from: "support@netfIix.com",
        subject: "Account Suspended",
        body: "Your payment failed. Click <a href='#'>here</a> to update your credit card now or your account will be deleted.",
        isPhish: true,
        reason: "Suspicious 'from' address (NetfIix with an 'I') and urgent threats."
    },
    {
        from: "noreply@github.com",
        subject: "Security Alert: New Login",
        body: "A new login was detected on your account from a Chrome browser in London. If this was you, ignore this email.",
        isPhish: false,
        reason: "Standard security notification from a verified domain."
    },
    {
        from: "admin@your-bank-secure.biz",
        subject: "Urgent: Unusual Activity",
        body: "We noticed a login from Russia. Please download the attached Secure_Login.exe to verify your identity.",
        isPhish: true,
        reason: "Banks never ask you to download .exe files and use weird .biz domains."
    },
    {
        from: "hr@company-internal.com",
        subject: "Employee Survey",
        body: "Please complete the annual employee satisfaction survey by Friday. Your feedback is important to us.",
        isPhish: false,
        reason: "Typical internal company email from a plausible domain."
    },
    {
        from: "accounts@amaz0n-security.com",
        subject: "Problem with your order",
        body: "There was an issue with your recent order. Please sign in <a href='#'>here</a> to verify your account details.",
        isPhish: true,
        reason: "The domain 'amaz0n' uses a zero instead of an 'o'."
    }
];

let currentEmail = 0;
let phishScore = 0;

function loadEmail() {
    const e = emails[currentEmail];
    document.getElementById('email-display').innerHTML = `
        <div class="email-header"><strong>From:</strong> ${e.from}<br><strong>Subject:</strong> ${e.subject}</div>
        <div class="email-body">${e.body}</div>
    `;
    document.getElementById('phish-feedback').innerText = "";
    document.getElementById('phish-report-btn').classList.remove('hidden');
    document.getElementById('phish-safe-btn').classList.remove('hidden');
    document.getElementById('phish-next-btn').classList.add('hidden');
}

function checkPhish(userGuessPhish) {
    const e = emails[currentEmail];
    const feedback = document.getElementById('phish-feedback');

    document.getElementById('phish-report-btn').classList.add('hidden');
    document.getElementById('phish-safe-btn').classList.add('hidden');
    document.getElementById('phish-next-btn').classList.remove('hidden');

    if (userGuessPhish === e.isPhish) {
        phishScore++;
        feedback.style.color = "var(--neon-green)";
        feedback.innerText = "CORRECT: " + e.reason;
    } else {
        feedback.style.color = "var(--neon-red)";
        feedback.innerText = "INCORRECT: " + e.reason;
    }

    document.getElementById('score').innerText = phishScore;
    currentEmail = (currentEmail + 1) % emails.length;
}

// --- THREAT HUNTER GAME LOGIC ---
let hunterActive = false;
let stability = 100;
let hunterScore = 0;
let processInterval;
const activeProcesses = [];

const processTemplates = [
    { name: "explorer.exe", path: "C:\\Windows\\", isThreat: false },
    { name: "svchost.exe", path: "C:\\Windows\\System32\\", isThreat: false },
    { name: "chrome.exe", path: "C:\\Program Files\\Google\\", isThreat: false },
    { name: "wannacry.exe", path: "C:\\Temp\\", isThreat: true },
    { name: "cryptominer.exe", path: "C:\\Users\\Public\\", isThreat: true },
    { name: "svchost.exe", path: "C:\\Temp\\", isThreat: true },
    { name: "backdoor.py", path: "C:\\Users\\Admin\\Downloads\\", isThreat: true },
    { name: "spoolsv.exe", path: "C:\\Windows\\System32\\", isThreat: false }
];

function initHunter() {
    stopHunter();
    stability = 100;
    hunterScore = 0;
    document.getElementById('stability-text').innerText = "100%";
    document.getElementById('stability-fill').style.width = "100%";
    document.getElementById('stability-fill').style.background = "var(--neon-green)";
    document.getElementById('hunter-score').innerText = "0";
    document.getElementById('process-list-body').innerHTML = "";
    document.getElementById('hunter-start-screen').classList.remove('hidden');
    document.getElementById('hunter-game-over').classList.add('hidden');
}

function startHunter() {
    hunterActive = true;
    initHunter();
    document.getElementById('hunter-start-screen').classList.add('hidden');

    // Initial processes
    for(let i=0; i<5; i++) spawnProcess();

    processInterval = setInterval(() => {
        if (!hunterActive) return;
        spawnProcess();

        // Threats drain stability
        activeProcesses.forEach(p => {
            if (p.isThreat) {
                stability -= 2;
            }
        });

        updateStabilityUI();
        if (stability <= 0) gameOverHunter();
    }, 2000);
}

function stopHunter() {
    hunterActive = false;
    clearInterval(processInterval);
    activeProcesses.length = 0;
}

function spawnProcess() {
    const template = processTemplates[Math.floor(Math.random() * processTemplates.length)];
    const pid = Math.floor(Math.random() * 9000) + 1000;

    const p = { ...template, pid, id: Date.now() + Math.random() };
    activeProcesses.push(p);
    renderProcesses();
}

function renderProcesses() {
    const body = document.getElementById('process-list-body');
    body.innerHTML = "";

    activeProcesses.slice().reverse().forEach(p => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid #1b2733";
        if (p.isThreat) tr.style.color = "#ffb8b8"; // Subtle hint for threats

        tr.innerHTML = `
            <td style="padding: 10px;">${p.pid}</td>
            <td style="padding: 10px;">${p.name}</td>
            <td style="padding: 10px;">${p.path}</td>
            <td style="padding: 10px;">
                <button onclick="killProcess(${p.id})" style="background: var(--neon-red); color: white; border: none; padding: 4px 8px; cursor: pointer; border-radius: 4px;">KILL</button>
            </td>
        `;
        body.appendChild(tr);
    });
}

function killProcess(id) {
    const idx = activeProcesses.findIndex(p => p.id === id);
    if (idx === -1) return;

    const p = activeProcesses[idx];
    if (p.isThreat) {
        hunterScore++;
        document.getElementById('hunter-score').innerText = hunterScore;
    } else {
        stability -= 15;
        updateStabilityUI();
    }

    activeProcesses.splice(idx, 1);
    renderProcesses();
}

function updateStabilityUI() {
    stability = Math.max(0, stability);
    const fill = document.getElementById('stability-fill');
    fill.style.width = `${stability}%`;
    document.getElementById('stability-text').innerText = `${stability}%`;

    if (stability < 30) fill.style.background = "var(--neon-red)";
    else if (stability < 60) fill.style.background = "orange";
    else fill.style.background = "var(--neon-green)";
}

function gameOverHunter() {
    hunterActive = false;
    clearInterval(processInterval);
    document.getElementById('hunter-game-over').classList.remove('hidden');
}

// --- CRYPTOGRAPHY GAME LOGIC ---
const cryptoLevels = [
    { encrypted: "KHOOR", plain: "HELLO", shift: 3 },
    { encrypted: "TFDVSF", plain: "SECURE", shift: 1 },
    { encrypted: "CVVCEM CV FCYP", plain: "ATTACK AT DAWN", shift: 2 }
];

let currentCryptoLevel = 0;

function initCrypto() {
    currentCryptoLevel = 0;
    loadCryptoLevel();
}

function loadCryptoLevel() {
    const level = cryptoLevels[currentCryptoLevel];
    document.getElementById('encrypted-display').innerText = level.encrypted;
    document.getElementById('decrypted-preview').innerText = level.encrypted;
    document.getElementById('shift-slider').value = 0;
    document.getElementById('shift-value').innerText = "0";
    document.getElementById('crypto-level').innerText = currentCryptoLevel + 1;
    document.getElementById('crypto-feedback').innerText = "";
    updateCrypto();
}

function updateCrypto() {
    const level = cryptoLevels[currentCryptoLevel];
    const shift = parseInt(document.getElementById('shift-slider').value);
    document.getElementById('shift-value').innerText = shift;

    let result = "";
    const text = level.encrypted;

    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            result += String.fromCharCode(((charCode - 65 - shift + 26) % 26) + 65);
        } else {
            result += text[i];
        }
    }

    document.getElementById('decrypted-preview').innerText = result;

    if (result === level.plain) {
        document.getElementById('crypto-feedback').innerText = "✓ ACCESS GRANTED: MESSAGE DECRYPTED";
        if (currentCryptoLevel < cryptoLevels.length - 1) {
            currentCryptoLevel++;
            setTimeout(loadCryptoLevel, 2500);
        } else {
            document.getElementById('crypto-feedback').innerText = "★ CONGRATULATIONS: ALL LEVELS CLEARED";
        }
    }
}

// --- PASSWORD GAME LOGIC ---
function calculatePassword() {
    const pw = document.getElementById('pw-input').value;
    const result = document.getElementById('pw-result');

    if (pw.length === 0) {
        result.innerText = "Enter a password to begin analysis.";
        result.style.color = "var(--text)";
        return;
    }

    let entropy = 0;
    if (/[a-z]/.test(pw)) entropy += 26;
    if (/[A-Z]/.test(pw)) entropy += 26;
    if (/[0-9]/.test(pw)) entropy += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) entropy += 32;

    const combinations = Math.pow(entropy, pw.length);
    const crackTimeSeconds = combinations / 1000000000;

    let timeText = "";
    if (crackTimeSeconds < 1) {
        timeText = "INSTANTLY";
        result.style.color = "var(--neon-red)";
    } else if (crackTimeSeconds < 3600) {
        timeText = "MINUTES";
        result.style.color = "orange";
    } else if (crackTimeSeconds < 86400 * 30) {
        timeText = "DAYS";
        result.style.color = "yellow";
    } else if (crackTimeSeconds < 31536000 * 100) {
        timeText = "DECADES";
        result.style.color = "var(--neon-green)";
    } else {
        timeText = "CENTURIES";
        result.style.color = "var(--neon-green)";
    }

    result.innerText = "ESTIMATED CRACK TIME: " + timeText;
}

// --- SOCIAL ENGINEERING CHAT LOGIC ---
const socialScenarios = [
    {
        sender: "David (Exec)",
        message: "Hi, this is David from the Executive suite. I'm in the middle of a high-stakes board meeting and I'm locked out of my account. I need you to RESET my password to 'Boardroom2025!' IMMEDIATELY. I don't have time for the standard MFA process, just do it now!",
        isSuspicious: true,
        briefing: "RED FLAGS DETECTED: This is a classic 'Authority and Urgency' attack. Attackers impersonate high-ranking executives to pressure staff into bypassing security protocols (MFA)."
    },
    {
        sender: "Sarah (HR)",
        message: "Hi there! I'm Sarah, I just joined the HR team this morning. I'm trying to get through my onboarding checklist but I can't find the link to the official Employee Handbook on the internal portal. Could you point me in the right direction?",
        isSuspicious: false,
        briefing: "LEGITIMATE REQUEST: This is a common, low-risk request for publicly available internal information. It does not ask for credentials, access, or bypasses."
    },
    {
        sender: "Maintenance_Tech",
        message: "Hey, I'm from building maintenance. We're doing a firmware update on the routers for this floor. Can you give me the office Wi-Fi password so I can verify the signal strength after the reboot?",
        isSuspicious: true,
        briefing: "RED FLAGS DETECTED: This is 'Physical/Service' Social Engineering. Legitimate maintenance workers should have their own credentials or be managed by the IT department directly. Never give out network passwords to unverified personnel."
    }
];

let currentSocialIdx = 0;
let socialScore = 100;

function initSocialChat() {
    currentSocialIdx = 0;
    socialScore = 100;
    document.getElementById('social-score').innerText = socialScore;
    document.getElementById('chat-history').innerHTML = "";
    document.getElementById('briefing-overlay').classList.add('hidden');
    loadChatScenario();
}

function loadChatScenario() {
    const scenario = socialScenarios[currentSocialIdx];
    const history = document.getElementById('chat-history');

    const msgEl = document.createElement('div');
    msgEl.className = "message-bubble msg-received";
    msgEl.innerHTML = `<strong>${scenario.sender}:</strong><br>${scenario.message}`;
    history.appendChild(msgEl);
    history.scrollTop = history.scrollHeight;
}

function handleChatAction(isSuspicious) {
    const scenario = socialScenarios[currentSocialIdx];
    const isCorrect = isSuspicious === scenario.isSuspicious;

    if (!isCorrect) {
        socialScore = Math.max(0, socialScore - 33);
        document.getElementById('social-score').innerText = socialScore;
    }

    const briefingTitle = document.getElementById('briefing-title');
    const briefingText = document.getElementById('briefing-text');

    briefingTitle.innerText = isCorrect ? "✓ CORRECT ANALYSIS" : "✗ SECURITY BREACH";
    briefingTitle.style.color = isCorrect ? "var(--neon-green)" : "var(--neon-red)";
    briefingText.innerText = scenario.briefing;

    document.getElementById('briefing-overlay').classList.remove('hidden');
}

function nextChatScenario() {
    currentSocialIdx++;
    document.getElementById('briefing-overlay').classList.add('hidden');

    if (currentSocialIdx < socialScenarios.length) {
        loadChatScenario();
    } else {
        const history = document.getElementById('chat-history');
        const finalMsg = document.createElement('div');
        finalMsg.className = "message-bubble msg-received";
        finalMsg.style.border = "1px solid var(--neon-purple)";
        finalMsg.innerHTML = `<strong>SYSTEM:</strong><br>Social Engineering Simulation Complete. Final Score: ${socialScore}%`;
        history.appendChild(finalMsg);
    }
}

// --- DIGITAL FORENSICS LOGIC ---
let leaksFound = new Set();

function initForensics() {
    leaksFound = new Set();
    document.getElementById('leaks-found-count').innerText = "0";
    document.querySelectorAll('.desktop-icon').forEach(icon => icon.classList.remove('leak-found'));
    document.getElementById('forensics-summary').classList.add('hidden');
    document.getElementById('forensics-modal').classList.add('hidden');
}

function inspectDesktopItem(item) {
    const modal = document.getElementById('forensics-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');

    let info = "";
    let isLeak = true;

    if (item === 'sticky') {
        title.innerText = "STICKY NOTE ANALYSIS";
        info = "RECOVERED TEXT:\n----------------\nUser: admin\nPass: Winter2025!\n----------------\nCRITICAL: Passwords found in plain sight.";
    } else if (item === 'config') {
        title.innerText = "CONFIG.JS SOURCE CODE";
        info = "const config = {\n  db_host: '10.0.4.15',\n  API_KEY: 'sk_live_51P2z...X7y8',\n  DEBUG: false\n};\n\nCRITICAL: Hardcoded secrets detected.";
    } else if (item === 'trash') {
        title.innerText = "TRASH RECOVERY BIN";
        info = "RECOVERED FILE: Deleted_Project_Mars.docx\n----------------\n'The merger with Galactic Corp is set for Q3 at $450/share...'\n\nCRITICAL: Sensitive business data not securely wiped.";
    } else {
        isLeak = false;
        title.innerText = "SYSTEM BROWSER";
        info = "No forensic evidence found here. Browser history has been cleared.";
    }

    content.innerText = info;
    modal.classList.remove('hidden');

    if (isLeak) {
        leaksFound.add(item);
        document.getElementById(`icon-${item}`).classList.add('leak-found');
        document.getElementById('leaks-found-count').innerText = leaksFound.size;

        if (leaksFound.size === 3) {
            setTimeout(() => {
                modal.classList.add('hidden');
                document.getElementById('forensics-summary').classList.remove('hidden');
            }, 2000);
        }
    }
}

function closeForensicsModal() {
    document.getElementById('forensics-modal').classList.add('hidden');
}

// --- QUIZ GAME LOGIC ---
const quizQuestions = [
    {
        q: "What does 'MFA' stand for in cybersecurity?",
        options: ["Multi-Factor Authentication", "Main Firewall Access", "Mobile File Archive", "Multi-Functional Array"],
        a: 0
    },
    {
        q: "Which of these is the strongest password strategy?",
        options: ["Using your pet's name", "Changing one letter to a number", "Using a long phrase with varied characters", "Using your birth year"],
        a: 2
    }
];

let currentQuizIdx = 0;

function initQuiz() {
    currentQuizIdx = 0;
    loadQuizQuestion();
}

function loadQuizQuestion() {
    const question = quizQuestions[currentQuizIdx];
    document.getElementById('quiz-question').innerText = question.q;
    document.getElementById('quiz-feedback').innerText = "";

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = "";

    question.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = "btn-nav";
        btn.style.textAlign = "left";
        btn.innerText = `${idx + 1}. ${opt}`;
        btn.onclick = () => checkQuiz(idx);
        optionsContainer.appendChild(btn);
    });
}

function checkQuiz(idx) {
    const question = quizQuestions[currentQuizIdx];
    const feedback = document.getElementById('quiz-feedback');

    if (idx === question.a) {
        feedback.innerText = "CORRECT! ADVANCING...";
        feedback.style.color = "var(--neon-green)";
        currentQuizIdx = (currentQuizIdx + 1) % quizQuestions.length;
        setTimeout(loadQuizQuestion, 2000);
    } else {
        feedback.innerText = "INCORRECT. RE-ANALYZE THE QUESTION.";
        feedback.style.color = "var(--neon-red)";
    }
}

// --- NAVIGATION LOGIC ---
function openGame(gameId) {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('game-arena').classList.remove('hidden');
    document.querySelectorAll('.game-container').forEach(g => g.classList.add('hidden'));

    const target = document.getElementById('game-' + gameId);
    if (target) target.classList.remove('hidden');

    if (gameId === 'phishing') loadEmail();
    if (gameId === 'threathunter') initHunter();
    if (gameId === 'crypto') initCrypto();
    if (gameId === 'password') calculatePassword();
    if (gameId === 'quiz') initQuiz();
    if (gameId === 'social') initSocialChat();
    if (gameId === 'forensics') initForensics();
}

function closeGame() {
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('game-arena').classList.add('hidden');
    stopHunter();
}

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
    // Dashboard is visible by default
});
