export default class FractalsGenerator {
  generate(level) {
    switch (level) {
      case 1: return this._sierpinskiSlider(3);
      case 3: return this._sierpinskiSlider(4);
      case 5: return this._kochQuestion();
      default: return this._sierpinskiSlider(3);
    }
  }

  _rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }


//Slider: drag the slider to build a fractal -> answer how many triangles Question is asked for a random step

  _sierpinskiSlider(maxStep) {
    const targetStep = this._rand(1, maxStep);
    const answer = 3 ** targetStep;

    return {
      title: 'Фрактал Серпінського',
      description: `Потягни слайдер до кроку ${targetStep} і порахуй кількість зафарбованих (кольорових) трикутників. Введи відповідь.`,
      params_json: { maxStep, targetStep },
      answer_json: { type: 'number', value: answer },
      steps_json: [],
      xp_reward: targetStep <= 2 ? 10 : targetStep <= 3 ? 30 : 60
    };
  }


  _kochQuestion() {
    const targetIter = this._rand(2, 4);
    // After n iterations: 4^n segments
    const answer = 4 ** targetIter;

    return {
      title: 'Крива Коха',
      description: `Переглянь криву Коха при різних ітераціях за допомогою слайдера. Скільки відрізків на ітерації ${targetIter}?`,
      params_json: { targetIter, maxIter: 5, type: 'koch' },
      answer_json: { type: 'number', value: answer },
      steps_json: [],
      xp_reward: 60
    };
  }
}
