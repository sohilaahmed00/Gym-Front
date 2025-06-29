import React, { useEffect, useState } from 'react';
import { InferenceClient } from '@huggingface/inference';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const client = new InferenceClient(process.env.REACT_APP_HF_API_KEY);

const getTotalSessions = (type) => {
  switch (type) {
    case '1_Month': return 12;
    case '3_Months': return 24;
    case '6_Months': return 36;
    case '12_Months': return 72;
    default: return 0;
  }
};

const planDescriptions = {
  '1_Month': 'Includes 12 sessions, designed for beginners to get into a routine.',
  '3_Months': 'Includes 24 sessions, focused on building consistency and strength.',
  '6_Months': 'Includes 36 sessions, ideal for muscle gain and long-term results.',
  '12_Months': 'Includes 72 sessions, a full transformation journey with progressive phases.',
};

const suggestedQuestions = [
  "What is my next workout?",
  "What should I eat today?",
  "How much progress have I made?",
  "What does Chest Press target?"
];

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextData, setContextData] = useState(null);
  const userId = localStorage.getItem('id');

  useEffect(() => {
    const saved = localStorage.getItem(`chatHistory_${userId}`);
    if (saved) setMessages(JSON.parse(saved));
  }, [userId]);

  useEffect(() => {
    if (userId && messages.length) {
      localStorage.setItem(`chatHistory_${userId}`, JSON.stringify(messages));
    }
  }, [messages, userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, subRes, assignRes, nutritionRes, allExercisesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Users/Getuserbyid/${userId}`),
          axios.get(`${API_BASE_URL}/Subscribes/GetSubscribeByUserId/${userId}`),
          axios.get(`${API_BASE_URL}/Assignments/GetAllUserAssignments/${userId}`),
          axios.get(`${API_BASE_URL}/NutritionPlans/GetAllUserNutritionplans/${userId}`),
          axios.get(`${API_BASE_URL}/Exercises/GetAllExercises`)
        ]);
        
        const user = userRes.data;
        const sub = subRes.data[0];
        const assignments = assignRes.data;
        const nutrition = nutritionRes.data;
        const allExercises = allExercisesRes.data;

        const total = getTotalSessions(sub.subscriptionType);
        const completed = assignments.filter(a => a.isCompleted).length;
        const progress = Math.floor((completed / total) * 100);

        setContextData({
          name: user.applicationUser.fullName,
          goal: user.fitness_Goal,
          plan: sub.subscriptionType,
          planDetails: planDescriptions[sub.subscriptionType] || '',
          progress,
          assignments,
          nutritionPlans: nutrition,
          allExercises,
        });
      } catch (err) {
        console.error('Error loading full context:', err);
      }
    };

    fetchData();
  }, [userId]);

 const buildSystemPrompt = () => {
  const c = contextData;

  const assignmentLines = c.assignments.map(a => (
    `- ${a.day}: ${a.exercise?.exercise_Name} (${a.exercise?.target_Muscle}, ${a.exercise?.duration} mins)`
  )).join('\n');

  const nutritionLines = c.nutritionPlans.map(n => (
    `- ${n.day}: Meals [${n.firstMeal}, ${n.secondMeal}, ${n.thirdMeal}, ${n.fourthMeal}, ${n.fifthMeal}], Snacks: ${n.snacks}, Notes: ${n.notes}`
  )).join('\n');

  const exerciseLines = c.allExercises.map(e => (
    `- ${e.exercise_Name}: ${e.description} (Target: ${e.target_Muscle}, Difficulty: ${e.difficulty_Level})`
  )).join('\n');

  const today = new Date().toISOString().split('T')[0];

  return `
You are a smart assistant inside GymMate – a fitness and nutrition platform.

👤 User Profile:
- Name: ${c.name}
- Goal: ${c.goal}
- Subscription: ${c.plan} — ${c.planDetails}
- Progress: ${c.progress}%

📅 Assignments:
${assignmentLines}

🥗 Nutrition Plans:
${nutritionLines}

🏋️ Exercises:
${exerciseLines}

📌 Today's Date: ${today}

🧠 Instructions:
- When the user asks about today’s meals, use the nutrition plan for "${today}" from the list above.
- When asked about today’s workout, find the assignment with date "${today}" and return the workout and focus.
- When user asks about a specific exercise (e.g. "Chest Press"), find it by name in the exercises section and explain its purpose.
- Always answer only what the user asks for — do NOT give full lists unless requested.
- Use clear formatting with bullet points or sections.
- Be concise, direct, and helpful.
`;
};


  const handleSend = async (customInput = null) => {
    const text = customInput ?? input;
    if (!text.trim() || !contextData) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await client.chatCompletion({
        provider: 'cohere',
        model: 'CohereLabs/aya-expanse-8b',
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...newMessages.map(m => ({ role: m.role, content: m.content })),
        ],
      });

      const reply = response?.choices?.[0]?.message?.content || '🤖 Sorry, I didn’t get that.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error talking to the bot.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 style={{ color: '#fd5c28' }}>🤖 Chat with your fitness assistant</h3>
        <button
          className="btn my-2 btn-sm btn-outline-danger"
          onClick={() => {
            setMessages([]);
            localStorage.removeItem(`chatHistory_${userId}`);
          }}
        >
          🗑️ Clear Chat
        </button>
      <div className="chat-box border rounded p-3 mb-3" style={{ height: '400px', overflowY: 'auto', background: '#f8f9fa' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 d-flex flex-column ${msg.role === 'user' ? 'align-items-end' : 'align-items-start'}`}>
            <div
              className="p-2 rounded shadow-sm"
              style={{
                maxWidth: '75%',
                wordBreak: 'break-word',
                backgroundColor: msg.role === 'user' ? '#fd5c28' : '#f1f1f1',
                color: msg.role === 'user' ? '#fff' : '#000',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-muted">Typing...</div>}
      </div>

      <div className="input-group mb-2">
        <input
          className="form-control "
          value={input}
          style={{ outlineColor:'#fd5c28 !important'}}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask anything about your plan, workout, nutrition..."
        />
        <button
          className="btn"
          style={{ backgroundColor: '#fd5c28', color: '#fff', outlineColor:'#fd5c28' }}
          onClick={() => handleSend()}
        >
          Send
        </button>
      </div>

      <div className="d-flex gap-2 flex-wrap">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            className="btn btn-outline-secondary btn-sm"
            onClick={() => handleSend(q)}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatBot;
