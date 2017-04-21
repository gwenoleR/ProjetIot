#!/usr/bin/python
import MySQLdb
import nxppy
import time

mifare = nxppy.Mifare()

 db = MySQLdb.connect(host="172.30.0.123",
                      user="root",
                      passwd="calendar_bdd",
                      db="ical")

# Print card UIDs as they are detected
while True:
    try:
        uid = mifare.select()
        print(uid)

         cur = db.cursor()

         cur.execute("SELECT * FROM user WHERE rfid = " + uid)

         for row in cur.fetchall():
             print row[0]

         db.close()


    except nxppy.SelectError:
        # SelectError is raised if no card is in the field.
        pass

    time.sleep(1)
