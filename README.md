# Pokemon Cards Web App

This is a simple project that I created with the intention of learning more about Vue as a front-end framework, and for practicing full-stack development in general. In addition to using [Vue.js](https://vuejs.org/) as the front-end (with [Nuxt](https://nuxt.com/)),
I am using [Express](https://expressjs.com/) as the backend. I am currently using [MySQL](https://www.mysql.com/) as my database management system (running a server locally on my machine), but I plan to host a database somewhere, eventually.

## Setup and Run

1. Clone this repository.
2. Create a `.env` file in both the **back-end** and **front-end** folders.
    - Use the `.env.example` files as templates. You need to fill in the proper information for each of those variables.
3. From the root of the repo, run `npm install`
4. After that finishes, run `npm run build`
    - This will install packages on the back-end and front-end as well as create a static build of the front-end
5. After that finishes, run `npm start`
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
# API
API_URL=http://localhost:3000

# Test Admin User
TEST_ADMIN_USERNAME=<your-desired-test-username>
TEST_ADMIN_PASSWORD=<your-desired-test-password>

# Characters to be printed when debugging the DOM in testing suite
DEBUG_PRINT_LIMIT=100000

# Turnstile validation secret key
ENABLE_TURNSTILE=false
NUXT_TURNSTILE_SECRET_KEY=<your-secret-key>
```

## Back-End `.env` File Template

```
# Back-end
PORT=3000

# Database
DB_HOST=127.0.0.1
DB_USER=username
DB_PASSWORD=password
DATABASE=database_name

# JSON Web Token
JWT_SECRET=<your_secret_key>
JWT_EXPIRES_IN=1d
```
