/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_error";
exports.ids = ["pages/_error"];
exports.modules = {

/***/ "./node_modules/@sentry/webpack-plugin/src/sentry-webpack.module.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@sentry/webpack-plugin/src/sentry-webpack.module.js ***!
  \**************************************************************************/
/***/ (() => {

eval("var _global = (typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}); _global.SENTRY_RELEASE={id:\"development\"};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvQHNlbnRyeS93ZWJwYWNrLXBsdWdpbi9zcmMvc2VudHJ5LXdlYnBhY2subW9kdWxlLmpzLmpzIiwibWFwcGluZ3MiOiJBQUFBLHdJQUF3SSxHQUFHLHdCQUF3QiIsInNvdXJjZXMiOlsid2VicGFjazovL3dvbmthbGFicy54eXovLi9ub2RlX21vZHVsZXMvQHNlbnRyeS93ZWJwYWNrLXBsdWdpbi9zcmMvc2VudHJ5LXdlYnBhY2subW9kdWxlLmpzP2NiMjMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9nbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB7fSk7IF9nbG9iYWwuU0VOVFJZX1JFTEVBU0U9e2lkOlwiZGV2ZWxvcG1lbnRcIn07Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/@sentry/webpack-plugin/src/sentry-webpack.module.js\n");

/***/ }),

/***/ "./pages/_error.js":
/*!*************************!*\
  !*** ./pages/_error.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/error */ \"next/error\");\n/* harmony import */ var next_error__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_error__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/nextjs */ \"@sentry/nextjs\");\n/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst MyError = ({ statusCode , hasGetInitialPropsRun , err  })=>{\n    if (!hasGetInitialPropsRun && err) {\n        // getInitialProps is not called in case of\n        // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass\n        // err via _app.js so it can be captured\n        _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.captureException(err);\n    // Flushing is not required in this case as it only happens on the client\n    }\n    return(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_error__WEBPACK_IMPORTED_MODULE_1___default()), {\n        statusCode: statusCode\n    }, void 0, false, {\n        fileName: \"/Users/zkhalapyan/Desktop/wonka/site/pages/_error.js\",\n        lineNumber: 14,\n        columnNumber: 10\n    }, undefined));\n};\nMyError.getInitialProps = async (context)=>{\n    const errorInitialProps = await next_error__WEBPACK_IMPORTED_MODULE_1___default().getInitialProps(context);\n    const { res , err , asPath  } = context;\n    // Workaround for https://github.com/vercel/next.js/issues/8592, mark when\n    // getInitialProps has run\n    errorInitialProps.hasGetInitialPropsRun = true;\n    // Returning early because we don't want to log 404 errors to Sentry.\n    if (res?.statusCode === 404) {\n        return errorInitialProps;\n    }\n    // Running on the server, the response object (`res`) is available.\n    //\n    // Next.js will pass an err on the server if a page's data fetching methods\n    // threw or returned a Promise that rejected\n    //\n    // Running on the client (browser), Next.js will provide an err if:\n    //\n    //  - a page's `getInitialProps` threw or returned a Promise that rejected\n    //  - an exception was thrown somewhere in the React lifecycle (render,\n    //    componentDidMount, etc) that was caught by Next.js's React Error\n    //    Boundary. Read more about what types of exceptions are caught by Error\n    //    Boundaries: https://reactjs.org/docs/error-boundaries.html\n    if (err) {\n        _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.captureException(err);\n        // Flushing before returning is necessary if deploying to Vercel, see\n        // https://vercel.com/docs/platform/limits#streaming-responses\n        await _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.flush(2000);\n        return errorInitialProps;\n    }\n    // If this point is reached, getInitialProps was called without any\n    // information about what the error might be. This is unexpected and may\n    // indicate a bug introduced in Next.js, so record it in Sentry\n    _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.captureException(new Error(`_error.js getInitialProps missing data at path: ${asPath}`));\n    await _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.flush(2000);\n    return errorInitialProps;\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyError);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fZXJyb3IuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBMkM7QUFFSDtBQUV4QyxLQUFLLENBQUNFLE9BQU8sSUFBSSxDQUFDLENBQUNDLFVBQVUsR0FBRUMscUJBQXFCLEdBQUVDLEdBQUcsRUFBQyxDQUFDLEdBQUssQ0FBQztJQUMvRCxFQUFFLEdBQUdELHFCQUFxQixJQUFJQyxHQUFHLEVBQUUsQ0FBQztRQUNsQyxFQUEyQztRQUMzQyxFQUEwRTtRQUMxRSxFQUF3QztRQUN4Q0osNERBQXVCLENBQUNJLEdBQUc7SUFDM0IsRUFBeUU7SUFDM0UsQ0FBQztJQUVELE1BQU0sNkVBQUVMLG1EQUFrQjtRQUFDRyxVQUFVLEVBQUVBLFVBQVU7Ozs7OztBQUNuRCxDQUFDO0FBRURELE9BQU8sQ0FBQ0ssZUFBZSxVQUFVQyxPQUFPLEdBQUssQ0FBQztJQUM1QyxLQUFLLENBQUNDLGlCQUFpQixHQUFHLEtBQUssQ0FBQ1QsaUVBQWtDLENBQUNRLE9BQU87SUFFMUUsS0FBSyxDQUFDLENBQUMsQ0FBQ0UsR0FBRyxHQUFFTCxHQUFHLEdBQUVNLE1BQU0sRUFBQyxDQUFDLEdBQUdILE9BQU87SUFFcEMsRUFBMEU7SUFDMUUsRUFBMEI7SUFDMUJDLGlCQUFpQixDQUFDTCxxQkFBcUIsR0FBRyxJQUFJO0lBRTlDLEVBQXFFO0lBQ3JFLEVBQUUsRUFBRU0sR0FBRyxFQUFFUCxVQUFVLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDNUIsTUFBTSxDQUFDTSxpQkFBaUI7SUFDMUIsQ0FBQztJQUVELEVBQW1FO0lBQ25FLEVBQUU7SUFDRixFQUEyRTtJQUMzRSxFQUE0QztJQUM1QyxFQUFFO0lBQ0YsRUFBbUU7SUFDbkUsRUFBRTtJQUNGLEVBQTBFO0lBQzFFLEVBQXVFO0lBQ3ZFLEVBQXNFO0lBQ3RFLEVBQTRFO0lBQzVFLEVBQWdFO0lBRWhFLEVBQUUsRUFBRUosR0FBRyxFQUFFLENBQUM7UUFDUkosNERBQXVCLENBQUNJLEdBQUc7UUFFM0IsRUFBcUU7UUFDckUsRUFBOEQ7UUFDOUQsS0FBSyxDQUFDSixpREFBWSxDQUFDLElBQUk7UUFFdkIsTUFBTSxDQUFDUSxpQkFBaUI7SUFDMUIsQ0FBQztJQUVELEVBQW1FO0lBQ25FLEVBQXdFO0lBQ3hFLEVBQStEO0lBQy9EUiw0REFBdUIsQ0FDckIsR0FBRyxDQUFDWSxLQUFLLEVBQUUsZ0RBQWdELEVBQUVGLE1BQU07SUFFckUsS0FBSyxDQUFDVixpREFBWSxDQUFDLElBQUk7SUFFdkIsTUFBTSxDQUFDUSxpQkFBaUI7QUFDMUIsQ0FBQztBQUVELGlFQUFlUCxPQUFPLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93b25rYWxhYnMueHl6Ly4vcGFnZXMvX2Vycm9yLmpzPzIwMTAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE5leHRFcnJvckNvbXBvbmVudCBmcm9tICduZXh0L2Vycm9yJztcblxuaW1wb3J0ICogYXMgU2VudHJ5IGZyb20gJ0BzZW50cnkvbmV4dGpzJztcblxuY29uc3QgTXlFcnJvciA9ICh7IHN0YXR1c0NvZGUsIGhhc0dldEluaXRpYWxQcm9wc1J1biwgZXJyIH0pID0+IHtcbiAgaWYgKCFoYXNHZXRJbml0aWFsUHJvcHNSdW4gJiYgZXJyKSB7XG4gICAgLy8gZ2V0SW5pdGlhbFByb3BzIGlzIG5vdCBjYWxsZWQgaW4gY2FzZSBvZlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92ZXJjZWwvbmV4dC5qcy9pc3N1ZXMvODU5Mi4gQXMgYSB3b3JrYXJvdW5kLCB3ZSBwYXNzXG4gICAgLy8gZXJyIHZpYSBfYXBwLmpzIHNvIGl0IGNhbiBiZSBjYXB0dXJlZFxuICAgIFNlbnRyeS5jYXB0dXJlRXhjZXB0aW9uKGVycik7XG4gICAgLy8gRmx1c2hpbmcgaXMgbm90IHJlcXVpcmVkIGluIHRoaXMgY2FzZSBhcyBpdCBvbmx5IGhhcHBlbnMgb24gdGhlIGNsaWVudFxuICB9XG5cbiAgcmV0dXJuIDxOZXh0RXJyb3JDb21wb25lbnQgc3RhdHVzQ29kZT17c3RhdHVzQ29kZX0gLz47XG59O1xuXG5NeUVycm9yLmdldEluaXRpYWxQcm9wcyA9IGFzeW5jIChjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGVycm9ySW5pdGlhbFByb3BzID0gYXdhaXQgTmV4dEVycm9yQ29tcG9uZW50LmdldEluaXRpYWxQcm9wcyhjb250ZXh0KTtcbiAgXG4gIGNvbnN0IHsgcmVzLCBlcnIsIGFzUGF0aCB9ID0gY29udGV4dDtcblxuICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vdmVyY2VsL25leHQuanMvaXNzdWVzLzg1OTIsIG1hcmsgd2hlblxuICAvLyBnZXRJbml0aWFsUHJvcHMgaGFzIHJ1blxuICBlcnJvckluaXRpYWxQcm9wcy5oYXNHZXRJbml0aWFsUHJvcHNSdW4gPSB0cnVlO1xuXG4gIC8vIFJldHVybmluZyBlYXJseSBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gbG9nIDQwNCBlcnJvcnMgdG8gU2VudHJ5LlxuICBpZiAocmVzPy5zdGF0dXNDb2RlID09PSA0MDQpIHtcbiAgICByZXR1cm4gZXJyb3JJbml0aWFsUHJvcHM7XG4gIH1cbiAgXG4gIC8vIFJ1bm5pbmcgb24gdGhlIHNlcnZlciwgdGhlIHJlc3BvbnNlIG9iamVjdCAoYHJlc2ApIGlzIGF2YWlsYWJsZS5cbiAgLy9cbiAgLy8gTmV4dC5qcyB3aWxsIHBhc3MgYW4gZXJyIG9uIHRoZSBzZXJ2ZXIgaWYgYSBwYWdlJ3MgZGF0YSBmZXRjaGluZyBtZXRob2RzXG4gIC8vIHRocmV3IG9yIHJldHVybmVkIGEgUHJvbWlzZSB0aGF0IHJlamVjdGVkXG4gIC8vXG4gIC8vIFJ1bm5pbmcgb24gdGhlIGNsaWVudCAoYnJvd3NlciksIE5leHQuanMgd2lsbCBwcm92aWRlIGFuIGVyciBpZjpcbiAgLy9cbiAgLy8gIC0gYSBwYWdlJ3MgYGdldEluaXRpYWxQcm9wc2AgdGhyZXcgb3IgcmV0dXJuZWQgYSBQcm9taXNlIHRoYXQgcmVqZWN0ZWRcbiAgLy8gIC0gYW4gZXhjZXB0aW9uIHdhcyB0aHJvd24gc29tZXdoZXJlIGluIHRoZSBSZWFjdCBsaWZlY3ljbGUgKHJlbmRlcixcbiAgLy8gICAgY29tcG9uZW50RGlkTW91bnQsIGV0YykgdGhhdCB3YXMgY2F1Z2h0IGJ5IE5leHQuanMncyBSZWFjdCBFcnJvclxuICAvLyAgICBCb3VuZGFyeS4gUmVhZCBtb3JlIGFib3V0IHdoYXQgdHlwZXMgb2YgZXhjZXB0aW9ucyBhcmUgY2F1Z2h0IGJ5IEVycm9yXG4gIC8vICAgIEJvdW5kYXJpZXM6IGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9lcnJvci1ib3VuZGFyaWVzLmh0bWxcblxuICBpZiAoZXJyKSB7XG4gICAgU2VudHJ5LmNhcHR1cmVFeGNlcHRpb24oZXJyKTtcblxuICAgIC8vIEZsdXNoaW5nIGJlZm9yZSByZXR1cm5pbmcgaXMgbmVjZXNzYXJ5IGlmIGRlcGxveWluZyB0byBWZXJjZWwsIHNlZVxuICAgIC8vIGh0dHBzOi8vdmVyY2VsLmNvbS9kb2NzL3BsYXRmb3JtL2xpbWl0cyNzdHJlYW1pbmctcmVzcG9uc2VzXG4gICAgYXdhaXQgU2VudHJ5LmZsdXNoKDIwMDApO1xuXG4gICAgcmV0dXJuIGVycm9ySW5pdGlhbFByb3BzO1xuICB9XG5cbiAgLy8gSWYgdGhpcyBwb2ludCBpcyByZWFjaGVkLCBnZXRJbml0aWFsUHJvcHMgd2FzIGNhbGxlZCB3aXRob3V0IGFueVxuICAvLyBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IHRoZSBlcnJvciBtaWdodCBiZS4gVGhpcyBpcyB1bmV4cGVjdGVkIGFuZCBtYXlcbiAgLy8gaW5kaWNhdGUgYSBidWcgaW50cm9kdWNlZCBpbiBOZXh0LmpzLCBzbyByZWNvcmQgaXQgaW4gU2VudHJ5XG4gIFNlbnRyeS5jYXB0dXJlRXhjZXB0aW9uKFxuICAgIG5ldyBFcnJvcihgX2Vycm9yLmpzIGdldEluaXRpYWxQcm9wcyBtaXNzaW5nIGRhdGEgYXQgcGF0aDogJHthc1BhdGh9YCksXG4gICk7XG4gIGF3YWl0IFNlbnRyeS5mbHVzaCgyMDAwKTtcblxuICByZXR1cm4gZXJyb3JJbml0aWFsUHJvcHM7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBNeUVycm9yO1xuIl0sIm5hbWVzIjpbIk5leHRFcnJvckNvbXBvbmVudCIsIlNlbnRyeSIsIk15RXJyb3IiLCJzdGF0dXNDb2RlIiwiaGFzR2V0SW5pdGlhbFByb3BzUnVuIiwiZXJyIiwiY2FwdHVyZUV4Y2VwdGlvbiIsImdldEluaXRpYWxQcm9wcyIsImNvbnRleHQiLCJlcnJvckluaXRpYWxQcm9wcyIsInJlcyIsImFzUGF0aCIsImZsdXNoIiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_error.js\n");

/***/ }),

/***/ "@sentry/nextjs":
/*!*********************************!*\
  !*** external "@sentry/nextjs" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@sentry/nextjs");

/***/ }),

/***/ "next/error":
/*!*****************************!*\
  !*** external "next/error" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/error");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./node_modules/@sentry/webpack-plugin/src/sentry-webpack.module.js"), __webpack_exec__("./pages/_error.js"));
module.exports = __webpack_exports__;

})();