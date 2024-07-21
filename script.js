const btnConvert = document.querySelector(".btn-convert");
const inputAmount = document.querySelector(".input-amount");
const countryFrom = document.querySelector(".country-from-selection");
const countryTo = document.querySelector(".country-to-selection");
const convertedAmount = document.querySelector(
  ".converted-amount-display-section > p"
);
const listOfCountriesAPI =
  "https://restcountries.com/v3.1/all?fields=name,currencies,flags";

// fetch all countries
const fetchListOfCountries = (listOfCountriesAPI) => {
  fetch(listOfCountriesAPI)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Logging the fetched data
      const countries = data
        .map((country) => {
          if (country.currencies) {
            return {
              name: country.name.common,
              flag: country.flags.svg,
              currencies: Object.keys(country.currencies).map((code) => ({
                code: code,
                name: country.currencies?.[code]?.name,
                symbol: country.currencies?.[code]?.symbol,
              })),
            };
          } else {
            return null; // Return null for countries without currencies
          }
        })
        .filter((country) => country !== null); // Filter out countries without currencies

      console.log(countries); // Logging the processed country list
      populateCountries(countries);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

// add countries to select country list
const populateCountries = (countries) => {
  countries.forEach((country) => {
    if (country.currencies.length > 0) {
      const currencyCode = country.currencies[0].code;
      const currencyName = country.currencies[0].name;

      // Create and append country options to "from" list
      const countryFromOption = document.createElement("option");
      countryFromOption.innerHTML = `<img src="${country.flag}" alt="${country.name}" style="width: 20px; height: 15px; margin-right: 5px;"> ${currencyCode} - ${currencyName}`;
      countryFromOption.value = currencyCode;
      countryFrom.append(countryFromOption);

      // Create and append country options to "to" list
      const countryToOption = document.createElement("option");
      countryToOption.innerHTML = `<img src="${country.flag}" alt="${country.name}" style="width: 20px; height: 15px; margin-right: 5px;"> ${currencyCode} - ${currencyName}`;
      countryToOption.value = currencyCode;
      countryTo.append(countryToOption);
    }
  });
};

// fetch list of countries from API
fetchListOfCountries(listOfCountriesAPI);

// convert amount when button is clicked and display result or error message
const convertAmount = (amount, fromCurrency, toCurrency) => {
  const conversionURL = `https://v6.exchangerate-api.com/v6/456b4f9dc54b1189ea3efc4d/pair/${fromCurrency}/${toCurrency}`;
  fetch(conversionURL)
    .then((response) => response.json())
    .then((data) => {
      if (data.conversion_rate) {
        const convertedValue = amount * data.conversion_rate;
        //display converted amount
        convertedAmount.textContent = `${amount} ${fromCurrency} = ${convertedValue} ${toCurrency}`;
      } else {
        // display error
        convertedAmount.textContent = "Conversion failed. Please try again.";
      }
    })
    .catch((error) => {
      console.error("Error fetching conversion rate:", error);
      convertedAmount.textContent = "Error occurred during conversion.";
    });
};

// addEventListener to convert button
btnConvert.addEventListener("click", (event) => {
  event.preventDefault;
  const amount = inputAmount.value;
  const fromCurrency = countryFrom.value;
  const toCurrency = countryTo.value;

  // verify whether inputs are valid
  if (amount && fromCurrency && toCurrency) {
    convertAmount(amount, fromCurrency, toCurrency);
    convertedAmount.textContent = "Loading...";
  } else {
    convertedAmount.textContent =
      "Please enter a valid amount and select currencies.";
  }
});
