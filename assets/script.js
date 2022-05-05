// DOM Element Variables
const searchBtn = document.querySelector("#search-btn");
const formPark = document.querySelector("#search-park");
const formHotels = document.querySelector("#formHotels");
const formActivities = document.querySelector("#formActivities");
const formRestaurants = document.querySelector("#formRestaurants");
const resultsContainer = document.querySelector("#results");
const hotelContainer = document.querySelector("#hotel-results");
const activityContainer = document.querySelector("#activity-results");
const restaurantContainer = document.querySelector("#restaurant-results");
const autoCompleteList = document.querySelector("#Nationalparks");

//Full names of all National Parks in an array of strings-used for search and autocomplete on landing page. 
let parkNames = [];

//lists activities available at each National Park- an bject with park full name as a kkey and activities in an array
let activityOptions = {};

//raw data pulled from National Park Service API
let npsData = null;

//latitude and longitude of each park-used to locate amenities nearby. An object using the full park name as a key and the latitude and longitude in an array.
let parkLatLong = {};

//location of current national park
let latitude = null;
let longitude = null;


function getNPA() {
//checks if nps data is in local storage,retrieves nps data. If nps data not in local storage,  begins fetch request
    const npsDataString = localStorage.getItem("group-project-1");
    if (npsDataString == null) {
        npsData = [];
    }
    else {
        npsData = JSON.parse(npsDataString);
    };
    if (npsData.length == 0) {


        // fetch request for NPS data
        const requestUrl = 'https://developer.nps.gov/api/v1/parks?limit=466&api_key=HsEM5wqh1GU0weH7jjyZ7gVkuXfcuQkccqRFaGaz';
        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })

            //filter National Parks only
            .then(function (data) {
                let nationalParkNum = 0;
                let innerData = data.data;
                for (let i = 0; i < innerData.length; i++) {
                    const parkName = innerData[i].fullName.toLowerCase();
                    if (parkName.includes("national park")) {
                        npsData[nationalParkNum] = innerData[i];
                        nationalParkNum++;
                    }

                }
//Sends nps data to local storage
                console.log(npsData);
                localStorage.setItem("group-project-1", JSON.stringify(npsData));

                processNpsData();





            });


    } else { processNpsData() };

};

getNPA();

//uses npsData to create array of string of all national park names
//uses npsData to create list of activities
//uses npsData to create list of latitude and longitude for each park
function processNpsData() {
    for (let i = 0; i < npsData.length; i++) {
        const fullName = npsData[i].fullName
        parkNames.push(fullName);
        const activities = [];;
        for (let j = 0; j < npsData[i].activities.length; j++) {
            const activityName = npsData[i].activities[j].name;
            activities.push(activityName);
        }
        activityOptions[fullName] = activities;
        latitude = npsData[i].latitude;
        longitude = npsData[i].longitude;
        parkLatLong[fullName] = [latitude, longitude];

    }


    console.log(parkNames);
    console.log(activityOptions);
    console.log(parkLatLong);

}

function displayActivities(parkFullName) {
  let activitiesEl = document.createElement("h4");
  for (i = 0; i < activityOptions[parkFullName].length -1; i++) {
    activitiesEl.textContent += activityOptions[parkFullName][i] + ", ";
  };
  activitiesEl.textContent += activityOptions[parkFullName].pop(); //print last category with no comma
  activityContainer.append(activitiesEl);
};

//
// YELP, RESTAURANT AND/OR HOTEL SEARCH
//

// Unsecured key lol
const yelpAPIClientID = "2gz6fez22yED_zpA6BcHbQ";
const yelpAPIKey = "U7dTFKYQBF07SLpmXc-SJIrY3miWksIDuhlu1GP0bK7ZRmFw-T4MZCW8CjdLlVaZ5Vj2YptYNPVhOz7mwd6jxoZPVPrqB0fwXn031xBEO7IZxJZ26S0Z6-9XZU1tYnYx";

// Yelp fetch options
const yelpOptions = {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + yelpAPIKey, //input key
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    }
};

// Create empty array to which an object for each returned restaurant will be pushed
let hotelArray = [];
let foodArray = [];

function findAmenity(latitude, longitude, amenity) {
  // Create URL from latitude and longitude data from NPS API
  // amenity should be "restaurants" for food and "hotels,campgrounds,bedbreakfast" for hotels.
  // Search radius is currently hardcoded to 20000 meters
  // Must opt-in to https://cors-anywhere.herokuapp.com/corsdemo for functionality
  let amenityType;
  // Set search query term for amenity type
  if (amenity == "hotels") {
    amenityType = "hotels,campgrounds,bedbreakfast";
  } else if (amenity == "restaurants") {
    amenityType = "restaurants"
  };
  let yelpAPIURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?categories=" + amenityType + "&latitude=" + latitude + "&longitude=" + longitude + "&radius=20000&limit=5"
  fetch(yelpAPIURL, yelpOptions)
  .then(function(response) {
    if(response.ok) {
      return response.json();
    }
  })
  .then(function(data) {
    if (data) {
      for (let i = 0; i < data.businesses.length; i++) {
        // create array of restaurant category titles
        let amenityCat = [];
        for (let j = 0; j < data.businesses[i].categories.length; j++) {
          amenityCat.push(data.businesses[i].categories[j].title);
        };
        if (amenityType == "restaurants") { // push to empty restaurant array
          foodArray.push({
            "name": data.businesses[i].name,
            "image": data.businesses[i].image_url,
            "price": data.businesses[i].price,
            "distance": Math.round((data.businesses[i].distance/1609)*100)/100 + " miles", //converts to miles
            "rating": data.businesses[i].rating,
            "categories": amenityCat});
        } else { // push to empty hotel array
          hotelArray.push({
            "name": data.businesses[i].name,
            "image": data.businesses[i].image_url,
            "price": data.businesses[i].price,
            "distance": Math.round((data.businesses[i].distance/1609)*100)/100 + " miles",
            "rating": data.businesses[i].rating,
            "categories": amenityCat});
        }
      }
    }
  })
  .then(function() {
    if (amenity == "hotels") {
      displayAmenities(hotelArray, hotelContainer);
    } else if (amenity == "restaurants") {
      displayAmenities(foodArray, restaurantContainer);
    }
  })
};

function displayAmenities(array, container) {
  for (let i = 0; i < array.length; i++) {
    let nameEl = document.createElement("h3");
    nameEl.textContent = array[i].name;
    let imgEl = document.createElement("img");
    imgEl.setAttribute("src", array[i].image);
    imgEl.style.maxWidth = "300px";
    imgEl.textContent = array[i].image;
    let priceEl = document.createElement("p");
    priceEl.textContent = array[i].price;
    let distanceEl = document.createElement("p");
    distanceEl.textContent = array[i].distance;
    let ratingEl = document.createElement("p");
    ratingEl.textContent = array[i].rating;
    let catEl = document.createElement("p");
    for (let j = 0; j < array[i].categories.length - 1; j++) {  //print each category separated by commas
      catEl.textContent += array[i].categories[j] + ", ";
    };
    catEl.textContent += array[i].categories.pop(); //print last category with no comma
    container.append(nameEl);
    container.append(imgEl);
    container.append(priceEl);
    container.append(distanceEl);
    container.append(ratingEl);
    container.append(catEl);
  }
};

function whichAmenities(latitude, longitude, hotels, restaurants) {
// hotels and restaurants should be boolean
// the booleans will come from whether the boxes are checked on the form
  if (hotels) {
    findAmenity(latitude, longitude, "hotels");
  };
  if (restaurants) {
    findAmenity(latitude, longitude, "restaurants");
  };
};

// AUTOCOMPLETE DATA - PARK NAMES

//Create the autocomplete options
for (i = 0; i < parkNames.length; i++) {
  let opt = document.createElement("option");
  opt.setAttribute("value", parkNames[i]);
  autoCompleteList.append(opt);
};

// 
// FORM SUBMISSION EVENT HANDLING
// 

const searchHandler = function(event) {
  event.preventDefault();
  // Make container viewable
  resultsContainer.style.display = "block";
  // Remove any previous search results NOT CURRENTLY WORKING
  hotelContainer.innerHTML = ""
  activityContainer.innerHTML = ""
  restaurantContainer.innerHTML = ""
  // Retrieve park name from formPark.value
  let parkFullName;

  // Retrieve lat/long from formPark.value
  let lat = parkLatLong[formPark.value][0];
  let long = parkLatLong[formPark.value][1];
  whichAmenities(lat, long, formHotels.checked, formRestaurants.checked);
  if (formActivities.checked) {
    displayActivities(formPark.value);
  }
};

searchBtn.addEventListener("click", searchHandler);
