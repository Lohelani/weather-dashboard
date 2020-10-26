$(document).ready(function () {


    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    console.log(cities);


    var APIKey = "40789148e7c8876c91eb900fc3a6f9f6";
    //on reload push city names into array go to last item in array 
    $("#button-search").on('click', function () {
        var cityInput = $("#cityInput").val();
        $("#cityInput").val("");

        function saveCity(cityInput) {
            var cityItem = $("<button>").addClass("btn btn-outline-secondary").attr("id", "historyItem").text(cityInput);
            $("#cityList").prepend(cityItem);

        };


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



                var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

                $("#city").html(response.name + " (" + new Date().toLocaleDateString() + ")");
                $("#city").append(icon);
                $("#temp").text("Temperature: " + response.main.temp + " F");
                $("#humidity").text("Humidity: " + response.main.humidity + "%");
                $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");



                var lat = JSON.stringify(response.coord.lat);
                var lon = JSON.stringify(response.coord.lon);
                var URL2 =
                    "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=885e9149105e8901c9809ac018ce8658&q=" +
                    "&lat=" +
                    lat +
                    "&lon=" +
                    lon;

                $.ajax({
                    url: URL2,
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

                    })

                function forecast() {
                    var URL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=imperial&appid=" + APIKey
                    console.log(URL3);

                    $.ajax({
                        url: URL3,
                        method: "GET",
                    })

                        .then(function (response) {
                            $.parseJSON(response);
                            console.log(response);
                            var times = response.list;
                            var days = [];
                            console.log(response);
                            for (i = 0; i < times.length; i++) {
                                var timeList = times[i].dt_text;
                                if (timeList.includes('12:00:00')) {
                                    days.push(times[i])
                                }

                                console.log(days);
                            }

                            for (var i = 0; i < days.length; i++) {
                                var temp = days[i].main.temp;
                                var date = days[i].dt_txt.slice(0, 10);
                                var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png")
                                $("#frcstDate").text(date);
                                $("#frcstIcon").append(icon);
                                $("#frcstTemp").text("Temperature: " + response.main.temp + " F");
                            }
                        });

                }


            });


    });


})