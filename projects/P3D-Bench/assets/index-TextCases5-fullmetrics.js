(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const h of c.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&r(h)}).observe(document,{childList:!0,subtree:!0});function i(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(l){if(l.ep)return;l.ep=!0;const c=i(l);fetch(l.href,c)}})();function Py(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Ch={exports:{}},Yo={};var __;function Iy(){if(__)return Yo;__=1;var s=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function i(r,l,c){var h=null;if(c!==void 0&&(h=""+c),l.key!==void 0&&(h=""+l.key),"key"in l){c={};for(var p in l)p!=="key"&&(c[p]=l[p])}else c=l;return l=c.ref,{$$typeof:s,type:r,key:h,ref:l!==void 0?l:null,props:c}}return Yo.Fragment=e,Yo.jsx=i,Yo.jsxs=i,Yo}var v_;function Fy(){return v_||(v_=1,Ch.exports=Iy()),Ch.exports}var D=Fy(),wh={exports:{}},st={};var x_;function By(){if(x_)return st;x_=1;var s=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),h=Symbol.for("react.context"),p=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),d=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),v=Symbol.for("react.activity"),g=Symbol.iterator;function M(F){return F===null||typeof F!="object"?null:(F=g&&F[g]||F["@@iterator"],typeof F=="function"?F:null)}var E={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,y={};function S(F,q,Se){this.props=F,this.context=q,this.refs=y,this.updater=Se||E}S.prototype.isReactComponent={},S.prototype.setState=function(F,q){if(typeof F!="object"&&typeof F!="function"&&F!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,F,q,"setState")},S.prototype.forceUpdate=function(F){this.updater.enqueueForceUpdate(this,F,"forceUpdate")};function w(){}w.prototype=S.prototype;function L(F,q,Se){this.props=F,this.context=q,this.refs=y,this.updater=Se||E}var I=L.prototype=new w;I.constructor=L,C(I,S.prototype),I.isPureReactComponent=!0;var V=Array.isArray;function N(){}var O={H:null,A:null,T:null,S:null},T=Object.prototype.hasOwnProperty;function B(F,q,Se){var Ae=Se.ref;return{$$typeof:s,type:F,key:q,ref:Ae!==void 0?Ae:null,props:Se}}function Z(F,q){return B(F.type,q,F.props)}function z(F){return typeof F=="object"&&F!==null&&F.$$typeof===s}function Q(F){var q={"=":"=0",":":"=2"};return"$"+F.replace(/[=:]/g,function(Se){return q[Se]})}var ee=/\/+/g;function he(F,q){return typeof F=="object"&&F!==null&&F.key!=null?Q(""+F.key):q.toString(36)}function j(F){switch(F.status){case"fulfilled":return F.value;case"rejected":throw F.reason;default:switch(typeof F.status=="string"?F.then(N,N):(F.status="pending",F.then(function(q){F.status==="pending"&&(F.status="fulfilled",F.value=q)},function(q){F.status==="pending"&&(F.status="rejected",F.reason=q)})),F.status){case"fulfilled":return F.value;case"rejected":throw F.reason}}throw F}function P(F,q,Se,Ae,Ce){var se=typeof F;(se==="undefined"||se==="boolean")&&(F=null);var Me=!1;if(F===null)Me=!0;else switch(se){case"bigint":case"string":case"number":Me=!0;break;case"object":switch(F.$$typeof){case s:case e:Me=!0;break;case _:return Me=F._init,P(Me(F._payload),q,Se,Ae,Ce)}}if(Me)return Ce=Ce(F),Me=Ae===""?"."+he(F,0):Ae,V(Ce)?(Se="",Me!=null&&(Se=Me.replace(ee,"$&/")+"/"),P(Ce,q,Se,"",function(we){return we})):Ce!=null&&(z(Ce)&&(Ce=Z(Ce,Se+(Ce.key==null||F&&F.key===Ce.key?"":(""+Ce.key).replace(ee,"$&/")+"/")+Me)),q.push(Ce)),1;Me=0;var be=Ae===""?".":Ae+":";if(V(F))for(var K=0;K<F.length;K++)Ae=F[K],se=be+he(Ae,K),Me+=P(Ae,q,Se,se,Ce);else if(K=M(F),typeof K=="function")for(F=K.call(F),K=0;!(Ae=F.next()).done;)Ae=Ae.value,se=be+he(Ae,K++),Me+=P(Ae,q,Se,se,Ce);else if(se==="object"){if(typeof F.then=="function")return P(j(F),q,Se,Ae,Ce);throw q=String(F),Error("Objects are not valid as a React child (found: "+(q==="[object Object]"?"object with keys {"+Object.keys(F).join(", ")+"}":q)+"). If you meant to render a collection of children, use an array instead.")}return Me}function H(F,q,Se){if(F==null)return F;var Ae=[],Ce=0;return P(F,Ae,"","",function(se){return q.call(Se,se,Ce++)}),Ae}function ne(F){if(F._status===-1){var q=F._result;q=q(),q.then(function(Se){(F._status===0||F._status===-1)&&(F._status=1,F._result=Se)},function(Se){(F._status===0||F._status===-1)&&(F._status=2,F._result=Se)}),F._status===-1&&(F._status=0,F._result=q)}if(F._status===1)return F._result.default;throw F._result}var pe=typeof reportError=="function"?reportError:function(F){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var q=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof F=="object"&&F!==null&&typeof F.message=="string"?String(F.message):String(F),error:F});if(!window.dispatchEvent(q))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",F);return}console.error(F)},ye={map:H,forEach:function(F,q,Se){H(F,function(){q.apply(this,arguments)},Se)},count:function(F){var q=0;return H(F,function(){q++}),q},toArray:function(F){return H(F,function(q){return q})||[]},only:function(F){if(!z(F))throw Error("React.Children.only expected to receive a single React element child.");return F}};return st.Activity=v,st.Children=ye,st.Component=S,st.Fragment=i,st.Profiler=l,st.PureComponent=L,st.StrictMode=r,st.Suspense=m,st.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=O,st.__COMPILER_RUNTIME={__proto__:null,c:function(F){return O.H.useMemoCache(F)}},st.cache=function(F){return function(){return F.apply(null,arguments)}},st.cacheSignal=function(){return null},st.cloneElement=function(F,q,Se){if(F==null)throw Error("The argument must be a React element, but you passed "+F+".");var Ae=C({},F.props),Ce=F.key;if(q!=null)for(se in q.key!==void 0&&(Ce=""+q.key),q)!T.call(q,se)||se==="key"||se==="__self"||se==="__source"||se==="ref"&&q.ref===void 0||(Ae[se]=q[se]);var se=arguments.length-2;if(se===1)Ae.children=Se;else if(1<se){for(var Me=Array(se),be=0;be<se;be++)Me[be]=arguments[be+2];Ae.children=Me}return B(F.type,Ce,Ae)},st.createContext=function(F){return F={$$typeof:h,_currentValue:F,_currentValue2:F,_threadCount:0,Provider:null,Consumer:null},F.Provider=F,F.Consumer={$$typeof:c,_context:F},F},st.createElement=function(F,q,Se){var Ae,Ce={},se=null;if(q!=null)for(Ae in q.key!==void 0&&(se=""+q.key),q)T.call(q,Ae)&&Ae!=="key"&&Ae!=="__self"&&Ae!=="__source"&&(Ce[Ae]=q[Ae]);var Me=arguments.length-2;if(Me===1)Ce.children=Se;else if(1<Me){for(var be=Array(Me),K=0;K<Me;K++)be[K]=arguments[K+2];Ce.children=be}if(F&&F.defaultProps)for(Ae in Me=F.defaultProps,Me)Ce[Ae]===void 0&&(Ce[Ae]=Me[Ae]);return B(F,se,Ce)},st.createRef=function(){return{current:null}},st.forwardRef=function(F){return{$$typeof:p,render:F}},st.isValidElement=z,st.lazy=function(F){return{$$typeof:_,_payload:{_status:-1,_result:F},_init:ne}},st.memo=function(F,q){return{$$typeof:d,type:F,compare:q===void 0?null:q}},st.startTransition=function(F){var q=O.T,Se={};O.T=Se;try{var Ae=F(),Ce=O.S;Ce!==null&&Ce(Se,Ae),typeof Ae=="object"&&Ae!==null&&typeof Ae.then=="function"&&Ae.then(N,pe)}catch(se){pe(se)}finally{q!==null&&Se.types!==null&&(q.types=Se.types),O.T=q}},st.unstable_useCacheRefresh=function(){return O.H.useCacheRefresh()},st.use=function(F){return O.H.use(F)},st.useActionState=function(F,q,Se){return O.H.useActionState(F,q,Se)},st.useCallback=function(F,q){return O.H.useCallback(F,q)},st.useContext=function(F){return O.H.useContext(F)},st.useDebugValue=function(){},st.useDeferredValue=function(F,q){return O.H.useDeferredValue(F,q)},st.useEffect=function(F,q){return O.H.useEffect(F,q)},st.useEffectEvent=function(F){return O.H.useEffectEvent(F)},st.useId=function(){return O.H.useId()},st.useImperativeHandle=function(F,q,Se){return O.H.useImperativeHandle(F,q,Se)},st.useInsertionEffect=function(F,q){return O.H.useInsertionEffect(F,q)},st.useLayoutEffect=function(F,q){return O.H.useLayoutEffect(F,q)},st.useMemo=function(F,q){return O.H.useMemo(F,q)},st.useOptimistic=function(F,q){return O.H.useOptimistic(F,q)},st.useReducer=function(F,q,Se){return O.H.useReducer(F,q,Se)},st.useRef=function(F){return O.H.useRef(F)},st.useState=function(F){return O.H.useState(F)},st.useSyncExternalStore=function(F,q,Se){return O.H.useSyncExternalStore(F,q,Se)},st.useTransition=function(){return O.H.useTransition()},st.version="19.2.6",st}var S_;function pp(){return S_||(S_=1,wh.exports=By()),wh.exports}var Qe=pp();const zy=Py(Qe);var Dh={exports:{}},Zo={},Uh={exports:{}},Nh={};var y_;function Hy(){return y_||(y_=1,(function(s){function e(P,H){var ne=P.length;P.push(H);e:for(;0<ne;){var pe=ne-1>>>1,ye=P[pe];if(0<l(ye,H))P[pe]=H,P[ne]=ye,ne=pe;else break e}}function i(P){return P.length===0?null:P[0]}function r(P){if(P.length===0)return null;var H=P[0],ne=P.pop();if(ne!==H){P[0]=ne;e:for(var pe=0,ye=P.length,F=ye>>>1;pe<F;){var q=2*(pe+1)-1,Se=P[q],Ae=q+1,Ce=P[Ae];if(0>l(Se,ne))Ae<ye&&0>l(Ce,Se)?(P[pe]=Ce,P[Ae]=ne,pe=Ae):(P[pe]=Se,P[q]=ne,pe=q);else if(Ae<ye&&0>l(Ce,ne))P[pe]=Ce,P[Ae]=ne,pe=Ae;else break e}}return H}function l(P,H){var ne=P.sortIndex-H.sortIndex;return ne!==0?ne:P.id-H.id}if(s.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;s.unstable_now=function(){return c.now()}}else{var h=Date,p=h.now();s.unstable_now=function(){return h.now()-p}}var m=[],d=[],_=1,v=null,g=3,M=!1,E=!1,C=!1,y=!1,S=typeof setTimeout=="function"?setTimeout:null,w=typeof clearTimeout=="function"?clearTimeout:null,L=typeof setImmediate<"u"?setImmediate:null;function I(P){for(var H=i(d);H!==null;){if(H.callback===null)r(d);else if(H.startTime<=P)r(d),H.sortIndex=H.expirationTime,e(m,H);else break;H=i(d)}}function V(P){if(C=!1,I(P),!E)if(i(m)!==null)E=!0,N||(N=!0,Q());else{var H=i(d);H!==null&&j(V,H.startTime-P)}}var N=!1,O=-1,T=5,B=-1;function Z(){return y?!0:!(s.unstable_now()-B<T)}function z(){if(y=!1,N){var P=s.unstable_now();B=P;var H=!0;try{e:{E=!1,C&&(C=!1,w(O),O=-1),M=!0;var ne=g;try{t:{for(I(P),v=i(m);v!==null&&!(v.expirationTime>P&&Z());){var pe=v.callback;if(typeof pe=="function"){v.callback=null,g=v.priorityLevel;var ye=pe(v.expirationTime<=P);if(P=s.unstable_now(),typeof ye=="function"){v.callback=ye,I(P),H=!0;break t}v===i(m)&&r(m),I(P)}else r(m);v=i(m)}if(v!==null)H=!0;else{var F=i(d);F!==null&&j(V,F.startTime-P),H=!1}}break e}finally{v=null,g=ne,M=!1}H=void 0}}finally{H?Q():N=!1}}}var Q;if(typeof L=="function")Q=function(){L(z)};else if(typeof MessageChannel<"u"){var ee=new MessageChannel,he=ee.port2;ee.port1.onmessage=z,Q=function(){he.postMessage(null)}}else Q=function(){S(z,0)};function j(P,H){O=S(function(){P(s.unstable_now())},H)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(P){P.callback=null},s.unstable_forceFrameRate=function(P){0>P||125<P?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<P?Math.floor(1e3/P):5},s.unstable_getCurrentPriorityLevel=function(){return g},s.unstable_next=function(P){switch(g){case 1:case 2:case 3:var H=3;break;default:H=g}var ne=g;g=H;try{return P()}finally{g=ne}},s.unstable_requestPaint=function(){y=!0},s.unstable_runWithPriority=function(P,H){switch(P){case 1:case 2:case 3:case 4:case 5:break;default:P=3}var ne=g;g=P;try{return H()}finally{g=ne}},s.unstable_scheduleCallback=function(P,H,ne){var pe=s.unstable_now();switch(typeof ne=="object"&&ne!==null?(ne=ne.delay,ne=typeof ne=="number"&&0<ne?pe+ne:pe):ne=pe,P){case 1:var ye=-1;break;case 2:ye=250;break;case 5:ye=1073741823;break;case 4:ye=1e4;break;default:ye=5e3}return ye=ne+ye,P={id:_++,callback:H,priorityLevel:P,startTime:ne,expirationTime:ye,sortIndex:-1},ne>pe?(P.sortIndex=ne,e(d,P),i(m)===null&&P===i(d)&&(C?(w(O),O=-1):C=!0,j(V,ne-pe))):(P.sortIndex=ye,e(m,P),E||M||(E=!0,N||(N=!0,Q()))),P},s.unstable_shouldYield=Z,s.unstable_wrapCallback=function(P){var H=g;return function(){var ne=g;g=H;try{return P.apply(this,arguments)}finally{g=ne}}}})(Nh)),Nh}var M_;function Gy(){return M_||(M_=1,Uh.exports=Hy()),Uh.exports}var Lh={exports:{}},In={};var b_;function Vy(){if(b_)return In;b_=1;var s=pp();function e(m){var d="https://react.dev/errors/"+m;if(1<arguments.length){d+="?args[]="+encodeURIComponent(arguments[1]);for(var _=2;_<arguments.length;_++)d+="&args[]="+encodeURIComponent(arguments[_])}return"Minified React error #"+m+"; visit "+d+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var r={d:{f:i,r:function(){throw Error(e(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function c(m,d,_){var v=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:v==null?null:""+v,children:m,containerInfo:d,implementation:_}}var h=s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function p(m,d){if(m==="font")return"";if(typeof d=="string")return d==="use-credentials"?d:""}return In.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,In.createPortal=function(m,d){var _=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!d||d.nodeType!==1&&d.nodeType!==9&&d.nodeType!==11)throw Error(e(299));return c(m,d,null,_)},In.flushSync=function(m){var d=h.T,_=r.p;try{if(h.T=null,r.p=2,m)return m()}finally{h.T=d,r.p=_,r.d.f()}},In.preconnect=function(m,d){typeof m=="string"&&(d?(d=d.crossOrigin,d=typeof d=="string"?d==="use-credentials"?d:"":void 0):d=null,r.d.C(m,d))},In.prefetchDNS=function(m){typeof m=="string"&&r.d.D(m)},In.preinit=function(m,d){if(typeof m=="string"&&d&&typeof d.as=="string"){var _=d.as,v=p(_,d.crossOrigin),g=typeof d.integrity=="string"?d.integrity:void 0,M=typeof d.fetchPriority=="string"?d.fetchPriority:void 0;_==="style"?r.d.S(m,typeof d.precedence=="string"?d.precedence:void 0,{crossOrigin:v,integrity:g,fetchPriority:M}):_==="script"&&r.d.X(m,{crossOrigin:v,integrity:g,fetchPriority:M,nonce:typeof d.nonce=="string"?d.nonce:void 0})}},In.preinitModule=function(m,d){if(typeof m=="string")if(typeof d=="object"&&d!==null){if(d.as==null||d.as==="script"){var _=p(d.as,d.crossOrigin);r.d.M(m,{crossOrigin:_,integrity:typeof d.integrity=="string"?d.integrity:void 0,nonce:typeof d.nonce=="string"?d.nonce:void 0})}}else d==null&&r.d.M(m)},In.preload=function(m,d){if(typeof m=="string"&&typeof d=="object"&&d!==null&&typeof d.as=="string"){var _=d.as,v=p(_,d.crossOrigin);r.d.L(m,_,{crossOrigin:v,integrity:typeof d.integrity=="string"?d.integrity:void 0,nonce:typeof d.nonce=="string"?d.nonce:void 0,type:typeof d.type=="string"?d.type:void 0,fetchPriority:typeof d.fetchPriority=="string"?d.fetchPriority:void 0,referrerPolicy:typeof d.referrerPolicy=="string"?d.referrerPolicy:void 0,imageSrcSet:typeof d.imageSrcSet=="string"?d.imageSrcSet:void 0,imageSizes:typeof d.imageSizes=="string"?d.imageSizes:void 0,media:typeof d.media=="string"?d.media:void 0})}},In.preloadModule=function(m,d){if(typeof m=="string")if(d){var _=p(d.as,d.crossOrigin);r.d.m(m,{as:typeof d.as=="string"&&d.as!=="script"?d.as:void 0,crossOrigin:_,integrity:typeof d.integrity=="string"?d.integrity:void 0})}else r.d.m(m)},In.requestFormReset=function(m){r.d.r(m)},In.unstable_batchedUpdates=function(m,d){return m(d)},In.useFormState=function(m,d,_){return h.H.useFormState(m,d,_)},In.useFormStatus=function(){return h.H.useHostTransitionStatus()},In.version="19.2.6",In}var E_;function ky(){if(E_)return Lh.exports;E_=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Lh.exports=Vy(),Lh.exports}var T_;function Xy(){if(T_)return Zo;T_=1;var s=Gy(),e=pp(),i=ky();function r(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function c(t){var n=t,a=t;if(t.alternate)for(;n.return;)n=n.return;else{t=n;do n=t,(n.flags&4098)!==0&&(a=n.return),t=n.return;while(t)}return n.tag===3?a:null}function h(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function p(t){if(t.tag===31){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function m(t){if(c(t)!==t)throw Error(r(188))}function d(t){var n=t.alternate;if(!n){if(n=c(t),n===null)throw Error(r(188));return n!==t?null:t}for(var a=t,o=n;;){var u=a.return;if(u===null)break;var f=u.alternate;if(f===null){if(o=u.return,o!==null){a=o;continue}break}if(u.child===f.child){for(f=u.child;f;){if(f===a)return m(u),t;if(f===o)return m(u),n;f=f.sibling}throw Error(r(188))}if(a.return!==o.return)a=u,o=f;else{for(var x=!1,R=u.child;R;){if(R===a){x=!0,a=u,o=f;break}if(R===o){x=!0,o=u,a=f;break}R=R.sibling}if(!x){for(R=f.child;R;){if(R===a){x=!0,a=f,o=u;break}if(R===o){x=!0,o=f,a=u;break}R=R.sibling}if(!x)throw Error(r(189))}}if(a.alternate!==o)throw Error(r(190))}if(a.tag!==3)throw Error(r(188));return a.stateNode.current===a?t:n}function _(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=_(t),n!==null)return n;t=t.sibling}return null}var v=Object.assign,g=Symbol.for("react.element"),M=Symbol.for("react.transitional.element"),E=Symbol.for("react.portal"),C=Symbol.for("react.fragment"),y=Symbol.for("react.strict_mode"),S=Symbol.for("react.profiler"),w=Symbol.for("react.consumer"),L=Symbol.for("react.context"),I=Symbol.for("react.forward_ref"),V=Symbol.for("react.suspense"),N=Symbol.for("react.suspense_list"),O=Symbol.for("react.memo"),T=Symbol.for("react.lazy"),B=Symbol.for("react.activity"),Z=Symbol.for("react.memo_cache_sentinel"),z=Symbol.iterator;function Q(t){return t===null||typeof t!="object"?null:(t=z&&t[z]||t["@@iterator"],typeof t=="function"?t:null)}var ee=Symbol.for("react.client.reference");function he(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===ee?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case C:return"Fragment";case S:return"Profiler";case y:return"StrictMode";case V:return"Suspense";case N:return"SuspenseList";case B:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case E:return"Portal";case L:return t.displayName||"Context";case w:return(t._context.displayName||"Context")+".Consumer";case I:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case O:return n=t.displayName||null,n!==null?n:he(t.type)||"Memo";case T:n=t._payload,t=t._init;try{return he(t(n))}catch{}}return null}var j=Array.isArray,P=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,H=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ne={pending:!1,data:null,method:null,action:null},pe=[],ye=-1;function F(t){return{current:t}}function q(t){0>ye||(t.current=pe[ye],pe[ye]=null,ye--)}function Se(t,n){ye++,pe[ye]=t.current,t.current=n}var Ae=F(null),Ce=F(null),se=F(null),Me=F(null);function be(t,n){switch(Se(se,n),Se(Ce,t),Se(Ae,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?Hg(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=Hg(n),t=Gg(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}q(Ae),Se(Ae,t)}function K(){q(Ae),q(Ce),q(se)}function we(t){t.memoizedState!==null&&Se(Me,t);var n=Ae.current,a=Gg(n,t.type);n!==a&&(Se(Ce,t),Se(Ae,a))}function Ze(t){Ce.current===t&&(q(Ae),q(Ce)),Me.current===t&&(q(Me),Xo._currentValue=ne)}var jt,pt;function yt(t){if(jt===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);jt=n&&n[1]||"",pt=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+jt+t+pt}var Lt=!1;function ut(t,n){if(!t||Lt)return"";Lt=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(n){var xe=function(){throw Error()};if(Object.defineProperty(xe.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(xe,[])}catch(ue){var ce=ue}Reflect.construct(t,[],xe)}else{try{xe.call()}catch(ue){ce=ue}t.call(xe.prototype)}}else{try{throw Error()}catch(ue){ce=ue}(xe=t())&&typeof xe.catch=="function"&&xe.catch(function(){})}}catch(ue){if(ue&&ce&&typeof ue.stack=="string")return[ue.stack,ce.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=o.DetermineComponentFrameRoot(),x=f[0],R=f[1];if(x&&R){var G=x.split(`
`),ae=R.split(`
`);for(u=o=0;o<G.length&&!G[o].includes("DetermineComponentFrameRoot");)o++;for(;u<ae.length&&!ae[u].includes("DetermineComponentFrameRoot");)u++;if(o===G.length||u===ae.length)for(o=G.length-1,u=ae.length-1;1<=o&&0<=u&&G[o]!==ae[u];)u--;for(;1<=o&&0<=u;o--,u--)if(G[o]!==ae[u]){if(o!==1||u!==1)do if(o--,u--,0>u||G[o]!==ae[u]){var me=`
`+G[o].replace(" at new "," at ");return t.displayName&&me.includes("<anonymous>")&&(me=me.replace("<anonymous>",t.displayName)),me}while(1<=o&&0<=u);break}}}finally{Lt=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?yt(a):""}function ln(t,n){switch(t.tag){case 26:case 27:case 5:return yt(t.type);case 16:return yt("Lazy");case 13:return t.child!==n&&n!==null?yt("Suspense Fallback"):yt("Suspense");case 19:return yt("SuspenseList");case 0:case 15:return ut(t.type,!1);case 11:return ut(t.type.render,!1);case 1:return ut(t.type,!0);case 31:return yt("Activity");default:return""}}function Yt(t){try{var n="",a=null;do n+=ln(t,a),a=t,t=t.return;while(t);return n}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var An=Object.prototype.hasOwnProperty,W=s.unstable_scheduleCallback,tn=s.unstable_cancelCallback,mt=s.unstable_shouldYield,Ht=s.unstable_requestPaint,De=s.unstable_now,Qt=s.unstable_getCurrentPriorityLevel,U=s.unstable_ImmediatePriority,b=s.unstable_UserBlockingPriority,te=s.unstable_NormalPriority,ve=s.unstable_LowPriority,Te=s.unstable_IdlePriority,Ue=s.log,Pe=s.unstable_setDisableYieldValue,fe=null,de=null;function Ie(t){if(typeof Ue=="function"&&Pe(t),de&&typeof de.setStrictMode=="function")try{de.setStrictMode(fe,t)}catch{}}var Fe=Math.clz32?Math.clz32:it,Le=Math.log,Ne=Math.LN2;function it(t){return t>>>=0,t===0?32:31-(Le(t)/Ne|0)|0}var at=256,_t=262144,k=4194304;function Re(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function ge(t,n,a){var o=t.pendingLanes;if(o===0)return 0;var u=0,f=t.suspendedLanes,x=t.pingedLanes;t=t.warmLanes;var R=o&134217727;return R!==0?(o=R&~f,o!==0?u=Re(o):(x&=R,x!==0?u=Re(x):a||(a=R&~t,a!==0&&(u=Re(a))))):(R=o&~f,R!==0?u=Re(R):x!==0?u=Re(x):a||(a=o&~t,a!==0&&(u=Re(a)))),u===0?0:n!==0&&n!==u&&(n&f)===0&&(f=u&-u,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:u}function He(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function Oe(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ee(){var t=k;return k<<=1,(k&62914560)===0&&(k=4194304),t}function qe(t){for(var n=[],a=0;31>a;a++)n.push(t);return n}function nt(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function nn(t,n,a,o,u,f){var x=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var R=t.entanglements,G=t.expirationTimes,ae=t.hiddenUpdates;for(a=x&~a;0<a;){var me=31-Fe(a),xe=1<<me;R[me]=0,G[me]=-1;var ce=ae[me];if(ce!==null)for(ae[me]=null,me=0;me<ce.length;me++){var ue=ce[me];ue!==null&&(ue.lane&=-536870913)}a&=~xe}o!==0&&Dt(t,o,0),f!==0&&u===0&&t.tag!==0&&(t.suspendedLanes|=f&~(x&~n))}function Dt(t,n,a){t.pendingLanes|=n,t.suspendedLanes&=~n;var o=31-Fe(n);t.entangledLanes|=n,t.entanglements[o]=t.entanglements[o]|1073741824|a&261930}function gi(t,n){var a=t.entangledLanes|=n;for(t=t.entanglements;a;){var o=31-Fe(a),u=1<<o;u&n|t[o]&n&&(t[o]|=n),a&=~u}}function ti(t,n){var a=n&-n;return a=(a&42)!==0?1:vs(a),(a&(t.suspendedLanes|n))!==0?0:a}function vs(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function to(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function no(){var t=H.p;return t!==0?t:(t=window.event,t===void 0?32:u_(t.type))}function io(t,n){var a=H.p;try{return H.p=t,n()}finally{H.p=a}}var On=Math.random().toString(36).slice(2),cn="__reactFiber$"+On,Rn="__reactProps$"+On,$i="__reactContainer$"+On,wa="__reactEvents$"+On,gl="__reactListeners$"+On,Qs="__reactHandles$"+On,ao="__reactResources$"+On,Da="__reactMarker$"+On;function so(t){delete t[cn],delete t[Rn],delete t[wa],delete t[gl],delete t[Qs]}function Ua(t){var n=t[cn];if(n)return n;for(var a=t.parentNode;a;){if(n=a[$i]||a[cn]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(t=Yg(t);t!==null;){if(a=t[cn])return a;t=Yg(t)}return n}t=a,a=t.parentNode}return null}function Na(t){if(t=t[cn]||t[$i]){var n=t.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return t}return null}function xs(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(r(33))}function La(t){var n=t[ao];return n||(n=t[ao]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function hn(t){t[Da]=!0}var _l=new Set,A={};function Y(t,n){le(t,n),le(t+"Capture",n)}function le(t,n){for(A[t]=n,t=0;t<n.length;t++)_l.add(n[t])}var re=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),oe={},ze={};function ke(t){return An.call(ze,t)?!0:An.call(oe,t)?!1:re.test(t)?ze[t]=!0:(oe[t]=!0,!1)}function Be(t,n,a){if(ke(n))if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var o=n.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,""+a)}}function je(t,n,a){if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,""+a)}}function Xe(t,n,a,o){if(o===null)t.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(n,a,""+o)}}function Je(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function lt(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Ke(t,n,a){var o=Object.getOwnPropertyDescriptor(t.constructor.prototype,n);if(!t.hasOwnProperty(n)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var u=o.get,f=o.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return u.call(this)},set:function(x){a=""+x,f.call(this,x)}}),Object.defineProperty(t,n,{enumerable:o.enumerable}),{getValue:function(){return a},setValue:function(x){a=""+x},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function Rt(t){if(!t._valueTracker){var n=lt(t)?"checked":"value";t._valueTracker=Ke(t,n,""+t[n])}}function Jt(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var a=n.getValue(),o="";return t&&(o=lt(t)?t.checked?"true":"false":t.value),t=o,t!==a?(n.setValue(t),!0):!1}function Wt(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var Ot=/[\n"\\]/g;function Pt(t){return t.replace(Ot,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function Ve(t,n,a,o,u,f,x,R){t.name="",x!=null&&typeof x!="function"&&typeof x!="symbol"&&typeof x!="boolean"?t.type=x:t.removeAttribute("type"),n!=null?x==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+Je(n)):t.value!==""+Je(n)&&(t.value=""+Je(n)):x!=="submit"&&x!=="reset"||t.removeAttribute("value"),n!=null?vt(t,x,Je(n)):a!=null?vt(t,x,Je(a)):o!=null&&t.removeAttribute("value"),u==null&&f!=null&&(t.defaultChecked=!!f),u!=null&&(t.checked=u&&typeof u!="function"&&typeof u!="symbol"),R!=null&&typeof R!="function"&&typeof R!="symbol"&&typeof R!="boolean"?t.name=""+Je(R):t.removeAttribute("name")}function Pn(t,n,a,o,u,f,x,R){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(t.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){Rt(t);return}a=a!=null?""+Je(a):"",n=n!=null?""+Je(n):a,R||n===t.value||(t.value=n),t.defaultValue=n}o=o??u,o=typeof o!="function"&&typeof o!="symbol"&&!!o,t.checked=R?t.checked:!!o,t.defaultChecked=!!o,x!=null&&typeof x!="function"&&typeof x!="symbol"&&typeof x!="boolean"&&(t.name=x),Rt(t)}function vt(t,n,a){n==="number"&&Wt(t.ownerDocument)===t||t.defaultValue===""+a||(t.defaultValue=""+a)}function vn(t,n,a,o){if(t=t.options,n){n={};for(var u=0;u<a.length;u++)n["$"+a[u]]=!0;for(a=0;a<t.length;a++)u=n.hasOwnProperty("$"+t[a].value),t[a].selected!==u&&(t[a].selected=u),u&&o&&(t[a].defaultSelected=!0)}else{for(a=""+Je(a),n=null,u=0;u<t.length;u++){if(t[u].value===a){t[u].selected=!0,o&&(t[u].defaultSelected=!0);return}n!==null||t[u].disabled||(n=t[u])}n!==null&&(n.selected=!0)}}function ni(t,n,a){if(n!=null&&(n=""+Je(n),n!==t.value&&(t.value=n),a==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=a!=null?""+Je(a):""}function Ci(t,n,a,o){if(n==null){if(o!=null){if(a!=null)throw Error(r(92));if(j(o)){if(1<o.length)throw Error(r(93));o=o[0]}a=o}a==null&&(a=""),n=a}a=Je(n),t.defaultValue=a,o=t.textContent,o===a&&o!==""&&o!==null&&(t.value=o),Rt(t)}function ii(t,n){if(n){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=n;return}}t.textContent=n}var It=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function $t(t,n,a){var o=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?o?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":o?t.setProperty(n,a):typeof a!="number"||a===0||It.has(n)?n==="float"?t.cssFloat=a:t[n]=(""+a).trim():t[n]=a+"px"}function wi(t,n,a){if(n!=null&&typeof n!="object")throw Error(r(62));if(t=t.style,a!=null){for(var o in a)!a.hasOwnProperty(o)||n!=null&&n.hasOwnProperty(o)||(o.indexOf("--")===0?t.setProperty(o,""):o==="float"?t.cssFloat="":t[o]="");for(var u in n)o=n[u],n.hasOwnProperty(u)&&a[u]!==o&&$t(t,u,o)}else for(var f in n)n.hasOwnProperty(f)&&$t(t,f,n[f])}function Nt(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var zi=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Oa=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Ss(t){return Oa.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function ea(){}var Eu=null;function Tu(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Js=null,$s=null;function zp(t){var n=Na(t);if(n&&(t=n.stateNode)){var a=t[Rn]||null;e:switch(t=n.stateNode,n.type){case"input":if(Ve(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+Pt(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var o=a[n];if(o!==t&&o.form===t.form){var u=o[Rn]||null;if(!u)throw Error(r(90));Ve(o,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(n=0;n<a.length;n++)o=a[n],o.form===t.form&&Jt(o)}break e;case"textarea":ni(t,a.value,a.defaultValue);break e;case"select":n=a.value,n!=null&&vn(t,!!a.multiple,n,!1)}}}var Au=!1;function Hp(t,n,a){if(Au)return t(n,a);Au=!0;try{var o=t(n);return o}finally{if(Au=!1,(Js!==null||$s!==null)&&(ac(),Js&&(n=Js,t=$s,$s=Js=null,zp(n),t)))for(n=0;n<t.length;n++)zp(t[n])}}function ro(t,n){var a=t.stateNode;if(a===null)return null;var o=a[Rn]||null;if(o===null)return null;a=o[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(t=t.type,o=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!o;break e;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(r(231,n,typeof a));return a}var ta=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ru=!1;if(ta)try{var oo={};Object.defineProperty(oo,"passive",{get:function(){Ru=!0}}),window.addEventListener("test",oo,oo),window.removeEventListener("test",oo,oo)}catch{Ru=!1}var Pa=null,Cu=null,vl=null;function Gp(){if(vl)return vl;var t,n=Cu,a=n.length,o,u="value"in Pa?Pa.value:Pa.textContent,f=u.length;for(t=0;t<a&&n[t]===u[t];t++);var x=a-t;for(o=1;o<=x&&n[a-o]===u[f-o];o++);return vl=u.slice(t,1<o?1-o:void 0)}function xl(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function Sl(){return!0}function Vp(){return!1}function Xn(t){function n(a,o,u,f,x){this._reactName=a,this._targetInst=u,this.type=o,this.nativeEvent=f,this.target=x,this.currentTarget=null;for(var R in t)t.hasOwnProperty(R)&&(a=t[R],this[R]=a?a(f):f[R]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?Sl:Vp,this.isPropagationStopped=Vp,this}return v(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Sl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Sl)},persist:function(){},isPersistent:Sl}),n}var ys={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},yl=Xn(ys),lo=v({},ys,{view:0,detail:0}),Lx=Xn(lo),wu,Du,co,Ml=v({},lo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Nu,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==co&&(co&&t.type==="mousemove"?(wu=t.screenX-co.screenX,Du=t.screenY-co.screenY):Du=wu=0,co=t),wu)},movementY:function(t){return"movementY"in t?t.movementY:Du}}),kp=Xn(Ml),Ox=v({},Ml,{dataTransfer:0}),Px=Xn(Ox),Ix=v({},lo,{relatedTarget:0}),Uu=Xn(Ix),Fx=v({},ys,{animationName:0,elapsedTime:0,pseudoElement:0}),Bx=Xn(Fx),zx=v({},ys,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Hx=Xn(zx),Gx=v({},ys,{data:0}),Xp=Xn(Gx),Vx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},kx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Xx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function jx(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=Xx[t])?!!n[t]:!1}function Nu(){return jx}var Wx=v({},lo,{key:function(t){if(t.key){var n=Vx[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=xl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?kx[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Nu,charCode:function(t){return t.type==="keypress"?xl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?xl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),qx=Xn(Wx),Yx=v({},Ml,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),jp=Xn(Yx),Zx=v({},lo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Nu}),Kx=Xn(Zx),Qx=v({},ys,{propertyName:0,elapsedTime:0,pseudoElement:0}),Jx=Xn(Qx),$x=v({},Ml,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),eS=Xn($x),tS=v({},ys,{newState:0,oldState:0}),nS=Xn(tS),iS=[9,13,27,32],Lu=ta&&"CompositionEvent"in window,uo=null;ta&&"documentMode"in document&&(uo=document.documentMode);var aS=ta&&"TextEvent"in window&&!uo,Wp=ta&&(!Lu||uo&&8<uo&&11>=uo),qp=" ",Yp=!1;function Zp(t,n){switch(t){case"keyup":return iS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Kp(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var er=!1;function sS(t,n){switch(t){case"compositionend":return Kp(n);case"keypress":return n.which!==32?null:(Yp=!0,qp);case"textInput":return t=n.data,t===qp&&Yp?null:t;default:return null}}function rS(t,n){if(er)return t==="compositionend"||!Lu&&Zp(t,n)?(t=Gp(),vl=Cu=Pa=null,er=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Wp&&n.locale!=="ko"?null:n.data;default:return null}}var oS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Qp(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!oS[t.type]:n==="textarea"}function Jp(t,n,a,o){Js?$s?$s.push(o):$s=[o]:Js=o,n=fc(n,"onChange"),0<n.length&&(a=new yl("onChange","change",null,a,o),t.push({event:a,listeners:n}))}var fo=null,ho=null;function lS(t){Og(t,0)}function bl(t){var n=xs(t);if(Jt(n))return t}function $p(t,n){if(t==="change")return n}var em=!1;if(ta){var Ou;if(ta){var Pu="oninput"in document;if(!Pu){var tm=document.createElement("div");tm.setAttribute("oninput","return;"),Pu=typeof tm.oninput=="function"}Ou=Pu}else Ou=!1;em=Ou&&(!document.documentMode||9<document.documentMode)}function nm(){fo&&(fo.detachEvent("onpropertychange",im),ho=fo=null)}function im(t){if(t.propertyName==="value"&&bl(ho)){var n=[];Jp(n,ho,t,Tu(t)),Hp(lS,n)}}function cS(t,n,a){t==="focusin"?(nm(),fo=n,ho=a,fo.attachEvent("onpropertychange",im)):t==="focusout"&&nm()}function uS(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return bl(ho)}function fS(t,n){if(t==="click")return bl(n)}function hS(t,n){if(t==="input"||t==="change")return bl(n)}function dS(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var ai=typeof Object.is=="function"?Object.is:dS;function po(t,n){if(ai(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var a=Object.keys(t),o=Object.keys(n);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var u=a[o];if(!An.call(n,u)||!ai(t[u],n[u]))return!1}return!0}function am(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function sm(t,n){var a=am(t);t=0;for(var o;a;){if(a.nodeType===3){if(o=t+a.textContent.length,t<=n&&o>=n)return{node:a,offset:n-t};t=o}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=am(a)}}function rm(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?rm(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function om(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=Wt(t.document);n instanceof t.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)t=n.contentWindow;else break;n=Wt(t.document)}return n}function Iu(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var pS=ta&&"documentMode"in document&&11>=document.documentMode,tr=null,Fu=null,mo=null,Bu=!1;function lm(t,n,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Bu||tr==null||tr!==Wt(o)||(o=tr,"selectionStart"in o&&Iu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),mo&&po(mo,o)||(mo=o,o=fc(Fu,"onSelect"),0<o.length&&(n=new yl("onSelect","select",null,n,a),t.push({event:n,listeners:o}),n.target=tr)))}function Ms(t,n){var a={};return a[t.toLowerCase()]=n.toLowerCase(),a["Webkit"+t]="webkit"+n,a["Moz"+t]="moz"+n,a}var nr={animationend:Ms("Animation","AnimationEnd"),animationiteration:Ms("Animation","AnimationIteration"),animationstart:Ms("Animation","AnimationStart"),transitionrun:Ms("Transition","TransitionRun"),transitionstart:Ms("Transition","TransitionStart"),transitioncancel:Ms("Transition","TransitionCancel"),transitionend:Ms("Transition","TransitionEnd")},zu={},cm={};ta&&(cm=document.createElement("div").style,"AnimationEvent"in window||(delete nr.animationend.animation,delete nr.animationiteration.animation,delete nr.animationstart.animation),"TransitionEvent"in window||delete nr.transitionend.transition);function bs(t){if(zu[t])return zu[t];if(!nr[t])return t;var n=nr[t],a;for(a in n)if(n.hasOwnProperty(a)&&a in cm)return zu[t]=n[a];return t}var um=bs("animationend"),fm=bs("animationiteration"),hm=bs("animationstart"),mS=bs("transitionrun"),gS=bs("transitionstart"),_S=bs("transitioncancel"),dm=bs("transitionend"),pm=new Map,Hu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Hu.push("scrollEnd");function Di(t,n){pm.set(t,n),Y(n,[t])}var El=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},_i=[],ir=0,Gu=0;function Tl(){for(var t=ir,n=Gu=ir=0;n<t;){var a=_i[n];_i[n++]=null;var o=_i[n];_i[n++]=null;var u=_i[n];_i[n++]=null;var f=_i[n];if(_i[n++]=null,o!==null&&u!==null){var x=o.pending;x===null?u.next=u:(u.next=x.next,x.next=u),o.pending=u}f!==0&&mm(a,u,f)}}function Al(t,n,a,o){_i[ir++]=t,_i[ir++]=n,_i[ir++]=a,_i[ir++]=o,Gu|=o,t.lanes|=o,t=t.alternate,t!==null&&(t.lanes|=o)}function Vu(t,n,a,o){return Al(t,n,a,o),Rl(t)}function Es(t,n){return Al(t,null,null,n),Rl(t)}function mm(t,n,a){t.lanes|=a;var o=t.alternate;o!==null&&(o.lanes|=a);for(var u=!1,f=t.return;f!==null;)f.childLanes|=a,o=f.alternate,o!==null&&(o.childLanes|=a),f.tag===22&&(t=f.stateNode,t===null||t._visibility&1||(u=!0)),t=f,f=f.return;return t.tag===3?(f=t.stateNode,u&&n!==null&&(u=31-Fe(a),t=f.hiddenUpdates,o=t[u],o===null?t[u]=[n]:o.push(n),n.lane=a|536870912),f):null}function Rl(t){if(50<Fo)throw Fo=0,Jf=null,Error(r(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var ar={};function vS(t,n,a,o){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function si(t,n,a,o){return new vS(t,n,a,o)}function ku(t){return t=t.prototype,!(!t||!t.isReactComponent)}function na(t,n){var a=t.alternate;return a===null?(a=si(t.tag,n,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=n,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&65011712,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,n=t.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function gm(t,n){t.flags&=65011714;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,n=a.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function Cl(t,n,a,o,u,f){var x=0;if(o=t,typeof t=="function")ku(t)&&(x=1);else if(typeof t=="string")x=by(t,a,Ae.current)?26:t==="html"||t==="head"||t==="body"?27:5;else e:switch(t){case B:return t=si(31,a,n,u),t.elementType=B,t.lanes=f,t;case C:return Ts(a.children,u,f,n);case y:x=8,u|=24;break;case S:return t=si(12,a,n,u|2),t.elementType=S,t.lanes=f,t;case V:return t=si(13,a,n,u),t.elementType=V,t.lanes=f,t;case N:return t=si(19,a,n,u),t.elementType=N,t.lanes=f,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case L:x=10;break e;case w:x=9;break e;case I:x=11;break e;case O:x=14;break e;case T:x=16,o=null;break e}x=29,a=Error(r(130,t===null?"null":typeof t,"")),o=null}return n=si(x,a,n,u),n.elementType=t,n.type=o,n.lanes=f,n}function Ts(t,n,a,o){return t=si(7,t,o,n),t.lanes=a,t}function Xu(t,n,a){return t=si(6,t,null,n),t.lanes=a,t}function _m(t){var n=si(18,null,null,0);return n.stateNode=t,n}function ju(t,n,a){return n=si(4,t.children!==null?t.children:[],t.key,n),n.lanes=a,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var vm=new WeakMap;function vi(t,n){if(typeof t=="object"&&t!==null){var a=vm.get(t);return a!==void 0?a:(n={value:t,source:n,stack:Yt(n)},vm.set(t,n),n)}return{value:t,source:n,stack:Yt(n)}}var sr=[],rr=0,wl=null,go=0,xi=[],Si=0,Ia=null,Hi=1,Gi="";function ia(t,n){sr[rr++]=go,sr[rr++]=wl,wl=t,go=n}function xm(t,n,a){xi[Si++]=Hi,xi[Si++]=Gi,xi[Si++]=Ia,Ia=t;var o=Hi;t=Gi;var u=32-Fe(o)-1;o&=~(1<<u),a+=1;var f=32-Fe(n)+u;if(30<f){var x=u-u%5;f=(o&(1<<x)-1).toString(32),o>>=x,u-=x,Hi=1<<32-Fe(n)+u|a<<u|o,Gi=f+t}else Hi=1<<f|a<<u|o,Gi=t}function Wu(t){t.return!==null&&(ia(t,1),xm(t,1,0))}function qu(t){for(;t===wl;)wl=sr[--rr],sr[rr]=null,go=sr[--rr],sr[rr]=null;for(;t===Ia;)Ia=xi[--Si],xi[Si]=null,Gi=xi[--Si],xi[Si]=null,Hi=xi[--Si],xi[Si]=null}function Sm(t,n){xi[Si++]=Hi,xi[Si++]=Gi,xi[Si++]=Ia,Hi=n.id,Gi=n.overflow,Ia=t}var Cn=null,Zt=null,Et=!1,Fa=null,yi=!1,Yu=Error(r(519));function Ba(t){var n=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw _o(vi(n,t)),Yu}function ym(t){var n=t.stateNode,a=t.type,o=t.memoizedProps;switch(n[cn]=t,n[Rn]=o,a){case"dialog":St("cancel",n),St("close",n);break;case"iframe":case"object":case"embed":St("load",n);break;case"video":case"audio":for(a=0;a<zo.length;a++)St(zo[a],n);break;case"source":St("error",n);break;case"img":case"image":case"link":St("error",n),St("load",n);break;case"details":St("toggle",n);break;case"input":St("invalid",n),Pn(n,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":St("invalid",n);break;case"textarea":St("invalid",n),Ci(n,o.value,o.defaultValue,o.children)}a=o.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||o.suppressHydrationWarning===!0||Bg(n.textContent,a)?(o.popover!=null&&(St("beforetoggle",n),St("toggle",n)),o.onScroll!=null&&St("scroll",n),o.onScrollEnd!=null&&St("scrollend",n),o.onClick!=null&&(n.onclick=ea),n=!0):n=!1,n||Ba(t,!0)}function Mm(t){for(Cn=t.return;Cn;)switch(Cn.tag){case 5:case 31:case 13:yi=!1;return;case 27:case 3:yi=!0;return;default:Cn=Cn.return}}function or(t){if(t!==Cn)return!1;if(!Et)return Mm(t),Et=!0,!1;var n=t.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||dh(t.type,t.memoizedProps)),a=!a),a&&Zt&&Ba(t),Mm(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));Zt=qg(t)}else if(n===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));Zt=qg(t)}else n===27?(n=Zt,Ja(t.type)?(t=vh,vh=null,Zt=t):Zt=n):Zt=Cn?bi(t.stateNode.nextSibling):null;return!0}function As(){Zt=Cn=null,Et=!1}function Zu(){var t=Fa;return t!==null&&(Yn===null?Yn=t:Yn.push.apply(Yn,t),Fa=null),t}function _o(t){Fa===null?Fa=[t]:Fa.push(t)}var Ku=F(null),Rs=null,aa=null;function za(t,n,a){Se(Ku,n._currentValue),n._currentValue=a}function sa(t){t._currentValue=Ku.current,q(Ku)}function Qu(t,n,a){for(;t!==null;){var o=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,o!==null&&(o.childLanes|=n)):o!==null&&(o.childLanes&n)!==n&&(o.childLanes|=n),t===a)break;t=t.return}}function Ju(t,n,a,o){var u=t.child;for(u!==null&&(u.return=t);u!==null;){var f=u.dependencies;if(f!==null){var x=u.child;f=f.firstContext;e:for(;f!==null;){var R=f;f=u;for(var G=0;G<n.length;G++)if(R.context===n[G]){f.lanes|=a,R=f.alternate,R!==null&&(R.lanes|=a),Qu(f.return,a,t),o||(x=null);break e}f=R.next}}else if(u.tag===18){if(x=u.return,x===null)throw Error(r(341));x.lanes|=a,f=x.alternate,f!==null&&(f.lanes|=a),Qu(x,a,t),x=null}else x=u.child;if(x!==null)x.return=u;else for(x=u;x!==null;){if(x===t){x=null;break}if(u=x.sibling,u!==null){u.return=x.return,x=u;break}x=x.return}u=x}}function lr(t,n,a,o){t=null;for(var u=n,f=!1;u!==null;){if(!f){if((u.flags&524288)!==0)f=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var x=u.alternate;if(x===null)throw Error(r(387));if(x=x.memoizedProps,x!==null){var R=u.type;ai(u.pendingProps.value,x.value)||(t!==null?t.push(R):t=[R])}}else if(u===Me.current){if(x=u.alternate,x===null)throw Error(r(387));x.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(t!==null?t.push(Xo):t=[Xo])}u=u.return}t!==null&&Ju(n,t,a,o),n.flags|=262144}function Dl(t){for(t=t.firstContext;t!==null;){if(!ai(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function Cs(t){Rs=t,aa=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function wn(t){return bm(Rs,t)}function Ul(t,n){return Rs===null&&Cs(t),bm(t,n)}function bm(t,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},aa===null){if(t===null)throw Error(r(308));aa=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else aa=aa.next=n;return a}var xS=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(a,o){t.push(o)}};this.abort=function(){n.aborted=!0,t.forEach(function(a){return a()})}},SS=s.unstable_scheduleCallback,yS=s.unstable_NormalPriority,dn={$$typeof:L,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function $u(){return{controller:new xS,data:new Map,refCount:0}}function vo(t){t.refCount--,t.refCount===0&&SS(yS,function(){t.controller.abort()})}var xo=null,ef=0,cr=0,ur=null;function MS(t,n){if(xo===null){var a=xo=[];ef=0,cr=ah(),ur={status:"pending",value:void 0,then:function(o){a.push(o)}}}return ef++,n.then(Em,Em),n}function Em(){if(--ef===0&&xo!==null){ur!==null&&(ur.status="fulfilled");var t=xo;xo=null,cr=0,ur=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function bS(t,n){var a=[],o={status:"pending",value:null,reason:null,then:function(u){a.push(u)}};return t.then(function(){o.status="fulfilled",o.value=n;for(var u=0;u<a.length;u++)(0,a[u])(n)},function(u){for(o.status="rejected",o.reason=u,u=0;u<a.length;u++)(0,a[u])(void 0)}),o}var Tm=P.S;P.S=function(t,n){lg=De(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&MS(t,n),Tm!==null&&Tm(t,n)};var ws=F(null);function tf(){var t=ws.current;return t!==null?t:qt.pooledCache}function Nl(t,n){n===null?Se(ws,ws.current):Se(ws,n.pool)}function Am(){var t=tf();return t===null?null:{parent:dn._currentValue,pool:t}}var fr=Error(r(460)),nf=Error(r(474)),Ll=Error(r(542)),Ol={then:function(){}};function Rm(t){return t=t.status,t==="fulfilled"||t==="rejected"}function Cm(t,n,a){switch(a=t[a],a===void 0?t.push(n):a!==n&&(n.then(ea,ea),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Dm(t),t;default:if(typeof n.status=="string")n.then(ea,ea);else{if(t=qt,t!==null&&100<t.shellSuspendCounter)throw Error(r(482));t=n,t.status="pending",t.then(function(o){if(n.status==="pending"){var u=n;u.status="fulfilled",u.value=o}},function(o){if(n.status==="pending"){var u=n;u.status="rejected",u.reason=o}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Dm(t),t}throw Us=n,fr}}function Ds(t){try{var n=t._init;return n(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Us=a,fr):a}}var Us=null;function wm(){if(Us===null)throw Error(r(459));var t=Us;return Us=null,t}function Dm(t){if(t===fr||t===Ll)throw Error(r(483))}var hr=null,So=0;function Pl(t){var n=So;return So+=1,hr===null&&(hr=[]),Cm(hr,t,n)}function yo(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function Il(t,n){throw n.$$typeof===g?Error(r(525)):(t=Object.prototype.toString.call(n),Error(r(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function Um(t){function n(J,X){if(t){var ie=J.deletions;ie===null?(J.deletions=[X],J.flags|=16):ie.push(X)}}function a(J,X){if(!t)return null;for(;X!==null;)n(J,X),X=X.sibling;return null}function o(J){for(var X=new Map;J!==null;)J.key!==null?X.set(J.key,J):X.set(J.index,J),J=J.sibling;return X}function u(J,X){return J=na(J,X),J.index=0,J.sibling=null,J}function f(J,X,ie){return J.index=ie,t?(ie=J.alternate,ie!==null?(ie=ie.index,ie<X?(J.flags|=67108866,X):ie):(J.flags|=67108866,X)):(J.flags|=1048576,X)}function x(J){return t&&J.alternate===null&&(J.flags|=67108866),J}function R(J,X,ie,_e){return X===null||X.tag!==6?(X=Xu(ie,J.mode,_e),X.return=J,X):(X=u(X,ie),X.return=J,X)}function G(J,X,ie,_e){var $e=ie.type;return $e===C?me(J,X,ie.props.children,_e,ie.key):X!==null&&(X.elementType===$e||typeof $e=="object"&&$e!==null&&$e.$$typeof===T&&Ds($e)===X.type)?(X=u(X,ie.props),yo(X,ie),X.return=J,X):(X=Cl(ie.type,ie.key,ie.props,null,J.mode,_e),yo(X,ie),X.return=J,X)}function ae(J,X,ie,_e){return X===null||X.tag!==4||X.stateNode.containerInfo!==ie.containerInfo||X.stateNode.implementation!==ie.implementation?(X=ju(ie,J.mode,_e),X.return=J,X):(X=u(X,ie.children||[]),X.return=J,X)}function me(J,X,ie,_e,$e){return X===null||X.tag!==7?(X=Ts(ie,J.mode,_e,$e),X.return=J,X):(X=u(X,ie),X.return=J,X)}function xe(J,X,ie){if(typeof X=="string"&&X!==""||typeof X=="number"||typeof X=="bigint")return X=Xu(""+X,J.mode,ie),X.return=J,X;if(typeof X=="object"&&X!==null){switch(X.$$typeof){case M:return ie=Cl(X.type,X.key,X.props,null,J.mode,ie),yo(ie,X),ie.return=J,ie;case E:return X=ju(X,J.mode,ie),X.return=J,X;case T:return X=Ds(X),xe(J,X,ie)}if(j(X)||Q(X))return X=Ts(X,J.mode,ie,null),X.return=J,X;if(typeof X.then=="function")return xe(J,Pl(X),ie);if(X.$$typeof===L)return xe(J,Ul(J,X),ie);Il(J,X)}return null}function ce(J,X,ie,_e){var $e=X!==null?X.key:null;if(typeof ie=="string"&&ie!==""||typeof ie=="number"||typeof ie=="bigint")return $e!==null?null:R(J,X,""+ie,_e);if(typeof ie=="object"&&ie!==null){switch(ie.$$typeof){case M:return ie.key===$e?G(J,X,ie,_e):null;case E:return ie.key===$e?ae(J,X,ie,_e):null;case T:return ie=Ds(ie),ce(J,X,ie,_e)}if(j(ie)||Q(ie))return $e!==null?null:me(J,X,ie,_e,null);if(typeof ie.then=="function")return ce(J,X,Pl(ie),_e);if(ie.$$typeof===L)return ce(J,X,Ul(J,ie),_e);Il(J,ie)}return null}function ue(J,X,ie,_e,$e){if(typeof _e=="string"&&_e!==""||typeof _e=="number"||typeof _e=="bigint")return J=J.get(ie)||null,R(X,J,""+_e,$e);if(typeof _e=="object"&&_e!==null){switch(_e.$$typeof){case M:return J=J.get(_e.key===null?ie:_e.key)||null,G(X,J,_e,$e);case E:return J=J.get(_e.key===null?ie:_e.key)||null,ae(X,J,_e,$e);case T:return _e=Ds(_e),ue(J,X,ie,_e,$e)}if(j(_e)||Q(_e))return J=J.get(ie)||null,me(X,J,_e,$e,null);if(typeof _e.then=="function")return ue(J,X,ie,Pl(_e),$e);if(_e.$$typeof===L)return ue(J,X,ie,Ul(X,_e),$e);Il(X,_e)}return null}function We(J,X,ie,_e){for(var $e=null,Ct=null,Ye=X,ft=X=0,bt=null;Ye!==null&&ft<ie.length;ft++){Ye.index>ft?(bt=Ye,Ye=null):bt=Ye.sibling;var wt=ce(J,Ye,ie[ft],_e);if(wt===null){Ye===null&&(Ye=bt);break}t&&Ye&&wt.alternate===null&&n(J,Ye),X=f(wt,X,ft),Ct===null?$e=wt:Ct.sibling=wt,Ct=wt,Ye=bt}if(ft===ie.length)return a(J,Ye),Et&&ia(J,ft),$e;if(Ye===null){for(;ft<ie.length;ft++)Ye=xe(J,ie[ft],_e),Ye!==null&&(X=f(Ye,X,ft),Ct===null?$e=Ye:Ct.sibling=Ye,Ct=Ye);return Et&&ia(J,ft),$e}for(Ye=o(Ye);ft<ie.length;ft++)bt=ue(Ye,J,ft,ie[ft],_e),bt!==null&&(t&&bt.alternate!==null&&Ye.delete(bt.key===null?ft:bt.key),X=f(bt,X,ft),Ct===null?$e=bt:Ct.sibling=bt,Ct=bt);return t&&Ye.forEach(function(is){return n(J,is)}),Et&&ia(J,ft),$e}function et(J,X,ie,_e){if(ie==null)throw Error(r(151));for(var $e=null,Ct=null,Ye=X,ft=X=0,bt=null,wt=ie.next();Ye!==null&&!wt.done;ft++,wt=ie.next()){Ye.index>ft?(bt=Ye,Ye=null):bt=Ye.sibling;var is=ce(J,Ye,wt.value,_e);if(is===null){Ye===null&&(Ye=bt);break}t&&Ye&&is.alternate===null&&n(J,Ye),X=f(is,X,ft),Ct===null?$e=is:Ct.sibling=is,Ct=is,Ye=bt}if(wt.done)return a(J,Ye),Et&&ia(J,ft),$e;if(Ye===null){for(;!wt.done;ft++,wt=ie.next())wt=xe(J,wt.value,_e),wt!==null&&(X=f(wt,X,ft),Ct===null?$e=wt:Ct.sibling=wt,Ct=wt);return Et&&ia(J,ft),$e}for(Ye=o(Ye);!wt.done;ft++,wt=ie.next())wt=ue(Ye,J,ft,wt.value,_e),wt!==null&&(t&&wt.alternate!==null&&Ye.delete(wt.key===null?ft:wt.key),X=f(wt,X,ft),Ct===null?$e=wt:Ct.sibling=wt,Ct=wt);return t&&Ye.forEach(function(Oy){return n(J,Oy)}),Et&&ia(J,ft),$e}function kt(J,X,ie,_e){if(typeof ie=="object"&&ie!==null&&ie.type===C&&ie.key===null&&(ie=ie.props.children),typeof ie=="object"&&ie!==null){switch(ie.$$typeof){case M:e:{for(var $e=ie.key;X!==null;){if(X.key===$e){if($e=ie.type,$e===C){if(X.tag===7){a(J,X.sibling),_e=u(X,ie.props.children),_e.return=J,J=_e;break e}}else if(X.elementType===$e||typeof $e=="object"&&$e!==null&&$e.$$typeof===T&&Ds($e)===X.type){a(J,X.sibling),_e=u(X,ie.props),yo(_e,ie),_e.return=J,J=_e;break e}a(J,X);break}else n(J,X);X=X.sibling}ie.type===C?(_e=Ts(ie.props.children,J.mode,_e,ie.key),_e.return=J,J=_e):(_e=Cl(ie.type,ie.key,ie.props,null,J.mode,_e),yo(_e,ie),_e.return=J,J=_e)}return x(J);case E:e:{for($e=ie.key;X!==null;){if(X.key===$e)if(X.tag===4&&X.stateNode.containerInfo===ie.containerInfo&&X.stateNode.implementation===ie.implementation){a(J,X.sibling),_e=u(X,ie.children||[]),_e.return=J,J=_e;break e}else{a(J,X);break}else n(J,X);X=X.sibling}_e=ju(ie,J.mode,_e),_e.return=J,J=_e}return x(J);case T:return ie=Ds(ie),kt(J,X,ie,_e)}if(j(ie))return We(J,X,ie,_e);if(Q(ie)){if($e=Q(ie),typeof $e!="function")throw Error(r(150));return ie=$e.call(ie),et(J,X,ie,_e)}if(typeof ie.then=="function")return kt(J,X,Pl(ie),_e);if(ie.$$typeof===L)return kt(J,X,Ul(J,ie),_e);Il(J,ie)}return typeof ie=="string"&&ie!==""||typeof ie=="number"||typeof ie=="bigint"?(ie=""+ie,X!==null&&X.tag===6?(a(J,X.sibling),_e=u(X,ie),_e.return=J,J=_e):(a(J,X),_e=Xu(ie,J.mode,_e),_e.return=J,J=_e),x(J)):a(J,X)}return function(J,X,ie,_e){try{So=0;var $e=kt(J,X,ie,_e);return hr=null,$e}catch(Ye){if(Ye===fr||Ye===Ll)throw Ye;var Ct=si(29,Ye,null,J.mode);return Ct.lanes=_e,Ct.return=J,Ct}}}var Ns=Um(!0),Nm=Um(!1),Ha=!1;function af(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function sf(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function Ga(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Va(t,n,a){var o=t.updateQueue;if(o===null)return null;if(o=o.shared,(Ut&2)!==0){var u=o.pending;return u===null?n.next=n:(n.next=u.next,u.next=n),o.pending=n,n=Rl(t),mm(t,null,a),n}return Al(t,o,n,a),Rl(t)}function Mo(t,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var o=n.lanes;o&=t.pendingLanes,a|=o,n.lanes=a,gi(t,a)}}function rf(t,n){var a=t.updateQueue,o=t.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var u=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var x={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?u=f=x:f=f.next=x,a=a.next}while(a!==null);f===null?u=f=n:f=f.next=n}else u=f=n;a={baseState:o.baseState,firstBaseUpdate:u,lastBaseUpdate:f,shared:o.shared,callbacks:o.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=n:t.next=n,a.lastBaseUpdate=n}var of=!1;function bo(){if(of){var t=ur;if(t!==null)throw t}}function Eo(t,n,a,o){of=!1;var u=t.updateQueue;Ha=!1;var f=u.firstBaseUpdate,x=u.lastBaseUpdate,R=u.shared.pending;if(R!==null){u.shared.pending=null;var G=R,ae=G.next;G.next=null,x===null?f=ae:x.next=ae,x=G;var me=t.alternate;me!==null&&(me=me.updateQueue,R=me.lastBaseUpdate,R!==x&&(R===null?me.firstBaseUpdate=ae:R.next=ae,me.lastBaseUpdate=G))}if(f!==null){var xe=u.baseState;x=0,me=ae=G=null,R=f;do{var ce=R.lane&-536870913,ue=ce!==R.lane;if(ue?(Mt&ce)===ce:(o&ce)===ce){ce!==0&&ce===cr&&(of=!0),me!==null&&(me=me.next={lane:0,tag:R.tag,payload:R.payload,callback:null,next:null});e:{var We=t,et=R;ce=n;var kt=a;switch(et.tag){case 1:if(We=et.payload,typeof We=="function"){xe=We.call(kt,xe,ce);break e}xe=We;break e;case 3:We.flags=We.flags&-65537|128;case 0:if(We=et.payload,ce=typeof We=="function"?We.call(kt,xe,ce):We,ce==null)break e;xe=v({},xe,ce);break e;case 2:Ha=!0}}ce=R.callback,ce!==null&&(t.flags|=64,ue&&(t.flags|=8192),ue=u.callbacks,ue===null?u.callbacks=[ce]:ue.push(ce))}else ue={lane:ce,tag:R.tag,payload:R.payload,callback:R.callback,next:null},me===null?(ae=me=ue,G=xe):me=me.next=ue,x|=ce;if(R=R.next,R===null){if(R=u.shared.pending,R===null)break;ue=R,R=ue.next,ue.next=null,u.lastBaseUpdate=ue,u.shared.pending=null}}while(!0);me===null&&(G=xe),u.baseState=G,u.firstBaseUpdate=ae,u.lastBaseUpdate=me,f===null&&(u.shared.lanes=0),qa|=x,t.lanes=x,t.memoizedState=xe}}function Lm(t,n){if(typeof t!="function")throw Error(r(191,t));t.call(n)}function Om(t,n){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)Lm(a[t],n)}var dr=F(null),Fl=F(0);function Pm(t,n){t=pa,Se(Fl,t),Se(dr,n),pa=t|n.baseLanes}function lf(){Se(Fl,pa),Se(dr,dr.current)}function cf(){pa=Fl.current,q(dr),q(Fl)}var ri=F(null),Mi=null;function ka(t){var n=t.alternate;Se(un,un.current&1),Se(ri,t),Mi===null&&(n===null||dr.current!==null||n.memoizedState!==null)&&(Mi=t)}function uf(t){Se(un,un.current),Se(ri,t),Mi===null&&(Mi=t)}function Im(t){t.tag===22?(Se(un,un.current),Se(ri,t),Mi===null&&(Mi=t)):Xa()}function Xa(){Se(un,un.current),Se(ri,ri.current)}function oi(t){q(ri),Mi===t&&(Mi=null),q(un)}var un=F(0);function Bl(t){for(var n=t;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||gh(a)||_h(a)))return n}else if(n.tag===19&&(n.memoizedProps.revealOrder==="forwards"||n.memoizedProps.revealOrder==="backwards"||n.memoizedProps.revealOrder==="unstable_legacy-backwards"||n.memoizedProps.revealOrder==="together")){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var ra=0,ct=null,Gt=null,pn=null,zl=!1,pr=!1,Ls=!1,Hl=0,To=0,mr=null,ES=0;function an(){throw Error(r(321))}function ff(t,n){if(n===null)return!1;for(var a=0;a<n.length&&a<t.length;a++)if(!ai(t[a],n[a]))return!1;return!0}function hf(t,n,a,o,u,f){return ra=f,ct=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,P.H=t===null||t.memoizedState===null?x0:Rf,Ls=!1,f=a(o,u),Ls=!1,pr&&(f=Bm(n,a,o,u)),Fm(t),f}function Fm(t){P.H=Co;var n=Gt!==null&&Gt.next!==null;if(ra=0,pn=Gt=ct=null,zl=!1,To=0,mr=null,n)throw Error(r(300));t===null||mn||(t=t.dependencies,t!==null&&Dl(t)&&(mn=!0))}function Bm(t,n,a,o){ct=t;var u=0;do{if(pr&&(mr=null),To=0,pr=!1,25<=u)throw Error(r(301));if(u+=1,pn=Gt=null,t.updateQueue!=null){var f=t.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}P.H=S0,f=n(a,o)}while(pr);return f}function TS(){var t=P.H,n=t.useState()[0];return n=typeof n.then=="function"?Ao(n):n,t=t.useState()[0],(Gt!==null?Gt.memoizedState:null)!==t&&(ct.flags|=1024),n}function df(){var t=Hl!==0;return Hl=0,t}function pf(t,n,a){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~a}function mf(t){if(zl){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}zl=!1}ra=0,pn=Gt=ct=null,pr=!1,To=Hl=0,mr=null}function Hn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return pn===null?ct.memoizedState=pn=t:pn=pn.next=t,pn}function fn(){if(Gt===null){var t=ct.alternate;t=t!==null?t.memoizedState:null}else t=Gt.next;var n=pn===null?ct.memoizedState:pn.next;if(n!==null)pn=n,Gt=t;else{if(t===null)throw ct.alternate===null?Error(r(467)):Error(r(310));Gt=t,t={memoizedState:Gt.memoizedState,baseState:Gt.baseState,baseQueue:Gt.baseQueue,queue:Gt.queue,next:null},pn===null?ct.memoizedState=pn=t:pn=pn.next=t}return pn}function Gl(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Ao(t){var n=To;return To+=1,mr===null&&(mr=[]),t=Cm(mr,t,n),n=ct,(pn===null?n.memoizedState:pn.next)===null&&(n=n.alternate,P.H=n===null||n.memoizedState===null?x0:Rf),t}function Vl(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return Ao(t);if(t.$$typeof===L)return wn(t)}throw Error(r(438,String(t)))}function gf(t){var n=null,a=ct.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var o=ct.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(n={data:o.data.map(function(u){return u.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=Gl(),ct.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(t),o=0;o<t;o++)a[o]=Z;return n.index++,a}function oa(t,n){return typeof n=="function"?n(t):n}function kl(t){var n=fn();return _f(n,Gt,t)}function _f(t,n,a){var o=t.queue;if(o===null)throw Error(r(311));o.lastRenderedReducer=a;var u=t.baseQueue,f=o.pending;if(f!==null){if(u!==null){var x=u.next;u.next=f.next,f.next=x}n.baseQueue=u=f,o.pending=null}if(f=t.baseState,u===null)t.memoizedState=f;else{n=u.next;var R=x=null,G=null,ae=n,me=!1;do{var xe=ae.lane&-536870913;if(xe!==ae.lane?(Mt&xe)===xe:(ra&xe)===xe){var ce=ae.revertLane;if(ce===0)G!==null&&(G=G.next={lane:0,revertLane:0,gesture:null,action:ae.action,hasEagerState:ae.hasEagerState,eagerState:ae.eagerState,next:null}),xe===cr&&(me=!0);else if((ra&ce)===ce){ae=ae.next,ce===cr&&(me=!0);continue}else xe={lane:0,revertLane:ae.revertLane,gesture:null,action:ae.action,hasEagerState:ae.hasEagerState,eagerState:ae.eagerState,next:null},G===null?(R=G=xe,x=f):G=G.next=xe,ct.lanes|=ce,qa|=ce;xe=ae.action,Ls&&a(f,xe),f=ae.hasEagerState?ae.eagerState:a(f,xe)}else ce={lane:xe,revertLane:ae.revertLane,gesture:ae.gesture,action:ae.action,hasEagerState:ae.hasEagerState,eagerState:ae.eagerState,next:null},G===null?(R=G=ce,x=f):G=G.next=ce,ct.lanes|=xe,qa|=xe;ae=ae.next}while(ae!==null&&ae!==n);if(G===null?x=f:G.next=R,!ai(f,t.memoizedState)&&(mn=!0,me&&(a=ur,a!==null)))throw a;t.memoizedState=f,t.baseState=x,t.baseQueue=G,o.lastRenderedState=f}return u===null&&(o.lanes=0),[t.memoizedState,o.dispatch]}function vf(t){var n=fn(),a=n.queue;if(a===null)throw Error(r(311));a.lastRenderedReducer=t;var o=a.dispatch,u=a.pending,f=n.memoizedState;if(u!==null){a.pending=null;var x=u=u.next;do f=t(f,x.action),x=x.next;while(x!==u);ai(f,n.memoizedState)||(mn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,o]}function zm(t,n,a){var o=ct,u=fn(),f=Et;if(f){if(a===void 0)throw Error(r(407));a=a()}else a=n();var x=!ai((Gt||u).memoizedState,a);if(x&&(u.memoizedState=a,mn=!0),u=u.queue,yf(Vm.bind(null,o,u,t),[t]),u.getSnapshot!==n||x||pn!==null&&pn.memoizedState.tag&1){if(o.flags|=2048,gr(9,{destroy:void 0},Gm.bind(null,o,u,a,n),null),qt===null)throw Error(r(349));f||(ra&127)!==0||Hm(o,n,a)}return a}function Hm(t,n,a){t.flags|=16384,t={getSnapshot:n,value:a},n=ct.updateQueue,n===null?(n=Gl(),ct.updateQueue=n,n.stores=[t]):(a=n.stores,a===null?n.stores=[t]:a.push(t))}function Gm(t,n,a,o){n.value=a,n.getSnapshot=o,km(n)&&Xm(t)}function Vm(t,n,a){return a(function(){km(n)&&Xm(t)})}function km(t){var n=t.getSnapshot;t=t.value;try{var a=n();return!ai(t,a)}catch{return!0}}function Xm(t){var n=Es(t,2);n!==null&&Zn(n,t,2)}function xf(t){var n=Hn();if(typeof t=="function"){var a=t;if(t=a(),Ls){Ie(!0);try{a()}finally{Ie(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:oa,lastRenderedState:t},n}function jm(t,n,a,o){return t.baseState=a,_f(t,Gt,typeof o=="function"?o:oa)}function AS(t,n,a,o,u){if(Wl(t))throw Error(r(485));if(t=n.action,t!==null){var f={payload:u,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(x){f.listeners.push(x)}};P.T!==null?a(!0):f.isTransition=!1,o(f),a=n.pending,a===null?(f.next=n.pending=f,Wm(n,f)):(f.next=a.next,n.pending=a.next=f)}}function Wm(t,n){var a=n.action,o=n.payload,u=t.state;if(n.isTransition){var f=P.T,x={};P.T=x;try{var R=a(u,o),G=P.S;G!==null&&G(x,R),qm(t,n,R)}catch(ae){Sf(t,n,ae)}finally{f!==null&&x.types!==null&&(f.types=x.types),P.T=f}}else try{f=a(u,o),qm(t,n,f)}catch(ae){Sf(t,n,ae)}}function qm(t,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(o){Ym(t,n,o)},function(o){return Sf(t,n,o)}):Ym(t,n,a)}function Ym(t,n,a){n.status="fulfilled",n.value=a,Zm(n),t.state=a,n=t.pending,n!==null&&(a=n.next,a===n?t.pending=null:(a=a.next,n.next=a,Wm(t,a)))}function Sf(t,n,a){var o=t.pending;if(t.pending=null,o!==null){o=o.next;do n.status="rejected",n.reason=a,Zm(n),n=n.next;while(n!==o)}t.action=null}function Zm(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function Km(t,n){return n}function Qm(t,n){if(Et){var a=qt.formState;if(a!==null){e:{var o=ct;if(Et){if(Zt){t:{for(var u=Zt,f=yi;u.nodeType!==8;){if(!f){u=null;break t}if(u=bi(u.nextSibling),u===null){u=null;break t}}f=u.data,u=f==="F!"||f==="F"?u:null}if(u){Zt=bi(u.nextSibling),o=u.data==="F!";break e}}Ba(o)}o=!1}o&&(n=a[0])}}return a=Hn(),a.memoizedState=a.baseState=n,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Km,lastRenderedState:n},a.queue=o,a=g0.bind(null,ct,o),o.dispatch=a,o=xf(!1),f=Af.bind(null,ct,!1,o.queue),o=Hn(),u={state:n,dispatch:null,action:t,pending:null},o.queue=u,a=AS.bind(null,ct,u,f,a),u.dispatch=a,o.memoizedState=t,[n,a,!1]}function Jm(t){var n=fn();return $m(n,Gt,t)}function $m(t,n,a){if(n=_f(t,n,Km)[0],t=kl(oa)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var o=Ao(n)}catch(x){throw x===fr?Ll:x}else o=n;n=fn();var u=n.queue,f=u.dispatch;return a!==n.memoizedState&&(ct.flags|=2048,gr(9,{destroy:void 0},RS.bind(null,u,a),null)),[o,f,t]}function RS(t,n){t.action=n}function e0(t){var n=fn(),a=Gt;if(a!==null)return $m(n,a,t);fn(),n=n.memoizedState,a=fn();var o=a.queue.dispatch;return a.memoizedState=t,[n,o,!1]}function gr(t,n,a,o){return t={tag:t,create:a,deps:o,inst:n,next:null},n=ct.updateQueue,n===null&&(n=Gl(),ct.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=t.next=t:(o=a.next,a.next=t,t.next=o,n.lastEffect=t),t}function t0(){return fn().memoizedState}function Xl(t,n,a,o){var u=Hn();ct.flags|=t,u.memoizedState=gr(1|n,{destroy:void 0},a,o===void 0?null:o)}function jl(t,n,a,o){var u=fn();o=o===void 0?null:o;var f=u.memoizedState.inst;Gt!==null&&o!==null&&ff(o,Gt.memoizedState.deps)?u.memoizedState=gr(n,f,a,o):(ct.flags|=t,u.memoizedState=gr(1|n,f,a,o))}function n0(t,n){Xl(8390656,8,t,n)}function yf(t,n){jl(2048,8,t,n)}function CS(t){ct.flags|=4;var n=ct.updateQueue;if(n===null)n=Gl(),ct.updateQueue=n,n.events=[t];else{var a=n.events;a===null?n.events=[t]:a.push(t)}}function i0(t){var n=fn().memoizedState;return CS({ref:n,nextImpl:t}),function(){if((Ut&2)!==0)throw Error(r(440));return n.impl.apply(void 0,arguments)}}function a0(t,n){return jl(4,2,t,n)}function s0(t,n){return jl(4,4,t,n)}function r0(t,n){if(typeof n=="function"){t=t();var a=n(t);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function o0(t,n,a){a=a!=null?a.concat([t]):null,jl(4,4,r0.bind(null,n,t),a)}function Mf(){}function l0(t,n){var a=fn();n=n===void 0?null:n;var o=a.memoizedState;return n!==null&&ff(n,o[1])?o[0]:(a.memoizedState=[t,n],t)}function c0(t,n){var a=fn();n=n===void 0?null:n;var o=a.memoizedState;if(n!==null&&ff(n,o[1]))return o[0];if(o=t(),Ls){Ie(!0);try{t()}finally{Ie(!1)}}return a.memoizedState=[o,n],o}function bf(t,n,a){return a===void 0||(ra&1073741824)!==0&&(Mt&261930)===0?t.memoizedState=n:(t.memoizedState=a,t=ug(),ct.lanes|=t,qa|=t,a)}function u0(t,n,a,o){return ai(a,n)?a:dr.current!==null?(t=bf(t,a,o),ai(t,n)||(mn=!0),t):(ra&42)===0||(ra&1073741824)!==0&&(Mt&261930)===0?(mn=!0,t.memoizedState=a):(t=ug(),ct.lanes|=t,qa|=t,n)}function f0(t,n,a,o,u){var f=H.p;H.p=f!==0&&8>f?f:8;var x=P.T,R={};P.T=R,Af(t,!1,n,a);try{var G=u(),ae=P.S;if(ae!==null&&ae(R,G),G!==null&&typeof G=="object"&&typeof G.then=="function"){var me=bS(G,o);Ro(t,n,me,ui(t))}else Ro(t,n,o,ui(t))}catch(xe){Ro(t,n,{then:function(){},status:"rejected",reason:xe},ui())}finally{H.p=f,x!==null&&R.types!==null&&(x.types=R.types),P.T=x}}function wS(){}function Ef(t,n,a,o){if(t.tag!==5)throw Error(r(476));var u=h0(t).queue;f0(t,u,n,ne,a===null?wS:function(){return d0(t),a(o)})}function h0(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:ne,baseState:ne,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:oa,lastRenderedState:ne},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:oa,lastRenderedState:a},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function d0(t){var n=h0(t);n.next===null&&(n=t.alternate.memoizedState),Ro(t,n.next.queue,{},ui())}function Tf(){return wn(Xo)}function p0(){return fn().memoizedState}function m0(){return fn().memoizedState}function DS(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var a=ui();t=Ga(a);var o=Va(n,t,a);o!==null&&(Zn(o,n,a),Mo(o,n,a)),n={cache:$u()},t.payload=n;return}n=n.return}}function US(t,n,a){var o=ui();a={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Wl(t)?_0(n,a):(a=Vu(t,n,a,o),a!==null&&(Zn(a,t,o),v0(a,n,o)))}function g0(t,n,a){var o=ui();Ro(t,n,a,o)}function Ro(t,n,a,o){var u={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Wl(t))_0(n,u);else{var f=t.alternate;if(t.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var x=n.lastRenderedState,R=f(x,a);if(u.hasEagerState=!0,u.eagerState=R,ai(R,x))return Al(t,n,u,0),qt===null&&Tl(),!1}catch{}if(a=Vu(t,n,u,o),a!==null)return Zn(a,t,o),v0(a,n,o),!0}return!1}function Af(t,n,a,o){if(o={lane:2,revertLane:ah(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},Wl(t)){if(n)throw Error(r(479))}else n=Vu(t,a,o,2),n!==null&&Zn(n,t,2)}function Wl(t){var n=t.alternate;return t===ct||n!==null&&n===ct}function _0(t,n){pr=zl=!0;var a=t.pending;a===null?n.next=n:(n.next=a.next,a.next=n),t.pending=n}function v0(t,n,a){if((a&4194048)!==0){var o=n.lanes;o&=t.pendingLanes,a|=o,n.lanes=a,gi(t,a)}}var Co={readContext:wn,use:Vl,useCallback:an,useContext:an,useEffect:an,useImperativeHandle:an,useLayoutEffect:an,useInsertionEffect:an,useMemo:an,useReducer:an,useRef:an,useState:an,useDebugValue:an,useDeferredValue:an,useTransition:an,useSyncExternalStore:an,useId:an,useHostTransitionStatus:an,useFormState:an,useActionState:an,useOptimistic:an,useMemoCache:an,useCacheRefresh:an};Co.useEffectEvent=an;var x0={readContext:wn,use:Vl,useCallback:function(t,n){return Hn().memoizedState=[t,n===void 0?null:n],t},useContext:wn,useEffect:n0,useImperativeHandle:function(t,n,a){a=a!=null?a.concat([t]):null,Xl(4194308,4,r0.bind(null,n,t),a)},useLayoutEffect:function(t,n){return Xl(4194308,4,t,n)},useInsertionEffect:function(t,n){Xl(4,2,t,n)},useMemo:function(t,n){var a=Hn();n=n===void 0?null:n;var o=t();if(Ls){Ie(!0);try{t()}finally{Ie(!1)}}return a.memoizedState=[o,n],o},useReducer:function(t,n,a){var o=Hn();if(a!==void 0){var u=a(n);if(Ls){Ie(!0);try{a(n)}finally{Ie(!1)}}}else u=n;return o.memoizedState=o.baseState=u,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:u},o.queue=t,t=t.dispatch=US.bind(null,ct,t),[o.memoizedState,t]},useRef:function(t){var n=Hn();return t={current:t},n.memoizedState=t},useState:function(t){t=xf(t);var n=t.queue,a=g0.bind(null,ct,n);return n.dispatch=a,[t.memoizedState,a]},useDebugValue:Mf,useDeferredValue:function(t,n){var a=Hn();return bf(a,t,n)},useTransition:function(){var t=xf(!1);return t=f0.bind(null,ct,t.queue,!0,!1),Hn().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,a){var o=ct,u=Hn();if(Et){if(a===void 0)throw Error(r(407));a=a()}else{if(a=n(),qt===null)throw Error(r(349));(Mt&127)!==0||Hm(o,n,a)}u.memoizedState=a;var f={value:a,getSnapshot:n};return u.queue=f,n0(Vm.bind(null,o,f,t),[t]),o.flags|=2048,gr(9,{destroy:void 0},Gm.bind(null,o,f,a,n),null),a},useId:function(){var t=Hn(),n=qt.identifierPrefix;if(Et){var a=Gi,o=Hi;a=(o&~(1<<32-Fe(o)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Hl++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=ES++,n="_"+n+"r_"+a.toString(32)+"_";return t.memoizedState=n},useHostTransitionStatus:Tf,useFormState:Qm,useActionState:Qm,useOptimistic:function(t){var n=Hn();n.memoizedState=n.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=Af.bind(null,ct,!0,a),a.dispatch=n,[t,n]},useMemoCache:gf,useCacheRefresh:function(){return Hn().memoizedState=DS.bind(null,ct)},useEffectEvent:function(t){var n=Hn(),a={impl:t};return n.memoizedState=a,function(){if((Ut&2)!==0)throw Error(r(440));return a.impl.apply(void 0,arguments)}}},Rf={readContext:wn,use:Vl,useCallback:l0,useContext:wn,useEffect:yf,useImperativeHandle:o0,useInsertionEffect:a0,useLayoutEffect:s0,useMemo:c0,useReducer:kl,useRef:t0,useState:function(){return kl(oa)},useDebugValue:Mf,useDeferredValue:function(t,n){var a=fn();return u0(a,Gt.memoizedState,t,n)},useTransition:function(){var t=kl(oa)[0],n=fn().memoizedState;return[typeof t=="boolean"?t:Ao(t),n]},useSyncExternalStore:zm,useId:p0,useHostTransitionStatus:Tf,useFormState:Jm,useActionState:Jm,useOptimistic:function(t,n){var a=fn();return jm(a,Gt,t,n)},useMemoCache:gf,useCacheRefresh:m0};Rf.useEffectEvent=i0;var S0={readContext:wn,use:Vl,useCallback:l0,useContext:wn,useEffect:yf,useImperativeHandle:o0,useInsertionEffect:a0,useLayoutEffect:s0,useMemo:c0,useReducer:vf,useRef:t0,useState:function(){return vf(oa)},useDebugValue:Mf,useDeferredValue:function(t,n){var a=fn();return Gt===null?bf(a,t,n):u0(a,Gt.memoizedState,t,n)},useTransition:function(){var t=vf(oa)[0],n=fn().memoizedState;return[typeof t=="boolean"?t:Ao(t),n]},useSyncExternalStore:zm,useId:p0,useHostTransitionStatus:Tf,useFormState:e0,useActionState:e0,useOptimistic:function(t,n){var a=fn();return Gt!==null?jm(a,Gt,t,n):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:gf,useCacheRefresh:m0};S0.useEffectEvent=i0;function Cf(t,n,a,o){n=t.memoizedState,a=a(o,n),a=a==null?n:v({},n,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var wf={enqueueSetState:function(t,n,a){t=t._reactInternals;var o=ui(),u=Ga(o);u.payload=n,a!=null&&(u.callback=a),n=Va(t,u,o),n!==null&&(Zn(n,t,o),Mo(n,t,o))},enqueueReplaceState:function(t,n,a){t=t._reactInternals;var o=ui(),u=Ga(o);u.tag=1,u.payload=n,a!=null&&(u.callback=a),n=Va(t,u,o),n!==null&&(Zn(n,t,o),Mo(n,t,o))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var a=ui(),o=Ga(a);o.tag=2,n!=null&&(o.callback=n),n=Va(t,o,a),n!==null&&(Zn(n,t,a),Mo(n,t,a))}};function y0(t,n,a,o,u,f,x){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(o,f,x):n.prototype&&n.prototype.isPureReactComponent?!po(a,o)||!po(u,f):!0}function M0(t,n,a,o){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,o),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,o),n.state!==t&&wf.enqueueReplaceState(n,n.state,null)}function Os(t,n){var a=n;if("ref"in n){a={};for(var o in n)o!=="ref"&&(a[o]=n[o])}if(t=t.defaultProps){a===n&&(a=v({},a));for(var u in t)a[u]===void 0&&(a[u]=t[u])}return a}function b0(t){El(t)}function E0(t){console.error(t)}function T0(t){El(t)}function ql(t,n){try{var a=t.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(o){setTimeout(function(){throw o})}}function A0(t,n,a){try{var o=t.onCaughtError;o(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function Df(t,n,a){return a=Ga(a),a.tag=3,a.payload={element:null},a.callback=function(){ql(t,n)},a}function R0(t){return t=Ga(t),t.tag=3,t}function C0(t,n,a,o){var u=a.type.getDerivedStateFromError;if(typeof u=="function"){var f=o.value;t.payload=function(){return u(f)},t.callback=function(){A0(n,a,o)}}var x=a.stateNode;x!==null&&typeof x.componentDidCatch=="function"&&(t.callback=function(){A0(n,a,o),typeof u!="function"&&(Ya===null?Ya=new Set([this]):Ya.add(this));var R=o.stack;this.componentDidCatch(o.value,{componentStack:R!==null?R:""})})}function NS(t,n,a,o,u){if(a.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(n=a.alternate,n!==null&&lr(n,a,u,!0),a=ri.current,a!==null){switch(a.tag){case 31:case 13:return Mi===null?sc():a.alternate===null&&sn===0&&(sn=3),a.flags&=-257,a.flags|=65536,a.lanes=u,o===Ol?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([o]):n.add(o),th(t,o,u)),!1;case 22:return a.flags|=65536,o===Ol?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([o])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([o]):a.add(o)),th(t,o,u)),!1}throw Error(r(435,a.tag))}return th(t,o,u),sc(),!1}if(Et)return n=ri.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=u,o!==Yu&&(t=Error(r(422),{cause:o}),_o(vi(t,a)))):(o!==Yu&&(n=Error(r(423),{cause:o}),_o(vi(n,a))),t=t.current.alternate,t.flags|=65536,u&=-u,t.lanes|=u,o=vi(o,a),u=Df(t.stateNode,o,u),rf(t,u),sn!==4&&(sn=2)),!1;var f=Error(r(520),{cause:o});if(f=vi(f,a),Io===null?Io=[f]:Io.push(f),sn!==4&&(sn=2),n===null)return!0;o=vi(o,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,t=u&-u,a.lanes|=t,t=Df(a.stateNode,o,t),rf(a,t),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(Ya===null||!Ya.has(f))))return a.flags|=65536,u&=-u,a.lanes|=u,u=R0(u),C0(u,t,a,o),rf(a,u),!1}a=a.return}while(a!==null);return!1}var Uf=Error(r(461)),mn=!1;function Dn(t,n,a,o){n.child=t===null?Nm(n,null,a,o):Ns(n,t.child,a,o)}function w0(t,n,a,o,u){a=a.render;var f=n.ref;if("ref"in o){var x={};for(var R in o)R!=="ref"&&(x[R]=o[R])}else x=o;return Cs(n),o=hf(t,n,a,x,f,u),R=df(),t!==null&&!mn?(pf(t,n,u),la(t,n,u)):(Et&&R&&Wu(n),n.flags|=1,Dn(t,n,o,u),n.child)}function D0(t,n,a,o,u){if(t===null){var f=a.type;return typeof f=="function"&&!ku(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,U0(t,n,f,o,u)):(t=Cl(a.type,null,o,n,n.mode,u),t.ref=n.ref,t.return=n,n.child=t)}if(f=t.child,!zf(t,u)){var x=f.memoizedProps;if(a=a.compare,a=a!==null?a:po,a(x,o)&&t.ref===n.ref)return la(t,n,u)}return n.flags|=1,t=na(f,o),t.ref=n.ref,t.return=n,n.child=t}function U0(t,n,a,o,u){if(t!==null){var f=t.memoizedProps;if(po(f,o)&&t.ref===n.ref)if(mn=!1,n.pendingProps=o=f,zf(t,u))(t.flags&131072)!==0&&(mn=!0);else return n.lanes=t.lanes,la(t,n,u)}return Nf(t,n,a,o,u)}function N0(t,n,a,o){var u=o.children,f=t!==null?t.memoizedState:null;if(t===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,t!==null){for(o=n.child=t.child,u=0;o!==null;)u=u|o.lanes|o.childLanes,o=o.sibling;o=u&~f}else o=0,n.child=null;return L0(t,n,f,a,o)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&Nl(n,f!==null?f.cachePool:null),f!==null?Pm(n,f):lf(),Im(n);else return o=n.lanes=536870912,L0(t,n,f!==null?f.baseLanes|a:a,a,o)}else f!==null?(Nl(n,f.cachePool),Pm(n,f),Xa(),n.memoizedState=null):(t!==null&&Nl(n,null),lf(),Xa());return Dn(t,n,u,a),n.child}function wo(t,n){return t!==null&&t.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function L0(t,n,a,o,u){var f=tf();return f=f===null?null:{parent:dn._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},t!==null&&Nl(n,null),lf(),Im(n),t!==null&&lr(t,n,o,!0),n.childLanes=u,null}function Yl(t,n){return n=Kl({mode:n.mode,children:n.children},t.mode),n.ref=t.ref,t.child=n,n.return=t,n}function O0(t,n,a){return Ns(n,t.child,null,a),t=Yl(n,n.pendingProps),t.flags|=2,oi(n),n.memoizedState=null,t}function LS(t,n,a){var o=n.pendingProps,u=(n.flags&128)!==0;if(n.flags&=-129,t===null){if(Et){if(o.mode==="hidden")return t=Yl(n,o),n.lanes=536870912,wo(null,t);if(uf(n),(t=Zt)?(t=Wg(t,yi),t=t!==null&&t.data==="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Ia!==null?{id:Hi,overflow:Gi}:null,retryLane:536870912,hydrationErrors:null},a=_m(t),a.return=n,n.child=a,Cn=n,Zt=null)):t=null,t===null)throw Ba(n);return n.lanes=536870912,null}return Yl(n,o)}var f=t.memoizedState;if(f!==null){var x=f.dehydrated;if(uf(n),u)if(n.flags&256)n.flags&=-257,n=O0(t,n,a);else if(n.memoizedState!==null)n.child=t.child,n.flags|=128,n=null;else throw Error(r(558));else if(mn||lr(t,n,a,!1),u=(a&t.childLanes)!==0,mn||u){if(o=qt,o!==null&&(x=ti(o,a),x!==0&&x!==f.retryLane))throw f.retryLane=x,Es(t,x),Zn(o,t,x),Uf;sc(),n=O0(t,n,a)}else t=f.treeContext,Zt=bi(x.nextSibling),Cn=n,Et=!0,Fa=null,yi=!1,t!==null&&Sm(n,t),n=Yl(n,o),n.flags|=4096;return n}return t=na(t.child,{mode:o.mode,children:o.children}),t.ref=n.ref,n.child=t,t.return=n,t}function Zl(t,n){var a=n.ref;if(a===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(r(284));(t===null||t.ref!==a)&&(n.flags|=4194816)}}function Nf(t,n,a,o,u){return Cs(n),a=hf(t,n,a,o,void 0,u),o=df(),t!==null&&!mn?(pf(t,n,u),la(t,n,u)):(Et&&o&&Wu(n),n.flags|=1,Dn(t,n,a,u),n.child)}function P0(t,n,a,o,u,f){return Cs(n),n.updateQueue=null,a=Bm(n,o,a,u),Fm(t),o=df(),t!==null&&!mn?(pf(t,n,f),la(t,n,f)):(Et&&o&&Wu(n),n.flags|=1,Dn(t,n,a,f),n.child)}function I0(t,n,a,o,u){if(Cs(n),n.stateNode===null){var f=ar,x=a.contextType;typeof x=="object"&&x!==null&&(f=wn(x)),f=new a(o,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=wf,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=o,f.state=n.memoizedState,f.refs={},af(n),x=a.contextType,f.context=typeof x=="object"&&x!==null?wn(x):ar,f.state=n.memoizedState,x=a.getDerivedStateFromProps,typeof x=="function"&&(Cf(n,a,x,o),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(x=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),x!==f.state&&wf.enqueueReplaceState(f,f.state,null),Eo(n,o,f,u),bo(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!0}else if(t===null){f=n.stateNode;var R=n.memoizedProps,G=Os(a,R);f.props=G;var ae=f.context,me=a.contextType;x=ar,typeof me=="object"&&me!==null&&(x=wn(me));var xe=a.getDerivedStateFromProps;me=typeof xe=="function"||typeof f.getSnapshotBeforeUpdate=="function",R=n.pendingProps!==R,me||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(R||ae!==x)&&M0(n,f,o,x),Ha=!1;var ce=n.memoizedState;f.state=ce,Eo(n,o,f,u),bo(),ae=n.memoizedState,R||ce!==ae||Ha?(typeof xe=="function"&&(Cf(n,a,xe,o),ae=n.memoizedState),(G=Ha||y0(n,a,G,o,ce,ae,x))?(me||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=o,n.memoizedState=ae),f.props=o,f.state=ae,f.context=x,o=G):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!1)}else{f=n.stateNode,sf(t,n),x=n.memoizedProps,me=Os(a,x),f.props=me,xe=n.pendingProps,ce=f.context,ae=a.contextType,G=ar,typeof ae=="object"&&ae!==null&&(G=wn(ae)),R=a.getDerivedStateFromProps,(ae=typeof R=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(x!==xe||ce!==G)&&M0(n,f,o,G),Ha=!1,ce=n.memoizedState,f.state=ce,Eo(n,o,f,u),bo();var ue=n.memoizedState;x!==xe||ce!==ue||Ha||t!==null&&t.dependencies!==null&&Dl(t.dependencies)?(typeof R=="function"&&(Cf(n,a,R,o),ue=n.memoizedState),(me=Ha||y0(n,a,me,o,ce,ue,G)||t!==null&&t.dependencies!==null&&Dl(t.dependencies))?(ae||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(o,ue,G),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(o,ue,G)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||x===t.memoizedProps&&ce===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||x===t.memoizedProps&&ce===t.memoizedState||(n.flags|=1024),n.memoizedProps=o,n.memoizedState=ue),f.props=o,f.state=ue,f.context=G,o=me):(typeof f.componentDidUpdate!="function"||x===t.memoizedProps&&ce===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||x===t.memoizedProps&&ce===t.memoizedState||(n.flags|=1024),o=!1)}return f=o,Zl(t,n),o=(n.flags&128)!==0,f||o?(f=n.stateNode,a=o&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,t!==null&&o?(n.child=Ns(n,t.child,null,u),n.child=Ns(n,null,a,u)):Dn(t,n,a,u),n.memoizedState=f.state,t=n.child):t=la(t,n,u),t}function F0(t,n,a,o){return As(),n.flags|=256,Dn(t,n,a,o),n.child}var Lf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Of(t){return{baseLanes:t,cachePool:Am()}}function Pf(t,n,a){return t=t!==null?t.childLanes&~a:0,n&&(t|=ci),t}function B0(t,n,a){var o=n.pendingProps,u=!1,f=(n.flags&128)!==0,x;if((x=f)||(x=t!==null&&t.memoizedState===null?!1:(un.current&2)!==0),x&&(u=!0,n.flags&=-129),x=(n.flags&32)!==0,n.flags&=-33,t===null){if(Et){if(u?ka(n):Xa(),(t=Zt)?(t=Wg(t,yi),t=t!==null&&t.data!=="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Ia!==null?{id:Hi,overflow:Gi}:null,retryLane:536870912,hydrationErrors:null},a=_m(t),a.return=n,n.child=a,Cn=n,Zt=null)):t=null,t===null)throw Ba(n);return _h(t)?n.lanes=32:n.lanes=536870912,null}var R=o.children;return o=o.fallback,u?(Xa(),u=n.mode,R=Kl({mode:"hidden",children:R},u),o=Ts(o,u,a,null),R.return=n,o.return=n,R.sibling=o,n.child=R,o=n.child,o.memoizedState=Of(a),o.childLanes=Pf(t,x,a),n.memoizedState=Lf,wo(null,o)):(ka(n),If(n,R))}var G=t.memoizedState;if(G!==null&&(R=G.dehydrated,R!==null)){if(f)n.flags&256?(ka(n),n.flags&=-257,n=Ff(t,n,a)):n.memoizedState!==null?(Xa(),n.child=t.child,n.flags|=128,n=null):(Xa(),R=o.fallback,u=n.mode,o=Kl({mode:"visible",children:o.children},u),R=Ts(R,u,a,null),R.flags|=2,o.return=n,R.return=n,o.sibling=R,n.child=o,Ns(n,t.child,null,a),o=n.child,o.memoizedState=Of(a),o.childLanes=Pf(t,x,a),n.memoizedState=Lf,n=wo(null,o));else if(ka(n),_h(R)){if(x=R.nextSibling&&R.nextSibling.dataset,x)var ae=x.dgst;x=ae,o=Error(r(419)),o.stack="",o.digest=x,_o({value:o,source:null,stack:null}),n=Ff(t,n,a)}else if(mn||lr(t,n,a,!1),x=(a&t.childLanes)!==0,mn||x){if(x=qt,x!==null&&(o=ti(x,a),o!==0&&o!==G.retryLane))throw G.retryLane=o,Es(t,o),Zn(x,t,o),Uf;gh(R)||sc(),n=Ff(t,n,a)}else gh(R)?(n.flags|=192,n.child=t.child,n=null):(t=G.treeContext,Zt=bi(R.nextSibling),Cn=n,Et=!0,Fa=null,yi=!1,t!==null&&Sm(n,t),n=If(n,o.children),n.flags|=4096);return n}return u?(Xa(),R=o.fallback,u=n.mode,G=t.child,ae=G.sibling,o=na(G,{mode:"hidden",children:o.children}),o.subtreeFlags=G.subtreeFlags&65011712,ae!==null?R=na(ae,R):(R=Ts(R,u,a,null),R.flags|=2),R.return=n,o.return=n,o.sibling=R,n.child=o,wo(null,o),o=n.child,R=t.child.memoizedState,R===null?R=Of(a):(u=R.cachePool,u!==null?(G=dn._currentValue,u=u.parent!==G?{parent:G,pool:G}:u):u=Am(),R={baseLanes:R.baseLanes|a,cachePool:u}),o.memoizedState=R,o.childLanes=Pf(t,x,a),n.memoizedState=Lf,wo(t.child,o)):(ka(n),a=t.child,t=a.sibling,a=na(a,{mode:"visible",children:o.children}),a.return=n,a.sibling=null,t!==null&&(x=n.deletions,x===null?(n.deletions=[t],n.flags|=16):x.push(t)),n.child=a,n.memoizedState=null,a)}function If(t,n){return n=Kl({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function Kl(t,n){return t=si(22,t,null,n),t.lanes=0,t}function Ff(t,n,a){return Ns(n,t.child,null,a),t=If(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function z0(t,n,a){t.lanes|=n;var o=t.alternate;o!==null&&(o.lanes|=n),Qu(t.return,n,a)}function Bf(t,n,a,o,u,f){var x=t.memoizedState;x===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:u,treeForkCount:f}:(x.isBackwards=n,x.rendering=null,x.renderingStartTime=0,x.last=o,x.tail=a,x.tailMode=u,x.treeForkCount=f)}function H0(t,n,a){var o=n.pendingProps,u=o.revealOrder,f=o.tail;o=o.children;var x=un.current,R=(x&2)!==0;if(R?(x=x&1|2,n.flags|=128):x&=1,Se(un,x),Dn(t,n,o,a),o=Et?go:0,!R&&t!==null&&(t.flags&128)!==0)e:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&z0(t,a,n);else if(t.tag===19)z0(t,a,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break e;for(;t.sibling===null;){if(t.return===null||t.return===n)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(u){case"forwards":for(a=n.child,u=null;a!==null;)t=a.alternate,t!==null&&Bl(t)===null&&(u=a),a=a.sibling;a=u,a===null?(u=n.child,n.child=null):(u=a.sibling,a.sibling=null),Bf(n,!1,u,a,f,o);break;case"backwards":case"unstable_legacy-backwards":for(a=null,u=n.child,n.child=null;u!==null;){if(t=u.alternate,t!==null&&Bl(t)===null){n.child=u;break}t=u.sibling,u.sibling=a,a=u,u=t}Bf(n,!0,a,null,f,o);break;case"together":Bf(n,!1,null,null,void 0,o);break;default:n.memoizedState=null}return n.child}function la(t,n,a){if(t!==null&&(n.dependencies=t.dependencies),qa|=n.lanes,(a&n.childLanes)===0)if(t!==null){if(lr(t,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(r(153));if(n.child!==null){for(t=n.child,a=na(t,t.pendingProps),n.child=a,a.return=n;t.sibling!==null;)t=t.sibling,a=a.sibling=na(t,t.pendingProps),a.return=n;a.sibling=null}return n.child}function zf(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&Dl(t)))}function OS(t,n,a){switch(n.tag){case 3:be(n,n.stateNode.containerInfo),za(n,dn,t.memoizedState.cache),As();break;case 27:case 5:we(n);break;case 4:be(n,n.stateNode.containerInfo);break;case 10:za(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,uf(n),null;break;case 13:var o=n.memoizedState;if(o!==null)return o.dehydrated!==null?(ka(n),n.flags|=128,null):(a&n.child.childLanes)!==0?B0(t,n,a):(ka(n),t=la(t,n,a),t!==null?t.sibling:null);ka(n);break;case 19:var u=(t.flags&128)!==0;if(o=(a&n.childLanes)!==0,o||(lr(t,n,a,!1),o=(a&n.childLanes)!==0),u){if(o)return H0(t,n,a);n.flags|=128}if(u=n.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),Se(un,un.current),o)break;return null;case 22:return n.lanes=0,N0(t,n,a,n.pendingProps);case 24:za(n,dn,t.memoizedState.cache)}return la(t,n,a)}function G0(t,n,a){if(t!==null)if(t.memoizedProps!==n.pendingProps)mn=!0;else{if(!zf(t,a)&&(n.flags&128)===0)return mn=!1,OS(t,n,a);mn=(t.flags&131072)!==0}else mn=!1,Et&&(n.flags&1048576)!==0&&xm(n,go,n.index);switch(n.lanes=0,n.tag){case 16:e:{var o=n.pendingProps;if(t=Ds(n.elementType),n.type=t,typeof t=="function")ku(t)?(o=Os(t,o),n.tag=1,n=I0(null,n,t,o,a)):(n.tag=0,n=Nf(null,n,t,o,a));else{if(t!=null){var u=t.$$typeof;if(u===I){n.tag=11,n=w0(null,n,t,o,a);break e}else if(u===O){n.tag=14,n=D0(null,n,t,o,a);break e}}throw n=he(t)||t,Error(r(306,n,""))}}return n;case 0:return Nf(t,n,n.type,n.pendingProps,a);case 1:return o=n.type,u=Os(o,n.pendingProps),I0(t,n,o,u,a);case 3:e:{if(be(n,n.stateNode.containerInfo),t===null)throw Error(r(387));o=n.pendingProps;var f=n.memoizedState;u=f.element,sf(t,n),Eo(n,o,null,a);var x=n.memoizedState;if(o=x.cache,za(n,dn,o),o!==f.cache&&Ju(n,[dn],a,!0),bo(),o=x.element,f.isDehydrated)if(f={element:o,isDehydrated:!1,cache:x.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=F0(t,n,o,a);break e}else if(o!==u){u=vi(Error(r(424)),n),_o(u),n=F0(t,n,o,a);break e}else for(t=n.stateNode.containerInfo,t.nodeType===9?t=t.body:t=t.nodeName==="HTML"?t.ownerDocument.body:t,Zt=bi(t.firstChild),Cn=n,Et=!0,Fa=null,yi=!0,a=Nm(n,null,o,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(As(),o===u){n=la(t,n,a);break e}Dn(t,n,o,a)}n=n.child}return n;case 26:return Zl(t,n),t===null?(a=Jg(n.type,null,n.pendingProps,null))?n.memoizedState=a:Et||(a=n.type,t=n.pendingProps,o=hc(se.current).createElement(a),o[cn]=n,o[Rn]=t,Un(o,a,t),hn(o),n.stateNode=o):n.memoizedState=Jg(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return we(n),t===null&&Et&&(o=n.stateNode=Zg(n.type,n.pendingProps,se.current),Cn=n,yi=!0,u=Zt,Ja(n.type)?(vh=u,Zt=bi(o.firstChild)):Zt=u),Dn(t,n,n.pendingProps.children,a),Zl(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&Et&&((u=o=Zt)&&(o=uy(o,n.type,n.pendingProps,yi),o!==null?(n.stateNode=o,Cn=n,Zt=bi(o.firstChild),yi=!1,u=!0):u=!1),u||Ba(n)),we(n),u=n.type,f=n.pendingProps,x=t!==null?t.memoizedProps:null,o=f.children,dh(u,f)?o=null:x!==null&&dh(u,x)&&(n.flags|=32),n.memoizedState!==null&&(u=hf(t,n,TS,null,null,a),Xo._currentValue=u),Zl(t,n),Dn(t,n,o,a),n.child;case 6:return t===null&&Et&&((t=a=Zt)&&(a=fy(a,n.pendingProps,yi),a!==null?(n.stateNode=a,Cn=n,Zt=null,t=!0):t=!1),t||Ba(n)),null;case 13:return B0(t,n,a);case 4:return be(n,n.stateNode.containerInfo),o=n.pendingProps,t===null?n.child=Ns(n,null,o,a):Dn(t,n,o,a),n.child;case 11:return w0(t,n,n.type,n.pendingProps,a);case 7:return Dn(t,n,n.pendingProps,a),n.child;case 8:return Dn(t,n,n.pendingProps.children,a),n.child;case 12:return Dn(t,n,n.pendingProps.children,a),n.child;case 10:return o=n.pendingProps,za(n,n.type,o.value),Dn(t,n,o.children,a),n.child;case 9:return u=n.type._context,o=n.pendingProps.children,Cs(n),u=wn(u),o=o(u),n.flags|=1,Dn(t,n,o,a),n.child;case 14:return D0(t,n,n.type,n.pendingProps,a);case 15:return U0(t,n,n.type,n.pendingProps,a);case 19:return H0(t,n,a);case 31:return LS(t,n,a);case 22:return N0(t,n,a,n.pendingProps);case 24:return Cs(n),o=wn(dn),t===null?(u=tf(),u===null&&(u=qt,f=$u(),u.pooledCache=f,f.refCount++,f!==null&&(u.pooledCacheLanes|=a),u=f),n.memoizedState={parent:o,cache:u},af(n),za(n,dn,u)):((t.lanes&a)!==0&&(sf(t,n),Eo(n,null,null,a),bo()),u=t.memoizedState,f=n.memoizedState,u.parent!==o?(u={parent:o,cache:o},n.memoizedState=u,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=u),za(n,dn,o)):(o=f.cache,za(n,dn,o),o!==u.cache&&Ju(n,[dn],a,!0))),Dn(t,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(r(156,n.tag))}function ca(t){t.flags|=4}function Hf(t,n,a,o,u){if((n=(t.mode&32)!==0)&&(n=!1),n){if(t.flags|=16777216,(u&335544128)===u)if(t.stateNode.complete)t.flags|=8192;else if(pg())t.flags|=8192;else throw Us=Ol,nf}else t.flags&=-16777217}function V0(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!i_(n))if(pg())t.flags|=8192;else throw Us=Ol,nf}function Ql(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?Ee():536870912,t.lanes|=n,Sr|=n)}function Do(t,n){if(!Et)switch(t.tailMode){case"hidden":n=t.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:o.sibling=null}}function Kt(t){var n=t.alternate!==null&&t.alternate.child===t.child,a=0,o=0;if(n)for(var u=t.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags&65011712,o|=u.flags&65011712,u.return=t,u=u.sibling;else for(u=t.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags,o|=u.flags,u.return=t,u=u.sibling;return t.subtreeFlags|=o,t.childLanes=a,n}function PS(t,n,a){var o=n.pendingProps;switch(qu(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Kt(n),null;case 1:return Kt(n),null;case 3:return a=n.stateNode,o=null,t!==null&&(o=t.memoizedState.cache),n.memoizedState.cache!==o&&(n.flags|=2048),sa(dn),K(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(or(n)?ca(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Zu())),Kt(n),null;case 26:var u=n.type,f=n.memoizedState;return t===null?(ca(n),f!==null?(Kt(n),V0(n,f)):(Kt(n),Hf(n,u,null,o,a))):f?f!==t.memoizedState?(ca(n),Kt(n),V0(n,f)):(Kt(n),n.flags&=-16777217):(t=t.memoizedProps,t!==o&&ca(n),Kt(n),Hf(n,u,t,o,a)),null;case 27:if(Ze(n),a=se.current,u=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==o&&ca(n);else{if(!o){if(n.stateNode===null)throw Error(r(166));return Kt(n),null}t=Ae.current,or(n)?ym(n):(t=Zg(u,o,a),n.stateNode=t,ca(n))}return Kt(n),null;case 5:if(Ze(n),u=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==o&&ca(n);else{if(!o){if(n.stateNode===null)throw Error(r(166));return Kt(n),null}if(f=Ae.current,or(n))ym(n);else{var x=hc(se.current);switch(f){case 1:f=x.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:f=x.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":f=x.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":f=x.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":f=x.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof o.is=="string"?x.createElement("select",{is:o.is}):x.createElement("select"),o.multiple?f.multiple=!0:o.size&&(f.size=o.size);break;default:f=typeof o.is=="string"?x.createElement(u,{is:o.is}):x.createElement(u)}}f[cn]=n,f[Rn]=o;e:for(x=n.child;x!==null;){if(x.tag===5||x.tag===6)f.appendChild(x.stateNode);else if(x.tag!==4&&x.tag!==27&&x.child!==null){x.child.return=x,x=x.child;continue}if(x===n)break e;for(;x.sibling===null;){if(x.return===null||x.return===n)break e;x=x.return}x.sibling.return=x.return,x=x.sibling}n.stateNode=f;e:switch(Un(f,u,o),u){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&ca(n)}}return Kt(n),Hf(n,n.type,t===null?null:t.memoizedProps,n.pendingProps,a),null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==o&&ca(n);else{if(typeof o!="string"&&n.stateNode===null)throw Error(r(166));if(t=se.current,or(n)){if(t=n.stateNode,a=n.memoizedProps,o=null,u=Cn,u!==null)switch(u.tag){case 27:case 5:o=u.memoizedProps}t[cn]=n,t=!!(t.nodeValue===a||o!==null&&o.suppressHydrationWarning===!0||Bg(t.nodeValue,a)),t||Ba(n,!0)}else t=hc(t).createTextNode(o),t[cn]=n,n.stateNode=t}return Kt(n),null;case 31:if(a=n.memoizedState,t===null||t.memoizedState!==null){if(o=or(n),a!==null){if(t===null){if(!o)throw Error(r(318));if(t=n.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(557));t[cn]=n}else As(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Kt(n),t=!1}else a=Zu(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return n.flags&256?(oi(n),n):(oi(n),null);if((n.flags&128)!==0)throw Error(r(558))}return Kt(n),null;case 13:if(o=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(u=or(n),o!==null&&o.dehydrated!==null){if(t===null){if(!u)throw Error(r(318));if(u=n.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(r(317));u[cn]=n}else As(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Kt(n),u=!1}else u=Zu(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=u),u=!0;if(!u)return n.flags&256?(oi(n),n):(oi(n),null)}return oi(n),(n.flags&128)!==0?(n.lanes=a,n):(a=o!==null,t=t!==null&&t.memoizedState!==null,a&&(o=n.child,u=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(u=o.alternate.memoizedState.cachePool.pool),f=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(f=o.memoizedState.cachePool.pool),f!==u&&(o.flags|=2048)),a!==t&&a&&(n.child.flags|=8192),Ql(n,n.updateQueue),Kt(n),null);case 4:return K(),t===null&&lh(n.stateNode.containerInfo),Kt(n),null;case 10:return sa(n.type),Kt(n),null;case 19:if(q(un),o=n.memoizedState,o===null)return Kt(n),null;if(u=(n.flags&128)!==0,f=o.rendering,f===null)if(u)Do(o,!1);else{if(sn!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(f=Bl(t),f!==null){for(n.flags|=128,Do(o,!1),t=f.updateQueue,n.updateQueue=t,Ql(n,t),n.subtreeFlags=0,t=a,a=n.child;a!==null;)gm(a,t),a=a.sibling;return Se(un,un.current&1|2),Et&&ia(n,o.treeForkCount),n.child}t=t.sibling}o.tail!==null&&De()>nc&&(n.flags|=128,u=!0,Do(o,!1),n.lanes=4194304)}else{if(!u)if(t=Bl(f),t!==null){if(n.flags|=128,u=!0,t=t.updateQueue,n.updateQueue=t,Ql(n,t),Do(o,!0),o.tail===null&&o.tailMode==="hidden"&&!f.alternate&&!Et)return Kt(n),null}else 2*De()-o.renderingStartTime>nc&&a!==536870912&&(n.flags|=128,u=!0,Do(o,!1),n.lanes=4194304);o.isBackwards?(f.sibling=n.child,n.child=f):(t=o.last,t!==null?t.sibling=f:n.child=f,o.last=f)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=De(),t.sibling=null,a=un.current,Se(un,u?a&1|2:a&1),Et&&ia(n,o.treeForkCount),t):(Kt(n),null);case 22:case 23:return oi(n),cf(),o=n.memoizedState!==null,t!==null?t.memoizedState!==null!==o&&(n.flags|=8192):o&&(n.flags|=8192),o?(a&536870912)!==0&&(n.flags&128)===0&&(Kt(n),n.subtreeFlags&6&&(n.flags|=8192)):Kt(n),a=n.updateQueue,a!==null&&Ql(n,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),o=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),o!==a&&(n.flags|=2048),t!==null&&q(ws),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),sa(dn),Kt(n),null;case 25:return null;case 30:return null}throw Error(r(156,n.tag))}function IS(t,n){switch(qu(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return sa(dn),K(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return Ze(n),null;case 31:if(n.memoizedState!==null){if(oi(n),n.alternate===null)throw Error(r(340));As()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 13:if(oi(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(r(340));As()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return q(un),null;case 4:return K(),null;case 10:return sa(n.type),null;case 22:case 23:return oi(n),cf(),t!==null&&q(ws),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return sa(dn),null;case 25:return null;default:return null}}function k0(t,n){switch(qu(n),n.tag){case 3:sa(dn),K();break;case 26:case 27:case 5:Ze(n);break;case 4:K();break;case 31:n.memoizedState!==null&&oi(n);break;case 13:oi(n);break;case 19:q(un);break;case 10:sa(n.type);break;case 22:case 23:oi(n),cf(),t!==null&&q(ws);break;case 24:sa(dn)}}function Uo(t,n){try{var a=n.updateQueue,o=a!==null?a.lastEffect:null;if(o!==null){var u=o.next;a=u;do{if((a.tag&t)===t){o=void 0;var f=a.create,x=a.inst;o=f(),x.destroy=o}a=a.next}while(a!==u)}}catch(R){Bt(n,n.return,R)}}function ja(t,n,a){try{var o=n.updateQueue,u=o!==null?o.lastEffect:null;if(u!==null){var f=u.next;o=f;do{if((o.tag&t)===t){var x=o.inst,R=x.destroy;if(R!==void 0){x.destroy=void 0,u=n;var G=a,ae=R;try{ae()}catch(me){Bt(u,G,me)}}}o=o.next}while(o!==f)}}catch(me){Bt(n,n.return,me)}}function X0(t){var n=t.updateQueue;if(n!==null){var a=t.stateNode;try{Om(n,a)}catch(o){Bt(t,t.return,o)}}}function j0(t,n,a){a.props=Os(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(o){Bt(t,n,o)}}function No(t,n){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var o=t.stateNode;break;case 30:o=t.stateNode;break;default:o=t.stateNode}typeof a=="function"?t.refCleanup=a(o):a.current=o}}catch(u){Bt(t,n,u)}}function Vi(t,n){var a=t.ref,o=t.refCleanup;if(a!==null)if(typeof o=="function")try{o()}catch(u){Bt(t,n,u)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(u){Bt(t,n,u)}else a.current=null}function W0(t){var n=t.type,a=t.memoizedProps,o=t.stateNode;try{e:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&o.focus();break e;case"img":a.src?o.src=a.src:a.srcSet&&(o.srcset=a.srcSet)}}catch(u){Bt(t,t.return,u)}}function Gf(t,n,a){try{var o=t.stateNode;ay(o,t.type,a,n),o[Rn]=n}catch(u){Bt(t,t.return,u)}}function q0(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&Ja(t.type)||t.tag===4}function Vf(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||q0(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&Ja(t.type)||t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function kf(t,n,a){var o=t.tag;if(o===5||o===6)t=t.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(t,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(t),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=ea));else if(o!==4&&(o===27&&Ja(t.type)&&(a=t.stateNode,n=null),t=t.child,t!==null))for(kf(t,n,a),t=t.sibling;t!==null;)kf(t,n,a),t=t.sibling}function Jl(t,n,a){var o=t.tag;if(o===5||o===6)t=t.stateNode,n?a.insertBefore(t,n):a.appendChild(t);else if(o!==4&&(o===27&&Ja(t.type)&&(a=t.stateNode),t=t.child,t!==null))for(Jl(t,n,a),t=t.sibling;t!==null;)Jl(t,n,a),t=t.sibling}function Y0(t){var n=t.stateNode,a=t.memoizedProps;try{for(var o=t.type,u=n.attributes;u.length;)n.removeAttributeNode(u[0]);Un(n,o,a),n[cn]=t,n[Rn]=a}catch(f){Bt(t,t.return,f)}}var ua=!1,gn=!1,Xf=!1,Z0=typeof WeakSet=="function"?WeakSet:Set,bn=null;function FS(t,n){if(t=t.containerInfo,fh=xc,t=om(t),Iu(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else e:{a=(a=t.ownerDocument)&&a.defaultView||window;var o=a.getSelection&&a.getSelection();if(o&&o.rangeCount!==0){a=o.anchorNode;var u=o.anchorOffset,f=o.focusNode;o=o.focusOffset;try{a.nodeType,f.nodeType}catch{a=null;break e}var x=0,R=-1,G=-1,ae=0,me=0,xe=t,ce=null;t:for(;;){for(var ue;xe!==a||u!==0&&xe.nodeType!==3||(R=x+u),xe!==f||o!==0&&xe.nodeType!==3||(G=x+o),xe.nodeType===3&&(x+=xe.nodeValue.length),(ue=xe.firstChild)!==null;)ce=xe,xe=ue;for(;;){if(xe===t)break t;if(ce===a&&++ae===u&&(R=x),ce===f&&++me===o&&(G=x),(ue=xe.nextSibling)!==null)break;xe=ce,ce=xe.parentNode}xe=ue}a=R===-1||G===-1?null:{start:R,end:G}}else a=null}a=a||{start:0,end:0}}else a=null;for(hh={focusedElem:t,selectionRange:a},xc=!1,bn=n;bn!==null;)if(n=bn,t=n.child,(n.subtreeFlags&1028)!==0&&t!==null)t.return=n,bn=t;else for(;bn!==null;){switch(n=bn,f=n.alternate,t=n.flags,n.tag){case 0:if((t&4)!==0&&(t=n.updateQueue,t=t!==null?t.events:null,t!==null))for(a=0;a<t.length;a++)u=t[a],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&f!==null){t=void 0,a=n,u=f.memoizedProps,f=f.memoizedState,o=a.stateNode;try{var We=Os(a.type,u);t=o.getSnapshotBeforeUpdate(We,f),o.__reactInternalSnapshotBeforeUpdate=t}catch(et){Bt(a,a.return,et)}}break;case 3:if((t&1024)!==0){if(t=n.stateNode.containerInfo,a=t.nodeType,a===9)mh(t);else if(a===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":mh(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(r(163))}if(t=n.sibling,t!==null){t.return=n.return,bn=t;break}bn=n.return}}function K0(t,n,a){var o=a.flags;switch(a.tag){case 0:case 11:case 15:ha(t,a),o&4&&Uo(5,a);break;case 1:if(ha(t,a),o&4)if(t=a.stateNode,n===null)try{t.componentDidMount()}catch(x){Bt(a,a.return,x)}else{var u=Os(a.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(u,n,t.__reactInternalSnapshotBeforeUpdate)}catch(x){Bt(a,a.return,x)}}o&64&&X0(a),o&512&&No(a,a.return);break;case 3:if(ha(t,a),o&64&&(t=a.updateQueue,t!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{Om(t,n)}catch(x){Bt(a,a.return,x)}}break;case 27:n===null&&o&4&&Y0(a);case 26:case 5:ha(t,a),n===null&&o&4&&W0(a),o&512&&No(a,a.return);break;case 12:ha(t,a);break;case 31:ha(t,a),o&4&&$0(t,a);break;case 13:ha(t,a),o&4&&eg(t,a),o&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=WS.bind(null,a),hy(t,a))));break;case 22:if(o=a.memoizedState!==null||ua,!o){n=n!==null&&n.memoizedState!==null||gn,u=ua;var f=gn;ua=o,(gn=n)&&!f?da(t,a,(a.subtreeFlags&8772)!==0):ha(t,a),ua=u,gn=f}break;case 30:break;default:ha(t,a)}}function Q0(t){var n=t.alternate;n!==null&&(t.alternate=null,Q0(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&so(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var en=null,jn=!1;function fa(t,n,a){for(a=a.child;a!==null;)J0(t,n,a),a=a.sibling}function J0(t,n,a){if(de&&typeof de.onCommitFiberUnmount=="function")try{de.onCommitFiberUnmount(fe,a)}catch{}switch(a.tag){case 26:gn||Vi(a,n),fa(t,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:gn||Vi(a,n);var o=en,u=jn;Ja(a.type)&&(en=a.stateNode,jn=!1),fa(t,n,a),Go(a.stateNode),en=o,jn=u;break;case 5:gn||Vi(a,n);case 6:if(o=en,u=jn,en=null,fa(t,n,a),en=o,jn=u,en!==null)if(jn)try{(en.nodeType===9?en.body:en.nodeName==="HTML"?en.ownerDocument.body:en).removeChild(a.stateNode)}catch(f){Bt(a,n,f)}else try{en.removeChild(a.stateNode)}catch(f){Bt(a,n,f)}break;case 18:en!==null&&(jn?(t=en,Xg(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),Cr(t)):Xg(en,a.stateNode));break;case 4:o=en,u=jn,en=a.stateNode.containerInfo,jn=!0,fa(t,n,a),en=o,jn=u;break;case 0:case 11:case 14:case 15:ja(2,a,n),gn||ja(4,a,n),fa(t,n,a);break;case 1:gn||(Vi(a,n),o=a.stateNode,typeof o.componentWillUnmount=="function"&&j0(a,n,o)),fa(t,n,a);break;case 21:fa(t,n,a);break;case 22:gn=(o=gn)||a.memoizedState!==null,fa(t,n,a),gn=o;break;default:fa(t,n,a)}}function $0(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{Cr(t)}catch(a){Bt(n,n.return,a)}}}function eg(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Cr(t)}catch(a){Bt(n,n.return,a)}}function BS(t){switch(t.tag){case 31:case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new Z0),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new Z0),n;default:throw Error(r(435,t.tag))}}function $l(t,n){var a=BS(t);n.forEach(function(o){if(!a.has(o)){a.add(o);var u=qS.bind(null,t,o);o.then(u,u)}})}function Wn(t,n){var a=n.deletions;if(a!==null)for(var o=0;o<a.length;o++){var u=a[o],f=t,x=n,R=x;e:for(;R!==null;){switch(R.tag){case 27:if(Ja(R.type)){en=R.stateNode,jn=!1;break e}break;case 5:en=R.stateNode,jn=!1;break e;case 3:case 4:en=R.stateNode.containerInfo,jn=!0;break e}R=R.return}if(en===null)throw Error(r(160));J0(f,x,u),en=null,jn=!1,f=u.alternate,f!==null&&(f.return=null),u.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)tg(n,t),n=n.sibling}var Ui=null;function tg(t,n){var a=t.alternate,o=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:Wn(n,t),qn(t),o&4&&(ja(3,t,t.return),Uo(3,t),ja(5,t,t.return));break;case 1:Wn(n,t),qn(t),o&512&&(gn||a===null||Vi(a,a.return)),o&64&&ua&&(t=t.updateQueue,t!==null&&(o=t.callbacks,o!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?o:a.concat(o))));break;case 26:var u=Ui;if(Wn(n,t),qn(t),o&512&&(gn||a===null||Vi(a,a.return)),o&4){var f=a!==null?a.memoizedState:null;if(o=t.memoizedState,a===null)if(o===null)if(t.stateNode===null){e:{o=t.type,a=t.memoizedProps,u=u.ownerDocument||u;t:switch(o){case"title":f=u.getElementsByTagName("title")[0],(!f||f[Da]||f[cn]||f.namespaceURI==="http://www.w3.org/2000/svg"||f.hasAttribute("itemprop"))&&(f=u.createElement(o),u.head.insertBefore(f,u.querySelector("head > title"))),Un(f,o,a),f[cn]=t,hn(f),o=f;break e;case"link":var x=t_("link","href",u).get(o+(a.href||""));if(x){for(var R=0;R<x.length;R++)if(f=x[R],f.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&f.getAttribute("rel")===(a.rel==null?null:a.rel)&&f.getAttribute("title")===(a.title==null?null:a.title)&&f.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){x.splice(R,1);break t}}f=u.createElement(o),Un(f,o,a),u.head.appendChild(f);break;case"meta":if(x=t_("meta","content",u).get(o+(a.content||""))){for(R=0;R<x.length;R++)if(f=x[R],f.getAttribute("content")===(a.content==null?null:""+a.content)&&f.getAttribute("name")===(a.name==null?null:a.name)&&f.getAttribute("property")===(a.property==null?null:a.property)&&f.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&f.getAttribute("charset")===(a.charSet==null?null:a.charSet)){x.splice(R,1);break t}}f=u.createElement(o),Un(f,o,a),u.head.appendChild(f);break;default:throw Error(r(468,o))}f[cn]=t,hn(f),o=f}t.stateNode=o}else n_(u,t.type,t.stateNode);else t.stateNode=e_(u,o,t.memoizedProps);else f!==o?(f===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):f.count--,o===null?n_(u,t.type,t.stateNode):e_(u,o,t.memoizedProps)):o===null&&t.stateNode!==null&&Gf(t,t.memoizedProps,a.memoizedProps)}break;case 27:Wn(n,t),qn(t),o&512&&(gn||a===null||Vi(a,a.return)),a!==null&&o&4&&Gf(t,t.memoizedProps,a.memoizedProps);break;case 5:if(Wn(n,t),qn(t),o&512&&(gn||a===null||Vi(a,a.return)),t.flags&32){u=t.stateNode;try{ii(u,"")}catch(We){Bt(t,t.return,We)}}o&4&&t.stateNode!=null&&(u=t.memoizedProps,Gf(t,u,a!==null?a.memoizedProps:u)),o&1024&&(Xf=!0);break;case 6:if(Wn(n,t),qn(t),o&4){if(t.stateNode===null)throw Error(r(162));o=t.memoizedProps,a=t.stateNode;try{a.nodeValue=o}catch(We){Bt(t,t.return,We)}}break;case 3:if(mc=null,u=Ui,Ui=dc(n.containerInfo),Wn(n,t),Ui=u,qn(t),o&4&&a!==null&&a.memoizedState.isDehydrated)try{Cr(n.containerInfo)}catch(We){Bt(t,t.return,We)}Xf&&(Xf=!1,ng(t));break;case 4:o=Ui,Ui=dc(t.stateNode.containerInfo),Wn(n,t),qn(t),Ui=o;break;case 12:Wn(n,t),qn(t);break;case 31:Wn(n,t),qn(t),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,$l(t,o)));break;case 13:Wn(n,t),qn(t),t.child.flags&8192&&t.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(tc=De()),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,$l(t,o)));break;case 22:u=t.memoizedState!==null;var G=a!==null&&a.memoizedState!==null,ae=ua,me=gn;if(ua=ae||u,gn=me||G,Wn(n,t),gn=me,ua=ae,qn(t),o&8192)e:for(n=t.stateNode,n._visibility=u?n._visibility&-2:n._visibility|1,u&&(a===null||G||ua||gn||Ps(t)),a=null,n=t;;){if(n.tag===5||n.tag===26){if(a===null){G=a=n;try{if(f=G.stateNode,u)x=f.style,typeof x.setProperty=="function"?x.setProperty("display","none","important"):x.display="none";else{R=G.stateNode;var xe=G.memoizedProps.style,ce=xe!=null&&xe.hasOwnProperty("display")?xe.display:null;R.style.display=ce==null||typeof ce=="boolean"?"":(""+ce).trim()}}catch(We){Bt(G,G.return,We)}}}else if(n.tag===6){if(a===null){G=n;try{G.stateNode.nodeValue=u?"":G.memoizedProps}catch(We){Bt(G,G.return,We)}}}else if(n.tag===18){if(a===null){G=n;try{var ue=G.stateNode;u?jg(ue,!0):jg(G.stateNode,!1)}catch(We){Bt(G,G.return,We)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===t)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break e;for(;n.sibling===null;){if(n.return===null||n.return===t)break e;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}o&4&&(o=t.updateQueue,o!==null&&(a=o.retryQueue,a!==null&&(o.retryQueue=null,$l(t,a))));break;case 19:Wn(n,t),qn(t),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,$l(t,o)));break;case 30:break;case 21:break;default:Wn(n,t),qn(t)}}function qn(t){var n=t.flags;if(n&2){try{for(var a,o=t.return;o!==null;){if(q0(o)){a=o;break}o=o.return}if(a==null)throw Error(r(160));switch(a.tag){case 27:var u=a.stateNode,f=Vf(t);Jl(t,f,u);break;case 5:var x=a.stateNode;a.flags&32&&(ii(x,""),a.flags&=-33);var R=Vf(t);Jl(t,R,x);break;case 3:case 4:var G=a.stateNode.containerInfo,ae=Vf(t);kf(t,ae,G);break;default:throw Error(r(161))}}catch(me){Bt(t,t.return,me)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function ng(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;ng(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),t=t.sibling}}function ha(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)K0(t,n.alternate,n),n=n.sibling}function Ps(t){for(t=t.child;t!==null;){var n=t;switch(n.tag){case 0:case 11:case 14:case 15:ja(4,n,n.return),Ps(n);break;case 1:Vi(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&j0(n,n.return,a),Ps(n);break;case 27:Go(n.stateNode);case 26:case 5:Vi(n,n.return),Ps(n);break;case 22:n.memoizedState===null&&Ps(n);break;case 30:Ps(n);break;default:Ps(n)}t=t.sibling}}function da(t,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var o=n.alternate,u=t,f=n,x=f.flags;switch(f.tag){case 0:case 11:case 15:da(u,f,a),Uo(4,f);break;case 1:if(da(u,f,a),o=f,u=o.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(ae){Bt(o,o.return,ae)}if(o=f,u=o.updateQueue,u!==null){var R=o.stateNode;try{var G=u.shared.hiddenCallbacks;if(G!==null)for(u.shared.hiddenCallbacks=null,u=0;u<G.length;u++)Lm(G[u],R)}catch(ae){Bt(o,o.return,ae)}}a&&x&64&&X0(f),No(f,f.return);break;case 27:Y0(f);case 26:case 5:da(u,f,a),a&&o===null&&x&4&&W0(f),No(f,f.return);break;case 12:da(u,f,a);break;case 31:da(u,f,a),a&&x&4&&$0(u,f);break;case 13:da(u,f,a),a&&x&4&&eg(u,f);break;case 22:f.memoizedState===null&&da(u,f,a),No(f,f.return);break;case 30:break;default:da(u,f,a)}n=n.sibling}}function jf(t,n){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&vo(a))}function Wf(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&vo(t))}function Ni(t,n,a,o){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)ig(t,n,a,o),n=n.sibling}function ig(t,n,a,o){var u=n.flags;switch(n.tag){case 0:case 11:case 15:Ni(t,n,a,o),u&2048&&Uo(9,n);break;case 1:Ni(t,n,a,o);break;case 3:Ni(t,n,a,o),u&2048&&(t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&vo(t)));break;case 12:if(u&2048){Ni(t,n,a,o),t=n.stateNode;try{var f=n.memoizedProps,x=f.id,R=f.onPostCommit;typeof R=="function"&&R(x,n.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(G){Bt(n,n.return,G)}}else Ni(t,n,a,o);break;case 31:Ni(t,n,a,o);break;case 13:Ni(t,n,a,o);break;case 23:break;case 22:f=n.stateNode,x=n.alternate,n.memoizedState!==null?f._visibility&2?Ni(t,n,a,o):Lo(t,n):f._visibility&2?Ni(t,n,a,o):(f._visibility|=2,_r(t,n,a,o,(n.subtreeFlags&10256)!==0||!1)),u&2048&&jf(x,n);break;case 24:Ni(t,n,a,o),u&2048&&Wf(n.alternate,n);break;default:Ni(t,n,a,o)}}function _r(t,n,a,o,u){for(u=u&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=t,x=n,R=a,G=o,ae=x.flags;switch(x.tag){case 0:case 11:case 15:_r(f,x,R,G,u),Uo(8,x);break;case 23:break;case 22:var me=x.stateNode;x.memoizedState!==null?me._visibility&2?_r(f,x,R,G,u):Lo(f,x):(me._visibility|=2,_r(f,x,R,G,u)),u&&ae&2048&&jf(x.alternate,x);break;case 24:_r(f,x,R,G,u),u&&ae&2048&&Wf(x.alternate,x);break;default:_r(f,x,R,G,u)}n=n.sibling}}function Lo(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=t,o=n,u=o.flags;switch(o.tag){case 22:Lo(a,o),u&2048&&jf(o.alternate,o);break;case 24:Lo(a,o),u&2048&&Wf(o.alternate,o);break;default:Lo(a,o)}n=n.sibling}}var Oo=8192;function vr(t,n,a){if(t.subtreeFlags&Oo)for(t=t.child;t!==null;)ag(t,n,a),t=t.sibling}function ag(t,n,a){switch(t.tag){case 26:vr(t,n,a),t.flags&Oo&&t.memoizedState!==null&&Ey(a,Ui,t.memoizedState,t.memoizedProps);break;case 5:vr(t,n,a);break;case 3:case 4:var o=Ui;Ui=dc(t.stateNode.containerInfo),vr(t,n,a),Ui=o;break;case 22:t.memoizedState===null&&(o=t.alternate,o!==null&&o.memoizedState!==null?(o=Oo,Oo=16777216,vr(t,n,a),Oo=o):vr(t,n,a));break;default:vr(t,n,a)}}function sg(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function Po(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];bn=o,og(o,t)}sg(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)rg(t),t=t.sibling}function rg(t){switch(t.tag){case 0:case 11:case 15:Po(t),t.flags&2048&&ja(9,t,t.return);break;case 3:Po(t);break;case 12:Po(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,ec(t)):Po(t);break;default:Po(t)}}function ec(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];bn=o,og(o,t)}sg(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:ja(8,n,n.return),ec(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,ec(n));break;default:ec(n)}t=t.sibling}}function og(t,n){for(;bn!==null;){var a=bn;switch(a.tag){case 0:case 11:case 15:ja(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var o=a.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:vo(a.memoizedState.cache)}if(o=a.child,o!==null)o.return=a,bn=o;else e:for(a=t;bn!==null;){o=bn;var u=o.sibling,f=o.return;if(Q0(o),o===a){bn=null;break e}if(u!==null){u.return=f,bn=u;break e}bn=f}}}var zS={getCacheForType:function(t){var n=wn(dn),a=n.data.get(t);return a===void 0&&(a=t(),n.data.set(t,a)),a},cacheSignal:function(){return wn(dn).controller.signal}},HS=typeof WeakMap=="function"?WeakMap:Map,Ut=0,qt=null,xt=null,Mt=0,Ft=0,li=null,Wa=!1,xr=!1,qf=!1,pa=0,sn=0,qa=0,Is=0,Yf=0,ci=0,Sr=0,Io=null,Yn=null,Zf=!1,tc=0,lg=0,nc=1/0,ic=null,Ya=null,xn=0,Za=null,yr=null,ma=0,Kf=0,Qf=null,cg=null,Fo=0,Jf=null;function ui(){return(Ut&2)!==0&&Mt!==0?Mt&-Mt:P.T!==null?ah():no()}function ug(){if(ci===0)if((Mt&536870912)===0||Et){var t=_t;_t<<=1,(_t&3932160)===0&&(_t=262144),ci=t}else ci=536870912;return t=ri.current,t!==null&&(t.flags|=32),ci}function Zn(t,n,a){(t===qt&&(Ft===2||Ft===9)||t.cancelPendingCommit!==null)&&(Mr(t,0),Ka(t,Mt,ci,!1)),nt(t,a),((Ut&2)===0||t!==qt)&&(t===qt&&((Ut&2)===0&&(Is|=a),sn===4&&Ka(t,Mt,ci,!1)),ki(t))}function fg(t,n,a){if((Ut&6)!==0)throw Error(r(327));var o=!a&&(n&127)===0&&(n&t.expiredLanes)===0||He(t,n),u=o?kS(t,n):eh(t,n,!0),f=o;do{if(u===0){xr&&!o&&Ka(t,n,0,!1);break}else{if(a=t.current.alternate,f&&!GS(a)){u=eh(t,n,!1),f=!1;continue}if(u===2){if(f=n,t.errorRecoveryDisabledLanes&f)var x=0;else x=t.pendingLanes&-536870913,x=x!==0?x:x&536870912?536870912:0;if(x!==0){n=x;e:{var R=t;u=Io;var G=R.current.memoizedState.isDehydrated;if(G&&(Mr(R,x).flags|=256),x=eh(R,x,!1),x!==2){if(qf&&!G){R.errorRecoveryDisabledLanes|=f,Is|=f,u=4;break e}f=Yn,Yn=u,f!==null&&(Yn===null?Yn=f:Yn.push.apply(Yn,f))}u=x}if(f=!1,u!==2)continue}}if(u===1){Mr(t,0),Ka(t,n,0,!0);break}e:{switch(o=t,f=u,f){case 0:case 1:throw Error(r(345));case 4:if((n&4194048)!==n)break;case 6:Ka(o,n,ci,!Wa);break e;case 2:Yn=null;break;case 3:case 5:break;default:throw Error(r(329))}if((n&62914560)===n&&(u=tc+300-De(),10<u)){if(Ka(o,n,ci,!Wa),ge(o,0,!0)!==0)break e;ma=n,o.timeoutHandle=Vg(hg.bind(null,o,a,Yn,ic,Zf,n,ci,Is,Sr,Wa,f,"Throttled",-0,0),u);break e}hg(o,a,Yn,ic,Zf,n,ci,Is,Sr,Wa,f,null,-0,0)}}break}while(!0);ki(t)}function hg(t,n,a,o,u,f,x,R,G,ae,me,xe,ce,ue){if(t.timeoutHandle=-1,xe=n.subtreeFlags,xe&8192||(xe&16785408)===16785408){xe={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ea},ag(n,f,xe);var We=(f&62914560)===f?tc-De():(f&4194048)===f?lg-De():0;if(We=Ty(xe,We),We!==null){ma=f,t.cancelPendingCommit=We(Sg.bind(null,t,n,f,a,o,u,x,R,G,me,xe,null,ce,ue)),Ka(t,f,x,!ae);return}}Sg(t,n,f,a,o,u,x,R,G)}function GS(t){for(var n=t;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var o=0;o<a.length;o++){var u=a[o],f=u.getSnapshot;u=u.value;try{if(!ai(f(),u))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function Ka(t,n,a,o){n&=~Yf,n&=~Is,t.suspendedLanes|=n,t.pingedLanes&=~n,o&&(t.warmLanes|=n),o=t.expirationTimes;for(var u=n;0<u;){var f=31-Fe(u),x=1<<f;o[f]=-1,u&=~x}a!==0&&Dt(t,a,n)}function ac(){return(Ut&6)===0?(Bo(0),!1):!0}function $f(){if(xt!==null){if(Ft===0)var t=xt.return;else t=xt,aa=Rs=null,mf(t),hr=null,So=0,t=xt;for(;t!==null;)k0(t.alternate,t),t=t.return;xt=null}}function Mr(t,n){var a=t.timeoutHandle;a!==-1&&(t.timeoutHandle=-1,oy(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),ma=0,$f(),qt=t,xt=a=na(t.current,null),Mt=n,Ft=0,li=null,Wa=!1,xr=He(t,n),qf=!1,Sr=ci=Yf=Is=qa=sn=0,Yn=Io=null,Zf=!1,(n&8)!==0&&(n|=n&32);var o=t.entangledLanes;if(o!==0)for(t=t.entanglements,o&=n;0<o;){var u=31-Fe(o),f=1<<u;n|=t[u],o&=~f}return pa=n,Tl(),a}function dg(t,n){ct=null,P.H=Co,n===fr||n===Ll?(n=wm(),Ft=3):n===nf?(n=wm(),Ft=4):Ft=n===Uf?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,li=n,xt===null&&(sn=1,ql(t,vi(n,t.current)))}function pg(){var t=ri.current;return t===null?!0:(Mt&4194048)===Mt?Mi===null:(Mt&62914560)===Mt||(Mt&536870912)!==0?t===Mi:!1}function mg(){var t=P.H;return P.H=Co,t===null?Co:t}function gg(){var t=P.A;return P.A=zS,t}function sc(){sn=4,Wa||(Mt&4194048)!==Mt&&ri.current!==null||(xr=!0),(qa&134217727)===0&&(Is&134217727)===0||qt===null||Ka(qt,Mt,ci,!1)}function eh(t,n,a){var o=Ut;Ut|=2;var u=mg(),f=gg();(qt!==t||Mt!==n)&&(ic=null,Mr(t,n)),n=!1;var x=sn;e:do try{if(Ft!==0&&xt!==null){var R=xt,G=li;switch(Ft){case 8:$f(),x=6;break e;case 3:case 2:case 9:case 6:ri.current===null&&(n=!0);var ae=Ft;if(Ft=0,li=null,br(t,R,G,ae),a&&xr){x=0;break e}break;default:ae=Ft,Ft=0,li=null,br(t,R,G,ae)}}VS(),x=sn;break}catch(me){dg(t,me)}while(!0);return n&&t.shellSuspendCounter++,aa=Rs=null,Ut=o,P.H=u,P.A=f,xt===null&&(qt=null,Mt=0,Tl()),x}function VS(){for(;xt!==null;)_g(xt)}function kS(t,n){var a=Ut;Ut|=2;var o=mg(),u=gg();qt!==t||Mt!==n?(ic=null,nc=De()+500,Mr(t,n)):xr=He(t,n);e:do try{if(Ft!==0&&xt!==null){n=xt;var f=li;t:switch(Ft){case 1:Ft=0,li=null,br(t,n,f,1);break;case 2:case 9:if(Rm(f)){Ft=0,li=null,vg(n);break}n=function(){Ft!==2&&Ft!==9||qt!==t||(Ft=7),ki(t)},f.then(n,n);break e;case 3:Ft=7;break e;case 4:Ft=5;break e;case 7:Rm(f)?(Ft=0,li=null,vg(n)):(Ft=0,li=null,br(t,n,f,7));break;case 5:var x=null;switch(xt.tag){case 26:x=xt.memoizedState;case 5:case 27:var R=xt;if(x?i_(x):R.stateNode.complete){Ft=0,li=null;var G=R.sibling;if(G!==null)xt=G;else{var ae=R.return;ae!==null?(xt=ae,rc(ae)):xt=null}break t}}Ft=0,li=null,br(t,n,f,5);break;case 6:Ft=0,li=null,br(t,n,f,6);break;case 8:$f(),sn=6;break e;default:throw Error(r(462))}}XS();break}catch(me){dg(t,me)}while(!0);return aa=Rs=null,P.H=o,P.A=u,Ut=a,xt!==null?0:(qt=null,Mt=0,Tl(),sn)}function XS(){for(;xt!==null&&!mt();)_g(xt)}function _g(t){var n=G0(t.alternate,t,pa);t.memoizedProps=t.pendingProps,n===null?rc(t):xt=n}function vg(t){var n=t,a=n.alternate;switch(n.tag){case 15:case 0:n=P0(a,n,n.pendingProps,n.type,void 0,Mt);break;case 11:n=P0(a,n,n.pendingProps,n.type.render,n.ref,Mt);break;case 5:mf(n);default:k0(a,n),n=xt=gm(n,pa),n=G0(a,n,pa)}t.memoizedProps=t.pendingProps,n===null?rc(t):xt=n}function br(t,n,a,o){aa=Rs=null,mf(n),hr=null,So=0;var u=n.return;try{if(NS(t,u,n,a,Mt)){sn=1,ql(t,vi(a,t.current)),xt=null;return}}catch(f){if(u!==null)throw xt=u,f;sn=1,ql(t,vi(a,t.current)),xt=null;return}n.flags&32768?(Et||o===1?t=!0:xr||(Mt&536870912)!==0?t=!1:(Wa=t=!0,(o===2||o===9||o===3||o===6)&&(o=ri.current,o!==null&&o.tag===13&&(o.flags|=16384))),xg(n,t)):rc(n)}function rc(t){var n=t;do{if((n.flags&32768)!==0){xg(n,Wa);return}t=n.return;var a=PS(n.alternate,n,pa);if(a!==null){xt=a;return}if(n=n.sibling,n!==null){xt=n;return}xt=n=t}while(n!==null);sn===0&&(sn=5)}function xg(t,n){do{var a=IS(t.alternate,t);if(a!==null){a.flags&=32767,xt=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(t=t.sibling,t!==null)){xt=t;return}xt=t=a}while(t!==null);sn=6,xt=null}function Sg(t,n,a,o,u,f,x,R,G){t.cancelPendingCommit=null;do oc();while(xn!==0);if((Ut&6)!==0)throw Error(r(327));if(n!==null){if(n===t.current)throw Error(r(177));if(f=n.lanes|n.childLanes,f|=Gu,nn(t,a,f,x,R,G),t===qt&&(xt=qt=null,Mt=0),yr=n,Za=t,ma=a,Kf=f,Qf=u,cg=o,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,YS(te,function(){return Tg(),null})):(t.callbackNode=null,t.callbackPriority=0),o=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||o){o=P.T,P.T=null,u=H.p,H.p=2,x=Ut,Ut|=4;try{FS(t,n,a)}finally{Ut=x,H.p=u,P.T=o}}xn=1,yg(),Mg(),bg()}}function yg(){if(xn===1){xn=0;var t=Za,n=yr,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=P.T,P.T=null;var o=H.p;H.p=2;var u=Ut;Ut|=4;try{tg(n,t);var f=hh,x=om(t.containerInfo),R=f.focusedElem,G=f.selectionRange;if(x!==R&&R&&R.ownerDocument&&rm(R.ownerDocument.documentElement,R)){if(G!==null&&Iu(R)){var ae=G.start,me=G.end;if(me===void 0&&(me=ae),"selectionStart"in R)R.selectionStart=ae,R.selectionEnd=Math.min(me,R.value.length);else{var xe=R.ownerDocument||document,ce=xe&&xe.defaultView||window;if(ce.getSelection){var ue=ce.getSelection(),We=R.textContent.length,et=Math.min(G.start,We),kt=G.end===void 0?et:Math.min(G.end,We);!ue.extend&&et>kt&&(x=kt,kt=et,et=x);var J=sm(R,et),X=sm(R,kt);if(J&&X&&(ue.rangeCount!==1||ue.anchorNode!==J.node||ue.anchorOffset!==J.offset||ue.focusNode!==X.node||ue.focusOffset!==X.offset)){var ie=xe.createRange();ie.setStart(J.node,J.offset),ue.removeAllRanges(),et>kt?(ue.addRange(ie),ue.extend(X.node,X.offset)):(ie.setEnd(X.node,X.offset),ue.addRange(ie))}}}}for(xe=[],ue=R;ue=ue.parentNode;)ue.nodeType===1&&xe.push({element:ue,left:ue.scrollLeft,top:ue.scrollTop});for(typeof R.focus=="function"&&R.focus(),R=0;R<xe.length;R++){var _e=xe[R];_e.element.scrollLeft=_e.left,_e.element.scrollTop=_e.top}}xc=!!fh,hh=fh=null}finally{Ut=u,H.p=o,P.T=a}}t.current=n,xn=2}}function Mg(){if(xn===2){xn=0;var t=Za,n=yr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=P.T,P.T=null;var o=H.p;H.p=2;var u=Ut;Ut|=4;try{K0(t,n.alternate,n)}finally{Ut=u,H.p=o,P.T=a}}xn=3}}function bg(){if(xn===4||xn===3){xn=0,Ht();var t=Za,n=yr,a=ma,o=cg;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?xn=5:(xn=0,yr=Za=null,Eg(t,t.pendingLanes));var u=t.pendingLanes;if(u===0&&(Ya=null),to(a),n=n.stateNode,de&&typeof de.onCommitFiberRoot=="function")try{de.onCommitFiberRoot(fe,n,void 0,(n.current.flags&128)===128)}catch{}if(o!==null){n=P.T,u=H.p,H.p=2,P.T=null;try{for(var f=t.onRecoverableError,x=0;x<o.length;x++){var R=o[x];f(R.value,{componentStack:R.stack})}}finally{P.T=n,H.p=u}}(ma&3)!==0&&oc(),ki(t),u=t.pendingLanes,(a&261930)!==0&&(u&42)!==0?t===Jf?Fo++:(Fo=0,Jf=t):Fo=0,Bo(0)}}function Eg(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,vo(n)))}function oc(){return yg(),Mg(),bg(),Tg()}function Tg(){if(xn!==5)return!1;var t=Za,n=Kf;Kf=0;var a=to(ma),o=P.T,u=H.p;try{H.p=32>a?32:a,P.T=null,a=Qf,Qf=null;var f=Za,x=ma;if(xn=0,yr=Za=null,ma=0,(Ut&6)!==0)throw Error(r(331));var R=Ut;if(Ut|=4,rg(f.current),ig(f,f.current,x,a),Ut=R,Bo(0,!1),de&&typeof de.onPostCommitFiberRoot=="function")try{de.onPostCommitFiberRoot(fe,f)}catch{}return!0}finally{H.p=u,P.T=o,Eg(t,n)}}function Ag(t,n,a){n=vi(a,n),n=Df(t.stateNode,n,2),t=Va(t,n,2),t!==null&&(nt(t,2),ki(t))}function Bt(t,n,a){if(t.tag===3)Ag(t,t,a);else for(;n!==null;){if(n.tag===3){Ag(n,t,a);break}else if(n.tag===1){var o=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Ya===null||!Ya.has(o))){t=vi(a,t),a=R0(2),o=Va(n,a,2),o!==null&&(C0(a,o,n,t),nt(o,2),ki(o));break}}n=n.return}}function th(t,n,a){var o=t.pingCache;if(o===null){o=t.pingCache=new HS;var u=new Set;o.set(n,u)}else u=o.get(n),u===void 0&&(u=new Set,o.set(n,u));u.has(a)||(qf=!0,u.add(a),t=jS.bind(null,t,n,a),n.then(t,t))}function jS(t,n,a){var o=t.pingCache;o!==null&&o.delete(n),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,qt===t&&(Mt&a)===a&&(sn===4||sn===3&&(Mt&62914560)===Mt&&300>De()-tc?(Ut&2)===0&&Mr(t,0):Yf|=a,Sr===Mt&&(Sr=0)),ki(t)}function Rg(t,n){n===0&&(n=Ee()),t=Es(t,n),t!==null&&(nt(t,n),ki(t))}function WS(t){var n=t.memoizedState,a=0;n!==null&&(a=n.retryLane),Rg(t,a)}function qS(t,n){var a=0;switch(t.tag){case 31:case 13:var o=t.stateNode,u=t.memoizedState;u!==null&&(a=u.retryLane);break;case 19:o=t.stateNode;break;case 22:o=t.stateNode._retryCache;break;default:throw Error(r(314))}o!==null&&o.delete(n),Rg(t,a)}function YS(t,n){return W(t,n)}var lc=null,Er=null,nh=!1,cc=!1,ih=!1,Qa=0;function ki(t){t!==Er&&t.next===null&&(Er===null?lc=Er=t:Er=Er.next=t),cc=!0,nh||(nh=!0,KS())}function Bo(t,n){if(!ih&&cc){ih=!0;do for(var a=!1,o=lc;o!==null;){if(t!==0){var u=o.pendingLanes;if(u===0)var f=0;else{var x=o.suspendedLanes,R=o.pingedLanes;f=(1<<31-Fe(42|t)+1)-1,f&=u&~(x&~R),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,Ug(o,f))}else f=Mt,f=ge(o,o===qt?f:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(f&3)===0||He(o,f)||(a=!0,Ug(o,f));o=o.next}while(a);ih=!1}}function ZS(){Cg()}function Cg(){cc=nh=!1;var t=0;Qa!==0&&ry()&&(t=Qa);for(var n=De(),a=null,o=lc;o!==null;){var u=o.next,f=wg(o,n);f===0?(o.next=null,a===null?lc=u:a.next=u,u===null&&(Er=a)):(a=o,(t!==0||(f&3)!==0)&&(cc=!0)),o=u}xn!==0&&xn!==5||Bo(t),Qa!==0&&(Qa=0)}function wg(t,n){for(var a=t.suspendedLanes,o=t.pingedLanes,u=t.expirationTimes,f=t.pendingLanes&-62914561;0<f;){var x=31-Fe(f),R=1<<x,G=u[x];G===-1?((R&a)===0||(R&o)!==0)&&(u[x]=Oe(R,n)):G<=n&&(t.expiredLanes|=R),f&=~R}if(n=qt,a=Mt,a=ge(t,t===n?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),o=t.callbackNode,a===0||t===n&&(Ft===2||Ft===9)||t.cancelPendingCommit!==null)return o!==null&&o!==null&&tn(o),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||He(t,a)){if(n=a&-a,n===t.callbackPriority)return n;switch(o!==null&&tn(o),to(a)){case 2:case 8:a=b;break;case 32:a=te;break;case 268435456:a=Te;break;default:a=te}return o=Dg.bind(null,t),a=W(a,o),t.callbackPriority=n,t.callbackNode=a,n}return o!==null&&o!==null&&tn(o),t.callbackPriority=2,t.callbackNode=null,2}function Dg(t,n){if(xn!==0&&xn!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(oc()&&t.callbackNode!==a)return null;var o=Mt;return o=ge(t,t===qt?o:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),o===0?null:(fg(t,o,n),wg(t,De()),t.callbackNode!=null&&t.callbackNode===a?Dg.bind(null,t):null)}function Ug(t,n){if(oc())return null;fg(t,n,!0)}function KS(){ly(function(){(Ut&6)!==0?W(U,ZS):Cg()})}function ah(){if(Qa===0){var t=cr;t===0&&(t=at,at<<=1,(at&261888)===0&&(at=256)),Qa=t}return Qa}function Ng(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Ss(""+t)}function Lg(t,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,t.id&&a.setAttribute("form",t.id),n.parentNode.insertBefore(a,n),t=new FormData(t),a.parentNode.removeChild(a),t}function QS(t,n,a,o,u){if(n==="submit"&&a&&a.stateNode===u){var f=Ng((u[Rn]||null).action),x=o.submitter;x&&(n=(n=x[Rn]||null)?Ng(n.formAction):x.getAttribute("formAction"),n!==null&&(f=n,x=null));var R=new yl("action","action",null,o,u);t.push({event:R,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(Qa!==0){var G=x?Lg(u,x):new FormData(u);Ef(a,{pending:!0,data:G,method:u.method,action:f},null,G)}}else typeof f=="function"&&(R.preventDefault(),G=x?Lg(u,x):new FormData(u),Ef(a,{pending:!0,data:G,method:u.method,action:f},f,G))},currentTarget:u}]})}}for(var sh=0;sh<Hu.length;sh++){var rh=Hu[sh],JS=rh.toLowerCase(),$S=rh[0].toUpperCase()+rh.slice(1);Di(JS,"on"+$S)}Di(um,"onAnimationEnd"),Di(fm,"onAnimationIteration"),Di(hm,"onAnimationStart"),Di("dblclick","onDoubleClick"),Di("focusin","onFocus"),Di("focusout","onBlur"),Di(mS,"onTransitionRun"),Di(gS,"onTransitionStart"),Di(_S,"onTransitionCancel"),Di(dm,"onTransitionEnd"),le("onMouseEnter",["mouseout","mouseover"]),le("onMouseLeave",["mouseout","mouseover"]),le("onPointerEnter",["pointerout","pointerover"]),le("onPointerLeave",["pointerout","pointerover"]),Y("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Y("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Y("onBeforeInput",["compositionend","keypress","textInput","paste"]),Y("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Y("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Y("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var zo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ey=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zo));function Og(t,n){n=(n&4)!==0;for(var a=0;a<t.length;a++){var o=t[a],u=o.event;o=o.listeners;e:{var f=void 0;if(n)for(var x=o.length-1;0<=x;x--){var R=o[x],G=R.instance,ae=R.currentTarget;if(R=R.listener,G!==f&&u.isPropagationStopped())break e;f=R,u.currentTarget=ae;try{f(u)}catch(me){El(me)}u.currentTarget=null,f=G}else for(x=0;x<o.length;x++){if(R=o[x],G=R.instance,ae=R.currentTarget,R=R.listener,G!==f&&u.isPropagationStopped())break e;f=R,u.currentTarget=ae;try{f(u)}catch(me){El(me)}u.currentTarget=null,f=G}}}}function St(t,n){var a=n[wa];a===void 0&&(a=n[wa]=new Set);var o=t+"__bubble";a.has(o)||(Pg(n,t,2,!1),a.add(o))}function oh(t,n,a){var o=0;n&&(o|=4),Pg(a,t,o,n)}var uc="_reactListening"+Math.random().toString(36).slice(2);function lh(t){if(!t[uc]){t[uc]=!0,_l.forEach(function(a){a!=="selectionchange"&&(ey.has(a)||oh(a,!1,t),oh(a,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[uc]||(n[uc]=!0,oh("selectionchange",!1,n))}}function Pg(t,n,a,o){switch(u_(n)){case 2:var u=Cy;break;case 8:u=wy;break;default:u=bh}a=u.bind(null,n,a,t),u=void 0,!Ru||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(u=!0),o?u!==void 0?t.addEventListener(n,a,{capture:!0,passive:u}):t.addEventListener(n,a,!0):u!==void 0?t.addEventListener(n,a,{passive:u}):t.addEventListener(n,a,!1)}function ch(t,n,a,o,u){var f=o;if((n&1)===0&&(n&2)===0&&o!==null)e:for(;;){if(o===null)return;var x=o.tag;if(x===3||x===4){var R=o.stateNode.containerInfo;if(R===u)break;if(x===4)for(x=o.return;x!==null;){var G=x.tag;if((G===3||G===4)&&x.stateNode.containerInfo===u)return;x=x.return}for(;R!==null;){if(x=Ua(R),x===null)return;if(G=x.tag,G===5||G===6||G===26||G===27){o=f=x;continue e}R=R.parentNode}}o=o.return}Hp(function(){var ae=f,me=Tu(a),xe=[];e:{var ce=pm.get(t);if(ce!==void 0){var ue=yl,We=t;switch(t){case"keypress":if(xl(a)===0)break e;case"keydown":case"keyup":ue=qx;break;case"focusin":We="focus",ue=Uu;break;case"focusout":We="blur",ue=Uu;break;case"beforeblur":case"afterblur":ue=Uu;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ue=kp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ue=Px;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ue=Kx;break;case um:case fm:case hm:ue=Bx;break;case dm:ue=Jx;break;case"scroll":case"scrollend":ue=Lx;break;case"wheel":ue=eS;break;case"copy":case"cut":case"paste":ue=Hx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ue=jp;break;case"toggle":case"beforetoggle":ue=nS}var et=(n&4)!==0,kt=!et&&(t==="scroll"||t==="scrollend"),J=et?ce!==null?ce+"Capture":null:ce;et=[];for(var X=ae,ie;X!==null;){var _e=X;if(ie=_e.stateNode,_e=_e.tag,_e!==5&&_e!==26&&_e!==27||ie===null||J===null||(_e=ro(X,J),_e!=null&&et.push(Ho(X,_e,ie))),kt)break;X=X.return}0<et.length&&(ce=new ue(ce,We,null,a,me),xe.push({event:ce,listeners:et}))}}if((n&7)===0){e:{if(ce=t==="mouseover"||t==="pointerover",ue=t==="mouseout"||t==="pointerout",ce&&a!==Eu&&(We=a.relatedTarget||a.fromElement)&&(Ua(We)||We[$i]))break e;if((ue||ce)&&(ce=me.window===me?me:(ce=me.ownerDocument)?ce.defaultView||ce.parentWindow:window,ue?(We=a.relatedTarget||a.toElement,ue=ae,We=We?Ua(We):null,We!==null&&(kt=c(We),et=We.tag,We!==kt||et!==5&&et!==27&&et!==6)&&(We=null)):(ue=null,We=ae),ue!==We)){if(et=kp,_e="onMouseLeave",J="onMouseEnter",X="mouse",(t==="pointerout"||t==="pointerover")&&(et=jp,_e="onPointerLeave",J="onPointerEnter",X="pointer"),kt=ue==null?ce:xs(ue),ie=We==null?ce:xs(We),ce=new et(_e,X+"leave",ue,a,me),ce.target=kt,ce.relatedTarget=ie,_e=null,Ua(me)===ae&&(et=new et(J,X+"enter",We,a,me),et.target=ie,et.relatedTarget=kt,_e=et),kt=_e,ue&&We)t:{for(et=ty,J=ue,X=We,ie=0,_e=J;_e;_e=et(_e))ie++;_e=0;for(var $e=X;$e;$e=et($e))_e++;for(;0<ie-_e;)J=et(J),ie--;for(;0<_e-ie;)X=et(X),_e--;for(;ie--;){if(J===X||X!==null&&J===X.alternate){et=J;break t}J=et(J),X=et(X)}et=null}else et=null;ue!==null&&Ig(xe,ce,ue,et,!1),We!==null&&kt!==null&&Ig(xe,kt,We,et,!0)}}e:{if(ce=ae?xs(ae):window,ue=ce.nodeName&&ce.nodeName.toLowerCase(),ue==="select"||ue==="input"&&ce.type==="file")var Ct=$p;else if(Qp(ce))if(em)Ct=hS;else{Ct=uS;var Ye=cS}else ue=ce.nodeName,!ue||ue.toLowerCase()!=="input"||ce.type!=="checkbox"&&ce.type!=="radio"?ae&&Nt(ae.elementType)&&(Ct=$p):Ct=fS;if(Ct&&(Ct=Ct(t,ae))){Jp(xe,Ct,a,me);break e}Ye&&Ye(t,ce,ae),t==="focusout"&&ae&&ce.type==="number"&&ae.memoizedProps.value!=null&&vt(ce,"number",ce.value)}switch(Ye=ae?xs(ae):window,t){case"focusin":(Qp(Ye)||Ye.contentEditable==="true")&&(tr=Ye,Fu=ae,mo=null);break;case"focusout":mo=Fu=tr=null;break;case"mousedown":Bu=!0;break;case"contextmenu":case"mouseup":case"dragend":Bu=!1,lm(xe,a,me);break;case"selectionchange":if(pS)break;case"keydown":case"keyup":lm(xe,a,me)}var ft;if(Lu)e:{switch(t){case"compositionstart":var bt="onCompositionStart";break e;case"compositionend":bt="onCompositionEnd";break e;case"compositionupdate":bt="onCompositionUpdate";break e}bt=void 0}else er?Zp(t,a)&&(bt="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(bt="onCompositionStart");bt&&(Wp&&a.locale!=="ko"&&(er||bt!=="onCompositionStart"?bt==="onCompositionEnd"&&er&&(ft=Gp()):(Pa=me,Cu="value"in Pa?Pa.value:Pa.textContent,er=!0)),Ye=fc(ae,bt),0<Ye.length&&(bt=new Xp(bt,t,null,a,me),xe.push({event:bt,listeners:Ye}),ft?bt.data=ft:(ft=Kp(a),ft!==null&&(bt.data=ft)))),(ft=aS?sS(t,a):rS(t,a))&&(bt=fc(ae,"onBeforeInput"),0<bt.length&&(Ye=new Xp("onBeforeInput","beforeinput",null,a,me),xe.push({event:Ye,listeners:bt}),Ye.data=ft)),QS(xe,t,ae,a,me)}Og(xe,n)})}function Ho(t,n,a){return{instance:t,listener:n,currentTarget:a}}function fc(t,n){for(var a=n+"Capture",o=[];t!==null;){var u=t,f=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||f===null||(u=ro(t,a),u!=null&&o.unshift(Ho(t,u,f)),u=ro(t,n),u!=null&&o.push(Ho(t,u,f))),t.tag===3)return o;t=t.return}return[]}function ty(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function Ig(t,n,a,o,u){for(var f=n._reactName,x=[];a!==null&&a!==o;){var R=a,G=R.alternate,ae=R.stateNode;if(R=R.tag,G!==null&&G===o)break;R!==5&&R!==26&&R!==27||ae===null||(G=ae,u?(ae=ro(a,f),ae!=null&&x.unshift(Ho(a,ae,G))):u||(ae=ro(a,f),ae!=null&&x.push(Ho(a,ae,G)))),a=a.return}x.length!==0&&t.push({event:n,listeners:x})}var ny=/\r\n?/g,iy=/\u0000|\uFFFD/g;function Fg(t){return(typeof t=="string"?t:""+t).replace(ny,`
`).replace(iy,"")}function Bg(t,n){return n=Fg(n),Fg(t)===n}function Vt(t,n,a,o,u,f){switch(a){case"children":typeof o=="string"?n==="body"||n==="textarea"&&o===""||ii(t,o):(typeof o=="number"||typeof o=="bigint")&&n!=="body"&&ii(t,""+o);break;case"className":je(t,"class",o);break;case"tabIndex":je(t,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":je(t,a,o);break;case"style":wi(t,o,f);break;case"data":if(n!=="object"){je(t,"data",o);break}case"src":case"href":if(o===""&&(n!=="a"||a!=="href")){t.removeAttribute(a);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){t.removeAttribute(a);break}o=Ss(""+o),t.setAttribute(a,o);break;case"action":case"formAction":if(typeof o=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&Vt(t,n,"name",u.name,u,null),Vt(t,n,"formEncType",u.formEncType,u,null),Vt(t,n,"formMethod",u.formMethod,u,null),Vt(t,n,"formTarget",u.formTarget,u,null)):(Vt(t,n,"encType",u.encType,u,null),Vt(t,n,"method",u.method,u,null),Vt(t,n,"target",u.target,u,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){t.removeAttribute(a);break}o=Ss(""+o),t.setAttribute(a,o);break;case"onClick":o!=null&&(t.onclick=ea);break;case"onScroll":o!=null&&St("scroll",t);break;case"onScrollEnd":o!=null&&St("scrollend",t);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(r(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(r(60));t.innerHTML=a}}break;case"multiple":t.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":t.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){t.removeAttribute("xlink:href");break}a=Ss(""+o),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,""+o):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":o===!0?t.setAttribute(a,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,o):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?t.setAttribute(a,o):t.removeAttribute(a);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?t.removeAttribute(a):t.setAttribute(a,o);break;case"popover":St("beforetoggle",t),St("toggle",t),Be(t,"popover",o);break;case"xlinkActuate":Xe(t,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":Xe(t,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":Xe(t,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":Xe(t,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":Xe(t,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":Xe(t,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":Xe(t,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":Xe(t,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":Xe(t,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":Be(t,"is",o);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=zi.get(a)||a,Be(t,a,o))}}function uh(t,n,a,o,u,f){switch(a){case"style":wi(t,o,f);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(r(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(r(60));t.innerHTML=a}}break;case"children":typeof o=="string"?ii(t,o):(typeof o=="number"||typeof o=="bigint")&&ii(t,""+o);break;case"onScroll":o!=null&&St("scroll",t);break;case"onScrollEnd":o!=null&&St("scrollend",t);break;case"onClick":o!=null&&(t.onclick=ea);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!A.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(u=a.endsWith("Capture"),n=a.slice(2,u?a.length-7:void 0),f=t[Rn]||null,f=f!=null?f[a]:null,typeof f=="function"&&t.removeEventListener(n,f,u),typeof o=="function")){typeof f!="function"&&f!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(n,o,u);break e}a in t?t[a]=o:o===!0?t.setAttribute(a,""):Be(t,a,o)}}}function Un(t,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":St("error",t),St("load",t);var o=!1,u=!1,f;for(f in a)if(a.hasOwnProperty(f)){var x=a[f];if(x!=null)switch(f){case"src":o=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:Vt(t,n,f,x,a,null)}}u&&Vt(t,n,"srcSet",a.srcSet,a,null),o&&Vt(t,n,"src",a.src,a,null);return;case"input":St("invalid",t);var R=f=x=u=null,G=null,ae=null;for(o in a)if(a.hasOwnProperty(o)){var me=a[o];if(me!=null)switch(o){case"name":u=me;break;case"type":x=me;break;case"checked":G=me;break;case"defaultChecked":ae=me;break;case"value":f=me;break;case"defaultValue":R=me;break;case"children":case"dangerouslySetInnerHTML":if(me!=null)throw Error(r(137,n));break;default:Vt(t,n,o,me,a,null)}}Pn(t,f,R,G,ae,x,u,!1);return;case"select":St("invalid",t),o=x=f=null;for(u in a)if(a.hasOwnProperty(u)&&(R=a[u],R!=null))switch(u){case"value":f=R;break;case"defaultValue":x=R;break;case"multiple":o=R;default:Vt(t,n,u,R,a,null)}n=f,a=x,t.multiple=!!o,n!=null?vn(t,!!o,n,!1):a!=null&&vn(t,!!o,a,!0);return;case"textarea":St("invalid",t),f=u=o=null;for(x in a)if(a.hasOwnProperty(x)&&(R=a[x],R!=null))switch(x){case"value":o=R;break;case"defaultValue":u=R;break;case"children":f=R;break;case"dangerouslySetInnerHTML":if(R!=null)throw Error(r(91));break;default:Vt(t,n,x,R,a,null)}Ci(t,o,u,f);return;case"option":for(G in a)a.hasOwnProperty(G)&&(o=a[G],o!=null)&&(G==="selected"?t.selected=o&&typeof o!="function"&&typeof o!="symbol":Vt(t,n,G,o,a,null));return;case"dialog":St("beforetoggle",t),St("toggle",t),St("cancel",t),St("close",t);break;case"iframe":case"object":St("load",t);break;case"video":case"audio":for(o=0;o<zo.length;o++)St(zo[o],t);break;case"image":St("error",t),St("load",t);break;case"details":St("toggle",t);break;case"embed":case"source":case"link":St("error",t),St("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(ae in a)if(a.hasOwnProperty(ae)&&(o=a[ae],o!=null))switch(ae){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:Vt(t,n,ae,o,a,null)}return;default:if(Nt(n)){for(me in a)a.hasOwnProperty(me)&&(o=a[me],o!==void 0&&uh(t,n,me,o,a,void 0));return}}for(R in a)a.hasOwnProperty(R)&&(o=a[R],o!=null&&Vt(t,n,R,o,a,null))}function ay(t,n,a,o){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,f=null,x=null,R=null,G=null,ae=null,me=null;for(ue in a){var xe=a[ue];if(a.hasOwnProperty(ue)&&xe!=null)switch(ue){case"checked":break;case"value":break;case"defaultValue":G=xe;default:o.hasOwnProperty(ue)||Vt(t,n,ue,null,o,xe)}}for(var ce in o){var ue=o[ce];if(xe=a[ce],o.hasOwnProperty(ce)&&(ue!=null||xe!=null))switch(ce){case"type":f=ue;break;case"name":u=ue;break;case"checked":ae=ue;break;case"defaultChecked":me=ue;break;case"value":x=ue;break;case"defaultValue":R=ue;break;case"children":case"dangerouslySetInnerHTML":if(ue!=null)throw Error(r(137,n));break;default:ue!==xe&&Vt(t,n,ce,ue,o,xe)}}Ve(t,x,R,G,ae,me,f,u);return;case"select":ue=x=R=ce=null;for(f in a)if(G=a[f],a.hasOwnProperty(f)&&G!=null)switch(f){case"value":break;case"multiple":ue=G;default:o.hasOwnProperty(f)||Vt(t,n,f,null,o,G)}for(u in o)if(f=o[u],G=a[u],o.hasOwnProperty(u)&&(f!=null||G!=null))switch(u){case"value":ce=f;break;case"defaultValue":R=f;break;case"multiple":x=f;default:f!==G&&Vt(t,n,u,f,o,G)}n=R,a=x,o=ue,ce!=null?vn(t,!!a,ce,!1):!!o!=!!a&&(n!=null?vn(t,!!a,n,!0):vn(t,!!a,a?[]:"",!1));return;case"textarea":ue=ce=null;for(R in a)if(u=a[R],a.hasOwnProperty(R)&&u!=null&&!o.hasOwnProperty(R))switch(R){case"value":break;case"children":break;default:Vt(t,n,R,null,o,u)}for(x in o)if(u=o[x],f=a[x],o.hasOwnProperty(x)&&(u!=null||f!=null))switch(x){case"value":ce=u;break;case"defaultValue":ue=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(r(91));break;default:u!==f&&Vt(t,n,x,u,o,f)}ni(t,ce,ue);return;case"option":for(var We in a)ce=a[We],a.hasOwnProperty(We)&&ce!=null&&!o.hasOwnProperty(We)&&(We==="selected"?t.selected=!1:Vt(t,n,We,null,o,ce));for(G in o)ce=o[G],ue=a[G],o.hasOwnProperty(G)&&ce!==ue&&(ce!=null||ue!=null)&&(G==="selected"?t.selected=ce&&typeof ce!="function"&&typeof ce!="symbol":Vt(t,n,G,ce,o,ue));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var et in a)ce=a[et],a.hasOwnProperty(et)&&ce!=null&&!o.hasOwnProperty(et)&&Vt(t,n,et,null,o,ce);for(ae in o)if(ce=o[ae],ue=a[ae],o.hasOwnProperty(ae)&&ce!==ue&&(ce!=null||ue!=null))switch(ae){case"children":case"dangerouslySetInnerHTML":if(ce!=null)throw Error(r(137,n));break;default:Vt(t,n,ae,ce,o,ue)}return;default:if(Nt(n)){for(var kt in a)ce=a[kt],a.hasOwnProperty(kt)&&ce!==void 0&&!o.hasOwnProperty(kt)&&uh(t,n,kt,void 0,o,ce);for(me in o)ce=o[me],ue=a[me],!o.hasOwnProperty(me)||ce===ue||ce===void 0&&ue===void 0||uh(t,n,me,ce,o,ue);return}}for(var J in a)ce=a[J],a.hasOwnProperty(J)&&ce!=null&&!o.hasOwnProperty(J)&&Vt(t,n,J,null,o,ce);for(xe in o)ce=o[xe],ue=a[xe],!o.hasOwnProperty(xe)||ce===ue||ce==null&&ue==null||Vt(t,n,xe,ce,o,ue)}function zg(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function sy(){if(typeof performance.getEntriesByType=="function"){for(var t=0,n=0,a=performance.getEntriesByType("resource"),o=0;o<a.length;o++){var u=a[o],f=u.transferSize,x=u.initiatorType,R=u.duration;if(f&&R&&zg(x)){for(x=0,R=u.responseEnd,o+=1;o<a.length;o++){var G=a[o],ae=G.startTime;if(ae>R)break;var me=G.transferSize,xe=G.initiatorType;me&&zg(xe)&&(G=G.responseEnd,x+=me*(G<R?1:(R-ae)/(G-ae)))}if(--o,n+=8*(f+x)/(u.duration/1e3),t++,10<t)break}}if(0<t)return n/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var fh=null,hh=null;function hc(t){return t.nodeType===9?t:t.ownerDocument}function Hg(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Gg(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function dh(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var ph=null;function ry(){var t=window.event;return t&&t.type==="popstate"?t===ph?!1:(ph=t,!0):(ph=null,!1)}var Vg=typeof setTimeout=="function"?setTimeout:void 0,oy=typeof clearTimeout=="function"?clearTimeout:void 0,kg=typeof Promise=="function"?Promise:void 0,ly=typeof queueMicrotask=="function"?queueMicrotask:typeof kg<"u"?function(t){return kg.resolve(null).then(t).catch(cy)}:Vg;function cy(t){setTimeout(function(){throw t})}function Ja(t){return t==="head"}function Xg(t,n){var a=n,o=0;do{var u=a.nextSibling;if(t.removeChild(a),u&&u.nodeType===8)if(a=u.data,a==="/$"||a==="/&"){if(o===0){t.removeChild(u),Cr(n);return}o--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")o++;else if(a==="html")Go(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,Go(a);for(var f=a.firstChild;f;){var x=f.nextSibling,R=f.nodeName;f[Da]||R==="SCRIPT"||R==="STYLE"||R==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=x}}else a==="body"&&Go(t.ownerDocument.body);a=u}while(a);Cr(n)}function jg(t,n){var a=t;t=0;do{var o=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),o&&o.nodeType===8)if(a=o.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=o}while(a)}function mh(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":mh(a),so(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function uy(t,n,a,o){for(;t.nodeType===1;){var u=a;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!o&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(o){if(!t[Da])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(f=t.getAttribute("rel"),f==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(f!==u.rel||t.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||t.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||t.getAttribute("title")!==(u.title==null?null:u.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(f=t.getAttribute("src"),(f!==(u.src==null?null:u.src)||t.getAttribute("type")!==(u.type==null?null:u.type)||t.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&f&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var f=u.name==null?null:""+u.name;if(u.type==="hidden"&&t.getAttribute("name")===f)return t}else return t;if(t=bi(t.nextSibling),t===null)break}return null}function fy(t,n,a){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=bi(t.nextSibling),t===null))return null;return t}function Wg(t,n){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!n||(t=bi(t.nextSibling),t===null))return null;return t}function gh(t){return t.data==="$?"||t.data==="$~"}function _h(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function hy(t,n){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=n;else if(t.data!=="$?"||a.readyState!=="loading")n();else{var o=function(){n(),a.removeEventListener("DOMContentLoaded",o)};a.addEventListener("DOMContentLoaded",o),t._reactRetry=o}}function bi(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return t}var vh=null;function qg(t){t=t.nextSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(n===0)return bi(t.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}t=t.nextSibling}return null}function Yg(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return t;n--}else a!=="/$"&&a!=="/&"||n++}t=t.previousSibling}return null}function Zg(t,n,a){switch(n=hc(a),t){case"html":if(t=n.documentElement,!t)throw Error(r(452));return t;case"head":if(t=n.head,!t)throw Error(r(453));return t;case"body":if(t=n.body,!t)throw Error(r(454));return t;default:throw Error(r(451))}}function Go(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);so(t)}var Ei=new Map,Kg=new Set;function dc(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var ga=H.d;H.d={f:dy,r:py,D:my,C:gy,L:_y,m:vy,X:Sy,S:xy,M:yy};function dy(){var t=ga.f(),n=ac();return t||n}function py(t){var n=Na(t);n!==null&&n.tag===5&&n.type==="form"?d0(n):ga.r(t)}var Tr=typeof document>"u"?null:document;function Qg(t,n,a){var o=Tr;if(o&&typeof n=="string"&&n){var u=Pt(n);u='link[rel="'+t+'"][href="'+u+'"]',typeof a=="string"&&(u+='[crossorigin="'+a+'"]'),Kg.has(u)||(Kg.add(u),t={rel:t,crossOrigin:a,href:n},o.querySelector(u)===null&&(n=o.createElement("link"),Un(n,"link",t),hn(n),o.head.appendChild(n)))}}function my(t){ga.D(t),Qg("dns-prefetch",t,null)}function gy(t,n){ga.C(t,n),Qg("preconnect",t,n)}function _y(t,n,a){ga.L(t,n,a);var o=Tr;if(o&&t&&n){var u='link[rel="preload"][as="'+Pt(n)+'"]';n==="image"&&a&&a.imageSrcSet?(u+='[imagesrcset="'+Pt(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(u+='[imagesizes="'+Pt(a.imageSizes)+'"]')):u+='[href="'+Pt(t)+'"]';var f=u;switch(n){case"style":f=Ar(t);break;case"script":f=Rr(t)}Ei.has(f)||(t=v({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:t,as:n},a),Ei.set(f,t),o.querySelector(u)!==null||n==="style"&&o.querySelector(Vo(f))||n==="script"&&o.querySelector(ko(f))||(n=o.createElement("link"),Un(n,"link",t),hn(n),o.head.appendChild(n)))}}function vy(t,n){ga.m(t,n);var a=Tr;if(a&&t){var o=n&&typeof n.as=="string"?n.as:"script",u='link[rel="modulepreload"][as="'+Pt(o)+'"][href="'+Pt(t)+'"]',f=u;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=Rr(t)}if(!Ei.has(f)&&(t=v({rel:"modulepreload",href:t},n),Ei.set(f,t),a.querySelector(u)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(ko(f)))return}o=a.createElement("link"),Un(o,"link",t),hn(o),a.head.appendChild(o)}}}function xy(t,n,a){ga.S(t,n,a);var o=Tr;if(o&&t){var u=La(o).hoistableStyles,f=Ar(t);n=n||"default";var x=u.get(f);if(!x){var R={loading:0,preload:null};if(x=o.querySelector(Vo(f)))R.loading=5;else{t=v({rel:"stylesheet",href:t,"data-precedence":n},a),(a=Ei.get(f))&&xh(t,a);var G=x=o.createElement("link");hn(G),Un(G,"link",t),G._p=new Promise(function(ae,me){G.onload=ae,G.onerror=me}),G.addEventListener("load",function(){R.loading|=1}),G.addEventListener("error",function(){R.loading|=2}),R.loading|=4,pc(x,n,o)}x={type:"stylesheet",instance:x,count:1,state:R},u.set(f,x)}}}function Sy(t,n){ga.X(t,n);var a=Tr;if(a&&t){var o=La(a).hoistableScripts,u=Rr(t),f=o.get(u);f||(f=a.querySelector(ko(u)),f||(t=v({src:t,async:!0},n),(n=Ei.get(u))&&Sh(t,n),f=a.createElement("script"),hn(f),Un(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(u,f))}}function yy(t,n){ga.M(t,n);var a=Tr;if(a&&t){var o=La(a).hoistableScripts,u=Rr(t),f=o.get(u);f||(f=a.querySelector(ko(u)),f||(t=v({src:t,async:!0,type:"module"},n),(n=Ei.get(u))&&Sh(t,n),f=a.createElement("script"),hn(f),Un(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(u,f))}}function Jg(t,n,a,o){var u=(u=se.current)?dc(u):null;if(!u)throw Error(r(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=Ar(a.href),a=La(u).hoistableStyles,o=a.get(n),o||(o={type:"style",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=Ar(a.href);var f=La(u).hoistableStyles,x=f.get(t);if(x||(u=u.ownerDocument||u,x={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(t,x),(f=u.querySelector(Vo(t)))&&!f._p&&(x.instance=f,x.state.loading=5),Ei.has(t)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ei.set(t,a),f||My(u,t,a,x.state))),n&&o===null)throw Error(r(528,""));return x}if(n&&o!==null)throw Error(r(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=Rr(a),a=La(u).hoistableScripts,o=a.get(n),o||(o={type:"script",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,t))}}function Ar(t){return'href="'+Pt(t)+'"'}function Vo(t){return'link[rel="stylesheet"]['+t+"]"}function $g(t){return v({},t,{"data-precedence":t.precedence,precedence:null})}function My(t,n,a,o){t.querySelector('link[rel="preload"][as="style"]['+n+"]")?o.loading=1:(n=t.createElement("link"),o.preload=n,n.addEventListener("load",function(){return o.loading|=1}),n.addEventListener("error",function(){return o.loading|=2}),Un(n,"link",a),hn(n),t.head.appendChild(n))}function Rr(t){return'[src="'+Pt(t)+'"]'}function ko(t){return"script[async]"+t}function e_(t,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var o=t.querySelector('style[data-href~="'+Pt(a.href)+'"]');if(o)return n.instance=o,hn(o),o;var u=v({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return o=(t.ownerDocument||t).createElement("style"),hn(o),Un(o,"style",u),pc(o,a.precedence,t),n.instance=o;case"stylesheet":u=Ar(a.href);var f=t.querySelector(Vo(u));if(f)return n.state.loading|=4,n.instance=f,hn(f),f;o=$g(a),(u=Ei.get(u))&&xh(o,u),f=(t.ownerDocument||t).createElement("link"),hn(f);var x=f;return x._p=new Promise(function(R,G){x.onload=R,x.onerror=G}),Un(f,"link",o),n.state.loading|=4,pc(f,a.precedence,t),n.instance=f;case"script":return f=Rr(a.src),(u=t.querySelector(ko(f)))?(n.instance=u,hn(u),u):(o=a,(u=Ei.get(f))&&(o=v({},a),Sh(o,u)),t=t.ownerDocument||t,u=t.createElement("script"),hn(u),Un(u,"link",o),t.head.appendChild(u),n.instance=u);case"void":return null;default:throw Error(r(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(o=n.instance,n.state.loading|=4,pc(o,a.precedence,t));return n.instance}function pc(t,n,a){for(var o=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=o.length?o[o.length-1]:null,f=u,x=0;x<o.length;x++){var R=o[x];if(R.dataset.precedence===n)f=R;else if(f!==u)break}f?f.parentNode.insertBefore(t,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(t,n.firstChild))}function xh(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function Sh(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var mc=null;function t_(t,n,a){if(mc===null){var o=new Map,u=mc=new Map;u.set(a,o)}else u=mc,o=u.get(a),o||(o=new Map,u.set(a,o));if(o.has(t))return o;for(o.set(t,null),a=a.getElementsByTagName(t),u=0;u<a.length;u++){var f=a[u];if(!(f[Da]||f[cn]||t==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var x=f.getAttribute(n)||"";x=t+x;var R=o.get(x);R?R.push(f):o.set(x,[f])}}return o}function n_(t,n,a){t=t.ownerDocument||t,t.head.insertBefore(a,n==="title"?t.querySelector("head > title"):null)}function by(t,n,a){if(a===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;return n.rel==="stylesheet"?(t=n.disabled,typeof n.precedence=="string"&&t==null):!0;case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function i_(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function Ey(t,n,a,o){if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var u=Ar(o.href),f=n.querySelector(Vo(u));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(t.count++,t=gc.bind(t),n.then(t,t)),a.state.loading|=4,a.instance=f,hn(f);return}f=n.ownerDocument||n,o=$g(o),(u=Ei.get(u))&&xh(o,u),f=f.createElement("link"),hn(f);var x=f;x._p=new Promise(function(R,G){x.onload=R,x.onerror=G}),Un(f,"link",o),a.instance=f}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(t.count++,a=gc.bind(t),n.addEventListener("load",a),n.addEventListener("error",a))}}var yh=0;function Ty(t,n){return t.stylesheets&&t.count===0&&vc(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var o=setTimeout(function(){if(t.stylesheets&&vc(t,t.stylesheets),t.unsuspend){var f=t.unsuspend;t.unsuspend=null,f()}},6e4+n);0<t.imgBytes&&yh===0&&(yh=62500*sy());var u=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&vc(t,t.stylesheets),t.unsuspend)){var f=t.unsuspend;t.unsuspend=null,f()}},(t.imgBytes>yh?50:800)+n);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(o),clearTimeout(u)}}:null}function gc(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)vc(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var _c=null;function vc(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,_c=new Map,n.forEach(Ay,t),_c=null,gc.call(t))}function Ay(t,n){if(!(n.state.loading&4)){var a=_c.get(t);if(a)var o=a.get(null);else{a=new Map,_c.set(t,a);for(var u=t.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<u.length;f++){var x=u[f];(x.nodeName==="LINK"||x.getAttribute("media")!=="not all")&&(a.set(x.dataset.precedence,x),o=x)}o&&a.set(null,o)}u=n.instance,x=u.getAttribute("data-precedence"),f=a.get(x)||o,f===o&&a.set(null,u),a.set(x,u),this.count++,o=gc.bind(this),u.addEventListener("load",o),u.addEventListener("error",o),f?f.parentNode.insertBefore(u,f.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(u,t.firstChild)),n.state.loading|=4}}var Xo={$$typeof:L,Provider:null,Consumer:null,_currentValue:ne,_currentValue2:ne,_threadCount:0};function Ry(t,n,a,o,u,f,x,R,G){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=qe(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=qe(0),this.hiddenUpdates=qe(null),this.identifierPrefix=o,this.onUncaughtError=u,this.onCaughtError=f,this.onRecoverableError=x,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=G,this.incompleteTransitions=new Map}function a_(t,n,a,o,u,f,x,R,G,ae,me,xe){return t=new Ry(t,n,a,x,G,ae,me,xe,R),n=1,f===!0&&(n|=24),f=si(3,null,null,n),t.current=f,f.stateNode=t,n=$u(),n.refCount++,t.pooledCache=n,n.refCount++,f.memoizedState={element:o,isDehydrated:a,cache:n},af(f),t}function s_(t){return t?(t=ar,t):ar}function r_(t,n,a,o,u,f){u=s_(u),o.context===null?o.context=u:o.pendingContext=u,o=Ga(n),o.payload={element:a},f=f===void 0?null:f,f!==null&&(o.callback=f),a=Va(t,o,n),a!==null&&(Zn(a,t,n),Mo(a,t,n))}function o_(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<n?a:n}}function Mh(t,n){o_(t,n),(t=t.alternate)&&o_(t,n)}function l_(t){if(t.tag===13||t.tag===31){var n=Es(t,67108864);n!==null&&Zn(n,t,67108864),Mh(t,67108864)}}function c_(t){if(t.tag===13||t.tag===31){var n=ui();n=vs(n);var a=Es(t,n);a!==null&&Zn(a,t,n),Mh(t,n)}}var xc=!0;function Cy(t,n,a,o){var u=P.T;P.T=null;var f=H.p;try{H.p=2,bh(t,n,a,o)}finally{H.p=f,P.T=u}}function wy(t,n,a,o){var u=P.T;P.T=null;var f=H.p;try{H.p=8,bh(t,n,a,o)}finally{H.p=f,P.T=u}}function bh(t,n,a,o){if(xc){var u=Eh(o);if(u===null)ch(t,n,o,Sc,a),f_(t,o);else if(Uy(u,t,n,a,o))o.stopPropagation();else if(f_(t,o),n&4&&-1<Dy.indexOf(t)){for(;u!==null;){var f=Na(u);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var x=Re(f.pendingLanes);if(x!==0){var R=f;for(R.pendingLanes|=2,R.entangledLanes|=2;x;){var G=1<<31-Fe(x);R.entanglements[1]|=G,x&=~G}ki(f),(Ut&6)===0&&(nc=De()+500,Bo(0))}}break;case 31:case 13:R=Es(f,2),R!==null&&Zn(R,f,2),ac(),Mh(f,2)}if(f=Eh(o),f===null&&ch(t,n,o,Sc,a),f===u)break;u=f}u!==null&&o.stopPropagation()}else ch(t,n,o,null,a)}}function Eh(t){return t=Tu(t),Th(t)}var Sc=null;function Th(t){if(Sc=null,t=Ua(t),t!==null){var n=c(t);if(n===null)t=null;else{var a=n.tag;if(a===13){if(t=h(n),t!==null)return t;t=null}else if(a===31){if(t=p(n),t!==null)return t;t=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return Sc=t,null}function u_(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Qt()){case U:return 2;case b:return 8;case te:case ve:return 32;case Te:return 268435456;default:return 32}default:return 32}}var Ah=!1,$a=null,es=null,ts=null,jo=new Map,Wo=new Map,ns=[],Dy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function f_(t,n){switch(t){case"focusin":case"focusout":$a=null;break;case"dragenter":case"dragleave":es=null;break;case"mouseover":case"mouseout":ts=null;break;case"pointerover":case"pointerout":jo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Wo.delete(n.pointerId)}}function qo(t,n,a,o,u,f){return t===null||t.nativeEvent!==f?(t={blockedOn:n,domEventName:a,eventSystemFlags:o,nativeEvent:f,targetContainers:[u]},n!==null&&(n=Na(n),n!==null&&l_(n)),t):(t.eventSystemFlags|=o,n=t.targetContainers,u!==null&&n.indexOf(u)===-1&&n.push(u),t)}function Uy(t,n,a,o,u){switch(n){case"focusin":return $a=qo($a,t,n,a,o,u),!0;case"dragenter":return es=qo(es,t,n,a,o,u),!0;case"mouseover":return ts=qo(ts,t,n,a,o,u),!0;case"pointerover":var f=u.pointerId;return jo.set(f,qo(jo.get(f)||null,t,n,a,o,u)),!0;case"gotpointercapture":return f=u.pointerId,Wo.set(f,qo(Wo.get(f)||null,t,n,a,o,u)),!0}return!1}function h_(t){var n=Ua(t.target);if(n!==null){var a=c(n);if(a!==null){if(n=a.tag,n===13){if(n=h(a),n!==null){t.blockedOn=n,io(t.priority,function(){c_(a)});return}}else if(n===31){if(n=p(a),n!==null){t.blockedOn=n,io(t.priority,function(){c_(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function yc(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var a=Eh(t.nativeEvent);if(a===null){a=t.nativeEvent;var o=new a.constructor(a.type,a);Eu=o,a.target.dispatchEvent(o),Eu=null}else return n=Na(a),n!==null&&l_(n),t.blockedOn=a,!1;n.shift()}return!0}function d_(t,n,a){yc(t)&&a.delete(n)}function Ny(){Ah=!1,$a!==null&&yc($a)&&($a=null),es!==null&&yc(es)&&(es=null),ts!==null&&yc(ts)&&(ts=null),jo.forEach(d_),Wo.forEach(d_)}function Mc(t,n){t.blockedOn===n&&(t.blockedOn=null,Ah||(Ah=!0,s.unstable_scheduleCallback(s.unstable_NormalPriority,Ny)))}var bc=null;function p_(t){bc!==t&&(bc=t,s.unstable_scheduleCallback(s.unstable_NormalPriority,function(){bc===t&&(bc=null);for(var n=0;n<t.length;n+=3){var a=t[n],o=t[n+1],u=t[n+2];if(typeof o!="function"){if(Th(o||a)===null)continue;break}var f=Na(a);f!==null&&(t.splice(n,3),n-=3,Ef(f,{pending:!0,data:u,method:a.method,action:o},o,u))}}))}function Cr(t){function n(G){return Mc(G,t)}$a!==null&&Mc($a,t),es!==null&&Mc(es,t),ts!==null&&Mc(ts,t),jo.forEach(n),Wo.forEach(n);for(var a=0;a<ns.length;a++){var o=ns[a];o.blockedOn===t&&(o.blockedOn=null)}for(;0<ns.length&&(a=ns[0],a.blockedOn===null);)h_(a),a.blockedOn===null&&ns.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(o=0;o<a.length;o+=3){var u=a[o],f=a[o+1],x=u[Rn]||null;if(typeof f=="function")x||p_(a);else if(x){var R=null;if(f&&f.hasAttribute("formAction")){if(u=f,x=f[Rn]||null)R=x.formAction;else if(Th(u)!==null)continue}else R=x.action;typeof R=="function"?a[o+1]=R:(a.splice(o,3),o-=3),p_(a)}}}function m_(){function t(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(x){return u=x})},focusReset:"manual",scroll:"manual"})}function n(){u!==null&&(u(),u=null),o||setTimeout(a,20)}function a(){if(!o&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,u=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){o=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),u!==null&&(u(),u=null)}}}function Rh(t){this._internalRoot=t}Ec.prototype.render=Rh.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(r(409));var a=n.current,o=ui();r_(a,o,t,n,null,null)},Ec.prototype.unmount=Rh.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;r_(t.current,2,null,t,null,null),ac(),n[$i]=null}};function Ec(t){this._internalRoot=t}Ec.prototype.unstable_scheduleHydration=function(t){if(t){var n=no();t={blockedOn:null,target:t,priority:n};for(var a=0;a<ns.length&&n!==0&&n<ns[a].priority;a++);ns.splice(a,0,t),a===0&&h_(t)}};var g_=e.version;if(g_!=="19.2.6")throw Error(r(527,g_,"19.2.6"));H.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(r(188)):(t=Object.keys(t).join(","),Error(r(268,t)));return t=d(n),t=t!==null?_(t):null,t=t===null?null:t.stateNode,t};var Ly={bundleType:0,version:"19.2.6",rendererPackageName:"react-dom",currentDispatcherRef:P,reconcilerVersion:"19.2.6"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Tc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Tc.isDisabled&&Tc.supportsFiber)try{fe=Tc.inject(Ly),de=Tc}catch{}}return Zo.createRoot=function(t,n){if(!l(t))throw Error(r(299));var a=!1,o="",u=b0,f=E0,x=T0;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(x=n.onRecoverableError)),n=a_(t,1,!1,null,null,a,o,null,u,f,x,m_),t[$i]=n.current,lh(t),new Rh(n)},Zo.hydrateRoot=function(t,n,a){if(!l(t))throw Error(r(299));var o=!1,u="",f=b0,x=E0,R=T0,G=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(u=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(x=a.onCaughtError),a.onRecoverableError!==void 0&&(R=a.onRecoverableError),a.formState!==void 0&&(G=a.formState)),n=a_(t,1,!0,n,a??null,o,u,G,f,x,R,m_),n.context=s_(null),a=n.current,o=ui(),o=vs(o),u=Ga(o),u.callback=null,Va(a,u,o),a=o,n.current.lanes=a,nt(n,a),ki(n),t[$i]=n.current,lh(t),new Ec(n)},Zo.version="19.2.6",Zo}var A_;function jy(){if(A_)return Dh.exports;A_=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Dh.exports=Xy(),Dh.exports}var Wy=jy();const qy=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Hv=(...s)=>s.filter((e,i,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===i).join(" ").trim();var Yy={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const Zy=Qe.forwardRef(({color:s="currentColor",size:e=24,strokeWidth:i=2,absoluteStrokeWidth:r,className:l="",children:c,iconNode:h,...p},m)=>Qe.createElement("svg",{ref:m,...Yy,width:e,height:e,stroke:s,strokeWidth:r?Number(i)*24/Number(e):i,className:Hv("lucide",l),...p},[...h.map(([d,_])=>Qe.createElement(d,_)),...Array.isArray(c)?c:[c]]));const Bi=(s,e)=>{const i=Qe.forwardRef(({className:r,...l},c)=>Qe.createElement(Zy,{ref:c,iconNode:e,className:Hv(`lucide-${qy(s)}`,r),...l}));return i.displayName=`${s}`,i};const Ky=Bi("BookOpen",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);const Qy=Bi("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);const Jy=Bi("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);const $y=Bi("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);const eM=Bi("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);const tM=Bi("CodeXml",[["path",{d:"m18 16 4-4-4-4",key:"1inbqp"}],["path",{d:"m6 8-4 4 4 4",key:"15zrgr"}],["path",{d:"m14.5 4-5 16",key:"e7oirm"}]]);const nM=Bi("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);const iM=Bi("Github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);const Gv=Bi("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);const mp=Bi("Layers",[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]]);const aM=Bi("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);const gp="184",Wr={ROTATE:0,DOLLY:1,PAN:2},jr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},sM=0,R_=1,rM=2,nu=1,Vv=2,al=3,ps=0,$n=1,ba=2,Ta=0,qr=1,C_=2,w_=3,D_=4,oM=5,Gs=100,lM=101,cM=102,uM=103,fM=104,hM=200,dM=201,pM=202,mM=203,Sd=204,yd=205,gM=206,_M=207,vM=208,xM=209,SM=210,yM=211,MM=212,bM=213,EM=214,Md=0,bd=1,Ed=2,Zr=3,Td=4,Ad=5,Rd=6,Cd=7,kv=0,TM=1,AM=2,Zi=0,Xv=1,jv=2,Wv=3,_p=4,qv=5,Yv=6,Zv=7,Kv=300,qs=301,Kr=302,Oh=303,Ph=304,Su=306,wd=1e3,Ea=1001,Dd=1002,Ln=1003,RM=1004,Ac=1005,zn=1006,Ih=1007,Xs=1008,di=1009,Qv=1010,Jv=1011,cl=1012,vp=1013,Qi=1014,qi=1015,Ra=1016,xp=1017,Sp=1018,ul=1020,$v=35902,ex=35899,tx=1021,nx=1022,Ii=1023,Ca=1026,js=1027,ix=1028,yp=1029,Ys=1030,Mp=1031,bp=1033,iu=33776,au=33777,su=33778,ru=33779,Ud=35840,Nd=35841,Ld=35842,Od=35843,Pd=36196,Id=37492,Fd=37496,Bd=37488,zd=37489,cu=37490,Hd=37491,Gd=37808,Vd=37809,kd=37810,Xd=37811,jd=37812,Wd=37813,qd=37814,Yd=37815,Zd=37816,Kd=37817,Qd=37818,Jd=37819,$d=37820,ep=37821,tp=36492,np=36494,ip=36495,ap=36283,sp=36284,uu=36285,rp=36286,CM=3200,op=0,wM=1,fs="",Jn="srgb",fu="srgb-linear",hu="linear",zt="srgb",wr=7680,U_=519,DM=512,UM=513,NM=514,Ep=515,LM=516,OM=517,Tp=518,PM=519,N_=35044,L_="300 es",Yi=2e3,fl=2001;function IM(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function du(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function FM(){const s=du("canvas");return s.style.display="block",s}const O_={};function P_(...s){const e="THREE."+s.shift();console.log(e,...s)}function ax(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const i=s[1];i&&i.isStackTrace?s[0]+=" "+i.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function tt(...s){s=ax(s);const e="THREE."+s.shift();{const i=s[0];i&&i.isStackTrace?console.warn(i.getError(e)):console.warn(e,...s)}}function At(...s){s=ax(s);const e="THREE."+s.shift();{const i=s[0];i&&i.isStackTrace?console.error(i.getError(e)):console.error(e,...s)}}function lp(...s){const e=s.join(" ");e in O_||(O_[e]=!0,tt(...s))}function BM(s,e,i){return new Promise(function(r,l){function c(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:l();break;case s.TIMEOUT_EXPIRED:setTimeout(c,i);break;default:r()}}setTimeout(c,i)})}const zM={[Md]:bd,[Ed]:Rd,[Td]:Cd,[Zr]:Ad,[bd]:Md,[Rd]:Ed,[Cd]:Td,[Ad]:Zr};class _s{addEventListener(e,i){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(i)===-1&&r[e].push(i)}hasEventListener(e,i){const r=this._listeners;return r===void 0?!1:r[e]!==void 0&&r[e].indexOf(i)!==-1}removeEventListener(e,i){const r=this._listeners;if(r===void 0)return;const l=r[e];if(l!==void 0){const c=l.indexOf(i);c!==-1&&l.splice(c,1)}}dispatchEvent(e){const i=this._listeners;if(i===void 0)return;const r=i[e.type];if(r!==void 0){e.target=this;const l=r.slice(0);for(let c=0,h=l.length;c<h;c++)l[c].call(this,e);e.target=null}}}const Fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ol=Math.PI/180,cp=180/Math.PI;function hl(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Fn[s&255]+Fn[s>>8&255]+Fn[s>>16&255]+Fn[s>>24&255]+"-"+Fn[e&255]+Fn[e>>8&255]+"-"+Fn[e>>16&15|64]+Fn[e>>24&255]+"-"+Fn[i&63|128]+Fn[i>>8&255]+"-"+Fn[i>>16&255]+Fn[i>>24&255]+Fn[r&255]+Fn[r>>8&255]+Fn[r>>16&255]+Fn[r>>24&255]).toLowerCase()}function gt(s,e,i){return Math.max(e,Math.min(i,s))}function HM(s,e){return(s%e+e)%e}function Fh(s,e,i){return(1-i)*s+i*e}function Ko(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Kn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const GM={DEG2RAD:ol},Op=class Op{constructor(e=0,i=0){this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const i=this.x,r=this.y,l=e.elements;return this.x=l[0]*i+l[3]*r+l[6],this.y=l[1]*i+l[4]*r+l[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=gt(this.x,e.x,i.x),this.y=gt(this.y,e.y,i.y),this}clampScalar(e,i){return this.x=gt(this.x,e,i),this.y=gt(this.y,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(gt(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(gt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y;return i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){const r=Math.cos(i),l=Math.sin(i),c=this.x-e.x,h=this.y-e.y;return this.x=c*r-h*l+e.x,this.y=c*l+h*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Op.prototype.isVector2=!0;let ot=Op;class ms{constructor(e=0,i=0,r=0,l=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=r,this._w=l}static slerpFlat(e,i,r,l,c,h,p){let m=r[l+0],d=r[l+1],_=r[l+2],v=r[l+3],g=c[h+0],M=c[h+1],E=c[h+2],C=c[h+3];if(v!==C||m!==g||d!==M||_!==E){let y=m*g+d*M+_*E+v*C;y<0&&(g=-g,M=-M,E=-E,C=-C,y=-y);let S=1-p;if(y<.9995){const w=Math.acos(y),L=Math.sin(w);S=Math.sin(S*w)/L,p=Math.sin(p*w)/L,m=m*S+g*p,d=d*S+M*p,_=_*S+E*p,v=v*S+C*p}else{m=m*S+g*p,d=d*S+M*p,_=_*S+E*p,v=v*S+C*p;const w=1/Math.sqrt(m*m+d*d+_*_+v*v);m*=w,d*=w,_*=w,v*=w}}e[i]=m,e[i+1]=d,e[i+2]=_,e[i+3]=v}static multiplyQuaternionsFlat(e,i,r,l,c,h){const p=r[l],m=r[l+1],d=r[l+2],_=r[l+3],v=c[h],g=c[h+1],M=c[h+2],E=c[h+3];return e[i]=p*E+_*v+m*M-d*g,e[i+1]=m*E+_*g+d*v-p*M,e[i+2]=d*E+_*M+p*g-m*v,e[i+3]=_*E-p*v-m*g-d*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,r,l){return this._x=e,this._y=i,this._z=r,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){const r=e._x,l=e._y,c=e._z,h=e._order,p=Math.cos,m=Math.sin,d=p(r/2),_=p(l/2),v=p(c/2),g=m(r/2),M=m(l/2),E=m(c/2);switch(h){case"XYZ":this._x=g*_*v+d*M*E,this._y=d*M*v-g*_*E,this._z=d*_*E+g*M*v,this._w=d*_*v-g*M*E;break;case"YXZ":this._x=g*_*v+d*M*E,this._y=d*M*v-g*_*E,this._z=d*_*E-g*M*v,this._w=d*_*v+g*M*E;break;case"ZXY":this._x=g*_*v-d*M*E,this._y=d*M*v+g*_*E,this._z=d*_*E+g*M*v,this._w=d*_*v-g*M*E;break;case"ZYX":this._x=g*_*v-d*M*E,this._y=d*M*v+g*_*E,this._z=d*_*E-g*M*v,this._w=d*_*v+g*M*E;break;case"YZX":this._x=g*_*v+d*M*E,this._y=d*M*v+g*_*E,this._z=d*_*E-g*M*v,this._w=d*_*v-g*M*E;break;case"XZY":this._x=g*_*v-d*M*E,this._y=d*M*v-g*_*E,this._z=d*_*E+g*M*v,this._w=d*_*v+g*M*E;break;default:tt("Quaternion: .setFromEuler() encountered an unknown order: "+h)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,i){const r=i/2,l=Math.sin(r);return this._x=e.x*l,this._y=e.y*l,this._z=e.z*l,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const i=e.elements,r=i[0],l=i[4],c=i[8],h=i[1],p=i[5],m=i[9],d=i[2],_=i[6],v=i[10],g=r+p+v;if(g>0){const M=.5/Math.sqrt(g+1);this._w=.25/M,this._x=(_-m)*M,this._y=(c-d)*M,this._z=(h-l)*M}else if(r>p&&r>v){const M=2*Math.sqrt(1+r-p-v);this._w=(_-m)/M,this._x=.25*M,this._y=(l+h)/M,this._z=(c+d)/M}else if(p>v){const M=2*Math.sqrt(1+p-r-v);this._w=(c-d)/M,this._x=(l+h)/M,this._y=.25*M,this._z=(m+_)/M}else{const M=2*Math.sqrt(1+v-r-p);this._w=(h-l)/M,this._x=(c+d)/M,this._y=(m+_)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let r=e.dot(i)+1;return r<1e-8?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(gt(this.dot(e),-1,1)))}rotateTowards(e,i){const r=this.angleTo(e);if(r===0)return this;const l=Math.min(1,i/r);return this.slerp(e,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){const r=e._x,l=e._y,c=e._z,h=e._w,p=i._x,m=i._y,d=i._z,_=i._w;return this._x=r*_+h*p+l*d-c*m,this._y=l*_+h*m+c*p-r*d,this._z=c*_+h*d+r*m-l*p,this._w=h*_-r*p-l*m-c*d,this._onChangeCallback(),this}slerp(e,i){let r=e._x,l=e._y,c=e._z,h=e._w,p=this.dot(e);p<0&&(r=-r,l=-l,c=-c,h=-h,p=-p);let m=1-i;if(p<.9995){const d=Math.acos(p),_=Math.sin(d);m=Math.sin(m*d)/_,i=Math.sin(i*d)/_,this._x=this._x*m+r*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+h*i,this._onChangeCallback()}else this._x=this._x*m+r*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+h*i,this.normalize();return this}slerpQuaternions(e,i,r){return this.copy(e).slerp(i,r)}random(){const e=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),r=Math.random(),l=Math.sqrt(1-r),c=Math.sqrt(r);return this.set(l*Math.sin(e),l*Math.cos(e),c*Math.sin(i),c*Math.cos(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Pp=class Pp{constructor(e=0,i=0,r=0){this.x=e,this.y=i,this.z=r}set(e,i,r){return r===void 0&&(r=this.z),this.x=e,this.y=i,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(I_.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(I_.setFromAxisAngle(e,i))}applyMatrix3(e){const i=this.x,r=this.y,l=this.z,c=e.elements;return this.x=c[0]*i+c[3]*r+c[6]*l,this.y=c[1]*i+c[4]*r+c[7]*l,this.z=c[2]*i+c[5]*r+c[8]*l,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,c=e.elements,h=1/(c[3]*i+c[7]*r+c[11]*l+c[15]);return this.x=(c[0]*i+c[4]*r+c[8]*l+c[12])*h,this.y=(c[1]*i+c[5]*r+c[9]*l+c[13])*h,this.z=(c[2]*i+c[6]*r+c[10]*l+c[14])*h,this}applyQuaternion(e){const i=this.x,r=this.y,l=this.z,c=e.x,h=e.y,p=e.z,m=e.w,d=2*(h*l-p*r),_=2*(p*i-c*l),v=2*(c*r-h*i);return this.x=i+m*d+h*v-p*_,this.y=r+m*_+p*d-c*v,this.z=l+m*v+c*_-h*d,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const i=this.x,r=this.y,l=this.z,c=e.elements;return this.x=c[0]*i+c[4]*r+c[8]*l,this.y=c[1]*i+c[5]*r+c[9]*l,this.z=c[2]*i+c[6]*r+c[10]*l,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=gt(this.x,e.x,i.x),this.y=gt(this.y,e.y,i.y),this.z=gt(this.z,e.z,i.z),this}clampScalar(e,i){return this.x=gt(this.x,e,i),this.y=gt(this.y,e,i),this.z=gt(this.z,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(gt(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){const r=e.x,l=e.y,c=e.z,h=i.x,p=i.y,m=i.z;return this.x=l*m-c*p,this.y=c*h-r*m,this.z=r*p-l*h,this}projectOnVector(e){const i=e.lengthSq();if(i===0)return this.set(0,0,0);const r=e.dot(this)/i;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return Bh.copy(this).projectOnVector(e),this.sub(Bh)}reflect(e){return this.sub(Bh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(gt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y,l=this.z-e.z;return i*i+r*r+l*l}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,r){const l=Math.sin(i)*e;return this.x=l*Math.sin(r),this.y=Math.cos(i)*e,this.z=l*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,r){return this.x=e*Math.sin(i),this.y=r,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){const i=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),l=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=r,this.z=l,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,i*4)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,i*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,i=Math.random()*2-1,r=Math.sqrt(1-i*i);return this.x=r*Math.cos(e),this.y=i,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Pp.prototype.isVector3=!0;let $=Pp;const Bh=new $,I_=new ms,Ip=class Ip{constructor(e,i,r,l,c,h,p,m,d){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,i,r,l,c,h,p,m,d)}set(e,i,r,l,c,h,p,m,d){const _=this.elements;return _[0]=e,_[1]=l,_[2]=p,_[3]=i,_[4]=c,_[5]=m,_[6]=r,_[7]=h,_[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(e,i,r){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,c=this.elements,h=r[0],p=r[3],m=r[6],d=r[1],_=r[4],v=r[7],g=r[2],M=r[5],E=r[8],C=l[0],y=l[3],S=l[6],w=l[1],L=l[4],I=l[7],V=l[2],N=l[5],O=l[8];return c[0]=h*C+p*w+m*V,c[3]=h*y+p*L+m*N,c[6]=h*S+p*I+m*O,c[1]=d*C+_*w+v*V,c[4]=d*y+_*L+v*N,c[7]=d*S+_*I+v*O,c[2]=g*C+M*w+E*V,c[5]=g*y+M*L+E*N,c[8]=g*S+M*I+E*O,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[1],l=e[2],c=e[3],h=e[4],p=e[5],m=e[6],d=e[7],_=e[8];return i*h*_-i*p*d-r*c*_+r*p*m+l*c*d-l*h*m}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],c=e[3],h=e[4],p=e[5],m=e[6],d=e[7],_=e[8],v=_*h-p*d,g=p*m-_*c,M=d*c-h*m,E=i*v+r*g+l*M;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const C=1/E;return e[0]=v*C,e[1]=(l*d-_*r)*C,e[2]=(p*r-l*h)*C,e[3]=g*C,e[4]=(_*i-l*m)*C,e[5]=(l*c-p*i)*C,e[6]=M*C,e[7]=(r*m-d*i)*C,e[8]=(h*i-r*c)*C,this}transpose(){let e;const i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,r,l,c,h,p){const m=Math.cos(c),d=Math.sin(c);return this.set(r*m,r*d,-r*(m*h+d*p)+h+e,-l*d,l*m,-l*(-d*h+m*p)+p+i,0,0,1),this}scale(e,i){return this.premultiply(zh.makeScale(e,i)),this}rotate(e){return this.premultiply(zh.makeRotation(-e)),this}translate(e,i){return this.premultiply(zh.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<9;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<9;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Ip.prototype.isMatrix3=!0;let rt=Ip;const zh=new rt,F_=new rt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),B_=new rt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function VM(){const s={enabled:!0,workingColorSpace:fu,spaces:{},convert:function(l,c,h){return this.enabled===!1||c===h||!c||!h||(this.spaces[c].transfer===zt&&(l.r=Aa(l.r),l.g=Aa(l.g),l.b=Aa(l.b)),this.spaces[c].primaries!==this.spaces[h].primaries&&(l.applyMatrix3(this.spaces[c].toXYZ),l.applyMatrix3(this.spaces[h].fromXYZ)),this.spaces[h].transfer===zt&&(l.r=Yr(l.r),l.g=Yr(l.g),l.b=Yr(l.b))),l},workingToColorSpace:function(l,c){return this.convert(l,this.workingColorSpace,c)},colorSpaceToWorking:function(l,c){return this.convert(l,c,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===fs?hu:this.spaces[l].transfer},getToneMappingMode:function(l){return this.spaces[l].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(l,c=this.workingColorSpace){return l.fromArray(this.spaces[c].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,c,h){return l.copy(this.spaces[c].toXYZ).multiply(this.spaces[h].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,c){return lp("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(l,c)},toWorkingColorSpace:function(l,c){return lp("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(l,c)}},e=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],r=[.3127,.329];return s.define({[fu]:{primaries:e,whitePoint:r,transfer:hu,toXYZ:F_,fromXYZ:B_,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:Jn},outputColorSpaceConfig:{drawingBufferColorSpace:Jn}},[Jn]:{primaries:e,whitePoint:r,transfer:zt,toXYZ:F_,fromXYZ:B_,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:Jn}}}),s}const Tt=VM();function Aa(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Yr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Dr;class kM{static getDataURL(e,i="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let r;if(e instanceof HTMLCanvasElement)r=e;else{Dr===void 0&&(Dr=du("canvas")),Dr.width=e.width,Dr.height=e.height;const l=Dr.getContext("2d");e instanceof ImageData?l.putImageData(e,0,0):l.drawImage(e,0,0,e.width,e.height),r=Dr}return r.toDataURL(i)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const i=du("canvas");i.width=e.width,i.height=e.height;const r=i.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const l=r.getImageData(0,0,e.width,e.height),c=l.data;for(let h=0;h<c.length;h++)c[h]=Aa(c[h]/255)*255;return r.putImageData(l,0,0),i}else if(e.data){const i=e.data.slice(0);for(let r=0;r<i.length;r++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[r]=Math.floor(Aa(i[r]/255)*255):i[r]=Aa(i[r]);return{data:i,width:e.width,height:e.height}}else return tt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let XM=0;class Ap{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:XM++}),this.uuid=hl(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const i=this.data;return typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement?e.set(i.videoWidth,i.videoHeight,0):typeof VideoFrame<"u"&&i instanceof VideoFrame?e.set(i.displayWidth,i.displayHeight,0):i!==null?e.set(i.width,i.height,i.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},l=this.data;if(l!==null){let c;if(Array.isArray(l)){c=[];for(let h=0,p=l.length;h<p;h++)l[h].isDataTexture?c.push(Hh(l[h].image)):c.push(Hh(l[h]))}else c=Hh(l);r.url=c}return i||(e.images[this.uuid]=r),r}}function Hh(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?kM.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(tt("Texture: Unable to serialize Texture."),{})}let jM=0;const Gh=new $;class kn extends _s{constructor(e=kn.DEFAULT_IMAGE,i=kn.DEFAULT_MAPPING,r=Ea,l=Ea,c=zn,h=Xs,p=Ii,m=di,d=kn.DEFAULT_ANISOTROPY,_=fs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jM++}),this.uuid=hl(),this.name="",this.source=new Ap(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=l,this.magFilter=c,this.minFilter=h,this.anisotropy=d,this.format=p,this.internalFormat=null,this.type=m,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new rt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=_,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Gh).x}get height(){return this.source.getSize(Gh).y}get depth(){return this.source.getSize(Gh).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const i in e){const r=e[i];if(r===void 0){tt(`Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){tt(`Texture.setValues(): property '${i}' does not exist.`);continue}l&&r&&l.isVector2&&r.isVector2||l&&r&&l.isVector3&&r.isVector3||l&&r&&l.isMatrix3&&r.isMatrix3?l.copy(r):this[i]=r}}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Kv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case wd:e.x=e.x-Math.floor(e.x);break;case Ea:e.x=e.x<0?0:1;break;case Dd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case wd:e.y=e.y-Math.floor(e.y);break;case Ea:e.y=e.y<0?0:1;break;case Dd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kn.DEFAULT_IMAGE=null;kn.DEFAULT_MAPPING=Kv;kn.DEFAULT_ANISOTROPY=1;const Fp=class Fp{constructor(e=0,i=0,r=0,l=1){this.x=e,this.y=i,this.z=r,this.w=l}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,r,l){return this.x=e,this.y=i,this.z=r,this.w=l,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,c=this.w,h=e.elements;return this.x=h[0]*i+h[4]*r+h[8]*l+h[12]*c,this.y=h[1]*i+h[5]*r+h[9]*l+h[13]*c,this.z=h[2]*i+h[6]*r+h[10]*l+h[14]*c,this.w=h[3]*i+h[7]*r+h[11]*l+h[15]*c,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,r,l,c;const m=e.elements,d=m[0],_=m[4],v=m[8],g=m[1],M=m[5],E=m[9],C=m[2],y=m[6],S=m[10];if(Math.abs(_-g)<.01&&Math.abs(v-C)<.01&&Math.abs(E-y)<.01){if(Math.abs(_+g)<.1&&Math.abs(v+C)<.1&&Math.abs(E+y)<.1&&Math.abs(d+M+S-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const L=(d+1)/2,I=(M+1)/2,V=(S+1)/2,N=(_+g)/4,O=(v+C)/4,T=(E+y)/4;return L>I&&L>V?L<.01?(r=0,l=.707106781,c=.707106781):(r=Math.sqrt(L),l=N/r,c=O/r):I>V?I<.01?(r=.707106781,l=0,c=.707106781):(l=Math.sqrt(I),r=N/l,c=T/l):V<.01?(r=.707106781,l=.707106781,c=0):(c=Math.sqrt(V),r=O/c,l=T/c),this.set(r,l,c,i),this}let w=Math.sqrt((y-E)*(y-E)+(v-C)*(v-C)+(g-_)*(g-_));return Math.abs(w)<.001&&(w=1),this.x=(y-E)/w,this.y=(v-C)/w,this.z=(g-_)/w,this.w=Math.acos((d+M+S-1)/2),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=gt(this.x,e.x,i.x),this.y=gt(this.y,e.y,i.y),this.z=gt(this.z,e.z,i.z),this.w=gt(this.w,e.w,i.w),this}clampScalar(e,i){return this.x=gt(this.x,e,i),this.y=gt(this.y,e,i),this.z=gt(this.z,e,i),this.w=gt(this.w,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(gt(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this.w=e.w+(i.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Fp.prototype.isVector4=!0;let rn=Fp;class WM extends _s{constructor(e=1,i=1,r={}){super(),r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:zn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},r),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=r.depth,this.scissor=new rn(0,0,e,i),this.scissorTest=!1,this.viewport=new rn(0,0,e,i),this.textures=[];const l={width:e,height:i,depth:r.depth},c=new kn(l),h=r.count;for(let p=0;p<h;p++)this.textures[p]=c.clone(),this.textures[p].isRenderTargetTexture=!0,this.textures[p].renderTarget=this;this._setTextureOptions(r),this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples,this.multiview=r.multiview}_setTextureOptions(e={}){const i={minFilter:zn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(i.mapping=e.mapping),e.wrapS!==void 0&&(i.wrapS=e.wrapS),e.wrapT!==void 0&&(i.wrapT=e.wrapT),e.wrapR!==void 0&&(i.wrapR=e.wrapR),e.magFilter!==void 0&&(i.magFilter=e.magFilter),e.minFilter!==void 0&&(i.minFilter=e.minFilter),e.format!==void 0&&(i.format=e.format),e.type!==void 0&&(i.type=e.type),e.anisotropy!==void 0&&(i.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(i.colorSpace=e.colorSpace),e.flipY!==void 0&&(i.flipY=e.flipY),e.generateMipmaps!==void 0&&(i.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(i.internalFormat=e.internalFormat);for(let r=0;r<this.textures.length;r++)this.textures[r].setValues(i)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,i,r=1){if(this.width!==e||this.height!==i||this.depth!==r){this.width=e,this.height=i,this.depth=r;for(let l=0,c=this.textures.length;l<c;l++)this.textures[l].image.width=e,this.textures[l].image.height=i,this.textures[l].image.depth=r,this.textures[l].isData3DTexture!==!0&&(this.textures[l].isArrayTexture=this.textures[l].image.depth>1);this.dispose()}this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++){this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},e.textures[i].image);this.textures[i].source=new Ap(l)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ki extends WM{constructor(e=1,i=1,r={}){super(e,i,r),this.isWebGLRenderTarget=!0}}class sx extends kn{constructor(e=null,i=1,r=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=Ea,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class qM extends kn{constructor(e=null,i=1,r=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=Ea,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const xu=class xu{constructor(e,i,r,l,c,h,p,m,d,_,v,g,M,E,C,y){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,i,r,l,c,h,p,m,d,_,v,g,M,E,C,y)}set(e,i,r,l,c,h,p,m,d,_,v,g,M,E,C,y){const S=this.elements;return S[0]=e,S[4]=i,S[8]=r,S[12]=l,S[1]=c,S[5]=h,S[9]=p,S[13]=m,S[2]=d,S[6]=_,S[10]=v,S[14]=g,S[3]=M,S[7]=E,S[11]=C,S[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new xu().fromArray(this.elements)}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(e){const i=this.elements,r=e.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(e){const i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,r){return this.determinant()===0?(e.set(1,0,0),i.set(0,1,0),r.set(0,0,1),this):(e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this)}makeBasis(e,i,r){return this.set(e.x,i.x,r.x,0,e.y,i.y,r.y,0,e.z,i.z,r.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const i=this.elements,r=e.elements,l=1/Ur.setFromMatrixColumn(e,0).length(),c=1/Ur.setFromMatrixColumn(e,1).length(),h=1/Ur.setFromMatrixColumn(e,2).length();return i[0]=r[0]*l,i[1]=r[1]*l,i[2]=r[2]*l,i[3]=0,i[4]=r[4]*c,i[5]=r[5]*c,i[6]=r[6]*c,i[7]=0,i[8]=r[8]*h,i[9]=r[9]*h,i[10]=r[10]*h,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){const i=this.elements,r=e.x,l=e.y,c=e.z,h=Math.cos(r),p=Math.sin(r),m=Math.cos(l),d=Math.sin(l),_=Math.cos(c),v=Math.sin(c);if(e.order==="XYZ"){const g=h*_,M=h*v,E=p*_,C=p*v;i[0]=m*_,i[4]=-m*v,i[8]=d,i[1]=M+E*d,i[5]=g-C*d,i[9]=-p*m,i[2]=C-g*d,i[6]=E+M*d,i[10]=h*m}else if(e.order==="YXZ"){const g=m*_,M=m*v,E=d*_,C=d*v;i[0]=g+C*p,i[4]=E*p-M,i[8]=h*d,i[1]=h*v,i[5]=h*_,i[9]=-p,i[2]=M*p-E,i[6]=C+g*p,i[10]=h*m}else if(e.order==="ZXY"){const g=m*_,M=m*v,E=d*_,C=d*v;i[0]=g-C*p,i[4]=-h*v,i[8]=E+M*p,i[1]=M+E*p,i[5]=h*_,i[9]=C-g*p,i[2]=-h*d,i[6]=p,i[10]=h*m}else if(e.order==="ZYX"){const g=h*_,M=h*v,E=p*_,C=p*v;i[0]=m*_,i[4]=E*d-M,i[8]=g*d+C,i[1]=m*v,i[5]=C*d+g,i[9]=M*d-E,i[2]=-d,i[6]=p*m,i[10]=h*m}else if(e.order==="YZX"){const g=h*m,M=h*d,E=p*m,C=p*d;i[0]=m*_,i[4]=C-g*v,i[8]=E*v+M,i[1]=v,i[5]=h*_,i[9]=-p*_,i[2]=-d*_,i[6]=M*v+E,i[10]=g-C*v}else if(e.order==="XZY"){const g=h*m,M=h*d,E=p*m,C=p*d;i[0]=m*_,i[4]=-v,i[8]=d*_,i[1]=g*v+C,i[5]=h*_,i[9]=M*v-E,i[2]=E*v-M,i[6]=p*_,i[10]=C*v+g}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose(YM,e,ZM)}lookAt(e,i,r){const l=this.elements;return fi.subVectors(e,i),fi.lengthSq()===0&&(fi.z=1),fi.normalize(),as.crossVectors(r,fi),as.lengthSq()===0&&(Math.abs(r.z)===1?fi.x+=1e-4:fi.z+=1e-4,fi.normalize(),as.crossVectors(r,fi)),as.normalize(),Rc.crossVectors(fi,as),l[0]=as.x,l[4]=Rc.x,l[8]=fi.x,l[1]=as.y,l[5]=Rc.y,l[9]=fi.y,l[2]=as.z,l[6]=Rc.z,l[10]=fi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,c=this.elements,h=r[0],p=r[4],m=r[8],d=r[12],_=r[1],v=r[5],g=r[9],M=r[13],E=r[2],C=r[6],y=r[10],S=r[14],w=r[3],L=r[7],I=r[11],V=r[15],N=l[0],O=l[4],T=l[8],B=l[12],Z=l[1],z=l[5],Q=l[9],ee=l[13],he=l[2],j=l[6],P=l[10],H=l[14],ne=l[3],pe=l[7],ye=l[11],F=l[15];return c[0]=h*N+p*Z+m*he+d*ne,c[4]=h*O+p*z+m*j+d*pe,c[8]=h*T+p*Q+m*P+d*ye,c[12]=h*B+p*ee+m*H+d*F,c[1]=_*N+v*Z+g*he+M*ne,c[5]=_*O+v*z+g*j+M*pe,c[9]=_*T+v*Q+g*P+M*ye,c[13]=_*B+v*ee+g*H+M*F,c[2]=E*N+C*Z+y*he+S*ne,c[6]=E*O+C*z+y*j+S*pe,c[10]=E*T+C*Q+y*P+S*ye,c[14]=E*B+C*ee+y*H+S*F,c[3]=w*N+L*Z+I*he+V*ne,c[7]=w*O+L*z+I*j+V*pe,c[11]=w*T+L*Q+I*P+V*ye,c[15]=w*B+L*ee+I*H+V*F,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[4],l=e[8],c=e[12],h=e[1],p=e[5],m=e[9],d=e[13],_=e[2],v=e[6],g=e[10],M=e[14],E=e[3],C=e[7],y=e[11],S=e[15],w=m*M-d*g,L=p*M-d*v,I=p*g-m*v,V=h*M-d*_,N=h*g-m*_,O=h*v-p*_;return i*(C*w-y*L+S*I)-r*(E*w-y*V+S*N)+l*(E*L-C*V+S*O)-c*(E*I-C*N+y*O)}transpose(){const e=this.elements;let i;return i=e[1],e[1]=e[4],e[4]=i,i=e[2],e[2]=e[8],e[8]=i,i=e[6],e[6]=e[9],e[9]=i,i=e[3],e[3]=e[12],e[12]=i,i=e[7],e[7]=e[13],e[13]=i,i=e[11],e[11]=e[14],e[14]=i,this}setPosition(e,i,r){const l=this.elements;return e.isVector3?(l[12]=e.x,l[13]=e.y,l[14]=e.z):(l[12]=e,l[13]=i,l[14]=r),this}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],c=e[3],h=e[4],p=e[5],m=e[6],d=e[7],_=e[8],v=e[9],g=e[10],M=e[11],E=e[12],C=e[13],y=e[14],S=e[15],w=i*p-r*h,L=i*m-l*h,I=i*d-c*h,V=r*m-l*p,N=r*d-c*p,O=l*d-c*m,T=_*C-v*E,B=_*y-g*E,Z=_*S-M*E,z=v*y-g*C,Q=v*S-M*C,ee=g*S-M*y,he=w*ee-L*Q+I*z+V*Z-N*B+O*T;if(he===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const j=1/he;return e[0]=(p*ee-m*Q+d*z)*j,e[1]=(l*Q-r*ee-c*z)*j,e[2]=(C*O-y*N+S*V)*j,e[3]=(g*N-v*O-M*V)*j,e[4]=(m*Z-h*ee-d*B)*j,e[5]=(i*ee-l*Z+c*B)*j,e[6]=(y*I-E*O-S*L)*j,e[7]=(_*O-g*I+M*L)*j,e[8]=(h*Q-p*Z+d*T)*j,e[9]=(r*Z-i*Q-c*T)*j,e[10]=(E*N-C*I+S*w)*j,e[11]=(v*I-_*N-M*w)*j,e[12]=(p*B-h*z-m*T)*j,e[13]=(i*z-r*B+l*T)*j,e[14]=(C*L-E*V-y*w)*j,e[15]=(_*V-v*L+g*w)*j,this}scale(e){const i=this.elements,r=e.x,l=e.y,c=e.z;return i[0]*=r,i[4]*=l,i[8]*=c,i[1]*=r,i[5]*=l,i[9]*=c,i[2]*=r,i[6]*=l,i[10]*=c,i[3]*=r,i[7]*=l,i[11]*=c,this}getMaxScaleOnAxis(){const e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],l=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(i,r,l))}makeTranslation(e,i,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(e){const i=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){const r=Math.cos(i),l=Math.sin(i),c=1-r,h=e.x,p=e.y,m=e.z,d=c*h,_=c*p;return this.set(d*h+r,d*p-l*m,d*m+l*p,0,d*p+l*m,_*p+r,_*m-l*h,0,d*m-l*p,_*m+l*h,c*m*m+r,0,0,0,0,1),this}makeScale(e,i,r){return this.set(e,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,i,r,l,c,h){return this.set(1,r,c,0,e,1,h,0,i,l,1,0,0,0,0,1),this}compose(e,i,r){const l=this.elements,c=i._x,h=i._y,p=i._z,m=i._w,d=c+c,_=h+h,v=p+p,g=c*d,M=c*_,E=c*v,C=h*_,y=h*v,S=p*v,w=m*d,L=m*_,I=m*v,V=r.x,N=r.y,O=r.z;return l[0]=(1-(C+S))*V,l[1]=(M+I)*V,l[2]=(E-L)*V,l[3]=0,l[4]=(M-I)*N,l[5]=(1-(g+S))*N,l[6]=(y+w)*N,l[7]=0,l[8]=(E+L)*O,l[9]=(y-w)*O,l[10]=(1-(g+C))*O,l[11]=0,l[12]=e.x,l[13]=e.y,l[14]=e.z,l[15]=1,this}decompose(e,i,r){const l=this.elements;e.x=l[12],e.y=l[13],e.z=l[14];const c=this.determinant();if(c===0)return r.set(1,1,1),i.identity(),this;let h=Ur.set(l[0],l[1],l[2]).length();const p=Ur.set(l[4],l[5],l[6]).length(),m=Ur.set(l[8],l[9],l[10]).length();c<0&&(h=-h),Li.copy(this);const d=1/h,_=1/p,v=1/m;return Li.elements[0]*=d,Li.elements[1]*=d,Li.elements[2]*=d,Li.elements[4]*=_,Li.elements[5]*=_,Li.elements[6]*=_,Li.elements[8]*=v,Li.elements[9]*=v,Li.elements[10]*=v,i.setFromRotationMatrix(Li),r.x=h,r.y=p,r.z=m,this}makePerspective(e,i,r,l,c,h,p=Yi,m=!1){const d=this.elements,_=2*c/(i-e),v=2*c/(r-l),g=(i+e)/(i-e),M=(r+l)/(r-l);let E,C;if(m)E=c/(h-c),C=h*c/(h-c);else if(p===Yi)E=-(h+c)/(h-c),C=-2*h*c/(h-c);else if(p===fl)E=-h/(h-c),C=-h*c/(h-c);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+p);return d[0]=_,d[4]=0,d[8]=g,d[12]=0,d[1]=0,d[5]=v,d[9]=M,d[13]=0,d[2]=0,d[6]=0,d[10]=E,d[14]=C,d[3]=0,d[7]=0,d[11]=-1,d[15]=0,this}makeOrthographic(e,i,r,l,c,h,p=Yi,m=!1){const d=this.elements,_=2/(i-e),v=2/(r-l),g=-(i+e)/(i-e),M=-(r+l)/(r-l);let E,C;if(m)E=1/(h-c),C=h/(h-c);else if(p===Yi)E=-2/(h-c),C=-(h+c)/(h-c);else if(p===fl)E=-1/(h-c),C=-c/(h-c);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+p);return d[0]=_,d[4]=0,d[8]=0,d[12]=g,d[1]=0,d[5]=v,d[9]=0,d[13]=M,d[2]=0,d[6]=0,d[10]=E,d[14]=C,d[3]=0,d[7]=0,d[11]=0,d[15]=1,this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<16;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<16;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e[i+9]=r[9],e[i+10]=r[10],e[i+11]=r[11],e[i+12]=r[12],e[i+13]=r[13],e[i+14]=r[14],e[i+15]=r[15],e}};xu.prototype.isMatrix4=!0;let on=xu;const Ur=new $,Li=new on,YM=new $(0,0,0),ZM=new $(1,1,1),as=new $,Rc=new $,fi=new $,z_=new on,H_=new ms;class gs{constructor(e=0,i=0,r=0,l=gs.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=r,this._order=l}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,r,l=this._order){return this._x=e,this._y=i,this._z=r,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,r=!0){const l=e.elements,c=l[0],h=l[4],p=l[8],m=l[1],d=l[5],_=l[9],v=l[2],g=l[6],M=l[10];switch(i){case"XYZ":this._y=Math.asin(gt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-_,M),this._z=Math.atan2(-h,c)):(this._x=Math.atan2(g,d),this._z=0);break;case"YXZ":this._x=Math.asin(-gt(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(p,M),this._z=Math.atan2(m,d)):(this._y=Math.atan2(-v,c),this._z=0);break;case"ZXY":this._x=Math.asin(gt(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-v,M),this._z=Math.atan2(-h,d)):(this._y=0,this._z=Math.atan2(m,c));break;case"ZYX":this._y=Math.asin(-gt(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(g,M),this._z=Math.atan2(m,c)):(this._x=0,this._z=Math.atan2(-h,d));break;case"YZX":this._z=Math.asin(gt(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-_,d),this._y=Math.atan2(-v,c)):(this._x=0,this._y=Math.atan2(p,M));break;case"XZY":this._z=Math.asin(-gt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(g,d),this._y=Math.atan2(p,c)):(this._x=Math.atan2(-_,M),this._y=0);break;default:tt("Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,i,r){return z_.makeRotationFromQuaternion(e),this.setFromRotationMatrix(z_,i,r)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return H_.setFromEuler(this),this.setFromQuaternion(H_,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gs.DEFAULT_ORDER="XYZ";class rx{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let KM=0;const G_=new $,Nr=new ms,_a=new on,Cc=new $,Qo=new $,QM=new $,JM=new ms,V_=new $(1,0,0),k_=new $(0,1,0),X_=new $(0,0,1),j_={type:"added"},$M={type:"removed"},Lr={type:"childadded",child:null},Vh={type:"childremoved",child:null};class Tn extends _s{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:KM++}),this.uuid=hl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Tn.DEFAULT_UP.clone();const e=new $,i=new gs,r=new ms,l=new $(1,1,1);function c(){r.setFromEuler(i,!1)}function h(){i.setFromQuaternion(r,void 0,!1)}i._onChange(c),r._onChange(h),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new on},normalMatrix:{value:new rt}}),this.matrix=new on,this.matrixWorld=new on,this.matrixAutoUpdate=Tn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rx,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return Nr.setFromAxisAngle(e,i),this.quaternion.multiply(Nr),this}rotateOnWorldAxis(e,i){return Nr.setFromAxisAngle(e,i),this.quaternion.premultiply(Nr),this}rotateX(e){return this.rotateOnAxis(V_,e)}rotateY(e){return this.rotateOnAxis(k_,e)}rotateZ(e){return this.rotateOnAxis(X_,e)}translateOnAxis(e,i){return G_.copy(e).applyQuaternion(this.quaternion),this.position.add(G_.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(V_,e)}translateY(e){return this.translateOnAxis(k_,e)}translateZ(e){return this.translateOnAxis(X_,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_a.copy(this.matrixWorld).invert())}lookAt(e,i,r){e.isVector3?Cc.copy(e):Cc.set(e,i,r);const l=this.parent;this.updateWorldMatrix(!0,!1),Qo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_a.lookAt(Qo,Cc,this.up):_a.lookAt(Cc,Qo,this.up),this.quaternion.setFromRotationMatrix(_a),l&&(_a.extractRotation(l.matrixWorld),Nr.setFromRotationMatrix(_a),this.quaternion.premultiply(Nr.invert()))}add(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return e===this?(At("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(j_),Lr.child=e,this.dispatchEvent(Lr),Lr.child=null):At("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const i=this.children.indexOf(e);return i!==-1&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent($M),Vh.child=e,this.dispatchEvent(Vh),Vh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_a.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_a.multiply(e.parent.matrixWorld)),e.applyMatrix4(_a),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(j_),Lr.child=e,this.dispatchEvent(Lr),Lr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let r=0,l=this.children.length;r<l;r++){const h=this.children[r].getObjectByProperty(e,i);if(h!==void 0)return h}}getObjectsByProperty(e,i,r=[]){this[e]===i&&r.push(this);const l=this.children;for(let c=0,h=l.length;c<h;c++)l[c].getObjectsByProperty(e,i,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qo,e,QM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qo,JM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(e){e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverseVisible(e)}traverseAncestors(e){const i=this.parent;i!==null&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const i=e.x,r=e.y,l=e.z,c=this.matrix.elements;c[12]+=i-c[0]*i-c[4]*r-c[8]*l,c[13]+=r-c[1]*i-c[5]*r-c[9]*l,c[14]+=l-c[2]*i-c[6]*r-c[10]*l}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].updateMatrixWorld(e)}updateWorldMatrix(e,i){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let c=0,h=l.length;c<h;c++)l[c].updateWorldMatrix(!1,!0)}}toJSON(e){const i=e===void 0||typeof e=="string",r={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),this.static!==!1&&(l.static=this.static),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.pivot!==null&&(l.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(l.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(l.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(p=>({...p,boundingBox:p.boundingBox?p.boundingBox.toJSON():void 0,boundingSphere:p.boundingSphere?p.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(p=>({...p})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(e),l.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function c(p,m){return p[m.uuid]===void 0&&(p[m.uuid]=m.toJSON(e)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=c(e.geometries,this.geometry);const p=this.geometry.parameters;if(p!==void 0&&p.shapes!==void 0){const m=p.shapes;if(Array.isArray(m))for(let d=0,_=m.length;d<_;d++){const v=m[d];c(e.shapes,v)}else c(e.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(c(e.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const p=[];for(let m=0,d=this.material.length;m<d;m++)p.push(c(e.materials,this.material[m]));l.material=p}else l.material=c(e.materials,this.material);if(this.children.length>0){l.children=[];for(let p=0;p<this.children.length;p++)l.children.push(this.children[p].toJSON(e).object)}if(this.animations.length>0){l.animations=[];for(let p=0;p<this.animations.length;p++){const m=this.animations[p];l.animations.push(c(e.animations,m))}}if(i){const p=h(e.geometries),m=h(e.materials),d=h(e.textures),_=h(e.images),v=h(e.shapes),g=h(e.skeletons),M=h(e.animations),E=h(e.nodes);p.length>0&&(r.geometries=p),m.length>0&&(r.materials=m),d.length>0&&(r.textures=d),_.length>0&&(r.images=_),v.length>0&&(r.shapes=v),g.length>0&&(r.skeletons=g),M.length>0&&(r.animations=M),E.length>0&&(r.nodes=E)}return r.object=l,r;function h(p){const m=[];for(const d in p){const _=p[d];delete _.metadata,m.push(_)}return m}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),i===!0)for(let r=0;r<e.children.length;r++){const l=e.children[r];this.add(l.clone())}return this}}Tn.DEFAULT_UP=new $(0,1,0);Tn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class sl extends Tn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const eb={type:"move"};class kh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new sl,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new sl,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new $,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new $),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new sl,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new $,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new $,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const i=this._hand;if(i)for(const r of e.hand.values())this._getHandJoint(i,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,i,r){let l=null,c=null,h=null;const p=this._targetRay,m=this._grip,d=this._hand;if(e&&i.session.visibilityState!=="visible-blurred"){if(d&&e.hand){h=!0;for(const C of e.hand.values()){const y=i.getJointPose(C,r),S=this._getHandJoint(d,C);y!==null&&(S.matrix.fromArray(y.transform.matrix),S.matrix.decompose(S.position,S.rotation,S.scale),S.matrixWorldNeedsUpdate=!0,S.jointRadius=y.radius),S.visible=y!==null}const _=d.joints["index-finger-tip"],v=d.joints["thumb-tip"],g=_.position.distanceTo(v.position),M=.02,E=.005;d.inputState.pinching&&g>M+E?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!d.inputState.pinching&&g<=M-E&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else m!==null&&e.gripSpace&&(c=i.getPose(e.gripSpace,r),c!==null&&(m.matrix.fromArray(c.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,c.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(c.linearVelocity)):m.hasLinearVelocity=!1,c.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(c.angularVelocity)):m.hasAngularVelocity=!1,m.eventsEnabled&&m.dispatchEvent({type:"gripUpdated",data:e,target:this})));p!==null&&(l=i.getPose(e.targetRaySpace,r),l===null&&c!==null&&(l=c),l!==null&&(p.matrix.fromArray(l.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,l.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(l.linearVelocity)):p.hasLinearVelocity=!1,l.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(l.angularVelocity)):p.hasAngularVelocity=!1,this.dispatchEvent(eb)))}return p!==null&&(p.visible=l!==null),m!==null&&(m.visible=c!==null),d!==null&&(d.visible=h!==null),this}_getHandJoint(e,i){if(e.joints[i.jointName]===void 0){const r=new sl;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[i.jointName]=r,e.add(r)}return e.joints[i.jointName]}}const ox={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ss={h:0,s:0,l:0},wc={h:0,s:0,l:0};function Xh(s,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?s+(e-s)*6*i:i<1/2?e:i<2/3?s+(e-s)*6*(2/3-i):s}class dt{constructor(e,i,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,r)}set(e,i,r){if(i===void 0&&r===void 0){const l=e;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(e,i,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=Jn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Tt.colorSpaceToWorking(this,i),this}setRGB(e,i,r,l=Tt.workingColorSpace){return this.r=e,this.g=i,this.b=r,Tt.colorSpaceToWorking(this,l),this}setHSL(e,i,r,l=Tt.workingColorSpace){if(e=HM(e,1),i=gt(i,0,1),r=gt(r,0,1),i===0)this.r=this.g=this.b=r;else{const c=r<=.5?r*(1+i):r+i-r*i,h=2*r-c;this.r=Xh(h,c,e+1/3),this.g=Xh(h,c,e),this.b=Xh(h,c,e-1/3)}return Tt.colorSpaceToWorking(this,l),this}setStyle(e,i=Jn){function r(c){c!==void 0&&parseFloat(c)<1&&tt("Color: Alpha component of "+e+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(e)){let c;const h=l[1],p=l[2];switch(h){case"rgb":case"rgba":if(c=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return r(c[4]),this.setRGB(Math.min(255,parseInt(c[1],10))/255,Math.min(255,parseInt(c[2],10))/255,Math.min(255,parseInt(c[3],10))/255,i);if(c=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return r(c[4]),this.setRGB(Math.min(100,parseInt(c[1],10))/100,Math.min(100,parseInt(c[2],10))/100,Math.min(100,parseInt(c[3],10))/100,i);break;case"hsl":case"hsla":if(c=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return r(c[4]),this.setHSL(parseFloat(c[1])/360,parseFloat(c[2])/100,parseFloat(c[3])/100,i);break;default:tt("Color: Unknown color model "+e)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(e)){const c=l[1],h=c.length;if(h===3)return this.setRGB(parseInt(c.charAt(0),16)/15,parseInt(c.charAt(1),16)/15,parseInt(c.charAt(2),16)/15,i);if(h===6)return this.setHex(parseInt(c,16),i);tt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=Jn){const r=ox[e.toLowerCase()];return r!==void 0?this.setHex(r,i):tt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Aa(e.r),this.g=Aa(e.g),this.b=Aa(e.b),this}copyLinearToSRGB(e){return this.r=Yr(e.r),this.g=Yr(e.g),this.b=Yr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Jn){return Tt.workingToColorSpace(Bn.copy(this),e),Math.round(gt(Bn.r*255,0,255))*65536+Math.round(gt(Bn.g*255,0,255))*256+Math.round(gt(Bn.b*255,0,255))}getHexString(e=Jn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=Tt.workingColorSpace){Tt.workingToColorSpace(Bn.copy(this),i);const r=Bn.r,l=Bn.g,c=Bn.b,h=Math.max(r,l,c),p=Math.min(r,l,c);let m,d;const _=(p+h)/2;if(p===h)m=0,d=0;else{const v=h-p;switch(d=_<=.5?v/(h+p):v/(2-h-p),h){case r:m=(l-c)/v+(l<c?6:0);break;case l:m=(c-r)/v+2;break;case c:m=(r-l)/v+4;break}m/=6}return e.h=m,e.s=d,e.l=_,e}getRGB(e,i=Tt.workingColorSpace){return Tt.workingToColorSpace(Bn.copy(this),i),e.r=Bn.r,e.g=Bn.g,e.b=Bn.b,e}getStyle(e=Jn){Tt.workingToColorSpace(Bn.copy(this),e);const i=Bn.r,r=Bn.g,l=Bn.b;return e!==Jn?`color(${e} ${i.toFixed(3)} ${r.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(r*255)},${Math.round(l*255)})`}offsetHSL(e,i,r){return this.getHSL(ss),this.setHSL(ss.h+e,ss.s+i,ss.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,r){return this.r=e.r+(i.r-e.r)*r,this.g=e.g+(i.g-e.g)*r,this.b=e.b+(i.b-e.b)*r,this}lerpHSL(e,i){this.getHSL(ss),e.getHSL(wc);const r=Fh(ss.h,wc.h,i),l=Fh(ss.s,wc.s,i),c=Fh(ss.l,wc.l,i);return this.setHSL(r,l,c),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const i=this.r,r=this.g,l=this.b,c=e.elements;return this.r=c[0]*i+c[3]*r+c[6]*l,this.g=c[1]*i+c[4]*r+c[7]*l,this.b=c[2]*i+c[5]*r+c[8]*l,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Bn=new dt;dt.NAMES=ox;class Rp{constructor(e,i=1,r=1e3){this.isFog=!0,this.name="",this.color=new dt(e),this.near=i,this.far=r}clone(){return new Rp(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class tb extends Tn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gs,this.environmentIntensity=1,this.environmentRotation=new gs,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const i=super.toJSON(e);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}const Oi=new $,va=new $,jh=new $,xa=new $,Or=new $,Pr=new $,W_=new $,Wh=new $,qh=new $,Yh=new $,Zh=new rn,Kh=new rn,Qh=new rn;class Ri{constructor(e=new $,i=new $,r=new $){this.a=e,this.b=i,this.c=r}static getNormal(e,i,r,l){l.subVectors(r,i),Oi.subVectors(e,i),l.cross(Oi);const c=l.lengthSq();return c>0?l.multiplyScalar(1/Math.sqrt(c)):l.set(0,0,0)}static getBarycoord(e,i,r,l,c){Oi.subVectors(l,i),va.subVectors(r,i),jh.subVectors(e,i);const h=Oi.dot(Oi),p=Oi.dot(va),m=Oi.dot(jh),d=va.dot(va),_=va.dot(jh),v=h*d-p*p;if(v===0)return c.set(0,0,0),null;const g=1/v,M=(d*m-p*_)*g,E=(h*_-p*m)*g;return c.set(1-M-E,E,M)}static containsPoint(e,i,r,l){return this.getBarycoord(e,i,r,l,xa)===null?!1:xa.x>=0&&xa.y>=0&&xa.x+xa.y<=1}static getInterpolation(e,i,r,l,c,h,p,m){return this.getBarycoord(e,i,r,l,xa)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(c,xa.x),m.addScaledVector(h,xa.y),m.addScaledVector(p,xa.z),m)}static getInterpolatedAttribute(e,i,r,l,c,h){return Zh.setScalar(0),Kh.setScalar(0),Qh.setScalar(0),Zh.fromBufferAttribute(e,i),Kh.fromBufferAttribute(e,r),Qh.fromBufferAttribute(e,l),h.setScalar(0),h.addScaledVector(Zh,c.x),h.addScaledVector(Kh,c.y),h.addScaledVector(Qh,c.z),h}static isFrontFacing(e,i,r,l){return Oi.subVectors(r,i),va.subVectors(e,i),Oi.cross(va).dot(l)<0}set(e,i,r){return this.a.copy(e),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(e,i,r,l){return this.a.copy(e[i]),this.b.copy(e[r]),this.c.copy(e[l]),this}setFromAttributeAndIndices(e,i,r,l){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,l),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Oi.subVectors(this.c,this.b),va.subVectors(this.a,this.b),Oi.cross(va).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ri.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return Ri.getBarycoord(e,this.a,this.b,this.c,i)}getInterpolation(e,i,r,l,c){return Ri.getInterpolation(e,this.a,this.b,this.c,i,r,l,c)}containsPoint(e){return Ri.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ri.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){const r=this.a,l=this.b,c=this.c;let h,p;Or.subVectors(l,r),Pr.subVectors(c,r),Wh.subVectors(e,r);const m=Or.dot(Wh),d=Pr.dot(Wh);if(m<=0&&d<=0)return i.copy(r);qh.subVectors(e,l);const _=Or.dot(qh),v=Pr.dot(qh);if(_>=0&&v<=_)return i.copy(l);const g=m*v-_*d;if(g<=0&&m>=0&&_<=0)return h=m/(m-_),i.copy(r).addScaledVector(Or,h);Yh.subVectors(e,c);const M=Or.dot(Yh),E=Pr.dot(Yh);if(E>=0&&M<=E)return i.copy(c);const C=M*d-m*E;if(C<=0&&d>=0&&E<=0)return p=d/(d-E),i.copy(r).addScaledVector(Pr,p);const y=_*E-M*v;if(y<=0&&v-_>=0&&M-E>=0)return W_.subVectors(c,l),p=(v-_)/(v-_+(M-E)),i.copy(l).addScaledVector(W_,p);const S=1/(y+C+g);return h=C*S,p=g*S,i.copy(r).addScaledVector(Or,h).addScaledVector(Pr,p)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class dl{constructor(e=new $(1/0,1/0,1/0),i=new $(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i+=3)this.expandByPoint(Pi.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,r=e.count;i<r;i++)this.expandByPoint(Pi.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){const r=Pi.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const c=r.getAttribute("position");if(i===!0&&c!==void 0&&e.isInstancedMesh!==!0)for(let h=0,p=c.count;h<p;h++)e.isMesh===!0?e.getVertexPosition(h,Pi):Pi.fromBufferAttribute(c,h),Pi.applyMatrix4(e.matrixWorld),this.expandByPoint(Pi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Dc.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),Dc.copy(r.boundingBox)),Dc.applyMatrix4(e.matrixWorld),this.union(Dc)}const l=e.children;for(let c=0,h=l.length;c<h;c++)this.expandByObject(l[c],i);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Pi),Pi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,r;return e.normal.x>0?(i=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),i<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Jo),Uc.subVectors(this.max,Jo),Ir.subVectors(e.a,Jo),Fr.subVectors(e.b,Jo),Br.subVectors(e.c,Jo),rs.subVectors(Fr,Ir),os.subVectors(Br,Fr),Fs.subVectors(Ir,Br);let i=[0,-rs.z,rs.y,0,-os.z,os.y,0,-Fs.z,Fs.y,rs.z,0,-rs.x,os.z,0,-os.x,Fs.z,0,-Fs.x,-rs.y,rs.x,0,-os.y,os.x,0,-Fs.y,Fs.x,0];return!Jh(i,Ir,Fr,Br,Uc)||(i=[1,0,0,0,1,0,0,0,1],!Jh(i,Ir,Fr,Br,Uc))?!1:(Nc.crossVectors(rs,os),i=[Nc.x,Nc.y,Nc.z],Jh(i,Ir,Fr,Br,Uc))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Pi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Pi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Sa[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Sa[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Sa[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Sa[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Sa[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Sa[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Sa[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Sa[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Sa),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Sa=[new $,new $,new $,new $,new $,new $,new $,new $],Pi=new $,Dc=new dl,Ir=new $,Fr=new $,Br=new $,rs=new $,os=new $,Fs=new $,Jo=new $,Uc=new $,Nc=new $,Bs=new $;function Jh(s,e,i,r,l){for(let c=0,h=s.length-3;c<=h;c+=3){Bs.fromArray(s,c);const p=l.x*Math.abs(Bs.x)+l.y*Math.abs(Bs.y)+l.z*Math.abs(Bs.z),m=e.dot(Bs),d=i.dot(Bs),_=r.dot(Bs);if(Math.max(-Math.max(m,d,_),Math.min(m,d,_))>p)return!1}return!0}const _n=new $,Lc=new ot;let nb=0;class pi extends _s{constructor(e,i,r=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:nb++}),this.name="",this.array=e,this.itemSize=i,this.count=e!==void 0?e.length/i:0,this.normalized=r,this.usage=N_,this.updateRanges=[],this.gpuType=qi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,r){e*=this.itemSize,r*=i.itemSize;for(let l=0,c=this.itemSize;l<c;l++)this.array[e+l]=i.array[r+l];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let i=0,r=this.count;i<r;i++)Lc.fromBufferAttribute(this,i),Lc.applyMatrix3(e),this.setXY(i,Lc.x,Lc.y);else if(this.itemSize===3)for(let i=0,r=this.count;i<r;i++)_n.fromBufferAttribute(this,i),_n.applyMatrix3(e),this.setXYZ(i,_n.x,_n.y,_n.z);return this}applyMatrix4(e){for(let i=0,r=this.count;i<r;i++)_n.fromBufferAttribute(this,i),_n.applyMatrix4(e),this.setXYZ(i,_n.x,_n.y,_n.z);return this}applyNormalMatrix(e){for(let i=0,r=this.count;i<r;i++)_n.fromBufferAttribute(this,i),_n.applyNormalMatrix(e),this.setXYZ(i,_n.x,_n.y,_n.z);return this}transformDirection(e){for(let i=0,r=this.count;i<r;i++)_n.fromBufferAttribute(this,i),_n.transformDirection(e),this.setXYZ(i,_n.x,_n.y,_n.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let r=this.array[e*this.itemSize+i];return this.normalized&&(r=Ko(r,this.array)),r}setComponent(e,i,r){return this.normalized&&(r=Kn(r,this.array)),this.array[e*this.itemSize+i]=r,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=Ko(i,this.array)),i}setX(e,i){return this.normalized&&(i=Kn(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=Ko(i,this.array)),i}setY(e,i){return this.normalized&&(i=Kn(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=Ko(i,this.array)),i}setZ(e,i){return this.normalized&&(i=Kn(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=Ko(i,this.array)),i}setW(e,i){return this.normalized&&(i=Kn(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,r){return e*=this.itemSize,this.normalized&&(i=Kn(i,this.array),r=Kn(r,this.array)),this.array[e+0]=i,this.array[e+1]=r,this}setXYZ(e,i,r,l){return e*=this.itemSize,this.normalized&&(i=Kn(i,this.array),r=Kn(r,this.array),l=Kn(l,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this}setXYZW(e,i,r,l,c){return e*=this.itemSize,this.normalized&&(i=Kn(i,this.array),r=Kn(r,this.array),l=Kn(l,this.array),c=Kn(c,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this.array[e+3]=c,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==N_&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class lx extends pi{constructor(e,i,r){super(new Uint16Array(e),i,r)}}class cx extends pi{constructor(e,i,r){super(new Uint32Array(e),i,r)}}class ei extends pi{constructor(e,i,r){super(new Float32Array(e),i,r)}}const ib=new dl,$o=new $,$h=new $;class yu{constructor(e=new $,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){const r=this.center;i!==void 0?r.copy(i):ib.setFromPoints(e).getCenter(r);let l=0;for(let c=0,h=e.length;c<h;c++)l=Math.max(l,r.distanceToSquared(e[c]));return this.radius=Math.sqrt(l),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){const r=this.center.distanceToSquared(e);return i.copy(e),r>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;$o.subVectors(e,this.center);const i=$o.lengthSq();if(i>this.radius*this.radius){const r=Math.sqrt(i),l=(r-this.radius)*.5;this.center.addScaledVector($o,l/r),this.radius+=l}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($h.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint($o.copy(e.center).add($h)),this.expandByPoint($o.copy(e.center).sub($h))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let ab=0;const Ti=new on,ed=new Tn,zr=new $,hi=new dl,el=new dl,En=new $;class mi extends _s{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ab++}),this.uuid=hl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(IM(e)?cx:lx)(e,1):this.index=e,this}setIndirect(e,i=0){return this.indirect=e,this.indirectOffset=i,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,i,r=0){this.groups.push({start:e,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(e),i.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const c=new rt().getNormalMatrix(e);r.applyNormalMatrix(c),r.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(e),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ti.makeRotationFromQuaternion(e),this.applyMatrix4(Ti),this}rotateX(e){return Ti.makeRotationX(e),this.applyMatrix4(Ti),this}rotateY(e){return Ti.makeRotationY(e),this.applyMatrix4(Ti),this}rotateZ(e){return Ti.makeRotationZ(e),this.applyMatrix4(Ti),this}translate(e,i,r){return Ti.makeTranslation(e,i,r),this.applyMatrix4(Ti),this}scale(e,i,r){return Ti.makeScale(e,i,r),this.applyMatrix4(Ti),this}lookAt(e){return ed.lookAt(e),ed.updateMatrix(),this.applyMatrix4(ed.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zr).negate(),this.translate(zr.x,zr.y,zr.z),this}setFromPoints(e){const i=this.getAttribute("position");if(i===void 0){const r=[];for(let l=0,c=e.length;l<c;l++){const h=e[l];r.push(h.x,h.y,h.z||0)}this.setAttribute("position",new ei(r,3))}else{const r=Math.min(e.length,i.count);for(let l=0;l<r;l++){const c=e[l];i.setXYZ(l,c.x,c.y,c.z||0)}e.length>i.count&&tt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new dl);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){At("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new $(-1/0,-1/0,-1/0),new $(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),i)for(let r=0,l=i.length;r<l;r++){const c=i[r];hi.setFromBufferAttribute(c),this.morphTargetsRelative?(En.addVectors(this.boundingBox.min,hi.min),this.boundingBox.expandByPoint(En),En.addVectors(this.boundingBox.max,hi.max),this.boundingBox.expandByPoint(En)):(this.boundingBox.expandByPoint(hi.min),this.boundingBox.expandByPoint(hi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&At('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yu);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){At("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new $,1/0);return}if(e){const r=this.boundingSphere.center;if(hi.setFromBufferAttribute(e),i)for(let c=0,h=i.length;c<h;c++){const p=i[c];el.setFromBufferAttribute(p),this.morphTargetsRelative?(En.addVectors(hi.min,el.min),hi.expandByPoint(En),En.addVectors(hi.max,el.max),hi.expandByPoint(En)):(hi.expandByPoint(el.min),hi.expandByPoint(el.max))}hi.getCenter(r);let l=0;for(let c=0,h=e.count;c<h;c++)En.fromBufferAttribute(e,c),l=Math.max(l,r.distanceToSquared(En));if(i)for(let c=0,h=i.length;c<h;c++){const p=i[c],m=this.morphTargetsRelative;for(let d=0,_=p.count;d<_;d++)En.fromBufferAttribute(p,d),m&&(zr.fromBufferAttribute(e,d),En.add(zr)),l=Math.max(l,r.distanceToSquared(En))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&At('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,i=this.attributes;if(e===null||i.position===void 0||i.normal===void 0||i.uv===void 0){At("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=i.position,l=i.normal,c=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pi(new Float32Array(4*r.count),4));const h=this.getAttribute("tangent"),p=[],m=[];for(let T=0;T<r.count;T++)p[T]=new $,m[T]=new $;const d=new $,_=new $,v=new $,g=new ot,M=new ot,E=new ot,C=new $,y=new $;function S(T,B,Z){d.fromBufferAttribute(r,T),_.fromBufferAttribute(r,B),v.fromBufferAttribute(r,Z),g.fromBufferAttribute(c,T),M.fromBufferAttribute(c,B),E.fromBufferAttribute(c,Z),_.sub(d),v.sub(d),M.sub(g),E.sub(g);const z=1/(M.x*E.y-E.x*M.y);isFinite(z)&&(C.copy(_).multiplyScalar(E.y).addScaledVector(v,-M.y).multiplyScalar(z),y.copy(v).multiplyScalar(M.x).addScaledVector(_,-E.x).multiplyScalar(z),p[T].add(C),p[B].add(C),p[Z].add(C),m[T].add(y),m[B].add(y),m[Z].add(y))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let T=0,B=w.length;T<B;++T){const Z=w[T],z=Z.start,Q=Z.count;for(let ee=z,he=z+Q;ee<he;ee+=3)S(e.getX(ee+0),e.getX(ee+1),e.getX(ee+2))}const L=new $,I=new $,V=new $,N=new $;function O(T){V.fromBufferAttribute(l,T),N.copy(V);const B=p[T];L.copy(B),L.sub(V.multiplyScalar(V.dot(B))).normalize(),I.crossVectors(N,B);const z=I.dot(m[T])<0?-1:1;h.setXYZW(T,L.x,L.y,L.z,z)}for(let T=0,B=w.length;T<B;++T){const Z=w[T],z=Z.start,Q=Z.count;for(let ee=z,he=z+Q;ee<he;ee+=3)O(e.getX(ee+0)),O(e.getX(ee+1)),O(e.getX(ee+2))}}computeVertexNormals(){const e=this.index,i=this.getAttribute("position");if(i!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new pi(new Float32Array(i.count*3),3),this.setAttribute("normal",r);else for(let g=0,M=r.count;g<M;g++)r.setXYZ(g,0,0,0);const l=new $,c=new $,h=new $,p=new $,m=new $,d=new $,_=new $,v=new $;if(e)for(let g=0,M=e.count;g<M;g+=3){const E=e.getX(g+0),C=e.getX(g+1),y=e.getX(g+2);l.fromBufferAttribute(i,E),c.fromBufferAttribute(i,C),h.fromBufferAttribute(i,y),_.subVectors(h,c),v.subVectors(l,c),_.cross(v),p.fromBufferAttribute(r,E),m.fromBufferAttribute(r,C),d.fromBufferAttribute(r,y),p.add(_),m.add(_),d.add(_),r.setXYZ(E,p.x,p.y,p.z),r.setXYZ(C,m.x,m.y,m.z),r.setXYZ(y,d.x,d.y,d.z)}else for(let g=0,M=i.count;g<M;g+=3)l.fromBufferAttribute(i,g+0),c.fromBufferAttribute(i,g+1),h.fromBufferAttribute(i,g+2),_.subVectors(h,c),v.subVectors(l,c),_.cross(v),r.setXYZ(g+0,_.x,_.y,_.z),r.setXYZ(g+1,_.x,_.y,_.z),r.setXYZ(g+2,_.x,_.y,_.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let i=0,r=e.count;i<r;i++)En.fromBufferAttribute(e,i),En.normalize(),e.setXYZ(i,En.x,En.y,En.z)}toNonIndexed(){function e(p,m){const d=p.array,_=p.itemSize,v=p.normalized,g=new d.constructor(m.length*_);let M=0,E=0;for(let C=0,y=m.length;C<y;C++){p.isInterleavedBufferAttribute?M=m[C]*p.data.stride+p.offset:M=m[C]*_;for(let S=0;S<_;S++)g[E++]=d[M++]}return new pi(g,_,v)}if(this.index===null)return tt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new mi,r=this.index.array,l=this.attributes;for(const p in l){const m=l[p],d=e(m,r);i.setAttribute(p,d)}const c=this.morphAttributes;for(const p in c){const m=[],d=c[p];for(let _=0,v=d.length;_<v;_++){const g=d[_],M=e(g,r);m.push(M)}i.morphAttributes[p]=m}i.morphTargetsRelative=this.morphTargetsRelative;const h=this.groups;for(let p=0,m=h.length;p<m;p++){const d=h[p];i.addGroup(d.start,d.count,d.materialIndex)}return i}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const d in m)m[d]!==void 0&&(e[d]=m[d]);return e}e.data={attributes:{}};const i=this.index;i!==null&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const r=this.attributes;for(const m in r){const d=r[m];e.data.attributes[m]=d.toJSON(e.data)}const l={};let c=!1;for(const m in this.morphAttributes){const d=this.morphAttributes[m],_=[];for(let v=0,g=d.length;v<g;v++){const M=d[v];_.push(M.toJSON(e.data))}_.length>0&&(l[m]=_,c=!0)}c&&(e.data.morphAttributes=l,e.data.morphTargetsRelative=this.morphTargetsRelative);const h=this.groups;h.length>0&&(e.data.groups=JSON.parse(JSON.stringify(h)));const p=this.boundingSphere;return p!==null&&(e.data.boundingSphere=p.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone());const l=e.attributes;for(const d in l){const _=l[d];this.setAttribute(d,_.clone(i))}const c=e.morphAttributes;for(const d in c){const _=[],v=c[d];for(let g=0,M=v.length;g<M;g++)_.push(v[g].clone(i));this.morphAttributes[d]=_}this.morphTargetsRelative=e.morphTargetsRelative;const h=e.groups;for(let d=0,_=h.length;d<_;d++){const v=h[d];this.addGroup(v.start,v.count,v.materialIndex)}const p=e.boundingBox;p!==null&&(this.boundingBox=p.clone());const m=e.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let sb=0;class Ks extends _s{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:sb++}),this.uuid=hl(),this.name="",this.type="Material",this.blending=qr,this.side=ps,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sd,this.blendDst=yd,this.blendEquation=Gs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new dt(0,0,0),this.blendAlpha=0,this.depthFunc=Zr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=U_,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wr,this.stencilZFail=wr,this.stencilZPass=wr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const i in e){const r=e[i];if(r===void 0){tt(`Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){tt(`Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(r):l&&l.isVector3&&r&&r.isVector3?l.copy(r):this[i]=r}}toJSON(e){const i=e===void 0||typeof e=="string";i&&(e={textures:{},images:{}});const r={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(r.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(r.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==qr&&(r.blending=this.blending),this.side!==ps&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Sd&&(r.blendSrc=this.blendSrc),this.blendDst!==yd&&(r.blendDst=this.blendDst),this.blendEquation!==Gs&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==Zr&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==U_&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wr&&(r.stencilFail=this.stencilFail),this.stencilZFail!==wr&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==wr&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.allowOverride===!1&&(r.allowOverride=!1),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function l(c){const h=[];for(const p in c){const m=c[p];delete m.metadata,h.push(m)}return h}if(i){const c=l(e.textures),h=l(e.images);c.length>0&&(r.textures=c),h.length>0&&(r.images=h)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const i=e.clippingPlanes;let r=null;if(i!==null){const l=i.length;r=new Array(l);for(let c=0;c!==l;++c)r[c]=i[c].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const ya=new $,td=new $,Oc=new $,ls=new $,nd=new $,Pc=new $,id=new $;class Cp{constructor(e=new $,i=new $(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ya)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);const r=i.dot(this.direction);return r<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const i=ya.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(ya.copy(this.origin).addScaledVector(this.direction,i),ya.distanceToSquared(e))}distanceSqToSegment(e,i,r,l){td.copy(e).add(i).multiplyScalar(.5),Oc.copy(i).sub(e).normalize(),ls.copy(this.origin).sub(td);const c=e.distanceTo(i)*.5,h=-this.direction.dot(Oc),p=ls.dot(this.direction),m=-ls.dot(Oc),d=ls.lengthSq(),_=Math.abs(1-h*h);let v,g,M,E;if(_>0)if(v=h*m-p,g=h*p-m,E=c*_,v>=0)if(g>=-E)if(g<=E){const C=1/_;v*=C,g*=C,M=v*(v+h*g+2*p)+g*(h*v+g+2*m)+d}else g=c,v=Math.max(0,-(h*g+p)),M=-v*v+g*(g+2*m)+d;else g=-c,v=Math.max(0,-(h*g+p)),M=-v*v+g*(g+2*m)+d;else g<=-E?(v=Math.max(0,-(-h*c+p)),g=v>0?-c:Math.min(Math.max(-c,-m),c),M=-v*v+g*(g+2*m)+d):g<=E?(v=0,g=Math.min(Math.max(-c,-m),c),M=g*(g+2*m)+d):(v=Math.max(0,-(h*c+p)),g=v>0?c:Math.min(Math.max(-c,-m),c),M=-v*v+g*(g+2*m)+d);else g=h>0?-c:c,v=Math.max(0,-(h*g+p)),M=-v*v+g*(g+2*m)+d;return r&&r.copy(this.origin).addScaledVector(this.direction,v),l&&l.copy(td).addScaledVector(Oc,g),M}intersectSphere(e,i){ya.subVectors(e.center,this.origin);const r=ya.dot(this.direction),l=ya.dot(ya)-r*r,c=e.radius*e.radius;if(l>c)return null;const h=Math.sqrt(c-l),p=r-h,m=r+h;return m<0?null:p<0?this.at(m,i):this.at(p,i)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const i=e.normal.dot(this.direction);if(i===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/i;return r>=0?r:null}intersectPlane(e,i){const r=this.distanceToPlane(e);return r===null?null:this.at(r,i)}intersectsPlane(e){const i=e.distanceToPoint(this.origin);return i===0||e.normal.dot(this.direction)*i<0}intersectBox(e,i){let r,l,c,h,p,m;const d=1/this.direction.x,_=1/this.direction.y,v=1/this.direction.z,g=this.origin;return d>=0?(r=(e.min.x-g.x)*d,l=(e.max.x-g.x)*d):(r=(e.max.x-g.x)*d,l=(e.min.x-g.x)*d),_>=0?(c=(e.min.y-g.y)*_,h=(e.max.y-g.y)*_):(c=(e.max.y-g.y)*_,h=(e.min.y-g.y)*_),r>h||c>l||((c>r||isNaN(r))&&(r=c),(h<l||isNaN(l))&&(l=h),v>=0?(p=(e.min.z-g.z)*v,m=(e.max.z-g.z)*v):(p=(e.max.z-g.z)*v,m=(e.min.z-g.z)*v),r>m||p>l)||((p>r||r!==r)&&(r=p),(m<l||l!==l)&&(l=m),l<0)?null:this.at(r>=0?r:l,i)}intersectsBox(e){return this.intersectBox(e,ya)!==null}intersectTriangle(e,i,r,l,c){nd.subVectors(i,e),Pc.subVectors(r,e),id.crossVectors(nd,Pc);let h=this.direction.dot(id),p;if(h>0){if(l)return null;p=1}else if(h<0)p=-1,h=-h;else return null;ls.subVectors(this.origin,e);const m=p*this.direction.dot(Pc.crossVectors(ls,Pc));if(m<0)return null;const d=p*this.direction.dot(nd.cross(ls));if(d<0||m+d>h)return null;const _=-p*ls.dot(id);return _<0?null:this.at(_/h,c)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ux extends Ks{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gs,this.combine=kv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const q_=new on,zs=new Cp,Ic=new yu,Y_=new $,Fc=new $,Bc=new $,zc=new $,ad=new $,Hc=new $,Z_=new $,Gc=new $;class Fi extends Tn{constructor(e=new mi,i=new ux){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,h=l.length;c<h;c++){const p=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[p]=c}}}}getVertexPosition(e,i){const r=this.geometry,l=r.attributes.position,c=r.morphAttributes.position,h=r.morphTargetsRelative;i.fromBufferAttribute(l,e);const p=this.morphTargetInfluences;if(c&&p){Hc.set(0,0,0);for(let m=0,d=c.length;m<d;m++){const _=p[m],v=c[m];_!==0&&(ad.fromBufferAttribute(v,e),h?Hc.addScaledVector(ad,_):Hc.addScaledVector(ad.sub(i),_))}i.add(Hc)}return i}raycast(e,i){const r=this.geometry,l=this.material,c=this.matrixWorld;l!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Ic.copy(r.boundingSphere),Ic.applyMatrix4(c),zs.copy(e.ray).recast(e.near),!(Ic.containsPoint(zs.origin)===!1&&(zs.intersectSphere(Ic,Y_)===null||zs.origin.distanceToSquared(Y_)>(e.far-e.near)**2))&&(q_.copy(c).invert(),zs.copy(e.ray).applyMatrix4(q_),!(r.boundingBox!==null&&zs.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,i,zs)))}_computeIntersections(e,i,r){let l;const c=this.geometry,h=this.material,p=c.index,m=c.attributes.position,d=c.attributes.uv,_=c.attributes.uv1,v=c.attributes.normal,g=c.groups,M=c.drawRange;if(p!==null)if(Array.isArray(h))for(let E=0,C=g.length;E<C;E++){const y=g[E],S=h[y.materialIndex],w=Math.max(y.start,M.start),L=Math.min(p.count,Math.min(y.start+y.count,M.start+M.count));for(let I=w,V=L;I<V;I+=3){const N=p.getX(I),O=p.getX(I+1),T=p.getX(I+2);l=Vc(this,S,e,r,d,_,v,N,O,T),l&&(l.faceIndex=Math.floor(I/3),l.face.materialIndex=y.materialIndex,i.push(l))}}else{const E=Math.max(0,M.start),C=Math.min(p.count,M.start+M.count);for(let y=E,S=C;y<S;y+=3){const w=p.getX(y),L=p.getX(y+1),I=p.getX(y+2);l=Vc(this,h,e,r,d,_,v,w,L,I),l&&(l.faceIndex=Math.floor(y/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(h))for(let E=0,C=g.length;E<C;E++){const y=g[E],S=h[y.materialIndex],w=Math.max(y.start,M.start),L=Math.min(m.count,Math.min(y.start+y.count,M.start+M.count));for(let I=w,V=L;I<V;I+=3){const N=I,O=I+1,T=I+2;l=Vc(this,S,e,r,d,_,v,N,O,T),l&&(l.faceIndex=Math.floor(I/3),l.face.materialIndex=y.materialIndex,i.push(l))}}else{const E=Math.max(0,M.start),C=Math.min(m.count,M.start+M.count);for(let y=E,S=C;y<S;y+=3){const w=y,L=y+1,I=y+2;l=Vc(this,h,e,r,d,_,v,w,L,I),l&&(l.faceIndex=Math.floor(y/3),i.push(l))}}}}function rb(s,e,i,r,l,c,h,p){let m;if(e.side===$n?m=r.intersectTriangle(h,c,l,!0,p):m=r.intersectTriangle(l,c,h,e.side===ps,p),m===null)return null;Gc.copy(p),Gc.applyMatrix4(s.matrixWorld);const d=i.ray.origin.distanceTo(Gc);return d<i.near||d>i.far?null:{distance:d,point:Gc.clone(),object:s}}function Vc(s,e,i,r,l,c,h,p,m,d){s.getVertexPosition(p,Fc),s.getVertexPosition(m,Bc),s.getVertexPosition(d,zc);const _=rb(s,e,i,r,Fc,Bc,zc,Z_);if(_){const v=new $;Ri.getBarycoord(Z_,Fc,Bc,zc,v),l&&(_.uv=Ri.getInterpolatedAttribute(l,p,m,d,v,new ot)),c&&(_.uv1=Ri.getInterpolatedAttribute(c,p,m,d,v,new ot)),h&&(_.normal=Ri.getInterpolatedAttribute(h,p,m,d,v,new $),_.normal.dot(r.direction)>0&&_.normal.multiplyScalar(-1));const g={a:p,b:m,c:d,normal:new $,materialIndex:0};Ri.getNormal(Fc,Bc,zc,g.normal),_.face=g,_.barycoord=v}return _}class ob extends kn{constructor(e=null,i=1,r=1,l,c,h,p,m,d=Ln,_=Ln,v,g){super(null,h,p,m,d,_,l,c,v,g),this.isDataTexture=!0,this.image={data:e,width:i,height:r},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const sd=new $,lb=new $,cb=new rt;class us{constructor(e=new $(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,r,l){return this.normal.set(e,i,r),this.constant=l,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,r){const l=sd.subVectors(r,i).cross(lb.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i,r=!0){const l=e.delta(sd),c=this.normal.dot(l);if(c===0)return this.distanceToPoint(e.start)===0?i.copy(e.start):null;const h=-(e.start.dot(this.normal)+this.constant)/c;return r===!0&&(h<0||h>1)?null:i.copy(e.start).addScaledVector(l,h)}intersectsLine(e){const i=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return i<0&&r>0||r<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){const r=i||cb.getNormalMatrix(e),l=this.coplanarPoint(sd).applyMatrix4(e),c=this.normal.applyMatrix3(r).normalize();return this.constant=-l.dot(c),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Hs=new yu,ub=new ot(.5,.5),kc=new $;class wp{constructor(e=new us,i=new us,r=new us,l=new us,c=new us,h=new us){this.planes=[e,i,r,l,c,h]}set(e,i,r,l,c,h){const p=this.planes;return p[0].copy(e),p[1].copy(i),p[2].copy(r),p[3].copy(l),p[4].copy(c),p[5].copy(h),this}copy(e){const i=this.planes;for(let r=0;r<6;r++)i[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,i=Yi,r=!1){const l=this.planes,c=e.elements,h=c[0],p=c[1],m=c[2],d=c[3],_=c[4],v=c[5],g=c[6],M=c[7],E=c[8],C=c[9],y=c[10],S=c[11],w=c[12],L=c[13],I=c[14],V=c[15];if(l[0].setComponents(d-h,M-_,S-E,V-w).normalize(),l[1].setComponents(d+h,M+_,S+E,V+w).normalize(),l[2].setComponents(d+p,M+v,S+C,V+L).normalize(),l[3].setComponents(d-p,M-v,S-C,V-L).normalize(),r)l[4].setComponents(m,g,y,I).normalize(),l[5].setComponents(d-m,M-g,S-y,V-I).normalize();else if(l[4].setComponents(d-m,M-g,S-y,V-I).normalize(),i===Yi)l[5].setComponents(d+m,M+g,S+y,V+I).normalize();else if(i===fl)l[5].setComponents(m,g,y,I).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const i=e.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),Hs.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hs)}intersectsSprite(e){Hs.center.set(0,0,0);const i=ub.distanceTo(e.center);return Hs.radius=.7071067811865476+i,Hs.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hs)}intersectsSphere(e){const i=this.planes,r=e.center,l=-e.radius;for(let c=0;c<6;c++)if(i[c].distanceToPoint(r)<l)return!1;return!0}intersectsBox(e){const i=this.planes;for(let r=0;r<6;r++){const l=i[r];if(kc.x=l.normal.x>0?e.max.x:e.min.x,kc.y=l.normal.y>0?e.max.y:e.min.y,kc.z=l.normal.z>0?e.max.z:e.min.z,l.distanceToPoint(kc)<0)return!1}return!0}containsPoint(e){const i=this.planes;for(let r=0;r<6;r++)if(i[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class fx extends Ks{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new dt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const pu=new $,mu=new $,K_=new on,tl=new Cp,Xc=new yu,rd=new $,Q_=new $;class fb extends Tn{constructor(e=new mi,i=new fx){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,r=[0];for(let l=1,c=i.count;l<c;l++)pu.fromBufferAttribute(i,l-1),mu.fromBufferAttribute(i,l),r[l]=r[l-1],r[l]+=pu.distanceTo(mu);e.setAttribute("lineDistance",new ei(r,1))}else tt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,i){const r=this.geometry,l=this.matrixWorld,c=e.params.Line.threshold,h=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),Xc.copy(r.boundingSphere),Xc.applyMatrix4(l),Xc.radius+=c,e.ray.intersectsSphere(Xc)===!1)return;K_.copy(l).invert(),tl.copy(e.ray).applyMatrix4(K_);const p=c/((this.scale.x+this.scale.y+this.scale.z)/3),m=p*p,d=this.isLineSegments?2:1,_=r.index,g=r.attributes.position;if(_!==null){const M=Math.max(0,h.start),E=Math.min(_.count,h.start+h.count);for(let C=M,y=E-1;C<y;C+=d){const S=_.getX(C),w=_.getX(C+1),L=jc(this,e,tl,m,S,w,C);L&&i.push(L)}if(this.isLineLoop){const C=_.getX(E-1),y=_.getX(M),S=jc(this,e,tl,m,C,y,E-1);S&&i.push(S)}}else{const M=Math.max(0,h.start),E=Math.min(g.count,h.start+h.count);for(let C=M,y=E-1;C<y;C+=d){const S=jc(this,e,tl,m,C,C+1,C);S&&i.push(S)}if(this.isLineLoop){const C=jc(this,e,tl,m,E-1,M,E-1);C&&i.push(C)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,h=l.length;c<h;c++){const p=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[p]=c}}}}}function jc(s,e,i,r,l,c,h){const p=s.geometry.attributes.position;if(pu.fromBufferAttribute(p,l),mu.fromBufferAttribute(p,c),i.distanceSqToSegment(pu,mu,rd,Q_)>r)return;rd.applyMatrix4(s.matrixWorld);const d=e.ray.origin.distanceTo(rd);if(!(d<e.near||d>e.far))return{distance:d,point:Q_.clone().applyMatrix4(s.matrixWorld),index:h,face:null,faceIndex:null,barycoord:null,object:s}}const J_=new $,$_=new $;class hb extends fb{constructor(e,i){super(e,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,r=[];for(let l=0,c=i.count;l<c;l+=2)J_.fromBufferAttribute(i,l),$_.fromBufferAttribute(i,l+1),r[l]=l===0?0:r[l-1],r[l+1]=r[l]+J_.distanceTo($_);e.setAttribute("lineDistance",new ei(r,1))}else tt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class hx extends kn{constructor(e=[],i=qs,r,l,c,h,p,m,d,_){super(e,i,r,l,c,h,p,m,d,_),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Qr extends kn{constructor(e,i,r=Qi,l,c,h,p=Ln,m=Ln,d,_=Ca,v=1){if(_!==Ca&&_!==js)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const g={width:e,height:i,depth:v};super(g,l,c,h,p,m,_,r,d),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ap(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const i=super.toJSON(e);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class db extends Qr{constructor(e,i=Qi,r=qs,l,c,h=Ln,p=Ln,m,d=Ca){const _={width:e,height:e,depth:1},v=[_,_,_,_,_,_];super(e,e,i,r,l,c,h,p,m,d),this.image=v,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class dx extends kn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class pl extends mi{constructor(e=1,i=1,r=1,l=1,c=1,h=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:r,widthSegments:l,heightSegments:c,depthSegments:h};const p=this;l=Math.floor(l),c=Math.floor(c),h=Math.floor(h);const m=[],d=[],_=[],v=[];let g=0,M=0;E("z","y","x",-1,-1,r,i,e,h,c,0),E("z","y","x",1,-1,r,i,-e,h,c,1),E("x","z","y",1,1,e,r,i,l,h,2),E("x","z","y",1,-1,e,r,-i,l,h,3),E("x","y","z",1,-1,e,i,r,l,c,4),E("x","y","z",-1,-1,e,i,-r,l,c,5),this.setIndex(m),this.setAttribute("position",new ei(d,3)),this.setAttribute("normal",new ei(_,3)),this.setAttribute("uv",new ei(v,2));function E(C,y,S,w,L,I,V,N,O,T,B){const Z=I/O,z=V/T,Q=I/2,ee=V/2,he=N/2,j=O+1,P=T+1;let H=0,ne=0;const pe=new $;for(let ye=0;ye<P;ye++){const F=ye*z-ee;for(let q=0;q<j;q++){const Se=q*Z-Q;pe[C]=Se*w,pe[y]=F*L,pe[S]=he,d.push(pe.x,pe.y,pe.z),pe[C]=0,pe[y]=0,pe[S]=N>0?1:-1,_.push(pe.x,pe.y,pe.z),v.push(q/O),v.push(1-ye/T),H+=1}}for(let ye=0;ye<T;ye++)for(let F=0;F<O;F++){const q=g+F+j*ye,Se=g+F+j*(ye+1),Ae=g+(F+1)+j*(ye+1),Ce=g+(F+1)+j*ye;m.push(q,Se,Ce),m.push(Se,Ae,Ce),ne+=6}p.addGroup(M,ne,B),M+=ne,g+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pl(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}const Wc=new $,qc=new $,od=new $,Yc=new Ri;class pb extends mi{constructor(e=null,i=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:i},e!==null){const l=Math.pow(10,4),c=Math.cos(ol*i),h=e.getIndex(),p=e.getAttribute("position"),m=h?h.count:p.count,d=[0,0,0],_=["a","b","c"],v=new Array(3),g={},M=[];for(let E=0;E<m;E+=3){h?(d[0]=h.getX(E),d[1]=h.getX(E+1),d[2]=h.getX(E+2)):(d[0]=E,d[1]=E+1,d[2]=E+2);const{a:C,b:y,c:S}=Yc;if(C.fromBufferAttribute(p,d[0]),y.fromBufferAttribute(p,d[1]),S.fromBufferAttribute(p,d[2]),Yc.getNormal(od),v[0]=`${Math.round(C.x*l)},${Math.round(C.y*l)},${Math.round(C.z*l)}`,v[1]=`${Math.round(y.x*l)},${Math.round(y.y*l)},${Math.round(y.z*l)}`,v[2]=`${Math.round(S.x*l)},${Math.round(S.y*l)},${Math.round(S.z*l)}`,!(v[0]===v[1]||v[1]===v[2]||v[2]===v[0]))for(let w=0;w<3;w++){const L=(w+1)%3,I=v[w],V=v[L],N=Yc[_[w]],O=Yc[_[L]],T=`${I}_${V}`,B=`${V}_${I}`;B in g&&g[B]?(od.dot(g[B].normal)<=c&&(M.push(N.x,N.y,N.z),M.push(O.x,O.y,O.z)),g[B]=null):T in g||(g[T]={index0:d[w],index1:d[L],normal:od.clone()})}}for(const E in g)if(g[E]){const{index0:C,index1:y}=g[E];Wc.fromBufferAttribute(p,C),qc.fromBufferAttribute(p,y),M.push(Wc.x,Wc.y,Wc.z),M.push(qc.x,qc.y,qc.z)}this.setAttribute("position",new ei(M,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class ml extends mi{constructor(e=1,i=1,r=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:r,heightSegments:l};const c=e/2,h=i/2,p=Math.floor(r),m=Math.floor(l),d=p+1,_=m+1,v=e/p,g=i/m,M=[],E=[],C=[],y=[];for(let S=0;S<_;S++){const w=S*g-h;for(let L=0;L<d;L++){const I=L*v-c;E.push(I,-w,0),C.push(0,0,1),y.push(L/p),y.push(1-S/m)}}for(let S=0;S<m;S++)for(let w=0;w<p;w++){const L=w+d*S,I=w+d*(S+1),V=w+1+d*(S+1),N=w+1+d*S;M.push(L,I,N),M.push(I,V,N)}this.setIndex(M),this.setAttribute("position",new ei(E,3)),this.setAttribute("normal",new ei(C,3)),this.setAttribute("uv",new ei(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ml(e.width,e.height,e.widthSegments,e.heightSegments)}}class mb extends Ks{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new dt(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}function Jr(s){const e={};for(const i in s){e[i]={};for(const r in s[i]){const l=s[i][r];if(ev(l))l.isRenderTargetTexture?(tt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[i][r]=null):e[i][r]=l.clone();else if(Array.isArray(l))if(ev(l[0])){const c=[];for(let h=0,p=l.length;h<p;h++)c[h]=l[h].clone();e[i][r]=c}else e[i][r]=l.slice();else e[i][r]=l}}return e}function Gn(s){const e={};for(let i=0;i<s.length;i++){const r=Jr(s[i]);for(const l in r)e[l]=r[l]}return e}function ev(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function gb(s){const e=[];for(let i=0;i<s.length;i++)e.push(s[i].clone());return e}function px(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Tt.workingColorSpace}const _b={clone:Jr,merge:Gn};var vb=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,xb=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ji extends Ks{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=vb,this.fragmentShader=xb,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Jr(e.uniforms),this.uniformsGroups=gb(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const i=super.toJSON(e);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const h=this.uniforms[l].value;h&&h.isTexture?i.uniforms[l]={type:"t",value:h.toJSON(e).uuid}:h&&h.isColor?i.uniforms[l]={type:"c",value:h.getHex()}:h&&h.isVector2?i.uniforms[l]={type:"v2",value:h.toArray()}:h&&h.isVector3?i.uniforms[l]={type:"v3",value:h.toArray()}:h&&h.isVector4?i.uniforms[l]={type:"v4",value:h.toArray()}:h&&h.isMatrix3?i.uniforms[l]={type:"m3",value:h.toArray()}:h&&h.isMatrix4?i.uniforms[l]={type:"m4",value:h.toArray()}:i.uniforms[l]={value:h}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const r={};for(const l in this.extensions)this.extensions[l]===!0&&(r[l]=!0);return Object.keys(r).length>0&&(i.extensions=r),i}}class Sb extends Ji{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class yb extends Ks{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new dt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=op,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gs,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Mb extends yb{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ot(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return gt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(i){this.ior=(1+.4*i)/(1-.4*i)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new dt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new dt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new dt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class bb extends Ks{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=CM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Eb extends Ks{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const tv={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(nv(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!nv(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function nv(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Tb{constructor(e,i,r){const l=this;let c=!1,h=0,p=0,m;const d=[];this.onStart=void 0,this.onLoad=e,this.onProgress=i,this.onError=r,this._abortController=null,this.itemStart=function(_){p++,c===!1&&l.onStart!==void 0&&l.onStart(_,h,p),c=!0},this.itemEnd=function(_){h++,l.onProgress!==void 0&&l.onProgress(_,h,p),h===p&&(c=!1,l.onLoad!==void 0&&l.onLoad())},this.itemError=function(_){l.onError!==void 0&&l.onError(_)},this.resolveURL=function(_){return m?m(_):_},this.setURLModifier=function(_){return m=_,this},this.addHandler=function(_,v){return d.push(_,v),this},this.removeHandler=function(_){const v=d.indexOf(_);return v!==-1&&d.splice(v,2),this},this.getHandler=function(_){for(let v=0,g=d.length;v<g;v+=2){const M=d[v],E=d[v+1];if(M.global&&(M.lastIndex=0),M.test(_))return E}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Ab=new Tb;class Dp{constructor(e){this.manager=e!==void 0?e:Ab,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,i){const r=this;return new Promise(function(l,c){r.load(e,l,i,c)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Dp.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ma={};class Rb extends Error{constructor(e,i){super(e),this.response=i}}class Cb extends Dp{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,i,r,l){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const c=tv.get(`file:${e}`);if(c!==void 0){this.manager.itemStart(e),setTimeout(()=>{i&&i(c),this.manager.itemEnd(e)},0);return}if(Ma[e]!==void 0){Ma[e].push({onLoad:i,onProgress:r,onError:l});return}Ma[e]=[],Ma[e].push({onLoad:i,onProgress:r,onError:l});const h=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),p=this.mimeType,m=this.responseType;fetch(h).then(d=>{if(d.status===200||d.status===0){if(d.status===0&&tt("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||d.body===void 0||d.body.getReader===void 0)return d;const _=Ma[e],v=d.body.getReader(),g=d.headers.get("X-File-Size")||d.headers.get("Content-Length"),M=g?parseInt(g):0,E=M!==0;let C=0;const y=new ReadableStream({start(S){w();function w(){v.read().then(({done:L,value:I})=>{if(L)S.close();else{C+=I.byteLength;const V=new ProgressEvent("progress",{lengthComputable:E,loaded:C,total:M});for(let N=0,O=_.length;N<O;N++){const T=_[N];T.onProgress&&T.onProgress(V)}S.enqueue(I),w()}},L=>{S.error(L)})}}});return new Response(y)}else throw new Rb(`fetch for "${d.url}" responded with ${d.status}: ${d.statusText}`,d)}).then(d=>{switch(m){case"arraybuffer":return d.arrayBuffer();case"blob":return d.blob();case"document":return d.text().then(_=>new DOMParser().parseFromString(_,p));case"json":return d.json();default:if(p==="")return d.text();{const v=/charset="?([^;"\s]*)"?/i.exec(p),g=v&&v[1]?v[1].toLowerCase():void 0,M=new TextDecoder(g);return d.arrayBuffer().then(E=>M.decode(E))}}}).then(d=>{tv.add(`file:${e}`,d);const _=Ma[e];delete Ma[e];for(let v=0,g=_.length;v<g;v++){const M=_[v];M.onLoad&&M.onLoad(d)}}).catch(d=>{const _=Ma[e];if(_===void 0)throw this.manager.itemError(e),d;delete Ma[e];for(let v=0,g=_.length;v<g;v++){const M=_[v];M.onError&&M.onError(d)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class mx extends Tn{constructor(e,i=1){super(),this.isLight=!0,this.type="Light",this.color=new dt(e),this.intensity=i}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,i){return super.copy(e,i),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const i=super.toJSON(e);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,i}}class wb extends mx{constructor(e,i,r){super(e,r),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Tn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new dt(i)}copy(e,i){return super.copy(e,i),this.groundColor.copy(e.groundColor),this}toJSON(e){const i=super.toJSON(e);return i.object.groundColor=this.groundColor.getHex(),i}}const ld=new on,iv=new $,av=new $;class Db{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.mapType=di,this.map=null,this.mapPass=null,this.matrix=new on,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wp,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new rn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const i=this.camera,r=this.matrix;iv.setFromMatrixPosition(e.matrixWorld),i.position.copy(iv),av.setFromMatrixPosition(e.target.matrixWorld),i.lookAt(av),i.updateMatrixWorld(),ld.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ld,i.coordinateSystem,i.reversedDepth),i.coordinateSystem===fl||i.reversedDepth?r.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(ld)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Zc=new $,Kc=new ms,Xi=new $;class gx extends Tn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new on,this.projectionMatrix=new on,this.projectionMatrixInverse=new on,this.coordinateSystem=Yi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Zc,Kc,Xi),Xi.x===1&&Xi.y===1&&Xi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zc,Kc,Xi.set(1,1,1)).invert()}updateWorldMatrix(e,i){super.updateWorldMatrix(e,i),this.matrixWorld.decompose(Zc,Kc,Xi),Xi.x===1&&Xi.y===1&&Xi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zc,Kc,Xi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const cs=new $,sv=new ot,rv=new ot;class Ai extends gx{constructor(e=50,i=1,r=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const i=.5*this.getFilmHeight()/e;this.fov=cp*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ol*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return cp*2*Math.atan(Math.tan(ol*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,i,r){cs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(cs.x,cs.y).multiplyScalar(-e/cs.z),cs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(cs.x,cs.y).multiplyScalar(-e/cs.z)}getViewSize(e,i){return this.getViewBounds(e,sv,rv),i.subVectors(rv,sv)}setViewOffset(e,i,r,l,c,h){this.aspect=e/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=c,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let i=e*Math.tan(ol*.5*this.fov)/this.zoom,r=2*i,l=this.aspect*r,c=-.5*l;const h=this.view;if(this.view!==null&&this.view.enabled){const m=h.fullWidth,d=h.fullHeight;c+=h.offsetX*l/m,i-=h.offsetY*r/d,l*=h.width/m,r*=h.height/d}const p=this.filmOffset;p!==0&&(c+=e*p/this.getFilmWidth()),this.projectionMatrix.makePerspective(c,c+l,i,i-r,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}class Up extends gx{constructor(e=-1,i=1,r=1,l=-1,c=.1,h=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=r,this.bottom=l,this.near=c,this.far=h,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,i,r,l,c,h){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=c,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let c=r-e,h=r+e,p=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const d=(this.right-this.left)/this.view.fullWidth/this.zoom,_=(this.top-this.bottom)/this.view.fullHeight/this.zoom;c+=d*this.view.offsetX,h=c+d*this.view.width,p-=_*this.view.offsetY,m=p-_*this.view.height}this.projectionMatrix.makeOrthographic(c,h,p,m,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class Ub extends Db{constructor(){super(new Up(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class cd extends mx{constructor(e,i){super(e,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Tn.DEFAULT_UP),this.updateMatrix(),this.target=new Tn,this.shadow=new Ub}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const i=super.toJSON(e);return i.object.shadow=this.shadow.toJSON(),i.object.target=this.target.uuid,i}}const Hr=-90,Gr=1;class Nb extends Tn{constructor(e,i,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new Ai(Hr,Gr,e,i);l.layers=this.layers,this.add(l);const c=new Ai(Hr,Gr,e,i);c.layers=this.layers,this.add(c);const h=new Ai(Hr,Gr,e,i);h.layers=this.layers,this.add(h);const p=new Ai(Hr,Gr,e,i);p.layers=this.layers,this.add(p);const m=new Ai(Hr,Gr,e,i);m.layers=this.layers,this.add(m);const d=new Ai(Hr,Gr,e,i);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){const e=this.coordinateSystem,i=this.children.concat(),[r,l,c,h,p,m]=i;for(const d of i)this.remove(d);if(e===Yi)r.up.set(0,1,0),r.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),c.up.set(0,0,-1),c.lookAt(0,1,0),h.up.set(0,0,1),h.lookAt(0,-1,0),p.up.set(0,1,0),p.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(e===fl)r.up.set(0,-1,0),r.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),c.up.set(0,0,1),c.lookAt(0,1,0),h.up.set(0,0,-1),h.lookAt(0,-1,0),p.up.set(0,-1,0),p.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const d of i)this.add(d),d.updateMatrixWorld()}update(e,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:l}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[c,h,p,m,d,_]=this.children,v=e.getRenderTarget(),g=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const C=r.texture.generateMipmaps;r.texture.generateMipmaps=!1;let y=!1;e.isWebGLRenderer===!0?y=e.state.buffers.depth.getReversed():y=e.reversedDepthBuffer,e.setRenderTarget(r,0,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,c),e.setRenderTarget(r,1,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,h),e.setRenderTarget(r,2,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,p),e.setRenderTarget(r,3,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,m),e.setRenderTarget(r,4,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,d),r.texture.generateMipmaps=C,e.setRenderTarget(r,5,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,_),e.setRenderTarget(v,g,M),e.xr.enabled=E,r.texture.needsPMREMUpdate=!0}}class Lb extends Ai{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class ov{constructor(e=1,i=0,r=0){this.radius=e,this.phi=i,this.theta=r}set(e,i,r){return this.radius=e,this.phi=i,this.theta=r,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=gt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,i,r){return this.radius=Math.sqrt(e*e+i*i+r*r),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,r),this.phi=Math.acos(gt(i/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Bp=class Bp{constructor(e,i,r,l){this.elements=[1,0,0,1],e!==void 0&&this.set(e,i,r,l)}identity(){return this.set(1,0,0,1),this}fromArray(e,i=0){for(let r=0;r<4;r++)this.elements[r]=e[r+i];return this}set(e,i,r,l){const c=this.elements;return c[0]=e,c[2]=i,c[1]=r,c[3]=l,this}};Bp.prototype.isMatrix2=!0;let lv=Bp;class Ob extends _s{constructor(e,i=null){super(),this.object=e,this.domElement=i,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){tt("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function cv(s,e,i,r){const l=Pb(r);switch(i){case tx:return s*e;case ix:return s*e/l.components*l.byteLength;case yp:return s*e/l.components*l.byteLength;case Ys:return s*e*2/l.components*l.byteLength;case Mp:return s*e*2/l.components*l.byteLength;case nx:return s*e*3/l.components*l.byteLength;case Ii:return s*e*4/l.components*l.byteLength;case bp:return s*e*4/l.components*l.byteLength;case iu:case au:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case su:case ru:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Nd:case Od:return Math.max(s,16)*Math.max(e,8)/4;case Ud:case Ld:return Math.max(s,8)*Math.max(e,8)/2;case Pd:case Id:case Bd:case zd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Fd:case cu:case Hd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Gd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Vd:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case kd:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Xd:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case jd:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Wd:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case qd:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Yd:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Zd:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Kd:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Qd:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Jd:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case $d:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case ep:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case tp:case np:case ip:return Math.ceil(s/4)*Math.ceil(e/4)*16;case ap:case sp:return Math.ceil(s/4)*Math.ceil(e/4)*8;case uu:case rp:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function Pb(s){switch(s){case di:case Qv:return{byteLength:1,components:1};case cl:case Jv:case Ra:return{byteLength:2,components:1};case xp:case Sp:return{byteLength:2,components:4};case Qi:case vp:case qi:return{byteLength:4,components:1};case $v:case ex:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:gp}}));typeof window<"u"&&(window.__THREE__?tt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=gp);function _x(){let s=null,e=!1,i=null,r=null;function l(c,h){i(c,h),r=s.requestAnimationFrame(l)}return{start:function(){e!==!0&&i!==null&&s!==null&&(r=s.requestAnimationFrame(l),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(c){i=c},setContext:function(c){s=c}}}function Ib(s){const e=new WeakMap;function i(p,m){const d=p.array,_=p.usage,v=d.byteLength,g=s.createBuffer();s.bindBuffer(m,g),s.bufferData(m,d,_),p.onUploadCallback();let M;if(d instanceof Float32Array)M=s.FLOAT;else if(typeof Float16Array<"u"&&d instanceof Float16Array)M=s.HALF_FLOAT;else if(d instanceof Uint16Array)p.isFloat16BufferAttribute?M=s.HALF_FLOAT:M=s.UNSIGNED_SHORT;else if(d instanceof Int16Array)M=s.SHORT;else if(d instanceof Uint32Array)M=s.UNSIGNED_INT;else if(d instanceof Int32Array)M=s.INT;else if(d instanceof Int8Array)M=s.BYTE;else if(d instanceof Uint8Array)M=s.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)M=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:g,type:M,bytesPerElement:d.BYTES_PER_ELEMENT,version:p.version,size:v}}function r(p,m,d){const _=m.array,v=m.updateRanges;if(s.bindBuffer(d,p),v.length===0)s.bufferSubData(d,0,_);else{v.sort((M,E)=>M.start-E.start);let g=0;for(let M=1;M<v.length;M++){const E=v[g],C=v[M];C.start<=E.start+E.count+1?E.count=Math.max(E.count,C.start+C.count-E.start):(++g,v[g]=C)}v.length=g+1;for(let M=0,E=v.length;M<E;M++){const C=v[M];s.bufferSubData(d,C.start*_.BYTES_PER_ELEMENT,_,C.start,C.count)}m.clearUpdateRanges()}m.onUploadCallback()}function l(p){return p.isInterleavedBufferAttribute&&(p=p.data),e.get(p)}function c(p){p.isInterleavedBufferAttribute&&(p=p.data);const m=e.get(p);m&&(s.deleteBuffer(m.buffer),e.delete(p))}function h(p,m){if(p.isInterleavedBufferAttribute&&(p=p.data),p.isGLBufferAttribute){const _=e.get(p);(!_||_.version<p.version)&&e.set(p,{buffer:p.buffer,type:p.type,bytesPerElement:p.elementSize,version:p.version});return}const d=e.get(p);if(d===void 0)e.set(p,i(p,m));else if(d.version<p.version){if(d.size!==p.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,p,m),d.version=p.version}}return{get:l,remove:c,update:h}}var Fb=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bb=`#ifdef USE_ALPHAHASH
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
#endif`,zb=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Hb=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gb=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Vb=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,kb=`#ifdef USE_AOMAP
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
#endif`,Xb=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jb=`#ifdef USE_BATCHING
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
#endif`,Wb=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,qb=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Yb=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Zb=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Kb=`#ifdef USE_IRIDESCENCE
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
#endif`,Qb=`#ifdef USE_BUMPMAP
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
#endif`,Jb=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$b=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,eE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,iE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,aE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,sE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,rE=`#define PI 3.141592653589793
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
} // validated`,oE=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,lE=`vec3 transformedNormal = objectNormal;
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
#endif`,cE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,uE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,dE="gl_FragColor = linearToOutputTexel( gl_FragColor );",pE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mE=`#ifdef USE_ENVMAP
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
#endif`,gE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,_E=`#ifdef USE_ENVMAP
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
#endif`,vE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xE=`#ifdef USE_ENVMAP
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
#endif`,SE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,yE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ME=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,EE=`#ifdef USE_GRADIENTMAP
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
}`,TE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,AE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,RE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,CE=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,wE=`#ifdef USE_ENVMAP
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
#endif`,DE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,UE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,NE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,LE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,OE=`PhysicalMaterial material;
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
#endif`,PE=`uniform sampler2D dfgLUT;
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
}`,IE=`
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
#endif`,FE=`#if defined( RE_IndirectDiffuse )
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
#endif`,BE=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,zE=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,HE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,GE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,VE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,XE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,WE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,qE=`#if defined( USE_POINTS_UV )
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
#endif`,YE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ZE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,KE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,QE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,JE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$E=`#ifdef USE_MORPHTARGETS
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
#endif`,e1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,t1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,n1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,i1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,a1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,s1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,r1=`#ifdef USE_NORMALMAP
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
#endif`,o1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,l1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,c1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,u1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,f1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,h1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,d1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,p1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,m1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,g1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,_1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,v1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,x1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,S1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,y1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,M1=`float getShadowMask() {
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
}`,b1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,E1=`#ifdef USE_SKINNING
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
#endif`,T1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,A1=`#ifdef USE_SKINNING
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
#endif`,R1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,C1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,w1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,D1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,U1=`#ifdef USE_TRANSMISSION
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
#endif`,N1=`#ifdef USE_TRANSMISSION
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
#endif`,L1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,O1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,P1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,I1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const F1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,B1=`uniform sampler2D t2D;
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
}`,z1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,H1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,G1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,V1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,k1=`#include <common>
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
}`,X1=`#if DEPTH_PACKING == 3200
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
}`,j1=`#define DISTANCE
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
}`,W1=`#define DISTANCE
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
}`,q1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Y1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Z1=`uniform float scale;
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
}`,K1=`uniform vec3 diffuse;
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
}`,Q1=`#include <common>
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
}`,J1=`uniform vec3 diffuse;
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
}`,$1=`#define LAMBERT
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
}`,eT=`#define LAMBERT
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
}`,tT=`#define MATCAP
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
}`,nT=`#define MATCAP
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
}`,iT=`#define NORMAL
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
}`,aT=`#define NORMAL
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
}`,sT=`#define PHONG
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
}`,rT=`#define PHONG
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
}`,oT=`#define STANDARD
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
}`,lT=`#define STANDARD
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
}`,cT=`#define TOON
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
}`,uT=`#define TOON
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
}`,fT=`uniform float size;
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
}`,hT=`uniform vec3 diffuse;
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
}`,dT=`#include <common>
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
}`,pT=`uniform vec3 color;
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
}`,mT=`uniform float rotation;
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
}`,gT=`uniform vec3 diffuse;
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
}`,ht={alphahash_fragment:Fb,alphahash_pars_fragment:Bb,alphamap_fragment:zb,alphamap_pars_fragment:Hb,alphatest_fragment:Gb,alphatest_pars_fragment:Vb,aomap_fragment:kb,aomap_pars_fragment:Xb,batching_pars_vertex:jb,batching_vertex:Wb,begin_vertex:qb,beginnormal_vertex:Yb,bsdfs:Zb,iridescence_fragment:Kb,bumpmap_pars_fragment:Qb,clipping_planes_fragment:Jb,clipping_planes_pars_fragment:$b,clipping_planes_pars_vertex:eE,clipping_planes_vertex:tE,color_fragment:nE,color_pars_fragment:iE,color_pars_vertex:aE,color_vertex:sE,common:rE,cube_uv_reflection_fragment:oE,defaultnormal_vertex:lE,displacementmap_pars_vertex:cE,displacementmap_vertex:uE,emissivemap_fragment:fE,emissivemap_pars_fragment:hE,colorspace_fragment:dE,colorspace_pars_fragment:pE,envmap_fragment:mE,envmap_common_pars_fragment:gE,envmap_pars_fragment:_E,envmap_pars_vertex:vE,envmap_physical_pars_fragment:wE,envmap_vertex:xE,fog_vertex:SE,fog_pars_vertex:yE,fog_fragment:ME,fog_pars_fragment:bE,gradientmap_pars_fragment:EE,lightmap_pars_fragment:TE,lights_lambert_fragment:AE,lights_lambert_pars_fragment:RE,lights_pars_begin:CE,lights_toon_fragment:DE,lights_toon_pars_fragment:UE,lights_phong_fragment:NE,lights_phong_pars_fragment:LE,lights_physical_fragment:OE,lights_physical_pars_fragment:PE,lights_fragment_begin:IE,lights_fragment_maps:FE,lights_fragment_end:BE,lightprobes_pars_fragment:zE,logdepthbuf_fragment:HE,logdepthbuf_pars_fragment:GE,logdepthbuf_pars_vertex:VE,logdepthbuf_vertex:kE,map_fragment:XE,map_pars_fragment:jE,map_particle_fragment:WE,map_particle_pars_fragment:qE,metalnessmap_fragment:YE,metalnessmap_pars_fragment:ZE,morphinstance_vertex:KE,morphcolor_vertex:QE,morphnormal_vertex:JE,morphtarget_pars_vertex:$E,morphtarget_vertex:e1,normal_fragment_begin:t1,normal_fragment_maps:n1,normal_pars_fragment:i1,normal_pars_vertex:a1,normal_vertex:s1,normalmap_pars_fragment:r1,clearcoat_normal_fragment_begin:o1,clearcoat_normal_fragment_maps:l1,clearcoat_pars_fragment:c1,iridescence_pars_fragment:u1,opaque_fragment:f1,packing:h1,premultiplied_alpha_fragment:d1,project_vertex:p1,dithering_fragment:m1,dithering_pars_fragment:g1,roughnessmap_fragment:_1,roughnessmap_pars_fragment:v1,shadowmap_pars_fragment:x1,shadowmap_pars_vertex:S1,shadowmap_vertex:y1,shadowmask_pars_fragment:M1,skinbase_vertex:b1,skinning_pars_vertex:E1,skinning_vertex:T1,skinnormal_vertex:A1,specularmap_fragment:R1,specularmap_pars_fragment:C1,tonemapping_fragment:w1,tonemapping_pars_fragment:D1,transmission_fragment:U1,transmission_pars_fragment:N1,uv_pars_fragment:L1,uv_pars_vertex:O1,uv_vertex:P1,worldpos_vertex:I1,background_vert:F1,background_frag:B1,backgroundCube_vert:z1,backgroundCube_frag:H1,cube_vert:G1,cube_frag:V1,depth_vert:k1,depth_frag:X1,distance_vert:j1,distance_frag:W1,equirect_vert:q1,equirect_frag:Y1,linedashed_vert:Z1,linedashed_frag:K1,meshbasic_vert:Q1,meshbasic_frag:J1,meshlambert_vert:$1,meshlambert_frag:eT,meshmatcap_vert:tT,meshmatcap_frag:nT,meshnormal_vert:iT,meshnormal_frag:aT,meshphong_vert:sT,meshphong_frag:rT,meshphysical_vert:oT,meshphysical_frag:lT,meshtoon_vert:cT,meshtoon_frag:uT,points_vert:fT,points_frag:hT,shadow_vert:dT,shadow_frag:pT,sprite_vert:mT,sprite_frag:gT},Ge={common:{diffuse:{value:new dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new rt},alphaMap:{value:null},alphaMapTransform:{value:new rt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new rt}},envmap:{envMap:{value:null},envMapRotation:{value:new rt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new rt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new rt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new rt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new rt},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new rt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new rt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new rt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new rt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new $},probesMax:{value:new $},probesResolution:{value:new $}},points:{diffuse:{value:new dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new rt},alphaTest:{value:0},uvTransform:{value:new rt}},sprite:{diffuse:{value:new dt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new rt},alphaMap:{value:null},alphaMapTransform:{value:new rt},alphaTest:{value:0}}},Wi={basic:{uniforms:Gn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.fog]),vertexShader:ht.meshbasic_vert,fragmentShader:ht.meshbasic_frag},lambert:{uniforms:Gn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new dt(0)},envMapIntensity:{value:1}}]),vertexShader:ht.meshlambert_vert,fragmentShader:ht.meshlambert_frag},phong:{uniforms:Gn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new dt(0)},specular:{value:new dt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ht.meshphong_vert,fragmentShader:ht.meshphong_frag},standard:{uniforms:Gn([Ge.common,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.roughnessmap,Ge.metalnessmap,Ge.fog,Ge.lights,{emissive:{value:new dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ht.meshphysical_vert,fragmentShader:ht.meshphysical_frag},toon:{uniforms:Gn([Ge.common,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.gradientmap,Ge.fog,Ge.lights,{emissive:{value:new dt(0)}}]),vertexShader:ht.meshtoon_vert,fragmentShader:ht.meshtoon_frag},matcap:{uniforms:Gn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,{matcap:{value:null}}]),vertexShader:ht.meshmatcap_vert,fragmentShader:ht.meshmatcap_frag},points:{uniforms:Gn([Ge.points,Ge.fog]),vertexShader:ht.points_vert,fragmentShader:ht.points_frag},dashed:{uniforms:Gn([Ge.common,Ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ht.linedashed_vert,fragmentShader:ht.linedashed_frag},depth:{uniforms:Gn([Ge.common,Ge.displacementmap]),vertexShader:ht.depth_vert,fragmentShader:ht.depth_frag},normal:{uniforms:Gn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,{opacity:{value:1}}]),vertexShader:ht.meshnormal_vert,fragmentShader:ht.meshnormal_frag},sprite:{uniforms:Gn([Ge.sprite,Ge.fog]),vertexShader:ht.sprite_vert,fragmentShader:ht.sprite_frag},background:{uniforms:{uvTransform:{value:new rt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ht.background_vert,fragmentShader:ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new rt}},vertexShader:ht.backgroundCube_vert,fragmentShader:ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ht.cube_vert,fragmentShader:ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ht.equirect_vert,fragmentShader:ht.equirect_frag},distance:{uniforms:Gn([Ge.common,Ge.displacementmap,{referencePosition:{value:new $},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ht.distance_vert,fragmentShader:ht.distance_frag},shadow:{uniforms:Gn([Ge.lights,Ge.fog,{color:{value:new dt(0)},opacity:{value:1}}]),vertexShader:ht.shadow_vert,fragmentShader:ht.shadow_frag}};Wi.physical={uniforms:Gn([Wi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new rt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new rt},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new rt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new rt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new rt},sheen:{value:0},sheenColor:{value:new dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new rt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new rt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new rt},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new rt},attenuationDistance:{value:0},attenuationColor:{value:new dt(0)},specularColor:{value:new dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new rt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new rt},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new rt}}]),vertexShader:ht.meshphysical_vert,fragmentShader:ht.meshphysical_frag};const Qc={r:0,b:0,g:0},_T=new on,vx=new rt;vx.set(-1,0,0,0,1,0,0,0,1);function vT(s,e,i,r,l,c){const h=new dt(0);let p=l===!0?0:1,m,d,_=null,v=0,g=null;function M(w){let L=w.isScene===!0?w.background:null;if(L&&L.isTexture){const I=w.backgroundBlurriness>0;L=e.get(L,I)}return L}function E(w){let L=!1;const I=M(w);I===null?y(h,p):I&&I.isColor&&(y(I,1),L=!0);const V=s.xr.getEnvironmentBlendMode();V==="additive"?i.buffers.color.setClear(0,0,0,1,c):V==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,c),(s.autoClear||L)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function C(w,L){const I=M(L);I&&(I.isCubeTexture||I.mapping===Su)?(d===void 0&&(d=new Fi(new pl(1,1,1),new Ji({name:"BackgroundCubeMaterial",uniforms:Jr(Wi.backgroundCube.uniforms),vertexShader:Wi.backgroundCube.vertexShader,fragmentShader:Wi.backgroundCube.fragmentShader,side:$n,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(V,N,O){this.matrixWorld.copyPosition(O.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),d.material.uniforms.envMap.value=I,d.material.uniforms.backgroundBlurriness.value=L.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(_T.makeRotationFromEuler(L.backgroundRotation)).transpose(),I.isCubeTexture&&I.isRenderTargetTexture===!1&&d.material.uniforms.backgroundRotation.value.premultiply(vx),d.material.toneMapped=Tt.getTransfer(I.colorSpace)!==zt,(_!==I||v!==I.version||g!==s.toneMapping)&&(d.material.needsUpdate=!0,_=I,v=I.version,g=s.toneMapping),d.layers.enableAll(),w.unshift(d,d.geometry,d.material,0,0,null)):I&&I.isTexture&&(m===void 0&&(m=new Fi(new ml(2,2),new Ji({name:"BackgroundMaterial",uniforms:Jr(Wi.background.uniforms),vertexShader:Wi.background.vertexShader,fragmentShader:Wi.background.fragmentShader,side:ps,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(m)),m.material.uniforms.t2D.value=I,m.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,m.material.toneMapped=Tt.getTransfer(I.colorSpace)!==zt,I.matrixAutoUpdate===!0&&I.updateMatrix(),m.material.uniforms.uvTransform.value.copy(I.matrix),(_!==I||v!==I.version||g!==s.toneMapping)&&(m.material.needsUpdate=!0,_=I,v=I.version,g=s.toneMapping),m.layers.enableAll(),w.unshift(m,m.geometry,m.material,0,0,null))}function y(w,L){w.getRGB(Qc,px(s)),i.buffers.color.setClear(Qc.r,Qc.g,Qc.b,L,c)}function S(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),m!==void 0&&(m.geometry.dispose(),m.material.dispose(),m=void 0)}return{getClearColor:function(){return h},setClearColor:function(w,L=1){h.set(w),p=L,y(h,p)},getClearAlpha:function(){return p},setClearAlpha:function(w){p=w,y(h,p)},render:E,addToRenderList:C,dispose:S}}function xT(s,e){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r={},l=g(null);let c=l,h=!1;function p(z,Q,ee,he,j){let P=!1;const H=v(z,he,ee,Q);c!==H&&(c=H,d(c.object)),P=M(z,he,ee,j),P&&E(z,he,ee,j),j!==null&&e.update(j,s.ELEMENT_ARRAY_BUFFER),(P||h)&&(h=!1,I(z,Q,ee,he),j!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function m(){return s.createVertexArray()}function d(z){return s.bindVertexArray(z)}function _(z){return s.deleteVertexArray(z)}function v(z,Q,ee,he){const j=he.wireframe===!0;let P=r[Q.id];P===void 0&&(P={},r[Q.id]=P);const H=z.isInstancedMesh===!0?z.id:0;let ne=P[H];ne===void 0&&(ne={},P[H]=ne);let pe=ne[ee.id];pe===void 0&&(pe={},ne[ee.id]=pe);let ye=pe[j];return ye===void 0&&(ye=g(m()),pe[j]=ye),ye}function g(z){const Q=[],ee=[],he=[];for(let j=0;j<i;j++)Q[j]=0,ee[j]=0,he[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:Q,enabledAttributes:ee,attributeDivisors:he,object:z,attributes:{},index:null}}function M(z,Q,ee,he){const j=c.attributes,P=Q.attributes;let H=0;const ne=ee.getAttributes();for(const pe in ne)if(ne[pe].location>=0){const F=j[pe];let q=P[pe];if(q===void 0&&(pe==="instanceMatrix"&&z.instanceMatrix&&(q=z.instanceMatrix),pe==="instanceColor"&&z.instanceColor&&(q=z.instanceColor)),F===void 0||F.attribute!==q||q&&F.data!==q.data)return!0;H++}return c.attributesNum!==H||c.index!==he}function E(z,Q,ee,he){const j={},P=Q.attributes;let H=0;const ne=ee.getAttributes();for(const pe in ne)if(ne[pe].location>=0){let F=P[pe];F===void 0&&(pe==="instanceMatrix"&&z.instanceMatrix&&(F=z.instanceMatrix),pe==="instanceColor"&&z.instanceColor&&(F=z.instanceColor));const q={};q.attribute=F,F&&F.data&&(q.data=F.data),j[pe]=q,H++}c.attributes=j,c.attributesNum=H,c.index=he}function C(){const z=c.newAttributes;for(let Q=0,ee=z.length;Q<ee;Q++)z[Q]=0}function y(z){S(z,0)}function S(z,Q){const ee=c.newAttributes,he=c.enabledAttributes,j=c.attributeDivisors;ee[z]=1,he[z]===0&&(s.enableVertexAttribArray(z),he[z]=1),j[z]!==Q&&(s.vertexAttribDivisor(z,Q),j[z]=Q)}function w(){const z=c.newAttributes,Q=c.enabledAttributes;for(let ee=0,he=Q.length;ee<he;ee++)Q[ee]!==z[ee]&&(s.disableVertexAttribArray(ee),Q[ee]=0)}function L(z,Q,ee,he,j,P,H){H===!0?s.vertexAttribIPointer(z,Q,ee,j,P):s.vertexAttribPointer(z,Q,ee,he,j,P)}function I(z,Q,ee,he){C();const j=he.attributes,P=ee.getAttributes(),H=Q.defaultAttributeValues;for(const ne in P){const pe=P[ne];if(pe.location>=0){let ye=j[ne];if(ye===void 0&&(ne==="instanceMatrix"&&z.instanceMatrix&&(ye=z.instanceMatrix),ne==="instanceColor"&&z.instanceColor&&(ye=z.instanceColor)),ye!==void 0){const F=ye.normalized,q=ye.itemSize,Se=e.get(ye);if(Se===void 0)continue;const Ae=Se.buffer,Ce=Se.type,se=Se.bytesPerElement,Me=Ce===s.INT||Ce===s.UNSIGNED_INT||ye.gpuType===vp;if(ye.isInterleavedBufferAttribute){const be=ye.data,K=be.stride,we=ye.offset;if(be.isInstancedInterleavedBuffer){for(let Ze=0;Ze<pe.locationSize;Ze++)S(pe.location+Ze,be.meshPerAttribute);z.isInstancedMesh!==!0&&he._maxInstanceCount===void 0&&(he._maxInstanceCount=be.meshPerAttribute*be.count)}else for(let Ze=0;Ze<pe.locationSize;Ze++)y(pe.location+Ze);s.bindBuffer(s.ARRAY_BUFFER,Ae);for(let Ze=0;Ze<pe.locationSize;Ze++)L(pe.location+Ze,q/pe.locationSize,Ce,F,K*se,(we+q/pe.locationSize*Ze)*se,Me)}else{if(ye.isInstancedBufferAttribute){for(let be=0;be<pe.locationSize;be++)S(pe.location+be,ye.meshPerAttribute);z.isInstancedMesh!==!0&&he._maxInstanceCount===void 0&&(he._maxInstanceCount=ye.meshPerAttribute*ye.count)}else for(let be=0;be<pe.locationSize;be++)y(pe.location+be);s.bindBuffer(s.ARRAY_BUFFER,Ae);for(let be=0;be<pe.locationSize;be++)L(pe.location+be,q/pe.locationSize,Ce,F,q*se,q/pe.locationSize*be*se,Me)}}else if(H!==void 0){const F=H[ne];if(F!==void 0)switch(F.length){case 2:s.vertexAttrib2fv(pe.location,F);break;case 3:s.vertexAttrib3fv(pe.location,F);break;case 4:s.vertexAttrib4fv(pe.location,F);break;default:s.vertexAttrib1fv(pe.location,F)}}}}w()}function V(){B();for(const z in r){const Q=r[z];for(const ee in Q){const he=Q[ee];for(const j in he){const P=he[j];for(const H in P)_(P[H].object),delete P[H];delete he[j]}}delete r[z]}}function N(z){if(r[z.id]===void 0)return;const Q=r[z.id];for(const ee in Q){const he=Q[ee];for(const j in he){const P=he[j];for(const H in P)_(P[H].object),delete P[H];delete he[j]}}delete r[z.id]}function O(z){for(const Q in r){const ee=r[Q];for(const he in ee){const j=ee[he];if(j[z.id]===void 0)continue;const P=j[z.id];for(const H in P)_(P[H].object),delete P[H];delete j[z.id]}}}function T(z){for(const Q in r){const ee=r[Q],he=z.isInstancedMesh===!0?z.id:0,j=ee[he];if(j!==void 0){for(const P in j){const H=j[P];for(const ne in H)_(H[ne].object),delete H[ne];delete j[P]}delete ee[he],Object.keys(ee).length===0&&delete r[Q]}}}function B(){Z(),h=!0,c!==l&&(c=l,d(c.object))}function Z(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:p,reset:B,resetDefaultState:Z,dispose:V,releaseStatesOfGeometry:N,releaseStatesOfObject:T,releaseStatesOfProgram:O,initAttributes:C,enableAttribute:y,disableUnusedAttributes:w}}function ST(s,e,i){let r;function l(m){r=m}function c(m,d){s.drawArrays(r,m,d),i.update(d,r,1)}function h(m,d,_){_!==0&&(s.drawArraysInstanced(r,m,d,_),i.update(d,r,_))}function p(m,d,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,m,0,d,0,_);let g=0;for(let M=0;M<_;M++)g+=d[M];i.update(g,r,1)}this.setMode=l,this.render=c,this.renderInstances=h,this.renderMultiDraw=p}function yT(s,e,i,r){let l;function c(){if(l!==void 0)return l;if(e.has("EXT_texture_filter_anisotropic")===!0){const O=e.get("EXT_texture_filter_anisotropic");l=s.getParameter(O.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function h(O){return!(O!==Ii&&r.convert(O)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function p(O){const T=O===Ra&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(O!==di&&r.convert(O)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&O!==qi&&!T)}function m(O){if(O==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";O="mediump"}return O==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=i.precision!==void 0?i.precision:"highp";const _=m(d);_!==d&&(tt("WebGLRenderer:",d,"not supported, using",_,"instead."),d=_);const v=i.logarithmicDepthBuffer===!0,g=i.reversedDepthBuffer===!0&&e.has("EXT_clip_control");i.reversedDepthBuffer===!0&&g===!1&&tt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const M=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),E=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),C=s.getParameter(s.MAX_TEXTURE_SIZE),y=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),S=s.getParameter(s.MAX_VERTEX_ATTRIBS),w=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),L=s.getParameter(s.MAX_VARYING_VECTORS),I=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),V=s.getParameter(s.MAX_SAMPLES),N=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:m,textureFormatReadable:h,textureTypeReadable:p,precision:d,logarithmicDepthBuffer:v,reversedDepthBuffer:g,maxTextures:M,maxVertexTextures:E,maxTextureSize:C,maxCubemapSize:y,maxAttributes:S,maxVertexUniforms:w,maxVaryings:L,maxFragmentUniforms:I,maxSamples:V,samples:N}}function MT(s){const e=this;let i=null,r=0,l=!1,c=!1;const h=new us,p=new rt,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(v,g){const M=v.length!==0||g||r!==0||l;return l=g,r=v.length,M},this.beginShadows=function(){c=!0,_(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(v,g){i=_(v,g,0)},this.setState=function(v,g,M){const E=v.clippingPlanes,C=v.clipIntersection,y=v.clipShadows,S=s.get(v);if(!l||E===null||E.length===0||c&&!y)c?_(null):d();else{const w=c?0:r,L=w*4;let I=S.clippingState||null;m.value=I,I=_(E,g,L,M);for(let V=0;V!==L;++V)I[V]=i[V];S.clippingState=I,this.numIntersection=C?this.numPlanes:0,this.numPlanes+=w}};function d(){m.value!==i&&(m.value=i,m.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function _(v,g,M,E){const C=v!==null?v.length:0;let y=null;if(C!==0){if(y=m.value,E!==!0||y===null){const S=M+C*4,w=g.matrixWorldInverse;p.getNormalMatrix(w),(y===null||y.length<S)&&(y=new Float32Array(S));for(let L=0,I=M;L!==C;++L,I+=4)h.copy(v[L]).applyMatrix4(w,p),h.normal.toArray(y,I),y[I+3]=h.constant}m.value=y,m.needsUpdate=!0}return e.numPlanes=C,e.numIntersection=0,y}}const hs=4,uv=[.125,.215,.35,.446,.526,.582],Vs=20,bT=256,nl=new Up,fv=new dt;let ud=null,fd=0,hd=0,dd=!1;const ET=new $;class hv{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,i=0,r=.1,l=100,c={}){const{size:h=256,position:p=ET}=c;ud=this._renderer.getRenderTarget(),fd=this._renderer.getActiveCubeFace(),hd=this._renderer.getActiveMipmapLevel(),dd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(h);const m=this._allocateTargets();return m.depthBuffer=!0,this._sceneToCubeUV(e,r,l,m,p),i>0&&this._blur(m,0,0,i),this._applyPMREM(m),this._cleanup(m),m}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mv(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pv(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ud,fd,hd),this._renderer.xr.enabled=dd,e.scissorTest=!1,Vr(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===qs||e.mapping===Kr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ud=this._renderer.getRenderTarget(),fd=this._renderer.getActiveCubeFace(),hd=this._renderer.getActiveMipmapLevel(),dd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=i||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,r={magFilter:zn,minFilter:zn,generateMipmaps:!1,type:Ra,format:Ii,colorSpace:fu,depthBuffer:!1},l=dv(e,i,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=dv(e,i,r);const{_lodMax:c}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=TT(c)),this._blurMaterial=RT(c,e,i),this._ggxMaterial=AT(c,e,i)}return l}_compileMaterial(e){const i=new Fi(new mi,e);this._renderer.compile(i,nl)}_sceneToCubeUV(e,i,r,l,c){const m=new Ai(90,1,i,r),d=[1,-1,1,1,1,1],_=[1,1,1,-1,-1,-1],v=this._renderer,g=v.autoClear,M=v.toneMapping;v.getClearColor(fv),v.toneMapping=Zi,v.autoClear=!1,v.state.buffers.depth.getReversed()&&(v.setRenderTarget(l),v.clearDepth(),v.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Fi(new pl,new ux({name:"PMREM.Background",side:$n,depthWrite:!1,depthTest:!1})));const C=this._backgroundBox,y=C.material;let S=!1;const w=e.background;w?w.isColor&&(y.color.copy(w),e.background=null,S=!0):(y.color.copy(fv),S=!0);for(let L=0;L<6;L++){const I=L%3;I===0?(m.up.set(0,d[L],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x+_[L],c.y,c.z)):I===1?(m.up.set(0,0,d[L]),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y+_[L],c.z)):(m.up.set(0,d[L],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y,c.z+_[L]));const V=this._cubeSize;Vr(l,I*V,L>2?V:0,V,V),v.setRenderTarget(l),S&&v.render(C,m),v.render(e,m)}v.toneMapping=M,v.autoClear=g,e.background=w}_textureToCubeUV(e,i){const r=this._renderer,l=e.mapping===qs||e.mapping===Kr;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=mv()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pv());const c=l?this._cubemapMaterial:this._equirectMaterial,h=this._lodMeshes[0];h.material=c;const p=c.uniforms;p.envMap.value=e;const m=this._cubeSize;Vr(i,0,0,3*m,2*m),r.setRenderTarget(i),r.render(h,nl)}_applyPMREM(e){const i=this._renderer,r=i.autoClear;i.autoClear=!1;const l=this._lodMeshes.length;for(let c=1;c<l;c++)this._applyGGXFilter(e,c-1,c);i.autoClear=r}_applyGGXFilter(e,i,r){const l=this._renderer,c=this._pingPongRenderTarget,h=this._ggxMaterial,p=this._lodMeshes[r];p.material=h;const m=h.uniforms,d=r/(this._lodMeshes.length-1),_=i/(this._lodMeshes.length-1),v=Math.sqrt(d*d-_*_),g=0+d*1.25,M=v*g,{_lodMax:E}=this,C=this._sizeLods[r],y=3*C*(r>E-hs?r-E+hs:0),S=4*(this._cubeSize-C);m.envMap.value=e.texture,m.roughness.value=M,m.mipInt.value=E-i,Vr(c,y,S,3*C,2*C),l.setRenderTarget(c),l.render(p,nl),m.envMap.value=c.texture,m.roughness.value=0,m.mipInt.value=E-r,Vr(e,y,S,3*C,2*C),l.setRenderTarget(e),l.render(p,nl)}_blur(e,i,r,l,c){const h=this._pingPongRenderTarget;this._halfBlur(e,h,i,r,l,"latitudinal",c),this._halfBlur(h,e,r,r,l,"longitudinal",c)}_halfBlur(e,i,r,l,c,h,p){const m=this._renderer,d=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&At("blur direction must be either latitudinal or longitudinal!");const _=3,v=this._lodMeshes[l];v.material=d;const g=d.uniforms,M=this._sizeLods[r]-1,E=isFinite(c)?Math.PI/(2*M):2*Math.PI/(2*Vs-1),C=c/E,y=isFinite(c)?1+Math.floor(_*C):Vs;y>Vs&&tt(`sigmaRadians, ${c}, is too large and will clip, as it requested ${y} samples when the maximum is set to ${Vs}`);const S=[];let w=0;for(let O=0;O<Vs;++O){const T=O/C,B=Math.exp(-T*T/2);S.push(B),O===0?w+=B:O<y&&(w+=2*B)}for(let O=0;O<S.length;O++)S[O]=S[O]/w;g.envMap.value=e.texture,g.samples.value=y,g.weights.value=S,g.latitudinal.value=h==="latitudinal",p&&(g.poleAxis.value=p);const{_lodMax:L}=this;g.dTheta.value=E,g.mipInt.value=L-r;const I=this._sizeLods[l],V=3*I*(l>L-hs?l-L+hs:0),N=4*(this._cubeSize-I);Vr(i,V,N,3*I,2*I),m.setRenderTarget(i),m.render(v,nl)}}function TT(s){const e=[],i=[],r=[];let l=s;const c=s-hs+1+uv.length;for(let h=0;h<c;h++){const p=Math.pow(2,l);e.push(p);let m=1/p;h>s-hs?m=uv[h-s+hs-1]:h===0&&(m=0),i.push(m);const d=1/(p-2),_=-d,v=1+d,g=[_,_,v,_,v,v,_,_,v,v,_,v],M=6,E=6,C=3,y=2,S=1,w=new Float32Array(C*E*M),L=new Float32Array(y*E*M),I=new Float32Array(S*E*M);for(let N=0;N<M;N++){const O=N%3*2/3-1,T=N>2?0:-1,B=[O,T,0,O+2/3,T,0,O+2/3,T+1,0,O,T,0,O+2/3,T+1,0,O,T+1,0];w.set(B,C*E*N),L.set(g,y*E*N);const Z=[N,N,N,N,N,N];I.set(Z,S*E*N)}const V=new mi;V.setAttribute("position",new pi(w,C)),V.setAttribute("uv",new pi(L,y)),V.setAttribute("faceIndex",new pi(I,S)),r.push(new Fi(V,null)),l>hs&&l--}return{lodMeshes:r,sizeLods:e,sigmas:i}}function dv(s,e,i){const r=new Ki(s,e,i);return r.texture.mapping=Su,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Vr(s,e,i,r,l){s.viewport.set(e,i,r,l),s.scissor.set(e,i,r,l)}function AT(s,e,i){return new Ji({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:bT,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Mu(),fragmentShader:`

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
		`,blending:Ta,depthTest:!1,depthWrite:!1})}function RT(s,e,i){const r=new Float32Array(Vs),l=new $(0,1,0);return new Ji({name:"SphericalGaussianBlur",defines:{n:Vs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Mu(),fragmentShader:`

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
		`,blending:Ta,depthTest:!1,depthWrite:!1})}function pv(){return new Ji({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Mu(),fragmentShader:`

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
		`,blending:Ta,depthTest:!1,depthWrite:!1})}function mv(){return new Ji({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Mu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ta,depthTest:!1,depthWrite:!1})}function Mu(){return`

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
	`}class xx extends Ki{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},l=[r,r,r,r,r,r];this.texture=new hx(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},l=new pl(5,5,5),c=new Ji({name:"CubemapFromEquirect",uniforms:Jr(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:$n,blending:Ta});c.uniforms.tEquirect.value=i;const h=new Fi(l,c),p=i.minFilter;return i.minFilter===Xs&&(i.minFilter=zn),new Nb(1,10,this).update(e,h),i.minFilter=p,h.geometry.dispose(),h.material.dispose(),this}clear(e,i=!0,r=!0,l=!0){const c=e.getRenderTarget();for(let h=0;h<6;h++)e.setRenderTarget(this,h),e.clear(i,r,l);e.setRenderTarget(c)}}function CT(s){let e=new WeakMap,i=new WeakMap,r=null;function l(g,M=!1){return g==null?null:M?h(g):c(g)}function c(g){if(g&&g.isTexture){const M=g.mapping;if(M===Oh||M===Ph)if(e.has(g)){const E=e.get(g).texture;return p(E,g.mapping)}else{const E=g.image;if(E&&E.height>0){const C=new xx(E.height);return C.fromEquirectangularTexture(s,g),e.set(g,C),g.addEventListener("dispose",d),p(C.texture,g.mapping)}else return null}}return g}function h(g){if(g&&g.isTexture){const M=g.mapping,E=M===Oh||M===Ph,C=M===qs||M===Kr;if(E||C){let y=i.get(g);const S=y!==void 0?y.texture.pmremVersion:0;if(g.isRenderTargetTexture&&g.pmremVersion!==S)return r===null&&(r=new hv(s)),y=E?r.fromEquirectangular(g,y):r.fromCubemap(g,y),y.texture.pmremVersion=g.pmremVersion,i.set(g,y),y.texture;if(y!==void 0)return y.texture;{const w=g.image;return E&&w&&w.height>0||C&&w&&m(w)?(r===null&&(r=new hv(s)),y=E?r.fromEquirectangular(g):r.fromCubemap(g),y.texture.pmremVersion=g.pmremVersion,i.set(g,y),g.addEventListener("dispose",_),y.texture):null}}}return g}function p(g,M){return M===Oh?g.mapping=qs:M===Ph&&(g.mapping=Kr),g}function m(g){let M=0;const E=6;for(let C=0;C<E;C++)g[C]!==void 0&&M++;return M===E}function d(g){const M=g.target;M.removeEventListener("dispose",d);const E=e.get(M);E!==void 0&&(e.delete(M),E.dispose())}function _(g){const M=g.target;M.removeEventListener("dispose",_);const E=i.get(M);E!==void 0&&(i.delete(M),E.dispose())}function v(){e=new WeakMap,i=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:l,dispose:v}}function wT(s){const e={};function i(r){if(e[r]!==void 0)return e[r];const l=s.getExtension(r);return e[r]=l,l}return{has:function(r){return i(r)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(r){const l=i(r);return l===null&&lp("WebGLRenderer: "+r+" extension not supported."),l}}}function DT(s,e,i,r){const l={},c=new WeakMap;function h(v){const g=v.target;g.index!==null&&e.remove(g.index);for(const E in g.attributes)e.remove(g.attributes[E]);g.removeEventListener("dispose",h),delete l[g.id];const M=c.get(g);M&&(e.remove(M),c.delete(g)),r.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,i.memory.geometries--}function p(v,g){return l[g.id]===!0||(g.addEventListener("dispose",h),l[g.id]=!0,i.memory.geometries++),g}function m(v){const g=v.attributes;for(const M in g)e.update(g[M],s.ARRAY_BUFFER)}function d(v){const g=[],M=v.index,E=v.attributes.position;let C=0;if(E===void 0)return;if(M!==null){const w=M.array;C=M.version;for(let L=0,I=w.length;L<I;L+=3){const V=w[L+0],N=w[L+1],O=w[L+2];g.push(V,N,N,O,O,V)}}else{const w=E.array;C=E.version;for(let L=0,I=w.length/3-1;L<I;L+=3){const V=L+0,N=L+1,O=L+2;g.push(V,N,N,O,O,V)}}const y=new(E.count>=65535?cx:lx)(g,1);y.version=C;const S=c.get(v);S&&e.remove(S),c.set(v,y)}function _(v){const g=c.get(v);if(g){const M=v.index;M!==null&&g.version<M.version&&d(v)}else d(v);return c.get(v)}return{get:p,update:m,getWireframeAttribute:_}}function UT(s,e,i){let r;function l(v){r=v}let c,h;function p(v){c=v.type,h=v.bytesPerElement}function m(v,g){s.drawElements(r,g,c,v*h),i.update(g,r,1)}function d(v,g,M){M!==0&&(s.drawElementsInstanced(r,g,c,v*h,M),i.update(g,r,M))}function _(v,g,M){if(M===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,g,0,c,v,0,M);let C=0;for(let y=0;y<M;y++)C+=g[y];i.update(C,r,1)}this.setMode=l,this.setIndex=p,this.render=m,this.renderInstances=d,this.renderMultiDraw=_}function NT(s){const e={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function r(c,h,p){switch(i.calls++,h){case s.TRIANGLES:i.triangles+=p*(c/3);break;case s.LINES:i.lines+=p*(c/2);break;case s.LINE_STRIP:i.lines+=p*(c-1);break;case s.LINE_LOOP:i.lines+=p*c;break;case s.POINTS:i.points+=p*c;break;default:At("WebGLInfo: Unknown draw mode:",h);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:e,render:i,programs:null,autoReset:!0,reset:l,update:r}}function LT(s,e,i){const r=new WeakMap,l=new rn;function c(h,p,m){const d=h.morphTargetInfluences,_=p.morphAttributes.position||p.morphAttributes.normal||p.morphAttributes.color,v=_!==void 0?_.length:0;let g=r.get(p);if(g===void 0||g.count!==v){let Z=function(){T.dispose(),r.delete(p),p.removeEventListener("dispose",Z)};var M=Z;g!==void 0&&g.texture.dispose();const E=p.morphAttributes.position!==void 0,C=p.morphAttributes.normal!==void 0,y=p.morphAttributes.color!==void 0,S=p.morphAttributes.position||[],w=p.morphAttributes.normal||[],L=p.morphAttributes.color||[];let I=0;E===!0&&(I=1),C===!0&&(I=2),y===!0&&(I=3);let V=p.attributes.position.count*I,N=1;V>e.maxTextureSize&&(N=Math.ceil(V/e.maxTextureSize),V=e.maxTextureSize);const O=new Float32Array(V*N*4*v),T=new sx(O,V,N,v);T.type=qi,T.needsUpdate=!0;const B=I*4;for(let z=0;z<v;z++){const Q=S[z],ee=w[z],he=L[z],j=V*N*4*z;for(let P=0;P<Q.count;P++){const H=P*B;E===!0&&(l.fromBufferAttribute(Q,P),O[j+H+0]=l.x,O[j+H+1]=l.y,O[j+H+2]=l.z,O[j+H+3]=0),C===!0&&(l.fromBufferAttribute(ee,P),O[j+H+4]=l.x,O[j+H+5]=l.y,O[j+H+6]=l.z,O[j+H+7]=0),y===!0&&(l.fromBufferAttribute(he,P),O[j+H+8]=l.x,O[j+H+9]=l.y,O[j+H+10]=l.z,O[j+H+11]=he.itemSize===4?l.w:1)}}g={count:v,texture:T,size:new ot(V,N)},r.set(p,g),p.addEventListener("dispose",Z)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)m.getUniforms().setValue(s,"morphTexture",h.morphTexture,i);else{let E=0;for(let y=0;y<d.length;y++)E+=d[y];const C=p.morphTargetsRelative?1:1-E;m.getUniforms().setValue(s,"morphTargetBaseInfluence",C),m.getUniforms().setValue(s,"morphTargetInfluences",d)}m.getUniforms().setValue(s,"morphTargetsTexture",g.texture,i),m.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}return{update:c}}function OT(s,e,i,r,l){let c=new WeakMap;function h(d){const _=l.render.frame,v=d.geometry,g=e.get(d,v);if(c.get(g)!==_&&(e.update(g),c.set(g,_)),d.isInstancedMesh&&(d.hasEventListener("dispose",m)===!1&&d.addEventListener("dispose",m),c.get(d)!==_&&(i.update(d.instanceMatrix,s.ARRAY_BUFFER),d.instanceColor!==null&&i.update(d.instanceColor,s.ARRAY_BUFFER),c.set(d,_))),d.isSkinnedMesh){const M=d.skeleton;c.get(M)!==_&&(M.update(),c.set(M,_))}return g}function p(){c=new WeakMap}function m(d){const _=d.target;_.removeEventListener("dispose",m),r.releaseStatesOfObject(_),i.remove(_.instanceMatrix),_.instanceColor!==null&&i.remove(_.instanceColor)}return{update:h,dispose:p}}const PT={[Xv]:"LINEAR_TONE_MAPPING",[jv]:"REINHARD_TONE_MAPPING",[Wv]:"CINEON_TONE_MAPPING",[_p]:"ACES_FILMIC_TONE_MAPPING",[Yv]:"AGX_TONE_MAPPING",[Zv]:"NEUTRAL_TONE_MAPPING",[qv]:"CUSTOM_TONE_MAPPING"};function IT(s,e,i,r,l){const c=new Ki(e,i,{type:s,depthBuffer:r,stencilBuffer:l,depthTexture:r?new Qr(e,i):void 0}),h=new Ki(e,i,{type:Ra,depthBuffer:!1,stencilBuffer:!1}),p=new mi;p.setAttribute("position",new ei([-1,3,0,-1,-1,0,3,-1,0],3)),p.setAttribute("uv",new ei([0,2,0,0,2,0],2));const m=new Sb({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Fi(p,m),_=new Up(-1,1,1,-1,0,1);let v=null,g=null,M=!1,E,C=null,y=[],S=!1;this.setSize=function(w,L){c.setSize(w,L),h.setSize(w,L);for(let I=0;I<y.length;I++){const V=y[I];V.setSize&&V.setSize(w,L)}},this.setEffects=function(w){y=w,S=y.length>0&&y[0].isRenderPass===!0;const L=c.width,I=c.height;for(let V=0;V<y.length;V++){const N=y[V];N.setSize&&N.setSize(L,I)}},this.begin=function(w,L){if(M||w.toneMapping===Zi&&y.length===0)return!1;if(C=L,L!==null){const I=L.width,V=L.height;(c.width!==I||c.height!==V)&&this.setSize(I,V)}return S===!1&&w.setRenderTarget(c),E=w.toneMapping,w.toneMapping=Zi,!0},this.hasRenderPass=function(){return S},this.end=function(w,L){w.toneMapping=E,M=!0;let I=c,V=h;for(let N=0;N<y.length;N++){const O=y[N];if(O.enabled!==!1&&(O.render(w,V,I,L),O.needsSwap!==!1)){const T=I;I=V,V=T}}if(v!==w.outputColorSpace||g!==w.toneMapping){v=w.outputColorSpace,g=w.toneMapping,m.defines={},Tt.getTransfer(v)===zt&&(m.defines.SRGB_TRANSFER="");const N=PT[g];N&&(m.defines[N]=""),m.needsUpdate=!0}m.uniforms.tDiffuse.value=I.texture,w.setRenderTarget(C),w.render(d,_),C=null,M=!1},this.isCompositing=function(){return M},this.dispose=function(){c.depthTexture&&c.depthTexture.dispose(),c.dispose(),h.dispose(),p.dispose(),m.dispose()}}const Sx=new kn,up=new Qr(1,1),yx=new sx,Mx=new qM,bx=new hx,gv=[],_v=[],vv=new Float32Array(16),xv=new Float32Array(9),Sv=new Float32Array(4);function eo(s,e,i){const r=s[0];if(r<=0||r>0)return s;const l=e*i;let c=gv[l];if(c===void 0&&(c=new Float32Array(l),gv[l]=c),e!==0){r.toArray(c,0);for(let h=1,p=0;h!==e;++h)p+=i,s[h].toArray(c,p)}return c}function yn(s,e){if(s.length!==e.length)return!1;for(let i=0,r=s.length;i<r;i++)if(s[i]!==e[i])return!1;return!0}function Mn(s,e){for(let i=0,r=e.length;i<r;i++)s[i]=e[i]}function bu(s,e){let i=_v[e];i===void 0&&(i=new Int32Array(e),_v[e]=i);for(let r=0;r!==e;++r)i[r]=s.allocateTextureUnit();return i}function FT(s,e){const i=this.cache;i[0]!==e&&(s.uniform1f(this.addr,e),i[0]=e)}function BT(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(yn(i,e))return;s.uniform2fv(this.addr,e),Mn(i,e)}}function zT(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else if(e.r!==void 0)(i[0]!==e.r||i[1]!==e.g||i[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),i[0]=e.r,i[1]=e.g,i[2]=e.b);else{if(yn(i,e))return;s.uniform3fv(this.addr,e),Mn(i,e)}}function HT(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(yn(i,e))return;s.uniform4fv(this.addr,e),Mn(i,e)}}function GT(s,e){const i=this.cache,r=e.elements;if(r===void 0){if(yn(i,e))return;s.uniformMatrix2fv(this.addr,!1,e),Mn(i,e)}else{if(yn(i,r))return;Sv.set(r),s.uniformMatrix2fv(this.addr,!1,Sv),Mn(i,r)}}function VT(s,e){const i=this.cache,r=e.elements;if(r===void 0){if(yn(i,e))return;s.uniformMatrix3fv(this.addr,!1,e),Mn(i,e)}else{if(yn(i,r))return;xv.set(r),s.uniformMatrix3fv(this.addr,!1,xv),Mn(i,r)}}function kT(s,e){const i=this.cache,r=e.elements;if(r===void 0){if(yn(i,e))return;s.uniformMatrix4fv(this.addr,!1,e),Mn(i,e)}else{if(yn(i,r))return;vv.set(r),s.uniformMatrix4fv(this.addr,!1,vv),Mn(i,r)}}function XT(s,e){const i=this.cache;i[0]!==e&&(s.uniform1i(this.addr,e),i[0]=e)}function jT(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(yn(i,e))return;s.uniform2iv(this.addr,e),Mn(i,e)}}function WT(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(yn(i,e))return;s.uniform3iv(this.addr,e),Mn(i,e)}}function qT(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(yn(i,e))return;s.uniform4iv(this.addr,e),Mn(i,e)}}function YT(s,e){const i=this.cache;i[0]!==e&&(s.uniform1ui(this.addr,e),i[0]=e)}function ZT(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(yn(i,e))return;s.uniform2uiv(this.addr,e),Mn(i,e)}}function KT(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(yn(i,e))return;s.uniform3uiv(this.addr,e),Mn(i,e)}}function QT(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(yn(i,e))return;s.uniform4uiv(this.addr,e),Mn(i,e)}}function JT(s,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(s.uniform1i(this.addr,l),r[0]=l);let c;this.type===s.SAMPLER_2D_SHADOW?(up.compareFunction=i.isReversedDepthBuffer()?Tp:Ep,c=up):c=Sx,i.setTexture2D(e||c,l)}function $T(s,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(s.uniform1i(this.addr,l),r[0]=l),i.setTexture3D(e||Mx,l)}function eA(s,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(s.uniform1i(this.addr,l),r[0]=l),i.setTextureCube(e||bx,l)}function tA(s,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(s.uniform1i(this.addr,l),r[0]=l),i.setTexture2DArray(e||yx,l)}function nA(s){switch(s){case 5126:return FT;case 35664:return BT;case 35665:return zT;case 35666:return HT;case 35674:return GT;case 35675:return VT;case 35676:return kT;case 5124:case 35670:return XT;case 35667:case 35671:return jT;case 35668:case 35672:return WT;case 35669:case 35673:return qT;case 5125:return YT;case 36294:return ZT;case 36295:return KT;case 36296:return QT;case 35678:case 36198:case 36298:case 36306:case 35682:return JT;case 35679:case 36299:case 36307:return $T;case 35680:case 36300:case 36308:case 36293:return eA;case 36289:case 36303:case 36311:case 36292:return tA}}function iA(s,e){s.uniform1fv(this.addr,e)}function aA(s,e){const i=eo(e,this.size,2);s.uniform2fv(this.addr,i)}function sA(s,e){const i=eo(e,this.size,3);s.uniform3fv(this.addr,i)}function rA(s,e){const i=eo(e,this.size,4);s.uniform4fv(this.addr,i)}function oA(s,e){const i=eo(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,i)}function lA(s,e){const i=eo(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,i)}function cA(s,e){const i=eo(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,i)}function uA(s,e){s.uniform1iv(this.addr,e)}function fA(s,e){s.uniform2iv(this.addr,e)}function hA(s,e){s.uniform3iv(this.addr,e)}function dA(s,e){s.uniform4iv(this.addr,e)}function pA(s,e){s.uniform1uiv(this.addr,e)}function mA(s,e){s.uniform2uiv(this.addr,e)}function gA(s,e){s.uniform3uiv(this.addr,e)}function _A(s,e){s.uniform4uiv(this.addr,e)}function vA(s,e,i){const r=this.cache,l=e.length,c=bu(i,l);yn(r,c)||(s.uniform1iv(this.addr,c),Mn(r,c));let h;this.type===s.SAMPLER_2D_SHADOW?h=up:h=Sx;for(let p=0;p!==l;++p)i.setTexture2D(e[p]||h,c[p])}function xA(s,e,i){const r=this.cache,l=e.length,c=bu(i,l);yn(r,c)||(s.uniform1iv(this.addr,c),Mn(r,c));for(let h=0;h!==l;++h)i.setTexture3D(e[h]||Mx,c[h])}function SA(s,e,i){const r=this.cache,l=e.length,c=bu(i,l);yn(r,c)||(s.uniform1iv(this.addr,c),Mn(r,c));for(let h=0;h!==l;++h)i.setTextureCube(e[h]||bx,c[h])}function yA(s,e,i){const r=this.cache,l=e.length,c=bu(i,l);yn(r,c)||(s.uniform1iv(this.addr,c),Mn(r,c));for(let h=0;h!==l;++h)i.setTexture2DArray(e[h]||yx,c[h])}function MA(s){switch(s){case 5126:return iA;case 35664:return aA;case 35665:return sA;case 35666:return rA;case 35674:return oA;case 35675:return lA;case 35676:return cA;case 5124:case 35670:return uA;case 35667:case 35671:return fA;case 35668:case 35672:return hA;case 35669:case 35673:return dA;case 5125:return pA;case 36294:return mA;case 36295:return gA;case 36296:return _A;case 35678:case 36198:case 36298:case 36306:case 35682:return vA;case 35679:case 36299:case 36307:return xA;case 35680:case 36300:case 36308:case 36293:return SA;case 36289:case 36303:case 36311:case 36292:return yA}}class bA{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.setValue=nA(i.type)}}class EA{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=MA(i.type)}}class TA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,r){const l=this.seq;for(let c=0,h=l.length;c!==h;++c){const p=l[c];p.setValue(e,i[p.id],r)}}}const pd=/(\w+)(\])?(\[|\.)?/g;function yv(s,e){s.seq.push(e),s.map[e.id]=e}function AA(s,e,i){const r=s.name,l=r.length;for(pd.lastIndex=0;;){const c=pd.exec(r),h=pd.lastIndex;let p=c[1];const m=c[2]==="]",d=c[3];if(m&&(p=p|0),d===void 0||d==="["&&h+2===l){yv(i,d===void 0?new bA(p,s,e):new EA(p,s,e));break}else{let v=i.map[p];v===void 0&&(v=new TA(p),yv(i,v)),i=v}}}class ou{constructor(e,i){this.seq=[],this.map={};const r=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let h=0;h<r;++h){const p=e.getActiveUniform(i,h),m=e.getUniformLocation(i,p.name);AA(p,m,this)}const l=[],c=[];for(const h of this.seq)h.type===e.SAMPLER_2D_SHADOW||h.type===e.SAMPLER_CUBE_SHADOW||h.type===e.SAMPLER_2D_ARRAY_SHADOW?l.push(h):c.push(h);l.length>0&&(this.seq=l.concat(c))}setValue(e,i,r,l){const c=this.map[i];c!==void 0&&c.setValue(e,r,l)}setOptional(e,i,r){const l=i[r];l!==void 0&&this.setValue(e,r,l)}static upload(e,i,r,l){for(let c=0,h=i.length;c!==h;++c){const p=i[c],m=r[p.id];m.needsUpdate!==!1&&p.setValue(e,m.value,l)}}static seqWithValue(e,i){const r=[];for(let l=0,c=e.length;l!==c;++l){const h=e[l];h.id in i&&r.push(h)}return r}}function Mv(s,e,i){const r=s.createShader(e);return s.shaderSource(r,i),s.compileShader(r),r}const RA=37297;let CA=0;function wA(s,e){const i=s.split(`
`),r=[],l=Math.max(e-6,0),c=Math.min(e+6,i.length);for(let h=l;h<c;h++){const p=h+1;r.push(`${p===e?">":" "} ${p}: ${i[h]}`)}return r.join(`
`)}const bv=new rt;function DA(s){Tt._getMatrix(bv,Tt.workingColorSpace,s);const e=`mat3( ${bv.elements.map(i=>i.toFixed(4))} )`;switch(Tt.getTransfer(s)){case hu:return[e,"LinearTransferOETF"];case zt:return[e,"sRGBTransferOETF"];default:return tt("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Ev(s,e,i){const r=s.getShaderParameter(e,s.COMPILE_STATUS),c=(s.getShaderInfoLog(e)||"").trim();if(r&&c==="")return"";const h=/ERROR: 0:(\d+)/.exec(c);if(h){const p=parseInt(h[1]);return i.toUpperCase()+`

`+c+`

`+wA(s.getShaderSource(e),p)}else return c}function UA(s,e){const i=DA(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}const NA={[Xv]:"Linear",[jv]:"Reinhard",[Wv]:"Cineon",[_p]:"ACESFilmic",[Yv]:"AgX",[Zv]:"Neutral",[qv]:"Custom"};function LA(s,e){const i=NA[e];return i===void 0?(tt("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Jc=new $;function OA(){Tt.getLuminanceCoefficients(Jc);const s=Jc.x.toFixed(4),e=Jc.y.toFixed(4),i=Jc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function PA(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(rl).join(`
`)}function IA(s){const e=[];for(const i in s){const r=s[i];r!==!1&&e.push("#define "+i+" "+r)}return e.join(`
`)}function FA(s,e){const i={},r=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let l=0;l<r;l++){const c=s.getActiveAttrib(e,l),h=c.name;let p=1;c.type===s.FLOAT_MAT2&&(p=2),c.type===s.FLOAT_MAT3&&(p=3),c.type===s.FLOAT_MAT4&&(p=4),i[h]={type:c.type,location:s.getAttribLocation(e,h),locationSize:p}}return i}function rl(s){return s!==""}function Tv(s,e){const i=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Av(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const BA=/^[ \t]*#include +<([\w\d./]+)>/gm;function fp(s){return s.replace(BA,HA)}const zA=new Map;function HA(s,e){let i=ht[e];if(i===void 0){const r=zA.get(e);if(r!==void 0)i=ht[r],tt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return fp(i)}const GA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Rv(s){return s.replace(GA,VA)}function VA(s,e,i,r){let l="";for(let c=parseInt(e);c<parseInt(i);c++)l+=r.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return l}function Cv(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const kA={[nu]:"SHADOWMAP_TYPE_PCF",[al]:"SHADOWMAP_TYPE_VSM"};function XA(s){return kA[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const jA={[qs]:"ENVMAP_TYPE_CUBE",[Kr]:"ENVMAP_TYPE_CUBE",[Su]:"ENVMAP_TYPE_CUBE_UV"};function WA(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":jA[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const qA={[Kr]:"ENVMAP_MODE_REFRACTION"};function YA(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":qA[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const ZA={[kv]:"ENVMAP_BLENDING_MULTIPLY",[TM]:"ENVMAP_BLENDING_MIX",[AM]:"ENVMAP_BLENDING_ADD"};function KA(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":ZA[s.combine]||"ENVMAP_BLENDING_NONE"}function QA(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const i=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:r,maxMip:i}}function JA(s,e,i,r){const l=s.getContext(),c=i.defines;let h=i.vertexShader,p=i.fragmentShader;const m=XA(i),d=WA(i),_=YA(i),v=KA(i),g=QA(i),M=PA(i),E=IA(c),C=l.createProgram();let y,S,w=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(y=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E].filter(rl).join(`
`),y.length>0&&(y+=`
`),S=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E].filter(rl).join(`
`),S.length>0&&(S+=`
`)):(y=[Cv(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+_:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexNormals?"#define HAS_NORMAL":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(rl).join(`
`),S=[Cv(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+d:"",i.envMap?"#define "+_:"",i.envMap?"#define "+v:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor?"#define USE_COLOR":"",i.vertexAlphas||i.batchingColor?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Zi?"#define TONE_MAPPING":"",i.toneMapping!==Zi?ht.tonemapping_pars_fragment:"",i.toneMapping!==Zi?LA("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",ht.colorspace_pars_fragment,UA("linearToOutputTexel",i.outputColorSpace),OA(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(rl).join(`
`)),h=fp(h),h=Tv(h,i),h=Av(h,i),p=fp(p),p=Tv(p,i),p=Av(p,i),h=Rv(h),p=Rv(p),i.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,y=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,S=["#define varying in",i.glslVersion===L_?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===L_?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+S);const L=w+y+h,I=w+S+p,V=Mv(l,l.VERTEX_SHADER,L),N=Mv(l,l.FRAGMENT_SHADER,I);l.attachShader(C,V),l.attachShader(C,N),i.index0AttributeName!==void 0?l.bindAttribLocation(C,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(C,0,"position"),l.linkProgram(C);function O(z){if(s.debug.checkShaderErrors){const Q=l.getProgramInfoLog(C)||"",ee=l.getShaderInfoLog(V)||"",he=l.getShaderInfoLog(N)||"",j=Q.trim(),P=ee.trim(),H=he.trim();let ne=!0,pe=!0;if(l.getProgramParameter(C,l.LINK_STATUS)===!1)if(ne=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(l,C,V,N);else{const ye=Ev(l,V,"vertex"),F=Ev(l,N,"fragment");At("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(C,l.VALIDATE_STATUS)+`

Material Name: `+z.name+`
Material Type: `+z.type+`

Program Info Log: `+j+`
`+ye+`
`+F)}else j!==""?tt("WebGLProgram: Program Info Log:",j):(P===""||H==="")&&(pe=!1);pe&&(z.diagnostics={runnable:ne,programLog:j,vertexShader:{log:P,prefix:y},fragmentShader:{log:H,prefix:S}})}l.deleteShader(V),l.deleteShader(N),T=new ou(l,C),B=FA(l,C)}let T;this.getUniforms=function(){return T===void 0&&O(this),T};let B;this.getAttributes=function(){return B===void 0&&O(this),B};let Z=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return Z===!1&&(Z=l.getProgramParameter(C,RA)),Z},this.destroy=function(){r.releaseStatesOfProgram(this),l.deleteProgram(C),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=CA++,this.cacheKey=e,this.usedTimes=1,this.program=C,this.vertexShader=V,this.fragmentShader=N,this}let $A=0;class eR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const i=e.vertexShader,r=e.fragmentShader,l=this._getShaderStage(i),c=this._getShaderStage(r),h=this._getShaderCacheForMaterial(e);return h.has(l)===!1&&(h.add(l),l.usedTimes++),h.has(c)===!1&&(h.add(c),c.usedTimes++),this}remove(e){const i=this.materialCache.get(e);for(const r of i)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const i=this.materialCache;let r=i.get(e);return r===void 0&&(r=new Set,i.set(e,r)),r}_getShaderStage(e){const i=this.shaderCache;let r=i.get(e);return r===void 0&&(r=new tR(e),i.set(e,r)),r}}class tR{constructor(e){this.id=$A++,this.code=e,this.usedTimes=0}}function nR(s){return s===Ys||s===cu||s===uu}function iR(s,e,i,r,l,c){const h=new rx,p=new eR,m=new Set,d=[],_=new Map,v=r.logarithmicDepthBuffer;let g=r.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function E(T){return m.add(T),T===0?"uv":`uv${T}`}function C(T,B,Z,z,Q,ee){const he=z.fog,j=Q.geometry,P=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?z.environment:null,H=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap,ne=e.get(T.envMap||P,H),pe=ne&&ne.mapping===Su?ne.image.height:null,ye=M[T.type];T.precision!==null&&(g=r.getMaxPrecision(T.precision),g!==T.precision&&tt("WebGLProgram.getParameters:",T.precision,"not supported, using",g,"instead."));const F=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,q=F!==void 0?F.length:0;let Se=0;j.morphAttributes.position!==void 0&&(Se=1),j.morphAttributes.normal!==void 0&&(Se=2),j.morphAttributes.color!==void 0&&(Se=3);let Ae,Ce,se,Me;if(ye){const nt=Wi[ye];Ae=nt.vertexShader,Ce=nt.fragmentShader}else Ae=T.vertexShader,Ce=T.fragmentShader,p.update(T),se=p.getVertexShaderID(T),Me=p.getFragmentShaderID(T);const be=s.getRenderTarget(),K=s.state.buffers.depth.getReversed(),we=Q.isInstancedMesh===!0,Ze=Q.isBatchedMesh===!0,jt=!!T.map,pt=!!T.matcap,yt=!!ne,Lt=!!T.aoMap,ut=!!T.lightMap,ln=!!T.bumpMap,Yt=!!T.normalMap,An=!!T.displacementMap,W=!!T.emissiveMap,tn=!!T.metalnessMap,mt=!!T.roughnessMap,Ht=T.anisotropy>0,De=T.clearcoat>0,Qt=T.dispersion>0,U=T.iridescence>0,b=T.sheen>0,te=T.transmission>0,ve=Ht&&!!T.anisotropyMap,Te=De&&!!T.clearcoatMap,Ue=De&&!!T.clearcoatNormalMap,Pe=De&&!!T.clearcoatRoughnessMap,fe=U&&!!T.iridescenceMap,de=U&&!!T.iridescenceThicknessMap,Ie=b&&!!T.sheenColorMap,Fe=b&&!!T.sheenRoughnessMap,Le=!!T.specularMap,Ne=!!T.specularColorMap,it=!!T.specularIntensityMap,at=te&&!!T.transmissionMap,_t=te&&!!T.thicknessMap,k=!!T.gradientMap,Re=!!T.alphaMap,ge=T.alphaTest>0,He=!!T.alphaHash,Oe=!!T.extensions;let Ee=Zi;T.toneMapped&&(be===null||be.isXRRenderTarget===!0)&&(Ee=s.toneMapping);const qe={shaderID:ye,shaderType:T.type,shaderName:T.name,vertexShader:Ae,fragmentShader:Ce,defines:T.defines,customVertexShaderID:se,customFragmentShaderID:Me,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:g,batching:Ze,batchingColor:Ze&&Q._colorsTexture!==null,instancing:we,instancingColor:we&&Q.instanceColor!==null,instancingMorph:we&&Q.morphTexture!==null,outputColorSpace:be===null?s.outputColorSpace:be.isXRRenderTarget===!0?be.texture.colorSpace:Tt.workingColorSpace,alphaToCoverage:!!T.alphaToCoverage,map:jt,matcap:pt,envMap:yt,envMapMode:yt&&ne.mapping,envMapCubeUVHeight:pe,aoMap:Lt,lightMap:ut,bumpMap:ln,normalMap:Yt,displacementMap:An,emissiveMap:W,normalMapObjectSpace:Yt&&T.normalMapType===wM,normalMapTangentSpace:Yt&&T.normalMapType===op,packedNormalMap:Yt&&T.normalMapType===op&&nR(T.normalMap.format),metalnessMap:tn,roughnessMap:mt,anisotropy:Ht,anisotropyMap:ve,clearcoat:De,clearcoatMap:Te,clearcoatNormalMap:Ue,clearcoatRoughnessMap:Pe,dispersion:Qt,iridescence:U,iridescenceMap:fe,iridescenceThicknessMap:de,sheen:b,sheenColorMap:Ie,sheenRoughnessMap:Fe,specularMap:Le,specularColorMap:Ne,specularIntensityMap:it,transmission:te,transmissionMap:at,thicknessMap:_t,gradientMap:k,opaque:T.transparent===!1&&T.blending===qr&&T.alphaToCoverage===!1,alphaMap:Re,alphaTest:ge,alphaHash:He,combine:T.combine,mapUv:jt&&E(T.map.channel),aoMapUv:Lt&&E(T.aoMap.channel),lightMapUv:ut&&E(T.lightMap.channel),bumpMapUv:ln&&E(T.bumpMap.channel),normalMapUv:Yt&&E(T.normalMap.channel),displacementMapUv:An&&E(T.displacementMap.channel),emissiveMapUv:W&&E(T.emissiveMap.channel),metalnessMapUv:tn&&E(T.metalnessMap.channel),roughnessMapUv:mt&&E(T.roughnessMap.channel),anisotropyMapUv:ve&&E(T.anisotropyMap.channel),clearcoatMapUv:Te&&E(T.clearcoatMap.channel),clearcoatNormalMapUv:Ue&&E(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pe&&E(T.clearcoatRoughnessMap.channel),iridescenceMapUv:fe&&E(T.iridescenceMap.channel),iridescenceThicknessMapUv:de&&E(T.iridescenceThicknessMap.channel),sheenColorMapUv:Ie&&E(T.sheenColorMap.channel),sheenRoughnessMapUv:Fe&&E(T.sheenRoughnessMap.channel),specularMapUv:Le&&E(T.specularMap.channel),specularColorMapUv:Ne&&E(T.specularColorMap.channel),specularIntensityMapUv:it&&E(T.specularIntensityMap.channel),transmissionMapUv:at&&E(T.transmissionMap.channel),thicknessMapUv:_t&&E(T.thicknessMap.channel),alphaMapUv:Re&&E(T.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(Yt||Ht),vertexNormals:!!j.attributes.normal,vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:Q.isPoints===!0&&!!j.attributes.uv&&(jt||Re),fog:!!he,useFog:T.fog===!0,fogExp2:!!he&&he.isFogExp2,flatShading:T.wireframe===!1&&(T.flatShading===!0||j.attributes.normal===void 0&&Yt===!1&&(T.isMeshLambertMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isMeshPhysicalMaterial)),sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:v,reversedDepthBuffer:K,skinning:Q.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:q,morphTextureStride:Se,numDirLights:B.directional.length,numPointLights:B.point.length,numSpotLights:B.spot.length,numSpotLightMaps:B.spotLightMap.length,numRectAreaLights:B.rectArea.length,numHemiLights:B.hemi.length,numDirLightShadows:B.directionalShadowMap.length,numPointLightShadows:B.pointShadowMap.length,numSpotLightShadows:B.spotShadowMap.length,numSpotLightShadowsWithMaps:B.numSpotLightShadowsWithMaps,numLightProbes:B.numLightProbes,numLightProbeGrids:ee.length,numClippingPlanes:c.numPlanes,numClipIntersection:c.numIntersection,dithering:T.dithering,shadowMapEnabled:s.shadowMap.enabled&&Z.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ee,decodeVideoTexture:jt&&T.map.isVideoTexture===!0&&Tt.getTransfer(T.map.colorSpace)===zt,decodeVideoTextureEmissive:W&&T.emissiveMap.isVideoTexture===!0&&Tt.getTransfer(T.emissiveMap.colorSpace)===zt,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===ba,flipSided:T.side===$n,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Oe&&T.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Oe&&T.extensions.multiDraw===!0||Ze)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return qe.vertexUv1s=m.has(1),qe.vertexUv2s=m.has(2),qe.vertexUv3s=m.has(3),m.clear(),qe}function y(T){const B=[];if(T.shaderID?B.push(T.shaderID):(B.push(T.customVertexShaderID),B.push(T.customFragmentShaderID)),T.defines!==void 0)for(const Z in T.defines)B.push(Z),B.push(T.defines[Z]);return T.isRawShaderMaterial===!1&&(S(B,T),w(B,T),B.push(s.outputColorSpace)),B.push(T.customProgramCacheKey),B.join()}function S(T,B){T.push(B.precision),T.push(B.outputColorSpace),T.push(B.envMapMode),T.push(B.envMapCubeUVHeight),T.push(B.mapUv),T.push(B.alphaMapUv),T.push(B.lightMapUv),T.push(B.aoMapUv),T.push(B.bumpMapUv),T.push(B.normalMapUv),T.push(B.displacementMapUv),T.push(B.emissiveMapUv),T.push(B.metalnessMapUv),T.push(B.roughnessMapUv),T.push(B.anisotropyMapUv),T.push(B.clearcoatMapUv),T.push(B.clearcoatNormalMapUv),T.push(B.clearcoatRoughnessMapUv),T.push(B.iridescenceMapUv),T.push(B.iridescenceThicknessMapUv),T.push(B.sheenColorMapUv),T.push(B.sheenRoughnessMapUv),T.push(B.specularMapUv),T.push(B.specularColorMapUv),T.push(B.specularIntensityMapUv),T.push(B.transmissionMapUv),T.push(B.thicknessMapUv),T.push(B.combine),T.push(B.fogExp2),T.push(B.sizeAttenuation),T.push(B.morphTargetsCount),T.push(B.morphAttributeCount),T.push(B.numDirLights),T.push(B.numPointLights),T.push(B.numSpotLights),T.push(B.numSpotLightMaps),T.push(B.numHemiLights),T.push(B.numRectAreaLights),T.push(B.numDirLightShadows),T.push(B.numPointLightShadows),T.push(B.numSpotLightShadows),T.push(B.numSpotLightShadowsWithMaps),T.push(B.numLightProbes),T.push(B.shadowMapType),T.push(B.toneMapping),T.push(B.numClippingPlanes),T.push(B.numClipIntersection),T.push(B.depthPacking)}function w(T,B){h.disableAll(),B.instancing&&h.enable(0),B.instancingColor&&h.enable(1),B.instancingMorph&&h.enable(2),B.matcap&&h.enable(3),B.envMap&&h.enable(4),B.normalMapObjectSpace&&h.enable(5),B.normalMapTangentSpace&&h.enable(6),B.clearcoat&&h.enable(7),B.iridescence&&h.enable(8),B.alphaTest&&h.enable(9),B.vertexColors&&h.enable(10),B.vertexAlphas&&h.enable(11),B.vertexUv1s&&h.enable(12),B.vertexUv2s&&h.enable(13),B.vertexUv3s&&h.enable(14),B.vertexTangents&&h.enable(15),B.anisotropy&&h.enable(16),B.alphaHash&&h.enable(17),B.batching&&h.enable(18),B.dispersion&&h.enable(19),B.batchingColor&&h.enable(20),B.gradientMap&&h.enable(21),B.packedNormalMap&&h.enable(22),B.vertexNormals&&h.enable(23),T.push(h.mask),h.disableAll(),B.fog&&h.enable(0),B.useFog&&h.enable(1),B.flatShading&&h.enable(2),B.logarithmicDepthBuffer&&h.enable(3),B.reversedDepthBuffer&&h.enable(4),B.skinning&&h.enable(5),B.morphTargets&&h.enable(6),B.morphNormals&&h.enable(7),B.morphColors&&h.enable(8),B.premultipliedAlpha&&h.enable(9),B.shadowMapEnabled&&h.enable(10),B.doubleSided&&h.enable(11),B.flipSided&&h.enable(12),B.useDepthPacking&&h.enable(13),B.dithering&&h.enable(14),B.transmission&&h.enable(15),B.sheen&&h.enable(16),B.opaque&&h.enable(17),B.pointsUvs&&h.enable(18),B.decodeVideoTexture&&h.enable(19),B.decodeVideoTextureEmissive&&h.enable(20),B.alphaToCoverage&&h.enable(21),B.numLightProbeGrids>0&&h.enable(22),T.push(h.mask)}function L(T){const B=M[T.type];let Z;if(B){const z=Wi[B];Z=_b.clone(z.uniforms)}else Z=T.uniforms;return Z}function I(T,B){let Z=_.get(B);return Z!==void 0?++Z.usedTimes:(Z=new JA(s,B,T,l),d.push(Z),_.set(B,Z)),Z}function V(T){if(--T.usedTimes===0){const B=d.indexOf(T);d[B]=d[d.length-1],d.pop(),_.delete(T.cacheKey),T.destroy()}}function N(T){p.remove(T)}function O(){p.dispose()}return{getParameters:C,getProgramCacheKey:y,getUniforms:L,acquireProgram:I,releaseProgram:V,releaseShaderCache:N,programs:d,dispose:O}}function aR(){let s=new WeakMap;function e(h){return s.has(h)}function i(h){let p=s.get(h);return p===void 0&&(p={},s.set(h,p)),p}function r(h){s.delete(h)}function l(h,p,m){s.get(h)[p]=m}function c(){s=new WeakMap}return{has:e,get:i,remove:r,update:l,dispose:c}}function sR(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function wv(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Dv(){const s=[];let e=0;const i=[],r=[],l=[];function c(){e=0,i.length=0,r.length=0,l.length=0}function h(g){let M=0;return g.isInstancedMesh&&(M+=2),g.isSkinnedMesh&&(M+=1),M}function p(g,M,E,C,y,S){let w=s[e];return w===void 0?(w={id:g.id,object:g,geometry:M,material:E,materialVariant:h(g),groupOrder:C,renderOrder:g.renderOrder,z:y,group:S},s[e]=w):(w.id=g.id,w.object=g,w.geometry=M,w.material=E,w.materialVariant=h(g),w.groupOrder=C,w.renderOrder=g.renderOrder,w.z=y,w.group=S),e++,w}function m(g,M,E,C,y,S){const w=p(g,M,E,C,y,S);E.transmission>0?r.push(w):E.transparent===!0?l.push(w):i.push(w)}function d(g,M,E,C,y,S){const w=p(g,M,E,C,y,S);E.transmission>0?r.unshift(w):E.transparent===!0?l.unshift(w):i.unshift(w)}function _(g,M){i.length>1&&i.sort(g||sR),r.length>1&&r.sort(M||wv),l.length>1&&l.sort(M||wv)}function v(){for(let g=e,M=s.length;g<M;g++){const E=s[g];if(E.id===null)break;E.id=null,E.object=null,E.geometry=null,E.material=null,E.group=null}}return{opaque:i,transmissive:r,transparent:l,init:c,push:m,unshift:d,finish:v,sort:_}}function rR(){let s=new WeakMap;function e(r,l){const c=s.get(r);let h;return c===void 0?(h=new Dv,s.set(r,[h])):l>=c.length?(h=new Dv,c.push(h)):h=c[l],h}function i(){s=new WeakMap}return{get:e,dispose:i}}function oR(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let i;switch(e.type){case"DirectionalLight":i={direction:new $,color:new dt};break;case"SpotLight":i={position:new $,direction:new $,color:new dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new $,color:new dt,distance:0,decay:0};break;case"HemisphereLight":i={direction:new $,skyColor:new dt,groundColor:new dt};break;case"RectAreaLight":i={color:new dt,position:new $,halfWidth:new $,halfHeight:new $};break}return s[e.id]=i,i}}}function lR(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let i;switch(e.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=i,i}}}let cR=0;function uR(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function fR(s){const e=new oR,i=lR(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)r.probe.push(new $);const l=new $,c=new on,h=new on;function p(d){let _=0,v=0,g=0;for(let B=0;B<9;B++)r.probe[B].set(0,0,0);let M=0,E=0,C=0,y=0,S=0,w=0,L=0,I=0,V=0,N=0,O=0;d.sort(uR);for(let B=0,Z=d.length;B<Z;B++){const z=d[B],Q=z.color,ee=z.intensity,he=z.distance;let j=null;if(z.shadow&&z.shadow.map&&(z.shadow.map.texture.format===Ys?j=z.shadow.map.texture:j=z.shadow.map.depthTexture||z.shadow.map.texture),z.isAmbientLight)_+=Q.r*ee,v+=Q.g*ee,g+=Q.b*ee;else if(z.isLightProbe){for(let P=0;P<9;P++)r.probe[P].addScaledVector(z.sh.coefficients[P],ee);O++}else if(z.isDirectionalLight){const P=e.get(z);if(P.color.copy(z.color).multiplyScalar(z.intensity),z.castShadow){const H=z.shadow,ne=i.get(z);ne.shadowIntensity=H.intensity,ne.shadowBias=H.bias,ne.shadowNormalBias=H.normalBias,ne.shadowRadius=H.radius,ne.shadowMapSize=H.mapSize,r.directionalShadow[M]=ne,r.directionalShadowMap[M]=j,r.directionalShadowMatrix[M]=z.shadow.matrix,w++}r.directional[M]=P,M++}else if(z.isSpotLight){const P=e.get(z);P.position.setFromMatrixPosition(z.matrixWorld),P.color.copy(Q).multiplyScalar(ee),P.distance=he,P.coneCos=Math.cos(z.angle),P.penumbraCos=Math.cos(z.angle*(1-z.penumbra)),P.decay=z.decay,r.spot[C]=P;const H=z.shadow;if(z.map&&(r.spotLightMap[V]=z.map,V++,H.updateMatrices(z),z.castShadow&&N++),r.spotLightMatrix[C]=H.matrix,z.castShadow){const ne=i.get(z);ne.shadowIntensity=H.intensity,ne.shadowBias=H.bias,ne.shadowNormalBias=H.normalBias,ne.shadowRadius=H.radius,ne.shadowMapSize=H.mapSize,r.spotShadow[C]=ne,r.spotShadowMap[C]=j,I++}C++}else if(z.isRectAreaLight){const P=e.get(z);P.color.copy(Q).multiplyScalar(ee),P.halfWidth.set(z.width*.5,0,0),P.halfHeight.set(0,z.height*.5,0),r.rectArea[y]=P,y++}else if(z.isPointLight){const P=e.get(z);if(P.color.copy(z.color).multiplyScalar(z.intensity),P.distance=z.distance,P.decay=z.decay,z.castShadow){const H=z.shadow,ne=i.get(z);ne.shadowIntensity=H.intensity,ne.shadowBias=H.bias,ne.shadowNormalBias=H.normalBias,ne.shadowRadius=H.radius,ne.shadowMapSize=H.mapSize,ne.shadowCameraNear=H.camera.near,ne.shadowCameraFar=H.camera.far,r.pointShadow[E]=ne,r.pointShadowMap[E]=j,r.pointShadowMatrix[E]=z.shadow.matrix,L++}r.point[E]=P,E++}else if(z.isHemisphereLight){const P=e.get(z);P.skyColor.copy(z.color).multiplyScalar(ee),P.groundColor.copy(z.groundColor).multiplyScalar(ee),r.hemi[S]=P,S++}}y>0&&(s.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Ge.LTC_FLOAT_1,r.rectAreaLTC2=Ge.LTC_FLOAT_2):(r.rectAreaLTC1=Ge.LTC_HALF_1,r.rectAreaLTC2=Ge.LTC_HALF_2)),r.ambient[0]=_,r.ambient[1]=v,r.ambient[2]=g;const T=r.hash;(T.directionalLength!==M||T.pointLength!==E||T.spotLength!==C||T.rectAreaLength!==y||T.hemiLength!==S||T.numDirectionalShadows!==w||T.numPointShadows!==L||T.numSpotShadows!==I||T.numSpotMaps!==V||T.numLightProbes!==O)&&(r.directional.length=M,r.spot.length=C,r.rectArea.length=y,r.point.length=E,r.hemi.length=S,r.directionalShadow.length=w,r.directionalShadowMap.length=w,r.pointShadow.length=L,r.pointShadowMap.length=L,r.spotShadow.length=I,r.spotShadowMap.length=I,r.directionalShadowMatrix.length=w,r.pointShadowMatrix.length=L,r.spotLightMatrix.length=I+V-N,r.spotLightMap.length=V,r.numSpotLightShadowsWithMaps=N,r.numLightProbes=O,T.directionalLength=M,T.pointLength=E,T.spotLength=C,T.rectAreaLength=y,T.hemiLength=S,T.numDirectionalShadows=w,T.numPointShadows=L,T.numSpotShadows=I,T.numSpotMaps=V,T.numLightProbes=O,r.version=cR++)}function m(d,_){let v=0,g=0,M=0,E=0,C=0;const y=_.matrixWorldInverse;for(let S=0,w=d.length;S<w;S++){const L=d[S];if(L.isDirectionalLight){const I=r.directional[v];I.direction.setFromMatrixPosition(L.matrixWorld),l.setFromMatrixPosition(L.target.matrixWorld),I.direction.sub(l),I.direction.transformDirection(y),v++}else if(L.isSpotLight){const I=r.spot[M];I.position.setFromMatrixPosition(L.matrixWorld),I.position.applyMatrix4(y),I.direction.setFromMatrixPosition(L.matrixWorld),l.setFromMatrixPosition(L.target.matrixWorld),I.direction.sub(l),I.direction.transformDirection(y),M++}else if(L.isRectAreaLight){const I=r.rectArea[E];I.position.setFromMatrixPosition(L.matrixWorld),I.position.applyMatrix4(y),h.identity(),c.copy(L.matrixWorld),c.premultiply(y),h.extractRotation(c),I.halfWidth.set(L.width*.5,0,0),I.halfHeight.set(0,L.height*.5,0),I.halfWidth.applyMatrix4(h),I.halfHeight.applyMatrix4(h),E++}else if(L.isPointLight){const I=r.point[g];I.position.setFromMatrixPosition(L.matrixWorld),I.position.applyMatrix4(y),g++}else if(L.isHemisphereLight){const I=r.hemi[C];I.direction.setFromMatrixPosition(L.matrixWorld),I.direction.transformDirection(y),C++}}}return{setup:p,setupView:m,state:r}}function Uv(s){const e=new fR(s),i=[],r=[],l=[];function c(g){v.camera=g,i.length=0,r.length=0,l.length=0}function h(g){i.push(g)}function p(g){r.push(g)}function m(g){l.push(g)}function d(){e.setup(i)}function _(g){e.setupView(i,g)}const v={lightsArray:i,shadowsArray:r,lightProbeGridArray:l,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:c,state:v,setupLights:d,setupLightsView:_,pushLight:h,pushShadow:p,pushLightProbeGrid:m}}function hR(s){let e=new WeakMap;function i(l,c=0){const h=e.get(l);let p;return h===void 0?(p=new Uv(s),e.set(l,[p])):c>=h.length?(p=new Uv(s),h.push(p)):p=h[c],p}function r(){e=new WeakMap}return{get:i,dispose:r}}const dR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,pR=`uniform sampler2D shadow_pass;
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
}`,mR=[new $(1,0,0),new $(-1,0,0),new $(0,1,0),new $(0,-1,0),new $(0,0,1),new $(0,0,-1)],gR=[new $(0,-1,0),new $(0,-1,0),new $(0,0,1),new $(0,0,-1),new $(0,-1,0),new $(0,-1,0)],Nv=new on,il=new $,md=new $;function _R(s,e,i){let r=new wp;const l=new ot,c=new ot,h=new rn,p=new bb,m=new Eb,d={},_=i.maxTextureSize,v={[ps]:$n,[$n]:ps,[ba]:ba},g=new Ji({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:dR,fragmentShader:pR}),M=g.clone();M.defines.HORIZONTAL_PASS=1;const E=new mi;E.setAttribute("position",new pi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const C=new Fi(E,g),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nu;let S=this.type;this.render=function(N,O,T){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||N.length===0)return;this.type===Vv&&(tt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=nu);const B=s.getRenderTarget(),Z=s.getActiveCubeFace(),z=s.getActiveMipmapLevel(),Q=s.state;Q.setBlending(Ta),Q.buffers.depth.getReversed()===!0?Q.buffers.color.setClear(0,0,0,0):Q.buffers.color.setClear(1,1,1,1),Q.buffers.depth.setTest(!0),Q.setScissorTest(!1);const ee=S!==this.type;ee&&O.traverse(function(he){he.material&&(Array.isArray(he.material)?he.material.forEach(j=>j.needsUpdate=!0):he.material.needsUpdate=!0)});for(let he=0,j=N.length;he<j;he++){const P=N[he],H=P.shadow;if(H===void 0){tt("WebGLShadowMap:",P,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;l.copy(H.mapSize);const ne=H.getFrameExtents();l.multiply(ne),c.copy(H.mapSize),(l.x>_||l.y>_)&&(l.x>_&&(c.x=Math.floor(_/ne.x),l.x=c.x*ne.x,H.mapSize.x=c.x),l.y>_&&(c.y=Math.floor(_/ne.y),l.y=c.y*ne.y,H.mapSize.y=c.y));const pe=s.state.buffers.depth.getReversed();if(H.camera._reversedDepth=pe,H.map===null||ee===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===al){if(P.isPointLight){tt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Ki(l.x,l.y,{format:Ys,type:Ra,minFilter:zn,magFilter:zn,generateMipmaps:!1}),H.map.texture.name=P.name+".shadowMap",H.map.depthTexture=new Qr(l.x,l.y,qi),H.map.depthTexture.name=P.name+".shadowMapDepth",H.map.depthTexture.format=Ca,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Ln,H.map.depthTexture.magFilter=Ln}else P.isPointLight?(H.map=new xx(l.x),H.map.depthTexture=new db(l.x,Qi)):(H.map=new Ki(l.x,l.y),H.map.depthTexture=new Qr(l.x,l.y,Qi)),H.map.depthTexture.name=P.name+".shadowMap",H.map.depthTexture.format=Ca,this.type===nu?(H.map.depthTexture.compareFunction=pe?Tp:Ep,H.map.depthTexture.minFilter=zn,H.map.depthTexture.magFilter=zn):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Ln,H.map.depthTexture.magFilter=Ln);H.camera.updateProjectionMatrix()}const ye=H.map.isWebGLCubeRenderTarget?6:1;for(let F=0;F<ye;F++){if(H.map.isWebGLCubeRenderTarget)s.setRenderTarget(H.map,F),s.clear();else{F===0&&(s.setRenderTarget(H.map),s.clear());const q=H.getViewport(F);h.set(c.x*q.x,c.y*q.y,c.x*q.z,c.y*q.w),Q.viewport(h)}if(P.isPointLight){const q=H.camera,Se=H.matrix,Ae=P.distance||q.far;Ae!==q.far&&(q.far=Ae,q.updateProjectionMatrix()),il.setFromMatrixPosition(P.matrixWorld),q.position.copy(il),md.copy(q.position),md.add(mR[F]),q.up.copy(gR[F]),q.lookAt(md),q.updateMatrixWorld(),Se.makeTranslation(-il.x,-il.y,-il.z),Nv.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),H._frustum.setFromProjectionMatrix(Nv,q.coordinateSystem,q.reversedDepth)}else H.updateMatrices(P);r=H.getFrustum(),I(O,T,H.camera,P,this.type)}H.isPointLightShadow!==!0&&this.type===al&&w(H,T),H.needsUpdate=!1}S=this.type,y.needsUpdate=!1,s.setRenderTarget(B,Z,z)};function w(N,O){const T=e.update(C);g.defines.VSM_SAMPLES!==N.blurSamples&&(g.defines.VSM_SAMPLES=N.blurSamples,M.defines.VSM_SAMPLES=N.blurSamples,g.needsUpdate=!0,M.needsUpdate=!0),N.mapPass===null&&(N.mapPass=new Ki(l.x,l.y,{format:Ys,type:Ra})),g.uniforms.shadow_pass.value=N.map.depthTexture,g.uniforms.resolution.value=N.mapSize,g.uniforms.radius.value=N.radius,s.setRenderTarget(N.mapPass),s.clear(),s.renderBufferDirect(O,null,T,g,C,null),M.uniforms.shadow_pass.value=N.mapPass.texture,M.uniforms.resolution.value=N.mapSize,M.uniforms.radius.value=N.radius,s.setRenderTarget(N.map),s.clear(),s.renderBufferDirect(O,null,T,M,C,null)}function L(N,O,T,B){let Z=null;const z=T.isPointLight===!0?N.customDistanceMaterial:N.customDepthMaterial;if(z!==void 0)Z=z;else if(Z=T.isPointLight===!0?m:p,s.localClippingEnabled&&O.clipShadows===!0&&Array.isArray(O.clippingPlanes)&&O.clippingPlanes.length!==0||O.displacementMap&&O.displacementScale!==0||O.alphaMap&&O.alphaTest>0||O.map&&O.alphaTest>0||O.alphaToCoverage===!0){const Q=Z.uuid,ee=O.uuid;let he=d[Q];he===void 0&&(he={},d[Q]=he);let j=he[ee];j===void 0&&(j=Z.clone(),he[ee]=j,O.addEventListener("dispose",V)),Z=j}if(Z.visible=O.visible,Z.wireframe=O.wireframe,B===al?Z.side=O.shadowSide!==null?O.shadowSide:O.side:Z.side=O.shadowSide!==null?O.shadowSide:v[O.side],Z.alphaMap=O.alphaMap,Z.alphaTest=O.alphaToCoverage===!0?.5:O.alphaTest,Z.map=O.map,Z.clipShadows=O.clipShadows,Z.clippingPlanes=O.clippingPlanes,Z.clipIntersection=O.clipIntersection,Z.displacementMap=O.displacementMap,Z.displacementScale=O.displacementScale,Z.displacementBias=O.displacementBias,Z.wireframeLinewidth=O.wireframeLinewidth,Z.linewidth=O.linewidth,T.isPointLight===!0&&Z.isMeshDistanceMaterial===!0){const Q=s.properties.get(Z);Q.light=T}return Z}function I(N,O,T,B,Z){if(N.visible===!1)return;if(N.layers.test(O.layers)&&(N.isMesh||N.isLine||N.isPoints)&&(N.castShadow||N.receiveShadow&&Z===al)&&(!N.frustumCulled||r.intersectsObject(N))){N.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,N.matrixWorld);const ee=e.update(N),he=N.material;if(Array.isArray(he)){const j=ee.groups;for(let P=0,H=j.length;P<H;P++){const ne=j[P],pe=he[ne.materialIndex];if(pe&&pe.visible){const ye=L(N,pe,B,Z);N.onBeforeShadow(s,N,O,T,ee,ye,ne),s.renderBufferDirect(T,null,ee,ye,N,ne),N.onAfterShadow(s,N,O,T,ee,ye,ne)}}}else if(he.visible){const j=L(N,he,B,Z);N.onBeforeShadow(s,N,O,T,ee,j,null),s.renderBufferDirect(T,null,ee,j,N,null),N.onAfterShadow(s,N,O,T,ee,j,null)}}const Q=N.children;for(let ee=0,he=Q.length;ee<he;ee++)I(Q[ee],O,T,B,Z)}function V(N){N.target.removeEventListener("dispose",V);for(const T in d){const B=d[T],Z=N.target.uuid;Z in B&&(B[Z].dispose(),delete B[Z])}}}function vR(s,e){function i(){let k=!1;const Re=new rn;let ge=null;const He=new rn(0,0,0,0);return{setMask:function(Oe){ge!==Oe&&!k&&(s.colorMask(Oe,Oe,Oe,Oe),ge=Oe)},setLocked:function(Oe){k=Oe},setClear:function(Oe,Ee,qe,nt,nn){nn===!0&&(Oe*=nt,Ee*=nt,qe*=nt),Re.set(Oe,Ee,qe,nt),He.equals(Re)===!1&&(s.clearColor(Oe,Ee,qe,nt),He.copy(Re))},reset:function(){k=!1,ge=null,He.set(-1,0,0,0)}}}function r(){let k=!1,Re=!1,ge=null,He=null,Oe=null;return{setReversed:function(Ee){if(Re!==Ee){const qe=e.get("EXT_clip_control");Ee?qe.clipControlEXT(qe.LOWER_LEFT_EXT,qe.ZERO_TO_ONE_EXT):qe.clipControlEXT(qe.LOWER_LEFT_EXT,qe.NEGATIVE_ONE_TO_ONE_EXT),Re=Ee;const nt=Oe;Oe=null,this.setClear(nt)}},getReversed:function(){return Re},setTest:function(Ee){Ee?be(s.DEPTH_TEST):K(s.DEPTH_TEST)},setMask:function(Ee){ge!==Ee&&!k&&(s.depthMask(Ee),ge=Ee)},setFunc:function(Ee){if(Re&&(Ee=zM[Ee]),He!==Ee){switch(Ee){case Md:s.depthFunc(s.NEVER);break;case bd:s.depthFunc(s.ALWAYS);break;case Ed:s.depthFunc(s.LESS);break;case Zr:s.depthFunc(s.LEQUAL);break;case Td:s.depthFunc(s.EQUAL);break;case Ad:s.depthFunc(s.GEQUAL);break;case Rd:s.depthFunc(s.GREATER);break;case Cd:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}He=Ee}},setLocked:function(Ee){k=Ee},setClear:function(Ee){Oe!==Ee&&(Oe=Ee,Re&&(Ee=1-Ee),s.clearDepth(Ee))},reset:function(){k=!1,ge=null,He=null,Oe=null,Re=!1}}}function l(){let k=!1,Re=null,ge=null,He=null,Oe=null,Ee=null,qe=null,nt=null,nn=null;return{setTest:function(Dt){k||(Dt?be(s.STENCIL_TEST):K(s.STENCIL_TEST))},setMask:function(Dt){Re!==Dt&&!k&&(s.stencilMask(Dt),Re=Dt)},setFunc:function(Dt,gi,ti){(ge!==Dt||He!==gi||Oe!==ti)&&(s.stencilFunc(Dt,gi,ti),ge=Dt,He=gi,Oe=ti)},setOp:function(Dt,gi,ti){(Ee!==Dt||qe!==gi||nt!==ti)&&(s.stencilOp(Dt,gi,ti),Ee=Dt,qe=gi,nt=ti)},setLocked:function(Dt){k=Dt},setClear:function(Dt){nn!==Dt&&(s.clearStencil(Dt),nn=Dt)},reset:function(){k=!1,Re=null,ge=null,He=null,Oe=null,Ee=null,qe=null,nt=null,nn=null}}}const c=new i,h=new r,p=new l,m=new WeakMap,d=new WeakMap;let _={},v={},g={},M=new WeakMap,E=[],C=null,y=!1,S=null,w=null,L=null,I=null,V=null,N=null,O=null,T=new dt(0,0,0),B=0,Z=!1,z=null,Q=null,ee=null,he=null,j=null;const P=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,ne=0;const pe=s.getParameter(s.VERSION);pe.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(pe)[1]),H=ne>=1):pe.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(pe)[1]),H=ne>=2);let ye=null,F={};const q=s.getParameter(s.SCISSOR_BOX),Se=s.getParameter(s.VIEWPORT),Ae=new rn().fromArray(q),Ce=new rn().fromArray(Se);function se(k,Re,ge,He){const Oe=new Uint8Array(4),Ee=s.createTexture();s.bindTexture(k,Ee),s.texParameteri(k,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(k,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let qe=0;qe<ge;qe++)k===s.TEXTURE_3D||k===s.TEXTURE_2D_ARRAY?s.texImage3D(Re,0,s.RGBA,1,1,He,0,s.RGBA,s.UNSIGNED_BYTE,Oe):s.texImage2D(Re+qe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Oe);return Ee}const Me={};Me[s.TEXTURE_2D]=se(s.TEXTURE_2D,s.TEXTURE_2D,1),Me[s.TEXTURE_CUBE_MAP]=se(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Me[s.TEXTURE_2D_ARRAY]=se(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Me[s.TEXTURE_3D]=se(s.TEXTURE_3D,s.TEXTURE_3D,1,1),c.setClear(0,0,0,1),h.setClear(1),p.setClear(0),be(s.DEPTH_TEST),h.setFunc(Zr),ln(!1),Yt(R_),be(s.CULL_FACE),Lt(Ta);function be(k){_[k]!==!0&&(s.enable(k),_[k]=!0)}function K(k){_[k]!==!1&&(s.disable(k),_[k]=!1)}function we(k,Re){return g[k]!==Re?(s.bindFramebuffer(k,Re),g[k]=Re,k===s.DRAW_FRAMEBUFFER&&(g[s.FRAMEBUFFER]=Re),k===s.FRAMEBUFFER&&(g[s.DRAW_FRAMEBUFFER]=Re),!0):!1}function Ze(k,Re){let ge=E,He=!1;if(k){ge=M.get(Re),ge===void 0&&(ge=[],M.set(Re,ge));const Oe=k.textures;if(ge.length!==Oe.length||ge[0]!==s.COLOR_ATTACHMENT0){for(let Ee=0,qe=Oe.length;Ee<qe;Ee++)ge[Ee]=s.COLOR_ATTACHMENT0+Ee;ge.length=Oe.length,He=!0}}else ge[0]!==s.BACK&&(ge[0]=s.BACK,He=!0);He&&s.drawBuffers(ge)}function jt(k){return C!==k?(s.useProgram(k),C=k,!0):!1}const pt={[Gs]:s.FUNC_ADD,[lM]:s.FUNC_SUBTRACT,[cM]:s.FUNC_REVERSE_SUBTRACT};pt[uM]=s.MIN,pt[fM]=s.MAX;const yt={[hM]:s.ZERO,[dM]:s.ONE,[pM]:s.SRC_COLOR,[Sd]:s.SRC_ALPHA,[SM]:s.SRC_ALPHA_SATURATE,[vM]:s.DST_COLOR,[gM]:s.DST_ALPHA,[mM]:s.ONE_MINUS_SRC_COLOR,[yd]:s.ONE_MINUS_SRC_ALPHA,[xM]:s.ONE_MINUS_DST_COLOR,[_M]:s.ONE_MINUS_DST_ALPHA,[yM]:s.CONSTANT_COLOR,[MM]:s.ONE_MINUS_CONSTANT_COLOR,[bM]:s.CONSTANT_ALPHA,[EM]:s.ONE_MINUS_CONSTANT_ALPHA};function Lt(k,Re,ge,He,Oe,Ee,qe,nt,nn,Dt){if(k===Ta){y===!0&&(K(s.BLEND),y=!1);return}if(y===!1&&(be(s.BLEND),y=!0),k!==oM){if(k!==S||Dt!==Z){if((w!==Gs||V!==Gs)&&(s.blendEquation(s.FUNC_ADD),w=Gs,V=Gs),Dt)switch(k){case qr:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case C_:s.blendFunc(s.ONE,s.ONE);break;case w_:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case D_:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:At("WebGLState: Invalid blending: ",k);break}else switch(k){case qr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case C_:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case w_:At("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case D_:At("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:At("WebGLState: Invalid blending: ",k);break}L=null,I=null,N=null,O=null,T.set(0,0,0),B=0,S=k,Z=Dt}return}Oe=Oe||Re,Ee=Ee||ge,qe=qe||He,(Re!==w||Oe!==V)&&(s.blendEquationSeparate(pt[Re],pt[Oe]),w=Re,V=Oe),(ge!==L||He!==I||Ee!==N||qe!==O)&&(s.blendFuncSeparate(yt[ge],yt[He],yt[Ee],yt[qe]),L=ge,I=He,N=Ee,O=qe),(nt.equals(T)===!1||nn!==B)&&(s.blendColor(nt.r,nt.g,nt.b,nn),T.copy(nt),B=nn),S=k,Z=!1}function ut(k,Re){k.side===ba?K(s.CULL_FACE):be(s.CULL_FACE);let ge=k.side===$n;Re&&(ge=!ge),ln(ge),k.blending===qr&&k.transparent===!1?Lt(Ta):Lt(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),h.setFunc(k.depthFunc),h.setTest(k.depthTest),h.setMask(k.depthWrite),c.setMask(k.colorWrite);const He=k.stencilWrite;p.setTest(He),He&&(p.setMask(k.stencilWriteMask),p.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),p.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),W(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?be(s.SAMPLE_ALPHA_TO_COVERAGE):K(s.SAMPLE_ALPHA_TO_COVERAGE)}function ln(k){z!==k&&(k?s.frontFace(s.CW):s.frontFace(s.CCW),z=k)}function Yt(k){k!==sM?(be(s.CULL_FACE),k!==Q&&(k===R_?s.cullFace(s.BACK):k===rM?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):K(s.CULL_FACE),Q=k}function An(k){k!==ee&&(H&&s.lineWidth(k),ee=k)}function W(k,Re,ge){k?(be(s.POLYGON_OFFSET_FILL),(he!==Re||j!==ge)&&(he=Re,j=ge,h.getReversed()&&(Re=-Re),s.polygonOffset(Re,ge))):K(s.POLYGON_OFFSET_FILL)}function tn(k){k?be(s.SCISSOR_TEST):K(s.SCISSOR_TEST)}function mt(k){k===void 0&&(k=s.TEXTURE0+P-1),ye!==k&&(s.activeTexture(k),ye=k)}function Ht(k,Re,ge){ge===void 0&&(ye===null?ge=s.TEXTURE0+P-1:ge=ye);let He=F[ge];He===void 0&&(He={type:void 0,texture:void 0},F[ge]=He),(He.type!==k||He.texture!==Re)&&(ye!==ge&&(s.activeTexture(ge),ye=ge),s.bindTexture(k,Re||Me[k]),He.type=k,He.texture=Re)}function De(){const k=F[ye];k!==void 0&&k.type!==void 0&&(s.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function Qt(){try{s.compressedTexImage2D(...arguments)}catch(k){At("WebGLState:",k)}}function U(){try{s.compressedTexImage3D(...arguments)}catch(k){At("WebGLState:",k)}}function b(){try{s.texSubImage2D(...arguments)}catch(k){At("WebGLState:",k)}}function te(){try{s.texSubImage3D(...arguments)}catch(k){At("WebGLState:",k)}}function ve(){try{s.compressedTexSubImage2D(...arguments)}catch(k){At("WebGLState:",k)}}function Te(){try{s.compressedTexSubImage3D(...arguments)}catch(k){At("WebGLState:",k)}}function Ue(){try{s.texStorage2D(...arguments)}catch(k){At("WebGLState:",k)}}function Pe(){try{s.texStorage3D(...arguments)}catch(k){At("WebGLState:",k)}}function fe(){try{s.texImage2D(...arguments)}catch(k){At("WebGLState:",k)}}function de(){try{s.texImage3D(...arguments)}catch(k){At("WebGLState:",k)}}function Ie(k){return v[k]!==void 0?v[k]:s.getParameter(k)}function Fe(k,Re){v[k]!==Re&&(s.pixelStorei(k,Re),v[k]=Re)}function Le(k){Ae.equals(k)===!1&&(s.scissor(k.x,k.y,k.z,k.w),Ae.copy(k))}function Ne(k){Ce.equals(k)===!1&&(s.viewport(k.x,k.y,k.z,k.w),Ce.copy(k))}function it(k,Re){let ge=d.get(Re);ge===void 0&&(ge=new WeakMap,d.set(Re,ge));let He=ge.get(k);He===void 0&&(He=s.getUniformBlockIndex(Re,k.name),ge.set(k,He))}function at(k,Re){const He=d.get(Re).get(k);m.get(Re)!==He&&(s.uniformBlockBinding(Re,He,k.__bindingPointIndex),m.set(Re,He))}function _t(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),h.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),_={},v={},ye=null,F={},g={},M=new WeakMap,E=[],C=null,y=!1,S=null,w=null,L=null,I=null,V=null,N=null,O=null,T=new dt(0,0,0),B=0,Z=!1,z=null,Q=null,ee=null,he=null,j=null,Ae.set(0,0,s.canvas.width,s.canvas.height),Ce.set(0,0,s.canvas.width,s.canvas.height),c.reset(),h.reset(),p.reset()}return{buffers:{color:c,depth:h,stencil:p},enable:be,disable:K,bindFramebuffer:we,drawBuffers:Ze,useProgram:jt,setBlending:Lt,setMaterial:ut,setFlipSided:ln,setCullFace:Yt,setLineWidth:An,setPolygonOffset:W,setScissorTest:tn,activeTexture:mt,bindTexture:Ht,unbindTexture:De,compressedTexImage2D:Qt,compressedTexImage3D:U,texImage2D:fe,texImage3D:de,pixelStorei:Fe,getParameter:Ie,updateUBOMapping:it,uniformBlockBinding:at,texStorage2D:Ue,texStorage3D:Pe,texSubImage2D:b,texSubImage3D:te,compressedTexSubImage2D:ve,compressedTexSubImage3D:Te,scissor:Le,viewport:Ne,reset:_t}}function xR(s,e,i,r,l,c,h){const p=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new ot,_=new WeakMap,v=new Set;let g;const M=new WeakMap;let E=!1;try{E=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function C(U,b){return E?new OffscreenCanvas(U,b):du("canvas")}function y(U,b,te){let ve=1;const Te=Qt(U);if((Te.width>te||Te.height>te)&&(ve=te/Math.max(Te.width,Te.height)),ve<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const Ue=Math.floor(ve*Te.width),Pe=Math.floor(ve*Te.height);g===void 0&&(g=C(Ue,Pe));const fe=b?C(Ue,Pe):g;return fe.width=Ue,fe.height=Pe,fe.getContext("2d").drawImage(U,0,0,Ue,Pe),tt("WebGLRenderer: Texture has been resized from ("+Te.width+"x"+Te.height+") to ("+Ue+"x"+Pe+")."),fe}else return"data"in U&&tt("WebGLRenderer: Image in DataTexture is too big ("+Te.width+"x"+Te.height+")."),U;return U}function S(U){return U.generateMipmaps}function w(U){s.generateMipmap(U)}function L(U){return U.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?s.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function I(U,b,te,ve,Te,Ue=!1){if(U!==null){if(s[U]!==void 0)return s[U];tt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let Pe;ve&&(Pe=e.get("EXT_texture_norm16"),Pe||tt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let fe=b;if(b===s.RED&&(te===s.FLOAT&&(fe=s.R32F),te===s.HALF_FLOAT&&(fe=s.R16F),te===s.UNSIGNED_BYTE&&(fe=s.R8),te===s.UNSIGNED_SHORT&&Pe&&(fe=Pe.R16_EXT),te===s.SHORT&&Pe&&(fe=Pe.R16_SNORM_EXT)),b===s.RED_INTEGER&&(te===s.UNSIGNED_BYTE&&(fe=s.R8UI),te===s.UNSIGNED_SHORT&&(fe=s.R16UI),te===s.UNSIGNED_INT&&(fe=s.R32UI),te===s.BYTE&&(fe=s.R8I),te===s.SHORT&&(fe=s.R16I),te===s.INT&&(fe=s.R32I)),b===s.RG&&(te===s.FLOAT&&(fe=s.RG32F),te===s.HALF_FLOAT&&(fe=s.RG16F),te===s.UNSIGNED_BYTE&&(fe=s.RG8),te===s.UNSIGNED_SHORT&&Pe&&(fe=Pe.RG16_EXT),te===s.SHORT&&Pe&&(fe=Pe.RG16_SNORM_EXT)),b===s.RG_INTEGER&&(te===s.UNSIGNED_BYTE&&(fe=s.RG8UI),te===s.UNSIGNED_SHORT&&(fe=s.RG16UI),te===s.UNSIGNED_INT&&(fe=s.RG32UI),te===s.BYTE&&(fe=s.RG8I),te===s.SHORT&&(fe=s.RG16I),te===s.INT&&(fe=s.RG32I)),b===s.RGB_INTEGER&&(te===s.UNSIGNED_BYTE&&(fe=s.RGB8UI),te===s.UNSIGNED_SHORT&&(fe=s.RGB16UI),te===s.UNSIGNED_INT&&(fe=s.RGB32UI),te===s.BYTE&&(fe=s.RGB8I),te===s.SHORT&&(fe=s.RGB16I),te===s.INT&&(fe=s.RGB32I)),b===s.RGBA_INTEGER&&(te===s.UNSIGNED_BYTE&&(fe=s.RGBA8UI),te===s.UNSIGNED_SHORT&&(fe=s.RGBA16UI),te===s.UNSIGNED_INT&&(fe=s.RGBA32UI),te===s.BYTE&&(fe=s.RGBA8I),te===s.SHORT&&(fe=s.RGBA16I),te===s.INT&&(fe=s.RGBA32I)),b===s.RGB&&(te===s.UNSIGNED_SHORT&&Pe&&(fe=Pe.RGB16_EXT),te===s.SHORT&&Pe&&(fe=Pe.RGB16_SNORM_EXT),te===s.UNSIGNED_INT_5_9_9_9_REV&&(fe=s.RGB9_E5),te===s.UNSIGNED_INT_10F_11F_11F_REV&&(fe=s.R11F_G11F_B10F)),b===s.RGBA){const de=Ue?hu:Tt.getTransfer(Te);te===s.FLOAT&&(fe=s.RGBA32F),te===s.HALF_FLOAT&&(fe=s.RGBA16F),te===s.UNSIGNED_BYTE&&(fe=de===zt?s.SRGB8_ALPHA8:s.RGBA8),te===s.UNSIGNED_SHORT&&Pe&&(fe=Pe.RGBA16_EXT),te===s.SHORT&&Pe&&(fe=Pe.RGBA16_SNORM_EXT),te===s.UNSIGNED_SHORT_4_4_4_4&&(fe=s.RGBA4),te===s.UNSIGNED_SHORT_5_5_5_1&&(fe=s.RGB5_A1)}return(fe===s.R16F||fe===s.R32F||fe===s.RG16F||fe===s.RG32F||fe===s.RGBA16F||fe===s.RGBA32F)&&e.get("EXT_color_buffer_float"),fe}function V(U,b){let te;return U?b===null||b===Qi||b===ul?te=s.DEPTH24_STENCIL8:b===qi?te=s.DEPTH32F_STENCIL8:b===cl&&(te=s.DEPTH24_STENCIL8,tt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Qi||b===ul?te=s.DEPTH_COMPONENT24:b===qi?te=s.DEPTH_COMPONENT32F:b===cl&&(te=s.DEPTH_COMPONENT16),te}function N(U,b){return S(U)===!0||U.isFramebufferTexture&&U.minFilter!==Ln&&U.minFilter!==zn?Math.log2(Math.max(b.width,b.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?b.mipmaps.length:1}function O(U){const b=U.target;b.removeEventListener("dispose",O),B(b),b.isVideoTexture&&_.delete(b),b.isHTMLTexture&&v.delete(b)}function T(U){const b=U.target;b.removeEventListener("dispose",T),z(b)}function B(U){const b=r.get(U);if(b.__webglInit===void 0)return;const te=U.source,ve=M.get(te);if(ve){const Te=ve[b.__cacheKey];Te.usedTimes--,Te.usedTimes===0&&Z(U),Object.keys(ve).length===0&&M.delete(te)}r.remove(U)}function Z(U){const b=r.get(U);s.deleteTexture(b.__webglTexture);const te=U.source,ve=M.get(te);delete ve[b.__cacheKey],h.memory.textures--}function z(U){const b=r.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),r.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let ve=0;ve<6;ve++){if(Array.isArray(b.__webglFramebuffer[ve]))for(let Te=0;Te<b.__webglFramebuffer[ve].length;Te++)s.deleteFramebuffer(b.__webglFramebuffer[ve][Te]);else s.deleteFramebuffer(b.__webglFramebuffer[ve]);b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer[ve])}else{if(Array.isArray(b.__webglFramebuffer))for(let ve=0;ve<b.__webglFramebuffer.length;ve++)s.deleteFramebuffer(b.__webglFramebuffer[ve]);else s.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&s.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let ve=0;ve<b.__webglColorRenderbuffer.length;ve++)b.__webglColorRenderbuffer[ve]&&s.deleteRenderbuffer(b.__webglColorRenderbuffer[ve]);b.__webglDepthRenderbuffer&&s.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const te=U.textures;for(let ve=0,Te=te.length;ve<Te;ve++){const Ue=r.get(te[ve]);Ue.__webglTexture&&(s.deleteTexture(Ue.__webglTexture),h.memory.textures--),r.remove(te[ve])}r.remove(U)}let Q=0;function ee(){Q=0}function he(){return Q}function j(U){Q=U}function P(){const U=Q;return U>=l.maxTextures&&tt("WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+l.maxTextures),Q+=1,U}function H(U){const b=[];return b.push(U.wrapS),b.push(U.wrapT),b.push(U.wrapR||0),b.push(U.magFilter),b.push(U.minFilter),b.push(U.anisotropy),b.push(U.internalFormat),b.push(U.format),b.push(U.type),b.push(U.generateMipmaps),b.push(U.premultiplyAlpha),b.push(U.flipY),b.push(U.unpackAlignment),b.push(U.colorSpace),b.join()}function ne(U,b){const te=r.get(U);if(U.isVideoTexture&&Ht(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&te.__version!==U.version){const ve=U.image;if(ve===null)tt("WebGLRenderer: Texture marked for update but no image data found.");else if(ve.complete===!1)tt("WebGLRenderer: Texture marked for update but image is incomplete");else{K(te,U,b);return}}else U.isExternalTexture&&(te.__webglTexture=U.sourceTexture?U.sourceTexture:null);i.bindTexture(s.TEXTURE_2D,te.__webglTexture,s.TEXTURE0+b)}function pe(U,b){const te=r.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&te.__version!==U.version){K(te,U,b);return}else U.isExternalTexture&&(te.__webglTexture=U.sourceTexture?U.sourceTexture:null);i.bindTexture(s.TEXTURE_2D_ARRAY,te.__webglTexture,s.TEXTURE0+b)}function ye(U,b){const te=r.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&te.__version!==U.version){K(te,U,b);return}i.bindTexture(s.TEXTURE_3D,te.__webglTexture,s.TEXTURE0+b)}function F(U,b){const te=r.get(U);if(U.isCubeDepthTexture!==!0&&U.version>0&&te.__version!==U.version){we(te,U,b);return}i.bindTexture(s.TEXTURE_CUBE_MAP,te.__webglTexture,s.TEXTURE0+b)}const q={[wd]:s.REPEAT,[Ea]:s.CLAMP_TO_EDGE,[Dd]:s.MIRRORED_REPEAT},Se={[Ln]:s.NEAREST,[RM]:s.NEAREST_MIPMAP_NEAREST,[Ac]:s.NEAREST_MIPMAP_LINEAR,[zn]:s.LINEAR,[Ih]:s.LINEAR_MIPMAP_NEAREST,[Xs]:s.LINEAR_MIPMAP_LINEAR},Ae={[DM]:s.NEVER,[PM]:s.ALWAYS,[UM]:s.LESS,[Ep]:s.LEQUAL,[NM]:s.EQUAL,[Tp]:s.GEQUAL,[LM]:s.GREATER,[OM]:s.NOTEQUAL};function Ce(U,b){if(b.type===qi&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===zn||b.magFilter===Ih||b.magFilter===Ac||b.magFilter===Xs||b.minFilter===zn||b.minFilter===Ih||b.minFilter===Ac||b.minFilter===Xs)&&tt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(U,s.TEXTURE_WRAP_S,q[b.wrapS]),s.texParameteri(U,s.TEXTURE_WRAP_T,q[b.wrapT]),(U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY)&&s.texParameteri(U,s.TEXTURE_WRAP_R,q[b.wrapR]),s.texParameteri(U,s.TEXTURE_MAG_FILTER,Se[b.magFilter]),s.texParameteri(U,s.TEXTURE_MIN_FILTER,Se[b.minFilter]),b.compareFunction&&(s.texParameteri(U,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(U,s.TEXTURE_COMPARE_FUNC,Ae[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Ln||b.minFilter!==Ac&&b.minFilter!==Xs||b.type===qi&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||r.get(b).__currentAnisotropy){const te=e.get("EXT_texture_filter_anisotropic");s.texParameterf(U,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,l.getMaxAnisotropy())),r.get(b).__currentAnisotropy=b.anisotropy}}}function se(U,b){let te=!1;U.__webglInit===void 0&&(U.__webglInit=!0,b.addEventListener("dispose",O));const ve=b.source;let Te=M.get(ve);Te===void 0&&(Te={},M.set(ve,Te));const Ue=H(b);if(Ue!==U.__cacheKey){Te[Ue]===void 0&&(Te[Ue]={texture:s.createTexture(),usedTimes:0},h.memory.textures++,te=!0),Te[Ue].usedTimes++;const Pe=Te[U.__cacheKey];Pe!==void 0&&(Te[U.__cacheKey].usedTimes--,Pe.usedTimes===0&&Z(b)),U.__cacheKey=Ue,U.__webglTexture=Te[Ue].texture}return te}function Me(U,b,te){return Math.floor(Math.floor(U/te)/b)}function be(U,b,te,ve){const Ue=U.updateRanges;if(Ue.length===0)i.texSubImage2D(s.TEXTURE_2D,0,0,0,b.width,b.height,te,ve,b.data);else{Ue.sort((Fe,Le)=>Fe.start-Le.start);let Pe=0;for(let Fe=1;Fe<Ue.length;Fe++){const Le=Ue[Pe],Ne=Ue[Fe],it=Le.start+Le.count,at=Me(Ne.start,b.width,4),_t=Me(Le.start,b.width,4);Ne.start<=it+1&&at===_t&&Me(Ne.start+Ne.count-1,b.width,4)===at?Le.count=Math.max(Le.count,Ne.start+Ne.count-Le.start):(++Pe,Ue[Pe]=Ne)}Ue.length=Pe+1;const fe=i.getParameter(s.UNPACK_ROW_LENGTH),de=i.getParameter(s.UNPACK_SKIP_PIXELS),Ie=i.getParameter(s.UNPACK_SKIP_ROWS);i.pixelStorei(s.UNPACK_ROW_LENGTH,b.width);for(let Fe=0,Le=Ue.length;Fe<Le;Fe++){const Ne=Ue[Fe],it=Math.floor(Ne.start/4),at=Math.ceil(Ne.count/4),_t=it%b.width,k=Math.floor(it/b.width),Re=at,ge=1;i.pixelStorei(s.UNPACK_SKIP_PIXELS,_t),i.pixelStorei(s.UNPACK_SKIP_ROWS,k),i.texSubImage2D(s.TEXTURE_2D,0,_t,k,Re,ge,te,ve,b.data)}U.clearUpdateRanges(),i.pixelStorei(s.UNPACK_ROW_LENGTH,fe),i.pixelStorei(s.UNPACK_SKIP_PIXELS,de),i.pixelStorei(s.UNPACK_SKIP_ROWS,Ie)}}function K(U,b,te){let ve=s.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(ve=s.TEXTURE_2D_ARRAY),b.isData3DTexture&&(ve=s.TEXTURE_3D);const Te=se(U,b),Ue=b.source;i.bindTexture(ve,U.__webglTexture,s.TEXTURE0+te);const Pe=r.get(Ue);if(Ue.version!==Pe.__version||Te===!0){if(i.activeTexture(s.TEXTURE0+te),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){const ge=Tt.getPrimaries(Tt.workingColorSpace),He=b.colorSpace===fs?null:Tt.getPrimaries(b.colorSpace),Oe=b.colorSpace===fs||ge===He?s.NONE:s.BROWSER_DEFAULT_WEBGL;i.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Oe)}i.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment);let de=y(b.image,!1,l.maxTextureSize);de=De(b,de);const Ie=c.convert(b.format,b.colorSpace),Fe=c.convert(b.type);let Le=I(b.internalFormat,Ie,Fe,b.normalized,b.colorSpace,b.isVideoTexture);Ce(ve,b);let Ne;const it=b.mipmaps,at=b.isVideoTexture!==!0,_t=Pe.__version===void 0||Te===!0,k=Ue.dataReady,Re=N(b,de);if(b.isDepthTexture)Le=V(b.format===js,b.type),_t&&(at?i.texStorage2D(s.TEXTURE_2D,1,Le,de.width,de.height):i.texImage2D(s.TEXTURE_2D,0,Le,de.width,de.height,0,Ie,Fe,null));else if(b.isDataTexture)if(it.length>0){at&&_t&&i.texStorage2D(s.TEXTURE_2D,Re,Le,it[0].width,it[0].height);for(let ge=0,He=it.length;ge<He;ge++)Ne=it[ge],at?k&&i.texSubImage2D(s.TEXTURE_2D,ge,0,0,Ne.width,Ne.height,Ie,Fe,Ne.data):i.texImage2D(s.TEXTURE_2D,ge,Le,Ne.width,Ne.height,0,Ie,Fe,Ne.data);b.generateMipmaps=!1}else at?(_t&&i.texStorage2D(s.TEXTURE_2D,Re,Le,de.width,de.height),k&&be(b,de,Ie,Fe)):i.texImage2D(s.TEXTURE_2D,0,Le,de.width,de.height,0,Ie,Fe,de.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){at&&_t&&i.texStorage3D(s.TEXTURE_2D_ARRAY,Re,Le,it[0].width,it[0].height,de.depth);for(let ge=0,He=it.length;ge<He;ge++)if(Ne=it[ge],b.format!==Ii)if(Ie!==null)if(at){if(k)if(b.layerUpdates.size>0){const Oe=cv(Ne.width,Ne.height,b.format,b.type);for(const Ee of b.layerUpdates){const qe=Ne.data.subarray(Ee*Oe/Ne.data.BYTES_PER_ELEMENT,(Ee+1)*Oe/Ne.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,Ee,Ne.width,Ne.height,1,Ie,qe)}b.clearLayerUpdates()}else i.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,Ne.width,Ne.height,de.depth,Ie,Ne.data)}else i.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ge,Le,Ne.width,Ne.height,de.depth,0,Ne.data,0,0);else tt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else at?k&&i.texSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,Ne.width,Ne.height,de.depth,Ie,Fe,Ne.data):i.texImage3D(s.TEXTURE_2D_ARRAY,ge,Le,Ne.width,Ne.height,de.depth,0,Ie,Fe,Ne.data)}else{at&&_t&&i.texStorage2D(s.TEXTURE_2D,Re,Le,it[0].width,it[0].height);for(let ge=0,He=it.length;ge<He;ge++)Ne=it[ge],b.format!==Ii?Ie!==null?at?k&&i.compressedTexSubImage2D(s.TEXTURE_2D,ge,0,0,Ne.width,Ne.height,Ie,Ne.data):i.compressedTexImage2D(s.TEXTURE_2D,ge,Le,Ne.width,Ne.height,0,Ne.data):tt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):at?k&&i.texSubImage2D(s.TEXTURE_2D,ge,0,0,Ne.width,Ne.height,Ie,Fe,Ne.data):i.texImage2D(s.TEXTURE_2D,ge,Le,Ne.width,Ne.height,0,Ie,Fe,Ne.data)}else if(b.isDataArrayTexture)if(at){if(_t&&i.texStorage3D(s.TEXTURE_2D_ARRAY,Re,Le,de.width,de.height,de.depth),k)if(b.layerUpdates.size>0){const ge=cv(de.width,de.height,b.format,b.type);for(const He of b.layerUpdates){const Oe=de.data.subarray(He*ge/de.data.BYTES_PER_ELEMENT,(He+1)*ge/de.data.BYTES_PER_ELEMENT);i.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,He,de.width,de.height,1,Ie,Fe,Oe)}b.clearLayerUpdates()}else i.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,de.width,de.height,de.depth,Ie,Fe,de.data)}else i.texImage3D(s.TEXTURE_2D_ARRAY,0,Le,de.width,de.height,de.depth,0,Ie,Fe,de.data);else if(b.isData3DTexture)at?(_t&&i.texStorage3D(s.TEXTURE_3D,Re,Le,de.width,de.height,de.depth),k&&i.texSubImage3D(s.TEXTURE_3D,0,0,0,0,de.width,de.height,de.depth,Ie,Fe,de.data)):i.texImage3D(s.TEXTURE_3D,0,Le,de.width,de.height,de.depth,0,Ie,Fe,de.data);else if(b.isFramebufferTexture){if(_t)if(at)i.texStorage2D(s.TEXTURE_2D,Re,Le,de.width,de.height);else{let ge=de.width,He=de.height;for(let Oe=0;Oe<Re;Oe++)i.texImage2D(s.TEXTURE_2D,Oe,Le,ge,He,0,Ie,Fe,null),ge>>=1,He>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in s){const ge=s.canvas;if(ge.hasAttribute("layoutsubtree")||ge.setAttribute("layoutsubtree","true"),de.parentNode!==ge){ge.appendChild(de),v.add(b),ge.onpaint=nt=>{const nn=nt.changedElements;for(const Dt of v)nn.includes(Dt.image)&&(Dt.needsUpdate=!0)},ge.requestPaint();return}const He=0,Oe=s.RGBA,Ee=s.RGBA,qe=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,He,Oe,Ee,qe,de),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(it.length>0){if(at&&_t){const ge=Qt(it[0]);i.texStorage2D(s.TEXTURE_2D,Re,Le,ge.width,ge.height)}for(let ge=0,He=it.length;ge<He;ge++)Ne=it[ge],at?k&&i.texSubImage2D(s.TEXTURE_2D,ge,0,0,Ie,Fe,Ne):i.texImage2D(s.TEXTURE_2D,ge,Le,Ie,Fe,Ne);b.generateMipmaps=!1}else if(at){if(_t){const ge=Qt(de);i.texStorage2D(s.TEXTURE_2D,Re,Le,ge.width,ge.height)}k&&i.texSubImage2D(s.TEXTURE_2D,0,0,0,Ie,Fe,de)}else i.texImage2D(s.TEXTURE_2D,0,Le,Ie,Fe,de);S(b)&&w(ve),Pe.__version=Ue.version,b.onUpdate&&b.onUpdate(b)}U.__version=b.version}function we(U,b,te){if(b.image.length!==6)return;const ve=se(U,b),Te=b.source;i.bindTexture(s.TEXTURE_CUBE_MAP,U.__webglTexture,s.TEXTURE0+te);const Ue=r.get(Te);if(Te.version!==Ue.__version||ve===!0){i.activeTexture(s.TEXTURE0+te);const Pe=Tt.getPrimaries(Tt.workingColorSpace),fe=b.colorSpace===fs?null:Tt.getPrimaries(b.colorSpace),de=b.colorSpace===fs||Pe===fe?s.NONE:s.BROWSER_DEFAULT_WEBGL;i.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,de);const Ie=b.isCompressedTexture||b.image[0].isCompressedTexture,Fe=b.image[0]&&b.image[0].isDataTexture,Le=[];for(let Ee=0;Ee<6;Ee++)!Ie&&!Fe?Le[Ee]=y(b.image[Ee],!0,l.maxCubemapSize):Le[Ee]=Fe?b.image[Ee].image:b.image[Ee],Le[Ee]=De(b,Le[Ee]);const Ne=Le[0],it=c.convert(b.format,b.colorSpace),at=c.convert(b.type),_t=I(b.internalFormat,it,at,b.normalized,b.colorSpace),k=b.isVideoTexture!==!0,Re=Ue.__version===void 0||ve===!0,ge=Te.dataReady;let He=N(b,Ne);Ce(s.TEXTURE_CUBE_MAP,b);let Oe;if(Ie){k&&Re&&i.texStorage2D(s.TEXTURE_CUBE_MAP,He,_t,Ne.width,Ne.height);for(let Ee=0;Ee<6;Ee++){Oe=Le[Ee].mipmaps;for(let qe=0;qe<Oe.length;qe++){const nt=Oe[qe];b.format!==Ii?it!==null?k?ge&&i.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,qe,0,0,nt.width,nt.height,it,nt.data):i.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,qe,_t,nt.width,nt.height,0,nt.data):tt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?ge&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,qe,0,0,nt.width,nt.height,it,at,nt.data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,qe,_t,nt.width,nt.height,0,it,at,nt.data)}}}else{if(Oe=b.mipmaps,k&&Re){Oe.length>0&&He++;const Ee=Qt(Le[0]);i.texStorage2D(s.TEXTURE_CUBE_MAP,He,_t,Ee.width,Ee.height)}for(let Ee=0;Ee<6;Ee++)if(Fe){k?ge&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,0,0,Le[Ee].width,Le[Ee].height,it,at,Le[Ee].data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,_t,Le[Ee].width,Le[Ee].height,0,it,at,Le[Ee].data);for(let qe=0;qe<Oe.length;qe++){const nn=Oe[qe].image[Ee].image;k?ge&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,qe+1,0,0,nn.width,nn.height,it,at,nn.data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,qe+1,_t,nn.width,nn.height,0,it,at,nn.data)}}else{k?ge&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,0,0,it,at,Le[Ee]):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,_t,it,at,Le[Ee]);for(let qe=0;qe<Oe.length;qe++){const nt=Oe[qe];k?ge&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,qe+1,0,0,it,at,nt.image[Ee]):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,qe+1,_t,it,at,nt.image[Ee])}}}S(b)&&w(s.TEXTURE_CUBE_MAP),Ue.__version=Te.version,b.onUpdate&&b.onUpdate(b)}U.__version=b.version}function Ze(U,b,te,ve,Te,Ue){const Pe=c.convert(te.format,te.colorSpace),fe=c.convert(te.type),de=I(te.internalFormat,Pe,fe,te.normalized,te.colorSpace),Ie=r.get(b),Fe=r.get(te);if(Fe.__renderTarget=b,!Ie.__hasExternalTextures){const Le=Math.max(1,b.width>>Ue),Ne=Math.max(1,b.height>>Ue);Te===s.TEXTURE_3D||Te===s.TEXTURE_2D_ARRAY?i.texImage3D(Te,Ue,de,Le,Ne,b.depth,0,Pe,fe,null):i.texImage2D(Te,Ue,de,Le,Ne,0,Pe,fe,null)}i.bindFramebuffer(s.FRAMEBUFFER,U),mt(b)?p.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ve,Te,Fe.__webglTexture,0,tn(b)):(Te===s.TEXTURE_2D||Te>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Te<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,ve,Te,Fe.__webglTexture,Ue),i.bindFramebuffer(s.FRAMEBUFFER,null)}function jt(U,b,te){if(s.bindRenderbuffer(s.RENDERBUFFER,U),b.depthBuffer){const ve=b.depthTexture,Te=ve&&ve.isDepthTexture?ve.type:null,Ue=V(b.stencilBuffer,Te),Pe=b.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;mt(b)?p.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,tn(b),Ue,b.width,b.height):te?s.renderbufferStorageMultisample(s.RENDERBUFFER,tn(b),Ue,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,Ue,b.width,b.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Pe,s.RENDERBUFFER,U)}else{const ve=b.textures;for(let Te=0;Te<ve.length;Te++){const Ue=ve[Te],Pe=c.convert(Ue.format,Ue.colorSpace),fe=c.convert(Ue.type),de=I(Ue.internalFormat,Pe,fe,Ue.normalized,Ue.colorSpace);mt(b)?p.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,tn(b),de,b.width,b.height):te?s.renderbufferStorageMultisample(s.RENDERBUFFER,tn(b),de,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,de,b.width,b.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function pt(U,b,te){const ve=b.isWebGLCubeRenderTarget===!0;if(i.bindFramebuffer(s.FRAMEBUFFER,U),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Te=r.get(b.depthTexture);if(Te.__renderTarget=b,(!Te.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),ve){if(Te.__webglInit===void 0&&(Te.__webglInit=!0,b.depthTexture.addEventListener("dispose",O)),Te.__webglTexture===void 0){Te.__webglTexture=s.createTexture(),i.bindTexture(s.TEXTURE_CUBE_MAP,Te.__webglTexture),Ce(s.TEXTURE_CUBE_MAP,b.depthTexture);const Ie=c.convert(b.depthTexture.format),Fe=c.convert(b.depthTexture.type);let Le;b.depthTexture.format===Ca?Le=s.DEPTH_COMPONENT24:b.depthTexture.format===js&&(Le=s.DEPTH24_STENCIL8);for(let Ne=0;Ne<6;Ne++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ne,0,Le,b.width,b.height,0,Ie,Fe,null)}}else ne(b.depthTexture,0);const Ue=Te.__webglTexture,Pe=tn(b),fe=ve?s.TEXTURE_CUBE_MAP_POSITIVE_X+te:s.TEXTURE_2D,de=b.depthTexture.format===js?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(b.depthTexture.format===Ca)mt(b)?p.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,de,fe,Ue,0,Pe):s.framebufferTexture2D(s.FRAMEBUFFER,de,fe,Ue,0);else if(b.depthTexture.format===js)mt(b)?p.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,de,fe,Ue,0,Pe):s.framebufferTexture2D(s.FRAMEBUFFER,de,fe,Ue,0);else throw new Error("Unknown depthTexture format")}function yt(U){const b=r.get(U),te=U.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==U.depthTexture){const ve=U.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),ve){const Te=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,ve.removeEventListener("dispose",Te)};ve.addEventListener("dispose",Te),b.__depthDisposeCallback=Te}b.__boundDepthTexture=ve}if(U.depthTexture&&!b.__autoAllocateDepthBuffer)if(te)for(let ve=0;ve<6;ve++)pt(b.__webglFramebuffer[ve],U,ve);else{const ve=U.texture.mipmaps;ve&&ve.length>0?pt(b.__webglFramebuffer[0],U,0):pt(b.__webglFramebuffer,U,0)}else if(te){b.__webglDepthbuffer=[];for(let ve=0;ve<6;ve++)if(i.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[ve]),b.__webglDepthbuffer[ve]===void 0)b.__webglDepthbuffer[ve]=s.createRenderbuffer(),jt(b.__webglDepthbuffer[ve],U,!1);else{const Te=U.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ue=b.__webglDepthbuffer[ve];s.bindRenderbuffer(s.RENDERBUFFER,Ue),s.framebufferRenderbuffer(s.FRAMEBUFFER,Te,s.RENDERBUFFER,Ue)}}else{const ve=U.texture.mipmaps;if(ve&&ve.length>0?i.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[0]):i.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=s.createRenderbuffer(),jt(b.__webglDepthbuffer,U,!1);else{const Te=U.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ue=b.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Ue),s.framebufferRenderbuffer(s.FRAMEBUFFER,Te,s.RENDERBUFFER,Ue)}}i.bindFramebuffer(s.FRAMEBUFFER,null)}function Lt(U,b,te){const ve=r.get(U);b!==void 0&&Ze(ve.__webglFramebuffer,U,U.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),te!==void 0&&yt(U)}function ut(U){const b=U.texture,te=r.get(U),ve=r.get(b);U.addEventListener("dispose",T);const Te=U.textures,Ue=U.isWebGLCubeRenderTarget===!0,Pe=Te.length>1;if(Pe||(ve.__webglTexture===void 0&&(ve.__webglTexture=s.createTexture()),ve.__version=b.version,h.memory.textures++),Ue){te.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(b.mipmaps&&b.mipmaps.length>0){te.__webglFramebuffer[fe]=[];for(let de=0;de<b.mipmaps.length;de++)te.__webglFramebuffer[fe][de]=s.createFramebuffer()}else te.__webglFramebuffer[fe]=s.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){te.__webglFramebuffer=[];for(let fe=0;fe<b.mipmaps.length;fe++)te.__webglFramebuffer[fe]=s.createFramebuffer()}else te.__webglFramebuffer=s.createFramebuffer();if(Pe)for(let fe=0,de=Te.length;fe<de;fe++){const Ie=r.get(Te[fe]);Ie.__webglTexture===void 0&&(Ie.__webglTexture=s.createTexture(),h.memory.textures++)}if(U.samples>0&&mt(U)===!1){te.__webglMultisampledFramebuffer=s.createFramebuffer(),te.__webglColorRenderbuffer=[],i.bindFramebuffer(s.FRAMEBUFFER,te.__webglMultisampledFramebuffer);for(let fe=0;fe<Te.length;fe++){const de=Te[fe];te.__webglColorRenderbuffer[fe]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,te.__webglColorRenderbuffer[fe]);const Ie=c.convert(de.format,de.colorSpace),Fe=c.convert(de.type),Le=I(de.internalFormat,Ie,Fe,de.normalized,de.colorSpace,U.isXRRenderTarget===!0),Ne=tn(U);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ne,Le,U.width,U.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.RENDERBUFFER,te.__webglColorRenderbuffer[fe])}s.bindRenderbuffer(s.RENDERBUFFER,null),U.depthBuffer&&(te.__webglDepthRenderbuffer=s.createRenderbuffer(),jt(te.__webglDepthRenderbuffer,U,!0)),i.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Ue){i.bindTexture(s.TEXTURE_CUBE_MAP,ve.__webglTexture),Ce(s.TEXTURE_CUBE_MAP,b);for(let fe=0;fe<6;fe++)if(b.mipmaps&&b.mipmaps.length>0)for(let de=0;de<b.mipmaps.length;de++)Ze(te.__webglFramebuffer[fe][de],U,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+fe,de);else Ze(te.__webglFramebuffer[fe],U,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);S(b)&&w(s.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Pe){for(let fe=0,de=Te.length;fe<de;fe++){const Ie=Te[fe],Fe=r.get(Ie);let Le=s.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Le=U.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),i.bindTexture(Le,Fe.__webglTexture),Ce(Le,Ie),Ze(te.__webglFramebuffer,U,Ie,s.COLOR_ATTACHMENT0+fe,Le,0),S(Ie)&&w(Le)}i.unbindTexture()}else{let fe=s.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(fe=U.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),i.bindTexture(fe,ve.__webglTexture),Ce(fe,b),b.mipmaps&&b.mipmaps.length>0)for(let de=0;de<b.mipmaps.length;de++)Ze(te.__webglFramebuffer[de],U,b,s.COLOR_ATTACHMENT0,fe,de);else Ze(te.__webglFramebuffer,U,b,s.COLOR_ATTACHMENT0,fe,0);S(b)&&w(fe),i.unbindTexture()}U.depthBuffer&&yt(U)}function ln(U){const b=U.textures;for(let te=0,ve=b.length;te<ve;te++){const Te=b[te];if(S(Te)){const Ue=L(U),Pe=r.get(Te).__webglTexture;i.bindTexture(Ue,Pe),w(Ue),i.unbindTexture()}}}const Yt=[],An=[];function W(U){if(U.samples>0){if(mt(U)===!1){const b=U.textures,te=U.width,ve=U.height;let Te=s.COLOR_BUFFER_BIT;const Ue=U.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Pe=r.get(U),fe=b.length>1;if(fe)for(let Ie=0;Ie<b.length;Ie++)i.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ie,s.RENDERBUFFER,null),i.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ie,s.TEXTURE_2D,null,0);i.bindFramebuffer(s.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer);const de=U.texture.mipmaps;de&&de.length>0?i.bindFramebuffer(s.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer[0]):i.bindFramebuffer(s.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let Ie=0;Ie<b.length;Ie++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(Te|=s.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(Te|=s.STENCIL_BUFFER_BIT)),fe){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ie]);const Fe=r.get(b[Ie]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Fe,0)}s.blitFramebuffer(0,0,te,ve,0,0,te,ve,Te,s.NEAREST),m===!0&&(Yt.length=0,An.length=0,Yt.push(s.COLOR_ATTACHMENT0+Ie),U.depthBuffer&&U.resolveDepthBuffer===!1&&(Yt.push(Ue),An.push(Ue),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,An)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Yt))}if(i.bindFramebuffer(s.READ_FRAMEBUFFER,null),i.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),fe)for(let Ie=0;Ie<b.length;Ie++){i.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ie,s.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ie]);const Fe=r.get(b[Ie]).__webglTexture;i.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ie,s.TEXTURE_2D,Fe,0)}i.bindFramebuffer(s.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&m){const b=U.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[b])}}}function tn(U){return Math.min(l.maxSamples,U.samples)}function mt(U){const b=r.get(U);return U.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function Ht(U){const b=h.render.frame;_.get(U)!==b&&(_.set(U,b),U.update())}function De(U,b){const te=U.colorSpace,ve=U.format,Te=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||te!==fu&&te!==fs&&(Tt.getTransfer(te)===zt?(ve!==Ii||Te!==di)&&tt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):At("WebGLTextures: Unsupported texture color space:",te)),b}function Qt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(d.width=U.naturalWidth||U.width,d.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(d.width=U.displayWidth,d.height=U.displayHeight):(d.width=U.width,d.height=U.height),d}this.allocateTextureUnit=P,this.resetTextureUnits=ee,this.getTextureUnits=he,this.setTextureUnits=j,this.setTexture2D=ne,this.setTexture2DArray=pe,this.setTexture3D=ye,this.setTextureCube=F,this.rebindTextures=Lt,this.setupRenderTarget=ut,this.updateRenderTargetMipmap=ln,this.updateMultisampleRenderTarget=W,this.setupDepthRenderbuffer=yt,this.setupFrameBufferTexture=Ze,this.useMultisampledRTT=mt,this.isReversedDepthBuffer=function(){return i.buffers.depth.getReversed()}}function SR(s,e){function i(r,l=fs){let c;const h=Tt.getTransfer(l);if(r===di)return s.UNSIGNED_BYTE;if(r===xp)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Sp)return s.UNSIGNED_SHORT_5_5_5_1;if(r===$v)return s.UNSIGNED_INT_5_9_9_9_REV;if(r===ex)return s.UNSIGNED_INT_10F_11F_11F_REV;if(r===Qv)return s.BYTE;if(r===Jv)return s.SHORT;if(r===cl)return s.UNSIGNED_SHORT;if(r===vp)return s.INT;if(r===Qi)return s.UNSIGNED_INT;if(r===qi)return s.FLOAT;if(r===Ra)return s.HALF_FLOAT;if(r===tx)return s.ALPHA;if(r===nx)return s.RGB;if(r===Ii)return s.RGBA;if(r===Ca)return s.DEPTH_COMPONENT;if(r===js)return s.DEPTH_STENCIL;if(r===ix)return s.RED;if(r===yp)return s.RED_INTEGER;if(r===Ys)return s.RG;if(r===Mp)return s.RG_INTEGER;if(r===bp)return s.RGBA_INTEGER;if(r===iu||r===au||r===su||r===ru)if(h===zt)if(c=e.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(r===iu)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===au)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===su)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ru)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=e.get("WEBGL_compressed_texture_s3tc"),c!==null){if(r===iu)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===au)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===su)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ru)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ud||r===Nd||r===Ld||r===Od)if(c=e.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(r===Ud)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Nd)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Ld)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Od)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Pd||r===Id||r===Fd||r===Bd||r===zd||r===cu||r===Hd)if(c=e.get("WEBGL_compressed_texture_etc"),c!==null){if(r===Pd||r===Id)return h===zt?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(r===Fd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC;if(r===Bd)return c.COMPRESSED_R11_EAC;if(r===zd)return c.COMPRESSED_SIGNED_R11_EAC;if(r===cu)return c.COMPRESSED_RG11_EAC;if(r===Hd)return c.COMPRESSED_SIGNED_RG11_EAC}else return null;if(r===Gd||r===Vd||r===kd||r===Xd||r===jd||r===Wd||r===qd||r===Yd||r===Zd||r===Kd||r===Qd||r===Jd||r===$d||r===ep)if(c=e.get("WEBGL_compressed_texture_astc"),c!==null){if(r===Gd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Vd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===kd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Xd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===jd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Wd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===qd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Yd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Zd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Kd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Qd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Jd)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===$d)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===ep)return h===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===tp||r===np||r===ip)if(c=e.get("EXT_texture_compression_bptc"),c!==null){if(r===tp)return h===zt?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===np)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===ip)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===ap||r===sp||r===uu||r===rp)if(c=e.get("EXT_texture_compression_rgtc"),c!==null){if(r===ap)return c.COMPRESSED_RED_RGTC1_EXT;if(r===sp)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===uu)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===rp)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ul?s.UNSIGNED_INT_24_8:s[r]!==void 0?s[r]:null}return{convert:i}}const yR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,MR=`
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

}`;class bR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,i){if(this.texture===null){const r=new dx(e.texture);(e.depthNear!==i.depthNear||e.depthFar!==i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const i=e.cameras[0].viewport,r=new Ji({vertexShader:yR,fragmentShader:MR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new Fi(new ml(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ER extends _s{constructor(e,i){super();const r=this;let l=null,c=1,h=null,p="local-floor",m=1,d=null,_=null,v=null,g=null,M=null,E=null;const C=typeof XRWebGLBinding<"u",y=new bR,S={},w=i.getContextAttributes();let L=null,I=null;const V=[],N=[],O=new ot;let T=null;const B=new Ai;B.viewport=new rn;const Z=new Ai;Z.viewport=new rn;const z=[B,Z],Q=new Lb;let ee=null,he=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(se){let Me=V[se];return Me===void 0&&(Me=new kh,V[se]=Me),Me.getTargetRaySpace()},this.getControllerGrip=function(se){let Me=V[se];return Me===void 0&&(Me=new kh,V[se]=Me),Me.getGripSpace()},this.getHand=function(se){let Me=V[se];return Me===void 0&&(Me=new kh,V[se]=Me),Me.getHandSpace()};function j(se){const Me=N.indexOf(se.inputSource);if(Me===-1)return;const be=V[Me];be!==void 0&&(be.update(se.inputSource,se.frame,d||h),be.dispatchEvent({type:se.type,data:se.inputSource}))}function P(){l.removeEventListener("select",j),l.removeEventListener("selectstart",j),l.removeEventListener("selectend",j),l.removeEventListener("squeeze",j),l.removeEventListener("squeezestart",j),l.removeEventListener("squeezeend",j),l.removeEventListener("end",P),l.removeEventListener("inputsourceschange",H);for(let se=0;se<V.length;se++){const Me=N[se];Me!==null&&(N[se]=null,V[se].disconnect(Me))}ee=null,he=null,y.reset();for(const se in S)delete S[se];e.setRenderTarget(L),M=null,g=null,v=null,l=null,I=null,Ce.stop(),r.isPresenting=!1,e.setPixelRatio(T),e.setSize(O.width,O.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(se){c=se,r.isPresenting===!0&&tt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(se){p=se,r.isPresenting===!0&&tt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||h},this.setReferenceSpace=function(se){d=se},this.getBaseLayer=function(){return g!==null?g:M},this.getBinding=function(){return v===null&&C&&(v=new XRWebGLBinding(l,i)),v},this.getFrame=function(){return E},this.getSession=function(){return l},this.setSession=async function(se){if(l=se,l!==null){if(L=e.getRenderTarget(),l.addEventListener("select",j),l.addEventListener("selectstart",j),l.addEventListener("selectend",j),l.addEventListener("squeeze",j),l.addEventListener("squeezestart",j),l.addEventListener("squeezeend",j),l.addEventListener("end",P),l.addEventListener("inputsourceschange",H),w.xrCompatible!==!0&&await i.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(O),C&&"createProjectionLayer"in XRWebGLBinding.prototype){let be=null,K=null,we=null;w.depth&&(we=w.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,be=w.stencil?js:Ca,K=w.stencil?ul:Qi);const Ze={colorFormat:i.RGBA8,depthFormat:we,scaleFactor:c};v=this.getBinding(),g=v.createProjectionLayer(Ze),l.updateRenderState({layers:[g]}),e.setPixelRatio(1),e.setSize(g.textureWidth,g.textureHeight,!1),I=new Ki(g.textureWidth,g.textureHeight,{format:Ii,type:di,depthTexture:new Qr(g.textureWidth,g.textureHeight,K,void 0,void 0,void 0,void 0,void 0,void 0,be),stencilBuffer:w.stencil,colorSpace:e.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1})}else{const be={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:c};M=new XRWebGLLayer(l,i,be),l.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),I=new Ki(M.framebufferWidth,M.framebufferHeight,{format:Ii,type:di,colorSpace:e.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:M.ignoreDepthValues===!1,resolveStencilBuffer:M.ignoreDepthValues===!1})}I.isXRRenderTarget=!0,this.setFoveation(m),d=null,h=await l.requestReferenceSpace(p),Ce.setContext(l),Ce.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function H(se){for(let Me=0;Me<se.removed.length;Me++){const be=se.removed[Me],K=N.indexOf(be);K>=0&&(N[K]=null,V[K].disconnect(be))}for(let Me=0;Me<se.added.length;Me++){const be=se.added[Me];let K=N.indexOf(be);if(K===-1){for(let Ze=0;Ze<V.length;Ze++)if(Ze>=N.length){N.push(be),K=Ze;break}else if(N[Ze]===null){N[Ze]=be,K=Ze;break}if(K===-1)break}const we=V[K];we&&we.connect(be)}}const ne=new $,pe=new $;function ye(se,Me,be){ne.setFromMatrixPosition(Me.matrixWorld),pe.setFromMatrixPosition(be.matrixWorld);const K=ne.distanceTo(pe),we=Me.projectionMatrix.elements,Ze=be.projectionMatrix.elements,jt=we[14]/(we[10]-1),pt=we[14]/(we[10]+1),yt=(we[9]+1)/we[5],Lt=(we[9]-1)/we[5],ut=(we[8]-1)/we[0],ln=(Ze[8]+1)/Ze[0],Yt=jt*ut,An=jt*ln,W=K/(-ut+ln),tn=W*-ut;if(Me.matrixWorld.decompose(se.position,se.quaternion,se.scale),se.translateX(tn),se.translateZ(W),se.matrixWorld.compose(se.position,se.quaternion,se.scale),se.matrixWorldInverse.copy(se.matrixWorld).invert(),we[10]===-1)se.projectionMatrix.copy(Me.projectionMatrix),se.projectionMatrixInverse.copy(Me.projectionMatrixInverse);else{const mt=jt+W,Ht=pt+W,De=Yt-tn,Qt=An+(K-tn),U=yt*pt/Ht*mt,b=Lt*pt/Ht*mt;se.projectionMatrix.makePerspective(De,Qt,U,b,mt,Ht),se.projectionMatrixInverse.copy(se.projectionMatrix).invert()}}function F(se,Me){Me===null?se.matrixWorld.copy(se.matrix):se.matrixWorld.multiplyMatrices(Me.matrixWorld,se.matrix),se.matrixWorldInverse.copy(se.matrixWorld).invert()}this.updateCamera=function(se){if(l===null)return;let Me=se.near,be=se.far;y.texture!==null&&(y.depthNear>0&&(Me=y.depthNear),y.depthFar>0&&(be=y.depthFar)),Q.near=Z.near=B.near=Me,Q.far=Z.far=B.far=be,(ee!==Q.near||he!==Q.far)&&(l.updateRenderState({depthNear:Q.near,depthFar:Q.far}),ee=Q.near,he=Q.far),Q.layers.mask=se.layers.mask|6,B.layers.mask=Q.layers.mask&-5,Z.layers.mask=Q.layers.mask&-3;const K=se.parent,we=Q.cameras;F(Q,K);for(let Ze=0;Ze<we.length;Ze++)F(we[Ze],K);we.length===2?ye(Q,B,Z):Q.projectionMatrix.copy(B.projectionMatrix),q(se,Q,K)};function q(se,Me,be){be===null?se.matrix.copy(Me.matrixWorld):(se.matrix.copy(be.matrixWorld),se.matrix.invert(),se.matrix.multiply(Me.matrixWorld)),se.matrix.decompose(se.position,se.quaternion,se.scale),se.updateMatrixWorld(!0),se.projectionMatrix.copy(Me.projectionMatrix),se.projectionMatrixInverse.copy(Me.projectionMatrixInverse),se.isPerspectiveCamera&&(se.fov=cp*2*Math.atan(1/se.projectionMatrix.elements[5]),se.zoom=1)}this.getCamera=function(){return Q},this.getFoveation=function(){if(!(g===null&&M===null))return m},this.setFoveation=function(se){m=se,g!==null&&(g.fixedFoveation=se),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=se)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(Q)},this.getCameraTexture=function(se){return S[se]};let Se=null;function Ae(se,Me){if(_=Me.getViewerPose(d||h),E=Me,_!==null){const be=_.views;M!==null&&(e.setRenderTargetFramebuffer(I,M.framebuffer),e.setRenderTarget(I));let K=!1;be.length!==Q.cameras.length&&(Q.cameras.length=0,K=!0);for(let pt=0;pt<be.length;pt++){const yt=be[pt];let Lt=null;if(M!==null)Lt=M.getViewport(yt);else{const ln=v.getViewSubImage(g,yt);Lt=ln.viewport,pt===0&&(e.setRenderTargetTextures(I,ln.colorTexture,ln.depthStencilTexture),e.setRenderTarget(I))}let ut=z[pt];ut===void 0&&(ut=new Ai,ut.layers.enable(pt),ut.viewport=new rn,z[pt]=ut),ut.matrix.fromArray(yt.transform.matrix),ut.matrix.decompose(ut.position,ut.quaternion,ut.scale),ut.projectionMatrix.fromArray(yt.projectionMatrix),ut.projectionMatrixInverse.copy(ut.projectionMatrix).invert(),ut.viewport.set(Lt.x,Lt.y,Lt.width,Lt.height),pt===0&&(Q.matrix.copy(ut.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale)),K===!0&&Q.cameras.push(ut)}const we=l.enabledFeatures;if(we&&we.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&C){v=r.getBinding();const pt=v.getDepthInformation(be[0]);pt&&pt.isValid&&pt.texture&&y.init(pt,l.renderState)}if(we&&we.includes("camera-access")&&C){e.state.unbindTexture(),v=r.getBinding();for(let pt=0;pt<be.length;pt++){const yt=be[pt].camera;if(yt){let Lt=S[yt];Lt||(Lt=new dx,S[yt]=Lt);const ut=v.getCameraImage(yt);Lt.sourceTexture=ut}}}}for(let be=0;be<V.length;be++){const K=N[be],we=V[be];K!==null&&we!==void 0&&we.update(K,Me,d||h)}Se&&Se(se,Me),Me.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:Me}),E=null}const Ce=new _x;Ce.setAnimationLoop(Ae),this.setAnimationLoop=function(se){Se=se},this.dispose=function(){}}}const TR=new on,Ex=new rt;Ex.set(-1,0,0,0,1,0,0,0,1);function AR(s,e){function i(y,S){y.matrixAutoUpdate===!0&&y.updateMatrix(),S.value.copy(y.matrix)}function r(y,S){S.color.getRGB(y.fogColor.value,px(s)),S.isFog?(y.fogNear.value=S.near,y.fogFar.value=S.far):S.isFogExp2&&(y.fogDensity.value=S.density)}function l(y,S,w,L,I){S.isNodeMaterial?S.uniformsNeedUpdate=!1:S.isMeshBasicMaterial?c(y,S):S.isMeshLambertMaterial?(c(y,S),S.envMap&&(y.envMapIntensity.value=S.envMapIntensity)):S.isMeshToonMaterial?(c(y,S),v(y,S)):S.isMeshPhongMaterial?(c(y,S),_(y,S),S.envMap&&(y.envMapIntensity.value=S.envMapIntensity)):S.isMeshStandardMaterial?(c(y,S),g(y,S),S.isMeshPhysicalMaterial&&M(y,S,I)):S.isMeshMatcapMaterial?(c(y,S),E(y,S)):S.isMeshDepthMaterial?c(y,S):S.isMeshDistanceMaterial?(c(y,S),C(y,S)):S.isMeshNormalMaterial?c(y,S):S.isLineBasicMaterial?(h(y,S),S.isLineDashedMaterial&&p(y,S)):S.isPointsMaterial?m(y,S,w,L):S.isSpriteMaterial?d(y,S):S.isShadowMaterial?(y.color.value.copy(S.color),y.opacity.value=S.opacity):S.isShaderMaterial&&(S.uniformsNeedUpdate=!1)}function c(y,S){y.opacity.value=S.opacity,S.color&&y.diffuse.value.copy(S.color),S.emissive&&y.emissive.value.copy(S.emissive).multiplyScalar(S.emissiveIntensity),S.map&&(y.map.value=S.map,i(S.map,y.mapTransform)),S.alphaMap&&(y.alphaMap.value=S.alphaMap,i(S.alphaMap,y.alphaMapTransform)),S.bumpMap&&(y.bumpMap.value=S.bumpMap,i(S.bumpMap,y.bumpMapTransform),y.bumpScale.value=S.bumpScale,S.side===$n&&(y.bumpScale.value*=-1)),S.normalMap&&(y.normalMap.value=S.normalMap,i(S.normalMap,y.normalMapTransform),y.normalScale.value.copy(S.normalScale),S.side===$n&&y.normalScale.value.negate()),S.displacementMap&&(y.displacementMap.value=S.displacementMap,i(S.displacementMap,y.displacementMapTransform),y.displacementScale.value=S.displacementScale,y.displacementBias.value=S.displacementBias),S.emissiveMap&&(y.emissiveMap.value=S.emissiveMap,i(S.emissiveMap,y.emissiveMapTransform)),S.specularMap&&(y.specularMap.value=S.specularMap,i(S.specularMap,y.specularMapTransform)),S.alphaTest>0&&(y.alphaTest.value=S.alphaTest);const w=e.get(S),L=w.envMap,I=w.envMapRotation;L&&(y.envMap.value=L,y.envMapRotation.value.setFromMatrix4(TR.makeRotationFromEuler(I)).transpose(),L.isCubeTexture&&L.isRenderTargetTexture===!1&&y.envMapRotation.value.premultiply(Ex),y.reflectivity.value=S.reflectivity,y.ior.value=S.ior,y.refractionRatio.value=S.refractionRatio),S.lightMap&&(y.lightMap.value=S.lightMap,y.lightMapIntensity.value=S.lightMapIntensity,i(S.lightMap,y.lightMapTransform)),S.aoMap&&(y.aoMap.value=S.aoMap,y.aoMapIntensity.value=S.aoMapIntensity,i(S.aoMap,y.aoMapTransform))}function h(y,S){y.diffuse.value.copy(S.color),y.opacity.value=S.opacity,S.map&&(y.map.value=S.map,i(S.map,y.mapTransform))}function p(y,S){y.dashSize.value=S.dashSize,y.totalSize.value=S.dashSize+S.gapSize,y.scale.value=S.scale}function m(y,S,w,L){y.diffuse.value.copy(S.color),y.opacity.value=S.opacity,y.size.value=S.size*w,y.scale.value=L*.5,S.map&&(y.map.value=S.map,i(S.map,y.uvTransform)),S.alphaMap&&(y.alphaMap.value=S.alphaMap,i(S.alphaMap,y.alphaMapTransform)),S.alphaTest>0&&(y.alphaTest.value=S.alphaTest)}function d(y,S){y.diffuse.value.copy(S.color),y.opacity.value=S.opacity,y.rotation.value=S.rotation,S.map&&(y.map.value=S.map,i(S.map,y.mapTransform)),S.alphaMap&&(y.alphaMap.value=S.alphaMap,i(S.alphaMap,y.alphaMapTransform)),S.alphaTest>0&&(y.alphaTest.value=S.alphaTest)}function _(y,S){y.specular.value.copy(S.specular),y.shininess.value=Math.max(S.shininess,1e-4)}function v(y,S){S.gradientMap&&(y.gradientMap.value=S.gradientMap)}function g(y,S){y.metalness.value=S.metalness,S.metalnessMap&&(y.metalnessMap.value=S.metalnessMap,i(S.metalnessMap,y.metalnessMapTransform)),y.roughness.value=S.roughness,S.roughnessMap&&(y.roughnessMap.value=S.roughnessMap,i(S.roughnessMap,y.roughnessMapTransform)),S.envMap&&(y.envMapIntensity.value=S.envMapIntensity)}function M(y,S,w){y.ior.value=S.ior,S.sheen>0&&(y.sheenColor.value.copy(S.sheenColor).multiplyScalar(S.sheen),y.sheenRoughness.value=S.sheenRoughness,S.sheenColorMap&&(y.sheenColorMap.value=S.sheenColorMap,i(S.sheenColorMap,y.sheenColorMapTransform)),S.sheenRoughnessMap&&(y.sheenRoughnessMap.value=S.sheenRoughnessMap,i(S.sheenRoughnessMap,y.sheenRoughnessMapTransform))),S.clearcoat>0&&(y.clearcoat.value=S.clearcoat,y.clearcoatRoughness.value=S.clearcoatRoughness,S.clearcoatMap&&(y.clearcoatMap.value=S.clearcoatMap,i(S.clearcoatMap,y.clearcoatMapTransform)),S.clearcoatRoughnessMap&&(y.clearcoatRoughnessMap.value=S.clearcoatRoughnessMap,i(S.clearcoatRoughnessMap,y.clearcoatRoughnessMapTransform)),S.clearcoatNormalMap&&(y.clearcoatNormalMap.value=S.clearcoatNormalMap,i(S.clearcoatNormalMap,y.clearcoatNormalMapTransform),y.clearcoatNormalScale.value.copy(S.clearcoatNormalScale),S.side===$n&&y.clearcoatNormalScale.value.negate())),S.dispersion>0&&(y.dispersion.value=S.dispersion),S.iridescence>0&&(y.iridescence.value=S.iridescence,y.iridescenceIOR.value=S.iridescenceIOR,y.iridescenceThicknessMinimum.value=S.iridescenceThicknessRange[0],y.iridescenceThicknessMaximum.value=S.iridescenceThicknessRange[1],S.iridescenceMap&&(y.iridescenceMap.value=S.iridescenceMap,i(S.iridescenceMap,y.iridescenceMapTransform)),S.iridescenceThicknessMap&&(y.iridescenceThicknessMap.value=S.iridescenceThicknessMap,i(S.iridescenceThicknessMap,y.iridescenceThicknessMapTransform))),S.transmission>0&&(y.transmission.value=S.transmission,y.transmissionSamplerMap.value=w.texture,y.transmissionSamplerSize.value.set(w.width,w.height),S.transmissionMap&&(y.transmissionMap.value=S.transmissionMap,i(S.transmissionMap,y.transmissionMapTransform)),y.thickness.value=S.thickness,S.thicknessMap&&(y.thicknessMap.value=S.thicknessMap,i(S.thicknessMap,y.thicknessMapTransform)),y.attenuationDistance.value=S.attenuationDistance,y.attenuationColor.value.copy(S.attenuationColor)),S.anisotropy>0&&(y.anisotropyVector.value.set(S.anisotropy*Math.cos(S.anisotropyRotation),S.anisotropy*Math.sin(S.anisotropyRotation)),S.anisotropyMap&&(y.anisotropyMap.value=S.anisotropyMap,i(S.anisotropyMap,y.anisotropyMapTransform))),y.specularIntensity.value=S.specularIntensity,y.specularColor.value.copy(S.specularColor),S.specularColorMap&&(y.specularColorMap.value=S.specularColorMap,i(S.specularColorMap,y.specularColorMapTransform)),S.specularIntensityMap&&(y.specularIntensityMap.value=S.specularIntensityMap,i(S.specularIntensityMap,y.specularIntensityMapTransform))}function E(y,S){S.matcap&&(y.matcap.value=S.matcap)}function C(y,S){const w=e.get(S).light;y.referencePosition.value.setFromMatrixPosition(w.matrixWorld),y.nearDistance.value=w.shadow.camera.near,y.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:l}}function RR(s,e,i,r){let l={},c={},h=[];const p=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function m(w,L){const I=L.program;r.uniformBlockBinding(w,I)}function d(w,L){let I=l[w.id];I===void 0&&(E(w),I=_(w),l[w.id]=I,w.addEventListener("dispose",y));const V=L.program;r.updateUBOMapping(w,V);const N=e.render.frame;c[w.id]!==N&&(g(w),c[w.id]=N)}function _(w){const L=v();w.__bindingPointIndex=L;const I=s.createBuffer(),V=w.__size,N=w.usage;return s.bindBuffer(s.UNIFORM_BUFFER,I),s.bufferData(s.UNIFORM_BUFFER,V,N),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,L,I),I}function v(){for(let w=0;w<p;w++)if(h.indexOf(w)===-1)return h.push(w),w;return At("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(w){const L=l[w.id],I=w.uniforms,V=w.__cache;s.bindBuffer(s.UNIFORM_BUFFER,L);for(let N=0,O=I.length;N<O;N++){const T=Array.isArray(I[N])?I[N]:[I[N]];for(let B=0,Z=T.length;B<Z;B++){const z=T[B];if(M(z,N,B,V)===!0){const Q=z.__offset,ee=Array.isArray(z.value)?z.value:[z.value];let he=0;for(let j=0;j<ee.length;j++){const P=ee[j],H=C(P);typeof P=="number"||typeof P=="boolean"?(z.__data[0]=P,s.bufferSubData(s.UNIFORM_BUFFER,Q+he,z.__data)):P.isMatrix3?(z.__data[0]=P.elements[0],z.__data[1]=P.elements[1],z.__data[2]=P.elements[2],z.__data[3]=0,z.__data[4]=P.elements[3],z.__data[5]=P.elements[4],z.__data[6]=P.elements[5],z.__data[7]=0,z.__data[8]=P.elements[6],z.__data[9]=P.elements[7],z.__data[10]=P.elements[8],z.__data[11]=0):ArrayBuffer.isView(P)?z.__data.set(new P.constructor(P.buffer,P.byteOffset,z.__data.length)):(P.toArray(z.__data,he),he+=H.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,Q,z.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function M(w,L,I,V){const N=w.value,O=L+"_"+I;if(V[O]===void 0)return typeof N=="number"||typeof N=="boolean"?V[O]=N:ArrayBuffer.isView(N)?V[O]=N.slice():V[O]=N.clone(),!0;{const T=V[O];if(typeof N=="number"||typeof N=="boolean"){if(T!==N)return V[O]=N,!0}else{if(ArrayBuffer.isView(N))return!0;if(T.equals(N)===!1)return T.copy(N),!0}}return!1}function E(w){const L=w.uniforms;let I=0;const V=16;for(let O=0,T=L.length;O<T;O++){const B=Array.isArray(L[O])?L[O]:[L[O]];for(let Z=0,z=B.length;Z<z;Z++){const Q=B[Z],ee=Array.isArray(Q.value)?Q.value:[Q.value];for(let he=0,j=ee.length;he<j;he++){const P=ee[he],H=C(P),ne=I%V,pe=ne%H.boundary,ye=ne+pe;I+=pe,ye!==0&&V-ye<H.storage&&(I+=V-ye),Q.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),Q.__offset=I,I+=H.storage}}}const N=I%V;return N>0&&(I+=V-N),w.__size=I,w.__cache={},this}function C(w){const L={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(L.boundary=4,L.storage=4):w.isVector2?(L.boundary=8,L.storage=8):w.isVector3||w.isColor?(L.boundary=16,L.storage=12):w.isVector4?(L.boundary=16,L.storage=16):w.isMatrix3?(L.boundary=48,L.storage=48):w.isMatrix4?(L.boundary=64,L.storage=64):w.isTexture?tt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(w)?(L.boundary=16,L.storage=w.byteLength):tt("WebGLRenderer: Unsupported uniform value type.",w),L}function y(w){const L=w.target;L.removeEventListener("dispose",y);const I=h.indexOf(L.__bindingPointIndex);h.splice(I,1),s.deleteBuffer(l[L.id]),delete l[L.id],delete c[L.id]}function S(){for(const w in l)s.deleteBuffer(l[w]);h=[],l={},c={}}return{bind:m,update:d,dispose:S}}const CR=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let ji=null;function wR(){return ji===null&&(ji=new ob(CR,16,16,Ys,Ra),ji.name="DFG_LUT",ji.minFilter=zn,ji.magFilter=zn,ji.wrapS=Ea,ji.wrapT=Ea,ji.generateMipmaps=!1,ji.needsUpdate=!0),ji}class DR{constructor(e={}){const{canvas:i=FM(),context:r=null,depth:l=!0,stencil:c=!1,alpha:h=!1,antialias:p=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:d=!1,powerPreference:_="default",failIfMajorPerformanceCaveat:v=!1,reversedDepthBuffer:g=!1,outputBufferType:M=di}=e;this.isWebGLRenderer=!0;let E;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");E=r.getContextAttributes().alpha}else E=h;const C=M,y=new Set([bp,Mp,yp]),S=new Set([di,Qi,cl,ul,xp,Sp]),w=new Uint32Array(4),L=new Int32Array(4),I=new $;let V=null,N=null;const O=[],T=[];let B=null;this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const Z=this;let z=!1,Q=null;this._outputColorSpace=Jn;let ee=0,he=0,j=null,P=-1,H=null;const ne=new rn,pe=new rn;let ye=null;const F=new dt(0);let q=0,Se=i.width,Ae=i.height,Ce=1,se=null,Me=null;const be=new rn(0,0,Se,Ae),K=new rn(0,0,Se,Ae);let we=!1;const Ze=new wp;let jt=!1,pt=!1;const yt=new on,Lt=new $,ut=new rn,ln={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Yt=!1;function An(){return j===null?Ce:1}let W=r;function tn(A,Y){return i.getContext(A,Y)}try{const A={alpha:!0,depth:l,stencil:c,antialias:p,premultipliedAlpha:m,preserveDrawingBuffer:d,powerPreference:_,failIfMajorPerformanceCaveat:v};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${gp}`),i.addEventListener("webglcontextlost",Ee,!1),i.addEventListener("webglcontextrestored",qe,!1),i.addEventListener("webglcontextcreationerror",nt,!1),W===null){const Y="webgl2";if(W=tn(Y,A),W===null)throw tn(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw At("WebGLRenderer: "+A.message),A}let mt,Ht,De,Qt,U,b,te,ve,Te,Ue,Pe,fe,de,Ie,Fe,Le,Ne,it,at,_t,k,Re,ge;function He(){mt=new wT(W),mt.init(),k=new SR(W,mt),Ht=new yT(W,mt,e,k),De=new vR(W,mt),Ht.reversedDepthBuffer&&g&&De.buffers.depth.setReversed(!0),Qt=new NT(W),U=new aR,b=new xR(W,mt,De,U,Ht,k,Qt),te=new CT(Z),ve=new Ib(W),Re=new xT(W,ve),Te=new DT(W,ve,Qt,Re),Ue=new OT(W,Te,ve,Re,Qt),it=new LT(W,Ht,b),Fe=new MT(U),Pe=new iR(Z,te,mt,Ht,Re,Fe),fe=new AR(Z,U),de=new rR,Ie=new hR(mt),Ne=new vT(Z,te,De,Ue,E,m),Le=new _R(Z,Ue,Ht),ge=new RR(W,Qt,Ht,De),at=new ST(W,mt,Qt),_t=new UT(W,mt,Qt),Qt.programs=Pe.programs,Z.capabilities=Ht,Z.extensions=mt,Z.properties=U,Z.renderLists=de,Z.shadowMap=Le,Z.state=De,Z.info=Qt}He(),C!==di&&(B=new IT(C,i.width,i.height,l,c));const Oe=new ER(Z,W);this.xr=Oe,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){const A=mt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=mt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return Ce},this.setPixelRatio=function(A){A!==void 0&&(Ce=A,this.setSize(Se,Ae,!1))},this.getSize=function(A){return A.set(Se,Ae)},this.setSize=function(A,Y,le=!0){if(Oe.isPresenting){tt("WebGLRenderer: Can't change size while VR device is presenting.");return}Se=A,Ae=Y,i.width=Math.floor(A*Ce),i.height=Math.floor(Y*Ce),le===!0&&(i.style.width=A+"px",i.style.height=Y+"px"),B!==null&&B.setSize(i.width,i.height),this.setViewport(0,0,A,Y)},this.getDrawingBufferSize=function(A){return A.set(Se*Ce,Ae*Ce).floor()},this.setDrawingBufferSize=function(A,Y,le){Se=A,Ae=Y,Ce=le,i.width=Math.floor(A*le),i.height=Math.floor(Y*le),this.setViewport(0,0,A,Y)},this.setEffects=function(A){if(C===di){At("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let Y=0;Y<A.length;Y++)if(A[Y].isOutputPass===!0){tt("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}B.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(ne)},this.getViewport=function(A){return A.copy(be)},this.setViewport=function(A,Y,le,re){A.isVector4?be.set(A.x,A.y,A.z,A.w):be.set(A,Y,le,re),De.viewport(ne.copy(be).multiplyScalar(Ce).round())},this.getScissor=function(A){return A.copy(K)},this.setScissor=function(A,Y,le,re){A.isVector4?K.set(A.x,A.y,A.z,A.w):K.set(A,Y,le,re),De.scissor(pe.copy(K).multiplyScalar(Ce).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(A){De.setScissorTest(we=A)},this.setOpaqueSort=function(A){se=A},this.setTransparentSort=function(A){Me=A},this.getClearColor=function(A){return A.copy(Ne.getClearColor())},this.setClearColor=function(){Ne.setClearColor(...arguments)},this.getClearAlpha=function(){return Ne.getClearAlpha()},this.setClearAlpha=function(){Ne.setClearAlpha(...arguments)},this.clear=function(A=!0,Y=!0,le=!0){let re=0;if(A){let oe=!1;if(j!==null){const ze=j.texture.format;oe=y.has(ze)}if(oe){const ze=j.texture.type,ke=S.has(ze),Be=Ne.getClearColor(),je=Ne.getClearAlpha(),Xe=Be.r,Je=Be.g,lt=Be.b;ke?(w[0]=Xe,w[1]=Je,w[2]=lt,w[3]=je,W.clearBufferuiv(W.COLOR,0,w)):(L[0]=Xe,L[1]=Je,L[2]=lt,L[3]=je,W.clearBufferiv(W.COLOR,0,L))}else re|=W.COLOR_BUFFER_BIT}Y&&(re|=W.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),le&&(re|=W.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),re!==0&&W.clear(re)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),Q=A},this.dispose=function(){i.removeEventListener("webglcontextlost",Ee,!1),i.removeEventListener("webglcontextrestored",qe,!1),i.removeEventListener("webglcontextcreationerror",nt,!1),Ne.dispose(),de.dispose(),Ie.dispose(),U.dispose(),te.dispose(),Ue.dispose(),Re.dispose(),ge.dispose(),Pe.dispose(),Oe.dispose(),Oe.removeEventListener("sessionstart",no),Oe.removeEventListener("sessionend",io),On.stop()};function Ee(A){A.preventDefault(),P_("WebGLRenderer: Context Lost."),z=!0}function qe(){P_("WebGLRenderer: Context Restored."),z=!1;const A=Qt.autoReset,Y=Le.enabled,le=Le.autoUpdate,re=Le.needsUpdate,oe=Le.type;He(),Qt.autoReset=A,Le.enabled=Y,Le.autoUpdate=le,Le.needsUpdate=re,Le.type=oe}function nt(A){At("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function nn(A){const Y=A.target;Y.removeEventListener("dispose",nn),Dt(Y)}function Dt(A){gi(A),U.remove(A)}function gi(A){const Y=U.get(A).programs;Y!==void 0&&(Y.forEach(function(le){Pe.releaseProgram(le)}),A.isShaderMaterial&&Pe.releaseShaderCache(A))}this.renderBufferDirect=function(A,Y,le,re,oe,ze){Y===null&&(Y=ln);const ke=oe.isMesh&&oe.matrixWorld.determinant()<0,Be=Ua(A,Y,le,re,oe);De.setMaterial(re,ke);let je=le.index,Xe=1;if(re.wireframe===!0){if(je=Te.getWireframeAttribute(le),je===void 0)return;Xe=2}const Je=le.drawRange,lt=le.attributes.position;let Ke=Je.start*Xe,Rt=(Je.start+Je.count)*Xe;ze!==null&&(Ke=Math.max(Ke,ze.start*Xe),Rt=Math.min(Rt,(ze.start+ze.count)*Xe)),je!==null?(Ke=Math.max(Ke,0),Rt=Math.min(Rt,je.count)):lt!=null&&(Ke=Math.max(Ke,0),Rt=Math.min(Rt,lt.count));const Jt=Rt-Ke;if(Jt<0||Jt===1/0)return;Re.setup(oe,re,Be,le,je);let Wt,Ot=at;if(je!==null&&(Wt=ve.get(je),Ot=_t,Ot.setIndex(Wt)),oe.isMesh)re.wireframe===!0?(De.setLineWidth(re.wireframeLinewidth*An()),Ot.setMode(W.LINES)):Ot.setMode(W.TRIANGLES);else if(oe.isLine){let Pt=re.linewidth;Pt===void 0&&(Pt=1),De.setLineWidth(Pt*An()),oe.isLineSegments?Ot.setMode(W.LINES):oe.isLineLoop?Ot.setMode(W.LINE_LOOP):Ot.setMode(W.LINE_STRIP)}else oe.isPoints?Ot.setMode(W.POINTS):oe.isSprite&&Ot.setMode(W.TRIANGLES);if(oe.isBatchedMesh)if(mt.get("WEBGL_multi_draw"))Ot.renderMultiDraw(oe._multiDrawStarts,oe._multiDrawCounts,oe._multiDrawCount);else{const Pt=oe._multiDrawStarts,Ve=oe._multiDrawCounts,Pn=oe._multiDrawCount,vt=je?ve.get(je).bytesPerElement:1,vn=U.get(re).currentProgram.getUniforms();for(let ni=0;ni<Pn;ni++)vn.setValue(W,"_gl_DrawID",ni),Ot.render(Pt[ni]/vt,Ve[ni])}else if(oe.isInstancedMesh)Ot.renderInstances(Ke,Jt,oe.count);else if(le.isInstancedBufferGeometry){const Pt=le._maxInstanceCount!==void 0?le._maxInstanceCount:1/0,Ve=Math.min(le.instanceCount,Pt);Ot.renderInstances(Ke,Jt,Ve)}else Ot.render(Ke,Jt)};function ti(A,Y,le){A.transparent===!0&&A.side===ba&&A.forceSinglePass===!1?(A.side=$n,A.needsUpdate=!0,Qs(A,Y,le),A.side=ps,A.needsUpdate=!0,Qs(A,Y,le),A.side=ba):Qs(A,Y,le)}this.compile=function(A,Y,le=null){le===null&&(le=A),N=Ie.get(le),N.init(Y),T.push(N),le.traverseVisible(function(oe){oe.isLight&&oe.layers.test(Y.layers)&&(N.pushLight(oe),oe.castShadow&&N.pushShadow(oe))}),A!==le&&A.traverseVisible(function(oe){oe.isLight&&oe.layers.test(Y.layers)&&(N.pushLight(oe),oe.castShadow&&N.pushShadow(oe))}),N.setupLights();const re=new Set;return A.traverse(function(oe){if(!(oe.isMesh||oe.isPoints||oe.isLine||oe.isSprite))return;const ze=oe.material;if(ze)if(Array.isArray(ze))for(let ke=0;ke<ze.length;ke++){const Be=ze[ke];ti(Be,le,oe),re.add(Be)}else ti(ze,le,oe),re.add(ze)}),N=T.pop(),re},this.compileAsync=function(A,Y,le=null){const re=this.compile(A,Y,le);return new Promise(oe=>{function ze(){if(re.forEach(function(ke){U.get(ke).currentProgram.isReady()&&re.delete(ke)}),re.size===0){oe(A);return}setTimeout(ze,10)}mt.get("KHR_parallel_shader_compile")!==null?ze():setTimeout(ze,10)})};let vs=null;function to(A){vs&&vs(A)}function no(){On.stop()}function io(){On.start()}const On=new _x;On.setAnimationLoop(to),typeof self<"u"&&On.setContext(self),this.setAnimationLoop=function(A){vs=A,Oe.setAnimationLoop(A),A===null?On.stop():On.start()},Oe.addEventListener("sessionstart",no),Oe.addEventListener("sessionend",io),this.render=function(A,Y){if(Y!==void 0&&Y.isCamera!==!0){At("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(z===!0)return;Q!==null&&Q.renderStart(A,Y);const le=Oe.enabled===!0&&Oe.isPresenting===!0,re=B!==null&&(j===null||le)&&B.begin(Z,j);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),Oe.enabled===!0&&Oe.isPresenting===!0&&(B===null||B.isCompositing()===!1)&&(Oe.cameraAutoUpdate===!0&&Oe.updateCamera(Y),Y=Oe.getCamera()),A.isScene===!0&&A.onBeforeRender(Z,A,Y,j),N=Ie.get(A,T.length),N.init(Y),N.state.textureUnits=b.getTextureUnits(),T.push(N),yt.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),Ze.setFromProjectionMatrix(yt,Yi,Y.reversedDepth),pt=this.localClippingEnabled,jt=Fe.init(this.clippingPlanes,pt),V=de.get(A,O.length),V.init(),O.push(V),Oe.enabled===!0&&Oe.isPresenting===!0){const ke=Z.xr.getDepthSensingMesh();ke!==null&&cn(ke,Y,-1/0,Z.sortObjects)}cn(A,Y,0,Z.sortObjects),V.finish(),Z.sortObjects===!0&&V.sort(se,Me),Yt=Oe.enabled===!1||Oe.isPresenting===!1||Oe.hasDepthSensing()===!1,Yt&&Ne.addToRenderList(V,A),this.info.render.frame++,jt===!0&&Fe.beginShadows();const oe=N.state.shadowsArray;if(Le.render(oe,A,Y),jt===!0&&Fe.endShadows(),this.info.autoReset===!0&&this.info.reset(),(re&&B.hasRenderPass())===!1){const ke=V.opaque,Be=V.transmissive;if(N.setupLights(),Y.isArrayCamera){const je=Y.cameras;if(Be.length>0)for(let Xe=0,Je=je.length;Xe<Je;Xe++){const lt=je[Xe];$i(ke,Be,A,lt)}Yt&&Ne.render(A);for(let Xe=0,Je=je.length;Xe<Je;Xe++){const lt=je[Xe];Rn(V,A,lt,lt.viewport)}}else Be.length>0&&$i(ke,Be,A,Y),Yt&&Ne.render(A),Rn(V,A,Y)}j!==null&&he===0&&(b.updateMultisampleRenderTarget(j),b.updateRenderTargetMipmap(j)),re&&B.end(Z),A.isScene===!0&&A.onAfterRender(Z,A,Y),Re.resetDefaultState(),P=-1,H=null,T.pop(),T.length>0?(N=T[T.length-1],b.setTextureUnits(N.state.textureUnits),jt===!0&&Fe.setGlobalState(Z.clippingPlanes,N.state.camera)):N=null,O.pop(),O.length>0?V=O[O.length-1]:V=null,Q!==null&&Q.renderEnd()};function cn(A,Y,le,re){if(A.visible===!1)return;if(A.layers.test(Y.layers)){if(A.isGroup)le=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(Y);else if(A.isLightProbeGrid)N.pushLightProbeGrid(A);else if(A.isLight)N.pushLight(A),A.castShadow&&N.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Ze.intersectsSprite(A)){re&&ut.setFromMatrixPosition(A.matrixWorld).applyMatrix4(yt);const ke=Ue.update(A),Be=A.material;Be.visible&&V.push(A,ke,Be,le,ut.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Ze.intersectsObject(A))){const ke=Ue.update(A),Be=A.material;if(re&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),ut.copy(A.boundingSphere.center)):(ke.boundingSphere===null&&ke.computeBoundingSphere(),ut.copy(ke.boundingSphere.center)),ut.applyMatrix4(A.matrixWorld).applyMatrix4(yt)),Array.isArray(Be)){const je=ke.groups;for(let Xe=0,Je=je.length;Xe<Je;Xe++){const lt=je[Xe],Ke=Be[lt.materialIndex];Ke&&Ke.visible&&V.push(A,ke,Ke,le,ut.z,lt)}}else Be.visible&&V.push(A,ke,Be,le,ut.z,null)}}const ze=A.children;for(let ke=0,Be=ze.length;ke<Be;ke++)cn(ze[ke],Y,le,re)}function Rn(A,Y,le,re){const{opaque:oe,transmissive:ze,transparent:ke}=A;N.setupLightsView(le),jt===!0&&Fe.setGlobalState(Z.clippingPlanes,le),re&&De.viewport(ne.copy(re)),oe.length>0&&wa(oe,Y,le),ze.length>0&&wa(ze,Y,le),ke.length>0&&wa(ke,Y,le),De.buffers.depth.setTest(!0),De.buffers.depth.setMask(!0),De.buffers.color.setMask(!0),De.setPolygonOffset(!1)}function $i(A,Y,le,re){if((le.isScene===!0?le.overrideMaterial:null)!==null)return;if(N.state.transmissionRenderTarget[re.id]===void 0){const Ke=mt.has("EXT_color_buffer_half_float")||mt.has("EXT_color_buffer_float");N.state.transmissionRenderTarget[re.id]=new Ki(1,1,{generateMipmaps:!0,type:Ke?Ra:di,minFilter:Xs,samples:Math.max(4,Ht.samples),stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Tt.workingColorSpace})}const ze=N.state.transmissionRenderTarget[re.id],ke=re.viewport||ne;ze.setSize(ke.z*Z.transmissionResolutionScale,ke.w*Z.transmissionResolutionScale);const Be=Z.getRenderTarget(),je=Z.getActiveCubeFace(),Xe=Z.getActiveMipmapLevel();Z.setRenderTarget(ze),Z.getClearColor(F),q=Z.getClearAlpha(),q<1&&Z.setClearColor(16777215,.5),Z.clear(),Yt&&Ne.render(le);const Je=Z.toneMapping;Z.toneMapping=Zi;const lt=re.viewport;if(re.viewport!==void 0&&(re.viewport=void 0),N.setupLightsView(re),jt===!0&&Fe.setGlobalState(Z.clippingPlanes,re),wa(A,le,re),b.updateMultisampleRenderTarget(ze),b.updateRenderTargetMipmap(ze),mt.has("WEBGL_multisampled_render_to_texture")===!1){let Ke=!1;for(let Rt=0,Jt=Y.length;Rt<Jt;Rt++){const Wt=Y[Rt],{object:Ot,geometry:Pt,material:Ve,group:Pn}=Wt;if(Ve.side===ba&&Ot.layers.test(re.layers)){const vt=Ve.side;Ve.side=$n,Ve.needsUpdate=!0,gl(Ot,le,re,Pt,Ve,Pn),Ve.side=vt,Ve.needsUpdate=!0,Ke=!0}}Ke===!0&&(b.updateMultisampleRenderTarget(ze),b.updateRenderTargetMipmap(ze))}Z.setRenderTarget(Be,je,Xe),Z.setClearColor(F,q),lt!==void 0&&(re.viewport=lt),Z.toneMapping=Je}function wa(A,Y,le){const re=Y.isScene===!0?Y.overrideMaterial:null;for(let oe=0,ze=A.length;oe<ze;oe++){const ke=A[oe],{object:Be,geometry:je,group:Xe}=ke;let Je=ke.material;Je.allowOverride===!0&&re!==null&&(Je=re),Be.layers.test(le.layers)&&gl(Be,Y,le,je,Je,Xe)}}function gl(A,Y,le,re,oe,ze){A.onBeforeRender(Z,Y,le,re,oe,ze),A.modelViewMatrix.multiplyMatrices(le.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),oe.onBeforeRender(Z,Y,le,re,A,ze),oe.transparent===!0&&oe.side===ba&&oe.forceSinglePass===!1?(oe.side=$n,oe.needsUpdate=!0,Z.renderBufferDirect(le,Y,re,oe,A,ze),oe.side=ps,oe.needsUpdate=!0,Z.renderBufferDirect(le,Y,re,oe,A,ze),oe.side=ba):Z.renderBufferDirect(le,Y,re,oe,A,ze),A.onAfterRender(Z,Y,le,re,oe,ze)}function Qs(A,Y,le){Y.isScene!==!0&&(Y=ln);const re=U.get(A),oe=N.state.lights,ze=N.state.shadowsArray,ke=oe.state.version,Be=Pe.getParameters(A,oe.state,ze,Y,le,N.state.lightProbeGridArray),je=Pe.getProgramCacheKey(Be);let Xe=re.programs;re.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?Y.environment:null,re.fog=Y.fog;const Je=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;re.envMap=te.get(A.envMap||re.environment,Je),re.envMapRotation=re.environment!==null&&A.envMap===null?Y.environmentRotation:A.envMapRotation,Xe===void 0&&(A.addEventListener("dispose",nn),Xe=new Map,re.programs=Xe);let lt=Xe.get(je);if(lt!==void 0){if(re.currentProgram===lt&&re.lightsStateVersion===ke)return Da(A,Be),lt}else Be.uniforms=Pe.getUniforms(A),Q!==null&&A.isNodeMaterial&&Q.build(A,le,Be),A.onBeforeCompile(Be,Z),lt=Pe.acquireProgram(Be,je),Xe.set(je,lt),re.uniforms=Be.uniforms;const Ke=re.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ke.clippingPlanes=Fe.uniform),Da(A,Be),re.needsLights=xs(A),re.lightsStateVersion=ke,re.needsLights&&(Ke.ambientLightColor.value=oe.state.ambient,Ke.lightProbe.value=oe.state.probe,Ke.directionalLights.value=oe.state.directional,Ke.directionalLightShadows.value=oe.state.directionalShadow,Ke.spotLights.value=oe.state.spot,Ke.spotLightShadows.value=oe.state.spotShadow,Ke.rectAreaLights.value=oe.state.rectArea,Ke.ltc_1.value=oe.state.rectAreaLTC1,Ke.ltc_2.value=oe.state.rectAreaLTC2,Ke.pointLights.value=oe.state.point,Ke.pointLightShadows.value=oe.state.pointShadow,Ke.hemisphereLights.value=oe.state.hemi,Ke.directionalShadowMatrix.value=oe.state.directionalShadowMatrix,Ke.spotLightMatrix.value=oe.state.spotLightMatrix,Ke.spotLightMap.value=oe.state.spotLightMap,Ke.pointShadowMatrix.value=oe.state.pointShadowMatrix),re.lightProbeGrid=N.state.lightProbeGridArray.length>0,re.currentProgram=lt,re.uniformsList=null,lt}function ao(A){if(A.uniformsList===null){const Y=A.currentProgram.getUniforms();A.uniformsList=ou.seqWithValue(Y.seq,A.uniforms)}return A.uniformsList}function Da(A,Y){const le=U.get(A);le.outputColorSpace=Y.outputColorSpace,le.batching=Y.batching,le.batchingColor=Y.batchingColor,le.instancing=Y.instancing,le.instancingColor=Y.instancingColor,le.instancingMorph=Y.instancingMorph,le.skinning=Y.skinning,le.morphTargets=Y.morphTargets,le.morphNormals=Y.morphNormals,le.morphColors=Y.morphColors,le.morphTargetsCount=Y.morphTargetsCount,le.numClippingPlanes=Y.numClippingPlanes,le.numIntersection=Y.numClipIntersection,le.vertexAlphas=Y.vertexAlphas,le.vertexTangents=Y.vertexTangents,le.toneMapping=Y.toneMapping}function so(A,Y){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;I.setFromMatrixPosition(Y.matrixWorld);for(let le=0,re=A.length;le<re;le++){const oe=A[le];if(oe.texture!==null&&oe.boundingBox.containsPoint(I))return oe}return null}function Ua(A,Y,le,re,oe){Y.isScene!==!0&&(Y=ln),b.resetTextureUnits();const ze=Y.fog,ke=re.isMeshStandardMaterial||re.isMeshLambertMaterial||re.isMeshPhongMaterial?Y.environment:null,Be=j===null?Z.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Tt.workingColorSpace,je=re.isMeshStandardMaterial||re.isMeshLambertMaterial&&!re.envMap||re.isMeshPhongMaterial&&!re.envMap,Xe=te.get(re.envMap||ke,je),Je=re.vertexColors===!0&&!!le.attributes.color&&le.attributes.color.itemSize===4,lt=!!le.attributes.tangent&&(!!re.normalMap||re.anisotropy>0),Ke=!!le.morphAttributes.position,Rt=!!le.morphAttributes.normal,Jt=!!le.morphAttributes.color;let Wt=Zi;re.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Wt=Z.toneMapping);const Ot=le.morphAttributes.position||le.morphAttributes.normal||le.morphAttributes.color,Pt=Ot!==void 0?Ot.length:0,Ve=U.get(re),Pn=N.state.lights;if(jt===!0&&(pt===!0||A!==H)){const Nt=A===H&&re.id===P;Fe.setState(re,A,Nt)}let vt=!1;re.version===Ve.__version?(Ve.needsLights&&Ve.lightsStateVersion!==Pn.state.version||Ve.outputColorSpace!==Be||oe.isBatchedMesh&&Ve.batching===!1||!oe.isBatchedMesh&&Ve.batching===!0||oe.isBatchedMesh&&Ve.batchingColor===!0&&oe.colorTexture===null||oe.isBatchedMesh&&Ve.batchingColor===!1&&oe.colorTexture!==null||oe.isInstancedMesh&&Ve.instancing===!1||!oe.isInstancedMesh&&Ve.instancing===!0||oe.isSkinnedMesh&&Ve.skinning===!1||!oe.isSkinnedMesh&&Ve.skinning===!0||oe.isInstancedMesh&&Ve.instancingColor===!0&&oe.instanceColor===null||oe.isInstancedMesh&&Ve.instancingColor===!1&&oe.instanceColor!==null||oe.isInstancedMesh&&Ve.instancingMorph===!0&&oe.morphTexture===null||oe.isInstancedMesh&&Ve.instancingMorph===!1&&oe.morphTexture!==null||Ve.envMap!==Xe||re.fog===!0&&Ve.fog!==ze||Ve.numClippingPlanes!==void 0&&(Ve.numClippingPlanes!==Fe.numPlanes||Ve.numIntersection!==Fe.numIntersection)||Ve.vertexAlphas!==Je||Ve.vertexTangents!==lt||Ve.morphTargets!==Ke||Ve.morphNormals!==Rt||Ve.morphColors!==Jt||Ve.toneMapping!==Wt||Ve.morphTargetsCount!==Pt||!!Ve.lightProbeGrid!=N.state.lightProbeGridArray.length>0)&&(vt=!0):(vt=!0,Ve.__version=re.version);let vn=Ve.currentProgram;vt===!0&&(vn=Qs(re,Y,oe),Q&&re.isNodeMaterial&&Q.onUpdateProgram(re,vn,Ve));let ni=!1,Ci=!1,ii=!1;const It=vn.getUniforms(),$t=Ve.uniforms;if(De.useProgram(vn.program)&&(ni=!0,Ci=!0,ii=!0),re.id!==P&&(P=re.id,Ci=!0),Ve.needsLights){const Nt=so(N.state.lightProbeGridArray,oe);Ve.lightProbeGrid!==Nt&&(Ve.lightProbeGrid=Nt,Ci=!0)}if(ni||H!==A){De.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),It.setValue(W,"projectionMatrix",A.projectionMatrix),It.setValue(W,"viewMatrix",A.matrixWorldInverse);const zi=It.map.cameraPosition;zi!==void 0&&zi.setValue(W,Lt.setFromMatrixPosition(A.matrixWorld)),Ht.logarithmicDepthBuffer&&It.setValue(W,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(re.isMeshPhongMaterial||re.isMeshToonMaterial||re.isMeshLambertMaterial||re.isMeshBasicMaterial||re.isMeshStandardMaterial||re.isShaderMaterial)&&It.setValue(W,"isOrthographic",A.isOrthographicCamera===!0),H!==A&&(H=A,Ci=!0,ii=!0)}if(Ve.needsLights&&(Pn.state.directionalShadowMap.length>0&&It.setValue(W,"directionalShadowMap",Pn.state.directionalShadowMap,b),Pn.state.spotShadowMap.length>0&&It.setValue(W,"spotShadowMap",Pn.state.spotShadowMap,b),Pn.state.pointShadowMap.length>0&&It.setValue(W,"pointShadowMap",Pn.state.pointShadowMap,b)),oe.isSkinnedMesh){It.setOptional(W,oe,"bindMatrix"),It.setOptional(W,oe,"bindMatrixInverse");const Nt=oe.skeleton;Nt&&(Nt.boneTexture===null&&Nt.computeBoneTexture(),It.setValue(W,"boneTexture",Nt.boneTexture,b))}oe.isBatchedMesh&&(It.setOptional(W,oe,"batchingTexture"),It.setValue(W,"batchingTexture",oe._matricesTexture,b),It.setOptional(W,oe,"batchingIdTexture"),It.setValue(W,"batchingIdTexture",oe._indirectTexture,b),It.setOptional(W,oe,"batchingColorTexture"),oe._colorsTexture!==null&&It.setValue(W,"batchingColorTexture",oe._colorsTexture,b));const wi=le.morphAttributes;if((wi.position!==void 0||wi.normal!==void 0||wi.color!==void 0)&&it.update(oe,le,vn),(Ci||Ve.receiveShadow!==oe.receiveShadow)&&(Ve.receiveShadow=oe.receiveShadow,It.setValue(W,"receiveShadow",oe.receiveShadow)),(re.isMeshStandardMaterial||re.isMeshLambertMaterial||re.isMeshPhongMaterial)&&re.envMap===null&&Y.environment!==null&&($t.envMapIntensity.value=Y.environmentIntensity),$t.dfgLUT!==void 0&&($t.dfgLUT.value=wR()),Ci){if(It.setValue(W,"toneMappingExposure",Z.toneMappingExposure),Ve.needsLights&&Na($t,ii),ze&&re.fog===!0&&fe.refreshFogUniforms($t,ze),fe.refreshMaterialUniforms($t,re,Ce,Ae,N.state.transmissionRenderTarget[A.id]),Ve.needsLights&&Ve.lightProbeGrid){const Nt=Ve.lightProbeGrid;$t.probesSH.value=Nt.texture,$t.probesMin.value.copy(Nt.boundingBox.min),$t.probesMax.value.copy(Nt.boundingBox.max),$t.probesResolution.value.copy(Nt.resolution)}ou.upload(W,ao(Ve),$t,b)}if(re.isShaderMaterial&&re.uniformsNeedUpdate===!0&&(ou.upload(W,ao(Ve),$t,b),re.uniformsNeedUpdate=!1),re.isSpriteMaterial&&It.setValue(W,"center",oe.center),It.setValue(W,"modelViewMatrix",oe.modelViewMatrix),It.setValue(W,"normalMatrix",oe.normalMatrix),It.setValue(W,"modelMatrix",oe.matrixWorld),re.uniformsGroups!==void 0){const Nt=re.uniformsGroups;for(let zi=0,Oa=Nt.length;zi<Oa;zi++){const Ss=Nt[zi];ge.update(Ss,vn),ge.bind(Ss,vn)}}return vn}function Na(A,Y){A.ambientLightColor.needsUpdate=Y,A.lightProbe.needsUpdate=Y,A.directionalLights.needsUpdate=Y,A.directionalLightShadows.needsUpdate=Y,A.pointLights.needsUpdate=Y,A.pointLightShadows.needsUpdate=Y,A.spotLights.needsUpdate=Y,A.spotLightShadows.needsUpdate=Y,A.rectAreaLights.needsUpdate=Y,A.hemisphereLights.needsUpdate=Y}function xs(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return ee},this.getActiveMipmapLevel=function(){return he},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(A,Y,le){const re=U.get(A);re.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,re.__autoAllocateDepthBuffer===!1&&(re.__useRenderToTexture=!1),U.get(A.texture).__webglTexture=Y,U.get(A.depthTexture).__webglTexture=re.__autoAllocateDepthBuffer?void 0:le,re.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,Y){const le=U.get(A);le.__webglFramebuffer=Y,le.__useDefaultFramebuffer=Y===void 0};const La=W.createFramebuffer();this.setRenderTarget=function(A,Y=0,le=0){j=A,ee=Y,he=le;let re=null,oe=!1,ze=!1;if(A){const Be=U.get(A);if(Be.__useDefaultFramebuffer!==void 0){De.bindFramebuffer(W.FRAMEBUFFER,Be.__webglFramebuffer),ne.copy(A.viewport),pe.copy(A.scissor),ye=A.scissorTest,De.viewport(ne),De.scissor(pe),De.setScissorTest(ye),P=-1;return}else if(Be.__webglFramebuffer===void 0)b.setupRenderTarget(A);else if(Be.__hasExternalTextures)b.rebindTextures(A,U.get(A.texture).__webglTexture,U.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Je=A.depthTexture;if(Be.__boundDepthTexture!==Je){if(Je!==null&&U.has(Je)&&(A.width!==Je.image.width||A.height!==Je.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(A)}}const je=A.texture;(je.isData3DTexture||je.isDataArrayTexture||je.isCompressedArrayTexture)&&(ze=!0);const Xe=U.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Xe[Y])?re=Xe[Y][le]:re=Xe[Y],oe=!0):A.samples>0&&b.useMultisampledRTT(A)===!1?re=U.get(A).__webglMultisampledFramebuffer:Array.isArray(Xe)?re=Xe[le]:re=Xe,ne.copy(A.viewport),pe.copy(A.scissor),ye=A.scissorTest}else ne.copy(be).multiplyScalar(Ce).floor(),pe.copy(K).multiplyScalar(Ce).floor(),ye=we;if(le!==0&&(re=La),De.bindFramebuffer(W.FRAMEBUFFER,re)&&De.drawBuffers(A,re),De.viewport(ne),De.scissor(pe),De.setScissorTest(ye),oe){const Be=U.get(A.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Be.__webglTexture,le)}else if(ze){const Be=Y;for(let je=0;je<A.textures.length;je++){const Xe=U.get(A.textures[je]);W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0+je,Xe.__webglTexture,le,Be)}}else if(A!==null&&le!==0){const Be=U.get(A.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,Be.__webglTexture,le)}P=-1},this.readRenderTargetPixels=function(A,Y,le,re,oe,ze,ke,Be=0){if(!(A&&A.isWebGLRenderTarget)){At("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let je=U.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ke!==void 0&&(je=je[ke]),je){De.bindFramebuffer(W.FRAMEBUFFER,je);try{const Xe=A.textures[Be],Je=Xe.format,lt=Xe.type;if(A.textures.length>1&&W.readBuffer(W.COLOR_ATTACHMENT0+Be),!Ht.textureFormatReadable(Je)){At("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ht.textureTypeReadable(lt)){At("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=A.width-re&&le>=0&&le<=A.height-oe&&W.readPixels(Y,le,re,oe,k.convert(Je),k.convert(lt),ze)}finally{const Xe=j!==null?U.get(j).__webglFramebuffer:null;De.bindFramebuffer(W.FRAMEBUFFER,Xe)}}},this.readRenderTargetPixelsAsync=async function(A,Y,le,re,oe,ze,ke,Be=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let je=U.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ke!==void 0&&(je=je[ke]),je)if(Y>=0&&Y<=A.width-re&&le>=0&&le<=A.height-oe){De.bindFramebuffer(W.FRAMEBUFFER,je);const Xe=A.textures[Be],Je=Xe.format,lt=Xe.type;if(A.textures.length>1&&W.readBuffer(W.COLOR_ATTACHMENT0+Be),!Ht.textureFormatReadable(Je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ht.textureTypeReadable(lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ke=W.createBuffer();W.bindBuffer(W.PIXEL_PACK_BUFFER,Ke),W.bufferData(W.PIXEL_PACK_BUFFER,ze.byteLength,W.STREAM_READ),W.readPixels(Y,le,re,oe,k.convert(Je),k.convert(lt),0);const Rt=j!==null?U.get(j).__webglFramebuffer:null;De.bindFramebuffer(W.FRAMEBUFFER,Rt);const Jt=W.fenceSync(W.SYNC_GPU_COMMANDS_COMPLETE,0);return W.flush(),await BM(W,Jt,4),W.bindBuffer(W.PIXEL_PACK_BUFFER,Ke),W.getBufferSubData(W.PIXEL_PACK_BUFFER,0,ze),W.deleteBuffer(Ke),W.deleteSync(Jt),ze}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,Y=null,le=0){const re=Math.pow(2,-le),oe=Math.floor(A.image.width*re),ze=Math.floor(A.image.height*re),ke=Y!==null?Y.x:0,Be=Y!==null?Y.y:0;b.setTexture2D(A,0),W.copyTexSubImage2D(W.TEXTURE_2D,le,0,0,ke,Be,oe,ze),De.unbindTexture()};const hn=W.createFramebuffer(),_l=W.createFramebuffer();this.copyTextureToTexture=function(A,Y,le=null,re=null,oe=0,ze=0){let ke,Be,je,Xe,Je,lt,Ke,Rt,Jt;const Wt=A.isCompressedTexture?A.mipmaps[ze]:A.image;if(le!==null)ke=le.max.x-le.min.x,Be=le.max.y-le.min.y,je=le.isBox3?le.max.z-le.min.z:1,Xe=le.min.x,Je=le.min.y,lt=le.isBox3?le.min.z:0;else{const $t=Math.pow(2,-oe);ke=Math.floor(Wt.width*$t),Be=Math.floor(Wt.height*$t),A.isDataArrayTexture?je=Wt.depth:A.isData3DTexture?je=Math.floor(Wt.depth*$t):je=1,Xe=0,Je=0,lt=0}re!==null?(Ke=re.x,Rt=re.y,Jt=re.z):(Ke=0,Rt=0,Jt=0);const Ot=k.convert(Y.format),Pt=k.convert(Y.type);let Ve;Y.isData3DTexture?(b.setTexture3D(Y,0),Ve=W.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(b.setTexture2DArray(Y,0),Ve=W.TEXTURE_2D_ARRAY):(b.setTexture2D(Y,0),Ve=W.TEXTURE_2D),De.activeTexture(W.TEXTURE0),De.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,Y.flipY),De.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),De.pixelStorei(W.UNPACK_ALIGNMENT,Y.unpackAlignment);const Pn=De.getParameter(W.UNPACK_ROW_LENGTH),vt=De.getParameter(W.UNPACK_IMAGE_HEIGHT),vn=De.getParameter(W.UNPACK_SKIP_PIXELS),ni=De.getParameter(W.UNPACK_SKIP_ROWS),Ci=De.getParameter(W.UNPACK_SKIP_IMAGES);De.pixelStorei(W.UNPACK_ROW_LENGTH,Wt.width),De.pixelStorei(W.UNPACK_IMAGE_HEIGHT,Wt.height),De.pixelStorei(W.UNPACK_SKIP_PIXELS,Xe),De.pixelStorei(W.UNPACK_SKIP_ROWS,Je),De.pixelStorei(W.UNPACK_SKIP_IMAGES,lt);const ii=A.isDataArrayTexture||A.isData3DTexture,It=Y.isDataArrayTexture||Y.isData3DTexture;if(A.isDepthTexture){const $t=U.get(A),wi=U.get(Y),Nt=U.get($t.__renderTarget),zi=U.get(wi.__renderTarget);De.bindFramebuffer(W.READ_FRAMEBUFFER,Nt.__webglFramebuffer),De.bindFramebuffer(W.DRAW_FRAMEBUFFER,zi.__webglFramebuffer);for(let Oa=0;Oa<je;Oa++)ii&&(W.framebufferTextureLayer(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,U.get(A).__webglTexture,oe,lt+Oa),W.framebufferTextureLayer(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,U.get(Y).__webglTexture,ze,Jt+Oa)),W.blitFramebuffer(Xe,Je,ke,Be,Ke,Rt,ke,Be,W.DEPTH_BUFFER_BIT,W.NEAREST);De.bindFramebuffer(W.READ_FRAMEBUFFER,null),De.bindFramebuffer(W.DRAW_FRAMEBUFFER,null)}else if(oe!==0||A.isRenderTargetTexture||U.has(A)){const $t=U.get(A),wi=U.get(Y);De.bindFramebuffer(W.READ_FRAMEBUFFER,hn),De.bindFramebuffer(W.DRAW_FRAMEBUFFER,_l);for(let Nt=0;Nt<je;Nt++)ii?W.framebufferTextureLayer(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,$t.__webglTexture,oe,lt+Nt):W.framebufferTexture2D(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,$t.__webglTexture,oe),It?W.framebufferTextureLayer(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,wi.__webglTexture,ze,Jt+Nt):W.framebufferTexture2D(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,wi.__webglTexture,ze),oe!==0?W.blitFramebuffer(Xe,Je,ke,Be,Ke,Rt,ke,Be,W.COLOR_BUFFER_BIT,W.NEAREST):It?W.copyTexSubImage3D(Ve,ze,Ke,Rt,Jt+Nt,Xe,Je,ke,Be):W.copyTexSubImage2D(Ve,ze,Ke,Rt,Xe,Je,ke,Be);De.bindFramebuffer(W.READ_FRAMEBUFFER,null),De.bindFramebuffer(W.DRAW_FRAMEBUFFER,null)}else It?A.isDataTexture||A.isData3DTexture?W.texSubImage3D(Ve,ze,Ke,Rt,Jt,ke,Be,je,Ot,Pt,Wt.data):Y.isCompressedArrayTexture?W.compressedTexSubImage3D(Ve,ze,Ke,Rt,Jt,ke,Be,je,Ot,Wt.data):W.texSubImage3D(Ve,ze,Ke,Rt,Jt,ke,Be,je,Ot,Pt,Wt):A.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,ze,Ke,Rt,ke,Be,Ot,Pt,Wt.data):A.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,ze,Ke,Rt,Wt.width,Wt.height,Ot,Wt.data):W.texSubImage2D(W.TEXTURE_2D,ze,Ke,Rt,ke,Be,Ot,Pt,Wt);De.pixelStorei(W.UNPACK_ROW_LENGTH,Pn),De.pixelStorei(W.UNPACK_IMAGE_HEIGHT,vt),De.pixelStorei(W.UNPACK_SKIP_PIXELS,vn),De.pixelStorei(W.UNPACK_SKIP_ROWS,ni),De.pixelStorei(W.UNPACK_SKIP_IMAGES,Ci),ze===0&&Y.generateMipmaps&&W.generateMipmap(Ve),De.unbindTexture()},this.initRenderTarget=function(A){U.get(A).__webglFramebuffer===void 0&&b.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?b.setTextureCube(A,0):A.isData3DTexture?b.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?b.setTexture2DArray(A,0):b.setTexture2D(A,0),De.unbindTexture()},this.resetState=function(){ee=0,he=0,j=null,De.reset(),Re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const i=this.getContext();i.drawingBufferColorSpace=Tt._getDrawingBufferColorSpace(e),i.unpackColorSpace=Tt._getUnpackColorSpace()}}const Lv={type:"change"},Np={type:"start"},Tx={type:"end"},$c=new Cp,Ov=new us,UR=Math.cos(70*GM.DEG2RAD),Sn=new $,Qn=2*Math.PI,Xt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},gd=1e-6;class NR extends Ob{constructor(e,i=null){super(e,i),this.state=Xt.NONE,this.target=new $,this.cursor=new $,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Wr.ROTATE,MIDDLE:Wr.DOLLY,RIGHT:Wr.PAN},this.touches={ONE:jr.ROTATE,TWO:jr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new $,this._lastQuaternion=new ms,this._lastTargetPosition=new $,this._quat=new ms().setFromUnitVectors(e.up,new $(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ov,this._sphericalDelta=new ov,this._scale=1,this._panOffset=new $,this._rotateStart=new ot,this._rotateEnd=new ot,this._rotateDelta=new ot,this._panStart=new ot,this._panEnd=new ot,this._panDelta=new ot,this._dollyStart=new ot,this._dollyEnd=new ot,this._dollyDelta=new ot,this._dollyDirection=new $,this._mouse=new ot,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=OR.bind(this),this._onPointerDown=LR.bind(this),this._onPointerUp=PR.bind(this),this._onContextMenu=VR.bind(this),this._onMouseWheel=BR.bind(this),this._onKeyDown=zR.bind(this),this._onTouchStart=HR.bind(this),this._onTouchMove=GR.bind(this),this._onMouseDown=IR.bind(this),this._onMouseMove=FR.bind(this),this._interceptControlDown=kR.bind(this),this._interceptControlUp=XR.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Lv),this.update(),this.state=Xt.NONE}pan(e,i){this._pan(e,i),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const i=this.object.position;Sn.copy(i).sub(this.target),Sn.applyQuaternion(this._quat),this._spherical.setFromVector3(Sn),this.autoRotate&&this.state===Xt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let r=this.minAzimuthAngle,l=this.maxAzimuthAngle;isFinite(r)&&isFinite(l)&&(r<-Math.PI?r+=Qn:r>Math.PI&&(r-=Qn),l<-Math.PI?l+=Qn:l>Math.PI&&(l-=Qn),r<=l?this._spherical.theta=Math.max(r,Math.min(l,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(r+l)/2?Math.max(r,this._spherical.theta):Math.min(l,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let c=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const h=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),c=h!=this._spherical.radius}if(Sn.setFromSpherical(this._spherical),Sn.applyQuaternion(this._quatInverse),i.copy(this.target).add(Sn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let h=null;if(this.object.isPerspectiveCamera){const p=Sn.length();h=this._clampDistance(p*this._scale);const m=p-h;this.object.position.addScaledVector(this._dollyDirection,m),this.object.updateMatrixWorld(),c=!!m}else if(this.object.isOrthographicCamera){const p=new $(this._mouse.x,this._mouse.y,0);p.unproject(this.object);const m=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),c=m!==this.object.zoom;const d=new $(this._mouse.x,this._mouse.y,0);d.unproject(this.object),this.object.position.sub(d).add(p),this.object.updateMatrixWorld(),h=Sn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;h!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(h).add(this.object.position):($c.origin.copy(this.object.position),$c.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot($c.direction))<UR?this.object.lookAt(this.target):(Ov.setFromNormalAndCoplanarPoint(this.object.up,this.target),$c.intersectPlane(Ov,this.target))))}else if(this.object.isOrthographicCamera){const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),h!==this.object.zoom&&(this.object.updateProjectionMatrix(),c=!0)}return this._scale=1,this._performCursorZoom=!1,c||this._lastPosition.distanceToSquared(this.object.position)>gd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>gd||this._lastTargetPosition.distanceToSquared(this.target)>gd?(this.dispatchEvent(Lv),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Qn/60*this.autoRotateSpeed*e:Qn/60/60*this.autoRotateSpeed}_getZoomScale(e){const i=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,i){Sn.setFromMatrixColumn(i,0),Sn.multiplyScalar(-e),this._panOffset.add(Sn)}_panUp(e,i){this.screenSpacePanning===!0?Sn.setFromMatrixColumn(i,1):(Sn.setFromMatrixColumn(i,0),Sn.crossVectors(this.object.up,Sn)),Sn.multiplyScalar(e),this._panOffset.add(Sn)}_pan(e,i){const r=this.domElement;if(this.object.isPerspectiveCamera){const l=this.object.position;Sn.copy(l).sub(this.target);let c=Sn.length();c*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*c/r.clientHeight,this.object.matrix),this._panUp(2*i*c/r.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/r.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/r.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const r=this.domElement.getBoundingClientRect(),l=e-r.left,c=i-r.top,h=r.width,p=r.height;this._mouse.x=l/h*2-1,this._mouse.y=-(c/p)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(Qn*this._rotateDelta.x/i.clientHeight),this._rotateUp(Qn*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let i=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._rotateStart.set(r,l)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panStart.set(r,l)}}_handleTouchStartDolly(e){const i=this._getSecondPointerPosition(e),r=e.pageX-i.x,l=e.pageY-i.y,c=Math.sqrt(r*r+l*l);this._dollyStart.set(0,c)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const r=this._getSecondPointerPosition(e),l=.5*(e.pageX+r.x),c=.5*(e.pageY+r.y);this._rotateEnd.set(l,c)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(Qn*this._rotateDelta.x/i.clientHeight),this._rotateUp(Qn*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panEnd.set(r,l)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const i=this._getSecondPointerPosition(e),r=e.pageX-i.x,l=e.pageY-i.y,c=Math.sqrt(r*r+l*l);this._dollyEnd.set(0,c),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const h=(e.pageX+i.x)*.5,p=(e.pageY+i.y)*.5;this._updateZoomParameters(h,p)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(e){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId)return!0;return!1}_trackPointer(e){let i=this._pointerPositions[e.pointerId];i===void 0&&(i=new ot,this._pointerPositions[e.pointerId]=i),i.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const i=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(e){const i=e.deltaMode,r={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(i){case 1:r.deltaY*=16;break;case 2:r.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(r.deltaY*=10),r}}function LR(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function OR(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function PR(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Tx),this.state=Xt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],i=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:i.x,pageY:i.y});break}}function IR(s){let e;switch(s.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Wr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=Xt.DOLLY;break;case Wr.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=Xt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=Xt.ROTATE}break;case Wr.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=Xt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=Xt.PAN}break;default:this.state=Xt.NONE}this.state!==Xt.NONE&&this.dispatchEvent(Np)}function FR(s){switch(this.state){case Xt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case Xt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case Xt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function BR(s){this.enabled===!1||this.enableZoom===!1||this.state!==Xt.NONE||(s.preventDefault(),this.dispatchEvent(Np),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(Tx))}function zR(s){this.enabled!==!1&&this._handleKeyDown(s)}function HR(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case jr.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=Xt.TOUCH_ROTATE;break;case jr.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=Xt.TOUCH_PAN;break;default:this.state=Xt.NONE}break;case 2:switch(this.touches.TWO){case jr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=Xt.TOUCH_DOLLY_PAN;break;case jr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=Xt.TOUCH_DOLLY_ROTATE;break;default:this.state=Xt.NONE}break;default:this.state=Xt.NONE}this.state!==Xt.NONE&&this.dispatchEvent(Np)}function GR(s){switch(this._trackPointer(s),this.state){case Xt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case Xt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case Xt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case Xt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=Xt.NONE}}function VR(s){this.enabled!==!1&&s.preventDefault()}function kR(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function XR(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class jR extends Dp{constructor(e){super(e)}load(e,i,r,l){const c=this,h=new Cb(this.manager);h.setPath(this.path),h.setResponseType("arraybuffer"),h.setRequestHeader(this.requestHeader),h.setWithCredentials(this.withCredentials),h.load(e,function(p){try{i(c.parse(p))}catch(m){l?l(m):console.error(m),c.manager.itemError(e)}},r,l)}parse(e){function i(d){const _=new DataView(d),v=32/8*3+32/8*3*3+16/8,g=_.getUint32(80,!0);if(80+32/8+g*v===_.byteLength)return!0;const E=[115,111,108,105,100];for(let C=0;C<5;C++)if(r(E,_,C))return!1;return!0}function r(d,_,v){for(let g=0,M=d.length;g<M;g++)if(d[g]!==_.getUint8(v+g))return!1;return!0}function l(d){const _=new DataView(d),v=_.getUint32(80,!0);let g,M,E,C=!1,y,S,w,L,I;for(let z=0;z<70;z++)_.getUint32(z,!1)==1129270351&&_.getUint8(z+4)==82&&_.getUint8(z+5)==61&&(C=!0,y=new Float32Array(v*3*3),S=_.getUint8(z+6)/255,w=_.getUint8(z+7)/255,L=_.getUint8(z+8)/255,I=_.getUint8(z+9)/255);const V=84,N=50,O=new mi,T=new Float32Array(v*3*3),B=new Float32Array(v*3*3),Z=new dt;for(let z=0;z<v;z++){const Q=V+z*N,ee=_.getFloat32(Q,!0),he=_.getFloat32(Q+4,!0),j=_.getFloat32(Q+8,!0);if(C){const P=_.getUint16(Q+48,!0);(P&32768)===0?(g=(P&31)/31,M=(P>>5&31)/31,E=(P>>10&31)/31):(g=S,M=w,E=L)}for(let P=1;P<=3;P++){const H=Q+P*12,ne=z*3*3+(P-1)*3;T[ne]=_.getFloat32(H,!0),T[ne+1]=_.getFloat32(H+4,!0),T[ne+2]=_.getFloat32(H+8,!0),B[ne]=ee,B[ne+1]=he,B[ne+2]=j,C&&(Z.setRGB(g,M,E,Jn),y[ne]=Z.r,y[ne+1]=Z.g,y[ne+2]=Z.b)}}return O.setAttribute("position",new pi(T,3)),O.setAttribute("normal",new pi(B,3)),C&&(O.setAttribute("color",new pi(y,3)),O.hasColors=!0,O.alpha=I),O}function c(d){const _=new mi,v=/solid([\s\S]*?)endsolid/g,g=/facet([\s\S]*?)endfacet/g,M=/solid\s(.+)/;let E=0;const C=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,y=new RegExp("vertex"+C+C+C,"g"),S=new RegExp("normal"+C+C+C,"g"),w=[],L=[],I=[],V=new $;let N,O=0,T=0,B=0;for(;(N=v.exec(d))!==null;){T=B;const Z=N[0],z=(N=M.exec(Z))!==null?N[1]:"";for(I.push(z);(N=g.exec(Z))!==null;){let he=0,j=0;const P=N[0];for(;(N=S.exec(P))!==null;)V.x=parseFloat(N[1]),V.y=parseFloat(N[2]),V.z=parseFloat(N[3]),j++;for(;(N=y.exec(P))!==null;)w.push(parseFloat(N[1]),parseFloat(N[2]),parseFloat(N[3])),L.push(V.x,V.y,V.z),he++,B++;j!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+E),he!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+E),E++}const Q=T,ee=B-T;_.userData.groupNames=I,_.addGroup(Q,ee,O),O++}return _.setAttribute("position",new ei(w,3)),_.setAttribute("normal",new ei(L,3)),_}function h(d){return typeof d!="string"?new TextDecoder().decode(d):d}function p(d){if(typeof d=="string"){const _=new Uint8Array(d.length);for(let v=0;v<d.length;v++)_[v]=d.charCodeAt(v)&255;return _.buffer||_}else return d}const m=p(e);return i(m)?l(m):c(h(e))}}const WR=4;let lu=0;const ll=[],qR=12,ds=new Map;let hp=0;function YR(s){for(;ds.size>qR;){let e=null,i=1/0;for(const[l,c]of ds)l!==s&&!c.visible&&c.touch<i&&(i=c.touch,e=l);if(e===null)break;const r=ds.get(e);ds.delete(e),r.release()}}function ZR(s,e){const i=ds.get(s);i?(i.touch=++hp,i.release=e,i.visible=!0):ds.set(s,{release:e,touch:++hp,visible:!0}),YR(s)}function KR(s){ds.delete(s)}function Pv(s,e){const i=ds.get(s);i&&(i.visible=e,e&&(i.touch=++hp))}function _d(){for(;lu<WR&&ll.length;)ll.shift()?.()}function QR(s){let e=!1;const i=()=>{if(e){_d();return}lu+=1;let r=!1;s(()=>{r||(r=!0,lu=Math.max(0,lu-1),_d())})};return ll.push(i),_d(),()=>{e=!0;const r=ll.indexOf(i);r>=0&&ll.splice(r,1)}}const gu=new Map,eu=new Map;function JR(s){const e=gu.get(s);if(e)return Promise.resolve(e);const i=eu.get(s);if(i)return i;const r=new Promise((l,c)=>{new jR().load(s,h=>{gu.set(s,h),eu.delete(s),l(h)},void 0,h=>{eu.delete(s),c(h)})});return eu.set(s,r),r}const vd={schema_version:1,paper:{title:"P3D-Bench: Benchmarking MLLMs for Parametric 3D Generation and Structural Reasoning",authors:["Yikang Yang¹,*","Zhanpeng Hu¹,*","Youtian Lin¹","Mengqi Zhou¹","Jingxi Xu²","Feihu Zhang²","Jiaheng Liu¹","Yao Yao¹"],affiliations:["¹Nanjing University","²Envision","*Equal contribution."],abstract:"Multimodal large language models can write code to produce complex programs as well as use programs to do 3D modeling, which opens up a new avenue for 3D generation powered by their priors, world knowledge and reasoning. Yet existing benchmarks rarely evaluate 3D modeling through code. Such modeling demands more than runnable code: from a text or visual specification, a model must generate a parametric 3D program that is geometrically precise, semantically aligned and assembly-consistent. We introduce P3D-Bench, a benchmark for parametric 3D generation. Unlike a 3D mesh, a parametric 3D program exposes explicit dimensions, construction operations and part relations, revealing whether a model recovers a design's structure, not just its appearance. Under a unified protocol, P3D-Bench covers three task families (Text-to-3D, Image-to-3D and Assembly-3D) and scores each output for executability, geometric fidelity, topology, text-grounded constraints, multiview semantic alignment and part-level structure. We evaluate frontier MLLMs and text-only LLMs on 400 text cases, 400 image cases and 203 annotated assemblies, with domain-specific models as reference points. Our extensive evaluation yields three findings. First, assemblies are the hardest setting, where models still fail to compose multiple parts into a coherent structure. Second, models can often recover the global shape and semantic identity of the target object, yet fail to reproduce the precise parametric geometry specified by the input. Third, part-level modeling remains weak on assemblies, where models recover neither the geometry of each part nor the right number of parts. These results position P3D-Bench as a benchmark for evaluating precise parametric geometry and part-level structure in parametric 3D generation. Project page: https://lucasqaq.github.io/p3d/.",links:{paper:"https://arxiv.org/abs/2606.11152v1",code:"https://github.com/SpatiaOS/P3D-Bench",dataset:"https://huggingface.co/datasets/SpatiaOS/P3D-Bench"}},tasks:[{id:"text2cad",label:"Text-to-3D",formats:["JSON","OpenSCAD"],status:"interactive"},{id:"image2cad",label:"Image-to-3D",formats:["CadQuery","OpenSCAD","Three.js"],status:"interactive"},{id:"text_image2cad",label:"Assembly-3D",formats:["CadQuery","OpenSCAD"],status:"interactive"}],models:[],cases:[],runs:[],figures:[{id:"pipeline",title:"Pipeline",placeholder:!0},{id:"leaderboard",title:"Leaderboard",placeholder:!0}],gallery:[]};function Vn(s){return s?s.startsWith("http")||s.startsWith("/")?s:`${"/projects/P3D-Bench/".endsWith("/")?"/projects/P3D-Bench/":"/projects/P3D-Bench//"}demo/${s}`:""}function $R(){const[s,e]=Qe.useState(vd),[i,r]=Qe.useState([]),[l,c]=Qe.useState("text2cad"),[h,p]=Qe.useState(""),[m,d]=Qe.useState(""),[_,v]=Qe.useState("descriptive"),[g,M]=Qe.useState("openscad"),[E,C]=Qe.useState("");Qe.useEffect(()=>{fetch(Vn("manifest.json?v=textcases5-fullmetrics-20260612")).then(K=>K.ok?K.json():vd).then(K=>e(K)).catch(()=>e(vd))},[]),Qe.useEffect(()=>{fetch(Vn("complex_assemblies.json")).then(K=>K.ok?K.json():{items:[]}).then(K=>r(Array.isArray(K.items)?K.items:[])).catch(()=>r([]))},[]);const y=Qe.useMemo(()=>s.runs.filter(K=>K.task===l&&Ax(K)&&!s.cases.some(we=>we.id===K.case_id&&we.showcase_only)),[s,l]),S=Qe.useMemo(()=>s3(y),[y]),w=Qe.useMemo(()=>y.filter(K=>S.has(K.case_id)),[y,S]),L=Qe.useMemo(()=>s.cases.filter(K=>K.task===l&&S.has(K.id)),[S,s,l]),I=Qe.useMemo(()=>Array.from(new Set(w.map(K=>K.format))).sort((K,we)=>vu(K)-vu(we)),[w]),V=Qe.useMemo(()=>s.models.map(K=>K.id).filter(K=>y.some(we=>we.model===K)),[y,s.models]),N=Qe.useMemo(()=>h&&L.some(K=>K.id===h)?h:L[0]?.id||"",[h,L]),O=Qe.useMemo(()=>w.filter(K=>K.case_id===N),[N,w]),T=Qe.useMemo(()=>g&&I.includes(g)?g:I[0]||Nn(O)?.format||"",[g,I,O]),B=Qe.useMemo(()=>O.filter(K=>K.format===T),[O,T]),Z=Qe.useMemo(()=>new Set(B.map(K=>K.model)),[B]),z=Qe.useMemo(()=>m&&V.includes(m)?m:Nn(B)?.model||Nn(O)?.model||V[0]||"",[m,V,B,O]),Q=!!z&&V.includes(z)&&!Z.has(z),ee=Qe.useMemo(()=>Q?void 0:Nn(B.filter(K=>K.model===z&&K.spec===_))||Nn(B.filter(K=>K.model===z))||Nn(B.filter(K=>K.spec===_))||Nn(B)||Nn(O)||Nn(w),[Q,B,z,_,O,w]),he=Qe.useMemo(()=>Nn(O),[O]),j=ee?.spec||_,P=Qe.useMemo(()=>s.models.filter(K=>V.includes(K.id)),[V,s.models]),H=Qe.useMemo(()=>O.filter(K=>K.model===z),[z,O]),ne=I.length?I:H.map(K=>K.format);Qe.useMemo(()=>r3(L,w),[L,w]),Qe.useEffect(()=>{ee&&(h!==ee.case_id&&p(ee.case_id),m!==ee.model&&d(ee.model),_!==ee.spec&&v(ee.spec),g!==ee.format&&M(ee.format))},[h,g,m,ee,_]);const pe=s.cases.find(K=>K.id===N),ye=s.models.find(K=>K.id===z),F=s.tasks.find(K=>K.id===ee?.task),q=Qe.useMemo(()=>e3(s),[s]),Se=Qe.useMemo(()=>s.tasks.filter(K=>K.status==="interactive"),[s]),Ae=L.some(K=>K.thumbnail),Ce=ee?.condition||pe?.title||"No input.";ee&&(pe?.title||`${ee.case_id}`,ee.task,F?.label||ee.task,_u(ee.spec),Ae||ee.assets.input_image,`${ye?.label||ee.model}${ks(ee.format)}`);const se=K=>{K&&(p(K.case_id),d(K.model),v(K.spec),M(K.format))},Me=K=>Nn(w.filter(we=>we.case_id===K&&we.model===z&&we.spec===j&&we.format===T))||Nn(w.filter(we=>we.case_id===K&&we.model===z&&we.spec===j))||Nn(w.filter(we=>we.case_id===K&&we.model===z))||Nn(w.filter(we=>we.case_id===K));Qe.useEffect(()=>{const K=ee?.assets.generated||ee?.assets.generated_json;if(!K){C("");return}fetch(Vn(K)).then(we=>we.ok?we.text():"").then(C).catch(()=>C(""))},[ee]);const be=s.paper;return D.jsxs("main",{children:[D.jsxs("nav",{className:"nav",children:[D.jsx("a",{className:"brand",href:"#top",children:"P3D-Bench"}),D.jsxs("div",{children:[D.jsx("a",{href:"#overview",children:"Overview"}),D.jsx("a",{href:"#leaderboard",children:"Leaderboard"}),D.jsx("a",{href:"#results",children:"Results"}),D.jsx("a",{href:"#dataset",children:"Dataset"})]})]}),D.jsxs("section",{id:"top",className:"hero",children:[D.jsxs("div",{className:"hero-copy",children:[D.jsxs("h1",{className:"hero-title",children:[D.jsx("span",{children:"P3D-Bench"}),D.jsxs("small",{children:["Benchmarking MLLMs for ",D.jsx("em",{children:"Parametric 3D"})," Generation and ",D.jsx("em",{children:"Structural Reasoning"})]})]}),D.jsx("div",{className:"authors",children:be.authors.map(K=>D.jsx("span",{className:"author-name",children:w3(K)},K))}),D.jsx("div",{className:"affiliations",children:be.affiliations?.map(K=>D.jsx("span",{className:"affiliation-item",children:D3(K)},K))}),D.jsxs("div",{className:"actions",children:[D.jsxs("a",{href:be.links?.paper||"https://arxiv.org/abs/2606.11152v1",children:[D.jsx(Ky,{size:17})," Paper"]}),D.jsxs("a",{href:be.links?.code||"https://github.com/SpatiaOS/P3D-Bench",children:[D.jsx(iM,{size:17})," Code"]}),D.jsxs("a",{href:be.links?.dataset||"https://huggingface.co/datasets/SpatiaOS/P3D-Bench",children:[D.jsx(nM,{size:17})," Dataset"]})]})]}),D.jsx(c3,{}),D.jsxs("div",{className:"abstract-panel",children:[D.jsx("p",{className:"eyebrow",children:"Abstract"}),D.jsx("p",{className:"abstract",dangerouslySetInnerHTML:{__html:be.abstract}})]})]}),D.jsx("section",{id:"overview",className:"section overview-section",children:D.jsxs("figure",{className:"overview-figure-block",children:[D.jsx("img",{src:Vn("figures/fig2_leaderboard_raster.jpg"),alt:"P3D-Bench overview: tasks, evaluated models and output formats, and evaluation metrics"}),D.jsx("figcaption",{children:"P3D-Bench evaluates MLLMs and domain-specific models on three parametric-CAD tasks — Text-to-3D, Image-to-3D and Assembly-3D — across four code formats (JSON, OpenSCAD, CadQuery, Three.js), scoring geometric fidelity, mesh topology, an MLLM judge and part-level structure."})]})}),D.jsxs("section",{id:"leaderboard",className:"section leaderboard-section",children:[D.jsxs("div",{className:"section-heading",children:[D.jsx("h2",{children:"Leaderboard"}),D.jsx("p",{children:"Per-task results by output format"})]}),D.jsx(d3,{})]}),D.jsx("section",{className:"task-strip",children:Se.map(K=>D.jsxs("button",{className:l===K.id?"task-card active":"task-card",onClick:()=>c(K.id),children:[D.jsx("span",{children:K.label}),D.jsx("strong",{children:K.formats.join(" / ")})]},K.id))}),D.jsxs("section",{id:"results",className:"section",children:[D.jsx("div",{className:"section-heading",children:D.jsx("h2",{children:"Interactive Results"})}),w.length?D.jsxs("div",{className:"workbench",children:[D.jsxs("aside",{className:"controls",children:[D.jsx(tu,{label:"Case",value:N,options:L.map(K=>[K.id,K.title]),onChange:K=>se(Me(K))}),Ae?D.jsx(A3,{cases:L,activeCaseId:N,onSelect:K=>se(Me(K))}):null,D.jsx(tu,{label:"Model",value:z,options:P.map(K=>[K.id,Z.has(K.id)?K.label:`${K.label} — validation failed`]),onChange:K=>Z.has(K)?se(Nn(B.filter(we=>we.model===K&&we.spec===j))||Nn(B.filter(we=>we.model===K))):d(K)}),D.jsx(tu,{label:"Format",value:T,options:ne.map(K=>[K,ks(K)]),onChange:K=>M(K)}),(()=>{const K=Array.from(new Set(O.filter(we=>we.model===z).map(we=>we.spec))).sort((we,Ze)=>$r(we)-$r(Ze)).map(we=>[we,_u(we)]);return K.length>1?D.jsx(tu,{label:"Input protocol",value:j,options:K,onChange:we=>se(Nn(O.filter(Ze=>Ze.model===z&&Ze.spec===we)))}):null})(),l!=="image2cad"?D.jsx(xd,{title:"Input",icon:D.jsx(Gv,{size:16}),children:D.jsxs("div",{className:"condition-body",children:[ee?.assets.input_image&&!Ae?D.jsx("img",{className:"condition-image",src:Vn(ee.assets.input_image),alt:"Input reference"}):null,D.jsx(Lp,{task:ee?.task,text:Ce})]})}):null,D.jsx(xd,{title:"Metrics",icon:D.jsx(mp,{size:16}),children:D.jsx(L3,{run:ee||(Q?{valid:!1}:void 0)})}),D.jsx(xd,{title:`Generated ${ks(T)}`,icon:D.jsx(tM,{size:16}),children:D.jsx("div",{className:"code-panel",children:D.jsx("pre",{children:D.jsx("code",{children:E||"No generated output."})})})})]}),D.jsx("div",{className:"result-stage",children:D.jsxs("div",{className:"render-pair",children:[D.jsx(b3,{run:ee||he,title:pe?.title||"Ground Truth",subtitle:"Reference geometry"}),Q?D.jsx(T3,{modelLabel:ye?.label||z,formatLabel:ks(T)}):D.jsx(E3,{run:ee,title:pe?.title||"Prediction",subtitle:`${ye?.label||ee?.model||""}${ee?` / ${ks(ee.format)}`:""}`})]})})]}):D.jsx(Nx,{title:"Results"})]}),D.jsxs("section",{id:"gallery",className:"section",children:[D.jsx("div",{className:"section-heading",children:D.jsx("h2",{children:"Render Showcase"})}),D.jsx(g3,{comparisons:q,assemblies:i})]}),D.jsxs("section",{id:"dataset",className:"section dataset-section",children:[D.jsxs("div",{className:"section-heading",children:[D.jsx("h2",{children:"Dataset"}),D.jsx("p",{children:"P3D-Dataset construction and statistics"})]}),D.jsxs("div",{className:"dataset-figures",children:[D.jsxs("figure",{className:"dataset-figure dataset-figure-wide",children:[D.jsx("img",{src:Vn("figures/SpatialVID_pipeline_raster.jpg"),alt:"Overview of the P3D-Dataset construction pipeline"}),D.jsx("figcaption",{children:"Overview of the P3D-Dataset construction pipeline: filtering and annotation over Text2CAD and the Fusion 360 Gallery."})]}),D.jsxs("figure",{className:"dataset-figure",children:[D.jsx("img",{src:Vn("figures/cad_gallery_combined_axis.jpg"),alt:"Example dataset cases across easy, medium and hard complexity"}),D.jsx("figcaption",{children:"Example cases at the easy, medium and hard complexity levels."})]}),D.jsxs("figure",{className:"dataset-figure",children:[D.jsx("img",{src:Vn("figures/fig_leaderboard_data_static.png"),alt:"Semantic category distribution of the Text-to-3D and Image-to-3D sets"}),D.jsx("figcaption",{children:"Semantic category distribution of the Text-to-3D and Image-to-3D sets."})]})]})]}),D.jsxs("section",{id:"citation",className:"section citation",children:[D.jsx("div",{className:"citation-heading",children:D.jsx("h2",{children:"Citation"})}),D.jsx("pre",{children:D.jsx("code",{children:`@misc{yang2026p3dbenchbenchmarkingmllmsparametric,
      title={P3D-Bench: Benchmarking MLLMs for Parametric 3D Generation and Structural Reasoning},
      author={Yikang Yang and Zhanpeng Hu and Youtian Lin and Mengqi Zhou and Jingxi Xu and Feihu Zhang and Jiaheng Liu and Yao Yao},
      year={2026},
      eprint={2606.11152},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2606.11152},
}`})})]})]})}function e3(s){const e=["text2cad","image2cad"],i={text2cad:["openscad","json"],image2cad:["cadquery","openscad","threejs"],text_image2cad:["cadquery","openscad"]},r=new Map(s.tasks.map(p=>[p.id,p.label])),l=new Map(s.models.map(p=>[p.id,p])),c=new Map(s.cases.map(p=>[p.id,p])),h=s.runs.filter(p=>Ax(p)&&p.valid!==!1);return e.map(p=>{const m=s.cases.filter(y=>y.task===p),d=i[p]||[],_=i3[p]??9;let v=null;if(m.forEach((y,S)=>{const w=h.filter(T=>T.task===p&&T.case_id===y.id),L=a3(w,d,_);if(L.length<3)return;const I=L.reduce((T,B)=>T+Math.max(0,16-dp(B.model)),0),V=(n3[p]||[]).indexOf(y.id),N=V>=0?4e4-V*1e4:Math.max(0,80-S),O=L.length*1e3+N+I*2+L.reduce((T,B)=>T+Ws(B)*.04,0);(!v||O>v.score)&&(v={score:O,caseId:y.id,runs:L})}),!v)return null;const g=v.runs[0],M=c.get(v.caseId),E=new Map;v.runs.forEach(y=>E.set(y.format,(E.get(y.format)||0)+1));const C=Array.from(E.entries()).sort((y,S)=>S[1]-y[1]||d.indexOf(y[0])-d.indexOf(S[0]))[0]?.[0]||g.format;return{id:`${p}-${v.caseId}`,task:p,taskLabel:r.get(p)||p,title:t3(p,v.caseId,M?.title),input:g.condition||M?.title||`Case ${v.caseId}`,inputImage:g.assets.input_image||M?.thumbnail,gtRender:g.assets.gt_render||"",gtMesh:g.assets.gt_mesh||"",formatLabel:ks(C),specLabel:_u(g.spec),variants:v.runs.map(y=>{const S=l.get(y.model);return{id:y.id,task:y.task,model:y.model,modelLabel:S?.label||y.model,family:S?.family||"",formatLabel:ks(y.format),specLabel:_u(y.spec),src:y.assets.pred_render||"",mesh:y.assets.mesh||""}})}}).filter(p=>!!p)}function t3(s,e,i){return s==="text2cad"?`Text Case · ${e.split("/").pop()||e}`:i||`Case ${e.split("/").pop()||e}`}const Iv=["gpt55-reason","gemini-reason","kimi_k26-reason","claude-reason","deepseek_v4pro-reason","qwen-reason","mimo_omni-reason","doubao-reason","glm_5v_turbo-reason","glm-reason","mimo_v25-reason"],n3={text2cad:["0046/00460772","0047/00478097","0080/00802746"],image2cad:["78113_df39c641"],text_image2cad:["textimage2cad/144940_885193da"]},i3={text2cad:9,image2cad:8};function a3(s,e,i){const r=c=>{const h=e.indexOf(c);return h===-1?e.length:h},l=new Map;return s.forEach(c=>{const h=l.get(c.model);if(!h){l.set(c.model,c);return}(Ws(c)-Ws(h)||r(h.format)-r(c.format)||$r(h.spec)-$r(c.spec)||h.id.localeCompare(c.id))>0&&l.set(c.model,c)}),Array.from(l.values()).sort((c,h)=>{const p=dp(c.model)-dp(h.model);return p||Ws(h)-Ws(c)||c.id.localeCompare(h.id)}).slice(0,i)}function dp(s){const e=Iv.indexOf(s);return e===-1?Iv.length:e}function Ax(s){return!!((s.condition||"").trim()&&(s.assets.generated||s.assets.generated_json)&&s.assets.gt_mesh&&s.assets.gt_render&&s.assets.mesh&&s.assets.pred_render)}function s3(s){return new Set(s.map(e=>e.case_id))}function r3(s,e){const i=new Set(s.map(p=>p.id)),r=new Set(e.map(p=>p.model)),l=new Set(e.map(p=>p.format)),c=new Set(e.map(p=>`${p.case_id}/${p.model}/${p.format}`)),h=i.size*r.size*l.size;return{invalidCount:Math.max(0,h-c.size),caseCount:i.size,modelCount:r.size,formatCount:l.size}}function Nn(s){return[...s].sort((e,i)=>{const r=+(i.valid!==!1)-+(e.valid!==!1);if(r)return r;const l=vu(e.format)-vu(i.format);if(l)return l;const c=Ws(i)-Ws(e);if(c)return c;const h=$r(e.spec)-$r(i.spec);return h||e.id.localeCompare(i.id)})[0]}function _u(s){return s==="image"?"Image input":s==="image_text"?"Image + text input":s==="parametric"?"Parametric input":"Descriptive input"}function ks(s){return s==="json"?"JSON":s==="openscad"?"OpenSCAD":s==="cadquery"?"CadQuery":s==="threejs"?"Three.js":s}function o3(s){const i=["textimage2cad/24584_a13ef50c","textimage2cad/20260_4a01a99d"].map(r=>s.find(l=>l.case_id===r)).filter(r=>!!r);return i.length>=2?i.slice(0,2):[...i,...s.filter(r=>!i.some(l=>l.id===r.id))].slice(0,2)}function $r(s){return s==="parametric"?0:s==="image_text"||s==="image"?1:s==="descriptive"?2:3}function vu(s){return s==="json"?0:s==="cadquery"?1:s==="openscad"?2:s==="threejs"?3:4}const Rx={openai:{color:"#202123",icon:"icons/src/openai.svg"},gemini:{color:"#14B86A",icon:"icons/src/gemini-color.svg"},claude:{color:"#D97757",icon:"icons/src/claude-color.svg"},kimi:{color:"#1783FF",icon:"icons/src/kimi-color.svg",tile:"#111619"},zai:{color:"#8E5CFB",icon:"icons/src/zai.svg"},doubao:{color:"#00A6B8",icon:"icons/src/bytedance-color.svg"},deepseek:{color:"#4D6BFE",icon:"icons/src/deepseek-color.svg"},qwen:{color:"#FF6003",icon:"icons/src/qwen-color.svg"},mimo:{color:"#FF6900",icon:"icons/src/xiaomimimo.svg",tile:"#111619",filter:"invert(1)"}},l3={openai:"#304771",gemini:"#3f5e8b",claude:"#4e779e",kimi:"#6993ab",zai:"#83adb4",deepseek:"#e3c49c",qwen:"#b0c2b8",mimo:"#dcc8ae",doubao:"#edd7c0"};function c3(){return D.jsx("div",{className:"main-figures",children:D.jsx("figure",{className:"leaderboard-figure",children:D.jsx("a",{href:"./figures/fig_tasks_grouped_bars.pdf","aria-label":"Open leaderboard figure PDF",children:D.jsx("img",{src:"./figures/fig_tasks_grouped_bars.svg?v=vector-qwen-20260609",alt:"Task overview: grouped bar scores across text, image and assembly tasks"})})})})}const u3=[{key:"text",title:"Text-to-3D",accent:"var(--blue)",superGroups:[{label:"Descriptive",span:6},{label:"Parametric",span:12}],groups:[{label:"JSON",span:2},{label:"OpenSCAD",span:2},{label:"Average",span:2},{label:"JSON",span:4},{label:"OpenSCAD",span:4},{label:"Average",span:4}],metrics:["Judge","Valid","Judge","Valid","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid"],rows:[{model:"GPT-5.5",family:"openai",cells:"0.805! 1.000! 0.945^ 0.995^ 0.875! 0.998^ 0.696! 0.997! 0.773! 1.000! 0.715! 0.997 0.850! 0.998^ 0.706! 0.997^ 0.812! 0.999^"},{model:"Gemini 3.1 Pro",family:"gemini",cells:"0.783 1.000! 0.947! 0.998! 0.865^ 0.999! 0.686^ 0.997^ 0.726 1.000! 0.711^ 1.000! 0.826^ 1.000! 0.699^ 0.998! 0.776 1.000!"},{model:"Claude Opus 4.6",family:"claude",cells:"0.779 0.998^ 0.921 0.993 0.850 0.995 0.682 0.987 0.753^ 0.990 0.702 1.000! 0.823 1.000! 0.692 0.993 0.788^ 0.995"},{model:"Kimi K2.6",family:"kimi",cells:"0.704 0.912 0.905 0.985 0.804 0.949 0.667 0.976 0.628 0.978 0.691 0.997 0.804 0.998^ 0.679 0.987 0.716 0.988"},{model:"GLM-5.1",family:"zai",cells:"0.802^ 0.970 0.817 0.912 0.810 0.941 0.678 0.989 0.635 0.993 0.654 0.940 0.739 0.940 0.666 0.964 0.687 0.966"},{model:"Doubao Seed 2.0 Pro",family:"doubao",cells:"0.705 0.988 0.740 0.960 0.723 0.974 0.625 0.982 0.681 0.990 0.640 0.985 0.739 0.985 0.633 0.984 0.710 0.988"},{model:"DeepSeek V4 Pro",family:"deepseek",cells:"0.635 0.970 0.764 0.927 0.699 0.949 0.640 0.957 0.701 0.960 0.655 0.975 0.770 0.975 0.647 0.966 0.735 0.968"},{model:"Qwen3.6-Plus",family:"qwen",cells:"0.527 0.985 0.807 0.990 0.667 0.988 0.638 0.990 0.590 0.993 0.662 0.995 0.772 0.995 0.650 0.992 0.681 0.994"},{model:"MiMo v2.5 Pro",family:"mimo",cells:"0.607 0.993 0.741 0.978 0.674 0.985 0.629 0.975 0.645 0.980 0.633 0.992 0.731 0.993 0.631 0.984 0.688 0.986"}],domainRows:[{model:"Text2CAD",cells:"0.055 0.945 - - 0.055 0.945 0.268 0.963 0.057 0.965 - - - - 0.268 0.963 0.057 0.965"}]},{key:"image",title:"Image-to-3D",accent:"var(--teal)",groups:[{label:"CadQuery",span:4},{label:"OpenSCAD",span:4},{label:"Three.js",span:4},{label:"Average",span:4}],metrics:["Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid"],rows:[{model:"GPT-5.5",family:"openai",cells:"0.524! 0.914! 0.526! 0.937! 0.567^ 1.000! 0.592! 1.000! 0.556^ 0.828 0.569^ 1.000! 0.549^ 0.914! 0.562! 0.979!"},{model:"Gemini 3.1 Pro",family:"gemini",cells:"0.507^ 0.878 0.469^ 0.911 0.569! 0.999^ 0.576^ 1.000! 0.581! 0.853! 0.576! 0.998^ 0.552! 0.910^ 0.540^ 0.970"},{model:"Claude Opus 4.6",family:"claude",cells:"0.497 0.908^ 0.383 0.926^ 0.536 1.000! 0.463 1.000! 0.541 0.802 0.447 0.998^ 0.525 0.903 0.431 0.975^"},{model:"Kimi K2.6",family:"kimi",cells:"0.432 0.846 0.299 0.881 0.517 1.000! 0.421 1.000! 0.541 0.849^ 0.427 1.000! 0.497 0.898 0.382 0.960"},{model:"GLM 5V Turbo",family:"zai",cells:"0.307 0.694 0.147 0.705 0.458 0.977 0.249 0.977 0.493 0.802 0.296 1.000! 0.419 0.824 0.230 0.894"},{model:"Qwen3.6-Plus",family:"qwen",cells:"0.221 0.470 0.130 0.493 0.466 0.995 0.287 0.995 0.507 0.844 0.350 0.998^ 0.398 0.770 0.256 0.828"},{model:"MiMo v2 Omni",family:"mimo",cells:"0.205 0.551 0.080 0.565 0.455 0.997 0.218 0.998^ 0.474 0.846 0.240 0.998^ 0.378 0.798 0.180 0.853"},{model:"Doubao Seed 2.0 Pro",family:"doubao",cells:"0.143 0.323 0.085 0.335 0.461 0.990 0.245 0.990 0.518 0.849^ 0.318 1.000! 0.374 0.721 0.216 0.775"}],domainRows:[{model:"Cadrille",cells:"0.235 0.789 0.010 0.820 - - - - - - - - 0.235 0.789 0.010 0.820"},{model:"CAD-Coder",cells:"0.133 0.361 0.014 0.370 - - - - - - - - 0.133 0.361 0.014 0.370"}]},{key:"assembly",title:"Assembly-3D",accent:"var(--coral)",groups:[{label:"CadQuery",span:5},{label:"OpenSCAD",span:5},{label:"Average",span:5}],metrics:["Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid"],rows:[{model:"GPT-5.5",family:"openai",cells:"0.570! 0.948! 0.527! 0.610! 0.985! 0.603! 0.985 0.555! 0.649! 0.985 0.586! 0.966! 0.541! 0.629! 0.985!"},{model:"Gemini 3.1 Pro",family:"gemini",cells:"0.532^ 0.899^ 0.461^ 0.595^ 0.931^ 0.600^ 0.989^ 0.553^ 0.641^ 0.989^ 0.566^ 0.944^ 0.507^ 0.618^ 0.960^"},{model:"Claude Opus 4.6",family:"claude",cells:"0.508 0.890 0.330 0.564 0.925 0.542 0.962 0.423 0.582 0.963 0.525 0.926 0.376 0.573 0.944"},{model:"Kimi K2.6",family:"kimi",cells:"0.411 0.796 0.260 0.494 0.844 0.517 0.990! 0.343 0.603 0.990! 0.464 0.893 0.302 0.548 0.917"},{model:"MiMo v2 Omni",family:"mimo",cells:"0.174 0.414 0.065 0.234 0.430 0.438 0.990! 0.175 0.542 0.990! 0.306 0.702 0.120 0.388 0.710"},{model:"Qwen3.6-Plus",family:"qwen",cells:"0.142 0.287 0.087 0.166 0.308 0.485 0.985 0.238 0.536 0.985 0.314 0.636 0.163 0.351 0.647"},{model:"GLM 5V Turbo",family:"zai",cells:"0.138 0.288 0.061 0.166 0.293 0.430 0.941 0.197 0.509 0.941 0.284 0.615 0.129 0.338 0.617"},{model:"Doubao Seed 2.0 Pro",family:"doubao",cells:"0.101 0.217 0.054 0.128 0.224 0.434 0.963 0.203 0.515 0.964 0.267 0.590 0.129 0.322 0.594"}]}];function f3(s){const e=new Set;let i=0;return s.forEach((r,l)=>{l>0&&e.add(i),i+=r.span}),e}function h3({token:s,groupStart:e}){const i=e?"rt-cell group-start":"rt-cell";return s==="-"?D.jsx("td",{className:`${i} na`,children:"—"}):s.endsWith("!")?D.jsx("td",{className:`${i} best`,children:s.slice(0,-1)}):s.endsWith("^")?D.jsx("td",{className:`${i} second`,children:s.slice(0,-1)}):D.jsx("td",{className:i,children:s})}function d3(){return D.jsx("div",{className:"results-tables",children:u3.map(s=>D.jsx(p3,{sub:s},s.key))})}function p3({sub:s}){const e=f3(s.groups),i=s.superGroups?3:2,r=(l,c)=>{const h=l.family?Rx[l.family]:void 0,p=l.cells.trim().split(/\s+/);return D.jsxs("tr",{className:c?"rt-row rt-domain":"rt-row",children:[D.jsx("th",{scope:"row",className:"rt-model-col",children:D.jsxs("span",{className:"rt-model",children:[h?D.jsx("span",{className:"model-mark",style:{"--model-tile":h.tile||"#fffdfa","--icon-filter":h.filter||"none"},children:D.jsx("img",{src:Vn(h.icon),alt:"","aria-hidden":"true"})}):D.jsx("span",{className:"model-mark rt-mark-empty","aria-hidden":"true"}),D.jsx("strong",{children:l.model})]})}),p.map((m,d)=>D.jsx(h3,{token:m,groupStart:e.has(d)},d))]},l.model)};return D.jsxs("div",{className:"rt-block",style:{"--rt-accent":s.accent},children:[D.jsx("div",{className:"rt-block-head",children:D.jsx("span",{className:"rt-tag",children:s.title})}),D.jsx("div",{className:"rt-scroll",children:D.jsxs("table",{className:"results-table",children:[D.jsxs("thead",{children:[s.superGroups?D.jsxs("tr",{className:"rt-superrow",children:[D.jsx("th",{rowSpan:i,className:"rt-model-col rt-corner",children:"Model"}),s.superGroups.map((l,c)=>D.jsx("th",{colSpan:l.span,className:c>0?"rt-super group-start":"rt-super",children:l.label},c))]}):null,D.jsxs("tr",{className:"rt-grouprow",children:[s.superGroups?null:D.jsx("th",{rowSpan:2,className:"rt-model-col rt-corner",children:"Model"}),s.groups.map((l,c)=>D.jsx("th",{colSpan:l.span,className:c>0?"rt-group group-start":"rt-group",children:l.label},c))]}),D.jsx("tr",{className:"rt-metricrow",children:s.metrics.map((l,c)=>D.jsx("th",{className:e.has(c)?"rt-metric group-start":"rt-metric",children:l},c))})]}),D.jsxs("tbody",{children:[s.rows.map(l=>r(l,!1)),s.domainRows?s.domainRows.map(l=>r(l,!0)):null]})]})})]})}function Ws(s){const e=s.metrics||{};let i=s.valid===!1?-200:20;const r=m3(s);return i+=r*35,r||(i-=90),i+=kr(e.qa_overall??e.qa_overall_accuracy)*120,i+=kr(e.qa_semantic)*28,i+=kr(e.qa_parametric)*16,i+=kr(e.judge_geometry)*3,i+=kr(e.judge_semantic)*3,i+=kr(e.judge_aesthetics)*3,typeof e.chamfer_distance=="number"&&e.chamfer_distance>0&&(i+=Math.max(0,18-Math.log10(e.chamfer_distance*1e4+1)*5)),i}function kr(s){return typeof s=="number"&&Number.isFinite(s)?s:0}function m3(s){return Object.entries(s.metrics||{}).filter(([e,i])=>Ux(e,i,s)).length}function Cx({items:s,itemKey:e,renderItem:i,gridClassName:r,windowSize:l=3,ariaLabel:c,start:h,onStartChange:p,loop:m=!1}){const[d,_]=Qe.useState(0),v=h!==void 0,g=Math.max(0,s.length-l),M=Math.min(v?h:d,g),E=N=>{const O=Math.max(0,Math.min(N,g));v?p?.(O):_(O)},C=()=>E(m&&M<=0?g:M-1),y=()=>E(m&&M>=g?0:M+1),S=Qe.useRef(null),w=Qe.useRef(M);Qe.useEffect(()=>{const N=w.current;if(N===M)return;let O;N===g&&M===0?O=1:N===0&&M===g?O=-1:O=M>N?1:-1,w.current=M;const T=S.current;T&&typeof T.animate=="function"&&T.animate([{transform:`translateX(${O*30}px)`,opacity:.35},{transform:"translateX(0)",opacity:1}],{duration:300,easing:"cubic-bezier(0.22, 0.61, 0.36, 1)"})},[M,g]);const L=s.slice(M,M+l),I=s.length>l,V=Math.min(l,s.length)||1;return D.jsxs("div",{className:`model-carousel ${I?"has-nav":""}`,"aria-label":c,children:[I?D.jsx("button",{type:"button",className:"carousel-arrow carousel-arrow-prev",onClick:C,disabled:!m&&M<=0,"aria-label":"Show previous models",children:D.jsx(Jy,{size:20})}):null,D.jsx("div",{ref:S,className:r,style:{"--grid-cols":V,"--grid-cols-md":V},children:L.map(N=>D.jsx(zy.Fragment,{children:i(N)},e(N)))}),I?D.jsx("button",{type:"button",className:"carousel-arrow carousel-arrow-next",onClick:y,disabled:!m&&M>=g,"aria-label":"Show next models",children:D.jsx($y,{size:20})}):null,I?D.jsx("div",{className:"carousel-track",role:"tablist","aria-label":"Model pages",children:Array.from({length:g+1}).map((N,O)=>D.jsx("button",{type:"button",role:"tab","aria-selected":O===M,className:`carousel-tick ${O===M?"is-active":""}`,onClick:()=>E(O),"aria-label":`Show models from position ${O+1}`},O))}):null]})}function g3({comparisons:s,assemblies:e}){const i=Qe.useMemo(()=>o3(e),[e]),r=Qe.useMemo(()=>[...s.map((d,_)=>({key:d.id,label:d.taskLabel,title:d.title,kind:"comparison",comparison:d,index:_})),...i.map(d=>({key:d.id,label:"Assembly-3D",title:d.title||d.short_case_id,kind:"assembly",assembly:d,index:0}))],[s,i]),[l,c]=Qe.useState(0),[h,p]=Qe.useState(null);if(!r.length)return D.jsx(Nx,{title:"Render Showcase"});const m=r[Math.min(l,r.length-1)];return D.jsxs("div",{className:"render-showcase",children:[D.jsx("div",{className:"showcase-tabs",role:"tablist","aria-label":"Showcase cases",children:r.map((d,_)=>D.jsxs("button",{type:"button",role:"tab","aria-selected":_===l,className:`showcase-tab ${_===l?"is-active":""}`,onClick:()=>c(_),children:[D.jsx("span",{children:d.label}),D.jsx("strong",{children:d.title})]},d.key))}),m.kind==="comparison"?D.jsx(_3,{comparison:m.comparison,index:m.index,onExpand:p}):D.jsx(v3,{item:m.assembly,onExpand:p}),h?D.jsx(S3,{item:h,onClose:()=>p(null)}):null]})}function _3({comparison:s,index:e,onExpand:i}){const r=i,l={title:s.title,task:s.task,taskLabel:s.taskLabel,specLabel:s.specLabel,input:s.input,inputImage:s.inputImage,subtitle:`${s.formatLabel} comparison`};return D.jsxs("article",{className:"comparison-panel","data-task":s.task,style:{"--task-accent":Bv[e%Bv.length]},children:[D.jsxs("div",{className:"comparison-head",children:[D.jsxs("div",{children:[D.jsx("span",{children:s.taskLabel}),D.jsx("h3",{children:s.title})]}),D.jsx("strong",{children:s.formatLabel})]}),D.jsxs("div",{className:"comparison-body",children:[D.jsxs("aside",{className:"comparison-reference",children:[D.jsx("div",{className:"compare-card-head",children:D.jsxs("div",{children:[D.jsx("span",{children:"Reference"}),D.jsx("strong",{children:"Ground Truth"})]})}),D.jsx("div",{className:"compare-viewer gt-viewer",children:D.jsx(Zs,{item:{id:`${s.id}-ground-truth`,task:s.task,title:s.title,subtitle:"Ground Truth",src:s.gtRender,mesh:s.gtMesh},recycle:!0})}),D.jsxs("div",{className:"comparison-input",children:[s.inputImage?D.jsx("img",{src:Vn(s.inputImage),alt:"Input reference"}):null,s.task==="text_image2cad"?D.jsx("button",{className:"viewer-full-input",type:"button",onClick:()=>r(l),children:"View assembly annotation"}):D.jsxs(D.Fragment,{children:[D.jsx(Lp,{task:s.task,text:s.input,compact:!0}),R3(l)?D.jsx("button",{className:"viewer-full-input",type:"button",onClick:()=>r(l),children:"View full input"}):null]})]})]}),D.jsx(Cx,{items:s.variants,itemKey:c=>c.id,gridClassName:"model-comparison-grid",loop:!0,ariaLabel:`${s.taskLabel} model comparison`,renderItem:c=>{const h=Rx[c.family]||{color:"#337665",icon:"icons/src/openai.svg"};return D.jsxs("section",{className:"model-comparison-card",style:{"--model-color":l3[c.family]||h.color,"--model-tile":h.tile||"#fffdfa","--icon-filter":h.filter||"none"},children:[D.jsxs("div",{className:"compare-card-head",children:[D.jsx("span",{className:"model-mark compare-model-mark",children:D.jsx("img",{src:Vn(h.icon),alt:"","aria-hidden":"true"})}),D.jsxs("div",{children:[D.jsx("span",{children:c.formatLabel}),D.jsx("strong",{children:c.modelLabel})]})]}),D.jsx("div",{className:"compare-viewer",children:D.jsx(Zs,{item:{id:c.id,task:c.task,title:c.modelLabel,subtitle:c.formatLabel,src:c.src,mesh:c.mesh},recycle:!0})})]})}})]})]})}function v3({item:s,onExpand:e}){return D.jsxs("section",{className:"gallery-part-showcase complex-assembly-showcase",children:[D.jsxs("div",{className:"complex-head",children:[D.jsxs("div",{children:[D.jsx("span",{children:"Assembly-3D"}),D.jsx("h3",{children:"Generated assembly and parts"})]}),D.jsxs("div",{className:"complex-linked-case",children:[D.jsx("span",{children:s.format_label}),D.jsxs("strong",{children:[s.model_label," / ",s.short_case_id]})]})]}),D.jsx(x3,{item:s,onOpenInput:()=>e({task:"text_image2cad",title:s.title||s.short_case_id,taskLabel:"Assembly-3D",specLabel:s.format_label,input:s.condition||"",subtitle:`${s.model_label} / ${s.short_case_id}`})})]})}function x3({item:s,onOpenInput:e}){const i=s.aligned_pairs||[],[r,l]=Qe.useState(0),[c,h]=Qe.useState(!1),p=Math.max(0,i.length-3);return Qe.useEffect(()=>{if(c||p<=0)return;const m=window.setInterval(()=>{l(d=>d>=p?0:d+1)},4500);return()=>window.clearInterval(m)},[c,p]),D.jsxs("div",{className:"assembly-pair-body",onMouseEnter:()=>h(!0),onMouseLeave:()=>h(!1),children:[D.jsxs("div",{className:"assembly-pair-side-top",children:[D.jsxs("div",{className:"assembly-pair-input",children:[D.jsxs("div",{className:"complex-card-head",children:[D.jsx("span",{children:"Input"}),D.jsx("strong",{children:"Text specification"})]}),D.jsx("button",{type:"button",className:"viewer-full-input",onClick:e,children:"View input text"})]}),D.jsxs("div",{className:"assembly-pair-viewer-card",children:[D.jsxs("div",{className:"complex-card-head",children:[D.jsx("span",{children:"Reference assembly"}),D.jsx("strong",{children:"Ground truth"})]}),D.jsx("div",{className:"assembly-pair-viewer",children:s.assets.gt_mesh?D.jsx(Zs,{item:{id:`${s.id}-gt-assembly`,task:"text_image2cad",title:s.short_case_id,subtitle:"Ground truth",src:s.assets.gt_render||"",mesh:s.assets.gt_mesh},variant:"result",recycle:!1}):null})]})]}),D.jsx(Fv,{item:s,pairs:i,side:"gt",eyebrow:"Reference parts",title:`Ground truth · ${i.length} parts`,start:r,onStartChange:l}),D.jsx("div",{className:"assembly-pair-side-bottom",children:D.jsxs("div",{className:"assembly-pair-viewer-card",children:[D.jsxs("div",{className:"complex-card-head",children:[D.jsx("span",{children:"Predicted assembly"}),D.jsx("strong",{children:s.model_label})]}),D.jsx("div",{className:"assembly-pair-viewer",children:D.jsx(Zs,{item:{id:`${s.id}-pred-assembly`,task:"text_image2cad",title:s.short_case_id,subtitle:s.model_label,src:s.assets.pred_render||"",mesh:s.assets.mesh||s.assets.stage2_mesh||""},variant:"result",recycle:!1})})]})}),D.jsx(Fv,{item:s,pairs:i,side:"pred",eyebrow:"Predicted parts",title:s.model_label,start:r,onStartChange:l})]})}function Fv({item:s,pairs:e,side:i,eyebrow:r,title:l,start:c,onStartChange:h}){return D.jsxs("div",{className:"assembly-pair-block",children:[D.jsxs("div",{className:"complex-card-head",children:[D.jsx("span",{children:r}),D.jsx("strong",{children:l})]}),D.jsx(Cx,{items:e,itemKey:p=>`${s.id}-${i}-${p.slot}`,gridClassName:"assembly-pair-grid",ariaLabel:r,loop:!0,start:c,onStartChange:h,renderItem:p=>{const m=i==="gt"?p.gt:p.pred;return D.jsxs("figure",{className:"assembly-pair-cell",children:[D.jsx("span",{className:"assembly-pair-slot",children:p.slot+1}),D.jsx("div",{className:"assembly-pair-cell-viewer",children:m.mesh?D.jsx(Zs,{item:{id:`${s.id}-${i}-${p.slot}`,task:"text_image2cad",title:m.name,subtitle:i==="gt"?"Ground truth":s.model_label,mesh:m.mesh},variant:"result",recycle:!0}):null}),D.jsx("figcaption",{children:m.name})]})}})]})}function S3({item:s,onClose:e}){return D.jsx("div",{className:"input-modal",role:"dialog","aria-modal":"true","aria-labelledby":"input-modal-title",onClick:e,children:D.jsxs("div",{className:"input-modal-panel",onClick:i=>i.stopPropagation(),children:[D.jsxs("div",{className:"input-modal-head",children:[D.jsxs("span",{children:[s.taskLabel," · ",s.specLabel]}),D.jsx("button",{type:"button",onClick:e,children:"Close"})]}),D.jsx("h3",{id:"input-modal-title",children:s.title}),s.inputImage?D.jsx("img",{className:"input-modal-image",src:Vn(s.inputImage),alt:"Input reference"}):null,D.jsx(Lp,{task:s.task,text:s.input}),D.jsx("em",{children:s.subtitle})]})})}function Lp({task:s,text:e,compact:i=!1}){if(s!=="text_image2cad")return D.jsx("p",{children:e});const r=y3(e);return D.jsxs("div",{className:i?"assembly-annotation compact":"assembly-annotation",children:[r.assembly?D.jsxs("section",{children:[D.jsx("h4",{children:"assembly-level annotation"}),D.jsx("p",{children:r.assembly})]}):null,r.parts.length?D.jsxs("section",{children:[D.jsx("h4",{children:"part-level annotation"}),D.jsx("ol",{children:r.parts.map((l,c)=>D.jsxs("li",{children:[D.jsxs("strong",{children:["part ",c+1]}),D.jsx("span",{children:l.short||"No part-level annotation available; see annotation caveats."})]},`${l.name}-${c}`))})]}):null,r.caveats?D.jsxs("section",{children:[D.jsx("h4",{children:"annotation caveats"}),D.jsx("p",{children:r.caveats})]}):null]})}function y3(s){const e=(s||"").trim(),i=`
Parts:`,r=`
Annotation Caveats:`,l=e.indexOf(i),c=e.indexOf(r),h=[l,c].filter(M=>M>=0).sort((M,E)=>M-E)[0]??e.length,p=e.slice(0,h).trim(),m=l>=0?l+i.length:-1,d=c>=0?c:e.length,_=m>=0?e.slice(m,d).trim():"",v=c>=0?e.slice(c+r.length).trim():"",g=_.split(/\n(?=-\s+)/).map(M=>M.replace(/^-\s+/,"").trim()).filter(Boolean).map(M=>{const E=M.indexOf(":");return E<0?{name:"",short:M}:{name:M.slice(0,E).trim(),short:M.slice(E+1).trim()}});return{assembly:p,parts:g,caveats:v}}const Bv=["#337665","#2f7a86","#4f88a8","#7aa08f"],zv={text2cad:{body:12573164,edge:3239058,shadow:5927810,rim:14282751},image2cad:{body:11918799,edge:3044708,shadow:5208172,rim:14284010},text_image2cad:{body:12574175,edge:4945280,shadow:5993595,rim:14808566}};function M3(s){return zv[s||""]||zv.text2cad}function b3({run:s,title:e,subtitle:i}){return s?.assets.gt_mesh?D.jsxs("figure",{className:"render-card result-viewer-card",children:[D.jsx("span",{children:"Ground Truth"}),D.jsx("div",{className:"result-viewer",children:D.jsx(Zs,{item:{id:`${s.case_id}-${s.spec}-ground-truth`,task:s.task,title:e,subtitle:i,src:s.assets.gt_render||"",mesh:s.assets.gt_mesh},variant:"result"})})]}):D.jsx(Dx,{title:"Ground Truth",src:s?.assets.gt_render})}function E3({run:s,title:e,subtitle:i}){return s?.assets.mesh?D.jsxs("figure",{className:"render-card result-viewer-card",children:[D.jsx("span",{children:"Prediction"}),D.jsx("div",{className:"result-viewer",children:D.jsx(Zs,{item:{id:s.id,task:s.task,title:e,subtitle:i,src:s.assets.pred_render||"",mesh:s.assets.mesh},variant:"result"})})]}):D.jsx(Dx,{title:"Prediction",src:s?.assets.pred_render})}function T3({modelLabel:s,formatLabel:e}){return D.jsxs("figure",{className:"render-card result-viewer-card",children:[D.jsx("span",{children:"Prediction"}),D.jsx("div",{className:"result-viewer validation-failed",children:D.jsxs("div",{className:"validation-failed-card",children:[D.jsx(aM,{size:30}),D.jsx("strong",{children:"Validation Failed"}),D.jsxs("p",{children:[s,"’s ",e," output for this case was non-executable or non-renderable, so no geometry is available."]})]})})]})}function Zs({item:s,variant:e="showcase",recycle:i=!0}){const r=Qe.useRef(null),l=Qe.useRef(null);l.current===null&&(l.current=Symbol("cad-viewer"));const c=Qe.useRef(!0),[h,p]=Qe.useState(!1),[m,d]=Qe.useState(!1),[_,v]=Qe.useState(0);return Qe.useEffect(()=>{p(!1),d(!1);const g=r.current;if(!g||!s.mesh)return;if(!("IntersectionObserver"in window)){p(!0);return}const M=new IntersectionObserver(E=>{const C=E.some(S=>S.isIntersecting);c.current=C;const y=l.current;C?(p(!0),y&&Pv(y,!0),i||M.disconnect()):i&&y&&Pv(y,!1)},{rootMargin:i?"300px 0px":"900px 0px"});return M.observe(g),()=>M.disconnect()},[s.id,s.mesh,i]),Qe.useEffect(()=>{const g=r.current;if(!g||!s.mesh||!h)return;d(!1);const M=l.current;ZR(M,()=>p(!1));const E=new tb;E.background=new dt(16777215),E.fog=new Rp(16777215,6.8,12.2);const C=M3(s.task),y=new Ai(38,1,.01,100);y.position.set(3.6,2.35,e==="result"?4.35:4.7);const S=new DR({antialias:!0,alpha:!1,preserveDrawingBuffer:!0});S.setPixelRatio(Math.min(window.devicePixelRatio,2)),S.setClearColor(16777215,1),S.outputColorSpace=Jn,S.toneMapping=_p,S.toneMappingExposure=1,S.shadowMap.enabled=!0,S.shadowMap.type=Vv,g.appendChild(S.domElement);const w=F=>{F.preventDefault(),!B&&(d(!1),v(q=>q+1))};S.domElement.addEventListener("webglcontextlost",w,!1);const L=new NR(y,S.domElement);L.enableDamping=!0,L.autoRotate=!0,L.autoRotateSpeed=1.2,L.enablePan=!1,L.minDistance=2.2,L.maxDistance=7.5,E.add(new wb(16449532,12176066,1.95));const I=new cd(16777215,2.65);I.position.set(3.8,4.8,3.5),I.castShadow=!0,I.shadow.mapSize.set(1024,1024),E.add(I);const V=new cd(12053215,.86);V.position.set(-3.2,2.2,-2.6),E.add(V);const N=new cd(13035007,.62);N.position.set(-2.4,3.4,3.4),E.add(N);const O=new Fi(new ml(6,4),new mb({color:C.shadow,opacity:.09}));O.rotation.x=-Math.PI/2,O.position.y=-1.06,O.receiveShadow=!0,E.add(O);const T=new sl;T.rotation.x=-Math.PI/2,E.add(T);let B=!1,Z=0,z=null,Q=null,ee=null,he=null;const j=Vn(s.mesh),P=F=>{if(B)return;const q=F.clone();q.computeVertexNormals(),q.computeBoundingBox(),q.center();const Se=q.boundingBox,Ae=new $;Se?.getSize(Ae);const Ce=Math.max(Ae.x,Ae.y,Ae.z)||1,se=e==="result"?2.32:2.08;q.scale(se/Ce,se/Ce,se/Ce),q.computeBoundingBox(),z=q;const Me=new Mb({color:C.body,roughness:.58,metalness:.02,clearcoat:.1,clearcoatRoughness:.68,emissive:C.rim,emissiveIntensity:.006});Q=Me;const be=new Fi(q,Me);be.castShadow=!0,be.receiveShadow=!0,T.add(be),ee=new pb(q,28),he=new fx({color:C.edge,transparent:!0,opacity:e==="result"?.24:.28}),T.add(new hb(ee,he)),d(!0)};let H=()=>{};gu.has(j)?P(gu.get(j)):H=QR(F=>{if(B){F();return}JR(j).then(q=>{F(),P(q)},q=>{F(),console.warn("Failed to load STL asset",s.mesh,q)})});const ne=()=>{const F=g.clientWidth,q=g.clientHeight;!F||!q||(S.setSize(F,q,!1),y.aspect=F/q,y.updateProjectionMatrix())},pe=new ResizeObserver(ne);pe.observe(g),ne();const ye=()=>{Z=requestAnimationFrame(ye),c.current&&(L.update(),S.render(E,y))};return ye(),()=>{B=!0,KR(M),H(),cancelAnimationFrame(Z),S.domElement.removeEventListener("webglcontextlost",w,!1),pe.disconnect(),L.dispose(),z?.dispose(),Q?.dispose(),ee?.dispose(),he?.dispose(),O.geometry.dispose(),O.material.dispose(),S.dispose(),S.domElement.remove()}},[s.id,s.mesh,h,e,_]),D.jsxs("div",{className:"cad-viewer-shell",children:[D.jsxs("div",{className:`cad-viewer-preview cad-viewer-preview-empty ${m?"is-hidden":""}`,children:[D.jsx(mp,{size:28}),D.jsx("span",{children:h?"Loading 3D model":"3D model queued"})]}),D.jsx("div",{className:`cad-viewer ${m?"is-ready":""}`,ref:r})]})}function tu({label:s,value:e,options:i,onChange:r}){return D.jsxs("label",{className:"select-label",children:[D.jsx("span",{children:s}),D.jsx("select",{value:e,onChange:l=>r(l.target.value),children:i.map(([l,c])=>D.jsx("option",{value:l,children:c},l))})]})}function A3({cases:s,activeCaseId:e,onSelect:i}){const r=s.filter(l=>l.thumbnail);return r.length?D.jsx("div",{className:"case-image-picker","aria-label":"Image case picker",children:r.map(l=>D.jsxs("button",{type:"button",className:l.id===e?"case-image-tile active":"case-image-tile",onClick:()=>i(l.id),title:l.title,children:[D.jsx("img",{src:Vn(l.thumbnail),alt:"","aria-hidden":"true"}),D.jsx("span",{children:l.title})]},l.id))}):null}function R3(s){const e=s.input||"";return!!(s.inputImage||e.length>180||e.includes(`
`))}const C3={"⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9"};function wx(s){return s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,e=>C3[e]||e)}function w3(s){const e=s.match(/^(.+?)([⁰¹²³⁴⁵⁶⁷⁸⁹,\*]+)$/);return e?D.jsxs(D.Fragment,{children:[e[1],D.jsx("sup",{children:wx(e[2])})]}):s}function D3(s){const e=s.match(/^([⁰¹²³⁴⁵⁶⁷⁸⁹]+)(.+)$/);return e?D.jsxs(D.Fragment,{children:[D.jsx("sup",{children:wx(e[1])}),e[2]]}):s}function Dx({title:s,src:e}){return D.jsxs("figure",{className:"render-card",children:[D.jsx("span",{children:s}),e?D.jsx("img",{src:Vn(e),alt:s}):D.jsxs("div",{className:"render-missing",children:[D.jsx(Gv,{}),"No render"]})]})}function xd({title:s,icon:e,defaultOpen:i=!1,children:r}){const[l,c]=Qe.useState(i);return D.jsxs("div",{className:`collapsible ${l?"open":"closed"}`,children:[D.jsxs("button",{className:"collapsible-header",type:"button",onClick:()=>c(!l),children:[e?D.jsx("span",{className:"collapsible-icon",children:e}):null,D.jsx("span",{className:"collapsible-title",children:s}),l?D.jsx(eM,{size:16}):D.jsx(Qy,{size:16})]}),l?D.jsx("div",{className:"collapsible-body",children:r}):null]})}const U3=[{key:"geometry",label:"Geometry",accent:"var(--blue)",metrics:[["f_score_005","F@0.05"],["f_score_001","F@0.01"],["normal_consistency","NC"],["chamfer_distance","CD"],["iou_voxel","IoU"]]},{key:"topology",label:"Topology",accent:"var(--teal)",metrics:[["pred_open_edge_ratio","NoOE"],["pred_inverted_normal_ratio","InvN"],["pred_non_manifold_edge_ratio","NM"]]},{key:"judge",label:"Judge",accent:"var(--violet)",metrics:[["judge_geometry","J-Geo"],["judge_aesthetics","J-Aes"],["judge_semantic","J-Sem"],["qa_semantic","QA-S"],["qa_parametric","QA-P"]]},{key:"part",label:"Part",accent:"var(--coral)",metrics:[["part_match_f1","PartMatchF1"],["part_fscore_mean","PartFS"]]}];function N3(s,e){const i=s.metrics||{},r=v=>typeof v=="number"&&Number.isFinite(v),l=v=>r(v)?Math.max(0,Math.min(1,v)):null,c=v=>r(v)?Math.max(0,Math.min(1,v>1?v/10:v)):null,h=v=>r(v)?Math.max(0,Math.min(1,1-v)):null,p=v=>r(v)?Math.max(0,1-v/.01):null,m=[],d=v=>Xr(i[v])?i[v]:void 0,_=v=>{v!=null&&m.push(v)};return e.key==="geometry"?(_(l(d("f_score_005"))),_(l(d("f_score_001"))),_(l(d("normal_consistency"))),_(p(d("chamfer_distance"))),_(l(Xr(i.iou_csg)?i.iou_csg:i.iou_voxel))):e.key==="topology"?(Xr(i.no_open_edge_score)?_(l(i.no_open_edge_score)):Xr(i.no_open_edge_ratio)?_(l(i.no_open_edge_ratio)):Xr(i.pred_open_edge_ratio)&&_(i.pred_open_edge_ratio===0?1:0),_(h(d("pred_inverted_normal_ratio"))),_(h(d("pred_non_manifold_edge_ratio")))):e.key==="judge"?(_(c(d("judge_geometry"))),_(c(d("judge_aesthetics"))),_(c(d("judge_semantic"))),_(l(d("qa_semantic"))),s.spec==="parametric"&&_(l(d("qa_parametric"))),m.length||_(l(d("qa_overall")))):e.key==="part"&&(_(l(d("part_match_f1"))),_(l(d("part_fscore_mean")))),m.length?s.valid===!1?0:m.reduce((v,g)=>v+g,0)/m.length:null}function L3({run:s}){if(!s)return null;const e=s.metrics||{},i=U3.map(l=>({...l,score:N3(s,l),items:l.metrics.filter(([c])=>Ux(c,e[c],s)).map(([c,h])=>({key:c,label:h,value:O3(c,e[c])}))})).filter(l=>l.items.length>0||l.score!=null),r=s.valid!==null&&s.valid!==void 0;return!i.length&&!r?null:D.jsxs("div",{className:"metrics-panel",children:[r?D.jsxs("div",{className:`metric-valid ${s.valid?"is-valid":"is-invalid"}`,children:[D.jsx("span",{children:"Executable"}),D.jsx("strong",{children:s.valid?"yes":"no"})]}):null,i.map(l=>D.jsxs("div",{className:"metric-bucket",style:{"--bucket-accent":l.accent},children:[D.jsxs("span",{className:"metric-bucket-label",children:[D.jsx("span",{children:l.label}),l.score!=null?D.jsx("strong",{className:"metric-bucket-score",children:l.score.toFixed(3)}):null]}),D.jsx("div",{className:"metrics",children:l.items.map(c=>D.jsxs("div",{className:"metric",children:[D.jsx("span",{children:c.label}),D.jsx("strong",{children:c.value})]},c.key))})]},l.key))]})}function Ux(s,e,i){return!(!Xr(e)||s==="qa_parametric"&&i.spec!=="parametric"||s==="qa_parametric"&&typeof e=="number"&&e<=0)}function Xr(s){return s!=null&&s!==""&&!(typeof s=="number"&&Number.isNaN(s))}function O3(s,e){return typeof e!="number"?String(e):s.startsWith("judge_")?`${Number.isInteger(e)?e:e.toFixed(1)}/10`:s==="pred_open_edge_ratio"?(e===0?1:0).toFixed(3):s.endsWith("_ratio")?e.toFixed(3):s.includes("chamfer")||s.includes("hausdorff")?e===0?"0":e<.01?e.toFixed(4):e.toFixed(3):e<1?e.toFixed(3):e.toFixed(2)}function Nx({title:s,text:e}){return D.jsxs("div",{className:"placeholder",children:[D.jsx(mp,{size:32}),D.jsx("h3",{children:s}),e?D.jsx("p",{children:e}):null]})}Wy.createRoot(document.getElementById("root")).render(D.jsx($R,{}));
