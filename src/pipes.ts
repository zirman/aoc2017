import { EOL } from 'os';

export function pipe<A, B>(x: A, f: (x: A) => B): B;
export function pipe<A, B, C>(x: A, f: (x: A) => B, g: (x: B) => C): C;
export function pipe<A, B, C, D>(x: A, f: (x: A) => B, g: (x: B) => C, h: (x: C) => D): D;
export function pipe<A, B, C, D, E>(x: A, f: (x: A) => B, g: (x: B) => C, h: (x: C) => D, i: (x: D) => E): E;

export function pipe<A, B, C, D, E, F>(
  x: A, f: (x: A) => B, g: (x: B) => C, h: (x: C) => D, i: (x: D) => E, j: (x: E) => F,
): F;

export function pipe<A, B, C, D, E, F, G>(
  x: A, f: (x: A) => B, g: (x: B) => C, h: (x: C) => D, i: (x: D) => E, j: (x: E) => F, k: (x: F) => G,
): G;

export function pipe<A, B, C, D, E, F, G, H>(
  x: A, f: (x: A) => B, g: (x: B) => C, h: (x: C) => D, i: (x: D) => E, j: (x: E) => F, k: (x: F) => G, l: (x: G) => H,
): H;

export function pipe<A, B, C, D, E, F, G, H, I>(
  x: A, f: (x: A) => B, g: (x: B) => C, h: (x: C) => D, i: (x: D) => E, j: (x: E) => F, k: (x: F) => G, l: (x: G) => H,
  m: (x: H) => I,
): I;

export function pipe<A, B, C, D, E, F, G, H, I, J>(
  x: A, f: (x: A) => B, g: (x: B) => C, h: (x: C) => D, i: (x: D) => E, j: (x: E) => F, k: (x: F) => G, l: (x: G) => H,
  m: (x: H) => I, n: (x: I) => J,
): J;

export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  x: A, f: (x: A) => B, g: (x: B) => C, h: (x: C) => D, i: (x: D) => E, j: (x: E) => F, k: (x: F) => G, l: (x: G) => H,
  m: (x: H) => I, n: (x: I) => J, o: (x: J) => K,
): K;

export function pipe(x: any, ...fs: Array<any>) {
  for (const f of fs) {
    x = f(x);
  }

  return x;
}

export function lines(s: string): Array<string> {
  return s.split(EOL);
}

export function words(s: string): Array<string> {
  return s.match(/\S+/g) ?? [];
}

export function isNum(x: any): boolean {
  return typeof x === 'number';
}

function groupBy<T, A>(toKey: (x: T) => A): (arr: Array<T>) => Map<A, Array<T>> {
  return (xs) => {
    const m: Map<A, Array<T>> = new Map();
    for (const x of xs) {
      const key = toKey(x);
      const a = m.get(key);
      if (a === undefined) {
        m.set(key, [x]);
      } else {
        a.push(x);
      }
    }
    return m;
  };
}
