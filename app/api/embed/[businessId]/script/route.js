// Serves an embeddable JS that injects a floating chat widget iframe
import { NextResponse } from 'next/server';

export async function GET(_req, { params }) {
  const { businessId } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const js = `
(function(){
  var BID='${businessId}';
  var ORIGIN='${appUrl}';
  if(!BID||!ORIGIN){ console.error('Embed misconfigured'); return; }

  var style = document.createElement('style');
  style.innerHTML = '.bbot-btn{position:fixed;bottom:20px;right:20px;background:#111;color:#fff;border-radius:28px;padding:12px 16px;font-family:sans-serif;cursor:pointer;z-index:999999} .bbot-iframe{position:fixed;bottom:80px;right:20px;width:360px;height:520px;border:1px solid #ddd;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.15);z-index:999999;display:none} @media(max-width:480px){.bbot-iframe{width:95vw;height:70vh;right:2.5vw}}';
  document.head.appendChild(style);

  var btn = document.createElement('div'); btn.className='bbot-btn'; btn.innerText='Chat';
  var iframe = document.createElement('iframe'); iframe.className='bbot-iframe'; iframe.src=ORIGIN + '/embed/' + BID;

  btn.onclick=function(){ iframe.style.display = iframe.style.display==='none' ? 'block' : (iframe.style.display ? 'none' : 'block'); };

  document.body.appendChild(btn);
  document.body.appendChild(iframe);
})();
`;
  return new NextResponse(js, {
    status: 200,
    headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  });
}