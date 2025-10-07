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
exports.id = "app/api/videos/[id]/route";
exports.ids = ["app/api/videos/[id]/route"];
exports.modules = {

/***/ "@aws-sdk/client-s3":
/*!*************************************!*\
  !*** external "@aws-sdk/client-s3" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/client-s3");

/***/ }),

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

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fvideos%2F%5Bid%5D%2Froute&page=%2Fapi%2Fvideos%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvideos%2F%5Bid%5D%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fvideos%2F%5Bid%5D%2Froute&page=%2Fapi%2Fvideos%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvideos%2F%5Bid%5D%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_runner_workspace_app_api_videos_id_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/videos/[id]/route.ts */ \"(rsc)/./app/api/videos/[id]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/videos/[id]/route\",\n        pathname: \"/api/videos/[id]\",\n        filename: \"route\",\n        bundlePath: \"app/api/videos/[id]/route\"\n    },\n    resolvedPagePath: \"/home/runner/workspace/app/api/videos/[id]/route.ts\",\n    nextConfigOutput,\n    userland: _home_runner_workspace_app_api_videos_id_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/videos/[id]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZ2aWRlb3MlMkYlNUJpZCU1RCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGdmlkZW9zJTJGJTVCaWQlNUQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZ2aWRlb3MlMkYlNUJpZCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNHO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8veXQtc2hvcnRzbWl0aC8/ZDU0YiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcC9hcGkvdmlkZW9zL1tpZF0vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3ZpZGVvcy9baWRdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvdmlkZW9zL1tpZF1cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3ZpZGVvcy9baWRdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcHAvYXBpL3ZpZGVvcy9baWRdL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS92aWRlb3MvW2lkXS9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fvideos%2F%5Bid%5D%2Froute&page=%2Fapi%2Fvideos%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvideos%2F%5Bid%5D%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/videos/[id]/route.ts":
/*!**************************************!*\
  !*** ./app/api/videos/[id]/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _src_lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/src/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var _src_services_s3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/src/services/s3 */ \"(rsc)/./src/services/s3.ts\");\n/* harmony import */ var _src_lib_session__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/src/lib/session */ \"(rsc)/./src/lib/session.ts\");\n\n\n\n\nasync function getUrlForKey(key) {\n    try {\n        return await (0,_src_services_s3__WEBPACK_IMPORTED_MODULE_2__.getSignedUrlForKey)(key, 7200);\n    } catch (error) {\n        if (error.name === \"CredentialsProviderError\") {\n            console.warn(\"S3 credentials not configured, using direct URLs\");\n        } else {\n            console.warn(\"Failed to generate signed URL, falling back to direct URL:\", error);\n        }\n        return (0,_src_services_s3__WEBPACK_IMPORTED_MODULE_2__.getS3Url)(key);\n    }\n}\nasync function GET(request, { params }) {\n    try {\n        await (0,_src_lib_session__WEBPACK_IMPORTED_MODULE_3__.requireAuth)();\n        const video = await _src_lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.video.findUnique({\n            where: {\n                id: params.id\n            },\n            include: {\n                clips: {\n                    orderBy: {\n                        scoreOverall: \"desc\"\n                    }\n                }\n            }\n        });\n        if (!video) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Video not found\"\n            }, {\n                status: 404\n            });\n        }\n        const clipsWithUrls = await Promise.all(video.clips.map(async (clip)=>({\n                ...clip,\n                videoUrl: await getUrlForKey(clip.s3VideoKey),\n                thumbUrl: await getUrlForKey(clip.s3ThumbKey),\n                srtUrl: await getUrlForKey(clip.s3SrtKey)\n            })));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ...video,\n            clips: clipsWithUrls\n        });\n    } catch (error) {\n        console.error(\"Error fetching video:\", error);\n        if (error.message === \"Authentication required\") {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Authentication required\"\n            }, {\n                status: 401\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to fetch video\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3ZpZGVvcy9baWRdL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXVEO0FBQ2Q7QUFDdUI7QUFDakI7QUFFL0MsZUFBZUssYUFBYUMsR0FBVztJQUNyQyxJQUFJO1FBQ0YsT0FBTyxNQUFNSixvRUFBa0JBLENBQUNJLEtBQUs7SUFDdkMsRUFDQSxPQUFPQyxPQUFZO1FBQ2pCLElBQUlBLE1BQU1DLElBQUksS0FBSyw0QkFDbkI7WUFDRUMsUUFBUUMsSUFBSSxDQUFDO1FBQ2YsT0FFQTtZQUNFRCxRQUFRQyxJQUFJLENBQUMsOERBQThESDtRQUM3RTtRQUNBLE9BQU9KLDBEQUFRQSxDQUFDRztJQUNsQjtBQUNGO0FBRU8sZUFBZUssSUFDcEJDLE9BQW9CLEVBQ3BCLEVBQUVDLE1BQU0sRUFBOEI7SUFFdEMsSUFBSTtRQUNGLE1BQU1ULDZEQUFXQTtRQUVqQixNQUFNVSxRQUFRLE1BQU1iLG1EQUFNQSxDQUFDYSxLQUFLLENBQUNDLFVBQVUsQ0FBQztZQUMxQ0MsT0FBTztnQkFBRUMsSUFBSUosT0FBT0ksRUFBRTtZQUFDO1lBQ3ZCQyxTQUFTO2dCQUNQQyxPQUFPO29CQUNMQyxTQUFTO3dCQUFFQyxjQUFjO29CQUFPO2dCQUNsQztZQUNGO1FBQ0Y7UUFFQSxJQUFJLENBQUNQLE9BQ0w7WUFDRSxPQUFPZCxxREFBWUEsQ0FBQ3NCLElBQUksQ0FDdEI7Z0JBQUVmLE9BQU87WUFBa0IsR0FDM0I7Z0JBQUVnQixRQUFRO1lBQUk7UUFFbEI7UUFFQSxNQUFNQyxnQkFBZ0IsTUFBTUMsUUFBUUMsR0FBRyxDQUNyQ1osTUFBTUssS0FBSyxDQUFDUSxHQUFHLENBQUMsT0FBT0MsT0FBVTtnQkFDL0IsR0FBR0EsSUFBSTtnQkFDUEMsVUFBVSxNQUFNeEIsYUFBYXVCLEtBQUtFLFVBQVU7Z0JBQzVDQyxVQUFVLE1BQU0xQixhQUFhdUIsS0FBS0ksVUFBVTtnQkFDNUNDLFFBQVEsTUFBTTVCLGFBQWF1QixLQUFLTSxRQUFRO1lBQzFDO1FBR0YsT0FBT2xDLHFEQUFZQSxDQUFDc0IsSUFBSSxDQUFDO1lBQ3ZCLEdBQUdSLEtBQUs7WUFDUkssT0FBT0s7UUFDVDtJQUNGLEVBQ0EsT0FBT2pCLE9BQVk7UUFDakJFLFFBQVFGLEtBQUssQ0FBQyx5QkFBeUJBO1FBRXZDLElBQUlBLE1BQU00QixPQUFPLEtBQUssMkJBQ3RCO1lBQ0UsT0FBT25DLHFEQUFZQSxDQUFDc0IsSUFBSSxDQUN0QjtnQkFBRWYsT0FBTztZQUEwQixHQUNuQztnQkFBRWdCLFFBQVE7WUFBSTtRQUVsQjtRQUVBLE9BQU92QixxREFBWUEsQ0FBQ3NCLElBQUksQ0FDdEI7WUFBRWYsT0FBTztRQUF3QixHQUNqQztZQUFFZ0IsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly95dC1zaG9ydHNtaXRoLy4vYXBwL2FwaS92aWRlb3MvW2lkXS9yb3V0ZS50cz9mZDM5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJ0Avc3JjL2xpYi9wcmlzbWEnXG5pbXBvcnQgeyBnZXRTaWduZWRVcmxGb3JLZXksIGdldFMzVXJsIH0gZnJvbSAnQC9zcmMvc2VydmljZXMvczMnXG5pbXBvcnQgeyByZXF1aXJlQXV0aCB9IGZyb20gJ0Avc3JjL2xpYi9zZXNzaW9uJ1xuXG5hc3luYyBmdW5jdGlvbiBnZXRVcmxGb3JLZXkoa2V5OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBnZXRTaWduZWRVcmxGb3JLZXkoa2V5LCA3MjAwKVxuICB9XG4gIGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgaWYgKGVycm9yLm5hbWUgPT09ICdDcmVkZW50aWFsc1Byb3ZpZGVyRXJyb3InKVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2FybignUzMgY3JlZGVudGlhbHMgbm90IGNvbmZpZ3VyZWQsIHVzaW5nIGRpcmVjdCBVUkxzJylcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIGdlbmVyYXRlIHNpZ25lZCBVUkwsIGZhbGxpbmcgYmFjayB0byBkaXJlY3QgVVJMOicsIGVycm9yKVxuICAgIH1cbiAgICByZXR1cm4gZ2V0UzNVcmwoa2V5KVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoXG4gIHJlcXVlc3Q6IE5leHRSZXF1ZXN0LFxuICB7IHBhcmFtcyB9OiB7IHBhcmFtczogeyBpZDogc3RyaW5nIH0gfVxuKSB7XG4gIHRyeSB7XG4gICAgYXdhaXQgcmVxdWlyZUF1dGgoKVxuICAgIFxuICAgIGNvbnN0IHZpZGVvID0gYXdhaXQgcHJpc21hLnZpZGVvLmZpbmRVbmlxdWUoe1xuICAgICAgd2hlcmU6IHsgaWQ6IHBhcmFtcy5pZCB9LFxuICAgICAgaW5jbHVkZToge1xuICAgICAgICBjbGlwczoge1xuICAgICAgICAgIG9yZGVyQnk6IHsgc2NvcmVPdmVyYWxsOiAnZGVzYycgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBcbiAgICBpZiAoIXZpZGVvKVxuICAgIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ1ZpZGVvIG5vdCBmb3VuZCcgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwNCB9XG4gICAgICApXG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGNsaXBzV2l0aFVybHMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIHZpZGVvLmNsaXBzLm1hcChhc3luYyAoY2xpcCkgPT4gKHtcbiAgICAgICAgLi4uY2xpcCxcbiAgICAgICAgdmlkZW9Vcmw6IGF3YWl0IGdldFVybEZvcktleShjbGlwLnMzVmlkZW9LZXkpLFxuICAgICAgICB0aHVtYlVybDogYXdhaXQgZ2V0VXJsRm9yS2V5KGNsaXAuczNUaHVtYktleSksXG4gICAgICAgIHNydFVybDogYXdhaXQgZ2V0VXJsRm9yS2V5KGNsaXAuczNTcnRLZXkpXG4gICAgICB9KSlcbiAgICApXG4gICAgXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIC4uLnZpZGVvLFxuICAgICAgY2xpcHM6IGNsaXBzV2l0aFVybHNcbiAgICB9KVxuICB9XG4gIGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgdmlkZW86JywgZXJyb3IpXG4gICAgXG4gICAgaWYgKGVycm9yLm1lc3NhZ2UgPT09ICdBdXRoZW50aWNhdGlvbiByZXF1aXJlZCcpXG4gICAge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiAnQXV0aGVudGljYXRpb24gcmVxdWlyZWQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDEgfVxuICAgICAgKVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiAnRmFpbGVkIHRvIGZldGNoIHZpZGVvJyB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKVxuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicHJpc21hIiwiZ2V0U2lnbmVkVXJsRm9yS2V5IiwiZ2V0UzNVcmwiLCJyZXF1aXJlQXV0aCIsImdldFVybEZvcktleSIsImtleSIsImVycm9yIiwibmFtZSIsImNvbnNvbGUiLCJ3YXJuIiwiR0VUIiwicmVxdWVzdCIsInBhcmFtcyIsInZpZGVvIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiaWQiLCJpbmNsdWRlIiwiY2xpcHMiLCJvcmRlckJ5Iiwic2NvcmVPdmVyYWxsIiwianNvbiIsInN0YXR1cyIsImNsaXBzV2l0aFVybHMiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwiY2xpcCIsInZpZGVvVXJsIiwiczNWaWRlb0tleSIsInRodW1iVXJsIiwiczNUaHVtYktleSIsInNydFVybCIsInMzU3J0S2V5IiwibWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/videos/[id]/route.ts\n");

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

/***/ }),

/***/ "(rsc)/./src/services/s3.ts":
/*!****************************!*\
  !*** ./src/services/s3.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getS3Url: () => (/* binding */ getS3Url),\n/* harmony export */   getSignedUrlForKey: () => (/* binding */ getSignedUrlForKey),\n/* harmony export */   uploadBuffer: () => (/* binding */ uploadBuffer),\n/* harmony export */   uploadFile: () => (/* binding */ uploadFile)\n/* harmony export */ });\n/* harmony import */ var _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aws-sdk/client-s3 */ \"@aws-sdk/client-s3\");\n/* harmony import */ var _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _aws_sdk_s3_request_presigner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aws-sdk/s3-request-presigner */ \"(rsc)/./node_modules/@aws-sdk/s3-request-presigner/dist-es/getSignedUrl.js\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nconst s3Client = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.S3Client({\n    endpoint: process.env.S3_ENDPOINT,\n    region: process.env.S3_REGION || \"auto\",\n    credentials: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY ? {\n        accessKeyId: process.env.S3_ACCESS_KEY_ID,\n        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY\n    } : undefined\n});\nconst bucket = process.env.S3_BUCKET;\nasync function uploadFile(key, filePath, contentType) {\n    const fileContent = (0,fs__WEBPACK_IMPORTED_MODULE_1__.readFileSync)(filePath);\n    await s3Client.send(new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.PutObjectCommand({\n        Bucket: bucket,\n        Key: key,\n        Body: fileContent,\n        ContentType: contentType,\n        ContentDisposition: \"inline\"\n    }));\n    if (process.env.S3_ENDPOINT) {\n        return `${process.env.S3_ENDPOINT}/${bucket}/${key}`;\n    }\n    return `https://${bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;\n}\nasync function getSignedUrlForKey(key, expiresIn = 3600) {\n    const command = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.GetObjectCommand({\n        Bucket: bucket,\n        Key: key\n    });\n    return await (0,_aws_sdk_s3_request_presigner__WEBPACK_IMPORTED_MODULE_2__.getSignedUrl)(s3Client, command, {\n        expiresIn\n    });\n}\nasync function uploadBuffer(key, buffer, contentType) {\n    await s3Client.send(new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.PutObjectCommand({\n        Bucket: bucket,\n        Key: key,\n        Body: buffer,\n        ContentType: contentType,\n        ContentDisposition: \"inline\"\n    }));\n    if (process.env.S3_ENDPOINT) {\n        return `${process.env.S3_ENDPOINT}/${bucket}/${key}`;\n    }\n    return `https://${bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;\n}\nfunction getS3Url(key) {\n    if (process.env.S3_ENDPOINT) {\n        return `${process.env.S3_ENDPOINT}/${bucket}/${key}`;\n    }\n    return `https://${bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvc2VydmljZXMvczMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQWlGO0FBQ3JCO0FBQzNCO0FBRWpDLE1BQU1LLFdBQVcsSUFBSUwsd0RBQVFBLENBQUM7SUFDNUJNLFVBQVVDLFFBQVFDLEdBQUcsQ0FBQ0MsV0FBVztJQUNqQ0MsUUFBUUgsUUFBUUMsR0FBRyxDQUFDRyxTQUFTLElBQUk7SUFDakNDLGFBQWFMLFFBQVFDLEdBQUcsQ0FBQ0ssZ0JBQWdCLElBQUlOLFFBQVFDLEdBQUcsQ0FBQ00sb0JBQW9CLEdBQUc7UUFDOUVDLGFBQWFSLFFBQVFDLEdBQUcsQ0FBQ0ssZ0JBQWdCO1FBQ3pDRyxpQkFBaUJULFFBQVFDLEdBQUcsQ0FBQ00sb0JBQW9CO0lBQ25ELElBQUlHO0FBQ047QUFFQSxNQUFNQyxTQUFTWCxRQUFRQyxHQUFHLENBQUNXLFNBQVM7QUFFN0IsZUFBZUMsV0FBV0MsR0FBVyxFQUFFQyxRQUFnQixFQUFFQyxXQUFtQjtJQUNqRixNQUFNQyxjQUFjcEIsZ0RBQVlBLENBQUNrQjtJQUVqQyxNQUFNakIsU0FBU29CLElBQUksQ0FBQyxJQUFJeEIsZ0VBQWdCQSxDQUFDO1FBQ3ZDeUIsUUFBUVI7UUFDUlMsS0FBS047UUFDTE8sTUFBTUo7UUFDTkssYUFBYU47UUFDYk8sb0JBQW9CO0lBQ3RCO0lBRUEsSUFBSXZCLFFBQVFDLEdBQUcsQ0FBQ0MsV0FBVyxFQUMzQjtRQUNFLE9BQU8sQ0FBQyxFQUFFRixRQUFRQyxHQUFHLENBQUNDLFdBQVcsQ0FBQyxDQUFDLEVBQUVTLE9BQU8sQ0FBQyxFQUFFRyxJQUFJLENBQUM7SUFDdEQ7SUFDQSxPQUFPLENBQUMsUUFBUSxFQUFFSCxPQUFPLElBQUksRUFBRVgsUUFBUUMsR0FBRyxDQUFDRyxTQUFTLENBQUMsZUFBZSxFQUFFVSxJQUFJLENBQUM7QUFDN0U7QUFFTyxlQUFlVSxtQkFBbUJWLEdBQVcsRUFBRVcsWUFBb0IsSUFBSTtJQUM1RSxNQUFNQyxVQUFVLElBQUkvQixnRUFBZ0JBLENBQUM7UUFDbkN3QixRQUFRUjtRQUNSUyxLQUFLTjtJQUNQO0lBRUEsT0FBTyxNQUFNbEIsMkVBQVlBLENBQUNFLFVBQVU0QixTQUFTO1FBQUVEO0lBQVU7QUFDM0Q7QUFFTyxlQUFlRSxhQUFhYixHQUFXLEVBQUVjLE1BQWMsRUFBRVosV0FBbUI7SUFDakYsTUFBTWxCLFNBQVNvQixJQUFJLENBQUMsSUFBSXhCLGdFQUFnQkEsQ0FBQztRQUN2Q3lCLFFBQVFSO1FBQ1JTLEtBQUtOO1FBQ0xPLE1BQU1PO1FBQ05OLGFBQWFOO1FBQ2JPLG9CQUFvQjtJQUN0QjtJQUVBLElBQUl2QixRQUFRQyxHQUFHLENBQUNDLFdBQVcsRUFDM0I7UUFDRSxPQUFPLENBQUMsRUFBRUYsUUFBUUMsR0FBRyxDQUFDQyxXQUFXLENBQUMsQ0FBQyxFQUFFUyxPQUFPLENBQUMsRUFBRUcsSUFBSSxDQUFDO0lBQ3REO0lBQ0EsT0FBTyxDQUFDLFFBQVEsRUFBRUgsT0FBTyxJQUFJLEVBQUVYLFFBQVFDLEdBQUcsQ0FBQ0csU0FBUyxDQUFDLGVBQWUsRUFBRVUsSUFBSSxDQUFDO0FBQzdFO0FBRU8sU0FBU2UsU0FBU2YsR0FBVztJQUNsQyxJQUFJZCxRQUFRQyxHQUFHLENBQUNDLFdBQVcsRUFDM0I7UUFDRSxPQUFPLENBQUMsRUFBRUYsUUFBUUMsR0FBRyxDQUFDQyxXQUFXLENBQUMsQ0FBQyxFQUFFUyxPQUFPLENBQUMsRUFBRUcsSUFBSSxDQUFDO0lBQ3REO0lBQ0EsT0FBTyxDQUFDLFFBQVEsRUFBRUgsT0FBTyxJQUFJLEVBQUVYLFFBQVFDLEdBQUcsQ0FBQ0csU0FBUyxDQUFDLGVBQWUsRUFBRVUsSUFBSSxDQUFDO0FBQzdFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8veXQtc2hvcnRzbWl0aC8uL3NyYy9zZXJ2aWNlcy9zMy50cz84NGVkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFMzQ2xpZW50LCBQdXRPYmplY3RDb21tYW5kLCBHZXRPYmplY3RDb21tYW5kIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXMzJ1xuaW1wb3J0IHsgZ2V0U2lnbmVkVXJsIH0gZnJvbSAnQGF3cy1zZGsvczMtcmVxdWVzdC1wcmVzaWduZXInXG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcydcblxuY29uc3QgczNDbGllbnQgPSBuZXcgUzNDbGllbnQoe1xuICBlbmRwb2ludDogcHJvY2Vzcy5lbnYuUzNfRU5EUE9JTlQsXG4gIHJlZ2lvbjogcHJvY2Vzcy5lbnYuUzNfUkVHSU9OIHx8ICdhdXRvJyxcbiAgY3JlZGVudGlhbHM6IHByb2Nlc3MuZW52LlMzX0FDQ0VTU19LRVlfSUQgJiYgcHJvY2Vzcy5lbnYuUzNfU0VDUkVUX0FDQ0VTU19LRVkgPyB7XG4gICAgYWNjZXNzS2V5SWQ6IHByb2Nlc3MuZW52LlMzX0FDQ0VTU19LRVlfSUQsXG4gICAgc2VjcmV0QWNjZXNzS2V5OiBwcm9jZXNzLmVudi5TM19TRUNSRVRfQUNDRVNTX0tFWVxuICB9IDogdW5kZWZpbmVkXG59KVxuXG5jb25zdCBidWNrZXQgPSBwcm9jZXNzLmVudi5TM19CVUNLRVQhXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGxvYWRGaWxlKGtleTogc3RyaW5nLCBmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50VHlwZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgZmlsZUNvbnRlbnQgPSByZWFkRmlsZVN5bmMoZmlsZVBhdGgpXG4gIFxuICBhd2FpdCBzM0NsaWVudC5zZW5kKG5ldyBQdXRPYmplY3RDb21tYW5kKHtcbiAgICBCdWNrZXQ6IGJ1Y2tldCxcbiAgICBLZXk6IGtleSxcbiAgICBCb2R5OiBmaWxlQ29udGVudCxcbiAgICBDb250ZW50VHlwZTogY29udGVudFR5cGUsXG4gICAgQ29udGVudERpc3Bvc2l0aW9uOiAnaW5saW5lJ1xuICB9KSlcbiAgXG4gIGlmIChwcm9jZXNzLmVudi5TM19FTkRQT0lOVClcbiAge1xuICAgIHJldHVybiBgJHtwcm9jZXNzLmVudi5TM19FTkRQT0lOVH0vJHtidWNrZXR9LyR7a2V5fWBcbiAgfVxuICByZXR1cm4gYGh0dHBzOi8vJHtidWNrZXR9LnMzLiR7cHJvY2Vzcy5lbnYuUzNfUkVHSU9OfS5hbWF6b25hd3MuY29tLyR7a2V5fWBcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNpZ25lZFVybEZvcktleShrZXk6IHN0cmluZywgZXhwaXJlc0luOiBudW1iZXIgPSAzNjAwKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgY29tbWFuZCA9IG5ldyBHZXRPYmplY3RDb21tYW5kKHtcbiAgICBCdWNrZXQ6IGJ1Y2tldCxcbiAgICBLZXk6IGtleVxuICB9KVxuICBcbiAgcmV0dXJuIGF3YWl0IGdldFNpZ25lZFVybChzM0NsaWVudCwgY29tbWFuZCwgeyBleHBpcmVzSW4gfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwbG9hZEJ1ZmZlcihrZXk6IHN0cmluZywgYnVmZmVyOiBCdWZmZXIsIGNvbnRlbnRUeXBlOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICBhd2FpdCBzM0NsaWVudC5zZW5kKG5ldyBQdXRPYmplY3RDb21tYW5kKHtcbiAgICBCdWNrZXQ6IGJ1Y2tldCxcbiAgICBLZXk6IGtleSxcbiAgICBCb2R5OiBidWZmZXIsXG4gICAgQ29udGVudFR5cGU6IGNvbnRlbnRUeXBlLFxuICAgIENvbnRlbnREaXNwb3NpdGlvbjogJ2lubGluZSdcbiAgfSkpXG4gIFxuICBpZiAocHJvY2Vzcy5lbnYuUzNfRU5EUE9JTlQpXG4gIHtcbiAgICByZXR1cm4gYCR7cHJvY2Vzcy5lbnYuUzNfRU5EUE9JTlR9LyR7YnVja2V0fS8ke2tleX1gXG4gIH1cbiAgcmV0dXJuIGBodHRwczovLyR7YnVja2V0fS5zMy4ke3Byb2Nlc3MuZW52LlMzX1JFR0lPTn0uYW1hem9uYXdzLmNvbS8ke2tleX1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTM1VybChrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChwcm9jZXNzLmVudi5TM19FTkRQT0lOVClcbiAge1xuICAgIHJldHVybiBgJHtwcm9jZXNzLmVudi5TM19FTkRQT0lOVH0vJHtidWNrZXR9LyR7a2V5fWBcbiAgfVxuICByZXR1cm4gYGh0dHBzOi8vJHtidWNrZXR9LnMzLiR7cHJvY2Vzcy5lbnYuUzNfUkVHSU9OfS5hbWF6b25hd3MuY29tLyR7a2V5fWBcbn1cbiJdLCJuYW1lcyI6WyJTM0NsaWVudCIsIlB1dE9iamVjdENvbW1hbmQiLCJHZXRPYmplY3RDb21tYW5kIiwiZ2V0U2lnbmVkVXJsIiwicmVhZEZpbGVTeW5jIiwiczNDbGllbnQiLCJlbmRwb2ludCIsInByb2Nlc3MiLCJlbnYiLCJTM19FTkRQT0lOVCIsInJlZ2lvbiIsIlMzX1JFR0lPTiIsImNyZWRlbnRpYWxzIiwiUzNfQUNDRVNTX0tFWV9JRCIsIlMzX1NFQ1JFVF9BQ0NFU1NfS0VZIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJ1bmRlZmluZWQiLCJidWNrZXQiLCJTM19CVUNLRVQiLCJ1cGxvYWRGaWxlIiwia2V5IiwiZmlsZVBhdGgiLCJjb250ZW50VHlwZSIsImZpbGVDb250ZW50Iiwic2VuZCIsIkJ1Y2tldCIsIktleSIsIkJvZHkiLCJDb250ZW50VHlwZSIsIkNvbnRlbnREaXNwb3NpdGlvbiIsImdldFNpZ25lZFVybEZvcktleSIsImV4cGlyZXNJbiIsImNvbW1hbmQiLCJ1cGxvYWRCdWZmZXIiLCJidWZmZXIiLCJnZXRTM1VybCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/services/s3.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/iron-session","vendor-chunks/iron-webcrypto","vendor-chunks/uncrypto","vendor-chunks/@smithy","vendor-chunks/@aws-sdk"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fvideos%2F%5Bid%5D%2Froute&page=%2Fapi%2Fvideos%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvideos%2F%5Bid%5D%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();