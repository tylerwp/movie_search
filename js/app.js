
//keep track of omdb results page
var pageTrack = 1;
var loadedCount = 10;
var totalResultsCount = 0;

//hide loader
$('.loader').hide();

$(".search-form").on("submit",function(event){
    //prevent form submission 
    event.preventDefault();    
    pageTrack = 1;//new search so reset results page location
    //call ajax request function
    omdbRequest(pageTrack,false);
});
  

function omdbRequest(page,loadMore){

//get search fields values
  var value = $('#search').val();
  var year = $('#year').val(); 

    pageTrack++;// !! this needs to stop at 100 i think, check omdb
    
 //call getJSON API //http://www.omdbapi.com/?t=star&y=&plot=short&r=json
$('.loader').show();
$.ajax({
                type: 'GET',
                dataType: 'text',
                url: 'http://www.omdbapi.com/?s=' + value + '&r=json&y=' + year + '&page=' + page, //page=2 (1-100)
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
                           
                              omdbHTML += '<li class="no-movies">';
                              omdbHTML += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + value + '.';
                              omdbHTML += '</li>';
                              $('#movies').html(omdbHTML);
                              //clear results count
                              $('.resultsCount').html('');

                    } else {

                        //Show results count
                        totalResultsCount = omdb.totalResults;
                        loadedCount += 10;
                        $('.resultsCount').html('Results: ' + omdb.totalResults);

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
                        
                        if(loadMore){
                            $('#movies').append(omdbHTML);

                        }else{
                            $('#movies').html(omdbHTML);
                        }

                    }
                },
                complete: function () {
                    $('.loader').hide();
                   console.log('Done');
                }
            });


}



$(window).on("scroll", function() {
	var scrollHeight = $(document).height();
	var scrollPosition = $(window).height() + $(window).scrollTop();
	if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
        console.log(totalResultsCount + ':' + loadedCount);
	    // when scroll to bottom of the page
        if(totalResultsCount > loadedCount){
            omdbRequest(pageTrack,true);            
        }
	}
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