var mysql      = require('mysql');
var Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('The solution is: ', rows[0].solution);
// });

connection.queryAsync('SHOW DATABASES').then(
    function(result) {
        var rows = result[0];
        console.log("The databases in this mysql instance are: ", rows);
        return rows;
    }
).map(
    function(row) {
        return connection.queryAsync('SHOW TABLES FROM ' + row.Database)
    }
).then(
    function(mappedRows) {
        console.dir(mappedRows[0]); // each of the mappedRows is a `queryAsync` result. it's an array of [rows, fields]
        // console.log("These are all the tables from each database:");
        for (var i = 0; i < mappedRows.length; i++) {
            var mappedRow = mappedRows[i];
            console.log(mappedRow);
        }
    }
).finally(
    function() {
        connection.end();
    }
);

// Array mapping example
// var myArray = [10, 15, 20];
// var myMappedArray = myArray.map(function(item) {
//     return item * 10;
// });

// console.log(myArray, myMappedArray);

// This is NOT real code
// var mappedRows = rows.map(function(row) {
//     return connection.query("SHOW TABLES FROM " + row.Database);
// });