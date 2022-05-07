const mysql = require('mysql2');
const util = require('util');

const connection = mysql.createConnection(
    {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'Murphy21',
      database: 'management_db'
    },
    console.log(`Connected to the management_db database.`)
);

connection.query = util.promisify(connection.query);

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;