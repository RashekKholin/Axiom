const AXIOM_DB = "AxiomDatabase";
const DB_VERSION = 1;

const STORES = {
  subjects: "subjects",
  topics: "topics",
  materials: "materials",
  sessions: "sessions",
  settings: "settings"
};

function id() {
  return crypto.randomUUID ? crypto.randomUUID() :
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(AXIOM_DB, DB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORES.subjects)) {
        const s = db.createObjectStore(STORES.subjects, {keyPath:"id"});
        s.createIndex("name","name",{unique:false});
      }
      if (!db.objectStoreNames.contains(STORES.topics)) {
        const s = db.createObjectStore(STORES.topics, {keyPath:"id"});
        s.createIndex("subjectId","subjectId",{unique:false});
      }
      if (!db.objectStoreNames.contains(STORES.materials)) {
        const s = db.createObjectStore(STORES.materials, {keyPath:"id"});
        s.createIndex("subjectId","subjectId",{unique:false});
        s.createIndex("topicId","topicId",{unique:false});
        s.createIndex("type","type",{unique:false});
        s.createIndex("nextReview","nextReview",{unique:false});
      }
      if (!db.objectStoreNames.contains(STORES.sessions)) {
        const s = db.createObjectStore(STORES.sessions, {keyPath:"id"});
        s.createIndex("materialId","materialId",{unique:false});
        s.createIndex("date","date",{unique:false});
      }
      if (!db.objectStoreNames.contains(STORES.settings)) {
        db.createObjectStore(STORES.settings,{keyPath:"key"});
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbPut(storeName, value) {
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(storeName,"readwrite");
    tx.objectStore(storeName).put(value);
    tx.oncomplete=()=>resolve(value);
    tx.onerror=()=>reject(tx.error);
  });
}

async function dbAdd(storeName, value) {
  if (!value.id) value.id=id();
  return dbPut(storeName,value);
}

async function dbGet(storeName,key) {
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const req=db.transaction(storeName).objectStore(storeName).get(key);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}

async function dbAll(storeName) {
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const req=db.transaction(storeName).objectStore(storeName).getAll();
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}

async function dbDelete(storeName,key) {
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(storeName,"readwrite");
    tx.objectStore(storeName).delete(key);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
  });
}

async function dbClear(storeName) {
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(storeName,"readwrite");
    tx.objectStore(storeName).clear();
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
  });
}

async function findOrCreateSubject(name) {
  const subjects=await dbAll(STORES.subjects);
  const found=subjects.find(s=>s.name.trim().toLowerCase()===name.trim().toLowerCase());
  if(found) return found;
  return dbAdd(STORES.subjects,{name:name.trim(),createdAt:new Date().toISOString()});
}

async function findOrCreateTopic(subjectId,name) {
  const topics=await dbAll(STORES.topics);
  const found=topics.find(t=>t.subjectId===subjectId && t.name.trim().toLowerCase()===name.trim().toLowerCase());
  if(found) return found;
  return dbAdd(STORES.topics,{subjectId,name:name.trim(),createdAt:new Date().toISOString()});
}
