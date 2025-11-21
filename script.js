document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Scientific ---
    const display = document.getElementById('main-display');
    const historyDisplay = document.getElementById('history-display');
    const buttons = document.querySelectorAll('.btn');

    let currentExpression = '';
    let waitingForNewInput = false;

    // --- Elemen Skala ---
    const scaleModeSelector = document.getElementById('scale-mode');
    const scaleCalculatorForm = document.getElementById('scale-calculator-form');
    const scaleResultDiv = document.getElementById('scale-calculation-result');
    
    // Faktor Konversi ke CM
    const CONVERSION_FACTORS_TO_CM = {
        'cm': 1, 'dm': 10, 'm': 100, 'km': 100000
    };
    
    // ==============================================
    // 1. FUNGSI SCIENTIFIC & UTAMA
    // ==============================================

    window.fact = (n) => { // Faktorial
        n = Math.floor(n); 
        if (n === 0 || n === 1) return 1;
        if (n < 0) return NaN;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    };

    function calculateScientific(expression) {
        // Ganti simbol ke format yang bisa dievaluasi JS
        expression = expression.replace(/(\d+)!/g, 'fact($1)').replace(/√/g, 'Math.sqrt').replace(/log/g, 'Math.log10')
            .replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos').replace(/tan/g, 'Math.tan')
            .replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E').replace(/\^/g, '**'); 
        
        try {
            let result = eval(expression);
            if (result === Infinity || isNaN(result)) return 'ERROR';
            return parseFloat(result.toFixed(12));
        } catch (error) {
            return 'ERROR';
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            const action = button.dataset.action;
            const op = button.dataset.op;
            const isNumberOrDot = button.classList.contains('num') || button.classList.contains('dot');
            const isOperator = button.classList.contains('op') && value !== '=';
            const isDMS = button.classList.contains('dms-calc');
            
            if (isDMS) return; 

            if (action === 'clear') { // AC
                currentExpression = ''; display.value = '0'; historyDisplay.textContent = ''; waitingForNewInput = false; return;
            }
            if (action === 'backspace') { // DEL
                currentExpression = currentExpression.slice(0, -1); display.value = currentExpression || '0'; return;
            }
            if (value === '=') { // EQUALS
                if (currentExpression === '' || currentExpression.includes('ERROR')) return;
                historyDisplay.textContent = currentExpression + ' =';
                const result = calculateScientific(currentExpression);
                currentExpression = (result === 'ERROR') ? '' : String(result);
                display.value = (result === 'ERROR') ? 'ERROR' : currentExpression;
                waitingForNewInput = true; return;
            }
            
            // Input Angka dan Titik
            if (isNumberOrDot) {
                if (waitingForNewInput) { currentExpression = value; waitingForNewInput = false; } 
                else if (currentExpression === '0' && value !== '.') { currentExpression = value; }
                else { currentExpression += value; }
            }
            // Input Operator
            else if (isOperator) {
                 if (currentExpression === '') return;
                 if (waitingForNewInput) waitingForNewInput = false;
                 const lastChar = currentExpression.slice(-1);
                 currentExpression = (['+', '-', '*', '/', '^'].includes(lastChar)) ? currentExpression.slice(0, -1) + op : currentExpression + op;
            }
            // Input Fungsi Scientific
            else if (op) {
                if (waitingForNewInput) { currentExpression = ''; waitingForNewInput = false; }
                if (op === 'exp') currentExpression += '^';
                else if (op === 'fact') currentExpression += '!'; 
                else if (op === 'pi' || op === 'e') currentExpression += value; 
                else if (op !== 'rad') currentExpression += op + (op === ')' ? '' : '(');
            }

            if (value !== '=') display.value = currentExpression || '0';
        });
    });

    // --- FUNGSI DMS ---
    document.getElementById('calculate-dms').addEventListener('click', () => {
        const d1 = parseFloat(document.getElementById('deg1').value) || 0;
        const m1 = parseFloat(document.getElementById('min1').value) || 0;
        const s1 = parseFloat(document.getElementById('sec1').value) || 0;
        const d2 = parseFloat(document.getElementById('deg2').value) || 0;
        const m2 = parseFloat(document.getElementById('min2').value) || 0;
        const s2 = parseFloat(document.getElementById('sec2').value) || 0;
        const resultDiv = document.getElementById('dms-result');

        let totalSeconds = s1 + s2;
        let extraMinutes = Math.floor(totalSeconds / 60);
        let finalSeconds = totalSeconds % 60;

        let totalMinutes = m1 + m2 + extraMinutes;
        let extraDegrees = Math.floor(totalMinutes / 60);
        let finalMinutes = totalMinutes % 60;

        let finalDegrees = d1 + d2 + extraDegrees;

        resultDiv.innerHTML = `Hasil: <strong>${finalDegrees}° ${finalMinutes}' ${finalSeconds.toFixed(2)}''</strong>`;
    });
    
    // ==============================================
    // 2. LOGIKA KALKULATOR SKALA
    // ==============================================

    function convertUnit(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;
        const valueInCm = value * CONVERSION_FACTORS_TO_CM[fromUnit];
        return valueInCm / CONVERSION_FACTORS_TO_CM[toUnit];
    }

    function createUnitOptions(selectedUnit) {
        const units = ['cm', 'dm', 'm', 'km'];
        return units.map(unit => 
            `<option value="${unit}" ${unit === selectedUnit ? 'selected' : ''}>${unit}</option>`
        ).join('');
    }

    const scaleTemplates = {
        findJs: `
            <div class="input-group"><label for="skala">Skala (Angka X dari 1:X)</label><div class="input-fields"><input type="number" id="skala" min="1" required></div></div>
            <div class="input-group"><label for="jp-value">Jarak Peta (Jp)</label><div class="input-fields"><input type="number" id="jp-value" min="0" required><select id="jp-unit">${createUnitOptions('cm')}</select></div></div>
            <div class="input-group"><label for="js-unit-target">Satuan Hasil Jarak Sebenarnya</label><div class="input-fields"><select id="js-unit-target">${createUnitOptions('km')}</select></div></div>
            <button type="submit" class="calculate-btn">Hitung Jarak Sebenarnya (Js)</button>
        `,
        findJp: `
            <div class="input-group"><label for="skala">Skala (Angka X dari 1:X)</label><div class="input-fields"><input type="number" id="skala" min="1" required></div></div>
            <div class="input-group"><label for="js-value">Jarak Sebenarnya (Js)</label><div class="input-fields"><input type="number" id="js-value" min="0" required><select id="js-unit">${createUnitOptions('km')}</select></div></div>
            <div class="input-group"><label for="jp-unit-target">Satuan Hasil Jarak Peta</label><div class="input-fields"><select id="jp-unit-target">${createUnitOptions('cm')}</select></div></div>
            <button type="submit" class="calculate-btn">Hitung Jarak Peta (Jp)</button>
        `,
        findSkala: `
            <div class="input-group"><label for="jp-value">Jarak Peta (Jp)</label><div class="input-fields"><input type="number" id="jp-value" min="0" required><select id="jp-unit">${createUnitOptions('cm')}</select></div></div>
            <div class="input-group"><label for="js-value">Jarak Sebenarnya (Js)</label><div class="input-fields"><input type="number" id="js-value" min="0" required><select id="js-unit">${createUnitOptions('km')}</select></div></div>
            <button type="submit" class="calculate-btn">Hitung Skala (S)</button>
        `
    };

    window.changeScaleMode = function() {
        const mode = scaleModeSelector.value;
        scaleCalculatorForm.innerHTML = scaleTemplates[mode];
        scaleCalculatorForm.onsubmit = (e) => {
            e.preventDefault(); 
            calculateScale(mode);
        };
    };

    function calculateScale(mode) {
        const getVal = (id) => document.getElementById(id) ? parseFloat(document.getElementById(id).value) : NaN;
        const getUnit = (id) => document.getElementById(id) ? document.getElementById(id).value : '';
        let result = '';

        try {
            if (mode === 'findJs') {
                const skala = getVal('skala'); const jpValue = getVal('jp-value'); const jpUnit = getUnit('jp-unit'); const jsUnitTarget = getUnit('js-unit-target');
                if (isNaN(skala) || isNaN(jpValue) || skala <= 0 || jpValue < 0) throw new Error("Input tidak valid.");
                const jpCm = convertUnit(jpValue, jpUnit, 'cm');
                const jsCm = jpCm * skala;
                const jsResult = convertUnit(jsCm, 'cm', jsUnitTarget);
                result = `Jarak Sebenarnya (Js) adalah **${jsResult.toLocaleString(undefined, { maximumFractionDigits: 3 })} ${jsUnitTarget}**`;
            } 
            else if (mode === 'findJp') {
                const skala = getVal('skala'); const jsValue = getVal('js-value'); const jsUnit = getUnit('js-unit'); const jpUnitTarget = getUnit('jp-unit-target');
                if (isNaN(skala) || isNaN(jsValue) || skala <= 0 || jsValue < 0) throw new Error("Input tidak valid.");
                const jsCm = convertUnit(jsValue, jsUnit, 'cm');
                const jpCm = jsCm / skala;
                const jpResult = convertUnit(jpCm, 'cm', jpUnitTarget);
                result = `Jarak Peta (Jp) adalah **${jpResult.toLocaleString(undefined, { maximumFractionDigits: 3 })} ${jpUnitTarget}**`;
            } 
            else if (mode === 'findSkala') {
                const jpValue = getVal('jp-value'); const jpUnit = getUnit('jp-unit'); const jsValue = getVal('js-value'); const jsUnit = getUnit('js-unit');
                if (isNaN(jpValue) || isNaN(jsValue) || jpValue <= 0 || jsValue <= 0) throw new Error("Input tidak valid.");
                const jpCm = convertUnit(jpValue, jpUnit, 'cm');
                const jsCm = convertUnit(jsValue, jsUnit, 'cm');
                const scaleX = jsCm / jpCm;
                if (scaleX === Infinity || scaleX === 0) throw new Error("Pembagian tidak valid.");
                result = `Skala (S) adalah **1 : ${scaleX.toLocaleString(undefined, { maximumFractionDigits: 0 })}**`;
            }
        } catch (e) {
            result = `Terjadi ERROR: ${e.message}`;
        }
        
        scaleResultDiv.innerHTML = `<p class="final-result">${result}</p>`;
    }
    
    // Inisialisasi: Tampilkan form skala default
    changeScaleMode(); 
})
