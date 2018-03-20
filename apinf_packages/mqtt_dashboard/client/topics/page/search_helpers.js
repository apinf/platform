/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';

import _ from 'lodash';

import { autoCompleteRequest } from '../../../lib/es_requests';

const ArrayAdapter = jQuery.fn.select2.amd.require('select2/data/array');

// Adapter for Select2
export default class ESData extends ArrayAdapter {
  constructor ($element, options) {
    super($element, options);

    // Use debounce to set pause during 1000ms between function calls
    this.query = _.debounce((params, callback) => {
      // A value is provided
      if (params.term) {
        // Build request to ES
        const bodyParam = autoCompleteRequest(params.term);

        Meteor.call('emqElastisticsearchSearch', bodyParam, (fetchingError, fetchingResult) => {
          if (fetchingError) {
            callback({ results: [] });

            // Display message error
            const message = `Searching fails. ${fetchingError.message}`;
            sAlert.error(message);
            throw new Meteor.Error(fetchingError.message);
          }

          // Get grouped data from ES
          Meteor.call('autocompletedDataFetch', fetchingResult, params.term, (error, result) => {
            if (error) {
              // Display message error
              const message = `Searching fails. ${error.message}`;
              sAlert.error(message);
              callback({ results: [] });
            } else {
              callback({ results: result });
            }
          });
        });
      }
    }, 1000);
  }
}
