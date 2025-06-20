export interface Link {
    id: string;
    name: string;
    url: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
