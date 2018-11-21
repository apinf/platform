/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

export default function responseStatusCodesRequest (dateRange, filtersPaths) {
  return {
    size: 0,
    body: {
      query: {
        filtered: {
          filter: {
            range: {
              request_at: {
                gte: dateRange.fromDate,
                lt: dateRange.toDate,
              },
            },
          },
        },
      },
      aggregations: {
        // Get summary statistic per request_path
        group_by_request_path: {
          // Get number of calls
          filters: filtersPaths,
          aggregations: {
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
          },
        },
      },
    },
  };
}
