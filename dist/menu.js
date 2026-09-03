(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["menu"] = factory();
	else
		root["menu"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	const __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/menu.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function menu(elem) {
  var ctx = {};
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
  var listeners = {
    click: function click(event) {
      ctx.event = event;
      if (ctx.elem.contains(event.target)) {
        ctx.item = menu_int(event, ctx.stack);
        if (ctx.item) {
          ctx.click(ctx);
        }
      }
    },
    mouseover: function mouseover(event) {
      ctx.event = event;
      if (ctx.elem.contains(event.target)) {
        menu_int(event, ctx.stack);
      }
    },
    mousedown: function mousedown(event) {
      ctx.event = event;
      if (!ctx.elem.contains(event.target)) {
        menu_int(null, ctx.stack);
      }
    }
  };
  for (var _i = 0, _Object$keys = Object.keys(listeners); _i < _Object$keys.length; _i++) {
    var type = _Object$keys[_i];
    document.addEventListener(type, listeners[type]);
  }
  ctx.inst = {
    end: end,
    hide: hide
  };
  return ctx.inst;
  function end() {
    for (var _i2 = 0, _Object$keys2 = Object.keys(listeners); _i2 < _Object$keys2.length; _i2++) {
      var _type = _Object$keys2[_i2];
      document.removeEventListener(_type, listeners[_type]);
    }
  }
  function hide() {
    ctx.is_open = false;
    menu_int(null, ctx.stack);
  }
}
function menu_int(event, stack, move) {
  // Special case meaning "close it, we are finished"
  if (event === null) {
    while (stack.length > 1) {
      var top = stack.pop();
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
  var stack_length_orig = stack.length;
  var is_special = false;
  var special_label = null;

  // 1. determine element with label
  // 2. determine submenu
  // -----------
  // 1. click on item: return item
  // 2. click on submenu: toggle submenu
  var label = event.target.closest('li');
  if (label) {
    // XXX hack
    if (stack.length == 0) {
      stack.push(null);
    }
    while (stack.length > 1) {
      var _top = stack.pop();
      _top.label.classList.remove('hover');
      if (!_top.submenu) {
        is_special = true;
      }
      if (!special_label) {
        special_label = _top.label;
      }
      if (_top.submenu && _top.submenu.contains(label)) {
        stack.push(_top);
        break;
      }
      _top.label.classList.remove('open');
      submenu_hide(_top.submenu);
    }
    if (event.type == 'click' && stack_length_orig > stack.length + is_special) {
      // Clicking on opened top menu means "close menu and exit"
      if (stack.length == 1) {
        stack.pop();
      } else if (special_label) {
        special_label.classList.add('hover');
      }
      return null;
    }
    var submenu = Array.from(label.children).find(function (v) {
      return v.tagName === 'UL';
    });
    if (submenu) {
      if (move) {
        move(label, submenu);
      } else {
        var _label$getBoundingCli = label.getBoundingClientRect(),
          _top2 = _label$getBoundingCli.top,
          left = _label$getBoundingCli.left,
          right = _label$getBoundingCli.right,
          bottom = _label$getBoundingCli.bottom;
        if (stack.length <= 1) {
          submenu_show(submenu, left, bottom);
        } else {
          submenu_show(submenu, right, _top2);
        }
      }
      label.classList.add('open', 'hover');
      stack.push({
        label: label,
        submenu: submenu
      });
      return null;
    } else {
      stack.push({
        label: label,
        submenu: null
      });
      label.classList.add('hover');
    }
    return label;
  }
}
function submenu_show(submenu, left, top) {
  submenu.style.display = 'block';
  submenu.style.left = "".concat(left, "px");
  submenu.style.top = "".concat(top, "px");
}
function submenu_hide(submenu) {
  if (submenu) {
    submenu.style.display = 'none';
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (menu);
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});