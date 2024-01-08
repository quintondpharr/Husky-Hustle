/*
 * Quinton Pharr
 * November 4th 2023
 * Donovan Kong, and Kathryn Koehler - Section AB
 *
 * This is the JavaScript file for the Login page. It handles the login
 * functionality, and redirects to the home page if the login is successful.
 * If the login fails, it displays an error message.
 */

'use strict';
(function() {

  window.addEventListener('load', init);

  /**
   * Initializes the login page by adding event listeners to the login button
   */
  function init() {

    // the actual form event listener, but we havent fully learned how to impliment this yet
    id('login-form').addEventListener('submit', function(evt) {
      evt.preventDefault();
      let username = id('username').value;
      let password = id('password').value;
      login(username, password);
    });
  }

  /**
   * Sends a login request to the server with the given username and password.
   * @param {string} username - the username to log in with
   * @param {string} password - the password to log in with
   * @param {string} email - the email associated with the username
   */
  function login(username, password) {
    let data = new FormData();
    data.append('username', username);
    data.append('password', password);
    fetch('/login', {method: 'POST', body: data})
      .then(statusCheck)
      .then(res => res.text())
      .then(handleLogin)
      .catch(handleError);
  }

  /**
   * Handles the response from the server after attempting to log in.
   * If the response indicates success, redirects to the home page.
   * Otherwise, displays an error message.
   * @param {object} res - the response from the server
   */
  function handleLogin(res) {
    if (res === 'success') {
      window.location.href = 'http://localhost:8000/index.html';
    } else {
      handleError(res);
    }
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
   * Displays an error message indicating that the login attempt failed.
   * @param {string} res - the response from the server
   */
  function handleError(res) {
    let error = id('error');
    let par = gen('p');
    par.textContent = res;
    error.replaceChild(par, id('error-message'));
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
   *
   *function qs(selector) {
   *  return document.querySelector(selector);
   *}
   */

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   *
   *function qsa(query) {
   *  return document.querySelectorAll(query);
   *}
   */

  /**
   * Returns a new element with the given tag name.
   * @param {string} tag - HTML tag name for new DOM element.
   * @returns {object} - New DOM object for given HTML tag.
   */
  function gen(tag) {
    return document.createElement(tag);
  }
})();