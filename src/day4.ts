import fs from 'fs';
import { lines, words } from './pipes';
export {};

fs.readFile('../input/day4.txt', 'utf8', (err, contents) => {
  if (err !== null) {
    console.error(err);
    return;
  }

  console.log(`part1: ${
    lines(contents)
      .map(words)
      .filter((ws) => (new Set(ws)).size === ws.length)
      .length
  }`);

  console.log(`part2: ${
    lines(contents)
      .map(words)
      .map((ws) =>
        ws
          .map((w) => w.split(''))
          .map((cs) => cs.sort())
          .map((cs) => cs.join('')),
      )
      .filter((ws) => (new Set(ws)).size === ws.length)
      .length
  }`);
});
