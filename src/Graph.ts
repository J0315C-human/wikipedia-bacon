export interface GraphNode {
  id: string;
}

/** This will be used by the BFS to do the graph-traversy things */
export interface Graph<T extends GraphNode> {
  markVisited: (node: T) => void;
  setParent: (child: T, parent: T) => void;
  /** Get neighbors of a node that haven't been marked as visited. Goal ID is passed to prevent
   * fetching unneeded data.
   */
  getUnvisitedNeighbors: (node: T, goalId: string) => Promise<T[]>;
  /** starting from the endpoint, get the full path by walking back to each page's parent */
  getParentPath: (start: T, end: T) => T[];
  /** mark everything unvisited and remove parents */
  resetTraversalState: () => void;
}
