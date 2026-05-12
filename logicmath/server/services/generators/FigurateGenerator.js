export default class FigurateGenerator {
  generate(level) {
    switch (level) {
      case 1: return this._matchFigurate('triangle');
      case 3: return this._matchFigurate('square');
      case 5: return this._matchFigurate('pentagon');
      default: return this._matchFigurate('triangle');
    }
  }

  _rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  //Figurate numbers formulas
  computeFigurate(shape, n) {
    switch (shape) {
      case 'triangle': return n * (n + 1) / 2;
      case 'square':   return n * n;
      case 'pentagon': return n * (3 * n - 1) / 2;
      case 'hexagon':  return n * (2 * n - 1);
      default: return 0;
    }
  }

  _getShapeNameUA(shape) {
    return { triangle: 'трикутне', square: 'квадратне', pentagon: "п'ятикутне", hexagon: 'шестикутне' }[shape];
  }

  _getShapeFormula(shape) {
    return {
      triangle: 'n·(n+1)/2',
      square:   'n²',
      pentagon: 'n·(3n−1)/2',
      hexagon:  'n·(2n−1)'
    }[shape];
  }

  _matchFigurate(shape) {
    const n = this._rand(3, 7);
    const answer = this.computeFigurate(shape, n);
    const dots = this._generateDots(shape, n);

    // Check: dots.length must match answer
    if (dots.length !== answer) {
      console.warn(`[FigurateGenerator] dots.length=${dots.length} !== answer=${answer} (shape=${shape}, n=${n})`);
    }

    // Answer options: 1 correct + 3 incorrect (adjacent figurate numbers)
    const wrongSet = new Set();
    for (let offset = -3; offset <= 3; offset++) {
      if (offset === 0) continue;
      const candidate = answer + offset;
      if (candidate > 0) wrongSet.add(candidate);
      if (wrongSet.size >= 5) break;
    }
    const wrongArr = [...wrongSet].sort(() => Math.random() - 0.5).slice(0, 3);
    const choices = [...wrongArr, answer].sort(() => Math.random() - 0.5);

    const shapeName = this._getShapeNameUA(shape);
    return {
      title: `${shapeName.charAt(0).toUpperCase()}${shapeName.slice(1)} число`,
      description: `Порахуй точки у фігурі та вибери правильну відповідь.`,
      params_json: { shape, n, dots, choices },
      answer_json: { type: 'choice', value: answer },
      steps_json: [],
      xp_reward: shape === 'triangle' ? 10 : shape === 'square' ? 30 : 60
    };
  }


  _generateDots(shape, n) {
    const s = {
      'triangle': 3,
      'square': 4,
      'pentagon': 5,
      'hexagon': 6
    }[shape] || 3;

    const dots = [];
    
    // Polygon center lang =  1, V0 is in  (0,0)
    const r = 1 / (2 * Math.sin(Math.PI / s));
    const C = { x: 0, y: r };
    
    // Base vectors for vertices (from V1 to Vn {s-1})
    // Angle calculation. The rest go around the circle.
    const u = [];
    for (let j = 1; j < s; j++) {
      const theta = -Math.PI / 2 + j * (2 * Math.PI / s);
      u[j] = {
        x: C.x + r * Math.cos(theta),
        y: C.y + r * Math.sin(theta)
      };
    }

    // Layer 1  single point
    dots.push({ x: 0, y: 0 });

    // Layers from 2 to n
    for (let k = 2; k <= n; k++) {
      const p = [];
      // Find vertices k-го шару (scale by k-1)
      for (let j = 1; j < s; j++) {
        p[j] = { x: u[j].x * (k - 1), y: u[j].y * (k - 1) };
      }
      
      // Add first point ray
      dots.push(p[1]);
      
      // Fill segments between adjacent rays
      for (let j = 1; j < s - 1; j++) {
        const start = p[j];
        const end = p[j + 1];
        const segments = k - 1; // number of steps between vertices
        
        // Add points along segment (no start, include end)
        for (let step = 1; step <= segments; step++) {
          const t = step / segments;
          // Round to 3 decimals
          const x = Number((start.x + t * (end.x - start.x)).toFixed(3));
          const y = Number((start.y + t * (end.y - start.y)).toFixed(3));
          dots.push({ x, y });
        }
      }
    }

    return dots;
  }
}
