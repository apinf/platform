/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Fetching data for Search on Topics page
export function autoCompleteRequest (topic) {
  return JSON.stringify({
    size: 0,
    query: {
      bool: {
        filter: {
          match_phrase_prefix: {
            topic: {
              query: topic,
              max_expansions: 2,
            },
          },
        },
      },
    },
    aggs: {
      topic_value: {
        terms: { field: 'topic.keyword', size: 300 },
      },
    },
  });
}

export function topicsTablePublishedType (topicsFilter, dateRange) {
  return JSON.stringify({
    size: 0,
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
        filters: topicsFilter,
        aggs: {
          client_published: {
            cardinality: {
              field: 'from.client_id.keyword',
            },
          },
          incoming_bandwidth: {
            sum: { field: 'size' },
          },
        },
      },
    },
  });
}

export function topicsTableDeliveredType (topicsFilter, dateRange) {
  return JSON.stringify({
    size: 0,
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
        filters: topicsFilter,
        aggs: {
          outgoing_bandwidth: {
            sum: { field: 'size' },
          },
        },
      },
    },
  });
}

export function topicsTableSubscribedType (topicsFilter, dateRange) {
  return JSON.stringify({
    size: 0,
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
        filters: topicsFilter,
        aggs: {
          client_subscribe: {
            cardinality: {
              field: 'client_id.keyword',
            },
          },
        },
      },
    },
  });
}

export function remainingTrafficPublishedType (filter, dateRange) {
  return JSON.stringify({
    size: 0,
    query: {
      bool: {
        must_not: filter,
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
      client_published: {
        cardinality: {
          field: 'from.client_id.keyword',
        },
      },
      incoming_bandwidth: {
        sum: { field: 'size' },
      },
    },
  });
}

export function remainingTrafficDeliveredType (filter, dateRange) {
  return JSON.stringify({
    size: 0,
    query: {
      bool: {
        must_not: filter,
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
      outgoing_bandwidth: {
        sum: { field: 'size' },
      },
    },
  });
}
export function remainingTrafficSubscribedType (filter, dateRange) {
  return JSON.stringify({
    size: 0,
    query: {
      bool: {
        must_not: filter,
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
      client_subscribe: {
        cardinality: {
          field: 'client_id.keyword',
        },
      },
    },
  });
}
