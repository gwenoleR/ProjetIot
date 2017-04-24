from flask import Flask, request
import stripe
import MySQLdb

app = Flask(__name__)

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
        db.close()
        return "OK"
    else :
        db.close()
        return "unknow credentials"


if __name__ == "__main__":
    app.run()
