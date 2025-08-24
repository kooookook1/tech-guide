// Theme boot + persistence
/* global Prism */

const root = document.documentElement;
// Always start in dark for best readability on phones
root.classList.remove('light');
localStorage.setItem('theme','dark');

const themeToggle = document.getElementById('themeToggle');
if(themeToggle){
  const updatePressed = ()=> themeToggle.setAttribute('aria-pressed', root.classList.contains('light'));
  updatePressed();
  themeToggle.addEventListener('click', ()=>{
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
    updatePressed();
  });
}

// UI sounds
const soundToggle = document.getElementById('soundToggle');
const sndClick = document.getElementById('uiClick');
const sndOpen = document.getElementById('uiOpen');
if(soundToggle){
  const update = ()=> soundToggle.setAttribute('aria-pressed', localStorage.getItem('sound')!=='off' ? 'true' : 'false');
  update();
  soundToggle.addEventListener('click', ()=>{
    const newState = localStorage.getItem('sound') === 'off';
    localStorage.setItem('sound', newState ? 'on' : 'off');
    update();
    sndOpen && newState && sndOpen.play().catch(()=>{});
  });
}
function playClick(){ if(localStorage.getItem('sound') !== 'off') sndClick?.play().catch(()=>{}); }
function playOpen(){ if(localStorage.getItem('sound') !== 'off') sndOpen?.play().catch(()=>{}); }

// Matrix rain background
(function(){
  const canvas = document.getElementById('matrix'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, cols, drops;
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cols = Math.floor(w/14);
    drops = new Array(cols).fill(0).map(()=> Math.random()*h);
  }
  function draw(){
    ctx.fillStyle='rgba(0,0,0,0.08)'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#39ff14'; ctx.font='14px monospace';
    for(let i=0;i<cols;i++){
      const ch = chars[Math.floor(Math.random()*chars.length)];
      ctx.fillText(ch, i*14, drops[i]);
      drops[i] += 14 + Math.random()*8;
      if(drops[i] > h || Math.random()>0.98){ drops[i] = 0; }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();
  draw();
})();


const menuToggle = document.getElementById('menuToggle');
const mainMenu = document.getElementById('mainMenu');
if(menuToggle && mainMenu){
  menuToggle.addEventListener('click', ()=>{
    const open = mainMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
  });
}

// Animated stats
function animateCounters(){
  const first = document.querySelector('.stats .num[data-target]');
  if(first){ first.dataset.target = String(LANGS.length); }
  document.querySelectorAll('.num[data-target]').forEach(el=>{
    const target = +el.dataset.target;
    let cur = 0;
    const step = Math.max(1, Math.round(target/60));
    const t = setInterval(()=>{
      cur += step;
      if(cur >= target){ cur = target; clearInterval(t); }
      el.textContent = cur.toLocaleString('ar-EG');
    }, 30);
  });
}

// Data for language cards
const LANGS = [
  {name:'JavaScript', domain:['web'], level:'سهل-متوسط', use:'واجهات الويب، تطبيقات كاملة (Node.js).', designs:['DOM','SPAs','Node APIs'], tags:['Web','Frontend','Backend'], color:'#f59e0b'},
  {name:'TypeScript', domain:['web'], level:'متوسط', use:'مشاريع كبيرة أكثر أمانًا من JavaScript.', designs:['Types','Tooling'], tags:['Web','Typed'], color:'#3b82f6'},
  {name:'Python', domain:['data','scripting','web'], level:'سهل', use:'علم البيانات، الذكاء الاصطناعي، سكربتات، ويب (Django/Flask).', designs:['Django','Flask','FastAPI'], tags:['AI','Data','Web'], color:'#22c55e'},
  {name:'Java', domain:['mobile','web'], level:'متوسط', use:'تطبيقات مؤسسية، أندرويد (قديماً)، خدمات خلفية.', designs:['Spring'], tags:['Backend','Enterprise'], color:'#ef4444'},
  {name:'Kotlin', domain:['mobile'], level:'متوسط', use:'أندرويد حديث، سيرفرات.', designs:['Ktor'], tags:['Android'], color:'#a855f7'},
  {name:'Swift', domain:['mobile'], level:'متوسط', use:'iOS/macOS.', designs:['SwiftUI'], tags:['iOS'], color:'#06b6d4'},
  {name:'C#', domain:['web','mobile'], level:'متوسط', use:'.NET، تطبيقات سطح مكتب، ألعاب مع Unity.', designs:['ASP.NET','MAUI','Unity'], tags:['.NET','Games'], color:'#9333ea'},
  {name:'C++', domain:['systems'], level:'متقدم', use:'أنظمة عالية الأداء، الألعاب، المحركات.', designs:['STL'], tags:['Performance'], color:'#64748b'},
  {name:'C', domain:['systems'], level:'متقدم', use:'أنظمة تشغيل، مضمّن (Embedded).', designs:['POSIX'], tags:['Systems'], color:'#14b8a6'},
  {name:'Go', domain:['systems','web'], level:'متوسط', use:'خدمات سحابيّة وأدوات، تراسلية عالية.', designs:['Goroutines'], tags:['Cloud'], color:'#22d3ee'},
  {name:'Rust', domain:['systems'], level:'متقدم', use:'أمان الذاكرة مع الأداء العالي.', designs:['Ownership'], tags:['Safety','Perf'], color:'#f97316'},
  {name:'PHP', domain:['web'], level:'سهل-متوسط', use:'تطوير مواقع وخلفيات (Laravel).', designs:['Laravel'], tags:['Web'], color:'#6366f1'}
  ,{name:'Ruby', domain:['web','scripting'], level:'سهل-متوسط', use:'تطوير ويب سريع (Rails) وسكربتات.', designs:['Rails'], tags:['Web','Scripting'], color:'#cc342d'}
  ,{name:'R', domain:['data'], level:'متوسط', use:'تحليل إحصائي ورسوم بيانية.', designs:['Tidyverse'], tags:['Data','Stats'], color:'#198cff'}
  ,{name:'Dart', domain:['mobile','web'], level:'متوسط', use:'واجهات Flutter وتطبيقات ويب.', designs:['Flutter'], tags:['Mobile','Web'], color:'#00c4b3'}
];

// Cyber catalog data (seed; يمكن توسيعها لاحقًا برمجياً)
const CYBER = [
  // Distros
  {type:'distros', name:'Kali Linux', desc:'توزيعة متخصصة للاختبار الأمني.', link:'https://www.kali.org/get-kali/', vendor:'OffSec'},
  {type:'distros', name:'Parrot OS', desc:'نظام للأمن السيبراني والخصوصية.', link:'https://www.parrotsec.org/download/', vendor:'Parrot'},
  {type:'distros', name:'BlackArch', desc:'مستودع/توزيعة اختبارات اختراق مبنية على Arch.', link:'https://blackarch.org/downloads.html', vendor:'BlackArch'},
  // Tools (أمثلة تعليمية ومراقبة/جمع معلومات مشروعة)
  {type:'tools', name:'Nmap', desc:'فحص الشبكات والمنافذ.', link:'https://nmap.org/', vendor:'Insecure.Org'},
  {type:'tools', name:'Wireshark', desc:'التقاط وتحليل حزم الشبكة.', link:'https://www.wireshark.org/', vendor:'Wireshark'},
  {type:'tools', name:'Metasploit Framework', desc:'إطار اختبار الثغرات (تعليمي).', link:'https://www.metasploit.com/', vendor:'Rapid7'},
  {type:'tools', name:'Burp Suite Community', desc:'اختبار أمان تطبيقات الويب (تعليمي).', link:'https://portswigger.net/burp/communitydownload', vendor:'PortSwigger'},
  {type:'tools', name:'Hydra', desc:'اختبارات كلمات المرور (تعليمي).', link:'https://github.com/vanhauser-thc/thc-hydra', vendor:'THC'},
  {type:'tools', name:'Aircrack-ng', desc:'تحليل وتأمين شبكات الواي فاي (تعليمي).', link:'https://www.aircrack-ng.org/', vendor:'Aircrack-ng'},
  {type:'tools', name:'OSINT Framework', desc:'روابط وأدوات جمع معلومات عامة.', link:'https://osintframework.com/', vendor:'OSINT'},
  // Hosting (تجريبية/مجانية)
  {type:'hosting', name:'Firebase', desc:'استضافة وتطبيقات بدون خادم وتجربة مجانية.', link:'https://firebase.google.com/', vendor:'Google'},
  {type:'hosting', name:'Vercel', desc:'استضافة تطبيقات ويب وحدات مجانية.', link:'https://vercel.com/', vendor:'Vercel'},
  {type:'hosting', name:'Netlify', desc:'استضافة مواقع ستاتيكية ومزايا مجانية.', link:'https://www.netlify.com/', vendor:'Netlify'},
  {type:'hosting', name:'GitHub Pages', desc:'استضافة صفحات مباشرة من مستودعك.', link:'https://pages.github.com/', vendor:'GitHub'},
  // Open-source AI models (موسّعة)
  {type:'ai', name:'Stable Diffusion', desc:'نموذج توليد صور مفتوح المصدر.', link:'https://github.com/CompVis/stable-diffusion', vendor:'CompVis'},
  {type:'ai', name:'Llama 3.1', desc:'نماذج لغوية من Meta (أحجام متعددة).', link:'https://ai.meta.com/llama/', vendor:'Meta', ts: Date.now()},
  {type:'ai', name:'Mistral 7B', desc:'نموذج خفيف وعالي الجودة.', link:'https://mistral.ai/', vendor:'Mistral AI', ts: Date.now()},
  {type:'ai', name:'Mixtral 8x7B', desc:'Mixture of Experts مفتوح.', link:'https://mistral.ai/news/mixtral-of-experts/', vendor:'Mistral AI', ts: Date.now()},
  {type:'ai', name:'Gemma 2', desc:'نماذج لغوية من Google.', link:'https://ai.google.dev/gemma', vendor:'Google', ts: Date.now()},
  {type:'ai', name:'Phi-3', desc:'نماذج خفيفة من Microsoft.', link:'https://www.microsoft.com/research/project/phi-3/', vendor:'Microsoft', ts: Date.now()},
  {type:'ai', name:'Qwen2', desc:'سلسلة نماذج من Alibaba.', link:'https://github.com/QwenLM/Qwen2', vendor:'QwenLM', ts: Date.now()},
  {type:'ai', name:'Qwen2-VL', desc:'نماذج متعددة الوسائط.', link:'https://github.com/QwenLM/Qwen2-VL', vendor:'QwenLM', ts: Date.now()},
  {type:'ai', name:'DeepSeek-V2', desc:'نماذج فعّالة مفتوحة.', link:'https://github.com/deepseek-ai/DeepSeek-V2', vendor:'DeepSeek', ts: Date.now()},
  {type:'ai', name:'Code Llama', desc:'نماذج توليد كود.', link:'https://github.com/facebookresearch/codellama', vendor:'Meta', ts: Date.now()},
  {type:'ai', name:'StarCoder2', desc:'نماذج كود من BigCode.', link:'https://huggingface.co/bigcode/starcoder2-15b', vendor:'BigCode', ts: Date.now()},
  {type:'ai', name:'Falcon 180B', desc:'نماذج من TII UAE.', link:'https://falconllm.tii.ae/', vendor:'TII UAE', ts: Date.now()},
  {type:'ai', name:'BLOOM', desc:'نموذج متعدد اللغات (BigScience).', link:'https://huggingface.co/bigscience/bloom', vendor:'BigScience', ts: Date.now()},
  {type:'ai', name:'TinyLlama', desc:'نموذج صغير سريع.', link:'https://github.com/jzhang38/TinyLlama', vendor:'TinyLlama', ts: Date.now()},
  {type:'ai', name:'RWKV', desc:'بنية بديلة فعّالة للذاكرة.', link:'https://github.com/RWKV/RWKV-LM', vendor:'RWKV', ts: Date.now()},
  {type:'ai', name:'LLaVA', desc:'نماذج رؤية-نص متعددة الوسائط.', link:'https://github.com/haotian-liu/LLaVA', vendor:'LLaVA', ts: Date.now()},
  {type:'ai', name:'MiniCPM', desc:'نماذج خفيفة متعددة الوسائط.', link:'https://github.com/OpenBMB/MiniCPM', vendor:'OpenBMB', ts: Date.now()},
  {type:'ai', name:'InternLM', desc:'نماذج من Shanghai AI Lab.', link:'https://github.com/InternLM/InternLM', vendor:'Shanghai AI Lab', ts: Date.now()},
  {type:'ai', name:'MPT-7B', desc:'نماذج من MosaicML.', link:'https://www.mosaicml.com/blog/mpt-7b', vendor:'MosaicML', ts: Date.now()},
  {type:'ai', name:'Dolly v2', desc:'نموذج تعليمات مفتوح.', link:'https://github.com/databrickslabs/dolly', vendor:'Databricks', ts: Date.now()},
  {type:'ai', name:'Pythia', desc:'سلسلة نماذج من EleutherAI.', link:'https://github.com/EleutherAI/pythia', vendor:'EleutherAI', ts: Date.now()},
  {type:'ai', name:'Stable LM 2', desc:'نماذج لغة من Stability.', link:'https://stability.ai/news/stable-lm-2', vendor:'Stability AI', ts: Date.now()},
  {type:'ai', name:'Whisper', desc:'تعرف صوتي من OpenAI مفتوح المصدر.', link:'https://github.com/openai/whisper', vendor:'OpenAI'},
  {type:'ai', name:'DeepSeek-Coder', desc:'نماذج ترميز مفتوحة.', link:'https://github.com/deepseek-ai/DeepSeek-Coder', vendor:'DeepSeek', ts: Date.now()},

  // توزيعات وأنظمة (روابط رسمية مباشرة حيث أمكن)
  {type:'distros', name:'Ubuntu Desktop 24.04 LTS', desc:'توزيعة لينكس للمستخدمين، دعم طويل.', link:'https://releases.ubuntu.com/24.04/ubuntu-24.04-desktop-amd64.iso', vendor:'Canonical', dl:'direct'},
  {type:'distros', name:'Fedora Workstation 40', desc:'لينكس حديث للمطورين.', link:'https://download.fedoraproject.org/pub/fedora/linux/releases/40/Workstation/x86_64/iso/Fedora-Workstation-Live-x86_64-40-1.14.iso', vendor:'Fedora', dl:'direct'},
  {type:'distros', name:'Windows 11 (رابط رسمي)', desc:'تنزيل من مايكروسوفت (ملف ISO).', link:'https://www.microsoft.com/software-download/windows11', vendor:'Microsoft'},
  {type:'distros', name:'Windows 10 (رابط رسمي)', desc:'تنزيل أداة أو ISO رسمي.', link:'https://www.microsoft.com/software-download/windows10', vendor:'Microsoft'},

  // أدوات إضافية للذكاء الاصطناعي (محركات/واجهات)
  {type:'tools', name:'llama.cpp', desc:'تشغيل نماذج LLM محليًا على CPU/GPU.', link:'https://github.com/ggerganov/llama.cpp', vendor:'ggerganov'},
  {type:'tools', name:'vLLM', desc:'محرك استدلال سريع وفعّال.', link:'https://github.com/vllm-project/vllm', vendor:'vLLM'},
  {type:'tools', name:'text-generation-webui', desc:'واجهة ويب لتشغيل النماذج محليًا.', link:'https://github.com/oobabooga/text-generation-webui', vendor:'oobabooga'},
  {type:'tools', name:'Ollama', desc:'تنزيل وتشغيل نماذج محليًا بسهولة.', link:'https://github.com/ollama/ollama', vendor:'Ollama'},
  {type:'tools', name:'Open WebUI', desc:'واجهة ويب ذاتية لنماذج محلية/بعيدة.', link:'https://github.com/open-webui/open-webui', vendor:'Open WebUI'},
  {type:'tools', name:'KoboldCpp', desc:'تشغيل نماذج للدردشة/القصص.', link:'https://github.com/LostRuins/koboldcpp', vendor:'KoboldCpp'},
  {type:'tools', name:'GPT4All', desc:'منصة نماذج محلية متعددة.', link:'https://github.com/nomic-ai/gpt4all', vendor:'Nomic AI'},
  {type:'tools', name:'Tabby', desc:'مكمّل كود ذاتي مستضاف.', link:'https://github.com/TabbyML/tabby', vendor:'TabbyML'},

  // أدوات أمنية عامة (موجودة سابقًا)
  {type:'tools', name:'gh (GitHub CLI)', desc:'سطر أوامر للتعامل مع GitHub.', link:'https://github.com/cli/cli', vendor:'GitHub'},
  {type:'tools', name:'Actions Runner', desc:'مشغّل GitHub Actions ذاتي.', link:'https://github.com/actions/runner', vendor:'GitHub'},
  {type:'tools', name:'CodeQL', desc:'تحليل أمني للشفرة من GitHub.', link:'https://github.com/github/codeql', vendor:'GitHub'},
  {type:'tools', name:'Trivy', desc:'فاحص ثغرات للحاويات والكود.', link:'https://github.com/aquasecurity/trivy', vendor:'Aqua Security'},
  {type:'tools', name:'ZAP (OWASP)', desc:'ماسح أمان تطبيقات ويب مفتوح.', link:'https://www.zaproxy.org/download/', vendor:'OWASP'},


  // Labs / learning platforms (قانونية وتعليمية)
  {type:'labs', name:'Hack The Box (Academy)', desc:'تعلم عملي على منصات افتراضية قانونية.', link:'https://academy.hackthebox.com/', vendor:'HTB'},
  {type:'labs', name:'TryHackMe', desc:'مسارات تعليمية عملية في الأمن السيبراني.', link:'https://tryhackme.com/', vendor:'TryHackMe'}

];

// Verify if a GitHub repo likely comes from an official vendor/org
function verifyOfficial(repo){
  try{
    const name = (repo.owner && (repo.owner.login||repo.owner.name)||'').toLowerCase();
    const org = (repo.organization && repo.organization.login||'').toLowerCase();
    const full = repo.full_name?.toLowerCase()||'';
    const officialOrgs = new Set([
      'owasp','projectdiscovery','aquasecurity','github','gitlab','google','microsoft','meta','hashicorp','apache','kubernetes','rust-lang','golang','python','nodejs','llvm','mozilla','wireshark','nmap','portswigger'
    ]);
    const isOfficial = officialOrgs.has(name) || officialOrgs.has(org) || [...officialOrgs].some(o=> full.startsWith(o+'/'));
    return isOfficial;
  }catch{return false}
}

// Import cyber tools from GitHub topics (experimental)
async function importCyberFromGitHubTopics(){
  const topics = [
    'security','penetration-testing','osint','forensics','malware-analysis','reconnaissance','red-team','blue-team','dfir','wifi','cryptography','vulnerability','bug-bounty','web-security','mobile-security','cloud-security','kubernetes-security','devsecops','sast','dast','fuzzing','reverse-engineering','ctf','hash','password-cracking','wireless-security','ids','waf','tls','xss','sql-injection','recon','endpoint-security','threat-hunting','siem','soar','mitre-attck','packet-capture','network-monitoring','linux-security','windows-security','android-security','ios-security','privilege-escalation','containers-security','docker-security','k8s-security','supply-chain-security','sbom'
  ];
  const perPage = 100; const pages = 2;
  const seen = new Set(CYBER.filter(x=>x.link).map(x=>x.link));
  let added = 0;
  for(const t of topics){
    for(let p=1;p<=pages;p++){
      const url = `https://api.github.com/search/repositories?q=topic:${encodeURIComponent(t)}+stars:%3E50&sort=stars&order=desc&per_page=${perPage}&page=${p}`;
      try{
        const res = await fetch(url, {headers:{'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});
        if(!res.ok) break;
        const data = await res.json();
        if(!data || !Array.isArray(data.items)) break;
        for(const r of data.items){
          if(!r || !r.html_url || seen.has(r.html_url)) continue;
          CYBER.push({type:'tools', name:r.name, desc:(r.description||'').slice(0,200), link:r.html_url, vendor:(r.owner&&r.owner.login)||'GitHub', src: verifyOfficial(r) ? 'official' : 'community', ts: Date.now()});
          seen.add(r.html_url);
          added++;
          if(added>=1000) break;
        }
        if(added>=1000) break;
        await new Promise(s=>setTimeout(s, 250));
      }catch(_){ break; }
    }
    if(added>=1000) break;
  }
  toast(`تم الاستيراد: ${added} أداة من GitHub`);
  renderCyber(1);
}


// ==== Cyber section (global) ====
const CYBER_PER_PAGE = 40;
let cyberPage = 1;

function filterCyber(){
  const q = (document.getElementById('cyberSearch')?.value||'').toLowerCase();
  const cat = document.getElementById('cyberCategory')?.value || 'all';
  const src = document.getElementById('cyberSource')?.value || 'all';
  return CYBER.filter(item=>{
    const itemSrc = item.src || 'official';
    const inCat = cat==='all' || item.type===cat;
    const inSrc = src==='all' || itemSrc===src;
    const inQ = !q || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || (item.vendor||'').toLowerCase().includes(q);
    return inCat && inSrc && inQ;
  });
}

function renderCyber(page=1){
  cyberPage = page;
  const grid = document.getElementById('cyberGrid'); if(!grid) return;
  const all = filterCyber();
  grid.innerHTML = '';
  const start = (cyberPage-1)*CYBER_PER_PAGE;
  const slice = all.slice(start, start+CYBER_PER_PAGE);
  slice.forEach(it=>{
    const card = document.createElement('article');
    card.className = 'card';
    const isDownload = /\.(iso|exe|zip|tar\.gz|AppImage)$/i.test(it.link) || it.dl === 'direct';
    const btnLabel = isDownload ? 'تحميل' : 'الانتقال للمصدر';
    card.innerHTML = `
      <div class="badge"><span class="dot"></span>${it.type}</div>
      <h3>${it.name}</h3>
      <p>${it.desc}</p>
      <div class="meta"><span>الناشر: ${it.vendor||'-'}</span><span class="dot"></span><span class="badge" title="المصدر">${(it.src||'official')==='community'?'مجتمعي':'رسمي'}</span></div>
      <div class="tools" style="margin-top:.5rem">
        <a class="btn primary" href="${it.link}" target="_blank" rel="noopener noreferrer">${btnLabel}</a>
        <button class="btn ghost" data-info>معلومات</button>
      </div>`;
    card.querySelector('[data-info]')?.addEventListener('click', ()=>{
      document.getElementById('modalTitle').textContent = it.name;
      document.getElementById('modalBody').innerHTML = `
        <p>${it.desc}</p>
        <ul>
          <li>الاستخدام التعليمي/القانوني: مراجعة الأمان، التعلّم المختبري، اختبار الأنظمة المملوكة لك أو المصرَّح بها.</li>
          <li>اشتراطات: بيئة معملية/تصاريح رسمية، احترام القوانين المحلية.</li>
        </ul>
        <p><a class="btn" href="${it.link}" target="_blank" rel="noopener">المصدر الرسمي</a></p>`;
      openModal('modal');
    });
    grid.appendChild(card);
  });
  renderCyberPager(all.length);
  renderMonthly(all);
}

// Monthly updates: show the most recently added 12 items (fallback: first 12)
function renderMonthly(all){
  const cont = document.getElementById('monthlyList'); if(!cont) return;
  cont.innerHTML = '';
  // Assume items may have ts (timestamp) when imported; fallback to end order
  const withIndex = all.map((it,i)=>({it,i}));
  withIndex.sort((a,b)=> (b.it.ts||b.i) - (a.it.ts||a.i));
  withIndex.slice(0,12).forEach(({it})=>{
    const c = document.createElement('article');
    c.className='card';
    c.innerHTML = `<div class="badge">${it.type}</div><h4 style="margin:.25rem 0">${it.name}</h4><p>${(it.desc||'').slice(0,120)}</p><a class="btn ghost" href="${it.link}" target="_blank" rel="noopener">فتح</a>`;
    cont.appendChild(c);
  });
}

function renderCyberPager(total){
  const per = CYBER_PER_PAGE;
  const pages = Math.max(1, Math.ceil(total/per));
  let pager = document.getElementById('cyberPager');
  if(!pager){
    pager = document.createElement('div');
    pager.id = 'cyberPager';
    pager.className = 'pager';
    document.getElementById('cyber')?.appendChild(pager);
  }
  pager.innerHTML = '';
  if(pages <= 1){ pager.hidden = true; return; }
  pager.hidden = false;
  const mkBtn = (label, page, disabled=false)=>{
    const b = document.createElement('button');
    b.className = 'btn ghost'; b.textContent = label; b.disabled = disabled;
    if(!disabled){ b.addEventListener('click', ()=> renderCyber(page)); }
    return b;
  };
  pager.appendChild(mkBtn('السابق', Math.max(1, cyberPage-1), cyberPage===1));
  const range = [];
  for(let p=1; p<=pages; p++) range.push(p);
  range.slice(Math.max(0, cyberPage-3), cyberPage+2).forEach(p=>{
    const b = mkBtn(String(p), p, p===cyberPage);
    if(p===cyberPage){ b.classList.remove('ghost'); b.classList.add('primary'); }
    pager.appendChild(b);
  });
  pager.appendChild(mkBtn('التالي', Math.min(pages, cyberPage+1), cyberPage===pages));
}

// Global UI click sound (throttled)
let __lastClickSnd = 0;
document.addEventListener('click', (e)=>{
  const el = e.target.closest('button, a');
  if(!el) return;
  const now = performance.now();
  if(now - __lastClickSnd < 120) return;
  __lastClickSnd = now;
  try{ playClick(); }catch{}
});

async function loadCyberData(){
  try{
    const res = await fetch('./cyber.json', {cache:'no-store'});
    if(!res.ok) return;
    const arr = await res.json();
    if(Array.isArray(arr)){
      arr.forEach(it=>{ if(it && it.name && it.type && it.link){ CYBER.push(it); } });
    }
  }catch(_){/* ignore */}
}

function isCyberDev(){
  const url = new URL(location.href);
  return url.searchParams.has('dev') || localStorage.getItem('cyber_dev')==='1';
}

function setupCyber(){
  const s = document.getElementById('cyberSearch');
  const c = document.getElementById('cyberCategory');
  const ex = document.getElementById('exportCyberCsv');
  s?.addEventListener('input', ()=> renderCyber(1));
  c?.addEventListener('change', ()=> renderCyber(1));
    document.getElementById('cyberSource')?.addEventListener('change', ()=> renderCyber(1));

  ex?.addEventListener('click', ()=>{
    const items = filterCyber().map(it=>`"${it.name.replace(/\"/g,'\"\"')}\",${it.type},${it.vendor||''},${it.link}`).join('\n');
    const csv = 'name,type,vendor,link\n'+items;
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'cyber.csv'; a.click(); URL.revokeObjectURL(url);
  });
  if(isCyberDev()){
    const toolsBar = document.querySelector('#cyber .section-header .tools');
    const exp = document.createElement('button'); exp.className='btn ghost'; exp.textContent='تصدير JSON';
    const imp = document.createElement('button'); imp.className='btn ghost'; imp.textContent='استيراد JSON';
    const gh = document.createElement('button'); gh.className='btn ghost'; gh.textContent='استيراد من GitHub (تجريبي)';
    const input = document.createElement('input'); input.type='file'; input.accept='application/json'; input.hidden=true;
    exp.addEventListener('click', ()=>{
      const data = JSON.stringify(CYBER, null, 2);
      const blob = new Blob([data], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'cyber.json'; a.click(); URL.revokeObjectURL(url);
    });
    gh.addEventListener('click', ()=>{ importCyberFromGitHubTopics(); });
    toolsBar?.appendChild(gh);
    toolsBar?.appendChild(exp);
    toolsBar?.appendChild(imp);
    toolsBar?.appendChild(input);
    imp.addEventListener('click', ()=> input.click());
    input.addEventListener('change', ()=>{
      const file = input.files?.[0]; if(!file) return;
      const fr = new FileReader();
      fr.onload = ()=>{
        try{
          const arr = JSON.parse(fr.result);
          if(Array.isArray(arr)){
            CYBER.length = 0; arr.forEach(x=> CYBER.push(x));
            toast('تم الاستيراد'); renderCyber(1);
          }
        }catch{}
      };
      fr.readAsText(file);
      input.value='';
    });
  }
  loadCyberData().then(()=> renderCyber(1));
}
// Expose for dev toolbar button
window.importCyberFromGitHubTopics = importCyberFromGitHubTopics;
// ==== /Cyber section ====



// Favorites, compare selection, and sharing
const favSet = new Set(JSON.parse(localStorage.getItem('favs')||'[]'));
let compareSel = [];

function createLangCard(item){
  const card = document.createElement('article');
  card.className = 'card lang-card';
  const fav = favSet.has(item.name);
  const selected = compareSel.includes(item.name);
  card.innerHTML = `
    <div class="badge" style="border-color:${item.color}33;color:${item.color}">
      <span class="dot" style="background:${item.color}"></span>
      ${item.domain.join(' / ')}
    </div>
    <h3>${item.name}</h3>
    <p>${item.use}</p>
    <div class="tags">${item.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    <div class="meta">
      <span>المستوى: ${item.level}</span>
      <span class="dot"></span>
      <span>تصاميم/أطر: ${item.designs.join(', ')}</span>
    </div>
    <div class="tools" style="margin-top:.5rem">
      <button class="btn ghost fav" aria-pressed="${fav}">${fav?'★ مفضلة':'☆ إضافة للمفضلة'}</button>
      <button class="btn select" aria-pressed="${selected}">${selected?'✓ مختارة':'+ للمقارنة'}</button>
      <button class="btn code">عرض مثال كود</button>
      <button class="btn ghost details">تفاصيل</button>
    </div>
  `;
  card.querySelector('.fav').addEventListener('click', ()=>{
    if(favSet.has(item.name)) favSet.delete(item.name); else favSet.add(item.name);
    localStorage.setItem('favs', JSON.stringify([...favSet]));
    render();
    toast(`${favSet.has(item.name)?'أضيفت':'أزيلت'} "${item.name}" للمفضلة`);
  });
  card.querySelector('.select').addEventListener('click', ()=>{
    if(compareSel.includes(item.name)) compareSel = compareSel.filter(n=>n!==item.name);
    else if(compareSel.length<2) compareSel.push(item.name);
    updateCompareDock();
    render();
  });
  card.querySelector('.code').addEventListener('click', ()=> openCodeModal(item));
  card.querySelector('.details').addEventListener('click', ()=> openDetails(item));
  return card;
}

function renderCards(list){
  const grid = document.getElementById('cards');
  grid.innerHTML = '';
  list.forEach(item=> grid.appendChild(createLangCard(item)));
}

function sortList(list, key){
  const copy = [...list];
  if(key==='name') copy.sort((a,b)=> a.name.localeCompare(b.name,'ar'));
  else if(key==='level') copy.sort((a,b)=> a.level.localeCompare(b.level,'ar'));
  else if(key==='domain') copy.sort((a,b)=> (a.domain[0]||'').localeCompare(b.domain[0]||'', 'ar'));
  return copy;
}

function applyFilters(){
  const q = document.getElementById('search');
  const domain = document.getElementById('domainFilter');
  const sortSel = document.getElementById('sortSelect');
  const favOnly = document.getElementById('favOnly');
  const term = (q.value || '').toLowerCase();
  const d = domain.value;
  let filtered = LANGS.filter(l=>{
    const matchQ = !term || l.name.toLowerCase().includes(term) || l.use.toLowerCase().includes(term);
    const matchD = d==='all' || l.domain.includes(d);
    const matchF = !favOnly.checked || favSet.has(l.name);
    return matchQ && matchD && matchF;
  });
  filtered = sortList(filtered, sortSel.value);
  renderCards(filtered);
  // update count badge
  const badge = document.getElementById('langCountBadge');
  if(badge) badge.innerHTML = `<span class="dot"></span>${filtered.length} نتائج`;

  // update domain stats
  const domains = {};
  filtered.forEach(l=> l.domain.forEach(d=> domains[d]=(domains[d]||0)+1));
  const stats = document.getElementById('domainStats');
  if(stats){ stats.textContent = `ويب: ${domains.web||0} · هاتف: ${domains.mobile||0} · بيانات/ذكاء: ${domains.data||0} · أنظمة: ${domains.systems||0} · سكربتات: ${domains.scripting||0}`; }
}


function updateDatalist(){
  const dl = document.getElementById('langList');
  if(dl){ dl.innerHTML = LANGS.map(l=>`<option value="${l.name}">`).join(''); }
}

function setupFilters(){

  const q = document.getElementById('search');
  const domain = document.getElementById('domainFilter');
  const sortSel = document.getElementById('sortSelect');
  const favOnly = document.getElementById('favOnly');

  updateDatalist();
  q.addEventListener('input', applyFilters);

  domain.addEventListener('change', applyFilters);
  sortSel.addEventListener('change', applyFilters);
  favOnly.addEventListener('change', applyFilters);
  document.getElementById('resetFilters')?.addEventListener('click', ()=>{
    q.value = '';
    domain.value = 'all';
    sortSel.value = 'name';
    document.getElementById('favOnly').checked = false;
    applyFilters();
  });
  document.getElementById('importFavs')?.addEventListener('click', ()=> document.getElementById('importFavsInput').click());
  document.getElementById('importFavsInput')?.addEventListener('change', async (e)=>{
    const file = e.target.files[0]; if(!file) return;
    const text = await file.text();
    try{
      const arr = JSON.parse(text);
      if(Array.isArray(arr)){
        favSet.clear(); arr.forEach(n=> favSet.add(n));
        localStorage.setItem('favs', JSON.stringify([...favSet]));
        toast('تم استيراد المفضلة');
        applyFilters();
      }
    }catch{ toast('ملف غير صالح'); }
  });
  document.getElementById('exportCsv')?.addEventListener('click', ()=>{
    const gridItems = [...document.querySelectorAll('#cards .lang-card')];
    const names = gridItems.map(el=> el.querySelector('h3')?.textContent || '');
    const rows = ['name'];
    names.forEach(n=> rows.push(`"${n.replace(/"/g,'""')}"`));
    const csv = rows.join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'languages.csv'; a.click();
    URL.revokeObjectURL(url);
  });
  applyFilters();
}


// Compare dock controls
function updateCompareDock(){
  const dock = document.getElementById('compareDock');
  const a = document.getElementById('cmpA');
  const b = document.getElementById('cmpB');
  const open = document.getElementById('compareOpen');
  const clear = document.getElementById('compareClear');
  const now = document.getElementById('compareNow');
  if(compareSel.length){
    dock.hidden = false;
    a.textContent = compareSel[0]||'';
    b.textContent = compareSel[1]||'';
  } else {
    dock.hidden = true;
  }
  open.disabled = compareSel.length!==2;
  now.disabled = compareSel.length!==2;
  clear.onclick = ()=>{ compareSel = []; updateCompareDock(); render(); };
  open.onclick = ()=> openCompare();
  now.onclick = ()=> openCompare();
}

function openCompare(){
  if(compareSel.length!==2) return;
  const [A,B] = compareSel;
  const la = LANGS.find(l=>l.name===A);
  const lb = LANGS.find(l=>l.name===B);
  const body = document.getElementById('compareBody');
  body.innerHTML = `
    <div class="grid">
      <div class="card"><h3>${la.name}</h3><p>${la.use}</p><p><strong>المستوى:</strong> ${la.level}</p><p><strong>المجال:</strong> ${la.domain.join(', ')}</p><div class="tags">${la.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>
      <div class="card"><h3>${lb.name}</h3><p>${lb.use}</p><p><strong>المستوى:</strong> ${lb.level}</p><p><strong>المجال:</strong> ${lb.domain.join(', ')}</p><div class="tags">${lb.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>
    </div>`;
  openModal('compare');
}

// Code modal with Prism
function openCodeModal(item){
  const snippets = {
    'JavaScript': `// مثال: مصفوفة وتصفية\nconst arr = [1,2,3,4];\nconsole.log(arr.filter(n=>n%2===0));` ,
    'Python': `# مثال: قائمة وتصفية\narr = [1,2,3,4]\nprint([n for n in arr if n % 2 == 0])`,
    'TypeScript': `type User = { id:number; name:string };\nconst u:User = { id:1, name:'A' };`,
    'Java': `class Main { public static void main(String[] a){ System.out.println("Hi"); } }`,
    'Kotlin': `fun main(){ println("Hi") }`,
    'Swift': `import Foundation\nprint("Hi")`,
    'C#': `using System; class P{ static void Main(){ Console.WriteLine("Hi"); } }`,
    'C++': `#include <bits/stdc++.h>\nint main(){ std::cout<<"Hi"; }`,
    'C': `#include <stdio.h>\nint main(){ printf("Hi"); }`,
    'Go': `package main\nimport "fmt"\nfunc main(){ fmt.Println("Hi") }`,
    'Rust': `fn main(){ println!("Hi"); }`,
    'PHP': `<?php echo "Hi"; ?>`
  };
  const langMap = { 'C#':'csharp', 'C++':'cpp' };
  const code = snippets[item.name] || '// لا يوجد مثال';
  const detected = (item.name.toLowerCase());
  const body = document.getElementById('modalBody');
  body.innerHTML = `<pre><code class="language-${langMap[item.name]||detected}">${code.replace(/</g,'&lt;')}</code></pre>`;
  document.getElementById('modalTitle').textContent = `مثال كود: ${item.name}`;
  openModal('modal');
  // highlight
  if(window.Prism){
    if(Prism.plugins && Prism.plugins.autoloader){
      Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
    }
    Prism.highlightAllUnder(body);
  }
}

function openDetails(item){
  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <p><strong>المجال:</strong> ${item.domain.join(', ')}</p>
    <p><strong>المستوى:</strong> ${item.level}</p>
    <p><strong>الاستخدام:</strong> ${item.use}</p>
    <p><strong>تصاميم/أطر:</strong> ${item.designs.join(', ')}</p>
  `;
  document.getElementById('modalTitle').textContent = item.name;
  openModal('modal');
}

// Generic modals
function openModal(which){
  const id = which==='compare' ? 'compareModal' : which==='help' ? 'helpModal' : 'modal';
  document.getElementById(id).hidden = false;
  playOpen();
}
function closeModal(which){
  const id = which==='compare' ? 'compareModal' : which==='help' ? 'helpModal' : 'modal';
  document.getElementById(id).hidden = true;
}

document.addEventListener('click', (e)=>{
  const close = e.target.dataset.close;
  if(close) closeModal(close);
});

// Sharing
const shareBtn = document.getElementById('shareBtn');
if(shareBtn){
  shareBtn.addEventListener('click', async ()=>{
    const url = new URL(location.href);
    url.hash = '#languages';
    if(navigator.share){ await navigator.share({ title: document.title, url: url.toString() }); }
    else { await navigator.clipboard.writeText(url.toString()); toast('تم نسخ رابط المشاركة'); }
  });
}

// Copy security checklist
document.getElementById('copySecurity')?.addEventListener('click', async ()=>{
  const items = [...document.querySelectorAll('#security li')].map(li=>`- ${li.textContent.trim()}`).join('\n');
  await navigator.clipboard.writeText(`قائمة فحص أمن سريعة:\n${items}`);
  toast('تم نسخ قائمة الفحص');
});

// Help and shortcuts
const helpBtn = document.getElementById('helpBtn');
helpBtn?.addEventListener('click', ()=> openModal('help'));

// Add language dynamically
const addLangBtn = document.getElementById('addLangBtn');
addLangBtn?.addEventListener('click', ()=>{
  const name = prompt('اسم اللغة:');
  if(!name) return;
  const domainStr = prompt('المجالات (مفصولة بفواصل: web,mobile,data,systems,scripting):','web');
  const level = prompt('المستوى (سهل/متوسط/متقدم):','متوسط') || 'متوسط';
  const use = prompt('الاستخدام باختصار:','شرح مختصر');
  const designs = prompt('الأطر/التصاميم (مفصولة بفواصل):','')||'';
  const color = prompt('اللون (hex):','#7c3aed')||'#7c3aed';
  const tags = prompt('وسوم (مفصولة بفواصل):','Web')||'Web';
  const lang = {
    name: name.trim(),
    domain: (domainStr||'').split(',').map(s=>s.trim()).filter(Boolean),
    level: level.trim(),
    use: (use||'').trim(),
    designs: (designs||'').split(',').map(s=>s.trim()).filter(Boolean),
    tags: (tags||'').split(',').map(s=>s.trim()).filter(Boolean),
    color
  };
  LANGS.push(lang);
  updateDatalist();
  render();
  toast('تمت إضافة اللغة');
});

// Export favorites
const exportFavs = document.getElementById('exportFavs');
exportFavs?.addEventListener('click', ()=>{
  const data = JSON.stringify([...favSet], null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'favorites.json'; a.click();
  URL.revokeObjectURL(url);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e)=>{
  if(e.key === '/'){
    const q = document.getElementById('search');
    q.focus(); q.select(); e.preventDefault();
  } else if(e.key.toLowerCase()==='t'){
    themeToggle?.click();
  } else if(e.key.toLowerCase()==='g'){
    document.getElementById('languages').scrollIntoView({behavior:'smooth'});
  } else if(e.key==='?'){
    openModal('help');
  }
});

// Scroll to top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', ()=>{
  toTop.hidden = window.scrollY < 300;
});
toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

// Toasts
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.hidden = false;
  setTimeout(()=> t.hidden = true, 2000);
}

// Theme color playground
function applyThemeColors(cols){
  if(cols.primary) root.style.setProperty('--primary', cols.primary);
  if(cols.accent) root.style.setProperty('--accent', cols.accent);
  if(cols.bg) root.style.setProperty('--bg', cols.bg);
}
function loadSavedTheme(){
  try{
    const saved = JSON.parse(localStorage.getItem('theme_colors')||'{}');
    if(saved && Object.keys(saved).length){ applyThemeColors(saved); }
    const pc = document.getElementById('primaryColor');
    const ac = document.getElementById('accentColor');
    const bc = document.getElementById('bgColor');
    if(pc && saved.primary) pc.value = saved.primary;
    if(ac && saved.accent) ac.value = saved.accent;
    if(bc && saved.bg) bc.value = saved.bg;
  }catch{ /* ignore */ }
}
function setupThemePlayground(){
  const pc = document.getElementById('primaryColor');
  const ac = document.getElementById('accentColor');
  const bc = document.getElementById('bgColor');
  const save = document.getElementById('saveTheme');
  const reset = document.getElementById('resetTheme');
  const exp = document.getElementById('exportTheme');
  const preview = ()=> applyThemeColors({primary: pc?.value, accent: ac?.value, bg: bc?.value});
  pc?.addEventListener('input', preview);
  ac?.addEventListener('input', preview);
  bc?.addEventListener('input', preview);
  save?.addEventListener('click', ()=>{
    const data = {primary: pc?.value, accent: ac?.value, bg: bc?.value};
    localStorage.setItem('theme_colors', JSON.stringify(data));
    toast('تم حفظ الألوان');
  });
  reset?.addEventListener('click', ()=>{
    localStorage.removeItem('theme_colors');
    root.style.removeProperty('--primary');
    root.style.removeProperty('--accent');
    root.style.removeProperty('--bg');
    toast('تمت إعادة الألوان الافتراضية');
  });
  exp?.addEventListener('click', ()=>{
    const css = `:root{\n  --primary:${pc?.value};\n  --accent:${ac?.value};\n  --bg:${bc?.value};\n}`;
    const blob = new Blob([css], {type:'text/css'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
  a.href = url; a.download = 'theme.css'; a.click();
  URL.revokeObjectURL(url);
});
}

// PWA install prompt + SW update toast
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); deferredPrompt = e; document.getElementById('installBtn').hidden = false; });

document.getElementById('installBtn')?.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  toast(outcome==='accepted' ? 'تم التثبيت' : 'أُلغي');
});

// Register SW and show update available toast
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').then(reg=>{
      if(reg.waiting){ showUpdateToast(reg); }
      reg.addEventListener('updatefound', ()=>{
        const sw = reg.installing;
        if(sw){ sw.addEventListener('statechange', ()=>{ if(sw.state==='installed' && navigator.serviceWorker.controller){ showUpdateToast(reg); } }); }
      });
      navigator.serviceWorker.addEventListener('controllerchange', ()=> location.reload());
      navigator.serviceWorker.addEventListener('message', (e)=>{
        if(e.data && e.data.type==='NEW_VERSION'){ showUpdateToast(reg); }
      });
    });
  });
}

// Manual update + cache clear for phones
const updateBtn = document.getElementById('updateBtn');
if(updateBtn){
  updateBtn.addEventListener('click', async ()=>{
    try{
      // tell SW to clear caches
      if(navigator.serviceWorker?.controller){
        navigator.serviceWorker.controller.postMessage({type:'CLEAR_ALL_CACHES'});
      }
    }catch{}
    // bust local cache by reloading with version stamp
    const u = new URL(location.href);
    u.searchParams.set('v', Date.now().toString());
    location.replace(u.toString());
  });
}

function showUpdateToast(reg){
  const t = document.getElementById('toast');
  t.innerHTML = 'إصدار جديد متاح. <button class="btn primary" id="swReload">تحديث</button>';
  t.hidden = false;
  document.getElementById('swReload').onclick = ()=>{
    reg.waiting?.postMessage({type:'SKIP_WAITING'});
  };
}

// Year
function setYear(){
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
}

function render(){ applyFilters(); updateCompareDock(); }

window.addEventListener('DOMContentLoaded', ()=>{
  animateCounters();
  setupFilters();
  updateCompareDock();
  loadSavedTheme();
  setupThemePlayground();
  setupCyber();
  setYear();
});
