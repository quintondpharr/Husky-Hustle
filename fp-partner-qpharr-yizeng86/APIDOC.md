<!--
1.	Endpoint to retrieve all items - Yi
2.	Endpoint to check if the username and password match an entry in the database-login in - Quinton
3.	Retrieve detailed item information  -Quinton
4.	Endpoint to check if transaction is successful or not - Quinton
5.	Endpoint to search database and return results - Yi
6.	Endpoint to retrieve transaction history for any given user - Quinton
7.	Endpoint- post product information - Yi
8.	Endpoint- create new users - Yi
 -->

## * Main Page(Displaying all items information)* -Yi
**Request Format:** */husky-hustle/display-all-items*

**Request Type:** *GET*

**Query Parameter:** search / filter

**Returned Data Format**: json

**Description:** *Displaying basic information about all items on sale in the main page,
it should be displayed by users once they visit this website*

**Example Request:** */husky-hustle/display-all-items?search=hat*

**Example Response:**
```json
{
[
  "item1": {
    "name" : "hat1",
    "img": "xxx.png",
    "price": 3
  },
  "item2": {
    "name" : "hat2",
    "img": "xxx.png",
    "price": 5
  }
]
}
```json

**Error Handling:**
*Error 500, Internal server error.*


## *Login* - Quinton

**Request Format:** */login*

**Request Type:** *POST*

**Returned Data Format**: Plain Text

**Description:** *Allows users to log in by verifying their username and password against existing records - from when they register*

**Example Request:** *As if done in thunderClient: localhost:8000/login
body -> form:
username=johndoe
password=12345
*

**Example Response:**
*Fill in example response in the ticks*

```
success
```

**Error Handling:**

*Missing information:
Status Code: 400
Response error - Missing username or password.

*Incorrect Credentials:
Status Code: 400
Response: error - username or password is incorrect*

*Server Error:
Status Code: 500
Response: Error



## *Retrieve detailed item information* - Quinton

**Request Format:** *product/:id*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *This endpoint returns detailed information about an item, including its name, image, description, price, and other relevant details. It is accessed by providing the unique identifier (ID) of the item.*


**Example Request:** *product/1*

**Example Response:**
*Fill in example response in the {}*

```json
{
  "productId": 1,
  "productName": "Physics Book",
  "productImageUrl": "https://scienceshepherd.com/cdn/shop/files/physics-curriculum-homeschool-textbook-cover-min_1200x.jpg?v=1689974136",
  "productDescription": "Used for 2 years",
  "price": 30,
  "category": "textbook",
  "soldStatus": 1,
  "sellerId": 1
}
```

**Error Handling:**
*Item Not Found:
Status Code: 400
Response: Product not found.

*Server Error:
Status Code: 500
Response: Error


## *Logout* - Quinton

**Request Format:** */logout*

**Request Type:** *POST*

**Returned Data Format**: TEXT

**Description:** *Allows the user to logout* and sets the current user to null*

**Example Request:** */logout*

**Example Response:**

```
successfully logged out
```

**Error Handling:**
* No error handling is done as this is more helper function than anything


## *checkLogin* - Quinton

**Request Format:** */checkLogin*

**Request Type:** *GET*

**Returned Data Format**: TEXT

**Description:** *Helper end point to see if a user is logged in, responds with the username of the current person logged in*

**Example Request:** */checkLogin*

**Example Response:**

```
quinton
```

**Error Handling:**
* User not logged in:
* Status code: 400
* User not logged in.


## *Buy a Product* - Quinton

**Request Format:** */process-transaction*

**Request Type:** *POST*

**Returned Data Format**: JSON

**Description:** *This API endpoint is designed to process a product purchase and retrieve transaction details, integrating seamlessly with the existing frontend simulation of transactions.*

**Example Request:** *As if done in thunderClient: localhost:8000/process-transaction
body -> form:
{
  "productId": "1",
}
*

**Example Response:**
*Fill in example response in the {}*

```
"CONF-LP6H73F7-XFF6VCD"
```

**Error Handling:**
*User not logged in:
Status Code: 400
Response: User not logged in.

*Missing Product Id:
Status Code: 400
Response: Missing product ID.

*Product Unavailable:
Status Code: 400
Response: Product already sold.

*Server Error:
Status Code: 500
Response: Error


## *Access all previous transactions* - Quinton

**Request Format:** */transactions*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *This API endpoint is designed to provide access to a complete history of all transactions processed through the system. It is particularly useful for administrative or auditing purposes, allowing users to track and review all past transactions.*

**Example Request:** */transactions*

**Example Response:**
*Fill in example response in the {}*

```json
[
  {
    "transactionId": 1,
    "buyerId": 1,
    "sellerId": 2,
    "productId": 3,
    "transactionDate": "12/23/2004",
    "price": 20,
    "confirmationNumber": "CONF-LP6H73F7-XFF6VCD"
  }
  // More transactions...
]
```

**Error Handling:**
*User not logged in:
Status Code: 400
Response: User not logged in.

*No transactions found:
Status Code: 400
Response: No transactions found.

*User not found:
Status Code: 400
Response: User not found.

*Server Error:
Status Code: 500
Response: Error


## *Seller Page* - Yi
**Request Format:** */husky-hustle/postItems*

**Request Type:** *POST*

**Body Parameter** name, description, category, imgLink, price

**Returned Data Format**: Plain Text

**Description:** *Let prospective sellers post their stuffs on the website and store into database, so
that it can be displayed by searching or filtering*


**Example Request:** *localhost:8000/husky-hustle/postItems*

**Example Response:**

```
*Success !*

```

**Error Handling:**
*Error 400, missing parameter*
*Error 500, internal server error*
*Error Choosing A Category! If user don't choose a category for product*



## *Register - Create a New User* - Yi

**Request Format:** */husky-hustle/sign-up-new-users*

**Request Type:** *POST*

**Body Parameters** *username, password, recPassword, email*

**Returned Data Format**: PlainText

**Description:** *Allowing users to create new accounts and storing them into user database*

**Example Request:** *localhost:8000/husky-hustle/sign-up-new-users*

**Example Response:**

```
"Your account has been created ! ! "

```

**Error Handling:**
*Error 400, missing important information*
*Error 500, Server error*


## * Existed Items for Current user* - Yi

**Request Format:** */husky-hustle/posted-items-curUser*

**Request Type:** *GET*

**Returned Data Format**: json

**Description:** *Providing existed items for current user*

**Example Request:** *localhost:8000/husky-hustle/posted-items-curUser*

**Example Response:**

```json
[
  {
    "productImageUrl": "name.png",
    "price": "30",
    "productName": "Vintage Book",
    "product Description": "$30.00",
  },
]
```json

**Error Handling:**
*Error 500, Server error*
