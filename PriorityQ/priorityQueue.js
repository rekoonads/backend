export default class PriorityQueue {
    constructor() {
      this.queue = [];
    }
  
    // Helper method to parse and compare budget values
    static parseBudget(budget) {
      return parseInt(budget, 10);
    }
  
    // Method to add an advertiser to the queue
    enqueue(advertiser) {
      if (!advertiser || !advertiser.campaignBudget) {
        throw new Error('Advertiser data or campaignBudget is missing.');
      }
  
      const budget = PriorityQueue.parseBudget(advertiser.campaignBudget);
      let added = false;
  
      // Insert in the correct position to maintain priority order
      for (let i = 0; i < this.queue.length; i++) {
        if (budget > PriorityQueue.parseBudget(this.queue[i].campaignBudget)) {
          this.queue.splice(i, 0, advertiser);
          added = true;
          break;
        }
      }
  
      if (!added) {
        this.queue.push(advertiser);
      }
    }
  
    // Method to remove and return the advertiser with the highest budget
    dequeue() {
      return this.queue.shift();
    }
  
    // Method to peek at the top of the queue without removing it
    peek() {
      return this.queue[0];
    }
  
    // Method to check if the queue is empty
    isEmpty() {
      return this.queue.length === 0;
    }
  
    // Method to get the size of the queue
    size() {
      return this.queue.length;
    }
  }
  