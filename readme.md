# Websender.js

## Installation
npm
```bash
$ npm install websender
```
yarn
```bash
$ yarn add websender
```

## Usage

```js
const WebsenderAPI = require('websender');

const websender = new WebsenderAPI("localhost", "pass", "9876");

websender.connect().then(() => {
    console.log('Websender Connected');
    websender.sendCommand('say Hello World');
}).catch(err => console.log(err))
```

## Minecraft Plugin
[Websender](https://www.spigotmc.org/resources/websender-send-command-with-php-bungee-and-bukkit-support.33909/)

## Contributors
made by GPT-4 and cactusdev