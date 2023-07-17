import os

from flask import Flask, render_template


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('divisor.cfg', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # divisor home page(s)
    @app.route('/')
    @app.route('/divisor')
    def divisor(name=None):
        return render_template('index.html', name=name)

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('error.html'), 404

    return app
