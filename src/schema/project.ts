import { IMarkup } from "./markup"

export interface IProject {
    project_id: string
    name: string
    version: string
    markups?: IMarkup[]
    reader: any
    extension_schema: IExtensionsSchema | undefined
}

//TODO: Simplify this schema
export interface IExtensionsSchema {
    "?xml": {
        version: string,
        encoding: string,
        standalone: string
    }
    schema: {
        xmlns: string
        redefine: {
            schema_location: string
            simple_type: [
                name: string,
                restriction: {
                    base: string
                    enumeration: [
                        {
                            value: string
                        }
                    ]
                }
            ]
        }
    }
}