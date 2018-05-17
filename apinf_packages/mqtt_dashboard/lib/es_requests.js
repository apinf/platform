/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Fetch data for Topics table
export function topicsDataRequest (dateRange, filters, clientFilters) {
  return {
    query: {
      bool: {
        must: [
          {
            range: {
              timestamp: {
                gte: dateRange.doublePeriodAgo,
                lt: dateRange.to,
              },
            },
          },
        ],
      },
    },
    aggs: {
      group_by_interval: {
        range: {
          field: 'timestamp',
          keyed: true,
          ranges: [
            {
              key: 'previousPeriod',
              from: dateRange.doublePeriodAgo,
              to: dateRange.onePeriodAgo,
            },
            {
              key: 'currentPeriod',
              from: dateRange.onePeriodAgo,
              to: dateRange.to,
            },
          ],
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
      },
    },
  };
}

// Fetch date histogram for particular Topic event Type (detailed page)
export function particularTopicHistogramRequest (eventType, dateRange, topicValue) {
  let topicFilter = { prefix: { 'topic.keyword': topicValue } };
  let clientPublishFilter = {};
  let event = eventType;

  switch (eventType) {
    case 'client_publish':
      clientPublishFilter = {
        client_publish: {
          cardinality: { field: 'from.client_id.keyword' },
        },
      };
      event = 'message_published';
      break;
    case 'client_subscribe':
      topicFilter = { term: { [`topics.${topicValue}.qos`]: 0 } };
      break;
    case 'incoming_bandwidth':
      event = 'message_published';

      clientPublishFilter = {
        incoming_bandwidth: {
          sum: { field: 'size' },
        },
      };
      break;
    case 'outgoing_bandwidth':
      event = 'message_delivered';

      clientPublishFilter = {
        outgoing_bandwidth: {
          sum: { field: 'size' },
        },
      };
      break;
    default:
      clientPublishFilter = {};
      break;
  }

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
          {
            term: {
              event,
            },
          },
          topicFilter,
        ],
      },
    },
    aggs: {
      data_over_time: {
        date_histogram: {
          field: 'timestamp',
          interval: dateRange.interval,
        },
        aggs: clientPublishFilter,
      },
    },
  };
}

// Fetch summary statistics for particular Topic (detailed page)
export function particularTopicStatisticsRequest (dateRange, topic) {
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
      topic_types: {
        filter: { prefix: { 'topic.keyword': topic } },
        aggs: {
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
          message_published: {
            filter: {
              term: {
                event: 'message_published',
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
          },
        },
      },
      client_subscribe: {
        filter: { term: { [`topics.${topic}.qos`]: 0 } },
      },
    },
  };
}

// Fetching data for Search on Topics page
export function autoCompleteRequest (topic) {
  return {
    query: {},
    aggs: {
      autocomplete: {
        filter: { match_phrase_prefix: { topic } },
        aggs: {
          topic_value: {
            terms: { field: 'topic.keyword', size: 300 },
          },
        },
      },
    },
  };
}

// Fetch data for Topics table (remaining traffic)
export function remainingTrafficRequest (dateRange, filter) {
  return {
    query: {
      bool: {
        must_not: filter,
      },
    },
    aggs: {
      group_by_interval: {
        range: {
          field: 'timestamp',
          keyed: true,
          ranges: [
            {
              key: 'previousPeriod',
              from: dateRange.doublePeriodAgo,
              to: dateRange.onePeriodAgo,
            },
            {
              key: 'currentPeriod',
              from: dateRange.onePeriodAgo,
              to: dateRange.to,
            },
          ],
        },
        aggs: {
          message_published: {
            filter: { term: { event: 'message_published' } },
            aggs: {
              client_publish: {
                cardinality: { field: 'from.client_id.keyword' },
              },
              incoming_bandwidth: {
                sum: { field: 'size' },
              },
            },
          },
          message_delivered: {
            filter: { term: { event: 'message_delivered' } },
            aggs: {
              outgoing_bandwidth: {
                sum: { field: 'size' },
              },
            },
          },
          client_subscribe: {
            filter: { term: { event: 'client_subscribe' } },
          },
        },
      },
    },
  };
}

// MQTT Dashboard page
export function histogramDataRequestAllTopics (dateRange) {
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
      published: {
        filter: { term: { event: 'message_published' } },
        aggs: {
          data_over_time: {
            date_histogram: {
              field: 'timestamp',
              interval: dateRange.interval,
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
        },
      },
      message_delivered: {
        filter: { term: { event: 'message_delivered' } },
        aggs: {
          data_over_time: {
            date_histogram: {
              field: 'timestamp',
              interval: dateRange.interval,
            },
            aggs: {
              outgoing_bandwidth: {
                sum: { field: 'size' },
              },
            },
          },
        },
      },
      client_subscribe: {
        filter: { term: { event: 'client_subscribe' } },
        aggs: {
          data_over_time: {
            date_histogram: {
              field: 'timestamp',
              interval: dateRange.interval,
            },
          },
        },
      },
    },
  };
}

// MQTT Dashboard page
export function summaryStatisticsTopicsRequest (dateRange) {
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
      message_published: {
        filter: {
          term: {
            event: 'message_published',
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
      },
      client_subscribe: {
        filter: {
          term: {
            event: 'client_subscribe',
          },
        },
      },
    },
  };
}

export function topicsTablePublishedType (topicsFilter) {
  return JSON.stringify({
    size: 0,
    query: {
      bool: {},
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

export function topicsTableDeliveredType (topicsFilter) {
  return JSON.stringify({
    size: 0,
    query: {
      bool: {},
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

export function topicsTableSubscribedType (topicsFilter) {
  return JSON.stringify({
    size: 0,
    query: {
      bool: {},
    },
    aggs: {
      group_by_topic: {
        filters: topicsFilter,
        aggs: {
          client_subscribe: {
            cardinality: {
              field: 'client_id',
            },
          },
        },
      },
    },
  });
}
// eslint-disabled next-line
export function indexesSet (timeframe, eventType, period) {
  // Last 24 hours
  if (timeframe === '48') {
    return `<${eventType}-{now/d}>,<${eventType}-{now/d-1d}>`;
  }

  // Last 7 days
  if (timeframe === '7') {
    if (period === 'current') {
      return `<${eventType}-{now/d}>,<${eventType}-{now/d-1d}>,` +
        `<${eventType}-{now/d-2d}>,<${eventType}-{now/d-3d}>,` +
        `<${eventType}-{now/d-4d}>,<${eventType}-{now/d-5d}>,` +
        `<${eventType}-{now/d-6d}>`;
    }

    // Previous period
    return `<${eventType}-{now/d-7d}>,<${eventType}-{now/d-8d}>,` +
      `<${eventType}-{now/d-9d}>,<${eventType}-{now/d-10d}>,` +
      `<${eventType}-{now/d-11d}>,<${eventType}-{now/d-12d}>,` +
      `<${eventType}-{now/d-13d}>`;
  }

  // Last 30 days
  if (timeframe === '30') {
    return `<${eventType}-*>`;
  }

  // By default send for current day
  if (period === 'current') {
    return `<${eventType}-{now/d}>`;
  }
  return `<${eventType}-{now/d-1d}>`;
}
