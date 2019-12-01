import fs from 'fs';
import { lines } from './pipes';
export {};

fs.readFile('../input/day5.txt', 'utf8', (err, contents) => {
  if (err !== null) {
    console.error(err);
    return;
  }

  let a = lines(contents).map((x) => parseInt(x, 10));

  let i: number = 0;
  let steps: number = 0;
  while (a[i] !== undefined) {
      const j = i;
      i += a[j];
      a[j] += 1;
      steps += 1;
  }

  console.log(steps);

  // Part 2
  a = lines(contents).map((x) => parseInt(x, 10));

  i = 0;
  steps = 0;
  while (a[i] !== undefined) {
    const j = i;
    i += a[j];
    if (a[j] >= 3) {
      a[j] -= 1;
    } else {
      a[j] += 1;
    }
    steps += 1;
  }

  console.log(steps);
});
