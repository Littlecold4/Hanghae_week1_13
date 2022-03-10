from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from datetime import datetime, timedelta
from bson import ObjectId

clients = MongoClient(
    'secret')
dbs = clients.dbsparta

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOADcd "] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SECRET'


# 랜딩 페이지
@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = dbs.users.find_one({"username": payload["id"]})
        return render_template('index.html', user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


# 로그인 페이지
@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)


# 회원가입 페이지
@app.route('/signup')
def signup():
    return render_template('signup.html')


# 마이페이지(즐겨찾기) 페이지
@app.route('/favorite')
def favorite():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = dbs.users.find_one({"username": payload["id"]})
        return render_template('favorite.html', user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


# 회원가입 아이디 중복확인
@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists = bool(dbs.users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists})


# 회원가입 회원정보 저장
@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    doc = {
        "username": username_receive,
        "password": password_hash
    }
    dbs.users.insert_one(doc)
    return jsonify({'result': 'success', 'msg': '회원가입이 완료되었습니다.'})


# 로그인
@app.route('/sign_in', methods=['POST'])
def sign_in():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    result = dbs.users.find_one({'username': username_receive, 'password': pw_hash})
    # 회원 정보 찾으면
    if result is not None:
        payload = {
            'id': username_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 30)  # 로그인 30분 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf-8')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


# 부위별 영상 리스트
@app.route('/<keyword>')
def home_menu(keyword):
    try:
        token_receive = request.cookies.get('mytoken')
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        videos = list(dbs.youtube.find({'num': int(keyword)}, {}))
        for video in videos:
            print('1')
            video["_id"] = str(video["_id"])
            video["count_heart"] = dbs.likes.count_documents({"video_id": video["_id"], "type": "heart"})
            if bool(dbs.likes.find_one({"video_id": video["_id"], "type": "heart", "username": payload['id']})) is True:
                video["heart_by_me"] = 'fa-heart'
            else:
                video["heart_by_me"] = 'fa-heart-o'
            if bool(dbs.likes.find_one(
                    {"video_id": video["_id"], "type": "favorite", "username": payload['id']})) is True:
                video["favorite_by_me"] = 'fa-star'
            else:
                video["favorite_by_me"] = 'fa-star-o'
        return render_template('index.html', word=keyword, results=videos)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


# 좋아요, 즐겨찾기
@app.route('/update_like', methods=['POST'])
def update_like():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = dbs.users.find_one({"username": payload["id"]})
        video_id_receive = request.form["video_id_give"]
        type_receive = request.form["type_give"]
        action_receive = request.form["action_give"]
        doc = {
            "video_id": video_id_receive,
            "username": user_info["username"],
            "type": type_receive
        }
        if action_receive == "like":
            dbs.likes.insert_one(doc)
            msg = "즐겨찾기 추가!"
        else:
            dbs.likes.delete_one(doc)
            msg = '즐겨찾기 삭제!'
        count = dbs.likes.count_documents({"video_id": video_id_receive, "type": type_receive})
        return jsonify({"result": "success", 'msg': msg, "count": count})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


# 즐겨찾기 영상 리스트
@app.route('/favorite/<keyword>')
def favorite_menu(keyword):
    token_receive = request.cookies.get('mytoken')
    # 여러개 찾기 - 예시 ( _id 값은 제외하고 출력)
    video_list = []
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        videos = list(dbs.likes.find({"type": "favorite", "username": payload['id']}))
        for video in videos:
            ID = ObjectId(video['video_id'])
            myvideo = dbs.youtube.find_one({"_id": ID}, {'_id': False})
            if myvideo['num'] == int(keyword):
                myvideo['video_id'] = video['video_id']
                myvideo["count_heart"] = dbs.likes.count_documents({"video_id": video["video_id"], "type": "heart"})
                if bool(dbs.likes.find_one(
                        {"video_id": myvideo["video_id"], "type": "heart", "username": payload['id']})) is True:
                    myvideo["heart_by_me"] = 'fa-heart'
                else:
                    myvideo["heart_by_me"] = 'fa-heart-o'
                myvideo["favorite_by_me"] = 'fa-star'
                video_list.append(myvideo)
        return render_template('favorite.html', word=keyword, results=video_list)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("favorite"))


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
