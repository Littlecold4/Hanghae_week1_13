$(document).ready(function () {
});

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
        }
    })
    window.location.reload()

}

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
//
// function  log_out(){
//
// }

function post_fa(num) {
    $('#cards-box').empty()
    $.ajax({
        type: 'POST',
        url: '/favorite/post',
        data: {},
        success: function (response) {
            // console.log(response['video'])
            let rows = response['video']
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i]
                if (row['num'] == num) {
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
                                <div class="card border-primary mb-3" id="${row["video_id"]}" style="max-width: 20rem;" >
                                  <div class="card-header">${name}</div>
                                  <img src="${img}" class="mypic">
                                  <div class="card-body">
                                    <p class="card-title">${title}</p>
                                    <a href="http://www.youtube.com${url}">보러가기</a>
                                  </div>
                                      <nav class="level is-mobile">
                                            <div class="level-left">
                                                <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like_fa('${row["video_id"]}','heart')">
                                                    <span class="icon is-small"><i class="fa ${class_heart}" aria-hidden="true" style="color: red"></i></span>&nbsp;<span class="like-num">${count}</span>
                                                <a class="level-item is-sparta" aria-label="favorite" onclick="delete_favorite('${row["video_id"]}','favorite')">
                                                    <span class="icon is-small"><i class="fa ${class_favorite}" aria-hidden="true" style="color: yellow"></i></span>&nbsp;
                                                </a>
                                            </div>
                                    </nav>
                                </div>`

                    $('#cards-box').append(temp_html)
                }
            }
        }
    });
}

function sign_out() {
            $.removeCookie('mytoken', {path: '/'});
            alert('로그아웃!')
            window.location.href = "/login"
        }