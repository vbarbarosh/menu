var menu =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/menu.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/menu.js":
/*!*********************!*\
  !*** ./src/menu.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);


function menu(elem) {
  var ctx = {};
  ctx.elem = elem;
  ctx.inst = null;
  ctx.event = null;
  ctx.is_open = false;
  ctx.stack = [];
  ctx.click = typeof ctx.click == 'function' ? ctx.click : function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0___default()(ctx.event.target).addBack().closest('[data-menu-keepalive]').length == 0) {
      hide();
    }
  };
  var listeners = {
    click: function click(event) {
      ctx.event = event;

      if (jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.target).addBack().closest(ctx.elem).length > 0) {
        ctx.item = menu_int(event, ctx.stack);

        if (ctx.item) {
          ctx.click(ctx);
        }
      }
    },
    mouseover: function mouseover(event) {
      ctx.event = event;

      if (jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.target).addBack().closest(ctx.elem).length > 0) {
        menu_int(event, ctx.stack);
      }
    },
    mousedown: function mousedown(event) {
      ctx.event = event;

      if (jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.target).addBack().closest(ctx.elem).length == 0) {
        menu_int(null, ctx.stack);
      }
    }
  };
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on(listeners);
  ctx.inst = {
    end: end,
    hide: hide
  };
  return ctx.inst;

  function end() {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).off(listeners);
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
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(top.label).removeClass('open hover');
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(top.submenu).hide();
    }

    stack.pop();
    return null;
  } // Ignore until menu was clicked


  if (stack.length == 0 && event.type != 'click') {
    return null;
  }

  var stack_length_orig = stack.length;
  var is_special = false;
  var special_label = null; // 1. determine element with label
  // 2. determine submenu
  // -----------
  // 1. click on item: return item
  // 2. click on submenu: toggle submenu

  var label = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.target).addBack().closest('li').get(0);

  if (label) {
    // XXX hack
    if (stack.length == 0) {
      stack.push(null);
    }

    while (stack.length > 1) {
      var _top = stack.pop();

      jquery__WEBPACK_IMPORTED_MODULE_0___default()(_top.label).removeClass('hover');

      if (!_top.submenu) {
        is_special = true;
      }

      if (!special_label) {
        special_label = _top.label;
      }

      if (jquery__WEBPACK_IMPORTED_MODULE_0___default()(_top.submenu).find(label).length) {
        stack.push(_top);
        break;
      }

      jquery__WEBPACK_IMPORTED_MODULE_0___default()(_top.label).removeClass('open');
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(_top.submenu).hide();
    }

    if (event.type == 'click' && stack_length_orig > stack.length + is_special) {
      // Clicking on opened top menu means "close menu and exit"
      if (stack.length == 1) {
        stack.pop();
      } else {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(special_label).addClass('hover');
      }

      return null;
    }

    var submenu = jquery__WEBPACK_IMPORTED_MODULE_0___default()(label).children('ul').get(0);

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
          jquery__WEBPACK_IMPORTED_MODULE_0___default()(submenu).show().css({
            top: bottom,
            left: left
          });
        } else {
          jquery__WEBPACK_IMPORTED_MODULE_0___default()(submenu).show().css({
            top: _top2,
            left: right
          });
        }
      }

      jquery__WEBPACK_IMPORTED_MODULE_0___default()(label).addClass('open hover');
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
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(label).addClass('hover');
    }

    return label;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (menu);

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })

/******/ })["default"];