import assert from 'assert';
import menu from './menu.js';
import {JSDOM} from 'jsdom';

function make_menu()
{
    const dom = new JSDOM('<ul id="main"><li id="file">File<ul id="file_submenu"><li id="open">Open</li><li id="save">Save</li></ul></li><li id="help">Help</li></ul><div id="outside"></div>');
    global.window = dom.window;
    global.document = dom.window.document;
    for (const id of ['file', 'file_submenu', 'help']) {
        const r = {left: 0, top: 0, right: 60, bottom: 20};
        document.getElementById(id).getBoundingClientRect = () => ({...r, width: 60, height: 20});
    }
    return document.getElementById('main');
}

function fire(elem, type)
{
    elem.dispatchEvent(new window.MouseEvent(type, {bubbles: true}));
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

    it('should ignore hovers until the menu was clicked', function () {
        const main = make_menu();
        const inst = menu(main);
        const file = document.getElementById('file');

        fire(file, 'mouseover');
        assert.strictEqual(file.classList.contains('open'), false);
        inst.end();
    });

});
