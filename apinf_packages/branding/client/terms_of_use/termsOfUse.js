/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Template } from 'meteor/templating';
import Branding from '/apinf_packages/branding/collection';

Template.termsOfUse.helpers({
  branding () {
    // Get Branding collection content
    return Branding.findOne();
  },
});
