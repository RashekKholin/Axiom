const Axiom = {
  screen: "home",
  materials: [],
  subjects: [],
  topics: [],

  async init() {
    await this.refreshData();
    this.render();
    window.addEventListener("popstate",()=>this.render());
  },

  async refreshData() {
    this.materials=await dbAll(STORES.materials);
    this.subjects=await dbAll(STORES.subjects);
    this.topics=await dbAll(STORES.topics);
  },

  setScreen(screen) {
    this.screen=screen;
    this.render();
  },

  async render() {
    await this.refreshData();
    const app=document.getElementById("app");
    app.innerHTML=`
      <div class="shell">
        <main>${this.view()}</main>
        ${this.nav()}
      </div>`;
    this.bind();
  },

  nav() {
    const items=[["home","⌂","Home"],["study","▶","Study"],["add","＋","Add"],["progress","◔","Progress"],["settings","⚙","Settings"]];
    return `<nav class="bottom-nav">${items.map(([s,i,l])=>`
      <button class="nav-button ${this.screen===s?"active":""}" data-screen="${s}">
        <span>${i}</span><small>${l}</small>
      </button>`).join("")}</nav>`;
  },

  view() {
    if(this.screen==="add") return this.addView();
    if(this.screen==="study") return this.studyView();
    if(this.screen==="progress") return this.progressView();
    if(this.screen==="settings") return this.settingsView();
    return this.homeView();
  },

  homeView() {
    const due=this.dueMaterials().length;
    const recent=this.materials.slice(-3).reverse();
    return `<section>
      <div class="hero"><p class="eyebrow">AXIOM</p><h1>What should you study?</h1>
      <p class="muted">${due ? `${due} review${due===1?"":"s"} due.` : "You're caught up."}</p></div>
      <button class="primary big" data-action="study">${due?"Study Now":"Start Studying"}</button>
      <div class="section-title">Quick Actions</div>
      <div class="grid-actions">
        <button class="card action" data-action="study"><b>Flashcards</b><span>Review what you've learned</span></button>
        <button class="card action" data-action="study"><b>Practice</b><span>Test your knowledge</span></button>
        <button class="card action" data-action="add"><b>Add Material</b><span>Build your study library</span></button>
        <button class="card action" data-action="progress"><b>Progress</b><span>See your performance</span></button>
      </div>
      <div class="section-title">Recent Material</div>
      ${recent.length ? recent.map(m=>this.materialCard(m)).join("") : `<div class="empty card"><b>Your library is empty.</b><span>Add your first flashcard to begin.</span></div>`}
    </section>`;
  },

  materialCard(m) {
    const subject=this.subjects.find(s=>s.id===m.subjectId)?.name||"Unknown";
    const topic=this.topics.find(t=>t.id===m.topicId)?.name||"";
    return `<div class="material card"><div><span class="pill">${m.type}</span><h3>${esc(m.front)}</h3><span class="muted">${esc(subject)}${topic?" · "+esc(topic):""}</span></div><button class="icon danger" data-delete="${m.id}">×</button></div>`;
  },

  addView() {
    return `<section><div class="top"><div><p class="eyebrow">CREATE</p><h1>Add Material</h1></div></div>
      <form id="material-form" class="form">
        <label>Material Type<select id="type"><option value="flashcard">Flashcard</option><option value="question">Practice Question</option><option value="note">Note</option><option value="formula">Formula</option></select></label>
        <label>Subject<input id="subject" required placeholder="e.g. Biology"></label>
        <label>Topic<input id="topic" required placeholder="e.g. Cell Biology"></label>
        <div class="two"><label>Difficulty<select id="difficulty"><option value="1">1 — Easy</option><option value="2" selected>2 — Moderate</option><option value="3">3 — Hard</option><option value="4">4 — Very Hard</option><option value="5">5 — Expert</option></select></label>
        <label>Tags<input id="tags" placeholder="cells, metabolism"></label></div>
        <label id="front-label">Question / Front<textarea id="front" required placeholder="What do you want to remember?"></textarea></label>
        <label>Answer / Back<textarea id="back" required placeholder="Enter the answer..."></textarea></label>
        <label id="explanation-wrap">Explanation<textarea id="explanation" placeholder="Optional explanation..."></textarea></label>
        <button class="primary" type="submit">Save Material</button>
      </form>
    </section>`;
  },

  studyView() {
    const due=this.dueMaterials();
    const pool=due.length?due:this.materials;
    if(!pool.length) return `<section><p class="eyebrow">STUDY</p><h1>Study</h1><div class="empty card"><b>Nothing to study yet.</b><span>Add some material first.</span><button class="primary" data-action="add">Add Material</button></div></section>`;
    const m=pool[0];
    const subject=this.subjects.find(s=>s.id===m.subjectId)?.name||"";
    const topic=this.topics.find(t=>t.id===m.topicId)?.name||"";
    return `<section><p class="eyebrow">STUDY</p><h1>Flashcards</h1><div class="study-card card">
      <div class="study-meta">${esc(subject)}${topic?" · "+esc(topic):""} · Difficulty ${m.difficulty}</div>
      <h2>${esc(m.front)}</h2>
      <div id="answer" class="answer hidden">${esc(m.back)}</div>
      <button class="primary" id="reveal">Reveal Answer</button>
      <div id="ratings" class="ratings hidden">
        <button data-rate="again">Again</button><button data-rate="hard">Hard</button><button data-rate="good">Good</button><button data-rate="easy">Easy</button>
      </div>
    </div><p class="muted center">${pool.length} card${pool.length===1?"":"s"} in this session</p></section>`;
  },

  progressView() {
    const total=this.materials.length;
    const correct=this.materials.reduce((n,m)=>n+(m.correct||0),0);
    const attempts=this.materials.reduce((n,m)=>n+(m.correct||0)+(m.incorrect||0),0);
    const accuracy=attempts?Math.round(correct/attempts*100):0;
    const mastered=this.materials.filter(m=>(m.mastery||0)>=90).length;
    return `<section><p class="eyebrow">OVERVIEW</p><h1>Progress</h1>
      <div class="stats"><div class="stat card"><b>${total}</b><span>Materials</span></div><div class="stat card"><b>${accuracy}%</b><span>Accuracy</span></div><div class="stat card"><b>${mastered}</b><span>Mastered</span></div><div class="stat card"><b>${this.dueMaterials().length}</b><span>Due</span></div></div>
      <div class="section-title">Subjects</div>${this.subjects.length?this.subjects.map(s=>{
        const ms=this.materials.filter(m=>m.subjectId===s.id);
        const mastery=ms.length?Math.round(ms.reduce((n,m)=>n+(m.mastery||0),0)/ms.length):0;
        return `<div class="progress-row card"><div><b>${esc(s.name)}</b><span>${ms.length} materials</span></div><strong>${mastery}%</strong></div>`;
      }).join(""):`<div class="empty card">No subjects yet.</div>`}</section>`;
  },

  settingsView() {
    return `<section><p class="eyebrow">AXIOM</p><h1>Settings</h1>
      <div class="card settings"><b>Data</b><button data-action="export">Export JSON</button><button data-action="import">Import JSON</button><input id="import-file" type="file" accept=".json" hidden></div>
      <div class="card settings"><b>About</b><span>Axiom is a local-first personal study platform. Your study data stays on this device unless you export it.</span></div>
    </section>`;
  },

  dueMaterials() {
    const now=Date.now();
    return this.materials.filter(m=>!m.nextReview || new Date(m.nextReview).getTime()<=now)
      .sort((a,b)=>(a.mastery||0)-(b.mastery||0));
  },

  async bind() {
    document.querySelectorAll("[data-screen]").forEach(b=>b.onclick=()=>this.setScreen(b.dataset.screen));
    document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>{
      if(b.dataset.action==="export") return this.exportData();
      if(b.dataset.action==="import") return document.getElementById("import-file").click();
      this.setScreen(b.dataset.action);
    });
    document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=async()=>{
      if(confirm("Delete this material?")){await dbDelete(STORES.materials,b.dataset.delete);this.render();}
    });

    const form=document.getElementById("material-form");
    if(form) form.onsubmit=async e=>{
      e.preventDefault();
      const subject=await findOrCreateSubject(document.getElementById("subject").value);
      const topic=await findOrCreateTopic(subject.id,document.getElementById("topic").value);
      const type=document.getElementById("type").value;
      await dbAdd(STORES.materials,{
        subjectId:subject.id,topicId:topic.id,type,
        front:document.getElementById("front").value.trim(),
        back:document.getElementById("back").value.trim(),
        explanation:document.getElementById("explanation").value.trim(),
        difficulty:Number(document.getElementById("difficulty").value),
        tags:document.getElementById("tags").value.split(",").map(x=>x.trim()).filter(Boolean),
        createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
        correct:0,incorrect:0,timesStudied:0,mastery:0,lastStudied:null,nextReview:null,streak:0
      });
      alert("Saved to Axiom.");
      this.setScreen("add");
    };

    const reveal=document.getElementById("reveal");
    if(reveal) reveal.onclick=()=>{
      document.getElementById("answer").classList.remove("hidden");
      reveal.classList.add("hidden");
      document.getElementById("ratings").classList.remove("hidden");
    };

    document.querySelectorAll("[data-rate]").forEach(b=>b.onclick=async()=>{
      const m=this.dueMaterials()[0]||this.materials[0];
      if(!m)return;
      const rate=b.dataset.rate;
      m.timesStudied=(m.timesStudied||0)+1;
      if(rate==="again"||rate==="hard") m.incorrect=(m.incorrect||0)+1;
      else m.correct=(m.correct||0)+1;
      const attempts=(m.correct||0)+(m.incorrect||0);
      m.mastery=Math.max(0,Math.min(100,Math.round((m.correct||0)/attempts*100)));
      m.streak=rate==="easy"||rate==="good"?(m.streak||0)+1:0;
      const days={again:0,hard:1,good:3,easy:7}[rate];
      m.nextReview=new Date(Date.now()+days*86400000).toISOString();
      m.lastStudied=new Date().toISOString();
      await dbPut(STORES.materials,m);
      await dbAdd(STORES.sessions,{materialId:m.id,date:new Date().toISOString(),rating:rate});
      this.setScreen("study");
    });

    const file=document.getElementById("import-file");
    if(file) file.onchange=async()=>{
      const f=file.files[0]; if(!f)return;
      const data=JSON.parse(await f.text());
      for(const s of data.subjects||[]) await dbPut(STORES.subjects,s);
      for(const t of data.topics||[]) await dbPut(STORES.topics,t);
      for(const m of data.materials||[]) await dbPut(STORES.materials,m);
      for(const s of data.sessions||[]) await dbPut(STORES.sessions,s);
      alert("Import complete.");
      this.render();
    };
  },

  async exportData() {
    const data={
      version:1,exportedAt:new Date().toISOString(),
      subjects:await dbAll(STORES.subjects),
      topics:await dbAll(STORES.topics),
      materials:await dbAll(STORES.materials),
      sessions:await dbAll(STORES.sessions)
    };
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=`axiom-backup-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  }
};

function esc(value) {
  return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

document.addEventListener("DOMContentLoaded",()=>Axiom.init());
