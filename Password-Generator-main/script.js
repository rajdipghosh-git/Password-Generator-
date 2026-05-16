// ===================================
// PASSWORD GENERATOR — Script
// Designed & Built by Rajdip Ghosh
// ===================================

// Character sets (full alphabet for better passwords)
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?/~`'
};

// DOM Elements
const display = document.getElementById('display');
const slider = document.getElementById('slider');
const lengthValue = document.getElementById('length-value');
const copyBtn = document.getElementById('copy-btn');
const copyTooltip = document.getElementById('copy-tooltip');
const form = document.getElementById('form-submit');
const generateBtn = document.getElementById('btn');

const upperEl = document.getElementById('capital');
const lowerEl = document.getElementById('small');
const numberEl = document.getElementById('num');
const symbolEl = document.getElementById('symbol');

const strengthBars = [
    document.getElementById('str-bar-1'),
    document.getElementById('str-bar-2'),
    document.getElementById('str-bar-3'),
    document.getElementById('str-bar-4')
];
const strengthText = document.getElementById('strength-text');

// -------- Slider --------
function updateSliderProgress() {
    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    const val = parseInt(slider.value);
    const percent = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--slider-progress', percent + '%');
    lengthValue.textContent = val;
}

slider.addEventListener('input', updateSliderProgress);
updateSliderProgress(); // Initialize

// -------- Password Generation --------
function generatePassword(length) {
    let pool = '';

    if (upperEl.checked) pool += charSets.uppercase;
    if (lowerEl.checked) pool += charSets.lowercase;
    if (numberEl.checked) pool += charSets.numbers;
    if (symbolEl.checked) pool += charSets.symbols;

    if (pool === '') {
        return '';
    }

    // Ensure at least one character from each selected set
    let password = '';
    const selectedSets = [];
    if (upperEl.checked) selectedSets.push(charSets.uppercase);
    if (lowerEl.checked) selectedSets.push(charSets.lowercase);
    if (numberEl.checked) selectedSets.push(charSets.numbers);
    if (symbolEl.checked) selectedSets.push(charSets.symbols);

    // Add one guaranteed character from each selected set
    selectedSets.forEach(set => {
        password += set[Math.floor(Math.random() * set.length)];
    });

    // Fill the rest randomly from the full pool
    for (let i = password.length; i < length; i++) {
        password += pool[Math.floor(Math.random() * pool.length)];
    }

    // Shuffle the password so guaranteed chars aren't always at the start
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
}

// -------- Strength Calculation --------
function evaluateStrength(password) {
    if (!password) return { level: 0, label: '—', colorClass: '' };

    let score = 0;
    const length = password.length;

    // Length scoring
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (length >= 24) score++;

    // Character variety scoring
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Map to 1–4 scale
    let level;
    if (score <= 2) level = 1;
    else if (score <= 4) level = 2;
    else if (score <= 6) level = 3;
    else level = 4;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colorClasses = ['', 'active-weak', 'active-fair', 'active-good', 'active-strong'];
    const textColors = ['', '#f87171', '#fb923c', '#fbbf24', '#34d399'];

    return {
        level,
        label: labels[level],
        colorClass: colorClasses[level],
        textColor: textColors[level]
    };
}

function updateStrengthUI(password) {
    const { level, label, colorClass, textColor } = evaluateStrength(password);

    strengthBars.forEach((bar, i) => {
        bar.className = 'strength__bar'; // reset
        if (i < level) {
            bar.classList.add(colorClass);
        }
    });

    strengthText.textContent = label;
    strengthText.style.color = textColor || 'var(--text-muted)';
}

// -------- Form Submit --------
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const length = parseInt(slider.value);

    // Check if at least one option is selected
    if (!upperEl.checked && !lowerEl.checked && !numberEl.checked && !symbolEl.checked) {
        display.value = '';
        display.placeholder = 'Select at least one option!';
        display.style.color = '#f87171';
        updateStrengthUI('');

        setTimeout(() => {
            display.placeholder = 'Click Generate…';
            display.style.color = '';
        }, 2000);
        return;
    }

    const password = generatePassword(length);
    display.value = password;
    display.style.color = '';

    // Animate the display
    const displayContainer = document.getElementById('password-display');
    displayContainer.style.transform = 'scale(1.02)';
    setTimeout(() => {
        displayContainer.style.transform = 'scale(1)';
    }, 150);

    updateStrengthUI(password);

    // Button micro-animation
    generateBtn.style.transform = 'scale(0.96)';
    setTimeout(() => {
        generateBtn.style.transform = '';
    }, 150);
});

// -------- Copy to Clipboard --------
copyBtn.addEventListener('click', function () {
    if (!display.value) return;

    // Modern clipboard API with fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(display.value);
    } else {
        display.select();
        document.execCommand('copy');
    }

    // Show tooltip
    copyTooltip.classList.add('show');
    setTimeout(() => {
        copyTooltip.classList.remove('show');
    }, 1500);

    // Button micro-animation
    copyBtn.style.color = '#34d399';
    setTimeout(() => {
        copyBtn.style.color = '';
    }, 1000);
});

// -------- Auto-generate on load --------
window.addEventListener('DOMContentLoaded', () => {
    // Small delay for the animation to complete
    setTimeout(() => {
        form.dispatchEvent(new Event('submit'));
    }, 700);
});
