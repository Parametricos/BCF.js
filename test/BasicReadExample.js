const bcfjs21 = require("../dist/2.1")
const bcfjs30 = require("../dist/")
const fs = require("fs/promises")

const testV21 = async () => {
    const file = await fs.readFile("./test-data/bcf2.1/MaximumInformation.bcf")
    const reader = new bcfjs21.BcfReader()
    await reader.read(file)

    const project = reader.project

    project.markups.forEach((markup) => {
        if (markup == undefined)
            return

        console.log('title', markup.topic.title)

        if (markup.viewpoints.length > 0) {
            console.log(markup.viewpoints[0].perspective_camera)

            const v = markup.viewpoints

            if (!v) return

            markup.getViewpointSnapshot(v[0]).then((data) => {
                if (data)
                    console.log('base64String image data: ', data)
            })
        }
    })
}

const testV30 = async () => {
    const file = await fs.readFile("./test-data/bcf3.0/MaximumInformation.bcf")
    const reader = new bcfjs30.BcfReader()
    await reader.read(file)

    const project = reader.project

    project.markups.forEach((markup) => {
        if (markup == undefined)
            return

        console.log('title', markup.topic.title)

        if (markup.viewpoints.length > 0) {
            console.log(markup.viewpoints[0].perspective_camera)

            const v = markup.viewpoints

            if (!v) return

            markup.getViewpointSnapshot(v[0]).then((data) => {
                if (data)
                    console.log('base64String image data: ', data)
            })
        }
    })
}

testV21()
testV30()
