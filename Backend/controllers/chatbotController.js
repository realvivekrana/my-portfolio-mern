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
| standard "Authorization: Bearer <key>" header ke saath. Ye endpoint
| streaming (`stream: true`) aur function/tool calling dono support
| karta hai — hum dono use kar rahe hain.
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
| contact) nikal kar ek text context banate hain. Ye context AI
| provider ko system instruction ke saath bhejte hain, taaki bot sirf
| isi person ke baare me accurate jawab de.
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

You have access to two tools:
  - get_resume_link: call this whenever the visitor asks to download, view, see, or get the resume/CV.
  - get_project_link: call this whenever the visitor asks to see, open, visit, or get the link/repo/demo
    for a SPECIFIC named project.

After you call a tool, the actual button/link is rendered separately by the UI — so do NOT print raw
URLs yourself. Just briefly confirm in words what you attached (e.g. "Here's his resume 👇" or
"Here are the links for that project 👇").

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
| TOOL DEFINITIONS (OpenAI-compatible function calling)
|--------------------------------------------------------------------------
|
| Groq ke gpt-oss models OpenAI-style `tools` / `tool_calls` support
| karte hain. Model khud decide karta hai ki kab in functions ko call
| karna hai — hum bas unko execute karte hain aur result wapas bhejte
| hain.
|
|--------------------------------------------------------------------------
*/

const tools = [
  {
    type: 'function',
    function: {
      name: 'get_resume_link',
      description:
        "Get the download link for the portfolio owner's resume/CV. Use this whenever the visitor asks to download, view, see, or get the resume/CV.",
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_project_link',
      description:
        "Get the live demo and/or GitHub repository link for a specific named project. Use this whenever the visitor asks to see, open, visit, or get the link/repo/demo for a project they named.",
      parameters: {
        type: 'object',
        properties: {
          project_name: {
            type: 'string',
            description:
              'The name (or a close guess of the name) of the project the visitor is asking about.',
          },
        },
        required: ['project_name'],
      },
    },
  },
];

/*
|--------------------------------------------------------------------------
| Helper: Run A Tool
|--------------------------------------------------------------------------
|
| Returns:
|   result -> string, fed back to the model so it can phrase a reply
|   action -> object | null, sent to the frontend as an `action` SSE
|             event so the UI can render a real button/link (resume
|             download button, project Live/GitHub buttons, etc.)
|
|--------------------------------------------------------------------------
*/

const runTool = async (name, rawArgs) => {
  let args = {};

  try {
    args = rawArgs ? JSON.parse(rawArgs) : {};
  } catch (error) {
    args = {};
  }

  if (name === 'get_resume_link') {
    const portfolio = await PortfolioContent.findOne({ key: 'main' });

    const visibility = portfolio?.settings?.portfolioVisibility || 'public';
    const hasResume = Boolean(portfolio?.resume?.fileName);

    if (!hasResume || visibility === 'private') {
      return {
        result:
          'No resume is currently available for download. Politely let the visitor know and point them to the Contact section instead.',
        action: null,
      };
    }

    return {
      result:
        'Resume link is ready. Tell the visitor you have attached a download button below — do not include a raw URL.',
      action: {
        type: 'resume',
        // Relative to the frontend's API base URL. This route redirects
        // straight to a signed Cloudinary URL — see
        // portfolioUploadController.js -> getPublicResume.
        path: '/portfolio/upload/public-resume',
        label: portfolio?.resume?.originalName || 'Download Resume',
      },
    };
  }

  if (name === 'get_project_link') {
    const projectName = (args?.project_name || '').trim();

    if (!projectName) {
      return {
        result:
          'No project name was given, so no link could be found. Ask the visitor which project they mean.',
        action: null,
      };
    }

    // Escape regex special characters so a stray "(", ")", "+" etc. in
    // the visitor's phrasing never breaks the MongoDB query.
    const safePattern = projectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const project = await Project.findOne({
      title: { $regex: safePattern, $options: 'i' },
    });

    if (!project) {
      return {
        result: `No project matching "${projectName}" was found. Ask the visitor to check the Projects section for the exact name, or list a couple of close project names if you know any.`,
        action: null,
      };
    }

    if (!project.liveLink && !project.githubLink) {
      return {
        result: `Found "${project.title}", but it has no public live/GitHub link on record. Let the visitor know.`,
        action: null,
      };
    }

    return {
      result: `Found project "${project.title}". Tell the visitor you have attached its links below — do not include raw URLs.`,
      action: {
        type: 'project',
        title: project.title,
        liveLink: project.liveLink || null,
        githubLink: project.githubLink || null,
      },
    };
  }

  return { result: 'Unknown tool requested.', action: null };
};

/*
|--------------------------------------------------------------------------
| Helper: Server-Sent Event Writer
|--------------------------------------------------------------------------
*/

const makeSender = (res) => (event, data) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

/*
|--------------------------------------------------------------------------
| SEND MESSAGE TO CHATBOT (STREAMING)
|--------------------------------------------------------------------------
| POST /api/chatbot
| Body: { message: string, history?: [{ role: 'user'|'model', text: string }] }
| Access: Public (rate-limited, see chatbotRoutes.js)
|
| Response is a Server-Sent Events (SSE) stream:
|   event: chunk   -> { token: string }   partial reply text, in order
|   event: action  -> { type, ... }       resume/project link to render
|   event: error   -> { message: string } something went wrong
|   event: done    -> {}                  stream finished
|
| Two-pass design:
|   PASS 1 (non-streaming) — sent WITH `tools` so we can see whether the
|     model wants to call a function (resume link / project link).
|   PASS 2 (streaming)     — the actual, visible reply. If a tool was
|     called in pass 1, its result is included as context so the model
|     can naturally reference it while pass 2 streams token-by-token.
|--------------------------------------------------------------------------
*/

const sendMessage = async (req, res) => {
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

  // ------------------------------------------------------
  // From this point on we commit to an SSE stream, so any
  // further failure is reported via an `error` event instead
  // of a normal JSON response.
  // ------------------------------------------------------

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // disable nginx buffering, if present
  });

  // Some proxies hold back the response until a minimum number of
  // bytes arrive — this comment padding + an immediate flush nudges
  // the stream open right away instead of waiting for the first token.
  res.write(': connected\n\n');

  const sendEvent = makeSender(res);

  req.on('close', () => {
    // Visitor navigated away / closed the tab mid-stream — nothing
    // else to clean up since we don't hold any long-lived resources,
    // but this avoids writing to a dead socket.
  });

  try {
    const systemContext = await buildPortfolioContext();

    const historyMessages = Array.isArray(history)
      ? history.slice(-10).map((turn) => ({
          role:
            turn.role === 'bot' || turn.role === 'model'
              ? 'assistant'
              : 'user',
          content: turn.text,
        }))
      : [];

    const baseMessages = [
      { role: 'system', content: systemContext },
      ...historyMessages,
      { role: 'user', content: message },
    ];

    // ----------------------------------------------------
    // PASS 1 — non-streaming, tool-enabled
    // ----------------------------------------------------

    const firstResponse = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: baseMessages,
        tools,
        tool_choice: 'auto',
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    const firstData = await firstResponse.json();

    if (!firstResponse.ok) {
      console.error('Groq API Error:', firstData);
      sendEvent('error', {
        message:
          firstData?.error?.message ||
          'Chatbot service failed. Please try again.',
      });
      return res.end();
    }

    const firstChoiceMessage = firstData?.choices?.[0]?.message;
    const toolCalls = firstChoiceMessage?.tool_calls;

    let finalMessages = baseMessages;

    if (Array.isArray(toolCalls) && toolCalls.length > 0) {
      // Keep the assistant's tool-call turn in the transcript, then
      // append one `tool` message per call with its result.
      finalMessages = [...baseMessages, firstChoiceMessage];

      let sentAction = false;

      for (const call of toolCalls) {
        const { result, action } = await runTool(
          call?.function?.name,
          call?.function?.arguments
        );

        // Only the first action gets rendered in the UI — in practice
        // a single turn asks for at most one thing (resume OR a
        // project), so this keeps the widget simple.
        if (action && !sentAction) {
          sendEvent('action', action);
          sentAction = true;
        }

        finalMessages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: result,
        });
      }
    }

    // ----------------------------------------------------
    // PASS 2 — streaming, visible reply
    // ----------------------------------------------------

    const streamResponse = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: finalMessages,
        temperature: 0.6,
        max_tokens: 400,
        stream: true,
      }),
    });

    if (!streamResponse.ok || !streamResponse.body) {
      const errorData = await streamResponse.json().catch(() => ({}));
      console.error('Groq Stream Error:', errorData);
      sendEvent('error', {
        message:
          errorData?.error?.message ||
          'Chatbot service failed while streaming. Please try again.',
      });
      return res.end();
    }

    const reader = streamResponse.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let buffer = '';
    let fullReply = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Groq streams standard OpenAI-style SSE lines: `data: {...}\n\n`
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? ''; // keep the last (possibly partial) line

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine.startsWith('data:')) continue;

        const payload = trimmedLine.replace(/^data:\s*/, '');

        if (payload === '[DONE]') continue;

        try {
          const parsed = JSON.parse(payload);
          const token = parsed?.choices?.[0]?.delta?.content;

          if (token) {
            fullReply += token;
            sendEvent('chunk', { token });
          }
        } catch (error) {
          // Ignore partial/malformed JSON fragments split across chunks
        }
      }
    }

    if (!fullReply.trim()) {
      sendEvent('chunk', {
        token:
          "Sorry, I couldn't generate a response right now. Please try again.",
      });
    }

    sendEvent('done', {});
    return res.end();
  } catch (error) {
    console.error('Chatbot Error:', error);

    try {
      sendEvent('error', {
        message: 'Something went wrong with the chatbot. Please try again.',
      });
      res.end();
    } catch (writeError) {
      // Socket already closed — nothing more we can do.
    }
  }
};

module.exports = {
  sendMessage,
};