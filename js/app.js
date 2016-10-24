$(".search-form").on("submit",function(event){
    event.preventDefault();
  var value = $('#search').val();
  
  //var url = 'http://api.wunderground.com/api/12622f6d50946b09/conditions/q/CA/San_Francisco.json';//format=json&tags=
   var url = 'http://www.omdbapi.com/';//format=json&tags=
  var options = {
    s:value,
    r:'json'
  };
  
 //call getJSON API //http://www.omdbapi.com/?t=star&y=&plot=short&r=json

$.ajax({
                type: 'GET',
                dataType: 'text',
                url: 'http://www.omdbapi.com/?s=' + value + '&y=&r=json&', //page=2
                statusCode: {
                    403: function () {
                        console.log('HTTP 403 Forbidden!');
                    }
                },
                success: function (a) {
                    var omdb = jQuery.parseJSON(a);
                    var omdbHTML = '';
                    $.each(omdb.Search, function (i, d) {
                        omdbHTML += '<li>';
                        if(d.Poster !== 'N/A'){
                        omdbHTML += '<div class="poster-wrap"><img src="' + d.Poster + '"></div>';
                        }else{
                            omdbHTML += '<div class="poster-wrap"><i class="material-icons poster-placeholder">crop_original</i></div>';
                        }
                        omdbHTML += ' <span class="movie-title">' + d.Title + '</span>';
                        omdbHTML += '<span class="movie-year">' + d.Year + '</span>';
                        omdbHTML += '</li>';
                    });
                   
                    $('#movies').html(omdbHTML);
                },
                complete: function () {
                    
                   console.log('Done');
                }
            });

    
});
  
