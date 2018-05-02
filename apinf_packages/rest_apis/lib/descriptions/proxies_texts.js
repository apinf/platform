/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

const descriptionProxies = {
  // --------------------------------------------
  generalDescription: `
  ### Providing traffic information of APIs ###

  When API calls are redirected via proxy, data of use is collected automatically.
  Based on this data, the API owner gets information of API usage.

  With this API the proxies can be
  - created
  - listed
  - edited
  - removed.

  Example calls:

  GET /proxies

  Result: Responds with HTTP code 200 and a list of available proxies.

  `,
  // --------------------------------------------
  getAllProxies: `
  ### List of available proxies ###

  Admin user can get list of available proxies.

  On success case the response contains list of proxies with following information
  - proxy id
  - proxy name
  - proxy description
  - proxy type

  In addition there is (if defined) information according to proxy type
  - API Umbrella
    - proxy URL
    - API key
    - authentication token
    - elastic search URL.

  - EMQ
    - corresponding fields...

  Example calls:

  GET /proxies

  Result: Responds with HTTP code 200 and a list of available proxies.

  If no proxies are defined, returns an empty list.
  `,
  // --------------------------------------------
  getProxy: `
  ### Details of one proxy ###

  Admin user can get information of a proxy identified with proxy id.

  On success returns list of proxies detailing
  - proxy id
  - proxy name
  - proxy description
  - proxy type.

  Depending on proxy type, there is information accordingly either about
  apiUmbrella of EMQ
  - API Umbrella
    - proxy URL
    - API key
    - authentication token
    - elastic search URL.

  - EMQ
  - brokerEndpoints
    - Protocol
    - Host
    - Port
    - TLS
  - httpApi
  - elastic search URL


  Example calls:

  GET /proxies

  Result: Responds with HTTP code 200 and proxy information.

  If no proxy is not found, responds with corresponding error.
  `,
  // --------------------------------------------
  deleteProxy: `
  ### Deletes a proxy ###

  Admin user can delete an identified Proxy.

  Example call:

    DELETE /proxies/<proxy id>

  Result: deletes the Proxy identified with <proxy id> and responds with HTTP code 204.

  If match is not found, the operation is considered as failed.
  `,
  // --------------------------------------------
  postProxy: `
  ### Adds a new Proxy ###

  Adds a new Proxy. On success, returns the added Proxy object.


  Parameters (all are mandatory)
  * name
  * description
  * proxy type (apiUmbrella | EMQ)

  Proxy type related parameters according to selected proxy type:

  API Umbrella:
  - proxy URL
  - API key
  - Authentication Token
  - ElasticSearch URL

  EMQ:
  - Broker Endpoint (one or several) consisting of:
    - protocol (MQTT | MQTT over websockets)
    - Host URL
    - Port
    - TLS activation (true | false)
  - Configuration API endpoint
  - ElasticSearch URL

  Example call:

    POST /proxies/

  Result: creates a new Proxy and responds with HTTP code 201.


  `,
  // --------------------------------------------
  putProxy: `
  ### Updates a Proxy ###

  Admin can update settings of an existing Proxy.
  On success, returns the updated API object.

  Parameters:
  * proxy ID
  * name
  * description
  * proxy type (apiUmbrella | EMQ)

  Proxy type related parameters according to selected proxy type:

  API Umbrella:
  - proxy URL
  - API key
  - Authentication Token
  - ElasticSearch URL

  EMQ:
  - Broker Endpoint (one or several) consisting of:
    - protocol (MQTT | MQTT over websockets)
    - Host URL
    - Port
    - TLS activation (true | false)
  - Configuration API endpoint
  - ElasticSearch URL


  Example call:

    PUT /proxies/<proxy id>

  Result: updates the Proxy identified with <proxy id> and responds with HTTP code 200
  and proxy information.

  `,

};

export default descriptionProxies;
