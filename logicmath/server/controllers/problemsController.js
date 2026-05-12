import GeneratorFactory from '../services/generators/GeneratorFactory.js';
import ProblemSolver from '../services/solvers/ProblemSolver.js';
import ProblemRepository from '../repositories/problemRepository.js';
import AttemptRepository from '../repositories/attemptRepository.js';
import UserRepository from '../repositories/userRepository.js';

const problemRepo = new ProblemRepository();
const attemptRepo = new AttemptRepository();
const userRepo   = new UserRepository();
const solver = new ProblemSolver();

export const generate = async (req, res) => {
  try {
    const { category, level } = req.body;
    if (!category || !level) return res.status(400).json({ error: 'category та level обовʼязкові' });

    const generator = GeneratorFactory.create(category);
    const problemData = generator.generate(parseInt(level));
    
    const problemId = await problemRepo.createProblem({
      category,
      level: parseInt(level),
      ...problemData
    });

    // Send client only type
    const { answer_json, ...safeProblem } = problemData;

    res.json({ id: problemId, category, level, task_type: answer_json.type, ...safeProblem });
  } catch (error) {
    console.error('[generate] Error:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

export const checkAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, hintsUsed, timeSpent } = req.body;
    
    if (answer === undefined) return res.status(400).json({ error: 'Поле answer обовʼязкове' });

    const problem = await problemRepo.findById(id);
    if (!problem) return res.status(404).json({ error: 'Задачу не знайдено' });

    const result = solver.check(problem, answer);
    const userId = req.user?.userId || null;
    
    let xpEarned = 0;
    let alreadySolved = false;

    if (userId) {
      const progress = await attemptRepo.getUserProgress(userId);
      alreadySolved = progress[problem.category]?.[problem.level] === true;
    }

    if (result.correct) {
      if (alreadySolved) {
        xpEarned = 0; // Не даємо XP за вже пройдену задачу
      } else {
        const penalty = 1 - (Math.min(hintsUsed || 0, 3) * 0.3);
        xpEarned = Math.max(0, Math.floor(problem.xp_reward * penalty));
      }
    }

    // Save attempt with XP
    const newXpTotal = await attemptRepo.saveAttemptWithXP({
      userId,
      problemId: id,
      userAnswer: String(answer),
      isCorrect: result.correct,
      hintsUsed: hintsUsed || 0,
      timeSpent: timeSpent || 0,
      xpEarned
    });

    res.json({
      correct: result.correct,
      xpEarned,
      alreadySolved,
      newXpTotal,   // null = unauthorized
      message: result.explanation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
