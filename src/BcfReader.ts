import JSZip, {JSZipObject} from "jszip";
import {IMarkup, MarkupViewpoint} from "./schema";
import {Helpers} from "./Helpers";
import {VisualizationInfo} from "./schema";

export class BcfReader{

    bcf_archive: JSZip = new JSZip();
    topics: Topic[] = [];

    read = async (url: string) => {
        try {
            this.bcf_archive = await JSZip.loadAsync(url);

            const topics: JSZipObject[] = [];

            this.bcf_archive.forEach((path: string, file) => {
                const extension = path.split('.').pop();
                if(extension === "bcf"){
                    topics.push(file);
                }
            })

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
}

export class Topic {

    readonly reader: BcfReader;
    readonly markup_file: JSZipObject;

    markup: IMarkup | undefined;
    viewpoints: VisualizationInfo[] = [];

    constructor(reader: BcfReader, markup: JSZipObject) {
        this.reader = reader;
        this.markup_file = markup;
    }

    read = async () => {
        await this.parseMarkup();
        await this.parseViewpoints();
    }

    private parseMarkup = async () => {
        const contents = await this.markup_file.async("string");
        this.markup = Helpers.GetMarkup(contents);
    }

    private parseViewpoints = async () => {
        if(!this.markup) return;

        if(this.markup.viewpoints) {

            const viewpoints = this.markup.viewpoints;

            for (let i = 0; i < viewpoints.length; i++) {
                const entry = viewpoints[i];
                const file = this.reader.bcf_archive.file(this.markup.topic.guid + "/" + entry.viewpoint);

                const contents = await file?.async("string");
                if (!contents) throw new Error("Missing Visualization Info");

                const viewpoint = Helpers.GetViewpoint(contents);
                this.viewpoints.push(viewpoint);
                // Helpers.WriteJsonToFile(`./output/${name}/${id}/${entry.viewpoint}.json`, viewpoint);
            }
        }
    }

    getViewpointSnapshot = async (viewpoint: MarkupViewpoint) => {
        if(!viewpoint || !this.markup) return;
        return this.reader.bcf_archive.file(`${this.markup.topic.guid}/${viewpoint.snapshot}`)
    }
}