#!/usr/bin/fish

docker-compose up > /dev/pts/5  &  ;
python ./python/nfcCheck.py > /dev/pts/1 & ;
python ./python/Stripe/stripePy.py > /dev/pts/3 & ;
