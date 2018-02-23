const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    chatroom: String,
    date: Date,
    time: String,
    timestamp: Number,
    username: String,
    message: String,
  }
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;