const express = require('express');
const app = express();
const PORT = 3000;
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const db_username = process.env.db_username;
const db_password = process.env.db_password;
const db_host = process.env.db_host;
const db_port = process.env.db_port;
const db_database_name = process.env.db_database_name;

// const client = new Client({
// 	user: {db_username},
// 	password: {db_password},
// 	host: {db_host},
// 	port: {db_port},
// 	database: {db_database_name}
// });
var pg = require('pg');
var conString = "postgres://postgres:z>UO:%0o@localhost:5432/suresolve";

var client = new pg.Client(conString);
try {
	client.connect();
	console.log('Connection Successful');
} catch (error) {
	console.log({error});
}

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
