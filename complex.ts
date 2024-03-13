export default class Complex {
  constructor(private real = 0, private imaginary = 0) {}

  // Method to set the values of real and imaginary parts
  set(newReal: number, newImaginary: number) {
    this.real = newReal;
    this.imaginary = newImaginary;
  }

  assignment(c: Complex) {
    this.real = c.real;
    this.imaginary = c.imaginary;
  }

  // Method to get the real part
  getReal() {
    return this.real;
  }

  // Method to get the imaginary part
  getImaginary() {
    return this.imaginary;
  }

  // Method to add two Complex numbers
  add(c: Complex) {
    this.real += c.real;
    this.imaginary += c.imaginary;
    return this;
  }

  // Method to multiply two Complex numbers
  multiply(c: Complex) {
    const real = this.real * c.real - this.imaginary * c.imaginary;
    const imaginary = this.real * c.imaginary + this.imaginary * c.real;

    this.real = real;
    this.imaginary = imaginary;
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
