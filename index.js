module.exports = {
  clients: {
    TelegramClient: require('./clients/telegram-client'),
    SnapchatClient: require('./clients/snapchat-client')
  },
  bots: {
    TestBot: require('./bots/test-bot')
  }
}
