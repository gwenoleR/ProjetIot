from flask import Flask, request, render_template, make_response
import stripe,json
import MySQLdb
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

db = MySQLdb.connect(host="db",
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

@app.route("/getCredit/<string:name>", methods=['GET'])
def getCredit(name):
    cur.execute("SELECT credit FROM user WHERE name=\'"+name+"\'")

    for credit in cur.fetchall() :
        print credit[0]

    resp = make_response(json.dumps({"credit" : credit[0]}, 200))
    resp.mimetype = 'application/json'

    return resp



if __name__ == "__main__":
    app.run(host="0.0.0.0")