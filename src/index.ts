import * as readline from 'readline';
import { getPageFromUrl } from './utils';
import BFS from './BFS';
import PageGraph from './PageGraph';

const _goalUrl = 'https://en.wikipedia.org/wiki/Kevin_Bacon';

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const runSearch = async (startUrl: string) => {
  const startPage = await getPageFromUrl(startUrl);
  const pageBFS = new BFS(new PageGraph());
  const result = await pageBFS.performBFS(startPage, _goalUrl);
  console.log('=========================================');
  console.log('============ RESULT FOUND ===============');
  console.log('\nNumber of links to Kevin Bacon: ' + (result.length - 1));
  console.log('\nPath found: ');
  if (result) {
    // log the resulting path
    result.forEach(page => console.log(' -> ' + page.id));
  }
};

const getStartingUrl = (callback: (url: string) => void) => {
  reader.question('Enter Starting Wikipedia URL', response => {
    const startUrl = response;
    if (!startUrl.startsWith('https://en.wikipedia.org/')) {
      console.log('Start URL must begin with "https://en.wikipedia.org/".');
      getStartingUrl(callback);
    } else {
      callback(startUrl);
    }
  });
};

getStartingUrl((startUrl: string) => {
  reader.close();
  runSearch(startUrl);
});
