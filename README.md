# 프로젝트명: 내 몸 처방전📑
여기저기 쑤셔대는 내 몸,, **부위별 운동**을 추천해주는 서비스는 없을까?

# 프로젝트 소개
![logo1](https://user-images.githubusercontent.com/97653052/157452558-22f41654-a3cc-4c21-a6ce-287c62d6219b.png)
- 신체 부위별 재활이나 운동 영상을 한 공간에서 찾아보고, 마음에 드는 영상을 저장하는 웹페이지
- 버튼 클릭을 통한 요청된 부위별 운동 조회 기능
- 조회된 영상에 좋아요 부여
- 마음에 드는 영상을 개인 페이지에 저장

# 제작기간 & 팀원
- 2022년 03월 07일 - 03월 10일, 총 작업기간 4일
- 강동현, 이춘, 장민우

# 웹사이트 링크


# 데모영상


# 와이어프레임
https://inky-crab-bf6.notion.site/Chapter-1-_B-13-7af5ad524c06402ebe4d607e7a94e927

# 개발 기능
| 기능                 | Method | URL                   | Request                                                                                    | Response                                                                                                                            |
| -------------------- | ------ | --------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| 메인화면 페이지 로드 | GET    | /                     | {'keyWord':keyWord}                                                                        | render_template('index.html',keyWord=keyWord)                                                                                       |
| 로그인 페이지 로드   | GET    | /login                | msg                                                                                        | render_template('login.html', msg=msg)                                                                                              |
| 회원가입 페이지 로드 | GET    | /signup               |                                                                                            | render_template('signup.html')                                                                                                        |
| 마이 페이지 로드     | GET    | /favorite             |                                                                                            | Token 인증시 - render_template('favorite.html'), Token 미인증시 - render_template('login.html'){msg="로그인 정보가 존재하지 않습니다."}                       |
| ID 중복검사          | POST   | /sign_up/check_dup    | {'id': user_id}                                                                            | 중복 아닐시 - {'msg': "사용 가능한 아이디 입니다."} 중복 시 - {'msg': "이미 존재하는 아이디 입니다."}                               |
| 회원가입             | POST   | /signup               | {'id': user_id, 'pw': password}                                                            | {'msg': '회원가입이 완료되었습니다.'}                                                                                               |
| 로그인               | POST   | /sign_in              | {'id': user_id, 'pw': password}                                                            | 로그인 성공 - {'result': 'success', 'token': token} 로그인 실패 - {'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'} |
| 부위별 동영상 조회   | GET    | /index/<keyword>      |                                                                                            | Token 인증시 - render_template('board_list.html'), Token 미인증시 - {msg="로그인 정보가 존재하지 않습니다."}                        |
| mypage 동영상 조회   | GET    | /favorite/<keyword>     |                                                                                            | Token 인증시 - render_template('favorite.html',word=keyword, results= video_list), Token 미인증시 - {msg="로그인 정보가 존재하지 않습니다."}                      |
| 좋아요               | POST   | /update_like    | {"result": "success", 'msg': msg, "count": count}|                                                                                                            |
| 즐겨찾기             | POST   | /update_like    | {"result": "success", 'msg': msg, "count": count}             | {msg="즐겨찾기 추가!."/즐겨찾기 삭제!}                                                                                                             |
 


# 기술스택
- Flask
- MongoDB
- Bootstrap
- Bulma
- AWS EC2
