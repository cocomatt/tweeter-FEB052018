/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from tweets.json

const data = [
  {
    'user': {
      'name': 'Newton',
      'avatars': {
        'small':   'https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png',
        'regular': 'https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png',
        'large':   'https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png'
      },
      'handle': '@SirIsaac'
    },
    'content': {
      'text': 'If I have seen further it is by standing on the shoulders of giants'
    },
    'created_at': 1461116232227
  },
  {
    'user': {
      'name': 'Descartes',
      'avatars': {
        'small':   'https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png',
        'regular': 'https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png',
        'large':   'https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png'
      },
      'handle': '@rd' },
    'content': {
      'text': 'Je pense , donc je suis'
    },
    'created_at': 1461113959088
  },
  {
    'user': {
      'name': 'Johann von Goethe',
      'avatars': {
        'small':   'https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png',
        'regular': 'https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png',
        'large':   'https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png'
      },
      'handle': '@johann49'
    },
    'content': {
      'text': 'Es ist nichts schrecklicher als eine tätige Unwissenheit.'
    },
    'created_at': 1461113796368
  }
];

function handleComposeSubmit(event) {
  event.preventDefault();
  console.log('Button clicked, performing ajax call...');
  let formDataString = $(this).serialize();
  let textAreaContent = $('#new-tweet-area').val();
  if(textAreaContent === '') {
    console.log('empty');
    return showNotificationBar('Tweet something. Please enter text.', 500, '#F4E0E1', '#A42732', 40);
  } else if (textAreaContent.length > 140) {
    return showNotificationBar('Your tweet contains too many characters. Cut it down to size.', 500, '#F4E0E1', '#A42732', 40);
  } else {
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: formDataString
    }).done(function(data) {
      loadTweets();
      $('input[type=text], textarea').val('');
      console.log('the ajax request was successfull');
    });
  }
}

function createTweetElement (tweetObj) {
  $tweet = $('<article>').addClass('tweet');
  let html = `
    <header>
      <img src=${tweetObj.user.avatars.small} alt='user-avatar' />
      <h1>${tweetObj.user.name}</h1>
      <h2>${tweetObj.user.handle}</h2>
    </header>
    <div class='tweet-body'>
      <p>
        ${tweetObj.content.text}
      </p>
    </div>
    <footer>
      <p>
        ${elapsedTime(tweetObj.created_at)}
      </p>
      <span>
        <i class='fa fa-flag' aria-hidden='true'></i>
        <i class='fa fa-retweet' aria-hidden='true'></i>
        <i class='fa fa-heart' aria-hidden='true'></i>
      </span>
    </footer>
  `;
  $tweet = $tweet.append(html);
  return $tweet;
}

function renderTweets(tweets) {
  let $html = $('<section></section>');
  tweets.forEach((tweet)=> {
    let a = createTweetElement(tweet);
    $html.prepend(a);
  })
  $('.tweets-container').html($html);
}

function loadTweets() {
  $.ajax({
    url: `/tweets`,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      console.log('Success: ', data);
      renderTweets(data);
    }
  });
}

function showNotificationBar(message, duration, bgColor, txtColor, height) {
  /*set default values*///(message, 1500, '#F4E0E1', '#A42732', 40)
  //duration = typeof duration !== 'undefined' ? duration : 1500;
  //bgColor = typeof bgColor !== 'undefined' ? bgColor : "#F4E0E1";
  //txtColor = typeof txtColor !== 'undefined' ? txtColor : "#A42732";
  //height = typeof height !== 'undefined' ? height : 40;
  //create the notification bar div if it doesn't exist*/
  if ($('#notification-bar').size() == 0) {
      let HTMLmessage = "<div class='notification-message' style='text-align:center; line-height: " + height + "px'> " + message + " </div>";
      $('body').prepend("<div id='notification-bar' style='width:100%; height:" + height + "px; background-color: " + bgColor + "; position: fixed; z-index: 100; transition-duration: " + duration + "; color: " + txtColor + ";border-bottom: 1px solid " + txtColor + ";'>" + HTMLmessage + "</div>");
  }
  $('#notification-bar').slideDown(function() {
      setTimeout(function() {
          $('#notification-bar').slideUp(function() { $(this).remove();});
      }, duration);
  });
}

function elapsedTime(date) {
  let currentDate = Date.now();
  let secondsAgo = (currentDate - date) / 1000;
  let minutesAgo = (currentDate - date) / 1000 / 60;
  let hoursAgo = (currentDate - date) / 1000 / 60 / 60;
  if (minutesAgo < 1) {
    return `${Math.floor(secondsAgo)} seconds ago`;
  } else if (minutesAgo >= 1 && minutesAgo < 60) {
    return `${Math.floor(minutesAgo)} minutes ago`;
  } else if (minutesAgo >= 60 && hoursAgo < 24) {
    return `${Math.floor(hoursAgo)} hours ago`;
  } else if (hoursAgo >= 24) {
    return `${Math.floor(hoursAgo / 24)} days ago`;
  }
}

$(document).ready(function() {
    $(".new-tweet").hide();
    loadTweets(data);
    console.log('loadTweets function invoked successfully');
    $('form').on('submit', handleComposeSubmit);
    console.log('submit successful');
    $("button").click(function(){
      $(".new-tweet").slideToggle("fast", function (){});
    });
});