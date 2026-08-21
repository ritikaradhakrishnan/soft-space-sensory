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

const questionSets={body:[{q:"Which color feels good right now?",options:["Pastel blue","Pastel yellow","Pastel green","Pastel pink","Pastel lilac"]},{q:"What temperature feels best?",options:["Cool","Warm","In between"]},{q:"What feels most supportive?",options:["Softness","Pressure","Space"]}],closing:[{q:"How does your body feel now?",options:["Softer","The same","Not sure"]},{q:"What do you need next?",options:["Quiet","Movement","Comfort"]},{q:"What can wait for later?",options:["A task","A reply","A decision"]}]};

function GroundingPage({variant}:{variant:keyof typeof questionSets}){
  const [answers,setAnswers]=useState<Record<number,string>>({});
  return <section className={`question-page question-${variant}`}><p className="kicker">{variant==="closing"?"before you go":"a small check in"}</p><div className="question-list">{questionSets[variant].map((item,i)=><article key={item.q} className={answers[i]?"answered":""}><span>0{i+1}</span><h3>{item.q}</h3><div className={`answer-row ${variant==="body"&&i===0?"pastel-row":""}`}>{item.options.map(option=><button key={option} aria-label={option} className={answers[i]===option?"selected":""} onClick={()=>setAnswers(a=>({...a,[i]:option}))}><span>{variant==="body"&&i===0?"":option}</span></button>)}</div></article>)}</div>{Object.keys(answers).length>0&&<div className="answer-bloom" key={Object.values(answers).join()} aria-hidden="true"/>}</section>
}

function PuzzlePage(){
  const [progress,setProgress]=useState(0),order=[1,2,3,4,5,6];
  function choose(n:number){if(progress===order.length){setProgress(0);return}if(n===order[progress])setProgress(p=>p+1)}
  return <section className={`puzzle-page ${progress===order.length?"complete":""}`}><p className="kicker">tap in order</p><h2>A tiny pattern.</h2><div className="puzzle-board">{order.map((n,i)=><button key={n} className={i<progress?"done":""} onClick={()=>choose(n)} aria-label={`Step ${n}`}><span>{n}</span><i/></button>)}<div className="puzzle-glow"/></div><p className="puzzle-status">{progress===order.length?"complete · tap once to begin again":`${progress} of ${order.length}`}</p></section>
}

function BloomPuzzle(){
  const [petals,setPetals]=useState<number[]>([]),total=8;
  function touch(i:number){setPetals(p=>p.length===total?[i]:p.includes(i)?p:[...p,i])}
  return <section className={`bloom-puzzle ${petals.length===total?"complete":""}`}><p className="kicker">wake each petal</p><h2>Make it bloom.</h2><div className="bloom-board"><div className="bloom-center"/>{Array.from({length:total},(_,i)=><button key={i} className={petals.includes(i)?"awake":""} style={{"--b":i} as React.CSSProperties} onClick={()=>touch(i)} aria-label={`Petal ${i+1}`}><i/></button>)}</div><p className="puzzle-status">{petals.length===total?"full bloom · tap a petal to begin again":`${petals.length} of ${total}`}</p></section>
}

function BubblePuzzle(){
  const [progress,setProgress]=useState(0),total=7;
  function touch(i:number){if(progress===total){setProgress(i===0?1:0);return}if(i===progress)setProgress(p=>p+1)}
  return <section className={`bubble-puzzle ${progress===total?"complete":""}`}><p className="kicker">small to big</p><h2>Let each bubble glow.</h2><div className="bubble-board">{Array.from({length:total},(_,i)=><button key={i} className={i<progress?"lit":""} style={{"--bubble":i} as React.CSSProperties} onClick={()=>touch(i)} aria-label={`Bubble ${i+1} of ${total}`}/>) }<div className="bubble-halo"/></div><p className="puzzle-status">{progress===total?"all glowing · tap the smallest to begin again":`${progress} of ${total}`}</p></section>
}

export default function Home(){
  const [shape,setShape]=useState(0),[palette,setPalette]=useState(0),[note,setNote]=useState(0),[noise,setNoise]=useState<NoiseName>("pink"),[playing,setPlaying]=useState(false),[volume,setVolume]=useState(28),[dvdBurst,setDvdBurst]=useState(0),[dvdPalette,setDvdPalette]=useState(0),[dvdNote,setDvdNote]=useState(1),[constellationReverse,setConstellationReverse]=useState(false),[constellationPalette,setConstellationPalette]=useState(0),[constellationNote,setConstellationNote]=useState(2);
  const engine=useRef<{ctx:AudioContext;gain:GainNode}|null>(null);
  useEffect(()=>()=>{engine.current?.ctx.close()},[]);
  useEffect(()=>{if(engine.current)engine.current.gain.gain.setTargetAtTime(volume/500,engine.current.ctx.currentTime,.08)},[volume]);
  function stop(){engine.current?.ctx.close();engine.current=null;setPlaying(false)}
  function play(kind=noise){stop();const ctx=new AudioContext(),gain=ctx.createGain();gain.gain.value=volume/500;gain.connect(ctx.destination);if(kind==="binaural"){const left=ctx.createOscillator(),right=ctx.createOscillator(),lp=ctx.createStereoPanner(),rp=ctx.createStereoPanner();left.frequency.value=200;right.frequency.value=210;left.type=right.type="sine";lp.pan.value=-1;rp.pan.value=1;left.connect(lp).connect(gain);right.connect(rp).connect(gain);left.start();right.start()}else{const source=ctx.createBufferSource();source.buffer=makeNoise(ctx,kind);source.loop=true;source.connect(gain);source.start()}engine.current={ctx,gain};setPlaying(true)}
  function changeNoise(kind:NoiseName){setNoise(kind);if(playing)play(kind)}
  function touchOrb(){setShape(s=>(s+1)%5);setPalette(p=>(p+1)%palettes.length);setNote(n=>(n+1)%notes.length)}
  function bounceReaction(){setDvdBurst(n=>n+1);setDvdPalette(p=>(p+1)%palettes.length);setDvdNote(n=>(n+1)%notes.length)}
  function reverseConstellation(){setConstellationReverse(v=>!v);setConstellationPalette(p=>(p+1)%palettes.length);setConstellationNote(n=>(n+1)%notes.length)}
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
    <GroundingPage variant="body"/>
    <section className="sound-section">
      <div><h2>Binaural beats for focus.<br/><em>Pink noise for rest.</em></h2></div>
      <div className="sound-player">
        <label htmlFor="sound">soundscape</label><select id="sound" value={noise} onChange={e=>changeNoise(e.target.value as NoiseName)}>{Object.entries(noiseLabels).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select>
        <button className="play" onClick={()=>playing?stop():play()}><span>{playing?"Ⅱ":"▶"}</span>{playing?"pause sound":"play sound"}</button>
        <div className={`wave ${playing?"moving":""}`} aria-hidden="true">{Array.from({length:32},(_,i)=><i key={i}/>)}</div>
        <div className="volume"><span>quiet</span><input aria-label="Volume" type="range" min="5" max="70" value={volume} onChange={e=>setVolume(Number(e.target.value))}/><span>full</span></div>
      </div>
    </section>
    <section className={`constellation-world ${constellationReverse?"reverse":""} ${palettes[constellationPalette]}`} aria-label="Floating pink orb constellation sensory animation"><button className="constellation-field" onClick={reverseConstellation} aria-label={`Reverse the constellation, change its color, and show a new affirmation. Currently moving ${constellationReverse?"counterclockwise":"clockwise"}`}><div className="constellation-core"/>{Array.from({length:14},(_,i)=><span className="constellation-orb" key={i} style={{"--c":i} as React.CSSProperties}><i/></span>)}<div className="constellation-path cp-one"/><div className="constellation-path cp-two"/><div className="constellation-path cp-three"/></button><p className="sensory-note constellation-note" key={constellationNote}>{notes[constellationNote]}</p></section>
    <PuzzlePage/>
    <section className="ritual" id="ritual"><h2>Feeling overstimulated?<br/><em>Try two inhales in, one long breath out</em></h2><div className="steps"><article><b>01</b><h3>Inhale</h3><p>Take a deep breath in through your nose.</p></article><article><b>02</b><h3>Top It Off</h3><p>Take a quick, second sip of air at the top.</p></article><article><b>03</b><h3>Release</h3><p>Let out a long, slow sigh through your mouth.</p></article></div></section>
    <section className={`dvd-world ${palettes[dvdPalette]} hit-${dvdBurst%2}`} aria-label="Bouncing pink orb sensory animation"><button className="dvd-stage" onClick={bounceReaction} aria-label="React to the bouncing orb, change its color, and show a new affirmation"><span className="dvd-x"><span className="dvd-y"><span className="dvd-local-ring dlr-one"><i/></span><span className="dvd-local-ring dlr-two"><i/></span><span className="dvd-local-ring dlr-three"/><span className="dvd-orb"><i/><b/></span></span></span><span className="impact" key={`impact-${dvdBurst}`}>{Array.from({length:12},(_,i)=><i key={i} style={{"--p":i} as React.CSSProperties}/>)}</span><span className="screen-ring sr-one"/><span className="screen-ring sr-two"/></button><p className="sensory-note dvd-note" key={dvdNote}>{notes[dvdNote]}</p></section>
    <BloomPuzzle/>
    <section className="quote-sky" aria-label="Gentle reminders"><div className="wind-lines" aria-hidden="true"/><div className="quote-ring qr-one"><i/></div><div className="quote-ring qr-two"><i/></div><div className="quote-ring qr-three"/>{Array.from({length:9},(_,i)=><span className="tiny-orb" key={i} style={{"--o":i} as React.CSSProperties}/>) }<p className="kicker">let the words pass through</p>{quotes.map((quote,i)=><blockquote key={quote} style={{"--q":i} as React.CSSProperties}>{quote}</blockquote>)}</section>
    <GroundingPage variant="closing"/>
    <BubblePuzzle/>
    <section className="conclusion" aria-label="A gentle conclusion"><div className="conclusion-rings" aria-hidden="true"><i/><i/><b/><b/></div><p className="kicker">a soft ending</p><h2>You made a little space.<br/><em>That is enough for now.</em></h2><p>Take what helped. Leave the rest.</p><a href="#top">begin again <span>↑</span></a></section>
    <footer><a className="wordmark" href="#top"><i/>soft space</a><p>made gently, for gentle moments</p><a href="#top">back to top ↑</a></footer>
  </main>
}
