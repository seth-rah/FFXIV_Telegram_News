# FFXIV_Telegram_News
A bot for telegram messenger that posts news updates for Final Fantasy XIV posted to the Lodestone

## What is this?

This is a hobby project to monitor updates in the news sections of [FFXIV Lodestone](https://eu.finalfantasyxiv.com/lodestone/) and then post it to a group chat or channel in [Telegram Messenger](https://telegram.org/)

## How to Run

Multiple -e entries for various environments. environment variables listed further down.

```
docker run -d -e TELEGRAM_BOT_TOKEN=secret1 -e TELEGRAM_CHAT_ID=secret2 sethrah/ffxivtelegramnews
```

### Docker Compose
For fast setup, download the docker-compose.yml file and use docker-compose to manage the container a bit easier.

```
curl -o https://raw.githubusercontent.com/seth-rah/FFXIV_Telegram_News/master/docker-compose.yml
```

Relpace environment variables as needed and run `docker-compose up -d` once completed.

## Environment Variables
### Telegram

[Set up a telegram bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot) and get the `Bot Token`. Then add the bot to a group, make it admin and [extract the Chat ID](https://stackoverflow.com/a/32572159/882223).

```
Telegram Bot Token              = TELEGRAM_BOT_TOKEN
Telegram Chat ID                = TELEGRAM_CHAT_ID
```

## Plans

None at this time.

## Contribution

Please let me know through an issue or pull request.

