from flask import Blueprint
from .controller import ApplicationService

# print (__name__)
blueprint = Blueprint(__name__, __name__, url_prefix='')

blueprint.add_url_rule('/', view_func=ApplicationService().index)
blueprint.add_url_rule('/1', view_func=ApplicationService().mathtowerdef)
blueprint.add_url_rule('/2', view_func=ApplicationService().spinnygun)
blueprint.add_url_rule('/save', view_func=ApplicationService().save_application, methods=['POST'])
blueprint.add_url_rule('/submit', view_func=ApplicationService().submit_application, methods=['POST'])

