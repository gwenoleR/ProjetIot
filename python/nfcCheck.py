#!/usr/bin/python
import MySQLdb
import nxppy
import time

mifare = nxppy.Mifare()

# db = MySQLdb.connect(host="172.30.0.123:3306",
#                      user="root",
#                      passwd="calendar_bdd",
#                      db="ical")
#
# cur = db.cursor()
#
# cur.execute("SELECT * FROM user")
#
# for row in cur.fetchall():
#     print row[0]
#
# db.close()


# Print card UIDs as they are detected
while True:
    try:
        uid = mifare.select()
        print(uid)


    except nxppy.SelectError:
        # SelectError is raised if no card is in the field.
        pass

    time.sleep(1)
