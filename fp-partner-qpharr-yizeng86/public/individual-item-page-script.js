/*
 * Quinton Pharr
 * November 4th 2023
 * Donovan Kong, and Kathryn Koehler - Section AB
 *
 * This is the JavaScript file for the individual items page. It handles the
 * functionality of displaying the item information on the page.
 */

'use strict';
(function() {

  window.addEventListener('load', init);

  /**
   * init function, adds event listeners to the products div. When an item is clicked,
   * it will call the getItemInfo function. There might be a better way to do this, but
   * this is similar to how I did it in yipper, and it wasn't working originally because
   * I think I was trying to add the event listerers before the page was loaded.
   */
  function init() {

    id('products').addEventListener('click', function(event) {
      let targetElement = event.target;

      // while the target element is not the products div and it does not have the class product
      while (targetElement && targetElement !== this) { // keep going until we reach the product div
        if (targetElement.classList.contains('product')) {
          getItemInfo(targetElement);
          return;
        }
        targetElement = targetElement.parentElement; // go up to the parent element
      }
    });
  }

  /**
   * Displays the item information on the page.
   * @param {object} item - the item to display
   */
  function getItemInfo(item) {
    let itemId = item.id;
    fetch('/product/' + itemId)
      .then(statusCheck)
      .then(response => response.json())
      .then(displayItem)
      .catch(handleError);
  }

  /**
   * Adds the item to the page.
   * @param {object} item - the item to add to the page
   */
  function displayItem(item) {
    let itemContainer = id('individual-item');
    let itemSection = gen('section');
    itemSection.id = item.productId;
    itemSection.classList.add('item');
    let img = gen('img');

    img.src = item.productImageUrl;
    img.alt = item.productName;
    let name = gen('h2');
    name.textContent = item.productName;
    let price = gen('p');
    price.textContent = '$' + item.price;
    let description = gen('p');
    description.textContent = item.productDescription;
    let buyBtn = gen('button');
    buyBtn.textContent = 'Buy';
    buyBtn.addEventListener('click', function() {
      localStorage.setItem('itemId', item.productId); // the id of the item
      localStorage.setItem('selectedItem', JSON.stringify(item)); // the full item as well
      window.location.href = 'http://localhost:8000/buy-page.html'; // go to the buy page
    });
    itemSection.appendChild(img);
    itemSection.appendChild(name);
    itemSection.appendChild(price);
    itemSection.appendChild(description);
    itemSection.appendChild(buyBtn);
    itemContainer.appendChild(itemSection);

    id('individual-item').classList.remove('hidden');
    id('main-page').classList.add('hidden');
  }

  /**
   * Checks the status of the fetch request. If the status is ok, it will return the response.
   * @param {object} res - the response from the fetch request
   * @returns {object} - the response if the status is ok, otherwise it will throw an error
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Handles the error if there is one.
   */
  function handleError() {
    let errorMessage = gen('p');
    errorMessage.textContent = 'An error occurred. Please try again later.';
    id('individual-item').appendChild(errorMessage);
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