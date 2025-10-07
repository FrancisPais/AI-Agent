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
exports.id = "app/api/me/connections/route";
exports.ids = ["app/api/me/connections/route"];
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

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fme%2Fconnections%2Froute&page=%2Fapi%2Fme%2Fconnections%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Fconnections%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fme%2Fconnections%2Froute&page=%2Fapi%2Fme%2Fconnections%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Fconnections%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_runner_workspace_app_api_me_connections_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/me/connections/route.ts */ \"(rsc)/./app/api/me/connections/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/me/connections/route\",\n        pathname: \"/api/me/connections\",\n        filename: \"route\",\n        bundlePath: \"app/api/me/connections/route\"\n    },\n    resolvedPagePath: \"/home/runner/workspace/app/api/me/connections/route.ts\",\n    nextConfigOutput,\n    userland: _home_runner_workspace_app_api_me_connections_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/me/connections/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZtZSUyRmNvbm5lY3Rpb25zJTJGcm91dGUmcGFnZT0lMkZhcGklMkZtZSUyRmNvbm5lY3Rpb25zJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGbWUlMkZjb25uZWN0aW9ucyUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNNO0FBQ25GO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8veXQtc2hvcnRzbWl0aC8/MTI2OSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcC9hcGkvbWUvY29ubmVjdGlvbnMvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL21lL2Nvbm5lY3Rpb25zL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvbWUvY29ubmVjdGlvbnNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL21lL2Nvbm5lY3Rpb25zL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcHAvYXBpL21lL2Nvbm5lY3Rpb25zL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9tZS9jb25uZWN0aW9ucy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fme%2Fconnections%2Froute&page=%2Fapi%2Fme%2Fconnections%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Fconnections%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/me/connections/route.ts":
/*!*****************************************!*\
  !*** ./app/api/me/connections/route.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _src_lib_session__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/src/lib/session */ \"(rsc)/./src/lib/session.ts\");\n/* harmony import */ var _src_lib_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/src/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\n\n\nasync function GET() {\n    try {\n        const session = await (0,_src_lib_session__WEBPACK_IMPORTED_MODULE_1__.requireAuth)();\n        if (!session.userId) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"User ID not found in session\"\n            }, {\n                status: 401\n            });\n        }\n        const user = await _src_lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n            where: {\n                id: session.userId\n            },\n            select: {\n                googleAccountId: true,\n                googleTokenExpiresAt: true,\n                youtubeCookies: true,\n                youtubeCookiesLastUsedAt: true\n            }\n        });\n        if (!user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"User not found\"\n            }, {\n                status: 404\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            hasOAuth: !!user.googleAccountId,\n            oauthExpired: user.googleTokenExpiresAt ? user.googleTokenExpiresAt < new Date() : true,\n            hasCookies: !!user.youtubeCookies,\n            cookiesLastUsedAt: user.youtubeCookiesLastUsedAt\n        });\n    } catch (error) {\n        console.error(\"Error fetching connections:\", error);\n        if (error.message === \"Authentication required\") {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Authentication required\"\n            }, {\n                status: 401\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to fetch connections\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL21lL2Nvbm5lY3Rpb25zL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBMEM7QUFDSztBQUNOO0FBRWxDLGVBQWVHO0lBQ3BCLElBQUk7UUFDRixNQUFNQyxVQUFVLE1BQU1ILDZEQUFXQTtRQUVqQyxJQUFJLENBQUNHLFFBQVFDLE1BQU0sRUFDbkI7WUFDRSxPQUFPTCxxREFBWUEsQ0FBQ00sSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUErQixHQUN4QztnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsTUFBTUMsT0FBTyxNQUFNUCxtREFBTUEsQ0FBQ08sSUFBSSxDQUFDQyxVQUFVLENBQUM7WUFDeENDLE9BQU87Z0JBQUVDLElBQUlSLFFBQVFDLE1BQU07WUFBQztZQUM1QlEsUUFBUTtnQkFDTkMsaUJBQWlCO2dCQUNqQkMsc0JBQXNCO2dCQUN0QkMsZ0JBQWdCO2dCQUNoQkMsMEJBQTBCO1lBQzVCO1FBQ0Y7UUFFQSxJQUFJLENBQUNSLE1BQ0w7WUFDRSxPQUFPVCxxREFBWUEsQ0FBQ00sSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUFpQixHQUMxQjtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsT0FBT1IscURBQVlBLENBQUNNLElBQUksQ0FBQztZQUN2QlksVUFBVSxDQUFDLENBQUNULEtBQUtLLGVBQWU7WUFDaENLLGNBQWNWLEtBQUtNLG9CQUFvQixHQUFHTixLQUFLTSxvQkFBb0IsR0FBRyxJQUFJSyxTQUFTO1lBQ25GQyxZQUFZLENBQUMsQ0FBQ1osS0FBS08sY0FBYztZQUNqQ00sbUJBQW1CYixLQUFLUSx3QkFBd0I7UUFDbEQ7SUFDRixFQUNBLE9BQU9WLE9BQVk7UUFDakJnQixRQUFRaEIsS0FBSyxDQUFDLCtCQUErQkE7UUFFN0MsSUFBSUEsTUFBTWlCLE9BQU8sS0FBSywyQkFDdEI7WUFDRSxPQUFPeEIscURBQVlBLENBQUNNLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBMEIsR0FDbkM7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLE9BQU9SLHFEQUFZQSxDQUFDTSxJQUFJLENBQ3RCO1lBQUVDLE9BQU87UUFBOEIsR0FDdkM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly95dC1zaG9ydHNtaXRoLy4vYXBwL2FwaS9tZS9jb25uZWN0aW9ucy9yb3V0ZS50cz9hMWJmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJ1xuaW1wb3J0IHsgcmVxdWlyZUF1dGggfSBmcm9tICdAL3NyYy9saWIvc2Vzc2lvbidcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJ0Avc3JjL2xpYi9wcmlzbWEnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHJlcXVpcmVBdXRoKClcbiAgICBcbiAgICBpZiAoIXNlc3Npb24udXNlcklkKVxuICAgIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ1VzZXIgSUQgbm90IGZvdW5kIGluIHNlc3Npb24nIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDEgfVxuICAgICAgKVxuICAgIH1cbiAgICBcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgICB3aGVyZTogeyBpZDogc2Vzc2lvbi51c2VySWQgfSxcbiAgICAgIHNlbGVjdDoge1xuICAgICAgICBnb29nbGVBY2NvdW50SWQ6IHRydWUsXG4gICAgICAgIGdvb2dsZVRva2VuRXhwaXJlc0F0OiB0cnVlLFxuICAgICAgICB5b3V0dWJlQ29va2llczogdHJ1ZSxcbiAgICAgICAgeW91dHViZUNvb2tpZXNMYXN0VXNlZEF0OiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICBcbiAgICBpZiAoIXVzZXIpXG4gICAge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiAnVXNlciBub3QgZm91bmQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDQgfVxuICAgICAgKVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgaGFzT0F1dGg6ICEhdXNlci5nb29nbGVBY2NvdW50SWQsXG4gICAgICBvYXV0aEV4cGlyZWQ6IHVzZXIuZ29vZ2xlVG9rZW5FeHBpcmVzQXQgPyB1c2VyLmdvb2dsZVRva2VuRXhwaXJlc0F0IDwgbmV3IERhdGUoKSA6IHRydWUsXG4gICAgICBoYXNDb29raWVzOiAhIXVzZXIueW91dHViZUNvb2tpZXMsXG4gICAgICBjb29raWVzTGFzdFVzZWRBdDogdXNlci55b3V0dWJlQ29va2llc0xhc3RVc2VkQXRcbiAgICB9KVxuICB9XG4gIGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgY29ubmVjdGlvbnM6JywgZXJyb3IpXG4gICAgXG4gICAgaWYgKGVycm9yLm1lc3NhZ2UgPT09ICdBdXRoZW50aWNhdGlvbiByZXF1aXJlZCcpXG4gICAge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiAnQXV0aGVudGljYXRpb24gcmVxdWlyZWQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDEgfVxuICAgICAgKVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiAnRmFpbGVkIHRvIGZldGNoIGNvbm5lY3Rpb25zJyB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKVxuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicmVxdWlyZUF1dGgiLCJwcmlzbWEiLCJHRVQiLCJzZXNzaW9uIiwidXNlcklkIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlkIiwic2VsZWN0IiwiZ29vZ2xlQWNjb3VudElkIiwiZ29vZ2xlVG9rZW5FeHBpcmVzQXQiLCJ5b3V0dWJlQ29va2llcyIsInlvdXR1YmVDb29raWVzTGFzdFVzZWRBdCIsImhhc09BdXRoIiwib2F1dGhFeHBpcmVkIiwiRGF0ZSIsImhhc0Nvb2tpZXMiLCJjb29raWVzTGFzdFVzZWRBdCIsImNvbnNvbGUiLCJtZXNzYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/me/connections/route.ts\n");

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
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/iron-session","vendor-chunks/iron-webcrypto","vendor-chunks/uncrypto"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fme%2Fconnections%2Froute&page=%2Fapi%2Fme%2Fconnections%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Fconnections%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();