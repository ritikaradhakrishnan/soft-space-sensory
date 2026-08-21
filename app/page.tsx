"use client";
import { useEffect, useRef, useState } from "react";

type NoiseName = "pink" | "brown" | "white" | "rain";
const noiseLabels:Record<NoiseName,string>={pink:"Pink noise",brown:"Brown noise",white:"White noise",rain:"Soft rain"};
const notes=["Let your shoulders soften.","You only need to be here now.","Nothing is asking you to hurry.","Your softness is a kind of strength.","One slow breath is enough.","Make a little room for ease."];
const palettes=["rose","blush","berry","peach","lilac"];

function makeNoise(ctx:AudioContext,type:NoiseName){
  const seconds=3,buffer=ctx.createBuffer(2,ctx.sampleRate*seconds,ctx.sampleRate);
  for(let c=0;c<2;c++){const data=buffer.getChannelData(c);let last=0;for(let i=0;i<data.length;i++){const white=Math.random()*2-1;if(type==="brown"){last=(last+.02*white)/1.02;data[i]=last*3.5}else if(type==="pink"){last=.98*last+.12*white;data[i]=last*.55}else if(type==="rain"){last=.93*last+.22*white;data[i]=last*(Math.random()>.997?1.8:.28)}else data[i]=white*.38}}
  return buffer;
}

export default function Home(){
  const [splits,setSplits]=useState(1),[palette,setPalette]=useState(0),[note,setNote]=useState(0),[noise,setNoise]=useState<NoiseName>("pink"),[playing,setPlaying]=useState(false),[volume,setVolume]=useState(28);
  const engine=useRef<{ctx:AudioContext;source:AudioBufferSourceNode;gain:GainNode}|null>(null);
  useEffect(()=>()=>{engine.current?.ctx.close()},[]);
  useEffect(()=>{if(engine.current)engine.current.gain.gain.setTargetAtTime(volume/500,engine.current.ctx.currentTime,.08)},[volume]);
  function stop(){engine.current?.ctx.close();engine.current=null;setPlaying(false)}
  function play(kind=noise){stop();const ctx=new AudioContext(),source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=makeNoise(ctx,kind);source.loop=true;gain.gain.value=volume/500;source.connect(gain).connect(ctx.destination);source.start();engine.current={ctx,source,gain};setPlaying(true)}
  function changeNoise(kind:NoiseName){setNoise(kind);if(playing)play(kind)}
  function touchOrb(){setSplits(s=>s>=7?1:s+1);setPalette(p=>(p+1)%palettes.length);setNote(n=>(n+1)%notes.length)}
  return <main>
    <nav><a className="wordmark" href="#top"><i/>soft space</a><div><a href="#studio">sensory studio</a><a href="#ritual">tiny ritual</a></div></nav>
    <section className="hero" id="top"><p className="kicker">an interactive place to soften</p><h1>A little corner of the internet<br/><em>made for your senses.</em></h1><p className="intro">Click, listen, breathe. There is no score to reach and nowhere else you need to be.</p><a className="start" href="#studio">enter soft space <span>↓</span></a></section>
    <section className="studio" id="studio">
      <div className="studio-copy"><p className="kicker">01 · touch</p><h2>Let the feeling multiply.</h2><p>Each touch splits the form into something new. Watch the colors wander through shades of pink, then begin again.</p><div className="count"><strong>0{splits}</strong><span>soft forms<br/>in your space</span></div></div>
      <div className={`orb-stage ${palettes[palette]}`}>
        <div className="halo"/>
        <button className="orb-family" onClick={touchOrb} aria-label={`Split the sensory shape. Currently ${splits} forms`}>
          {Array.from({length:splits},(_,i)=><span className="orb-piece" key={i} style={{"--i":i,"--n":splits} as React.CSSProperties}><i/></span>)}
        </button>
        <p className="orb-note" key={note}>{notes[note]}</p><p className="tap-hint">tap the shapes · {splits===7?"one more to reset":"watch them split"}</p>
      </div>
    </section>
    <section className="sound-section">
      <div><p className="kicker">02 · listen</p><h2>Choose your hush.</h2><p className="section-text">A soft layer of sound can give a busy mind somewhere gentle to land.</p></div>
      <div className="sound-player">
        <label htmlFor="sound">soundscape</label><select id="sound" value={noise} onChange={e=>changeNoise(e.target.value as NoiseName)}>{Object.entries(noiseLabels).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select>
        <button className="play" onClick={()=>playing?stop():play()}><span>{playing?"Ⅱ":"▶"}</span>{playing?"pause sound":"play sound"}</button>
        <div className={`wave ${playing?"moving":""}`} aria-hidden="true">{Array.from({length:32},(_,i)=><i key={i}/>)}</div>
        <div className="volume"><span>quiet</span><input aria-label="Volume" type="range" min="5" max="70" value={volume} onChange={e=>setVolume(Number(e.target.value))}/><span>full</span></div>
      </div>
    </section>
    <section className="ritual" id="ritual"><p className="kicker">03 · breathe</p><h2>A tiny ritual for right now.</h2><div className="steps"><article><b>01</b><h3>Arrive</h3><p>Notice three things you can feel.</p></article><article><b>02</b><h3>Exhale</h3><p>Let your out-breath be a little longer.</p></article><article><b>03</b><h3>Choose</h3><p>Stay, touch, listen—or close the page.</p></article></div></section>
    <footer><a className="wordmark" href="#top"><i/>soft space</a><p>made gently, for gentle moments</p><a href="#top">back to top ↑</a></footer>
  </main>
}
