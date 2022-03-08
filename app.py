from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

import requests
from bs4 import BeautifulSoup

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.htt7q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db = client.dbsparta

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/favorite')
def favorite():
    return render_template('favorite.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route("/health", methods=["POST"])
def post():
    num_receive = request.form['num_give']
    # 여러개 찾기 - 예시 ( _id 값은 제외하고 출력)
    videos = list(db.youtube.find({'num':int(num_receive)}, {'_id': False}))
    return jsonify({'msg':'저장완료!','video':videos})

@app.route("/health", methods=["GET"])
def movie_get():
    movie_list = list(db.movies.find({}, {'_id': False}))
    return jsonify({'movies':movie_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)