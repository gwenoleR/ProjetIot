from flask import Flask, request, render_template, make_response
import stripe,json
import MySQLdb
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

db = MySQLdb.connect(host="192.168.0.13",
                     user="root",
                     passwd="calendar_bdd",
                     db="ical")

cur = db.cursor()


@app.route("/payment", methods=['POST'])
def payment():
    cur.execute("SELECT credit FROM user WHERE rfid=\'"+request.form['rfid']+"\'")
    c = cur.fetchall()

    credit = c[0] - 5

    cur.execute("UPDATE user SET credit="+str(credit)+" WHERE rfid=\'"+request.form['rfid']+"\'")

    resp = make_response("OK", 201)

    return resp


if __name__ == "__main__":
    app.run(host="0.0.0.0")
