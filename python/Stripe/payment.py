from flask import Flask, request, render_template, make_response
import stripe,json
import MySQLdb
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

db = MySQLdb.connect(host="192.168.0.13",
                     user="root",
                     passwd="calendar_bdd",
                     db="ical")

cur = db.cursor()

@socketio.on('badge')
def handle_badge(message):
    print('badge pose : ' + message)

@socketio.on('my event')
def handle_my_custom_event(json):
    print('received json: ' + str(json))

@app.route("/payment", methods=['POST'])
def payment():

    emit('badge', {data: 'badge detect' + request.form['rfid']})

    try:
        cur.execute("SELECT credit FROM user WHERE rfid=\'"+request.form['rfid']+"\'")

        for c in cur.fetchall():
            print c[0]

        if (c[0] - 5 < 0) :
            resp = make_response("Votre compte semble ne plus avoir assez de credit. Merci de le crediter.",403)
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
    #app.run(host="0.0.0.0")
    socketio.run(app)
