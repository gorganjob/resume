(function(){
  /* ====== تنظیمات آگهی‌ها ======
     اگر آگهی‌ها را در Google Sheets می‌نویسید، لینک «Publish to web (CSV)» را بین دو نقل‌قول بگذارید.
     اگر خالی باشد، آگهی‌ها از فایل news.txt داخل همین مخزن خوانده می‌شوند. */
  var SHEET_URL="";

  var P=location.pathname;
  var cur=/azmoon/.test(P)?"ex":/news/.test(P)?"nw":"rs";
  var low=cur==="rs"?116:76;
  var css='.bn{position:fixed;left:0;right:0;bottom:0;z-index:70;display:flex;background:#111;border-top:3px solid #ffc800;padding-bottom:env(safe-area-inset-bottom,0px)}'
  +'.bn a{flex:1;text-align:center;color:#bbb;text-decoration:none;font-weight:700;font-size:.74rem;padding:7px 0 6px;line-height:1.5}'
  +'.bn a span{display:block;font-size:1.3rem;line-height:1.3;position:relative}.bn a.on{color:#ffc800}'
  +'.bn .bg{position:absolute;top:-2px;right:calc(50% - 22px);background:#e5484d;color:#fff;border-radius:10px;min-width:18px;height:18px;font-size:.62rem;font-weight:800;line-height:18px;padding:0 4px}'
  +'.inexam .bn,.inexam .ib{display:none}'
  +'body{padding-bottom:calc('+(cur==="rs"?130:90)+'px + env(safe-area-inset-bottom,0px)) !important}'
  +'.tk{bottom:calc(62px + env(safe-area-inset-bottom,0px)) !important;padding-bottom:9px !important}'
  +'.ib{position:fixed;left:12px;right:12px;bottom:calc('+low+'px + env(safe-area-inset-bottom,0px));z-index:65;background:#ffc800;color:#111;border-radius:16px;padding:12px 14px;display:flex;gap:10px;align-items:center;font-weight:700;font-size:.9rem;line-height:1.7;box-shadow:0 8px 24px rgba(0,0,0,.3)}'
  +'.ib span{flex:1}.ib button{font:inherit;border:0;border-radius:12px;padding:8px 14px;background:#111;color:#ffc800;font-weight:800;cursor:pointer}'
  +'.ib .x{background:transparent;color:#111;font-size:1.2rem;padding:4px 8px}'
  +'.ts{position:fixed;left:50%;transform:translate(-50%,20px);bottom:calc(150px + env(safe-area-inset-bottom,0px));background:#111;color:#ffc800;border:2px solid #ffc800;border-radius:14px;padding:10px 18px;font-weight:700;font-size:.88rem;line-height:1.7;z-index:80;opacity:0;pointer-events:none;transition:.3s;max-width:90%;text-align:center}.ts.show{opacity:1;transform:translate(-50%,0)}';
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  var nav=document.createElement("nav");nav.className="bn";
  nav.innerHTML='<a href="index.html"'+(cur==="rs"?' class="on"':'')+'><span>📄</span>رزومه‌ساز</a>'
   +'<a href="azmoon.html"'+(cur==="ex"?' class="on"':'')+'><span>📝</span>آزمون‌ها</a>'
   +'<a href="news.html"'+(cur==="nw"?' class="on"':'')+'><span>📢<b class="bg" id="nbg" style="display:none"></b></span>آگهی‌ها</a>'
   +'<a href="https://www.instagram.com/gorganjob/" target="_blank" rel="noopener"><span>📷</span>گرگان جاب</a>';
  document.body.appendChild(nav);

  /* ====== آگهی‌ها (مشترک بین همه صفحه‌ها) ====== */
  function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function toEn(s){return String(s).replace(/[۰-۹]/g,function(d){return "۰۱۲۳۴۵۶۷۸۹".indexOf(d)}).replace(/[٠-٩]/g,function(d){return "٠١٢٣٤٥٦٧٨٩".indexOf(d)})}
  function j2g(jy,jm,jd){
    var gy,gd,gm,days,sal;jy+=1595;
    days=-355668+(365*jy)+(~~(jy/33))*8+~~(((jy%33)+3)/4)+jd+((jm<7)?(jm-1)*31:((jm-7)*30)+186);
    gy=400*~~(days/146097);days%=146097;
    if(days>36524){gy+=100*~~(--days/36524);days%=36524;if(days>=365)days++}
    gy+=4*~~(days/1461);days%=1461;
    if(days>365){gy+=~~((days-1)/365);days=(days-1)%365}
    gd=days+1;sal=[0,31,((gy%4===0&&gy%100!==0)||(gy%400===0))?29:28,31,30,31,30,31,31,30,31,30,31];
    for(gm=0;gm<13&&gd>sal[gm];gm++)gd-=sal[gm];
    return [gy,gm,gd];
  }
  function dateTime(d){
    d=toEn(d).trim();var m=d.match(/^(1[34]\d\d)[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
    if(m){var g=j2g(+m[1],+m[2],+m[3]);return new Date(g[0],g[1]-1,g[2],12).getTime()}
    var t=Date.parse(d);return isNaN(t)?0:t;
  }
  function norm(o){
    var d=String(o.d||o.date||o["تاریخ"]||"").trim();
    return {d:d,time:dateTime(d),t:String(o.t||o.title||o["عنوان"]||"").trim(),b:String(o.b||o.body||o["متن"]||"").trim(),u:String(o.u||o.link||o["لینک"]||"").trim(),g:String(o.g||o.tag||o["برچسب"]||"").trim()};
  }
  function parseLines(text){
    var out=[];text.split(/\r?\n/).forEach(function(l){
      l=l.trim();if(l.charAt(0)!=="{")return;
      try{var n=norm(JSON.parse(l));if(n.t)out.push(n)}catch(e){}
    });return out;
  }
  function parseCSV(text){
    var rows=[],row=[],f="",q=false,i,c;
    for(i=0;i<text.length;i++){c=text.charAt(i);
      if(q){if(c==='"'){if(text.charAt(i+1)==='"'){f+='"';i++}else q=false}else f+=c}
      else if(c==='"')q=true;
      else if(c===","){row.push(f);f=""}
      else if(c==="\n"||c==="\r"){if(c==="\r"&&text.charAt(i+1)==="\n")i++;row.push(f);f="";rows.push(row);row=[]}
      else f+=c}
    if(f!==""||row.length){row.push(f);rows.push(row)}
    if(rows.length<2)return [];
    var h=rows[0].map(function(x){return x.trim().toLowerCase()});
    return rows.slice(1).map(function(r){var o={};h.forEach(function(k,j){o[k]=r[j]||""});return norm(o)}).filter(function(n){return n.t});
  }
  function fetchText(u){
    return fetch(u+(u.indexOf("?")>-1?"&":"?")+"t="+Date.now(),{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.text()});
  }
  function sortItems(a){return a.map(function(x,i){x.i=i;return x}).sort(function(x,y){return y.time-x.time||x.i-y.i})}
  var GJNews={
    load:function(cb){
      var cached=[];try{cached=JSON.parse(lsGet("gj-news")||"[]")}catch(e){}
      if(cached.length)cb(cached,"cache");
      var p=SHEET_URL?fetchText(SHEET_URL).then(parseCSV).catch(function(){return fetchText("news.txt").then(parseLines)}):fetchText("news.txt").then(parseLines);
      p.then(function(items){items=sortItems(items);lsSet("gj-news",JSON.stringify(items));cb(items,"net")}).catch(function(){cb(cached,"fail")});
    },
    seen:function(){var s=+lsGet("gj-news-seen")||0;return s||Date.now()-7*864e5},
    unseen:function(items){var s=GJNews.seen();return items.filter(function(x){return x.time>s}).length},
    markSeen:function(items){var m=0;items.forEach(function(x){if(x.time>m)m=x.time});lsSet("gj-news-seen",String(Math.max(m,Date.now()-1)))}
  };
  window.GJNews=GJNews;
  function badge(items){
    var b=document.getElementById("nbg");if(!b||cur==="nw")return;
    var n=GJNews.unseen(items);b.style.display=n?"inline-block":"none";b.textContent=n>9?"+۹":String(n).replace(/\d/g,function(d){return "۰۱۲۳۴۵۶۷۸۹"[d]});
  }
  if(cur!=="nw")GJNews.load(function(items){badge(items)});

  /* ====== پیام‌ها، آفلاین و نصب ====== */
  if("serviceWorker" in navigator&&location.protocol!=="file:"){
    window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});
  }
  var te=null;
  function toast(m){
    if(!te){te=document.createElement("div");te.className="ts";document.body.appendChild(te)}
    te.textContent=m;te.classList.add("show");clearTimeout(toast.t);
    toast.t=setTimeout(function(){te.classList.remove("show")},4000);
  }
  window.addEventListener("offline",function(){toast("📴 آفلاین هستید؛ رزومه‌ساز و همه آزمون‌ها کار می‌کنند")});
  window.addEventListener("online",function(){toast("✅ دوباره آنلاین شدید")});
  window.addEventListener("load",function(){if(!navigator.onLine)toast("📴 آفلاین هستید؛ رزومه‌ساز و همه آزمون‌ها کار می‌کنند")});
  if("serviceWorker" in navigator&&location.protocol!=="file:"){
    navigator.serviceWorker.ready.then(function(){
      if(!lsGet("gj-off")){lsSet("gj-off","1");toast("✅ برنامه برای استفاده بدون اینترنت آماده شد")}
    });
  }
  document.addEventListener("click",function(ev){
    var a=ev.target.closest&&ev.target.closest("a[href]");
    if(a&&/instagram\.com/.test(a.href)&&!navigator.onLine){ev.preventDefault();toast("برای باز شدن اینستاگرام به اینترنت نیاز است")}
  });
  var standalone=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||window.navigator.standalone;
  function dismissed(){try{return sessionStorage.getItem("gj-ib")==="1"}catch(e){return false}}
  function banner(msg,btn,fn){
    if(standalone||dismissed()||document.querySelector(".ib"))return;
    var d=document.createElement("div");d.className="ib";
    d.innerHTML='<span>'+msg+'</span>'+(btn?'<button class="go">'+btn+'</button>':'')+'<button class="x" aria-label="بستن">✕</button>';
    document.body.appendChild(d);
    function close(){d.remove();try{sessionStorage.setItem("gj-ib","1")}catch(e){}}
    d.querySelector(".x").onclick=close;
    if(btn)d.querySelector(".go").onclick=function(){fn();d.remove()};
  }
  var dp=null;
  window.addEventListener("beforeinstallprompt",function(e){
    e.preventDefault();dp=e;
    banner("📲 گرگان جاب را مثل یک اپ روی گوشی نصب کنید","نصب",function(){dp.prompt()});
  });
  window.addEventListener("appinstalled",function(){var b=document.querySelector(".ib");if(b)b.remove()});
  if(/iphone|ipad|ipod/i.test(navigator.userAgent)&&!standalone){
    setTimeout(function(){banner("📲 برای نصب اپ: دکمه اشتراک‌گذاری (Share) را بزنید و گزینه Add to Home Screen را انتخاب کنید")},3000);
  }
})();
