/* صفحات هبوط معالج الشعر — الجسمي. كل شي يتغيّر من config.json */
(function(){"use strict";
/* حماية التجارب المحلية: من localhost ما يندز أي طلب ولا تتبع */
var LOCAL=location.protocol==="file:"||/^(localhost|127[.]0[.]0[.]1|\[::1\])$|[.](localhost|test)$/.test(location.hostname);
var C=window.HAIR_CFG,P=window.PAGE,HB=window.HB||"/",$=function(s){return document.getElementById(s)};
var money=function(n){return Number(n||0).toLocaleString("en-US")};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var NAMES={1:"قنينة وحدة",2:"قنينتين",3:"ثلاث قناني"};
var state={bundle:1,opt:{1:0,2:0,3:0},heads:null,today:null,busy:false,addon:null,upDone:false};
var GOV_EN={"بغداد":"baghdad","البصرة":"basra","نينوى":"nineveh","أربيل":"erbil","النجف":"najaf","كربلاء":"karbala","بابل":"babil","ذي قار":"dhiqar","الأنبار":"anbar","ديالى":"diyala","صلاح الدين":"salahaddin","كركوك":"kirkuk","واسط":"wasit","ميسان":"maysan","القادسية":"diwaniyah","المثنى":"muthanna","السليمانية":"sulaymaniyah","دهوك":"duhok","حلبجة":"halabja"};

/* ===== مصدر الزيارة: UTM و fbclid و code ===== */
var SRC=(function(){var k="hair_src",q=new URLSearchParams(location.search),v={};
  try{v=JSON.parse(sessionStorage.getItem(k)||"{}")}catch(e){}
  ["utm_source","utm_medium","utm_campaign","utm_content","fbclid","code"].forEach(function(n){var x=q.get(n);if(x)v[n]=x.slice(0,120)});
  try{sessionStorage.setItem(k,JSON.stringify(v))}catch(e){}return v})();

/* ===== التتبع ===== */
var fired={};
function track(ev,p,o){if(LOCAL)return;try{if(window.fbq&&window.AJ_PIXEL)fbq("track",ev,p||{},o||{})}catch(e){}}
function once(ev,p){if(fired[ev])return;fired[ev]=1;track(ev,p)}
/* ميتا ما تقبل الدينار (IQD) كعملة، فالقيمة تنحسب بالدولار للبكسل والـCAPI بس — الطلب والشيت يبقون بالدينار */
function pxCur(){return(C.pixel_currency||"USD").toUpperCase()}
function pxVal(iqd){var r=Number(C.iqd_per_usd||1310);return pxCur()==="IQD"?iqd:Math.round(iqd/r*100)/100}

/* ===== الوقت والأسعار ===== */
function endTs(){var d=C.batch_end_date?Date.parse(C.batch_end_date):NaN;return isNaN(d)?null:d}
function launch(){var t=endTs();return t!==null&&Date.now()<t}
function prices(){var t=endTs();if(t===null)return C.prices_launch;return Date.now()<t?C.prices_launch:(C.prices_after_batch||C.prices_launch)}
function price(n){return Number(prices()[String(n)]||0)}
function perBottle(n){return Math.round(price(n)/n/250)*250}
function alfShort(n){return n%1000===0?(n/1000)+" ألف":money(n)}
function headsLeft(){if(state.heads!==null)return state.heads;return Number(C.spare_heads_total||0)}
function giftOn(){return headsLeft()>0}
function bagdadDate(ts){try{var f=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Baghdad",day:"numeric",month:"numeric"}).formatToParts(new Date(ts)),o={};f.forEach(function(p){o[p.type]=p.value});return o.day+" شهر "+o.month}catch(e){var d=new Date(ts);return d.getDate()+" شهر "+(d.getMonth()+1)}}

/* ===== العرض: كل باقة بيها مجموعات رائحة جاهزة (config.sets) ===== */
function scentList(){return(C.scents&&C.scents[P.scents_key])||[]}
function scentShow(){return(C.scents_show&&C.scents_show[P.scents_key])||scentList()}
function pageTag(s){return((C.scent_tag||{})[P.scents_key]||{})[s]||""}
function setsOf(n){var S=(C.sets&&C.sets[P.scents_key]&&C.sets[P.scents_key][String(n)])||[];
  if(!S.length){var L=scentList(),a=[];for(var i=0;i<n;i++)a.push(L[i%L.length]||"شيك");S=[{label:"",scents:a}]}return S}
function curSet(n){n=n||state.bundle;var S=setsOf(n),i=Math.min(state.opt[n]||0,S.length-1);return S[i]}
function img(s){var im=(window.SCENT_IMG||{})[s]||"pk-chic";return'<img src="'+HB+'hair-lp/img/'+im+'.webp" alt="" width="200" height="300" loading="lazy">'}
function mini(sc){return'<span class="mini">'+sc.map(img).join("")+"</span>"}
function forTag(s){var F=C.scent_for||{};return F[s]?(F[s]==="f"?P.for_f:P.for_m):""}
function saving(n){var pr=price(n),old=Number(C.old_price_single||0);return launch()&&old*n>pr?old*n-pr:Math.max(0,price(1)*n-pr)}
function subOf(n,cs){if(n===1){var s=cs.scents[0];return[pageTag(s)||forTag(s),(C.scent_vibe||{})[s]].filter(Boolean).join(" · ")}
  return(cs.label?cs.label+" · ":"")+money(perBottle(n))+" للقنينة"}
function opsHTML(n){var S=setsOf(n);if(S.length<2)return"";return'<p>'+esc(P.pick)+'</p><div class="grid">'+S.map(function(o,i){var isOn=i===(state.opt[n]||0),lb=n===1?subOf(1,o):o.label;
  return'<button type="button" class="op'+(isOn?" on":"")+'" data-n="'+n+'" data-i="'+i+'" aria-pressed="'+isOn+'">'+mini(o.scents)+'<span class="ol">'+(lb?"<b>"+esc(lb)+"</b>":"")+esc(o.scents.join(" + "))+'</span><span class="ck"></span></button>'}).join("")+"</div>"}
/* بطاقات الكمية بسيطة: عنوان + سعر بس. تغيير الرائحة صار داخل الاستمارة («غيّري») حتى ما يتشتت الزبون */
function renderBundles(){var h="",old=Number(C.old_price_single||0),L=launch();
  [1,2,3].forEach(function(n){var pr=price(n),on=state.bundle===n,cs=curSet(n),badge="",sv=saving(n);
    if(n===2)badge='<span class="badge">الأكثر طلباً</span>';
    if(n===3)badge=giftOn()?'<span class="badge b3">راس بخاخ احتياطي هدية</span>':'<span class="badge b3">أوفر سعر</span>';
    var strike=(L&&old*n>pr)?"<s>"+money(old*n)+"</s>":"";
    var sub=n===1?esc(cs.scents[0])+" · "+money(pr)+" د.ع":money(perBottle(n))+" د.ع للقنينة";
    h+='<div class="lc'+(on?" on":"")+'" role="radio" tabindex="0" aria-checked="'+on+'" data-n="'+n+'">'+badge+
      '<span class="rd"></span>'+mini(cs.scents)+'<div class="tt"><b>'+NAMES[n]+'</b><small>'+sub+'</small>'+(sv?'<span class="sv">توفّر '+money(sv)+'</span>':"")+'</div>'+
      '<div class="pr"><b class="n">'+money(pr)+'<i>د.ع</i></b>'+strike+'</div></div>'});
  $("bl").innerHTML=h;renderChosen()}
function renderQseg(){var q=$("qseg");if(!q)return;q.innerHTML=[1,2,3].map(function(n){var on=state.bundle===n;
  return'<button type="button" class="qb'+(on?" on":"")+'" data-n="'+n+'" aria-pressed="'+on+'"><b>'+NAMES[n]+'</b><span>'+money(price(n))+' د.ع</span></button>'}).join("")}
function renderChosen(){var n=state.bundle,cs=curSet(n),S=setsOf(n);renderQseg();
  $("chosen").innerHTML=mini(cs.scents)+'<div class="cx"><b>'+NAMES[n]+(cs.label&&n>1?" · "+esc(cs.label):"")+'</b><span>'+esc(cs.scents.join(" + "))+'</span></div>'+(S.length>1?'<button type="button" class="chg" id="chgBtn">'+esc(P.chg)+"</button>":"");
  var box=$("chOps");box.innerHTML=opsHTML(n);if(S.length<2)box.hidden=true}
function pick(n,i){var ch=n!==state.bundle;state.bundle=n;if(i!=null)state.opt[n]=i;renderBundles();renderTotals();
  if(ch){var c=$("bl").querySelector('.lc[data-n="'+n+'"]');if(c)c.classList.add("pop");countUp($("stkP"),price(n))}}
/* الرقم يعد لحد السعر الجديد */
function countUp(el,to){if(!el||matchMedia("(prefers-reduced-motion:reduce)").matches)return;var from=Math.max(0,to-12000),t0=performance.now();
  (function f(t){var k=Math.min(1,(t-t0)/500),v=from+(to-from)*(1-Math.pow(1-k,3));el.textContent=money(Math.round(v/500)*500)+" د.ع";if(k<1)requestAnimationFrame(f);else el.textContent=money(to)+" د.ع"})(t0)}

/* ===== الروائح ===== */
function renderScents(){var L=scentShow(),sec=$("scentsSec");if(!L.length){sec.hidden=true;return}sec.hidden=false;
  var D=C.scent_descriptions||{},V=C.scent_vibe||{},h="";
  L.forEach(function(s){var t=pageTag(s),im=(window.SCENT_G||{})[s]||"g-chic";
    h+='<div class="ib"><div class="im"><img src="'+HB+'hair-lp/img/'+im+'.webp" alt="'+esc(s)+'" width="540" height="675" loading="lazy"></div><div class="tx"><div class="nm"><b>'+esc(s)+"</b>"+(t?'<span class="for">'+esc(t)+"</span>":"")+"</div>"+
      (V[s]?'<span class="vb">'+esc(V[s])+"</span>":"")+(D[s]?'<p class="wh">'+esc(D[s])+"</p>":"")+"</div></div>"});
  $("scents").innerHTML=h;var x=$("scents");if(x.classList.contains("in")){x.classList.remove("in");void x.offsetWidth;x.classList.add("in")}}

/* ===== الآراء: بس من config.reviews (نصوص حقيقية، ماكو مخترعة) ===== */
function renderReviews(){var R=(C.reviews||[]).filter(function(r){return r&&r.text&&(!r.page||r.page===P.slug)});$("rq").hidden=!R.length;
  $("rail").innerHTML=R.map(function(r){return'<div class="qt"><span class="st">★★★★★</span><p>'+esc(r.text)+'</p><small>'+esc(r.name||"")+"</small></div>"}).join("")}

/* ===== المجموع والأزرار ===== */
function total(){return price(state.bundle)+Number(C.delivery_fee||0)}
function renderTotals(){var n=state.bundle,d=Number(C.delivery_fee||0);
  $("submitT").textContent=P.confirm+" · "+money(total())+" د.ع";
  var cs=curSet(n);$("stkL").textContent=NAMES[n]+" · "+cs.scents.join(" + ");$("stkP").textContent=money(price(n))+" د.ع";
  $("sum").innerHTML='<div><span>'+NAMES[n]+'</span><b class="num">'+money(price(n))+'</b></div><div><span>التوصيل</span><b class="num">'+money(d)+'</b></div><div class="tot"><span>المجموع عند الاستلام</span><b class="num">'+money(total())+" د.ع</b></div>"}

/* ===== الأرقام اللي تجي من الإعدادات بالنص ===== */
function renderStatic(){document.querySelectorAll("[data-k]").forEach(function(el){var k=el.getAttribute("data-k"),v=C[k];if(v==null)return;el.textContent=(k==="delivery_fee"||k==="rating_count")?money(v):v});
  var g=Number(C.guarantee_days||0);
  if(g)$("guarT").textContent=P.g==="f"?"استخدميه "+g+" يوم. ما فرق؟ رجّعيه.":g+" يوم عليّ. ما عجبك؟ رجّعه.";
  [].forEach.call(document.querySelectorAll("[data-g]"),function(x){x.hidden=!g});
  $("faq").querySelectorAll("details").forEach(function(d){if(d.querySelector("summary").textContent==="شكد التوصيل؟")d.querySelector("p").textContent=money(C.delivery_fee)+" دينار لكل المحافظات، والدفع عند الاستلام."})}

/* ===== الهيرو: منتج واحد بالواجهة يتقلب بين الروائح ===== */
function heroVid(){var v=$("hv");if(!v)return;var sq=JSON.parse(v.getAttribute("data-seq")||"[]"),N=$("rname").children,cur=0;
  function sync(){var t=v.currentTime,k=0;for(var j=0;j<sq.length;j++)if(t>=sq[j][0])k=sq[j][1];if(k!==cur){cur=k;[].forEach.call(N,function(x,j){x.classList.toggle("on",j===k)})}}
  v.addEventListener("timeupdate",sync);
  if(matchMedia("(prefers-reduced-motion:reduce)").matches){v.removeAttribute("autoplay");v.pause();return}
  function play(){var p=v.play();if(p&&p.catch)p.catch(function(){})}
  if("IntersectionObserver"in window)new IntersectionObserver(function(es){es[0].isIntersecting?play():v.pause()}).observe(v);else play()}
function hero(){heroVid();var r=$("rot");if(!r)return;var L=[r.children,$("rname").children,$("rdots").children],i=0,T=null;
  function go(k){i=(k+L[0].length)%L[0].length;L.forEach(function(G){[].forEach.call(G,function(x,j){x.classList.toggle("on",j===i)})})}
  function auto(){clearInterval(T);if(matchMedia("(prefers-reduced-motion:reduce)").matches||L[0].length<2)return;T=setInterval(function(){if(!document.hidden)go(i+1)},3200)}
  [].forEach.call(L[2],function(b,j){b.addEventListener("click",function(){go(j);auto()})});
  r.addEventListener("click",function(){go(i+1);auto()});auto()}

/* ===== المعرض ===== */
function gallery(){var t=$("track");if(!t)return;var dots=$("dots").children,th=$("thumbs")?$("thumbs").children:[],cur=0;
  function set(i){if(i===cur)return;cur=i;[].forEach.call(dots,function(d,k){d.classList.toggle("on",k===i)});[].forEach.call(th,function(b,k){b.classList.toggle("on",k===i)});
    var b=th[i];if(b&&b.scrollIntoView)b.scrollIntoView({block:"nearest",inline:"nearest",behavior:"smooth"})}
  var raf;t.addEventListener("scroll",function(){cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){set(Math.round(t.scrollLeft/t.clientWidth))})},{passive:true});
  [].forEach.call(th,function(b,k){b.addEventListener("click",function(){stop();t.scrollTo({left:k*t.clientWidth,behavior:"smooth"})})});
  var ims=t.children,auto=null;function kb(){[].forEach.call(ims,function(m,k){m.classList.toggle("kb",k===cur)})}
  var _set=set;set=function(i){_set(i);kb()};kb();
  function stop(){clearInterval(auto);auto=null}
  ["touchstart","pointerdown","wheel"].forEach(function(ev){t.addEventListener(ev,stop,{passive:true})});
  if(!matchMedia("(prefers-reduced-motion:reduce)").matches&&ims.length>1)auto=setInterval(function(){if(document.hidden)return;var r=t.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;t.scrollTo({left:((cur+1)%ims.length)*t.clientWidth,behavior:"smooth"})},4200)}

/* ===== الظهور الناعم + الفيديوات (نفس صفحات الباقات) ===== */
function motion(){var R=document.querySelectorAll(".reveal,.stg");
  if(!("IntersectionObserver"in window)){[].forEach.call(R,function(e){e.classList.add("in")});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
  [].forEach.call(R,function(e){io.observe(e)});
  var V=document.querySelectorAll(".reel video");if(!V.length)return;
  var vio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.intersectionRatio>.6){if(!v.src)v.src=v.dataset.src;v.play().catch(function(){})}else v.pause()})},{threshold:[0,.6,1]});
  [].forEach.call(V,function(v){vio.observe(v)});
  document.addEventListener("click",function(e){var r=e.target.closest(".reel");if(!r)return;var v=r.querySelector("video"),on=!r.classList.contains("on");
    [].forEach.call(document.querySelectorAll(".reel.on"),function(x){x.classList.remove("on");x.querySelector("video").muted=true});
    if(!v.src)v.src=v.dataset.src;if(on){r.classList.add("on");v.muted=false;v.play().catch(function(){})}})}

/* ===== الشريط الثابت: يطلع بعد الزر الرئيسي، ويختفي عند الفورم ===== */
function stk(){var r=$("submit").getBoundingClientRect(),vis=r.top<innerHeight&&r.bottom>0;$("sticky").classList.toggle("show",!vis)}

function renderAll(){renderBundles();renderScents();renderReviews();renderTotals();renderStatic()}

/* ===== عدّادات حقيقية من السيرفر ===== */
function getJSON(u){return fetch(u,{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json()})}
function loadCounters(){
  if(C.spare_heads_left_endpoint)getJSON(C.spare_heads_left_endpoint).then(function(j){var n=Number(j.left);if(!isNaN(n)){state.heads=Math.max(0,n);renderBundles()}}).catch(function(){});
  if(C.orders_today_endpoint)getJSON(C.orders_today_endpoint).then(function(j){var n=Number(j.n!=null?j.n:(j.count!=null?j.count:j.orders));if(n>=1){$("todayN").textContent=money(n);$("today").hidden=false}}).catch(function(){})}

/* ===== الفورم ===== */
function normPhone(s){s=String(s||"").replace(/[٠-٩]/g,function(d){return"٠١٢٣٤٥٦٧٨٩".indexOf(d)}).replace(/[۰-۹]/g,function(d){return"۰۱۲۳۴۵۶۷۸۹".indexOf(d)}).replace(/[^\d+]/g,"");
  if(s.indexOf("+964")===0)s="0"+s.slice(4);else if(s.indexOf("00964")===0)s="0"+s.slice(5);else if(s.indexOf("964")===0&&s.length===13)s="0"+s.slice(3);else if(/^7\d{9}$/.test(s))s="0"+s;return s.replace(/\+/g,"")}
function okPhone(s){return/^07\d{9}$/.test(s)}
function setBad(id,bad){$(id).classList.toggle("bad",!!bad)}
function readForm(){var cs=curSet(),sc=cs.scents.slice();
  return{name:$("name").value.trim().replace(/\s+/g," "),phone:normPhone($("phone").value),governorate:$("gov").value,area:$("area").value.trim().replace(/\s+/g," "),bundle:state.bundle,scents:sc,set_label:cs.label||"",code:($("code").value||SRC.code||"").trim()}}
function validate(f){var bad=[];
  setBad("f-name",f.name.length<2)||0;if(f.name.length<2)bad.push("name");
  var pb=!okPhone(f.phone);setBad("f-phone",pb);if(pb)bad.push("phone");
  setBad("f-gov",!f.governorate);if(!f.governorate)bad.push("gov");
  setBad("f-area",f.area.length<2);if(f.area.length<2)bad.push("area");
  return bad}

function newId(){var t=Date.now().toString(36).toUpperCase(),r="";try{var a=new Uint8Array(3);crypto.getRandomValues(a);r=[].map.call(a,function(b){return(b%36).toString(36)}).join("").toUpperCase()}catch(e){r=Math.random().toString(36).slice(2,5).toUpperCase()}
  return(P.g==="f"?"HW-":"HM-")+t.slice(-6)+r}
function ck(k){var m=document.cookie.match(new RegExp("(?:^|; )"+k+"=([^;]*)"));return m?decodeURIComponent(m[1]):""}
function alf(n){if(n%1000)return money(n);var k=n/1000;return k+(k>2&&k<11?" الاف":" الف")}
function teleText(o){var cnt={};o.scents.forEach(function(s){cnt[s]=(cnt[s]||0)+1});
  var prod=Object.keys(cnt).map(function(s){return"عطر شعر "+s+(cnt[s]>1?" × "+cnt[s]:"")}).join(" + ")+(o.addon?" + عطر "+o.addon.name:"");
  var L=["الاسم : "+o.name,"الرقم : "+o.phone,"العنوان : "+o.governorate+" "+o.area,"——","تفاصيل الطلب : طلب جديد من صفحة الهبوط","المنتج : "+prod,
    "السعر : "+alf(o.price)+" والتوصيل "+alf(o.delivery_fee),"——","ملاحظة : تجربة العطر من خلال التيستر فقط والتأكد من سلامة الطلب",prod,"","━━━━━━━━━━━━","للفريق بس (لا ينسخ):",
    "المجموع عند الاستلام: "+money(o.total)+" د.ع · "+NAMES[o.bundle]+(o.spare_head?" + راس بخاخ احتياطي هدية":""),"المصدر: صفحة "+P.name+(o.code?" · الكود: "+o.code:"")];
  if(o.addon)L.splice(L.length-2,0,"➕ إضافة على نفس الطلب: عطر "+o.addon.name+" ("+alf(o.addon.price)+" بدل "+alf(o.addon.was)+")");
  var a=o.utm_content||o.utm_campaign;L.push(a?"الإعلان: "+a+(o.utm_campaign&&o.utm_content?" · "+o.utm_campaign:""):(o.fbclid?"الإعلان: ميتا (بدون اسم)":"الإعلان: زيارة مباشرة"));
  return L.join("\n")}
function buildOrder(f,id){var pr=price(f.bundle),d=Number(C.delivery_fee||0),o={
    order_id:id,created_at:new Date().toISOString(),page:P.slug,name:f.name,phone:f.phone,governorate:f.governorate,area:f.area,bundle:f.bundle,scents:f.scents,set_label:f.set_label,
    price:pr,delivery_fee:d,total:pr+d,addon:null,spare_head:f.bundle===3&&giftOn(),code:f.code,
    utm_source:SRC.utm_source||"",utm_medium:SRC.utm_medium||"",utm_campaign:SRC.utm_campaign||"",utm_content:SRC.utm_content||"",fbclid:SRC.fbclid||"",user_agent:navigator.userAgent.slice(0,400)};
  var A=state.addon;if(A){o.addon={id:A.id,name:A.name,price:Number(A.price),was:Number(A.was)};o.price=pr+o.addon.price;o.total=o.price+d}
  var fbc=ck("_fbc");if(!fbc&&o.fbclid)fbc="fb.1."+Date.now()+"."+o.fbclid;
  /* حقول إضافية حتى الريلاي الحالي (تيليگرام «طلبات الجسمي» + الشيت) يفهم الطلب */
  o.kind="order";o.ref=id;o.set_label=f.set_label;o.summary=NAMES[f.bundle]+(f.set_label&&f.bundle>1?" ("+f.set_label+")":"")+" — "+f.scents.join(" + ")+(o.addon?" + عطر "+o.addon.name:"");o.text="#طلب_جديد "+id+"\n"+teleText(o);
  o.event_id=id;o.capi={fbp:ck("_fbp"),fbc:fbc,ua:o.user_agent,url:location.href.split("#")[0].slice(0,500),value:pxVal(o.total),currency:pxCur(),value_iqd:o.total,ids:["hair-treatment-"+f.bundle].concat(o.addon?["perfume-"+o.addon.id]:[]),n:f.bundle};
  return o}

var PK="hair_pending";
function pend(){try{return JSON.parse(localStorage.getItem(PK)||"[]")}catch(e){return[]}}
function savePend(L){try{localStorage.setItem(PK,JSON.stringify(L.slice(-5)))}catch(e){}}
function addPend(o){var L=pend().filter(function(x){return x.order_id!==o.order_id});L.push(o);savePend(L)}
function dropPend(id){savePend(pend().filter(function(x){return x.order_id!==id}))}
function send(o){if(LOCAL){try{console.warn("[تجربة محلية] الطلب ما اندز",o)}catch(e){}return new Promise(function(r){setTimeout(function(){r(o)},300)})}
  if(!C.order_webhook_url)return Promise.reject(new Error("no webhook"));
  var ctl=window.AbortController?new AbortController():null,to=setTimeout(function(){ctl&&ctl.abort()},20000);
  return fetch(C.order_webhook_url,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(o),redirect:"follow",signal:ctl?ctl.signal:undefined})
    .then(function(r){clearTimeout(to);if(!r.ok)throw new Error("http "+r.status);return r.text()}).then(function(t){var j=null;try{j=JSON.parse(t)}catch(e){}if(j&&j.ok===false)throw new Error(j.error||"rejected");
      if(C.capi_endpoint){try{fetch(C.capi_endpoint,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify({event_name:"Purchase",event_id:o.order_id,phone:o.phone,value:pxVal(o.total),currency:pxCur(),value_iqd:o.total,content_ids:o.capi.ids,fbp:o.capi.fbp,fbc:o.capi.fbc,ua:o.user_agent,url:o.capi.url,governorate:o.governorate,name:o.name}),keepalive:true})}catch(e){}}
      return o})}
function done(o){dropPend(o.order_id);
  try{sessionStorage.setItem("hair_last",JSON.stringify({order_id:o.order_id,name:o.name,phone:o.phone,governorate:o.governorate,area:o.area,bundle:o.bundle,scents:o.scents,set_label:o.set_label||"",price:o.price,delivery_fee:o.delivery_fee,total:o.total,spare_head:o.spare_head,addon:o.addon,ids:o.capi.ids,page:o.page,gov_en:GOV_EN[o.governorate]||"",px_value:pxVal(o.total),px_cur:pxCur()}))}catch(e){}
  location.href=location.protocol==="file:"?"thanks/index.html":"/"+P.slug+"/thanks/"}

var cur=null,retryT;
function submit(ev){ev.preventDefault();if(state.busy)return;state.busy=true;   /* قفل فوري ضد الضغطتين */
  var f=readForm(),bad=validate(f);$("ferr").classList.remove("on");
  if(bad.length){state.busy=false;var el=$(bad[0]);el.scrollIntoView({behavior:"smooth",block:"center"});if(el.focus)setTimeout(function(){el.focus({preventScroll:true})},350);return}
  var sig=JSON.stringify(f);if(!cur||cur.sig!==sig){if(cur)dropPend(cur.id);cur={sig:sig,id:newId()}}
  var U=C.upsell&&C.upsell[P.slug];
  if(U&&U.price&&!state.upDone){state.busy=false;openUp(U,f);return}
  go(f)}
function go(f){state.busy=true;var o=buildOrder(f,cur.id);addPend(o);
  var b=$("submit");b.disabled=true;b.classList.add("busy");
  send(o).then(done).catch(function(){state.busy=false;b.disabled=false;b.classList.remove("busy");closeUp();$("ferr").classList.add("on");
    $("ferr").scrollIntoView({behavior:"smooth",block:"center"});clearTimeout(retryT);retryT=setTimeout(bgRetry,8000)})}

/* ===== عرض بعد «أكّد الطلب»: عطر للجسم على نفس الطلب ونفس التوصيل (طلب واحد، Purchase واحد) ===== */
var upT=null,upF=null;
function openUp(U,f){upF=f;var fm=P.g==="f",sv=Number(U.was)-Number(U.price);
  $("upSheet").innerHTML='<span class="grab"></span><p class="uok">'+esc(U.ok||"")+' <i>✓</i></p><h3 class="uh2">'+esc(U.h)+'</h3><p class="ul">'+esc(U.lead||"")+'</p><hr class="uhr">'+
    '<div class="upd"><img src="'+HB+'hair-lp/img/'+esc(U.img)+'.webp" alt="عطر '+esc(U.name)+'"><div><b>عطر '+esc(U.name)+'</b><small>'+esc(U.sub||"")+'</small></div></div>'+
    '<p class="uwas"><s>'+money(U.was)+' د.ع</s></p><p class="unow num">'+money(U.price)+' <span>د.ع</span></p>'+
    '<p class="usave"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>'+(fm?"توفرين ":"توفر ")+'<b class="num">'+money(sv)+'</b> د.ع</p>'+
    '<button type="button" class="add" id="addH">'+esc(U.add)+'</button><button type="button" class="skip" id="skipH">'+esc(U.skip)+'</button>'+
    '<div class="uload"><span class="spin"></span>لحظة…</div>';
  var m=$("up");m.classList.add("open");document.body.classList.add("lock");$("upSheet").scrollTop=0;
  $("addH").onclick=function(){state.addon={id:U.id,name:U.name,price:U.price,was:U.was};finishUp()};
  $("skipH").onclick=function(){state.addon=null;finishUp()};
  m.onclick=function(e){if(e.target===m){state.addon=null;finishUp()}};   /* ضغطة برّه = بدون العطر، والطلب يتثبّت */
  clearTimeout(upT);upT=setTimeout(function(){if(m.classList.contains("open")&&!state.busy){state.addon=null;finishUp()}},60000);
  track("ViewContent",{content_ids:["perfume-"+U.id],content_type:"product",value:pxVal(Number(U.price)),currency:pxCur()})}
function finishUp(){if(state.busy)return;state.upDone=true;clearTimeout(upT);$("upSheet").classList.add("loading");go(upF)}
function closeUp(){var m=$("up");if(!m)return;m.classList.remove("open");document.body.classList.remove("lock");$("upSheet").classList.remove("loading")}
/* إذا سكّر الصفحة والعرض مفتوح: الطلب الأصلي (بدون العطر) ما يضيع */
addEventListener("pagehide",function(){var m=$("up");if(LOCAL||!m||!m.classList.contains("open")||state.busy||!upF||!navigator.sendBeacon||!C.order_webhook_url)return;
  state.addon=null;var o=buildOrder(upF,cur.id);try{if(navigator.sendBeacon(C.order_webhook_url,new Blob([JSON.stringify(o)],{type:"text/plain;charset=UTF-8"}))){state.upDone=true;dropPend(o.order_id)}}catch(e){}})
function bgRetry(){if(LOCAL)return;var L=pend();if(!L.length)return;var o=L[L.length-1];send(o).then(function(){if(cur&&cur.id===o.order_id&&!state.busy)done(o);else dropPend(o.order_id)}).catch(function(){})}

/* ===== التشغيل ===== */
function init(){renderAll();loadCounters();hero();gallery();motion();
  $("bl").addEventListener("click",function(e){var b=e.target.closest(".lc");if(b&&+b.dataset.n!==state.bundle)pick(+b.dataset.n)});
  $("chosen").addEventListener("click",function(e){if(e.target.closest("#chgBtn")){var x=$("chOps");x.hidden=!x.hidden}});
  if($("qseg"))$("qseg").addEventListener("click",function(e){var b=e.target.closest(".qb");if(b){pick(+b.dataset.n);$("chOps").hidden=true}});
  $("chOps").addEventListener("click",function(e){var o=e.target.closest(".op");if(o){pick(+o.dataset.n,+o.dataset.i);$("chOps").hidden=true}});
  $("bl").addEventListener("keydown",function(e){var b=e.target.closest(".lc");if(b&&e.target===b&&(e.key==="Enter"||e.key===" ")){e.preventDefault();pick(+b.dataset.n)}});
  if(SRC.code){$("code").value=SRC.code;$("f-code").hidden=true}
  $("codeTgl").addEventListener("click",function(){$("codeBox").hidden=false;this.hidden=true;$("code").focus()});
  $("phone").addEventListener("blur",function(){var v=normPhone(this.value);if(v)this.value=v;if(this.value)setBad("f-phone",!okPhone(v))});
  ["name","area"].forEach(function(id){$(id).addEventListener("input",function(){if(this.value.trim().length>=2)setBad("f-"+id,false)})});
  $("gov").addEventListener("change",function(){if(this.value)setBad("f-gov",false)});
  $("form").addEventListener("focusin",function(){once("InitiateCheckout",{content_ids:["hair-treatment-"+state.bundle],content_type:"product",value:pxVal(total()),currency:pxCur(),num_items:state.bundle})});
  $("form").addEventListener("submit",submit);
  addEventListener("scroll",stk,{passive:true});addEventListener("resize",stk);stk();
  if("IntersectionObserver"in window)
    new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting)once("ViewContent",{content_ids:["hair-treatment-"+state.bundle],content_type:"product",value:pxVal(price(state.bundle)),currency:pxCur()})})},{threshold:.3}).observe($("bundles"));
  /* 2026-11-25 (محمد): قياس وصول الأقسام: كل قسم يدز حدث بكسل واحد أول ما يدخل الشاشة: Sec_<الصفحة>_<ترتيبه>_<القسم> */
  if("IntersectionObserver"in window)(function(){var app=document.querySelectorAll("body section"),tops=[].filter.call(app,function(s){return s.id==="bundles"||!(s.parentNode&&s.parentNode.closest&&s.parentNode.closest("section"))}),seen={};
    function key(s){if(s.id)return s.id;var c=[].filter.call(s.classList,function(x){return x!=="sec"&&x!=="dark"})[0];return c||"s"}
    var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var s=e.target,k=key(s);sio.unobserve(s);if(seen[k])return;seen[k]=1;var n=tops.indexOf(s)+1,ev="Sec_"+(P.slug||"hair")+"_"+(n<10?"0":"")+n+"_"+k;
      if(LOCAL){try{console.log("[TEST] بكسل:",ev)}catch(x){}return}try{if(window.fbq&&window.AJ_PIXEL)fbq("trackCustom",ev,{sec:k,pos:n})}catch(x){}})},{rootMargin:"0px 0px -30% 0px",threshold:0});
    tops.forEach(function(s){sio.observe(s)})})();
  /* طلب قديم ما وصل؟ نعيد إرساله بهدوء */
  setTimeout(function(){pend().forEach(function(o){send(o).then(function(){dropPend(o.order_id)}).catch(function(){})})},3000);
  addEventListener("online",bgRetry);
  /* إعدادات حيّة: إذا config.json تغيّر بعد التوليد، نطبّقه */
  getJSON(HB+"hair-lp/config.json?t="+Math.floor(Date.now()/60000)).then(function(j){if(JSON.stringify(j)!==JSON.stringify(C)){C=j;renderAll();loadCounters()}}).catch(function(){})}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();
