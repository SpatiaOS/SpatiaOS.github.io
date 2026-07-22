const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/OrbitControls-BSM_CLzo.js","assets/three.module-BTt32e3U.js","assets/STLLoader-DnLadrxH.js"])))=>i.map(i=>d[i]);
var ie=Object.defineProperty;var re=(i,e,t)=>e in i?ie(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var b=(i,e,t)=>re(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const oe="modulepreload",ne=function(i){return"/projects/P3D-Bench/self-test/"+i},W={},q=function(e,t,a){let s=Promise.resolve();if(t&&t.length>0){let n=function(o){return Promise.all(o.map(l=>Promise.resolve(l).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),d=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));s=n(t.map(o=>{if(o=ne(o),o in W)return;W[o]=!0;const l=o.endsWith(".css"),h=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${h}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":oe,l||(u.as="script"),u.crossOrigin="",u.href=o,d&&u.setAttribute("nonce",d),document.head.appendChild(u),l)return new Promise((m,v)=>{u.addEventListener("load",m),u.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${o}`)))})}))}function r(n){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=n,window.dispatchEvent(c),!c.defaultPrevented)throw n}return s.then(n=>{for(const c of n||[])c.status==="rejected"&&r(c.reason);return e().catch(r)})};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=(i,e,t=[])=>{const a=document.createElementNS("http://www.w3.org/2000/svg",i);return Object.keys(e).forEach(s=>{a.setAttribute(s,String(e[s]))}),t.length&&t.forEach(s=>{const r=Q(...s);a.appendChild(r)}),a};var ce=([i,e,t])=>Q(i,e,t);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=i=>Array.from(i.attributes).reduce((e,t)=>(e[t.name]=t.value,e),{}),de=i=>typeof i=="string"?i:!i||!i.class?"":i.class&&typeof i.class=="string"?i.class.split(" "):i.class&&Array.isArray(i.class)?i.class:"",ue=i=>i.flatMap(de).map(t=>t.trim()).filter(Boolean).filter((t,a,s)=>s.indexOf(t)===a).join(" "),he=i=>i.replace(/(\w)(\w*)(_|-|\s*)/g,(e,t,a)=>t.toUpperCase()+a.toLowerCase()),Y=(i,{nameAttr:e,icons:t,attrs:a})=>{var v;const s=i.getAttribute(e);if(s==null)return;const r=he(s),n=t[r];if(!n)return console.warn(`${i.outerHTML} icon name was not found in the provided icons object.`);const c=le(i),[d,o,l]=n,h={...o,"data-lucide":s,...a,...c},u=ue(["lucide",`lucide-${s}`,c,a]);u&&Object.assign(h,{class:u});const m=ce([d,h,l]);return(v=i.parentNode)==null?void 0:v.replaceChild(m,i)};/**
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
 */const ve=["svg",w,[["circle",{cx:"12",cy:"12",r:"10"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=["svg",w,[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"m5 12-3 3 3 3"}],["path",{d:"m9 18 3-3-3-3"}]]];/**
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
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const a=document.querySelectorAll(`[${e}]`);if(Array.from(a).forEach(s=>Y(s,{nameAttr:e,icons:i,attrs:t})),e==="data-lucide"){const s=document.querySelectorAll("[icon-name]");s.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(s).forEach(r=>Y(r,{nameAttr:"icon-name",icons:i,attrs:t})))}},E=[{id:"text2cad",label:"Text-to-3D"},{id:"image2cad",label:"Image-to-3D"},{id:"text_image2cad",label:"Assembly-3D"}],R={text2cad:[{id:"json",label:"JSON"},{id:"openscad",label:"OpenSCAD"}],image2cad:[{id:"openscad",label:"OpenSCAD"},{id:"cadquery",label:"CadQuery"},{id:"threejs",label:"Three.js"}],text_image2cad:[{id:"openscad",label:"OpenSCAD"},{id:"cadquery",label:"CadQuery"}]};function M(){return{state:"not_started",metrics:[]}}const X=[{keys:["chamfer_distance"],label:"CD ↓",bucket:"Geometry"},{keys:["iou_csg"],label:"IoU_C ↑",bucket:"Geometry",tasks:["text2cad"]},{keys:["iou_voxel"],label:"IoU_V ↑",bucket:"Geometry",tasks:["image2cad","text_image2cad"]},{keys:["f_score_005"],label:"F@.05 ↑",bucket:"Geometry"},{keys:["f_score_001"],label:"F@.01 ↑",bucket:"Geometry"},{keys:["normal_consistency"],label:"NC ↑",bucket:"Geometry"},{keys:["pred_open_edge_ratio"],label:"NoOE ↑",bucket:"Topology",transform:i=>i===0?1:0},{keys:["pred_inverted_normal_ratio"],label:"InvN ↓",bucket:"Topology"},{keys:["pred_non_manifold_edge_ratio"],label:"NM ↓",bucket:"Topology"},{keys:["part_match_f1"],label:"PartMatchF1 ↑",bucket:"Part",tasks:["text_image2cad"]},{keys:["part_fscore_mean","part_fscore"],label:"PartFS ↑",bucket:"Part",tasks:["text_image2cad"]}];new Map(X.flatMap(({keys:i,label:e})=>i.map(t=>[t,e])));function ke(i,e){return typeof e=="boolean"?e?"Yes":"No":Number.isFinite(e)?i==="pred_open_edge_ratio"?e.toFixed(3):i.includes("chamfer")||i.includes("hausdorff")||i==="stage2_fidelity_cd"?e===0?"0":e<.01?e.toFixed(4):e.toFixed(3):e<1?e.toFixed(3):e.toFixed(2):String(e)}function Ce(i,e={task:"text2cad",textMode:"parametric"}){const t=i.metrics&&typeof i.metrics=="object"&&!Array.isArray(i.metrics)?i.metrics:{},s=e.task!=="text2cad"||e.textMode!=="descriptive"?X.flatMap(n=>{if(n.tasks&&!n.tasks.includes(e.task))return[];const c=n.keys.find(l=>typeof t[l]=="number");if(!c)return[];const d=t[c],o=n.transform?n.transform(d):d;return[{key:c,label:n.label,bucket:n.bucket,value:ke(c,o)}]}):[];typeof i.valid=="boolean"&&s.unshift({key:"valid",label:"Valid",bucket:"Valid",value:i.valid?"Yes":"No"});const r=i.evaluation_status==="failed";return{state:r?"failed":"complete",message:r?String(i.evaluation_failure_reason??"Evaluation failed"):s.length?void 0:"No P3D-Bench metrics were reported.",metrics:s}}async function ee(i,e,t){var o;const a=i.headers.get("content-length");if(a!==null){const l=Number(a);if(!Number.isSafeInteger(l)||l<0||l>e)throw new Error(t)}const s=(o=i.body)==null?void 0:o.getReader();if(!s)throw new Error(t);const r=[];let n=0;for(;;){const l=await s.read();if(l.done)break;if(n+=l.value.byteLength,n>e)throw await s.cancel(),new Error(t);r.push(l.value)}const c=new Uint8Array(n);let d=0;for(const l of r)c.set(l,d),d+=l.byteLength;try{return JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(c))}catch{throw new Error(t)}}const I={text2cad:400,image2cad:400,text_image2cad:203},Te=/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/,$e=/^[a-z0-9][a-z0-9._-]{0,127}$/,D=/^[0-9a-f]{64}$/,Ae=8*1024*1024;function S(i,e){if(!i||typeof i!="object"||Array.isArray(i))throw new Error(`The public ${e} is invalid.`);return i}function xe(i){const e=String(i??"");if(!/^visible-inputs\/[A-Za-z0-9_-]+\.png$/.test(e)||e.includes("..")||e.includes("\\"))throw new Error("The public case image path is invalid.");return e}function Pe(i){const e=S(i,"case input variant"),t=e.prompt_profile===null?null:String(e.prompt_profile??""),a=e.prompt===null?null:String(e.prompt??""),s=String(e.visible_input_sha256??"");if(t!==null&&!$e.test(t)||t===null!=(a===null))throw new Error("The public case prompt contract is invalid.");if(a!==null&&!a.trim())throw new Error("The public case prompt is empty.");if(!D.test(s))throw new Error("The public visible-input digest is invalid.");const r=S(e.static_submission_contract,"static case contract"),n=S(e.static_submission_proof,"static case proof");if(r.schema_version!=="spatiaos-public-static-case-contract-v1"||n.schema_version!=="spatiaos-public-static-case-proof-v1"||!Number.isSafeInteger(n.leaf_index)||n.leaf_index<0||!Array.isArray(n.siblings)||n.siblings.length>32||n.siblings.some(c=>!c||!["left","right"].includes(String(c.position))||!D.test(String(c.sha256))))throw new Error("The public static submission proof is invalid.");return{prompt_profile:t,prompt:a,visible_input_sha256:s,static_submission_contract:r,static_submission_proof:n}}function Ie(i){if(i===null)return null;const e=S(i,"case image"),t={path:xe(e.path),sha256:String(e.sha256??""),bytes:Number(e.bytes),width:Number(e.width),height:Number(e.height),render_profile:String(e.render_profile??"")};if(!D.test(t.sha256)||!Number.isSafeInteger(t.bytes)||t.bytes<24||t.bytes>1024*1024||t.width!==1024||t.height!==1024||t.render_profile!=="cadbenchmark_occ_single_view_v1")throw new Error("The public case image contract is invalid.");return t}function Le(i,e,t){const a=S(i,"case catalog entry"),s=String(a.uid??""),r=Number(a.case_index),n=a.default_prompt_profile===null?null:String(a.default_prompt_profile??""),c=Array.isArray(a.input_variants)?a.input_variants.map(Pe):[],d=String(a.source_basename??"");if(!Te.test(s)||r!==t||!c.length||!/^[A-Za-z0-9][A-Za-z0-9._-]{2,191}$/.test(d))throw new Error(`The public ${e} case catalog is invalid.`);if(n!==null&&!c.some(u=>u.prompt_profile===n)||n!==(e==="text2cad"?"parametric":e==="text_image2cad"?"intermediate":null))throw new Error(`The public ${e} prompt profile is invalid.`);const o=c.map(u=>u.prompt_profile).sort(),l=e==="text2cad"?["descriptive","parametric"]:e==="text_image2cad"?["intermediate"]:[null];if(JSON.stringify(o)!==JSON.stringify(l.sort()))throw new Error(`The public ${e} prompt variants are invalid.`);const h=Ie(a.image);if(e==="text2cad"!=(h===null))throw new Error(`The public ${e} visible-image contract is invalid.`);for(const u of c){const m=u.static_submission_contract;if(m.benchmark!=="p3d"||m.suite_id!=="p3d-bench-paper"||m.suite_version!=="v1"||m.task!==e||m.case_id!==s||m.case_index!==r||m.prompt_profile!==u.prompt_profile||m.visible_input_sha256!==u.visible_input_sha256||m.source_basename!==d)throw new Error(`The public ${e} static submission contract is invalid.`)}return{uid:s,case_index:r,default_prompt_profile:n,input_variants:c,image:h,source_basename:d}}function Me(i){const e=S(i,"case catalog"),t=S(e.tasks,"case task map"),a=S(e.task_counts,"case task counts"),s={};for(const o of Object.keys(I)){const l=t[o];if(!Array.isArray(l)||l.length!==I[o])throw new Error(`The public ${o} case count is invalid.`);if(a[o]!==I[o])throw new Error(`The public ${o} declared count is invalid.`);if(s[o]=l.map((h,u)=>Le(h,o,u+1)),new Set(s[o].map(h=>h.uid)).size!==l.length)throw new Error(`The public ${o} UID list contains duplicates.`)}const r=new Set(s.image2cad.map(o=>o.uid));if(s.text_image2cad.some(o=>!r.has(o.uid)))throw new Error("The public assembly catalog is not a subset of the image catalog.");if(e.schema_version!=="p3d-public-case-catalog-v1"||e.suite_id!=="p3d-bench-paper"||e.suite_version!=="v1"||e.total_case_count!==1003||e.hidden_geometry_published!==!1)throw new Error("The public case catalog identity is invalid.");const n=S(e.static_submission_contract,"static case root"),c=Object.values(s).flatMap(o=>o.flatMap(l=>l.input_variants)),d=c.map(o=>o.static_submission_proof.leaf_index).sort((o,l)=>o-l);if(n.schema_version!=="spatiaos-public-static-case-root-v1"||n.algorithm!=="sha256-merkle-v1"||!D.test(n.root_sha256)||n.leaf_count!==c.length||d.some((o,l)=>o!==l))throw new Error("The public static submission root is invalid.");return{schema_version:"p3d-public-case-catalog-v1",suite_id:"p3d-bench-paper",suite_version:"v1",task_counts:I,total_case_count:1003,hidden_geometry_published:!1,static_submission_contract:n,tasks:s}}class Re{constructor(e){b(this,"url");b(this,"catalog");this.url=e}async load(){if(this.catalog)return;const e=await fetch(this.url,{headers:{Accept:"application/json"},credentials:"omit"});if(!e.ok)throw new Error("The public P3D case catalog could not be loaded.");this.catalog=Me(await ee(e,Ae,"The public P3D case catalog is invalid."))}suite(){if(!this.catalog)throw new Error("The public P3D case catalog is not ready.");return{id:this.catalog.suite_id,version:this.catalog.suite_version}}staticRoot(){if(!this.catalog)throw new Error("The public P3D case catalog is not ready.");return this.catalog.static_submission_contract}resolve(e,t,a,s,r){if(!this.catalog)throw new Error("The public P3D case catalog is not ready.");const n=this.catalog.tasks[e];let c;if(s)c=n.find(h=>h.uid===s);else{const h=crypto.getRandomValues(new Uint32Array(1))[0];c=n[h%n.length]}if(!c)throw new Error("No public case matches that exact UID.");const d=e==="text2cad"?r??c.default_prompt_profile:c.default_prompt_profile,o=c.input_variants.find(h=>h.prompt_profile===d);if(!o)throw new Error("The selected public prompt profile is unavailable.");const l=a.accept[0];if(!l||!/^\.[a-z0-9]+$/.test(l))throw new Error("The selected source format is unavailable.");return{uid:c.uid,case_index:c.case_index,task:e,format:t,text_mode:e==="text2cad"?d:void 0,prompt_profile:d,prompt:o.prompt,image:c.image?{url:new URL(c.image.path,this.url).toString(),alt:`P3D visible input for UID ${c.uid}`,sha256:c.image.sha256,bytes:c.image.bytes,render_profile:c.image.render_profile}:null,visible_input_sha256:o.visible_input_sha256,static_submission_contract:o.static_submission_contract,static_submission_proof:o.static_submission_proof,source_filename:`${c.source_basename}${l}`,source_accept:a.accept,source_max_bytes:a.max_bytes}}}class j extends Error{constructor(){super(...arguments);b(this,"retryable",!0)}}function De(i){return i instanceof j}const L="spatiaos-p3d-self-test-receipt-v1",F=/^req_[0-9a-f]{32}$/,O=/^rec_[0-9a-f]{48}$/,B=/^sub_[0-9a-f]{32}$/,te=/^[0-9a-f]{64}$/,Ne=32*1024*1024,Ue=8*1024*1024,qe=2*1024*1024,je={json:".json",openscad:".scad",cadquery:".py",threejs:".js"};function Fe(i){return i==="json"?"JSON":i==="threejs"?"Three.js":i==="cadquery"?"CadQuery":"OpenSCAD"}async function Oe(i){const e=await crypto.subtle.digest("SHA-256",await i.arrayBuffer());return[...new Uint8Array(e)].map(t=>t.toString(16).padStart(2,"0")).join("")}function Be(i){var a;if(!i||typeof i!="object"||Array.isArray(i))return null;const t=i;return t.schema_version!=="p3d-public-browser-receipt-v1"||!F.test(String(t.request_id??""))||!O.test(String(t.recovery_key??""))||!B.test(String(t.submission_id??""))||!E.some(s=>s.id===t.task)||!((a=R[t.task])!=null&&a.some(s=>s.id===t.format))||!t.uid||typeof t.source_name!="string"||!Number.isSafeInteger(t.source_bytes)||t.source_bytes<1||!te.test(t.source_sha256)||Number.isNaN(new Date(t.submitted_at).getTime())?null:t}function Ve(i,e){const t=i.match(/^\/api\/submissions\/([A-Za-z0-9_-]{1,128})\/artifacts\/([A-Za-z0-9_.:-]{1,200})$/);return!t||t[1]!==e?null:i.slice(5)}class ze{constructor(e,t){b(this,"kind","gateway");b(this,"baseUrl");b(this,"cases");b(this,"evaluations",new Map);b(this,"capabilities");b(this,"staticFastPathAvailable",!1);b(this,"gatewayState",{available:!1,label:"Checking service"});if(this.baseUrl=new URL(e.endsWith("/")?e:`${e}/`,window.location.href),!this.baseUrl.pathname.endsWith("/api/"))throw new Error("The public gateway URL must end with /api/.");if(new Set(["127.0.0.1","localhost","[::1]"]).has(this.baseUrl.hostname),this.baseUrl.protocol!=="https:")throw new Error("The public gateway URL must use HTTPS.");this.cases=new Re(t)}async getCapabilities(){var a;await this.cases.load();const e=this.cases.suite(),t={evaluation_mode:"deterministic",tasks:E.map(({id:s})=>({task:s,formats:R[s].map(({id:r,label:n})=>({id:r,label:n,status:"available",accept:[je[r]],max_bytes:Ue}))}))};try{const[s,r]=await Promise.all([this.request("catalog"),this.request("capacity")]);if(s.schema_version!=="agentic-public-catalog-v1")throw new Error("The public evaluation catalog is incompatible.");const n=(a=s.suites)==null?void 0:a.find(u=>u.benchmark==="p3d"&&u.suite_id===e.id&&u.version===e.version);if(!n||n.public_self_test_status!=="available")throw new Error("P3D public self-evaluation is not currently available.");const c=this.cases.staticRoot(),d=n.static_submission_contract;this.staticFastPathAvailable=!!(d&&d.schema_version===c.schema_version&&d.algorithm===c.algorithm&&d.root_sha256===c.root_sha256&&d.leaf_count===c.leaf_count);const o=Number(r.max_submission_bytes),l=Number(r.max_result_object_bytes),h=Number(r.max_cases);if(!Number.isSafeInteger(o)||o<64*1024||o>32*1024*1024||!Number.isSafeInteger(l)||l<1024||l>64*1024*1024||!Number.isSafeInteger(h)||h<1||h>20||typeof r.accepting_requests!="boolean"||typeof r.accepting_submissions!="boolean")throw new Error("The public upload capacity contract is invalid.");if(this.capabilities={evaluation_mode:"deterministic",tasks:E.map(({id:u})=>({task:u,formats:R[u].map(({id:m,label:v})=>{var g;const f=(g=n.capabilities)==null?void 0:g.find(k=>k.task===u&&k.format===m),_=Array.isArray(f==null?void 0:f.extensions)?f.extensions.filter(k=>/^\.[a-z0-9]+$/.test(String(k))):[];return{id:m,label:v,status:(f==null?void 0:f.status)==="available"&&_.length===1?"available":"unavailable",accept:_,max_bytes:o}})}))},this.capabilities.tasks.some(u=>!u.formats.some(m=>m.status==="available")))throw new Error("The public P3D capability matrix is incomplete.");this.gatewayState=r.accepting_requests&&r.accepting_submissions?{available:!0,label:"Connected"}:{available:!1,label:"Intake paused",message:"Evaluation intake is temporarily paused."}}catch(s){this.capabilities=t,this.staticFastPathAvailable=!1,this.gatewayState={available:!1,label:"Evaluation offline",message:s instanceof Error?s.message:"The public evaluation gateway is unavailable."}}return this.capabilities}connectionState(){return this.gatewayState}async resolveExactCase(e){return this.resolveCase(e,e.uid.trim())}async getRandomCase(e){return this.resolveCase(e)}async submitEvaluation(e){if(!this.gatewayState.available)throw new Error(this.gatewayState.message||"Evaluation intake is unavailable.");const t=await Oe(e.source),a=this.cases.suite();if(this.staticFastPathAvailable&&e.case.static_submission_contract&&e.case.static_submission_proof){const o=new FormData;o.set("contract",JSON.stringify(e.case.static_submission_contract)),o.set("proof",JSON.stringify(e.case.static_submission_proof)),o.set("format",e.case.format),o.set("method","external-method"),o.set("model","user-supplied"),o.set("files",e.source,e.case.source_filename);const l=await this.request("static-submissions",{method:"POST",body:o}),h=String(l.request_id??""),u=String(l.recovery_key??""),m=String(l.submission_id??"");if(!F.test(h)||!O.test(u)||!B.test(m))throw new Error("The public gateway did not return a valid evaluation receipt.");const v=crypto.randomUUID(),f={requestId:h,recoveryKey:u,submissionId:m,sourceName:e.source.name,sourceBytes:e.source.size,sourceSha256:t,submittedAt:new Date().toISOString(),case:e.case};return this.evaluations.set(v,f),this.storeReceipt(f),this.snapshot(v,f,"evaluating","The source is queued for deterministic evaluation.")}const s=await this.request("self-tests",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({benchmark:"p3d",suite:a.id,suite_version:a.version,tasks:[e.case.task],format:e.case.format,prompt_profile:e.case.prompt_profile??void 0,n_cases:1,case_indices:[e.case.case_index],method:"external-method",model:"user-supplied"})}),r=String(s.request_id??""),n=String(s.recovery_key??"");if(!F.test(r)||!O.test(n))throw new Error("The public gateway did not return a valid evaluation receipt.");const c=crypto.randomUUID(),d={requestId:r,recoveryKey:n,source:e.source,sourceName:e.source.name,sourceBytes:e.source.size,sourceSha256:t,submittedAt:new Date().toISOString(),case:e.case};return this.evaluations.set(c,d),this.snapshot(c,d,"validating","Preparing the secure evaluation request.")}async getEvaluation(e){var r;const t=this.evaluations.get(e);if(!t)throw new Error("This browser no longer has the evaluation receipt.");if(!t.submissionId){const n=await this.request(`self-tests/${encodeURIComponent(t.requestId)}`,{headers:this.recoveryHeaders(t)});if(n.status!=="ready")return this.snapshot(e,t,"validating","Preparing the visible-input and submission contract.");try{this.validatePreparedCase(n.self_test,t.case)}catch{return this.preparedCaseFailure(e,t)}if(!t.source)throw new Error("Select the source file again to continue this evaluation.");const c=new FormData;c.set("files",t.source,t.case.source_filename);const d=await this.request(`self-tests/${encodeURIComponent(t.requestId)}/submissions`,{method:"POST",headers:this.recoveryHeaders(t),body:c}),o=String(d.submission_id??"");if(!B.test(o))throw new Error("The public gateway did not accept the source file.");return t.submissionId=o,t.source=void 0,this.storeReceipt(t),this.snapshot(e,t,"evaluating","The source is queued for deterministic evaluation.")}const a=await this.request(`submissions/${encodeURIComponent(t.submissionId)}`,{headers:this.recoveryHeaders(t)});if(a.status!=="available")return this.snapshot(e,t,"evaluating","The deterministic evaluator is running.");const s=a.evaluation;if(!s||typeof s!="object")throw new Error("The public gateway returned an invalid evaluation result.");return((r=s.submission)==null?void 0:r.status)==="complete"&&await this.ensureVisualization(t,s),this.completedSnapshot(e,t,s)}async resumeEvaluation(){let e=null;try{e=Be(JSON.parse(sessionStorage.getItem(L)||"null"))}catch{sessionStorage.removeItem(L)}if(!e)return null;const t=await this.resolveCase({task:e.task,format:e.format,text_mode:e.text_mode},e.uid),a=crypto.randomUUID(),s={requestId:e.request_id,recoveryKey:e.recovery_key,submissionId:e.submission_id,sourceName:e.source_name,sourceBytes:e.source_bytes,sourceSha256:e.source_sha256,submittedAt:e.submitted_at,case:t};return this.evaluations.set(a,s),{case:t,snapshot:await this.getEvaluation(a)}}releaseEvaluation(e){var a;const t=this.evaluations.get(e);(a=t==null?void 0:t.visualization)!=null&&a.url.startsWith("blob:")&&URL.revokeObjectURL(t.visualization.url),t!=null&&t.submissionId&&sessionStorage.removeItem(L),this.evaluations.delete(e)}async resolveCase(e,t){var s,r;await this.cases.load();const a=(r=(s=this.capabilities)==null?void 0:s.tasks.find(n=>n.task===e.task))==null?void 0:r.formats.find(n=>n.id===e.format&&n.status==="available");if(!a)throw new Error(`The ${Fe(e.format)} evaluator is not currently available.`);return this.cases.resolve(e.task,e.format,a,t,e.text_mode)}validatePreparedCase(e,t){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The prepared evaluation contract is invalid.");const a=e,s=Array.isArray(a.cases)?a.cases:[],r=s[0];if(a.benchmark!=="p3d"||a.suite!=="p3d-bench-paper"||a.suite_version!=="v1"||a.format!==t.format||s.length!==1||!r||r.task!==t.task||r.case_id!==t.uid||r.case_index!==t.case_index||(r.prompt_profile??null)!==(t.prompt_profile??null)||r.annotated_prompt!==t.prompt||r.visible_input_sha256!==t.visible_input_sha256||r.submission_filename!==t.source_filename)throw new Error("The evaluation service returned a different task, UID, or visible-input contract.")}preparedCaseFailure(e,t){const a="The evaluation service returned a different task, UID, or visible-input contract. No source was uploaded; retry the request.",s=M();return s.state="failed",s.message=a,this.evaluations.delete(e),{evaluation_ref:e,state:"failed",message:a,result:s,provenance:this.provenance(t)}}completedSnapshot(e,t,a){var o,l,h,u;const s=String(((o=a.submission)==null?void 0:o.status)??""),r=s==="failed",n=s==="complete"&&!!a.result,c=((h=(l=a.result)==null?void 0:l.cases)==null?void 0:h[0])??{};let d;return n?d=Ce(c,{task:t.case.task,textMode:t.case.text_mode}):r?d={state:"failed",message:String(((u=a.submission)==null?void 0:u.failure_reason)??"Evaluation failed"),metrics:[]}:(d=M(),d.state="checking",d.message="The deterministic evaluator is running."),{evaluation_ref:e,state:r?"failed":n?"complete":"evaluating",message:r?d.message??"The evaluation did not complete.":n?"Deterministic evaluation finished.":"The deterministic evaluator is running.",result:d,provenance:this.provenance(t),visualization:t.visualization}}snapshot(e,t,a,s){const r=M();return r.state="checking",r.message=s,{evaluation_ref:e,state:a,message:s,result:r,provenance:this.provenance(t)}}provenance(e){return{evaluator:"P3D / cadbenchmark",evaluation_mode:"deterministic",adapter_version:"p3d_external_submission_v1",source_name:e.sourceName,source_bytes:e.sourceBytes,source_sha256:e.sourceSha256,submitted_at:e.submittedAt,retention:"Evaluation-only retention policy",transport:"gateway",public_reference:e.submissionId??e.requestId}}recoveryHeaders(e){return{"x-spatiaos-recovery-key":e.recoveryKey}}storeReceipt(e){if(!e.submissionId)return;const t={schema_version:"p3d-public-browser-receipt-v1",request_id:e.requestId,recovery_key:e.recoveryKey,submission_id:e.submissionId,task:e.case.task,format:e.case.format,...e.case.text_mode?{text_mode:e.case.text_mode}:{},uid:e.case.uid,source_name:e.sourceName,source_bytes:e.sourceBytes,source_sha256:e.sourceSha256,submitted_at:e.submittedAt};sessionStorage.setItem(L,JSON.stringify(t))}async ensureVisualization(e,t){var v,f,_;if(e.visualization||!e.submissionId)return;const a=(f=(v=t.result)==null?void 0:v.artifacts)==null?void 0:f.find(g=>g.role==="model_stl"),s=Number(a==null?void 0:a.bytes),r=String((a==null?void 0:a.sha256)??""),n=Ve(String((a==null?void 0:a.download_url)??""),e.submissionId);if(!n||!Number.isSafeInteger(s)||s<1||s>Ne||!te.test(r)||!new Set(["model/stl","application/sla","application/octet-stream"]).has(String((a==null?void 0:a.media_type)??"")))return;const c=new URL(n,this.baseUrl);if(c.origin!==this.baseUrl.origin||!c.pathname.startsWith(this.baseUrl.pathname))return;const d=await fetch(c,{headers:{Accept:"model/stl, application/sla, application/octet-stream",...this.recoveryHeaders(e)},credentials:"omit"});if(!d.ok)return;const o=d.headers.get("content-length");if(o!==null&&Number(o)!==s)return;const l=(_=d.body)==null?void 0:_.getReader();if(!l)return;const h=new Uint8Array(s);let u=0;for(;;){const g=await l.read();if(g.done)break;if(u+g.value.byteLength>s){await l.cancel();return}h.set(g.value,u),u+=g.value.byteLength}u!==s||[...new Uint8Array(await crypto.subtle.digest("SHA-256",h))].map(g=>g.toString(16).padStart(2,"0")).join("")!==r||(e.visualization={kind:"stl",url:URL.createObjectURL(new Blob([h],{type:"model/stl"})),sha256:r,bytes:s})}async request(e,t){let a;try{a=await fetch(new URL(e,this.baseUrl),{...t,credentials:"omit",headers:{Accept:"application/json",...t==null?void 0:t.headers}})}catch{throw new j("The public evaluation gateway could not be reached.")}let s=null;try{s=await ee(a,qe,"The public evaluation gateway returned an invalid response.")}catch{if(a.ok)throw new Error("The public evaluation gateway returned an invalid response.")}if(!a.ok){const r=s&&typeof s=="object"?s:{},n=r.error||r.message||a.statusText||"The public evaluation gateway rejected the request.";throw r.retryable===!0||a.status>=500?new j(n):new Error(n)}return s}}class He{constructor(){b(this,"kind","unconfigured")}unavailable(){throw new Error("The public evaluation API is not configured.")}getCapabilities(){return Promise.reject(this.unavailable())}resolveExactCase(e){return Promise.reject(this.unavailable())}getRandomCase(e){return Promise.reject(this.unavailable())}submitEvaluation(e){return Promise.reject(this.unavailable())}getEvaluation(e){return Promise.reject(this.unavailable())}}async function Ge(){const i="https://spatiaos-eval.2565851683.workers.dev/api/".trim();if(i){const t=new URL("assets/p3d-bench-paper/v1/cases.json",new URL("/projects/P3D-Bench/self-test/",window.location.origin));if(t.origin!==window.location.origin)throw new Error("The public case catalog must be served by the reviewed Pages origin.");return new ze(i,t)}return new He}const se={AlertCircle:fe,Check:pe,ChevronDown:me,Circle:ve,FileCode2:be,Info:ge,LoaderCircle:ye,Play:we,Search:_e,Upload:Ee,X:Se},Je={not_started:"Awaiting submission",waiting:"Waiting",checking:"Checking",complete:"Complete",failed:"Failed",unavailable:"Not available"},Ke={json:"Save the final structured CAD program produced by your method as a .json file.",openscad:"Save the final OpenSCAD source from your agent or editor as a .scad file before exporting a mesh.",cadquery:"Save the final standalone CadQuery Python source produced by your method as a .py file.",threejs:"Save the final standalone Three.js geometry source produced by your method as a .js file."};function p(i){return i.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]??e)}function x(i){return i<1024?`${i} B`:i<1024*1024?`${(i/1024).toFixed(1)} KB`:`${(i/(1024*1024)).toFixed(1)} MB`}function We(i){const e=new Date(i);return Number.isNaN(e.getTime())?i:new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(e)}function Ye(i){return i.length<=24?i:`${i.slice(0,12)}...${i.slice(-6)}`}function Qe(i){return i?/evaluation[- ]only/i.test(i)?"Evaluation only":i:"Not reported"}class Ze{constructor(e,t){b(this,"root");b(this,"transport");b(this,"pollTimer");b(this,"progressTimer");b(this,"pollFailureCount",0);b(this,"caseRequest",0);b(this,"disposeModelViewer");b(this,"state",{task:"text2cad",format:"openscad",textMode:"descriptive",searchValue:"",caseLoading:!0,submitting:!1,provenanceOpen:!1});this.root=e,this.transport=t}async start(){var e,t;this.render();try{this.state.capabilities=await this.transport.getCapabilities(),this.ensureAvailableFormat();const a=await((t=(e=this.transport).resumeEvaluation)==null?void 0:t.call(e));if(a){this.state.task=a.case.task,this.state.format=a.case.format,this.state.textMode=a.case.text_mode??"descriptive",this.state.currentCase=a.case,this.state.searchValue=a.case.uid,this.state.snapshot=a.snapshot;const s=Date.parse(a.snapshot.provenance.submitted_at);this.state.evaluationStartedAt=Number.isFinite(s)?s:Date.now(),this.state.caseLoading=!1,this.render(),this.isTerminal(a.snapshot)||(this.startProgressTicker(),this.schedulePoll())}else await this.loadRandomCase()}catch(a){this.state.caseLoading=!1,this.state.globalError=this.errorMessage(a),this.render()}}render(){var t;(t=this.disposeModelViewer)==null||t.call(this),this.disposeModelViewer=void 0;const e=this.environmentView();this.root.innerHTML=`
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
    `}renderUpload(){var o,l,h,u,m,v;const e=this.selectedCapability(),t=(e==null?void 0:e.accept.join(","))||((o=this.state.currentCase)==null?void 0:o.source_accept.join(","))||".scad",a=(e==null?void 0:e.max_bytes)||((l=this.state.currentCase)==null?void 0:l.source_max_bytes)||8*1024*1024,s=this.state.source,r=((h=this.state.snapshot)==null?void 0:h.state)==="validating"||((u=this.state.snapshot)==null?void 0:u.state)==="evaluating",n=!this.state.currentCase||this.state.caseLoading||this.state.submitting||r,c=(v=(m=this.transport).connectionState)==null?void 0:v.call(m),d=(c==null?void 0:c.available)!==!1;return`
      <section class="source-panel" aria-labelledby="source-title">
        <div class="section-heading">
          <div>
            <h2 id="source-title">Submit source</h2>
            <p class="section-meta">${p(t.split(",").join(" or "))} · up to ${x(a)}</p>
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
          ${(c==null?void 0:c.available)===!1?`<p class="intake-note" role="status"><i data-lucide="alert-circle"></i>${p(c.message||"Evaluation intake is temporarily unavailable.")}</p>`:""}
          <label class="upload-drop ${n?"is-disabled":""}" data-testid="upload-drop">
            <input
              class="file-input"
              type="file"
              name="source"
              accept="${p(t)}"
              ${n?"disabled":""}
            />
            <i data-lucide="upload"></i>
            <span><b>Select source file</b><small>${p(t.split(",").join(" or "))}</small></span>
          </label>

          ${s?`
                <div class="selected-file" data-testid="selected-file">
                  <i data-lucide="file-code-2"></i>
                  <span><b>${p(s.name)}</b><small>${x(s.size)}</small></span>
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
            ${!s||!d||n?"disabled":""}
          >
            <i class="${this.state.submitting||r?"loading-icon":""}" data-lucide="${this.state.submitting||r?"loader-circle":"play"}"></i>
            <span>${this.state.submitting?"Submitting":r?"Evaluation in progress":"Evaluate source"}</span>
          </button>
        </div>
      </section>
    `}renderResults(){var s,r;const e=((s=this.state.snapshot)==null?void 0:s.result)??M(),t=this.evaluationStatus(),a=this.isEvaluationActive();return`
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
        ${(r=this.state.snapshot)!=null&&r.message&&this.state.snapshot.state!=="complete"&&this.state.snapshot.message!==e.message?`<div class="evaluation-message ${this.transport.kind==="fixture"?"is-fixture":""}">${p(this.state.snapshot.message)}</div>`:""}
        ${this.renderEvaluationProgress()}
        ${a?"":`
                ${this.renderMetricResults(e)}
                <p class="judge-note">
                  <strong>Judge</strong>
                  <span>Judge is not included in public self-evaluation because it requires a separate MLLM evaluator.</span>
                </p>
                ${this.renderModelViewer()}
              `}
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
    `}mountModelViewer(){var r;const e=this.root.querySelector("[data-model-viewer]"),t=(r=this.state.snapshot)==null?void 0:r.visualization;if(!e||!t)return;let a=!1,s;this.disposeModelViewer=()=>{a=!0,s==null||s()},this.createModelViewer(e,t,()=>a).then(n=>{a?n():s=n}).catch(()=>{if(a)return;const n=e.querySelector(".model-viewer-status");n&&(n.textContent="Model preview unavailable")})}async createModelViewer(e,t,a){var J;const[s,{OrbitControls:r},{STLLoader:n}]=await Promise.all([q(()=>import("./three.module-BTt32e3U.js"),[]),q(()=>import("./OrbitControls-BSM_CLzo.js"),__vite__mapDeps([0,1])),q(()=>import("./STLLoader-DnLadrxH.js"),__vite__mapDeps([2,1]))]);if(a())return()=>{};const c=new s.Scene;c.background=new s.Color(16777215),c.fog=new s.Fog(16777215,6.8,12.2);const d=new s.PerspectiveCamera(38,1,.01,100);d.position.set(3.6,2.35,4.35);const o=new s.WebGLRenderer({antialias:!0,alpha:!1,preserveDrawingBuffer:!0});o.setPixelRatio(Math.min(window.devicePixelRatio,2)),o.setClearColor(16777215,1),o.outputColorSpace=s.SRGBColorSpace,o.toneMapping=s.ACESFilmicToneMapping,o.toneMappingExposure=1,o.shadowMap.enabled=!0,o.shadowMap.type=s.PCFSoftShadowMap,e.appendChild(o.domElement);const l=new r(d,o.domElement);l.enableDamping=!0,l.autoRotate=!window.matchMedia("(prefers-reduced-motion: reduce)").matches,l.autoRotateSpeed=1.2,l.enablePan=!1,l.minDistance=2.2,l.maxDistance=7.5,c.add(new s.HemisphereLight(16449532,12176066,1.95));const h=new s.DirectionalLight(16777215,2.65);h.position.set(3.8,4.8,3.5),h.castShadow=!0,h.shadow.mapSize.set(1024,1024),c.add(h);const u=new s.DirectionalLight(12053215,.86);u.position.set(-3.2,2.2,-2.6),c.add(u);const m=new s.DirectionalLight(13035007,.62);m.position.set(-2.4,3.4,3.4),c.add(m);const v={text2cad:{body:12573164,edge:3239058,shadow:5927810,rim:14282751},image2cad:{body:11918799,edge:3044708,shadow:5208172,rim:14284010},text_image2cad:{body:12574175,edge:4945280,shadow:5993595,rim:14808566}}[((J=this.state.currentCase)==null?void 0:J.task)??"text2cad"],f=new s.Mesh(new s.PlaneGeometry(6,4),new s.ShadowMaterial({color:v.shadow,opacity:.09}));f.rotation.x=-Math.PI/2,f.position.y=-1.06,f.receiveShadow=!0,c.add(f);const _=new s.Group;_.rotation.x=-Math.PI/2,c.add(_);const g=e.querySelector(".model-viewer-status");let k=!1,V=0,P=null,T=null,$=null,A=null;new n().load(t.url,y=>{var K;if(k){y.dispose();return}y.computeVertexNormals(),y.computeBoundingBox(),y.center();const C=new s.Vector3;(K=y.boundingBox)==null||K.getSize(C);const N=Math.max(C.x,C.y,C.z)||1;y.scale(2.32/N,2.32/N,2.32/N),P=y,T=new s.MeshPhysicalMaterial({color:v.body,roughness:.58,metalness:.02,clearcoat:.1,clearcoatRoughness:.68,emissive:v.rim,emissiveIntensity:.006});const U=new s.Mesh(y,T);U.castShadow=!0,U.receiveShadow=!0,_.add(U),$=new s.EdgesGeometry(y,28),A=new s.LineBasicMaterial({color:v.edge,transparent:!0,opacity:.24}),_.add(new s.LineSegments($,A)),g==null||g.remove()},void 0,()=>{g&&(g.classList.remove("is-loading"),g.textContent="Model preview unavailable")});const z=()=>{const y=Math.max(280,e.clientWidth),C=Math.max(300,e.clientHeight);o.setSize(y,C,!1),d.aspect=y/C,d.updateProjectionMatrix()},H=new ResizeObserver(z);H.observe(e),z();const G=()=>{V=requestAnimationFrame(G),l.update(),o.render(c,d)};return G(),()=>{k=!0,cancelAnimationFrame(V),H.disconnect(),l.dispose(),P==null||P.dispose(),T==null||T.dispose(),$==null||$.dispose(),A==null||A.dispose(),f.geometry.dispose(),f.material.dispose(),o.dispose(),o.domElement.remove()}}renderMetricResults(e){const t=e.metrics.find(r=>r.bucket==="Valid"),a=["Geometry","Topology","Part"].flatMap(r=>{const n=e.metrics.filter(c=>c.bucket===r);return n.length?[`
        <section class="metric-bucket" aria-labelledby="metric-bucket-${r.toLowerCase()}">
          <h4 id="metric-bucket-${r.toLowerCase()}">${r}</h4>
          <dl class="metric-list">
            ${n.map(c=>`
              <div>
                <dt>${p(c.label)}</dt>
                <dd>${p(String(c.value))}${c.unit?` <small>${p(c.unit)}</small>`:""}</dd>
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
    `}renderEvaluationProgress(){var s;const e=(s=this.state.snapshot)==null?void 0:s.state;if(!this.isEvaluationActive())return"";const t=this.state.submitting?0:e==="validating"?1:2,a=["Uploading source","Preparing evaluation","Computing P3D metrics"];return`
      <div class="evaluation-progress" data-testid="evaluation-progress" role="status" aria-live="polite">
        <div class="evaluation-progress-copy">
          <strong>${a[t]}</strong>
          <span>Usually ready in 20-40 seconds</span>
          <time data-evaluation-elapsed>${this.elapsedSeconds()}s elapsed</time>
        </div>
        <div class="evaluation-progress-track" aria-hidden="true">
          ${a.map((r,n)=>`<span class="${n<t?"is-complete":n===t?"is-active":""}"></span>`).join("")}
        </div>
      </div>
    `}renderProvenance(){var a;const e=(a=this.state.snapshot)==null?void 0:a.provenance,t=[["Evaluated with",(e==null?void 0:e.evaluator)||"Not reported"],["Submitted file",e?`${e.source_name} · ${x(e.source_bytes)}`:this.state.source?`${this.state.source.name} · ${x(this.state.source.size)}`:"Not submitted"],["Submitted",e!=null&&e.submitted_at?We(e.submitted_at):"Not submitted"],...e!=null&&e.public_reference?[["Result ID",Ye(e.public_reference)]]:[],["Data use",Qe(e==null?void 0:e.retention)]];return`
      <details class="provenance-drawer" data-testid="provenance" ${this.state.provenanceOpen?"open":""}>
        <summary>
          <span>About this result</span>
          <i class="drawer-chevron" data-lucide="chevron-down"></i>
        </summary>
        <dl>
          ${t.map(([s,r])=>`
                <div>
                  <dt>${p(s)}</dt>
                  <dd class="${s==="Result ID"?"is-code":""}">${p(r)}</dd>
                </div>
              `).join("")}
        </dl>
      </details>
    `}bindEvents(){var n,c,d;this.root.querySelectorAll("[data-task]").forEach(o=>{o.addEventListener("click",()=>{this.selectTask(o.dataset.task)})});const e=this.root.querySelector("[role='tablist']");e==null||e.addEventListener("keydown",o=>this.handleTabKeys(o)),this.root.querySelectorAll("input[name='format']").forEach(o=>{o.addEventListener("change",()=>{this.selectFormat(o.value)})}),this.root.querySelectorAll("input[name='text-mode']").forEach(o=>{o.addEventListener("change",()=>{this.selectTextMode(o.value)})});const t=this.root.querySelector(".case-search");t==null||t.addEventListener("submit",o=>{o.preventDefault();const l=t.elements.namedItem("uid");this.loadExactCase((l==null?void 0:l.value)??"")}),(n=this.root.querySelector("[data-action='random']"))==null||n.addEventListener("click",()=>{this.loadRandomCase()});const a=this.root.querySelector(".file-input");a==null||a.addEventListener("change",()=>{this.acceptFiles(a.files)});const s=this.root.querySelector(".upload-drop");s==null||s.addEventListener("dragover",o=>{o.preventDefault(),s.classList.contains("is-disabled")||s.classList.add("is-dragging")}),s==null||s.addEventListener("dragleave",()=>s.classList.remove("is-dragging")),s==null||s.addEventListener("drop",o=>{var l;o.preventDefault(),s.classList.remove("is-dragging"),s.classList.contains("is-disabled")||this.acceptFiles(((l=o.dataTransfer)==null?void 0:l.files)??null)}),(c=this.root.querySelector("[data-action='remove-file']"))==null||c.addEventListener("click",()=>{this.state.source=void 0,this.state.sourceError=void 0,this.clearEvaluation(),this.render()}),(d=this.root.querySelector("[data-action='evaluate']"))==null||d.addEventListener("click",()=>{this.evaluate()});const r=this.root.querySelector(".provenance-drawer");r==null||r.addEventListener("toggle",()=>{this.state.provenanceOpen=r.open})}handleTabKeys(e){if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.preventDefault();const a=E.findIndex(n=>n.id===this.state.task);let s=a;e.key==="ArrowRight"&&(s=(a+1)%E.length),e.key==="ArrowLeft"&&(s=(a-1+E.length)%E.length),e.key==="Home"&&(s=0),e.key==="End"&&(s=E.length-1);const r=E[s].id;this.selectTask(r,!0)}async selectTask(e,t=!1){var a;e!==this.state.task&&(this.caseRequest+=1,this.clearEvaluation(),this.state.task=e,this.state.textMode="descriptive",this.state.source=void 0,this.state.sourceError=void 0,this.state.caseError=void 0,this.state.searchValue="",this.ensureAvailableFormat(),await this.loadRandomCase(),t&&((a=this.root.querySelector(`[data-task='${e}']`))==null||a.focus()))}async selectFormat(e){e!==this.state.format&&(this.clearEvaluation(),this.state.format=e,this.state.source=void 0,await this.reloadCurrentCase())}async selectTextMode(e){e!==this.state.textMode&&(this.clearEvaluation(),this.state.textMode=e,this.state.source=void 0,await this.reloadCurrentCase())}async reloadCurrentCase(){var e;(e=this.state.currentCase)!=null&&e.uid?await this.loadExactCase(this.state.currentCase.uid):await this.loadRandomCase()}async loadExactCase(e){const t=e.trim();if(!t){this.state.caseError="Enter a complete UID.",this.render(),this.focusAlert("#case-error");return}await this.loadCase(()=>this.transport.resolveExactCase({...this.caseQuery(),uid:t}))}async loadRandomCase(){await this.loadCase(()=>this.transport.getRandomCase(this.caseQuery()))}async loadCase(e){const t=++this.caseRequest,a=this.state.currentCase;this.state.caseLoading=!0,this.state.caseError=void 0,this.render();try{const s=await e();if(t!==this.caseRequest)return;this.clearEvaluation(),this.state.currentCase=s,this.state.searchValue=s.uid,this.state.source=void 0,this.state.sourceError=void 0}catch(s){if(t!==this.caseRequest)return;this.state.currentCase=a,this.state.caseError=this.errorMessage(s)}finally{t===this.caseRequest&&(this.state.caseLoading=!1,this.render(),this.state.caseError&&this.focusAlert("#case-error"))}}acceptFiles(e){var c,d;if(this.state.sourceError=void 0,this.state.evaluationError=void 0,!e||e.length!==1){this.state.source=void 0,this.state.sourceError="Select exactly one source file.",this.render(),this.focusAlert("#source-error");return}const t=e[0],a=this.selectedCapability(),s=(a==null?void 0:a.accept)??((c=this.state.currentCase)==null?void 0:c.source_accept)??[],r=(a==null?void 0:a.max_bytes)??((d=this.state.currentCase)==null?void 0:d.source_max_bytes)??0,n=t.name.toLowerCase();s.some(o=>n.endsWith(o.toLowerCase()))?t.size===0?(this.state.source=void 0,this.state.sourceError="The source file is empty."):t.size>r?(this.state.source=void 0,this.state.sourceError=`The source file exceeds ${x(r)}.`):(this.clearEvaluation(),this.state.source=t):(this.state.source=void 0,this.state.sourceError=`Use a ${s.join(" or ")} source file.`),this.render(),this.state.sourceError?this.focusAlert("#source-error"):window.requestAnimationFrame(()=>{var o;(o=this.root.querySelector("[data-action='evaluate']"))==null||o.focus({preventScroll:!0})})}async evaluate(){if(!(!this.state.currentCase||!this.state.source||this.state.submitting)){this.state.submitting=!0,this.state.evaluationStartedAt=Date.now(),this.state.evaluationError=void 0,this.startProgressTicker(),this.render();try{const e=await this.transport.submitEvaluation({case:this.state.currentCase,source:this.state.source});this.state.snapshot=e,(this.transport.kind==="api"||this.transport.kind==="gateway")&&!this.isTerminal(e)&&this.schedulePoll()}catch(e){this.state.evaluationError=this.errorMessage(e),this.stopProgressTicker()}finally{this.state.submitting=!1,this.state.snapshot&&this.isTerminal(this.state.snapshot)&&this.stopProgressTicker(),this.render(),this.state.evaluationError?this.focusAlert("#evaluation-error"):this.state.snapshot&&window.requestAnimationFrame(()=>{var e;(e=this.root.querySelector(".results-section"))==null||e.focus({preventScroll:!0})})}}}schedulePoll(e=1e3){window.clearTimeout(this.pollTimer),this.pollTimer=window.setTimeout(()=>void this.poll(),e)}async poll(){var t;const e=(t=this.state.snapshot)==null?void 0:t.evaluation_ref;if(e)try{const a=await this.transport.getEvaluation(e);this.pollFailureCount=0,this.state.evaluationError=void 0,this.state.snapshot=a,this.isTerminal(a)&&this.stopProgressTicker(),this.render(),this.isTerminal(a)||this.schedulePoll()}catch(a){if(De(a)&&this.state.snapshot){this.pollFailureCount+=1;const s=Math.min(8,2**Math.min(this.pollFailureCount-1,3));this.state.evaluationError=void 0,this.state.snapshot={...this.state.snapshot,message:`The evaluation connection was interrupted. Retrying in ${s} second${s===1?"":"s"}.`},this.render(),this.schedulePoll(s*1e3);return}this.state.evaluationError=this.errorMessage(a),this.render()}}isTerminal(e){return e.state==="complete"||e.state==="failed"}isEvaluationActive(){var t;const e=(t=this.state.snapshot)==null?void 0:t.state;return this.state.submitting||e==="validating"||e==="evaluating"}elapsedSeconds(){return Math.max(0,Math.floor((Date.now()-(this.state.evaluationStartedAt??Date.now()))/1e3))}clearEvaluation(){var t,a,s;window.clearTimeout(this.pollTimer),this.pollTimer=void 0,this.stopProgressTicker(),this.pollFailureCount=0;const e=(t=this.state.snapshot)==null?void 0:t.evaluation_ref;e&&((s=(a=this.transport).releaseEvaluation)==null||s.call(a,e)),this.state.snapshot=void 0,this.state.evaluationStartedAt=void 0,this.state.evaluationError=void 0}startProgressTicker(){this.stopProgressTicker(),this.progressTimer=window.setInterval(()=>{if(!this.isEvaluationActive()){this.stopProgressTicker();return}const e=this.root.querySelector("[data-evaluation-elapsed]");e&&(e.textContent=`${this.elapsedSeconds()}s elapsed`)},1e3)}stopProgressTicker(){window.clearInterval(this.progressTimer),this.progressTimer=void 0}caseQuery(){return{task:this.state.task,format:this.state.format,...this.state.task==="text2cad"?{text_mode:this.state.textMode}:{}}}getFormatCapabilities(){var e,t;return((t=(e=this.state.capabilities)==null?void 0:e.tasks.find(a=>a.task===this.state.task))==null?void 0:t.formats)??[]}selectedCapability(){return this.getFormatCapabilities().find(e=>e.id===this.state.format)}ensureAvailableFormat(){var t;const e=this.getFormatCapabilities().filter(a=>a.status==="available");e.some(a=>a.id===this.state.format)||(this.state.format=((t=e[0])==null?void 0:t.id)??"openscad")}evaluationStatus(){var t;if(this.state.submitting)return{label:"Submitting",icon:"loader-circle",tone:"active",spinning:!0};const e=(t=this.state.snapshot)==null?void 0:t.state;return e==="validating"||e==="evaluating"?{label:e==="validating"?"Validating":"Evaluating",icon:"loader-circle",tone:"active",spinning:!0}:e==="complete"?{label:"Complete",icon:"check",tone:"success",spinning:!1}:e==="failed"?{label:"Failed",icon:"alert-circle",tone:"danger",spinning:!1}:{label:"Awaiting submission",icon:"circle",tone:"idle",spinning:!1}}focusAlert(e){window.requestAnimationFrame(()=>{var t;(t=this.root.querySelector(e))==null||t.focus()})}errorMessage(e){return e instanceof Error?e.message:"The request could not be completed."}}const ae=document.querySelector("#app");if(!ae)throw new Error("Application root is missing.");async function Xe(i){i.innerHTML=`
    <main class="boot-screen" aria-busy="true">
      <i class="loading-icon" data-lucide="loader-circle"></i>
      <span>Loading evaluation tool</span>
    </main>
  `,Z({icons:se,attrs:{"aria-hidden":"true","stroke-width":"1.8"}});const e=await Ge();await new Ze(i,e).start()}Xe(ae);
