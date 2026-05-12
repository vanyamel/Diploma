export default class FibonacciGenerator {
  generate(level) {
    switch (level) {
      case 1: return this._sortSequence(8);   // order 5 чисел
      case 3: return this._fillGaps(10, 3);   // fill 3 пропуски
      case 5: return this._fillGaps(14, 5);   // fill 5 пропусків
      default: return this._sortSequence(8);
    }
  }

  _rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  buildFibonacci(n) {
    const fib = [1, 1];
    for (let i = 2; i < n; i++) fib[i] = fib[i - 1] + fib[i - 2];
    return fib;
  }


//Drag and Drop:

  _sortSequence(n) {
    const fib = this.buildFibonacci(n);
    const display = fib.slice(0, 6); // display 6 first
    const shuffled = [...display].sort(() => Math.random() - 0.5);

    return {
      title: 'Послідовність Фібоначчі',
      description: 'Впорядкуй числа у правильній послідовності Фібоначчі, перетягуючи їх на потрібне місце.',
      params_json: { correct: display, shuffled },
      answer_json: { type: 'fibonacci-order', correct: display },
      steps_json: [],
      xp_reward: 10
    };
  }

//Click
  _fillGaps(n, gapsCount) {
    const fib = this.buildFibonacci(n);
    const display = fib.slice(0, n);

    // Select gap positions
    const available = Array.from({ length: n - 2 }, (_, i) => i + 2);
    const shuffledPos = [...available].sort(() => Math.random() - 0.5);
    const positions = shuffledPos.slice(0, gapsCount).sort((a, b) => a - b);

    const gaps = positions.map(pos => {
      const correct = display[pos];
      const wrongSet = new Set();
      let attempts = 0;
      while (wrongSet.size < 3 && attempts < 50) {
        const delta = this._rand(1, Math.max(3, correct));
        const candidate = correct + (Math.random() > 0.5 ? delta : -delta);
        if (candidate > 0 && candidate !== correct) wrongSet.add(candidate);
        attempts++;
      }
      // If not enough unique — add random
      let fallback = correct + 10;
      while (wrongSet.size < 3) { wrongSet.add(fallback++); }
      const choices = [...wrongSet, correct].sort(() => Math.random() - 0.5);
      return { pos, correct, choices };
    });

    const displaySeq = display.map((v, i) => ({
      value: v,
      hidden: positions.includes(i)
    }));

    return {
      title: 'Заповни пропуски Фібоначчі',
      description: 'Вибери правильне число для кожного пропуску у послідовності.',
      params_json: { sequence: displaySeq, gaps },
      answer_json: { type: 'fibonacci-gaps', gaps: gaps.map(g => ({ pos: g.pos, correct: g.correct })) },
      steps_json: [],
      xp_reward: gapsCount === 3 ? 30 : 60
    };
  }
}
