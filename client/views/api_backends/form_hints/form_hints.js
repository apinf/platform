var helpData = {
  'api_name': {
    message: " A name that describes your API",
    options: {
      placement: 'left'
    }
  },
  'backend_protocol': {
    message: "Choose the protocol used by your api (e.g. http or https)",
    options: {
      placement: 'left'
    }
  },
  'servers': {
    message: "URL of the server that hosts the API. <br><br>The port on the server which exposes your API to internet. <br><br><i>You can add multiple servers if you want us to perform load balancing on your incoming requests</i>",
    options: {
      placement: 'left'
    }
  },
  'backend_host': {
    message: "Server where umbrella is hosted. <br><br>If API Umbrella installed locally, enter <strong>localhost</strong> as your Backend host",
    options: {
      placement: 'left'
    }
  },
  'frontend_host': {
    message: " Usually the same as your Server host",
    options: {
      placement: 'left'
    }
  },
  'url_matches': {
    message: "We recommend to have a unique URL Front-end prefix for your API so that it does not conflict with other existing APIs.<br> Apart from that, you can also segregate different sections of your API with different prefixes. <br>All the requests made to the 'Front-end host / Front-end prefix' will be re-written to 'Backend host / Backend prefix' <br><br>Frontend prefix: A prefix for your API, recognized by the Umbrella, e.g. /my_dev_api/ <br><br>Backend prefix: Usually a part of your API's url, helpful to shorten the URL used for accessing your API, e.g. /apiv2/staging/experimental OR something as simple as '/'.",
    options: {
      placement: 'left'
    }
  },
  'documentation_link': {
    message: "Link of the wiki / github page / web resource where the documentation of your API is located",
    options: {
      placement: 'left'
    }
  },
  'apiDocumentationEditor': {
    message: "You can also choose to create a new documentation for your APIs using swagger at our own server",
    options: {
      placement: 'left'
    }
  },
  'importApiDocumentation': {
    message: "If your documentation exists but is not available online, you can host it on APINF.<br> Upload your documentation in Swagger format here.",
    options: {
      placement: 'left'
    }
  },
  'append_query_string': {
    message: "Add the parameters required by your API in <strong>key1=value1&key2=value2</strong> format. <br>This place is best to add those parameters that is not mandatory for your API-users but your API needs them for providing meaningful data.",
    options: {
      placement: 'left'
    }
  },
  'set_headers': {
    message: "If your API requires some specific headers to be set, they should be added here",
    options: {
      placement: 'left'
    }
  },
  'http_basic_auth': {
    message: "Does your api need a username and password for access? If yes, they must be specified here.",
    options: {
      placement: 'left'
    }
  },
  'require_https': {
    message: "Choose <strong>'required'</strong> if HTTPS is mandatory for accessing your apis.",
    options: {
      placement: 'left'
    }
  },
  'api_key_verification_level': {
    message: "Choose <strong>'required'</strong> if API key is required to access your API",
    options: {
      placement: 'left'
    }
  },
  'required_roles': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'rate_limit_mode': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'pass_api_key_header': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'pass_api_key_query_param': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'rewrite': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'balance_algorithm': {
    message: "In case you have provided multiple Front-end : Back-end host pairs, choose the balancing algorithm using which umbrella should forward the requests to your api backend.",
    options: {
      placement: 'left'
    }
  },
  'error_templates': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'settings': {
    message: "Define header values that will be set in the response regardless of whether the header is already set in the response.<br><br> For example, to force CORS headers on all responses:<br><br> 'Access-Control-Allow-Origin: *'",
    options: {
      placement: 'left'
    }
  }
};
InlineHelp.initHelp(helpData);
