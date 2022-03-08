$(document).ready(function () {
});

function listing() {
    $.ajax({
        type: 'GET',
        url: '/movie',
        data: {},
        success: function (response) {


        }
    })
}

function remove(){
    $('#list').empty()
}
function posting(num) {
    $('#list').empty()
    $.ajax({
        type: 'POST',
        url: '/health',
        data: {num_give: num},
        success: function (response) {
            console.log(response['video'])
            let rows = response['video']
            for (let i = 0; i < rows.length; i++) {
                let img = rows[i]['img']
                let title = rows[i]['title']
                let name = rows[i]['name']
                let url = rows[i]['url']

                let temp_html = `
                                <div class="card border-primary mb-3" id="div_li" style="max-width: 20rem;">
                                  <div class="card-header">${name}</div>
                                  <img src="${img}" class="mypic">
                                  <div class="card-body">
                                    <h4 class="card-title">${title}</h4>
                                    <p class="card-text">Go for show</p>
                                  </div>
                                </div>`

                $('#list').append(temp_html)
            }
        }
    });
}
