"use client";
import { useEffect, useRef, useState } from "react";

const prompts = ["Let your shoulders soften.","You only need to be here now.","Breathe into the quiet space.","Nothing is asking you to hurry.","Rest is part of the rhythm.","Your softness is a kind of strength.","One slow breath is enough."];

export default function Home() {
  const [prompt,setPrompt]=useState(0), [paused,setPaused]=useState(false), [sound,setSound]=useState(false);
  const audio=useRef<AudioContext|null>(null);
  useEffect(()=>{if(paused)return;const timer=window.setInterval(()=>setPrompt(p=>(p+1)%prompts.length),9000);return()=>window.clearInterval(timer)},[paused]);
  function nextPrompt(){setPrompt(p=>(p+1)%prompts.length)}
  function toggleSound(){const next=!sound;setSound(next);if(!next){audio.current?.close();audio.current=null;return}const ctx=new AudioContext(),gain=ctx.createGain(),osc=ctx.createOscillator(),lfo=ctx.createOscillator(),lfoGain=ctx.createGain();osc.type="sine";osc.frequency.value=174;lfo.frequency.value=.09;lfoGain.gain.value=.018;gain.gain.value=.025;lfo.connect(lfoGain).connect(gain.gain);osc.connect(gain).connect(ctx.destination);osc.start();lfo.start();audio.current=ctx}
  return <main className="page-shell"><section className="sensory-card" aria-label="Pink sensory breathing space">
    <header><div className="brand"><span className="brand-mark"/>soft space</div><button className={`sound-button ${sound?"active":""}`} onClick={toggleSound} aria-pressed={sound}><span className="sound-bars"><i/><i/><i/></span>{sound?"sound on":"sound off"}</button></header>
    <div className="stage"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><button className={`blob ${paused?"paused":""}`} onClick={nextPrompt} onPointerDown={()=>setPaused(true)} onPointerUp={()=>setPaused(false)} onPointerCancel={()=>setPaused(false)} aria-label="Touch for the next calming thought"><span className="blob-inner"/><span className="glint"/></button><span className="sparkle sparkle-one">✦</span><span className="sparkle sparkle-two">✦</span></div>
    <div className="message" aria-live="polite"><p className="breath-label">inhale · exhale</p><h1 key={prompt}>{prompts[prompt]}</h1><p className="hint">touch the shape whenever you need a new thought</p></div>
    <footer><span>stay as long as you like</span><div className="dots" aria-hidden="true"><i/><i/><i/></div></footer>
  </section></main>
}
