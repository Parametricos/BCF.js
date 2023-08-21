const bcfjs21 = require("../dist")
const bcfjs30 = require("../dist/3.0")
const fs = require("fs/promises")

const testV21 = async () => {
    const file = await fs.readFile("./test-data/bcf2.1/MaximumInformation.bcf")
    const reader = new bcfjs21.BcfReader()
    await reader.read(file)

    reader.topics.forEach((topic) => {
        if (topic.viewpoints.length > 0) {
            console.log(topic.viewpoints[0].perspective_camera)

            const v = topic?.markup?.viewpoints

            if (!v) return

            topic.getViewpointSnapshot(v[0]).then((data) => {
                console.log(data)
            })
        }

    })
}

const testV30 = async () => {
    const file = await fs.readFile("./test-data/bcf3.0/MaximumInformation.bcf")
    const reader = new bcfjs30.BcfReader()
    await reader.read(file)

    reader.markups.forEach((markup) => {
        if (markup.topic == undefined)
            return

        console.log('markup.topic.title', markup.topic.title)

        if (markup.viewpoints.length > 0) {
            console.log(markup.viewpoints[0].perspective_camera)

            const v = markup.topic.viewpoints

            if (!v) return

            markup.getViewpointSnapshot(v[0]).then((data) => {
                console.log(data)
            })
        }
    })
}

testV21()
testV30()
