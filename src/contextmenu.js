function contextmenu(elem, client_x, client_y)
{
    // 1. Create a backdrop element to intercept mouse events
    // 2. Setup mouse listeners
    // 3. Terminate when mouse button was pressed

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
    backdrop.style.zindex = '10000';
    backdrop.addEventListener('click', backdrop_click);
    backdrop.addEventListener('contextmenu', backdrop_contextmenu);

    Array.from(elem.querySelectorAll('.open')).forEach(v => v.classList.remove('open'));
    elem.style.display = '';
    elem.style.zIndex = '10001';
    elem.addEventListener('click', menu_click);
    elem.addEventListener('mouseover', menu_mouseover);
    elem.addEventListener('contextmenu', menu_contextmenu);
    elem_move_root(elem, client_x, client_y);

    return {end, promise};

    function end(retval) {
        _resolve(retval);
        elem.style.display = 'none';
        elem.removeEventListener('click', menu_click);
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

    function menu_mouseover(event) {
        const li = event.target.closest('li');
        if (!li) {
            return;
        }
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
