import requests
from requests.structures import CaseInsensitiveDict
import time
import random

def send_post_request(coordinate):
    print("coordinate: ", coordinate)
    url = "http://localhost:5555/coordinates"
    lat = coordinate[1]
    lng = coordinate[0]
    data = {
        "tracker": {
            "trackerId": "T002"
        },
        "point": {
            "lat": lat,
            "lng": lng
        }
    }
    # Gửi yêu cầu POST
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print(f"DONE lat={lat}, lng={lng}")
        else:
            print(f"Error {response.status_code}")
    except Exception as e:
        print(f"error connection {e}")

    

# Simulator


coordinate_start = "21.026646, 105.776866"
coordinate_end = "20.963219, 105.744341"
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
    send_post_request(coordinate)
    # if count == 100:
    #     for i in range(random.randint(50, 70)):
    #         send_post_request(coordinate)
    #         time.sleep(1)
    #     count = 0
    
    time.sleep(1)









