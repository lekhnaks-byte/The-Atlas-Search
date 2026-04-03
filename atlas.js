const searchBtn = document.getElementById("Btn");
const countryInput = document.getElementById("countryInput");
const resultCard = document.getElementById("resultCard");
const msg = document.getElementById("msg");

const suggestionBox = document.createElement("div");
suggestionBox.id = "suggestionBox";
suggestionBox.className = "bg-white max-h-[250px] overflow-y-auto rounded-b-lg shadow-lg absolute top-full w-full z-50 hidden";
countryInput.parentElement.style.position = "relative";
countryInput.parentElement.appendChild(suggestionBox);

let availableCountries = [];

async function loadCountryNames() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
        const data = await response.json();
        availableCountries = data.map(country => country.name.common).sort();
    } catch (error) {
        console.error("Autocomplete load failed:", error);
    }
}
loadCountryNames();

countryInput.addEventListener("input", () => {
    let result = [];
    let input = countryInput.value;
    
    if (input.length) {
        result = availableCountries.filter((keyword) => {
            return keyword.toLowerCase().startsWith(input.toLowerCase());
        });
        displaySuggestions(result);
    } else {
        suggestionBox.classList.add("hidden");
    }
});

function displaySuggestions(result) {
    if (!result.length) {
        suggestionBox.classList.add("hidden");
        return;
    }

    const content = result.slice(0, 8).map((list) => {
        return `<li class="p-3 list-none border-b border-gray-100 cursor-pointer hover:bg-orange-100 text-gray-700 transition" 
                    onclick="selectInput('${list.replace(/'/g, "\\'")}')">${list}</li>`;
    });
    
    suggestionBox.innerHTML = `<ul class="p-0 m-0">${content.join('')}</ul>`;
    suggestionBox.classList.remove("hidden");
}

window.selectInput = function(countryName) {
    countryInput.value = countryName;
    suggestionBox.classList.add("hidden");
    getCountryData(); 
};

async function getCountryData() {
    const countryName = countryInput.value.trim();
    suggestionBox.classList.add("hidden");

    if (!countryName) {
        msg.innerText = "Please enter a country name!";
        resultCard.classList.add("hidden");
        return;
    }

    msg.innerText = "Searching...";
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
        "South Korea": { food: "Kimchi, Bibimbap, Bulgogi", cloth: "Hanbok" },
        "Thailand": { food: "Pad Thai, Green Curry, Tom Yum", cloth: "Chut Thai" },
        "Turkey": { food: "Kebab, Baklava, Meze", cloth: "Kaftan, Şalvar" },
        "Brazil": { food: "Feijoada, Brigadeiro, Pão de queijo", cloth: "Carnival costume, Sundress" },
        "Russia": { food: "Borscht, Pelmeni, Blini", cloth: "Sarafan, Ushanka" }
    };

    const name = country.name.common;
    const culture = cultureData[name] || { food: "Local delicacies", cloth: "Traditional attire" };

    resultCard.innerHTML = `
        <img src="${country.flags.svg}" alt="Flag" class="w-40 mx-auto mb-4 border shadow-sm">
        <h2 class="text-3xl font-bold mb-2 text-orange-400">${country.name.common}</h2> 
        <div class="text-left space-y-3 mt-6 text-gray-700">
            <h3 class="font-bold border-b pb-1 text-orange-300">Country Portfolio</h3>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${country.region} / ${country.subregion}</p>
            <p><strong>Languages:</strong> ${languages}</p>
            <p><strong>Traditional Dishes:</strong> ${culture.food}</p>
            <p><strong>Traditional Clothing:</strong> ${culture.cloth}</p>
        </div>
    `;
}

searchBtn.addEventListener("click", getCountryData);

countryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getCountryData();
});


document.addEventListener("click", (e) => {
    if (e.target !== countryInput) {
        suggestionBox.classList.add("hidden");
    }
});