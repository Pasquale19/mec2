"use strict";
/**
 * g2.ext (c) 2015-21 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @requires g2.core.js
 * @typedef {g2}
 * @description Additional methods for g2.
 * @returns {g2}
 */var g2=g2||{prototype:{}};g2.NONE=0;g2.OVER=1;g2.DRAG=2;g2.EDIT=4;g2.symbol=g2.symbol||{};g2.symbol.tick=g2().p().m({x:0,y:-2}).l({x:0,y:2}).stroke({lc:"round",lwnosc:true});g2.symbol.dot=g2().cir({x:0,y:0,r:2,ls:"transparent"});g2.symbol.sqr=g2().rec({x:-1.5,y:-1.5,b:3,h:3,ls:"transparent"});g2.symbol.nodcolor="#333";g2.symbol.nodfill="#dedede";g2.symbol.nodfill2="#aeaeae";g2.symbol.linkcolor="#666";g2.symbol.linkfill="rgba(225,225,225,0.75)";g2.symbol.dimcolor="darkslategray";g2.symbol.solid=[];g2.symbol.dash=[15,10];g2.symbol.dot=[4,4];g2.symbol.dashdot=[25,6.5,2,6.5];g2.symbol.labelSignificantDigits=3;g2.flatten=function(t){const s=Object.create(null);for(let e in t)if(typeof t[e]!=="function")s[e]=t[e];return s};g2.pointIfc={get p(){return{x:this.x,y:this.y}},get x(){return Object.getOwnPropertyDescriptor(this,"p")?this.p.x:0},get y(){return Object.getOwnPropertyDescriptor(this,"p")?this.p.y:0},set x(t){if(Object.getOwnPropertyDescriptor(this,"p"))this.p.x=t},set y(t){if(Object.getOwnPropertyDescriptor(this,"p"))this.p.y=t}};g2.labelIfc={getLabelOffset(){const t=this.label.off!==undefined?+this.label.off:1;return t+Math.sign(t)*(this.lw||2)/2},getLabelString(){let t=typeof this.label==="object"?this.label.str:typeof this.label==="string"?this.label:"?";if(t&&t[0]==="@"&&this[t.substr(1)]){t=t.substr(1);let s=this[t];s=Number.isInteger(s)?s:Number(s).toFixed(Math.max(g2.symbol.labelSignificantDigits-Math.log10(s),0));t=`${s}${t==="angle"?"°":""}`}return t},drawLabel(t){const s=this.label;const e=s.font||g2.defaultStyle.font;const r=parseInt(e);const o=this.getLabelString();const i=(o.length||1)*.65*r/2,n=1.25*r/2;const l=this.pointAt(s.loc||this.lbloc||"se");const y=this.getLabelOffset();const a={x:l.x+l.nx*(y+Math.sign(y)*i),y:l.y+l.ny*(y+Math.sign(y)*n)};if(s.border)t.ell({x:a.x,y:a.y,rx:i,ry:n,ls:s.fs||"black",fs:s.fs2||"#ffc"});t.txt({str:o,x:a.x,y:a.y,thal:"center",tval:"middle",fs:s.fs||this.ls||"black",font:s.font});return t}};g2.markIfc={markAt(t){const s=this.pointAt(t);const e=Math.atan2(s.ny,s.nx)+Math.PI/2;return{grp:this.getMarkSymbol(),x:s.x,y:s.y,w:e,scl:this.lw||1,ls:this.ls||"#000",fs:this.fs||this.ls||"#000"}},getMarkSymbol(){const t=this.mark;if(typeof t==="number"||!t)return g2.symbol.tick;if(typeof t.symbol==="object")return t.symbol;if(typeof t.symbol==="string")return g2.symbol[t.symbol]},drawMark(t,s=false){let e;if(Array.isArray(this.mark)){e=this.mark}else{const t=typeof this.mark==="object"?this.mark.count:this.mark;e=t?Array.from(Array(t)).map((e,r)=>r/(t-!s)):this.mark.loc}for(let s of e){t.use(this.markAt(s))}return t}};g2.prototype.cir.prototype=g2.mix(g2.pointIfc,g2.labelIfc,g2.markIfc,{w:0,lbloc:"c",get isSolid(){return this.fs&&this.fs!=="transparent"},get len(){return 2*Math.PI*this.r},get lsh(){return this.state&g2.OVER},get sh(){return this.state&g2.OVER?[0,0,5,"black"]:false},get g2(){const t=g2();this.label&&t.ins(t=>this.drawLabel(t));this.mark&&t.ins(t=>this.drawMark(t,true));return()=>g2().cir(g2.flatten(this)).ins(t)},pointAt(t){const s=Math.SQRT2/2;const e={c:[0,0],e:[1,0],ne:[s,s],n:[0,1],nw:[-s,s],w:[-1,0],sw:[-s,-s],s:[0,-1],se:[s,-s]};const r=t+0===t?[Math.cos(t*2*Math.PI),Math.sin(t*2*Math.PI)]:e[t||"c"]||[0,0];return{x:this.x+r[0]*this.r,y:this.y+r[1]*this.r,nx:r[0],ny:r[1]}},hit({x:t,y:s,eps:e}){return this.isSolid?g2.isPntInCir({x:t,y:s},this,e):g2.isPntOnCir({x:t,y:s},this,e)},drag({dx:t,dy:s}){this.x+=t;this.y+=s}});g2.prototype.lin.prototype=g2.mix(g2.labelIfc,g2.markIfc,{get p1(){return{x1:this.x1,y1:this.y1}},get x1(){return Object.getOwnPropertyDescriptor(this,"p1")?this.p1.x:0},get y1(){return Object.getOwnPropertyDescriptor(this,"p1")?this.p1.y:0},set x1(t){if(Object.getOwnPropertyDescriptor(this,"p1"))this.p1.x=t},set y1(t){if(Object.getOwnPropertyDescriptor(this,"p1"))this.p1.y=t},get p2(){return{x2:this.x2,y2:this.y2}},get x2(){return Object.getOwnPropertyDescriptor(this,"p2")?this.p2.x:0},get y2(){return Object.getOwnPropertyDescriptor(this,"p2")?this.p2.y:0},set x2(t){if(Object.getOwnPropertyDescriptor(this,"p2"))this.p2.x=t},set y2(t){if(Object.getOwnPropertyDescriptor(this,"p2"))this.p2.y=t},isSolid:false,get len(){return Math.hypot(this.x2-this.x1,this.y2-this.y1)},get sh(){return this.state&g2.OVER?[0,0,5,"black"]:false},get g2(){const t=g2();this.label&&t.ins(t=>this.drawLabel(t));this.mark&&t.ins(t=>this.drawMark(t));return()=>g2().lin(g2.flatten(this)).ins(t)},pointAt(t){let s=t==="beg"?0:t==="end"?1:t+0===t?t:.5,e=this.x2-this.x1,r=this.y2-this.y1,o=Math.hypot(e,r);return{x:this.x1+e*s,y:this.y1+r*s,nx:o?r/o:0,ny:o?-e/o:-1}},hit({x:t,y:s,eps:e}){return g2.isPntOnLin({x:t,y:s},{x:this.x1,y:this.y1},{x:this.x2,y:this.y2},e)},drag({dx:t,dy:s}){this.x1+=t;this.x2+=t;this.y1+=s;this.y2+=s}});g2.prototype.rec.prototype=g2.mix(g2.pointIfc,g2.labelIfc,g2.markIfc,{get len(){return 2*(this.b+this.h)},get isSolid(){return this.fs&&this.fs!=="transparent"},get lsh(){return this.state&g2.OVER},get sh(){return this.state&g2.OVER?[0,0,5,"black"]:false},get g2(){const t=g2();this.label&&t.ins(t=>this.drawLabel(t));this.mark&&t.ins(t=>this.drawMark(t,true));return()=>g2().rec(g2.flatten(this)).ins(t)},lbloc:"c",pointAt(t){const s=t=>{const s={c:[0,0],e:[1,0],ne:[.95,.95],n:[0,1],nw:[-.95,.95],w:[-1,0],sw:[-.95,-.95],s:[0,-1],se:[.95,-.95]};if(s[t])return s[t];const e=2*Math.PI*t+pi/4;if(t<=.25)return[1/Math.tan(e),1];if(t<=.5)return[-1,-Math.tan(e)];if(t<=.75)return[-1/Math.tan(e),-1];if(t<=1)return[1,Math.tan(e)]};const e=s(t);return{x:this.x+(1+e[0])*this.b/2,y:this.y+(1+e[1])*this.h/2,nx:1-Math.abs(e[0])<.01?e[0]:0,ny:1-Math.abs(e[1])<.01?e[1]:0}},hit({x:t,y:s,eps:e}){return this.isSolid?g2.isPntInBox({x:t,y:s},{x:this.x+this.b/2,y:this.y+this.h/2,b:this.b/2,h:this.h/2},e):g2.isPntOnBox({x:t,y:s},{x:this.x+this.b/2,y:this.y+this.h/2,b:this.b/2,h:this.h/2},e)},drag({dx:t,dy:s}){this.x+=t;this.y+=s}});g2.prototype.arc.prototype=g2.mix(g2.pointIfc,g2.labelIfc,g2.markIfc,{get len(){return Math.abs(this.r*this.dw)},isSolid:false,get angle(){return this.dw/Math.PI*180},get sh(){return this.state&g2.OVER?[0,0,5,"black"]:false},get g2(){const t=g2();this.label&&t.ins(t=>this.drawLabel(t));this.mark&&t.ins(t=>this.drawMark(t));return()=>g2().arc(g2.flatten(this)).ins(t)},lbloc:"mid",pointAt(t){let s=t==="beg"?0:t==="end"?1:t==="mid"?.5:t+0===t?t:.5,e=(this.w||0)+s*(this.dw||Math.PI*2),r=Math.cos(e),o=Math.sin(e),i=t==="c"?0:this.r;return{x:this.x+i*r,y:this.y+i*o,nx:r,ny:o}},hit({x:t,y:s,eps:e}){return g2.isPntOnArc({x:t,y:s},this,e)},drag({dx:t,dy:s}){this.x+=t;this.y+=s}});g2.prototype.hdl=function(t){return this.addCommand({c:"hdl",a:t})};g2.prototype.hdl.prototype=g2.mix(g2.prototype.cir.prototype,{r:5,isSolid:true,draggable:true,lbloc:"se",get lsh(){return this.state&g2.OVER},get sh(){return this.state&g2.OVER?[0,0,5,"black"]:false},g2(){const{x:t,y:s,r:e,b:r=4,ls:o="black",fs:i="palegreen",sh:n}=this;return g2().cir({x:t,y:s,r:e,ls:o,fs:i,sh:n}).ins(t=>this.label&&this.drawLabel(t))}});g2.prototype.nod=function(t={}){return this.addCommand({c:"nod",a:t})};g2.prototype.nod.prototype=g2.mix(g2.prototype.cir.prototype,{r:5,ls:"@nodcolor",fs:g2.symbol.nodfill,isSolid:true,lbloc:"se",g2(){return g2().cir({...g2.flatten(this),r:this.r*(this.scl!==undefined?this.scl:1)}).ins(t=>this.label&&this.drawLabel(t))}});g2.prototype.dblnod=function({x:t=0,y:s=0}){return this.addCommand({c:"dblnod",a:arguments[0]})};g2.prototype.dblnod.prototype=g2.mix(g2.prototype.cir.prototype,{r:6,isSolid:true,g2(){return g2().beg({x:this.x,y:this.y}).cir({r:6,ls:"@nodcolor",fs:"@nodfill",sh:this.sh}).cir({r:3,ls:"@nodcolor",fs:"@nodfill2"}).end().ins(t=>this.label&&this.drawLabel(t))}});g2.prototype.pol=function(t={}){return this.addCommand({c:"pol",a:t})};g2.prototype.pol.prototype=g2.mix(g2.prototype.nod.prototype,{g2(){return g2().beg(g2.flatten(this)).cir({r:6,fs:"@fs2"}).cir({r:2.5,fs:"@ls",ls:"transparent"}).end().ins(t=>this.label&&this.drawLabel(t))}});g2.prototype.gnd=function(t={}){return this.addCommand({c:"gnd",a:t})};g2.prototype.gnd.prototype=g2.mix(g2.prototype.nod.prototype,{g2(){return g2().beg(g2.flatten(this)).cir({x:0,y:0,r:6}).p().m({x:0,y:6}).a({dw:Math.PI/2,x:-6,y:0}).l({x:6,y:0}).a({dw:-Math.PI/2,x:0,y:-6}).z().fill({fs:g2.symbol.nodcolor}).end().ins(t=>this.label&&this.drawLabel(t))}});g2.prototype.nodfix=function(t={}){return this.addCommand({c:"nodfix",a:t})};g2.prototype.nodfix.prototype=g2.mix(g2.prototype.nod.prototype,{g2(){return g2().beg(g2.flatten(this)).p().m({x:-8,y:-12}).l({x:0,y:0}).l({x:8,y:-12}).drw({fs:g2.symbol.nodfill2}).cir({x:0,y:0,r:this.r}).end().ins(t=>this.label&&this.drawLabel(t))}});g2.prototype.nodflt=function(t={}){return this.addCommand({c:"nodflt",a:t})};g2.prototype.nodflt.prototype=g2.mix(g2.prototype.nod.prototype,{g2(){return g2().beg(g2.flatten(this)).p().m({x:-8,y:-12}).l({x:0,y:0}).l({x:8,y:-12}).drw({ls:g2.symbol.nodcolor,fs:g2.symbol.nodfill2}).cir({x:0,y:0,r:this.r,ls:g2.symbol.nodcolor,fs:g2.symbol.nodfill}).lin({x1:-9,y1:-19,x2:9,y2:-19,ls:g2.symbol.nodfill2,lw:5}).lin({x1:-9,y1:-15.5,x2:9,y2:-15.5,ls:g2.symbol.nodcolor,lw:2}).end().ins(t=>this.label&&this.drawLabel(t))}});g2.prototype.vec=function t(s){return this.addCommand({c:"vec",a:s})};g2.prototype.vec.prototype=g2.mix(g2.prototype.lin.prototype,{g2(){const{x1:t,y1:s,x2:e,y2:r,lw:o=1,ls:i="#000",ld:n=[],fs:l=i||"#000",lc:y="round",lj:a="round"}=this;const h=e-t,p=r-s,g=Math.hypot(h,p);const c=3*(1+o)>g?g/3:1+o;const x=()=>g2().p().m({x:0,y:0}).l({x:-5*c,y:c}).a({dw:-Math.PI/3,x:-5*c,y:-c}).z().drw({ls:i,fs:l,lc:y,lj:a});return g2().beg({x:t,y:s,w:Math.atan2(p,h),lc:y,lj:a}).p().m({x:0,y:0}).l({x:g-3*c,y:0}).stroke({ls:i,lw:o,ld:n}).use({grp:x,x:g,y:0}).end().ins(t=>this.label&&this.drawLabel(t))}});g2.prototype.avec=function t(s){return this.addCommand({c:"avec",a:s})};g2.prototype.avec.prototype=g2.mix(g2.prototype.arc.prototype,{g2(){const{x:t,y:s,r:e,w:r,dw:o=0,lw:i=1,lc:n="round",lj:l="round",ls:y,fs:a=y||"#000",label:h}=this;const p=3*(1+i)>e?e/3:1+i,g=5*p/e;const c=()=>g2().p().m({x:0,y:2*p}).l({x:0,y:-2*p}).m({x:0,y:0}).l({x:-5*p,y:p}).a({dw:-Math.PI/3,x:-5*p,y:-p}).z().drw({ls:y,fs:a});return g2().beg({x:t,y:s,w:r,ls:y,lw:i,lc:n,lj:l}).arc({r:e,w:0,dw:o}).use({grp:c,x:e*Math.cos(o),y:e*Math.sin(o),w:o>=0?o+Math.PI/2-g/2:o-Math.PI/2+g/2}).end().ins(t=>h&&this.drawLabel(t))}});g2.prototype.dim=function t(s){return this.addCommand({c:"dim",a:s})};g2.prototype.dim.prototype=g2.mix(g2.prototype.lin.prototype,{pointAt(t){const s=g2.prototype.lin.prototype.pointAt.call(this,t);if(this.off){s.x+=this.off*s.nx;s.y+=this.off*s.ny}return s},g2(){const{x1:t,y1:s,x2:e,y2:r,lw:o=1,lc:i="round",lj:n="round",off:l=0,inside:y=true,ls:a,fs:h=a||"#000",label:p}=this;const g=e-t,c=r-s,x=Math.hypot(g,c);const d=3*(1+o)>x?x/3:1+o;const f=()=>g2().p().m({x:0,y:2*d}).l({x:0,y:-2*d}).m({x:0,y:0}).l({x:-5*d,y:d}).a({dw:-Math.PI/3,x:-5*d,y:-d}).z().drw({ls:a,fs:h});return g2().beg({x:t+l/x*c,y:s-l/x*g,w:Math.atan2(c,g),ls:a,fs:h,lw:o,lc:i,lj:n}).lin({x1:y?4*d:0,y1:0,x2:y?x-4*d:x,y2:0}).use({grp:f,x:x,y:0,w:y?0:Math.PI}).use({grp:f,x:0,y:0,w:y?Math.PI:0}).lin({x1:0,y1:l,x2:0,y2:0}).lin({x1:x,y1:l,x2:x,y2:0}).end().ins(t=>p&&this.drawLabel(t))}});g2.prototype.adim=function t(s){return this.addCommand({c:"adim",a:s})};g2.prototype.adim.prototype=g2.mix(g2.prototype.arc.prototype,{g2(){const{x:t,y:s,r:e,w:r,dw:o,lw:i=1,lc:n="round",lj:l="round",ls:y,fs:a=y||"#000",label:h}=this;const p=3*(1+i)>e?e/3:1+i,g=5*p/e;const c=()=>g2().p().m({x:0,y:2*p}).l({x:0,y:-2*p}).m({x:0,y:0}).l({x:-5*p,y:p}).a({dw:-Math.PI/3,x:-5*p,y:-p}).z().drw({ls:y,fs:a});const x=this.inside!==undefined&&this.outside===undefined?!this.inside:!!this.outside;return g2().beg({x:t,y:s,w:r,ls:y,lw:i,lc:n,lj:l}).arc({r:e,w:0,dw:o}).use({grp:c,x:e,y:0,w:!x&&o>0||x&&o<0?-Math.PI/2+g/2:Math.PI/2-g/2}).use({grp:c,x:e*Math.cos(o),y:e*Math.sin(o),w:!x&&o>0||x&&o<0?o+Math.PI/2-g/2:o-Math.PI/2+g/2}).end().ins(t=>h&&this.drawLabel(t))}});g2.prototype.origin=function(t={}){return this.addCommand({c:"origin",a:t})};g2.prototype.origin.prototype=g2.mix(g2.prototype.nod.prototype,{lbloc:"sw",g2(){const{x:t,y:s,w:e,ls:r="#000",lw:o=1}=this;return g2().beg({x:t,y:s,w:e,ls:r}).vec({x1:0,y1:0,x2:40,y2:0,lw:o,fs:"#ccc"}).vec({x1:0,y1:0,x2:0,y2:40,lw:o,fs:"#ccc"}).cir({x:0,y:0,r:o+1,fs:"#ccc"}).end().ins(t=>this.label&&this.drawLabel(t))}});g2.prototype.ply.prototype=g2.mix(g2.labelIfc,g2.markIfc,{get isSolid(){return this.closed&&this.fs&&this.fs!=="transparent"},get sh(){return this.state&g2.OVER?[0,0,5,"black"]:false},pointAt(t){const s=t==="beg"?0:t==="end"?1:t+0===t?t:.5,e=g2.pntItrOf(this.pts),r=[],o=[];for(let t=0;t<e.len;t++){const s=e((t+1)%e.len);r.push(e(t));o.push(Math.hypot(s.x-e(t).x,s.y-e(t).y))}this.closed||o.pop();const{t2:i,x:n,y:l,dx:y,dy:a}=(()=>{const t=s*o.reduce((t,s)=>t+s);for(let s=0,i=0;s<r.length;s++){i+=o[s];const n=e(s+1).x?e(s+1):e(0);if(i>=t){return{t2:1-(i-t)/o[s],x:r[s].x,y:r[s].y,dx:n.x-r[s].x,dy:n.y-r[s].y}}}})();const h=Math.hypot(y,a);return{x:(this.x||0)+n+y*i,y:(this.y||0)+l+a*i,nx:h?a/h:1,ny:h?y/h:0}},hit({x:t,y:s,eps:e}){return this.isSolid?g2.isPntInPly({x:t-this.x,y:s-this.y},this,e):g2.isPntOnPly({x:t-this.x,y:s-this.y},this,e)},drag({dx:t,dy:s}){this.x+=t;this.y+=s},get g2(){const t=g2();this.label&&t.ins(t=>this.drawLabel(t));this.mark&&t.ins(t=>this.drawMark(t,this.closed));return()=>g2().ply(g2.flatten(this)).ins(t)}});g2.prototype.use.prototype={get p(){return{x:this.x,y:this.y}},get x(){return Object.getOwnPropertyDescriptor(this,"p")?this.p.x:0},get y(){return Object.getOwnPropertyDescriptor(this,"p")?this.p.y:0},set x(t){if(Object.getOwnPropertyDescriptor(this,"p"))this.p.x=t},set y(t){if(Object.getOwnPropertyDescriptor(this,"p"))this.p.y=t},isSolid:false};g2.prototype.spline=function t({pts:s,closed:e,x:r,y:o,w:i}){arguments[0]._itr=g2.pntItrOf(s);return this.addCommand({c:"spline",a:arguments[0]})};g2.prototype.spline.prototype=g2.mix(g2.prototype.ply.prototype,{g2:function(){let{pts:t,closed:s,x:e,y:r,w:o,ls:i,lw:n,fs:l,sh:y}=this,a=this._itr,h;if(a){let t=[],p,g=a.len,c,x,d,f,b,u,m,w,M,O,P,k,I,j=e||r||o;h=g2();if(j)h.beg({x:e,y:r,w:o});h.p().m(a(0));for(let t=0;t<(s?g:g-1);t++){if(t===0){c=s?a(g-1):{x:2*a(0).x-a(1).x,y:2*a(0).y-a(1).y};x=a(0);d=a(1);f=g===2?s?a(0):{x:2*a(1).x-a(0).x,y:2*a(1).y-a(0).y}:a(2);b=Math.max(Math.hypot(x.x-c.x,x.y-c.y),Number.EPSILON);u=Math.max(Math.hypot(d.x-x.x,d.y-x.y),Number.EPSILON)}else{c=x;x=d;d=f;f=t===g-2?s?a(0):{x:2*a(g-1).x-a(g-2).x,y:2*a(g-1).y-a(g-2).y}:t===g-1?a(1):a(t+2);b=u;u=m}m=Math.max(Math.hypot(f.x-d.x,f.y-d.y),Number.EPSILON);w=Math.sqrt(b*u),M=Math.sqrt(u*m),O=2*b+3*w+u,P=2*m+3*M+u,k=3*(b+w),I=3*(m+M);h.c({x:d.x,y:d.y,x1:(-u*c.x+O*x.x+b*d.x)/k,y1:(-u*c.y+O*x.y+b*d.y)/k,x2:(-u*f.x+P*d.x+m*x.x)/I,y2:(-u*f.y+P*d.y+m*x.y)/I})}h.c(s?{x:a(0).x,y:a(0).y}:{x:a(g-1).x,y:a(g-1).y});if(s)h.z();h.drw({ls:i,lw:n,fs:l,sh:y});if(j)h.end()}return h}});"use strict";
/**
 * @author Pascal Schnabel
 * @license MIT License
 * @requires g2.core.js
 * @requires g2.ext.js
 * @typedef {g2}
 * @description Mechanical extensions. (Requires cartesian coordinates)
 * @returns {g2}
 */g2.symbol.nodfill3="white";var g2=g2||{prototype:{}};g2.prototype.nodfix2=function(){return this.addCommand({c:"nodfix2",a:arguments[0]})};g2.prototype.nodfix2.prototype=g2.mix(g2.prototype.nod.prototype,{g2(){const t=Object.assign({x:0,y:0,label:{str:"default",loc:"e",off:"2"}},this);const s=9;const e=12;let r=g2().beg({x:t.x,y:t.y}).lin({x1:3,y1:2,x2:s,y2:-e}).lin({x1:-3,y1:2,x2:-s,y2:-e}).lin({x1:-s-5,y1:-e,x2:s+5,y2:-e}).pol2({x:0,y:0,scl:1,fs:"@nodfill3",label:t.label});let o=s*2/3;for(let t=-s+2;t<s+5;t+=o){let s=6;r.lin({x1:t,y1:-e,x2:t-s,y2:-e-s})}r.end();r.ins(t=>this.label&&this.drawLabel(t));return r}});g2.prototype.parline=function(){return this.addCommand({c:"parline",a:arguments[0]})};g2.prototype.parline.prototype=g2.mix(g2.prototype.lin.prototype,{g2(){const t=Object.assign({i:2,sz:4,typ:"lin",ls:"@nodcolor",label:{str:""}},this);const{x1:s=0,sz:e,typ:r="lin"}=t;const o={x:t.x2-t.x1,y:t.y2-t.y1};const i=Math.atan2(o.y,o.x);const n=i+Math.PI/4;const l=Math.sqrt(o.x*o.x+o.y*o.y);const y=g2();y.lin({x1:t.x1,y1:t.y1,x2:t.x2,y2:t.y2,ls:t.ls});const a=.49;const h=1-a;let p=(h-a)/(t.i-1);const g={x:t.x1+l/2*Math.cos(i),y:t.y1+l/2*Math.sin(i)};for(let s=a;s<=h;s+=p){let o=s*l;if(r==="cir"){y.cir({x:g.x,y:g.y,r:e,ls:t.ls,ld:[1,0]})}else{const s={x:g.x+e*Math.cos(n),y:g.y+t.sz*Math.sin(n)};const r={x:g.x-t.sz*Math.cos(n),y:g.y-t.sz*Math.sin(n)};y.lin({x1:s.x,y1:s.y,x2:r.x,y2:r.y,ls:t.ls})}}y.ins(t=>this.label&&this.drawLabel(t));return y}});g2.prototype.grdlines=function(){return this.addCommand({c:"grdlines",a:arguments[0]})};g2.prototype.grdlines.prototype=g2.mix(g2.prototype.pol.prototype,{g2(){const t=Object.assign({x:0,y:0,ds:[8,11],w:0,lw:1,ls:"black",anz:4,label:{str:"default",loc:"e",off:"2"}},this);const s=t.ds[0];const e=t.ds[1];const{w:r,anz:o}=t;const i={x:Math.cos(r),y:Math.sin(r)};const n=r-Math.PI/4*3;const l=g2();for(let i=0;i<o;i+=1){let o=t.x+i*s*Math.cos(r);let y=t.y+i*s*Math.sin(r);let a=o+e*Math.cos(n);let h=y+e*Math.sin(n);l.lin({x1:o,y1:y,x2:a,y2:h,ls:t.ls,lw:t.lw})}l.end();return l}});g2.prototype.grdline=function(){return this.addCommand({c:"grdline",a:arguments[0]})};g2.prototype.grdline.prototype=g2.mix(g2.prototype.lin.prototype,{g2(){const t=Object.assign({x1:0,y1:0,x2:1,y2:1,ds:[8,11],lw:1.5,anz:5,w:0,typ:"out",label:{str:"default",loc:"mid",off:"3"}},this);const s={x:t.x2-t.x1,y:t.y2-t.y1};const e=Math.atan2(s.y,s.x);const{w:r,anz:o}=t;const i=Math.sqrt(s.x*s.x+s.y*s.y);const n=g2().beg({ls:t.ls}).lin({x1:t.x1,y1:t.y1,x2:t.x2,y2:t.y2,lw:t.lw*2});let l,y;switch(t.typ){case"mid":y=(i-8*(o+1)/2-i/2)/i;l={x:t.x1+Math.cos(e)*i*y,y:t.y1+Math.sin(e)*i*y};n.grdlines({x:l.x,y:l.y,w:e,ls:t.ls,lw:t.lw,anz:o});break;case"full":const s=t.ds[0];const r=t.ds[1];const a=e-Math.PI/4*3;let h=i/s-2;for(let o=0;o<h;o+=1){let i=t.x1+(o*s+s)*Math.cos(e);let l=t.y1+(o*s+s)*Math.sin(e);let y=i+r*Math.cos(a);let h=l+r*Math.sin(a);n.lin({x1:i,y1:l,x2:y,y2:h,ls:t.ls,lw:t.lw})}break;default:y=4*3/i;l={x:t.x1+Math.cos(e)*i*y,y:t.y1+Math.sin(e)*i*y};const p=(i-6*5)/i;const g={x:t.x1+Math.cos(e)*i*p,y:t.y1+Math.sin(e)*i*p};n.grdlines({x:l.x,y:l.y,w:e,ls:t.ls,lw:t.lw});n.grdlines({x:g.x,y:g.y,w:e,ls:t.ls,lw:t.lw});break}n.end();n.ins(t=>this.label&&this.drawLabel(t));return n}});g2.prototype.slider=function(){return this.addCommand({c:"slider",a:arguments[0]})};g2.prototype.slider.prototype=g2.mix(g2.prototype.rec.prototype,{g2(){const t=Object.assign({b:32,h:16,fs:"white",lw:.8,label:{str:"default",loc:"ne",off:"15"}},this);return g2().beg({x:t.x,y:t.y,w:t.w,fs:t.fs,lw:t.lw}).rec({x:-t.b/2,y:-t.h/2,b:t.b,h:t.h}).cir({x:0,y:0,r:t.h*.41,fs:"@fs2"}).cir({r:t.h*.1,fs:"@ls",ls:"transparent"}).end().cir({x:t.x,y:t.y,r:t.h*.41,fs:"@fs2",label:t.label})}});g2.prototype.pol2=function(t={}){return this.addCommand({c:"pol2",a:t})};g2.prototype.pol2.prototype=g2.mix(g2.prototype.nod.prototype,{g2(){const t=Object.assign({lw:2.2},this);return g2().beg(g2.flatten(this)).cir({r:6,fs:"@fs2",lw:t.lw}).cir({r:1.2,fs:"@ls",ls:"transparent",lw:t.lw/2}).end()}});"use strict";
/**
 * @author Pascal Schnabel
 * @license MIT License
 * @requires g2.core.js
 * @requires g2.ext.js
 */g2.symbol=g2.symbol||{};g2.symbol.poldot=g2().cir({x:0,y:0,r:1.32,ls:"transparent",fs:"black"});g2.symbol.nodfill3="white";g2.symbol.pol=g2().cir({x:0,y:0,r:6,ls:"black",lw:1.5,fs:"white"}).use({grp:"poldot"});g2.symbol.nodfix2=function(){const t=9,s=12;const e=g2().p().m({x:3,y:2}).l({x:-3,y:2}).l({x:-t,y:-s}).l({x:t,y:-s}).l({x:3,y:2}).z().stroke({ls:"black",lw:1.1,fs:"white"});const r=t*2/3;for(let o=-t+2;o<t+5;o+=r){let t=6;e.lin({x1:o,y1:-s,x2:o-t,y2:-s-t})}e.lin({x1:-t-3,y1:-s,x2:t+3,y2:-s});e.use({grp:"pol"});e.end();return e};g2.symbol.slider=function(){const t=g2();const s={b:32,h:16,fs:"white",lw:.8,label:{str:"default",loc:"ne",off:"15"}};return g2().rec({x:-s.b/2,y:-s.h/2,b:s.b,h:s.h,fs:"white"}).use({grp:"pol"}).end()};
/**
 * mec (c) 2018-19 Stefan Goessner
 * @license MIT License
 */
"use strict";const mec={lang:"en",msg:{},EPS:1.19209e-7,lenTol:.001,angTol:1/180*Math.PI,velTol:.01,forceTol:.1,momentTol:.01,tol:{len:{low:1e-5,medium:.001,high:.1}},maxLinCorrect:20,asmItrMax:512,itrMax:256,corrMax:64,show:{constraintVector:true,darkmode:false,nodeLabels:false,constraintLabels:true,loadLabels:true,nodes:true,constraints:true,font:"normal 13px serif",colors:{invalidConstraintColor:"#b11",validConstraintColor:{dark:"#ffffff99",light:"black"},forceColor:{dark:"orangered",light:"orange"},springColor:{dark:"#ccc",light:"#aaa"},constraintVectorColor:{dark:"orange",light:"green"},hoveredElmColor:{dark:"white",light:"gray"},selectedElmColor:{dark:"yellow",light:"blue"},txtColor:{dark:"white",light:"black"},velVecColor:{dark:"lightsteelblue",light:"steelblue"},accVecColor:{dark:"lightsalmon",light:"firebrick"},forceVecColor:{dark:"wheat",light:"saddlebrown"}},get validConstraintColor(){return this.darkmode?this.colors.validConstraintColor.dark:this.colors.validConstraintColor.light},get forceColor(){return this.darkmode?this.colors.forceColor.dark:this.colors.forceColor.light},get springColor(){return this.darkmode?this.colors.springColor.dark:this.colors.springColor.light},get constraintVectorColor(){return this.darkmode?this.colors.constraintVectorColor.dark:this.colors.constraintVectorColor.light},get hoveredElmColor(){return this.darkmode?this.colors.hoveredElmColor.dark:this.colors.hoveredElmColor.light},get selectedElmColor(){return this.darkmode?this.colors.selectedElmColor.dark:this.colors.selectedElmColor.light},get txtColor(){return this.darkmode?this.colors.txtColor.dark:this.colors.txtColor.light},get velVecColor(){return this.darkmode?this.colors.velVecColor.dark:this.colors.velVecColor.light},get accVecColor(){return this.darkmode?this.colors.accVecColor.dark:this.colors.accVecColor.light},get forceVecColor(){return this.darkmode?this.colors.forceVecColor.dark:this.colors.forceVecColor.light}},gravity:{x:0,y:-10,active:false},aly:{m:{get scl(){return 1},type:"num",name:"m",unit:"kg"},pos:{type:"pnt",name:"p",unit:"m"},vel:{get scl(){return mec.m_u},type:"vec",name:"v",unit:"m/s",get drwscl(){return 40*mec.m_u}},acc:{get scl(){return mec.m_u},type:"vec",name:"a",unit:"m/s^2",get drwscl(){return 10*mec.m_u}},w:{get scl(){return 180/Math.PI},type:"num",name:"φ",unit:"°"},wt:{get scl(){return 1},type:"num",name:"ω",unit:"rad/s"},wtt:{get scl(){return 1},type:"num",name:"α",unit:"rad/s^2"},r:{get scl(){return mec.m_u},type:"num",name:"r",unit:"m"},rt:{get scl(){return mec.m_u},type:"num",name:"rt",unit:"m/s"},rtt:{get scl(){return mec.m_u},type:"num",name:"rtt",unit:"m/s^2"},force:{get scl(){return mec.m_u},type:"vec",name:"F",unit:"N",get drwscl(){return 5*mec.m_u}},velAbs:{get scl(){return mec.m_u},type:"num",name:"v",unit:"m/s"},accAbs:{get scl(){return mec.m_u},type:"num",name:"a",unit:"m/s"},forceAbs:{get scl(){return mec.m_u},type:"num",name:"F",unit:"N"},moment:{get scl(){return mec.m_u**2},type:"num",name:"M",unit:"Nm"},energy:{get scl(){return mec.to_J},type:"num",name:"E",unit:"J"},pole:{type:"pnt",name:"P",unit:"m"},polAcc:{get scl(){return mec.m_u},type:"vec",name:"a_P",unit:"m/s^2",get drwscl(){return 10*mec.m_u}},polChgVel:{get scl(){return mec.m_u},type:"vec",name:"u_P",unit:"m/s",get drwscl(){return 40*mec.m_u}},accPole:{type:"pnt",name:"Q",unit:"m"},inflPole:{type:"pnt",name:"I",unit:"m"},t:{get scl(){return 1},type:"num",name:"t",unit:"s"}},m_u:.01,to_m(t){return t*mec.m_u},from_m(t){return t/mec.m_u},to_N(t){return t*mec.m_u},from_N(t){return t/mec.m_u},to_Nm(t){return t*mec.m_u*mec.m_u},from_Nm(t){return t/mec.m_u/mec.m_u},to_N_m(t){return t},from_N_m(t){return t},to_J(t){return mec.to_Nm(t)},from_J(t){return mec.from_Nm(t)},to_kgm2(t){return t*mec.m_u*mec.m_u},from_kgm2(t){return t/mec.m_u/mec.m_u},isEps(t,i){return t<(i||mec.EPS)&&t>-(i||mec.EPS)},toZero(t,i){return t<(i||mec.EPS)&&t>-(i||mec.EPS)?0:t},clamp(t,i,e){return Math.min(Math.max(t,i),e)},asympClamp(t,i,e){const s=e-i;return s?i+.5*s+Math.tanh(((Math.min(Math.max(t,i),e)-i)/s-.5)*5)*.5*s:i},toRad(t){return t*Math.PI/180},toDeg(t){return t/Math.PI*180},infAngle(t,i){let e=Math.PI,s=2*e,r=i-t%s;if(r>e)r-=s;else if(r<-e)r+=s;return t+r},mixin(t,...i){i.forEach(i=>{t=Object.defineProperties(t,Object.getOwnPropertyDescriptors(i))});return t},assignGetters(t,i){for(const e in i)Object.defineProperty(t,e,{get:i[e],enumerable:true,configurable:true})},messageString(t){const i=mec.msg[mec.lang][t.mid];return i?t.mid[0]+": "+i(t):""}};
/**
 * mec.node (c) 2018-19 Stefan Goessner
 * @license MIT License
 * @requires mec.core.js
 * @requires mec.model.js
 * @requires g2.js
 */
"use strict";mec.node={extend(t){Object.setPrototypeOf(t,this.prototype);t.constructor();return t},prototype:{constructor(){this.x=this.x||0;this.y=this.y||0;this.x0=this.x;this.y0=this.y;this.xt=this.yt=0;this.xtt=this.ytt=0;this.dxt=this.dyt=0;this.Qx=this.Qy=0},validate(t){if(!this.id)return{mid:"E_ELEM_ID_MISSING",elemtype:"node",idx:t};if(this.model.elementById(this.id)!==this)return{mid:"E_ELEM_ID_AMBIGIOUS",id:this.id};if(typeof this.m==="number"&&mec.isEps(this.m))return{mid:"E_NODE_MASS_TOO_SMALL",id:this.id,m:this.m};return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.im=typeof this.m==="number"?1/this.m:this.base===true?0:1;Object.defineProperty(this,"m",{get:()=>1/this.im,set:t=>this.im=1/t,enumerable:true,configurable:true});Object.defineProperty(this,"base",{get:()=>this.im===0,set:t=>this.im=t?0:1,enumerable:true,configurable:true});this.g2cache=false},get xtcur(){return this.xt+this.dxt},get ytcur(){return this.yt+this.dyt},get type(){return"node"},get dof(){return this.m===Number.POSITIVE_INFINITY?0:2},get isSleeping(){return this.base||mec.isEps(this.xt,mec.velTol)&&mec.isEps(this.yt,mec.velTol)&&mec.isEps(this.xtt,mec.velTol/this.model.timer.dt)&&mec.isEps(this.ytt,mec.velTol/this.model.timer.dt)},get energy(){var t=0;if(!this.base){if(this.model.hasGravity)t+=this.m*(-(this.x-this.x0)*mec.from_m(this.model.gravity.x)-(this.y-this.y0)*mec.from_m(this.model.gravity.y));t+=.5*this.m*(this.xt**2+this.yt**2)}return t},dependsOn(t){return false},deepDependsOn(t){return t===this},reset(){if(!this.base){this.x=this.x0;this.y=this.y0}this.xt=this.yt=0;this.xtt=this.ytt=0;this.dxt=this.dyt=0},pre_0(){this.Qx=this.Qy=0;this.dxt=this.dyt=0},pre(t){if(!this.base&&this.model.hasGravity){this.Qx+=this.m*mec.from_m(this.model.gravity.x);this.Qy+=this.m*mec.from_m(this.model.gravity.y)}this.dxt+=this.Qx*this.im*t;this.dyt+=this.Qy*this.im*t;this.x+=(this.xt+1.5*this.dxt)*t;this.y+=(this.yt+1.5*this.dyt)*t},post(t){this.xt+=this.dxt;this.yt+=this.dyt;this.xtt=this.dxt/t;this.ytt=this.dyt/t},asJSON(){return'{ "id":"'+this.id+'","x":'+this.x0+',"y":'+this.y0+(this.base?',"base":true':"")+(!this.base&&this.m!==1?',"m":'+this.m:"")+(this.idloc?',"idloc":"'+this.idloc+'"':"")+(this.optic?',"optic":"'+this.optic+'"':"")+(this.hid?',"hid":"'+this.hid+'"':"")+" }"},get force(){return{x:this.Qx,y:this.Qy}},get pos(){return{x:this.x,y:this.y}},get vel(){return{x:this.xt,y:this.yt}},get acc(){return{x:this.xtt,y:this.ytt}},get forceAbs(){return Math.hypot(this.Qx,this.Qy)},get velAbs(){return Math.hypot(this.xt,this.yt)},get accAbs(){return Math.hypot(this.xtt,this.ytt)},get showInfo(){return this.state&g2.OVER},get infos(){return{id:()=>`'${this.id}'`,pos:()=>`p=(${this.x.toFixed(0)},${this.y.toFixed(0)})`,vel:()=>`v=(${mec.to_m(this.xt).toFixed(2)},${mec.to_m(this.yt).toFixed(2)})m/s`,m:()=>`m=${this.m}`}},info(t){const i=this.infos[t];return i?i():"?"},hitInner({x:t,y:i,eps:e}){return g2.isPntInCir({x:t,y:i},this,e)},selectBeg({x:t,y:i,t:e}){},selectEnd({x:t,y:i,t:e}){if(!this.base){this.xt=this.yt=this.xtt=this.ytt=0}},drag({x:t,y:i,mode:e}){if(e==="edit"&&!this.base){this.x0=t;this.y0=i}else{this.x=t;this.y=i}},get isSolid(){return true},get sh(){return this.state&g2.OVER?[0,0,10,this.model.env.show.hoveredElmColor]:this.state&g2.EDIT?[0,0,10,this.model.env.show.selectedElmColor]:false},get r(){return mec.node.radius},g2(){let t;switch(this.optic){case"FG":t=g2.symbol.nodfix2;break;case"slider":t=g2.symbol.slider;break;default:t=this.base?mec.node.g2BaseNode:g2.symbol.pol;break}const i=g2().use({grp:t,x:this.x,y:this.y,sh:this.sh});if(this.model.env.show.nodeLabels){const t=mec.node.locdir[this.idloc||"n"];i.txt({str:this.id||"?",x:this.x+3*this.r*t[0],y:this.y+3*this.r*t[1],thal:"center",tval:"middle",ls:this.model.env.show.txtColor,font:this.model.env.show.font})}return i},draw(t){if(this.model.env.show.nodes)t.ins(this)}},radius:5,locdir:{e:[1,0],ne:[Math.SQRT2/2,Math.SQRT2/2],n:[0,1],nw:[-Math.SQRT2/2,Math.SQRT2/2],w:[-1,0],sw:[-Math.SQRT2/2,-Math.SQRT2/2],s:[0,-1],se:[Math.SQRT2/2,-Math.SQRT2/2]},g2BaseNode:g2().cir({x:0,y:0,r:5,ls:"@nodcolor",fs:"@nodfill"}).p().m({x:0,y:5}).a({dw:Math.PI/2,x:-5,y:0}).l({x:5,y:0}).a({dw:-Math.PI/2,x:0,y:-5}).z().fill({fs:"@nodcolor"}),g2Node:g2().cir({x:0,y:0,r:5,ls:"@nodcolor",fs:"@nodfill"})};
/**
 * mec.constraint (c) 2018 Stefan Goessner
 * @license MIT License
 * @requires mec.core.js
 * @requires mec.node.js
 * @requires mec.drive.js
 * @requires mec.model.js
 * @requires g2.js
 */
"use strict";mec.constraint={extend(t){Object.setPrototypeOf(t,this.prototype);t.constructor();return t},prototype:{constructor(){},validate(t){let i,e=false;if(!this.id)return{mid:"E_ELEM_ID_MISSING",elemtype:"constraint",idx:t};if(this.model.elementById(this.id)!==this)return{mid:"E_ELEM_ID_AMBIGIOUS",id:this.id};if(!this.p1)return{mid:"E_CSTR_NODE_MISSING",id:this.id,loc:"start",p:"p1"};if(!this.p2)return{mid:"E_CSTR_NODE_MISSING",id:this.id,loc:"end",p:"p2"};if(typeof this.p1==="string"){if(!(i=this.model.nodeById(this.p1)))return{mid:"E_CSTR_NODE_NOT_EXISTS",id:this.id,loc:"start",p:"p1",nodeId:this.p1};else this.p1=i}if(typeof this.p2==="string"){if(!(i=this.model.nodeById(this.p2)))return{mid:"E_CSTR_NODE_NOT_EXISTS",id:this.id,loc:"end",p:"p2",nodeId:this.p2};else this.p2=i}if(mec.isEps(this.p1.x-this.p2.x)&&mec.isEps(this.p1.y-this.p2.y))e={mid:"W_CSTR_NODES_COINCIDE",id:this.id,p1:this.p1.id,p2:this.p2.id};if(!this.hasOwnProperty("ori"))this.ori={type:"free"};if(!this.hasOwnProperty("len"))this.len={type:"free"};if(!this.ori.hasOwnProperty("type"))this.ori.type="free";if(!this.len.hasOwnProperty("type"))this.len.type="free";if(typeof this.ori.ref==="string"){if(!(i=this.model.constraintById(this.ori.ref)))return{mid:"E_CSTR_REF_NOT_EXISTS",id:this.id,sub:"ori",ref:this.ori.ref};else this.ori.ref=i;if(this.ori.type==="drive"){if(this.ori.ref[this.ori.reftype||"ori"].type==="free")return{mid:"E_CSTR_DRIVEN_REF_TO_FREE",id:this.id,sub:"ori",ref:this.ori.ref.id,reftype:this.ori.reftype||"ori"};if(this.ratio!==undefined&&this.ratio!==1)return{mid:"E_CSTR_RATIO_IGNORED",id:this.id,sub:"ori",ref:this.ori.ref.id,reftype:this.ori.reftype||"ori"}}}if(typeof this.len.ref==="string"){if(!(i=this.model.constraintById(this.len.ref)))return{mid:"E_CSTR_REF_NOT_EXISTS",id:this.id,sub:"len",ref:this.len.ref};else this.len.ref=i;if(this.len.type==="drive"){if(this.len.ref[this.len.reftype||"len"].type==="free")return{mid:"E_CSTR_DRIVEN_REF_TO_FREE",id:this.id,sub:"len",ref:this.len.ref.id,reftype:this.len.reftype||"len"};if(this.ratio!==undefined&&this.ratio!==1)return{mid:"E_CSTR_RATIO_IGNORED",id:this.id,sub:"len",ref:this.ori.ref.id,reftype:this.ori.reftype||"len"}}}return e},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;const e=this.ori,s=this.len;this.initVector();this._angle=0;if(e.type==="free")this.init_ori_free(e);else if(e.type==="const")this.init_ori_const(e);else if(e.type==="drive")this.init_ori_drive(e);if(s.type==="free")this.init_len_free(s);else if(s.type==="const")this.init_len_const(s);else if(s.type==="drive")this.init_len_drive(s);this._angle=this.w0;this.sw=Math.sin(this.w);this.cw=Math.cos(this.w);this.lambda_r=this.dlambda_r=0;this.lambda_w=this.dlambda_w=0},initVector(){let t=false,i=false;if(this.len.hasOwnProperty("r0")){this.r0=this.len.r0;t=true;if(this.len.hasOwnProperty("ref")){if(this.len.reftype!=="ori")this.r0+=(this.len.ratio||1)*this.len.ref.r0}}else this.r0=Math.hypot(this.ay,this.ax);if(this.ori.hasOwnProperty("w0")){this.w0=this.ori.w0;i=true;if(this.ori.hasOwnProperty("ref")){if(this.ori.reftype!=="len")this.w0+=(this.ori.ratio||1)*this.ori.ref.w0}}else this.w0=Math.atan2(this.ay,this.ax);if(t||i){this.p2.x=this.p1.x+this.r0*Math.cos(this.w0);this.p2.y=this.p1.y+this.r0*Math.sin(this.w0)}},angle(t){return this._angle=mec.infAngle(this._angle,t)},reset(){this.initVector();this._angle=this.w0;this.lambda_r=this.dlambda_r=0;this.lambda_w=this.dlambda_w=0},get type(){const t=this.ori,i=this.len;return t.type==="free"&&i.type==="free"?"free":t.type==="free"&&i.type!=="free"?"rot":t.type!=="free"&&i.type==="free"?"tran":t.type!=="free"&&i.type!=="free"?"ctrl":"invalid"},get initialized(){return this.model!==undefined},get dof(){return(this.ori.type==="free"?1:0)+(this.len.type==="free"?1:0)},get lenTol(){return mec.tol.len[this.model.tolerance]},get force(){return-this.lambda_r},get forceAbs(){return-this.lambda_r},get moment(){return-this.lambda_w*this.r},get pole(){return{x:this.p1.x-this.p1.yt/this.wt,y:this.p1.y+this.p1.xt/this.wt}},get velPole(){return this.pole},get inflPole(){return{x:this.p1.x+this.p1.xtt/this.wt**2-this.wtt/this.wt**3*this.p1.xt,y:this.p1.y+this.p1.ytt/this.wt**2-this.wtt/this.wt**3*this.p1.yt}},get accPole(){const t=this.wt**2,i=this.wtt,e=i**2+t**2;return{x:this.p1.x+(t*this.p1.xtt-i*this.p1.ytt)/e,y:this.p1.y+(t*this.p1.ytt+i*this.p1.xtt)/e}},activeDriveCount(t){let i=this.ori,e=this.len,s=0;if(i.type==="drive"&&(i.input||t<=i.t0+i.Dt*(i.bounce?2:1)*(i.repeat||1)+.5*this.model.timer.dt))++s;if(e.type==="drive"&&(e.input||t<=e.t0+e.Dt*(e.bounce?2:1)*(e.repeat||1)+.5*this.model.timer.dt))++s;return s},dependsOn(t){return this.p1===t||this.p2===t||this.ori&&this.ori.ref===t||this.len&&this.len.ref===t},get ax(){return this.p2.x-this.p1.x},get ay(){return this.p2.y-this.p1.y},get axt(){return this.p2.xtcur-this.p1.xtcur},get ayt(){return this.p2.ytcur-this.p1.ytcur},get axtt(){return this.p2.xtt-this.p1.xtt},get aytt(){return this.p2.ytt-this.p1.ytt},get ori_C(){return this.ay*this.cw-this.ax*this.sw},get ori_Ct(){return this.ayt*this.cw-this.axt*this.sw-this.wt*this.r},get ori_mc(){const t=mec.toZero(this.p1.im+this.p2.im);return t?1/t:0},get len_C(){return this.ax*this.cw+this.ay*this.sw-this.r},get len_Ct(){return this.axt*this.cw+this.ayt*this.sw-this.rt},get len_mc(){let t=mec.toZero(this.p1.im+this.p2.im);return t?1/t:0},pre(t){let i=this.w;this.cw=Math.cos(i);this.sw=Math.sin(i);this.ori_impulse_vel(this.lambda_w*t);this.len_impulse_vel(this.lambda_r*t);this.dlambda_r=this.dlambda_w=0},post(t){this.lambda_w+=this.dlambda_w;this.ori_apply_Q(this.lambda_w);this.lambda_r+=this.dlambda_r;this.len_apply_Q(this.lambda_r)},posStep(){let t,i=this.w;this.cw=Math.cos(i);this.sw=Math.sin(i);return this.type==="free"?true:this.type==="rot"?this.len_pos():this.type==="tran"?this.ori_pos():this.type==="ctrl"?(t=this.ori_pos(),this.len_pos()&&t):false},velStep(t){let i;return this.type==="free"?true:this.type==="rot"?this.len_vel(t):this.type==="tran"?this.ori_vel(t):this.type==="ctrl"?(i=this.ori_vel(t),this.len_vel(t)&&i):false},ori_pos(){const t=this.ori_C,i=-this.ori_mc*t;this.ori_impulse_pos(i);if(this.ori.ref&&!this.ori.passive){const t=this.ori.ref;if(this.ori.reftype==="len")t.len_impulse_pos(-(this.ori.ratio||1)*i);else t.ori_impulse_pos(-(this.ori.ratio||1)*this.r/t.r*i)}return mec.isEps(t,mec.lenTol)},ori_vel(t){const i=this.ori_Ct,e=-this.ori_mc*i;this.ori_impulse_vel(e);this.dlambda_w+=e/t;if(this.ori.ref&&!this.ori.passive){const i=this.ori.ref,s=e*(this.ori.ratio||1);if(this.ori.reftype==="len"){i.len_impulse_vel(-s);i.dlambda_r-=s/t}else{const e=this.r/this.ori.ref.r*s;i.ori_impulse_vel(-e);i.dlambda_w-=e/t}}return mec.isEps(i*t,mec.lenTol)},ori_impulse_pos(t){this.p1.x+=this.p1.im*this.sw*t;this.p1.y+=-this.p1.im*this.cw*t;this.p2.x+=-this.p2.im*this.sw*t;this.p2.y+=this.p2.im*this.cw*t},ori_impulse_vel(t){this.p1.dxt+=this.p1.im*this.sw*t;this.p1.dyt+=-this.p1.im*this.cw*t;this.p2.dxt+=-this.p2.im*this.sw*t;this.p2.dyt+=this.p2.im*this.cw*t},ori_apply_Q(t){this.p1.Qx+=this.sw*t;this.p1.Qy+=-this.cw*t;this.p2.Qx+=-this.sw*t;this.p2.Qy+=this.cw*t},len_pos(){const t=this.len_C,i=-this.len_mc*t;this.len_impulse_pos(i);if(this.len.ref&&!this.len.passive){if(this.len.reftype==="ori")this.len.ref.ori_impulse_pos(-(this.len.ratio||1)*i);else this.len.ref.len_impulse_pos(-(this.len.ratio||1)*i)}return mec.isEps(t,mec.lenTol)},len_vel(t){const i=this.len_Ct,e=-this.len_mc*i;this.len_impulse_vel(e);this.dlambda_r+=e/t;if(this.len.ref&&!this.len.passive){const i=this.len.ref,s=e*(this.ori.ratio||1);if(this.len.reftype==="ori"){i.ori_impulse_vel(-s);i.dlambda_w-=s/t}else{i.len_impulse_vel(-s);i.dlambda_r-=s/t}}return mec.isEps(i*t,mec.lenTol)},len_impulse_pos(t){this.p1.x+=-this.p1.im*this.cw*t;this.p1.y+=-this.p1.im*this.sw*t;this.p2.x+=this.p2.im*this.cw*t;this.p2.y+=this.p2.im*this.sw*t},len_impulse_vel(t){this.p1.dxt+=-this.p1.im*this.cw*t;this.p1.dyt+=-this.p1.im*this.sw*t;this.p2.dxt+=this.p2.im*this.cw*t;this.p2.dyt+=this.p2.im*this.sw*t},len_apply_Q(t){this.p1.Qx+=-this.cw*t;this.p1.Qy+=-this.sw*t;this.p2.Qx+=this.cw*t;this.p2.Qy+=this.sw*t},init_ori_free(t){this.w0=t.hasOwnProperty("w0")?t.w0:this.angle(Math.atan2(this.ay,this.ax));mec.assignGetters(this,{w:()=>this.angle(Math.atan2(this.ay,this.ax)),wt:()=>(this.ayt*this.cw-this.axt*this.sw)/this.r,wtt:()=>(this.aytt*this.cw-this.axtt*this.sw)/this.r})},init_ori_const(t){if(!!t.ref){const i=t.ref=this.model.constraintById(t.ref)||t.ref,e=t.reftype||"ori",s=t.ratio||1;if(!i.initialized)i.init(this.model);if(e==="ori"){const e=t.hasOwnProperty("w0")?i.w0+t.w0:Math.atan2(this.ay,this.ax);mec.assignGetters(this,{w:()=>e+s*(i.w-i.w0),wt:()=>s*i.wt,wtt:()=>s*i.wtt,ori_C:()=>this.ay*this.cw-this.ax*this.sw-s*this.r/(i.r||1)*(i.ay*i.cw-i.ax*i.sw),ori_Ct:()=>this.ayt*this.cw-this.axt*this.sw-s*this.r/(i.r||1)*(i.ayt*i.cw-i.axt*i.sw),ori_mc:()=>{let t=mec.toZero(this.p1.im+this.p2.im)+s**2*this.r**2/(i.r||1)**2*mec.toZero(i.p1.im+i.p2.im);return t?1/t:0}})}else{const e=t.hasOwnProperty("w0")?i.w0+t.w0:Math.atan2(this.ay,this.ax);mec.assignGetters(this,{w:()=>e+s*(i.r-i.r0)/this.r,wt:()=>s*i.rt,wtt:()=>s*i.rtt,ori_C:()=>this.r*(this.angle(Math.atan2(this.ay,this.ax))-e)-s*(i.ax*i.cw+i.ay*i.sw-i.r0),ori_Ct:()=>this.ayt*this.cw-this.axt*this.sw-s*(i.axt*i.cw+i.ayt*i.sw),ori_mc:()=>{let t=mec.toZero(this.p1.im+this.p2.im)+s**2*mec.toZero(i.p1.im+i.p2.im);return t?1/t:0}})}}else{mec.assignGetters(this,{w:()=>this.w0,wt:()=>0,wtt:()=>0})}},init_ori_drive(t){this.w0=t.hasOwnProperty("w0")?t.w0:this.angle(Math.atan2(this.ay,this.ax));t.Dw=t.Dw||2*Math.PI;t.t0=t.t0||0;t.Dt=t.Dt||1;if(t.input){t.local_t=0;t.t=(()=>!this.model.state.preview?t.local_t:this.model.timer.t);t.inputCallbk=(i=>{t.local_t=i*Math.PI/180*t.Dt/t.Dw})}else t.t=(()=>this.model.timer.t);t.drive=mec.drive.create({func:t.func||t.input&&"static"||"linear",z0:t.ref?0:this.w0,Dz:t.Dw,t0:t.t0,Dt:t.Dt,t:t.t,bounce:t.bounce,repeat:t.repeat,args:t.args});if(!!t.ref){const i=t.ref=this.model.constraintById(t.ref)||t.ref,e=t.reftype||"ori",s=t.ratio||1;if(!i.initialized)i.init(this.model);if(e==="ori")mec.assignGetters(this,{w:()=>this.w0+(i.w-i.w0)+t.drive.f(),wt:()=>i.wt+t.drive.ft(),wtt:()=>i.wtt+t.drive.ftt(),ori_C:()=>this.r*(this.angle(Math.atan2(this.ay,this.ax))-this.w0)-this.r*(i.angle(Math.atan2(i.ay,i.ax))-i.w0)-this.r*t.drive.f(),ori_Ct:()=>{return this.ayt*this.cw-this.axt*this.sw-this.r/i.r*(i.ayt*i.cw-i.axt*i.sw)-this.r*t.drive.ft()},ori_mc:()=>{let t=mec.toZero(this.p1.im+this.p2.im)+this.r**2/i.r**2*mec.toZero(i.p1.im+i.p2.im);return t?1/t:0}});else mec.assignGetters(this,{w:()=>this.w0+s*(i.r-i.r0)+t.drive.f(),wt:()=>s*i.rt+t.drive.ft(),wtt:()=>s*i.rtt+t.drive.ftt()})}else{mec.assignGetters(this,{w:t.drive.f,wt:t.drive.ft,wtt:t.drive.ftt})}},init_len_free(t){mec.assignGetters(this,{r:()=>this.ax*this.cw+this.ay*this.sw,rt:()=>this.axt*this.cw+this.ayt*this.sw,rtt:()=>this.axtt*this.cw+this.aytt*this.sw})},init_len_const(t){if(!!t.ref){const i=t.ref=this.model.constraintById(t.ref)||t.ref,e=t.reftype||"len",s=t.ratio||1;if(!i.initialized)i.init(this.model);if(e==="len")mec.assignGetters(this,{r:()=>this.r0+s*(i.r-i.r0),rt:()=>s*i.rt,rtt:()=>s*i.rtt,len_C:()=>this.ax*this.cw+this.ay*this.sw-this.r0-s*(i.ax*i.cw+i.ay*i.sw-i.r0),len_Ct:()=>this.axt*this.cw+this.ayt*this.sw-s*(i.axt*i.cw+i.ayt*i.sw),len_mc:()=>{let t=mec.toZero(this.p1.im+this.p2.im)+s**2*mec.toZero(i.p1.im+i.p2.im);return t?1/t:0}});else mec.assignGetters(this,{r:()=>this.r0+s*i.r*(i.w-i.w0),rt:()=>s*i.wt,rtt:()=>s*i.wtt,len_C:()=>this.ax*this.cw+this.ay*this.sw-this.r0-s*i.r*(i.angle(Math.atan2(i.ay,i.ax))-i.w0),len_Ct:()=>this.axt*this.cw+this.ayt*this.sw-s*(i.ayt*i.cw-i.axt*i.sw),len_mc:()=>{let t=mec.toZero(this.p1.im+this.p2.im)+s**2*mec.toZero(i.p1.im+i.p2.im);return t?1/t:0}})}else{mec.assignGetters(this,{r:()=>this.r0,rt:()=>0,rtt:()=>0})}},init_len_drive(t){this.r0=t.hasOwnProperty("r0")?t.r0:Math.hypot(this.ay,this.ax);t.Dr=t.Dr||100;t.t0=t.t0||0;t.Dt=t.Dt||1;if(t.input){t.local_t=0;t.t=(()=>!this.model.state.preview?t.local_t:this.model.timer.t);t.inputCallbk=(i=>{t.local_t=i*t.Dt/t.Dr})}else t.t=(()=>this.model.timer.t);t.drive=mec.drive.create({func:t.func||t.input&&"static"||"linear",z0:t.ref?0:this.r0,Dz:t.Dr,t0:t.t0,Dt:t.Dt,t:t.t,bounce:t.bounce,repeat:t.repeat,args:t.args});if(!!t.ref){const i=t.ref=this.model.constraintById(t.ref)||t.ref,e=t.reftype||"len",s=t.ratio||1;if(!i.initialized)i.init(this.model);if(e==="len")mec.assignGetters(this,{r:()=>this.r0+s*(i.r-i.r0)+t.drive.f(),rt:()=>i.rt+t.drive.ft(),rtt:()=>i.rtt+t.drive.ftt(),len_C:()=>this.ax*this.cw+this.ay*this.sw-this.r0-(i.ax*i.cw+i.ay*i.sw-i.r0)-t.drive.f(),len_Ct:()=>this.axt*this.cw+this.ayt*this.sw-(i.axt*i.cw+i.ayt*i.sw)-t.drive.ft(),len_mc:()=>{let t=mec.toZero(this.p1.im+this.p2.im)+mec.toZero(i.p1.im+i.p2.im);return t?1/t:0}});else mec.assignGetters(this,{r:()=>this.r0+s*(i.w-i.w0)+t.drive.f(),rt:()=>s*i.wt+t.drive.ft(),rtt:()=>s*i.wtt+t.drive.ftt()})}else{mec.assignGetters(this,{r:t.drive.f,rt:t.drive.ft,rtt:t.drive.ftt})}},asJSON(){let t='{ "id":"'+this.id+'","p1":"'+this.p1.id+'","p2":"'+this.p2.id+'"';t+=this.hid?`,"hid":${this.hid}`:"";t+=this.txt?`,"txt":${this.txt}`:"";t+=this.idloc?`,"txt":${this.idloc}`:"";if(this.len&&!(this.len.type==="free")){t+=(this.len.type==="const"?',"len":{ "type":"const"':"")+(this.len.type==="drive"?',"len":{ "type":"drive"':"")+(this.len.ref?',"ref":"'+this.len.ref.id+'"':"")+(this.len.reftype?',"reftype":"'+this.len.reftype+'"':"")+(this.len.r0&&this.len.r0>1e-4?',"r0":'+this.len.r0:"")+(this.len.ratio&&Math.abs(this.len.ratio-1)>1e-4?',"ratio":'+this.len.ratio:"")+(this.len.func?',"func":"'+this.len.func+'"':"")+(this.len.arg?',"arg":"'+this.len.arg+'"':"")+(this.len.t0&&this.len.t0>1e-4?',"t0":'+this.len.t0:"")+(this.len.Dt?',"Dt":'+this.len.Dt:"")+(this.len.Dr?',"Dr":'+this.len.Dr:"")+(this.len.bounce?',"bounce":true':"")+(this.len.input?',"input":true':"")+" }"}if(this.ori&&!(this.ori.type==="free")){t+=(this.ori.type==="const"?',"ori":{ "type":"const"':"")+(this.ori.type==="drive"?',"ori":{ "type":"drive"':"")+(this.ori.ref?',"ref":"'+this.ori.ref.id+'"':"")+(this.ori.reftype?',"reftype":"'+this.ori.reftype+'"':"")+(this.ori.w0&&this.ori.w0>1e-4?',"r0":'+this.ori.w0:"")+(this.ori.ratio&&Math.abs(this.ori.ratio-1)>1e-4?',"ratio":'+this.ori.ratio:"")+(this.ori.func?',"func":"'+this.ori.func+'"':"")+(this.ori.arg?',"arg":"'+this.ori.arg+'"':"")+(this.ori.t0&&this.ori.t0>1e-4?',"t0":'+this.ori.t0:"")+(this.ori.Dt?',"Dt":'+this.ori.Dt:"")+(this.ori.Dw?',"Dw":'+this.ori.Dw:"")+(this.ori.bounce?',"bounce":true':"")+(this.ori.input?',"input":true':"")+" }"}t+=" }";return t},get showInfo(){return this.state&g2.OVER},get infos(){return{id:()=>`'${this.id}'`,pos:()=>`r=${this.r.toFixed(1)},&phi;=${mec.toDeg(this.w).toFixed(0)%360}°`,vel:()=>`rt=${mec.to_m(this.rt).toFixed(2)}m/s,&phi;t=${this.wt.toFixed(2)}rad/s`,load:()=>`F=${mec.toZero(mec.to_N(this.force)).toPrecision(3)},M=${mec.toZero(mec.toDeg(this.moment)).toPrecision(3)}`}},info(t){const i=this.infos[t];return i?i():"?"},get isSolid(){return false},get sh(){return this.state&g2.OVER?[0,0,10,this.model.env.show.hoveredElmColor]:this.state&g2.EDIT?[0,0,10,this.model.env.show.selectedElmColor]:false},hitContour({x:t,y:i,eps:e}){const s=this.p1,r=this.p2,h=this.p2.x-this.p1.x,n=this.p2.y-this.p1.y,o=Math.hypot(n,h)||0,d=o?2*mec.node.radius/o:0;return g2.isPntOnLin({x:t,y:i},{x:s.x+d*h,y:s.y+d*n},{x:r.x-d*h,y:r.y-d*n},e)},get color(){return this.model.valid?this.ls||this.model.env.show.validConstraintColor:this.model.env.show.colors.invalidConstraintColor},g2(){const{p1:t,w:i,r:e,type:s,id:r,idloc:h,txt:n}=this,o=g2().beg({x:t.x,y:t.y,w:i,scl:1,lw:2,ls:this.model.env.show.constraintVectorColor,fs:"@ls",lc:"round",sh:this.sh}).p();if(this.model.env.show.constraintVector){o.m({x:!this.ls&&e>50?50:0,y:0})}else{o.m({x:0,y:0})}o.l({x:e,y:0}).stroke({ls:this.color,lw:this.lw||2,ld:this.ld||[],lsh:true});const d=this.model.env.show.constraintVector?this.model.env.show.constraintVectorColor:"transparent";o.drw({d:mec.constraint.arrow[s],lsh:true,ls:d,fs:d}).end();if(this.model.env.show.constraintLabels){let i=this.txt||r||"?";let e=this.cw,s=this.sw,n=h==="left"?.5:h==="right"?-.5:h+0===h?h:.5,d=Math.abs(n)*45,l=n>0?10:-15,a=t.x+d*e-l*s,f=t.y+d*s+l*e;if(this.ori.type==="ref"||this.len.type==="ref"){const t=this.ori.type==="ref"&&this.len.type==="ref"?",":"";i+="("+(this.ori.type==="ref"?this.ori.ref.id:"")+t+(this.len.type==="ref"?this.len.ref.id:"")+")";a-=3*s;f+=3*e}o.txt({str:i,x:a,y:f,thal:"center",tval:"middle",ls:this.model.env.show.txtColor,font:this.model.env.show.font})}return o},draw(t){if(this.model.env.show.constraints)t.ins(this)}},arrow:{ctrl:"M0,0 35,0M45,0 36,-3 37,0 36,3 Z",rot:"M12,0 8,6 12,0 8,-6Z M0,0 8,0M15,0 35,0M45,0 36,-3 37,0 36,3 Z",tran:"M0,0 12,0M16,0 18,0M22,0 24,0 M28,0 35,0M45,0 36,-3 37,0 36,3 Z",free:"M12,0 8,6 12,0 8,-6ZM0,0 8,0M15,0 18,0M22,0 24,0 M28,0 35,0M45,0 36,-3 37,0 36,3 Z"}};
/**
 * mec.drive (c) 2018 Stefan Goessner
 * @license MIT License
 * @requires mec.core.js
 */
"use strict";mec.drive={create({func:t,z0:i,Dz:e,t0:s,Dt:r,t:h,bounce:n,repeat:o,args:d}){const l=(t,i,e)=>t>=i&&t<e;let a=t&&t in mec.drive?mec.drive[t]:mec.drive.linear,f=r;if(typeof a==="function"){a=a(d)}if(n&&t!=="static"){a=mec.drive.bounce(a);f*=2}if(o&&t!=="static"){a=mec.drive.repeat(a,o);f*=o}return{f:()=>i+a.f(Math.max(0,Math.min((h()-s)/f,1)))*e,ft:()=>l(h(),s,s+f)?a.fd((h()-s)/f)*e/r:0,ftt:()=>l(h(),s,s+f)?a.fdd((h()-s)/f)*e/r/r:0}},const:{f:t=>0,fd:t=>0,fdd:t=>0},linear:{f:t=>t,fd:t=>1,fdd:t=>0},quadratic:{f:t=>t<=.5?2*t*t:-2*t*t+4*t-1,fd:t=>t<=.5?4*t:-4*t+4,fdd:t=>t<=.5?4:-4},harmonic:{f:t=>(1-Math.cos(Math.PI*t))/2,fd:t=>Math.PI/2*Math.sin(Math.PI*t),fdd:t=>Math.PI*Math.PI/2*Math.cos(Math.PI*t)},sinoid:{f:t=>t-Math.sin(2*Math.PI*t)/2/Math.PI,fd:t=>1-Math.cos(2*Math.PI*t),fdd:t=>Math.sin(2*Math.PI*t)*2*Math.PI},poly5:{f:t=>(10-15*t+6*t*t)*t*t*t,fd:t=>(30-60*t+30*t*t)*t*t,fdd:t=>(60-180*t+120*t*t)*t},static:{f:t=>t,fd:t=>0,fdd:t=>0},seq(t){let i=Number.POSITIVE_INFINITY,e=Number.NEGATIVE_INFINITY,s=0,r=0,h=0,n=i=>{let e=0,s=0,r;for(const n of t){r=n.dz||0;if(e<=i&&i<=e+n.dt){return{f:s+mec.drive[n.func].f((i-e)/n.dt)*r,fd:mec.drive[n.func].fd((i-e)/n.dt)*r/h,fdd:mec.drive[n.func].fdd((i-e)/n.dt)*r/h/h}}e+=n.dt;s+=r}return{}};for(const r of t){if(typeof r.func==="string"){h+=r.dt;s+=r.dz||0;i=Math.min(s,i);e=Math.max(s,e)}}r=e-i;return{f:t=>(n(t*h).f-i)/r,fd:t=>n(t*h).fd/r,fdd:t=>0}},bounce(t){if(typeof t==="string")t=mec.drive[t];return{f:i=>t.f(i<.5?2*i:2-2*i),fd:i=>t.fd(i<.5?2*i:2-2*i)*(i<.5?1:-1),fdd:i=>t.fdd(i<.5?2*i:2-2*i)*(i<.5?1:-1)}},repeat(t,i){if(typeof t==="string")t=mec.drive[t];return{f:e=>t.f(e*i%1),fd:e=>t.fd(e*i%1),fdd:e=>t.fdd(e*i%1)}},pot:[{f:t=>1,fd:t=>0,fdd:t=>0},{f:t=>t,fd:t=>1,fdd:t=>0},{f:t=>t*t,fd:t=>2*t,fdd:t=>2},{f:t=>t*t*t,fd:t=>3*t*t,fdd:t=>6*t},{f:t=>t*t*t*t,fd:t=>4*t*t*t,fdd:t=>12*t*t},{f:t=>t*t*t*t*t,fd:t=>5*t*t*t*t,fdd:t=>20*t*t*t}],inPot(t){return this.pot[t]},outPot(t){const i=this.pot[t];return{f:t=>1-i.f(1-t),fd:t=>i.fd(1-t),fdd:t=>-i.fdd(1-t)}},inOutPot(t){const i=this.pot[t],e=Math.pow(2,t-1);return{f:t=>t<.5?e*i.f(t):1-e*i.f(1-t),fd:t=>t<.5?e*i.fd(t):e*i.fd(1-t),fdd:s=>s<.5?e*(t-1)*i.fdd(s):-e*(t-1)*i.fdd(1-s)}},get inQuad(){return this.inPot(2)},get outQuad(){return this.outPot(2)},get inOutQuad(){return this.inOutPot(2)},get inCubic(){return this.inPot(3)},get outCubic(){return this.outPot(3)},get inOutCubic(){return this.inOutPot(3)},get inQuart(){return this.inPot(4)},get outQuart(){return this.outPot(4)},get inOutQuart(){return this.inOutPot(4)},get inQuint(){return this.inPot(5)},get outQuint(){return this.outPot(5)},get inOutQuint(){return this.inOutPot(5)}};
/**
 * mec.load (c) 2018 Stefan Goessner
 * @license MIT License
 * @requires mec.core.js
 * @requires mec.node.js
 * @requires mec.constraint.js
 * @requires mec.model.js
 * @requires g2.js
 */
"use strict";mec.load={extend(t){if(!t.type)t.type="force";if(mec.load[t.type]){Object.setPrototypeOf(t,mec.load[t.type]);t.constructor()}return t}};mec.load.force={constructor(){},validate(t){let i=false;if(!this.id)i={mid:"W_ELEM_ID_MISSING",elemtype:"force",idx:t};if(this.p===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"force",id:this.id,reftype:"node",name:"p"};if(!this.model.nodeById(this.p))return{mid:"E_ELEM_INVALID_REF",elemtype:"force",id:this.id,reftype:"node",name:this.p};else this.p=this.model.nodeById(this.p);if(this.wref&&!this.model.constraintById(this.wref))return{mid:"E_ELEM_INVALID_REF",elemtype:"force",id:this.id,reftype:"constraint",name:"wref"};else this.wref=this.model.constraintById(this.wref);if(typeof this.value==="number"&&mec.isEps(this.value))return{mid:"E_FORCE_VALUE_INVALID",val:this.value,id:this.id};return i},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.w0=typeof this.w0==="number"?this.w0:0},get _value(){return mec.from_N(this.value||1)},dependsOn(t){return this.p===t||this.wref===t},asJSON(){return'{ "type":"'+this.type+'","id":"'+this.id+'","p":"'+this.p.id+'"'+(!!this.mode&&this.mode==="push"?',"mode":"push"':"")+(this.w0&&Math.abs(this.w0)>.001?',"w0":'+this.w0:"")+(this.wref?',"wref":'+this.wref.id+'"':"")+(this._value&&Math.abs(this._value-mec.from_N(1))>.01?',"value":'+mec.to_N(this._value):"")+" }"},get w(){return this.wref?this.wref.w+this.w0:this.w0},get Qx(){return this._value*Math.cos(this.w)},get Qy(){return this._value*Math.sin(this.w)},get energy(){return 0},reset(){},apply(){this.p.Qx+=this.Qx;this.p.Qy+=this.Qy},get forceAbs(){return this._value},get isSolid(){return false},get sh(){return this.state&g2.OVER?[0,0,10,this.model.env.show.hoveredElmColor]:this.state&g2.EDIT?[0,0,10,this.model.env.show.selectedElmColor]:false},hitContour({x:t,y:i,eps:e}){const s=mec.load.force.arrowLength,r=this.p,h=this.w,n=h?Math.cos(h):1,o=h?Math.sin(h):0,d=2*mec.node.radius,l=this.mode==="push"?r.x-(s+d)*n:r.x+d*n,a=this.mode==="push"?r.y-(s+d)*o:r.y+d*o;return g2.isPntOnLin({x:t,y:i},{x:l,y:a},{x:l+s*n,y:a+s*o},e)},g2(){const t=this.w,i=t?Math.cos(t):1,e=t?Math.sin(t):0,s=this.p,r=mec.load.force.arrowLength,h=2*mec.node.radius,n=this.mode==="push"?s.x-(r+h)*i:s.x+h*i,o=this.mode==="push"?s.y-(r+h)*e:s.y+h*e,d=g2().p().use({grp:mec.load.force.arrow,x:n,y:o,w:t,lw:2,ls:this.model.env.show.forceColor,lc:"round",sh:this.sh,fs:"@ls"});if(this.model.env.show.loadLabels&&this.id){const t=this.mode==="push"?1:1,s=this.idloc==="right"?-1:1,r=n+t*25*i-12*s*e,h=o+t*25*e+12*s*i;d.txt({str:this.id,x:r,y:h,thal:"center",tval:"middle",ls:this.model.env.show.txtColor})}return d},draw(t){t.ins(this)}};mec.load.force.arrowLength=45;mec.load.force.arrow=g2().p().m({x:0,y:0}).l({x:35,y:0}).m({x:45,y:0}).l({x:36,y:-3}).l({x:37,y:0}).l({x:36,y:3}).z().drw();mec.load.spring={constructor(){},validate(t){let i=false;if(!this.id)i={mid:"W_ELEM_ID_MISSING",elemtype:"spring",idx:t};if(this.p1===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"spring",id:this.id,reftype:"node",name:"p1"};if(!this.model.nodeById(this.p1))return{mid:"E_ELEM_INVALID_REF",elemtype:"spring",id:this.id,reftype:"node",name:this.p1};else this.p1=this.model.nodeById(this.p1);if(this.p2===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"spring",id:this.id,reftype:"node",name:"p2"};if(!this.model.nodeById(this.p2))return{mid:"E_ELEM_INVALID_REF",elemtype:"spring",id:this.id,reftype:"node",name:this.p2};else this.p2=this.model.nodeById(this.p2);if(typeof this.k==="number"&&mec.isEps(this.k))return{mid:"E_SPRING_RATE_INVALID",id:this.id,val:this.k};return i},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.len0=typeof this.len0==="number"?this.len0:Math.hypot(this.p2.x-this.p1.x,this.p2.y-this.p1.y)},get _k(){return mec.from_N_m(this.k||.01)},dependsOn(t){return this.p1===t||this.p2===t},asJSON(){return'{ "type":"'+this.type+'","id":"'+this.id+'","p1":"'+this.p1.id+'","p2":"'+this.p2.id+'"'+(this._k&&Math.abs(this._k-mec.from_N_m(.01))>.01?',"k":'+mec.to_N_m(this._k):"")+(this.len0&&Math.abs(this.len0-Math.hypot(this.p2.x0-this.p1.x0,this.p2.y0-this.p1.y0))>1e-4?',"len0":'+this.len0:"")+" }"},get len(){return Math.hypot(this.p2.y-this.p1.y,this.p2.x-this.p1.x)},get w(){return Math.atan2(this.p2.y-this.p1.y,this.p2.x-this.p1.x)},get force(){return this._k*(this.len-this.len0)},get Qx(){return this.force*Math.cos(this.w)},get Qy(){return this.force*Math.sin(this.w)},get energy(){return.5*this._k*(this.len-this.len0)**2},reset(){},apply(){const t=this.force,i=this.w,e=t*Math.cos(i),s=t*Math.sin(i);this.p1.Qx+=e;this.p1.Qy+=s;this.p2.Qx-=e;this.p2.Qy-=s},get forceAbs(){return this.force},get isSolid(){return false},get sh(){return this.state&g2.OVER?[0,0,10,this.model.env.show.hoveredElmColor]:this.state&g2.EDIT?[0,0,10,this.model.env.show.selectedElmColor]:false},hitContour({x:t,y:i,eps:e}){const s=this.p1,r=this.p2,h=this.w,n=h?Math.cos(h):1,o=h?Math.sin(h):0,d=2*mec.node.radius;return g2.isPntOnLin({x:t,y:i},{x:s.x+d*n,y:s.y+d*o},{x:r.x-d*n,y:r.y-d*o},e)},g2(){const t=16,i=this.p1.x,e=this.p1.y,s=this.p2.x-i,r=this.p2.y-e,h=Math.hypot(r,s),n=Math.atan2(r,s),o=h/2,d=2*mec.node.radius,l=g2().beg({x:i,y:e,w:n}).p().m({x:d,y:0}).l({x:o-t/2,y:0}).l({x:o-t/6,y:-t/2}).l({x:o+t/6,y:t/2}).l({x:o+t/2,y:0}).l({x:h-d,y:0}).stroke({ls:this.model.env.show.springColor,lw:2,lc:"round",lj:"round",sh:this.sh,lsh:true}).end();if(this.model.env.show.loadLabels&&this.id){const t=h?s/h:1,n=h?r/h:0,o=this.idloc,d=o==="left"?.5:o==="right"?-.5:o+0===o?o:.5,a=Math.abs(d)*h,f=d>0?20:-25;l.txt({str:this.id,x:i+a*t-f*n,y:e+a*n+f*t,thal:"center",tval:"middle",ls:this.model.env.show.txtColor})}return l},draw(t){t.ins(this)}};
/**
 * mec.view (c) 2018 Stefan Goessner
 * @license MIT License
 * @requires mec.core.js
 * @requires mec.node.js
 * @requires mec.constraint.js
 * @requires mec.model.js
 * @requires g2.js
 */
"use strict";mec.view={extend(t){if(t.as&&mec.view[t.as]){Object.setPrototypeOf(t,mec.view[t.as]);t.constructor()}return t}};mec.view.point={constructor(){},validate(t){if(this.of===undefined)return{mid:"E_ELEM_MISSING",elemtype:"view as point",id:this.id,idx:t,reftype:"element",name:"of"};if(!this.model.elementById(this.of))return{mid:"E_ELEM_INVALID_REF",elemtype:"view as point",id:this.id,idx:t,reftype:"element",name:this.of};else this.of=this.model.elementById(this.of);if(this.show&&!(this.show in this.of))return{mid:"E_ALY_PROP_INVALID",elemtype:"view as point",id:this.id,idx:t,reftype:this.of,name:this.show};return false},init(t,i){this.model=t;this.model.notifyValid(this.validate(i));this.p=Object.assign({},this.of[this.show]);this.p.r=this.r},dependsOn(t){return this.of===t||this.ref===t},reset(){Object.assign(this.p,this.of[this.show])},post(){Object.assign(this.p,this.of[this.show])},asJSON(){return'{ "show":"'+this.show+'","of":"'+(this.show==="cog"?"model":this.of.id)+'","as":"point" }'},get r(){return 6},get isSolid(){return true},get sh(){return this.state&g2.OVER?[0,0,10,this.model.env.show.hoveredElmColor]:false},hitInner({x:t,y:i,eps:e}){return g2.isPntInCir({x:t,y:i},this.p,e)},g2(){return this.g2cache||(this.g2cache=g2().beg({x:()=>this.p.x,y:()=>this.p.y,sh:()=>this.sh}).cir({r:6,fs:"snow"}).cir({r:2.5,fs:"@ls",ls:"transparent"}).end())},draw(t){t.ins(this)}};mec.view.vector={constructor(){},validate(t){if(this.show===undefined)return{mid:"E_SHOW_PROP_MISSING",elemtype:"view as vector",id:this.id,idx:t,name:"show"};if(this.of===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"view as vector",id:this.id,idx:t,reftype:"node",name:"of"};if(!this.model.elementById(this.of))return{mid:"E_ELEM_INVALID_REF",elemtype:"view as vector",id:this.id,idx:t,reftype:"node",name:this.of};else this.of=this.model.elementById(this.of);if(this.at===undefined){if("pos"in this.of)Object.defineProperty(this,"anchor",{get:()=>this.of["pos"],enumerable:true,configurable:true});else return{mid:"E_SHOW_VEC_ANCHOR_MISSING",elemtype:"view as vector",id:this.id,idx:t,name:"at"}}else{if(this.model.nodeById(this.at)){let t=this.model.nodeById(this.at);Object.defineProperty(this,"anchor",{get:()=>t["pos"],enumerable:true,configurable:true})}else if(this.at in this.of)Object.defineProperty(this,"anchor",{get:()=>this.of[this.at],enumerable:true,configurable:true});else return{mid:"E_SHOW_VEC_ANCHOR_INVALID",elemtype:"view as vector",id:this.id,idx:t,name:"at"}}return false},init(t,i){this.model=t;this.model.notifyValid(this.validate(i));this.p=Object.assign({},this.anchor);this.v=Object.assign({},this.of[this.show])},dependsOn(t){return this.of===t||this.at===t},update(){Object.assign(this.p,this.anchor);Object.assign(this.v,this.of[this.show]);const t=Math.hypot(this.v.y,this.v.x);const i=!mec.isEps(t,.5)?mec.asympClamp(mec.aly[this.show].drwscl*t,25,100):0;this.v.x*=i/t;this.v.y*=i/t},reset(){this.update()},post(){this.update()},asJSON(){return'{ "show":"'+this.show+'","of":"'+this.of.id+'","as":"vector"'+(this.id?',"id":"'+this.id+'"':"")+" }"},get isSolid(){return false},get sh(){return this.state&g2.OVER?[0,0,10,this.model.env.show.hoveredElmColor]:false},hitContour({x:t,y:i,eps:e}){const s=this.p,r=this.v;return g2.isPntOnLin({x:t,y:i},s,{x:s.x+r.x,y:s.y+r.y},e)},g2(){return this.g2cache||(this.g2cache=g2().vec({x1:()=>this.p.x,y1:()=>this.p.y,x2:()=>this.p.x+this.v.x,y2:()=>this.p.y+this.v.y,ls:this.stroke||this.model.env.show[this.show+"VecColor"],lw:1.5,sh:this.sh}))},draw(t){t.ins(this)}};mec.view.trace={constructor(){this.pts=[]},validate(t){if(this.of===undefined)return{mid:"E_ELEM_MISSING",elemtype:"view as trace",id:this.id,idx:t,reftype:"element",name:"of"};if(!this.model.elementById(this.of))return{mid:"E_ELEM_INVALID_REF",elemtype:"view as trace",id:this.id,idx:t,reftype:"element",name:this.of};else this.of=this.model.elementById(this.of);if(this.show&&!(this.show in this.of))return{mid:"E_ALY_INVALID_PROP",elemtype:"view as trace",id:this.id,idx:t,reftype:this.of,name:this.show};if(this.ref&&!this.model.constraintById(this.ref))return{mid:"E_ELEM_INVALID_REF",elemtype:"view as trace",id:this.id,idx:t,reftype:"constraint",name:this.ref};else this.ref=this.model.constraintById(this.ref);if(this.p){if(!this.model.nodeById(this.p))return{mid:"E_ELEM_INVALID_REF",elemtype:"trace",id:this.id,idx:t,reftype:"node",name:this.p};else{this.show="pos";this.of=this.model.nodeById(this.p)}}return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.t0=this.t0||0;this.Dt=this.Dt||1;this.mode=this.mode||"dynamic";this.pts.length=0},dependsOn(t){return this.of===t||this.ref===t||this.p===t},addPoint(){const t=this.model.timer.t,i=this.of[this.show],e=this.ref?Math.sin(this.ref.w):0,s=this.ref?Math.cos(this.ref.w):1,r=i.x-(this.ref?this.ref.p1.x:0),h=i.y-(this.ref?this.ref.p1.y:0),n={x:s*r+e*h,y:-e*r+s*h};if(this.mode==="static"||this.mode==="preview"){if(this.t0<=t&&t<=this.t0+this.Dt)this.pts.push(n)}else if(this.mode==="dynamic"){if(this.t0<t)this.pts.push(n);if(this.t0+this.Dt<t)this.pts.shift()}},preview(){if(this.mode==="preview"&&this.model.valid)this.addPoint()},reset(t){if(t||this.mode!=="preview")this.pts.length=0},post(t){if(this.mode!=="preview"&&this.model.valid)this.addPoint()},asJSON(){return'{ "show":"'+this.show+'","of":"'+(this.show==="cog"?"model":this.of.id)+'","as":"'+this.as+'"'+(this.ref?',"ref":'+this.ref.id:"")+(this.mode!=="dynamic"?',"mode":"'+this.mode+'"':"")+(this.id?',"id":"'+this.id+'"':"")+(this.Dt!==1?',"Dt":'+this.Dt:"")+(this.stroke&&!(this.stroke==="navy")?',"stroke":"'+this.stroke+'"':"")+(this.fill&&!(this.stroke==="transparent")?',"fill":"'+this.fill+'"':"")+" }"},get isSolid(){return false},get sh(){return this.state&g2.OVER?[0,0,10,this.model.env.show.hoveredElmColor]:false},hitContour({x:t,y:i,eps:e}){return false},g2(){return this.g2cache||(this.g2cache=g2().ply({pts:this.pts,format:"{x,y}",x:this.ref?()=>this.ref.p1.x:0,y:this.ref?()=>this.ref.p1.y:0,w:this.ref?()=>this.ref.w:0,ls:this.stroke||"navy",lw:1.5,fs:this.fill||"transparent",sh:()=>this.sh}))},draw(t){t.ins(this)}};mec.view.info={constructor(){},validate(t){if(this.of===undefined)return{mid:"E_ELEM_MISSING",elemtype:"view as info",id:this.id,idx:t,reftype:"element",name:"of"};if(!this.model.elementById(this.of))return{mid:"E_ELEM_INVALID_REF",elemtype:"view as info",id:this.id,idx:t,reftype:"element",name:this.of};else this.of=this.model.elementById(this.of);if(this.show&&!(this.show in this.of))return{mid:"E_ALY_PROP_INVALID",elemtype:"view as infot",id:this.id,idx:t,reftype:this.of,name:this.show};return false},init(t,i){this.model=t;this.model.notifyValid(this.validate(i))},dependsOn(t){return this.of===t},reset(){},asJSON(){return'{ "show":"'+this.show+'","of":"'+this.of.id+'","as":"info"'+(this.id?',"id":"'+this.id+'"':"")+" }"},get hasInfo(){return this.of.state===g2.OVER},infoString(){if(this.show in this.of){const t=this.of[this.show];const i=mec.aly[this.name||this.show];const e=i.type;const s=this.of.type==="node"&&this.model.env.show.nodeScaling?1.5:1;const r=t=>(t*i.scl/s).toPrecision(3);return(i.name||this.show)+": "+(e==="vec"?"{x:"+r(t.x)+",y:"+r(t.y)+"}":r(t))+" "+i.unit}return"?"},draw(t){}};mec.view.chart={constructor(){},validate(t){const i={elemtype:"view as chart",id:this.id,idx:t};if(this.of===undefined)return{mid:"E_ELEM_MISSING",...i,reftype:"element",name:"of"};if(this.against.of===undefined)return{mod:"E_ELEM_MISSING",...i,reftype:"element",name:"of in against"};const e=this.model.elementById(this.against.of)||this.model[this.against.of];const s=this.model.elementById(this.of)||this.model[this.of];if(!e)return{mid:"E_ELEM_INVALID_REF",...i,reftype:"element",name:this.against.of};if(!s)return{mid:"E_ELEM_INVALID_REF",...i,reftype:"element",anme:this.of};if(this.show&&!(this.show in s))return{mid:"E_ALY_INVALID_PROP",...i,reftype:this.of,name:this.show};if(this.against.show&&!(this.against.show in e))return{mid:"E_ALY_INVALID_PROP",...i,reftype:this.against.of,name:this.against.show};return false},elem(t){const i=this.model.elementById(t.of)||this.model[t.of]||undefined;return i?i[t.show]:undefined},aly(t){return mec.aly[t.show]||{get scl(){return 1},type:"num",name:t.show,unit:t.unit||""}},getAxis({show:t,of:i}){const e=()=>this.model.env.show.txtColor;const s=`${t} ${i!=="timer"?`of ${i}`:""} [ ${this.aly({show:t,of:i}).unit} ]`;return{title:{text:s,style:{font:"12px serif",fs:e}},labels:{style:{fs:e}},origin:true,grid:true}},init(t,i){this.model=t;this.mode=this.mode||"static";this.canvas=this.canvas||false;this.t0=this.t0||0;this.Dt=this.Dt||1;this.against=Object.assign({show:"t",of:"timer"},{...this.against});if(!this.model.notifyValid(this.validate(i))){return}this.graph=Object.assign({x:0,y:0,funcs:[{data:[]}],xaxis:Object.assign(this.getAxis(this.against)),yaxis:Object.assign(this.getAxis(this))},this)},get local_t(){if(this.mode!=="preview"){return undefined}const t=this.model.inputControlledDrives[0]&&this.model.inputControlledDrives[0].constraint;if(!t){return undefined}if(t.ori.type==="drive"){return t.ori.t()}else if(t.len.type==="drive"){return t.len.t()}},get currentY(){return this.aly(this).scl*this.elem(this)},get currentX(){return this.aly(this.against).scl*this.elem(this.against)},get previewNod(){const t=this.graph.funcs[0].data;if(this.mode!=="preview"||!this.graph.xAxis||this.model.env.editing){return undefined}const i=t.findIndex(t=>t.t>this.local_t);return i===-1?{x:0,y:0,scl:0}:{...this.graph.pntOf(t[i]||{x:0,y:0}),scl:1}},dependsOn(t){return this.against.of===t||this.of===t},addPoint(){const t=this.graph.funcs[0].data;if(this.t0>=this.model.timer.t){return}const i=this.model.timer.t<=this.t0+(this.Dt||0);if(this.mode!=="dynamic"&&!i){return}t.push({x:this.currentX,y:this.currentY,t:this.local_t});i||t.shift();const e=this.graph;[e.xmin,e.xmax,e.ymin,e.ymax]=[]},preview(){if(this.mode==="preview"){this.addPoint()}},reset(t){if(this.graph&&(t||this.mode!=="preview")){this.graph.funcs[0].data=[]}},post(){if(this.mode!=="preview"){this.addPoint()}},asJSON(){return JSON.stringify({as:this.as,id:this.id,canvas:this.canvas,x:this.x,y:this.y,b:this.b,h:this.h,t0:this.t0,Dt:this.Dt,mode:this.mode,cnv:this.cnv,against:this.against,show:this.show,of:this.of})},draw(t){if(!this.canvas){t.chart(this.graph);if(this.mode==="preview"){t.nod({x:()=>this.previewNod.x,y:()=>this.previewNod.y,scl:()=>this.previewNod.scl})}return t}}};
/**
 * mec.shape (c) 2018 Stefan Goessner
 * @license MIT License
 * @requires mec.core.js
 * @requires mec.node.js
 * @requires mec.constraint.js
 * @requires mec.model.js
 * @requires g2.js
 */
"use strict";mec.shape={extend(t){if(t.type&&mec.shape[t.type]){Object.setPrototypeOf(t,mec.shape[t.type]);t.constructor()}return t}};mec.shape.fix={validate(t){if(this.p===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"shape",id:this.id,idx:t,reftype:"node",name:"p"};if(!this.model.nodeById(this.p))return{mid:"E_ELEM_INVALID_REF",elemtype:"shape",id:this.id,idx:t,reftype:"node",name:this.p};else this.p=this.model.nodeById(this.p);return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.w0=this.w0||0},dependsOn(t){return this.p===t},asJSON(){return'{ "type":"'+this.type+'","p":"'+this.p.id+'"'+(this.w0&&this.w0>1e-4?',"w0":'+this.w0:"")+" }"},draw(t){t.nodfix({x:()=>this.p.x,y:()=>this.p.y,w:this.w0||0})}},mec.shape.flt={validate(t){if(this.p===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"shape",id:this.id,idx:t,reftype:"node",name:"p"};if(!this.model.nodeById(this.p))return{mid:"E_ELEM_INVALID_REF",elemtype:"shape",id:this.id,idx:t,reftype:"node",name:this.p};else this.p=this.model.nodeById(this.p);return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.w0=this.w0||0},dependsOn(t){return this.p===t},asJSON(){return'{ "type":"'+this.type+'","p":"'+this.p.id+'"'+(this.w0&&this.w0>1e-4?',"w0":'+this.w0:"")+" }"},draw(t){t.nodflt({x:()=>this.p.x,y:()=>this.p.y,w:this.w0||0})}};mec.shape.slider={validate(t){if(this.p===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"slider",id:this.id,idx:t,reftype:"node",name:"p"};if(!this.model.nodeById(this.p))return{mid:"E_ELEM_INVALID_REF",elemtype:"slider",id:this.id,idx:t,reftype:"node",name:this.p};else this.p=this.model.nodeById(this.p);if(this.wref&&!this.model.constraintById(this.wref))return{mid:"E_ELEM_INVALID_REF",elemtype:"slider",id:this.id,idx:t,reftype:"constraint",name:this.wref};else this.wref=this.model.constraintById(this.wref);return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.w0=this.w0||0},dependsOn(t){return this.p===t||this.wref===t},asJSON(){return'{ "type":"'+this.type+'","p":"'+this.p.id+'"'+(this.w0&&this.w0>1e-4?',"w0":'+this.w0:"")+(this.wref?',"wref":"'+this.wref.id+'"':"")+" }"},draw(t){const i=this.wref?()=>this.wref.w:this.w0||0;t.beg({x:()=>this.p.x,y:()=>this.p.y,w:i}).rec({x:-16,y:-10,b:32,h:20,ls:"@nodcolor",fs:"@linkfill",lw:1,lj:"round"}).end()}};mec.shape.bar={validate(t){if(this.p1===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"bar",id:this.id,idx:t,reftype:"node",name:"p1"};if(!this.model.nodeById(this.p1))return{mid:"E_ELEM_INVALID_REF",elemtype:"bar",id:this.id,idx:t,reftype:"node",name:this.p1};else this.p1=this.model.nodeById(this.p1);if(this.p2===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"bar",id:this.id,idx:t,reftype:"node",name:"p2"};if(!this.model.nodeById(this.p2))return{mid:"E_ELEM_INVALID_REF",elemtype:"bar",id:this.id,idx:t,reftype:"node",name:this.p2};else this.p2=this.model.nodeById(this.p2);return false},init(t,i){this.model=t;this.model.notifyValid(this.validate(i))},dependsOn(t){return this.p1===t||this.p2===t},asJSON(){return'{ "type":"'+this.type+'","p1":"'+this.p1.id+'","p2":"'+this.p2.id+'" }'},draw(t){const i=()=>this.p1.x,e=()=>this.p1.y,s=()=>this.p2.x,r=()=>this.p2.y;t.lin({x1:i,y1:e,x2:s,y2:r,ls:"@nodcolor",lw:8,lc:"round"}).lin({x1:i,y1:e,x2:s,y2:r,ls:"@nodfill2",lw:5.5,lc:"round"}).lin({x1:i,y1:e,x2:s,y2:r,ls:"@nodfill",lw:3,lc:"round"})}};mec.shape.beam={validate(t){if(this.p===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"beam",id:this.id,idx:t,reftype:"node",name:"p"};if(!this.model.nodeById(this.p))return{mid:"E_ELEM_INVALID_REF",elemtype:"beam",id:this.id,idx:t,reftype:"node",name:this.p};else this.p=this.model.nodeById(this.p);if(this.wref===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"beam",id:this.id,idx:t,reftype:"constraint",name:"wref"};if(!this.model.constraintById(this.wref))return{mid:"E_ELEM_INVALID_REF",elemtype:"beam",id:this.id,idx:t,reftype:"constraint",name:this.wref};else this.wref=this.model.constraintById(this.wref);return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.len=this.len||100},dependsOn(t){return this.p===t||this.wref===t},asJSON(){return'{ "type":"'+this.type+'","p":"'+this.p.id+'","wref":"'+this.wref.id+'","len":"'+this.len+'" }'},draw(t){const i=()=>this.p.x,e=()=>this.p.y,s=()=>this.p.x+this.len*Math.cos(this.wref.w),r=()=>this.p.y+this.len*Math.sin(this.wref.w);t.lin({x1:i,y1:e,x2:s,y2:r,ls:"@nodcolor",lw:8,lc:"round"}).lin({x1:i,y1:e,x2:s,y2:r,ls:"@nodfill2",lw:5.5,lc:"round"}).lin({x1:i,y1:e,x2:s,y2:r,ls:"@nodfill",lw:3,lc:"round"})}};mec.shape.wheel={validate(t){if(this.p===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"wheel",id:this.id,idx:t,reftype:"node",name:"p"};if(!this.model.nodeById(this.p))return{mid:"E_ELEM_INVALID_REF",elemtype:"wheel",id:this.id,idx:t,reftype:"node",name:this.p};else this.p=this.model.nodeById(this.p);if(this.wref===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"wheel",id:this.id,idx:t,reftype:"constraint",name:"wref"};if(!this.model.constraintById(this.wref))return{mid:"E_ELEM_INVALID_REF",elemtype:"wheel",id:this.id,idx:t,reftype:"constraint",name:this.wref};else this.wref=this.model.constraintById(this.wref);return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.w0=this.w0||0;this.r=this.r||20},dependsOn(t){return this.p===t||this.wref===t},asJSON(){return'{ "type":"'+this.type+'","p":"'+this.p.id+'","r":'+this.r+(this.w0&&this.w0>1e-4?',"w0":'+this.w0:"")+(this.wref?',"wref":"'+this.wref.id+'"':"")+" }"},draw(t){const i=this.wref?()=>this.wref.w:this.w0||0,e=this.r,s=Math.sin(2*Math.PI/3),r=Math.cos(2*Math.PI/3);t.beg({x:()=>this.p.x,y:()=>this.p.y,w:i}).lin({x1:0,y1:0,x2:e-4,y2:0,ls:"@nodcolor",lw:8,lc:"round"}).lin({x1:0,y1:0,x2:e-4,y2:0,ls:"@nodfill2",lw:5.5,lc:"round"}).lin({x1:0,y1:0,x2:e-4,y2:0,ls:"@nodfill",lw:3,lc:"round"}).lin({x1:0,y1:0,x2:(e-4)*r,y2:(e-4)*s,ls:"@nodcolor",lw:8,lc:"round"}).lin({x1:0,y1:0,x2:(e-4)*r,y2:(e-4)*s,ls:"@nodfill2",lw:5.5,lc:"round"}).lin({x1:0,y1:0,x2:(e-4)*r,y2:(e-4)*s,ls:"@nodfill",lw:3,lc:"round"}).lin({x1:0,y1:0,x2:(e-4)*r,y2:-(e-4)*s,ls:"@nodcolor",lw:8,lc:"round"}).lin({x1:0,y1:0,x2:(e-4)*r,y2:-(e-4)*s,ls:"@nodfill2",lw:5.5,lc:"round"}).lin({x1:0,y1:0,x2:(e-4)*r,y2:-(e-4)*s,ls:"@nodfill",lw:3,lc:"round"}).cir({x:0,y:0,r:e-2.5,ls:"#e6e6e6",fs:"transparent",lw:5}).cir({x:0,y:0,r:e,ls:"@nodcolor",fs:"transparent",lw:1}).cir({x:0,y:0,r:e-5,ls:"@nodcolor",fs:"transparent",lw:1}).end()}};mec.shape.poly={validate(t){if(this.pts===undefined)return{mid:"E_POLY_PTS_MISSING",id:this.id,idx:t};if(this.pts.length<2)return{mid:"E_POLY_PTS_INVALID",id:this.id,idx:t};if(this.p===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"polygon",id:this.id,idx:t,reftype:"node",name:"p"};if(!this.model.nodeById(this.p))return{mid:"E_ELEM_INVALID_REF",elemtype:"polygon",id:this.id,idx:t,reftype:"node",name:this.p};else this.p=this.model.nodeById(this.p);if(this.wref===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"polygon",id:this.id,idx:t,reftype:"constraint",name:"wref"};if(!this.model.constraintById(this.wref))return{mid:"E_ELEM_INVALID_REF",elemtype:"polygon",id:this.id,idx:t,reftype:"constraint",name:this.wref};else this.wref=this.model.constraintById(this.wref);return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.fill=this.fill||"#aaaaaa88";this.stroke=this.stroke||"transparent"},get x0(){return this.p.x0},get y0(){return this.p.y0},get w0(){return this.wref.w0},get w(){return this.wref.w-this.wref.w0},get x(){const t=this.wref.w-this.wref.w0;return this.p.x-Math.cos(t)*this.p.x0+Math.sin(t)*this.p.y0},get y(){const t=this.wref.w-this.wref.w0;return this.p.y-Math.sin(t)*this.p.x0-Math.cos(t)*this.p.y0},dependsOn(t){return this.p===t||this.wref===t},asJSON(){return'{ "type":"'+this.type+'","pts":'+JSON.stringify(this.pts)+',"p":"'+this.p.id+'"'+(this.wref?',"wref":"'+this.wref.id+'"':"")+(this.w0&&this.w0>1e-4&&!(this.wref.w0===this.w0)?',"w0":'+this.w0:"")+(this.stroke&&!(this.stroke==="transparent")?',"stroke":"'+this.stroke+'"':"")+(this.fill&&!(this.fill==="#aaaaaa88")?',"fill":"'+this.fill+'"':"")+" }"},draw(t){t.ply({pts:this.pts,closed:true,x:()=>this.x,y:()=>this.y,w:()=>this.w,fs:this.fill,ls:this.stroke})}};mec.shape.img={validate(t){if(this.uri===undefined)return{mid:"E_IMG_URI_MISSING",id:this.id,idx:t};if(this.p===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"image",id:this.id,idx:t,reftype:"node",name:"p"};if(!this.model.nodeById(this.p))return{mid:"E_ELEM_INVALID_REF",elemtype:"image",id:this.id,idx:t,reftype:"node",name:this.p};else this.p=this.model.nodeById(this.p);if(this.wref&&!this.model.constraintById(this.wref))return{mid:"E_ELEM_INVALID_REF",elemtype:"image",id:this.id,idx:t,reftype:"constraint",name:this.wref};else this.wref=this.model.constraintById(this.wref);return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.w0=this.w0||0;this.xoff=this.xoff||0;this.yoff=this.yoff||0;this.scl=this.scl||1},dependsOn(t){return this.p===t||this.wref===t},asJSON(){return'{ "type":"'+this.type+'","uri":"'+this.uri+'","p":"'+this.p.id+'"'+(this.wref?',"wref":"'+this.wref.id+'"':"")+(this.w0&&Math.abs(this.w0)>1e-4?',"w0":'+this.w0:"")+(this.xoff&&Math.abs(this.xoff)>1e-4?',"xoff":'+this.xoff:"")+(this.yoff&&Math.abs(this.yoff)>1e-4?',"yoff":'+this.yoff:"")+(this.scl&&Math.abs(this.scl-1)>1e-4?',"scl":'+this.scl:"")+" }"},draw(t){const i=this.w0||0,e=this.wref?()=>this.wref.w+i:i;t.img({uri:this.uri,x:()=>this.p.x,y:()=>this.p.y,w:e,scl:this.scl,xoff:this.xoff,yoff:this.yoff})}};mec.shape.line={validate(t){if(this.p1===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"line",id:this.id,idx:t,reftype:"node",name:"p1"};if(!this.model.nodeById(this.p1))return{mid:"E_ELEM_INVALID_REF",elemtype:"line",id:this.id,idx:t,reftype:"node",name:this.p1};else this.p1=this.model.nodeById(this.p1);if(this.wref!==undefined){if(this.wref&&!this.model.constraintById(this.wref))return{mid:"E_ELEM_INVALID_REF",elemtype:"line",id:this.id,idx:t,reftype:"constraint",name:this.wref};else this.wref=this.model.constraintById(this.wref)}else{if(this.p2===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"line",id:this.id,idx:t,reftype:"node",name:"p2"};if(!this.model.nodeById(this.p2))return{mid:"E_ELEM_INVALID_REF",elemtype:"line",id:this.id,idx:t,reftype:"node",name:this.p2};else this.p2=this.model.nodeById(this.p2)}if(this.len===undefined||this.len<0)return{mid:"E_LEN_MISSING",elemtype:"line",id:this.id,idx:t};return false},init(t,i){this.model=t;this.model.notifyValid(this.validate(i))},dependsOn(t){return this.p1===t||this.p2===t},asJSON(){let t='{ "type":"'+this.type+'","p1":"'+this.p1.id+'",    ';if(this.p2!==undefined){t+=' "p2":"'+this.p2.id+'"   '}else{t+=this.wref?' "wref":"'+this.wref.id+'"   ':""}t+=',"len":"'+this.len+'"';t+=this.color?' ,"color":"'+this.color+'"   ':"";t+=this.txt?' ,"txt":"'+this.txt+'"   ':"";t+=this.lintype?' ,"lintype":"'+this.lintype+'"   ':"";t+=" }";return t},draw(t){const i=this.p1.x,e=this.p1.y;let s;if(this.p2!==undefined){const t=this.p2.x,i=this.p2.y;s=(()=>Math.atan2(this.p2.y-this.p1.y,this.p2.x-this.p1.x))}else{s=(()=>this.wref.w)}const r=Math.cos(s)*this.len+i;const h=Math.sin(s)*this.len+e;switch(this.lintype){case"normal":t.beg({x:()=>this.p1.x,y:()=>this.p1.y,w:s});t.lin({x1:0,y1:0,x2:this.len,y2:0});t.end();break;case"grd1":t.beg({x:()=>this.p1.x,y:()=>this.p1.y,w:s});t.grdline({x1:0,y1:0,x2:this.len,y2:0,typ:"mid"});t.end();break;case"grd2":t.beg({x:()=>this.p1.x,y:()=>this.p1.y,w:s});t.grdline({x1:0,y1:0,x2:this.len,y2:0,typ:"out"});t.end();break;default:t.beg({x:()=>this.p1.x,y:()=>this.p1.y,w:s});t.lin({x1:0,y1:0,x2:this.len,y2:0});t.end();break}}};mec.shape.Schieber={validate(t){if(this.p===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"Schieber",id:this.id,idx:t,reftype:"node",name:"p"};if(!this.model.nodeById(this.p))return{mid:"E_ELEM_INVALID_REF",elemtype:"Schieber",id:this.id,idx:t,reftype:"node",name:this.p};else this.p=this.model.nodeById(this.p);if(this.wref&&!this.model.constraintById(this.wref))return{mid:"E_ELEM_INVALID_REF",elemtype:"Schieber",id:this.id,idx:t,reftype:"constraint",name:this.wref};else this.wref=this.model.constraintById(this.wref);return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.w0=this.w0||0;this.fill=this.fill||"white"},dependsOn(t){return this.p===t||this.wref===t},asJSON(){return'{ "type":"'+this.type+'","p":"'+this.p.id+'"'+(this.w0&&this.w0>1e-4?',"w0":'+this.w0:"")+(this.wref?',"wref":"'+this.wref.id+'"':"")+(this.fill||this.fill==="white"?',"fill":"'+this.fill+'"':"")+" }"},draw(t){const i=this.wref?()=>this.wref.w:this.w0||0;t.beg({x:()=>this.p.x,y:()=>this.p.y,w:i}).rec({x:-16,y:-10,b:32,h:20,ls:"@nodcolor",fs:this.fill,lw:1,lj:"round"}).end()}};mec.shape.Ecke={validate(t){if(this.p1===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"Ecke",id:this.id,idx:t,reftype:"node",name:"p1"};if(!this.model.nodeById(this.p1))return{mid:"E_ELEM_INVALID_REF",elemtype:"Ecke",id:this.id,idx:t,reftype:"node",name:this.p1};else this.p1=this.model.nodeById(this.p1);if(this.p2===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"Ecke",id:this.id,idx:t,reftype:"node",name:"p2"};if(!this.model.nodeById(this.p2))return{mid:"E_ELEM_INVALID_REF",elemtype:"Ecke",id:this.id,idx:t,reftype:"node",name:this.p2};else this.p2=this.model.nodeById(this.p2);if(this.p3===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"Ecke",id:this.id,idx:t,reftype:"node",name:"p3"};if(!this.model.nodeById(this.p3))return{mid:"E_ELEM_INVALID_REF",elemtype:"Ecke",id:this.id,idx:t,reftype:"node",name:this.p3};else this.p3=this.model.nodeById(this.p3);return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.fill=this.fill||"black";this.size=this.size||"45";this.w0=this.w0||0;this.side=this.side||1},dependsOn(t){return this.p1===t||this.p3===t||this.p2===t},asJSON(){let t='{ "type":"'+this.type+'","p1":"'+this.p1.id+'","p2":"'+this.p2.id+'","p3":"'+this.p3.id+'"';t+=this.size||this.size===45?' ,"size":"'+this.size+'"   ':"";t+=this.side||this.side<0?' ,"side":"'+this.side+'"   ':"";t+=" }";return t},draw(t){const i=Math.atan2(this.p1.y-this.p2.y,this.p1.x-this.p2.x);const e=Math.atan2(this.p3.y-this.p2.y,this.p3.x-this.p2.x);let s=e-i;if(this.side<1)s=2*Math.PI-s;t.beg({x:()=>this.p2.x,y:()=>this.p2.y,w:()=>Math.atan2(this.p1.y-this.p2.y,this.p1.x-this.p2.x)});t.p().m({x:this.size,y:0}).q({x1:0,y1:0,x:this.size*Math.cos(s*this.side),y:this.size*Math.sin(s*this.side)}).l({x:0,y:0}).l({x:this.size,y:0}).z().fill({fs:this.fill});t.end()}};mec.shape.corner={validate(t){if(this.p===undefined)return{mid:"E_ELEM_REF_MISSING",elemtype:"corner",id:this.id,idx:t,reftype:"node",name:"p"};if(!this.model.nodeById(this.p))return{mid:"E_ELEM_INVALID_REF",elemtype:"corner",id:this.id,idx:t,reftype:"node",name:this.p};else this.p=this.model.nodeById(this.p);if(this.wref1===undefined){if(this.p1===undefined){return{mid:"E_ELEM_REF_MISSING",elemtype:"corner",id:this.id,idx:t,reftype:"node",name:"wref1"}}else{if(!this.model.nodeById(this.p1))return{mid:"E_ELEM_INVALID_REF",elemtype:"corner",id:this.id,idx:t,reftype:"node",name:this.p1};else this.p1=this.model.nodeById(this.p1)}}else{if(!this.model.constraintById(this.wref1))return{mid:"E_ELEM_INVALID_REF",elemtype:"corner",id:this.id,idx:t,reftype:"constraint",name:this.wref1};else this.wref1=this.model.constraintById(this.wref1)}if(this.wref2===undefined){if(this.p2===undefined){return{mid:"E_ELEM_REF_MISSING",elemtype:"corner",id:this.id,idx:t,reftype:"node",name:"wref2"}}else{if(!this.model.nodeById(this.p2))return{mid:"E_ELEM_INVALID_REF",elemtype:"corner",id:this.id,idx:t,reftype:"node",name:this.p2};else this.p2=this.model.nodeById(this.p2)}}else{if(!this.model.constraintById(this.wref2))return{mid:"E_ELEM_INVALID_REF",elemtype:"corner",id:this.id,idx:t,reftype:"constraint",name:this.wref2};else this.wref2=this.model.constraintById(this.wref2)}return false},init(t,i){this.model=t;if(!this.model.notifyValid(this.validate(i)))return;this.fill=this.fill||"black";this.size=this.size||"30"},dependsOn(t){return this.p===t||this.wref1===t||this.wref2===t||this.p1===t||this.p2===t},asJSON(){let t='{ "type":"'+this.type+'","p":"'+this.p.id+'"';if(this.wref1===undefined)t+=',"p1":"'+this.p1.id+'"';else t+=',"wref1":"'+this.wref1.id+'"';if(this.wref2===undefined)t+=',"p2":"'+this.p2.id+'"';else t+=',"wref2":"'+this.wref2.id+'"';t+=this.size||this.size===20?' ,"size":"'+this.size+'"   ':"";t+=" }";return t},draw(t){const i=()=>this.wref1===undefined?Math.atan2(this.p1.x-this.p.x,this.p1.y-this.p.y):this.wref1.w;const e=()=>this.wref2===undefined?Math.atan2(this.p2.x-this.p.x,this.p2.y-this.p.y):this.wref2.w;let s=()=>e-i;if(this.wref1===undefined&&this.wref2===undefined){}const r=this.wref1===undefined?Math.atan2(this.p1.x-this.p.x,this.p1.y-this.p.y):this.wref1.w;const h=this.wref2===undefined?Math.atan2(this.p2.x-this.p.x,this.p2.y-this.p.y):this.wref2.w;const n=i;console.log(`w2${e}`);console.log(`dw${s+2}`);t.beg({x:()=>this.p.x,y:()=>this.p.y,w:i});t.p().m({x:this.size,y:0}).l({x:Math.cos(s)*this.size,y:Math.sin(s)*this.size}).l({x:0,y:0}).l({x:this.size,y:0}).z().stroke({ls:"#888",lw:2,lc:"round",lj:"round"});t.end();t.beg({x:Math.cos(s)*this.size,y:()=>this.p.y,w:i});const o=()=>0,d=()=>0,l=()=>100,a=()=>1;t.lin({x1:o,y1:l,x2:100,y2:70});t.end()}};
/**
 * mec.model (c) 2018-19 Stefan Goessner
 * @license MIT License
 * @requires mec.core.js
 * @requires mec.node.js
 * @requires mec.constraint.js
 * @requires mec.drive.js
 * @requires mec.load.js
 * @requires mec.view.js
 * @requires mec.shape.js
 */
"use strict";mec.model={extend(t,i=mec){Object.setPrototypeOf(t,this.prototype);t.constructor(i);return t},prototype:{constructor(t){this.env=t;if(t!==mec&&!t.show)this.env.show=Object.create(Object.getPrototypeOf(mec.show),Object.getOwnPropertyDescriptors(mec.show));this.showInfo={nodes:this.env.show.nodeInfo,constraints:this.env.show.constraintInfo,loads:false};this.state={valid:true,itrpos:0,itrvel:0,preview:false};this.timer={t:0,dt:1/60,sleepMin:1};if(!this.nodes)this.nodes=[];if(!this.constraints)this.constraints=[];if(!this.loads)this.loads=[];if(!this.views)this.views=[];if(!this.shapes)this.shapes=[];for(const t of this.nodes)mec.node.extend(t);for(const t of this.constraints)mec.constraint.extend(t);for(const t of this.loads)mec.load.extend(t);for(const t of this.views)mec.view.extend(t);for(const t of this.shapes)mec.shape.extend(t)},init(){if(this.gravity===true)this.gravity=Object.assign({},mec.gravity,{active:true});else if(!this.gravity)this.gravity=Object.assign({},mec.gravity,{active:false});if(!this.tolerance)this.tolerance="medium";this.state.valid=true;for(let t=0;t<this.nodes.length&&this.valid;t++)this.nodes[t].init(this,t);for(let t=0;t<this.constraints.length&&this.valid;t++)if(!this.constraints[t].initialized)this.constraints[t].init(this,t);for(let t=0;t<this.loads.length&&this.valid;t++)this.loads[t].init(this,t);for(let t=0;t<this.views.length&&this.valid;t++)this.views[t].init(this,t);for(let t=0;t<this.shapes.length&&this.valid;t++){try{this.shapes[t].init(this,t)}catch(i){console.log(`error at index: ${t} + type: ${this.shapes[t]}`);console.log(`error: ${i}`)}}return this},notifyValid(t){if(t){this.state.msg=t;return this.state.valid=t.mid[0]!=="E"}return true},reset(){this.timer.t=0;this.timer.sleepMin=1;Object.assign(this.state,{valid:true,itrpos:0,itrvel:0});for(const t of this.nodes)t.reset();for(const t of this.constraints)t.reset();for(const t of this.loads)t.reset();for(const t of this.views)t.reset();return this},preview(){let t=false,i=0;for(const e of this.views){if(e.mode==="preview"){i=e.t0+e.Dt;e.reset(t=true)}}if(t){this.reset();this.state.preview=true;this.timer.dt=1/30;for(this.timer.t=0;this.timer.t<=i;this.timer.t+=this.timer.dt){this.pre().itr().post();for(const t of this.views)if(t.preview)t.preview()}this.timer.dt=1/60;this.state.preview=false;this.reset()}return this},asm(){let t=this.asmPos();t=this.asmVel()&&t;return this},pose(){return this.asmPos()},tick(t){this.timer.t+=this.timer.dt=1/60;this.pre().itr().post();return this},stop(){for(const t of this.nodes)t.xt=t.yt=t.xtt=t.ytt=0;return this},get dof(){let t=0;for(const i of this.nodes)t+=i.dof;for(const i of this.constraints)t-=2-i.dof;return t},get hasGravity(){return this.gravity.active},get valid(){return this.state.valid},set valid(t){this.state.valid=t},get msg(){return this.state.msg},get info(){if(this.showInfo.nodes)for(const t of this.nodes)if(t.showInfo)return t.info(this.showInfo.nodes);if(this.showInfo.constraints)for(const t of this.constraints)if(t.showInfo)return t.info(this.showInfo.constraints)},get itrpos(){return this.state.itrpos},set itrpos(t){this.state.itrpos=t},get itrvel(){return this.state.itrvel},set itrvel(t){this.state.itrvel=t},set sleepMinDelta(t){this.timer.sleepMin=this.timer.t+t},get isSleeping(){let t=this.timer.t>this.timer.sleepMin;if(t)for(const i of this.nodes)t=t&&i.isSleeping;return t},get activeDriveCount(){let t=0;for(const i of this.constraints)t+=i.activeDriveCount(this.timer.t);return t},get hasActiveDrives(){return this.activeDriveCount>0},get inputControlledDrives(){const t=[];for(const i of this.constraints){if(i.ori.type==="drive"&&i.ori.input)t.push({constraint:i,sub:"ori"});if(i.len.type==="drive"&&i.len.input)t.push({constraint:i,sub:"len"})}return t},get isActive(){return this.activeDriveCount>0||this.dof>0&&!this.isSleeping},get energy(){var t=0;for(const i of this.nodes)t+=i.energy;for(const i of this.loads)t+=i.energy;return t},get cog(){var t={x:0,y:0},i=0;for(const e of this.nodes){if(!e.base){t.x+=e.x*e.m;t.y+=e.y*e.m;i+=e.m}}t.x/=i;t.y/=i;return t},hasDependents(t){let i=false;for(const e of this.constraints)i=e.dependsOn(t)||i;for(const e of this.loads)i=e.dependsOn(t)||i;for(const e of this.views)i=e.dependsOn(t)||i;for(const e of this.shapes)i=e.dependsOn(t)||i;return i},dependentsOf(t,i){i=i||{constraints:[],loads:[],views:[],shapes:[]};for(const e of this.constraints)if(e.dependsOn(t)){this.dependentsOf(e,i);i.constraints.push(e)}for(const e of this.loads)if(e.dependsOn(t))i.loads.push(e);for(const e of this.views)if(e.dependsOn(t))i.views.push(e);for(const e of this.shapes)if(e.dependsOn(t))i.shapes.push(e);return i},purgeElements(t){for(const i of t.constraints)this.constraints.splice(this.constraints.indexOf(i),1);for(const i of t.loads)this.loads.splice(this.loads.indexOf(i),1);for(const i of t.views)this.views.splice(this.views.indexOf(i),1);for(const i of t.shapes)this.shapes.splice(this.shapes.indexOf(i),1)},elementById(t){return this.nodeById(t)||this.constraintById(t)||this.loadById(t)||this.viewById(t)||t==="model"&&this},addNode(t){this.nodes.push(t)},nodeById(t){for(const i of this.nodes)if(i.id===t)return i;return false},removeNode(t){const i=this.hasDependents(t);if(!i)this.nodes.splice(this.nodes.indexOf(t),1);return!i},purgeNode(t){this.purgeElements(this.dependentsOf(t));this.nodes.splice(this.nodes.indexOf(t),1)},addConstraint(t){this.constraints.push(t)},constraintById(t){for(const i of this.constraints)if(i.id===t)return i;return false},removeConstraint(t){const i=this.hasDependents(t);if(!i)this.constraints.splice(this.constraints.indexOf(t),1);return!i},purgeConstraint(t){this.purgeElements(this.dependentsOf(t));this.constraints.splice(this.constraints.indexOf(t),1)},addLoad(t){this.loads.push(t)},loadById(t){for(const i of this.loads)if(i.id===t)return i;return false},removeLoad(t){const i=this.hasDependents(t);if(!i)this.loads.splice(this.loads.indexOf(t),1);return!i},purgeLoad(t){this.purgeElements(this.dependentsOf(t));this.loads.splice(this.loads.indexOf(t),1)},addShape(t){this.shapes.push(t)},removeShape(t){const i=this.shapes.indexOf(t);if(i>=0)this.shapes.splice(i,1)},purgeShape(t){this.purgeElements(this.dependentsOf(t));this.shapes.splice(this.shapes.indexOf(t),1)},addView(t){this.views.push(t)},viewById(t){for(const i of this.views)if(i.id===t)return i;return false},removeView(t){const i=this.views.indexOf(t);if(i>=0)this.views.splice(i,1)},purgeView(t){this.purgeElements(this.dependentsOf(t));this.views.splice(this.views.indexOf(t),1)},asJSON(){const t=this.nodes.length;const i=this.constraints.length;const e=this.loads.length;const s=this.shapes.length;const r=this.views.length;const h=(t,i)=>t<i-1?",":"";const n="{"+'\n  "id":"'+this.id+'"'+(this.title?',\n  "title":"'+this.title+'"':"")+(this.gravity.active?',\n  "gravity":true':"")+(t?',\n  "nodes": [\n':"\n")+(t?this.nodes.map((i,e)=>"    "+i.asJSON()+h(e,t)+"\n").join(""):"")+(t?i||e||s||r?"  ],\n":"  ]\n":"")+(i?'  "constraints": [\n':"")+(i?this.constraints.map((t,e)=>"    "+t.asJSON()+h(e,i)+"\n").join(""):"")+(i?e||s||r?"  ],\n":"  ]\n":"")+(e?'  "loads": [\n':"")+(e?this.loads.map((t,i)=>"    "+t.asJSON()+h(i,e)+"\n").join(""):"")+(e?s||r?"  ],\n":"  ]\n":"")+(s?'  "shapes": [\n':"")+(s?this.shapes.map((t,i)=>"    "+t.asJSON()+h(i,s)+"\n").join(""):"")+(s?r?"  ],\n":"  ]\n":"")+(r?'  "views": [\n':"")+(r?this.views.map((t,i)=>"    "+t.asJSON()+h(i,r)+"\n").join(""):"")+(r?"  ]\n":"")+"}";return n},applyLoads(){for(const t of this.nodes){t.Qx=t.Qy=0;if(!t.base&&this.hasGravity){t.Qx=t.m*mec.from_m(this.gravity.x);t.Qy=t.m*mec.from_m(this.gravity.y)}}for(const t of this.loads)t.apply();return this},asmPos(){let t=false;this.itrpos=0;while(!t&&this.itrpos++<mec.asmItrMax){t=this.posStep()}return this.valid=t},posStep(){let t=true;for(const i of this.constraints)t=i.posStep()&&t;return t},asmVel(){let t=false;this.itrvel=0;while(!t&&this.itrvel++<mec.asmItrMax)t=this.velStep();return this.valid=t},velStep(){let t=true;for(const i of this.constraints){t=i.velStep(this.timer.dt)&&t}return t},pre(){for(const t of this.nodes)t.pre_0();for(const t of this.loads)t.apply();for(const t of this.nodes)t.pre(this.timer.dt);for(const t of this.constraints)t.pre(this.timer.dt);this.asmPos(this.timer.dt);for(const t of this.views)if(t.pre)t.pre(this.timer.dt);return this},itr(){if(this.valid)this.asmVel();return this},post(){for(const t of this.nodes)t.post(this.timer.dt);for(const t of this.constraints)t.post(this.timer.dt);for(const t of this.views)if(t.post)t.post(this.timer.dt);return this},draw(t){for(const i of this.constraints){const e=i.hid||false;if(!e){i.draw(t)}}for(const i of this.shapes)i.draw(t);for(const i of this.views)i.draw(t);for(const i of this.loads)i.draw(t);for(const i of this.nodes){const e=i.hid||false;if(!e){i.draw(t)}}return this}}};
/**
 * mec.msg.en (c) 2018 Stefan Goessner
 * @license MIT License
 */
"use strict";mec.msg.en={U_SEL_SECOND_NODE:()=>`Select second node.`,W_CSTR_NODES_COINCIDE:({cstr:t,p1:i,p2:e})=>`Warning: Nodes '${i}' and '${e}' of constraint '${t}' coincide.`,E_ELEM_ID_MISSING:({elemtype:t,idx:i})=>`${t} with index ${i} must have an id defined.`,E_ELEM_ID_AMBIGIOUS:({elemtype:t,id:i})=>`${t} id '${i}' is ambigious.`,W_ELEM_ID_MISSING:({elemtype:t,idx:i})=>`${t} with index ${i} should have an id defined.`,E_ELEM_REF_MISSING:({elemtype:t,id:i,idx:e,reftype:s,name:r})=>`${t} ${i?"'"+i+"'":"["+e+"]"} must have a ${s} reference '${r}' defined.`,E_ELEM_INVALID_REF:({elemtype:t,id:i,idx:e,reftype:s,name:r})=>`${s} reference '${r}' of ${t} ${i?"'"+i+"'":"["+e+"]"} is invalid.`,E_NODE_MASS_TOO_SMALL:({id:t,m:i})=>`Node's (id='${t}') mass of ${i} is too small.`,E_CSTR_NODE_MISSING:({id:t,loc:i,p:e})=>`${i} node '${e}' of constraint (id='${t}') is missing.`,E_CSTR_NODE_NOT_EXISTS:({id:t,loc:i,p:e,nodeId:s})=>`${i} node '${e}':'${s}' of constraint '${t}' does not exist.`,E_CSTR_REF_NOT_EXISTS:({id:t,sub:i,ref:e})=>`Reference to '${e}' in '${i} of constraint '${t}' does not exist.`,E_CSTR_DRIVEN_REF_TO_FREE:({id:t,sub:i,ref:e,reftype:s})=>`Driven ${i} constraint of '${t}' must not reference free ${s} of constraint '${e}'.`,W_CSTR_RATIO_IGNORED:({id:t,sub:i,ref:e,reftype:s})=>`Ratio value of driven ${i} constraint '${t}' with reference to '${s}' constraint '${e}' ignored.`,E_FORCE_VALUE_INVALID:({id:t,val:i})=>`Force value '${i}' of load '${t}' is not allowed.`,E_SPRING_RATE_INVALID:({id:t,val:i})=>`Spring rate '${i}' of load '${t}' is not allowed.`,E_POLY_PTS_MISSING:({id:t,idx:i})=>`Polygon shape ${t?"'"+t+"'":"["+i+"]"} must have a points array 'pts' defined.`,E_POLY_PTS_INVALID:({id:t,idx:i})=>`Polygon shape ${t?"'"+t+"'":"["+i+"]"} must have a points array 'pts' with at least two points defined.`,E_IMG_URI_MISSING:({id:t,idx:i})=>`Image shape ${t?"'"+t+"'":"["+i+"]"} must have an uniform resource locator 'uri' defined.`,E_ALY_REF_MISSING:({id:t,idx:i})=>({elemtype:t,id:i,idx:e,reftype:s,name:r})=>`${t} ${i?"'"+i+"'":"["+e+"]"} must have with '${r}' an existing property name of a ${s} specified. One of ${keys} are supported.`,E_ALY_REF_INVALID:({id:t,idx:i})=>({elemtype:t,id:i,idx:e,reftype:s,name:r})=>`${t} ${i?"'"+i+"'":"["+e+"]"} has with '${r}' an invalid property name of a ${s} specified. One of ${keys} are supported.`};
class MecSlider extends HTMLElement {
    static get observedAttributes() {
        return ['width','min','max','step','value','bubble'];
    }

    constructor() {
        super();
        this._root = this.attachShadow({ mode:'open' });
    }

    // html slider attributes 
    get width() { return +this.getAttribute("width") || 100 }
    get min() { return +this.getAttribute("min") || 0 }
    get max() { return +this.getAttribute("max") || 100 }
    get step() { return +this.getAttribute("step") || 1 }
    get value() { return +this.getAttribute('value') || 0; }
    set value(q) {
        q = this._nfrac > 0 ? q.toFixed(this._nfrac) : q;
        this.setAttribute('value',q);
        this._slider.setAttribute('value',this._slider.value = q);
        this._slider.value = q;
        this.dispatchEvent(new CustomEvent('input', { detail: q }));
    }

    // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
    connectedCallback() { this.init(); }
    disconnectedCallback() { this.deinit(); }
    attributeChangedCallback(name, oldval, val) {}

    init() {
        this.bubble = this.hasAttribute("bubble");
        this._root.innerHTML = MecSlider.template({
            id: this.id,
            width: this.width,
            height:this.height,
            min:this.min,
            max:this.max,
            step:this.step,
            value:this.value,
            darkmode:this.darkmode,
            bubble:this.bubble
        });
        // cache elements of shadow dom
        this._slider = this._root.querySelector('input');
        this._forbtn = this._root.querySelector('.forward');
        this._revbtn = this._root.querySelector('.reverse');
        // install instance specific function pointers from prototype methods ...
        this._sliderInputHdl  = this.sliderInput.bind(this);
        this._startForwardHdl = this.startForward.bind(this);
        this._startReverseHdl = this.startReverse.bind(this);
        this._endForwardHdl   = this.endForward.bind(this);
        this._endReverseHdl   = this.endReverse.bind(this);
        // install initial event listeners
        this._slider.addEventListener("input", this._sliderInputHdl, false);
        this._forbtn.addEventListener("pointerup", this._startForwardHdl, false);
        this._revbtn.addEventListener("pointerup", this._startReverseHdl, false);
        // cache instant specific values
        this._nfrac = Math.max(0,Math.ceil(-Math.log10(this.step)));  // number of digits after decimal point of step
        // init value bubble
        if (this.bubble) {
            this._bubble = this._root.getElementById('bubble');
            this._bubbleShowHdl = this.showBubble.bind(this);
            this._bubbleHideHdl = this.hideBubble.bind(this);

            this._slider.addEventListener("focusin", this._bubbleShowHdl, false);
            this._slider.addEventListener("focusout", this._bubbleHideHdl, false);
        }
    }
    deinit() { 
        // remove event listeners
        this._slider.removeEventListener("input", this.sliderInputHdl, false);
        this._forbtn.removeEventListener("pointerup", this._startForwardHdl, false);
        this._forbtn.removeEventListener("pointerup", this._endForwardHdl, false);
        this._revbtn.removeEventListener("pointerup", this._startReverseHdl, false);
        this._revbtn.removeEventListener("pointerup", this._endReverseHdl, false);
        if (this.bubble) {
            this._slider.removeEventListener("focusin", this._bubbleShowHdl, false);
            this._slider.removeEventListener("focusout", this._bubbleHideHdl, false);
        }
    // delete cached data
        delete this._bubble;
        delete this._slider;
        delete this._forbtn;
        delete this._revbtn;
    }

    sliderInput() {
        this.value = +this._slider.value;
        if (this._bubble)
            this.placeBubble();
    }
    showBubble() {
        this._bubble.style.display = 'block';
        this.placeBubble();
    }
    hideBubble() { 
        this._bubble.style.display = 'none';
    }
    placeBubble() {
        const thumbWidth = 12,  // width of thumb estimated .. depends on browser
              sliderBox = this._slider.getBoundingClientRect(),
              bubbleBox = this._bubble.getBoundingClientRect(),
              thumbLeft = Math.floor(sliderBox.left + thumbWidth/2),
              thumbRange = sliderBox.width - thumbWidth;
        this._bubble.style.left = Math.floor(thumbLeft - bubbleBox.width/2 + thumbRange*Math.max(0,Math.min(1,(this.value - this.min)/(this.max - this.min))))+'px';
        this._bubble.style.top = Math.floor(sliderBox.top - bubbleBox.height)+'px';
        this._bubble.innerHTML = this.getAttribute('value');
    }
    startForward() {
        if (this.value < this.max) {
            // change forward-button to stop-button
            this._forbtn.removeEventListener("pointerup", this._startForwardHdl, false);
            this._forbtn.innerHTML = MecSlider.stopsym;
            this._forbtn.addEventListener("pointerup", this._endForwardHdl, false);
            // deactivate reverse-button
            this._revbtn.removeEventListener("pointerup", this._startReverseHdl, false);
            this._revbtn.style.color = "#888";  // show disabled !
            // focus to slider ... disable it
            this._slider.focus();
            this._slider.setAttribute('disabled',true);
            this.showBubble();                  // needed for chrome !

            this.goFwd();
        }
    }
    endForward() {
        // change stop-button to forward-button
        this._forbtn.removeEventListener("pointerup", this._endForwardHdl, false);
        this._forbtn.innerHTML = MecSlider.fwdsym;
        this._forbtn.addEventListener("pointerup", this._startForwardHdl, false);
        // reactivate reverse-button
        this._revbtn.addEventListener("pointerup", this._startReverseHdl, false);
        this._revbtn.style.color = "inherit";
        // focus to slider ... enable it
        this._slider.focus();
        this._slider.removeAttribute('disabled');
        window.clearTimeout(this.timeoutId);
    }
    fwdStep() {
        let delta = this.value + this.step < this.max ? this.step : Math.max(this.max - this.value,0);
        if (delta) { // proceed ...
            this.value += delta;
            if (this._bubble)
                this.placeBubble();
        }
        else
            this.endForward();
        return !!delta;
    }
    goFwd() {
        // '.. loop with guarantee that the previous interval has completed before recursing.'
        // see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
        this.timeoutId = window.setTimeout(() => {
            if (this.fwdStep())
                this.goFwd();
        }, 20);
    }
    startReverse() {
        if (this.value >= this.min) {
            // change reverse-button to stop-button
            this._revbtn.removeEventListener("pointerup", this._startReverseHdl, false);
            this._revbtn.innerHTML = MecSlider.stopsym;
            this._revbtn.addEventListener("pointerup", this._endReverseHdl, false);
            // deactivate forward-button
            this._forbtn.removeEventListener("pointerup", this._startForwardHdl, false);
            this._forbtn.style.color = "#888";  // show disabled !
            // focus to slider ... disable it
            this._slider.focus();
            this._slider.setAttribute('disabled',true);
            this.showBubble();                  // needed for chrome !

            this.goRev();
        }
    }
    endReverse() {
        // change stop-button to reverse-button
        this._revbtn.removeEventListener("pointerup", this._endReverseHdl, false);
        this._revbtn.innerHTML = MecSlider.revsym;
        this._revbtn.addEventListener("pointerup", this._startReverseHdl, false);
        // reactivate forward-button
        this._forbtn.addEventListener("pointerup", this._startForwardHdl, false);
        this._forbtn.style.color = "inherit";
        // focus to slider ... enable it
        this._slider.focus();
        this._slider.removeAttribute('disabled');

        window.clearTimeout(this.timeoutId);
    }
    revStep() {
        let delta = this.value - this.step >= this.min ? -this.step : -Math.max(this.min - this.value,0);
        if (delta) { // proceed ...
            this.value += delta;
            if (this._bubble)
                this.placeBubble();
        }
        else
            this.endReverse();
        return !!delta;
    }
    goRev() {
        // '.. loop with guarantee that the previous interval has completed before recursing.'
        // see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
        this.timeoutId = window.setTimeout(() => {
            if (this.revStep())
                this.goRev();
        }, 20);
    }

    static template({id,width,min,max,step,value,bubble}) {
return `
<style>
   ::shadow {
       display:inline-flex; 
       width:${width}px; 
       align-items:center;
    }

    .slider {
       width: 100%; 
       font-size: 10pt;
    }

    input {
        min-width: calc(100% - 2.5em);
        margin: 0;
        padding: 0;
        vertical-align: middle;
    }

   .forward, .reverse {
       font-family: Consolas;
       font-size: 10pt;
       vertical-align: middle;
       cursor: default;
       user-select: none;
       -moz-user-select: none;
   }

   ${bubble?`
   #bubble {
        color: black;
        background-color: #f8f8f888;
        border: 1px solid #c8c8c8;
        border-radius: 2px 2px 10px 10px;
        font-family: Consolas;
        font-size: 10pt;
        text-align: center;
        padding: 2px;
        position: absolute;
        left: 0px;
        top: 0px;
        display: none;
        pointer-events:none`
   :''}
</style>
<div class="slider">
    <span class="reverse">${MecSlider.revsym}</span>
    <input type="range" min="${min}" max="${max}" value="${value}" step="${step}"/>
    <span class="forward">${MecSlider.fwdsym}</span>
    ${bubble?`<div id="bubble">?</div>`:''}
</div>`
}
}

MecSlider.fwdsym = '&#9655;'
MecSlider.revsym = '&#9665;'
MecSlider.stopsym = '&#9744;'

customElements.define('mec-slider', MecSlider);

//console.log('mec3.element.js loaded');
/*ignore jslint start*/
class Mec3Element extends HTMLElement{

  static get observedAttributes() {
    return ['width', 'height', 'cartesian', 'grid', 'x0', 'y0',
        'darkmode', 'gravity', 'hidenodes', 'hideconstraints',
        'nodelabels', 'constraintlabels', 'loadlabels',
        'nodeinfo', 'constraintinfo','constraintVector','scale','font','pause'];
}

constructor(){
  super();
  this._shadow = this.attachShadow({mode: 'open'});
  
}
//#region region getter and setter*/
get width() { return this.style.width||+this.getAttribute('width') || 301; }
set width(q) { if (q) this.setAttribute('width', q); }
get height() { return this.style.height||+this.getAttribute('height') || 201; }
set height(q) { if (q) this.setAttribute('height', q); }
get x0() { return (+this.getAttribute('x0')) || 0; }
set x0(q) { if (q) this.setAttribute('x0', q); }
get y0() { return (+this.getAttribute('y0')) || 0; }
set y0(q) { if (q) this.setAttribute('y0', q); }
get show() { return this._show; }
get grid() { return this.hasAttribute('grid') || false; }
set grid(q) { q ? this.setAttribute('grid', '') : this.removeAttribute('grid'); }
get pausing(){return this._ispaused;}
set pausing(q) {this._ispaused=q;}
get constraintVector() { return this.hasAttribute('constraintVector') || false; }
set constraintVector(q) { q ? this.setAttribute('constraintVector', '') : this.removeAttribute('constraintVector'); }
get constraintlabels() { return this.hasAttribute('constraintlabels') || false; }
set constraintlabels(q) { q ? this.setAttribute('constraintlabels', '') : this.removeAttribute('constraintlabels'); }
get scale() { return this.getAttribute('scale') || 1; }
set scale(q) { q ? this.setAttribute('scale', q) : this.removeAttribute('scale'); }
get font() { return this.getAttribute('font') || "Times New Roman 14px normal"; }
set font(q) { q ? this.setAttribute('font', q) : this.removeAttribute('font'); }
get pause() { return this.hasAttribute('pause') || false; }
set pause(q) { q ? this.setAttribute('pause', '') : this.removeAttribute('pause'); }

//#endregion
parseModel() {
  try { this._model = JSON.parse(this.innerHTML); return true; }
  catch (e) { this._shadow.innerHTML = e.message; }
  return false;
}



  onclick(e){
       //this.cnvclicked();
    
       if (this._ispaused===undefined) this._ispaused=false;
      this._ispaused=!this._ispaused;
      if (!this._ispaused)
      {    
          console.log(`start: ${this._ispaused}`);
          window.requestAnimationFrame(() => this.render()); //start again
      }   
  }
  // Pan the view when user moves the pointer with any button pressed.
 onmove(e) {
  if (e.buttons !== undefined ? e.buttons : (e.which || e.button)) {
      const dx = e.movementX || e.mozMovementX || e.webkitMovementX || 0,
            dy = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
            this._viewport.x+=dx,this._viewport.y+=dy;                        // g2.view uses device coordinates
  dirty = true;
  }
}
// Zoom the view when user uses the mouse wheel.
 onwheel(e) {
  const delta = Math.max(-1,Math.min(1,e.deltaY||e.wheelDelta));
          vw.scl *= delta > 0?9/10:10/9;              // g2.view again uses device coordinates
          vw.x = e.clientX - Math.floor(viewport.left),
          vw.y = e.clientY - Math.floor(viewport.top),
  dirty = true;
}
   render() {
      if (this._ispaused) return;
      this._model.tick(1/60);  
      this._g.exe(this._ctx);
      window. requestAnimationFrame(() => this.render());
  }

/*
    connectedCallback() fires when the element is inserted into the DOM. It's a good place to set the initial role, tabindex, internal state, and install event listeners.
    **/
    connectedCallback() {

      //console.log('connected Callback');
      //create model
      if (!this.parseModel()) return;
      this._ispaused=this.hasAttribute('pause')||false;
     //install show from attributes
    this._show = Object.create(Object.getPrototypeOf(mec.show), Object.getOwnPropertyDescriptors(mec.show)); // copy defaults
    this._show.darkmode = this.getAttribute('darkmode') === "" ? true : false;  // boolean
    this._show.nodes = this.getAttribute('hidenodes') === "" ? false : true;  // boolean
    this._show.constraints = this.getAttribute('hideconstraints') === "" ? false : true;  // boolean
    this._show.nodeLabels = this.getAttribute('nodelabels') === "" ? true : false;  // boolean
    this._show.constraintLabels = this.getAttribute('constraintlabels') === "" ? true : false;  // boolean
    this._show.constraintVector = this.getAttribute('constraintVector') === "" ? true : false;  // boolean
    this._show.nodeInfo = this.hasAttribute('nodeinfo') && (this.getAttribute('nodeinfo') || 'id');  // string
    this._show.constraintInfo = this.hasAttribute('constraintinfo') && (this.getAttribute('constraintinfo') || 'id');  // string
    this._show.font=this.font;
    // set gravity from attribute
    this.gravity = this.getAttribute('gravity') === "" ? true : false;

    //setup model
    

    mec.m_u=0.05;
    this._model = mec.model.extend(this._model, this);
    
    this._model.init();


    // find input-drives
    this._inputs = this._model.inputControlledDrives;
    // find chart elements which are refered to by the model
    this._charts = this._model.views.filter(v => v.as === 'chart' && v.canvas);
    this._chartRefs = this._charts.map(c => document.getElementById(c.canvas));
    // Apply functions to html elements.
    for (const idx in this._chartRefs) {
        const elm = this._chartRefs[idx];
        const chart = this._charts[idx];
        Object.assign(elm, chart.graph);
        elm.nod = () => {
            // this._charts[idx].previewNod;
            const data = chart.graph.funcs[0].data;
            const pt = data.findIndex(data => data.t > chart.local_t);
            return pt === -1
                ? { scl: 0 } // If point is out of bounds
                : {
                    x: (data[pt].x - elm._chart.xmin) * (elm._chart.b / 
                        (elm._chart.xmax - elm._chart.xmin)) + elm._chart.x,
                    y: (data[pt].y - elm._chart.ymin) * (elm._chart.h /
                        (elm._chart.ymax - elm._chart.ymin)) + elm._chart.y,
                    // y: elm._chart.y + elm._chart.h,
                    scl: 1
                };
        }
    }

    //create shadow dom
    this._shadow.innerHTML = Mec3Element.template({
      width: this.width,
      height: this.height
    });


    // get elements from the shadow dom
    this._cnv=this._shadow.getElementById('cnv');
    this._ctx = this._cnv.getContext('2d');
    //set font
    //this._ctx.font = this.font;

    

    
    //create g2 object
    this._viewport={x:this.x0||0,y:this.y0||0,scl:this.scale||1,cartesian:true};
    
    this._g = g2().clr().view(this._viewport);

    //add event listener
    this._cnv.addEventListener('click',e=> this.onclick(e) );
        
    if (this.grid) this._g.grid({ color:'black' });
    //draw model and start simulation
    this._model.draw(this._g);
    this._g.exe(this._ctx);                              // append model-graphics to graphics-obj
    if (!this.pause){window. requestAnimationFrame(() => this.render());}
    
 
    }
    disconnectedCallback() {
      this._cnv.removeEventListener("click", this.cnvclicked, false);
  }
  attributeChangedCallback(name, oldval, val) {
    if (this._shadow && this._shadow.getElementById('cnv')) {
        if (name === 'width') {  // todo: preserve minimum width
            this._shadow.getElementById('cnv').setAttribute('width', val);
            this._shadow.querySelector('.status').style.width = val + 'px';
        }
        if (name === 'height')   // todo: preserve minimum height
            this._shadow.getElementById('cnv').setAttribute('height', val);
    }
}

/**
 * html template of the object
 * @param {number} - width of canvas 
 * @returns 
 */
  static template({width,height}) {
    return `
<style>
#cnv {
    background-color: white;

    touch-action: none;
}
</style>
<canvas id="cnv" width="${width}" height="${height}" touch-action="none"></canvas><br>
<input id="slider" type="range"></input>
`
  }
}

window.onload=()=>{window.customElements.define('mec-3', Mec3Element);}
    
/*ignore jslint end*/ 
