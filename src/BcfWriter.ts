// import { IViewPoint, ITopic, VisualizationInfo, IMarkup } from "./schema"
// import { Helpers } from "./Helpers"
// import { parse } from 'fast-xml-parser'
// import { BcfReader } from "./BcfReader"

// const xsi = "http://www.w3.org/2001/XMLSchema-instance"
// const xsd = "http://www.w3.org/2001/XMLSchema"

// const attributes = [
//     "Guid",
//     "SnippetType",
//     "IsExternal",
//     "IfcProject",
//     "IfcSpatialStructureElement",
//     "ServerAssignedId",
//     "TopicType",
//     "TopicStatus"
// ]

// export class BcfWriter {
//     markups: 

//     write = (src: BcfReader) => {
//         try {

//             for (const markup of src.markups) {

//             }

//         } catch (e) {
//             console.log("Error in writing BCF archive. The error below was thrown.")
//             console.error(e)
//         }
//     }
// }

// function markupToXmlNotation(markup: IMarkup) {

//     let purgedMarkup = {
//         "Markup": {
//             "@_xmlns:xsi": xsi,
//             "@_xmlns:xsd": xsd,
//             "header": markup.header,
//             "topic": markup.topic
//         }
//     }

//     return renameJsonKeys(purgedMarkup)
// }

// function renameJsonKeys(obj) {
//     let outputObj = {}

//     if (typeof obj === 'string')
//         return obj

//     for (const key in obj) {

//         let value = obj[key]

//         if (!value)
//             continue

//         if (key.startsWith('@_')) {
//             outputObj[key] = value
//             continue
//         }

//         const newKey = changeToUppercase(key)

//         if (Array.isArray(value)) {
//             const newArrNode = {}
//             newArrNode[newKey.slice(0, -1)] = value.map((renameJsonKeys))
//             outputObj[newKey] = newArrNode
//             continue
//         }

//         if (typeof value === 'object')
//             value = renameJsonKeys(value)

//         outputObj[newKey] = value
//     }

//     return outputObj
// }

// function changeToUppercase(key) {
//     let newKey = []

//     const charToFind = '_'
//     let chars = key.split('')

//     for (let i = 0; i < chars.length; i++) {

//         if (chars[i] === charToFind) {
//             newKey.push(chars[i + 1].toUpperCase())
//             i++
//         }
//         else if (i == 0)
//             newKey.push(chars[i].toUpperCase())
//         else
//             newKey.push(chars[i])
//     }
//     newKey = newKey.join("")

//     if (attributes.includes(newKey))
//         newKey = `@_${newKey}`

//     return newKey
// }

// export class Markup {



//     let purgedMarkup = {
//         "Markup": {
//             "@_xmlns:xsi": xsi,
//             "@_xmlns:xsd": xsd,
//             "header": markup.header,
//             "topic": markup.topic
//         }
//     }
// }