/* EDTEX motion: small, purposeful animations that explain instead of paragraphs.
   - [data-motion]  gets .in once it is on screen (CSS does the rest)
   - [data-loop]    gets .play while on screen, so looping graphics pause off screen
   - .mc[data-to]   counts up when its section comes into view
   - ol.pp-steps / ol.wy-steps become step-by-step flows
   - .jr            journey line is drawn through the milestone dots
   - [data-sim]     scripted illustrations (timetable solver, Day 0 board, bidding round)
   - .more-btn      reveals the full text behind a short version
   Respects prefers-reduced-motion: everything is shown in its final state. */
(function(){
  var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root=document.documentElement;if(RM)root.classList.add('rm');
  var $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s));};

  /* flows */
  $$('ol.pp-steps, ol.wy-steps').forEach(function(ol){ol.classList.add('mflow');ol.setAttribute('data-motion','');$$(':scope > li',ol).forEach(function(li,i){li.style.setProperty('--i',i);});ol.style.setProperty('--steps',ol.children.length);});

  /* counters */
  function fmt(n,src){return src.indexOf(',')>=0||n>=10000?n.toLocaleString('en-US'):String(n);}
  function count(el){if(el.dataset.done)return;el.dataset.done=1;var to=+el.dataset.to,txt=el.textContent,from=+(el.dataset.from||0);if(RM||isNaN(to)){return;}
    var d=+(el.dataset.dur||1600),t0=null;el.textContent=fmt(from,txt);
    function f(t){t0=t0||t;var k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);el.textContent=fmt(Math.round(from+(to-from)*e),txt);if(k<1)requestAnimationFrame(f);else el.textContent=txt;}
    requestAnimationFrame(f);}

  /* journey line */
  function drawJourney(j){var svg=j.querySelector('.jr-line'),pl=svg&&svg.querySelector('polyline');if(!pl)return;
    var r=j.getBoundingClientRect(),pts=$$('.jr-dot',j).map(function(d){var b=d.getBoundingClientRect();return (b.left-r.left+b.width/2).toFixed(1)+','+(b.top-r.top+b.height/2).toFixed(1);});
    svg.setAttribute('viewBox','0 0 '+r.width.toFixed(0)+' '+r.height.toFixed(0));svg.setAttribute('width',r.width);svg.setAttribute('height',r.height);
    pl.setAttribute('points',pts.join(' '));var len=0;try{len=pl.getTotalLength();}catch(e){len=2000;}
    pl.style.strokeDasharray=len;if(!j.classList.contains('in')||RM)pl.style.strokeDashoffset=j.classList.contains('in')||RM?0:len;}
  var jrs=$$('.jr');jrs.forEach(drawJourney);
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){jrs.forEach(drawJourney);},150);});
  window.addEventListener('load',function(){jrs.forEach(drawJourney);});

  /* scripted illustrations */
  var SIM={};
  SIM.tt=function(el){ /* timetable solver: clashes resolved one by one */
    var moves=$$('[data-move]',el),cnt=el.querySelector('.tt-n'),st=el.querySelector('.tt-status'),step=0,timer;
    function reset(){el.classList.remove('solved');moves.forEach(function(m){m.classList.remove('moved');m.classList.add('clash');});cnt.textContent=moves.length;st.textContent='Draft timetable: clashes found';step=0;}
    function tick(){if(!el.classList.contains('play'))return;
      if(step<moves.length){var m=moves[step];m.classList.remove('clash');m.classList.add('moved');cnt.textContent=moves.length-step-1;st.textContent=m.getAttribute('data-move');step++;timer=setTimeout(tick,1700);}
      else if(step===moves.length){el.classList.add('solved');st.textContent='0 clashes. Timetable ready for review';step++;timer=setTimeout(tick,3600);}
      else{reset();timer=setTimeout(tick,1800);}}
    reset();return{start:function(){clearTimeout(timer);timer=setTimeout(tick,900);},stop:function(){clearTimeout(timer);},final:function(){moves.forEach(function(m){m.classList.remove('clash');m.classList.add('moved');});el.classList.add('solved');cnt.textContent='0';st.textContent='0 clashes. Timetable ready for review';}};
  };
  SIM.d0=function(el){ /* Day 0 board: interviews progress slot by slot; a late panel is absorbed */
    var cells=$$('.d0-c',el),log=el.querySelector('.d0-log'),clock=el.querySelector('.d0-clock'),slot=0,timer;
    var times=['09:00','10:00','11:00','12:00','13:00'];
    var events={2:'10:40  Firm C panel running 15 min late. Next candidates moved to 11:15, no clashes.',4:'12:55  Round 1 complete. 0 clashes, every student accounted for.'};
    function reset(){cells.forEach(function(c){c.classList.remove('done','now','late','shift');});slot=0;clock.textContent=times[0];log.textContent='09:00  Round 1 starts. Schedules sent to students and panels.';}
    function tick(){if(!el.classList.contains('play'))return;
      if(slot<times.length){clock.textContent=times[slot];
        cells.forEach(function(c){var s=+c.dataset.s;if(s<slot){c.classList.remove('now');c.classList.add('done');}else if(s===slot){c.classList.add('now');}});
        if(slot===2){$$('.d0-c[data-late]',el).forEach(function(c){c.classList.add('late');});$$('.d0-c[data-shift]',el).forEach(function(c){c.classList.add('shift');});}
        if(events[slot])log.textContent=events[slot];else log.textContent=times[slot]+'  Slot '+(slot+1)+' in progress. Panels and students on time.';
        slot++;timer=setTimeout(tick,1900);}
      else{cells.forEach(function(c){c.classList.remove('now');c.classList.add('done');});timer=setTimeout(function(){reset();timer=setTimeout(tick,1200);},3600);}}
    reset();return{start:function(){clearTimeout(timer);timer=setTimeout(tick,700);},stop:function(){clearTimeout(timer);},final:function(){cells.forEach(function(c){c.classList.add('done');});$$('.d0-c[data-late]',el).forEach(function(c){c.classList.add('late');});$$('.d0-c[data-shift]',el).forEach(function(c){c.classList.add('shift');});clock.textContent='13:00';log.textContent=events[4];}};
  };
  SIM.bid=function(el){ /* bidding round: bids climb, clock counts down */
    var n=el.querySelector('.hp-n'),c=el.querySelector('.hp-clock'),b=+(n&&n.dataset.to)||0,s=14*60+32,t1,t2;
    function start(){if(!n)return;clearInterval(t1);clearInterval(t2);t1=setInterval(function(){b+=Math.random()<.55?1:0;n.textContent=b.toLocaleString('en-US');},2400);
      t2=setInterval(function(){s=s>0?s-1:14*60+32;var mm=Math.floor(s/60),ss=s%60;c.textContent='00:'+(mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss;},1000);}
    return{start:start,stop:function(){clearInterval(t1);clearInterval(t2);},final:function(){}};
  };
  var sims=$$('[data-sim]').map(function(el){var f=SIM[el.getAttribute('data-sim')];var api=f?f(el):null;el._sim=api;if(api&&RM)api.final();if(!el.hasAttribute('data-loop'))el.setAttribute('data-loop','');return el;});

  /* observers */
  function onIn(el){el.classList.add('in');$$('.mc[data-to]',el).forEach(count);if(el.classList.contains('mc'))count(el);if(el.classList.contains('jr'))setTimeout(function(){var pl=el.querySelector('.jr-line polyline');if(pl)pl.style.strokeDashoffset=0;},50);}
  var targets=$$('[data-motion]');
  if(RM||!('IntersectionObserver' in window)){targets.forEach(function(el){el.classList.add('in');});$$('.jr-line polyline').forEach(function(p){p.style.strokeDashoffset=0;});}
  else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);onIn(e.target);}});},{threshold:.25,rootMargin:'0px 0px -8% 0px'});targets.forEach(function(el){io.observe(el);});}
  var loops=$$('[data-loop]');
  if(!RM&&'IntersectionObserver' in window){var lo=new IntersectionObserver(function(es){es.forEach(function(e){var el=e.target;if(e.isIntersecting){if(!el.classList.contains('play')){el.classList.add('play');if(el._sim)el._sim.start();}}else{el.classList.remove('play');if(el._sim)el._sim.stop();}});},{threshold:.2});loops.forEach(function(el){lo.observe(el);});}
  else loops.forEach(function(el){el.classList.add('play');});

  /* read-more toggles */
  $$('.more-btn[aria-controls]').forEach(function(b){var t=document.getElementById(b.getAttribute('aria-controls'));if(!t)return;var lab=b.textContent;
    b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',o);t.hidden=!o;b.textContent=o?(b.getAttribute('data-less')||'Show less'):lab;if(o)jrs.forEach(drawJourney);if(window.edtexTrack)edtexTrack('read_more',{target:b.getAttribute('aria-controls'),open:o?1:0});});});
})();
