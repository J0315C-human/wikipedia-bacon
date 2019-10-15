import { Graph, GraphNode } from './Graph';
import Queue from './Queue';

/** Generic Breadth-First Search class */
export default class BFS<Node extends GraphNode> {
  queue = new Queue<Node>();
  graph: Graph<Node>;

  constructor(graph: Graph<Node>) {
    this.graph = graph;
  }

  private markNodeVisited = (node: Node) => {
    this.graph.markVisited(node);
    this.queue.push(node);
  };

  private enqueueUnvisitedNeighbors = async (node: Node) => {
    const neighbors = await this.graph.getUnvisitedNeighbors(node);
    neighbors.forEach(neighbor => {
      this.graph.markVisited(neighbor);
      this.queue.push(neighbor);
      this.markNodeVisited(neighbor);
      this.graph.setParent(neighbor, node);
    });
  };

  performBFS = async (start: Node, goalId: string) => {
    // reset bookkeeping state
    this.queue.clear();
    this.graph.resetTraversalState();
    // start BFS algorithm
    this.markNodeVisited(start);
    while (!this.queue.empty()) {
      const node = this.queue.pop();
      if (node.id === goalId) {
        // Goal node found
        return this.graph.getParentPath(start, node);
      }
      await this.enqueueUnvisitedNeighbors(node);
    }
    console.log('Unable to find path to ' + goalId);
    return null;
  };
}
