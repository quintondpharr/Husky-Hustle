/*
 * Quinton Pharr
 * November 4th 2023
 * Donovan Kong, and Kathryn Koehler - Section AB
 *
 * This is the JavaScript file for the buy page. It handles the functionality
 * of buying a product, it handles the form submission, and it handles the
 * displaying of the confirmation message.
 */

'use strict';

(function() {
  window.addEventListener('load', preInit);

  /**
   * makes sure the user is logegd in before initializing the page
   */
  function preInit() {
    fetch('/checkLogin')
      .then(statusCheck)
      .then(init)
      .catch(() => {
        window.location.href = '/login.html';
      });
  }

  /**
   * Initializes the buy page by adding event listeners to the buy buttons
   */
  function init() {
    let submitBtn = id('submit-btn');
    let confirmCheckbox = id('confirm-transaction');
    let paymentSelect = id('payment');
    let form = qs('.buy-form');

    populateItemDetails();

    if (id('payment').value === "null") {
      confirmCheckbox.disabled = true;
      submitBtn.disabled = true;
    }

    paymentSelect.addEventListener('change', function() {
      // Enable or disable the confirmation checkbox based on payment selection
      confirmCheckbox.disabled = false;
      confirmCheckbox.checked = false;
    });

    form.addEventListener('change', handleFormChange);
    confirmCheckbox.addEventListener('change', handleCheckboxChange);
    submitBtn.addEventListener('click', handleTransaction);
  }

  /**
   * Populates the item details on the page
   * I wanted to try out using local storage to store the item details
   */
  function populateItemDetails() {
    let item = JSON.parse(localStorage.getItem('selectedItem')); // Get the item from local storage
    if (item) { // If item exists
      qs('.item img').src = item.productImageUrl;
      qs('.item img').alt = item.productName;
      qs('.item-info h3').textContent = `Item Name: ${item.productName}`;
      qs('.item-info p').textContent = item.productDescription;
      id('price').textContent = item.price;
    }
  }

  /**
   * Handles the change event on the form by enabling or disabling the submit button.
   */
  function handleFormChange() {
    let submitBtn = id('submit-btn');
    let confirmCheckbox = id('confirm-transaction');
    submitBtn.disabled = !confirmCheckbox.checked;
  }

  /**
   * Handles the change event on the confirm checkbox by enabling or disabling the submit button.
   */
  function handleCheckboxChange() {
    let submitBtn = id('submit-btn');
    submitBtn.disabled = !this.checked;
  }

  /**
   * Checks the response status and throws an error if it is not ok.
   * @param {Event} evt - event object
   */
  function handleTransaction(evt) {
    evt.preventDefault();
    let data = new FormData();

    let productId = localStorage.getItem('itemId');

    data.append('productId', productId);

    let confirmationContainer = qs('.confirmation-message');

    // if the user select payment3 then fail the transaction
    if (id('payment').value === 'payment3') {
      handleError(confirmationContainer, new Error('Please use real money!!'));
      return;
    }

    fetch('/process-transaction', {method: 'POST', body: data})
      .then(statusCheck)
      .then(res => res.text())
      .then(confirmationNumber => {
        displayConfirmation(confirmationContainer, confirmationNumber);
      })
      .catch(err => {
        handleError(confirmationContainer, err);
      });
  }

  /**
   * Displays a confirmation message in the container.
   * @param {object} container - DOM object to display the confirmation message
   * @param {string} confirmationNumber - confirmation number to display
   */
  function displayConfirmation(container, confirmationNumber) {
    let confirmationMessage = gen('p');
    confirmationMessage.textContent = 'Transaction Successful! Your confirmation number is: ' +
    confirmationNumber;
    container.textContent = ''; // Clear the container
    container.appendChild(confirmationMessage);
  }

  /**
   * Handles errors by displaying an error message in the container.
   * @param {object} container - DOM object to display the error message
   * @param {Error} error - error object
   */
  function handleError(container, error) {
    let errorMessage = gen('p');
    errorMessage.textContent = 'Transaction Failed: ' + error.message;
    container.textContent = ''; // Clear the container
    container.appendChild(errorMessage);
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
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the element that has the matches the selector passed.
   * @param {string} selector - selector for element
   * @return {object} DOM object associated with selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
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