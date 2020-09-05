A small js for making menus

## Installation

    npm i @vbarbarosh/menu

## Using from a Browser

    <script src="https://unpkg.com/@vbarbarosh/menu@0.0.1/dist/menu.js"></script>

## Usage in plain JavaScript

    <style>
    #main {
        display: flex;
        flex-direction: row;
        width: 400px;
        margin: auto;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
    }
    ul {
        margin: 0;
        padding: 0;
        background: white;
        min-width: 150px;
        user-select: none;
    }
    ul ul {
        display: none;
        position: fixed;
        border: 1px solid;
    }
    li {
        list-style: none;
        line-height: 1.75em;
        cursor: pointer;
        padding: 0 5px;
    }
    li:empty { height: 1px; background: black; }
    .open { background: #8f8; }
    .hover { background: #88f; }
    </style>

    <ul id="main">
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
