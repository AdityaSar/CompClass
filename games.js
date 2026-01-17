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
        from: "security@google.com",
        subject: "Password recovery successful",
        body: "The password for your Google Account was recently changed. If you made this change, ignore this email.",
        isPhish: false,
        reason: "Standard security alert from a legitimate Google domain."
    },
    {
        from: "shipping@fed-ex-tracking.org",
        subject: "Package Delivery Failure",
        body: "We tried to deliver your package but the address was incomplete. Click <a href='#'>here</a> to pay the $2.00 redelivery fee.",
        isPhish: true,
        reason: "Smishing/Phishing tactic: asking for small fees to steal credit card info."
    },
    {
        from: "no-reply@microsoft-office.net",
        subject: "Action Required: Account Verification",
        body: "Due to a system update, all users must re-verify their credentials. Log in <a href='#'>here</a> within 24 hours.",
        isPhish: true,
        reason: "Artificial urgency and a non-official Microsoft domain (.net instead of .com)."
    },
    {
        from: "service@paypal.com",
        subject: "You've received a payment",
        body: "John Doe sent you $150.00. The funds are being held until you provide a tracking number for the items sold.",
        isPhish: false,
        reason: "Legitimate notification of funds held for seller protection (typical PayPal behavior)."
    },
    {
        from: "it-support@internal-helpdesk.edu",
        subject: "System Maintenance Tonight",
        body: "Our servers will be down for maintenance from 2 AM to 4 AM. No action is required from your side.",
        isPhish: false,
        reason: "Standard IT announcement from an internal-looking domain."
    },
    {
        from: "ceo@company-corp-direct.com",
        subject: "Quick Task (Urgent)",
        body: "Are you at your desk? I need you to handle a discrete task for me. Don't reply via email, just text me at this number...",
        isPhish: true,
        reason: "Whaling/CEO Fraud: attempts to move the conversation to an unmonitored channel like SMS."
    },
    {
        from: "support@steam-community.com",
        subject: "Trade Offer Received",
        body: "You have a new trade offer from 'DragonSlayer'. Review it <a href='#'>here</a> to accept your new items.",
        isPhish: false,
        reason: "Standard gaming platform notification from a verified domain."
    },
    {
        from: "billing@hulu-promo.vip",
        subject: "Your subscription is expiring!",
        body: "Renew today and get 50% off for life. This offer is only available for the next 30 minutes. <a href='#'>ACT NOW</a>",
        isPhish: true,
        reason: "Unusual TLD (.vip) and extreme, unrealistic '50% off for life' pressure."
    },
    {
        from: "updates@linkedin.com",
        subject: "People are viewing your profile",
        body: "3 people viewed your profile today. See who they are and grow your network.",
        isPhish: false,
        reason: "Standard social network notification."
    },
    {
        from: "alert@irs-tax-refund.gov.com",
        subject: "Unclaimed Tax Refund",
        body: "Our records show you are owed a refund of $1,450.33. Submit your bank details <a href='#'>here</a> to process the payment.",
        isPhish: true,
        reason: "Government agencies don't email about refunds, and the domain 'gov.com' is a fake hybrid."
    }
];

let currentEmail = 0;
let phishScore = 0;

function loadEmail() {
    const e = emails[currentEmail];
    document.getElementById('email-display').innerHTML = `
        <div class="email-header">
            <div class="email-meta"><strong>From:</strong> ${e.from}</div>
            <div class="email-meta"><strong>To:</strong> user@corporate-net.com</div>
            <div class="email-meta"><strong>Subject:</strong> ${e.subject}</div>
        </div>
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
const THREAT_GOAL = 15;
const activeProcesses = [];

const processTemplates = [
    { name: "explorer.exe", path: "C:\\Windows\\", isThreat: false },
    { name: "svchost.exe", path: "C:\\Windows\\System32\\", isThreat: false },
    { name: "chrome.exe", path: "C:\\Program Files\\Google\\", isThreat: false },
    { name: "wannacry.exe", path: "C:\\Temp\\", isThreat: true },
    { name: "cryptominer.exe", path: "C:\\Users\\Public\\", isThreat: true },
    { name: "svchost.exe", path: "C:\\Temp\\", isThreat: true },
    { name: "backdoor.py", path: "C:\\Users\\Admin\\Downloads\\", isThreat: true },
    { name: "spoolsv.exe", path: "C:\\Windows\\System32\\", isThreat: false },
    { name: "sys_diag.exe", path: "C:\\Windows\\Temp\\", isThreat: true },
    { name: "winlogon.exe", path: "C:\\Windows\\System32\\", isThreat: false },
    { name: "keylogger.exe", path: "C:\\Users\\Public\\Roaming\\", isThreat: true },
    { name: "zoom.exe", path: "C:\\Users\\Admin\\AppData\\Local\\", isThreat: false },
    { name: "lsass.exe", path: "C:\\Windows\\System32\\", isThreat: false },
    { name: "lsass.exe", path: "C:\\Users\\Public\\", isThreat: true },
    { name: "taskmgr.exe", path: "C:\\Windows\\System32\\", isThreat: false },
    { name: "trojan.ps1", path: "C:\\Windows\\System32\\Drivers\\", isThreat: true }
];

function initHunter() {
    stopHunter();
    stability = 100;
    hunterScore = 0;
    updateStabilityUI();
    document.getElementById('hunter-score').innerText = "0";
    document.getElementById('process-list-body').innerHTML = "";
    document.getElementById('hunter-game-over').classList.add('hidden');
    document.getElementById('hunter-victory').classList.add('hidden');
}

function startHunter() {
    hunterActive = true;
    initHunter();

    for(let i=0; i<5; i++) spawnProcess();

    processInterval = setInterval(() => {
        if (!hunterActive) return;
        spawnProcess();

        let threatCount = 0;
        activeProcesses.forEach(p => { if (p.isThreat) threatCount++; });
        stability -= (threatCount * 1.5);

        updateStabilityUI();
        if (stability <= 0) gameOverHunter();
    }, 1500);
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
        tr.style.borderBottom = "1px solid var(--border)";
        if (p.isThreat && Math.random() > 0.7) tr.style.color = "var(--neon-red)";

        tr.innerHTML = `
            <td style="padding: 10px;">${p.pid}</td>
            <td style="padding: 10px;">${p.name}</td>
            <td style="padding: 10px;">${p.path}</td>
            <td style="padding: 10px;">
                <button onclick="terminateProcess(${p.id})" style="background: transparent; border: 1px solid var(--neon-red); color: var(--neon-red); cursor: pointer; padding: 2px 5px; font-family: inherit; font-size: 0.7rem; text-transform: uppercase;">Terminate</button>
            </td>
        `;
        body.appendChild(tr);
    });
}

function terminateProcess(id) {
    const idx = activeProcesses.findIndex(p => p.id === id);
    if (idx === -1) return;

    const p = activeProcesses[idx];
    if (p.isThreat) {
        hunterScore++;
        document.getElementById('hunter-score').innerText = hunterScore;
        if (hunterScore >= THREAT_GOAL) {
            victoryHunter();
        }
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
    document.getElementById('stability-text').innerText = `${Math.floor(stability)}%`;

    if (stability < 30) fill.style.background = "var(--neon-red)";
    else if (stability < 60) fill.style.background = "var(--neon-yellow)";
    else fill.style.background = "var(--neon-green)";
}

function gameOverHunter() {
    hunterActive = false;
    clearInterval(processInterval);
    document.getElementById('hunter-game-over').classList.remove('hidden');
}

function victoryHunter() {
    hunterActive = false;
    clearInterval(processInterval);
    document.getElementById('hunter-victory').classList.remove('hidden');
}

// --- CRYPTOGRAPHY GAME LOGIC ---
const cryptoLevels = [
    { encrypted: "KHOOR", plain: "HELLO", shift: 3 },
    { encrypted: "TFDVSF", plain: "SECURE", shift: 1 },
    { encrypted: "CVVCEM CV FCYP", plain: "ATTACK AT DAWN", shift: 2 },
    { encrypted: "GDWD EUHDFK", plain: "DATA BREACH", shift: 3 },
    { encrypted: "QTAJ HTIJ", plain: "LOVE CODE", shift: 5 },
    { encrypted: "GCT LIV", plain: "CYPHER", shift: 4 },
    { encrypted: "ZLWK QHAW VWHW", plain: "WITH NEXT STEP", shift: 3 },
    { encrypted: "XLI JVEK", plain: "THE FLAG", shift: 4 },
    { encrypted: "SFNFNCFS", plain: "REMEMBER", shift: 1 },
    { encrypted: "ZPV HPK JU", plain: "YOU GOT IT", shift: 1 },
    { encrypted: "PSRK PMZI", plain: "LONG LIVE", shift: 4 }
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
        document.getElementById('crypto-feedback').style.color = "var(--neon-green)";
        document.getElementById('crypto-feedback').innerText = "✓ DECRYPTED";
        if (currentCryptoLevel < cryptoLevels.length - 1) {
            currentCryptoLevel++;
            setTimeout(loadCryptoLevel, 1200);
        } else {
            document.getElementById('crypto-feedback').innerText = "★ ALL LEVELS CLEARED";
        }
    }
}

// --- PASSWORD GAME LOGIC ---
function calculatePassword() {
    const pw = document.getElementById('pw-input').value;
    const result = document.getElementById('pw-result');

    if (pw.length === 0) {
        result.innerText = "READY FOR ANALYSIS.";
        result.style.color = "var(--neon-green)";
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
        result.style.color = "var(--neon-yellow)";
    } else if (crackTimeSeconds < 86400 * 30) {
        timeText = "DAYS";
        result.style.color = "var(--neon-yellow)";
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
        sender: "Exec_Admin",
        message: "Hi, this is David from the Executive suite. I'm in a high-stakes board meeting and I'm locked out. RESET my password to 'Boardroom2025!' IMMEDIATELY. Bypass the MFA, I don't have my phone!",
        isSuspicious: true,
        briefing: "RED FLAGS: Authority and Urgency used to bypass MFA protocols."
    },
    {
        sender: "Sarah_HR",
        message: "Hi! I'm Sarah, just joined HR today. I'm trying to find the Employee Handbook on the portal. Can you send me the direct link?",
        isSuspicious: false,
        briefing: "LEGITIMATE: Standard request for public internal documentation."
    },
    {
        sender: "Mike_IT",
        message: "Workstation check. We see weird traffic. Please install 'SecurityUpdate.exe' from this temp link and run it as admin ASAP.",
        isSuspicious: true,
        briefing: "RED FLAGS: IT rarely asks users to install .exe files via chat."
    },
    {
        sender: "Maintenance",
        message: "Firmware update on routers. Give me the office Wi-Fi password to test signal strength.",
        isSuspicious: true,
        briefing: "RED FLAGS: Legitimate technicians should have their own access or tools."
    },
    {
        sender: "Internal_Audit",
        message: "Annual audit. Provide the last 4 digits of your corporate card and employee ID for identity verification.",
        isSuspicious: true,
        briefing: "RED FLAGS: Information harvesting tactic."
    },
    {
        sender: "Office_Manager",
        message: "The coffee machine on floor 4 is broken. Maintenance is coming. Use the lobby one for now.",
        isSuspicious: false,
        briefing: "LEGITIMATE: Informational office update with no risky requests."
    },
    {
        sender: "Travel_Desk",
        message: "Your flight to the conference has been confirmed. See attached PDF for your boarding pass.",
        isSuspicious: false,
        briefing: "LEGITIMATE: Expected travel confirmation matching business activity."
    },
    {
        sender: "Unknown_Entity",
        message: "I found your wallet in the parking lot. Send me your home address so I can mail it back.",
        isSuspicious: true,
        briefing: "RED FLAGS: Soliciting personal PII (Personally Identifiable Information) from an unknown source."
    },
    {
        sender: "Vendor_Support",
        message: "Our billing system is down. Please wire the monthly payment to this new offshore account instead.",
        isSuspicious: true,
        briefing: "RED FLAGS: BEC (Business Email Compromise) tactic involving changing payment instructions."
    },
    {
        sender: "Legal_Dept",
        message: "Confidentiality agreement update. Please review the new terms on the internal portal.",
        isSuspicious: false,
        briefing: "LEGITIMATE: Internal administrative request directing users to known portals."
    }
];

let currentSocialIdx = 0;
let socialScore = 100;

function initSocialChat() {
    currentSocialIdx = 0;
    socialScore = 100;
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

    if (!isCorrect) socialScore = Math.max(0, socialScore - 20);

    const briefingTitle = document.getElementById('briefing-title');
    const briefingText = document.getElementById('briefing-text');

    briefingTitle.innerText = isCorrect ? "✓ CORRECT" : "✗ BREACH";
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
        finalMsg.innerHTML = `<strong>SYSTEM:</strong><br>SIMULATION COMPLETE. ACCURACY: ${socialScore}%`;
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
        title.innerText = "secrets.txt";
        info = "User: admin\nPass: Winter2025!\n\nCRITICAL: Plaintext credentials.";
    } else if (item === 'config') {
        title.innerText = "env.config";
        info = "DB_HOST: 10.0.0.5\nAPI_KEY: sk_live_51P2z...\n\nCRITICAL: Hardcoded API secrets.";
    } else if (item === 'trash') {
        title.innerText = "RECOVERY";
        info = "File: Deleted_Merger_Plan.docx\n\nCRITICAL: Sensitive data in trash bin.";
    } else if (item === 'logs') {
        title.innerText = "sys.log";
        info = "03:22:11 - Login Fail\n03:22:15 - Login Fail\n03:22:19 - Login Success\n\nCRITICAL: Brute-force logs.";
    }

    content.innerText = info;
    modal.classList.remove('hidden');

    if (isLeak) {
        leaksFound.add(item);
        const iconEl = document.getElementById(`icon-${item}`);
        if(iconEl) iconEl.classList.add('leak-found');
        document.getElementById('leaks-found-count').innerText = leaksFound.size;

        if (leaksFound.size === 4) {
            setTimeout(() => {
                modal.classList.add('hidden');
                document.getElementById('forensics-summary').classList.remove('hidden');
            }, 1500);
        }
    }
}

function closeForensicsModal() {
    document.getElementById('forensics-modal').classList.add('hidden');
}

// --- QUIZ GAME LOGIC ---
const quizQuestions = [
    { q: "What does 'MFA' stand for?", options: ["Multi-Factor Authentication", "Main Firewall Access", "Mobile File Archive"], a: "Multi-Factor Authentication" },
    { q: "Strongest password strategy?", options: ["Pet's name", "Changing letter to number", "Long phrase with variety"], a: "Long phrase with variety" },
    { q: "What is 'Social Engineering'?", options: ["Building apps", "Manipulating people for data", "Designing offices"], a: "Manipulating people for data" },
    { q: "What is a 'Zero-Day'?", options: ["Fixed in 0 days", "Unknown flaw with no patch", "Virus that deletes itself"], a: "Unknown flaw with no patch" },
    { q: "VPN primary purpose?", options: ["Faster internet", "Secure, encrypted tunnel", "Block all viruses"], a: "Secure, encrypted tunnel" },
    { q: "What is 'Ransomware'?", options: ["Free software", "Encrypts files for payment", "Monitors screen"], a: "Encrypts files for payment" },
    { q: "More secure protocol?", options: ["HTTP", "FTP", "HTTPS"], a: "HTTPS" },
    { q: "What is 'Phishing'?", options: ["Search for files", "Fraudulent emails for info", "Cracking Wi-Fi"], a: "Fraudulent emails for info" },
    { q: "What is '2FA'?", options: ["Two-Factor Authentication", "Secondary File Access", "Twice Fast Algorithm"], a: "Two-Factor Authentication" },
    { q: "Which is a common Wi-Fi encryption?", options: ["WPA3", "WPF2", "WEP5"], a: "WPA3" },
    { q: "What does 'DDoS' stand for?", options: ["Distributed Denial of Service", "Direct Data on System", "Digital Data over Socket"], a: "Distributed Denial of Service" },
    { q: "What is 'SQL Injection'?", options: ["Database manipulation via code", "Injecting hardware", "Speeding up queries"], a: "Database manipulation via code" },
    { q: "What is a 'Firewall'?", options: ["Network security monitor", "Burning hardware", "File backup system"], a: "Network security monitor" },
    { q: "What is 'Encryption'?", options: ["Scrambling data for privacy", "Deleting data", "Compressing data"], a: "Scrambling data for privacy" },
    { q: "What is 'Brute Force'?", options: ["Trying every possible combination", "Using physical force", "Speeding up CPU"], a: "Trying every possible combination" }
];

let currentQuizIdx = 0;
let shuffledOptions = [];

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

    shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = "btn-nav";
        btn.style.textAlign = "left";
        btn.innerText = `${idx + 1}. ${opt}`;
        btn.onclick = () => checkQuiz(idx, opt);
        optionsContainer.appendChild(btn);
    });
}

function checkQuiz(idx, selectedOpt) {
    const question = quizQuestions[currentQuizIdx];
    const feedback = document.getElementById('quiz-feedback');
    const buttons = document.getElementById('quiz-options').querySelectorAll('button');

    if (selectedOpt === question.a) {
        buttons[idx].style.background = "var(--neon-green)";
        buttons[idx].style.color = "#000";
        feedback.innerText = "✓ CORRECT";
        feedback.style.color = "var(--neon-green)";
        currentQuizIdx = (currentQuizIdx + 1) % quizQuestions.length;
        setTimeout(loadQuizQuestion, 1000);
    } else {
        buttons[idx].style.background = "var(--neon-red)";
        buttons[idx].style.color = "#fff";
        feedback.innerText = "✗ INCORRECT";
        feedback.style.color = "var(--neon-red)";
    }
}

// --- NAVIGATION LOGIC ---
const missionIntros = {
    phishing: {
        title: "Inbox Defender",
        icon: "📧",
        description: "Analyze incoming emails for signs of phishing. Attackers use deceptive domains, urgent threats, and malicious links to compromise your security. Your mission is to audit the inbox and report any suspicious activity."
    },
    threathunter: {
        title: "Threat Hunter",
        icon: "🕵️‍♂️",
        description: "The system is under attack! Monitor the active processes and terminate any malicious entities (red-flagged or suspicious paths) before they compromise system stability. Avoid terminating critical system services."
    },
    crypto: {
        title: "Crypto Lab",
        icon: "🔐",
        description: "Decrypt intercepted communications using historical cipher techniques. Adjust the shift value to reverse the Caesar Cipher and reveal the original plaintext message."
    },
    password: {
        title: "Password Vault",
        icon: "🔑",
        description: "Evaluate the strength of various access keys. High entropy and long passphrases are essential to withstand modern brute-force cracking attempts. Test different combinations to see how they hold up."
    },
    quiz: {
        title: "Security Trivia",
        icon: "🛡️",
        description: "Test your fundamental cybersecurity knowledge. From network protocols to common attack vectors, see if you have what it takes to be a security professional."
    },
    social: {
        title: "Social Engineering",
        icon: "💬",
        description: "Human vulnerability is the weakest link. Audit a series of chat interactions to identify manipulation tactics like authority, urgency, and technical baiting."
    },
    forensics: {
        title: "Digital Forensics",
        icon: "🔍",
        description: "A workstation has been potentially compromised. Audit the desktop environment to find security leaks, exposed credentials, and suspicious activity logs."
    }
};

function openGame(gameId) {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('game-arena').classList.add('active');
    document.querySelectorAll('.game-container').forEach(g => g.classList.add('hidden'));

    const intro = missionIntros[gameId];
    if (intro) {
        document.getElementById('game-intro').classList.remove('hidden');
        document.getElementById('intro-title').innerText = intro.title;
        document.getElementById('intro-icon').innerText = intro.icon;
        document.getElementById('intro-description').innerText = intro.description;
        document.getElementById('start-mission-btn').onclick = () => launchGame(gameId);
    }
}

function launchGame(gameId) {
    document.getElementById('game-intro').classList.add('hidden');
    const target = document.getElementById('game-' + gameId);
    if (target) target.classList.remove('hidden');

    if (gameId === 'phishing') loadEmail();
    if (gameId === 'threathunter') startHunter();
    if (gameId === 'crypto') initCrypto();
    if (gameId === 'password') calculatePassword();
    if (gameId === 'quiz') initQuiz();
    if (gameId === 'social') initSocialChat();
    if (gameId === 'forensics') initForensics();
}

function closeGame() {
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('game-arena').classList.remove('active');
    stopHunter();
}

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
});
