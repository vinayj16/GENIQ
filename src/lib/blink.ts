import { createClient } from '@blinkdotnew/sdk'

// Initialize Blink client with project configuration
export const blink = createClient({
  projectId: 'geniq-interview-prep-k7tbv3h9',
  authRequired: false // We'll handle auth manually for now
})

// AI service functions for coding reviews and MCQs
export const aiService = {
  // Analyze code and provide feedback
  async analyzeCode(code: string, language: string, difficulty: string) {
    try {
      const { text } = await blink.ai.generateText({
        prompt: `You are an expert technical interviewer. Analyze this ${language} code for a ${difficulty} level interview question.

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Code quality assessment (1-10 score)
2. Time complexity analysis
3. Space complexity analysis
4. Specific suggestions for improvement
5. Alternative approaches if applicable
6. Interview feedback (what an interviewer would say)

Format your response as JSON with the following structure:
{
  "score": number,
  "timeComplexity": "string",
  "spaceComplexity": "string",
  "feedback": "string",
  "suggestions": ["string"],
  "alternatives": ["string"],
  "interviewerNotes": "string"
}`,
        model: 'gpt-4o-mini',
        maxTokens: 1000
      })

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      // Fallback if JSON parsing fails
      return {
        score: 7,
        timeComplexity: "Analysis in progress",
        spaceComplexity: "Analysis in progress",
        feedback: text,
        suggestions: ["Review the AI feedback above"],
        alternatives: [],
        interviewerNotes: "Code submitted for review"
      }
    } catch (error) {
      console.error('Code analysis error:', error)
      throw new Error('Failed to analyze code. Please try again.')
    }
  },

  // Generate coding hints
  async generateHint(problemTitle: string, userCode: string, language: string) {
    try {
      const { text } = await blink.ai.generateText({
        prompt: `You are a helpful coding mentor. The user is working on: "${problemTitle}"

Their current code:
\`\`\`${language}
${userCode}
\`\`\`

Provide a helpful hint that guides them toward the solution without giving it away completely. Be encouraging and educational.`,
        model: 'gpt-4o-mini',
        maxTokens: 300
      })

      return { hint: text }
    } catch (error) {
      console.error('Hint generation error:', error)
      throw new Error('Failed to generate hint. Please try again.')
    }
  },

  // Generate MCQ questions
  async generateMCQs(topic: string, difficulty: string, count: number = 5) {
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `Generate ${count} multiple choice questions about ${topic} for ${difficulty} level technical interviews. 
        
        Each question should:
        - Be relevant to technical interviews
        - Have 4 options (A, B, C, D)
        - Have exactly one correct answer
        - Include a brief explanation for the correct answer
        - Be appropriate for ${difficulty} difficulty level`,
        schema: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  question: { type: 'string' },
                  options: {
                    type: 'object',
                    properties: {
                      A: { type: 'string' },
                      B: { type: 'string' },
                      C: { type: 'string' },
                      D: { type: 'string' }
                    },
                    required: ['A', 'B', 'C', 'D']
                  },
                  correctAnswer: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
                  explanation: { type: 'string' },
                  difficulty: { type: 'string' },
                  topic: { type: 'string' }
                },
                required: ['id', 'question', 'options', 'correctAnswer', 'explanation', 'difficulty', 'topic']
              }
            }
          },
          required: ['questions']
        }
      })

      return object.questions
    } catch (error) {
      console.error('MCQ generation error:', error)
      throw new Error('Failed to generate MCQs. Please try again.')
    }
  },

  // Analyze MCQ performance
  async analyzeMCQPerformance(answers: Array<{ question: string, userAnswer: string, correctAnswer: string, isCorrect: boolean }>) {
    try {
      const { text } = await blink.ai.generateText({
        prompt: `Analyze this MCQ performance and provide personalized feedback:

Results: ${answers.map((a, i) => `
Question ${i + 1}: ${a.question}
User Answer: ${a.userAnswer}
Correct Answer: ${a.correctAnswer}
Result: ${a.isCorrect ? 'Correct' : 'Incorrect'}
`).join('')}

Score: ${answers.filter(a => a.isCorrect).length}/${answers.length}

Provide:
1. Overall performance assessment
2. Strengths identified
3. Areas for improvement
4. Specific study recommendations
5. Next steps for preparation

Keep the feedback encouraging and actionable.`,
        model: 'gpt-4o-mini',
        maxTokens: 500
      })

      return { analysis: text }
    } catch (error) {
      console.error('Performance analysis error:', error)
      throw new Error('Failed to analyze performance. Please try again.')
    }
  }
}