const TITLES={l2:'L2 — Data Types & Variables',l3:'L3 — Conditionals',l4:'L4 — Loops',l5:'L5 — Functions',l6:'L6 — Arrays',l7:'L7 — Objects',scope:'Scope & Closures',errors:'Error Handling',dom:'DOM Events',modules:'Modules',promises:'Promises',async:'Async / Await',oop:'OOP & Classes',json:'JSON','r-comp':'React — Components & JSX','r-state':'React — State & Hooks','r-effect':'React — useEffect','r-router':'React — Routing','r-forms':'React — Forms','r-api':'React — API Integration','ts-types':'TypeScript — Basic Types','ts-iface':'TypeScript — Interfaces & Types','ts-react':'TypeScript + React','html-basics':'HTML Basics','css-basics':'CSS Basics',cmdline:'Command Line',nodejs:'Node.js Basics',git:'Git Workflows',testing:'Testing',a11y:'Accessibility',debug:'Debugging',ai:'AI Best Practices',cheat:'Cheat Sheet'};
const ALL_LESSONS=Object.keys(TITLES).filter(k=>k!=='cheat');
const completed=new Set(JSON.parse(localStorage.getItem('jsfun2')||'[]'));

function go(id){
  document.querySelectorAll('.lesson').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(el=>el.classList.remove('active'));
  const s=document.getElementById('s-'+id);
  if(s) s.classList.add('active');
  const n=document.querySelector(`[data-id="${id}"]`);
  if(n) n.classList.add('active');
  document.getElementById('pageTitle').textContent=TITLES[id]||id;
  document.getElementById('content').scrollTop=0;
}

function done(id){
  completed.add(id);
  localStorage.setItem('jsfun2',JSON.stringify([...completed]));
  const b=document.getElementById('db-'+id);
  if(b){b.textContent='✓ Completed!';b.classList.add('done');}
  updateProg();
}

function updateProg(){
  const n=ALL_LESSONS.filter(l=>completed.has(l)).length;
  const pct=(n/ALL_LESSONS.length*100).toFixed(0);
  document.getElementById('pb').style.width=pct+'%';
  document.getElementById('pt').textContent=n+' of '+ALL_LESSONS.length+' completed';
  ALL_LESSONS.forEach(id=>{
    if(completed.has(id)){
      const t=document.getElementById('nt-'+id);
      if(t) t.textContent='✓';
      const ni=document.querySelector(`[data-id="${id}"]`);
      if(ni) ni.classList.add('done');
      const b=document.getElementById('db-'+id);
      if(b){b.textContent='✓ Completed!';b.classList.add('done');}
    }
  });
}
updateProg();

let dark=true;
function toggleTheme(){dark=!dark;document.documentElement.setAttribute('data-theme',dark?'dark':'light');}

function cp(btn){
  const code=btn.closest('.cb').querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(()=>{btn.textContent='Copied!';setTimeout(()=>btn.textContent='Copy',1500);});
}

function ti(btn){
  const code=btn.closest('.cb').querySelector('code').textContent;
  document.getElementById('editor').value=code;
  document.getElementById('editor').focus();
  clearOut();
}

function runCode(){
  const code=document.getElementById('editor').value;
  const out=document.getElementById('output');
  out.innerHTML='';
  const oL=console.log,oE=console.error,oW=console.warn,oI=console.info;
  const fmt=a=>{if(a===null)return 'null';if(typeof a==='object'){try{return JSON.stringify(a,null,2);}catch{return String(a);}}return String(a);};
  const add=(txt,cls)=>{const d=document.createElement('div');d.className='ol '+cls;d.textContent=txt;out.appendChild(d);out.scrollTop=out.scrollHeight;};
  console.log=(...a)=>add(a.map(fmt).join(' '),'log');
  console.error=(...a)=>add(a.map(fmt).join(' '),'error');
  console.warn=(...a)=>add(a.map(fmt).join(' '),'warn');
  console.info=(...a)=>add(a.map(fmt).join(' '),'info');
  try{eval(code);}catch(e){add('Error: '+e.message,'error');}
  finally{console.log=oL;console.error=oE;console.warn=oW;console.info=oI;}
  if(!out.children.length)add('// (no output)','dim');
}

function clearOut(){document.getElementById('output').innerHTML='<div class="ol dim">// cleared</div>';}

document.getElementById('editor').addEventListener('keydown',e=>{
  if(e.key==='Tab'){e.preventDefault();const s=e.target.selectionStart;e.target.value=e.target.value.substring(0,s)+'  '+e.target.value.substring(e.target.selectionEnd);e.target.selectionStart=e.target.selectionEnd=s+2;}
  if(e.key==='Enter'&&(e.ctrlKey||e.metaKey))runCode();
});
