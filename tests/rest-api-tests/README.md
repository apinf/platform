## Automated tests for REST APIs

With testing tool Postman there are done sets of automated tests for REST APIs.

The master collection contains all subcollections
* test sets of REST APIs for APIs, Organizations and Users
  * each test set for REST API contains
    * collection of tests for successful requests (2xx HTTP code expected)
    * tests for each endpoint in REST API in question, covering all unsuccessful (3xx/4xx/5xx expected) cases


To run tests you need standalone version of Postman.
Import collection you want to test.
Add url = http://nightly.apinf.io/rest/v1 to your global variables
Then open Postman Runner and select collection you want to test
and select any environment where you can store ids and tokens.
Add username and password to selected environment.
Click big blue button that says run "collection_name".
And Postman should run the tests.

To run organization tests you need to have admin account.
