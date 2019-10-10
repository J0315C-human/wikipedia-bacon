const readline = require('readline');

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
  });
});
