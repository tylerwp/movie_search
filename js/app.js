

$(document).ready(function () {

    //keep track of omdb results page
    var pageTrack = 1;
    var loadedCount = 10;
    var totalResultsCount = 0;

    //hide loader
    $('.loader').hide();

    $(".search-form").on("submit", function (event) {
        //prevent form submission 
        event.preventDefault();
        pageTrack = 1;//new search so reset results page location
        loadedCount = 10;// reset load count.
        //call ajax request function
        omdbRequest(pageTrack, false);        
    });



    function omdbRequest(page, loadMore) {

        //get search fields values
        var value = $('#search').val();
        var year = $('#year').val();
        //update page tracking
        pageTrack++;

        //call getJSON API
        $('.loader').show();//display loading element
        $.ajax({
            type: 'GET',
            dataType: 'text',
            url: 'http://www.omdbapi.com/?s=' + value + '&r=json&y=' + year + '&page=' + page,
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

                    //loop through results and create html results
                    $.each(omdb.Search, function (i, d) {
                        omdbHTML += '<li><a href="#" class="poster-link" data-omdbID="' + d.imdbID + '">';
                        if (d.Poster !== 'N/A') {

                            omdbHTML += '<div class="poster-wrap"><img src="' + d.Poster + '"></div>';

                        } else {
                            omdbHTML += '<div class="poster-wrap"><i class="material-icons poster-placeholder">crop_original</i></div>';
                        }
                        omdbHTML += ' <span class="movie-title" data-omdbID="' + d.imdbID + '">' + d.Title + '</span>';
                        omdbHTML += '<span class="movie-year">' + d.Year + '</span>';
                        omdbHTML += '</a></li>';
                    });

                    //load or append results based on submit or user scroll events. 
                    if (loadMore) {
                        $('#movies').append(omdbHTML);
                    } else {
                        $('#movies').html(omdbHTML);
                    }

                }
            },
            complete: function () {
                $('.loader').hide();//hide loading element
                console.log('Done');
            }
        });


    }


    //check if browser scolling has reached the bottom then load more results.
    $(window).on("scroll", function () {
        var scrollHeight = $(document).height();//get height of document
        var scrollPosition = $(window).height() + $(window).scrollTop();//get scroll position
        if ((scrollHeight - scrollPosition) / scrollHeight === 0) { //check if scoll has reach the bottom.
            console.log(totalResultsCount + ':' + loadedCount);
            // when scroll to bottom of the page check if all results have been loaded.
            if (totalResultsCount > loadedCount) {
                //append more results
                omdbRequest(pageTrack, true);
            }
        }
    });

    //Hide single view dialog 
    $('.sR-header a').on('click', function (event) {
        event.preventDefault();
        $('#myModal').hide(200);
    });


    // Event binding on dynamically created poster elements
    // When clicked, request omdb single item using omdbID
    $('body').on('click', '.poster-link', function (event) {
        //prevent form submission 
        event.preventDefault();
        var oID = $(this).data();
        showResultView(oID.omdbid);
    });

    function showResultView(omdbID) {
        //this will make call to omdb api and update single results view
        $.ajax({
            type: 'GET',
            dataType: 'text',
            url: 'http://www.omdbapi.com/?i=' + omdbID + '&r=json',
            statusCode: {
                403: function () {
                    console.log('HTTP 403 Forbidden!');
                }
            },
            success: function (a) {
                var omdb = jQuery.parseJSON(a);
                //If error is returned, display message.
                if (omdb.Error) {

                    //error getting results
                    $('.sR-poster').html('<div class="poster-wrap" style="margin:15px;"><i class="material-icons poster-placeholder">crop_original</i></div>');
                    $('.sR-DescHeader h1').html('Error accessing data.');
                    $('.sR-DescHeader span').html('');
                    $('.sR-Desc p').html('');
                    $('.sR-Desc a').attr('href', '#');

                } else {
                    if (omdb.Poster === 'N/A') {
                        $('.sR-poster').html('<div class="poster-wrap" style="margin:15px;"><i class="material-icons poster-placeholder">crop_original</i></div>');
                    } else {
                        $('.sR-poster').html('<img src="' + omdb.Poster + '">');
                    }
                    $('.sR-DescHeader h1').html(omdb.Title + ' (' + omdb.Year + ')');
                    $('.sR-DescHeader span').html('IMDB Rating: ' + omdb.imdbRating);
                    $('.sR-Desc p').html(omdb.Plot);
                    $('.sR-Desc a').attr('href', 'http://www.imdb.com/title/' + omdbID);


                }
            },
            complete: function () {
                //done, show dialog
                $('#myModal').show(200);
            }
        });


    }

});

