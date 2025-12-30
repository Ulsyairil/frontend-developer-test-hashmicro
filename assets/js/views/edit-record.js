(function (global) {
    const { ref, onMounted } = global.Vue;

    global.Views.EditRecord = {
        name: "EditRecord",
        props: ["id"],
        setup(props) {
            const store = global.useRecordsStore();
            const loading = ref(true);
            const saving = ref(false);

            const form = ref({
                title: "",
                description: "",
                category: "Sales",
                status: "Open",
                owner: "Admin",
                priority: "Medium"
            });

            const load = async () => {
                loading.value = true;
                const rec = await store.getById(props.id);
                if (rec) {
                    form.value = {
                        title: rec.title || "",
                        description: rec.description || "",
                        category: rec.category || "Sales",
                        status: rec.status || "Open",
                        owner: rec.owner || "Admin",
                        priority: rec.priority || "Medium"
                    };
                }
                loading.value = false;

                setTimeout(() => {
                    M.updateTextFields();
                    const selects = document.querySelectorAll("select");
                    M.FormSelect.init(selects);
                }, 0);
            };

            const submit = async () => {
                if (!form.value.title.trim()) {
                    M.toast({ html: "Title is required." });
                    return;
                }
                saving.value = true;
                try {
                    await store.updateById(props.id, { ...form.value });
                    M.toast({ html: "Updated." });
                    window.HM_Navigate(`/view/${props.id}`);
                } catch (e) {
                    M.toast({ html: "Failed to update." });
                } finally {
                    saving.value = false;
                }
            };

            onMounted(load);

            return { loading, saving, form, submit };
        },
        template: `
      <div class="hm-card">
        <div class="hm-card-header">
          <div>
            <h5 class="hm-title">Edit Record</h5>
          </div>
          <div class="hm-flex">
            <a class="btn hm-btn hm-btn-navy" :href="'/view/' + id">
              <i class="material-icons left">arrow_back</i>Cancel
            </a>
            <a class="btn hm-btn hm-btn-accent" href="/" @click.prevent="submit()">
              <i class="material-icons left">save</i>{{ saving ? "Saving..." : "Save" }}
            </a>
          </div>
        </div>

        <div class="hm-card-content">
          <div v-if="loading">
            <div class="hm-skel" style="height:220px;width:100%;margin:12px 0;"></div>
          </div>
          <div v-else>
            <div class="row">
              <div class="col s12 m7">
                <div class="input-field">
                  <i class="material-icons prefix">title</i>
                  <input id="title_edit" type="text" v-model="form.title" maxlength="80" />
                  <label for="title_edit" class="active">Title</label>
                </div>

                <div class="input-field">
                  <i class="material-icons prefix">notes</i>
                  <textarea id="desc_edit" class="materialize-textarea" v-model="form.description" maxlength="400"></textarea>
                  <label for="desc_edit" class="active">Description</label>
                </div>
              </div>

              <div class="col s12 m5">
                <div class="input-field">
                  <i class="material-icons prefix">category</i>
                  <select v-model="form.category">
                    <option>Sales</option>
                    <option>Frontend</option>
                    <option>Engineering</option>
                    <option>Operations</option>
                  </select>
                  <label>Category</label>
                </div>

                <div class="input-field">
                  <i class="material-icons prefix">flag</i>
                  <select v-model="form.priority">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <label>Priority</label>
                </div>

                <div class="input-field">
                  <i class="material-icons prefix">assignment_turned_in</i>
                  <select v-model="form.status">
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                  <label>Status</label>
                </div>

                <div class="input-field">
                  <i class="material-icons prefix">person</i>
                  <input id="owner_edit" type="text" v-model="form.owner" maxlength="40" />
                  <label for="owner_edit" class="active">Owner</label>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `
    };
})(window);