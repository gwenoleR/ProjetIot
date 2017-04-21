let app = require('express')();
let server = require('http').Server(app);
let mysql = require('mysql');
let qs = require('querystring');

let parameters = require('./params.json')
let groups = require('./groups.json');

console.log("Lancement du serveur...")
server.listen(80);
console.log("Serveur ok.")

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


app.post('/addUser', function (req, res) {
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
            sql_connection.query(
                "INSERT INTO user (id, name, rfid, promotion) VALUES (NULL,?,?,?)", [post.name, post.rfid, post.promo], function (error, results, fields) {
                    if (error) throw error;
                })
            res.send(200)
        } catch (e) {
            console.log(e)
            res.send(500)
        }
    });


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

                response = results[0].promotion;
                console.log('The solution is: ', response);
            }
        );
        //sql_connection.end();
        return response;
    } catch (e) {
        response = "User non existant";

        console.log(e)
        return response
    }
}

/*function getICal(promo) {
    return groups.
}*/