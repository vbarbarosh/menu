// A pointer on its way to an open submenu crosses the rows between it and
// the submenu; those rows should wait rather than take the submenu over. The
// way is the triangle from where the pointer was a few moves ago to the near
// edge of the submenu. A row the pointer stays on past the grace opens.

// How long a row under the pointer waits before it takes the open submenu over
const GRACE_MS = 300;

// How many recent pointer positions are kept; the oldest is the triangle's apex
const HISTORY = 3;

function pointer_path(options = {})
{
    const grace_ms = (options.grace_ms === undefined) ? GRACE_MS : options.grace_ms;
    const history = [];
    let pending_li = null;
    let pending_open = null;
    let pending_timer = null;

    return {mousemove, is_heading_to, pending_set, pending_clear};

    function mousemove(event) {
        history.push({x: event.clientX, y: event.clientY});
        if (history.length > HISTORY) {
            history.shift();
        }
    }

    // Whether the pointer is inside the triangle towards the submenu of `open_li`
    function is_heading_to(open_li) {
        const submenu = Array.from(open_li.children).find(v => v.tagName == 'UL');
        if (!submenu || history.length < 2) {
            return false;
        }
        const apex = history[0];
        const pointer = history[history.length - 1];
        const r = submenu.getBoundingClientRect();
        // The near edge is the one facing the row the submenu opened from
        const opened_to_the_right = r.left >= open_li.getBoundingClientRect().right - 1;
        const edge_x = opened_to_the_right ? r.left : r.right;
        return is_point_in_triangle(pointer, apex, {x: edge_x, y: r.top}, {x: edge_x, y: r.bottom});
    }

    // `open(li)` runs after the grace if the pointer is still on `li`
    function pending_set(li, open) {
        if (pending_li === li) {
            return;
        }
        pending_clear();
        pending_li = li;
        pending_open = open;
        pending_timer = setTimeout(pending_expire, grace_ms);
    }

    function pending_clear() {
        clearTimeout(pending_timer);
        pending_li = null;
        pending_open = null;
        pending_timer = null;
    }

    function pending_expire() {
        const li = pending_li;
        const open = pending_open;
        pending_clear();
        const pointer = history[history.length - 1];
        if (li && pointer && is_point_in_rect(pointer, li.getBoundingClientRect())) {
            open(li);
        }
    }
}

function is_point_in_rect(p, r)
{
    return p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;
}

// https://en.wikipedia.org/wiki/Barycentric_coordinate_system — the point
// is inside when it lies on the same side of all three edges
function is_point_in_triangle(p, a, b, c)
{
    const d1 = sign(p, a, b);
    const d2 = sign(p, b, c);
    const d3 = sign(p, c, a);
    const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(has_neg && has_pos);
}

function sign(p1, p2, p3)
{
    return (p1.x - p3.x)*(p2.y - p3.y) - (p2.x - p3.x)*(p1.y - p3.y);
}

export default pointer_path;
