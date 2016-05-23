$(document).ready(function() {
  /* DEFINE EVENT HANDLERS */
    // HOVER TWEET EVENT
    function hoverTweetEvent() {
      function hoverInTweet(e) {
        $(this).css('background', '#fafafa');
        $(this).find('.tweet-actions').show(100);
      }
      function hoverOutTweet(e) {
        $(this).css('background', 'inherit');
        $(this).find('.tweet-actions').hide(100);
      }

      $('.tweet').hover(hoverInTweet, hoverOutTweet);
    }

    // CLICK TWEET EVENT
    function clickTweetEvent() {
      $('.tweet').on('click', function(e) {
        var target = $(e.target).parents('.tweet');

        // SHOW OR HIDE STATS AND REPLY
        if(target.find('.reply').css('display') === 'none') {
          target.find('.stats').slideDown(100);
          target.find('.reply').slideDown(100);
        }
        else {
          target.find('.stats').slideUp(200);
          target.find('.reply').slideUp(200);
        }
      });
    }

    // CLICK TWEET ACTIONS
    function clickTweetActionEvent(tweet) {
      $('.tweet-actions').on('click', function(e) {
        clickTweetEvent();
        var target = e.target.innerText || e.target.className;
        if(target === ' Reply' || target === 'icon action-reply') {
          console.log('You clicked reply. Big whoop!');
        }
        else if(target === ' Retweet' || target === 'icon action-retweet') {
          updateTweetStats.call($(this), tweet, 'retweetCount', '.num-retweets');
          updateLocalStorage(JSON.stringify(tweet.id), JSONfn.stringify(tweet));
        }
        else if(target === ' Favorite' || target === 'icon action-favorite') {
          updateTweetStats.call($(this), tweet, 'favCount', '.num-favorites');
          updateLocalStorage(JSON.stringify(tweet.id), JSONfn.stringify(tweet));
        }
        else if(target === ' More' || target === 'icon action-more') {
          console.log('You clicked more but I ain\'t got anymore');
        }
      });

    }

    // UPDATE TWEET STATS
    function updateTweetStats(tweet, stat, className) {
      tweet[stat]++;
      $(this).next().find(className).text(tweet[stat]);
    }

    // FOCUS IN AND OUT OF TWEET TEXT AREA EVENT
    function focusOnTweetComposeInDashBoard() {
      $('#tweet-content .tweet-compose').focus(function() {
        $('#tweet-controls').show(100);
        $('#tweet-content .tweet-compose').css('height', '5em');
      });
      $('#tweet-content .tweet-compose').focusout(function() {
        if($('#tweet-content .tweet-compose').val().length === 0) {
          $('.tweet-compose').css('height', '2.5em');
          $('#tweet-controls').hide(100);
        }
        else {
          $('#tweet-content .tweet-compose').css('height', '5em');
          $('#tweet-controls').show();
        }
      });
    }

    // COUNT CHARACTERS AND PERFORM ACTIONS ON EACH KEYUP EVENT
    function keyupOnTweetComposeInDashboard() {
      $('.tweet-compose').keyup(function() {
        var $tweetLength = $('.tweet-compose').val().length;
        $('#char-count').text(140 - $tweetLength);


        if($tweetLength <= 0) {
          $('#char-count').css('color', '#999');
          $('#tweet-submit').attr('disabled','');
        }
        else if($tweetLength < 130 && $tweetLength > 0){
          $('#char-count').css('color', '#999');
          $('#tweet-submit').attr('disabled',null);
        }
        else if($tweetLength >= 130) {
          $('#char-count').css('color', 'red');
          if($tweetLength > 140) {
            $('#tweet-submit').attr('disabled','');
            var char = $tweetLength === 141 ? ' characters' : ' character';
            $('#char-count').text($tweetLength < 340 ? 'You\'re over by ' + ((140 - $tweetLength) * (-1)) + char : 'Slow down there, buddy!');
          }
        }
      });
    }

    // RESET DASHBOARD
    function resetDashboard() {
      $('.tweet-compose').val('');
      $('#char-count').text(140);
      $('.tweet-compose').css('height', '2.5em');
      $('#tweet-controls').css('display', 'none');
      $('.tweet-actions').css('display', 'none');
      // SHOW THE TWEET'S REPLY AND STATS SECTION FOR HALF A SECOND, THEN HIDE IT
      setTimeout(
        function() {
          if($(this).find('.reply').css('display') !== 'none') {
            $('.stats').slideUp(200);
            $('.reply').slideUp(200);
          }
        },
        500
      );
    }

    // UPDATE THE STREAM
    function updateStream(tweet) {
      $('#stream').prepend(tweet.html());
      resetDashboard();
      $('.tweet').off();
      hoverTweetEvent();
      clickTweetEvent();
      $('.tweet-actions').off();
      clickTweetActionEvent(tweet);
    }

    // UPDATE LOCAL STORAGE
    function updateLocalStorage(key, tweet) {
      localStorage.setItem(key, tweet);
    }

    // CLICK TWEET BUTTON EVENT
    function submitTweetInDashboard() {
      $('#tweet-submit').click(function() {
        // BUILD A TWEET OBJECT
        var tweet = new Tweet($('#user-username').text(), $('#user-fullname').text(), $('.tweet-compose').val(), $('.tweet-compose').val().length, $('#profile-summary > .content > .avatar').attr('src'), (new Date()));
        var key = JSON.stringify(tweet.id);
        // ADD THE TWEET OBJECT INTO LOCAL STORAGE WITH A KEY OF THE CURRENT TIME IN MILLISECONDS
        updateLocalStorage(key, JSONfn.stringify(tweet));

        // ADD TWEET TO THE STREAM
        updateStream(tweet);
      });
    }
  /* END DEFINE EVENT HANDLERS */

/*--------------------------------------------------------------------------*/

  /* END ON PAGE LOAD FUNCTIONS */
    // LOAD TWEETS
    (function whenPageLoadsDoThis() {
      if(localStorage.length !== 0) {
        for(var key in localStorage) {
          var tweet = JSONfn.parse(localStorage[key]);
          updateStream(tweet);
          $('.tweet-actions').off();
          clickTweetActionEvent(tweet);
        }
      }

      // HIDE DASHBOARD BUTTON AND COUNTER
      $('.tweet-actions').hide();
      // HIDE TWEET STATS AND REPLY SECTION
      $('.stats').hide();
      $('.reply').hide();
      // INITIALIZE TIMEAGO
      $("time.timeago").timeago();
      // INITIALIZE TOOLTIP
      $('[data-toggle="tooltip"]').tooltip();
      // INITIALIZE ALL EVENT LISTENERS
      $('.tweet').off();
      hoverTweetEvent();
      clickTweetEvent();
      focusOnTweetComposeInDashBoard();
      keyupOnTweetComposeInDashboard();
      submitTweetInDashboard();
    })();
  /* END ON PAGE LOAD FUNCTIONS */

/*--------------------------------------------------------------------------*/

  /* START CONSTRUCTORS */
    // TWEET CONSTRUCTOR
    var Tweet = function(username, fullname, tweet, tweetLength, profilepic, timeposted) {
      this.id                       = Date.now();
      this.username                 = username;
      this.fullname                 = fullname;
      this.tweet                    = tweet;
      this.tweetLength              = tweetLength;
      this.profilepic               = profilepic;
      this.timeposted               = timeposted;
      this.retweetCount             = 0;
      this.favCount                 = 0;
      this.usersInteract            = [];
      this.html = function () {
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

});
