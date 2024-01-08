/**
 * Yi Zeng
 * DEC 8, 2023
 * Section AE
 * This sign-up-page-script.js allows users to create new account
 */
'use strict';
(function() {

  window.addEventListener('load', ini);

  /**
   * Hide previous results, and activate create account method
   */
  function ini() {
    id('result').classList.add('hidden'); // hide the previous results
    createNewAccount();
  }

  /**
   * Create new account for users
   */
  function createNewAccount() {
    id('sign-up-form').addEventListener('submit', function(event) {
      event.preventDefault();

      // getting input new account information from users
      let userName = id('username').value;
      let password = id('password').value;
      let recPassword = id('reconfirm-password').value;
      let email = id('email').value;

      let data = new FormData();
      data.append('username', userName);
      data.append('password', password);
      data.append('recPassword', recPassword);
      data.append('email', email);

      fetch('/husky-hustle/sign-up-new-users', {method: 'POST', body: data})
        .then(statusCheck)
        .then(res => res.text())
        .then(showRes)
        .catch(errorHandle);
    });
  }

  /**
   * Show the results of creating an account. Successful or not.
   * @param {Promise} res , a promise represents if a new account has been created successfully
   */
  function showRes(res) {
    id('result').textContent = res;
    id('result').classList.remove('hidden');
    setTimeout(() => {
      id('result').classList.add('hidden');
    }, 5000);

    // delete all the input information
    id('username').value = '';
    id('password').value = '';
    id('reconfirm-password').value = '';
    id('email').value = '';
  }

  /**
   * Display error message to users
   * @param {Promise} res , a promise represents if a new account has been created successfully
   */
  function errorHandle(res) {
    id('error').textContent = res;
    setTimeout(() => {
      id('error').textContent = ''; // hide error message
    }, 5000);

    id('username').value = '';
    id('password').value = '';
    id('reconfirm-password').value = '';
    id('email').value = '';
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

})();