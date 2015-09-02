#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')
var TelegramClient = require('../clients/telegram-client')

var TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
var TELEGRAM_TOKEN1 = process.env.TELEGRAM_TOKEN1

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

/*test('TelegramClient.getUser(username)', function (t) {
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
})*/

test('TelegramClient.startUpdatesPoll', function (t) {
  client.on('message', function (message) {
  })

  client.startUpdatesPoll(null, function (err) {
    t.notOk(err)
  })
})

test('TelegramClient.destroy', function (t) {
  client.destroy(function () {
    t.end()
  })
})
