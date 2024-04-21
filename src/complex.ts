export default class Complex {
  constructor(private real = 0, private imaginary = 0) {}

  /** Переопределение значений комплексного числа
   */
  set(newReal: number, newImaginary: number) {
    this.real = newReal;
    this.imaginary = newImaginary;
  }

  /** Присвоение комплексных чисел
   */
  assignment(c: Complex) {
    this.real = c.real;
    this.imaginary = c.imaginary;
  }

  /** @returns Действтельная часть
   */
  getReal() {
    return this.real;
  }

  /** @returns Мнимая часть
   */
  getImaginary() {
    return this.imaginary;
  }

  /** Суммирование комплексных чисел
   */
  add(c: Complex) {
    this.real += c.real;
    this.imaginary += c.imaginary;
    return this;
  }

  /** Умножение комплексных чисел
   */
  multiply(c: Complex) {
    const real = this.real * c.real - this.imaginary * c.imaginary;
    const imaginary = this.real * c.imaginary + this.imaginary * c.real;

    this.real = real;
    this.imaginary = imaginary;
    return this;
  }
}
