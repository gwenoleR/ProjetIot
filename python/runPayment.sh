#!/bin/bash

python ./nfcPayment.py &
python ./Stripe/payment.py &

