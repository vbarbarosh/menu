import assert from 'assert';
import menu from './menu.js';
import {JSDOM} from 'jsdom';

// A bar with a View menu whose Tool Windows row opens a long submenu to the
// right; its lower part hangs below the Appearance row.
//
//   | View |
//   +--------------+ +-----------------+
//   | tool windows |>| commit          |
//   +--------------+ | project         |
//   | appearance   |>| terminal        |
//   +--------------+ +-----------------+
function make_menu()
{
    const dom = new JSDOM('<ul id="main"><li id="file">File<ul id="file_submenu"><li id="open">Open</li><li id="save">Save</li></ul></li><li id="view">View<ul id="view_submenu"><li id="tool_windows">Tool Windows<ul id="tool_windows_submenu"><li>Commit</li><li>Project</li><li id="terminal">Terminal</li></ul></li><li id="appearance">Appearance<ul id="appearance_submenu"><li>Full Screen</li></ul></li></ul></li><li id="help">Help</li></ul><div id="outside"></div>');
    global.window = dom.window;
    global.document = dom.window.document;
    const rects = {
        file: {left: 0, top: 0, right: 60, bottom: 20},
        file_submenu: {left: 0, top: 20, right: 150, bottom: 80},
        view: {left: 60, top: 0, right: 120, bottom: 20},
        view_submenu: {left: 60, top: 20, right: 210, bottom: 80},
        tool_windows: {left: 60, top: 20, right: 210, bottom: 40},
        tool_windows_submenu: {left: 210, top: 20, right: 360, bottom: 120},
        appearance: {left: 60, top: 40, right: 210, bottom: 60},
        appearance_submenu: {left: 210, top: 40, right: 360, bottom: 60},
        help: {left: 120, top: 0, right: 180, bottom: 20},
    };
    for (const id of Object.keys(rects)) {
        const r = rects[id];
        document.getElementById(id).getBoundingClientRect = () => ({...r, width: r.right - r.left, height: r.bottom - r.top});
    }
    return document.getElementById('main');
}

function fire(elem, type, x = 0, y = 0)
{
    elem.dispatchEvent(new window.MouseEvent(type, {bubbles: true, clientX: x, clientY: y}));
}

function hover(elem, x, y)
{
    fire(elem, 'mousemove', x, y);
    fire(elem, 'mouseover', x, y);
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('menu', function () {

    it('should open a submenu on click and close it on a click outside', function () {
        const main = make_menu();
        const inst = menu(main);
        const file = document.getElementById('file');
        const submenu = document.getElementById('file_submenu');

        fire(file, 'click');
        assert.strictEqual(file.classList.contains('open'), true);
        assert.strictEqual(submenu.style.display, 'block');
        assert.strictEqual(submenu.style.top, '20px');

        fire(document.getElementById('outside'), 'mousedown');
        assert.strictEqual(file.classList.contains('open'), false);
        assert.strictEqual(submenu.style.display, 'none');
        inst.end();
    });

    it('should close the menu after an item was clicked', function () {
        const main = make_menu();
        const inst = menu(main);
        const file = document.getElementById('file');
        const submenu = document.getElementById('file_submenu');

        fire(file, 'click');
        fire(document.getElementById('open'), 'click');
        assert.strictEqual(file.classList.contains('open'), false);
        assert.strictEqual(submenu.style.display, 'none');
        inst.end();
    });

    it('should keep a submenu open while the pointer heads for it across the next row', async function () {
        const main = make_menu();
        const inst = menu(main, {grace_ms: 40});
        const tool_windows = document.getElementById('tool_windows');
        const appearance = document.getElementById('appearance');

        fire(document.getElementById('view'), 'click', 90, 10);
        hover(tool_windows, 150, 30);
        assert.strictEqual(tool_windows.classList.contains('open'), true);

        // Down and to the right, towards the bottom of the long submenu
        fire(tool_windows, 'mousemove', 170, 36);
        hover(appearance, 195, 50);
        assert.strictEqual(tool_windows.classList.contains('open'), true, 'the submenu stays open');
        assert.strictEqual(appearance.classList.contains('open'), false, 'the row on the way waits');

        hover(document.getElementById('terminal'), 260, 110);
        await sleep(60);
        assert.strictEqual(tool_windows.classList.contains('open'), true);
        assert.strictEqual(appearance.classList.contains('open'), false);
        inst.end();
    });

    it('should let a row take the submenu over once the pointer stays on it', async function () {
        const main = make_menu();
        const inst = menu(main, {grace_ms: 40});
        const tool_windows = document.getElementById('tool_windows');
        const appearance = document.getElementById('appearance');

        fire(document.getElementById('view'), 'click', 90, 10);
        hover(tool_windows, 150, 30);
        fire(tool_windows, 'mousemove', 170, 36);
        hover(appearance, 195, 50);
        assert.strictEqual(appearance.classList.contains('open'), false);

        await sleep(60);
        assert.strictEqual(tool_windows.classList.contains('open'), false);
        assert.strictEqual(appearance.classList.contains('open'), true);
        inst.end();
    });

    it('should ignore hovers until the menu was clicked', function () {
        const main = make_menu();
        const inst = menu(main);
        const file = document.getElementById('file');

        fire(file, 'mouseover');
        assert.strictEqual(file.classList.contains('open'), false);
        inst.end();
    });

});
