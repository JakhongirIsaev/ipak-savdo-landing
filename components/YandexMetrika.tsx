import Script from "next/script";

// Client-side Yandex Metrika tag. The live counter for birliy.uz is 109921799,
// hardcoded as the default so tracking works on deploy without extra config;
// override with NEXT_PUBLIC_YANDEX_METRIKA_ID if the counter ever changes.
// Same load pattern as components/Analytics.tsx (GA). Yandex matters here
// because a large share of the Uzbek / Russian-speaking audience uses Yandex.
const COUNTER_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "109921799";

export function YandexMetrika() {
  const id = COUNTER_ID;
  if (!id) return null;
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${id}","ym");ym(${id},"init",{ssr:true,webvisor:true,clickmap:true,accurateTrackBounce:true,trackLinks:true});`}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
