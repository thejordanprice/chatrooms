getChatLog();
setInterval(appendNewLog,1500);

var chatdiv = document.getElementById('chatlog');
var loading = document.getElementById('loading');
var diff = chatdiv.clientHeight + chatdiv.scrollTop;
var chatroom = getChatId();
var laststamp = '';
var isfocused = '';
var timer = '';

document.addEventListener( 'visibilitychange' , function() {
  if (document.hidden) {
      isfocused = false;
  } else {
      isfocused = true;
  }
}, false );

function getChatLog() {
  var ajax = new XMLHttpRequest();
  ajax.onload = function() {
    var data = JSON.parse(this.responseText);
    if (data.chats) {
      var chats = data.chats;
    } else {
      var chats = [];
    }
    var x = 0;
    var html = '';
    for (x = 0; x < chats.length; x++) {
      var timestamp = chats[x].timestamp;
      var atime = chats[x].time;
      var username = chats[x].username;
      var message = magicify(chats[x].message);
      laststamp = timestamp;
      html = html + '<p>(' + atime + ') ' + username + ': ' + message + '</p>';
    }
    if (html === '') {
      html = 'Start talking...';
    }
    chatdiv.innerHTML = html;
    loading.style.display = "none";
    shouldScroll = chatdiv.scrollTop + chatdiv.clientHeight === chatdiv.scrollHeight;
    if (!shouldScroll) {
      scrollToBottom();
    }
    return false;
  }
  var url = '/api/chatlog/' + getChatId();
  ajax.open('GET', url);
  ajax.setRequestHeader('content-type', 'application/json');
  ajax.send();
  return false;
}

function appendNewLog() {
  var ajax = new XMLHttpRequest();
  ajax.onload = function() {
    var data = JSON.parse(this.responseText);
    if (data.chats) {
      var chats = data.chats;
    } else {
      var chats = [];
    }
    var x = 0;
    var html = '';
    for (x = 0; x < chats.length; x++) {
      var timestamp = chats[x].timestamp;
      var atime = chats[x].time;
      var username = chats[x].username;
      var message = magicify(chats[x].message);
      var diff = chatdiv.clientHeight + chatdiv.scrollTop;
      if (laststamp !== timestamp) {
        html = chatdiv.innerHTML;
        html = html + '<p>(' + atime + ') ' + username + ': ' + message + '</p>';
        chatdiv.innerHTML = html;
        laststamp = timestamp;
        if(username !== document.getElementById('username').value) {
          var theurl = createShareLink();
          var chatroom = getChatId();
          var title = 'Chat: ' + chatroom;
          notifyMe(title, (username + ': ' + message));
        }
        var newdiff = chatdiv.clientHeight + chatdiv.scrollTop;
        if (diff == newdiff) {
          chatdiv.scrollTop = chatdiv.scrollHeight;
        }
      }
      laststamp = timestamp;
    }
    loading.style.display = "none";
    return false;
  }
  if(laststamp == '') {
    var url = '/api/chatlog/' + getChatId();
  }
  if(laststamp != '') {
    var url = '/api/chatlog/' + getChatId() + '?timestamp=' + laststamp;
  }
  ajax.open('GET', url);
  ajax.setRequestHeader('content-type', 'application/json');
  ajax.send();
  return false;
}

function removeChatroom() {
  loading.style.display = "block";
  var chatroom = getChatId();
  var token = document.getElementById('csrf').value;
  var ajax = new XMLHttpRequest();
  var url = '/api/remove/' + chatroom;
  var body = {"id":chatroom};
  ajax.open('POST', url);
  ajax.setRequestHeader('content-type', 'application/json');
  ajax.setRequestHeader('X-CSRF-Token', token);
  ajax.send(JSON.stringify(body));
  window.location = '/chat';
  return false;
}

function sendMessage() {
  loading.style.display = "block";
  var message = document.getElementById('message').value;
  var username = document.getElementById('username').value;
  var token = document.getElementById('csrf').value;
  var chatroom = getChatId();
  var body = {"chatroom":chatroom,"username":username,"message":message};
  var ajax = new XMLHttpRequest();
  var url = '/chat/' + chatroom;
  ajax.open('POST', url);
  ajax.setRequestHeader('content-type', 'application/json');
  ajax.setRequestHeader('X-CSRF-Token', token);
  ajax.send(JSON.stringify(body));
  document.getElementById('message').value = '';
  return false;
}

function getChatId() {
  var full_url = document.URL;
  var url_array = full_url.split('/');
  var last_segment = url_array[url_array.length-1];
  return last_segment;
}

function createShareLink() {
  var full_url = document.URL;
  return full_url;
}

function magicify(text) {
  let imgRegex =/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
  if (imgRegex.test(text) === true) {
    return text.replace(imgRegex, function(url) {
      return '<img style="height:25px" onclick="lightbox(this)" src="' + url + '" />';
    });
  } else {
    let urlRegex =/(\b(https|http|ftp|file|smb):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    if (urlRegex.test(text) === true) {
      return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
      });
    } else {
      return text;
    }
  }
};

function scrollToBottom() {
  chatdiv.scrollTop = chatdiv.scrollHeight;
}

var notification = window.Notification || window.mozNotification || window.webkitNotification;
if ('undefined' === typeof notification)
  alert('Web notification not supported');
else
  notification.requestPermission(function(permission){});
  function notifyMe(titleText, bodyText) {
      if ('undefined' === typeof notification)
          return false;
      var noty = new notification(
          titleText, {
              body: bodyText,
              dir: 'auto',
              lang: 'EN',
              tag: 'notificationPopup',
              icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwAAAAMACAMAAACkX/C8AAACIlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUSYhZAAAAtXRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIyQlJicoKSosLS4vMDEyNDU2Nzg5Ojs8PT4/QEFCQ0RHSUpLTE1OUFFSVFVWV1hZW1xdXl9hYmNkZmhpa2xtcHN0dXd4eXt8fn+AgoOFhoiJi4yOj5GSlJWXmJqbnZ6goqOlpqiqq62vsLS1t7m6vL7AwcPFx8jKzM7P0dPV19na3N7g4uTm6Onr7e/x8/X3+fv9RB2B3QAAC+JJREFUeNrt3Yl7FPUZwPHZhAQiIHJJsRAr0ipe1LMFREBFq6A2eGtprReoeFRFablUWsUqGoSgiAZFiwkacu38fy1Pa2trYGdmf3PY/Xz+gvd53t832dmdnY0iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAHbPKS9Vv2fTowHmdWP9Hf+4eeK6Y2OUh7902Pvvnx30azDxIPHTu0/eFlsy2VhOZuPBYHM/DkwsyDdN2yP9wgozuXttktjdRWfBYHNnBbe5ZJLng79CDjm6dZMGe0ejDOwXBPLe0g5x/MY5D45Sl2zGnNOxTn5NjPUg3SuTWvQcZuq9kzE+uJc7QpxcFb/HWOg/R22TQTmPRmnKtDiQ/eQ/kOMrTYsvmeKUfinA3MTHYZ/lLeg8TLrJv/Me3L3I9dfHJ+kvO/J/9B4nUWzn+Z/EUBxy4+meB/wI4iBolXWznf0X64kGMXDzS8DthSzCDxpZbOf7xW0LGL+xq8F3RjUYOMzbB1vnV7XJjNZxxkbr2wQT52YwT/MjMu0Jk+EasdLXCQxyyef9pXZADHzvAi6K4iB4nn2DynXFXosYt7TjtI13ihg/RaPaccLTaA4dPeG/posYPEi+yeKLqs4GMX336aQTrHCx7kXcsnit4rOoDB0wyyruhBYl8TI5pa+LGLuyeepL/wQR60fn5VfACbJhxkdvGDHLd+3in+3A1MOMitxQ8S+zi45dXqJZy7CZ8V8XoJg7gvuuXNK+HYxVdMNMloCYM85wC0uqvLCGCiz8KmlDFInwPQ6jaUce5enGCQ+WUMMuYAtLrnyzh3+ycYZGkZg8QdTkCL21nGsTs6wSArSgnAEyJa3d4yjt2JCQa5uZQAznYCWlxvGceuPsEg60sJwM0Qre6DUs7dBIPcWcogvhMgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAEgAAQgAAQgAAQgAAQgAAQgAFpCb1UCWC8ASvBWVQK4SQCUYEdVAlguAEqwpSoBXC4ASnBnVQKYJwBKsLQqAXQKgBLMrkoA0UkBULzaWFUC+KMAKMGeqgSwRgCUYFVVApguAErQWZUAoj4B0CKvgaKqvAYSABdUJYD2YQFQgr6KBBDdKwBKsLgqAXQMCYAS7KpIANFKAVCCrtGKBBDtFwAluLoqAUwdFgAleLoiARR+U7QAOKW2tyIBRHcLgBK0HaxIANHjAqAEHQcrEkC0WQCU8T9gb0UCiB4UAGVcBzxdkQCi5eMCoATXjFYjgGjmpwKgBF07qxFAVLuvLgBKsPhgJQKIomnbBEAZLnijEgFE0fQnRwRACTpv2DNWgQD+8UJoyQuDAqCMd4RmL73jme1v9X7Q0OGv8gvglKkX3/zYtj37Gg/S93ldAJQRy6yb+vILII2zrtwlAMqwoLcKAZxq4FkBUIa19UoEEEXdXwmAMv4JnKxGAFFnnwAowdzRagQQtX8oAEpwUUUCiCafEAAl+H1FAkjxnAsBEE7bYEUCiLYLgBLcWpUAZgmAEnRWJYDogAAowTtVCeBWAVCCnqoE8CMBUILLqxJApwAowYKqBFATACWYW5UAIgFQgjkCQAACQAACQAACwEXw99UrE8BsOyOghG+DDuc+SNK3QWfaGQFdmOzYDeQ+SFvCAKbbGQFdluzYHct9kI6EAUy1MwL6ZbJjdzj3Qc5KGMBkOyOg+5Mdu71VuRiJ2+yMgBI+0XZr7oNcV5n3Y2klR5Idu0er8q9o0MoIqJbw6Vh35T5Jwh86OGBnBDQv4QuPa3KfZKQqr8VoJWsTBrAw70FmJhzkATsjoN1Vefd9ZcJBltsZ4bQl/V2NWt6T7Ek4yPmWRjhXJDx2H+c9SOLHs0yxNMJ5PeGxey7vQVYlHGTEzijh7+7avCdJ+listy2NcB6IK/Im0MLYm0AUblLiXzVtz3mSt5IO8lNbI5g7kh67vpwHOTfxw9E7bY1gVwDDSY/dxpwnSfqA0vhzWyOYlxL/3V2U7yBXJR7kEVsjlO7Ex66e7z347YNVKZEW0taf+Nj9Od9Jnq1KibSSrcl/IG91roNcl3yQN6yNQFYlP3b53n4wYyz5INfYG2HMH09+7N7Nc5BJn6QocZLFEcQ5QymO3fV5Xom8n2KQXRZHEF3HUxy7ekd+g9TeSDFIfKnNEeT896c5djl+CbG2Lc0g39SsjhCXnWn+/sdxd36vf95MNciDVkeI69+hVMfus9wG6TiQahBPBSWEG8bTHbtVeQ0y74t0g7xudzT/qmNrulMXD+X14est9ZSTLLA9mtXdn/LUxXfndB3+WtpBPBGLZnW+lPbUxWO53IBfWzeWepJL7I+mTLpjOPWpix/OY5Kln6Yf5CMLpBmTHxpNf+ri0fAfgtVWHMswSHyxFZL90vfne+JM7g1+EfLUSKZBDloiGf/izlu7ezzb8Y9PBP0y/PTrnjuRcZAcP43j/+mwT5k151tzf7zokl/c98rhepxd9gdxds749yBz5v9kyZXrtrw/0sQg2+2Wxi8vXh6Ng/ow4yBdvzsedpC6X8aj4Zs8u+PQMn70dE899CD3WS8NTD0a/PxvzvYybEfwQfrdBkqjv//9wY/dQLYr4BeDD5L/r3Pwg/en8MduSaZBloUfZJP10sD88MfumUyDtA2GfwHkWSg08kzwY/dZtmN3WfgS51ovjQyFPnX1c7MNsiX4+V9vuzS8BA5+7NZknOS90IPstF0amhr62L2QdZJjgQc52m67NDQt8LE7kPmN98AfAY+cY7kUHsCX2b8FEzgAT4Om+ACGm/izGzaAlVZL4QGMN3PrcdAA3AJE8QHUm/odupABPGKxFB/A5VFFAthsrxQeQL258x8wgCeslcIDGG/2d3iDBbDRVik8gOGmv3obKoAeS6XwAL6YEVUjgLrfQqL4AA4EeApckACGPAaU4gN4IcQXD0MEcOgsG6XoAOprgkxyvCIhIoB0d10G+tpJ0wGMLrdOCg/g6VBfO2w2gP2eAEThAXy1JNgkzQVQ9+4nxQewKeCXTpoKYN/ZVknRAXx4XshJmgjg6xUWSdEBnFgWdpLMAdR/68uPZNWV9S2Xe0KfuqwPqHtlmi2SWVumQzf2UPjff9mbaZLtM+2QZmR4Mu7Qho4cBvlNlk++Zlkgzbk/9QdfN+TzwMEFaQc5+fAU66NZU1L9CFL95fx+cehAquP//pUe/EkIG5Ifunev78hxkPNSPH60Z4bFEciuZH/7/7I671ccNyb8+GHDbEsjnNqrjW8z3nhhES841jZ+8NazV022MQJb883pj9yR59cuLOyDpoUfneG2ox09Fzn85KL92m2ffOd3IkdOfHnkr68+/utru6cVfYf9oif6vlPj2DfH+9/b8dT9Ky88Z5ItAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEDL+DtToe4fZB61MwAAAABJRU5ErkJggg=='
          }
      );
      noty.onclick = function () {
        window.focus();
        this.close();
      };
      noty.onerror = function () {
          //
      };
      noty.onshow = function () {
        setInterval(() => {
          this.close();
        }, 4000);
      };
      noty.onclose = function () {
          //
      };
      return true;
}



  (function() {
  'use strict';
  document.body.addEventListener('click', copy, true);
  function copy(e) {
    var 
      t = e.target,
      c = t.dataset.copytarget,
      inp = (c ? document.querySelector(c) : null);
    if (inp && inp.select) {
      inp.select();
      try {
        document.execCommand('copy');
        inp.blur();
        t.classList.add('copied');
        setTimeout(function() { t.classList.remove('copied'); }, 1500);
      }
      catch (err) {
        inp.blur();
        t.classList.add('failure!');
        // i dont know if this works but it should.
        setTimeout(function() { t.classList.remove('failure!'); }, 1500);
      }
    }
  }
})();

document.getElementById('chatroom_title').innerHTML = 'ID: <b>' + chatroom + '</b>';
document.getElementById('sharethis').value = createShareLink();