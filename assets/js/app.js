(function (global) {
  const { createApp, computed, ref } = global.Vue;
  const { createPinia } = global.Pinia;

  const pinia = createPinia();

  global.HM_Navigate = function (path) {
    if (location.protocol === "file:") {
      const clean = path.startsWith("/") ? path : `/${path}`;
      location.hash = `#${clean}`;
      global.dispatchEvent(new Event("hashchange"));
      return;
    }

    history.pushState({}, "", path);
    global.dispatchEvent(new Event("popstate"));
  };


  const AppRoot = {
    template: `
      <transition name="hm-fade-slide" mode="out-in">
        <component :is="currentView" :key="routeKey"></component>
      </transition>
    `,

    setup() {
      const store = global.useRecordsStore();
      const route = ref(global.HM_Router.parsePath());

      const routeKey = computed(() => `${route.value.name}:${route.value.params?.id || ""}`);

      const currentView = computed(() => {
        const r = route.value;
        if (r.name === "create") return global.Views.CreateRecord;
        if (r.name === "about") return global.Views.About;
        if (r.name === "view") return { ...global.Views.ViewRecord, props: { id: { default: r.params.id } } };
        if (r.name === "edit") return { ...global.Views.EditRecord, props: { id: { default: r.params.id } } };
        return global.Views.RecordsList;
      });

      const onRouteChange = () => {
        route.value = global.HM_Router.parsePath();
        const el = document.getElementById("hm-sidenav");
        if (el) {
          const inst = M.Sidenav.getInstance(el);
          if (inst) inst.close();
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      global.addEventListener("popstate", onRouteChange);
      global.addEventListener("hashchange", onRouteChange);

      global.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (!a) return;

        const href = a.getAttribute("href");
        if (!href) return;

        if (a.target === "_blank" || a.hasAttribute("download")) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) return;

        if (href.startsWith("/")) {
          e.preventDefault();
          global.HM_Navigate(href);
        }
      });

      global.addEventListener("hm:toggleDense", () => store.toggleDense());

      store.loadPrefs();
      store.bootstrap();

      onRouteChange();
      return { currentView, routeKey };
    }
  };

  createApp(AppRoot).use(pinia).mount("#app");
})(window);
