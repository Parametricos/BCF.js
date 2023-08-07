export interface VisualizationInfo {
    guid: string
    components?: Components,
    orthogonal_camera?: OrthogonalCamera,
    perspective_camera?: PerspectiveCamera,
    lines?: Line[],
    clipping_planes?: ClippingPlane[],
    // bitmaps?: Bitmap[]
}

export interface Components {
    view_setup_hints?: ViewSetupHints,
    selection?: Component[],
    visibility: ComponentVisibility,
    coloring?: ComponentColoring[]
}

export interface ViewSetupHints {
    spaces_visible?: boolean
    spaces_boundaries_visible?: boolean,
    openings_visible?: boolean
}

export interface Component {
    ifc_guid?: string,
    originating_system?: string,
    authoring_tool_id?: string
}

export interface ComponentVisibility {
    default_visibility?: boolean
    exceptions?: Component[],
}

export interface ComponentColoring {
    color: string,
    components: Component[]
}

export interface OrthogonalCamera {
    camera_view_point: Point,
    camera_direction: Direction,
    camera_up_vector: Direction,
    view_to_world_scale: number
}

export interface PerspectiveCamera {
    camera_view_point: Point,
    camera_direction: Direction,
    camera_up_vector: Direction,
    field_of_view: number
}

export interface Point {
    x: number,
    y: number,
    z: number
}

export interface Direction {
    x: number,
    y: number,
    z: number
}

export interface Line {
    start_point: Point,
    end_point: Point
}

export interface ClippingPlane {
    location: Point,
    direction: Direction
}
