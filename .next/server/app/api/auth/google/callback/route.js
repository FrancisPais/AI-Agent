"use strict";
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
exports.id = "app/api/auth/google/callback/route";
exports.ids = ["app/api/auth/google/callback/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:buffer");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ "node:http":
/*!****************************!*\
  !*** external "node:http" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:http");

/***/ }),

/***/ "node:https":
/*!*****************************!*\
  !*** external "node:https" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("node:https");

/***/ }),

/***/ "node:net":
/*!***************************!*\
  !*** external "node:net" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("node:net");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:path");

/***/ }),

/***/ "node:process":
/*!*******************************!*\
  !*** external "node:process" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("node:process");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("node:stream/web");

/***/ }),

/***/ "node:url":
/*!***************************!*\
  !*** external "node:url" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("node:url");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:util");

/***/ }),

/***/ "node:zlib":
/*!****************************!*\
  !*** external "node:zlib" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:zlib");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("process");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("worker_threads");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&page=%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&page=%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_runner_workspace_app_api_auth_google_callback_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/google/callback/route.ts */ \"(rsc)/./app/api/auth/google/callback/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/google/callback/route\",\n        pathname: \"/api/auth/google/callback\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/google/callback/route\"\n    },\n    resolvedPagePath: \"/home/runner/workspace/app/api/auth/google/callback/route.ts\",\n    nextConfigOutput,\n    userland: _home_runner_workspace_app_api_auth_google_callback_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/google/callback/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGZ29vZ2xlJTJGY2FsbGJhY2slMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZnb29nbGUlMkZjYWxsYmFjayUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZnb29nbGUlMkZjYWxsYmFjayUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNZO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8veXQtc2hvcnRzbWl0aC8/Y2E3MCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcC9hcGkvYXV0aC9nb29nbGUvY2FsbGJhY2svcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvZ29vZ2xlL2NhbGxiYWNrL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9nb29nbGUvY2FsbGJhY2tcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvZ29vZ2xlL2NhbGxiYWNrL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcHAvYXBpL2F1dGgvZ29vZ2xlL2NhbGxiYWNrL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL2dvb2dsZS9jYWxsYmFjay9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&page=%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/google/callback/route.ts":
/*!***********************************************!*\
  !*** ./app/api/auth/google/callback/route.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var google_auth_library__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! google-auth-library */ \"(rsc)/./node_modules/google-auth-library/build/src/index.js\");\n/* harmony import */ var _src_lib_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/src/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var _src_lib_session__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/src/lib/session */ \"(rsc)/./src/lib/session.ts\");\n/* harmony import */ var _src_lib_encryption__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/src/lib/encryption */ \"(rsc)/./src/lib/encryption.ts\");\n\n\n\n\n\nconst getOAuthClient = ()=>{\n    const clientId = process.env.GOOGLE_CLIENT_ID;\n    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;\n    let redirectUri = process.env.GOOGLE_REDIRECT_URI;\n    if (!redirectUri) {\n        const replitDomain = process.env.REPLIT_DOMAINS?.split(\",\")[0];\n        if (replitDomain) {\n            redirectUri = `https://${replitDomain}/api/auth/google/callback`;\n        } else {\n            redirectUri = \"http://localhost:5000/api/auth/google/callback\";\n        }\n    }\n    if (!clientId || !clientSecret) {\n        throw new Error(\"Google OAuth credentials not configured\");\n    }\n    return new google_auth_library__WEBPACK_IMPORTED_MODULE_1__.OAuth2Client(clientId, clientSecret, redirectUri);\n};\nasync function GET(request) {\n    try {\n        const searchParams = request.nextUrl.searchParams;\n        const code = searchParams.get(\"code\");\n        const error = searchParams.get(\"error\");\n        if (error) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(new URL(`/login?error=${error}`, request.url));\n        }\n        if (!code) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(new URL(\"/login?error=no_code\", request.url));\n        }\n        const oauth2Client = getOAuthClient();\n        const { tokens } = await oauth2Client.getToken(code);\n        if (!tokens.access_token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(new URL(\"/login?error=no_token\", request.url));\n        }\n        oauth2Client.setCredentials(tokens);\n        const oauth2 = await oauth2Client.request({\n            url: \"https://www.googleapis.com/oauth2/v2/userinfo\"\n        });\n        const userInfo = oauth2.data;\n        if (!userInfo.email || !userInfo.id) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(new URL(\"/login?error=no_user_info\", request.url));\n        }\n        const encryptedAccessToken = tokens.access_token ? (0,_src_lib_encryption__WEBPACK_IMPORTED_MODULE_4__.encrypt)(tokens.access_token) : null;\n        const encryptedRefreshToken = tokens.refresh_token ? (0,_src_lib_encryption__WEBPACK_IMPORTED_MODULE_4__.encrypt)(tokens.refresh_token) : null;\n        const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null;\n        let user = await _src_lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n            where: {\n                googleAccountId: userInfo.id\n            }\n        });\n        if (user) {\n            user = await _src_lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.update({\n                where: {\n                    id: user.id\n                },\n                data: {\n                    email: userInfo.email,\n                    googleAccessToken: encryptedAccessToken,\n                    googleRefreshToken: encryptedRefreshToken,\n                    googleTokenExpiresAt: expiresAt\n                }\n            });\n        } else {\n            user = await _src_lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.create({\n                data: {\n                    email: userInfo.email,\n                    googleAccountId: userInfo.id,\n                    googleAccessToken: encryptedAccessToken,\n                    googleRefreshToken: encryptedRefreshToken,\n                    googleTokenExpiresAt: expiresAt\n                }\n            });\n        }\n        const session = await (0,_src_lib_session__WEBPACK_IMPORTED_MODULE_3__.getSession)();\n        session.isAuthenticated = true;\n        session.userId = user.id;\n        session.email = user.email;\n        await session.save();\n        const replitDomain = process.env.REPLIT_DOMAINS?.split(\",\")[0];\n        const baseUrl = replitDomain ? `https://${replitDomain}` : request.url;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(new URL(\"/\", baseUrl));\n    } catch (error) {\n        console.error(\"Error in Google OAuth callback:\", error);\n        const replitDomain = process.env.REPLIT_DOMAINS?.split(\",\")[0];\n        const baseUrl = replitDomain ? `https://${replitDomain}` : request.url;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(new URL(\"/login?error=callback_failed\", baseUrl));\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvZ29vZ2xlL2NhbGxiYWNrL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUF1RDtBQUNMO0FBQ1Q7QUFDSztBQUNBO0FBRTlDLE1BQU1LLGlCQUFpQjtJQUNyQixNQUFNQyxXQUFXQyxRQUFRQyxHQUFHLENBQUNDLGdCQUFnQjtJQUM3QyxNQUFNQyxlQUFlSCxRQUFRQyxHQUFHLENBQUNHLG9CQUFvQjtJQUVyRCxJQUFJQyxjQUFjTCxRQUFRQyxHQUFHLENBQUNLLG1CQUFtQjtJQUVqRCxJQUFJLENBQUNELGFBQ0w7UUFDRSxNQUFNRSxlQUFlUCxRQUFRQyxHQUFHLENBQUNPLGNBQWMsRUFBRUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUU5RCxJQUFJRixjQUNKO1lBQ0VGLGNBQWMsQ0FBQyxRQUFRLEVBQUVFLGFBQWEseUJBQXlCLENBQUM7UUFDbEUsT0FFQTtZQUNFRixjQUFjO1FBQ2hCO0lBQ0Y7SUFFQSxJQUFJLENBQUNOLFlBQVksQ0FBQ0ksY0FDbEI7UUFDRSxNQUFNLElBQUlPLE1BQU07SUFDbEI7SUFFQSxPQUFPLElBQUloQiw2REFBWUEsQ0FBQ0ssVUFBVUksY0FBY0U7QUFDbEQ7QUFFTyxlQUFlTSxJQUFJQyxPQUFvQjtJQUM1QyxJQUFJO1FBQ0YsTUFBTUMsZUFBZUQsUUFBUUUsT0FBTyxDQUFDRCxZQUFZO1FBQ2pELE1BQU1FLE9BQU9GLGFBQWFHLEdBQUcsQ0FBQztRQUM5QixNQUFNQyxRQUFRSixhQUFhRyxHQUFHLENBQUM7UUFFL0IsSUFBSUMsT0FDSjtZQUNFLE9BQU94QixxREFBWUEsQ0FBQ3lCLFFBQVEsQ0FBQyxJQUFJQyxJQUFJLENBQUMsYUFBYSxFQUFFRixNQUFNLENBQUMsRUFBRUwsUUFBUVEsR0FBRztRQUMzRTtRQUVBLElBQUksQ0FBQ0wsTUFDTDtZQUNFLE9BQU90QixxREFBWUEsQ0FBQ3lCLFFBQVEsQ0FBQyxJQUFJQyxJQUFJLHdCQUF3QlAsUUFBUVEsR0FBRztRQUMxRTtRQUVBLE1BQU1DLGVBQWV2QjtRQUNyQixNQUFNLEVBQUV3QixNQUFNLEVBQUUsR0FBRyxNQUFNRCxhQUFhRSxRQUFRLENBQUNSO1FBRS9DLElBQUksQ0FBQ08sT0FBT0UsWUFBWSxFQUN4QjtZQUNFLE9BQU8vQixxREFBWUEsQ0FBQ3lCLFFBQVEsQ0FBQyxJQUFJQyxJQUFJLHlCQUF5QlAsUUFBUVEsR0FBRztRQUMzRTtRQUVBQyxhQUFhSSxjQUFjLENBQUNIO1FBRTVCLE1BQU1JLFNBQVMsTUFBTUwsYUFBYVQsT0FBTyxDQUFDO1lBQ3hDUSxLQUFLO1FBQ1A7UUFFQSxNQUFNTyxXQUFXRCxPQUFPRSxJQUFJO1FBRTVCLElBQUksQ0FBQ0QsU0FBU0UsS0FBSyxJQUFJLENBQUNGLFNBQVNHLEVBQUUsRUFDbkM7WUFDRSxPQUFPckMscURBQVlBLENBQUN5QixRQUFRLENBQUMsSUFBSUMsSUFBSSw2QkFBNkJQLFFBQVFRLEdBQUc7UUFDL0U7UUFFQSxNQUFNVyx1QkFBdUJULE9BQU9FLFlBQVksR0FBRzNCLDREQUFPQSxDQUFDeUIsT0FBT0UsWUFBWSxJQUFJO1FBQ2xGLE1BQU1RLHdCQUF3QlYsT0FBT1csYUFBYSxHQUFHcEMsNERBQU9BLENBQUN5QixPQUFPVyxhQUFhLElBQUk7UUFDckYsTUFBTUMsWUFBWVosT0FBT2EsV0FBVyxHQUFHLElBQUlDLEtBQUtkLE9BQU9hLFdBQVcsSUFBSTtRQUV0RSxJQUFJRSxPQUFPLE1BQU0xQyxtREFBTUEsQ0FBQzBDLElBQUksQ0FBQ0MsVUFBVSxDQUFDO1lBQ3RDQyxPQUFPO2dCQUFFQyxpQkFBaUJiLFNBQVNHLEVBQUU7WUFBQztRQUN4QztRQUVBLElBQUlPLE1BQ0o7WUFDRUEsT0FBTyxNQUFNMUMsbURBQU1BLENBQUMwQyxJQUFJLENBQUNJLE1BQU0sQ0FBQztnQkFDOUJGLE9BQU87b0JBQUVULElBQUlPLEtBQUtQLEVBQUU7Z0JBQUM7Z0JBQ3JCRixNQUFNO29CQUNKQyxPQUFPRixTQUFTRSxLQUFLO29CQUNyQmEsbUJBQW1CWDtvQkFDbkJZLG9CQUFvQlg7b0JBQ3BCWSxzQkFBc0JWO2dCQUN4QjtZQUNGO1FBQ0YsT0FFQTtZQUNFRyxPQUFPLE1BQU0xQyxtREFBTUEsQ0FBQzBDLElBQUksQ0FBQ1EsTUFBTSxDQUFDO2dCQUM5QmpCLE1BQU07b0JBQ0pDLE9BQU9GLFNBQVNFLEtBQUs7b0JBQ3JCVyxpQkFBaUJiLFNBQVNHLEVBQUU7b0JBQzVCWSxtQkFBbUJYO29CQUNuQlksb0JBQW9CWDtvQkFDcEJZLHNCQUFzQlY7Z0JBQ3hCO1lBQ0Y7UUFDRjtRQUVBLE1BQU1ZLFVBQVUsTUFBTWxELDREQUFVQTtRQUNoQ2tELFFBQVFDLGVBQWUsR0FBRztRQUMxQkQsUUFBUUUsTUFBTSxHQUFHWCxLQUFLUCxFQUFFO1FBQ3hCZ0IsUUFBUWpCLEtBQUssR0FBR1EsS0FBS1IsS0FBSztRQUMxQixNQUFNaUIsUUFBUUcsSUFBSTtRQUVsQixNQUFNMUMsZUFBZVAsUUFBUUMsR0FBRyxDQUFDTyxjQUFjLEVBQUVDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDOUQsTUFBTXlDLFVBQVUzQyxlQUFlLENBQUMsUUFBUSxFQUFFQSxhQUFhLENBQUMsR0FBR0ssUUFBUVEsR0FBRztRQUV0RSxPQUFPM0IscURBQVlBLENBQUN5QixRQUFRLENBQUMsSUFBSUMsSUFBSSxLQUFLK0I7SUFDNUMsRUFDQSxPQUFPakMsT0FBWTtRQUNqQmtDLFFBQVFsQyxLQUFLLENBQUMsbUNBQW1DQTtRQUVqRCxNQUFNVixlQUFlUCxRQUFRQyxHQUFHLENBQUNPLGNBQWMsRUFBRUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUM5RCxNQUFNeUMsVUFBVTNDLGVBQWUsQ0FBQyxRQUFRLEVBQUVBLGFBQWEsQ0FBQyxHQUFHSyxRQUFRUSxHQUFHO1FBRXRFLE9BQU8zQixxREFBWUEsQ0FBQ3lCLFFBQVEsQ0FBQyxJQUFJQyxJQUFJLGdDQUFnQytCO0lBQ3ZFO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly95dC1zaG9ydHNtaXRoLy4vYXBwL2FwaS9hdXRoL2dvb2dsZS9jYWxsYmFjay9yb3V0ZS50cz9lYWE4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcbmltcG9ydCB7IE9BdXRoMkNsaWVudCB9IGZyb20gJ2dvb2dsZS1hdXRoLWxpYnJhcnknXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL3NyYy9saWIvcHJpc21hJ1xuaW1wb3J0IHsgZ2V0U2Vzc2lvbiB9IGZyb20gJ0Avc3JjL2xpYi9zZXNzaW9uJ1xuaW1wb3J0IHsgZW5jcnlwdCB9IGZyb20gJ0Avc3JjL2xpYi9lbmNyeXB0aW9uJ1xuXG5jb25zdCBnZXRPQXV0aENsaWVudCA9ICgpID0+IHtcbiAgY29uc3QgY2xpZW50SWQgPSBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lEXG4gIGNvbnN0IGNsaWVudFNlY3JldCA9IHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfU0VDUkVUXG4gIFxuICBsZXQgcmVkaXJlY3RVcmkgPSBwcm9jZXNzLmVudi5HT09HTEVfUkVESVJFQ1RfVVJJXG4gIFxuICBpZiAoIXJlZGlyZWN0VXJpKVxuICB7XG4gICAgY29uc3QgcmVwbGl0RG9tYWluID0gcHJvY2Vzcy5lbnYuUkVQTElUX0RPTUFJTlM/LnNwbGl0KCcsJylbMF1cbiAgICBcbiAgICBpZiAocmVwbGl0RG9tYWluKVxuICAgIHtcbiAgICAgIHJlZGlyZWN0VXJpID0gYGh0dHBzOi8vJHtyZXBsaXREb21haW59L2FwaS9hdXRoL2dvb2dsZS9jYWxsYmFja2BcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHJlZGlyZWN0VXJpID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9hcGkvYXV0aC9nb29nbGUvY2FsbGJhY2snXG4gICAgfVxuICB9XG4gIFxuICBpZiAoIWNsaWVudElkIHx8ICFjbGllbnRTZWNyZXQpXG4gIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0dvb2dsZSBPQXV0aCBjcmVkZW50aWFscyBub3QgY29uZmlndXJlZCcpXG4gIH1cbiAgXG4gIHJldHVybiBuZXcgT0F1dGgyQ2xpZW50KGNsaWVudElkLCBjbGllbnRTZWNyZXQsIHJlZGlyZWN0VXJpKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2VhcmNoUGFyYW1zID0gcmVxdWVzdC5uZXh0VXJsLnNlYXJjaFBhcmFtc1xuICAgIGNvbnN0IGNvZGUgPSBzZWFyY2hQYXJhbXMuZ2V0KCdjb2RlJylcbiAgICBjb25zdCBlcnJvciA9IHNlYXJjaFBhcmFtcy5nZXQoJ2Vycm9yJylcbiAgICBcbiAgICBpZiAoZXJyb3IpXG4gICAge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5yZWRpcmVjdChuZXcgVVJMKGAvbG9naW4/ZXJyb3I9JHtlcnJvcn1gLCByZXF1ZXN0LnVybCkpXG4gICAgfVxuICAgIFxuICAgIGlmICghY29kZSlcbiAgICB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KG5ldyBVUkwoJy9sb2dpbj9lcnJvcj1ub19jb2RlJywgcmVxdWVzdC51cmwpKVxuICAgIH1cbiAgICBcbiAgICBjb25zdCBvYXV0aDJDbGllbnQgPSBnZXRPQXV0aENsaWVudCgpXG4gICAgY29uc3QgeyB0b2tlbnMgfSA9IGF3YWl0IG9hdXRoMkNsaWVudC5nZXRUb2tlbihjb2RlKVxuICAgIFxuICAgIGlmICghdG9rZW5zLmFjY2Vzc190b2tlbilcbiAgICB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KG5ldyBVUkwoJy9sb2dpbj9lcnJvcj1ub190b2tlbicsIHJlcXVlc3QudXJsKSlcbiAgICB9XG4gICAgXG4gICAgb2F1dGgyQ2xpZW50LnNldENyZWRlbnRpYWxzKHRva2VucylcbiAgICBcbiAgICBjb25zdCBvYXV0aDIgPSBhd2FpdCBvYXV0aDJDbGllbnQucmVxdWVzdCh7XG4gICAgICB1cmw6ICdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjIvdXNlcmluZm8nXG4gICAgfSlcbiAgICBcbiAgICBjb25zdCB1c2VySW5mbyA9IG9hdXRoMi5kYXRhIGFzIGFueVxuICAgIFxuICAgIGlmICghdXNlckluZm8uZW1haWwgfHwgIXVzZXJJbmZvLmlkKVxuICAgIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UucmVkaXJlY3QobmV3IFVSTCgnL2xvZ2luP2Vycm9yPW5vX3VzZXJfaW5mbycsIHJlcXVlc3QudXJsKSlcbiAgICB9XG4gICAgXG4gICAgY29uc3QgZW5jcnlwdGVkQWNjZXNzVG9rZW4gPSB0b2tlbnMuYWNjZXNzX3Rva2VuID8gZW5jcnlwdCh0b2tlbnMuYWNjZXNzX3Rva2VuKSA6IG51bGxcbiAgICBjb25zdCBlbmNyeXB0ZWRSZWZyZXNoVG9rZW4gPSB0b2tlbnMucmVmcmVzaF90b2tlbiA/IGVuY3J5cHQodG9rZW5zLnJlZnJlc2hfdG9rZW4pIDogbnVsbFxuICAgIGNvbnN0IGV4cGlyZXNBdCA9IHRva2Vucy5leHBpcnlfZGF0ZSA/IG5ldyBEYXRlKHRva2Vucy5leHBpcnlfZGF0ZSkgOiBudWxsXG4gICAgXG4gICAgbGV0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcbiAgICAgIHdoZXJlOiB7IGdvb2dsZUFjY291bnRJZDogdXNlckluZm8uaWQgfVxuICAgIH0pXG4gICAgXG4gICAgaWYgKHVzZXIpXG4gICAge1xuICAgICAgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLnVwZGF0ZSh7XG4gICAgICAgIHdoZXJlOiB7IGlkOiB1c2VyLmlkIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBlbWFpbDogdXNlckluZm8uZW1haWwsXG4gICAgICAgICAgZ29vZ2xlQWNjZXNzVG9rZW46IGVuY3J5cHRlZEFjY2Vzc1Rva2VuLFxuICAgICAgICAgIGdvb2dsZVJlZnJlc2hUb2tlbjogZW5jcnlwdGVkUmVmcmVzaFRva2VuLFxuICAgICAgICAgIGdvb2dsZVRva2VuRXhwaXJlc0F0OiBleHBpcmVzQXRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5jcmVhdGUoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZW1haWw6IHVzZXJJbmZvLmVtYWlsLFxuICAgICAgICAgIGdvb2dsZUFjY291bnRJZDogdXNlckluZm8uaWQsXG4gICAgICAgICAgZ29vZ2xlQWNjZXNzVG9rZW46IGVuY3J5cHRlZEFjY2Vzc1Rva2VuLFxuICAgICAgICAgIGdvb2dsZVJlZnJlc2hUb2tlbjogZW5jcnlwdGVkUmVmcmVzaFRva2VuLFxuICAgICAgICAgIGdvb2dsZVRva2VuRXhwaXJlc0F0OiBleHBpcmVzQXRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgXG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24oKVxuICAgIHNlc3Npb24uaXNBdXRoZW50aWNhdGVkID0gdHJ1ZVxuICAgIHNlc3Npb24udXNlcklkID0gdXNlci5pZFxuICAgIHNlc3Npb24uZW1haWwgPSB1c2VyLmVtYWlsXG4gICAgYXdhaXQgc2Vzc2lvbi5zYXZlKClcbiAgICBcbiAgICBjb25zdCByZXBsaXREb21haW4gPSBwcm9jZXNzLmVudi5SRVBMSVRfRE9NQUlOUz8uc3BsaXQoJywnKVswXVxuICAgIGNvbnN0IGJhc2VVcmwgPSByZXBsaXREb21haW4gPyBgaHR0cHM6Ly8ke3JlcGxpdERvbWFpbn1gIDogcmVxdWVzdC51cmxcbiAgICBcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KG5ldyBVUkwoJy8nLCBiYXNlVXJsKSlcbiAgfVxuICBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIEdvb2dsZSBPQXV0aCBjYWxsYmFjazonLCBlcnJvcilcbiAgICBcbiAgICBjb25zdCByZXBsaXREb21haW4gPSBwcm9jZXNzLmVudi5SRVBMSVRfRE9NQUlOUz8uc3BsaXQoJywnKVswXVxuICAgIGNvbnN0IGJhc2VVcmwgPSByZXBsaXREb21haW4gPyBgaHR0cHM6Ly8ke3JlcGxpdERvbWFpbn1gIDogcmVxdWVzdC51cmxcbiAgICBcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KG5ldyBVUkwoJy9sb2dpbj9lcnJvcj1jYWxsYmFja19mYWlsZWQnLCBiYXNlVXJsKSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIk9BdXRoMkNsaWVudCIsInByaXNtYSIsImdldFNlc3Npb24iLCJlbmNyeXB0IiwiZ2V0T0F1dGhDbGllbnQiLCJjbGllbnRJZCIsInByb2Nlc3MiLCJlbnYiLCJHT09HTEVfQ0xJRU5UX0lEIiwiY2xpZW50U2VjcmV0IiwiR09PR0xFX0NMSUVOVF9TRUNSRVQiLCJyZWRpcmVjdFVyaSIsIkdPT0dMRV9SRURJUkVDVF9VUkkiLCJyZXBsaXREb21haW4iLCJSRVBMSVRfRE9NQUlOUyIsInNwbGl0IiwiRXJyb3IiLCJHRVQiLCJyZXF1ZXN0Iiwic2VhcmNoUGFyYW1zIiwibmV4dFVybCIsImNvZGUiLCJnZXQiLCJlcnJvciIsInJlZGlyZWN0IiwiVVJMIiwidXJsIiwib2F1dGgyQ2xpZW50IiwidG9rZW5zIiwiZ2V0VG9rZW4iLCJhY2Nlc3NfdG9rZW4iLCJzZXRDcmVkZW50aWFscyIsIm9hdXRoMiIsInVzZXJJbmZvIiwiZGF0YSIsImVtYWlsIiwiaWQiLCJlbmNyeXB0ZWRBY2Nlc3NUb2tlbiIsImVuY3J5cHRlZFJlZnJlc2hUb2tlbiIsInJlZnJlc2hfdG9rZW4iLCJleHBpcmVzQXQiLCJleHBpcnlfZGF0ZSIsIkRhdGUiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiZ29vZ2xlQWNjb3VudElkIiwidXBkYXRlIiwiZ29vZ2xlQWNjZXNzVG9rZW4iLCJnb29nbGVSZWZyZXNoVG9rZW4iLCJnb29nbGVUb2tlbkV4cGlyZXNBdCIsImNyZWF0ZSIsInNlc3Npb24iLCJpc0F1dGhlbnRpY2F0ZWQiLCJ1c2VySWQiLCJzYXZlIiwiYmFzZVVybCIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/google/callback/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/encryption.ts":
/*!*******************************!*\
  !*** ./src/lib/encryption.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   decrypt: () => (/* binding */ decrypt),\n/* harmony export */   encrypt: () => (/* binding */ encrypt)\n/* harmony export */ });\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);\n\nconst ALGORITHM = \"aes-256-gcm\";\nconst KEY_LENGTH = 32;\nconst IV_LENGTH = 16;\nconst SALT_LENGTH = 16;\nconst TAG_LENGTH = 16;\nfunction getKey(salt) {\n    const secret = process.env.SESSION_SECRET || \"complex_password_at_least_32_characters_long_for_session_security\";\n    return (0,crypto__WEBPACK_IMPORTED_MODULE_0__.scryptSync)(secret, salt, KEY_LENGTH);\n}\nfunction encrypt(text) {\n    const salt = (0,crypto__WEBPACK_IMPORTED_MODULE_0__.randomBytes)(SALT_LENGTH);\n    const iv = (0,crypto__WEBPACK_IMPORTED_MODULE_0__.randomBytes)(IV_LENGTH);\n    const key = getKey(salt);\n    const cipher = (0,crypto__WEBPACK_IMPORTED_MODULE_0__.createCipheriv)(ALGORITHM, key, iv);\n    const encrypted = Buffer.concat([\n        cipher.update(text, \"utf8\"),\n        cipher.final()\n    ]);\n    const tag = cipher.getAuthTag();\n    const result = Buffer.concat([\n        salt,\n        iv,\n        tag,\n        encrypted\n    ]);\n    return result.toString(\"base64\");\n}\nfunction decrypt(encryptedText) {\n    const buffer = Buffer.from(encryptedText, \"base64\");\n    const salt = buffer.subarray(0, SALT_LENGTH);\n    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);\n    const tag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);\n    const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);\n    const key = getKey(salt);\n    const decipher = (0,crypto__WEBPACK_IMPORTED_MODULE_0__.createDecipheriv)(ALGORITHM, key, iv);\n    decipher.setAuthTag(tag);\n    const decrypted = Buffer.concat([\n        decipher.update(encrypted),\n        decipher.final()\n    ]);\n    return decrypted.toString(\"utf8\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2VuY3J5cHRpb24udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFrRjtBQUVsRixNQUFNSSxZQUFZO0FBQ2xCLE1BQU1DLGFBQWE7QUFDbkIsTUFBTUMsWUFBWTtBQUNsQixNQUFNQyxjQUFjO0FBQ3BCLE1BQU1DLGFBQWE7QUFFbkIsU0FBU0MsT0FBT0MsSUFBWTtJQUMxQixNQUFNQyxTQUFTQyxRQUFRQyxHQUFHLENBQUNDLGNBQWMsSUFBSTtJQUM3QyxPQUFPWCxrREFBVUEsQ0FBQ1EsUUFBUUQsTUFBTUw7QUFDbEM7QUFFTyxTQUFTVSxRQUFRQyxJQUFZO0lBQ2xDLE1BQU1OLE9BQU9SLG1EQUFXQSxDQUFDSztJQUN6QixNQUFNVSxLQUFLZixtREFBV0EsQ0FBQ0k7SUFDdkIsTUFBTVksTUFBTVQsT0FBT0M7SUFFbkIsTUFBTVMsU0FBU25CLHNEQUFjQSxDQUFDSSxXQUFXYyxLQUFLRDtJQUU5QyxNQUFNRyxZQUFZQyxPQUFPQyxNQUFNLENBQUM7UUFDOUJILE9BQU9JLE1BQU0sQ0FBQ1AsTUFBTTtRQUNwQkcsT0FBT0ssS0FBSztLQUNiO0lBRUQsTUFBTUMsTUFBTU4sT0FBT08sVUFBVTtJQUU3QixNQUFNQyxTQUFTTixPQUFPQyxNQUFNLENBQUM7UUFBQ1o7UUFBTU87UUFBSVE7UUFBS0w7S0FBVTtJQUN2RCxPQUFPTyxPQUFPQyxRQUFRLENBQUM7QUFDekI7QUFFTyxTQUFTQyxRQUFRQyxhQUFxQjtJQUMzQyxNQUFNQyxTQUFTVixPQUFPVyxJQUFJLENBQUNGLGVBQWU7SUFFMUMsTUFBTXBCLE9BQU9xQixPQUFPRSxRQUFRLENBQUMsR0FBRzFCO0lBQ2hDLE1BQU1VLEtBQUtjLE9BQU9FLFFBQVEsQ0FBQzFCLGFBQWFBLGNBQWNEO0lBQ3RELE1BQU1tQixNQUFNTSxPQUFPRSxRQUFRLENBQUMxQixjQUFjRCxXQUFXQyxjQUFjRCxZQUFZRTtJQUMvRSxNQUFNWSxZQUFZVyxPQUFPRSxRQUFRLENBQUMxQixjQUFjRCxZQUFZRTtJQUU1RCxNQUFNVSxNQUFNVCxPQUFPQztJQUVuQixNQUFNd0IsV0FBV2pDLHdEQUFnQkEsQ0FBQ0csV0FBV2MsS0FBS0Q7SUFDbERpQixTQUFTQyxVQUFVLENBQUNWO0lBRXBCLE1BQU1XLFlBQVlmLE9BQU9DLE1BQU0sQ0FBQztRQUM5QlksU0FBU1gsTUFBTSxDQUFDSDtRQUNoQmMsU0FBU1YsS0FBSztLQUNmO0lBRUQsT0FBT1ksVUFBVVIsUUFBUSxDQUFDO0FBQzVCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8veXQtc2hvcnRzbWl0aC8uL3NyYy9saWIvZW5jcnlwdGlvbi50cz80OTFjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNpcGhlcml2LCBjcmVhdGVEZWNpcGhlcml2LCByYW5kb21CeXRlcywgc2NyeXB0U3luYyB9IGZyb20gJ2NyeXB0bydcblxuY29uc3QgQUxHT1JJVEhNID0gJ2Flcy0yNTYtZ2NtJ1xuY29uc3QgS0VZX0xFTkdUSCA9IDMyXG5jb25zdCBJVl9MRU5HVEggPSAxNlxuY29uc3QgU0FMVF9MRU5HVEggPSAxNlxuY29uc3QgVEFHX0xFTkdUSCA9IDE2XG5cbmZ1bmN0aW9uIGdldEtleShzYWx0OiBCdWZmZXIpOiBCdWZmZXIge1xuICBjb25zdCBzZWNyZXQgPSBwcm9jZXNzLmVudi5TRVNTSU9OX1NFQ1JFVCB8fCAnY29tcGxleF9wYXNzd29yZF9hdF9sZWFzdF8zMl9jaGFyYWN0ZXJzX2xvbmdfZm9yX3Nlc3Npb25fc2VjdXJpdHknXG4gIHJldHVybiBzY3J5cHRTeW5jKHNlY3JldCwgc2FsdCwgS0VZX0xFTkdUSClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHQodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3Qgc2FsdCA9IHJhbmRvbUJ5dGVzKFNBTFRfTEVOR1RIKVxuICBjb25zdCBpdiA9IHJhbmRvbUJ5dGVzKElWX0xFTkdUSClcbiAgY29uc3Qga2V5ID0gZ2V0S2V5KHNhbHQpXG4gIFxuICBjb25zdCBjaXBoZXIgPSBjcmVhdGVDaXBoZXJpdihBTEdPUklUSE0sIGtleSwgaXYpXG4gIFxuICBjb25zdCBlbmNyeXB0ZWQgPSBCdWZmZXIuY29uY2F0KFtcbiAgICBjaXBoZXIudXBkYXRlKHRleHQsICd1dGY4JyksXG4gICAgY2lwaGVyLmZpbmFsKClcbiAgXSlcbiAgXG4gIGNvbnN0IHRhZyA9IGNpcGhlci5nZXRBdXRoVGFnKClcbiAgXG4gIGNvbnN0IHJlc3VsdCA9IEJ1ZmZlci5jb25jYXQoW3NhbHQsIGl2LCB0YWcsIGVuY3J5cHRlZF0pXG4gIHJldHVybiByZXN1bHQudG9TdHJpbmcoJ2Jhc2U2NCcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0KGVuY3J5cHRlZFRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGVuY3J5cHRlZFRleHQsICdiYXNlNjQnKVxuICBcbiAgY29uc3Qgc2FsdCA9IGJ1ZmZlci5zdWJhcnJheSgwLCBTQUxUX0xFTkdUSClcbiAgY29uc3QgaXYgPSBidWZmZXIuc3ViYXJyYXkoU0FMVF9MRU5HVEgsIFNBTFRfTEVOR1RIICsgSVZfTEVOR1RIKVxuICBjb25zdCB0YWcgPSBidWZmZXIuc3ViYXJyYXkoU0FMVF9MRU5HVEggKyBJVl9MRU5HVEgsIFNBTFRfTEVOR1RIICsgSVZfTEVOR1RIICsgVEFHX0xFTkdUSClcbiAgY29uc3QgZW5jcnlwdGVkID0gYnVmZmVyLnN1YmFycmF5KFNBTFRfTEVOR1RIICsgSVZfTEVOR1RIICsgVEFHX0xFTkdUSClcbiAgXG4gIGNvbnN0IGtleSA9IGdldEtleShzYWx0KVxuICBcbiAgY29uc3QgZGVjaXBoZXIgPSBjcmVhdGVEZWNpcGhlcml2KEFMR09SSVRITSwga2V5LCBpdilcbiAgZGVjaXBoZXIuc2V0QXV0aFRhZyh0YWcpXG4gIFxuICBjb25zdCBkZWNyeXB0ZWQgPSBCdWZmZXIuY29uY2F0KFtcbiAgICBkZWNpcGhlci51cGRhdGUoZW5jcnlwdGVkKSxcbiAgICBkZWNpcGhlci5maW5hbCgpXG4gIF0pXG4gIFxuICByZXR1cm4gZGVjcnlwdGVkLnRvU3RyaW5nKCd1dGY4Jylcbn1cbiJdLCJuYW1lcyI6WyJjcmVhdGVDaXBoZXJpdiIsImNyZWF0ZURlY2lwaGVyaXYiLCJyYW5kb21CeXRlcyIsInNjcnlwdFN5bmMiLCJBTEdPUklUSE0iLCJLRVlfTEVOR1RIIiwiSVZfTEVOR1RIIiwiU0FMVF9MRU5HVEgiLCJUQUdfTEVOR1RIIiwiZ2V0S2V5Iiwic2FsdCIsInNlY3JldCIsInByb2Nlc3MiLCJlbnYiLCJTRVNTSU9OX1NFQ1JFVCIsImVuY3J5cHQiLCJ0ZXh0IiwiaXYiLCJrZXkiLCJjaXBoZXIiLCJlbmNyeXB0ZWQiLCJCdWZmZXIiLCJjb25jYXQiLCJ1cGRhdGUiLCJmaW5hbCIsInRhZyIsImdldEF1dGhUYWciLCJyZXN1bHQiLCJ0b1N0cmluZyIsImRlY3J5cHQiLCJlbmNyeXB0ZWRUZXh0IiwiYnVmZmVyIiwiZnJvbSIsInN1YmFycmF5IiwiZGVjaXBoZXIiLCJzZXRBdXRoVGFnIiwiZGVjcnlwdGVkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/encryption.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) {\n    globalForPrisma.prisma = prisma;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBNkM7QUFFN0MsTUFBTUMsa0JBQWtCQztBQUlqQixNQUFNQyxTQUFTRixnQkFBZ0JFLE1BQU0sSUFBSSxJQUFJSCx3REFBWUEsR0FBRTtBQUVsRSxJQUFJSSxJQUF5QixFQUFjO0lBQ3pDSCxnQkFBZ0JFLE1BQU0sR0FBR0E7QUFDM0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly95dC1zaG9ydHNtaXRoLy4vc3JjL2xpYi9wcmlzbWEudHM/MDFkNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcblxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsVGhpcyBhcyB1bmtub3duIGFzIHtcbiAgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGNvbnN0IHByaXNtYSA9IGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPz8gbmV3IFByaXNtYUNsaWVudCgpXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWFcbn1cbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/session.ts":
/*!****************************!*\
  !*** ./src/lib/session.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getSession: () => (/* binding */ getSession),\n/* harmony export */   requireAuth: () => (/* binding */ requireAuth)\n/* harmony export */ });\n/* harmony import */ var iron_session__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! iron-session */ \"(rsc)/./node_modules/iron-session/dist/index.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\nasync function getSession() {\n    const sessionCookies = await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    return (0,iron_session__WEBPACK_IMPORTED_MODULE_1__.getIronSession)(sessionCookies, {\n        password: process.env.SESSION_SECRET || \"complex_password_at_least_32_characters_long_for_session_security\",\n        cookieName: \"yt_shortsmith_session\",\n        cookieOptions: {\n            secure: \"development\" === \"production\",\n            httpOnly: true,\n            sameSite: \"lax\",\n            maxAge: 60 * 60 * 24 * 7,\n            path: \"/\"\n        }\n    });\n}\nasync function requireAuth() {\n    const session = await getSession();\n    if (!session.isAuthenticated) {\n        throw new Error(\"Authentication required\");\n    }\n    return session;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3Nlc3Npb24udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUE2QztBQUNQO0FBUS9CLGVBQWVFO0lBQ3BCLE1BQU1DLGlCQUFpQixNQUFNRixxREFBT0E7SUFFcEMsT0FBT0QsNERBQWNBLENBQWNHLGdCQUFnQjtRQUNqREMsVUFBVUMsUUFBUUMsR0FBRyxDQUFDQyxjQUFjLElBQUk7UUFDeENDLFlBQVk7UUFDWkMsZUFBZTtZQUNiQyxRQUFRTCxrQkFBeUI7WUFDakNNLFVBQVU7WUFDVkMsVUFBVTtZQUNWQyxRQUFRLEtBQUssS0FBSyxLQUFLO1lBQ3ZCQyxNQUFNO1FBQ1I7SUFDRjtBQUNGO0FBRU8sZUFBZUM7SUFDcEIsTUFBTUMsVUFBVSxNQUFNZDtJQUV0QixJQUFJLENBQUNjLFFBQVFDLGVBQWUsRUFDNUI7UUFDRSxNQUFNLElBQUlDLE1BQU07SUFDbEI7SUFFQSxPQUFPRjtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8veXQtc2hvcnRzbWl0aC8uL3NyYy9saWIvc2Vzc2lvbi50cz84ZGY5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldElyb25TZXNzaW9uIH0gZnJvbSAnaXJvbi1zZXNzaW9uJ1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycydcblxuZXhwb3J0IGludGVyZmFjZSBTZXNzaW9uRGF0YSB7XG4gIGlzQXV0aGVudGljYXRlZDogYm9vbGVhblxuICB1c2VySWQ/OiBzdHJpbmdcbiAgZW1haWw/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlc3Npb24oKSB7XG4gIGNvbnN0IHNlc3Npb25Db29raWVzID0gYXdhaXQgY29va2llcygpXG4gIFxuICByZXR1cm4gZ2V0SXJvblNlc3Npb248U2Vzc2lvbkRhdGE+KHNlc3Npb25Db29raWVzLCB7XG4gICAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52LlNFU1NJT05fU0VDUkVUIHx8ICdjb21wbGV4X3Bhc3N3b3JkX2F0X2xlYXN0XzMyX2NoYXJhY3RlcnNfbG9uZ19mb3Jfc2Vzc2lvbl9zZWN1cml0eScsXG4gICAgY29va2llTmFtZTogJ3l0X3Nob3J0c21pdGhfc2Vzc2lvbicsXG4gICAgY29va2llT3B0aW9uczoge1xuICAgICAgc2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgICAgaHR0cE9ubHk6IHRydWUsXG4gICAgICBzYW1lU2l0ZTogJ2xheCcsXG4gICAgICBtYXhBZ2U6IDYwICogNjAgKiAyNCAqIDcsXG4gICAgICBwYXRoOiAnLydcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlQXV0aCgpIHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24oKVxuICBcbiAgaWYgKCFzZXNzaW9uLmlzQXV0aGVudGljYXRlZClcbiAge1xuICAgIHRocm93IG5ldyBFcnJvcignQXV0aGVudGljYXRpb24gcmVxdWlyZWQnKVxuICB9XG4gIFxuICByZXR1cm4gc2Vzc2lvblxufVxuIl0sIm5hbWVzIjpbImdldElyb25TZXNzaW9uIiwiY29va2llcyIsImdldFNlc3Npb24iLCJzZXNzaW9uQ29va2llcyIsInBhc3N3b3JkIiwicHJvY2VzcyIsImVudiIsIlNFU1NJT05fU0VDUkVUIiwiY29va2llTmFtZSIsImNvb2tpZU9wdGlvbnMiLCJzZWN1cmUiLCJodHRwT25seSIsInNhbWVTaXRlIiwibWF4QWdlIiwicGF0aCIsInJlcXVpcmVBdXRoIiwic2Vzc2lvbiIsImlzQXV0aGVudGljYXRlZCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/session.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/gaxios","vendor-chunks/iron-session","vendor-chunks/iron-webcrypto","vendor-chunks/uncrypto","vendor-chunks/google-auth-library","vendor-chunks/bignumber.js","vendor-chunks/json-bigint","vendor-chunks/gtoken","vendor-chunks/google-logging-utils","vendor-chunks/gcp-metadata","vendor-chunks/jws","vendor-chunks/jwa","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/base64-js","vendor-chunks/extend","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&page=%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();