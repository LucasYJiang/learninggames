from . import models
from flask import json, render_template, request


class ApplicationService():
    def __init__(self):
        self.model = models


    def index(self):
        return render_template('gravity.html')

    def spinnygun(self):
        return render_template('spinnygun.html')

    def mathtowerdef(self):
        return render_template('mathtowerdef.html')

    def settings(self):
        return render_template('settings.html')


    def get_application_list(self):
        # print(request.args)
        results = self.model.ApplicationModel().get_application_list()
        return "er"

    def save_application(self):
        application = json.loads(request.data)
        print(application)
        application['status'] = 'save'
        results = self.model.ApplicationModel().save_application(application)

        return json.dumps(results)

    def submit_application(self):
        application = json.loads(request.data)
        print(application)
        application['status'] = 'submit'
        results = self.model.ApplicationModel().submit_application(application)
        return json.dumps(results)
