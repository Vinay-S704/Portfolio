// =============================================================================
// PORTFOLIO CONTENT — EDIT EVERYTHING HERE
// -----------------------------------------------------------------------------
// This is the single source of truth for all portfolio content.
// Open this file in VS Code (or any editor) and change the values below.
// The UI updates automatically — no other files need to be touched.
// =============================================================================

import profileImage from './assets/profile.jpeg';

// ---- IDENTITY ---------------------------------------------------------------
export const profile = {
  name: 'Vinay Singh',
  handle: 'vinay',
  hostname: 'portfolio',
  role: 'B.Tech 3rd Year Student | ITM University Raipur',
  location: 'Raipur, Chhattisgarh',
  email: 'vs7160188@gmail.com',
  phone: '+91 9399157970',
  github: 'github.com/Vinay-S704',
  linkedin: 'www.linkedin.com/in/vinay-singh-1b6b93321?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  // Profile photo URL. Replace with your own (square crop works best).
  avatar: profileImage,
  // One-paragraph professional summary.
  summary:
    'Dedicated and analytical B.Tech student with a strong foundation in Cloud and Information Security, Python development, and web development. Experienced in building practical solutions around secure application development, backend automation, API monitoring, and networking fundamentals. Interested in applying technical skills in cloud security, system protection, and full-stack development to build reliable and secure digital solutions.',
  uptime: '3 years, 2 months',
  kernel: '6.9.12-portfolio',
};

// ---- SOCIAL LINKS -----------------------------------------------------------
export const socialLinks = [
  { label: 'GitHub', handle: 'github.com/Vinay-S704', url: 'https://github.com/Vinay-S704' },
  { label: 'LinkedIn', handle: 'linkedin.com/in/vinay-singh-1b6b93321', url: 'https://www.linkedin.com/in/vinay-singh-1b6b93321?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
  { label: 'Email', handle: 'vs7160188@gmail.com', url: 'mailto:vs7160188@gmail.com' },
  { label: 'Phone', handle: '+91 9399157970', url: 'tel:+919399157970' },
];

// ---- TECHNOLOGIES / SKILLS --------------------------------------------------
// Each category becomes a labeled group in the Skills window.
export const technologies = [
  { category: 'Languages', items: ['Python', 'JavaScript', 'C', 'SQL', 'Shell Script'] },
  { category: 'MERN Stack', items: ['MongoDB', 'Express.js', 'React', 'Node.js'] },
  { category: 'Backend', items: ['FastAPI', 'Flask', 'REST APIs', 'JWT'] },
  { category: 'Virtualization / DevOps', items: ['Docker', 'KVM', 'VirtualBox'] },
  { category: 'Operating Systems', items: ['Windows', 'Linux'] },
  { category: 'Networking', items: ['TCP/IP', 'OSI Model', 'Networking Basics'] },
  { category: 'Data / Parsing', items: ['Pandas', 'SpaCy', 'Regex', 'JSON'] },
  { category: 'Tools', items: ['Git', 'Linux', 'VS Code', 'Postman'] },
];

// ---- PROJECTS ---------------------------------------------------------------
export type Project = {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  link?: string;
  year: string;
};

export const projects: Project[] = [
  {
    name: 'API Performance Monitor',
    tagline: 'Real-time API reliability and latency dashboard',
    description:
      'Built a Python-based monitoring tool to track API response time, uptime, error rates, and performance trends using FastAPI and logging pipelines.',
    stack: ['Python', 'FastAPI', 'MongoDB', 'Plotly'],
    link: 'https://github.com/Vinay-S704/API-Performance-Monitor',
    year: '2025',
  },
  {
    name: 'Automated Resume Parser',
    tagline: 'Structured resume extraction and screening automation',
    description:
      'Developed a parser that extracts education, skills, experience, and contact details from resumes and organizes them into structured data for quick screening.',
    stack: ['Python', 'Pandas', 'SpaCy', 'Flask'],
    link: 'https://github.com/Vinay-S704/Automated-resume-Parser',
    year: '2025',
  },
];

// ---- EXPERIENCE -------------------------------------------------------------
export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  points: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: 'CodeC Technologies',
    role: 'Python Developer (Remote Internship)',
    period: '2025',
    points: [
      'Completed an AICTE-certified remote internship as a Python Developer.',
      'Built API Performance Monitor to track request latency, uptime, and error trends.',
      'Developed Automated Resume Parser to extract candidate details from resumes into structured data.',
    ],
  },
];

// ---- EDUCATION & CERTIFICATIONS --------------------------------------------
export type EducationItem = {
  institution: string;
  degree: string;
  period: string;
  detail: string;
};

export const education: EducationItem[] = [
  {
    institution: 'CodeC Technologies',
    degree: 'AICTE-Certified Remote Internship',
    period: '2025',
    detail: 'Completed a remote internship as a Python Developer focused on backend development, API monitoring, and resume parsing.',
  },
  {
    institution: 'ITM University Raipur',
    degree: 'B.Tech in Computer Science & Engineering',
    period: '2024 — Present',
    detail: 'Pursuing B.Tech 3rd year with specialization in Cloud and Information Security.',
  },
  {
    institution: 'Carmel Convent Higher Secondary School, Bishrampur',
    degree: 'Higher Secondary Education',
    period: '2023',
    detail: 'Completed 12th with 67%.',
  },
  {
    institution: 'Carmel Convent Higher Secondary School, Bishrampur',
    degree: 'Secondary Education',
    period: '2021',
    detail: 'Completed 10th with 95%.',
  },
];

// ---- ACHIEVEMENTS -----------------------------------------------------------
export type Achievement = {
  title: string;
  detail: string;
  year: string;
};

export const achievements: Achievement[] = [
  { title: 'AICTE-Certified Internship', detail: 'Completed a remote internship as a Python Developer at CodeC Technologies.', year: '2025' },
  { title: 'Project-Based Learning', detail: 'Built two practical Python projects focused on API monitoring and resume parsing.', year: '2025' },
];

// ---- BOOT LOG LINES --------------------------------------------------------
// Each line is shown during the boot sequence. `delay` is ms before it appears.
export const bootLines: { text: string; delay: number; kind?: 'ok' | 'warn' | 'info' }[] = [
  { text: '[    0.000000] Linux version 6.9.12-portfolio (vinay@portfolio) (gcc 13.2.0) #1 SMP PREEMPT', delay: 80 },
  { text: '[    0.004321] Command line: BOOT_IMAGE=/vmlinuz root=/dev/portfolio ro quiet loglevel=3', delay: 60 },
  { text: '[    0.012104] x86/fpu: Supporting XSAVE feature 0x001: x87 FPU', delay: 50 },
  { text: '[    0.018220] CPU0: GenuineIntel 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz', delay: 70 },
  { text: '[    0.024533] Memory: 32768000K/33554432K available (12288K kernel code, 2048K rwdata)', delay: 60 },
  { text: '[    0.031004] DMI: Vinay Singh Portfolio Edition / Portfolio Board, BIOS 4.2.0 07/18/2026', delay: 70 },
  { text: '[    0.042118] ACPI: PM-Timer IO Port: 0x408', delay: 50 },
  { text: '[    0.058221] random: crng init done', delay: 60 },
  { text: '[    0.071332] systemd[1]: System Initialization', delay: 80 },
  { text: '[    0.082114]   Starting Mount Portfolio Filesystem...', delay: 60, kind: 'info' },
  { text: '[    0.094221]   Starting Load Projects Index...', delay: 60, kind: 'info' },
  { text: '[    0.108442]   Starting Initialize Experience...', delay: 60, kind: 'info' },
  { text: '[    0.121553]   Starting Network Service...', delay: 60, kind: 'info' },
  { text: '[    0.135664]   Reached target Multi-User System', delay: 80, kind: 'ok' },
  { text: '[    0.165332]   Reached target Graphical Interface', delay: 80, kind: 'ok' },
  { text: '[    0.182443]   Started Portfolio Display Manager', delay: 90, kind: 'ok' },
  { text: '[    0.201554] portfolio login: ', delay: 120 },
];
