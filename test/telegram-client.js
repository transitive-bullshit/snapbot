#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')
var TelegramClient = require('../clients/telegram-client')

var TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN

if (!TELEGRAM_TOKEN) {
  throw new Error('missing required environment auth variables')
}

var client = new TelegramClient({
  dbHost: process.env.MONGODB_HOST,
  dbName: 'test',
  debug: true
})

test('TelegramClient.signIn', function (t) {
  t.equal(client.platform, 'telegram')
  t.notOk(client.isSignedIn)

  client.signIn({
    token: TELEGRAM_TOKEN
  }, function (err) {
    t.notOk(err)
    t.ok(client.isSignedIn)
    t.equal(client.username, 'SnapsTest0Bot')
    t.ok(client.user)
    t.ok(client.user._id)
    t.equal(client.user.id, TELEGRAM_TOKEN.split(':')[0])
    t.end()
  })
})
