function contextmenu(menu, client_x, client_y)
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

    Array.from(menu.querySelectorAll('.open')).forEach(v => v.classList.remove('open'));
    menu.style.display = '';
    menu.style.zIndex = '10001';
    menu.addEventListener('click', menu_click);
    menu.addEventListener('mouseover', menu_mouseover);
    menu.addEventListener('contextmenu', menu_contextmenu);
    elem_move_root(menu, client_x, client_y);

    return {end, promise};

    function end(retval) {
        _resolve(retval);
        menu.style.display = 'none';
        menu.removeEventListener('click', menu_click);
        menu.removeEventListener('mouseover', menu_mouseover);
        menu.removeEventListener('contextmenu', menu_contextmenu);
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
        Array.from(menu.querySelectorAll('.open')).filter(v => !ancestors.includes(v)).forEach(v => v.classList.remove('open'));
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

export default contextmenu;
