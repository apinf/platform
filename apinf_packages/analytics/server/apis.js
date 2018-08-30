/* Copyright 2018 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import moment from 'moment';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// APInf imports
import AnalyticsV1 from '/apinf_packages/rest_apis/server/analytics';
import Authentication from '/apinf_packages/rest_apis/server/authentication';
import descriptionAnalytics from '/apinf_packages/rest_apis/lib/descriptions/analytics_texts';
import errorMessagePayload from '/apinf_packages/rest_apis/server/rest_api_helpers';

AnalyticsV1.swagger.meta.paths = {
  '/login': Authentication.login,
  '/logout': Authentication.logout,
};

// Request /rest/v1/analytics/{id}/raw for getting API's raw analytics data from apiUmbrella
AnalyticsV1.addRoute('analytics/:id/raw', {
  // Response contains a list of data records
  get: {
    swagger: {
      tags: [
        AnalyticsV1.swagger.tags.analytics,
      ],
      summary: 'List API\'s raw analytics data.',
      description: descriptionAnalytics.getAnalyticsApiIdRaw,
      parameters: [
        AnalyticsV1.swagger.params.apiId,
        AnalyticsV1.swagger.params.fromRawDate,
        AnalyticsV1.swagger.params.toRawDate,
        AnalyticsV1.swagger.params.skip,
        AnalyticsV1.swagger.params.limit,
      ],
      responses: {
        200: {
          description: 'API analytics data',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'success',
              },
              data: {
                type: 'array',
                items: {
                  $ref: '#/definitions/rawDataResponse',
                },
              },
            },
          },
        },
        400: {
          description: 'Bad Request. Erroneous or missing parameter.',
        },
        403: {
          description: 'User does not have permission',
        },
        404: {
          description: 'API is not found',
        },
      },
      security: [
        {
          userSecurityToken: [],
          userId: [],
        },
      ],

    },
    action () {
      // Error if no Manager ID from header
      const managerId = this.request.headers['x-user-id'];
      if (!managerId) {
        return errorMessagePayload(400, 'Manager ID expected in header (X-User-Id)');
      }

      // Get ID of API (URL parameter)
      const apiId = this.urlParams.id;
      if (!apiId) {
        return errorMessagePayload(400, 'API ID is missing');
      }

      // API related checkings
      // Get API document
      const api = Apis.findOne(apiId);

      // API must exist
      if (!api) {
        // API doesn't exist
        return errorMessagePayload(404, 'API with specified ID is not found');
      }

      // Error if API exists but user can not manage
      if (!api.currentUserCanManage(managerId)) {
        return errorMessagePayload(403, 'You do not have permission for this API');
      }

      // get query parameters (at the end of URL)
      const queryParams = this.queryParams;
      // Error if "startDate" is not given
      if (!queryParams.fromDate) {
        return errorMessagePayload(400, 'Parameter "fromDate" is mandatory');
      }

      // Check that given start date is valid
      if (!moment(queryParams.fromDate, 'YYYY-MM-DD', true).isValid()) {
        return errorMessagePayload(400, 'Give parameter "fromDate" in form YYYY-MM-DD');
      }

      // start date can not be in future
      if (moment(queryParams.fromDate).valueOf() > moment(0, 'HH').valueOf()) {
        const message = 'Parameter "fromDate" can not be in future';
        return errorMessagePayload(400, message);
      }

      // Get timestamp of startDate 00:00:00 Date time
      const fromDate = moment(queryParams.fromDate).valueOf();

      // placeholder for end of period
      let toDate;

      // Check validity of end date (if given)
      if (queryParams.toDate) {
        // Check that given end date is valid
        if (!moment(queryParams.toDate, 'YYYY-MM-DD', true).isValid()) {
          return errorMessagePayload(400, 'Give parameter "toDate" as form YYYY-MM-DD');
        }
        // Start date must be before end date
        if (queryParams.toDate < queryParams.fromDate) {
          return errorMessagePayload(400, 'fromDate can not be after toDate');
        }
        // end date can not be in future
        if (moment(queryParams.toDate).valueOf() > moment(0, 'HH').valueOf()) {
          const message = 'Parameter "toDate" can not be in future';
          return errorMessagePayload(400, message);
        }
        toDate = moment(queryParams.toDate).add(1, 'd').valueOf();
      } else {
        // If not given, set end of period to be now
        toDate = moment(0, 'HH').add(1, 'd').valueOf();
      }

      // Return API Proxy's URL, if it exists
      const proxyBackend = ProxyBackends.findOne({
        $and: [
          { apiId },
          { type: 'apiUmbrella' },
        ],
      });

      // Error if proxy backend for API does not exist
      if (!proxyBackend) {
        return errorMessagePayload(404, 'No Proxy Backend exists for API.');
      }

   //   const proxyBackendId = proxyBackend._id;
      const requestPath = proxyBackend.apiUmbrella.url_matches[0].frontend_prefix;

      // Get elasticSearch host address
      const proxy = Proxies.findOne(proxyBackend.proxyId);
      if (!proxy) {
        return errorMessagePayload(404, 'No Proxy exists for API.');
      }

      // Get URL of relevant ElasticSearch or an empty string on default
      const elasticsearchHost = _.get(proxy, 'apiUmbrella.elasticsearch', '');
      if (!elasticsearchHost) {
        return errorMessagePayload(404, 'No ElasticSearch host address found for Proxy of API.');
      }

      // Use default value if limit is not given
      let limit = 10000;
      if (queryParams.limit) {
        limit = parseInt(queryParams.limit, 10);
        if (!Number.isInteger(limit)) {
          return errorMessagePayload(400,
            'Bad query parameters value. Limit parameters only accept integer.');
        }
        if (limit < 0 || limit > 10000) {
          return errorMessagePayload(400, 'Limit must be [0...10000].');
        }
      }

      // Use default value for skip, if it is not given
      let skip = 0;
      if (queryParams.skip) {
        // Make sure skip parameters only accept integer
        skip = parseInt(queryParams.skip, 10);
        if (!Number.isInteger(skip)) {
          return errorMessagePayload(400,
            'Bad query parameters value. Skip parameters only accept integer.');
        }
        if (skip < 0) {
          return errorMessagePayload(400, 'Skip must be greater than 0.');
        }
      }

      // Form query for certain fields
      // Note! By giving "_source: true,", the complete content of each source document is gotten
      const query = {
        size: limit,
        from: skip,
        body: {
          _source: ['request_path', 'request_url_query', 'request_method', 'response_status',
            'response_size', 'request_at'],
          query: {
            filtered: {
              filter: {
                and: [
                  {
                    range: {
                      request_at: {
                        gte: fromDate,
                        lt: toDate,
                      },
                    },
                  },
                  {
                    prefix: {
                      request_path: requestPath,
                    },
                  },
                ],
              },
            },
          },
        },
      };
      // Send request to ElasticSearch. Sync call
      const response = Meteor.call('getElasticsearchData', elasticsearchHost, query);

      if (!response) {
        return errorMessagePayload(500, 'No answer from ElasticSearch.');
      }

      let left = 0;
      if ((limit + skip) <= response.hits.total) {
        left = response.hits.total - limit - skip;
      }

      // General part of response
      const trafficData = {
        set: {
          limit,
          skip,
          returned: response.hits.hits.length,
          left,
          found: response.hits.total,
        },
        data: [],
      };

      response.hits.hits.forEach((hit) => {
        // Copy data fields to response data
        /* eslint no-underscore-dangle: ["error", { "allow": ["_source"] }] */
        trafficData.data.push(hit._source);
      });

      // Construct response
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: trafficData,
        },
      };
    },
  },
});
