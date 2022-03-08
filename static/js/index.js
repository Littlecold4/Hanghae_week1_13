$(document).ready(function () {
});


function toggle_like(video_id, type) {
    console.log(video_id, type)
    // let $b_like = $(`#hi a[aria-label='heart']`).find("i")
    // console.log($b_like)
    let $a_like = $(`#${video_id} a[aria-label='heart']`)
    console.log($a_like)
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


function listing() {
    $.ajax({
        type: 'GET',
        url: '/movie',
        data: {},
        success: function (response) {


        }
    })
}

function remove() {
    $('#list').empty()
}

function posting(num) {
    $('#list').empty()
    $.ajax({
        type: 'POST',
        url: '/index',
        data: {num_give: num},
        success: function (response) {
            console.log(response['video'])
            let rows = response['video']
            for (let i = 0; i < rows.length; i++) {
                let img = rows[i]['img']
                let title = rows[i]['title']
                let name = rows[i]['name']
                let url = rows[i]['url']
                let class_heart = ""
                if (rows[i]["heart_by_me"]) {
                    console.log(rows[i]["heart_by_me"])
                    class_heart = "fa-heart"
                } else {
                    console.log(rows[i]["heart_by_me"])
                    class_heart = "fa-heart-o"
                }

                let temp_html = `
                                <div class="card border-primary mb-3" id="${rows[i]["_id"]} style="max-width: 20rem;" >
                                  <div class="card-header">${name}</div>
                                  <img src="${img}" class="mypic">
                                  <div class="card-body">
                                    <h4 class="card-title">${title}</h4>
                                    <p class="card-text">Go for show</p>
                                    <a href="http://www.youtube.com${url}">보러가기</a>
                                  </div>
                                      <nav class="level is-mobile">
                                            <div class="level-left">
                                                <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${rows[i]['_id']}','heart')">
                                                    <span class="icon is-small"><i class="fa ${class_heart}" aria-hidden="true"></i></span>&nbsp;<span class="like-num">2.7k</span>
                                                </a>
                                            </div>
                                    </nav>
                                </div>`

                $('#list').append(temp_html)
            }
        }
    });
}


