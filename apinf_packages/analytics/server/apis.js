/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
// import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
// import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Match } from 'meteor/check';
import moment from 'moment';
import promisifyCall from '/apinf_packages/core/helper_functions/promisify_call';
import { ReactiveVar } from 'meteor/reactive-var';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
import Organizations from '/apinf_packages/organizations/collection';
import OrganizationApis from '/apinf_packages/organization_apis/collection';

// APInf imports
import AnalyticsV1 from '/apinf_packages/rest_apis/server/analytics';
import Authentication from '/apinf_packages/rest_apis/server/authentication';
import descriptionAnalytics from '/apinf_packages/rest_apis/lib/descriptions/analytics_texts';
import errorMessagePayload from '/apinf_packages/rest_apis/server/rest_api_helpers';

AnalyticsV1.swagger.meta.paths = {
  '/login': Authentication.login,
  '/logout': Authentication.logout,
};

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

      // Create placeholders for query
      const query = {};
      const options = {};
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

        console.log('organizationList=', organizationList);
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
      let fromDate, toDate;

      // Check parameter "startDate"
      if (queryParams.startDate) {
        // Error if "period" is zero and "startDate" is given
        if (period === 0 ) {
          return errorMessagePayload(400, 'Parameter "startDate" can not be given when "period" is zero!');
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

      } else {
        if (period === 0) {
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
      }

      console.log('fromDate=', fromDate);
      console.log('fromDate_h=', moment(fromDate).format());
      console.log('toDate=', toDate);
      console.log('toDate_h=', moment(toDate).format());
      console.log('managedApis=', managedApis);

      // Create list of API analytical data based on ProxyBackends
      const apiAnalyticsList = ProxyBackends.find({
        $and : [
          { 'apiId': { $in: managedApis }},
          { 'type': 'apiUmbrella' }
        ]
        }).map((proxyBackend) => {
        console.log('proxy_api=', proxyBackend.apiId);
        const apiAnalytics = {};

        // Get connected proxy url
        const proxyUrl = proxyBackend.proxyUrl();
        // Get proxy backend path
        const frontendPrefix = proxyBackend.frontendPrefix();

        const proxyBackendId = proxyBackend._id;

        // Get data about summary statistic for current period
        promisifyCall('summaryStatisticNumber', { proxyBackendId, fromDate, toDate })
        .then((currentPeriodDataset) => {

          // Fill summaries
          apiAnalytics.summaries = {
            requestCount: currentPeriodDataset[frontendPrefix].requestNumber,
            responseTime: currentPeriodDataset[frontendPrefix].medianResponseTime,
            uniqueUsers: currentPeriodDataset[frontendPrefix].avgUniqueUsers,
          };

        }).catch((error) => {
          return errorMessagePayload(400, 'Error retrieving analytic data!');
        });
        // Fill and return analytics data
        apiAnalytics.meta = {
          proxyPath: proxyUrl.concat(frontendPrefix),
          apiName: proxyBackend.apiUmbrella.name,
          apiId: proxyBackend.apiId,
          interval: 1440,
        };

        // TODO: solve problem for last proxyBAckend.
        //       meta is included in, but
        //       summaries are not included in returned apiAnalytics

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
      description: descriptionAnalytics.getAnalytics,
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
      let fromDate, toDate, interval;
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
        } else {
          // Get period data from start to end of yesterday
          // Get timestamp of today 00:00:00 Date time
          toDate = moment(0, 'HH').valueOf();
          // Get timestamp of timeframe ago 00:00:00 Date time (included value)
          fromDate = moment(toDate).subtract(period, 'd').valueOf();
        }
        // Default value in case of period is 1440 minutes = 24 hours
        interval = 1440;

      } else {
        // Date is given
        let date = this.queryParams.date;
        // Error if "date" format is not according to ISO 8601
        if (!moment(date).isValid()) {
          const message = 'Parameter "date" must be a valid date.';
          return errorMessagePayload(400, message, 'date', date);
        }

        // Get timestamp of startDate 00:00:00 Date time
        fromDate = moment(date).valueOf();
        // Get timestamp of period after start 24:00:00 Date time (included value)
        toDate = moment(fromDate).add(1, 'd').valueOf();
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
        let allowedIntervals = [30, 60];
        // Error is "interval" is not accepted value
        if (!allowedIntervals.includes(interval)) {
          return errorMessagePayload(400, 'Parameter "interval" has erroneous value.',
          'interval', interval);
        }
      }

      console.log('fromDate=', fromDate);
      console.log('fromDate=', moment(fromDate).format());
      console.log('toDate=', toDate);
      console.log('toDate=', moment(toDate).format());
      console.log('interval=', interval);


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
      const proxyBackend = ProxyBackends.findOne({ apiId: api._id });

      // Error if proxy backend for API does not exist
      if (!proxyBackend) {
        return errorMessagePayload(404, 'No Proxy Backend exists for API.');
      }

      const proxyBackendId = proxyBackend._id;
      // Create placeholders
      const query = { _id: apiId };
      const options = {};

      // Include only id and name
      options.fields = {
        _id: 1,
        name: 1,
      };

      let currentPeriodDataset = {};
      // Get data about summary statistic for current period
      promisifyCall('summaryStatisticNumber', { proxyBackendId, fromDate, toDate })
        .then((currentPeriodDataset) => {

          console.log('API currentPeriodDataset=', currentPeriodDataset);
          const previousFromDate = moment(fromDate).subtract(timeframe, 'd').valueOf();

          // Get trend data is based on the current period data
          Meteor.call('summaryStatisticTrend',
            { proxyBackendId, fromDate: previousFromDate, toDate: fromDate }, currentPeriodDataset,
            (err, compareResponse) => {
              console.log('API compareResponse=', compareResponse);
            });
        }).catch((error) => {
          throw new Meteor.Error(error);
        });



      // Construct response
      return {
        statusCode: 200,
        body: {
          status: 'success',
//          data: apiAnalyticsList,
          data: currentPeriodDataset,
        },
      };
    },
  },
});
