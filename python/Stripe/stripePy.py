from flask import Flask, request
import stripe
app = Flask(__name__)

@app.route("/sendPayement", methods=['POST'])
def payement():
    stripe.api_key = "sk_test_Eg1a245Otded9ALwN9tNpdtl"

    print(request.form['stripeToken'])

    token = request.form['stripeToken']

    charge = stripe.Charge.create(
        amount=1000,
        currency="eur",
        description="Example charge",
        source=token
    )

    #redirect to gestionCompte.html
    return "Payment accepted"

if __name__ == "__main__":
    app.run()
