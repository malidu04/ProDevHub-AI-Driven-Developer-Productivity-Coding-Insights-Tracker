import openai from '../config/openai.js'

export const AIService = {
  generateWeeklyReport: async (sessions, user) => {
    const totalHours = sessions.reduce((total, session) => total + (session.duration / 3600), 0)
    const projects = [...new Set(sessions.map(session => session.project))]

    const prompt = `
      As a productivity coach for software developers, analyze this coding activity data from the past week and provide a helpful weekly report.

      Weekly Summary:
      - Total coding hours: ${totalHours.toFixed(1)} hours
      - Number of sessions: ${sessions.length}
      - Projects worked on: ${projects.join(', ')}
      - Average session length: ${(totalHours / sessions.length).toFixed(1)} hours

      Please provide:
      1. A brief summary of the week's productivity
      2. 3-4 key achievements or positive patterns
      3. 2-3 actionable recommendations for improvement
      4. 2-3 focus areas for the upcoming week

      Format the response as a JSON object with these fields:
      - summary: string
      - achievements: array of strings
      - recommendations: array of strings  
      - focusAreas: array of strings

      Keep the tone encouraging and constructive.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful productivity coach for software developers." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    return completion.choices[0].message.content
  },

  analyzeProductivity: async (sessions) => {
    const totalHours = sessions.reduce((total, session) => total + (session.duration / 3600), 0)
    const averageSession = sessions.length > 0 ? totalHours / sessions.length : 0

    // Simple productivity score based on total hours (you can make this more sophisticated)
    const productivityScore = Math.min(100, Math.floor((totalHours / 25) * 100))

    return {
      productivityScore,
      totalSessions: sessions.length,
      totalHours: Math.round(totalHours * 10) / 10,
      averageSession: Math.round(averageSession * 10) / 10
    }
  },

  getSuggestions: async (sessions, user) => {
    // This can be enhanced with AI, but for now we return static suggestions
    const suggestions = [
      "Try the Pomodoro technique (25 minutes focused, 5 minutes break)",
      "Schedule your most important coding tasks during your most productive hours",
      "Review and refactor old code to improve maintainability",
      "Take regular breaks to avoid burnout and maintain focus",
      "Set specific, measurable goals for each coding session",
      "Use version control effectively with meaningful commit messages",
      "Document your code as you write it for future reference"
    ]

    return suggestions
  },

  chat: async (message, user) => {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful productivity coach for software developers. Provide concise, actionable advice about coding productivity, time management, learning strategies, and career development. Keep responses under 200 words." 
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 150
    })

    return completion.choices[0].message.content
  }
}