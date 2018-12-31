from json import JSONEncoder

class Channel():
    def __init__(self,name):
        self.name = name
        self.messages = []

    def add_message(message):
        messages.append(message)

class ChannelEncoder(JSONEncoder):
    def default(self,object):
        if isinstance(object,Channel):
            return object.__dict__
        else:
            return json.JSONEncoder.default(self,object)
