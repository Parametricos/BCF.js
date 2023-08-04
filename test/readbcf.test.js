import { BcfReader } from "../src"
import * as fs from "fs/promises"

describe("Read BCF", () => {

    let data
    let reader

    it("BCF is not null", async () => {
        const file = await fs.readFile("./test-data/MaximumInformation.bcf")
        console.log('file', file)
        reader = new BcfReader()
        await reader.read(file)

        console.log('reader', reader)
        console.log('reader.markups[1]', reader.markups)

        reader.markups.forEach((markup) => {
            if (markup.topic == undefined)
                return

            console.log('markup', markup)

            if (markup.viewpoints.length > 0) {
                console.log(markup.viewpoints[0].perspective_camera)

                const v = markup.viewpoints

                if (!v) return

                markup.getViewpointSnapshot(v[0]).then((data) => {
                    console.log(data)
                    expect(data).toBeDefined()
                })
            }
        })
    })
})