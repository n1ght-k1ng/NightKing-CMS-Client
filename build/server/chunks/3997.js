"use strict";
exports.id = 3997;
exports.ids = [3997];
exports.modules = {

/***/ 8760:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
let chalk;
if (false) {} else {
    chalk = __webpack_require__(4426);
}
var _default = chalk;
exports["default"] = _default;

//# sourceMappingURL=chalk.js.map

/***/ }),

/***/ 3997:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
__webpack_unused_export__ = loadCustomRoutes;
__webpack_unused_export__ = normalizeRouteRegex;
var _chalk = _interopRequireDefault(__webpack_require__(8760));
var _escapeRegexp = __webpack_require__(7664);
var _tryToParsePath = __webpack_require__(9738);
var _redirectStatus = __webpack_require__(746);
async function loadCustomRoutes(config) {
    const [headers, rewrites, redirects] = await Promise.all([
        loadHeaders(config),
        loadRewrites(config),
        loadRedirects(config), 
    ]);
    const totalRewrites = rewrites.beforeFiles.length + rewrites.afterFiles.length + rewrites.fallback.length;
    const totalRoutes = headers.length + redirects.length + totalRewrites;
    if (totalRoutes > 1000) {
        console.warn(_chalk.default.bold.yellow(`Warning: `) + `total number of custom routes exceeds 1000, this can reduce performance. Route counts:\n` + `headers: ${headers.length}\n` + `rewrites: ${totalRewrites}\n` + `redirects: ${redirects.length}\n` + `See more info: https://nextjs.org/docs/messages/max-custom-routes-reached`);
    }
    if (config.trailingSlash) {
        redirects.unshift({
            source: "/:file((?!\\.well-known(?:/.*)?)(?:[^/]+/)*[^/]+\\.\\w+)/",
            destination: "/:file",
            permanent: true,
            locale: config.i18n ? false : undefined,
            internal: true
        }, {
            source: "/:notfile((?!\\.well-known(?:/.*)?)(?:[^/]+/)*[^/\\.]+)",
            destination: "/:notfile/",
            permanent: true,
            locale: config.i18n ? false : undefined,
            internal: true
        });
        if (config.basePath) {
            redirects.unshift({
                source: config.basePath,
                destination: config.basePath + "/",
                permanent: true,
                basePath: false,
                locale: config.i18n ? false : undefined,
                internal: true
            });
        }
    } else {
        redirects.unshift({
            source: "/:path+/",
            destination: "/:path+",
            permanent: true,
            locale: config.i18n ? false : undefined,
            internal: true
        });
        if (config.basePath) {
            redirects.unshift({
                source: config.basePath + "/",
                destination: config.basePath,
                permanent: true,
                basePath: false,
                locale: config.i18n ? false : undefined,
                internal: true
            });
        }
    }
    return {
        headers,
        rewrites,
        redirects
    };
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const allowedHasTypes = new Set([
    "header",
    "cookie",
    "query",
    "host"
]);
const namedGroupsRegex = /\(\?<([a-zA-Z][a-zA-Z0-9]*)>/g;
function normalizeRouteRegex(regex) {
    // clean up un-necessary escaping from regex.source which turns / into \\/
    return regex.replace(/\\\//g, "/");
}
function checkRedirect(route) {
    const invalidParts = [];
    let hadInvalidStatus = false;
    if (route.statusCode && !_redirectStatus.allowedStatusCodes.has(route.statusCode)) {
        hadInvalidStatus = true;
        invalidParts.push(`\`statusCode\` is not undefined or valid statusCode`);
    }
    if (typeof route.permanent !== "boolean" && !route.statusCode) {
        invalidParts.push(`\`permanent\` is not set to \`true\` or \`false\``);
    }
    return {
        invalidParts,
        hadInvalidStatus
    };
}
function checkHeader(route) {
    const invalidParts = [];
    if (!Array.isArray(route.headers)) {
        invalidParts.push("`headers` field must be an array");
    } else if (route.headers.length === 0) {
        invalidParts.push("`headers` field cannot be empty");
    } else {
        for (const header of route.headers){
            if (!header || typeof header !== "object") {
                invalidParts.push("`headers` items must be object with { key: '', value: '' }");
                break;
            }
            if (typeof header.key !== "string") {
                invalidParts.push("`key` in header item must be string");
                break;
            }
            if (typeof header.value !== "string") {
                invalidParts.push("`value` in header item must be string");
                break;
            }
        }
    }
    return invalidParts;
}
function checkCustomRoutes(routes, type) {
    if (!Array.isArray(routes)) {
        console.error(`Error: ${type}s must return an array, received ${typeof routes}.\n` + `See here for more info: https://nextjs.org/docs/messages/routes-must-be-array`);
        process.exit(1);
    }
    let numInvalidRoutes = 0;
    let hadInvalidStatus = false;
    let hadInvalidHas = false;
    const allowedKeys = new Set([
        "source",
        "basePath",
        "locale",
        "has"
    ]);
    if (type === "rewrite") {
        allowedKeys.add("destination");
    }
    if (type === "redirect") {
        allowedKeys.add("statusCode");
        allowedKeys.add("permanent");
        allowedKeys.add("destination");
    }
    if (type === "header") {
        allowedKeys.add("headers");
    }
    for (const route of routes){
        if (!route || typeof route !== "object") {
            console.error(`The route ${JSON.stringify(route)} is not a valid object with \`source\` and \`${type === "header" ? "headers" : "destination"}\``);
            numInvalidRoutes++;
            continue;
        }
        if (type === "rewrite" && route.basePath === false && !(route.destination.startsWith("http://") || route.destination.startsWith("https://"))) {
            console.error(`The route ${route.source} rewrites urls outside of the basePath. Please use a destination that starts with \`http://\` or \`https://\` https://nextjs.org/docs/messages/invalid-external-rewrite`);
            numInvalidRoutes++;
            continue;
        }
        const keys = Object.keys(route);
        const invalidKeys = keys.filter((key)=>!allowedKeys.has(key));
        const invalidParts = [];
        if (typeof route.basePath !== "undefined" && route.basePath !== false) {
            invalidParts.push("`basePath` must be undefined or false");
        }
        if (typeof route.locale !== "undefined" && route.locale !== false) {
            invalidParts.push("`locale` must be undefined or false");
        }
        if (typeof route.has !== "undefined" && !Array.isArray(route.has)) {
            invalidParts.push("`has` must be undefined or valid has object");
            hadInvalidHas = true;
        } else if (route.has) {
            const invalidHasItems = [];
            for (const hasItem of route.has){
                let invalidHasParts = [];
                if (!allowedHasTypes.has(hasItem.type)) {
                    invalidHasParts.push(`invalid type "${hasItem.type}"`);
                }
                if (typeof hasItem.key !== "string" && hasItem.type !== "host") {
                    invalidHasParts.push(`invalid key "${hasItem.key}"`);
                }
                if (typeof hasItem.value !== "undefined" && typeof hasItem.value !== "string") {
                    invalidHasParts.push(`invalid value "${hasItem.value}"`);
                }
                if (typeof hasItem.value === "undefined" && hasItem.type === "host") {
                    invalidHasParts.push(`value is required for "host" type`);
                }
                if (invalidHasParts.length > 0) {
                    invalidHasItems.push(`${invalidHasParts.join(", ")} for ${JSON.stringify(hasItem)}`);
                }
            }
            if (invalidHasItems.length > 0) {
                hadInvalidHas = true;
                const itemStr = `item${invalidHasItems.length === 1 ? "" : "s"}`;
                console.error(`Invalid \`has\` ${itemStr}:\n` + invalidHasItems.join("\n"));
                console.error();
                invalidParts.push(`invalid \`has\` ${itemStr} found`);
            }
        }
        if (!route.source) {
            invalidParts.push("`source` is missing");
        } else if (typeof route.source !== "string") {
            invalidParts.push("`source` is not a string");
        } else if (!route.source.startsWith("/")) {
            invalidParts.push("`source` does not start with /");
        }
        if (type === "header") {
            invalidParts.push(...checkHeader(route));
        } else {
            let _route = route;
            if (!_route.destination) {
                invalidParts.push("`destination` is missing");
            } else if (typeof _route.destination !== "string") {
                invalidParts.push("`destination` is not a string");
            } else if (type === "rewrite" && !_route.destination.match(/^(\/|https:\/\/|http:\/\/)/)) {
                invalidParts.push("`destination` does not start with `/`, `http://`, or `https://`");
            }
        }
        if (type === "redirect") {
            const result = checkRedirect(route);
            hadInvalidStatus = hadInvalidStatus || result.hadInvalidStatus;
            invalidParts.push(...result.invalidParts);
        }
        let sourceTokens;
        if (typeof route.source === "string" && route.source.startsWith("/")) {
            // only show parse error if we didn't already show error
            // for not being a string
            const { tokens , error , regexStr  } = (0, _tryToParsePath).tryToParsePath(route.source);
            if (error) {
                invalidParts.push("`source` parse failed");
            }
            if (regexStr && regexStr.length > 4096) {
                invalidParts.push("`source` exceeds max built length of 4096");
            }
            sourceTokens = tokens;
        }
        const hasSegments = new Set();
        if (route.has) {
            for (const hasItem of route.has){
                if (!hasItem.value && hasItem.key) {
                    hasSegments.add(hasItem.key);
                }
                if (hasItem.value) {
                    for (const match of hasItem.value.matchAll(namedGroupsRegex)){
                        if (match[1]) {
                            hasSegments.add(match[1]);
                        }
                    }
                    if (hasItem.type === "host") {
                        hasSegments.add("host");
                    }
                }
            }
        }
        // make sure no unnamed patterns are attempted to be used in the
        // destination as this can cause confusion and is not allowed
        if (typeof route.destination === "string") {
            if (route.destination.startsWith("/") && Array.isArray(sourceTokens)) {
                const unnamedInDest = new Set();
                for (const token of sourceTokens){
                    if (typeof token === "object" && typeof token.name === "number") {
                        const unnamedIndex = new RegExp(`:${token.name}(?!\\d)`);
                        if (route.destination.match(unnamedIndex)) {
                            unnamedInDest.add(`:${token.name}`);
                        }
                    }
                }
                if (unnamedInDest.size > 0) {
                    invalidParts.push(`\`destination\` has unnamed params ${[
                        ...unnamedInDest
                    ].join(", ")}`);
                } else {
                    const { tokens: destTokens , regexStr: destRegexStr , error: destinationParseFailed ,  } = (0, _tryToParsePath).tryToParsePath(route.destination, {
                        handleUrl: true
                    });
                    if (destRegexStr && destRegexStr.length > 4096) {
                        invalidParts.push("`destination` exceeds max built length of 4096");
                    }
                    if (destinationParseFailed) {
                        invalidParts.push("`destination` parse failed");
                    } else {
                        const sourceSegments = new Set(sourceTokens.map((item)=>typeof item === "object" && item.name).filter(Boolean));
                        const invalidDestSegments = new Set();
                        for (const token of destTokens){
                            if (typeof token === "object" && !sourceSegments.has(token.name) && !hasSegments.has(token.name)) {
                                invalidDestSegments.add(token.name);
                            }
                        }
                        if (invalidDestSegments.size) {
                            invalidParts.push(`\`destination\` has segments not in \`source\` or \`has\` (${[
                                ...invalidDestSegments, 
                            ].join(", ")})`);
                        }
                    }
                }
            }
        }
        const hasInvalidKeys = invalidKeys.length > 0;
        const hasInvalidParts = invalidParts.length > 0;
        if (hasInvalidKeys || hasInvalidParts) {
            console.error(`${invalidParts.join(", ")}${invalidKeys.length ? (hasInvalidParts ? "," : "") + ` invalid field${invalidKeys.length === 1 ? "" : "s"}: ` + invalidKeys.join(",") : ""} for route ${JSON.stringify(route)}`);
            console.error();
            numInvalidRoutes++;
        }
    }
    if (numInvalidRoutes > 0) {
        if (hadInvalidStatus) {
            console.error(`\nValid redirect statusCode values are ${[
                ..._redirectStatus.allowedStatusCodes
            ].join(", ")}`);
        }
        if (hadInvalidHas) {
            console.error(`\nValid \`has\` object shape is ${JSON.stringify({
                type: [
                    ...allowedHasTypes
                ].join(", "),
                key: "the key to check for",
                value: "undefined or a value string to match against"
            }, null, 2)}`);
        }
        console.error();
        console.error(`Error: Invalid ${type}${numInvalidRoutes === 1 ? "" : "s"} found`);
        process.exit(1);
    }
}
function processRoutes(routes, config, type) {
    const _routes = routes;
    const newRoutes = [];
    const defaultLocales = [];
    if (config.i18n && type === "redirect") {
        var ref;
        for (const item of ((ref = config.i18n) == null ? void 0 : ref.domains) || []){
            defaultLocales.push({
                locale: item.defaultLocale,
                base: `http${item.http ? "" : "s"}://${item.domain}`
            });
        }
        defaultLocales.push({
            locale: config.i18n.defaultLocale,
            base: ""
        });
    }
    for (const r of _routes){
        var ref1;
        const srcBasePath = config.basePath && r.basePath !== false ? config.basePath : "";
        const isExternal = !((ref1 = r.destination) == null ? void 0 : ref1.startsWith("/"));
        const destBasePath = srcBasePath && !isExternal ? srcBasePath : "";
        if (config.i18n && r.locale !== false) {
            var ref2;
            if (!isExternal) {
                defaultLocales.forEach((item)=>{
                    let destination;
                    if (r.destination) {
                        destination = item.base ? `${item.base}${destBasePath}${r.destination}` : `${destBasePath}${r.destination}`;
                    }
                    newRoutes.push({
                        ...r,
                        destination,
                        source: `${srcBasePath}/${item.locale}${r.source}`
                    });
                });
            }
            r.source = `/:nextInternalLocale(${config.i18n.locales.map((locale)=>(0, _escapeRegexp).escapeStringRegexp(locale)).join("|")})${r.source === "/" && !config.trailingSlash ? "" : r.source}`;
            if (r.destination && ((ref2 = r.destination) == null ? void 0 : ref2.startsWith("/"))) {
                r.destination = `/:nextInternalLocale${r.destination === "/" && !config.trailingSlash ? "" : r.destination}`;
            }
        }
        r.source = `${srcBasePath}${r.source === "/" && srcBasePath ? "" : r.source}`;
        if (r.destination) {
            r.destination = `${destBasePath}${r.destination === "/" && destBasePath ? "" : r.destination}`;
        }
        newRoutes.push(r);
    }
    return newRoutes;
}
async function loadRedirects(config) {
    if (typeof config.redirects !== "function") {
        return [];
    }
    let redirects = await config.redirects();
    // check before we process the routes and after to ensure
    // they are still valid
    checkCustomRoutes(redirects, "redirect");
    redirects = processRoutes(redirects, config, "redirect");
    checkCustomRoutes(redirects, "redirect");
    return redirects;
}
async function loadRewrites(config) {
    if (typeof config.rewrites !== "function") {
        return {
            beforeFiles: [],
            afterFiles: [],
            fallback: []
        };
    }
    const _rewrites = await config.rewrites();
    let beforeFiles = [];
    let afterFiles = [];
    let fallback = [];
    if (!Array.isArray(_rewrites) && typeof _rewrites === "object" && Object.keys(_rewrites).every((key)=>key === "beforeFiles" || key === "afterFiles" || key === "fallback")) {
        beforeFiles = _rewrites.beforeFiles || [];
        afterFiles = _rewrites.afterFiles || [];
        fallback = _rewrites.fallback || [];
    } else {
        afterFiles = _rewrites;
    }
    // check before we process the routes and after to ensure
    // they are still valid
    checkCustomRoutes(beforeFiles, "rewrite");
    checkCustomRoutes(afterFiles, "rewrite");
    checkCustomRoutes(fallback, "rewrite");
    beforeFiles = processRoutes(beforeFiles, config, "rewrite");
    afterFiles = processRoutes(afterFiles, config, "rewrite");
    fallback = processRoutes(fallback, config, "rewrite");
    checkCustomRoutes(beforeFiles, "rewrite");
    checkCustomRoutes(afterFiles, "rewrite");
    checkCustomRoutes(fallback, "rewrite");
    return {
        beforeFiles,
        afterFiles,
        fallback
    };
}
async function loadHeaders(config) {
    if (typeof config.headers !== "function") {
        return [];
    }
    let headers = await config.headers();
    // check before we process the routes and after to ensure
    // they are still valid
    checkCustomRoutes(headers, "header");
    headers = processRoutes(headers, config, "header");
    checkCustomRoutes(headers, "header");
    return headers;
}

//# sourceMappingURL=load-custom-routes.js.map

/***/ }),

/***/ 746:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getRedirectStatus = getRedirectStatus;
exports.modifyRouteRegex = modifyRouteRegex;
exports.allowedStatusCodes = void 0;
var _constants = __webpack_require__(6724);
const allowedStatusCodes = new Set([
    301,
    302,
    303,
    307,
    308
]);
exports.allowedStatusCodes = allowedStatusCodes;
function getRedirectStatus(route) {
    return route.statusCode || (route.permanent ? _constants.PERMANENT_REDIRECT_STATUS : _constants.TEMPORARY_REDIRECT_STATUS);
}
function modifyRouteRegex(regex, restrictedPaths) {
    if (restrictedPaths) {
        regex = regex.replace(/\^/, `^(?!${restrictedPaths.map((path)=>path.replace(/\//g, "\\/")).join("|")})`);
    }
    regex = regex.replace(/\$$/, "(?:\\/)?$");
    return regex;
}

//# sourceMappingURL=redirect-status.js.map

/***/ }),

/***/ 9738:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.tryToParsePath = tryToParsePath;
var _pathToRegexp = __webpack_require__(7999);
var _url = __webpack_require__(7310);
var _isError = _interopRequireDefault(__webpack_require__(676));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function tryToParsePath(route, options) {
    const result = {
        route,
        parsedPath: route
    };
    try {
        if (options == null ? void 0 : options.handleUrl) {
            const parsed = (0, _url).parse(route, true);
            result.parsedPath = `${parsed.pathname}${parsed.hash || ""}`;
        }
        result.tokens = (0, _pathToRegexp).parse(result.parsedPath);
        result.regexStr = (0, _pathToRegexp).tokensToRegexp(result.tokens).source;
    } catch (err) {
        reportError(result, err);
        result.error = err;
    }
    return result;
}
/**
 * If there is an error show our error link but still show original error or
 * a formatted one if we can
 */ function reportError({ route , parsedPath  }, err) {
    let errMatches;
    if ((0, _isError).default(err) && (errMatches = err.message.match(/at (\d{0,})/))) {
        const position = parseInt(errMatches[1], 10);
        console.error(`\nError parsing \`${route}\` ` + `https://nextjs.org/docs/messages/invalid-route-source\n` + `Reason: ${err.message}\n\n` + `  ${parsedPath}\n` + `  ${new Array(position).fill(" ").join("")}^\n`);
    } else {
        console.error(`\nError parsing ${route} https://nextjs.org/docs/messages/invalid-route-source`, err);
    }
}

//# sourceMappingURL=try-to-parse-path.js.map

/***/ })

};
;