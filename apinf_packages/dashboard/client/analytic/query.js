/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
 */

// Npm packages imports
import moment from 'moment';

export default function queryForAnalyticPage (requestPath) {
  // Plus one day to include current day in selection
  const today = moment().add(1, 'days').format('YYYY-MM-DD');
  const oneWeekAgo = moment().subtract(7, 'days').format('YYYY-MM-DD');
  const twoWeeksAgo = moment().subtract(14, 'days').format('YYYY-MM-DD');

  return {
    size: 0,
    body: {
      query: {
        filtered: {
          query: {
            bool: {
              should: [
                {
                  wildcard: {
                    request_path: {
                      // Add '*' to partially match the url
                      value: `${requestPath}*`,
                    },
                  },
                },
              ],
            },
          },
          filter: {
            range: {
              request_at: {
                lt: today,
                // Extend request to both interval. It needs to compare two interval
                gte: twoWeeksAgo,
              },
            },
          },
        },
      },
      aggs: {
        // Get statistic for current period and previous period
        group_by_interval: {
          range: {
            field: 'request_at',
            keyed: true,
            // Includes the *from* value and excludes the *to* value
            ranges: [
              {
                key: 'previousPeriod',
                from: twoWeeksAgo,
                to: oneWeekAgo,
              },
              {
                key: 'currentPeriod',
                from: oneWeekAgo,
                to: today,
              },
            ],
          },
          // Get data for each period
          aggs: {
            // Get data over interval:
            // number of requests, percentiles of response time, unique users

            // Number of requests over interval
            requests_over_time: {
              date_histogram: {
                field: 'request_at',
                interval: 'day',
              },
              aggs: {
                // median response time over interval
                percentiles_response_time: {
                  percentiles: {
                    field: 'response_time',
                    percents: [50],
                  },
                },
                // Count of Unique users over interval
                unique_users: {
                  terms: {
                    field: 'user_id',
                  },
                },
              },
            },
            // Get total count for general request_path:
            // percentiles of response time, unique users, response status

            // Get median response time
            response_time: {
              percentiles: {
                field: 'response_time',
                percents: [50],
              },
            },
            // Get total count of unique users
            unique_users: {
              terms: {
                field: 'user_id',
              },
            },
            // Get total count of each response status
            response_status: {
              range: {
                field: 'response_status',
                keyed: true,
                // Includes the *from* value and excludes the *to* value for each range.
                ranges: [
                  { key: 'success', from: 200, to: 300 },
                  { key: 'redirect', from: 300, to: 400 },
                  { key: 'fail', from: 400, to: 500 },
                  { key: 'error', from: 500, to: 600 },
                ],
              },
            },
            // Get data about each called request_path
            group_by_request_path: {
              // Get all called request_path
              terms: {
                field: 'request_path',
              },
              // Get data for each request_path
              aggs: {
                // Get data over interval:
                // number of requests, percentiles of response time, Response statuses

                // Number of requests over interval
                requests_over_time: {
                  date_histogram: {
                    field: 'request_at',
                    interval: 'day',
                  },
                  aggs: {
                    // Percentiles of response time over interval
                    percentiles_response_time: {
                      percentiles: {
                        field: 'response_time',
                        percents: [95, 50],
                      },
                    },
                    // Response statuses of requests over interval
                    response_status: {
                      range: {
                        field: 'response_status',
                        keyed: true,
                        // Includes the *from* value and excludes the *to* value for each range.
                        ranges: [
                          { key: 'success', from: 200, to: 300 },
                          { key: 'redirect', from: 300, to: 400 },
                          { key: 'fail', from: 400, to: 500 },
                          { key: 'error', from: 500, to: 600 },
                        ],
                      },
                    },
                  },
                },
                // Data about errors
                errors_statistic: {
                  // Get only response with error status code (4xx and 5xx)
                  filter: {
                    range: {
                      response_status: {
                        gte: 400,
                      },
                    },
                  },
                  aggs: {
                    // Get date detailed by minute. Timestamp - key
                    errors_over_time: {
                      date_histogram: {
                        field: 'request_at',
                        interval: 'minute',
                      },
                      aggs: {
                        // Return values of errors status code. Calls - doc_count, code - key
                        status: {
                          terms: {
                            field: 'response_status',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            most_frequent_users: {
              terms: {
                field: 'user_id',
              },
              aggs: {
                // Get user e-mail (key)
                user_email: {
                  terms: {
                    field: 'user_email',
                  },
                },
                // Get requested paths (key) and number of requests (doc_count)
                request_path: {
                  terms: {
                    field: 'request_path',
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}
