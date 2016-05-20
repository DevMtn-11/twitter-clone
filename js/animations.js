$(document).ready(function() {

/* START EVENT HANDLERS */

  // FOCUS ON TEXT AREA
  $('.tweet-compose').focusout(function() {
    if($('.tweet-compose').val().length === 0) {
      $('.tweet-compose').css('height', '2.5em');
      $('#tweet-controls').css('display', 'none');
    }
    else {
      $('.tweet-compose').css('height', '5em');
      $('#tweet-controls').css('display', 'inherit');
    }
  });
  $('.tweet-compose').focus(function() {
    $('#tweet-controls').css('display', 'inherit');
    $('.tweet-compose').css('height', '5em');
  });

  // COUNT CHARACTERS AND PERFORM ACTIONS ON EACH KEYUP
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
      $('#tweet-submit').attr('disabled','');
      $('#char-count').text('Too many characters!');
    }
    else if($tweetLength <= 140){
      $('#tweet-submit').removeAttr('disabled','');
    }
  });

  // CLICK TWEET BUTTON
  $('#tweet-submit').on('click', function() {
    var $tweetLength = $('.tweet-compose').val().length;
    var $userTweet = $('.tweet-compose').val();
    var $userFullName = $('#user-fullname').text();
    var $userName = $('#user-username').text();
    var $userProfilePic = $('#profile-summary > .content > .avatar').attr('src');
    var html =
    '<div class="tweet">' +
      '<div class="content">' +
        '<img class="avatar" src="' + $userProfilePic + '" />' +
        '<strong class="fullname">' + $userFullName + '</strong>\n' +
        '<span class="username">' + $userName +'</span>' +
        '<p class="tweet-text">' + $userTweet + '</p>' +
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
            '<p class="num-retweets">30</p>' +
            '<p>RETWEETS</p>' +
          '</div>' +
          '<div class="favorites">' +
            '<p class="num-favorites">6</p>' +
            '<p>FAVORITES</p>' +
          '</div>' +
          '<div class="users-interact">' +
            '<div>' +
              '<img src="img/alagoon.jpg" />' +
              '<img src="img/vklimenko.jpg" />' +
            '</div>' +
          '</div>' +
          '<div class="time">' +
            '1:04 PM - 19 Sep 13' +
          '</div>' +
        '</div>' +
        '<div class="reply">' +
          '<img class="avatar" src="img/alagoon.jpg" />' +
          '<textarea class="tweet-compose" placeholder="Reply to @mybff"/></textarea>' +
        '</div>' +
      '</div>' +
    '</div>'
    ;

    if($tweetLength > 0 && $tweetLength <= 140) {
      $('#stream').prepend(html);
    }
    $('.tweet-compose').val('');
    $('#char-count').text(140);
    $('.tweet-compose').css('height', '2.5em');
    $('#tweet-controls').css('display', 'none');
  });
/* END EVENT HANDLERS */

});
