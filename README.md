# Pokemon Cards Web App

This is a simple project that I created with the intention of learning more about Vue as a front-end framework, and for practicing full-stack development in general. In addition to using [Vue.js](https://vuejs.org/) as the front-end (with [Nuxt](https://nuxt.com/)),
I am using [Express](https://expressjs.com/) as the backend. I am currently using [MySQL](https://www.mysql.com/) as my database management system.

Additionally, I wanted to use this project as an opportunity to get better at writing tests. On both the back-end and front-end, I have written unit tests using the framework [Vitest](https://vitest.dev/). I have also written end-to-end tests with the library [Playwright](https://playwright.dev/).

## Setup and Run

1. Clone this repository.
2. Create a `.env` file in both the **back-end** and **front-end** folders.
    - Use the `.env.example` files as templates. You need to fill in the proper information for each of those variables.
3. From the root of the repo, run `npm run build`
    - This will install packages on the back-end and front-end as well as create a static build of the front-end
4. After that finishes, run `npm start`
    - This will start up the back-end server, which will serve the static Nuxt front-end.

From there, you should be able to access the front-end page - the default URL will be `https:\\localhost:3000`

You will need to have a MySQL database to connect to in order for this web application to work. You can create a fresh database in MySQL somewhere (whether that be your local machine or in some cloud space), and then you can use the table definitions and test values in the file `DDL.sql` to get your database up and running such that it is compatible with this application.

## Run Unit Tests

There are unit tests on the back-end and unit/component tests on the front-end of this application.

To run the back-end tests:

1. Navigate to the `back-end` folder in a terminal.
2. Run the following command: `npm test`

To run the front-end tests:

1. Navigate to the `front-end` folder in a terminal.
2. Run the following command: `npm test`

## Run Playwright Tests

After installing all the packages on the front-end (of which Playwright is one), you can install the browsers necessary for Playwright testing by running the command:

```
npx playwright install
```

You can also view which browsers are installed on your device by running:

```
npx playwright install --list
```

## Front-End `.env` File Template

```
# This site
BASE_URL=http://localhost:3000

# Test Admin User
TEST_ADMIN_USERNAME=<your-desired-test-username>
TEST_ADMIN_PASSWORD=<your-desired-test-password>

# Characters to be printed when debugging the DOM in testing suite
DEBUG_PRINT_LIMIT=100000

# Turnstile validation secret key
ENABLE_TURNSTILE=false
NUXT_TURNSTILE_SECRET_KEY=<your-secret-key-same-as-backend>
```

## Back-End `.env` File Template

```
# This would be set to "production" on a production deployment
ENVIRONMENT="local"

# Back-end
PORT=3000

# Database
DB_HOST=127.0.0.1
DB_USER=<your-admin-username>
DB_PASSWORD=<your-admin-password>
DATABASE=<your-database-name>

# JSON Web Token
JWT_SECRET=<your-JWT-secret>
JWT_EXPIRES_IN=1d

# Turnstile
TURNSTILE_API_URL=https://challenges.cloudflare.com/turnstile/v0/siteverify
ALLOWED_TURNSTILE_HOSTS=localhost,127.0.0.1,exampledomain.azurewebsites.net
NUXT_TURNSTILE_SECRET_KEY=<your-secret-key-same-as-frontend>
```

## Deployment Example - Azure

### Manual Deployment

I was able to deploy manually to Azure by doing the following:

1. Create an [Azure Database for MySQL](https://azure.microsoft.com/en-us/products/mysql) instance, connect to it via an IDE (I used [MySQL Workbench](https://www.mysql.com/products/workbench/)), then run the `DDL.sql` script to initialize the database and tables.

2. Create an [App Service](https://azure.microsoft.com/en-us/products/app-service) instance and fill out the necessary Environment Variables (the same ones you use in your two local `.env` files).

3. In the App Service's Overview, find the Outbound IP addresses and add these to the Azure Database's Firewall rules.

4. Add the [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups) extension to Visual Studio code. After signing in, right-click your App Service and click deploy to Deploy to Web App.

5. After deployment completes, Azure's Oryx system will build the application (i.e. it will run `npm run build`). After this is complete, Azure will start the app by running `npm start`. You can view deployment status via the Deployment Center on your App Service in the Azure Portal.

## CI / CD Deployment
