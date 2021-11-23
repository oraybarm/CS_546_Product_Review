const settings = require("./settings.json");
const mongoClient = require("mongodb").MongoClient;

const { serverUrl, dbName } = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = {
  connecttoDB: async function () {
    if (!_connection) {
      _connection = await mongoClient.connect(serverUrl);
      _db = await _connection.db(dbName);
    }

    return _db;
  },
  closeConnection: function () {
    if (_connection) {
      _connection.close();
    }
  },
};
