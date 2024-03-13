import Complex from './complex';

export default class Qubit {
  private zeroState = new Complex(1, 0);

  private oneState = new Complex(0, 0);

  //Measurement operator.  Destructively collapses superpositions.
  measure() {
    const rand = Math.random();

    if (this.mcc(0) > rand) {
      this.zeroState.set(1, 0);
      this.oneState.set(0, 0);
      return 0;
    } else {
      this.zeroState.set(0, 0);
      this.oneState.set(1, 0);
      return 1;
    }
  }

  //Sets the zero and one states to arbitrary amplitudes.  Outputs
  //an error message if the two values MCC'ed != 1 + 0i.
  setState(zero_prob: Complex, one_prob: Complex) {
    this.zeroState = zero_prob;
    this.oneState = one_prob;

    const totalProb = this.mcc(0) + this.mcc(1);

    if (Math.abs(totalProb - 1) > Math.pow(10, -10)) {
      console.warn('Warning, total probability for in SetState is different from 1.');
    }
  }

  //Sets the qubit 1/2 way between the 0 state and the 1 state.
  setAverage() {
    const avg = Math.pow(2, -0.5);
    this.zeroState.set(avg, 0);
    this.oneState.set(avg, 0);
  }

  mcc(state: number) {
    if (state === 0) {
      return Math.pow(this.zeroState.getReal(), 2) + Math.pow(this.zeroState.getImaginary(), 2);
    } else {
      return Math.pow(this.oneState.getReal(), 2) + Math.pow(this.oneState.getImaginary(), 2);
    }
  }
}
