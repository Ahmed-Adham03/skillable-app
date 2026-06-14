const curatedVideoSets = [
  {
    keywords: ['web', 'frontend', 'front-end', 'html', 'css', 'javascript', 'react', 'developer'],
    videos: [
      { title: 'freeCodeCamp: HTML & CSS Full Course', url: 'https://www.youtube.com/watch?v=mU6anWqZJcc', provider: 'freeCodeCamp' },
      { title: 'freeCodeCamp: JavaScript Full Course', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', provider: 'freeCodeCamp' },
      { title: 'freeCodeCamp: React Course for Beginners', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', provider: 'freeCodeCamp' },
    ],
  },
  {
    keywords: ['python', 'data analyst', 'analytics', 'data', 'automation', 'ai', 'machine learning'],
    videos: [
      { title: 'freeCodeCamp: Python for Beginners', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', provider: 'freeCodeCamp' },
      { title: 'freeCodeCamp: SQL Full Course', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', provider: 'freeCodeCamp' },
      { title: 'freeCodeCamp: Data Analysis with Python', url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8', provider: 'freeCodeCamp' },
    ],
  },
  {
    keywords: ['excel', 'data entry', 'office', 'word', 'administrative', 'admin', 'virtual assistant'],
    videos: [
      { title: 'Excel Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=Vl0H-qTclOg', provider: 'YouTube' },
      { title: 'Microsoft Word Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=HC13M8FGlNc', provider: 'YouTube' },
      { title: 'Google Forms Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=BtoOHhA3aPQ', provider: 'YouTube' },
    ],
  },
  {
    keywords: ['cybersecurity', 'security', 'network', 'it support', 'helpdesk', 'technical support'],
    videos: [
      { title: 'freeCodeCamp: Computer Networking Course', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw', provider: 'freeCodeCamp' },
      { title: 'freeCodeCamp: Cyber Security Full Course', url: 'https://www.youtube.com/watch?v=U_P23SqJaDc', provider: 'freeCodeCamp' },
      { title: 'freeCodeCamp: Linux Command Line Full Course', url: 'https://www.youtube.com/watch?v=ZtqBQ68cfJc', provider: 'freeCodeCamp' },
    ],
  },
  {
    keywords: ['customer service', 'support', 'call center', 'crm', 'sales'],
    videos: [
      { title: 'Customer Service Training', url: 'https://www.youtube.com/watch?v=GH1TXfQSwUQ', provider: 'YouTube' },
      { title: 'How to Handle Difficult Customers', url: 'https://www.youtube.com/watch?v=kx7f0M1uJmA', provider: 'YouTube' },
      { title: 'CRM Basics for Beginners', url: 'https://www.youtube.com/watch?v=SlhESAKF1Tk', provider: 'YouTube' },
    ],
  },
  {
    keywords: ['social media', 'marketing', 'content', 'canva', 'digital marketing'],
    videos: [
      { title: 'freeCodeCamp: Digital Marketing Full Course', url: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', provider: 'freeCodeCamp' },
      { title: 'Canva Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=un50Bs4BvZ8', provider: 'YouTube' },
      { title: 'Social Media Marketing Tutorial', url: 'https://www.youtube.com/watch?v=I2pwcAVonKI', provider: 'YouTube' },
    ],
  },
];

const defaultVideos = [
  { title: 'Study skills: how to learn anything faster', url: 'https://www.youtube.com/watch?v=IlU-zDU6aQ0', provider: 'YouTube' },
  { title: 'How to prepare for a job interview', url: 'https://www.youtube.com/watch?v=HG68Ymazo18', provider: 'YouTube' },
  { title: 'How to write a resume', url: 'https://www.youtube.com/watch?v=Tt08KmFfIYQ', provider: 'YouTube' },
];

const normalize = (value) => String(value || '').toLowerCase();

const getSearchText = (item = {}) => [
  item.jobtitle,
  item.title,
  item.category,
  item.summary,
  item.details,
  ...(Array.isArray(item.skills) ? item.skills : []),
  ...(Array.isArray(item.tools) ? item.tools : []),
].map(normalize).join(' ');

const uniqueByUrl = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
};

export const getLearningVideos = (item = {}) => {
  const provided = Array.isArray(item.videos)
    ? item.videos.filter((video) => video?.url && !video.url.includes('/results?search_query='))
    : [];
  const searchText = getSearchText(item);
  const matched = curatedVideoSets
    .filter((set) => set.keywords.some((keyword) => searchText.includes(keyword)))
    .flatMap((set) => set.videos);

  return uniqueByUrl([...provided, ...matched, ...defaultVideos]).slice(0, 6);
};

export const getCourseResources = (item = {}) => {
  const title = item.jobtitle || item.title || 'career skills';
  const query = encodeURIComponent(title);
  const searchText = getSearchText(item);
  const resources = [
    {
      label: `Coursera courses for ${title}`,
      provider: 'Coursera',
      url: `https://www.coursera.org/search?query=${query}`,
      note: 'Use this to compare structured courses and certificates.',
    },
    {
      label: `Udemy courses for ${title}`,
      provider: 'Udemy',
      url: `https://www.udemy.com/courses/search/?q=${query}`,
      note: 'Good for practical short courses and project-based lessons.',
    },
  ];

  if (searchText.includes('computer') || searchText.includes('developer') || searchText.includes('data') || searchText.includes('python') || searchText.includes('cyber') || searchText.includes('web')) {
    resources.unshift({
      label: 'freeCodeCamp free learning library',
      provider: 'freeCodeCamp',
      url: 'https://www.freecodecamp.org/learn/',
      note: 'Free, structured practice for programming and computer skills.',
    });
  }

  if (item.learning_resource) {
    resources.unshift({
      label: item.learning_resource,
      provider: 'Suggested',
      url: `https://www.google.com/search?q=${encodeURIComponent(item.learning_resource)}`,
      note: 'Original suggested resource from this path.',
    });
  }

  return resources;
};

export const buildLearningPlan = (job) => ({
  jobtitle: job.jobtitle,
  summary: job.summary || '',
  details: job.details || '',
  roadmap: job.roadmap || [],
  videos: getLearningVideos(job),
  resources: getCourseResources(job),
  sources: job.sources || [],
  progress: (job.roadmap || []).map(() => false),
});
