import fs from 'fs';

export {};

fs.readFile('../input/day11.txt', 'utf8', (err, contents) => {
  if (err !== null) {
    console.error(err);
    return;
  }

  let max = 0;

  const ds = contents.split(',');
  let i = 0;
  let j = 0;

  for (const d of ds) {
    switch (d) {
    case 'n':
      j += 1;
      break;
    case 'ne':
      i += 1;
      break;
    case 'se':
      i += 1;
      j -= 1;
      break;
    case 's':
      j -= 1;
      break;
    case 'sw':
      i -= 1;
      break;
    case 'nw':
      j += 1;
      i -= 1;
      break;
    default:
      throw Error();
    }

    max = Math.max(max, distance(i, j));
  }

  console.log(distance(i, j));
  console.log(max);
});

function distance(i: number, j: number) {
  if ((i >= 0 && j >= 0) || (i <= 0 && j <= 0)) {
    return Math.abs(i + j);
  } else {
    return Math.max(Math.abs(i), Math.abs(j));
  }
}
