#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')
var TelegramClient = require('../clients/telegram-client')

var TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
var TELEGRAM_TOKEN1 = process.env.TELEGRAM_TOKEN1
var TELEGRAM_TEST_USER_0 = process.env.TELEGRAM_TEST_USER_0

if (!(TELEGRAM_TOKEN && TELEGRAM_TOKEN1)) {
  throw new Error('missing required environment auth variables')
}

var client = new TelegramClient({
  dbHost: process.env.MONGODB_HOST,
  dbName: 'test',
  debug: true
})

client.on('error', function (err) {
  // fail on unexpected errors
  throw new Error(err)
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

test('TelegramClient.getUser(username)', function (t) {
  client.getUser({
    username: client.username
  }, function (err, user) {
    t.notOk(err)
    t.equal(user._id.toString(), client.user._id.toString())
    t.end()
  })
})

test('TelegramClient.getUser(id)', function (t) {
  client.getUser({
    id: client.user.id
  }, function (err, user) {
    t.notOk(err)
    t.equal(user._id.toString(), client.user._id.toString())
    t.end()
  })
})

test('TelegramClient.getUser(_id)', function (t) {
  client.getUser({
    _id: client.user._id
  }, function (err, user) {
    t.notOk(err)
    t.equal(user._id.toString(), client.user._id.toString())
    t.end()
  })
})

test('TelegramClient.startUpdatesPoll', function (t) {
  client.startUpdatesPoll(null, function (err) {
    t.notOk(err)

    setTimeout(function () {
      client.stopUpdates(null, function (err) {
        t.notOk(err)
        t.end()
      })
    }, 200)
  })
})

test('TelegramClient.sendMessage', function (t) {
  var text = "shabba ranks " + new Date().toISOString()

  client.sendMessage({
    recipient: TELEGRAM_TEST_USER_0,
    text: text
  }, function (err, message) {
    t.notOk(err)
    t.ok(client.lastMessageSent)
    t.equal(client.lastMessageSent.id, message.id)

    client.getMessage({
      id: message.id
    }, function (err, doc) {
      t.notOk(err)
      t.equal(message.text, doc.text)
      t.equal(message.text, text)
      t.end()
    })
  })
})

test('TelegramClient.sendPhoto', function (t) {
  var url = 'https://stickers.snaps.photo/development/workaholics/1427490067014-0869ff53-592d-40eb-8700-d71587e3595e.png'
  var caption1 = 'first test'
  var caption2 = 'second test'

  // send photo by mediaURL
  client.sendPhoto({
    recipient: TELEGRAM_TEST_USER_0,
    mediaURL: url,
    caption: caption1
  }, function (err, message) {
    t.notOk(err)
    t.ok(client.lastMessageSent)
    t.equal(client.lastMessageSent.id, message.id)

    // ensure we can retrieve the message
    client.getMessage({
      id: message.id
    }, function (err) {
      t.notOk(err)
      t.ok(message.media.length)
      t.ok(message.defaultMedia)
      t.equal(message.caption, caption1)
      t.equal(message.defaultMedia.url, url)
      t.equal(message.defaultMedia.type, 'image')

      // send photo by mediaID
      client.sendPhoto({
        recipient: TELEGRAM_TEST_USER_0,
        mediaID: message.defaultMedia.id,
        caption: caption2
      }, function (err, msg) {
        t.notOk(err)
        t.ok(msg)
        t.ok(msg.media.length)
        t.ok(msg.defaultMedia)
        t.equal(msg.caption, caption2)
        t.equal(msg.defaultMedia.id, message.defaultMedia.id)
        t.end()
      })
    })
  })
})

test('TelegramClient.destroy', function (t) {
  client.destroy(function () {
    t.end()
  })
})
