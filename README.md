![Logoish](https://i.imgur.com/dnUjzg3.png)

[![GitHub issues](https://img.shields.io/github/issues/thejordanprice/chatrooms.svg)](https://github.com/thejordanprice/chatrooms/issues)
[![GitHub stars](https://img.shields.io/github/stars/thejordanprice/chatrooms.svg)](https://github.com/thejordanprice/chatrooms/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/thejordanprice/chatrooms.svg)](https://github.com/thejordanprice/chatrooms/network)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/thejordanprice/chatrooms/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/thejordanprice/chatrooms.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)

##### Description

A simple chat application with local, google, github single sign on; was a fork of sahat/hackathon-starter. Note: Since its currently usable and secure over HTTPS, I'm slowed down the dev on this project. It could still be very useful for things though.

The inspiration was to make a simple responsive chatroom application with ajax that had an infinite amount of chatrooms that could be easily created or destroyed at any time by any member of the party. When you're done, throw it away. Might as well; right? :squirrel:

### Demo

There is a demo running at [https://chatrooms.exploited.pro](https://chatrooms.exploited.pro).
    
### Getting it running...

*If you plan on hosting this publicly, do a reverse proxy with nginx and TLS.*

    sudo apt install mongodb
    npm install
    node app.js
    # it should be running.
    
#### To-Do
    
- [ ] Keep list of recent chats so someone doesn't lose one.
- [ ] Go through code and prune reduant and old techniques.
- [ ] Mobile service worker notifications.
- [ ] Strip tags of input now that we're returning links and stuff.
- [ ] Who's joined chat, in view.
- [x] Make image links turn into images.
- [x] Make youtube links display embeds.
- [ ] Fix mongoose promise warnings.
- [ ] Spiffy up the FAQ a little bit.
- [ ] Websockets who's typing.
- [ ] Websockets who's online.
- [ ] Websockets redo the whole app.

### Development

This should be straight forward to people that have done this before; this is a common MVC setup with mongoose, express, passport, and a few other pieces of middleware.

##### File Structure

    ./models/*             // mongoose models
    ./controllers/*        // for interacting with the models
    ./views/*              // bunch of pug files
    ./public/*             // where the css/js is
    ./app.js               // the main wrapper
    
I have no problem with pull requests on this, if you would like to help continue development; we could all benefit. :laugh: I only ask that you can please adhere to [this](https://github.com/thejordanprice/javascript) styleguide.

As I say with most of my projects; I'm not a butthead an will accept all PR's unless the code is very bad.

Thanks for reading and using my software.

#### Splash
![Screenshot 1](http://i.imgur.com/eG12nZX.png)

#### Login w/ Single Sign On
![Screenshot 2](http://i.imgur.com/gLnCcf2.png)

#### Chatrooms
![Screenshot 3](http://i.imgur.com/CDMVb9U.png)

#### Accounts
![Screenshot 4](http://i.imgur.com/ogeulED.png)
