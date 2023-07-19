from flask import Flask, render_template, url_for


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, template_folder='templates', instance_relative_config=True)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('divisor.cfg', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # divisor home page(s)
    @app.route('/')
    def index(name=None):
        return render_template('index.html', name=name, version='0.0.0')

    # @app.route('/react/')
    # def react(name=None):
    #     return render_template('react.html', name=name)

    # @app.route('/python/',methods=('GET', 'POST'))
    # def python(name=None):
    #     return render_template('python.html', name=name)

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('error.html'), 404

    return app
