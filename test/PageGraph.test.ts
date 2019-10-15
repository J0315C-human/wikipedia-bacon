import { expect } from 'chai';
import PageGraph from '../src/PageGraph';
import BFS from '../src/BFS';

const URLBASE = 'https://en.wikipedia.org/wiki/';
const pages = {
  [URLBASE + 'A']: ['/wiki/B', '/wiki/C', 'www.facebook.com'],
  [URLBASE + 'B']: ['/wiki/D', '/wiki/E', '#citationHere'],
  [URLBASE + 'C']: ['/wiki/F', '/wiki/G'],
  [URLBASE + 'E']: ['/wiki/B'],
  [URLBASE + 'F']: ['/wiki/B'],
  [URLBASE + 'G']: ['/wiki/H'],
  [URLBASE + 'H']: []
};

/** Get a fake wikipedia page's html */
const getHtmlWithLinks = (links: string[]) => {
  return `<html><head></head><body>
    <div id="mw-content-text">
      ${links.map(link => `<a href="${link}" />`).join('')}
    </div>
  </body></html>`;
};

/** This takes the place of real Axios HTTP calls */
const httpMock = async (url: string): Promise<{ data: string }> =>
  new Promise(resolve => {
    const links = pages[url] || [];
    setTimeout(
      () =>
        resolve({
          data: getHtmlWithLinks(links)
        }),
      10
    );
  });

// NOTE: these tests should stay in this order
describe('Page and PageGraph tests', async () => {
  const pageGraph = new PageGraph(httpMock, false);

  it('Page should have correct ID', async () => {
    const pageA = await pageGraph.getPage(URLBASE + 'A');

    expect(pageA.id).to.equal(URLBASE + 'A');
  });

  it('Page should have no parent at beginning', async () => {
    const pageA = await pageGraph.getPage(URLBASE + 'A');
    expect(pageA.parent).to.equal(undefined);
  });

  it('Page should have correct outgoingLinks', async () => {
    const pageA = await pageGraph.getPage(URLBASE + 'A');

    const expected = [URLBASE + 'B', URLBASE + 'C'];
    expect(pageA.outgoingLinks).to.eql(expected);
  });

  it('PageGraph should mark visited', async () => {
    const pageA = await pageGraph.getPage(URLBASE + 'A');
    pageGraph.markVisited(pageA);
    expect(pageGraph.visitedUrls.has(URLBASE + 'A')).to.equal(true);
  });

  it('PageGraph should set parent', async () => {
    const pageA = await pageGraph.getPage(URLBASE + 'A');
    const pageB = await pageGraph.getPage(URLBASE + 'B');
    pageGraph.setParent(pageB, pageA);
    expect(pageB.parent).to.equal(pageA);
  });

  it('PageGraph should get parent path even when not connected', async () => {
    const pageA = await pageGraph.getPage(URLBASE + 'A');
    expect(pageGraph.getParentPath(pageA, pageA)).to.eql([pageA]);
  });

  it('PageGraph should get parent path', async () => {
    const pageA = await pageGraph.getPage(URLBASE + 'A');
    const pageB = await pageGraph.getPage(URLBASE + 'B');
    const pageC = await pageGraph.getPage(URLBASE + 'C');
    pageGraph.setParent(pageB, pageA);
    pageGraph.setParent(pageC, pageB);
    expect(pageGraph.getParentPath(pageA, pageC)).to.eql([pageA, pageB, pageC]);
  });

  it('PageGraph should get unvisited neighbors', async () => {
    const pageA = await pageGraph.getPage(URLBASE + 'A');
    const pageB = await pageGraph.getPage(URLBASE + 'B');
    pageGraph.markVisited(pageB);
    const neighbors = await pageGraph.getUnvisitedNeighbors(pageA, 'noGoalUrl');
    expect(neighbors.length).to.eql(1);
    expect(neighbors[0].id).to.equal(URLBASE + 'C');
  });

  it('PageGraph should clear traversal state', async () => {
    pageGraph.resetTraversalState();
    expect(pageGraph.visitedUrls.size).to.equal(0);
  });

  it('PageGraph.getUnvisitedNeighbors should get only Goal Node when it is found', async () => {
    const pageA = await pageGraph.getPage(URLBASE + 'A');
    const neighbors = await pageGraph.getUnvisitedNeighbors(
      pageA,
      URLBASE + 'C'
    );
    expect(neighbors.length).to.eql(1);
    expect(neighbors[0].id).to.equal(URLBASE + 'C');
  });

  it('BFS using PageGraph should find a path', async () => {
    const bfs = new BFS(pageGraph);
    const pageA = await pageGraph.getPage(URLBASE + 'A');
    const result = await bfs.performBFS(pageA, URLBASE + 'H');
    expect(result.map(r => r.id)).to.eql([
      URLBASE + 'A',
      URLBASE + 'C',
      URLBASE + 'G',
      URLBASE + 'H'
    ]);
  });
});
