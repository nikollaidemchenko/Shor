import Complex from './complex';

export default class QuReg {
  private regSize = 0;

  private state: Complex[];

  constructor(size: number) {
    this.regSize = size;
    this.state = Array.from({ length: Math.pow(2, size) }, () => new Complex());
  }

  // Return the probability amplitude of the state'th state.
  getProb(state: number) {
    if (this.state[state] === undefined) {
      throw new Error(`Invalid state index ${state} requested!`);
    } else {
      return this.state[state];
    }
  }

  // Normalize the probability amplitude, this ensures that the sum of
  // the sum of the squares of all the real and imaginary components is
  // equal to one.
  norm() {
    let b = 0;

    this.state.forEach((st) => {
      b += Math.pow(st.getReal(), 2) + Math.pow(st.getImaginary(), 2);
    });

    b = Math.pow(b, -0.5);

    this.state = this.state.map((st) => new Complex(st.getReal() * b, st.getImaginary() * b));
  }

  // Returns the size of the register.
  size() {
    return this.regSize;
  }

  // Measure a state, and return the decimal value measured.  Collapse
  // the state so that the probability of measuring the measured value in
  // the future is 1, and the probability of measuring any other state is
  // 0.
  decMeasure() {
    let done = false;
    let DecVal = -1; // -1 indicates an error
    const rand1 = Math.random();
    let a = 0;
    let b = 0;

    for (let i = 0; i < Math.pow(2, this.regSize); i += 1) {
      if (!done) {
        b += Math.pow(this.state[i].getReal(), 2) + Math.pow(this.state[i].getImaginary(), 2);

        if (b > rand1 && rand1 > a) {
          for (let j = 0; j < Math.pow(2, this.regSize); j += 1) {
            this.state[j].set(0, 0);
          }

          this.state[i].set(1, 0);
          DecVal = i;
          done = true;
        }

        a += Math.pow(this.state[i].getReal(), 2) + Math.pow(this.state[i].getImaginary(), 2);
      }
    }
    return DecVal;
  }

  // Set the states to those given in the new_state array.
  setState(new_state: Complex[]) {
    this.state = new_state.map((st) => new Complex(st.getReal(), st.getImaginary()));
  }

  //Set the State to an equal superposition of the integers 0 -> number
  //- 1
  setAverage(number: number) {
    const prob = Math.pow(number, -0.5);
    for (let i = 0; i <= number; i += 1) {
      this.state[i].set(prob, 0);
    }
  }
}
