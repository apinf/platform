/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

const descriptionProxies = {
  // --------------------------------------------
  generalDescription: `
  ### Providing traffic information of APIs ###

  When API calls are redirected via proxy, data about API calls (requests and responses)
  is collected automatically.
  Based on this data, the API owner gets information of API usage.

  With this API the proxies can be
  - created
  - listed
  - modified
  - removed.

  Example calls:

  GET /proxies

  Result: Responds with HTTP code 200 and a list of available proxies.
  `,
  // --------------------------------------------
  getAllProxies: `
  ### List all available proxies ###

  Admin user or manager can get list of available proxies.

  On successful case the response contains list of existing proxies including following information
  - proxy id
  - proxy name
  - proxy description
  - proxy type

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
      - TLS activation status
    - httpApi
    - elastic search URL

  Example calls:

    GET /proxies

  Result: Responds with HTTP code 200 and a list of available Proxies containing
  proxy information by proxy type.

  If no proxies are defined, returns an empty list.
  `,
  // --------------------------------------------
  getProxy: `
  ### List details of an identified proxy ###

  Admin user or manager can get information of a proxy identified with proxy id.

  On success returns list of proxy's details
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
    - TLS activation status
  - httpApi
  - elastic search URL

  Example calls:

    GET /proxies/<proxy id>

  Result: Responds with HTTP code 200 and Proxy information by proxy type.

  If no proxy is not found, responds with corresponding error.
  `,
  // --------------------------------------------
  deleteProxy: `
  ### Remove an identified proxy ###

  Admin user can delete an identified Proxy.

  Example call:

    DELETE /proxies/<proxy id>

  Result: deletes the Proxy identified with <proxy id> and responds with HTTP code 204.
  A Proxy with connected backends cannot be removed.
  If match is not found, the operation is considered as a failure.
  `,
  // --------------------------------------------
  postProxy: `
  ### Add a new Proxy ###

  Admin can add a new Proxy.
  On success, returns the added Proxy object.

  Parameters (all are mandatory)
  * name (must be unique)
  * description
  * type = proxy type, [apiUmbrella | EMQ]

  Proxy type related parameters.
  The parameter set according to selected proxy type is mandatory.

  API Umbrella:
  - umbProxyUrl = proxy URL
  - umbApiKey = API key
  - umbAuthToken = Authentication Token
  - esUrl = ElasticSearch URL

  EMQ:
  - emqHttpApi = Configuration API endpoint
  - esUrl = ElasticSearch URL
  - Broker Endpoint (one or several) consisting of:
    - emqProtocol = protocol to be used [MQTT | MQTT over websockets]
    - emqHost = Host URL
    - emqPort = Port used in Host URL
    - emqTLS = TLS activation (true | false)

  Example call:

    POST /proxies/

  Result: creates a new Proxy and responds with HTTP code 201.
  `,
  // --------------------------------------------
  putProxy: `
  ### Update an existing Proxy ###

  Admin can update settings of an existing Proxy. Only parameters related to identified
  proxy's type can be modified.
  At least one parameter in set according to proxy type must be given.
  Parameters in wrong set must not be given.

  With parameter *beIndex* it is indicated, which broker endpoint data is to be modified.
  Also a new broker endpoint occurrence can be added to
  - a hole in broker endpoint list (*beIndex* points to hole) or
  - end of broker endpoint list (*beIndex* points to length of list)

  With parameter *beIndexRemove* it is indicated, which broker endpoint data is to be removed.


  Note! Type of Proxy can not be changed.

  On success, returns the updated Proxy object.
  Error cases:
  - no parameter given
  - unknown parameter or parameter in wrong type set given
  - parameter validation fails

  Parameters:
  * proxy ID (in path)
  * name
  * description

  Proxy type related parameters.

  API Umbrella:
  - umbProxyUrl = proxy URL
  - umbApiKey = API key
  - umbAuthToken = Authentication Token
  - esUrl = ElasticSearch URL

  EMQ:
  - emqHttpApi = Configuration API endpoint
  - esUrl = ElasticSearch URL
  - Broker Endpoint (one or several) consisting of:
    - emqProtocol = protocol to be used [MQTT | MQTT over websockets]
    - emqHost = Host URL
    - emqPort = Port used in Host URL
    - emqTLS = TLS activation [true | false]

  - beIndex = indicates the broker endpoint occurrence, which data is modified or added
  - beIndexRemove = indicates, which broker endpoint is to be removed

  Example call:

    PUT /proxies/<proxy id>

  Result: updates the Proxy identified with <proxy id> and responds with HTTP code 200
  and updated Proxy's information.
  `,
  // --------------------------------------------
  getProxyBackends: `
  ### List all backends connected to Proxy in question ###

  Admin user or manager can get list of backends connected to Proxy in question.

  Parameters:
  - proxy id (in path)

  Example calls:

    GET /proxies/<proxy_id>/proxyBackends

  Result: Responds with HTTP code 200 and a list of connected backend ids.

  If no backends are connected, returns an empty list.
  `,

};

export default descriptionProxies;
