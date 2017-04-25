from flask import Flask, request, render_template, make_response, send_from_directory
import stripe,json
import MySQLdb
from flask_cors import CORS, cross_origin
import RPi.GPIO as GPIO
import time

app = Flask(__name__)
CORS(app)

db = MySQLdb.connect(host="172.30.0.123",
                     user="root",
                     passwd="calendar_bdd",
                     db="ical")

cur = db.cursor()

#gpio16 red
#gpio26 other
GPIO.setmode(GPIO.BCM)

GPIO.setup(16, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(26, GPIO.OUT, initial=GPIO.LOW)

@app.route("/payment", methods=['POST'])
def payment():
	
    try:
        cur.execute("SELECT credit FROM user WHERE rfid=\'"+request.form['rfid']+"\'")

        for c in cur.fetchall():
            print c[0]

	#test nombre de credit
        if (c[0] - 5 < 0) :
	    #Si pas assez de sous LED Rouge
            GPIO.output(16, GPIO.HIGH)
            time.sleep(1)
            GPIO.output(16, GPIO.LOW)

            resp = make_response("Votre compte semble ne plus avoir assez de credit. Merci de le crediter.",403)
            return resp
           
        credit = c[0] - 5

	#on mets a jour le credit de l'user en lui enlevant les 5euros de la cantine
        cur.execute("UPDATE user SET credit="+str(credit)+" WHERE rfid=\'"+request.form['rfid']+"\'")
        cur.execute("SELECT credit FROM user where rfid=\'"+request.form['rfid']+"\'")
        for c in cur.fetchall():
            print c[0]

        resp = make_response(json.dumps({"credit" : c[0]}, 201))
        
	#led verte
        GPIO.output(26, GPIO.HIGH)
        time.sleep(1)
        GPIO.output(26, GPIO.LOW)
    except:
	#si erreur led Rouge
        resp = make_response("Error", 500)
        GPIO.output(16, GPIO.HIGH)
        time.sleep(1)
        GPIO.output(16, GPIO.LOW)

    return resp


if __name__ == "__main__":
    app.run(host='0.0.0.0')
