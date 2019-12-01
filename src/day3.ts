export {};

function edge(n: number): number {
  return n * 2 + 1;
}

function area(n: number): number {
  return edge(n) ** 2;
}

function start(n: number): [number, number] {
  return [n + 1, n];
}

function under(xx: number): number {
  let n: number = 0;

  while (area(n + 1) < xx) {
    n += 1;
  }

  return n;
}

function count(xx: number): number {
  const n = under(xx);
  const aa = area(n) + ((edge(n + 1) - 1) / 2);
  const b = aa + edge(n + 1) - 1;
  const c = b + edge(n + 1) - 1;
  const d = c + edge(n + 1) - 1;
  const e = Math.abs(xx - aa);
  const f = Math.abs(xx - b);
  const g = Math.abs(xx - c);
  const h = Math.abs(xx - d);
  const i = Math.min(Math.min(e, f), Math.min(g, h));
  return ((edge(n) + 1) / 2) + i;
}

console.log(`part1: ${count(277678)}`);

const a: Map<string, number> = new Map<string, number>();
a.set(`${0}:${0}`, 1);

enum Edge {
  Right,
  Top,
  Left,
  Bottom,
}

let following: number = Edge.Right;

let x = 1;
let y = 0;

while (true) {
  const foo = (a.get(`${x - 1}:${y    }`) ?? 0)
            + (a.get(`${x + 1}:${y    }`) ?? 0)
            + (a.get(`${x    }:${y - 1}`) ?? 0)
            + (a.get(`${x    }:${y + 1}`) ?? 0)
            + (a.get(`${x - 1}:${y - 1}`) ?? 0)
            + (a.get(`${x + 1}:${y - 1}`) ?? 0)
            + (a.get(`${x - 1}:${y + 1}`) ?? 0)
            + (a.get(`${x + 1}:${y + 1}`) ?? 0);

  if (foo > 277678) {
    console.log(`part2: ${foo}`);
    break;
  }

  a.set(
    `${x}:${y}`,
    foo,
  );

  switch (following) {
  case Edge.Right:
    if (a.get(`${x - 1}:${y}`) !== undefined) {
      y += 1;
    } else {
      x -= 1;
      following = Edge.Top;
    }
    break;

  case Edge.Top:
    if (a.get(`${x}:${y - 1}`) !== undefined) {
      x -= 1;
    } else {
      y -= 1;
      following = Edge.Left;
    }
    break;

  case Edge.Left:
    if (a.get(`${x + 1}:${y}`) !== undefined) {
      y -= 1;
    } else {
      x += 1;
      following = Edge.Bottom;
    }
    break;

  case Edge.Bottom:
    if (a.get(`${x}:${y + 1}`) !== undefined) {
      x += 1;
    } else {
      y += 1;
      following = Edge.Right;
    }
    break;
  }
}
