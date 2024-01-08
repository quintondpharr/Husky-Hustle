/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/**
 * Author: Quinton Pharr
 * Section: AB
 * Description: This file contains the server-side logic for the HuskyHustle application,
 * handling API requests, database interactions, and server configurations.
 */
'use strict';

const express = require('express');
const app = express();

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const multer = require('multer');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

let user = 'quinton';

app.post('/logout', logout);

/**
 * Logs the user out.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
function logout(req, res) {
  user = null;
  res.type('text');
  res.status(200).send('successfully logged out');
}

app.get('/checkLogin', checkLogin);

/**
 * Checks if a user is logged in.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
function checkLogin(req, res) {
  res.type('text');
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(400).send('User not logged in.');
  }
}

app.post('/login', login);

/**
 * Process login endpoint.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
async function login(req, res) {
  user = req.body.username;
  let password = req.body.password;

  res.type('text');

  if (!user || !password) {
    res.status(400).send('Missing username or password.');
    return;
  }

  try {
    const db = await getDBConnection();
    let qry = 'SELECT * FROM Users WHERE username = ? AND password = ?';
    let username = await db.get(qry, [user, password]);
    await db.close();

    if (!username) {
      res.status(400).send('Invalid username or password.');
    } else {
      res.status(200).send('success');
    }
  } catch (err) {
    sendServerError(res, err);
  }
}

// Process transaction endpoint
app.post('/process-transaction', processTransaction);

/**
 * Checks if a user is logged in before proceeding with the transaction.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {boolean} - True if a user is logged in, otherwise false.
 */
function checkUserLoggedIn(req, res) {
  if (!user) {
    res.type('text');
    res.status(400).send('User not logged in.');
    return false;
  }
  return true;
}

/**
 * Validates the transaction input.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {boolean} - True if the input is valid, otherwise false.
 */
function validateTransactionInput(req, res) {
  let productId = req.body.productId;
  if (!productId) {
    res.type('text');
    res.status(400).send('Missing product ID.');
    return false;
  } else {
    // req.productId = productId;
    return true;
  }
}

/**
 * Processes the transaction by inserting a new record into the database.
 * @param {Object} req - The request object containing price and productId.
 * @param {Object} res - The response object.
 */
async function processTransaction(req, res) {
  res.type('text');

  if (!checkUserLoggedIn(req, res) || !validateTransactionInput(req, res)) {
    // If either check fails, return early as the response has been handled.
    return;
  }

  let confirmationNumber = generateConfirmationNumber();
  try {
    const db = await getDBConnection();
    if (await checkIfProductSold(db, req.body.productId)) {
      res.status(400).send('Product already sold.');
      return;
    }
    let buyerId = await getBuyerId(db, user);
    let sellId = await getSellerId(db, req.body.productId);
    let price = await getPrice(db, req.body.productId);
    await insertTransaction(db, confirmationNumber, buyerId, sellId, req.body.productId, price);
    res.status(200).send(confirmationNumber);
  } catch (err) {
    sendServerError(res, err);
  }
}

/**
 * Checks if the product with the given ID has already been sold.
 * @param {Object} db - The SQLite database connection object.
 * @param {int} productId - The ID of the product to check.
 */
async function checkIfProductSold(db, productId) {
  let soldQuery = 'SELECT soldStatus FROM Products WHERE productId = ?';
  let soldStatus = await db.get(soldQuery, [productId]);
  return soldStatus && soldStatus.soldStatus === 1; // Return false if no sold status found
}

/**
 * Retrieves the price of the product with the given ID.
 * @param {Object} db - The SQLite database connection object.
 * @param {int} productId - The ID of the product to get the price of.
 */
async function getPrice(db, productId) {
  let priceQuery = 'SELECT price FROM Products WHERE productId = ?';
  let priceRow = await db.get(priceQuery, [productId]);
  return priceRow && priceRow.price; // Return undefined if no price found
}

/**
 * Retrieves the buyer's user ID based on the given username.
 * @param {Object} db - The SQLite database connection object.
 * @param {string} username - The username to look up the buyer's ID.
 */
async function getBuyerId(db, username) {
  let buyerIdQuery = 'SELECT userId FROM Users WHERE username = ?';
  let buyerRow = await db.get(buyerIdQuery, [username]);
  return buyerRow && buyerRow.userId; // Return undefined if no buyer found
}

/**
 * Retrieves the seller's user ID based on the product ID.
 * @param {Object} db - The SQLite database connection object.
 * @param {int} productId - The product ID to look up the seller's ID.
 */
async function getSellerId(db, productId) {
  let sellerQuery = 'SELECT sellerId FROM Products WHERE productId = ?';
  let sellerRow = await db.get(sellerQuery, [productId]);
  return sellerRow && sellerRow.sellerId; // Return undefined if no seller found
}

/**
 * Inserts a new transaction into the database and marks the product as sold.
 * @param {Object} db - The SQLite database connection object.
 * @param {string} confirmationNumber - The confirmation number for the transaction.
 * @param {int} buyerId - The buyer's user ID.
 * @param {int} sellId - The seller's user ID.
 * @param {int} productId - The ID of the product being sold.
 * @param {int} price - The price at which the product is sold.
 */
async function insertTransaction(db, confirmationNumber, buyerId, sellId, productId, price) {
  let transactionDate = new Date().toISOString(); // like what we did in yipper
  let insertQuery = 'INSERT INTO Transactions (confirmationNumber, buyerId, sellerId, productId, ' +
                    'transactionDate, price) VALUES (?, ?, ?, ?, ?, ?)';
  await db.run(
    insertQuery,
    [confirmationNumber, buyerId, sellId, productId, transactionDate, price]
  );
  await db.run('UPDATE Products SET soldStatus = 1 WHERE productId = ?', [productId]);
}

/**
 * Generates a confirmation number for a transaction.
 * @returns {string} - The confirmation number.
 */
function generateConfirmationNumber() {
  const RADIX = 36; // base 36
  const CONF_LENGTH = 7; // length of the random component of the confirmation number

  // Generate random component
  const randomComponent = Math.random()
    .toString(RADIX)
    .substring(2, 2 + CONF_LENGTH) // 2 + CONF_LENGTH to account for '0.' at the beginning
    .toUpperCase();

  // Get current timestamp and convert to base 36 to get the unique timestamp component
  const timestamp = Date.now()
    .toString(RADIX)
    .toUpperCase();

  // Combine timestamp with random component for the confirmation number.
  return 'CONF-' + timestamp + '-' + randomComponent;
}

app.get('/transactions', getPreviousTransactions);

/**
 * Retrieves the previous transactions for the logged in user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The previous transactions for the logged in user.
 */
async function getPreviousTransactions(req, res) {
  res.type('text');

  if (!checkUserLoggedIn(req, res)) {
    res.status(400).send('User not logged in.');
  }

  try {
    const db = await getDBConnection();

    let userQry = 'SELECT userId FROM Users WHERE username = ?';
    let userId = await db.get(userQry, user);
    if (!userId) {
      res.status(400).send('User not found.');
      return;
    }
    userId = userId.userId;

    let qry = 'SELECT DISTINCT * FROM Products, Transactions ' +
    'WHERE Transactions.productId = Products.productId AND buyerId = ?;';
    let transactions = await db.all(qry, userId);

    await db.close();

    if (!transactions) {
      res.status(400).send('No transactions found.');
    } else {
      res.status(200).json(transactions);
    }

  } catch (err) {
    sendServerError(res, err);
  }
}

app.get('/product/:id', getProduct);

/**
 * Retrieves the product with the given ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getProduct(req, res) {
  res.type('text');

  try {
    let productId = req.params.id;
    const db = await getDBConnection();
    let qry = 'SELECT * FROM Products WHERE productId = ?';
    let product = await db.get(qry, [productId]);
    await db.close();

    if (!product) {
      res.status(400).send('Product not found.');
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    sendServerError(res, err);
  }
}

// ************************ YI ZENG PART ************************

// Sign-Up EndPoint
app.post('/husky-hustle/sign-up-new-users', async (req, res) => {
  try {
    let userName = req.body.username;
    let password = req.body.password;
    let recPassword = req.body.recPassword;
    let email = req.body.email;
    if (userName && password && recPassword) {
      let db = await getDBConnection();
      createNewAccount(password, recPassword, res, email, db, userName);
    } else {
      res.status(400).type('text')
        .send("Missing Information in the form");
    }
  } catch (err) {
    res.status(500).type('text')
      .send('Internal Sever Error');
  }
});

/**
 * Create a new user in database, checking if the username is existed.
 * @param {Int16Array} password, password of current users
 * @param {Int16Array} recPassword, reconfirm password of current users
 * @param {Response} res, sending res back
 * @param {String} email, current email
 * @param {sqlite3.Database} db, databse
 * @param {*} userName, current username
 */
async function createNewAccount(password, recPassword, res, email, db, userName) {
  let results = await db.all('SELECT username FROM Users WHERE username = ? ', userName);
  if (results.length === 0) {
    if (password === recPassword) {
      let dbQuery = 'INSERT INTO Users(username,password,email) VALUES (?,?,?)';
      await db.all(dbQuery, [userName, password, email]);
      await db.close();
      res.type('text')
        .send("Your Account has been created !");
    } else {
      await db.close();
      res.status(400).type('text')
        .send("Passwords don't match ! Enter again !");
    }
  } else {
    res.status(400).type('text')
      .send("UserName has existed ! Please enter a different one !");
  }
}

// Display-All-Items endpoint
app.get('/husky-hustle/display-all-Items', async (req, res) => {
  try {// implement search bar here and filter
    let db = await getDBConnection();
    let category = req.query.filter;
    let searchContent = req.query.search;
    if (category) { // filter functionality
      filter(category, db, res);
    } else if (searchContent) {// search bar functionality
      let dbSearchQuery = 'SELECT productName, productImageUrl, price, productId FROM Products ' +
      'WHERE (productName LIKE ? OR productDescription LIKE ?) AND soldStatus = ?';
      let results = await db.all(dbSearchQuery, ["%" + searchContent + '%', "%" + searchContent + '%', 0]);
      await db.close();
      res.json(results);
    } else { // send all items back
      let dbQuery = "SELECT productName, productImageUrl, price, productId FROM PRODUCTS " +
      "WHERE soldStatus = ?";
      let results = await db.all(dbQuery, 0);
      await db.close();
      res.json(results);
    }
  } catch (err) {
    res.status(500).type('text')
      .send('Internal Server Error');
  }
});

/**
 * Filter items based on current category
 * @param {String} category, current category filter
 * @param {sqlite3.Database} db, database
 * @param {Response} res, response
 */
async function filter(category, db, res) {
  if (category !== 'category') {
    let dbQuery = 'SELECT productName, productImageUrl, price, productId FROM Products ' +
    'WHERE category = ? AND soldStatus = ?';
    let results = await db.all(dbQuery, category, 0);
    await db.close();
    res.json(results);
  } else if (category === 'category') {// choose category back to main-view
    let dbQuery = 'SELECT productName, productImageUrl, price, productId FROM Products ' +
    'WHERE soldStatus = ?';
    let results = await db.all(dbQuery, 0);
    await db.close();
    res.json(results);
  }
}

// Post items endpoint
app.post('/husky-hustle/postItems', (req, res) => {
  try {
    let name = req.body.name;
    let description = req.body.description;
    let price = req.body.price;
    let category = req.body.category;
    let imgLink = req.body.imgLink;
    if (name && description && price && category && imgLink) {
      if (category === "category") {
        res.status(400).type('text')
          .send('Choosing A Category!');
      } else {
        postItems(res, name, description, price, category, imgLink);
      }
    } else {
      res.status(400).type('text')
        .send('Missing Parameters!');
    }
  } catch (err) {
    res.status(500).type('text')
      .send('Internal Server Error');
  }
});

/**
 * Storing new items to database
 * @param {Response} res, a response
 * @param {String} name, current item name
 * @param {String} description, description for current item
 * @param {Int16Array} price , price for current items
 * @param {String} category , category of current item
 * @param {String} imgLink , img link posted by users
 */
async function postItems(res, name, description, price, category, imgLink) {
  let db = await getDBConnection();
  let sellerIdQuery = "SELECT userId FROM Users WHERE username = ?";
  let sellerId = await db.all(sellerIdQuery, user);
  let curUserId = parseInt(sellerId[0].userId);
  let dbQuery = "INSERT INTO Products(productName, productDescription, price, category, " +
  "soldStatus, productImageUrl, sellerId)" +
  "VALUES(?,?,?,?,?,?,?)";
  await db.all(dbQuery, [name, description, price, category, 0, imgLink, curUserId]);
  await db.close();
  res.type('text')
    .send('Success !');
}

/**
 * Providing all posted items for current user // Unfinished
 */
app.get('/husky-hustle/posted-items-curUser', async (req, res) => {
  try {
    let db = await getDBConnection();
    let curUser = await db.all("SELECT userId FROM Users WHERE username = ?", user);
    let curUserId = parseInt(curUser[0].userId);
    let dbQuery = 'SELECT productImageUrl, productDescription, price, productName FROM ' +
    'Products WHERE sellerId = ?';
    let postedItems = await db.all(dbQuery, curUserId);
    res.json(postedItems);
  } catch (err) {
    res.status(500).type('text')
      .send('Internal Server Error');
  }
});

/**
 * Sends a server error response. I know it said not to pass the res object but I wasn't sure how
 * else to do it.
 * @param {Object} res - The response object.
 * @param {Error} error - The error object.
 */
function sendServerError(res, error) {
  res.type('text');
  res.status(500).send(error); // Send a simple error message
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'HuskyHustleDb.db',
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);