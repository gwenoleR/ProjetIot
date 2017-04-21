#!/usr/bin/python
import nxppy
import time
import os
import json
import requests

mifare = nxppy.Mifare()


# Print card UIDs as they are detected
while True:
    try:
        uid = mifare.select()
        dataToSend = {"rfid": uid}
        r = requests.post("http://172.30.0.221/promo/", dataToSend)
        print(json.dumps(dataToSend))

    except nxppy.SelectError:
        # SelectError is raised if no card is in the field.
        pass

    time.sleep(1)
