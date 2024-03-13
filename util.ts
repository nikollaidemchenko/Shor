import Complex from './complex';
import QuReg from './quReg';

//This function takes an integer input and returns 1 if it is a prime
//number, and 0 otherwise.
//
// Not optimized at all.
export const testPrime = (n: number) => {
  for (let i = 2; i <= Math.floor(Math.sqrt(n)); i++) {
    if (n % i === 0) return 0;
  }

  return 1;
};

//This function takes an integer input and returns 1 if it is equal to
//a prime number raised to an integer power, and 0 otherwise.
export const testPrimePower = (n: number) => {
  let i = 2;
  let j = 0;

  while (i <= Math.floor(Math.pow(n, 0.5)) && j === 0) {
    if (n % i === 0) j = i;
    i++;
  }

  for (i = 2; i <= Math.floor(Math.log(n) / Math.log(j)) + 1; i++) {
    if (Math.pow(j, i) === n) return 1;
  }

  return 0;
};

//This function computes the greatest common denominator of two integers.
//Since the modulus of a number mod 0 is not defined, we return a -1 as
//an error code if we ever would try to take the modulus of something and
//zero.
export const gcd = (a: number, b: number) => {
  if (b === 0) throw new Error('b === 0');

  let d = 0;

  while (a % b !== 0) {
    d = a % b;
    a = b;
    b = d;
  }

  return b;
};

//This function takes and integer argument, and returns the size in bits
//needed to represent that integer.
export const regSize = (a: number) => {
  let size = 0;

  while (a !== 0) {
    a >>= 1;
    size++;
  }

  return size;
};

//q is the power of two such that n^2 <= q < 2n^2.
export const getQ = (n: number) => {
  let power = 8; // Start with 256, the smallest q ever is

  while (Math.pow(2, power) < Math.pow(n, 2)) {
    power += 1;
  }

  return 1 << power;
};

//This function takes three integers, x, a, and n, and returns x^a mod
//n.  This algorithm is known as the "Russian peasant method," I
//believe, and avoids overflow by never calculating x^a directly.

export const modexp = (x: number, a: number, n: number) => {
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

// This function finds the denominator q of the best rational
// denominator q for approximating p / q for c with q < qmax.
export const denominator = (c: number, qmax: number) => {
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

//This function takes two integer arguments and returns the greater of
//the two.
export const max = (a: number, b: number) => (a > b ? a : b);

//This function computes the discrete Fourier transformation on a register's
//0 -> q - 1 entries.
export const dfp = (reg: QuReg, q: number) => {
  //The Fourier transform maps functions in the time domain to
  //functions in the frequency domain.  Frequency is 1/period, thus
  //this Fourier transform will take our periodic register, and peak it
  //at multiples of the inverse period.  Our Fourier transformation on
  //the state a takes it to the state: q^(-.5) * Sum[c = 0 -> c = q - 1,
  //c * e^(2*Pi*i*a*c / q)].  Remember, e^ix = cos x + i*sin x.

  const init = Array.from({ length: q }, () => new Complex());
  const tmpcomp = new Complex(0, 0);

  //Here we do things that a real quantum computer couldn't do, such
  //as look as individual values without collapsing state.  The good
  //news is that in a real quantum computer you could build a gate
  //which would what this out all in one step.

  let count = 0;

  for (let a = 0; a < q; a++) {
    //This if statement helps prevent previous round off errors from
    //propagating further.
    if (
      Math.pow(reg.getProb(a).getReal(), 2) + Math.pow(reg.getProb(a).getImaginary(), 2) >
      Math.pow(10, -14)
    ) {
      for (let c = 0; c < q; c++) {
        tmpcomp.set(
          Math.pow(q, -0.5) * Math.cos((2 * Math.PI * a * c) / q),
          Math.pow(q, -0.5) * Math.sin((2 * Math.PI * a * c) / q),
        );
        init[c].assignment(init[c].add(reg.getProb(a).multiply(tmpcomp)));
      }
    }

    count++;

    if (count === 100) {
      console.log(`Making progress in Fourier transform, ${100 * (a / (q - 1))} % done!`);
      count = 0;
    }
  }

  reg.setState(init);
  reg.norm();
};
