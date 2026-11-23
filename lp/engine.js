/* محرّك صفحات هبوط الجسمي — go.aljassmi.shop/<عطر>/
   كل صفحة تعرّف window.LP (المحتوى) وهذا الملف يبني الصفحة والطلب والعروض.
   القواعد: لا أرقام وهمية، الأسعار من الموقع، الآراء حقيقية بس. */
(function(){
"use strict";
var LP=window.LP, CAT=window.CAT||{}, $=function(s,r){return(r||document).querySelector(s)}, $$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var RELAY="https://script.google.com/macros/s/AKfycbzCI8ZMLFJSYv1Bxrq01OtwmTzFmahi41_Ii9qMr-WVUacFA4u-e7E7tghx_Dbqhd6wXg/exec";
/* وضع التجربة: على localhost أو ?test=1 ما ينرسل طلب ولا عدّاد ولا بكسل */
var TEST=/^(localhost|127\.0\.0\.1)$/.test(location.hostname)||/[?&]test=1(&|$)/.test(location.search);
var WA="9647760060015";
var SHIP=5000, DISC={1:0,2:18000,3:40000}, HAIR={was:58000,price:28000,items:[
  {id:"urban",name:"أوربان",d:"منعش ونظيف"},{id:"chic",name:"شيك",d:"ناعم وأنثوي"},{id:"silky",name:"سيلكي",d:"حريري ودافئ"},{id:"majestic",name:"ماجيستك",d:"فخم وعميق"}]};
var money=function(n){return Number(n).toLocaleString("en-US")};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var ME=CAT[LP.slug]||{};
var ICON={
  pin:'<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  tel:'<svg viewBox="0 0 24 24"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
  ig:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/></svg>',
  test:'<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/></svg>',
  cash:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>',
  back:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/></svg>',
  truck:'<svg viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
  sndOff:'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4zM22 9l-6 6M16 9l6 6"/></svg>',
  sndOn:'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>'
};

/* ===== السلة: كمية العطر نفسه (1/2/3) + عطور ثانية ينضافن بخصم إضافي =====
   الخصم حسب عدد العطور بالطلب: 2 → 18,000 · 3 → 40,000 · وكل عطر بعدها +18,000 */
var BASE=(LP.bundle?LP.bundle.items:[LP.slug]).slice(), EXTRA=[], SEL=0;
var U=LP.bundle?LP.bundle.price:CAT[LP.slug].price, W=LP.bundle&&LP.bundle.was||U;
function dN(n){return n<=1?0:n===2?DISC[2]:DISC[3]+(n-3)*DISC[2]}
var TIERS=LP.tiers||(LP.bundle?[{q:1,price:U}]:[1,2,3].map(function(q){return{q:q,price:q*U-dN(q)}}));
function qty(){return TIERS[SEL].q}
function items(){var a=[];for(var i=0;i<qty();i++)a=a.concat(BASE);return a.concat(EXTRA)}
function sum(){return items().reduce(function(a,s){return a+(CAT[s]?CAT[s].price:0)},0)}
function exSum(){return EXTRA.reduce(function(a,s){return a+CAT[s].price},0)}
function total(){if(LP.bundle)return TIERS[SEL].price+exSum()-EXTRA.length*DISC[2];
  return U*qty()+exSum()-dN(qty()+EXTRA.length)}
function disc(){return sum()-total()}
function unitName(q){if(LP.units&&LP.units[q-1])return LP.units[q-1];return LP.bundle?(q===1?"عرض واحد":q===2?"عرضين":q+" عروض"):(q===1?"عطر واحد":q===2?"عطرين":q+" عطور")}

/* ===== البناء ===== */
document.documentElement.style.setProperty("--ac",LP.theme.ac);
document.documentElement.style.setProperty("--acs",LP.theme.acs);
var A=[];
A.push('<div class="ticker" aria-hidden="true"><div class="t">'+[0,1,2].map(function(){return["تجرّب التستر قبل لا تدفع","ضمان 7 أيام استبدال واسترجاع","توصيل لكل المحافظات 5,000","بغداد خلال 18 ساعة","الدفع عند الاستلام"].map(function(t){return"<span>"+t+"</span>"}).join("")}).join("")+'</div></div>');
A.push('<header class="wrap hdr"><img src="../lp/logo.png" alt="الجسمي"><b>دار الجسمي للعطور</b></header>');

// الهيرو
var V2=!!LP.v2; // 2026-11-22: ترتيب مبسّط (الهيبة أولاً): سعر بلوحات + 3 ضمانات تحت السعر + ختم الضمان الذهبي + دليل
var SEAL='<div class="seal" aria-label="الضمان الذهبي 7 أيام"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6DE8D"/><stop offset=".5" stop-color="#D4A845"/><stop offset="1" stop-color="#A97A22"/></linearGradient></defs><path fill="url(#sg)" d="'+(function(){var d="",n=16;for(var i=0;i<n*2;i++){var r=i%2?50:59,a=Math.PI*i/n-Math.PI/2;d+=(i?"L":"M")+(60+r*Math.cos(a)).toFixed(1)+" "+(60+r*Math.sin(a)).toFixed(1)}return d+"Z"})()+'"/><circle cx="60" cy="60" r="43" fill="none" stroke="rgba(255,248,225,.75)" stroke-width="1.5" stroke-dasharray="2 3"/></svg><div class="st"><small>الضمان الذهبي</small><b class="n">7</b><small>أيام</small></div></div>';
var COMP=!!(LP.bundle&&LP.img&&LP.img.btl);
var bt=LP.bundle&&!COMP?LP.bundle.items.map(function(s,i){return'<img class="btl b'+(i+1)+'" src="'+CAT[s].img+'" alt="عطر '+CAT[s].name+'">'}).join(""):'<img class="btl" src="'+LP.img.btl+'" alt="عطر '+LP.name+'" fetchpriority="high">';
var RT=LP.rating?'<a class="rt" href="#rev"><span class="st">★★★★★</span><b class="n">'+LP.rating.avg+'</b><span>· <b class="n">'+LP.rating.n+'</b> تقييم من زبائن حقيقيين</span></a>':"";
if(V2) A.push('<section class="hero v2"><div class="wrap"><div class="en">'+esc(LP.en)+'</div><h1>'+esc(LP.name)+'</h1>'+RT+'<p class="tag">'+LP.hero.tag+'</p>'+
  '<div class="stage'+(COMP?" comp":LP.bundle?" pair":"")+'"><canvas class="fx"></canvas><div class="halo"></div><div class="plinth"></div>'+bt+SEAL+'<div class="spec">'+LP.spec.map(function(s){return"<span>"+s+"</span>"}).join("")+'</div></div>'+
  '<p class="sub">'+LP.hero.sub+'</p>'+
  '<div class="pp" id="pp"></div>'+
  '<a class="cta" href="#order" data-go>اطلب هسه، <small>تدفع عند الاستلام</small></a>'+
  '<div class="g3">'+[[ICON.test,"توصلك ويّا تيستر","تشمها كبال المندوب قبل لا تدفع"],[ICON.back,"7 أيام تبدّل أو ترجّع","حتى لو فاتحها"],[ICON.cash,"الدفع عند الاستلام","ما تدفع ولا دينار هسه"]].map(function(g){return'<div class="g"><i>'+g[0]+'</i><b>'+g[1]+'</b><span>'+g[2]+'</span></div>'}).join("")+'</div>'+
  '<div class="proof"><div class="pf"><b>+<span class="n">579,000</span> طلب</b><small>خلال 2026 · لكل العراق</small></div><div class="pf" id="live" hidden><span class="dot"></span><b><span class="n" id="liveNow"></span> يتصفحون هسه</b></div></div></div></section>');
else A.push('<section class="hero"><div class="wrap"><div class="en">'+esc(LP.en)+'</div><h1>'+esc(LP.name)+'</h1><p class="tag">'+LP.hero.tag+'</p>'+
  '<div class="stage'+(COMP?" comp":LP.bundle?" pair":"")+'"><canvas class="fx"></canvas><div class="halo"></div><div class="plinth"></div>'+bt+'<div class="spec">'+LP.spec.map(function(s){return"<span>"+s+"</span>"}).join("")+'</div></div>'+
  '<p class="sub">'+LP.hero.sub+'</p>'+
  '<div class="proof"><div class="pf"><b>+<span class="n">579,000</span> طلب</b><small>خلال 2026 · لكل العراق</small></div><div class="pf" id="live" hidden><span class="dot"></span><b><span class="n" id="liveNow"></span> يتصفحون هسه</b></div></div>'+
  '<div class="pricebox"><div class="now"><small>السعر</small><span class="n" id="hNow"></span> <span class="u">د.ع</span></div><div class="note" id="hNote"></div></div>'+
  '<a class="cta" href="#order" data-go>اطلب هسه <small>· تدفع عند الاستلام</small></a>'+
  '<div class="chips"><span class="chip">'+ICON.test+'جرّب التستر قبل الدفع</span><span class="chip">'+ICON.back+'ضمان 7 أيام</span><span class="chip">'+ICON.truck+'5,000 لكل العراق</span></div></div></section>');

// V2: شنو بالباقة وشوكت تستخدم كل عطر
var iBox=-1,iOrd=-1;
if(V2&&LP.inBox){iBox=A.length;A.push('<section class="sec" id="box"><div class="wrap"><div class="reveal"><div class="kick">شنو بالباقة؟</div><h2 class="h2">'+(LP.inBoxH||"كل عطر وشوكت تستخدمه")+'</h2>'+(LP.inBoxLead?'<p class="lead">'+LP.inBoxLead+'</p>':"")+'</div><div class="ibx">'+
  LP.inBox.map(function(c){return'<div class="ib reveal"><div class="im">'+(c.img?'<img loading="lazy" src="'+c.img+'" alt="'+esc(c.name)+'">':"")+'</div><div class="tx"><b>'+esc(c.name)+'</b><em>'+esc(c.role)+'</em>'+(c.smell?'<p class="wh"><span>شلون ريحته؟</span>'+c.smell+'</p>':"")+'<p class="wh"><span>شوكت تستخدمه؟</span>'+c.when+'</p>'+(c.when2&&c.when2.length?'<div class="moms">'+c.when2.map(function(n){return"<span>"+n+"</span>"}).join("")+'</div>':"")+(c.notes&&c.notes.length?'<div class="notes"><i>بيه</i>'+c.notes.map(function(n){return"<span>"+n+"</span>"}).join("")+'</div>':"")+(c.say&&c.say.length?'<div class="say"><span>شنو كالوا عنه</span>'+c.say.map(function(q){return'<p><i>★★★★★</i>«'+esc(q[0])+'»<small>'+esc(q[1]||"زبون · رسالة حقيقية")+'</small></p>'}).join("")+'</div>':"")+'</div></div>'}).join("")+
  '</div></div></section>')}

// الريلز (ناس حقيقيين) — بعد الهيرو مباشرة لأن الوجه الحقيقي أقوى دليل
function reelHtml(r){return'<div class="reel"><video muted loop playsinline preload="none" poster="'+r[0]+'.jpg" src="'+r[0]+'.mp4"></video><button class="snd" aria-label="الصوت">'+ICON.sndOff+'</button><div class="lab"><b>'+esc(r[1])+'</b><span>'+esc(r[2])+'</span></div></div>'}
if(LP.reels&&LP.reels.length) A.push('<section class="sec dark" id="reels"><div class="wrap reveal"><div class="kick">'+(LP.reelsK||"ناس حقيقيين، مو ممثلين")+'</div><h2 class="h2">'+(LP.reelsH||"شوف شنو كالوا عنه")+'</h2></div><div class="rail" id="rail">'+
  LP.reels.map(reelHtml).join("")+
  '</div><p class="hint">اضغط على الفيديو حتى تسمع الصوت</p></section>');

// رحلة الرشّة
if(!V2) A.push('<section class="sec" id="smell"><div class="wrap"><div class="reveal"><div class="kick">'+(LP.journeyK||"شلون رائحته؟")+'</div><h2 class="h2">'+(LP.journeyH||"رشّة وحدة… وثلاث مراحل")+'</h2><p class="lead">'+(LP.journeyLead||"اضغط على كل مرحلة وشوف شنو تشم.")+'</p></div><div class="journey">'+
  LP.journey.map(function(j,i){return'<div class="stage3 reveal'+(i===0?" on":"")+'" data-i="'+i+'"><div class="tm">'+(j.img?'<img src="'+j.img+'" alt="">':'<i></i>')+'<span>'+j.t+'</span></div><div><b>'+j.h+'</b><p>'+j.p+'</p><div class="notes">'+j.notes.map(function(n){return"<span>"+n+"</span>"}).join("")+'</div></div></div>'}).join("")+
  '</div>'+(LP.img.ing?'<div class="ingimg reveal"><img loading="lazy" src="'+LP.img.ing+'" alt="مكونات '+esc(LP.name)+'"></div>':"")+'</div></section>');

// القصة
if(!V2) A.push('<section class="sec dark" id="story"><div class="wrap reveal"><div class="kick">'+(LP.story.k||"القصة")+'</div><h2 class="h2">'+LP.story.h+'</h2><div class="story">'+
  LP.story.ps.map(function(p,i){return i===LP.story.qAt?'<p class="q">'+p+'</p>':"<p>"+p+"</p>"}).join("")+'</div>'+
  '<div class="facts">'+LP.story.facts.map(function(f){return"<div><small>"+f[0]+"</small><b>"+f[1]+"</b></div>"}).join("")+'</div></div></section>');

// اختبار المطابقة
if(!V2) A.push('<section class="sec" id="quiz"><div class="wrap"><div class="reveal"><div class="kick">30 ثانية</div><h2 class="h2">هل '+esc(LP.quizName||LP.name)+(LP.bundle?' باقتك؟':' عطرك؟')+'</h2><p class="lead">3 أسئلة وتعرف. وإذا مو إلك، نكلك بصراحة شنو يناسبك أكثر.</p></div><div class="quiz reveal" id="qz"></div><p class="disc">النتيجة حسب أجوبتك وشخصية كل عطر من وصف الدار.</p></div></section>');

// يناسبك / ما يناسبك
if(!V2) A.push('<section class="sec" style="padding-top:0"><div class="wrap reveal"><div class="kick">بصراحة</div><h2 class="h2">'+(LP.bundle?'لِمَن هذي الباقة؟':'لِمَن هذا العطر؟')+'</h2><div class="fit"><div class="c yes"><h3>يناسبك إذا</h3><ul>'+LP.fit.yes.map(function(x){return"<li>"+x+"</li>"}).join("")+'</ul></div><div class="c no"><h3>ما ننصحك بيه إذا</h3><ul>'+LP.fit.no.map(function(x){return"<li>"+x+"</li>"}).join("")+'</ul></div></div></div></section>');

// V2: الدليل — فيديوهات الضمان والفرع الحقيقي
if(V2&&LP.proof&&LP.proof.length) A.push('<section class="sec dark" id="proof"><div class="wrap reveal"><div class="kick">'+(LP.proofK||"ليش تطمّن؟")+'</div><h2 class="h2">'+(LP.proofH||"أني أضمنلك التجربة")+'</h2>'+(LP.proofLead?'<p class="lead">'+LP.proofLead+'</p>':"")+'</div><div class="rail">'+
  LP.proof.map(reelHtml).join("")+'</div><p class="hint">اضغط على الفيديو حتى تسمع الصوت</p>'+
  '<div class="wrap"><div class="gbox"><h3>وبعد الاستلام، عندك 7 أيام</h3><ul><li>تبدّل أو ترجّع حتى لو فاتح العطر.</li><li>الاستبدال بأي فرع من فروع الدار، حتى لو طلبت أونلاين.</li><li>أول استبدال أو استرجاع بالتوصيل علينا.</li></ul></div></div></section>');

// الآراء
if((LP.shots&&LP.shots.length)||(LP.quotes&&LP.quotes.length)) A.push('<section class="sec" id="rev" style="background:#f3ebe2"><div class="wrap reveal"><div class="kick">'+(LP.revK||"رسائل زبائن حقيقيين")+'</div><h2 class="h2">'+(LP.revH||"شنو كتبولنا بعد ما وصلهم")+'</h2>'+(LP.rating?'<div class="rsum"><b class="n">'+LP.rating.avg+'</b><div><span class="st">★★★★★</span><small>من <b class="n">'+LP.rating.n+'</b> تقييم على الباقة</small></div></div>':"")+(V2&&!LP.shotsN&&LP.shots&&LP.shots.length>2?'<p class="lead" style="margin-top:10px">اسحب وشوف <b class="n">'+LP.shots.length+'</b> رسالة مثل ما وصلتنا ←</p>':"")+'</div>'+
  (V2&&LP.revVids&&LP.revVids.length?'<div class="rail">'+LP.revVids.map(reelHtml).join("")+'</div>':"")+
  (V2&&LP.shotsN&&LP.shots&&LP.shots.length?'<div class="wrap"><div class="sgrid" id="sgrid">'+LP.shots.map(function(s,i){return'<div class="shot"'+(i>=LP.shotsN?' hidden':'')+'><img loading="lazy" src="'+s+'" alt="رسالة زبون"></div>'}).join("")+'</div>'+(LP.shots.length>LP.shotsN?'<button class="more" id="moreS">للمزيد (<span class="n">'+(LP.shots.length-LP.shotsN)+'</span> رسالة ثانية)</button>':"")+'</div>':
  LP.shots&&LP.shots.length?'<div class="shots">'+LP.shots.map(function(s){return'<div class="shot"><img loading="lazy" src="'+s+'" alt="رسالة زبون"></div>'}).join("")+'</div>':"")+
  '<div class="wrap"><div class="quotes" id="quotes"></div><button class="more" id="moreQ">اعرض كل الرسائل</button><p class="disc">الرسائل منقولة مثل ما وصلتنا. الأسماء والصور بالسكرينات منشورة بموافقة أصحابها.</p></div></section>');

// الأمان
if(!V2) A.push('<section class="sec dark" id="safe"><div class="wrap reveal"><div class="kick">المخاطرة علينا</div><h2 class="h2">ما تدفع على شي ما جرّبته</h2><div class="steps">'+
  [["1","تطلب من هنا بدقيقة","بس اسمك ورقمك وعنوانك. ما تدفع شي هسه."],["2","يوصلك المندوب ويّا تستر","تجرب العطر قدامه قبل لا تفتح علبتك."],["3","تدفع إذا عجبك","ما عجبك؟ ترجّعه بمكانه وما تدفع ولا دينار."]].map(function(s){return'<div class="st3"><div class="k">'+s[0]+'</div><div><b>'+s[1]+'</b><p>'+s[2]+'</p></div></div>'}).join("")+
  '</div><div class="gbox"><h3>وبعد الاستلام، عندك 7 أيام</h3><ul><li>الاستبدال مفتوح وبأي فرع من فروع الدار، حتى لو طلبت أونلاين.</li><li>أول استبدال أو استرجاع بالتوصيل علينا.</li><li>نقبل فاتورة الفرع أو فاتورة التوصيل، أو حتى صورتها.</li></ul><div class="dl"><div><small>التوصيل</small><b class="n">5,000</b></div><div><small>بغداد</small><b>خلال 18 ساعة</b></div><div><small>المحافظات</small><b>24–48 ساعة</b></div></div></div></div></section>');

// الطلب + مكوّن العرض
// V2: وين تلكانا — الفرع الرئيسي + رقم + انستغرام
if(V2&&LP.contact){var C=LP.contact;A.push('<section class="sec" id="where"><div class="wrap reveal"><div class="kick">'+(LP.whereK||"وين تلكانا")+'</div><h2 class="h2">'+(LP.whereH||"فرعنا الرئيسي بالمنصور")+'</h2></div>'+(LP.whereReel?'<div class="rail one">'+reelHtml(LP.whereReel)+'</div>':"")+'<div class="wrap"><div class="places">'+
  C.places.map(function(p){return'<a class="place" target="_blank" rel="noopener" href="https://maps.google.com/?q='+encodeURIComponent("دار الجسمي للعطور "+p[1])+'"><i>'+ICON.pin+'</i><span><b>'+esc(p[0])+'</b><em>'+esc(p[1])+'</em><small>'+esc(p[2])+'</small></span></a>'}).join("")+'</div>'+
  '<div class="cbtn"><a href="tel:'+C.phone+'"><i>'+ICON.tel+'</i><span>اتصل بينا<b class="n">'+C.phone+'</b></span></a><a target="_blank" rel="noopener" href="'+C.ig+'"><i>'+ICON.ig+'</i><span>شوفنا بالانستغرام<b>@'+esc(C.igName)+'</b></span></a></div></div></section>')}
iOrd=A.length;A.push('<section class="order dark" id="order"><div class="wrap"><div class="kick">اطلب</div><h2 class="h2">'+(LP.bundle?"ثبّت العرض":"اختار عرضك")+'</h2><p class="lead">'+(LP.orderLead||'عطرين بخصم <b class="n">18,000</b>، و3 بخصم <b class="n">40,000</b>. وحدة إلك، والباقي هدية لناس تحبهم.')+'</p>'+
  '<div class="tiers" id="tiers"></div>'+
  '<div class="build"'+(LP.noExtras?' hidden':'')+'><div class="pick-h" id="pickH"></div><p class="pick-l" id="pickL"></p><div class="picks" id="picks"></div><div class="chosen" id="chosen"></div></div>'+
  '<form class="form" id="form" novalidate><div class="f"><label for="nm">الاسم</label><input id="nm" autocomplete="name" placeholder="اسمك الكامل"><div class="em">اكتب اسمك</div></div>'+
  '<div class="f"><label for="ph">رقم الموبايل</label><input id="ph" inputmode="numeric" autocomplete="tel" placeholder="07xxxxxxxxx" dir="ltr" style="text-align:right"><div class="hint" id="phHint"></div><div class="em" id="phMsg">اكتب رقم عراقي صحيح يبدي بـ07</div></div>'+
  '<button type="button" class="ph2b" id="ph2b">+ عندك رقم ثاني؟ <small>(اختياري)</small></button><div class="f" id="ph2f" hidden><label for="ph2">رقم ثاني <small>(اختياري)</small></label><input id="ph2" inputmode="numeric" autocomplete="tel" placeholder="07xxxxxxxxx" dir="ltr" style="text-align:right"><div class="hint">إذا رقمك الأول طافي أو خارج التغطية نتصل على هذا</div><div class="em">الرقم الثاني لازم 11 رقم يبدي بـ07، ومو نفس الأول</div></div>'+
  '<div class="f"><label for="gv">المحافظة</label><select id="gv"><option value="">اختار المحافظة</option></select><div class="em">اختار المحافظة</div></div>'+
  '<div class="f"><label for="ad">العنوان</label><textarea id="ad" placeholder="المنطقة، أقرب نقطة دالة"></textarea><div class="em">اكتب العنوان</div></div>'+
  '<div class="osum" id="osum"></div><button class="submit" id="sub" type="submit">ثبّت الطلب · الدفع عند الاستلام</button>'+
  '<div class="osafe"><span>✓ تجرب التستر قبل الدفع</span><span>✓ ضمان 7 أيام</span><span>✓ نتصل بيك نأكد</span></div></form></div></section>');

// الأسئلة
var FAQ=[["ما أكدر أشمّه من الموبايل… شلون أعرف إذا يعجبني؟","ما تحتاج تخمّن. المندوب يوصل ويّا تستر زجاجي، تجربه قدامه بدون ما تفتح علبة العطر. إذا ما ناسبك، ترفض الطلب بمكانه وما تدفع شي."],
  ["عجبني بالتستر، وبعدين غيّرت رأيي؟","عندك 7 أيام من يوم الاستلام. الاستبدال مفتوح وبأي فرع من فروع الدار حتى لو طلبت أونلاين، وأول استبدال أو استرجاع بالتوصيل علينا."]]
  .concat(LP.faq||[]).concat([
  ["شلون يشتغل خصم العطرين والثلاثة؟","أي عطرين من الدار بنفس الطلب ينزل المجموع 18,000، و3 عطور ينزل 40,000. تكدر تاخذ نفس العطر مرتين (واحد هدية) أو تخلط."],
  ["شوكت يوصلني؟ وبكم التوصيل؟","التوصيل 5,000 د.ع لكل المحافظات. ببغداد خلال 18 ساعة من تأكيد الطلب، وباقي المحافظات 24 إلى 48 ساعة. المندوب يتصل بيك قبل ما يوصل."],
  ["لازم أدفع هسه؟","لا. تدفع نقداً للمندوب بعد ما تجرب التستر. بعد ما ترسل الطلب نتصل بيك نأكد العنوان."]]).filter(function(f){return !(LP.bundle&&f[0].indexOf("خصم العطرين")>=0)});
if(LP.faqOnly) FAQ=LP.faq;
A.push('<section class="sec" id="faq"><div class="wrap"><div class="kick">قبل لا تطلب</div><h2 class="h2">أسئلة تدور براسك</h2><div style="margin-top:14px">'+FAQ.map(function(q,i){return'<details class="qa"'+(i===0?" open":"")+'><summary>'+q[0]+'<i></i></summary><p>'+q[1]+'</p></details>'}).join("")+'</div><a class="cta" href="#order" data-go>اطلب '+esc(LP.name)+'</a></div></section>');

A.push('<footer class="foot"><div class="wrap"><img src="../lp/logo-light.png" alt="الجسمي"><b>دار الجسمي للعطور</b><p>العطر تجربة، مو اختيار.</p>'+(LP.contact?'<p class="fc">فرع المنصور: مقابل مول المنصور<br>الشركة الرئيسية: الكرادة خارج، مقابل نادي الهندية<br><a href="tel:'+LP.contact.phone+'" class="n">'+LP.contact.phone+'</a> · <a href="'+LP.contact.ig+'" target="_blank" rel="noopener">انستغرام</a></p>':"")+'<div class="others">'+(window.PAGES||[]).filter(function(p){return p[0]!==LP.slug}).map(function(p){return'<a href="../'+p[0]+'/">'+p[1]+'</a>'}).join("")+'</div></div></footer>');
A.push('<div class="sticky" id="sticky"><div class="in"><div class="pr"><small id="stLab">'+esc(LP.name)+'</small><b><span id="stPr"></span> <small>د.ع</small></b></div><a class="go" href="#order" data-go>'+(V2?'اطلب هسه<small>تدفع عند الاستلام</small>':'اطلب هسه')+'</a></div></div><div class="modal" id="up"><div class="sheet" id="upSheet"></div></div>');
if(LP.formEarly&&iBox>=0&&iOrd>iBox){var OS=A.splice(iOrd,1)[0];A.splice(iBox+1,0,OS)} // 2026-11-24: الفورم بعد شرح العطور مباشرة (92% ما يوصلون للفورم بالشاشة 7)
document.getElementById("app").innerHTML=A.join("");

/* ===== التفاعل ===== */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
$$(".reveal").forEach(function(el){io.observe(el)});

// الفيديوات: تشتغل لوحدها بدون صوت لما تبين، والضغط يشغّل الصوت
var vio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.intersectionRatio>.6){v.play().catch(function(){})}else{v.pause()}})},{threshold:[0,.6,1]});
$$(".reel video").forEach(function(v){vio.observe(v)});
$$(".reel").forEach(function(el){el.addEventListener("click",function(){var v=$("video",el),on=v.muted;
  $$(".reel video").forEach(function(o){o.muted=true});$$(".reel .snd").forEach(function(b){b.innerHTML=ICON.sndOff});
  v.muted=!on;if(on){v.currentTime=0;v.play().catch(function(){});$(".snd",el).innerHTML=ICON.sndOn;track("ViewReel")}})});

// رحلة الرشّة
$$(".stage3").forEach(function(el){el.addEventListener("click",function(){$$(".stage3").forEach(function(o){o.classList.toggle("on",o===el)})})});

// الآراء
if($("#moreS"))$("#moreS").addEventListener("click",function(){$$("#sgrid .shot").forEach(function(e){e.hidden=false});this.remove()});
if($("#quotes")){var showN=4,Q=LP.quotes||[];
  var paintQ=function(){$("#quotes").innerHTML=Q.slice(0,showN).map(function(q){return'<div class="qt"><div class="st">★★★★★</div><p>«'+esc(q[0])+'»</p><div class="w"><span>زبون من زبائن الجسمي</span>'+(q[1]?"<em>"+esc(q[1])+"</em>":"")+'</div></div>'}).join("");
    $("#moreQ").style.display=showN>=Q.length?"none":"block";$("#moreQ").textContent="اعرض كل الرسائل ("+Q.length+")"};
  $("#moreQ").addEventListener("click",function(){showN=Q.length;paintQ()});paintQ()}

/* ===== الاختبار ===== */
var QZ=[{q:"وين أكثر مكان راح تستخدم بيه العطر؟",k:"when",o:[["💼","الدوام أو الجامعة","work"],["🌙","الطلعات والسهرات","night"],["☀️","كل يوم، بكل مكان","daily"],["✨","المناسبات والعزايم","special"]]},
  {q:"شنو تحب الناس تحس من تقرب منك؟",k:"vibe",o:[["👑","هيبة وحضور","power"],["🤍","نعومة وجاذبية","soft"],["🍃","نظافة وانتعاش","fresh"],["🔥","دفء وعمق","warm"]]},
  {q:"العطر إلك لو هدية؟",k:"who",o:[["🙋","إلي","me"],["🎁","هدية لشخص غالي","gift"],["👫","الاثنين: إلي وهدية","both"]]}];
var ans={},qi=0;
function paintQuiz(){var box=$("#qz");if(qi<QZ.length){var Z=QZ[qi];
  box.innerHTML='<div class="qbar"><i style="width:'+(qi/QZ.length*100)+'%"></i></div><div class="qq"><div class="kick">سؤال '+(qi+1)+' من '+QZ.length+'</div><h3>'+Z.q+'</h3><div class="opts">'+Z.o.map(function(o){return'<button data-v="'+o[2]+'"><em>'+o[0]+'</em>'+o[1]+'</button>'}).join("")+'</div></div>';
  $$(".opts button",box).forEach(function(b){b.addEventListener("click",function(){b.classList.add("on");ans[Z.k]=b.dataset.v;if(qi===0)track("QuizStart");setTimeout(function(){qi++;paintQuiz()},220)})});return}
  // النتيجة
  var sc={};Object.keys(CAT).filter(function(s){return!CAT[s].noPick}).forEach(function(s){var t=CAT[s].t||{};sc[s]=(t[ans.when]||0)*1.2+(t[ans.vibe]||0)*1.5});
  var me=LP.bundle?LP.bundle.items:[LP.slug];
  var best=Object.keys(sc).sort(function(a,b){return sc[b]-sc[a]})[0];
  var mine=Math.max.apply(null,me.map(function(s){return sc[s]||0})), top=sc[best]||1;
  var pct=Math.max(58,Math.min(97,Math.round(60+37*mine/top)));
  var good=mine>=top*.82, alt=good?null:best;
  if(good&&!LP.bundle){var others=Object.keys(sc).filter(function(s){return me.indexOf(s)<0}).sort(function(a,b){return sc[b]-sc[a]});alt=others[0]}
  var why=[];QZ.forEach(function(Z){var o=Z.o.filter(function(x){return x[2]===ans[Z.k]})[0];if(o&&Z.k!=="who")why.push(o[1])});
  var C=2*Math.PI*56;
  box.innerHTML='<div class="qres"><div class="ring"><svg viewBox="0 0 132 132"><circle cx="66" cy="66" r="56" fill="none" stroke="#efe5da" stroke-width="10"/><circle id="rg" cx="66" cy="66" r="56" fill="none" stroke="'+LP.theme.ac+'" stroke-width="10" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+C+'" style="transition:stroke-dashoffset 1.4s cubic-bezier(.22,.8,.24,1)"/></svg><b><span id="pc">0</span>%<small>تطابق</small></b></div>'+
    (good?'<h3>'+esc(LP.quizName||LP.name)+' يشبهك</h3><p>'+(ans.who==="gift"?LP.quizGift:LP.quizYes)+'</p>':'<h3>يناسبك، بس…</h3><p>حسب أجوبتك، '+esc(CAT[best].name)+' أقرب لذوقك. وإذا تحب تجرب الاثنين، خذهم سوا ووفّر 18,000.</p>')+
    '<div class="why">'+why.map(function(w){return"<span>"+w+"</span>"}).join("")+'</div>'+
    (alt&&CAT[alt]?'<div class="alt"><img src="'+CAT[alt].img+'" alt=""><div><b>'+(good?"وياه يمشي حلو: ":"")+esc(CAT[alt].name)+'</b><span>'+esc(CAT[alt].line)+'</span><br><button data-add="'+alt+'">ضيفه للطلب ووفّر 18,000</button></div></div>':"")+
    '<a class="cta" href="#order" data-go style="margin-top:14px">اطلب '+esc(LP.name)+'</a><button class="again" id="again">أعيد الاختبار</button></div>';
  setTimeout(function(){$("#rg").style.strokeDashoffset=C*(1-pct/100);var n=0,el=$("#pc"),iv=setInterval(function(){n+=2;if(n>=pct){n=pct;clearInterval(iv)}el.textContent=n},22)},80);
  $("#again").addEventListener("click",function(){ans={};qi=0;paintQuiz()});
  bindGo(box);$$("[data-add]",box).forEach(function(b){b.addEventListener("click",function(){addExtra(b.dataset.add);$("#order").scrollIntoView({behavior:"smooth"})})});
  track("QuizDone",{match:pct,best:best});
}
if($("#qz"))paintQuiz();

/* ===== الخيارات + إضافة عطور ثانية ===== */
function addExtra(s){if(EXTRA.length>=3)return;EXTRA.push(s);paintCart();track("AddToCart",{content_ids:[CAT[s].pid],value:CAT[s].price,currency:"IQD"})}
function nextSave(){var n=items().length;return LP.bundle?DISC[2]:dN(n+1)-dN(n)}
function paintCart(){var n=items().length,d=disc(),T=TIERS[SEL];
  $("#tiers").innerHTML=TIERS.map(function(t,i){var sv=W*t.q-t.price;return'<button type="button" class="tier'+(i===SEL?" on":"")+'" data-i="'+i+'">'+(LP.badge!==undefined?(LP.badge&&i===LP.badgeAt?'<span class="badge">'+LP.badge+'</span>':""):TIERS.length===3&&i===1?'<span class="badge">الأكثر طلباً</span>':"")+
    '<span class="rd"></span><span class="tt"><b>'+unitName(t.q)+'</b><span>'+(t.sub||(t.q===1?(LP.bundle?esc(LP.bundle.contents):"بسعره"):t.q===2?"وحدة إلك ووحدة هدية":"إلك ولعائلتك"))+'</span>'+(sv?'<span class="save">توفّر '+money(sv)+' د.ع</span>':"")+'</span><span class="tp">'+(sv?'<s>'+money(W*t.q)+'</s>':"")+'<b>'+money(t.price)+'</b></span></button>'}).join("");
  $$(".tier").forEach(function(b){b.addEventListener("click",function(){SEL=+b.dataset.i;paintCart()})});
  var ns=nextSave(), full=EXTRA.length>=3;
  $("#pickH").textContent=EXTRA.length?"تريد تضيف عطر ثاني بعد؟":"تريد تضيف عطر ثاني ويّا طلبك؟";
  $("#pickL").innerHTML=full?"وصلت أعلى عدد إضافات بالطلب.":'كل عطر تضيفه ينزل المجموع. العطر الجاي ينزله <b class="n">'+money(ns)+'</b> د.ع إضافية.';
  $("#picks").style.display=full?"none":"flex";
  $("#picks").innerHTML=Object.keys(CAT).filter(function(s){return BASE.indexOf(s)<0&&!CAT[s].noPick}).map(function(s){var c=CAT[s];return'<button type="button" class="pk" data-add="'+s+'"><img loading="lazy" src="'+c.img+'" alt=""><b>'+esc(c.name)+'</b><span>'+esc(c.line)+'</span><div class="pp n">'+money(c.price)+'</div><span class="ad">+ ضيف وخصم '+money(ns)+'</span></button>'}).join("");
  $$("#picks [data-add]").forEach(function(b){b.addEventListener("click",function(){addExtra(b.dataset.add)})});
  $("#chosen").innerHTML=EXTRA.map(function(s,i){return'<span class="ch"><img src="'+CAT[s].img+'" alt="">'+esc(CAT[s].name)+'<button type="button" data-rm="'+i+'" aria-label="شيل">×</button></span>'}).join("");
  $$("[data-rm]").forEach(function(b){b.addEventListener("click",function(){EXTRA.splice(+b.dataset.rm,1);paintCart()})});
  var mainLine=LP.bundle?'<div><span>'+esc(LP.bundle.rz)+(T.q>1?" × "+T.q:"")+'</span><span class="n">'+money(W*T.q)+'</span></div>':'<div><span>'+esc(LP.name)+(T.q>1?" × "+T.q:"")+'</span><span class="n">'+money(U*T.q)+'</span></div>';
  var exLines=EXTRA.map(function(s){return'<div><span>'+esc(CAT[s].name)+'</span><span class="n">'+money(CAT[s].price)+'</span></div>'}).join("");
  var shownDisc=LP.bundle?EXTRA.length*DISC[2]+W*T.q-T.price:d, wasAll=LP.bundle?W*T.q+exSum():sum(), saved=wasAll-total();
  $("#osum").innerHTML=mainLine+exLines+(shownDisc?'<div class="sv"><span>'+(LP.bundle&&LP.bundle.was?"توفيرك":"الخصم ("+n+" عطور)")+'</span><span class="n">−'+money(shownDisc)+'</span></div>':"")+'<div><span>التوصيل</span><span class="n">'+money(SHIP)+'</span></div><div class="tot"><span>المجموع عند الاستلام</span><span><span class="n">'+money(total()+SHIP)+'</span> د.ع</span></div>';
  if($("#pp")){$("#pp").innerHTML=TIERS.map(function(t,i){var sv=W*t.q-t.price;return'<button type="button" class="pcard'+(i===SEL?" on":"")+'" data-i="'+i+'">'+(LP.badge&&i===LP.badgeAt?'<span class="badge">'+LP.badge+'</span>':"")+
      '<span class="pl"><b>'+unitName(t.q)+'</b><small>'+(t.sub||"")+'</small></span><span class="pv">'+(sv&&!V2?'<s class="n">'+money(W*t.q)+'</s>':"")+'<span class="big"><span class="n">'+money(t.price)+'</span> <small>د.ع</small></span>'+(sv&&V2?'<span class="was">سابقاً <s class="n">'+money(W*t.q)+'</s></span>':"")+(t.q>1?'<span class="per">الباقة الوحدة بـ<b class="n">'+money(t.price/t.q)+'</b></span>':"")+'</span>'+(sv?'<span class="sv">توفّر <b class="n">'+money(sv)+'</b> د.ع</span>':"")+'</button>'}).join("");
    $$("#pp .pcard").forEach(function(b){b.addEventListener("click",function(){SEL=+b.dataset.i;paintCart();goOrder()})})}
  if($("#hNow"))$("#hNow").textContent=money(total());
  if($("#hNote"))$("#hNote").innerHTML=(n<=BASE.length)?(LP.priceNote||"")+(LP.bundle?"":'<br>عطرين بخصم <b class="n">18,000</b> · 3 بخصم <b class="n">40,000</b>'):'<s class="was n">'+money(wasAll)+'</s>'+(LP.bundle?unitName(T.q)+(EXTRA.length?" + "+EXTRA.length+(EXTRA.length>1?" عطور":" عطر"):""):n+' عطور بالطلب')+' · وفّرت <b class="n">'+money(saved)+'</b>';
  $("#stPr").textContent=money(total());$("#stLab").textContent=n<=BASE.length?LP.name:(LP.bundle?unitName(T.q):n+" عطور")+" · وفّرت "+money(saved);
}
paintCart();

/* ===== الشريط السفلي والأزرار ===== */
var orderSec=$("#order"),heroCta=$(".hero .cta"),inHero=true,inOrder=false;
function stick(){$("#sticky").classList.add("show")}stick();
new IntersectionObserver(function(e){inHero=e[0].isIntersecting;stick()}).observe(heroCta);
new IntersectionObserver(function(e){inOrder=e[0].isIntersecting;stick();if(inOrder)vcOnce()},{threshold:.05}).observe(orderSec);
function goOrder(){var o=$("#order");o&&o.scrollIntoView({behavior:"smooth"});if(!window.__ic){window.__ic=1;track("InitiateCheckout",{value:total(),currency:"IQD",content_ids:items().map(function(s){return CAT[s].pid})})}}
function bindGo(r){$$("[data-go]",r).forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();goOrder()})})}
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
  var p2=$("#ph2");$("#ph2b").addEventListener("click",function(){$("#ph2f").hidden=false;this.hidden=true;p2.focus()});
  p2.addEventListener("input",function(){var v=toEn(p2.value).replace(/\D/g,"").slice(0,11);if(p2.value!==v)p2.value=v});
  ph.addEventListener("input",fix);ph.addEventListener("blur",fix);ph.addEventListener("paste",function(){setTimeout(fix,0)});
  $("#nm").addEventListener("focus",function(){track("CustomizeProduct",{value:total(),currency:"IQD"});if(!window.__ic){window.__ic=1;track("InitiateCheckout",{value:total(),currency:"IQD"})}},{once:true});
})();
function setErr(id,bad){$("#"+id).closest(".f").classList.toggle("err",bad);return bad}
var ORDER=null;
$("#form").addEventListener("submit",function(e){e.preventDefault();
  var nm=$("#nm").value.trim(),ph=normPhone($("#ph").value),gv=$("#gv").value,ad=$("#ad").value.trim(),ph2=normPhone($("#ph2").value);
  var bad=[setErr("nm",nm.length<2),setErr("ph",!/^07[3-9]\d{8}$/.test(ph)),setErr("ph2",!!ph2&&(!/^07[3-9]\d{8}$/.test(ph2)||ph2===ph)),setErr("gv",!gv),setErr("ad",ad.length<4)].some(Boolean);
  if(bad){var f=$(".f.err input,.f.err select,.f.err textarea");f&&f.focus();return}
  ORDER={name:nm,phone:ph,phone2:ph2||"",governorate:gv,address:ad,items:items(),q:qty(),sel:SEL,extra:EXTRA.slice(),sum:sum(),disc:disc(),total:total()};SENT=null;
  matchUser(ORDER);track("AddPaymentInfo",{value:total(),currency:"IQD"});
  showCheck();
});

/* ===== 2026-11-24: ثبّت ← «رقمك صحيح؟» ← عرض أوربان الصغير ← طلب واحد كامل (بطلب محمد: ما يتقطع لرسالتين) ===== */
var SENT=null,AUTO=null,LDI=null,BEACONED=false,UPH="urban";
function fmtPh(p){return p.slice(0,4)+" "+p.slice(4,7)+" "+p.slice(7)}
function showCheck(){clearTimeout(AUTO);
  $("#upSheet").innerHTML='<h3>آخر خطوة: تأكد من رقمك</h3><p class="lead">على هذا الرقم يتصل بيك المندوب. إذا بيه رقم واحد غلط ما نكدر نوصلك.</p><div class="pcheck"><span class="n" dir="ltr">'+fmtPh(ORDER.phone)+'</span>'+(ORDER.phone2?'<small>الرقم الثاني <b class="n" dir="ltr">'+fmtPh(ORDER.phone2)+'</b></small>':'')+'</div><button class="add" id="phOk">إي، الرقم صحيح</button><button class="skip" id="phEdit">لا، أريد أعدّل الرقم</button>';
  $("#up").classList.add("open");document.body.style.overflow="hidden";
  $("#phOk").addEventListener("click",function(){ORDER.phOk=true;showUpsell()});
  $("#phEdit").addEventListener("click",function(){ORDER=null;$("#up").classList.remove("open");document.body.style.overflow="";var i=$("#ph");i.focus();i.select&&i.select()});
}
function showUpsell(){var h=HAIR.items.filter(function(x){return x.id===UPH})[0];
  // 2026-11-24 بطلب محمد: الزر الكبير = الاستمرار بدون عطر الشعر، والإضافة خيار صغير تحته (حتى محد يتلخبط ويطلع)
  $("#upSheet").innerHTML='<div class="ok1">✓ رقمك تأكد</div>'+
   '<button class="add" id="skipH">استمرار بدون عطر شعر</button>'+
   '<p class="up0">أو ضيف ويّا طلبك، بنفس التوصيل:</p>'+
   '<div class="up1"><img src="../lp/hair-'+h.id+'.jpg" alt="عطر شعر '+h.name+'"><div class="tx"><b>عطر شعر '+h.name+'</b><small>منعش، يحمي شعرك من حرارة الشسوار وبدون كحول.</small><div class="hp"><s class="n">'+money(HAIR.was)+'</s><span class="n">'+money(HAIR.price)+'</span> <em>د.ع</em></div></div><button class="ad2" id="addH">+ ضيفه</button></div>';
  $("#addH").addEventListener("click",function(){finish(UPH)});$("#skipH").addEventListener("click",function(){finish(null)});
  clearTimeout(AUTO);AUTO=setTimeout(function(){finish(null)},90000);
}
addEventListener("pagehide",function(){if(ORDER&&!SENT)beacon()});
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden"&&ORDER&&!SENT)beacon()});
function loading(){$("#upSheet").innerHTML='<div class="ld"><div class="spin"></div><h3 id="ldT">نثبّت طلبك…</h3><div class="ldbar"><i></i></div><p class="lead">لا تسكّر الصفحة، ثواني بس.</p></div>';
  var m=["نثبّت طلبك…","نرسله لفريق الدار…","نجهّز التستر ويّا طلبك…"],k=0;LDI=setInterval(function(){k=(k+1)%m.length;var t=$("#ldT");t&&(t.textContent=m[k])},1300)}
function finish(hairId,silent){if(SENT)return;clearTimeout(AUTO);ORDER.hair=hairId||null;if(!silent)loading();
  SENT=placeOrder(ORDER).then(function(){clearInterval(LDI);done()}).catch(function(){clearInterval(LDI);SENT=null;
    $("#upSheet").innerHTML='<h3>صار خلل بالاتصال</h3><p class="lead">طلبك ما وصل بعد. جرّب مرة ثانية.</p><button class="add" id="retry">أعد المحاولة</button>';$("#retry").addEventListener("click",function(){finish(hairId)})})}
function beacon(){if(TEST)return;try{SENT=true;BEACONED=true;navigator.sendBeacon(RELAY,new Blob([JSON.stringify(payload(ORDER))],{type:"text/plain;charset=UTF-8"}))}catch(e){}}
// رجع للصفحة بعد ما انرسل الطلب وهو طالع: نبينله اللي انرسل فعلاً (بدون إرسال ثاني)
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible"&&BEACONED&&ORDER&&!ORDER.shown){clearTimeout(AUTO);clearInterval(LDI);var o=ORDER;track("Purchase",{content_ids:o.items.map(function(s){return CAT[s].pid}),content_type:"product",value:o.total,currency:"IQD",num_items:o.items.length},{eventID:o.ref});done()}});
function done(){ORDER.shown=true;var tot=ORDER.total+SHIP+(ORDER.hair?HAIR.price:0);
  $("#upSheet").innerHTML='<div class="done"><div class="ok" style="justify-content:center"><i>✓</i>طلبك تثبّت</div><h3>شكراً '+esc(ORDER.name.split(" ")[0])+' 🤍</h3><p class="lead">راح نتصل بيك على <span class="n" dir="ltr">'+ORDER.phone+'</span> نأكد العنوان. المجموع عند الاستلام <b class="n" style="color:var(--br)">'+money(tot)+'</b> د.ع، وتجرّب التستر قبل لا تدفع.</p>'+
   '<div class="wa"><b>تم تثبيت طلبك ✓</b><p>راسلنا على الواتساب حتى تنحفظ معلوماتك عندنا، وتكدر تستفاد من الضمان الذهبي لمدة 7 أيام على أي مشكلة بطلبك.</p><a class="wab" id="waGo" target="_blank" rel="noopener" href="'+waLink()+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.7-.2 1.3z"/></svg>أكّد طلبك بالواتساب</a></div>'+
   '<button class="skip" id="closeUp">تمام</button></div>';
  $("#waGo").addEventListener("click",function(){track("Contact",{content_name:"wa_confirm"})});
  $("#closeUp").addEventListener("click",function(){$("#up").classList.remove("open");document.body.style.overflow=""});
  $("#sub").disabled=true;$("#sub").textContent="تم تثبيت طلبك ✓";
}

/* ===== الربط: وسيط Apps Script → قناة «طلبات الجسمي» + شيت ===== */
function waLink(){var o=ORDER||{};return "https://wa.me/"+WA+"?text="+encodeURIComponent("هلا، هذا تأكيد طلبي من صفحة "+LP.name+" ✅\nرقم الطلب: "+(o.ref||"")+"\nالاسم: "+(o.name||""))}
function relay(p){p.page=LP.slug;if(TEST){try{console.log("[TEST] الطلب ما انرسل",p)}catch(e){}return new Promise(function(r){setTimeout(function(){r({ok:true})},900)})}return fetch(RELAY,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(p),redirect:"follow"}).then(function(r){return r.json()}).then(function(j){if(!j.ok)throw new Error(j.error||"relay");return j})}
var SRC=(function(){var k="aj_src",q=new URLSearchParams(location.search),v={};["utm_source","utm_campaign","utm_content","utm_term","fbclid"].forEach(function(n){if(q.get(n))v[n]=q.get(n).slice(0,80)});
  try{if(Object.keys(v).length)sessionStorage.setItem(k,JSON.stringify(v));else v=JSON.parse(sessionStorage.getItem(k)||"{}")}catch(e){}return v})();
function srcLine(){var a=SRC.utm_content||SRC.utm_campaign;return a?"الإعلان: "+a+(SRC.utm_campaign&&SRC.utm_content?" · "+SRC.utm_campaign:""):(SRC.fbclid?"الإعلان: ميتا (بدون اسم)":"الإعلان: زيارة مباشرة")}
function hairName(id){var h=HAIR.items.filter(function(x){return x.id===id})[0];return "عطر شعر "+(h?h.name:id)}
function orderText(o){
  var B=LP.bundle, q=o.q, ex=o.extra, hp=o.hair?HAIR.price:0, all=o.total+hp;
  function rz(s){var c=CAT[s];return (c&&(c.rz||c.name))||s}
  function alf(n){return n%1000===0?(n/1000)+(n/1000>2&&n/1000<11?" الاف":" الف"):money(n)}
  var P=[(B?(B.rz||LP.name)+(B.contents?" ("+B.contents+")":""):rz(LP.slug)||LP.name)+(q>1?" × "+q:"")];
  var cnt={};ex.forEach(function(s){cnt[s]=(cnt[s]||0)+1});Object.keys(cnt).forEach(function(s){P.push(rz(s)+(cnt[s]>1?" × "+cnt[s]:""))});
  if(o.hair)P.push(hairName(o.hair)+" (بـ28 الف بدل 58)");
  var prod=P.join(" + ");
  var rzBase=(B?TIERS[o.sel].price:U*q)+ex.reduce(function(a,s){return a+CAT[s].price},0), rzDisc=rzBase-o.total;
  var L=["الاسم : "+o.name,"الرقم : "+o.phone].concat(o.phone2?["رقم ثاني : "+o.phone2]:[],["العنوان : "+o.governorate+" "+o.address,"——",
    "تفاصيل الطلب : طلب جديد من صفحة الهبوط",
    "المنتج : "+prod,
    "السعر : "+alf(all)+(rzDisc>0?" (بعد خصم "+alf(rzDisc)+")":"")+" والتوصيل "+alf(SHIP),
    "——","ملاحظة : تجربة العطر من خلال التيستر فقط والتأكد من سلامة الطلب",prod,
    "","━━━━━━━━━━━━","للفريق بس (لا ينسخ):","المجموع عند الاستلام: "+money(all+SHIP)+" د.ع · "+unitName(q),"المصدر: صفحة "+LP.name,srcLine()].concat(o.phOk?[]:["⚠️ الزبون ما أكد رقمه (طلع قبل التأكيد): تأكدوا من الرقم"]));
  return L.join("\n");
}
function capiData(v,ids,n){function ck(k){var m=document.cookie.match(new RegExp("(?:^|; )"+k+"=([^;]*)"));return m?decodeURIComponent(m[1]):""}var fbc=ck("_fbc");if(!fbc&&SRC.fbclid)fbc="fb.1."+Date.now()+"."+SRC.fbclid;return {fbp:ck("_fbp"),fbc:fbc,ua:navigator.userAgent.slice(0,400),url:location.href.split("#")[0].slice(0,500),value:v,currency:"IQD",ids:ids,n:n}}
function payload(o){if(!o.ref)o.ref=LP.code+"-"+Date.now().toString(36).toUpperCase();
  return {kind:"order",page:LP.slug,ref:o.ref,name:o.name,phone:o.phone,phone2:o.phone2||"",governorate:o.governorate,summary:(LP.bundle?[LP.bundle.rz+(o.q>1?" × "+o.q:"")].concat(o.items.slice(BASE.length*o.q).map(function(s){return CAT[s].name})):o.items.map(function(s){return CAT[s].name})).join(" + ")+(o.hair?" + "+hairName(o.hair):""),text:"#طلب_جديد "+o.ref+"\n"+orderText(o),capi:capiData(o.total+(o.hair?HAIR.price:0),o.items.map(function(s){return CAT[s].pid}).concat(o.hair?["hair-"+o.hair]:[]),o.items.length)}}
function placeOrder(o){return relay(payload(o)).then(function(){track("Purchase",{content_ids:o.items.map(function(s){return CAT[s].pid}).concat(o.hair?["hair-"+o.hair]:[]),content_type:"product",value:o.total+(o.hair?HAIR.price:0),currency:"IQD",num_items:o.items.length},{eventID:o.ref})})}
// مطابقة متقدمة: نعطي البكسل رقم الزبون واسمه ومحافظته لحظة «ثبّت»، والبكسل يشفّرهن بنفسه (SHA-256) قبل ما يطلعن
var GOV_EN={"بغداد":"baghdad","البصرة":"basra","نينوى":"nineveh","أربيل":"erbil","النجف":"najaf","كربلاء":"karbala","بابل":"babil","ذي قار":"dhiqar","الأنبار":"anbar","ديالى":"diyala","صلاح الدين":"salahaddin","كركوك":"kirkuk","واسط":"wasit","ميسان":"maysan","الديوانية":"diwaniyah","المثنى":"muthanna","السليمانية":"sulaymaniyah","دهوك":"duhok","حلبجة":"halabja"};
function matchUser(o){try{if(!window.fbq||typeof AJ_PIXEL==="undefined"||TEST)return;var n=o.name.toLowerCase().split(/\s+/).filter(Boolean),u={ph:"964"+o.phone.slice(1),country:"iq"};if(n[0])u.fn=n[0];if(n.length>1)u.ln=n[n.length-1];if(GOV_EN[o.governorate])u.ct=GOV_EN[o.governorate];fbq("init",AJ_PIXEL,u)}catch(e){}}
function track(ev,p,o){if(TEST){try{console.log("[TEST] بكسل:",ev)}catch(e){}return}try{if(!window.fbq)return;var std=["Purchase","AddToCart","InitiateCheckout","ViewContent","CustomizeProduct","Contact","AddPaymentInfo"];if(std.indexOf(ev)>=0)fbq("track",ev,p||{},o||{});else fbq("trackCustom",ev,p||{})}catch(e){}}

/* ===== عدّاد حقيقي (زوار + طلبات هالصفحة) ===== */
(function(){var sid;try{sid=sessionStorage.getItem("aj_sid")||Math.random().toString(36).slice(2,12);sessionStorage.setItem("aj_sid",sid)}catch(e){sid=Math.random().toString(36).slice(2,12)}
  function ping(){if(TEST)return;fetch(RELAY+"?a=ping&p="+LP.slug+"&s="+encodeURIComponent(sid)+"&t="+Date.now(),{redirect:"follow"}).then(function(r){return r.json()}).then(function(j){if(!j.ok)return;
    // 2026-11-24 بطلب محمد: ما نظهر عدد الطلبات اللي انباعت أبداً
    if(j.now>=3){$("#liveNow").textContent=j.now;$("#live").hidden=false}}).catch(function(){})}
  ping();setInterval(function(){if(!document.hidden)ping()},60000)})();

/* ===== حركة الهيرو (لكل عطر شخصيته) ===== */
(function(){var cv=$(".stage canvas.fx");if(!cv||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  var cx=cv.getContext("2d"),W,H,P=[],mode=LP.fx||"mist",dpr=Math.min(2,window.devicePixelRatio||1),t0=performance.now();
  function rs(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}rs();addEventListener("resize",rs);
  var col=LP.theme.fxc||"176,169,154";
  function mk(){var p={x:(mode==="mist"?.18+Math.random()*.64:Math.random())*W,y:H*(.35+Math.random()*.65),r:mode==="mist"?8+Math.random()*26:1+Math.random()*2.4,vy:-(.15+Math.random()*(mode==="embers"?.9:.35)),vx:(Math.random()-.5)*.3,a:0,life:0,max:220+Math.random()*260};return p}
  for(var i=0;i<(mode==="mist"?18:46);i++){var p=mk();p.life=Math.random()*p.max;P.push(p)}
  var vis=true;new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(cv);
  (function fr(now){requestAnimationFrame(fr);if(!vis||document.hidden)return;cx.clearRect(0,0,W,H);var t=(now-t0)/1000;
    if(mode==="pulse"){ // خط نبض يمر ورا العطر
      cx.lineWidth=2;cx.strokeStyle="rgba("+col+",.55)";cx.beginPath();var y0=H*.56,ph=(t*0.55)%1;
      for(var x=0;x<=W;x+=3){var u=(x/W-ph+1)%1,y=y0;if(u>.40&&u<.62){var k=(u-.40)/.22;y=y0-Math.sin(k*Math.PI*3)*Math.exp(-Math.pow((k-.35)*4,2))*H*.17}x===0?cx.moveTo(x,y):cx.lineTo(x,y)}cx.stroke();
      var g=1+.06*Math.max(0,Math.sin(t*Math.PI*2*1.1));cv.style.transform="scale("+g+")";}
    P.forEach(function(p,j){p.life++;p.x+=p.vx+(mode==="embers"?Math.sin((p.life+j)*.05)*.35:0);p.y+=p.vy;var k=p.life/p.max;p.a=Math.sin(Math.min(1,k)*Math.PI);
      if(p.life>p.max||p.y<-30){P[j]=mk()}
      if(mode==="mist"){var gr=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);gr.addColorStop(0,"rgba("+col+","+(.12*p.a)+")");gr.addColorStop(1,"rgba("+col+",0)");cx.fillStyle=gr;cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill()}
      else{cx.fillStyle="rgba("+col+","+((mode==="embers"?.85:.6)*p.a)+")";cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill();if(mode==="embers"&&p.r>2){cx.fillStyle="rgba(255,200,120,"+(.25*p.a)+")";cx.beginPath();cx.arc(p.x,p.y,p.r*2.6,0,7);cx.fill()}}})
  })(t0)})();

/* قمع صفحة الهبوط (2026-11-23): ViewContent = وصل لقسم الطلب (مو تحميل الصفحة)، CustomizeProduct = بدا يكتب اسمه */
function vcOnce(){if(window.__vc)return;window.__vc=1;track("ViewContent",{content_ids:(LP.bundle?LP.bundle.items:[LP.slug]).map(function(s){return CAT[s].pid}),content_name:LP.name,content_type:"product",value:total(),currency:"IQD"})}
if(inOrder)vcOnce();
if(TEST)(function(){function a(){var b=document.createElement("div");b.className="testpill";b.textContent="وضع تجربة: ما ينرسل طلب";document.body.appendChild(b)}document.body?a():document.addEventListener("DOMContentLoaded",a)})();
// وضع التجربة فقط: ?test=1&step=up يفتح خطوة تأكيد الرقم مباشرة (للمعاينة على التلفون)
if(TEST&&/[?&]step=up(&|$)/.test(location.search)){ORDER={name:"تجربة",phone:"07701234567",phone2:"",governorate:"بغداد",address:"تجربة",items:items(),q:qty(),sel:SEL,extra:EXTRA.slice(),sum:sum(),disc:disc(),total:total()};SENT=null;showCheck()}
})();
