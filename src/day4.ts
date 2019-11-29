import { filter, map, sort } from 'fp-ts/lib/Array';
import { ordString } from 'fp-ts/lib/Ord';
import fs from 'fs';
import { lines, pipe, words } from './pipes';
declare module 'fp-ts/lib/Array';
export {};

fs.readFile('../input/day4.txt', 'utf8', (err, contents) => {
  if (err !== null) {
    console.error(err);
    return;
  }

  pipe(
    contents,
    lines,
    map(words),
    filter((ws) => (new Set(ws)).size === ws.length),
    (x) => x.length,
    (x) => console.log(`part1: ${x}`),
  );

  pipe(
    contents,
    lines,
    map(words),
    map((ws) =>
      pipe(
        ws,
        map((w) => w.split('')),
        map((cs) => sort(ordString)(cs)),
        map((cs) => cs.join('')),
      ),
    ),
    filter((ws) => (new Set(ws)).size === ws.length),
    (x) => x.length,
    (x) => console.log(`part2: ${x}`),
  );
});
