import { IHeader, IMarkup, ITopic } from "../schema"
import { XMLParser } from "fast-xml-parser"
import * as SharedHelpers from '../SharedHelpers'

export namespace Helpers {

    export const XmlParserOptions = { ...SharedHelpers.XmlParserOptions, oneListGroup: true }
    export const XmlBuilderOptions = SharedHelpers.XmlBuilderOptions
    export const GetViewpoint = SharedHelpers.GetViewpoint
    export const XmlToJsonNotation = SharedHelpers.XmlToJsonNotation
    const ChangeToUppercase = SharedHelpers.ChangeToUppercase

    export function GetMarkup(xmlString: any): IMarkup {
        const { Markup } = new XMLParser(XmlParserOptions).parse(xmlString)
        const formattedMarkup = XmlToJsonNotation(Markup)

        return {
            header: formattedMarkup.header as IHeader,
            topic: formattedMarkup.topic as ITopic
        }
    }

    export function MarkupToXmlNotation(markup: IMarkup): any {

        let purgedMarkup = {
            "Markup": {
                "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                "header": markup.header,
                "topic": markup.topic
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
                for (const child of value) {
                    let newChild: any = {}
                    let childKey = newKey

                    if (opt_plural_to_singular)
                        childKey = childKey.slice(0, -1)

                    newChild[childKey] = RenameJsonKeys(child, options)

                    newArrNode.push(newChild)
                }
                outputObj[newKey] = newArrNode
                continue
            }

            if (typeof value === 'object')
                value = RenameJsonKeys(value, options)

            outputObj[newKey] = value
        }

        return outputObj
    }
}