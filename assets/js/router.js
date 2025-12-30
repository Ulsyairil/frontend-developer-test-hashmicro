(function (global) {
  function parsePath() {
    if (location.protocol === "file:") {
      const raw = (location.hash || "").replace(/^#/, "") || "/";
      const path = raw.replace(/^\/+/, "");
      const parts = path.split("/").filter(Boolean);

      const route = { name: "list", params: {} };
      if (parts.length === 0) return route;

      if (parts[0] === "create") route.name = "create";
      else if (parts[0] === "about") route.name = "about";
      else if (parts[0] === "view" && parts[1]) { route.name = "view"; route.params.id = parts[1]; }
      else if (parts[0] === "edit" && parts[1]) { route.name = "edit"; route.params.id = parts[1]; }

      return route;
    }

    const path = (location.pathname || "/").replace(/^\/+/, "");
    const parts = path.split("/").filter(Boolean);
    const route = { name: "list", params: {} };

    if (parts.length === 0) return route;

    if (parts[0] === "create") route.name = "create";
    else if (parts[0] === "about") route.name = "about";
    else if (parts[0] === "view" && parts[1]) { route.name = "view"; route.params.id = parts[1]; }
    else if (parts[0] === "edit" && parts[1]) { route.name = "edit"; route.params.id = parts[1]; }

    return route;
  }

  global.HM_Router = { parsePath };
})(window);
