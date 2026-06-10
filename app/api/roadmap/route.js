/**
 * POST /api/roadmap
 * 
 * Generates a custom learning roadmap for any topic:
 * 1. Validate request body (topic, optional difficulty & sessionId)
 * 2. Build a structured prompt for Gemini AI
 * 3. Call Gemini to generate a step-by-step learning path
 * 4. Persist to Supabase (graceful failure)
 * 5. Return the roadmap JSON to the client
 */

import { ai, MODEL_ID } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    // -------- 1. Parse & validate input --------
    const body = await request.json();
    const { topic, difficulty = 'intermediate', sessionId = null } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return Response.json(
        { error: 'Missing or invalid "topic" string.' },
        { status: 400 }
      );
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      return Response.json(
        { error: 'Invalid "difficulty". Must be beginner, intermediate, or advanced.' },
        { status: 400 }
      );
    }

    const cleanTopic = topic.trim().substring(0, 200); // Cap length

    // -------- 2. Generate roadmap via Gemini --------
    let roadmap = null;

    if (ai) {
      const durationMap = {
        beginner: '4-6 weeks',
        intermediate: '3-4 weeks',
        advanced: '2-3 weeks',
      };

      const depthMap = {
        beginner: 'Start from absolute basics. Assume no prior knowledge. Use simple language.',
        intermediate: 'Assume foundational understanding. Focus on applying concepts and building skills.',
        advanced: 'Assume strong base knowledge. Focus on nuance, edge cases, and mastery-level depth.',
      };

      const prompt = `You are an expert educational curriculum designer. Create a detailed, structured learning roadmap for the following topic.

## Topic: ${cleanTopic}
## Difficulty Level: ${difficulty}
## Target Duration: ${durationMap[difficulty]}
## Approach: ${depthMap[difficulty]}

Generate a learning roadmap as a JSON object with EXACTLY this structure:
{
  "topic": "${cleanTopic}",
  "difficulty": "${difficulty}",
  "totalSteps": <number between 5 and 8>,
  "estimatedDuration": "<total time estimate>",
  "steps": [
    {
      "step": 1,
      "title": "<concise step title>",
      "description": "<2-3 sentence description of what the learner will study and why>",
      "duration": "<time estimate for this step, e.g., '3 days' or '1 week'>",
      "resources": ["<specific resource 1>", "<specific resource 2>", "<specific resource 3>"],
      "milestone": "<measurable checkpoint, e.g., 'Can solve basic integration problems independently'>"
    }
  ]
}

Guidelines:
- Each step should build on the previous one in a logical progression
- Resources should be specific (e.g., "Khan Academy: Introduction to Derivatives" not just "Watch videos")
- Include a mix of resource types: video courses, textbooks, practice problems, interactive tools
- Milestones should be measurable and specific
- Duration estimates should be realistic for a dedicated student
- Keep descriptions actionable and motivating
- Return ONLY the JSON object, no other text`;

      try {
        const response = await ai.models.generateContent({
          model: MODEL_ID,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.8,
          },
        });

        const text = response.text;
        roadmap = JSON.parse(text);
      } catch (aiError) {
        console.error('Gemini roadmap error:', aiError);
        roadmap = generateFallbackRoadmap(cleanTopic, difficulty);
      }
    } else {
      roadmap = generateFallbackRoadmap(cleanTopic, difficulty);
    }

    // -------- 3. Persist to Supabase --------
    if (supabase) {
      try {
        await supabase.from('roadmaps').insert({
          session_id: sessionId,
          topic: cleanTopic,
          difficulty,
          roadmap,
        });
      } catch (dbError) {
        console.error('Supabase roadmap insert error:', dbError);
      }
    }

    // -------- 4. Return roadmap --------
    return Response.json({
      roadmap,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Roadmap API error:', err);
    return Response.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Generates a template-based fallback roadmap when Gemini is unavailable.
 */
function generateFallbackRoadmap(topic, difficulty) {
  const stepCountMap = { beginner: 6, intermediate: 5, advanced: 5 };
  const durationMap = { beginner: '5 weeks', intermediate: '4 weeks', advanced: '3 weeks' };
  const stepCount = stepCountMap[difficulty];

  const templateSteps = [
    {
      title: `Foundations of ${topic}`,
      description: `Build a solid understanding of the core concepts and terminology. This foundation is critical for everything that follows.`,
      duration: difficulty === 'beginner' ? '1 week' : '3 days',
      resources: [
        `Khan Academy: Introduction to ${topic}`,
        `Wikipedia overview: ${topic} fundamentals`,
        `YouTube: "${topic} explained simply"`,
      ],
      milestone: `Can explain the basic concepts of ${topic} in your own words`,
    },
    {
      title: 'Core Principles & Theory',
      description: `Dive deeper into the theoretical underpinnings. Understand the "why" behind the concepts, not just the "what."`,
      duration: '4-5 days',
      resources: [
        `Textbook chapter on ${topic} theory`,
        'Crash Course video series on the subject',
        'Practice conceptual questions',
      ],
      milestone: 'Can connect multiple concepts and explain their relationships',
    },
    {
      title: 'Guided Practice',
      description: `Apply what you've learned through structured exercises and worked examples. Focus on building problem-solving confidence.`,
      duration: '5-7 days',
      resources: [
        'Worked examples and solutions manual',
        `Practice problem sets for ${topic}`,
        'Study group or tutor sessions',
      ],
      milestone: 'Can solve guided problems with minimal hints',
    },
    {
      title: 'Independent Problem Solving',
      description: `Tackle problems without guidance. Develop your ability to identify which concepts apply and how to execute solutions independently.`,
      duration: '1 week',
      resources: [
        'Advanced problem sets',
        'Past exam questions',
        'Online practice platforms (Brilliant, Coursera)',
      ],
      milestone: 'Can solve new problems independently with 70%+ accuracy',
    },
    {
      title: 'Advanced Applications & Connections',
      description: `Explore real-world applications and cross-topic connections. See how ${topic} relates to other fields and practical scenarios.`,
      duration: '4-5 days',
      resources: [
        `Research papers or articles on ${topic} applications`,
        'Case studies and real-world examples',
        'Interdisciplinary project ideas',
      ],
      milestone: 'Can apply concepts to novel, real-world scenarios',
    },
    {
      title: 'Review, Synthesis & Mastery',
      description: `Consolidate everything you've learned. Identify remaining gaps and achieve mastery-level understanding through comprehensive review.`,
      duration: '3-4 days',
      resources: [
        'Comprehensive review materials',
        'Self-assessment quizzes',
        'Teaching the material to someone else (Feynman Technique)',
      ],
      milestone: `Can teach ${topic} concepts to others with confidence`,
    },
  ];

  return {
    topic,
    difficulty,
    totalSteps: stepCount,
    estimatedDuration: durationMap[difficulty],
    steps: templateSteps.slice(0, stepCount).map((step, i) => ({
      step: i + 1,
      ...step,
    })),
  };
}
