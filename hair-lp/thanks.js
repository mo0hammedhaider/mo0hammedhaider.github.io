/* صفحة الشكر — تعرض ملخص الطلب وتطلق Purchase مرة وحدة بنفس event_id اللي راح للسيرفر */
(function(){"use strict"; var LOCAL=location.protocol==="file:"||/^(localhost|127[.]0[.]0[.]1|\[::1\])$|[.](localhost|test)$/.test(location.hostname);
var o=null;try{o=JSON.parse(sessionStorage.getItem("hair_last")||"null")}catch(e){}
if(!o||!o.order_id)return;
var money=function(n){return Number(n||0).toLocaleString("en-US")};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var NAMES={1:"قنينة وحدة",2:"قنينتين",3:"ثلاث قناني"};
var c=document.getElementById("card");
c.innerHTML='<div><span>رقم الطلب</span><b class="num">'+esc(o.order_id)+'</b></div>'+
  '<div><span>'+NAMES[o.bundle]+(o.set_label&&o.bundle>1?" · "+esc(o.set_label):"")+'</span><b>'+esc((o.scents||[]).join(" + "))+'</b></div>'+
  (o.spare_head?'<div><span>الهدية</span><b>راس بخاخ احتياطي</b></div>':"")+
  (o.addon?'<div><span>➕ ويا الطلب</span><b>عطر '+esc(o.addon.name)+' · '+money(o.addon.price)+' د.ع</b></div>':"")+
  '<div><span>العنوان</span><b>'+esc(o.governorate+"، "+o.area)+'</b></div>'+
  '<div class="tot"><span>'+(o.page==="women"?"تدفعين":"تدفع")+' عند الاستلام</span><b class="num">'+money(o.total)+' د.ع</b></div>';
c.hidden=false;
/* ===== 2026-11-26 (محمد): كارت «الضمان الذهبي» للشعر — 30 يوم، يشمل النتيجة، ماكو تيستر، وبيه طريقة الاستخدام الصحيحة. ينحفظ PDF أو صورة ===== */
var FEM=o.page==="women",G=function(m,f){return FEM?f:m},GD=30;
if(!o.wts){o.wts=Date.now();try{sessionStorage.setItem("hair_last",JSON.stringify(o))}catch(e){}}
function wDate(t){var d=new Date(t);return d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()}
var SN=(function(){var s=String(o.order_id),h=5381,A="23456789ABCDEFGHJKLMNPQRSTUVWXYZ",c="",d=new Date(o.wts);for(var i=0;i<s.length;i++)h=(((h<<5)+h)^s.charCodeAt(i))>>>0;
  for(var j=0;j<5;j++){c+=A[h%32];h=Math.floor(h/32)}
  return "AJH-"+String(d.getFullYear()).slice(2)+("0"+(d.getMonth()+1)).slice(-2)+("0"+d.getDate()).slice(-2)+"-"+c})();
var PROD="معالج الشعر · "+NAMES[o.bundle]+((o.scents||[]).length?" ("+o.scents.join(" + ")+")":"")+(o.spare_head?" + راس بخاخ هدية":"")+(o.addon?" + عطر "+o.addon.name:"");
var STEPS=FEM?["بعد الشاور، نشّفي شعرچ بالمنشفة.","اضغطي قوي على المرش حتى يطلع المعالج على إيدچ: من 3 إلى 5 رشات.","وزّعيه بإيدچ على شعرچ، من نص الشعر للأطراف.","سشوار أو كواية، حسب اختيارچ."]
  :["بعد الشاور، نشّف شعرك بالمنشفة.","اضغط قوي على المرش حتى يطلع المعالج على إيدك: من 3 إلى 5 رشات.","وزّعه بإيدك على شعرك وسرّح.","سشوار أو كواية، حسب اختيارك."];
var TIP=FEM?"إذا شعرچ ناعم وخفيف، 3 رشات تكفي.":"خذ القنينة وياك للحلاق.";
function wCard(cb){
  var W=1080,P=40,IW=W-2*P,BR="#4a1b1d",GLD="#c9a66b",IV="#f6efe5",INK="#3b2a1e",MU="#8a7461";
  var c=document.createElement("canvas"),x=c.getContext("2d");
  function f(w,s,m){return w+" "+s+"px "+(m?"M":"F")+",sans-serif"}
  function wrap(t,font,max){x.font=font;var ws=String(t).split(" "),L=[],cur="";ws.forEach(function(w){var n=cur?cur+" "+w:w;if(x.measureText(n).width>max&&cur){L.push(cur);cur=w}else cur=n});if(cur)L.push(cur);return L}
  function T(t,X,Y,font,col,al,dir){x.font=font;x.fillStyle=col;x.textAlign=al||"right";x.direction=dir||"rtl";x.fillText(t,X,Y)}
  function rr(X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
  function gold(y0,y1){var g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,"#f6e1b0");g.addColorStop(.55,"#d6b273");g.addColorStop(1,"#a77b3f");return g}
  var prodF=f(700,30),prodL=wrap(PROD,prodF,560);
  var rows=[["رقم الطلب",o.order_id,1],["تاريخ الشراء",wDate(o.wts),1],["ينتهي الضمان","بعد "+GD+" يوم من يوم الاستلام"],["الاسم",o.name||"—"],["رقم الهاتف",o.phone||"—",1]];
  var stF=f(500,28),SW=IW-60-150,stL=STEPS.map(function(t){return wrap(t,stF,SW)}),stH=0;stL.forEach(function(l){stH+=Math.max(1,l.length)*42+30});
  var noF=f(500,25),noL=wrap(G("ماكو تيستر للمعالج، لأن نتيجته تبين على شعرك بالاستخدام. فجرّبه براحتك بالبيت، والضمان يغطيك "+GD+" يوم.","ماكو تيستر للمعالج، لأن نتيجته تبين على شعرچ بالاستخدام. فجرّبيه براحتچ بالبيت، والضمان يغطيچ "+GD+" يوم."),noF,IW-180);
  var R1=560,B1=R1+260+rows.length*64+prodL.length*44+30+80,T0=B1+30,T1=T0+300+noL.length*36+50,U0=T1+30,U1=U0+110+stH+90,C0=U1+30,C1=C0+150;
  var H=C1+110;H+=H%2;c.width=W;c.height=H;
  x.fillStyle="#1c0d0c";x.fillRect(0,0,W,H);
  // ===== اللوحة العنابية
  var g=x.createLinearGradient(0,P,0,P+480);g.addColorStop(0,"#5c2427");g.addColorStop(1,"#2e1112");rr(P,P,IW,480,34);x.fillStyle=g;x.fill();x.strokeStyle="rgba(201,166,107,.35)";x.lineWidth=2;x.stroke();
  var ax=P+IW-230,ay=P+50;x.beginPath();x.moveTo(ax,ay+380);x.lineTo(ax,ay+95);x.arc(ax+95,ay+95,95,Math.PI,0);x.lineTo(ax+190,ay+380);x.closePath();x.fillStyle="rgba(0,0,0,.18)";x.fill();x.strokeStyle="rgba(201,166,107,.45)";x.stroke();
  T(String(GD),ax+95,ay+255,f(700,190,1),gold(ay+100,ay+255),"center","ltr");
  T("يوم",ax+95,ay+318,f(900,46),"#f1dcae","center");T("بعد الاستلام",ax+95,ay+360,f(500,26),"#e6cfa0","center");
  var cx=P+(IW-250)/2+10;
  if(wCard.logo&&wCard.logo.complete&&wCard.logo.naturalWidth)x.drawImage(wCard.logo,cx-58,P+34,116,103);
  T("الضمان الذهبي",cx,P+262,f(900,92),gold(P+180,P+262),"center");
  T("R E S U L T   G U A R A N T E E",cx,P+318,f(600,19,1),"#d9bf8c","center","ltr");
  T(G("ما شفت فرق بشعرك؟ يرجع","ما شفتي فرق بشعرچ؟ يرجع"),cx,P+400,f(700,32),"#f3e3c2","center");
  x.strokeStyle="rgba(201,166,107,.6)";x.lineWidth=2;x.beginPath();x.moveTo(cx-330,P+390);x.lineTo(cx-290,P+390);x.moveTo(cx+290,P+390);x.lineTo(cx+330,P+390);x.stroke();
  // ===== بيانات الطلب
  rr(P,R1,IW,B1-R1,34);x.fillStyle=IV;x.fill();
  T(G("بيانات ضمانك","بيانات ضمانچ"),P+IW-40,R1+62,f(900,36),BR);T(G("احتفظ بهذا الكارت","احتفظي بهذا الكارت"),P+40,R1+60,f(500,24),MU,"left");
  rr(P+40,R1+90,IW-80,130,22);x.fillStyle="#efe3d1";x.fill();x.setLineDash([10,8]);x.strokeStyle=GLD;x.lineWidth=2.5;x.stroke();x.setLineDash([]);
  T("رقم الضمان",W/2,R1+132,f(700,24),MU,"center");T(SN,W/2,R1+192,f(700,52,1),BR,"center","ltr");
  var y=R1+260,LX=P+IW-50,VX=P+50;
  function line(){x.strokeStyle="rgba(96,72,50,.14)";x.lineWidth=1.5;x.beginPath();x.moveTo(P+40,y);x.lineTo(P+IW-40,y);x.stroke()}
  rows.forEach(function(r){T(r[0],LX,y+42,f(500,27),MU);T(r[1],VX,y+42,r[2]?f(700,30,1):f(700,30),INK,"left",r[2]?"ltr":"rtl");y+=64;line()});
  T("المنتجات",LX,y+42,f(500,27),MU);prodL.forEach(function(l,i){T(l,VX,y+42+i*44,prodF,INK,"left")});y+=prodL.length*44+30;line();
  T("المجموع عند الاستلام",LX,y+46,f(700,28),BR);T(money(o.total)+" د.ع",VX,y+48,f(700,34,1),BR,"left");
  // ===== شروط الضمان
  var y0=T0;rr(P,y0,IW,T1-T0,34);x.fillStyle=IV;x.fill();
  var cols=[["مدة الضمان",GD+" يوم","تبدأ من تاريخ الاستلام","cal"],["الضمان يشمل","النتيجة على شعرك",G("ما شفت فرق؟ يرجع","ما شفتي فرق؟ يرجع"),"star"],["الشرط","الاستخدام الصحيح","مثل ما مكتوب بالكارت","chk"]],cw=IW/3;
  if(FEM)cols[1][1]="النتيجة على شعرچ";
  function ico(k,X,Y){x.strokeStyle=BR;x.lineWidth=3.2;x.lineCap="round";x.lineJoin="round";x.beginPath();
    if(k==="cal"){rr(X-26,Y-24,52,48,7);x.stroke();x.beginPath();x.moveTo(X-26,Y-10);x.lineTo(X+26,Y-10);x.moveTo(X-13,Y-32);x.lineTo(X-13,Y-18);x.moveTo(X+13,Y-32);x.lineTo(X+13,Y-18);x.stroke();x.fillStyle=BR;[-12,0,12].forEach(function(a){[3,14].forEach(function(b){x.fillRect(X+a-3,Y+b-3,6,6)})})}
    else if(k==="star"){for(var i=0;i<10;i++){var r=i%2?13:31,a=Math.PI*i/5-Math.PI/2;i?x.lineTo(X+r*Math.cos(a),Y+r*Math.sin(a)):x.moveTo(X+r*Math.cos(a),Y+r*Math.sin(a))}x.closePath();x.stroke()}
    else{x.arc(X,Y,29,0,7);x.stroke();x.beginPath();x.moveTo(X-13,Y+1);x.lineTo(X-3,Y+11);x.lineTo(X+15,Y-10);x.stroke()}}
  cols.forEach(function(k,i){var X=P+IW-cw*i-cw/2;ico(k[3],X,y0+70);T(k[0],X,y0+150,f(900,32),BR,"center");T(k[1],X,y0+198,f(700,26),INK,"center");T(k[2],X,y0+238,f(500,23),MU,"center");
    if(i){x.strokeStyle="rgba(96,72,50,.25)";x.lineWidth=2;x.beginPath();x.moveTo(P+IW-cw*i,y0+50);x.lineTo(P+IW-cw*i,y0+250);x.stroke()}});
  var ny=y0+280;rr(P+30,ny,IW-60,noL.length*36+30,20);x.fillStyle="#ebdfcc";x.fill();
  x.beginPath();x.arc(P+IW-75,ny+(noL.length*36+30)/2,20,0,7);x.fillStyle=BR;x.fill();T("!",P+IW-75,ny+(noL.length*36+30)/2+9,f(700,26,1),"#f3e3c2","center","ltr");
  noL.forEach(function(l,i){T(l,P+IW-115,ny+42+i*36,noF,INK)});
  // ===== طريقة الاستخدام الصحيحة
  rr(P,U0,IW,U1-U0,34);x.fillStyle=IV;x.fill();
  rr(P+30,U0+30,IW-60,62,18);x.fillStyle=BR;x.fill();
  T("طريقة الاستخدام الصحيحة",W/2,U0+73,f(900,32),"#f3e3c2","center");
  var sy=U0+120;stL.forEach(function(l,i){var NX=P+IW-70;x.beginPath();x.arc(NX,sy+18,24,0,7);x.fillStyle=gold(sy-6,sy+42);x.fill();T(String(i+1),NX,sy+28,f(700,26,1),BR,"center","ltr");
    l.forEach(function(t,j){T(t,NX-48,sy+30+j*42,stF,INK)});sy+=Math.max(1,l.length)*42+30;
    if(i<stL.length-1){x.strokeStyle="rgba(201,166,107,.55)";x.lineWidth=2;x.setLineDash([4,6]);x.beginPath();x.moveTo(NX,sy-26);x.lineTo(NX,sy-4);x.stroke();x.setLineDash([])}});
  rr(P+30,sy,IW-60,62,18);x.strokeStyle=GLD;x.lineWidth=2;x.setLineDash([8,6]);x.stroke();x.setLineDash([]);
  T("نصيحة: "+TIP,W/2,sy+41,f(700,26),BR,"center");
  // ===== طريقة الاستفادة من الضمان
  rr(P+30,C0,IW-60,150,22);x.fillStyle="#ebdfcc";x.fill();rr(P+IW-30-250,C0,250,150,22);x.fillStyle=BR;x.fill();
  T("طريقة الاستفادة",P+IW-30-125,C0+66,f(900,30),"#f3e3c2","center");T("من الضمان",P+IW-30-125,C0+106,f(900,30),"#f3e3c2","center");
  var cl=[[G("راسلنا","راسلينا"),"على الواتساب"],[G("ارسل","ارسلي")+" رقم","الضمان"],["نرتب وياك","الاسترجاع"]],sw=(IW-310)/3;
  cl.forEach(function(s,i){var X=P+IW-30-250-sw*i-sw/2;x.beginPath();x.arc(X+sw/2-34,C0+58,19,0,7);x.fillStyle=BR;x.fill();T(String(i+1),X+sw/2-34,C0+67,f(700,22,1),"#f3e3c2","center","ltr");
    T(s[0],X+sw/2-62,C0+68,f(700,24),INK,"right");T(s[1],X+sw/2-62,C0+106,f(500,22),MU,"right")});
  T("دار الجسمي للعطور · aljassmi.store",W/2,H-P-10,f(500,24),"#cdb185","center");
  cb(c)}
function wPdf(c){var w=c.width/2,h=c.height/2,b=atob(c.toDataURL("image/jpeg",.9).split(",")[1]),im=new Uint8Array(b.length),i;for(i=0;i<b.length;i++)im[i]=b.charCodeAt(i);
  var parts=[],off=[],len=0,cs="q "+w+" 0 0 "+h+" 0 0 cm /Im0 Do Q";
  function add(s){if(typeof s==="string"){var u=new Uint8Array(s.length);for(var k=0;k<s.length;k++)u[k]=s.charCodeAt(k)&255;s=u}parts.push(s);len+=s.length}
  add("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  off[1]=len;add("1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n");
  off[2]=len;add("2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n");
  off[3]=len;add("3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 "+w+" "+h+"]/Resources<</XObject<</Im0 4 0 R>>>>/Contents 5 0 R>>endobj\n");
  off[4]=len;add("4 0 obj<</Type/XObject/Subtype/Image/Width "+c.width+"/Height "+c.height+"/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length "+im.length+">>stream\n");add(im);add("\nendstream\nendobj\n");
  off[5]=len;add("5 0 obj<</Length "+cs.length+">>stream\n"+cs+"\nendstream\nendobj\n");
  var xr=len,s="xref\n0 6\n0000000000 65535 f \n";for(i=1;i<6;i++)s+=("000000000"+off[i]).slice(-10)+" 00000 n \n";
  add(s+"trailer<</Size 6/Root 1 0 R>>\nstartxref\n"+xr+"\n%%EOF");return new Blob(parts,{type:"application/pdf"})}
function wSave(blob,name){var file;try{file=new File([blob],name,{type:blob.type})}catch(e){}
  if(file&&/iPhone|iPad|iPod/.test(navigator.userAgent)&&navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file]}).catch(function(){});return}
  var u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove()},5000)}
var trk=function(n,p){try{!LOCAL&&window.fbq&&fbq("trackCustom",n,p||{})}catch(e){}};
(function(){var st=document.createElement("style");st.textContent=".wbox{margin-top:18px;background:#fff;border:1px solid #e6d8c6;border-radius:18px;padding:14px;text-align:center}.wh{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}.wh b{font-size:17px;font-weight:900;color:var(--br)}.wh span{font-size:13.5px;color:var(--muted)}.wh span b{display:inline;font-family:M,sans-serif;font-size:15px;color:#4a1b1d;letter-spacing:.04em}.wcv{position:relative;max-height:430px;overflow:hidden;border-radius:12px;box-shadow:0 8px 22px rgba(40,25,10,.18)}.wcv.full{max-height:none}#wImg{display:block;width:100%;min-height:200px;background:#1c0d0c}.wbox:not(.rdy) #wImg{opacity:.35}.wmore{position:absolute;left:0;right:0;bottom:0;height:86px;padding-top:34px;border:0;background:linear-gradient(rgba(255,255,255,0),#fff 62%);color:#4a1b1d;font:900 15px F,sans-serif;cursor:pointer}.wcv.full .wmore{display:none}.wbox .wa{margin-top:12px}.wbox .wab{font-size:15.5px}.wbt{display:flex;gap:8px;margin-top:12px}.wbt button{flex:1;height:50px;border-radius:14px;border:0;font:900 15.5px F,sans-serif;cursor:pointer}.wb1{background:#4a1b1d;color:#f3e3c2}.wb2{background:#efe3d1;color:#4a1b1d;border:1px solid #d9c3a3!important}.wnote{font-size:12.5px;color:var(--muted);margin:8px 0 2px}";document.head.appendChild(st)})();
var box=document.createElement("div");box.className="wbox";box.id="wBox";
box.innerHTML='<div class="wh"><b>🛡️ هذا كارت '+G("ضمانك","ضمانچ")+' · '+GD+' يوم</b><span>رقم الضمان <b dir="ltr">'+SN+'</b></span></div>'+
  '<div class="wcv" id="wCv"><img id="wImg" alt=""><button type="button" class="wmore" id="wMore">'+G("شوف","شوفي")+' الكارت كامل ⌄</button></div>'+
  '<div id="wSlot"></div>'+
  '<div class="wbt"><button type="button" class="wb1" id="wPdf">⬇ تحميل الكارت PDF</button><button type="button" class="wb2" id="wPng">حفظ كصورة</button></div><p class="wnote">'+G("إذا ما نزل، افتح الكارت كامل ودوس عليه مطوّل واحفظه.","إذا ما نزل، افتحي الكارت كامل ودوسي عليه مطوّل واحفظيه.")+'</p>';
c.parentNode.insertBefore(box,c.nextSibling);c.hidden=true;
document.getElementById("wMore").addEventListener("click",function(){document.getElementById("wCv").classList.add("full")});
(function(){wCard.logo=new Image();wCard.logo.src=(window.HB||"../../")+"lp/logo-light.png";
  var fl=document.fonts&&document.fonts.load?Promise.all(["900 40px F","700 40px F","500 40px F","700 40px M","600 20px M"].map(function(s){return document.fonts.load(s)})):Promise.resolve();
  var lg=new Promise(function(r){if(wCard.logo.complete)r();else{wCard.logo.onload=wCard.logo.onerror=r}});
  Promise.all([fl,lg]).catch(function(){}).then(function(){wCard(function(cv){var im=document.getElementById("wImg");im.src=cv.toDataURL("image/png");im.alt="كارت الضمان الذهبي رقم "+SN;box.classList.add("rdy");
    document.getElementById("wPdf").onclick=function(){wSave(wPdf(cv),"ضمان-الجسمي-"+SN+".pdf");trk("WarrantyCard",{f:"pdf"})};
    document.getElementById("wPng").onclick=function(){cv.toBlob(function(b){wSave(b,"ضمان-الجسمي-"+SN+".png")},"image/png");trk("WarrantyCard",{f:"png"})}})})})();
var w=document.getElementById("wa"),g=document.getElementById("waGo");
if(w&&g){/* 2026-11-25 🔒 قاعدة كل صفحات الهبوط: رسالة الواتساب بيها تفاصيل الطلب مختصرة */
  var it="معالج الشعر · "+NAMES[o.bundle]+((o.scents||[]).length?" ("+o.scents.join(" + ")+")":"")+(o.spare_head?" + راس بخاخ هدية":"")+(o.addon?" + عطر "+o.addon.name:"");
  g.href="https://wa.me/9647760060015?text="+encodeURIComponent(["هلا، هذا تأكيد طلبي من صفحة معالج الشعر ✅","رقم الطلب: "+o.order_id,"الاسم: "+(o.name||""),"الطلب: "+it,"المجموع عند الاستلام: "+money(o.total)+" د.ع (ويه التوصيل)","العنوان: "+o.governorate+" - "+o.area,"🛡️ رقم الضمان: "+SN].join("\n"));w.hidden=false;
  document.getElementById("wSlot").appendChild(w);var wp=w.querySelector("p");if(wp)wp.textContent=G("ارسل لنا على الواتساب حتى نأكد طلبك ونحفظ رقم ضمانك يمنا، وتكدر تستفاد منه بأي وقت خلال "+GD+" يوم.","ارسلي لنا على الواتساب حتى نأكد طلبچ ونحفظ رقم ضمانچ يمنا، وتكدرين تستفادين منه بأي وقت خلال "+GD+" يوم.");
  var gs=g.querySelector("svg");g.textContent="";if(gs)g.appendChild(gs);g.appendChild(document.createTextNode(G("ارسل كارت الضمان مالتك على الواتساب","ارسلي كارت الضمان مالتچ على الواتساب")));
  g.addEventListener("click",function(){try{!LOCAL&&window.fbq&&fbq("track","Contact",{content_name:"wa_confirm"})}catch(e){}})}
var key="hair_px_"+o.order_id;try{if(localStorage.getItem(key))return}catch(e){}
function fire(){if(LOCAL)return true;if(!window.fbq||!window.AJ_PIXEL)return false;
  /* المطابقة المتقدمة انطت ويا أول init بالـhead (window.AJ_AM) */
  try{fbq("track","Purchase",{value:o.px_value!=null?o.px_value:o.total,currency:o.px_cur||"IQD",content_ids:o.ids||["hair-treatment-"+o.bundle],content_type:"product",num_items:o.bundle+(o.addon?1:0)},{eventID:o.order_id});
    localStorage.setItem(key,"1")}catch(e){}return true}
if(!fire()){var t=0,iv=setInterval(function(){if(fire()||++t>20)clearInterval(iv)},250)}
})();
