export interface BaseLink {
    name: string;
    url: string;
    tags: string[];
}

export interface Link extends BaseLink {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BaseProject {
    name: string;
    description?: string;
}

export interface Project extends BaseProject {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
