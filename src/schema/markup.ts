export interface IMarkup {
    header?: IHeader
    topic: ITopic,
    comments?: IComment[],
    viewpoints?: MarkupViewpoint[]
}

export interface IHeader {
   file: IHeaderFile[]
}

export interface IHeaderFile {
    ifc_project: string,
    ifc_spatial_structure_element: string,
    is_external: boolean,
    filename?: string,
    date?: string,
    reference?: string
}

export interface ITopic {
    guid: string,
    topic_type: string,
    topic_status: string,
    reference_link?: string[],
    title: string,
    priority?: string,
    index?: number
    labels?: string[],
    creation_date: Date,
    creation_author: string,
    modified_date?: Date,
    modified_author?: string,
    due_date?: Date
    assigned_to?: string,
    stage?: string,
    description?: string,
    bim_snippets?: TopicBimSnippet[],
    document_references?: TopicDocumentReference[],
    related_topics?: string[]
}

export interface TopicBimSnippet {
    snippet_type: string,
    is_external: boolean,
    reference: string,
    reference_schema: string
}

export interface TopicDocumentReference {
    guid: string,
    is_external: boolean,
    referenced_document?: string,
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

export interface MarkupViewpoint {
    guid: string,
    viewpoint?: string,
    snapshot?: string,
    index?: number
}