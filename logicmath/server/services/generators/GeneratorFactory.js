import PascalGenerator from './PascalGenerator.js';
import FibonacciGenerator from './FibonacciGenerator.js';
import FigurateGenerator from './FigurateGenerator.js';
import SequencesGenerator from './SequencesGenerator.js';
import FractalsGenerator from './FractalsGenerator.js';
import PrimesGenerator from './PrimesGenerator.js';

export default class GeneratorFactory {
    /**
     * Returns the required generator by category name
     * @param {string} category - Task category name
     * @returns {Object} Generator instance
     */
  static create(category) {
    const generators = {
      PASCAL: new PascalGenerator(),
      FIBONACCI: new FibonacciGenerator(),
      FIGURATE: new FigurateGenerator(),
      SEQUENCES: new SequencesGenerator(),
      FRACTALS: new FractalsGenerator(),
      PRIMES: new PrimesGenerator(),
    };
    
    if (!generators[category]) {
      throw new Error(`Невідома категорія: ${category}`);
    }
    
    return generators[category];
  }
}
