const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/OrbitControls-BSM_CLzo.js","assets/three.module-BTt32e3U.js","assets/STLLoader-DnLadrxH.js"])))=>i.map(i=>d[i]);
var ae=Object.defineProperty;var ie=(i,e,t)=>e in i?ae(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var f=(i,e,t)=>ie(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const re="modulepreload",oe=function(i){return"/projects/P3D-Bench/self-test/"+i},z={},R=function(e,t,a){let s=Promise.resolve();if(t&&t.length>0){let n=function(c){return Promise.all(c.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=n(t.map(c=>{if(c=oe(c),c in z)return;z[c]=!0;const d=c.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const h=document.createElement("link");if(h.rel=d?"stylesheet":re,d||(h.as="script"),h.crossOrigin="",h.href=c,l&&h.setAttribute("nonce",l),document.head.appendChild(h),d)return new Promise((v,m)=>{h.addEventListener("load",v),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(n){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=n,window.dispatchEvent(o),!o.defaultPrevented)throw n}return s.then(n=>{for(const o of n||[])o.status==="rejected"&&r(o.reason);return e().catch(r)})};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=(i,e,t=[])=>{const a=document.createElementNS("http://www.w3.org/2000/svg",i);return Object.keys(e).forEach(s=>{a.setAttribute(s,String(e[s]))}),t.length&&t.forEach(s=>{const r=G(...s);a.appendChild(r)}),a};var ne=([i,e,t])=>G(i,e,t);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=i=>Array.from(i.attributes).reduce((e,t)=>(e[t.name]=t.value,e),{}),ce=i=>typeof i=="string"?i:!i||!i.class?"":i.class&&typeof i.class=="string"?i.class.split(" "):i.class&&Array.isArray(i.class)?i.class:"",de=i=>i.flatMap(ce).map(t=>t.trim()).filter(Boolean).filter((t,a,s)=>s.indexOf(t)===a).join(" "),ue=i=>i.replace(/(\w)(\w*)(_|-|\s*)/g,(e,t,a)=>t.toUpperCase()+a.toLowerCase()),H=(i,{nameAttr:e,icons:t,attrs:a})=>{var m;const s=i.getAttribute(e);if(s==null)return;const r=ue(s),n=t[r];if(!n)return console.warn(`${i.outerHTML} icon name was not found in the provided icons object.`);const o=le(i),[l,c,d]=n,u={...c,"data-lucide":s,...a,...o},h=de(["lucide",`lucide-${s}`,o,a]);h&&Object.assign(u,{class:h});const v=ne([l,u,d]);return(m=i.parentNode)==null?void 0:m.replaceChild(v,i)};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=["svg",y,[["path",{d:"M20 6 9 17l-5-5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=["svg",y,[["path",{d:"m6 9 6 6 6-6"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=["svg",y,[["circle",{cx:"12",cy:"12",r:"10"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=["svg",y,[["circle",{cx:"12",cy:"12",r:"10"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=["svg",y,[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"m5 12-3 3 3 3"}],["path",{d:"m9 18 3-3-3-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=["svg",y,[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ge=["svg",y,[["polygon",{points:"6 3 20 12 6 21 6 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=["svg",y,[["circle",{cx:"11",cy:"11",r:"8"}],["path",{d:"m21 21-4.3-4.3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=["svg",y,[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{points:"17 8 12 3 7 8"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=["svg",y,[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=({icons:i={},nameAttr:e="data-lucide",attrs:t={}}={})=>{if(!Object.values(i).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const a=document.querySelectorAll(`[${e}]`);if(Array.from(a).forEach(s=>H(s,{nameAttr:e,icons:i,attrs:t})),e==="data-lucide"){const s=document.querySelectorAll("[icon-name]");s.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(s).forEach(r=>H(r,{nameAttr:"icon-name",icons:i,attrs:t})))}},w=[{id:"text2cad",label:"Text-to-3D"},{id:"image2cad",label:"Image-to-3D"},{id:"text_image2cad",label:"Assembly-3D"}],I={text2cad:[{id:"json",label:"JSON"},{id:"openscad",label:"OpenSCAD"}],image2cad:[{id:"openscad",label:"OpenSCAD"},{id:"cadquery",label:"CadQuery"},{id:"threejs",label:"Three.js"}],text_image2cad:[{id:"openscad",label:"OpenSCAD"},{id:"cadquery",label:"CadQuery"}]};function D(){return{state:"not_started",metrics:[]}}const K=[{keys:["chamfer_distance"],label:"CD ↓",bucket:"Geometry"},{keys:["iou_csg"],label:"IoU_C ↑",bucket:"Geometry",tasks:["text2cad"]},{keys:["iou_voxel"],label:"IoU_V ↑",bucket:"Geometry",tasks:["image2cad","text_image2cad"]},{keys:["f_score_005"],label:"F@.05 ↑",bucket:"Geometry"},{keys:["f_score_001"],label:"F@.01 ↑",bucket:"Geometry"},{keys:["normal_consistency"],label:"NC ↑",bucket:"Geometry"},{keys:["pred_open_edge_ratio"],label:"NoOE ↑",bucket:"Topology",transform:i=>i===0?1:0},{keys:["pred_inverted_normal_ratio"],label:"InvN ↓",bucket:"Topology"},{keys:["pred_non_manifold_edge_ratio"],label:"NM ↓",bucket:"Topology"},{keys:["part_match_f1"],label:"PartMatchF1 ↑",bucket:"Part",tasks:["text_image2cad"]},{keys:["part_fscore_mean","part_fscore"],label:"PartFS ↑",bucket:"Part",tasks:["text_image2cad"]}];new Map(K.flatMap(({keys:i,label:e})=>i.map(t=>[t,e])));function Ee(i,e){return typeof e=="boolean"?e?"Yes":"No":Number.isFinite(e)?i==="pred_open_edge_ratio"?e.toFixed(3):i.includes("chamfer")||i.includes("hausdorff")||i==="stage2_fidelity_cd"?e===0?"0":e<.01?e.toFixed(4):e.toFixed(3):e<1?e.toFixed(3):e.toFixed(2):String(e)}function Se(i,e={task:"text2cad",textMode:"parametric"}){const t=i.metrics&&typeof i.metrics=="object"&&!Array.isArray(i.metrics)?i.metrics:{},s=e.task!=="text2cad"||e.textMode!=="descriptive"?K.flatMap(n=>{if(n.tasks&&!n.tasks.includes(e.task))return[];const o=n.keys.find(d=>typeof t[d]=="number");if(!o)return[];const l=t[o],c=n.transform?n.transform(l):l;return[{key:o,label:n.label,bucket:n.bucket,value:Ee(o,c)}]}):[];typeof i.valid=="boolean"&&s.unshift({key:"valid",label:"Valid",bucket:"Valid",value:i.valid?"Yes":"No"});const r=i.evaluation_status==="failed";return{state:r?"failed":"complete",message:r?String(i.evaluation_failure_reason??"Evaluation failed"):s.length?void 0:"No P3D-Bench metrics were reported.",metrics:s}}async function W(i,e,t){var c;const a=i.headers.get("content-length");if(a!==null){const d=Number(a);if(!Number.isSafeInteger(d)||d<0||d>e)throw new Error(t)}const s=(c=i.body)==null?void 0:c.getReader();if(!s)throw new Error(t);const r=[];let n=0;for(;;){const d=await s.read();if(d.done)break;if(n+=d.value.byteLength,n>e)throw await s.cancel(),new Error(t);r.push(d.value)}const o=new Uint8Array(n);let l=0;for(const d of r)o.set(d,l),l+=d.byteLength;try{return JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(o))}catch{throw new Error(t)}}const L={text2cad:400,image2cad:400,text_image2cad:203},ke=/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/,Ce=/^[a-z0-9][a-z0-9._-]{0,127}$/,Y=/^[0-9a-f]{64}$/,Te=8*1024*1024;function k(i,e){if(!i||typeof i!="object"||Array.isArray(i))throw new Error(`The public ${e} is invalid.`);return i}function $e(i){const e=String(i??"");if(!/^visible-inputs\/[A-Za-z0-9_-]+\.png$/.test(e)||e.includes("..")||e.includes("\\"))throw new Error("The public case image path is invalid.");return e}function xe(i){const e=k(i,"case input variant"),t=e.prompt_profile===null?null:String(e.prompt_profile??""),a=e.prompt===null?null:String(e.prompt??""),s=String(e.visible_input_sha256??"");if(t!==null&&!Ce.test(t)||t===null!=(a===null))throw new Error("The public case prompt contract is invalid.");if(a!==null&&!a.trim())throw new Error("The public case prompt is empty.");if(!Y.test(s))throw new Error("The public visible-input digest is invalid.");return{prompt_profile:t,prompt:a,visible_input_sha256:s}}function Ae(i){if(i===null)return null;const e=k(i,"case image"),t={path:$e(e.path),sha256:String(e.sha256??""),bytes:Number(e.bytes),width:Number(e.width),height:Number(e.height),render_profile:String(e.render_profile??"")};if(!Y.test(t.sha256)||!Number.isSafeInteger(t.bytes)||t.bytes<24||t.bytes>1024*1024||t.width!==1024||t.height!==1024||t.render_profile!=="cadbenchmark_occ_single_view_v1")throw new Error("The public case image contract is invalid.");return t}function Le(i,e,t){const a=k(i,"case catalog entry"),s=String(a.uid??""),r=Number(a.case_index),n=a.default_prompt_profile===null?null:String(a.default_prompt_profile??""),o=Array.isArray(a.input_variants)?a.input_variants.map(xe):[],l=String(a.source_basename??"");if(!ke.test(s)||r!==t||!o.length||!/^[A-Za-z0-9][A-Za-z0-9._-]{2,191}$/.test(l))throw new Error(`The public ${e} case catalog is invalid.`);if(n!==null&&!o.some(h=>h.prompt_profile===n)||n!==(e==="text2cad"?"parametric":e==="text_image2cad"?"intermediate":null))throw new Error(`The public ${e} prompt profile is invalid.`);const c=o.map(h=>h.prompt_profile).sort(),d=e==="text2cad"?["descriptive","parametric"]:e==="text_image2cad"?["intermediate"]:[null];if(JSON.stringify(c)!==JSON.stringify(d.sort()))throw new Error(`The public ${e} prompt variants are invalid.`);const u=Ae(a.image);if(e==="text2cad"!=(u===null))throw new Error(`The public ${e} visible-image contract is invalid.`);return{uid:s,case_index:r,default_prompt_profile:n,input_variants:o,image:u,source_basename:l}}function Pe(i){const e=k(i,"case catalog"),t=k(e.tasks,"case task map"),a=k(e.task_counts,"case task counts"),s={};for(const n of Object.keys(L)){const o=t[n];if(!Array.isArray(o)||o.length!==L[n])throw new Error(`The public ${n} case count is invalid.`);if(a[n]!==L[n])throw new Error(`The public ${n} declared count is invalid.`);if(s[n]=o.map((l,c)=>Le(l,n,c+1)),new Set(s[n].map(l=>l.uid)).size!==o.length)throw new Error(`The public ${n} UID list contains duplicates.`)}const r=new Set(s.image2cad.map(n=>n.uid));if(s.text_image2cad.some(n=>!r.has(n.uid)))throw new Error("The public assembly catalog is not a subset of the image catalog.");if(e.schema_version!=="p3d-public-case-catalog-v1"||e.suite_id!=="p3d-bench-paper"||e.suite_version!=="v1"||e.total_case_count!==1003||e.hidden_geometry_published!==!1)throw new Error("The public case catalog identity is invalid.");return{schema_version:"p3d-public-case-catalog-v1",suite_id:"p3d-bench-paper",suite_version:"v1",task_counts:L,total_case_count:1003,hidden_geometry_published:!1,tasks:s}}class Ie{constructor(e){f(this,"url");f(this,"catalog");this.url=e}async load(){if(this.catalog)return;const e=await fetch(this.url,{headers:{Accept:"application/json"},credentials:"omit"});if(!e.ok)throw new Error("The public P3D case catalog could not be loaded.");this.catalog=Pe(await W(e,Te,"The public P3D case catalog is invalid."))}suite(){if(!this.catalog)throw new Error("The public P3D case catalog is not ready.");return{id:this.catalog.suite_id,version:this.catalog.suite_version}}resolve(e,t,a,s,r){if(!this.catalog)throw new Error("The public P3D case catalog is not ready.");const n=this.catalog.tasks[e];let o;if(s)o=n.find(u=>u.uid===s);else{const u=crypto.getRandomValues(new Uint32Array(1))[0];o=n[u%n.length]}if(!o)throw new Error("No public case matches that exact UID.");const l=e==="text2cad"?r??o.default_prompt_profile:o.default_prompt_profile,c=o.input_variants.find(u=>u.prompt_profile===l);if(!c)throw new Error("The selected public prompt profile is unavailable.");const d=a.accept[0];if(!d||!/^\.[a-z0-9]+$/.test(d))throw new Error("The selected source format is unavailable.");return{uid:o.uid,case_index:o.case_index,task:e,format:t,text_mode:e==="text2cad"?l:void 0,prompt_profile:l,prompt:c.prompt,image:o.image?{url:new URL(o.image.path,this.url).toString(),alt:`P3D visible input for UID ${o.uid}`,sha256:o.image.sha256,bytes:o.image.bytes,render_profile:o.image.render_profile}:null,visible_input_sha256:c.visible_input_sha256,source_filename:`${o.source_basename}${d}`,source_accept:a.accept,source_max_bytes:a.max_bytes}}}const P="spatiaos-p3d-self-test-receipt-v1",Q=/^req_[0-9a-f]{32}$/,Z=/^rec_[0-9a-f]{48}$/,X=/^sub_[0-9a-f]{32}$/,ee=/^[0-9a-f]{64}$/,Me=32*1024*1024,Ne=8*1024*1024,Re=2*1024*1024,De={json:".json",openscad:".scad",cadquery:".py",threejs:".js"};function Ue(i){return i==="json"?"JSON":i==="threejs"?"Three.js":i==="cadquery"?"CadQuery":"OpenSCAD"}async function qe(i){const e=await crypto.subtle.digest("SHA-256",await i.arrayBuffer());return[...new Uint8Array(e)].map(t=>t.toString(16).padStart(2,"0")).join("")}function je(i){var a;if(!i||typeof i!="object"||Array.isArray(i))return null;const t=i;return t.schema_version!=="p3d-public-browser-receipt-v1"||!Q.test(String(t.request_id??""))||!Z.test(String(t.recovery_key??""))||!X.test(String(t.submission_id??""))||!w.some(s=>s.id===t.task)||!((a=I[t.task])!=null&&a.some(s=>s.id===t.format))||!t.uid||typeof t.source_name!="string"||!Number.isSafeInteger(t.source_bytes)||t.source_bytes<1||!ee.test(t.source_sha256)||Number.isNaN(new Date(t.submitted_at).getTime())?null:t}function Oe(i,e){const t=i.match(/^\/api\/submissions\/([A-Za-z0-9_-]{1,128})\/artifacts\/([A-Za-z0-9_.:-]{1,200})$/);return!t||t[1]!==e?null:i.slice(5)}class Fe{constructor(e,t){f(this,"kind","gateway");f(this,"baseUrl");f(this,"cases");f(this,"evaluations",new Map);f(this,"capabilities");f(this,"gatewayState",{available:!1,label:"Checking service"});if(this.baseUrl=new URL(e.endsWith("/")?e:`${e}/`,window.location.href),!this.baseUrl.pathname.endsWith("/api/"))throw new Error("The public gateway URL must end with /api/.");if(new Set(["127.0.0.1","localhost","[::1]"]).has(this.baseUrl.hostname),this.baseUrl.protocol!=="https:")throw new Error("The public gateway URL must use HTTPS.");this.cases=new Ie(t)}async getCapabilities(){var a;await this.cases.load();const e=this.cases.suite(),t={evaluation_mode:"deterministic",tasks:w.map(({id:s})=>({task:s,formats:I[s].map(({id:r,label:n})=>({id:r,label:n,status:"available",accept:[De[r]],max_bytes:Ne}))}))};try{const[s,r]=await Promise.all([this.request("catalog"),this.request("capacity")]);if(s.schema_version!=="agentic-public-catalog-v1")throw new Error("The public evaluation catalog is incompatible.");const n=(a=s.suites)==null?void 0:a.find(l=>l.benchmark==="p3d"&&l.suite_id===e.id&&l.version===e.version);if(!n||n.public_self_test_status!=="available")throw new Error("P3D public self-evaluation is not currently available.");const o=Number(r.max_submission_bytes);if(!Number.isSafeInteger(o)||o<64*1024||o>32*1024*1024)throw new Error("The public upload capacity contract is invalid.");if(this.capabilities={evaluation_mode:"deterministic",tasks:w.map(({id:l})=>({task:l,formats:I[l].map(({id:c,label:d})=>{var v;const u=(v=n.capabilities)==null?void 0:v.find(m=>m.task===l&&m.format===c),h=Array.isArray(u==null?void 0:u.extensions)?u.extensions.filter(m=>/^\.[a-z0-9]+$/.test(String(m))):[];return{id:c,label:d,status:(u==null?void 0:u.status)==="available"&&h.length===1?"available":"unavailable",accept:h,max_bytes:o}})}))},this.capabilities.tasks.some(l=>!l.formats.some(c=>c.status==="available")))throw new Error("The public P3D capability matrix is incomplete.");this.gatewayState=r.accepting_requests===!0?{available:!0,label:"Connected"}:{available:!1,label:"Intake paused",message:"Evaluation intake is temporarily paused."}}catch(s){this.capabilities=t,this.gatewayState={available:!1,label:"Evaluation offline",message:s instanceof Error?s.message:"The public evaluation gateway is unavailable."}}return this.capabilities}connectionState(){return this.gatewayState}async resolveExactCase(e){return this.resolveCase(e,e.uid.trim())}async getRandomCase(e){return this.resolveCase(e)}async submitEvaluation(e){if(!this.gatewayState.available)throw new Error(this.gatewayState.message||"Evaluation intake is unavailable.");const t=await qe(e.source),a=this.cases.suite(),s=await this.request("self-tests",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({benchmark:"p3d",suite:a.id,suite_version:a.version,tasks:[e.case.task],format:e.case.format,prompt_profile:e.case.prompt_profile??void 0,n_cases:1,case_indices:[e.case.case_index],method:"external-method",model:"user-supplied"})}),r=String(s.request_id??""),n=String(s.recovery_key??"");if(!Q.test(r)||!Z.test(n))throw new Error("The public gateway did not return a valid evaluation receipt.");const o=crypto.randomUUID(),l={requestId:r,recoveryKey:n,source:e.source,sourceName:e.source.name,sourceBytes:e.source.size,sourceSha256:t,submittedAt:new Date().toISOString(),case:e.case};return this.evaluations.set(o,l),this.snapshot(o,l,"validating","Preparing the secure evaluation request.")}async getEvaluation(e){var r;const t=this.evaluations.get(e);if(!t)throw new Error("This browser no longer has the evaluation receipt.");if(!t.submissionId){const n=await this.request(`self-tests/${encodeURIComponent(t.requestId)}`,{headers:this.recoveryHeaders(t)});if(n.status!=="ready")return this.snapshot(e,t,"validating","Preparing the visible-input and submission contract.");if(this.validatePreparedCase(n.self_test,t.case),!t.source)throw new Error("Select the source file again to continue this evaluation.");const o=new FormData;o.set("files",t.source,t.case.source_filename);const l=await this.request(`self-tests/${encodeURIComponent(t.requestId)}/submissions`,{method:"POST",headers:this.recoveryHeaders(t),body:o}),c=String(l.submission_id??"");if(!X.test(c))throw new Error("The public gateway did not accept the source file.");return t.submissionId=c,t.source=void 0,this.storeReceipt(t),this.snapshot(e,t,"evaluating","The source is queued for deterministic evaluation.")}const a=await this.request(`submissions/${encodeURIComponent(t.submissionId)}`,{headers:this.recoveryHeaders(t)});if(a.status!=="available")return this.snapshot(e,t,"evaluating","The deterministic evaluator is running.");const s=a.evaluation;if(!s||typeof s!="object")throw new Error("The public gateway returned an invalid evaluation result.");return((r=s.submission)==null?void 0:r.status)==="complete"&&await this.ensureVisualization(t,s),this.completedSnapshot(e,t,s)}async resumeEvaluation(){let e=null;try{e=je(JSON.parse(sessionStorage.getItem(P)||"null"))}catch{sessionStorage.removeItem(P)}if(!e)return null;const t=await this.resolveCase({task:e.task,format:e.format,text_mode:e.text_mode},e.uid),a=crypto.randomUUID(),s={requestId:e.request_id,recoveryKey:e.recovery_key,submissionId:e.submission_id,sourceName:e.source_name,sourceBytes:e.source_bytes,sourceSha256:e.source_sha256,submittedAt:e.submitted_at,case:t};return this.evaluations.set(a,s),{case:t,snapshot:await this.getEvaluation(a)}}releaseEvaluation(e){var a;const t=this.evaluations.get(e);(a=t==null?void 0:t.visualization)!=null&&a.url.startsWith("blob:")&&URL.revokeObjectURL(t.visualization.url),t!=null&&t.submissionId&&sessionStorage.removeItem(P),this.evaluations.delete(e)}async resolveCase(e,t){var s,r;await this.cases.load();const a=(r=(s=this.capabilities)==null?void 0:s.tasks.find(n=>n.task===e.task))==null?void 0:r.formats.find(n=>n.id===e.format&&n.status==="available");if(!a)throw new Error(`The ${Ue(e.format)} evaluator is not currently available.`);return this.cases.resolve(e.task,e.format,a,t,e.text_mode)}validatePreparedCase(e,t){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The prepared evaluation contract is invalid.");const a=e,s=Array.isArray(a.cases)?a.cases:[],r=s[0];if(a.benchmark!=="p3d"||a.suite!=="p3d-bench-paper"||a.suite_version!=="v1"||a.format!==t.format||s.length!==1||!r||r.task!==t.task||r.case_id!==t.uid||r.case_index!==t.case_index||(r.prompt_profile??null)!==(t.prompt_profile??null)||r.annotated_prompt!==t.prompt||r.visible_input_sha256!==t.visible_input_sha256||r.submission_filename!==t.source_filename)throw new Error("The prepared evaluation does not match the selected public case.")}completedSnapshot(e,t,a){var c,d,u,h;const s=String(((c=a.submission)==null?void 0:c.status)??""),r=s==="failed",n=s==="complete"&&!!a.result,o=((u=(d=a.result)==null?void 0:d.cases)==null?void 0:u[0])??{};let l;return n?l=Se(o,{task:t.case.task,textMode:t.case.text_mode}):r?l={state:"failed",message:String(((h=a.submission)==null?void 0:h.failure_reason)??"Evaluation failed"),metrics:[]}:(l=D(),l.state="checking",l.message="The deterministic evaluator is running."),{evaluation_ref:e,state:r?"failed":n?"complete":"evaluating",message:r?l.message??"The evaluation did not complete.":n?"Deterministic evaluation finished.":"The deterministic evaluator is running.",result:l,provenance:this.provenance(t),visualization:t.visualization}}snapshot(e,t,a,s){const r=D();return r.state="checking",r.message=s,{evaluation_ref:e,state:a,message:s,result:r,provenance:this.provenance(t)}}provenance(e){return{evaluator:"P3D / cadbenchmark",evaluation_mode:"deterministic",adapter_version:"p3d_external_submission_v1",source_name:e.sourceName,source_bytes:e.sourceBytes,source_sha256:e.sourceSha256,submitted_at:e.submittedAt,retention:"Evaluation-only retention policy",transport:"gateway",public_reference:e.submissionId??e.requestId}}recoveryHeaders(e){return{"x-spatiaos-recovery-key":e.recoveryKey}}storeReceipt(e){if(!e.submissionId)return;const t={schema_version:"p3d-public-browser-receipt-v1",request_id:e.requestId,recovery_key:e.recoveryKey,submission_id:e.submissionId,task:e.case.task,format:e.case.format,...e.case.text_mode?{text_mode:e.case.text_mode}:{},uid:e.case.uid,source_name:e.sourceName,source_bytes:e.sourceBytes,source_sha256:e.sourceSha256,submitted_at:e.submittedAt};sessionStorage.setItem(P,JSON.stringify(t))}async ensureVisualization(e,t){var m,_,E;if(e.visualization||!e.submissionId)return;const a=(_=(m=t.result)==null?void 0:m.artifacts)==null?void 0:_.find(b=>b.role==="model_stl"),s=Number(a==null?void 0:a.bytes),r=String((a==null?void 0:a.sha256)??""),n=Oe(String((a==null?void 0:a.download_url)??""),e.submissionId);if(!n||!Number.isSafeInteger(s)||s<1||s>Me||!ee.test(r)||!new Set(["model/stl","application/sla","application/octet-stream"]).has(String((a==null?void 0:a.media_type)??"")))return;const o=new URL(n,this.baseUrl);if(o.origin!==this.baseUrl.origin||!o.pathname.startsWith(this.baseUrl.pathname))return;const l=await fetch(o,{headers:{Accept:"model/stl, application/sla, application/octet-stream",...this.recoveryHeaders(e)},credentials:"omit"});if(!l.ok)return;const c=l.headers.get("content-length");if(c!==null&&Number(c)!==s)return;const d=(E=l.body)==null?void 0:E.getReader();if(!d)return;const u=new Uint8Array(s);let h=0;for(;;){const b=await d.read();if(b.done)break;if(h+b.value.byteLength>s){await d.cancel();return}u.set(b.value,h),h+=b.value.byteLength}h!==s||[...new Uint8Array(await crypto.subtle.digest("SHA-256",u))].map(b=>b.toString(16).padStart(2,"0")).join("")!==r||(e.visualization={kind:"stl",url:URL.createObjectURL(new Blob([u],{type:"model/stl"})),sha256:r,bytes:s})}async request(e,t){let a;try{a=await fetch(new URL(e,this.baseUrl),{...t,credentials:"omit",headers:{Accept:"application/json",...t==null?void 0:t.headers}})}catch{throw new Error("The public evaluation gateway could not be reached.")}let s=null;try{s=await W(a,Re,"The public evaluation gateway returned an invalid response.")}catch{if(a.ok)throw new Error("The public evaluation gateway returned an invalid response.")}if(!a.ok){const r=s&&typeof s=="object"?s:{};throw new Error(r.error||r.message||a.statusText||"The public evaluation gateway rejected the request.")}return s}}class Ve{constructor(){f(this,"kind","unconfigured")}unavailable(){throw new Error("The public evaluation API is not configured.")}getCapabilities(){return Promise.reject(this.unavailable())}resolveExactCase(e){return Promise.reject(this.unavailable())}getRandomCase(e){return Promise.reject(this.unavailable())}submitEvaluation(e){return Promise.reject(this.unavailable())}getEvaluation(e){return Promise.reject(this.unavailable())}}async function Be(){const i="https://spatiaos-eval.2565851683.workers.dev/api/".trim();if(i){const t=new URL("assets/p3d-bench-paper/v1/cases.json",new URL("/projects/P3D-Bench/self-test/",window.location.origin));if(t.origin!==window.location.origin)throw new Error("The public case catalog must be served by the reviewed Pages origin.");return new Fe(i,t)}return new Ve}const te={AlertCircle:me,Check:he,ChevronDown:pe,Circle:fe,FileCode2:be,LoaderCircle:ve,Play:ge,Search:we,Upload:ye,X:_e},ze={not_started:"Awaiting submission",waiting:"Waiting",checking:"Checking",complete:"Complete",failed:"Failed",unavailable:"Not available"};function p(i){return i.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]??e)}function x(i){return i<1024?`${i} B`:i<1024*1024?`${(i/1024).toFixed(1)} KB`:`${(i/(1024*1024)).toFixed(1)} MB`}function He(i){const e=new Date(i);return Number.isNaN(e.getTime())?i:new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(e)}class Ge{constructor(e,t){f(this,"root");f(this,"transport");f(this,"pollTimer");f(this,"caseRequest",0);f(this,"disposeModelViewer");f(this,"state",{task:"text2cad",format:"openscad",textMode:"descriptive",searchValue:"",caseLoading:!0,submitting:!1});this.root=e,this.transport=t}async start(){var e,t;this.render();try{this.state.capabilities=await this.transport.getCapabilities(),this.ensureAvailableFormat();const a=await((t=(e=this.transport).resumeEvaluation)==null?void 0:t.call(e));a?(this.state.task=a.case.task,this.state.format=a.case.format,this.state.textMode=a.case.text_mode??"descriptive",this.state.currentCase=a.case,this.state.searchValue=a.case.uid,this.state.snapshot=a.snapshot,this.state.caseLoading=!1,this.render(),this.isTerminal(a.snapshot)||this.schedulePoll()):await this.loadRandomCase()}catch(a){this.state.caseLoading=!1,this.state.globalError=this.errorMessage(a),this.render()}}render(){var t;(t=this.disposeModelViewer)==null||t.call(this),this.disposeModelViewer=void 0;const e=this.environmentView();this.root.innerHTML=`
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
    `,this.bindEvents(),J({icons:te,attrs:{"aria-hidden":"true","stroke-width":"1.8"}}),this.mountModelViewer()}environmentView(){var t,a;const e=(a=(t=this.transport).connectionState)==null?void 0:a.call(t);return e?{label:e.label,ariaLabel:e.message||e.label,tone:e.available?"live":"offline"}:this.transport.kind==="api"||this.transport.kind==="gateway"?{label:"Connected",ariaLabel:"Connected to the public evaluation API",tone:"live"}:this.transport.kind==="fixture"?{label:"Preview fixture",ariaLabel:"Local development fixture is active and cannot produce scores",tone:"fixture"}:{label:"API unavailable",ariaLabel:"The public evaluation API is not configured",tone:"offline"}}renderGlobalError(){return this.state.globalError?`
      <div class="global-alert" role="alert" tabindex="-1" data-testid="global-error">
        <i data-lucide="alert-circle"></i>
        <div>
          <strong>Connection unavailable</strong>
          <span>${p(this.state.globalError)}</span>
        </div>
      </div>
    `:""}renderTaskTabs(){return`
      <nav class="task-tabs" role="tablist" aria-label="P3D task">
        ${w.map(e=>`
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
          ${I[this.state.task].map(t=>{const a=this.getFormatCapabilities().find(s=>s.id===t.id);return{...t,available:(a==null?void 0:a.status)==="available"}}).map(t=>`
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
    `}renderUpload(){var c,d,u,h,v,m;const e=this.selectedCapability(),t=(e==null?void 0:e.accept.join(","))||((c=this.state.currentCase)==null?void 0:c.source_accept.join(","))||".scad",a=(e==null?void 0:e.max_bytes)||((d=this.state.currentCase)==null?void 0:d.source_max_bytes)||8*1024*1024,s=this.state.source,r=((u=this.state.snapshot)==null?void 0:u.state)==="validating"||((h=this.state.snapshot)==null?void 0:h.state)==="evaluating",n=!this.state.currentCase||this.state.caseLoading||this.state.submitting||r,o=(m=(v=this.transport).connectionState)==null?void 0:m.call(v),l=(o==null?void 0:o.available)!==!1;return`
      <section class="source-panel" aria-labelledby="source-title">
        <div class="section-heading">
          <div>
            <h2 id="source-title">Submit source</h2>
            <p class="section-meta">${p(t.split(",").join(" or "))} · up to ${x(a)}</p>
          </div>
        </div>

        <div class="upload-body">
          ${(o==null?void 0:o.available)===!1?`<p class="intake-note" role="status"><i data-lucide="alert-circle"></i>${p(o.message||"Evaluation intake is temporarily unavailable.")}</p>`:""}
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
            ${!s||!l||n?"disabled":""}
          >
            <i class="${this.state.submitting||r?"loading-icon":""}" data-lucide="${this.state.submitting||r?"loader-circle":"play"}"></i>
            <span>${this.state.submitting?"Submitting":r?"Evaluation in progress":"Evaluate source"}</span>
          </button>
        </div>
      </section>
    `}renderResults(){var a,s;const e=((a=this.state.snapshot)==null?void 0:a.result)??D(),t=this.evaluationStatus();return`
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
        ${(s=this.state.snapshot)!=null&&s.message&&this.state.snapshot.state!=="complete"?`<div class="evaluation-message ${this.transport.kind==="fixture"?"is-fixture":""}">${p(this.state.snapshot.message)}</div>`:""}
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
    `}mountModelViewer(){var r;const e=this.root.querySelector("[data-model-viewer]"),t=(r=this.state.snapshot)==null?void 0:r.visualization;if(!e||!t)return;let a=!1,s;this.disposeModelViewer=()=>{a=!0,s==null||s()},this.createModelViewer(e,t,()=>a).then(n=>{a?n():s=n}).catch(()=>{if(a)return;const n=e.querySelector(".model-viewer-status");n&&(n.textContent="Model preview unavailable")})}async createModelViewer(e,t,a){var V;const[s,{OrbitControls:r},{STLLoader:n}]=await Promise.all([R(()=>import("./three.module-BTt32e3U.js"),[]),R(()=>import("./OrbitControls-BSM_CLzo.js"),__vite__mapDeps([0,1])),R(()=>import("./STLLoader-DnLadrxH.js"),__vite__mapDeps([2,1]))]);if(a())return()=>{};const o=new s.Scene;o.background=new s.Color(16777215),o.fog=new s.Fog(16777215,6.8,12.2);const l=new s.PerspectiveCamera(38,1,.01,100);l.position.set(3.6,2.35,4.35);const c=new s.WebGLRenderer({antialias:!0,alpha:!1,preserveDrawingBuffer:!0});c.setPixelRatio(Math.min(window.devicePixelRatio,2)),c.setClearColor(16777215,1),c.outputColorSpace=s.SRGBColorSpace,c.toneMapping=s.ACESFilmicToneMapping,c.toneMappingExposure=1,c.shadowMap.enabled=!0,c.shadowMap.type=s.PCFSoftShadowMap,e.appendChild(c.domElement);const d=new r(l,c.domElement);d.enableDamping=!0,d.autoRotate=!window.matchMedia("(prefers-reduced-motion: reduce)").matches,d.autoRotateSpeed=1.2,d.enablePan=!1,d.minDistance=2.2,d.maxDistance=7.5,o.add(new s.HemisphereLight(16449532,12176066,1.95));const u=new s.DirectionalLight(16777215,2.65);u.position.set(3.8,4.8,3.5),u.castShadow=!0,u.shadow.mapSize.set(1024,1024),o.add(u);const h=new s.DirectionalLight(12053215,.86);h.position.set(-3.2,2.2,-2.6),o.add(h);const v=new s.DirectionalLight(13035007,.62);v.position.set(-2.4,3.4,3.4),o.add(v);const m={text2cad:{body:12573164,edge:3239058,shadow:5927810,rim:14282751},image2cad:{body:11918799,edge:3044708,shadow:5208172,rim:14284010},text_image2cad:{body:12574175,edge:4945280,shadow:5993595,rim:14808566}}[((V=this.state.currentCase)==null?void 0:V.task)??"text2cad"],_=new s.Mesh(new s.PlaneGeometry(6,4),new s.ShadowMaterial({color:m.shadow,opacity:.09}));_.rotation.x=-Math.PI/2,_.position.y=-1.06,_.receiveShadow=!0,o.add(_);const E=new s.Group;E.rotation.x=-Math.PI/2,o.add(E);const b=e.querySelector(".model-viewer-status");let U=!1,q=0,A=null,C=null,T=null,$=null;new n().load(t.url,g=>{var B;if(U){g.dispose();return}g.computeVertexNormals(),g.computeBoundingBox(),g.center();const S=new s.Vector3;(B=g.boundingBox)==null||B.getSize(S);const M=Math.max(S.x,S.y,S.z)||1;g.scale(2.32/M,2.32/M,2.32/M),A=g,C=new s.MeshPhysicalMaterial({color:m.body,roughness:.58,metalness:.02,clearcoat:.1,clearcoatRoughness:.68,emissive:m.rim,emissiveIntensity:.006});const N=new s.Mesh(g,C);N.castShadow=!0,N.receiveShadow=!0,E.add(N),T=new s.EdgesGeometry(g,28),$=new s.LineBasicMaterial({color:m.edge,transparent:!0,opacity:.24}),E.add(new s.LineSegments(T,$)),b==null||b.remove()},void 0,()=>{b&&(b.classList.remove("is-loading"),b.textContent="Model preview unavailable")});const j=()=>{const g=Math.max(280,e.clientWidth),S=Math.max(300,e.clientHeight);c.setSize(g,S,!1),l.aspect=g/S,l.updateProjectionMatrix()},O=new ResizeObserver(j);O.observe(e),j();const F=()=>{q=requestAnimationFrame(F),d.update(),c.render(o,l)};return F(),()=>{U=!0,cancelAnimationFrame(q),O.disconnect(),d.dispose(),A==null||A.dispose(),C==null||C.dispose(),T==null||T.dispose(),$==null||$.dispose(),_.geometry.dispose(),_.material.dispose(),c.dispose(),c.domElement.remove()}}renderMetricResults(e){const t=e.metrics.find(r=>r.bucket==="Valid"),a=["Geometry","Topology","Part"].flatMap(r=>{const n=e.metrics.filter(o=>o.bucket===r);return n.length?[`
        <section class="metric-bucket" aria-labelledby="metric-bucket-${r.toLowerCase()}">
          <h4 id="metric-bucket-${r.toLowerCase()}">${r}</h4>
          <dl class="metric-list">
            ${n.map(o=>`
              <div>
                <dt>${p(o.label)}</dt>
                <dd>${p(String(o.value))}${o.unit?` <small>${p(o.unit)}</small>`:""}</dd>
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
        `:`<p class="no-metrics">${p(e.message||(e.state==="not_started"?"Metrics will appear after evaluation.":ze[e.state]))}</p>`;return`
      <div class="metric-results metric-results--${e.state}">
        <div class="metric-results-heading">
          <h3>Metrics</h3>
        </div>
        ${s}
      </div>
    `}renderProvenance(){var a,s;const e=(a=this.state.snapshot)==null?void 0:a.provenance;return`
      <details class="provenance-drawer" data-testid="provenance">
        <summary>
          <span>Technical provenance</span>
          <i class="drawer-chevron" data-lucide="chevron-down"></i>
        </summary>
        <dl>
          ${[["Transport",this.transport.kind==="gateway"?"Secure public gateway":this.transport.kind==="api"?"Public API":this.transport.kind==="fixture"?"Development fixture":"Not configured"],...e!=null&&e.public_reference?[["Public reference",e.public_reference]]:[],["Evaluation mode",(e==null?void 0:e.evaluation_mode)==="deterministic"?"Deterministic":"Not reported"],["Evaluator",(e==null?void 0:e.evaluator)||"Not reported"],["Adapter",(e==null?void 0:e.adapter_version)||"Not reported"],["Source",(e==null?void 0:e.source_name)||((s=this.state.source)==null?void 0:s.name)||"Not submitted"],["Source size",e?x(e.source_bytes):this.state.source?x(this.state.source.size):"Not submitted"],["Source SHA-256",(e==null?void 0:e.source_sha256)||"Not reported"],["Submitted",e!=null&&e.submitted_at?He(e.submitted_at):"Not submitted"],["Retention",(e==null?void 0:e.retention)||"Not reported"]].map(([r,n])=>`
                <div>
                  <dt>${p(r)}</dt>
                  <dd>${p(n)}</dd>
                </div>
              `).join("")}
        </dl>
      </details>
    `}bindEvents(){var r,n,o;this.root.querySelectorAll("[data-task]").forEach(l=>{l.addEventListener("click",()=>{this.selectTask(l.dataset.task)})});const e=this.root.querySelector("[role='tablist']");e==null||e.addEventListener("keydown",l=>this.handleTabKeys(l)),this.root.querySelectorAll("input[name='format']").forEach(l=>{l.addEventListener("change",()=>{this.selectFormat(l.value)})}),this.root.querySelectorAll("input[name='text-mode']").forEach(l=>{l.addEventListener("change",()=>{this.selectTextMode(l.value)})});const t=this.root.querySelector(".case-search");t==null||t.addEventListener("submit",l=>{l.preventDefault();const c=t.elements.namedItem("uid");this.loadExactCase((c==null?void 0:c.value)??"")}),(r=this.root.querySelector("[data-action='random']"))==null||r.addEventListener("click",()=>{this.loadRandomCase()});const a=this.root.querySelector(".file-input");a==null||a.addEventListener("change",()=>{this.acceptFiles(a.files)});const s=this.root.querySelector(".upload-drop");s==null||s.addEventListener("dragover",l=>{l.preventDefault(),s.classList.contains("is-disabled")||s.classList.add("is-dragging")}),s==null||s.addEventListener("dragleave",()=>s.classList.remove("is-dragging")),s==null||s.addEventListener("drop",l=>{var c;l.preventDefault(),s.classList.remove("is-dragging"),s.classList.contains("is-disabled")||this.acceptFiles(((c=l.dataTransfer)==null?void 0:c.files)??null)}),(n=this.root.querySelector("[data-action='remove-file']"))==null||n.addEventListener("click",()=>{this.state.source=void 0,this.state.sourceError=void 0,this.clearEvaluation(),this.render()}),(o=this.root.querySelector("[data-action='evaluate']"))==null||o.addEventListener("click",()=>{this.evaluate()})}handleTabKeys(e){if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.preventDefault();const a=w.findIndex(n=>n.id===this.state.task);let s=a;e.key==="ArrowRight"&&(s=(a+1)%w.length),e.key==="ArrowLeft"&&(s=(a-1+w.length)%w.length),e.key==="Home"&&(s=0),e.key==="End"&&(s=w.length-1);const r=w[s].id;this.selectTask(r,!0)}async selectTask(e,t=!1){var a;e!==this.state.task&&(this.caseRequest+=1,this.clearEvaluation(),this.state.task=e,this.state.textMode="descriptive",this.state.source=void 0,this.state.sourceError=void 0,this.state.caseError=void 0,this.state.searchValue="",this.ensureAvailableFormat(),await this.loadRandomCase(),t&&((a=this.root.querySelector(`[data-task='${e}']`))==null||a.focus()))}async selectFormat(e){e!==this.state.format&&(this.clearEvaluation(),this.state.format=e,this.state.source=void 0,await this.reloadCurrentCase())}async selectTextMode(e){e!==this.state.textMode&&(this.clearEvaluation(),this.state.textMode=e,this.state.source=void 0,await this.reloadCurrentCase())}async reloadCurrentCase(){var e;(e=this.state.currentCase)!=null&&e.uid?await this.loadExactCase(this.state.currentCase.uid):await this.loadRandomCase()}async loadExactCase(e){const t=e.trim();if(!t){this.state.caseError="Enter a complete UID.",this.render(),this.focusAlert("#case-error");return}await this.loadCase(()=>this.transport.resolveExactCase({...this.caseQuery(),uid:t}))}async loadRandomCase(){await this.loadCase(()=>this.transport.getRandomCase(this.caseQuery()))}async loadCase(e){const t=++this.caseRequest,a=this.state.currentCase;this.state.caseLoading=!0,this.state.caseError=void 0,this.render();try{const s=await e();if(t!==this.caseRequest)return;this.clearEvaluation(),this.state.currentCase=s,this.state.searchValue=s.uid,this.state.source=void 0,this.state.sourceError=void 0}catch(s){if(t!==this.caseRequest)return;this.state.currentCase=a,this.state.caseError=this.errorMessage(s)}finally{t===this.caseRequest&&(this.state.caseLoading=!1,this.render(),this.state.caseError&&this.focusAlert("#case-error"))}}acceptFiles(e){var o,l;if(this.state.sourceError=void 0,this.state.evaluationError=void 0,!e||e.length!==1){this.state.source=void 0,this.state.sourceError="Select exactly one source file.",this.render(),this.focusAlert("#source-error");return}const t=e[0],a=this.selectedCapability(),s=(a==null?void 0:a.accept)??((o=this.state.currentCase)==null?void 0:o.source_accept)??[],r=(a==null?void 0:a.max_bytes)??((l=this.state.currentCase)==null?void 0:l.source_max_bytes)??0,n=t.name.toLowerCase();s.some(c=>n.endsWith(c.toLowerCase()))?t.size===0?(this.state.source=void 0,this.state.sourceError="The source file is empty."):t.size>r?(this.state.source=void 0,this.state.sourceError=`The source file exceeds ${x(r)}.`):(this.clearEvaluation(),this.state.source=t):(this.state.source=void 0,this.state.sourceError=`Use a ${s.join(" or ")} source file.`),this.render(),this.state.sourceError?this.focusAlert("#source-error"):window.requestAnimationFrame(()=>{var c;(c=this.root.querySelector("[data-action='evaluate']"))==null||c.focus({preventScroll:!0})})}async evaluate(){if(!(!this.state.currentCase||!this.state.source||this.state.submitting)){this.state.submitting=!0,this.state.evaluationError=void 0,this.render();try{const e=await this.transport.submitEvaluation({case:this.state.currentCase,source:this.state.source});this.state.snapshot=e,(this.transport.kind==="api"||this.transport.kind==="gateway")&&!this.isTerminal(e)&&this.schedulePoll()}catch(e){this.state.evaluationError=this.errorMessage(e)}finally{this.state.submitting=!1,this.render(),this.state.evaluationError?this.focusAlert("#evaluation-error"):this.state.snapshot&&window.requestAnimationFrame(()=>{var e;(e=this.root.querySelector(".results-section"))==null||e.focus({preventScroll:!0})})}}}schedulePoll(){window.clearTimeout(this.pollTimer),this.pollTimer=window.setTimeout(()=>void this.poll(),2500)}async poll(){var t;const e=(t=this.state.snapshot)==null?void 0:t.evaluation_ref;if(e)try{const a=await this.transport.getEvaluation(e);this.state.snapshot=a,this.render(),this.isTerminal(a)||this.schedulePoll()}catch(a){this.state.evaluationError=this.errorMessage(a),this.render()}}isTerminal(e){return e.state==="complete"||e.state==="failed"}clearEvaluation(){var t,a,s;window.clearTimeout(this.pollTimer),this.pollTimer=void 0;const e=(t=this.state.snapshot)==null?void 0:t.evaluation_ref;e&&((s=(a=this.transport).releaseEvaluation)==null||s.call(a,e)),this.state.snapshot=void 0,this.state.evaluationError=void 0}caseQuery(){return{task:this.state.task,format:this.state.format,...this.state.task==="text2cad"?{text_mode:this.state.textMode}:{}}}getFormatCapabilities(){var e,t;return((t=(e=this.state.capabilities)==null?void 0:e.tasks.find(a=>a.task===this.state.task))==null?void 0:t.formats)??[]}selectedCapability(){return this.getFormatCapabilities().find(e=>e.id===this.state.format)}ensureAvailableFormat(){var t;const e=this.getFormatCapabilities().filter(a=>a.status==="available");e.some(a=>a.id===this.state.format)||(this.state.format=((t=e[0])==null?void 0:t.id)??"openscad")}evaluationStatus(){var t;if(this.state.submitting)return{label:"Submitting",icon:"loader-circle",tone:"active",spinning:!0};const e=(t=this.state.snapshot)==null?void 0:t.state;return e==="validating"||e==="evaluating"?{label:e==="validating"?"Validating":"Evaluating",icon:"loader-circle",tone:"active",spinning:!0}:e==="complete"?{label:"Complete",icon:"check",tone:"success",spinning:!1}:e==="failed"?{label:"Failed",icon:"alert-circle",tone:"danger",spinning:!1}:{label:"Awaiting submission",icon:"circle",tone:"idle",spinning:!1}}focusAlert(e){window.requestAnimationFrame(()=>{var t;(t=this.root.querySelector(e))==null||t.focus()})}errorMessage(e){return e instanceof Error?e.message:"The request could not be completed."}}const se=document.querySelector("#app");if(!se)throw new Error("Application root is missing.");async function Je(i){i.innerHTML=`
    <main class="boot-screen" aria-busy="true">
      <i class="loading-icon" data-lucide="loader-circle"></i>
      <span>Loading evaluation tool</span>
    </main>
  `,J({icons:te,attrs:{"aria-hidden":"true","stroke-width":"1.8"}});const e=await Be();await new Ge(i,e).start()}Je(se);
