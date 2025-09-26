export default function Rating({ value }:{ value:number }){
  const v = Math.round((value ?? 0) * 10) / 10
  return <div style={{display:'inline-flex',alignItems:'center',gap:6,fontWeight:800}}>
    <span>⭐</span><span>{v.toFixed(1)} / 10</span>
  </div>
}

