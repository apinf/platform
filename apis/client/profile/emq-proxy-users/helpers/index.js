import URI from 'urijs';

export default {
  getUrlAndAuthStrings (url) {
    // Init URI object instance
    const uri = new URI(url);

    /* eslint-disable no-underscore-dangle */
    // Construct auth string
    const auth = `${uri._parts.username}:${uri._parts.password}`;

    // Delete username & password credentials
    delete uri._parts.username;
    delete uri._parts.password;

    // Re-construct URI instance without auth credentials
    uri.normalize();

    // Retrun object with both values
    return {
      auth,
      url: `${uri.valueOf()}`,
    };
  },
};
