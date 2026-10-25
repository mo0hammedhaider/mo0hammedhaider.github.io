/* محرّك صفحات هبوط الجسمي — go.aljassmi.shop/<عطر>/
   كل صفحة تعرّف window.LP (المحتوى) وهذا الملف يبني الصفحة والطلب والعروض.
   القواعد: لا أرقام وهمية، الأسعار من الموقع، الآراء حقيقية بس. */
(function(){
"use strict";
var LP=window.LP, CAT=window.CAT||{}, $=function(s,r){return(r||document).querySelector(s)}, $$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var RELAY="https://script.google.com/macros/s/AKfycbzCI8ZMLFJSYv1Bxrq01OtwmTzFmahi41_Ii9qMr-WVUacFA4u-e7E7tghx_Dbqhd6wXg/exec";
var SHIP=5000, DISC={1:0,2:18000,3:40000}, HAIR={was:58000,price:28000,items:[
  {id:"urban",name:"أوربان",d:"منعش ونظيف"},{id:"chic",name:"شيك",d:"ناعم وأنثوي"},{id:"silky",name:"سيلكي",d:"حريري ودافئ"},{id:"majestic",name:"ماجيستك",d:"فخم وعميق"}]};
var money=function(n){return Number(n).toLocaleString("en-US")};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var ME=CAT[LP.slug]||{};
var ICON={
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
var U=LP.bundle?LP.bundle.price:CAT[LP.slug].price;
function dN(n){return n<=1?0:n===2?DISC[2]:DISC[3]+(n-3)*DISC[2]}
var TIERS=LP.tiers||(LP.bundle?[{q:1,price:U}]:[1,2,3].map(function(q){return{q:q,price:q*U-dN(q)}}));
function qty(){return TIERS[SEL].q}
function items(){var a=[];for(var i=0;i<qty();i++)a=a.concat(BASE);return a.concat(EXTRA)}
function sum(){return items().reduce(function(a,s){return a+(CAT[s]?CAT[s].price:0)},0)}
function exSum(){return EXTRA.reduce(function(a,s){return a+CAT[s].price},0)}
function total(){if(LP.bundle)return TIERS[SEL].price+exSum()-EXTRA.length*DISC[2];
  return U*qty()+exSum()-dN(qty()+EXTRA.length)}
function disc(){return sum()-total()}
function unitName(q){return LP.bundle?(q===1?"عرض واحد":q===2?"عرضين":q+" عروض"):(q===1?"عطر واحد":q===2?"عطرين":q+" عطور")}

/* ===== البناء ===== */
document.documentElement.style.setProperty("--ac",LP.theme.ac);
document.documentElement.style.setProperty("--acs",LP.theme.acs);
var A=[];
A.push('<div class="ticker" aria-hidden="true"><div class="t">'+[0,1,2].map(function(){return["تجرّب التستر قبل لا تدفع","ضمان 7 أيام استبدال واسترجاع","توصيل لكل المحافظات 5,000","بغداد خلال 18 ساعة","الدفع عند الاستلام"].map(function(t){return"<span>"+t+"</span>"}).join("")}).join("")+'</div></div>');
A.push('<header class="wrap hdr"><img src="../lp/logo.png" alt="الجسمي"><b>دار الجسمي للعطور</b></header>');

// الهيرو
var bt=LP.bundle?LP.bundle.items.map(function(s,i){return'<img class="btl b'+(i+1)+'" src="'+CAT[s].img+'" alt="عطر '+CAT[s].name+'">'}).join(""):'<img class="btl" src="'+LP.img.btl+'" alt="عطر '+LP.name+'" fetchpriority="high">';
A.push('<section class="hero"><div class="wrap"><div class="en">'+esc(LP.en)+'</div><h1>'+esc(LP.name)+'</h1><p class="tag">'+LP.hero.tag+'</p>'+
  '<div class="stage'+(LP.bundle?" pair":"")+'"><canvas class="fx"></canvas><div class="halo"></div><div class="plinth"></div>'+bt+'<div class="spec">'+LP.spec.map(function(s){return"<span>"+s+"</span>"}).join("")+'</div></div>'+
  '<p class="sub">'+LP.hero.sub+'</p>'+
  '<div class="proof"><div class="pf"><b>+<span class="n">579,000</span> طلب</b><small>خلال 2026 · لكل العراق</small></div><div class="pf" id="ordersPill" hidden><span class="dot"></span><b>تثبّت <span class="n" id="ordersN"></span> طلب من هالصفحة</b></div><div class="pf" id="live" hidden><span class="dot"></span><b><span class="n" id="liveNow"></span> يتصفحون هسه</b></div></div>'+
  '<div class="pricebox"><div class="now"><small>السعر</small><span class="n" id="hNow"></span> <span class="u">د.ع</span></div><div class="note" id="hNote"></div></div>'+
  '<a class="cta" href="#order" data-go>اطلب هسه <small>· تدفع عند الاستلام</small></a>'+
  '<div class="chips"><span class="chip">'+ICON.test+'جرّب التستر قبل الدفع</span><span class="chip">'+ICON.back+'ضمان 7 أيام</span><span class="chip">'+ICON.truck+'5,000 لكل العراق</span></div></div></section>');

// الريلز (ناس حقيقيين) — بعد الهيرو مباشرة لأن الوجه الحقيقي أقوى دليل
if(LP.reels&&LP.reels.length) A.push('<section class="sec dark" id="reels"><div class="wrap reveal"><div class="kick">ناس حقيقيين، مو ممثلين</div><h2 class="h2">'+(LP.reelsH||"شوف شنو كالوا عنه")+'</h2></div><div class="rail" id="rail">'+
  LP.reels.map(function(r){return'<div class="reel"><video muted loop playsinline preload="none" poster="'+r[0]+'.jpg" src="'+r[0]+'.mp4"></video><button class="snd" aria-label="الصوت">'+ICON.sndOff+'</button><div class="lab"><b>'+esc(r[1])+'</b><span>'+esc(r[2])+'</span></div></div>'}).join("")+
  '</div><p class="hint">اضغط على الفيديو حتى تسمع الصوت</p></section>');

// رحلة الرشّة
A.push('<section class="sec" id="smell"><div class="wrap"><div class="reveal"><div class="kick">'+(LP.journeyK||"شلون رائحته؟")+'</div><h2 class="h2">'+(LP.journeyH||"رشّة وحدة… وثلاث مراحل")+'</h2><p class="lead">'+(LP.journeyLead||"اضغط على كل مرحلة وشوف شنو تشم.")+'</p></div><div class="journey">'+
  LP.journey.map(function(j,i){return'<div class="stage3 reveal'+(i===0?" on":"")+'" data-i="'+i+'"><div class="tm"><i></i><span>'+j.t+'</span></div><div><b>'+j.h+'</b><p>'+j.p+'</p><div class="notes">'+j.notes.map(function(n){return"<span>"+n+"</span>"}).join("")+'</div></div></div>'}).join("")+
  '</div>'+(LP.img.ing?'<div class="ingimg reveal"><img loading="lazy" src="'+LP.img.ing+'" alt="مكونات '+esc(LP.name)+'"></div>':"")+'</div></section>');

// القصة
A.push('<section class="sec dark" id="story"><div class="wrap reveal"><div class="kick">'+(LP.story.k||"القصة")+'</div><h2 class="h2">'+LP.story.h+'</h2><div class="story">'+
  LP.story.ps.map(function(p,i){return i===LP.story.qAt?'<p class="q">'+p+'</p>':"<p>"+p+"</p>"}).join("")+'</div>'+
  '<div class="facts">'+LP.story.facts.map(function(f){return"<div><small>"+f[0]+"</small><b>"+f[1]+"</b></div>"}).join("")+'</div></div></section>');

// اختبار المطابقة
A.push('<section class="sec" id="quiz"><div class="wrap"><div class="reveal"><div class="kick">30 ثانية</div><h2 class="h2">هل '+esc(LP.quizName||LP.name)+' عطرك؟</h2><p class="lead">3 أسئلة وتعرف. وإذا مو إلك، نكلك بصراحة شنو يناسبك أكثر.</p></div><div class="quiz reveal" id="qz"></div><p class="disc">النتيجة حسب أجوبتك وشخصية كل عطر من وصف الدار.</p></div></section>');

// يناسبك / ما يناسبك
A.push('<section class="sec" style="padding-top:0"><div class="wrap reveal"><div class="kick">بصراحة</div><h2 class="h2">لِمَن هذا العطر؟</h2><div class="fit"><div class="c yes"><h3>يناسبك إذا</h3><ul>'+LP.fit.yes.map(function(x){return"<li>"+x+"</li>"}).join("")+'</ul></div><div class="c no"><h3>ما ننصحك بيه إذا</h3><ul>'+LP.fit.no.map(function(x){return"<li>"+x+"</li>"}).join("")+'</ul></div></div></div></section>');

// الآراء
if((LP.shots&&LP.shots.length)||(LP.quotes&&LP.quotes.length)) A.push('<section class="sec" id="rev" style="background:#f3ebe2"><div class="wrap reveal"><div class="kick">رسائل زبائن حقيقيين</div><h2 class="h2">'+(LP.revH||"شنو كتبولنا بعد ما وصلهم")+'</h2></div>'+
  (LP.shots&&LP.shots.length?'<div class="shots">'+LP.shots.map(function(s){return'<div class="shot"><img loading="lazy" src="'+s+'" alt="رسالة زبون"></div>'}).join("")+'</div>':"")+
  '<div class="wrap"><div class="quotes" id="quotes"></div><button class="more" id="moreQ">اعرض كل الرسائل</button><p class="disc">الرسائل منقولة مثل ما وصلتنا، بدون أسماء أو صور حفاظاً على خصوصية الزبائن.</p></div></section>');

// الأمان
A.push('<section class="sec dark" id="safe"><div class="wrap reveal"><div class="kick">المخاطرة علينا</div><h2 class="h2">ما تدفع على شي ما جرّبته</h2><div class="steps">'+
  [["1","تطلب من هنا بدقيقة","بس اسمك ورقمك وعنوانك. ما تدفع شي هسه."],["2","يوصلك المندوب ويّا تستر","تجرب العطر قدامه قبل لا تفتح علبتك."],["3","تدفع إذا عجبك","ما عجبك؟ ترجّعه بمكانه وما تدفع ولا دينار."]].map(function(s){return'<div class="st3"><div class="k">'+s[0]+'</div><div><b>'+s[1]+'</b><p>'+s[2]+'</p></div></div>'}).join("")+
  '</div><div class="gbox"><h3>وبعد الاستلام، عندك 7 أيام</h3><ul><li>الاستبدال مفتوح وبأي فرع من فروع الدار، حتى لو طلبت أونلاين.</li><li>أول استبدال أو استرجاع بالتوصيل علينا.</li><li>نقبل فاتورة الفرع أو فاتورة التوصيل، أو حتى صورتها.</li></ul><div class="dl"><div><small>التوصيل</small><b class="n">5,000</b></div><div><small>بغداد</small><b>خلال 18 ساعة</b></div><div><small>المحافظات</small><b>24–48 ساعة</b></div></div></div></div></section>');

// الطلب + مكوّن العرض
A.push('<section class="order dark" id="order"><div class="wrap"><div class="kick">اطلب</div><h2 class="h2">'+(LP.bundle?"ثبّت العرض":"اختار عرضك")+'</h2><p class="lead">'+(LP.orderLead||'عطرين بخصم <b class="n">18,000</b>، و3 بخصم <b class="n">40,000</b>. وحدة إلك، والباقي هدية لناس تحبهم.')+'</p>'+
  '<div class="tiers" id="tiers"></div>'+
  '<div class="build"><div class="pick-h" id="pickH"></div><p class="pick-l" id="pickL"></p><div class="picks" id="picks"></div><div class="chosen" id="chosen"></div></div>'+
  '<form class="form" id="form" novalidate><div class="f"><label for="nm">الاسم</label><input id="nm" autocomplete="name" placeholder="اسمك الكامل"><div class="em">اكتب اسمك</div></div>'+
  '<div class="f"><label for="ph">رقم الموبايل</label><input id="ph" inputmode="numeric" autocomplete="tel" placeholder="07xxxxxxxxx" dir="ltr" style="text-align:right"><div class="hint" id="phHint"></div><div class="em" id="phMsg">اكتب رقم عراقي صحيح يبدي بـ07</div></div>'+
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
  ["لازم أدفع هسه؟","لا. تدفع نقداً للمندوب بعد ما تجرب التستر. بعد ما ترسل الطلب نتصل بيك نأكد العنوان."]]);
A.push('<section class="sec" id="faq"><div class="wrap"><div class="kick">قبل لا تطلب</div><h2 class="h2">أسئلة تدور براسك</h2><div style="margin-top:14px">'+FAQ.map(function(q,i){return'<details class="qa"'+(i===0?" open":"")+'><summary>'+q[0]+'<i></i></summary><p>'+q[1]+'</p></details>'}).join("")+'</div><a class="cta" href="#order" data-go>اطلب '+esc(LP.name)+'</a></div></section>');

A.push('<footer class="foot"><div class="wrap"><img src="../lp/logo-light.png" alt="الجسمي"><b>دار الجسمي للعطور</b><p>العطر تجربة، مو اختيار.</p><div class="others">'+(window.PAGES||[]).filter(function(p){return p[0]!==LP.slug}).map(function(p){return'<a href="../'+p[0]+'/">'+p[1]+'</a>'}).join("")+'</div></div></footer>');
A.push('<div class="sticky" id="sticky"><div class="in"><div class="pr"><small id="stLab">'+esc(LP.name)+'</small><b><span id="stPr"></span> <small>د.ع</small></b></div><a class="go" href="#order" data-go>اطلب هسه</a></div></div><div class="modal" id="up"><div class="sheet" id="upSheet"></div></div>');
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
  var sc={};Object.keys(CAT).forEach(function(s){var t=CAT[s].t||{};sc[s]=(t[ans.when]||0)*1.2+(t[ans.vibe]||0)*1.5});
  var me=LP.bundle?LP.bundle.items:[LP.slug];
  var best=Object.keys(sc).sort(function(a,b){return sc[b]-sc[a]})[0];
  var mine=Math.max.apply(null,me.map(function(s){return sc[s]})), top=sc[best]||1;
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
paintQuiz();

/* ===== الخيارات + إضافة عطور ثانية ===== */
function addExtra(s){if(EXTRA.length>=3)return;EXTRA.push(s);paintCart();track("AddToCart",{content_ids:[CAT[s].pid],value:CAT[s].price,currency:"IQD"})}
function nextSave(){var n=items().length;return LP.bundle?DISC[2]:dN(n+1)-dN(n)}
function paintCart(){var n=items().length,d=disc(),T=TIERS[SEL];
  $("#tiers").innerHTML=TIERS.map(function(t,i){var sv=U*t.q-t.price;return'<button type="button" class="tier'+(i===SEL?" on":"")+'" data-i="'+i+'">'+(TIERS.length===3&&i===1?'<span class="badge">الأكثر طلباً</span>':"")+
    '<span class="rd"></span><span class="tt"><b>'+unitName(t.q)+'</b><span>'+(t.sub||(t.q===1?(LP.bundle?esc(LP.bundle.contents):"بسعره"):t.q===2?"وحدة إلك ووحدة هدية":"إلك ولعائلتك"))+'</span>'+(sv?'<span class="save">توفّر '+money(sv)+' د.ع</span>':"")+'</span><span class="tp">'+(sv?'<s>'+money(U*t.q)+'</s>':"")+'<b>'+money(t.price)+'</b></span></button>'}).join("");
  $$(".tier").forEach(function(b){b.addEventListener("click",function(){SEL=+b.dataset.i;paintCart()})});
  var ns=nextSave(), full=EXTRA.length>=3;
  $("#pickH").textContent=EXTRA.length?"تريد تضيف عطر ثاني بعد؟":"تريد تضيف عطر ثاني ويّا طلبك؟";
  $("#pickL").innerHTML=full?"وصلت أعلى عدد إضافات بالطلب.":'كل عطر تضيفه ينزل المجموع. العطر الجاي ينزله <b class="n">'+money(ns)+'</b> د.ع إضافية.';
  $("#picks").style.display=full?"none":"flex";
  $("#picks").innerHTML=Object.keys(CAT).filter(function(s){return BASE.indexOf(s)<0}).map(function(s){var c=CAT[s];return'<button type="button" class="pk" data-add="'+s+'"><img loading="lazy" src="'+c.img+'" alt=""><b>'+esc(c.name)+'</b><span>'+esc(c.line)+'</span><div class="pp n">'+money(c.price)+'</div><span class="ad">+ ضيف وخصم '+money(ns)+'</span></button>'}).join("");
  $$("#picks [data-add]").forEach(function(b){b.addEventListener("click",function(){addExtra(b.dataset.add)})});
  $("#chosen").innerHTML=EXTRA.map(function(s,i){return'<span class="ch"><img src="'+CAT[s].img+'" alt="">'+esc(CAT[s].name)+'<button type="button" data-rm="'+i+'" aria-label="شيل">×</button></span>'}).join("");
  $$("[data-rm]").forEach(function(b){b.addEventListener("click",function(){EXTRA.splice(+b.dataset.rm,1);paintCart()})});
  var mainLine=LP.bundle?'<div><span>'+esc(LP.bundle.rz)+(T.q>1?" × "+T.q:"")+'</span><span class="n">'+money(T.price)+'</span></div>':'<div><span>'+esc(LP.name)+(T.q>1?" × "+T.q:"")+'</span><span class="n">'+money(U*T.q)+'</span></div>';
  var exLines=EXTRA.map(function(s){return'<div><span>'+esc(CAT[s].name)+'</span><span class="n">'+money(CAT[s].price)+'</span></div>'}).join("");
  var shownDisc=LP.bundle?EXTRA.length*DISC[2]:d;
  $("#osum").innerHTML=mainLine+exLines+(shownDisc?'<div class="sv"><span>الخصم ('+n+' عطور)</span><span class="n">−'+money(shownDisc)+'</span></div>':"")+'<div><span>التوصيل</span><span class="n">'+money(SHIP)+'</span></div><div class="tot"><span>المجموع عند الاستلام</span><span><span class="n">'+money(total()+SHIP)+'</span> د.ع</span></div>';
  $("#hNow").textContent=money(total());
  $("#hNote").innerHTML=(n<=(LP.bundle?2:1))?(LP.priceNote||"")+(LP.bundle?"":'<br>عطرين بخصم <b class="n">18,000</b> · 3 بخصم <b class="n">40,000</b>'):'<s class="was n">'+money(sum())+'</s>'+n+' عطور بالطلب · وفّرت <b class="n">'+money(d)+'</b>';
  $("#stPr").textContent=money(total());$("#stLab").textContent=n<=(LP.bundle?2:1)?LP.name:n+" عطور · وفّرت "+money(d);
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
  showUpsell();
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
  var B=LP.bundle, q=o.q, ex=o.extra, hp=o.hair?HAIR.price:0, all=o.total+hp;
  var L=["━━━━━━━━━━━━"];
  L.push(B?"🛍 العرض: "+B.rz+" · "+unitName(q)+" ("+B.contents+")":"🛍 الطلب: "+LP.name+" · "+unitName(q));
  if(ex.length)L.push("➕ عطور مضافة: "+ex.map(function(s){return CAT[s].name}).join(" + "));
  if(o.disc)L.push("🏷 الخصم: "+money(o.disc)+" ("+o.items.length+" عطور)");
  if(o.hair)L.push("➕ إضافة على نفس الطلب: "+hairName(o.hair)+" بـ28,000 بدل 58,000");
  L.push("💰 المجموع: "+money(all)+" + توصيل "+money(SHIP)+" = "+money(all+SHIP)+" د.ع (دفع عند الاستلام)","━━━━━━━━━━━━","",
    "الاسم: "+o.name,"الرقم: "+o.phone,"العنوان: "+o.governorate+" "+o.address,"","تفاصيل الطلب:");
  L.push("المنتج: "+(B?B.rz:CAT[LP.slug].rz)+"، العدد: "+q);
  var cnt={};ex.forEach(function(s){cnt[s]=(cnt[s]||0)+1});Object.keys(cnt).forEach(function(s){L.push("المنتج: "+CAT[s].rz+"، العدد: "+cnt[s])});
  var rzBase=(B?TIERS[o.sel].price:U*q)+ex.reduce(function(a,s){return a+CAT[s].price},0), rzDisc=rzBase-o.total;
  if(rzDisc)L.push("الخصم: "+money(rzDisc));
  if(o.hair)L.push("المنتج: "+hairName(o.hair)+" · بـ28 ألف بدل 58 (عرض الصفحة)، العدد: 1");
  L.push("السعر: "+money(all)+" وتوصيل "+money(SHIP),"","ملاحظة: تجربة العطر من خلال التيستر فقط","المصدر: صفحة "+LP.name,srcLine());
  return L.join("\n");
}
function payload(o){if(!o.ref)o.ref=LP.code+"-"+Date.now().toString(36).toUpperCase();
  return {kind:"order",page:LP.slug,ref:o.ref,name:o.name,phone:o.phone,governorate:o.governorate,summary:o.items.map(function(s){return CAT[s].name}).join(" + ")+(o.hair?" + "+hairName(o.hair):""),text:"#طلب_جديد "+o.ref+"\n"+orderText(o)}}
function placeOrder(o){return relay(payload(o)).then(function(){track("Purchase",{content_ids:o.items.map(function(s){return CAT[s].pid}).concat(o.hair?["hair-"+o.hair]:[]),content_type:"product",value:o.total+(o.hair?HAIR.price:0),currency:"IQD",num_items:o.items.length},{eventID:o.ref})})}
function track(ev,p,o){try{if(!window.fbq)return;var std=["Purchase","AddToCart","InitiateCheckout","ViewContent"];if(std.indexOf(ev)>=0)fbq("track",ev,p||{},o||{});else fbq("trackCustom",ev,p||{})}catch(e){}}

/* ===== عدّاد حقيقي (زوار + طلبات هالصفحة) ===== */
(function(){var sid;try{sid=sessionStorage.getItem("aj_sid")||Math.random().toString(36).slice(2,12);sessionStorage.setItem("aj_sid",sid)}catch(e){sid=Math.random().toString(36).slice(2,12)}
  function ping(){fetch(RELAY+"?a=ping&p="+LP.slug+"&s="+encodeURIComponent(sid)+"&t="+Date.now(),{redirect:"follow"}).then(function(r){return r.json()}).then(function(j){if(!j.ok)return;
    if(j.orders>=20){$("#ordersN").textContent=money(j.orders);$("#ordersPill").hidden=false}
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

track("ViewContent",{content_ids:(LP.bundle?LP.bundle.items:[LP.slug]).map(function(s){return CAT[s].pid}),content_name:LP.name,content_type:"product",value:total(),currency:"IQD"});
})();
