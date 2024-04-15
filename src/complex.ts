export default class Complex {
  constructor(private real = 0, private imaginary = 0) {}

  set(newReal: number, newImaginary: number) {
    this.real = newReal;
    this.imaginary = newImaginary;
  }

  assignment(c: Complex) {
    this.real = c.real;
    this.imaginary = c.imaginary;
  }

  getReal() {
    return this.real;
  }

  getImaginary() {
    return this.imaginary;
  }

  add(c: Complex) {
    this.real += c.real;
    this.imaginary += c.imaginary;
    return this;
  }

  multiply(c: Complex) {
    const real = this.real * c.real - this.imaginary * c.imaginary;
    const imaginary = this.real * c.imaginary + this.imaginary * c.real;

    this.real = real;
    this.imaginary = real;
    return this;
  }

  // Method to check equality considering floating point arithmetic issues
  equals(c: Complex) {
    const tolerance = Math.pow(10, -14);
    return !(
      Math.abs(this.real - c.real) > tolerance || Math.abs(this.imaginary - c.imaginary) > tolerance
    );
  }
}
