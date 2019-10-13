import * as readline from 'readline';
import { getPageFromUrl } from './utils';
import BFS from './BFS';

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

reader.question('Enter Source Wikipedia URL', response => {
  const startUrl = response;
  reader.question('Enter Goal Wikipedia URL', response => {
    const goalUrl = response;
    reader.close();
    // run BFS here
    console.log({ startUrl, goalUrl });
  });
});

if (!BFS) {
  console.log(BFS);
}

getPageFromUrl('https://en.wikipedia.org/wiki/Harry_Haft_(film)').then(page =>
  console.log(page)
);
