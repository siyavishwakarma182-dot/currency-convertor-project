
const currencyListURL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";
const rateURL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json";
let rates = {};

// Load currency names and populate dropdowns
async function loadCurrencies() {
    try {
        const res = await fetch(currencyListURL);
        const data = await res.json();
        const from = document.getElementById("fromCurrency");
        const to = document.getElementById("toCurrency");

        for (let code in data) {
            let option1 = document.createElement("option");
            let option2 = document.createElement("option");
            option1.value = option2.value = code;
            // Show code and full name for better UX
            option1.text = option2.text = `${code.toUpperCase()} - ${data[code]}`;
            from.appendChild(option1);
            to.appendChild(option2);
        }
        from.value = "eur";
        to.value = "inr";
    } catch (err) {
        console.error("Failed to load currency list:", err);
    }
}

// Load exchange rates (base EUR)
async function loadRates() {
    try {
        const res = await fetch(rateURL);
        const data = await res.json();
        rates = data.eur;
        // Optional: Enable the button only after rates are loaded
        const btn = document.getElementById("convertBtn");
        if(btn) btn.disabled = false;
    } catch (err) {
        console.error("Failed to load rates:", err);
    }
}

function convertCurrency() {
    const amountInput = document.getElementById("amount").value;
    const amount = parseFloat(amountInput);
    const from = document.getElementById("fromCurrency").value;
    const to = document.getElementById("toCurrency").value;

    if (!amountInput || isNaN(amount)) {
        alert("Please enter a valid number");
        return;
    }

    // Conversion Logic: (Amount / FromRate) * ToRate
    // Since rates are relative to 1 EUR
    let amountInEUR = (from === "eur") ? amount : amount / rates[from];
    let finalAmount = amountInEUR * rates[to];

    document.getElementById("result").innerText =
        `Result: ${amount.toLocaleString()} ${from.toUpperCase()} = ${finalAmount.toFixed(2)} ${to.toUpperCase()}`;
}

// Initialize
loadCurrencies();
loadRates();