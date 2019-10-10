export interface GraphNode {
  id: string;
}

export interface Graph<T extends GraphNode> {
  getUnvisitedNeighbors: (node: T) => Promise<T[]>;
  getParentPath: (start: T, end: T) => T[];
  markVisited: (node: T) => void;
  setParent: (child: T, parent: T) => void;
  /** mark everything unvisited and remove parents */
  resetTraversalState: () => void;
}
