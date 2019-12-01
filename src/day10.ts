import fs from 'fs';

export {};

fs.readFile('../input/day10.txt', 'utf8', (err, contents) => {
  if (err !== null) {
    console.error(err);
    return;
  }

  let input = contents.split(',').map((cs) => parseInt(cs, 10));

  let c: number = 0;
  let s: number = 0;
  let a: Array<number> = [];

  for (let i = 0; i < 256; i += 1) {
    a.push(i);
  }

  for (const n of input) {
    for (let i = 0; i < Math.floor(n / 2); i += 1) {
      const j = (c + i) % a.length;
      const k = ((c + n + a.length) - (i + 1)) % a.length;
      const x = a[j];
      a[j] = a[k];
      a[k] = x;
    }

    c = (c + n + s) % a.length;
    s += 1;
  }

  console.log(a[0] * a[1]);

  input = contents.split('').map((ch) => ch.charCodeAt(0));
  input.push(17);
  input.push(31);
  input.push(73);
  input.push(47);
  input.push(23);

  c = 0;
  s = 0;
  a = [];
  for (let i = 0; i < 256; i += 1) {
    a.push(i);
  }

  const input2 = input.concat(input);
  const input4 = input2.concat(input2);
  const input8 = input4.concat(input4);
  const input16 = input8.concat(input8);
  const input32 = input16.concat(input16);
  const input64 = input32.concat(input32);

  for (const n of input64) {
    for (let i = 0; i < Math.floor(n / 2); i += 1) {
      const j = (c + i) % a.length;
      const k = ((c + n + a.length) - (i + 1)) % a.length;
      const x = a[j];
      a[j] = a[k];
      a[k] = x;
    }

    c = (c + n + s) % a.length;
    s += 1;
  }

  const dense: Array<number> = [];
  for (let i = 0; i < 16; i += 1) {
    dense.push(0);
  }

  for (let i = 0; i < a.length; i += 1) {
    dense[Math.floor(i / 16)] ^= a[i];
  }

  console.log(
    dense
      .map((x) => {
        const ss = x.toString(16);
        if (ss.length === 1) {
          return `0${ss}`;
        } else {
          return ss;
        }
      })
      .join(''),
  );
});
