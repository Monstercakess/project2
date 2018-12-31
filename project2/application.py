import os, datetime, json
from channel import Channel, ChannelEncoder
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from datetime import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []

@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html")

@socketio.on("add_channel")
def add_channel(data):
    if channel_exist(data["name"]):
        emit("error",{"message":"channel already exist"},broadcast=True)
    else:
        channel = {"name":data["name"], "messages":[]}
        channels.append(channel)
        emit("add_channel",channel,broadcast=True)

@socketio.on("load_channels")
def load_channels(data):
    emit('load_channels',channels,broadcast=True,room=request.sid)

@socketio.on("add_message")
def add_message(data):
    channel = channel_exist(data["channel"])
    if channel:
        message = {"text":data["message"],"username":data["username"],"datetime":str(datetime.now())}
        channel["messages"].append(message)
        emit("add_message",{"message":message,"channel":channel["name"]},broadcast=True)

@socketio.on("load_messages")
def load_messages(data):
    channel = channel_exist(data["channel"])
    if channel:
        emit("load_messages",channel["messages"],broadcast=True, room=request.sid)

def channel_exist(channel_name):
    for channel in channels:
        if channel["name"] == channel_name:
            return channel
    return False
