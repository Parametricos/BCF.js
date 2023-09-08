import JSZip from "jszip"
import { IProject } from "./schema"
import { IHelpers } from "./IHelpers"
import { XMLBuilder } from "fast-xml-parser"

export default class BcfWriter {
    version: string
    project?: IProject
    markups: any[] = []
    files: any[]
    helpers: IHelpers

    constructor(version: string, helpers: IHelpers) {
        this.version = version
        this.helpers = helpers
        this.files = []
    }

    addEntry = (file: IFile) => {
        if (file.path.endsWith('.version'))
            return

        this.files.push(file)
    }

    write = async (project: IProject): Promise<Buffer | undefined> => {
        try {
            this.project = project
            createEntries(this, project.markups)
            return await exportZip(this.files)
        } catch (e) {
            console.log("Error in writing BCF archive. The error below was thrown.")
            console.error(e)
        }
    }
}

function createEntries(writer: BcfWriter, markups: any) {
    if (!writer.project)
        return

    writer.addEntry(bcfversion(writer.version))
    writer.addEntry(projectbcfp(writer.project.project_id, writer.project.name))
    writer.addEntry(extensionssxd(writer))

    for (const markup of markups) {
        const formattedMarkup = writer.helpers.MarkupToXmlNotation(markup)
        writer.markups.push(formattedMarkup)
        let xml = new XMLBuilder(writer.helpers.XmlBuilderOptions).build(formattedMarkup)
        xml = `<?xml version="1.0" encoding="utf-8"?>${xml}`

        if (markup.topic) {
            const guid = markup.topic.guid
            const newEntry = {
                path: `${guid}/markup.bcf`,
                content: xml
            }
            writer.addEntry(newEntry)
        }
    }
}

async function exportZip(files: IFile[]): Promise<Buffer> {
    var zip = new JSZip()

    for (const file of files) {
        const fullPath = file.path.split('/')

        if (!fullPath)
            continue

        if (fullPath.length == 1)
            zip.file(fullPath[0], file.content)
        else if (fullPath.length == 2)
            zip.folder(fullPath[0])?.file(fullPath[1], file.content)
    }

    return await zip.generateAsync({ type: "nodebuffer" })
}

function bcfversion(version: string): IFile {
    return {
        path: 'bcf.version',
        content: `<?xml version="1.0" encoding="utf-8"?>
        <Version xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:xsd="http://www.w3.org/2001/XMLSchema" VersionId="${version}">
      <DetailedVersion>${version}</DetailedVersion>
    </Version>`
    }
}

function projectbcfp(projectId: string, projectName: string): IFile {
    return {
        path: 'project.bcfp',
        content: `<?xml version="1.0" encoding="utf-8"?>
<ProjectExtension xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <Project ProjectId="${projectId}">
    <Name>${projectName}</Name>
  </Project>
  <ExtensionSchema>extensions.xsd</ExtensionSchema>
</ProjectExtension>`
    }
}

function extensionssxd(writer: BcfWriter): IFile {
    let xml = new XMLBuilder(writer.helpers.XmlBuilderOptions).build(writer.project?.extension_schema)
    xml = `<?xml version="1.0" encoding="utf-8"?>${xml}`

    return {
        path: 'extensions.xsd',
        content: xml
    }
}

interface IFile {
    path: string,
    content: string
}

