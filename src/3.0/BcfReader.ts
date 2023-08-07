import { IViewPoint, ITopic, VisualizationInfo } from "./schema"
import { Helpers } from "./Helpers"
import { Reader, TypedArray, unzip, ZipEntry, ZipInfo } from 'unzipit'

export class BcfReader {

    bcf_archive: ZipInfo | undefined
    markups: Markup[] = [];

    read = async (src: string | ArrayBuffer | TypedArray | Blob | Reader) => {
        try {
            const markups: ZipEntry[] = []

            this.bcf_archive = await unzip(src)

            const { entries } = this.bcf_archive

            for (const [name, entry] of Object.entries(entries)) {
                if (name.endsWith('.bcf')) {
                    markups.push(entry)
                }
            }

            for (let i = 0; i < markups.length; i++) {
                const t = markups[i]
                const markup = new Markup(this, t)
                await markup.read()
                this.markups.push(markup)
            }
        } catch (e) {
            console.log("Error in loading BCF archive. The error below was thrown.")
            console.error(e)
        }
    }

    getEntry = (name: string) => {
        return this.bcf_archive?.entries[name]
    }
}

export class Markup {

    readonly reader: BcfReader
    readonly markup_file: ZipEntry

    //TODO: header
    topic: ITopic | undefined
    viewpoints: VisualizationInfo[] = [];

    constructor(reader: BcfReader, markup: ZipEntry) {
        this.reader = reader
        this.markup_file = markup
    }

    read = async () => {
        await this.parseMarkup()
        await this.parseViewpoints()
    }

    private parseMarkup = async () => {
        this.topic = Helpers.GetMarkup(await this.markup_file.text()).topic
    }

    private parseViewpoints = async () => {
        if (!this.topic) return

        if (this.topic.viewpoints) {

            const topic_viewpoints = this.topic.viewpoints

            for (let i = 0; i < topic_viewpoints.length; i++) {
                const entry = topic_viewpoints[i]
                const key = this.topic.guid + "/" + entry.viewpoint
                const file = this.reader.getEntry(key)

                if (!file) throw new Error("Missing Visualization Info")

                const viewpoint = Helpers.GetViewpoint(await file.text())
                this.viewpoints.push(viewpoint)
                //TODO: Helpers.WriteJsonToFile(`./output/${name}/${id}/${entry.viewpoint}.json`, viewpoint);
            }
        }
    }

    getViewpointSnapshot = async (viewpoint: IViewPoint): Promise<Blob | undefined> => {
        if (!viewpoint || !this.topic) return
        const entry = this.reader.getEntry(`${this.topic.guid}/${viewpoint.snapshot}`)
        if (entry) {
            return await entry.blob()
        }
    }
}