let app = require('express')();
let server = require('http').Server(app);
let mysql = require('mysql');


let parameters = require('./params.json')
let groups = require('./groups.json');


server.listen(80);


//SQL connection

let sql_connection = mysql.createConnection({
    host: parameters.db.host,
    user: parameters.db.user,
    password: parameters.db.password,
    database: parameters.db.database
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.post('/promo', function (req, res) {
    console.log(req)
    res.send("Succesfully caught your post baby !")
})

app.get('/coucou', function (req, res) {



    res.send("cucou");
});


function getGroup(rfid) {
    sql_connection.connect();
    sql_connection.query(
        "SELECT promotion " +
        "FROM user " +
        "WHERE rfid = ?;", rfid, function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results[0].promotion)
        }
    );
    sql_connection.end()
}

getGroup(2563)