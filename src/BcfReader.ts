import {IMarkup, MarkupViewpoint} from "./schema";
import {Helpers} from "./Helpers";
import {VisualizationInfo} from "./schema";
import {Reader, TypedArray, unzip, Zip, ZipEntry, ZipInfo} from 'unzipit';

export class BcfReader{

    bcf_archive: ZipInfo | undefined
    topics: Topic[] = [];

    read = async (src: string | ArrayBuffer | TypedArray | Blob | Reader) => {
        try {
            const topics: ZipEntry[] = [];

            this.bcf_archive = await unzip(src);

            const { entries } = this.bcf_archive;

            for (const [name, entry] of Object.entries(entries)) {
                if (name.endsWith('.bcf')) {
                    topics.push(entry);
                }
            }

            for (let i = 0; i < topics.length; i++) {
                const t = topics[i]
                const topic = new Topic(this, t);
                await topic.read();
                this.topics.push(topic);
            }
        }catch (e) {
            console.log("Error in loading BCF archive. The error below was thrown.")
            console.error(e)
        }
    }

    getEntry = (name: string) => {
        return this.bcf_archive?.entries[name];
    }
}

export class Topic {

    readonly reader: BcfReader;
    readonly markup_file: ZipEntry;

    markup: IMarkup | undefined;
    viewpoints: VisualizationInfo[] = [];

    constructor(reader: BcfReader, markup: ZipEntry) {
        this.reader = reader;
        this.markup_file = markup;
    }

    read = async () => {
        await this.parseMarkup();
        await this.parseViewpoints();
    }



    private parseMarkup = async () => {
        this.markup = Helpers.GetMarkup(await this.markup_file.text());
    }

    private parseViewpoints = async () => {
        if(!this.markup) return;

        if(this.markup.viewpoints) {

            const viewpoints = this.markup.viewpoints;

            for (let i = 0; i < viewpoints.length; i++) {
                const entry = viewpoints[i];
                const key = this.markup.topic.guid + "/" + entry.viewpoint;
                const file = this.reader.getEntry(key);

                if (!file) throw new Error("Missing Visualization Info");

                const viewpoint = Helpers.GetViewpoint(await file.text());
                this.viewpoints.push(viewpoint);
                // Helpers.WriteJsonToFile(`./output/${name}/${id}/${entry.viewpoint}.json`, viewpoint);
            }
        }
    }

    getViewpointSnapshot = async (viewpoint: MarkupViewpoint) => {
        if(!viewpoint || !this.markup) return;
        return this.reader.getEntry(`${this.markup.topic.guid}/${viewpoint.snapshot}`);
    }
}