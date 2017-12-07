/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

export default function errorsStatisticsRequest (requestPath, dateRange) {
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
                range: {
                  response_status: {
                    gte: 400,
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
        // Get date detailed by hour. Timestamp - key
        errors_over_time: {
          date_histogram: {
            field: 'request_at',
            interval: 'day',
            order: { _key: 'desc' },
          },
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
  };
}
