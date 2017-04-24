#Using the node image optimized to run on a raspberry (rpi-) at the latest version
FROM hypriot/rpi-node:latest

LABEL Description="This image is a node.js image with all the node modules required for the icalManager project installed" Vendor="Les 4 Fantastiques" Version="1.0"

# Add current directory of code to the /code directory on the container
COPY . /code

# Telling our container to use the /code directory as the default working directory
WORKDIR /code

# Run the command required to install all dependencies for node.js
RUN npm install

# Run the node app ical_manager.js inside the container
CMD ["node", "ical_manager.js"]
