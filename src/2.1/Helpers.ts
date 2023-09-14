import { IComment, IFile, IMarkup, IViewPoint } from "../schema"
import { XMLParser } from "fast-xml-parser"
import * as SharedHelpers from '../SharedHelpers'

export namespace Helpers {

    export const XmlParserOptions = SharedHelpers.XmlParserOptions
    export const XmlBuilderOptions = SharedHelpers.XmlBuilderOptions
    export const GetViewpoint = SharedHelpers.GetViewpoint
    export const XmlToJsonNotation = SharedHelpers.XmlToJsonNotation
    const ChangeToUppercase = SharedHelpers.ChangeToUppercase

    export function GetMarkup(xmlString: any): IMarkup {
        const { Markup } = new XMLParser(XmlParserOptions).parse(xmlString)

        return {
            header: {
                files: getHeaderFiles(Markup.Header)
            },
            topic: {
                guid: Markup.Topic['@_Guid'],
                topic_type: Markup.Topic["@_TopicType"],
                topic_status: Markup.Topic["@_TopicStatus"],
                reference_links: Markup.Topic["ReferenceLink"] && Helpers.ObjectToArray(Markup.Topic["ReferenceLink"]),
                title: Markup.Topic["Title"],
                priority: Markup.Topic["Priority"],
                index: Markup.Topic["Index"],
                labels: Markup.Topic["Labels"] && Helpers.ObjectToArray(Markup.Topic["Labels"]),
                creation_date: Markup.Topic["CreationDate"],
                creation_author: Markup.Topic["CreationAuthor"],
                modified_date: Markup.Topic["ModifiedDate"],
                modified_author: Markup.Topic["ModifiedAuthor"],
                assigned_to: Markup.Topic["AssignedTo"],
                description: Markup.Topic["Description"],
                // bim_snippets: Markup.ITopic["BimSnippet"] ? ,
                // related_topics: Markup.ITopic["ReferenceLink"],
                comments: Helpers.GetComments(Markup.Comment),
                viewpoints: Helpers.GetViewpoints(Markup.Viewpoints)
            },
        }
    }

    export function GetViewpoints(data: any) {
        if (!data) return

        const constructViewpoint = (data: any): IViewPoint => {
            return {
                guid: data["@_Guid"],
                viewpoint: data["Viewpoint"],
                snapshot: data["Snapshot"]
            }
        }

        const viewpoints: IViewPoint[] = []

        if (Array.isArray(data)) {
            data.forEach((x) => {
                viewpoints.push(constructViewpoint(x))
            })
        } else {
            viewpoints.push(constructViewpoint(data))
        }

        return viewpoints
    }

    export function GetComments(data: any) {
        if (!data) return

        const constructComment = (data: any): IComment => {
            return {
                guid: data["@_Guid"],
                date: data["Date"],
                author: data["Author"],
                comment: data["Comment"],
                viewpoint: data?.Viewpoint?.["@_Guid"],
                modified_date: data["ModifiedDate"],
                modified_author: data["ModifiedAuthor"]
            }
        }

        const viewpoints: IComment[] = []

        if (Array.isArray(data)) {
            data.forEach((x) => {
                viewpoints.push(constructComment(x))
            })
        } else {
            viewpoints.push(constructComment(data))
        }

        return viewpoints
    }

    /**
     * Returns an object as an array
     * Can also accept array and returns new array if type is unknown
     *
     * @return data as an array
     * @param data
     */
    export function ObjectToArray(data: any) {
        return Array.isArray(data) ? data : [data]
    }

    export function ParsePoint(point: any) {
        return {
            x: point.X,
            y: point.Y,
            z: point.Z
        }
    }

    const version21PluralWordsToSingular = [
        "DocumentReferences",
        "RelatedTopics"
    ]

    export function MarkupToXmlNotation(markup: any): any {
        const convertedMarkup = convert21To30(markup)

        let purgedMarkup = {
            "Markup": {
                "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                "header": convertedMarkup.header,
                "topic": convertedMarkup.topic,
                "comment": convertedMarkup.comment,
                "viewpoints": convertedMarkup.viewpoints
            }
        }

        return RenameJsonKeys(purgedMarkup)
    }

    export function RenameJsonKeys(obj: any, options?: any) {
        let outputObj: any = {}

        if (typeof obj === 'string')
            return obj

        const opt_plural_to_singular = options?.plural_to_singular !== undefined ? options.plural_to_singular : true

        for (const key in obj) {

            let value = obj[key]

            if (!value)
                continue

            if (key.startsWith('@_')) {
                outputObj[key] = value
                continue
            }

            let newKey = ChangeToUppercase(key, options)

            if (Array.isArray(value)) {
                const newArrNode: any[] = []
                for (const child of value)
                    newArrNode.push(RenameJsonKeys(child, options))

                const pluralWord = version21PluralWordsToSingular.find(word => word.startsWith(newKey))
                if (pluralWord && opt_plural_to_singular)
                    newKey = pluralWord.slice(0, -1)

                outputObj[newKey] = newArrNode
                continue
            }

            if (typeof value === 'object')
                value = RenameJsonKeys(value, options)

            outputObj[newKey] = value
        }

        return outputObj
    }

    function getHeaderFiles(header: any): IFile[] | undefined {
        if (header)
            return Helpers.ObjectToArray(header).map((file: any) => XmlToJsonNotation(file))
    }

    function convert21To30(markup: IMarkup): any {

        if (!markup.topic)
            return

        const { comments, viewpoints, ...topic } = markup.topic

        const newMarkup = {
            header: { file: markup.header?.files },
            topic: topic,
            comment: comments,
            viewpoints: viewpoints
        }

        return newMarkup
    }
}