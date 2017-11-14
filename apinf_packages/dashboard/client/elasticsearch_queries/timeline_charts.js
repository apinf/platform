/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

export default function timelineChartsRequest (requestPath, dateRange) {
  return {
    size: 0,
    body: {
      query: {
        filtered: {
          filter: {
            and: [
              {
                range: {
                  request_at: {
                    lt: dateRange.today,
                    gte: dateRange.oneTimePeriodAgo,
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
      aggregations: {
        group_by_request_path: {
          terms: {
            field: 'request_path',
          },
          aggregations: {
            // Get data per day
            requests_over_time: {
              date_histogram: {
                field: 'request_at',
                interval: 'day',
              },
              aggregations: {
                // Get percentiles per each day
                percentiles_response_time: {
                  percentiles: {
                    field: 'response_time',
                    percents: [95, 50],
                  },
                },
                // Get status codes per each day
                response_status: {
                  // Includes the *from* value and excludes the *to* value for each range
                  range: {
                    field: 'response_status',
                    keyed: true,
                    ranges: [
                      {
                        key: 'success',
                        from: 200,
                        to: 300,
                      },
                      {
                        key: 'redirect',
                        from: 300,
                        to: 400,
                      },
                      {
                        key: 'fail',
                        from: 400,
                        to: 500,
                      },
                      {
                        key: 'error',
                        from: 500,
                        to: 600,
                      },
                    ],
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
