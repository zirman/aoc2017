import { map } from 'fp-ts/lib/Array';
import fs from 'fs';
import { pipe, words } from './pipes';

export {};

function findMax(a: Array<number>): number {
  let m = 0;
  for (let i: number = 0; i < a.length; i += 1) {
    if (a[i] > a[m]) {
      m = i;
    }
  }
  return m;
}

fs.readFile('../input/day6.txt', 'utf8', (err, contents) => {
  if (err !== null) {
    console.error(err);
    return;
  }

  const s: Map<string, number> = new Map<string, number>();

  const a = pipe(
    contents,
    words,
    map(parseInt),
  );

  let steps = 0;

  do {
    steps += 1;
    s.set(String(a), steps);
    const m = findMax(a);
    let o = a[m];
    a[m] = 0;
    for (let i: number = m + 1; o > 0; i += 1) {
      a[i % a.length] += 1;
      o -= 1;
    }
  } while (!s.has(String(a)));

  console.log(`part1: ${steps}`);
  console.log(`part2: ${(steps + 1) - (s.get(String(a)) ?? 0)}`);
});
