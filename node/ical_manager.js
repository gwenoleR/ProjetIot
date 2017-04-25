let app = require('express')();
let server = require('http').Server(app);
let mysql = require('mysql');
let qs = require('querystring');
let io = require('socket.io')(server)

let ical = require('ical')

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


//manage user creation
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

//returns
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
        console.log(post);

        let rfID = getPromo(post.rfid);
        if (!rfID) res.send(404)
        else res.send(200)

    });
});


app.get('/addUser', function (req, res) {
    res.sendfile(__dirname + '/formulaire.html');
})


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

                    getIcal(response)
                    return response;
                } catch (e) {
                    console.log('404')
                    return null
                }
            }
        );


    } catch (e) {
        console.log(e)
        return "error"
    }
}


function getIcal(user) {
    let today = new Date();
    console.log(today);

    let icalDay = "<iframe id='cv_if5' src='http://cdn.instantcal.com/cvir.html?id=cv_nav5&file=http%3A%2F%2Fical.imerir.com%2F" + user.promotion + "&theme=BL&ccolor=%23ffffc0&dims=1&gtype=cv_daygrid&gcloseable=0&gnavigable=1&gperiod=day&itype=cv_simpleevent' allowTransparency=true scrolling='no' frameborder=0 height=600 width=250></iframe>"
    let icalWeek = "<iframe id='cv_if5' src='http://cdn.instantcal.com/cvir.html?id=cv_nav5&file=http%3A%2F%2Fical.imerir.com%2F" + user.promotion + "&theme=BL&ccolor=%23ffffc0&dims=1&gtype=cv_daygrid&gcloseable=0&gnavigable=1&gperiod=day7&itype=cv_simpleevent' allowTransparency=true scrolling='no' frameborder=0 height=600 width=800></iframe>"

    io.to('lobby').emit('render', icalDay, icalWeek)

}


io.on('connection', function (socket) {
    socket.join('lobby')
    socket.on('coucou', function () {
        console.log("Client connecté !")
    });

    socket.on('rfid', function (rfid) {
        getPromo(rfid+'A')
    })
});

