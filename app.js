//-*- Mode: js2; js2-basic-offset: 2;  tab-width: 2; -*-
//This Source Code Form is subject to the terms of the MIT License.
//If a copy of the ML was not distributed with this
//file, You can obtain one at https://opensource.org/licenses/MIT

//author: JackRed <jackred@tuta.io>
'use strict';

const login = require('facebook-chat-api');
const config = require('./config.json');

// Create simple echo bot
login({ email: config.email, password: config.password }, (err, api) => {
  if (err) {
    console.error(err);
    return;
  }

  api.listenMqtt((err, message) => {
    console.log(message);
    api.sendMessage('Vous avez dit: ' + message.body, message.threadID);
  });
});
