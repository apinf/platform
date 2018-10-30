/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

export function histogramTopicGeneralType (dateRange, eventType, topic) {
  let topicFilter = { prefix: { 'topic.keyword': topic } };
  let aggs;

  switch (eventType) {
    case 'incoming_bandwidth':
      aggs = {
        chart_point: {
          sum: { field: 'size' },
        },
      };
      break;
    case 'outgoing_bandwidth':
      aggs = {
        chart_point: {
          sum: { field: 'size' },
        },
      };
      break;
    case 'client_publish':
      aggs = {
        chart_point: {
          cardinality: { field: 'from.client_id.keyword' },
        },
      };
      break;
    case 'client_subscribe':
      topicFilter = { term: { [`topics.${topic}.qos`]: 0 } };

      aggs = {
        chart_point: {
          cardinality: { field: 'client_id.keyword' },
        },
      };
      break;
    default:
      // Published messages OR Delivered messages no need aggs
      aggs = {};
      break;
  }

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
        aggs,
      },
    },
  });
}

export function statisticsTopicPublishedType (dateRange, topic) {
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
          {
            prefix: { 'topic.keyword': topic },
          },
        ],
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
  });
}

export function statisticsTopicDeliveredType (dateRange, topic) {
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
          {
            prefix: { 'topic.keyword': topic },
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

export function statisticsTopicSubscribedType (dateRange, topic) {
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
          {
            term: { [`topics.${topic}#.qos`]: 0 },
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
