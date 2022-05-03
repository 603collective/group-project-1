let parkNames =[];
let activityOptions={};
let npsData = null;
function getNPA() {
    
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
                
                console.log(npsData);
                localStorage.setItem("group-project-1", JSON.stringify(npsData));
                 
                processNpsData();

                



            });


    } else {processNpsData()};
    
};

getNPA();

<<<<<<< HEAD

//
// YELP, RESTAURANT SEARCH
//

// Unsecured key lol
const yelpAPIClientID = "2gz6fez22yED_zpA6BcHbQ"
const yelpAPIKey = "U7dTFKYQBF07SLpmXc-SJIrY3miWksIDuhlu1GP0bK7ZRmFw-T4MZCW8CjdLlVaZ5Vj2YptYNPVhOz7mwd6jxoZPVPrqB0fwXn031xBEO7IZxJZ26S0Z6-9XZU1tYnYx"

// Fetch options
const yelpOptions = {
  method: "GET",
  headers: {
    "Authorization": "Bearer " + yelpAPIKey, //input key
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
    }
  };

function findFood(latitude, longitude) {
  // Create URL from latitude and longitude data from NPS API
  // Search radius is currently hardcoded to 20000 meters
  // Must opt-in to https://cors-anywhere.herokuapp.com/corsdemo for functionality
  let yelpAPIURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=" + latitude + "&longitude=" + longitude + "&radius=20000"
  fetch(yelpAPIURL, yelpOptions)
  .then(function(response) {
      if(response.ok) {
        return response.json();
      }
  })
  .then(function(data) {
    if (data) {
      // create empty array
      let foodArray = [];
      for (let i = 0; i < data.businesses.length; i++) {
        // create array of restaurant category titles
        let foodCat = [];
        for (let j = 0; j < data.businesses[i].categories.length; j++) {
          foodCat.push(data.businesses[i].categories[j].title);
        };
        foodArray.push({
            "name": data.businesses[i].name,
            "image": data.businesses[i].image_url,
            "price": data.businesses[i].price,
            "distance": Math.round((data.businesses[i].distance/1609)*100)/100 + " miles",
            "rating": data.businesses[i].rating,
            "categories": foodCat});
      }
    console.log(foodArray); // array of restaurant objects containing their name, stock image, price range, and distance in miles (from meters)
    // TO DO: execute a function that will display this data
    }
  })
};

// Test: lat/long from Acadia Natl Park
// findFood("44.409286", "-68.247501");
=======
function processNpsData(){
    for (let i=0; i < npsData.length; i++){
        const fullName= npsData[i].fullName
        parkNames.push(fullName);
        const activities=[];;
        for (let j= 0; j<npsData[i].activities.length;j++){
            const activityName=npsData[i].activities[j].name;
          activities.push(activityName);
        }
        
        activityOptions[fullName]=activities;
        
        
    }

console.log(parkNames);
console.log(activityOptions);

}
>>>>>>> f1083defc820bf6caedba17feab7f8e42e514292
