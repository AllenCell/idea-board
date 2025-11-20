
export interface DatasetFrontmatter {
    name: string;
    description?: string;
    link?: string;
    status?: string;
    date?: string;
}

export interface DatasetNode {
    frontmatter: DatasetFrontmatter;
}

export interface MaterialsAndMethods {
    dataset?: DatasetNode | null;
}

export interface IdeaFrontmatter {
    date: string;
    title: string;
    description?: string;
    tags?: string[];
    authors?: string[];
    program?: string;
    type?: string;
    concerns?: string;
    introduction?: string;
    materialsAndMethods?: MaterialsAndMethods;
    nextSteps?: string;
}

export interface IdeaPostNode {
    id: string;
    html: string;
    frontmatter: IdeaFrontmatter;
}