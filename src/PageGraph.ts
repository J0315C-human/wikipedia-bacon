import { Graph } from './Graph';

export interface Page {
  id: string; // use URL as ID
  outgoingLinks: string[];
  parent?: Page;
}

export default class PageGraph implements Graph<Page> {
  getUnvisitedNeighbors: (node: Page) => Promise<Page[]>;
  getParentPath: (start: Page, end: Page) => Page[];
  markVisited: (node: Page) => void;
  setParent: (child: Page, parent: Page) => void;
  resetTraversalState: () => void;
}
