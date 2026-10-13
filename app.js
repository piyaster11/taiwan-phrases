const VER='202610131045',$=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const AU=new Audio();AU.preload='none';let P;
function tts(p,slow){if(!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(p.say||p.zh);u.lang='zh-TW';u.rate=slow?.6:.95;const v=speechSynthesis.getVoices().find(v=>/zh[-_]TW/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}
function speak(p,slow){if(!p.audio)return;try{AU.pause();AU.src=p.audio+'?v='+VER;AU.defaultPlaybackRate=AU.playbackRate=slow?.7:1;AU.onerror=()=>tts(p,slow);const r=AU.play();if(r&&r.catch)r.then(()=>{AU.playbackRate=slow?.7:1}).catch(()=>tts(p,slow))}catch(e){tts(p,slow)}}
const btns=p=>p.audio?'<button class="say">🔊 Play</button><button class="slow">🐢 Slow</button>':'<span class="noaud">🔇 No audio for Taiwanese Hokkien (no TTS voice) · ไม่มีเสียง</span>';
const wire=(el,p)=>{const a=el.querySelector('.say'),b=el.querySelector('.slow');if(a)a.onclick=()=>speak(p,0);if(b)b.onclick=()=>speak(p,1)};
function card(p){const c=document.createElement('div');c.className='card';
 c.innerHTML=`<div class="zh">${esc(p.zh)}${p.hokkien?'<span class="hk">台語 Hokkien</span>':''}</div><div class="cpy">${esc(p.pinyin)}</div><div class="cen">${esc(p.en)}</div><div class="cth">🇹🇭 ${esc(p.th)}</div>${p.note?`<div class="cnote">${esc(p.note)}</div>`:''}<div class="pbtn">${btns(p)}</div>`;wire(c,p);return c}
function dayIdx(n){const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)%n}
let cat='all';
function draw(){const q=$('#q').value.trim().toLowerCase(),box=$('#rows');box.innerHTML='';
 P.categories.filter(c=>cat==='all'||c.key===cat).forEach(c=>{const L=P.phrases.filter(x=>x.cat===c.key&&(!q||[x.zh,x.pinyin,x.en,x.th,x.note].join(' ').toLowerCase().includes(q)));if(!L.length)return;
  const s=document.createElement('section');s.className='row'+(c.key==='must'?' must':'');s.id=c.key;s.innerHTML=`<h2>${c.key==='must'?'📌 ':''}${esc(c.name)} · ${esc(c.th)}<small>${L.length}</small></h2>${c.sos?`<p class="sos">${esc(c.sos)}</p>`:''}<div class="grid"></div>`;L.forEach(x=>s.querySelector('.grid').appendChild(card(x)));box.appendChild(s)});
 if(!box.children.length)box.innerHTML='<p class="empty">No phrases found · ไม่พบวลี</p>'}
fetch('phrases.json?v='+VER+'-'+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(j=>{P=j;
 const pool=P.phrases.filter(x=>x.audio),p=pool[dayIdx(pool.length)];
 $('#hZh').textContent=p.zh;$('#hPy').textContent=p.pinyin;$('#hEn').textContent=p.en;$('#hTh').textContent='🇹🇭 '+p.th;$('#hNote').textContent=p.note||'';$('#hBtns').innerHTML=btns(p);wire($('#hBtns'),p);
 $('#voice').textContent=P.voice;
 $('#chips').innerHTML=['must','all',...P.categories.filter(c=>c.key!=='must').map(c=>c.key)].map(k=>{const c=P.categories.find(x=>x.key===k);return `<button data-k="${k}" class="${k==='all'?'on':''}${k==='must'?' mk':''}">${c?(k==='must'?'📌 '+esc(c.name)+' · '+esc(c.th):esc(c.name)):'All · ทั้งหมด'}</button>`}).join('');
 $('#chips').querySelectorAll('button').forEach(b=>b.onclick=()=>{cat=b.dataset.k;$('#chips').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));draw()});
 $('#q').oninput=draw;draw();
}).catch(()=>{$('#rows').innerHTML='<p class="empty">Could not load phrases · โหลดไม่สำเร็จ — please refresh</p>'});
