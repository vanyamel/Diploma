export default class SequencesGenerator {
  generate(level) {
    switch (level) {
      case 1: return this._fillArithmeticGaps(3);
      case 3: return this._fillArithmeticGaps(5);
      case 5: return this._fillGeometricGaps(3);
      default: return this._fillArithmeticGaps(3);
    }
  }

  _rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

 //Fill in the gaps in the arithmetic progression - choose from options
  _fillArithmeticGaps(gapCount) {
    const a1 = this._rand(1, 20);
    const d  = this._rand(1, 10);
    const len = 8; // total sequence length

    const full = Array.from({ length: len }, (_, i) => a1 + i * d);

    // Select gap positions (excluding first and last)
    const available = Array.from({ length: len - 2 }, (_, i) => i + 1);
    const positions = available.sort(() => Math.random() - 0.5).slice(0, gapCount).sort((a, b) => a - b);

    const gaps = positions.map(pos => {
      const correct = full[pos];
      const wrong = new Set();
      while (wrong.size < 3) {
        const delta = this._rand(-3, 3) * d;
        if (delta !== 0) wrong.add(correct + delta);
      }
      return {
        pos,
        correct,
        choices: [...wrong, correct].sort(() => Math.random() - 0.5)
      };
    });

    const displaySeq = full.map((v, i) => ({
      value: v,
      hidden: positions.includes(i)
    }));

    return {
      title: 'Арифметична прогресія',
      description: `Заповни пропуски у прогресії. Різниця d = ${d}. Вибери правильне число для кожного ?`,
      params_json: { sequence: displaySeq, gaps, d, a1 },
      answer_json: { type: 'seq-gaps', gaps: gaps.map(g => ({ pos: g.pos, correct: g.correct })) },
      steps_json: [],
      xp_reward: gapCount <= 3 ? 15 : 35
    };
  }

//Geometric progression
  _fillGeometricGaps(gapCount) {
    const a1 = this._rand(1, 5);
    const q  = this._rand(2, 4);
    const len = 7;

    const full = Array.from({ length: len }, (_, i) => a1 * (q ** i));

    const available = Array.from({ length: len - 2 }, (_, i) => i + 1);
    const positions = available.sort(() => Math.random() - 0.5).slice(0, gapCount).sort((a, b) => a - b);

    const gaps = positions.map(pos => {
      const correct = full[pos];
      const wrong = new Set();
      while (wrong.size < 3) {
        const multiplier = [0.5, 2, 3, 0.25][this._rand(0, 3)];
        const v = Math.round(correct * multiplier);
        if (v !== correct && v > 0) wrong.add(v);
      }
      return {
        pos,
        correct,
        choices: [...[...wrong].slice(0, 3), correct].sort(() => Math.random() - 0.5)
      };
    });

    const displaySeq = full.map((v, i) => ({
      value: v,
      hidden: positions.includes(i)
    }));

    return {
      title: 'Геометрична прогресія',
      description: `Заповни пропуски у геометричній прогресії. Знаменник q = ${q}. Вибери правильне число.`,
      params_json: { sequence: displaySeq, gaps, q, a1 },
      answer_json: { type: 'seq-gaps', gaps: gaps.map(g => ({ pos: g.pos, correct: g.correct })) },
      steps_json: [],
      xp_reward: 60
    };
  }
}
