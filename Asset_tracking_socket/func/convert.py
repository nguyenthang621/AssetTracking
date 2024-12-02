#  convert tỉnh {[list huyện]}
import json
from unidecode import unidecode

# Đọc file JSON đầu vào
with open('dataGeo/diaphanhuyen.geojson', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Tạo đối tượng để lưu trữ dữ liệu lọc
result = {}

# Duyệt qua các features và nhóm theo Ten_Tinh
for feature in data['features']:
    ten_tinh = feature['properties']['Ten_Tinh']
    
    # Chuyển tên tỉnh thành không dấu
    ten_tinh_no_accent = unidecode(ten_tinh)

    # Nếu ten_tinh_no_accent chưa có trong result, khởi tạo danh sách
    if ten_tinh_no_accent not in result:
        result[ten_tinh_no_accent] = []

    # Thêm feature vào danh sách tương ứng với ten_tinh_no_accent
    result[ten_tinh_no_accent].append(feature)

# Ghi kết quả vào file JSON mới
with open('dataGeo/diaphanhuyenv2.geojson', 'w', encoding='utf-8') as file:
    json.dump(result, file, ensure_ascii=False, indent=2)

print('Done')

