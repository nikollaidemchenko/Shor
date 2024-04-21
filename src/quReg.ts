import Complex from './complex';

export default class QuReg {
  private readonly regSize: number;

  public state: Complex[];

  constructor(size: number) {
    this.regSize = size;
    this.state = Array.from({ length: Math.pow(2, size) }, () => new Complex());
  }

  /** @returns QuReg states
   */
  getProb(state: number) {
    if (this.state[state] === undefined) {
      throw new Error(`Invalid state index ${state} requested!`);
    } else {
      return this.state[state];
    }
  }

  /** Нормализация амплитудыы вероятности, которая гарантирует, что сумма
   * сумма квадратов всех действительных и мнимых составляющих равна
   * равно единице.
   */
  norm() {
    let b = 0;

    this.state.forEach((st) => {
      b += Math.pow(st.getReal(), 2) + Math.pow(st.getImaginary(), 2);
    });


    b = Math.pow(b, -0.5);

    this.state = this.state.map((st) => new Complex(st.getReal() * b, st.getImaginary() * b));
  }

  /** Вычисление значения QuReg
   */
  decMeasure() {
    const rand1 = Math.random();
    let a = 0;
    let b = 0;

    for (let i = 0; i < Math.pow(2, this.regSize); i += 1) {
      b += Math.pow(this.state[i].getReal(), 2) + Math.pow(this.state[i].getImaginary(), 2);

      if (b > rand1 && rand1 > a) {
        for (let j = 0; j < Math.pow(2, this.regSize); j += 1) {
          this.state[j].set(0, 0);
        }

        this.state[i].set(1, 0);
        return i;
      }

      a += Math.pow(this.state[i].getReal(), 2) + Math.pow(this.state[i].getImaginary(), 2);
    }

    return -1;
  }

  /** Сетает новое состояние для регистра */
  setState(new_state: Complex[]) {
    this.state = new_state.map((st) => new Complex(st.getReal(), st.getImaginary()));
  }

  /** Сетает новое состояние для регистра */
  setToStart(size: number) {
    this.state = Array.from({ length: Math.pow(2, size) }, () => new Complex());
  }

  /** Сетает для состояния равновзвешенную суперпозицию. */
  setAverage(number: number) {
    const prob = Math.pow(number, -0.5);
    for (let i = 0; i <= number; i += 1) {
      this.state[i].set(prob, 0);
    }
  }
}
