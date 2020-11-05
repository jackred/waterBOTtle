//-*- Mode: js2; js2-basic-offset: 2;  tab-width: 2; -*-
//This Source Code Form is subject to the terms of the MIT License.
//If a copy of the ML was not distributed with this
//file, You can obtain one at https://opensource.org/licenses/MIT

//author: JackRed <jackred@tuta.io>
'use strict';

const login = require('facebook-chat-api');
const config = require('./config.json');

const cmdArrays = { github: buildGithubURI };

// Create simple echo bot
login({ email: config.email, password: config.password }, (err, api) => {
  if (err) {
    console.error(err);
    return;
  }

  api.setOptions({ selfListen: true });

  api.listenMqtt((err, message) => {
    if (!('body' in message)) {
      return;
    }
    console.log(message);
    const cmdName = parseCommand(message.body);
    if (cmdName !== null) {
      let res = callFunction(message.body, cmdName);
      api.sendMessage(res, message.threadID);
    }
  });
});

function parseCommand(text) {
  let command = null;
  if (text.startsWith(config.prefix)) {
    const cmdToParse = text.split(' ')[0].replace(config.prefix, '');
    if (cmdToParse in cmdArrays) {
      command = cmdToParse;
    }
  }
  return command;
}

function buildGithubURI(text) {
  const baseURI = 'https://github.com/';
  const splitted = text.split(' ');
  const user = splitted[0];
  const repo = splitted.length > 1 ? splitted[1] : '';
  return baseURI + user + '/' + repo;
}

function callFunction(text, cmdName) {
  text = text.replace(config.prefix + cmdName, '').trim();
  return cmdArrays[cmdName](text);
}
