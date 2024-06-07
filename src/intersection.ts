type Point2D = { x: number; y: number };

function l_orientation(p: Point2D, q: Point2D, r: Point2D): number {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0; // collinear
    return (val > 0) ? 1 : 2; // clock or counterclock wise
}

// Function to check if point q lies on line segment 'pr'
const onSegment =(p: Point2D, q: Point2D, r: Point2D): boolean  =>{
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

// Function to check if line segment 'p1q1' and 'p2q2' intersect
export const segmentsIntersect =(p1: Point2D, q1: Point2D, p2: Point2D, q2: Point2D): boolean => {
    // Find the four orientations needed for general and special cases
    const o1 = l_orientation(p1, q1, p2);
    const o2 = l_orientation(p1, q1, q2);
    const o3 = l_orientation(p2, q2, p1);
    const o4 = l_orientation(p2, q2, q1);

    // General case
    if (o1 !== o2 && o3 !== o4) return true;

    // Special cases
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and q2 are collinear and q2 lies on segment p1q1
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are collinear and p1 lies on segment p2q2
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are collinear and q1 lies on segment p2q2
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;

    // Doesn't fall in any of the above cases
    return false;
}

export const segmentIntersectsWithRect =(segment: Point2D[], rect:{x: number, y: number, w: number, h: number}) => {
   return segmentsIntersect(segment[0], segment[1], {x: rect.x, y: rect.y}, {x: rect.x, y: rect.y + rect.h} ) ||
       segmentsIntersect(segment[0], segment[1], {x: rect.x, y: rect.y}, {x: rect.x + rect.w, y: rect.y} ) ||
       segmentsIntersect(segment[0], segment[1], {x: rect.x + rect.w, y: rect.y}, {x: rect.x + rect.w, y: rect.y + rect.h} ) ||
       segmentsIntersect(segment[0], segment[1], {x: rect.x, y: rect.y + rect.h}, {x: rect.x + rect.w, y: rect.y + rect.h} )
}