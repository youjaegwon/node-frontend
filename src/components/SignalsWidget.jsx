import { useEffect, useState } from "react";

function krw(n=0){
  try {
    return new Intl.NumberFormat("ko-KR",{style:"currency",currency:"KRW",maximumFractionDigits:0}).format(n);
  } catch { return `₩${Math.round(n).toLocaleString("ko-KR")}`; }
}
function pct(n=0){ return `${n>0?'+':''}${(n??0).toFixed(2)}%`; }

const CoinIcon = ({ symbol, name }) => {
  const src = symbol ? `https://coinicons-api.vercel.app/api/icon/${symbol.toLowerCase()}` : "";
  const [error, setError] = useState(false);
  if (!symbol || error) {
    const ch = (name||'?')[0]?.toUpperCase() ?? '?';
    return (
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center 
        bg-gradient-to-br from-slate-50 to-slate-200 text-slate-700 font-bold shadow-[inset_0_0_1px_rgba(0,0,0,0.06)]">
        {ch}
      </div>
    );
  }
  return (
    <img
      src={src}
      onError={() => setError(true)}
      alt={symbol}
      className="w-11 h-11 rounded-2xl object-cover border border-slate-100"
    />
  );
};

const Card = ({ item }) => {
  const up = (item.changeRate ?? 0) > 0;
  return (
    <div className="min-w-[226px] max-w-[240px] mr-3 rounded-3xl bg-white 
      border border-slate-100 shadow-[0_1px_8px_rgba(15,23,42,0.04)] p-4">
      <div className="flex items-center gap-3">
        <CoinIcon symbol={item.symbol} name={item.nameKo || item.nameEn} />
        <div className="flex-1">
          <div className="text-[16px] font-semibold text-slate-900 truncate">
            {item.nameKo || item.nameEn || item.symbol}
          </div>
          <div className="text-[12px] text-slate-400 truncate">
            {item.reason?.[0] || "지표 신호 감지"}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className={`text-[20px] font-extrabold ${up ? 'text-red-500' : 'text-blue-600'}`}>
          {pct(item.changeRate ?? 0)}
        </div>
        <div className="text-[15px] text-slate-800 mt-0.5">{krw(item.price)}</div>
      </div>

      <div className="mt-3 flex items-center text-[12px] text-slate-400">
        <span className={`${up ? 'text-red-500' : 'text-blue-600'} mr-1`}>{up ? '▲' : '▼'}</span>
        <span className="truncate">
          {(item.reason && item.reason.length>1) ? item.reason.slice(1).join(" · ") : "EMA · RSI · MACD"}
        </span>
      </div>
    </div>
  );
};

export default function SignalsWidget(){
  const [items,setItems] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    let live = true;
    (async ()=>{
      try{
        const r = await fetch("/api/signals?limit=3");
        const j = await r.json();
        if(!live) return;
        setItems(j?.items || []);
      }catch{
        if(!live) return;
        setItems([]);
      }finally{
        if(live) setLoading(false);
      }
    })();
    return ()=>{ live=false; };
  },[]);

  return (
    <section className="w-full">
      <h2 className="px-4 text-[18px] font-extrabold text-slate-900 mb-2.5">지금 주목 코인</h2>
      <div className="px-4 -mx-1">
        <div className="flex overflow-x-auto no-scrollbar">
          {loading && (
            <>
              {[0,1,2].map(k=>(
                <div key={k}
                  className="min-w-[226px] mr-3 rounded-3xl bg-white border border-slate-100 
                  shadow-[0_1px_8px_rgba(15,23,42,0.04)] p-4 animate-pulse">
                  <div className="h-11 w-11 bg-slate-100 rounded-2xl mb-3"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-slate-100 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                </div>
              ))}
            </>
          )}
          {!loading && items.map(it => <Card key={it.market || it.symbol} item={it} />)}
          {!loading && items.length===0 && (
            <div className="text-slate-400 text-sm px-4 py-8">표시할 신호가 없어요.</div>
          )}
        </div>
      </div>
    </section>
  );
}
