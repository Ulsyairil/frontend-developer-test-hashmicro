(function () {
  $(document).ready(function () {
    $(".sidenav").sidenav();

    function startProgress() {
      $("#topProgress").css("width", "25%");
      setTimeout(() => $("#topProgress").css("width", "65%"), 120);
      setTimeout(() => $("#topProgress").css("width", "100%"), 220);
      setTimeout(() => $("#topProgress").css("width", "0%"), 420);
    }

    startProgress();

    $(window).on("popstate", startProgress);

    $(document).on("mouseenter", ".hm-row", function () {
      $(this).addClass("z-depth-1");
    });

    $(document).on("mouseleave", ".hm-row", function () {
      $(this).removeClass("z-depth-1");
    });

    $("#toggleDense").on("click", function (e) {
      e.preventDefault();

      window.dispatchEvent(new CustomEvent("hm:toggleDense"));

      M.toast({ html: "Toggled table density." });

      const inst = M.Sidenav.getInstance(document.getElementById("hm-sidenav"));
      if (inst) inst.close();
    });

    $("#yearNow").text(new Date().getFullYear());
  });
})();
