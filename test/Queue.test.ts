import { expect } from 'chai';
import Queue from '../src/Queue';

const q = new Queue();

// NOTE: these tests depend on being in this order.
describe('Queue Tests', async () => {
  it('Should begin empty', () => {
    expect(q.queue.length).to.equal(0);
    expect(q.empty()).to.equal(true);
  });

  it('Should add items at end', () => {
    q.push(1);
    q.push(2);
    q.push(3);
    expect(q.queue).to.eql([1, 2, 3]);
    expect(q.queue.length).to.equal(3);
  });

  it('Should say it is not empty', () => {
    expect(q.empty()).to.equal(false);
  });

  it('Should pop items from the front', () => {
    const item = q.pop();
    expect(q.queue).to.eql([2, 3]);
    expect(item).to.equal(1);
  });

  it('Should have the expected state after a sequence of push/pops', () => {
    q.push(4);
    q.pop();
    q.push(5);
    q.pop();
    expect(q.queue).to.eql([4, 5]);
  });

  it('Queue can be cleared', () => {
    q.clear();
    expect(q.queue.length).to.equal(0);
    expect(q.empty()).to.equal(true);
  });

  it('Object references should be persisted when added/removed', () => {
    const ref = { x: 123 };
    q.push(ref);
    const result = q.pop();

    expect(ref).to.equal(result);
  });
});
