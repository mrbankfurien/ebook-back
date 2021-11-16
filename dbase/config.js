const mysql = require('mysql') ;

const pool = mysql.createPool({

	connectionLimit : 2000 ,
	host            : 'localhost',
	user            : 'root',
	password        : '',
	database        : 'ebook'

}) ;

module.exports = pool ;
