import { siGithub, siGmail, siGooglecalendar, siJira, siMarkdown, siNotion } from 'simple-icons';

/** The tools Prodmate sends a plan to, with their marks from Simple Icons (CC0). */
export const BRANDS = {
  github: { name: 'GitHub', path: siGithub.path, color: '#181717' },
  notion: { name: 'Notion', path: siNotion.path, color: '#000000' },
  jira: { name: 'Jira', path: siJira.path, color: `#${siJira.hex}` },
  gmail: { name: 'Gmail', path: siGmail.path, color: `#${siGmail.hex}` },
  calendar: { name: 'Google Calendar', path: siGooglecalendar.path, color: `#${siGooglecalendar.hex}` },
  markdown: { name: 'Markdown', path: siMarkdown.path, color: '#000000' },
};

export type Brand = keyof typeof BRANDS;
