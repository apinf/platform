/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
*/

export default function aggregatedData (filtersPaths, fromDate, toDate) {
  return {
    size: 0,
    body: {
      query: {
        filtered: {
          filter: {
            range: {
              request_at: {
                lt: toDate,
                gte: fromDate,
              },
            },
          },
        },
      },
      aggregations: {
        // Get summary statistic for each request_path
        group_by_request_path: {
          filters: filtersPaths,
          aggregations: {
            // Get number of calls
            requests_number: {
              value_count: {
                field: 'request_at',
              },
            },
            // Get the median response time
            median_response_time: {
              percentiles: {
                field: 'response_time',
                percents: [50],
              },
            },
            // Get number of unique users
            unique_users: {
              terms: {
                field: 'user_id',
              },
            },
            // Get count of all status codes
            response_status: {
              range: {
                field: 'response_status',
                keyed: true,
                // Includes the *from* value and excludes the *to* value for each range
                ranges: [
                  { key: 'success', from: 200, to: 300 },
                  { key: 'redirect', from: 300, to: 400 },
                  { key: 'fail', from: 400, to: 500 },
                  { key: 'error', from: 500, to: 600 },
                ],
              },
            },
            request_paths: {
              terms: {
                field: 'request_path',
              },
              aggregations: {
                // Get percentiles
                percentiles_response_time: {
                  percentiles: {
                    field: 'response_time',
                    percents: [95, 50],
                  },
                },
                // Get status codes
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
            errors_statistics: {
              filter: { range: { response_status: { gte: 400 } } },
              aggs: {
                request_path: {
                  terms: {
                    field: 'request_path',
                  },
                  aggs: {
                    // Return values of errors status code. Calls - doc_count, code - key
                    response_status: {
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
      },
    },
  };
}
