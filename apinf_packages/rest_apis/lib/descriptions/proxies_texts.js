/* Copyright 2018 Apinf Oy
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

  Default type for a proxy is apiUmbrella
  - proxy URL
  - API key
  - authentication token
  - elastic search URL.

  Example calls:

    GET /proxies

  Result: Response with HTTP code 200 and a list of available Proxies containing
  proxy information by proxy type.

  If no proxies are defined, an empty list is returned.
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

  Default proxy type is apiUmbrella
  - proxy URL
  - API key
  - authentication token
  - elastic search URL.

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

  Result: deletes the Proxy, which is identified with <proxy id> and responds with HTTP code 204.
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
  * type = proxy type, (default is apiUmbrella)

  Proxy type related parameters.
  The parameter set according to selected proxy type is mandatory.

  API Umbrella:
  - umbProxyUrl = proxy URL
  - umbApiKey = API key
  - umbAuthToken = Authentication Token
  - esUrl = ElasticSearch URL

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
