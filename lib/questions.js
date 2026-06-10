/**
 * EduPulse AI — Question Bank
 * 
 * 15 diagnostic questions across 5 subjects, 3 questions per subject.
 * Each question is tagged with a cognitive skill type:
 *   - recall:      Direct knowledge retrieval
 *   - application: Applying concepts to solve problems
 *   - analysis:    Breaking down complex scenarios, reasoning
 * 
 * This tagging enables the AI analysis engine to identify not just
 * WHAT a student struggles with, but HOW they think.
 */

export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
];

export const SKILL_TYPES = ['recall', 'application', 'analysis'];

export const questions = [
  {
    id: 1,
    subject: 'Mathematics',
    skillType: 'recall',
    question: 'What is the derivative of sin(x)?',
    options: ['cos(x)', '-cos(x)', 'tan(x)', 'sec(x)'],
    correctAnswer: 0,
    explanation: 'The derivative of sin(x) is cos(x). This is a fundamental differentiation rule that should be memorized.',
  },
  {
    id: 5,
    subject: 'Physics',
    skillType: 'application',
    question: 'A 5 kg object is dropped from a height of 20 meters. Ignoring air resistance, what is its velocity just before hitting the ground? (g = 10 m/s²)',
    options: ['10 m/s', '15 m/s', '20 m/s', '25 m/s'],
    correctAnswer: 2,
    explanation: 'Using v² = u² + 2as, where u = 0, a = 10 m/s², s = 20 m: v² = 0 + 2(10)(20) = 400. v = √400 = 20 m/s.',
  },
  {
    id: 9,
    subject: 'Chemistry',
    skillType: 'analysis',
    question: 'Element X has 11 protons and forms a +1 ion. It reacts vigorously with water. Which group of the periodic table does it most likely belong to?',
    options: [
      'Halogens (Group 17)',
      'Noble Gases (Group 18)',
      'Alkali Metals (Group 1)',
      'Alkaline Earth Metals (Group 2)',
    ],
    correctAnswer: 2,
    explanation: '11 protons = sodium (Na). Forming a +1 ion and vigorous reaction with water are hallmark properties of Group 1 alkali metals.',
  },
  {
    id: 10,
    subject: 'Biology',
    skillType: 'recall',
    question: 'Which organelle is known as the "powerhouse of the cell"?',
    options: [
      'Nucleus',
      'Ribosome',
      'Mitochondria',
      'Endoplasmic Reticulum',
    ],
    correctAnswer: 2,
    explanation: 'Mitochondria generate most of the cell\'s ATP through oxidative phosphorylation, earning them the nickname "powerhouse of the cell."',
  },
  {
    id: 15,
    subject: 'English',
    skillType: 'analysis',
    question: 'In the sentence "The old man\'s eyes, weathered by decades of sun, held a quiet wisdom," what literary device is primarily used?',
    options: [
      'Simile',
      'Alliteration',
      'Imagery and Personification',
      'Hyperbole',
    ],
    correctAnswer: 2,
    explanation: 'The sentence uses imagery (vivid sensory description of weathered eyes) combined with personification (eyes "held" wisdom, attributing a human action to eyes).',
  },
];

/**
 * Get questions grouped by subject
 * @returns {Object} Questions organized by subject name
 */
export function getQuestionsBySubject() {
  const grouped = {};
  for (const q of questions) {
    if (!grouped[q.subject]) grouped[q.subject] = [];
    grouped[q.subject].push(q);
  }
  return grouped;
}

/**
 * Score a set of answers against the question bank
 * @param {Object} answers - Map of questionId → selectedOptionIndex
 * @returns {Object} Detailed scoring breakdown
 */
export function scoreAnswers(answers) {
  const subjectScores = {};
  const skillScores = {};
  let totalCorrect = 0;

  // Initialize score accumulators
  for (const subject of SUBJECTS) {
    subjectScores[subject] = { correct: 0, total: 0, percentage: 0 };
  }
  for (const skill of SKILL_TYPES) {
    skillScores[skill] = { correct: 0, total: 0, percentage: 0 };
  }

  // Calculate scores
  for (const q of questions) {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;

    subjectScores[q.subject].total += 1;
    skillScores[q.skillType].total += 1;

    if (isCorrect) {
      totalCorrect += 1;
      subjectScores[q.subject].correct += 1;
      skillScores[q.skillType].correct += 1;
    }
  }

  // Calculate percentages
  for (const subject of SUBJECTS) {
    const s = subjectScores[subject];
    s.percentage = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  }
  for (const skill of SKILL_TYPES) {
    const s = skillScores[skill];
    s.percentage = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  }

  return {
    totalCorrect,
    totalQuestions: questions.length,
    overallPercentage: Math.round((totalCorrect / questions.length) * 100),
    subjectScores,
    skillScores,
  };
}
