import React from "react";
import "./dropdown.css";

const CurrencyDropdown = ({
  currencies,
  currency,
  setCurrency,
  title = "",
}) => {
  return (
    <div className="dropdown__container">
      <label htmlFor={title}>{title}:</label>
      <div className="currency__target">
        <select
          className="currency__select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {currencies?.map((currency) => {
            return (
              <option value={currency} key={currency}>
                {currency}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default CurrencyDropdown;
