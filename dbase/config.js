const mysql = require('mysql') ;
require('dotenv').config() ;

const pool = mysql.createPool({

	connectionLimit : 2000 ,
	host            : 'remotemysql.com',
	user            : 'HtHSBBMRXx',
	password        : '8jktfhQuA3',
	database        : 'HtHSBBMRXx'

}) ;

module.exports = pool ;
