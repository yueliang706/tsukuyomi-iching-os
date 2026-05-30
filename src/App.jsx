import { useState, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════
//  八卦データ
// ══════════════════════════════════════════════
const TRIGRAMS = {
  乾:{symbol:"☰",lines:[1,1,1],element:"天",nature:"剛健",color:"#c8a84b",family:"父",direction:"西北"},
  坤:{symbol:"☷",lines:[0,0,0],element:"地",nature:"柔順",color:"#7ab87a",family:"母",direction:"西南"},
  震:{symbol:"☳",lines:[0,0,1],element:"雷",nature:"動",  color:"#6aace0",family:"長男",direction:"東"},
  巽:{symbol:"☴",lines:[1,1,0],element:"風",nature:"入",  color:"#90c890",family:"長女",direction:"東南"},
  坎:{symbol:"☵",lines:[0,1,0],element:"水",nature:"陥",  color:"#5080c8",family:"中男",direction:"北"},
  離:{symbol:"☲",lines:[1,0,1],element:"火",nature:"麗",  color:"#d06050",family:"中女",direction:"南"},
  艮:{symbol:"☶",lines:[1,0,0],element:"山",nature:"止",  color:"#b09070",family:"少男",direction:"東北"},
  兌:{symbol:"☱",lines:[0,1,1],element:"沢",nature:"悦",  color:"#70c0c0",family:"少女",direction:"西"},
};

// ══════════════════════════════════════════════
//  卦ビジュアルSVG（山水画風）
// ══════════════════════════════════════════════
function HexLines({lines,size=56,color="#c8a84b"}){
  const lh=size*.1,gap=size*.065,w=size;
  return <svg width={w} height={6*lh+5*gap} style={{display:"block",color}}>
    {[...lines].reverse().map((l,i)=>{
      const y=i*(lh+gap);
      return l===1
        ?<rect key={i} x={0} y={y} width={w} height={lh} fill="currentColor" rx={1}/>
        :<g key={i}><rect x={0} y={y} width={w*.42} height={lh} fill="currentColor" rx={1}/><rect x={w*.58} y={y} width={w*.42} height={lh} fill="currentColor" rx={1}/></g>;
    })}
  </svg>;
}

function TriLines({lines,size=26,color}){
  const lh=size*.13,gap=size*.09,w=size;
  return <svg width={w} height={3*lh+2*gap} style={{display:"block",color}}>
    {[...lines].reverse().map((l,i)=>{
      const y=i*(lh+gap);
      return l===1
        ?<rect key={i} x={0} y={y} width={w} height={lh} fill="currentColor" rx={1}/>
        :<g key={i}><rect x={0} y={y} width={w*.42} height={lh} fill="currentColor" rx={1}/><rect x={w*.58} y={y} width={w*.42} height={lh} fill="currentColor" rx={1}/></g>;
    })}
  </svg>;
}

// 山水画シーンSVG
function SanshuiScene({trigram,w=540,h=220}){
  const c=TRIGRAMS[trigram]?.color||"#c8a84b";
  const W=w,H=h;

  const Figure=({x,y,op=0.9})=>(
    <g transform={`translate(${x},${y})`} opacity={op}>
      <ellipse cx={0} cy={-30} rx={5} ry={6} fill="#111"/>
      <path d="M0,-24 L-9,2 L9,2 Z" fill="#111"/>
      <line x1={-9} y1={2} x2={-13} y2={20} stroke="#111" strokeWidth={3}/>
      <line x1={9} y1={2} x2={13} y2={20} stroke="#111" strokeWidth={3}/>
      <line x1={9} y1={-8} x2={20} y2={-2} stroke="#111" strokeWidth={2}/>
      <rect x={17} y={-5} width={7} height={9} rx={1} fill={c} opacity={0.6}/>
      <ellipse cx={20} cy={0} rx={7} ry={7} fill={c} opacity={0.15}/>
    </g>
  );
  const Mist=({cy,op=0.2})=>(
    <ellipse cx={W*.5} cy={cy} rx={W*.5} ry={H*.05} fill="white" opacity={op}/>
  );
  const Pine=({x,y,s=1,op=0.9})=>(
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
      <rect x={-3} y={0} width={6} height={36} fill="#111"/>
      <polygon points={`0,-60 -22,0 22,0`} fill="#0d0d0d"/>
      <polygon points={`0,-76 -16,-20 16,-20`} fill="#111"/>
      <polygon points={`0,-90 -11,-40 11,-40`} fill="#141414"/>
    </g>
  );

  // 乾：天・星・断崖
  if(trigram==="乾") return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs><radialGradient id="sk1" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#1a1a2e"/><stop offset="100%" stopColor="#0a0a14"/></radialGradient></defs>
      <rect width={W} height={H} fill="url(#sk1)"/>
      {Array.from({length:55},(_,i)=><circle key={i} cx={(i*137.5%97)/97*W} cy={(i*73.1%75)/100*H} r={i%9===0?1.4:.55} fill="white" opacity={.14+(i*31%10)*.07}/>)}
      <circle cx={W*.72} cy={H*.25} r={22} fill={c} opacity={.12}/>
      <circle cx={W*.72} cy={H*.25} r={12} fill={c} opacity={.3}/>
      <path d={`M0,${H} L0,${H*.5} L${W*.12},${H*.3} L${W*.22},${H*.42} L${W*.3},${H*.22} L${W*.38},${H*.36} L${W*.42},${H} Z`} fill="#141620"/>
      <path d={`M${W*.6},${H} L${W*.6},${H*.45} L${W*.7},${H*.28} L${W*.8},${H*.4} L${W*.88},${H*.2} L${W*.95},${H*.33} L${W},${H*.27} L${W},${H} Z`} fill="#10121a"/>
      <Mist cy={H*.52} op={.08}/>
      <Figure x={W*.3} y={H*.44}/>
    </svg>
  );

  // 坤：大平原・霧
  if(trigram==="坤") return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <rect width={W} height={H} fill="#0c1008"/>
      <path d={`M0,${H*.55} Q${W*.25},${H*.48} ${W*.5},${H*.53} Q${W*.75},${H*.58} ${W},${H*.5} L${W},${H} L0,${H} Z`} fill="#131a0e"/>
      <path d={`M0,${H*.7} Q${W*.4},${H*.64} ${W*.65},${H*.72} Q${W*.82},${H*.78} ${W},${H*.66} L${W},${H} L0,${H} Z`} fill="#0f1509"/>
      <Mist cy={H*.54} op={.18}/><Mist cy={H*.65} op={.12}/>
      <g opacity={.75}><rect x={W*.08-3} y={H*.38} width={5} height={H*.23} fill="#111"/><line x1={W*.08} y1={H*.44} x2={W*.08-20} y2={H*.34} stroke="#111" strokeWidth={3}/><line x1={W*.08} y1={H*.44} x2={W*.08+18} y2={H*.36} stroke="#111" strokeWidth={2.5}/></g>
      <g opacity={.7}><rect x={W*.88-3} y={H*.4} width={5} height={H*.2} fill="#111"/><line x1={W*.88} y1={H*.45} x2={W*.88-16} y2={H*.33} stroke="#111" strokeWidth={2.5}/></g>
      <Figure x={W*.5} y={H*.68}/>
    </svg>
  );

  // 震：稲妻・嵐
  if(trigram==="震") return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <rect width={W} height={H} fill="#06070e"/>
      {[.12,.38,.62,.88].map((x,i)=><ellipse key={i} cx={W*x} cy={H*.18} rx={70+i*18} ry={26} fill="#12141f" opacity={.9}/>)}
      <polyline points={`${W*.53},0 ${W*.47},${H*.3} ${W*.53},${H*.32} ${W*.43},${H*.62} ${W*.49},${H*.64} ${W*.41},${H}`} fill="none" stroke="white" strokeWidth={3} opacity={.4}/>
      <polyline points={`${W*.53},0 ${W*.47},${H*.3} ${W*.53},${H*.32} ${W*.43},${H*.62} ${W*.49},${H*.64} ${W*.41},${H}`} fill="none" stroke={c} strokeWidth={2} opacity={.9}/>
      <ellipse cx={W*.46} cy={H*.62} rx={55} ry={18} fill={c} opacity={.09}/>
      <path d={`M0,${H*.74} L${W*.14},${H*.67} L${W*.3},${H*.76} L${W*.5},${H*.7} L${W*.72},${H*.78} L${W},${H*.71} L${W},${H} L0,${H} Z`} fill="#0d0f16"/>
      <Pine x={W*.14} y={H*.72} s={.55} op={.5}/><Pine x={W*.84} y={H*.72} s={.6} op={.5}/>
      <Figure x={W*.5} y={H*.74} op={.78}/>
    </svg>
  );

  // 巽：竹林・霧
  if(trigram==="巽") return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <rect width={W} height={H} fill="#040a06"/>
      <path d={`M0,${H*.58} Q${W*.3},${H*.5} ${W*.6},${H*.56} Q${W*.8},${H*.6} ${W},${H*.52} L${W},${H} L0,${H} Z`} fill="#080e08"/>
      {[.07,.16,.26,.36,.54,.64,.73,.83,.92].map((x,i)=>{
        const lean=(i%3-1)*9,bh=H*(.42+(i*13%10)*.03);
        return <g key={i} opacity={.73+(i*7%3)*.09}>
          <line x1={W*x} y1={H*.58} x2={W*x+lean} y2={H*.58-bh} stroke="#0d1a0e" strokeWidth={6}/>
          <line x1={W*x} y1={H*.58} x2={W*x+lean} y2={H*.58-bh} stroke="#162414" strokeWidth={2}/>
          <ellipse cx={W*x+lean+(i%2-.5)*10} cy={H*.58-bh+6} rx={16} ry={6} fill="#0c1a0e" transform={`rotate(${-22+i*8},${W*x+lean},${H*.58-bh})`} opacity={.9}/>
        </g>;
      })}
      <Mist cy={H*.57} op={.2}/><Mist cy={H*.66} op={.14}/>
      <Figure x={W*.5} y={H*.63} op={.82}/>
    </svg>
  );

  // 坎：渓谷・滝
  if(trigram==="坎") return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <rect width={W} height={H} fill="#03060e"/>
      <path d={`M0,${H} L0,${H*.42} L${W*.1},${H*.24} L${W*.2},${H*.36} L${W*.28},${H*.15} L${W*.38},${H*.28} L${W*.42},${H} Z`} fill="#08101c"/>
      <path d={`M${W*.58},${H} L${W*.58},${H*.3} L${W*.66},${H*.1} L${W*.74},${H*.25} L${W*.83},${H*.07} L${W*.92},${H*.2} L${W},${H*.15} L${W},${H} Z`} fill="#060e1a"/>
      <Mist cy={H*.38} op={.2}/><Mist cy={H*.5} op={.14}/>
      <path d={`M${W*.42},${H*.28} Q${W*.44},${H*.45} ${W*.43},${H*.58} Q${W*.42},${H*.7} ${W*.45},${H}`} fill="none" stroke="white" strokeWidth={5} opacity={.1}/>
      <path d={`M0,${H*.74} Q${W*.5},${H*.7} ${W},${H*.74} L${W},${H} L0,${H} Z`} fill="#07121e" opacity={.9}/>
      <Pine x={W*.1} y={H*.5} s={.5}/><Pine x={W*.9} y={H*.44} s={.6}/>
      <Figure x={W*.5} y={H*.75}/>
    </svg>
  );

  // 離：篝火・夜の峰
  if(trigram==="離") return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs><radialGradient id="fg2" cx="50%" cy="68%" r="50%"><stop offset="0%" stopColor="#1e0804"/><stop offset="100%" stopColor="#050202" stopOpacity="0"/></radialGradient></defs>
      <rect width={W} height={H} fill="#060202"/>
      {Array.from({length:25},(_,i)=><circle key={i} cx={(i*137.5%100)/100*W} cy={(i*61.8%55)/100*H} r={.6} fill="white" opacity={.09+(i*7%7)*.04}/>)}
      <path d={`M0,${H*.58} L${W*.18},${H*.34} L${W*.35},${H*.52} L${W*.5},${H*.25} L${W*.65},${H*.46} L${W*.82},${H*.3} L${W},${H*.48} L${W},${H} L0,${H} Z`} fill="#140806"/>
      <rect width={W} height={H} fill="url(#fg2)"/>
      <path d={`M${W*.5},${H*.87} Q${W*.46},${H*.71} ${W*.5},${H*.57} Q${W*.55},${H*.44} ${W*.5},${H*.48} Q${W*.44},${H*.57} ${W*.5},${H*.7} Q${W*.55},${H*.77} ${W*.5},${H*.87} Z`} fill={c} opacity={.4}/>
      <ellipse cx={W*.5} cy={H*.77} rx={85} ry={28} fill={c} opacity={.11}/>
      <line x1={W*.42} y1={H*.87} x2={W*.58} y2={H*.87} stroke="#1c0a04" strokeWidth={5}/>
      <Figure x={W*.5} y={H*.84}/>
    </svg>
  );

  // 艮：霞山水（メイン）
  if(trigram==="艮") return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <rect width={W} height={H} fill="#0a0c10"/>
      <path d={`M0,${H*.72} L${W*.14},${H*.52} L${W*.28},${H*.62} L${W*.42},${H*.42} L${W*.56},${H*.58} L${W*.7},${H*.4} L${W*.84},${H*.54} L${W},${H*.44} L${W},${H} L0,${H} Z`} fill="#0e1220" opacity={.55}/>
      <path d={`M0,${H*.8} L${W*.16},${H*.6} L${W*.3},${H*.72} L${W*.46},${H*.52} L${W*.62},${H*.66} L${W*.76},${H*.47} L${W*.9},${H*.6} L${W},${H*.52} L${W},${H} L0,${H} Z`} fill="#0c1018"/>
      <path d={`M${W*.22},${H} L${W*.3},${H*.68} L${W*.38},${H*.57} L${W*.44},${H*.44} L${W*.5},${H*.12} L${W*.56},${H*.44} L${W*.62},${H*.57} L${W*.7},${H*.65} L${W*.78},${H} Z`} fill="#09090e"/>
      <Mist cy={H*.44} op={.26}/><Mist cy={H*.57} op={.2}/><Mist cy={H*.68} op={.15}/>
      <Pine x={W*.07} y={H*.78} s={.82}/><Pine x={W*.12} y={H*.81} s={.52}/><Pine x={W*.88} y={H*.74} s={.88}/><Pine x={W*.93} y={H*.78} s={.56}/>
      <path d={`M0,${H*.84} Q${W*.5},${H*.8} ${W},${H*.84} L${W},${H} L0,${H} Z`} fill="#07101a" opacity={.7}/>
      <Figure x={W*.5} y={H*.82}/>
    </svg>
  );

  // 兌：月光の湖
  if(trigram==="兌") return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <rect width={W} height={H} fill="#04080c"/>
      {Array.from({length:30},(_,i)=><circle key={i} cx={(i*113.7%100)/100*W} cy={(i*79.1%50)/100*H} r={.65} fill="white" opacity={.09+(i*11%8)*.04}/>)}
      <circle cx={W*.7} cy={H*.22} r={21} fill="white" opacity={.09}/><circle cx={W*.7} cy={H*.22} r={14} fill="white" opacity={.09}/><circle cx={W*.75} cy={H*.18} r={12} fill="#04080c"/>
      <path d={`M0,${H*.64} L${W*.12},${H*.47} L${W*.22},${H*.55} L${W*.32},${H*.37} L${W*.42},${H*.51} L${W*.5},${H*.59} L${W*.58},${H*.51} L${W*.68},${H*.37} L${W*.78},${H*.53} L${W*.88},${H*.32} L${W*.95},${H*.44} L${W},${H*.38} L${W},${H} L0,${H} Z`} fill="#08101c"/>
      <ellipse cx={W*.5} cy={H*.63} rx={W*.5} ry={H*.05} fill="white" opacity={.17}/>
      <path d={`M0,${H*.75} Q${W*.5},${H*.71} ${W},${H*.75} L${W},${H} L0,${H} Z`} fill="#060f18" opacity={.95}/>
      <path d={`M${W*.62},${H*.75} Q${W*.7},${H*.79} ${W*.78},${H*.75} Q${W*.74},${H*.88} ${W*.7},${H}`} fill="none" stroke="white" strokeWidth={14} opacity={.04}/>
      {Array.from({length:4},(_,i)=>{const y=H*(.77+i*.05);const pts=Array.from({length:12},(_,j)=>`${j*W/11},${y+Math.sin(j*1.8+i)*4}`).join(" ");return <polyline key={i} points={pts} fill="none" stroke="white" strokeWidth={.8} opacity={.05+i*.02}/>;})}
      <Figure x={W*.35} y={H*.75} op={.84}/>
    </svg>
  );

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <rect width={W} height={H} fill="#0c0e18"/>
      <path d={`M0,${H} L${W*.2},${H*.5} L${W*.5},${H*.18} L${W*.8},${H*.5} L${W},${H} Z`} fill={c} opacity={.1}/>
      <Mist cy={H*.55} op={.16}/>
      <Figure x={W*.5} y={H*.66}/>
    </svg>
  );
}


// ══════════════════════════════════════════════
//  64卦データ
// ══════════════════════════════════════════════
const HEXAGRAMS = [
  {num:1,name:"乾為天",kanji:"乾",en:"The Creative",lines:[1,1,1,1,1,1],upper:"乾",lower:"乾",keyword:"創造・天・剛健",guaci:"元いに亨り、貞に利し。",tuan:"大いなる哉、乾元。万物これに資りて始まる。",xiang:"天行は健なり。君子以て自ら彊めて息まず。",yaoci:[{line:"初九",text:"潜龍、勿れ用いよ。",comment:"まだ時ではない。力を蓄えよ。"},{line:"九二",text:"見龍、田に在り。大人を見るに利し。",comment:"才能が現れ始める。師を求めよ。"},{line:"九三",text:"君子は終日乾乾として咎なし。",comment:"たゆまず努力し、夜も省みよ。"},{line:"九四",text:"或いは躍りて淵に在り。咎なし。",comment:"進むか待つか。誠実であれば咎なし。"},{line:"九五",text:"飛龍、天に在り。大人を見るに利し。",comment:"最高の時。力を存分に発揮せよ。"},{line:"上九",text:"亢龍、悔いあり。",comment:"高みに上りすぎた龍は後悔する。謙虚に。"}],meaning:"純粋な陽の力の極み。六つの陽爻が重なり天の創造力を象徴する。",advice:"今は強く前進できる時。ただし驕りを戒め、謙虚さを保て。",history:"乾は易経第一卦。「元亨利貞」の四徳は儒教の核心となった。"},
  {num:2,name:"坤為地",kanji:"坤",en:"The Receptive",lines:[0,0,0,0,0,0],upper:"坤",lower:"坤",keyword:"受容・地・柔順",guaci:"元いに亨り、牝馬の貞に利し。",tuan:"至れる哉、坤元。万物これに資りて生まれ、天に順う。",xiang:"地勢は坤なり。君子以て厚徳もって物を載す。",yaoci:[{line:"初六",text:"霜を履めば堅冰至る。",comment:"小さな兆しに気づけ。"},{line:"六二",text:"直方大、習わずして利ならざるなし。",comment:"天性の徳を発揮せよ。"},{line:"六三",text:"章を含みて以て貞なれば可なり。",comment:"才能を内に秘め、誠実であれ。"},{line:"六四",text:"袋を括る。咎なし、誉れなし。",comment:"慎重に口を閉じ行動を控えよ。"},{line:"六五",text:"黄裳、元吉。",comment:"中庸の徳。最高の吉。"},{line:"上六",text:"龍、野に戦う。",comment:"陰が本分を超えて争えば双方傷つく。"}],meaning:"純粋な陰の力。大地のように万物を支え育む。",advice:"今は従う時。主導を求めず、着実に育む役割を担え。",history:"坤は乾と対をなす陰の根本。老子の柔弱思想とも響き合う。"},
  {num:3,name:"水雷屯",kanji:"屯",lines:[0,1,0,0,0,1],upper:"坎",lower:"震",keyword:"困難な始まり・忍耐",guaci:"元いに亨り、貞に利し。",tuan:"屯は剛柔始めて交わりて難生ず。",xiang:"雲雷は屯なり。",yaoci:[],meaning:"草木が大地を突き破ろうとする発芽の困難。",advice:"独力で突破しようとするな。信頼できる人に助けを求めよ。",history:"屯は「難しい始まり」の象徴。"},
  {num:4,name:"山水蒙",kanji:"蒙",lines:[0,1,0,0,1,0],upper:"艮",lower:"坎",keyword:"啓蒙・学び・師",guaci:"亨る。初筮は告ぐ。",tuan:"蒙は山下に険あり。",xiang:"山下に泉出ずるは蒙なり。",yaoci:[],meaning:"山の下に泉が湧く。若者の無知は可能性の源。",advice:"師を敬い、素直な心で学べ。",history:"蒙は「啓蒙」の語源。"},
  {num:5,name:"水天需",kanji:"需",lines:[0,1,0,1,1,1],upper:"坎",lower:"乾",keyword:"待機・時機",guaci:"孚あり。光いに亨り、貞吉。",tuan:"需は須つなり。",xiang:"雲天の上に升るは需なり。",yaoci:[],meaning:"天の上に雲が集まるが、まだ雨は降らない。",advice:"焦るな。誠実に待てば必ず時は来る。",history:"需は「待つ」の意。"},
  {num:6,name:"天水訟",kanji:"訟",lines:[1,1,1,0,1,0],upper:"乾",lower:"坎",keyword:"争い・和解",guaci:"孚あり、窒がる。惕れて中は吉。",tuan:"訟は上剛下険。",xiang:"天と水は違行するは訟なり。",yaoci:[],meaning:"天と水が逆方向に流れる。真実があっても障害に阻まれる。",advice:"争いは拡大させるな。和解の道を探せ。",history:"訟は「訴訟」の語源。"},
  {num:7,name:"地水師",kanji:"師",lines:[0,0,0,0,1,0],upper:"坤",lower:"坎",keyword:"軍隊・統率",guaci:"貞。丈人なれば吉。",tuan:"師は衆なり。",xiang:"地中に水あるは師なり。",yaoci:[],meaning:"民衆の支持を得た指導者のみが軍を率いられる。",advice:"力だけでなく民の信頼を得よ。",history:"師は中国古代の軍事思想を反映。"},
  {num:8,name:"水地比",kanji:"比",lines:[0,1,0,0,0,0],upper:"坎",lower:"坤",keyword:"親しむ・絆",guaci:"吉。後夫は凶。",tuan:"比は吉なり。",xiang:"地上に水あるは比なり。",yaoci:[],meaning:"水が大地に寄り添う。人々が自然に中心人物に集まる。",advice:"遅れずに正しい仲間に帰属せよ。",history:"比は「隣比」の語源。"},
  {num:9,name:"風天小畜",kanji:"小畜",lines:[1,1,0,1,1,1],upper:"巽",lower:"乾",keyword:"小さな制約・蓄積",guaci:"亨る。密雲して雨ふらず。",tuan:"小畜は柔得て位す。",xiang:"風行りて天の上にあるは小畜なり。",yaoci:[],meaning:"風が天の上を渡るが雨はまだ降らない。",advice:"大きな前進より小さな徳の蓄積を。",history:"小畜は「小さく蓄える」の意。"},
  {num:10,name:"天沢履",kanji:"履",lines:[1,1,1,0,1,1],upper:"乾",lower:"兌",keyword:"礼・虎の尾",guaci:"虎尾を履む。人を咥わず。亨る。",tuan:"履は柔剛を踏む。",xiang:"上天下沢は履なり。",yaoci:[],meaning:"虎の尾を踏むような危険な状況。礼節と誠実さがあれば虎は噛まない。",advice:"礼節を守れ。誠実に行動すれば危険も乗り越えられる。",history:"履は礼の基礎。「履行」の語源。"},
  {num:11,name:"地天泰",kanji:"泰",en:"Peace",lines:[0,0,0,1,1,1],upper:"坤",lower:"乾",keyword:"平和・繁栄",guaci:"小往き大来たる。吉いに亨る。",tuan:"天地交わりて万物通ず。",xiang:"天地交わるは泰なり。",yaoci:[{line:"初九",text:"茅を抜くに茹たり。征けば吉。",comment:"同類を引き連れて前進すれば吉。"},{line:"九二",text:"荒を包み、馮河を用い。",comment:"広く包容し、果敢に進め。"},{line:"九三",text:"平は陂なく、往は復なし。",comment:"変化を受け入れ誠実であれ。"},{line:"六四",text:"翩翩として富まず。",comment:"富を誇らず、心の誠実さで交わる。"},{line:"六五",text:"帝乙は妹を帰す。元吉。",comment:"謙虚に降嫁することで大いに吉。"},{line:"上六",text:"城、隍に復す。師を用いるなかれ。",comment:"繁栄の後には衰退。武力では回復できない。"}],meaning:"天地が交わり万物が通じる平和と繁栄の極み。",advice:"繁栄の時こそ油断するな。謙虚に大局を見渡して民を助けよ。",history:"泰は太平の代名詞。"},
  {num:12,name:"天地否",kanji:"否",lines:[1,1,1,0,0,0],upper:"乾",lower:"坤",keyword:"否塞・停滞",guaci:"否之匪人。大往小来。",tuan:"天地交わらずして万物通ぜず。",xiang:"天地交わらざるは否なり。",yaoci:[],meaning:"天地が離れて交わらない閉塞の時代。",advice:"無理に抵抗せず、徳を内に蓄えよ。否の後には必ず泰が来る。",history:"否は泰の反対。"},
  {num:13,name:"天火同人",kanji:"同人",lines:[1,1,1,0,1,1],upper:"乾",lower:"離",keyword:"同志・連帯",guaci:"野に人に同じうす。亨る。",tuan:"同人は柔得て位す。",xiang:"天と火と同人なり。",yaoci:[],meaning:"天と火が共に輝く。人々が広野で連帯する。",advice:"身内だけの結束は小吉。広く野に出て同志を求めよ。",history:"同人は連帯と協力の哲学。"},
  {num:14,name:"火天大有",kanji:"大有",lines:[0,1,1,1,1,1],upper:"離",lower:"乾",keyword:"大いなる豊かさ",guaci:"元いに亨る。",tuan:"大有は柔得て尊位す。",xiang:"火の天上にあるは大有なり。",yaoci:[],meaning:"太陽が天高く輝き万物を照らす。大いなる豊かさの時。",advice:"豊かさの中にこそ謙虚さを。",history:"大有は所有と繁栄の極み。"},
  {num:15,name:"地山謙",kanji:"謙",en:"Modesty",lines:[0,0,0,1,0,0],upper:"坤",lower:"艮",keyword:"謙虚・成功の秘訣",guaci:"亨る。君子は有終あり。",tuan:"天道は盈を虧き謙に益す。",xiang:"地中に山あるは謙なり。",yaoci:[{line:"初六",text:"謙謙たる君子。吉。",comment:"謙虚の上に謙虚。大事業も成し遂げられる。"},{line:"六二",text:"鳴謙。貞吉。",comment:"謙虚さが自然に広まる。"},{line:"九三",text:"労謙たる君子。有終あり。吉。",comment:"功労があっても謙虚な君子。最後まで吉。"},{line:"六四",text:"利あらざるなし。謙を撝く。",comment:"積極的に謙虚であれ。"},{line:"六五",text:"富まずして其の隣を用いる。",comment:"富に頼らず近隣を動かす。"},{line:"上六",text:"鳴謙。軍を行る師征するに利し。",comment:"謙虚から発した力は正義の力。"}],meaning:"山が大地の下に潜む。謙虚な者だけが永続的な成功を得る。",advice:"あらゆる状況で謙虚さを保て。",history:"謙は六十四卦中、唯一すべての爻が吉または無咎とされる特別な卦。"},
  {num:16,name:"雷地豫",kanji:"豫",lines:[0,0,1,0,0,0],upper:"震",lower:"坤",keyword:"喜び・音楽",guaci:"侯を建て師を行るに利し。",tuan:"豫は剛応じて志行われ順以て動く。",xiang:"雷地出ずるは豫なり。",yaoci:[],meaning:"大地から雷が轟く。喜びが広がる。",advice:"喜びで人を動かせ。安逸に溺れるな。",history:"豫は礼楽思想の卦。"},
  {num:17,name:"沢雷随",kanji:"随",lines:[0,1,1,0,0,1],upper:"兌",lower:"震",keyword:"従う・適応",guaci:"元いに亨り、貞に利し。",tuan:"随は剛来たりて下に柔す。",xiang:"沢中に雷あるは随なり。",yaoci:[],meaning:"時代と状況に従う柔軟さ。",advice:"時代に従いながら、真の自分を失うな。",history:"随は「随機応変」の語源。"},
  {num:18,name:"山風蠱",kanji:"蠱",lines:[1,0,0,1,1,0],upper:"艮",lower:"巽",keyword:"腐敗の修正・改革",guaci:"元いに亨る。大川を渉るに利し。",tuan:"蠱は剛上りて柔下る。",xiang:"山下に風あるは蠱なり。",yaoci:[],meaning:"過去の誤りや腐敗を修正する時。",advice:"改革は慎重に、しかし断固として。",history:"蠱は「改革」の卦。"},
  {num:19,name:"地沢臨",kanji:"臨",lines:[0,0,0,0,1,1],upper:"坤",lower:"兌",keyword:"臨む・管理",guaci:"元いに亨り、貞に利し。",tuan:"臨は剛浸んで長ずるなり。",xiang:"沢上に地あるは臨なり。",yaoci:[],meaning:"上位から真摯に向き合う。",advice:"真摯に向き合い管理せよ。",history:"臨は「臨む」の語源。"},
  {num:20,name:"風地観",kanji:"観",lines:[1,1,0,0,0,0],upper:"巽",lower:"坤",keyword:"観察・瞑想",guaci:"盥して薦めず。孚ありて顒若たり。",tuan:"大観上に在り。",xiang:"風地上を行くは観なり。",yaoci:[],meaning:"高い所から広く観察し、自らが模範となる。",advice:"まず自らを省みよ。模範を示すことが最大の教育。",history:"観は「観光」の語源。"},
  {num:21,name:"火雷噬嗑",kanji:"噬嗑",lines:[1,0,1,0,0,1],upper:"離",lower:"震",keyword:"断罪・刑罰",guaci:"亨る。獄を用いるに利し。",tuan:"頤中に物あり、噬嗑という。",xiang:"雷電は噬嗑なり。",yaoci:[],meaning:"口の中の障害を噛み砕く。法と刑罰で秩序を回復する。",advice:"障害を噛み砕け。刑罰は公正に。",history:"噬嗑は法と刑罰の卦。"},
  {num:22,name:"山火賁",kanji:"賁",lines:[1,0,0,1,0,1],upper:"艮",lower:"離",keyword:"装飾・美",guaci:"亨る。小に往くに利し。",tuan:"賁は亨る。柔来たりて剛を文る。",xiang:"山下に火あるは賁なり。",yaoci:[],meaning:"美しさと装飾の重要性。形式は内容を助ける。",advice:"美を尊べ。しかし装飾は本質を超えてはならない。",history:"賁は美学の卦。"},
  {num:23,name:"山地剥",kanji:"剥",lines:[1,0,0,0,0,0],upper:"艮",lower:"坤",keyword:"崩壊・陰の侵食",guaci:"往くなかれ。",tuan:"剥は剥なり。",xiang:"山地に附くは剥なり。",yaoci:[],meaning:"山が大地に崩れ落ちる。陰が陽を侵食する。",advice:"今は進むな。内に徳を蓄えよ。",history:"剥の後に復が来る循環思想。"},
  {num:24,name:"地雷復",kanji:"復",en:"Return",lines:[0,0,0,0,0,1],upper:"坤",lower:"震",keyword:"回帰・再生・一陽来復",guaci:"亨る。七日にして来復す。",tuan:"復は亨る。剛反るなり。",xiang:"雷地中に在るは復なり。",yaoci:[{line:"初九",text:"遠からずして復る。元吉。",comment:"すぐに戻る。大吉。"},{line:"六二",text:"休復。吉。",comment:"美しい回帰。"},{line:"六三",text:"頻復。厲けれど咎なし。",comment:"何度も戻る繰り返し。"},{line:"六四",text:"中行独復す。",comment:"独力で正道に戻る。"},{line:"六五",text:"敦復。悔いなし。",comment:"篤実に戻る。"},{line:"上六",text:"迷復。凶。",comment:"迷い込んだ復帰は凶。"}],meaning:"冬至に一陽が地中から回帰する。失ったものが必ず戻る。",advice:"早めに正道に戻れ。最も暗い時が新しい光の始まり。",history:"復は冬至の卦。「一陽来復」の語源。"},
  {num:25,name:"天雷无妄",kanji:"无妄",lines:[1,1,1,0,0,1],upper:"乾",lower:"震",keyword:"純粋・天命",guaci:"元いに亨り、貞に利し。",tuan:"无妄は剛外より来たりて主となる。",xiang:"天の下に雷行くは无妄なり。",yaoci:[],meaning:"計算なき誠実さ。天命に従った純粋な行動。",advice:"邪念を捨て、天命に従え。",history:"无妄は老子の無為自然に最も近い卦。"},
  {num:26,name:"山天大畜",kanji:"大畜",lines:[1,0,0,1,1,1],upper:"艮",lower:"乾",keyword:"大いなる蓄積",guaci:"貞に利し。大川を渉るに利し。",tuan:"大畜は剛健篤実輝光。",xiang:"天山中にあるは大畜なり。",yaoci:[],meaning:"天の力が山に蓄積される。古の賢人の言葉から学ぶ。",advice:"先人の言葉から学べ。大事業の前の蓄積期。",history:"大畜は知識と才能の蓄積の卦。"},
  {num:27,name:"山雷頤",kanji:"頤",lines:[1,0,0,0,0,1],upper:"艮",lower:"震",keyword:"養い・食・言葉",guaci:"貞吉。頤を観る。",tuan:"頤は貞吉。",xiang:"山下に雷あるは頤なり。",yaoci:[],meaning:"何を食べ何を語るか。身体と精神の養いを大切に。",advice:"言葉を慎み飲食を節制せよ。",history:"頤は「養生」の哲学。"},
  {num:28,name:"沢風大過",kanji:"大過",lines:[0,1,1,1,1,0],upper:"兌",lower:"巽",keyword:"過剰・非常手段",guaci:"棟撓む。大川を渉るに利し。",tuan:"大過は大なるもの過ぐなり。",xiang:"沢木に滅するは大過なり。",yaoci:[],meaning:"棟梁が曲がる異常事態。非常手段が必要。",advice:"孤立を恐れず大きな決断を。",history:"大過は限界突破の卦。"},
  {num:29,name:"坎為水",kanji:"坎",en:"The Abysmal",lines:[0,1,0,0,1,0],upper:"坎",lower:"坎",keyword:"深淵・危険・誠実",guaci:"習坎。孚あり。維れ心亨る。",tuan:"習坎は重険なり。",xiang:"水洊至るは習坎なり。",yaoci:[{line:"初六",text:"習坎。坎窞に入る。凶。",comment:"最も深い危険。"},{line:"九二",text:"坎に険あり。求め小しく得る。",comment:"小さな成果は得られる。"},{line:"六三",text:"来きては坎に之く。用いるなかれ。",comment:"今は動くな。"},{line:"六四",text:"樽酒簋に貳し。終に咎なし。",comment:"誠実に仕える。"},{line:"九五",text:"坎盈たず。祇既に平らか。咎なし。",comment:"危険が徐々に治まる。"},{line:"上六",text:"係索を用いて叢棘に寘く。三歳得ざるは凶。",comment:"深刻な拘束状態。"}],meaning:"水が重なって流れる深淵。誠実さがあれば深淵も通り抜けられる。",advice:"誠実さだけが危険を乗り越えさせる。",history:"坎は危険を示す卦。"},
  {num:30,name:"離為火",kanji:"離",en:"The Clinging",lines:[1,0,1,1,0,1],upper:"離",lower:"離",keyword:"炎・附着・文明の光",guaci:"利貞。亨る。牝牛を畜うに吉。",tuan:"離は麗なり。",xiang:"明両作るは離なり。",yaoci:[{line:"初九",text:"履錯然たり。敬すれば咎なし。",comment:"慎重に敬虔であれば咎なし。"},{line:"六二",text:"黄離。元吉。",comment:"中庸の炎。大いに吉。"},{line:"九三",text:"日昃の離。大耋の嗟。凶。",comment:"夕暮れを楽しめ。"},{line:"九四",text:"突如其の来ること如し。",comment:"突然の衝撃への警告。"},{line:"六五",text:"出涕沱若く。吉。",comment:"真摯な嘆きは吉に転じる。"},{line:"上九",text:"王用いて征伐す。有慶あり。咎なし。",comment:"首謀者を討ち、一般人民は傷つけない。"}],meaning:"炎は何かに附着して燃える。文明の光。",advice:"明るさを保ちながら、正しいものに寄り添え。",history:"離は文明・文化の象徴。"},
  {num:31,name:"沢山咸",kanji:"咸",lines:[0,1,1,1,0,0],upper:"兌",lower:"艮",keyword:"感応・結婚",guaci:"亨る。女を取るに吉。",tuan:"咸は感なり。",xiang:"山上に沢あるは咸なり。",yaoci:[],meaning:"男女が感応し結ばれる。",advice:"計算を捨て、心を空にして感応せよ。",history:"咸は下経の最初。"},
  {num:32,name:"雷風恒",kanji:"恒",lines:[0,0,1,1,1,0],upper:"震",lower:"巽",keyword:"恒久・持続",guaci:"亨る。往く所あるに利し。",tuan:"恒は久なり。",xiang:"雷風は恒なり。",yaoci:[],meaning:"変化の中にも変わらぬ原則がある。",advice:"本質的な原則を変えるな。",history:"恒は「持続」の卦。"},
  {num:33,name:"天山遯",kanji:"遯",lines:[1,1,1,1,0,0],upper:"乾",lower:"艮",keyword:"退き・隠遁",guaci:"亨る。小に貞は利し。",tuan:"遯は亨る。",xiang:"天下に山あるは遯なり。",yaoci:[],meaning:"陰が侵食してくる。戦略的な退却が最善。",advice:"引き際を知ることが最高の知恵。",history:"遯は「隠遁」の語源。"},
  {num:34,name:"雷天大壮",kanji:"大壮",lines:[0,0,1,1,1,1],upper:"震",lower:"乾",keyword:"大いなる力・正道",guaci:"貞に利し。",tuan:"大壮は大なるものは壮なり。",xiang:"雷天上にあるは大壮なり。",yaoci:[],meaning:"大きな力を持つ時。力を正しく使わなければ凶。",advice:"力を誇示するな。正しい道を歩め。",history:"大壮は力と正義の関係を示す卦。"},
  {num:35,name:"火地晋",kanji:"晋",lines:[0,0,1,0,0,0],upper:"離",lower:"坤",keyword:"前進・昇進",guaci:"康侯は馬を錫わること蕃庶を用いて。",tuan:"晋は進なり。",xiang:"明地上に出ずるは晋なり。",yaoci:[],meaning:"太陽が大地の上に昇る。順調な前進。",advice:"自らの明徳を輝かせながら謙虚に昇進せよ。",history:"晋は「晋升」の語源。"},
  {num:36,name:"地火明夷",kanji:"明夷",lines:[0,0,0,1,0,1],upper:"坤",lower:"離",keyword:"暗黒時代・内なる光",guaci:"艱貞に利し。",tuan:"明入地中は明夷なり。",xiang:"明地中に入るは明夷なり。",yaoci:[],meaning:"太陽が地中に沈む。内なる光を消さず守れ。",advice:"外の暗闇に惑わされるな。内なる明智を守り続けよ。",history:"明夷は文王・箕子が昏暴の君主に仕えた時代の象徴。"},
  {num:37,name:"風火家人",kanji:"家人",lines:[1,1,0,1,0,1],upper:"巽",lower:"離",keyword:"家族・役割",guaci:"女の貞に利し。",tuan:"家人は女の家に正しくするなり。",xiang:"風は火より出ずるは家人なり。",yaoci:[],meaning:"家族それぞれが役割を持つ。家庭の秩序から国の秩序が生まれる。",advice:"家庭の秩序を大切に。",history:"家人は家族制度の卦。"},
  {num:38,name:"火沢睽",kanji:"睽",lines:[1,0,1,0,1,1],upper:"離",lower:"兌",keyword:"対立・小事に吉",guaci:"小事に吉。",tuan:"睽は火動きて上り、沢動きて下る。",xiang:"上火下沢は睽なり。",yaoci:[],meaning:"対立の中にも出会いがある。",advice:"異なるものが出会うことで新しい価値が生まれる。",history:"睽は差異と多様性の哲学。"},
  {num:39,name:"水山蹇",kanji:"蹇",lines:[0,1,0,1,0,0],upper:"坎",lower:"艮",keyword:"困難・助けを求める",guaci:"西南に利し。大人を見るに利し。",tuan:"蹇は難なり。",xiang:"山上に水あるは蹇なり。",yaoci:[],meaning:"山の前に険水が立ちはだかる。自己を省みる時。",advice:"独力で突破しようとせず助けを求めよ。",history:"蹇は「跛行する」の意。"},
  {num:40,name:"雷水解",kanji:"解",lines:[0,0,1,0,1,0],upper:"震",lower:"坎",keyword:"解放・問題の解決",guaci:"西南に利し。",tuan:"解は険以て動く。",xiang:"雷雨作るは解なり。",yaoci:[],meaning:"雷雨の後の解放。困難が解消される時。",advice:"過去の罪を許し、清算して前進せよ。",history:"解は「解放」の卦。"},
  {num:41,name:"山沢損",kanji:"損",lines:[1,0,0,0,1,1],upper:"艮",lower:"兌",keyword:"減少・誠意",guaci:"孚あり。元吉。",tuan:"損は下を損して上を益す。",xiang:"山下に沢あるは損なり。",yaoci:[],meaning:"下を減らして上に益す。誠実さが重要。",advice:"怒りと欲望を抑えよ。",history:"損は益の前提。"},
  {num:42,name:"風雷益",kanji:"益",lines:[1,1,0,0,0,1],upper:"巽",lower:"震",keyword:"増益・好機",guaci:"往く所あるに利し。大川を渉るに利し。",tuan:"益は損上益下。",xiang:"風雷は益なり。",yaoci:[],meaning:"上を減らして下に益す。民を益することが真の益。",advice:"今が好機。善を見れば即座に従え。",history:"益は「損益」の起源。"},
  {num:43,name:"沢天夬",kanji:"夬",lines:[0,1,1,1,1,1],upper:"兌",lower:"乾",keyword:"決断・突破",guaci:"王廷に揚ぐ。往く所あるに利し。",tuan:"夬は決なり。",xiang:"沢天上にあるは夬なり。",yaoci:[],meaning:"堤が決壊する勢い。小人を断固として排除する時。",advice:"邪念を断ち切れ。公正に宣言して行動せよ。",history:"夬は「決断」の語源。"},
  {num:44,name:"天風姤",kanji:"姤",lines:[1,1,1,1,1,0],upper:"乾",lower:"巽",keyword:"出会い・誘惑",guaci:"女は壮なり。女を取るなかれ。",tuan:"姤は遇なり。",xiang:"天下に風あるは姤なり。",yaoci:[],meaning:"思いがけない出会いと誘惑。",advice:"一見良さそうな誘惑が最大の危険。",history:"姤は夬の反対。"},
  {num:45,name:"沢地萃",kanji:"萃",lines:[0,1,1,0,0,0],upper:"兌",lower:"坤",keyword:"集合・求心力",guaci:"亨る。大人を見るに利し。",tuan:"萃は聚なり。",xiang:"沢地上にあるは萃なり。",yaoci:[],meaning:"王のもとに人々が集う。",advice:"真の指導者のもとに集い共通の目的を持て。",history:"萃は「集まる」の語源。"},
  {num:46,name:"地風升",kanji:"升",lines:[0,0,0,1,1,0],upper:"坤",lower:"巽",keyword:"上昇・成長",guaci:"元いに亨る。南征すれば吉。",tuan:"柔以て時に升る。",xiang:"地中に木生ずるは升なり。",yaoci:[],meaning:"木が地中から育つように上昇する。",advice:"小さな徳の積み重ねが大きな成果をもたらす。",history:"升は「上昇」の卦。"},
  {num:47,name:"沢水困",kanji:"困",lines:[0,1,1,0,1,0],upper:"兌",lower:"坎",keyword:"困窮・試練",guaci:"亨る。大人は吉。",tuan:"困は剛揜わるなり。",xiang:"沢水无きは困なり。",yaoci:[],meaning:"水が沢から流れ去る閉塞。君子はこの困難の中で道を失わない。",advice:"困難の中でこそ真の君子が試される。",history:"困は「困窮」の語源。"},
  {num:48,name:"水風井",kanji:"井",lines:[0,1,0,1,1,0],upper:"坎",lower:"巽",keyword:"井戸・源泉",guaci:"邑を改めて井を改めず。",tuan:"巽乎水にして水を上ぐ。",xiang:"木上に水あるは井なり。",yaoci:[],meaning:"邑は変わっても井戸は変わらない。社会の根本的な基盤。",advice:"源泉を維持することが最重要。",history:"井は「市井」の語源。"},
  {num:49,name:"沢火革",kanji:"革",lines:[0,1,1,1,0,1],upper:"兌",lower:"離",keyword:"革命・変革",guaci:"巳日に乃ち孚さる。",tuan:"革は水火相息するなり。",xiang:"沢中に火あるは革なり。",yaoci:[],meaning:"天命によって政権が変わる。",advice:"革命は時機が大切。天命と民心を両方確認せよ。",history:"革は「革命」の語源。"},
  {num:50,name:"火風鼎",kanji:"鼎",lines:[1,0,1,1,1,0],upper:"離",lower:"巽",keyword:"変革・文明",guaci:"元吉亨る。",tuan:"鼎は象なり。",xiang:"木上に火あるは鼎なり。",yaoci:[],meaning:"鼎に食物を煮る文明の象徴。古いものを新しく変容する。",advice:"位を正し、使命を明確にせよ。",history:"鼎は国家権力の象徴。"},
  {num:51,name:"震為雷",kanji:"震",lines:[0,0,1,0,0,1],upper:"震",lower:"震",keyword:"衝撃・雷",guaci:"亨る。震来ること虩虩たり。",tuan:"震は亨る。",xiang:"洊雷は震なり。",yaoci:[],meaning:"重なる雷。恐怖の中に笑いがある。",advice:"衝撃に慌てるな。恐れが自省を生む。",history:"震は「恐震」の語源。"},
  {num:52,name:"艮為山",kanji:"艮",lines:[1,0,0,1,0,0],upper:"艮",lower:"艮",keyword:"静止・瞑想",guaci:"其の背に艮す。咎なし。",tuan:"艮は止なり。",xiang:"兼山は艮なり。",yaoci:[],meaning:"止まるべき時に止まれ。",advice:"止まれ。今は動く時ではない。",history:"艮は「瞑想」の卦。"},
  {num:53,name:"風山漸",kanji:"漸",lines:[1,1,0,1,0,0],upper:"巽",lower:"艮",keyword:"漸進・段階的発展",guaci:"女を帰するに吉。",tuan:"漸の進は女を帰すること吉なり。",xiang:"山上に木あるは漸なり。",yaoci:[],meaning:"木が山に根を張り徐々に成長する。",advice:"急がず段階を踏め。",history:"漸は「漸進」の語源。"},
  {num:54,name:"雷沢帰妹",kanji:"帰妹",lines:[0,0,1,0,1,1],upper:"震",lower:"兌",keyword:"結婚・慎重",guaci:"征けば凶。",tuan:"帰妹は天地の大義なり。",xiang:"沢上に雷あるは帰妹なり。",yaoci:[],meaning:"正でない関係。人の欲望が動く危険な関係。",advice:"衝動的な感情に任せた関係は凶。",history:"帰妹は古代中国の婚姻制度の光と影。"},
  {num:55,name:"雷火豊",kanji:"豊",lines:[0,0,1,1,0,1],upper:"震",lower:"離",keyword:"豊かさ・絶頂",guaci:"亨る。王这たり。憂うる勿れ。",tuan:"豊は大なり。",xiang:"雷電はともに至るは豊なり。",yaoci:[],meaning:"豊かさの絶頂は影を生む。",advice:"豊かさの絶頂こそ慎重に。",history:"豊は盛者必衰を含む。"},
  {num:56,name:"火山旅",kanji:"旅",lines:[1,0,1,1,0,0],upper:"離",lower:"艮",keyword:"旅・謙虚",guaci:"旅は小に吉。",tuan:"旅は小に吉。",xiang:"山上に火あるは旅なり。",yaoci:[],meaning:"旅人は控えめに、謙虚に。",advice:"旅先では謙虚に、慎重に行動せよ。",history:"旅は「旅行」の語源。"},
  {num:57,name:"巽為風",kanji:"巽",lines:[1,1,0,1,1,0],upper:"巽",lower:"巽",keyword:"風・浸透",guaci:"小に利し。大人を見るに利し。",tuan:"重巽以て命を申ぶ。",xiang:"随風は巽なり。",yaoci:[],meaning:"重なる風。柔和に繰り返し浸透する。",advice:"柔和に、しかし繰り返し伝えよ。",history:"巽は柔軟な影響力の哲学。"},
  {num:58,name:"兌為沢",kanji:"兌",lines:[0,1,1,0,1,1],upper:"兌",lower:"兌",keyword:"喜び・友との学び",guaci:"亨る。貞に利し。",tuan:"兌は悦なり。",xiang:"麗沢は兌なり。",yaoci:[],meaning:"真の喜びは内から湧く。朋友と共に学ぶ喜び。",advice:"朋友と共に学び、内から湧く悦びを育てよ。",history:"兌は「喜悦」の卦。"},
  {num:59,name:"風水渙",kanji:"渙",lines:[1,1,0,0,1,0],upper:"巽",lower:"坎",keyword:"離散・解放",guaci:"亨る。大川を渉るに利し。",tuan:"渙は亨る。",xiang:"風水上を行くは渙なり。",yaoci:[],meaning:"固まったものが解け散る。",advice:"凝り固まった考えや関係を解き放て。",history:"渙は「解散・解放」の卦。"},
  {num:60,name:"水沢節",kanji:"節",lines:[0,1,0,0,1,1],upper:"坎",lower:"兌",keyword:"節制・甘節",guaci:"亨る。苦節は貞すべからず。",tuan:"節は亨る。",xiang:"沢上に水あるは節なり。",yaoci:[],meaning:"甘い節制は吉。苦しい節制は持続できない。",advice:"節制は喜びを伴ってこそ持続する。",history:"節は「節制」の語源。"},
  {num:61,name:"風沢中孚",kanji:"中孚",lines:[1,1,0,0,1,1],upper:"巽",lower:"兌",keyword:"内なる誠実・信頼",guaci:"豚魚吉。大川を渉るに利し。",tuan:"中孚は柔内にあり。",xiang:"沢上に風あるは中孚なり。",yaoci:[],meaning:"内なる誠実さ。豚と魚にまで感応する真実。",advice:"形式でなく内なる誠実さを磨け。",history:"中孚は「誠信」の卦。"},
  {num:62,name:"雷山小過",kanji:"小過",lines:[0,0,1,1,0,0],upper:"震",lower:"艮",keyword:"小さな超過・謙虚",guaci:"亨る。小事に可なり、大事に可ならず。",tuan:"小過は小なるもの過ぐなり。",xiang:"山上に雷あるは小過なり。",yaoci:[],meaning:"小事に吉、大事に凶。下に行くに利あり。",advice:"高望みするな。小さなことを着実にこなせ。",history:"小過は高く飛ぼうとする鳥への警告。"},
  {num:63,name:"水火既済",kanji:"既済",en:"After Completion",lines:[0,1,0,1,0,1],upper:"坎",lower:"離",keyword:"完成・成就・乱れの始まり",guaci:"亨る。小には利し。初めは吉、終わりは乱る。",tuan:"既済は亨る。初めは吉、終わりは乱るなり。",xiang:"水火既済なり。君子以て患を思いて之を予防す。",yaoci:[{line:"初九",text:"其の輪を曳く。其の尾を濡らす。咎なし。",comment:"始まりの慎重さ。"},{line:"六二",text:"妇は其の茀を喪う。七日にして得。",comment:"追いかけるな。7日で見つかる。"},{line:"九三",text:"高宗鬼方を伐ち。三年にして之を克つ。",comment:"長期戦。"},{line:"六四",text:"繻有り孺に終日戒む。",comment:"微小な綻びを見逃すな。"},{line:"九五",text:"東隣は牛を殺す。西隣の禴祭に如かず。",comment:"誠実な小さな祭りが福を得る。"},{line:"上六",text:"其の首を濡らす。厲。",comment:"油断して溺れる。最大の警戒を。"}],meaning:"完成の状態。しかし完成は崩壊の始まりでもある。",advice:"成功した今こそ油断するな。完成は新たな始まり。",history:"既済は63番目の卦。"},
  {num:64,name:"火水未済",kanji:"未済",en:"Before Completion",lines:[1,0,1,0,1,0],upper:"離",lower:"坎",keyword:"未完成・可能性・最後の一歩",guaci:"亨る。小狐、汔ど済る。其の尾を濡らす。",tuan:"未済は亨る。柔中を得るなり。",xiang:"火の水の上にあるは未済なり。",yaoci:[{line:"初六",text:"其の尾を濡らす。吝。",comment:"最初の一歩でつまずく。"},{line:"九二",text:"其の輪を曳く。貞吉。",comment:"慎重に止まる。"},{line:"六三",text:"未済、征けば凶。大川を渉るに利し。",comment:"大事業に挑戦することは利がある。"},{line:"九四",text:"貞吉、悔い亡ず。三年にして大国に賞せらる。",comment:"3年後に大国から褒賞される。"},{line:"六五",text:"貞吉、悔い亡ず。君子の光。",comment:"君子の光が輝く。"},{line:"上九",text:"孚ありて飲酒す。咎なし。",comment:"誠実さを持って祝え。節度を守れ。"}],meaning:"未完成だが可能性に満ちる。あと一歩。",advice:"最後の詰めを慎重に。易経はこの未完成で終わる。",history:"未済は六十四卦の最後の卦。"},
];

const ALL=HEXAGRAMS.sort((a,b)=>a.num-b.num);


// ══════════════════════════════════════════════
//  クイズデータ
// ══════════════════════════════════════════════
const QZ=[
  {q:"乾（☰）が象徴する自然現象は？",opts:["天","地","水","火"],ans:0,exp:"乾は三本の陽爻からなり、純粋な陽の力＝天を象徴します。"},
  {q:"坤（☷）の徳は？",opts:["剛健","柔順","動","悦"],ans:1,exp:"坤は大地のように柔順に万物を受け入れ育む徳を持ちます。"},
  {q:"「一陽来復」を示す卦は？",opts:["復（地雷復）","泰（地天泰）","乾（乾為天）","震（震為雷）"],ans:0,exp:"地雷復（24卦）は冬至に一陽が回帰する卦。「一陽来復」の語源。"},
  {q:"六十四卦中、全爻が吉または無咎とされる唯一の卦は？",opts:["乾","坤","謙","泰"],ans:2,exp:"謙（15卦）は謙虚さの卦。天道・地道・人道すべてが謙虚を祝福するため全爻吉。"},
  {q:"易経の根本思想「三義」に含まれないものは？",opts:["変易","不易","易簡","易行"],ans:3,exp:"三義は「変易」「不易」「易簡」の三つ。「易行」は含まれません。"},
  {q:"彖伝（たんでん）とは？",opts:["各爻の解説","卦全体の意味を解説した文","卦の名前の由来","占い方の説明"],ans:1,exp:"彖伝は各卦全体の意味・原理を解説。十翼の一つ。"},
  {q:"易経がなぜ「未済（未完成）」で終わるのか？",opts:["偶然","宇宙は永遠に変化し続けるため","縁起が良いため","文王の意志"],ans:1,exp:"変化に終わりはなく、宇宙は常に新たな始まりに向かう哲学。"},
  {q:"八卦の「艮」が象徴するものは？",opts:["雷","水","山","沢"],ans:2,exp:"艮（☶）は止まることの象。山が動かず止まる姿を表す。"},
];

// ══════════════════════════════════════════════
//  CSS
// ══════════════════════════════════════════════
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;600&family=Noto+Sans+JP:wght@300;400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#12100e;min-height:100vh;font-family:'Noto Serif JP','Georgia',serif}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#5a4a20;border-radius:2px}

/* アニメーション */
@keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes coin{0%{transform:rotateY(0deg)}50%{transform:rotateY(900deg)}100%{transform:rotateY(1800deg)}}
@keyframes glow{0%,100%{box-shadow:0 0 10px rgba(200,168,75,.3)}50%{box-shadow:0 0 30px rgba(200,168,75,.7),0 0 60px rgba(200,168,75,.3)}}
@keyframes inkdrop{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.fu{animation:fu .6s ease both}
.fu1{animation:fu .6s .1s ease both}
.fu2{animation:fu .6s .2s ease both}
.fu3{animation:fu .6s .35s ease both}
.fu4{animation:fu .6s .5s ease both}
.ink{animation:inkdrop .8s cubic-bezier(.22,1,.36,1) both}
.float{animation:float 3s ease-in-out infinite}

/* タブ */
.tb{background:none;border:none;cursor:pointer;padding:9px 14px;font-family:'Noto Serif JP',serif;font-size:11px;letter-spacing:.2em;color:#6a5830;transition:color .25s;position:relative}
.tb:hover{color:#c8a84b}
.tb.on{color:#c8a84b}
.tb.on::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:18px;height:1px;background:linear-gradient(90deg,transparent,#c8a84b,transparent)}

/* カード */
.card{background:rgba(30,24,12,.7);border:1px solid rgba(200,168,75,.15);border-radius:6px;padding:14px;cursor:pointer;transition:all .25s;backdrop-filter:blur(4px)}
.card:hover{border-color:rgba(200,168,75,.4);background:rgba(40,32,16,.8);transform:translateY(-2px);box-shadow:0 4px 20px rgba(200,168,75,.1)}

/* ボタン */
.cbtn{background:linear-gradient(135deg,rgba(200,168,75,.18),rgba(160,120,40,.12));border:1px solid rgba(200,168,75,.45);color:#c8a84b;padding:14px 40px;font-size:14px;letter-spacing:.3em;cursor:pointer;border-radius:3px;font-family:'Noto Serif JP',serif;transition:all .3s;position:relative;overflow:hidden}
.cbtn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(200,168,75,.08),transparent);opacity:0;transition:opacity .3s}
.cbtn:hover::before{opacity:1}
.cbtn:hover{border-color:#c8a84b;box-shadow:0 0 25px rgba(200,168,75,.2),inset 0 0 15px rgba(200,168,75,.05)}
.cbtn:active{transform:scale(.97)}
.cbtn:disabled{opacity:.4;cursor:not-allowed}
.cbtn-coin{background:radial-gradient(circle at 30% 30%,#d4a84b,#8a6820);border:2px solid #c8a84b;color:#12100e;width:88px;height:88px;border-radius:50%;font-size:28px;cursor:pointer;transition:all .3s;box-shadow:0 4px 15px rgba(200,168,75,.4),inset 0 1px 2px rgba(255,255,255,.3);font-family:serif}
.cbtn-coin:hover{box-shadow:0 6px 25px rgba(200,168,75,.6),inset 0 1px 2px rgba(255,255,255,.3);transform:scale(1.05)}
.cbtn-coin.spinning{animation:coin .8s ease-in-out}
.cbtn-s{background:rgba(60,50,30,.5);border-color:rgba(200,168,75,.2);color:#9a8050}

/* 入力 */
.inp{background:rgba(20,16,8,.8);border:1px solid rgba(200,168,75,.2);border-radius:4px;color:#e8dcc0;padding:12px 14px;font-family:'Noto Serif JP',serif;font-size:13px;width:100%;outline:none;transition:border-color .25s;backdrop-filter:blur(4px)}
.inp:focus{border-color:rgba(200,168,75,.5);box-shadow:0 0 12px rgba(200,168,75,.08)}
.inp::placeholder{color:#4a3e20}
textarea.inp{resize:vertical;min-height:80px;line-height:1.8}

/* ラベル */
.lbl{font-size:10px;color:#7a6530;letter-spacing:.22em;margin-bottom:9px}
.div{height:1px;background:linear-gradient(90deg,transparent,rgba(200,168,75,.18),transparent);margin:20px 0}

/* 爻行 */
.yr{border:1px solid rgba(200,168,75,.1);border-radius:4px;margin-bottom:5px;overflow:hidden;cursor:pointer;transition:all .2s;background:rgba(20,16,8,.5)}
.yr:hover{border-color:rgba(200,168,75,.25);background:rgba(30,24,12,.7)}

/* クイズ */
.qo{background:rgba(20,16,8,.7);border:1px solid rgba(200,168,75,.15);border-radius:4px;padding:11px 14px;cursor:pointer;transition:all .2s;font-family:'Noto Serif JP',serif;font-size:13px;color:#d4c090;width:100%;text-align:left}
.qo:hover:not(:disabled){border-color:rgba(200,168,75,.35);background:rgba(30,24,12,.8)}
.qo.ok{border-color:#7ab87a!important;background:rgba(60,120,60,.15)!important;color:#a8d4a8}
.qo.ng{border-color:#c06050!important;background:rgba(120,60,50,.15)!important;color:#d4a0a0}

/* 学習ナビ */
.ln{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:22px}
.lb{background:rgba(20,16,8,.6);border:1px solid rgba(200,168,75,.15);border-radius:3px;padding:5px 12px;font-family:'Noto Serif JP',serif;font-size:11px;letter-spacing:.1em;color:#7a6530;cursor:pointer;transition:all .2s}
.lb:hover{border-color:rgba(200,168,75,.3);color:#c8a84b}
.lb.on{border-color:rgba(200,168,75,.45);color:#c8a84b;background:rgba(200,168,75,.07)}

/* 区切り線（龍）*/
.dragon-div{text-align:center;margin:18px 0;position:relative}
.dragon-div::before,.dragon-div::after{content:'';position:absolute;top:50%;width:calc(50% - 20px);height:1px;background:linear-gradient(90deg,transparent,rgba(200,168,75,.25))}
.dragon-div::before{left:0}
.dragon-div::after{right:0;background:linear-gradient(270deg,transparent,rgba(200,168,75,.25))}
`;


// ══════════════════════════════════════════════
//  メインApp
// ══════════════════════════════════════════════
export default function App(){
  const [tab,setTab]=useState("oracle");
  const [sub,setSub]=useState("cast");
  const [question,setQuestion]=useState("");
  const [castLines,setCastLines]=useState(null);
  const [curHex,setCurHex]=useState(null);
  const [henHex,setHenHex]=useState(null);
  const [henLines,setHenLines]=useState(null);
  const [casting,setCasting]=useState(false);
  const [coinSpin,setCoinSpin]=useState(false);
  const [castStep,setCastStep]=useState(0);
  const [aiText,setAiText]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [aiError,setAiError]=useState("");
  const [dictSearch,setDictSearch]=useState("");
  const [dictSel,setDictSel]=useState(null);
  const [expandYao,setExpandYao]=useState(null);
  const [learnSec,setLearnSec]=useState("intro");
  const [qIdx,setQIdx]=useState(0);
  const [qAns,setQAns]=useState(null);
  const [qScore,setQScore]=useState(0);
  const [qDone,setQDone]=useState(false);

  // 占記：localStorageで永続化
  const [journal,setJournal]=useState(()=>{
    try{
      const s=localStorage.getItem("iching_journal");
      return s?JSON.parse(s):[];
    }catch{return [];}
  });

  useEffect(()=>{
    try{ localStorage.setItem("iching_journal",JSON.stringify(journal)); }catch{}
  },[journal]);

  // 占い
  const handleCast=async()=>{
    if(casting)return;
    setCasting(true);setCoinSpin(true);setCastLines(null);setCurHex(null);
    setHenHex(null);setHenLines(null);setAiText("");setAiError("");setCastStep(0);
    await new Promise(r=>setTimeout(r,800)); // コイン演出
    setCoinSpin(false);
    for(let i=1;i<=6;i++){await new Promise(r=>setTimeout(r,320));setCastStep(i);}
    await new Promise(r=>setTimeout(r,200));
    const rawLines=Array.from({length:6},()=>Math.floor(Math.random()*4)+6);
    const honLines=rawLines.map(v=>v%2===1?1:0);
    const hasHen=rawLines.some(v=>v===6||v===9);
    const changedLines=rawLines.map(v=>v===6?1:v===9?0:v%2===1?1:0);
    setCastLines(rawLines);
    const hex=ALL.find(h=>h.lines.every((l,i)=>l===honLines[i]))||ALL[0];
    setCurHex(hex);
    if(hasHen){
      const hHex=ALL.find(h=>h.lines.every((l,i)=>l===changedLines[i]))||null;
      setHenHex(hHex);setHenLines(changedLines);
    }
    setCasting(false);setSub("result");
    const entry={
      id:Date.now(),
      date:new Date().toLocaleDateString("ja-JP"),
      time:new Date().toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"}),
      question,hex,lines:honLines,rawLines,
      henHex:hasHen?(ALL.find(h=>h.lines.every((l,i)=>l===changedLines[i]))||null):null,
      note:""
    };
    setJournal(prev=>[entry,...prev]);
  };

  // AI解釈
  const getAi=async()=>{
    if(!curHex||aiLoading)return;
    setAiLoading(true);setAiText("");setAiError("");
    const henkoInfo=castLines
      ?castLines.map((v,i)=>{
          if(v===6)return `第${i+1}爻（老陰→陽に変じる）`;
          if(v===9)return `第${i+1}爻（老陽→陰に変じる）`;
          return null;
        }).filter(Boolean).join("、")||"なし"
      :"なし";
    const shikua=henHex
      ?`第${henHex.num}卦 ${henHex.name}（${henHex.kanji}）／${henHex.keyword}／${henHex.meaning}`
      :"なし（変爻なし）";
    const prompt=`あなたは高度な知識を持つ「易経の指導者」です。
ユーザーが相談内容を入力し、易占いによって本卦と変爻が導き出されました。
以下のステップで、現代の生活に役立つ具体的な助言を生成してください。

### 制約事項
- 易経の古典的解釈をベースにすること。
- ユーザーに寄り添い、具体的な行動指針を提示すること。
- 専門用語（老陽・老陰など）は必要に応じて噛み砕いて説明すること。

### 出力フォーマット
1. 【直感的な一言】（今の状況を一言で表す）
2. 【現状の卦の解説】（本卦が示す意味）
3. 【変爻からのメッセージ】（これが今回の核心となるアドバイス）
4. 【未来への兆し】（之卦が示す到達点）
5. 【今日からできるアクション】（具体的な行動リスト3〜5項目）

### 入力データ
- 相談内容: ${question||"（特になし。今の自分への問い）"}
- 本卦: 第${curHex.num}卦 ${curHex.name}（${curHex.kanji}）／キーワード：${curHex.keyword}／卦辞：「${curHex.guaci}」／意味：${curHex.meaning}
- 変爻位置: ${henkoInfo}
- 之卦（変卦）: ${shikua}`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"content-type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1200,messages:[{role:"user",content:prompt}]}),
      });
      const d=await res.json();
      if(d.error)throw new Error(d.error.message||JSON.stringify(d.error));
      const t=d?.content?.[0]?.text;
      if(!t)throw new Error("レスポンスエラー: "+JSON.stringify(d).slice(0,200));
      setAiText(t);
    }catch(e){
      const actionList=`・${curHex.advice.split("。")[0]}\n・焦らず現状を観察する\n・信頼できる人に相談してみる`;
      const fallback=
        `1. 【直感的な一言】\n${curHex.keyword.split("・")[0]}の時。\n\n`+
        `2. 【現状の卦の解説】\n第${curHex.num}卦「${curHex.name}」——${curHex.meaning} ${curHex.history||""}\n\n`+
        `3. 【変爻からのメッセージ】\n${henkoInfo!=="なし"?`変爻（${henkoInfo}）が示すのは、今まさに変化の岐路にいるということ。`:"今回は変爻なし。現状の卦がそのまま状況を示しています。"}\n\n`+
        `4. 【未来への兆し】\n${henHex?`之卦「${henHex.name}」へ。${henHex.meaning}`:  "変爻がないため、本卦の状況が持続します。"}\n\n`+
        `5. 【今日からできるアクション】\n${actionList}`;
      setAiText(fallback);
      setAiError("（内蔵解釈を表示中）");
    }
    setAiLoading(false);
  };

  const filtered=ALL.filter(h=>h.name.includes(dictSearch)||h.kanji.includes(dictSearch)||(h.keyword||"").includes(dictSearch)||String(h.num).includes(dictSearch));
  const ansQ=(i)=>{if(qAns!==null)return;setQAns(i);if(i===QZ[qIdx].ans)setQScore(s=>s+1);};
  const nextQ=()=>{if(qIdx>=QZ.length-1){setQDone(true);return;}setQIdx(i=>i+1);setQAns(null);};
  const resetQ=()=>{setQIdx(0);setQAns(null);setQScore(0);setQDone(false);};
  const W=520,H=220;

  // バナー
  const Banner=({hex,lines,dimmed=false})=>{
    const honLines=Array.isArray(lines)&&typeof lines[0]==="number"&&lines[0]>3
      ?lines.map(v=>v%2===1?1:0):lines;
    return(
      <div style={{position:"relative",borderRadius:"6px",overflow:"hidden",height:`${H}px`,opacity:dimmed?.82:1,border:`1px solid ${dimmed?"rgba(100,130,200,.2)":"rgba(200,168,75,.2)"}`,boxShadow:dimmed?"none":`0 4px 30px rgba(200,168,75,.08)`}}>
        <SanshuiScene trigram={hex.upper} w={W} h={H}/>
        <div style={{position:"absolute",inset:0,background:dimmed?"linear-gradient(135deg,rgba(12,10,8,.7),rgba(12,10,8,.3),rgba(12,10,8,.7))":"linear-gradient(135deg,rgba(12,10,8,.55),transparent 50%,rgba(12,10,8,.65))"}}/>
        {/* 卦象 */}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",color:dimmed?"rgba(100,140,220,.75)":"rgba(200,168,75,.85)"}}>
          <HexLines lines={honLines||[0,0,0,0,0,0]} size={68}/>
        </div>
        {/* 卦名 */}
        <div style={{position:"absolute",bottom:"14px",left:"18px"}}>
          <div style={{fontSize:"9px",color:dimmed?"rgba(100,140,220,.5)":"rgba(200,168,75,.5)",letterSpacing:".22em",marginBottom:"3px"}}>第 {hex.num} 卦</div>
          <div style={{fontSize:"21px",fontWeight:300,letterSpacing:".2em",color:"rgba(255,248,230,.94)",textShadow:"0 2px 12px rgba(0,0,0,.95)"}}>{hex.name}</div>
        </div>
        {/* 上下卦バッジ */}
        <div style={{position:"absolute",top:"12px",right:"14px",display:"flex",gap:"5px"}}>
          {[hex.upper,hex.lower].map((t,i)=>(
            <span key={i} style={{fontSize:"10px",padding:"2px 8px",background:"rgba(0,0,0,.6)",border:`1px solid ${TRIGRAMS[t]?.color}44`,color:TRIGRAMS[t]?.color,borderRadius:"2px",backdropFilter:"blur(4px)"}}>
              {TRIGRAMS[t]?.symbol} {t}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return(
    <div style={{minHeight:"100vh",background:"#12100e",color:"#e8dcc0",fontFamily:"'Noto Serif JP','Georgia',serif"}}>
      <style>{CSS}</style>
      {/* 背景テクスチャ */}
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at 20% 50%,rgba(80,60,20,.08) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(60,40,10,.06) 0%,transparent 50%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(200,168,75,.015) 40px,rgba(200,168,75,.015) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(200,168,75,.015) 40px,rgba(200,168,75,.015) 41px)",pointerEvents:"none",zIndex:0}}/>

      {/* ヘッダー */}
      <header style={{position:"fixed",top:0,left:0,right:0,height:"52px",borderBottom:"1px solid rgba(200,168,75,.12)",background:"rgba(18,16,14,.96)",backdropFilter:"blur(16px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <div className="float" style={{width:"30px",height:"30px",borderRadius:"50%",border:"1px solid rgba(200,168,75,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",color:"#c8a84b",background:"rgba(200,168,75,.06)"}}>☯</div>
          <div>
            <div style={{fontSize:"13px",letterSpacing:".25em",color:"#c8a84b",lineHeight:1}}>易 経</div>
            <div style={{fontSize:"8px",letterSpacing:".15em",color:"#4a3e20",marginTop:"1px"}}>I·CHING·ORACLE</div>
          </div>
        </div>
        <nav style={{display:"flex"}}>
          {[["oracle","占 い"],["dict","六十四卦"],["learn","学 習"],["journal","占 記"]].map(([id,lb])=>(
            <button key={id} className={`tb ${tab===id?"on":""}`} onClick={()=>{setTab(id);if(id==="oracle")setSub("cast")}}>{lb}</button>
          ))}
        </nav>
      </header>

      <main style={{paddingTop:"52px",minHeight:"100vh",position:"relative",zIndex:1}}>

        {/* ══ 占い ══ */}
        {tab==="oracle"&&(
          <div style={{maxWidth:"560px",margin:"0 auto",padding:"36px 16px"}}>
            <div style={{display:"flex",gap:"3px",marginBottom:"28px",borderBottom:"1px solid rgba(200,168,75,.08)",paddingBottom:"12px"}}>
              {[["cast","卦を立てる"],["result","結 果"]].map(([id,lb])=>(
                <button key={id} className={`tb ${sub===id?"on":""}`} onClick={()=>setSub(id)} style={{padding:"6px 14px"}}>{lb}</button>
              ))}
            </div>

            {/* ── 卦を立てる ── */}
            {sub==="cast"&&<>
              {/* タイトル */}
              <div className="fu" style={{textAlign:"center",marginBottom:"32px"}}>
                <div style={{fontSize:"11px",letterSpacing:".3em",color:"#6a5830",marginBottom:"10px"}}>◈ 心の問いを天地に問う ◈</div>
                <div style={{width:"60px",height:"1px",background:"linear-gradient(90deg,transparent,rgba(200,168,75,.4),transparent)",margin:"0 auto"}}/>
              </div>

              {/* 悩み入力 */}
              <div className="fu1" style={{marginBottom:"28px",position:"relative"}}>
                <label style={{fontSize:"11px",color:"#7a6530",letterSpacing:".18em",display:"block",marginBottom:"8px"}}>▸ 相談・問い（任意）</label>
                <textarea className="inp" placeholder="心に浮かぶ悩みや問いを、静かに言葉にしてください..." value={question} onChange={e=>setQuestion(e.target.value)}/>
                <div style={{position:"absolute",bottom:"10px",right:"12px",fontSize:"10px",color:"#4a3e20"}}>{question.length}/200</div>
              </div>

              {/* コイン演出エリア */}
              <div className="fu2" style={{textAlign:"center",marginBottom:"32px"}}>
                <div style={{marginBottom:"16px",fontSize:"11px",color:"#6a5830",letterSpacing:".2em"}}>三枚の銭を六度投じ、天地の声を聴く</div>

                {/* 3枚コインの視覚 */}
                <div style={{display:"flex",justifyContent:"center",gap:"12px",marginBottom:"24px"}}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{width:"36px",height:"36px",borderRadius:"50%",background:"radial-gradient(circle at 35% 35%,#d4a84b,#7a5820)",border:"1px solid rgba(200,168,75,.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",boxShadow:"0 2px 8px rgba(200,168,75,.3)",opacity:casting?(.4+i*.2):1,transition:"opacity .3s"}}>
                      ☯
                    </div>
                  ))}
                </div>

                {/* 占うボタン（大きなコイン） */}
                <button
                  className={`cbtn-coin ${coinSpin?"spinning":""}`}
                  onClick={handleCast}
                  disabled={casting}
                  style={{marginBottom:"12px"}}
                >
                  {casting?"…":"卜"}
                </button>
                <div style={{fontSize:"11px",color:"#5a4820",letterSpacing:".25em",marginTop:"8px"}}>
                  {casting?`第 ${castStep} 爻を生成中…`:"占 う"}
                </div>
              </div>

              {/* 爻生成インジケーター */}
              {casting&&(
                <div style={{display:"flex",justifyContent:"center",gap:"10px",marginBottom:"16px"}}>
                  {Array.from({length:6}).map((_,i)=>(
                    <div key={i} style={{width:"10px",height:"10px",borderRadius:"50%",background:i<castStep?"#c8a84b":"rgba(200,168,75,.15)",transition:"all .3s",boxShadow:i<castStep?"0 0 8px rgba(200,168,75,.6)":"none"}}/>
                  ))}
                </div>
              )}
            </>}

            {/* ── 結果 ── */}
            {sub==="result"&&!curHex&&(
              <div style={{textAlign:"center",padding:"70px 0"}}>
                <div style={{fontSize:"40px",color:"rgba(200,168,75,.2)",marginBottom:"16px"}}>☯</div>
                <p style={{fontSize:"12px",color:"#4a3e20",letterSpacing:".15em"}}>まず「卦を立てる」で占いを行ってください</p>
              </div>
            )}

            {sub==="result"&&curHex&&(()=>{
              const honLines=castLines?castLines.map(v=>v%2===1?1:0):[0,0,0,0,0,0];
              return <>
                {/* 本卦バナー */}
                <div className="ink fu" style={{marginBottom:"16px"}}>
                  <div className="lbl" style={{marginBottom:"6px"}}>◈ 本 卦</div>
                  <Banner hex={curHex} lines={honLines}/>
                </div>

                {/* 変爻インジケーター */}
                {castLines&&castLines.some(v=>v===6||v===9)&&(
                  <div className="fu1" style={{marginBottom:"14px",padding:"10px 14px",background:"rgba(180,130,20,.06)",border:"1px solid rgba(200,168,75,.2)",borderRadius:"4px"}}>
                    <div className="lbl" style={{color:"#c8a060",marginBottom:"7px"}}>◈ 変 爻（へんこう）</div>
                    <div style={{display:"flex",gap:"7px",flexWrap:"wrap"}}>
                      {[...castLines].map((v,i)=>{
                        if(v===6)return <span key={i} style={{fontSize:"11px",padding:"2px 9px",background:"rgba(60,100,220,.1)",border:"1px solid rgba(80,120,220,.3)",color:"#8ab0e8",borderRadius:"3px"}}>第{i+1}爻 老陰→陽</span>;
                        if(v===9)return <span key={i} style={{fontSize:"11px",padding:"2px 9px",background:"rgba(200,140,40,.1)",border:"1px solid rgba(200,160,40,.3)",color:"#d4a84b",borderRadius:"3px"}}>第{i+1}爻 老陽→陰</span>;
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* 変卦バナー */}
                {henHex&&henLines&&(
                  <div className="fu1" style={{marginBottom:"18px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                      <div className="lbl" style={{color:"#7a90c8",margin:0}}>◈ 之 卦（変卦）</div>
                      <div style={{fontSize:"10px",color:"#4a5568"}}>変爻が変化した先の卦</div>
                    </div>
                    <Banner hex={henHex} lines={henLines} dimmed={true}/>
                  </div>
                )}

                {/* 問い */}
                {question&&<div className="fu" style={{marginBottom:"16px",padding:"10px 14px",borderLeft:"2px solid rgba(200,168,75,.3)",background:"rgba(200,168,75,.03)",borderRadius:"0 4px 4px 0"}}>
                  <div style={{fontSize:"10px",color:"#6a5830",marginBottom:"3px",letterSpacing:".1em"}}>相談内容</div>
                  <p style={{fontSize:"13px",color:"#c8b880",fontStyle:"italic"}}>「{question}」</p>
                </div>}

                {/* キーワード */}
                <div className="fu1" style={{marginBottom:"16px",display:"flex",gap:"6px",flexWrap:"wrap"}}>
                  {(curHex.keyword||"").split("・").map((k,i)=>(
                    <span key={i} style={{fontSize:"11px",padding:"3px 10px",background:"rgba(200,168,75,.07)",border:"1px solid rgba(200,168,75,.18)",color:"#c8a84b",borderRadius:"2px"}}>{k}</span>
                  ))}
                </div>

                {/* 上下卦 */}
                <div className="fu1" style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
                  {[["上卦",curHex.upper],["下卦",curHex.lower]].map(([lb,t])=>(
                    <div key={lb} style={{flex:1,padding:"11px",background:"rgba(20,16,8,.7)",border:`1px solid ${TRIGRAMS[t]?.color}22`,borderRadius:"4px",textAlign:"center"}}>
                      <div style={{fontSize:"9px",color:"#4a3e20",marginBottom:"5px",letterSpacing:".12em"}}>{lb}</div>
                      <div style={{display:"flex",justifyContent:"center",marginBottom:"4px"}}><TriLines lines={TRIGRAMS[t]?.lines||[0,0,0]} size={24} color={TRIGRAMS[t]?.color}/></div>
                      <div style={{fontSize:"11px",color:TRIGRAMS[t]?.color}}>{t}（{TRIGRAMS[t]?.element}）</div>
                    </div>
                  ))}
                </div>

                {/* 卦辞 */}
                <div className="fu2" style={{padding:"14px",background:"rgba(20,16,8,.7)",border:"1px solid rgba(200,168,75,.1)",borderRadius:"4px",marginBottom:"10px"}}>
                  <div className="lbl">◈ 卦 辞</div>
                  <p style={{fontSize:"15px",fontStyle:"italic",color:"#e8d880",lineHeight:"2",marginBottom:"10px",textAlign:"center"}}>「{curHex.guaci}」</p>
                  <p style={{fontSize:"13px",color:"#b0a070",lineHeight:"2"}}>{curHex.meaning}</p>
                </div>

                {/* 彖伝・象伝 */}
                {curHex.tuan&&<div className="fu2" style={{padding:"12px 14px",background:"rgba(15,20,30,.5)",border:"1px solid rgba(80,120,200,.12)",borderRadius:"4px",marginBottom:"9px"}}>
                  <div className="lbl" style={{color:"#5a7ab8"}}>◈ 彖 伝</div>
                  <p style={{fontSize:"12px",color:"#7890b8",lineHeight:"2"}}>{curHex.tuan}</p>
                </div>}
                {curHex.xiang&&<div className="fu2" style={{padding:"12px 14px",background:"rgba(10,20,15,.5)",border:"1px solid rgba(80,160,100,.12)",borderRadius:"4px",marginBottom:"9px"}}>
                  <div className="lbl" style={{color:"#5a9870"}}>◈ 象 伝</div>
                  <p style={{fontSize:"12px",color:"#7aa890",lineHeight:"2"}}>{curHex.xiang}</p>
                </div>}

                {/* 爻辞 */}
                {curHex.yaoci&&curHex.yaoci.length>0&&(
                  <div className="fu3" style={{marginBottom:"12px"}}>
                    <div className="lbl">◈ 爻 辞（こうじ）</div>
                    {castLines&&castLines.some(v=>v===6||v===9)&&(
                      <div style={{padding:"10px 13px",background:"rgba(180,140,20,.06)",border:"1px solid rgba(200,168,75,.22)",borderRadius:"4px",marginBottom:"10px"}}>
                        <div style={{fontSize:"10px",color:"#c8a060",letterSpacing:".15em",marginBottom:"8px"}}>◉ 変爻（特に注目）</div>
                        {castLines.map((v,i)=>{
                          if(v!==6&&v!==9)return null;
                          const y=curHex.yaoci[i];
                          if(!y)return null;
                          return(
                            <div key={i} style={{marginBottom:"8px",padding:"9px 12px",background:"rgba(200,168,75,.04)",border:"1px solid rgba(200,168,75,.14)",borderRadius:"3px"}}>
                              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
                                <span style={{fontSize:"12px",color:"#d4a840",fontWeight:600}}>{y.line}</span>
                                <span style={{fontSize:"9px",padding:"1px 6px",background:v===9?"rgba(200,120,40,.15)":"rgba(80,120,220,.15)",border:v===9?"1px solid rgba(200,120,40,.3)":"1px solid rgba(80,120,220,.3)",color:v===9?"#d4a060":"#8ab0e8",borderRadius:"2px"}}>{v===9?"老陽→陰":"老陰→陽"}</span>
                              </div>
                              <p style={{fontSize:"13px",fontStyle:"italic",color:"#e4d890",marginBottom:"4px",lineHeight:"1.8"}}>「{y.text}」</p>
                              <p style={{fontSize:"12px",color:"#a09050",lineHeight:"1.9"}}>{y.comment}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div style={{fontSize:"10px",color:"#4a3e20",letterSpacing:".1em",marginBottom:"5px"}}>全爻辞（タップで展開）</div>
                    {curHex.yaoci.map((y,i)=>{
                      const rawVal=castLines?castLines[i]:null;
                      const isHen=rawVal===6||rawVal===9;
                      return(
                        <div key={i} className="yr" onClick={()=>setExpandYao(expandYao===i?null:i)} style={{borderColor:isHen?"rgba(200,168,75,.3)":"rgba(200,168,75,.1)"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
                              <span style={{fontSize:"12px",color:isHen?"#d4a840":"#c8a84b",fontWeight:isHen?"600":"400"}}>{y.line}</span>
                              {isHen&&<span style={{fontSize:"9px",padding:"1px 5px",background:"rgba(200,168,75,.1)",color:"#c8a040",borderRadius:"2px",border:"1px solid rgba(200,168,75,.25)"}}>変爻</span>}
                            </div>
                            <span style={{fontSize:"10px",color:"#5a4820"}}>{expandYao===i?"▲":"▼"}</span>
                          </div>
                          {expandYao===i&&<div style={{padding:"0 12px 10px",borderTop:`1px solid ${isHen?"rgba(200,168,75,.15)":"rgba(200,168,75,.07)"}`}}>
                            <p style={{fontSize:"13px",fontStyle:"italic",color:isHen?"#e4d890":"#d4c8a0",marginBottom:"6px",lineHeight:"1.8"}}>「{y.text}」</p>
                            <p style={{fontSize:"12px",color:"#8a8060",lineHeight:"1.9"}}>{y.comment}</p>
                            {isHen&&<p style={{fontSize:"11px",color:"#a08040",marginTop:"6px",padding:"4px 8px",background:"rgba(200,168,75,.04)",borderRadius:"3px",borderLeft:"2px solid rgba(200,168,75,.3)"}}>※この爻が変じて之卦へと展開します</p>}
                          </div>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 示唆 */}
                <div className="fu3" style={{padding:"12px 14px",background:"rgba(20,16,8,.7)",border:"1px solid rgba(200,168,75,.12)",borderRadius:"4px",marginBottom:"14px"}}>
                  <div className="lbl">◈ 示 唆</div>
                  <p style={{fontSize:"13px",color:"#c8a84b",fontStyle:"italic",lineHeight:"2.1",textAlign:"center"}}>{curHex.advice}</p>
                </div>

                {/* AI解釈 */}
                <div style={{padding:"16px",background:"rgba(30,20,50,.4)",border:"1px solid rgba(120,80,200,.18)",borderRadius:"5px",marginBottom:"20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
                    <div>
                      <div style={{fontSize:"10px",color:"#8060c0",letterSpacing:".2em",marginBottom:"3px"}}>◈ 易経の指導者による解釈</div>
                      <div style={{fontSize:"9px",color:"#5a4878"}}>5つのステップで現代の指針を導く</div>
                    </div>
                    <button className="cbtn" style={{padding:"7px 16px",fontSize:"11px",letterSpacing:".12em",background:"rgba(100,60,180,.2)",borderColor:"rgba(120,80,200,.4)",color:"#a080d8"}} onClick={getAi} disabled={aiLoading}>
                      {aiLoading?"解釈中…":"解釈を求める"}
                    </button>
                  </div>
                  {aiLoading&&<p style={{color:"#806ab0",fontSize:"12px",textAlign:"center",padding:"12px 0"}}>易経の指導者が卦を読み解いています…</p>}
                  {aiError&&<p style={{color:"#906870",fontSize:"11px",marginBottom:"6px"}}>{aiError}</p>}
                  {aiText&&<div style={{fontSize:"13px",lineHeight:"2.2",color:"#c0b0e0",whiteSpace:"pre-wrap"}}>{aiText}</div>}
                  {!aiLoading&&!aiText&&!aiError&&<p style={{fontSize:"12px",color:"#5a4870",textAlign:"center",padding:"8px 0"}}>ボタンを押すと5つのステップで深い解釈が生成されます</p>}
                </div>

                {/* アクションボタン */}
                <div style={{display:"flex",gap:"9px"}}>
                  <button className="cbtn" style={{flex:1,fontSize:"12px",padding:"11px",letterSpacing:".15em"}} onClick={()=>{setSub("cast");setCastLines(null);setCurHex(null);setHenHex(null);setHenLines(null);setQuestion("");setAiText("");setAiError("");}}>新たに問う</button>
                  <button className="cbtn cbtn-s" style={{flex:1,fontSize:"12px",padding:"11px",letterSpacing:".15em"}} onClick={()=>{setDictSel(curHex);setTab("dict");}}>辞典で見る</button>
                </div>
              </>;
            })()}
          </div>
        )}

        {/* ══ 六十四卦辞典 ══ */}
        {tab==="dict"&&!dictSel&&(
          <div style={{maxWidth:"860px",margin:"0 auto",padding:"36px 16px"}}>
            <div className="fu" style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"22px"}}>
              <h2 style={{fontSize:"11px",letterSpacing:".28em",color:"#7a6530"}}>▸ 六十四卦辞典</h2>
              <input className="inp" style={{maxWidth:"200px",padding:"7px 12px",fontSize:"12px"}} placeholder="番号・卦名・キーワード…" value={dictSearch} onChange={e=>setDictSearch(e.target.value)}/>
              <span style={{fontSize:"10px",color:"#4a3e20"}}>{filtered.length}卦</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(138px,1fr))",gap:"9px"}}>
              {filtered.map(hex=>(
                <div key={hex.num} className="card" onClick={()=>{setDictSel(hex);setExpandYao(null);}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
                    <span style={{fontSize:"9px",color:"#4a3e20"}}>{String(hex.num).padStart(2,"0")}</span>
                    <div style={{color:"rgba(200,168,75,.55)",transform:"scale(.6)",transformOrigin:"right top"}}><HexLines lines={hex.lines} size={30}/></div>
                  </div>
                  <div style={{fontSize:"16px",fontWeight:600,marginBottom:"2px",color:"#e8d880"}}>{hex.kanji}</div>
                  <div style={{fontSize:"10px",color:"#8a7540",marginBottom:"4px"}}>{hex.name}</div>
                  <div style={{fontSize:"9px",color:"#4a3e20",lineHeight:1.7}}>{(hex.keyword||"").split("・")[0]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="dict"&&dictSel&&(
          <div style={{maxWidth:"580px",margin:"0 auto",padding:"36px 16px"}}>
            <button className="tb" style={{marginBottom:"18px",color:"#7a6530"}} onClick={()=>{setDictSel(null);setExpandYao(null);}}>← 辞典に戻る</button>
            <div className="fu"><Banner hex={dictSel} lines={dictSel.lines}/></div>
            <div className="div"/>
            <div className="fu1" style={{padding:"10px 14px",background:"rgba(200,168,75,.05)",border:"1px solid rgba(200,168,75,.15)",borderRadius:"3px",marginBottom:"14px"}}>
              <span style={{fontSize:"11px",color:"#c8a84b"}}>{dictSel.keyword}</span>
            </div>
            {dictSel.guaci&&<div className="fu1" style={{padding:"14px",background:"rgba(20,16,8,.7)",border:"1px solid rgba(200,168,75,.1)",borderRadius:"4px",marginBottom:"10px"}}>
              <div className="lbl">卦 辞</div>
              <p style={{fontSize:"15px",fontStyle:"italic",color:"#e8d880",lineHeight:"2",marginBottom:"10px",textAlign:"center"}}>「{dictSel.guaci}」</p>
              <p style={{fontSize:"13px",color:"#b0a070",lineHeight:"2"}}>{dictSel.meaning}</p>
            </div>}
            {dictSel.tuan&&<div className="fu2" style={{padding:"12px 14px",background:"rgba(15,20,30,.5)",border:"1px solid rgba(80,120,200,.12)",borderRadius:"4px",marginBottom:"9px"}}>
              <div className="lbl" style={{color:"#5a7ab8"}}>彖 伝</div>
              <p style={{fontSize:"12px",color:"#7890b8",lineHeight:"2"}}>{dictSel.tuan}</p>
            </div>}
            {dictSel.xiang&&<div className="fu2" style={{padding:"12px 14px",background:"rgba(10,20,15,.5)",border:"1px solid rgba(80,160,100,.12)",borderRadius:"4px",marginBottom:"9px"}}>
              <div className="lbl" style={{color:"#5a9870"}}>象 伝</div>
              <p style={{fontSize:"12px",color:"#7aa890",lineHeight:"2"}}>{dictSel.xiang}</p>
            </div>}
            {dictSel.yaoci&&dictSel.yaoci.length>0&&<div className="fu3" style={{marginBottom:"10px"}}>
              <div className="lbl">爻 辞</div>
              {dictSel.yaoci.map((y,i)=>(
                <div key={i} className="yr" onClick={()=>setExpandYao(expandYao===i?null:i)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px"}}>
                    <span style={{fontSize:"12px",color:"#c8a84b"}}>{y.line}</span>
                    <span style={{fontSize:"10px",color:"#5a4820"}}>{expandYao===i?"▲":"▼"}</span>
                  </div>
                  {expandYao===i&&<div style={{padding:"0 12px 10px",borderTop:"1px solid rgba(200,168,75,.08)"}}>
                    <p style={{fontSize:"13px",fontStyle:"italic",color:"#d4c890",marginBottom:"6px",lineHeight:"1.8"}}>「{y.text}」</p>
                    <p style={{fontSize:"12px",color:"#8a8060",lineHeight:"1.9"}}>{y.comment}</p>
                  </div>}
                </div>
              ))}
            </div>}
            {dictSel.advice&&<div className="fu3" style={{padding:"12px 14px",background:"rgba(20,16,8,.7)",border:"1px solid rgba(200,168,75,.1)",borderRadius:"4px",marginBottom:"10px"}}>
              <div className="lbl">示 唆</div>
              <p style={{fontSize:"13px",color:"#c8a84b",fontStyle:"italic",lineHeight:"2"}}>{dictSel.advice}</p>
            </div>}
            {dictSel.history&&<div className="fu4" style={{padding:"12px 14px",background:"rgba(20,14,8,.6)",border:"1px solid rgba(140,100,40,.12)",borderRadius:"4px",marginBottom:"14px"}}>
              <div className="lbl" style={{color:"#907040"}}>思想背景・歴史</div>
              <p style={{fontSize:"12px",color:"#907860",lineHeight:"2"}}>{dictSel.history}</p>
            </div>}
            <button className="cbtn" style={{width:"100%",fontSize:"12px",padding:"12px",letterSpacing:".18em"}} onClick={()=>{setQuestion("");setCurHex(dictSel);setCastLines(dictSel.lines.map(v=>v===1?7:8));setSub("result");setTab("oracle");}}>この卦で占結果を見る</button>
          </div>
        )}

        {/* ══ 学習 ══ */}
        {tab==="learn"&&(
          <div style={{maxWidth:"640px",margin:"0 auto",padding:"36px 16px"}}>
            <div className="ln">
              {[["intro","易経とは"],["yinyang","陰陽の理"],["trigram","八卦を知る"],["structure","卦の構造"],["quiz","理解テスト"]].map(([id,lb])=>(
                <button key={id} className={`lb ${learnSec===id?"on":""}`} onClick={()=>{setLearnSec(id);if(id==="quiz")resetQ();}}>{lb}</button>
              ))}
            </div>

            {learnSec==="intro"&&<div className="fu">
              <h3 style={{fontSize:"18px",fontWeight:300,letterSpacing:".15em",marginBottom:"18px",color:"#c8a84b"}}>易経とは何か</h3>
              <div style={{lineHeight:"2.4",fontSize:"13px",color:"#b0a070"}}>
                <p style={{marginBottom:"14px"}}>易経（I Ching）は3000年以上前の中国で成立した世界最古の哲学書・占術書の一つです。<span style={{color:"#c8a84b"}}>伏羲（ふっき）</span>が八卦を発見し、<span style={{color:"#c8a84b"}}>文王</span>が六十四卦と卦辞・爻辞を整え、<span style={{color:"#c8a84b"}}>孔子</span>が十翼を加えて完成させたとされます。</p>
                <div className="div"/>
                <h4 style={{color:"#9a8050",marginBottom:"10px",fontSize:"13px"}}>▸ 三層構造</h4>
                {[["卦辞","各卦全体の意味・状況・吉凶を示す言葉"],["彖伝","卦辞を哲学的に解説した文"],["象伝","卦の形象と各爻の行動指針"],["爻辞","六本の各爻それぞれの具体的な言葉"]].map(([t,d])=>(
                  <div key={t} style={{padding:"8px 12px",marginBottom:"6px",background:"rgba(20,16,8,.7)",border:"1px solid rgba(200,168,75,.1)",borderRadius:"4px",display:"flex",gap:"10px"}}>
                    <span style={{color:"#c8a84b",fontSize:"12px",minWidth:"38px"}}>{t}</span>
                    <span style={{color:"#9a9060",fontSize:"12px"}}>{d}</span>
                  </div>
                ))}
                <div className="div"/>
                <h4 style={{color:"#9a8050",marginBottom:"10px",fontSize:"13px"}}>▸ 易の三義</h4>
                {[["変易","万物は常に変化する"],["不易","変化の中にも変わらぬ原則がある"],["易簡","天地の道は単純明快である"]].map(([t,d])=>(
                  <div key={t} style={{display:"flex",gap:"11px",marginBottom:"8px"}}>
                    <span style={{color:"#c8a84b",fontSize:"12px",minWidth:"32px"}}>{t}</span>
                    <span style={{color:"#8a8060",fontSize:"12px"}}>{d}</span>
                  </div>
                ))}
              </div>
            </div>}

            {learnSec==="yinyang"&&<div className="fu">
              <h3 style={{fontSize:"18px",fontWeight:300,letterSpacing:".15em",marginBottom:"18px",color:"#c8a84b"}}>陰陽の理</h3>
              <div style={{display:"flex",gap:"12px",marginBottom:"22px"}}>
                {[{lb:"陽爻（━━）",desc:"剛・動・光・男・天・奇数",color:"#c8a84b",yang:true},{lb:"陰爻（━ ━）",desc:"柔・静・暗・女・地・偶数",color:"#7a9ab8",yang:false}].map(({lb,desc,color,yang})=>(
                  <div key={lb} style={{flex:1,padding:"14px",background:"rgba(20,16,8,.7)",border:`1px solid ${color}22`,borderRadius:"4px",textAlign:"center"}}>
                    <svg width={48} height={11} viewBox="0 0 48 11" style={{marginBottom:"9px"}}>
                      {yang?<rect x={0} y={0} width={48} height={9} fill={color} rx={1}/>:<g><rect x={0} y={0} width={19} height={9} fill={color} rx={1}/><rect x={29} y={0} width={19} height={9} fill={color} rx={1}/></g>}
                    </svg>
                    <div style={{fontSize:"11px",color,marginBottom:"6px"}}>{lb}</div>
                    <div style={{fontSize:"11px",color:"#5a5040",lineHeight:"1.9"}}>{desc}</div>
                  </div>
                ))}
              </div>
              <div className="div"/>
              <h4 style={{color:"#9a8050",marginBottom:"10px",fontSize:"13px"}}>▸ 太極から八卦への展開</h4>
              {[["太 極","万物の根源","☯"],["両 儀","陰と陽に分かれる","⚊⚋"],["四 象","さらに二分","⚌⚍⚎⚏"],["八 卦","八つの卦が生まれる","☰☱☲☳☴☵☶☷"],["六十四卦","八卦を上下に重ねる","☰…☷"]].map(([lb,d,sym])=>(
                <div key={lb} style={{display:"flex",alignItems:"center",gap:"11px",padding:"8px 12px",marginBottom:"6px",background:"rgba(20,16,8,.7)",border:"1px solid rgba(200,168,75,.1)",borderRadius:"3px"}}>
                  <span style={{color:"#c8a84b",fontSize:"12px",minWidth:"44px"}}>{lb}</span>
                  <span style={{color:"#907840",fontSize:"15px",minWidth:"50px"}}>{sym}</span>
                  <span style={{fontSize:"12px",color:"#8a8060"}}>{d}</span>
                </div>
              ))}
            </div>}

            {learnSec==="trigram"&&<div className="fu">
              <h3 style={{fontSize:"18px",fontWeight:300,letterSpacing:".15em",marginBottom:"18px",color:"#c8a84b"}}>八卦を知る</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:"10px"}}>
                {Object.entries(TRIGRAMS).map(([name,t])=>(
                  <div key={name} style={{padding:"13px",background:"rgba(20,16,8,.7)",border:`1px solid ${t.color}22`,borderRadius:"4px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"9px",marginBottom:"9px"}}>
                      <TriLines lines={t.lines} size={26} color={t.color}/>
                      <div><div style={{fontSize:"15px",color:t.color,fontWeight:600}}>{name}</div><div style={{fontSize:"10px",color:"#4a3e20"}}>{t.symbol}</div></div>
                    </div>
                    {[["自然",t.element],["性質",t.nature],["方位",t.direction],["家族",t.family]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:"2px"}}>
                        <span style={{fontSize:"10px",color:"#4a3e20"}}>{k}</span>
                        <span style={{fontSize:"10px",color:`${t.color}cc`}}>{v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>}

            {learnSec==="structure"&&<div className="fu">
              <h3 style={{fontSize:"18px",fontWeight:300,letterSpacing:".15em",marginBottom:"18px",color:"#c8a84b"}}>卦の構造を読む</h3>
              <div style={{lineHeight:"2.3",fontSize:"13px",color:"#b0a070"}}>
                <h4 style={{color:"#9a8050",marginBottom:"12px",fontSize:"13px"}}>▸ 六爻の構造</h4>
                <div style={{display:"flex",gap:"16px",alignItems:"flex-start",marginBottom:"20px"}}>
                  <div style={{color:"#c8a84b",paddingTop:"3px",flexShrink:0}}><HexLines lines={[1,0,1,0,1,1]} size={46}/></div>
                  <div style={{flex:1}}>
                    {[["上爻","過ぎた状況・転換点",""],["五爻","最良の位（指導者）","★"],["四爻","近臣・大臣の位",""],["三爻","境界・最もリスク","⚠"],["二爻","内卦の中心・良い位",""],["初爻","始まり・潜在",""]].map(([n,d,note])=>(
                      <div key={n} style={{display:"flex",gap:"7px",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(200,168,75,.06)"}}>
                        <span style={{fontSize:"11px",color:"#c8a84b",minWidth:"38px"}}>{n}</span>
                        {note&&<span style={{fontSize:"10px",color:"#a07040"}}>{note}</span>}
                        <span style={{fontSize:"11px",color:"#7a7050"}}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="div"/>
                <h4 style={{color:"#9a8050",marginBottom:"10px",fontSize:"13px"}}>▸ 変爻とは</h4>
                <p style={{marginBottom:"12px"}}>三枚銅銭法では6〜9の値が出ます。<span style={{color:"#c8a84b"}}>6（老陰）</span>は陽に変じ、<span style={{color:"#c8a84b"}}>9（老陽）</span>は陰に変じます。これが変爻です。変爻によって本卦から之卦へ変化し、状況の展開を示します。</p>
                <div className="div"/>
                <h4 style={{color:"#9a8050",marginBottom:"10px",fontSize:"13px"}}>▸ 中（ちゅう）の重要性</h4>
                <p>二爻と五爻に適切な爻があることを<span style={{color:"#c8a84b"}}>「中を得る」</span>と言います。中庸・バランスの象徴で最も重要な概念の一つです。</p>
              </div>
            </div>}

            {learnSec==="quiz"&&<div className="fu">
              <h3 style={{fontSize:"18px",fontWeight:300,letterSpacing:".15em",marginBottom:"20px",color:"#c8a84b"}}>理解テスト</h3>
              {!qDone?<>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"14px"}}>
                  <span style={{fontSize:"11px",color:"#5a4820"}}>問 {qIdx+1} / {QZ.length}</span>
                  <span style={{fontSize:"11px",color:"#c8a84b"}}>スコア {qScore}/{qIdx}</span>
                </div>
                <div style={{padding:"16px",background:"rgba(20,16,8,.7)",border:"1px solid rgba(200,168,75,.12)",borderRadius:"4px",marginBottom:"8px"}}>
                  <p style={{fontSize:"14px",lineHeight:"2",color:"#e8d880"}}>{QZ[qIdx].q}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"12px"}}>
                  {QZ[qIdx].opts.map((opt,i)=>(
                    <button key={i} className={`qo ${qAns!==null?(i===QZ[qIdx].ans?"ok":qAns===i?"ng":""):""}`} disabled={qAns!==null} onClick={()=>ansQ(i)}>{opt}</button>
                  ))}
                </div>
                {qAns!==null&&<>
                  <div style={{padding:"11px 13px",background:"rgba(40,80,40,.2)",border:"1px solid rgba(80,160,80,.2)",borderRadius:"4px",marginBottom:"11px"}}>
                    <p style={{fontSize:"12px",color:"#90c090",lineHeight:"1.9"}}>{QZ[qIdx].exp}</p>
                  </div>
                  <button className="cbtn" style={{width:"100%",fontSize:"12px",padding:"11px"}} onClick={nextQ}>{qIdx>=QZ.length-1?"結果を見る":"次の問題"}</button>
                </>}
              </>:(
                <div style={{textAlign:"center",padding:"38px 0"}}>
                  <div style={{fontSize:"44px",color:"#c8a84b",marginBottom:"13px"}}>{qScore>=QZ.length*.8?"☯":qScore>=QZ.length*.5?"☴":"☵"}</div>
                  <h4 style={{fontSize:"20px",fontWeight:300,marginBottom:"7px",letterSpacing:".14em",color:"#e8d880"}}>{qScore}/{QZ.length} 正解</h4>
                  <p style={{fontSize:"13px",color:"#7a6840",marginBottom:"22px"}}>{qScore>=QZ.length*.8?"優秀です。易の道が開けています。":qScore>=QZ.length*.5?"基礎は身についています。更なる学びを。":"まだ学びの途中。繰り返しが力となります。"}</p>
                  <button className="cbtn" onClick={resetQ}>もう一度挑戦する</button>
                </div>
              )}
            </div>}
          </div>
        )}

        {/* ══ 占記 ══ */}
        {tab==="journal"&&(
          <div style={{maxWidth:"600px",margin:"0 auto",padding:"36px 16px"}}>
            <div className="fu" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
              <h2 style={{fontSize:"11px",letterSpacing:".28em",color:"#7a6530"}}>▸ 占 記</h2>
              {journal.length>0&&(
                <button style={{background:"none",border:"1px solid rgba(200,168,75,.15)",color:"#5a4820",fontSize:"10px",padding:"4px 10px",borderRadius:"3px",cursor:"pointer",fontFamily:"inherit",letterSpacing:".1em"}}
                  onClick={()=>{if(window.confirm("占記をすべて削除しますか？"))setJournal([]);}}>
                  全件削除
                </button>
              )}
            </div>
            {journal.length===0?(
              <div style={{textAlign:"center",padding:"70px 0"}}>
                <div style={{fontSize:"40px",color:"rgba(200,168,75,.15)",marginBottom:"16px"}}>☰</div>
                <p style={{fontSize:"12px",color:"#4a3e20",letterSpacing:".12em"}}>占いを行うと自動的に記録されます</p>
                <p style={{fontSize:"11px",color:"#3a3018",marginTop:"6px"}}>アプリを閉じても記録は残ります</p>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:"11px"}}>
                {journal.map(e=>(
                  <div key={e.id} className="card" style={{cursor:"default"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
                      <span style={{fontSize:"10px",color:"#5a4820"}}>{e.date} {e.time}</span>
                      <div style={{color:"rgba(200,168,75,.45)",transform:"scale(.55)",transformOrigin:"right top"}}><HexLines lines={e.lines||[0,0,0,0,0,0]} size={34}/></div>
                    </div>
                    {e.question&&<div style={{fontSize:"12px",color:"#8a7040",fontStyle:"italic",marginBottom:"6px",padding:"6px 10px",background:"rgba(200,168,75,.04)",borderLeft:"2px solid rgba(200,168,75,.2)",borderRadius:"0 3px 3px 0"}}>「{e.question}」</div>}
                    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                      <span style={{fontSize:"18px",color:"#c8a84b"}}>{e.hex?.kanji}</span>
                      <div>
                        <div style={{fontSize:"13px",color:"#e8d880"}}>{e.hex?.name}</div>
                        <div style={{fontSize:"9px",color:"#5a4820"}}>第{e.hex?.num}卦</div>
                      </div>
                      {e.henHex&&<div style={{marginLeft:"8px",padding:"2px 8px",background:"rgba(100,130,200,.1)",border:"1px solid rgba(100,130,200,.2)",borderRadius:"3px",fontSize:"10px",color:"#8090c0"}}>→ {e.henHex.name}</div>}
                    </div>
                    <input
                      style={{background:"rgba(10,8,4,.6)",border:"1px solid rgba(200,168,75,.12)",borderRadius:"3px",color:"#c8b870",padding:"6px 10px",fontFamily:"'Noto Serif JP',serif",fontSize:"12px",width:"100%",outline:"none"}}
                      placeholder="メモを追加…"
                      value={e.note||""}
                      onChange={ev=>setJournal(prev=>prev.map(en=>en.id===e.id?{...en,note:ev.target.value}:en))}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
