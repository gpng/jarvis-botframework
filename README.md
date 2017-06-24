# JARV.IS Chat Bot

Proof of concept chatbot with FAQ and helpdesk functions

## Installation
1. Clone this repo

2. Install NodeJS with NPM
```
sudo apt-get install nodejs
```
3. Install dependancies
Using package.json:
```
npm install
```

Alternatively:
```
npm install --save restify botbuilder request mssql 
```

3. Install [Bot Framework Channel Emulator](https://docs.botframework.com/en-us/tools/bot-framework-emulator/)

4. Install [rasa_nlu](https://rasa-nlu.readthedocs.io/en/latest/installation.html) with sklearn + MITIE (option 3)

5. Install and setup [MS SQL](https://www.microsoft.com/en-us/sql-server/sql-server-editions-express)

## Usage

1. Run the restify server hosting the bot which listens to port 3978
```
node app.js
```
2. Start the Bot Framework Channel Emulator and use endpoint URL `http://localhost:3978/api/messages` with no App ID or Password
3. Connect and start chatting

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## Credits

TODO: Write credits

## License

TODO: Write license

