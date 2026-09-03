function menu(elem)
{
    const ctx = {};
    ctx.elem = elem;
    ctx.inst = null;
    ctx.event = null;
    ctx.is_open = false;
    ctx.stack = [];
    ctx.click = typeof ctx.click == 'function' ? ctx.click : function () {
        if (!ctx.event.target.closest('[data-menu-keepalive]')) {
            hide();
        }
    };

    const listeners = {
        click: function (event) {
            ctx.event = event;
            if (ctx.elem.contains(event.target)) {
                ctx.item = menu_int(event, ctx.stack);
                if (ctx.item) {
                    ctx.click(ctx);
                }
            }
        },
        mouseover: function (event) {
            ctx.event = event;
            if (ctx.elem.contains(event.target)) {
                menu_int(event, ctx.stack);
            }
        },
        mousedown: function (event) {
            ctx.event = event;
            if (!ctx.elem.contains(event.target)) {
                menu_int(null, ctx.stack);
            }
        },
    };
    for (const type of Object.keys(listeners)) {
        document.addEventListener(type, listeners[type]);
    }
    ctx.inst = {end, hide};
    return ctx.inst;
    function end() {
        for (const type of Object.keys(listeners)) {
            document.removeEventListener(type, listeners[type]);
        }
    }
    function hide() {
        ctx.is_open = false;
        menu_int(null, ctx.stack);
    }
}

function menu_int(event, stack, move)
{
    // Special case meaning "close it, we are finished"
    if (event === null) {
        while (stack.length > 1) {
            const top = stack.pop();
            top.label.classList.remove('open', 'hover');
            submenu_hide(top.submenu);
        }
        stack.pop();
        return null;
    }

    // Ignore until menu was clicked
    if (stack.length == 0 && event.type != 'click') {
        return null;
    }

    let stack_length_orig = stack.length;
    let is_special = false;
    let special_label = null;

    // 1. determine element with label
    // 2. determine submenu
    // -----------
    // 1. click on item: return item
    // 2. click on submenu: toggle submenu
    const label = event.target.closest('li');
    if (label) {
        // XXX hack
        if (stack.length == 0) {
            stack.push(null);
        }
        while (stack.length > 1) {
            const top = stack.pop();
            top.label.classList.remove('hover');
            if (!top.submenu) {
                is_special = true;
            }
            if (!special_label) {
                special_label = top.label;
            }
            if (top.submenu && top.submenu.contains(label)) {
                stack.push(top);
                break;
            }
            top.label.classList.remove('open');
            submenu_hide(top.submenu);
        }
        if (event.type == 'click' && stack_length_orig > stack.length + is_special) {
            // Clicking on opened top menu means "close menu and exit"
            if (stack.length == 1) {
                stack.pop();
            }
            else if (special_label) {
                special_label.classList.add('hover');
            }
            return null;
        }
        const submenu = Array.from(label.children).find(v => v.tagName === 'UL');
        if (submenu) {
            if (move) {
                move(label, submenu);
            }
            else {
                const {top, left, right, bottom} = label.getBoundingClientRect();
                if (stack.length <= 1) {
                    submenu_show(submenu, left, bottom);
                }
                else {
                    submenu_show(submenu, right, top);
                }
            }
            label.classList.add('open', 'hover');
            stack.push({label, submenu});
            return null;
        }
        else {
            stack.push({label, submenu: null});
            label.classList.add('hover');
        }
        return label;
    }
}

function submenu_show(submenu, left, top)
{
    submenu.style.display = 'block';
    submenu.style.left = `${left}px`;
    submenu.style.top = `${top}px`;
}

function submenu_hide(submenu)
{
    if (submenu) {
        submenu.style.display = 'none';
    }
}

export default menu;
