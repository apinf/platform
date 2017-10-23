## Automated tests for REST APIs

With testing tool Postman there are done sets of automated tests for REST APIs.

The master collection contains all subcollections
* test sets of REST APIs for APIs, Organizations and Users
  * each test set for REST API contains
    * collection of tests for successful requests (2xx HTTP code expected)
    * tests for each endpoint in REST API in question, covering all unsuccessful (3xx/4xx/5xx expected) cases


## Running tests

To run tests you need standalone version of Postman.
### Prepare tests
- Import collection you want to test.
- Add used URL to global variables
  -  Postman > environment options > Manage environments > Globals
     - Add parameter: url = http://nightly.apinf.io/rest/v1
     - Save
- Add username and password to an environment.
  - Postman > environment options > Manage environments
    - select or create an environment
      - add parameter username = <existing username>
      - add parameter password = <password related to username>
      - Update

### Run tests
- Open Postman Runner
- Select the collection of tests you want to run
- Select the environment where you stored username and password
- Click big blue button that says [Run <collection_name>]
- Verify, that tests are run with expected results
