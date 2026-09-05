const PortfolioContent = require('../models/PortfolioContent');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');

/*
|--------------------------------------------------------------------------
| GROQ CONFIG
|--------------------------------------------------------------------------
|
| Groq se FREE API key milti hai:
| https://console.groq.com/keys
|
| .env me set karo:
| GROQ_API_KEY=your_key_here
|
| Groq OpenAI-compatible chat completions endpoint use karta hai,
| standard "Authorization: Bearer <key>" header ke saath.
|
|--------------------------------------------------------------------------
*/

const GROQ_MODEL = 'openai/gpt-oss-120b';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

/*
|--------------------------------------------------------------------------
| Helper: Build Portfolio Context
|--------------------------------------------------------------------------
|
| Chatbot ko sahi jawab dene ke liye MongoDB se live portfolio data
| (about, skills, experience, education, projects, certificates,
| contact) nikal kar ek text context banate hain. Ye context Gemini
| ko system instruction ke saath bhejte hain, taaki bot sirf isi
| person ke baare me accurate jawab de.
|
|--------------------------------------------------------------------------
*/

const buildPortfolioContext = async () => {
  const portfolio = await PortfolioContent.findOne({ key: 'main' });
  const projects = await Project.find().limit(20);
  const certificates = await Certificate.find({ isVisible: true }).limit(20);

  const hero = portfolio?.hero || {};
  const about = portfolio?.about || {};
  const contact = portfolio?.contact || {};
  const socialLinks = portfolio?.socialLinks || {};
  const experience = portfolio?.experience || [];
  const education = portfolio?.education || [];
  const skillGroups = portfolio?.skills || [];

  const skillsText = skillGroups
    .map((group) => {
      const names = (group.skills || []).map((s) => s.name).join(', ');
      return `${group.title}: ${names}`;
    })
    .join('\n');

  const experienceText = experience
    .map(
      (exp) =>
        `- ${exp.role} at ${exp.company} (${exp.duration}, ${exp.type}): ${exp.description}`
    )
    .join('\n');

  const educationText = education
    .map(
      (edu) =>
        `- ${edu.degree} from ${edu.institution} (${edu.duration}, ${edu.status})`
    )
    .join('\n');

  const projectsText = projects
    .map(
      (p) =>
        `- ${p.title} [${p.category}]: ${p.description} | Tech: ${(p.techStack || []).join(', ')}${p.liveLink ? ` | Live: ${p.liveLink}` : ''}${p.githubLink ? ` | GitHub: ${p.githubLink}` : ''}`
    )
    .join('\n');

  const certificatesText = certificates
    .map((c) => `- ${c.title} by ${c.issuer} (${c.issueDate})`)
    .join('\n');

  return `
You are the official AI assistant embedded on ${hero.name || 'this'}'s personal portfolio website.
Answer visitor questions ONLY using the information below. Be friendly, concise and helpful.
If something is not covered in this data, politely say you don't have that information and
suggest the visitor use the Contact section to reach out directly. Do not make up facts.

NAME: ${hero.name || 'N/A'}
ROLE: ${hero.role || 'N/A'}
TAGLINE: ${hero.tagline || 'N/A'}
AVAILABILITY: ${hero.availability || 'N/A'}

ABOUT:
${about.shortDescription || ''}
${about.introduction || ''}
Specialization: ${about.specialization || 'N/A'}
Career Goal: ${about.careerGoal || 'N/A'}
Current Role: ${about.currentRole?.role || ''} at ${about.currentRole?.company || ''} (${about.currentRole?.duration || ''})

SKILLS:
${skillsText || 'N/A'}

EXPERIENCE:
${experienceText || 'N/A'}

EDUCATION:
${educationText || 'N/A'}

PROJECTS:
${projectsText || 'N/A'}

CERTIFICATES:
${certificatesText || 'N/A'}

CONTACT:
Email: ${contact.email || 'N/A'}
Location: ${contact.location || 'N/A'}
GitHub: ${socialLinks.github || 'N/A'}
LinkedIn: ${socialLinks.linkedin || 'N/A'}
`.trim();
};

/*
|--------------------------------------------------------------------------
| SEND MESSAGE TO CHATBOT
|--------------------------------------------------------------------------
| POST /api/chatbot
| Body: { message: string, history?: [{ role: 'user'|'model', text: string }] }
| Access: Public
|--------------------------------------------------------------------------
*/

const sendMessage = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          'Chatbot is not configured yet. GROQ_API_KEY missing on the server.',
      });
    }

    const systemContext = await buildPortfolioContext();

    // Convert stored chat history (if any) into OpenAI-style messages
    const historyMessages = Array.isArray(history)
      ? history.slice(-10).map((turn) => ({
          role:
            turn.role === 'bot' || turn.role === 'model'
              ? 'assistant'
              : 'user',
          content: turn.text,
        }))
      : [];

    const messages = [
      { role: 'system', content: systemContext },
      ...historyMessages,
      { role: 'user', content: message },
    ];

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API Error:', data);
      return res.status(502).json({
        success: false,
        message:
          data?.error?.message || 'Chatbot service failed. Please try again.',
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a response right now. Please try again.";

    return res.status(200).json({
      success: true,
      message: 'Reply generated successfully',
      data: { reply },
    });
  } catch (error) {
    console.error('Chatbot Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with the chatbot',
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
};