
$(document).ready(function () {
    switch_btn(part_num);
});


function toggle_like(video_id, type) {
    let $a_like = $(`#${video_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")

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
                // console.log("like")
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
                // console.log("unlike")
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(response["count"])
            }
        })

    }

}

function toggle_favorite(video_id, type) {
    // console.log(video_id, type)
    let $a_like = $(`#${video_id} a[aria-label='favorite']`)
    let $i_like = $a_like.find("i")
    console.log($i_like)

    // console.log($i_like)
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
                // console.log("favorite")
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
                // console.log("unfavorite")
                $i_like.addClass("fa-star-o").removeClass("fa-star")
                $a_like.find("span.like-num").text(response["count"])
            }
        })
    }

}



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


function posting(num) {
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
        $('#list').empty()
        $.ajax({
        type: 'POST',
        url: '/index',
        data: {num_give: num},
        success: function (response) {
            // console.log(response['video'])
            let rows = response['video']
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i]
                let img = row['img']
                let title = row['title']
                let name = row['name']
                let url = row['url']
                let count = row['count_heart']
                // console.log(count)
                let class_heart = ""
                if (row["heart_by_me"]) {
                    class_heart = 'fa-heart'
                    // console.log(class_heart)
                } else {
                    class_heart = 'fa-heart-o'
                    // console.log(class_heart)
                }
                let class_favorite = ""
                if (row["favorite_by_me"]) {
                    class_favorite = 'fa-star'
                    // console.log(class_favorite)
                } else {
                    class_favorite = 'fa-star-o'
                    // console.log(class_favorite)
                }

                let temp_html = `
                                <div class="card" id="${row["_id"]}" style="max-width: 15rem; outline: #20c997 10px" >
                                  <div class="card-header">${name}</div>
                                  <img src="${img}" class="mypic">
                                  <div class="card-body">
                                    <h4 class="card-title">${title}</h4>
                                    <a href="http://www.youtube.com${url}" target="_blank">보러가기</a>
                                  </div>
                                      <nav class="level is-mobile">
                                            <div class="level-left">
                                                <a style="text-decoration: none" class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${row["_id"]}','heart')">
                                                    <span class="icon is-small"><i class="fa ${class_heart}" aria-hidden="true" style="color: red"></i></span>&nbsp;<span class="like-num">${count}</span>
                                                <a style="text-decoration:none " class="level-item is-sparta" aria-label="favorite" onclick="toggle_favorite('${row["_id"]}','favorite')">
                                                    <span class="icon is-small"><i class="fa ${class_favorite}" aria-hidden="true" style="color: yellow"></i></span>&nbsp;
                                                </a>
                                            </div>
                                    </nav>
                                </div>`

                $('#list').append(temp_html)
            }
        }
    });
    }else{
        document.getElementById(btn_num).className = 'human-btn '+btn_num
        $('#list').empty()
    }

}


function sign_out() {
            $.removeCookie('mytoken', {path: '/'});
            alert('로그아웃!')
            window.location.href = "/login"
        }