$(document).ready(function () {
    switch_btn(part_num);
});

//좋아요
function toggle_like(video_id, type) {
    let $a_like = $(`#${video_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    if ($i_like.hasClass("fa-heart-o")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                video_id_give: video_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                $i_like.addClass("fa-heart").removeClass("fa-heart-o")
                $a_like.find("span.like-num").text(response["count"])
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                video_id_give: video_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(response["count"])
            }
        })

    }

}

//즐겨찾기
function toggle_favorite(video_id, type) {
    let $a_like = $(`#${video_id} a[aria-label='favorite']`)
    let $i_like = $a_like.find("i")
    console.log($i_like)
    if ($i_like.hasClass("fa-star-o")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                video_id_give: video_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                alert(response['msg'])
                $i_like.addClass("fa-star").removeClass("fa-star-o")
                $a_like.find("span.like-num").text(response["count"])
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                video_id_give: video_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                alert(response['msg'])
                $i_like.addClass("fa-star-o").removeClass("fa-star")
                $a_like.find("span.like-num").text(response["count"])
            }
        })
    }

}


// 버튼 색 변화
function switch_btn(num){   //num =누른 버튼의 번호
    let btn_num = 'btn'+num     // btn_num =누른 버튼의 id
    //human-btn btn() : 현재 눌려있지 않은 버튼
    //human-btn-click btn() : 현재 눌려있느 버튼
    let a= "human-btn "+btn_num   // a= human-btn btn()
    if(document.getElementById(btn_num).className==a) {     //현재 누른 버튼의 class가 human-btn btn과 같다면 (현재 누른 버튼이 눌려있지 않은 상태라면)
        console.log(num)
        document.getElementById(btn_num).className = 'human-btn-click ' + btn_num  //현재 누른 버튼의 class를 human-btn-click btn()으로 변경(누른상태로 변경)
        for(let i=1; i<=9;i++){  //9개의 버튼을 반복
            if(i !=num){       //현재 누른 버튼은 시행하지 않음
                let btn_num = 'btn'+i      // btn() : 1~9까지 현재 누른 버튼 번호 제외
                let a ='human-btn ' +'btn'+i  // human-btn btn() : 1~9까지 현재 누른 버튼 번호 제외
                document.getElementById(btn_num).className =a  //현재 누른 버튼을 제외하고 class를 human-btn btn()으로 변경
            }  //나머지 버튼을 안누른 상태로 바꾸는 함수
        }
        }else{
        document.getElementById(btn_num).className = 'human-btn '+btn_num
        $('#list').empty()
    }
}

// 로그아웃 기능
function sign_out() {
            $.removeCookie('mytoken', {path: '/'});
            alert('로그아웃!')
            window.location.href = "/login"
        }