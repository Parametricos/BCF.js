import { IHelpers } from "../IHelpers"
import { Helpers } from "./Helpers"
import BcfReaderBase from "../BcfReader"

export * from "../schema"

const helpersFunctions: IHelpers = {
    GetMarkup: Helpers.GetMarkup,
    GetViewpoint: Helpers.GetViewpoint
}

export class BcfReader extends BcfReaderBase {
    constructor() {
        super("3.0", helpersFunctions)
    }
}