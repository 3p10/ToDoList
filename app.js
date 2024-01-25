const express = require("express"); //Create a new Node app.
const https = require("https");
const bodyParser = require("body-parser"); //Package to allow me to look through the body of the post request and fetch the data
const date = require(__dirname + "/date.js");

const app = express(); //Initialize a new express app.

app.set("view engine", "ejs");  ///***set or use***/// //tells our app which is generated using Express to use EJS as its view engine.
//And the 'views' folder is where the view engine by default will go and look for the files I'm trying to render.

app.use(bodyParser.urlencoded({extended: true})); //App will use bodyParser and set the urlencoded to use the extended as true setting.
app.use(express.static("public"));

const currentDate = date();
const items = ["Exercise", "Cook"];
const workItems = [];

function getWeatherData(query, callback) {
  const apiKey = "3a8af637751d69a446df4337ddf593c6";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

  https.get(url, function (response) {
    console.log(response.statusCode);

    let data = "";

    response.on("data", function (chunk) { //sets up an event listener for the "data" event of the response object.
      // The "data" event is operated when data is received from the API.
      data += chunk;
    });

    response.on("end", function () { //function is used to convert the response data, which is typically in JSON format, into a JS object that can be easily accessed and manipulated.
      //parses the data variable, which contains the complete response data received from the API, into a JavaScript object.
      const weatherData = JSON.parse(data);
      callback(weatherData);
    });
    // waits for the complete response from the API by setting up an event listener for the "end" event.
    //Once all the data is received, it parses the response data into a JavaScript object and passes it to the provided callback function for further handling or presentation of the weather information.
  });
}


app.get("/", function (req, res) { //
  const query = "Milan";

  getWeatherData(query, function (weatherData) {

    res.render("list", {  //uses the view engine that we set up before, to render "list.ejs" file in views folder.
      listTitle: currentDate,  //pass in a Javascript object, a 'listTitle' variable which has the value "currentDate"
      newListItems: items,
      weatherData: {
        temperature: weatherData.main.temp,
        iconURL: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
      }
    });
  });
});

app.post("/", function(req, res){ //to handle post requests that go to a particular route.
  //inside our callback we're going to grab the value of what's inside our text box.
  let item = req.body.newItem;  //It has told the app to use bodyParser, now it grabs the value of new item using this line

  if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
})

app.get("/work", function (req, res) {
  const query = "Milan";

  getWeatherData(query, function (weatherData) {
    res.render("list", {
      listTitle: "Work List",
      newListItems: workItems,
      weatherData: {
        temperature: weatherData.main.temp,
        currentDate: currentDate, // Pass currentDate as a property of weatherData
        iconURL: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
      }
      });
  });
});

app.post("/work", function(req, res){     //In ghesmat mitune hazf beshe bedune vared kardane moshkeli.
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});


app.listen(3000, function(){ //Listening on port 3000.
  console.log("Server is running on port 3000."); //My callback function, which is a console.log.
});
