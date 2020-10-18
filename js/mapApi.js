// Current Location Map ( Google MAP API )

// Decalre variables
let map, infoWindow;

// Map function Start
function currentMap() {
  //Map class - Map(mapDiv[, opts])
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 47.6062, lng: -122.3321 },
    zoom: 10,
    disableDefaultUI: true,
  });

  // InfoWindow class - InfoWindow([opts])
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {   // navigator.geolocation returns a object that gives Web content access to the location of the device. 
    navigator.geolocation.getCurrentPosition(   //.getCurrentPosition(success[, error[, [options]])
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        infoWindow.setPosition(pos); // Set latlng on the infoWindow
        infoWindow.setContent("You are here!");
        infoWindow.open(map); // Opens this InfoWindow on the given map
        map.setCenter(pos);   // Set latlng on the map
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Add Zoom Control on the map.
  initZoomControl(map);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function initZoomControl(map) {
  document.querySelector(".zoom-control-in").onclick = function () {
    map.setZoom(map.getZoom() + 1);
  };

  document.querySelector(".zoom-control-out").onclick = function () {
    map.setZoom(map.getZoom() - 1);
  };
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
    document.querySelector(".zoom-control")
  );
}


// Decalre variables
let infowindowResult = [];
let weatherObjectTest;
// Result Map with Markers function
function resultMap(latitude, longitude, locationsGoogleMap, locations, weatherObject) {
  const map = new google.maps.Map(document.getElementById("mapResult"), {
    zoom: 10,
    center: { lat: latitude, lng: longitude },
  });
  console.log("=========== Trails =============== ");
  console.log(locations);

  console.log("========= weatherObject ==========");
  console.log(weatherObject);

  console.log("======= All LatLng searched ======");
  console.log(locationsGoogleMap);
  // Create an array of alphabetical characters used to label the markers.
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // Add some markers to the map.
  // Note: The code uses the JavaScript Array.prototype.map() method to
  // create an array of markers based on a given "locationsGoogleMap" array.
  // The map() method here has nothing to do with the Google Maps API.
  // location is value / i is index of the array
  const markers = locationsGoogleMap.map((location, i) => {
    return new google.maps.Marker({
      position: location,
      label: labels[i % labels.length],
    });
  });
  console.log("markers : ");
  console.log(markers);
  
  for (let i = 0; i < markers.length; i++) {

    // Call Weather API for all location
    // I can't use it because It calls so many times, OpenWeather API block my API_KEY
    // queryWeather(locationsGoogleMap[i]["lat"], locationsGoogleMap[i]["lng"]).then(data => {
    //   weatherObjectTest = data;
    //   console.log("====== weatherObjectTest ======");
    //   console.log(weatherObjectTest);
    // });
   
    // Create Star icon
    let stars = "";
    let fullStar = '<i class="fas fa-star starStyle"></i>';
    let halfStar = '<i class="fas fa-star-half-alt starStyle"></i>';
    let emptyStar = '<i class="far fa-star starStyle"></i>';
    let starNum = parseFloat(locations.trails[i].stars);
    for (let j = 1; j < 6; j++) {
      if (starNum >= j) {
        stars += fullStar;
      } else if (starNum % 1 !== 0) {
        stars += halfStar;
        starNum = parseInt(starNum);
      } else {
        stars += emptyStar;
      }
    }

    //Simplify difficulty description - Proposed by Scott Nelson
    switch(locations.trails[i].difficulty){
      case "green":
        locations.trails[i].difficulty = "Easy";
        break;
      case "greenBlue":
        locations.trails[i].difficulty = "Easy - Intermediate";
        break;
      case "blue":
        locations.trails[i].difficulty = "Intermediate";
        break;
      case "blueBlack":
        locations.trails[i].difficulty = "Intermediate - Hard";
        break;
      case "black":
        locations.trails[i].difficulty = "Hard";
        break;
      case "dBlack":
        locations.trails[i].difficulty = "Very Hard";
        break;
    }

    // ContentString for infowindows
    let contentString =         
      '<img id="imgTrails" alt="No image" src = ' + locations.trails[i].imgSqSmall + ' >' +         
      '<h1 id="firstHeading" class="firstHeading">' + locations.trails[i].name + '</h1>' +
      '<p class ="description">Difficuly : ' + locations.trails[i].difficulty + '</p>' +
      '<p class ="description">Trail Rating : ' + stars + '</p>' +
      '<p class ="description">Trail Length: ' + locations.trails[i].length + ' miles</p>' +
      '<p class ="description">Location : ' + locations.trails[i].location + '</p>' +
      '<a href=' + locations.trails[i].url + 'class="info-link" target="_Blank">More Information</a>';  // idea by Scott
      
      // Weather API key calls exceeded
      //'<p class ="description Weather">Today : </p>' +
      //'<img id="weatherIcon" alt="No image" src = "http://openweathermap.org/img/w/' + weatherObject.current.weather[0].icon + '.png" >' +
      //'<p class ="description uvIndex">UV : ' + weatherObject.current.uvi + '</p>';     
      // '<p class ="description uvIndex">LatLng in weather: ' + weatherObject.lat +', ' + weatherObject.lon+ '</p>'+
      // '<p class ="description uvIndex">LatLng in trails: ' + locations.trails[i].latitude +', ' + locations.trails[i].longitude + '</p>';
    infowindowResult[i] = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 800,
      minWidth: 450,
    }); 

  // });
  }
  // setTimeout(() => {
  // Use addListener function for all markers
  for (let i = 0; i < markers.length; i++) {
    markers[i].addListener("click", () => {
      infowindowResult[i].open(map, markers[i]);
    });

  }

  // Add a marker clusterer to manage the markers.
  new MarkerClusterer(map, markers, {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  });
// }, 3000);


  // map.setCenter({"lat":latitude, "lng":longitude});
  // console.log("lat: " +latitude, "lng: " +longitude);
}
let saveArray = [];
let saveObjects = new Object();
function saveFunction() {
  
  // saveObjects["name"] = $("#firstHeading").val();
  // $(this).val();
  // console.log(window.document.getElementById('firstHeading'));
  console.log(window.document.getElementById('firstHeading').textContent);
  saveObjects["name"] = window.document.getElementById('firstHeading').textContent;
  saveArray.push(saveObjects);
  localStorage.setItem("userSave", JSON.stringify(saveArray));
}

$("#displayUserSave").on("click", function(){
  // for (let i = 0; localStorage.length; i++){
    let divEl = $("<div>");
    divEl.text(localStorage.getItem("userSave"));
    // divEl.text("test");
    $(".resultPage").append(divEl);
  // }
});

 
  // $(".gm-style-iw").on("click", ".gm-style-iw-d", "#saveBtn", function(e){
  //   e.preventDefault();
  //   console.log("test");
  // });
