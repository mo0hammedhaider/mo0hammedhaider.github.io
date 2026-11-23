/* صفحة الشكر — تعرض ملخص الطلب وتطلق Purchase مرة وحدة بنفس event_id اللي راح للسيرفر */
(function(){"use strict";
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
var key="hair_px_"+o.order_id;try{if(localStorage.getItem(key))return}catch(e){}
function fire(){if(!window.fbq||!window.AJ_PIXEL)return false;
  /* المطابقة المتقدمة انطت ويا أول init بالـhead (window.AJ_AM) */
  try{fbq("track","Purchase",{value:o.px_value!=null?o.px_value:o.total,currency:o.px_cur||"IQD",content_ids:o.ids||["hair-treatment-"+o.bundle],content_type:"product",num_items:o.bundle+(o.addon?1:0)},{eventID:o.order_id});
    localStorage.setItem(key,"1")}catch(e){}return true}
if(!fire()){var t=0,iv=setInterval(function(){if(fire()||++t>20)clearInterval(iv)},250)}
})();
