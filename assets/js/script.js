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