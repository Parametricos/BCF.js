const bcfjs21 = require("../dist/2.1")
const bcfjs30 = require("../dist")
const fs = require("fs")

const writeFile = async (content, filePath) => {
    const lastSlashIndex = filePath.lastIndexOf('/')
    const folderPath = filePath.substring(0, lastSlashIndex)
    if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath)
    fs.writeFile(filePath, content, (err) => { if (err) console.log("Error on write file: ", err) })
}

const testV21 = async () => {
    const file = fs.readFileSync("./test-data/bcf2.1/MaximumInformation.bcf")
    const reader = new bcfjs21.BcfReader()
    await reader.read(file)

    let bcfproject = reader.project
    bcfproject.name = "This was modified by bcf-js"
    bcfproject.markups[0].topic.title = "Topic 1 renamed"
    bcfproject.markups[1].topic.title = "Topic 2 renamed"

    // Add Snapshots, Markup.xsd, Viewpoints... to the file
    const writer = new bcfjs21.BcfWriter()
    for (const entry in reader.bcf_archive.entries) {

        if (entry.endsWith("markup.bcf"))
            continue

        writer.addEntry({
            path: entry,
            content: await reader.getEntry(entry).arrayBuffer()
        })
    }

    const buffer = await writer.write(bcfproject)
    await writeFile(buffer, "./test-data/bcf2.1/Writer/WriterTest.bcf")
}

const testV30 = async () => {
    const file = fs.readFileSync("./test-data/bcf3.0/MaximumInformation.bcf")
    const reader = new bcfjs30.BcfReader()
    await reader.read(file)

    let bcfproject = reader.project
    bcfproject.name = "This was modified by bcf-js"
    bcfproject.markups[0].topic.title = "Topic 1 renamed"
    bcfproject.markups[1].topic.title = "Topic 2 renamed"

    // Add Snapshots, Markup.xsd, Viewpoints... to the file
    const writer = new bcfjs30.BcfWriter()
    for (const entry in reader.bcf_archive.entries) {

        if (entry.endsWith("markup.bcf") || entry.endsWith('.version'))
            continue

        writer.addEntry({
            path: entry,
            content: await reader.getEntry(entry).arrayBuffer()
        })
    }

    const buffer = await writer.write(bcfproject)
    await writeFile(buffer, "./test-data/bcf3.0/Writer/WriterTest.bcf")
}

testV21()
testV30()