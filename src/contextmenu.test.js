import assert from 'assert';
import contextmenu from './contextmenu.js';
import {JSDOM} from 'jsdom';

// A context menu with two rows that open submenus: the first submenu is long
// and its lower part hangs below the second row, so a pointer heading from
// the first row to the bottom of its submenu crosses the second row.
//
//   +------------+ +-----------------+
//   | file       |>| new             |
//   +------------+ | open            |
//   | edit       |>| save            |
//   +------------+ | export          |
//                  +-----------------+
function make_menu()
{
    const dom = new JSDOM('<ul id="menu"><li id="file">File<ul id="file_submenu"><li>New</li><li>Open</li><li>Save</li><li>Export</li></ul></li><li id="edit">Edit<ul id="edit_submenu"><li>Undo</li><li>Redo</li></ul></li></ul>');
    global.window = dom.window;
    global.document = dom.window.document;
    const rects = {
        file: {left: 0, top: 0, right: 100, bottom: 20},
        file_submenu: {left: 100, top: 0, right: 250, bottom: 80},
        edit: {left: 0, top: 20, right: 100, bottom: 40},
        edit_submenu: {left: 100, top: 20, right: 250, bottom: 60},
    };
    for (const id of Object.keys(rects)) {
        const r = rects[id];
        document.getElementById(id).getBoundingClientRect = () => ({...r, width: r.right - r.left, height: r.bottom - r.top});
    }
    return document.getElementById('menu');
}

function mousemove(elem, x, y)
{
    elem.dispatchEvent(new window.MouseEvent('mousemove', {bubbles: true, clientX: x, clientY: y}));
}

function mouseover(elem, x, y)
{
    mousemove(elem, x, y);
    elem.dispatchEvent(new window.MouseEvent('mouseover', {bubbles: true, clientX: x, clientY: y}));
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('contextmenu', function () {

    it('should return after contextmenu was closed');

    it('should keep a submenu open while the pointer heads for it across the next row', async function () {
        const menu = make_menu();
        const inst = contextmenu(menu, 0, 0, {grace_ms: 40});
        const file = document.getElementById('file');
        const edit = document.getElementById('edit');

        mouseover(file, 50, 10);
        assert.strictEqual(file.classList.contains('open'), true);

        // Down and to the right, towards the bottom of the long submenu
        mousemove(file, 60, 14);
        mouseover(edit, 80, 30);
        assert.strictEqual(file.classList.contains('open'), true, 'the first submenu stays open');
        assert.strictEqual(edit.classList.contains('open'), false, 'the row on the way does not take over');

        // The pointer arrives in the submenu before the grace passes
        const save = document.getElementById('file_submenu').children[2];
        mouseover(save, 150, 50);
        await sleep(60);
        assert.strictEqual(file.classList.contains('open'), true);
        assert.strictEqual(edit.classList.contains('open'), false);
        inst.end();
    });

    it('should let a row take the submenu over once the pointer stays on it', async function () {
        const menu = make_menu();
        const inst = contextmenu(menu, 0, 0, {grace_ms: 40});
        const file = document.getElementById('file');
        const edit = document.getElementById('edit');

        mouseover(file, 50, 10);
        mousemove(file, 60, 14);
        mouseover(edit, 80, 30);
        assert.strictEqual(edit.classList.contains('open'), false);

        await sleep(60);
        assert.strictEqual(file.classList.contains('open'), false, 'the pointer stayed, the row opens its own submenu');
        assert.strictEqual(edit.classList.contains('open'), true);
        inst.end();
    });

    it('should switch at once when the pointer moves away from the submenu', function () {
        const menu = make_menu();
        const inst = contextmenu(menu, 0, 0, {grace_ms: 40});
        const file = document.getElementById('file');
        const edit = document.getElementById('edit');

        mouseover(file, 50, 10);
        // Straight down, along the left edge — not towards the submenu
        mousemove(file, 10, 14);
        mouseover(edit, 10, 30);
        assert.strictEqual(file.classList.contains('open'), false);
        assert.strictEqual(edit.classList.contains('open'), true);
        inst.end();
    });

});
