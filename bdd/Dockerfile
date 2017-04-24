#Using the mysql image optimized to run on a raspberry (rpi-) at the latest version
FROM hypriot/rpi-mysql:latest

LABEL Description="This image is a mysql image for the icalManager project" Vendor="Les 4 Fantastiques" Version="1.0"

#Add /data directory to the /var/lib/mysql directory on the container
ADD ./data /var/lib/mysql

