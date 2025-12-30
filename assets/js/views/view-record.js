(function (global) {
    const { ref, onMounted } = global.Vue;
    const { badgeClass } = global.HM_ViewUtils;

    global.Views.ViewRecord = {
        name: "ViewRecord",
        props: ["id"],
        setup(props) {
            const store = global.useRecordsStore();
            const rec = ref(null);
            const loading = ref(true);

            const load = async () => {
                loading.value = true;
                rec.value = await store.getById(props.id);
                loading.value = false;
            };

            const del = async () => {
                if (!rec.value) return;
                if (!confirm("Delete this record?")) return;
                await store.removeById(rec.value.id);
                M.toast({ html: "Deleted." });
                window.HM_Navigate(`/`);
            };

            onMounted(load);

            return { rec, loading, badgeClass, del };
        },
        template: `
      <div class="hm-card">
        <div class="hm-card-header">
          <div>
            <h5 class="hm-title">View Record</h5>
          </div>
          <div class="hm-flex">
            <a class="btn hm-btn hm-btn-navy" href="/">
              <i class="material-icons left">arrow_back</i>Back
            </a>
            <a class="btn hm-btn hm-btn-accent" :href="'/edit/' + id">
              <i class="material-icons left">edit</i>Edit
            </a>
            <a class="btn hm-btn hm-btn-primary" href="/" @click.prevent="del()">
              <i class="material-icons left">delete</i>Delete
            </a>
          </div>
        </div>

        <div class="hm-card-content">
          <div v-if="loading">
            <div class="hm-skel" style="height:26px;width:60%;margin:10px 0;"></div>
            <div class="hm-skel" style="height:18px;width:85%;margin:10px 0;"></div>
            <div class="hm-skel" style="height:160px;width:100%;margin:12px 0;"></div>
          </div>

          <div v-else-if="!rec" class="center-align hm-muted" style="padding:28px 0;">
            Record not found. <a href="/">Back to list</a>.
          </div>

          <div v-else>
            <h5 style="margin-top:0;">{{ rec.title }}</h5>
            <div class="hm-flex" style="flex-wrap:wrap; gap:8px; margin:10px 0 16px;">
              <span class="chip hm-chip" :class="badgeClass(rec.status)"><i class="material-icons left">flag</i>{{ rec.status }}</span>
              <span class="chip hm-chip"><i class="material-icons left">category</i>{{ rec.category }}</span>
              <span class="chip hm-chip"><i class="material-icons left">priority_high</i>{{ rec.priority }}</span>
              <span class="chip hm-chip"><i class="material-icons left">person</i>{{ rec.owner }}</span>
            </div>

            <p style="white-space:pre-wrap;">{{ rec.description }}</p>

            <div class="divider" style="margin:18px 0;"></div>

            <div class="row" style="margin-bottom:0;">
              <div class="col s12 m6">
                <div class="hm-muted"><strong>Created:</strong> {{ new Date(rec.createdAt).toLocaleString() }}</div>
              </div>
              <div class="col s12 m6">
                <div class="hm-muted"><strong>Updated:</strong> {{ new Date(rec.updatedAt).toLocaleString() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    };
})(window);