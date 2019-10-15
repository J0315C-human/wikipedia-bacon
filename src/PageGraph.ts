import { Graph } from './Graph';
import { getPageFromUrl, HttpLib } from './utils';
import { FETCH_RETRIES } from './constants';
import axios from 'axios';

export interface Page {
  id: string; // use URL as ID
  outgoingLinks: string[];
  parent?: Page;
  pathString: string;
}

export default class PageGraph implements Graph<Page> {
  visitedUrls = new Set<string>([]);
  httpLib: HttpLib;
  logging: boolean;
  getPage: (
    url: string,
    parent?: Page,
    retries?: number
  ) => Promise<Page | undefined>;

  constructor(httpLib: HttpLib = axios, logging = true) {
    this.httpLib = httpLib;
    this.logging = logging;
    // this is aliased here to be able to inject an http library for testing
    this.getPage = getPageFromUrl(httpLib);
  }

  getUnvisitedNeighbors = async (
    node: Page,
    goalUrl: string
  ): Promise<(Page | undefined)[]> => {
    if (this.logging) console.log(node.pathString);
    const unvisitedUrls = node.outgoingLinks.filter(url => {
      return !this.visitedUrls.has(url);
    });
    // give up on fetching all the pages if the goal Url is included
    if (unvisitedUrls.includes(goalUrl)) {
      const goalPage = await this.getPage(goalUrl, node, FETCH_RETRIES);
      return [goalPage];
    }
    const pages = await Promise.all(
      unvisitedUrls.map(async url => this.getPage(url, node, FETCH_RETRIES))
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
