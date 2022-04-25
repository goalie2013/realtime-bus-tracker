"use strict";

const vehiclesBtn = document.getElementById("findBus");
const facilitiesBtn = document.getElementById("facilities");
const stopsBtn = document.getElementById("stops");
const tripBtn = document.getElementById("trip");
let busLocationsArr;
let facilitiesArr;
let markerArr = [];

// TODO: DO NOT POST ON GITHUB
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2FiZ3JpbjkwIiwiYSI6ImNsMW1wazY5NzAzZ3gzZW1qcWxkODhiMnQifQ.HRNBb5F910DNg7HIsRyOrA";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/gabgrin90/cl1n20h1e000315l9cpu7zdh3",
  center: [-71.104081, 42.36555],
  zoom: 11,
});

// Request bus data from MBTA
async function getAllBusLocations() {
  const response = await fetch("https://api-v3.mbta.com/vehicles");
  const json = await response.json();
  return json.data;
}

// Get all bus locations for a specific bus route
async function getBusLocationsForRoute(busRouteId) {
  const response = await fetch(
    `https://api-v3.mbta.com/vehicles?filter[route]=${busRouteId}&include=trip`
  );
  const json = await response.json();
  return json.data;
}

async function getFacilities() {
  const response = await fetch("https://api-v3.mbta.com/facilities");
  const json = await response.json();
  return json.data;
}

// async function run() {
//   const locations = await getBusLocations();
//   console.log(new Date());
//   console.log(locations);

//   locations.forEach((location) => {
//     const lat = location["attributes"]["latitude"];
//     const lng = location["attributes"]["longitude"];
//     console.log(lat, lng);

//     const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
//   });

//setTimeout(run, 35000);
// }

async function runTwo(busRouteId) {
  // Clear markers on map
  if (markerArr.length > 0) {
    for (let i = 0; i < markerArr.length; i++) {
      markerArr[i].remove();
    }
  }
  console.log("markerArr size: ", markerArr.length);

  // Get all bus locations (lat,lng) for a specific bus route
  const busLocations = await getBusLocationsForRoute(busRouteId);
  busLocations.forEach((location) => {
    const lat = location["attributes"]["latitude"];
    const lng = location["attributes"]["longitude"];
    console.log(lat, lng);

    // Place a marker on the map at the bus location
    const marker = new mapboxgl.Marker({ color: "#008AB8" })
      .setLngLat([lng, lat])
      .addTo(map);
    markerArr.push(marker);
  });
}

map.on("load", async () => {
  busLocationsArr = await getAllBusLocations();
  facilitiesArr = await getFacilities();
});

vehiclesBtn.addEventListener("click", (e) => {
  const dynamicList = document.getElementById("invisList");

  // Clear 2nd Button if exists
  while (dynamicList.firstChild) {
    dynamicList.removeChild(dynamicList.firstChild);
  }

  // Update Button Text
  document.getElementById("firstBtn").textContent = "Find Bus";

  // Dynamically create 2nd button w/ dropdown list
  const newSet = new Set();
  const btn = document.createElement("button");
  btn.className = "btn btn-secondary dropdown-toggle";
  btn.setAttribute("type", "button");
  btn.setAttribute("data-bs-toggle", "dropdown");
  btn.setAttribute("aria-expanded", "false");
  btn.textContent = "Please Select One";
  document.getElementById("invisList").appendChild(btn);

  const ul = document.createElement("ul");
  ul.classList.add("dropdown-menu");

  // For each bus location, get bus route ID and add to Set
  // (Set instead of Array to avoid duplicates)
  busLocationsArr.forEach((location) => {
    const locId = location["relationships"]["route"]["data"]["id"];
    newSet.add(locId);
  });

  // Create the dropdown list for 2nd button by iterating through bus route IDs
  newSet.forEach((busRouteId) => {
    const listEl = document.createElement("li");
    const a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.textContent = `${busRouteId}`;
    listEl.appendChild(a);

    // Add Event Listener to each list item
    listEl.addEventListener("click", async function () {
      runTwo(busRouteId);
    });

    ul.appendChild(listEl);
  });

  //   console.log(ul);
  document.getElementById("invisList").appendChild(ul);
  //   console.log(document.getElementById("xx"));
});
