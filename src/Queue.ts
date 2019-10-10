/** Generic Queue to use in BFS */
export default class Queue<T> {
  queue = [] as T[];

  pop = () => {
    if (this.queue.length === 0) {
      return null;
    }
    return this.queue.shift();
  };

  push = (item: T) => {
    this.queue.push(item);
  };

  empty = () => this.queue.length === 0;

  clear = () => {
    this.queue = [];
  };
}
