"use client";
import { useEffect, useRef, useState } from "react";

type NoiseName = "binaural" | "pink" | "brown" | "white" | "rain";
const noiseLabels:Record<NoiseName,string>={binaural:"Binaural focus · 10 Hz",pink:"Pink noise",brown:"Brown noise",white:"White noise",rain:"Soft rain"};
const notes=["Let your shoulders soften.","You only need to be here now.","Nothing is asking you to hurry.","Your softness is a kind of strength.","One slow breath is enough.","Make a little room for ease."];
const palettes=["rose","blush","berry","peach","lilac"];
const quotes=["You don’t have to process everything right now.","The world is too loud right now, but you don't have to match its volume.","It is completely okay to turn the lights off and stop performing.","You are not overreacting; your nervous system is simply full.","You don’t need to explain why this hurts. Just rest.","You don’t need to find a solution right now; just let the noise settle.","It is entirely safe to unplug and let the world wait outside.","You don’t have to push through; your body is allowed to stop.","There is no right way to feel safe, as long as it brings you peace.","Step back from the demands; you don’t owe anyone your energy today."];

function makeNoise(ctx:AudioContext,type:NoiseName){
  const seconds=3,buffer=ctx.createBuffer(2,ctx.sampleRate*seconds,ctx.sampleRate);
  for(let c=0;c<2;c++){const data=buffer.getChannelData(c);let last=0;for(let i=0;i<data.length;i++){const white=Math.random()*2-1;if(type==="brown"){last=(last+.02*white)/1.02;data[i]=last*3.5}else if(type==="pink"){last=.98*last+.12*white;data[i]=last*.55}else if(type==="rain"){last=.93*last+.22*white;data[i]=last*(Math.random()>.997?1.8:.28)}else data[i]=white*.38}}
  return buffer;
}

export default function Home(){
  const [shape,setShape]=useState(0),[palette,setPalette]=useState(0),[note,setNote]=useState(0),[noise,setNoise]=useState<NoiseName>("pink"),[playing,setPlaying]=useState(false),[volume,setVolume]=useState(28);
  const engine=useRef<{ctx:AudioContext;gain:GainNode}|null>(null);
  useEffect(()=>()=>{engine.current?.ctx.close()},[]);
  useEffect(()=>{if(engine.current)engine.current.gain.gain.setTargetAtTime(volume/500,engine.current.ctx.currentTime,.08)},[volume]);
  function stop(){engine.current?.ctx.close();engine.current=null;setPlaying(false)}
  function play(kind=noise){stop();const ctx=new AudioContext(),gain=ctx.createGain();gain.gain.value=volume/500;gain.connect(ctx.destination);if(kind==="binaural"){const left=ctx.createOscillator(),right=ctx.createOscillator(),lp=ctx.createStereoPanner(),rp=ctx.createStereoPanner();left.frequency.value=200;right.frequency.value=210;left.type=right.type="sine";lp.pan.value=-1;rp.pan.value=1;left.connect(lp).connect(gain);right.connect(rp).connect(gain);left.start();right.start()}else{const source=ctx.createBufferSource();source.buffer=makeNoise(ctx,kind);source.loop=true;source.connect(gain);source.start()}engine.current={ctx,gain};setPlaying(true)}
  function changeNoise(kind:NoiseName){setNoise(kind);if(playing)play(kind)}
  function touchOrb(){setShape(s=>(s+1)%5);setPalette(p=>(p+1)%palettes.length);setNote(n=>(n+1)%notes.length)}
  return <main>
    <nav><a className="wordmark" href="#top"><i/>soft space</a><div><a href="#studio">sensory studio</a><a href="#ritual">tiny ritual</a></div></nav>
    <section className="hero" id="top"><div className="hero-orbits" aria-hidden="true"><i/><i/><b/><b/></div><p className="kicker">an interactive place to soften</p><h1>A little corner of the internet<br/><em>made for AuDHD brains.</em></h1><p className="intro">Click, listen, breathe. There is no score to reach and nowhere else you need to be.</p><a className="start" href="#studio">enter soft space <span>↓</span></a></section>
    <section className="studio" id="studio">
      <div className={`orb-stage ${palettes[palette]}`}>
        <div className="orbital ring-one"><i/></div><div className="orbital ring-two"><i/></div><div className="orbital ring-three"/>
        <button className={`quality-orb shape-${shape}`} onClick={touchOrb} aria-label="Change the sensory orb's shape and color"><span className="orb-depth"/><span className="orb-shine"/></button>
        <p className="orb-note" key={note}>{notes[note]}</p>
      </div>
    </section>
    <section className="sound-section">
      <div><h2>Binaural beats for focus.<br/><em>Pink noise for rest.</em></h2></div>
      <div className="sound-player">
        <label htmlFor="sound">soundscape</label><select id="sound" value={noise} onChange={e=>changeNoise(e.target.value as NoiseName)}>{Object.entries(noiseLabels).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select>
        <button className="play" onClick={()=>playing?stop():play()}><span>{playing?"Ⅱ":"▶"}</span>{playing?"pause sound":"play sound"}</button>
        <div className={`wave ${playing?"moving":""}`} aria-hidden="true">{Array.from({length:32},(_,i)=><i key={i}/>)}</div>
        <div className="volume"><span>quiet</span><input aria-label="Volume" type="range" min="5" max="70" value={volume} onChange={e=>setVolume(Number(e.target.value))}/><span>full</span></div>
      </div>
    </section>
    <section className="ripple-world" aria-label="Liquid ripple orb sensory animation"><div className="ripple-ring rr-one"/><div className="ripple-ring rr-two"/><div className="ripple-ring rr-three"/><div className="liquid-orb"><i/><b/></div><span className="ripple-dot rd-one"/><span className="ripple-dot rd-two"/></section>
    <section className="ritual" id="ritual"><h2>Feeling overstimulated?<br/><em>Try two inhales in, one long breath out</em></h2><div className="steps"><article><b>01</b><h3>Inhale</h3><p>Take a deep breath in through your nose.</p></article><article><b>02</b><h3>Top It Off</h3><p>Take a quick, second sip of air at the top.</p></article><article><b>03</b><h3>Release</h3><p>Let out a long, slow sigh through your mouth.</p></article></div></section>
    <section className="constellation-world" aria-label="Floating pink orb constellation sensory animation"><div className="constellation-core"/>{Array.from({length:14},(_,i)=><span className="constellation-orb" key={i} style={{"--c":i} as React.CSSProperties}><i/></span>)}<div className="constellation-path cp-one"/><div className="constellation-path cp-two"/></section>
    <section className="quote-sky" aria-label="Gentle reminders"><div className="wind-lines" aria-hidden="true"/><div className="quote-ring qr-one"><i/></div><div className="quote-ring qr-two"><i/></div><div className="quote-ring qr-three"/>{Array.from({length:9},(_,i)=><span className="tiny-orb" key={i} style={{"--o":i} as React.CSSProperties}/>) }<p className="kicker">let the words pass through</p>{quotes.map((quote,i)=><blockquote key={quote} style={{"--q":i} as React.CSSProperties}>{quote}</blockquote>)}</section>
    <footer><a className="wordmark" href="#top"><i/>soft space</a><p>made gently, for gentle moments</p><a href="#top">back to top ↑</a></footer>
  </main>
}
