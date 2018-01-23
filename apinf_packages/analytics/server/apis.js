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

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
import Organizations from '/apinf_packages/organizations/collection';

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
        AnalyticsV1.swagger.params.days,
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

      // Default value for apisBy is 'organization'
      const apisBy = this.queryParams.apisBy || 'organization';

      // Check if correct value was given
      if (apisBy !== 'owner' && apisBy !== 'organization') {
        return errorMessagePayload(400, 'Parameter "apisBy" has erroneous value.',
         'apisBy', apisBy);
      }

      // Organization with id has to exist, if parameter is given
      const organizationId = this.queryParams.organizationId;
      if (organizationId) {
        const organization = Organizations.findOne(organizationId);
        if (!organization) {
          return errorMessagePayload(400, 'Parameter "organizationId" has erroneous value.',
           'organizationId', organizationId);
        }
      }

      // Default value for period is 'today'
      let period = this.queryParams.period || 'today';

      // Check if correct value was given
      if (period !== 'today' && period !== 'week' && period !== 'month') {
        return errorMessagePayload(400, 'Parameter "period" has erroneous value.',
         'period', period);
      }

      // Is start date given?
      const startDate = this.queryParams.startDate;
      // Start date has to be according to ISO 8601
      if (startDate) {
        // If period is really given, no startDate is allowed
        if (this.queryParams.period) {
          const message = 'Parameter "startDate" must be given with parameter "period".';
          return errorMessagePayload(400, message);
        }

        // Format check for date
        if (!moment(startDate).isValid()) {
          // Error message
          const message = 'Parameter "startDate" must be a valid date.';
          return errorMessagePayload(400, message, 'startDate', startDate);
        }

        // If start date is given, also days is needed
        if (!this.queryParams.days) {
          const message = 'Parameter "startDate" requires also parameter "days".';
          return errorMessagePayload(400, message);
        }

        // Because parameter period was not given, override default value
        period = undefined;
      }

      // Is number of days given?
      let days = this.queryParams.days;

      if (days) {
        // Days must be integer
        if (!Number.isInteger(days * 1)) {
          const message = 'Parameter "days" has to be integer.';
          return errorMessagePayload(400, message, 'days', days);
        }
        // If days is given, also start date is needed
        if (!this.queryParams.startDate) {
          const message = 'Parameter "days" requires also parameter "startDate".';
          return errorMessagePayload(400, message);
        }
        days *= 1;
      }

      // From date
      let fromDate;
      let toDate;
      if (period === 'today') {
        // only one day
        fromDate = moment();
        fromDate_x = fromDate.format('x');
        fromDate_f = fromDate.format('MM-DD-YYYY');
        toDate = fromDate;
        toDate_x = toDate.format('x');
        toDate_f = toDate.format('MM-DD-YYYY');
      } else if (period === 'week') {
        // previous week, ending yesterday
        fromDate = moment().subtract(1, 'weeks');
        fromDate_x = fromDate.format('x');
        fromDate_f = fromDate.format('MM-DD-YYYY');
        toDate = moment().subtract(1, 'days');
        toDate_x = toDate.format('x');
        toDate_f = toDate.format('MM-DD-YYYY');
      } else if (period === 'month') {
        // previous month, ending yesterday
        fromDate = moment().subtract(1, 'months');
        fromDate_x = fromDate.format('x');
        fromDate_f = fromDate.format('MM-DD-YYYY');
        toDate = moment().subtract(1, 'days');
        toDate_x = toDate.format('x');
        toDate_f = toDate.format('MM-DD-YYYY');
      } else {
        // free value, starting from given, duration of days
        fromDate = moment(startDate);
        fromDate_x = fromDate.format('x');
        fromDate_f = fromDate.format('MM-DD-YYYY');
        toDate = moment(startDate).add(days - 1, 'days');
        toDate_x = toDate.format('x');
        toDate_f = toDate.format('MM-DD-YYYY');
      }
      console.log('fromDate=', fromDate);
      console.log('fromDate_f=', fromDate_f);
      console.log('fromDate_x=', fromDate_x);
      console.log('toDate=', toDate);
      console.log('toDate_f=', toDate_f);
      console.log('toDate_x=', toDate_x);
      // To date


      // Create placeholders
      const query = {};
      const options = {};

      // Set condition for a list of managed APIs
      //query.managerIds = managerId;

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


      // Create new API list that is based on APIs collection with extended field logoUrl
      const apiAnalyticsList = Apis.find(query, options).map((api) => {
        // Initiate response structure
        const apiAnalytics = {};
        const metaAnalytics = {};
        const summariesAnalytics = {};

        // Gather API metadata
        metaAnalytics.apiName = api.name;
        metaAnalytics.apiId = api._id;
        metaAnalytics.interval = 1440;
        metaAnalytics.proxyPath = '';

        // For summary counters
        const summariesRequestCount = {};
        const summariesResponseTime = {};
        const summariesUniqueUsers = {};

        // Return API Proxy's URL, if it exists
        const proxyBackend = ProxyBackends.findOne({ apiId: api._id });

        // If Proxy is API Umbrella
        if (proxyBackend && proxyBackend.type === 'apiUmbrella') {
          // Get connected proxy url
          const proxyUrl = proxyBackend.proxyUrl();
          // Get proxy backend path
          const frontendPrefix = proxyBackend.frontendPrefix();
          // Provide full proxy path
          metaAnalytics.proxyPath = proxyUrl.concat(frontendPrefix);

          // Fill summaries
          summariesAnalytics.requestCount = 1;
          summariesAnalytics.responseTime = 131;
          summariesAnalytics.uniqueUsers = 1313;
          
          // Fill and return analytics data4
          apiAnalytics.meta = metaAnalytics;
          apiAnalytics.summaries = summariesAnalytics;
          return apiAnalytics;
        }
        
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
