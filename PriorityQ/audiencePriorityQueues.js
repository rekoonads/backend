import Bidder from '../models/bidder.js';
import PriorityQueue from './priorityQueue.js';

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
}

const instance = new AudiencePriorityQueues();
export default instance;
