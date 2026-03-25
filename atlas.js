const searchBtn = document.getElementById("Btn");
const countryInput = document.getElementById("countryInput");
const resultCard = document.getElementById("resultCard");
const msg = document.getElementById("msg");

async function getCountryData() {
    const countryName = countryInput.value.trim();

    if (!countryName) {
        msg.innerText = "Please enter a country name!";
        resultCard.classList.add("hidden");
        return;
    }

    resultCard.classList.add("hidden");

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        
        if (!response.ok) throw new Error("Country not found!");

        const data = await response.json();
        const country = data[0];

        msg.innerText = "";
        displayCountry(country);

    } catch (error) {
        msg.innerText = error.message;
        resultCard.classList.add("hidden");
    }
}

searchBtn.addEventListener("click", getCountryData);

countryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getCountryData();
});

function displayCountry(country) {
    resultCard.classList.remove("hidden");

    const capital = country.capital ? country.capital[0] : "N/A";
    const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
    const population = country.population.toLocaleString();

    const cultureData = {
        "India": { food: "Biryani, Dosa, Paneer", cloth: "Sari, Kurta, Dhoti" },
        "Oman": { food: "Shuwa, Meshkak, Majboos", cloth: "Kandura, Abaya" },
        "Japan": { food: "Sushi, Ramen, Tempura", cloth: "Kimono, Yukata" },
        "France": { food: "Baguette, Ratatouille", cloth: "Breton Shirt, Beret" },
        "USA": { food: "Burgers, Apple Pie", cloth: "Blue Jeans, T-shirts" },
        "Germany": { food: "Sausage, Schnitzel, Pretzel", cloth: "Lederhosen, Dirndl" },
        "Korea": { food: "Kimchi, Bibimbap, Bulgogi", cloth: "Hanbok" },
        "Thailand": { food: "Pad Thai, Green Curry, Tom Yum", cloth: "Chut Thai" },
        "Turkey": { food: "Kebab, Baklava, Meze", cloth: "Kaftan, Şalvar" },
        "Brazil": { food: "Feijoada, Brigadeiro, Pão de queijo", cloth: "Carnival costume, Sundress" },
        "Russia": { food: "Borscht, Pelmeni, Blini", cloth: "Sarafan, Ushanka" },
        "Thailand": { food: "Shawarma, Machboos, Luqaimat", cloth: "Kandura, Abaya" }
    };

    const name = country.name.common;
    const culture = cultureData[name] || { food: "Local delicacies", cloth: "Traditional attire" };

    resultCard.innerHTML = `
        <img src="${country.flags.svg}" alt="Flag" class="w-40 mx-auto mb-4 border shadow-sm">
        <h2 class="text-3xl font-bold mb-2 text-orange-400">${country.name.common}</h2> <div class="text-left space-y-3 mt-6 text-gray-700">
            <h3 class="font-bold border-b pb-1 text-orange-300">Country Portfolio</h3>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${country.region} / ${country.subregion}</p>
            <p><strong>Languages:</strong> ${languages}</p>
            <p><strong>Traditional Dishes:</strong> ${culture.food}</p>
            <p><strong>Traditional Clothing:</strong> ${culture.cloth}</p>
    `;
}