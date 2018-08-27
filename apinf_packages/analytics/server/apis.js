/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
// import { Roles } from 'meteor/alanning:roles';
import moment from 'moment';
// import promisifyCall from '/apinf_packages/core/helper_functions/promisify_call';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
//import Organizations from '/apinf_packages/organizations/collection';
//import OrganizationApis from '/apinf_packages/organization_apis/collection';

// APInf imports
import AnalyticsV1 from '/apinf_packages/rest_apis/server/analytics';
import Authentication from '/apinf_packages/rest_apis/server/authentication';
import descriptionAnalytics from '/apinf_packages/rest_apis/lib/descriptions/analytics_texts';
import errorMessagePayload from '/apinf_packages/rest_apis/server/rest_api_helpers';

AnalyticsV1.swagger.meta.paths = {
  '/login': Authentication.login,
  '/logout': Authentication.logout,
};
/*
// Request /rest/v1/myOrganizations for Organizations collection
AnalyticsV1.addRoute('myOrganizations', {
  // Response contains a list of organizations
  get: {
    swagger: {
      tags: [
        AnalyticsV1.swagger.tags.analytics,
      ],
      summary: 'List organizations managed by User.',
      description: descriptionAnalytics.getMyOrganizations,
      parameters: [
        AnalyticsV1.swagger.params.optionalSearch,
      ],
      responses: {
        200: {
          description: 'List of organizations',
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
                  $ref: '#/definitions/organizationResponse',
                },
              },
            },
          },
        },
        400: {
          description: 'Bad Request. Erroneous or missing parameter.',
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
      const queryParams = this.queryParams;

      // Get Manager ID from header
      const managerId = this.request.headers['x-user-id'];
      if (!managerId) {
        return errorMessagePayload(400, 'Manager ID expected in header (X-User-Id).');
      }

      // Create placeholders
      const query = {};
      const options = {};

      // Set condition for a list of managed APIs
      query.managerIds = managerId;

      // Pass an optional search string for looking up inventory.
      if (queryParams.q) {
        query.$or = [
          {
            name: {
              $regex: queryParams.q,
              $options: 'i', // case-insensitive option
            },
          },
          {
            description: {
              $regex: queryParams.q,
              $options: 'i', // case-insensitive option
            },
          },
          {
            url: {
              $regex: queryParams.q,
              $options: 'i', // case-insensitive option
            },
          },
        ];
      }

      // Include only id and name
      const includeFields = {};
      includeFields._id = 1;
      includeFields.name = 1;
      options.fields = includeFields;

      // Return list of Organizations.
      const organizationList = Organizations.find(query, options).fetch();

      // Construct response
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: organizationList,
        },
      };
    },
  },
});

// Request /rest/v1/analytics for getting KPI level analytics of APIs
AnalyticsV1.addRoute('analytics', {
  // Response contains a list of APIs KPIs
  get: {
    swagger: {
      tags: [
        AnalyticsV1.swagger.tags.analytics,
      ],
      summary: 'List APIs showing their Ids and KPI values.',
      description: descriptionAnalytics.getAnalytics,
      parameters: [
        AnalyticsV1.swagger.params.apisBy,
        AnalyticsV1.swagger.params.organizationId,
        AnalyticsV1.swagger.params.period,
        AnalyticsV1.swagger.params.startDate,
      ],
      responses: {
        200: {
          description: 'Search results matching criteria',
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
                  $ref: '#/definitions/apiListFlowData',
                },
              },
            },
          },
        },
        400: {
          description: 'Bad Request. Erroneous or missing parameter.',
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
      // Get Manager ID from header
      const managerId = this.request.headers['x-user-id'];
      if (!managerId) {
        return errorMessagePayload(400, 'Manager ID expected in header (X-User-Id).');
      }

      const queryParams = this.queryParams;

      // Create placeholders for list of managed APIs
      let managedApis;

      // Default value for apisBy is 'organization'
      const apisBy = queryParams.apisBy || 'organization';

      // Check if correct value (owner/organization) was given and
      // prepare list of managed APIs according to selection
      if (apisBy === 'owner') {
        // Error response if Organization ID is given when apisBy has value 'owner'
        if (queryParams.organizationId) {
          return errorMessagePayload(400,
            'Parameter "organizationId" is not permitted when "apisBy" has value "owner".');
        }
        // Get list of APIs managed by User
        const apisFoundList = Apis.find({ managerIds: managerId }).fetch();
        // Cleaning: Return list of only API IDs
        managedApis = apisFoundList.map(api => {
          return api._id;
        });
      } else if (apisBy === 'organization') {
        // Check if given Organization exists
        const organizationId = queryParams.organizationId;
        if (organizationId) {
          const organization = Organizations.findOne(organizationId);
          if (!organization) {
            return errorMessagePayload(400, 'Parameter "organizationId" has an erroneous value.',
            'organizationId', organizationId);
          }
        }

        // Get list of Organizations managed by User
        const organizationFoundList = Organizations.find({ managerIds: managerId }).fetch();
        // Cleaning: Return list of IDs
        const organizationList = organizationFoundList.map(organization => {
          return organization._id;
        });

        // Error if User is not a manager in any Organization
        if (!Array.isArray(organizationList) || !organizationList.length) {
          return errorMessagePayload(400, 'User is not an admin in any Organization.');
        }

        // Get list of APIs under managed Organizations
        const managedFoundApis = OrganizationApis.find({
          organizationId: { $in: organizationList } }).fetch();

        // Cleaning: Return list of IDs only
        managedApis = managedFoundApis.map(api => {
          return api.apiId;
        });

        // Error if User is not managing any APIs via Organizations
        if (!Array.isArray(managedApis) || !managedApis.length) {
          return errorMessagePayload(400, 'User is not an managing any APIs via Organization.');
        }
      } else {
        // Error if erroneous value given in apisBy
        return errorMessagePayload(400, 'Parameter "apisBy" has erroneous value.',
         'apisBy', apisBy);
      }

      // If period is not given, use default value (0)
      let period = this.queryParams.period || 0;

      // Error if period is not an integer
      if (!Number.isInteger(period * 1)) {
        const message = 'Parameter "period" has to be an integer.';
        return errorMessagePayload(400, message, 'period', period);
      }
      period *= 1;

      // Error if period value is not 0 - 30
      if (period > 30 || period < 0) {
        const message = 'Parameter "period" value erroneous.';
        return errorMessagePayload(400, message, 'period', period);
      }

      // Prepare beginning and end of period
      let fromDate;
      let toDate;

      // Check parameter "startDate"
      if (queryParams.startDate) {
        // Error if "period" is zero and "startDate" is given
        if (period === 0) {
          return errorMessagePayload(
            400, 'Parameter "startDate" can not be given when "period" is zero!');
        }
        // Is startDate valid?
        const startDate = queryParams.startDate;
        // Error if Start date is not according to ISO 8601
        if (!moment(startDate).isValid()) {
          const message = 'Parameter "startDate" must be a valid date.';
          return errorMessagePayload(400, message, 'startDate', startDate);
        }
        // Period is in past. Set beginning and end.
        // Get timestamp of startDate 00:00:00 Date time
        fromDate = moment(startDate).valueOf();
        // Get timestamp of period after start 24:00:00 Date time (included value)
        toDate = moment(fromDate).add(period, 'd').valueOf();

        // Error if StartDate is not in past
        if (fromDate > moment(0, 'HH').valueOf()) {
          const message = 'Parameter "startDate" must be in past.';
          return errorMessagePayload(400, message);
        }

        // Error if StartDate is more than 30 days in past
        if (fromDate < moment(0, 'HH').subtract(30, 'days').valueOf()) {
          const message = 'Parameter "startDate" must be max 30 days in past.';
          return errorMessagePayload(400, message);
        }

        // Error if StartDate + period exceed yesterday
        if (toDate > moment(0, 'HH').valueOf()) {
          const message = 'Period of days must not exceed yesterday.';
          return errorMessagePayload(400, message);
        }
      } else if (period === 0) {
        // Get today's data
        // Get timestamp of today 00:00:00 Date time
        fromDate = moment(0, 'HH').valueOf();
        // Get timestamp of today 24:00:00 Date time (included value)
        toDate = moment(fromDate).add(1, 'd').valueOf();
      } else {
        // Get period data from start to end of yesterday
        // Get timestamp of today 00:00:00 Date time
        toDate = moment(0, 'HH').valueOf();
        // Get timestamp of timeframe ago 00:00:00 Date time (included value)
        fromDate = moment(toDate).subtract(period, 'd').valueOf();
      }

      // Create list of API analytical data based on ProxyBackends
      const apiAnalyticsList = ProxyBackends.find({
        $and: [
          { apiId: { $in: managedApis } },
          { type: 'apiUmbrella' },
        ],
      }).map((proxyBackend) => {
        const apiAnalytics = {};

        // Get connected proxy url
        const proxyUrl = proxyBackend.proxyUrl();
        // Get proxy backend path
        const frontendPrefix = proxyBackend.frontendPrefix();

        const proxyBackendId = proxyBackend._id;

        // Fill and return analytics data
        apiAnalytics.meta = {
          proxyPath: proxyUrl.concat(frontendPrefix),
          apiName: proxyBackend.apiUmbrella.name,
          apiId: proxyBackend.apiId,
          interval: 1440,
        };
        // Get statistic data for each API
        const currentPeriodDataset = Meteor.call('summaryStatisticNumber', {
          proxyBackendId, fromDate, toDate });
        // Fill summaries
        apiAnalytics.summaries = {
          requestCount: currentPeriodDataset[frontendPrefix].requestNumber,
          medianResponseTime: currentPeriodDataset[frontendPrefix].medianResponseTime,
          uniqueUsers: currentPeriodDataset[frontendPrefix].avgUniqueUsers,
        };

        return apiAnalytics;
      });

      // Construct response
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: apiAnalyticsList,
        },
      };
    },
  },
});

// Request /rest/v1/analytics for getting KPI level analytics of APIs
AnalyticsV1.addRoute('analytics/:id', {
  // Response contains a list of APIs KPIs
  get: {
    swagger: {
      tags: [
        AnalyticsV1.swagger.tags.analytics,
      ],
      summary: 'List APIs showing their Ids and KPI values.',
      description: descriptionAnalytics.getAnalyticsApiId,
      parameters: [
        AnalyticsV1.swagger.params.apiId,
        AnalyticsV1.swagger.params.periodApiId,
        AnalyticsV1.swagger.params.date,
        AnalyticsV1.swagger.params.interval,
      ],
      responses: {
        200: {
          description: 'Search results matching criteria',
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
                  $ref: '#/definitions/flowData',
                },
              },
            },
          },
        },
        400: {
          description: 'Bad Request. Erroneous or missing parameter.',
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
        return errorMessagePayload(400, 'Manager ID expected in header (X-User-Id).');
      }

      // Error is API id, is missing
      const apiId = this.urlParams.id;
      if (!apiId) {
        return errorMessagePayload(404, 'API ID is missing');
      }

      const queryParams = this.queryParams;

      // Error if "date" or "interval" is given with "period"
      if (queryParams.period && (queryParams.date || queryParams.interval)) {
        return errorMessagePayload(400,
          'Parameters "date" or "interval " can not be given with "period"!');
      }

      // Error if neither "period" nor "date" is given
      if (!queryParams.period && !queryParams.date) {
        return errorMessagePayload(400, 'Either parameter "date" or "period" must be given!');
      }
      // Begin and end dates for search
      let fromDate;
      let toDate;
      let interval;
      let previousFromDate;

      // Is period given?
      if (queryParams.period) {
        // Default value for period is 0
        let period = this.queryParams.period || 0;

        // Error if "Period" is not integer
        if (!Number.isInteger(period * 1)) {
          const message = 'Parameter "period" has to be an integer.';
          return errorMessagePayload(400, message, 'period', period);
        }
        period *= 1;

        // Error if "Period" is not between 0 - 30
        if (period > 30 || period < 0) {
          const message = 'Parameter "period" value erroneous.';
          return errorMessagePayload(400, message, 'period', period);
        }
        // Set beginning and end dates
        if (period === 0) {
          // Get today's data
          // Get timestamp of today 00:00:00 Date time
          fromDate = moment(0, 'HH').valueOf();
          // Get timestamp of today 24:00:00 Date time (included value)
          toDate = moment(fromDate).add(1, 'd').valueOf();
          // Get timestamp of previous from date
          previousFromDate = moment(fromDate).subtract(1, 'd').valueOf();
        } else {
          // Get period data from start to end of yesterday
          // Get timestamp of today 00:00:00 Date time
          toDate = moment(0, 'HH').valueOf();
          // Get timestamp of timeframe ago 00:00:00 Date time (included value)
          fromDate = moment(toDate).subtract(period, 'd').valueOf();
          // Get timestamp of previous from date
          previousFromDate = moment(fromDate).subtract(period, 'd').valueOf();
        }
        // Default value in case of period is 1440 minutes = 24 hours
        interval = 1440;
      } else {
        // Date is given
        const date = this.queryParams.date;
        // Error if "date" format is not according to ISO 8601
        if (!moment(date).isValid()) {
          const message = 'Parameter "date" must be a valid date.';
          return errorMessagePayload(400, message, 'date', date);
        }

        // Get timestamp of startDate 00:00:00 Date time
        fromDate = moment(date).valueOf();
        // Error is "Date" is not in past
        if (fromDate > moment(0, 'HH').valueOf()) {
          const message = 'Parameter "date" must be in past.';
          return errorMessagePayload(400, message);
        }

        // Error is "StartDate" is over 30 days in past
        if (fromDate < moment(0, 'HH').subtract(30, 'days').valueOf()) {
          const message = 'Parameter "date" must be max 30 days in past.';
          return errorMessagePayload(400, message);
        }
        // Get timestamp of period after start 24:00:00 Date time (included value)
        toDate = moment(fromDate).add(1, 'd').valueOf();

        // Get timestamp of previous from date
        previousFromDate = moment(fromDate).subtract(1, 'd').valueOf();

        // Get given interval or default value
        interval = queryParams.interval || 60;

        if (interval) {
          // Error if "interval" is not an integer
          if (!Number.isInteger(interval * 1)) {
            const message = 'Parameter "interval" has to be an integer.';
            return errorMessagePayload(400, message, 'interval', interval);
          }
          interval *= 1;
        }
        const allowedIntervals = [30, 60];
        // Error is "interval" is not accepted value
        if (!allowedIntervals.includes(interval)) {
          return errorMessagePayload(400, 'Parameter "interval" has erroneous value.',
          'interval', interval);
        }
      }

      // Find API with specified ID
      const api = Apis.findOne(apiId);

      // Error if API doesn't exist
      if (!api) {
        return errorMessagePayload(404, 'API with specified ID is not found.');
      }

      // Error if API exists but user can not manage
      if (!api.currentUserCanManage(managerId)) {
        return errorMessagePayload(403, 'You do not have permission for this API.');
      }

      // Return API Proxy's URL, if it exists
      const proxyBackend = ProxyBackends.findOne({
        $and: [
          { apiId: api._id },
          { type: 'apiUmbrella' },
        ],
      });

      // Error if proxy backend for API does not exist
      if (!proxyBackend) {
        return errorMessagePayload(404, 'No Proxy Backend exists for API.');
      }

      const proxyBackendId = proxyBackend._id;

      // Get connected proxy url
      const proxyUrl = proxyBackend.proxyUrl();
      // Get proxy backend path
      const frontendPrefix = proxyBackend.frontendPrefix();

      // Fill and return analytics data
      const apiAnalyticsList = {};

      // Meta information
      apiAnalyticsList.meta = {
        proxyPath: proxyUrl.concat(frontendPrefix),
        apiName: proxyBackend.apiUmbrella.name,
        apiId: proxyBackend.apiId,
        interval: 1440,
      };

      // KPI values for period
      const currentPeriodDataset = Meteor.call('summaryStatisticNumber', {
        proxyBackendId, fromDate, toDate });
      // Fill summaries
      apiAnalyticsList.kpi = {
        requestCount: currentPeriodDataset[frontendPrefix].requestNumber,
        medianResponseTime: currentPeriodDataset[frontendPrefix].medianResponseTime,
        uniqueUsers: currentPeriodDataset[frontendPrefix].avgUniqueUsers,
      };

      // Get trend data. Data of previous period is compared to current period data.
      const comparisonData = Meteor.call('summaryStatisticTrend',
      { proxyBackendId, fromDate: previousFromDate, toDate: fromDate }, currentPeriodDataset);
      // Fill response containing Comparison data
      apiAnalyticsList.delta = {
        requestCount: comparisonData[frontendPrefix].compareRequests,
        medianResponseTime: comparisonData[frontendPrefix].compareResponse,
        uniqueUsers: comparisonData[frontendPrefix].compareUsers,
      };

      apiAnalyticsList.frequentUsers = {};

      // Get data for Errors table
      const errorStatistics = Meteor.call('errorsStatisticsData', {
        proxyBackendId, fromDate, toDate });
      // Get data, modify date and store it to list
      const errorStatisticsList = errorStatistics.map(errorData => {
        const errorStatisticsItem = {
          timestamp: moment(errorData.date).format(),
          httpCode: errorData.status,
          calls: errorData.calls,
          requestPath: errorData.requestPath,
        };
        return errorStatisticsItem;
      });
      // Attach error data list to response
      apiAnalyticsList.errorStatistics = errorStatisticsList;

      // Get data about summary statistic for current period
  /*    promisifyCall('summaryStatisticNumber', { proxyBackendId, fromDate, toDate })
        .then((currentPeriodSummaryDataset) => {
          // console.log('API currentPeriodDataset=', currentPeriodDataset);

          // Get summary statistic data about previous period
          const previousPeriodResponse = Meteor.call('summaryStatisticNumber', {
            proxyBackendId, fromDate: previousFromDate, toDate: fromDate });

          // console.log('API previousPeriodResponse=', previousPeriodResponse);

          apiAnalyticsList.previousPeriodResponse = {
            requestCount: previousPeriodResponse[frontendPrefix].requestNumber,
            responseTime: previousPeriodResponse[frontendPrefix].medianResponseTime,
            uniqueUsers: previousPeriodResponse[frontendPrefix].avgUniqueUsers,
          };
        }).catch((error) => {
          throw new Meteor.Error(error);
        });
*/
/*      // Get data about summary statistic for previous period
      promisifyCall('summaryStatisticNumber', { proxyBackendId, previousFromDate, fromDate })
        .then((previousPeriodDataset) => {
          console.log('API previousPeriodDataset=', previousPeriodDataset);
          // Fill summaries
          apiAnalyticsList.delta = {
            requestCount: previousPeriodDataset[frontendPrefix].requestNumber,
            medianResponseTime: previousPeriodDataset[frontendPrefix].medianResponseTime,
            uniqueUsers: previousPeriodDataset[frontendPrefix].avgUniqueUsers,
          };
        }).catch((error) => {
          throw new Meteor.Error(error);
        });
* /

        // Get data about summary statistic over time
      Meteor.call('overviewChartsData', { proxyBackendId, fromDate, toDate },
        (error, dataset) => {
          // console.log('1 API dataset=', dataset);
          apiAnalyticsList.statistic = dataset;
        });

      // Get data about response status codes
      Meteor.call('statusCodesData', { proxyBackendId, fromDate, toDate },
        (error, dataset) => {
          // console.log('2 API dataset=', dataset);
          apiAnalyticsList.statusCode = dataset;
        });

      // Get data for Timeline charts
      Meteor.call('timelineChartData', { proxyBackendId, fromDate, toDate },
        (error, response) => {
          if (error) throw new Error(error);
          // console.log('3 API dataset=', response);
          apiAnalyticsList.timelineChartData = response;
        });

      // console.log('melkein responsen lähettämisessä');

      // Construct response
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: apiAnalyticsList,
        },
      };
    },
  },
});
*/

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
        const message = 'Parameter "fromDate" must be in past';
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
          return errorMessagePayload(400, 'fromDate must be less than toDate');
        }
        // end date can not be in future
        if (moment(queryParams.toDate).valueOf() > moment(0, 'HH').valueOf()) {
          const message = 'Parameter "toDate" must be in past';
          return errorMessagePayload(400, message);
        }
        toDate = moment(queryParams.toDate).add(1, 'd').valueOf();
      } else {
        // If not given, set end of period to be after start 24:00:00 Date time
        toDate = moment(fromDate).add(1, 'd').valueOf();
      }

      // Return API Proxy's URL, if it exists
      const proxyBackend = ProxyBackends.findOne({
        $and: [
          { apiId: api._id },
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
        if (limit < 1 || limit > 10000) {
          return errorMessagePayload(400, 'Limit must be [1...10000].');
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
        if (skip < 1) {
          return errorMessagePayload(400, 'Skip must be greater than 1.');
        }
      }

      const query = {
        size: limit,
        from: skip,
        body: {
          _source: ['request_path', 'request_method', 'response_status',
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
