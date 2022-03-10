from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from bson import ObjectId
from flask import session
import json
from bson import json_util

clients = MongoClient(
    'mongodb+srv://test:sparta@cluster0.htt7q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
dbs = clients.dbsparta

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'

client = MongoClient('mongodb+srv://test:sparta@cluster0.hr8wf.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta_plus_week4


#랜딩 페이지
@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        return render_template('index.html')
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


#로그인 페이지
@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)

#회원가입 페이지
@app.route('/signup')
def signup():
    return render_template('signup.html')

#마이페이지(즐겨찾기) 페이지
@app.route('/favorite')
def favorite():
    return render_template('favorite.html')




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
    return jsonify({'result': 'success'})


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
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})



# 부위별 영상 리스트
@app.route("/index", methods=["POST"])
def post():
    num_receive = request.form['num_give']
    token_receive = request.cookies.get('mytoken')
    # 여러개 찾기 - 예시 ( _id 값은 제외하고 출력)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY,algorithms=['HS256'])
        videos = list(dbs.youtube.find({'num': int(num_receive)}, {}))
        for video in videos:
            video["_id"] = str(video["_id"])
            video["count_heart"] = dbs.likes.count_documents({"video_id": video["_id"], "type": "heart"})
            video["heart_by_me"] = bool(dbs.likes.find_one({"video_id": video["_id"], "type": "heart", "username": payload['id']}))
            video["favorite_by_me"] = bool(dbs.likes.find_one({"video_id": video["_id"], "type": "favorite", "username": payload['id']}))
        return jsonify({'msg': '선택!', 'video': videos})
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
        else:
            dbs.likes.delete_one(doc)
        count = dbs.likes.count_documents({"video_id": video_id_receive, "type": type_receive})
        return jsonify({"result": "success", 'msg': 'updated', "count": count})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


# 즐겨찾기 영상 리스트
@app.route("/favorite/post", methods=["POST"])
def post_fa():
    token_receive = request.cookies.get('mytoken')
    # 여러개 찾기 - 예시 ( _id 값은 제외하고 출력)
    video_list =[]
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        videos = list(dbs.likes.find({"type": "favorite", "username": payload['id']}))
        for video in videos:
            ID = ObjectId(video['video_id'])
            myvideo = dbs.youtube.find_one({"_id":ID},{'_id':False})
            myvideo['video_id'] = video['video_id']
            myvideo["count_heart"] = dbs.likes.count_documents({"video_id": video["video_id"], "type": "heart"})
            myvideo["heart_by_me"] = bool(dbs.likes.find_one({"video_id": video["video_id"], "type": "heart", "username": payload['id']}))
            myvideo["favorite_by_me"] = bool(dbs.likes.find_one({"video_id": video["video_id"], "type": "favorite", "username": payload['id']}))
            print(myvideo["count_heart"],myvideo["heart_by_me"],myvideo["favorite_by_me"])
            video_list.append(myvideo)
        return jsonify({'msg': '선택!', 'video': video_list})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("favorite"))



#############################################

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
