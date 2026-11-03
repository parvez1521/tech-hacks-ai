import type { GitHubProject, GitHubProjectCategory } from '../types/githubProjects.ts';
import { githubProjectEditorialRecords } from './githubProjectsEditorial.ts';
import { githubRepositorySnapshots } from './githubRepositorySnapshots.ts';

export const githubProjectCategories: Array<{ id: GitHubProjectCategory; name: string; description: string }> = [
  { id: 'ai-video-generation', name: 'AI Video Generation', description: 'Open video-generation workflows, models, and tooling.' },
  { id: 'ai-image-design', name: 'AI Image & Design', description: 'Visual generation interfaces and creative pipelines.' },
  { id: 'ai-coding-agents', name: 'AI Coding Agents', description: 'Agents and assistants that work in codebases and development tools.' },
  { id: 'local-ai-llms', name: 'Local AI & LLMs', description: 'Run and manage models on your own hardware.' },
  { id: 'ai-automation-agents', name: 'AI Automation & Agents', description: 'Workflow orchestration and task automation.' },
  { id: 'speech-voice', name: 'Speech & Voice', description: 'Local transcription, speech recognition, and voice generation.' },
  { id: 'ai-research-rag', name: 'AI Research & RAG', description: 'Frameworks for retrieval, knowledge pipelines, and research.' },
  { id: 'scraping-browser-automation', name: 'Scraping & Browser Automation', description: 'Browser control and web data extraction.' },
  { id: 'developer-utilities', name: 'Developer Utilities', description: 'Focused utilities for developers and AI workflows.' },
  { id: 'self-hosted-apps', name: 'Self-hosted Apps', description: 'Projects that can be run on infrastructure you control.' },
];

export const githubProjectSources = [
  { fullName: 'backblaze-labs/awesome-video-generation', url: 'https://github.com/backblaze-labs/awesome-video-generation', licenseName: 'Creative Commons Zero v1.0 Universal', licenseSpdxId: 'CC0-1.0', updatedAt: '2026-10-29', notes: 'Research list only; includes hosted/commercial services and is not an executable project listing.' },
  { fullName: 'tdi/awesome-private-ai', url: 'https://github.com/tdi/awesome-private-ai', licenseName: 'Creative Commons Zero v1.0 Universal', licenseSpdxId: 'CC0-1.0', updatedAt: '2026-11-02', notes: 'Research list only; use it to discover repositories, then verify each repository independently.' },
  { fullName: 'frechdi/awesome-self-hosted-ai', url: 'https://github.com/frechdi/awesome-self-hosted-ai', licenseName: null, licenseSpdxId: null, updatedAt: '2026-11-02', notes: 'Research list only; GitHub reports no SPDX license. Not listed as an executable project.' },
];

/**
 * Curated decisions live in editorial files; observed GitHub data lives in
 * snapshot files. Runtime joins them by canonical fullName.
 */
const snapshotsByRepository = new Map(githubRepositorySnapshots.map((snapshot) => [snapshot.fullName, snapshot]));
export const githubProjects: GitHubProject[] = githubProjectEditorialRecords.flatMap((editorial) => {
  const snapshot = snapshotsByRepository.get(editorial.fullName);
  return snapshot ? [{ ...editorial, ...snapshot }] : [];
});

export const publicGitHubProjects = githubProjects.filter((project) => project.verificationStatus === 'verified');
export const communityGitHubProjects = githubProjects.filter((project) => project.verificationStatus === 'community-unverified');
export const listedGitHubProjects: GitHubProject[] = [...publicGitHubProjects, ...communityGitHubProjects];
export const getProjectCategoryNames = (project: GitHubProject): string[] => [project.primaryCategory, ...project.secondaryCategories]
  .map((id) => githubProjectCategories.find((category) => category.id === id)?.name)
  .filter((name): name is string => Boolean(name));
