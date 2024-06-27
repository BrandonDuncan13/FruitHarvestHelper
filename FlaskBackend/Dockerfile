FROM python:3.12.4

WORKDIR /flask-app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD [ "python3", "app.py" ]
