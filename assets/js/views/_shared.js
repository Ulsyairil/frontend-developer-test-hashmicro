(function (global) {
    global.HM_ViewUtils = global.HM_ViewUtils || {};

    global.HM_ViewUtils.badgeClass = function (status) {
        if (status === "Open") return "hm-chip orange";
        if (status === "In Progress") return "hm-chip red";
        if (status === "Done") return "hm-chip navy";
        return "hm-chip";
    };

    global.HM_ViewUtils.initMaterializeSelects = function () {
        setTimeout(() => {
            const elems = document.querySelectorAll("select");
            if (global.M?.FormSelect) global.M.FormSelect.init(elems);
        }, 0);
    };
})(window);
