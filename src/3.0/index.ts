import { IHelpers } from "../IHelpers"
import { Helpers } from "./Helpers"
import BcfReaderBase from "../BcfReader"
import BcfWriterBase from "../BcfWriter"

export * from "../schema"

const helpersFunctions: IHelpers = {
    GetMarkup: Helpers.GetMarkup,
    GetViewpoint: Helpers.GetViewpoint,
    XmlToJsonNotation: Helpers.XmlToJsonNotation,
    MarkupToXmlNotation: Helpers.MarkupToXmlNotation,
    XmlParserOptions: Helpers.XmlParserOptions,
    XmlBuilderOptions: Helpers.XmlBuilderOptions
}

export class BcfReader extends BcfReaderBase {
    constructor() {
        super("3.0", helpersFunctions)
    }
}

export class BcfWriter extends BcfWriterBase {
    constructor() {
        super("3.0", helpersFunctions)
    }
}