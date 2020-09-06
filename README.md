A small js for making menus

## Installation

    npm i @vbarbarosh/menu

## Using from a Browser

    <script src="https://unpkg.com/@vbarbarosh/menu@0.0.1/dist/menu.js"></script>

## Usage in plain JavaScript

    <link href="https://unpkg.com/@vbarbarosh/menu@0.0.1/dist/theme-flat.css" rel="stylesheet">

    <ul id="main" class="menu-flat">
        <li>
            File
            <ul>
                <li data-action="open">Open</li>
                <li data-action="save">Save</li>
                <li></li>
                <li data-action="exit">Exit</li>
            </ul>
        </li>
        <li>
            Edit
            <ul>
                <li data-action="undo">Undo</li>
                <li data-action="redo">Redo</li>
            </ul>
        </li>
        <li data-action="help">Help</li>
    </ul>

    <script src="https://unpkg.com/jquery@3.5.1/dist/jquery.js"></script>
    <script src="https://unpkg.com/@vbarbarosh/menu@0.0.1/dist/menu.js"></script>
    <script>
        menu(document.getElementById('main'))
        document.getElementById('main').addEventListener('click', function (event) {
            if (event.target.dataset.action) {
                console.log('click', event.target.dataset.action);
            }
        });
    </script>
