(function (global) {
  const { ref, onMounted } = global.Vue;

  global.Views.CreateRecord = {
    name: "CreateRecord",
    setup() {
      const store = global.useRecordsStore();
      const saving = ref(false);

      const form = ref({
        title: "",
        description: "",
        category: "Sales",
        status: "Open",
        owner: "Admin",
        priority: "Medium"
      });

      const submit = async () => {
        if (!form.value.title.trim()) {
          M.toast({ html: "Title is required." });
          return;
        }
        saving.value = true;
        try {
          const id = await store.create({ ...form.value });
          M.toast({ html: "Saved to IndexedDB." });
          window.HM_Navigate(`/view/${id}`);
        } catch (e) {
          M.toast({ html: "Failed to save." });
        } finally {
          saving.value = false;
        }
      };

      onMounted(() => {
        setTimeout(() => {
          M.updateTextFields();
          const selects = document.querySelectorAll("select");
          M.FormSelect.init(selects);
        }, 0);
      });

      return { form, submit, saving };
    },
    template: `
      <div class="hm-card">
        <div class="hm-card-header">
          <div>
            <h5 class="hm-title">Create Record</h5>
          </div>
          <div class="hm-flex">
            <a class="btn hm-btn hm-btn-navy" href="/">
              <i class="material-icons left">arrow_back</i>Back
            </a>
            <a class="btn hm-btn hm-btn-accent" href="/" @click.prevent="submit()">
              <i class="material-icons left">save</i>{{ saving ? "Saving..." : "Save" }}
            </a>
          </div>
        </div>

        <div class="hm-card-content">
          <div class="row">
            <div class="col s12 m7">
              <div class="input-field">
                <i class="material-icons prefix">title</i>
                <input id="title" type="text" v-model="form.title" maxlength="80" />
                <label for="title">Title</label>
              </div>

              <div class="input-field">
                <i class="material-icons prefix">notes</i>
                <textarea id="desc" class="materialize-textarea" v-model="form.description" maxlength="400"></textarea>
                <label for="desc">Description</label>
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
                  <option selected>Medium</option>
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
                <input id="owner" type="text" v-model="form.owner" maxlength="40" />
                <label for="owner">Owner</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  };
})(window);