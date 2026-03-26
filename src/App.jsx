import { useState, useRef, useEffect, useCallback } from "react";

const A="#d52c2a",AB="#ff3b39",AD="#a82220",AG="rgba(213,44,42,0.30)",AGS="rgba(213,44,42,0.55)";
const BG="#060606",BGC="#0c0c0c",BGS="#131313",BGH="#1a1a1a",BD="#1a1a1a",TX="#e8e4e4",TX2="#8a8585",TX3="#4a4545";
const VER="1.2.0";
const fmt=s=>{if(!s||isNaN(s))return"0:00";const m=Math.floor(s/60),sc=Math.floor(s%60);return`${m}:${sc<10?"0":""}${sc}`;};

const I=({d,size=20})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
const Ic={
  play:s=><I size={s} d={<polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/>}/>,
  pause:s=><I size={s} d={<><rect x="5" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="15" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/></>}/>,
  prev:s=><I size={s} d={<><polygon points="11 19 2 12 11 5" fill="currentColor" stroke="none"/><polygon points="22 19 13 12 22 5" fill="currentColor" stroke="none"/></>}/>,
  next:s=><I size={s} d={<><polygon points="13 19 22 12 13 5" fill="currentColor" stroke="none"/><polygon points="2 19 11 12 2 5" fill="currentColor" stroke="none"/></>}/>,
  repeat:s=><I size={s} d={<><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></>}/>,
  repeat1:s=><I size={s} d={<><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/><text x="12" y="15" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" fontWeight="bold">1</text></>}/>,
  shuffle:s=><I size={s} d={<><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></>}/>,
  vol:s=><I size={s} d={<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19" fill="currentColor" stroke="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></>}/>,
  volM:s=><I size={s} d={<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19" fill="currentColor" stroke="none"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></>}/>,
  queue:s=><I size={s} d={<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/></>}/>,
  addQ:s=><I size={s} d={<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="15" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/><line x1="19" y1="16" x2="19" y2="22"/><line x1="16" y1="19" x2="22" y2="19"/></>}/>,
  music:s=><I size={s} d={<><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="currentColor" stroke="none"/><circle cx="18" cy="16" r="3" fill="currentColor" stroke="none"/></>}/>,
  plus:s=><I size={s} d={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}/>,
  x:s=><I size={s} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}/>,
  folder:s=><I size={s} d={<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>}/>,
  folderP:s=><I size={s} d={<><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></>}/>,
  trash:s=><I size={s} d={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>}/>,
  edit:s=><I size={s} d={<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>}/>,
  pin:s=><I size={s} d={<><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24z"/></>}/>,
  speaker:s=><I size={s} d={<><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="14" r="1" fill="currentColor"/><line x1="12" y1="6" x2="12.01" y2="6" strokeWidth="3" strokeLinecap="round"/></>}/>,
  drop:s=><I size={s} d={<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>}/>,
};

const Slider=({value,max,onChange,onDown,onUp,h=4})=>{const ref=useRef(null);const pct=max?(value/max)*100:0;const calc=e=>{const r=ref.current.getBoundingClientRect();return Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*max;};return<div ref={ref} className="sl-wrap" onMouseDown={e=>{onChange(calc(e));onDown?.();}} onMouseUp={onUp} onMouseMove={e=>{if(e.buttons===1)onChange(calc(e));}} style={{height:28,display:"flex",alignItems:"center",cursor:"pointer",position:"relative"}}><div style={{width:"100%",height:h,background:"#222",borderRadius:h,position:"relative",overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${AD},${AB})`,borderRadius:h,transition:onDown?"none":"width 0.08s"}}/></div><div className="sl-knob" style={{position:"absolute",left:`calc(${pct}% - 7px)`,top:"50%",transform:"translateY(-50%)",width:14,height:14,borderRadius:"50%",background:AB,boxShadow:`0 0 10px ${AGS}`,opacity:0,transition:"opacity 0.2s",pointerEvents:"none"}}/></div>;};

const ElasticSlider=({value,onChange,min=0,max=100,width=140})=>{const ref=useRef(null);const[dr,setDr]=useState(false);const[ov,setOv]=useState(0);const[rg,setRg]=useState("middle");const pct=max>min?((value-min)/(max-min))*100:0;const decay=(v,mx)=>mx===0?0:(2*(1/(1+Math.exp(-v/mx))-0.5))*mx;const upd=useCallback(e=>{if(!ref.current)return;const r=ref.current.getBoundingClientRect();if(e.clientX<r.left){setRg("left");setOv(decay(r.left-e.clientX,50));onChange(min);}else if(e.clientX>r.right){setRg("right");setOv(decay(e.clientX-r.right,50));onChange(max);}else{setRg("middle");setOv(0);onChange(Math.round((min+((e.clientX-r.left)/r.width)*(max-min))*100)/100);}},[min,max,onChange]);const onU=useCallback(()=>{setDr(false);setOv(0);setRg("middle");window.removeEventListener("pointermove",upd);window.removeEventListener("pointerup",onU);},[upd]);const onD=e=>{e.preventDefault();setDr(true);upd(e);window.addEventListener("pointermove",upd);window.addEventListener("pointerup",onU);};return<div style={{display:"flex",alignItems:"center",gap:10,userSelect:"none"}}><span style={{color:rg==="left"&&dr?AB:TX3,transition:"all 0.2s",transform:rg==="left"&&dr?`translateX(${-ov/3}px) scale(1.2)`:"none"}}>{Ic.volM(15)}</span><div ref={ref} onPointerDown={onD} style={{width,height:28,display:"flex",alignItems:"center",cursor:"grab",position:"relative",touchAction:"none"}}><div style={{width:"100%",height:6+(ov/50)*4,borderRadius:10,background:"rgba(255,255,255,0.08)",position:"relative",overflow:"hidden",transform:`scaleX(${1+ov/width}) scaleY(${1-(ov/50)*0.2})`,transformOrigin:rg==="left"?"right center":rg==="right"?"left center":"center",transition:dr?"none":"transform 0.5s cubic-bezier(0.34,1.56,0.64,1), height 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}><div style={{width:`${pct}%`,height:"100%",borderRadius:10,background:`linear-gradient(90deg,${AD},${AB})`}}/></div><div style={{position:"absolute",left:`calc(${pct}% - 8px)`,top:"50%",transform:"translateY(-50%)",width:16,height:16,borderRadius:"50%",background:"#fff",boxShadow:`0 0 8px rgba(0,0,0,0.3)`,transition:dr?"none":"left 0.15s",pointerEvents:"none"}}/></div><span style={{color:rg==="right"&&dr?AB:TX3,transition:"all 0.2s",transform:rg==="right"&&dr?`translateX(${ov/3}px) scale(1.2)`:"none"}}>{Ic.vol(15)}</span></div>;};

const AnimText=({text,style:st})=><span style={{display:"inline-flex",overflow:"hidden",...st}}>{text.split("").map((c,i)=><span key={i} style={{display:"inline-block",animation:`letterReveal 0.5s cubic-bezier(0.16,1,0.3,1) forwards`,animationDelay:`${i*30}ms`,opacity:0,whiteSpace:c===" "?"pre":"normal"}}>{c}</span>)}</span>;
const Toast=({msg,action,onAction,onDismiss})=>{useEffect(()=>{const t=setTimeout(onDismiss,4000);return()=>clearTimeout(t);},[]);return<div style={{position:"fixed",bottom:180,right:24,zIndex:1500,animation:"fadeSlideUp 0.35s ease",minWidth:260}}><div style={{background:"rgba(18,18,18,0.9)",backdropFilter:"blur(20px)",border:"1px solid #222",borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:13,color:TX,fontWeight:500,flex:1}}>{msg}</span>{action&&<button onClick={onAction} style={{padding:"6px 14px",background:A,border:"none",borderRadius:8,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{action}</button>}</div><div style={{marginTop:6,height:2,borderRadius:1,background:"#333",overflow:"hidden"}}><div style={{height:"100%",background:AB,animation:"timerShrink 4s linear forwards"}}/></div></div>;};

const CtxMenu=({x,y,items,onClose})=>{useEffect(()=>{const h=()=>onClose();window.addEventListener("click",h);return()=>window.removeEventListener("click",h);},[]);return<div style={{position:"fixed",left:x,top:y,zIndex:2500,minWidth:180,background:"rgba(16,16,16,0.95)",backdropFilter:"blur(20px)",border:"1px solid #222",borderRadius:12,padding:"6px 0",boxShadow:"0 8px 32px rgba(0,0,0,0.6)",animation:"scaleIn 0.15s ease"}}>{items.map((it,i)=>it.divider?<div key={i} style={{height:1,background:"#1e1e1e",margin:"4px 12px"}}/>:<button key={i} onClick={e=>{e.stopPropagation();it.onClick();onClose();}} style={{width:"100%",padding:"9px 16px",background:"none",border:"none",color:it.danger?AB:TX2,fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left",fontFamily:"'Outfit',sans-serif",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=it.danger?"rgba(213,44,42,0.1)":"rgba(255,255,255,0.04)";}} onMouseLeave={e=>{e.currentTarget.style.background="none";}}>{it.icon}{it.label}</button>)}</div>;};
const PlPicker=({playlists,songTitle,onSelect,onClose})=><div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}><div style={{background:BGC,borderRadius:20,padding:"28px 0",width:340,border:`1px solid ${BD}`,boxShadow:"0 32px 80px rgba(0,0,0,0.6)",animation:"scaleIn 0.25s ease",maxHeight:"60vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}><div style={{padding:"0 28px 16px",borderBottom:`1px solid ${BD}`}}><div className="mono" style={{fontSize:12,color:A,letterSpacing:2,fontWeight:700}}>ADD TO PLAYLIST</div><div style={{fontSize:12,color:TX3,marginTop:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:280}}>{songTitle}</div></div><div style={{flex:1,overflowY:"auto",padding:"8px 12px"}}>{playlists.map((pl,i)=><button key={i} onClick={()=>onSelect(i)} style={{width:"100%",padding:"11px 16px",background:"none",border:"none",color:TX2,fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:10,borderRadius:8,fontFamily:"'Outfit',sans-serif",textAlign:"left",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=BGH;}} onMouseLeave={e=>{e.currentTarget.style.background="none";}}><span style={{color:i===0?A:TX3}}>{i===0?Ic.music(16):Ic.folder(16)}</span>{pl.name}<span className="mono" style={{marginLeft:"auto",fontSize:10,color:TX3}}>{pl.songs.length}</span></button>)}</div></div></div>;

const QueuePanel=({queue,idx,onPlay,onRemove,onClear,closing,onRequestClose,onAnimDone})=><div style={{position:"fixed",top:96,right:0,width:380,height:"calc(100vh - 96px)",background:BGC,borderLeft:`1px solid ${BD}`,zIndex:150,display:"flex",flexDirection:"column",animation:closing?"slideOut 0.3s ease forwards":"slideIn 0.35s cubic-bezier(0.16,1,0.3,1)",boxShadow:"-8px 0 40px rgba(0,0,0,0.6)"}} onAnimationEnd={()=>{if(closing)onAnimDone();}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px",borderBottom:`1px solid ${BD}`}}>
    <span className="mono" style={{color:A,fontWeight:700,fontSize:14,letterSpacing:2}}>PLAY QUEUE</span>
    <div style={{display:"flex",alignItems:"center",gap:4}}>{queue.length>0&&<button className="ib" onClick={onClear} style={{fontSize:11,padding:"4px 10px",borderRadius:6,color:TX3}}><span>Clear all</span></button>}<button className="ib" onClick={onRequestClose}>{Ic.x(18)}</button></div>
  </div>
  <div style={{flex:1,overflowY:"auto",padding:"8px 12px"}}>
    {queue.length===0&&<div style={{color:TX3,textAlign:"center",padding:48,fontSize:13}}>Nothing queued yet</div>}
    {queue.map((s,i)=><div key={i} className="qi" onClick={()=>onPlay(i)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:10,background:i===idx?"rgba(213,44,42,0.08)":"transparent",borderLeft:i===idx?`3px solid ${A}`:"3px solid transparent",cursor:"pointer",transition:"all 0.2s",marginBottom:2,animation:"fadeSlideUp 0.4s ease forwards",animationDelay:`${i*40}ms`,opacity:0}}><div style={{width:30,height:30,borderRadius:8,flexShrink:0,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",background:i===idx?A:"#1a1a1a",color:i===idx?"#fff":TX3}}>{i+1}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:500,color:i===idx?AB:TX,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.title}</div><div style={{fontSize:11,color:TX3}}>{s.artist}</div></div><button className="ib" onClick={e=>{e.stopPropagation();onRemove(i);}} style={{opacity:0.5}}>{Ic.x(14)}</button></div>)}
  </div>
</div>;

const RenameModal=({song,onClose,onSave})=>{const[n,setN]=useState(song?.title||"");return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(12px)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}><div style={{background:BGC,borderRadius:20,padding:36,width:400,border:`1px solid ${BD}`,boxShadow:"0 32px 80px rgba(0,0,0,0.6)",animation:"scaleIn 0.3s ease"}} onClick={e=>e.stopPropagation()}><h3 className="mono" style={{color:A,margin:"0 0 24px",fontSize:15,letterSpacing:2}}>RENAME TRACK</h3><input autoFocus value={n} onChange={e=>setN(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&n.trim())onSave(n.trim());}} placeholder="New name..." className="mi" style={{width:"100%",padding:"14px 18px",background:BGS,border:"1px solid #222",borderRadius:12,color:TX,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Outfit',sans-serif"}}/><div style={{display:"flex",gap:12,marginTop:24,justifyContent:"flex-end"}}><button className="bs" onClick={onClose}>Cancel</button><button className="bp" onClick={()=>{if(n.trim())onSave(n.trim());}}>Save</button></div></div></div>;};
const NewPlModal=({onClose,onCreate})=>{const[n,setN]=useState("");return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(12px)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}><div style={{background:BGC,borderRadius:20,padding:36,width:380,border:`1px solid ${BD}`,boxShadow:"0 32px 80px rgba(0,0,0,0.6)",animation:"scaleIn 0.3s ease"}} onClick={e=>e.stopPropagation()}><h3 className="mono" style={{color:A,margin:"0 0 24px",fontSize:15,letterSpacing:2}}>NEW PLAYLIST</h3><input autoFocus value={n} onChange={e=>setN(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&n.trim())onCreate(n.trim());}} placeholder="Playlist name..." className="mi" style={{width:"100%",padding:"14px 18px",background:BGS,border:"1px solid #222",borderRadius:12,color:TX,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Outfit',sans-serif"}}/><div style={{display:"flex",gap:12,marginTop:24,justifyContent:"flex-end"}}><button className="bs" onClick={onClose}>Cancel</button><button className="bp" onClick={()=>{if(n.trim())onCreate(n.trim());}}>Create</button></div></div></div>;};

const SKEY="ap_v5";
const PKEY="ap_playstate";
(() => { try { ["ap_data_v4","audioplayer_v3","audioplayer_v2","audioplayer_data"].forEach(k => localStorage.removeItem(k)); } catch {} })();
const savePls=p=>{try{localStorage.setItem(SKEY,JSON.stringify(p.map(pl=>({name:pl.name,pinned:pl.pinned,songs:pl.songs.map(s=>({title:s.title,artist:s.artist,fileName:s.fileName}))}))));} catch{}};
const loadPls=()=>{try{const r=localStorage.getItem(SKEY);if(r){const d=JSON.parse(r);if(Array.isArray(d)&&d.length)return d;}}catch{}return null;};
const savePlayState=(data)=>{try{localStorage.setItem(PKEY,JSON.stringify(data));}catch{}};
const loadPlayState=()=>{try{const r=localStorage.getItem(PKEY);if(r)return JSON.parse(r);}catch{}return null;};

export default function AudioPlayer(){
  const audioRef=useRef(new Audio());
  const[pls,setPls]=useState(()=>loadPls()||[{name:"All Audios",songs:[],pinned:false}]);
  const[activePl,setActivePl]=useState(0);
  const[queue,setQueue]=useState([]);
  const[curIdx,setCurIdx]=useState(-1);
  const[playing,setPlaying]=useState(false);
  const[prog,setProg]=useState(0);
  const[dur,setDur]=useState(0);
  const[vol,setVol]=useState(75);
  const[rpt,setRpt]=useState(0);
  const[shuf,setShuf]=useState(false);
  const[showQ,setShowQ]=useState(false);
  const[qClosing,setQClosing]=useState(false);
  const[showNewPl,setShowNewPl]=useState(false);
  const[globalDrag,setGlobalDrag]=useState(false);
  const[seeking,setSeeking]=useState(false);
  const[renameSong,setRenameSong]=useState(null);
  const[renameIdx,setRenameIdx]=useState(-1);
  const[audioDevice,setAudioDevice]=useState("Default Speaker");
  const[toast,setToast]=useState(null);
  const[ctxMenu,setCtxMenu]=useState(null);
  const[shiftHeld,setShiftHeld]=useState(false);
  const[hoveredPl,setHoveredPl]=useState(-1);
  const[renamePlIdx,setRenamePlIdx]=useState(-1);
  const[renamePlName,setRenamePlName]=useState("");
  const[dragOverPl,setDragOverPl]=useState(-1);
  const[internalDrag,setInternalDrag]=useState(null);
  const[plPicker,setPlPicker]=useState(null);
  const audioPortRef=useRef(0);
  const[portReady,setPortReady]=useState(false);
  const a=audioRef.current;

  useEffect(()=>{
    const getPort=async()=>{
      if(!window.electronAPI?.getPort) {
        setPortReady(true);
        return;
      }
      for(let i=0;i<20;i++){
        try{
          const port=await window.electronAPI.getPort();
          if(port>0){
            audioPortRef.current=port;
            setPortReady(true);
            return;
          }
        }catch(e){}
        await new Promise(r=>setTimeout(r,500));
      }
      setPortReady(true);
    };
    getPort();
  },[]);

  useEffect(()=>{const d=e=>{if(e.key==="Shift")setShiftHeld(true);};const u=e=>{if(e.key==="Shift")setShiftHeld(false);};window.addEventListener("keydown",d);window.addEventListener("keyup",u);return()=>{window.removeEventListener("keydown",d);window.removeEventListener("keyup",u);};},[]);
  useEffect(()=>{(async()=>{try{const devs=await navigator.mediaDevices.enumerateDevices();const o=devs.find(d=>d.kind==="audiooutput"&&d.label);if(o)setAudioDevice(o.label.split("(")[0].trim()||"Default Speaker");}catch{}})();},[]);
  useEffect(()=>{const onT=()=>{if(!seeking)setProg(a.currentTime);};const onD=()=>setDur(a.duration);const onE=()=>{if(rpt===2){a.currentTime=0;a.play();}else if(curIdx<queue.length-1)doPlay(curIdx+1);else if(rpt===1)doPlay(0);else setPlaying(false);};a.addEventListener("timeupdate",onT);a.addEventListener("loadedmetadata",onD);a.addEventListener("ended",onE);return()=>{a.removeEventListener("timeupdate",onT);a.removeEventListener("loadedmetadata",onD);a.removeEventListener("ended",onE);};},[curIdx,queue,rpt,seeking]);
  useEffect(()=>{a.volume=vol/100;},[vol]);
  useEffect(()=>{savePls(pls);},[pls]);

  const playStateRef=useRef({});
  useEffect(()=>{
    playStateRef.current={
      queueFileNames:queue.map(s=>s.fileName),
      curIdx,
      currentTime:a.currentTime||0,
      activePl,
      vol,
    };
  });
  useEffect(()=>{
    const save=()=>savePlayState(playStateRef.current);
    const interval=setInterval(save,3000);
    window.addEventListener("beforeunload",save);
    return()=>{clearInterval(interval);window.removeEventListener("beforeunload",save);};
  },[]);

  const restoredRef=useRef(false);
  useEffect(()=>{
    if(!portReady||restoredRef.current)return;
    restoredRef.current=true;
    const saved=loadPlayState();
    if(!saved||!saved.queueFileNames?.length)return;
    const allSongs=pls[0]?.songs||[];
    const restoredQueue=saved.queueFileNames.map(fn=>allSongs.find(s=>s.fileName===fn)).filter(Boolean);
    if(!restoredQueue.length)return;
    setQueue(restoredQueue);
    if(saved.activePl>=0&&saved.activePl<pls.length)setActivePl(saved.activePl);
    const idx=saved.curIdx>=0&&saved.curIdx<restoredQueue.length?saved.curIdx:0;
    setCurIdx(idx);
    const song=restoredQueue[idx];
    const port=audioPortRef.current;
    if(song?.fileName&&port>0){
      const src=`http://127.0.0.1:${port}/${encodeURIComponent(song.fileName)}`;
      a.src=src;
      a.addEventListener("loadedmetadata",function onMeta(){
        a.currentTime=saved.currentTime||0;
        setProg(saved.currentTime||0);
        setDur(a.duration);
        a.removeEventListener("loadedmetadata",onMeta);
      });
      a.load();
    }
    if(typeof saved.vol==="number")setVol(saved.vol);
  },[portReady]);
  useEffect(()=>{if(window.electronAPI?.onUpdateDownloaded){window.electronAPI.onUpdateDownloaded(ver=>{setToast({msg:`Update v${ver} ready`,action:"Restart",onAction:()=>window.electronAPI.installUpdate()});});}},[]);

  const getSrc=useCallback((song)=>{
    if(song.file){
      const url=URL.createObjectURL(song.file);
      return url;
    }
    const port=audioPortRef.current;
    if(song.fileName&&port>0){
      const url=`http://127.0.0.1:${port}/${encodeURIComponent(song.fileName)}`;
      return url;
    }
    return null;
  },[]);

  const doPlay=useCallback((i)=>{
    if(i<0||i>=queue.length) return;
    const song=queue[i];
    const src=getSrc(song);
    if(!src){return;}
    a.src=src;
    a.play().catch(()=>{});
    setCurIdx(i);
    setPlaying(true);
  },[queue,getSrc]);

  const toggle=()=>{if(curIdx===-1&&queue.length>0){doPlay(0);return;}if(playing)a.pause();else a.play().catch(()=>{});setPlaying(!playing);};
  const skipF=()=>{if(shuf){doPlay(Math.floor(Math.random()*queue.length));return;}if(curIdx<queue.length-1)doPlay(curIdx+1);else if(rpt>=1)doPlay(0);};
  const skipB=()=>{if(a.currentTime>3){a.currentTime=0;return;}if(curIdx>0)doPlay(curIdx-1);else if(rpt>=1)doPlay(queue.length-1);};

  const cur=curIdx>=0&&curIdx<queue.length?queue[curIdx]:null;
  const songs=pls[activePl]?.songs||[];
  const sortedPlIdxs=[0,...pls.map((_,i)=>i).filter(i=>i>0&&pls[i].pinned),...pls.map((_,i)=>i).filter(i=>i>0&&!pls[i].pinned)];
  const isDragging=globalDrag||!!internalDrag;

  useEffect(()=>{try{if(!("mediaSession" in navigator))return;const ms=navigator.mediaSession;ms.setActionHandler("play",()=>{a.play().catch(()=>{});setPlaying(true);});ms.setActionHandler("pause",()=>{a.pause();setPlaying(false);});ms.setActionHandler("previoustrack",()=>skipB());ms.setActionHandler("nexttrack",()=>skipF());try{ms.setActionHandler("stop",()=>{a.pause();a.currentTime=0;setPlaying(false);});}catch{}if(cur)try{ms.metadata=new MediaMetadata({title:cur.title,artist:cur.artist});}catch{}try{ms.playbackState=playing?"playing":"paused";}catch{}}catch{}},[playing,curIdx,cur,queue]);

  const pickFiles=async()=>{
    if(!window.electronAPI?.pickFiles){return;}
    const songs=await window.electronAPI.pickFiles();
    if(!songs||!songs.length)return;
    const newSongs=songs.map(s=>({title:s.title,artist:"Local File",fileName:s.storedName}));
    setPls(p=>{const u=[...p];u[0]={...u[0],songs:[...u[0].songs,...newSongs]};if(activePl!==0)u[activePl]={...u[activePl],songs:[...u[activePl].songs,...newSongs]};return u;});
    setToast({msg:`Added ${newSongs.length} track${newSongs.length>1?"s":""}`});
  };

  const importDropped=async(files)=>{
    const af=Array.from(files).filter(f=>f.name.match(/\.(mp3|wav|ogg|flac|m4a|aac|wma|opus|webm)$/i));
    if(!af.length)return;
    const newSongs=[];
    for(const f of af){
      if(f.path&&window.electronAPI?.storeDrop){
        try{
          const stored=await window.electronAPI.storeDrop(f.path,f.name);
          if(stored) newSongs.push({title:stored.title,artist:"Local File",fileName:stored.storedName});
        }catch(e){}
      }
    }
    if(!newSongs.length)return;
    setPls(p=>{const u=[...p];u[0]={...u[0],songs:[...u[0].songs,...newSongs]};if(activePl!==0)u[activePl]={...u[activePl],songs:[...u[activePl].songs,...newSongs]};return u;});
    setToast({msg:`Added ${newSongs.length} track${newSongs.length>1?"s":""}`});
  };

  const addSongToPl=(pi,song)=>{setPls(p=>{const u=[...p];if(u[pi].songs.some(s=>s.fileName===song.fileName))return u;u[pi]={...u[pi],songs:[...u[pi].songs,song]};if(pi!==0&&!u[0].songs.some(s=>s.fileName===song.fileName))u[0]={...u[0],songs:[...u[0].songs,song]};return u;});};
  const handlePlDrop=(e,pi)=>{e.preventDefault();e.stopPropagation();setDragOverPl(-1);if(internalDrag){addSongToPl(pi,internalDrag);setToast({msg:`Added to ${pls[pi]?.name}`});setInternalDrag(null);return;}if(e.dataTransfer.files.length)importDropped(e.dataTransfer.files);};
  const renameSongAll=(plIdx,songIdx,newName)=>{const fn=pls[plIdx].songs[songIdx].fileName;setPls(p=>p.map(pl=>({...pl,songs:pl.songs.map(s=>s.fileName===fn?{...s,title:newName}:s)})));setQueue(q=>q.map(s=>s.fileName===fn?{...s,title:newName}:s));};
  const playNow=(song,i)=>{const pl=pls[activePl].songs;setQueue(pl);const src=getSrc(song);if(!src)return;a.src=src;a.play().catch(()=>{});setCurIdx(i);setPlaying(true);};
  const addToQ=song=>setQueue(p=>[...p,song]);
  const deleteSong=async(song)=>{
    const fn=song.fileName;
    setPls(p=>p.map(pl=>({...pl,songs:pl.songs.filter(s=>s.fileName!==fn)})));
    setQueue(q=>{const nq=q.filter(s=>s.fileName!==fn);if(cur&&cur.fileName===fn){a.pause();setCurIdx(-1);setPlaying(false);}else{const ni=nq.findIndex(s=>s===cur);if(ni>=0)setCurIdx(ni);}return nq;});
    if(window.electronAPI?.deleteFile) await window.electronAPI.deleteFile(fn);
    setToast({msg:`Deleted "${song.title}"`});
  };
  const removeSongFromPl=(plIdx,songIdx)=>{
    if(plIdx===0){deleteSong(pls[0].songs[songIdx]);return;}
    setPls(p=>{const u=[...p];u[plIdx]={...u[plIdx],songs:u[plIdx].songs.filter((_,i)=>i!==songIdx)};return u;});
    setToast({msg:"Removed from playlist"});
  };
  const rmFromQ=i=>{setQueue(p=>{const n=[...p];n.splice(i,1);return n;});if(i<curIdx)setCurIdx(p=>p-1);else if(i===curIdx){if(queue.length<=1){a.pause();setCurIdx(-1);setPlaying(false);}else if(i<queue.length-1)doPlay(i);else doPlay(i-1);}};
  const clearQueue=()=>{a.pause();a.currentTime=0;setQueue([]);setCurIdx(-1);setPlaying(false);};
  const createPl=name=>{setPls(p=>[...p,{name,songs:[],pinned:false}]);setShowNewPl(false);};
  const delPl=i=>{if(i===0)return;setPls(p=>p.filter((_,j)=>j!==i));if(activePl===i)setActivePl(0);else if(activePl>i)setActivePl(p=>p-1);};
  const pinPl=i=>{if(i===0)return;setPls(p=>{const u=[...p];u[i]={...u[i],pinned:!u[i].pinned};return u;});};
  const renamePl=(i,name)=>{if(i===0||!name.trim())return;setPls(p=>{const u=[...p];u[i]={...u[i],name:name.trim()};return u;});setRenamePlIdx(-1);};
  const shufflePl=()=>{setPls(p=>{const u=[...p];const s=[...u[activePl].songs];for(let i=s.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s[i],s[j]]=[s[j],s[i]];}u[activePl]={...u[activePl],songs:s};return u;});};
  const requestCloseQ=()=>setQClosing(true);
  const queueAnimDone=()=>{setShowQ(false);setQClosing(false);};
  const toggleQ=()=>{if(showQ)requestCloseQ();else{setQClosing(false);setShowQ(true);}};

  return(
    <div style={{width:"100%",height:"100vh",background:BG,color:TX,fontFamily:"'Outfit',sans-serif",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}
      onDrop={e=>{e.preventDefault();setGlobalDrag(false);setInternalDrag(null);if(dragOverPl===-1&&e.dataTransfer.files.length)importDropped(e.dataTransfer.files);}}
      onDragOver={e=>{e.preventDefault();if(e.dataTransfer.types.includes("Files"))setGlobalDrag(true);}}
      onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget)){setGlobalDrag(false);setInternalDrag(null);}}}
      onDragEnd={()=>{setInternalDrag(null);setDragOverPl(-1);}}
      onClick={()=>setCtxMenu(null)}>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}body{background:${BG}}.mono{font-family:'Space Mono',monospace}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#252525;border-radius:4px}
        .ib{background:none;border:none;color:${TX2};cursor:pointer;padding:8px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all 0.2s}.ib:hover{color:${AB};background:rgba(213,44,42,0.06)}.ib.active{color:${AB}}
        .bp{padding:11px 28px;background:${A};border:none;border-radius:10px;color:#fff;font-weight:700;font-size:13px;cursor:pointer;font-family:'Outfit',sans-serif}.bp:hover{background:${AB};box-shadow:0 4px 24px ${AG}}
        .bs{padding:11px 22px;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;color:${TX2};font-weight:600;font-size:13px;cursor:pointer;font-family:'Outfit',sans-serif}
        .mi:focus{border-color:${A}!important;box-shadow:0 0 0 3px ${AG}}
        .sl-wrap:hover .sl-knob{opacity:1!important}
        .song-row:hover .qa,.song-row:hover .rb,.song-row:hover .ap,.song-row:hover .dl{opacity:1!important}
        .song-row:hover .play-ico{opacity:1!important}.song-row:hover .row-num{opacity:0!important}
        .qi:hover{background:${BGH}!important}
        .title-bar{-webkit-app-region:drag;app-region:drag}.title-bar button{-webkit-app-region:no-drag;app-region:no-drag}
        .song-row[draggable=true]{cursor:grab}.song-row[draggable=true]:active{cursor:grabbing;opacity:0.6}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes slideOut{from{transform:translateX(0)}to{transform:translateX(100%)}}
        @keyframes scaleIn{from{transform:scale(0.92);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes letterReveal{from{opacity:0;transform:translateY(110%)}to{opacity:1;transform:translateY(0)}}
        @keyframes eqB1{0%,100%{height:4px}50%{height:14px}}@keyframes eqB2{0%,100%{height:10px}50%{height:5px}}@keyframes eqB3{0%,100%{height:7px}50%{height:16px}}
        @keyframes dropPulse{0%,100%{border-color:${AD}}50%{border-color:${AB}}}
        @keyframes auroraShift{0%{transform:translate(-20%,-20%) rotate(0deg) scale(1)}33%{transform:translate(10%,-10%) rotate(120deg) scale(1.1)}66%{transform:translate(-10%,15%) rotate(240deg) scale(0.9)}100%{transform:translate(-20%,-20%) rotate(360deg) scale(1)}}
        @keyframes auroraShift2{0%{transform:translate(20%,20%) rotate(0deg) scale(1.1)}33%{transform:translate(-15%,10%) rotate(-120deg) scale(1)}66%{transform:translate(10%,-20%) rotate(-240deg) scale(1.2)}100%{transform:translate(20%,20%) rotate(-360deg) scale(1.1)}}
        @keyframes logoBreathe{0%,100%{box-shadow:0 0 12px ${AG};border-color:${A}}50%{box-shadow:0 0 20px ${AGS}, 0 0 0 4px rgba(213,44,42,0.08);border-color:${AB}}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 20px ${AG}}50%{box-shadow:0 0 30px ${AGS}}}
        @keyframes nowPlayingSlide{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes timerShrink{from{width:100%}to{width:0%}}
        @keyframes plBreathe{0%,100%{border-color:transparent;background:transparent}50%{border-color:rgba(213,44,42,0.3);background:rgba(213,44,42,0.04)}}
      `}</style>

      <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",width:"140%",height:"140%",top:"-20%",left:"-20%",background:"radial-gradient(ellipse at 30% 20%, rgba(213,44,42,0.08) 0%, transparent 60%)",animation:"auroraShift 25s ease-in-out infinite",filter:"blur(80px)",opacity:playing?0.7:0.25,transition:"opacity 2s"}}/>
        <div style={{position:"absolute",width:"120%",height:"120%",top:"-10%",left:"-10%",background:"radial-gradient(ellipse at 70% 80%, rgba(213,44,42,0.06) 0%, transparent 55%)",animation:"auroraShift2 30s ease-in-out infinite",filter:"blur(100px)",opacity:playing?0.6:0.15,transition:"opacity 2s"}}/>
      </div>

      {globalDrag&&!internalDrag&&dragOverPl===-1&&<div style={{position:"fixed",inset:0,background:"rgba(6,6,6,0.92)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",border:`2px dashed ${A}`,animation:"dropPulse 1.5s ease infinite",pointerEvents:"none"}}><div style={{color:A,marginBottom:8}}>{Ic.drop(56)}</div><div className="mono" style={{color:AB,fontSize:22,fontWeight:700,letterSpacing:3}}>DROP AUDIO FILES HERE</div></div>}

      <div className="title-bar" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 0 0 16px",background:"rgba(6,6,6,0.95)",borderBottom:"1px solid #111",position:"fixed",top:0,left:0,right:0,zIndex:200,height:40}}>
        <span className="mono" style={{fontSize:10,color:TX3,letterSpacing:1.5}}>Audio Player — adxm.o — v{VER}</span>
        <div style={{display:"flex",height:"100%"}}>
          {[{t:"Minimize",fn:()=>window.electronAPI?.minimize(),ic:<line x1="2" y1="6" x2="10" y2="6"/>,hb:"#1a1a1a",hc:TX},{t:"Maximize",fn:()=>window.electronAPI?.maximize(),ic:<rect x="2" y="2" width="8" height="8" rx="1"/>,hb:"#1a1a1a",hc:TX},{t:"Close",fn:()=>window.electronAPI?.close(),ic:<><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></>,hb:A,hc:"#fff"}].map((b,i)=><button key={i} onClick={b.fn} title={b.t} style={{width:48,height:"100%",border:"none",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:TX2,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=b.hb;e.currentTarget.style.color=b.hc;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=TX2;}}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">{b.ic}</svg></button>)}
        </div>
      </div>

      <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:`1px solid ${BD}`,background:"rgba(6,6,6,0.85)",backdropFilter:"blur(24px)",position:"fixed",top:40,left:0,right:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:38,height:38,borderRadius:"50%",border:`2px solid ${A}`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",animation:"logoBreathe 4s ease-in-out infinite"}}><div style={{width:8,height:8,borderRadius:"50%",background:A}}/><div style={{position:"absolute",inset:6,borderRadius:"50%",border:"1px solid rgba(213,44,42,0.2)"}}/></div>
          <div><div style={{fontSize:16,fontWeight:700,color:TX}}>Audio Player</div><div className="mono" style={{fontSize:10,color:TX3,letterSpacing:1.5}}>by adxm.o</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={pickFiles} className="bs" style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",fontSize:12}}>{Ic.plus(14)} <span>Add Files</span></button>
          <button className={`ib ${showQ?"active":""}`} onClick={toggleQ} style={{position:"relative"}}>{Ic.queue(20)}{queue.length>0&&<span style={{position:"absolute",top:2,right:2,minWidth:16,height:16,borderRadius:8,background:A,color:"#fff",fontSize:9,fontWeight:700,padding:"0 4px",display:"flex",alignItems:"center",justifyContent:"center"}}>{queue.length}</span>}</button>
        </div>
      </header>

      <div style={{display:"flex",flex:1,marginTop:96,height:"calc(100vh - 96px)",position:"relative",zIndex:1}}>
        <aside style={{width:230,borderRight:`1px solid ${BD}`,flexShrink:0,display:"flex",flexDirection:"column",height:cur?"calc(100vh - 96px - 150px)":"calc(100vh - 96px)"}}>
          <div style={{padding:"16px 20px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><span className="mono" style={{fontSize:10,fontWeight:700,color:TX3,letterSpacing:2.5}}>PLAYLISTS</span><button className="ib" onClick={()=>setShowNewPl(true)} style={{padding:4}}>{Ic.plus(15)}</button></div>
          <div style={{flex:1,overflowY:"auto"}}>
            {sortedPlIdxs.map(pi=>{const pl=pls[pi];if(!pl)return null;const isA=activePl===pi,isDT=isDragging&&dragOverPl===pi;
              return<div key={pi} onClick={()=>{setActivePl(pi);setRenamePlIdx(-1);}}
                onContextMenu={e=>{if(pi===0)return;e.preventDefault();setCtxMenu({x:e.clientX,y:e.clientY,items:[{label:pl.pinned?"Unpin":"Pin Playlist",icon:Ic.pin(14),onClick:()=>pinPl(pi)},{label:"Rename Playlist",icon:Ic.edit(14),onClick:()=>{setRenamePlIdx(pi);setRenamePlName(pl.name);}},{divider:true},{label:"Delete Playlist",icon:Ic.trash(14),onClick:()=>delPl(pi),danger:true}]});}}
                onDragOver={e=>{e.preventDefault();e.stopPropagation();setDragOverPl(pi);}} onDragLeave={()=>setDragOverPl(-1)} onDrop={e=>handlePlDrop(e,pi)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",cursor:"pointer",background:isDT?"rgba(213,44,42,0.1)":isA?"rgba(213,44,42,0.05)":"transparent",borderRight:isA?`2px solid ${A}`:"2px solid transparent",border:isDT?`1px dashed ${AB}`:"1px solid transparent",borderRadius:isDT?8:0,animation:isDragging&&!isDT?"plBreathe 2s ease-in-out infinite":"none",transition:"all 0.25s"}}
                onMouseEnter={()=>setHoveredPl(pi)} onMouseLeave={()=>setHoveredPl(-1)}
              >
                <span style={{color:isA?A:TX3}}>{pi===0?Ic.music(15):Ic.folder(15)}</span>
                {renamePlIdx===pi?<input autoFocus value={renamePlName} onChange={e=>setRenamePlName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")renamePl(pi,renamePlName);if(e.key==="Escape")setRenamePlIdx(-1);}} onBlur={()=>renamePl(pi,renamePlName)} onClick={e=>e.stopPropagation()} style={{flex:1,fontSize:13,color:TX,background:BGS,border:`1px solid ${A}`,borderRadius:6,padding:"2px 8px",outline:"none",fontFamily:"'Outfit',sans-serif"}}/>
                  :<span style={{flex:1,fontSize:13,fontWeight:isA?600:400,color:isA?AB:TX2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{pl.pinned&&"📌 "}{pl.name}</span>}
                <span className="mono" style={{fontSize:10,color:TX3}}>{pl.songs.length}</span>
                {pi>0&&shiftHeld&&hoveredPl===pi&&<button className="ib" onClick={e=>{e.stopPropagation();delPl(pi);}} style={{padding:2,opacity:0.7}}>{Ic.trash(12)}</button>}
              </div>;})}
          </div>
        </aside>

        <main style={{flex:1,overflowY:"auto",height:cur?"calc(100vh - 96px - 150px)":"calc(100vh - 96px)"}}>
          <div style={{padding:"24px 32px"}}>
            {songs.length===0?<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:420,gap:20}}>
              <div style={{width:110,height:110,borderRadius:"50%",border:"2px dashed #252525",display:"flex",alignItems:"center",justifyContent:"center",color:TX3}}>{Ic.music(44)}</div>
              <AnimText text="Drop your audio files here" style={{fontSize:20,fontWeight:600,color:TX2}}/>
              <div style={{color:TX3,fontSize:13,textAlign:"center",maxWidth:320,lineHeight:1.7}}>Drag & drop audio files anywhere, or click below.</div>
              <button className="bp" onClick={pickFiles} style={{padding:"14px 36px",fontSize:14,borderRadius:12,animation:"glowPulse 3s ease infinite"}}>Browse Files</button>
            </div>:<>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                <h2 style={{fontSize:24,fontWeight:700}}>{pls[activePl]?.name}</h2>
                <span className="mono" style={{fontSize:11,color:TX3,padding:"3px 10px",background:BGS,borderRadius:20,border:`1px solid ${BD}`}}>{songs.length} tracks</span>
              </div>
              <div className="mono" style={{display:"grid",gridTemplateColumns:"44px 1fr 140px 140px",padding:"10px 14px",borderBottom:`1px solid ${BD}`,fontSize:10,fontWeight:700,color:TX3,letterSpacing:1.5,marginBottom:4}}>
                <span>#</span><span>TITLE</span><span>ARTIST</span><span></span>
              </div>
              {songs.map((song,i)=>{const isCur=cur?.fileName===song.fileName;return(
                <div key={(song.fileName||"")+i} className="song-row" draggable onDoubleClick={()=>playNow(song,i)}
                  onDragStart={e=>{setInternalDrag(song);e.dataTransfer.effectAllowed="copy";e.dataTransfer.setData("text/plain",song.title);}}
                  onDragEnd={()=>{setInternalDrag(null);setDragOverPl(-1);}}
                  style={{display:"grid",gridTemplateColumns:"44px 1fr 140px 140px",padding:"11px 14px",borderRadius:10,alignItems:"center",background:isCur?"rgba(213,44,42,0.06)":"transparent",cursor:"pointer",transition:"all 0.15s",animation:"fadeSlideUp 0.4s ease forwards",animationDelay:`${i*35}ms`,opacity:0}}
                  onMouseEnter={e=>{if(!isCur)e.currentTarget.style.background=BGH;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=isCur?"rgba(213,44,42,0.06)":"transparent";}}
                >
                  <span style={{position:"relative",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {isCur&&playing?<span style={{display:"flex",gap:2,alignItems:"flex-end",height:16}}><span style={{width:3,borderRadius:1,background:AB,animation:"eqB1 0.6s ease infinite"}}/><span style={{width:3,borderRadius:1,background:A,animation:"eqB2 0.7s ease infinite 0.1s"}}/><span style={{width:3,borderRadius:1,background:AB,animation:"eqB3 0.5s ease infinite 0.2s"}}/></span>
                    :<><span className="row-num mono" style={{fontSize:12,color:isCur?A:TX3,fontWeight:600,transition:"opacity 0.15s"}}>{String(i+1).padStart(2,"0")}</span><button className="play-ico" onClick={e=>{e.stopPropagation();playNow(song,i);}} style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",color:AB,cursor:"pointer",opacity:0,transition:"opacity 0.15s",padding:0}}>{Ic.play(14)}</button></>}
                  </span>
                  <div style={{minWidth:0}}><div style={{fontSize:14,fontWeight:500,color:isCur?AB:TX,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{song.title}</div></div>
                  <span style={{fontSize:13,color:TX2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{song.artist}</span>
                  <div style={{display:"flex",gap:2}}>
                    <div className="ap" style={{opacity:0,transition:"opacity 0.15s"}}><button className="ib" onClick={e=>{e.stopPropagation();setPlPicker(song);}} title="Add to playlist" style={{padding:4}}>{Ic.folderP(14)}</button></div>
                    <div className="rb" style={{opacity:0,transition:"opacity 0.15s"}}><button className="ib" onClick={e=>{e.stopPropagation();setRenameSong(song);setRenameIdx(i);}} title="Rename" style={{padding:4}}>{Ic.edit(14)}</button></div>
                    <div className="qa" style={{opacity:0,transition:"opacity 0.15s"}}><button className="ib" onClick={e=>{e.stopPropagation();addToQ(song);}} title="Add to queue" style={{padding:4}}>{Ic.addQ(14)}</button></div>
                    <div className="dl" style={{opacity:0,transition:"opacity 0.15s"}}><button className="ib" onClick={e=>{e.stopPropagation();removeSongFromPl(activePl,i);}} title={activePl===0?"Delete":"Remove from playlist"} style={{padding:4,color:activePl===0?AB:TX3}}>{Ic.trash(14)}</button></div>
                  </div>
                </div>);})}
            </>}
          </div>
        </main>
      </div>

      {cur&&<div style={{position:"fixed",bottom:0,left:0,right:0,animation:"nowPlayingSlide 0.5s cubic-bezier(0.16,1,0.3,1)",zIndex:500}}>
        <div style={{margin:"0 16px 16px",borderRadius:24,position:"relative",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)",background:"rgba(18,18,18,0.45)",backdropFilter:"blur(40px) saturate(1.6)",boxShadow:"0 -4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:"50%",background:"linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",borderRadius:"24px 24px 0 0",pointerEvents:"none"}}/>
          <div style={{padding:"0 24px",marginTop:12}}><div className="sl-wrap"><Slider value={prog} max={dur} onChange={v=>{a.currentTime=v;setProg(v);}} onDown={()=>setSeeking(true)} onUp={()=>setSeeking(false)} h={3}/></div></div>
          <div style={{padding:"8px 28px 20px",display:"flex",alignItems:"center",gap:16}}>
            <div style={{flex:"1 1 0",display:"flex",alignItems:"center",gap:14,minWidth:0}}>
              <div style={{width:52,height:52,borderRadius:14,flexShrink:0,background:"linear-gradient(135deg, rgba(213,44,42,0.15), rgba(30,10,10,0.4))",border:"1px solid rgba(213,44,42,0.12)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:playing?`0 4px 24px ${AG}`:"none"}}><span style={{color:A,opacity:0.8}}>{Ic.music(22)}</span></div>
              <div style={{minWidth:0}}><div style={{fontSize:15,fontWeight:600,color:TX,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cur.title}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}><span style={{color:TX3}}>{Ic.speaker(11)}</span><span className="mono" style={{fontSize:10,color:TX3}}>Listening on: {audioDevice}</span></div></div>
            </div>
            <span className="mono" style={{fontSize:11,color:TX3,flexShrink:0}}>{fmt(prog)} / {fmt(dur)}</span>
            <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
              <button className={`ib ${shuf?"active":""}`} onClick={()=>setShuf(!shuf)}>{Ic.shuffle(15)}</button>
              <button className="ib" onClick={skipB}>{Ic.prev(18)}</button>
              <button onClick={toggle} style={{width:48,height:48,borderRadius:"50%",border:"none",cursor:"pointer",background:`linear-gradient(135deg,${A},${AD})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",transition:"all 0.25s",boxShadow:`0 4px 24px ${AGS}`}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>{playing?Ic.pause(20):Ic.play(20)}</button>
              <button className="ib" onClick={skipF}>{Ic.next(18)}</button>
              <button className={`ib ${rpt>0?"active":""}`} onClick={()=>setRpt((rpt+1)%3)}>{rpt===2?Ic.repeat1(15):Ic.repeat(15)}</button>
            </div>
            <div style={{flex:"1 1 0",display:"flex",justifyContent:"center"}}><ElasticSlider value={vol} onChange={setVol} min={0} max={100} width={130}/></div>
          </div>
        </div>
      </div>}

      {showQ&&<QueuePanel queue={queue} idx={curIdx} onPlay={doPlay} onRemove={rmFromQ} onClear={clearQueue} closing={qClosing} onRequestClose={requestCloseQ} onAnimDone={queueAnimDone}/>}
      {showNewPl&&<NewPlModal onClose={()=>setShowNewPl(false)} onCreate={createPl}/>}
      {renameSong&&<RenameModal song={renameSong} onClose={()=>{setRenameSong(null);setRenameIdx(-1);}} onSave={n=>{renameSongAll(activePl,renameIdx,n);setRenameSong(null);setRenameIdx(-1);}}/>}
      {plPicker&&<PlPicker playlists={pls} songTitle={plPicker.title} onClose={()=>setPlPicker(null)} onSelect={i=>{addSongToPl(i,plPicker);setToast({msg:`Added to ${pls[i]?.name}`});setPlPicker(null);}}/>}
      {toast&&<Toast msg={toast.msg} action={toast.action} onAction={toast.onAction} onDismiss={()=>setToast(null)}/>}
      {ctxMenu&&<CtxMenu x={ctxMenu.x} y={ctxMenu.y} items={ctxMenu.items} onClose={()=>setCtxMenu(null)}/>}
    </div>
  );
}
