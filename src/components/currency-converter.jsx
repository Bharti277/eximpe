import React, { useEffect, useState } from "react";
import CurrencyDropdown from "./dropdown";
import "./currency-converter.css";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [date, setDate] = useState("");

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todaysDate = `${year}-${month}-${day}`;

  const fetchCurrencies = async () => {
    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${
          import.meta.env.VITE_REACT_APP_API_KEY
        }/latest/USD`
      );
      const data = await res.json();
      setCurrencies(Object.keys(data.conversion_rates));
    } catch (error) {
      console.log("Error fetching", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const currencyConverterHandle = async () => {
    if (!amount) return;
    try {
      if (!date) {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${
            import.meta.env.VITE_REACT_APP_API_KEY
          }/pair/${fromCurrency}/${toCurrency}`
        );
        const data1 = await response.json();
        setConvertedAmount(
          (data1.conversion_rate * amount).toFixed(2) + " " + toCurrency
        );
      } else {
        // If date is present
        const [year, month, day] = date.split("-");
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${
            import.meta.env.VITE_REACT_APP_API_KEY
          }/history/${fromCurrency}/${year}/${month}/${day}`
        );
        const data = await res.json();

        if (data.conversion_rates && data.conversion_rates[toCurrency]) {
          setConvertedAmount(
            (data.conversion_rates[toCurrency] * amount).toFixed(2) +
              " " +
              toCurrency
          );
        } else {
          setConvertedAmount(
            "Conversion rate not available for selected date."
          );
        }
      }
    } catch (error) {
      console.log("Error fetching", error);
      setConvertedAmount("Error fetching conversion rate.");
    }
  };
  return (
    <div className="currency__converter">
      <h2 className="heading">Currency Converter App</h2>

      <div className="dropdown">
        <CurrencyDropdown
          currencies={currencies}
          title="From"
          currency={fromCurrency}
          setCurrency={setFromCurrency}
        />
        <CurrencyDropdown
          currencies={currencies}
          title="To"
          currency={toCurrency}
          setCurrency={setToCurrency}
        />
      </div>
      <div className="amount__container">
        <label htmlFor="amount">Amount:</label>
        <div className="convert__btn">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
          />
          <button className="btn" onClick={currencyConverterHandle}>
            Convert
          </button>
        </div>
      </div>
      <div className="date__addition">
        <label htmlFor="">Date</label>
        <div>
          <input
            type="date"
            min={"2004-01-01"}
            max={todaysDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <div className="converted__amount">
        <h3>Converted Amount: {convertedAmount}</h3>
      </div>
    </div>
  );
};

export default CurrencyConverter;
