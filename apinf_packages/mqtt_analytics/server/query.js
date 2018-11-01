/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
*/

export default function topicsDataOnePeriodRequest (dateRange, filters, clientFilters) {
  return {
    query: {
      bool: {
        must: [
          {
            range: {
              timestamp: {
                gte: dateRange.from,
                lt: dateRange.to,
              },
            },
          },
        ],
      },
    },
    aggs: {
      group_by_topic: {
        filters,
        aggs: {
          message_published: {
            filter: {
              term: {
                event: 'message_published',
              },
            },
            aggs: {
              client_publish: {
                cardinality: {
                  field: 'from.client_id.keyword',
                },
              },
              incoming_bandwidth: {
                sum: { field: 'size' },
              },
            },
          },
          message_delivered: {
            filter: {
              term: {
                event: 'message_delivered',
              },
            },
            aggs: {
              outgoing_bandwidth: {
                sum: { field: 'size' },
              },
            },
          },
        },
      },
      clients: {
        filters: clientFilters,
        aggs: {
          client_subscribe: {
            filter: {
              term: {
                event: 'client_subscribe',
              },
            },
          },
        },
      },
    },
  };
}
