import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import loadingImage from './assets/loading.gif';

function App() {
  const currentYear = new Date().getFullYear();
  const [conversionData, setConversionData] = useState(null);
  const [value, setValue] = useState('1'); // Store as string to control input
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const currencySymbols = [
    { key: 'USD', symbol: '$' },
    { key: 'GBP', symbol: '£' },
    { key: 'INR', symbol: '₹' },
    { key: 'AUD', symbol: 'A$' },
    { key: 'CAD', symbol: 'C$' },
    { key: 'JPY', symbol: '¥' },
    { key: 'CNY', symbol: '¥' },
    { key: 'CHF', symbol: 'CHF' },
  ];

  const handleAmountChange = (e) => {
    const inputValue = e.target.value;
    // Remove leading zeros and ensure valid number
    const parsedValue = inputValue.replace(/^0+/, '') || '0';
    setValue(parsedValue);
  };

  const handleCurrencyChange = (e) => {
    if (e.target.id === 'currency-convert-from-select') {
      setFromCurrency(e.target.value);
    } else if (e.target.id === 'currency-convert-to-select') {
      setToCurrency(e.target.value);
    }
  };

  const getConversionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY || 'f2164116a9b2aaebc1bcf977';
      const result = await axios.get(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
      );
      if (result.data.result === 'success') {
        setConversionData(result.data.conversion_rates);
        setFromCurrency('USD');
        setToCurrency('INR');
      } else {
        setError('Failed to fetch conversion data.');
      }
    } catch (error) {
      setError('Error fetching conversion data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConversionData();
  }, []);

  // Calculate the converted amount for the "To" currency
  const convertedAmount = conversionData
    ? (parseFloat(value || 0) / conversionData[fromCurrency] * conversionData[toCurrency]).toFixed(2)
    : '0.00';

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen from-gray-900 to-gray-600 bg-gradient-to-r">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-white mb-4">Currency Converter</h1>
          <p className="text-lg text-white">Convert currencies easily and quickly!</p>
          <p className="text-lg text-red-600 mb-4">(Conversion rates refreshes once in 24hrs. Live rates may vary.)</p>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {
            loading && (<>
              <img src={loadingImage} alt="" className='w-14 h-14 mb-4' />
            </>)
          }

          <div className="flex gap-2 items-center">
            <span className="text-white w-10 text-right">From</span>
            <select
              className="p-2 mb-2 border border-gray-300 rounded bg-white"
              id="currency-convert-from-select"
              name="currency-convert-from-select"
              value={fromCurrency}
              onChange={handleCurrencyChange}
              disabled={loading || !conversionData}
            >
              <option value="" disabled>
                Select Currency
              </option>
              {conversionData &&
                Object.keys(conversionData).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
            </select>

            <input
              type="text" // Use text to better control input
              placeholder="Amount"
              className="p-2 mb-2 border border-gray-300 rounded bg-gray-800 text-white"
              value={value}
              onChange={handleAmountChange}
              disabled={loading || !conversionData}
              pattern="[0-9]*" // Restrict to numeric input
            />
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-white w-10 text-right">To</span>
            <select
              id="currency-convert-to-select"
              name="currency-convert-to-select"
              className="p-2 mb-2 border border-gray-300 rounded bg-white"
              value={toCurrency}
              onChange={handleCurrencyChange}
              disabled={loading || !conversionData}
            >
              <option value="" disabled>
                Select Currency
              </option>
              {conversionData &&
                Object.keys(conversionData).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
            </select>

            <input
              type="text"
              placeholder="Converted Amount"
              className="p-2 mb-2 border border-gray-300 rounded bg-gray-800 text-white"
              value={convertedAmount}
              readOnly
              disabled={loading || !conversionData}
            />
          </div>
        </div>

        <div className="my-10">
          {conversionData && !loading && (
            <div className="text-white">
              <h2 className="text-2xl mb-4">Popular Conversions</h2>
              <div className="grid grid-cols-4 gap-4">
                {currencySymbols.map((currency) => (
                  <div
                    key={currency.key}
                    className="bg-gray-800 p-4 rounded-lg shadow-md border-b w-48 h-36 flex flex-col items-center justify-center"
                  >
                    <h3 className="text-xl font-bold">{currency.key}</h3>
                    <p className="text-lg">
                      {currency.symbol}{' '}
                      {(parseFloat(value || 0) / conversionData[fromCurrency] * conversionData[currency.key]).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="text-center bg-black py-1 text-white">
        <p>© {currentYear} Currency Converter. All rights reserved.</p>
        <p>Made with ❤️ and 🧠 by <strong>Abhishek Nadgire</strong>.</p>
      </footer>
    </>
  );
}

export default App;