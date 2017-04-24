#Using the python image optimized to run on a raspberry (rpi-) at the latest version
FROM hypriot/rpi-python

LABEL Description="This image is a python image with all the requierements for Stripe" Vendor="Les 4 Fantastiques" Version="1.0"

# Add current directory of code to the /code directory on the container
ADD . /code

# Telling our container to use the /code directory as the default working directory
WORKDIR /code
RUN apt-get update
RUN apt-get install -y python-mysqldb

# Run the command required to install all dependencies for the python app
RUN pip install -r requirements.txt

# Run the python service inside the container
CMD ["python", "stripePy.py"]
