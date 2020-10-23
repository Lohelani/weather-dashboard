$(document).ready(function () {
    var APIKey = "40789148e7c8876c91eb900fc3a6f9f6";

    function saveCity() {
        var city = $("#cityInput").val()
        var cities = JSON.parse(localStorage.getItem(city)) || [];
        console.log(city);
        console.log(cities);
    }
//on reload push city names into array go to last item in array 
    $("#button-search").on('click', function () {
        saveCity()
        var cityInput = $("#cityInput").val();
        console.log(cityInput);

        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + APIKey
        })

            .then(function (response) {
                var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

                console.log(icon);

                console.log(response);

                $("#city").html(response.name + " (" + new Date().toLocaleDateString() + ")");
                $("#city").append(icon);
                $("#temp").text("Temperature: " + response.main.temp + " F");
                $("#humidity").text("Humidity: " + response.main.humidity + "%");
                $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");

                var lat = JSON.stringify(response.coord.lat);
                var lon = JSON.stringify(response.coord.lon);
                var queryURL2 =
                    "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=885e9149105e8901c9809ac018ce8658&q=" +
                    "&lat=" +
                    lat +
                    "&lon=" +
                    lon;

                $.ajax({
                    url: queryURL2,
                    method: "GET"
                })

                    .then(function (response) {
                        console.log(response);
                        var uvIndex = response[0].value;
                        $("#uv").text("UV Index: " + uvIndex);


                        if (uvIndex <= 2) {
                            $("#uv").attr("style", "background-color: green");
                            console.log(uvIndex);
                        }
                        else if (uvIndex >= 3 || uvIndex <= 5) {
                            $("#uv").attr("style", "background-color: yellow;");
                        }
                        else if (uvIndex >= 6 || uvIndex <= 7) {
                            $("#uv").attr("style", "background-color: orange;");
                        }
                        else {
                            $("#uv").attr("style", "background-color: red;");
                        }



                    })

            });


        //     localStorage.setItem("highscores", JSON.stringify(highscores));
        //     var score = 0;

        //fnction getcurrent weather cal othe two funtions
        //function 5 day
        //get uv index
        ////response.coord.lat
        ////response.coord.lon



    });




})