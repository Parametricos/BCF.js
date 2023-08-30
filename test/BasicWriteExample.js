const bcfjs21 = require("../dist/2.1")
const bcfjs30 = require("../dist")
const fs = require("fs/promises")

//const writer = require("../dist")

const testV30 = async () => {
    const file = await fs.readFile("./test-data/bcf3.0/MaximumInformation.bcf")
    const reader = new bcfjs30.BcfReader()
    await reader.read(file)


    const writer = new bcfjs30.BcfWriter('3.0')
    writer.write(reader.markups)
    console.log('writer.markups[1]', writer.markups[1])
    debugger
}

testV30()
