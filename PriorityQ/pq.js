"use strict";

class DataNodes {
  constructor(money, id,AdUrl) {
    this.money = money;
    this.id = id;
    this.AdUrl = AdUrl;
  }
}

export class PriorityQ {
  constructor() {
    this.qList = [];
  }

  size() {
    return this.qList.length;
  }

  isEmpty() {
    this.size = 0;
  }

  enqueue(money, id, AdUrl) {
    let newData = new DataNodes(money, id, AdUrl);
    let constain = false;
    let i = 0;

    while (i < this.size() && !constain) {
      if (newData.money > this.qList[i].money) {
        this.qList.splice(i, 0, newData);
        constain = true;
      }
      i++;
    }

    if (!constain) {
      this.qList.push(newData);
    }
    return this.size() > 0 ? `The ${newData} has been added` : null;
  }

  dequeue() {
    if (this.size() > 0) {
      let topData = this.qList.shift();
      console.log(topData);
      return topData;
    } else {
      return `The Stack is Empty`;
    }
  }

  deleteUserData(id) {
    let newDataList = this.qList.filter((obj) => obj.id !== id);
    this.qList = newDataList;
    return this.qList;
  }

  print(){
    console.log(this.qList);
    return this.qList;
  }
}

// const pq = new PriorityQ();
// pq.enqueue(100, 2, 'www.google.com');
// pq.enqueue(200, 1, 'www.flipkart.com');
// pq.dequeue();
// pq.print();
