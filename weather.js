$(document).ready(function () {

    var APIKey = "40789148e7c8876c91eb900fc3a6f9f6";
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    console.log(cities);

    for (var i = 0; i < cities.length; i++) {
        saveCity(cities[i])
    }
    if (cities.length > 0) {
        currentWeather(cities[cities.length - 1]);
    }


    $("#cityList").on("click", "li", function () {
        currentWeather($(this).text());
    })

    // Tutor helped with making a list i tried button
    function saveCity(text) {
        var li = $("<li>").addClass("list-group-item text-center list-group-item-action").text(text);
        $("#cityList").prepend(li)
    }

    $("#button-search").on('click', function () {
        var cityInput = $("#cityInput").val();
        $("#cityInput").val("");
        currentWeather(cityInput);
    });

    function currentWeather(cityInput) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + APIKey
        })
            .then(function (response) {
                if (cities.indexOf(cityInput) === -1) {
                    cities.push(cityInput);
                    localStorage.setItem("cities", JSON.stringify(cities));
                    saveCity(cityInput);
                }
                var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
                $("#city").html(response.name + " (" + new Date().toLocaleDateString() + ")");
                $("#city").append(icon);
                $("#temp").text("Temperature: " + response.main.temp + " F");
                $("#humidity").text("Humidity: " + response.main.humidity + "%");
                $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");
                getUVIndex(response.coord.lat, response.coord.lon);
                forecast(cityInput);

            });
    };

    function getUVIndex(lat, lon) {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=885e9149105e8901c9809ac018ce8658&q=" +
                "&lat=" +
                lat +
                "&lon=" +
                lon,
            method: "GET"
        })

            .then(function (response) {
                console.log(response);
                var uvIndex = response[0].value;
                $("#uv").text("UV Index: " + uvIndex);


                if (uvIndex <= 2) {
                    $("#uv").attr("style", "background-color: green;");
                }
                else if (uvIndex > 2 && uvIndex <= 5) {
                    $("#uv").attr("style", "background-color: yellow;");
                }
                else if (uvIndex > 5 && uvIndex <= 7) {
                    $("#uv").attr("style", "background-color: orange;");
                }
                else {
                    $("#uv").attr("style", "background-color: red;");
                }

            });
    };

    function forecast(cityInput) {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=imperial&appid=" + APIKey,
            method: "GET",
        })
            .then(function (response) {

                console.log(response.list)
                //tutor helped here with .html so five day did not repeat itself
                $("#fiveDay").html("<h4>Five Day Forecast</h4>").append("<div class=\"row d-flex\">");
                for (var i = 0; i < response.list.length; i++) {

                    if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                        var col = $("<div>").addClass("col-md-2 p-1");
                        var card = $("<div>").addClass("card bg-primary text-white");
                        var body = $("<div>").addClass("card-body p-1");
                        var title = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString());
                        console.log(title);
                        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                        var t = $("<p>").addClass("card-text").text("Temp: " + response.list[i].main.temp_max);
                        var h = $("<p>").addClass("card-text").text("Humidity: " + response.list[i].main.humidity);
                        console.log(h);
                        // append together
                        col.append(card.append(body.append(title, img, t, h)));
                        $("#fiveDay .row").append(col);


                    }

                }

            });
    }

});