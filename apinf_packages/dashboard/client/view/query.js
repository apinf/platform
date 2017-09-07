 /* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
*/

// Npm packages imports
import moment from 'moment';

export default function queryForDashboardPage (proxyBackendPaths, timeframe) {
  // Plus one day to include current day in selection
  const today = moment().add(1, 'days').format('YYYY-MM-DD');

  // Make it depends on timeframe
  const oneTimePeriodAgo = moment().subtract(timeframe, 'days').format('YYYY-MM-DD');
  const twoTimePeriodsAgo = moment().subtract(2 * timeframe, 'days').format('YYYY-MM-DD');

  return {
    size: 0,
    body: {
      query: {
        filtered: {
          query: {
            bool: {
              should: proxyBackendPaths,
            },
          },
          filter: {
            range: {
              // Extend request to both interval. It needs to compare two interval
              request_at: {
                lt: today,
                gte: twoTimePeriodsAgo,
              },
            },
          },
        },
      },
      aggs: {
        // Get summary statistic for each request_path
        group_by_request_path: {
          // Get number of calls
          terms: {
            field: 'request_path',
          },
          aggs: {
            // Get statistic for each period(current and previous)
            group_by_interval: {
              range: {
                field: 'request_at',
                keyed: true,
                // Includes the *from* value and excludes the *to* value for each range.
                ranges: [
                  {
                    key: 'previousPeriod',
                    from: twoTimePeriodsAgo,
                    to: oneTimePeriodAgo,
                  },
                  {
                    key: 'currentPeriod',
                    from: oneTimePeriodAgo,
                    to: today,
                  },
                ],
              },
              aggs: {
                // Get median response time for each request_path and for each period
                response_time: {
                  percentiles: {
                    field: 'response_time',
                    percents: [50],
                  },
                },
                // Get user_id for each request_path and for each period
                unique_users: {
                  terms: {
                    field: 'user_id',
                  },
                },
                // Get count of success calls (2xx)
                success_status: {
                  range: {
                    field: 'response_status',
                    keyed: true,
                    // Includes the *from* value and excludes the *to* value for each range.
                    ranges: [
                      { key: 'success', from: 200, to: 300 },
                      { key: 'error', from: 500, to: 600 },
                    ],
                  },
                },
                // Get number of request for each day in week and for each period
                requests_over_time: {
                  date_histogram: {
                    field: 'request_at',
                    interval: 'week',
                  },
                  aggs: {
                    // Get the median response time over interval
                    percentiles_response_time: {
                      percentiles: {
                        field: 'response_time',
                        percents: [50],
                      },
                    },
                    unique_users: {
                      terms: {
                        field: 'user_id',
                      },
                    },
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
