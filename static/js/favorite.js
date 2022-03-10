$(document).ready(function () {
    switch_btn(part_num)
});

//버튼 색 변화
function switch_btn(num){
    let btn_num = 'btn'+num
    // let $a_like = $(`#${btn_num}`)
    // console.log($a_like)
    // console.log(btn_num)
    let a= "human-btn "+btn_num
    if(document.getElementById(btn_num).className==a) {
        console.log(num)
        document.getElementById(btn_num).className = 'human-btn-click ' + btn_num
        for(let i=1; i<=9;i++){
            if(i !=num){
                let btn_num = 'btn'+i
                let a ='human-btn ' +'btn'+i
                document.getElementById(btn_num).className =a
            }
        }
        }else{
        document.getElementById(btn_num).className = 'human-btn '+btn_num
        $('#list').empty()
    }
}


// 좋아요, 즐겨찾기 버튼 클릭
function toggle_like_fa(video_id, type) {
    let $a_like = $(`#${video_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    console.log($i_like)

    // console.log($a_like)
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
                console.log("like")
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
                console.log("unlike")
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(response["count"])
            }
        })

    }
}


//즐겨찾기 삭제
function delete_favorite(video_id, type) {
    // console.log(video_id, type)
    let $a_like = $(`#${video_id} a[aria-label='favorite']`)
    let $i_like = $a_like.find("i")

    // console.log($i_like)
    $.ajax({
        type: "POST",
        url: "/update_like",
        data: {
            video_id_give: video_id,
            type_give: type,
            action_give: "unlike"
        },
        success: function (response) {
            // console.log("favorite")
            $i_like.addClass("fa-star-o").removeClass("fa-star")
            alert('영상 저장 취소 완료!')
        }
    })
    window.location.reload()
}


//로그아웃
function sign_out() {
    $.removeCookie('mytoken', {path: '/'});
    alert('로그아웃!')
    window.location.href = "/login"
}