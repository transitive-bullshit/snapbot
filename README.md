# Snapbot

### Cross-platform chatbots

Snapbot provides common infrastructure and abstractions for creating chatbots that work across multiple chat platforms.

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
  * Test

Future:
  * ChatBotManager
    * manages multiple chatbots
  * ChatBotState

### Usage

var client = new SnapchatClient()
var bot = new TestBot(client)

### Links

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Hubot](https://github.com/github/hubot)
- [Hubot Scripts](https://github.com/github/hubot-scripts)
- [Superscript](https://github.com/silentrob/superscript)

### License

MIT. Copyright (c) [Travis Fischer](https://github.com/fisch0920).
