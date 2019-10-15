import * as readline from 'readline';
import { getPageFromUrl } from './utils';
import BFS from './BFS';
import PageGraph from './PageGraph';
import { FETCH_RETRIES } from './constants';

const GOAL_URL = 'https://en.wikipedia.org/wiki/Kevin_Bacon';

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const runSearch = async (startUrl: string) => {
  const startPage = await getPageFromUrl(startUrl, undefined, FETCH_RETRIES);
  const pageBFS = new BFS(new PageGraph());
  const result = await pageBFS.performBFS(startPage, GOAL_URL);
  if (result) {
    console.log('=========================================');
    console.log('============ RESULT FOUND ===============');
    console.log('\nNumber of degrees to Kevin Bacon: ' + (result.length - 1));
    console.log('\nPath found: ');
    // log the resulting path
    result.forEach(page => console.log(' -> ' + page.id));
  }
};

const getStartingUrl = (callback: (url: string) => void) => {
  reader.question('Enter Starting Wikipedia URL: ', response => {
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
