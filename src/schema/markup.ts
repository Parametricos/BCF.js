import { IProject } from "./project"
import { VisualizationInfo } from "./viewpoint"

export interface IMarkup {
    header?: IHeader
    topic: ITopic | undefined
    project?: IProject
    viewpoints?: VisualizationInfo[]
    getViewpointSnapshot?(viewpoint: VisualizationInfo | IViewPoint): Promise<string | undefined>
}

export interface IHeader {
    files?: IFile[] | undefined
}

export interface IFile {
    ifc_project: string,
    ifc_spatial_structure_element: string,
    is_external: boolean,
    filename?: string,
    date?: string,
    reference?: string
}

export interface ITopic {
    guid: string,
    server_assigned_id?: string,
    topic_type: string,
    topic_status: string,
    reference_links?: string[] | undefined,
    title: string,
    priority?: string,
    index?: number
    labels?: string[] | undefined,
    creation_date: Date,
    creation_author: string,
    modified_date?: Date,
    modified_author?: string,
    due_date?: Date
    assigned_to?: string,
    stage?: string,
    description?: string,
    bim_snippets?: IBimSnippet[] | undefined,
    document_references?: IDocumentReference[] | undefined,
    related_topics?: string[] | undefined,
    comments?: IComment[] | undefined,
    viewpoints?: IViewPoint[] | undefined ,
}

export interface IBimSnippet {
    snippet_type: string,
    is_external: boolean,
    reference: string,
    reference_schema: string
}

export interface IDocumentReference {
    guid: string,
    document_guid: string,
    url:string,
    description?: string
}

export interface IComment {
    guid: string,
    date: Date,
    author: string,
    comment: string,
    viewpoint?: string
    modified_date?: Date,
    modified_author?: string
}

export interface IViewPoint {
    guid: string,
    viewpoint?: string,
    snapshot?: string,
    index?: number
}