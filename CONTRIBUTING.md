# Developer

- Notes for installing dependencies needed to run the app locally with Flask.
- Notes for how to deploy application to Github Pages.

## Installation

- [`Node.js`](https://www.jetbrains.com/help/pycharm/installing-and-removing-external-software-using-node-package-manager.html#ws_npm_yarn_configure_package_manager) / `npm`

  - Javascript Pacakge Manager - `npm`
  - Javascript Bundler - `webpack`

- `git clone https://github.com/brio50/divisor.git`

- `npm install` - see `package.json`

## Local Development

```
npm start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

```
GIT_USER=brio50 USE_SSH=1 npm run deploy
```

[GitHub pages for hosting](https://create-react-app.dev/docs/deployment#github-pages), this command is a convenient way to build the website and push to the `gh-pages` branch.

### Gunicorn

~~
See [Issue #2](https://github.com/brio50/divisor/issues/2), render.com python web service:

1. Environment Variables > Key: `PYTHON_VERSION` > Value: `3.10.2`
2. Settings > Build Command: `pip install -r requirements.txt && npm install && npm run build`
3. Settings > Start Command: `gunicorn -w 4 -b 0.0.0.0 'divisor:create_app()'`

https://divisor.onrender.com is linked to this github repository and updated on git push.
~~

# References

At the start of this project I used Python, Flask, and Jinja2 to build a local web server and figured out how to embed React and Bootstrap to get the front-end of the website the way I wanted. After getting frustrated with that, I simply decided to go full Javascript and leveraged https://create-react-app.dev/ to re-build the tech stack from the ground up. The first attempt brought a lot of lessons learned, which made the second go much faster!

## First Attempt

- [`.gitignore` LF vs CLRF](https://www.aleksandrhovhannisyan.com/blog/crlf-vs-lf-normalizing-line-endings-in-git/)
- [`npm` github pages](https://www.learnhowtoprogram.com/intermediate-javascript/team-week/hosting-a-webpack-project-with-gh-pages)
- [`react` docs (deprecated)](https://legacy.reactjs.org/docs/rendering-elements.html)
- [Flask Application Factory](https://flask.palletsprojects.com/en/2.3.x/tutorial/factory/#the-application-factory)

## Second Attempt

- [**create-react-app**](https://github.com/facebook/create-react-app/tree/main)

## Inspiration

- [Flask-React-Boilerplate](https://github.com/IceWreck/Flask-React-Boilerplate/tree/master)
- [](https://www.learnhowtoprogram.com/intermediate-javascript/team-week/hosting-a-webpack-project-with-gh-pages)
