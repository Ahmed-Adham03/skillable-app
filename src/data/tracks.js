import { Monitor, Server, Layers } from 'lucide-react';

export const TRACKS = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    tagline: 'Build beautiful, accessible user interfaces for the web.',
    Icon: Monitor,
    color: 'from-[#0f0c29] via-[#302b63] to-[#5b21b6]',
    difficulty: 'Beginner → Intermediate',
    duration: '5–6 months',
    techStack: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Git', 'Tailwind CSS', 'Figma basics'],
    description:
      'Frontend developers craft everything the user sees and interacts with. You will go from writing your first HTML tag all the way to building full-featured React applications with animations, accessibility, and real API integrations.',
    phases: [
      {
        title: 'Phase 1 — Web Foundations',
        weeks: 'Weeks 1–3',
        topics: [
          'How the browser works (DOM, rendering)',
          'HTML5 semantics & accessibility markup',
          'CSS layouts: Flexbox & Grid',
          'Responsive design & media queries',
        ],
      },
      {
        title: 'Phase 2 — JavaScript Core',
        weeks: 'Weeks 4–7',
        topics: [
          'Variables, functions, scope, closures',
          'Arrays, objects, destructuring',
          'Async JS: Promises, async/await, fetch',
          'DOM manipulation & events',
        ],
      },
      {
        title: 'Phase 3 — React Fundamentals',
        weeks: 'Weeks 8–12',
        topics: [
          'Components, props, and state',
          'useEffect, useRef, custom hooks',
          'React Router & client-side navigation',
          'Forms & controlled inputs',
        ],
      },
      {
        title: 'Phase 4 — Professional Skills',
        weeks: 'Weeks 13–18',
        topics: [
          'TypeScript basics with React',
          'Tailwind CSS utility-first styling',
          'Testing with Jest & React Testing Library',
          'Git workflow, code review, CI basics',
        ],
      },
      {
        title: 'Phase 5 — Capstone Project',
        weeks: 'Weeks 19–22',
        topics: [
          'Build a portfolio-ready app with real API',
          'Lighthouse score ≥ 90 (Performance + A11y)',
          'Deploy on Vercel / Netlify',
          'Document with README & component guide',
        ],
      },
    ],
    requirements: [
      'Basic computer literacy',
      'A text editor (VS Code recommended)',
      'Patience for debugging',
      'No prior coding experience required',
    ],
    resources: [
      { label: 'MDN Web Docs', url: '#' },
      { label: 'JavaScript.info', url: '#' },
      { label: 'React Official Docs', url: '#' },
      { label: 'Frontend Mentor (practice)', url: '#' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    tagline: 'Build robust servers, APIs, and databases that power applications.',
    Icon: Server,
    color: 'from-[#042f2e] via-[#134e4a] to-[#0f766e]',
    difficulty: 'Intermediate',
    duration: '5–6 months',
    techStack: ['Python', 'FastAPI / Django', 'SQL', 'PostgreSQL', 'REST APIs', 'Docker', 'Git', 'Redis'],
    description:
      'Backend developers build the engine beneath the hood — servers that handle requests, databases that store data, and APIs that connect everything together. You will learn to design scalable, secure, and well-tested systems.',
    phases: [
      {
        title: 'Phase 1 — Python Core',
        weeks: 'Weeks 1–3',
        topics: [
          'Variables, data types, control flow',
          'Functions, classes, modules',
          'File I/O, error handling',
          'Virtual environments & pip',
        ],
      },
      {
        title: 'Phase 2 — Databases',
        weeks: 'Weeks 4–7',
        topics: [
          'Relational databases & SQL (SELECT, JOIN, GROUP BY)',
          'PostgreSQL setup & administration basics',
          'ORM with SQLAlchemy',
          'Database design & normalization',
        ],
      },
      {
        title: 'Phase 3 — APIs & Servers',
        weeks: 'Weeks 8–12',
        topics: [
          'HTTP protocol, REST principles',
          'FastAPI: routes, request/response models',
          'Authentication: JWT & OAuth2',
          'Input validation & error handling',
        ],
      },
      {
        title: 'Phase 4 — DevOps Basics',
        weeks: 'Weeks 13–18',
        topics: [
          'Docker containers & docker-compose',
          'Environment variables & secrets management',
          'Basic CI/CD with GitHub Actions',
          'Logging, monitoring & health checks',
        ],
      },
      {
        title: 'Phase 5 — Capstone Project',
        weeks: 'Weeks 19–22',
        topics: [
          'Build a fully documented REST API',
          'Add authentication, rate limiting, tests',
          'Deploy to Railway / Render / VPS',
          'Write OpenAPI (Swagger) docs',
        ],
      },
    ],
    requirements: [
      'Basic programming knowledge (any language)',
      'Comfort with the terminal / command line',
      'Understanding of how websites work at a high level',
    ],
    resources: [
      { label: 'Python Official Docs', url: '#' },
      { label: 'FastAPI Docs', url: '#' },
      { label: 'PostgreSQL Tutorial', url: '#' },
      { label: 'Docker Getting Started', url: '#' },
    ],
  },
  {
    id: 'fullstack',
    title: 'Full Stack Development',
    tagline: 'Master both the client and the server — build complete products end-to-end.',
    Icon: Layers,
    color: 'from-[#1c0a00] via-[#7c2d12] to-[#c2410c]',
    difficulty: 'Intermediate → Advanced',
    duration: '10–12 months',
    techStack: ['HTML/CSS', 'JavaScript', 'React', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Git', 'TypeScript'],
    description:
      'Full stack developers own the entire application — from pixel-perfect UI to scalable server infrastructure. This track combines the Frontend and Backend paths with a strong focus on how both sides integrate and communicate.',
    phases: [
      {
        title: 'Phase 1 — Frontend Foundations',
        weeks: 'Weeks 1–6',
        topics: [
          'HTML5, CSS3, responsive design',
          'JavaScript ES6+ core concepts',
          'React components, hooks, routing',
          'Tailwind CSS & accessible UI patterns',
        ],
      },
      {
        title: 'Phase 2 — Backend Foundations',
        weeks: 'Weeks 7–13',
        topics: [
          'Python & FastAPI server basics',
          'PostgreSQL & SQLAlchemy ORM',
          'REST API design & JWT auth',
          'File uploads, email, background tasks',
        ],
      },
      {
        title: 'Phase 3 — Full Stack Integration',
        weeks: 'Weeks 14–19',
        topics: [
          'Connecting React frontend to FastAPI backend',
          'CORS, cookies, auth flow end-to-end',
          'Environment config for dev & prod',
          'Error handling on both sides',
        ],
      },
      {
        title: 'Phase 4 — Advanced Topics',
        weeks: 'Weeks 20–26',
        topics: [
          'Real-time features: WebSockets / SSE',
          'Caching with Redis',
          'Testing: unit, integration, e2e (Playwright)',
          'Performance optimisation & Core Web Vitals',
        ],
      },
      {
        title: 'Phase 5 — Capstone Product',
        weeks: 'Weeks 27–34',
        topics: [
          'Design & build a complete SaaS product',
          'Docker Compose for local dev stack',
          'CI/CD pipeline & cloud deployment',
          'Demo, portfolio write-up, live URL',
        ],
      },
    ],
    requirements: [
      'Dedication to the full 10–12 month timeline',
      'Basic computer literacy',
      'Willingness to learn multiple languages/tools',
      'No prior coding experience required (but helpful)',
    ],
    resources: [
      { label: 'The Odin Project', url: '#' },
      { label: 'Full Stack Open (Helsinki)', url: '#' },
      { label: 'React Docs', url: '#' },
      { label: 'FastAPI Docs', url: '#' },
    ],
  },
];
