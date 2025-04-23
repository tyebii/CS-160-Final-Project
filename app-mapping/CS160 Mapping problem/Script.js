

// script for methods to setup, create, and route directions similar to google maps. WIll investigate to tweak the map to not be
// like google maps to have no changable initial spot, create blimp of starting location and a way for the user to process the POI
// to the address.
// token used to make the API methods work
mapboxgl.accessToken = 'pk.eyJ1IjoiYi1tb250eTk4IiwiYSI6ImNtOGdoZWp1dDBuMTIya292NWVxaDQzYW4ifQ.y1yYs-pnIi_E2HxopbzOVA';

// code starts making calls right here like MAIN: this is how GPS tracks your location
myCurrentLocation = navigator.geolocation.getCurrentPosition(successLocation, errorLocation,{enableHighAccuracy: true})
// end of function calls^^^^^^^


// takes the lat and long from the success location of position.coords.lat/lon
function successLocation(position){
setupMap([position.coords.longitude, position.coords.latitude])
}

// error handling but when cant find location, puts the start at the geolocation of SAN JOSE, CA (off wifi for example or no cellular)
function errorLocation(){
    setupMap([-122.04832192034138, 37.387197303519336])
}



// initializes the map for view in the server and first method called upon success location being reached. (takes an array of lat and lon form)
function setupMap(center) 
{
    // array storing the different values of the mao using the API defined syntax.
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: center,
        zoom: 13
    })



    // nav Bar for zooming in and out on the map and directions bundled into one( tried to d some things, just going to use the provided API MEthod syntax)
    const nav = new mapboxgl.NavigationControl()
    map.addControl(
        new MapboxDirections({
            accessToken: mapboxgl.accessToken
        }),
        'top-left'
    );

}




