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
    * createAccount

  * events:
    * TODO

ChatBot(client, state, opts)
  * start
  * stop

ChatBotServer

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
  * 
  * Mirror
  * Giphy
  * Eliza
  * Wolfram

Todo:
  * ChatBotManager
  * ChatBotState

var client = new SnapchatClient()
var state = new ChatBotState()

var bot = new TestBot(client, state)


### License

MIT. Copyright (c) [Travis Fischer](https://makesnaps.com).
