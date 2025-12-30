(function(global){
  const DB_NAME = "hm_crud_lite_db";
  const DB_VERSION = 1;
  const STORE = "records";

  function openDB(){
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE)){
          const store = db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
          store.createIndex("createdAt", "createdAt", { unique: false });
          store.createIndex("status", "status", { unique: false });
          store.createIndex("category", "category", { unique: false });
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function tx(db, mode){
    return db.transaction([STORE], mode).objectStore(STORE);
  }

  async function getAll(){
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = tx(db, "readonly");
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function getById(id){
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = tx(db, "readonly");
      const req = store.get(Number(id));
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function add(record){
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = tx(db, "readwrite");
      const req = store.add(record);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function update(record){
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = tx(db, "readwrite");
      const req = store.put(record);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function remove(id){
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = tx(db, "readwrite");
      const req = store.delete(Number(id));
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async function seedIfEmpty(){
    const all = await getAll();
    if (all.length > 0) return;

    const now = () => new Date().toISOString();
    const samples = [
      {
        title: "Onboarding — New Leads List",
        description: "Seed record to show table & view page. You can delete it.",
        category: "Sales",
        status: "Open",
        owner: "Admin",
        priority: "High",
        createdAt: now(),
        updatedAt: now()
      },
      {
        title: "UI Polish — Navbar & Buttons",
        description: "Demonstrates Material Design styling and transitions.",
        category: "Frontend",
        status: "In Progress",
        owner: "Designer",
        priority: "Medium",
        createdAt: now(),
        updatedAt: now()
      },
      {
        title: "IndexedDB — Persistence Check",
        description: "Data persists across refresh. Clear site data to reset.",
        category: "Engineering",
        status: "Done",
        owner: "Developer",
        priority: "Low",
        createdAt: now(),
        updatedAt: now()
      }
    ];

    for (const r of samples){
      await add(r);
    }
  }

  global.HM_DB = { openDB, getAll, getById, add, update, remove, seedIfEmpty };
})(window);
