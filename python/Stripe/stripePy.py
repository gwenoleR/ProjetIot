from flask import Flask, request
import stripe
import MySQLdb
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

db = MySQLdb.connect(host="docker-pi.local",
                     user="root",
                     passwd="calendar_bdd",
                     db="ical")

cur = db.cursor()

@app.route("/sendPayement", methods=['POST'])
def payement():
    stripe.api_key = "sk_test_Eg1a245Otded9ALwN9tNpdtl"

    token = request.form['stripeToken']
    amount = int(request.form['amount'])*100
    print(int(request.form['amount'])*100)

    charge = stripe.Charge.create(
        amount=amount,
        currency="eur",
        description="Payement cantine",
        source=token
    )
    #redirect to gestionCompte.html
    return "Payment accepted"

@app.route("/login", methods=['POST'])
def login():

    print(request.form['name'])
    print(request.form['password'])

    cur.execute("SELECT name, password FROM user WHERE name=\'"+request.form['name']+"\' AND password =\'" + request.form['password']+"\'")

    if (len(cur.fetchall()) > 0) :
        return "OK"
    else :
        return "unknow credentials"

#@app.route("/creditCompte", methods=['POST'])
#def creditCompte():



if __name__ == "__main__":
    app.run(host="0.0.0.0")
