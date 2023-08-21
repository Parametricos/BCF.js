import { IHeader, IMarkup, ITopic } from "./schema"
import { parse } from "fast-xml-parser"
import {
    Component,
    ComponentColoring,
    Components,
    ComponentVisibility,
    ViewSetupHints,
    VisualizationInfo
} from "./schema"


export namespace Helpers {

    const xmlParserOptions = {
        attributeNamePrefix: "@_",
        ignoreAttributes: false,
        ignoreNameSpace: true,
        allowBooleanAttributes: true,
        parseNodeValue: true,
        parseAttributeValue: true,
        trimValues: true,
    }

    const arrayProps = [
        "ReferenceLinks",
        "Labels",
        "DocumentReferences",
        "RelatedTopics",
        "Comments",
        "Viewpoints",
        "Files"
    ]

    export function GetMarkup(xmlString: any): IMarkup {
        const { Markup } = parse(xmlString, xmlParserOptions)
        const formattedMarkup = xmlToJsonNotation(Markup)

        return {
            header: formattedMarkup.header as IHeader,
            topic: formattedMarkup.topic as ITopic
        }
    }

    export function GetVisInfoComponent(xmlData: any): Component {
        return {
            ifc_guid: xmlData["@_IfcGuid"]
        }
    }

    export function GetViewpoint(xmlString: any): VisualizationInfo {
        const { VisualizationInfo } = parse(xmlString, xmlParserOptions)
        const Vis = VisualizationInfo

        //Camera
        const orthogonal_camera = Vis["OrthogonalCamera"]
        const perspective_camera = Vis["PerspectiveCamera"]

        //Extras
        const lines = Vis["Lines"]
        const clipping_planes = Vis["ClippingPlanes"]

        const GetComponents = (): Components | undefined => {

            if (!Vis["Components"]) return undefined
            const components = Vis["Components"]

            const GetViewSetupHints = (): ViewSetupHints | undefined => {

                if (!components["ViewSetupHints"]) return undefined
                const view_setup_hints = components["ViewSetupHints"]

                return {
                    spaces_visible: view_setup_hints["@_SpacesVisible"],
                    spaces_boundaries_visible: view_setup_hints["@_SpacesBoundariesVisible"],
                    openings_visible: view_setup_hints["@_OpeningsVisible"]
                }
            }

            const GetVisibility = (): ComponentVisibility => {
                if (!components["Visibility"])
                    throw new Error("Visibility not found.")

                const visibility = components["Visibility"]
                return {
                    default_visibility: visibility["@_DefaultVisibility"],
                    exceptions:
                        visibility["Exceptions"] &&
                        visibility["Exceptions"]["Component"] &&
                        Helpers.ObjectToArray(visibility["Exceptions"]["Component"])?.map((exception: any) => {
                            return Helpers.GetVisInfoComponent(exception)
                        })
                }
            }

            const GetSelection = (): Component[] | undefined => {
                if (!components["Selection"]) return undefined

                const selection = components["Selection"]
                const arr = Helpers.ObjectToArray(selection["Component"])
                return arr?.map((exception: any) => {
                    return Helpers.GetVisInfoComponent(exception)
                })
            }

            const GetColoring = (): ComponentColoring[] | undefined => {

                if (!components["Coloring"]) return undefined
                const coloring = components["Coloring"]

                const colors = coloring["Color"]
                if (!colors) return undefined

                return Helpers.ObjectToArray(colors).map((color: any) => (
                    {
                        color: color["@_Color"],
                        components: Helpers.ObjectToArray(color["Component"])
                            .map((exception: any) => {
                                return Helpers.GetVisInfoComponent(exception)
                            })
                    }
                )
                )
            }

            return {
                view_setup_hints: GetViewSetupHints(),
                visibility: GetVisibility(),
                selection: GetSelection(),
                coloring: GetColoring()
            }
        }

        return {
            guid: Vis["@_Guid"],
            components: GetComponents(),
            orthogonal_camera: orthogonal_camera && {
                camera_view_point: ParsePoint(orthogonal_camera["CameraViewPoint"]),
                camera_direction: ParsePoint(orthogonal_camera["CameraDirection"]),
                camera_up_vector: ParsePoint(orthogonal_camera["CameraUpVector"]),
                view_to_world_scale: orthogonal_camera["ViewToWorldScale"]
            },
            perspective_camera: perspective_camera && {
                camera_view_point: ParsePoint(perspective_camera["CameraViewPoint"]),
                camera_direction: ParsePoint(perspective_camera["CameraDirection"]),
                camera_up_vector: ParsePoint(perspective_camera["CameraUpVector"]),
                field_of_view: perspective_camera["FieldOfView"]
            },
        }
    }

    function fixArraysNodes(value: any) {
        let result: any = {}

        if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value))
            return value

        for (const child in value) {
            if (!arrayProps.includes(child)) {
                result[child] = value[child]
                continue
            }

            result[child] = []
            const val = Object.values(value[child])[0]
            
            if (Array.isArray(val))
                result[child] = val
            else
                result[child].push(val)
        }

        return result
    }

    function xmlToJsonNotation(node: any) {
        if (!node) return

        const isArray = Array.isArray(node)
        let outputNode: any = isArray ? [] : {}

        if (typeof node === 'string')
            return node

        for (const child in node) {
            let value = node[child]

            if (!value)
                continue

            let key = child
                .replace(/^@_/g, "")
                .replace(/((?<=^@_).|^[A-Z])/g, match => match.toLowerCase())
                .replaceAll(/[A-Z]/g, match => "_" + match.toLowerCase())

            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
                outputNode[key] = value
            else
                outputNode[key] = xmlToJsonNotation(fixArraysNodes(value))
        }

        return outputNode
    }

    /**
     * Returns an object as an array
     * Can also accept array and returns new array if type is unknown
     *
     * @return data as an array
     * @param data
     */
    export function ObjectToArray(data: any) {
        return Array.isArray(data) ? data : [data]
    }

    export function ParsePoint(point: any) {
        return {
            x: point.X,
            y: point.Y,
            z: point.Z
        }
    }
}