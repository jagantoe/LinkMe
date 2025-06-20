import { Injectable, signal } from '@angular/core';
import { Link, Project } from '../models/link.model';

@Injectable({
    providedIn: 'root'
})
export class LinkStorageService {
    private readonly PROJECTS_KEY = 'linkme_projects';
    private readonly LINKS_KEY_PREFIX = 'linkme_links_'; private readonly projectsSignal = signal<Project[]>([]);
    private readonly currentProjectSignal = signal<Project | null>(null);
    private readonly linksSignal = signal<Link[]>([]);

    readonly projects = this.projectsSignal.asReadonly();
    readonly currentProject = this.currentProjectSignal.asReadonly();
    readonly links = this.linksSignal.asReadonly();

    constructor() {
        this.loadProjects();

        // Load the first project by default if any exist
        if (this.projects().length > 0) {
            this.setCurrentProject(this.projects()[0]);
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
}
