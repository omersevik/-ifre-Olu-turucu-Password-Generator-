const lengthSlider = document.getElementById('length');
const lengthNumber = document.getElementById('length-number');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const excludeSimilarEl = document.getElementById('exclude-similar');
const generateBtn = document.getElementById('generate');
const passwordEl = document.getElementById('password');
const copyBtn = document.getElementById('copy');
const strengthMeter = document.getElementById('strength-meter');
const strengthText = document.getElementById('strength-text');
const notification = document.getElementById('notification');

// Sync range and number inputs
lengthSlider.addEventListener('input', syncLength);
lengthNumber.addEventListener('input', syncLength);

function syncLength(e) {
    const value = e.target.value;
    lengthSlider.value = value;
    lengthNumber.value = value;
}

// Generate password on button click
generateBtn.addEventListener('click', generatePassword);

// Generate password on page load
window.addEventListener('load', generatePassword);

// Copy password to clipboard
copyBtn.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    const password = passwordEl.innerText;

    if (!password || password === 'Şifreniz burada görünecek') {
        return;
    }

    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();

    // Show notification
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
});

function generatePassword() {
    const length = +lengthSlider.value;
    const hasUpper = uppercaseEl.checked;
    const hasLower = lowercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;
    const excludeSimilar = excludeSimilarEl.checked;

    if (!hasUpper && !hasLower && !hasNumber && !hasSymbol) {
        alert('En az bir karakter tipini seçmelisiniz!');
        return;
    }

    passwordEl.innerText = generateRandomPassword(
        length,
        hasUpper,
        hasLower,
        hasNumber,
        hasSymbol,
        excludeSimilar
    );

    updateStrengthMeter();
}

function generateRandomPassword(length, upper, lower, number, symbol, excludeSimilar) {
    let charCodes = [];
    const similarChars = ['i', 'l', '1', 'L', 'o', '0', 'O'];

    if (upper) {
        const upperCharCodes = getCharCodesArray(65, 90);
        charCodes = charCodes.concat(
            excludeSimilar 
                ? upperCharCodes.filter(code => !similarChars.includes(String.fromCharCode(code)))
                : upperCharCodes
        );
    }

    if (lower) {
        const lowerCharCodes = getCharCodesArray(97, 122);
        charCodes = charCodes.concat(
            excludeSimilar 
                ? lowerCharCodes.filter(code => !similarChars.includes(String.fromCharCode(code)))
                : lowerCharCodes
        );
    }

    if (number) {
        const numberCharCodes = getCharCodesArray(48, 57);
        charCodes = charCodes.concat(
            excludeSimilar 
                ? numberCharCodes.filter(code => !similarChars.includes(String.fromCharCode(code)))
                : numberCharCodes
        );
    }

    if (symbol) {
        const symbolCharCodes = [
            ...getCharCodesArray(33, 47),
            ...getCharCodesArray(58, 64),
            ...getCharCodesArray(91, 96),
            ...getCharCodesArray(123, 126)
        ];
        charCodes = charCodes.concat(symbolCharCodes);
    }

    if (charCodes.length === 0) return '';

    const password = [];
    // Ensure at least one character from each selected type
    if (upper) {
        const availUpperChars = getCharCodesArray(65, 90).filter(code => 
            !excludeSimilar || !similarChars.includes(String.fromCharCode(code))
        );
        if (availUpperChars.length > 0) {
            password.push(String.fromCharCode(availUpperChars[Math.floor(Math.random() * availUpperChars.length)]));
        }
    }
    
    if (lower) {
        const availLowerChars = getCharCodesArray(97, 122).filter(code => 
            !excludeSimilar || !similarChars.includes(String.fromCharCode(code))
        );
        if (availLowerChars.length > 0) {
            password.push(String.fromCharCode(availLowerChars[Math.floor(Math.random() * availLowerChars.length)]));
        }
    }
    
    if (number) {
        const availNumberChars = getCharCodesArray(48, 57).filter(code => 
            !excludeSimilar || !similarChars.includes(String.fromCharCode(code))
        );
        if (availNumberChars.length > 0) {
            password.push(String.fromCharCode(availNumberChars[Math.floor(Math.random() * availNumberChars.length)]));
        }
    }
    
    if (symbol) {
        const symbolCharCodes = [
            ...getCharCodesArray(33, 47),
            ...getCharCodesArray(58, 64),
            ...getCharCodesArray(91, 96),
            ...getCharCodesArray(123, 126)
        ];
        password.push(String.fromCharCode(symbolCharCodes[Math.floor(Math.random() * symbolCharCodes.length)]));
    }

    // Fill rest of the password
    for (let i = password.length; i < length; i++) {
        const charCode = charCodes[Math.floor(Math.random() * charCodes.length)];
        password.push(String.fromCharCode(charCode));
    }

    // Shuffle the password array to mix character types
    return shuffleArray(password).join('');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getCharCodesArray(low, high) {
    const array = [];
    for (let i = low; i <= high; i++) {
        array.push(i);
    }
    return array;
}

function updateStrengthMeter() {
    const password = passwordEl.innerText;
    const length = password.length;
    
    strengthMeter.className = 'strength-meter';
    
    // Reset text
    if (password === 'Şifreniz burada görünecek') {
        strengthText.innerText = 'Şifre gücü: Henüz şifre oluşturulmadı';
        return;
    }

    // Calculate strength score
    let score = 0;
    
    // Length score (0-3)
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    
    // Character variety score (0-4)
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    
    // Update the strength meter and text
    if (score < 4) {
        strengthMeter.classList.add('weak');
        strengthText.innerText = 'Şifre gücü: Zayıf';
    } else if (score < 6) {
        strengthMeter.classList.add('medium');
        strengthText.innerText = 'Şifre gücü: Orta';
    } else {
        strengthMeter.classList.add('strong');
        strengthText.innerText = 'Şifre gücü: Güçlü';
    }
}