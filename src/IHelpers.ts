import { IMarkup, VisualizationInfo } from "./schema"

export interface IHelpers {
    GetMarkup(xmlString: any): IMarkup,
    GetViewpoint(xmlString: any): VisualizationInfo
    MarkupToXmlNotation(markup: any): any
    XmlToJsonNotation(node: any): any
    RenameJsonKeys(obj: any, options?: any): any
    XmlParserOptions: any
    XmlBuilderOptions: any
}