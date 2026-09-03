// How long a row under the pointer waits before it takes the open submenu
// over, while the pointer is on its way to that submenu.
const GRACE_MS = 300;

// How many recent pointer positions are kept; the oldest is the apex of the
// triangle the pointer is expected to stay in on its way to the submenu.
const POINTER_HISTORY = 3;

function contextmenu(elem, client_x, client_y, options = {})
{
    // 1. Create a backdrop element to intercept mouse events
    // 2. Setup mouse listeners
    // 3. Terminate when mouse button was pressed

    const grace_ms = (options.grace_ms === undefined) ? GRACE_MS : options.grace_ms;
    const pointer_history = [];
    let pending_li = null;
    let pending_timer = null;

    let _resolve, _reject;
    const _promise = new Promise(function (resolve, reject) {
        _resolve = resolve;
        _reject = reject;
    });

    const backdrop = document.body.appendChild(document.createElement('DIV'));
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.right = '0';
    backdrop.style.bottom = '0';
    backdrop.style.zIndex = '10000';
    backdrop.addEventListener('click', backdrop_click);
    backdrop.addEventListener('contextmenu', backdrop_contextmenu);

    Array.from(elem.querySelectorAll('.open')).forEach(v => v.classList.remove('open'));
    elem.style.display = '';
    elem.style.zIndex = '10001';
    elem.addEventListener('click', menu_click);
    elem.addEventListener('mousemove', menu_mousemove);
    elem.addEventListener('mouseover', menu_mouseover);
    elem.addEventListener('contextmenu', menu_contextmenu);
    elem_move_root(elem, client_x, client_y);

    return {end, promise};

    function end(retval) {
        _resolve(retval);
        pending_clear();
        elem.style.display = 'none';
        elem.removeEventListener('click', menu_click);
        elem.removeEventListener('mousemove', menu_mousemove);
        elem.removeEventListener('mouseover', menu_mouseover);
        elem.removeEventListener('contextmenu', menu_contextmenu);
        backdrop.removeEventListener('click', backdrop_click);
        backdrop.removeEventListener('contextmenu', backdrop_contextmenu);
        backdrop.remove();
    }

    function promise() {
        return _promise;
    }

    function menu_click(event) {
        const li = event.target.closest('li');
        if (!li) {
            return;
        }
        // Toggle submenu
        const submenu = Array.from(li.children).find(v => v.tagName == 'UL');
        if (submenu) {
            li.classList.toggle('open');
            return;
        }
        if (li.closest('[data-menu-keepalive]')) {
            return;
        }
        end(li);
    }

    function menu_mousemove(event) {
        pointer_history.push({x: event.clientX, y: event.clientY});
        if (pointer_history.length > POINTER_HISTORY) {
            pointer_history.shift();
        }
    }

    function menu_mouseover(event) {
        const li = event.target.closest('li');
        if (!li) {
            return;
        }
        // A pointer on its way to an open submenu crosses the rows between
        // it and the submenu; those rows wait rather than take the submenu
        // over. The way is the triangle from where the pointer was a few
        // moves ago to the near edge of the submenu.
        const open_sibling = Array.from(li.parentElement.children).find(v => v !== li && v.classList.contains('open'));
        if (open_sibling && is_pointer_heading_to(open_sibling)) {
            pending_set(li);
            return;
        }
        pending_clear();
        open_row(li);
    }

    function open_row(li) {
        // Hide other submenus
        const ancestors = elem_ancestors(li);
        Array.from(elem.querySelectorAll('.open')).filter(v => !ancestors.includes(v)).forEach(v => v.classList.remove('open'));
        // Possibly open new submenu
        const submenu = Array.from(li.children).find(v => v.tagName == 'UL');
        if (submenu) {
            li.classList.add('open');
            const r = li.getBoundingClientRect();
            elem_move_submenu(submenu, r.right, r.top);
        }
    }

    function is_pointer_heading_to(open_li) {
        const submenu = Array.from(open_li.children).find(v => v.tagName == 'UL');
        if (!submenu || pointer_history.length < 2) {
            return false;
        }
        const apex = pointer_history[0];
        const pointer = pointer_history[pointer_history.length - 1];
        const r = submenu.getBoundingClientRect();
        // The near edge is the one facing the row the submenu opened from
        const opened_to_the_right = r.left >= open_li.getBoundingClientRect().right - 1;
        const edge_x = opened_to_the_right ? r.left : r.right;
        return is_point_in_triangle(pointer, apex, {x: edge_x, y: r.top}, {x: edge_x, y: r.bottom});
    }

    // The row waits for the pointer to arrive at the submenu; a pointer that
    // stays on the row past the grace takes the row's own submenu.
    function pending_set(li) {
        if (pending_li === li) {
            return;
        }
        pending_clear();
        pending_li = li;
        pending_timer = setTimeout(pending_expire, grace_ms);
    }

    function pending_clear() {
        clearTimeout(pending_timer);
        pending_li = null;
        pending_timer = null;
    }

    function pending_expire() {
        const li = pending_li;
        pending_clear();
        const pointer = pointer_history[pointer_history.length - 1];
        if (li && pointer && is_point_in_rect(pointer, li.getBoundingClientRect())) {
            open_row(li);
        }
    }

    function menu_contextmenu(event) {
        event.preventDefault();
        menu_mouseover(event);
    }

    function backdrop_click() {
        end(null);
    }

    function backdrop_contextmenu(event) {
        event.preventDefault();
        end(null);
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

function elem_ancestors(elem)
{
    const out = [];
    for (let i = 0, p = (elem && elem.parentElement); p && i < 100; ++i, p = p.parentElement) {
        out.push(p);
    }
    return out;
}

function elem_move_root(elem, client_x, client_y)
{
    const w = elem.offsetWidth;
    const h = elem.offsetHeight;
    const ww = window.innerWidth;
    const hh = window.innerHeight;
    if (client_x + w < ww) {
        elem.style.left = Math.round(client_x) + 'px';
    }
    else {
        elem.style.left = Math.round(Math.max(0, client_x - w)) + 'px';
    }
    if (client_y + h < hh) {
        elem.style.top = Math.round(client_y) + 'px';
    }
    else {
        elem.style.top = Math.round(Math.max(0, client_y - h)) + 'px';
    }
}

function elem_move_submenu(elem, client_x, client_y)
{
    const p = elem.parentElement;
    const p_r = p.getBoundingClientRect();
    const elem_w = elem.offsetWidth;
    const window_w = window.innerWidth;
    if (client_x + elem_w < window_w) {
        elem.style.left = Math.round(client_x) + 'px';
    }
    else {
        elem.style.left = Math.round(Math.max(0, p_r.left - elem_w)) + 'px'
    }
    elem.style.top = Math.round(Math.min(client_y, window.innerHeight - elem.offsetHeight)) + 'px';
}

export default contextmenu;
