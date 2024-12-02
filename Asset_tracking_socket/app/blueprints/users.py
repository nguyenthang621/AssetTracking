from app.databases.db import db
from app.models.Model import *
from flask import Blueprint, request, jsonify
from app.utils.https import ok, created, no_content, not_found
from app.services.Users import get_users, create_user, delete_user


users_blueprint = Blueprint('users_blueprint', __name__)


@users_blueprint.route('/users/<id>/', methods=['GET', 'PUT', 'DELETE'])
def user(id):
    user_exists = User.query.get(id)
    if user_exists is None:
        return not_found('user')

    if request.method == 'GET':
        return ok(user_exists)

    # if request.method == 'PUT':
    #     body = request.get_json()
    #     update_user(db, user_exists, body)
    #     return no_content()

    if request.method == 'DELETE':
        delete_user(db, user_exists)
        return no_content()


@users_blueprint.route('/users/', methods=['GET', 'POST'])
def users():
    try:
        if request.method == 'GET':
            users = get_users(request)
            return ok(users)

        if request.method == 'POST':
            data = request.get_json()
            if not data or not all(k in data for k in ("username", "mail", "password")):
                return jsonify({"error": "Missing data"}), 400
            if User.query.filter_by(username=data['username']).first() or User.query.filter_by(mail=data['mail']).first():
                return jsonify({"error": "User exist"}), 400
            username = data.get('username')
            password = data.get('password')
            date_joined = datetime.fromtimestamp(int(data.get('date_joined')))
            mail = data.get('mail')
            user = User(username=username, password=password, mail=mail, active= True, date_joined= date_joined)
            if 'assets' in data:
                assets = data.get('assets')
                
                assets_new = Asset.query.filter_by(name=assets["name"]).first()
                if not assets_new:
                    print(assets["name"])
                    assets_new = Asset(assets["name"], assets["description"], assets["status"])
                    db.session.add(assets_new)
                    db.session.commit()
                
                user.assets.append(assets_new)

            if not username or not password:
                return jsonify({"error": "Username and password are required"}), 400

            db.session.add(user)
            db.session.commit()

            return jsonify(user.to_json()), 201
    except Exception as e:
        print(e)
        return jsonify({"error: ": str(e)}), 500
