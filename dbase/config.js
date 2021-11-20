const mysql = require('mysql') ;
require('dotenv').config() ;

const pool = mysql.createPool({

	connectionLimit : 2000  , //process.env.CONECTION_LIMIT ,
	host            : 'remotemysql.com', //process.env.DB_HOST,
	user            : 'KjD0POOtsV', //process.env.DB_USER,
	password        : 'jLepNLSQ20', //process.env.DB_PASSWORD,
	database        : 'KjD0POOtsV' //process.env.DB_DATABASE

}) ;

module.exports = pool ;
