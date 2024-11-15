"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[2076],{9691:(y,f,i)=>{i.d(f,{c:()=>c});var e=i(9230),o=i(1086),l=i(8607);const c=(s,r)=>{let t,n;const g=(u,p,E)=>{if(typeof document>"u")return;const w=document.elementFromPoint(u,p);w&&r(w)&&!w.disabled?w!==t&&(a(),d(w,E)):a()},d=(u,p)=>{t=u,n||(n=t);const E=t;(0,e.w)(()=>E.classList.add("ion-activated")),p()},a=(u=!1)=>{if(!t)return;const p=t;(0,e.w)(()=>p.classList.remove("ion-activated")),u&&n!==t&&t.click(),t=void 0};return(0,l.createGesture)({el:s,gestureName:"buttonActiveDrag",threshold:0,onStart:u=>g(u.currentX,u.currentY,o.a),onMove:u=>g(u.currentX,u.currentY,o.b),onEnd:()=>{a(!0),(0,o.h)(),n=void 0}})}},8438:(y,f,i)=>{i.d(f,{g:()=>o});var e=i(8476);const o=()=>{if(void 0!==e.w)return e.w.Capacitor}},5572:(y,f,i)=>{i.d(f,{c:()=>e,i:()=>o});const e=(l,c,s)=>"function"==typeof s?s(l,c):"string"==typeof s?l[s]===c[s]:Array.isArray(c)?c.includes(l):l===c,o=(l,c,s)=>void 0!==l&&(Array.isArray(l)?l.some(r=>e(r,c,s)):e(l,c,s))},3351:(y,f,i)=>{i.d(f,{g:()=>e});const e=(r,t,n,g,d)=>l(r[1],t[1],n[1],g[1],d).map(a=>o(r[0],t[0],n[0],g[0],a)),o=(r,t,n,g,d)=>d*(3*t*Math.pow(d-1,2)+d*(-3*n*d+3*n+g*d))-r*Math.pow(d-1,3),l=(r,t,n,g,d)=>s((g-=d)-3*(n-=d)+3*(t-=d)-(r-=d),3*n-6*t+3*r,3*t-3*r,r).filter(u=>u>=0&&u<=1),s=(r,t,n,g)=>{if(0===r)return((r,t,n)=>{const g=t*t-4*r*n;return g<0?[]:[(-t+Math.sqrt(g))/(2*r),(-t-Math.sqrt(g))/(2*r)]})(t,n,g);const d=(3*(n/=r)-(t/=r)*t)/3,a=(2*t*t*t-9*t*n+27*(g/=r))/27;if(0===d)return[Math.pow(-a,1/3)];if(0===a)return[Math.sqrt(-d),-Math.sqrt(-d)];const u=Math.pow(a/2,2)+Math.pow(d/3,3);if(0===u)return[Math.pow(a/2,.5)-t/3];if(u>0)return[Math.pow(-a/2+Math.sqrt(u),1/3)-Math.pow(a/2+Math.sqrt(u),1/3)-t/3];const p=Math.sqrt(Math.pow(-d/3,3)),E=Math.acos(-a/(2*Math.sqrt(Math.pow(-d/3,3)))),w=2*Math.pow(p,1/3);return[w*Math.cos(E/3)-t/3,w*Math.cos((E+2*Math.PI)/3)-t/3,w*Math.cos((E+4*Math.PI)/3)-t/3]}},5083:(y,f,i)=>{i.d(f,{i:()=>e});const e=o=>o&&""!==o.dir?"rtl"===o.dir.toLowerCase():"rtl"===(null==document?void 0:document.dir.toLowerCase())},3126:(y,f,i)=>{i.r(f),i.d(f,{startFocusVisible:()=>c});const e="ion-focused",l=["Tab","ArrowDown","Space","Escape"," ","Shift","Enter","ArrowLeft","ArrowRight","ArrowUp","Home","End"],c=s=>{let r=[],t=!0;const n=s?s.shadowRoot:document,g=s||document.body,d=M=>{r.forEach(_=>_.classList.remove(e)),M.forEach(_=>_.classList.add(e)),r=M},a=()=>{t=!1,d([])},u=M=>{t=l.includes(M.key),t||d([])},p=M=>{if(t&&void 0!==M.composedPath){const _=M.composedPath().filter(m=>!!m.classList&&m.classList.contains("ion-focusable"));d(_)}},E=()=>{n.activeElement===g&&d([])};return n.addEventListener("keydown",u),n.addEventListener("focusin",p),n.addEventListener("focusout",E),n.addEventListener("touchstart",a,{passive:!0}),n.addEventListener("mousedown",a),{destroy:()=>{n.removeEventListener("keydown",u),n.removeEventListener("focusin",p),n.removeEventListener("focusout",E),n.removeEventListener("touchstart",a),n.removeEventListener("mousedown",a)},setFocus:d}}},1086:(y,f,i)=>{i.d(f,{I:()=>o,a:()=>t,b:()=>n,c:()=>r,d:()=>d,h:()=>g});var e=i(8438),o=function(a){return a.Heavy="HEAVY",a.Medium="MEDIUM",a.Light="LIGHT",a}(o||{});const c={getEngine(){const a=(0,e.g)();if(null!=a&&a.isPluginAvailable("Haptics"))return a.Plugins.Haptics},available(){if(!this.getEngine())return!1;const u=(0,e.g)();return"web"!==(null==u?void 0:u.getPlatform())||typeof navigator<"u"&&void 0!==navigator.vibrate},impact(a){const u=this.getEngine();u&&u.impact({style:a.style})},notification(a){const u=this.getEngine();u&&u.notification({type:a.type})},selection(){this.impact({style:o.Light})},selectionStart(){const a=this.getEngine();a&&a.selectionStart()},selectionChanged(){const a=this.getEngine();a&&a.selectionChanged()},selectionEnd(){const a=this.getEngine();a&&a.selectionEnd()}},s=()=>c.available(),r=()=>{s()&&c.selection()},t=()=>{s()&&c.selectionStart()},n=()=>{s()&&c.selectionChanged()},g=()=>{s()&&c.selectionEnd()},d=a=>{s()&&c.impact(a)}},909:(y,f,i)=>{i.d(f,{I:()=>r,a:()=>d,b:()=>s,c:()=>p,d:()=>w,f:()=>a,g:()=>g,i:()=>n,p:()=>E,r:()=>M,s:()=>u});var e=i(467),o=i(4920),l=i(4929);const s="ion-content",r=".ion-content-scroll-host",t=`${s}, ${r}`,n=_=>"ION-CONTENT"===_.tagName,g=function(){var _=(0,e.A)(function*(m){return n(m)?(yield new Promise(h=>(0,o.c)(m,h)),m.getScrollElement()):m});return function(h){return _.apply(this,arguments)}}(),d=_=>_.querySelector(r)||_.querySelector(t),a=_=>_.closest(t),u=(_,m)=>n(_)?_.scrollToTop(m):Promise.resolve(_.scrollTo({top:0,left:0,behavior:m>0?"smooth":"auto"})),p=(_,m,h,P)=>n(_)?_.scrollByPoint(m,h,P):Promise.resolve(_.scrollBy({top:h,left:m,behavior:P>0?"smooth":"auto"})),E=_=>(0,l.b)(_,s),w=_=>{if(n(_)){const h=_.scrollY;return _.scrollY=!1,h}return _.style.setProperty("overflow","hidden"),!0},M=(_,m)=>{n(_)?_.scrollY=m:_.style.removeProperty("overflow")}},3992:(y,f,i)=>{i.d(f,{a:()=>e,b:()=>p,c:()=>t,d:()=>E,e:()=>k,f:()=>r,g:()=>w,h:()=>l,i:()=>o,j:()=>v,k:()=>C,l:()=>n,m:()=>a,n:()=>M,o:()=>d,p:()=>s,q:()=>c,r:()=>O,s:()=>b,t:()=>u,u:()=>h,v:()=>P,w:()=>g,x:()=>_,y:()=>m});const e="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='square' stroke-miterlimit='10' stroke-width='48' d='M244 400L100 256l144-144M120 256h292' class='ionicon-fill-none'/></svg>",o="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M112 268l144 144 144-144M256 392V100' class='ionicon-fill-none'/></svg>",l="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M368 64L144 256l224 192V64z'/></svg>",c="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M64 144l192 224 192-224H64z'/></svg>",s="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M448 368L256 144 64 368h384z'/></svg>",r="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M416 128L192 384l-96-96' class='ionicon-fill-none ionicon-stroke-width'/></svg>",t="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M328 112L184 256l144 144' class='ionicon-fill-none'/></svg>",n="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M112 184l144 144 144-144' class='ionicon-fill-none'/></svg>",g="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M136 208l120-104 120 104M136 304l120 104 120-104' stroke-width='48' stroke-linecap='round' stroke-linejoin='round' class='ionicon-fill-none'/></svg>",d="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M184 112l144 144-144 144' class='ionicon-fill-none'/></svg>",a="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M184 112l144 144-144 144' class='ionicon-fill-none'/></svg>",u="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z'/></svg>",p="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 11-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 01-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0122.62-22.62L256 233.37l52.69-52.68a16 16 0 0122.62 22.62L278.63 256z'/></svg>",E="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M400 145.49L366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49z'/></svg>",w="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><circle cx='256' cy='256' r='192' stroke-linecap='round' stroke-linejoin='round' class='ionicon-fill-none ionicon-stroke-width'/></svg>",M="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><circle cx='256' cy='256' r='48'/><circle cx='416' cy='256' r='48'/><circle cx='96' cy='256' r='48'/></svg>",_="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><circle cx='256' cy='256' r='64'/><path d='M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72 38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 00-.1-34.76zM256 352a96 96 0 1196-96 96.11 96.11 0 01-96 96z'/></svg>",m="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM248 315.85l-51.79-51.79a2 2 0 00-3.39 1.69 64.11 64.11 0 0053.49 53.49 2 2 0 001.69-3.39zM264 196.15L315.87 248a2 2 0 003.4-1.69 64.13 64.13 0 00-53.55-53.55 2 2 0 00-1.72 3.39z'/><path d='M491 273.36a32.2 32.2 0 00-.1-34.76c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.68 96a226.54 226.54 0 00-71.82 11.79 4 4 0 00-1.56 6.63l47.24 47.24a4 4 0 003.82 1.05 96 96 0 01116 116 4 4 0 001.05 3.81l67.95 68a4 4 0 005.4.24 343.81 343.81 0 0067.24-77.4zM256 352a96 96 0 01-93.3-118.63 4 4 0 00-1.05-3.81l-66.84-66.87a4 4 0 00-5.41-.23c-24.39 20.81-47 46.13-67.67 75.72a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.39 76.14 98.28 100.65C162.06 402 207.92 416 255.68 416a238.22 238.22 0 0072.64-11.55 4 4 0 001.61-6.64l-47.47-47.46a4 4 0 00-3.81-1.05A96 96 0 01256 352z'/></svg>",h="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-miterlimit='10' d='M80 160h352M80 256h352M80 352h352' class='ionicon-fill-none ionicon-stroke-width'/></svg>",P="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M64 384h384v-42.67H64zm0-106.67h384v-42.66H64zM64 128v42.67h384V128z'/></svg>",O="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M400 256H112' class='ionicon-fill-none ionicon-stroke-width'/></svg>",v="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M96 256h320M96 176h320M96 336h320' class='ionicon-fill-none ionicon-stroke-width'/></svg>",C="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='square' stroke-linejoin='round' stroke-width='44' d='M118 304h276M118 208h276' class='ionicon-fill-none'/></svg>",b="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z' stroke-miterlimit='10' class='ionicon-fill-none ionicon-stroke-width'/><path stroke-linecap='round' stroke-miterlimit='10' d='M338.29 338.29L448 448' class='ionicon-fill-none ionicon-stroke-width'/></svg>",k="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M464 428L339.92 303.9a160.48 160.48 0 0030.72-94.58C370.64 120.37 298.27 48 209.32 48S48 120.37 48 209.32s72.37 161.32 161.32 161.32a160.48 160.48 0 0094.58-30.72L428 464zM209.32 319.69a110.38 110.38 0 11110.37-110.37 110.5 110.5 0 01-110.37 110.37z'/></svg>"},243:(y,f,i)=>{i.d(f,{c:()=>c,g:()=>s});var e=i(8476),o=i(4920),l=i(4929);const c=(t,n,g)=>{let d,a;if(void 0!==e.w&&"MutationObserver"in e.w){const w=Array.isArray(n)?n:[n];d=new MutationObserver(M=>{for(const _ of M)for(const m of _.addedNodes)if(m.nodeType===Node.ELEMENT_NODE&&w.includes(m.slot))return g(),void(0,o.r)(()=>u(m))}),d.observe(t,{childList:!0,subtree:!0})}const u=w=>{var M;a&&(a.disconnect(),a=void 0),a=new MutationObserver(_=>{g();for(const m of _)for(const h of m.removedNodes)h.nodeType===Node.ELEMENT_NODE&&h.slot===n&&E()}),a.observe(null!==(M=w.parentElement)&&void 0!==M?M:w,{subtree:!0,childList:!0})},E=()=>{a&&(a.disconnect(),a=void 0)};return{destroy:()=>{d&&(d.disconnect(),d=void 0),E()}}},s=(t,n,g)=>{const d=null==t?0:t.toString().length,a=r(d,n);if(void 0===g)return a;try{return g(d,n)}catch(u){return(0,l.a)("Exception in provided `counterFormatter`.",u),a}},r=(t,n)=>`${t} / ${n}`},1622:(y,f,i)=>{i.r(f),i.d(f,{KEYBOARD_DID_CLOSE:()=>s,KEYBOARD_DID_OPEN:()=>c,copyVisualViewport:()=>O,keyboardDidClose:()=>_,keyboardDidOpen:()=>w,keyboardDidResize:()=>M,resetKeyboardAssist:()=>d,setKeyboardClose:()=>E,setKeyboardOpen:()=>p,startKeyboardAssist:()=>a,trackViewportChanges:()=>P});var e=i(4379);i(8438),i(8476);const c="ionKeyboardDidShow",s="ionKeyboardDidHide";let t={},n={},g=!1;const d=()=>{t={},n={},g=!1},a=v=>{if(e.K.getEngine())u(v);else{if(!v.visualViewport)return;n=O(v.visualViewport),v.visualViewport.onresize=()=>{P(v),w()||M(v)?p(v):_(v)&&E(v)}}},u=v=>{v.addEventListener("keyboardDidShow",C=>p(v,C)),v.addEventListener("keyboardDidHide",()=>E(v))},p=(v,C)=>{m(v,C),g=!0},E=v=>{h(v),g=!1},w=()=>!g&&t.width===n.width&&(t.height-n.height)*n.scale>150,M=v=>g&&!_(v),_=v=>g&&n.height===v.innerHeight,m=(v,C)=>{const k=new CustomEvent(c,{detail:{keyboardHeight:C?C.keyboardHeight:v.innerHeight-n.height}});v.dispatchEvent(k)},h=v=>{const C=new CustomEvent(s);v.dispatchEvent(C)},P=v=>{t=Object.assign({},n),n=O(v.visualViewport)},O=v=>({width:Math.round(v.width),height:Math.round(v.height),offsetTop:v.offsetTop,offsetLeft:v.offsetLeft,pageTop:v.pageTop,pageLeft:v.pageLeft,scale:v.scale})},4379:(y,f,i)=>{i.d(f,{K:()=>c,a:()=>l});var e=i(8438),o=function(s){return s.Unimplemented="UNIMPLEMENTED",s.Unavailable="UNAVAILABLE",s}(o||{}),l=function(s){return s.Body="body",s.Ionic="ionic",s.Native="native",s.None="none",s}(l||{});const c={getEngine(){const s=(0,e.g)();if(null!=s&&s.isPluginAvailable("Keyboard"))return s.Plugins.Keyboard},getResizeMode(){const s=this.getEngine();return null!=s&&s.getResizeMode?s.getResizeMode().catch(r=>{if(r.code!==o.Unimplemented)throw r}):Promise.resolve(void 0)}}},4731:(y,f,i)=>{i.d(f,{c:()=>r});var e=i(467),o=i(8476),l=i(4379);const c=t=>{if(void 0===o.d||t===l.a.None||void 0===t)return null;const n=o.d.querySelector("ion-app");return null!=n?n:o.d.body},s=t=>{const n=c(t);return null===n?0:n.clientHeight},r=function(){var t=(0,e.A)(function*(n){let g,d,a,u;const p=function(){var m=(0,e.A)(function*(){const h=yield l.K.getResizeMode(),P=void 0===h?void 0:h.mode;g=()=>{void 0===u&&(u=s(P)),a=!0,E(a,P)},d=()=>{a=!1,E(a,P)},null==o.w||o.w.addEventListener("keyboardWillShow",g),null==o.w||o.w.addEventListener("keyboardWillHide",d)});return function(){return m.apply(this,arguments)}}(),E=(m,h)=>{n&&n(m,w(h))},w=m=>{if(0===u||u===s(m))return;const h=c(m);return null!==h?new Promise(P=>{const v=new ResizeObserver(()=>{h.clientHeight===u&&(v.disconnect(),P())});v.observe(h)}):void 0};return yield p(),{init:p,destroy:()=>{null==o.w||o.w.removeEventListener("keyboardWillShow",g),null==o.w||o.w.removeEventListener("keyboardWillHide",d),g=d=void 0},isKeyboardVisible:()=>a}});return function(g){return t.apply(this,arguments)}}()},7838:(y,f,i)=>{i.d(f,{c:()=>o});var e=i(467);const o=()=>{let l;return{lock:function(){var s=(0,e.A)(function*(){const r=l;let t;return l=new Promise(n=>t=n),void 0!==r&&(yield r),t});return function(){return s.apply(this,arguments)}}()}}},9001:(y,f,i)=>{i.d(f,{c:()=>l});var e=i(8476),o=i(4920);const l=(c,s,r)=>{let t;const n=()=>!(void 0===s()||void 0!==c.label||null===r()),d=()=>{const u=s();if(void 0===u)return;if(!n())return void u.style.removeProperty("width");const p=r().scrollWidth;if(0===p&&null===u.offsetParent&&void 0!==e.w&&"IntersectionObserver"in e.w){if(void 0!==t)return;const E=t=new IntersectionObserver(w=>{1===w[0].intersectionRatio&&(d(),E.disconnect(),t=void 0)},{threshold:.01,root:c});E.observe(u)}else u.style.setProperty("width",.75*p+"px")};return{calculateNotchWidth:()=>{n()&&(0,o.r)(()=>{d()})},destroy:()=>{t&&(t.disconnect(),t=void 0)}}}},7895:(y,f,i)=>{i.d(f,{S:()=>o});const o={bubbles:{dur:1e3,circles:9,fn:(l,c,s)=>{const r=l*c/s-l+"ms",t=2*Math.PI*c/s;return{r:5,style:{top:32*Math.sin(t)+"%",left:32*Math.cos(t)+"%","animation-delay":r}}}},circles:{dur:1e3,circles:8,fn:(l,c,s)=>{const r=c/s,t=l*r-l+"ms",n=2*Math.PI*r;return{r:5,style:{top:32*Math.sin(n)+"%",left:32*Math.cos(n)+"%","animation-delay":t}}}},circular:{dur:1400,elmDuration:!0,circles:1,fn:()=>({r:20,cx:48,cy:48,fill:"none",viewBox:"24 24 48 48",transform:"translate(0,0)",style:{}})},crescent:{dur:750,circles:1,fn:()=>({r:26,style:{}})},dots:{dur:750,circles:3,fn:(l,c)=>({r:6,style:{left:32-32*c+"%","animation-delay":-110*c+"ms"}})},lines:{dur:1e3,lines:8,fn:(l,c,s)=>({y1:14,y2:26,style:{transform:`rotate(${360/s*c+(c<s/2?180:-180)}deg)`,"animation-delay":l*c/s-l+"ms"}})},"lines-small":{dur:1e3,lines:8,fn:(l,c,s)=>({y1:12,y2:20,style:{transform:`rotate(${360/s*c+(c<s/2?180:-180)}deg)`,"animation-delay":l*c/s-l+"ms"}})},"lines-sharp":{dur:1e3,lines:12,fn:(l,c,s)=>({y1:17,y2:29,style:{transform:`rotate(${30*c+(c<6?180:-180)}deg)`,"animation-delay":l*c/s-l+"ms"}})},"lines-sharp-small":{dur:1e3,lines:12,fn:(l,c,s)=>({y1:12,y2:20,style:{transform:`rotate(${30*c+(c<6?180:-180)}deg)`,"animation-delay":l*c/s-l+"ms"}})}}},7166:(y,f,i)=>{i.r(f),i.d(f,{createSwipeBackGesture:()=>s});var e=i(4920),o=i(5083),l=i(8607);i(1970);const s=(r,t,n,g,d)=>{const a=r.ownerDocument.defaultView;let u=(0,o.i)(r);const E=h=>u?-h.deltaX:h.deltaX;return(0,l.createGesture)({el:r,gestureName:"goback-swipe",gesturePriority:101,threshold:10,canStart:h=>(u=(0,o.i)(r),(h=>{const{startX:O}=h;return u?O>=a.innerWidth-50:O<=50})(h)&&t()),onStart:n,onMove:h=>{const O=E(h)/a.innerWidth;g(O)},onEnd:h=>{const P=E(h),O=a.innerWidth,v=P/O,C=(h=>u?-h.velocityX:h.velocityX)(h),k=C>=0&&(C>.2||P>O/2),D=(k?1-v:v)*O;let L=0;if(D>5){const A=D/Math.abs(C);L=Math.min(A,540)}d(k,v<=0?.01:(0,e.j)(0,v,.9999),L)}})}},2935:(y,f,i)=>{i.d(f,{w:()=>e});const e=(c,s,r)=>{if(typeof MutationObserver>"u")return;const t=new MutationObserver(n=>{r(o(n,s))});return t.observe(c,{childList:!0,subtree:!0}),t},o=(c,s)=>{let r;return c.forEach(t=>{for(let n=0;n<t.addedNodes.length;n++)r=l(t.addedNodes[n],s)||r}),r},l=(c,s)=>{if(1!==c.nodeType)return;const r=c;return(r.tagName===s.toUpperCase()?[r]:Array.from(r.querySelectorAll(s))).find(n=>n.value===r.value)}},1195:(y,f,i)=>{i.d(f,{B:()=>c});var e=i(3953),o=i(791),l=i(70);let c=(()=>{var s;class r{constructor(){}ngOnInit(){}}return(s=r).\u0275fac=function(n){return new(n||s)},s.\u0275cmp=e.VBU({type:s,selectors:[["app-conductor"]],decls:27,vars:4,consts:[[3,"translucent"],["slot","start"],["defaultHref","/home"],[3,"fullscreen"],[1,"ion-margin"],[1,"ion-text-center"],[2,"margin-bottom","auto"],["label","Nombre","placeholder","Ingresa tu nombre"],["label","Auto","placeholder","Ingresa el modelo de auto"],["label","Patente","placeholder","Ingresa tu patente"],["label","Destino","placeholder","Ingrese destino"],["label","Asientos","type","number","placeholder","Ingrese asientos disponibles"],["label","Costo de asiento","type","number","placeholder","Ingrese un valor"],["id","open-toast","ion","","shape","round",3,"routerLink"],["trigger","open-toast","message","Guardado!",3,"duration"]],template:function(n,g){1&n&&(e.j41(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-title"),e.EFF(3,"TeLlevoAPP"),e.k0s(),e.j41(4,"ion-buttons",1),e.nrm(5,"ion-back-button",2),e.k0s()()(),e.j41(6,"ion-content",3)(7,"div",4)(8,"h3",5),e.EFF(9,"Datos del conductor"),e.k0s(),e.j41(10,"ion-list")(11,"ion-item",6),e.nrm(12,"ion-input",7),e.k0s(),e.j41(13,"ion-item"),e.nrm(14,"ion-input",8),e.k0s(),e.j41(15,"ion-item"),e.nrm(16,"ion-input",9),e.k0s(),e.j41(17,"ion-item"),e.nrm(18,"ion-input",10),e.k0s(),e.j41(19,"ion-item"),e.nrm(20,"ion-input",11),e.k0s(),e.j41(21,"ion-item"),e.nrm(22,"ion-input",12),e.k0s()()(),e.j41(23,"div",5)(24,"ion-button",13),e.EFF(25," Guardar "),e.k0s(),e.nrm(26,"ion-toast",14),e.k0s()()),2&n&&(e.Y8G("translucent",!0),e.R7$(6),e.Y8G("fullscreen",!0),e.R7$(18),e.Y8G("routerLink","/home"),e.R7$(2),e.Y8G("duration",1e3))},dependencies:[o.Jm,o.QW,o.W9,o.eU,o.$w,o.uz,o.nf,o.BC,o.op,o.ai,o.su,o.Gw,o.el,o.N7,l.Wk]}),r})()},6393:(y,f,i)=>{i.d(f,{Z:()=>r});var e=i(3953),o=i(791),l=i(70);const c=()=>["/conductor"],s=()=>["/reserva"];let r=(()=>{var t;class n{constructor(){}ngOnInit(){}}return(t=n).\u0275fac=function(d){return new(d||t)},t.\u0275cmp=e.VBU({type:t,selectors:[["app-home"]],decls:28,vars:6,consts:[[3,"translucent"],[3,"fullscreen"],[1,"ion-text-end"],[3,"routerLink"]],template:function(d,a){1&d&&(e.j41(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-title"),e.EFF(3,"TeLlevoAPP"),e.k0s()()(),e.j41(4,"ion-content",1)(5,"div")(6,"ion-card")(7,"ion-card-header")(8,"ion-card-title"),e.EFF(9,"Conductor"),e.k0s(),e.j41(10,"ion-card-subtitle"),e.EFF(11,"Agrega acompa\xf1antes a tu viaje!"),e.k0s()(),e.j41(12,"ion-card-content"),e.EFF(13," En este perfil compartiras los asientos disponibles de tu vehiculo manteniendo tu destino. "),e.k0s(),e.j41(14,"div",2)(15,"ion-button",3),e.EFF(16,"Ser conductor"),e.k0s()()(),e.j41(17,"ion-card")(18,"ion-card-header")(19,"ion-card-title"),e.EFF(20,"Pasajero"),e.k0s(),e.j41(21,"ion-card-subtitle"),e.EFF(22,"Elige un conductor! "),e.k0s()(),e.j41(23,"ion-card-content"),e.EFF(24," En este perfil podr\xe1s reservar un asiento disponible para llegar a tu destino. "),e.k0s(),e.j41(25,"div",2)(26,"ion-button",3),e.EFF(27,"Ser pasajero"),e.k0s()()()()()),2&d&&(e.Y8G("translucent",!0),e.R7$(4),e.Y8G("fullscreen",!0),e.R7$(11),e.Y8G("routerLink",e.lJ4(4,c)),e.R7$(11),e.Y8G("routerLink",e.lJ4(5,s)))},dependencies:[o.Jm,o.b_,o.I9,o.ME,o.HW,o.tN,o.W9,o.eU,o.BC,o.ai,o.N7,l.Wk]}),n})()},413:(y,f,i)=>{i.d(f,{r:()=>t});var e=i(3953),o=i(4341),l=i(791),c=i(70);const s=()=>["/recuperar"],r=()=>["/home"];let t=(()=>{var n;class g{constructor(){}ngOnInit(){}}return(n=g).\u0275fac=function(a){return new(a||n)},n.\u0275cmp=e.VBU({type:n,selectors:[["app-login"]],decls:16,vars:6,consts:[[3,"translucent"],[3,"fullscreen"],[1,"ion-margin"],[1,"ion-text-center"],["type","email","fill","outline","label","Correo","labelPlacement","floating","helperText","Ingresa un correo institucional","errorText","Correo invalido","ngModel","","email",""],["label","Contrase\xf1a","type","password","label-placement","floating","fill","outline","placeholder","Ingresa contrase\xf1a"],["ion","","shape","round",3,"routerLink"]],template:function(a,u){1&a&&(e.j41(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-title"),e.EFF(3,"TeLlevoAPP "),e.k0s()()(),e.j41(4,"ion-content",1)(5,"div",2)(6,"h3",3),e.EFF(7,"Ingresa tu usuario"),e.k0s(),e.nrm(8,"ion-input",4)(9,"br")(10,"ion-input",5),e.k0s(),e.j41(11,"div",3)(12,"ion-button",6),e.EFF(13," Recuperar "),e.k0s(),e.j41(14,"ion-button",6),e.EFF(15," Ingresar "),e.k0s()()()),2&a&&(e.Y8G("translucent",!0),e.R7$(4),e.Y8G("fullscreen",!0),e.R7$(8),e.Y8G("routerLink",e.lJ4(4,s)),e.R7$(2),e.Y8G("routerLink",e.lJ4(5,r)))},dependencies:[o.BC,o.Dg,o.vS,l.Jm,l.W9,l.eU,l.$w,l.BC,l.ai,l.Gw,l.N7,c.Wk]}),g})()},8913:(y,f,i)=>{i.d(f,{L:()=>s});var e=i(3953),o=i(791),l=i(70);const c=()=>["/login"];let s=(()=>{var r;class t{constructor(){}ngOnInit(){}}return(r=t).\u0275fac=function(g){return new(g||r)},r.\u0275cmp=e.VBU({type:r,selectors:[["app-recuperar"]],decls:18,vars:4,consts:[[3,"translucent"],[3,"fullscreen"],["collapse","condense"],["size","large"],[1,"ion-margin"],[1,"ion-text-center"],["label","Nueva Contrase\xf1a","type","password","label-placement","floating","fill","outline","placeholder","Ingresa nueva contrase\xf1a"],["label","Repite Contrase\xf1a","type","password","label-placement","floating","fill","outline","placeholder","Ingresar nuevamente"],["ion","","shape","round",3,"routerLink"]],template:function(g,d){1&g&&(e.j41(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-title"),e.EFF(3,"TeLlevoAPP"),e.k0s()()(),e.j41(4,"ion-content",1)(5,"ion-header",2)(6,"ion-toolbar")(7,"ion-title",3),e.EFF(8,"TeLlevoAPP"),e.k0s()()(),e.j41(9,"div",4)(10,"h3",5),e.EFF(11,"Recuperar contrase\xf1a"),e.k0s(),e.nrm(12,"ion-input",6)(13,"br")(14,"ion-input",7),e.k0s(),e.j41(15,"div",5)(16,"ion-button",8),e.EFF(17," Cambiar "),e.k0s()()()),2&g&&(e.Y8G("translucent",!0),e.R7$(4),e.Y8G("fullscreen",!0),e.R7$(12),e.Y8G("routerLink",e.lJ4(3,c)))},dependencies:[o.Jm,o.W9,o.eU,o.$w,o.BC,o.ai,o.Gw,o.N7,l.Wk]}),t})()},8765:(y,f,i)=>{i.d(f,{C:()=>l});var e=i(3953),o=i(791);let l=(()=>{var c;class s{constructor(){this.toastButtons=[{text:"Confirmo",role:"accept"},{text:"Cancelar",role:"cancel"}]}ngOnInit(){}}return(c=s).\u0275fac=function(t){return new(t||c)},c.\u0275cmp=e.VBU({type:c,selectors:[["app-reserva"]],decls:54,vars:5,consts:[[3,"translucent"],["slot","start"],["defaultHref","/home"],[3,"fullscreen"],[1,"ion-text-center"],[2,"display","flex","align-items","center"],["slot","start",2,"margin-right","10px"],["src","../../../assets/icon/Honda Civic.PNG","alt","Honda Civic Gris"],[2,"margin","0"],[1,"ion-text-end"],["id","open-toast1","fill","clear"],["trigger","open-toast1","message","Confirmar reserva?","layout","stacked",3,"buttons"],["src","../../../assets/icon/Suzuki celerio azul.PNG","alt","SuzukiCelerioAzul"],["id","open-toast2","fill","clear"],["trigger","open-toast2","message","Confirmar reserva?","layout","stacked",3,"buttons"],["src","../../../assets/icon/SuzukiSwiftRojo.PNG","alt","SuzukiSwiftRojo"],["id","open-toast3","fill","clear"],["trigger","open-toast3","message","Confirmar reserva?","layout","stacked",3,"buttons"]],template:function(t,n){1&t&&(e.j41(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-buttons",1),e.nrm(3,"ion-back-button",2),e.k0s(),e.j41(4,"ion-title"),e.EFF(5,"TeLlevoAPP"),e.k0s()()(),e.j41(6,"ion-content",3)(7,"h3",4),e.EFF(8,"Reserva tu vehiculo"),e.k0s(),e.j41(9,"ion-card")(10,"ion-card-header")(11,"div",5)(12,"ion-avatar",6),e.nrm(13,"img",7),e.k0s(),e.j41(14,"ion-card-title",8),e.EFF(15,"Ruperto Arias"),e.k0s()(),e.j41(16,"ion-card-subtitle"),e.EFF(17,"Honda Civic Gris (RKJ674)"),e.k0s()(),e.j41(18,"ion-card-content"),e.EFF(19," Va en direccion a Altai 145, Hualpen "),e.k0s(),e.j41(20,"div",9)(21,"ion-button",10),e.EFF(22,"Reservar"),e.k0s(),e.nrm(23,"ion-toast",11),e.k0s()(),e.j41(24,"ion-card")(25,"ion-card-header")(26,"div",5)(27,"ion-avatar",6),e.nrm(28,"img",12),e.k0s(),e.j41(29,"ion-card-title",8),e.EFF(30,"Ignacio Sandoval"),e.k0s()(),e.j41(31,"ion-card-subtitle"),e.EFF(32,"Suzuki Celerio Azul (RT3674)"),e.k0s()(),e.j41(33,"ion-card-content"),e.EFF(34," Va en direccion a Tamales 876, Concepcion "),e.k0s(),e.j41(35,"div",9)(36,"ion-button",13),e.EFF(37,"Reservar"),e.k0s(),e.nrm(38,"ion-toast",14),e.k0s()(),e.j41(39,"ion-card")(40,"ion-card-header")(41,"div",5)(42,"ion-avatar",6),e.nrm(43,"img",15),e.k0s(),e.j41(44,"ion-card-title",8),e.EFF(45,"Sebastian Molina"),e.k0s()(),e.j41(46,"ion-card-subtitle"),e.EFF(47,"Suzuki Swift Rojo (PWJD98)"),e.k0s()(),e.j41(48,"ion-card-content"),e.EFF(49," Va en direccion a La Paz 6789, San Pedro de La Paz "),e.k0s(),e.j41(50,"div",9)(51,"ion-button",16),e.EFF(52,"Reservar"),e.k0s(),e.nrm(53,"ion-toast",17),e.k0s()()()),2&t&&(e.Y8G("translucent",!0),e.R7$(6),e.Y8G("fullscreen",!0),e.R7$(17),e.Y8G("buttons",n.toastButtons),e.R7$(15),e.Y8G("buttons",n.toastButtons),e.R7$(15),e.Y8G("buttons",n.toastButtons))},dependencies:[o.mC,o.Jm,o.QW,o.b_,o.I9,o.ME,o.HW,o.tN,o.W9,o.eU,o.BC,o.op,o.ai,o.el]}),s})()}}]);