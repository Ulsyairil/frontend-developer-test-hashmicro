(function (global) {
  const { defineStore } = global.Pinia;

  global.useRecordsStore = defineStore("records", {
    state: () => ({
      loading: false,
      records: [],
      filterText: "",
      sortKey: "updatedAtDesc",
      denseTable: false
    }),
    getters: {
      filteredRecords(state) {
        const q = (state.filterText || "").toLowerCase().trim();
        let list = [...state.records];

        if (q) {
          list = list.filter(r => {
            const hay = `${r.title} ${r.description} ${r.category} ${r.status} ${r.owner} ${r.priority}`.toLowerCase();
            return hay.includes(q);
          });
        }

        // Sorting
        const byDate = (a, b) => (new Date(a).getTime()) - (new Date(b).getTime());
        switch (state.sortKey) {
          case "updatedAtAsc":
            list.sort((a, b) => byDate(a.updatedAt, b.updatedAt));
            break;
          case "createdAtDesc":
            list.sort((a, b) => byDate(b.createdAt, a.createdAt));
            break;
          case "createdAtAsc":
            list.sort((a, b) => byDate(a.createdAt, b.createdAt));
            break;
          case "titleAsc":
            list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
            break;
          default: // updatedAtDesc
            list.sort((a, b) => byDate(b.updatedAt, a.updatedAt));
        }

        return list;
      },
      kpis(state) {
        const total = state.records.length;
        const open = state.records.filter(r => r.status === "Open").length;
        const prog = state.records.filter(r => r.status === "In Progress").length;
        const done = state.records.filter(r => r.status === "Done").length;
        return { total, open, prog, done };
      }
    },
    actions: {
      async bootstrap() {
        this.loading = true;
        try {
          await window.HM_DB.seedIfEmpty();
          await this.load();
        } finally {
          this.loading = false;
        }
      },
      async load() {
        this.loading = true;
        try {
          this.records = await window.HM_DB.getAll();
        } finally {
          this.loading = false;
        }
      },
      async create(payload) {
        const now = new Date().toISOString();
        const record = {
          ...payload,
          createdAt: now,
          updatedAt: now
        };
        const id = await window.HM_DB.add(record);
        await this.load();
        return id;
      },
      async updateById(id, patch) {
        const existing = await window.HM_DB.getById(id);
        if (!existing) throw new Error("Record not found");
        const updated = {
          ...existing,
          ...patch,
          id: Number(id),
          updatedAt: new Date().toISOString()
        };
        await window.HM_DB.update(updated);
        await this.load();
        return true;
      },
      async removeById(id) {
        await window.HM_DB.remove(id);
        await this.load();
      },
      async getById(id) {
        return await window.HM_DB.getById(id);
      },
      toggleDense() {
        this.denseTable = !this.denseTable;
        localStorage.setItem("hm_dense_table", this.denseTable ? "1" : "0");
      },
      loadPrefs() {
        this.denseTable = localStorage.getItem("hm_dense_table") === "1";
      }
    }
  });

})(window);
