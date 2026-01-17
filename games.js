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
    },
    {
        from: "billing@spotify-member.net",
        subject: "Your Premium is on hold",
        body: "We couldn't process your last payment. To avoid service interruption, update your billing info <a href='#'>here</a>.",
        isPhish: true,
        reason: "Non-official domain (spotify-member.net) and creates artificial urgency."
    },
    {
        from: "security@google.com",
        subject: "Password recovery successful",
        body: "The password for your Google Account (user@gmail.com) was recently changed. If you made this change, you don't need to do anything.",
        isPhish: false,
        reason: "Standard security alert from a legitimate Google domain."
    },
    {
        from: "contest@apple-win-iphone.top",
        subject: "You've Won an iPhone 15 Pro!",
        body: "Congratulations! You were selected as today's lucky winner. Click to claim your prize before it's gone.",
        isPhish: true,
        reason: "Too good to be true, weird TLD (.top), and generic 'winner' phrasing."
    },
    {
        from: "it-support@university-portal.edu",
        subject: "Mandatory Password Reset",
        body: "Our policy requires a password reset every 90 days. Please visit the student portal to update your credentials.",
        isPhish: false,
        reason: "Standard institutional procedure from a .edu domain."
    },
    {
        from: "ceo@company-ceo-direct.com",
        subject: "Quick Task",
        body: "I'm in a meeting and need you to purchase 5 gift cards for a client. I'll reimburse you later today. Send the codes to me ASAP.",
        isPhish: true,
        reason: "Classic CEO Fraud (Business Email Compromise). Executives don't ask employees to buy gift cards."
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

// --- FIREWALL GAME LOGIC ---
let firewallActive = false;
let integrity = 100;
let firewallScore = 0;
let packetInterval;
let gameLoopId;
const packets = [];

function startFirewall() {
    firewallActive = true;
    integrity = 100;
    firewallScore = 0;
    packets.forEach(p => p.el.remove());
    packets.length = 0;

    updateIntegrityUI();
    document.getElementById('firewall-score').innerText = '0';
    document.getElementById('firewall-start-screen').classList.add('hidden');
    document.getElementById('firewall-game-over').classList.add('hidden');
    document.getElementById('firewall-message').innerText = "";

    if (packetInterval) clearInterval(packetInterval);
    packetInterval = setInterval(spawnPacket, 1800);

    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoopId = requestAnimationFrame(updateFirewall);
}

function stopFirewall() {
    firewallActive = false;
    clearInterval(packetInterval);
    cancelAnimationFrame(gameLoopId);
    packets.forEach(p => p.el.remove());
    packets.length = 0;
}

function spawnPacket() {
    if (!firewallActive) return;

    const arena = document.getElementById('firewall-arena');
    const isThreat = Math.random() > 0.5;
    const packetEl = document.createElement('div');
    packetEl.className = `packet ${isThreat ? 'threat' : 'safe'}`;

    packetEl.innerHTML = `
        <span style="font-weight:bold; font-size:0.8rem">${isThreat ? 'THREAT' : 'DATA'}</span>
        <div style="display:flex; gap:5px">
            <button class="packet-btn" onclick="handlePacket(event, true)">Allow</button>
            <button class="packet-btn" onclick="handlePacket(event, false)">Block</button>
        </div>
    `;

    const x = Math.random() * (arena.clientWidth - 110);
    packetEl.style.left = `${x}px`;
    packetEl.style.top = '-80px';

    arena.appendChild(packetEl);

    const packet = {
        el: packetEl,
        y: -80,
        speed: 1.2 + Math.random() * 1.5,
        isThreat: isThreat
    };

    // Store packet reference on element
    packetEl.dataset.packetIndex = packets.length;
    packets.push(packet);
}

function handlePacket(event, allow) {
    event.stopPropagation();
    const packetEl = event.target.closest('.packet');
    const packet = packets.find(p => p.el === packetEl);
    if (!packet) return;

    if (allow) {
        if (packet.isThreat) {
            integrity -= 15;
            showFirewallMsg("🚨 SECURITY BREACH! MALWARE ALLOWED", "var(--neon-red)");
        } else {
            firewallScore += 10;
            showFirewallMsg("✅ SAFE DATA RECEIVED", "var(--neon-green)");
        }
    } else {
        if (packet.isThreat) {
            firewallScore += 20;
            showFirewallMsg("🛡️ THREAT BLOCKED", "var(--neon-blue)");
        } else {
            integrity -= 10;
            showFirewallMsg("⚠️ FALSE POSITIVE: LEGIT TRAFFIC BLOCKED", "orange");
        }
    }

    updateIntegrityUI();
    removePacket(packet);
    document.getElementById('firewall-score').innerText = firewallScore;
}

function updateFirewall() {
    if (!firewallActive) return;
    const arenaHeight = 500;

    for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.y += p.speed;
        p.el.style.top = `${p.y}px`;

        if (p.y > arenaHeight - 100) {
            if (p.isThreat) {
                integrity -= 20;
                showFirewallMsg("💥 CORE ATTACKED!", "var(--neon-red)");
            } else {
                showFirewallMsg("💤 DATA LOST IN TRANSIT", "#8b949e");
            }
            updateIntegrityUI();
            removePacket(p);
        }
    }

    if (integrity <= 0) gameOverFirewall();
    else gameLoopId = requestAnimationFrame(updateFirewall);
}

function removePacket(packet) {
    packet.el.remove();
    const index = packets.indexOf(packet);
    if (index > -1) packets.splice(index, 1);
}

function updateIntegrityUI() {
    integrity = Math.max(0, integrity);
    const fill = document.getElementById('integrity-fill');
    fill.style.width = `${integrity}%`;
    document.getElementById('integrity-text').innerText = `${integrity}%`;

    if (integrity < 30) fill.style.background = "var(--neon-red)";
    else if (integrity < 60) fill.style.background = "orange";
    else fill.style.background = "var(--neon-green)";
}

function showFirewallMsg(text, color) {
    const msg = document.getElementById('firewall-message');
    msg.innerText = text;
    msg.style.color = color;
}

function gameOverFirewall() {
    firewallActive = false;
    clearInterval(packetInterval);
    document.getElementById('firewall-game-over').classList.remove('hidden');
    document.getElementById('firewall-final-score').innerText = firewallScore;
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
    },
    {
        q: "What is 'Social Engineering'?",
        options: ["Building social media apps", "Manipulating people into giving up confidential info", "Designing office spaces", "Automated marketing scripts"],
        a: 1
    },
    {
        q: "What is a 'Zero-Day' vulnerability?",
        options: ["A bug fixed in 0 days", "A flaw unknown to the vendor with no patch available", "A virus that deletes itself", "A security patch for old software"],
        a: 1
    },
    {
        q: "What is the primary purpose of a VPN?",
        options: ["To make the internet faster", "To create a secure, encrypted tunnel for data", "To block all viruses", "To store passwords"],
        a: 1
    },
    {
        q: "What is 'Ransomware'?",
        options: ["Free software with ads", "Malware that encrypts files and demands payment", "Software that monitors your screen", "A tool for recovering deleted files"],
        a: 1
    },
    {
        q: "Which protocol is more secure for web browsing?",
        options: ["HTTP", "FTP", "HTTPS", "SMTP"],
        a: 2
    },
    {
        q: "What is 'Phishing'?",
        options: ["Searching for files in a network", "Fraudulent attempts to obtain sensitive info via email", "Cracking a Wi-Fi password", "A type of network cable"],
        a: 1
    },
    {
        q: "What should you do if you receive a suspicious email from your bank?",
        options: ["Click the link to verify", "Call the bank using a number from their official website", "Reply to the email asking if it's real", "Ignore it and hope for the best"],
        a: 1
    },
    {
        q: "What is a 'Brute Force' attack?",
        options: ["Physically stealing a server", "Systematically trying every possible password combination", "A very fast download", "An attack using solar power"],
        a: 1
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

    document.getElementById('game-' + gameId).classList.remove('hidden');

    if (gameId === 'phishing') loadEmail();
    if (gameId === 'firewall') {
        document.getElementById('firewall-start-screen').classList.remove('hidden');
        document.getElementById('firewall-game-over').classList.add('hidden');
    }
    if (gameId === 'crypto') initCrypto();
    if (gameId === 'quiz') initQuiz();
}

function closeGame() {
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('game-arena').classList.add('hidden');
    stopFirewall();
}

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
    // Dashboard is visible by default
});
