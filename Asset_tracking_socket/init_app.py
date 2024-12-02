import os
from flask import Flask
from app.databases.db import db
from flask_cors import CORS
from dotenv import load_dotenv
from app.utils.errors import BadRequestException
from app.blueprints.users import users_blueprint
from app.utils.https import bad_request, not_found, not_allowed, internal_error
from flask_socketio import SocketIO, emit, join_room, leave_room

load_dotenv()  # load env files


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    app.url_map.strict_slashes = False
    db.init_app(app)
    CORS(app)
    socketio = SocketIO(app, cors_allowed_origins="*", max_packet_size=1024*1024, ping_timeout=30)

    app.register_blueprint(users_blueprint, url_prefix='/api/v1')

    @app.errorhandler(BadRequestException)
    def bad_request_exception(e):
        return bad_request(e)

    @app.errorhandler(404)
    def route_not_found(e):
        return not_found('route')

    @app.errorhandler(405)
    def method_not_allowed(e):
        return not_allowed()

    @app.errorhandler(Exception)
    def internal_server_error(e):
        return internal_error()

    return app


app = create_app()