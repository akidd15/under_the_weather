var apiKey = "1b18ce13c84e21faafb19c931bb29331";
var savedSearches = [];

var searchHistory = function(cityName) {
    $('.past-search:contains("' + cityName + "").remove();

    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");
    searchEntryContainer.append(searchEntryContainer);

    if (savedSearches.length > 0){
        var previousSavedSearches = localStorage.getItem("savedSearches")
        savedSearches = JSON.parse(previousSavedSearches);
    }

    savedSearches.push(cityName);
    localStorage.getItem("savedSearches", JSON.stringify(savedSearches));
    $("#search-input").val("");
};

var loadSearchHistory = function() {
    var savedSearchHistory = localStorage.getItem("saveSearches");
    if (!savedSearchHistory) {
        return false;
    }
    savedSearchHistory = JSON.parse(savedSearchHistory);
    
    for (var i = 0; i < savedSearchHistory.length; i++) {
        searchHistoryList(savedSearchHistory[i]);

    }
};

var currentWeather = function(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}')
    .then(function(response) {
        return response.json();
    })
    .then(function(response){
        var cityLongitude = response.coord.lon;
        var cityLattitude = response.coord.lat;
        fetch('https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}')
        .then(fuction(response) {
            return response.json();
        })
        .then(function(response) {
            searchHistoryList(cityname);

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
            

        })
    })
}