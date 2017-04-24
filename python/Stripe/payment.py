from flask import Flask, request, render_template, make_response, send_from_directory
import stripe,json
import MySQLdb
from flask.ext.socketio import SocketIO, send, emit
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_url_path='/home/pi/ProjetIot/node/cantine/')
CORS(app)
socketio = SocketIO(app)

db = MySQLdb.connect(host="192.168.0.13",
                     user="root",
                     passwd="calendar_bdd",
                     db="ical")

cur = db.cursor()


@socketio.on('my event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']})

@socketio.on('my broadcast event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)

@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

@app.route("/", methods=['GET'])
def index():
    return send_from_directory('/home/pi/ProjetIot/node/cantine/', 'index.html')

@app.route("/payment", methods=['POST'])
def payment():

    #socketio.emit('badge',json.dumps({'data': 'badge detect' + request.form['rfid']}))

    try:
        cur.execute("SELECT credit FROM user WHERE rfid=\'"+request.form['rfid']+"\'")

        for c in cur.fetchall():
            print c[0]

        if (c[0] - 5 < 0) :
            resp = make_response("Votre compte semble ne plus avoir assez de credit. Merci de le crediter.",403)
            return resp
            # return render_template('index.html',
            #                        title='Paiement cantine',
            #                        message="Votre compte semble ne plus avoir assez de credit. Merci de le crediter.")

        credit = c[0] - 5

        cur.execute("UPDATE user SET credit="+str(credit)+" WHERE rfid=\'"+request.form['rfid']+"\'")
        cur.execute("SELECT credit FROM user where rfid=\'"+request.form['rfid']+"\'")
        for c in cur.fetchall():
            print c[0]

        resp = make_response(json.dumps({"credit" : c[0]}, 201))
        # return render_template('success.html',
        #                        title='Paiement cantine',
        #                        credit=c[0]
        #                        )
    except:
        resp = make_response("Error", 500)

    return resp


if __name__ == "__main__":
    app.run(host='0.0.0.0')
    socketio.run(app)
