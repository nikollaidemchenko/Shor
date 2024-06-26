export default class Complex {
  constructor(private real = 0, private imaginary = 0) {}

  /** Переопределение значений комплексного числа
   */
  set(newReal: number, newImaginary: number): void {
    this.real = newReal;
    this.imaginary = newImaginary;
  }

  /** Присвоение комплексных чисел
   */
  assignment(c: Complex): void {
    this.real = c.real;
    this.imaginary = c.imaginary;
  }

  /** @returns Действтельная часть
   */
  getReal(): number {
    return this.real;
  }

  /** @returns Мнимая часть
   */
  getImaginary(): number {
    return this.imaginary;
  }

  /** Суммирование комплексных чисел
   */
  add(c: Complex): Complex {
    this.real += c.real;
    this.imaginary += c.imaginary;
    return this;
  }

  /** Умножение комплексных чисел
   */
  multiply(c: Complex): Complex {
    const real = this.real * c.real - this.imaginary * c.imaginary;
    const imaginary = this.real * c.imaginary + this.imaginary * c.real;

    this.real = real;
    this.imaginary = imaginary;
    return this;
  }
}
