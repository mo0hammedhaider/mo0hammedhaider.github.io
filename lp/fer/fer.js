/* 2026-11-24 فيرونتي — طبقة خاصة فوك engine.js (window.LPX)
   afterStage: شريط الأرقام · box: الهرم العطري التفاعلي (سكرول + لمس) · more: إلك ولها + من قريب
   كل البيانات من LP.fer (src/feronti.py). */
(function(){
var LP=window.LP||{},D=LP.fer;if(!D)return;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function fmt(v,d){return d?v.toFixed(d):Math.round(v).toLocaleString("en-US")}
var RM=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
var X={},P=D.pyr,L=P.layers;

/* ===== شريط الأرقام تحت صورة الهيرو ===== */
X.afterStage='<div class="fx-stats" id="fxStats">'+D.stats.map(function(s){
  return'<div class="fx-st"><b>'+(s.star?'<i>★</i>':'')+(s.pre||"")+'<span class="n" data-to="'+s.v+'" data-d="'+(s.d||0)+'">'+fmt(s.v,s.d)+'</span>'+(s.suf||"")+'</b><small>'+esc(s.l)+'</small></div>'}).join("")+
  '</div><div class="fx-rib"><i></i>'+esc(D.ribbon)+'<i></i></div>';

/* ===== الهرم العطري ===== */
// هندسة: رأس (160,10) قاعدة y=270 نص عرضها 150، وفراغ 8 بين الطبقات
function hw(y){return 150*(y-10)/260}
function band(y1,y2){var a=hw(y1),b=hw(y2);return y1<=10?[[160,10],[160+b,y2],[160-b,y2]]:[[160-a,y1],[160+a,y1],[160+b,y2],[160-b,y2]]}
var G=[band(10,92),band(100,182),band(190,270)],TY=[74,147,236];
function pts(p){return p.map(function(q){return q[0].toFixed(1)+","+q[1].toFixed(1)}).join(" ")}
var defs='<defs><filter id="pyBl" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>'+
  '<linearGradient id="pySw" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
  '<linearGradient id="pyGl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
  '<radialGradient id="pyGround"><stop offset="0" stop-color="#604832" stop-opacity=".22"/><stop offset="1" stop-color="#604832" stop-opacity="0"/></radialGradient>'+
  L.map(function(l,i){return'<linearGradient id="pyF'+i+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+l.c+'"/><stop offset="1" stop-color="'+l.c2+'"/></linearGradient><clipPath id="pyC'+i+'"><polygon points="'+pts(G[i])+'"/></clipPath>'}).join("")+'</defs>';
var svg='<svg class="pyr-svg" id="pySvg" viewBox="0 0 320 290" role="img" aria-label="الهرم العطري لفيرونتي">'+defs+
  '<ellipse cx="160" cy="276" rx="170" ry="14" fill="url(#pyGround)"/>'+
  L.map(function(l,i){var p=pts(G[i]);return'<g class="band" data-i="'+i+'" style="--c:'+l.c+'">'+
    '<polygon class="halo" points="'+p+'" fill="'+l.c+'" filter="url(#pyBl)"/>'+
    '<g clip-path="url(#pyC'+i+')"><polygon class="fill" points="'+p+'" fill="url(#pyF'+i+')"/><polygon points="'+p+'" fill="url(#pyGl)"/>'+
    '<rect class="sw" x="-120" y="0" width="70" height="290" fill="url(#pySw)"/></g>'+
    '<polygon class="edge" points="'+p+'"/>'+
    '<text class="num" x="160" y="'+(TY[i]-(i?17:15))+'">0'+(i+1)+'</text><text class="lb" x="160" y="'+TY[i]+'">'+esc(l.s)+'</text></g>'}).join("")+'</svg>';
X.box='<section class="fx-pyr" id="box"><div class="wrap head reveal"><div class="kick">'+esc(P.k)+'</div><h2 class="h2">'+esc(P.h)+'</h2><p class="lead">'+esc(P.lead)+'</p></div>'+
  '<div class="pyr-sc'+(P.vid?' vid':'')+'" id="pySc"><div class="pyr-st" id="pySt"><div class="pyr-stage'+(P.vid?' vid':'')+'">'+(P.vid?'<video id="pyVid" muted playsinline preload="none" disablepictureinpicture aria-hidden="true" poster="'+P.vid+'.jpg?v='+(P.vidV||'')+'" data-src="'+P.vid+'.mp4?v='+(P.vidV||'')+'"></video>':'<canvas id="pyCv" aria-hidden="true"></canvas>'+svg)+'</div>'+
  '<div class="pyr-card" id="pyCard" aria-live="polite"></div><div class="pyr-hint" aria-hidden="true">نزّل لتحت<i></i></div></div></div>'+
  '<div class="wrap"><figure class="pyr-q reveal"><div class="st">'+"★★★★★".slice(0,P.quote[1]||5)+((P.quote[1]||5)<5?'<em>'+"★★★★★".slice(0,5-P.quote[1])+'</em>':'')+'</div><p>«'+esc(P.quote[0])+'»</p><figcaption>زبون من موقع الدار</figcaption></figure>'+
  radar()+'<div class="fx-words reveal">'+P.words.map(function(w,i){return(i?'<i>·</i>':'')+'<span style="animation-delay:'+(i*.35)+'s">'+esc(w)+'</span>'}).join("")+'</div></div>'+
  vsec(D.vnotes,"fx-vn")+'</section>'+
  (D.unbox?'<section class="sec fx-unbox" id="unbox">'+vsec(D.unbox,"")+
    '<div class="wrap"><ul class="ub-pts reveal">'+D.unbox.pts.map(function(p){return'<li><b>'+esc(p[0])+'</b><span>'+esc(p[1])+'</span></li>'}).join("")+'</ul></div></section>':"");

/* فيديوهات جوّا أقسام فيرونتي — نفس كلاس .reel مال المحرك حتى يشتغل تلقائي ويطلع الصوت باللمس */
function reel(r){return'<div class="reel"><video muted loop playsinline preload="none" poster="'+r[0]+'.jpg" src="'+r[0]+'.mp4"></video>'+
  '<button class="snd" aria-label="الصوت"><svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4zM22 9l-6 6M16 9l6 6"/></svg></button>'+
  '<div class="lab"><b>'+esc(r[1])+'</b><span>'+esc(r[2])+'</span></div></div>'}
function vsec(V,cls){if(!V)return"";return'<div class="vsec '+cls+'"><div class="wrap reveal"><div class="kick">'+esc(V.k)+'</div><h2 class="h2">'+esc(V.h)+'</h2>'+
  (V.lead?'<p class="lead">'+esc(V.lead)+'</p>':"")+'</div><div class="rail'+(V.items.length<3?' two':'')+'">'+V.items.map(reel).join("")+'</div>'+
  '<p class="hint">اضغط على الفيديو حتى تسمع الصوت</p></div>'}

function radar(){var R=88,n=P.radar.length;
  function pt(i,r){var a=-Math.PI/2+2*Math.PI*i/n;return[(r*Math.cos(a)).toFixed(1),(r*Math.sin(a)).toFixed(1)]}
  var rings=[.34,.67,1].map(function(k){return'<polygon class="rg" points="'+P.radar.map(function(_,i){return pt(i,R*k).join(",")}).join(" ")+'"/>'}).join("");
  var axes=P.radar.map(function(_,i){var p=pt(i,R);return'<line class="ra" x1="0" y1="0" x2="'+p[0]+'" y2="'+p[1]+'"/>'}).join("");
  var poly=P.radar.map(function(r,i){return pt(i,R*r[1]).join(",")}).join(" ");
  var dots=P.radar.map(function(r,i){var p=pt(i,R*r[1]);return'<circle class="rd" cx="'+p[0]+'" cy="'+p[1]+'" r="3.4" style="transition-delay:'+(1.1+i*.09)+'s"/>'}).join("");
  var labs=P.radar.map(function(r,i){var p=pt(i,R+22);return'<text class="rl" x="'+p[0]+'" y="'+(+p[1]+5)+'">'+esc(r[0])+'</text>'}).join("");
  return'<div class="fx-radar reveal"><div class="kick">'+esc(P.radarK)+'</div><h3>'+esc(P.radarH)+'</h3><p>'+esc(P.radarLead)+'</p>'+
    '<svg viewBox="-135 -120 270 236" aria-hidden="true"><defs><radialGradient id="rgf"><stop offset="0" stop-color="#B0A99A" stop-opacity=".55"/><stop offset="1" stop-color="#B0A99A" stop-opacity=".22"/></radialGradient></defs>'+
    rings+axes+'<polygon class="rp" points="'+poly+'"/>'+dots+labs+'</svg></div>'}

/* ===== إلك… ولها + من قريب ===== */
var U=D.duo,GL=D.gal;
X.more=['<section class="sec fx-duo" id="duo"><div class="wrap"><div class="reveal"><div class="kick">'+esc(U.k)+'</div><h2 class="h2">'+esc(U.h)+'</h2><p class="lead">'+esc(U.lead)+'</p></div>'+
  '<div class="duo-img reveal"><img loading="lazy" src="'+U.img+'" alt="فيرونتي إله وإلها"><span class="duo-tag">VERONTI · UNISEX</span></div>'+
  '<div class="duo-2">'+[U.he,U.she].map(function(c,i){return'<div class="duo-c reveal"><i class="'+(i?"she":"he")+'"></i><b>'+esc(c[0])+'</b><p>'+esc(c[1])+'</p></div>'}).join("")+'</div>'+
  U.q.map(function(q){return'<figure class="duo-q reveal"><div class="st">★★★★★</div><p>«'+esc(q[0])+'»</p><figcaption>'+esc(q[1])+'</figcaption></figure>'}).join("")+
  '<button class="cta duo-cta" type="button" data-pick="1">'+esc(U.cta)+'<small><span class="n">'+fmt(U.ctaP)+'</span> د.ع</small></button></div></section>',
  '<section class="sec fx-gal" id="gal"><div class="wrap reveal"><div class="kick">'+esc(GL.k)+'</div><h2 class="h2">'+esc(GL.h)+'</h2></div>'+
  '<div class="gal">'+GL.items.map(function(g){return'<figure><img loading="lazy" src="'+g[0]+'" alt="'+esc(g[1])+'"><figcaption>'+esc(g[1])+'</figcaption></figure>'}).join("")+'</div>'+
  '<div class="gal-dots">'+GL.items.map(function(_,i){return'<i'+(i?'':' class="on"')+'></i>'}).join("")+'</div></section>'];

/* ===== التشغيل ===== */
X.init=function(api){var $=api.$,$$=api.$$;
  // 2026-11-24: تعليقات انستغرام الحقيقية داخل قسم الآراء، قبل سكرينات الرسائل (LP.fer.ig)
  var rv=$("#rev"),IG=D.ig;
  if(rv&&IG&&IG.list&&IG.list.length){var hw=rv.querySelector(".wrap"),n=IG.n||4,w=document.createElement("div");w.className="wrap fx-ig";
    w.innerHTML='<div class="fx-igk"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" class="d"/></svg>'+esc(IG.k)+'</div><div class="fx-igl">'+
      IG.list.map(function(s,i){return'<figure class="fx-igc"'+(i>=n?' hidden':'')+'><img loading="lazy" src="'+esc(s)+'" alt="تعليق زبون على انستغرام"></figure>'}).join("")+'</div>'+
      (IG.list.length>n?'<button class="more" id="moreIG">'+esc(IG.more)+' (<span class="n">'+(IG.list.length-n)+'</span>)</button>':"");
    if(hw)hw.parentNode.insertBefore(w,hw.nextSibling);
    var ld=hw&&hw.querySelector("p.lead"),rail=rv.querySelector(".shots");
    if(rail){var lw=document.createElement("div");lw.className="wrap fx-dmk";lw.innerHTML='<div class="fx-igk"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>رسائل وصلتنا بعد الاستلام</div>';if(ld){ld.innerHTML='اسحب وشوف <b class="n">'+rv.querySelectorAll(".shots .shot").length+'</b> رسائل مثل ما وصلتنا ←';lw.appendChild(ld)}rail.parentNode.insertBefore(lw,rail)}
    var mb=$("#moreIG");if(mb)mb.addEventListener("click",function(){w.querySelectorAll(".fx-igc[hidden]").forEach(function(e){e.hidden=false});this.remove()});
  }
  // count-up
  var st=$("#fxStats");
  if(st){var done=0,run=function(){if(done)return;done=1;$$("#fxStats [data-to]").forEach(function(el){var to=+el.dataset.to,d=+el.dataset.d,t0=performance.now(),T=1500;
      if(RM){el.textContent=fmt(to,d);return}
      (function f(t){var k=Math.min(1,(t-t0)/T),e=1-Math.pow(1-k,3);el.textContent=fmt(to*e,d);if(k<1)requestAnimationFrame(f)})(t0)})};
    $$("#fxStats [data-to]").forEach(function(el){el.textContent=fmt(0,+el.dataset.d)});
    if("IntersectionObserver"in window)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){run();o.disconnect()}},{threshold:.4}).observe(st);else run()}

  // الهرم: التقدّم من السكرول داخل pySc
  // 2026-11-25: فيديو المكونات يمشي ويا السكرول (بالعكس: يبدي من الزجاجة عالكريمة، وينزل للورد والريحان، للفانيلا، وللعود)
  var vid=$("#pyVid"),VT=P.vidT||5.9,V0=P.vidT0||0,vT=0,vRaf=0,vOn=false;
  if(vid){
    if(!RM){
      var prime=function(){var pr=vid.play();if(pr&&pr.then)pr.then(function(){if(vid.currentTime>=vT-.03)vid.pause()}).catch(function(){vNP=1});else vid.pause()};
      // نحمّله كامل (blob) حتى التقديم والترجيع يكون سلس بكل المتصفحات (آيفون يحتاجه)
      var vLoad=0,load=function(){if(vLoad)return;vLoad=1;var u=vid.dataset.src,set=function(x){vid.src=x;vid.load();vid.addEventListener("loadeddata",prime,{once:true})};
        if(window.fetch&&window.URL&&URL.createObjectURL)fetch(u).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){set(URL.createObjectURL(b))}).catch(function(){set(u)});else set(u)};
      // 2026-11-25 (محمد): ستموذ + ما يرجع — الفيديو معكوس مسبقاً ويشتغل للأمام (تشغيل طبيعي بدل التقديم فريم فريم)،
      // ينزل العميل يتقدّم ويلحك بسرعة لحد 3x، يصعد يبقى على آخر فريم وصله
      var vNP=0,vPlay=function(){var pr=vid.play();if(pr&&pr.catch)pr.catch(function(){vNP=1})};
      var vstep=function(){vRaf=0;if(!vOn)return;
        if(vid.readyState>=2){var c=vid.currentTime,d=vT-c;
          if(vNP){if(!vid.seeking&&d>.03){try{vid.currentTime=vT}catch(e){}}}
          else if(d>.03){var r=Math.min(3,1+d*1.4);if(Math.abs(vid.playbackRate-r)>.15)vid.playbackRate=r;if(vid.paused)vPlay()}
          else if(!vid.paused)vid.pause()}
        vRaf=requestAnimationFrame(vstep)};
      if("IntersectionObserver"in window)new IntersectionObserver(function(e){vOn=e[0].isIntersecting;if(vOn){load();if(!vRaf)vRaf=requestAnimationFrame(vstep)}},{rootMargin:"900px 0px"}).observe($("#pySc"));
    }
  }
  var sc=$("#pySc"),stk=$("#pySt"),card=$("#pyCard"),sec=$("#box"),bands=$$("#pySvg .band"),bars,cur=-1;
  function paint(i){if(i===cur)return;cur=i;var l=L[i];sec.style.setProperty("--lc",l.c2);
    bands.forEach(function(b,j){b.classList.toggle("on",j===i);b.classList.toggle("past",j<i)});
    card.innerHTML='<div class="pyr-prog">'+L.map(function(x,j){return'<i style="--lc:'+x.c2+'"><b></b></i>'}).join("")+'</div>'+
      '<div class="pyr-t"><small><span class="n">0'+(i+1)+'</span> — '+esc(l.s)+'</small><h3>'+esc(l.t)+'</h3></div>'+
      '<div class="pyr-notes">'+l.notes.map(function(n){return'<div class="pyr-n"><i style="background-image:url('+n[1]+')"></i><span>'+esc(n[0])+'</span></div>'}).join("")+'</div>'+
      '<p class="pyr-p">'+esc(l.p)+'</p>';
    bars=card.querySelectorAll(".pyr-prog b");tint=hex(l.c2)}
  // 2026-11-25 (محمد): من يخلص الفيديو القسم ينطوي لشاشة وحدة، حتى من يصعد ما يوكّفه 3 شاشات مرة ثانية
  var pDone=0;function fold(){pDone=1;var an=sc.nextElementSibling,t0=an?an.getBoundingClientRect().top:0;
    sc.classList.add("done");if(vid)vT=VT;
    var d=an?an.getBoundingClientRect().top-t0:0;if(Math.abs(d)>1)scrollTo({top:scrollY+d,behavior:"instant"})}
  function prog(){if(pDone)return 1;var r=sc.getBoundingClientRect(),h=r.height-innerHeight;var p=h>0?Math.min(1,Math.max(0,-r.top/h)):0;
    var i=p<.34?0:p<.67?1:2;paint(i);
    if(bars)for(var j=0;j<3;j++)bars[j].style.transform="scaleX("+Math.min(1,Math.max(0,p*3-j)).toFixed(3)+")";
    stk.classList.toggle("go",p>.04);
    var q=p*3-i,ns=card.querySelectorAll(".pyr-n");for(var k=0;k<ns.length;k++)ns[k].classList.toggle("on",RM||q>k*.2-.01);
    if(vid){vT=Math.max(vT,Math.min(VT-.05,(VT-V0)*p));if(p>=1&&r.top<0)fold()}return p}
  bands.forEach(function(b){b.addEventListener("click",function(){var i=+b.dataset.i,r=sc.getBoundingClientRect(),h=r.height-innerHeight;
    scrollTo({top:scrollY+r.top+h*(i/3+.16),behavior:RM?"auto":"smooth"})})});
  var tick=0;addEventListener("scroll",function(){if(!tick){tick=1;requestAnimationFrame(function(){tick=0;prog()})}},{passive:true});
  addEventListener("resize",prog);paint(0);prog();

  // بخار خفيف بلون الطبقة (بلا توهّج — قاعدة الهوية 23) يطلع من الهرم (يشتغل بس وكت يبين القسم)
  var cv=$("#pyCv"),cx=cv&&cv.getContext&&cv.getContext("2d"),tint=hex(L[0].c2),parts=[],vis=false,raf=0;
  function hex(c){c=c.replace("#","");return[parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)]}
  function size(){if(!cv)return;var dpr=Math.min(2,devicePixelRatio||1);cv.width=cv.clientWidth*dpr;cv.height=cv.clientHeight*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}
  function spawn(){var w=cv.clientWidth,h=cv.clientHeight;return{x:w*(.3+Math.random()*.4),y:h*(.55+Math.random()*.3),vx:(Math.random()-.5)*.25,vy:-(.25+Math.random()*.55),r:.8+Math.random()*2.2,a:0,life:0,max:180+Math.random()*160}}
  function frame(){raf=0;if(!vis)return;var w=cv.clientWidth,h=cv.clientHeight,dp=Math.min(2,devicePixelRatio||1);if(Math.abs(cv.width-w*dp)>2||Math.abs(cv.height-h*dp)>2)size();cx.clearRect(0,0,w,h);
    while(parts.length<46)parts.push(spawn());
    parts.forEach(function(p,k){p.life++;p.x+=p.vx+Math.sin((p.life+k*20)/40)*.18;p.y+=p.vy;var t=p.life/p.max;p.a=t<.2?t/.2:1-(t-.2)/.8;
      if(p.life>=p.max||p.y<-10)parts[k]=spawn();
      cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fillStyle="rgba("+tint[0]+","+tint[1]+","+tint[2]+","+(p.a*.45).toFixed(3)+")";cx.fill()});
    raf=requestAnimationFrame(frame)}
  if(cx&&!RM){size();addEventListener("resize",size);
    if("IntersectionObserver"in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(frame)}).observe(sc)}

  // «خذ قطعتين» = يختار باقة القطعتين وينزل للطلب
  $$("[data-pick]").forEach(function(b){b.addEventListener("click",function(){var c=$('#pp .pcard[data-i="'+b.dataset.pick+'"]');if(c)c.click();else api.goOrder&&api.goOrder()})});

  // نقاط معرض الصور
  var gal=$(".gal"),dots=$$(".gal-dots i");
  if(gal)gal.addEventListener("scroll",function(){var f=gal.children,best=0,bd=1e9,mid=gal.getBoundingClientRect().left+gal.clientWidth/2;
    for(var i=0;i<f.length;i++){var r=f[i].getBoundingClientRect(),d=Math.abs(r.left+r.width/2-mid);if(d<bd){bd=d;best=i}}
    dots.forEach(function(d,i){d.classList.toggle("on",i===best)})},{passive:true});

  // 2026-11-24 ترتيب: الضمان والتيستر (proof) قبل الطلب، وفيديوهات المكونات بعد الطلب
  var od=$("#order"),pf=$("#proof"),vn=$(".fx-vn");
  if(od&&pf)od.parentNode.insertBefore(pf,od);
  // 2026-11-24 (محمد): الآراء الحقيقية تصعد فوك الضمان والفورم ← آراء · ضمان · طلب
  var rvs=$("#rev");if(od&&rvs)od.parentNode.insertBefore(rvs,pf&&pf.parentNode===od.parentNode?pf:od);
  if(od&&vn){var vs=document.createElement("section");vs.className="sec fx-vnw";vs.appendChild(vn);od.parentNode.insertBefore(vs,od.nextSibling)}
  // نقاط الياء الأخيرة بالاسم (fer.css .nm)
  var h1=$(".hero h1");if(h1&&/ي$/.test(h1.textContent.trim()))h1.innerHTML='<span class="nm">'+h1.innerHTML+'</span>';
  // رمشة الفهد: جفنين ينزلون ويصعدون فوك العيون (fer.css .lid)، كل 3–6 ثواني ومرات رمشتين
  var st=$(".stage.cine");
  if(st&&!RM&&st.animate){
    var lids=["l","r"].map(function(k){var e=document.createElement("i");e.className="lid "+k;e.setAttribute("aria-hidden","true");st.appendChild(e);return e});
    var K=[{clipPath:"inset(0 0 100% 0)"},{clipPath:"inset(0 0 0 0)",offset:.38},{clipPath:"inset(0 0 0 0)",offset:.55},{clipPath:"inset(0 0 100% 0)"}];
    var blink=function(){if(!document.hidden)lids.forEach(function(e){e.animate(K,{duration:260,easing:"ease-in-out"})})};
    var loop=function(){blink();if(Math.random()<.25)setTimeout(blink,340);setTimeout(loop,3000+Math.random()*3200)};
    setTimeout(loop,2300);
  }
};
window.LPX=X;
})();
