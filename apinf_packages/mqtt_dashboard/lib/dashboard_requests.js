/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

export function histogramDashboardPublishedType (dateRange) {
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
      data_over_time: {
        date_histogram: {
          field: 'timestamp',
          interval: 'hour',
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
  });
}

export function histogramDashboardDeliveredType (dateRange) {
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
      data_over_time: {
        date_histogram: {
          field: 'timestamp',
          interval: 'hour',
        },
        aggs: {
          outgoing_bandwidth: {
            sum: { field: 'size' },
          },
        },
      },
    },
  });
}

export function histogramDashboardSubscribedType (dateRange) {
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
      data_over_time: {
        date_histogram: {
          field: 'timestamp',
          interval: 'hour',
        },
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

export function statisticsDashboardPublishedType (dateRange) {
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

export function statisticsDashboardDeliveredType (dateRange) {
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
      outgoing_bandwidth: {
        sum: { field: 'size' },
      },
    },
  });
}

export function statisticsDashboardSubscribedType (dateRange) {
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
      client_subscribe: {
        cardinality: {
          field: 'client_id.keyword',
        },
      },
    },
  });
}
