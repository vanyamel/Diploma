export default class PrimesGenerator {
  generate(level) {
    switch (level) {
      case 1: return this._sieveTask(20);
      case 3: return this._sieveTask(30);
      case 5: return this._sieveTask(50);
      default: return this._sieveTask(20);
    }
  }

  _rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  sieve(limit) {
    const isPrime = new Array(limit + 1).fill(true);
    isPrime[0] = false; isPrime[1] = false;
    for (let p = 2; p * p <= limit; p++) {
      if (isPrime[p]) {
        for (let m = p * p; m <= limit; m += p) isPrime[m] = false;
      }
    }
    const primes = [];
    for (let i = 2; i <= limit; i++) if (isPrime[i]) primes.push(i);
    return { primes, isPrime: isPrime.slice(2) }; // slice(2) → index 0 = number 2
  }

  //Interactive sieve: click on compound numbers to cross them out
  _sieveTask(limit) {
    const { primes, isPrime } = this.sieve(limit);

    // Numbers from 2 to limit for display
    const numbers = [];
    for (let i = 2; i <= limit; i++) {
      numbers.push({ value: i, isPrime: isPrime[i - 2] });
    }

    return {
      title: 'Решето Ератосфена',
      description: `Клікни по всіх СКЛАДЕНИХ числах від 2 до ${limit}, щоб їх закреслити. Прості числа залиши!`,
      params_json: { limit, numbers, primes },
      answer_json: { type: 'sieve', primes },
      steps_json: [],
      xp_reward: limit <= 20 ? 15 : limit <= 30 ? 30 : 60
    };
  }
}
