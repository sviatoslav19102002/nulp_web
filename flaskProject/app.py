__version__ = '0.1.0'

from flask import Flask
import flask
from flask_httpauth import HTTPBasicAuth
from flask import Flask, request, Response, jsonify
from flask_bcrypt import Bcrypt
import sys
from flask_cors import CORS

from Migrations.main import Session, User, Wallet, Transfer
from validation_check import UserSchema, WalletSchema, TransferSchema
from waitress import serve
from marshmallow import ValidationError

app = Flask(__name__)

CORS(app)
session = Session()
bcrypt = Bcrypt()
auth = HTTPBasicAuth()


# currentUser=[]
@auth.verify_password
def verify_password(username, password):
    try:
        user = session.query(User).filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return username
    except:
        return None


@app.route('/')
@auth.login_required
def myendpoint():
    status_code = flask.Response(status=200, response="Hello World 15")
    return status_code


@app.route('/api/v1/auth/login', methods=['POST'])
# @auth.login_required
def login():
    # Get data from request body
    data = request.get_json()
    # Check if user exists
    db_user = session.query(User).filter_by(username=data['username']).first()
    if not db_user:
        return Response(status=404, response='A user with provided username was not found.')

    user_data = {'first_name': db_user.first_name, 'second_name': db_user.second_name, 'username': db_user.username,
                 'email': db_user.email}
    return jsonify(user_data), 200


@app.route('/api/v1/auth/register', methods=['POST'])
def register():
    # Get data from request body
    data = request.get_json()
    # Validate input data
    try:
        UserSchema().load(data)
    except ValidationError as err:
        return jsonify(err.messages), 401
    # Check if user already exists
    exists = session.query(User.id).filter_by(username=data['username']).first()
    exists2 = session.query(User.id).filter_by(email=data['email']).first()
    if exists or exists2:
        return Response(status=400, response='User with such username or email already exists.')

    # Hash user's password
    hashed_password = bcrypt.generate_password_hash(data['password'])
    # Create new user
    new_user = User(first_name=data['first_name'], second_name=data['second_name'], username=data['username'],
                    password=hashed_password, email=data['email'])

    # Add new user to db
    session.add(new_user)
    session.commit()

    db_user = session.query(User).filter_by(username=data['username']).first()
    user_data = {'first_name': db_user.first_name, 'second_name': db_user.second_name, 'username': db_user.username,
                 'email': db_user.email}
    return jsonify(user_data), 200


@app.route('/api/v1/user/get', methods=['GET'])
@auth.login_required
def get_user():
    # Check if user exists
    db_user = session.query(User).filter_by(username=auth.username()).first()
    if not db_user:
        return Response(status=404, response='A user with provided username was not found.')

    # Return user data
    user_data = {'id': db_user.id, 'first_name': db_user.first_name, 'second_name': db_user.second_name,
                 'username': db_user.username, 'email': db_user.email}
    return jsonify(user_data), 200


@app.route('/api/v1/user/put', methods=['PUT'])
@auth.login_required
def update_user():
    # Get data from request body
    data = request.get_json()
    # Validate input data
    try:
        UserSchema().load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    # Check if user exists
    db_user = session.query(User).filter_by(username=auth.username()).first()
    if not db_user:
        return Response(status=404, response='A user with provided username was not found.')

    # Check if username or email is not taken if user tries to change it
    if 'username' in data.keys() and db_user.username != data['username']:
        exists = session.query(User.id).filter_by(username=data['username']).first()
        if exists:
            return Response(status=400, response='User with such username already exists.')
    if 'email' in data.keys() and db_user.email != data['email']:
        exists2 = session.query(User.id).filter_by(email=data['email']).first()
        if exists2:
            return Response(status=400, response='User with such email already exists.')
    # Change user data
    if 'first_name' in data.keys():
        db_user.first_name = data['first_name']
    if 'second_name' in data.keys():
        db_user.second_name = data['second_name']
    if 'password' in data.keys():
        hashed_password = bcrypt.generate_password_hash(data['password'])
        db_user.password = hashed_password
    if 'username' in data.keys():
        db_user.username = data['username']
    if 'email' in data.keys():
        db_user.email = data['email']

    # Save changes
    session.commit()

    # Return new user data
    user_data = {'id': db_user.id, 'first_name': db_user.first_name, 'second_name': db_user.second_name,
                 'username': db_user.username, 'email': db_user.email}
    return jsonify({"user": user_data})


@app.route('/api/v1/user/delete', methods=['DELETE'])
@auth.login_required
def delete_user():
    # Check if user exists
    db_user = session.query(User).filter_by(username=auth.username()).first()
    if not db_user:
        return Response(status=404, response='A user with provided username was not found.')

    # Delete user
    session.delete(db_user)
    session.commit()
    return Response(status=200)


@app.route('/api/v1/wallet', methods=['POST'])
@auth.login_required
def create_wallet():
    user = session.query(User).filter_by(username=auth.username()).first()
    wallet = session.query(Wallet).filter_by(owner_id=user.id).first()
    if wallet:
        return Response(status=400, response='The user already have the wallet.')
    new_wallet = Wallet(name='Currency wallet', amount=0, owner_id=user.id)

    # Add new wallet to db
    session.add(new_wallet)
    session.commit()
    db_wallet = session.query(Wallet).filter_by(owner_id=user.id).first()
    wallet_data = {'name': db_wallet.name, 'amount': db_wallet.amount, 'owner_id': db_wallet.owner_id}
    return jsonify(wallet_data), 200


@app.route('/api/v1/wallet', methods=['GET'])
@auth.login_required
def get_wallet():
    # Check if wallet exists
    user = session.query(User).filter_by(username=auth.username()).first()
    db_wallet = session.query(Wallet).filter_by(owner_id=user.id).first()
    if not db_wallet:
        return Response(status=404, response='There is no wallet for this user.')
    wallet_data = {'name': db_wallet.name, 'amount': db_wallet.amount, 'owner_id': db_wallet.owner_id}
    return jsonify(wallet_data)


@app.route('/api/v1/wallet', methods=['PUT'])
@auth.login_required
def update_wallet():
    data = request.get_json()
    user = session.query(User).filter_by(username=auth.username()).first()

    # Check if wallet exists
    db_wallet = session.query(Wallet).filter_by(owner_id=user.id).first()
    if not db_wallet:
        return Response(status=404, response='The user does not have wallet')

    # Check if name of wallet is not taken if user tries to change it
    if 'name' in data.keys() and db_wallet.name != data['name']:
        exists = session.query(Wallet.id).filter_by(name=data['name']).first()
        if exists:
            return Response(status=401, response='Wallet with such name already exists.')
    # Change wallet data
    if 'owner_id' in data.keys() and db_wallet.owner_id != data['owner_id']:
        exists2 = session.query(User.id).filter_by(id=data['owner_id']).first()
        if not exists2:
            return Response(status=400, response='There is not user with such ID.')
    if 'name' in data.keys():
        db_wallet.name = data['name']
    if 'amount' in data.keys():
        db_wallet.amount = int(data['amount']) + int(db_wallet.amount)
    if 'owner_id' in data.keys():
        db_wallet.owner_id = data['owner_id']

    # Save changes
    session.commit()

    wallet_data = {'name': db_wallet.name, 'amount': db_wallet.amount, 'owner_id': db_wallet.owner_id}
    return jsonify(wallet_data)


@app.route('/api/v1/wallet', methods=['DELETE'])
@auth.login_required
def delete_wallet():
    # Check if wallet exists
    user = session.query(User).filter_by(username=auth.username()).first()
    db_wallet = session.query(Wallet).filter_by(owner_id=user.id).first()
    print(user)
    print(db_wallet)
    if not db_wallet:
        return Response(status=404, response='A wallet with provided name was not found.')
    if not user:
        return Response(status=405, response='A wallet with provided name was not found.')

    # Delete wallet
    session.delete(db_wallet)
    session.commit()
    try:
        return jsonify('Wallet was deleted.'), 200
    except Exception:
        return Response(status=406, response='A wallet with provided name was not found.')


@app.route('/api/v1/transfer', methods=['POST'])
@auth.login_required
def create_transfer():
    data = request.get_json()

    user_from = session.query(User).filter_by(username=auth.username()).first()
    user_to = session.query(User).filter_by(email=data['email']).first()

    # Check if wallets exists
    wallet_from = session.query(Wallet).filter_by(owner_id=user_from.id).first()
    wallet_to = session.query(Wallet).filter_by(owner_id=user_to.id).first()
    if not wallet_from or not wallet_to:
        return Response(status=401, response='Wallet with such id does not exist.')

    if int(data['amount']) > int(wallet_from.amount):
        return Response(status=402, response='There is not necessary amount of money.')

    # Create new transfer
    transfer = Transfer(purpose=data['purpose'], amount=data['amount'], fr0m_id=wallet_from.id, to_id=wallet_to.id)

    # Add new transfer to db
    session.add(transfer)

    wallet_from.amount -= int(data['amount'])
    wallet_to.amount += int(data['amount'])

    session.commit()

    return Response(status=200)


@app.route('/api/v1/transfer', methods=['GET'])
@auth.login_required
def get_transfer():
    user = session.query(User).filter_by(username=auth.username()).first()
    wallet = session.query(Wallet).filter_by(owner_id=user.id).first()

    transfer = session.query(Transfer).filter((Transfer.fr0m_id == wallet.id) | (Transfer.to_id == wallet.id)).all()
    res_tr = []
    for tr in transfer:
        purpose = tr.purpose
        amount = tr.amount
        if(wallet.id == tr.fr0m_id):
            amount *= -1
        res = {'purpose': purpose, 'amount': amount}
        res_tr.append(res)

    return jsonify(res_tr), 200


serve(app, host='0.0.0.0', port=8080, threads=1)  # WAITRESS!