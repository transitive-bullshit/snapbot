#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')
var TelegramClient = require('../clients/telegram-client')

var TELEGRAM_USERNAME = process.env.TELEGRAM_USERNAME
var TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN

var HAS_AUTH = TELEGRAM_TOKEN && TELEGRAM_USERNAME

if (!HAS_AUTH || !) {
  throw new Error('missing required environment auth variables')
}

var MONGODB_HOST = process.env.MONGODB_HOST || 'localhost'
mongoose.connect(process.env.MONGODB)

var client = new TelegramClient()

test('Snapchat._getGoogleAuthToken', function (t) {
  var client = new Snapchat()

  client._getGoogleAuthToken(SNAPCHAT_GMAIL_EMAIL, SNAPCHAT_GMAIL_PASSWORD, function (err, result) {
    t.notOk(err)
    t.ok(result)
    t.equal(typeof result, 'string')
    t.end()
  })
})
