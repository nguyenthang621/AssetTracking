import math

import json
from shapely.geometry import Point, shape

# Detect inside circle
def haversine(lat1, lon1, lat2, lon2, R):  
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance


def is_point_in_circle(lat_point, lon_point, lat_center, lon_center, radius, R):
    R = 6371
    distance = haversine(lat_point, lon_point, lat_center, lon_center, R)
    return distance <= radius



# Detect inside polygon
def is_point_in_polygon(point, polygon):
    x, y = point
    n = len(polygon)
    inside = False

    p1x, p1y = polygon[0]
    for i in range(n + 1):
        p2x, p2y = polygon[i % n]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xints = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xints:
                        inside = not inside
        p1x, p1y = p2x, p2y

    return inside

    
# Detect inside rectangle
def is_point_in_rectangle(point, top_left, bottom_right):
    x, y = point
    x_min, y_max = top_left
    x_max, y_min = bottom_right
    return x_min <= x <= x_max and y_min <= y <= y_max



from shapely.geometry import Point, shape, MultiPolygon
# check point inside shade
def find_location(coordinate):
    provinces_file ='dataGeo/vn.json'
    districts_file ='dataGeo/diaphanhuyenv2.geojson'
    with open(provinces_file, 'r', encoding='utf-8') as file:
        provinces_data = json.load(file)


    with open(districts_file, 'r', encoding='utf-8') as file:
        districts_data = json.load(file)

    point = Point(coordinate)

    province_name = None
    for feature in provinces_data['features']:
        # Tạo Polygon từ dữ liệu GeoJSON
        province_polygon = shape(feature['geometry'])
        if province_polygon.contains(point):
            province_name = feature['properties']['name']
            break

    if not province_name:
        return None

    district_name = None
    if province_name in districts_data:
        for feature in districts_data[province_name]:
            district_polygon = shape(feature['geometry'])
            if district_polygon.contains(point):
                district_name = feature['properties']['Ten_Huyen']
                break

    if not district_name:
        return f"{province_name}"

    return f"{district_name}, {province_name}"

# DONE lat=20.828872, lng=106.779795
# coordinate:  [106.778825, 20.829532]
# DONE lat=20.829532, lng=106.778825
# coordinate:  [106.778157, 20.82998]
# DONE lat=20.82998, lng=106.778157
# coordinate:  [106.777972, 20.830111]
# DONE lat=20.830111, lng=106.777972
# coordinate:  [106.777393, 20.830519]
 
coordinate = (105.777393, 20.830519)  
print(find_location(coordinate))
