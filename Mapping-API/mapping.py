import requests

MapBox_API_Token = "sk.eyJ1IjoiYi1tb250eTk4IiwiYSI6ImNtOGdpM2I0dDAzM3Iya3BwOWo1ZGttOHIifQ.qoyFEBygEdSBo1CHbQiINg" # key quired from applying and creating account in Mapbox account
LOCATION = "-121.882,37.336"  # San Jose State University (lng, lat)
SEARCH_RADIUS = 10000  # Searching Radius in meters
CATEGORY = "poi"  # Can be 'restaurant', 'park', etc.

url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{CATEGORY}.json"
params = {
    "proximity": LOCATION, # parameters set and prestated by the MapBox API
    "radius": SEARCH_RADIUS,  # Not directly supported, but we will filter results later.
    "access_token": MapBox_API_Token, # token we get from the API
    "limit": 100  # Adjust limit nodes printed from the list
}

response = requests.get(url, params=params) #python method for making HTTP requests to an API response is now the server response or data the server shoots back to the user
print("here is the response from the server \n\n") # 200 means the request was successful with no errors 400 means errors, etc depends on the API for what they mean.
print(response)



data = response.json() # returns a dictionary of the response of the requests .get with the parameters provided.

print(f"here is the raw data as text: \n\n\n")
print(response.text + "\n\n\n") # here is just the raw data printed in however form the server decided to send it back the data in (in this case it is Javascript Notation or JSON)

print("here is the data organized in a dictionary: \n\n\n\n")
print(response.json()) # what the dictionary conversion of the data that is in JavaScript Notation looks like:
print("\n\n\n")

# Parse and print results in a easier to read fashion.
places = [] # create list of dictionary entries to interate through later. In python to store values in.
print("here is the dictionary comprehension to look more organized with the data: ")
for feature in data.get("features", []):
    places.append({
        "name": feature.get("text"),
        "address": feature.get("place_name"),
        "coordinates": feature.get("geometry").get("coordinates") # jumps in geometry and then gets value at coordinate's key ( double jump into the sub dictionary of a sub dictionary)
    })

# Output the example Dataset:
for place in places: #allows us to look at each dictionary element in the list
    print(place)
    print("\n")
