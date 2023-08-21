import {IComment, IMarkup, IViewpoint} from "./schema";
import parser from "fast-xml-parser";
import {
    Component,
    ComponentColoring,
    Components,
    ComponentVisibility,
    ViewSetupHints,
    VisualizationInfo
} from "./schema";

export namespace Helpers {

    const xmlParserOptions = {
        attributeNamePrefix: "@_",
        ignoreAttributes: false,
        ignoreNameSpace: true,
        allowBooleanAttributes: true,
        parseNodeValue: true,
        parseAttributeValue: true,
        trimValues: true,
    };

    export function GetMarkup(xmlString: any): IMarkup {
        const { Markup } = parser.parse(xmlString, xmlParserOptions);

        return {
            topic: {
                guid: Markup.Topic['@_Guid'],
                topic_type: Markup.Topic["@_TopicType"],
                topic_status: Markup.Topic["@_TopicStatus"],
                reference_link: Markup.Topic["ReferenceLink"] && Helpers.ObjectToArray(Markup.Topic["ReferenceLink"]),
                title: Markup.Topic["Title"],
                priority: Markup.Topic["Priority"],
                index: Markup.Topic["Index"],
                labels: Markup.Topic["Labels"] && Helpers.ObjectToArray(Markup.Topic["Labels"]),
                creation_date: Markup.Topic["CreationDate"],
                creation_author: Markup.Topic["CreationAuthor"],
                modified_date: Markup.Topic["ModifiedDate"],
                modified_author: Markup.Topic["ModifiedAuthor"],
                assigned_to: Markup.Topic["AssignedTo"],
                description: Markup.Topic["Description"],
                // bim_snippets: Markup.ITopic["BimSnippet"] ? ,
                // related_topics: Markup.ITopic["ReferenceLink"],
            },
            comments: Helpers.GetComments(Markup.Comment),
            viewpoints: Helpers.GetViewpoints(Markup.Viewpoints)
        };
    }

    export function GetVisInfoComponent(xmlData: any): Component {
        return {
            ifc_guid: xmlData["@_IfcGuid"]
        }
    }

    export function GetViewpoint(xmlString: any): VisualizationInfo {
        const { VisualizationInfo } = parser.parse(xmlString, xmlParserOptions);
        const Vis = VisualizationInfo;

        //Camera
        const orthogonal_camera = Vis["OrthogonalCamera"];
        const perspective_camera = Vis["PerspectiveCamera"];

        //Extras
        const lines = Vis["Lines"];
        const clipping_planes = Vis["ClippingPlanes"];

        const GetComponents = () : Components | undefined => {

            if(!Vis["Components"]) return undefined;
            const components = Vis["Components"];

            const GetViewSetupHints = (): ViewSetupHints | undefined => {

                if(!components["ViewSetupHints"]) return undefined
                const view_setup_hints = components["ViewSetupHints"];

                return {
                    spaces_visible: view_setup_hints["@_SpacesVisible"],
                    spaces_boundaries_visible: view_setup_hints["@_SpacesBoundariesVisible"],
                    openings_visible: view_setup_hints["@_OpeningsVisible"]
                }
            }

            const GetVisibility = (): ComponentVisibility => {
                if(!components["Visibility"])
                    throw new Error("Visibility not found.")

                const visibility = components["Visibility"];
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

            const GetSelection = () : Component[] | undefined => {
                if(!components["Selection"]) return undefined;

                const selection = components["Selection"];
                const arr = Helpers.ObjectToArray(selection["Component"]);
                return arr?.map((exception: any) => {
                    return Helpers.GetVisInfoComponent(exception)
                })
            }

            const GetColoring = () : ComponentColoring[] | undefined => {

                if(!components["Coloring"]) return undefined;
                const coloring = components["Coloring"];

                const colors = coloring["Color"];
                if(!colors) return undefined;

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

        // Helpers.WriteJsonToFile("./parsed/viewpoint" + Vis["@_Guid"] + ".json", Vis);

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
        };
    }

    export function GetViewpoints(data: any) {
        if(!data) return;

        const constructViewpoint = (data: any): IViewpoint => {
            return {
                guid: data["@_Guid"],
                viewpoint: data["Viewpoint"],
                snapshot: data["Snapshot"]
            };
        }

        const viewpoints: IViewpoint[] = []

        if(Array.isArray(data)){
            data.forEach((x) => {
                viewpoints.push(constructViewpoint(x));
            })
        }else {
            viewpoints.push(constructViewpoint(data))
        }

        return viewpoints;
    }

    export function GetComments(data: any) {
        if(!data) return;

        const constructComment = (data: any): IComment => {
            return {
                guid: data["@_Guid"],
                date: data["Date"],
                author: data["Author"],
                comment: data["Comment"],
                viewpoint: data?.Viewpoint?.["@_Guid"],
                modified_date: data["ModifiedDate"],
                modified_author: data["ModifiedAuthor"]
            };
        }

        const viewpoints: IComment[] = []

        if(Array.isArray(data)){
            data.forEach((x) => {
                viewpoints.push(constructComment(x));
            })
        }else {
            viewpoints.push(constructComment(data))
        }

        return viewpoints;
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

    export function ParsePoint(point: any){
        return {
            x: point.X,
            y: point.Y,
            z: point.Z
        }
    }
}