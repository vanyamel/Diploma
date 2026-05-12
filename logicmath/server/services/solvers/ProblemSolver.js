export default class ProblemSolver {
  check(problem, userInput) {
    if (userInput === 'GAVE_UP') {
      const val = this._formatAnswer(problem.answer_json);
      return { correct: false, explanation: `Ти здався. Правильна відповідь: ${val}` };
    }

    const { type } = problem.answer_json;

    switch (type) {
      //Prime number
      case 'number': {
        const expected = problem.answer_json.value;
        const tolerance = problem.answer_json.tolerance ?? 0;
        const given = parseFloat(userInput);
        if (Number.isNaN(given)) return { correct: false, explanation: 'Введіть коректне число' };
        return {
          correct: Math.abs(given - expected) <= tolerance,
          explanation: `Правильна відповідь: ${expected}`
        };
      }

      //Array
      case 'array': {
        const expected = problem.answer_json.value;
        const given = userInput.split(',').map(x => parseFloat(x.trim()));
        if (given.some(Number.isNaN)) return { correct: false, explanation: 'Введіть числа через кому' };
        const correct = given.length === expected.length && given.every((v, i) => v === expected[i]);
        return { correct, explanation: `Очікувалось: [${expected.join(', ')}]` };
      }

      //Answer selection (Figurate)
      case 'choice': {
        const expected = problem.answer_json.value;
        const given = parseFloat(userInput);
        return {
          correct: given === expected,
          explanation: `Правильна відповідь: ${expected}`
        };
      }

      //Pascal's Triangle — fill in the gaps
      case 'pascal-fill': {
        const cells = problem.answer_json.cells;
        const userVals = userInput.split(',').map(v => parseInt(v.trim()));
        const correct = cells.every((cell, i) => userVals[i] === cell.value);
        return {
          correct,
          explanation: correct
            ? 'Всі клітинки заповнені правильно!'
            : `Правильні значення: ${cells.map(c => c.value).join(', ')}`
        };
      }

      //Fibonacci — correct order
      case 'fibonacci-order': {
        const expected = problem.answer_json.correct;
        const given = userInput.split(',').map(v => parseInt(v.trim()));
        const correct = expected.every((v, i) => v === given[i]);
        return {
          correct,
          explanation: correct ? 'Порядок правильний!' : `Правильний порядок: ${expected.join(', ')}`
        };
      }

      //gap selection
      case 'fibonacci-gaps':
      case 'seq-gaps': {
        const gaps = problem.answer_json.gaps;
        const given = userInput.split(',').map(v => parseFloat(v.trim()));
        const correct = gaps.every((gap, i) => given[i] === gap.correct);
        return {
          correct,
          explanation: correct ? 'Всі пропуски заповнені правильно!' :
            `Правильні відповіді: ${gaps.map(g => g.correct).join(', ')}`
        };
      }

      //Sieve of Eratosthenes
      case 'sieve': {
        const expected = [...(problem.answer_json.primes || [])].sort((a, b) => a - b);
        const given = userInput.split(',')
          .map(v => parseInt(v.trim()))
          .filter(v => !isNaN(v) && v > 0)
          .sort((a, b) => a - b);
        const correct = given.length === expected.length &&
                        given.every((v, i) => v === expected[i]);
        return {
          correct,
          explanation: correct
            ? `Чудово! Found всі ${expected.length} простих числа.`
            : `Не зовсім. Прості числа: ${expected.join(', ')}`
        };
      }

      default:
        return { correct: false, explanation: 'Невідомий формат відповіді' };
    }
  }

  _formatAnswer(answer_json) {
    if (!answer_json) return '?';
    const { type, value, correct, primes, cells, gaps } = answer_json;
    if (type === 'array')          return `[${value.join(', ')}]`;
    if (type === 'sieve')          return primes?.join(', ') || String(value);
    if (type === 'pascal-fill')    return cells?.map(c => c.value).join(', ') || '?';
    if (type === 'fibonacci-gaps' || type === 'seq-gaps')
                                   return gaps?.map(g => g.correct).join(', ') || '?';
    if (type === 'fibonacci-order') return correct?.join(', ') || '?';
    return String(value ?? '?');
  }
}
