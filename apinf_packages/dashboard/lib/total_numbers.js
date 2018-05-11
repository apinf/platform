/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

export default function totalNumbersRequest (dateRange, filtersPaths) {
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
                    gte: dateRange.doublePeriodAgo,
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
            by_period: {
              // Separate current and previous period
              // Also get requests number per period
              range: {
                field: 'request_at',
                keyed: true,
                ranges: [
                  {
                    key: 'previous',
                    from: dateRange.doublePeriodAgo,
                    to: dateRange.onePeriodAgo,
                  },
                  {
                    key: 'current',
                    from: dateRange.onePeriodAgo,
                    to: dateRange.toDate,
                  },
                ],
              },
              aggs: {
                // Get the median response time over interval
                median_response_time: {
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
