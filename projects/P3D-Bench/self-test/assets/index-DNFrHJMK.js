const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/OrbitControls-BSM_CLzo.js","assets/three.module-BTt32e3U.js","assets/STLLoader-DnLadrxH.js"])))=>i.map(i=>d[i]);
var ne=Object.defineProperty;var ce=(r,e,t)=>e in r?ne(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var b=(r,e,t)=>ce(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();const le="modulepreload",de=function(r){return"/projects/P3D-Bench/self-test/"+r},Q={},j=function(e,t,a){let s=Promise.resolve();if(t&&t.length>0){let o=function(l){return Promise.all(l.map(c=>Promise.resolve(c).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),d=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));s=o(t.map(l=>{if(l=de(l),l in Q)return;Q[l]=!0;const c=l.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${p}`))return;const u=document.createElement("link");if(u.rel=c?"stylesheet":le,c||(u.as="script"),u.crossOrigin="",u.href=l,d&&u.setAttribute("nonce",d),document.head.appendChild(u),c)return new Promise((m,v)=>{u.addEventListener("load",m),u.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(o){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=o,window.dispatchEvent(n),!n.defaultPrevented)throw o}return s.then(o=>{for(const n of o||[])n.status==="rejected"&&i(n.reason);return e().catch(i)})};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=(r,e,t=[])=>{const a=document.createElementNS("http://www.w3.org/2000/svg",r);return Object.keys(e).forEach(s=>{a.setAttribute(s,String(e[s]))}),t.length&&t.forEach(s=>{const i=ee(...s);a.appendChild(i)}),a};var ue=([r,e,t])=>ee(r,e,t);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=r=>Array.from(r.attributes).reduce((e,t)=>(e[t.name]=t.value,e),{}),he=r=>typeof r=="string"?r:!r||!r.class?"":r.class&&typeof r.class=="string"?r.class.split(" "):r.class&&Array.isArray(r.class)?r.class:"",me=r=>r.flatMap(he).map(t=>t.trim()).filter(Boolean).filter((t,a,s)=>s.indexOf(t)===a).join(" "),fe=r=>r.replace(/(\w)(\w*)(_|-|\s*)/g,(e,t,a)=>t.toUpperCase()+a.toLowerCase()),X=(r,{nameAttr:e,icons:t,attrs:a})=>{var v;const s=r.getAttribute(e);if(s==null)return;const i=fe(s),o=t[i];if(!o)return console.warn(`${r.outerHTML} icon name was not found in the provided icons object.`);const n=pe(r),[d,l,c]=o,p={...l,"data-lucide":s,...a,...n},u=me(["lucide",`lucide-${s}`,n,a]);u&&Object.assign(p,{class:u});const m=ue([d,p,c]);return(v=r.parentNode)==null?void 0:v.replaceChild(m,r)};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=["svg",E,[["path",{d:"m12 19-7-7 7-7"}],["path",{d:"M19 12H5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=["svg",E,[["path",{d:"M20 6 9 17l-5-5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ge=["svg",E,[["path",{d:"m6 9 6 6 6-6"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=["svg",E,[["circle",{cx:"12",cy:"12",r:"10"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=["svg",E,[["circle",{cx:"12",cy:"12",r:"10"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=["svg",E,[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"m5 12-3 3 3 3"}],["path",{d:"m9 18 3-3-3-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ee=["svg",E,[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Se=["svg",E,[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ke=["svg",E,[["polygon",{points:"6 3 20 12 6 21 6 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=["svg",E,[["circle",{cx:"11",cy:"11",r:"8"}],["path",{d:"m21 21-4.3-4.3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $e=["svg",E,[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{points:"17 8 12 3 7 8"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ce=["svg",E,[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=({icons:r={},nameAttr:e="data-lucide",attrs:t={}}={})=>{if(!Object.values(r).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const a=document.querySelectorAll(`[${e}]`);if(Array.from(a).forEach(s=>X(s,{nameAttr:e,icons:r,attrs:t})),e==="data-lucide"){const s=document.querySelectorAll("[icon-name]");s.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(s).forEach(i=>X(i,{nameAttr:"icon-name",icons:r,attrs:t})))}},S=[{id:"text2cad",label:"Text-to-3D"},{id:"image2cad",label:"Image-to-3D"},{id:"text_image2cad",label:"Assembly-3D"}],D={text2cad:[{id:"json",label:"JSON"},{id:"openscad",label:"OpenSCAD"}],image2cad:[{id:"openscad",label:"OpenSCAD"},{id:"cadquery",label:"CadQuery"},{id:"threejs",label:"Three.js"}],text_image2cad:[{id:"openscad",label:"OpenSCAD"},{id:"cadquery",label:"CadQuery"}]};function R(){return{state:"not_started",metrics:[]}}const se=[{keys:["chamfer_distance"],label:"CD ↓",bucket:"Geometry"},{keys:["iou_csg"],label:"IoU_C ↑",bucket:"Geometry",tasks:["text2cad"]},{keys:["iou_voxel"],label:"IoU_V ↑",bucket:"Geometry",tasks:["image2cad","text_image2cad"]},{keys:["f_score_005"],label:"F@.05 ↑",bucket:"Geometry"},{keys:["f_score_001"],label:"F@.01 ↑",bucket:"Geometry"},{keys:["normal_consistency"],label:"NC ↑",bucket:"Geometry"},{keys:["pred_open_edge_ratio"],label:"NoOE ↑",bucket:"Topology",transform:r=>r===0?1:0},{keys:["pred_inverted_normal_ratio"],label:"InvN ↓",bucket:"Topology"},{keys:["pred_non_manifold_edge_ratio"],label:"NM ↓",bucket:"Topology"},{keys:["part_match_f1"],label:"PartMatchF1 ↑",bucket:"Part",tasks:["text_image2cad"]},{keys:["part_fscore_mean","part_fscore"],label:"PartFS ↑",bucket:"Part",tasks:["text_image2cad"]}];new Map(se.flatMap(({keys:r,label:e})=>r.map(t=>[t,e])));function xe(r,e){return typeof e=="boolean"?e?"Yes":"No":Number.isFinite(e)?r==="pred_open_edge_ratio"?e.toFixed(3):r.includes("chamfer")||r.includes("hausdorff")||r==="stage2_fidelity_cd"?e===0?"0":e<.01?e.toFixed(4):e.toFixed(3):e<1?e.toFixed(3):e.toFixed(2):String(e)}function Ae(r,e={task:"text2cad",textMode:"parametric"}){const t=r.metrics&&typeof r.metrics=="object"&&!Array.isArray(r.metrics)?r.metrics:{},a=se.flatMap(i=>{if(i.tasks&&!i.tasks.includes(e.task))return[];const o=i.keys.find(l=>typeof t[l]=="number");if(!o)return[];const n=t[o],d=i.transform?i.transform(n):n;return[{key:o,label:i.label,bucket:i.bucket,value:xe(o,d)}]});typeof r.valid=="boolean"&&a.unshift({key:"valid",label:"Valid",bucket:"Valid",value:r.valid?"Yes":"No"});const s=r.evaluation_status==="failed";return{state:s?"failed":"complete",message:s?String(r.evaluation_failure_reason??"Evaluation failed"):a.length?void 0:"No P3D-Bench metrics were reported.",metrics:a}}async function ae(r,e,t){var l;const a=r.headers.get("content-length");if(a!==null){const c=Number(a);if(!Number.isSafeInteger(c)||c<0||c>e)throw new Error(t)}const s=(l=r.body)==null?void 0:l.getReader();if(!s)throw new Error(t);const i=[];let o=0;for(;;){const c=await s.read();if(c.done)break;if(o+=c.value.byteLength,o>e)throw await s.cancel(),new Error(t);i.push(c.value)}const n=new Uint8Array(o);let d=0;for(const c of i)n.set(c,d),d+=c.byteLength;try{return JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(n))}catch{throw new Error(t)}}const L={text2cad:400,image2cad:400,text_image2cad:203},Pe=/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/,z=/^[a-z0-9][a-z0-9._-]{0,127}$/,k=/^[0-9a-f]{64}$/,Ie=8*1024*1024,M=new Set(["text2cad/json","text2cad/openscad","image2cad/cadquery","image2cad/openscad","image2cad/threejs","text_image2cad/cadquery","text_image2cad/openscad"]),Z={json:".json",openscad:".scad",cadquery:".py",threejs:".js"};function _(r,e){if(!r||typeof r!="object"||Array.isArray(r))throw new Error(`The public ${e} is invalid.`);return r}function Le(r){const e=String(r??"");if(!/^visible-inputs\/[A-Za-z0-9_-]+\.png$/.test(e)||e.includes("..")||e.includes("\\"))throw new Error("The public case image path is invalid.");return e}function qe(r){const e=_(r,"case input variant"),t=e.prompt_profile===null?null:String(e.prompt_profile??""),a=e.prompt===null?null:String(e.prompt??""),s=String(e.visible_input_sha256??"");if(t!==null&&!z.test(t)||t===null!=(a===null))throw new Error("The public case prompt contract is invalid.");if(a!==null&&!a.trim())throw new Error("The public case prompt is empty.");if(!k.test(s))throw new Error("The public visible-input digest is invalid.");const i=_(e.static_submission_contract,"static case contract"),o=_(e.static_submission_proof,"static case proof");if(i.schema_version!=="spatiaos-public-static-case-contract-v1"||o.schema_version!=="spatiaos-public-static-case-proof-v1"||!Number.isSafeInteger(o.leaf_index)||o.leaf_index<0||!Array.isArray(o.siblings)||o.siblings.length>32||o.siblings.some(n=>!n||!["left","right"].includes(String(n.position))||!k.test(String(n.sha256))))throw new Error("The public static submission proof is invalid.");return{prompt_profile:t,prompt:a,visible_input_sha256:s,static_submission_contract:i,static_submission_proof:o}}function Re(r){if(r===null)return null;const e=_(r,"case image"),t={path:Le(e.path),sha256:String(e.sha256??""),bytes:Number(e.bytes),width:Number(e.width),height:Number(e.height),render_profile:String(e.render_profile??"")};if(!k.test(t.sha256)||!Number.isSafeInteger(t.bytes)||t.bytes<24||t.bytes>1024*1024||t.width!==1024||t.height!==1024||t.render_profile!=="cadbenchmark_occ_single_view_v1")throw new Error("The public case image contract is invalid.");return t}function Me(r){const e=_(r,"generation reference cell"),t=String(e.task??""),a=String(e.format??""),s=`${t}/${a}`;if(!M.has(s))throw new Error(`The public generation reference does not support ${s}.`);const i=_(e.output_requirements,"output requirements"),o=Array.isArray(i.requirements)?i.requirements.map(m=>{const v=_(m,"output requirement"),f=String(v.id??""),w=String(v.text??"");if(!/^[a-z0-9_]{1,80}$/.test(f)||!w.trim()||w.length>2e3)throw new Error(`The public ${s} output requirements are invalid.`);return{id:f,text:w}}):[];if(i.schema_version!=="p3d-output-requirements-v1"||i.enforcement!=="required"||i.task!==t||i.format!==a||i.source_extension!==Z[a]||o.length<3||o.length>6)throw new Error(`The public ${s} output requirements are invalid.`);const n={schema_version:"p3d-output-requirements-v1",enforcement:"required",task:t,format:a,source_extension:Z[a],requirements:o},d=_(e.generation_reference,"model setup reference"),l=String(d.system_message??""),c=String(d.user_message_template??""),p=d.visible_text_placeholder===null?null:String(d.visible_text_placeholder??"");if(d.enforcement!=="optional_reference"||d.required_for_submission!==!1||d.prompt_owner!=="cadbenchmark"||!z.test(String(d.prompt_variant??""))||d.image_input!==(t!=="text2cad")||p!==(t==="image2cad"?null:"{{VISIBLE_TEXT}}")||!l.trim()||l.length>128*1024||!k.test(String(d.system_message_sha256??""))||!c.trim()||c.length>128*1024||!k.test(String(d.user_message_template_sha256??""))||!k.test(String(d.setup_sha256??"")))throw new Error(`The public ${s} model setup reference is invalid.`);const u={enforcement:"optional_reference",required_for_submission:!1,prompt_owner:"cadbenchmark",prompt_variant:String(d.prompt_variant),image_input:t!=="text2cad",visible_text_placeholder:p,system_message:l,system_message_sha256:String(d.system_message_sha256),user_message_template:c,user_message_template_sha256:String(d.user_message_template_sha256),setup_sha256:String(d.setup_sha256)};return{task:t,format:a,output_requirements:n,generation_reference:u}}function De(r){const e=_(r,"generation reference"),t=_(e.source,"generation reference source"),a=_(e.semantics,"generation reference semantics");if(e.schema_version!=="p3d-public-generation-reference-v1"||e.benchmark!=="p3d"||e.suite_id!=="p3d-bench-paper"||e.suite_version!=="v1"||!k.test(String(e.contract_sha256??""))||t.component!=="cadbenchmark"||!/^[0-9a-f]{40}$/.test(String(t.commit??""))||t.clean!==!0||!z.test(String(t.prompt_variant??""))||!k.test(String(t.prompt_source_sha256??""))||a.output_requirements!=="required"||a.generation_reference!=="optional")throw new Error("The public generation reference identity is invalid.");const s=Array.isArray(e.cells)?e.cells.map(Me):[],i=s.map(o=>`${o.task}/${o.format}`);if(s.length!==M.size||new Set(i).size!==M.size||[...M].some(o=>!i.includes(o)))throw new Error("The public generation reference does not cover the P3D paper matrix.");return s}function Ne(r,e,t){const a=_(r,"case catalog entry"),s=String(a.uid??""),i=Number(a.case_index),o=a.default_prompt_profile===null?null:String(a.default_prompt_profile??""),n=Array.isArray(a.input_variants)?a.input_variants.map(qe):[],d=String(a.source_basename??"");if(!Pe.test(s)||i!==t||!n.length||!/^[A-Za-z0-9][A-Za-z0-9._-]{2,191}$/.test(d))throw new Error(`The public ${e} case catalog is invalid.`);if(o!==null&&!n.some(u=>u.prompt_profile===o)||o!==(e==="text2cad"?"parametric":e==="text_image2cad"?"intermediate":null))throw new Error(`The public ${e} prompt profile is invalid.`);const l=n.map(u=>u.prompt_profile).sort(),c=e==="text2cad"?["descriptive","parametric"]:e==="text_image2cad"?["intermediate"]:[null];if(JSON.stringify(l)!==JSON.stringify(c.sort()))throw new Error(`The public ${e} prompt variants are invalid.`);const p=Re(a.image);if(e==="text2cad"!=(p===null))throw new Error(`The public ${e} visible-image contract is invalid.`);for(const u of n){const m=u.static_submission_contract;if(m.benchmark!=="p3d"||m.suite_id!=="p3d-bench-paper"||m.suite_version!=="v1"||m.task!==e||m.case_id!==s||m.case_index!==i||m.prompt_profile!==u.prompt_profile||m.visible_input_sha256!==u.visible_input_sha256||m.source_basename!==d)throw new Error(`The public ${e} static submission contract is invalid.`)}return{uid:s,case_index:i,default_prompt_profile:o,input_variants:n,image:p,source_basename:d}}function Ue(r){const e=_(r,"case catalog"),t=_(e.tasks,"case task map"),a=_(e.task_counts,"case task counts"),s={};for(const c of Object.keys(L)){const p=t[c];if(!Array.isArray(p)||p.length!==L[c])throw new Error(`The public ${c} case count is invalid.`);if(a[c]!==L[c])throw new Error(`The public ${c} declared count is invalid.`);if(s[c]=p.map((u,m)=>Ne(u,c,m+1)),new Set(s[c].map(u=>u.uid)).size!==p.length)throw new Error(`The public ${c} UID list contains duplicates.`)}const i=new Set(s.image2cad.map(c=>c.uid));if(s.text_image2cad.some(c=>!i.has(c.uid)))throw new Error("The public assembly catalog is not a subset of the image catalog.");if(e.schema_version!=="p3d-public-case-catalog-v1"||e.suite_id!=="p3d-bench-paper"||e.suite_version!=="v1"||e.total_case_count!==1003||e.hidden_geometry_published!==!1)throw new Error("The public case catalog identity is invalid.");const o=_(e.static_submission_contract,"static case root"),n=De(e.generation_reference),d=Object.values(s).flatMap(c=>c.flatMap(p=>p.input_variants)),l=d.map(c=>c.static_submission_proof.leaf_index).sort((c,p)=>c-p);if(o.schema_version!=="spatiaos-public-static-case-root-v1"||o.algorithm!=="sha256-merkle-v1"||!k.test(o.root_sha256)||o.leaf_count!==d.length||l.some((c,p)=>c!==p))throw new Error("The public static submission root is invalid.");return{schema_version:"p3d-public-case-catalog-v1",suite_id:"p3d-bench-paper",suite_version:"v1",task_counts:L,total_case_count:1003,hidden_geometry_published:!1,static_submission_contract:o,generation_contracts:n,tasks:s}}class je{constructor(e){b(this,"url");b(this,"catalog");this.url=e}async load(){if(this.catalog)return;const e=await fetch(this.url,{headers:{Accept:"application/json"},credentials:"omit"});if(!e.ok)throw new Error("The public P3D case catalog could not be loaded.");this.catalog=Ue(await ae(e,Ie,"The public P3D case catalog is invalid."))}suite(){if(!this.catalog)throw new Error("The public P3D case catalog is not ready.");return{id:this.catalog.suite_id,version:this.catalog.suite_version}}staticRoot(){if(!this.catalog)throw new Error("The public P3D case catalog is not ready.");return this.catalog.static_submission_contract}resolve(e,t,a,s,i){if(!this.catalog)throw new Error("The public P3D case catalog is not ready.");const o=this.catalog.tasks[e];let n;if(s)n=o.find(u=>u.uid===s);else{const u=crypto.getRandomValues(new Uint32Array(1))[0];n=o[u%o.length]}if(!n)throw new Error("No public case matches that exact UID.");const d=e==="text2cad"?i??n.default_prompt_profile:n.default_prompt_profile,l=n.input_variants.find(u=>u.prompt_profile===d);if(!l)throw new Error("The selected public prompt profile is unavailable.");const c=a.accept[0];if(!c||!/^\.[a-z0-9]+$/.test(c))throw new Error("The selected source format is unavailable.");const p=this.catalog.generation_contracts.find(u=>u.task===e&&u.format===t);if(!p)throw new Error("The selected generation contract is unavailable.");return{uid:n.uid,case_index:n.case_index,task:e,format:t,text_mode:e==="text2cad"?d:void 0,prompt_profile:d,prompt:l.prompt,image:n.image?{url:new URL(n.image.path,this.url).toString(),alt:`P3D visible input for UID ${n.uid}`,sha256:n.image.sha256,bytes:n.image.bytes,render_profile:n.image.render_profile}:null,visible_input_sha256:l.visible_input_sha256,static_submission_contract:l.static_submission_contract,static_submission_proof:l.static_submission_proof,generation_contract:structuredClone(p),source_filename:`${n.source_basename}${c}`,source_accept:a.accept,source_max_bytes:a.max_bytes}}}class O extends Error{constructor(){super(...arguments);b(this,"retryable",!0)}}function Oe(r){return r instanceof O}const q="spatiaos-p3d-self-test-receipt-v1",F=/^req_[0-9a-f]{32}$/,B=/^rec_[0-9a-f]{48}$/,V=/^sub_[0-9a-f]{32}$/,ie=/^[0-9a-f]{64}$/,Fe=32*1024*1024,Be=8*1024*1024,Ve=2*1024*1024,ze={json:".json",openscad:".scad",cadquery:".py",threejs:".js"};function Ge(r){return r==="json"?"JSON":r==="threejs"?"Three.js":r==="cadquery"?"CadQuery":"OpenSCAD"}async function He(r){const e=await crypto.subtle.digest("SHA-256",await r.arrayBuffer());return[...new Uint8Array(e)].map(t=>t.toString(16).padStart(2,"0")).join("")}function Je(r){var a;if(!r||typeof r!="object"||Array.isArray(r))return null;const t=r;return t.schema_version!=="p3d-public-browser-receipt-v1"||!F.test(String(t.request_id??""))||!B.test(String(t.recovery_key??""))||!V.test(String(t.submission_id??""))||!S.some(s=>s.id===t.task)||!((a=D[t.task])!=null&&a.some(s=>s.id===t.format))||!t.uid||typeof t.source_name!="string"||!Number.isSafeInteger(t.source_bytes)||t.source_bytes<1||!ie.test(t.source_sha256)||Number.isNaN(new Date(t.submitted_at).getTime())?null:t}function Ke(r,e){const t=r.match(/^\/api\/submissions\/([A-Za-z0-9_-]{1,128})\/artifacts\/([A-Za-z0-9_.:-]{1,200})$/);return!t||t[1]!==e?null:r.slice(5)}class Ye{constructor(e,t){b(this,"kind","gateway");b(this,"baseUrl");b(this,"cases");b(this,"evaluations",new Map);b(this,"capabilities");b(this,"staticFastPathAvailable",!1);b(this,"gatewayState",{available:!1,label:"Checking service"});if(this.baseUrl=new URL(e.endsWith("/")?e:`${e}/`,window.location.href),!this.baseUrl.pathname.endsWith("/api/"))throw new Error("The public gateway URL must end with /api/.");if(new Set(["127.0.0.1","localhost","[::1]"]).has(this.baseUrl.hostname),this.baseUrl.protocol!=="https:")throw new Error("The public gateway URL must use HTTPS.");this.cases=new je(t)}async getCapabilities(){var a;await this.cases.load();const e=this.cases.suite(),t={evaluation_mode:"deterministic",tasks:S.map(({id:s})=>({task:s,formats:D[s].map(({id:i,label:o})=>({id:i,label:o,status:"available",accept:[ze[i]],max_bytes:Be}))}))};try{const[s,i]=await Promise.all([this.request("catalog"),this.request("capacity")]);if(s.schema_version!=="agentic-public-catalog-v1")throw new Error("The public evaluation catalog is incompatible.");const o=(a=s.suites)==null?void 0:a.find(u=>u.benchmark==="p3d"&&u.suite_id===e.id&&u.version===e.version);if(!o||o.public_self_test_status!=="available")throw new Error("P3D public self-evaluation is not currently available.");const n=this.cases.staticRoot(),d=o.static_submission_contract;this.staticFastPathAvailable=!!(d&&d.schema_version===n.schema_version&&d.algorithm===n.algorithm&&d.root_sha256===n.root_sha256&&d.leaf_count===n.leaf_count);const l=Number(i.max_submission_bytes),c=Number(i.max_result_object_bytes),p=Number(i.max_cases);if(!Number.isSafeInteger(l)||l<64*1024||l>32*1024*1024||!Number.isSafeInteger(c)||c<1024||c>64*1024*1024||!Number.isSafeInteger(p)||p<1||p>20||typeof i.accepting_requests!="boolean"||typeof i.accepting_submissions!="boolean")throw new Error("The public upload capacity contract is invalid.");if(this.capabilities={evaluation_mode:"deterministic",tasks:S.map(({id:u})=>({task:u,formats:D[u].map(({id:m,label:v})=>{var g;const f=(g=o.capabilities)==null?void 0:g.find(T=>T.task===u&&T.format===m),w=Array.isArray(f==null?void 0:f.extensions)?f.extensions.filter(T=>/^\.[a-z0-9]+$/.test(String(T))):[];return{id:m,label:v,status:(f==null?void 0:f.status)==="available"&&w.length===1?"available":"unavailable",accept:w,max_bytes:l}})}))},this.capabilities.tasks.some(u=>!u.formats.some(m=>m.status==="available")))throw new Error("The public P3D capability matrix is incomplete.");this.gatewayState=i.accepting_requests&&i.accepting_submissions?{available:!0,label:"Connected"}:{available:!1,label:"Intake paused",message:"Evaluation intake is temporarily paused."}}catch(s){this.capabilities=t,this.staticFastPathAvailable=!1,this.gatewayState={available:!1,label:"Evaluation offline",message:s instanceof Error?s.message:"The public evaluation gateway is unavailable."}}return this.capabilities}connectionState(){return this.gatewayState}async resolveExactCase(e){return this.resolveCase(e,e.uid.trim())}async getRandomCase(e){return this.resolveCase(e)}async submitEvaluation(e){if(!this.gatewayState.available)throw new Error(this.gatewayState.message||"Evaluation intake is unavailable.");const t=await He(e.source),a=this.cases.suite();if(this.staticFastPathAvailable&&e.case.static_submission_contract&&e.case.static_submission_proof){const l=new FormData;l.set("contract",JSON.stringify(e.case.static_submission_contract)),l.set("proof",JSON.stringify(e.case.static_submission_proof)),l.set("format",e.case.format),l.set("method","external-method"),l.set("model","user-supplied"),l.set("files",e.source,e.case.source_filename);const c=await this.request("static-submissions",{method:"POST",body:l}),p=String(c.request_id??""),u=String(c.recovery_key??""),m=String(c.submission_id??"");if(!F.test(p)||!B.test(u)||!V.test(m))throw new Error("The public gateway did not return a valid evaluation receipt.");const v=crypto.randomUUID(),f={requestId:p,recoveryKey:u,submissionId:m,sourceName:e.source.name,sourceBytes:e.source.size,sourceSha256:t,submittedAt:new Date().toISOString(),case:e.case};return this.evaluations.set(v,f),this.storeReceipt(f),this.snapshot(v,f,"evaluating","The source is queued for deterministic evaluation.")}const s=await this.request("self-tests",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({benchmark:"p3d",suite:a.id,suite_version:a.version,tasks:[e.case.task],format:e.case.format,prompt_profile:e.case.prompt_profile??void 0,n_cases:1,case_indices:[e.case.case_index],method:"external-method",model:"user-supplied"})}),i=String(s.request_id??""),o=String(s.recovery_key??"");if(!F.test(i)||!B.test(o))throw new Error("The public gateway did not return a valid evaluation receipt.");const n=crypto.randomUUID(),d={requestId:i,recoveryKey:o,source:e.source,sourceName:e.source.name,sourceBytes:e.source.size,sourceSha256:t,submittedAt:new Date().toISOString(),case:e.case};return this.evaluations.set(n,d),this.snapshot(n,d,"validating","Preparing the secure evaluation request.")}async getEvaluation(e){var i;const t=this.evaluations.get(e);if(!t)throw new Error("This browser no longer has the evaluation receipt.");if(!t.submissionId){const o=await this.request(`self-tests/${encodeURIComponent(t.requestId)}`,{headers:this.recoveryHeaders(t)});if(o.status!=="ready")return this.snapshot(e,t,"validating","Preparing the visible-input and submission contract.");try{this.validatePreparedCase(o.self_test,t.case)}catch{return this.preparedCaseFailure(e,t)}if(!t.source)throw new Error("Select the source file again to continue this evaluation.");const n=new FormData;n.set("files",t.source,t.case.source_filename);const d=await this.request(`self-tests/${encodeURIComponent(t.requestId)}/submissions`,{method:"POST",headers:this.recoveryHeaders(t),body:n}),l=String(d.submission_id??"");if(!V.test(l))throw new Error("The public gateway did not accept the source file.");return t.submissionId=l,t.source=void 0,this.storeReceipt(t),this.snapshot(e,t,"evaluating","The source is queued for deterministic evaluation.")}const a=await this.request(`submissions/${encodeURIComponent(t.submissionId)}`,{headers:this.recoveryHeaders(t)});if(a.status!=="available")return this.snapshot(e,t,"evaluating","The deterministic evaluator is running.");const s=a.evaluation;if(!s||typeof s!="object")throw new Error("The public gateway returned an invalid evaluation result.");return((i=s.submission)==null?void 0:i.status)==="complete"&&await this.ensureVisualization(t,s),this.completedSnapshot(e,t,s)}async resumeEvaluation(){let e=null;try{e=Je(JSON.parse(sessionStorage.getItem(q)||"null"))}catch{sessionStorage.removeItem(q)}if(!e)return null;const t=await this.resolveCase({task:e.task,format:e.format,text_mode:e.text_mode},e.uid),a=crypto.randomUUID(),s={requestId:e.request_id,recoveryKey:e.recovery_key,submissionId:e.submission_id,sourceName:e.source_name,sourceBytes:e.source_bytes,sourceSha256:e.source_sha256,submittedAt:e.submitted_at,case:t};return this.evaluations.set(a,s),{case:t,snapshot:await this.getEvaluation(a)}}releaseEvaluation(e){var a;const t=this.evaluations.get(e);(a=t==null?void 0:t.visualization)!=null&&a.url.startsWith("blob:")&&URL.revokeObjectURL(t.visualization.url),t!=null&&t.submissionId&&sessionStorage.removeItem(q),this.evaluations.delete(e)}async resolveCase(e,t){var s,i;await this.cases.load();const a=(i=(s=this.capabilities)==null?void 0:s.tasks.find(o=>o.task===e.task))==null?void 0:i.formats.find(o=>o.id===e.format&&o.status==="available");if(!a)throw new Error(`The ${Ge(e.format)} evaluator is not currently available.`);return this.cases.resolve(e.task,e.format,a,t,e.text_mode)}validatePreparedCase(e,t){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The prepared evaluation contract is invalid.");const a=e,s=Array.isArray(a.cases)?a.cases:[],i=s[0];if(a.benchmark!=="p3d"||a.suite!=="p3d-bench-paper"||a.suite_version!=="v1"||a.format!==t.format||s.length!==1||!i||i.task!==t.task||i.case_id!==t.uid||i.case_index!==t.case_index||(i.prompt_profile??null)!==(t.prompt_profile??null)||i.annotated_prompt!==t.prompt||i.visible_input_sha256!==t.visible_input_sha256||i.submission_filename!==t.source_filename)throw new Error("The evaluation service returned a different task, UID, or visible-input contract.")}preparedCaseFailure(e,t){const a="The evaluation service returned a different task, UID, or visible-input contract. No source was uploaded; retry the request.",s=R();return s.state="failed",s.message=a,this.evaluations.delete(e),{evaluation_ref:e,state:"failed",message:a,result:s,provenance:this.provenance(t)}}completedSnapshot(e,t,a){var l,c,p,u;const s=String(((l=a.submission)==null?void 0:l.status)??""),i=s==="failed",o=s==="complete"&&!!a.result,n=((p=(c=a.result)==null?void 0:c.cases)==null?void 0:p[0])??{};let d;return o?d=Ae(n,{task:t.case.task,textMode:t.case.text_mode}):i?d={state:"failed",message:String(((u=a.submission)==null?void 0:u.failure_reason)??"Evaluation failed"),metrics:[]}:(d=R(),d.state="checking",d.message="The deterministic evaluator is running."),{evaluation_ref:e,state:i?"failed":o?"complete":"evaluating",message:i?d.message??"The evaluation did not complete.":o?"Deterministic evaluation finished.":"The deterministic evaluator is running.",result:d,provenance:this.provenance(t),visualization:t.visualization}}snapshot(e,t,a,s){const i=R();return i.state="checking",i.message=s,{evaluation_ref:e,state:a,message:s,result:i,provenance:this.provenance(t)}}provenance(e){return{evaluator:"P3D / cadbenchmark",evaluation_mode:"deterministic",adapter_version:"p3d_external_submission_v1",source_name:e.sourceName,source_bytes:e.sourceBytes,source_sha256:e.sourceSha256,submitted_at:e.submittedAt,retention:"Evaluation-only retention policy",transport:"gateway",public_reference:e.submissionId??e.requestId}}recoveryHeaders(e){return{"x-spatiaos-recovery-key":e.recoveryKey}}storeReceipt(e){if(!e.submissionId)return;const t={schema_version:"p3d-public-browser-receipt-v1",request_id:e.requestId,recovery_key:e.recoveryKey,submission_id:e.submissionId,task:e.case.task,format:e.case.format,...e.case.text_mode?{text_mode:e.case.text_mode}:{},uid:e.case.uid,source_name:e.sourceName,source_bytes:e.sourceBytes,source_sha256:e.sourceSha256,submitted_at:e.submittedAt};sessionStorage.setItem(q,JSON.stringify(t))}async ensureVisualization(e,t){var v,f,w;if(e.visualization||!e.submissionId)return;const a=(f=(v=t.result)==null?void 0:v.artifacts)==null?void 0:f.find(g=>g.role==="model_stl"),s=Number(a==null?void 0:a.bytes),i=String((a==null?void 0:a.sha256)??""),o=Ke(String((a==null?void 0:a.download_url)??""),e.submissionId);if(!o||!Number.isSafeInteger(s)||s<1||s>Fe||!ie.test(i)||!new Set(["model/stl","application/sla","application/octet-stream"]).has(String((a==null?void 0:a.media_type)??"")))return;const n=new URL(o,this.baseUrl);if(n.origin!==this.baseUrl.origin||!n.pathname.startsWith(this.baseUrl.pathname))return;const d=await fetch(n,{headers:{Accept:"model/stl, application/sla, application/octet-stream",...this.recoveryHeaders(e)},credentials:"omit"});if(!d.ok)return;const l=d.headers.get("content-length");if(l!==null&&Number(l)!==s)return;const c=(w=d.body)==null?void 0:w.getReader();if(!c)return;const p=new Uint8Array(s);let u=0;for(;;){const g=await c.read();if(g.done)break;if(u+g.value.byteLength>s){await c.cancel();return}p.set(g.value,u),u+=g.value.byteLength}u!==s||[...new Uint8Array(await crypto.subtle.digest("SHA-256",p))].map(g=>g.toString(16).padStart(2,"0")).join("")!==i||(e.visualization={kind:"stl",url:URL.createObjectURL(new Blob([p],{type:"model/stl"})),sha256:i,bytes:s})}async request(e,t){let a;try{a=await fetch(new URL(e,this.baseUrl),{...t,credentials:"omit",headers:{Accept:"application/json",...t==null?void 0:t.headers}})}catch{throw new O("The public evaluation gateway could not be reached.")}let s=null;try{s=await ae(a,Ve,"The public evaluation gateway returned an invalid response.")}catch{if(a.ok)throw new Error("The public evaluation gateway returned an invalid response.")}if(!a.ok){const i=s&&typeof s=="object"?s:{},o=i.error||i.message||a.statusText||"The public evaluation gateway rejected the request.";throw i.retryable===!0||a.status>=500?new O(o):new Error(o)}return s}}class We{constructor(){b(this,"kind","unconfigured")}unavailable(){throw new Error("The public evaluation API is not configured.")}getCapabilities(){return Promise.reject(this.unavailable())}resolveExactCase(e){return Promise.reject(this.unavailable())}getRandomCase(e){return Promise.reject(this.unavailable())}submitEvaluation(e){return Promise.reject(this.unavailable())}getEvaluation(e){return Promise.reject(this.unavailable())}}async function Qe(){const r="https://spatiaos-eval.2565851683.workers.dev/api/".trim();if(r){const t=new URL("assets/p3d-bench-paper/v1/cases.json",new URL("/projects/P3D-Bench/self-test/",window.location.origin));if(t.origin!==window.location.origin)throw new Error("The public case catalog must be served by the reviewed Pages origin.");return new Ye(r,t)}return new We}const re={AlertCircle:_e,ArrowLeft:ve,Check:be,ChevronDown:ge,Circle:we,FileCode2:ye,Info:Ee,LoaderCircle:Se,Play:ke,Search:Te,Upload:$e,X:Ce},Xe={not_started:"Awaiting submission",waiting:"Waiting",checking:"Checking",complete:"Complete",failed:"Failed",unavailable:"Not available"},Ze={json:"Save the final structured CAD program produced by your method as a .json file.",openscad:"Save the final OpenSCAD source from your agent or editor as a .scad file before exporting a mesh.",cadquery:"Save the final standalone CadQuery Python source produced by your method as a .py file.",threejs:"Save the final standalone Three.js geometry source produced by your method as a .js file."};function h(r){return r.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]??e)}function P(r){return r<1024?`${r} B`:r<1024*1024?`${(r/1024).toFixed(1)} KB`:`${(r/(1024*1024)).toFixed(1)} MB`}function et(r){const e=new Date(r);return Number.isNaN(e.getTime())?r:new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(e)}function tt(r){return r.length<=24?r:`${r.slice(0,12)}...${r.slice(-6)}`}function st(r){return r?/evaluation[- ]only/i.test(r)?"Evaluation only":r:"Not reported"}class at{constructor(e,t){b(this,"root");b(this,"transport");b(this,"pollTimer");b(this,"progressTimer");b(this,"pollFailureCount",0);b(this,"caseRequest",0);b(this,"disposeModelViewer");b(this,"state",{task:"text2cad",format:"openscad",textMode:"descriptive",searchValue:"",caseLoading:!0,submitting:!1,referenceOpen:!1,provenanceOpen:!1});this.root=e,this.transport=t}async start(){var e,t;this.render();try{this.state.capabilities=await this.transport.getCapabilities(),this.ensureAvailableFormat();const a=await((t=(e=this.transport).resumeEvaluation)==null?void 0:t.call(e));if(a){this.state.task=a.case.task,this.state.format=a.case.format,this.state.textMode=a.case.text_mode??"descriptive",this.state.currentCase=a.case,this.state.searchValue=a.case.uid,this.state.snapshot=a.snapshot;const s=Date.parse(a.snapshot.provenance.submitted_at);this.state.evaluationStartedAt=Number.isFinite(s)?s:Date.now(),this.state.caseLoading=!1,this.render(),this.isTerminal(a.snapshot)||(this.startProgressTicker(),this.schedulePoll())}else await this.loadRandomCase()}catch(a){this.state.caseLoading=!1,this.state.globalError=this.errorMessage(a),this.render()}}render(){var t;(t=this.disposeModelViewer)==null||t.call(this),this.disposeModelViewer=void 0;const e=this.environmentView();this.root.innerHTML=`
      <header class="masthead">
        <div class="masthead-inner">
          <a class="brand-home" href="../" aria-label="Back to P3D-Bench">
            <i data-lucide="arrow-left"></i>
            <span class="brand-copy">
              <h1>P3D-Bench</h1>
              <p>Public self-evaluation</p>
            </span>
          </a>
          <div class="environment environment--${e.tone}" aria-label="${h(e.ariaLabel)}">
            <span class="environment-dot" aria-hidden="true"></span>
            <span>${h(e.label)}</span>
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

            ${this.renderGenerationContract()}
            ${this.renderResults()}
            ${this.renderProvenance()}
          </div>
        </section>
      </main>
    `,this.bindEvents(),te({icons:re,attrs:{"aria-hidden":"true","stroke-width":"1.8"}}),this.mountModelViewer()}environmentView(){var t,a;const e=(a=(t=this.transport).connectionState)==null?void 0:a.call(t);return e?{label:e.label,ariaLabel:e.message||e.label,tone:e.available?"live":"offline"}:this.transport.kind==="api"||this.transport.kind==="gateway"?{label:"Connected",ariaLabel:"Connected to the public evaluation API",tone:"live"}:this.transport.kind==="fixture"?{label:"Preview fixture",ariaLabel:"Local development fixture is active and cannot produce scores",tone:"fixture"}:{label:"API unavailable",ariaLabel:"The public evaluation API is not configured",tone:"offline"}}renderGlobalError(){return this.state.globalError?`
      <div class="global-alert" role="alert" tabindex="-1" data-testid="global-error">
        <i data-lucide="alert-circle"></i>
        <div>
          <strong>Connection unavailable</strong>
          <span>${h(this.state.globalError)}</span>
        </div>
      </div>
    `:""}renderTaskTabs(){return`
      <nav class="task-tabs" role="tablist" aria-label="P3D task">
        ${S.map(e=>`
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
              ${h(e.label)}
            </button>
          `).join("")}
      </nav>
    `}renderFormatControl(){return`
      <fieldset class="control-group format-control">
        <legend>Source format</legend>
        <div class="segmented-control" data-testid="format-control">
          ${D[this.state.task].map(t=>{const a=this.getFormatCapabilities().find(s=>s.id===t.id);return{...t,available:(a==null?void 0:a.status)==="available"}}).map(t=>`
                <label class="segment ${t.available?"":"is-disabled"}">
                  <input
                    type="radio"
                    name="format"
                    value="${t.id}"
                    ${this.state.format===t.id?"checked":""}
                    ${t.available?"":"disabled"}
                  />
                  <span>
                    <b>${h(t.label)}</b>
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
              value="${h(this.state.searchValue)}"
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
        ${this.state.caseError?`<p id="case-error" class="field-error" role="alert" tabindex="-1"><i data-lucide="alert-circle"></i>${h(this.state.caseError)}</p>`:""}
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
            <img src="${h(e.image.url)}" alt="${h(e.image.alt)}" />
          </figure>
        `:"",a=e.prompt?`
          <article class="prompt-panel">
            <h3>Annotated case prompt</h3>
            <p>${h(e.prompt)}</p>
          </article>
        `:"",s=e.image?e.prompt?"image-and-prompt":"image-only":"text-only";return`
      <section class="visible-input" aria-labelledby="visible-input-title" data-testid="visible-input">
        <div class="section-heading">
          <div>
            <h2 id="visible-input-title">Visible input</h2>
            <p class="section-meta">UID <code>${h(e.uid)}</code></p>
          </div>
        </div>
        <div class="input-content ${s}">
          ${t}
          ${a}
        </div>
      </section>
    `}renderGenerationContract(){var s;const e=(s=this.state.currentCase)==null?void 0:s.generation_contract;if(!e)return"";const t=e.generation_reference,a=t.visible_text_placeholder?`<p class="reference-template-note"><code>${h(t.visible_text_placeholder)}</code> is replaced with the annotated case prompt shown above.</p>`:"";return`
      <section class="generation-contract" aria-labelledby="generation-contract-title" data-testid="generation-contract">
        <div class="generation-contract-heading">
          <div>
            <h2 id="generation-contract-title">Generation setup</h2>
            <p>Follow the submission requirements. The benchmark-aligned model prompt is provided as an optional reference.</p>
          </div>
        </div>
        <div class="generation-contract-grid">
          <section class="output-requirements" aria-labelledby="output-requirements-title" data-testid="output-requirements">
            <div class="contract-title-row">
              <h3 id="output-requirements-title">Output requirements</h3>
              <span class="contract-status contract-status--required">Required</span>
            </div>
            <ul>
              ${e.output_requirements.requirements.map(i=>`<li>${h(i.text)}</li>`).join("")}
            </ul>
          </section>
          <details class="model-prompt-reference" data-testid="model-prompt-reference" ${this.state.referenceOpen?"open":""}>
            <summary>
              <span class="reference-summary-copy">
                <span class="contract-title-row">
                  <strong>Model prompt reference</strong>
                  <span class="contract-status contract-status--optional">Optional</span>
                </span>
                <small>Use this benchmark-aligned setup, or use your own generation method.</small>
              </span>
              <i class="drawer-chevron" data-lucide="chevron-down"></i>
            </summary>
            <div class="model-prompt-reference-body">
              <p class="reference-distinction">
                This is the model-runtime prompt reference. It is separate from the annotated case prompt and is not required for submission.
              </p>
              <div class="prompt-reference-meta">
                <span>Source <strong>cadbenchmark</strong></span>
                <span>Profile <strong>${h(t.prompt_variant)}</strong></span>
              </div>
              <section class="prompt-reference-block">
                <h4>System message</h4>
                <pre>${h(t.system_message)}</pre>
              </section>
              <section class="prompt-reference-block">
                <h4>User message template</h4>
                ${a}
                <pre>${h(t.user_message_template)}</pre>
              </section>
            </div>
          </details>
        </div>
      </section>
    `}renderUpload(){var l,c,p,u,m,v;const e=this.selectedCapability(),t=(e==null?void 0:e.accept.join(","))||((l=this.state.currentCase)==null?void 0:l.source_accept.join(","))||".scad",a=(e==null?void 0:e.max_bytes)||((c=this.state.currentCase)==null?void 0:c.source_max_bytes)||8*1024*1024,s=this.state.source,i=((p=this.state.snapshot)==null?void 0:p.state)==="validating"||((u=this.state.snapshot)==null?void 0:u.state)==="evaluating",o=!this.state.currentCase||this.state.caseLoading||this.state.submitting||i,n=(v=(m=this.transport).connectionState)==null?void 0:v.call(m),d=(n==null?void 0:n.available)!==!1;return`
      <section class="source-panel" aria-labelledby="source-title">
        <div class="section-heading">
          <div>
            <h2 id="source-title">Submit source</h2>
            <p class="section-meta">${h(t.split(",").join(" or "))} · up to ${P(a)}</p>
          </div>
        </div>

        <div class="upload-body">
          ${this.state.currentCase?`
                <div class="source-guidance" data-testid="source-guidance">
                  <i data-lucide="info"></i>
                  <div>
                    <strong>Upload the final source for UID <code>${h(this.state.currentCase.uid)}</code></strong>
                    <p>${h(Ze[this.state.format])}</p>
                  </div>
                </div>
              `:""}
          ${(n==null?void 0:n.available)===!1?`<p class="intake-note" role="status"><i data-lucide="alert-circle"></i>${h(n.message||"Evaluation intake is temporarily unavailable.")}</p>`:""}
          <label class="upload-drop ${o?"is-disabled":""}" data-testid="upload-drop">
            <input
              class="file-input"
              type="file"
              name="source"
              accept="${h(t)}"
              ${o?"disabled":""}
            />
            <i data-lucide="upload"></i>
            <span><b>Select source file</b><small>${h(t.split(",").join(" or "))}</small></span>
          </label>

          ${s?`
                <div class="selected-file" data-testid="selected-file">
                  <i data-lucide="file-code-2"></i>
                  <span><b>${h(s.name)}</b><small>${P(s.size)}</small></span>
                  <button class="icon-button" type="button" data-action="remove-file" aria-label="Remove selected file" title="Remove file">
                    <i data-lucide="x"></i>
                  </button>
                </div>
              `:""}

          ${this.state.sourceError?`<p id="source-error" class="field-error" role="alert" tabindex="-1"><i data-lucide="alert-circle"></i>${h(this.state.sourceError)}</p>`:""}
          ${this.state.evaluationError?`<p id="evaluation-error" class="field-error" role="alert" tabindex="-1"><i data-lucide="alert-circle"></i>${h(this.state.evaluationError)}</p>`:""}

          <button
            class="button button--primary evaluate-button${i?" is-running":""}"
            type="button"
            data-action="evaluate"
            ${!s||!d||o?"disabled":""}
          >
            <i class="${this.state.submitting||i?"loading-icon":""}" data-lucide="${this.state.submitting||i?"loader-circle":"play"}"></i>
            <span>${this.state.submitting?"Submitting":i?"Evaluation in progress":"Evaluate source"}</span>
          </button>
        </div>
      </section>
    `}renderResults(){var s,i;const e=((s=this.state.snapshot)==null?void 0:s.result)??R(),t=this.evaluationStatus(),a=this.isEvaluationActive();return`
      <section class="results-section" aria-labelledby="results-title" aria-live="polite" data-testid="results" tabindex="-1">
        <div class="results-heading">
          <div>
            <h2 id="results-title">Results</h2>
          </div>
          <span class="evaluation-state evaluation-state--${t.tone}">
            <i data-lucide="${t.icon}"></i>
            ${h(t.label)}
          </span>
        </div>
        ${(i=this.state.snapshot)!=null&&i.message&&this.state.snapshot.state!=="complete"&&this.state.snapshot.message!==e.message?`<div class="evaluation-message ${this.transport.kind==="fixture"?"is-fixture":""}">${h(this.state.snapshot.message)}</div>`:""}
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
    `}mountModelViewer(){var i;const e=this.root.querySelector("[data-model-viewer]"),t=(i=this.state.snapshot)==null?void 0:i.visualization;if(!e||!t)return;let a=!1,s;this.disposeModelViewer=()=>{a=!0,s==null||s()},this.createModelViewer(e,t,()=>a).then(o=>{a?o():s=o}).catch(()=>{if(a)return;const o=e.querySelector(".model-viewer-status");o&&(o.textContent="Model preview unavailable")})}async createModelViewer(e,t,a){var Y;const[s,{OrbitControls:i},{STLLoader:o}]=await Promise.all([j(()=>import("./three.module-BTt32e3U.js"),[]),j(()=>import("./OrbitControls-BSM_CLzo.js"),__vite__mapDeps([0,1])),j(()=>import("./STLLoader-DnLadrxH.js"),__vite__mapDeps([2,1]))]);if(a())return()=>{};const n=new s.Scene;n.background=new s.Color(16777215),n.fog=new s.Fog(16777215,6.8,12.2);const d=new s.PerspectiveCamera(38,1,.01,100);d.position.set(3.6,2.35,4.35);const l=new s.WebGLRenderer({antialias:!0,alpha:!1,preserveDrawingBuffer:!0});l.setPixelRatio(Math.min(window.devicePixelRatio,2)),l.setClearColor(16777215,1),l.outputColorSpace=s.SRGBColorSpace,l.toneMapping=s.ACESFilmicToneMapping,l.toneMappingExposure=1,l.shadowMap.enabled=!0,l.shadowMap.type=s.PCFSoftShadowMap,e.appendChild(l.domElement);const c=new i(d,l.domElement);c.enableDamping=!0,c.autoRotate=!window.matchMedia("(prefers-reduced-motion: reduce)").matches,c.autoRotateSpeed=1.2,c.enablePan=!1,c.minDistance=2.2,c.maxDistance=7.5,n.add(new s.HemisphereLight(16449532,12176066,1.95));const p=new s.DirectionalLight(16777215,2.65);p.position.set(3.8,4.8,3.5),p.castShadow=!0,p.shadow.mapSize.set(1024,1024),n.add(p);const u=new s.DirectionalLight(12053215,.86);u.position.set(-3.2,2.2,-2.6),n.add(u);const m=new s.DirectionalLight(13035007,.62);m.position.set(-2.4,3.4,3.4),n.add(m);const v={text2cad:{body:12573164,edge:3239058,shadow:5927810,rim:14282751},image2cad:{body:11918799,edge:3044708,shadow:5208172,rim:14284010},text_image2cad:{body:12574175,edge:4945280,shadow:5993595,rim:14808566}}[((Y=this.state.currentCase)==null?void 0:Y.task)??"text2cad"],f=new s.Mesh(new s.PlaneGeometry(6,4),new s.ShadowMaterial({color:v.shadow,opacity:.09}));f.rotation.x=-Math.PI/2,f.position.y=-1.06,f.receiveShadow=!0,n.add(f);const w=new s.Group;w.rotation.x=-Math.PI/2,n.add(w);const g=e.querySelector(".model-viewer-status");let T=!1,G=0,I=null,C=null,x=null,A=null;new o().load(t.url,y=>{var W;if(T){y.dispose();return}y.computeVertexNormals(),y.computeBoundingBox(),y.center();const $=new s.Vector3;(W=y.boundingBox)==null||W.getSize($);const N=Math.max($.x,$.y,$.z)||1;y.scale(2.32/N,2.32/N,2.32/N),I=y,C=new s.MeshPhysicalMaterial({color:v.body,roughness:.58,metalness:.02,clearcoat:.1,clearcoatRoughness:.68,emissive:v.rim,emissiveIntensity:.006});const U=new s.Mesh(y,C);U.castShadow=!0,U.receiveShadow=!0,w.add(U),x=new s.EdgesGeometry(y,28),A=new s.LineBasicMaterial({color:v.edge,transparent:!0,opacity:.24}),w.add(new s.LineSegments(x,A)),g==null||g.remove()},void 0,()=>{g&&(g.classList.remove("is-loading"),g.textContent="Model preview unavailable")});const H=()=>{const y=Math.max(280,e.clientWidth),$=Math.max(300,e.clientHeight);l.setSize(y,$,!1),d.aspect=y/$,d.updateProjectionMatrix()},J=new ResizeObserver(H);J.observe(e),H();const K=()=>{G=requestAnimationFrame(K),c.update(),l.render(n,d)};return K(),()=>{T=!0,cancelAnimationFrame(G),J.disconnect(),c.dispose(),I==null||I.dispose(),C==null||C.dispose(),x==null||x.dispose(),A==null||A.dispose(),f.geometry.dispose(),f.material.dispose(),l.dispose(),l.domElement.remove()}}renderMetricResults(e){const t=e.metrics.find(i=>i.bucket==="Valid"),a=["Geometry","Topology","Part"].flatMap(i=>{const o=e.metrics.filter(n=>n.bucket===i);return o.length?[`
        <section class="metric-bucket" aria-labelledby="metric-bucket-${i.toLowerCase()}">
          <h4 id="metric-bucket-${i.toLowerCase()}">${i}</h4>
          <dl class="metric-list">
            ${o.map(n=>`
              <div>
                <dt>${h(n.label)}</dt>
                <dd>${h(String(n.value))}${n.unit?` <small>${h(n.unit)}</small>`:""}</dd>
              </div>
            `).join("")}
          </dl>
        </section>
      `]:[]}).join(""),s=e.metrics.length?`
          <div class="paper-metrics">
            ${t?`
              <div class="valid-result">
                <span>Valid</span>
                <strong>${h(String(t.value))}</strong>
              </div>
            `:""}
            ${a}
          </div>
        `:`<p class="no-metrics">${h(e.message||(e.state==="not_started"?"Metrics will appear after evaluation.":Xe[e.state]))}</p>`;return`
      <div class="metric-results metric-results--${e.state}">
        <div class="metric-results-heading">
          <h3>Metrics</h3>
        </div>
        ${s}
      </div>
    `}renderEvaluationProgress(){var o;const e=(o=this.state.snapshot)==null?void 0:o.state;if(!this.isEvaluationActive())return"";const t=this.state.submitting?0:e==="validating"?1:2,a=["Uploading source","Preparing evaluation","Computing P3D metrics"],s=this.elapsedSeconds(),i=s>60?"Taking longer than usual. You can keep this tab open.":"Typical single-case time: 30-60 seconds";return`
      <div class="evaluation-progress" data-testid="evaluation-progress" role="status" aria-live="polite" aria-busy="true">
        <span class="evaluation-progress-spinner" aria-hidden="true">
          <i class="loading-icon" data-lucide="loader-circle"></i>
        </span>
        <div class="evaluation-progress-copy">
          <div class="evaluation-progress-heading">
            <strong>${a[t]}</strong>
            <time data-evaluation-elapsed>${s}s elapsed</time>
          </div>
          <span>${i}</span>
        </div>
      </div>
    `}renderProvenance(){var a;const e=(a=this.state.snapshot)==null?void 0:a.provenance,t=[["Evaluated with",(e==null?void 0:e.evaluator)||"Not reported"],["Submitted file",e?`${e.source_name} · ${P(e.source_bytes)}`:this.state.source?`${this.state.source.name} · ${P(this.state.source.size)}`:"Not submitted"],["Submitted",e!=null&&e.submitted_at?et(e.submitted_at):"Not submitted"],...e!=null&&e.public_reference?[["Result ID",tt(e.public_reference)]]:[],["Data use",st(e==null?void 0:e.retention)]];return`
      <details class="provenance-drawer" data-testid="provenance" ${this.state.provenanceOpen?"open":""}>
        <summary>
          <span>About this result</span>
          <i class="drawer-chevron" data-lucide="chevron-down"></i>
        </summary>
        <dl>
          ${t.map(([s,i])=>`
                <div>
                  <dt>${h(s)}</dt>
                  <dd class="${s==="Result ID"?"is-code":""}">${h(i)}</dd>
                </div>
              `).join("")}
        </dl>
      </details>
    `}bindEvents(){var n,d,l;this.root.querySelectorAll("[data-task]").forEach(c=>{c.addEventListener("click",()=>{this.selectTask(c.dataset.task)})});const e=this.root.querySelector("[role='tablist']");e==null||e.addEventListener("keydown",c=>this.handleTabKeys(c)),this.root.querySelectorAll("input[name='format']").forEach(c=>{c.addEventListener("change",()=>{this.selectFormat(c.value)})}),this.root.querySelectorAll("input[name='text-mode']").forEach(c=>{c.addEventListener("change",()=>{this.selectTextMode(c.value)})});const t=this.root.querySelector(".case-search");t==null||t.addEventListener("submit",c=>{c.preventDefault();const p=t.elements.namedItem("uid");this.loadExactCase((p==null?void 0:p.value)??"")}),(n=this.root.querySelector("[data-action='random']"))==null||n.addEventListener("click",()=>{this.loadRandomCase()});const a=this.root.querySelector(".file-input");a==null||a.addEventListener("change",()=>{this.acceptFiles(a.files)});const s=this.root.querySelector(".upload-drop");s==null||s.addEventListener("dragover",c=>{c.preventDefault(),s.classList.contains("is-disabled")||s.classList.add("is-dragging")}),s==null||s.addEventListener("dragleave",()=>s.classList.remove("is-dragging")),s==null||s.addEventListener("drop",c=>{var p;c.preventDefault(),s.classList.remove("is-dragging"),s.classList.contains("is-disabled")||this.acceptFiles(((p=c.dataTransfer)==null?void 0:p.files)??null)}),(d=this.root.querySelector("[data-action='remove-file']"))==null||d.addEventListener("click",()=>{this.state.source=void 0,this.state.sourceError=void 0,this.clearEvaluation(),this.render()}),(l=this.root.querySelector("[data-action='evaluate']"))==null||l.addEventListener("click",()=>{this.evaluate()});const i=this.root.querySelector(".provenance-drawer");i==null||i.addEventListener("toggle",()=>{this.state.provenanceOpen=i.open});const o=this.root.querySelector(".model-prompt-reference");o==null||o.addEventListener("toggle",()=>{this.state.referenceOpen=o.open})}handleTabKeys(e){if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.preventDefault();const a=S.findIndex(o=>o.id===this.state.task);let s=a;e.key==="ArrowRight"&&(s=(a+1)%S.length),e.key==="ArrowLeft"&&(s=(a-1+S.length)%S.length),e.key==="Home"&&(s=0),e.key==="End"&&(s=S.length-1);const i=S[s].id;this.selectTask(i,!0)}async selectTask(e,t=!1){var a;e!==this.state.task&&(this.caseRequest+=1,this.clearEvaluation(),this.state.task=e,this.state.textMode="descriptive",this.state.source=void 0,this.state.sourceError=void 0,this.state.caseError=void 0,this.state.searchValue="",this.ensureAvailableFormat(),await this.loadRandomCase(),t&&((a=this.root.querySelector(`[data-task='${e}']`))==null||a.focus()))}async selectFormat(e){e!==this.state.format&&(this.clearEvaluation(),this.state.format=e,this.state.source=void 0,await this.reloadCurrentCase())}async selectTextMode(e){e!==this.state.textMode&&(this.clearEvaluation(),this.state.textMode=e,this.state.source=void 0,await this.reloadCurrentCase())}async reloadCurrentCase(){var e;(e=this.state.currentCase)!=null&&e.uid?await this.loadExactCase(this.state.currentCase.uid):await this.loadRandomCase()}async loadExactCase(e){const t=e.trim();if(!t){this.state.caseError="Enter a complete UID.",this.render(),this.focusAlert("#case-error");return}await this.loadCase(()=>this.transport.resolveExactCase({...this.caseQuery(),uid:t}))}async loadRandomCase(){await this.loadCase(()=>this.transport.getRandomCase(this.caseQuery()))}async loadCase(e){const t=++this.caseRequest,a=this.state.currentCase;this.state.caseLoading=!0,this.state.caseError=void 0,this.render();try{const s=await e();if(t!==this.caseRequest)return;this.clearEvaluation(),this.state.currentCase=s,this.state.searchValue=s.uid,this.state.source=void 0,this.state.sourceError=void 0}catch(s){if(t!==this.caseRequest)return;this.state.currentCase=a,this.state.caseError=this.errorMessage(s)}finally{t===this.caseRequest&&(this.state.caseLoading=!1,this.render(),this.state.caseError&&this.focusAlert("#case-error"))}}acceptFiles(e){var n,d;if(this.state.sourceError=void 0,this.state.evaluationError=void 0,!e||e.length!==1){this.state.source=void 0,this.state.sourceError="Select exactly one source file.",this.render(),this.focusAlert("#source-error");return}const t=e[0],a=this.selectedCapability(),s=(a==null?void 0:a.accept)??((n=this.state.currentCase)==null?void 0:n.source_accept)??[],i=(a==null?void 0:a.max_bytes)??((d=this.state.currentCase)==null?void 0:d.source_max_bytes)??0,o=t.name.toLowerCase();s.some(l=>o.endsWith(l.toLowerCase()))?t.size===0?(this.state.source=void 0,this.state.sourceError="The source file is empty."):t.size>i?(this.state.source=void 0,this.state.sourceError=`The source file exceeds ${P(i)}.`):(this.clearEvaluation(),this.state.source=t):(this.state.source=void 0,this.state.sourceError=`Use a ${s.join(" or ")} source file.`),this.render(),this.state.sourceError?this.focusAlert("#source-error"):window.requestAnimationFrame(()=>{var l;(l=this.root.querySelector("[data-action='evaluate']"))==null||l.focus({preventScroll:!0})})}async evaluate(){if(!(!this.state.currentCase||!this.state.source||this.state.submitting)){this.state.submitting=!0,this.state.evaluationStartedAt=Date.now(),this.state.evaluationError=void 0,this.startProgressTicker(),this.render();try{const e=await this.transport.submitEvaluation({case:this.state.currentCase,source:this.state.source});this.state.snapshot=e,(this.transport.kind==="api"||this.transport.kind==="gateway")&&!this.isTerminal(e)&&this.schedulePoll()}catch(e){this.state.evaluationError=this.errorMessage(e),this.stopProgressTicker()}finally{this.state.submitting=!1,this.state.snapshot&&this.isTerminal(this.state.snapshot)&&this.stopProgressTicker(),this.render(),this.state.evaluationError?this.focusAlert("#evaluation-error"):this.state.snapshot&&window.requestAnimationFrame(()=>{var e;(e=this.root.querySelector(".results-section"))==null||e.focus({preventScroll:!0})})}}}schedulePoll(e=1e3){window.clearTimeout(this.pollTimer),this.pollTimer=window.setTimeout(()=>void this.poll(),e)}async poll(){var t;const e=(t=this.state.snapshot)==null?void 0:t.evaluation_ref;if(e)try{const a=await this.transport.getEvaluation(e);this.pollFailureCount=0,this.state.evaluationError=void 0,this.state.snapshot=a,this.isTerminal(a)&&this.stopProgressTicker(),this.render(),this.isTerminal(a)||this.schedulePoll()}catch(a){if(Oe(a)&&this.state.snapshot){this.pollFailureCount+=1;const s=Math.min(8,2**Math.min(this.pollFailureCount-1,3));this.state.evaluationError=void 0,this.state.snapshot={...this.state.snapshot,message:`The evaluation connection was interrupted. Retrying in ${s} second${s===1?"":"s"}.`},this.render(),this.schedulePoll(s*1e3);return}this.state.evaluationError=this.errorMessage(a),this.render()}}isTerminal(e){return e.state==="complete"||e.state==="failed"}isEvaluationActive(){var t;const e=(t=this.state.snapshot)==null?void 0:t.state;return this.state.submitting||e==="validating"||e==="evaluating"}elapsedSeconds(){return Math.max(0,Math.floor((Date.now()-(this.state.evaluationStartedAt??Date.now()))/1e3))}clearEvaluation(){var t,a,s;window.clearTimeout(this.pollTimer),this.pollTimer=void 0,this.stopProgressTicker(),this.pollFailureCount=0;const e=(t=this.state.snapshot)==null?void 0:t.evaluation_ref;e&&((s=(a=this.transport).releaseEvaluation)==null||s.call(a,e)),this.state.snapshot=void 0,this.state.evaluationStartedAt=void 0,this.state.evaluationError=void 0}startProgressTicker(){this.stopProgressTicker(),this.progressTimer=window.setInterval(()=>{if(!this.isEvaluationActive()){this.stopProgressTicker();return}const e=this.root.querySelector("[data-evaluation-elapsed]");e&&(e.textContent=`${this.elapsedSeconds()}s elapsed`)},1e3)}stopProgressTicker(){window.clearInterval(this.progressTimer),this.progressTimer=void 0}caseQuery(){return{task:this.state.task,format:this.state.format,...this.state.task==="text2cad"?{text_mode:this.state.textMode}:{}}}getFormatCapabilities(){var e,t;return((t=(e=this.state.capabilities)==null?void 0:e.tasks.find(a=>a.task===this.state.task))==null?void 0:t.formats)??[]}selectedCapability(){return this.getFormatCapabilities().find(e=>e.id===this.state.format)}ensureAvailableFormat(){var t;const e=this.getFormatCapabilities().filter(a=>a.status==="available");e.some(a=>a.id===this.state.format)||(this.state.format=((t=e[0])==null?void 0:t.id)??"openscad")}evaluationStatus(){var t;if(this.state.submitting)return{label:"Submitting",icon:"circle",tone:"active"};const e=(t=this.state.snapshot)==null?void 0:t.state;return e==="validating"||e==="evaluating"?{label:e==="validating"?"Validating":"Evaluating",icon:"circle",tone:"active"}:e==="complete"?{label:"Complete",icon:"check",tone:"success"}:e==="failed"?{label:"Failed",icon:"alert-circle",tone:"danger"}:{label:"Awaiting submission",icon:"circle",tone:"idle"}}focusAlert(e){window.requestAnimationFrame(()=>{var t;(t=this.root.querySelector(e))==null||t.focus()})}errorMessage(e){return e instanceof Error?e.message:"The request could not be completed."}}const oe=document.querySelector("#app");if(!oe)throw new Error("Application root is missing.");async function it(r){r.innerHTML=`
    <main class="boot-screen" aria-busy="true">
      <i class="loading-icon" data-lucide="loader-circle"></i>
      <span>Loading evaluation tool</span>
    </main>
  `,te({icons:re,attrs:{"aria-hidden":"true","stroke-width":"1.8"}});const e=await Qe();await new at(r,e).start()}it(oe);
