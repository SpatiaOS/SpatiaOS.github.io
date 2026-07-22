const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/OrbitControls-BSM_CLzo.js","assets/three.module-BTt32e3U.js","assets/STLLoader-DnLadrxH.js"])))=>i.map(i=>d[i]);
var ie=Object.defineProperty;var re=(i,e,t)=>e in i?ie(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var v=(i,e,t)=>re(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const oe="modulepreload",ne=function(i){return"/projects/P3D-Bench/self-test/"+i},W={},q=function(e,t,a){let s=Promise.resolve();if(t&&t.length>0){let c=function(o){return Promise.all(o.map(l=>Promise.resolve(l).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),d=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));s=c(t.map(o=>{if(o=ne(o),o in W)return;W[o]=!0;const l=o.endsWith(".css"),h=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${h}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":oe,l||(u.as="script"),u.crossOrigin="",u.href=o,d&&u.setAttribute("nonce",d),document.head.appendChild(u),l)return new Promise((m,b)=>{u.addEventListener("load",m),u.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${o}`)))})}))}function r(c){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=c,window.dispatchEvent(n),!n.defaultPrevented)throw c}return s.then(c=>{for(const n of c||[])n.status==="rejected"&&r(n.reason);return e().catch(r)})};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=(i,e,t=[])=>{const a=document.createElementNS("http://www.w3.org/2000/svg",i);return Object.keys(e).forEach(s=>{a.setAttribute(s,String(e[s]))}),t.length&&t.forEach(s=>{const r=Q(...s);a.appendChild(r)}),a};var ce=([i,e,t])=>Q(i,e,t);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=i=>Array.from(i.attributes).reduce((e,t)=>(e[t.name]=t.value,e),{}),de=i=>typeof i=="string"?i:!i||!i.class?"":i.class&&typeof i.class=="string"?i.class.split(" "):i.class&&Array.isArray(i.class)?i.class:"",ue=i=>i.flatMap(de).map(t=>t.trim()).filter(Boolean).filter((t,a,s)=>s.indexOf(t)===a).join(" "),he=i=>i.replace(/(\w)(\w*)(_|-|\s*)/g,(e,t,a)=>t.toUpperCase()+a.toLowerCase()),Y=(i,{nameAttr:e,icons:t,attrs:a})=>{var b;const s=i.getAttribute(e);if(s==null)return;const r=he(s),c=t[r];if(!c)return console.warn(`${i.outerHTML} icon name was not found in the provided icons object.`);const n=le(i),[d,o,l]=c,h={...o,"data-lucide":s,...a,...n},u=ue(["lucide",`lucide-${s}`,n,a]);u&&Object.assign(h,{class:u});const m=ce([d,h,l]);return(b=i.parentNode)==null?void 0:b.replaceChild(m,i)};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=["svg",w,[["path",{d:"M20 6 9 17l-5-5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=["svg",w,[["path",{d:"m6 9 6 6 6-6"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=["svg",w,[["circle",{cx:"12",cy:"12",r:"10"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=["svg",w,[["circle",{cx:"12",cy:"12",r:"10"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=["svg",w,[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"m5 12-3 3 3 3"}],["path",{d:"m9 18 3-3-3-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ge=["svg",w,[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=["svg",w,[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=["svg",w,[["polygon",{points:"6 3 20 12 6 21 6 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=["svg",w,[["circle",{cx:"11",cy:"11",r:"8"}],["path",{d:"m21 21-4.3-4.3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ee=["svg",w,[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{points:"17 8 12 3 7 8"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Se=["svg",w,[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=({icons:i={},nameAttr:e="data-lucide",attrs:t={}}={})=>{if(!Object.values(i).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const a=document.querySelectorAll(`[${e}]`);if(Array.from(a).forEach(s=>Y(s,{nameAttr:e,icons:i,attrs:t})),e==="data-lucide"){const s=document.querySelectorAll("[icon-name]");s.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(s).forEach(r=>Y(r,{nameAttr:"icon-name",icons:i,attrs:t})))}},E=[{id:"text2cad",label:"Text-to-3D"},{id:"image2cad",label:"Image-to-3D"},{id:"text_image2cad",label:"Assembly-3D"}],R={text2cad:[{id:"json",label:"JSON"},{id:"openscad",label:"OpenSCAD"}],image2cad:[{id:"openscad",label:"OpenSCAD"},{id:"cadquery",label:"CadQuery"},{id:"threejs",label:"Three.js"}],text_image2cad:[{id:"openscad",label:"OpenSCAD"},{id:"cadquery",label:"CadQuery"}]};function M(){return{state:"not_started",metrics:[]}}const X=[{keys:["chamfer_distance"],label:"CD ↓",bucket:"Geometry"},{keys:["iou_csg"],label:"IoU_C ↑",bucket:"Geometry",tasks:["text2cad"]},{keys:["iou_voxel"],label:"IoU_V ↑",bucket:"Geometry",tasks:["image2cad","text_image2cad"]},{keys:["f_score_005"],label:"F@.05 ↑",bucket:"Geometry"},{keys:["f_score_001"],label:"F@.01 ↑",bucket:"Geometry"},{keys:["normal_consistency"],label:"NC ↑",bucket:"Geometry"},{keys:["pred_open_edge_ratio"],label:"NoOE ↑",bucket:"Topology",transform:i=>i===0?1:0},{keys:["pred_inverted_normal_ratio"],label:"InvN ↓",bucket:"Topology"},{keys:["pred_non_manifold_edge_ratio"],label:"NM ↓",bucket:"Topology"},{keys:["part_match_f1"],label:"PartMatchF1 ↑",bucket:"Part",tasks:["text_image2cad"]},{keys:["part_fscore_mean","part_fscore"],label:"PartFS ↑",bucket:"Part",tasks:["text_image2cad"]}];new Map(X.flatMap(({keys:i,label:e})=>i.map(t=>[t,e])));function ke(i,e){return typeof e=="boolean"?e?"Yes":"No":Number.isFinite(e)?i==="pred_open_edge_ratio"?e.toFixed(3):i.includes("chamfer")||i.includes("hausdorff")||i==="stage2_fidelity_cd"?e===0?"0":e<.01?e.toFixed(4):e.toFixed(3):e<1?e.toFixed(3):e.toFixed(2):String(e)}function Ce(i,e={task:"text2cad",textMode:"parametric"}){const t=i.metrics&&typeof i.metrics=="object"&&!Array.isArray(i.metrics)?i.metrics:{},s=e.task!=="text2cad"||e.textMode!=="descriptive"?X.flatMap(c=>{if(c.tasks&&!c.tasks.includes(e.task))return[];const n=c.keys.find(l=>typeof t[l]=="number");if(!n)return[];const d=t[n],o=c.transform?c.transform(d):d;return[{key:n,label:c.label,bucket:c.bucket,value:ke(n,o)}]}):[];typeof i.valid=="boolean"&&s.unshift({key:"valid",label:"Valid",bucket:"Valid",value:i.valid?"Yes":"No"});const r=i.evaluation_status==="failed";return{state:r?"failed":"complete",message:r?String(i.evaluation_failure_reason??"Evaluation failed"):s.length?void 0:"No P3D-Bench metrics were reported.",metrics:s}}async function ee(i,e,t){var o;const a=i.headers.get("content-length");if(a!==null){const l=Number(a);if(!Number.isSafeInteger(l)||l<0||l>e)throw new Error(t)}const s=(o=i.body)==null?void 0:o.getReader();if(!s)throw new Error(t);const r=[];let c=0;for(;;){const l=await s.read();if(l.done)break;if(c+=l.value.byteLength,c>e)throw await s.cancel(),new Error(t);r.push(l.value)}const n=new Uint8Array(c);let d=0;for(const l of r)n.set(l,d),d+=l.byteLength;try{return JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(n))}catch{throw new Error(t)}}const L={text2cad:400,image2cad:400,text_image2cad:203},xe=/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/,Te=/^[a-z0-9][a-z0-9._-]{0,127}$/,N=/^[0-9a-f]{64}$/,$e=8*1024*1024;function S(i,e){if(!i||typeof i!="object"||Array.isArray(i))throw new Error(`The public ${e} is invalid.`);return i}function Ae(i){const e=String(i??"");if(!/^visible-inputs\/[A-Za-z0-9_-]+\.png$/.test(e)||e.includes("..")||e.includes("\\"))throw new Error("The public case image path is invalid.");return e}function Pe(i){const e=S(i,"case input variant"),t=e.prompt_profile===null?null:String(e.prompt_profile??""),a=e.prompt===null?null:String(e.prompt??""),s=String(e.visible_input_sha256??"");if(t!==null&&!Te.test(t)||t===null!=(a===null))throw new Error("The public case prompt contract is invalid.");if(a!==null&&!a.trim())throw new Error("The public case prompt is empty.");if(!N.test(s))throw new Error("The public visible-input digest is invalid.");const r=S(e.static_submission_contract,"static case contract"),c=S(e.static_submission_proof,"static case proof");if(r.schema_version!=="spatiaos-public-static-case-contract-v1"||c.schema_version!=="spatiaos-public-static-case-proof-v1"||!Number.isSafeInteger(c.leaf_index)||c.leaf_index<0||!Array.isArray(c.siblings)||c.siblings.length>32||c.siblings.some(n=>!n||!["left","right"].includes(String(n.position))||!N.test(String(n.sha256))))throw new Error("The public static submission proof is invalid.");return{prompt_profile:t,prompt:a,visible_input_sha256:s,static_submission_contract:r,static_submission_proof:c}}function Le(i){if(i===null)return null;const e=S(i,"case image"),t={path:Ae(e.path),sha256:String(e.sha256??""),bytes:Number(e.bytes),width:Number(e.width),height:Number(e.height),render_profile:String(e.render_profile??"")};if(!N.test(t.sha256)||!Number.isSafeInteger(t.bytes)||t.bytes<24||t.bytes>1024*1024||t.width!==1024||t.height!==1024||t.render_profile!=="cadbenchmark_occ_single_view_v1")throw new Error("The public case image contract is invalid.");return t}function Ie(i,e,t){const a=S(i,"case catalog entry"),s=String(a.uid??""),r=Number(a.case_index),c=a.default_prompt_profile===null?null:String(a.default_prompt_profile??""),n=Array.isArray(a.input_variants)?a.input_variants.map(Pe):[],d=String(a.source_basename??"");if(!xe.test(s)||r!==t||!n.length||!/^[A-Za-z0-9][A-Za-z0-9._-]{2,191}$/.test(d))throw new Error(`The public ${e} case catalog is invalid.`);if(c!==null&&!n.some(u=>u.prompt_profile===c)||c!==(e==="text2cad"?"parametric":e==="text_image2cad"?"intermediate":null))throw new Error(`The public ${e} prompt profile is invalid.`);const o=n.map(u=>u.prompt_profile).sort(),l=e==="text2cad"?["descriptive","parametric"]:e==="text_image2cad"?["intermediate"]:[null];if(JSON.stringify(o)!==JSON.stringify(l.sort()))throw new Error(`The public ${e} prompt variants are invalid.`);const h=Le(a.image);if(e==="text2cad"!=(h===null))throw new Error(`The public ${e} visible-image contract is invalid.`);for(const u of n){const m=u.static_submission_contract;if(m.benchmark!=="p3d"||m.suite_id!=="p3d-bench-paper"||m.suite_version!=="v1"||m.task!==e||m.case_id!==s||m.case_index!==r||m.prompt_profile!==u.prompt_profile||m.visible_input_sha256!==u.visible_input_sha256||m.source_basename!==d)throw new Error(`The public ${e} static submission contract is invalid.`)}return{uid:s,case_index:r,default_prompt_profile:c,input_variants:n,image:h,source_basename:d}}function Me(i){const e=S(i,"case catalog"),t=S(e.tasks,"case task map"),a=S(e.task_counts,"case task counts"),s={};for(const o of Object.keys(L)){const l=t[o];if(!Array.isArray(l)||l.length!==L[o])throw new Error(`The public ${o} case count is invalid.`);if(a[o]!==L[o])throw new Error(`The public ${o} declared count is invalid.`);if(s[o]=l.map((h,u)=>Ie(h,o,u+1)),new Set(s[o].map(h=>h.uid)).size!==l.length)throw new Error(`The public ${o} UID list contains duplicates.`)}const r=new Set(s.image2cad.map(o=>o.uid));if(s.text_image2cad.some(o=>!r.has(o.uid)))throw new Error("The public assembly catalog is not a subset of the image catalog.");if(e.schema_version!=="p3d-public-case-catalog-v1"||e.suite_id!=="p3d-bench-paper"||e.suite_version!=="v1"||e.total_case_count!==1003||e.hidden_geometry_published!==!1)throw new Error("The public case catalog identity is invalid.");const c=S(e.static_submission_contract,"static case root"),n=Object.values(s).flatMap(o=>o.flatMap(l=>l.input_variants)),d=n.map(o=>o.static_submission_proof.leaf_index).sort((o,l)=>o-l);if(c.schema_version!=="spatiaos-public-static-case-root-v1"||c.algorithm!=="sha256-merkle-v1"||!N.test(c.root_sha256)||c.leaf_count!==n.length||d.some((o,l)=>o!==l))throw new Error("The public static submission root is invalid.");return{schema_version:"p3d-public-case-catalog-v1",suite_id:"p3d-bench-paper",suite_version:"v1",task_counts:L,total_case_count:1003,hidden_geometry_published:!1,static_submission_contract:c,tasks:s}}class Re{constructor(e){v(this,"url");v(this,"catalog");this.url=e}async load(){if(this.catalog)return;const e=await fetch(this.url,{headers:{Accept:"application/json"},credentials:"omit"});if(!e.ok)throw new Error("The public P3D case catalog could not be loaded.");this.catalog=Me(await ee(e,$e,"The public P3D case catalog is invalid."))}suite(){if(!this.catalog)throw new Error("The public P3D case catalog is not ready.");return{id:this.catalog.suite_id,version:this.catalog.suite_version}}staticRoot(){if(!this.catalog)throw new Error("The public P3D case catalog is not ready.");return this.catalog.static_submission_contract}resolve(e,t,a,s,r){if(!this.catalog)throw new Error("The public P3D case catalog is not ready.");const c=this.catalog.tasks[e];let n;if(s)n=c.find(h=>h.uid===s);else{const h=crypto.getRandomValues(new Uint32Array(1))[0];n=c[h%c.length]}if(!n)throw new Error("No public case matches that exact UID.");const d=e==="text2cad"?r??n.default_prompt_profile:n.default_prompt_profile,o=n.input_variants.find(h=>h.prompt_profile===d);if(!o)throw new Error("The selected public prompt profile is unavailable.");const l=a.accept[0];if(!l||!/^\.[a-z0-9]+$/.test(l))throw new Error("The selected source format is unavailable.");return{uid:n.uid,case_index:n.case_index,task:e,format:t,text_mode:e==="text2cad"?d:void 0,prompt_profile:d,prompt:o.prompt,image:n.image?{url:new URL(n.image.path,this.url).toString(),alt:`P3D visible input for UID ${n.uid}`,sha256:n.image.sha256,bytes:n.image.bytes,render_profile:n.image.render_profile}:null,visible_input_sha256:o.visible_input_sha256,static_submission_contract:o.static_submission_contract,static_submission_proof:o.static_submission_proof,source_filename:`${n.source_basename}${l}`,source_accept:a.accept,source_max_bytes:a.max_bytes}}}class j extends Error{constructor(){super(...arguments);v(this,"retryable",!0)}}function Ne(i){return i instanceof j}const I="spatiaos-p3d-self-test-receipt-v1",O=/^req_[0-9a-f]{32}$/,F=/^rec_[0-9a-f]{48}$/,B=/^sub_[0-9a-f]{32}$/,te=/^[0-9a-f]{64}$/,De=32*1024*1024,Ue=8*1024*1024,qe=2*1024*1024,je={json:".json",openscad:".scad",cadquery:".py",threejs:".js"};function Oe(i){return i==="json"?"JSON":i==="threejs"?"Three.js":i==="cadquery"?"CadQuery":"OpenSCAD"}async function Fe(i){const e=await crypto.subtle.digest("SHA-256",await i.arrayBuffer());return[...new Uint8Array(e)].map(t=>t.toString(16).padStart(2,"0")).join("")}function Be(i){var a;if(!i||typeof i!="object"||Array.isArray(i))return null;const t=i;return t.schema_version!=="p3d-public-browser-receipt-v1"||!O.test(String(t.request_id??""))||!F.test(String(t.recovery_key??""))||!B.test(String(t.submission_id??""))||!E.some(s=>s.id===t.task)||!((a=R[t.task])!=null&&a.some(s=>s.id===t.format))||!t.uid||typeof t.source_name!="string"||!Number.isSafeInteger(t.source_bytes)||t.source_bytes<1||!te.test(t.source_sha256)||Number.isNaN(new Date(t.submitted_at).getTime())?null:t}function Ve(i,e){const t=i.match(/^\/api\/submissions\/([A-Za-z0-9_-]{1,128})\/artifacts\/([A-Za-z0-9_.:-]{1,200})$/);return!t||t[1]!==e?null:i.slice(5)}class ze{constructor(e,t){v(this,"kind","gateway");v(this,"baseUrl");v(this,"cases");v(this,"evaluations",new Map);v(this,"capabilities");v(this,"staticFastPathAvailable",!1);v(this,"gatewayState",{available:!1,label:"Checking service"});if(this.baseUrl=new URL(e.endsWith("/")?e:`${e}/`,window.location.href),!this.baseUrl.pathname.endsWith("/api/"))throw new Error("The public gateway URL must end with /api/.");if(new Set(["127.0.0.1","localhost","[::1]"]).has(this.baseUrl.hostname),this.baseUrl.protocol!=="https:")throw new Error("The public gateway URL must use HTTPS.");this.cases=new Re(t)}async getCapabilities(){var a;await this.cases.load();const e=this.cases.suite(),t={evaluation_mode:"deterministic",tasks:E.map(({id:s})=>({task:s,formats:R[s].map(({id:r,label:c})=>({id:r,label:c,status:"available",accept:[je[r]],max_bytes:Ue}))}))};try{const[s,r]=await Promise.all([this.request("catalog"),this.request("capacity")]);if(s.schema_version!=="agentic-public-catalog-v1")throw new Error("The public evaluation catalog is incompatible.");const c=(a=s.suites)==null?void 0:a.find(u=>u.benchmark==="p3d"&&u.suite_id===e.id&&u.version===e.version);if(!c||c.public_self_test_status!=="available")throw new Error("P3D public self-evaluation is not currently available.");const n=this.cases.staticRoot(),d=c.static_submission_contract;this.staticFastPathAvailable=!!(d&&d.schema_version===n.schema_version&&d.algorithm===n.algorithm&&d.root_sha256===n.root_sha256&&d.leaf_count===n.leaf_count);const o=Number(r.max_submission_bytes),l=Number(r.max_result_object_bytes),h=Number(r.max_cases);if(!Number.isSafeInteger(o)||o<64*1024||o>32*1024*1024||!Number.isSafeInteger(l)||l<1024||l>64*1024*1024||!Number.isSafeInteger(h)||h<1||h>20||typeof r.accepting_requests!="boolean"||typeof r.accepting_submissions!="boolean")throw new Error("The public upload capacity contract is invalid.");if(this.capabilities={evaluation_mode:"deterministic",tasks:E.map(({id:u})=>({task:u,formats:R[u].map(({id:m,label:b})=>{var g;const f=(g=c.capabilities)==null?void 0:g.find(k=>k.task===u&&k.format===m),_=Array.isArray(f==null?void 0:f.extensions)?f.extensions.filter(k=>/^\.[a-z0-9]+$/.test(String(k))):[];return{id:m,label:b,status:(f==null?void 0:f.status)==="available"&&_.length===1?"available":"unavailable",accept:_,max_bytes:o}})}))},this.capabilities.tasks.some(u=>!u.formats.some(m=>m.status==="available")))throw new Error("The public P3D capability matrix is incomplete.");this.gatewayState=r.accepting_requests&&r.accepting_submissions?{available:!0,label:"Connected"}:{available:!1,label:"Intake paused",message:"Evaluation intake is temporarily paused."}}catch(s){this.capabilities=t,this.staticFastPathAvailable=!1,this.gatewayState={available:!1,label:"Evaluation offline",message:s instanceof Error?s.message:"The public evaluation gateway is unavailable."}}return this.capabilities}connectionState(){return this.gatewayState}async resolveExactCase(e){return this.resolveCase(e,e.uid.trim())}async getRandomCase(e){return this.resolveCase(e)}async submitEvaluation(e){if(!this.gatewayState.available)throw new Error(this.gatewayState.message||"Evaluation intake is unavailable.");const t=await Fe(e.source),a=this.cases.suite();if(this.staticFastPathAvailable&&e.case.static_submission_contract&&e.case.static_submission_proof){const o=new FormData;o.set("contract",JSON.stringify(e.case.static_submission_contract)),o.set("proof",JSON.stringify(e.case.static_submission_proof)),o.set("format",e.case.format),o.set("method","external-method"),o.set("model","user-supplied"),o.set("files",e.source,e.case.source_filename);const l=await this.request("static-submissions",{method:"POST",body:o}),h=String(l.request_id??""),u=String(l.recovery_key??""),m=String(l.submission_id??"");if(!O.test(h)||!F.test(u)||!B.test(m))throw new Error("The public gateway did not return a valid evaluation receipt.");const b=crypto.randomUUID(),f={requestId:h,recoveryKey:u,submissionId:m,sourceName:e.source.name,sourceBytes:e.source.size,sourceSha256:t,submittedAt:new Date().toISOString(),case:e.case};return this.evaluations.set(b,f),this.storeReceipt(f),this.snapshot(b,f,"evaluating","The source is queued for deterministic evaluation.")}const s=await this.request("self-tests",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({benchmark:"p3d",suite:a.id,suite_version:a.version,tasks:[e.case.task],format:e.case.format,prompt_profile:e.case.prompt_profile??void 0,n_cases:1,case_indices:[e.case.case_index],method:"external-method",model:"user-supplied"})}),r=String(s.request_id??""),c=String(s.recovery_key??"");if(!O.test(r)||!F.test(c))throw new Error("The public gateway did not return a valid evaluation receipt.");const n=crypto.randomUUID(),d={requestId:r,recoveryKey:c,source:e.source,sourceName:e.source.name,sourceBytes:e.source.size,sourceSha256:t,submittedAt:new Date().toISOString(),case:e.case};return this.evaluations.set(n,d),this.snapshot(n,d,"validating","Preparing the secure evaluation request.")}async getEvaluation(e){var r;const t=this.evaluations.get(e);if(!t)throw new Error("This browser no longer has the evaluation receipt.");if(!t.submissionId){const c=await this.request(`self-tests/${encodeURIComponent(t.requestId)}`,{headers:this.recoveryHeaders(t)});if(c.status!=="ready")return this.snapshot(e,t,"validating","Preparing the visible-input and submission contract.");try{this.validatePreparedCase(c.self_test,t.case)}catch{return this.preparedCaseFailure(e,t)}if(!t.source)throw new Error("Select the source file again to continue this evaluation.");const n=new FormData;n.set("files",t.source,t.case.source_filename);const d=await this.request(`self-tests/${encodeURIComponent(t.requestId)}/submissions`,{method:"POST",headers:this.recoveryHeaders(t),body:n}),o=String(d.submission_id??"");if(!B.test(o))throw new Error("The public gateway did not accept the source file.");return t.submissionId=o,t.source=void 0,this.storeReceipt(t),this.snapshot(e,t,"evaluating","The source is queued for deterministic evaluation.")}const a=await this.request(`submissions/${encodeURIComponent(t.submissionId)}`,{headers:this.recoveryHeaders(t)});if(a.status!=="available")return this.snapshot(e,t,"evaluating","The deterministic evaluator is running.");const s=a.evaluation;if(!s||typeof s!="object")throw new Error("The public gateway returned an invalid evaluation result.");return((r=s.submission)==null?void 0:r.status)==="complete"&&await this.ensureVisualization(t,s),this.completedSnapshot(e,t,s)}async resumeEvaluation(){let e=null;try{e=Be(JSON.parse(sessionStorage.getItem(I)||"null"))}catch{sessionStorage.removeItem(I)}if(!e)return null;const t=await this.resolveCase({task:e.task,format:e.format,text_mode:e.text_mode},e.uid),a=crypto.randomUUID(),s={requestId:e.request_id,recoveryKey:e.recovery_key,submissionId:e.submission_id,sourceName:e.source_name,sourceBytes:e.source_bytes,sourceSha256:e.source_sha256,submittedAt:e.submitted_at,case:t};return this.evaluations.set(a,s),{case:t,snapshot:await this.getEvaluation(a)}}releaseEvaluation(e){var a;const t=this.evaluations.get(e);(a=t==null?void 0:t.visualization)!=null&&a.url.startsWith("blob:")&&URL.revokeObjectURL(t.visualization.url),t!=null&&t.submissionId&&sessionStorage.removeItem(I),this.evaluations.delete(e)}async resolveCase(e,t){var s,r;await this.cases.load();const a=(r=(s=this.capabilities)==null?void 0:s.tasks.find(c=>c.task===e.task))==null?void 0:r.formats.find(c=>c.id===e.format&&c.status==="available");if(!a)throw new Error(`The ${Oe(e.format)} evaluator is not currently available.`);return this.cases.resolve(e.task,e.format,a,t,e.text_mode)}validatePreparedCase(e,t){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The prepared evaluation contract is invalid.");const a=e,s=Array.isArray(a.cases)?a.cases:[],r=s[0];if(a.benchmark!=="p3d"||a.suite!=="p3d-bench-paper"||a.suite_version!=="v1"||a.format!==t.format||s.length!==1||!r||r.task!==t.task||r.case_id!==t.uid||r.case_index!==t.case_index||(r.prompt_profile??null)!==(t.prompt_profile??null)||r.annotated_prompt!==t.prompt||r.visible_input_sha256!==t.visible_input_sha256||r.submission_filename!==t.source_filename)throw new Error("The evaluation service returned a different task, UID, or visible-input contract.")}preparedCaseFailure(e,t){const a="The evaluation service returned a different task, UID, or visible-input contract. No source was uploaded; retry the request.",s=M();return s.state="failed",s.message=a,this.evaluations.delete(e),{evaluation_ref:e,state:"failed",message:a,result:s,provenance:this.provenance(t)}}completedSnapshot(e,t,a){var o,l,h,u;const s=String(((o=a.submission)==null?void 0:o.status)??""),r=s==="failed",c=s==="complete"&&!!a.result,n=((h=(l=a.result)==null?void 0:l.cases)==null?void 0:h[0])??{};let d;return c?d=Ce(n,{task:t.case.task,textMode:t.case.text_mode}):r?d={state:"failed",message:String(((u=a.submission)==null?void 0:u.failure_reason)??"Evaluation failed"),metrics:[]}:(d=M(),d.state="checking",d.message="The deterministic evaluator is running."),{evaluation_ref:e,state:r?"failed":c?"complete":"evaluating",message:r?d.message??"The evaluation did not complete.":c?"Deterministic evaluation finished.":"The deterministic evaluator is running.",result:d,provenance:this.provenance(t),visualization:t.visualization}}snapshot(e,t,a,s){const r=M();return r.state="checking",r.message=s,{evaluation_ref:e,state:a,message:s,result:r,provenance:this.provenance(t)}}provenance(e){return{evaluator:"P3D / cadbenchmark",evaluation_mode:"deterministic",adapter_version:"p3d_external_submission_v1",source_name:e.sourceName,source_bytes:e.sourceBytes,source_sha256:e.sourceSha256,submitted_at:e.submittedAt,retention:"Evaluation-only retention policy",transport:"gateway",public_reference:e.submissionId??e.requestId}}recoveryHeaders(e){return{"x-spatiaos-recovery-key":e.recoveryKey}}storeReceipt(e){if(!e.submissionId)return;const t={schema_version:"p3d-public-browser-receipt-v1",request_id:e.requestId,recovery_key:e.recoveryKey,submission_id:e.submissionId,task:e.case.task,format:e.case.format,...e.case.text_mode?{text_mode:e.case.text_mode}:{},uid:e.case.uid,source_name:e.sourceName,source_bytes:e.sourceBytes,source_sha256:e.sourceSha256,submitted_at:e.submittedAt};sessionStorage.setItem(I,JSON.stringify(t))}async ensureVisualization(e,t){var b,f,_;if(e.visualization||!e.submissionId)return;const a=(f=(b=t.result)==null?void 0:b.artifacts)==null?void 0:f.find(g=>g.role==="model_stl"),s=Number(a==null?void 0:a.bytes),r=String((a==null?void 0:a.sha256)??""),c=Ve(String((a==null?void 0:a.download_url)??""),e.submissionId);if(!c||!Number.isSafeInteger(s)||s<1||s>De||!te.test(r)||!new Set(["model/stl","application/sla","application/octet-stream"]).has(String((a==null?void 0:a.media_type)??"")))return;const n=new URL(c,this.baseUrl);if(n.origin!==this.baseUrl.origin||!n.pathname.startsWith(this.baseUrl.pathname))return;const d=await fetch(n,{headers:{Accept:"model/stl, application/sla, application/octet-stream",...this.recoveryHeaders(e)},credentials:"omit"});if(!d.ok)return;const o=d.headers.get("content-length");if(o!==null&&Number(o)!==s)return;const l=(_=d.body)==null?void 0:_.getReader();if(!l)return;const h=new Uint8Array(s);let u=0;for(;;){const g=await l.read();if(g.done)break;if(u+g.value.byteLength>s){await l.cancel();return}h.set(g.value,u),u+=g.value.byteLength}u!==s||[...new Uint8Array(await crypto.subtle.digest("SHA-256",h))].map(g=>g.toString(16).padStart(2,"0")).join("")!==r||(e.visualization={kind:"stl",url:URL.createObjectURL(new Blob([h],{type:"model/stl"})),sha256:r,bytes:s})}async request(e,t){let a;try{a=await fetch(new URL(e,this.baseUrl),{...t,credentials:"omit",headers:{Accept:"application/json",...t==null?void 0:t.headers}})}catch{throw new j("The public evaluation gateway could not be reached.")}let s=null;try{s=await ee(a,qe,"The public evaluation gateway returned an invalid response.")}catch{if(a.ok)throw new Error("The public evaluation gateway returned an invalid response.")}if(!a.ok){const r=s&&typeof s=="object"?s:{},c=r.error||r.message||a.statusText||"The public evaluation gateway rejected the request.";throw r.retryable===!0||a.status>=500?new j(c):new Error(c)}return s}}class He{constructor(){v(this,"kind","unconfigured")}unavailable(){throw new Error("The public evaluation API is not configured.")}getCapabilities(){return Promise.reject(this.unavailable())}resolveExactCase(e){return Promise.reject(this.unavailable())}getRandomCase(e){return Promise.reject(this.unavailable())}submitEvaluation(e){return Promise.reject(this.unavailable())}getEvaluation(e){return Promise.reject(this.unavailable())}}async function Ge(){const i="https://spatiaos-eval.2565851683.workers.dev/api/".trim();if(i){const t=new URL("assets/p3d-bench-paper/v1/cases.json",new URL("/projects/P3D-Bench/self-test/",window.location.origin));if(t.origin!==window.location.origin)throw new Error("The public case catalog must be served by the reviewed Pages origin.");return new ze(i,t)}return new He}const se={AlertCircle:fe,Check:pe,ChevronDown:me,Circle:be,FileCode2:ve,Info:ge,LoaderCircle:ye,Play:we,Search:_e,Upload:Ee,X:Se},Je={not_started:"Awaiting submission",waiting:"Waiting",checking:"Checking",complete:"Complete",failed:"Failed",unavailable:"Not available"},Ke={json:"Save the final structured CAD program produced by your method as a .json file.",openscad:"Save the final OpenSCAD source from your agent or editor as a .scad file before exporting a mesh.",cadquery:"Save the final standalone CadQuery Python source produced by your method as a .py file.",threejs:"Save the final standalone Three.js geometry source produced by your method as a .js file."};function p(i){return i.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]??e)}function A(i){return i<1024?`${i} B`:i<1024*1024?`${(i/1024).toFixed(1)} KB`:`${(i/(1024*1024)).toFixed(1)} MB`}function We(i){const e=new Date(i);return Number.isNaN(e.getTime())?i:new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(e)}class Ye{constructor(e,t){v(this,"root");v(this,"transport");v(this,"pollTimer");v(this,"pollFailureCount",0);v(this,"caseRequest",0);v(this,"disposeModelViewer");v(this,"state",{task:"text2cad",format:"openscad",textMode:"descriptive",searchValue:"",caseLoading:!0,submitting:!1,provenanceOpen:!1});this.root=e,this.transport=t}async start(){var e,t;this.render();try{this.state.capabilities=await this.transport.getCapabilities(),this.ensureAvailableFormat();const a=await((t=(e=this.transport).resumeEvaluation)==null?void 0:t.call(e));a?(this.state.task=a.case.task,this.state.format=a.case.format,this.state.textMode=a.case.text_mode??"descriptive",this.state.currentCase=a.case,this.state.searchValue=a.case.uid,this.state.snapshot=a.snapshot,this.state.caseLoading=!1,this.render(),this.isTerminal(a.snapshot)||this.schedulePoll()):await this.loadRandomCase()}catch(a){this.state.caseLoading=!1,this.state.globalError=this.errorMessage(a),this.render()}}render(){var t;(t=this.disposeModelViewer)==null||t.call(this),this.disposeModelViewer=void 0;const e=this.environmentView();this.root.innerHTML=`
      <header class="masthead">
        <div class="masthead-inner">
          <div class="brand-lockup">
            <h1>P3D-Bench</h1>
            <p>Public self-evaluation</p>
          </div>
          <div class="environment environment--${e.tone}" aria-label="${p(e.ariaLabel)}">
            <span class="environment-dot" aria-hidden="true"></span>
            <span>${p(e.label)}</span>
          </div>
        </div>
      </header>

      <main id="main-content" class="app-main">
        ${this.renderGlobalError()}
        <section class="tool-shell" aria-label="P3D evaluation workspace">
          ${this.renderTaskTabs()}
          <div id="task-panel" role="tabpanel" aria-labelledby="tab-${this.state.task}">
            <section class="configuration-band" aria-label="Evaluation configuration">
              ${this.renderFormatControl()}
              ${this.state.task==="text2cad"?this.renderTextModeControl():""}
              ${this.renderCaseSearch()}
            </section>

            <div class="workspace-grid">
              ${this.renderVisibleInput()}
              ${this.renderUpload()}
            </div>

            ${this.renderResults()}
            ${this.renderProvenance()}
          </div>
        </section>
      </main>
    `,this.bindEvents(),Z({icons:se,attrs:{"aria-hidden":"true","stroke-width":"1.8"}}),this.mountModelViewer()}environmentView(){var t,a;const e=(a=(t=this.transport).connectionState)==null?void 0:a.call(t);return e?{label:e.label,ariaLabel:e.message||e.label,tone:e.available?"live":"offline"}:this.transport.kind==="api"||this.transport.kind==="gateway"?{label:"Connected",ariaLabel:"Connected to the public evaluation API",tone:"live"}:this.transport.kind==="fixture"?{label:"Preview fixture",ariaLabel:"Local development fixture is active and cannot produce scores",tone:"fixture"}:{label:"API unavailable",ariaLabel:"The public evaluation API is not configured",tone:"offline"}}renderGlobalError(){return this.state.globalError?`
      <div class="global-alert" role="alert" tabindex="-1" data-testid="global-error">
        <i data-lucide="alert-circle"></i>
        <div>
          <strong>Connection unavailable</strong>
          <span>${p(this.state.globalError)}</span>
        </div>
      </div>
    `:""}renderTaskTabs(){return`
      <nav class="task-tabs" role="tablist" aria-label="P3D task">
        ${E.map(e=>`
            <button
              id="tab-${e.id}"
              class="task-tab ${this.state.task===e.id?"is-active":""}"
              type="button"
              role="tab"
              aria-selected="${this.state.task===e.id}"
              aria-controls="task-panel"
              tabindex="${this.state.task===e.id?"0":"-1"}"
              data-task="${e.id}"
            >
              ${p(e.label)}
            </button>
          `).join("")}
      </nav>
    `}renderFormatControl(){return`
      <fieldset class="control-group format-control">
        <legend>Source format</legend>
        <div class="segmented-control" data-testid="format-control">
          ${R[this.state.task].map(t=>{const a=this.getFormatCapabilities().find(s=>s.id===t.id);return{...t,available:(a==null?void 0:a.status)==="available"}}).map(t=>`
                <label class="segment ${t.available?"":"is-disabled"}">
                  <input
                    type="radio"
                    name="format"
                    value="${t.id}"
                    ${this.state.format===t.id?"checked":""}
                    ${t.available?"":"disabled"}
                  />
                  <span>
                    <b>${p(t.label)}</b>
                    ${t.available?"":"<small>Not available</small>"}
                  </span>
                </label>
              `).join("")}
        </div>
      </fieldset>
    `}renderTextModeControl(){return`
      <fieldset class="control-group text-mode-control" data-testid="text-mode-control">
        <legend>Specification</legend>
        <div class="segmented-control">
          ${["descriptive","parametric"].map(e=>`
                <label class="segment">
                  <input
                    type="radio"
                    name="text-mode"
                    value="${e}"
                    ${this.state.textMode===e?"checked":""}
                  />
                  <span><b>${e==="descriptive"?"Descriptive":"Parametric"}</b></span>
                </label>
              `).join("")}
        </div>
      </fieldset>
    `}renderCaseSearch(){return`
      <form class="case-search" data-testid="case-search" novalidate>
        <label for="uid-search">Exact UID</label>
        <div class="case-search-row">
          <div class="search-input-wrap">
            <input
              id="uid-search"
              name="uid"
              type="search"
              autocomplete="off"
              spellcheck="false"
              placeholder="Enter a complete UID"
              value="${p(this.state.searchValue)}"
              ${this.state.caseLoading||!this.state.capabilities?"disabled":""}
            />
          </div>
          <button class="button button--secondary icon-command" type="submit" aria-label="Find UID" title="Find UID" ${this.state.caseLoading||!this.state.capabilities?"disabled":""}>
            <i data-lucide="search"></i>
          </button>
          <button class="button button--secondary" type="button" data-action="random" ${this.state.caseLoading||!this.state.capabilities?"disabled":""}>
            <span>Random case</span>
          </button>
        </div>
        ${this.state.caseError?`<p id="case-error" class="field-error" role="alert" tabindex="-1"><i data-lucide="alert-circle"></i>${p(this.state.caseError)}</p>`:""}
      </form>
    `}renderVisibleInput(){if(this.state.caseLoading)return`
        <section class="visible-input" aria-labelledby="visible-input-title" aria-busy="true">
          <div class="section-heading">
            <div>
              <h2 id="visible-input-title">Visible input</h2>
              <p class="section-meta">Loading case...</p>
            </div>
            <i class="loading-icon" data-lucide="loader-circle"></i>
          </div>
          <div class="case-skeleton" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>
        </section>
      `;const e=this.state.currentCase;if(!e)return`
        <section class="visible-input" aria-labelledby="visible-input-title">
          <div class="section-heading">
            <div>
              <h2 id="visible-input-title">Visible input</h2>
              <p class="section-meta">No case selected</p>
            </div>
          </div>
          <div class="empty-input"><i data-lucide="file-code-2"></i><span>No public input is available.</span></div>
        </section>
      `;const t=e.image?`
          <figure class="reference-figure">
            <img src="${p(e.image.url)}" alt="${p(e.image.alt)}" />
          </figure>
        `:"",a=e.prompt?`
          <article class="prompt-panel">
            <h3>Prompt</h3>
            <p>${p(e.prompt)}</p>
          </article>
        `:"",s=e.image?e.prompt?"image-and-prompt":"image-only":"text-only";return`
      <section class="visible-input" aria-labelledby="visible-input-title" data-testid="visible-input">
        <div class="section-heading">
          <div>
            <h2 id="visible-input-title">Visible input</h2>
            <p class="section-meta">UID <code>${p(e.uid)}</code></p>
          </div>
        </div>
        <div class="input-content ${s}">
          ${t}
          ${a}
        </div>
      </section>
    `}renderUpload(){var o,l,h,u,m,b;const e=this.selectedCapability(),t=(e==null?void 0:e.accept.join(","))||((o=this.state.currentCase)==null?void 0:o.source_accept.join(","))||".scad",a=(e==null?void 0:e.max_bytes)||((l=this.state.currentCase)==null?void 0:l.source_max_bytes)||8*1024*1024,s=this.state.source,r=((h=this.state.snapshot)==null?void 0:h.state)==="validating"||((u=this.state.snapshot)==null?void 0:u.state)==="evaluating",c=!this.state.currentCase||this.state.caseLoading||this.state.submitting||r,n=(b=(m=this.transport).connectionState)==null?void 0:b.call(m),d=(n==null?void 0:n.available)!==!1;return`
      <section class="source-panel" aria-labelledby="source-title">
        <div class="section-heading">
          <div>
            <h2 id="source-title">Submit source</h2>
            <p class="section-meta">${p(t.split(",").join(" or "))} · up to ${A(a)}</p>
          </div>
        </div>

        <div class="upload-body">
          ${this.state.currentCase?`
                <div class="source-guidance" data-testid="source-guidance">
                  <i data-lucide="info"></i>
                  <div>
                    <strong>Upload the final source for UID <code>${p(this.state.currentCase.uid)}</code></strong>
                    <p>${p(Ke[this.state.format])} Do not upload an STL or mesh, screenshot, log, or trajectory.</p>
                  </div>
                </div>
              `:""}
          ${(n==null?void 0:n.available)===!1?`<p class="intake-note" role="status"><i data-lucide="alert-circle"></i>${p(n.message||"Evaluation intake is temporarily unavailable.")}</p>`:""}
          <label class="upload-drop ${c?"is-disabled":""}" data-testid="upload-drop">
            <input
              class="file-input"
              type="file"
              name="source"
              accept="${p(t)}"
              ${c?"disabled":""}
            />
            <i data-lucide="upload"></i>
            <span><b>Select source file</b><small>${p(t.split(",").join(" or "))}</small></span>
          </label>

          ${s?`
                <div class="selected-file" data-testid="selected-file">
                  <i data-lucide="file-code-2"></i>
                  <span><b>${p(s.name)}</b><small>${A(s.size)}</small></span>
                  <button class="icon-button" type="button" data-action="remove-file" aria-label="Remove selected file" title="Remove file">
                    <i data-lucide="x"></i>
                  </button>
                </div>
              `:""}

          ${this.state.sourceError?`<p id="source-error" class="field-error" role="alert" tabindex="-1"><i data-lucide="alert-circle"></i>${p(this.state.sourceError)}</p>`:""}
          ${this.state.evaluationError?`<p id="evaluation-error" class="field-error" role="alert" tabindex="-1"><i data-lucide="alert-circle"></i>${p(this.state.evaluationError)}</p>`:""}

          <button
            class="button button--primary evaluate-button"
            type="button"
            data-action="evaluate"
            ${!s||!d||c?"disabled":""}
          >
            <i class="${this.state.submitting||r?"loading-icon":""}" data-lucide="${this.state.submitting||r?"loader-circle":"play"}"></i>
            <span>${this.state.submitting?"Submitting":r?"Evaluation in progress":"Evaluate source"}</span>
          </button>
        </div>
      </section>
    `}renderResults(){var a,s;const e=((a=this.state.snapshot)==null?void 0:a.result)??M(),t=this.evaluationStatus();return`
      <section class="results-section" aria-labelledby="results-title" aria-live="polite" data-testid="results" tabindex="-1">
        <div class="results-heading">
          <div>
            <h2 id="results-title">Results</h2>
          </div>
          <span class="evaluation-state evaluation-state--${t.tone}">
            <i class="${t.spinning?"loading-icon":""}" data-lucide="${t.icon}"></i>
            ${p(t.label)}
          </span>
        </div>
        ${(s=this.state.snapshot)!=null&&s.message&&this.state.snapshot.state!=="complete"&&this.state.snapshot.message!==e.message?`<div class="evaluation-message ${this.transport.kind==="fixture"?"is-fixture":""}">${p(this.state.snapshot.message)}</div>`:""}
        ${this.renderMetricResults(e)}
        <p class="judge-note">
          <strong>Judge</strong>
          <span>Judge is not included in public self-evaluation because it requires a separate MLLM evaluator.</span>
        </p>
        ${this.renderModelViewer()}
      </section>
    `}renderModelViewer(){var e;return((e=this.state.snapshot)==null?void 0:e.state)!=="complete"||!this.state.snapshot.visualization?"":`
      <figure class="model-figure" aria-labelledby="model-figure-title" data-testid="model-viewer">
        <figcaption>
          <h3 id="model-figure-title">Generated model</h3>
        </figcaption>
        <div class="model-viewer" data-model-viewer aria-label="Interactive rendering of the generated model">
          <span class="model-viewer-status"><i class="loading-icon" data-lucide="loader-circle"></i>Loading model</span>
        </div>
      </figure>
    `}mountModelViewer(){var r;const e=this.root.querySelector("[data-model-viewer]"),t=(r=this.state.snapshot)==null?void 0:r.visualization;if(!e||!t)return;let a=!1,s;this.disposeModelViewer=()=>{a=!0,s==null||s()},this.createModelViewer(e,t,()=>a).then(c=>{a?c():s=c}).catch(()=>{if(a)return;const c=e.querySelector(".model-viewer-status");c&&(c.textContent="Model preview unavailable")})}async createModelViewer(e,t,a){var J;const[s,{OrbitControls:r},{STLLoader:c}]=await Promise.all([q(()=>import("./three.module-BTt32e3U.js"),[]),q(()=>import("./OrbitControls-BSM_CLzo.js"),__vite__mapDeps([0,1])),q(()=>import("./STLLoader-DnLadrxH.js"),__vite__mapDeps([2,1]))]);if(a())return()=>{};const n=new s.Scene;n.background=new s.Color(16777215),n.fog=new s.Fog(16777215,6.8,12.2);const d=new s.PerspectiveCamera(38,1,.01,100);d.position.set(3.6,2.35,4.35);const o=new s.WebGLRenderer({antialias:!0,alpha:!1,preserveDrawingBuffer:!0});o.setPixelRatio(Math.min(window.devicePixelRatio,2)),o.setClearColor(16777215,1),o.outputColorSpace=s.SRGBColorSpace,o.toneMapping=s.ACESFilmicToneMapping,o.toneMappingExposure=1,o.shadowMap.enabled=!0,o.shadowMap.type=s.PCFSoftShadowMap,e.appendChild(o.domElement);const l=new r(d,o.domElement);l.enableDamping=!0,l.autoRotate=!window.matchMedia("(prefers-reduced-motion: reduce)").matches,l.autoRotateSpeed=1.2,l.enablePan=!1,l.minDistance=2.2,l.maxDistance=7.5,n.add(new s.HemisphereLight(16449532,12176066,1.95));const h=new s.DirectionalLight(16777215,2.65);h.position.set(3.8,4.8,3.5),h.castShadow=!0,h.shadow.mapSize.set(1024,1024),n.add(h);const u=new s.DirectionalLight(12053215,.86);u.position.set(-3.2,2.2,-2.6),n.add(u);const m=new s.DirectionalLight(13035007,.62);m.position.set(-2.4,3.4,3.4),n.add(m);const b={text2cad:{body:12573164,edge:3239058,shadow:5927810,rim:14282751},image2cad:{body:11918799,edge:3044708,shadow:5208172,rim:14284010},text_image2cad:{body:12574175,edge:4945280,shadow:5993595,rim:14808566}}[((J=this.state.currentCase)==null?void 0:J.task)??"text2cad"],f=new s.Mesh(new s.PlaneGeometry(6,4),new s.ShadowMaterial({color:b.shadow,opacity:.09}));f.rotation.x=-Math.PI/2,f.position.y=-1.06,f.receiveShadow=!0,n.add(f);const _=new s.Group;_.rotation.x=-Math.PI/2,n.add(_);const g=e.querySelector(".model-viewer-status");let k=!1,V=0,P=null,x=null,T=null,$=null;new c().load(t.url,y=>{var K;if(k){y.dispose();return}y.computeVertexNormals(),y.computeBoundingBox(),y.center();const C=new s.Vector3;(K=y.boundingBox)==null||K.getSize(C);const D=Math.max(C.x,C.y,C.z)||1;y.scale(2.32/D,2.32/D,2.32/D),P=y,x=new s.MeshPhysicalMaterial({color:b.body,roughness:.58,metalness:.02,clearcoat:.1,clearcoatRoughness:.68,emissive:b.rim,emissiveIntensity:.006});const U=new s.Mesh(y,x);U.castShadow=!0,U.receiveShadow=!0,_.add(U),T=new s.EdgesGeometry(y,28),$=new s.LineBasicMaterial({color:b.edge,transparent:!0,opacity:.24}),_.add(new s.LineSegments(T,$)),g==null||g.remove()},void 0,()=>{g&&(g.classList.remove("is-loading"),g.textContent="Model preview unavailable")});const z=()=>{const y=Math.max(280,e.clientWidth),C=Math.max(300,e.clientHeight);o.setSize(y,C,!1),d.aspect=y/C,d.updateProjectionMatrix()},H=new ResizeObserver(z);H.observe(e),z();const G=()=>{V=requestAnimationFrame(G),l.update(),o.render(n,d)};return G(),()=>{k=!0,cancelAnimationFrame(V),H.disconnect(),l.dispose(),P==null||P.dispose(),x==null||x.dispose(),T==null||T.dispose(),$==null||$.dispose(),f.geometry.dispose(),f.material.dispose(),o.dispose(),o.domElement.remove()}}renderMetricResults(e){const t=e.metrics.find(r=>r.bucket==="Valid"),a=["Geometry","Topology","Part"].flatMap(r=>{const c=e.metrics.filter(n=>n.bucket===r);return c.length?[`
        <section class="metric-bucket" aria-labelledby="metric-bucket-${r.toLowerCase()}">
          <h4 id="metric-bucket-${r.toLowerCase()}">${r}</h4>
          <dl class="metric-list">
            ${c.map(n=>`
              <div>
                <dt>${p(n.label)}</dt>
                <dd>${p(String(n.value))}${n.unit?` <small>${p(n.unit)}</small>`:""}</dd>
              </div>
            `).join("")}
          </dl>
        </section>
      `]:[]}).join(""),s=e.metrics.length?`
          <div class="paper-metrics">
            ${t?`
              <div class="valid-result">
                <span>Valid</span>
                <strong>${p(String(t.value))}</strong>
              </div>
            `:""}
            ${a}
          </div>
        `:`<p class="no-metrics">${p(e.message||(e.state==="not_started"?"Metrics will appear after evaluation.":Je[e.state]))}</p>`;return`
      <div class="metric-results metric-results--${e.state}">
        <div class="metric-results-heading">
          <h3>Metrics</h3>
        </div>
        ${s}
      </div>
    `}renderProvenance(){var a,s;const e=(a=this.state.snapshot)==null?void 0:a.provenance,t=[["Transport",this.transport.kind==="gateway"?"Secure public gateway":this.transport.kind==="api"?"Public API":this.transport.kind==="fixture"?"Development fixture":"Not configured"],...e!=null&&e.public_reference?[["Public reference",e.public_reference]]:[],["Evaluation mode",(e==null?void 0:e.evaluation_mode)==="deterministic"?"Deterministic":"Not reported"],["Evaluator",(e==null?void 0:e.evaluator)||"Not reported"],["Adapter",(e==null?void 0:e.adapter_version)||"Not reported"],["Source",(e==null?void 0:e.source_name)||((s=this.state.source)==null?void 0:s.name)||"Not submitted"],["Source size",e?A(e.source_bytes):this.state.source?A(this.state.source.size):"Not submitted"],["Source SHA-256",(e==null?void 0:e.source_sha256)||"Not reported"],["Submitted",e!=null&&e.submitted_at?We(e.submitted_at):"Not submitted"],["Retention",(e==null?void 0:e.retention)||"Not reported"]];return`
      <details class="provenance-drawer" data-testid="provenance" ${this.state.provenanceOpen?"open":""}>
        <summary>
          <span>Technical provenance</span>
          <i class="drawer-chevron" data-lucide="chevron-down"></i>
        </summary>
        <dl>
          ${t.map(([r,c])=>`
                <div>
                  <dt>${p(r)}</dt>
                  <dd>${p(c)}</dd>
                </div>
              `).join("")}
        </dl>
      </details>
    `}bindEvents(){var c,n,d;this.root.querySelectorAll("[data-task]").forEach(o=>{o.addEventListener("click",()=>{this.selectTask(o.dataset.task)})});const e=this.root.querySelector("[role='tablist']");e==null||e.addEventListener("keydown",o=>this.handleTabKeys(o)),this.root.querySelectorAll("input[name='format']").forEach(o=>{o.addEventListener("change",()=>{this.selectFormat(o.value)})}),this.root.querySelectorAll("input[name='text-mode']").forEach(o=>{o.addEventListener("change",()=>{this.selectTextMode(o.value)})});const t=this.root.querySelector(".case-search");t==null||t.addEventListener("submit",o=>{o.preventDefault();const l=t.elements.namedItem("uid");this.loadExactCase((l==null?void 0:l.value)??"")}),(c=this.root.querySelector("[data-action='random']"))==null||c.addEventListener("click",()=>{this.loadRandomCase()});const a=this.root.querySelector(".file-input");a==null||a.addEventListener("change",()=>{this.acceptFiles(a.files)});const s=this.root.querySelector(".upload-drop");s==null||s.addEventListener("dragover",o=>{o.preventDefault(),s.classList.contains("is-disabled")||s.classList.add("is-dragging")}),s==null||s.addEventListener("dragleave",()=>s.classList.remove("is-dragging")),s==null||s.addEventListener("drop",o=>{var l;o.preventDefault(),s.classList.remove("is-dragging"),s.classList.contains("is-disabled")||this.acceptFiles(((l=o.dataTransfer)==null?void 0:l.files)??null)}),(n=this.root.querySelector("[data-action='remove-file']"))==null||n.addEventListener("click",()=>{this.state.source=void 0,this.state.sourceError=void 0,this.clearEvaluation(),this.render()}),(d=this.root.querySelector("[data-action='evaluate']"))==null||d.addEventListener("click",()=>{this.evaluate()});const r=this.root.querySelector(".provenance-drawer");r==null||r.addEventListener("toggle",()=>{this.state.provenanceOpen=r.open})}handleTabKeys(e){if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.preventDefault();const a=E.findIndex(c=>c.id===this.state.task);let s=a;e.key==="ArrowRight"&&(s=(a+1)%E.length),e.key==="ArrowLeft"&&(s=(a-1+E.length)%E.length),e.key==="Home"&&(s=0),e.key==="End"&&(s=E.length-1);const r=E[s].id;this.selectTask(r,!0)}async selectTask(e,t=!1){var a;e!==this.state.task&&(this.caseRequest+=1,this.clearEvaluation(),this.state.task=e,this.state.textMode="descriptive",this.state.source=void 0,this.state.sourceError=void 0,this.state.caseError=void 0,this.state.searchValue="",this.ensureAvailableFormat(),await this.loadRandomCase(),t&&((a=this.root.querySelector(`[data-task='${e}']`))==null||a.focus()))}async selectFormat(e){e!==this.state.format&&(this.clearEvaluation(),this.state.format=e,this.state.source=void 0,await this.reloadCurrentCase())}async selectTextMode(e){e!==this.state.textMode&&(this.clearEvaluation(),this.state.textMode=e,this.state.source=void 0,await this.reloadCurrentCase())}async reloadCurrentCase(){var e;(e=this.state.currentCase)!=null&&e.uid?await this.loadExactCase(this.state.currentCase.uid):await this.loadRandomCase()}async loadExactCase(e){const t=e.trim();if(!t){this.state.caseError="Enter a complete UID.",this.render(),this.focusAlert("#case-error");return}await this.loadCase(()=>this.transport.resolveExactCase({...this.caseQuery(),uid:t}))}async loadRandomCase(){await this.loadCase(()=>this.transport.getRandomCase(this.caseQuery()))}async loadCase(e){const t=++this.caseRequest,a=this.state.currentCase;this.state.caseLoading=!0,this.state.caseError=void 0,this.render();try{const s=await e();if(t!==this.caseRequest)return;this.clearEvaluation(),this.state.currentCase=s,this.state.searchValue=s.uid,this.state.source=void 0,this.state.sourceError=void 0}catch(s){if(t!==this.caseRequest)return;this.state.currentCase=a,this.state.caseError=this.errorMessage(s)}finally{t===this.caseRequest&&(this.state.caseLoading=!1,this.render(),this.state.caseError&&this.focusAlert("#case-error"))}}acceptFiles(e){var n,d;if(this.state.sourceError=void 0,this.state.evaluationError=void 0,!e||e.length!==1){this.state.source=void 0,this.state.sourceError="Select exactly one source file.",this.render(),this.focusAlert("#source-error");return}const t=e[0],a=this.selectedCapability(),s=(a==null?void 0:a.accept)??((n=this.state.currentCase)==null?void 0:n.source_accept)??[],r=(a==null?void 0:a.max_bytes)??((d=this.state.currentCase)==null?void 0:d.source_max_bytes)??0,c=t.name.toLowerCase();s.some(o=>c.endsWith(o.toLowerCase()))?t.size===0?(this.state.source=void 0,this.state.sourceError="The source file is empty."):t.size>r?(this.state.source=void 0,this.state.sourceError=`The source file exceeds ${A(r)}.`):(this.clearEvaluation(),this.state.source=t):(this.state.source=void 0,this.state.sourceError=`Use a ${s.join(" or ")} source file.`),this.render(),this.state.sourceError?this.focusAlert("#source-error"):window.requestAnimationFrame(()=>{var o;(o=this.root.querySelector("[data-action='evaluate']"))==null||o.focus({preventScroll:!0})})}async evaluate(){if(!(!this.state.currentCase||!this.state.source||this.state.submitting)){this.state.submitting=!0,this.state.evaluationError=void 0,this.render();try{const e=await this.transport.submitEvaluation({case:this.state.currentCase,source:this.state.source});this.state.snapshot=e,(this.transport.kind==="api"||this.transport.kind==="gateway")&&!this.isTerminal(e)&&this.schedulePoll()}catch(e){this.state.evaluationError=this.errorMessage(e)}finally{this.state.submitting=!1,this.render(),this.state.evaluationError?this.focusAlert("#evaluation-error"):this.state.snapshot&&window.requestAnimationFrame(()=>{var e;(e=this.root.querySelector(".results-section"))==null||e.focus({preventScroll:!0})})}}}schedulePoll(e=1e3){window.clearTimeout(this.pollTimer),this.pollTimer=window.setTimeout(()=>void this.poll(),e)}async poll(){var t;const e=(t=this.state.snapshot)==null?void 0:t.evaluation_ref;if(e)try{const a=await this.transport.getEvaluation(e);this.pollFailureCount=0,this.state.evaluationError=void 0,this.state.snapshot=a,this.render(),this.isTerminal(a)||this.schedulePoll()}catch(a){if(Ne(a)&&this.state.snapshot){this.pollFailureCount+=1;const s=Math.min(8,2**Math.min(this.pollFailureCount-1,3));this.state.evaluationError=void 0,this.state.snapshot={...this.state.snapshot,message:`The evaluation connection was interrupted. Retrying in ${s} second${s===1?"":"s"}.`},this.render(),this.schedulePoll(s*1e3);return}this.state.evaluationError=this.errorMessage(a),this.render()}}isTerminal(e){return e.state==="complete"||e.state==="failed"}clearEvaluation(){var t,a,s;window.clearTimeout(this.pollTimer),this.pollTimer=void 0,this.pollFailureCount=0;const e=(t=this.state.snapshot)==null?void 0:t.evaluation_ref;e&&((s=(a=this.transport).releaseEvaluation)==null||s.call(a,e)),this.state.snapshot=void 0,this.state.evaluationError=void 0}caseQuery(){return{task:this.state.task,format:this.state.format,...this.state.task==="text2cad"?{text_mode:this.state.textMode}:{}}}getFormatCapabilities(){var e,t;return((t=(e=this.state.capabilities)==null?void 0:e.tasks.find(a=>a.task===this.state.task))==null?void 0:t.formats)??[]}selectedCapability(){return this.getFormatCapabilities().find(e=>e.id===this.state.format)}ensureAvailableFormat(){var t;const e=this.getFormatCapabilities().filter(a=>a.status==="available");e.some(a=>a.id===this.state.format)||(this.state.format=((t=e[0])==null?void 0:t.id)??"openscad")}evaluationStatus(){var t;if(this.state.submitting)return{label:"Submitting",icon:"loader-circle",tone:"active",spinning:!0};const e=(t=this.state.snapshot)==null?void 0:t.state;return e==="validating"||e==="evaluating"?{label:e==="validating"?"Validating":"Evaluating",icon:"loader-circle",tone:"active",spinning:!0}:e==="complete"?{label:"Complete",icon:"check",tone:"success",spinning:!1}:e==="failed"?{label:"Failed",icon:"alert-circle",tone:"danger",spinning:!1}:{label:"Awaiting submission",icon:"circle",tone:"idle",spinning:!1}}focusAlert(e){window.requestAnimationFrame(()=>{var t;(t=this.root.querySelector(e))==null||t.focus()})}errorMessage(e){return e instanceof Error?e.message:"The request could not be completed."}}const ae=document.querySelector("#app");if(!ae)throw new Error("Application root is missing.");async function Qe(i){i.innerHTML=`
    <main class="boot-screen" aria-busy="true">
      <i class="loading-icon" data-lucide="loader-circle"></i>
      <span>Loading evaluation tool</span>
    </main>
  `,Z({icons:se,attrs:{"aria-hidden":"true","stroke-width":"1.8"}});const e=await Ge();await new Ye(i,e).start()}Qe(ae);
