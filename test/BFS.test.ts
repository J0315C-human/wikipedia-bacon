import BFS from '../src/BFS';
import { assert, expect } from 'chai';
import { Graph } from '../src/Graph';

interface Node {
  id: string;
  neighbors: Node[];
  parent?: Node;
}
class TestGraph implements Graph<Node> {
  visited = new Set();
  markVisited = node => {
    this.visited.add(node.id);
  };

  setParent = (child, parent) => {
    child.parent = parent;
  };

  getUnvisitedNeighbors = node => {
    return Promise.resolve(node.neighbors.filter(n => !this.visited.has(n.id)));
  };

  getParentPath = (start, end) => {
    let path = [end];
    let node = end;
    while (node.id !== start.id && node.parent !== undefined) {
      node = node.parent;
      path = [node, ...path];
    }
    return path;
  };
  resetTraversalState = () => {
    this.visited.clear();
  };
}

/** Make an object of Nodes, each with a single-character id, and each with neighbors populated */
const makeTestNodes = (ids: string[], edges: string[]) => {
  const nodes = {} as { [key: string]: Node };

  ids.forEach(id => {
    if (id.length !== 1) throw new Error('IDs should be single characters');
    nodes[id] = { id, neighbors: [] };
  });
  edges.forEach(edge => {
    if (edge.length !== 2) throw new Error('Edges should be two characters');
    const s = nodes[edge[0]];
    const e = nodes[edge[1]];
    if (s && e) {
      s.neighbors.push(e);
    }
  });
  return nodes;
};

/** gets the result of a BFS search as a single string of node ids, or null */
const testBFS = async (startNode: Node, goalId: string) => {
  const testBFS = new BFS(new TestGraph());
  const result = await testBFS.performBFS(startNode, goalId);
  if (!result) return null;
  return result.map(node => node.id).join('');
};

describe('Generic Breadth-First Search Tests', async () => {
  it("Should not find a path if one doesn't exist", async () => {
    const nodes = makeTestNodes(['A', 'B', 'C', 'D'], ['AB', 'BC', 'CA']);

    const result = await testBFS(nodes['A'], 'D');
    expect(result).to.be.a(
      'null',
      'Path was found when one did not exist. Path returned: ' + result
    );
  });

  it('Should find a path if one exists', async () => {
    const nodes = makeTestNodes(
      ['A', 'B', 'C', 'D', 'E'],
      ['AB', 'BC', 'CD', 'DE']
    );
    const result = await testBFS(nodes['A'], 'E');
    assert(
      result === 'ABCDE',
      `Incorrect Path Found - expected ABCDE got ${result}`
    );
  });

  it('Should find a path if start node is the end node', async () => {
    const nodes = makeTestNodes(['A'], []);
    const result = await testBFS(nodes['A'], 'A');
    assert(result === 'A', `Incorrect Path Found - expected A got ${result}`);
  });

  it('Should find a shorter path if one exists', async () => {
    const nodes = makeTestNodes(
      ['A', 'B', 'C', 'D', 'E', 'F'],
      ['AB', 'BC', 'CD', 'DE', 'EF', 'CF']
    );
    const result = await testBFS(nodes['A'], 'F');
    assert(
      result === 'ABCF',
      `Incorrect Path Found - expected ABCF got ${result}`
    );
  });

  it('Should still work when multiples of edges exist', async () => {
    const nodes = makeTestNodes(
      ['A', 'B', 'C', 'D'],
      ['AB', 'BC', 'CD', 'BC', 'AB', 'CD', 'CD', 'CD', 'CD']
    );
    const result = await testBFS(nodes['A'], 'D');
    assert(
      result === 'ABCD',
      `Incorrect Path Found - expected ABCD got ${result}`
    );
  });

  it('Should find a path', async () => {
    const nodes = makeTestNodes(
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
      ['AB', 'AI', 'AD', 'BG', 'CF', 'DE', 'EI', 'FH', 'GC', 'HJ', 'IC', 'JK']
    );
    const result = await testBFS(nodes['A'], 'K');
    assert(
      result === 'AICFHJK',
      `Incorrect Path Found - expected AICFHJK got ${result}`
    );
  });
});
