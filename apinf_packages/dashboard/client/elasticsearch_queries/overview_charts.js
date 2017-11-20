 /* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
*/
export default function overviewChartsRequest (filtersPaths, dateRange) {
  return {
    size: 0,
    body: {
      query: {
        filtered: {
          filter: {
            range: {
              request_at: {
                lt: dateRange.today,
                gte: dateRange.oneTimePeriodAgo,
              },
            },
          },
        },
      },
      aggregations: {
        // Get summary statistic for each request_path
        group_by_request_path: {
          // Get number of calls
          filters: filtersPaths,
          aggregations: {
            // Get number of request for each day in week and for each period
            requests_over_time: {
              date_histogram: {
                field: 'request_at',
                interval: 'day',
              },
              aggregations: {
                // Get the median response time over interval
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
              },
            },
          },
        },
      },
    },
  };
}
