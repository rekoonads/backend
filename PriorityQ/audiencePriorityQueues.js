import Bidder from '../models/bidder.js';
import PriorityQueue from './priorityQueue.js';
import { DOMParser } from 'xmldom';

class AudiencePriorityQueues {
  constructor() {
    if (AudiencePriorityQueues.instance) {
      return AudiencePriorityQueues.instance;
    }
    this.queues = {}; // Store priority queues by audience name
    AudiencePriorityQueues.instance = this;
  }

  async fetchAndEnqueue(audience) {
    try {
      const advertisers = await Bidder.find({ audiences: audience });
      // console.log(advertisers)

      if (advertisers.length > 0) {
        if (!this.queues[audience]) {
          this.queues[audience] = new PriorityQueue();
        }

        advertisers.forEach(advertiser => {
          this.queues[audience].enqueue(advertiser);
        });
      }
    } catch (err) {
      console.error(`Error fetching advertisers for ${audience}:`, err);
    }
  }
  

  async fetchVASTMedia(vastUrl) {
    try {
        const response = await fetch(vastUrl);
        const vastXml = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(vastXml, 'text/xml');

        // Assuming the media file is within a <MediaFile> tag
        const mediaFileElement = xmlDoc.getElementsByTagName('MediaFile')[0];
        if (mediaFileElement) {
            const mediaUrl = mediaFileElement.textContent.trim();
            console.log('Media URL:', mediaUrl);
            return mediaUrl;
        } else {
            console.error('Media file not found in the VAST response.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching or parsing the VAST URL:', error);
        return null;
    }
}
  async getTopAdvertiserByAudience(audience) {
    if (!this.queues[audience] || this.queues[audience].isEmpty()) {
      await this.fetchAndEnqueue(audience);
    }

    if (this.queues[audience] && !this.queues[audience].isEmpty()) {
      const topAdvertiser = this.queues[audience].dequeue();
      console.log("adds called by vasturl:-  "+topAdvertiser.reviveUrl)
      return topAdvertiser.reviveUrl;
    } else {
      console.log(`No advertisers found for audience: ${audience}`);
      return null;
    }
  }
  async getTopAdvertiserByAudiencemedia(audience) {
    if (!this.queues[audience] || this.queues[audience].isEmpty()) {
      await this.fetchAndEnqueue(audience);
    }

    if (this.queues[audience] && !this.queues[audience].isEmpty()) {
      const topAdvertiser = this.queues[audience].dequeue();
      console.log("adds called by vasturl:-  "+topAdvertiser.reviveUrl)
      const vasturl = topAdvertiser.reviveUrl;
      const mediafile = this.fetchVASTMedia(vasturl);
      return mediafile;
    } else {
      console.log(`No advertisers found for audience: ${audience}`);
      return null;
    }
  }
}

const instance = new AudiencePriorityQueues();
export default instance;
