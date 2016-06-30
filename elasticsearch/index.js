import ElasticSearch from 'elasticsearch';

const host = Settings.elasticsearch.host;

export const esClient = new ElasticSearch.Client({ host });
