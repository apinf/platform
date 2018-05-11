/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

export default function overviewChartsRequest (filtersPaths, dateRange) {
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
                    gte: dateRange.fromDate,
                    lt: dateRange.toDate,
                  },
                },
              },
            ],
          },
        },
      },
      aggregations: {
        group_by_request_path: {
          filters: filtersPaths,
          aggs: {
            // Get number of request for each day in week and for each period
            requests_over_time: {
              date_histogram: {
                field: 'request_at',
                interval: dateRange.interval,
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
                  cardinality: {
                    field: 'user_id',
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
