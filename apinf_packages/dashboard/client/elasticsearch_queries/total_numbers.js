 /* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
*/
export default function totalNumbersRequest (filtersPaths, dateRange) {
  return {
    size: 0,
    body: {
      query: {
        filtered: {
          filter: {
            range: {
              // Extend request to both intervals. It needs to compare two intervals
              request_at: {
                lt: dateRange.today,
                gte: dateRange.twoTimePeriodsAgo,
              },
            },
          },
        },
      },
      aggregations: {
        // Get summary statistic per request_path
        group_by_request_path: {
          filters: filtersPaths,
          aggregations: {
            group_by_interval: {
              // Separate current and previous period
              // Also get requests number per period
              range: {
                field: 'request_at',
                keyed: true,
                ranges: [
                  {
                    key: 'previousPeriod',
                    from: dateRange.twoTimePeriodsAgo,
                    to: dateRange.oneTimePeriodAgo,
                  },
                  {
                    key: 'currentPeriod',
                    from: dateRange.oneTimePeriodAgo,
                    to: dateRange.today,
                  },
                ],
              },
              aggregations: {
                // Get median response time
                median_response_time: {
                  percentiles: {
                    field: 'response_time',
                    percents: [50],
                  },
                },
                // Get count of unique users
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
