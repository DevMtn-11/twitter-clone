$(document).ready(function() {
  /* START CONSTRUCTORS */
    // TWEET CONSTRUCTOR
    var Tweet = function(username, fullname, tweet, tweetLength, profilepic, timeposted) {
      this.username                 = username;
      this.fullname                 = fullname;
      this.tweet                    = tweet;
      this.tweetLength              = tweetLength;
      this.profilepic               = profilepic;
      this.timeposted               = timeposted;
      this.retweetCount             = 0;
      this.favCount                 = 0;
      this.usersInteract            = [];
      this.buildHtml = function() {
        var html =
          '<div class="tweet">' +
            '<div class="content">' +
              '<img class="avatar" src="' + this.profilepic + '" data-toggle="tooltip"  title= "' + this.username + '" />' +
              '<strong class="fullname">' + this.fullname + '</strong>\n' +
              '<span class="username">' + this.username +'</span>' +
              '<p class="tweet-text">' + this.tweet + '</p>' +
              '<div class="tweet-actions">' +
                '<ul>' +
                  '<li><span class="icon action-reply"></span> Reply</li>' +
                  '<li><span class="icon action-retweet"></span> Retweet</li>' +
                  '<li><span class="icon action-favorite"></span> Favorite</li>' +
                  '<li><span class="icon action-more"></span> More</li>' +
                '</ul>' +
              '</div>' +
              '<div class="stats">' +
                '<div class="retweets">' +
                  '<p class="num-retweets">'+ this.retweetCount +'</p>' +
                  '<p>RETWEETS</p>' +
                '</div>' +
                '<div class="favorites">' +
                  '<p class="num-favorites">' + this.favCount + '</p>' +
                  '<p>FAVORITES</p>' +
                '</div>' +
                '<div class="users-interact">' +
                  '<div>' +
                    '<img src="img/alagoon.jpg" />' +
                    '<img src="img/vklimenko.jpg" />' +
                  '</div>' +
                '</div>' +
                '<div class="timeago">' +
                  $.timeago(this.timeposted) +
                '</div>' +
              '</div>' +
              '<div class="reply">' +
                '<img class="avatar" src="img/alagoon.jpg" />' +
                '<textarea class="tweet-compose" placeholder="Reply to @mybff"/></textarea>' +
              '</div>' +
            '</div>' +
          '</div>';

        return html;
      };
    };
  /* END CONSTRUCTORS */

/* START ON PAGE LOAD FUNCTIONS */
  // LOAD TWEETS
  for(var key in localStorage) {
    var tweet = JSON.parse(localStorage[key]);
    console.log(tweet.html);
    $('#stream').prepend(tweet.html);
  }

  $('.tweet-actions').hide();
  $('.stats').hide();
  $('.reply').hide();
  hoverTweet();
  clickTweet();
  $("time.timeago").timeago();
  $('[data-toggle="tooltip"]').tooltip();
/* END ON PAGE LOAD FUNCTIONS */

/*--------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------*/

/* START EVENT HANDLERS */
  // HOVER TWEET EVENT
  function hoverTweet() {
    $('.tweet').hover(
      function(e) {
        $(this).find('.tweet-actions').css('display', '');
      },
      function() {
        $(this).find('.tweet-actions').css('display', 'none');
      }
    );
  }
  // CLICK TWEET EVENT
  function clickTweet() {
    $('.tweet').click(function() {
      if($(this).find('.reply').css('display') === 'none') {
        $(this).find('.stats').show(100);
        $(this).find('.reply').show(100);
      }
      else {
        $(this).find('.stats').hide(200);
        $(this).find('.reply').hide(200);
      }
    });
  }

  // FOCUS IN AND OUT ON TWEET TEXT AREA EVENT
  $('#tweet-content .tweet-compose').focus(function() {
    $('#tweet-controls').css('display', 'inherit');
    $('#tweet-content .tweet-compose').css('height', '5em');
  });
  $('#tweet-content .tweet-compose').focusout(function() {
    if($('#tweet-content .tweet-compose').val().length === 0) {
      $('.tweet-compose').css('height', '2.5em');
      $('#tweet-controls').css('display', 'none');
    }
    else {
      $('#tweet-content .tweet-compose').css('height', '5em');
      $('#tweet-controls').css('display', 'inherit');
    }
  });

  // COUNT CHARACTERS AND PERFORM ACTIONS ON EACH KEYUP EVENT
  $('.tweet-compose').keyup(function() {
    var $tweetLength = $('.tweet-compose').val().length;
    $('#char-count').text(140 - $tweetLength);

    if($tweetLength >= 130) {
      $('#char-count').css('color', 'red');
    }
    else if($tweetLength < 130){
      $('#char-count').css('color', '#999');
    }

    if($tweetLength > 140) {
      var char = $tweetLength === 141 ? ' characters' : ' character';
      $('#tweet-submit').attr('disabled','');
      $('#char-count').text($tweetLength < 340 ? 'You\'re over by ' + ((140 - $tweetLength) * (-1)) + char : 'Slow down there, buddy!');
    }
    else if($tweetLength <= 140){
      $('#tweet-submit').removeAttr('disabled','');
    }
  });

  // CLICK TWEET BUTTON EVENT
  $('#tweet-submit').on('click', function() {
    // BUILD A TWEET OBJECT
    var tweet = new Tweet($('#user-username').text(), $('#user-fullname').text(), $('.tweet-compose').val(), $('.tweet-compose').val().length, $('#profile-summary > .content > .avatar').attr('src'), (new Date()));
    // CREATE THE HTML FOR THE TWEET AND APPEND IT TO THE TWEET OBJECT
    tweet.html = tweet.buildHtml();

    // ADD THE TWEET OBJECT INTO LOCAL STORAGE WITH A KEY VALUE OF THE CURRENT TIME IN MILLISECONDS
    localStorage.setItem(JSON.stringify(Date.now()), JSON.stringify(tweet));
    console.log(tweet);

    if(tweet.tweetLength > 0 && tweet.tweetLength <= 140) {

      $('#stream').prepend(tweet.html);


      // RESET DASHBOARD
      $('.tweet-compose').val('');
      $('#char-count').text(140);
      $('.tweet-compose').css('height', '2.5em');
      $('#tweet-controls').css('display', 'none');
      $('.tweet-actions').css('display', 'none');

      // ADD HOVER EVENT TO NEW TWEET
      hoverTweet();
      window.setTimeout(function() {
        if($(this).find('.reply').css('display') !== 'none') {
          $('.stats').hide(200);
          $('.reply').hide(200);
        }
      }, 500);

      // ADD CLICK EVENT TO THE NEW TWEET
      clickTweet();
    }
  });

/* END EVENT HANDLERS */

});
