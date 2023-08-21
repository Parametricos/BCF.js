import * as bcf21 from "../src/"
import * as bcf30 from "../src/3.0"
import * as fs from "fs/promises"
import { readdir, readdirSync } from "fs"

const maximumContentViewPoint = {
    camera_view_point: { x: 12.2088897788292, y: 52.323145074034, z: 5.24072091171001 },
    camera_direction: {
        x: -0.381615611200324,
        y: -0.825232810204882,
        z: -0.416365617893758
    },
    camera_up_vector: { x: 0.05857014928797, y: 0.126656300502579, z: 0.990215996212637 },
    field_of_view: 60
}

describe("Read BCF 2.1", () => {

    let file
    let reader

    it("Read each test-data file", async () => {
        const folderPath = './test-data/bcf2.1/'
        try {
            const filesNames = readdirSync(folderPath).filter((name) => name.endsWith(".bcf"))

            async function readBcf(fileName) {
                const fullPath = folderPath.concat(fileName)
                const file2 = await fs.readFile(fullPath)
                const reader2 = new bcf30.BcfReader()
                await reader2.read(file2)
                //console.log('description', reader2.markups[0].topic.description)
                expect(reader2.markups[0].topic.title).toBeDefined()
            }

            for (const file of filesNames) {
                await readBcf(file)
            }

        }
        catch (err) {
            console.log('err', err)
            expect(false).toBe(true)
        }
        expect(true).toBe(true)
    })

    beforeAll(async () => {
        file = await fs.readFile("./test-data/bcf2.1/MaximumInformation.bcf")
        reader = new bcf21.BcfReader()
        await reader.read(file)
    })

    it("BCF is not null", () => {
        expect(reader.topics.length).toEqual(2)
    })

    it("Markup Topic Title is Defined", () => {
        expect(reader.topics[1].markup.topic.title).toBe("Maximum Content")
    })

    it("Maximum Content Viewpoint", () => {
        expect(reader.topics[1].viewpoints[0].perspective_camera)
            .toStrictEqual(maximumContentViewPoint)
    })
})

describe("Read BCF 3.0", () => {

    let file
    let reader

    beforeAll(async () => {
        file = await fs.readFile("./test-data/bcf3.0/MaximumInformation.bcf")
        reader = new bcf30.BcfReader()
        await reader.read(file)
    })

    it("Read each test-data file", async () => {
        const folderPath = './test-data/bcf3.0/'
        try {
            const filesNames = readdirSync(folderPath).filter((name) => name.endsWith(".bcf"))

            async function readBcf(fileName) {
                const fullPath = folderPath.concat(fileName)
                const file2 = await fs.readFile(fullPath)
                const reader2 = new bcf30.BcfReader()
                await reader2.read(file2)
                //console.log('description', reader2.markups[0].topic.description)
                expect(reader2.markups[0].topic.title).toBeDefined()
            }

            for (const file of filesNames) {
                await readBcf(file)
            }

        }
        catch (err) {
            console.log('err', err)
            expect(false).toBe(true)
        }
        expect(true).toBe(true)
    })

    it("BCF is not null", () => {
        expect(reader.markups.length).toBeGreaterThan(0)
    })

    it("Markup Topic Title is Defined", () => {
        expect(reader.markups[1].topic.title).toBe("Maximum Content")
    })

    it("Maximum Content Viewpoint", () => {
        expect(reader.markups[1].viewpoints[0].perspective_camera)
            .toStrictEqual(maximumContentViewPoint)
    })
})