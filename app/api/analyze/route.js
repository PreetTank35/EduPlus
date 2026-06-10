/**
 * POST /api/analyze
 * 
 * Processes quiz submissions through the following pipeline:
 * 1. Validate request body (answers object, sessionId)
 * 2. Score answers against the question bank
 * 3. Build a diagnostic prompt for Gemini AI
 * 4. Call Gemini to generate structured cognitive analysis
 * 5. Persist results to Supabase (graceful failure)
 * 6. Return combined scores + AI analysis to the client
 */

import { ai, MODEL_ID } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { questions, scoreAnswers, SUBJECTS, SKILL_TYPES } from '@/lib/questions';

export async function POST(request) {
  try {
    // -------- 1. Parse & validate input --------
    const body = await request.json();
    const { answers, sessionId } = body;

    if (!answers || typeof answers !== 'object') {
      return Response.json(
        { error: 'Missing or invalid "answers" object. Expected { questionId: selectedOptionIndex }.' },
        { status: 400 }
      );
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return Response.json(
        { error: 'Missing or invalid "sessionId" string.' },
        { status: 400 }
      );
    }

    // Validate that we have answers for all questions
    const answeredIds = Object.keys(answers).map(Number);
    const questionIds = questions.map((q) => q.id);
    const missingIds = questionIds.filter((id) => !answeredIds.includes(id));

    if (missingIds.length > 0) {
      return Response.json(
        { error: `Missing answers for question(s): ${missingIds.join(', ')}` },
        { status: 400 }
      );
    }

    // -------- 2. Score the answers --------
    // Convert string keys to number keys for scoring
    const normalizedAnswers = {};
    for (const [key, value] of Object.entries(answers)) {
      normalizedAnswers[Number(key)] = Number(value);
    }

    const scores = scoreAnswers(normalizedAnswers);

    // -------- 3. Build detailed context for Gemini --------
    const questionDetails = questions.map((q) => {
      const userAnswer = normalizedAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      return {
        id: q.id,
        subject: q.subject,
        skillType: q.skillType,
        question: q.question,
        userAnswer: q.options[userAnswer] || 'No answer',
        correctAnswer: q.options[q.correctAnswer],
        isCorrect,
      };
    });

    // -------- 4. Call Gemini AI for analysis --------
    let analysis = null;

    if (ai) {
      const prompt = `You are an expert educational diagnostician. Analyze the following student assessment results and provide a comprehensive cognitive performance analysis.

## Student Performance Data

**Overall Score:** ${scores.totalCorrect}/${scores.totalQuestions} (${scores.overallPercentage}%)

**Subject Scores:**
${Object.entries(scores.subjectScores)
  .map(([subj, data]) => `- ${subj}: ${data.correct}/${data.total} (${data.percentage}%)`)
  .join('\n')}

**Cognitive Skill Scores:**
${Object.entries(scores.skillScores)
  .map(([skill, data]) => `- ${skill}: ${data.correct}/${data.total} (${data.percentage}%)`)
  .join('\n')}

**Detailed Question-by-Question Results:**
${questionDetails
  .map(
    (q) =>
      `Q${q.id} [${q.subject}/${q.skillType}]: ${q.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'} — "${q.question}" (Student: "${q.userAnswer}", Correct: "${q.correctAnswer}")`
  )
  .join('\n')}

## Analysis Required

Provide your analysis as a JSON object with EXACTLY this structure:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "cognitiveProfile": "A 2-3 sentence summary of the student's cognitive processing style, identifying whether they excel at recall, application, or analysis tasks, and how this manifests across subjects.",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4"]
}

Guidelines:
- Each strength/weakness should be specific and actionable (e.g., "Strong logical deduction in Physics motion problems" not just "Good at Physics")
- Connect cross-subject patterns (e.g., "Mathematical calculation errors also impact Chemistry stoichiometry performance")
- Recommendations should be concrete study actions, not generic advice
- The cognitive profile should identify root-cause patterns, not just restate scores
- Return ONLY the JSON object, no other text`;

      try {
        const response = await ai.models.generateContent({
          model: MODEL_ID,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const text = response.text;
        analysis = JSON.parse(text);
      } catch (aiError) {
        console.error('Gemini API error:', aiError);
        // Provide fallback analysis if Gemini fails
        analysis = generateFallbackAnalysis(scores, questionDetails);
      }
    } else {
      // No Gemini API key — use fallback analysis
      analysis = generateFallbackAnalysis(scores, questionDetails);
    }

    // -------- 5. Persist to Supabase --------
    if (supabase) {
      try {
        await supabase.from('assessments').insert({
          session_id: sessionId,
          answers: normalizedAnswers,
          scores,
          ai_analysis: analysis,
          total_correct: scores.totalCorrect,
          total_questions: scores.totalQuestions,
          overall_percentage: scores.overallPercentage,
        });
      } catch (dbError) {
        // Log but don't fail the request — DB is optional for MVP
        console.error('Supabase insert error:', dbError);
      }
    }

    // -------- 6. Return results --------
    return Response.json({
      sessionId,
      scores,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Analyze API error:', err);
    return Response.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Generates a rule-based fallback analysis when Gemini is unavailable.
 * Uses scoring data to produce meaningful insights without AI.
 */
function generateFallbackAnalysis(scores, questionDetails) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  // Analyze subject performance
  const subjectEntries = Object.entries(scores.subjectScores);
  const sorted = [...subjectEntries].sort((a, b) => b[1].percentage - a[1].percentage);

  // Top performers → strengths
  sorted.slice(0, 2).forEach(([subject, data]) => {
    if (data.percentage >= 67) {
      strengths.push(`Strong performance in ${subject} (${data.percentage}% accuracy)`);
    }
  });

  // Bottom performers → weaknesses
  sorted.slice(-2).forEach(([subject, data]) => {
    if (data.percentage < 67) {
      weaknesses.push(`Needs improvement in ${subject} (${data.percentage}% accuracy)`);
      recommendations.push(`Review core ${subject} concepts, focusing on foundational principles.`);
    }
  });

  // Analyze cognitive skills
  const skillEntries = Object.entries(scores.skillScores);
  skillEntries.forEach(([skill, data]) => {
    if (data.percentage >= 80) {
      strengths.push(`Excellent ${skill} skills across subjects`);
    } else if (data.percentage < 50) {
      weaknesses.push(`${skill.charAt(0).toUpperCase() + skill.slice(1)} questions are challenging`);
      recommendations.push(
        `Practice more ${skill}-type problems to strengthen this cognitive dimension.`
      );
    }
  });

  // Ensure we always have some items
  if (strengths.length === 0) strengths.push('Willingness to complete the full assessment shows dedication');
  if (weaknesses.length === 0) weaknesses.push('Minor gaps detected — focused review will address them');
  if (recommendations.length === 0) recommendations.push('Continue regular practice across all subjects');

  // Build cognitive profile
  const bestSkill = [...skillEntries].sort((a, b) => b[1].percentage - a[1].percentage)[0];
  const cognitiveProfile = `This student shows a preference for ${bestSkill[0]}-oriented thinking (${bestSkill[1].percentage}% accuracy). Their overall score of ${scores.overallPercentage}% suggests ${
    scores.overallPercentage >= 70
      ? 'solid foundational understanding with specific areas to refine.'
      : 'key conceptual gaps that can be addressed with targeted study.'
  }`;

  return {
    strengths,
    weaknesses,
    cognitiveProfile,
    recommendations,
  };
}
