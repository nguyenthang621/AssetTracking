from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
from func.detect_zone import is_point_in_polygon, find_location
from unidecode import unidecode

app = Flask(__name__)
CORS(app) 
socketio = SocketIO(app, cors_allowed_origins="*") 

test_zone = []

@app.route('/receiver_coordinates', methods=['POST'])
def coordinates():
    try:
        data = request.get_json()
        # print(f"Received data: {data}")
        point = data.get('point')
        lat = point.get('lat')
        lng = point.get('lng')
        tracker = data.get('tracker')
        room = "userId"  

        print(lng, lat)
       

        # Emit location update to clients in the specific room
        socketio.emit(
            'update_location_device', 
            data,
            # {isMove: true, point: {'lat': lat, 'lng': lng}, 'tracker': tracker}, 
            room=room
        )
        
        return jsonify({'message': 'Location received and broadcasted successfully'}), 200
    except Exception as e:
        print(f"Error api receiver_coordinates: {e}")
        return jsonify("Server Error"), 500
    

@app.route('/find_location', methods=['POST'])
def find_location_api():
    try:
        data = request.get_json()
      
        point = data.get('point')
        lat = point.get('lat')
        lng = point.get('lng')     
        coordinate = (lng, lat)  
        print(coordinate)
        location = unidecode(find_location(coordinate))
        print(f"{location=}")
        return jsonify(location), 200
    except Exception as e:
        print(f"Error api find_location: {e}")
        return jsonify("Server Error"), 500




# Handle event socket:

# Connect socket:
@socketio.on('connection')
def handle_message(message):
    print("Socket Connected >>>", message)


def get_room_member_count(room):
    return len(socketio.server.manager.rooms['/'][room])

# client join room:
@socketio.on("client_join_room")
def handle_client_join_room(data):
    room = data['room']
    socketio.emit('response_from_client', 'Joined')
    join_room(room)
    print(f"create room {room}")
    emit('message', f'User {room} has joined room {room}', room=room)


# client leave room:
@socketio.on("client_leave_room")
def handle_client_leave_room(data):
    room = data['room']
    socketio.emit('response_from_client', 'Leave')
    leave_room(room)
    print(f"left room {room}")


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
