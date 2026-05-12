export default class PascalGenerator {
  generate(level) {
    switch (level) {
      case 1: return this._fillMissing(5, 2);
      case 3: return this._fillMissing(7, 4);
      case 5: return this._fillMissing(9, 6);
      default: return this._fillMissing(5, 2);
    }
  }

  _rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  buildPascalTriangle(n) {
    const triangle = [];
    for (let i = 0; i <= n; i++) {
      const row = new Array(i + 1);
      row[0] = 1; row[i] = 1;
      for (let j = 1; j < i; j++) row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
      triangle.push(row);
    }
    return triangle;
  }

  _fillMissing(rows, missingCount) {
    const triangle = this.buildPascalTriangle(rows);

    // Collect all NON-edge cells (рядки 2+, не перший і не останній елемент)
    const candidates = [];
    for (let r = 2; r <= rows; r++) {
      for (let c = 1; c < r; c++) {
        candidates.push({ row: r, col: c, value: triangle[r][c] });
      }
    }

    if (candidates.length === 0) throw new Error('Недостатньо клітинок для задачі');

    // Randomly select gaps
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    const missing = shuffled.slice(0, Math.min(missingCount, candidates.length));

    // Build triangle view з hidden for passes
    const displayTriangle = triangle.map((row, r) =>
      row.map((val, c) => ({
        value: val,
        hidden: missing.some(m => m.row === r && m.col === c)
      }))
    );

    return {
      title: 'Заповни трикутник Паскаля',
      description: 'Заповни пропущені клітинки (позначені ?) у трикутнику Паскаля.',
      params_json: { rows, missing, triangle: displayTriangle },
      answer_json: { type: 'pascal-fill', cells: missing },
      steps_json: [],
      xp_reward: missingCount <= 2 ? 10 : missingCount <= 4 ? 30 : 60
    };
  }
}
