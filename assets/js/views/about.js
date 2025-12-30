(function (global) {
    global.Views.About = {
        name: "About",
        setup() {
            const store = global.useRecordsStore();
            const clearSiteDataHint = () => {
                M.toast({ html: "Tip: Clear Site Data to reset IndexedDB + localStorage." });
            };
            return { store, clearSiteDataHint };
        },
        template: `
      <div class="hm-card">
        <div class="hm-card-header">
          <div>
            <h5 class="hm-title">About / Notes</h5>
          </div>
          <div class="hm-flex">
            <a class="btn hm-btn hm-btn-navy" href="/">
              <i class="material-icons left">arrow_back</i>Back
            </a>
          </div>
        </div>

        <div class="hm-card-content">
          <ul class="collection" style="border-radius:16px; overflow:hidden;">
            <li class="collection-item">
              <strong>Stack (no build step):</strong>
              Vue 3 CDN + Pinia CDN + Materialize CSS/JS + jQuery.
            </li>

            <li class="collection-item">
              <strong>State management:</strong>
              Pinia store <code>records</code> for filtering, sorting, and UI preferences.
            </li>

            <li class="collection-item">
              <strong>Persistence:</strong>
              IndexedDB wrapper (<code>assets/js/db.js</code>) storing data under <code>records</code>.
            </li>

            <li class="collection-item">
              <strong>Navigation:</strong>
              Uses hash anchors <code>/...</code> to satisfy “use href for every button” while still being testable.
            </li>

            <li class="collection-item">
              <strong>Material UI note:</strong>
              “Material UI” is typically React-based; this project uses <strong>Materialize</strong> (Material Design CSS/JS) via CDN to match the requirement without packages.
            </li>
            
            <li class="collection-item">
              <strong>jQuery usage:</strong>
              Cosmetic enhancements (row hover, dense toggle hook, top progress animation, sidenav init).
            </li>
          </ul>
        </div>
      </div>
    `
    };
})(window);