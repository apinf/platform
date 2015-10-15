var helpData = {
  'api_name': {
    message: "Name your API. Enter a name which describes your API the best way.",
    options: {
      placement: 'left'
    }
  },
  'backend_protocol': {
    message: "Choose backend server protocol",
    options: {
      placement: 'left'
    }
  },
  'servers': {
    message: "Define the server where the API is hosted.",
    options: {
      placement: 'left'
    }
  },
  'backend_host': {
    message: "Define the server where the API Umbrella instance is hosted. <br><br>If API Umbrella installed locally, enter <strong>localhost</strong> as your Backend host.",
    options: {
      placement: 'left'
    }
  },
  'frontend_host': {
    message: "Define the server where the API is hosted.<br>Frontend host field is for URL of your API without 'http(s)'",
    options: {
      placement: 'left'
    }
  },
  'url_matches': {
    message: "Tip: We recommend using trailing slashes when configuring these URL prefixes when possible (for example, using /wind/ instead of /wind). While not necessary, this helps prevent future overlapping conflicts (for example, if someone later wants to set up /windmill/). <br><br>Example: Incoming Frontend Request: <a href='http://api.data.govexample.json?param=value'>http://api.data.govexample.json?param=value</a> Outgoing Backend Request: <a href='http://api.data.govexample.json?param=value'>http://api.data.govexample.json?param=value</a>",
    options: {
      placement: 'left'
    }
  },
  'documentation_link': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'importApiDocumentation': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'append_query_string': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'set_headers': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'http_basic_auth': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'require_https': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'api_key_verification_level': {
    message: "Hint text",
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
    message: "Hint text",
    options: {
      placement: 'left'
    }
  },
  'error_templates': {
    message: "Hint text",
    options: {
      placement: 'left'
    }
  }
};
InlineHelp.initHelp(helpData);
