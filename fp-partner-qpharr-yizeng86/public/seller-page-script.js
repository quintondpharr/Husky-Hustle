/**
 * Yi Zeng
 * DEC 8, 2023
 * Section AE
 * This seller-page-script.js allows sellers to post their items
 */
"use strict";
(function() {

  window.addEventListener('load', init);

  /**
   * Initialize all functionality
   */
  function init() {
    fetch('/checkLogin')
      .then(statusCheck)
      .then(getPostedItems)
      .then(addItems)
      .catch(() => {
        window.location.href = '/login.html';
      });
  }

  /**
   * Get posted items for current user
   */
  function getPostedItems() {
    fetch('/husky-hustle/posted-items-curUser')
      .then(statusCheck)
      .then(res => res.json())
      .then(appendPostedItems)
      .catch(errorHandling);
  }

  /**
   * Append all posted items to seller page for current user
   * @param {Promise} res , information of posted items for current user
   */
  function appendPostedItems(res) {
    for (let i = 0; i < res.length; i++) {
      let name = res[i].productName;
      let description = res[i].productDescription;
      let price = res[i].price;
      let img = res[i].productImageUrl;
      appendNewItem(name, description, price, img);
    }
  }

  /**
   * Allow sellers to post new items to the page
   */
  function addItems() {
    id('add-items-form').addEventListener('submit', function(event) {
      event.preventDefault();
      let name = id('item-name-input').value;
      let description = id('item-description-input').value;
      let img = id('item-file-input').value;
      let price = id('item-price-input').value;
      let category = id('item-categories').value;
      uploadDataDB(name, description, price, category, img);
    });
  }

  /**
   * Update information of new item to the database
   * @param {String} name, represents the name of this new item
   * @param {String} description, represents the description of this new item
   * @param {Float32Array} price, represents the price of this new item
   * @param {String} category, represents the category of this new item
   * @param {Sting} img, represents the imgLink of this new item
   */
  function uploadDataDB(name, description, price, category, img) {
    let data = new FormData();
    data.append('name', name);
    data.append('imgLink', img);
    data.append('description', description);
    data.append('price', price);
    data.append('category', category);
    fetch('/husky-hustle/postItems', {method: "POST", body: data})
      .then(statusCheck)
      .then(res => res.text())
      .then(showResults)
      .then(() => {
        appendNewItem(name, description, price, img);
        clearInput();
      })
      .catch(errorHandling);
  }

  /**
   * Clear all the input value in the form
   */
  function clearInput() {
    id('item-name-input').value = '';
    id('item-description-input').value = '';
    id('item-file-input').value = '';
    id('item-price-input').value = '';
    id("item-categories").selectedIndex = 0;
  }

  /**
   * Display the results from server
   * @param {Promise} res, a promise from server to show if posting
   * new items successful or not
   */
  function showResults(res) {
    id('status').textContent = 'Status: ' + res;
    setTimeout(() => {
      id('status').textContent = ''; // delete the results
    }, 10000);
  }

  /**
   * Displaying error message
   * @param {Promise} res, a promise from server to show if posting
   * new items successful or not
   */
  function errorHandling(res) {
    id('error').textContent = res;
    setTimeout(() => {
      id('error').textContent = ''; // delete the results
    }, 5000);
  }

  /**
   * Append new item information to the seller board
   * @param {String} name, represents the name of this new item
   * @param {String} description, represents the description of this new item
   * @param {Float32Array} price, represents the price of this new item
   * @param {String} img, represents the category of this new item
   */
  function appendNewItem(name, description, price, img) {
    let newProSec = gen('section');
    newProSec.classList.add('product');

    let nameTag = gen('p');
    nameTag.textContent = name;
    let imgPart = gen('img');
    imgPart.src = img;
    imgPart.alt = name;
    let descriptionTag = gen('p');
    descriptionTag.textContent = "Item Description: " + description;
    let priceTag = gen('p');
    priceTag.textContent = "Item Price: $" + price;

    newProSec.appendChild(imgPart);
    newProSec.appendChild(nameTag);
    newProSec.appendChild(descriptionTag);
    newProSec.appendChild(priceTag);

    id('posted-products').appendChild(newProSec);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   * Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Getting an element by id
   * @param {string} id Input id
   * @return {HTMLElement} the element of certain id
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

})();