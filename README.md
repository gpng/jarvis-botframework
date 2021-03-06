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

4. Install [Bot Framework Channel Emulator](https://docs.botframework.com/en-us/tools/bot-framework-emulator/)

5. Install [rasa NLU](https://rasa-nlu.readthedocs.io/en/latest/installation.html) with sklearn + MITIE (option 3)

6. Install and setup [MS SQL](https://www.microsoft.com/en-us/sql-server/sql-server-editions-express)

## Usage

### rasa NLU setup

All commands are run in rasa_nlu/

1. Create training data using [rasa-nlu-trainer](https://github.com/RasaHQ/rasa-nlu-trainer) or use current training data in rasa_nlu/data. 

2. Update config.json with training data name under "data"

3. Train a model using 
```
python -m rasa_nlu.train -c config.json
```
A new dir will be created called something like models/model_YYYYMMDD-HHMMSS

4. Run the python server with the trained model
```
python -m rasa_nlu.server -c config.json --server_model_dirs=./model_YYYYMMDD-HHMMSS
```

### SQL setup

1. Create a local or remote SQL server and edit dbConfig in app-rasa.js (TODO: bring DB config settings out of app-rasa.js)

2. Table used is tbl_dialog. Use script.sql to create table and insert sample self service steps

### chatbot setup

1. Run the restify server hosting the bot which listens to port 3978
```
node app-rasa.js
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

