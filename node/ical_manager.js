let app = require('express')();
let server = require('http').Server(app);
let mysql = require('mysql');
let qs = require('querystring');
let io = require('socket.io')(server);

let ical = require('ical');

let parameters = require('./params.json');
let groups = require('./groups.json');

//Lets launch the server!
console.log("Lancement du serveur...");
server.listen(80);
console.log("Serveur ok.");


//SQL connection
let sql_connection = mysql.createConnection({
    host: parameters.db.host,
    user: parameters.db.user,
    password: parameters.db.password,
    database: parameters.db.database
});

//Route by default. Also the page displayed to the client.
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/login', function (req, res) {
    res.sendfile(__dirname + '/html/loginCompte.html');
});

//manage user creation
app.post('/addUser', function (req, res) {
    body = '';
    post = null;
    req.on('data', function (data) {
        body += data;
        //if body is too fat, we'close the connection to avoid an overflow.
        if (body.length > 1e6)
            request.connection.destroy();
    });

    //We'll wait the end signal of the request to treat it's content.
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

//returns
app.post('/promo', function (req, res) {
    body = '';
    post = null
    req.on('data', function (data) {
        body += data;
        //same as above. Don't flood us !
        if (body.length > 1e6)
            request.connection.destroy();
    });

    //same as above.
    req.on('end', function () {
        post = qs.parse(body);
        console.log(post);
        let rfid = getPromo(post.rfid);
        console.log('getPRomo sent :' + rfid);
        res.send(rfid)
    });
});

//Route to add some users.
app.get('/addUser', function (req, res) {
    res.sendfile(__dirname + '/formulaire.html');
});


//returns the promotion of a given rfid
function getPromo(rfid) {
    response = null
    try {
        sql_connection.query(
            "SELECT promotion " +
            "FROM user " +
            "WHERE rfid = ?;", rfid, function (error, results, fields) {
                try {
                    response = {}
                    response.promotion = results[0].promotion;
                    console.log('The solution is: ', response);

                    getIcal(response);
                    return 200;
                } catch (e) {
                    console.log('Error : sending 404');
                    return 404;
                }
            }
        );
    } catch (e) {
        console.log("Error SQL !");
        return 404
    }
}

//Triggers the render event, and send the new calendar to the client
function getIcal(user) {
    let icalDay = "<iframe id='cv_if5' src='http://cdn.instantcal.com/cvir.html?id=cv_nav5&file=http%3A%2F%2Fical.imerir.com%2F" + user.promotion + "&theme=BL&ccolor=%23ffffc0&dims=1&gtype=cv_daygrid&gcloseable=0&gnavigable=1&gperiod=day&itype=cv_simpleevent' allowTransparency=true scrolling='no' frameborder=0 height=600 width=250></iframe>"
    let icalWeek = "<iframe id='cv_if5' src='http://cdn.instantcal.com/cvir.html?id=cv_nav5&file=http%3A%2F%2Fical.imerir.com%2F" + user.promotion + "&theme=BL&ccolor=%23ffffc0&dims=1&gtype=cv_daygrid&gcloseable=0&gnavigable=1&gperiod=day7&itype=cv_simpleevent' allowTransparency=true scrolling='no' frameborder=0 height=600 width=800></iframe>"
    io.to('lobby').emit('render', icalDay, icalWeek);
}

//websocket management. Just to check if a client is here, and assure that he's routed to the good room.
io.on('connection', function (socket) {
    socket.join('lobby');
    socket.on('coucou', function () {
        console.log("Client connecté !");
    });
});

