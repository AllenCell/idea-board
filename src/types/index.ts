
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

export interface ProtocolItem {
    protocol: string;
}

export interface CellLineItem {
    name: string;
    link?: string;
}

export interface SoftwareFrontmatter {
    name: string;
    description?: string;
    link?: string;
    status?: string;
    date?: string;
}

export interface SoftwareNode {
    frontmatter: SoftwareFrontmatter
}

export interface SoftwareTool {
    softwareTool: SoftwareNode;
    customDescription?: string | null;
}

export interface MaterialsAndMethods {
    dataset?: DatasetNode | null;
    protocols?: ProtocolItem[] | null;
    cellLines?: CellLineItem[] | null;
    software?: SoftwareTool[] | null;

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
    nextSteps?: string[];
}

export interface IdeaPostNode {
    id: string;
    html: string;
    frontmatter: IdeaFrontmatter;
}