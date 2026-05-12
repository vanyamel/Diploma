import { create } from 'zustand';

const useStore = create((set, get) => ({
  // current Task
  currentProblem: null,
  setProblem: (problem) => set({ currentProblem: problem, answerResult: null }),

  // Result
  answerResult: null,
  setAnswerResult: (result) => {
    if (!result) {
      set({ answerResult: null });
      return;
    }

    const problem = get().currentProblem;
    const isLocallySolved = problem && get().progress[problem.category]?.[problem.level] === true;
    
    // If problem solved
    const alreadySolved = result.alreadySolved || isLocallySolved;

    // Update result
    const finalResult = {
      ...result,
      alreadySolved,
      xpEarned: alreadySolved ? 0 : result.xpEarned
    };

    set({ answerResult: finalResult });

    // Xp + streak
    if (finalResult.correct && finalResult.xpEarned > 0) {
      set(state => ({
        totalXP: state.totalXP + finalResult.xpEarned,
        streak:  state.streak + 1,
      }));
    } else if (!finalResult.correct && !finalResult.gaveUp) {
      set({ streak: 0 });
    }

    // Progress update
    if (finalResult.correct && problem) {
      set(state => ({
        progress: {
          ...state.progress,
          [problem.category]: {
            ...(state.progress[problem.category] || {}),
            [problem.level]: true,
          },
        },
      }));
    }
  },


  totalXP:  0,
  streak:   0,
  progress: {}, // { PASCAL: { 1: true, 3: false, 5: false }, ... }

  // reset
  reset: () => set({ currentProblem: null, answerResult: null }),
}));

export default useStore;
