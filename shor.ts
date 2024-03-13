import Complex from './complex';
import QuReg from './quReg';
import {
  denominator,
  dfp,
  gcd,
  getQ,
  max,
  modexp,
  regSize,
  testPrime,
  testPrimePower,
} from './util';

export class Shor {
  shorsAlgorithm(n: number) {
    console.log(
      '<< "Welcome to the simulation of Shor\'s algorithm." << endl\n' +
        '       << "There are four restrictions for Shor\'s algorithm:" << endl\n' +
        '       << "1) The number to be factored (n) must be >= 15." << endl\n' +
        '       << "2) The number to be factored must be odd." << endl\n' +
        '       << "3) The number must not be prime." << endl\n' +
        '       << "4) The number must not be a prime power." << endl\n' +
        '       << endl << "There are efficient classical methods of factoring "\n' +
        '       << "any of the above numbers, or determining that they are prime."\n' +
        '       << endl << endl << "Input the number you wish to factor." << endl\n' +
        '       << flush;',
    );

    console.log('Step 1 starting.');

    if (n % 2 === 0) {
      throw new Error('Error, the number must be odd!');
    }

    //Exit if the number is prime.
    if (testPrime(n)) {
      throw new Error('Error, the number must not be prime!');
    }

    //Prime powers are prime numbers raised to integral powers.
    //Exit if the number is a prime power.
    if (testPrimePower(n)) {
      throw new Error('Error, the number must not be a prime power!');
    }

    console.log('Step 1 complete.');
    console.log('Step 2 starting.');

    //Now we must figure out how big a quantum register we need for our
    //input, n.  We must establish a quantum register big enough to hold
    //an equal superposition of all integers 0 through q - 1 where q is
    //the power of two such that n^2 <= q < 2n^2.
    console.log('Searching for q, the smallest power of 2 greater than or equal to n^2.');

    const q = getQ(n);

    console.log(`Found q to be ${q}.`);
    console.log('Step 2 complete.');
    console.log('Step 3 starting.');

    //Now we must pick a random integer x, coprime to n.  Numbers are
    //coprime when their greatest common denominator is one.  One is not
    //a useful number for the algorithm.
    let x = 0;

    console.log('Searching for x, a random integer coprime to n.');

    x = Math.floor(1 + (n - 1) * Math.random());

    let l = 0;

    while (gcd(n, x) !== 1 || x === 1 || l < 100) {
      l += 1;
      x = Math.floor(1 + (n - 1) * Math.random());
    }

    console.log(`Found x to be ${x}.`);
    console.log('Step 3 complete.');
    console.log('Step 4 starting.');

    //Create the register.
    const reg1 = new QuReg(regSize(q) - 1);

    console.log(`Made register 1 with register size = ${regSize(q)}`);

    //This array will remember what values of q produced for x^q mod n.
    //It is necessary to retain these values for use when we collapse
    //register one after measuring register two.  In a real quantum
    //computer these registers would be entangled, and thus this extra
    //bookkeeping would not be needed at all.  The laws of quantum
    //mechanics dictate that register one would collapse as well, and
    //into a state consistent with the measured value in resister two.
    const modex = [];

    //This array holds the probability amplitudes of the collapsed state
    //of register one, after register two has been measured it is used
    //to put register one in a state consistent with that measured in
    //register two.
    const collapse = Array.from({ length: q }, () => new Complex());
    const tmp = new Complex();

    //This is a temporary value.

    //This is a new array of probability amplitudes for our second
    //quantum register, that populated by the results of x^a mod n.
    const mdx = Array.from({ length: Math.pow(2, regSize(n)) }, () => new Complex());

    // This is the second register.  It needs to be big enough to hold
    // the superposition of numbers ranging from 0 -> n - 1.
    const reg2 = new QuReg(regSize(n));
    console.log(`Created register 2 of size ${regSize(n)}`);
    console.log('Step 4 complete.');

    //This is a temporary value.
    let tmpval;

    //This is a temporary value.
    let value;

    //c is some multiple lambda of q/r, where q is q in this program,
    //and r is the period we are trying to find to factor n.  m is the
    //value we measure from register one after the Fourier
    //transformation.
    let c, m;

    //This is used to store the denominator of the fraction p / den where
    //p / den is the best approximation to c with den <= q.
    let den;

    //This is used to store the numerator of the fraction p / den where
    //p / den is the best approximation to c with den <= q.
    let p;

    //The integers e, a, and b are used in the end of the program when
    //we attempts to calculate the factors of n given the period it
    //measured.
    //Factor is the factor that we find.
    let e, a, b, factor;

    //Shor's algorithm can sometimes fail, in which case you do it
    //again.  The done variable is set to 0 when the algorithm has
    //failed.  Only try a maximum number of tries.
    let done = 0;
    let tries = 0;

    while (!done) {
      if (tries >= 5) {
        console.log('There have been five failures, giving up.');
        return;
      }
      console.log(`Step 5 starting attempt: ${tries + 1}`);

      //Now populate register one in an even superposition of the
      //integers 0 -> q - 1.
      reg1.setAverage(q - 1);
      console.log('Step 5 complete.');

      console.log(`Step 5 starting attempt: ${tries + 1}`);

      //Now we preform a modular exponentiation on the superposed
      //elements of reg 1.  That is, perform x^a mod n, but exploiting
      //quantum parallelism a quantum computer could do this in one
      //step, whereas we must calculate it once for each possible
      //measurable value in register one.  We store the result in a new
      //register, reg2, which is entangled with the first register.
      //This means that when one is measured, and collapses into a base
      //state, the other register must collapse into a superposition of
      //states consistent with the measured value in the other..  The
      //size of the result modular exponentiation will be at most n, so
      //the number of bits we will need is therefore less than or equal
      //to log2 of n.  At this point we also maintain a array of what
      //each state produced when modularly exponised, this is because
      //these registers would actually be entangled in a real quantum
      //computer, this information is needed when collapsing the first
      //register later.

      //This counter variable is used to increase our probability amplitude.
      tmp.set(1, 0);

      //This for loop ranges over q, and puts the value of x^a mod n in
      //modex[a].  It also increases the probability amplitude of the value
      //of mdx[x^a mod n] in our array of complex probabilities.
      for (let i = 0; i < q; i++) {
        tmpval = modexp(x, i, n);
        modex[i] = tmpval;
        mdx[tmpval] = mdx[tmpval].add(tmp);
      }

      //Set the state of register two to what we calculated it should be.
      reg2.setState(mdx);

      //Normalize register two, so that the probability of measuring a
      //state is given by summing the squares of its probability
      //amplitude.
      reg2.norm();
      console.log('Step 6 complete.');

      console.log(`Step 7 starting attempt: ${tries + 1}`);

      //Now we measure reg2.
      value = reg2.decMeasure();

      //Now we must using the information in the array modex collapse
      //the state of register one into a state consistent with the value
      //we measured in register two.
      for (let i = 0; i < q; i++) {
        if (modex[i] === value) {
          collapse[i].set(1, 0);
        } else {
          collapse[i].set(0, 0);
        }
      }

      //Now we set the state of register one to be consistent with what
      //we measured in state two, and normalize the probability
      //amplitudes.
      reg1.setState(collapse);
      reg1.norm();
      console.log('Step 7 complete.');

      console.log(`Step 8 starting attempt: ${tries + 1}`);

      //Here we do our Fourier transformation.
      dfp(reg1, q);

      console.log('Step 8 complete.');

      console.log(`Step 9 starting attempt: ${tries + 1}`);

      //Next we measure register one, due to the Fourier transform the
      //number we measure, m will be some multiple of lambda/r, where
      //lambda is an integer and r is the desired period.
      m = reg1.decMeasure();
      console.log(`Value of m measured as: ${m}`);
      console.log('Step 9 complete.');

      //If nothing goes wrong from here on out we are done.
      done = 1;

      //If we measured zero, we have gained no new information about the
      //period, we must try again.
      if (m === 0) {
        console.log('Measured, 0 this trial a failure!');
        done = 0;
      }

      //The DecMeasure subroutine will return -1 as an error code, due
      //to rounding errors it will occasionally fail to measure a state.
      if (m === -1) {
        console.log('We failed to measure anything, this trial a failure!');
        done = 0;
      }

      //If nothing has gone wrong, try to determine the period of our
      //function, and get factors of n.
      if (done) {
        //Now c =~ lambda / r for some integer lambda.  Borrowed with
        //modifications from Berhnard Ohpner.
        c = m / q;

        console.log(`Step 10 and 11 starting attempt: ${tries + 1}`);

        //Calculate the denominator of the best rational approximation
        //to c with den < q.  Since c is lambda / r for some integer
        //lambda, this will provide us with our guess for r, our period.
        den = denominator(c, q);

        //Calculate the numerator from the denominator.
        p = Math.floor(den * c + 0.5);

        console.log(`Measured m: ${m}, rational approximation for m/q= ${c} is: ${p} / ${den}`);

        //The denominator is our period, and an odd period is not
        //useful as a result of Shor's algorithm.  If the denominator
        //times two is still less than q we can use that.
        if (den % 2 === 1 && 2 * den < q) {
          console.log('Odd candidate for r found, expanding by 2');
          p = 2 * p;
          den = 2 * den;
        }

        //Initialize helper variables.
        e = a = b = factor = 0;

        // Failed if odd denominator.
        if (den % 2 === 1) {
          console.log('Odd period found. This trial failed. Trying again.');
          done = 0;
        } else {
          console.log(`Candidate period is ${den}`);
          //Calculate candidates for possible common factors with n.
          e = modexp(x, den / 2, n);
          a = (e + 1) % n;
          b = (e + n - 1) % n;
          console.log(
            `${x} ^ ${den / 2} + 1 mod ${n} = ${a}, ${x} ^ ${den / 2} - 1 mod ${n} = ${b}`,
          );
          factor = max(gcd(n, a), gcd(n, b));
        }
      }

      //GCD will return a -1 if it tried to calculate the GCD of two
      //numbers where at some point it tries to take the modulus of a
      //number and 0.
      if (factor === -1) {
        console.log('tError, tried to calculate n mod 0 for some n.  Trying again.');
        done = 0;
      }

      if ((factor === n || factor === 1) && done === 1) {
        console.log(`Found trivial factors 1 and  ${n}.  Trying again.`);
        done = 0;
      }

      //If nothing else has gone wrong, and we got a factor we are
      //finished.  Otherwise start over.
      if (factor !== 0 && done === 1) {
        console.log(`${n} = ${factor} * ${n / factor}`);
      } else if (done === 1) {
        console.log('Found factor to be 0, error.  Trying again.');
        done = 0;
      }
      console.log('Steps 10 and 11 complete.');
      tries++;
    }
  }
}
