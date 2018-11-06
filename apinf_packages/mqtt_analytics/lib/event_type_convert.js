/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

export default function eventTypeConvert (eventType) {
  switch (eventType) {
    case 'message_published': {
      return 'publishedMessages';
    }
    case 'message_delivered': {
      return 'deliveredMessages';
    }
    case 'client_publish': {
      return 'publishedClients';
    }
    case 'client_subscribe': {
      return 'subscribedClients';
    }
    case 'incoming_bandwidth': {
      return 'incomingBandwidth';
    }
    // outgoing_bandwidth
    default: {
      return 'outgoingBandwidth';
    }
  }
}
