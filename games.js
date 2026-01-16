// --- PHISHING GAME LOGIC ---
const emails = [
    {
        from: "support@netfIix.com", // Notice the capital I
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
        reason: "This is a standard security notification from a verified domain."
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
        reason: "This is a typical internal company email from a plausible domain."
    },
    {
        from: "accounts@amaz0n-security.com",
        subject: "Problem with your order",
        body: "There was an issue with your recent order. Please sign in <a href='#'>here</a> to verify your account details or your order will be cancelled.",
        isPhish: true,
        reason: "The domain 'amaz0n' uses a zero instead of an 'o', a classic typosquatting technique."
    }
];

let currentEmail = 0;
let score = 0;

function loadEmail() {
    const e = emails[currentEmail];
    document.getElementById('email-display').innerHTML = `
        <div class="email-header"><strong>From:</strong> ${e.from}<br><strong>Subject:</strong> ${e.subject}</div>
        <div class="email-body">${e.body}</div>
    `;
    document.getElementById('phish-feedback').innerText = "";

    // Re-enable buttons
    const buttons = document.querySelectorAll('.btn-group button');
    buttons.forEach(btn => btn.disabled = false);
}

function checkPhish(userGuessPhish) {
    const e = emails[currentEmail];
    const feedback = document.getElementById('phish-feedback');

    // Disable buttons to prevent double-clicking
    const buttons = document.querySelectorAll('.btn-group button');
    buttons.forEach(btn => btn.disabled = true);

    if (userGuessPhish === e.isPhish) {
        score++;
        feedback.style.color = "var(--neon-green)";
        feedback.innerText = "Correct! " + e.reason;
    } else {
        feedback.style.color = "var(--neon-red)";
        feedback.innerText = "Incorrect. " + e.reason;
    }

    document.getElementById('score').innerText = score;
    currentEmail = (currentEmail + 1) % emails.length;
    setTimeout(loadEmail, 3000);
}

// --- PASSWORD GAME LOGIC ---
function calculatePassword() {
    const pw = document.getElementById('pw-input').value;
    const result = document.getElementById('pw-result');

    if (pw.length === 0) {
        result.innerText = "Enter a password to test security.";
        result.style.color = "white";
        return;
    }

    let entropy = 0;
    if (/[a-z]/.test(pw)) entropy += 26;
    if (/[A-Z]/.test(pw)) entropy += 26;
    if (/[0-9]/.test(pw)) entropy += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) entropy += 32;

    const combinations = Math.pow(entropy, pw.length);
    const crackTimeSeconds = combinations / 1000000000; // Assume 1 billion guesses per second

    let timeText = "";
    if (crackTimeSeconds < 1) timeText = "Instantly (Less than a second)";
    else if (crackTimeSeconds < 60) timeText = "Under a minute";
    else if (crackTimeSeconds < 3600) timeText = "A few hours";
    else if (crackTimeSeconds < 86400) timeText = "A few days";
    else if (crackTimeSeconds < 31536000) timeText = "Months";
    else if (crackTimeSeconds < 31536000 * 100) timeText = "Decades";
    else timeText = "Centuries!";

    result.innerText = "Time to crack: " + timeText;

    if (pw.length < 8) {
        result.style.color = "var(--neon-red)";
    } else if (pw.length >= 12 && entropy > 50) {
        result.style.color = "var(--neon-green)";
    } else {
        result.style.color = "orange";
    }
}

// --- NAVIGATION LOGIC ---
function openGame(gameId) {
    document.getElementById('game-dashboard').classList.add('hidden');
    document.getElementById('game-arena').classList.remove('hidden');

    // Hide all games
    document.querySelectorAll('.game-container').forEach(g => g.classList.add('hidden'));

    // Show selected game
    const selected = document.getElementById('game-' + gameId);
    selected.classList.remove('hidden');

    // Initialize if needed
    if (gameId === 'phishing') loadEmail();
    if (gameId === 'encryption') initEncryption();
    if (gameId === 'quiz') initQuiz();
}

function closeGame() {
    document.getElementById('game-dashboard').classList.remove('hidden');
    document.getElementById('game-arena').classList.add('hidden');
}

// --- ENCRYPTION GAME LOGIC ---
const cipherSecrets = [
    { cipher: "WKLV LV D VHFUHW", plain: "THIS IS A SECRET", shift: 3 },
    { cipher: "DBEFS EFGFOTF", plain: "CYBER DEFENSE", shift: 1 },
    { cipher: "KDEMLQJ LV IXQ", plain: "HACKING IS FUN", shift: 3 },
    { cipher: "FYYFHP FY IFBS", plain: "ATTACK AT DAWN", shift: 5 }
];

let currentCipher = 0;

function initEncryption() {
    currentCipher = Math.floor(Math.random() * cipherSecrets.length);
    document.getElementById('cipher-text').innerText = cipherSecrets[currentCipher].cipher;
    document.getElementById('cipher-shift').value = 0;
    updateDecryption();
}

function updateDecryption() {
    const cipherText = document.getElementById('cipher-text').innerText;
    const shift = parseInt(document.getElementById('cipher-shift').value) || 0;
    const feedback = document.getElementById('encryption-feedback');

    let result = "";
    for (let i = 0; i < cipherText.length; i++) {
        let charCode = cipherText.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            result += String.fromCharCode(((charCode - 65 - shift + 26) % 26) + 65);
        } else {
            result += cipherText[i];
        }
    }

    document.getElementById('decrypted-text').innerText = result;

    if (result === cipherSecrets[currentCipher].plain) {
        feedback.innerText = "🎉 Correct! You decrypted the message.";
        feedback.style.color = "var(--neon-green)";
    } else {
        feedback.innerText = "";
    }
}

// --- QUIZ GAME LOGIC ---
const quizQuestions = [
    {
        q: "What does 'MFA' stand for?",
        options: ["Multi-Factor Authentication", "Main Firewall Access", "Mobile File Archive", "Multi-Functional Array"],
        a: 0
    },
    {
        q: "Which of these is the strongest password?",
        options: ["Password123", "Admin!", "Tr0pical_Breeze#99", "12345678"],
        a: 2
    },
    {
        q: "What is 'social engineering'?",
        options: ["Writing code for social media", "Manipulating people to give up secrets", "Building faster networks", "Automated marketing"],
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
        feedback.innerText = "Correct! Well done.";
        feedback.style.color = "var(--neon-green)";

        currentQuizIdx = (currentQuizIdx + 1) % quizQuestions.length;
        setTimeout(loadQuizQuestion, 2000);
    } else {
        feedback.innerText = "Incorrect. Try again!";
        feedback.style.color = "var(--neon-red)";
    }
}

// Initialize games if elements exist
window.addEventListener('DOMContentLoaded', () => {
    // Initial load handled by showSection/openGame
});
