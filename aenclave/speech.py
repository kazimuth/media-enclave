import os

from menclave.aenclave.models import Channel

def announce(string):
    pid = os.fork()
    if not pid:
        channel = Channel.default()
        controller = channel.controller()
        controller.pause()
        os.system('echo "'+string+'" | festival --tts')
        controller.unpause()
    return
