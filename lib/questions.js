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
  // =============================================
  // MATHEMATICS (3 questions)
  // =============================================
  {
    id: 1,
    subject: 'Mathematics',
    skillType: 'recall',
    question: 'What is the derivative of sin(x)?',
    options: ['cos(x)', '-cos(x)', 'tan(x)', 'sec(x)'],
    correctAnswer: 0,
    explanation:
      'The derivative of sin(x) is cos(x). This is a fundamental differentiation rule that should be memorized.',
  },
  {
    id: 2,
    subject: 'Mathematics',
    skillType: 'application',
    question:
      'A rectangular garden has a perimeter of 36 meters. If the length is twice the width, what is the area of the garden?',
    options: ['54 m²', '72 m²', '81 m²', '108 m²'],
    correctAnswer: 1,
    explanation:
      'Let width = w. Then length = 2w. Perimeter: 2(w + 2w) = 36 → 6w = 36 → w = 6. Length = 12. Area = 6 × 12 = 72 m².',
  },
  {
    id: 3,
    subject: 'Mathematics',
    skillType: 'analysis',
    question:
      'If f(x) = x³ − 3x² + 2, at how many points does the function change from increasing to decreasing?',
    options: ['0', '1', '2', '3'],
    correctAnswer: 1,
    explanation:
      "f'(x) = 3x² − 6x = 3x(x − 2). Critical points at x = 0 and x = 2. f''(0) = −6 < 0 (local max, changes from increasing to decreasing). f''(2) = 6 > 0 (local min, changes from decreasing to increasing). Only 1 point changes from increasing to decreasing.",
  },

  // =============================================
  // PHYSICS (3 questions)
  // =============================================
  {
    id: 4,
    subject: 'Physics',
    skillType: 'recall',
    question: "What is Newton's Second Law of Motion?",
    options: [
      'Every action has an equal and opposite reaction',
      'Force equals mass times acceleration (F = ma)',
      'An object at rest stays at rest unless acted upon',
      'Energy cannot be created or destroyed',
    ],
    correctAnswer: 1,
    explanation:
      "Newton's Second Law states F = ma, meaning the force acting on an object equals its mass multiplied by its acceleration.",
  },
  {
    id: 5,
    subject: 'Physics',
    skillType: 'application',
    question:
      'A 5 kg object is dropped from a height of 20 meters. Ignoring air resistance, what is its velocity just before hitting the ground? (g = 10 m/s²)',
    options: ['10 m/s', '15 m/s', '20 m/s', '25 m/s'],
    correctAnswer: 2,
    explanation:
      'Using v² = u² + 2as, where u = 0, a = 10 m/s², s = 20 m: v² = 0 + 2(10)(20) = 400. v = √400 = 20 m/s.',
  },
  {
    id: 6,
    subject: 'Physics',
    skillType: 'analysis',
    question:
      'Two identical balls are thrown from the same height — one horizontally and one dropped vertically. Ignoring air resistance, which hits the ground first?',
    options: [
      'The one dropped vertically',
      'The one thrown horizontally',
      'They hit at the same time',
      'It depends on the horizontal velocity',
    ],
    correctAnswer: 2,
    explanation:
      'Both balls experience the same vertical acceleration due to gravity. The horizontal velocity of the thrown ball does not affect its vertical motion. They hit the ground at the same time — demonstrating the independence of perpendicular motion components.',
  },

  // =============================================
  // CHEMISTRY (3 questions)
  // =============================================
  {
    id: 7,
    subject: 'Chemistry',
    skillType: 'recall',
    question: 'What is the chemical formula for sulfuric acid?',
    options: ['HCl', 'H₂SO₄', 'HNO₃', 'H₃PO₄'],
    correctAnswer: 1,
    explanation:
      'Sulfuric acid has the formula H₂SO₄. It is a strong diprotic acid commonly used in industrial processes.',
  },
  {
    id: 8,
    subject: 'Chemistry',
    skillType: 'application',
    question:
      'How many moles of water are produced when 2 moles of hydrogen gas react completely with oxygen? (2H₂ + O₂ → 2H₂O)',
    options: ['1 mole', '2 moles', '3 moles', '4 moles'],
    correctAnswer: 1,
    explanation:
      'From the balanced equation 2H₂ + O₂ → 2H₂O, 2 moles of H₂ produce exactly 2 moles of H₂O. The mole ratio is 1:1 for H₂ to H₂O.',
  },
  {
    id: 9,
    subject: 'Chemistry',
    skillType: 'analysis',
    question:
      'Element X has 11 protons and forms a +1 ion. It reacts vigorously with water. Which group of the periodic table does it most likely belong to?',
    options: [
      'Halogens (Group 17)',
      'Noble Gases (Group 18)',
      'Alkali Metals (Group 1)',
      'Alkaline Earth Metals (Group 2)',
    ],
    correctAnswer: 2,
    explanation:
      '11 protons = sodium (Na). Forming a +1 ion and vigorous reaction with water are hallmark properties of Group 1 alkali metals. This requires connecting atomic structure knowledge with periodic trends and reactivity patterns.',
  },

  // =============================================
  // BIOLOGY (3 questions)
  // =============================================
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
    explanation:
      'Mitochondria generate most of the cell\'s ATP through oxidative phosphorylation, earning them the nickname "powerhouse of the cell."',
  },
  {
    id: 11,
    subject: 'Biology',
    skillType: 'application',
    question:
      'In a pea plant, the allele for tall (T) is dominant over short (t). What percentage of offspring from a Tt × Tt cross will be short?',
    options: ['0%', '25%', '50%', '75%'],
    correctAnswer: 1,
    explanation:
      'Using a Punnett square: TT (25%), Tt (50%), tt (25%). Only tt expresses the recessive short phenotype, so 25% will be short.',
  },
  {
    id: 12,
    subject: 'Biology',
    skillType: 'analysis',
    question:
      'A population of beetles has both green and brown individuals. Birds eat beetles they can see on brown bark. Over 50 generations, what would you expect?',
    options: [
      'All beetles become green through effort',
      'Brown beetles increase in proportion due to natural selection',
      'The beetle population will go extinct',
      'Beetle color will become random',
    ],
    correctAnswer: 1,
    explanation:
      'Brown beetles are camouflaged on brown bark, so they survive predation more often and reproduce more. Over generations, natural selection increases the proportion of brown beetles. This demonstrates directional selection — a core evolutionary mechanism.',
  },

  // =============================================
  // ENGLISH (3 questions)
  // =============================================
  {
    id: 13,
    subject: 'English',
    skillType: 'recall',
    question: 'Which of the following is a conjunction?',
    options: ['Quickly', 'Beautiful', 'However', 'Under'],
    correctAnswer: 2,
    explanation:
      '"However" is a conjunctive adverb used to connect contrasting ideas. "Quickly" is an adverb, "Beautiful" is an adjective, and "Under" is a preposition.',
  },
  {
    id: 14,
    subject: 'English',
    skillType: 'application',
    question:
      'Choose the sentence with correct subject-verb agreement:',
    options: [
      'The group of students are studying.',
      'The group of students is studying.',
      'The group of students were studying.',
      'The group of students have been studying.',
    ],
    correctAnswer: 1,
    explanation:
      '"The group" is a collective noun acting as a single unit, requiring the singular verb "is." The prepositional phrase "of students" does not change the subject.',
  },
  {
    id: 15,
    subject: 'English',
    skillType: 'analysis',
    question:
      'In the sentence "The old man\'s eyes, weathered by decades of sun, held a quiet wisdom," what literary device is primarily used?',
    options: [
      'Simile',
      'Alliteration',
      'Imagery and Personification',
      'Hyperbole',
    ],
    correctAnswer: 2,
    explanation:
      'The sentence uses imagery (vivid sensory description of weathered eyes) combined with personification (eyes "held" wisdom, attributing a human action to eyes). This requires identifying and distinguishing multiple literary devices working together.',
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
