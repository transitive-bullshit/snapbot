# Snapbot

### Snaps chatbot platform

Snapbot provides common infrastructure and abstractions for creating chatbots that work across multiple chat platforms.

ChatClient
  * properties:
    * platform
    * username
    * user
    * friends
    * conversations

  * methods:
    * signIn
    * getUpdates
    * getUpdatesPoll
    * getUpdatesWebhook
    * getFriends
    * getConversations
    * getMe
    * sendMessage
    * sendPhoto
    * sendVideo
    * save
    * restore

  * events:
    * TODO

ChatBot(client, opts)
  * start
  * stop

ChatBotServer
  * listen(port) // webhooks

Models:
  * User
  * Conversation
  * Message
  * Blob/Media

Clients:
  * SnapchatClient
  * KikChatClient
  * TelegramClient

Bots:
  * Superscript
  * Mirror
  * Giphy
  * Eliza
  * Wolfram

Todo:
  * ChatBotManager
  * ChatBotState

var client = new SnapchatClient()

var bot = new TestBot(client)

### Links

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Hubot](https://github.com/github/hubot)
- [Hubot Scripts](https://github.com/github/hubot-scripts)
- [Superscript](https://github.com/silentrob/superscript)

### License

MIT. Copyright (c) [Snaps](https://makesnaps.com).
