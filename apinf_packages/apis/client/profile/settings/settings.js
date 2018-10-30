/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collections import
import Settings from '/apinf_packages/settings/collection';


Template.apiSettings.helpers({
  displayAnalyticsSettings () {
    const proxyBackend = Template.currentData().proxyBackend;
    const settings = Settings.findOne();

    // Display block if "Development Features" is enablemd and API is connected to Proxy
    return settings && settings.developmentFeatures && proxyBackend;
  },
});
