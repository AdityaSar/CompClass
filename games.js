// --- MISSION METADATA ---
const missionIntros = {
    phishing: {
        title: "Inbox Defender",
        icon: "📧",
        description: "Analyze 15 security alerts for signs of social engineering. Attackers use deceptive domains, urgent threats, and malicious links. Audit the inbox and neutralize the threats."
    },
    threathunter: {
        title: "Threat Hunter",
        icon: "🕵️‍♂️",
        description: "The system is under attack! Identify and terminate 3 malicious threats hidden in active processes. Caution: Terminating legitimate services will destabilize the machine."
    },
    crypto: {
        title: "Crypto Lab",
        icon: "🔐",
        description: "Decrypt intercepted communications using historical Caesar ciphers. Adjust the shift value (4, 12, and 21) to reveal the original plaintext."
    },
    password: {
        title: "Password Vault",
        icon: "🔑",
        description: "Test your access keys against brute-force entropy algorithms. High complexity and length are critical for surviving modern cracking attempts."
    },
    quiz: {
        title: "Security Trivia",
        icon: "🛡️",
        description: "Test your fundamental cybersecurity knowledge. Master concepts from MFA to Zero-Day exploits to complete your training."
    },
    social: {
        title: "Social Engineering",
        icon: "💬",
        description: "Audit a series of chat interactions to identify psychological manipulation tactics like authority, urgency, and technical baiting."
    },
    forensics: {
        title: "Digital Forensics",
        icon: "🔍",
        description: "A workstation is compromised. Audit the environment to find 8 specific security leaks, exposed credentials, and suspicious activity logs."
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

function selectCarouselItem(index) {
    carouselIndex = index;
    updateCarousel();
}

function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const bgOverlay = document.getElementById('bg-overlay');
    if (!items.length) return;

    const activeItem = items[carouselIndex];
    activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    items.forEach((item, idx) => {
        const isActive = idx === carouselIndex;
        item.classList.toggle('active', isActive);
        if (isActive) {
            const rgb = item.style.getPropertyValue('--item-rgb');
            if (bgOverlay && rgb) {
                bgOverlay.style.background = `radial-gradient(circle at 50% 50%, rgba(${rgb}, 0.15) 0%, #0a0a12 100%)`;
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
    { from: "support@netfIix.com", subject: "Payment Failed", body: "Update your card <a href='#'>here</a> or account will be deleted.", isPhish: true, reason: "Fake domain (netfIix with 'I') and artificial urgency." },
    { from: "noreply@github.com", subject: "New Login", body: "A new login was detected from London. If this was you, ignore.", isPhish: false, reason: "Legitimate security alert from a verified domain." },
    { from: "admin@your-bank-secure.biz", subject: "Unusual Activity", body: "Download Secure_Login.exe to verify your identity.", isPhish: true, reason: "Banks never send .exe files or use .biz domains." },
    { from: "hr@company.com", subject: "Annual Survey", body: "Please complete the internal satisfaction survey by Friday.", isPhish: false, reason: "Plausible internal communication." },
    { from: "security@amaz0n.com", subject: "Order Issue", body: "Verify your order details <a href='#'>here</a>.", isPhish: true, reason: "Domain uses a zero instead of 'o'." },
    { from: "no-reply@microsoft.com", subject: "Password Changed", body: "Your account password was successfully changed.", isPhish: false, reason: "Standard security notification." },
    { from: "shipping@fedex-claims.net", subject: "Package Delay", body: "Pay $2.00 redelivery fee <a href='#'>here</a>.", isPhish: true, reason: "Smishing tactic: small fees for card harvesting." },
    { from: "ceo@company-direct.com", subject: "Quick Task", body: "Are you at your desk? Need a discrete wire transfer done.", isPhish: true, reason: "Whaling/CEO Fraud: unusual requests from executives." },
    { from: "updates@linkedin.com", subject: "Profile Views", body: "3 people viewed your profile today.", isPhish: false, reason: "Standard social network update." },
    { from: "refund@irs.gov.co", subject: "Tax Refund", body: "Submit bank details <a href='#'>here</a> for your $1,200 refund.", isPhish: true, reason: "IRS doesn't email about refunds; fake domain .gov.co." },
    { from: "support@steam-community.com", subject: "Trade Offer", body: "Review your new items <a href='#'>here</a>.", isPhish: false, reason: "Legitimate platform notification." },
    { from: "billing@hulu-promo.vip", subject: "50% OFF FOR LIFE", body: "Renew in 10 mins for this exclusive deal!", isPhish: true, reason: "Extreme urgency and unusual .vip TLD." },
    { from: "it@company-helpdesk.com", subject: "Maintenance", body: "Servers will be down tonight at 2 AM.", isPhish: false, reason: "Routine IT announcement." },
    { from: "alert@paypal-security.com", subject: "Account Locked", body: "Unauthorized access detected. Unlock <a href='#'>here</a>.", isPhish: true, reason: "Phishing site mimicking PayPal security." },
    { from: "noreply@spotify.com", subject: "Family Plan Update", body: "Your monthly invoice is ready for review.", isPhish: false, reason: "Legitimate billing notification." }
];

let curEmail = 0, phishScore = 0;

function initPhish() {
    curEmail = 0; phishScore = 0;
    document.getElementById('score').innerText = "0";
    document.getElementById('phish-summary').classList.add('hidden');
    loadEmail();
}

function loadEmail() {
    if (curEmail >= emails.length) {
        document.getElementById('email-display').innerHTML = `<div style='text-align:center; padding: 40px;'><h2 style='color:var(--success)'>AUDIT COMPLETE</h2><p>Score: ${phishScore}/15</p></div>`;
        document.querySelectorAll('.btn-action').forEach(b => b.classList.add('hidden'));
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
    if (guess === e.isPhish) { phishScore++; fb.style.color = "var(--success)"; fb.innerText = "✓ CORRECT: " + e.reason; }
    else { fb.style.color = "var(--danger)"; fb.innerText = "✗ INCORRECT: " + e.reason; }
    document.getElementById('score').innerText = phishScore;
    curEmail++;
    document.getElementById('phish-next-btn').classList.remove('hidden');
}

// --- 2. THREAT HUNTER (3 THREATS, TERMINATE) ---
let hunterActive = false, stability = 100, hunterScore = 0, hunterInterval;
const hunts = [];

function startHunter() {
    hunterActive = true; stability = 100; hunterScore = 0; hunts.length = 0;
    document.getElementById('hunter-score').innerText = "0";
    document.getElementById('hunter-game-over').classList.add('hidden');
    document.getElementById('hunter-victory').classList.add('hidden');
    for(let i=0; i<6; i++) spawnProc(i < 3); // 3 Initial threats
    hunterInterval = setInterval(() => {
        if (!hunterActive) return;
        if (Math.random() > 0.8 && hunts.length < 10) spawnProc(false);
        let activeThreats = hunts.filter(p => p.isThreat).length;
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
    if (p.isThreat) { hunterScore++; document.getElementById('hunter-score').innerText = hunterScore; if (hunterScore >= 3) { hunterActive = false; document.getElementById('hunter-victory').classList.remove('hidden'); } }
    else { stability -= 20; }
    hunts.splice(idx, 1); updateStabilityUI(); renderHunts();
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
        if (curCrypto < 2) { curCrypto++; setTimeout(loadCrypto, 1000); }
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
    { q: "What is MFA?", opts: ["Multi-Factor Authentication", "Main Firewall Access", "Mobile File Archive"], a: "Multi-Factor Authentication", exp: "MFA requires 2+ forms of verification." },
    { q: "What is a Zero-Day?", opts: ["Known bug", "Unknown flaw with no patch", "A 0-byte virus"], a: "Unknown flaw with no patch", exp: "Vendors have had 'zero days' to fix it." },
    { q: "Social Engineering targets what?", opts: ["Hardware", "The human element", "Database indexes"], a: "The human element", exp: "It tricks people into giving up secrets." }
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
    { s: "Mike_IT", m: "Security check. Install 'Update.exe' from this link immediately.", isPhish: true, exp: "IT won't ask users to install executables via chat." }
];
let curChat = 0;

function initSocialChat() { curChat = 0; document.getElementById('chat-history').innerHTML = ""; loadChat(); }
function loadChat() {
    const c = chats[curChat], h = document.getElementById('chat-history');
    h.innerHTML += `<div class='message-bubble msg-received'><strong>${c.s}:</strong> ${c.m}</div>`;
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
        hist.innerHTML += `<div class='message-bubble msg-received' style='border:1px solid var(--neon-purple)'><strong>SYSTEM:</strong> Audit Complete. Simulation successful.</div>`;
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
        ssh_keys: "id_rsa\n\n-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA7...\n\nSTATUS: Private key exposed!"
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

    if (foundLeaks.size === 8) {
        setTimeout(() => {
            modal.classList.add('hidden');
            document.getElementById('forensics-summary').classList.remove('hidden');
        }, 1500);
    }
}

function closeForensicsModal() {
    document.getElementById('forensics-modal').classList.add('hidden');
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => { updateCarousel(); window.addEventListener('resize', updateCarousel); });
