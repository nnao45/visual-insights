// exclusive only for same semantic type.
export const VISUAL_CHANNELS = {
    x: {
        name: "x",
        exclusiveChannels: ["angle", "radius"], // todo in geom config
    },
    y: {
        name: "y",
        exclusiveChannels: ["angle", "radius"], // todo in geom config
    },
    angle: {
        name: "angle",
        exclusiveChannels: ["x", "y"],
    },
    color: {
        name: "color",
        exclusiveChannels: ["shape", "opacity"]
    },
    highFacets: {
        name: "highFacets",
        exclusiveChannels: []
    },
    opacity: {
        name: "opacity",
        exclusiveChannels: ["color"]
    }
};
