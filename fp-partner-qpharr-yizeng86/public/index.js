/**
 * Yi Zeng
 * DEC 8, 2023
 * Section AE
 * This main-view-script.js integrates the main functionality of this website,
 * including searchBar, filter, displaying all items.
 */
'use strict';
(function() {

  window.addEventListener('load', init);

  /**
   * Setting up all functionalities for users
   */
  function init() {
    id('products').classList.remove('hidden'); // clear all previous results
    id('error').textContent = '';
    id('toggle-items').addEventListener('click', toggleStyle);
    getAllItems();
    filter();
    searchBar();
    qs('h1').addEventListener('click', titleClicked);

    // Check if the user is logged in and if is, change the login button to logout
    fetch('/checkLogin')
      .then(statusCheck)
      .then(updateLoginButton)
      .catch(handleError);
  }

  /**
   * Handling error if there is any
   * @param {Error} error - representing the error message
   */
  function handleError() {
    // Do nothing if the user is not logged in
  }

  /**
   * Toggling the style of items
   */
  function toggleStyle() {
    let products = qsa('.product');
    id('products').classList.toggle('products-list');
    for (let i = 0; i < products.length; i++) {
      products[i].classList.toggle('product-list');
    }
  }

  /**
   * Updating the login button if the user is logged in
   * @param {Promise} res , representing the response of request
   */
  function updateLoginButton(res) {
    if (res) { // If a username is returned, the user is logged in
      let signInButton = id('sign-in-button');
      signInButton.textContent = 'Logout';
      signInButton.href = '#'; // Remove the link to login page
      signInButton.addEventListener('click', logout);
    }
  }

  /**
   * logging out the user
   * @param {Event} event - representing the event of clicking logout button
   */
  function logout(event) {
    event.preventDefault(); // Prevent default anchor behavior
    fetch('/logout', {method: 'POST'})
      .then(statusCheck)
      .then(() => {
        window.location.href = '/login.html'; // Redirect to login page after logout
      })
      .catch(errorHandling);
  }

  /**
   * Going back the main page if the title is clicked
   */
  function titleClicked() {
    let products = qsa('.product');
    for (let i = 0; i < products.length; i++) {
      products[i].classList.remove("hidden");
    }

    id('search-area').value = '';
  }

  /**
   * Fetching all items from server
   */
  function getAllItems() {
    fetch('/husky-hustle/display-all-Items')
      .then(statusCheck)
      .then(res => res.json())
      .then(populateBoard)
      .catch(errorHandling);
  }

  /**
   * Appending item to the board
   * @param {Promise} res , representing all information of items
   */
  function populateBoard(res) {

    for (let i = 0; i < res.length; i++) {
      let productName = res[i].productName;
      let price = res[i].price;
      let imgLink = res[i].productImageUrl;

      let productSec = gen('section');
      productSec.classList.add('product');
      productSec.id = res[i].productId;

      let name = gen('p');
      name.textContent = productName;
      let img = gen('img');
      img.src = imgLink;
      img.alt = productName;
      let productPrice = gen('p');
      productPrice.textContent = "$" + price;

      productSec.appendChild(img);
      productSec.appendChild(name);
      productSec.appendChild(productPrice);
      id('products').appendChild(productSec);
    }
  }

  /**
   * Allowing users to search relevant information from product name
   */
  function searchBar() {
    id('search-area').addEventListener('input', function() {
      id('search-button').addEventListener('click', searchClicked);
    });
  }

  /**
   * Getting relevant search information from users
   */
  function searchClicked() { // search the name
    let content = id('search-area').value.trim();
    fetch('/husky-hustle/display-all-Items?search=' + content)
      .then(statusCheck)
      .then(res => res.json())
      .then(displayFilterItems)
      .catch(errorHandling);
  }

  /**
   * Displaying items based off current category
   */
  function filter() {
    let dropDown = id('item-categories');
    dropDown.addEventListener('change', function(event) {
      let curOption = event.target.value;
      getFilterItems(curOption);
    });
  }

  /**
   * Getting all items of current category from database
   * @param {String} curOption , showing the current category users choose
   */
  function getFilterItems(curOption) {
    fetch('/husky-hustle/display-all-Items?filter=' + curOption)
      .then(statusCheck)
      .then(res => res.json())
      .then(displayFilterItems)
      .catch(errorHandling);
  }

  /**
   * Displaying information of items under current category
   * @param {Promise} res, all items information under current category
   */
  function displayFilterItems(res) {
    let products = qsa('.product');
    for (let i = 0; i < products.length; i++) {
      products[i].classList.add("hidden");
    }

    let filterProducts = res.length;
    for (let j = 0; j < filterProducts; j++) {
      id(res[j].productId).classList.remove('hidden');
    }
  }

  /**
   * Displaying error message
   * @param {Promise} res , results of request
   */
  function errorHandling(res) {
    id('products').classList.add('hidden');
    id('error').textContent = res;
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
   * create a new node
   * @param {HTMLElement} tagName the new tag
   * @return {HTMLElement}a new node
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   * @throws {Error} - if the response is not ok
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Getting elements with certain tagname
   * @param {HTMLElement} tagName, a tag from HTML file
   * @returns {HTMLElement} an element array with this tagname
   */
  function qsa(tagName) {
    return document.querySelectorAll(tagName);
  }

  /**
   * Getting a element with certain tagname
   * @param {HTMLElement} tagName, a tag from HTML file
   * @returns {HTMLElement} the element with this tagname
   */
  function qs(tagName) {
    return document.querySelector(tagName);
  }
})();