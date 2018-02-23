const Chat = require('../models/Chat');
var moment = require('moment');

/**
 * Create new chat URL and redirect
 */
exports.createNewChat = (req, res) => {
  let rand = () => {
    return Math.random().toString(32).substr(3);
  };
  let token = () => {
    return rand() + rand();
  };
  let url = '/chat/' + token();
  res.redirect(url);
};

/**
 * Remove chat by ID, with owner check eventually.
 */
exports.removeChatById = (req, res) => {
  let ok = true;
  let errors = [];
  let chatroom = '';
  if (req.params.id) {
    chatroom = req.params.id;
  } else {
    ok = false;
    req.flash('errors', { msg: 'There was not a chatroom with that ID.'});
  };
  if (ok) {
    Chat.remove({ 'chatroom' : chatroom }, function (err) {
      if(err) {
        req.flash('errors', { msg: err });
      } else {
        req.flash('errors', { msg: 'Your chat was deleted successfully.' });
      }
    });
  } else {
    res.json(ok);
  };
};

/**
 * The page for specifying a room to join.
 * Very strange this one.
 */
exports.joinChat = (req, res) => {
  let ok = true;
  res.render('join', { title: 'Join', status: ok });
}

/**
 * GET /chat
 * List all chat.
 */
exports.getChatById = (req, res) => {
  let ok = true;
  let chatroom = '';

  if (req.params.id) {
    chatroom = req.params.id;
  } else {
    ok = false;
  }

  if (ok) {
    let query = Chat.find({"chatroom":chatroom}).sort([['timestamp', 'descending']]);
    query.exec((err, posts) => {
      posts.sort(); 
      res.render('chat', { title: chatroom, chat: posts });
    });
  } else {
    req.flash('errors', { msg: 'That is not allowed.'});
  }
};

/**
 * Get Chatlog by ID from API
 */
exports.getChatLogById = (req, res) => {
  var ok = true;
  var laststamp = '';
  var chatroom = '';

  if (req.params.id) {
    chatroom = req.params.id;
  } else {
    ok = false;
  }

  if (req.query.timestamp) {
    laststamp = req.query.timestamp;
  }
  if (ok) {
    if(laststamp == '') {
      // there was no last timestamp
      var q = Chat.find({"chatroom":chatroom}).sort([['timestamp', 'descending']]);
      q.exec(function(err, posts) {
        posts.sort();
        res.json({ chats: posts });
      });
    } else {
      // there was a last timestamp
      var q = Chat.find({ "chatroom":chatroom,"timestamp":{ $gte:laststamp }});
      q.exec(function(err, posts) {
        posts.sort();
        res.json({ chats: posts });
      });
    }
  };
};

/**
 * POST /chat/:id
 * Insert to db...
 */
exports.postChatById = (req, res) => {

  // defactos
  var ok = true;
  var errors = [];
  var message = '';
  var username = '';
  var chatroom = '';
  var schatroom = '';
  var susername = '';
  var smessage = '';
  var date = new Date();
  var timestamp = date.getTime();
  var now = new moment();
  var time = now.format("HH:mm:ss");

  // conditionals
  if (req.params.id) {
    chatroom = req.params.id;
    schatroom = chatroom.replace(/(<([^>]+)>)/ig,"");
  } else {
    ok = false;
  }

  if (req.body.username) {
    username = req.body.username;
    susername = username.replace(/(<([^>]+)>)/ig,"");
  } else {
    ok = false;
  }

  if (req.body.message) {
    message = req.body.message;
    smessage = message.replace(/(<([^>]+)>)/ig,"");
  } else {
    ok = false;
  }

  if (chatroom === '' || username === '' || message === '') {
    ok = false;
  }

  if (ok) {
    //create db model
    var post = new Chat({"chatroom":schatroom,"date":date,"time":time,"timestamp":timestamp,"username":susername,"message":smessage});

    // attempt to save model
    post.save(function (err) {
      if (err) {
        res.status(200).json({
          status: 'false'
        });
      } else {
        res.status(200).json({
          status: 'true'
        });
      }
    });
  } else {
    res.status(200).json({
      status: 'false'
    });
  }
};