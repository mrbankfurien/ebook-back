const mysql = require('mysql') ;

require('dotenv').config() ;

const pool = mysql.createPool({

	connectionLimit : 2000, //process.env.CONECTION_LIMIT ,
	host            : 'localhost',//process.env.DB_HOST,
	user            : 'root',//process.env.DB_USER,
	password        : '',//process.env.DB_PASSWORD,
	database        : 'ebook' //process.env.DB_DATABASE

}) ;

module.exports = pool ;
