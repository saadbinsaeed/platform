
export const breakpointsMap = {
    xs: 240,
    sm: 640,
    md: 800,
    lg: 1200,
    xl: 1920,
};

export default Object.keys(breakpointsMap).reduce(
    (breakpointMap, size) => {
        breakpointMap[size] = `${breakpointsMap[size]}px`;
        return breakpointMap;
    },
    {});
