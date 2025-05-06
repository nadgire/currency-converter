import React from 'react'
import { useState } from 'react';

const App2 = () => {
    const rates = {
        AED: 4.15109,
        AFN: 80.81688,
        ALL: 97.585199,
        // Add more rates as needed
        USD: 1.130167,
        INR: 95.218659,
    };

    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('EUR');
    const [toCurrency, setToCurrency] = useState('USD');
    const [convertedAmount, setConvertedAmount] = useState(0);

    const handleConvert = () => {
        if (fromCurrency === 'EUR') {
            setConvertedAmount(amount * rates[toCurrency]);
        } else if (toCurrency === 'EUR') {
            setConvertedAmount(amount / rates[fromCurrency]);
        } else {
            const amountInEUR = amount / rates[fromCurrency];
            setConvertedAmount(amountInEUR * rates[toCurrency]);
        }
    };

    return (
        <div>
            <h1>Currency Converter</h1>
            <div>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                >
                    {Object.keys(rates).map((currency) => (
                        <option key={currency} value={currency}>
                            {currency}
                        </option>
                    ))}
                </select>
                <span>to</span>
                <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                >
                    {Object.keys(rates).map((currency) => (
                        <option key={currency} value={currency}>
                            {currency}
                        </option>
                    ))}
                </select>
                <button onClick={handleConvert}>Convert</button>
            </div>
            <h2>
                Converted Amount: {convertedAmount.toFixed(2)} {toCurrency}
            </h2>
        </div>
    );
}

export default App2
