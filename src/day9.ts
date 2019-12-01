import fs from 'fs';

export {};

interface Pair {
  i: number;
  p: number;
}

fs.readFile('../input/day9.txt', 'utf8', (err, contents) => {
  if (err !== null) {
    console.error(err);
    return;
  }

  let nonc = 0;
  const cs = contents.split('');

  switch (cs[0]) {
    case '<':
      garbage(1);
      break;
  }

  function garbage(i: number): number {
    for (let j = i; j < cs.length; j += 1) {
      switch (cs[j]) {
      case '>':
        return j + 1;

      case '!':
        j += 1;
        break;

      default:
        nonc += 1;
        break;
      }
    }

    return cs.length;
  }

  console.log(group(1, 1).p);
  console.log(nonc);

  function group(p: number, i: number): Pair {
    let tp: number = p;
    let j: number = 0;

    switch (cs[i]) {
    case '}':
      return { p, i: i + 1 };
    case '{':
      const x = group(p + 1, i + 1);
      tp += x.p;
      j = x.i;
      break;
    case '<':
      j = garbage(i + 1);
      break;
    default:
      throw Error();
    }

    while (true) {
      switch (cs[j]) {
      case '}':
        return { p: tp, i: j + 1 };

      case ',':
        j += 1;

        switch (cs[j]) {
        case '{':
          const x = group(p + 1, j + 1);
          tp += x.p;
          j = x.i;
          break;
        case '<':
          j = garbage(j + 1);
          break;
        default:
          throw Error();
        }

        break;
      default:
        throw Error();
      }
    }
  }
});
