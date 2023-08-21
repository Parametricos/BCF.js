import { IMarkup, VisualizationInfo } from "./schema"

export interface IHelpers {
    GetMarkup(xmlString: any): IMarkup,
    GetViewpoint(xmlString: any): VisualizationInfo
}