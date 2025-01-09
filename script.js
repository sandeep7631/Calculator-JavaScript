const display = document.getElementById('ans');
const equationDisplay = document.getElementById('equation');
const numberButtons = document.querySelectorAll('.number');
const addButton = document.getElementById('add');
const subtractButton = document.getElementById('subtract');
const multiplyButton = document.getElementById('multiply');
const divideButton = document.getElementById('divide');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const decimalButton = document.getElementById('decimal');

let currentValue = '';
let operation = '';
let previousValue = '';
let shouldResetDisplay = false;
let currentEquation = '';

function formatNumber(num) {
    if (num === '') return '0';
    if (num === 'Error') return 'Error';
    
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

function calculateLiveResult() {
    if (!previousValue || !currentValue || !operation) return currentValue;
    
    const prev = parseFloat(previousValue);
    const curr = parseFloat(currentValue);
    
    let result;
    switch(operation) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '×':
            result = prev * curr;
            break;
        case '÷':
            result = curr !== 0 ? prev / curr : 'Error';
            break;
    }
    
    if (result === 'Error') return 'Error';
    return Math.round(result * 100000000) / 100000000;
}

function updateDisplay() {
    equationDisplay.textContent = currentEquation || '0';
    
    // Show live result if we have all necessary components
    if (previousValue && operation && currentValue) {
        display.textContent = formatNumber(calculateLiveResult().toString());
    } else if (currentValue) {
        display.textContent = formatNumber(currentValue);
    } else if (previousValue) {
        display.textContent = formatNumber(previousValue);
    } else {
        display.textContent = '0';
    }
}

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (shouldResetDisplay) {
            currentValue = '';
            shouldResetDisplay = false;
        }
        
        if (button.textContent === '.' && currentValue.includes('.')) return;
        
        if (currentValue.length < 12) {
            currentValue += button.textContent;
            currentEquation += button.textContent;
            updateDisplay();
        }
    });
});

function handleOperator(op) {
    if (currentValue === '') {
        if (previousValue === '') return;
        // If no current value but we have previous value, just update the operator
        currentEquation = previousValue + ' ' + op + ' ';
        operation = op;
        updateDisplay();
        return;
    }
    
    if (previousValue !== '') {
        // Use the live result as the previous value
        previousValue = calculateLiveResult().toString();
        currentValue = '';
        currentEquation = previousValue + ' ' + op + ' ';
    } else {
        previousValue = currentValue;
        currentValue = '';
        currentEquation += ' ' + op + ' ';
    }
    
    operation = op;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    if (!previousValue || !currentValue || !operation) return;
    
    const result = calculateLiveResult();
    
    if (result === 'Error') {
        currentValue = '';
        display.textContent = 'Error';
        currentEquation = 'Error';
    } else {
        let finalEquation = currentEquation + ' = ';
        currentValue = result.toString();
        currentEquation = result.toString();
        equationDisplay.textContent = finalEquation;
        display.textContent = formatNumber(currentValue);
    }
    
    previousValue = '';
    operation = '';
    shouldResetDisplay = true;
}

addButton.addEventListener('click', () => handleOperator('+'));
subtractButton.addEventListener('click', () => handleOperator('-'));
multiplyButton.addEventListener('click', () => handleOperator('×'));
divideButton.addEventListener('click', () => handleOperator('÷'));
equalsButton.addEventListener('click', calculate);

clearButton.addEventListener('click', () => {
    currentValue = '';
    previousValue = '';
    operation = '';
    currentEquation = '';
    updateDisplay();
    shouldResetDisplay = false;
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        if (currentValue.length < 12) {
            if (shouldResetDisplay) {
                currentValue = '';
                shouldResetDisplay = false;
            }
            currentValue += event.key;
            currentEquation += event.key;
            updateDisplay();
        }
    }
    if (event.key === '.') {
        if (!currentValue.includes('.')) {
            currentValue += '.';
            currentEquation += '.';
            updateDisplay();
        }
    }
    if (event.key === '+') handleOperator('+');
    if (event.key === '-') handleOperator('-');
    if (event.key === '*') handleOperator('×');
    if (event.key === '/') {
        event.preventDefault();
        handleOperator('÷');
    }
    if (event.key === 'Enter' || event.key === '=') calculate();
    if (event.key === 'Escape') clearButton.click();
    if (event.key === 'Backspace') {
        currentValue = currentValue.slice(0, -1);
        currentEquation = currentEquation.slice(0, -1);
        updateDisplay();
    }
});
