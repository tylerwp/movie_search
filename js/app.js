$(".search-form").on("submit",function(event){
    event.preventDefault();
  var value = $('#search').val();
  var year = $('#year').val();
  
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
                url: 'http://www.omdbapi.com/?s=' + value + '&r=json&y=' + year, //page=2
                statusCode: {
                    403: function () {
                        console.log('HTTP 403 Forbidden!');
                    }
                },
                success: function (a) {
                    var omdb = jQuery.parseJSON(a);
                    var omdbHTML = '';
                    //If error is returned, display message.
                    if (omdb.Error) {
                            /*
                             <li class='no-movies'>
            <i class='material-icons icon-help'>help_outline</i>No movies found that match: [search form value].
          </li> 
                             */
                              omdbHTML += '<li class="no-movies">';
                              omdbHTML += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + value + '.';
                              omdbHTML += '</li>';
                              $('#movies').html(omdbHTML);

                    } else {
                        $.each(omdb.Search, function (i, d) {
                            omdbHTML += '<li>';
                            if (d.Poster !== 'N/A') {
                                omdbHTML += '<div class="poster-wrap"><img src="' + d.Poster + '"></div>';
                            } else {
                                omdbHTML += '<div class="poster-wrap"><i class="material-icons poster-placeholder">crop_original</i></div>';
                            }
                            omdbHTML += ' <span class="movie-title">' + d.Title + '</span>';
                            omdbHTML += '<span class="movie-year">' + d.Year + '</span>';
                            omdbHTML += '</li>';
                        });

                        $('#movies').html(omdbHTML);

                    }
                },
                complete: function () {
                    
                   console.log('Done');
                }
            });

    
});
  
/*
    TODO:
    
    Link a movie to its IMDb page
            
        Wrap the poster image -- or everything in the <li> -- in a <a> tag that links a movie to its imdb.com page
        For example: The Amazing Spider-Man

    Create a movie description page

        Load or link to a description page displaying a movie's title, year, poster, plot information, and IMDb rating
        You'll need to write the CSS for this new page
        See the 'description-page.png' mockup in the 'examples' folder of the project files


*/