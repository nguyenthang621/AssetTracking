import requests
from requests.structures import CaseInsensitiveDict
import time
import random

def send_location_request(coordinate):

    access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50VHlwZSI6IkRSSVZFUiIsImlkIjoiMGYwN2NiOGItNWZmYS00NmY5LTk3ZTMtNDI0Zjg4Y2MwZjc1IiwiaWF0IjoxNzMyOTUzNjU2LCJleHAiOjE3MzU1NDU2NTZ9.CO2P7rxbTqYt9eBj6MRfL_2tW6k7BduEahu1KO3Se_4"
    headers = CaseInsensitiveDict()
    headers["Content-Type"] = "application/json"
    headers["Authorization"] = f"Bearer {access_token}"
    print("coordinate: ", coordinate)
    url = "http://localhost:6868/api/driver/location"
    lat = coordinate[1]
    lng = coordinate[0]
    data = {
        'long': float(lng),
        'lat': float(lat)
    }
    try:
        response = requests.patch(url, json=data, headers=headers)
        if response.status_code == 200:
            print(f"DONE lat={lat}, lng={lng}")
        else:
            print(f"Error {response.status_code}")
    except Exception as e:
        print(f"error connection {e}")

    

# Simulator


coordinate_start = "20.987530, 106.235749"
coordinate_end = "20.997787, 105.821015"
coordinate_start = [x.strip() for x in coordinate_start.split(',')]
coordinate_end = [x.strip() for x in coordinate_end.split(',')]

print(coordinate_start, coordinate_end)

url = f"https://api.geoapify.com/v1/routing?waypoints={coordinate_start[0]}%2C{coordinate_start[1]}%7C{coordinate_end[0]}%2C{coordinate_end[1]}&mode=drive&apiKey=a7c1bebba2d24b74a023b62a8a45ea5c"

headers = CaseInsensitiveDict()
headers["Content-Type"] = "application/json"

# data = '{"mode":"drive","agents":[{"start_location":[20.825918,106.805295],"end_location":[21.010598,105.791347],"pickup_capacity":4}'


resp = requests.get(url, headers=headers)

data_route_raw = resp.json().get("features")[0]["geometry"]["coordinates"][0]

count = 0
for coordinate in data_route_raw:
    count += 1
    send_location_request(coordinate)
    time.sleep(0.1)









