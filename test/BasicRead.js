const bcfjs = require("../dist")
const fs = require("fs/promises")

const test = async () => {
    const file = await fs.readFile("./test-data/MaximumInformation.bcf")
    const reader = new bcfjs.BcfReader()
    await reader.read(file)

    reader.markups.forEach((markup) => {

        if (markup.topic == undefined)
            return

        if (markup.viewpoints.length > 0) {
            console.log(markup.viewpoints[0].perspective_camera)

            const v = markup.viewpoints

            if (!v) return

            markup.getViewpointSnapshot(v[0]).then((data) => {
                console.log(data)
            })
        }
    })
}

test()