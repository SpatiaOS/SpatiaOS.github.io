(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const h of c.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function i(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(l){if(l.ep)return;l.ep=!0;const c=i(l);fetch(l.href,c)}})();var Th={exports:{}},qo={};var p_;function Ly(){if(p_)return qo;p_=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function i(s,l,c){var h=null;if(c!==void 0&&(h=""+c),l.key!==void 0&&(h=""+l.key),"key"in l){c={};for(var p in l)p!=="key"&&(c[p]=l[p])}else c=l;return l=c.ref,{$$typeof:r,type:s,key:h,ref:l!==void 0?l:null,props:c}}return qo.Fragment=t,qo.jsx=i,qo.jsxs=i,qo}var m_;function Ny(){return m_||(m_=1,Th.exports=Ly()),Th.exports}var U=Ny(),Ah={exports:{}},ae={};var g_;function Oy(){if(g_)return ae;g_=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),h=Symbol.for("react.context"),p=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),d=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),v=Symbol.for("react.activity"),g=Symbol.iterator;function M(I){return I===null||typeof I!="object"?null:(I=g&&I[g]||I["@@iterator"],typeof I=="function"?I:null)}var b={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,S={};function y(I,Q,St){this.props=I,this.context=Q,this.refs=S,this.updater=St||b}y.prototype.isReactComponent={},y.prototype.setState=function(I,Q){if(typeof I!="object"&&typeof I!="function"&&I!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,I,Q,"setState")},y.prototype.forceUpdate=function(I){this.updater.enqueueForceUpdate(this,I,"forceUpdate")};function w(){}w.prototype=y.prototype;function O(I,Q,St){this.props=I,this.context=Q,this.refs=S,this.updater=St||b}var P=O.prototype=new w;P.constructor=O,C(P,y.prototype),P.isPureReactComponent=!0;var z=Array.isArray;function N(){}var B={H:null,A:null,T:null,S:null},T=Object.prototype.hasOwnProperty;function F(I,Q,St){var bt=St.ref;return{$$typeof:r,type:I,key:Q,ref:bt!==void 0?bt:null,props:St}}function q(I,Q){return F(I.type,Q,I.props)}function G(I){return typeof I=="object"&&I!==null&&I.$$typeof===r}function $(I){var Q={"=":"=0",":":"=2"};return"$"+I.replace(/[=:]/g,function(St){return Q[St]})}var ut=/\/+/g;function ht(I,Q){return typeof I=="object"&&I!==null&&I.key!=null?$(""+I.key):Q.toString(36)}function j(I){switch(I.status){case"fulfilled":return I.value;case"rejected":throw I.reason;default:switch(typeof I.status=="string"?I.then(N,N):(I.status="pending",I.then(function(Q){I.status==="pending"&&(I.status="fulfilled",I.value=Q)},function(Q){I.status==="pending"&&(I.status="rejected",I.reason=Q)})),I.status){case"fulfilled":return I.value;case"rejected":throw I.reason}}throw I}function L(I,Q,St,bt,K){var Z=typeof I;(Z==="undefined"||Z==="boolean")&&(I=null);var Mt=!1;if(I===null)Mt=!0;else switch(Z){case"bigint":case"string":case"number":Mt=!0;break;case"object":switch(I.$$typeof){case r:case t:Mt=!0;break;case _:return Mt=I._init,L(Mt(I._payload),Q,St,bt,K)}}if(Mt)return K=K(I),Mt=bt===""?"."+ht(I,0):bt,z(K)?(St="",Mt!=null&&(St=Mt.replace(ut,"$&/")+"/"),L(K,Q,St,"",function(te){return te})):K!=null&&(G(K)&&(K=q(K,St+(K.key==null||I&&I.key===K.key?"":(""+K.key).replace(ut,"$&/")+"/")+Mt)),Q.push(K)),1;Mt=0;var At=bt===""?".":bt+":";if(z(I))for(var Ht=0;Ht<I.length;Ht++)bt=I[Ht],Z=At+ht(bt,Ht),Mt+=L(bt,Q,St,Z,K);else if(Ht=M(I),typeof Ht=="function")for(I=Ht.call(I),Ht=0;!(bt=I.next()).done;)bt=bt.value,Z=At+ht(bt,Ht++),Mt+=L(bt,Q,St,Z,K);else if(Z==="object"){if(typeof I.then=="function")return L(j(I),Q,St,bt,K);throw Q=String(I),Error("Objects are not valid as a React child (found: "+(Q==="[object Object]"?"object with keys {"+Object.keys(I).join(", ")+"}":Q)+"). If you meant to render a collection of children, use an array instead.")}return Mt}function H(I,Q,St){if(I==null)return I;var bt=[],K=0;return L(I,bt,"","",function(Z){return Q.call(St,Z,K++)}),bt}function et(I){if(I._status===-1){var Q=I._result;Q=Q(),Q.then(function(St){(I._status===0||I._status===-1)&&(I._status=1,I._result=St)},function(St){(I._status===0||I._status===-1)&&(I._status=2,I._result=St)}),I._status===-1&&(I._status=0,I._result=Q)}if(I._status===1)return I._result.default;throw I._result}var gt=typeof reportError=="function"?reportError:function(I){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var Q=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof I=="object"&&I!==null&&typeof I.message=="string"?String(I.message):String(I),error:I});if(!window.dispatchEvent(Q))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",I);return}console.error(I)},yt={map:H,forEach:function(I,Q,St){H(I,function(){Q.apply(this,arguments)},St)},count:function(I){var Q=0;return H(I,function(){Q++}),Q},toArray:function(I){return H(I,function(Q){return Q})||[]},only:function(I){if(!G(I))throw Error("React.Children.only expected to receive a single React element child.");return I}};return ae.Activity=v,ae.Children=yt,ae.Component=y,ae.Fragment=i,ae.Profiler=l,ae.PureComponent=O,ae.StrictMode=s,ae.Suspense=m,ae.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=B,ae.__COMPILER_RUNTIME={__proto__:null,c:function(I){return B.H.useMemoCache(I)}},ae.cache=function(I){return function(){return I.apply(null,arguments)}},ae.cacheSignal=function(){return null},ae.cloneElement=function(I,Q,St){if(I==null)throw Error("The argument must be a React element, but you passed "+I+".");var bt=C({},I.props),K=I.key;if(Q!=null)for(Z in Q.key!==void 0&&(K=""+Q.key),Q)!T.call(Q,Z)||Z==="key"||Z==="__self"||Z==="__source"||Z==="ref"&&Q.ref===void 0||(bt[Z]=Q[Z]);var Z=arguments.length-2;if(Z===1)bt.children=St;else if(1<Z){for(var Mt=Array(Z),At=0;At<Z;At++)Mt[At]=arguments[At+2];bt.children=Mt}return F(I.type,K,bt)},ae.createContext=function(I){return I={$$typeof:h,_currentValue:I,_currentValue2:I,_threadCount:0,Provider:null,Consumer:null},I.Provider=I,I.Consumer={$$typeof:c,_context:I},I},ae.createElement=function(I,Q,St){var bt,K={},Z=null;if(Q!=null)for(bt in Q.key!==void 0&&(Z=""+Q.key),Q)T.call(Q,bt)&&bt!=="key"&&bt!=="__self"&&bt!=="__source"&&(K[bt]=Q[bt]);var Mt=arguments.length-2;if(Mt===1)K.children=St;else if(1<Mt){for(var At=Array(Mt),Ht=0;Ht<Mt;Ht++)At[Ht]=arguments[Ht+2];K.children=At}if(I&&I.defaultProps)for(bt in Mt=I.defaultProps,Mt)K[bt]===void 0&&(K[bt]=Mt[bt]);return F(I,Z,K)},ae.createRef=function(){return{current:null}},ae.forwardRef=function(I){return{$$typeof:p,render:I}},ae.isValidElement=G,ae.lazy=function(I){return{$$typeof:_,_payload:{_status:-1,_result:I},_init:et}},ae.memo=function(I,Q){return{$$typeof:d,type:I,compare:Q===void 0?null:Q}},ae.startTransition=function(I){var Q=B.T,St={};B.T=St;try{var bt=I(),K=B.S;K!==null&&K(St,bt),typeof bt=="object"&&bt!==null&&typeof bt.then=="function"&&bt.then(N,gt)}catch(Z){gt(Z)}finally{Q!==null&&St.types!==null&&(Q.types=St.types),B.T=Q}},ae.unstable_useCacheRefresh=function(){return B.H.useCacheRefresh()},ae.use=function(I){return B.H.use(I)},ae.useActionState=function(I,Q,St){return B.H.useActionState(I,Q,St)},ae.useCallback=function(I,Q){return B.H.useCallback(I,Q)},ae.useContext=function(I){return B.H.useContext(I)},ae.useDebugValue=function(){},ae.useDeferredValue=function(I,Q){return B.H.useDeferredValue(I,Q)},ae.useEffect=function(I,Q){return B.H.useEffect(I,Q)},ae.useEffectEvent=function(I){return B.H.useEffectEvent(I)},ae.useId=function(){return B.H.useId()},ae.useImperativeHandle=function(I,Q,St){return B.H.useImperativeHandle(I,Q,St)},ae.useInsertionEffect=function(I,Q){return B.H.useInsertionEffect(I,Q)},ae.useLayoutEffect=function(I,Q){return B.H.useLayoutEffect(I,Q)},ae.useMemo=function(I,Q){return B.H.useMemo(I,Q)},ae.useOptimistic=function(I,Q){return B.H.useOptimistic(I,Q)},ae.useReducer=function(I,Q,St){return B.H.useReducer(I,Q,St)},ae.useRef=function(I){return B.H.useRef(I)},ae.useState=function(I){return B.H.useState(I)},ae.useSyncExternalStore=function(I,Q,St){return B.H.useSyncExternalStore(I,Q,St)},ae.useTransition=function(){return B.H.useTransition()},ae.version="19.2.6",ae}var __;function fp(){return __||(__=1,Ah.exports=Oy()),Ah.exports}var he=fp(),Rh={exports:{}},Yo={},Ch={exports:{}},wh={};var v_;function Py(){return v_||(v_=1,(function(r){function t(L,H){var et=L.length;L.push(H);t:for(;0<et;){var gt=et-1>>>1,yt=L[gt];if(0<l(yt,H))L[gt]=H,L[et]=yt,et=gt;else break t}}function i(L){return L.length===0?null:L[0]}function s(L){if(L.length===0)return null;var H=L[0],et=L.pop();if(et!==H){L[0]=et;t:for(var gt=0,yt=L.length,I=yt>>>1;gt<I;){var Q=2*(gt+1)-1,St=L[Q],bt=Q+1,K=L[bt];if(0>l(St,et))bt<yt&&0>l(K,St)?(L[gt]=K,L[bt]=et,gt=bt):(L[gt]=St,L[Q]=et,gt=Q);else if(bt<yt&&0>l(K,et))L[gt]=K,L[bt]=et,gt=bt;else break t}}return H}function l(L,H){var et=L.sortIndex-H.sortIndex;return et!==0?et:L.id-H.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;r.unstable_now=function(){return c.now()}}else{var h=Date,p=h.now();r.unstable_now=function(){return h.now()-p}}var m=[],d=[],_=1,v=null,g=3,M=!1,b=!1,C=!1,S=!1,y=typeof setTimeout=="function"?setTimeout:null,w=typeof clearTimeout=="function"?clearTimeout:null,O=typeof setImmediate<"u"?setImmediate:null;function P(L){for(var H=i(d);H!==null;){if(H.callback===null)s(d);else if(H.startTime<=L)s(d),H.sortIndex=H.expirationTime,t(m,H);else break;H=i(d)}}function z(L){if(C=!1,P(L),!b)if(i(m)!==null)b=!0,N||(N=!0,$());else{var H=i(d);H!==null&&j(z,H.startTime-L)}}var N=!1,B=-1,T=5,F=-1;function q(){return S?!0:!(r.unstable_now()-F<T)}function G(){if(S=!1,N){var L=r.unstable_now();F=L;var H=!0;try{t:{b=!1,C&&(C=!1,w(B),B=-1),M=!0;var et=g;try{e:{for(P(L),v=i(m);v!==null&&!(v.expirationTime>L&&q());){var gt=v.callback;if(typeof gt=="function"){v.callback=null,g=v.priorityLevel;var yt=gt(v.expirationTime<=L);if(L=r.unstable_now(),typeof yt=="function"){v.callback=yt,P(L),H=!0;break e}v===i(m)&&s(m),P(L)}else s(m);v=i(m)}if(v!==null)H=!0;else{var I=i(d);I!==null&&j(z,I.startTime-L),H=!1}}break t}finally{v=null,g=et,M=!1}H=void 0}}finally{H?$():N=!1}}}var $;if(typeof O=="function")$=function(){O(G)};else if(typeof MessageChannel<"u"){var ut=new MessageChannel,ht=ut.port2;ut.port1.onmessage=G,$=function(){ht.postMessage(null)}}else $=function(){y(G,0)};function j(L,H){B=y(function(){L(r.unstable_now())},H)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(L){L.callback=null},r.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<L?Math.floor(1e3/L):5},r.unstable_getCurrentPriorityLevel=function(){return g},r.unstable_next=function(L){switch(g){case 1:case 2:case 3:var H=3;break;default:H=g}var et=g;g=H;try{return L()}finally{g=et}},r.unstable_requestPaint=function(){S=!0},r.unstable_runWithPriority=function(L,H){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var et=g;g=L;try{return H()}finally{g=et}},r.unstable_scheduleCallback=function(L,H,et){var gt=r.unstable_now();switch(typeof et=="object"&&et!==null?(et=et.delay,et=typeof et=="number"&&0<et?gt+et:gt):et=gt,L){case 1:var yt=-1;break;case 2:yt=250;break;case 5:yt=1073741823;break;case 4:yt=1e4;break;default:yt=5e3}return yt=et+yt,L={id:_++,callback:H,priorityLevel:L,startTime:et,expirationTime:yt,sortIndex:-1},et>gt?(L.sortIndex=et,t(d,L),i(m)===null&&L===i(d)&&(C?(w(B),B=-1):C=!0,j(z,et-gt))):(L.sortIndex=yt,t(m,L),b||M||(b=!0,N||(N=!0,$()))),L},r.unstable_shouldYield=q,r.unstable_wrapCallback=function(L){var H=g;return function(){var et=g;g=H;try{return L.apply(this,arguments)}finally{g=et}}}})(wh)),wh}var x_;function Iy(){return x_||(x_=1,Ch.exports=Py()),Ch.exports}var Dh={exports:{}},Pn={};var S_;function Fy(){if(S_)return Pn;S_=1;var r=fp();function t(m){var d="https://react.dev/errors/"+m;if(1<arguments.length){d+="?args[]="+encodeURIComponent(arguments[1]);for(var _=2;_<arguments.length;_++)d+="&args[]="+encodeURIComponent(arguments[_])}return"Minified React error #"+m+"; visit "+d+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var s={d:{f:i,r:function(){throw Error(t(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function c(m,d,_){var v=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:v==null?null:""+v,children:m,containerInfo:d,implementation:_}}var h=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function p(m,d){if(m==="font")return"";if(typeof d=="string")return d==="use-credentials"?d:""}return Pn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,Pn.createPortal=function(m,d){var _=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!d||d.nodeType!==1&&d.nodeType!==9&&d.nodeType!==11)throw Error(t(299));return c(m,d,null,_)},Pn.flushSync=function(m){var d=h.T,_=s.p;try{if(h.T=null,s.p=2,m)return m()}finally{h.T=d,s.p=_,s.d.f()}},Pn.preconnect=function(m,d){typeof m=="string"&&(d?(d=d.crossOrigin,d=typeof d=="string"?d==="use-credentials"?d:"":void 0):d=null,s.d.C(m,d))},Pn.prefetchDNS=function(m){typeof m=="string"&&s.d.D(m)},Pn.preinit=function(m,d){if(typeof m=="string"&&d&&typeof d.as=="string"){var _=d.as,v=p(_,d.crossOrigin),g=typeof d.integrity=="string"?d.integrity:void 0,M=typeof d.fetchPriority=="string"?d.fetchPriority:void 0;_==="style"?s.d.S(m,typeof d.precedence=="string"?d.precedence:void 0,{crossOrigin:v,integrity:g,fetchPriority:M}):_==="script"&&s.d.X(m,{crossOrigin:v,integrity:g,fetchPriority:M,nonce:typeof d.nonce=="string"?d.nonce:void 0})}},Pn.preinitModule=function(m,d){if(typeof m=="string")if(typeof d=="object"&&d!==null){if(d.as==null||d.as==="script"){var _=p(d.as,d.crossOrigin);s.d.M(m,{crossOrigin:_,integrity:typeof d.integrity=="string"?d.integrity:void 0,nonce:typeof d.nonce=="string"?d.nonce:void 0})}}else d==null&&s.d.M(m)},Pn.preload=function(m,d){if(typeof m=="string"&&typeof d=="object"&&d!==null&&typeof d.as=="string"){var _=d.as,v=p(_,d.crossOrigin);s.d.L(m,_,{crossOrigin:v,integrity:typeof d.integrity=="string"?d.integrity:void 0,nonce:typeof d.nonce=="string"?d.nonce:void 0,type:typeof d.type=="string"?d.type:void 0,fetchPriority:typeof d.fetchPriority=="string"?d.fetchPriority:void 0,referrerPolicy:typeof d.referrerPolicy=="string"?d.referrerPolicy:void 0,imageSrcSet:typeof d.imageSrcSet=="string"?d.imageSrcSet:void 0,imageSizes:typeof d.imageSizes=="string"?d.imageSizes:void 0,media:typeof d.media=="string"?d.media:void 0})}},Pn.preloadModule=function(m,d){if(typeof m=="string")if(d){var _=p(d.as,d.crossOrigin);s.d.m(m,{as:typeof d.as=="string"&&d.as!=="script"?d.as:void 0,crossOrigin:_,integrity:typeof d.integrity=="string"?d.integrity:void 0})}else s.d.m(m)},Pn.requestFormReset=function(m){s.d.r(m)},Pn.unstable_batchedUpdates=function(m,d){return m(d)},Pn.useFormState=function(m,d,_){return h.H.useFormState(m,d,_)},Pn.useFormStatus=function(){return h.H.useHostTransitionStatus()},Pn.version="19.2.6",Pn}var y_;function By(){if(y_)return Dh.exports;y_=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),Dh.exports=Fy(),Dh.exports}var M_;function zy(){if(M_)return Yo;M_=1;var r=Iy(),t=fp(),i=By();function s(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function c(e){var n=e,a=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,(n.flags&4098)!==0&&(a=n.return),e=n.return;while(e)}return n.tag===3?a:null}function h(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function p(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function m(e){if(c(e)!==e)throw Error(s(188))}function d(e){var n=e.alternate;if(!n){if(n=c(e),n===null)throw Error(s(188));return n!==e?null:e}for(var a=e,o=n;;){var u=a.return;if(u===null)break;var f=u.alternate;if(f===null){if(o=u.return,o!==null){a=o;continue}break}if(u.child===f.child){for(f=u.child;f;){if(f===a)return m(u),e;if(f===o)return m(u),n;f=f.sibling}throw Error(s(188))}if(a.return!==o.return)a=u,o=f;else{for(var x=!1,R=u.child;R;){if(R===a){x=!0,a=u,o=f;break}if(R===o){x=!0,o=u,a=f;break}R=R.sibling}if(!x){for(R=f.child;R;){if(R===a){x=!0,a=f,o=u;break}if(R===o){x=!0,o=f,a=u;break}R=R.sibling}if(!x)throw Error(s(189))}}if(a.alternate!==o)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?e:n}function _(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=_(e),n!==null)return n;e=e.sibling}return null}var v=Object.assign,g=Symbol.for("react.element"),M=Symbol.for("react.transitional.element"),b=Symbol.for("react.portal"),C=Symbol.for("react.fragment"),S=Symbol.for("react.strict_mode"),y=Symbol.for("react.profiler"),w=Symbol.for("react.consumer"),O=Symbol.for("react.context"),P=Symbol.for("react.forward_ref"),z=Symbol.for("react.suspense"),N=Symbol.for("react.suspense_list"),B=Symbol.for("react.memo"),T=Symbol.for("react.lazy"),F=Symbol.for("react.activity"),q=Symbol.for("react.memo_cache_sentinel"),G=Symbol.iterator;function $(e){return e===null||typeof e!="object"?null:(e=G&&e[G]||e["@@iterator"],typeof e=="function"?e:null)}var ut=Symbol.for("react.client.reference");function ht(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===ut?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case C:return"Fragment";case y:return"Profiler";case S:return"StrictMode";case z:return"Suspense";case N:return"SuspenseList";case F:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case b:return"Portal";case O:return e.displayName||"Context";case w:return(e._context.displayName||"Context")+".Consumer";case P:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case B:return n=e.displayName||null,n!==null?n:ht(e.type)||"Memo";case T:n=e._payload,e=e._init;try{return ht(e(n))}catch{}}return null}var j=Array.isArray,L=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,H=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,et={pending:!1,data:null,method:null,action:null},gt=[],yt=-1;function I(e){return{current:e}}function Q(e){0>yt||(e.current=gt[yt],gt[yt]=null,yt--)}function St(e,n){yt++,gt[yt]=e.current,e.current=n}var bt=I(null),K=I(null),Z=I(null),Mt=I(null);function At(e,n){switch(St(Z,n),St(K,e),St(bt,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?Fg(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=Fg(n),e=Bg(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Q(bt),St(bt,e)}function Ht(){Q(bt),Q(K),Q(Z)}function te(e){e.memoizedState!==null&&St(Mt,e);var n=bt.current,a=Bg(n,e.type);n!==a&&(St(K,e),St(bt,a))}function Qt(e){K.current===e&&(Q(bt),Q(K)),Mt.current===e&&(Q(Mt),ko._currentValue=et)}var je,pe;function ye(e){if(je===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);je=n&&n[1]||"",pe=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+je+e+pe}var Ne=!1;function ce(e,n){if(!e||Ne)return"";Ne=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(n){var xt=function(){throw Error()};if(Object.defineProperty(xt.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(xt,[])}catch(ct){var lt=ct}Reflect.construct(e,[],xt)}else{try{xt.call()}catch(ct){lt=ct}e.call(xt.prototype)}}else{try{throw Error()}catch(ct){lt=ct}(xt=e())&&typeof xt.catch=="function"&&xt.catch(function(){})}}catch(ct){if(ct&&lt&&typeof ct.stack=="string")return[ct.stack,lt.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=o.DetermineComponentFrameRoot(),x=f[0],R=f[1];if(x&&R){var V=x.split(`
`),at=R.split(`
`);for(u=o=0;o<V.length&&!V[o].includes("DetermineComponentFrameRoot");)o++;for(;u<at.length&&!at[u].includes("DetermineComponentFrameRoot");)u++;if(o===V.length||u===at.length)for(o=V.length-1,u=at.length-1;1<=o&&0<=u&&V[o]!==at[u];)u--;for(;1<=o&&0<=u;o--,u--)if(V[o]!==at[u]){if(o!==1||u!==1)do if(o--,u--,0>u||V[o]!==at[u]){var pt=`
`+V[o].replace(" at new "," at ");return e.displayName&&pt.includes("<anonymous>")&&(pt=pt.replace("<anonymous>",e.displayName)),pt}while(1<=o&&0<=u);break}}}finally{Ne=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?ye(a):""}function ln(e,n){switch(e.tag){case 26:case 27:case 5:return ye(e.type);case 16:return ye("Lazy");case 13:return e.child!==n&&n!==null?ye("Suspense Fallback"):ye("Suspense");case 19:return ye("SuspenseList");case 0:case 15:return ce(e.type,!1);case 11:return ce(e.type.render,!1);case 1:return ce(e.type,!0);case 31:return ye("Activity");default:return""}}function Ye(e){try{var n="",a=null;do n+=ln(e,a),a=e,e=e.return;while(e);return n}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var An=Object.prototype.hasOwnProperty,W=r.unstable_scheduleCallback,en=r.unstable_cancelCallback,me=r.unstable_shouldYield,He=r.unstable_requestPaint,Ct=r.unstable_now,Qe=r.unstable_getCurrentPriorityLevel,D=r.unstable_ImmediatePriority,E=r.unstable_UserBlockingPriority,nt=r.unstable_NormalPriority,vt=r.unstable_LowPriority,Tt=r.unstable_IdlePriority,wt=r.log,Nt=r.unstable_setDisableYieldValue,ft=null,dt=null;function Ot(e){if(typeof wt=="function"&&Nt(e),dt&&typeof dt.setStrictMode=="function")try{dt.setStrictMode(ft,e)}catch{}}var Pt=Math.clz32?Math.clz32:ne,Ut=Math.log,Dt=Math.LN2;function ne(e){return e>>>=0,e===0?32:31-(Ut(e)/Dt|0)|0}var ie=256,_e=262144,k=4194304;function Rt(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function mt(e,n,a){var o=e.pendingLanes;if(o===0)return 0;var u=0,f=e.suspendedLanes,x=e.pingedLanes;e=e.warmLanes;var R=o&134217727;return R!==0?(o=R&~f,o!==0?u=Rt(o):(x&=R,x!==0?u=Rt(x):a||(a=R&~e,a!==0&&(u=Rt(a))))):(R=o&~f,R!==0?u=Rt(R):x!==0?u=Rt(x):a||(a=o&~e,a!==0&&(u=Rt(a)))),u===0?0:n!==0&&n!==u&&(n&f)===0&&(f=u&-u,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:u}function Bt(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function Lt(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Et(){var e=k;return k<<=1,(k&62914560)===0&&(k=4194304),e}function Wt(e){for(var n=[],a=0;31>a;a++)n.push(e);return n}function ee(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function nn(e,n,a,o,u,f){var x=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var R=e.entanglements,V=e.expirationTimes,at=e.hiddenUpdates;for(a=x&~a;0<a;){var pt=31-Pt(a),xt=1<<pt;R[pt]=0,V[pt]=-1;var lt=at[pt];if(lt!==null)for(at[pt]=null,pt=0;pt<lt.length;pt++){var ct=lt[pt];ct!==null&&(ct.lane&=-536870913)}a&=~xt}o!==0&&De(e,o,0),f!==0&&u===0&&e.tag!==0&&(e.suspendedLanes|=f&~(x&~n))}function De(e,n,a){e.pendingLanes|=n,e.suspendedLanes&=~n;var o=31-Pt(n);e.entangledLanes|=n,e.entanglements[o]=e.entanglements[o]|1073741824|a&261930}function mi(e,n){var a=e.entangledLanes|=n;for(e=e.entanglements;a;){var o=31-Pt(a),u=1<<o;u&n|e[o]&n&&(e[o]|=n),a&=~u}}function ti(e,n){var a=n&-n;return a=(a&42)!==0?1:vs(a),(a&(e.suspendedLanes|n))!==0?0:a}function vs(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function to(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function eo(){var e=H.p;return e!==0?e:(e=window.event,e===void 0?32:o_(e.type))}function no(e,n){var a=H.p;try{return H.p=e,n()}finally{H.p=a}}var Nn=Math.random().toString(36).slice(2),cn="__reactFiber$"+Nn,Rn="__reactProps$"+Nn,Ji="__reactContainer$"+Nn,Ca="__reactEvents$"+Nn,ml="__reactListeners$"+Nn,Ks="__reactHandles$"+Nn,io="__reactResources$"+Nn,wa="__reactMarker$"+Nn;function ao(e){delete e[cn],delete e[Rn],delete e[Ca],delete e[ml],delete e[Ks]}function Da(e){var n=e[cn];if(n)return n;for(var a=e.parentNode;a;){if(n=a[Ji]||a[cn]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(e=jg(e);e!==null;){if(a=e[cn])return a;e=jg(e)}return n}e=a,a=e.parentNode}return null}function Ua(e){if(e=e[cn]||e[Ji]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function xs(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(s(33))}function La(e){var n=e[io];return n||(n=e[io]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function hn(e){e[wa]=!0}var gl=new Set,A={};function Y(e,n){ot(e,n),ot(e+"Capture",n)}function ot(e,n){for(A[e]=n,e=0;e<n.length;e++)gl.add(n[e])}var st=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),rt={},Ft={};function Vt(e){return An.call(Ft,e)?!0:An.call(rt,e)?!1:st.test(e)?Ft[e]=!0:(rt[e]=!0,!1)}function It(e,n,a){if(Vt(n))if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var o=n.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,""+a)}}function Xt(e,n,a){if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,""+a)}}function kt(e,n,a,o){if(o===null)e.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(n,a,""+o)}}function Zt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function oe(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Yt(e,n,a){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var u=o.get,f=o.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return u.call(this)},set:function(x){a=""+x,f.call(this,x)}}),Object.defineProperty(e,n,{enumerable:o.enumerable}),{getValue:function(){return a},setValue:function(x){a=""+x},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function Re(e){if(!e._valueTracker){var n=oe(e)?"checked":"value";e._valueTracker=Yt(e,n,""+e[n])}}function Je(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var a=n.getValue(),o="";return e&&(o=oe(e)?e.checked?"true":"false":e.value),e=o,e!==a?(n.setValue(e),!0):!1}function We(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Oe=/[\n"\\]/g;function Pe(e){return e.replace(Oe,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function Gt(e,n,a,o,u,f,x,R){e.name="",x!=null&&typeof x!="function"&&typeof x!="symbol"&&typeof x!="boolean"?e.type=x:e.removeAttribute("type"),n!=null?x==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+Zt(n)):e.value!==""+Zt(n)&&(e.value=""+Zt(n)):x!=="submit"&&x!=="reset"||e.removeAttribute("value"),n!=null?ve(e,x,Zt(n)):a!=null?ve(e,x,Zt(a)):o!=null&&e.removeAttribute("value"),u==null&&f!=null&&(e.defaultChecked=!!f),u!=null&&(e.checked=u&&typeof u!="function"&&typeof u!="symbol"),R!=null&&typeof R!="function"&&typeof R!="symbol"&&typeof R!="boolean"?e.name=""+Zt(R):e.removeAttribute("name")}function On(e,n,a,o,u,f,x,R){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(e.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){Re(e);return}a=a!=null?""+Zt(a):"",n=n!=null?""+Zt(n):a,R||n===e.value||(e.value=n),e.defaultValue=n}o=o??u,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=R?e.checked:!!o,e.defaultChecked=!!o,x!=null&&typeof x!="function"&&typeof x!="symbol"&&typeof x!="boolean"&&(e.name=x),Re(e)}function ve(e,n,a){n==="number"&&We(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function vn(e,n,a,o){if(e=e.options,n){n={};for(var u=0;u<a.length;u++)n["$"+a[u]]=!0;for(a=0;a<e.length;a++)u=n.hasOwnProperty("$"+e[a].value),e[a].selected!==u&&(e[a].selected=u),u&&o&&(e[a].defaultSelected=!0)}else{for(a=""+Zt(a),n=null,u=0;u<e.length;u++){if(e[u].value===a){e[u].selected=!0,o&&(e[u].defaultSelected=!0);return}n!==null||e[u].disabled||(n=e[u])}n!==null&&(n.selected=!0)}}function ei(e,n,a){if(n!=null&&(n=""+Zt(n),n!==e.value&&(e.value=n),a==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=a!=null?""+Zt(a):""}function Ri(e,n,a,o){if(n==null){if(o!=null){if(a!=null)throw Error(s(92));if(j(o)){if(1<o.length)throw Error(s(93));o=o[0]}a=o}a==null&&(a=""),n=a}a=Zt(n),e.defaultValue=a,o=e.textContent,o===a&&o!==""&&o!==null&&(e.value=o),Re(e)}function ni(e,n){if(n){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=n;return}}e.textContent=n}var Ie=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function $e(e,n,a){var o=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?o?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":o?e.setProperty(n,a):typeof a!="number"||a===0||Ie.has(n)?n==="float"?e.cssFloat=a:e[n]=(""+a).trim():e[n]=a+"px"}function Ci(e,n,a){if(n!=null&&typeof n!="object")throw Error(s(62));if(e=e.style,a!=null){for(var o in a)!a.hasOwnProperty(o)||n!=null&&n.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="");for(var u in n)o=n[u],n.hasOwnProperty(u)&&a[u]!==o&&$e(e,u,o)}else for(var f in n)n.hasOwnProperty(f)&&$e(e,f,n[f])}function Le(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Bi=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Na=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Ss(e){return Na.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function $i(){}var yu=null;function Mu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Qs=null,Js=null;function Ip(e){var n=Ua(e);if(n&&(e=n.stateNode)){var a=e[Rn]||null;t:switch(e=n.stateNode,n.type){case"input":if(Gt(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+Pe(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var o=a[n];if(o!==e&&o.form===e.form){var u=o[Rn]||null;if(!u)throw Error(s(90));Gt(o,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(n=0;n<a.length;n++)o=a[n],o.form===e.form&&Je(o)}break t;case"textarea":ei(e,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&vn(e,!!a.multiple,n,!1)}}}var Eu=!1;function Fp(e,n,a){if(Eu)return e(n,a);Eu=!0;try{var o=e(n);return o}finally{if(Eu=!1,(Qs!==null||Js!==null)&&(ic(),Qs&&(n=Qs,e=Js,Js=Qs=null,Ip(n),e)))for(n=0;n<e.length;n++)Ip(e[n])}}function so(e,n){var a=e.stateNode;if(a===null)return null;var o=a[Rn]||null;if(o===null)return null;a=o[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break t;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(s(231,n,typeof a));return a}var ta=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),bu=!1;if(ta)try{var ro={};Object.defineProperty(ro,"passive",{get:function(){bu=!0}}),window.addEventListener("test",ro,ro),window.removeEventListener("test",ro,ro)}catch{bu=!1}var Oa=null,Tu=null,_l=null;function Bp(){if(_l)return _l;var e,n=Tu,a=n.length,o,u="value"in Oa?Oa.value:Oa.textContent,f=u.length;for(e=0;e<a&&n[e]===u[e];e++);var x=a-e;for(o=1;o<=x&&n[a-o]===u[f-o];o++);return _l=u.slice(e,1<o?1-o:void 0)}function vl(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function xl(){return!0}function zp(){return!1}function kn(e){function n(a,o,u,f,x){this._reactName=a,this._targetInst=u,this.type=o,this.nativeEvent=f,this.target=x,this.currentTarget=null;for(var R in e)e.hasOwnProperty(R)&&(a=e[R],this[R]=a?a(f):f[R]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?xl:zp,this.isPropagationStopped=zp,this}return v(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=xl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=xl)},persist:function(){},isPersistent:xl}),n}var ys={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Sl=kn(ys),oo=v({},ys,{view:0,detail:0}),Dx=kn(oo),Au,Ru,lo,yl=v({},oo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:wu,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==lo&&(lo&&e.type==="mousemove"?(Au=e.screenX-lo.screenX,Ru=e.screenY-lo.screenY):Ru=Au=0,lo=e),Au)},movementY:function(e){return"movementY"in e?e.movementY:Ru}}),Hp=kn(yl),Ux=v({},yl,{dataTransfer:0}),Lx=kn(Ux),Nx=v({},oo,{relatedTarget:0}),Cu=kn(Nx),Ox=v({},ys,{animationName:0,elapsedTime:0,pseudoElement:0}),Px=kn(Ox),Ix=v({},ys,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Fx=kn(Ix),Bx=v({},ys,{data:0}),Gp=kn(Bx),zx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Hx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Gx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Vx(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=Gx[e])?!!n[e]:!1}function wu(){return Vx}var kx=v({},oo,{key:function(e){if(e.key){var n=zx[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=vl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Hx[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:wu,charCode:function(e){return e.type==="keypress"?vl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?vl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Xx=kn(kx),jx=v({},yl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Vp=kn(jx),Wx=v({},oo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:wu}),qx=kn(Wx),Yx=v({},ys,{propertyName:0,elapsedTime:0,pseudoElement:0}),Zx=kn(Yx),Kx=v({},yl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Qx=kn(Kx),Jx=v({},ys,{newState:0,oldState:0}),$x=kn(Jx),tS=[9,13,27,32],Du=ta&&"CompositionEvent"in window,co=null;ta&&"documentMode"in document&&(co=document.documentMode);var eS=ta&&"TextEvent"in window&&!co,kp=ta&&(!Du||co&&8<co&&11>=co),Xp=" ",jp=!1;function Wp(e,n){switch(e){case"keyup":return tS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function qp(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var $s=!1;function nS(e,n){switch(e){case"compositionend":return qp(n);case"keypress":return n.which!==32?null:(jp=!0,Xp);case"textInput":return e=n.data,e===Xp&&jp?null:e;default:return null}}function iS(e,n){if($s)return e==="compositionend"||!Du&&Wp(e,n)?(e=Bp(),_l=Tu=Oa=null,$s=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return kp&&n.locale!=="ko"?null:n.data;default:return null}}var aS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Yp(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!aS[e.type]:n==="textarea"}function Zp(e,n,a,o){Qs?Js?Js.push(o):Js=[o]:Qs=o,n=uc(n,"onChange"),0<n.length&&(a=new Sl("onChange","change",null,a,o),e.push({event:a,listeners:n}))}var uo=null,fo=null;function sS(e){Ug(e,0)}function Ml(e){var n=xs(e);if(Je(n))return e}function Kp(e,n){if(e==="change")return n}var Qp=!1;if(ta){var Uu;if(ta){var Lu="oninput"in document;if(!Lu){var Jp=document.createElement("div");Jp.setAttribute("oninput","return;"),Lu=typeof Jp.oninput=="function"}Uu=Lu}else Uu=!1;Qp=Uu&&(!document.documentMode||9<document.documentMode)}function $p(){uo&&(uo.detachEvent("onpropertychange",tm),fo=uo=null)}function tm(e){if(e.propertyName==="value"&&Ml(fo)){var n=[];Zp(n,fo,e,Mu(e)),Fp(sS,n)}}function rS(e,n,a){e==="focusin"?($p(),uo=n,fo=a,uo.attachEvent("onpropertychange",tm)):e==="focusout"&&$p()}function oS(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ml(fo)}function lS(e,n){if(e==="click")return Ml(n)}function cS(e,n){if(e==="input"||e==="change")return Ml(n)}function uS(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var ii=typeof Object.is=="function"?Object.is:uS;function ho(e,n){if(ii(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var a=Object.keys(e),o=Object.keys(n);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var u=a[o];if(!An.call(n,u)||!ii(e[u],n[u]))return!1}return!0}function em(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function nm(e,n){var a=em(e);e=0;for(var o;a;){if(a.nodeType===3){if(o=e+a.textContent.length,e<=n&&o>=n)return{node:a,offset:n-e};e=o}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=em(a)}}function im(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?im(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function am(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=We(e.document);n instanceof e.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)e=n.contentWindow;else break;n=We(e.document)}return n}function Nu(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var fS=ta&&"documentMode"in document&&11>=document.documentMode,tr=null,Ou=null,po=null,Pu=!1;function sm(e,n,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Pu||tr==null||tr!==We(o)||(o=tr,"selectionStart"in o&&Nu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),po&&ho(po,o)||(po=o,o=uc(Ou,"onSelect"),0<o.length&&(n=new Sl("onSelect","select",null,n,a),e.push({event:n,listeners:o}),n.target=tr)))}function Ms(e,n){var a={};return a[e.toLowerCase()]=n.toLowerCase(),a["Webkit"+e]="webkit"+n,a["Moz"+e]="moz"+n,a}var er={animationend:Ms("Animation","AnimationEnd"),animationiteration:Ms("Animation","AnimationIteration"),animationstart:Ms("Animation","AnimationStart"),transitionrun:Ms("Transition","TransitionRun"),transitionstart:Ms("Transition","TransitionStart"),transitioncancel:Ms("Transition","TransitionCancel"),transitionend:Ms("Transition","TransitionEnd")},Iu={},rm={};ta&&(rm=document.createElement("div").style,"AnimationEvent"in window||(delete er.animationend.animation,delete er.animationiteration.animation,delete er.animationstart.animation),"TransitionEvent"in window||delete er.transitionend.transition);function Es(e){if(Iu[e])return Iu[e];if(!er[e])return e;var n=er[e],a;for(a in n)if(n.hasOwnProperty(a)&&a in rm)return Iu[e]=n[a];return e}var om=Es("animationend"),lm=Es("animationiteration"),cm=Es("animationstart"),hS=Es("transitionrun"),dS=Es("transitionstart"),pS=Es("transitioncancel"),um=Es("transitionend"),fm=new Map,Fu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Fu.push("scrollEnd");function wi(e,n){fm.set(e,n),Y(n,[e])}var El=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},gi=[],nr=0,Bu=0;function bl(){for(var e=nr,n=Bu=nr=0;n<e;){var a=gi[n];gi[n++]=null;var o=gi[n];gi[n++]=null;var u=gi[n];gi[n++]=null;var f=gi[n];if(gi[n++]=null,o!==null&&u!==null){var x=o.pending;x===null?u.next=u:(u.next=x.next,x.next=u),o.pending=u}f!==0&&hm(a,u,f)}}function Tl(e,n,a,o){gi[nr++]=e,gi[nr++]=n,gi[nr++]=a,gi[nr++]=o,Bu|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function zu(e,n,a,o){return Tl(e,n,a,o),Al(e)}function bs(e,n){return Tl(e,null,null,n),Al(e)}function hm(e,n,a){e.lanes|=a;var o=e.alternate;o!==null&&(o.lanes|=a);for(var u=!1,f=e.return;f!==null;)f.childLanes|=a,o=f.alternate,o!==null&&(o.childLanes|=a),f.tag===22&&(e=f.stateNode,e===null||e._visibility&1||(u=!0)),e=f,f=f.return;return e.tag===3?(f=e.stateNode,u&&n!==null&&(u=31-Pt(a),e=f.hiddenUpdates,o=e[u],o===null?e[u]=[n]:o.push(n),n.lane=a|536870912),f):null}function Al(e){if(50<Io)throw Io=0,Zf=null,Error(s(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var ir={};function mS(e,n,a,o){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ai(e,n,a,o){return new mS(e,n,a,o)}function Hu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function ea(e,n){var a=e.alternate;return a===null?(a=ai(e.tag,n,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=n,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,n=e.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function dm(e,n){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,n=a.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function Rl(e,n,a,o,u,f){var x=0;if(o=e,typeof e=="function")Hu(e)&&(x=1);else if(typeof e=="string")x=Sy(e,a,bt.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case F:return e=ai(31,a,n,u),e.elementType=F,e.lanes=f,e;case C:return Ts(a.children,u,f,n);case S:x=8,u|=24;break;case y:return e=ai(12,a,n,u|2),e.elementType=y,e.lanes=f,e;case z:return e=ai(13,a,n,u),e.elementType=z,e.lanes=f,e;case N:return e=ai(19,a,n,u),e.elementType=N,e.lanes=f,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case O:x=10;break t;case w:x=9;break t;case P:x=11;break t;case B:x=14;break t;case T:x=16,o=null;break t}x=29,a=Error(s(130,e===null?"null":typeof e,"")),o=null}return n=ai(x,a,n,u),n.elementType=e,n.type=o,n.lanes=f,n}function Ts(e,n,a,o){return e=ai(7,e,o,n),e.lanes=a,e}function Gu(e,n,a){return e=ai(6,e,null,n),e.lanes=a,e}function pm(e){var n=ai(18,null,null,0);return n.stateNode=e,n}function Vu(e,n,a){return n=ai(4,e.children!==null?e.children:[],e.key,n),n.lanes=a,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var mm=new WeakMap;function _i(e,n){if(typeof e=="object"&&e!==null){var a=mm.get(e);return a!==void 0?a:(n={value:e,source:n,stack:Ye(n)},mm.set(e,n),n)}return{value:e,source:n,stack:Ye(n)}}var ar=[],sr=0,Cl=null,mo=0,vi=[],xi=0,Pa=null,zi=1,Hi="";function na(e,n){ar[sr++]=mo,ar[sr++]=Cl,Cl=e,mo=n}function gm(e,n,a){vi[xi++]=zi,vi[xi++]=Hi,vi[xi++]=Pa,Pa=e;var o=zi;e=Hi;var u=32-Pt(o)-1;o&=~(1<<u),a+=1;var f=32-Pt(n)+u;if(30<f){var x=u-u%5;f=(o&(1<<x)-1).toString(32),o>>=x,u-=x,zi=1<<32-Pt(n)+u|a<<u|o,Hi=f+e}else zi=1<<f|a<<u|o,Hi=e}function ku(e){e.return!==null&&(na(e,1),gm(e,1,0))}function Xu(e){for(;e===Cl;)Cl=ar[--sr],ar[sr]=null,mo=ar[--sr],ar[sr]=null;for(;e===Pa;)Pa=vi[--xi],vi[xi]=null,Hi=vi[--xi],vi[xi]=null,zi=vi[--xi],vi[xi]=null}function _m(e,n){vi[xi++]=zi,vi[xi++]=Hi,vi[xi++]=Pa,zi=n.id,Hi=n.overflow,Pa=e}var Cn=null,Ze=null,be=!1,Ia=null,Si=!1,ju=Error(s(519));function Fa(e){var n=Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw go(_i(n,e)),ju}function vm(e){var n=e.stateNode,a=e.type,o=e.memoizedProps;switch(n[cn]=e,n[Rn]=o,a){case"dialog":Se("cancel",n),Se("close",n);break;case"iframe":case"object":case"embed":Se("load",n);break;case"video":case"audio":for(a=0;a<Bo.length;a++)Se(Bo[a],n);break;case"source":Se("error",n);break;case"img":case"image":case"link":Se("error",n),Se("load",n);break;case"details":Se("toggle",n);break;case"input":Se("invalid",n),On(n,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":Se("invalid",n);break;case"textarea":Se("invalid",n),Ri(n,o.value,o.defaultValue,o.children)}a=o.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||o.suppressHydrationWarning===!0||Pg(n.textContent,a)?(o.popover!=null&&(Se("beforetoggle",n),Se("toggle",n)),o.onScroll!=null&&Se("scroll",n),o.onScrollEnd!=null&&Se("scrollend",n),o.onClick!=null&&(n.onclick=$i),n=!0):n=!1,n||Fa(e,!0)}function xm(e){for(Cn=e.return;Cn;)switch(Cn.tag){case 5:case 31:case 13:Si=!1;return;case 27:case 3:Si=!0;return;default:Cn=Cn.return}}function rr(e){if(e!==Cn)return!1;if(!be)return xm(e),be=!0,!1;var n=e.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||uh(e.type,e.memoizedProps)),a=!a),a&&Ze&&Fa(e),xm(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));Ze=Xg(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));Ze=Xg(e)}else n===27?(n=Ze,Qa(e.type)?(e=mh,mh=null,Ze=e):Ze=n):Ze=Cn?Mi(e.stateNode.nextSibling):null;return!0}function As(){Ze=Cn=null,be=!1}function Wu(){var e=Ia;return e!==null&&(qn===null?qn=e:qn.push.apply(qn,e),Ia=null),e}function go(e){Ia===null?Ia=[e]:Ia.push(e)}var qu=I(null),Rs=null,ia=null;function Ba(e,n,a){St(qu,n._currentValue),n._currentValue=a}function aa(e){e._currentValue=qu.current,Q(qu)}function Yu(e,n,a){for(;e!==null;){var o=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,o!==null&&(o.childLanes|=n)):o!==null&&(o.childLanes&n)!==n&&(o.childLanes|=n),e===a)break;e=e.return}}function Zu(e,n,a,o){var u=e.child;for(u!==null&&(u.return=e);u!==null;){var f=u.dependencies;if(f!==null){var x=u.child;f=f.firstContext;t:for(;f!==null;){var R=f;f=u;for(var V=0;V<n.length;V++)if(R.context===n[V]){f.lanes|=a,R=f.alternate,R!==null&&(R.lanes|=a),Yu(f.return,a,e),o||(x=null);break t}f=R.next}}else if(u.tag===18){if(x=u.return,x===null)throw Error(s(341));x.lanes|=a,f=x.alternate,f!==null&&(f.lanes|=a),Yu(x,a,e),x=null}else x=u.child;if(x!==null)x.return=u;else for(x=u;x!==null;){if(x===e){x=null;break}if(u=x.sibling,u!==null){u.return=x.return,x=u;break}x=x.return}u=x}}function or(e,n,a,o){e=null;for(var u=n,f=!1;u!==null;){if(!f){if((u.flags&524288)!==0)f=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var x=u.alternate;if(x===null)throw Error(s(387));if(x=x.memoizedProps,x!==null){var R=u.type;ii(u.pendingProps.value,x.value)||(e!==null?e.push(R):e=[R])}}else if(u===Mt.current){if(x=u.alternate,x===null)throw Error(s(387));x.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(e!==null?e.push(ko):e=[ko])}u=u.return}e!==null&&Zu(n,e,a,o),n.flags|=262144}function wl(e){for(e=e.firstContext;e!==null;){if(!ii(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Cs(e){Rs=e,ia=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function wn(e){return Sm(Rs,e)}function Dl(e,n){return Rs===null&&Cs(e),Sm(e,n)}function Sm(e,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},ia===null){if(e===null)throw Error(s(308));ia=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else ia=ia.next=n;return a}var gS=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(a,o){e.push(o)}};this.abort=function(){n.aborted=!0,e.forEach(function(a){return a()})}},_S=r.unstable_scheduleCallback,vS=r.unstable_NormalPriority,dn={$$typeof:O,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ku(){return{controller:new gS,data:new Map,refCount:0}}function _o(e){e.refCount--,e.refCount===0&&_S(vS,function(){e.controller.abort()})}var vo=null,Qu=0,lr=0,cr=null;function xS(e,n){if(vo===null){var a=vo=[];Qu=0,lr=eh(),cr={status:"pending",value:void 0,then:function(o){a.push(o)}}}return Qu++,n.then(ym,ym),n}function ym(){if(--Qu===0&&vo!==null){cr!==null&&(cr.status="fulfilled");var e=vo;vo=null,lr=0,cr=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function SS(e,n){var a=[],o={status:"pending",value:null,reason:null,then:function(u){a.push(u)}};return e.then(function(){o.status="fulfilled",o.value=n;for(var u=0;u<a.length;u++)(0,a[u])(n)},function(u){for(o.status="rejected",o.reason=u,u=0;u<a.length;u++)(0,a[u])(void 0)}),o}var Mm=L.S;L.S=function(e,n){sg=Ct(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&xS(e,n),Mm!==null&&Mm(e,n)};var ws=I(null);function Ju(){var e=ws.current;return e!==null?e:qe.pooledCache}function Ul(e,n){n===null?St(ws,ws.current):St(ws,n.pool)}function Em(){var e=Ju();return e===null?null:{parent:dn._currentValue,pool:e}}var ur=Error(s(460)),$u=Error(s(474)),Ll=Error(s(542)),Nl={then:function(){}};function bm(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Tm(e,n,a){switch(a=e[a],a===void 0?e.push(n):a!==n&&(n.then($i,$i),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Rm(e),e;default:if(typeof n.status=="string")n.then($i,$i);else{if(e=qe,e!==null&&100<e.shellSuspendCounter)throw Error(s(482));e=n,e.status="pending",e.then(function(o){if(n.status==="pending"){var u=n;u.status="fulfilled",u.value=o}},function(o){if(n.status==="pending"){var u=n;u.status="rejected",u.reason=o}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Rm(e),e}throw Us=n,ur}}function Ds(e){try{var n=e._init;return n(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Us=a,ur):a}}var Us=null;function Am(){if(Us===null)throw Error(s(459));var e=Us;return Us=null,e}function Rm(e){if(e===ur||e===Ll)throw Error(s(483))}var fr=null,xo=0;function Ol(e){var n=xo;return xo+=1,fr===null&&(fr=[]),Tm(fr,e,n)}function So(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function Pl(e,n){throw n.$$typeof===g?Error(s(525)):(e=Object.prototype.toString.call(n),Error(s(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function Cm(e){function n(J,X){if(e){var it=J.deletions;it===null?(J.deletions=[X],J.flags|=16):it.push(X)}}function a(J,X){if(!e)return null;for(;X!==null;)n(J,X),X=X.sibling;return null}function o(J){for(var X=new Map;J!==null;)J.key!==null?X.set(J.key,J):X.set(J.index,J),J=J.sibling;return X}function u(J,X){return J=ea(J,X),J.index=0,J.sibling=null,J}function f(J,X,it){return J.index=it,e?(it=J.alternate,it!==null?(it=it.index,it<X?(J.flags|=67108866,X):it):(J.flags|=67108866,X)):(J.flags|=1048576,X)}function x(J){return e&&J.alternate===null&&(J.flags|=67108866),J}function R(J,X,it,_t){return X===null||X.tag!==6?(X=Gu(it,J.mode,_t),X.return=J,X):(X=u(X,it),X.return=J,X)}function V(J,X,it,_t){var Kt=it.type;return Kt===C?pt(J,X,it.props.children,_t,it.key):X!==null&&(X.elementType===Kt||typeof Kt=="object"&&Kt!==null&&Kt.$$typeof===T&&Ds(Kt)===X.type)?(X=u(X,it.props),So(X,it),X.return=J,X):(X=Rl(it.type,it.key,it.props,null,J.mode,_t),So(X,it),X.return=J,X)}function at(J,X,it,_t){return X===null||X.tag!==4||X.stateNode.containerInfo!==it.containerInfo||X.stateNode.implementation!==it.implementation?(X=Vu(it,J.mode,_t),X.return=J,X):(X=u(X,it.children||[]),X.return=J,X)}function pt(J,X,it,_t,Kt){return X===null||X.tag!==7?(X=Ts(it,J.mode,_t,Kt),X.return=J,X):(X=u(X,it),X.return=J,X)}function xt(J,X,it){if(typeof X=="string"&&X!==""||typeof X=="number"||typeof X=="bigint")return X=Gu(""+X,J.mode,it),X.return=J,X;if(typeof X=="object"&&X!==null){switch(X.$$typeof){case M:return it=Rl(X.type,X.key,X.props,null,J.mode,it),So(it,X),it.return=J,it;case b:return X=Vu(X,J.mode,it),X.return=J,X;case T:return X=Ds(X),xt(J,X,it)}if(j(X)||$(X))return X=Ts(X,J.mode,it,null),X.return=J,X;if(typeof X.then=="function")return xt(J,Ol(X),it);if(X.$$typeof===O)return xt(J,Dl(J,X),it);Pl(J,X)}return null}function lt(J,X,it,_t){var Kt=X!==null?X.key:null;if(typeof it=="string"&&it!==""||typeof it=="number"||typeof it=="bigint")return Kt!==null?null:R(J,X,""+it,_t);if(typeof it=="object"&&it!==null){switch(it.$$typeof){case M:return it.key===Kt?V(J,X,it,_t):null;case b:return it.key===Kt?at(J,X,it,_t):null;case T:return it=Ds(it),lt(J,X,it,_t)}if(j(it)||$(it))return Kt!==null?null:pt(J,X,it,_t,null);if(typeof it.then=="function")return lt(J,X,Ol(it),_t);if(it.$$typeof===O)return lt(J,X,Dl(J,it),_t);Pl(J,it)}return null}function ct(J,X,it,_t,Kt){if(typeof _t=="string"&&_t!==""||typeof _t=="number"||typeof _t=="bigint")return J=J.get(it)||null,R(X,J,""+_t,Kt);if(typeof _t=="object"&&_t!==null){switch(_t.$$typeof){case M:return J=J.get(_t.key===null?it:_t.key)||null,V(X,J,_t,Kt);case b:return J=J.get(_t.key===null?it:_t.key)||null,at(X,J,_t,Kt);case T:return _t=Ds(_t),ct(J,X,it,_t,Kt)}if(j(_t)||$(_t))return J=J.get(it)||null,pt(X,J,_t,Kt,null);if(typeof _t.then=="function")return ct(J,X,it,Ol(_t),Kt);if(_t.$$typeof===O)return ct(J,X,it,Dl(X,_t),Kt);Pl(X,_t)}return null}function jt(J,X,it,_t){for(var Kt=null,Ce=null,qt=X,ue=X=0,Ee=null;qt!==null&&ue<it.length;ue++){qt.index>ue?(Ee=qt,qt=null):Ee=qt.sibling;var we=lt(J,qt,it[ue],_t);if(we===null){qt===null&&(qt=Ee);break}e&&qt&&we.alternate===null&&n(J,qt),X=f(we,X,ue),Ce===null?Kt=we:Ce.sibling=we,Ce=we,qt=Ee}if(ue===it.length)return a(J,qt),be&&na(J,ue),Kt;if(qt===null){for(;ue<it.length;ue++)qt=xt(J,it[ue],_t),qt!==null&&(X=f(qt,X,ue),Ce===null?Kt=qt:Ce.sibling=qt,Ce=qt);return be&&na(J,ue),Kt}for(qt=o(qt);ue<it.length;ue++)Ee=ct(qt,J,ue,it[ue],_t),Ee!==null&&(e&&Ee.alternate!==null&&qt.delete(Ee.key===null?ue:Ee.key),X=f(Ee,X,ue),Ce===null?Kt=Ee:Ce.sibling=Ee,Ce=Ee);return e&&qt.forEach(function(ns){return n(J,ns)}),be&&na(J,ue),Kt}function Jt(J,X,it,_t){if(it==null)throw Error(s(151));for(var Kt=null,Ce=null,qt=X,ue=X=0,Ee=null,we=it.next();qt!==null&&!we.done;ue++,we=it.next()){qt.index>ue?(Ee=qt,qt=null):Ee=qt.sibling;var ns=lt(J,qt,we.value,_t);if(ns===null){qt===null&&(qt=Ee);break}e&&qt&&ns.alternate===null&&n(J,qt),X=f(ns,X,ue),Ce===null?Kt=ns:Ce.sibling=ns,Ce=ns,qt=Ee}if(we.done)return a(J,qt),be&&na(J,ue),Kt;if(qt===null){for(;!we.done;ue++,we=it.next())we=xt(J,we.value,_t),we!==null&&(X=f(we,X,ue),Ce===null?Kt=we:Ce.sibling=we,Ce=we);return be&&na(J,ue),Kt}for(qt=o(qt);!we.done;ue++,we=it.next())we=ct(qt,J,ue,we.value,_t),we!==null&&(e&&we.alternate!==null&&qt.delete(we.key===null?ue:we.key),X=f(we,X,ue),Ce===null?Kt=we:Ce.sibling=we,Ce=we);return e&&qt.forEach(function(Uy){return n(J,Uy)}),be&&na(J,ue),Kt}function ke(J,X,it,_t){if(typeof it=="object"&&it!==null&&it.type===C&&it.key===null&&(it=it.props.children),typeof it=="object"&&it!==null){switch(it.$$typeof){case M:t:{for(var Kt=it.key;X!==null;){if(X.key===Kt){if(Kt=it.type,Kt===C){if(X.tag===7){a(J,X.sibling),_t=u(X,it.props.children),_t.return=J,J=_t;break t}}else if(X.elementType===Kt||typeof Kt=="object"&&Kt!==null&&Kt.$$typeof===T&&Ds(Kt)===X.type){a(J,X.sibling),_t=u(X,it.props),So(_t,it),_t.return=J,J=_t;break t}a(J,X);break}else n(J,X);X=X.sibling}it.type===C?(_t=Ts(it.props.children,J.mode,_t,it.key),_t.return=J,J=_t):(_t=Rl(it.type,it.key,it.props,null,J.mode,_t),So(_t,it),_t.return=J,J=_t)}return x(J);case b:t:{for(Kt=it.key;X!==null;){if(X.key===Kt)if(X.tag===4&&X.stateNode.containerInfo===it.containerInfo&&X.stateNode.implementation===it.implementation){a(J,X.sibling),_t=u(X,it.children||[]),_t.return=J,J=_t;break t}else{a(J,X);break}else n(J,X);X=X.sibling}_t=Vu(it,J.mode,_t),_t.return=J,J=_t}return x(J);case T:return it=Ds(it),ke(J,X,it,_t)}if(j(it))return jt(J,X,it,_t);if($(it)){if(Kt=$(it),typeof Kt!="function")throw Error(s(150));return it=Kt.call(it),Jt(J,X,it,_t)}if(typeof it.then=="function")return ke(J,X,Ol(it),_t);if(it.$$typeof===O)return ke(J,X,Dl(J,it),_t);Pl(J,it)}return typeof it=="string"&&it!==""||typeof it=="number"||typeof it=="bigint"?(it=""+it,X!==null&&X.tag===6?(a(J,X.sibling),_t=u(X,it),_t.return=J,J=_t):(a(J,X),_t=Gu(it,J.mode,_t),_t.return=J,J=_t),x(J)):a(J,X)}return function(J,X,it,_t){try{xo=0;var Kt=ke(J,X,it,_t);return fr=null,Kt}catch(qt){if(qt===ur||qt===Ll)throw qt;var Ce=ai(29,qt,null,J.mode);return Ce.lanes=_t,Ce.return=J,Ce}}}var Ls=Cm(!0),wm=Cm(!1),za=!1;function tf(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function ef(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Ha(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Ga(e,n,a){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Ue&2)!==0){var u=o.pending;return u===null?n.next=n:(n.next=u.next,u.next=n),o.pending=n,n=Al(e),hm(e,null,a),n}return Tl(e,o,n,a),Al(e)}function yo(e,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var o=n.lanes;o&=e.pendingLanes,a|=o,n.lanes=a,mi(e,a)}}function nf(e,n){var a=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var u=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var x={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?u=f=x:f=f.next=x,a=a.next}while(a!==null);f===null?u=f=n:f=f.next=n}else u=f=n;a={baseState:o.baseState,firstBaseUpdate:u,lastBaseUpdate:f,shared:o.shared,callbacks:o.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=n:e.next=n,a.lastBaseUpdate=n}var af=!1;function Mo(){if(af){var e=cr;if(e!==null)throw e}}function Eo(e,n,a,o){af=!1;var u=e.updateQueue;za=!1;var f=u.firstBaseUpdate,x=u.lastBaseUpdate,R=u.shared.pending;if(R!==null){u.shared.pending=null;var V=R,at=V.next;V.next=null,x===null?f=at:x.next=at,x=V;var pt=e.alternate;pt!==null&&(pt=pt.updateQueue,R=pt.lastBaseUpdate,R!==x&&(R===null?pt.firstBaseUpdate=at:R.next=at,pt.lastBaseUpdate=V))}if(f!==null){var xt=u.baseState;x=0,pt=at=V=null,R=f;do{var lt=R.lane&-536870913,ct=lt!==R.lane;if(ct?(Me&lt)===lt:(o&lt)===lt){lt!==0&&lt===lr&&(af=!0),pt!==null&&(pt=pt.next={lane:0,tag:R.tag,payload:R.payload,callback:null,next:null});t:{var jt=e,Jt=R;lt=n;var ke=a;switch(Jt.tag){case 1:if(jt=Jt.payload,typeof jt=="function"){xt=jt.call(ke,xt,lt);break t}xt=jt;break t;case 3:jt.flags=jt.flags&-65537|128;case 0:if(jt=Jt.payload,lt=typeof jt=="function"?jt.call(ke,xt,lt):jt,lt==null)break t;xt=v({},xt,lt);break t;case 2:za=!0}}lt=R.callback,lt!==null&&(e.flags|=64,ct&&(e.flags|=8192),ct=u.callbacks,ct===null?u.callbacks=[lt]:ct.push(lt))}else ct={lane:lt,tag:R.tag,payload:R.payload,callback:R.callback,next:null},pt===null?(at=pt=ct,V=xt):pt=pt.next=ct,x|=lt;if(R=R.next,R===null){if(R=u.shared.pending,R===null)break;ct=R,R=ct.next,ct.next=null,u.lastBaseUpdate=ct,u.shared.pending=null}}while(!0);pt===null&&(V=xt),u.baseState=V,u.firstBaseUpdate=at,u.lastBaseUpdate=pt,f===null&&(u.shared.lanes=0),Wa|=x,e.lanes=x,e.memoizedState=xt}}function Dm(e,n){if(typeof e!="function")throw Error(s(191,e));e.call(n)}function Um(e,n){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)Dm(a[e],n)}var hr=I(null),Il=I(0);function Lm(e,n){e=da,St(Il,e),St(hr,n),da=e|n.baseLanes}function sf(){St(Il,da),St(hr,hr.current)}function rf(){da=Il.current,Q(hr),Q(Il)}var si=I(null),yi=null;function Va(e){var n=e.alternate;St(un,un.current&1),St(si,e),yi===null&&(n===null||hr.current!==null||n.memoizedState!==null)&&(yi=e)}function of(e){St(un,un.current),St(si,e),yi===null&&(yi=e)}function Nm(e){e.tag===22?(St(un,un.current),St(si,e),yi===null&&(yi=e)):ka()}function ka(){St(un,un.current),St(si,si.current)}function ri(e){Q(si),yi===e&&(yi=null),Q(un)}var un=I(0);function Fl(e){for(var n=e;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||dh(a)||ph(a)))return n}else if(n.tag===19&&(n.memoizedProps.revealOrder==="forwards"||n.memoizedProps.revealOrder==="backwards"||n.memoizedProps.revealOrder==="unstable_legacy-backwards"||n.memoizedProps.revealOrder==="together")){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var sa=0,le=null,Ge=null,pn=null,Bl=!1,dr=!1,Ns=!1,zl=0,bo=0,pr=null,yS=0;function an(){throw Error(s(321))}function lf(e,n){if(n===null)return!1;for(var a=0;a<n.length&&a<e.length;a++)if(!ii(e[a],n[a]))return!1;return!0}function cf(e,n,a,o,u,f){return sa=f,le=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,L.H=e===null||e.memoizedState===null?g0:bf,Ns=!1,f=a(o,u),Ns=!1,dr&&(f=Pm(n,a,o,u)),Om(e),f}function Om(e){L.H=Ro;var n=Ge!==null&&Ge.next!==null;if(sa=0,pn=Ge=le=null,Bl=!1,bo=0,pr=null,n)throw Error(s(300));e===null||mn||(e=e.dependencies,e!==null&&wl(e)&&(mn=!0))}function Pm(e,n,a,o){le=e;var u=0;do{if(dr&&(pr=null),bo=0,dr=!1,25<=u)throw Error(s(301));if(u+=1,pn=Ge=null,e.updateQueue!=null){var f=e.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}L.H=_0,f=n(a,o)}while(dr);return f}function MS(){var e=L.H,n=e.useState()[0];return n=typeof n.then=="function"?To(n):n,e=e.useState()[0],(Ge!==null?Ge.memoizedState:null)!==e&&(le.flags|=1024),n}function uf(){var e=zl!==0;return zl=0,e}function ff(e,n,a){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~a}function hf(e){if(Bl){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}Bl=!1}sa=0,pn=Ge=le=null,dr=!1,bo=zl=0,pr=null}function zn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return pn===null?le.memoizedState=pn=e:pn=pn.next=e,pn}function fn(){if(Ge===null){var e=le.alternate;e=e!==null?e.memoizedState:null}else e=Ge.next;var n=pn===null?le.memoizedState:pn.next;if(n!==null)pn=n,Ge=e;else{if(e===null)throw le.alternate===null?Error(s(467)):Error(s(310));Ge=e,e={memoizedState:Ge.memoizedState,baseState:Ge.baseState,baseQueue:Ge.baseQueue,queue:Ge.queue,next:null},pn===null?le.memoizedState=pn=e:pn=pn.next=e}return pn}function Hl(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function To(e){var n=bo;return bo+=1,pr===null&&(pr=[]),e=Tm(pr,e,n),n=le,(pn===null?n.memoizedState:pn.next)===null&&(n=n.alternate,L.H=n===null||n.memoizedState===null?g0:bf),e}function Gl(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return To(e);if(e.$$typeof===O)return wn(e)}throw Error(s(438,String(e)))}function df(e){var n=null,a=le.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var o=le.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(n={data:o.data.map(function(u){return u.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=Hl(),le.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(e),o=0;o<e;o++)a[o]=q;return n.index++,a}function ra(e,n){return typeof n=="function"?n(e):n}function Vl(e){var n=fn();return pf(n,Ge,e)}function pf(e,n,a){var o=e.queue;if(o===null)throw Error(s(311));o.lastRenderedReducer=a;var u=e.baseQueue,f=o.pending;if(f!==null){if(u!==null){var x=u.next;u.next=f.next,f.next=x}n.baseQueue=u=f,o.pending=null}if(f=e.baseState,u===null)e.memoizedState=f;else{n=u.next;var R=x=null,V=null,at=n,pt=!1;do{var xt=at.lane&-536870913;if(xt!==at.lane?(Me&xt)===xt:(sa&xt)===xt){var lt=at.revertLane;if(lt===0)V!==null&&(V=V.next={lane:0,revertLane:0,gesture:null,action:at.action,hasEagerState:at.hasEagerState,eagerState:at.eagerState,next:null}),xt===lr&&(pt=!0);else if((sa&lt)===lt){at=at.next,lt===lr&&(pt=!0);continue}else xt={lane:0,revertLane:at.revertLane,gesture:null,action:at.action,hasEagerState:at.hasEagerState,eagerState:at.eagerState,next:null},V===null?(R=V=xt,x=f):V=V.next=xt,le.lanes|=lt,Wa|=lt;xt=at.action,Ns&&a(f,xt),f=at.hasEagerState?at.eagerState:a(f,xt)}else lt={lane:xt,revertLane:at.revertLane,gesture:at.gesture,action:at.action,hasEagerState:at.hasEagerState,eagerState:at.eagerState,next:null},V===null?(R=V=lt,x=f):V=V.next=lt,le.lanes|=xt,Wa|=xt;at=at.next}while(at!==null&&at!==n);if(V===null?x=f:V.next=R,!ii(f,e.memoizedState)&&(mn=!0,pt&&(a=cr,a!==null)))throw a;e.memoizedState=f,e.baseState=x,e.baseQueue=V,o.lastRenderedState=f}return u===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function mf(e){var n=fn(),a=n.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=e;var o=a.dispatch,u=a.pending,f=n.memoizedState;if(u!==null){a.pending=null;var x=u=u.next;do f=e(f,x.action),x=x.next;while(x!==u);ii(f,n.memoizedState)||(mn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,o]}function Im(e,n,a){var o=le,u=fn(),f=be;if(f){if(a===void 0)throw Error(s(407));a=a()}else a=n();var x=!ii((Ge||u).memoizedState,a);if(x&&(u.memoizedState=a,mn=!0),u=u.queue,vf(zm.bind(null,o,u,e),[e]),u.getSnapshot!==n||x||pn!==null&&pn.memoizedState.tag&1){if(o.flags|=2048,mr(9,{destroy:void 0},Bm.bind(null,o,u,a,n),null),qe===null)throw Error(s(349));f||(sa&127)!==0||Fm(o,n,a)}return a}function Fm(e,n,a){e.flags|=16384,e={getSnapshot:n,value:a},n=le.updateQueue,n===null?(n=Hl(),le.updateQueue=n,n.stores=[e]):(a=n.stores,a===null?n.stores=[e]:a.push(e))}function Bm(e,n,a,o){n.value=a,n.getSnapshot=o,Hm(n)&&Gm(e)}function zm(e,n,a){return a(function(){Hm(n)&&Gm(e)})}function Hm(e){var n=e.getSnapshot;e=e.value;try{var a=n();return!ii(e,a)}catch{return!0}}function Gm(e){var n=bs(e,2);n!==null&&Yn(n,e,2)}function gf(e){var n=zn();if(typeof e=="function"){var a=e;if(e=a(),Ns){Ot(!0);try{a()}finally{Ot(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ra,lastRenderedState:e},n}function Vm(e,n,a,o){return e.baseState=a,pf(e,Ge,typeof o=="function"?o:ra)}function ES(e,n,a,o,u){if(jl(e))throw Error(s(485));if(e=n.action,e!==null){var f={payload:u,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(x){f.listeners.push(x)}};L.T!==null?a(!0):f.isTransition=!1,o(f),a=n.pending,a===null?(f.next=n.pending=f,km(n,f)):(f.next=a.next,n.pending=a.next=f)}}function km(e,n){var a=n.action,o=n.payload,u=e.state;if(n.isTransition){var f=L.T,x={};L.T=x;try{var R=a(u,o),V=L.S;V!==null&&V(x,R),Xm(e,n,R)}catch(at){_f(e,n,at)}finally{f!==null&&x.types!==null&&(f.types=x.types),L.T=f}}else try{f=a(u,o),Xm(e,n,f)}catch(at){_f(e,n,at)}}function Xm(e,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(o){jm(e,n,o)},function(o){return _f(e,n,o)}):jm(e,n,a)}function jm(e,n,a){n.status="fulfilled",n.value=a,Wm(n),e.state=a,n=e.pending,n!==null&&(a=n.next,a===n?e.pending=null:(a=a.next,n.next=a,km(e,a)))}function _f(e,n,a){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do n.status="rejected",n.reason=a,Wm(n),n=n.next;while(n!==o)}e.action=null}function Wm(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function qm(e,n){return n}function Ym(e,n){if(be){var a=qe.formState;if(a!==null){t:{var o=le;if(be){if(Ze){e:{for(var u=Ze,f=Si;u.nodeType!==8;){if(!f){u=null;break e}if(u=Mi(u.nextSibling),u===null){u=null;break e}}f=u.data,u=f==="F!"||f==="F"?u:null}if(u){Ze=Mi(u.nextSibling),o=u.data==="F!";break t}}Fa(o)}o=!1}o&&(n=a[0])}}return a=zn(),a.memoizedState=a.baseState=n,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:qm,lastRenderedState:n},a.queue=o,a=d0.bind(null,le,o),o.dispatch=a,o=gf(!1),f=Ef.bind(null,le,!1,o.queue),o=zn(),u={state:n,dispatch:null,action:e,pending:null},o.queue=u,a=ES.bind(null,le,u,f,a),u.dispatch=a,o.memoizedState=e,[n,a,!1]}function Zm(e){var n=fn();return Km(n,Ge,e)}function Km(e,n,a){if(n=pf(e,n,qm)[0],e=Vl(ra)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var o=To(n)}catch(x){throw x===ur?Ll:x}else o=n;n=fn();var u=n.queue,f=u.dispatch;return a!==n.memoizedState&&(le.flags|=2048,mr(9,{destroy:void 0},bS.bind(null,u,a),null)),[o,f,e]}function bS(e,n){e.action=n}function Qm(e){var n=fn(),a=Ge;if(a!==null)return Km(n,a,e);fn(),n=n.memoizedState,a=fn();var o=a.queue.dispatch;return a.memoizedState=e,[n,o,!1]}function mr(e,n,a,o){return e={tag:e,create:a,deps:o,inst:n,next:null},n=le.updateQueue,n===null&&(n=Hl(),le.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=e.next=e:(o=a.next,a.next=e,e.next=o,n.lastEffect=e),e}function Jm(){return fn().memoizedState}function kl(e,n,a,o){var u=zn();le.flags|=e,u.memoizedState=mr(1|n,{destroy:void 0},a,o===void 0?null:o)}function Xl(e,n,a,o){var u=fn();o=o===void 0?null:o;var f=u.memoizedState.inst;Ge!==null&&o!==null&&lf(o,Ge.memoizedState.deps)?u.memoizedState=mr(n,f,a,o):(le.flags|=e,u.memoizedState=mr(1|n,f,a,o))}function $m(e,n){kl(8390656,8,e,n)}function vf(e,n){Xl(2048,8,e,n)}function TS(e){le.flags|=4;var n=le.updateQueue;if(n===null)n=Hl(),le.updateQueue=n,n.events=[e];else{var a=n.events;a===null?n.events=[e]:a.push(e)}}function t0(e){var n=fn().memoizedState;return TS({ref:n,nextImpl:e}),function(){if((Ue&2)!==0)throw Error(s(440));return n.impl.apply(void 0,arguments)}}function e0(e,n){return Xl(4,2,e,n)}function n0(e,n){return Xl(4,4,e,n)}function i0(e,n){if(typeof n=="function"){e=e();var a=n(e);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function a0(e,n,a){a=a!=null?a.concat([e]):null,Xl(4,4,i0.bind(null,n,e),a)}function xf(){}function s0(e,n){var a=fn();n=n===void 0?null:n;var o=a.memoizedState;return n!==null&&lf(n,o[1])?o[0]:(a.memoizedState=[e,n],e)}function r0(e,n){var a=fn();n=n===void 0?null:n;var o=a.memoizedState;if(n!==null&&lf(n,o[1]))return o[0];if(o=e(),Ns){Ot(!0);try{e()}finally{Ot(!1)}}return a.memoizedState=[o,n],o}function Sf(e,n,a){return a===void 0||(sa&1073741824)!==0&&(Me&261930)===0?e.memoizedState=n:(e.memoizedState=a,e=og(),le.lanes|=e,Wa|=e,a)}function o0(e,n,a,o){return ii(a,n)?a:hr.current!==null?(e=Sf(e,a,o),ii(e,n)||(mn=!0),e):(sa&42)===0||(sa&1073741824)!==0&&(Me&261930)===0?(mn=!0,e.memoizedState=a):(e=og(),le.lanes|=e,Wa|=e,n)}function l0(e,n,a,o,u){var f=H.p;H.p=f!==0&&8>f?f:8;var x=L.T,R={};L.T=R,Ef(e,!1,n,a);try{var V=u(),at=L.S;if(at!==null&&at(R,V),V!==null&&typeof V=="object"&&typeof V.then=="function"){var pt=SS(V,o);Ao(e,n,pt,ci(e))}else Ao(e,n,o,ci(e))}catch(xt){Ao(e,n,{then:function(){},status:"rejected",reason:xt},ci())}finally{H.p=f,x!==null&&R.types!==null&&(x.types=R.types),L.T=x}}function AS(){}function yf(e,n,a,o){if(e.tag!==5)throw Error(s(476));var u=c0(e).queue;l0(e,u,n,et,a===null?AS:function(){return u0(e),a(o)})}function c0(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:et,baseState:et,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ra,lastRenderedState:et},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ra,lastRenderedState:a},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function u0(e){var n=c0(e);n.next===null&&(n=e.alternate.memoizedState),Ao(e,n.next.queue,{},ci())}function Mf(){return wn(ko)}function f0(){return fn().memoizedState}function h0(){return fn().memoizedState}function RS(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var a=ci();e=Ha(a);var o=Ga(n,e,a);o!==null&&(Yn(o,n,a),yo(o,n,a)),n={cache:Ku()},e.payload=n;return}n=n.return}}function CS(e,n,a){var o=ci();a={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},jl(e)?p0(n,a):(a=zu(e,n,a,o),a!==null&&(Yn(a,e,o),m0(a,n,o)))}function d0(e,n,a){var o=ci();Ao(e,n,a,o)}function Ao(e,n,a,o){var u={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(jl(e))p0(n,u);else{var f=e.alternate;if(e.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var x=n.lastRenderedState,R=f(x,a);if(u.hasEagerState=!0,u.eagerState=R,ii(R,x))return Tl(e,n,u,0),qe===null&&bl(),!1}catch{}if(a=zu(e,n,u,o),a!==null)return Yn(a,e,o),m0(a,n,o),!0}return!1}function Ef(e,n,a,o){if(o={lane:2,revertLane:eh(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},jl(e)){if(n)throw Error(s(479))}else n=zu(e,a,o,2),n!==null&&Yn(n,e,2)}function jl(e){var n=e.alternate;return e===le||n!==null&&n===le}function p0(e,n){dr=Bl=!0;var a=e.pending;a===null?n.next=n:(n.next=a.next,a.next=n),e.pending=n}function m0(e,n,a){if((a&4194048)!==0){var o=n.lanes;o&=e.pendingLanes,a|=o,n.lanes=a,mi(e,a)}}var Ro={readContext:wn,use:Gl,useCallback:an,useContext:an,useEffect:an,useImperativeHandle:an,useLayoutEffect:an,useInsertionEffect:an,useMemo:an,useReducer:an,useRef:an,useState:an,useDebugValue:an,useDeferredValue:an,useTransition:an,useSyncExternalStore:an,useId:an,useHostTransitionStatus:an,useFormState:an,useActionState:an,useOptimistic:an,useMemoCache:an,useCacheRefresh:an};Ro.useEffectEvent=an;var g0={readContext:wn,use:Gl,useCallback:function(e,n){return zn().memoizedState=[e,n===void 0?null:n],e},useContext:wn,useEffect:$m,useImperativeHandle:function(e,n,a){a=a!=null?a.concat([e]):null,kl(4194308,4,i0.bind(null,n,e),a)},useLayoutEffect:function(e,n){return kl(4194308,4,e,n)},useInsertionEffect:function(e,n){kl(4,2,e,n)},useMemo:function(e,n){var a=zn();n=n===void 0?null:n;var o=e();if(Ns){Ot(!0);try{e()}finally{Ot(!1)}}return a.memoizedState=[o,n],o},useReducer:function(e,n,a){var o=zn();if(a!==void 0){var u=a(n);if(Ns){Ot(!0);try{a(n)}finally{Ot(!1)}}}else u=n;return o.memoizedState=o.baseState=u,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:u},o.queue=e,e=e.dispatch=CS.bind(null,le,e),[o.memoizedState,e]},useRef:function(e){var n=zn();return e={current:e},n.memoizedState=e},useState:function(e){e=gf(e);var n=e.queue,a=d0.bind(null,le,n);return n.dispatch=a,[e.memoizedState,a]},useDebugValue:xf,useDeferredValue:function(e,n){var a=zn();return Sf(a,e,n)},useTransition:function(){var e=gf(!1);return e=l0.bind(null,le,e.queue,!0,!1),zn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,a){var o=le,u=zn();if(be){if(a===void 0)throw Error(s(407));a=a()}else{if(a=n(),qe===null)throw Error(s(349));(Me&127)!==0||Fm(o,n,a)}u.memoizedState=a;var f={value:a,getSnapshot:n};return u.queue=f,$m(zm.bind(null,o,f,e),[e]),o.flags|=2048,mr(9,{destroy:void 0},Bm.bind(null,o,f,a,n),null),a},useId:function(){var e=zn(),n=qe.identifierPrefix;if(be){var a=Hi,o=zi;a=(o&~(1<<32-Pt(o)-1)).toString(32)+a,n="_"+n+"R_"+a,a=zl++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=yS++,n="_"+n+"r_"+a.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:Mf,useFormState:Ym,useActionState:Ym,useOptimistic:function(e){var n=zn();n.memoizedState=n.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=Ef.bind(null,le,!0,a),a.dispatch=n,[e,n]},useMemoCache:df,useCacheRefresh:function(){return zn().memoizedState=RS.bind(null,le)},useEffectEvent:function(e){var n=zn(),a={impl:e};return n.memoizedState=a,function(){if((Ue&2)!==0)throw Error(s(440));return a.impl.apply(void 0,arguments)}}},bf={readContext:wn,use:Gl,useCallback:s0,useContext:wn,useEffect:vf,useImperativeHandle:a0,useInsertionEffect:e0,useLayoutEffect:n0,useMemo:r0,useReducer:Vl,useRef:Jm,useState:function(){return Vl(ra)},useDebugValue:xf,useDeferredValue:function(e,n){var a=fn();return o0(a,Ge.memoizedState,e,n)},useTransition:function(){var e=Vl(ra)[0],n=fn().memoizedState;return[typeof e=="boolean"?e:To(e),n]},useSyncExternalStore:Im,useId:f0,useHostTransitionStatus:Mf,useFormState:Zm,useActionState:Zm,useOptimistic:function(e,n){var a=fn();return Vm(a,Ge,e,n)},useMemoCache:df,useCacheRefresh:h0};bf.useEffectEvent=t0;var _0={readContext:wn,use:Gl,useCallback:s0,useContext:wn,useEffect:vf,useImperativeHandle:a0,useInsertionEffect:e0,useLayoutEffect:n0,useMemo:r0,useReducer:mf,useRef:Jm,useState:function(){return mf(ra)},useDebugValue:xf,useDeferredValue:function(e,n){var a=fn();return Ge===null?Sf(a,e,n):o0(a,Ge.memoizedState,e,n)},useTransition:function(){var e=mf(ra)[0],n=fn().memoizedState;return[typeof e=="boolean"?e:To(e),n]},useSyncExternalStore:Im,useId:f0,useHostTransitionStatus:Mf,useFormState:Qm,useActionState:Qm,useOptimistic:function(e,n){var a=fn();return Ge!==null?Vm(a,Ge,e,n):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:df,useCacheRefresh:h0};_0.useEffectEvent=t0;function Tf(e,n,a,o){n=e.memoizedState,a=a(o,n),a=a==null?n:v({},n,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var Af={enqueueSetState:function(e,n,a){e=e._reactInternals;var o=ci(),u=Ha(o);u.payload=n,a!=null&&(u.callback=a),n=Ga(e,u,o),n!==null&&(Yn(n,e,o),yo(n,e,o))},enqueueReplaceState:function(e,n,a){e=e._reactInternals;var o=ci(),u=Ha(o);u.tag=1,u.payload=n,a!=null&&(u.callback=a),n=Ga(e,u,o),n!==null&&(Yn(n,e,o),yo(n,e,o))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var a=ci(),o=Ha(a);o.tag=2,n!=null&&(o.callback=n),n=Ga(e,o,a),n!==null&&(Yn(n,e,a),yo(n,e,a))}};function v0(e,n,a,o,u,f,x){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,f,x):n.prototype&&n.prototype.isPureReactComponent?!ho(a,o)||!ho(u,f):!0}function x0(e,n,a,o){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,o),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,o),n.state!==e&&Af.enqueueReplaceState(n,n.state,null)}function Os(e,n){var a=n;if("ref"in n){a={};for(var o in n)o!=="ref"&&(a[o]=n[o])}if(e=e.defaultProps){a===n&&(a=v({},a));for(var u in e)a[u]===void 0&&(a[u]=e[u])}return a}function S0(e){El(e)}function y0(e){console.error(e)}function M0(e){El(e)}function Wl(e,n){try{var a=e.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(o){setTimeout(function(){throw o})}}function E0(e,n,a){try{var o=e.onCaughtError;o(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function Rf(e,n,a){return a=Ha(a),a.tag=3,a.payload={element:null},a.callback=function(){Wl(e,n)},a}function b0(e){return e=Ha(e),e.tag=3,e}function T0(e,n,a,o){var u=a.type.getDerivedStateFromError;if(typeof u=="function"){var f=o.value;e.payload=function(){return u(f)},e.callback=function(){E0(n,a,o)}}var x=a.stateNode;x!==null&&typeof x.componentDidCatch=="function"&&(e.callback=function(){E0(n,a,o),typeof u!="function"&&(qa===null?qa=new Set([this]):qa.add(this));var R=o.stack;this.componentDidCatch(o.value,{componentStack:R!==null?R:""})})}function wS(e,n,a,o,u){if(a.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(n=a.alternate,n!==null&&or(n,a,u,!0),a=si.current,a!==null){switch(a.tag){case 31:case 13:return yi===null?ac():a.alternate===null&&sn===0&&(sn=3),a.flags&=-257,a.flags|=65536,a.lanes=u,o===Nl?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([o]):n.add(o),Jf(e,o,u)),!1;case 22:return a.flags|=65536,o===Nl?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([o])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([o]):a.add(o)),Jf(e,o,u)),!1}throw Error(s(435,a.tag))}return Jf(e,o,u),ac(),!1}if(be)return n=si.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=u,o!==ju&&(e=Error(s(422),{cause:o}),go(_i(e,a)))):(o!==ju&&(n=Error(s(423),{cause:o}),go(_i(n,a))),e=e.current.alternate,e.flags|=65536,u&=-u,e.lanes|=u,o=_i(o,a),u=Rf(e.stateNode,o,u),nf(e,u),sn!==4&&(sn=2)),!1;var f=Error(s(520),{cause:o});if(f=_i(f,a),Po===null?Po=[f]:Po.push(f),sn!==4&&(sn=2),n===null)return!0;o=_i(o,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,e=u&-u,a.lanes|=e,e=Rf(a.stateNode,o,e),nf(a,e),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(qa===null||!qa.has(f))))return a.flags|=65536,u&=-u,a.lanes|=u,u=b0(u),T0(u,e,a,o),nf(a,u),!1}a=a.return}while(a!==null);return!1}var Cf=Error(s(461)),mn=!1;function Dn(e,n,a,o){n.child=e===null?wm(n,null,a,o):Ls(n,e.child,a,o)}function A0(e,n,a,o,u){a=a.render;var f=n.ref;if("ref"in o){var x={};for(var R in o)R!=="ref"&&(x[R]=o[R])}else x=o;return Cs(n),o=cf(e,n,a,x,f,u),R=uf(),e!==null&&!mn?(ff(e,n,u),oa(e,n,u)):(be&&R&&ku(n),n.flags|=1,Dn(e,n,o,u),n.child)}function R0(e,n,a,o,u){if(e===null){var f=a.type;return typeof f=="function"&&!Hu(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,C0(e,n,f,o,u)):(e=Rl(a.type,null,o,n,n.mode,u),e.ref=n.ref,e.return=n,n.child=e)}if(f=e.child,!If(e,u)){var x=f.memoizedProps;if(a=a.compare,a=a!==null?a:ho,a(x,o)&&e.ref===n.ref)return oa(e,n,u)}return n.flags|=1,e=ea(f,o),e.ref=n.ref,e.return=n,n.child=e}function C0(e,n,a,o,u){if(e!==null){var f=e.memoizedProps;if(ho(f,o)&&e.ref===n.ref)if(mn=!1,n.pendingProps=o=f,If(e,u))(e.flags&131072)!==0&&(mn=!0);else return n.lanes=e.lanes,oa(e,n,u)}return wf(e,n,a,o,u)}function w0(e,n,a,o){var u=o.children,f=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,e!==null){for(o=n.child=e.child,u=0;o!==null;)u=u|o.lanes|o.childLanes,o=o.sibling;o=u&~f}else o=0,n.child=null;return D0(e,n,f,a,o)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ul(n,f!==null?f.cachePool:null),f!==null?Lm(n,f):sf(),Nm(n);else return o=n.lanes=536870912,D0(e,n,f!==null?f.baseLanes|a:a,a,o)}else f!==null?(Ul(n,f.cachePool),Lm(n,f),ka(),n.memoizedState=null):(e!==null&&Ul(n,null),sf(),ka());return Dn(e,n,u,a),n.child}function Co(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function D0(e,n,a,o,u){var f=Ju();return f=f===null?null:{parent:dn._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},e!==null&&Ul(n,null),sf(),Nm(n),e!==null&&or(e,n,o,!0),n.childLanes=u,null}function ql(e,n){return n=Zl({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function U0(e,n,a){return Ls(n,e.child,null,a),e=ql(n,n.pendingProps),e.flags|=2,ri(n),n.memoizedState=null,e}function DS(e,n,a){var o=n.pendingProps,u=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(be){if(o.mode==="hidden")return e=ql(n,o),n.lanes=536870912,Co(null,e);if(of(n),(e=Ze)?(e=kg(e,Si),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Pa!==null?{id:zi,overflow:Hi}:null,retryLane:536870912,hydrationErrors:null},a=pm(e),a.return=n,n.child=a,Cn=n,Ze=null)):e=null,e===null)throw Fa(n);return n.lanes=536870912,null}return ql(n,o)}var f=e.memoizedState;if(f!==null){var x=f.dehydrated;if(of(n),u)if(n.flags&256)n.flags&=-257,n=U0(e,n,a);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(s(558));else if(mn||or(e,n,a,!1),u=(a&e.childLanes)!==0,mn||u){if(o=qe,o!==null&&(x=ti(o,a),x!==0&&x!==f.retryLane))throw f.retryLane=x,bs(e,x),Yn(o,e,x),Cf;ac(),n=U0(e,n,a)}else e=f.treeContext,Ze=Mi(x.nextSibling),Cn=n,be=!0,Ia=null,Si=!1,e!==null&&_m(n,e),n=ql(n,o),n.flags|=4096;return n}return e=ea(e.child,{mode:o.mode,children:o.children}),e.ref=n.ref,n.child=e,e.return=n,e}function Yl(e,n){var a=n.ref;if(a===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(e===null||e.ref!==a)&&(n.flags|=4194816)}}function wf(e,n,a,o,u){return Cs(n),a=cf(e,n,a,o,void 0,u),o=uf(),e!==null&&!mn?(ff(e,n,u),oa(e,n,u)):(be&&o&&ku(n),n.flags|=1,Dn(e,n,a,u),n.child)}function L0(e,n,a,o,u,f){return Cs(n),n.updateQueue=null,a=Pm(n,o,a,u),Om(e),o=uf(),e!==null&&!mn?(ff(e,n,f),oa(e,n,f)):(be&&o&&ku(n),n.flags|=1,Dn(e,n,a,f),n.child)}function N0(e,n,a,o,u){if(Cs(n),n.stateNode===null){var f=ir,x=a.contextType;typeof x=="object"&&x!==null&&(f=wn(x)),f=new a(o,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=Af,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=o,f.state=n.memoizedState,f.refs={},tf(n),x=a.contextType,f.context=typeof x=="object"&&x!==null?wn(x):ir,f.state=n.memoizedState,x=a.getDerivedStateFromProps,typeof x=="function"&&(Tf(n,a,x,o),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(x=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),x!==f.state&&Af.enqueueReplaceState(f,f.state,null),Eo(n,o,f,u),Mo(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!0}else if(e===null){f=n.stateNode;var R=n.memoizedProps,V=Os(a,R);f.props=V;var at=f.context,pt=a.contextType;x=ir,typeof pt=="object"&&pt!==null&&(x=wn(pt));var xt=a.getDerivedStateFromProps;pt=typeof xt=="function"||typeof f.getSnapshotBeforeUpdate=="function",R=n.pendingProps!==R,pt||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(R||at!==x)&&x0(n,f,o,x),za=!1;var lt=n.memoizedState;f.state=lt,Eo(n,o,f,u),Mo(),at=n.memoizedState,R||lt!==at||za?(typeof xt=="function"&&(Tf(n,a,xt,o),at=n.memoizedState),(V=za||v0(n,a,V,o,lt,at,x))?(pt||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=o,n.memoizedState=at),f.props=o,f.state=at,f.context=x,o=V):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!1)}else{f=n.stateNode,ef(e,n),x=n.memoizedProps,pt=Os(a,x),f.props=pt,xt=n.pendingProps,lt=f.context,at=a.contextType,V=ir,typeof at=="object"&&at!==null&&(V=wn(at)),R=a.getDerivedStateFromProps,(at=typeof R=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(x!==xt||lt!==V)&&x0(n,f,o,V),za=!1,lt=n.memoizedState,f.state=lt,Eo(n,o,f,u),Mo();var ct=n.memoizedState;x!==xt||lt!==ct||za||e!==null&&e.dependencies!==null&&wl(e.dependencies)?(typeof R=="function"&&(Tf(n,a,R,o),ct=n.memoizedState),(pt=za||v0(n,a,pt,o,lt,ct,V)||e!==null&&e.dependencies!==null&&wl(e.dependencies))?(at||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(o,ct,V),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(o,ct,V)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||x===e.memoizedProps&&lt===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&lt===e.memoizedState||(n.flags|=1024),n.memoizedProps=o,n.memoizedState=ct),f.props=o,f.state=ct,f.context=V,o=pt):(typeof f.componentDidUpdate!="function"||x===e.memoizedProps&&lt===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&lt===e.memoizedState||(n.flags|=1024),o=!1)}return f=o,Yl(e,n),o=(n.flags&128)!==0,f||o?(f=n.stateNode,a=o&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,e!==null&&o?(n.child=Ls(n,e.child,null,u),n.child=Ls(n,null,a,u)):Dn(e,n,a,u),n.memoizedState=f.state,e=n.child):e=oa(e,n,u),e}function O0(e,n,a,o){return As(),n.flags|=256,Dn(e,n,a,o),n.child}var Df={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Uf(e){return{baseLanes:e,cachePool:Em()}}function Lf(e,n,a){return e=e!==null?e.childLanes&~a:0,n&&(e|=li),e}function P0(e,n,a){var o=n.pendingProps,u=!1,f=(n.flags&128)!==0,x;if((x=f)||(x=e!==null&&e.memoizedState===null?!1:(un.current&2)!==0),x&&(u=!0,n.flags&=-129),x=(n.flags&32)!==0,n.flags&=-33,e===null){if(be){if(u?Va(n):ka(),(e=Ze)?(e=kg(e,Si),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Pa!==null?{id:zi,overflow:Hi}:null,retryLane:536870912,hydrationErrors:null},a=pm(e),a.return=n,n.child=a,Cn=n,Ze=null)):e=null,e===null)throw Fa(n);return ph(e)?n.lanes=32:n.lanes=536870912,null}var R=o.children;return o=o.fallback,u?(ka(),u=n.mode,R=Zl({mode:"hidden",children:R},u),o=Ts(o,u,a,null),R.return=n,o.return=n,R.sibling=o,n.child=R,o=n.child,o.memoizedState=Uf(a),o.childLanes=Lf(e,x,a),n.memoizedState=Df,Co(null,o)):(Va(n),Nf(n,R))}var V=e.memoizedState;if(V!==null&&(R=V.dehydrated,R!==null)){if(f)n.flags&256?(Va(n),n.flags&=-257,n=Of(e,n,a)):n.memoizedState!==null?(ka(),n.child=e.child,n.flags|=128,n=null):(ka(),R=o.fallback,u=n.mode,o=Zl({mode:"visible",children:o.children},u),R=Ts(R,u,a,null),R.flags|=2,o.return=n,R.return=n,o.sibling=R,n.child=o,Ls(n,e.child,null,a),o=n.child,o.memoizedState=Uf(a),o.childLanes=Lf(e,x,a),n.memoizedState=Df,n=Co(null,o));else if(Va(n),ph(R)){if(x=R.nextSibling&&R.nextSibling.dataset,x)var at=x.dgst;x=at,o=Error(s(419)),o.stack="",o.digest=x,go({value:o,source:null,stack:null}),n=Of(e,n,a)}else if(mn||or(e,n,a,!1),x=(a&e.childLanes)!==0,mn||x){if(x=qe,x!==null&&(o=ti(x,a),o!==0&&o!==V.retryLane))throw V.retryLane=o,bs(e,o),Yn(x,e,o),Cf;dh(R)||ac(),n=Of(e,n,a)}else dh(R)?(n.flags|=192,n.child=e.child,n=null):(e=V.treeContext,Ze=Mi(R.nextSibling),Cn=n,be=!0,Ia=null,Si=!1,e!==null&&_m(n,e),n=Nf(n,o.children),n.flags|=4096);return n}return u?(ka(),R=o.fallback,u=n.mode,V=e.child,at=V.sibling,o=ea(V,{mode:"hidden",children:o.children}),o.subtreeFlags=V.subtreeFlags&65011712,at!==null?R=ea(at,R):(R=Ts(R,u,a,null),R.flags|=2),R.return=n,o.return=n,o.sibling=R,n.child=o,Co(null,o),o=n.child,R=e.child.memoizedState,R===null?R=Uf(a):(u=R.cachePool,u!==null?(V=dn._currentValue,u=u.parent!==V?{parent:V,pool:V}:u):u=Em(),R={baseLanes:R.baseLanes|a,cachePool:u}),o.memoizedState=R,o.childLanes=Lf(e,x,a),n.memoizedState=Df,Co(e.child,o)):(Va(n),a=e.child,e=a.sibling,a=ea(a,{mode:"visible",children:o.children}),a.return=n,a.sibling=null,e!==null&&(x=n.deletions,x===null?(n.deletions=[e],n.flags|=16):x.push(e)),n.child=a,n.memoizedState=null,a)}function Nf(e,n){return n=Zl({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function Zl(e,n){return e=ai(22,e,null,n),e.lanes=0,e}function Of(e,n,a){return Ls(n,e.child,null,a),e=Nf(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function I0(e,n,a){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n),Yu(e.return,n,a)}function Pf(e,n,a,o,u,f){var x=e.memoizedState;x===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:u,treeForkCount:f}:(x.isBackwards=n,x.rendering=null,x.renderingStartTime=0,x.last=o,x.tail=a,x.tailMode=u,x.treeForkCount=f)}function F0(e,n,a){var o=n.pendingProps,u=o.revealOrder,f=o.tail;o=o.children;var x=un.current,R=(x&2)!==0;if(R?(x=x&1|2,n.flags|=128):x&=1,St(un,x),Dn(e,n,o,a),o=be?mo:0,!R&&e!==null&&(e.flags&128)!==0)t:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&I0(e,a,n);else if(e.tag===19)I0(e,a,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break t;for(;e.sibling===null;){if(e.return===null||e.return===n)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(u){case"forwards":for(a=n.child,u=null;a!==null;)e=a.alternate,e!==null&&Fl(e)===null&&(u=a),a=a.sibling;a=u,a===null?(u=n.child,n.child=null):(u=a.sibling,a.sibling=null),Pf(n,!1,u,a,f,o);break;case"backwards":case"unstable_legacy-backwards":for(a=null,u=n.child,n.child=null;u!==null;){if(e=u.alternate,e!==null&&Fl(e)===null){n.child=u;break}e=u.sibling,u.sibling=a,a=u,u=e}Pf(n,!0,a,null,f,o);break;case"together":Pf(n,!1,null,null,void 0,o);break;default:n.memoizedState=null}return n.child}function oa(e,n,a){if(e!==null&&(n.dependencies=e.dependencies),Wa|=n.lanes,(a&n.childLanes)===0)if(e!==null){if(or(e,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(s(153));if(n.child!==null){for(e=n.child,a=ea(e,e.pendingProps),n.child=a,a.return=n;e.sibling!==null;)e=e.sibling,a=a.sibling=ea(e,e.pendingProps),a.return=n;a.sibling=null}return n.child}function If(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&wl(e)))}function US(e,n,a){switch(n.tag){case 3:At(n,n.stateNode.containerInfo),Ba(n,dn,e.memoizedState.cache),As();break;case 27:case 5:te(n);break;case 4:At(n,n.stateNode.containerInfo);break;case 10:Ba(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,of(n),null;break;case 13:var o=n.memoizedState;if(o!==null)return o.dehydrated!==null?(Va(n),n.flags|=128,null):(a&n.child.childLanes)!==0?P0(e,n,a):(Va(n),e=oa(e,n,a),e!==null?e.sibling:null);Va(n);break;case 19:var u=(e.flags&128)!==0;if(o=(a&n.childLanes)!==0,o||(or(e,n,a,!1),o=(a&n.childLanes)!==0),u){if(o)return F0(e,n,a);n.flags|=128}if(u=n.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),St(un,un.current),o)break;return null;case 22:return n.lanes=0,w0(e,n,a,n.pendingProps);case 24:Ba(n,dn,e.memoizedState.cache)}return oa(e,n,a)}function B0(e,n,a){if(e!==null)if(e.memoizedProps!==n.pendingProps)mn=!0;else{if(!If(e,a)&&(n.flags&128)===0)return mn=!1,US(e,n,a);mn=(e.flags&131072)!==0}else mn=!1,be&&(n.flags&1048576)!==0&&gm(n,mo,n.index);switch(n.lanes=0,n.tag){case 16:t:{var o=n.pendingProps;if(e=Ds(n.elementType),n.type=e,typeof e=="function")Hu(e)?(o=Os(e,o),n.tag=1,n=N0(null,n,e,o,a)):(n.tag=0,n=wf(null,n,e,o,a));else{if(e!=null){var u=e.$$typeof;if(u===P){n.tag=11,n=A0(null,n,e,o,a);break t}else if(u===B){n.tag=14,n=R0(null,n,e,o,a);break t}}throw n=ht(e)||e,Error(s(306,n,""))}}return n;case 0:return wf(e,n,n.type,n.pendingProps,a);case 1:return o=n.type,u=Os(o,n.pendingProps),N0(e,n,o,u,a);case 3:t:{if(At(n,n.stateNode.containerInfo),e===null)throw Error(s(387));o=n.pendingProps;var f=n.memoizedState;u=f.element,ef(e,n),Eo(n,o,null,a);var x=n.memoizedState;if(o=x.cache,Ba(n,dn,o),o!==f.cache&&Zu(n,[dn],a,!0),Mo(),o=x.element,f.isDehydrated)if(f={element:o,isDehydrated:!1,cache:x.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=O0(e,n,o,a);break t}else if(o!==u){u=_i(Error(s(424)),n),go(u),n=O0(e,n,o,a);break t}else for(e=n.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,Ze=Mi(e.firstChild),Cn=n,be=!0,Ia=null,Si=!0,a=wm(n,null,o,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(As(),o===u){n=oa(e,n,a);break t}Dn(e,n,o,a)}n=n.child}return n;case 26:return Yl(e,n),e===null?(a=Zg(n.type,null,n.pendingProps,null))?n.memoizedState=a:be||(a=n.type,e=n.pendingProps,o=fc(Z.current).createElement(a),o[cn]=n,o[Rn]=e,Un(o,a,e),hn(o),n.stateNode=o):n.memoizedState=Zg(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return te(n),e===null&&be&&(o=n.stateNode=Wg(n.type,n.pendingProps,Z.current),Cn=n,Si=!0,u=Ze,Qa(n.type)?(mh=u,Ze=Mi(o.firstChild)):Ze=u),Dn(e,n,n.pendingProps.children,a),Yl(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&be&&((u=o=Ze)&&(o=oy(o,n.type,n.pendingProps,Si),o!==null?(n.stateNode=o,Cn=n,Ze=Mi(o.firstChild),Si=!1,u=!0):u=!1),u||Fa(n)),te(n),u=n.type,f=n.pendingProps,x=e!==null?e.memoizedProps:null,o=f.children,uh(u,f)?o=null:x!==null&&uh(u,x)&&(n.flags|=32),n.memoizedState!==null&&(u=cf(e,n,MS,null,null,a),ko._currentValue=u),Yl(e,n),Dn(e,n,o,a),n.child;case 6:return e===null&&be&&((e=a=Ze)&&(a=ly(a,n.pendingProps,Si),a!==null?(n.stateNode=a,Cn=n,Ze=null,e=!0):e=!1),e||Fa(n)),null;case 13:return P0(e,n,a);case 4:return At(n,n.stateNode.containerInfo),o=n.pendingProps,e===null?n.child=Ls(n,null,o,a):Dn(e,n,o,a),n.child;case 11:return A0(e,n,n.type,n.pendingProps,a);case 7:return Dn(e,n,n.pendingProps,a),n.child;case 8:return Dn(e,n,n.pendingProps.children,a),n.child;case 12:return Dn(e,n,n.pendingProps.children,a),n.child;case 10:return o=n.pendingProps,Ba(n,n.type,o.value),Dn(e,n,o.children,a),n.child;case 9:return u=n.type._context,o=n.pendingProps.children,Cs(n),u=wn(u),o=o(u),n.flags|=1,Dn(e,n,o,a),n.child;case 14:return R0(e,n,n.type,n.pendingProps,a);case 15:return C0(e,n,n.type,n.pendingProps,a);case 19:return F0(e,n,a);case 31:return DS(e,n,a);case 22:return w0(e,n,a,n.pendingProps);case 24:return Cs(n),o=wn(dn),e===null?(u=Ju(),u===null&&(u=qe,f=Ku(),u.pooledCache=f,f.refCount++,f!==null&&(u.pooledCacheLanes|=a),u=f),n.memoizedState={parent:o,cache:u},tf(n),Ba(n,dn,u)):((e.lanes&a)!==0&&(ef(e,n),Eo(n,null,null,a),Mo()),u=e.memoizedState,f=n.memoizedState,u.parent!==o?(u={parent:o,cache:o},n.memoizedState=u,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=u),Ba(n,dn,o)):(o=f.cache,Ba(n,dn,o),o!==u.cache&&Zu(n,[dn],a,!0))),Dn(e,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(s(156,n.tag))}function la(e){e.flags|=4}function Ff(e,n,a,o,u){if((n=(e.mode&32)!==0)&&(n=!1),n){if(e.flags|=16777216,(u&335544128)===u)if(e.stateNode.complete)e.flags|=8192;else if(fg())e.flags|=8192;else throw Us=Nl,$u}else e.flags&=-16777217}function z0(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!t_(n))if(fg())e.flags|=8192;else throw Us=Nl,$u}function Kl(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?Et():536870912,e.lanes|=n,xr|=n)}function wo(e,n){if(!be)switch(e.tailMode){case"hidden":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Ke(e){var n=e.alternate!==null&&e.alternate.child===e.child,a=0,o=0;if(n)for(var u=e.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags&65011712,o|=u.flags&65011712,u.return=e,u=u.sibling;else for(u=e.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags,o|=u.flags,u.return=e,u=u.sibling;return e.subtreeFlags|=o,e.childLanes=a,n}function LS(e,n,a){var o=n.pendingProps;switch(Xu(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ke(n),null;case 1:return Ke(n),null;case 3:return a=n.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),n.memoizedState.cache!==o&&(n.flags|=2048),aa(dn),Ht(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(rr(n)?la(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Wu())),Ke(n),null;case 26:var u=n.type,f=n.memoizedState;return e===null?(la(n),f!==null?(Ke(n),z0(n,f)):(Ke(n),Ff(n,u,null,o,a))):f?f!==e.memoizedState?(la(n),Ke(n),z0(n,f)):(Ke(n),n.flags&=-16777217):(e=e.memoizedProps,e!==o&&la(n),Ke(n),Ff(n,u,e,o,a)),null;case 27:if(Qt(n),a=Z.current,u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==o&&la(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Ke(n),null}e=bt.current,rr(n)?vm(n):(e=Wg(u,o,a),n.stateNode=e,la(n))}return Ke(n),null;case 5:if(Qt(n),u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==o&&la(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Ke(n),null}if(f=bt.current,rr(n))vm(n);else{var x=fc(Z.current);switch(f){case 1:f=x.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:f=x.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":f=x.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":f=x.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":f=x.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof o.is=="string"?x.createElement("select",{is:o.is}):x.createElement("select"),o.multiple?f.multiple=!0:o.size&&(f.size=o.size);break;default:f=typeof o.is=="string"?x.createElement(u,{is:o.is}):x.createElement(u)}}f[cn]=n,f[Rn]=o;t:for(x=n.child;x!==null;){if(x.tag===5||x.tag===6)f.appendChild(x.stateNode);else if(x.tag!==4&&x.tag!==27&&x.child!==null){x.child.return=x,x=x.child;continue}if(x===n)break t;for(;x.sibling===null;){if(x.return===null||x.return===n)break t;x=x.return}x.sibling.return=x.return,x=x.sibling}n.stateNode=f;t:switch(Un(f,u,o),u){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break t;case"img":o=!0;break t;default:o=!1}o&&la(n)}}return Ke(n),Ff(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,a),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==o&&la(n);else{if(typeof o!="string"&&n.stateNode===null)throw Error(s(166));if(e=Z.current,rr(n)){if(e=n.stateNode,a=n.memoizedProps,o=null,u=Cn,u!==null)switch(u.tag){case 27:case 5:o=u.memoizedProps}e[cn]=n,e=!!(e.nodeValue===a||o!==null&&o.suppressHydrationWarning===!0||Pg(e.nodeValue,a)),e||Fa(n,!0)}else e=fc(e).createTextNode(o),e[cn]=n,n.stateNode=e}return Ke(n),null;case 31:if(a=n.memoizedState,e===null||e.memoizedState!==null){if(o=rr(n),a!==null){if(e===null){if(!o)throw Error(s(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(557));e[cn]=n}else As(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ke(n),e=!1}else a=Wu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return n.flags&256?(ri(n),n):(ri(n),null);if((n.flags&128)!==0)throw Error(s(558))}return Ke(n),null;case 13:if(o=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(u=rr(n),o!==null&&o.dehydrated!==null){if(e===null){if(!u)throw Error(s(318));if(u=n.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(s(317));u[cn]=n}else As(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ke(n),u=!1}else u=Wu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=u),u=!0;if(!u)return n.flags&256?(ri(n),n):(ri(n),null)}return ri(n),(n.flags&128)!==0?(n.lanes=a,n):(a=o!==null,e=e!==null&&e.memoizedState!==null,a&&(o=n.child,u=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(u=o.alternate.memoizedState.cachePool.pool),f=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(f=o.memoizedState.cachePool.pool),f!==u&&(o.flags|=2048)),a!==e&&a&&(n.child.flags|=8192),Kl(n,n.updateQueue),Ke(n),null);case 4:return Ht(),e===null&&sh(n.stateNode.containerInfo),Ke(n),null;case 10:return aa(n.type),Ke(n),null;case 19:if(Q(un),o=n.memoizedState,o===null)return Ke(n),null;if(u=(n.flags&128)!==0,f=o.rendering,f===null)if(u)wo(o,!1);else{if(sn!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(f=Fl(e),f!==null){for(n.flags|=128,wo(o,!1),e=f.updateQueue,n.updateQueue=e,Kl(n,e),n.subtreeFlags=0,e=a,a=n.child;a!==null;)dm(a,e),a=a.sibling;return St(un,un.current&1|2),be&&na(n,o.treeForkCount),n.child}e=e.sibling}o.tail!==null&&Ct()>ec&&(n.flags|=128,u=!0,wo(o,!1),n.lanes=4194304)}else{if(!u)if(e=Fl(f),e!==null){if(n.flags|=128,u=!0,e=e.updateQueue,n.updateQueue=e,Kl(n,e),wo(o,!0),o.tail===null&&o.tailMode==="hidden"&&!f.alternate&&!be)return Ke(n),null}else 2*Ct()-o.renderingStartTime>ec&&a!==536870912&&(n.flags|=128,u=!0,wo(o,!1),n.lanes=4194304);o.isBackwards?(f.sibling=n.child,n.child=f):(e=o.last,e!==null?e.sibling=f:n.child=f,o.last=f)}return o.tail!==null?(e=o.tail,o.rendering=e,o.tail=e.sibling,o.renderingStartTime=Ct(),e.sibling=null,a=un.current,St(un,u?a&1|2:a&1),be&&na(n,o.treeForkCount),e):(Ke(n),null);case 22:case 23:return ri(n),rf(),o=n.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(n.flags|=8192):o&&(n.flags|=8192),o?(a&536870912)!==0&&(n.flags&128)===0&&(Ke(n),n.subtreeFlags&6&&(n.flags|=8192)):Ke(n),a=n.updateQueue,a!==null&&Kl(n,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),o=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),o!==a&&(n.flags|=2048),e!==null&&Q(ws),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),aa(dn),Ke(n),null;case 25:return null;case 30:return null}throw Error(s(156,n.tag))}function NS(e,n){switch(Xu(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return aa(dn),Ht(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return Qt(n),null;case 31:if(n.memoizedState!==null){if(ri(n),n.alternate===null)throw Error(s(340));As()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if(ri(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(s(340));As()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return Q(un),null;case 4:return Ht(),null;case 10:return aa(n.type),null;case 22:case 23:return ri(n),rf(),e!==null&&Q(ws),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return aa(dn),null;case 25:return null;default:return null}}function H0(e,n){switch(Xu(n),n.tag){case 3:aa(dn),Ht();break;case 26:case 27:case 5:Qt(n);break;case 4:Ht();break;case 31:n.memoizedState!==null&&ri(n);break;case 13:ri(n);break;case 19:Q(un);break;case 10:aa(n.type);break;case 22:case 23:ri(n),rf(),e!==null&&Q(ws);break;case 24:aa(dn)}}function Do(e,n){try{var a=n.updateQueue,o=a!==null?a.lastEffect:null;if(o!==null){var u=o.next;a=u;do{if((a.tag&e)===e){o=void 0;var f=a.create,x=a.inst;o=f(),x.destroy=o}a=a.next}while(a!==u)}}catch(R){Be(n,n.return,R)}}function Xa(e,n,a){try{var o=n.updateQueue,u=o!==null?o.lastEffect:null;if(u!==null){var f=u.next;o=f;do{if((o.tag&e)===e){var x=o.inst,R=x.destroy;if(R!==void 0){x.destroy=void 0,u=n;var V=a,at=R;try{at()}catch(pt){Be(u,V,pt)}}}o=o.next}while(o!==f)}}catch(pt){Be(n,n.return,pt)}}function G0(e){var n=e.updateQueue;if(n!==null){var a=e.stateNode;try{Um(n,a)}catch(o){Be(e,e.return,o)}}}function V0(e,n,a){a.props=Os(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(o){Be(e,n,o)}}function Uo(e,n){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:o=e.stateNode;break;default:o=e.stateNode}typeof a=="function"?e.refCleanup=a(o):a.current=o}}catch(u){Be(e,n,u)}}function Gi(e,n){var a=e.ref,o=e.refCleanup;if(a!==null)if(typeof o=="function")try{o()}catch(u){Be(e,n,u)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(u){Be(e,n,u)}else a.current=null}function k0(e){var n=e.type,a=e.memoizedProps,o=e.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&o.focus();break t;case"img":a.src?o.src=a.src:a.srcSet&&(o.srcset=a.srcSet)}}catch(u){Be(e,e.return,u)}}function Bf(e,n,a){try{var o=e.stateNode;ey(o,e.type,a,n),o[Rn]=n}catch(u){Be(e,e.return,u)}}function X0(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Qa(e.type)||e.tag===4}function zf(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||X0(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Qa(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Hf(e,n,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(e),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=$i));else if(o!==4&&(o===27&&Qa(e.type)&&(a=e.stateNode,n=null),e=e.child,e!==null))for(Hf(e,n,a),e=e.sibling;e!==null;)Hf(e,n,a),e=e.sibling}function Ql(e,n,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,n?a.insertBefore(e,n):a.appendChild(e);else if(o!==4&&(o===27&&Qa(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(Ql(e,n,a),e=e.sibling;e!==null;)Ql(e,n,a),e=e.sibling}function j0(e){var n=e.stateNode,a=e.memoizedProps;try{for(var o=e.type,u=n.attributes;u.length;)n.removeAttributeNode(u[0]);Un(n,o,a),n[cn]=e,n[Rn]=a}catch(f){Be(e,e.return,f)}}var ca=!1,gn=!1,Gf=!1,W0=typeof WeakSet=="function"?WeakSet:Set,En=null;function OS(e,n){if(e=e.containerInfo,lh=vc,e=am(e),Nu(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else t:{a=(a=e.ownerDocument)&&a.defaultView||window;var o=a.getSelection&&a.getSelection();if(o&&o.rangeCount!==0){a=o.anchorNode;var u=o.anchorOffset,f=o.focusNode;o=o.focusOffset;try{a.nodeType,f.nodeType}catch{a=null;break t}var x=0,R=-1,V=-1,at=0,pt=0,xt=e,lt=null;e:for(;;){for(var ct;xt!==a||u!==0&&xt.nodeType!==3||(R=x+u),xt!==f||o!==0&&xt.nodeType!==3||(V=x+o),xt.nodeType===3&&(x+=xt.nodeValue.length),(ct=xt.firstChild)!==null;)lt=xt,xt=ct;for(;;){if(xt===e)break e;if(lt===a&&++at===u&&(R=x),lt===f&&++pt===o&&(V=x),(ct=xt.nextSibling)!==null)break;xt=lt,lt=xt.parentNode}xt=ct}a=R===-1||V===-1?null:{start:R,end:V}}else a=null}a=a||{start:0,end:0}}else a=null;for(ch={focusedElem:e,selectionRange:a},vc=!1,En=n;En!==null;)if(n=En,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,En=e;else for(;En!==null;){switch(n=En,f=n.alternate,e=n.flags,n.tag){case 0:if((e&4)!==0&&(e=n.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)u=e[a],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&f!==null){e=void 0,a=n,u=f.memoizedProps,f=f.memoizedState,o=a.stateNode;try{var jt=Os(a.type,u);e=o.getSnapshotBeforeUpdate(jt,f),o.__reactInternalSnapshotBeforeUpdate=e}catch(Jt){Be(a,a.return,Jt)}}break;case 3:if((e&1024)!==0){if(e=n.stateNode.containerInfo,a=e.nodeType,a===9)hh(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":hh(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(s(163))}if(e=n.sibling,e!==null){e.return=n.return,En=e;break}En=n.return}}function q0(e,n,a){var o=a.flags;switch(a.tag){case 0:case 11:case 15:fa(e,a),o&4&&Do(5,a);break;case 1:if(fa(e,a),o&4)if(e=a.stateNode,n===null)try{e.componentDidMount()}catch(x){Be(a,a.return,x)}else{var u=Os(a.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(u,n,e.__reactInternalSnapshotBeforeUpdate)}catch(x){Be(a,a.return,x)}}o&64&&G0(a),o&512&&Uo(a,a.return);break;case 3:if(fa(e,a),o&64&&(e=a.updateQueue,e!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{Um(e,n)}catch(x){Be(a,a.return,x)}}break;case 27:n===null&&o&4&&j0(a);case 26:case 5:fa(e,a),n===null&&o&4&&k0(a),o&512&&Uo(a,a.return);break;case 12:fa(e,a);break;case 31:fa(e,a),o&4&&K0(e,a);break;case 13:fa(e,a),o&4&&Q0(e,a),o&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=kS.bind(null,a),cy(e,a))));break;case 22:if(o=a.memoizedState!==null||ca,!o){n=n!==null&&n.memoizedState!==null||gn,u=ca;var f=gn;ca=o,(gn=n)&&!f?ha(e,a,(a.subtreeFlags&8772)!==0):fa(e,a),ca=u,gn=f}break;case 30:break;default:fa(e,a)}}function Y0(e){var n=e.alternate;n!==null&&(e.alternate=null,Y0(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&ao(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var tn=null,Xn=!1;function ua(e,n,a){for(a=a.child;a!==null;)Z0(e,n,a),a=a.sibling}function Z0(e,n,a){if(dt&&typeof dt.onCommitFiberUnmount=="function")try{dt.onCommitFiberUnmount(ft,a)}catch{}switch(a.tag){case 26:gn||Gi(a,n),ua(e,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:gn||Gi(a,n);var o=tn,u=Xn;Qa(a.type)&&(tn=a.stateNode,Xn=!1),ua(e,n,a),Ho(a.stateNode),tn=o,Xn=u;break;case 5:gn||Gi(a,n);case 6:if(o=tn,u=Xn,tn=null,ua(e,n,a),tn=o,Xn=u,tn!==null)if(Xn)try{(tn.nodeType===9?tn.body:tn.nodeName==="HTML"?tn.ownerDocument.body:tn).removeChild(a.stateNode)}catch(f){Be(a,n,f)}else try{tn.removeChild(a.stateNode)}catch(f){Be(a,n,f)}break;case 18:tn!==null&&(Xn?(e=tn,Gg(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),Rr(e)):Gg(tn,a.stateNode));break;case 4:o=tn,u=Xn,tn=a.stateNode.containerInfo,Xn=!0,ua(e,n,a),tn=o,Xn=u;break;case 0:case 11:case 14:case 15:Xa(2,a,n),gn||Xa(4,a,n),ua(e,n,a);break;case 1:gn||(Gi(a,n),o=a.stateNode,typeof o.componentWillUnmount=="function"&&V0(a,n,o)),ua(e,n,a);break;case 21:ua(e,n,a);break;case 22:gn=(o=gn)||a.memoizedState!==null,ua(e,n,a),gn=o;break;default:ua(e,n,a)}}function K0(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Rr(e)}catch(a){Be(n,n.return,a)}}}function Q0(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Rr(e)}catch(a){Be(n,n.return,a)}}function PS(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new W0),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new W0),n;default:throw Error(s(435,e.tag))}}function Jl(e,n){var a=PS(e);n.forEach(function(o){if(!a.has(o)){a.add(o);var u=XS.bind(null,e,o);o.then(u,u)}})}function jn(e,n){var a=n.deletions;if(a!==null)for(var o=0;o<a.length;o++){var u=a[o],f=e,x=n,R=x;t:for(;R!==null;){switch(R.tag){case 27:if(Qa(R.type)){tn=R.stateNode,Xn=!1;break t}break;case 5:tn=R.stateNode,Xn=!1;break t;case 3:case 4:tn=R.stateNode.containerInfo,Xn=!0;break t}R=R.return}if(tn===null)throw Error(s(160));Z0(f,x,u),tn=null,Xn=!1,f=u.alternate,f!==null&&(f.return=null),u.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)J0(n,e),n=n.sibling}var Di=null;function J0(e,n){var a=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:jn(n,e),Wn(e),o&4&&(Xa(3,e,e.return),Do(3,e),Xa(5,e,e.return));break;case 1:jn(n,e),Wn(e),o&512&&(gn||a===null||Gi(a,a.return)),o&64&&ca&&(e=e.updateQueue,e!==null&&(o=e.callbacks,o!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?o:a.concat(o))));break;case 26:var u=Di;if(jn(n,e),Wn(e),o&512&&(gn||a===null||Gi(a,a.return)),o&4){var f=a!==null?a.memoizedState:null;if(o=e.memoizedState,a===null)if(o===null)if(e.stateNode===null){t:{o=e.type,a=e.memoizedProps,u=u.ownerDocument||u;e:switch(o){case"title":f=u.getElementsByTagName("title")[0],(!f||f[wa]||f[cn]||f.namespaceURI==="http://www.w3.org/2000/svg"||f.hasAttribute("itemprop"))&&(f=u.createElement(o),u.head.insertBefore(f,u.querySelector("head > title"))),Un(f,o,a),f[cn]=e,hn(f),o=f;break t;case"link":var x=Jg("link","href",u).get(o+(a.href||""));if(x){for(var R=0;R<x.length;R++)if(f=x[R],f.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&f.getAttribute("rel")===(a.rel==null?null:a.rel)&&f.getAttribute("title")===(a.title==null?null:a.title)&&f.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){x.splice(R,1);break e}}f=u.createElement(o),Un(f,o,a),u.head.appendChild(f);break;case"meta":if(x=Jg("meta","content",u).get(o+(a.content||""))){for(R=0;R<x.length;R++)if(f=x[R],f.getAttribute("content")===(a.content==null?null:""+a.content)&&f.getAttribute("name")===(a.name==null?null:a.name)&&f.getAttribute("property")===(a.property==null?null:a.property)&&f.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&f.getAttribute("charset")===(a.charSet==null?null:a.charSet)){x.splice(R,1);break e}}f=u.createElement(o),Un(f,o,a),u.head.appendChild(f);break;default:throw Error(s(468,o))}f[cn]=e,hn(f),o=f}e.stateNode=o}else $g(u,e.type,e.stateNode);else e.stateNode=Qg(u,o,e.memoizedProps);else f!==o?(f===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):f.count--,o===null?$g(u,e.type,e.stateNode):Qg(u,o,e.memoizedProps)):o===null&&e.stateNode!==null&&Bf(e,e.memoizedProps,a.memoizedProps)}break;case 27:jn(n,e),Wn(e),o&512&&(gn||a===null||Gi(a,a.return)),a!==null&&o&4&&Bf(e,e.memoizedProps,a.memoizedProps);break;case 5:if(jn(n,e),Wn(e),o&512&&(gn||a===null||Gi(a,a.return)),e.flags&32){u=e.stateNode;try{ni(u,"")}catch(jt){Be(e,e.return,jt)}}o&4&&e.stateNode!=null&&(u=e.memoizedProps,Bf(e,u,a!==null?a.memoizedProps:u)),o&1024&&(Gf=!0);break;case 6:if(jn(n,e),Wn(e),o&4){if(e.stateNode===null)throw Error(s(162));o=e.memoizedProps,a=e.stateNode;try{a.nodeValue=o}catch(jt){Be(e,e.return,jt)}}break;case 3:if(pc=null,u=Di,Di=hc(n.containerInfo),jn(n,e),Di=u,Wn(e),o&4&&a!==null&&a.memoizedState.isDehydrated)try{Rr(n.containerInfo)}catch(jt){Be(e,e.return,jt)}Gf&&(Gf=!1,$0(e));break;case 4:o=Di,Di=hc(e.stateNode.containerInfo),jn(n,e),Wn(e),Di=o;break;case 12:jn(n,e),Wn(e);break;case 31:jn(n,e),Wn(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Jl(e,o)));break;case 13:jn(n,e),Wn(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(tc=Ct()),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Jl(e,o)));break;case 22:u=e.memoizedState!==null;var V=a!==null&&a.memoizedState!==null,at=ca,pt=gn;if(ca=at||u,gn=pt||V,jn(n,e),gn=pt,ca=at,Wn(e),o&8192)t:for(n=e.stateNode,n._visibility=u?n._visibility&-2:n._visibility|1,u&&(a===null||V||ca||gn||Ps(e)),a=null,n=e;;){if(n.tag===5||n.tag===26){if(a===null){V=a=n;try{if(f=V.stateNode,u)x=f.style,typeof x.setProperty=="function"?x.setProperty("display","none","important"):x.display="none";else{R=V.stateNode;var xt=V.memoizedProps.style,lt=xt!=null&&xt.hasOwnProperty("display")?xt.display:null;R.style.display=lt==null||typeof lt=="boolean"?"":(""+lt).trim()}}catch(jt){Be(V,V.return,jt)}}}else if(n.tag===6){if(a===null){V=n;try{V.stateNode.nodeValue=u?"":V.memoizedProps}catch(jt){Be(V,V.return,jt)}}}else if(n.tag===18){if(a===null){V=n;try{var ct=V.stateNode;u?Vg(ct,!0):Vg(V.stateNode,!1)}catch(jt){Be(V,V.return,jt)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===e)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break t;for(;n.sibling===null;){if(n.return===null||n.return===e)break t;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}o&4&&(o=e.updateQueue,o!==null&&(a=o.retryQueue,a!==null&&(o.retryQueue=null,Jl(e,a))));break;case 19:jn(n,e),Wn(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Jl(e,o)));break;case 30:break;case 21:break;default:jn(n,e),Wn(e)}}function Wn(e){var n=e.flags;if(n&2){try{for(var a,o=e.return;o!==null;){if(X0(o)){a=o;break}o=o.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var u=a.stateNode,f=zf(e);Ql(e,f,u);break;case 5:var x=a.stateNode;a.flags&32&&(ni(x,""),a.flags&=-33);var R=zf(e);Ql(e,R,x);break;case 3:case 4:var V=a.stateNode.containerInfo,at=zf(e);Hf(e,at,V);break;default:throw Error(s(161))}}catch(pt){Be(e,e.return,pt)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function $0(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;$0(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),e=e.sibling}}function fa(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)q0(e,n.alternate,n),n=n.sibling}function Ps(e){for(e=e.child;e!==null;){var n=e;switch(n.tag){case 0:case 11:case 14:case 15:Xa(4,n,n.return),Ps(n);break;case 1:Gi(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&V0(n,n.return,a),Ps(n);break;case 27:Ho(n.stateNode);case 26:case 5:Gi(n,n.return),Ps(n);break;case 22:n.memoizedState===null&&Ps(n);break;case 30:Ps(n);break;default:Ps(n)}e=e.sibling}}function ha(e,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var o=n.alternate,u=e,f=n,x=f.flags;switch(f.tag){case 0:case 11:case 15:ha(u,f,a),Do(4,f);break;case 1:if(ha(u,f,a),o=f,u=o.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(at){Be(o,o.return,at)}if(o=f,u=o.updateQueue,u!==null){var R=o.stateNode;try{var V=u.shared.hiddenCallbacks;if(V!==null)for(u.shared.hiddenCallbacks=null,u=0;u<V.length;u++)Dm(V[u],R)}catch(at){Be(o,o.return,at)}}a&&x&64&&G0(f),Uo(f,f.return);break;case 27:j0(f);case 26:case 5:ha(u,f,a),a&&o===null&&x&4&&k0(f),Uo(f,f.return);break;case 12:ha(u,f,a);break;case 31:ha(u,f,a),a&&x&4&&K0(u,f);break;case 13:ha(u,f,a),a&&x&4&&Q0(u,f);break;case 22:f.memoizedState===null&&ha(u,f,a),Uo(f,f.return);break;case 30:break;default:ha(u,f,a)}n=n.sibling}}function Vf(e,n){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&_o(a))}function kf(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&_o(e))}function Ui(e,n,a,o){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)tg(e,n,a,o),n=n.sibling}function tg(e,n,a,o){var u=n.flags;switch(n.tag){case 0:case 11:case 15:Ui(e,n,a,o),u&2048&&Do(9,n);break;case 1:Ui(e,n,a,o);break;case 3:Ui(e,n,a,o),u&2048&&(e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&_o(e)));break;case 12:if(u&2048){Ui(e,n,a,o),e=n.stateNode;try{var f=n.memoizedProps,x=f.id,R=f.onPostCommit;typeof R=="function"&&R(x,n.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(V){Be(n,n.return,V)}}else Ui(e,n,a,o);break;case 31:Ui(e,n,a,o);break;case 13:Ui(e,n,a,o);break;case 23:break;case 22:f=n.stateNode,x=n.alternate,n.memoizedState!==null?f._visibility&2?Ui(e,n,a,o):Lo(e,n):f._visibility&2?Ui(e,n,a,o):(f._visibility|=2,gr(e,n,a,o,(n.subtreeFlags&10256)!==0||!1)),u&2048&&Vf(x,n);break;case 24:Ui(e,n,a,o),u&2048&&kf(n.alternate,n);break;default:Ui(e,n,a,o)}}function gr(e,n,a,o,u){for(u=u&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=e,x=n,R=a,V=o,at=x.flags;switch(x.tag){case 0:case 11:case 15:gr(f,x,R,V,u),Do(8,x);break;case 23:break;case 22:var pt=x.stateNode;x.memoizedState!==null?pt._visibility&2?gr(f,x,R,V,u):Lo(f,x):(pt._visibility|=2,gr(f,x,R,V,u)),u&&at&2048&&Vf(x.alternate,x);break;case 24:gr(f,x,R,V,u),u&&at&2048&&kf(x.alternate,x);break;default:gr(f,x,R,V,u)}n=n.sibling}}function Lo(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=e,o=n,u=o.flags;switch(o.tag){case 22:Lo(a,o),u&2048&&Vf(o.alternate,o);break;case 24:Lo(a,o),u&2048&&kf(o.alternate,o);break;default:Lo(a,o)}n=n.sibling}}var No=8192;function _r(e,n,a){if(e.subtreeFlags&No)for(e=e.child;e!==null;)eg(e,n,a),e=e.sibling}function eg(e,n,a){switch(e.tag){case 26:_r(e,n,a),e.flags&No&&e.memoizedState!==null&&yy(a,Di,e.memoizedState,e.memoizedProps);break;case 5:_r(e,n,a);break;case 3:case 4:var o=Di;Di=hc(e.stateNode.containerInfo),_r(e,n,a),Di=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=No,No=16777216,_r(e,n,a),No=o):_r(e,n,a));break;default:_r(e,n,a)}}function ng(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function Oo(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];En=o,ag(o,e)}ng(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)ig(e),e=e.sibling}function ig(e){switch(e.tag){case 0:case 11:case 15:Oo(e),e.flags&2048&&Xa(9,e,e.return);break;case 3:Oo(e);break;case 12:Oo(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,$l(e)):Oo(e);break;default:Oo(e)}}function $l(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];En=o,ag(o,e)}ng(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:Xa(8,n,n.return),$l(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,$l(n));break;default:$l(n)}e=e.sibling}}function ag(e,n){for(;En!==null;){var a=En;switch(a.tag){case 0:case 11:case 15:Xa(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var o=a.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:_o(a.memoizedState.cache)}if(o=a.child,o!==null)o.return=a,En=o;else t:for(a=e;En!==null;){o=En;var u=o.sibling,f=o.return;if(Y0(o),o===a){En=null;break t}if(u!==null){u.return=f,En=u;break t}En=f}}}var IS={getCacheForType:function(e){var n=wn(dn),a=n.data.get(e);return a===void 0&&(a=e(),n.data.set(e,a)),a},cacheSignal:function(){return wn(dn).controller.signal}},FS=typeof WeakMap=="function"?WeakMap:Map,Ue=0,qe=null,xe=null,Me=0,Fe=0,oi=null,ja=!1,vr=!1,Xf=!1,da=0,sn=0,Wa=0,Is=0,jf=0,li=0,xr=0,Po=null,qn=null,Wf=!1,tc=0,sg=0,ec=1/0,nc=null,qa=null,xn=0,Ya=null,Sr=null,pa=0,qf=0,Yf=null,rg=null,Io=0,Zf=null;function ci(){return(Ue&2)!==0&&Me!==0?Me&-Me:L.T!==null?eh():eo()}function og(){if(li===0)if((Me&536870912)===0||be){var e=_e;_e<<=1,(_e&3932160)===0&&(_e=262144),li=e}else li=536870912;return e=si.current,e!==null&&(e.flags|=32),li}function Yn(e,n,a){(e===qe&&(Fe===2||Fe===9)||e.cancelPendingCommit!==null)&&(yr(e,0),Za(e,Me,li,!1)),ee(e,a),((Ue&2)===0||e!==qe)&&(e===qe&&((Ue&2)===0&&(Is|=a),sn===4&&Za(e,Me,li,!1)),Vi(e))}function lg(e,n,a){if((Ue&6)!==0)throw Error(s(327));var o=!a&&(n&127)===0&&(n&e.expiredLanes)===0||Bt(e,n),u=o?HS(e,n):Qf(e,n,!0),f=o;do{if(u===0){vr&&!o&&Za(e,n,0,!1);break}else{if(a=e.current.alternate,f&&!BS(a)){u=Qf(e,n,!1),f=!1;continue}if(u===2){if(f=n,e.errorRecoveryDisabledLanes&f)var x=0;else x=e.pendingLanes&-536870913,x=x!==0?x:x&536870912?536870912:0;if(x!==0){n=x;t:{var R=e;u=Po;var V=R.current.memoizedState.isDehydrated;if(V&&(yr(R,x).flags|=256),x=Qf(R,x,!1),x!==2){if(Xf&&!V){R.errorRecoveryDisabledLanes|=f,Is|=f,u=4;break t}f=qn,qn=u,f!==null&&(qn===null?qn=f:qn.push.apply(qn,f))}u=x}if(f=!1,u!==2)continue}}if(u===1){yr(e,0),Za(e,n,0,!0);break}t:{switch(o=e,f=u,f){case 0:case 1:throw Error(s(345));case 4:if((n&4194048)!==n)break;case 6:Za(o,n,li,!ja);break t;case 2:qn=null;break;case 3:case 5:break;default:throw Error(s(329))}if((n&62914560)===n&&(u=tc+300-Ct(),10<u)){if(Za(o,n,li,!ja),mt(o,0,!0)!==0)break t;pa=n,o.timeoutHandle=zg(cg.bind(null,o,a,qn,nc,Wf,n,li,Is,xr,ja,f,"Throttled",-0,0),u);break t}cg(o,a,qn,nc,Wf,n,li,Is,xr,ja,f,null,-0,0)}}break}while(!0);Vi(e)}function cg(e,n,a,o,u,f,x,R,V,at,pt,xt,lt,ct){if(e.timeoutHandle=-1,xt=n.subtreeFlags,xt&8192||(xt&16785408)===16785408){xt={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:$i},eg(n,f,xt);var jt=(f&62914560)===f?tc-Ct():(f&4194048)===f?sg-Ct():0;if(jt=My(xt,jt),jt!==null){pa=f,e.cancelPendingCommit=jt(_g.bind(null,e,n,f,a,o,u,x,R,V,pt,xt,null,lt,ct)),Za(e,f,x,!at);return}}_g(e,n,f,a,o,u,x,R,V)}function BS(e){for(var n=e;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var o=0;o<a.length;o++){var u=a[o],f=u.getSnapshot;u=u.value;try{if(!ii(f(),u))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function Za(e,n,a,o){n&=~jf,n&=~Is,e.suspendedLanes|=n,e.pingedLanes&=~n,o&&(e.warmLanes|=n),o=e.expirationTimes;for(var u=n;0<u;){var f=31-Pt(u),x=1<<f;o[f]=-1,u&=~x}a!==0&&De(e,a,n)}function ic(){return(Ue&6)===0?(Fo(0),!1):!0}function Kf(){if(xe!==null){if(Fe===0)var e=xe.return;else e=xe,ia=Rs=null,hf(e),fr=null,xo=0,e=xe;for(;e!==null;)H0(e.alternate,e),e=e.return;xe=null}}function yr(e,n){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,ay(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),pa=0,Kf(),qe=e,xe=a=ea(e.current,null),Me=n,Fe=0,oi=null,ja=!1,vr=Bt(e,n),Xf=!1,xr=li=jf=Is=Wa=sn=0,qn=Po=null,Wf=!1,(n&8)!==0&&(n|=n&32);var o=e.entangledLanes;if(o!==0)for(e=e.entanglements,o&=n;0<o;){var u=31-Pt(o),f=1<<u;n|=e[u],o&=~f}return da=n,bl(),a}function ug(e,n){le=null,L.H=Ro,n===ur||n===Ll?(n=Am(),Fe=3):n===$u?(n=Am(),Fe=4):Fe=n===Cf?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,oi=n,xe===null&&(sn=1,Wl(e,_i(n,e.current)))}function fg(){var e=si.current;return e===null?!0:(Me&4194048)===Me?yi===null:(Me&62914560)===Me||(Me&536870912)!==0?e===yi:!1}function hg(){var e=L.H;return L.H=Ro,e===null?Ro:e}function dg(){var e=L.A;return L.A=IS,e}function ac(){sn=4,ja||(Me&4194048)!==Me&&si.current!==null||(vr=!0),(Wa&134217727)===0&&(Is&134217727)===0||qe===null||Za(qe,Me,li,!1)}function Qf(e,n,a){var o=Ue;Ue|=2;var u=hg(),f=dg();(qe!==e||Me!==n)&&(nc=null,yr(e,n)),n=!1;var x=sn;t:do try{if(Fe!==0&&xe!==null){var R=xe,V=oi;switch(Fe){case 8:Kf(),x=6;break t;case 3:case 2:case 9:case 6:si.current===null&&(n=!0);var at=Fe;if(Fe=0,oi=null,Mr(e,R,V,at),a&&vr){x=0;break t}break;default:at=Fe,Fe=0,oi=null,Mr(e,R,V,at)}}zS(),x=sn;break}catch(pt){ug(e,pt)}while(!0);return n&&e.shellSuspendCounter++,ia=Rs=null,Ue=o,L.H=u,L.A=f,xe===null&&(qe=null,Me=0,bl()),x}function zS(){for(;xe!==null;)pg(xe)}function HS(e,n){var a=Ue;Ue|=2;var o=hg(),u=dg();qe!==e||Me!==n?(nc=null,ec=Ct()+500,yr(e,n)):vr=Bt(e,n);t:do try{if(Fe!==0&&xe!==null){n=xe;var f=oi;e:switch(Fe){case 1:Fe=0,oi=null,Mr(e,n,f,1);break;case 2:case 9:if(bm(f)){Fe=0,oi=null,mg(n);break}n=function(){Fe!==2&&Fe!==9||qe!==e||(Fe=7),Vi(e)},f.then(n,n);break t;case 3:Fe=7;break t;case 4:Fe=5;break t;case 7:bm(f)?(Fe=0,oi=null,mg(n)):(Fe=0,oi=null,Mr(e,n,f,7));break;case 5:var x=null;switch(xe.tag){case 26:x=xe.memoizedState;case 5:case 27:var R=xe;if(x?t_(x):R.stateNode.complete){Fe=0,oi=null;var V=R.sibling;if(V!==null)xe=V;else{var at=R.return;at!==null?(xe=at,sc(at)):xe=null}break e}}Fe=0,oi=null,Mr(e,n,f,5);break;case 6:Fe=0,oi=null,Mr(e,n,f,6);break;case 8:Kf(),sn=6;break t;default:throw Error(s(462))}}GS();break}catch(pt){ug(e,pt)}while(!0);return ia=Rs=null,L.H=o,L.A=u,Ue=a,xe!==null?0:(qe=null,Me=0,bl(),sn)}function GS(){for(;xe!==null&&!me();)pg(xe)}function pg(e){var n=B0(e.alternate,e,da);e.memoizedProps=e.pendingProps,n===null?sc(e):xe=n}function mg(e){var n=e,a=n.alternate;switch(n.tag){case 15:case 0:n=L0(a,n,n.pendingProps,n.type,void 0,Me);break;case 11:n=L0(a,n,n.pendingProps,n.type.render,n.ref,Me);break;case 5:hf(n);default:H0(a,n),n=xe=dm(n,da),n=B0(a,n,da)}e.memoizedProps=e.pendingProps,n===null?sc(e):xe=n}function Mr(e,n,a,o){ia=Rs=null,hf(n),fr=null,xo=0;var u=n.return;try{if(wS(e,u,n,a,Me)){sn=1,Wl(e,_i(a,e.current)),xe=null;return}}catch(f){if(u!==null)throw xe=u,f;sn=1,Wl(e,_i(a,e.current)),xe=null;return}n.flags&32768?(be||o===1?e=!0:vr||(Me&536870912)!==0?e=!1:(ja=e=!0,(o===2||o===9||o===3||o===6)&&(o=si.current,o!==null&&o.tag===13&&(o.flags|=16384))),gg(n,e)):sc(n)}function sc(e){var n=e;do{if((n.flags&32768)!==0){gg(n,ja);return}e=n.return;var a=LS(n.alternate,n,da);if(a!==null){xe=a;return}if(n=n.sibling,n!==null){xe=n;return}xe=n=e}while(n!==null);sn===0&&(sn=5)}function gg(e,n){do{var a=NS(e.alternate,e);if(a!==null){a.flags&=32767,xe=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(e=e.sibling,e!==null)){xe=e;return}xe=e=a}while(e!==null);sn=6,xe=null}function _g(e,n,a,o,u,f,x,R,V){e.cancelPendingCommit=null;do rc();while(xn!==0);if((Ue&6)!==0)throw Error(s(327));if(n!==null){if(n===e.current)throw Error(s(177));if(f=n.lanes|n.childLanes,f|=Bu,nn(e,a,f,x,R,V),e===qe&&(xe=qe=null,Me=0),Sr=n,Ya=e,pa=a,qf=f,Yf=u,rg=o,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,jS(nt,function(){return Mg(),null})):(e.callbackNode=null,e.callbackPriority=0),o=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||o){o=L.T,L.T=null,u=H.p,H.p=2,x=Ue,Ue|=4;try{OS(e,n,a)}finally{Ue=x,H.p=u,L.T=o}}xn=1,vg(),xg(),Sg()}}function vg(){if(xn===1){xn=0;var e=Ya,n=Sr,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=L.T,L.T=null;var o=H.p;H.p=2;var u=Ue;Ue|=4;try{J0(n,e);var f=ch,x=am(e.containerInfo),R=f.focusedElem,V=f.selectionRange;if(x!==R&&R&&R.ownerDocument&&im(R.ownerDocument.documentElement,R)){if(V!==null&&Nu(R)){var at=V.start,pt=V.end;if(pt===void 0&&(pt=at),"selectionStart"in R)R.selectionStart=at,R.selectionEnd=Math.min(pt,R.value.length);else{var xt=R.ownerDocument||document,lt=xt&&xt.defaultView||window;if(lt.getSelection){var ct=lt.getSelection(),jt=R.textContent.length,Jt=Math.min(V.start,jt),ke=V.end===void 0?Jt:Math.min(V.end,jt);!ct.extend&&Jt>ke&&(x=ke,ke=Jt,Jt=x);var J=nm(R,Jt),X=nm(R,ke);if(J&&X&&(ct.rangeCount!==1||ct.anchorNode!==J.node||ct.anchorOffset!==J.offset||ct.focusNode!==X.node||ct.focusOffset!==X.offset)){var it=xt.createRange();it.setStart(J.node,J.offset),ct.removeAllRanges(),Jt>ke?(ct.addRange(it),ct.extend(X.node,X.offset)):(it.setEnd(X.node,X.offset),ct.addRange(it))}}}}for(xt=[],ct=R;ct=ct.parentNode;)ct.nodeType===1&&xt.push({element:ct,left:ct.scrollLeft,top:ct.scrollTop});for(typeof R.focus=="function"&&R.focus(),R=0;R<xt.length;R++){var _t=xt[R];_t.element.scrollLeft=_t.left,_t.element.scrollTop=_t.top}}vc=!!lh,ch=lh=null}finally{Ue=u,H.p=o,L.T=a}}e.current=n,xn=2}}function xg(){if(xn===2){xn=0;var e=Ya,n=Sr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=L.T,L.T=null;var o=H.p;H.p=2;var u=Ue;Ue|=4;try{q0(e,n.alternate,n)}finally{Ue=u,H.p=o,L.T=a}}xn=3}}function Sg(){if(xn===4||xn===3){xn=0,He();var e=Ya,n=Sr,a=pa,o=rg;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?xn=5:(xn=0,Sr=Ya=null,yg(e,e.pendingLanes));var u=e.pendingLanes;if(u===0&&(qa=null),to(a),n=n.stateNode,dt&&typeof dt.onCommitFiberRoot=="function")try{dt.onCommitFiberRoot(ft,n,void 0,(n.current.flags&128)===128)}catch{}if(o!==null){n=L.T,u=H.p,H.p=2,L.T=null;try{for(var f=e.onRecoverableError,x=0;x<o.length;x++){var R=o[x];f(R.value,{componentStack:R.stack})}}finally{L.T=n,H.p=u}}(pa&3)!==0&&rc(),Vi(e),u=e.pendingLanes,(a&261930)!==0&&(u&42)!==0?e===Zf?Io++:(Io=0,Zf=e):Io=0,Fo(0)}}function yg(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,_o(n)))}function rc(){return vg(),xg(),Sg(),Mg()}function Mg(){if(xn!==5)return!1;var e=Ya,n=qf;qf=0;var a=to(pa),o=L.T,u=H.p;try{H.p=32>a?32:a,L.T=null,a=Yf,Yf=null;var f=Ya,x=pa;if(xn=0,Sr=Ya=null,pa=0,(Ue&6)!==0)throw Error(s(331));var R=Ue;if(Ue|=4,ig(f.current),tg(f,f.current,x,a),Ue=R,Fo(0,!1),dt&&typeof dt.onPostCommitFiberRoot=="function")try{dt.onPostCommitFiberRoot(ft,f)}catch{}return!0}finally{H.p=u,L.T=o,yg(e,n)}}function Eg(e,n,a){n=_i(a,n),n=Rf(e.stateNode,n,2),e=Ga(e,n,2),e!==null&&(ee(e,2),Vi(e))}function Be(e,n,a){if(e.tag===3)Eg(e,e,a);else for(;n!==null;){if(n.tag===3){Eg(n,e,a);break}else if(n.tag===1){var o=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(qa===null||!qa.has(o))){e=_i(a,e),a=b0(2),o=Ga(n,a,2),o!==null&&(T0(a,o,n,e),ee(o,2),Vi(o));break}}n=n.return}}function Jf(e,n,a){var o=e.pingCache;if(o===null){o=e.pingCache=new FS;var u=new Set;o.set(n,u)}else u=o.get(n),u===void 0&&(u=new Set,o.set(n,u));u.has(a)||(Xf=!0,u.add(a),e=VS.bind(null,e,n,a),n.then(e,e))}function VS(e,n,a){var o=e.pingCache;o!==null&&o.delete(n),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,qe===e&&(Me&a)===a&&(sn===4||sn===3&&(Me&62914560)===Me&&300>Ct()-tc?(Ue&2)===0&&yr(e,0):jf|=a,xr===Me&&(xr=0)),Vi(e)}function bg(e,n){n===0&&(n=Et()),e=bs(e,n),e!==null&&(ee(e,n),Vi(e))}function kS(e){var n=e.memoizedState,a=0;n!==null&&(a=n.retryLane),bg(e,a)}function XS(e,n){var a=0;switch(e.tag){case 31:case 13:var o=e.stateNode,u=e.memoizedState;u!==null&&(a=u.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(s(314))}o!==null&&o.delete(n),bg(e,a)}function jS(e,n){return W(e,n)}var oc=null,Er=null,$f=!1,lc=!1,th=!1,Ka=0;function Vi(e){e!==Er&&e.next===null&&(Er===null?oc=Er=e:Er=Er.next=e),lc=!0,$f||($f=!0,qS())}function Fo(e,n){if(!th&&lc){th=!0;do for(var a=!1,o=oc;o!==null;){if(e!==0){var u=o.pendingLanes;if(u===0)var f=0;else{var x=o.suspendedLanes,R=o.pingedLanes;f=(1<<31-Pt(42|e)+1)-1,f&=u&~(x&~R),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,Cg(o,f))}else f=Me,f=mt(o,o===qe?f:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(f&3)===0||Bt(o,f)||(a=!0,Cg(o,f));o=o.next}while(a);th=!1}}function WS(){Tg()}function Tg(){lc=$f=!1;var e=0;Ka!==0&&iy()&&(e=Ka);for(var n=Ct(),a=null,o=oc;o!==null;){var u=o.next,f=Ag(o,n);f===0?(o.next=null,a===null?oc=u:a.next=u,u===null&&(Er=a)):(a=o,(e!==0||(f&3)!==0)&&(lc=!0)),o=u}xn!==0&&xn!==5||Fo(e),Ka!==0&&(Ka=0)}function Ag(e,n){for(var a=e.suspendedLanes,o=e.pingedLanes,u=e.expirationTimes,f=e.pendingLanes&-62914561;0<f;){var x=31-Pt(f),R=1<<x,V=u[x];V===-1?((R&a)===0||(R&o)!==0)&&(u[x]=Lt(R,n)):V<=n&&(e.expiredLanes|=R),f&=~R}if(n=qe,a=Me,a=mt(e,e===n?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,a===0||e===n&&(Fe===2||Fe===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&en(o),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||Bt(e,a)){if(n=a&-a,n===e.callbackPriority)return n;switch(o!==null&&en(o),to(a)){case 2:case 8:a=E;break;case 32:a=nt;break;case 268435456:a=Tt;break;default:a=nt}return o=Rg.bind(null,e),a=W(a,o),e.callbackPriority=n,e.callbackNode=a,n}return o!==null&&o!==null&&en(o),e.callbackPriority=2,e.callbackNode=null,2}function Rg(e,n){if(xn!==0&&xn!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(rc()&&e.callbackNode!==a)return null;var o=Me;return o=mt(e,e===qe?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(lg(e,o,n),Ag(e,Ct()),e.callbackNode!=null&&e.callbackNode===a?Rg.bind(null,e):null)}function Cg(e,n){if(rc())return null;lg(e,n,!0)}function qS(){sy(function(){(Ue&6)!==0?W(D,WS):Tg()})}function eh(){if(Ka===0){var e=lr;e===0&&(e=ie,ie<<=1,(ie&261888)===0&&(ie=256)),Ka=e}return Ka}function wg(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Ss(""+e)}function Dg(e,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,e.id&&a.setAttribute("form",e.id),n.parentNode.insertBefore(a,n),e=new FormData(e),a.parentNode.removeChild(a),e}function YS(e,n,a,o,u){if(n==="submit"&&a&&a.stateNode===u){var f=wg((u[Rn]||null).action),x=o.submitter;x&&(n=(n=x[Rn]||null)?wg(n.formAction):x.getAttribute("formAction"),n!==null&&(f=n,x=null));var R=new Sl("action","action",null,o,u);e.push({event:R,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(Ka!==0){var V=x?Dg(u,x):new FormData(u);yf(a,{pending:!0,data:V,method:u.method,action:f},null,V)}}else typeof f=="function"&&(R.preventDefault(),V=x?Dg(u,x):new FormData(u),yf(a,{pending:!0,data:V,method:u.method,action:f},f,V))},currentTarget:u}]})}}for(var nh=0;nh<Fu.length;nh++){var ih=Fu[nh],ZS=ih.toLowerCase(),KS=ih[0].toUpperCase()+ih.slice(1);wi(ZS,"on"+KS)}wi(om,"onAnimationEnd"),wi(lm,"onAnimationIteration"),wi(cm,"onAnimationStart"),wi("dblclick","onDoubleClick"),wi("focusin","onFocus"),wi("focusout","onBlur"),wi(hS,"onTransitionRun"),wi(dS,"onTransitionStart"),wi(pS,"onTransitionCancel"),wi(um,"onTransitionEnd"),ot("onMouseEnter",["mouseout","mouseover"]),ot("onMouseLeave",["mouseout","mouseover"]),ot("onPointerEnter",["pointerout","pointerover"]),ot("onPointerLeave",["pointerout","pointerover"]),Y("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Y("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Y("onBeforeInput",["compositionend","keypress","textInput","paste"]),Y("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Y("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Y("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Bo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),QS=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Bo));function Ug(e,n){n=(n&4)!==0;for(var a=0;a<e.length;a++){var o=e[a],u=o.event;o=o.listeners;t:{var f=void 0;if(n)for(var x=o.length-1;0<=x;x--){var R=o[x],V=R.instance,at=R.currentTarget;if(R=R.listener,V!==f&&u.isPropagationStopped())break t;f=R,u.currentTarget=at;try{f(u)}catch(pt){El(pt)}u.currentTarget=null,f=V}else for(x=0;x<o.length;x++){if(R=o[x],V=R.instance,at=R.currentTarget,R=R.listener,V!==f&&u.isPropagationStopped())break t;f=R,u.currentTarget=at;try{f(u)}catch(pt){El(pt)}u.currentTarget=null,f=V}}}}function Se(e,n){var a=n[Ca];a===void 0&&(a=n[Ca]=new Set);var o=e+"__bubble";a.has(o)||(Lg(n,e,2,!1),a.add(o))}function ah(e,n,a){var o=0;n&&(o|=4),Lg(a,e,o,n)}var cc="_reactListening"+Math.random().toString(36).slice(2);function sh(e){if(!e[cc]){e[cc]=!0,gl.forEach(function(a){a!=="selectionchange"&&(QS.has(a)||ah(a,!1,e),ah(a,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[cc]||(n[cc]=!0,ah("selectionchange",!1,n))}}function Lg(e,n,a,o){switch(o_(n)){case 2:var u=Ty;break;case 8:u=Ay;break;default:u=Sh}a=u.bind(null,n,a,e),u=void 0,!bu||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(u=!0),o?u!==void 0?e.addEventListener(n,a,{capture:!0,passive:u}):e.addEventListener(n,a,!0):u!==void 0?e.addEventListener(n,a,{passive:u}):e.addEventListener(n,a,!1)}function rh(e,n,a,o,u){var f=o;if((n&1)===0&&(n&2)===0&&o!==null)t:for(;;){if(o===null)return;var x=o.tag;if(x===3||x===4){var R=o.stateNode.containerInfo;if(R===u)break;if(x===4)for(x=o.return;x!==null;){var V=x.tag;if((V===3||V===4)&&x.stateNode.containerInfo===u)return;x=x.return}for(;R!==null;){if(x=Da(R),x===null)return;if(V=x.tag,V===5||V===6||V===26||V===27){o=f=x;continue t}R=R.parentNode}}o=o.return}Fp(function(){var at=f,pt=Mu(a),xt=[];t:{var lt=fm.get(e);if(lt!==void 0){var ct=Sl,jt=e;switch(e){case"keypress":if(vl(a)===0)break t;case"keydown":case"keyup":ct=Xx;break;case"focusin":jt="focus",ct=Cu;break;case"focusout":jt="blur",ct=Cu;break;case"beforeblur":case"afterblur":ct=Cu;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ct=Hp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ct=Lx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ct=qx;break;case om:case lm:case cm:ct=Px;break;case um:ct=Zx;break;case"scroll":case"scrollend":ct=Dx;break;case"wheel":ct=Qx;break;case"copy":case"cut":case"paste":ct=Fx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ct=Vp;break;case"toggle":case"beforetoggle":ct=$x}var Jt=(n&4)!==0,ke=!Jt&&(e==="scroll"||e==="scrollend"),J=Jt?lt!==null?lt+"Capture":null:lt;Jt=[];for(var X=at,it;X!==null;){var _t=X;if(it=_t.stateNode,_t=_t.tag,_t!==5&&_t!==26&&_t!==27||it===null||J===null||(_t=so(X,J),_t!=null&&Jt.push(zo(X,_t,it))),ke)break;X=X.return}0<Jt.length&&(lt=new ct(lt,jt,null,a,pt),xt.push({event:lt,listeners:Jt}))}}if((n&7)===0){t:{if(lt=e==="mouseover"||e==="pointerover",ct=e==="mouseout"||e==="pointerout",lt&&a!==yu&&(jt=a.relatedTarget||a.fromElement)&&(Da(jt)||jt[Ji]))break t;if((ct||lt)&&(lt=pt.window===pt?pt:(lt=pt.ownerDocument)?lt.defaultView||lt.parentWindow:window,ct?(jt=a.relatedTarget||a.toElement,ct=at,jt=jt?Da(jt):null,jt!==null&&(ke=c(jt),Jt=jt.tag,jt!==ke||Jt!==5&&Jt!==27&&Jt!==6)&&(jt=null)):(ct=null,jt=at),ct!==jt)){if(Jt=Hp,_t="onMouseLeave",J="onMouseEnter",X="mouse",(e==="pointerout"||e==="pointerover")&&(Jt=Vp,_t="onPointerLeave",J="onPointerEnter",X="pointer"),ke=ct==null?lt:xs(ct),it=jt==null?lt:xs(jt),lt=new Jt(_t,X+"leave",ct,a,pt),lt.target=ke,lt.relatedTarget=it,_t=null,Da(pt)===at&&(Jt=new Jt(J,X+"enter",jt,a,pt),Jt.target=it,Jt.relatedTarget=ke,_t=Jt),ke=_t,ct&&jt)e:{for(Jt=JS,J=ct,X=jt,it=0,_t=J;_t;_t=Jt(_t))it++;_t=0;for(var Kt=X;Kt;Kt=Jt(Kt))_t++;for(;0<it-_t;)J=Jt(J),it--;for(;0<_t-it;)X=Jt(X),_t--;for(;it--;){if(J===X||X!==null&&J===X.alternate){Jt=J;break e}J=Jt(J),X=Jt(X)}Jt=null}else Jt=null;ct!==null&&Ng(xt,lt,ct,Jt,!1),jt!==null&&ke!==null&&Ng(xt,ke,jt,Jt,!0)}}t:{if(lt=at?xs(at):window,ct=lt.nodeName&&lt.nodeName.toLowerCase(),ct==="select"||ct==="input"&&lt.type==="file")var Ce=Kp;else if(Yp(lt))if(Qp)Ce=cS;else{Ce=oS;var qt=rS}else ct=lt.nodeName,!ct||ct.toLowerCase()!=="input"||lt.type!=="checkbox"&&lt.type!=="radio"?at&&Le(at.elementType)&&(Ce=Kp):Ce=lS;if(Ce&&(Ce=Ce(e,at))){Zp(xt,Ce,a,pt);break t}qt&&qt(e,lt,at),e==="focusout"&&at&&lt.type==="number"&&at.memoizedProps.value!=null&&ve(lt,"number",lt.value)}switch(qt=at?xs(at):window,e){case"focusin":(Yp(qt)||qt.contentEditable==="true")&&(tr=qt,Ou=at,po=null);break;case"focusout":po=Ou=tr=null;break;case"mousedown":Pu=!0;break;case"contextmenu":case"mouseup":case"dragend":Pu=!1,sm(xt,a,pt);break;case"selectionchange":if(fS)break;case"keydown":case"keyup":sm(xt,a,pt)}var ue;if(Du)t:{switch(e){case"compositionstart":var Ee="onCompositionStart";break t;case"compositionend":Ee="onCompositionEnd";break t;case"compositionupdate":Ee="onCompositionUpdate";break t}Ee=void 0}else $s?Wp(e,a)&&(Ee="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(Ee="onCompositionStart");Ee&&(kp&&a.locale!=="ko"&&($s||Ee!=="onCompositionStart"?Ee==="onCompositionEnd"&&$s&&(ue=Bp()):(Oa=pt,Tu="value"in Oa?Oa.value:Oa.textContent,$s=!0)),qt=uc(at,Ee),0<qt.length&&(Ee=new Gp(Ee,e,null,a,pt),xt.push({event:Ee,listeners:qt}),ue?Ee.data=ue:(ue=qp(a),ue!==null&&(Ee.data=ue)))),(ue=eS?nS(e,a):iS(e,a))&&(Ee=uc(at,"onBeforeInput"),0<Ee.length&&(qt=new Gp("onBeforeInput","beforeinput",null,a,pt),xt.push({event:qt,listeners:Ee}),qt.data=ue)),YS(xt,e,at,a,pt)}Ug(xt,n)})}function zo(e,n,a){return{instance:e,listener:n,currentTarget:a}}function uc(e,n){for(var a=n+"Capture",o=[];e!==null;){var u=e,f=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||f===null||(u=so(e,a),u!=null&&o.unshift(zo(e,u,f)),u=so(e,n),u!=null&&o.push(zo(e,u,f))),e.tag===3)return o;e=e.return}return[]}function JS(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Ng(e,n,a,o,u){for(var f=n._reactName,x=[];a!==null&&a!==o;){var R=a,V=R.alternate,at=R.stateNode;if(R=R.tag,V!==null&&V===o)break;R!==5&&R!==26&&R!==27||at===null||(V=at,u?(at=so(a,f),at!=null&&x.unshift(zo(a,at,V))):u||(at=so(a,f),at!=null&&x.push(zo(a,at,V)))),a=a.return}x.length!==0&&e.push({event:n,listeners:x})}var $S=/\r\n?/g,ty=/\u0000|\uFFFD/g;function Og(e){return(typeof e=="string"?e:""+e).replace($S,`
`).replace(ty,"")}function Pg(e,n){return n=Og(n),Og(e)===n}function Ve(e,n,a,o,u,f){switch(a){case"children":typeof o=="string"?n==="body"||n==="textarea"&&o===""||ni(e,o):(typeof o=="number"||typeof o=="bigint")&&n!=="body"&&ni(e,""+o);break;case"className":Xt(e,"class",o);break;case"tabIndex":Xt(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":Xt(e,a,o);break;case"style":Ci(e,o,f);break;case"data":if(n!=="object"){Xt(e,"data",o);break}case"src":case"href":if(o===""&&(n!=="a"||a!=="href")){e.removeAttribute(a);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=Ss(""+o),e.setAttribute(a,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&Ve(e,n,"name",u.name,u,null),Ve(e,n,"formEncType",u.formEncType,u,null),Ve(e,n,"formMethod",u.formMethod,u,null),Ve(e,n,"formTarget",u.formTarget,u,null)):(Ve(e,n,"encType",u.encType,u,null),Ve(e,n,"method",u.method,u,null),Ve(e,n,"target",u.target,u,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=Ss(""+o),e.setAttribute(a,o);break;case"onClick":o!=null&&(e.onclick=$i);break;case"onScroll":o!=null&&Se("scroll",e);break;case"onScrollEnd":o!=null&&Se("scrollend",e);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}a=Ss(""+o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""+o):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":o===!0?e.setAttribute(a,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,o):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(a,o):e.removeAttribute(a);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(a):e.setAttribute(a,o);break;case"popover":Se("beforetoggle",e),Se("toggle",e),It(e,"popover",o);break;case"xlinkActuate":kt(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":kt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":kt(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":kt(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":kt(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":kt(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":kt(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":kt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":kt(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":It(e,"is",o);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=Bi.get(a)||a,It(e,a,o))}}function oh(e,n,a,o,u,f){switch(a){case"style":Ci(e,o,f);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"children":typeof o=="string"?ni(e,o):(typeof o=="number"||typeof o=="bigint")&&ni(e,""+o);break;case"onScroll":o!=null&&Se("scroll",e);break;case"onScrollEnd":o!=null&&Se("scrollend",e);break;case"onClick":o!=null&&(e.onclick=$i);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!A.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(u=a.endsWith("Capture"),n=a.slice(2,u?a.length-7:void 0),f=e[Rn]||null,f=f!=null?f[a]:null,typeof f=="function"&&e.removeEventListener(n,f,u),typeof o=="function")){typeof f!="function"&&f!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(n,o,u);break t}a in e?e[a]=o:o===!0?e.setAttribute(a,""):It(e,a,o)}}}function Un(e,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Se("error",e),Se("load",e);var o=!1,u=!1,f;for(f in a)if(a.hasOwnProperty(f)){var x=a[f];if(x!=null)switch(f){case"src":o=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:Ve(e,n,f,x,a,null)}}u&&Ve(e,n,"srcSet",a.srcSet,a,null),o&&Ve(e,n,"src",a.src,a,null);return;case"input":Se("invalid",e);var R=f=x=u=null,V=null,at=null;for(o in a)if(a.hasOwnProperty(o)){var pt=a[o];if(pt!=null)switch(o){case"name":u=pt;break;case"type":x=pt;break;case"checked":V=pt;break;case"defaultChecked":at=pt;break;case"value":f=pt;break;case"defaultValue":R=pt;break;case"children":case"dangerouslySetInnerHTML":if(pt!=null)throw Error(s(137,n));break;default:Ve(e,n,o,pt,a,null)}}On(e,f,R,V,at,x,u,!1);return;case"select":Se("invalid",e),o=x=f=null;for(u in a)if(a.hasOwnProperty(u)&&(R=a[u],R!=null))switch(u){case"value":f=R;break;case"defaultValue":x=R;break;case"multiple":o=R;default:Ve(e,n,u,R,a,null)}n=f,a=x,e.multiple=!!o,n!=null?vn(e,!!o,n,!1):a!=null&&vn(e,!!o,a,!0);return;case"textarea":Se("invalid",e),f=u=o=null;for(x in a)if(a.hasOwnProperty(x)&&(R=a[x],R!=null))switch(x){case"value":o=R;break;case"defaultValue":u=R;break;case"children":f=R;break;case"dangerouslySetInnerHTML":if(R!=null)throw Error(s(91));break;default:Ve(e,n,x,R,a,null)}Ri(e,o,u,f);return;case"option":for(V in a)a.hasOwnProperty(V)&&(o=a[V],o!=null)&&(V==="selected"?e.selected=o&&typeof o!="function"&&typeof o!="symbol":Ve(e,n,V,o,a,null));return;case"dialog":Se("beforetoggle",e),Se("toggle",e),Se("cancel",e),Se("close",e);break;case"iframe":case"object":Se("load",e);break;case"video":case"audio":for(o=0;o<Bo.length;o++)Se(Bo[o],e);break;case"image":Se("error",e),Se("load",e);break;case"details":Se("toggle",e);break;case"embed":case"source":case"link":Se("error",e),Se("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(at in a)if(a.hasOwnProperty(at)&&(o=a[at],o!=null))switch(at){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:Ve(e,n,at,o,a,null)}return;default:if(Le(n)){for(pt in a)a.hasOwnProperty(pt)&&(o=a[pt],o!==void 0&&oh(e,n,pt,o,a,void 0));return}}for(R in a)a.hasOwnProperty(R)&&(o=a[R],o!=null&&Ve(e,n,R,o,a,null))}function ey(e,n,a,o){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,f=null,x=null,R=null,V=null,at=null,pt=null;for(ct in a){var xt=a[ct];if(a.hasOwnProperty(ct)&&xt!=null)switch(ct){case"checked":break;case"value":break;case"defaultValue":V=xt;default:o.hasOwnProperty(ct)||Ve(e,n,ct,null,o,xt)}}for(var lt in o){var ct=o[lt];if(xt=a[lt],o.hasOwnProperty(lt)&&(ct!=null||xt!=null))switch(lt){case"type":f=ct;break;case"name":u=ct;break;case"checked":at=ct;break;case"defaultChecked":pt=ct;break;case"value":x=ct;break;case"defaultValue":R=ct;break;case"children":case"dangerouslySetInnerHTML":if(ct!=null)throw Error(s(137,n));break;default:ct!==xt&&Ve(e,n,lt,ct,o,xt)}}Gt(e,x,R,V,at,pt,f,u);return;case"select":ct=x=R=lt=null;for(f in a)if(V=a[f],a.hasOwnProperty(f)&&V!=null)switch(f){case"value":break;case"multiple":ct=V;default:o.hasOwnProperty(f)||Ve(e,n,f,null,o,V)}for(u in o)if(f=o[u],V=a[u],o.hasOwnProperty(u)&&(f!=null||V!=null))switch(u){case"value":lt=f;break;case"defaultValue":R=f;break;case"multiple":x=f;default:f!==V&&Ve(e,n,u,f,o,V)}n=R,a=x,o=ct,lt!=null?vn(e,!!a,lt,!1):!!o!=!!a&&(n!=null?vn(e,!!a,n,!0):vn(e,!!a,a?[]:"",!1));return;case"textarea":ct=lt=null;for(R in a)if(u=a[R],a.hasOwnProperty(R)&&u!=null&&!o.hasOwnProperty(R))switch(R){case"value":break;case"children":break;default:Ve(e,n,R,null,o,u)}for(x in o)if(u=o[x],f=a[x],o.hasOwnProperty(x)&&(u!=null||f!=null))switch(x){case"value":lt=u;break;case"defaultValue":ct=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(s(91));break;default:u!==f&&Ve(e,n,x,u,o,f)}ei(e,lt,ct);return;case"option":for(var jt in a)lt=a[jt],a.hasOwnProperty(jt)&&lt!=null&&!o.hasOwnProperty(jt)&&(jt==="selected"?e.selected=!1:Ve(e,n,jt,null,o,lt));for(V in o)lt=o[V],ct=a[V],o.hasOwnProperty(V)&&lt!==ct&&(lt!=null||ct!=null)&&(V==="selected"?e.selected=lt&&typeof lt!="function"&&typeof lt!="symbol":Ve(e,n,V,lt,o,ct));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var Jt in a)lt=a[Jt],a.hasOwnProperty(Jt)&&lt!=null&&!o.hasOwnProperty(Jt)&&Ve(e,n,Jt,null,o,lt);for(at in o)if(lt=o[at],ct=a[at],o.hasOwnProperty(at)&&lt!==ct&&(lt!=null||ct!=null))switch(at){case"children":case"dangerouslySetInnerHTML":if(lt!=null)throw Error(s(137,n));break;default:Ve(e,n,at,lt,o,ct)}return;default:if(Le(n)){for(var ke in a)lt=a[ke],a.hasOwnProperty(ke)&&lt!==void 0&&!o.hasOwnProperty(ke)&&oh(e,n,ke,void 0,o,lt);for(pt in o)lt=o[pt],ct=a[pt],!o.hasOwnProperty(pt)||lt===ct||lt===void 0&&ct===void 0||oh(e,n,pt,lt,o,ct);return}}for(var J in a)lt=a[J],a.hasOwnProperty(J)&&lt!=null&&!o.hasOwnProperty(J)&&Ve(e,n,J,null,o,lt);for(xt in o)lt=o[xt],ct=a[xt],!o.hasOwnProperty(xt)||lt===ct||lt==null&&ct==null||Ve(e,n,xt,lt,o,ct)}function Ig(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function ny(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,a=performance.getEntriesByType("resource"),o=0;o<a.length;o++){var u=a[o],f=u.transferSize,x=u.initiatorType,R=u.duration;if(f&&R&&Ig(x)){for(x=0,R=u.responseEnd,o+=1;o<a.length;o++){var V=a[o],at=V.startTime;if(at>R)break;var pt=V.transferSize,xt=V.initiatorType;pt&&Ig(xt)&&(V=V.responseEnd,x+=pt*(V<R?1:(R-at)/(V-at)))}if(--o,n+=8*(f+x)/(u.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var lh=null,ch=null;function fc(e){return e.nodeType===9?e:e.ownerDocument}function Fg(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Bg(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function uh(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var fh=null;function iy(){var e=window.event;return e&&e.type==="popstate"?e===fh?!1:(fh=e,!0):(fh=null,!1)}var zg=typeof setTimeout=="function"?setTimeout:void 0,ay=typeof clearTimeout=="function"?clearTimeout:void 0,Hg=typeof Promise=="function"?Promise:void 0,sy=typeof queueMicrotask=="function"?queueMicrotask:typeof Hg<"u"?function(e){return Hg.resolve(null).then(e).catch(ry)}:zg;function ry(e){setTimeout(function(){throw e})}function Qa(e){return e==="head"}function Gg(e,n){var a=n,o=0;do{var u=a.nextSibling;if(e.removeChild(a),u&&u.nodeType===8)if(a=u.data,a==="/$"||a==="/&"){if(o===0){e.removeChild(u),Rr(n);return}o--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")o++;else if(a==="html")Ho(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Ho(a);for(var f=a.firstChild;f;){var x=f.nextSibling,R=f.nodeName;f[wa]||R==="SCRIPT"||R==="STYLE"||R==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=x}}else a==="body"&&Ho(e.ownerDocument.body);a=u}while(a);Rr(n)}function Vg(e,n){var a=e;e=0;do{var o=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),o&&o.nodeType===8)if(a=o.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=o}while(a)}function hh(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":hh(a),ao(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function oy(e,n,a,o){for(;e.nodeType===1;){var u=a;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[wa])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(f=e.getAttribute("rel"),f==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(f!==u.rel||e.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||e.getAttribute("title")!==(u.title==null?null:u.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(f=e.getAttribute("src"),(f!==(u.src==null?null:u.src)||e.getAttribute("type")!==(u.type==null?null:u.type)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&f&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var f=u.name==null?null:""+u.name;if(u.type==="hidden"&&e.getAttribute("name")===f)return e}else return e;if(e=Mi(e.nextSibling),e===null)break}return null}function ly(e,n,a){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=Mi(e.nextSibling),e===null))return null;return e}function kg(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Mi(e.nextSibling),e===null))return null;return e}function dh(e){return e.data==="$?"||e.data==="$~"}function ph(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function cy(e,n){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||a.readyState!=="loading")n();else{var o=function(){n(),a.removeEventListener("DOMContentLoaded",o)};a.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function Mi(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var mh=null;function Xg(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(n===0)return Mi(e.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}e=e.nextSibling}return null}function jg(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return e;n--}else a!=="/$"&&a!=="/&"||n++}e=e.previousSibling}return null}function Wg(e,n,a){switch(n=fc(a),e){case"html":if(e=n.documentElement,!e)throw Error(s(452));return e;case"head":if(e=n.head,!e)throw Error(s(453));return e;case"body":if(e=n.body,!e)throw Error(s(454));return e;default:throw Error(s(451))}}function Ho(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);ao(e)}var Ei=new Map,qg=new Set;function hc(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var ma=H.d;H.d={f:uy,r:fy,D:hy,C:dy,L:py,m:my,X:_y,S:gy,M:vy};function uy(){var e=ma.f(),n=ic();return e||n}function fy(e){var n=Ua(e);n!==null&&n.tag===5&&n.type==="form"?u0(n):ma.r(e)}var br=typeof document>"u"?null:document;function Yg(e,n,a){var o=br;if(o&&typeof n=="string"&&n){var u=Pe(n);u='link[rel="'+e+'"][href="'+u+'"]',typeof a=="string"&&(u+='[crossorigin="'+a+'"]'),qg.has(u)||(qg.add(u),e={rel:e,crossOrigin:a,href:n},o.querySelector(u)===null&&(n=o.createElement("link"),Un(n,"link",e),hn(n),o.head.appendChild(n)))}}function hy(e){ma.D(e),Yg("dns-prefetch",e,null)}function dy(e,n){ma.C(e,n),Yg("preconnect",e,n)}function py(e,n,a){ma.L(e,n,a);var o=br;if(o&&e&&n){var u='link[rel="preload"][as="'+Pe(n)+'"]';n==="image"&&a&&a.imageSrcSet?(u+='[imagesrcset="'+Pe(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(u+='[imagesizes="'+Pe(a.imageSizes)+'"]')):u+='[href="'+Pe(e)+'"]';var f=u;switch(n){case"style":f=Tr(e);break;case"script":f=Ar(e)}Ei.has(f)||(e=v({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:e,as:n},a),Ei.set(f,e),o.querySelector(u)!==null||n==="style"&&o.querySelector(Go(f))||n==="script"&&o.querySelector(Vo(f))||(n=o.createElement("link"),Un(n,"link",e),hn(n),o.head.appendChild(n)))}}function my(e,n){ma.m(e,n);var a=br;if(a&&e){var o=n&&typeof n.as=="string"?n.as:"script",u='link[rel="modulepreload"][as="'+Pe(o)+'"][href="'+Pe(e)+'"]',f=u;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=Ar(e)}if(!Ei.has(f)&&(e=v({rel:"modulepreload",href:e},n),Ei.set(f,e),a.querySelector(u)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Vo(f)))return}o=a.createElement("link"),Un(o,"link",e),hn(o),a.head.appendChild(o)}}}function gy(e,n,a){ma.S(e,n,a);var o=br;if(o&&e){var u=La(o).hoistableStyles,f=Tr(e);n=n||"default";var x=u.get(f);if(!x){var R={loading:0,preload:null};if(x=o.querySelector(Go(f)))R.loading=5;else{e=v({rel:"stylesheet",href:e,"data-precedence":n},a),(a=Ei.get(f))&&gh(e,a);var V=x=o.createElement("link");hn(V),Un(V,"link",e),V._p=new Promise(function(at,pt){V.onload=at,V.onerror=pt}),V.addEventListener("load",function(){R.loading|=1}),V.addEventListener("error",function(){R.loading|=2}),R.loading|=4,dc(x,n,o)}x={type:"stylesheet",instance:x,count:1,state:R},u.set(f,x)}}}function _y(e,n){ma.X(e,n);var a=br;if(a&&e){var o=La(a).hoistableScripts,u=Ar(e),f=o.get(u);f||(f=a.querySelector(Vo(u)),f||(e=v({src:e,async:!0},n),(n=Ei.get(u))&&_h(e,n),f=a.createElement("script"),hn(f),Un(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(u,f))}}function vy(e,n){ma.M(e,n);var a=br;if(a&&e){var o=La(a).hoistableScripts,u=Ar(e),f=o.get(u);f||(f=a.querySelector(Vo(u)),f||(e=v({src:e,async:!0,type:"module"},n),(n=Ei.get(u))&&_h(e,n),f=a.createElement("script"),hn(f),Un(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(u,f))}}function Zg(e,n,a,o){var u=(u=Z.current)?hc(u):null;if(!u)throw Error(s(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=Tr(a.href),a=La(u).hoistableStyles,o=a.get(n),o||(o={type:"style",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=Tr(a.href);var f=La(u).hoistableStyles,x=f.get(e);if(x||(u=u.ownerDocument||u,x={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(e,x),(f=u.querySelector(Go(e)))&&!f._p&&(x.instance=f,x.state.loading=5),Ei.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ei.set(e,a),f||xy(u,e,a,x.state))),n&&o===null)throw Error(s(528,""));return x}if(n&&o!==null)throw Error(s(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=Ar(a),a=La(u).hoistableScripts,o=a.get(n),o||(o={type:"script",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,e))}}function Tr(e){return'href="'+Pe(e)+'"'}function Go(e){return'link[rel="stylesheet"]['+e+"]"}function Kg(e){return v({},e,{"data-precedence":e.precedence,precedence:null})}function xy(e,n,a,o){e.querySelector('link[rel="preload"][as="style"]['+n+"]")?o.loading=1:(n=e.createElement("link"),o.preload=n,n.addEventListener("load",function(){return o.loading|=1}),n.addEventListener("error",function(){return o.loading|=2}),Un(n,"link",a),hn(n),e.head.appendChild(n))}function Ar(e){return'[src="'+Pe(e)+'"]'}function Vo(e){return"script[async]"+e}function Qg(e,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var o=e.querySelector('style[data-href~="'+Pe(a.href)+'"]');if(o)return n.instance=o,hn(o),o;var u=v({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),hn(o),Un(o,"style",u),dc(o,a.precedence,e),n.instance=o;case"stylesheet":u=Tr(a.href);var f=e.querySelector(Go(u));if(f)return n.state.loading|=4,n.instance=f,hn(f),f;o=Kg(a),(u=Ei.get(u))&&gh(o,u),f=(e.ownerDocument||e).createElement("link"),hn(f);var x=f;return x._p=new Promise(function(R,V){x.onload=R,x.onerror=V}),Un(f,"link",o),n.state.loading|=4,dc(f,a.precedence,e),n.instance=f;case"script":return f=Ar(a.src),(u=e.querySelector(Vo(f)))?(n.instance=u,hn(u),u):(o=a,(u=Ei.get(f))&&(o=v({},a),_h(o,u)),e=e.ownerDocument||e,u=e.createElement("script"),hn(u),Un(u,"link",o),e.head.appendChild(u),n.instance=u);case"void":return null;default:throw Error(s(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(o=n.instance,n.state.loading|=4,dc(o,a.precedence,e));return n.instance}function dc(e,n,a){for(var o=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=o.length?o[o.length-1]:null,f=u,x=0;x<o.length;x++){var R=o[x];if(R.dataset.precedence===n)f=R;else if(f!==u)break}f?f.parentNode.insertBefore(e,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(e,n.firstChild))}function gh(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function _h(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var pc=null;function Jg(e,n,a){if(pc===null){var o=new Map,u=pc=new Map;u.set(a,o)}else u=pc,o=u.get(a),o||(o=new Map,u.set(a,o));if(o.has(e))return o;for(o.set(e,null),a=a.getElementsByTagName(e),u=0;u<a.length;u++){var f=a[u];if(!(f[wa]||f[cn]||e==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var x=f.getAttribute(n)||"";x=e+x;var R=o.get(x);R?R.push(f):o.set(x,[f])}}return o}function $g(e,n,a){e=e.ownerDocument||e,e.head.insertBefore(a,n==="title"?e.querySelector("head > title"):null)}function Sy(e,n,a){if(a===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;return n.rel==="stylesheet"?(e=n.disabled,typeof n.precedence=="string"&&e==null):!0;case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function t_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function yy(e,n,a,o){if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var u=Tr(o.href),f=n.querySelector(Go(u));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=mc.bind(e),n.then(e,e)),a.state.loading|=4,a.instance=f,hn(f);return}f=n.ownerDocument||n,o=Kg(o),(u=Ei.get(u))&&gh(o,u),f=f.createElement("link"),hn(f);var x=f;x._p=new Promise(function(R,V){x.onload=R,x.onerror=V}),Un(f,"link",o),a.instance=f}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=mc.bind(e),n.addEventListener("load",a),n.addEventListener("error",a))}}var vh=0;function My(e,n){return e.stylesheets&&e.count===0&&_c(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var o=setTimeout(function(){if(e.stylesheets&&_c(e,e.stylesheets),e.unsuspend){var f=e.unsuspend;e.unsuspend=null,f()}},6e4+n);0<e.imgBytes&&vh===0&&(vh=62500*ny());var u=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&_c(e,e.stylesheets),e.unsuspend)){var f=e.unsuspend;e.unsuspend=null,f()}},(e.imgBytes>vh?50:800)+n);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(u)}}:null}function mc(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)_c(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var gc=null;function _c(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,gc=new Map,n.forEach(Ey,e),gc=null,mc.call(e))}function Ey(e,n){if(!(n.state.loading&4)){var a=gc.get(e);if(a)var o=a.get(null);else{a=new Map,gc.set(e,a);for(var u=e.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<u.length;f++){var x=u[f];(x.nodeName==="LINK"||x.getAttribute("media")!=="not all")&&(a.set(x.dataset.precedence,x),o=x)}o&&a.set(null,o)}u=n.instance,x=u.getAttribute("data-precedence"),f=a.get(x)||o,f===o&&a.set(null,u),a.set(x,u),this.count++,o=mc.bind(this),u.addEventListener("load",o),u.addEventListener("error",o),f?f.parentNode.insertBefore(u,f.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(u,e.firstChild)),n.state.loading|=4}}var ko={$$typeof:O,Provider:null,Consumer:null,_currentValue:et,_currentValue2:et,_threadCount:0};function by(e,n,a,o,u,f,x,R,V){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Wt(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Wt(0),this.hiddenUpdates=Wt(null),this.identifierPrefix=o,this.onUncaughtError=u,this.onCaughtError=f,this.onRecoverableError=x,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=V,this.incompleteTransitions=new Map}function e_(e,n,a,o,u,f,x,R,V,at,pt,xt){return e=new by(e,n,a,x,V,at,pt,xt,R),n=1,f===!0&&(n|=24),f=ai(3,null,null,n),e.current=f,f.stateNode=e,n=Ku(),n.refCount++,e.pooledCache=n,n.refCount++,f.memoizedState={element:o,isDehydrated:a,cache:n},tf(f),e}function n_(e){return e?(e=ir,e):ir}function i_(e,n,a,o,u,f){u=n_(u),o.context===null?o.context=u:o.pendingContext=u,o=Ha(n),o.payload={element:a},f=f===void 0?null:f,f!==null&&(o.callback=f),a=Ga(e,o,n),a!==null&&(Yn(a,e,n),yo(a,e,n))}function a_(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<n?a:n}}function xh(e,n){a_(e,n),(e=e.alternate)&&a_(e,n)}function s_(e){if(e.tag===13||e.tag===31){var n=bs(e,67108864);n!==null&&Yn(n,e,67108864),xh(e,67108864)}}function r_(e){if(e.tag===13||e.tag===31){var n=ci();n=vs(n);var a=bs(e,n);a!==null&&Yn(a,e,n),xh(e,n)}}var vc=!0;function Ty(e,n,a,o){var u=L.T;L.T=null;var f=H.p;try{H.p=2,Sh(e,n,a,o)}finally{H.p=f,L.T=u}}function Ay(e,n,a,o){var u=L.T;L.T=null;var f=H.p;try{H.p=8,Sh(e,n,a,o)}finally{H.p=f,L.T=u}}function Sh(e,n,a,o){if(vc){var u=yh(o);if(u===null)rh(e,n,o,xc,a),l_(e,o);else if(Cy(u,e,n,a,o))o.stopPropagation();else if(l_(e,o),n&4&&-1<Ry.indexOf(e)){for(;u!==null;){var f=Ua(u);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var x=Rt(f.pendingLanes);if(x!==0){var R=f;for(R.pendingLanes|=2,R.entangledLanes|=2;x;){var V=1<<31-Pt(x);R.entanglements[1]|=V,x&=~V}Vi(f),(Ue&6)===0&&(ec=Ct()+500,Fo(0))}}break;case 31:case 13:R=bs(f,2),R!==null&&Yn(R,f,2),ic(),xh(f,2)}if(f=yh(o),f===null&&rh(e,n,o,xc,a),f===u)break;u=f}u!==null&&o.stopPropagation()}else rh(e,n,o,null,a)}}function yh(e){return e=Mu(e),Mh(e)}var xc=null;function Mh(e){if(xc=null,e=Da(e),e!==null){var n=c(e);if(n===null)e=null;else{var a=n.tag;if(a===13){if(e=h(n),e!==null)return e;e=null}else if(a===31){if(e=p(n),e!==null)return e;e=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return xc=e,null}function o_(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Qe()){case D:return 2;case E:return 8;case nt:case vt:return 32;case Tt:return 268435456;default:return 32}default:return 32}}var Eh=!1,Ja=null,$a=null,ts=null,Xo=new Map,jo=new Map,es=[],Ry="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function l_(e,n){switch(e){case"focusin":case"focusout":Ja=null;break;case"dragenter":case"dragleave":$a=null;break;case"mouseover":case"mouseout":ts=null;break;case"pointerover":case"pointerout":Xo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":jo.delete(n.pointerId)}}function Wo(e,n,a,o,u,f){return e===null||e.nativeEvent!==f?(e={blockedOn:n,domEventName:a,eventSystemFlags:o,nativeEvent:f,targetContainers:[u]},n!==null&&(n=Ua(n),n!==null&&s_(n)),e):(e.eventSystemFlags|=o,n=e.targetContainers,u!==null&&n.indexOf(u)===-1&&n.push(u),e)}function Cy(e,n,a,o,u){switch(n){case"focusin":return Ja=Wo(Ja,e,n,a,o,u),!0;case"dragenter":return $a=Wo($a,e,n,a,o,u),!0;case"mouseover":return ts=Wo(ts,e,n,a,o,u),!0;case"pointerover":var f=u.pointerId;return Xo.set(f,Wo(Xo.get(f)||null,e,n,a,o,u)),!0;case"gotpointercapture":return f=u.pointerId,jo.set(f,Wo(jo.get(f)||null,e,n,a,o,u)),!0}return!1}function c_(e){var n=Da(e.target);if(n!==null){var a=c(n);if(a!==null){if(n=a.tag,n===13){if(n=h(a),n!==null){e.blockedOn=n,no(e.priority,function(){r_(a)});return}}else if(n===31){if(n=p(a),n!==null){e.blockedOn=n,no(e.priority,function(){r_(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Sc(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var a=yh(e.nativeEvent);if(a===null){a=e.nativeEvent;var o=new a.constructor(a.type,a);yu=o,a.target.dispatchEvent(o),yu=null}else return n=Ua(a),n!==null&&s_(n),e.blockedOn=a,!1;n.shift()}return!0}function u_(e,n,a){Sc(e)&&a.delete(n)}function wy(){Eh=!1,Ja!==null&&Sc(Ja)&&(Ja=null),$a!==null&&Sc($a)&&($a=null),ts!==null&&Sc(ts)&&(ts=null),Xo.forEach(u_),jo.forEach(u_)}function yc(e,n){e.blockedOn===n&&(e.blockedOn=null,Eh||(Eh=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,wy)))}var Mc=null;function f_(e){Mc!==e&&(Mc=e,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){Mc===e&&(Mc=null);for(var n=0;n<e.length;n+=3){var a=e[n],o=e[n+1],u=e[n+2];if(typeof o!="function"){if(Mh(o||a)===null)continue;break}var f=Ua(a);f!==null&&(e.splice(n,3),n-=3,yf(f,{pending:!0,data:u,method:a.method,action:o},o,u))}}))}function Rr(e){function n(V){return yc(V,e)}Ja!==null&&yc(Ja,e),$a!==null&&yc($a,e),ts!==null&&yc(ts,e),Xo.forEach(n),jo.forEach(n);for(var a=0;a<es.length;a++){var o=es[a];o.blockedOn===e&&(o.blockedOn=null)}for(;0<es.length&&(a=es[0],a.blockedOn===null);)c_(a),a.blockedOn===null&&es.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(o=0;o<a.length;o+=3){var u=a[o],f=a[o+1],x=u[Rn]||null;if(typeof f=="function")x||f_(a);else if(x){var R=null;if(f&&f.hasAttribute("formAction")){if(u=f,x=f[Rn]||null)R=x.formAction;else if(Mh(u)!==null)continue}else R=x.action;typeof R=="function"?a[o+1]=R:(a.splice(o,3),o-=3),f_(a)}}}function h_(){function e(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(x){return u=x})},focusReset:"manual",scroll:"manual"})}function n(){u!==null&&(u(),u=null),o||setTimeout(a,20)}function a(){if(!o&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,u=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),u!==null&&(u(),u=null)}}}function bh(e){this._internalRoot=e}Ec.prototype.render=bh.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(s(409));var a=n.current,o=ci();i_(a,o,e,n,null,null)},Ec.prototype.unmount=bh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;i_(e.current,2,null,e,null,null),ic(),n[Ji]=null}};function Ec(e){this._internalRoot=e}Ec.prototype.unstable_scheduleHydration=function(e){if(e){var n=eo();e={blockedOn:null,target:e,priority:n};for(var a=0;a<es.length&&n!==0&&n<es[a].priority;a++);es.splice(a,0,e),a===0&&c_(e)}};var d_=t.version;if(d_!=="19.2.6")throw Error(s(527,d_,"19.2.6"));H.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(s(188)):(e=Object.keys(e).join(","),Error(s(268,e)));return e=d(n),e=e!==null?_(e):null,e=e===null?null:e.stateNode,e};var Dy={bundleType:0,version:"19.2.6",rendererPackageName:"react-dom",currentDispatcherRef:L,reconcilerVersion:"19.2.6"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var bc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!bc.isDisabled&&bc.supportsFiber)try{ft=bc.inject(Dy),dt=bc}catch{}}return Yo.createRoot=function(e,n){if(!l(e))throw Error(s(299));var a=!1,o="",u=S0,f=y0,x=M0;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(x=n.onRecoverableError)),n=e_(e,1,!1,null,null,a,o,null,u,f,x,h_),e[Ji]=n.current,sh(e),new bh(n)},Yo.hydrateRoot=function(e,n,a){if(!l(e))throw Error(s(299));var o=!1,u="",f=S0,x=y0,R=M0,V=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(u=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(x=a.onCaughtError),a.onRecoverableError!==void 0&&(R=a.onRecoverableError),a.formState!==void 0&&(V=a.formState)),n=e_(e,1,!0,n,a??null,o,u,V,f,x,R,h_),n.context=n_(null),a=n.current,o=ci(),o=vs(o),u=Ha(o),u.callback=null,Ga(a,u,o),a=o,n.current.lanes=a,ee(n,a),Vi(n),e[Ji]=n.current,sh(e),new Ec(n)},Yo.version="19.2.6",Yo}var E_;function Hy(){if(E_)return Rh.exports;E_=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),Rh.exports=zy(),Rh.exports}var Gy=Hy();const Vy=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Fv=(...r)=>r.filter((t,i,s)=>!!t&&t.trim()!==""&&s.indexOf(t)===i).join(" ").trim();var ky={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const Xy=he.forwardRef(({color:r="currentColor",size:t=24,strokeWidth:i=2,absoluteStrokeWidth:s,className:l="",children:c,iconNode:h,...p},m)=>he.createElement("svg",{ref:m,...ky,width:t,height:t,stroke:r,strokeWidth:s?Number(i)*24/Number(t):i,className:Fv("lucide",l),...p},[...h.map(([d,_])=>he.createElement(d,_)),...Array.isArray(c)?c:[c]]));const gs=(r,t)=>{const i=he.forwardRef(({className:s,...l},c)=>he.createElement(Xy,{ref:c,iconNode:t,className:Fv(`lucide-${Vy(r)}`,s),...l}));return i.displayName=`${r}`,i};const jy=gs("BookOpen",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);const Wy=gs("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);const qy=gs("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);const Yy=gs("CodeXml",[["path",{d:"m18 16 4-4-4-4",key:"1inbqp"}],["path",{d:"m6 8-4 4 4 4",key:"15zrgr"}],["path",{d:"m14.5 4-5 16",key:"e7oirm"}]]);const Zy=gs("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);const Ky=gs("Github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);const Bv=gs("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);const hp=gs("Layers",[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]]);const dp="184",jr={ROTATE:0,DOLLY:1,PAN:2},kr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Qy=0,b_=1,Jy=2,tu=1,zv=2,il=3,ds=0,Jn=1,Ma=2,ba=0,Wr=1,T_=2,A_=3,R_=4,$y=5,Gs=100,tM=101,eM=102,nM=103,iM=104,aM=200,sM=201,rM=202,oM=203,_d=204,vd=205,lM=206,cM=207,uM=208,fM=209,hM=210,dM=211,pM=212,mM=213,gM=214,xd=0,Sd=1,yd=2,Yr=3,Md=4,Ed=5,bd=6,Td=7,Hv=0,_M=1,vM=2,Yi=0,Gv=1,Vv=2,kv=3,pp=4,Xv=5,jv=6,Wv=7,qv=300,Ws=301,Zr=302,Uh=303,Lh=304,_u=306,Ad=1e3,Ea=1001,Rd=1002,Ln=1003,xM=1004,Tc=1005,Bn=1006,Nh=1007,ks=1008,hi=1009,Yv=1010,Zv=1011,ll=1012,mp=1013,Ki=1014,Wi=1015,Aa=1016,gp=1017,_p=1018,cl=1020,Kv=35902,Qv=35899,Jv=1021,$v=1022,Ii=1023,Ra=1026,Xs=1027,tx=1028,vp=1029,qs=1030,xp=1031,Sp=1033,eu=33776,nu=33777,iu=33778,au=33779,Cd=35840,wd=35841,Dd=35842,Ud=35843,Ld=36196,Nd=37492,Od=37496,Pd=37488,Id=37489,ou=37490,Fd=37491,Bd=37808,zd=37809,Hd=37810,Gd=37811,Vd=37812,kd=37813,Xd=37814,jd=37815,Wd=37816,qd=37817,Yd=37818,Zd=37819,Kd=37820,Qd=37821,Jd=36492,$d=36494,tp=36495,ep=36283,np=36284,lu=36285,ip=36286,SM=3200,ap=0,yM=1,us="",Qn="srgb",cu="srgb-linear",uu="linear",ze="srgb",Cr=7680,C_=519,MM=512,EM=513,bM=514,yp=515,TM=516,AM=517,Mp=518,RM=519,w_=35044,D_="300 es",qi=2e3,ul=2001;function CM(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function fu(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function wM(){const r=fu("canvas");return r.style.display="block",r}const U_={};function L_(...r){const t="THREE."+r.shift();console.log(t,...r)}function ex(r){const t=r[0];if(typeof t=="string"&&t.startsWith("TSL:")){const i=r[1];i&&i.isStackTrace?r[0]+=" "+i.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function $t(...r){r=ex(r);const t="THREE."+r.shift();{const i=r[0];i&&i.isStackTrace?console.warn(i.getError(t)):console.warn(t,...r)}}function Ae(...r){r=ex(r);const t="THREE."+r.shift();{const i=r[0];i&&i.isStackTrace?console.error(i.getError(t)):console.error(t,...r)}}function sp(...r){const t=r.join(" ");t in U_||(U_[t]=!0,$t(...r))}function DM(r,t,i){return new Promise(function(s,l){function c(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:l();break;case r.TIMEOUT_EXPIRED:setTimeout(c,i);break;default:s()}}setTimeout(c,i)})}const UM={[xd]:Sd,[yd]:bd,[Md]:Td,[Yr]:Ed,[Sd]:xd,[bd]:yd,[Td]:Md,[Ed]:Yr};class _s{addEventListener(t,i){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[t]===void 0&&(s[t]=[]),s[t].indexOf(i)===-1&&s[t].push(i)}hasEventListener(t,i){const s=this._listeners;return s===void 0?!1:s[t]!==void 0&&s[t].indexOf(i)!==-1}removeEventListener(t,i){const s=this._listeners;if(s===void 0)return;const l=s[t];if(l!==void 0){const c=l.indexOf(i);c!==-1&&l.splice(c,1)}}dispatchEvent(t){const i=this._listeners;if(i===void 0)return;const s=i[t.type];if(s!==void 0){t.target=this;const l=s.slice(0);for(let c=0,h=l.length;c<h;c++)l[c].call(this,t);t.target=null}}}const In=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],rl=Math.PI/180,rp=180/Math.PI;function fl(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(In[r&255]+In[r>>8&255]+In[r>>16&255]+In[r>>24&255]+"-"+In[t&255]+In[t>>8&255]+"-"+In[t>>16&15|64]+In[t>>24&255]+"-"+In[i&63|128]+In[i>>8&255]+"-"+In[i>>16&255]+In[i>>24&255]+In[s&255]+In[s>>8&255]+In[s>>16&255]+In[s>>24&255]).toLowerCase()}function ge(r,t,i){return Math.max(t,Math.min(i,r))}function LM(r,t){return(r%t+t)%t}function Oh(r,t,i){return(1-i)*r+i*t}function Zo(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Zn(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const NM={DEG2RAD:rl},Up=class Up{constructor(t=0,i=0){this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const i=this.x,s=this.y,l=t.elements;return this.x=l[0]*i+l[3]*s+l[6],this.y=l[1]*i+l[4]*s+l[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=ge(this.x,t.x,i.x),this.y=ge(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=ge(this.x,t,i),this.y=ge(this.y,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(ge(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(t)/i;return Math.acos(ge(s,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,s=this.y-t.y;return i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){const s=Math.cos(i),l=Math.sin(i),c=this.x-t.x,h=this.y-t.y;return this.x=c*s-h*l+t.x,this.y=c*l+h*s+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Up.prototype.isVector2=!0;let re=Up;class ps{constructor(t=0,i=0,s=0,l=1){this.isQuaternion=!0,this._x=t,this._y=i,this._z=s,this._w=l}static slerpFlat(t,i,s,l,c,h,p){let m=s[l+0],d=s[l+1],_=s[l+2],v=s[l+3],g=c[h+0],M=c[h+1],b=c[h+2],C=c[h+3];if(v!==C||m!==g||d!==M||_!==b){let S=m*g+d*M+_*b+v*C;S<0&&(g=-g,M=-M,b=-b,C=-C,S=-S);let y=1-p;if(S<.9995){const w=Math.acos(S),O=Math.sin(w);y=Math.sin(y*w)/O,p=Math.sin(p*w)/O,m=m*y+g*p,d=d*y+M*p,_=_*y+b*p,v=v*y+C*p}else{m=m*y+g*p,d=d*y+M*p,_=_*y+b*p,v=v*y+C*p;const w=1/Math.sqrt(m*m+d*d+_*_+v*v);m*=w,d*=w,_*=w,v*=w}}t[i]=m,t[i+1]=d,t[i+2]=_,t[i+3]=v}static multiplyQuaternionsFlat(t,i,s,l,c,h){const p=s[l],m=s[l+1],d=s[l+2],_=s[l+3],v=c[h],g=c[h+1],M=c[h+2],b=c[h+3];return t[i]=p*b+_*v+m*M-d*g,t[i+1]=m*b+_*g+d*v-p*M,t[i+2]=d*b+_*M+p*g-m*v,t[i+3]=_*b-p*v-m*g-d*M,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,i,s,l){return this._x=t,this._y=i,this._z=s,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,i=!0){const s=t._x,l=t._y,c=t._z,h=t._order,p=Math.cos,m=Math.sin,d=p(s/2),_=p(l/2),v=p(c/2),g=m(s/2),M=m(l/2),b=m(c/2);switch(h){case"XYZ":this._x=g*_*v+d*M*b,this._y=d*M*v-g*_*b,this._z=d*_*b+g*M*v,this._w=d*_*v-g*M*b;break;case"YXZ":this._x=g*_*v+d*M*b,this._y=d*M*v-g*_*b,this._z=d*_*b-g*M*v,this._w=d*_*v+g*M*b;break;case"ZXY":this._x=g*_*v-d*M*b,this._y=d*M*v+g*_*b,this._z=d*_*b+g*M*v,this._w=d*_*v-g*M*b;break;case"ZYX":this._x=g*_*v-d*M*b,this._y=d*M*v+g*_*b,this._z=d*_*b-g*M*v,this._w=d*_*v+g*M*b;break;case"YZX":this._x=g*_*v+d*M*b,this._y=d*M*v+g*_*b,this._z=d*_*b-g*M*v,this._w=d*_*v-g*M*b;break;case"XZY":this._x=g*_*v-d*M*b,this._y=d*M*v-g*_*b,this._z=d*_*b+g*M*v,this._w=d*_*v+g*M*b;break;default:$t("Quaternion: .setFromEuler() encountered an unknown order: "+h)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,i){const s=i/2,l=Math.sin(s);return this._x=t.x*l,this._y=t.y*l,this._z=t.z*l,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(t){const i=t.elements,s=i[0],l=i[4],c=i[8],h=i[1],p=i[5],m=i[9],d=i[2],_=i[6],v=i[10],g=s+p+v;if(g>0){const M=.5/Math.sqrt(g+1);this._w=.25/M,this._x=(_-m)*M,this._y=(c-d)*M,this._z=(h-l)*M}else if(s>p&&s>v){const M=2*Math.sqrt(1+s-p-v);this._w=(_-m)/M,this._x=.25*M,this._y=(l+h)/M,this._z=(c+d)/M}else if(p>v){const M=2*Math.sqrt(1+p-s-v);this._w=(c-d)/M,this._x=(l+h)/M,this._y=.25*M,this._z=(m+_)/M}else{const M=2*Math.sqrt(1+v-s-p);this._w=(h-l)/M,this._x=(c+d)/M,this._y=(m+_)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(t,i){let s=t.dot(i)+1;return s<1e-8?(s=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=s):(this._x=0,this._y=-t.z,this._z=t.y,this._w=s)):(this._x=t.y*i.z-t.z*i.y,this._y=t.z*i.x-t.x*i.z,this._z=t.x*i.y-t.y*i.x,this._w=s),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ge(this.dot(t),-1,1)))}rotateTowards(t,i){const s=this.angleTo(t);if(s===0)return this;const l=Math.min(1,i/s);return this.slerp(t,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,i){const s=t._x,l=t._y,c=t._z,h=t._w,p=i._x,m=i._y,d=i._z,_=i._w;return this._x=s*_+h*p+l*d-c*m,this._y=l*_+h*m+c*p-s*d,this._z=c*_+h*d+s*m-l*p,this._w=h*_-s*p-l*m-c*d,this._onChangeCallback(),this}slerp(t,i){let s=t._x,l=t._y,c=t._z,h=t._w,p=this.dot(t);p<0&&(s=-s,l=-l,c=-c,h=-h,p=-p);let m=1-i;if(p<.9995){const d=Math.acos(p),_=Math.sin(d);m=Math.sin(m*d)/_,i=Math.sin(i*d)/_,this._x=this._x*m+s*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+h*i,this._onChangeCallback()}else this._x=this._x*m+s*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+h*i,this.normalize();return this}slerpQuaternions(t,i,s){return this.copy(t).slerp(i,s)}random(){const t=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),s=Math.random(),l=Math.sqrt(1-s),c=Math.sqrt(s);return this.set(l*Math.sin(t),l*Math.cos(t),c*Math.sin(i),c*Math.cos(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,i=0){return this._x=t[i],this._y=t[i+1],this._z=t[i+2],this._w=t[i+3],this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._w,t}fromBufferAttribute(t,i){return this._x=t.getX(i),this._y=t.getY(i),this._z=t.getZ(i),this._w=t.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Lp=class Lp{constructor(t=0,i=0,s=0){this.x=t,this.y=i,this.z=s}set(t,i,s){return s===void 0&&(s=this.z),this.x=t,this.y=i,this.z=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(N_.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(N_.setFromAxisAngle(t,i))}applyMatrix3(t){const i=this.x,s=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[3]*s+c[6]*l,this.y=c[1]*i+c[4]*s+c[7]*l,this.z=c[2]*i+c[5]*s+c[8]*l,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const i=this.x,s=this.y,l=this.z,c=t.elements,h=1/(c[3]*i+c[7]*s+c[11]*l+c[15]);return this.x=(c[0]*i+c[4]*s+c[8]*l+c[12])*h,this.y=(c[1]*i+c[5]*s+c[9]*l+c[13])*h,this.z=(c[2]*i+c[6]*s+c[10]*l+c[14])*h,this}applyQuaternion(t){const i=this.x,s=this.y,l=this.z,c=t.x,h=t.y,p=t.z,m=t.w,d=2*(h*l-p*s),_=2*(p*i-c*l),v=2*(c*s-h*i);return this.x=i+m*d+h*v-p*_,this.y=s+m*_+p*d-c*v,this.z=l+m*v+c*_-h*d,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const i=this.x,s=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[4]*s+c[8]*l,this.y=c[1]*i+c[5]*s+c[9]*l,this.z=c[2]*i+c[6]*s+c[10]*l,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=ge(this.x,t.x,i.x),this.y=ge(this.y,t.y,i.y),this.z=ge(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=ge(this.x,t,i),this.y=ge(this.y,t,i),this.z=ge(this.z,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(ge(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this.z=t.z+(i.z-t.z)*s,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){const s=t.x,l=t.y,c=t.z,h=i.x,p=i.y,m=i.z;return this.x=l*m-c*p,this.y=c*h-s*m,this.z=s*p-l*h,this}projectOnVector(t){const i=t.lengthSq();if(i===0)return this.set(0,0,0);const s=t.dot(this)/i;return this.copy(t).multiplyScalar(s)}projectOnPlane(t){return Ph.copy(this).projectOnVector(t),this.sub(Ph)}reflect(t){return this.sub(Ph.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(t)/i;return Math.acos(ge(s,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,s=this.y-t.y,l=this.z-t.z;return i*i+s*s+l*l}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,s){const l=Math.sin(i)*t;return this.x=l*Math.sin(s),this.y=Math.cos(i)*t,this.z=l*Math.cos(s),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,s){return this.x=t*Math.sin(i),this.y=s,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){const i=this.setFromMatrixColumn(t,0).length(),s=this.setFromMatrixColumn(t,1).length(),l=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=s,this.z=l,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,i=Math.random()*2-1,s=Math.sqrt(1-i*i);return this.x=s*Math.cos(t),this.y=i,this.z=s*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Lp.prototype.isVector3=!0;let tt=Lp;const Ph=new tt,N_=new ps,Np=class Np{constructor(t,i,s,l,c,h,p,m,d){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,s,l,c,h,p,m,d)}set(t,i,s,l,c,h,p,m,d){const _=this.elements;return _[0]=t,_[1]=l,_[2]=p,_[3]=i,_[4]=c,_[5]=m,_[6]=s,_[7]=h,_[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const i=this.elements,s=t.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],this}extractBasis(t,i,s){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const s=t.elements,l=i.elements,c=this.elements,h=s[0],p=s[3],m=s[6],d=s[1],_=s[4],v=s[7],g=s[2],M=s[5],b=s[8],C=l[0],S=l[3],y=l[6],w=l[1],O=l[4],P=l[7],z=l[2],N=l[5],B=l[8];return c[0]=h*C+p*w+m*z,c[3]=h*S+p*O+m*N,c[6]=h*y+p*P+m*B,c[1]=d*C+_*w+v*z,c[4]=d*S+_*O+v*N,c[7]=d*y+_*P+v*B,c[2]=g*C+M*w+b*z,c[5]=g*S+M*O+b*N,c[8]=g*y+M*P+b*B,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],h=t[4],p=t[5],m=t[6],d=t[7],_=t[8];return i*h*_-i*p*d-s*c*_+s*p*m+l*c*d-l*h*m}invert(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],h=t[4],p=t[5],m=t[6],d=t[7],_=t[8],v=_*h-p*d,g=p*m-_*c,M=d*c-h*m,b=i*v+s*g+l*M;if(b===0)return this.set(0,0,0,0,0,0,0,0,0);const C=1/b;return t[0]=v*C,t[1]=(l*d-_*s)*C,t[2]=(p*s-l*h)*C,t[3]=g*C,t[4]=(_*i-l*m)*C,t[5]=(l*c-p*i)*C,t[6]=M*C,t[7]=(s*m-d*i)*C,t[8]=(h*i-s*c)*C,this}transpose(){let t;const i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,s,l,c,h,p){const m=Math.cos(c),d=Math.sin(c);return this.set(s*m,s*d,-s*(m*h+d*p)+h+t,-l*d,l*m,-l*(-d*h+m*p)+p+i,0,0,1),this}scale(t,i){return this.premultiply(Ih.makeScale(t,i)),this}rotate(t){return this.premultiply(Ih.makeRotation(-t)),this}translate(t,i){return this.premultiply(Ih.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,-s,0,s,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){const i=this.elements,s=t.elements;for(let l=0;l<9;l++)if(i[l]!==s[l])return!1;return!0}fromArray(t,i=0){for(let s=0;s<9;s++)this.elements[s]=t[s+i];return this}toArray(t=[],i=0){const s=this.elements;return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],t[i+4]=s[4],t[i+5]=s[5],t[i+6]=s[6],t[i+7]=s[7],t[i+8]=s[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Np.prototype.isMatrix3=!0;let se=Np;const Ih=new se,O_=new se().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),P_=new se().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function OM(){const r={enabled:!0,workingColorSpace:cu,spaces:{},convert:function(l,c,h){return this.enabled===!1||c===h||!c||!h||(this.spaces[c].transfer===ze&&(l.r=Ta(l.r),l.g=Ta(l.g),l.b=Ta(l.b)),this.spaces[c].primaries!==this.spaces[h].primaries&&(l.applyMatrix3(this.spaces[c].toXYZ),l.applyMatrix3(this.spaces[h].fromXYZ)),this.spaces[h].transfer===ze&&(l.r=qr(l.r),l.g=qr(l.g),l.b=qr(l.b))),l},workingToColorSpace:function(l,c){return this.convert(l,this.workingColorSpace,c)},colorSpaceToWorking:function(l,c){return this.convert(l,c,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===us?uu:this.spaces[l].transfer},getToneMappingMode:function(l){return this.spaces[l].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(l,c=this.workingColorSpace){return l.fromArray(this.spaces[c].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,c,h){return l.copy(this.spaces[c].toXYZ).multiply(this.spaces[h].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,c){return sp("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(l,c)},toWorkingColorSpace:function(l,c){return sp("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(l,c)}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],s=[.3127,.329];return r.define({[cu]:{primaries:t,whitePoint:s,transfer:uu,toXYZ:O_,fromXYZ:P_,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:Qn},outputColorSpaceConfig:{drawingBufferColorSpace:Qn}},[Qn]:{primaries:t,whitePoint:s,transfer:ze,toXYZ:O_,fromXYZ:P_,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:Qn}}}),r}const Te=OM();function Ta(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function qr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let wr;class PM{static getDataURL(t,i="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let s;if(t instanceof HTMLCanvasElement)s=t;else{wr===void 0&&(wr=fu("canvas")),wr.width=t.width,wr.height=t.height;const l=wr.getContext("2d");t instanceof ImageData?l.putImageData(t,0,0):l.drawImage(t,0,0,t.width,t.height),s=wr}return s.toDataURL(i)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const i=fu("canvas");i.width=t.width,i.height=t.height;const s=i.getContext("2d");s.drawImage(t,0,0,t.width,t.height);const l=s.getImageData(0,0,t.width,t.height),c=l.data;for(let h=0;h<c.length;h++)c[h]=Ta(c[h]/255)*255;return s.putImageData(l,0,0),i}else if(t.data){const i=t.data.slice(0);for(let s=0;s<i.length;s++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[s]=Math.floor(Ta(i[s]/255)*255):i[s]=Ta(i[s]);return{data:i,width:t.width,height:t.height}}else return $t("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let IM=0;class Ep{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:IM++}),this.uuid=fl(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const i=this.data;return typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement?t.set(i.videoWidth,i.videoHeight,0):typeof VideoFrame<"u"&&i instanceof VideoFrame?t.set(i.displayWidth,i.displayHeight,0):i!==null?t.set(i.width,i.height,i.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const s={uuid:this.uuid,url:""},l=this.data;if(l!==null){let c;if(Array.isArray(l)){c=[];for(let h=0,p=l.length;h<p;h++)l[h].isDataTexture?c.push(Fh(l[h].image)):c.push(Fh(l[h]))}else c=Fh(l);s.url=c}return i||(t.images[this.uuid]=s),s}}function Fh(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?PM.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:($t("Texture: Unable to serialize Texture."),{})}let FM=0;const Bh=new tt;class Vn extends _s{constructor(t=Vn.DEFAULT_IMAGE,i=Vn.DEFAULT_MAPPING,s=Ea,l=Ea,c=Bn,h=ks,p=Ii,m=hi,d=Vn.DEFAULT_ANISOTROPY,_=us){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:FM++}),this.uuid=fl(),this.name="",this.source=new Ep(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=s,this.wrapT=l,this.magFilter=c,this.minFilter=h,this.anisotropy=d,this.format=p,this.internalFormat=null,this.type=m,this.offset=new re(0,0),this.repeat=new re(1,1),this.center=new re(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new se,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=_,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Bh).x}get height(){return this.source.getSize(Bh).y}get depth(){return this.source.getSize(Bh).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const i in t){const s=t[i];if(s===void 0){$t(`Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){$t(`Texture.setValues(): property '${i}' does not exist.`);continue}l&&s&&l.isVector2&&s.isVector2||l&&s&&l.isVector3&&s.isVector3||l&&s&&l.isMatrix3&&s.isMatrix3?l.copy(s):this[i]=s}}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const s={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),i||(t.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==qv)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ad:t.x=t.x-Math.floor(t.x);break;case Ea:t.x=t.x<0?0:1;break;case Rd:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ad:t.y=t.y-Math.floor(t.y);break;case Ea:t.y=t.y<0?0:1;break;case Rd:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Vn.DEFAULT_IMAGE=null;Vn.DEFAULT_MAPPING=qv;Vn.DEFAULT_ANISOTROPY=1;const Op=class Op{constructor(t=0,i=0,s=0,l=1){this.x=t,this.y=i,this.z=s,this.w=l}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,s,l){return this.x=t,this.y=i,this.z=s,this.w=l,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const i=this.x,s=this.y,l=this.z,c=this.w,h=t.elements;return this.x=h[0]*i+h[4]*s+h[8]*l+h[12]*c,this.y=h[1]*i+h[5]*s+h[9]*l+h[13]*c,this.z=h[2]*i+h[6]*s+h[10]*l+h[14]*c,this.w=h[3]*i+h[7]*s+h[11]*l+h[15]*c,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,s,l,c;const m=t.elements,d=m[0],_=m[4],v=m[8],g=m[1],M=m[5],b=m[9],C=m[2],S=m[6],y=m[10];if(Math.abs(_-g)<.01&&Math.abs(v-C)<.01&&Math.abs(b-S)<.01){if(Math.abs(_+g)<.1&&Math.abs(v+C)<.1&&Math.abs(b+S)<.1&&Math.abs(d+M+y-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const O=(d+1)/2,P=(M+1)/2,z=(y+1)/2,N=(_+g)/4,B=(v+C)/4,T=(b+S)/4;return O>P&&O>z?O<.01?(s=0,l=.707106781,c=.707106781):(s=Math.sqrt(O),l=N/s,c=B/s):P>z?P<.01?(s=.707106781,l=0,c=.707106781):(l=Math.sqrt(P),s=N/l,c=T/l):z<.01?(s=.707106781,l=.707106781,c=0):(c=Math.sqrt(z),s=B/c,l=T/c),this.set(s,l,c,i),this}let w=Math.sqrt((S-b)*(S-b)+(v-C)*(v-C)+(g-_)*(g-_));return Math.abs(w)<.001&&(w=1),this.x=(S-b)/w,this.y=(v-C)/w,this.z=(g-_)/w,this.w=Math.acos((d+M+y-1)/2),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=ge(this.x,t.x,i.x),this.y=ge(this.y,t.y,i.y),this.z=ge(this.z,t.z,i.z),this.w=ge(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=ge(this.x,t,i),this.y=ge(this.y,t,i),this.z=ge(this.z,t,i),this.w=ge(this.w,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(ge(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this.z=t.z+(i.z-t.z)*s,this.w=t.w+(i.w-t.w)*s,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Op.prototype.isVector4=!0;let rn=Op;class BM extends _s{constructor(t=1,i=1,s={}){super(),s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Bn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},s),this.isRenderTarget=!0,this.width=t,this.height=i,this.depth=s.depth,this.scissor=new rn(0,0,t,i),this.scissorTest=!1,this.viewport=new rn(0,0,t,i),this.textures=[];const l={width:t,height:i,depth:s.depth},c=new Vn(l),h=s.count;for(let p=0;p<h;p++)this.textures[p]=c.clone(),this.textures[p].isRenderTargetTexture=!0,this.textures[p].renderTarget=this;this._setTextureOptions(s),this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=s.depthTexture,this.samples=s.samples,this.multiview=s.multiview}_setTextureOptions(t={}){const i={minFilter:Bn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(i.mapping=t.mapping),t.wrapS!==void 0&&(i.wrapS=t.wrapS),t.wrapT!==void 0&&(i.wrapT=t.wrapT),t.wrapR!==void 0&&(i.wrapR=t.wrapR),t.magFilter!==void 0&&(i.magFilter=t.magFilter),t.minFilter!==void 0&&(i.minFilter=t.minFilter),t.format!==void 0&&(i.format=t.format),t.type!==void 0&&(i.type=t.type),t.anisotropy!==void 0&&(i.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(i.colorSpace=t.colorSpace),t.flipY!==void 0&&(i.flipY=t.flipY),t.generateMipmaps!==void 0&&(i.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(i.internalFormat=t.internalFormat);for(let s=0;s<this.textures.length;s++)this.textures[s].setValues(i)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,i,s=1){if(this.width!==t||this.height!==i||this.depth!==s){this.width=t,this.height=i,this.depth=s;for(let l=0,c=this.textures.length;l<c;l++)this.textures[l].image.width=t,this.textures[l].image.height=i,this.textures[l].image.depth=s,this.textures[l].isData3DTexture!==!0&&(this.textures[l].isArrayTexture=this.textures[l].image.depth>1);this.dispose()}this.viewport.set(0,0,t,i),this.scissor.set(0,0,t,i)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++){this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},t.textures[i].image);this.textures[i].source=new Ep(l)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zi extends BM{constructor(t=1,i=1,s={}){super(t,i,s),this.isWebGLRenderTarget=!0}}class nx extends Vn{constructor(t=null,i=1,s=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:i,height:s,depth:l},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=Ea,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class zM extends Vn{constructor(t=null,i=1,s=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:i,height:s,depth:l},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=Ea,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const gu=class gu{constructor(t,i,s,l,c,h,p,m,d,_,v,g,M,b,C,S){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,s,l,c,h,p,m,d,_,v,g,M,b,C,S)}set(t,i,s,l,c,h,p,m,d,_,v,g,M,b,C,S){const y=this.elements;return y[0]=t,y[4]=i,y[8]=s,y[12]=l,y[1]=c,y[5]=h,y[9]=p,y[13]=m,y[2]=d,y[6]=_,y[10]=v,y[14]=g,y[3]=M,y[7]=b,y[11]=C,y[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new gu().fromArray(this.elements)}copy(t){const i=this.elements,s=t.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],i[9]=s[9],i[10]=s[10],i[11]=s[11],i[12]=s[12],i[13]=s[13],i[14]=s[14],i[15]=s[15],this}copyPosition(t){const i=this.elements,s=t.elements;return i[12]=s[12],i[13]=s[13],i[14]=s[14],this}setFromMatrix3(t){const i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,s){return this.determinant()===0?(t.set(1,0,0),i.set(0,1,0),s.set(0,0,1),this):(t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this)}makeBasis(t,i,s){return this.set(t.x,i.x,s.x,0,t.y,i.y,s.y,0,t.z,i.z,s.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();const i=this.elements,s=t.elements,l=1/Dr.setFromMatrixColumn(t,0).length(),c=1/Dr.setFromMatrixColumn(t,1).length(),h=1/Dr.setFromMatrixColumn(t,2).length();return i[0]=s[0]*l,i[1]=s[1]*l,i[2]=s[2]*l,i[3]=0,i[4]=s[4]*c,i[5]=s[5]*c,i[6]=s[6]*c,i[7]=0,i[8]=s[8]*h,i[9]=s[9]*h,i[10]=s[10]*h,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){const i=this.elements,s=t.x,l=t.y,c=t.z,h=Math.cos(s),p=Math.sin(s),m=Math.cos(l),d=Math.sin(l),_=Math.cos(c),v=Math.sin(c);if(t.order==="XYZ"){const g=h*_,M=h*v,b=p*_,C=p*v;i[0]=m*_,i[4]=-m*v,i[8]=d,i[1]=M+b*d,i[5]=g-C*d,i[9]=-p*m,i[2]=C-g*d,i[6]=b+M*d,i[10]=h*m}else if(t.order==="YXZ"){const g=m*_,M=m*v,b=d*_,C=d*v;i[0]=g+C*p,i[4]=b*p-M,i[8]=h*d,i[1]=h*v,i[5]=h*_,i[9]=-p,i[2]=M*p-b,i[6]=C+g*p,i[10]=h*m}else if(t.order==="ZXY"){const g=m*_,M=m*v,b=d*_,C=d*v;i[0]=g-C*p,i[4]=-h*v,i[8]=b+M*p,i[1]=M+b*p,i[5]=h*_,i[9]=C-g*p,i[2]=-h*d,i[6]=p,i[10]=h*m}else if(t.order==="ZYX"){const g=h*_,M=h*v,b=p*_,C=p*v;i[0]=m*_,i[4]=b*d-M,i[8]=g*d+C,i[1]=m*v,i[5]=C*d+g,i[9]=M*d-b,i[2]=-d,i[6]=p*m,i[10]=h*m}else if(t.order==="YZX"){const g=h*m,M=h*d,b=p*m,C=p*d;i[0]=m*_,i[4]=C-g*v,i[8]=b*v+M,i[1]=v,i[5]=h*_,i[9]=-p*_,i[2]=-d*_,i[6]=M*v+b,i[10]=g-C*v}else if(t.order==="XZY"){const g=h*m,M=h*d,b=p*m,C=p*d;i[0]=m*_,i[4]=-v,i[8]=d*_,i[1]=g*v+C,i[5]=h*_,i[9]=M*v-b,i[2]=b*v-M,i[6]=p*_,i[10]=C*v+g}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose(HM,t,GM)}lookAt(t,i,s){const l=this.elements;return ui.subVectors(t,i),ui.lengthSq()===0&&(ui.z=1),ui.normalize(),is.crossVectors(s,ui),is.lengthSq()===0&&(Math.abs(s.z)===1?ui.x+=1e-4:ui.z+=1e-4,ui.normalize(),is.crossVectors(s,ui)),is.normalize(),Ac.crossVectors(ui,is),l[0]=is.x,l[4]=Ac.x,l[8]=ui.x,l[1]=is.y,l[5]=Ac.y,l[9]=ui.y,l[2]=is.z,l[6]=Ac.z,l[10]=ui.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const s=t.elements,l=i.elements,c=this.elements,h=s[0],p=s[4],m=s[8],d=s[12],_=s[1],v=s[5],g=s[9],M=s[13],b=s[2],C=s[6],S=s[10],y=s[14],w=s[3],O=s[7],P=s[11],z=s[15],N=l[0],B=l[4],T=l[8],F=l[12],q=l[1],G=l[5],$=l[9],ut=l[13],ht=l[2],j=l[6],L=l[10],H=l[14],et=l[3],gt=l[7],yt=l[11],I=l[15];return c[0]=h*N+p*q+m*ht+d*et,c[4]=h*B+p*G+m*j+d*gt,c[8]=h*T+p*$+m*L+d*yt,c[12]=h*F+p*ut+m*H+d*I,c[1]=_*N+v*q+g*ht+M*et,c[5]=_*B+v*G+g*j+M*gt,c[9]=_*T+v*$+g*L+M*yt,c[13]=_*F+v*ut+g*H+M*I,c[2]=b*N+C*q+S*ht+y*et,c[6]=b*B+C*G+S*j+y*gt,c[10]=b*T+C*$+S*L+y*yt,c[14]=b*F+C*ut+S*H+y*I,c[3]=w*N+O*q+P*ht+z*et,c[7]=w*B+O*G+P*j+z*gt,c[11]=w*T+O*$+P*L+z*yt,c[15]=w*F+O*ut+P*H+z*I,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){const t=this.elements,i=t[0],s=t[4],l=t[8],c=t[12],h=t[1],p=t[5],m=t[9],d=t[13],_=t[2],v=t[6],g=t[10],M=t[14],b=t[3],C=t[7],S=t[11],y=t[15],w=m*M-d*g,O=p*M-d*v,P=p*g-m*v,z=h*M-d*_,N=h*g-m*_,B=h*v-p*_;return i*(C*w-S*O+y*P)-s*(b*w-S*z+y*N)+l*(b*O-C*z+y*B)-c*(b*P-C*N+S*B)}transpose(){const t=this.elements;let i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,s){const l=this.elements;return t.isVector3?(l[12]=t.x,l[13]=t.y,l[14]=t.z):(l[12]=t,l[13]=i,l[14]=s),this}invert(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],h=t[4],p=t[5],m=t[6],d=t[7],_=t[8],v=t[9],g=t[10],M=t[11],b=t[12],C=t[13],S=t[14],y=t[15],w=i*p-s*h,O=i*m-l*h,P=i*d-c*h,z=s*m-l*p,N=s*d-c*p,B=l*d-c*m,T=_*C-v*b,F=_*S-g*b,q=_*y-M*b,G=v*S-g*C,$=v*y-M*C,ut=g*y-M*S,ht=w*ut-O*$+P*G+z*q-N*F+B*T;if(ht===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const j=1/ht;return t[0]=(p*ut-m*$+d*G)*j,t[1]=(l*$-s*ut-c*G)*j,t[2]=(C*B-S*N+y*z)*j,t[3]=(g*N-v*B-M*z)*j,t[4]=(m*q-h*ut-d*F)*j,t[5]=(i*ut-l*q+c*F)*j,t[6]=(S*P-b*B-y*O)*j,t[7]=(_*B-g*P+M*O)*j,t[8]=(h*$-p*q+d*T)*j,t[9]=(s*q-i*$-c*T)*j,t[10]=(b*N-C*P+y*w)*j,t[11]=(v*P-_*N-M*w)*j,t[12]=(p*F-h*G-m*T)*j,t[13]=(i*G-s*F+l*T)*j,t[14]=(C*O-b*z-S*w)*j,t[15]=(_*z-v*O+g*w)*j,this}scale(t){const i=this.elements,s=t.x,l=t.y,c=t.z;return i[0]*=s,i[4]*=l,i[8]*=c,i[1]*=s,i[5]*=l,i[9]*=c,i[2]*=s,i[6]*=l,i[10]*=c,i[3]*=s,i[7]*=l,i[11]*=c,this}getMaxScaleOnAxis(){const t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],s=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],l=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,s,l))}makeTranslation(t,i,s){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,s,0,0,0,1),this}makeRotationX(t){const i=Math.cos(t),s=Math.sin(t);return this.set(1,0,0,0,0,i,-s,0,0,s,i,0,0,0,0,1),this}makeRotationY(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,0,s,0,0,1,0,0,-s,0,i,0,0,0,0,1),this}makeRotationZ(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,-s,0,0,s,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){const s=Math.cos(i),l=Math.sin(i),c=1-s,h=t.x,p=t.y,m=t.z,d=c*h,_=c*p;return this.set(d*h+s,d*p-l*m,d*m+l*p,0,d*p+l*m,_*p+s,_*m-l*h,0,d*m-l*p,_*m+l*h,c*m*m+s,0,0,0,0,1),this}makeScale(t,i,s){return this.set(t,0,0,0,0,i,0,0,0,0,s,0,0,0,0,1),this}makeShear(t,i,s,l,c,h){return this.set(1,s,c,0,t,1,h,0,i,l,1,0,0,0,0,1),this}compose(t,i,s){const l=this.elements,c=i._x,h=i._y,p=i._z,m=i._w,d=c+c,_=h+h,v=p+p,g=c*d,M=c*_,b=c*v,C=h*_,S=h*v,y=p*v,w=m*d,O=m*_,P=m*v,z=s.x,N=s.y,B=s.z;return l[0]=(1-(C+y))*z,l[1]=(M+P)*z,l[2]=(b-O)*z,l[3]=0,l[4]=(M-P)*N,l[5]=(1-(g+y))*N,l[6]=(S+w)*N,l[7]=0,l[8]=(b+O)*B,l[9]=(S-w)*B,l[10]=(1-(g+C))*B,l[11]=0,l[12]=t.x,l[13]=t.y,l[14]=t.z,l[15]=1,this}decompose(t,i,s){const l=this.elements;t.x=l[12],t.y=l[13],t.z=l[14];const c=this.determinant();if(c===0)return s.set(1,1,1),i.identity(),this;let h=Dr.set(l[0],l[1],l[2]).length();const p=Dr.set(l[4],l[5],l[6]).length(),m=Dr.set(l[8],l[9],l[10]).length();c<0&&(h=-h),Li.copy(this);const d=1/h,_=1/p,v=1/m;return Li.elements[0]*=d,Li.elements[1]*=d,Li.elements[2]*=d,Li.elements[4]*=_,Li.elements[5]*=_,Li.elements[6]*=_,Li.elements[8]*=v,Li.elements[9]*=v,Li.elements[10]*=v,i.setFromRotationMatrix(Li),s.x=h,s.y=p,s.z=m,this}makePerspective(t,i,s,l,c,h,p=qi,m=!1){const d=this.elements,_=2*c/(i-t),v=2*c/(s-l),g=(i+t)/(i-t),M=(s+l)/(s-l);let b,C;if(m)b=c/(h-c),C=h*c/(h-c);else if(p===qi)b=-(h+c)/(h-c),C=-2*h*c/(h-c);else if(p===ul)b=-h/(h-c),C=-h*c/(h-c);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+p);return d[0]=_,d[4]=0,d[8]=g,d[12]=0,d[1]=0,d[5]=v,d[9]=M,d[13]=0,d[2]=0,d[6]=0,d[10]=b,d[14]=C,d[3]=0,d[7]=0,d[11]=-1,d[15]=0,this}makeOrthographic(t,i,s,l,c,h,p=qi,m=!1){const d=this.elements,_=2/(i-t),v=2/(s-l),g=-(i+t)/(i-t),M=-(s+l)/(s-l);let b,C;if(m)b=1/(h-c),C=h/(h-c);else if(p===qi)b=-2/(h-c),C=-(h+c)/(h-c);else if(p===ul)b=-1/(h-c),C=-c/(h-c);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+p);return d[0]=_,d[4]=0,d[8]=0,d[12]=g,d[1]=0,d[5]=v,d[9]=0,d[13]=M,d[2]=0,d[6]=0,d[10]=b,d[14]=C,d[3]=0,d[7]=0,d[11]=0,d[15]=1,this}equals(t){const i=this.elements,s=t.elements;for(let l=0;l<16;l++)if(i[l]!==s[l])return!1;return!0}fromArray(t,i=0){for(let s=0;s<16;s++)this.elements[s]=t[s+i];return this}toArray(t=[],i=0){const s=this.elements;return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],t[i+4]=s[4],t[i+5]=s[5],t[i+6]=s[6],t[i+7]=s[7],t[i+8]=s[8],t[i+9]=s[9],t[i+10]=s[10],t[i+11]=s[11],t[i+12]=s[12],t[i+13]=s[13],t[i+14]=s[14],t[i+15]=s[15],t}};gu.prototype.isMatrix4=!0;let on=gu;const Dr=new tt,Li=new on,HM=new tt(0,0,0),GM=new tt(1,1,1),is=new tt,Ac=new tt,ui=new tt,I_=new on,F_=new ps;class ms{constructor(t=0,i=0,s=0,l=ms.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=s,this._order=l}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,s,l=this._order){return this._x=t,this._y=i,this._z=s,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,s=!0){const l=t.elements,c=l[0],h=l[4],p=l[8],m=l[1],d=l[5],_=l[9],v=l[2],g=l[6],M=l[10];switch(i){case"XYZ":this._y=Math.asin(ge(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-_,M),this._z=Math.atan2(-h,c)):(this._x=Math.atan2(g,d),this._z=0);break;case"YXZ":this._x=Math.asin(-ge(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(p,M),this._z=Math.atan2(m,d)):(this._y=Math.atan2(-v,c),this._z=0);break;case"ZXY":this._x=Math.asin(ge(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-v,M),this._z=Math.atan2(-h,d)):(this._y=0,this._z=Math.atan2(m,c));break;case"ZYX":this._y=Math.asin(-ge(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(g,M),this._z=Math.atan2(m,c)):(this._x=0,this._z=Math.atan2(-h,d));break;case"YZX":this._z=Math.asin(ge(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-_,d),this._y=Math.atan2(-v,c)):(this._x=0,this._y=Math.atan2(p,M));break;case"XZY":this._z=Math.asin(-ge(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(g,d),this._y=Math.atan2(p,c)):(this._x=Math.atan2(-_,M),this._y=0);break;default:$t("Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,s===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,s){return I_.makeRotationFromQuaternion(t),this.setFromRotationMatrix(I_,i,s)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return F_.setFromEuler(this),this.setFromQuaternion(F_,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ms.DEFAULT_ORDER="XYZ";class ix{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let VM=0;const B_=new tt,Ur=new ps,ga=new on,Rc=new tt,Ko=new tt,kM=new tt,XM=new ps,z_=new tt(1,0,0),H_=new tt(0,1,0),G_=new tt(0,0,1),V_={type:"added"},jM={type:"removed"},Lr={type:"childadded",child:null},zh={type:"childremoved",child:null};class Tn extends _s{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:VM++}),this.uuid=fl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Tn.DEFAULT_UP.clone();const t=new tt,i=new ms,s=new ps,l=new tt(1,1,1);function c(){s.setFromEuler(i,!1)}function h(){i.setFromQuaternion(s,void 0,!1)}i._onChange(c),s._onChange(h),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new on},normalMatrix:{value:new se}}),this.matrix=new on,this.matrixWorld=new on,this.matrixAutoUpdate=Tn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ix,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return Ur.setFromAxisAngle(t,i),this.quaternion.multiply(Ur),this}rotateOnWorldAxis(t,i){return Ur.setFromAxisAngle(t,i),this.quaternion.premultiply(Ur),this}rotateX(t){return this.rotateOnAxis(z_,t)}rotateY(t){return this.rotateOnAxis(H_,t)}rotateZ(t){return this.rotateOnAxis(G_,t)}translateOnAxis(t,i){return B_.copy(t).applyQuaternion(this.quaternion),this.position.add(B_.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(z_,t)}translateY(t){return this.translateOnAxis(H_,t)}translateZ(t){return this.translateOnAxis(G_,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ga.copy(this.matrixWorld).invert())}lookAt(t,i,s){t.isVector3?Rc.copy(t):Rc.set(t,i,s);const l=this.parent;this.updateWorldMatrix(!0,!1),Ko.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ga.lookAt(Ko,Rc,this.up):ga.lookAt(Rc,Ko,this.up),this.quaternion.setFromRotationMatrix(ga),l&&(ga.extractRotation(l.matrixWorld),Ur.setFromRotationMatrix(ga),this.quaternion.premultiply(Ur.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(Ae("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(V_),Lr.child=t,this.dispatchEvent(Lr),Lr.child=null):Ae("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(jM),zh.child=t,this.dispatchEvent(zh),zh.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ga.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ga.multiply(t.parent.matrixWorld)),t.applyMatrix4(ga),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(V_),Lr.child=t,this.dispatchEvent(Lr),Lr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let s=0,l=this.children.length;s<l;s++){const h=this.children[s].getObjectByProperty(t,i);if(h!==void 0)return h}}getObjectsByProperty(t,i,s=[]){this[t]===i&&s.push(this);const l=this.children;for(let c=0,h=l.length;c<h;c++)l[c].getObjectsByProperty(t,i,s);return s}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ko,t,kM),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ko,XM,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(t){t(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverseVisible(t)}traverseAncestors(t){const i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const i=t.x,s=t.y,l=t.z,c=this.matrix.elements;c[12]+=i-c[0]*i-c[4]*s-c[8]*l,c[13]+=s-c[1]*i-c[5]*s-c[9]*l,c[14]+=l-c[2]*i-c[6]*s-c[10]*l}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].updateMatrixWorld(t)}updateWorldMatrix(t,i){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let c=0,h=l.length;c<h;c++)l[c].updateWorldMatrix(!1,!0)}}toJSON(t){const i=t===void 0||typeof t=="string",s={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),this.static!==!1&&(l.static=this.static),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.pivot!==null&&(l.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(l.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(l.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(p=>({...p,boundingBox:p.boundingBox?p.boundingBox.toJSON():void 0,boundingSphere:p.boundingSphere?p.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(p=>({...p})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(t),l.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function c(p,m){return p[m.uuid]===void 0&&(p[m.uuid]=m.toJSON(t)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=c(t.geometries,this.geometry);const p=this.geometry.parameters;if(p!==void 0&&p.shapes!==void 0){const m=p.shapes;if(Array.isArray(m))for(let d=0,_=m.length;d<_;d++){const v=m[d];c(t.shapes,v)}else c(t.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(c(t.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const p=[];for(let m=0,d=this.material.length;m<d;m++)p.push(c(t.materials,this.material[m]));l.material=p}else l.material=c(t.materials,this.material);if(this.children.length>0){l.children=[];for(let p=0;p<this.children.length;p++)l.children.push(this.children[p].toJSON(t).object)}if(this.animations.length>0){l.animations=[];for(let p=0;p<this.animations.length;p++){const m=this.animations[p];l.animations.push(c(t.animations,m))}}if(i){const p=h(t.geometries),m=h(t.materials),d=h(t.textures),_=h(t.images),v=h(t.shapes),g=h(t.skeletons),M=h(t.animations),b=h(t.nodes);p.length>0&&(s.geometries=p),m.length>0&&(s.materials=m),d.length>0&&(s.textures=d),_.length>0&&(s.images=_),v.length>0&&(s.shapes=v),g.length>0&&(s.skeletons=g),M.length>0&&(s.animations=M),b.length>0&&(s.nodes=b)}return s.object=l,s;function h(p){const m=[];for(const d in p){const _=p[d];delete _.metadata,m.push(_)}return m}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let s=0;s<t.children.length;s++){const l=t.children[s];this.add(l.clone())}return this}}Tn.DEFAULT_UP=new tt(0,1,0);Tn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class al extends Tn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const WM={type:"move"};class Hh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new al,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new al,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new tt,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new tt),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new al,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new tt,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new tt,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const i=this._hand;if(i)for(const s of t.hand.values())this._getHandJoint(i,s)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,i,s){let l=null,c=null,h=null;const p=this._targetRay,m=this._grip,d=this._hand;if(t&&i.session.visibilityState!=="visible-blurred"){if(d&&t.hand){h=!0;for(const C of t.hand.values()){const S=i.getJointPose(C,s),y=this._getHandJoint(d,C);S!==null&&(y.matrix.fromArray(S.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=S.radius),y.visible=S!==null}const _=d.joints["index-finger-tip"],v=d.joints["thumb-tip"],g=_.position.distanceTo(v.position),M=.02,b=.005;d.inputState.pinching&&g>M+b?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!d.inputState.pinching&&g<=M-b&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else m!==null&&t.gripSpace&&(c=i.getPose(t.gripSpace,s),c!==null&&(m.matrix.fromArray(c.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,c.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(c.linearVelocity)):m.hasLinearVelocity=!1,c.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(c.angularVelocity)):m.hasAngularVelocity=!1,m.eventsEnabled&&m.dispatchEvent({type:"gripUpdated",data:t,target:this})));p!==null&&(l=i.getPose(t.targetRaySpace,s),l===null&&c!==null&&(l=c),l!==null&&(p.matrix.fromArray(l.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,l.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(l.linearVelocity)):p.hasLinearVelocity=!1,l.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(l.angularVelocity)):p.hasAngularVelocity=!1,this.dispatchEvent(WM)))}return p!==null&&(p.visible=l!==null),m!==null&&(m.visible=c!==null),d!==null&&(d.visible=h!==null),this}_getHandJoint(t,i){if(t.joints[i.jointName]===void 0){const s=new al;s.matrixAutoUpdate=!1,s.visible=!1,t.joints[i.jointName]=s,t.add(s)}return t.joints[i.jointName]}}const ax={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},as={h:0,s:0,l:0},Cc={h:0,s:0,l:0};function Gh(r,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?r+(t-r)*6*i:i<1/2?t:i<2/3?r+(t-r)*6*(2/3-i):r}class de{constructor(t,i,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,i,s)}set(t,i,s){if(i===void 0&&s===void 0){const l=t;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(t,i,s);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,i=Qn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Te.colorSpaceToWorking(this,i),this}setRGB(t,i,s,l=Te.workingColorSpace){return this.r=t,this.g=i,this.b=s,Te.colorSpaceToWorking(this,l),this}setHSL(t,i,s,l=Te.workingColorSpace){if(t=LM(t,1),i=ge(i,0,1),s=ge(s,0,1),i===0)this.r=this.g=this.b=s;else{const c=s<=.5?s*(1+i):s+i-s*i,h=2*s-c;this.r=Gh(h,c,t+1/3),this.g=Gh(h,c,t),this.b=Gh(h,c,t-1/3)}return Te.colorSpaceToWorking(this,l),this}setStyle(t,i=Qn){function s(c){c!==void 0&&parseFloat(c)<1&&$t("Color: Alpha component of "+t+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(t)){let c;const h=l[1],p=l[2];switch(h){case"rgb":case"rgba":if(c=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return s(c[4]),this.setRGB(Math.min(255,parseInt(c[1],10))/255,Math.min(255,parseInt(c[2],10))/255,Math.min(255,parseInt(c[3],10))/255,i);if(c=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return s(c[4]),this.setRGB(Math.min(100,parseInt(c[1],10))/100,Math.min(100,parseInt(c[2],10))/100,Math.min(100,parseInt(c[3],10))/100,i);break;case"hsl":case"hsla":if(c=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return s(c[4]),this.setHSL(parseFloat(c[1])/360,parseFloat(c[2])/100,parseFloat(c[3])/100,i);break;default:$t("Color: Unknown color model "+t)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(t)){const c=l[1],h=c.length;if(h===3)return this.setRGB(parseInt(c.charAt(0),16)/15,parseInt(c.charAt(1),16)/15,parseInt(c.charAt(2),16)/15,i);if(h===6)return this.setHex(parseInt(c,16),i);$t("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,i);return this}setColorName(t,i=Qn){const s=ax[t.toLowerCase()];return s!==void 0?this.setHex(s,i):$t("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ta(t.r),this.g=Ta(t.g),this.b=Ta(t.b),this}copyLinearToSRGB(t){return this.r=qr(t.r),this.g=qr(t.g),this.b=qr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Qn){return Te.workingToColorSpace(Fn.copy(this),t),Math.round(ge(Fn.r*255,0,255))*65536+Math.round(ge(Fn.g*255,0,255))*256+Math.round(ge(Fn.b*255,0,255))}getHexString(t=Qn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,i=Te.workingColorSpace){Te.workingToColorSpace(Fn.copy(this),i);const s=Fn.r,l=Fn.g,c=Fn.b,h=Math.max(s,l,c),p=Math.min(s,l,c);let m,d;const _=(p+h)/2;if(p===h)m=0,d=0;else{const v=h-p;switch(d=_<=.5?v/(h+p):v/(2-h-p),h){case s:m=(l-c)/v+(l<c?6:0);break;case l:m=(c-s)/v+2;break;case c:m=(s-l)/v+4;break}m/=6}return t.h=m,t.s=d,t.l=_,t}getRGB(t,i=Te.workingColorSpace){return Te.workingToColorSpace(Fn.copy(this),i),t.r=Fn.r,t.g=Fn.g,t.b=Fn.b,t}getStyle(t=Qn){Te.workingToColorSpace(Fn.copy(this),t);const i=Fn.r,s=Fn.g,l=Fn.b;return t!==Qn?`color(${t} ${i.toFixed(3)} ${s.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(s*255)},${Math.round(l*255)})`}offsetHSL(t,i,s){return this.getHSL(as),this.setHSL(as.h+t,as.s+i,as.l+s)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,i){return this.r=t.r+i.r,this.g=t.g+i.g,this.b=t.b+i.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,i){return this.r+=(t.r-this.r)*i,this.g+=(t.g-this.g)*i,this.b+=(t.b-this.b)*i,this}lerpColors(t,i,s){return this.r=t.r+(i.r-t.r)*s,this.g=t.g+(i.g-t.g)*s,this.b=t.b+(i.b-t.b)*s,this}lerpHSL(t,i){this.getHSL(as),t.getHSL(Cc);const s=Oh(as.h,Cc.h,i),l=Oh(as.s,Cc.s,i),c=Oh(as.l,Cc.l,i);return this.setHSL(s,l,c),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const i=this.r,s=this.g,l=this.b,c=t.elements;return this.r=c[0]*i+c[3]*s+c[6]*l,this.g=c[1]*i+c[4]*s+c[7]*l,this.b=c[2]*i+c[5]*s+c[8]*l,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,i=0){return this.r=t[i],this.g=t[i+1],this.b=t[i+2],this}toArray(t=[],i=0){return t[i]=this.r,t[i+1]=this.g,t[i+2]=this.b,t}fromBufferAttribute(t,i){return this.r=t.getX(i),this.g=t.getY(i),this.b=t.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fn=new de;de.NAMES=ax;class bp{constructor(t,i=1,s=1e3){this.isFog=!0,this.name="",this.color=new de(t),this.near=i,this.far=s}clone(){return new bp(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class qM extends Tn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ms,this.environmentIntensity=1,this.environmentRotation=new ms,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,i){return super.copy(t,i),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const i=super.toJSON(t);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}const Ni=new tt,_a=new tt,Vh=new tt,va=new tt,Nr=new tt,Or=new tt,k_=new tt,kh=new tt,Xh=new tt,jh=new tt,Wh=new rn,qh=new rn,Yh=new rn;class Ai{constructor(t=new tt,i=new tt,s=new tt){this.a=t,this.b=i,this.c=s}static getNormal(t,i,s,l){l.subVectors(s,i),Ni.subVectors(t,i),l.cross(Ni);const c=l.lengthSq();return c>0?l.multiplyScalar(1/Math.sqrt(c)):l.set(0,0,0)}static getBarycoord(t,i,s,l,c){Ni.subVectors(l,i),_a.subVectors(s,i),Vh.subVectors(t,i);const h=Ni.dot(Ni),p=Ni.dot(_a),m=Ni.dot(Vh),d=_a.dot(_a),_=_a.dot(Vh),v=h*d-p*p;if(v===0)return c.set(0,0,0),null;const g=1/v,M=(d*m-p*_)*g,b=(h*_-p*m)*g;return c.set(1-M-b,b,M)}static containsPoint(t,i,s,l){return this.getBarycoord(t,i,s,l,va)===null?!1:va.x>=0&&va.y>=0&&va.x+va.y<=1}static getInterpolation(t,i,s,l,c,h,p,m){return this.getBarycoord(t,i,s,l,va)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(c,va.x),m.addScaledVector(h,va.y),m.addScaledVector(p,va.z),m)}static getInterpolatedAttribute(t,i,s,l,c,h){return Wh.setScalar(0),qh.setScalar(0),Yh.setScalar(0),Wh.fromBufferAttribute(t,i),qh.fromBufferAttribute(t,s),Yh.fromBufferAttribute(t,l),h.setScalar(0),h.addScaledVector(Wh,c.x),h.addScaledVector(qh,c.y),h.addScaledVector(Yh,c.z),h}static isFrontFacing(t,i,s,l){return Ni.subVectors(s,i),_a.subVectors(t,i),Ni.cross(_a).dot(l)<0}set(t,i,s){return this.a.copy(t),this.b.copy(i),this.c.copy(s),this}setFromPointsAndIndices(t,i,s,l){return this.a.copy(t[i]),this.b.copy(t[s]),this.c.copy(t[l]),this}setFromAttributeAndIndices(t,i,s,l){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,s),this.c.fromBufferAttribute(t,l),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ni.subVectors(this.c,this.b),_a.subVectors(this.a,this.b),Ni.cross(_a).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ai.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return Ai.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,s,l,c){return Ai.getInterpolation(t,this.a,this.b,this.c,i,s,l,c)}containsPoint(t){return Ai.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ai.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){const s=this.a,l=this.b,c=this.c;let h,p;Nr.subVectors(l,s),Or.subVectors(c,s),kh.subVectors(t,s);const m=Nr.dot(kh),d=Or.dot(kh);if(m<=0&&d<=0)return i.copy(s);Xh.subVectors(t,l);const _=Nr.dot(Xh),v=Or.dot(Xh);if(_>=0&&v<=_)return i.copy(l);const g=m*v-_*d;if(g<=0&&m>=0&&_<=0)return h=m/(m-_),i.copy(s).addScaledVector(Nr,h);jh.subVectors(t,c);const M=Nr.dot(jh),b=Or.dot(jh);if(b>=0&&M<=b)return i.copy(c);const C=M*d-m*b;if(C<=0&&d>=0&&b<=0)return p=d/(d-b),i.copy(s).addScaledVector(Or,p);const S=_*b-M*v;if(S<=0&&v-_>=0&&M-b>=0)return k_.subVectors(c,l),p=(v-_)/(v-_+(M-b)),i.copy(l).addScaledVector(k_,p);const y=1/(S+C+g);return h=C*y,p=g*y,i.copy(s).addScaledVector(Nr,h).addScaledVector(Or,p)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class hl{constructor(t=new tt(1/0,1/0,1/0),i=new tt(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=i}set(t,i){return this.min.copy(t),this.max.copy(i),this}setFromArray(t){this.makeEmpty();for(let i=0,s=t.length;i<s;i+=3)this.expandByPoint(Oi.fromArray(t,i));return this}setFromBufferAttribute(t){this.makeEmpty();for(let i=0,s=t.count;i<s;i++)this.expandByPoint(Oi.fromBufferAttribute(t,i));return this}setFromPoints(t){this.makeEmpty();for(let i=0,s=t.length;i<s;i++)this.expandByPoint(t[i]);return this}setFromCenterAndSize(t,i){const s=Oi.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(s),this.max.copy(t).add(s),this}setFromObject(t,i=!1){return this.makeEmpty(),this.expandByObject(t,i)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,i=!1){t.updateWorldMatrix(!1,!1);const s=t.geometry;if(s!==void 0){const c=s.getAttribute("position");if(i===!0&&c!==void 0&&t.isInstancedMesh!==!0)for(let h=0,p=c.count;h<p;h++)t.isMesh===!0?t.getVertexPosition(h,Oi):Oi.fromBufferAttribute(c,h),Oi.applyMatrix4(t.matrixWorld),this.expandByPoint(Oi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),wc.copy(t.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),wc.copy(s.boundingBox)),wc.applyMatrix4(t.matrixWorld),this.union(wc)}const l=t.children;for(let c=0,h=l.length;c<h;c++)this.expandByObject(l[c],i);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,i){return i.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Oi),Oi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let i,s;return t.normal.x>0?(i=t.normal.x*this.min.x,s=t.normal.x*this.max.x):(i=t.normal.x*this.max.x,s=t.normal.x*this.min.x),t.normal.y>0?(i+=t.normal.y*this.min.y,s+=t.normal.y*this.max.y):(i+=t.normal.y*this.max.y,s+=t.normal.y*this.min.y),t.normal.z>0?(i+=t.normal.z*this.min.z,s+=t.normal.z*this.max.z):(i+=t.normal.z*this.max.z,s+=t.normal.z*this.min.z),i<=-t.constant&&s>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Qo),Dc.subVectors(this.max,Qo),Pr.subVectors(t.a,Qo),Ir.subVectors(t.b,Qo),Fr.subVectors(t.c,Qo),ss.subVectors(Ir,Pr),rs.subVectors(Fr,Ir),Fs.subVectors(Pr,Fr);let i=[0,-ss.z,ss.y,0,-rs.z,rs.y,0,-Fs.z,Fs.y,ss.z,0,-ss.x,rs.z,0,-rs.x,Fs.z,0,-Fs.x,-ss.y,ss.x,0,-rs.y,rs.x,0,-Fs.y,Fs.x,0];return!Zh(i,Pr,Ir,Fr,Dc)||(i=[1,0,0,0,1,0,0,0,1],!Zh(i,Pr,Ir,Fr,Dc))?!1:(Uc.crossVectors(ss,rs),i=[Uc.x,Uc.y,Uc.z],Zh(i,Pr,Ir,Fr,Dc))}clampPoint(t,i){return i.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Oi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Oi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(xa[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),xa[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),xa[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),xa[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),xa[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),xa[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),xa[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),xa[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(xa),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const xa=[new tt,new tt,new tt,new tt,new tt,new tt,new tt,new tt],Oi=new tt,wc=new hl,Pr=new tt,Ir=new tt,Fr=new tt,ss=new tt,rs=new tt,Fs=new tt,Qo=new tt,Dc=new tt,Uc=new tt,Bs=new tt;function Zh(r,t,i,s,l){for(let c=0,h=r.length-3;c<=h;c+=3){Bs.fromArray(r,c);const p=l.x*Math.abs(Bs.x)+l.y*Math.abs(Bs.y)+l.z*Math.abs(Bs.z),m=t.dot(Bs),d=i.dot(Bs),_=s.dot(Bs);if(Math.max(-Math.max(m,d,_),Math.min(m,d,_))>p)return!1}return!0}const _n=new tt,Lc=new re;let YM=0;class di extends _s{constructor(t,i,s=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:YM++}),this.name="",this.array=t,this.itemSize=i,this.count=t!==void 0?t.length/i:0,this.normalized=s,this.usage=w_,this.updateRanges=[],this.gpuType=Wi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,i,s){t*=this.itemSize,s*=i.itemSize;for(let l=0,c=this.itemSize;l<c;l++)this.array[t+l]=i.array[s+l];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let i=0,s=this.count;i<s;i++)Lc.fromBufferAttribute(this,i),Lc.applyMatrix3(t),this.setXY(i,Lc.x,Lc.y);else if(this.itemSize===3)for(let i=0,s=this.count;i<s;i++)_n.fromBufferAttribute(this,i),_n.applyMatrix3(t),this.setXYZ(i,_n.x,_n.y,_n.z);return this}applyMatrix4(t){for(let i=0,s=this.count;i<s;i++)_n.fromBufferAttribute(this,i),_n.applyMatrix4(t),this.setXYZ(i,_n.x,_n.y,_n.z);return this}applyNormalMatrix(t){for(let i=0,s=this.count;i<s;i++)_n.fromBufferAttribute(this,i),_n.applyNormalMatrix(t),this.setXYZ(i,_n.x,_n.y,_n.z);return this}transformDirection(t){for(let i=0,s=this.count;i<s;i++)_n.fromBufferAttribute(this,i),_n.transformDirection(t),this.setXYZ(i,_n.x,_n.y,_n.z);return this}set(t,i=0){return this.array.set(t,i),this}getComponent(t,i){let s=this.array[t*this.itemSize+i];return this.normalized&&(s=Zo(s,this.array)),s}setComponent(t,i,s){return this.normalized&&(s=Zn(s,this.array)),this.array[t*this.itemSize+i]=s,this}getX(t){let i=this.array[t*this.itemSize];return this.normalized&&(i=Zo(i,this.array)),i}setX(t,i){return this.normalized&&(i=Zn(i,this.array)),this.array[t*this.itemSize]=i,this}getY(t){let i=this.array[t*this.itemSize+1];return this.normalized&&(i=Zo(i,this.array)),i}setY(t,i){return this.normalized&&(i=Zn(i,this.array)),this.array[t*this.itemSize+1]=i,this}getZ(t){let i=this.array[t*this.itemSize+2];return this.normalized&&(i=Zo(i,this.array)),i}setZ(t,i){return this.normalized&&(i=Zn(i,this.array)),this.array[t*this.itemSize+2]=i,this}getW(t){let i=this.array[t*this.itemSize+3];return this.normalized&&(i=Zo(i,this.array)),i}setW(t,i){return this.normalized&&(i=Zn(i,this.array)),this.array[t*this.itemSize+3]=i,this}setXY(t,i,s){return t*=this.itemSize,this.normalized&&(i=Zn(i,this.array),s=Zn(s,this.array)),this.array[t+0]=i,this.array[t+1]=s,this}setXYZ(t,i,s,l){return t*=this.itemSize,this.normalized&&(i=Zn(i,this.array),s=Zn(s,this.array),l=Zn(l,this.array)),this.array[t+0]=i,this.array[t+1]=s,this.array[t+2]=l,this}setXYZW(t,i,s,l,c){return t*=this.itemSize,this.normalized&&(i=Zn(i,this.array),s=Zn(s,this.array),l=Zn(l,this.array),c=Zn(c,this.array)),this.array[t+0]=i,this.array[t+1]=s,this.array[t+2]=l,this.array[t+3]=c,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==w_&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class sx extends di{constructor(t,i,s){super(new Uint16Array(t),i,s)}}class rx extends di{constructor(t,i,s){super(new Uint32Array(t),i,s)}}class $n extends di{constructor(t,i,s){super(new Float32Array(t),i,s)}}const ZM=new hl,Jo=new tt,Kh=new tt;class vu{constructor(t=new tt,i=-1){this.isSphere=!0,this.center=t,this.radius=i}set(t,i){return this.center.copy(t),this.radius=i,this}setFromPoints(t,i){const s=this.center;i!==void 0?s.copy(i):ZM.setFromPoints(t).getCenter(s);let l=0;for(let c=0,h=t.length;c<h;c++)l=Math.max(l,s.distanceToSquared(t[c]));return this.radius=Math.sqrt(l),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const i=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=i*i}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,i){const s=this.center.distanceToSquared(t);return i.copy(t),s>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Jo.subVectors(t,this.center);const i=Jo.lengthSq();if(i>this.radius*this.radius){const s=Math.sqrt(i),l=(s-this.radius)*.5;this.center.addScaledVector(Jo,l/s),this.radius+=l}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Kh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Jo.copy(t.center).add(Kh)),this.expandByPoint(Jo.copy(t.center).sub(Kh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let KM=0;const bi=new on,Qh=new Tn,Br=new tt,fi=new hl,$o=new hl,bn=new tt;class pi extends _s{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:KM++}),this.uuid=fl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(CM(t)?rx:sx)(t,1):this.index=t,this}setIndirect(t,i=0){return this.indirect=t,this.indirectOffset=i,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,s=0){this.groups.push({start:t,count:i,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const c=new se().getNormalMatrix(t);s.applyNormalMatrix(c),s.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(t),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return bi.makeRotationFromQuaternion(t),this.applyMatrix4(bi),this}rotateX(t){return bi.makeRotationX(t),this.applyMatrix4(bi),this}rotateY(t){return bi.makeRotationY(t),this.applyMatrix4(bi),this}rotateZ(t){return bi.makeRotationZ(t),this.applyMatrix4(bi),this}translate(t,i,s){return bi.makeTranslation(t,i,s),this.applyMatrix4(bi),this}scale(t,i,s){return bi.makeScale(t,i,s),this.applyMatrix4(bi),this}lookAt(t){return Qh.lookAt(t),Qh.updateMatrix(),this.applyMatrix4(Qh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Br).negate(),this.translate(Br.x,Br.y,Br.z),this}setFromPoints(t){const i=this.getAttribute("position");if(i===void 0){const s=[];for(let l=0,c=t.length;l<c;l++){const h=t[l];s.push(h.x,h.y,h.z||0)}this.setAttribute("position",new $n(s,3))}else{const s=Math.min(t.length,i.count);for(let l=0;l<s;l++){const c=t[l];i.setXYZ(l,c.x,c.y,c.z||0)}t.length>i.count&&$t("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hl);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ae("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new tt(-1/0,-1/0,-1/0),new tt(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let s=0,l=i.length;s<l;s++){const c=i[s];fi.setFromBufferAttribute(c),this.morphTargetsRelative?(bn.addVectors(this.boundingBox.min,fi.min),this.boundingBox.expandByPoint(bn),bn.addVectors(this.boundingBox.max,fi.max),this.boundingBox.expandByPoint(bn)):(this.boundingBox.expandByPoint(fi.min),this.boundingBox.expandByPoint(fi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ae('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vu);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ae("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new tt,1/0);return}if(t){const s=this.boundingSphere.center;if(fi.setFromBufferAttribute(t),i)for(let c=0,h=i.length;c<h;c++){const p=i[c];$o.setFromBufferAttribute(p),this.morphTargetsRelative?(bn.addVectors(fi.min,$o.min),fi.expandByPoint(bn),bn.addVectors(fi.max,$o.max),fi.expandByPoint(bn)):(fi.expandByPoint($o.min),fi.expandByPoint($o.max))}fi.getCenter(s);let l=0;for(let c=0,h=t.count;c<h;c++)bn.fromBufferAttribute(t,c),l=Math.max(l,s.distanceToSquared(bn));if(i)for(let c=0,h=i.length;c<h;c++){const p=i[c],m=this.morphTargetsRelative;for(let d=0,_=p.count;d<_;d++)bn.fromBufferAttribute(p,d),m&&(Br.fromBufferAttribute(t,d),bn.add(Br)),l=Math.max(l,s.distanceToSquared(bn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&Ae('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){Ae("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=i.position,l=i.normal,c=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new di(new Float32Array(4*s.count),4));const h=this.getAttribute("tangent"),p=[],m=[];for(let T=0;T<s.count;T++)p[T]=new tt,m[T]=new tt;const d=new tt,_=new tt,v=new tt,g=new re,M=new re,b=new re,C=new tt,S=new tt;function y(T,F,q){d.fromBufferAttribute(s,T),_.fromBufferAttribute(s,F),v.fromBufferAttribute(s,q),g.fromBufferAttribute(c,T),M.fromBufferAttribute(c,F),b.fromBufferAttribute(c,q),_.sub(d),v.sub(d),M.sub(g),b.sub(g);const G=1/(M.x*b.y-b.x*M.y);isFinite(G)&&(C.copy(_).multiplyScalar(b.y).addScaledVector(v,-M.y).multiplyScalar(G),S.copy(v).multiplyScalar(M.x).addScaledVector(_,-b.x).multiplyScalar(G),p[T].add(C),p[F].add(C),p[q].add(C),m[T].add(S),m[F].add(S),m[q].add(S))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let T=0,F=w.length;T<F;++T){const q=w[T],G=q.start,$=q.count;for(let ut=G,ht=G+$;ut<ht;ut+=3)y(t.getX(ut+0),t.getX(ut+1),t.getX(ut+2))}const O=new tt,P=new tt,z=new tt,N=new tt;function B(T){z.fromBufferAttribute(l,T),N.copy(z);const F=p[T];O.copy(F),O.sub(z.multiplyScalar(z.dot(F))).normalize(),P.crossVectors(N,F);const G=P.dot(m[T])<0?-1:1;h.setXYZW(T,O.x,O.y,O.z,G)}for(let T=0,F=w.length;T<F;++T){const q=w[T],G=q.start,$=q.count;for(let ut=G,ht=G+$;ut<ht;ut+=3)B(t.getX(ut+0)),B(t.getX(ut+1)),B(t.getX(ut+2))}}computeVertexNormals(){const t=this.index,i=this.getAttribute("position");if(i!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new di(new Float32Array(i.count*3),3),this.setAttribute("normal",s);else for(let g=0,M=s.count;g<M;g++)s.setXYZ(g,0,0,0);const l=new tt,c=new tt,h=new tt,p=new tt,m=new tt,d=new tt,_=new tt,v=new tt;if(t)for(let g=0,M=t.count;g<M;g+=3){const b=t.getX(g+0),C=t.getX(g+1),S=t.getX(g+2);l.fromBufferAttribute(i,b),c.fromBufferAttribute(i,C),h.fromBufferAttribute(i,S),_.subVectors(h,c),v.subVectors(l,c),_.cross(v),p.fromBufferAttribute(s,b),m.fromBufferAttribute(s,C),d.fromBufferAttribute(s,S),p.add(_),m.add(_),d.add(_),s.setXYZ(b,p.x,p.y,p.z),s.setXYZ(C,m.x,m.y,m.z),s.setXYZ(S,d.x,d.y,d.z)}else for(let g=0,M=i.count;g<M;g+=3)l.fromBufferAttribute(i,g+0),c.fromBufferAttribute(i,g+1),h.fromBufferAttribute(i,g+2),_.subVectors(h,c),v.subVectors(l,c),_.cross(v),s.setXYZ(g+0,_.x,_.y,_.z),s.setXYZ(g+1,_.x,_.y,_.z),s.setXYZ(g+2,_.x,_.y,_.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let i=0,s=t.count;i<s;i++)bn.fromBufferAttribute(t,i),bn.normalize(),t.setXYZ(i,bn.x,bn.y,bn.z)}toNonIndexed(){function t(p,m){const d=p.array,_=p.itemSize,v=p.normalized,g=new d.constructor(m.length*_);let M=0,b=0;for(let C=0,S=m.length;C<S;C++){p.isInterleavedBufferAttribute?M=m[C]*p.data.stride+p.offset:M=m[C]*_;for(let y=0;y<_;y++)g[b++]=d[M++]}return new di(g,_,v)}if(this.index===null)return $t("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new pi,s=this.index.array,l=this.attributes;for(const p in l){const m=l[p],d=t(m,s);i.setAttribute(p,d)}const c=this.morphAttributes;for(const p in c){const m=[],d=c[p];for(let _=0,v=d.length;_<v;_++){const g=d[_],M=t(g,s);m.push(M)}i.morphAttributes[p]=m}i.morphTargetsRelative=this.morphTargetsRelative;const h=this.groups;for(let p=0,m=h.length;p<m;p++){const d=h[p];i.addGroup(d.start,d.count,d.materialIndex)}return i}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const d in m)m[d]!==void 0&&(t[d]=m[d]);return t}t.data={attributes:{}};const i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const s=this.attributes;for(const m in s){const d=s[m];t.data.attributes[m]=d.toJSON(t.data)}const l={};let c=!1;for(const m in this.morphAttributes){const d=this.morphAttributes[m],_=[];for(let v=0,g=d.length;v<g;v++){const M=d[v];_.push(M.toJSON(t.data))}_.length>0&&(l[m]=_,c=!0)}c&&(t.data.morphAttributes=l,t.data.morphTargetsRelative=this.morphTargetsRelative);const h=this.groups;h.length>0&&(t.data.groups=JSON.parse(JSON.stringify(h)));const p=this.boundingSphere;return p!==null&&(t.data.boundingSphere=p.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=t.name;const s=t.index;s!==null&&this.setIndex(s.clone());const l=t.attributes;for(const d in l){const _=l[d];this.setAttribute(d,_.clone(i))}const c=t.morphAttributes;for(const d in c){const _=[],v=c[d];for(let g=0,M=v.length;g<M;g++)_.push(v[g].clone(i));this.morphAttributes[d]=_}this.morphTargetsRelative=t.morphTargetsRelative;const h=t.groups;for(let d=0,_=h.length;d<_;d++){const v=h[d];this.addGroup(v.start,v.count,v.materialIndex)}const p=t.boundingBox;p!==null&&(this.boundingBox=p.clone());const m=t.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let QM=0;class Zs extends _s{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:QM++}),this.uuid=fl(),this.name="",this.type="Material",this.blending=Wr,this.side=ds,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_d,this.blendDst=vd,this.blendEquation=Gs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new de(0,0,0),this.blendAlpha=0,this.depthFunc=Yr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=C_,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Cr,this.stencilZFail=Cr,this.stencilZPass=Cr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const i in t){const s=t[i];if(s===void 0){$t(`Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){$t(`Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(s):l&&l.isVector3&&s&&s.isVector3?l.copy(s):this[i]=s}}toJSON(t){const i=t===void 0||typeof t=="string";i&&(t={textures:{},images:{}});const s={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(s.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(s.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(t).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(t).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(t).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(t).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(t).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Wr&&(s.blending=this.blending),this.side!==ds&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==_d&&(s.blendSrc=this.blendSrc),this.blendDst!==vd&&(s.blendDst=this.blendDst),this.blendEquation!==Gs&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==Yr&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==C_&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Cr&&(s.stencilFail=this.stencilFail),this.stencilZFail!==Cr&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==Cr&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.allowOverride===!1&&(s.allowOverride=!1),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function l(c){const h=[];for(const p in c){const m=c[p];delete m.metadata,h.push(m)}return h}if(i){const c=l(t.textures),h=l(t.images);c.length>0&&(s.textures=c),h.length>0&&(s.images=h)}return s}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const i=t.clippingPlanes;let s=null;if(i!==null){const l=i.length;s=new Array(l);for(let c=0;c!==l;++c)s[c]=i[c].clone()}return this.clippingPlanes=s,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const Sa=new tt,Jh=new tt,Nc=new tt,os=new tt,$h=new tt,Oc=new tt,td=new tt;class Tp{constructor(t=new tt,i=new tt(0,0,-1)){this.origin=t,this.direction=i}set(t,i){return this.origin.copy(t),this.direction.copy(i),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,i){return i.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Sa)),this}closestPointToPoint(t,i){i.subVectors(t,this.origin);const s=i.dot(this.direction);return s<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const i=Sa.subVectors(t,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(t):(Sa.copy(this.origin).addScaledVector(this.direction,i),Sa.distanceToSquared(t))}distanceSqToSegment(t,i,s,l){Jh.copy(t).add(i).multiplyScalar(.5),Nc.copy(i).sub(t).normalize(),os.copy(this.origin).sub(Jh);const c=t.distanceTo(i)*.5,h=-this.direction.dot(Nc),p=os.dot(this.direction),m=-os.dot(Nc),d=os.lengthSq(),_=Math.abs(1-h*h);let v,g,M,b;if(_>0)if(v=h*m-p,g=h*p-m,b=c*_,v>=0)if(g>=-b)if(g<=b){const C=1/_;v*=C,g*=C,M=v*(v+h*g+2*p)+g*(h*v+g+2*m)+d}else g=c,v=Math.max(0,-(h*g+p)),M=-v*v+g*(g+2*m)+d;else g=-c,v=Math.max(0,-(h*g+p)),M=-v*v+g*(g+2*m)+d;else g<=-b?(v=Math.max(0,-(-h*c+p)),g=v>0?-c:Math.min(Math.max(-c,-m),c),M=-v*v+g*(g+2*m)+d):g<=b?(v=0,g=Math.min(Math.max(-c,-m),c),M=g*(g+2*m)+d):(v=Math.max(0,-(h*c+p)),g=v>0?c:Math.min(Math.max(-c,-m),c),M=-v*v+g*(g+2*m)+d);else g=h>0?-c:c,v=Math.max(0,-(h*g+p)),M=-v*v+g*(g+2*m)+d;return s&&s.copy(this.origin).addScaledVector(this.direction,v),l&&l.copy(Jh).addScaledVector(Nc,g),M}intersectSphere(t,i){Sa.subVectors(t.center,this.origin);const s=Sa.dot(this.direction),l=Sa.dot(Sa)-s*s,c=t.radius*t.radius;if(l>c)return null;const h=Math.sqrt(c-l),p=s-h,m=s+h;return m<0?null:p<0?this.at(m,i):this.at(p,i)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const i=t.normal.dot(this.direction);if(i===0)return t.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(t.normal)+t.constant)/i;return s>=0?s:null}intersectPlane(t,i){const s=this.distanceToPlane(t);return s===null?null:this.at(s,i)}intersectsPlane(t){const i=t.distanceToPoint(this.origin);return i===0||t.normal.dot(this.direction)*i<0}intersectBox(t,i){let s,l,c,h,p,m;const d=1/this.direction.x,_=1/this.direction.y,v=1/this.direction.z,g=this.origin;return d>=0?(s=(t.min.x-g.x)*d,l=(t.max.x-g.x)*d):(s=(t.max.x-g.x)*d,l=(t.min.x-g.x)*d),_>=0?(c=(t.min.y-g.y)*_,h=(t.max.y-g.y)*_):(c=(t.max.y-g.y)*_,h=(t.min.y-g.y)*_),s>h||c>l||((c>s||isNaN(s))&&(s=c),(h<l||isNaN(l))&&(l=h),v>=0?(p=(t.min.z-g.z)*v,m=(t.max.z-g.z)*v):(p=(t.max.z-g.z)*v,m=(t.min.z-g.z)*v),s>m||p>l)||((p>s||s!==s)&&(s=p),(m<l||l!==l)&&(l=m),l<0)?null:this.at(s>=0?s:l,i)}intersectsBox(t){return this.intersectBox(t,Sa)!==null}intersectTriangle(t,i,s,l,c){$h.subVectors(i,t),Oc.subVectors(s,t),td.crossVectors($h,Oc);let h=this.direction.dot(td),p;if(h>0){if(l)return null;p=1}else if(h<0)p=-1,h=-h;else return null;os.subVectors(this.origin,t);const m=p*this.direction.dot(Oc.crossVectors(os,Oc));if(m<0)return null;const d=p*this.direction.dot($h.cross(os));if(d<0||m+d>h)return null;const _=-p*os.dot(td);return _<0?null:this.at(_/h,c)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ox extends Zs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new de(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ms,this.combine=Hv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const X_=new on,zs=new Tp,Pc=new vu,j_=new tt,Ic=new tt,Fc=new tt,Bc=new tt,ed=new tt,zc=new tt,W_=new tt,Hc=new tt;class Fi extends Tn{constructor(t=new pi,i=new ox){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,h=l.length;c<h;c++){const p=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[p]=c}}}}getVertexPosition(t,i){const s=this.geometry,l=s.attributes.position,c=s.morphAttributes.position,h=s.morphTargetsRelative;i.fromBufferAttribute(l,t);const p=this.morphTargetInfluences;if(c&&p){zc.set(0,0,0);for(let m=0,d=c.length;m<d;m++){const _=p[m],v=c[m];_!==0&&(ed.fromBufferAttribute(v,t),h?zc.addScaledVector(ed,_):zc.addScaledVector(ed.sub(i),_))}i.add(zc)}return i}raycast(t,i){const s=this.geometry,l=this.material,c=this.matrixWorld;l!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Pc.copy(s.boundingSphere),Pc.applyMatrix4(c),zs.copy(t.ray).recast(t.near),!(Pc.containsPoint(zs.origin)===!1&&(zs.intersectSphere(Pc,j_)===null||zs.origin.distanceToSquared(j_)>(t.far-t.near)**2))&&(X_.copy(c).invert(),zs.copy(t.ray).applyMatrix4(X_),!(s.boundingBox!==null&&zs.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(t,i,zs)))}_computeIntersections(t,i,s){let l;const c=this.geometry,h=this.material,p=c.index,m=c.attributes.position,d=c.attributes.uv,_=c.attributes.uv1,v=c.attributes.normal,g=c.groups,M=c.drawRange;if(p!==null)if(Array.isArray(h))for(let b=0,C=g.length;b<C;b++){const S=g[b],y=h[S.materialIndex],w=Math.max(S.start,M.start),O=Math.min(p.count,Math.min(S.start+S.count,M.start+M.count));for(let P=w,z=O;P<z;P+=3){const N=p.getX(P),B=p.getX(P+1),T=p.getX(P+2);l=Gc(this,y,t,s,d,_,v,N,B,T),l&&(l.faceIndex=Math.floor(P/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const b=Math.max(0,M.start),C=Math.min(p.count,M.start+M.count);for(let S=b,y=C;S<y;S+=3){const w=p.getX(S),O=p.getX(S+1),P=p.getX(S+2);l=Gc(this,h,t,s,d,_,v,w,O,P),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(h))for(let b=0,C=g.length;b<C;b++){const S=g[b],y=h[S.materialIndex],w=Math.max(S.start,M.start),O=Math.min(m.count,Math.min(S.start+S.count,M.start+M.count));for(let P=w,z=O;P<z;P+=3){const N=P,B=P+1,T=P+2;l=Gc(this,y,t,s,d,_,v,N,B,T),l&&(l.faceIndex=Math.floor(P/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const b=Math.max(0,M.start),C=Math.min(m.count,M.start+M.count);for(let S=b,y=C;S<y;S+=3){const w=S,O=S+1,P=S+2;l=Gc(this,h,t,s,d,_,v,w,O,P),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}}}function JM(r,t,i,s,l,c,h,p){let m;if(t.side===Jn?m=s.intersectTriangle(h,c,l,!0,p):m=s.intersectTriangle(l,c,h,t.side===ds,p),m===null)return null;Hc.copy(p),Hc.applyMatrix4(r.matrixWorld);const d=i.ray.origin.distanceTo(Hc);return d<i.near||d>i.far?null:{distance:d,point:Hc.clone(),object:r}}function Gc(r,t,i,s,l,c,h,p,m,d){r.getVertexPosition(p,Ic),r.getVertexPosition(m,Fc),r.getVertexPosition(d,Bc);const _=JM(r,t,i,s,Ic,Fc,Bc,W_);if(_){const v=new tt;Ai.getBarycoord(W_,Ic,Fc,Bc,v),l&&(_.uv=Ai.getInterpolatedAttribute(l,p,m,d,v,new re)),c&&(_.uv1=Ai.getInterpolatedAttribute(c,p,m,d,v,new re)),h&&(_.normal=Ai.getInterpolatedAttribute(h,p,m,d,v,new tt),_.normal.dot(s.direction)>0&&_.normal.multiplyScalar(-1));const g={a:p,b:m,c:d,normal:new tt,materialIndex:0};Ai.getNormal(Ic,Fc,Bc,g.normal),_.face=g,_.barycoord=v}return _}class $M extends Vn{constructor(t=null,i=1,s=1,l,c,h,p,m,d=Ln,_=Ln,v,g){super(null,h,p,m,d,_,l,c,v,g),this.isDataTexture=!0,this.image={data:t,width:i,height:s},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const nd=new tt,tE=new tt,eE=new se;class cs{constructor(t=new tt(1,0,0),i=0){this.isPlane=!0,this.normal=t,this.constant=i}set(t,i){return this.normal.copy(t),this.constant=i,this}setComponents(t,i,s,l){return this.normal.set(t,i,s),this.constant=l,this}setFromNormalAndCoplanarPoint(t,i){return this.normal.copy(t),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(t,i,s){const l=nd.subVectors(s,i).cross(tE.subVectors(t,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,i){return i.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,i,s=!0){const l=t.delta(nd),c=this.normal.dot(l);if(c===0)return this.distanceToPoint(t.start)===0?i.copy(t.start):null;const h=-(t.start.dot(this.normal)+this.constant)/c;return s===!0&&(h<0||h>1)?null:i.copy(t.start).addScaledVector(l,h)}intersectsLine(t){const i=this.distanceToPoint(t.start),s=this.distanceToPoint(t.end);return i<0&&s>0||s<0&&i>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,i){const s=i||eE.getNormalMatrix(t),l=this.coplanarPoint(nd).applyMatrix4(t),c=this.normal.applyMatrix3(s).normalize();return this.constant=-l.dot(c),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Hs=new vu,nE=new re(.5,.5),Vc=new tt;class Ap{constructor(t=new cs,i=new cs,s=new cs,l=new cs,c=new cs,h=new cs){this.planes=[t,i,s,l,c,h]}set(t,i,s,l,c,h){const p=this.planes;return p[0].copy(t),p[1].copy(i),p[2].copy(s),p[3].copy(l),p[4].copy(c),p[5].copy(h),this}copy(t){const i=this.planes;for(let s=0;s<6;s++)i[s].copy(t.planes[s]);return this}setFromProjectionMatrix(t,i=qi,s=!1){const l=this.planes,c=t.elements,h=c[0],p=c[1],m=c[2],d=c[3],_=c[4],v=c[5],g=c[6],M=c[7],b=c[8],C=c[9],S=c[10],y=c[11],w=c[12],O=c[13],P=c[14],z=c[15];if(l[0].setComponents(d-h,M-_,y-b,z-w).normalize(),l[1].setComponents(d+h,M+_,y+b,z+w).normalize(),l[2].setComponents(d+p,M+v,y+C,z+O).normalize(),l[3].setComponents(d-p,M-v,y-C,z-O).normalize(),s)l[4].setComponents(m,g,S,P).normalize(),l[5].setComponents(d-m,M-g,y-S,z-P).normalize();else if(l[4].setComponents(d-m,M-g,y-S,z-P).normalize(),i===qi)l[5].setComponents(d+m,M+g,y+S,z+P).normalize();else if(i===ul)l[5].setComponents(m,g,S,P).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Hs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const i=t.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),Hs.copy(i.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Hs)}intersectsSprite(t){Hs.center.set(0,0,0);const i=nE.distanceTo(t.center);return Hs.radius=.7071067811865476+i,Hs.applyMatrix4(t.matrixWorld),this.intersectsSphere(Hs)}intersectsSphere(t){const i=this.planes,s=t.center,l=-t.radius;for(let c=0;c<6;c++)if(i[c].distanceToPoint(s)<l)return!1;return!0}intersectsBox(t){const i=this.planes;for(let s=0;s<6;s++){const l=i[s];if(Vc.x=l.normal.x>0?t.max.x:t.min.x,Vc.y=l.normal.y>0?t.max.y:t.min.y,Vc.z=l.normal.z>0?t.max.z:t.min.z,l.distanceToPoint(Vc)<0)return!1}return!0}containsPoint(t){const i=this.planes;for(let s=0;s<6;s++)if(i[s].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class lx extends Zs{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new de(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const hu=new tt,du=new tt,q_=new on,tl=new Tp,kc=new vu,id=new tt,Y_=new tt;class iE extends Tn{constructor(t=new pi,i=new lx){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const i=t.attributes.position,s=[0];for(let l=1,c=i.count;l<c;l++)hu.fromBufferAttribute(i,l-1),du.fromBufferAttribute(i,l),s[l]=s[l-1],s[l]+=hu.distanceTo(du);t.setAttribute("lineDistance",new $n(s,1))}else $t("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,i){const s=this.geometry,l=this.matrixWorld,c=t.params.Line.threshold,h=s.drawRange;if(s.boundingSphere===null&&s.computeBoundingSphere(),kc.copy(s.boundingSphere),kc.applyMatrix4(l),kc.radius+=c,t.ray.intersectsSphere(kc)===!1)return;q_.copy(l).invert(),tl.copy(t.ray).applyMatrix4(q_);const p=c/((this.scale.x+this.scale.y+this.scale.z)/3),m=p*p,d=this.isLineSegments?2:1,_=s.index,g=s.attributes.position;if(_!==null){const M=Math.max(0,h.start),b=Math.min(_.count,h.start+h.count);for(let C=M,S=b-1;C<S;C+=d){const y=_.getX(C),w=_.getX(C+1),O=Xc(this,t,tl,m,y,w,C);O&&i.push(O)}if(this.isLineLoop){const C=_.getX(b-1),S=_.getX(M),y=Xc(this,t,tl,m,C,S,b-1);y&&i.push(y)}}else{const M=Math.max(0,h.start),b=Math.min(g.count,h.start+h.count);for(let C=M,S=b-1;C<S;C+=d){const y=Xc(this,t,tl,m,C,C+1,C);y&&i.push(y)}if(this.isLineLoop){const C=Xc(this,t,tl,m,b-1,M,b-1);C&&i.push(C)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,h=l.length;c<h;c++){const p=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[p]=c}}}}}function Xc(r,t,i,s,l,c,h){const p=r.geometry.attributes.position;if(hu.fromBufferAttribute(p,l),du.fromBufferAttribute(p,c),i.distanceSqToSegment(hu,du,id,Y_)>s)return;id.applyMatrix4(r.matrixWorld);const d=t.ray.origin.distanceTo(id);if(!(d<t.near||d>t.far))return{distance:d,point:Y_.clone().applyMatrix4(r.matrixWorld),index:h,face:null,faceIndex:null,barycoord:null,object:r}}const Z_=new tt,K_=new tt;class aE extends iE{constructor(t,i){super(t,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const i=t.attributes.position,s=[];for(let l=0,c=i.count;l<c;l+=2)Z_.fromBufferAttribute(i,l),K_.fromBufferAttribute(i,l+1),s[l]=l===0?0:s[l-1],s[l+1]=s[l]+Z_.distanceTo(K_);t.setAttribute("lineDistance",new $n(s,1))}else $t("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class cx extends Vn{constructor(t=[],i=Ws,s,l,c,h,p,m,d,_){super(t,i,s,l,c,h,p,m,d,_),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Kr extends Vn{constructor(t,i,s=Ki,l,c,h,p=Ln,m=Ln,d,_=Ra,v=1){if(_!==Ra&&_!==Xs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const g={width:t,height:i,depth:v};super(g,l,c,h,p,m,_,s,d),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ep(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const i=super.toJSON(t);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class sE extends Kr{constructor(t,i=Ki,s=Ws,l,c,h=Ln,p=Ln,m,d=Ra){const _={width:t,height:t,depth:1},v=[_,_,_,_,_,_];super(t,t,i,s,l,c,h,p,m,d),this.image=v,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class ux extends Vn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class dl extends pi{constructor(t=1,i=1,s=1,l=1,c=1,h=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:s,widthSegments:l,heightSegments:c,depthSegments:h};const p=this;l=Math.floor(l),c=Math.floor(c),h=Math.floor(h);const m=[],d=[],_=[],v=[];let g=0,M=0;b("z","y","x",-1,-1,s,i,t,h,c,0),b("z","y","x",1,-1,s,i,-t,h,c,1),b("x","z","y",1,1,t,s,i,l,h,2),b("x","z","y",1,-1,t,s,-i,l,h,3),b("x","y","z",1,-1,t,i,s,l,c,4),b("x","y","z",-1,-1,t,i,-s,l,c,5),this.setIndex(m),this.setAttribute("position",new $n(d,3)),this.setAttribute("normal",new $n(_,3)),this.setAttribute("uv",new $n(v,2));function b(C,S,y,w,O,P,z,N,B,T,F){const q=P/B,G=z/T,$=P/2,ut=z/2,ht=N/2,j=B+1,L=T+1;let H=0,et=0;const gt=new tt;for(let yt=0;yt<L;yt++){const I=yt*G-ut;for(let Q=0;Q<j;Q++){const St=Q*q-$;gt[C]=St*w,gt[S]=I*O,gt[y]=ht,d.push(gt.x,gt.y,gt.z),gt[C]=0,gt[S]=0,gt[y]=N>0?1:-1,_.push(gt.x,gt.y,gt.z),v.push(Q/B),v.push(1-yt/T),H+=1}}for(let yt=0;yt<T;yt++)for(let I=0;I<B;I++){const Q=g+I+j*yt,St=g+I+j*(yt+1),bt=g+(I+1)+j*(yt+1),K=g+(I+1)+j*yt;m.push(Q,St,K),m.push(St,bt,K),et+=6}p.addGroup(M,et,F),M+=et,g+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dl(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}const jc=new tt,Wc=new tt,ad=new tt,qc=new Ai;class rE extends pi{constructor(t=null,i=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:i},t!==null){const l=Math.pow(10,4),c=Math.cos(rl*i),h=t.getIndex(),p=t.getAttribute("position"),m=h?h.count:p.count,d=[0,0,0],_=["a","b","c"],v=new Array(3),g={},M=[];for(let b=0;b<m;b+=3){h?(d[0]=h.getX(b),d[1]=h.getX(b+1),d[2]=h.getX(b+2)):(d[0]=b,d[1]=b+1,d[2]=b+2);const{a:C,b:S,c:y}=qc;if(C.fromBufferAttribute(p,d[0]),S.fromBufferAttribute(p,d[1]),y.fromBufferAttribute(p,d[2]),qc.getNormal(ad),v[0]=`${Math.round(C.x*l)},${Math.round(C.y*l)},${Math.round(C.z*l)}`,v[1]=`${Math.round(S.x*l)},${Math.round(S.y*l)},${Math.round(S.z*l)}`,v[2]=`${Math.round(y.x*l)},${Math.round(y.y*l)},${Math.round(y.z*l)}`,!(v[0]===v[1]||v[1]===v[2]||v[2]===v[0]))for(let w=0;w<3;w++){const O=(w+1)%3,P=v[w],z=v[O],N=qc[_[w]],B=qc[_[O]],T=`${P}_${z}`,F=`${z}_${P}`;F in g&&g[F]?(ad.dot(g[F].normal)<=c&&(M.push(N.x,N.y,N.z),M.push(B.x,B.y,B.z)),g[F]=null):T in g||(g[T]={index0:d[w],index1:d[O],normal:ad.clone()})}}for(const b in g)if(g[b]){const{index0:C,index1:S}=g[b];jc.fromBufferAttribute(p,C),Wc.fromBufferAttribute(p,S),M.push(jc.x,jc.y,jc.z),M.push(Wc.x,Wc.y,Wc.z)}this.setAttribute("position",new $n(M,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class pl extends pi{constructor(t=1,i=1,s=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:s,heightSegments:l};const c=t/2,h=i/2,p=Math.floor(s),m=Math.floor(l),d=p+1,_=m+1,v=t/p,g=i/m,M=[],b=[],C=[],S=[];for(let y=0;y<_;y++){const w=y*g-h;for(let O=0;O<d;O++){const P=O*v-c;b.push(P,-w,0),C.push(0,0,1),S.push(O/p),S.push(1-y/m)}}for(let y=0;y<m;y++)for(let w=0;w<p;w++){const O=w+d*y,P=w+d*(y+1),z=w+1+d*(y+1),N=w+1+d*y;M.push(O,P,N),M.push(P,z,N)}this.setIndex(M),this.setAttribute("position",new $n(b,3)),this.setAttribute("normal",new $n(C,3)),this.setAttribute("uv",new $n(S,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pl(t.width,t.height,t.widthSegments,t.heightSegments)}}class oE extends Zs{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new de(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}}function Qr(r){const t={};for(const i in r){t[i]={};for(const s in r[i]){const l=r[i][s];if(Q_(l))l.isRenderTargetTexture?($t("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][s]=null):t[i][s]=l.clone();else if(Array.isArray(l))if(Q_(l[0])){const c=[];for(let h=0,p=l.length;h<p;h++)c[h]=l[h].clone();t[i][s]=c}else t[i][s]=l.slice();else t[i][s]=l}}return t}function Hn(r){const t={};for(let i=0;i<r.length;i++){const s=Qr(r[i]);for(const l in s)t[l]=s[l]}return t}function Q_(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function lE(r){const t=[];for(let i=0;i<r.length;i++)t.push(r[i].clone());return t}function fx(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Te.workingColorSpace}const cE={clone:Qr,merge:Hn};var uE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Qi extends Zs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=uE,this.fragmentShader=fE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Qr(t.uniforms),this.uniformsGroups=lE(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const i=super.toJSON(t);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const h=this.uniforms[l].value;h&&h.isTexture?i.uniforms[l]={type:"t",value:h.toJSON(t).uuid}:h&&h.isColor?i.uniforms[l]={type:"c",value:h.getHex()}:h&&h.isVector2?i.uniforms[l]={type:"v2",value:h.toArray()}:h&&h.isVector3?i.uniforms[l]={type:"v3",value:h.toArray()}:h&&h.isVector4?i.uniforms[l]={type:"v4",value:h.toArray()}:h&&h.isMatrix3?i.uniforms[l]={type:"m3",value:h.toArray()}:h&&h.isMatrix4?i.uniforms[l]={type:"m4",value:h.toArray()}:i.uniforms[l]={value:h}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const s={};for(const l in this.extensions)this.extensions[l]===!0&&(s[l]=!0);return Object.keys(s).length>0&&(i.extensions=s),i}}class hE extends Qi{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class dE extends Zs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new de(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new de(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ap,this.normalScale=new re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ms,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class pE extends dE{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new re(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ge(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(i){this.ior=(1+.4*i)/(1-.4*i)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new de(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new de(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new de(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class mE extends Zs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=SM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class gE extends Zs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const J_={enabled:!1,files:{},add:function(r,t){this.enabled!==!1&&($_(r)||(this.files[r]=t))},get:function(r){if(this.enabled!==!1&&!$_(r))return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};function $_(r){try{const t=r.slice(r.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}class _E{constructor(t,i,s){const l=this;let c=!1,h=0,p=0,m;const d=[];this.onStart=void 0,this.onLoad=t,this.onProgress=i,this.onError=s,this._abortController=null,this.itemStart=function(_){p++,c===!1&&l.onStart!==void 0&&l.onStart(_,h,p),c=!0},this.itemEnd=function(_){h++,l.onProgress!==void 0&&l.onProgress(_,h,p),h===p&&(c=!1,l.onLoad!==void 0&&l.onLoad())},this.itemError=function(_){l.onError!==void 0&&l.onError(_)},this.resolveURL=function(_){return m?m(_):_},this.setURLModifier=function(_){return m=_,this},this.addHandler=function(_,v){return d.push(_,v),this},this.removeHandler=function(_){const v=d.indexOf(_);return v!==-1&&d.splice(v,2),this},this.getHandler=function(_){for(let v=0,g=d.length;v<g;v+=2){const M=d[v],b=d[v+1];if(M.global&&(M.lastIndex=0),M.test(_))return b}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const vE=new _E;class Rp{constructor(t){this.manager=t!==void 0?t:vE,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,i){const s=this;return new Promise(function(l,c){s.load(t,l,i,c)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}Rp.DEFAULT_MATERIAL_NAME="__DEFAULT";const ya={};class xE extends Error{constructor(t,i){super(t),this.response=i}}class SE extends Rp{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,i,s,l){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const c=J_.get(`file:${t}`);if(c!==void 0){this.manager.itemStart(t),setTimeout(()=>{i&&i(c),this.manager.itemEnd(t)},0);return}if(ya[t]!==void 0){ya[t].push({onLoad:i,onProgress:s,onError:l});return}ya[t]=[],ya[t].push({onLoad:i,onProgress:s,onError:l});const h=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),p=this.mimeType,m=this.responseType;fetch(h).then(d=>{if(d.status===200||d.status===0){if(d.status===0&&$t("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||d.body===void 0||d.body.getReader===void 0)return d;const _=ya[t],v=d.body.getReader(),g=d.headers.get("X-File-Size")||d.headers.get("Content-Length"),M=g?parseInt(g):0,b=M!==0;let C=0;const S=new ReadableStream({start(y){w();function w(){v.read().then(({done:O,value:P})=>{if(O)y.close();else{C+=P.byteLength;const z=new ProgressEvent("progress",{lengthComputable:b,loaded:C,total:M});for(let N=0,B=_.length;N<B;N++){const T=_[N];T.onProgress&&T.onProgress(z)}y.enqueue(P),w()}},O=>{y.error(O)})}}});return new Response(S)}else throw new xE(`fetch for "${d.url}" responded with ${d.status}: ${d.statusText}`,d)}).then(d=>{switch(m){case"arraybuffer":return d.arrayBuffer();case"blob":return d.blob();case"document":return d.text().then(_=>new DOMParser().parseFromString(_,p));case"json":return d.json();default:if(p==="")return d.text();{const v=/charset="?([^;"\s]*)"?/i.exec(p),g=v&&v[1]?v[1].toLowerCase():void 0,M=new TextDecoder(g);return d.arrayBuffer().then(b=>M.decode(b))}}}).then(d=>{J_.add(`file:${t}`,d);const _=ya[t];delete ya[t];for(let v=0,g=_.length;v<g;v++){const M=_[v];M.onLoad&&M.onLoad(d)}}).catch(d=>{const _=ya[t];if(_===void 0)throw this.manager.itemError(t),d;delete ya[t];for(let v=0,g=_.length;v<g;v++){const M=_[v];M.onError&&M.onError(d)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class hx extends Tn{constructor(t,i=1){super(),this.isLight=!0,this.type="Light",this.color=new de(t),this.intensity=i}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,i){return super.copy(t,i),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const i=super.toJSON(t);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,i}}class yE extends hx{constructor(t,i,s){super(t,s),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Tn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new de(i)}copy(t,i){return super.copy(t,i),this.groundColor.copy(t.groundColor),this}toJSON(t){const i=super.toJSON(t);return i.object.groundColor=this.groundColor.getHex(),i}}const sd=new on,tv=new tt,ev=new tt;class ME{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new re(512,512),this.mapType=hi,this.map=null,this.mapPass=null,this.matrix=new on,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ap,this._frameExtents=new re(1,1),this._viewportCount=1,this._viewports=[new rn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const i=this.camera,s=this.matrix;tv.setFromMatrixPosition(t.matrixWorld),i.position.copy(tv),ev.setFromMatrixPosition(t.target.matrixWorld),i.lookAt(ev),i.updateMatrixWorld(),sd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sd,i.coordinateSystem,i.reversedDepth),i.coordinateSystem===ul||i.reversedDepth?s.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(sd)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Yc=new tt,Zc=new ps,ki=new tt;class dx extends Tn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new on,this.projectionMatrix=new on,this.projectionMatrixInverse=new on,this.coordinateSystem=qi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,i){return super.copy(t,i),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Yc,Zc,ki),ki.x===1&&ki.y===1&&ki.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Yc,Zc,ki.set(1,1,1)).invert()}updateWorldMatrix(t,i){super.updateWorldMatrix(t,i),this.matrixWorld.decompose(Yc,Zc,ki),ki.x===1&&ki.y===1&&ki.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Yc,Zc,ki.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ls=new tt,nv=new re,iv=new re;class Ti extends dx{constructor(t=50,i=1,s=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=s,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const i=.5*this.getFilmHeight()/t;this.fov=rp*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(rl*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return rp*2*Math.atan(Math.tan(rl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,i,s){ls.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ls.x,ls.y).multiplyScalar(-t/ls.z),ls.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(ls.x,ls.y).multiplyScalar(-t/ls.z)}getViewSize(t,i){return this.getViewBounds(t,nv,iv),i.subVectors(iv,nv)}setViewOffset(t,i,s,l,c,h){this.aspect=t/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let i=t*Math.tan(rl*.5*this.fov)/this.zoom,s=2*i,l=this.aspect*s,c=-.5*l;const h=this.view;if(this.view!==null&&this.view.enabled){const m=h.fullWidth,d=h.fullHeight;c+=h.offsetX*l/m,i-=h.offsetY*s/d,l*=h.width/m,s*=h.height/d}const p=this.filmOffset;p!==0&&(c+=t*p/this.getFilmWidth()),this.projectionMatrix.makePerspective(c,c+l,i,i-s,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}class Cp extends dx{constructor(t=-1,i=1,s=1,l=-1,c=.1,h=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=i,this.top=s,this.bottom=l,this.near=c,this.far=h,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,i,s,l,c,h){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let c=s-t,h=s+t,p=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const d=(this.right-this.left)/this.view.fullWidth/this.zoom,_=(this.top-this.bottom)/this.view.fullHeight/this.zoom;c+=d*this.view.offsetX,h=c+d*this.view.width,p-=_*this.view.offsetY,m=p-_*this.view.height}this.projectionMatrix.makeOrthographic(c,h,p,m,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class EE extends ME{constructor(){super(new Cp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class rd extends hx{constructor(t,i){super(t,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Tn.DEFAULT_UP),this.updateMatrix(),this.target=new Tn,this.shadow=new EE}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const i=super.toJSON(t);return i.object.shadow=this.shadow.toJSON(),i.object.target=this.target.uuid,i}}const zr=-90,Hr=1;class bE extends Tn{constructor(t,i,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new Ti(zr,Hr,t,i);l.layers=this.layers,this.add(l);const c=new Ti(zr,Hr,t,i);c.layers=this.layers,this.add(c);const h=new Ti(zr,Hr,t,i);h.layers=this.layers,this.add(h);const p=new Ti(zr,Hr,t,i);p.layers=this.layers,this.add(p);const m=new Ti(zr,Hr,t,i);m.layers=this.layers,this.add(m);const d=new Ti(zr,Hr,t,i);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){const t=this.coordinateSystem,i=this.children.concat(),[s,l,c,h,p,m]=i;for(const d of i)this.remove(d);if(t===qi)s.up.set(0,1,0),s.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),c.up.set(0,0,-1),c.lookAt(0,1,0),h.up.set(0,0,1),h.lookAt(0,-1,0),p.up.set(0,1,0),p.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(t===ul)s.up.set(0,-1,0),s.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),c.up.set(0,0,1),c.lookAt(0,1,0),h.up.set(0,0,-1),h.lookAt(0,-1,0),p.up.set(0,-1,0),p.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const d of i)this.add(d),d.updateMatrixWorld()}update(t,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:l}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[c,h,p,m,d,_]=this.children,v=t.getRenderTarget(),g=t.getActiveCubeFace(),M=t.getActiveMipmapLevel(),b=t.xr.enabled;t.xr.enabled=!1;const C=s.texture.generateMipmaps;s.texture.generateMipmaps=!1;let S=!1;t.isWebGLRenderer===!0?S=t.state.buffers.depth.getReversed():S=t.reversedDepthBuffer,t.setRenderTarget(s,0,l),S&&t.autoClear===!1&&t.clearDepth(),t.render(i,c),t.setRenderTarget(s,1,l),S&&t.autoClear===!1&&t.clearDepth(),t.render(i,h),t.setRenderTarget(s,2,l),S&&t.autoClear===!1&&t.clearDepth(),t.render(i,p),t.setRenderTarget(s,3,l),S&&t.autoClear===!1&&t.clearDepth(),t.render(i,m),t.setRenderTarget(s,4,l),S&&t.autoClear===!1&&t.clearDepth(),t.render(i,d),s.texture.generateMipmaps=C,t.setRenderTarget(s,5,l),S&&t.autoClear===!1&&t.clearDepth(),t.render(i,_),t.setRenderTarget(v,g,M),t.xr.enabled=b,s.texture.needsPMREMUpdate=!0}}class TE extends Ti{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class av{constructor(t=1,i=0,s=0){this.radius=t,this.phi=i,this.theta=s}set(t,i,s){return this.radius=t,this.phi=i,this.theta=s,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=ge(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,i,s){return this.radius=Math.sqrt(t*t+i*i+s*s),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,s),this.phi=Math.acos(ge(i/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Pp=class Pp{constructor(t,i,s,l){this.elements=[1,0,0,1],t!==void 0&&this.set(t,i,s,l)}identity(){return this.set(1,0,0,1),this}fromArray(t,i=0){for(let s=0;s<4;s++)this.elements[s]=t[s+i];return this}set(t,i,s,l){const c=this.elements;return c[0]=t,c[2]=i,c[1]=s,c[3]=l,this}};Pp.prototype.isMatrix2=!0;let sv=Pp;class AE extends _s{constructor(t,i=null){super(),this.object=t,this.domElement=i,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){$t("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function rv(r,t,i,s){const l=RE(s);switch(i){case Jv:return r*t;case tx:return r*t/l.components*l.byteLength;case vp:return r*t/l.components*l.byteLength;case qs:return r*t*2/l.components*l.byteLength;case xp:return r*t*2/l.components*l.byteLength;case $v:return r*t*3/l.components*l.byteLength;case Ii:return r*t*4/l.components*l.byteLength;case Sp:return r*t*4/l.components*l.byteLength;case eu:case nu:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case iu:case au:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case wd:case Ud:return Math.max(r,16)*Math.max(t,8)/4;case Cd:case Dd:return Math.max(r,8)*Math.max(t,8)/2;case Ld:case Nd:case Pd:case Id:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Od:case ou:case Fd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Bd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case zd:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case Hd:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case Gd:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case Vd:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case kd:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case Xd:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case jd:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case Wd:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case qd:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case Yd:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case Zd:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case Kd:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case Qd:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case Jd:case $d:case tp:return Math.ceil(r/4)*Math.ceil(t/4)*16;case ep:case np:return Math.ceil(r/4)*Math.ceil(t/4)*8;case lu:case ip:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function RE(r){switch(r){case hi:case Yv:return{byteLength:1,components:1};case ll:case Zv:case Aa:return{byteLength:2,components:1};case gp:case _p:return{byteLength:2,components:4};case Ki:case mp:case Wi:return{byteLength:4,components:1};case Kv:case Qv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:dp}}));typeof window<"u"&&(window.__THREE__?$t("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=dp);function px(){let r=null,t=!1,i=null,s=null;function l(c,h){i(c,h),s=r.requestAnimationFrame(l)}return{start:function(){t!==!0&&i!==null&&r!==null&&(s=r.requestAnimationFrame(l),t=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(s),t=!1},setAnimationLoop:function(c){i=c},setContext:function(c){r=c}}}function CE(r){const t=new WeakMap;function i(p,m){const d=p.array,_=p.usage,v=d.byteLength,g=r.createBuffer();r.bindBuffer(m,g),r.bufferData(m,d,_),p.onUploadCallback();let M;if(d instanceof Float32Array)M=r.FLOAT;else if(typeof Float16Array<"u"&&d instanceof Float16Array)M=r.HALF_FLOAT;else if(d instanceof Uint16Array)p.isFloat16BufferAttribute?M=r.HALF_FLOAT:M=r.UNSIGNED_SHORT;else if(d instanceof Int16Array)M=r.SHORT;else if(d instanceof Uint32Array)M=r.UNSIGNED_INT;else if(d instanceof Int32Array)M=r.INT;else if(d instanceof Int8Array)M=r.BYTE;else if(d instanceof Uint8Array)M=r.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)M=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:g,type:M,bytesPerElement:d.BYTES_PER_ELEMENT,version:p.version,size:v}}function s(p,m,d){const _=m.array,v=m.updateRanges;if(r.bindBuffer(d,p),v.length===0)r.bufferSubData(d,0,_);else{v.sort((M,b)=>M.start-b.start);let g=0;for(let M=1;M<v.length;M++){const b=v[g],C=v[M];C.start<=b.start+b.count+1?b.count=Math.max(b.count,C.start+C.count-b.start):(++g,v[g]=C)}v.length=g+1;for(let M=0,b=v.length;M<b;M++){const C=v[M];r.bufferSubData(d,C.start*_.BYTES_PER_ELEMENT,_,C.start,C.count)}m.clearUpdateRanges()}m.onUploadCallback()}function l(p){return p.isInterleavedBufferAttribute&&(p=p.data),t.get(p)}function c(p){p.isInterleavedBufferAttribute&&(p=p.data);const m=t.get(p);m&&(r.deleteBuffer(m.buffer),t.delete(p))}function h(p,m){if(p.isInterleavedBufferAttribute&&(p=p.data),p.isGLBufferAttribute){const _=t.get(p);(!_||_.version<p.version)&&t.set(p,{buffer:p.buffer,type:p.type,bytesPerElement:p.elementSize,version:p.version});return}const d=t.get(p);if(d===void 0)t.set(p,i(p,m));else if(d.version<p.version){if(d.size!==p.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(d.buffer,p,m),d.version=p.version}}return{get:l,remove:c,update:h}}var wE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,DE=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,UE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,LE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,NE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,OE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,PE=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,IE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,FE=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,BE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,zE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,HE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,GE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,VE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,kE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,XE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,jE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,WE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,YE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,ZE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,KE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,QE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,JE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,$E=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,tb=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,eb=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,nb=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ib=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ab=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,sb="gl_FragColor = linearToOutputTexel( gl_FragColor );",rb=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ob=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,lb=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,cb=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ub=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,fb=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,hb=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,db=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,pb=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,mb=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gb=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,_b=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vb=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,xb=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sb=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,yb=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Mb=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Eb=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,bb=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Tb=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ab=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Rb=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Cb=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,wb=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Db=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ub=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Lb=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Nb=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ob=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Pb=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ib=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fb=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Bb=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,zb=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hb=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Gb=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Vb=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,kb=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xb=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jb=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Wb=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qb=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Yb=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Zb=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kb=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qb=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Jb=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,$b=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,eT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,iT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,aT=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,sT=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,rT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,oT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,uT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,fT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,hT=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,dT=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,pT=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,mT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gT=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,_T=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vT=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,xT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ST=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,yT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,MT=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ET=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,bT=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,TT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,AT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,RT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,CT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const wT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,DT=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,UT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,LT=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,NT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,OT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,PT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,IT=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,FT=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,BT=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,zT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,HT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,GT=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,VT=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,XT=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jT=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,WT=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qT=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,YT=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ZT=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,KT=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,QT=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,JT=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$T=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,t1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,n1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,i1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,a1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,s1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,r1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,o1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,l1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,fe={alphahash_fragment:wE,alphahash_pars_fragment:DE,alphamap_fragment:UE,alphamap_pars_fragment:LE,alphatest_fragment:NE,alphatest_pars_fragment:OE,aomap_fragment:PE,aomap_pars_fragment:IE,batching_pars_vertex:FE,batching_vertex:BE,begin_vertex:zE,beginnormal_vertex:HE,bsdfs:GE,iridescence_fragment:VE,bumpmap_pars_fragment:kE,clipping_planes_fragment:XE,clipping_planes_pars_fragment:jE,clipping_planes_pars_vertex:WE,clipping_planes_vertex:qE,color_fragment:YE,color_pars_fragment:ZE,color_pars_vertex:KE,color_vertex:QE,common:JE,cube_uv_reflection_fragment:$E,defaultnormal_vertex:tb,displacementmap_pars_vertex:eb,displacementmap_vertex:nb,emissivemap_fragment:ib,emissivemap_pars_fragment:ab,colorspace_fragment:sb,colorspace_pars_fragment:rb,envmap_fragment:ob,envmap_common_pars_fragment:lb,envmap_pars_fragment:cb,envmap_pars_vertex:ub,envmap_physical_pars_fragment:yb,envmap_vertex:fb,fog_vertex:hb,fog_pars_vertex:db,fog_fragment:pb,fog_pars_fragment:mb,gradientmap_pars_fragment:gb,lightmap_pars_fragment:_b,lights_lambert_fragment:vb,lights_lambert_pars_fragment:xb,lights_pars_begin:Sb,lights_toon_fragment:Mb,lights_toon_pars_fragment:Eb,lights_phong_fragment:bb,lights_phong_pars_fragment:Tb,lights_physical_fragment:Ab,lights_physical_pars_fragment:Rb,lights_fragment_begin:Cb,lights_fragment_maps:wb,lights_fragment_end:Db,lightprobes_pars_fragment:Ub,logdepthbuf_fragment:Lb,logdepthbuf_pars_fragment:Nb,logdepthbuf_pars_vertex:Ob,logdepthbuf_vertex:Pb,map_fragment:Ib,map_pars_fragment:Fb,map_particle_fragment:Bb,map_particle_pars_fragment:zb,metalnessmap_fragment:Hb,metalnessmap_pars_fragment:Gb,morphinstance_vertex:Vb,morphcolor_vertex:kb,morphnormal_vertex:Xb,morphtarget_pars_vertex:jb,morphtarget_vertex:Wb,normal_fragment_begin:qb,normal_fragment_maps:Yb,normal_pars_fragment:Zb,normal_pars_vertex:Kb,normal_vertex:Qb,normalmap_pars_fragment:Jb,clearcoat_normal_fragment_begin:$b,clearcoat_normal_fragment_maps:tT,clearcoat_pars_fragment:eT,iridescence_pars_fragment:nT,opaque_fragment:iT,packing:aT,premultiplied_alpha_fragment:sT,project_vertex:rT,dithering_fragment:oT,dithering_pars_fragment:lT,roughnessmap_fragment:cT,roughnessmap_pars_fragment:uT,shadowmap_pars_fragment:fT,shadowmap_pars_vertex:hT,shadowmap_vertex:dT,shadowmask_pars_fragment:pT,skinbase_vertex:mT,skinning_pars_vertex:gT,skinning_vertex:_T,skinnormal_vertex:vT,specularmap_fragment:xT,specularmap_pars_fragment:ST,tonemapping_fragment:yT,tonemapping_pars_fragment:MT,transmission_fragment:ET,transmission_pars_fragment:bT,uv_pars_fragment:TT,uv_pars_vertex:AT,uv_vertex:RT,worldpos_vertex:CT,background_vert:wT,background_frag:DT,backgroundCube_vert:UT,backgroundCube_frag:LT,cube_vert:NT,cube_frag:OT,depth_vert:PT,depth_frag:IT,distance_vert:FT,distance_frag:BT,equirect_vert:zT,equirect_frag:HT,linedashed_vert:GT,linedashed_frag:VT,meshbasic_vert:kT,meshbasic_frag:XT,meshlambert_vert:jT,meshlambert_frag:WT,meshmatcap_vert:qT,meshmatcap_frag:YT,meshnormal_vert:ZT,meshnormal_frag:KT,meshphong_vert:QT,meshphong_frag:JT,meshphysical_vert:$T,meshphysical_frag:t1,meshtoon_vert:e1,meshtoon_frag:n1,points_vert:i1,points_frag:a1,shadow_vert:s1,shadow_frag:r1,sprite_vert:o1,sprite_frag:l1},zt={common:{diffuse:{value:new de(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new se},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new se}},envmap:{envMap:{value:null},envMapRotation:{value:new se},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new se}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new se}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new se},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new se},normalScale:{value:new re(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new se},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new se}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new se}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new se}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new de(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new tt},probesMax:{value:new tt},probesResolution:{value:new tt}},points:{diffuse:{value:new de(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0},uvTransform:{value:new se}},sprite:{diffuse:{value:new de(16777215)},opacity:{value:1},center:{value:new re(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new se},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0}}},ji={basic:{uniforms:Hn([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.fog]),vertexShader:fe.meshbasic_vert,fragmentShader:fe.meshbasic_frag},lambert:{uniforms:Hn([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,zt.lights,{emissive:{value:new de(0)},envMapIntensity:{value:1}}]),vertexShader:fe.meshlambert_vert,fragmentShader:fe.meshlambert_frag},phong:{uniforms:Hn([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,zt.lights,{emissive:{value:new de(0)},specular:{value:new de(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:fe.meshphong_vert,fragmentShader:fe.meshphong_frag},standard:{uniforms:Hn([zt.common,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.roughnessmap,zt.metalnessmap,zt.fog,zt.lights,{emissive:{value:new de(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:fe.meshphysical_vert,fragmentShader:fe.meshphysical_frag},toon:{uniforms:Hn([zt.common,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.gradientmap,zt.fog,zt.lights,{emissive:{value:new de(0)}}]),vertexShader:fe.meshtoon_vert,fragmentShader:fe.meshtoon_frag},matcap:{uniforms:Hn([zt.common,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,{matcap:{value:null}}]),vertexShader:fe.meshmatcap_vert,fragmentShader:fe.meshmatcap_frag},points:{uniforms:Hn([zt.points,zt.fog]),vertexShader:fe.points_vert,fragmentShader:fe.points_frag},dashed:{uniforms:Hn([zt.common,zt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:fe.linedashed_vert,fragmentShader:fe.linedashed_frag},depth:{uniforms:Hn([zt.common,zt.displacementmap]),vertexShader:fe.depth_vert,fragmentShader:fe.depth_frag},normal:{uniforms:Hn([zt.common,zt.bumpmap,zt.normalmap,zt.displacementmap,{opacity:{value:1}}]),vertexShader:fe.meshnormal_vert,fragmentShader:fe.meshnormal_frag},sprite:{uniforms:Hn([zt.sprite,zt.fog]),vertexShader:fe.sprite_vert,fragmentShader:fe.sprite_frag},background:{uniforms:{uvTransform:{value:new se},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:fe.background_vert,fragmentShader:fe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new se}},vertexShader:fe.backgroundCube_vert,fragmentShader:fe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:fe.cube_vert,fragmentShader:fe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:fe.equirect_vert,fragmentShader:fe.equirect_frag},distance:{uniforms:Hn([zt.common,zt.displacementmap,{referencePosition:{value:new tt},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:fe.distance_vert,fragmentShader:fe.distance_frag},shadow:{uniforms:Hn([zt.lights,zt.fog,{color:{value:new de(0)},opacity:{value:1}}]),vertexShader:fe.shadow_vert,fragmentShader:fe.shadow_frag}};ji.physical={uniforms:Hn([ji.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new se},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new se},clearcoatNormalScale:{value:new re(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new se},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new se},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new se},sheen:{value:0},sheenColor:{value:new de(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new se},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new se},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new se},transmissionSamplerSize:{value:new re},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new se},attenuationDistance:{value:0},attenuationColor:{value:new de(0)},specularColor:{value:new de(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new se},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new se},anisotropyVector:{value:new re},anisotropyMap:{value:null},anisotropyMapTransform:{value:new se}}]),vertexShader:fe.meshphysical_vert,fragmentShader:fe.meshphysical_frag};const Kc={r:0,b:0,g:0},c1=new on,mx=new se;mx.set(-1,0,0,0,1,0,0,0,1);function u1(r,t,i,s,l,c){const h=new de(0);let p=l===!0?0:1,m,d,_=null,v=0,g=null;function M(w){let O=w.isScene===!0?w.background:null;if(O&&O.isTexture){const P=w.backgroundBlurriness>0;O=t.get(O,P)}return O}function b(w){let O=!1;const P=M(w);P===null?S(h,p):P&&P.isColor&&(S(P,1),O=!0);const z=r.xr.getEnvironmentBlendMode();z==="additive"?i.buffers.color.setClear(0,0,0,1,c):z==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,c),(r.autoClear||O)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function C(w,O){const P=M(O);P&&(P.isCubeTexture||P.mapping===_u)?(d===void 0&&(d=new Fi(new dl(1,1,1),new Qi({name:"BackgroundCubeMaterial",uniforms:Qr(ji.backgroundCube.uniforms),vertexShader:ji.backgroundCube.vertexShader,fragmentShader:ji.backgroundCube.fragmentShader,side:Jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(z,N,B){this.matrixWorld.copyPosition(B.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),d.material.uniforms.envMap.value=P,d.material.uniforms.backgroundBlurriness.value=O.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=O.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(c1.makeRotationFromEuler(O.backgroundRotation)).transpose(),P.isCubeTexture&&P.isRenderTargetTexture===!1&&d.material.uniforms.backgroundRotation.value.premultiply(mx),d.material.toneMapped=Te.getTransfer(P.colorSpace)!==ze,(_!==P||v!==P.version||g!==r.toneMapping)&&(d.material.needsUpdate=!0,_=P,v=P.version,g=r.toneMapping),d.layers.enableAll(),w.unshift(d,d.geometry,d.material,0,0,null)):P&&P.isTexture&&(m===void 0&&(m=new Fi(new pl(2,2),new Qi({name:"BackgroundMaterial",uniforms:Qr(ji.background.uniforms),vertexShader:ji.background.vertexShader,fragmentShader:ji.background.fragmentShader,side:ds,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(m)),m.material.uniforms.t2D.value=P,m.material.uniforms.backgroundIntensity.value=O.backgroundIntensity,m.material.toneMapped=Te.getTransfer(P.colorSpace)!==ze,P.matrixAutoUpdate===!0&&P.updateMatrix(),m.material.uniforms.uvTransform.value.copy(P.matrix),(_!==P||v!==P.version||g!==r.toneMapping)&&(m.material.needsUpdate=!0,_=P,v=P.version,g=r.toneMapping),m.layers.enableAll(),w.unshift(m,m.geometry,m.material,0,0,null))}function S(w,O){w.getRGB(Kc,fx(r)),i.buffers.color.setClear(Kc.r,Kc.g,Kc.b,O,c)}function y(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),m!==void 0&&(m.geometry.dispose(),m.material.dispose(),m=void 0)}return{getClearColor:function(){return h},setClearColor:function(w,O=1){h.set(w),p=O,S(h,p)},getClearAlpha:function(){return p},setClearAlpha:function(w){p=w,S(h,p)},render:b,addToRenderList:C,dispose:y}}function f1(r,t){const i=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},l=g(null);let c=l,h=!1;function p(G,$,ut,ht,j){let L=!1;const H=v(G,ht,ut,$);c!==H&&(c=H,d(c.object)),L=M(G,ht,ut,j),L&&b(G,ht,ut,j),j!==null&&t.update(j,r.ELEMENT_ARRAY_BUFFER),(L||h)&&(h=!1,P(G,$,ut,ht),j!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(j).buffer))}function m(){return r.createVertexArray()}function d(G){return r.bindVertexArray(G)}function _(G){return r.deleteVertexArray(G)}function v(G,$,ut,ht){const j=ht.wireframe===!0;let L=s[$.id];L===void 0&&(L={},s[$.id]=L);const H=G.isInstancedMesh===!0?G.id:0;let et=L[H];et===void 0&&(et={},L[H]=et);let gt=et[ut.id];gt===void 0&&(gt={},et[ut.id]=gt);let yt=gt[j];return yt===void 0&&(yt=g(m()),gt[j]=yt),yt}function g(G){const $=[],ut=[],ht=[];for(let j=0;j<i;j++)$[j]=0,ut[j]=0,ht[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:$,enabledAttributes:ut,attributeDivisors:ht,object:G,attributes:{},index:null}}function M(G,$,ut,ht){const j=c.attributes,L=$.attributes;let H=0;const et=ut.getAttributes();for(const gt in et)if(et[gt].location>=0){const I=j[gt];let Q=L[gt];if(Q===void 0&&(gt==="instanceMatrix"&&G.instanceMatrix&&(Q=G.instanceMatrix),gt==="instanceColor"&&G.instanceColor&&(Q=G.instanceColor)),I===void 0||I.attribute!==Q||Q&&I.data!==Q.data)return!0;H++}return c.attributesNum!==H||c.index!==ht}function b(G,$,ut,ht){const j={},L=$.attributes;let H=0;const et=ut.getAttributes();for(const gt in et)if(et[gt].location>=0){let I=L[gt];I===void 0&&(gt==="instanceMatrix"&&G.instanceMatrix&&(I=G.instanceMatrix),gt==="instanceColor"&&G.instanceColor&&(I=G.instanceColor));const Q={};Q.attribute=I,I&&I.data&&(Q.data=I.data),j[gt]=Q,H++}c.attributes=j,c.attributesNum=H,c.index=ht}function C(){const G=c.newAttributes;for(let $=0,ut=G.length;$<ut;$++)G[$]=0}function S(G){y(G,0)}function y(G,$){const ut=c.newAttributes,ht=c.enabledAttributes,j=c.attributeDivisors;ut[G]=1,ht[G]===0&&(r.enableVertexAttribArray(G),ht[G]=1),j[G]!==$&&(r.vertexAttribDivisor(G,$),j[G]=$)}function w(){const G=c.newAttributes,$=c.enabledAttributes;for(let ut=0,ht=$.length;ut<ht;ut++)$[ut]!==G[ut]&&(r.disableVertexAttribArray(ut),$[ut]=0)}function O(G,$,ut,ht,j,L,H){H===!0?r.vertexAttribIPointer(G,$,ut,j,L):r.vertexAttribPointer(G,$,ut,ht,j,L)}function P(G,$,ut,ht){C();const j=ht.attributes,L=ut.getAttributes(),H=$.defaultAttributeValues;for(const et in L){const gt=L[et];if(gt.location>=0){let yt=j[et];if(yt===void 0&&(et==="instanceMatrix"&&G.instanceMatrix&&(yt=G.instanceMatrix),et==="instanceColor"&&G.instanceColor&&(yt=G.instanceColor)),yt!==void 0){const I=yt.normalized,Q=yt.itemSize,St=t.get(yt);if(St===void 0)continue;const bt=St.buffer,K=St.type,Z=St.bytesPerElement,Mt=K===r.INT||K===r.UNSIGNED_INT||yt.gpuType===mp;if(yt.isInterleavedBufferAttribute){const At=yt.data,Ht=At.stride,te=yt.offset;if(At.isInstancedInterleavedBuffer){for(let Qt=0;Qt<gt.locationSize;Qt++)y(gt.location+Qt,At.meshPerAttribute);G.isInstancedMesh!==!0&&ht._maxInstanceCount===void 0&&(ht._maxInstanceCount=At.meshPerAttribute*At.count)}else for(let Qt=0;Qt<gt.locationSize;Qt++)S(gt.location+Qt);r.bindBuffer(r.ARRAY_BUFFER,bt);for(let Qt=0;Qt<gt.locationSize;Qt++)O(gt.location+Qt,Q/gt.locationSize,K,I,Ht*Z,(te+Q/gt.locationSize*Qt)*Z,Mt)}else{if(yt.isInstancedBufferAttribute){for(let At=0;At<gt.locationSize;At++)y(gt.location+At,yt.meshPerAttribute);G.isInstancedMesh!==!0&&ht._maxInstanceCount===void 0&&(ht._maxInstanceCount=yt.meshPerAttribute*yt.count)}else for(let At=0;At<gt.locationSize;At++)S(gt.location+At);r.bindBuffer(r.ARRAY_BUFFER,bt);for(let At=0;At<gt.locationSize;At++)O(gt.location+At,Q/gt.locationSize,K,I,Q*Z,Q/gt.locationSize*At*Z,Mt)}}else if(H!==void 0){const I=H[et];if(I!==void 0)switch(I.length){case 2:r.vertexAttrib2fv(gt.location,I);break;case 3:r.vertexAttrib3fv(gt.location,I);break;case 4:r.vertexAttrib4fv(gt.location,I);break;default:r.vertexAttrib1fv(gt.location,I)}}}}w()}function z(){F();for(const G in s){const $=s[G];for(const ut in $){const ht=$[ut];for(const j in ht){const L=ht[j];for(const H in L)_(L[H].object),delete L[H];delete ht[j]}}delete s[G]}}function N(G){if(s[G.id]===void 0)return;const $=s[G.id];for(const ut in $){const ht=$[ut];for(const j in ht){const L=ht[j];for(const H in L)_(L[H].object),delete L[H];delete ht[j]}}delete s[G.id]}function B(G){for(const $ in s){const ut=s[$];for(const ht in ut){const j=ut[ht];if(j[G.id]===void 0)continue;const L=j[G.id];for(const H in L)_(L[H].object),delete L[H];delete j[G.id]}}}function T(G){for(const $ in s){const ut=s[$],ht=G.isInstancedMesh===!0?G.id:0,j=ut[ht];if(j!==void 0){for(const L in j){const H=j[L];for(const et in H)_(H[et].object),delete H[et];delete j[L]}delete ut[ht],Object.keys(ut).length===0&&delete s[$]}}}function F(){q(),h=!0,c!==l&&(c=l,d(c.object))}function q(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:p,reset:F,resetDefaultState:q,dispose:z,releaseStatesOfGeometry:N,releaseStatesOfObject:T,releaseStatesOfProgram:B,initAttributes:C,enableAttribute:S,disableUnusedAttributes:w}}function h1(r,t,i){let s;function l(m){s=m}function c(m,d){r.drawArrays(s,m,d),i.update(d,s,1)}function h(m,d,_){_!==0&&(r.drawArraysInstanced(s,m,d,_),i.update(d,s,_))}function p(m,d,_){if(_===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(s,m,0,d,0,_);let g=0;for(let M=0;M<_;M++)g+=d[M];i.update(g,s,1)}this.setMode=l,this.render=c,this.renderInstances=h,this.renderMultiDraw=p}function d1(r,t,i,s){let l;function c(){if(l!==void 0)return l;if(t.has("EXT_texture_filter_anisotropic")===!0){const B=t.get("EXT_texture_filter_anisotropic");l=r.getParameter(B.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function h(B){return!(B!==Ii&&s.convert(B)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function p(B){const T=B===Aa&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(B!==hi&&s.convert(B)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&B!==Wi&&!T)}function m(B){if(B==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";B="mediump"}return B==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=i.precision!==void 0?i.precision:"highp";const _=m(d);_!==d&&($t("WebGLRenderer:",d,"not supported, using",_,"instead."),d=_);const v=i.logarithmicDepthBuffer===!0,g=i.reversedDepthBuffer===!0&&t.has("EXT_clip_control");i.reversedDepthBuffer===!0&&g===!1&&$t("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const M=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),b=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),C=r.getParameter(r.MAX_TEXTURE_SIZE),S=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),y=r.getParameter(r.MAX_VERTEX_ATTRIBS),w=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),O=r.getParameter(r.MAX_VARYING_VECTORS),P=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),z=r.getParameter(r.MAX_SAMPLES),N=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:m,textureFormatReadable:h,textureTypeReadable:p,precision:d,logarithmicDepthBuffer:v,reversedDepthBuffer:g,maxTextures:M,maxVertexTextures:b,maxTextureSize:C,maxCubemapSize:S,maxAttributes:y,maxVertexUniforms:w,maxVaryings:O,maxFragmentUniforms:P,maxSamples:z,samples:N}}function p1(r){const t=this;let i=null,s=0,l=!1,c=!1;const h=new cs,p=new se,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(v,g){const M=v.length!==0||g||s!==0||l;return l=g,s=v.length,M},this.beginShadows=function(){c=!0,_(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(v,g){i=_(v,g,0)},this.setState=function(v,g,M){const b=v.clippingPlanes,C=v.clipIntersection,S=v.clipShadows,y=r.get(v);if(!l||b===null||b.length===0||c&&!S)c?_(null):d();else{const w=c?0:s,O=w*4;let P=y.clippingState||null;m.value=P,P=_(b,g,O,M);for(let z=0;z!==O;++z)P[z]=i[z];y.clippingState=P,this.numIntersection=C?this.numPlanes:0,this.numPlanes+=w}};function d(){m.value!==i&&(m.value=i,m.needsUpdate=s>0),t.numPlanes=s,t.numIntersection=0}function _(v,g,M,b){const C=v!==null?v.length:0;let S=null;if(C!==0){if(S=m.value,b!==!0||S===null){const y=M+C*4,w=g.matrixWorldInverse;p.getNormalMatrix(w),(S===null||S.length<y)&&(S=new Float32Array(y));for(let O=0,P=M;O!==C;++O,P+=4)h.copy(v[O]).applyMatrix4(w,p),h.normal.toArray(S,P),S[P+3]=h.constant}m.value=S,m.needsUpdate=!0}return t.numPlanes=C,t.numIntersection=0,S}}const fs=4,ov=[.125,.215,.35,.446,.526,.582],Vs=20,m1=256,el=new Cp,lv=new de;let od=null,ld=0,cd=0,ud=!1;const g1=new tt;class cv{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,i=0,s=.1,l=100,c={}){const{size:h=256,position:p=g1}=c;od=this._renderer.getRenderTarget(),ld=this._renderer.getActiveCubeFace(),cd=this._renderer.getActiveMipmapLevel(),ud=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(h);const m=this._allocateTargets();return m.depthBuffer=!0,this._sceneToCubeUV(t,s,l,m,p),i>0&&this._blur(m,0,0,i),this._applyPMREM(m),this._cleanup(m),m}fromEquirectangular(t,i=null){return this._fromTexture(t,i)}fromCubemap(t,i=null){return this._fromTexture(t,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hv(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fv(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(od,ld,cd),this._renderer.xr.enabled=ud,t.scissorTest=!1,Gr(t,0,0,t.width,t.height)}_fromTexture(t,i){t.mapping===Ws||t.mapping===Zr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),od=this._renderer.getRenderTarget(),ld=this._renderer.getActiveCubeFace(),cd=this._renderer.getActiveMipmapLevel(),ud=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=i||this._allocateTargets();return this._textureToCubeUV(t,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,s={magFilter:Bn,minFilter:Bn,generateMipmaps:!1,type:Aa,format:Ii,colorSpace:cu,depthBuffer:!1},l=uv(t,i,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=uv(t,i,s);const{_lodMax:c}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=_1(c)),this._blurMaterial=x1(c,t,i),this._ggxMaterial=v1(c,t,i)}return l}_compileMaterial(t){const i=new Fi(new pi,t);this._renderer.compile(i,el)}_sceneToCubeUV(t,i,s,l,c){const m=new Ti(90,1,i,s),d=[1,-1,1,1,1,1],_=[1,1,1,-1,-1,-1],v=this._renderer,g=v.autoClear,M=v.toneMapping;v.getClearColor(lv),v.toneMapping=Yi,v.autoClear=!1,v.state.buffers.depth.getReversed()&&(v.setRenderTarget(l),v.clearDepth(),v.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Fi(new dl,new ox({name:"PMREM.Background",side:Jn,depthWrite:!1,depthTest:!1})));const C=this._backgroundBox,S=C.material;let y=!1;const w=t.background;w?w.isColor&&(S.color.copy(w),t.background=null,y=!0):(S.color.copy(lv),y=!0);for(let O=0;O<6;O++){const P=O%3;P===0?(m.up.set(0,d[O],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x+_[O],c.y,c.z)):P===1?(m.up.set(0,0,d[O]),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y+_[O],c.z)):(m.up.set(0,d[O],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y,c.z+_[O]));const z=this._cubeSize;Gr(l,P*z,O>2?z:0,z,z),v.setRenderTarget(l),y&&v.render(C,m),v.render(t,m)}v.toneMapping=M,v.autoClear=g,t.background=w}_textureToCubeUV(t,i){const s=this._renderer,l=t.mapping===Ws||t.mapping===Zr;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=hv()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fv());const c=l?this._cubemapMaterial:this._equirectMaterial,h=this._lodMeshes[0];h.material=c;const p=c.uniforms;p.envMap.value=t;const m=this._cubeSize;Gr(i,0,0,3*m,2*m),s.setRenderTarget(i),s.render(h,el)}_applyPMREM(t){const i=this._renderer,s=i.autoClear;i.autoClear=!1;const l=this._lodMeshes.length;for(let c=1;c<l;c++)this._applyGGXFilter(t,c-1,c);i.autoClear=s}_applyGGXFilter(t,i,s){const l=this._renderer,c=this._pingPongRenderTarget,h=this._ggxMaterial,p=this._lodMeshes[s];p.material=h;const m=h.uniforms,d=s/(this._lodMeshes.length-1),_=i/(this._lodMeshes.length-1),v=Math.sqrt(d*d-_*_),g=0+d*1.25,M=v*g,{_lodMax:b}=this,C=this._sizeLods[s],S=3*C*(s>b-fs?s-b+fs:0),y=4*(this._cubeSize-C);m.envMap.value=t.texture,m.roughness.value=M,m.mipInt.value=b-i,Gr(c,S,y,3*C,2*C),l.setRenderTarget(c),l.render(p,el),m.envMap.value=c.texture,m.roughness.value=0,m.mipInt.value=b-s,Gr(t,S,y,3*C,2*C),l.setRenderTarget(t),l.render(p,el)}_blur(t,i,s,l,c){const h=this._pingPongRenderTarget;this._halfBlur(t,h,i,s,l,"latitudinal",c),this._halfBlur(h,t,s,s,l,"longitudinal",c)}_halfBlur(t,i,s,l,c,h,p){const m=this._renderer,d=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&Ae("blur direction must be either latitudinal or longitudinal!");const _=3,v=this._lodMeshes[l];v.material=d;const g=d.uniforms,M=this._sizeLods[s]-1,b=isFinite(c)?Math.PI/(2*M):2*Math.PI/(2*Vs-1),C=c/b,S=isFinite(c)?1+Math.floor(_*C):Vs;S>Vs&&$t(`sigmaRadians, ${c}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${Vs}`);const y=[];let w=0;for(let B=0;B<Vs;++B){const T=B/C,F=Math.exp(-T*T/2);y.push(F),B===0?w+=F:B<S&&(w+=2*F)}for(let B=0;B<y.length;B++)y[B]=y[B]/w;g.envMap.value=t.texture,g.samples.value=S,g.weights.value=y,g.latitudinal.value=h==="latitudinal",p&&(g.poleAxis.value=p);const{_lodMax:O}=this;g.dTheta.value=b,g.mipInt.value=O-s;const P=this._sizeLods[l],z=3*P*(l>O-fs?l-O+fs:0),N=4*(this._cubeSize-P);Gr(i,z,N,3*P,2*P),m.setRenderTarget(i),m.render(v,el)}}function _1(r){const t=[],i=[],s=[];let l=r;const c=r-fs+1+ov.length;for(let h=0;h<c;h++){const p=Math.pow(2,l);t.push(p);let m=1/p;h>r-fs?m=ov[h-r+fs-1]:h===0&&(m=0),i.push(m);const d=1/(p-2),_=-d,v=1+d,g=[_,_,v,_,v,v,_,_,v,v,_,v],M=6,b=6,C=3,S=2,y=1,w=new Float32Array(C*b*M),O=new Float32Array(S*b*M),P=new Float32Array(y*b*M);for(let N=0;N<M;N++){const B=N%3*2/3-1,T=N>2?0:-1,F=[B,T,0,B+2/3,T,0,B+2/3,T+1,0,B,T,0,B+2/3,T+1,0,B,T+1,0];w.set(F,C*b*N),O.set(g,S*b*N);const q=[N,N,N,N,N,N];P.set(q,y*b*N)}const z=new pi;z.setAttribute("position",new di(w,C)),z.setAttribute("uv",new di(O,S)),z.setAttribute("faceIndex",new di(P,y)),s.push(new Fi(z,null)),l>fs&&l--}return{lodMeshes:s,sizeLods:t,sigmas:i}}function uv(r,t,i){const s=new Zi(r,t,i);return s.texture.mapping=_u,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Gr(r,t,i,s,l){r.viewport.set(t,i,s,l),r.scissor.set(t,i,s,l)}function v1(r,t,i){return new Qi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:m1,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:xu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ba,depthTest:!1,depthWrite:!1})}function x1(r,t,i){const s=new Float32Array(Vs),l=new tt(0,1,0);return new Qi({name:"SphericalGaussianBlur",defines:{n:Vs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:xu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ba,depthTest:!1,depthWrite:!1})}function fv(){return new Qi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ba,depthTest:!1,depthWrite:!1})}function hv(){return new Qi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ba,depthTest:!1,depthWrite:!1})}function xu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class gx extends Zi{constructor(t=1,i={}){super(t,t,i),this.isWebGLCubeRenderTarget=!0;const s={width:t,height:t,depth:1},l=[s,s,s,s,s,s];this.texture=new cx(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new dl(5,5,5),c=new Qi({name:"CubemapFromEquirect",uniforms:Qr(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Jn,blending:ba});c.uniforms.tEquirect.value=i;const h=new Fi(l,c),p=i.minFilter;return i.minFilter===ks&&(i.minFilter=Bn),new bE(1,10,this).update(t,h),i.minFilter=p,h.geometry.dispose(),h.material.dispose(),this}clear(t,i=!0,s=!0,l=!0){const c=t.getRenderTarget();for(let h=0;h<6;h++)t.setRenderTarget(this,h),t.clear(i,s,l);t.setRenderTarget(c)}}function S1(r){let t=new WeakMap,i=new WeakMap,s=null;function l(g,M=!1){return g==null?null:M?h(g):c(g)}function c(g){if(g&&g.isTexture){const M=g.mapping;if(M===Uh||M===Lh)if(t.has(g)){const b=t.get(g).texture;return p(b,g.mapping)}else{const b=g.image;if(b&&b.height>0){const C=new gx(b.height);return C.fromEquirectangularTexture(r,g),t.set(g,C),g.addEventListener("dispose",d),p(C.texture,g.mapping)}else return null}}return g}function h(g){if(g&&g.isTexture){const M=g.mapping,b=M===Uh||M===Lh,C=M===Ws||M===Zr;if(b||C){let S=i.get(g);const y=S!==void 0?S.texture.pmremVersion:0;if(g.isRenderTargetTexture&&g.pmremVersion!==y)return s===null&&(s=new cv(r)),S=b?s.fromEquirectangular(g,S):s.fromCubemap(g,S),S.texture.pmremVersion=g.pmremVersion,i.set(g,S),S.texture;if(S!==void 0)return S.texture;{const w=g.image;return b&&w&&w.height>0||C&&w&&m(w)?(s===null&&(s=new cv(r)),S=b?s.fromEquirectangular(g):s.fromCubemap(g),S.texture.pmremVersion=g.pmremVersion,i.set(g,S),g.addEventListener("dispose",_),S.texture):null}}}return g}function p(g,M){return M===Uh?g.mapping=Ws:M===Lh&&(g.mapping=Zr),g}function m(g){let M=0;const b=6;for(let C=0;C<b;C++)g[C]!==void 0&&M++;return M===b}function d(g){const M=g.target;M.removeEventListener("dispose",d);const b=t.get(M);b!==void 0&&(t.delete(M),b.dispose())}function _(g){const M=g.target;M.removeEventListener("dispose",_);const b=i.get(M);b!==void 0&&(i.delete(M),b.dispose())}function v(){t=new WeakMap,i=new WeakMap,s!==null&&(s.dispose(),s=null)}return{get:l,dispose:v}}function y1(r){const t={};function i(s){if(t[s]!==void 0)return t[s];const l=r.getExtension(s);return t[s]=l,l}return{has:function(s){return i(s)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(s){const l=i(s);return l===null&&sp("WebGLRenderer: "+s+" extension not supported."),l}}}function M1(r,t,i,s){const l={},c=new WeakMap;function h(v){const g=v.target;g.index!==null&&t.remove(g.index);for(const b in g.attributes)t.remove(g.attributes[b]);g.removeEventListener("dispose",h),delete l[g.id];const M=c.get(g);M&&(t.remove(M),c.delete(g)),s.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,i.memory.geometries--}function p(v,g){return l[g.id]===!0||(g.addEventListener("dispose",h),l[g.id]=!0,i.memory.geometries++),g}function m(v){const g=v.attributes;for(const M in g)t.update(g[M],r.ARRAY_BUFFER)}function d(v){const g=[],M=v.index,b=v.attributes.position;let C=0;if(b===void 0)return;if(M!==null){const w=M.array;C=M.version;for(let O=0,P=w.length;O<P;O+=3){const z=w[O+0],N=w[O+1],B=w[O+2];g.push(z,N,N,B,B,z)}}else{const w=b.array;C=b.version;for(let O=0,P=w.length/3-1;O<P;O+=3){const z=O+0,N=O+1,B=O+2;g.push(z,N,N,B,B,z)}}const S=new(b.count>=65535?rx:sx)(g,1);S.version=C;const y=c.get(v);y&&t.remove(y),c.set(v,S)}function _(v){const g=c.get(v);if(g){const M=v.index;M!==null&&g.version<M.version&&d(v)}else d(v);return c.get(v)}return{get:p,update:m,getWireframeAttribute:_}}function E1(r,t,i){let s;function l(v){s=v}let c,h;function p(v){c=v.type,h=v.bytesPerElement}function m(v,g){r.drawElements(s,g,c,v*h),i.update(g,s,1)}function d(v,g,M){M!==0&&(r.drawElementsInstanced(s,g,c,v*h,M),i.update(g,s,M))}function _(v,g,M){if(M===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(s,g,0,c,v,0,M);let C=0;for(let S=0;S<M;S++)C+=g[S];i.update(C,s,1)}this.setMode=l,this.setIndex=p,this.render=m,this.renderInstances=d,this.renderMultiDraw=_}function b1(r){const t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function s(c,h,p){switch(i.calls++,h){case r.TRIANGLES:i.triangles+=p*(c/3);break;case r.LINES:i.lines+=p*(c/2);break;case r.LINE_STRIP:i.lines+=p*(c-1);break;case r.LINE_LOOP:i.lines+=p*c;break;case r.POINTS:i.points+=p*c;break;default:Ae("WebGLInfo: Unknown draw mode:",h);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:l,update:s}}function T1(r,t,i){const s=new WeakMap,l=new rn;function c(h,p,m){const d=h.morphTargetInfluences,_=p.morphAttributes.position||p.morphAttributes.normal||p.morphAttributes.color,v=_!==void 0?_.length:0;let g=s.get(p);if(g===void 0||g.count!==v){let q=function(){T.dispose(),s.delete(p),p.removeEventListener("dispose",q)};var M=q;g!==void 0&&g.texture.dispose();const b=p.morphAttributes.position!==void 0,C=p.morphAttributes.normal!==void 0,S=p.morphAttributes.color!==void 0,y=p.morphAttributes.position||[],w=p.morphAttributes.normal||[],O=p.morphAttributes.color||[];let P=0;b===!0&&(P=1),C===!0&&(P=2),S===!0&&(P=3);let z=p.attributes.position.count*P,N=1;z>t.maxTextureSize&&(N=Math.ceil(z/t.maxTextureSize),z=t.maxTextureSize);const B=new Float32Array(z*N*4*v),T=new nx(B,z,N,v);T.type=Wi,T.needsUpdate=!0;const F=P*4;for(let G=0;G<v;G++){const $=y[G],ut=w[G],ht=O[G],j=z*N*4*G;for(let L=0;L<$.count;L++){const H=L*F;b===!0&&(l.fromBufferAttribute($,L),B[j+H+0]=l.x,B[j+H+1]=l.y,B[j+H+2]=l.z,B[j+H+3]=0),C===!0&&(l.fromBufferAttribute(ut,L),B[j+H+4]=l.x,B[j+H+5]=l.y,B[j+H+6]=l.z,B[j+H+7]=0),S===!0&&(l.fromBufferAttribute(ht,L),B[j+H+8]=l.x,B[j+H+9]=l.y,B[j+H+10]=l.z,B[j+H+11]=ht.itemSize===4?l.w:1)}}g={count:v,texture:T,size:new re(z,N)},s.set(p,g),p.addEventListener("dispose",q)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",h.morphTexture,i);else{let b=0;for(let S=0;S<d.length;S++)b+=d[S];const C=p.morphTargetsRelative?1:1-b;m.getUniforms().setValue(r,"morphTargetBaseInfluence",C),m.getUniforms().setValue(r,"morphTargetInfluences",d)}m.getUniforms().setValue(r,"morphTargetsTexture",g.texture,i),m.getUniforms().setValue(r,"morphTargetsTextureSize",g.size)}return{update:c}}function A1(r,t,i,s,l){let c=new WeakMap;function h(d){const _=l.render.frame,v=d.geometry,g=t.get(d,v);if(c.get(g)!==_&&(t.update(g),c.set(g,_)),d.isInstancedMesh&&(d.hasEventListener("dispose",m)===!1&&d.addEventListener("dispose",m),c.get(d)!==_&&(i.update(d.instanceMatrix,r.ARRAY_BUFFER),d.instanceColor!==null&&i.update(d.instanceColor,r.ARRAY_BUFFER),c.set(d,_))),d.isSkinnedMesh){const M=d.skeleton;c.get(M)!==_&&(M.update(),c.set(M,_))}return g}function p(){c=new WeakMap}function m(d){const _=d.target;_.removeEventListener("dispose",m),s.releaseStatesOfObject(_),i.remove(_.instanceMatrix),_.instanceColor!==null&&i.remove(_.instanceColor)}return{update:h,dispose:p}}const R1={[Gv]:"LINEAR_TONE_MAPPING",[Vv]:"REINHARD_TONE_MAPPING",[kv]:"CINEON_TONE_MAPPING",[pp]:"ACES_FILMIC_TONE_MAPPING",[jv]:"AGX_TONE_MAPPING",[Wv]:"NEUTRAL_TONE_MAPPING",[Xv]:"CUSTOM_TONE_MAPPING"};function C1(r,t,i,s,l){const c=new Zi(t,i,{type:r,depthBuffer:s,stencilBuffer:l,depthTexture:s?new Kr(t,i):void 0}),h=new Zi(t,i,{type:Aa,depthBuffer:!1,stencilBuffer:!1}),p=new pi;p.setAttribute("position",new $n([-1,3,0,-1,-1,0,3,-1,0],3)),p.setAttribute("uv",new $n([0,2,0,0,2,0],2));const m=new hE({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Fi(p,m),_=new Cp(-1,1,1,-1,0,1);let v=null,g=null,M=!1,b,C=null,S=[],y=!1;this.setSize=function(w,O){c.setSize(w,O),h.setSize(w,O);for(let P=0;P<S.length;P++){const z=S[P];z.setSize&&z.setSize(w,O)}},this.setEffects=function(w){S=w,y=S.length>0&&S[0].isRenderPass===!0;const O=c.width,P=c.height;for(let z=0;z<S.length;z++){const N=S[z];N.setSize&&N.setSize(O,P)}},this.begin=function(w,O){if(M||w.toneMapping===Yi&&S.length===0)return!1;if(C=O,O!==null){const P=O.width,z=O.height;(c.width!==P||c.height!==z)&&this.setSize(P,z)}return y===!1&&w.setRenderTarget(c),b=w.toneMapping,w.toneMapping=Yi,!0},this.hasRenderPass=function(){return y},this.end=function(w,O){w.toneMapping=b,M=!0;let P=c,z=h;for(let N=0;N<S.length;N++){const B=S[N];if(B.enabled!==!1&&(B.render(w,z,P,O),B.needsSwap!==!1)){const T=P;P=z,z=T}}if(v!==w.outputColorSpace||g!==w.toneMapping){v=w.outputColorSpace,g=w.toneMapping,m.defines={},Te.getTransfer(v)===ze&&(m.defines.SRGB_TRANSFER="");const N=R1[g];N&&(m.defines[N]=""),m.needsUpdate=!0}m.uniforms.tDiffuse.value=P.texture,w.setRenderTarget(C),w.render(d,_),C=null,M=!1},this.isCompositing=function(){return M},this.dispose=function(){c.depthTexture&&c.depthTexture.dispose(),c.dispose(),h.dispose(),p.dispose(),m.dispose()}}const _x=new Vn,op=new Kr(1,1),vx=new nx,xx=new zM,Sx=new cx,dv=[],pv=[],mv=new Float32Array(16),gv=new Float32Array(9),_v=new Float32Array(4);function $r(r,t,i){const s=r[0];if(s<=0||s>0)return r;const l=t*i;let c=dv[l];if(c===void 0&&(c=new Float32Array(l),dv[l]=c),t!==0){s.toArray(c,0);for(let h=1,p=0;h!==t;++h)p+=i,r[h].toArray(c,p)}return c}function yn(r,t){if(r.length!==t.length)return!1;for(let i=0,s=r.length;i<s;i++)if(r[i]!==t[i])return!1;return!0}function Mn(r,t){for(let i=0,s=t.length;i<s;i++)r[i]=t[i]}function Su(r,t){let i=pv[t];i===void 0&&(i=new Int32Array(t),pv[t]=i);for(let s=0;s!==t;++s)i[s]=r.allocateTextureUnit();return i}function w1(r,t){const i=this.cache;i[0]!==t&&(r.uniform1f(this.addr,t),i[0]=t)}function D1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(yn(i,t))return;r.uniform2fv(this.addr,t),Mn(i,t)}}function U1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(yn(i,t))return;r.uniform3fv(this.addr,t),Mn(i,t)}}function L1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(yn(i,t))return;r.uniform4fv(this.addr,t),Mn(i,t)}}function N1(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(yn(i,t))return;r.uniformMatrix2fv(this.addr,!1,t),Mn(i,t)}else{if(yn(i,s))return;_v.set(s),r.uniformMatrix2fv(this.addr,!1,_v),Mn(i,s)}}function O1(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(yn(i,t))return;r.uniformMatrix3fv(this.addr,!1,t),Mn(i,t)}else{if(yn(i,s))return;gv.set(s),r.uniformMatrix3fv(this.addr,!1,gv),Mn(i,s)}}function P1(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(yn(i,t))return;r.uniformMatrix4fv(this.addr,!1,t),Mn(i,t)}else{if(yn(i,s))return;mv.set(s),r.uniformMatrix4fv(this.addr,!1,mv),Mn(i,s)}}function I1(r,t){const i=this.cache;i[0]!==t&&(r.uniform1i(this.addr,t),i[0]=t)}function F1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(yn(i,t))return;r.uniform2iv(this.addr,t),Mn(i,t)}}function B1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(yn(i,t))return;r.uniform3iv(this.addr,t),Mn(i,t)}}function z1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(yn(i,t))return;r.uniform4iv(this.addr,t),Mn(i,t)}}function H1(r,t){const i=this.cache;i[0]!==t&&(r.uniform1ui(this.addr,t),i[0]=t)}function G1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(yn(i,t))return;r.uniform2uiv(this.addr,t),Mn(i,t)}}function V1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(yn(i,t))return;r.uniform3uiv(this.addr,t),Mn(i,t)}}function k1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(yn(i,t))return;r.uniform4uiv(this.addr,t),Mn(i,t)}}function X1(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l);let c;this.type===r.SAMPLER_2D_SHADOW?(op.compareFunction=i.isReversedDepthBuffer()?Mp:yp,c=op):c=_x,i.setTexture2D(t||c,l)}function j1(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture3D(t||xx,l)}function W1(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTextureCube(t||Sx,l)}function q1(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture2DArray(t||vx,l)}function Y1(r){switch(r){case 5126:return w1;case 35664:return D1;case 35665:return U1;case 35666:return L1;case 35674:return N1;case 35675:return O1;case 35676:return P1;case 5124:case 35670:return I1;case 35667:case 35671:return F1;case 35668:case 35672:return B1;case 35669:case 35673:return z1;case 5125:return H1;case 36294:return G1;case 36295:return V1;case 36296:return k1;case 35678:case 36198:case 36298:case 36306:case 35682:return X1;case 35679:case 36299:case 36307:return j1;case 35680:case 36300:case 36308:case 36293:return W1;case 36289:case 36303:case 36311:case 36292:return q1}}function Z1(r,t){r.uniform1fv(this.addr,t)}function K1(r,t){const i=$r(t,this.size,2);r.uniform2fv(this.addr,i)}function Q1(r,t){const i=$r(t,this.size,3);r.uniform3fv(this.addr,i)}function J1(r,t){const i=$r(t,this.size,4);r.uniform4fv(this.addr,i)}function $1(r,t){const i=$r(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,i)}function tA(r,t){const i=$r(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,i)}function eA(r,t){const i=$r(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,i)}function nA(r,t){r.uniform1iv(this.addr,t)}function iA(r,t){r.uniform2iv(this.addr,t)}function aA(r,t){r.uniform3iv(this.addr,t)}function sA(r,t){r.uniform4iv(this.addr,t)}function rA(r,t){r.uniform1uiv(this.addr,t)}function oA(r,t){r.uniform2uiv(this.addr,t)}function lA(r,t){r.uniform3uiv(this.addr,t)}function cA(r,t){r.uniform4uiv(this.addr,t)}function uA(r,t,i){const s=this.cache,l=t.length,c=Su(i,l);yn(s,c)||(r.uniform1iv(this.addr,c),Mn(s,c));let h;this.type===r.SAMPLER_2D_SHADOW?h=op:h=_x;for(let p=0;p!==l;++p)i.setTexture2D(t[p]||h,c[p])}function fA(r,t,i){const s=this.cache,l=t.length,c=Su(i,l);yn(s,c)||(r.uniform1iv(this.addr,c),Mn(s,c));for(let h=0;h!==l;++h)i.setTexture3D(t[h]||xx,c[h])}function hA(r,t,i){const s=this.cache,l=t.length,c=Su(i,l);yn(s,c)||(r.uniform1iv(this.addr,c),Mn(s,c));for(let h=0;h!==l;++h)i.setTextureCube(t[h]||Sx,c[h])}function dA(r,t,i){const s=this.cache,l=t.length,c=Su(i,l);yn(s,c)||(r.uniform1iv(this.addr,c),Mn(s,c));for(let h=0;h!==l;++h)i.setTexture2DArray(t[h]||vx,c[h])}function pA(r){switch(r){case 5126:return Z1;case 35664:return K1;case 35665:return Q1;case 35666:return J1;case 35674:return $1;case 35675:return tA;case 35676:return eA;case 5124:case 35670:return nA;case 35667:case 35671:return iA;case 35668:case 35672:return aA;case 35669:case 35673:return sA;case 5125:return rA;case 36294:return oA;case 36295:return lA;case 36296:return cA;case 35678:case 36198:case 36298:case 36306:case 35682:return uA;case 35679:case 36299:case 36307:return fA;case 35680:case 36300:case 36308:case 36293:return hA;case 36289:case 36303:case 36311:case 36292:return dA}}class mA{constructor(t,i,s){this.id=t,this.addr=s,this.cache=[],this.type=i.type,this.setValue=Y1(i.type)}}class gA{constructor(t,i,s){this.id=t,this.addr=s,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=pA(i.type)}}class _A{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,i,s){const l=this.seq;for(let c=0,h=l.length;c!==h;++c){const p=l[c];p.setValue(t,i[p.id],s)}}}const fd=/(\w+)(\])?(\[|\.)?/g;function vv(r,t){r.seq.push(t),r.map[t.id]=t}function vA(r,t,i){const s=r.name,l=s.length;for(fd.lastIndex=0;;){const c=fd.exec(s),h=fd.lastIndex;let p=c[1];const m=c[2]==="]",d=c[3];if(m&&(p=p|0),d===void 0||d==="["&&h+2===l){vv(i,d===void 0?new mA(p,r,t):new gA(p,r,t));break}else{let v=i.map[p];v===void 0&&(v=new _A(p),vv(i,v)),i=v}}}class su{constructor(t,i){this.seq=[],this.map={};const s=t.getProgramParameter(i,t.ACTIVE_UNIFORMS);for(let h=0;h<s;++h){const p=t.getActiveUniform(i,h),m=t.getUniformLocation(i,p.name);vA(p,m,this)}const l=[],c=[];for(const h of this.seq)h.type===t.SAMPLER_2D_SHADOW||h.type===t.SAMPLER_CUBE_SHADOW||h.type===t.SAMPLER_2D_ARRAY_SHADOW?l.push(h):c.push(h);l.length>0&&(this.seq=l.concat(c))}setValue(t,i,s,l){const c=this.map[i];c!==void 0&&c.setValue(t,s,l)}setOptional(t,i,s){const l=i[s];l!==void 0&&this.setValue(t,s,l)}static upload(t,i,s,l){for(let c=0,h=i.length;c!==h;++c){const p=i[c],m=s[p.id];m.needsUpdate!==!1&&p.setValue(t,m.value,l)}}static seqWithValue(t,i){const s=[];for(let l=0,c=t.length;l!==c;++l){const h=t[l];h.id in i&&s.push(h)}return s}}function xv(r,t,i){const s=r.createShader(t);return r.shaderSource(s,i),r.compileShader(s),s}const xA=37297;let SA=0;function yA(r,t){const i=r.split(`
`),s=[],l=Math.max(t-6,0),c=Math.min(t+6,i.length);for(let h=l;h<c;h++){const p=h+1;s.push(`${p===t?">":" "} ${p}: ${i[h]}`)}return s.join(`
`)}const Sv=new se;function MA(r){Te._getMatrix(Sv,Te.workingColorSpace,r);const t=`mat3( ${Sv.elements.map(i=>i.toFixed(4))} )`;switch(Te.getTransfer(r)){case uu:return[t,"LinearTransferOETF"];case ze:return[t,"sRGBTransferOETF"];default:return $t("WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function yv(r,t,i){const s=r.getShaderParameter(t,r.COMPILE_STATUS),c=(r.getShaderInfoLog(t)||"").trim();if(s&&c==="")return"";const h=/ERROR: 0:(\d+)/.exec(c);if(h){const p=parseInt(h[1]);return i.toUpperCase()+`

`+c+`

`+yA(r.getShaderSource(t),p)}else return c}function EA(r,t){const i=MA(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}const bA={[Gv]:"Linear",[Vv]:"Reinhard",[kv]:"Cineon",[pp]:"ACESFilmic",[jv]:"AgX",[Wv]:"Neutral",[Xv]:"Custom"};function TA(r,t){const i=bA[t];return i===void 0?($t("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Qc=new tt;function AA(){Te.getLuminanceCoefficients(Qc);const r=Qc.x.toFixed(4),t=Qc.y.toFixed(4),i=Qc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function RA(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(sl).join(`
`)}function CA(r){const t=[];for(const i in r){const s=r[i];s!==!1&&t.push("#define "+i+" "+s)}return t.join(`
`)}function wA(r,t){const i={},s=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let l=0;l<s;l++){const c=r.getActiveAttrib(t,l),h=c.name;let p=1;c.type===r.FLOAT_MAT2&&(p=2),c.type===r.FLOAT_MAT3&&(p=3),c.type===r.FLOAT_MAT4&&(p=4),i[h]={type:c.type,location:r.getAttribLocation(t,h),locationSize:p}}return i}function sl(r){return r!==""}function Mv(r,t){const i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ev(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const DA=/^[ \t]*#include +<([\w\d./]+)>/gm;function lp(r){return r.replace(DA,LA)}const UA=new Map;function LA(r,t){let i=fe[t];if(i===void 0){const s=UA.get(t);if(s!==void 0)i=fe[s],$t('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,s);else throw new Error("Can not resolve #include <"+t+">")}return lp(i)}const NA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function bv(r){return r.replace(NA,OA)}function OA(r,t,i,s){let l="";for(let c=parseInt(t);c<parseInt(i);c++)l+=s.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return l}function Tv(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const PA={[tu]:"SHADOWMAP_TYPE_PCF",[il]:"SHADOWMAP_TYPE_VSM"};function IA(r){return PA[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const FA={[Ws]:"ENVMAP_TYPE_CUBE",[Zr]:"ENVMAP_TYPE_CUBE",[_u]:"ENVMAP_TYPE_CUBE_UV"};function BA(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":FA[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const zA={[Zr]:"ENVMAP_MODE_REFRACTION"};function HA(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":zA[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const GA={[Hv]:"ENVMAP_BLENDING_MULTIPLY",[_M]:"ENVMAP_BLENDING_MIX",[vM]:"ENVMAP_BLENDING_ADD"};function VA(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":GA[r.combine]||"ENVMAP_BLENDING_NONE"}function kA(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const i=Math.log2(t)-2,s=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:s,maxMip:i}}function XA(r,t,i,s){const l=r.getContext(),c=i.defines;let h=i.vertexShader,p=i.fragmentShader;const m=IA(i),d=BA(i),_=HA(i),v=VA(i),g=kA(i),M=RA(i),b=CA(c),C=l.createProgram();let S,y,w=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(S=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(sl).join(`
`),S.length>0&&(S+=`
`),y=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(sl).join(`
`),y.length>0&&(y+=`
`)):(S=[Tv(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+_:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexNormals?"#define HAS_NORMAL":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(sl).join(`
`),y=[Tv(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+d:"",i.envMap?"#define "+_:"",i.envMap?"#define "+v:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor?"#define USE_COLOR":"",i.vertexAlphas||i.batchingColor?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Yi?"#define TONE_MAPPING":"",i.toneMapping!==Yi?fe.tonemapping_pars_fragment:"",i.toneMapping!==Yi?TA("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",fe.colorspace_pars_fragment,EA("linearToOutputTexel",i.outputColorSpace),AA(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(sl).join(`
`)),h=lp(h),h=Mv(h,i),h=Ev(h,i),p=lp(p),p=Mv(p,i),p=Ev(p,i),h=bv(h),p=bv(p),i.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,S=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,y=["#define varying in",i.glslVersion===D_?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===D_?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const O=w+S+h,P=w+y+p,z=xv(l,l.VERTEX_SHADER,O),N=xv(l,l.FRAGMENT_SHADER,P);l.attachShader(C,z),l.attachShader(C,N),i.index0AttributeName!==void 0?l.bindAttribLocation(C,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(C,0,"position"),l.linkProgram(C);function B(G){if(r.debug.checkShaderErrors){const $=l.getProgramInfoLog(C)||"",ut=l.getShaderInfoLog(z)||"",ht=l.getShaderInfoLog(N)||"",j=$.trim(),L=ut.trim(),H=ht.trim();let et=!0,gt=!0;if(l.getProgramParameter(C,l.LINK_STATUS)===!1)if(et=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(l,C,z,N);else{const yt=yv(l,z,"vertex"),I=yv(l,N,"fragment");Ae("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(C,l.VALIDATE_STATUS)+`

Material Name: `+G.name+`
Material Type: `+G.type+`

Program Info Log: `+j+`
`+yt+`
`+I)}else j!==""?$t("WebGLProgram: Program Info Log:",j):(L===""||H==="")&&(gt=!1);gt&&(G.diagnostics={runnable:et,programLog:j,vertexShader:{log:L,prefix:S},fragmentShader:{log:H,prefix:y}})}l.deleteShader(z),l.deleteShader(N),T=new su(l,C),F=wA(l,C)}let T;this.getUniforms=function(){return T===void 0&&B(this),T};let F;this.getAttributes=function(){return F===void 0&&B(this),F};let q=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return q===!1&&(q=l.getProgramParameter(C,xA)),q},this.destroy=function(){s.releaseStatesOfProgram(this),l.deleteProgram(C),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=SA++,this.cacheKey=t,this.usedTimes=1,this.program=C,this.vertexShader=z,this.fragmentShader=N,this}let jA=0;class WA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const i=t.vertexShader,s=t.fragmentShader,l=this._getShaderStage(i),c=this._getShaderStage(s),h=this._getShaderCacheForMaterial(t);return h.has(l)===!1&&(h.add(l),l.usedTimes++),h.has(c)===!1&&(h.add(c),c.usedTimes++),this}remove(t){const i=this.materialCache.get(t);for(const s of i)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const i=this.materialCache;let s=i.get(t);return s===void 0&&(s=new Set,i.set(t,s)),s}_getShaderStage(t){const i=this.shaderCache;let s=i.get(t);return s===void 0&&(s=new qA(t),i.set(t,s)),s}}class qA{constructor(t){this.id=jA++,this.code=t,this.usedTimes=0}}function YA(r){return r===qs||r===ou||r===lu}function ZA(r,t,i,s,l,c){const h=new ix,p=new WA,m=new Set,d=[],_=new Map,v=s.logarithmicDepthBuffer;let g=s.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(T){return m.add(T),T===0?"uv":`uv${T}`}function C(T,F,q,G,$,ut){const ht=G.fog,j=$.geometry,L=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?G.environment:null,H=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap,et=t.get(T.envMap||L,H),gt=et&&et.mapping===_u?et.image.height:null,yt=M[T.type];T.precision!==null&&(g=s.getMaxPrecision(T.precision),g!==T.precision&&$t("WebGLProgram.getParameters:",T.precision,"not supported, using",g,"instead."));const I=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,Q=I!==void 0?I.length:0;let St=0;j.morphAttributes.position!==void 0&&(St=1),j.morphAttributes.normal!==void 0&&(St=2),j.morphAttributes.color!==void 0&&(St=3);let bt,K,Z,Mt;if(yt){const ee=ji[yt];bt=ee.vertexShader,K=ee.fragmentShader}else bt=T.vertexShader,K=T.fragmentShader,p.update(T),Z=p.getVertexShaderID(T),Mt=p.getFragmentShaderID(T);const At=r.getRenderTarget(),Ht=r.state.buffers.depth.getReversed(),te=$.isInstancedMesh===!0,Qt=$.isBatchedMesh===!0,je=!!T.map,pe=!!T.matcap,ye=!!et,Ne=!!T.aoMap,ce=!!T.lightMap,ln=!!T.bumpMap,Ye=!!T.normalMap,An=!!T.displacementMap,W=!!T.emissiveMap,en=!!T.metalnessMap,me=!!T.roughnessMap,He=T.anisotropy>0,Ct=T.clearcoat>0,Qe=T.dispersion>0,D=T.iridescence>0,E=T.sheen>0,nt=T.transmission>0,vt=He&&!!T.anisotropyMap,Tt=Ct&&!!T.clearcoatMap,wt=Ct&&!!T.clearcoatNormalMap,Nt=Ct&&!!T.clearcoatRoughnessMap,ft=D&&!!T.iridescenceMap,dt=D&&!!T.iridescenceThicknessMap,Ot=E&&!!T.sheenColorMap,Pt=E&&!!T.sheenRoughnessMap,Ut=!!T.specularMap,Dt=!!T.specularColorMap,ne=!!T.specularIntensityMap,ie=nt&&!!T.transmissionMap,_e=nt&&!!T.thicknessMap,k=!!T.gradientMap,Rt=!!T.alphaMap,mt=T.alphaTest>0,Bt=!!T.alphaHash,Lt=!!T.extensions;let Et=Yi;T.toneMapped&&(At===null||At.isXRRenderTarget===!0)&&(Et=r.toneMapping);const Wt={shaderID:yt,shaderType:T.type,shaderName:T.name,vertexShader:bt,fragmentShader:K,defines:T.defines,customVertexShaderID:Z,customFragmentShaderID:Mt,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:g,batching:Qt,batchingColor:Qt&&$._colorsTexture!==null,instancing:te,instancingColor:te&&$.instanceColor!==null,instancingMorph:te&&$.morphTexture!==null,outputColorSpace:At===null?r.outputColorSpace:At.isXRRenderTarget===!0?At.texture.colorSpace:Te.workingColorSpace,alphaToCoverage:!!T.alphaToCoverage,map:je,matcap:pe,envMap:ye,envMapMode:ye&&et.mapping,envMapCubeUVHeight:gt,aoMap:Ne,lightMap:ce,bumpMap:ln,normalMap:Ye,displacementMap:An,emissiveMap:W,normalMapObjectSpace:Ye&&T.normalMapType===yM,normalMapTangentSpace:Ye&&T.normalMapType===ap,packedNormalMap:Ye&&T.normalMapType===ap&&YA(T.normalMap.format),metalnessMap:en,roughnessMap:me,anisotropy:He,anisotropyMap:vt,clearcoat:Ct,clearcoatMap:Tt,clearcoatNormalMap:wt,clearcoatRoughnessMap:Nt,dispersion:Qe,iridescence:D,iridescenceMap:ft,iridescenceThicknessMap:dt,sheen:E,sheenColorMap:Ot,sheenRoughnessMap:Pt,specularMap:Ut,specularColorMap:Dt,specularIntensityMap:ne,transmission:nt,transmissionMap:ie,thicknessMap:_e,gradientMap:k,opaque:T.transparent===!1&&T.blending===Wr&&T.alphaToCoverage===!1,alphaMap:Rt,alphaTest:mt,alphaHash:Bt,combine:T.combine,mapUv:je&&b(T.map.channel),aoMapUv:Ne&&b(T.aoMap.channel),lightMapUv:ce&&b(T.lightMap.channel),bumpMapUv:ln&&b(T.bumpMap.channel),normalMapUv:Ye&&b(T.normalMap.channel),displacementMapUv:An&&b(T.displacementMap.channel),emissiveMapUv:W&&b(T.emissiveMap.channel),metalnessMapUv:en&&b(T.metalnessMap.channel),roughnessMapUv:me&&b(T.roughnessMap.channel),anisotropyMapUv:vt&&b(T.anisotropyMap.channel),clearcoatMapUv:Tt&&b(T.clearcoatMap.channel),clearcoatNormalMapUv:wt&&b(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Nt&&b(T.clearcoatRoughnessMap.channel),iridescenceMapUv:ft&&b(T.iridescenceMap.channel),iridescenceThicknessMapUv:dt&&b(T.iridescenceThicknessMap.channel),sheenColorMapUv:Ot&&b(T.sheenColorMap.channel),sheenRoughnessMapUv:Pt&&b(T.sheenRoughnessMap.channel),specularMapUv:Ut&&b(T.specularMap.channel),specularColorMapUv:Dt&&b(T.specularColorMap.channel),specularIntensityMapUv:ne&&b(T.specularIntensityMap.channel),transmissionMapUv:ie&&b(T.transmissionMap.channel),thicknessMapUv:_e&&b(T.thicknessMap.channel),alphaMapUv:Rt&&b(T.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(Ye||He),vertexNormals:!!j.attributes.normal,vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!j.attributes.uv&&(je||Rt),fog:!!ht,useFog:T.fog===!0,fogExp2:!!ht&&ht.isFogExp2,flatShading:T.wireframe===!1&&(T.flatShading===!0||j.attributes.normal===void 0&&Ye===!1&&(T.isMeshLambertMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isMeshPhysicalMaterial)),sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:v,reversedDepthBuffer:Ht,skinning:$.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:St,numDirLights:F.directional.length,numPointLights:F.point.length,numSpotLights:F.spot.length,numSpotLightMaps:F.spotLightMap.length,numRectAreaLights:F.rectArea.length,numHemiLights:F.hemi.length,numDirLightShadows:F.directionalShadowMap.length,numPointLightShadows:F.pointShadowMap.length,numSpotLightShadows:F.spotShadowMap.length,numSpotLightShadowsWithMaps:F.numSpotLightShadowsWithMaps,numLightProbes:F.numLightProbes,numLightProbeGrids:ut.length,numClippingPlanes:c.numPlanes,numClipIntersection:c.numIntersection,dithering:T.dithering,shadowMapEnabled:r.shadowMap.enabled&&q.length>0,shadowMapType:r.shadowMap.type,toneMapping:Et,decodeVideoTexture:je&&T.map.isVideoTexture===!0&&Te.getTransfer(T.map.colorSpace)===ze,decodeVideoTextureEmissive:W&&T.emissiveMap.isVideoTexture===!0&&Te.getTransfer(T.emissiveMap.colorSpace)===ze,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===Ma,flipSided:T.side===Jn,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Lt&&T.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Lt&&T.extensions.multiDraw===!0||Qt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return Wt.vertexUv1s=m.has(1),Wt.vertexUv2s=m.has(2),Wt.vertexUv3s=m.has(3),m.clear(),Wt}function S(T){const F=[];if(T.shaderID?F.push(T.shaderID):(F.push(T.customVertexShaderID),F.push(T.customFragmentShaderID)),T.defines!==void 0)for(const q in T.defines)F.push(q),F.push(T.defines[q]);return T.isRawShaderMaterial===!1&&(y(F,T),w(F,T),F.push(r.outputColorSpace)),F.push(T.customProgramCacheKey),F.join()}function y(T,F){T.push(F.precision),T.push(F.outputColorSpace),T.push(F.envMapMode),T.push(F.envMapCubeUVHeight),T.push(F.mapUv),T.push(F.alphaMapUv),T.push(F.lightMapUv),T.push(F.aoMapUv),T.push(F.bumpMapUv),T.push(F.normalMapUv),T.push(F.displacementMapUv),T.push(F.emissiveMapUv),T.push(F.metalnessMapUv),T.push(F.roughnessMapUv),T.push(F.anisotropyMapUv),T.push(F.clearcoatMapUv),T.push(F.clearcoatNormalMapUv),T.push(F.clearcoatRoughnessMapUv),T.push(F.iridescenceMapUv),T.push(F.iridescenceThicknessMapUv),T.push(F.sheenColorMapUv),T.push(F.sheenRoughnessMapUv),T.push(F.specularMapUv),T.push(F.specularColorMapUv),T.push(F.specularIntensityMapUv),T.push(F.transmissionMapUv),T.push(F.thicknessMapUv),T.push(F.combine),T.push(F.fogExp2),T.push(F.sizeAttenuation),T.push(F.morphTargetsCount),T.push(F.morphAttributeCount),T.push(F.numDirLights),T.push(F.numPointLights),T.push(F.numSpotLights),T.push(F.numSpotLightMaps),T.push(F.numHemiLights),T.push(F.numRectAreaLights),T.push(F.numDirLightShadows),T.push(F.numPointLightShadows),T.push(F.numSpotLightShadows),T.push(F.numSpotLightShadowsWithMaps),T.push(F.numLightProbes),T.push(F.shadowMapType),T.push(F.toneMapping),T.push(F.numClippingPlanes),T.push(F.numClipIntersection),T.push(F.depthPacking)}function w(T,F){h.disableAll(),F.instancing&&h.enable(0),F.instancingColor&&h.enable(1),F.instancingMorph&&h.enable(2),F.matcap&&h.enable(3),F.envMap&&h.enable(4),F.normalMapObjectSpace&&h.enable(5),F.normalMapTangentSpace&&h.enable(6),F.clearcoat&&h.enable(7),F.iridescence&&h.enable(8),F.alphaTest&&h.enable(9),F.vertexColors&&h.enable(10),F.vertexAlphas&&h.enable(11),F.vertexUv1s&&h.enable(12),F.vertexUv2s&&h.enable(13),F.vertexUv3s&&h.enable(14),F.vertexTangents&&h.enable(15),F.anisotropy&&h.enable(16),F.alphaHash&&h.enable(17),F.batching&&h.enable(18),F.dispersion&&h.enable(19),F.batchingColor&&h.enable(20),F.gradientMap&&h.enable(21),F.packedNormalMap&&h.enable(22),F.vertexNormals&&h.enable(23),T.push(h.mask),h.disableAll(),F.fog&&h.enable(0),F.useFog&&h.enable(1),F.flatShading&&h.enable(2),F.logarithmicDepthBuffer&&h.enable(3),F.reversedDepthBuffer&&h.enable(4),F.skinning&&h.enable(5),F.morphTargets&&h.enable(6),F.morphNormals&&h.enable(7),F.morphColors&&h.enable(8),F.premultipliedAlpha&&h.enable(9),F.shadowMapEnabled&&h.enable(10),F.doubleSided&&h.enable(11),F.flipSided&&h.enable(12),F.useDepthPacking&&h.enable(13),F.dithering&&h.enable(14),F.transmission&&h.enable(15),F.sheen&&h.enable(16),F.opaque&&h.enable(17),F.pointsUvs&&h.enable(18),F.decodeVideoTexture&&h.enable(19),F.decodeVideoTextureEmissive&&h.enable(20),F.alphaToCoverage&&h.enable(21),F.numLightProbeGrids>0&&h.enable(22),T.push(h.mask)}function O(T){const F=M[T.type];let q;if(F){const G=ji[F];q=cE.clone(G.uniforms)}else q=T.uniforms;return q}function P(T,F){let q=_.get(F);return q!==void 0?++q.usedTimes:(q=new XA(r,F,T,l),d.push(q),_.set(F,q)),q}function z(T){if(--T.usedTimes===0){const F=d.indexOf(T);d[F]=d[d.length-1],d.pop(),_.delete(T.cacheKey),T.destroy()}}function N(T){p.remove(T)}function B(){p.dispose()}return{getParameters:C,getProgramCacheKey:S,getUniforms:O,acquireProgram:P,releaseProgram:z,releaseShaderCache:N,programs:d,dispose:B}}function KA(){let r=new WeakMap;function t(h){return r.has(h)}function i(h){let p=r.get(h);return p===void 0&&(p={},r.set(h,p)),p}function s(h){r.delete(h)}function l(h,p,m){r.get(h)[p]=m}function c(){r=new WeakMap}return{has:t,get:i,remove:s,update:l,dispose:c}}function QA(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.materialVariant!==t.materialVariant?r.materialVariant-t.materialVariant:r.z!==t.z?r.z-t.z:r.id-t.id}function Av(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function Rv(){const r=[];let t=0;const i=[],s=[],l=[];function c(){t=0,i.length=0,s.length=0,l.length=0}function h(g){let M=0;return g.isInstancedMesh&&(M+=2),g.isSkinnedMesh&&(M+=1),M}function p(g,M,b,C,S,y){let w=r[t];return w===void 0?(w={id:g.id,object:g,geometry:M,material:b,materialVariant:h(g),groupOrder:C,renderOrder:g.renderOrder,z:S,group:y},r[t]=w):(w.id=g.id,w.object=g,w.geometry=M,w.material=b,w.materialVariant=h(g),w.groupOrder=C,w.renderOrder=g.renderOrder,w.z=S,w.group=y),t++,w}function m(g,M,b,C,S,y){const w=p(g,M,b,C,S,y);b.transmission>0?s.push(w):b.transparent===!0?l.push(w):i.push(w)}function d(g,M,b,C,S,y){const w=p(g,M,b,C,S,y);b.transmission>0?s.unshift(w):b.transparent===!0?l.unshift(w):i.unshift(w)}function _(g,M){i.length>1&&i.sort(g||QA),s.length>1&&s.sort(M||Av),l.length>1&&l.sort(M||Av)}function v(){for(let g=t,M=r.length;g<M;g++){const b=r[g];if(b.id===null)break;b.id=null,b.object=null,b.geometry=null,b.material=null,b.group=null}}return{opaque:i,transmissive:s,transparent:l,init:c,push:m,unshift:d,finish:v,sort:_}}function JA(){let r=new WeakMap;function t(s,l){const c=r.get(s);let h;return c===void 0?(h=new Rv,r.set(s,[h])):l>=c.length?(h=new Rv,c.push(h)):h=c[l],h}function i(){r=new WeakMap}return{get:t,dispose:i}}function $A(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={direction:new tt,color:new de};break;case"SpotLight":i={position:new tt,direction:new tt,color:new de,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new tt,color:new de,distance:0,decay:0};break;case"HemisphereLight":i={direction:new tt,skyColor:new de,groundColor:new de};break;case"RectAreaLight":i={color:new de,position:new tt,halfWidth:new tt,halfHeight:new tt};break}return r[t.id]=i,i}}}function tR(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=i,i}}}let eR=0;function nR(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function iR(r){const t=new $A,i=tR(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)s.probe.push(new tt);const l=new tt,c=new on,h=new on;function p(d){let _=0,v=0,g=0;for(let F=0;F<9;F++)s.probe[F].set(0,0,0);let M=0,b=0,C=0,S=0,y=0,w=0,O=0,P=0,z=0,N=0,B=0;d.sort(nR);for(let F=0,q=d.length;F<q;F++){const G=d[F],$=G.color,ut=G.intensity,ht=G.distance;let j=null;if(G.shadow&&G.shadow.map&&(G.shadow.map.texture.format===qs?j=G.shadow.map.texture:j=G.shadow.map.depthTexture||G.shadow.map.texture),G.isAmbientLight)_+=$.r*ut,v+=$.g*ut,g+=$.b*ut;else if(G.isLightProbe){for(let L=0;L<9;L++)s.probe[L].addScaledVector(G.sh.coefficients[L],ut);B++}else if(G.isDirectionalLight){const L=t.get(G);if(L.color.copy(G.color).multiplyScalar(G.intensity),G.castShadow){const H=G.shadow,et=i.get(G);et.shadowIntensity=H.intensity,et.shadowBias=H.bias,et.shadowNormalBias=H.normalBias,et.shadowRadius=H.radius,et.shadowMapSize=H.mapSize,s.directionalShadow[M]=et,s.directionalShadowMap[M]=j,s.directionalShadowMatrix[M]=G.shadow.matrix,w++}s.directional[M]=L,M++}else if(G.isSpotLight){const L=t.get(G);L.position.setFromMatrixPosition(G.matrixWorld),L.color.copy($).multiplyScalar(ut),L.distance=ht,L.coneCos=Math.cos(G.angle),L.penumbraCos=Math.cos(G.angle*(1-G.penumbra)),L.decay=G.decay,s.spot[C]=L;const H=G.shadow;if(G.map&&(s.spotLightMap[z]=G.map,z++,H.updateMatrices(G),G.castShadow&&N++),s.spotLightMatrix[C]=H.matrix,G.castShadow){const et=i.get(G);et.shadowIntensity=H.intensity,et.shadowBias=H.bias,et.shadowNormalBias=H.normalBias,et.shadowRadius=H.radius,et.shadowMapSize=H.mapSize,s.spotShadow[C]=et,s.spotShadowMap[C]=j,P++}C++}else if(G.isRectAreaLight){const L=t.get(G);L.color.copy($).multiplyScalar(ut),L.halfWidth.set(G.width*.5,0,0),L.halfHeight.set(0,G.height*.5,0),s.rectArea[S]=L,S++}else if(G.isPointLight){const L=t.get(G);if(L.color.copy(G.color).multiplyScalar(G.intensity),L.distance=G.distance,L.decay=G.decay,G.castShadow){const H=G.shadow,et=i.get(G);et.shadowIntensity=H.intensity,et.shadowBias=H.bias,et.shadowNormalBias=H.normalBias,et.shadowRadius=H.radius,et.shadowMapSize=H.mapSize,et.shadowCameraNear=H.camera.near,et.shadowCameraFar=H.camera.far,s.pointShadow[b]=et,s.pointShadowMap[b]=j,s.pointShadowMatrix[b]=G.shadow.matrix,O++}s.point[b]=L,b++}else if(G.isHemisphereLight){const L=t.get(G);L.skyColor.copy(G.color).multiplyScalar(ut),L.groundColor.copy(G.groundColor).multiplyScalar(ut),s.hemi[y]=L,y++}}S>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=zt.LTC_FLOAT_1,s.rectAreaLTC2=zt.LTC_FLOAT_2):(s.rectAreaLTC1=zt.LTC_HALF_1,s.rectAreaLTC2=zt.LTC_HALF_2)),s.ambient[0]=_,s.ambient[1]=v,s.ambient[2]=g;const T=s.hash;(T.directionalLength!==M||T.pointLength!==b||T.spotLength!==C||T.rectAreaLength!==S||T.hemiLength!==y||T.numDirectionalShadows!==w||T.numPointShadows!==O||T.numSpotShadows!==P||T.numSpotMaps!==z||T.numLightProbes!==B)&&(s.directional.length=M,s.spot.length=C,s.rectArea.length=S,s.point.length=b,s.hemi.length=y,s.directionalShadow.length=w,s.directionalShadowMap.length=w,s.pointShadow.length=O,s.pointShadowMap.length=O,s.spotShadow.length=P,s.spotShadowMap.length=P,s.directionalShadowMatrix.length=w,s.pointShadowMatrix.length=O,s.spotLightMatrix.length=P+z-N,s.spotLightMap.length=z,s.numSpotLightShadowsWithMaps=N,s.numLightProbes=B,T.directionalLength=M,T.pointLength=b,T.spotLength=C,T.rectAreaLength=S,T.hemiLength=y,T.numDirectionalShadows=w,T.numPointShadows=O,T.numSpotShadows=P,T.numSpotMaps=z,T.numLightProbes=B,s.version=eR++)}function m(d,_){let v=0,g=0,M=0,b=0,C=0;const S=_.matrixWorldInverse;for(let y=0,w=d.length;y<w;y++){const O=d[y];if(O.isDirectionalLight){const P=s.directional[v];P.direction.setFromMatrixPosition(O.matrixWorld),l.setFromMatrixPosition(O.target.matrixWorld),P.direction.sub(l),P.direction.transformDirection(S),v++}else if(O.isSpotLight){const P=s.spot[M];P.position.setFromMatrixPosition(O.matrixWorld),P.position.applyMatrix4(S),P.direction.setFromMatrixPosition(O.matrixWorld),l.setFromMatrixPosition(O.target.matrixWorld),P.direction.sub(l),P.direction.transformDirection(S),M++}else if(O.isRectAreaLight){const P=s.rectArea[b];P.position.setFromMatrixPosition(O.matrixWorld),P.position.applyMatrix4(S),h.identity(),c.copy(O.matrixWorld),c.premultiply(S),h.extractRotation(c),P.halfWidth.set(O.width*.5,0,0),P.halfHeight.set(0,O.height*.5,0),P.halfWidth.applyMatrix4(h),P.halfHeight.applyMatrix4(h),b++}else if(O.isPointLight){const P=s.point[g];P.position.setFromMatrixPosition(O.matrixWorld),P.position.applyMatrix4(S),g++}else if(O.isHemisphereLight){const P=s.hemi[C];P.direction.setFromMatrixPosition(O.matrixWorld),P.direction.transformDirection(S),C++}}}return{setup:p,setupView:m,state:s}}function Cv(r){const t=new iR(r),i=[],s=[],l=[];function c(g){v.camera=g,i.length=0,s.length=0,l.length=0}function h(g){i.push(g)}function p(g){s.push(g)}function m(g){l.push(g)}function d(){t.setup(i)}function _(g){t.setupView(i,g)}const v={lightsArray:i,shadowsArray:s,lightProbeGridArray:l,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:c,state:v,setupLights:d,setupLightsView:_,pushLight:h,pushShadow:p,pushLightProbeGrid:m}}function aR(r){let t=new WeakMap;function i(l,c=0){const h=t.get(l);let p;return h===void 0?(p=new Cv(r),t.set(l,[p])):c>=h.length?(p=new Cv(r),h.push(p)):p=h[c],p}function s(){t=new WeakMap}return{get:i,dispose:s}}const sR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rR=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,oR=[new tt(1,0,0),new tt(-1,0,0),new tt(0,1,0),new tt(0,-1,0),new tt(0,0,1),new tt(0,0,-1)],lR=[new tt(0,-1,0),new tt(0,-1,0),new tt(0,0,1),new tt(0,0,-1),new tt(0,-1,0),new tt(0,-1,0)],wv=new on,nl=new tt,hd=new tt;function cR(r,t,i){let s=new Ap;const l=new re,c=new re,h=new rn,p=new mE,m=new gE,d={},_=i.maxTextureSize,v={[ds]:Jn,[Jn]:ds,[Ma]:Ma},g=new Qi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new re},radius:{value:4}},vertexShader:sR,fragmentShader:rR}),M=g.clone();M.defines.HORIZONTAL_PASS=1;const b=new pi;b.setAttribute("position",new di(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const C=new Fi(b,g),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tu;let y=this.type;this.render=function(N,B,T){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||N.length===0)return;this.type===zv&&($t("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=tu);const F=r.getRenderTarget(),q=r.getActiveCubeFace(),G=r.getActiveMipmapLevel(),$=r.state;$.setBlending(ba),$.buffers.depth.getReversed()===!0?$.buffers.color.setClear(0,0,0,0):$.buffers.color.setClear(1,1,1,1),$.buffers.depth.setTest(!0),$.setScissorTest(!1);const ut=y!==this.type;ut&&B.traverse(function(ht){ht.material&&(Array.isArray(ht.material)?ht.material.forEach(j=>j.needsUpdate=!0):ht.material.needsUpdate=!0)});for(let ht=0,j=N.length;ht<j;ht++){const L=N[ht],H=L.shadow;if(H===void 0){$t("WebGLShadowMap:",L,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;l.copy(H.mapSize);const et=H.getFrameExtents();l.multiply(et),c.copy(H.mapSize),(l.x>_||l.y>_)&&(l.x>_&&(c.x=Math.floor(_/et.x),l.x=c.x*et.x,H.mapSize.x=c.x),l.y>_&&(c.y=Math.floor(_/et.y),l.y=c.y*et.y,H.mapSize.y=c.y));const gt=r.state.buffers.depth.getReversed();if(H.camera._reversedDepth=gt,H.map===null||ut===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===il){if(L.isPointLight){$t("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Zi(l.x,l.y,{format:qs,type:Aa,minFilter:Bn,magFilter:Bn,generateMipmaps:!1}),H.map.texture.name=L.name+".shadowMap",H.map.depthTexture=new Kr(l.x,l.y,Wi),H.map.depthTexture.name=L.name+".shadowMapDepth",H.map.depthTexture.format=Ra,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Ln,H.map.depthTexture.magFilter=Ln}else L.isPointLight?(H.map=new gx(l.x),H.map.depthTexture=new sE(l.x,Ki)):(H.map=new Zi(l.x,l.y),H.map.depthTexture=new Kr(l.x,l.y,Ki)),H.map.depthTexture.name=L.name+".shadowMap",H.map.depthTexture.format=Ra,this.type===tu?(H.map.depthTexture.compareFunction=gt?Mp:yp,H.map.depthTexture.minFilter=Bn,H.map.depthTexture.magFilter=Bn):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Ln,H.map.depthTexture.magFilter=Ln);H.camera.updateProjectionMatrix()}const yt=H.map.isWebGLCubeRenderTarget?6:1;for(let I=0;I<yt;I++){if(H.map.isWebGLCubeRenderTarget)r.setRenderTarget(H.map,I),r.clear();else{I===0&&(r.setRenderTarget(H.map),r.clear());const Q=H.getViewport(I);h.set(c.x*Q.x,c.y*Q.y,c.x*Q.z,c.y*Q.w),$.viewport(h)}if(L.isPointLight){const Q=H.camera,St=H.matrix,bt=L.distance||Q.far;bt!==Q.far&&(Q.far=bt,Q.updateProjectionMatrix()),nl.setFromMatrixPosition(L.matrixWorld),Q.position.copy(nl),hd.copy(Q.position),hd.add(oR[I]),Q.up.copy(lR[I]),Q.lookAt(hd),Q.updateMatrixWorld(),St.makeTranslation(-nl.x,-nl.y,-nl.z),wv.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),H._frustum.setFromProjectionMatrix(wv,Q.coordinateSystem,Q.reversedDepth)}else H.updateMatrices(L);s=H.getFrustum(),P(B,T,H.camera,L,this.type)}H.isPointLightShadow!==!0&&this.type===il&&w(H,T),H.needsUpdate=!1}y=this.type,S.needsUpdate=!1,r.setRenderTarget(F,q,G)};function w(N,B){const T=t.update(C);g.defines.VSM_SAMPLES!==N.blurSamples&&(g.defines.VSM_SAMPLES=N.blurSamples,M.defines.VSM_SAMPLES=N.blurSamples,g.needsUpdate=!0,M.needsUpdate=!0),N.mapPass===null&&(N.mapPass=new Zi(l.x,l.y,{format:qs,type:Aa})),g.uniforms.shadow_pass.value=N.map.depthTexture,g.uniforms.resolution.value=N.mapSize,g.uniforms.radius.value=N.radius,r.setRenderTarget(N.mapPass),r.clear(),r.renderBufferDirect(B,null,T,g,C,null),M.uniforms.shadow_pass.value=N.mapPass.texture,M.uniforms.resolution.value=N.mapSize,M.uniforms.radius.value=N.radius,r.setRenderTarget(N.map),r.clear(),r.renderBufferDirect(B,null,T,M,C,null)}function O(N,B,T,F){let q=null;const G=T.isPointLight===!0?N.customDistanceMaterial:N.customDepthMaterial;if(G!==void 0)q=G;else if(q=T.isPointLight===!0?m:p,r.localClippingEnabled&&B.clipShadows===!0&&Array.isArray(B.clippingPlanes)&&B.clippingPlanes.length!==0||B.displacementMap&&B.displacementScale!==0||B.alphaMap&&B.alphaTest>0||B.map&&B.alphaTest>0||B.alphaToCoverage===!0){const $=q.uuid,ut=B.uuid;let ht=d[$];ht===void 0&&(ht={},d[$]=ht);let j=ht[ut];j===void 0&&(j=q.clone(),ht[ut]=j,B.addEventListener("dispose",z)),q=j}if(q.visible=B.visible,q.wireframe=B.wireframe,F===il?q.side=B.shadowSide!==null?B.shadowSide:B.side:q.side=B.shadowSide!==null?B.shadowSide:v[B.side],q.alphaMap=B.alphaMap,q.alphaTest=B.alphaToCoverage===!0?.5:B.alphaTest,q.map=B.map,q.clipShadows=B.clipShadows,q.clippingPlanes=B.clippingPlanes,q.clipIntersection=B.clipIntersection,q.displacementMap=B.displacementMap,q.displacementScale=B.displacementScale,q.displacementBias=B.displacementBias,q.wireframeLinewidth=B.wireframeLinewidth,q.linewidth=B.linewidth,T.isPointLight===!0&&q.isMeshDistanceMaterial===!0){const $=r.properties.get(q);$.light=T}return q}function P(N,B,T,F,q){if(N.visible===!1)return;if(N.layers.test(B.layers)&&(N.isMesh||N.isLine||N.isPoints)&&(N.castShadow||N.receiveShadow&&q===il)&&(!N.frustumCulled||s.intersectsObject(N))){N.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,N.matrixWorld);const ut=t.update(N),ht=N.material;if(Array.isArray(ht)){const j=ut.groups;for(let L=0,H=j.length;L<H;L++){const et=j[L],gt=ht[et.materialIndex];if(gt&&gt.visible){const yt=O(N,gt,F,q);N.onBeforeShadow(r,N,B,T,ut,yt,et),r.renderBufferDirect(T,null,ut,yt,N,et),N.onAfterShadow(r,N,B,T,ut,yt,et)}}}else if(ht.visible){const j=O(N,ht,F,q);N.onBeforeShadow(r,N,B,T,ut,j,null),r.renderBufferDirect(T,null,ut,j,N,null),N.onAfterShadow(r,N,B,T,ut,j,null)}}const $=N.children;for(let ut=0,ht=$.length;ut<ht;ut++)P($[ut],B,T,F,q)}function z(N){N.target.removeEventListener("dispose",z);for(const T in d){const F=d[T],q=N.target.uuid;q in F&&(F[q].dispose(),delete F[q])}}}function uR(r,t){function i(){let k=!1;const Rt=new rn;let mt=null;const Bt=new rn(0,0,0,0);return{setMask:function(Lt){mt!==Lt&&!k&&(r.colorMask(Lt,Lt,Lt,Lt),mt=Lt)},setLocked:function(Lt){k=Lt},setClear:function(Lt,Et,Wt,ee,nn){nn===!0&&(Lt*=ee,Et*=ee,Wt*=ee),Rt.set(Lt,Et,Wt,ee),Bt.equals(Rt)===!1&&(r.clearColor(Lt,Et,Wt,ee),Bt.copy(Rt))},reset:function(){k=!1,mt=null,Bt.set(-1,0,0,0)}}}function s(){let k=!1,Rt=!1,mt=null,Bt=null,Lt=null;return{setReversed:function(Et){if(Rt!==Et){const Wt=t.get("EXT_clip_control");Et?Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.ZERO_TO_ONE_EXT):Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.NEGATIVE_ONE_TO_ONE_EXT),Rt=Et;const ee=Lt;Lt=null,this.setClear(ee)}},getReversed:function(){return Rt},setTest:function(Et){Et?At(r.DEPTH_TEST):Ht(r.DEPTH_TEST)},setMask:function(Et){mt!==Et&&!k&&(r.depthMask(Et),mt=Et)},setFunc:function(Et){if(Rt&&(Et=UM[Et]),Bt!==Et){switch(Et){case xd:r.depthFunc(r.NEVER);break;case Sd:r.depthFunc(r.ALWAYS);break;case yd:r.depthFunc(r.LESS);break;case Yr:r.depthFunc(r.LEQUAL);break;case Md:r.depthFunc(r.EQUAL);break;case Ed:r.depthFunc(r.GEQUAL);break;case bd:r.depthFunc(r.GREATER);break;case Td:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}Bt=Et}},setLocked:function(Et){k=Et},setClear:function(Et){Lt!==Et&&(Lt=Et,Rt&&(Et=1-Et),r.clearDepth(Et))},reset:function(){k=!1,mt=null,Bt=null,Lt=null,Rt=!1}}}function l(){let k=!1,Rt=null,mt=null,Bt=null,Lt=null,Et=null,Wt=null,ee=null,nn=null;return{setTest:function(De){k||(De?At(r.STENCIL_TEST):Ht(r.STENCIL_TEST))},setMask:function(De){Rt!==De&&!k&&(r.stencilMask(De),Rt=De)},setFunc:function(De,mi,ti){(mt!==De||Bt!==mi||Lt!==ti)&&(r.stencilFunc(De,mi,ti),mt=De,Bt=mi,Lt=ti)},setOp:function(De,mi,ti){(Et!==De||Wt!==mi||ee!==ti)&&(r.stencilOp(De,mi,ti),Et=De,Wt=mi,ee=ti)},setLocked:function(De){k=De},setClear:function(De){nn!==De&&(r.clearStencil(De),nn=De)},reset:function(){k=!1,Rt=null,mt=null,Bt=null,Lt=null,Et=null,Wt=null,ee=null,nn=null}}}const c=new i,h=new s,p=new l,m=new WeakMap,d=new WeakMap;let _={},v={},g={},M=new WeakMap,b=[],C=null,S=!1,y=null,w=null,O=null,P=null,z=null,N=null,B=null,T=new de(0,0,0),F=0,q=!1,G=null,$=null,ut=null,ht=null,j=null;const L=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,et=0;const gt=r.getParameter(r.VERSION);gt.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(gt)[1]),H=et>=1):gt.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(gt)[1]),H=et>=2);let yt=null,I={};const Q=r.getParameter(r.SCISSOR_BOX),St=r.getParameter(r.VIEWPORT),bt=new rn().fromArray(Q),K=new rn().fromArray(St);function Z(k,Rt,mt,Bt){const Lt=new Uint8Array(4),Et=r.createTexture();r.bindTexture(k,Et),r.texParameteri(k,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(k,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Wt=0;Wt<mt;Wt++)k===r.TEXTURE_3D||k===r.TEXTURE_2D_ARRAY?r.texImage3D(Rt,0,r.RGBA,1,1,Bt,0,r.RGBA,r.UNSIGNED_BYTE,Lt):r.texImage2D(Rt+Wt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Lt);return Et}const Mt={};Mt[r.TEXTURE_2D]=Z(r.TEXTURE_2D,r.TEXTURE_2D,1),Mt[r.TEXTURE_CUBE_MAP]=Z(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),Mt[r.TEXTURE_2D_ARRAY]=Z(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),Mt[r.TEXTURE_3D]=Z(r.TEXTURE_3D,r.TEXTURE_3D,1,1),c.setClear(0,0,0,1),h.setClear(1),p.setClear(0),At(r.DEPTH_TEST),h.setFunc(Yr),ln(!1),Ye(b_),At(r.CULL_FACE),Ne(ba);function At(k){_[k]!==!0&&(r.enable(k),_[k]=!0)}function Ht(k){_[k]!==!1&&(r.disable(k),_[k]=!1)}function te(k,Rt){return g[k]!==Rt?(r.bindFramebuffer(k,Rt),g[k]=Rt,k===r.DRAW_FRAMEBUFFER&&(g[r.FRAMEBUFFER]=Rt),k===r.FRAMEBUFFER&&(g[r.DRAW_FRAMEBUFFER]=Rt),!0):!1}function Qt(k,Rt){let mt=b,Bt=!1;if(k){mt=M.get(Rt),mt===void 0&&(mt=[],M.set(Rt,mt));const Lt=k.textures;if(mt.length!==Lt.length||mt[0]!==r.COLOR_ATTACHMENT0){for(let Et=0,Wt=Lt.length;Et<Wt;Et++)mt[Et]=r.COLOR_ATTACHMENT0+Et;mt.length=Lt.length,Bt=!0}}else mt[0]!==r.BACK&&(mt[0]=r.BACK,Bt=!0);Bt&&r.drawBuffers(mt)}function je(k){return C!==k?(r.useProgram(k),C=k,!0):!1}const pe={[Gs]:r.FUNC_ADD,[tM]:r.FUNC_SUBTRACT,[eM]:r.FUNC_REVERSE_SUBTRACT};pe[nM]=r.MIN,pe[iM]=r.MAX;const ye={[aM]:r.ZERO,[sM]:r.ONE,[rM]:r.SRC_COLOR,[_d]:r.SRC_ALPHA,[hM]:r.SRC_ALPHA_SATURATE,[uM]:r.DST_COLOR,[lM]:r.DST_ALPHA,[oM]:r.ONE_MINUS_SRC_COLOR,[vd]:r.ONE_MINUS_SRC_ALPHA,[fM]:r.ONE_MINUS_DST_COLOR,[cM]:r.ONE_MINUS_DST_ALPHA,[dM]:r.CONSTANT_COLOR,[pM]:r.ONE_MINUS_CONSTANT_COLOR,[mM]:r.CONSTANT_ALPHA,[gM]:r.ONE_MINUS_CONSTANT_ALPHA};function Ne(k,Rt,mt,Bt,Lt,Et,Wt,ee,nn,De){if(k===ba){S===!0&&(Ht(r.BLEND),S=!1);return}if(S===!1&&(At(r.BLEND),S=!0),k!==$y){if(k!==y||De!==q){if((w!==Gs||z!==Gs)&&(r.blendEquation(r.FUNC_ADD),w=Gs,z=Gs),De)switch(k){case Wr:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case T_:r.blendFunc(r.ONE,r.ONE);break;case A_:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case R_:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:Ae("WebGLState: Invalid blending: ",k);break}else switch(k){case Wr:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case T_:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case A_:Ae("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case R_:Ae("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ae("WebGLState: Invalid blending: ",k);break}O=null,P=null,N=null,B=null,T.set(0,0,0),F=0,y=k,q=De}return}Lt=Lt||Rt,Et=Et||mt,Wt=Wt||Bt,(Rt!==w||Lt!==z)&&(r.blendEquationSeparate(pe[Rt],pe[Lt]),w=Rt,z=Lt),(mt!==O||Bt!==P||Et!==N||Wt!==B)&&(r.blendFuncSeparate(ye[mt],ye[Bt],ye[Et],ye[Wt]),O=mt,P=Bt,N=Et,B=Wt),(ee.equals(T)===!1||nn!==F)&&(r.blendColor(ee.r,ee.g,ee.b,nn),T.copy(ee),F=nn),y=k,q=!1}function ce(k,Rt){k.side===Ma?Ht(r.CULL_FACE):At(r.CULL_FACE);let mt=k.side===Jn;Rt&&(mt=!mt),ln(mt),k.blending===Wr&&k.transparent===!1?Ne(ba):Ne(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),h.setFunc(k.depthFunc),h.setTest(k.depthTest),h.setMask(k.depthWrite),c.setMask(k.colorWrite);const Bt=k.stencilWrite;p.setTest(Bt),Bt&&(p.setMask(k.stencilWriteMask),p.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),p.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),W(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?At(r.SAMPLE_ALPHA_TO_COVERAGE):Ht(r.SAMPLE_ALPHA_TO_COVERAGE)}function ln(k){G!==k&&(k?r.frontFace(r.CW):r.frontFace(r.CCW),G=k)}function Ye(k){k!==Qy?(At(r.CULL_FACE),k!==$&&(k===b_?r.cullFace(r.BACK):k===Jy?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Ht(r.CULL_FACE),$=k}function An(k){k!==ut&&(H&&r.lineWidth(k),ut=k)}function W(k,Rt,mt){k?(At(r.POLYGON_OFFSET_FILL),(ht!==Rt||j!==mt)&&(ht=Rt,j=mt,h.getReversed()&&(Rt=-Rt),r.polygonOffset(Rt,mt))):Ht(r.POLYGON_OFFSET_FILL)}function en(k){k?At(r.SCISSOR_TEST):Ht(r.SCISSOR_TEST)}function me(k){k===void 0&&(k=r.TEXTURE0+L-1),yt!==k&&(r.activeTexture(k),yt=k)}function He(k,Rt,mt){mt===void 0&&(yt===null?mt=r.TEXTURE0+L-1:mt=yt);let Bt=I[mt];Bt===void 0&&(Bt={type:void 0,texture:void 0},I[mt]=Bt),(Bt.type!==k||Bt.texture!==Rt)&&(yt!==mt&&(r.activeTexture(mt),yt=mt),r.bindTexture(k,Rt||Mt[k]),Bt.type=k,Bt.texture=Rt)}function Ct(){const k=I[yt];k!==void 0&&k.type!==void 0&&(r.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function Qe(){try{r.compressedTexImage2D(...arguments)}catch(k){Ae("WebGLState:",k)}}function D(){try{r.compressedTexImage3D(...arguments)}catch(k){Ae("WebGLState:",k)}}function E(){try{r.texSubImage2D(...arguments)}catch(k){Ae("WebGLState:",k)}}function nt(){try{r.texSubImage3D(...arguments)}catch(k){Ae("WebGLState:",k)}}function vt(){try{r.compressedTexSubImage2D(...arguments)}catch(k){Ae("WebGLState:",k)}}function Tt(){try{r.compressedTexSubImage3D(...arguments)}catch(k){Ae("WebGLState:",k)}}function wt(){try{r.texStorage2D(...arguments)}catch(k){Ae("WebGLState:",k)}}function Nt(){try{r.texStorage3D(...arguments)}catch(k){Ae("WebGLState:",k)}}function ft(){try{r.texImage2D(...arguments)}catch(k){Ae("WebGLState:",k)}}function dt(){try{r.texImage3D(...arguments)}catch(k){Ae("WebGLState:",k)}}function Ot(k){return v[k]!==void 0?v[k]:r.getParameter(k)}function Pt(k,Rt){v[k]!==Rt&&(r.pixelStorei(k,Rt),v[k]=Rt)}function Ut(k){bt.equals(k)===!1&&(r.scissor(k.x,k.y,k.z,k.w),bt.copy(k))}function Dt(k){K.equals(k)===!1&&(r.viewport(k.x,k.y,k.z,k.w),K.copy(k))}function ne(k,Rt){let mt=d.get(Rt);mt===void 0&&(mt=new WeakMap,d.set(Rt,mt));let Bt=mt.get(k);Bt===void 0&&(Bt=r.getUniformBlockIndex(Rt,k.name),mt.set(k,Bt))}function ie(k,Rt){const Bt=d.get(Rt).get(k);m.get(Rt)!==Bt&&(r.uniformBlockBinding(Rt,Bt,k.__bindingPointIndex),m.set(Rt,Bt))}function _e(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),h.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),_={},v={},yt=null,I={},g={},M=new WeakMap,b=[],C=null,S=!1,y=null,w=null,O=null,P=null,z=null,N=null,B=null,T=new de(0,0,0),F=0,q=!1,G=null,$=null,ut=null,ht=null,j=null,bt.set(0,0,r.canvas.width,r.canvas.height),K.set(0,0,r.canvas.width,r.canvas.height),c.reset(),h.reset(),p.reset()}return{buffers:{color:c,depth:h,stencil:p},enable:At,disable:Ht,bindFramebuffer:te,drawBuffers:Qt,useProgram:je,setBlending:Ne,setMaterial:ce,setFlipSided:ln,setCullFace:Ye,setLineWidth:An,setPolygonOffset:W,setScissorTest:en,activeTexture:me,bindTexture:He,unbindTexture:Ct,compressedTexImage2D:Qe,compressedTexImage3D:D,texImage2D:ft,texImage3D:dt,pixelStorei:Pt,getParameter:Ot,updateUBOMapping:ne,uniformBlockBinding:ie,texStorage2D:wt,texStorage3D:Nt,texSubImage2D:E,texSubImage3D:nt,compressedTexSubImage2D:vt,compressedTexSubImage3D:Tt,scissor:Ut,viewport:Dt,reset:_e}}function fR(r,t,i,s,l,c,h){const p=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new re,_=new WeakMap,v=new Set;let g;const M=new WeakMap;let b=!1;try{b=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function C(D,E){return b?new OffscreenCanvas(D,E):fu("canvas")}function S(D,E,nt){let vt=1;const Tt=Qe(D);if((Tt.width>nt||Tt.height>nt)&&(vt=nt/Math.max(Tt.width,Tt.height)),vt<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const wt=Math.floor(vt*Tt.width),Nt=Math.floor(vt*Tt.height);g===void 0&&(g=C(wt,Nt));const ft=E?C(wt,Nt):g;return ft.width=wt,ft.height=Nt,ft.getContext("2d").drawImage(D,0,0,wt,Nt),$t("WebGLRenderer: Texture has been resized from ("+Tt.width+"x"+Tt.height+") to ("+wt+"x"+Nt+")."),ft}else return"data"in D&&$t("WebGLRenderer: Image in DataTexture is too big ("+Tt.width+"x"+Tt.height+")."),D;return D}function y(D){return D.generateMipmaps}function w(D){r.generateMipmap(D)}function O(D){return D.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?r.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function P(D,E,nt,vt,Tt,wt=!1){if(D!==null){if(r[D]!==void 0)return r[D];$t("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let Nt;vt&&(Nt=t.get("EXT_texture_norm16"),Nt||$t("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ft=E;if(E===r.RED&&(nt===r.FLOAT&&(ft=r.R32F),nt===r.HALF_FLOAT&&(ft=r.R16F),nt===r.UNSIGNED_BYTE&&(ft=r.R8),nt===r.UNSIGNED_SHORT&&Nt&&(ft=Nt.R16_EXT),nt===r.SHORT&&Nt&&(ft=Nt.R16_SNORM_EXT)),E===r.RED_INTEGER&&(nt===r.UNSIGNED_BYTE&&(ft=r.R8UI),nt===r.UNSIGNED_SHORT&&(ft=r.R16UI),nt===r.UNSIGNED_INT&&(ft=r.R32UI),nt===r.BYTE&&(ft=r.R8I),nt===r.SHORT&&(ft=r.R16I),nt===r.INT&&(ft=r.R32I)),E===r.RG&&(nt===r.FLOAT&&(ft=r.RG32F),nt===r.HALF_FLOAT&&(ft=r.RG16F),nt===r.UNSIGNED_BYTE&&(ft=r.RG8),nt===r.UNSIGNED_SHORT&&Nt&&(ft=Nt.RG16_EXT),nt===r.SHORT&&Nt&&(ft=Nt.RG16_SNORM_EXT)),E===r.RG_INTEGER&&(nt===r.UNSIGNED_BYTE&&(ft=r.RG8UI),nt===r.UNSIGNED_SHORT&&(ft=r.RG16UI),nt===r.UNSIGNED_INT&&(ft=r.RG32UI),nt===r.BYTE&&(ft=r.RG8I),nt===r.SHORT&&(ft=r.RG16I),nt===r.INT&&(ft=r.RG32I)),E===r.RGB_INTEGER&&(nt===r.UNSIGNED_BYTE&&(ft=r.RGB8UI),nt===r.UNSIGNED_SHORT&&(ft=r.RGB16UI),nt===r.UNSIGNED_INT&&(ft=r.RGB32UI),nt===r.BYTE&&(ft=r.RGB8I),nt===r.SHORT&&(ft=r.RGB16I),nt===r.INT&&(ft=r.RGB32I)),E===r.RGBA_INTEGER&&(nt===r.UNSIGNED_BYTE&&(ft=r.RGBA8UI),nt===r.UNSIGNED_SHORT&&(ft=r.RGBA16UI),nt===r.UNSIGNED_INT&&(ft=r.RGBA32UI),nt===r.BYTE&&(ft=r.RGBA8I),nt===r.SHORT&&(ft=r.RGBA16I),nt===r.INT&&(ft=r.RGBA32I)),E===r.RGB&&(nt===r.UNSIGNED_SHORT&&Nt&&(ft=Nt.RGB16_EXT),nt===r.SHORT&&Nt&&(ft=Nt.RGB16_SNORM_EXT),nt===r.UNSIGNED_INT_5_9_9_9_REV&&(ft=r.RGB9_E5),nt===r.UNSIGNED_INT_10F_11F_11F_REV&&(ft=r.R11F_G11F_B10F)),E===r.RGBA){const dt=wt?uu:Te.getTransfer(Tt);nt===r.FLOAT&&(ft=r.RGBA32F),nt===r.HALF_FLOAT&&(ft=r.RGBA16F),nt===r.UNSIGNED_BYTE&&(ft=dt===ze?r.SRGB8_ALPHA8:r.RGBA8),nt===r.UNSIGNED_SHORT&&Nt&&(ft=Nt.RGBA16_EXT),nt===r.SHORT&&Nt&&(ft=Nt.RGBA16_SNORM_EXT),nt===r.UNSIGNED_SHORT_4_4_4_4&&(ft=r.RGBA4),nt===r.UNSIGNED_SHORT_5_5_5_1&&(ft=r.RGB5_A1)}return(ft===r.R16F||ft===r.R32F||ft===r.RG16F||ft===r.RG32F||ft===r.RGBA16F||ft===r.RGBA32F)&&t.get("EXT_color_buffer_float"),ft}function z(D,E){let nt;return D?E===null||E===Ki||E===cl?nt=r.DEPTH24_STENCIL8:E===Wi?nt=r.DEPTH32F_STENCIL8:E===ll&&(nt=r.DEPTH24_STENCIL8,$t("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Ki||E===cl?nt=r.DEPTH_COMPONENT24:E===Wi?nt=r.DEPTH_COMPONENT32F:E===ll&&(nt=r.DEPTH_COMPONENT16),nt}function N(D,E){return y(D)===!0||D.isFramebufferTexture&&D.minFilter!==Ln&&D.minFilter!==Bn?Math.log2(Math.max(E.width,E.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?E.mipmaps.length:1}function B(D){const E=D.target;E.removeEventListener("dispose",B),F(E),E.isVideoTexture&&_.delete(E),E.isHTMLTexture&&v.delete(E)}function T(D){const E=D.target;E.removeEventListener("dispose",T),G(E)}function F(D){const E=s.get(D);if(E.__webglInit===void 0)return;const nt=D.source,vt=M.get(nt);if(vt){const Tt=vt[E.__cacheKey];Tt.usedTimes--,Tt.usedTimes===0&&q(D),Object.keys(vt).length===0&&M.delete(nt)}s.remove(D)}function q(D){const E=s.get(D);r.deleteTexture(E.__webglTexture);const nt=D.source,vt=M.get(nt);delete vt[E.__cacheKey],h.memory.textures--}function G(D){const E=s.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),s.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let vt=0;vt<6;vt++){if(Array.isArray(E.__webglFramebuffer[vt]))for(let Tt=0;Tt<E.__webglFramebuffer[vt].length;Tt++)r.deleteFramebuffer(E.__webglFramebuffer[vt][Tt]);else r.deleteFramebuffer(E.__webglFramebuffer[vt]);E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer[vt])}else{if(Array.isArray(E.__webglFramebuffer))for(let vt=0;vt<E.__webglFramebuffer.length;vt++)r.deleteFramebuffer(E.__webglFramebuffer[vt]);else r.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&r.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let vt=0;vt<E.__webglColorRenderbuffer.length;vt++)E.__webglColorRenderbuffer[vt]&&r.deleteRenderbuffer(E.__webglColorRenderbuffer[vt]);E.__webglDepthRenderbuffer&&r.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const nt=D.textures;for(let vt=0,Tt=nt.length;vt<Tt;vt++){const wt=s.get(nt[vt]);wt.__webglTexture&&(r.deleteTexture(wt.__webglTexture),h.memory.textures--),s.remove(nt[vt])}s.remove(D)}let $=0;function ut(){$=0}function ht(){return $}function j(D){$=D}function L(){const D=$;return D>=l.maxTextures&&$t("WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+l.maxTextures),$+=1,D}function H(D){const E=[];return E.push(D.wrapS),E.push(D.wrapT),E.push(D.wrapR||0),E.push(D.magFilter),E.push(D.minFilter),E.push(D.anisotropy),E.push(D.internalFormat),E.push(D.format),E.push(D.type),E.push(D.generateMipmaps),E.push(D.premultiplyAlpha),E.push(D.flipY),E.push(D.unpackAlignment),E.push(D.colorSpace),E.join()}function et(D,E){const nt=s.get(D);if(D.isVideoTexture&&He(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&nt.__version!==D.version){const vt=D.image;if(vt===null)$t("WebGLRenderer: Texture marked for update but no image data found.");else if(vt.complete===!1)$t("WebGLRenderer: Texture marked for update but image is incomplete");else{Ht(nt,D,E);return}}else D.isExternalTexture&&(nt.__webglTexture=D.sourceTexture?D.sourceTexture:null);i.bindTexture(r.TEXTURE_2D,nt.__webglTexture,r.TEXTURE0+E)}function gt(D,E){const nt=s.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&nt.__version!==D.version){Ht(nt,D,E);return}else D.isExternalTexture&&(nt.__webglTexture=D.sourceTexture?D.sourceTexture:null);i.bindTexture(r.TEXTURE_2D_ARRAY,nt.__webglTexture,r.TEXTURE0+E)}function yt(D,E){const nt=s.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&nt.__version!==D.version){Ht(nt,D,E);return}i.bindTexture(r.TEXTURE_3D,nt.__webglTexture,r.TEXTURE0+E)}function I(D,E){const nt=s.get(D);if(D.isCubeDepthTexture!==!0&&D.version>0&&nt.__version!==D.version){te(nt,D,E);return}i.bindTexture(r.TEXTURE_CUBE_MAP,nt.__webglTexture,r.TEXTURE0+E)}const Q={[Ad]:r.REPEAT,[Ea]:r.CLAMP_TO_EDGE,[Rd]:r.MIRRORED_REPEAT},St={[Ln]:r.NEAREST,[xM]:r.NEAREST_MIPMAP_NEAREST,[Tc]:r.NEAREST_MIPMAP_LINEAR,[Bn]:r.LINEAR,[Nh]:r.LINEAR_MIPMAP_NEAREST,[ks]:r.LINEAR_MIPMAP_LINEAR},bt={[MM]:r.NEVER,[RM]:r.ALWAYS,[EM]:r.LESS,[yp]:r.LEQUAL,[bM]:r.EQUAL,[Mp]:r.GEQUAL,[TM]:r.GREATER,[AM]:r.NOTEQUAL};function K(D,E){if(E.type===Wi&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===Bn||E.magFilter===Nh||E.magFilter===Tc||E.magFilter===ks||E.minFilter===Bn||E.minFilter===Nh||E.minFilter===Tc||E.minFilter===ks)&&$t("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(D,r.TEXTURE_WRAP_S,Q[E.wrapS]),r.texParameteri(D,r.TEXTURE_WRAP_T,Q[E.wrapT]),(D===r.TEXTURE_3D||D===r.TEXTURE_2D_ARRAY)&&r.texParameteri(D,r.TEXTURE_WRAP_R,Q[E.wrapR]),r.texParameteri(D,r.TEXTURE_MAG_FILTER,St[E.magFilter]),r.texParameteri(D,r.TEXTURE_MIN_FILTER,St[E.minFilter]),E.compareFunction&&(r.texParameteri(D,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(D,r.TEXTURE_COMPARE_FUNC,bt[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Ln||E.minFilter!==Tc&&E.minFilter!==ks||E.type===Wi&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||s.get(E).__currentAnisotropy){const nt=t.get("EXT_texture_filter_anisotropic");r.texParameterf(D,nt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,l.getMaxAnisotropy())),s.get(E).__currentAnisotropy=E.anisotropy}}}function Z(D,E){let nt=!1;D.__webglInit===void 0&&(D.__webglInit=!0,E.addEventListener("dispose",B));const vt=E.source;let Tt=M.get(vt);Tt===void 0&&(Tt={},M.set(vt,Tt));const wt=H(E);if(wt!==D.__cacheKey){Tt[wt]===void 0&&(Tt[wt]={texture:r.createTexture(),usedTimes:0},h.memory.textures++,nt=!0),Tt[wt].usedTimes++;const Nt=Tt[D.__cacheKey];Nt!==void 0&&(Tt[D.__cacheKey].usedTimes--,Nt.usedTimes===0&&q(E)),D.__cacheKey=wt,D.__webglTexture=Tt[wt].texture}return nt}function Mt(D,E,nt){return Math.floor(Math.floor(D/nt)/E)}function At(D,E,nt,vt){const wt=D.updateRanges;if(wt.length===0)i.texSubImage2D(r.TEXTURE_2D,0,0,0,E.width,E.height,nt,vt,E.data);else{wt.sort((Pt,Ut)=>Pt.start-Ut.start);let Nt=0;for(let Pt=1;Pt<wt.length;Pt++){const Ut=wt[Nt],Dt=wt[Pt],ne=Ut.start+Ut.count,ie=Mt(Dt.start,E.width,4),_e=Mt(Ut.start,E.width,4);Dt.start<=ne+1&&ie===_e&&Mt(Dt.start+Dt.count-1,E.width,4)===ie?Ut.count=Math.max(Ut.count,Dt.start+Dt.count-Ut.start):(++Nt,wt[Nt]=Dt)}wt.length=Nt+1;const ft=i.getParameter(r.UNPACK_ROW_LENGTH),dt=i.getParameter(r.UNPACK_SKIP_PIXELS),Ot=i.getParameter(r.UNPACK_SKIP_ROWS);i.pixelStorei(r.UNPACK_ROW_LENGTH,E.width);for(let Pt=0,Ut=wt.length;Pt<Ut;Pt++){const Dt=wt[Pt],ne=Math.floor(Dt.start/4),ie=Math.ceil(Dt.count/4),_e=ne%E.width,k=Math.floor(ne/E.width),Rt=ie,mt=1;i.pixelStorei(r.UNPACK_SKIP_PIXELS,_e),i.pixelStorei(r.UNPACK_SKIP_ROWS,k),i.texSubImage2D(r.TEXTURE_2D,0,_e,k,Rt,mt,nt,vt,E.data)}D.clearUpdateRanges(),i.pixelStorei(r.UNPACK_ROW_LENGTH,ft),i.pixelStorei(r.UNPACK_SKIP_PIXELS,dt),i.pixelStorei(r.UNPACK_SKIP_ROWS,Ot)}}function Ht(D,E,nt){let vt=r.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(vt=r.TEXTURE_2D_ARRAY),E.isData3DTexture&&(vt=r.TEXTURE_3D);const Tt=Z(D,E),wt=E.source;i.bindTexture(vt,D.__webglTexture,r.TEXTURE0+nt);const Nt=s.get(wt);if(wt.version!==Nt.__version||Tt===!0){if(i.activeTexture(r.TEXTURE0+nt),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){const mt=Te.getPrimaries(Te.workingColorSpace),Bt=E.colorSpace===us?null:Te.getPrimaries(E.colorSpace),Lt=E.colorSpace===us||mt===Bt?r.NONE:r.BROWSER_DEFAULT_WEBGL;i.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt)}i.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment);let dt=S(E.image,!1,l.maxTextureSize);dt=Ct(E,dt);const Ot=c.convert(E.format,E.colorSpace),Pt=c.convert(E.type);let Ut=P(E.internalFormat,Ot,Pt,E.normalized,E.colorSpace,E.isVideoTexture);K(vt,E);let Dt;const ne=E.mipmaps,ie=E.isVideoTexture!==!0,_e=Nt.__version===void 0||Tt===!0,k=wt.dataReady,Rt=N(E,dt);if(E.isDepthTexture)Ut=z(E.format===Xs,E.type),_e&&(ie?i.texStorage2D(r.TEXTURE_2D,1,Ut,dt.width,dt.height):i.texImage2D(r.TEXTURE_2D,0,Ut,dt.width,dt.height,0,Ot,Pt,null));else if(E.isDataTexture)if(ne.length>0){ie&&_e&&i.texStorage2D(r.TEXTURE_2D,Rt,Ut,ne[0].width,ne[0].height);for(let mt=0,Bt=ne.length;mt<Bt;mt++)Dt=ne[mt],ie?k&&i.texSubImage2D(r.TEXTURE_2D,mt,0,0,Dt.width,Dt.height,Ot,Pt,Dt.data):i.texImage2D(r.TEXTURE_2D,mt,Ut,Dt.width,Dt.height,0,Ot,Pt,Dt.data);E.generateMipmaps=!1}else ie?(_e&&i.texStorage2D(r.TEXTURE_2D,Rt,Ut,dt.width,dt.height),k&&At(E,dt,Ot,Pt)):i.texImage2D(r.TEXTURE_2D,0,Ut,dt.width,dt.height,0,Ot,Pt,dt.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){ie&&_e&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Rt,Ut,ne[0].width,ne[0].height,dt.depth);for(let mt=0,Bt=ne.length;mt<Bt;mt++)if(Dt=ne[mt],E.format!==Ii)if(Ot!==null)if(ie){if(k)if(E.layerUpdates.size>0){const Lt=rv(Dt.width,Dt.height,E.format,E.type);for(const Et of E.layerUpdates){const Wt=Dt.data.subarray(Et*Lt/Dt.data.BYTES_PER_ELEMENT,(Et+1)*Lt/Dt.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,mt,0,0,Et,Dt.width,Dt.height,1,Ot,Wt)}E.clearLayerUpdates()}else i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,mt,0,0,0,Dt.width,Dt.height,dt.depth,Ot,Dt.data)}else i.compressedTexImage3D(r.TEXTURE_2D_ARRAY,mt,Ut,Dt.width,Dt.height,dt.depth,0,Dt.data,0,0);else $t("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ie?k&&i.texSubImage3D(r.TEXTURE_2D_ARRAY,mt,0,0,0,Dt.width,Dt.height,dt.depth,Ot,Pt,Dt.data):i.texImage3D(r.TEXTURE_2D_ARRAY,mt,Ut,Dt.width,Dt.height,dt.depth,0,Ot,Pt,Dt.data)}else{ie&&_e&&i.texStorage2D(r.TEXTURE_2D,Rt,Ut,ne[0].width,ne[0].height);for(let mt=0,Bt=ne.length;mt<Bt;mt++)Dt=ne[mt],E.format!==Ii?Ot!==null?ie?k&&i.compressedTexSubImage2D(r.TEXTURE_2D,mt,0,0,Dt.width,Dt.height,Ot,Dt.data):i.compressedTexImage2D(r.TEXTURE_2D,mt,Ut,Dt.width,Dt.height,0,Dt.data):$t("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ie?k&&i.texSubImage2D(r.TEXTURE_2D,mt,0,0,Dt.width,Dt.height,Ot,Pt,Dt.data):i.texImage2D(r.TEXTURE_2D,mt,Ut,Dt.width,Dt.height,0,Ot,Pt,Dt.data)}else if(E.isDataArrayTexture)if(ie){if(_e&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Rt,Ut,dt.width,dt.height,dt.depth),k)if(E.layerUpdates.size>0){const mt=rv(dt.width,dt.height,E.format,E.type);for(const Bt of E.layerUpdates){const Lt=dt.data.subarray(Bt*mt/dt.data.BYTES_PER_ELEMENT,(Bt+1)*mt/dt.data.BYTES_PER_ELEMENT);i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,Bt,dt.width,dt.height,1,Ot,Pt,Lt)}E.clearLayerUpdates()}else i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,dt.width,dt.height,dt.depth,Ot,Pt,dt.data)}else i.texImage3D(r.TEXTURE_2D_ARRAY,0,Ut,dt.width,dt.height,dt.depth,0,Ot,Pt,dt.data);else if(E.isData3DTexture)ie?(_e&&i.texStorage3D(r.TEXTURE_3D,Rt,Ut,dt.width,dt.height,dt.depth),k&&i.texSubImage3D(r.TEXTURE_3D,0,0,0,0,dt.width,dt.height,dt.depth,Ot,Pt,dt.data)):i.texImage3D(r.TEXTURE_3D,0,Ut,dt.width,dt.height,dt.depth,0,Ot,Pt,dt.data);else if(E.isFramebufferTexture){if(_e)if(ie)i.texStorage2D(r.TEXTURE_2D,Rt,Ut,dt.width,dt.height);else{let mt=dt.width,Bt=dt.height;for(let Lt=0;Lt<Rt;Lt++)i.texImage2D(r.TEXTURE_2D,Lt,Ut,mt,Bt,0,Ot,Pt,null),mt>>=1,Bt>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in r){const mt=r.canvas;if(mt.hasAttribute("layoutsubtree")||mt.setAttribute("layoutsubtree","true"),dt.parentNode!==mt){mt.appendChild(dt),v.add(E),mt.onpaint=ee=>{const nn=ee.changedElements;for(const De of v)nn.includes(De.image)&&(De.needsUpdate=!0)},mt.requestPaint();return}const Bt=0,Lt=r.RGBA,Et=r.RGBA,Wt=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,Bt,Lt,Et,Wt,dt),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(ne.length>0){if(ie&&_e){const mt=Qe(ne[0]);i.texStorage2D(r.TEXTURE_2D,Rt,Ut,mt.width,mt.height)}for(let mt=0,Bt=ne.length;mt<Bt;mt++)Dt=ne[mt],ie?k&&i.texSubImage2D(r.TEXTURE_2D,mt,0,0,Ot,Pt,Dt):i.texImage2D(r.TEXTURE_2D,mt,Ut,Ot,Pt,Dt);E.generateMipmaps=!1}else if(ie){if(_e){const mt=Qe(dt);i.texStorage2D(r.TEXTURE_2D,Rt,Ut,mt.width,mt.height)}k&&i.texSubImage2D(r.TEXTURE_2D,0,0,0,Ot,Pt,dt)}else i.texImage2D(r.TEXTURE_2D,0,Ut,Ot,Pt,dt);y(E)&&w(vt),Nt.__version=wt.version,E.onUpdate&&E.onUpdate(E)}D.__version=E.version}function te(D,E,nt){if(E.image.length!==6)return;const vt=Z(D,E),Tt=E.source;i.bindTexture(r.TEXTURE_CUBE_MAP,D.__webglTexture,r.TEXTURE0+nt);const wt=s.get(Tt);if(Tt.version!==wt.__version||vt===!0){i.activeTexture(r.TEXTURE0+nt);const Nt=Te.getPrimaries(Te.workingColorSpace),ft=E.colorSpace===us?null:Te.getPrimaries(E.colorSpace),dt=E.colorSpace===us||Nt===ft?r.NONE:r.BROWSER_DEFAULT_WEBGL;i.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const Ot=E.isCompressedTexture||E.image[0].isCompressedTexture,Pt=E.image[0]&&E.image[0].isDataTexture,Ut=[];for(let Et=0;Et<6;Et++)!Ot&&!Pt?Ut[Et]=S(E.image[Et],!0,l.maxCubemapSize):Ut[Et]=Pt?E.image[Et].image:E.image[Et],Ut[Et]=Ct(E,Ut[Et]);const Dt=Ut[0],ne=c.convert(E.format,E.colorSpace),ie=c.convert(E.type),_e=P(E.internalFormat,ne,ie,E.normalized,E.colorSpace),k=E.isVideoTexture!==!0,Rt=wt.__version===void 0||vt===!0,mt=Tt.dataReady;let Bt=N(E,Dt);K(r.TEXTURE_CUBE_MAP,E);let Lt;if(Ot){k&&Rt&&i.texStorage2D(r.TEXTURE_CUBE_MAP,Bt,_e,Dt.width,Dt.height);for(let Et=0;Et<6;Et++){Lt=Ut[Et].mipmaps;for(let Wt=0;Wt<Lt.length;Wt++){const ee=Lt[Wt];E.format!==Ii?ne!==null?k?mt&&i.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Wt,0,0,ee.width,ee.height,ne,ee.data):i.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Wt,_e,ee.width,ee.height,0,ee.data):$t("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?mt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Wt,0,0,ee.width,ee.height,ne,ie,ee.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Wt,_e,ee.width,ee.height,0,ne,ie,ee.data)}}}else{if(Lt=E.mipmaps,k&&Rt){Lt.length>0&&Bt++;const Et=Qe(Ut[0]);i.texStorage2D(r.TEXTURE_CUBE_MAP,Bt,_e,Et.width,Et.height)}for(let Et=0;Et<6;Et++)if(Pt){k?mt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,0,0,Ut[Et].width,Ut[Et].height,ne,ie,Ut[Et].data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,_e,Ut[Et].width,Ut[Et].height,0,ne,ie,Ut[Et].data);for(let Wt=0;Wt<Lt.length;Wt++){const nn=Lt[Wt].image[Et].image;k?mt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Wt+1,0,0,nn.width,nn.height,ne,ie,nn.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Wt+1,_e,nn.width,nn.height,0,ne,ie,nn.data)}}else{k?mt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,0,0,ne,ie,Ut[Et]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,_e,ne,ie,Ut[Et]);for(let Wt=0;Wt<Lt.length;Wt++){const ee=Lt[Wt];k?mt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Wt+1,0,0,ne,ie,ee.image[Et]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Wt+1,_e,ne,ie,ee.image[Et])}}}y(E)&&w(r.TEXTURE_CUBE_MAP),wt.__version=Tt.version,E.onUpdate&&E.onUpdate(E)}D.__version=E.version}function Qt(D,E,nt,vt,Tt,wt){const Nt=c.convert(nt.format,nt.colorSpace),ft=c.convert(nt.type),dt=P(nt.internalFormat,Nt,ft,nt.normalized,nt.colorSpace),Ot=s.get(E),Pt=s.get(nt);if(Pt.__renderTarget=E,!Ot.__hasExternalTextures){const Ut=Math.max(1,E.width>>wt),Dt=Math.max(1,E.height>>wt);Tt===r.TEXTURE_3D||Tt===r.TEXTURE_2D_ARRAY?i.texImage3D(Tt,wt,dt,Ut,Dt,E.depth,0,Nt,ft,null):i.texImage2D(Tt,wt,dt,Ut,Dt,0,Nt,ft,null)}i.bindFramebuffer(r.FRAMEBUFFER,D),me(E)?p.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,vt,Tt,Pt.__webglTexture,0,en(E)):(Tt===r.TEXTURE_2D||Tt>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Tt<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,vt,Tt,Pt.__webglTexture,wt),i.bindFramebuffer(r.FRAMEBUFFER,null)}function je(D,E,nt){if(r.bindRenderbuffer(r.RENDERBUFFER,D),E.depthBuffer){const vt=E.depthTexture,Tt=vt&&vt.isDepthTexture?vt.type:null,wt=z(E.stencilBuffer,Tt),Nt=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;me(E)?p.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,en(E),wt,E.width,E.height):nt?r.renderbufferStorageMultisample(r.RENDERBUFFER,en(E),wt,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,wt,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Nt,r.RENDERBUFFER,D)}else{const vt=E.textures;for(let Tt=0;Tt<vt.length;Tt++){const wt=vt[Tt],Nt=c.convert(wt.format,wt.colorSpace),ft=c.convert(wt.type),dt=P(wt.internalFormat,Nt,ft,wt.normalized,wt.colorSpace);me(E)?p.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,en(E),dt,E.width,E.height):nt?r.renderbufferStorageMultisample(r.RENDERBUFFER,en(E),dt,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,dt,E.width,E.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function pe(D,E,nt){const vt=E.isWebGLCubeRenderTarget===!0;if(i.bindFramebuffer(r.FRAMEBUFFER,D),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Tt=s.get(E.depthTexture);if(Tt.__renderTarget=E,(!Tt.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),vt){if(Tt.__webglInit===void 0&&(Tt.__webglInit=!0,E.depthTexture.addEventListener("dispose",B)),Tt.__webglTexture===void 0){Tt.__webglTexture=r.createTexture(),i.bindTexture(r.TEXTURE_CUBE_MAP,Tt.__webglTexture),K(r.TEXTURE_CUBE_MAP,E.depthTexture);const Ot=c.convert(E.depthTexture.format),Pt=c.convert(E.depthTexture.type);let Ut;E.depthTexture.format===Ra?Ut=r.DEPTH_COMPONENT24:E.depthTexture.format===Xs&&(Ut=r.DEPTH24_STENCIL8);for(let Dt=0;Dt<6;Dt++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Dt,0,Ut,E.width,E.height,0,Ot,Pt,null)}}else et(E.depthTexture,0);const wt=Tt.__webglTexture,Nt=en(E),ft=vt?r.TEXTURE_CUBE_MAP_POSITIVE_X+nt:r.TEXTURE_2D,dt=E.depthTexture.format===Xs?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(E.depthTexture.format===Ra)me(E)?p.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,dt,ft,wt,0,Nt):r.framebufferTexture2D(r.FRAMEBUFFER,dt,ft,wt,0);else if(E.depthTexture.format===Xs)me(E)?p.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,dt,ft,wt,0,Nt):r.framebufferTexture2D(r.FRAMEBUFFER,dt,ft,wt,0);else throw new Error("Unknown depthTexture format")}function ye(D){const E=s.get(D),nt=D.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==D.depthTexture){const vt=D.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),vt){const Tt=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,vt.removeEventListener("dispose",Tt)};vt.addEventListener("dispose",Tt),E.__depthDisposeCallback=Tt}E.__boundDepthTexture=vt}if(D.depthTexture&&!E.__autoAllocateDepthBuffer)if(nt)for(let vt=0;vt<6;vt++)pe(E.__webglFramebuffer[vt],D,vt);else{const vt=D.texture.mipmaps;vt&&vt.length>0?pe(E.__webglFramebuffer[0],D,0):pe(E.__webglFramebuffer,D,0)}else if(nt){E.__webglDepthbuffer=[];for(let vt=0;vt<6;vt++)if(i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[vt]),E.__webglDepthbuffer[vt]===void 0)E.__webglDepthbuffer[vt]=r.createRenderbuffer(),je(E.__webglDepthbuffer[vt],D,!1);else{const Tt=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,wt=E.__webglDepthbuffer[vt];r.bindRenderbuffer(r.RENDERBUFFER,wt),r.framebufferRenderbuffer(r.FRAMEBUFFER,Tt,r.RENDERBUFFER,wt)}}else{const vt=D.texture.mipmaps;if(vt&&vt.length>0?i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[0]):i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=r.createRenderbuffer(),je(E.__webglDepthbuffer,D,!1);else{const Tt=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,wt=E.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,wt),r.framebufferRenderbuffer(r.FRAMEBUFFER,Tt,r.RENDERBUFFER,wt)}}i.bindFramebuffer(r.FRAMEBUFFER,null)}function Ne(D,E,nt){const vt=s.get(D);E!==void 0&&Qt(vt.__webglFramebuffer,D,D.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),nt!==void 0&&ye(D)}function ce(D){const E=D.texture,nt=s.get(D),vt=s.get(E);D.addEventListener("dispose",T);const Tt=D.textures,wt=D.isWebGLCubeRenderTarget===!0,Nt=Tt.length>1;if(Nt||(vt.__webglTexture===void 0&&(vt.__webglTexture=r.createTexture()),vt.__version=E.version,h.memory.textures++),wt){nt.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(E.mipmaps&&E.mipmaps.length>0){nt.__webglFramebuffer[ft]=[];for(let dt=0;dt<E.mipmaps.length;dt++)nt.__webglFramebuffer[ft][dt]=r.createFramebuffer()}else nt.__webglFramebuffer[ft]=r.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){nt.__webglFramebuffer=[];for(let ft=0;ft<E.mipmaps.length;ft++)nt.__webglFramebuffer[ft]=r.createFramebuffer()}else nt.__webglFramebuffer=r.createFramebuffer();if(Nt)for(let ft=0,dt=Tt.length;ft<dt;ft++){const Ot=s.get(Tt[ft]);Ot.__webglTexture===void 0&&(Ot.__webglTexture=r.createTexture(),h.memory.textures++)}if(D.samples>0&&me(D)===!1){nt.__webglMultisampledFramebuffer=r.createFramebuffer(),nt.__webglColorRenderbuffer=[],i.bindFramebuffer(r.FRAMEBUFFER,nt.__webglMultisampledFramebuffer);for(let ft=0;ft<Tt.length;ft++){const dt=Tt[ft];nt.__webglColorRenderbuffer[ft]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,nt.__webglColorRenderbuffer[ft]);const Ot=c.convert(dt.format,dt.colorSpace),Pt=c.convert(dt.type),Ut=P(dt.internalFormat,Ot,Pt,dt.normalized,dt.colorSpace,D.isXRRenderTarget===!0),Dt=en(D);r.renderbufferStorageMultisample(r.RENDERBUFFER,Dt,Ut,D.width,D.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ft,r.RENDERBUFFER,nt.__webglColorRenderbuffer[ft])}r.bindRenderbuffer(r.RENDERBUFFER,null),D.depthBuffer&&(nt.__webglDepthRenderbuffer=r.createRenderbuffer(),je(nt.__webglDepthRenderbuffer,D,!0)),i.bindFramebuffer(r.FRAMEBUFFER,null)}}if(wt){i.bindTexture(r.TEXTURE_CUBE_MAP,vt.__webglTexture),K(r.TEXTURE_CUBE_MAP,E);for(let ft=0;ft<6;ft++)if(E.mipmaps&&E.mipmaps.length>0)for(let dt=0;dt<E.mipmaps.length;dt++)Qt(nt.__webglFramebuffer[ft][dt],D,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ft,dt);else Qt(nt.__webglFramebuffer[ft],D,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);y(E)&&w(r.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Nt){for(let ft=0,dt=Tt.length;ft<dt;ft++){const Ot=Tt[ft],Pt=s.get(Ot);let Ut=r.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Ut=D.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(Ut,Pt.__webglTexture),K(Ut,Ot),Qt(nt.__webglFramebuffer,D,Ot,r.COLOR_ATTACHMENT0+ft,Ut,0),y(Ot)&&w(Ut)}i.unbindTexture()}else{let ft=r.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(ft=D.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(ft,vt.__webglTexture),K(ft,E),E.mipmaps&&E.mipmaps.length>0)for(let dt=0;dt<E.mipmaps.length;dt++)Qt(nt.__webglFramebuffer[dt],D,E,r.COLOR_ATTACHMENT0,ft,dt);else Qt(nt.__webglFramebuffer,D,E,r.COLOR_ATTACHMENT0,ft,0);y(E)&&w(ft),i.unbindTexture()}D.depthBuffer&&ye(D)}function ln(D){const E=D.textures;for(let nt=0,vt=E.length;nt<vt;nt++){const Tt=E[nt];if(y(Tt)){const wt=O(D),Nt=s.get(Tt).__webglTexture;i.bindTexture(wt,Nt),w(wt),i.unbindTexture()}}}const Ye=[],An=[];function W(D){if(D.samples>0){if(me(D)===!1){const E=D.textures,nt=D.width,vt=D.height;let Tt=r.COLOR_BUFFER_BIT;const wt=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Nt=s.get(D),ft=E.length>1;if(ft)for(let Ot=0;Ot<E.length;Ot++)i.bindFramebuffer(r.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ot,r.RENDERBUFFER,null),i.bindFramebuffer(r.FRAMEBUFFER,Nt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ot,r.TEXTURE_2D,null,0);i.bindFramebuffer(r.READ_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer);const dt=D.texture.mipmaps;dt&&dt.length>0?i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer[0]):i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let Ot=0;Ot<E.length;Ot++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(Tt|=r.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(Tt|=r.STENCIL_BUFFER_BIT)),ft){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Nt.__webglColorRenderbuffer[Ot]);const Pt=s.get(E[Ot]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Pt,0)}r.blitFramebuffer(0,0,nt,vt,0,0,nt,vt,Tt,r.NEAREST),m===!0&&(Ye.length=0,An.length=0,Ye.push(r.COLOR_ATTACHMENT0+Ot),D.depthBuffer&&D.resolveDepthBuffer===!1&&(Ye.push(wt),An.push(wt),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,An)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Ye))}if(i.bindFramebuffer(r.READ_FRAMEBUFFER,null),i.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),ft)for(let Ot=0;Ot<E.length;Ot++){i.bindFramebuffer(r.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ot,r.RENDERBUFFER,Nt.__webglColorRenderbuffer[Ot]);const Pt=s.get(E[Ot]).__webglTexture;i.bindFramebuffer(r.FRAMEBUFFER,Nt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ot,r.TEXTURE_2D,Pt,0)}i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&m){const E=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[E])}}}function en(D){return Math.min(l.maxSamples,D.samples)}function me(D){const E=s.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function He(D){const E=h.render.frame;_.get(D)!==E&&(_.set(D,E),D.update())}function Ct(D,E){const nt=D.colorSpace,vt=D.format,Tt=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||nt!==cu&&nt!==us&&(Te.getTransfer(nt)===ze?(vt!==Ii||Tt!==hi)&&$t("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ae("WebGLTextures: Unsupported texture color space:",nt)),E}function Qe(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(d.width=D.naturalWidth||D.width,d.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(d.width=D.displayWidth,d.height=D.displayHeight):(d.width=D.width,d.height=D.height),d}this.allocateTextureUnit=L,this.resetTextureUnits=ut,this.getTextureUnits=ht,this.setTextureUnits=j,this.setTexture2D=et,this.setTexture2DArray=gt,this.setTexture3D=yt,this.setTextureCube=I,this.rebindTextures=Ne,this.setupRenderTarget=ce,this.updateRenderTargetMipmap=ln,this.updateMultisampleRenderTarget=W,this.setupDepthRenderbuffer=ye,this.setupFrameBufferTexture=Qt,this.useMultisampledRTT=me,this.isReversedDepthBuffer=function(){return i.buffers.depth.getReversed()}}function hR(r,t){function i(s,l=us){let c;const h=Te.getTransfer(l);if(s===hi)return r.UNSIGNED_BYTE;if(s===gp)return r.UNSIGNED_SHORT_4_4_4_4;if(s===_p)return r.UNSIGNED_SHORT_5_5_5_1;if(s===Kv)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===Qv)return r.UNSIGNED_INT_10F_11F_11F_REV;if(s===Yv)return r.BYTE;if(s===Zv)return r.SHORT;if(s===ll)return r.UNSIGNED_SHORT;if(s===mp)return r.INT;if(s===Ki)return r.UNSIGNED_INT;if(s===Wi)return r.FLOAT;if(s===Aa)return r.HALF_FLOAT;if(s===Jv)return r.ALPHA;if(s===$v)return r.RGB;if(s===Ii)return r.RGBA;if(s===Ra)return r.DEPTH_COMPONENT;if(s===Xs)return r.DEPTH_STENCIL;if(s===tx)return r.RED;if(s===vp)return r.RED_INTEGER;if(s===qs)return r.RG;if(s===xp)return r.RG_INTEGER;if(s===Sp)return r.RGBA_INTEGER;if(s===eu||s===nu||s===iu||s===au)if(h===ze)if(c=t.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(s===eu)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===nu)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===iu)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===au)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=t.get("WEBGL_compressed_texture_s3tc"),c!==null){if(s===eu)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===nu)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===iu)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===au)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Cd||s===wd||s===Dd||s===Ud)if(c=t.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(s===Cd)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===wd)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Dd)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Ud)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Ld||s===Nd||s===Od||s===Pd||s===Id||s===ou||s===Fd)if(c=t.get("WEBGL_compressed_texture_etc"),c!==null){if(s===Ld||s===Nd)return h===ze?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(s===Od)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC;if(s===Pd)return c.COMPRESSED_R11_EAC;if(s===Id)return c.COMPRESSED_SIGNED_R11_EAC;if(s===ou)return c.COMPRESSED_RG11_EAC;if(s===Fd)return c.COMPRESSED_SIGNED_RG11_EAC}else return null;if(s===Bd||s===zd||s===Hd||s===Gd||s===Vd||s===kd||s===Xd||s===jd||s===Wd||s===qd||s===Yd||s===Zd||s===Kd||s===Qd)if(c=t.get("WEBGL_compressed_texture_astc"),c!==null){if(s===Bd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===zd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===Hd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Gd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Vd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===kd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===Xd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===jd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===Wd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===qd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Yd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===Zd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Kd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Qd)return h===ze?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Jd||s===$d||s===tp)if(c=t.get("EXT_texture_compression_bptc"),c!==null){if(s===Jd)return h===ze?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===$d)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===tp)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===ep||s===np||s===lu||s===ip)if(c=t.get("EXT_texture_compression_rgtc"),c!==null){if(s===ep)return c.COMPRESSED_RED_RGTC1_EXT;if(s===np)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===lu)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===ip)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===cl?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:i}}const dR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,pR=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class mR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,i){if(this.texture===null){const s=new ux(t.texture);(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const i=t.cameras[0].viewport,s=new Qi({vertexShader:dR,fragmentShader:pR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new Fi(new pl(20,20),s)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class gR extends _s{constructor(t,i){super();const s=this;let l=null,c=1,h=null,p="local-floor",m=1,d=null,_=null,v=null,g=null,M=null,b=null;const C=typeof XRWebGLBinding<"u",S=new mR,y={},w=i.getContextAttributes();let O=null,P=null;const z=[],N=[],B=new re;let T=null;const F=new Ti;F.viewport=new rn;const q=new Ti;q.viewport=new rn;const G=[F,q],$=new TE;let ut=null,ht=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let Mt=z[Z];return Mt===void 0&&(Mt=new Hh,z[Z]=Mt),Mt.getTargetRaySpace()},this.getControllerGrip=function(Z){let Mt=z[Z];return Mt===void 0&&(Mt=new Hh,z[Z]=Mt),Mt.getGripSpace()},this.getHand=function(Z){let Mt=z[Z];return Mt===void 0&&(Mt=new Hh,z[Z]=Mt),Mt.getHandSpace()};function j(Z){const Mt=N.indexOf(Z.inputSource);if(Mt===-1)return;const At=z[Mt];At!==void 0&&(At.update(Z.inputSource,Z.frame,d||h),At.dispatchEvent({type:Z.type,data:Z.inputSource}))}function L(){l.removeEventListener("select",j),l.removeEventListener("selectstart",j),l.removeEventListener("selectend",j),l.removeEventListener("squeeze",j),l.removeEventListener("squeezestart",j),l.removeEventListener("squeezeend",j),l.removeEventListener("end",L),l.removeEventListener("inputsourceschange",H);for(let Z=0;Z<z.length;Z++){const Mt=N[Z];Mt!==null&&(N[Z]=null,z[Z].disconnect(Mt))}ut=null,ht=null,S.reset();for(const Z in y)delete y[Z];t.setRenderTarget(O),M=null,g=null,v=null,l=null,P=null,K.stop(),s.isPresenting=!1,t.setPixelRatio(T),t.setSize(B.width,B.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){c=Z,s.isPresenting===!0&&$t("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){p=Z,s.isPresenting===!0&&$t("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||h},this.setReferenceSpace=function(Z){d=Z},this.getBaseLayer=function(){return g!==null?g:M},this.getBinding=function(){return v===null&&C&&(v=new XRWebGLBinding(l,i)),v},this.getFrame=function(){return b},this.getSession=function(){return l},this.setSession=async function(Z){if(l=Z,l!==null){if(O=t.getRenderTarget(),l.addEventListener("select",j),l.addEventListener("selectstart",j),l.addEventListener("selectend",j),l.addEventListener("squeeze",j),l.addEventListener("squeezestart",j),l.addEventListener("squeezeend",j),l.addEventListener("end",L),l.addEventListener("inputsourceschange",H),w.xrCompatible!==!0&&await i.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(B),C&&"createProjectionLayer"in XRWebGLBinding.prototype){let At=null,Ht=null,te=null;w.depth&&(te=w.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,At=w.stencil?Xs:Ra,Ht=w.stencil?cl:Ki);const Qt={colorFormat:i.RGBA8,depthFormat:te,scaleFactor:c};v=this.getBinding(),g=v.createProjectionLayer(Qt),l.updateRenderState({layers:[g]}),t.setPixelRatio(1),t.setSize(g.textureWidth,g.textureHeight,!1),P=new Zi(g.textureWidth,g.textureHeight,{format:Ii,type:hi,depthTexture:new Kr(g.textureWidth,g.textureHeight,Ht,void 0,void 0,void 0,void 0,void 0,void 0,At),stencilBuffer:w.stencil,colorSpace:t.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1})}else{const At={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:c};M=new XRWebGLLayer(l,i,At),l.updateRenderState({baseLayer:M}),t.setPixelRatio(1),t.setSize(M.framebufferWidth,M.framebufferHeight,!1),P=new Zi(M.framebufferWidth,M.framebufferHeight,{format:Ii,type:hi,colorSpace:t.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:M.ignoreDepthValues===!1,resolveStencilBuffer:M.ignoreDepthValues===!1})}P.isXRRenderTarget=!0,this.setFoveation(m),d=null,h=await l.requestReferenceSpace(p),K.setContext(l),K.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return S.getDepthTexture()};function H(Z){for(let Mt=0;Mt<Z.removed.length;Mt++){const At=Z.removed[Mt],Ht=N.indexOf(At);Ht>=0&&(N[Ht]=null,z[Ht].disconnect(At))}for(let Mt=0;Mt<Z.added.length;Mt++){const At=Z.added[Mt];let Ht=N.indexOf(At);if(Ht===-1){for(let Qt=0;Qt<z.length;Qt++)if(Qt>=N.length){N.push(At),Ht=Qt;break}else if(N[Qt]===null){N[Qt]=At,Ht=Qt;break}if(Ht===-1)break}const te=z[Ht];te&&te.connect(At)}}const et=new tt,gt=new tt;function yt(Z,Mt,At){et.setFromMatrixPosition(Mt.matrixWorld),gt.setFromMatrixPosition(At.matrixWorld);const Ht=et.distanceTo(gt),te=Mt.projectionMatrix.elements,Qt=At.projectionMatrix.elements,je=te[14]/(te[10]-1),pe=te[14]/(te[10]+1),ye=(te[9]+1)/te[5],Ne=(te[9]-1)/te[5],ce=(te[8]-1)/te[0],ln=(Qt[8]+1)/Qt[0],Ye=je*ce,An=je*ln,W=Ht/(-ce+ln),en=W*-ce;if(Mt.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(en),Z.translateZ(W),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),te[10]===-1)Z.projectionMatrix.copy(Mt.projectionMatrix),Z.projectionMatrixInverse.copy(Mt.projectionMatrixInverse);else{const me=je+W,He=pe+W,Ct=Ye-en,Qe=An+(Ht-en),D=ye*pe/He*me,E=Ne*pe/He*me;Z.projectionMatrix.makePerspective(Ct,Qe,D,E,me,He),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function I(Z,Mt){Mt===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(Mt.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(l===null)return;let Mt=Z.near,At=Z.far;S.texture!==null&&(S.depthNear>0&&(Mt=S.depthNear),S.depthFar>0&&(At=S.depthFar)),$.near=q.near=F.near=Mt,$.far=q.far=F.far=At,(ut!==$.near||ht!==$.far)&&(l.updateRenderState({depthNear:$.near,depthFar:$.far}),ut=$.near,ht=$.far),$.layers.mask=Z.layers.mask|6,F.layers.mask=$.layers.mask&-5,q.layers.mask=$.layers.mask&-3;const Ht=Z.parent,te=$.cameras;I($,Ht);for(let Qt=0;Qt<te.length;Qt++)I(te[Qt],Ht);te.length===2?yt($,F,q):$.projectionMatrix.copy(F.projectionMatrix),Q(Z,$,Ht)};function Q(Z,Mt,At){At===null?Z.matrix.copy(Mt.matrixWorld):(Z.matrix.copy(At.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(Mt.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(Mt.projectionMatrix),Z.projectionMatrixInverse.copy(Mt.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=rp*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return $},this.getFoveation=function(){if(!(g===null&&M===null))return m},this.setFoveation=function(Z){m=Z,g!==null&&(g.fixedFoveation=Z),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=Z)},this.hasDepthSensing=function(){return S.texture!==null},this.getDepthSensingMesh=function(){return S.getMesh($)},this.getCameraTexture=function(Z){return y[Z]};let St=null;function bt(Z,Mt){if(_=Mt.getViewerPose(d||h),b=Mt,_!==null){const At=_.views;M!==null&&(t.setRenderTargetFramebuffer(P,M.framebuffer),t.setRenderTarget(P));let Ht=!1;At.length!==$.cameras.length&&($.cameras.length=0,Ht=!0);for(let pe=0;pe<At.length;pe++){const ye=At[pe];let Ne=null;if(M!==null)Ne=M.getViewport(ye);else{const ln=v.getViewSubImage(g,ye);Ne=ln.viewport,pe===0&&(t.setRenderTargetTextures(P,ln.colorTexture,ln.depthStencilTexture),t.setRenderTarget(P))}let ce=G[pe];ce===void 0&&(ce=new Ti,ce.layers.enable(pe),ce.viewport=new rn,G[pe]=ce),ce.matrix.fromArray(ye.transform.matrix),ce.matrix.decompose(ce.position,ce.quaternion,ce.scale),ce.projectionMatrix.fromArray(ye.projectionMatrix),ce.projectionMatrixInverse.copy(ce.projectionMatrix).invert(),ce.viewport.set(Ne.x,Ne.y,Ne.width,Ne.height),pe===0&&($.matrix.copy(ce.matrix),$.matrix.decompose($.position,$.quaternion,$.scale)),Ht===!0&&$.cameras.push(ce)}const te=l.enabledFeatures;if(te&&te.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&C){v=s.getBinding();const pe=v.getDepthInformation(At[0]);pe&&pe.isValid&&pe.texture&&S.init(pe,l.renderState)}if(te&&te.includes("camera-access")&&C){t.state.unbindTexture(),v=s.getBinding();for(let pe=0;pe<At.length;pe++){const ye=At[pe].camera;if(ye){let Ne=y[ye];Ne||(Ne=new ux,y[ye]=Ne);const ce=v.getCameraImage(ye);Ne.sourceTexture=ce}}}}for(let At=0;At<z.length;At++){const Ht=N[At],te=z[At];Ht!==null&&te!==void 0&&te.update(Ht,Mt,d||h)}St&&St(Z,Mt),Mt.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:Mt}),b=null}const K=new px;K.setAnimationLoop(bt),this.setAnimationLoop=function(Z){St=Z},this.dispose=function(){}}}const _R=new on,yx=new se;yx.set(-1,0,0,0,1,0,0,0,1);function vR(r,t){function i(S,y){S.matrixAutoUpdate===!0&&S.updateMatrix(),y.value.copy(S.matrix)}function s(S,y){y.color.getRGB(S.fogColor.value,fx(r)),y.isFog?(S.fogNear.value=y.near,S.fogFar.value=y.far):y.isFogExp2&&(S.fogDensity.value=y.density)}function l(S,y,w,O,P){y.isNodeMaterial?y.uniformsNeedUpdate=!1:y.isMeshBasicMaterial?c(S,y):y.isMeshLambertMaterial?(c(S,y),y.envMap&&(S.envMapIntensity.value=y.envMapIntensity)):y.isMeshToonMaterial?(c(S,y),v(S,y)):y.isMeshPhongMaterial?(c(S,y),_(S,y),y.envMap&&(S.envMapIntensity.value=y.envMapIntensity)):y.isMeshStandardMaterial?(c(S,y),g(S,y),y.isMeshPhysicalMaterial&&M(S,y,P)):y.isMeshMatcapMaterial?(c(S,y),b(S,y)):y.isMeshDepthMaterial?c(S,y):y.isMeshDistanceMaterial?(c(S,y),C(S,y)):y.isMeshNormalMaterial?c(S,y):y.isLineBasicMaterial?(h(S,y),y.isLineDashedMaterial&&p(S,y)):y.isPointsMaterial?m(S,y,w,O):y.isSpriteMaterial?d(S,y):y.isShadowMaterial?(S.color.value.copy(y.color),S.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function c(S,y){S.opacity.value=y.opacity,y.color&&S.diffuse.value.copy(y.color),y.emissive&&S.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(S.map.value=y.map,i(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,i(y.alphaMap,S.alphaMapTransform)),y.bumpMap&&(S.bumpMap.value=y.bumpMap,i(y.bumpMap,S.bumpMapTransform),S.bumpScale.value=y.bumpScale,y.side===Jn&&(S.bumpScale.value*=-1)),y.normalMap&&(S.normalMap.value=y.normalMap,i(y.normalMap,S.normalMapTransform),S.normalScale.value.copy(y.normalScale),y.side===Jn&&S.normalScale.value.negate()),y.displacementMap&&(S.displacementMap.value=y.displacementMap,i(y.displacementMap,S.displacementMapTransform),S.displacementScale.value=y.displacementScale,S.displacementBias.value=y.displacementBias),y.emissiveMap&&(S.emissiveMap.value=y.emissiveMap,i(y.emissiveMap,S.emissiveMapTransform)),y.specularMap&&(S.specularMap.value=y.specularMap,i(y.specularMap,S.specularMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest);const w=t.get(y),O=w.envMap,P=w.envMapRotation;O&&(S.envMap.value=O,S.envMapRotation.value.setFromMatrix4(_R.makeRotationFromEuler(P)).transpose(),O.isCubeTexture&&O.isRenderTargetTexture===!1&&S.envMapRotation.value.premultiply(yx),S.reflectivity.value=y.reflectivity,S.ior.value=y.ior,S.refractionRatio.value=y.refractionRatio),y.lightMap&&(S.lightMap.value=y.lightMap,S.lightMapIntensity.value=y.lightMapIntensity,i(y.lightMap,S.lightMapTransform)),y.aoMap&&(S.aoMap.value=y.aoMap,S.aoMapIntensity.value=y.aoMapIntensity,i(y.aoMap,S.aoMapTransform))}function h(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,y.map&&(S.map.value=y.map,i(y.map,S.mapTransform))}function p(S,y){S.dashSize.value=y.dashSize,S.totalSize.value=y.dashSize+y.gapSize,S.scale.value=y.scale}function m(S,y,w,O){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.size.value=y.size*w,S.scale.value=O*.5,y.map&&(S.map.value=y.map,i(y.map,S.uvTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,i(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function d(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.rotation.value=y.rotation,y.map&&(S.map.value=y.map,i(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,i(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function _(S,y){S.specular.value.copy(y.specular),S.shininess.value=Math.max(y.shininess,1e-4)}function v(S,y){y.gradientMap&&(S.gradientMap.value=y.gradientMap)}function g(S,y){S.metalness.value=y.metalness,y.metalnessMap&&(S.metalnessMap.value=y.metalnessMap,i(y.metalnessMap,S.metalnessMapTransform)),S.roughness.value=y.roughness,y.roughnessMap&&(S.roughnessMap.value=y.roughnessMap,i(y.roughnessMap,S.roughnessMapTransform)),y.envMap&&(S.envMapIntensity.value=y.envMapIntensity)}function M(S,y,w){S.ior.value=y.ior,y.sheen>0&&(S.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),S.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(S.sheenColorMap.value=y.sheenColorMap,i(y.sheenColorMap,S.sheenColorMapTransform)),y.sheenRoughnessMap&&(S.sheenRoughnessMap.value=y.sheenRoughnessMap,i(y.sheenRoughnessMap,S.sheenRoughnessMapTransform))),y.clearcoat>0&&(S.clearcoat.value=y.clearcoat,S.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(S.clearcoatMap.value=y.clearcoatMap,i(y.clearcoatMap,S.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,i(y.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(S.clearcoatNormalMap.value=y.clearcoatNormalMap,i(y.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===Jn&&S.clearcoatNormalScale.value.negate())),y.dispersion>0&&(S.dispersion.value=y.dispersion),y.iridescence>0&&(S.iridescence.value=y.iridescence,S.iridescenceIOR.value=y.iridescenceIOR,S.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(S.iridescenceMap.value=y.iridescenceMap,i(y.iridescenceMap,S.iridescenceMapTransform)),y.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=y.iridescenceThicknessMap,i(y.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),y.transmission>0&&(S.transmission.value=y.transmission,S.transmissionSamplerMap.value=w.texture,S.transmissionSamplerSize.value.set(w.width,w.height),y.transmissionMap&&(S.transmissionMap.value=y.transmissionMap,i(y.transmissionMap,S.transmissionMapTransform)),S.thickness.value=y.thickness,y.thicknessMap&&(S.thicknessMap.value=y.thicknessMap,i(y.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=y.attenuationDistance,S.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(S.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(S.anisotropyMap.value=y.anisotropyMap,i(y.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=y.specularIntensity,S.specularColor.value.copy(y.specularColor),y.specularColorMap&&(S.specularColorMap.value=y.specularColorMap,i(y.specularColorMap,S.specularColorMapTransform)),y.specularIntensityMap&&(S.specularIntensityMap.value=y.specularIntensityMap,i(y.specularIntensityMap,S.specularIntensityMapTransform))}function b(S,y){y.matcap&&(S.matcap.value=y.matcap)}function C(S,y){const w=t.get(y).light;S.referencePosition.value.setFromMatrixPosition(w.matrixWorld),S.nearDistance.value=w.shadow.camera.near,S.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:l}}function xR(r,t,i,s){let l={},c={},h=[];const p=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(w,O){const P=O.program;s.uniformBlockBinding(w,P)}function d(w,O){let P=l[w.id];P===void 0&&(b(w),P=_(w),l[w.id]=P,w.addEventListener("dispose",S));const z=O.program;s.updateUBOMapping(w,z);const N=t.render.frame;c[w.id]!==N&&(g(w),c[w.id]=N)}function _(w){const O=v();w.__bindingPointIndex=O;const P=r.createBuffer(),z=w.__size,N=w.usage;return r.bindBuffer(r.UNIFORM_BUFFER,P),r.bufferData(r.UNIFORM_BUFFER,z,N),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,O,P),P}function v(){for(let w=0;w<p;w++)if(h.indexOf(w)===-1)return h.push(w),w;return Ae("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(w){const O=l[w.id],P=w.uniforms,z=w.__cache;r.bindBuffer(r.UNIFORM_BUFFER,O);for(let N=0,B=P.length;N<B;N++){const T=Array.isArray(P[N])?P[N]:[P[N]];for(let F=0,q=T.length;F<q;F++){const G=T[F];if(M(G,N,F,z)===!0){const $=G.__offset,ut=Array.isArray(G.value)?G.value:[G.value];let ht=0;for(let j=0;j<ut.length;j++){const L=ut[j],H=C(L);typeof L=="number"||typeof L=="boolean"?(G.__data[0]=L,r.bufferSubData(r.UNIFORM_BUFFER,$+ht,G.__data)):L.isMatrix3?(G.__data[0]=L.elements[0],G.__data[1]=L.elements[1],G.__data[2]=L.elements[2],G.__data[3]=0,G.__data[4]=L.elements[3],G.__data[5]=L.elements[4],G.__data[6]=L.elements[5],G.__data[7]=0,G.__data[8]=L.elements[6],G.__data[9]=L.elements[7],G.__data[10]=L.elements[8],G.__data[11]=0):ArrayBuffer.isView(L)?G.__data.set(new L.constructor(L.buffer,L.byteOffset,G.__data.length)):(L.toArray(G.__data,ht),ht+=H.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,$,G.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function M(w,O,P,z){const N=w.value,B=O+"_"+P;if(z[B]===void 0)return typeof N=="number"||typeof N=="boolean"?z[B]=N:ArrayBuffer.isView(N)?z[B]=N.slice():z[B]=N.clone(),!0;{const T=z[B];if(typeof N=="number"||typeof N=="boolean"){if(T!==N)return z[B]=N,!0}else{if(ArrayBuffer.isView(N))return!0;if(T.equals(N)===!1)return T.copy(N),!0}}return!1}function b(w){const O=w.uniforms;let P=0;const z=16;for(let B=0,T=O.length;B<T;B++){const F=Array.isArray(O[B])?O[B]:[O[B]];for(let q=0,G=F.length;q<G;q++){const $=F[q],ut=Array.isArray($.value)?$.value:[$.value];for(let ht=0,j=ut.length;ht<j;ht++){const L=ut[ht],H=C(L),et=P%z,gt=et%H.boundary,yt=et+gt;P+=gt,yt!==0&&z-yt<H.storage&&(P+=z-yt),$.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=P,P+=H.storage}}}const N=P%z;return N>0&&(P+=z-N),w.__size=P,w.__cache={},this}function C(w){const O={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(O.boundary=4,O.storage=4):w.isVector2?(O.boundary=8,O.storage=8):w.isVector3||w.isColor?(O.boundary=16,O.storage=12):w.isVector4?(O.boundary=16,O.storage=16):w.isMatrix3?(O.boundary=48,O.storage=48):w.isMatrix4?(O.boundary=64,O.storage=64):w.isTexture?$t("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(w)?(O.boundary=16,O.storage=w.byteLength):$t("WebGLRenderer: Unsupported uniform value type.",w),O}function S(w){const O=w.target;O.removeEventListener("dispose",S);const P=h.indexOf(O.__bindingPointIndex);h.splice(P,1),r.deleteBuffer(l[O.id]),delete l[O.id],delete c[O.id]}function y(){for(const w in l)r.deleteBuffer(l[w]);h=[],l={},c={}}return{bind:m,update:d,dispose:y}}const SR=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Xi=null;function yR(){return Xi===null&&(Xi=new $M(SR,16,16,qs,Aa),Xi.name="DFG_LUT",Xi.minFilter=Bn,Xi.magFilter=Bn,Xi.wrapS=Ea,Xi.wrapT=Ea,Xi.generateMipmaps=!1,Xi.needsUpdate=!0),Xi}class MR{constructor(t={}){const{canvas:i=wM(),context:s=null,depth:l=!0,stencil:c=!1,alpha:h=!1,antialias:p=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:d=!1,powerPreference:_="default",failIfMajorPerformanceCaveat:v=!1,reversedDepthBuffer:g=!1,outputBufferType:M=hi}=t;this.isWebGLRenderer=!0;let b;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");b=s.getContextAttributes().alpha}else b=h;const C=M,S=new Set([Sp,xp,vp]),y=new Set([hi,Ki,ll,cl,gp,_p]),w=new Uint32Array(4),O=new Int32Array(4),P=new tt;let z=null,N=null;const B=[],T=[];let F=null;this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Yi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const q=this;let G=!1,$=null;this._outputColorSpace=Qn;let ut=0,ht=0,j=null,L=-1,H=null;const et=new rn,gt=new rn;let yt=null;const I=new de(0);let Q=0,St=i.width,bt=i.height,K=1,Z=null,Mt=null;const At=new rn(0,0,St,bt),Ht=new rn(0,0,St,bt);let te=!1;const Qt=new Ap;let je=!1,pe=!1;const ye=new on,Ne=new tt,ce=new rn,ln={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function An(){return j===null?K:1}let W=s;function en(A,Y){return i.getContext(A,Y)}try{const A={alpha:!0,depth:l,stencil:c,antialias:p,premultipliedAlpha:m,preserveDrawingBuffer:d,powerPreference:_,failIfMajorPerformanceCaveat:v};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${dp}`),i.addEventListener("webglcontextlost",Et,!1),i.addEventListener("webglcontextrestored",Wt,!1),i.addEventListener("webglcontextcreationerror",ee,!1),W===null){const Y="webgl2";if(W=en(Y,A),W===null)throw en(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw Ae("WebGLRenderer: "+A.message),A}let me,He,Ct,Qe,D,E,nt,vt,Tt,wt,Nt,ft,dt,Ot,Pt,Ut,Dt,ne,ie,_e,k,Rt,mt;function Bt(){me=new y1(W),me.init(),k=new hR(W,me),He=new d1(W,me,t,k),Ct=new uR(W,me),He.reversedDepthBuffer&&g&&Ct.buffers.depth.setReversed(!0),Qe=new b1(W),D=new KA,E=new fR(W,me,Ct,D,He,k,Qe),nt=new S1(q),vt=new CE(W),Rt=new f1(W,vt),Tt=new M1(W,vt,Qe,Rt),wt=new A1(W,Tt,vt,Rt,Qe),ne=new T1(W,He,E),Pt=new p1(D),Nt=new ZA(q,nt,me,He,Rt,Pt),ft=new vR(q,D),dt=new JA,Ot=new aR(me),Dt=new u1(q,nt,Ct,wt,b,m),Ut=new cR(q,wt,He),mt=new xR(W,Qe,He,Ct),ie=new h1(W,me,Qe),_e=new E1(W,me,Qe),Qe.programs=Nt.programs,q.capabilities=He,q.extensions=me,q.properties=D,q.renderLists=dt,q.shadowMap=Ut,q.state=Ct,q.info=Qe}Bt(),C!==hi&&(F=new C1(C,i.width,i.height,l,c));const Lt=new gR(q,W);this.xr=Lt,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){const A=me.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=me.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(A){A!==void 0&&(K=A,this.setSize(St,bt,!1))},this.getSize=function(A){return A.set(St,bt)},this.setSize=function(A,Y,ot=!0){if(Lt.isPresenting){$t("WebGLRenderer: Can't change size while VR device is presenting.");return}St=A,bt=Y,i.width=Math.floor(A*K),i.height=Math.floor(Y*K),ot===!0&&(i.style.width=A+"px",i.style.height=Y+"px"),F!==null&&F.setSize(i.width,i.height),this.setViewport(0,0,A,Y)},this.getDrawingBufferSize=function(A){return A.set(St*K,bt*K).floor()},this.setDrawingBufferSize=function(A,Y,ot){St=A,bt=Y,K=ot,i.width=Math.floor(A*ot),i.height=Math.floor(Y*ot),this.setViewport(0,0,A,Y)},this.setEffects=function(A){if(C===hi){Ae("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let Y=0;Y<A.length;Y++)if(A[Y].isOutputPass===!0){$t("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}F.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(et)},this.getViewport=function(A){return A.copy(At)},this.setViewport=function(A,Y,ot,st){A.isVector4?At.set(A.x,A.y,A.z,A.w):At.set(A,Y,ot,st),Ct.viewport(et.copy(At).multiplyScalar(K).round())},this.getScissor=function(A){return A.copy(Ht)},this.setScissor=function(A,Y,ot,st){A.isVector4?Ht.set(A.x,A.y,A.z,A.w):Ht.set(A,Y,ot,st),Ct.scissor(gt.copy(Ht).multiplyScalar(K).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(A){Ct.setScissorTest(te=A)},this.setOpaqueSort=function(A){Z=A},this.setTransparentSort=function(A){Mt=A},this.getClearColor=function(A){return A.copy(Dt.getClearColor())},this.setClearColor=function(){Dt.setClearColor(...arguments)},this.getClearAlpha=function(){return Dt.getClearAlpha()},this.setClearAlpha=function(){Dt.setClearAlpha(...arguments)},this.clear=function(A=!0,Y=!0,ot=!0){let st=0;if(A){let rt=!1;if(j!==null){const Ft=j.texture.format;rt=S.has(Ft)}if(rt){const Ft=j.texture.type,Vt=y.has(Ft),It=Dt.getClearColor(),Xt=Dt.getClearAlpha(),kt=It.r,Zt=It.g,oe=It.b;Vt?(w[0]=kt,w[1]=Zt,w[2]=oe,w[3]=Xt,W.clearBufferuiv(W.COLOR,0,w)):(O[0]=kt,O[1]=Zt,O[2]=oe,O[3]=Xt,W.clearBufferiv(W.COLOR,0,O))}else st|=W.COLOR_BUFFER_BIT}Y&&(st|=W.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ot&&(st|=W.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),st!==0&&W.clear(st)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),$=A},this.dispose=function(){i.removeEventListener("webglcontextlost",Et,!1),i.removeEventListener("webglcontextrestored",Wt,!1),i.removeEventListener("webglcontextcreationerror",ee,!1),Dt.dispose(),dt.dispose(),Ot.dispose(),D.dispose(),nt.dispose(),wt.dispose(),Rt.dispose(),mt.dispose(),Nt.dispose(),Lt.dispose(),Lt.removeEventListener("sessionstart",eo),Lt.removeEventListener("sessionend",no),Nn.stop()};function Et(A){A.preventDefault(),L_("WebGLRenderer: Context Lost."),G=!0}function Wt(){L_("WebGLRenderer: Context Restored."),G=!1;const A=Qe.autoReset,Y=Ut.enabled,ot=Ut.autoUpdate,st=Ut.needsUpdate,rt=Ut.type;Bt(),Qe.autoReset=A,Ut.enabled=Y,Ut.autoUpdate=ot,Ut.needsUpdate=st,Ut.type=rt}function ee(A){Ae("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function nn(A){const Y=A.target;Y.removeEventListener("dispose",nn),De(Y)}function De(A){mi(A),D.remove(A)}function mi(A){const Y=D.get(A).programs;Y!==void 0&&(Y.forEach(function(ot){Nt.releaseProgram(ot)}),A.isShaderMaterial&&Nt.releaseShaderCache(A))}this.renderBufferDirect=function(A,Y,ot,st,rt,Ft){Y===null&&(Y=ln);const Vt=rt.isMesh&&rt.matrixWorld.determinant()<0,It=Da(A,Y,ot,st,rt);Ct.setMaterial(st,Vt);let Xt=ot.index,kt=1;if(st.wireframe===!0){if(Xt=Tt.getWireframeAttribute(ot),Xt===void 0)return;kt=2}const Zt=ot.drawRange,oe=ot.attributes.position;let Yt=Zt.start*kt,Re=(Zt.start+Zt.count)*kt;Ft!==null&&(Yt=Math.max(Yt,Ft.start*kt),Re=Math.min(Re,(Ft.start+Ft.count)*kt)),Xt!==null?(Yt=Math.max(Yt,0),Re=Math.min(Re,Xt.count)):oe!=null&&(Yt=Math.max(Yt,0),Re=Math.min(Re,oe.count));const Je=Re-Yt;if(Je<0||Je===1/0)return;Rt.setup(rt,st,It,ot,Xt);let We,Oe=ie;if(Xt!==null&&(We=vt.get(Xt),Oe=_e,Oe.setIndex(We)),rt.isMesh)st.wireframe===!0?(Ct.setLineWidth(st.wireframeLinewidth*An()),Oe.setMode(W.LINES)):Oe.setMode(W.TRIANGLES);else if(rt.isLine){let Pe=st.linewidth;Pe===void 0&&(Pe=1),Ct.setLineWidth(Pe*An()),rt.isLineSegments?Oe.setMode(W.LINES):rt.isLineLoop?Oe.setMode(W.LINE_LOOP):Oe.setMode(W.LINE_STRIP)}else rt.isPoints?Oe.setMode(W.POINTS):rt.isSprite&&Oe.setMode(W.TRIANGLES);if(rt.isBatchedMesh)if(me.get("WEBGL_multi_draw"))Oe.renderMultiDraw(rt._multiDrawStarts,rt._multiDrawCounts,rt._multiDrawCount);else{const Pe=rt._multiDrawStarts,Gt=rt._multiDrawCounts,On=rt._multiDrawCount,ve=Xt?vt.get(Xt).bytesPerElement:1,vn=D.get(st).currentProgram.getUniforms();for(let ei=0;ei<On;ei++)vn.setValue(W,"_gl_DrawID",ei),Oe.render(Pe[ei]/ve,Gt[ei])}else if(rt.isInstancedMesh)Oe.renderInstances(Yt,Je,rt.count);else if(ot.isInstancedBufferGeometry){const Pe=ot._maxInstanceCount!==void 0?ot._maxInstanceCount:1/0,Gt=Math.min(ot.instanceCount,Pe);Oe.renderInstances(Yt,Je,Gt)}else Oe.render(Yt,Je)};function ti(A,Y,ot){A.transparent===!0&&A.side===Ma&&A.forceSinglePass===!1?(A.side=Jn,A.needsUpdate=!0,Ks(A,Y,ot),A.side=ds,A.needsUpdate=!0,Ks(A,Y,ot),A.side=Ma):Ks(A,Y,ot)}this.compile=function(A,Y,ot=null){ot===null&&(ot=A),N=Ot.get(ot),N.init(Y),T.push(N),ot.traverseVisible(function(rt){rt.isLight&&rt.layers.test(Y.layers)&&(N.pushLight(rt),rt.castShadow&&N.pushShadow(rt))}),A!==ot&&A.traverseVisible(function(rt){rt.isLight&&rt.layers.test(Y.layers)&&(N.pushLight(rt),rt.castShadow&&N.pushShadow(rt))}),N.setupLights();const st=new Set;return A.traverse(function(rt){if(!(rt.isMesh||rt.isPoints||rt.isLine||rt.isSprite))return;const Ft=rt.material;if(Ft)if(Array.isArray(Ft))for(let Vt=0;Vt<Ft.length;Vt++){const It=Ft[Vt];ti(It,ot,rt),st.add(It)}else ti(Ft,ot,rt),st.add(Ft)}),N=T.pop(),st},this.compileAsync=function(A,Y,ot=null){const st=this.compile(A,Y,ot);return new Promise(rt=>{function Ft(){if(st.forEach(function(Vt){D.get(Vt).currentProgram.isReady()&&st.delete(Vt)}),st.size===0){rt(A);return}setTimeout(Ft,10)}me.get("KHR_parallel_shader_compile")!==null?Ft():setTimeout(Ft,10)})};let vs=null;function to(A){vs&&vs(A)}function eo(){Nn.stop()}function no(){Nn.start()}const Nn=new px;Nn.setAnimationLoop(to),typeof self<"u"&&Nn.setContext(self),this.setAnimationLoop=function(A){vs=A,Lt.setAnimationLoop(A),A===null?Nn.stop():Nn.start()},Lt.addEventListener("sessionstart",eo),Lt.addEventListener("sessionend",no),this.render=function(A,Y){if(Y!==void 0&&Y.isCamera!==!0){Ae("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(G===!0)return;$!==null&&$.renderStart(A,Y);const ot=Lt.enabled===!0&&Lt.isPresenting===!0,st=F!==null&&(j===null||ot)&&F.begin(q,j);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),Lt.enabled===!0&&Lt.isPresenting===!0&&(F===null||F.isCompositing()===!1)&&(Lt.cameraAutoUpdate===!0&&Lt.updateCamera(Y),Y=Lt.getCamera()),A.isScene===!0&&A.onBeforeRender(q,A,Y,j),N=Ot.get(A,T.length),N.init(Y),N.state.textureUnits=E.getTextureUnits(),T.push(N),ye.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),Qt.setFromProjectionMatrix(ye,qi,Y.reversedDepth),pe=this.localClippingEnabled,je=Pt.init(this.clippingPlanes,pe),z=dt.get(A,B.length),z.init(),B.push(z),Lt.enabled===!0&&Lt.isPresenting===!0){const Vt=q.xr.getDepthSensingMesh();Vt!==null&&cn(Vt,Y,-1/0,q.sortObjects)}cn(A,Y,0,q.sortObjects),z.finish(),q.sortObjects===!0&&z.sort(Z,Mt),Ye=Lt.enabled===!1||Lt.isPresenting===!1||Lt.hasDepthSensing()===!1,Ye&&Dt.addToRenderList(z,A),this.info.render.frame++,je===!0&&Pt.beginShadows();const rt=N.state.shadowsArray;if(Ut.render(rt,A,Y),je===!0&&Pt.endShadows(),this.info.autoReset===!0&&this.info.reset(),(st&&F.hasRenderPass())===!1){const Vt=z.opaque,It=z.transmissive;if(N.setupLights(),Y.isArrayCamera){const Xt=Y.cameras;if(It.length>0)for(let kt=0,Zt=Xt.length;kt<Zt;kt++){const oe=Xt[kt];Ji(Vt,It,A,oe)}Ye&&Dt.render(A);for(let kt=0,Zt=Xt.length;kt<Zt;kt++){const oe=Xt[kt];Rn(z,A,oe,oe.viewport)}}else It.length>0&&Ji(Vt,It,A,Y),Ye&&Dt.render(A),Rn(z,A,Y)}j!==null&&ht===0&&(E.updateMultisampleRenderTarget(j),E.updateRenderTargetMipmap(j)),st&&F.end(q),A.isScene===!0&&A.onAfterRender(q,A,Y),Rt.resetDefaultState(),L=-1,H=null,T.pop(),T.length>0?(N=T[T.length-1],E.setTextureUnits(N.state.textureUnits),je===!0&&Pt.setGlobalState(q.clippingPlanes,N.state.camera)):N=null,B.pop(),B.length>0?z=B[B.length-1]:z=null,$!==null&&$.renderEnd()};function cn(A,Y,ot,st){if(A.visible===!1)return;if(A.layers.test(Y.layers)){if(A.isGroup)ot=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(Y);else if(A.isLightProbeGrid)N.pushLightProbeGrid(A);else if(A.isLight)N.pushLight(A),A.castShadow&&N.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Qt.intersectsSprite(A)){st&&ce.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ye);const Vt=wt.update(A),It=A.material;It.visible&&z.push(A,Vt,It,ot,ce.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Qt.intersectsObject(A))){const Vt=wt.update(A),It=A.material;if(st&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),ce.copy(A.boundingSphere.center)):(Vt.boundingSphere===null&&Vt.computeBoundingSphere(),ce.copy(Vt.boundingSphere.center)),ce.applyMatrix4(A.matrixWorld).applyMatrix4(ye)),Array.isArray(It)){const Xt=Vt.groups;for(let kt=0,Zt=Xt.length;kt<Zt;kt++){const oe=Xt[kt],Yt=It[oe.materialIndex];Yt&&Yt.visible&&z.push(A,Vt,Yt,ot,ce.z,oe)}}else It.visible&&z.push(A,Vt,It,ot,ce.z,null)}}const Ft=A.children;for(let Vt=0,It=Ft.length;Vt<It;Vt++)cn(Ft[Vt],Y,ot,st)}function Rn(A,Y,ot,st){const{opaque:rt,transmissive:Ft,transparent:Vt}=A;N.setupLightsView(ot),je===!0&&Pt.setGlobalState(q.clippingPlanes,ot),st&&Ct.viewport(et.copy(st)),rt.length>0&&Ca(rt,Y,ot),Ft.length>0&&Ca(Ft,Y,ot),Vt.length>0&&Ca(Vt,Y,ot),Ct.buffers.depth.setTest(!0),Ct.buffers.depth.setMask(!0),Ct.buffers.color.setMask(!0),Ct.setPolygonOffset(!1)}function Ji(A,Y,ot,st){if((ot.isScene===!0?ot.overrideMaterial:null)!==null)return;if(N.state.transmissionRenderTarget[st.id]===void 0){const Yt=me.has("EXT_color_buffer_half_float")||me.has("EXT_color_buffer_float");N.state.transmissionRenderTarget[st.id]=new Zi(1,1,{generateMipmaps:!0,type:Yt?Aa:hi,minFilter:ks,samples:Math.max(4,He.samples),stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Te.workingColorSpace})}const Ft=N.state.transmissionRenderTarget[st.id],Vt=st.viewport||et;Ft.setSize(Vt.z*q.transmissionResolutionScale,Vt.w*q.transmissionResolutionScale);const It=q.getRenderTarget(),Xt=q.getActiveCubeFace(),kt=q.getActiveMipmapLevel();q.setRenderTarget(Ft),q.getClearColor(I),Q=q.getClearAlpha(),Q<1&&q.setClearColor(16777215,.5),q.clear(),Ye&&Dt.render(ot);const Zt=q.toneMapping;q.toneMapping=Yi;const oe=st.viewport;if(st.viewport!==void 0&&(st.viewport=void 0),N.setupLightsView(st),je===!0&&Pt.setGlobalState(q.clippingPlanes,st),Ca(A,ot,st),E.updateMultisampleRenderTarget(Ft),E.updateRenderTargetMipmap(Ft),me.has("WEBGL_multisampled_render_to_texture")===!1){let Yt=!1;for(let Re=0,Je=Y.length;Re<Je;Re++){const We=Y[Re],{object:Oe,geometry:Pe,material:Gt,group:On}=We;if(Gt.side===Ma&&Oe.layers.test(st.layers)){const ve=Gt.side;Gt.side=Jn,Gt.needsUpdate=!0,ml(Oe,ot,st,Pe,Gt,On),Gt.side=ve,Gt.needsUpdate=!0,Yt=!0}}Yt===!0&&(E.updateMultisampleRenderTarget(Ft),E.updateRenderTargetMipmap(Ft))}q.setRenderTarget(It,Xt,kt),q.setClearColor(I,Q),oe!==void 0&&(st.viewport=oe),q.toneMapping=Zt}function Ca(A,Y,ot){const st=Y.isScene===!0?Y.overrideMaterial:null;for(let rt=0,Ft=A.length;rt<Ft;rt++){const Vt=A[rt],{object:It,geometry:Xt,group:kt}=Vt;let Zt=Vt.material;Zt.allowOverride===!0&&st!==null&&(Zt=st),It.layers.test(ot.layers)&&ml(It,Y,ot,Xt,Zt,kt)}}function ml(A,Y,ot,st,rt,Ft){A.onBeforeRender(q,Y,ot,st,rt,Ft),A.modelViewMatrix.multiplyMatrices(ot.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),rt.onBeforeRender(q,Y,ot,st,A,Ft),rt.transparent===!0&&rt.side===Ma&&rt.forceSinglePass===!1?(rt.side=Jn,rt.needsUpdate=!0,q.renderBufferDirect(ot,Y,st,rt,A,Ft),rt.side=ds,rt.needsUpdate=!0,q.renderBufferDirect(ot,Y,st,rt,A,Ft),rt.side=Ma):q.renderBufferDirect(ot,Y,st,rt,A,Ft),A.onAfterRender(q,Y,ot,st,rt,Ft)}function Ks(A,Y,ot){Y.isScene!==!0&&(Y=ln);const st=D.get(A),rt=N.state.lights,Ft=N.state.shadowsArray,Vt=rt.state.version,It=Nt.getParameters(A,rt.state,Ft,Y,ot,N.state.lightProbeGridArray),Xt=Nt.getProgramCacheKey(It);let kt=st.programs;st.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?Y.environment:null,st.fog=Y.fog;const Zt=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;st.envMap=nt.get(A.envMap||st.environment,Zt),st.envMapRotation=st.environment!==null&&A.envMap===null?Y.environmentRotation:A.envMapRotation,kt===void 0&&(A.addEventListener("dispose",nn),kt=new Map,st.programs=kt);let oe=kt.get(Xt);if(oe!==void 0){if(st.currentProgram===oe&&st.lightsStateVersion===Vt)return wa(A,It),oe}else It.uniforms=Nt.getUniforms(A),$!==null&&A.isNodeMaterial&&$.build(A,ot,It),A.onBeforeCompile(It,q),oe=Nt.acquireProgram(It,Xt),kt.set(Xt,oe),st.uniforms=It.uniforms;const Yt=st.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Yt.clippingPlanes=Pt.uniform),wa(A,It),st.needsLights=xs(A),st.lightsStateVersion=Vt,st.needsLights&&(Yt.ambientLightColor.value=rt.state.ambient,Yt.lightProbe.value=rt.state.probe,Yt.directionalLights.value=rt.state.directional,Yt.directionalLightShadows.value=rt.state.directionalShadow,Yt.spotLights.value=rt.state.spot,Yt.spotLightShadows.value=rt.state.spotShadow,Yt.rectAreaLights.value=rt.state.rectArea,Yt.ltc_1.value=rt.state.rectAreaLTC1,Yt.ltc_2.value=rt.state.rectAreaLTC2,Yt.pointLights.value=rt.state.point,Yt.pointLightShadows.value=rt.state.pointShadow,Yt.hemisphereLights.value=rt.state.hemi,Yt.directionalShadowMatrix.value=rt.state.directionalShadowMatrix,Yt.spotLightMatrix.value=rt.state.spotLightMatrix,Yt.spotLightMap.value=rt.state.spotLightMap,Yt.pointShadowMatrix.value=rt.state.pointShadowMatrix),st.lightProbeGrid=N.state.lightProbeGridArray.length>0,st.currentProgram=oe,st.uniformsList=null,oe}function io(A){if(A.uniformsList===null){const Y=A.currentProgram.getUniforms();A.uniformsList=su.seqWithValue(Y.seq,A.uniforms)}return A.uniformsList}function wa(A,Y){const ot=D.get(A);ot.outputColorSpace=Y.outputColorSpace,ot.batching=Y.batching,ot.batchingColor=Y.batchingColor,ot.instancing=Y.instancing,ot.instancingColor=Y.instancingColor,ot.instancingMorph=Y.instancingMorph,ot.skinning=Y.skinning,ot.morphTargets=Y.morphTargets,ot.morphNormals=Y.morphNormals,ot.morphColors=Y.morphColors,ot.morphTargetsCount=Y.morphTargetsCount,ot.numClippingPlanes=Y.numClippingPlanes,ot.numIntersection=Y.numClipIntersection,ot.vertexAlphas=Y.vertexAlphas,ot.vertexTangents=Y.vertexTangents,ot.toneMapping=Y.toneMapping}function ao(A,Y){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;P.setFromMatrixPosition(Y.matrixWorld);for(let ot=0,st=A.length;ot<st;ot++){const rt=A[ot];if(rt.texture!==null&&rt.boundingBox.containsPoint(P))return rt}return null}function Da(A,Y,ot,st,rt){Y.isScene!==!0&&(Y=ln),E.resetTextureUnits();const Ft=Y.fog,Vt=st.isMeshStandardMaterial||st.isMeshLambertMaterial||st.isMeshPhongMaterial?Y.environment:null,It=j===null?q.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Te.workingColorSpace,Xt=st.isMeshStandardMaterial||st.isMeshLambertMaterial&&!st.envMap||st.isMeshPhongMaterial&&!st.envMap,kt=nt.get(st.envMap||Vt,Xt),Zt=st.vertexColors===!0&&!!ot.attributes.color&&ot.attributes.color.itemSize===4,oe=!!ot.attributes.tangent&&(!!st.normalMap||st.anisotropy>0),Yt=!!ot.morphAttributes.position,Re=!!ot.morphAttributes.normal,Je=!!ot.morphAttributes.color;let We=Yi;st.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(We=q.toneMapping);const Oe=ot.morphAttributes.position||ot.morphAttributes.normal||ot.morphAttributes.color,Pe=Oe!==void 0?Oe.length:0,Gt=D.get(st),On=N.state.lights;if(je===!0&&(pe===!0||A!==H)){const Le=A===H&&st.id===L;Pt.setState(st,A,Le)}let ve=!1;st.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==On.state.version||Gt.outputColorSpace!==It||rt.isBatchedMesh&&Gt.batching===!1||!rt.isBatchedMesh&&Gt.batching===!0||rt.isBatchedMesh&&Gt.batchingColor===!0&&rt.colorTexture===null||rt.isBatchedMesh&&Gt.batchingColor===!1&&rt.colorTexture!==null||rt.isInstancedMesh&&Gt.instancing===!1||!rt.isInstancedMesh&&Gt.instancing===!0||rt.isSkinnedMesh&&Gt.skinning===!1||!rt.isSkinnedMesh&&Gt.skinning===!0||rt.isInstancedMesh&&Gt.instancingColor===!0&&rt.instanceColor===null||rt.isInstancedMesh&&Gt.instancingColor===!1&&rt.instanceColor!==null||rt.isInstancedMesh&&Gt.instancingMorph===!0&&rt.morphTexture===null||rt.isInstancedMesh&&Gt.instancingMorph===!1&&rt.morphTexture!==null||Gt.envMap!==kt||st.fog===!0&&Gt.fog!==Ft||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==Pt.numPlanes||Gt.numIntersection!==Pt.numIntersection)||Gt.vertexAlphas!==Zt||Gt.vertexTangents!==oe||Gt.morphTargets!==Yt||Gt.morphNormals!==Re||Gt.morphColors!==Je||Gt.toneMapping!==We||Gt.morphTargetsCount!==Pe||!!Gt.lightProbeGrid!=N.state.lightProbeGridArray.length>0)&&(ve=!0):(ve=!0,Gt.__version=st.version);let vn=Gt.currentProgram;ve===!0&&(vn=Ks(st,Y,rt),$&&st.isNodeMaterial&&$.onUpdateProgram(st,vn,Gt));let ei=!1,Ri=!1,ni=!1;const Ie=vn.getUniforms(),$e=Gt.uniforms;if(Ct.useProgram(vn.program)&&(ei=!0,Ri=!0,ni=!0),st.id!==L&&(L=st.id,Ri=!0),Gt.needsLights){const Le=ao(N.state.lightProbeGridArray,rt);Gt.lightProbeGrid!==Le&&(Gt.lightProbeGrid=Le,Ri=!0)}if(ei||H!==A){Ct.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),Ie.setValue(W,"projectionMatrix",A.projectionMatrix),Ie.setValue(W,"viewMatrix",A.matrixWorldInverse);const Bi=Ie.map.cameraPosition;Bi!==void 0&&Bi.setValue(W,Ne.setFromMatrixPosition(A.matrixWorld)),He.logarithmicDepthBuffer&&Ie.setValue(W,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(st.isMeshPhongMaterial||st.isMeshToonMaterial||st.isMeshLambertMaterial||st.isMeshBasicMaterial||st.isMeshStandardMaterial||st.isShaderMaterial)&&Ie.setValue(W,"isOrthographic",A.isOrthographicCamera===!0),H!==A&&(H=A,Ri=!0,ni=!0)}if(Gt.needsLights&&(On.state.directionalShadowMap.length>0&&Ie.setValue(W,"directionalShadowMap",On.state.directionalShadowMap,E),On.state.spotShadowMap.length>0&&Ie.setValue(W,"spotShadowMap",On.state.spotShadowMap,E),On.state.pointShadowMap.length>0&&Ie.setValue(W,"pointShadowMap",On.state.pointShadowMap,E)),rt.isSkinnedMesh){Ie.setOptional(W,rt,"bindMatrix"),Ie.setOptional(W,rt,"bindMatrixInverse");const Le=rt.skeleton;Le&&(Le.boneTexture===null&&Le.computeBoneTexture(),Ie.setValue(W,"boneTexture",Le.boneTexture,E))}rt.isBatchedMesh&&(Ie.setOptional(W,rt,"batchingTexture"),Ie.setValue(W,"batchingTexture",rt._matricesTexture,E),Ie.setOptional(W,rt,"batchingIdTexture"),Ie.setValue(W,"batchingIdTexture",rt._indirectTexture,E),Ie.setOptional(W,rt,"batchingColorTexture"),rt._colorsTexture!==null&&Ie.setValue(W,"batchingColorTexture",rt._colorsTexture,E));const Ci=ot.morphAttributes;if((Ci.position!==void 0||Ci.normal!==void 0||Ci.color!==void 0)&&ne.update(rt,ot,vn),(Ri||Gt.receiveShadow!==rt.receiveShadow)&&(Gt.receiveShadow=rt.receiveShadow,Ie.setValue(W,"receiveShadow",rt.receiveShadow)),(st.isMeshStandardMaterial||st.isMeshLambertMaterial||st.isMeshPhongMaterial)&&st.envMap===null&&Y.environment!==null&&($e.envMapIntensity.value=Y.environmentIntensity),$e.dfgLUT!==void 0&&($e.dfgLUT.value=yR()),Ri){if(Ie.setValue(W,"toneMappingExposure",q.toneMappingExposure),Gt.needsLights&&Ua($e,ni),Ft&&st.fog===!0&&ft.refreshFogUniforms($e,Ft),ft.refreshMaterialUniforms($e,st,K,bt,N.state.transmissionRenderTarget[A.id]),Gt.needsLights&&Gt.lightProbeGrid){const Le=Gt.lightProbeGrid;$e.probesSH.value=Le.texture,$e.probesMin.value.copy(Le.boundingBox.min),$e.probesMax.value.copy(Le.boundingBox.max),$e.probesResolution.value.copy(Le.resolution)}su.upload(W,io(Gt),$e,E)}if(st.isShaderMaterial&&st.uniformsNeedUpdate===!0&&(su.upload(W,io(Gt),$e,E),st.uniformsNeedUpdate=!1),st.isSpriteMaterial&&Ie.setValue(W,"center",rt.center),Ie.setValue(W,"modelViewMatrix",rt.modelViewMatrix),Ie.setValue(W,"normalMatrix",rt.normalMatrix),Ie.setValue(W,"modelMatrix",rt.matrixWorld),st.uniformsGroups!==void 0){const Le=st.uniformsGroups;for(let Bi=0,Na=Le.length;Bi<Na;Bi++){const Ss=Le[Bi];mt.update(Ss,vn),mt.bind(Ss,vn)}}return vn}function Ua(A,Y){A.ambientLightColor.needsUpdate=Y,A.lightProbe.needsUpdate=Y,A.directionalLights.needsUpdate=Y,A.directionalLightShadows.needsUpdate=Y,A.pointLights.needsUpdate=Y,A.pointLightShadows.needsUpdate=Y,A.spotLights.needsUpdate=Y,A.spotLightShadows.needsUpdate=Y,A.rectAreaLights.needsUpdate=Y,A.hemisphereLights.needsUpdate=Y}function xs(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return ut},this.getActiveMipmapLevel=function(){return ht},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(A,Y,ot){const st=D.get(A);st.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,st.__autoAllocateDepthBuffer===!1&&(st.__useRenderToTexture=!1),D.get(A.texture).__webglTexture=Y,D.get(A.depthTexture).__webglTexture=st.__autoAllocateDepthBuffer?void 0:ot,st.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,Y){const ot=D.get(A);ot.__webglFramebuffer=Y,ot.__useDefaultFramebuffer=Y===void 0};const La=W.createFramebuffer();this.setRenderTarget=function(A,Y=0,ot=0){j=A,ut=Y,ht=ot;let st=null,rt=!1,Ft=!1;if(A){const It=D.get(A);if(It.__useDefaultFramebuffer!==void 0){Ct.bindFramebuffer(W.FRAMEBUFFER,It.__webglFramebuffer),et.copy(A.viewport),gt.copy(A.scissor),yt=A.scissorTest,Ct.viewport(et),Ct.scissor(gt),Ct.setScissorTest(yt),L=-1;return}else if(It.__webglFramebuffer===void 0)E.setupRenderTarget(A);else if(It.__hasExternalTextures)E.rebindTextures(A,D.get(A.texture).__webglTexture,D.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Zt=A.depthTexture;if(It.__boundDepthTexture!==Zt){if(Zt!==null&&D.has(Zt)&&(A.width!==Zt.image.width||A.height!==Zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(A)}}const Xt=A.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Ft=!0);const kt=D.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(kt[Y])?st=kt[Y][ot]:st=kt[Y],rt=!0):A.samples>0&&E.useMultisampledRTT(A)===!1?st=D.get(A).__webglMultisampledFramebuffer:Array.isArray(kt)?st=kt[ot]:st=kt,et.copy(A.viewport),gt.copy(A.scissor),yt=A.scissorTest}else et.copy(At).multiplyScalar(K).floor(),gt.copy(Ht).multiplyScalar(K).floor(),yt=te;if(ot!==0&&(st=La),Ct.bindFramebuffer(W.FRAMEBUFFER,st)&&Ct.drawBuffers(A,st),Ct.viewport(et),Ct.scissor(gt),Ct.setScissorTest(yt),rt){const It=D.get(A.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+Y,It.__webglTexture,ot)}else if(Ft){const It=Y;for(let Xt=0;Xt<A.textures.length;Xt++){const kt=D.get(A.textures[Xt]);W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0+Xt,kt.__webglTexture,ot,It)}}else if(A!==null&&ot!==0){const It=D.get(A.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,It.__webglTexture,ot)}L=-1},this.readRenderTargetPixels=function(A,Y,ot,st,rt,Ft,Vt,It=0){if(!(A&&A.isWebGLRenderTarget)){Ae("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Xt=D.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Vt!==void 0&&(Xt=Xt[Vt]),Xt){Ct.bindFramebuffer(W.FRAMEBUFFER,Xt);try{const kt=A.textures[It],Zt=kt.format,oe=kt.type;if(A.textures.length>1&&W.readBuffer(W.COLOR_ATTACHMENT0+It),!He.textureFormatReadable(Zt)){Ae("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!He.textureTypeReadable(oe)){Ae("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=A.width-st&&ot>=0&&ot<=A.height-rt&&W.readPixels(Y,ot,st,rt,k.convert(Zt),k.convert(oe),Ft)}finally{const kt=j!==null?D.get(j).__webglFramebuffer:null;Ct.bindFramebuffer(W.FRAMEBUFFER,kt)}}},this.readRenderTargetPixelsAsync=async function(A,Y,ot,st,rt,Ft,Vt,It=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Xt=D.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Vt!==void 0&&(Xt=Xt[Vt]),Xt)if(Y>=0&&Y<=A.width-st&&ot>=0&&ot<=A.height-rt){Ct.bindFramebuffer(W.FRAMEBUFFER,Xt);const kt=A.textures[It],Zt=kt.format,oe=kt.type;if(A.textures.length>1&&W.readBuffer(W.COLOR_ATTACHMENT0+It),!He.textureFormatReadable(Zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!He.textureTypeReadable(oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Yt=W.createBuffer();W.bindBuffer(W.PIXEL_PACK_BUFFER,Yt),W.bufferData(W.PIXEL_PACK_BUFFER,Ft.byteLength,W.STREAM_READ),W.readPixels(Y,ot,st,rt,k.convert(Zt),k.convert(oe),0);const Re=j!==null?D.get(j).__webglFramebuffer:null;Ct.bindFramebuffer(W.FRAMEBUFFER,Re);const Je=W.fenceSync(W.SYNC_GPU_COMMANDS_COMPLETE,0);return W.flush(),await DM(W,Je,4),W.bindBuffer(W.PIXEL_PACK_BUFFER,Yt),W.getBufferSubData(W.PIXEL_PACK_BUFFER,0,Ft),W.deleteBuffer(Yt),W.deleteSync(Je),Ft}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,Y=null,ot=0){const st=Math.pow(2,-ot),rt=Math.floor(A.image.width*st),Ft=Math.floor(A.image.height*st),Vt=Y!==null?Y.x:0,It=Y!==null?Y.y:0;E.setTexture2D(A,0),W.copyTexSubImage2D(W.TEXTURE_2D,ot,0,0,Vt,It,rt,Ft),Ct.unbindTexture()};const hn=W.createFramebuffer(),gl=W.createFramebuffer();this.copyTextureToTexture=function(A,Y,ot=null,st=null,rt=0,Ft=0){let Vt,It,Xt,kt,Zt,oe,Yt,Re,Je;const We=A.isCompressedTexture?A.mipmaps[Ft]:A.image;if(ot!==null)Vt=ot.max.x-ot.min.x,It=ot.max.y-ot.min.y,Xt=ot.isBox3?ot.max.z-ot.min.z:1,kt=ot.min.x,Zt=ot.min.y,oe=ot.isBox3?ot.min.z:0;else{const $e=Math.pow(2,-rt);Vt=Math.floor(We.width*$e),It=Math.floor(We.height*$e),A.isDataArrayTexture?Xt=We.depth:A.isData3DTexture?Xt=Math.floor(We.depth*$e):Xt=1,kt=0,Zt=0,oe=0}st!==null?(Yt=st.x,Re=st.y,Je=st.z):(Yt=0,Re=0,Je=0);const Oe=k.convert(Y.format),Pe=k.convert(Y.type);let Gt;Y.isData3DTexture?(E.setTexture3D(Y,0),Gt=W.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(E.setTexture2DArray(Y,0),Gt=W.TEXTURE_2D_ARRAY):(E.setTexture2D(Y,0),Gt=W.TEXTURE_2D),Ct.activeTexture(W.TEXTURE0),Ct.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,Y.flipY),Ct.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),Ct.pixelStorei(W.UNPACK_ALIGNMENT,Y.unpackAlignment);const On=Ct.getParameter(W.UNPACK_ROW_LENGTH),ve=Ct.getParameter(W.UNPACK_IMAGE_HEIGHT),vn=Ct.getParameter(W.UNPACK_SKIP_PIXELS),ei=Ct.getParameter(W.UNPACK_SKIP_ROWS),Ri=Ct.getParameter(W.UNPACK_SKIP_IMAGES);Ct.pixelStorei(W.UNPACK_ROW_LENGTH,We.width),Ct.pixelStorei(W.UNPACK_IMAGE_HEIGHT,We.height),Ct.pixelStorei(W.UNPACK_SKIP_PIXELS,kt),Ct.pixelStorei(W.UNPACK_SKIP_ROWS,Zt),Ct.pixelStorei(W.UNPACK_SKIP_IMAGES,oe);const ni=A.isDataArrayTexture||A.isData3DTexture,Ie=Y.isDataArrayTexture||Y.isData3DTexture;if(A.isDepthTexture){const $e=D.get(A),Ci=D.get(Y),Le=D.get($e.__renderTarget),Bi=D.get(Ci.__renderTarget);Ct.bindFramebuffer(W.READ_FRAMEBUFFER,Le.__webglFramebuffer),Ct.bindFramebuffer(W.DRAW_FRAMEBUFFER,Bi.__webglFramebuffer);for(let Na=0;Na<Xt;Na++)ni&&(W.framebufferTextureLayer(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,D.get(A).__webglTexture,rt,oe+Na),W.framebufferTextureLayer(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,D.get(Y).__webglTexture,Ft,Je+Na)),W.blitFramebuffer(kt,Zt,Vt,It,Yt,Re,Vt,It,W.DEPTH_BUFFER_BIT,W.NEAREST);Ct.bindFramebuffer(W.READ_FRAMEBUFFER,null),Ct.bindFramebuffer(W.DRAW_FRAMEBUFFER,null)}else if(rt!==0||A.isRenderTargetTexture||D.has(A)){const $e=D.get(A),Ci=D.get(Y);Ct.bindFramebuffer(W.READ_FRAMEBUFFER,hn),Ct.bindFramebuffer(W.DRAW_FRAMEBUFFER,gl);for(let Le=0;Le<Xt;Le++)ni?W.framebufferTextureLayer(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,$e.__webglTexture,rt,oe+Le):W.framebufferTexture2D(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,$e.__webglTexture,rt),Ie?W.framebufferTextureLayer(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,Ci.__webglTexture,Ft,Je+Le):W.framebufferTexture2D(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,Ci.__webglTexture,Ft),rt!==0?W.blitFramebuffer(kt,Zt,Vt,It,Yt,Re,Vt,It,W.COLOR_BUFFER_BIT,W.NEAREST):Ie?W.copyTexSubImage3D(Gt,Ft,Yt,Re,Je+Le,kt,Zt,Vt,It):W.copyTexSubImage2D(Gt,Ft,Yt,Re,kt,Zt,Vt,It);Ct.bindFramebuffer(W.READ_FRAMEBUFFER,null),Ct.bindFramebuffer(W.DRAW_FRAMEBUFFER,null)}else Ie?A.isDataTexture||A.isData3DTexture?W.texSubImage3D(Gt,Ft,Yt,Re,Je,Vt,It,Xt,Oe,Pe,We.data):Y.isCompressedArrayTexture?W.compressedTexSubImage3D(Gt,Ft,Yt,Re,Je,Vt,It,Xt,Oe,We.data):W.texSubImage3D(Gt,Ft,Yt,Re,Je,Vt,It,Xt,Oe,Pe,We):A.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,Ft,Yt,Re,Vt,It,Oe,Pe,We.data):A.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,Ft,Yt,Re,We.width,We.height,Oe,We.data):W.texSubImage2D(W.TEXTURE_2D,Ft,Yt,Re,Vt,It,Oe,Pe,We);Ct.pixelStorei(W.UNPACK_ROW_LENGTH,On),Ct.pixelStorei(W.UNPACK_IMAGE_HEIGHT,ve),Ct.pixelStorei(W.UNPACK_SKIP_PIXELS,vn),Ct.pixelStorei(W.UNPACK_SKIP_ROWS,ei),Ct.pixelStorei(W.UNPACK_SKIP_IMAGES,Ri),Ft===0&&Y.generateMipmaps&&W.generateMipmap(Gt),Ct.unbindTexture()},this.initRenderTarget=function(A){D.get(A).__webglFramebuffer===void 0&&E.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?E.setTextureCube(A,0):A.isData3DTexture?E.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?E.setTexture2DArray(A,0):E.setTexture2D(A,0),Ct.unbindTexture()},this.resetState=function(){ut=0,ht=0,j=null,Ct.reset(),Rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return qi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const i=this.getContext();i.drawingBufferColorSpace=Te._getDrawingBufferColorSpace(t),i.unpackColorSpace=Te._getUnpackColorSpace()}}const Dv={type:"change"},wp={type:"start"},Mx={type:"end"},Jc=new Tp,Uv=new cs,ER=Math.cos(70*NM.DEG2RAD),Sn=new tt,Kn=2*Math.PI,Xe={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},dd=1e-6;class bR extends AE{constructor(t,i=null){super(t,i),this.state=Xe.NONE,this.target=new tt,this.cursor=new tt,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:jr.ROTATE,MIDDLE:jr.DOLLY,RIGHT:jr.PAN},this.touches={ONE:kr.ROTATE,TWO:kr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new tt,this._lastQuaternion=new ps,this._lastTargetPosition=new tt,this._quat=new ps().setFromUnitVectors(t.up,new tt(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new av,this._sphericalDelta=new av,this._scale=1,this._panOffset=new tt,this._rotateStart=new re,this._rotateEnd=new re,this._rotateDelta=new re,this._panStart=new re,this._panEnd=new re,this._panDelta=new re,this._dollyStart=new re,this._dollyEnd=new re,this._dollyDelta=new re,this._dollyDirection=new tt,this._mouse=new re,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=AR.bind(this),this._onPointerDown=TR.bind(this),this._onPointerUp=RR.bind(this),this._onContextMenu=OR.bind(this),this._onMouseWheel=DR.bind(this),this._onKeyDown=UR.bind(this),this._onTouchStart=LR.bind(this),this._onTouchMove=NR.bind(this),this._onMouseDown=CR.bind(this),this._onMouseMove=wR.bind(this),this._interceptControlDown=PR.bind(this),this._interceptControlUp=IR.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Dv),this.update(),this.state=Xe.NONE}pan(t,i){this._pan(t,i),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const i=this.object.position;Sn.copy(i).sub(this.target),Sn.applyQuaternion(this._quat),this._spherical.setFromVector3(Sn),this.autoRotate&&this.state===Xe.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let s=this.minAzimuthAngle,l=this.maxAzimuthAngle;isFinite(s)&&isFinite(l)&&(s<-Math.PI?s+=Kn:s>Math.PI&&(s-=Kn),l<-Math.PI?l+=Kn:l>Math.PI&&(l-=Kn),s<=l?this._spherical.theta=Math.max(s,Math.min(l,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(s+l)/2?Math.max(s,this._spherical.theta):Math.min(l,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let c=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const h=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),c=h!=this._spherical.radius}if(Sn.setFromSpherical(this._spherical),Sn.applyQuaternion(this._quatInverse),i.copy(this.target).add(Sn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let h=null;if(this.object.isPerspectiveCamera){const p=Sn.length();h=this._clampDistance(p*this._scale);const m=p-h;this.object.position.addScaledVector(this._dollyDirection,m),this.object.updateMatrixWorld(),c=!!m}else if(this.object.isOrthographicCamera){const p=new tt(this._mouse.x,this._mouse.y,0);p.unproject(this.object);const m=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),c=m!==this.object.zoom;const d=new tt(this._mouse.x,this._mouse.y,0);d.unproject(this.object),this.object.position.sub(d).add(p),this.object.updateMatrixWorld(),h=Sn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;h!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(h).add(this.object.position):(Jc.origin.copy(this.object.position),Jc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Jc.direction))<ER?this.object.lookAt(this.target):(Uv.setFromNormalAndCoplanarPoint(this.object.up,this.target),Jc.intersectPlane(Uv,this.target))))}else if(this.object.isOrthographicCamera){const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),h!==this.object.zoom&&(this.object.updateProjectionMatrix(),c=!0)}return this._scale=1,this._performCursorZoom=!1,c||this._lastPosition.distanceToSquared(this.object.position)>dd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>dd||this._lastTargetPosition.distanceToSquared(this.target)>dd?(this.dispatchEvent(Dv),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Kn/60*this.autoRotateSpeed*t:Kn/60/60*this.autoRotateSpeed}_getZoomScale(t){const i=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,i){Sn.setFromMatrixColumn(i,0),Sn.multiplyScalar(-t),this._panOffset.add(Sn)}_panUp(t,i){this.screenSpacePanning===!0?Sn.setFromMatrixColumn(i,1):(Sn.setFromMatrixColumn(i,0),Sn.crossVectors(this.object.up,Sn)),Sn.multiplyScalar(t),this._panOffset.add(Sn)}_pan(t,i){const s=this.domElement;if(this.object.isPerspectiveCamera){const l=this.object.position;Sn.copy(l).sub(this.target);let c=Sn.length();c*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*c/s.clientHeight,this.object.matrix),this._panUp(2*i*c/s.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/s.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/s.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const s=this.domElement.getBoundingClientRect(),l=t-s.left,c=i-s.top,h=s.width,p=s.height;this._mouse.x=l/h*2-1,this._mouse.y=-(c/p)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(Kn*this._rotateDelta.x/i.clientHeight),this._rotateUp(Kn*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let i=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Kn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Kn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Kn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Kn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),l=.5*(t.pageY+i.y);this._rotateStart.set(s,l)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),l=.5*(t.pageY+i.y);this._panStart.set(s,l)}}_handleTouchStartDolly(t){const i=this._getSecondPointerPosition(t),s=t.pageX-i.x,l=t.pageY-i.y,c=Math.sqrt(s*s+l*l);this._dollyStart.set(0,c)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const s=this._getSecondPointerPosition(t),l=.5*(t.pageX+s.x),c=.5*(t.pageY+s.y);this._rotateEnd.set(l,c)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(Kn*this._rotateDelta.x/i.clientHeight),this._rotateUp(Kn*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),l=.5*(t.pageY+i.y);this._panEnd.set(s,l)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const i=this._getSecondPointerPosition(t),s=t.pageX-i.x,l=t.pageY-i.y,c=Math.sqrt(s*s+l*l);this._dollyEnd.set(0,c),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const h=(t.pageX+i.x)*.5,p=(t.pageY+i.y)*.5;this._updateZoomParameters(h,p)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==t.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(t){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==t.pointerId)return!0;return!1}_trackPointer(t){let i=this._pointerPositions[t.pointerId];i===void 0&&(i=new re,this._pointerPositions[t.pointerId]=i),i.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const i=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(t){const i=t.deltaMode,s={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(i){case 1:s.deltaY*=16;break;case 2:s.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(s.deltaY*=10),s}}function TR(r){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(r.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(r)&&(this._addPointer(r),r.pointerType==="touch"?this._onTouchStart(r):this._onMouseDown(r),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function AR(r){this.enabled!==!1&&(r.pointerType==="touch"?this._onTouchMove(r):this._onMouseMove(r))}function RR(r){switch(this._removePointer(r),this._pointers.length){case 0:this.domElement.releasePointerCapture(r.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Mx),this.state=Xe.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],i=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:i.x,pageY:i.y});break}}function CR(r){let t;switch(r.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case jr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(r),this.state=Xe.DOLLY;break;case jr.ROTATE:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=Xe.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=Xe.ROTATE}break;case jr.PAN:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=Xe.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=Xe.PAN}break;default:this.state=Xe.NONE}this.state!==Xe.NONE&&this.dispatchEvent(wp)}function wR(r){switch(this.state){case Xe.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(r);break;case Xe.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(r);break;case Xe.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(r);break}}function DR(r){this.enabled===!1||this.enableZoom===!1||this.state!==Xe.NONE||(r.preventDefault(),this.dispatchEvent(wp),this._handleMouseWheel(this._customWheelEvent(r)),this.dispatchEvent(Mx))}function UR(r){this.enabled!==!1&&this._handleKeyDown(r)}function LR(r){switch(this._trackPointer(r),this._pointers.length){case 1:switch(this.touches.ONE){case kr.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(r),this.state=Xe.TOUCH_ROTATE;break;case kr.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(r),this.state=Xe.TOUCH_PAN;break;default:this.state=Xe.NONE}break;case 2:switch(this.touches.TWO){case kr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(r),this.state=Xe.TOUCH_DOLLY_PAN;break;case kr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(r),this.state=Xe.TOUCH_DOLLY_ROTATE;break;default:this.state=Xe.NONE}break;default:this.state=Xe.NONE}this.state!==Xe.NONE&&this.dispatchEvent(wp)}function NR(r){switch(this._trackPointer(r),this.state){case Xe.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(r),this.update();break;case Xe.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(r),this.update();break;case Xe.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(r),this.update();break;case Xe.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(r),this.update();break;default:this.state=Xe.NONE}}function OR(r){this.enabled!==!1&&r.preventDefault()}function PR(r){r.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function IR(r){r.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class FR extends Rp{constructor(t){super(t)}load(t,i,s,l){const c=this,h=new SE(this.manager);h.setPath(this.path),h.setResponseType("arraybuffer"),h.setRequestHeader(this.requestHeader),h.setWithCredentials(this.withCredentials),h.load(t,function(p){try{i(c.parse(p))}catch(m){l?l(m):console.error(m),c.manager.itemError(t)}},s,l)}parse(t){function i(d){const _=new DataView(d),v=32/8*3+32/8*3*3+16/8,g=_.getUint32(80,!0);if(80+32/8+g*v===_.byteLength)return!0;const b=[115,111,108,105,100];for(let C=0;C<5;C++)if(s(b,_,C))return!1;return!0}function s(d,_,v){for(let g=0,M=d.length;g<M;g++)if(d[g]!==_.getUint8(v+g))return!1;return!0}function l(d){const _=new DataView(d),v=_.getUint32(80,!0);let g,M,b,C=!1,S,y,w,O,P;for(let G=0;G<70;G++)_.getUint32(G,!1)==1129270351&&_.getUint8(G+4)==82&&_.getUint8(G+5)==61&&(C=!0,S=new Float32Array(v*3*3),y=_.getUint8(G+6)/255,w=_.getUint8(G+7)/255,O=_.getUint8(G+8)/255,P=_.getUint8(G+9)/255);const z=84,N=50,B=new pi,T=new Float32Array(v*3*3),F=new Float32Array(v*3*3),q=new de;for(let G=0;G<v;G++){const $=z+G*N,ut=_.getFloat32($,!0),ht=_.getFloat32($+4,!0),j=_.getFloat32($+8,!0);if(C){const L=_.getUint16($+48,!0);(L&32768)===0?(g=(L&31)/31,M=(L>>5&31)/31,b=(L>>10&31)/31):(g=y,M=w,b=O)}for(let L=1;L<=3;L++){const H=$+L*12,et=G*3*3+(L-1)*3;T[et]=_.getFloat32(H,!0),T[et+1]=_.getFloat32(H+4,!0),T[et+2]=_.getFloat32(H+8,!0),F[et]=ut,F[et+1]=ht,F[et+2]=j,C&&(q.setRGB(g,M,b,Qn),S[et]=q.r,S[et+1]=q.g,S[et+2]=q.b)}}return B.setAttribute("position",new di(T,3)),B.setAttribute("normal",new di(F,3)),C&&(B.setAttribute("color",new di(S,3)),B.hasColors=!0,B.alpha=P),B}function c(d){const _=new pi,v=/solid([\s\S]*?)endsolid/g,g=/facet([\s\S]*?)endfacet/g,M=/solid\s(.+)/;let b=0;const C=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,S=new RegExp("vertex"+C+C+C,"g"),y=new RegExp("normal"+C+C+C,"g"),w=[],O=[],P=[],z=new tt;let N,B=0,T=0,F=0;for(;(N=v.exec(d))!==null;){T=F;const q=N[0],G=(N=M.exec(q))!==null?N[1]:"";for(P.push(G);(N=g.exec(q))!==null;){let ht=0,j=0;const L=N[0];for(;(N=y.exec(L))!==null;)z.x=parseFloat(N[1]),z.y=parseFloat(N[2]),z.z=parseFloat(N[3]),j++;for(;(N=S.exec(L))!==null;)w.push(parseFloat(N[1]),parseFloat(N[2]),parseFloat(N[3])),O.push(z.x,z.y,z.z),ht++,F++;j!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+b),ht!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+b),b++}const $=T,ut=F-T;_.userData.groupNames=P,_.addGroup($,ut,B),B++}return _.setAttribute("position",new $n(w,3)),_.setAttribute("normal",new $n(O,3)),_}function h(d){return typeof d!="string"?new TextDecoder().decode(d):d}function p(d){if(typeof d=="string"){const _=new Uint8Array(d.length);for(let v=0;v<d.length;v++)_[v]=d.charCodeAt(v)&255;return _.buffer||_}else return d}const m=p(t);return i(m)?l(m):c(h(t))}}const BR=2;let ru=0;const ol=[],zR=15,hs=new Map;let cp=0;function HR(r){for(;hs.size>zR;){let t=null,i=1/0;for(const[l,c]of hs)l!==r&&!c.visible&&c.touch<i&&(i=c.touch,t=l);if(t===null)break;const s=hs.get(t);hs.delete(t),s.release()}}function GR(r,t){const i=hs.get(r);i?(i.touch=++cp,i.release=t,i.visible=!0):hs.set(r,{release:t,touch:++cp,visible:!0}),HR(r)}function VR(r){hs.delete(r)}function Lv(r,t){const i=hs.get(r);i&&(i.visible=t,t&&(i.touch=++cp))}function pd(){for(;ru<BR&&ol.length;)ol.shift()?.()}function kR(r){let t=!1;const i=()=>{if(t){pd();return}ru+=1;let s=!1;r(()=>{s||(s=!0,ru=Math.max(0,ru-1),pd())})};return ol.push(i),pd(),()=>{t=!0;const s=ol.indexOf(i);s>=0&&ol.splice(s,1)}}const md={schema_version:1,paper:{title:"P3D-Bench: Benchmarking MLLMs for Parametric 3D Generation and Structural Reasoning",authors:["Yikang Yang¹,*","Zhanpeng Hu¹,*","Youtian Lin¹","Mengqi Zhou¹","Jingxi Xu²","Feihu Zhang²","Jiaheng Liu¹","Yao Yao¹"],affiliations:["¹Nanjing University","²Envision","*Equal contribution."],abstract:"Multimodal large language models can write code to produce complex programs as well as use programs to do 3D modeling, which opens up a new avenue for 3D generation powered by their priors, world knowledge and reasoning. Yet existing benchmarks rarely evaluate 3D modeling through code. Such modeling demands more than runnable code: from a text or visual specification, a model must generate a parametric 3D program that is geometrically precise, semantically aligned and assembly-consistent. We introduce P3D-Bench, a benchmark for parametric 3D generation. Unlike a 3D mesh, a parametric 3D program exposes explicit dimensions, construction operations and part relations, revealing whether a model recovers a design's structure, not just its appearance. Under a unified protocol, P3D-Bench covers three task families (Text-to-3D, Image-to-3D and Assembly-3D) and scores each output for executability, geometric fidelity, topology, text-grounded constraints, multiview semantic alignment and part-level structure. We evaluate frontier MLLMs and text-only LLMs on 400 text cases, 400 image cases and 203 annotated assemblies, with domain-specific models as reference points. Our extensive evaluation yields three findings. First, assemblies are the hardest setting, where models still fail to compose multiple parts into a coherent structure. Second, models can often recover the global shape and semantic identity of the target object, yet fail to reproduce the precise parametric geometry specified by the input. Third, part-level modeling remains weak on assemblies, where models recover neither the geometry of each part nor the right number of parts. These results position P3D-Bench as a benchmark for evaluating precise parametric geometry and part-level structure in parametric 3D generation. Project page: https://lucasqaq.github.io/p3d/.",links:{paper:"https://arxiv.org/abs/2606.11152v1",code:"https://github.com/SpatiaOS/P3D-Bench",dataset:"https://huggingface.co/datasets/SpatiaOS/P3D-Bench"}},tasks:[{id:"text2cad",label:"Text-to-3D",formats:["JSON","OpenSCAD"],status:"interactive"},{id:"image2cad",label:"Image-to-3D",formats:["CadQuery","OpenSCAD","Three.js"],status:"interactive"},{id:"text_image2cad",label:"Assembly-3D",formats:["CadQuery","OpenSCAD"],status:"interactive"}],models:[],cases:[],runs:[],figures:[{id:"pipeline",title:"Pipeline",placeholder:!0},{id:"leaderboard",title:"Leaderboard",placeholder:!0}],gallery:[]};function Gn(r){return r?r.startsWith("http")||r.startsWith("/")?r:`${"/projects/P3D-Bench/".endsWith("/")?"/projects/P3D-Bench/":"/projects/P3D-Bench//"}demo/${r}`:""}function XR(){const[r,t]=he.useState(md),[i,s]=he.useState([]),[l,c]=he.useState("text2cad"),[h,p]=he.useState(""),[m,d]=he.useState(""),[_,v]=he.useState("descriptive"),[g,M]=he.useState("openscad"),[b,C]=he.useState("");he.useEffect(()=>{fetch(Gn("manifest.json")).then(K=>K.ok?K.json():md).then(K=>t(K)).catch(()=>t(md))},[]),he.useEffect(()=>{fetch(Gn("complex_assemblies.json")).then(K=>K.ok?K.json():{items:[]}).then(K=>s(Array.isArray(K.items)?K.items:[])).catch(()=>s([]))},[]);const S=he.useMemo(()=>r.runs.filter(K=>K.task===l&&Ex(K)),[r,l]),y=he.useMemo(()=>KR(S),[S]),w=he.useMemo(()=>S.filter(K=>y.has(K.case_id)),[S,y]),O=he.useMemo(()=>r.cases.filter(K=>K.task===l&&y.has(K.id)),[y,r,l]),P=he.useMemo(()=>w.find(K=>K.case_id===h&&K.model===m&&K.format===g),[h,g,m,w]),z=he.useMemo(()=>P||Pi(w.filter(K=>K.case_id===h&&K.model===m))||Pi(w.filter(K=>K.case_id===h))||Pi(w),[h,P,m,w]),N=z?.case_id||h,B=z?.model||m,T=z?.spec||_,F=z?.format||g,q=he.useMemo(()=>w.filter(K=>K.case_id===N),[N,w]),G=he.useMemo(()=>r.models.filter(K=>q.some(Z=>Z.model===K.id)),[q,r.models]),$=he.useMemo(()=>q.filter(K=>K.model===B),[B,q]),ut=he.useMemo(()=>Array.from(new Set(w.map(K=>K.format))).sort((K,Z)=>mu(K)-mu(Z)),[w]),ht=ut.length?ut:$.map(K=>K.format);he.useMemo(()=>QR(O,w),[O,w]),he.useEffect(()=>{z&&(h!==z.case_id&&p(z.case_id),m!==z.model&&d(z.model),_!==z.spec&&v(z.spec),g!==z.format&&M(z.format))},[h,g,m,z,_]);const j=r.cases.find(K=>K.id===N),L=r.models.find(K=>K.id===B),H=r.tasks.find(K=>K.id===z?.task),et=he.useMemo(()=>jR(r),[r]),gt=he.useMemo(()=>r.tasks.filter(K=>K.status==="interactive"),[r]),yt=O.some(K=>K.thumbnail),I=z?.condition||j?.title||"No input.";z&&(j?.title||`${z.case_id}`,z.task,H?.label||z.task,pu(z.spec),yt||z.assets.input_image,`${L?.label||z.model}${Xr(z.format)}`);const Q=K=>{K&&(p(K.case_id),d(K.model),v(K.spec),M(K.format))},St=K=>Pi(w.filter(Z=>Z.case_id===N&&Z.model===B&&Z.format===K))||Pi(w.filter(Z=>Z.case_id===N&&Z.format===K))||Pi(w.filter(Z=>Z.model===B&&Z.format===K))||Pi(w.filter(Z=>Z.format===K));he.useEffect(()=>{const K=z?.assets.generated||z?.assets.generated_json;if(!K){C("");return}fetch(Gn(K)).then(Z=>Z.ok?Z.text():"").then(C).catch(()=>C(""))},[z]);const bt=r.paper;return U.jsxs("main",{children:[U.jsxs("nav",{className:"nav",children:[U.jsx("a",{className:"brand",href:"#top",children:"P3D-Bench"}),U.jsxs("div",{children:[U.jsx("a",{href:"#overview",children:"Overview"}),U.jsx("a",{href:"#leaderboard",children:"Leaderboard"}),U.jsx("a",{href:"#results",children:"Results"}),U.jsx("a",{href:"#dataset",children:"Dataset"})]})]}),U.jsxs("section",{id:"top",className:"hero",children:[U.jsxs("div",{className:"hero-copy",children:[U.jsxs("h1",{className:"hero-title",children:[U.jsx("span",{children:"P3D-Bench"}),U.jsxs("small",{children:["Benchmarking MLLMs for ",U.jsx("em",{children:"Parametric 3D"})," Generation and ",U.jsx("em",{children:"Structural Reasoning"})]})]}),U.jsx("div",{className:"authors",children:bt.authors.map(K=>U.jsx("span",{className:"author-name",children:g3(K)},K))}),U.jsx("div",{className:"affiliations",children:bt.affiliations?.map(K=>U.jsx("span",{className:"affiliation-item",children:_3(K)},K))}),U.jsxs("div",{className:"actions",children:[U.jsxs("a",{href:bt.links?.paper||"https://arxiv.org/abs/2606.11152v1",children:[U.jsx(jy,{size:17})," Paper"]}),U.jsxs("a",{href:bt.links?.code||"https://github.com/SpatiaOS/P3D-Bench",children:[U.jsx(Ky,{size:17})," Code"]}),U.jsxs("a",{href:bt.links?.dataset||"https://huggingface.co/datasets/SpatiaOS/P3D-Bench",children:[U.jsx(Zy,{size:17})," Dataset"]})]})]}),U.jsx($R,{}),U.jsxs("div",{className:"abstract-panel",children:[U.jsx("p",{className:"eyebrow",children:"Abstract"}),U.jsx("p",{className:"abstract",dangerouslySetInnerHTML:{__html:bt.abstract}})]})]}),U.jsx("section",{id:"overview",className:"section overview-section",children:U.jsxs("figure",{className:"overview-figure-block",children:[U.jsx("img",{src:Gn("figures/fig2_leaderboard_raster.jpg"),alt:"P3D-Bench overview: tasks, evaluated models and output formats, and evaluation metrics"}),U.jsx("figcaption",{children:"P3D-Bench evaluates MLLMs and domain-specific models on three parametric-CAD tasks — Text-to-3D, Image-to-3D and Assembly-3D — across four code formats (JSON, OpenSCAD, CadQuery, Three.js), scoring geometric fidelity, mesh topology, an MLLM judge and part-level structure."})]})}),U.jsxs("section",{id:"leaderboard",className:"section leaderboard-section",children:[U.jsxs("div",{className:"section-heading",children:[U.jsx("h2",{children:"Leaderboard"}),U.jsx("p",{children:"Per-task results by output format"})]}),U.jsx(i3,{})]}),U.jsx("section",{className:"task-strip",children:gt.map(K=>U.jsxs("button",{className:l===K.id?"task-card active":"task-card",onClick:()=>c(K.id),children:[U.jsx("span",{children:K.label}),U.jsx("strong",{children:K.formats.join(" / ")})]},K.id))}),U.jsxs("section",{id:"results",className:"section",children:[U.jsx("div",{className:"section-heading",children:U.jsx("h2",{children:"Interactive Results"})}),w.length?U.jsxs("div",{className:"workbench",children:[U.jsxs("aside",{className:"controls",children:[U.jsx($c,{label:"Case",value:N,options:O.map(K=>[K.id,K.title]),onChange:K=>Q(Pi(w.filter(Z=>Z.case_id===K)))}),yt?U.jsx(d3,{cases:O,activeCaseId:N,onSelect:K=>Q(Pi(w.filter(Z=>Z.case_id===K)))}):null,U.jsx($c,{label:"Model",value:B,options:G.map(K=>[K.id,K.label]),onChange:K=>Q(Pi(q.filter(Z=>Z.model===K)))}),U.jsx($c,{label:"Format",value:F,options:ht.map(K=>[K,Xr(K)]),onChange:K=>Q(St(K))}),(()=>{const K=Array.from(new Set(q.filter(Z=>Z.model===B).map(Z=>Z.spec))).sort((Z,Mt)=>Jr(Z)-Jr(Mt)).map(Z=>[Z,pu(Z)]);return K.length>1?U.jsx($c,{label:"Input protocol",value:T,options:K,onChange:Z=>Q(Pi(q.filter(Mt=>Mt.model===B&&Mt.spec===Z)))}):null})(),l!=="image2cad"?U.jsx(gd,{title:"Input",icon:U.jsx(Bv,{size:16}),children:U.jsxs("div",{className:"condition-body",children:[z?.assets.input_image&&!yt?U.jsx("img",{className:"condition-image",src:Gn(z.assets.input_image),alt:"Input reference"}):null,U.jsx(Dp,{task:z?.task,text:I})]})}):null,U.jsx(gd,{title:"Metrics",icon:U.jsx(hp,{size:16}),children:U.jsx(x3,{run:z})}),U.jsx(gd,{title:`Generated ${Xr(F)}`,icon:U.jsx(Yy,{size:16}),children:U.jsx("div",{className:"code-panel",children:U.jsx("pre",{children:U.jsx("code",{children:b||"No generated output."})})})})]}),U.jsx("div",{className:"result-stage",children:U.jsxs("div",{className:"render-pair",children:[U.jsx(f3,{run:z,title:j?.title||"Ground Truth",subtitle:"Reference geometry"}),U.jsx(h3,{run:z,title:j?.title||"Prediction",subtitle:`${L?.label||z?.model||""}${z?` / ${Xr(z.format)}`:""}`})]})})]}):U.jsx(wx,{title:"Results"})]}),U.jsxs("section",{id:"gallery",className:"section",children:[U.jsx("div",{className:"section-heading",children:U.jsx("h2",{children:"Render Showcase"})}),U.jsx(r3,{comparisons:et}),U.jsx(o3,{items:i})]}),U.jsxs("section",{id:"dataset",className:"section dataset-section",children:[U.jsxs("div",{className:"section-heading",children:[U.jsx("h2",{children:"Dataset"}),U.jsx("p",{children:"P3D-Dataset construction and statistics"})]}),U.jsxs("div",{className:"dataset-figures",children:[U.jsxs("figure",{className:"dataset-figure dataset-figure-wide",children:[U.jsx("img",{src:Gn("figures/SpatialVID_pipeline_raster.jpg"),alt:"Overview of the P3D-Dataset construction pipeline"}),U.jsx("figcaption",{children:"Overview of the P3D-Dataset construction pipeline: filtering and annotation over Text2CAD and the Fusion 360 Gallery."})]}),U.jsxs("figure",{className:"dataset-figure",children:[U.jsx("img",{src:Gn("figures/cad_gallery_combined_axis.jpg"),alt:"Example dataset cases across easy, medium and hard complexity"}),U.jsx("figcaption",{children:"Example cases at the easy, medium and hard complexity levels."})]}),U.jsxs("figure",{className:"dataset-figure",children:[U.jsx("img",{src:Gn("figures/fig_leaderboard_data_static.png"),alt:"Semantic category distribution of the Text-to-3D and Image-to-3D sets"}),U.jsx("figcaption",{children:"Semantic category distribution of the Text-to-3D and Image-to-3D sets."})]})]})]}),U.jsxs("section",{id:"citation",className:"section citation",children:[U.jsx("div",{className:"citation-heading",children:U.jsx("h2",{children:"Citation"})}),U.jsx("pre",{children:U.jsx("code",{children:`@misc{yang2026p3dbenchbenchmarkingmllmsparametric,
      title={P3D-Bench: Benchmarking MLLMs for Parametric 3D Generation and Structural Reasoning},
      author={Yikang Yang and Zhanpeng Hu and Youtian Lin and Mengqi Zhou and Jingxi Xu and Feihu Zhang and Jiaheng Liu and Yao Yao},
      year={2026},
      eprint={2606.11152},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2606.11152},
}`})})]})]})}function jR(r){const t=["text2cad","image2cad"],i={text2cad:["openscad","json"],image2cad:["cadquery","openscad","threejs"],text_image2cad:["cadquery","openscad"]},s=new Map(r.tasks.map(p=>[p.id,p.label])),l=new Map(r.models.map(p=>[p.id,p])),c=new Map(r.cases.map(p=>[p.id,p])),h=r.runs.filter(p=>Ex(p)&&p.valid!==!1);return t.map(p=>{const m=r.cases.filter(S=>S.task===p),d=i[p]||[],_=YR[p]??9;let v=null;if(m.forEach((S,y)=>{const w=h.filter(T=>T.task===p&&T.case_id===S.id),O=ZR(w,d,_);if(O.length<3)return;const P=O.reduce((T,F)=>T+Math.max(0,16-up(F.model)),0),z=(qR[p]||[]).indexOf(S.id),N=z>=0?1600-z*160:Math.max(0,80-y),B=O.length*1e3+N+P*2+O.reduce((T,F)=>T+js(F)*.04,0);(!v||B>v.score)&&(v={score:B,caseId:S.id,runs:O})}),!v)return null;const g=v.runs[0],M=c.get(v.caseId),b=new Map;v.runs.forEach(S=>b.set(S.format,(b.get(S.format)||0)+1));const C=Array.from(b.entries()).sort((S,y)=>y[1]-S[1]||d.indexOf(S[0])-d.indexOf(y[0]))[0]?.[0]||g.format;return{id:`${p}-${v.caseId}`,task:p,taskLabel:s.get(p)||p,title:WR(p,v.caseId,M?.title),input:g.condition||M?.title||`Case ${v.caseId}`,inputImage:g.assets.input_image||M?.thumbnail,gtRender:g.assets.gt_render||"",gtMesh:g.assets.gt_mesh||"",formatLabel:Xr(C),specLabel:pu(g.spec),variants:v.runs.map(S=>{const y=l.get(S.model);return{id:S.id,task:S.task,model:S.model,modelLabel:y?.label||S.model,family:y?.family||"",formatLabel:Xr(S.format),specLabel:pu(S.spec),src:S.assets.pred_render||"",mesh:S.assets.mesh||""}})}}).filter(p=>!!p)}function WR(r,t,i){return r==="text2cad"?`Text Case · ${t.split("/").pop()||t}`:i||`Case ${t.split("/").pop()||t}`}const Nv=["gpt55-reason","gemini-reason","kimi_k26-reason","claude-reason","deepseek_v4pro-reason","qwen-reason","mimo_omni-reason","doubao-reason","glm_5v_turbo-reason","glm-reason","mimo_v25-reason"],qR={text2cad:["0075/00758810","0013/00134405","0053/00531353"],image2cad:["articraft/wall_fan_20745"],text_image2cad:["textimage2cad/144940_885193da"]},YR={text2cad:9,image2cad:8};function ZR(r,t,i){const s=c=>{const h=t.indexOf(c);return h===-1?t.length:h},l=new Map;return r.forEach(c=>{const h=l.get(c.model);if(!h){l.set(c.model,c);return}(js(c)-js(h)||s(h.format)-s(c.format)||Jr(h.spec)-Jr(c.spec)||h.id.localeCompare(c.id))>0&&l.set(c.model,c)}),Array.from(l.values()).sort((c,h)=>{const p=up(c.model)-up(h.model);return p||js(h)-js(c)||c.id.localeCompare(h.id)}).slice(0,i)}function up(r){const t=Nv.indexOf(r);return t===-1?Nv.length:t}function Ex(r){return!!((r.condition||"").trim()&&(r.assets.generated||r.assets.generated_json)&&r.assets.gt_mesh&&r.assets.gt_render&&r.assets.mesh&&r.assets.pred_render)}function KR(r){return new Set(r.map(t=>t.case_id))}function QR(r,t){const i=new Set(r.map(p=>p.id)),s=new Set(t.map(p=>p.model)),l=new Set(t.map(p=>p.format)),c=new Set(t.map(p=>`${p.case_id}/${p.model}/${p.format}`)),h=i.size*s.size*l.size;return{invalidCount:Math.max(0,h-c.size),caseCount:i.size,modelCount:s.size,formatCount:l.size}}function Pi(r){return[...r].sort((t,i)=>{const s=+(i.valid!==!1)-+(t.valid!==!1);if(s)return s;const l=mu(t.format)-mu(i.format);if(l)return l;const c=js(i)-js(t);if(c)return c;const h=Jr(t.spec)-Jr(i.spec);return h||t.id.localeCompare(i.id)})[0]}function pu(r){return r==="image"?"Image input":r==="image_text"?"Image + text input":r==="parametric"?"Parametric input":"Descriptive input"}function Xr(r){return r==="json"?"JSON":r==="openscad"?"OpenSCAD":r==="cadquery"?"CadQuery":r==="threejs"?"Three.js":r}function JR(r){const i=["textimage2cad/113856_e7484fa7","textimage2cad/20260_4a01a99d"].map(s=>r.find(l=>l.case_id===s)).filter(s=>!!s);return i.length>=2?i.slice(0,2):[...i,...r.filter(s=>!i.some(l=>l.id===s.id))].slice(0,2)}function Jr(r){return r==="parametric"?0:r==="image_text"||r==="image"?1:r==="descriptive"?2:3}function mu(r){return r==="json"?0:r==="cadquery"?1:r==="openscad"?2:r==="threejs"?3:4}const bx={openai:{color:"#202123",icon:"icons/src/openai.svg"},gemini:{color:"#14B86A",icon:"icons/src/gemini-color.svg"},claude:{color:"#D97757",icon:"icons/src/claude-color.svg"},kimi:{color:"#1783FF",icon:"icons/src/kimi-color.svg",tile:"#111619"},zai:{color:"#8E5CFB",icon:"icons/src/zai.svg"},doubao:{color:"#00A6B8",icon:"icons/src/bytedance-color.svg"},deepseek:{color:"#4D6BFE",icon:"icons/src/deepseek-color.svg"},qwen:{color:"#FF6003",icon:"icons/src/qwen-color.svg"},mimo:{color:"#FF6900",icon:"icons/src/xiaomimimo.svg",tile:"#111619",filter:"invert(1)"}};function $R(){return U.jsx("div",{className:"main-figures",children:U.jsx("figure",{className:"leaderboard-figure",children:U.jsx("a",{href:"./figures/fig_tasks_grouped_bars.pdf","aria-label":"Open leaderboard figure PDF",children:U.jsx("img",{src:"./figures/fig_tasks_grouped_bars.svg?v=vector-qwen-20260609",alt:"Task overview: grouped bar scores across text, image and assembly tasks"})})})})}const t3=[{key:"text",title:"Text-to-3D",accent:"var(--blue)",superGroups:[{label:"Descriptive",span:6},{label:"Parametric",span:12}],groups:[{label:"JSON",span:2},{label:"OpenSCAD",span:2},{label:"Average",span:2},{label:"JSON",span:4},{label:"OpenSCAD",span:4},{label:"Average",span:4}],metrics:["Judge","Valid","Judge","Valid","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid"],rows:[{model:"GPT-5.5",family:"openai",cells:"0.805! 1.000! 0.945^ 0.995^ 0.875! 0.998^ 0.696! 0.997! 0.773! 1.000! 0.715! 0.997 0.850! 0.998^ 0.706! 0.997^ 0.812! 0.999^"},{model:"Gemini 3.1 Pro",family:"gemini",cells:"0.783 1.000! 0.947! 0.998! 0.865^ 0.999! 0.686^ 0.997^ 0.726 1.000! 0.711^ 1.000! 0.826^ 1.000! 0.699^ 0.998! 0.776 1.000!"},{model:"Claude Opus 4.6",family:"claude",cells:"0.779 0.998^ 0.921 0.993 0.850 0.995 0.682 0.987 0.753^ 0.990 0.702 1.000! 0.823 1.000! 0.692 0.993 0.788^ 0.995"},{model:"Kimi K2.6",family:"kimi",cells:"0.704 0.912 0.905 0.985 0.804 0.949 0.667 0.976 0.628 0.978 0.691 0.997 0.804 0.998^ 0.679 0.987 0.716 0.988"},{model:"GLM-5.1",family:"zai",cells:"0.802^ 0.970 0.817 0.912 0.810 0.941 0.678 0.989 0.635 0.993 0.654 0.940 0.739 0.940 0.666 0.964 0.687 0.966"},{model:"Doubao Seed 2.0 Pro",family:"doubao",cells:"0.705 0.988 0.740 0.960 0.723 0.974 0.625 0.982 0.681 0.990 0.640 0.985 0.739 0.985 0.633 0.984 0.710 0.988"},{model:"DeepSeek V4 Pro",family:"deepseek",cells:"0.635 0.970 0.764 0.927 0.699 0.949 0.640 0.957 0.701 0.960 0.655 0.975 0.770 0.975 0.647 0.966 0.735 0.968"},{model:"Qwen3.6-Plus",family:"qwen",cells:"0.527 0.985 0.807 0.990 0.667 0.988 0.638 0.990 0.590 0.993 0.662 0.995 0.772 0.995 0.650 0.992 0.681 0.994"},{model:"MiMo v2.5 Pro",family:"mimo",cells:"0.607 0.993 0.741 0.978 0.674 0.985 0.629 0.975 0.645 0.980 0.633 0.992 0.731 0.993 0.631 0.984 0.688 0.986"}],domainRows:[{model:"Text2CAD",cells:"0.055 0.945 - - 0.055 0.945 0.268 0.963 0.057 0.965 - - - - 0.268 0.963 0.057 0.965"}]},{key:"image",title:"Image-to-3D",accent:"var(--teal)",groups:[{label:"CadQuery",span:4},{label:"OpenSCAD",span:4},{label:"Three.js",span:4},{label:"Average",span:4}],metrics:["Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid"],rows:[{model:"GPT-5.5",family:"openai",cells:"0.524! 0.914! 0.526! 0.937! 0.567^ 1.000! 0.592! 1.000! 0.556^ 0.828 0.569^ 1.000! 0.549^ 0.914! 0.562! 0.979!"},{model:"Gemini 3.1 Pro",family:"gemini",cells:"0.507^ 0.878 0.469^ 0.911 0.569! 0.999^ 0.576^ 1.000! 0.581! 0.853! 0.576! 0.998^ 0.552! 0.910^ 0.540^ 0.970"},{model:"Claude Opus 4.6",family:"claude",cells:"0.497 0.908^ 0.383 0.926^ 0.536 1.000! 0.463 1.000! 0.541 0.802 0.447 0.998^ 0.525 0.903 0.431 0.975^"},{model:"Kimi K2.6",family:"kimi",cells:"0.432 0.846 0.299 0.881 0.517 1.000! 0.421 1.000! 0.541 0.849^ 0.427 1.000! 0.497 0.898 0.382 0.960"},{model:"GLM 5V Turbo",family:"zai",cells:"0.307 0.694 0.147 0.705 0.458 0.977 0.249 0.977 0.493 0.802 0.296 1.000! 0.419 0.824 0.230 0.894"},{model:"Qwen3.6-Plus",family:"qwen",cells:"0.221 0.470 0.130 0.493 0.466 0.995 0.287 0.995 0.507 0.844 0.350 0.998^ 0.398 0.770 0.256 0.828"},{model:"MiMo v2 Omni",family:"mimo",cells:"0.205 0.551 0.080 0.565 0.455 0.997 0.218 0.998^ 0.474 0.846 0.240 0.998^ 0.378 0.798 0.180 0.853"},{model:"Doubao Seed 2.0 Pro",family:"doubao",cells:"0.143 0.323 0.085 0.335 0.461 0.990 0.245 0.990 0.518 0.849^ 0.318 1.000! 0.374 0.721 0.216 0.775"}],domainRows:[{model:"Cadrille",cells:"0.235 0.789 0.010 0.820 - - - - - - - - 0.235 0.789 0.010 0.820"},{model:"CAD-Coder",cells:"0.133 0.361 0.014 0.370 - - - - - - - - 0.133 0.361 0.014 0.370"}]},{key:"assembly",title:"Assembly-3D",accent:"var(--coral)",groups:[{label:"CadQuery",span:5},{label:"OpenSCAD",span:5},{label:"Average",span:5}],metrics:["Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid"],rows:[{model:"GPT-5.5",family:"openai",cells:"0.570! 0.948! 0.527! 0.610! 0.985! 0.603! 0.985 0.555! 0.649! 0.985 0.586! 0.966! 0.541! 0.629! 0.985!"},{model:"Gemini 3.1 Pro",family:"gemini",cells:"0.532^ 0.899^ 0.461^ 0.595^ 0.931^ 0.600^ 0.989^ 0.553^ 0.641^ 0.989^ 0.566^ 0.944^ 0.507^ 0.618^ 0.960^"},{model:"Claude Opus 4.6",family:"claude",cells:"0.508 0.890 0.330 0.564 0.925 0.542 0.962 0.423 0.582 0.963 0.525 0.926 0.376 0.573 0.944"},{model:"Kimi K2.6",family:"kimi",cells:"0.411 0.796 0.260 0.494 0.844 0.517 0.990! 0.343 0.603 0.990! 0.464 0.893 0.302 0.548 0.917"},{model:"MiMo v2 Omni",family:"mimo",cells:"0.174 0.414 0.065 0.234 0.430 0.438 0.990! 0.175 0.542 0.990! 0.306 0.702 0.120 0.388 0.710"},{model:"Qwen3.6-Plus",family:"qwen",cells:"0.142 0.287 0.087 0.166 0.308 0.485 0.985 0.238 0.536 0.985 0.314 0.636 0.163 0.351 0.647"},{model:"GLM 5V Turbo",family:"zai",cells:"0.138 0.288 0.061 0.166 0.293 0.430 0.941 0.197 0.509 0.941 0.284 0.615 0.129 0.338 0.617"},{model:"Doubao Seed 2.0 Pro",family:"doubao",cells:"0.101 0.217 0.054 0.128 0.224 0.434 0.963 0.203 0.515 0.964 0.267 0.590 0.129 0.322 0.594"}]}];function e3(r){const t=new Set;let i=0;return r.forEach((s,l)=>{l>0&&t.add(i),i+=s.span}),t}function n3({token:r,groupStart:t}){const i=t?"rt-cell group-start":"rt-cell";return r==="-"?U.jsx("td",{className:`${i} na`,children:"—"}):r.endsWith("!")?U.jsx("td",{className:`${i} best`,children:r.slice(0,-1)}):r.endsWith("^")?U.jsx("td",{className:`${i} second`,children:r.slice(0,-1)}):U.jsx("td",{className:i,children:r})}function i3(){return U.jsx("div",{className:"results-tables",children:t3.map(r=>U.jsx(a3,{sub:r},r.key))})}function a3({sub:r}){const t=e3(r.groups),i=r.superGroups?3:2,s=(l,c)=>{const h=l.family?bx[l.family]:void 0,p=l.cells.trim().split(/\s+/);return U.jsxs("tr",{className:c?"rt-row rt-domain":"rt-row",children:[U.jsx("th",{scope:"row",className:"rt-model-col",children:U.jsxs("span",{className:"rt-model",children:[h?U.jsx("span",{className:"model-mark",style:{"--model-tile":h.tile||"#fffdfa","--icon-filter":h.filter||"none"},children:U.jsx("img",{src:Gn(h.icon),alt:"","aria-hidden":"true"})}):U.jsx("span",{className:"model-mark rt-mark-empty","aria-hidden":"true"}),U.jsx("strong",{children:l.model})]})}),p.map((m,d)=>U.jsx(n3,{token:m,groupStart:t.has(d)},d))]},l.model)};return U.jsxs("div",{className:"rt-block",style:{"--rt-accent":r.accent},children:[U.jsx("div",{className:"rt-block-head",children:U.jsx("span",{className:"rt-tag",children:r.title})}),U.jsx("div",{className:"rt-scroll",children:U.jsxs("table",{className:"results-table",children:[U.jsxs("thead",{children:[r.superGroups?U.jsxs("tr",{className:"rt-superrow",children:[U.jsx("th",{rowSpan:i,className:"rt-model-col rt-corner",children:"Model"}),r.superGroups.map((l,c)=>U.jsx("th",{colSpan:l.span,className:c>0?"rt-super group-start":"rt-super",children:l.label},c))]}):null,U.jsxs("tr",{className:"rt-grouprow",children:[r.superGroups?null:U.jsx("th",{rowSpan:2,className:"rt-model-col rt-corner",children:"Model"}),r.groups.map((l,c)=>U.jsx("th",{colSpan:l.span,className:c>0?"rt-group group-start":"rt-group",children:l.label},c))]}),U.jsx("tr",{className:"rt-metricrow",children:r.metrics.map((l,c)=>U.jsx("th",{className:t.has(c)?"rt-metric group-start":"rt-metric",children:l},c))})]}),U.jsxs("tbody",{children:[r.rows.map(l=>s(l,!1)),r.domainRows?r.domainRows.map(l=>s(l,!0)):null]})]})})]})}function js(r){const t=r.metrics||{};let i=r.valid===!1?-200:20;const s=s3(r);return i+=s*35,s||(i-=90),i+=Vr(t.qa_overall??t.qa_overall_accuracy)*120,i+=Vr(t.qa_semantic)*28,i+=Vr(t.qa_parametric)*16,i+=Vr(t.judge_geometry)*3,i+=Vr(t.judge_semantic)*3,i+=Vr(t.judge_aesthetics)*3,typeof t.chamfer_distance=="number"&&t.chamfer_distance>0&&(i+=Math.max(0,18-Math.log10(t.chamfer_distance*1e4+1)*5)),i}function Vr(r){return typeof r=="number"&&Number.isFinite(r)?r:0}function s3(r){return Object.entries(r.metrics||{}).filter(([t,i])=>Cx(t,i,r)).length}function r3({comparisons:r}){const[t,i]=he.useState(null);return r.length?U.jsxs("div",{className:"render-showcase",children:[r.map((s,l)=>{const c={title:s.title,task:s.task,taskLabel:s.taskLabel,specLabel:s.specLabel,input:s.input,inputImage:s.inputImage,subtitle:`${s.formatLabel} comparison`};return U.jsxs("article",{className:"comparison-panel","data-task":s.task,style:{"--task-accent":Pv[l%Pv.length]},children:[U.jsxs("div",{className:"comparison-head",children:[U.jsxs("div",{children:[U.jsx("span",{children:s.taskLabel}),U.jsx("h3",{children:s.title})]}),U.jsx("strong",{children:s.formatLabel})]}),U.jsxs("div",{className:"comparison-body",children:[U.jsxs("aside",{className:"comparison-reference",children:[U.jsx("div",{className:"compare-card-head",children:U.jsxs("div",{children:[U.jsx("span",{children:"Reference"}),U.jsx("strong",{children:"Ground Truth"})]})}),U.jsx("div",{className:"compare-viewer gt-viewer",children:U.jsx(Ys,{item:{id:`${s.id}-ground-truth`,task:s.task,title:s.title,subtitle:"Ground Truth",src:s.gtRender,mesh:s.gtMesh},recycle:!0})}),U.jsxs("div",{className:"comparison-input",children:[s.inputImage?U.jsx("img",{src:Gn(s.inputImage),alt:"Input reference"}):null,s.task==="text_image2cad"?U.jsx("button",{className:"viewer-full-input",type:"button",onClick:()=>i(c),children:"View assembly annotation"}):U.jsxs(U.Fragment,{children:[U.jsx(Dp,{task:s.task,text:s.input,compact:!0}),p3(c)?U.jsx("button",{className:"viewer-full-input",type:"button",onClick:()=>i(c),children:"View full input"}):null]})]})]}),U.jsx("div",{className:"model-comparison-grid",style:{"--grid-cols":s.task==="image2cad"?4:s.task==="text2cad"?3:2,"--grid-cols-md":s.task==="image2cad"?2:3},children:s.variants.map(h=>{const p=bx[h.family]||{color:"#337665",icon:"icons/src/openai.svg"};return U.jsxs("section",{className:"model-comparison-card",style:{"--model-color":p.color,"--model-tile":p.tile||"#fffdfa","--icon-filter":p.filter||"none"},children:[U.jsxs("div",{className:"compare-card-head",children:[U.jsx("span",{className:"model-mark compare-model-mark",children:U.jsx("img",{src:Gn(p.icon),alt:"","aria-hidden":"true"})}),U.jsxs("div",{children:[U.jsx("span",{children:h.formatLabel}),U.jsx("strong",{children:h.modelLabel})]})]}),U.jsx("div",{className:"compare-viewer",children:U.jsx(Ys,{item:{id:h.id,task:h.task,title:h.modelLabel,subtitle:h.formatLabel,src:h.src,mesh:h.mesh},recycle:!0})})]},h.id)})})]})]},s.id)}),t?U.jsx(Tx,{item:t,onClose:()=>i(null)}):null]}):U.jsx(wx,{title:"Render Showcase"})}function o3({items:r}){const t=JR(r),[i,s]=he.useState(null);return t.length?U.jsxs(U.Fragment,{children:[t.map(l=>U.jsxs("section",{className:"gallery-part-showcase complex-assembly-showcase",children:[U.jsxs("div",{className:"complex-head",children:[U.jsxs("div",{children:[U.jsx("span",{children:"Assembly-3D"}),U.jsx("h3",{children:"Generated assembly and parts"})]}),U.jsxs("div",{className:"complex-linked-case",children:[U.jsx("span",{children:l.format_label}),U.jsxs("strong",{children:[l.model_label," / ",l.short_case_id]})]})]}),U.jsx(l3,{item:l,onOpenInput:()=>s({task:"text_image2cad",title:l.title||l.short_case_id,taskLabel:"Assembly-3D",specLabel:l.format_label,input:l.condition||"",subtitle:`${l.model_label} / ${l.short_case_id}`})})]},l.id)),i?U.jsx(Tx,{item:i,onClose:()=>s(null)}):null]}):null}function l3({item:r,onOpenInput:t}){const i=(r.aligned_pairs||[]).slice(0,6);return U.jsxs("div",{className:"assembly-pair-body",children:[U.jsxs("div",{className:"assembly-pair-side-top",children:[U.jsxs("div",{className:"assembly-pair-input",children:[U.jsxs("div",{className:"complex-card-head",children:[U.jsx("span",{children:"Input"}),U.jsx("strong",{children:"Text specification"})]}),r.condition?U.jsx("p",{className:"assembly-pair-input-text",children:r.condition}):null,U.jsx("button",{type:"button",className:"viewer-full-input",onClick:t,children:"View input text"})]}),U.jsxs("div",{className:"assembly-pair-viewer-card",children:[U.jsxs("div",{className:"complex-card-head",children:[U.jsx("span",{children:"Reference assembly"}),U.jsx("strong",{children:"Ground truth"})]}),U.jsx("div",{className:"assembly-pair-viewer",children:r.assets.gt_mesh?U.jsx(Ys,{item:{id:`${r.id}-gt-assembly`,task:"text_image2cad",title:r.short_case_id,subtitle:"Ground truth",src:r.assets.gt_render||"",mesh:r.assets.gt_mesh},variant:"result",recycle:!0}):null})]})]}),U.jsx(Ov,{item:r,pairs:i,side:"gt",eyebrow:"Reference parts",title:`Ground truth · ${i.length} parts`}),U.jsx("div",{className:"assembly-pair-side-bottom",children:U.jsxs("div",{className:"assembly-pair-viewer-card",children:[U.jsxs("div",{className:"complex-card-head",children:[U.jsx("span",{children:"Predicted assembly"}),U.jsx("strong",{children:r.model_label})]}),U.jsx("div",{className:"assembly-pair-viewer",children:U.jsx(Ys,{item:{id:`${r.id}-pred-assembly`,task:"text_image2cad",title:r.short_case_id,subtitle:r.model_label,src:r.assets.pred_render||"",mesh:r.assets.mesh||r.assets.stage2_mesh||""},variant:"result",recycle:!0})})]})}),U.jsx(Ov,{item:r,pairs:i,side:"pred",eyebrow:"Predicted parts",title:r.model_label})]})}function Ov({item:r,pairs:t,side:i,eyebrow:s,title:l}){return U.jsxs("div",{className:"assembly-pair-block",children:[U.jsxs("div",{className:"complex-card-head",children:[U.jsx("span",{children:s}),U.jsx("strong",{children:l})]}),U.jsx("div",{className:"assembly-pair-grid","aria-label":s,children:t.map(c=>{const h=i==="gt"?c.gt:c.pred;return U.jsxs("figure",{className:"assembly-pair-cell",children:[U.jsx("span",{className:"assembly-pair-slot",children:c.slot+1}),U.jsx("div",{className:"assembly-pair-cell-viewer",children:h.mesh?U.jsx(Ys,{item:{id:`${r.id}-${i}-${c.slot}`,task:"text_image2cad",title:h.name,subtitle:i==="gt"?"Ground truth":r.model_label,mesh:h.mesh},recycle:!0}):null}),U.jsx("figcaption",{children:h.name})]},`${r.id}-${i}-${c.slot}`)})})]})}function Tx({item:r,onClose:t}){return U.jsx("div",{className:"input-modal",role:"dialog","aria-modal":"true","aria-labelledby":"input-modal-title",onClick:t,children:U.jsxs("div",{className:"input-modal-panel",onClick:i=>i.stopPropagation(),children:[U.jsxs("div",{className:"input-modal-head",children:[U.jsxs("span",{children:[r.taskLabel," · ",r.specLabel]}),U.jsx("button",{type:"button",onClick:t,children:"Close"})]}),U.jsx("h3",{id:"input-modal-title",children:r.title}),r.inputImage?U.jsx("img",{className:"input-modal-image",src:Gn(r.inputImage),alt:"Input reference"}):null,U.jsx(Dp,{task:r.task,text:r.input}),U.jsx("em",{children:r.subtitle})]})})}function Dp({task:r,text:t,compact:i=!1}){if(r!=="text_image2cad")return U.jsx("p",{children:t});const s=c3(t);return U.jsxs("div",{className:i?"assembly-annotation compact":"assembly-annotation",children:[s.assembly?U.jsxs("section",{children:[U.jsx("h4",{children:"assembly-level annotation"}),U.jsx("p",{children:s.assembly})]}):null,s.parts.length?U.jsxs("section",{children:[U.jsx("h4",{children:"part-level annotation"}),U.jsx("ol",{children:s.parts.map((l,c)=>U.jsxs("li",{children:[U.jsxs("strong",{children:["part ",c+1]}),U.jsx("span",{children:l.short||"No part-level annotation available; see annotation caveats."})]},`${l.name}-${c}`))})]}):null,s.caveats?U.jsxs("section",{children:[U.jsx("h4",{children:"annotation caveats"}),U.jsx("p",{children:s.caveats})]}):null]})}function c3(r){const t=(r||"").trim(),i=`
Parts:`,s=`
Annotation Caveats:`,l=t.indexOf(i),c=t.indexOf(s),h=[l,c].filter(M=>M>=0).sort((M,b)=>M-b)[0]??t.length,p=t.slice(0,h).trim(),m=l>=0?l+i.length:-1,d=c>=0?c:t.length,_=m>=0?t.slice(m,d).trim():"",v=c>=0?t.slice(c+s.length).trim():"",g=_.split(/\n(?=-\s+)/).map(M=>M.replace(/^-\s+/,"").trim()).filter(Boolean).map(M=>{const b=M.indexOf(":");return b<0?{name:"",short:M}:{name:M.slice(0,b).trim(),short:M.slice(b+1).trim()}});return{assembly:p,parts:g,caveats:v}}const Pv=["#337665","#2f7a86","#4f88a8","#7aa08f"],Iv={text2cad:{body:12573164,edge:3239058,shadow:5927810,rim:14282751},image2cad:{body:11918799,edge:3044708,shadow:5208172,rim:14284010},text_image2cad:{body:12574175,edge:4945280,shadow:5993595,rim:14808566}};function u3(r){return Iv[r||""]||Iv.text2cad}function f3({run:r,title:t,subtitle:i}){return r?.assets.gt_mesh?U.jsxs("figure",{className:"render-card result-viewer-card",children:[U.jsx("span",{children:"Ground Truth"}),U.jsx("div",{className:"result-viewer",children:U.jsx(Ys,{item:{id:`${r.case_id}-${r.spec}-ground-truth`,task:r.task,title:t,subtitle:i,src:r.assets.gt_render||"",mesh:r.assets.gt_mesh},variant:"result"})})]}):U.jsx(Rx,{title:"Ground Truth",src:r?.assets.gt_render})}function h3({run:r,title:t,subtitle:i}){return r?.assets.mesh?U.jsxs("figure",{className:"render-card result-viewer-card",children:[U.jsx("span",{children:"Prediction"}),U.jsx("div",{className:"result-viewer",children:U.jsx(Ys,{item:{id:r.id,task:r.task,title:t,subtitle:i,src:r.assets.pred_render||"",mesh:r.assets.mesh},variant:"result"})})]}):U.jsx(Rx,{title:"Prediction",src:r?.assets.pred_render})}function Ys({item:r,variant:t="showcase",recycle:i=!0}){const s=he.useRef(null),l=he.useRef(null);l.current===null&&(l.current=Symbol("cad-viewer"));const c=he.useRef(!0),[h,p]=he.useState(!1),[m,d]=he.useState(!1);return he.useEffect(()=>{p(!1),d(!1);const _=s.current;if(!_||!r.mesh)return;if(!("IntersectionObserver"in window)){p(!0);return}const v=new IntersectionObserver(g=>{const M=g.some(C=>C.isIntersecting);c.current=M;const b=l.current;M?(p(!0),b&&Lv(b,!0),i||v.disconnect()):i&&b&&Lv(b,!1)},{rootMargin:i?"300px 0px":"900px 0px"});return v.observe(_),()=>v.disconnect()},[r.id,r.mesh,i]),he.useEffect(()=>{const _=s.current;if(!_||!r.mesh||!h)return;d(!1);const v=l.current;GR(v,()=>p(!1));const g=new qM;g.background=new de(16777215),g.fog=new bp(16777215,6.8,12.2);const M=u3(r.task),b=new Ti(38,1,.01,100);b.position.set(3.6,2.35,t==="result"?4.35:4.7);const C=new MR({antialias:!0,alpha:!1,preserveDrawingBuffer:!0});C.setPixelRatio(Math.min(window.devicePixelRatio,2)),C.setClearColor(16777215,1),C.outputColorSpace=Qn,C.toneMapping=pp,C.toneMappingExposure=1,C.shadowMap.enabled=!0,C.shadowMap.type=zv,_.appendChild(C.domElement);const S=new bR(b,C.domElement);S.enableDamping=!0,S.autoRotate=!0,S.autoRotateSpeed=1.2,S.enablePan=!1,S.minDistance=2.2,S.maxDistance=7.5,g.add(new yE(16449532,12176066,1.95));const y=new rd(16777215,2.65);y.position.set(3.8,4.8,3.5),y.castShadow=!0,y.shadow.mapSize.set(1024,1024),g.add(y);const w=new rd(12053215,.86);w.position.set(-3.2,2.2,-2.6),g.add(w);const O=new rd(13035007,.62);O.position.set(-2.4,3.4,3.4),g.add(O);const P=new Fi(new pl(6,4),new oE({color:M.shadow,opacity:.09}));P.rotation.x=-Math.PI/2,P.position.y=-1.06,P.receiveShadow=!0,g.add(P);const z=new al;z.rotation.x=-Math.PI/2,g.add(z);let N=!1,B=0,T=null,F=null,q=null,G=null;const $=kR(L=>{if(N){L();return}new FR().load(Gn(r.mesh),et=>{if(L(),N){et.dispose();return}et.computeVertexNormals(),et.computeBoundingBox(),et.center();const gt=et.boundingBox,yt=new tt;gt?.getSize(yt);const I=Math.max(yt.x,yt.y,yt.z)||1,Q=t==="result"?2.32:2.08;et.scale(Q/I,Q/I,Q/I),et.computeBoundingBox(),T=et;const St=new pE({color:M.body,roughness:.58,metalness:.02,clearcoat:.1,clearcoatRoughness:.68,emissive:M.rim,emissiveIntensity:.006});F=St;const bt=new Fi(et,St);bt.castShadow=!0,bt.receiveShadow=!0,z.add(bt),q=new rE(et,28),G=new lx({color:M.edge,transparent:!0,opacity:t==="result"?.24:.28}),z.add(new aE(q,G)),d(!0)},void 0,et=>{L(),console.warn("Failed to load STL asset",r.mesh,et)})}),ut=()=>{const L=_.clientWidth,H=_.clientHeight;!L||!H||(C.setSize(L,H,!1),b.aspect=L/H,b.updateProjectionMatrix())},ht=new ResizeObserver(ut);ht.observe(_),ut();const j=()=>{B=requestAnimationFrame(j),c.current&&(S.update(),C.render(g,b))};return j(),()=>{N=!0,VR(v),$(),cancelAnimationFrame(B),ht.disconnect(),S.dispose(),T?.dispose(),F?.dispose(),q?.dispose(),G?.dispose(),P.geometry.dispose(),P.material.dispose(),C.dispose(),C.domElement.remove()}},[r.id,r.mesh,h,t]),U.jsxs("div",{className:"cad-viewer-shell",children:[U.jsxs("div",{className:`cad-viewer-preview cad-viewer-preview-empty ${m?"is-hidden":""}`,children:[U.jsx(hp,{size:28}),U.jsx("span",{children:h?"Loading 3D model":"3D model queued"})]}),U.jsx("div",{className:`cad-viewer ${m?"is-ready":""}`,ref:s})]})}function $c({label:r,value:t,options:i,onChange:s}){return U.jsxs("label",{className:"select-label",children:[U.jsx("span",{children:r}),U.jsx("select",{value:t,onChange:l=>s(l.target.value),children:i.map(([l,c])=>U.jsx("option",{value:l,children:c},l))})]})}function d3({cases:r,activeCaseId:t,onSelect:i}){const s=r.filter(l=>l.thumbnail);return s.length?U.jsx("div",{className:"case-image-picker","aria-label":"Image case picker",children:s.map(l=>U.jsxs("button",{type:"button",className:l.id===t?"case-image-tile active":"case-image-tile",onClick:()=>i(l.id),title:l.title,children:[U.jsx("img",{src:Gn(l.thumbnail),alt:"","aria-hidden":"true"}),U.jsx("span",{children:l.title})]},l.id))}):null}function p3(r){const t=r.input||"";return!!(r.inputImage||t.length>180||t.includes(`
`))}const m3={"⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9"};function Ax(r){return r.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,t=>m3[t]||t)}function g3(r){const t=r.match(/^(.+?)([⁰¹²³⁴⁵⁶⁷⁸⁹,\*]+)$/);return t?U.jsxs(U.Fragment,{children:[t[1],U.jsx("sup",{children:Ax(t[2])})]}):r}function _3(r){const t=r.match(/^([⁰¹²³⁴⁵⁶⁷⁸⁹]+)(.+)$/);return t?U.jsxs(U.Fragment,{children:[U.jsx("sup",{children:Ax(t[1])}),t[2]]}):r}function Rx({title:r,src:t}){return U.jsxs("figure",{className:"render-card",children:[U.jsx("span",{children:r}),t?U.jsx("img",{src:Gn(t),alt:r}):U.jsxs("div",{className:"render-missing",children:[U.jsx(Bv,{}),"No render"]})]})}function gd({title:r,icon:t,defaultOpen:i=!1,children:s}){const[l,c]=he.useState(i);return U.jsxs("div",{className:`collapsible ${l?"open":"closed"}`,children:[U.jsxs("button",{className:"collapsible-header",type:"button",onClick:()=>c(!l),children:[t?U.jsx("span",{className:"collapsible-icon",children:t}):null,U.jsx("span",{className:"collapsible-title",children:r}),l?U.jsx(qy,{size:16}):U.jsx(Wy,{size:16})]}),l?U.jsx("div",{className:"collapsible-body",children:s}):null]})}const v3=[{key:"geometry",label:"Geometry",accent:"var(--blue)",metrics:[["f_score_005","F@0.05"],["f_score_001","F@0.01"],["normal_consistency","NC"],["chamfer_distance","CD"],["iou_voxel","IoU"]]},{key:"topology",label:"Topology",accent:"var(--teal)",metrics:[["pred_open_edge_ratio","NoOE"],["pred_inverted_normal_ratio","InvN"],["pred_non_manifold_edge_ratio","NM"]]},{key:"judge",label:"Judge",accent:"var(--violet)",metrics:[["judge_geometry","J-Geo"],["judge_aesthetics","J-Aes"],["judge_semantic","J-Sem"],["qa_semantic","QA-S"],["qa_parametric","QA-P"]]},{key:"part",label:"Part",accent:"var(--coral)",metrics:[["part_match_f1","PartMatchF1"],["part_fscore_mean","PartFS"]]}];function x3({run:r}){if(!r)return null;const t=r.metrics||{},i=v3.map(l=>({...l,items:l.metrics.filter(([c])=>Cx(c,t[c],r)).map(([c,h])=>({key:c,label:h,value:y3(c,t[c])}))})).filter(l=>l.items.length>0),s=r.valid!==null&&r.valid!==void 0;return!i.length&&!s?null:U.jsxs("div",{className:"metrics-panel",children:[s?U.jsxs("div",{className:`metric-valid ${r.valid?"is-valid":"is-invalid"}`,children:[U.jsx("span",{children:"Executable"}),U.jsx("strong",{children:r.valid?"yes":"no"})]}):null,i.map(l=>U.jsxs("div",{className:"metric-bucket",style:{"--bucket-accent":l.accent},children:[U.jsx("span",{className:"metric-bucket-label",children:l.label}),U.jsx("div",{className:"metrics",children:l.items.map(c=>U.jsxs("div",{className:"metric",children:[U.jsx("span",{children:c.label}),U.jsx("strong",{children:c.value})]},c.key))})]},l.key))]})}function Cx(r,t,i){return!(!S3(t)||r==="qa_parametric"&&i.spec!=="parametric"||r==="qa_parametric"&&typeof t=="number"&&t<=0)}function S3(r){return r!=null&&r!==""&&!(typeof r=="number"&&Number.isNaN(r))}function y3(r,t){return typeof t!="number"?String(t):r.startsWith("judge_")?`${Number.isInteger(t)?t:t.toFixed(1)}/10`:r.endsWith("_ratio")?t.toFixed(3):r.includes("chamfer")||r.includes("hausdorff")?t===0?"0":t<.01?t.toFixed(4):t.toFixed(3):t<1?t.toFixed(3):t.toFixed(2)}function wx({title:r,text:t}){return U.jsxs("div",{className:"placeholder",children:[U.jsx(hp,{size:32}),U.jsx("h3",{children:r}),t?U.jsx("p",{children:t}):null]})}Gy.createRoot(document.getElementById("root")).render(U.jsx(XR,{}));
