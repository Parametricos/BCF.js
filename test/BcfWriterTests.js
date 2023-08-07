const xmlBuilder = require('fast-xml-parser')
const bcfjs = require("../dist/3.0")
const fs = require("fs/promises")
const unzipit = require('unzipit')

async function testXML() {
    const xmlParserOptions = {
        attributeNamePrefix: "@_",
        ignoreAttributes: false,
        ignoreNameSpace: true,
        allowBooleanAttributes: true,
        parseNodeValue: true,
        parseAttributeValue: true,
        trimValues: false,
    }

    const file = await fs.readFile("./test-data/MaximumInformation.bcf")
    const bcf_archive = await unzipit.unzip(file)
    let markups = new Array()

    const { entries } = bcf_archive

    for (const [name, entry] of Object.entries(entries)) {
        if (name.endsWith('.bcf')) {
            markups.push(entry)

            xmlStringc = await this.markup_file.text()
            const { Markup } = parse(xmlString, xmlParserOptions)

        }
    }

    console.log('markups', markups)

    // const { Markup } = parse(xmlString, xmlParserOptions)
    // console.log('Markup', Markup)
}

function renameJSONParameters(inputJSON) {
    const outputJSON = [{}]
    let newJSON = {}
    const typeInput = typeof inputJSON

    for (let index = 0; index < inputJSON.length; index++) {
        newJSON = {}
        const element = inputJSON[index].topic

        for (const key in element) {
            const value = element[key]
            const type = typeof element[key]

            if (!value)
                continue
            console.log('index', index, 'key', key, 'value', value)
            if (value === 'object')
                console.log('isObject')
            if (Array.isArray(value))
                value.forEach(nestedElement => {
                    renameJSONParameters(nestedElement)
                })

            const newKey = changeToUppercase(key)
            newJSON[newKey] = value
        }

        console.log('newJSON', newJSON)
        outputJSON.push(newJSON)
    }

    return outputJSON
}

function renameKeyToBCFXML(key) {
    // const testString = 'ifc-spatial-structure-element'
    // const charToFind = '-'
    // const find = testString.match(charToFind)
    // console.log('find', find)

    // const indices = []

    // for (let i = 0; i < testString.length; i++) {
    //     if (testString[i] === charToFind) {
    //         testString[i] = 'sdasd'
    //     }
    // }

    // console.log(indices) // Outputs: [3, 10, 22]
}

function changeToUppercase(key) {
    const charToFind = '_'
    let newKey = []
    let chars = key.split('')

    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === charToFind) {
            newKey.push(chars[i + 1].toUpperCase())
            i++
        }
        else if (i == 0)
            newKey.push(chars[i].toUpperCase())
        else
            newKey.push(chars[i])
    }
    newKey = newKey.join("")
    return newKey
}

const test = async () => {
    const file = await fs.readFile("./test-data/MaximumInformation-bcf3.bcf")
    const reader = new bcfjs.BcfReader()
    await reader.read(file)

    //renameJSONParameters(reader.markups)
    //testXML()
    //changeToUppercase('ifc_spatial_structure_element')
}

test()