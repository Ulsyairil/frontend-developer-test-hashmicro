(function (global) {
    const { ref, computed, onMounted } = global.Vue;
    const { badgeClass } = global.HM_ViewUtils;

    global.Views.RecordsList = {
        name: "RecordsList",
        setup() {
            const store = global.useRecordsStore();
            const copying = ref(false);

            const records = computed(() => store.filteredRecords);
            const kpis = computed(() => store.kpis);

            const clearData = async () => {
                if (!confirm("Clear all records? This will remove everything from IndexedDB.")) return;
                for (const r of store.records) {
                    await store.removeById(r.id);
                }
                M.toast({ html: "Data cleared." });
            };

            onMounted(async () => {
                setTimeout(() => {
                    const elems = document.querySelectorAll("select");
                    M.FormSelect.init(elems);
                }, 0);
            });

            return { store, records, kpis, badgeClass, copying, clearData };
        },
        template: `
      <div class="hm-card">
        <div class="hm-card-header">
          <div>
            <h5 class="hm-title">Records</h5>
          </div>
          <div class="hm-flex">
            <a class="btn hm-btn hm-btn-accent" href="/create">
              <i class="material-icons left">add</i>Create
            </a>
          </div>
        </div>

        <div class="hm-card-content">

          <div class="hm-kpi">
            <div class="hm-kpi-card">
              <div class="label">Total</div>
              <div class="value">{{ kpis.total }}</div>
            </div>
            <div class="hm-kpi-card">
              <div class="label">Open</div>
              <div class="value">{{ kpis.open }}</div>
            </div>
            <div class="hm-kpi-card">
              <div class="label">In Progress</div>
              <div class="value">{{ kpis.prog }}</div>
            </div>
            <div class="hm-kpi-card">
              <div class="label">Done</div>
              <div class="value">{{ kpis.done }}</div>
            </div>
          </div>

          <div class="row" style="margin-top:14px;">
            <div class="col s12 m6">
              <div class="input-field">
                <i class="material-icons prefix">search</i>
                <input id="filter" type="text" v-model="store.filterText" placeholder="Search title, owner, status, etc." />
                <label for="filter" class="active">Search</label>
              </div>
            </div>
            <div class="col s12 m3">
              <div class="input-field">
                <i class="material-icons prefix">sort</i>
                <select v-model="store.sortKey">
                  <option value="updatedAtDesc" selected>Updated (newest)</option>
                  <option value="updatedAtAsc">Updated (oldest)</option>
                  <option value="createdAtDesc">Created (newest)</option>
                  <option value="createdAtAsc">Created (oldest)</option>
                  <option value="titleAsc">Title (A–Z)</option>
                </select>
                <label>Sort</label>
              </div>
            </div>
            <div class="col s12 m3 right-align">
              <div style="margin-top:16px;">
                <a href="/" class="btn-flat hm-muted" @click.prevent="store.toggleDense()">
                  <i class="material-icons left">table_rows</i>{{ store.denseTable ? "Normal spacing" : "Dense table" }}
                </a>
              </div>
            </div>
          </div>

          <div v-if="store.loading">
            <div class="hm-skel" style="height:18px;width:55%;margin:12px 0;"></div>
            <div class="hm-skel" style="height:220px;width:100%;margin:12px 0;"></div>
          </div>

          <div v-else>
            <table class="highlight responsive-table hm-table" :class="{dense: store.denseTable}">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th class="center">Status</th>
                  <th>Owner</th>
                  <th>Updated</th>
                  <th class="center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in records" :key="r.id" class="hm-row">
                  <td>
                    <a :href="'/view/' + r.id" class="hm-row-link">
                      <strong>{{ r.title }}</strong>
                      <div class="hm-muted" style="font-size:.85rem; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:520px;">
                        {{ r.description }}
                      </div>
                    </a>
                  </td>
                  <td>{{ r.category }}</td>
                  <td class="center"><span class="chip" :class="badgeClass(r.status)">{{ r.status }}</span></td>
                  <td>{{ r.owner }}</td>
                  <td class="hm-muted">{{ new Date(r.updatedAt).toLocaleString() }}</td>
                  <td class="right-align" style="white-space:nowrap;">
                    <a class="btn-small hm-btn hm-btn-navy mr-2" :href="'/view/' + r.id" title="View">
                      <i class="material-icons">visibility</i>
                    </a>
                    <a class="btn-small hm-btn hm-btn-accent mr-2" :href="'/edit/' + r.id" title="Edit">
                      <i class="material-icons">edit</i>
                    </a>
                    <a class="btn-small hm-btn hm-btn-primary" href="/" title="Delete" @click.prevent="store.removeById(r.id).then(()=>M.toast({html:'Deleted.'}))">
                      <i class="material-icons">delete</i>
                    </a>
                  </td>
                </tr>
                <tr v-if="records.length === 0">
                  <td colspan="6" class="center-align hm-muted" style="padding:26px 0;">
                    No records match your search. <a href="/create">Create one</a>.
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="divider" style="margin:18px 0;"></div>

            <div class="hm-flex">
              <span class="hm-spacer"></span>
              <a class="btn-flat red-text text-darken-2" href="/" @click.prevent="clearData()">
                <i class="material-icons left">delete_sweep</i>Clear data
              </a>
            </div>

          </div>
        </div>
      </div>
    `
    };
})(window);