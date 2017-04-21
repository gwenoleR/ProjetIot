let app = require('express')();
let server = require('http').Server(app);
let mysql = require('mysql');
let qs = require('querystring');

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


    body = '';
    post = null
    req.on('data', function (data) {
        body += data;
        if (body.length > 1e6)
            request.connection.destroy();
    });

    req.on('end', function () {
        post = qs.parse(body);
        console.log(post)
        try {
            getGroup(post.rfid);
            res.send(200)
        } catch (e) {
            console.log(e)
            res.send(404)
        }
    });


});


function getGroup(rfid) {
    response = null;

    try {

        sql_connection.query(
            "SELECT promotion " +
            "FROM user " +
            "WHERE rfid = ?;", rfid, function (error, results, fields) {
                if (error) throw error;
                response = results[0].promotion;
                console.log('The solution is: ', response);
            }
        );
        //sql_connection.end();
        return response;
    } catch (e) {
        console.log(e)
    }
}

