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

function findAmenity(latitude, longitude, amenityType) {
    // Create URL from latitude and longitude data from NPS API
    // amenity should be "restaurants" for food and "hotels,campgrounds,bedbreakfast" for hotels.
    // Search radius is currently hardcoded to 20000 meters
    // Must opt-in to https://cors-anywhere.herokuapp.com/corsdemo for functionality
    let yelpAPIURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?categories=" + amenityType + "&latitude=" + latitude + "&longitude=" + longitude + "&radius=20000"
    fetch(yelpAPIURL, yelpOptions)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            if (data) {
                // create empty array to which an object for each returned restaurant will be pushed
                let amenityArray = [];
                for (let i = 0; i < data.businesses.length; i++) {
                    // create array of restaurant category titles
                    let amenityCat = [];
                    for (let j = 0; j < data.businesses[i].categories.length; j++) {
                        amenityCat.push(data.businesses[i].categories[j].title);
                    };
                    amenityArray.push({
                        "name": data.businesses[i].name,
                        "image": data.businesses[i].image_url,
                        "price": data.businesses[i].price,
                        "distance": Math.round((data.businesses[i].distance / 1609) * 100) / 100 + " miles",
                        "rating": data.businesses[i].rating,
                        "categories": amenityCat
                    });
                }
                console.log(amenityArray); // array of restaurant objects containing their name, stock image, price range, and distance in miles (from meters)
                // TO DO: execute a function that will display this data
            }
        })
};

function whichAmenities(latitude, longitude, hotels, restaurants) {
    // hotels and restaurants should be boolean
    if (hotels) {
        findAmenity(latitude, longitude, "hotels,campgrounds,bedbreakfast");
    }
    if (restaurants) {
        findAmenity(latitude, longitude, "restaurants");
    }
};