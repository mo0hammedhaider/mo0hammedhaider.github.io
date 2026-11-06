/* محرّك صفحات باقات الجمعة البيضاء — go.aljassmi.shop/bf*
   مبني على محرّك الطلب المجرّب (engine.js): نفس النموذج والوسيط والبكسل، والسلّة هنا باقات:
   باقة = سعرها · باقتين = −50,000 · 3 باقات = −90,000 فوق خصم الباقة نفسها.
   القواعد: بلا تواريخ ولا مدد، الندرة بالكمية، «قيمة المنتجات منفردة»، صور حقيقية بس. */
(function(){
"use strict";
var LP=window.LP, BF=window.BF, $=function(s,r){return(r||document).querySelector(s)}, $$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var RELAY="https://script.google.com/macros/s/AKfycbzCI8ZMLFJSYv1Bxrq01OtwmTzFmahi41_Ii9qMr-WVUacFA4u-e7E7tghx_Dbqhd6wXg/exec";
var SHIP=5000, HAIR={was:58000,price:28000,items:[
  {id:"urban",name:"أوربان",d:"منعش ونظيف"},{id:"chic",name:"شيك",d:"ناعم وأنثوي"},{id:"silky",name:"سيلكي",d:"حريري ودافئ"},{id:"majestic",name:"ماجيستك",d:"فخم وعميق"}]};
var money=function(n){return Number(n).toLocaleString("en-US")};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var ICON={
  test:'<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/></svg>',
  back:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/></svg>',
  truck:'<svg viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
  sndOff:'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4zM22 9l-6 6M16 9l6 6"/></svg>',
  sndOn:'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>'
};
var D2=BF.d2, D3=BF.d3, BD=BF.b, PF=BF.pf, ORDER_IDS=BF.order;
var CAT={};ORDER_IDS.forEach(function(b){CAT[b]={name:BD[b].name,rz:BD[b].name,pid:"bf-"+b,price:BD[b].price,was:BD[b].was}});
var ME=LP.bundle||null, HUB=!!LP.hub;
document.documentElement.style.setProperty("--ac",LP.theme.ac);
document.documentElement.style.setProperty("--acs",LP.theme.acs);

/* ===== السلّة: باقتك + (باقة/باقتين) من الباقات الثانية ===== */
var EXTRA=[], SEL=0, PART=ME&&!BD[ME].solo?(LP.partners||[]).slice(0,2):[];
var TIERS=ME?(BD[ME].solo?[1]:[1,2,3]).map(function(q){return{q:q}}):[];
function qty(){return TIERS[SEL].q}
function items(){return [ME].concat(PART.slice(0,qty()-1))}
function sum(){return items().reduce(function(a,b){return a+BD[b].was},0)}
function bsum(){return items().reduce(function(a,b){return a+BD[b].price},0)}
function xd(q){return q===2?D2:q===3?D3:0}
function total(){return bsum()-xd(qty())}
function disc(){return sum()-total()}
function tierCalc(q){var its=[ME].concat(PART.slice(0,q-1)),w=0,p=0;its.forEach(function(b){w+=BD[b].was;p+=BD[b].price});return{its:its,was:w,total:p-xd(q),save:w-(p-xd(q)),extra:xd(q)}}
function unitName(q){return q===1?"باقة واحدة":q===2?"باقتين":q+" باقات"}
function names(its){return its.map(function(b){return BD[b].name}).join(" + ")}

/* ===== مكوّنات الصفحة ===== */
function perfCard(k){var p=PF[k];if(!p)return"";
  var im=p.img?'<img loading="lazy" src="'+p.img+'" alt="'+esc(p.name)+'">':'<div class="noimg"><b>'+esc(p.name)+'</b><small>صورتها قريباً</small></div>';
  var nt=p.notes?'<div class="nt">'+[["الافتتاحية",p.notes.top],["القلب",p.notes.heart],["القاعدة",p.notes.base]].filter(function(x){return x[1]&&x[1].length}).map(function(x){return'<div><em>'+x[0]+'</em><span>'+x[1].join(" · ")+'</span></div>'}).join("")+'</div>':(p.d?'<p class="pd">'+p.d+'</p>':"");
  return'<div class="pcard reveal'+(p.img?"":" ni")+'"><div class="pim">'+im+'</div><div class="pin"><b>'+esc(p.name)+'</b>'+(p.line?'<span class="pl">'+esc(p.line)+'</span>':"")+nt+'</div></div>'}
function bundleCard(b,cls){var B=BD[b];return'<a class="bcard reveal'+(cls?" "+cls:"")+'" href="../'+B.slug+'/"><img loading="lazy" src="../lp/bf/hero-'+b+'.webp" alt="'+esc(B.name)+'"><div class="bt"><b>'+esc(B.name)+'</b><span>'+esc(B.short)+'</span></div><div class="bp"><s class="n">'+money(B.was)+'</s><b class="n">'+money(B.price)+'</b><small>د.ع · توفّر '+money(B.was-B.price)+'</small></div></a>'}

var A=[];
A.push('<div class="ticker" aria-hidden="true"><div class="t">'+[0,1,2].map(function(){return["باقات الجمعة البيضاء","تجرّب التستر قبل لا تدفع","ضمان 7 أيام استبدال واسترجاع","توصيل لكل المحافظات 5,000","الدفع عند الاستلام"].map(function(t){return"<span>"+t+"</span>"}).join("")}).join("")+'</div></div>');
A.push('<header class="wrap hdr"><img src="../lp/logo.png" alt="الجسمي"><b>دار الجسمي للعطور</b></header>');

if(HUB){
  A.push('<section class="hero bfh"><div class="wrap"><div class="en">WHITE FRIDAY · باقات الجمعة البيضاء</div><h1>7 باقات… وتوفير فوق التوفير</h1><p class="tag">اختار باقتك، وإذا تاخذ باقتين أو 3 ينزل خصم إضافي.</p>'+
    '<div class="ladder3"><div><small>باقة واحدة</small><b>سعرها الثابت</b></div><div class="mid"><small>باقتين</small><b class="n">−50,000</b><em>خصم إضافي</em></div><div><small>3 باقات</small><b class="n">−90,000</b><em>خصم إضافي</em></div></div>'+
    '<p class="sub">الخصم الإضافي فوق خصم الباقة نفسها. كل باقة لأول 500 طلب، وكبار الشخصيات لأول 25 طلب. تجرب التستر قبل لا تدفع.</p>'+
    '<a class="cta" href="#bundles" data-go-s>شوف الباقات</a></div></section>');
  A.push('<section class="sec" id="bundles"><div class="wrap reveal"><div class="kick">الباقات السبع</div><h2 class="h2">اختار اللي يشبهك</h2><p class="lead">«قيمة المنتجات منفردة» هي مجموع أسعار العطور لو تشتريها كل وحدة لحالها.</p></div><div class="wrap bgrid">'+ORDER_IDS.map(function(b){return bundleCard(b)}).join("")+'</div></section>');
}else{
  var B=BD[ME], sv=B.was-B.price;
  A.push('<section class="hero bfh"><div class="wrap"><div class="en">'+esc(LP.en)+'</div><h1>'+esc(LP.name)+'</h1><p class="tag">'+LP.hero.tag+'</p>'+
    '<div class="stage bf"><div class="halo"></div><div class="plinth"></div><img class="bfimg" src="../lp/bf/hero-'+ME+'.webp" alt="'+esc(LP.name)+'" fetchpriority="high"><div class="spec">'+LP.spec.map(function(s){return"<span>"+s+"</span>"}).join("")+'</div></div>'+
    '<p class="sub">'+LP.hero.sub+'</p>'+
    '<div class="proof"><div class="pf scar"><b>'+(B.solo?"لأول <span class=\"n\">25</span> طلب بس":"لأول <span class=\"n\">500</span> طلب")+'</b><small>الكمية محدودة</small></div><div class="pf" id="ordersPill" hidden><span class="dot"></span><b>تثبّت <span class="n" id="ordersN"></span> طلب من هالصفحة</b></div></div>'+
    '<div class="pricebox"><div class="now"><small>سعر الباقة</small><span class="n" id="hNow"></span> <span class="u">د.ع</span></div><div class="note" id="hNote"></div></div>'+
    (B.solo?'':'<div class="ladder3 sm"><div><small>باقة</small><b class="n">'+money(B.price)+'</b></div><div class="mid"><small>باقتين</small><b class="n">−50,000</b><em>إضافية</em></div><div><small>3 باقات</small><b class="n">−90,000</b><em>إضافية</em></div></div>')+
    '<a class="cta" href="#order" data-go>ثبّت باقتك <small>· تدفع عند الاستلام</small></a>'+
    '<div class="chips"><span class="chip">'+ICON.test+'جرّب التستر قبل الدفع</span><span class="chip">'+ICON.back+'ضمان 7 أيام</span><span class="chip">'+ICON.truck+'5,000 لكل العراق</span></div></div></section>');

  // سلّم الأسعار: باقة / باقتين / 3 باقات بأحسن شريك
  if(!B.solo)A.push('<section class="sec" id="ladder"><div class="wrap"><div class="reveal"><div class="kick">3 أسعار</div><h2 class="h2">كل ما تزيد باقة، يزيد التوفير</h2><p class="lead">الأسعار تحت محسوبة بأنسب الباقات إلك، وتكدر تبدّلها وقت الطلب.</p></div><div class="lad" id="lad"></div></div></section>');

  // شنو داخل الباقة
  A.push('<section class="sec dark" id="inside"><div class="wrap reveal"><div class="kick">شنو داخل الباقة</div><h2 class="h2">'+B.contents.length+(B.contents.length>2?" ":" ")+'قطع… وكل وحدة بقصتها</h2><p class="lead">قيمة المنتجات منفردة <b class="n">'+money(B.was)+'</b> د.ع. بالباقة <b class="n">'+money(B.price)+'</b>.</p></div><div class="wrap pgrid">'+B.contents.map(perfCard).join("")+'</div></section>');

  // الفيديوات
  if(LP.reels&&LP.reels.length)A.push('<section class="sec dark" id="reels" style="padding-top:0"><div class="wrap reveal"><div class="kick">ناس حقيقيين</div><h2 class="h2">شوف العطور بعيونك</h2></div><div class="rail" id="rail">'+
    LP.reels.map(function(r){return'<div class="reel"><video muted loop playsinline preload="none" poster="'+r[0]+'.jpg" src="'+r[0]+'.mp4"></video><button class="snd" aria-label="الصوت">'+ICON.sndOff+'</button><div class="lab"><b>'+esc(r[1])+'</b><span>'+esc(r[2])+'</span></div></div>'}).join("")+
    '</div><p class="hint">اضغط على الفيديو حتى تسمع الصوت</p></section>');

  // القصة
  A.push('<section class="sec" id="story"><div class="wrap reveal"><div class="kick">'+esc(LP.story.k)+'</div><h2 class="h2">'+LP.story.h+'</h2><div class="story">'+LP.story.ps.map(function(p,i){return i===LP.story.qAt?'<p class="q">'+p+'</p>':"<p>"+p+"</p>"}).join("")+'</div></div></section>');

  // الآراء
  A.push('<section class="sec" id="rev" style="background:#f3ebe2"><div class="wrap reveal"><div class="kick">رسائل زبائن حقيقيين</div><h2 class="h2">شنو كتبولنا بعد ما وصلهم</h2></div><div class="shots">'+["damar-01-9237","nabd-01-9239","elite-01-9166","kivora-01-9272","darius-01-9191","damar-02-9644","nabd-02-9225","elite-02-9210","kivora-02-9462_2","darius-02-9146","damar-03-9280","nabd-03-9255","elite-03-9162","kivora-03-9863"].map(function(n){return'<div class="shot"><img loading="lazy" decoding="async" src="../lp/rev2/'+n+'.webp" alt="رسالة زبون"></div>'}).join("")+'</div><div class="wrap"><div class="quotes" id="quotes"></div><p class="disc">الرسائل منقولة مثل ما وصلتنا عن عطور الدار.</p></div></section>');

  // الأمان
  A.push('<section class="sec dark" id="safe"><div class="wrap reveal"><div class="kick">المخاطرة علينا</div><h2 class="h2">ما تدفع على شي ما جرّبته</h2><div class="steps">'+
    [["1","تطلب من هنا بدقيقة","بس اسمك ورقمك وعنوانك. ما تدفع شي هسه."],["2","يوصلك المندوب ويّا تستر","تجرب العطر قدامه قبل لا تفتح علبتك."],["3","تدفع إذا عجبك","ما عجبك؟ ترجّعه بمكانه وما تدفع ولا دينار."]].map(function(s){return'<div class="st3"><div class="k">'+s[0]+'</div><div><b>'+s[1]+'</b><p>'+s[2]+'</p></div></div>'}).join("")+
    '</div><div class="gbox"><h3>وبعد الاستلام، عندك 7 أيام</h3><ul><li>الاستبدال مفتوح وبأي فرع من فروع الدار، حتى لو طلبت أونلاين.</li><li>أول استبدال أو استرجاع بالتوصيل علينا.</li><li>نقبل فاتورة الفرع أو فاتورة التوصيل، أو حتى صورتها.</li></ul><div class="dl"><div><small>التوصيل</small><b class="n">5,000</b></div><div><small>بغداد</small><b>خلال 18 ساعة</b></div><div><small>المحافظات</small><b>24–48 ساعة</b></div></div></div></div></section>');

  // الطلب
  A.push('<section class="order dark" id="order"><div class="wrap"><div class="kick">ثبّت باقتك</div><h2 class="h2">اختار عرضك</h2><p class="lead">'+(B.solo?'باقة واحدة لأول 25 طلب بس.':'باقتين بخصم إضافي <b class="n">50,000</b>، و3 باقات بخصم <b class="n">90,000</b>.')+'</p>'+
    '<div class="tiers" id="tiers"></div>'+
    (B.solo?'':'<div class="build"><div class="pick-h" id="pickH"></div><p class="pick-l" id="pickL"></p><div class="bpicks" id="picks"></div></div>')+
    '<form class="form" id="form" novalidate><div class="f"><label for="nm">الاسم</label><input id="nm" autocomplete="name" placeholder="اسمك الكامل"><div class="em">اكتب اسمك</div></div>'+
    '<div class="f"><label for="ph">رقم الموبايل</label><input id="ph" inputmode="numeric" autocomplete="tel" placeholder="07xxxxxxxxx" dir="ltr" style="text-align:right"><div class="hint" id="phHint"></div><div class="em" id="phMsg">اكتب رقم عراقي صحيح يبدي بـ07</div></div>'+
    '<div class="f"><label for="gv">المحافظة</label><select id="gv"><option value="">اختار المحافظة</option></select><div class="em">اختار المحافظة</div></div>'+
    '<div class="f"><label for="ad">العنوان</label><textarea id="ad" placeholder="المنطقة، أقرب نقطة دالة"></textarea><div class="em">اكتب العنوان</div></div>'+
    '<div class="osum" id="osum"></div><button class="submit" id="sub" type="submit">ثبّت الطلب · الدفع عند الاستلام</button>'+
    '<div class="osafe"><span>✓ تجرب التستر قبل الدفع</span><span>✓ ضمان 7 أيام</span><span>✓ نتصل بيك نأكد</span></div></form></div></section>');

  // الأسئلة
  var FAQ=[["ما أكدر أشمّها من الموبايل… شلون أعرف إذا تعجبني؟","ما تحتاج تخمّن. المندوب يوصل ويّا تستر زجاجي، تجربه قدامه بدون ما تفتح علبة العطر. إذا ما ناسبك، ترفض الطلب بمكانه وما تدفع شي."],
    ["شلون يشتغل خصم الباقتين والثلاث؟","كل باقة بسعرها الثابت، وإذا تاخذ باقتين ينزل المجموع 50,000 إضافية، و3 باقات 90,000 إضافية. الخصم فوق خصم الباقة نفسها، وتختار الباقات اللي تريدها."],
    ["شنو يعني «قيمة المنتجات منفردة»؟","هي مجموع أسعار كل عطر ومنتج بالباقة لو تشتريها وحدة وحدة. الباقة أرخص منها."],
    ["الباقة لشوكت؟","كل باقة لأول 500 طلب، وكبار الشخصيات لأول 25 طلب. إذا خلصت الكمية تنسد الباقة."],
    ["شوكت يوصلني؟ وبكم التوصيل؟","التوصيل 5,000 د.ع لكل المحافظات. ببغداد خلال 18 ساعة من تأكيد الطلب، وباقي المحافظات 24 إلى 48 ساعة. المندوب يتصل بيك قبل ما يوصل."],
    ["لازم أدفع هسه؟","لا. تدفع نقداً للمندوب بعد ما تجرب التستر. بعد ما ترسل الطلب نتصل بيك نأكد العنوان."]].concat(LP.faq||[]);
  A.push('<section class="sec" id="faq"><div class="wrap"><div class="kick">قبل لا تطلب</div><h2 class="h2">أسئلة تدور براسك</h2><div style="margin-top:14px">'+FAQ.map(function(q,i){return'<details class="qa"'+(i===0?" open":"")+'><summary>'+q[0]+'<i></i></summary><p>'+q[1]+'</p></details>'}).join("")+'</div><a class="cta" href="#order" data-go>ثبّت '+esc(LP.name)+'</a></div></section>');
}

A.push('<footer class="foot"><div class="wrap"><img src="../lp/logo-light.png" alt="الجسمي"><b>دار الجسمي للعطور</b><p>العطر تجربة، مو اختيار.</p><div class="others">'+(HUB?"":'<a href="../bf/">كل الباقات</a>')+ORDER_IDS.filter(function(b){return b!==ME}).map(function(b){return'<a href="../'+BD[b].slug+'/">'+BD[b].name+'</a>'}).join("")+'</div></div></footer>');
if(!HUB)A.push('<div class="sticky" id="sticky"><div class="in"><div class="pr"><small id="stLab">'+esc(LP.name)+'</small><b><span id="stPr"></span> <small>د.ع</small></b></div><a class="go" href="#order" data-go>ثبّت باقتك</a></div></div><div class="modal" id="up"><div class="sheet" id="upSheet"></div></div>');
document.getElementById("app").innerHTML=A.join("");

/* ===== التفاعل ===== */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
$$(".reveal").forEach(function(el){io.observe(el)});
var vio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.intersectionRatio>.6){v.play().catch(function(){})}else{v.pause()}})},{threshold:[0,.6,1]});
$$(".reel video").forEach(function(v){vio.observe(v)});
$$(".reel").forEach(function(el){el.addEventListener("click",function(){var v=$("video",el),on=v.muted;
  $$(".reel video").forEach(function(o){o.muted=true});$$(".reel .snd").forEach(function(b){b.innerHTML=ICON.sndOff});
  v.muted=!on;if(on){v.currentTime=0;v.play().catch(function(){});$(".snd",el).innerHTML=ICON.sndOn;track("ViewReel")}})});
$$("[data-go-s]").forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();$("#bundles").scrollIntoView({behavior:"smooth"})})});
if(HUB){track("ViewContent",{content_ids:ORDER_IDS.map(function(b){return"bf-"+b}),content_name:"باقات الجمعة البيضاء",content_type:"product"});return}

// الآراء
if($("#quotes")){var Q=LP.quotes||[];$("#quotes").innerHTML=Q.map(function(q){return'<div class="qt"><div class="st">★★★★★</div><p>«'+esc(q[0])+'»</p><div class="w"><span>زبون من زبائن الجسمي</span>'+(q[1]?"<em>"+esc(q[1])+"</em>":"")+'</div></div>'}).join("")}

/* ===== السلّم + السلّة ===== */
function paintLadder(){var L=$("#lad");if(!L)return;
  L.innerHTML=[1,2,3].map(function(q,i){var c=tierCalc(q);return'<button type="button" class="lc'+(q===2?" best":"")+'" data-q="'+q+'">'+(q===2?'<span class="badge">الأفضل قيمة</span>':q===3?'<span class="badge b3">أعلى توفير</span>':"")+
    '<small>'+unitName(q)+'</small><div class="ln">'+c.its.map(function(b){return"<i>"+esc(BD[b].name)+"</i>"}).join("")+'</div><s class="n">'+money(c.was)+'</s><b class="n">'+money(c.total)+'</b><span class="u">د.ع</span><em>توفّر <b class="n">'+money(c.save)+'</b>'+(c.extra?' <span>· منها '+money(c.extra)+' إضافية</span>':"")+'</em></button>'}).join("");
  $$(".lc",L).forEach(function(b){b.addEventListener("click",function(){SEL=Math.min(+b.dataset.q-1,TIERS.length-1);paintCart();$("#order").scrollIntoView({behavior:"smooth"})})})}
function paintCart(){var T=TIERS[SEL],q=T.q,d=disc(),tot=total();
  $("#tiers").innerHTML=TIERS.map(function(t,i){var c=tierCalc(t.q);return'<button type="button" class="tier'+(i===SEL?" on":"")+'" data-i="'+i+'">'+(t.q===2?'<span class="badge">الأفضل قيمة</span>':t.q===3?'<span class="badge">أعلى توفير</span>':"")+
    '<span class="rd"></span><span class="tt"><b>'+unitName(t.q)+'</b><span>'+esc(names(c.its))+'</span><span class="save">توفّر '+money(c.save)+' د.ع</span></span><span class="tp"><s>'+money(c.was)+'</s><b>'+money(c.total)+'</b></span></button>'}).join("");
  $$(".tier").forEach(function(b){b.addEventListener("click",function(){SEL=+b.dataset.i;paintCart()})});
  if($("#picks")){
    $("#pickH").textContent=q===1?"تريد توفير أكثر؟":"اختار الباقة"+(q===3?"تين":"")+" "+(q===3?"الثانية والثالثة":"الثانية");
    $("#pickL").innerHTML=q===1?'اضغط «باقتين» أو «3 باقات» فوق وتنزل عليك <b class="n">50,000</b> أو <b class="n">90,000</b> إضافية.':'اضغط على الباقات حتى تبدّل. لازم تختار <b class="n">'+(q-1)+'</b>.';
    $("#picks").style.display=q===1?"none":"grid";
    var best=-1,bid=null;ORDER_IDS.forEach(function(b){if(b===ME||BD[b].solo)return;var s=BD[b].was-BD[b].price;if(s>best){best=s;bid=b}});
    $("#picks").innerHTML=ORDER_IDS.filter(function(b){return b!==ME&&!BD[b].solo}).map(function(b){var on=PART.slice(0,q-1).indexOf(b)>=0,B2=BD[b];
      return'<button type="button" class="bk'+(on?" on":"")+'" data-b="'+b+'">'+(b===bid?'<span class="tg">أعلى توفير</span>':"")+'<img loading="lazy" src="../lp/bf/hero-'+b+'.webp" alt=""><b>'+esc(B2.name)+'</b><span class="n">'+money(B2.price)+'</span><i>'+(on?"✓ مختارة":"+ اختار")+'</i></button>'}).join("");
    $$("#picks .bk").forEach(function(b){b.addEventListener("click",function(){var id=b.dataset.b,i=PART.indexOf(id);if(i>=0&&PART.length>q-1||i>=0&&q-1>0&&PART.slice(0,q-1).indexOf(id)>=0){PART.splice(i,1)}else{PART.unshift(id);PART=PART.slice(0,q-1)}paintCart()})}); }
  var ls=items().map(function(b){return'<div><span>'+esc(BD[b].name)+'</span><span class="n">'+money(BD[b].price)+'</span></div>'}).join("");
  var ok=items().length===q; 
  $("#osum").innerHTML=ls+(xd(q)?'<div class="sv"><span>خصم إضافي ('+unitName(q)+')</span><span class="n">−'+money(xd(q))+'</span></div>':"")+'<div><span>التوصيل</span><span class="n">'+money(SHIP)+'</span></div><div class="tot"><span>المجموع عند الاستلام</span><span><span class="n">'+money(tot+SHIP)+'</span> د.ع</span></div>';
  $("#hNow").textContent=money(BD[ME].price);
  $("#hNote").innerHTML='قيمة المنتجات منفردة <s class="n">'+money(BD[ME].was)+'</s><br>وفّرت <b class="n">'+money(BD[ME].was-BD[ME].price)+'</b> د.ع';
  $("#stPr").textContent=money(tot);$("#stLab").textContent=q===1?LP.name:unitName(q)+" · وفّرت "+money(d);
  $("#sub").disabled=!ok;
  paintLadder();
}
paintCart();

/* ===== الشريط السفلي والأزرار ===== */
var orderSec=$("#order"),heroCta=$(".hero .cta"),inHero=true,inOrder=false;
function stick(){$("#sticky").classList.add("show")}stick();
new IntersectionObserver(function(e){inHero=e[0].isIntersecting;stick()}).observe(heroCta);
new IntersectionObserver(function(e){inOrder=e[0].isIntersecting;stick()},{threshold:.05}).observe(orderSec);
function bindGo(r){$$("[data-go]",r).forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();orderSec.scrollIntoView({behavior:"smooth"});if(!window.__ic){window.__ic=1;track("InitiateCheckout",{value:total(),currency:"IQD",content_ids:items().map(function(s){return CAT[s].pid})})}})})}
bindGo(document);

/* ===== النموذج ===== */
var GOV=["بغداد","البصرة","نينوى","أربيل","النجف","كربلاء","بابل","ذي قار","الأنبار","ديالى","صلاح الدين","كركوك","واسط","ميسان","الديوانية","المثنى","السليمانية","دهوك","حلبجة"];
$("#gv").innerHTML+=GOV.map(function(g){return"<option>"+g+"</option>"}).join("");
var toEn=function(v){return String(v||"").replace(/[٠-٩]/g,function(c){return c.charCodeAt(0)-1632}).replace(/[۰-۹]/g,function(c){return c.charCodeAt(0)-1776})};
var normPhone=function(v){var d=toEn(v).replace(/\D/g,"").replace(/^00964/,"").replace(/^964/,"");if(d.charAt(0)==="7")d="0"+d;return d};
(function(){var ph=$("#ph"),hint=$("#phHint");
  function fix(){var v=toEn(ph.value).replace(/\D/g,"");if(v.length>11)v=v.slice(0,11);if(ph.value!==v)ph.value=v;
    if(!v){hint.textContent="";hint.className="hint";return}
    if(v.length<11){hint.textContent="الرقم ناقص: "+v.length+" من 11";hint.className="hint"}
    else if(!/^07[3-9]/.test(v)){hint.textContent="الرقم لازم يبدي بـ07";hint.className="hint"}
    else{hint.textContent="✓ الرقم كامل";hint.className="hint ok";ph.closest(".f").classList.remove("err")}}
  ph.addEventListener("input",fix);ph.addEventListener("blur",fix);ph.addEventListener("paste",function(){setTimeout(fix,0)});
  $("#nm").addEventListener("focus",function(){if(!window.__ic){window.__ic=1;track("InitiateCheckout",{value:total(),currency:"IQD"})}},{once:true});
})();
function setErr(id,bad){$("#"+id).closest(".f").classList.toggle("err",bad);return bad}
var ORDER=null;
$("#form").addEventListener("submit",function(e){e.preventDefault();
  var nm=$("#nm").value.trim(),ph=normPhone($("#ph").value),gv=$("#gv").value,ad=$("#ad").value.trim();
  var bad=[setErr("nm",nm.length<2),setErr("ph",!/^07[3-9]\d{8}$/.test(ph)),setErr("gv",!gv),setErr("ad",ad.length<4)].some(Boolean);
  if(bad){var f=$(".f.err input,.f.err select,.f.err textarea");f&&f.focus();return}
  ORDER={name:nm,phone:ph,governorate:gv,address:ad,items:items(),q:qty(),sel:SEL,extra:EXTRA.slice(),sum:sum(),disc:disc(),total:total()};SENT=null;
  matchUser(ORDER);
  if(BD[ME].solo){$("#up").classList.add("open");document.body.style.overflow="hidden";finish(null)}else showUpsell();
});

/* ===== قبل التثبيت: عطر الشعر بـ28 بدل 58، وبعدها طلب واحد ===== */
var pick=null,SENT=null,AUTO=null,LDI=null;
var HAIR_WHY=["يحمي شعرك من حرارة الشسوار والشمس","خالي من الكحول، وبدون كبريتات أو سيليكون أو بارابين","بيه زيت الأرغان وزيت جوز الهند للترطيب","فيتامين E و B5، وكيراتين نانو يرجّع اللمعة","خفيف ومو دهني: إذا تشسور هواي يغنيك عن الكريمات الثقيلة"];
function showUpsell(){
  $("#upSheet").innerHTML='<h3>قبل لا نثبّت الطلب… هذا عرض بس إلك</h3><p class="lead">ضيف عطر شعر لنفس الطلب ونفس التوصيل بـ<b class="n" style="color:var(--br)">28,000</b> بدل <s class="n">58,000</s>.</p><ul class="hwhy">'+HAIR_WHY.map(function(w){return"<li>"+w+"</li>"}).join("")+'</ul><div class="hairs">'+
   HAIR.items.map(function(h){return'<button class="hair" data-id="'+h.id+'"><img src="../lp/hair-'+h.id+'.jpg" alt="عطر شعر '+h.name+'"><b>'+h.name+'</b><small>'+h.d+'</small><div class="hp"><s>'+money(HAIR.was)+'</s><span>'+money(HAIR.price)+'</span></div></button>'}).join("")+
   '</div><button class="add" id="addH" disabled>اختار عطر الشعر</button><button class="skip" id="skipH">ثبّت الطلب بدونه</button>';
  $("#up").classList.add("open");document.body.style.overflow="hidden";
  $$(".hair").forEach(function(b){b.addEventListener("click",function(){pick=b.dataset.id;$$(".hair").forEach(function(o){o.classList.toggle("on",o===b)});var h=HAIR.items.filter(function(x){return x.id===pick})[0];$("#addH").disabled=false;$("#addH").textContent="ضيف "+h.name+" وثبّت الطلب"})});
  $("#addH").addEventListener("click",function(){finish(pick)});$("#skipH").addEventListener("click",function(){finish(null)});
  clearTimeout(AUTO);AUTO=setTimeout(function(){finish(null,true)},60000);
}
addEventListener("pagehide",function(){if(ORDER&&!SENT)beacon()});
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden"&&ORDER&&!SENT)beacon()});
function loading(){$("#upSheet").innerHTML='<div class="ld"><div class="spin"></div><h3 id="ldT">نثبّت طلبك…</h3><div class="ldbar"><i></i></div><p class="lead">لا تسكّر الصفحة، ثواني بس.</p></div>';
  var m=["نثبّت طلبك…","نرسله لفريق الدار…","نجهّز التستر ويّا طلبك…"],k=0;LDI=setInterval(function(){k=(k+1)%m.length;var t=$("#ldT");t&&(t.textContent=m[k])},1300)}
function finish(hairId,silent){if(SENT)return;clearTimeout(AUTO);ORDER.hair=hairId||null;if(!silent)loading();
  SENT=placeOrder(ORDER).then(function(){clearInterval(LDI);done()}).catch(function(){clearInterval(LDI);SENT=null;
    $("#upSheet").innerHTML='<h3>صار خلل بالاتصال</h3><p class="lead">طلبك ما وصل بعد. جرّب مرة ثانية.</p><button class="add" id="retry">أعد المحاولة</button>';$("#retry").addEventListener("click",function(){finish(hairId)})})}
function beacon(){try{SENT=true;navigator.sendBeacon(RELAY,new Blob([JSON.stringify(payload(ORDER))],{type:"text/plain;charset=UTF-8"}))}catch(e){}}
function done(){var tot=ORDER.total+SHIP+(ORDER.hair?HAIR.price:0);
  $("#upSheet").innerHTML='<div class="done"><div class="ok" style="justify-content:center"><i>✓</i>طلبك تثبّت</div><h3>شكراً '+esc(ORDER.name.split(" ")[0])+' 🤍</h3><p class="lead">راح نتصل بيك على <span class="n" dir="ltr">'+ORDER.phone+'</span> نأكد العنوان. المجموع عند الاستلام <b class="n" style="color:var(--br)">'+money(tot)+'</b> د.ع، وتجرّب التستر قبل لا تدفع.</p><button class="add" id="closeUp">تمام</button></div>';
  $("#closeUp").addEventListener("click",function(){$("#up").classList.remove("open");document.body.style.overflow=""});
  $("#sub").disabled=true;$("#sub").textContent="تم تثبيت طلبك ✓";
}

/* ===== الربط: وسيط Apps Script → قناة «طلبات الجسمي» + شيت ===== */
function relay(p){p.page=LP.slug;return fetch(RELAY,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(p),redirect:"follow"}).then(function(r){return r.json()}).then(function(j){if(!j.ok)throw new Error(j.error||"relay");return j})}
var SRC=(function(){var k="aj_src",q=new URLSearchParams(location.search),v={};["utm_source","utm_campaign","utm_content","utm_term","fbclid"].forEach(function(n){if(q.get(n))v[n]=q.get(n).slice(0,80)});
  try{if(Object.keys(v).length)sessionStorage.setItem(k,JSON.stringify(v));else v=JSON.parse(sessionStorage.getItem(k)||"{}")}catch(e){}return v})();
function srcLine(){var a=SRC.utm_content||SRC.utm_campaign;return a?"الإعلان: "+a+(SRC.utm_campaign&&SRC.utm_content?" · "+SRC.utm_campaign:""):(SRC.fbclid?"الإعلان: ميتا (بدون اسم)":"الإعلان: زيارة مباشرة")}
function hairName(id){var h=HAIR.items.filter(function(x){return x.id===id})[0];return "عطر شعر "+(h?h.name:id)}
function orderText(o){
  var q=o.q, hp=o.hair?HAIR.price:0, all=o.total+hp, nm=o.items.map(function(s){return CAT[s].rz});
  var L=["━━━━━━━━━━━━"];
  L.push("🛍 باقات الجمعة البيضاء: "+nm.join(" + ")+" · "+unitName(q));
  if(o.disc)L.push("🏷 توفير: "+money(o.disc)+(q>1?" (منها "+money(xd(q))+" خصم إضافي لـ"+unitName(q)+")":""));
  if(o.hair)L.push("➕ إضافة على نفس الطلب: "+hairName(o.hair)+" بـ28,000 بدل 58,000");
  L.push("💰 المجموع: "+money(all)+" + توصيل "+money(SHIP)+" = "+money(all+SHIP)+" د.ع (دفع عند الاستلام)","━━━━━━━━━━━━","",
    "الاسم: "+o.name,"الرقم: "+o.phone,"العنوان: "+o.governorate+" "+o.address,"","تفاصيل الطلب:");
  o.items.forEach(function(s){L.push("المنتج: "+CAT[s].rz+"، العدد: 1")});
  var base=o.items.reduce(function(a,s){return a+CAT[s].price},0), rzDisc=base-o.total;
  if(rzDisc)L.push("الخصم: "+money(rzDisc));
  if(o.hair)L.push("المنتج: "+hairName(o.hair)+" · بـ28 ألف بدل 58 (عرض الصفحة)، العدد: 1");
  L.push("السعر: "+money(all)+" وتوصيل "+money(SHIP),"","ملاحظة: تجربة العطر من خلال التيستر فقط","المصدر: صفحة "+LP.name,srcLine());
  return L.join("\n");
}
function capiData(v,ids,n){function ck(k){var m=document.cookie.match(new RegExp("(?:^|; )"+k+"=([^;]*)"));return m?decodeURIComponent(m[1]):""}var fbc=ck("_fbc");if(!fbc&&SRC.fbclid)fbc="fb.1."+Date.now()+"."+SRC.fbclid;return {fbp:ck("_fbp"),fbc:fbc,ua:navigator.userAgent.slice(0,400),url:location.href.split("#")[0].slice(0,500),value:v,currency:"IQD",ids:ids,n:n}}
function payload(o){if(!o.ref)o.ref=LP.code+"-"+Date.now().toString(36).toUpperCase();
  return {kind:"order",page:LP.slug,ref:o.ref,name:o.name,phone:o.phone,governorate:o.governorate,summary:o.items.map(function(s){return CAT[s].name}).join(" + ")+(o.hair?" + "+hairName(o.hair):""),text:"#طلب_جديد "+o.ref+"\n"+orderText(o),capi:capiData(o.total+(o.hair?HAIR.price:0),o.items.map(function(s){return CAT[s].pid}).concat(o.hair?["hair-"+o.hair]:[]),o.items.length)}}
function placeOrder(o){return relay(payload(o)).then(function(){track("Purchase",{content_ids:o.items.map(function(s){return CAT[s].pid}).concat(o.hair?["hair-"+o.hair]:[]),content_type:"product",value:o.total+(o.hair?HAIR.price:0),currency:"IQD",num_items:o.items.length},{eventID:o.ref})})}
// مطابقة متقدمة: نعطي البكسل رقم الزبون واسمه ومحافظته لحظة «ثبّت»، والبكسل يشفّرهن بنفسه (SHA-256) قبل ما يطلعن
var GOV_EN={"بغداد":"baghdad","البصرة":"basra","نينوى":"nineveh","أربيل":"erbil","النجف":"najaf","كربلاء":"karbala","بابل":"babil","ذي قار":"dhiqar","الأنبار":"anbar","ديالى":"diyala","صلاح الدين":"salahaddin","كركوك":"kirkuk","واسط":"wasit","ميسان":"maysan","الديوانية":"diwaniyah","المثنى":"muthanna","السليمانية":"sulaymaniyah","دهوك":"duhok","حلبجة":"halabja"};
function matchUser(o){try{if(!window.fbq||typeof AJ_PIXEL==="undefined")return;var n=o.name.toLowerCase().split(/\s+/).filter(Boolean),u={ph:"964"+o.phone.slice(1),country:"iq"};if(n[0])u.fn=n[0];if(n.length>1)u.ln=n[n.length-1];if(GOV_EN[o.governorate])u.ct=GOV_EN[o.governorate];fbq("init",AJ_PIXEL,u)}catch(e){}}
function track(ev,p,o){try{if(!window.fbq)return;var std=["Purchase","AddToCart","InitiateCheckout","ViewContent"];if(std.indexOf(ev)>=0)fbq("track",ev,p||{},o||{});else fbq("trackCustom",ev,p||{})}catch(e){}}


/* ===== عدّاد حقيقي (زوار + طلبات هالصفحة) ===== */
(function(){var sid;try{sid=sessionStorage.getItem("aj_sid")||Math.random().toString(36).slice(2,12);sessionStorage.setItem("aj_sid",sid)}catch(e){sid=Math.random().toString(36).slice(2,12)}
  function ping(){fetch(RELAY+"?a=ping&p="+LP.slug+"&s="+encodeURIComponent(sid)+"&t="+Date.now(),{redirect:"follow"}).then(function(r){return r.json()}).then(function(j){if(!j.ok)return;
    if(j.orders>=20){$("#ordersN").textContent=money(j.orders);$("#ordersPill").hidden=false}
    if(j.now>=3){}}).catch(function(){})}
  ping();setInterval(function(){if(!document.hidden)ping()},60000)})();


track("ViewContent",{content_ids:[ME].map(function(s){return CAT[s].pid}),content_name:LP.name,content_type:"product",value:total(),currency:"IQD"});
})();
