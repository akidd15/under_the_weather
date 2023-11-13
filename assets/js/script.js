var apiKey = "1b18ce13c84e21faafb19c931bb29331";
var savedSearches = [];

var searchHistory = function(cityName) {
    $('.past-search:contains("' + cityName + "").remove();

    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");
    searchEntryContainer.append(searchHistoryEntry);

    $("#search-history-container").append(searchEntryContainer);

    if (savedSearches.length > 0) {
        var previousSavedSearches = localStorage.getItem("savedSearches")
        savedSearches = JSON.parse(previousSavedSearches);
    }

    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));
    $("#search-input").val("");
};

var loadSearchHistory = function() {
    var savedSearchHistory = localStorage.getItem("savedSearches");
    if (!savedSearchHistory) {
        return false;
    }
    savedSearchHistory = JSON.parse(savedSearchHistory);
    
    for (var i = 0; i < savedSearchHistory.length; i++) {
        displaySearchHistoryList(savedSearchHistory[i]);

    }
};

var displaySearchHistory = function(cityName) {
    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");
    searchEntryContainer.append(searchHistoryEntry);

    $("#search-history-container").append(searchEntryContainer);
};



var currentWeather = function(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        var cityLon = response.coord.lon;
        var cityLat = response.coord.lat;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
        
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            searchHistory(cityName);

            var currentWheatherContainer = $("#current-weather-container");
            currentWheatherContainer.addClass("current-weather-container");

            var currentTitle = $("#current-title");
            var currentDay = moment().format("M/D/YYYY");
            currentTitle.text(`${cityName} (${currentDay})`);
            var currentIcon = $("#current-weather-icon");
            currentIcon.addClass("current-weather-icon");
            var currentIconCode = response.current.weather[0].icon;
            currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);
            var currentTemperature = $("#current-temperature");
            currentTemperature.text("Temperature: " + response.current.temp + "\u00B0F");
            var currentHumidity = $("#current-humidity");
            currentHumidity.text("Humidity: " + response.current.humidity + "%");
            var currentWindSpeed = $("#current-wind-speed");
            currentWindSpeed.text("Wind Speed: " + response.current.wind_speed + "MPH");
            var currentUvIndex = $("#current-uv-index");
            currentUvIndex.text("UV Index: ");
            var currentNumber = $("#current-number");
            currentNumber.text(response.current.uvi);

            if (response.current.uvi <= 2) {
                currentNumber.addClass("low");
            } else if (response.current.uvi >= 3 && response.current.uvi <= 7) {
                currentNumber.addClass("medium");
            } else {
                currentNumber.addClass("high");
            }
        })
    })
    .catch(function(err) {
        $("#search-input").val("");
        alert("We could not find the city you search for. Try searching for a valid city")
    });

};

var fiveDayForecast = function(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        var cityLon = response.coord.lon;
        var cityLat = response.coord.lat;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response);

            var futureForecastTitle = $("#future-forecast-title");
            futureForecastTitle.text("5-Day Forecast:");

            for (var i = 1; i <= 5; i++) {
                var futureCard = $("#future-card");
                futureCard.addClass("future-card-details");

                var futureDate = $("#future-date-" + i);
                var date = moment().add(i, "d").format("M/D/YYYY");
                futureDate.text(date);

                var futureIcon = $("#future-icon-" + i);
                futureIcon.addClass("future-icon");
                var futureIconCode = response.daily[i].weather[0].icon;
                futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);
                var futureTemp = $("#future-temp-" +i);
                futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");
                var futureHumidity = $("#future-humidity-" + i);
                futureHumidity.text("Humidity: " + response.daily[i].humidity + "%");
            }
        })
    })
};

$("#search-form").on("submit", function(event) {
event.preventDefault();

var cityName = $("#search-input").val();
if (cityName === "" || cityName === null) {
    alert("Please enter name of a city.");
    event.preventDefault();
} else {
    currentWeather(cityName);
    fiveDayForecast(cityName);
}
});

$("#search-history-container").on("click", "p", function() {
    var previousCityName = $(this).text();
    currentWeather(previousCityName);
    fiveDayForecast(previousCityName);

    var previousCityClicked = $(this);
    previousCityClicked.remove();
});

$(document).ready(function() {
    loadSearchHistory();
});

