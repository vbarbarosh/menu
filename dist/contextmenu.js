(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["contextmenu"] = factory();
	else
		root["contextmenu"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/pointer_path.js"
/*!*****************************!*\
  !*** ./src/pointer_path.js ***!
  \*****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// A pointer on its way to an open submenu crosses the rows between it and
// the submenu; those rows should wait rather than take the submenu over. The
// way is the triangle from where the pointer was a few moves ago to the near
// edge of the submenu. A row the pointer stays on past the grace opens.

// How long a row under the pointer waits before it takes the open submenu over
var GRACE_MS = 300;

// How many recent pointer positions are kept; the oldest is the triangle's apex
var HISTORY = 3;
function pointer_path() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var grace_ms = options.grace_ms === undefined ? GRACE_MS : options.grace_ms;
  var history = [];
  var pending_li = null;
  var pending_open = null;
  var pending_timer = null;
  return {
    mousemove: mousemove,
    is_heading_to: is_heading_to,
    pending_set: pending_set,
    pending_clear: pending_clear
  };
  function mousemove(event) {
    history.push({
      x: event.clientX,
      y: event.clientY
    });
    if (history.length > HISTORY) {
      history.shift();
    }
  }

  // Whether the pointer is inside the triangle towards the submenu of `open_li`
  function is_heading_to(open_li) {
    var submenu = Array.from(open_li.children).find(function (v) {
      return v.tagName == 'UL';
    });
    if (!submenu || history.length < 2) {
      return false;
    }
    var apex = history[0];
    var pointer = history[history.length - 1];
    var r = submenu.getBoundingClientRect();
    // The near edge is the one facing the row the submenu opened from
    var opened_to_the_right = r.left >= open_li.getBoundingClientRect().right - 1;
    var edge_x = opened_to_the_right ? r.left : r.right;
    return is_point_in_triangle(pointer, apex, {
      x: edge_x,
      y: r.top
    }, {
      x: edge_x,
      y: r.bottom
    });
  }

  // `open(li)` runs after the grace if the pointer is still on `li`
  function pending_set(li, open) {
    if (pending_li === li) {
      return;
    }
    pending_clear();
    pending_li = li;
    pending_open = open;
    pending_timer = setTimeout(pending_expire, grace_ms);
  }
  function pending_clear() {
    clearTimeout(pending_timer);
    pending_li = null;
    pending_open = null;
    pending_timer = null;
  }
  function pending_expire() {
    var li = pending_li;
    var open = pending_open;
    pending_clear();
    var pointer = history[history.length - 1];
    if (li && pointer && is_point_in_rect(pointer, li.getBoundingClientRect())) {
      open(li);
    }
  }
}
function is_point_in_rect(p, r) {
  return p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;
}

// https://en.wikipedia.org/wiki/Barycentric_coordinate_system — the point
// is inside when it lies on the same side of all three edges
function is_point_in_triangle(p, a, b, c) {
  var d1 = sign(p, a, b);
  var d2 = sign(p, b, c);
  var d3 = sign(p, c, a);
  var has_neg = d1 < 0 || d2 < 0 || d3 < 0;
  var has_pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(has_neg && has_pos);
}
function sign(p1, p2, p3) {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pointer_path);

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/contextmenu.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pointer_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pointer_path.js */ "./src/pointer_path.js");

function contextmenu(elem, client_x, client_y) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  // 1. Create a backdrop element to intercept mouse events
  // 2. Setup mouse listeners
  // 3. Terminate when mouse button was pressed

  var path = (0,_pointer_path_js__WEBPACK_IMPORTED_MODULE_0__["default"])(options);
  var _resolve, _reject;
  var _promise = new Promise(function (resolve, reject) {
    _resolve = resolve;
    _reject = reject;
  });
  var backdrop = document.body.appendChild(document.createElement('DIV'));
  backdrop.style.position = 'fixed';
  backdrop.style.top = '0';
  backdrop.style.left = '0';
  backdrop.style.right = '0';
  backdrop.style.bottom = '0';
  backdrop.style.zIndex = '10000';
  backdrop.addEventListener('click', backdrop_click);
  backdrop.addEventListener('contextmenu', backdrop_contextmenu);
  Array.from(elem.querySelectorAll('.open')).forEach(function (v) {
    return v.classList.remove('open');
  });
  elem.style.display = '';
  elem.style.zIndex = '10001';
  elem.addEventListener('click', menu_click);
  elem.addEventListener('mousemove', menu_mousemove);
  elem.addEventListener('mouseover', menu_mouseover);
  elem.addEventListener('contextmenu', menu_contextmenu);
  elem_move_root(elem, client_x, client_y);
  return {
    end: end,
    promise: promise
  };
  function end(retval) {
    _resolve(retval);
    path.pending_clear();
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
    var li = event.target.closest('li');
    if (!li) {
      return;
    }
    // Toggle submenu
    var submenu = Array.from(li.children).find(function (v) {
      return v.tagName == 'UL';
    });
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
    path.mousemove(event);
  }
  function menu_mouseover(event) {
    var li = event.target.closest('li');
    if (!li) {
      return;
    }
    // A row on the pointer's way to an open submenu waits, see pointer_path
    var open_sibling = Array.from(li.parentElement.children).find(function (v) {
      return v !== li && v.classList.contains('open');
    });
    if (open_sibling && path.is_heading_to(open_sibling)) {
      path.pending_set(li, open_row);
      return;
    }
    path.pending_clear();
    open_row(li);
  }
  function open_row(li) {
    // Hide other submenus
    var ancestors = elem_ancestors(li);
    Array.from(elem.querySelectorAll('.open')).filter(function (v) {
      return !ancestors.includes(v);
    }).forEach(function (v) {
      return v.classList.remove('open');
    });
    // Possibly open new submenu
    var submenu = Array.from(li.children).find(function (v) {
      return v.tagName == 'UL';
    });
    if (submenu) {
      li.classList.add('open');
      var r = li.getBoundingClientRect();
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
function elem_ancestors(elem) {
  var out = [];
  for (var i = 0, p = elem && elem.parentElement; p && i < 100; ++i, p = p.parentElement) {
    out.push(p);
  }
  return out;
}
function elem_move_root(elem, client_x, client_y) {
  var w = elem.offsetWidth;
  var h = elem.offsetHeight;
  var ww = window.innerWidth;
  var hh = window.innerHeight;
  if (client_x + w < ww) {
    elem.style.left = Math.round(client_x) + 'px';
  } else {
    elem.style.left = Math.round(Math.max(0, client_x - w)) + 'px';
  }
  if (client_y + h < hh) {
    elem.style.top = Math.round(client_y) + 'px';
  } else {
    elem.style.top = Math.round(Math.max(0, client_y - h)) + 'px';
  }
}
function elem_move_submenu(elem, client_x, client_y) {
  var p = elem.parentElement;
  var p_r = p.getBoundingClientRect();
  var elem_w = elem.offsetWidth;
  var window_w = window.innerWidth;
  if (client_x + elem_w < window_w) {
    elem.style.left = Math.round(client_x) + 'px';
  } else {
    elem.style.left = Math.round(Math.max(0, p_r.left - elem_w)) + 'px';
  }
  elem.style.top = Math.round(Math.min(client_y, window.innerHeight - elem.offsetHeight)) + 'px';
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (contextmenu);
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});