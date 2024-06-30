# Pokemon Cards Web App

This is a simple project that I created with the intention of learning more about Vue as a front-end framework, and for practicing full-stack development in general. In addition to using [Vue.js](https://vuejs.org/) as the front-end,
I am using [Express](https://expressjs.com/) as the backend. I am currently using [MySQL](https://www.mysql.com/) as my database management system (running a server locally on my machine), but I plan to host a database somewhere, eventually.

## Set Up

1. Clone this repository.
2. Create a `.env` file in both the **back-end** and **front-end** folders.
    - Use the `.env.example` files as templates. You need to fill in the proper information for each of those variables.
3. In a terminal, navigate into the back-end folder: `cd back-end`
4. Then run the following command to install all dependencies: `npm install`
5. Go back up a directory (`cd ..`) and then cd into the front-end folder: `cd front-end`
6. Likewise, install all dependencies with the same command: `npm install`

## Run Servers

To run the back-end:

1. Navigate to the `back-end` folder in a terminal.
2. Run the following command: `node server.js`

To run the front-end:

1. Navigate to the `front-end` folder in a terminal.
2. Run the following command: `npm run serve`

From there, you should be able to access the front-end page - the default URL will be `https:\\localhost:8080`
