import { Injectable, signal } from '@angular/core';
import { Link, Project } from '../models/link.model';

@Injectable({
    providedIn: 'root'
})
export class LinkStorageService {
    private readonly PROJECTS_KEY = 'linkme_projects';
    private readonly LINKS_KEY_PREFIX = 'linkme_links_';
    private readonly CURRENT_PROJECT_ID_KEY = 'linkme_current_project_id';
    private readonly SEARCH_HISTORY_KEY = 'linkme_search_history';

    private readonly projectsSignal = signal<Project[]>([]);
    private readonly currentProjectSignal = signal<Project | null>(null);
    private readonly linksSignal = signal<Link[]>([]);
    private readonly searchHistorySignal = signal<string[]>([]);

    readonly projects = this.projectsSignal.asReadonly();
    readonly currentProject = this.currentProjectSignal.asReadonly();
    readonly links = this.linksSignal.asReadonly();
    readonly searchHistory = this.searchHistorySignal.asReadonly();

    constructor() {
        this.loadProjects();
        this.loadSearchHistory();

        // Restore current project from storage if possible
        const savedProjectId = localStorage.getItem(this.CURRENT_PROJECT_ID_KEY);
        const projects = this.projects();
        if (savedProjectId && projects.length > 0) {
            const found = projects.find(p => p.id === savedProjectId);
            if (found) {
                this.setCurrentProject(found);
            } else {
                this.setCurrentProject(projects[0]);
            }
        } else if (projects.length > 0) {
            this.setCurrentProject(projects[0]);
        }
    }

    // Project methods
    private loadProjects(): void {
        const projectsJson = localStorage.getItem(this.PROJECTS_KEY);
        if (projectsJson) {
            try {
                const projects: Project[] = JSON.parse(projectsJson);
                this.projectsSignal.set(projects);
            } catch (e) {
                console.error('Failed to parse projects from localStorage', e);
                this.projectsSignal.set([]);
            }
        }
    }

    private saveProjects(): void {
        localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(this.projects()));
    }

    addProject(name: string, description?: string): Project {
        const newProject: Project = {
            id: crypto.randomUUID(),
            name,
            description,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.projectsSignal.update(projects => [...projects, newProject]);
        this.saveProjects();

        if (!this.currentProject()) {
            this.setCurrentProject(newProject);
        }

        return newProject;
    }

    updateProject(updatedProject: Project): void {
        this.projectsSignal.update(projects =>
            projects.map(p => p.id === updatedProject.id
                ? { ...updatedProject, updatedAt: new Date() }
                : p
            )
        );
        this.saveProjects();

        // If current project was updated, refresh it
        if (this.currentProject()?.id === updatedProject.id) {
            this.currentProjectSignal.set({ ...updatedProject });
        }
    }

    deleteProject(projectId: string): void {
        this.projectsSignal.update(projects =>
            projects.filter(p => p.id !== projectId)
        );
        this.saveProjects();

        // Remove links for this project
        localStorage.removeItem(this.LINKS_KEY_PREFIX + projectId);

        // If current project was deleted, select another one or set to null
        if (this.currentProject()?.id === projectId) {
            const remainingProjects = this.projects();
            if (remainingProjects.length > 0) {
                this.setCurrentProject(remainingProjects[0]);
            } else {
                this.currentProjectSignal.set(null);
                this.linksSignal.set([]);
            }
        }
    }

    setCurrentProject(project: Project): void {
        this.currentProjectSignal.set(project);
        localStorage.setItem(this.CURRENT_PROJECT_ID_KEY, project.id);
        this.loadLinksForProject(project.id);
    }

    // Link methods
    private loadLinksForProject(projectId: string): void {
        const linksKey = this.LINKS_KEY_PREFIX + projectId;
        const linksJson = localStorage.getItem(linksKey);

        if (linksJson) {
            try {
                const links: Link[] = JSON.parse(linksJson);
                this.linksSignal.set(links);
            } catch (e) {
                console.error(`Failed to parse links for project ${projectId}`, e);
                this.linksSignal.set([]);
            }
        } else {
            this.linksSignal.set([]);
        }
    }

    private saveLinksForCurrentProject(): void {
        const currentProject = this.currentProject();
        if (!currentProject) return;

        const linksKey = this.LINKS_KEY_PREFIX + currentProject.id;
        localStorage.setItem(linksKey, JSON.stringify(this.links()));
    }

    addLink(name: string, url: string, tags: string[] = []): Link | null {
        const currentProject = this.currentProject();
        if (!currentProject) return null;

        const newLink: Link = {
            id: crypto.randomUUID(),
            name,
            url,
            tags,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.linksSignal.update(links => [...links, newLink]);
        this.saveLinksForCurrentProject();

        return newLink;
    }

    updateLink(updatedLink: Link): void {
        this.linksSignal.update(links =>
            links.map(link => link.id === updatedLink.id
                ? { ...updatedLink, updatedAt: new Date() }
                : link
            )
        );
        this.saveLinksForCurrentProject();
    }

    deleteLink(linkId: string): void {
        this.linksSignal.update(links =>
            links.filter(link => link.id !== linkId)
        );
        this.saveLinksForCurrentProject();
    }

    // Search history methods
    private loadSearchHistory(): void {
        const historyJson = localStorage.getItem(this.SEARCH_HISTORY_KEY);
        if (historyJson) {
            try {
                const history: string[] = JSON.parse(historyJson);
                this.searchHistorySignal.set(history);
            } catch (e) {
                console.error('Failed to parse search history from localStorage', e);
                this.searchHistorySignal.set([]);
            }
        }
    }

    private saveSearchHistory(): void {
        localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(this.searchHistory()));
    }

    /**
     * Adds a search term to history
     * Only adds non-empty terms, keeps last 5 unique terms
     * @param term The search term to add to history
     */
    addSearchToHistory(term: string): void {
        const trimmedTerm = term.trim();
        if (!trimmedTerm) return;

        // Get current history and remove the term if it exists (to avoid duplicates)
        const currentHistory = this.searchHistorySignal();
        const newHistory = currentHistory.filter(item => item !== trimmedTerm);

        // Add the term to the beginning and limit to 5 items
        newHistory.unshift(trimmedTerm);
        if (newHistory.length > 5) {
            newHistory.pop();
        }

        this.searchHistorySignal.set(newHistory);
        this.saveSearchHistory();
    }
}
