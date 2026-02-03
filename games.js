// --- MISSION METADATA ---
const missionIntros = {
    phishing: {
        title: "Inbox Defender",
        icon: "📧",
        description: "Analyze 20 security alerts for signs of social engineering. Attackers use deceptive domains, urgent threats, and malicious links. Audit the inbox and neutralize the threats.",
        insight: "90% of data breaches start with a phishing email. Modern attackers use 'Quishing' (QR codes) and 'BiB' (Browser-in-the-Browser) to bypass traditional filters."
    },
    threathunter: {
        title: "Threat Hunter",
        icon: "🕵️‍♂️",
        description: "The system is under attack! Identify and terminate 3 malicious threats hidden in active processes. Caution: Terminating legitimate services will destabilize the machine.",
        insight: "Advanced Persistent Threats (APTs) often masquerade as legitimate system processes like 'svchost.exe' to remain undetected for months."
    },
    crypto: {
        title: "Crypto Lab",
        icon: "🔐",
        description: "Decrypt intercepted communications using historical Caesar ciphers. Adjust the shift value (4, 12, and 21) to reveal the original plaintext.",
        insight: "While the Caesar cipher is easily broken today, it laid the foundation for symmetric-key cryptography used in modern standards like AES."
    },
    password: {
        title: "Password Vault",
        icon: "🔑",
        description: "Test your access keys against brute-force entropy algorithms. High complexity and length are critical for surviving modern cracking attempts.",
        insight: "Entropy is a measure of randomness. A 12-character random password can take centuries to crack, while a common 20-character phrase might take minutes."
    },
    quiz: {
        title: "Security Trivia",
        icon: "🛡️",
        description: "Test your fundamental cybersecurity knowledge. Master concepts from MFA to Zero-Day exploits to complete your training.",
        insight: "Continuous learning is the best defense. The cybersecurity landscape changes daily as new vulnerabilities like Log4j are discovered."
    },
    social: {
        title: "Social Engineering",
        icon: "💬",
        description: "Audit a series of chat interactions to identify psychological manipulation tactics like authority, urgency, and technical baiting.",
        insight: "Social engineering exploits human psychology rather than technical flaws. It is often called 'hacking the human' and is extremely difficult to block with software."
    },
    forensics: {
        title: "Digital Forensics",
        icon: "🔍",
        description: "A workstation is compromised. Audit the environment to find 8 specific security leaks, exposed credentials, and suspicious activity logs.",
        insight: "Forensics is about reconstructing the 'kill chain'. Every action an attacker takes leaves a trace, from registry changes to temporary files."
    }
};

// --- NAVIGATION & STATE ---
let carouselIndex = 0;

function moveCarousel(direction) {
    const items = document.querySelectorAll('.carousel-item');
    if (!items.length) return;
    carouselIndex = (carouselIndex + direction + items.length) % items.length;
    updateCarousel();
}

function selectCarouselItem(index, gameId) {
    if (carouselIndex === index) {
        openGame(gameId);
    } else {
        carouselIndex = index;
        updateCarousel();
    }
}

function updateCarousel() {
    const container = document.getElementById('carousel-container');
    const items = document.querySelectorAll('.carousel-item');
    const bgOverlay = document.getElementById('bg-overlay');
    if (!items.length || !container) return;

    const activeItem = items[carouselIndex];

    // Smooth centering logic
    const containerWidth = container.offsetWidth;
    const itemOffset = activeItem.offsetLeft;
    const itemWidth = activeItem.offsetWidth;
    const scrollTarget = itemOffset - (containerWidth / 2) + (itemWidth / 2);

    container.scrollTo({
        left: scrollTarget,
        behavior: 'smooth'
    });

    items.forEach((item, idx) => {
        const isActive = idx === carouselIndex;
        item.classList.toggle('active', isActive);

        if (isActive) {
            const rgb = item.style.getPropertyValue('--item-rgb');
            const color = item.style.getPropertyValue('--item-color');
            if (bgOverlay && rgb) {
                bgOverlay.style.background = `radial-gradient(circle at 50% 50%, rgba(${rgb}, 0.2) 0%, #0a0a12 100%)`;
                document.documentElement.style.setProperty('--neon-blue', color);
            }
        }
    });
}


function openGame(gameId) {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('game-arena').classList.add('active');
    document.querySelectorAll('.game-container').forEach(g => g.classList.add('hidden'));

    const introData = missionIntros[gameId];
    if (introData) {
        const intro = document.getElementById('game-intro');
        intro.classList.remove('hidden');
        document.getElementById('intro-title').innerText = introData.title;
        document.getElementById('intro-icon').innerText = introData.icon;
        document.getElementById('intro-description').innerText = introData.description;
        document.getElementById('intro-insight').innerText = introData.insight || "";
        document.getElementById('start-mission-btn').onclick = () => launchGame(gameId);
    }
    window.scrollTo(0, 0);
}

function launchGame(gameId) {
    document.getElementById('game-intro').classList.add('hidden');
    const target = document.getElementById('game-' + gameId);
    if (target) target.classList.remove('hidden');

    if (gameId === 'phishing') initPhish();
    if (gameId === 'threathunter') startHunter();
    if (gameId === 'crypto') initCrypto();
    if (gameId === 'password') document.getElementById('pw-input').value = "";
    if (gameId === 'quiz') initQuiz();
    if (gameId === 'social') initSocialChat();
    if (gameId === 'forensics') initForensics();
}

function closeGame() {
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('game-arena').classList.remove('active');
    stopHunter();
    updateCarousel();
}

// --- 1. PHISHING GAME (15 EXAMPLES) ---
const emails = [
    { from: "it-support@mircosoft-security.com", subject: "CRITICAL: Suspicious Activity Detected", body: "Dear User,<br><br>Our systems have detected an unauthorized login attempt from an unknown IP address in Eastern Europe. For your protection, we have temporarily restricted access to your Outlook account.<br><br>To restore access and verify your identity, please click the secure link below within the next 4 hours:<br><br><a href='#'>https://portal-mircosoft.com/auth/verify</a><br><br>Failure to comply will result in permanent account suspension.", isPhish: true, reason: "Misspelled domain 'mircosoft' and extreme artificial urgency." },
    { from: "hr@global-corp.com", subject: "Updated Employee Handbook - 2026", body: "Hello Team,<br><br>Please find the updated 2026 Employee Handbook attached. It is mandatory for all staff members to review the new policies regarding remote work and cybersecurity protocols by the end of this week.<br><br>You can access the document via our internal SharePoint folder or view the PDF attached to this message.<br><br>Thank you,<br>Corporate HR", isPhish: false, reason: "Internal communication from a verified corporate domain with no red flags." },
    { from: "ceo@company-executive-desk.net", subject: "Urgent Assistance Required", body: "I'm currently in a confidential board meeting and cannot take calls. I need you to process an urgent wire transfer for a new vendor immediately. The invoice is $42,500.00. I'll send you the banking details once you confirm you're at your desk.<br><br>Please handle this discreetly and don't mention it to the rest of the finance team yet.<br><br>Sent from my iPhone", isPhish: true, reason: "Classic Whaling/CEO Fraud using authority, secrecy, and discouraging verification." },
    { from: "no-reply@github.com", subject: "[GitHub] A new personal access token was created", body: "Hey there!<br><br>A new personal access token (classic) was just created on your account. If you did not create this token, you should visit your settings immediately to revoke it and secure your account.<br><br>GitHub Security Team", isPhish: false, reason: "Standard security notification from the correct domain." },
    { from: "billing@netfIix-payments.com", subject: "Your subscription has been suspended", body: "We were unable to process your last monthly payment. As a result, your Netflix subscription has been paused. To continue watching your favorite shows, please update your payment method.<br><br><a href='#'>Update Billing Information Now</a><br><br>If no action is taken within 24 hours, your account profile will be deleted.", isPhish: true, reason: "Look-alike domain (netfIix with a capital 'I') and threat of data loss." },
    { from: "noreply@linkedin.com", subject: "You appeared in 12 searches this week", body: "See who's looking! You had 12 new profile views this week. Upgrade to Premium to see the full list of people and companies interested in your profile.<br><br><button style='padding:10px; background:#0a66c2; color:white; border:none; border-radius:5px;'>View My Stats</button>", isPhish: false, reason: "Legitimate social media marketing email." },
    { from: "shipping@fedex-tracking.org", subject: "Delivery Exception: Action Required", body: "Your package #FX-99281-ZA is currently held at our local distribution center due to an incomplete shipping address. A nominal redelivery fee of $1.95 is required to release the package.<br><br>Please pay the fee here to schedule a new delivery slot:<br><br><a href='#'>https://fedex-parcel-claims.org/pay</a>", isPhish: true, reason: "Smishing/Phishing combo using a small fee to harvest credit card details." },
    { from: "it-desk@our-internal-help.com", subject: "Scheduled Server Maintenance", body: "This is an automated notification that the internal VPN and Jira servers will be offline for scheduled maintenance this Saturday between 12:00 AM and 04:00 AM UTC. Please ensure all your work is saved and synced before the maintenance window starts.<br><br>System Administration Team", isPhish: false, reason: "Typical IT maintenance announcement." },
    { from: "security-alert@amaz0n.host", subject: "Sign-in attempt from a new device", body: "Your Amazon account was accessed from a new device in San Francisco, CA. If this was not you, please secure your account immediately by clicking the link below.<br><br><a href='#'>https://amaz0n-security-check.host/report</a><br><br>We take your security very seriously.", isPhish: true, reason: "Domain uses '0' (zero) and an unusual .host TLD." },
    { from: "refunds@irs.gov.us", subject: "Notice of Tax Overpayment", body: "Our records indicate that you are eligible for a tax refund of $1,429.50 from the previous fiscal year. To claim your refund, you must complete the online form with your valid banking information.<br><br><a href='#'>https://irs-refund-portal.gov.us/form</a><br><br>IRS Internal Revenue Service", isPhish: true, reason: "The IRS does not initiate contact by email to request personal or financial information." },
    { from: "support@google.com", subject: "Security Alert: New device logged into your account", body: "A new sign-in was detected on a Windows device. If this was you, you can safely ignore this email. If not, please review your recent activity.<br><br><a href='#'>Check Activity</a>", isPhish: false, reason: "Standard Google security alert." },
    { from: "accounts@microsoft-office.vip", subject: "Your Office 365 License is Expiring", body: "Important: Your corporate Office 365 subscription will expire in 12 hours. To avoid losing access to your Outlook, OneDrive, and Word documents, please renew your license immediately using the discounted corporate rate.<br><br><a href='#'>Renew License</a>", isPhish: true, reason: "Unusual .vip domain and extreme time pressure." },
    { from: "service@paypal.com", subject: "You have received a payment", body: "You've got money! $50.00 USD from 'Online Rewards Inc.' is now available in your PayPal balance. Log in to your account to view the transaction details.<br><br>Transaction ID: 9X822104J422", isPhish: false, reason: "Generic but legitimate transaction notification." },
    { from: "admin@internal-security-audit.com", subject: "Action Required: QR Code MFA Enrollment", body: "As part of our new 'Zero Trust' policy, all employees must re-enroll their mobile devices for Multi-Factor Authentication. Please scan the QR code below using your phone's camera to initiate the secure setup process.<br><br>[QR CODE IMAGE]<br><br>Security Compliance Department", isPhish: true, reason: "Quishing (QR Phishing) used to bypass email security filters and hide malicious URLs." },
    { from: "no-reply@spotify.com", subject: "Your Premium plan is renewing soon", body: "Thanks for being a loyal listener! This is a reminder that your Spotify Premium Family plan will automatically renew on Feb 20, 2026. Your payment method on file will be charged $16.99.<br><br>Spotify Team", isPhish: false, reason: "Routine billing reminder from a verified source." }
];

let curEmail = 0, phishScore = 0;

function initPhish() {
    curEmail = 0; phishScore = 0;
    document.getElementById('score').innerText = "0";
    document.getElementById('phish-summary').classList.add('hidden');
    document.querySelectorAll('#game-phishing .btn-action').forEach(b => b.classList.remove('hidden'));
    loadEmail();
}

function loadEmail() {
    if (curEmail >= emails.length) {
        document.getElementById('email-display').innerHTML = `<div style='text-align:center; padding: 40px;'><h2 style='color:var(--success)'>AUDIT COMPLETE</h2><p>Score: ${phishScore}/${emails.length}</p></div>`;
        document.querySelectorAll('#game-phishing .btn-action').forEach(b => b.classList.add('hidden'));
        document.getElementById('phish-summary').classList.remove('hidden');
        return;
    }
    const e = emails[curEmail];
    document.getElementById('email-display').innerHTML = `
        <div class="email-header">
            <div><strong>From:</strong> ${e.from}</div>
            <div><strong>Subject:</strong> ${e.subject}</div>
        </div>
        <div class="email-body">${e.body}</div>
    `;
    document.getElementById('phish-feedback').innerText = "";
    document.getElementById('phish-next-btn').classList.add('hidden');
    document.getElementById('phish-report-btn').classList.remove('hidden');
    document.getElementById('phish-safe-btn').classList.remove('hidden');
}

function checkPhish(guess) {
    const e = emails[curEmail];
    const fb = document.getElementById('phish-feedback');
    document.getElementById('phish-report-btn').classList.add('hidden');
    document.getElementById('phish-safe-btn').classList.add('hidden');
    if (guess === e.isPhish) {
        phishScore++;
        fb.style.color = "var(--success)";
        fb.innerText = "✓ CORRECT: " + e.reason;
    } else {
        fb.style.color = "var(--danger)";
        fb.innerText = "✗ INCORRECT: " + e.reason;
    }
    document.getElementById('score').innerText = phishScore;
    document.getElementById('phish-score-container').innerHTML = `Security Score: <span id="score">${phishScore}</span> / ${emails.length}`;
    curEmail++;
    document.getElementById('phish-next-btn').classList.remove('hidden');
}

// --- 2. THREAT HUNTER (3 THREATS, TERMINATE) ---
let hunterActive = false, stability = 100, hunterScore = 0, hunterInterval;
const hunts = [];

function startHunter() {
    hunterActive = true; stability = 100; hunterScore = 0; hunts.length = 0;
    document.getElementById('hunter-score').innerText = "0";
    document.getElementById('threats-remaining').innerText = "3";
    document.getElementById('hunter-game-over').classList.add('hidden');
    document.getElementById('hunter-victory').classList.add('hidden');
    for(let i=0; i<6; i++) spawnProc(i < 3); // 3 Initial threats
    hunterInterval = setInterval(() => {
        if (!hunterActive) return;
        if (Math.random() > 0.8 && hunts.length < 10) spawnProc(false);
        let activeThreats = hunts.filter(p => p.isThreat).length;
        document.getElementById('threats-remaining').innerText = activeThreats;
        stability -= (activeThreats * 1.5);
        updateStabilityUI();
        if (stability <= 0) { hunterActive = false; document.getElementById('hunter-game-over').classList.remove('hidden'); }
    }, 2000);
}

function stopHunter() { hunterActive = false; clearInterval(hunterInterval); }

function spawnProc(isThreat) {
    const t = isThreat ? ["wannacry.exe", "miner.exe", "backdoor.py"] : ["explorer.exe", "chrome.exe", "svchost.exe", "system.dll"];
    const p = { id: Math.random(), pid: Math.floor(Math.random()*9000)+1000, name: t[Math.floor(Math.random()*t.length)], path: isThreat ? "C:\\Temp\\" : "C:\\Windows\\", isThreat };
    hunts.push(p); renderHunts();
}

function renderHunts() {
    const b = document.getElementById('process-list-body'); b.innerHTML = "";
    hunts.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style='padding:10px'>${p.pid}</td><td style='padding:10px'>${p.name}</td><td style='padding:10px'>${p.path}</td><td style='padding:10px'><button onclick='termProc(${p.id})' style='color:var(--danger); background:none; border:1px solid var(--danger); cursor:pointer'>TERMINATE</button></td>`;
        b.appendChild(tr);
    });
}

function termProc(id) {
    const idx = hunts.findIndex(p => p.id === id); if (idx === -1) return;
    const p = hunts[idx];
    if (p.isThreat) {
        hunterScore++;
        document.getElementById('hunter-score').innerText = hunterScore;
        if (hunterScore >= 3) {
            hunterActive = false;
            document.getElementById('hunter-victory').classList.remove('hidden');
        }
    }
    else { stability -= 20; }
    hunts.splice(idx, 1);
    let activeThreats = hunts.filter(proc => proc.isThreat).length;
    document.getElementById('threats-remaining').innerText = activeThreats;
    updateStabilityUI(); renderHunts();
}

function updateStabilityUI() {
    stability = Math.max(0, stability);
    document.getElementById('stability-fill').style.width = stability + "%";
    document.getElementById('stability-text').innerText = Math.floor(stability) + "%";
}

// --- 3. CRYPTO LAB (SHIFTS: 4, 12, 21) ---
const cryptoLvls = [
    { enc: "LIPPS", plain: "HELLO", shift: 4 },
    { enc: "EQOGDQ", plain: "SECURE", shift: 12 },
    { enc: "VOOVXF VO YVRI", plain: "ATTACK AT DAWN", shift: 21 }
];
let curCrypto = 0;

function initCrypto() { curCrypto = 0; loadCrypto(); }
function loadCrypto() {
    const c = cryptoLvls[curCrypto];
    document.getElementById('encrypted-display').innerText = c.enc;
    document.getElementById('shift-slider').value = 0;
    document.getElementById('crypto-level').innerText = curCrypto + 1;
    updateCrypto();
}
function updateCrypto() {
    const c = cryptoLvls[curCrypto], s = parseInt(document.getElementById('shift-slider').value);
    document.getElementById('shift-value').innerText = s;
    let res = "";
    for(let i=0; i<c.enc.length; i++) {
        let code = c.enc.charCodeAt(i);
        if (code >= 65 && code <= 90) res += String.fromCharCode(((code - 65 - s + 26) % 26) + 65);
        else res += c.enc[i];
    }
    document.getElementById('decrypted-preview').innerText = res;
    if (res === c.plain) {
        document.getElementById('crypto-feedback').innerText = "✓ DECRYPTED";
        if (curCrypto < 2) {
            curCrypto++;
            document.getElementById('shift-slider').disabled = true;
            setTimeout(() => {
                document.getElementById('shift-slider').disabled = false;
                document.getElementById('decrypted-preview').innerText = "";
                document.getElementById('crypto-feedback').innerText = "";
                loadCrypto();
            }, 5000);
        }
        else { document.getElementById('crypto-feedback').innerText = "★ MISSION ACCOMPLISHED"; }
    }
}

// --- 4. PASSWORD VAULT ---
function calculatePassword() {
    const pw = document.getElementById('pw-input').value, res = document.getElementById('pw-result');
    if (!pw) { res.innerText = "READY"; res.style.color = "var(--success)"; return; }
    let entropy = 0;
    if (/[a-z]/.test(pw)) entropy += 26; if (/[A-Z]/.test(pw)) entropy += 26; if (/[0-9]/.test(pw)) entropy += 10; if (/[^a-zA-Z0-9]/.test(pw)) entropy += 32;
    const time = Math.pow(entropy, pw.length) / 1e9;
    if (time < 1) { res.innerText = "CRACK TIME: INSTANT"; res.style.color = "var(--danger)"; }
    else if (time < 86400) { res.innerText = "CRACK TIME: HOURS"; res.style.color = "var(--neon-yellow)"; }
    else { res.innerText = "CRACK TIME: CENTURIES"; res.style.color = "var(--success)"; }
}

// --- 5. SECURITY TRIVIA (EXPLANATIONS + RANDOM) ---
const quizQ = [
    { q: "Which of these is the most secure way to store passwords?", opts: ["Plaintext in a text file", "Encrypted with a static key", "Hashed with a unique salt"], a: "Hashed with a unique salt", exp: "Salting and hashing protects against rainbow table attacks and ensures that identical passwords have different hashes." },
    { q: "What does 'HTTPS' stand for?", opts: ["HyperText Transfer Protocol Secure", "High Tech Transfer Program System", "Hidden Text Transfer Protocol Secure"], a: "HyperText Transfer Protocol Secure", exp: "The 'S' at the end indicates that the communication is encrypted using TLS/SSL." },
    { q: "What is 'Shoulder Surfing'?", opts: ["A type of surfing sport", "Watching someone enter credentials over their shoulder", "Remotely accessing a webcam"], a: "Watching someone enter credentials over their shoulder", exp: "It is a physical social engineering technique used to steal PINs, passwords, or sensitive data." },
    { q: "What is the primary goal of Ransomware?", opts: ["To steal your identity", "To encrypt your files and demand payment", "To make your computer faster"], a: "To encrypt your files and demand payment", exp: "Ransomware locks your data and demands a 'ransom' (usually in crypto) to provide the decryption key." },
    { q: "Which of these is a 'Strong' password?", opts: ["Password123", "p@$$w0rd", "Correct-Horse-Battery-Staple-2026!"], a: "Correct-Horse-Battery-Staple-2026!", exp: "Length and randomness (entropy) are more important than simple character substitutions. Long passphrases are extremely hard to crack." },
    { q: "What is 'Spear Phishing'?", opts: ["Phishing that targets a specific individual or organization", "A type of deep-sea fishing", "Phishing that uses a spear-shaped icon"], a: "Phishing that targets a specific individual or organization", exp: "Spear phishing is highly targeted and often uses personal information to appear more convincing than generic phishing." },
    { q: "What is a 'Firewall'?", opts: ["A literal wall that is on fire", "Software or hardware that monitors and filters network traffic", "A program that deletes all your files"], a: "Software or hardware that monitors and filters network traffic", exp: "Firewalls act as a barrier between a trusted network and an untrusted network (like the internet)." },
    { q: "What is 'Two-Factor Authentication' (2FA)?", opts: ["Using two different passwords", "Using something you know and something you have", "Entering your password twice"], a: "Using something you know and something you have", exp: "2FA adds a second layer of security, such as a code from an app or a physical key, in addition to your password." }
];
let curQuiz = 0, qScore = 0;

function initQuiz() { curQuiz = 0; qScore = 0; document.getElementById('quiz-summary').classList.add('hidden'); loadQuizQuestion(); }
function loadQuizQuestion() {
    document.getElementById('quiz-next-container').classList.add('hidden');
    if (curQuiz >= quizQ.length) {
        document.getElementById('quiz-summary').classList.remove('hidden');
        document.getElementById('quiz-final-score').innerText = `Score: ${qScore}/${quizQ.length}`;
        return;
    }
    const q = quizQ[curQuiz]; document.getElementById('quiz-question').innerText = q.q;
    document.getElementById('quiz-feedback').innerText = "";
    const opts = document.getElementById('quiz-options'); opts.innerHTML = "";
    [...q.opts].sort(()=>Math.random()-0.5).forEach(o => {
        const btn = document.createElement('button'); btn.className = "btn-nav"; btn.style.textAlign="left"; btn.innerText = o;
        btn.onclick = () => {
            const fb = document.getElementById('quiz-feedback');
            const btns = opts.querySelectorAll('button');
            btns.forEach(b => b.onclick = null);
            if (o === q.a) { qScore++; fb.style.color = "var(--success)"; fb.innerText = "✓ Correct! " + q.exp; }
            else { fb.style.color = "var(--danger)"; fb.innerText = "✗ Wrong. " + q.exp; }
            curQuiz++;
            document.getElementById('quiz-next-container').classList.remove('hidden');
        };
        opts.appendChild(btn);
    });
}

// --- 6. SOCIAL ENGINEERING (SCENARIOS) ---
const chats = [
    { s: "Exec_Admin", m: "I'm locked out. RESET my password to 'Summer2025' NOW. Bypass MFA, I'm busy!", isPhish: true, exp: "Authority and urgency used to bypass security." },
    { s: "Sarah_HR", m: "Hi, I'm new! Can you send me the link to the internal benefits portal?", isPhish: false, exp: "Reasonable request for internal info." },
    { s: "IT_Security", m: "Important: We've detected a possible breach on your workstation. Please do not log off and wait for a technician to contact you.", isPhish: false, exp: "Legitimate security advisory following standard procedure." },
    { s: "Mike_IT", m: "Security check. Install 'Update.exe' from this link immediately.", isPhish: true, exp: "IT won't ask users to install executables via chat." },
    { s: "Finance_Dept", m: "Hi, could you please verify the account number for the last payroll run? I want to make sure the digit isn't a typo.", isPhish: false, exp: "Normal internal verification between colleagues." },
    { s: "Vendor_John", m: "Hey, I'm at the front gate for the equipment repair. Can you buz me in? I forgot my badge.", isPhish: true, exp: "Pretexting: Attackers create a scenario to gain physical or logical access." },
    { s: "Project_Manager", m: "Great work on the presentation! I've uploaded the final version to our shared drive. Can you double-check the client's name on slide 5?", isPhish: false, exp: "Standard work-related request with no red flags." },
    { s: "Survey_Bot", m: "Win a $50 gift card! Just fill out this survey about your office software.", isPhish: true, exp: "Quid Pro Quo: Offering a benefit in exchange for information." },
    { s: "Marketing_Team", m: "We are launching the new campaign tomorrow. Here is the link to the preview site (internal only). Let us know if the images load correctly.", isPhish: false, exp: "Routine internal preview request." },
    { s: "New_Recruit", m: "Sorry to bother you, but I'm having trouble with the VPN. What's the naming convention for the servers?", isPhish: true, exp: "Baiting: Seeking technical details by appearing helpless or new." }
];
let curChat = 0;

function initSocialChat() { curChat = 0; document.getElementById('chat-history').innerHTML = ""; loadChat(); }
function loadChat() {
    const c = chats[curChat], h = document.getElementById('chat-history');
    h.innerHTML += `<div class='message-bubble msg-received'><strong>${c.s}:</strong> ${c.m}</div>`;
    h.scrollTop = h.scrollHeight;
}
function handleChatAction(guess) {
    const c = chats[curChat];
    const isCorrect = guess === c.isPhish;
    const title = document.getElementById('briefing-title');
    const text = document.getElementById('briefing-text');
    const overlay = document.getElementById('briefing-overlay');

    title.innerText = isCorrect ? "✓ CORRECT" : "✗ BREACH";
    title.style.color = isCorrect ? "var(--success)" : "var(--danger)";
    text.innerText = c.exp;
    overlay.classList.remove('hidden');
}

function nextChatScenario() {
    document.getElementById('briefing-overlay').classList.add('hidden');
    curChat++;
    if (curChat < chats.length) {
        loadChat();
    } else {
        const hist = document.getElementById('chat-history');
        hist.innerHTML += `<div class='message-bubble msg-received' style='border:2px solid var(--success); width: 90%; max-width: 90%; text-align: center; align-self: center; background: rgba(0, 255, 157, 0.1);'><strong>SIMULATION COMPLETE</strong><br>Social Engineering Audit Finished. Return to dashboard to submit results.</div>`;
        document.getElementById('chat-controls').classList.add('hidden');
    }
}

// --- 7. FORENSICS (8 LEAKS, RANDOM) ---
let foundLeaks = new Set();
function initForensics() {
    foundLeaks = new Set(); document.getElementById('leaks-found-count').innerText = "0";
    const desktop = document.querySelector('.virtual-desktop');
    const icons = Array.from(desktop.querySelectorAll('.desktop-icon'));
    icons.sort(()=>Math.random()-0.5).forEach(i => desktop.appendChild(i));
    document.getElementById('forensics-summary').classList.add('hidden');
}
function inspectDesktopItem(item) {
    const leaks = {
        sticky: "secrets.txt\n\nUser: admin\nPass: Winter2025!\n\nSTATUS: Plaintext credentials found.",
        config: "env.config\n\nDB_HOST=10.0.0.5\nAPI_KEY=sk_live_51P2z...\n\nSTATUS: Hardcoded secrets found.",
        trash: "trash_bin\n\nFile: Deleted_Merger_Plan.docx\n\nSTATUS: Sensitive data in trash.",
        logs: "sys.log\n\n03:22:11 - Login Fail\n03:22:15 - Login Fail\n03:22:19 - Login Success\n\nSTATUS: Brute-force logs found.",
        trojan: "system_patch.exe\n\nMetadata: Unknown signature.\nSize: 4.2MB\n\nSTATUS: Malicious executable found.",
        keylogger: "lib_key.dll\n\nHooks: Keyboard, Clipboard\nDest: 192.168.1.50\n\nSTATUS: Active keylogger found.",
        malware: "ransom.dmg\n\nMetadata: Encrypted blob detected.\n\nSTATUS: Ransomware payload found.",
        ssh_keys: "id_rsa\n\n-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA7...\n\nSTATUS: Private key exposed!",
        network_map: "network.png\n\nInternal IPs, VLAN tags, and Gateway addresses revealed.\n\nSTATUS: Network reconnaissance data found.",
        browser: "History.db\n\nVisited: https://internal-wiki.corp/admin/passwords\n\nSTATUS: Exposed internal URLs found.",
        keygen: "keygen.zip\n\nCracked software containing potential backdoors.\n\nSTATUS: Unauthorized software found."
    };

    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    const modal = document.getElementById('forensics-modal');

    if (leaks[item]) {
        title.innerText = "SECURITY ALERT";
        content.innerText = leaks[item];
        foundLeaks.add(item);
        document.getElementById(`icon-${item}`).classList.add('leak-found');
        document.getElementById('leaks-found-count').innerText = foundLeaks.size;
    } else {
        title.innerText = "File Inspector";
        content.innerText = "Metadata: Verified Safe.\nSize: 1.2MB\nType: Application/Data";
    }
    modal.classList.remove('hidden');

    if (foundLeaks.size >= 8) {
        setTimeout(() => {
            modal.classList.add('hidden');
            document.getElementById('forensics-summary').classList.remove('hidden');
        }, 1000);
    }
}

function closeForensicsModal() {
    document.getElementById('forensics-modal').classList.add('hidden');
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial centering with slight delay to ensure layout is calculated
    setTimeout(updateCarousel, 100);
    window.addEventListener('resize', updateCarousel);
});
