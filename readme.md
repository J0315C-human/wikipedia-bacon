# Wikipedia "Bacon" crawler

## About
This is a breadth-first search that crawls through wikipedia links (outgoing links only) and finds the number of links between an arbitrary start page and the wikipedia page of Kevin Bacon.

It's a node console program - all input/output is through the console.

## Dev Notes

To run, `npm install` and `npm start` from the root directory (Node v. 10.16.3 was used in development).

To run the tests, `npm run test` from the root directory.

Since this is pretty small, all code is in the `src/` folder. Tests in the `test/` folder.

## Thoughts
😳😅

This doesn't work well yet - it inefficiently relies on webcrawling, which is very slow once the program runs up a queue of a few thousand web pages. The maximum number of degrees of separation it can handle is probably 3, and even that takes forever to run. 

Some improvements could be made, let's be honest.
These could include: 
  - Instead of fetching web pages all day, use a local copy of a recent [wikipedia dump](https://dumps.wikimedia.org/) to find links between pages. This should be made easier by the generic BFS class being decoupled from the implementation of the Graph class it depends on.
  - (Assuming we're still using web crawling) Find a way to defer the fetching of a Page until it's being "visited" by the search; the whole BFS algorithm would have to be reworked to be able to do the fetching later and still concurrently. 
  - Make a database of all pages 1 or 2 degrees of separation away from Kevin Bacon, so that when any of them is encountered in the BFS, you can short-circuit to the result (with a caveat - you'd have to do some extra work to make sure this still resulted in a guaranteed minimum path).