#!/usr/bin/python
import nxppy
import time
import os
import requests

mifare = nxppy.Mifare()

url = "http://192.168.0.13:5000/payment"

# Print card UIDs as they are detected
while True:
    try:
        uid = mifare.select()
	rfid_str = uid.encode('utf-8')
        dataToSend = {"rfid": rfid_str}
	print(dataToSend)
        r = requests.post(url, data=dataToSend)
        print(r)
        print("Send")


    except nxppy.SelectError:
        # SelectError is raised if no card is in the field.
        pass

    time.sleep(1)
