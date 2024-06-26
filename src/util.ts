import Complex from './complex';
import QuReg from './quReg';

/** Проверка на четность
 * @return true если четное
 * @return false если нечетное
 */
export const testEven = (n: number): boolean => n % 2 === 0;

/** Проверка на простоту
 * @return true если простое
 * @return false если составное
 */
export const testPrime = (n: number): boolean  => {
  for (let i = 2; i <= Math.floor(Math.sqrt(n)); i++) {
    if (n % i === 0) return false;
  }

  return true;
};

/** Проверка на принодлежности числа к степень простого числа
 * @return true если приналдежит
 * @return false если не приналежит
 */
export const testPrimePower = (n: number): boolean  => {
  let i = 2;
  let j = 0;

  while (i <= Math.floor(Math.sqrt(n)) && j === 0) {
    if (n % i === 0) j = i;
    i++;
  }

  for (i = 2; i <= Math.floor(Math.log(n) / Math.log(j)) + 1; i++) {
    if (Math.pow(j, i) === n) return true;
  }

  return false;
};


/** Получение числа (q) которое n^2 <= q < 2n^2 */
export const getQ = (n: number): number => {
  let power = 8; // Начинается с 256, наименьшее из возможных

  while (Math.pow(2, power) < Math.pow(n, 2)) {
    power += 1;
  }

  return 1 << power;
};

/** Получение числа (x) которое взаимно просто с передаваем параметром */
export const getX = (n: number): number => {
  let x = getRandomInt(1, n + 1);

  while (gcd(n, x) !== 1 || x === 1) {
    x = getRandomInt(1, n + 1);
  }

  return x;
};

/** @return Случайное число [min, max) */
export const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);

/** Вычесление НОД передаваемых чисел
 * @return НОД(a, b)
 */
export const gcd = (a: number, b: number): number => {
  if (a === 0 || b === 0) throw new Error('Передаваемое число должно быть больше 0');

  let d = 0;

  while (a % b !== 0) {
    d = a % b;
    a = b;
    b = d;
  }

  return b;
};

/**
 * @return Размер в битах, который необходим чтобы представить передаваемое число
 */
export const regSize = (a: number): number => {
  let size = 0;

  while (a !== 0) {
    a >>= 1;
    size++;
  }

  return size;
};

/**
 * @return x^a mod(n)
 */
export const modexp = (x: number, a: number, n: number): number => {
  let value = 1;
  let tmp = x % n;

  while (a > 0) {
    if (a & 1) {
      value = (value * tmp) % n;
    }

    tmp = (tmp * tmp) % n;
    a >>= 1;
  }

  return value;
};

/** Эта функция находит знаменатель q наилучшего рационального приближения
 * знаменатель q для аппроксимации p/q для c с q < qmax.
 */
export const denominator = (c: number, qmax: number): number => {
  let y = c;
  let q0 = 0;
  let q1 = 1;
  let q2 = 0;
  let z;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    z = y - Math.floor(y);

    if (z < 0.5 / Math.pow(qmax, 2)) return q1;

    if (z !== 0) {
      y = 1 / z;
    } else {
      return q1; // Should never happen as q1 != 0
    }

    q2 = Math.floor(y) * q1 + q0;

    if (q2 >= qmax) return q1;

    q0 = q1;
    q1 = q2;
  }
};

/** Вернуть максимальное из переданых
 */
export const max = (a: number, b: number): number => (a > b ? a : b);

/** Вычесление преобразования Фурье
 */
export const dfp = (reg: QuReg, q: number): void => {

  let init = Array.from({length: q}, () => new Complex());

  const tmpcomp = new Complex(0, 0);

  for (let a = 0; a < q; a++) {
    for (let c = 0; c < q; c++) {
      tmpcomp.set(
        Math.pow(q, -0.5) * Math.cos((2 * Math.PI * a * c) / q),
        Math.pow(q, -0.5) * Math.sin((2 * Math.PI * a * c) / q),
      );

      init[a].assignment(init[a].add(reg.getProb(a).multiply(tmpcomp)));
    }
  }

  reg.setState(init);
  reg.norm();
};
