/* script.js */
document.getElementById('search-btn').addEventListener('click', () => {
    const countryName = document.getElementById('country-input').value.trim();
    if (countryName) {
        fetchCountryData(countryName);
    } else {
        alert('Please enter a country name.');
    }
});

async function fetchCountryData(name) {
    const countryInfoSection = document.getElementById('country-info');
    const borderingCountriesSection = document.getElementById('bordering-countries');

    countryInfoSection.innerHTML = '';
    borderingCountriesSection.innerHTML = '';

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
        if (!response.ok) throw new Error('Country not found');

        const data = await response.json();
        const country = data[0];

        countryInfoSection.innerHTML = `
            <div class="country-card">
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
                <div>
                    <h2>${country.name.common}</h2>
                    <p><strong>Capital:</strong> ${country.capital}</p>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                </div>
            </div>
        `;

        if (country.borders && country.borders.length > 0) {
            const bordersResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(',')}`);
            const bordersData = await bordersResponse.json();

            borderingCountriesSection.innerHTML = '<h3>Bordering Countries:</h3>';
            bordersData.forEach(borderCountry => {
                borderingCountriesSection.innerHTML += `
                    <div class="border-card">
                        <img src="${borderCountry.flags.svg}" alt="Flag of ${borderCountry.name.common}">
                        <p>${borderCountry.name.common}</p>
                    </div>
                `;
            });
        } else {
            borderingCountriesSection.innerHTML = '<p>No bordering countries.</p>';
        }
    } catch (error) {
        countryInfoSection.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}