(function(){
  var cur=/azmoon/.test(location.pathname)?"ex":"rs";
  var low=cur==="rs"?116:76;
  var css='.bn{position:fixed;left:0;right:0;bottom:0;z-index:70;display:flex;background:#111;border-top:3px solid #ffc800;padding-bottom:env(safe-area-inset-bottom,0px)}'
  +'.bn a{flex:1;text-align:center;color:#bbb;text-decoration:none;font-weight:700;font-size:.78rem;padding:7px 0 6px;line-height:1.5}'
  +'.bn a span{display:block;font-size:1.35rem;line-height:1.3}.bn a.on{color:#ffc800}'
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
   +'<a href="https://www.instagram.com/gorganjob/" target="_blank" rel="noopener"><span>📷</span>گرگان جاب</a>';
  document.body.appendChild(nav);
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
      try{if(!localStorage.getItem("gj-off")){localStorage.setItem("gj-off","1");toast("✅ برنامه برای استفاده بدون اینترنت آماده شد")}}catch(e){}
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
