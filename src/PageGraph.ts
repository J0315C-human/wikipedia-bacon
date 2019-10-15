import { Graph } from './Graph';
import { getPageFromUrl } from './utils';
import { FETCH_RETRIES } from './constants';

export interface Page {
  id: string; // use URL as ID
  outgoingLinks: string[];
  parent?: Page;
  pathString: string;
}

export default class PageGraph implements Graph<Page> {
  visitedUrls = new Set<string>([]);

  getUnvisitedNeighbors = async (node: Page): Promise<(Page | undefined)[]> => {
    const unvisitedUrls = node.outgoingLinks.filter(url => {
      return !this.visitedUrls.has(url);
    });
    const pages = await Promise.all(
      unvisitedUrls.map(async url => getPageFromUrl(url, node, FETCH_RETRIES))
    );
    return pages.filter(page => page !== undefined);
  };

  getParentPath = (start: Page, end: Page): Page[] => {
    let path = [end];
    let page = end;
    while (page.id !== start.id && page.parent !== undefined) {
      page = page.parent;
      path = [page, ...path];
    }
    return path;
  };

  markVisited = (node: Page) => {
    this.visitedUrls.add(node.id);
  };

  setParent = (child: Page, parent: Page) => {
    child.parent = parent;
  };

  resetTraversalState = () => {
    this.visitedUrls.clear();
  };
}
