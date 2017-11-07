/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

export default function mostUsersRequest (requestPath, dateRange) {
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
        most_frequent_users: {
          terms: {
            field: 'user_email',
            order: { _count: 'desc' },
          },
          aggs: {
            request_path: {
              terms: {
                field: 'request_path',
              },
            },
          },
        },
      },
    },
  };
}
