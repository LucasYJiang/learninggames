__author__ = 'Isaac Jiang'

from gameServer import iinsapp

import eventlet
from gunicorn.workers import geventlet
from gunicorn.app.base import BaseApplication

class GunicornApp(BaseApplication):

    def __init__(self, app, options=None):
        self.options = options or {}
        self.application = app
        super(GunicornApp, self).__init__()

    def load_config(self):
        config = dict([(key, value) for key, value in self.options.items()
                       if key in self.cfg.settings and value is not None])
        for key, value in config.items():
            self.cfg.set(key.lower(), value)

    def load(self):
        return self.application

if __name__ == "__main__":
    GunicornApp(iinsapp,{'bind': '%s:%s' % ('0.0.0.0', '6001'),'workers': 1,"worker_class":'eventlet'}).run()
    # socketio.run(netvisapp, host='localhost', port=5101, debug=True,use_reloader=True)


