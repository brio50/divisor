# Developer

* Notes for installing dependencies needed to run the app locally with Flask.
* Notes for how to deploy application to Github Pages.

## Application Install

1. git
2. python 3.10 (+ PyCharm IDE)
3. [`Node.js`](https://www.jetbrains.com/help/pycharm/installing-and-removing-external-software-using-node-package-manager.html#ws_npm_yarn_configure_package_manager) / `npm`
   * Javascript Pacakge Manager - `npm`
   * Javascript Bundler - `webpack`

## Setup

1. `git clone`
2. `cd divisor` & `python -m venv venv` & `source venv/Scripts/activate`
3. `pip install -r requirements.txt`
4. `npm install`

## Deploy Flask

See `package.json` > `"scirpts"`, to be executed from root directory:
1. `npm run build`
2. `flask --app divisor run --debug`

## Deploy Github Pages

See `package.json` > `"scirpts"`, to be executed from root directory:
1. `npm run deploy`
   * `predeploy` builds the site and bundles it in the `./static/dist` folder
   * `deploy` pushes the contents of that folder to a new commit on the `gh-pages` branch

# References

## Random

* [`.gitignore` LF vs CLRF](https://www.aleksandrhovhannisyan.com/blog/crlf-vs-lf-normalizing-line-endings-in-git/)
* [`npm` github pages](https://www.learnhowtoprogram.com/intermediate-javascript/team-week/hosting-a-webpack-project-with-gh-pages)
* [`react` docs (deprecated)](https://legacy.reactjs.org/docs/rendering-elements.html)
* [Flask Application Factory](https://flask.palletsprojects.com/en/2.3.x/tutorial/factory/#the-application-factory)

## Inspiration

* [Flask-React-Boilerplate](https://github.com/IceWreck/Flask-React-Boilerplate/tree/master)
* [](https://www.learnhowtoprogram.com/intermediate-javascript/team-week/hosting-a-webpack-project-with-gh-pages)