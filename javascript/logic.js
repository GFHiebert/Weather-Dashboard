var cityList = ["Austin", "Chicago", "New York City"];

$("#search-btn").on("click", function() {
    var text = $(this).prev().val();
    displayCityWeather(text);
    if(cityList.includes(text) == false) {
        cityList.push(text);
    }
    displayCityList();
})

$("body").on("click", ".city-btn", function() {
    displayCityWeather($(this).text());
})

function displayCityList() {
    var cityListEl = $("#city-list");
    $(cityListEl).empty();
    for(var i = 0; i < cityList.length; i++) {
        if(i == 0) {
            var cityEl = $("<div>").addClass("city-btn first-city").text(cityList[i])
            cityListEl.append(cityEl);
        } else if (i == cityList.length - 1) {
            var cityEl = $("<div>").addClass("city-btn last-city").text(cityList[i])
            cityListEl.append(cityEl);
        } else {
            var cityEl = $("<div>").addClass("city-btn").text(cityList[i])
            cityListEl.append(cityEl);
        }
    }
}

function displayCityWeather(city) {

    $("#city-date").text(city + " " + moment().format("(M/D/YYYY)"));
    var APIKey = "8f68f7e6c4703101e1aaf920b20aa3ff";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
        "q=" + city + "&appid=" + APIKey;
    var lat = "";
    var lon = "";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        lat = response.coord.lat;
        lon = response.coord.lon;

        console.log(queryURL);

        console.log(response);

        var tempF = Math.round((response.main.temp - 273.15) * 1.80 + 32);

        $("#temperature").text(tempF);
        $("#humidity").text(response.main.humidity);
        $("#wind-speed").text(response.wind.speed);

        queryURL = "http://api.openweathermap.org/data/2.5/uvi?&appid=" + APIKey + 
            "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var uvi = response.value;
            var uviEl = $("#uv-index");
            if(uvi < 3) {
                $(uviEl).attr("class", "low");
            } else if(uvi < 6) {
                $(uviEl).attr("class", "moderate");
            } else if(uvi < 8) {
                $(uviEl).attr("class", "high");
            } else if (uvi < 11) {
                $(uviEl).attr("class", "very-high");
                $(uviEl).addClass("very-high");
            } else {
                $(uviEl).attr("class", "extreme");
            }
            $("#uv-index").text(uvi);
        });

        queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + 
            "&lon=" + lon + "&exclude=minutely,current,hourly&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $("#5-day-forecast").empty();

            var forecastHeader = $("<div>").attr("id", "forecast-header").text("5-Day Forecast");
            $("#5-day-forecast").append(forecastHeader);

            for(var i = 0; i < 5; i++) {
                var fd = response.daily;
                var tempF = Math.round((fd[i].temp.max - 273.15) * 1.80 + 32);
                var fdfEl = $("<div>").addClass("future-day-forecast");
                var dateEl = $("<div>").addClass("fd-date").text("Date");
                var imageEl = $("<div>").addClass("fd-image").text("Image");
                var temperatureEl = $("<div>").addClass("fd-temperature").text("Temp: " + tempF + " F");
                var humidityEl = $("<div>").addClass("fd-humidity").text("Humidity: " + fd[i].humidity + "%");

                fdfEl.append(dateEl, imageEl, temperatureEl, humidityEl);
                $("#5-day-forecast").append(fdfEl);
            }
        });
    });
}

displayCityList();
displayCityWeather("Sacramento");