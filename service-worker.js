"use strict";var precacheConfig=[["/index.html","15895a1dcc0b37ad1239d384dae1bdcb"],["/static/css/main.6c39c933.css","642e18cc97eab616b1e02dbf34e7a1b7"],["/static/js/main.f2593779.js","657a5d399686b3ed11594813796a514f"],["/static/media/3dlet.ddd99a49.ttf","ddd99a49b60ee25f771858c4f647c792"],["/static/media/Amazon.dc563c3e.ttf","dc563c3e0db1059ee4636cdca14178b1"],["/static/media/Animales.88393c5b.ttf","88393c5bb5b7d37460b3682905690992"],["/static/media/Answer.e9ec7958.ttf","e9ec79585e78991dcee140dbedf0ba46"],["/static/media/Answer3DFilled-Italic.72937741.ttf","72937741809df7d655a1d86f9a550db4"],["/static/media/Assyrian.c3bf3966.ttf","c3bf39664c168780a078b971a557b7d9"],["/static/media/Assyrian3D.63def7d2.ttf","63def7d247be33b30826b40340820f34"],["/static/media/Beyond.ebaf4dad.ttf","ebaf4dad3442aaffc9e9dc4f15a18c8b"],["/static/media/Blox2.0eacdeed.ttf","0eacdeed89800b40c5d73b6c00863f31"],["/static/media/Burn.5e5aa01e.ttf","5e5aa01e902ffea766e7e5fb8752b82f"],["/static/media/Facon.b6d3c757.ttf","b6d3c75722af4490900128147524d7d4"],["/static/media/Revolt.8e4fedd3.ttf","8e4fedd335cb630da95acb7220ea6210"],["/static/media/background.86b4e5c3.png","86b4e5c330dfabfc82828fb9d020c7b0"],["/static/media/crackman.0db55dc1.ttf","0db55dc1a56c66b08bed801ac69d941f"],["/static/media/dictionary.8af2c949.csv","8af2c9491713274bef9556f3e2377e94"],["/static/media/time.f927c485.ttf","f927c4855c5d9af584b335c106549b7d"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,a,n){var c=new URL(e);return n&&c.pathname.match(n)||(c.search+=(c.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),c.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,a){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return a.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],n=new URL(t,self.location),c=createCacheKey(n,hashParamName,a,/\.\w{8}\./);return[n.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(n){return setOfCachedUrls(n).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!a.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return n.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!a.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,a=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),n="index.html";(e=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,n),e=urlsToCacheKeys.has(a));var c="/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(a=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(a)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});