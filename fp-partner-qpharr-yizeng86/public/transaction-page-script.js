/*
 * Quinton Pharr
 * November 4th 2023
 * Donovan Kong, and Kathryn Koehler - Section AB
 *
 * This is the JavaScript file for the transaction page. It handles the functionality
 * of displaying the transactions on the page. It also checks if the user is logged in
 * and if not, redirects to the login page. If the user is logged in, it makes a request
 * to the inventory database and updates the page with the response data.
 */

'use strict';

(function() {

  window.addEventListener('load', init);

  /**
   * Initializes the transaction page by making a request to the inventory API and updating the page
   * with the response data.
   */
  function init() {
    // Check if the user is logged in and if not, redirect to the login page - plain text response
    fetch('/checkLogin')
      .then(statusCheck)
      .then(makeRequest)
      .catch(() => {
        window.location.href = '/login.html';
      });
  }

  /**
   * Makes a request to the inventory API and updates the page with the response data.
   */
  function makeRequest() {

    fetch('/transactions')
      .then(statusCheck)
      .then(res => res.json())
      .then(updatePage)
      .catch(handleError);
  }

  /**
   * Helper function that creates an image element for the transaction because my original
   * function was too long.
   * @param {object} transaction - The transaction object.
   * @returns {object} - The image element.
   */
  function createImageElement(transaction) {
    let productImg = gen('img');
    productImg.classList.add('product-img');
    productImg.src = transaction.productImageUrl;
    productImg.alt = transaction.productName;
    return productImg;
  }

  /**
   * Helper function that creates a text element for the transaction because my original
   * function was too long.
   * @param {string} className - The class name for the element.
   * @param {string} textContent - The text content for the element.
   * @returns {object} - The text element.
   */
  function createTextElement(className, textContent) {
    let element = gen('p');
    element.classList.add(className);
    element.textContent = textContent;
    return element;
  }

  /**
   * Creates an article element for the transaction.
   * @param {object} transaction - The transaction object.
   * @returns {object} - The article element.
   */
  function createTransactionArticle(transaction) {
    let transactionArticle = gen('article');
    transactionArticle.classList.add('transaction');

    transactionArticle.appendChild(createImageElement(transaction));
    transactionArticle.appendChild(createTextElement('product-name', transaction.productName));
    transactionArticle.appendChild(createTextElement(
      'transaction-description',
      `Description: ${transaction.productDescription}`
    ));
    transactionArticle.appendChild(createTextElement(
      'transaction-price',
      `Price: $${transaction.price}`
    ));
    transactionArticle.appendChild(createTextElement(
      'transaction-confirmation',
      `Transaction Confirmation: ${transaction.confirmationNumber}`
    ));
    transactionArticle.appendChild(createTextElement(
      'transaction-date',
      `Transaction date: ${new Date(transaction.transactionDate).toLocaleString()}`
    ));

    return transactionArticle;
  }

  /**
   * Updates the transaction page with the given data.
   * @param {object} data - The data to update the page with.
   */
  function updatePage(data) {
    let transactionList = id('transaction-list');
    transactionList.innerHTML = ''; // Clear any existing content
    data.forEach(transaction => {
      transactionList.appendChild(createTransactionArticle(transaction));
    });
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   * @throws {Error} - if the response is not ok
   *
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Displays an error message indicating that the attempt failed.
   */
  function handleError() {
    let errorMessage = gen('p');
    errorMessage.textContent = 'Product could not be added.';
    id('transaction-list').appendChild(errorMessage);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tag - HTML tag name for new DOM element.
   * @returns {object} - New DOM object for given HTML tag.
   */
  function gen(tag) {
    return document.createElement(tag);
  }
})();