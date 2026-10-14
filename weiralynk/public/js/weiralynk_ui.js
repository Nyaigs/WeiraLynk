/*
 * WeiraLynk UI - Role-based sidebar filtering
 */

(function () {
    "use strict";

    var ROLE_WORKSPACES = {
        "Nurse": ["Home", "Healthcare", "Stock"],
        "Psychiatric Nurse": ["Home", "Healthcare", "Stock"],
        "Psychiatrist": ["Home", "Healthcare", "Stock"],
        "Therapist": ["Home", "Healthcare"],
        "Receptionist": ["Home", "Healthcare"],
        "Pharmacist": ["Home", "Stock", "Accounting"],
        "Kitchen Staff": ["Home", "Stock"],
        "Accountant": ["Home", "Accounting", "Stock"],
        "Manager": ["Home", "Healthcare", "Accounting", "Stock", "HR", "Users"],
        "Director": ["Home", "Healthcare", "Accounting", "Stock", "HR", "Users", "ERPNext Settings"],
        "Facility Admin": ["Home", "Healthcare", "Accounting", "Stock", "HR", "Users", "ERPNext Settings"],
        "Security Staff": ["Home"]
    };

    var UNRESTRICTED_ROLES = ["System Manager", "Administrator"];

    var ALL_WORKSPACES = {
        "home": "Home",
        "accounting": "Accounting",
        "stock": "Stock",
        "hr": "HR",
        "users": "Users",
        "healthcare": "Healthcare",
        "erpnext-settings": "ERPNext Settings",
        "quality": "Quality",
        "support": "Support",
        "website": "Website",
        "tools": "Tools",
        "integrations": "Integrations",
        "build": "Build",
        "payroll": "Payroll",
        "manufacturing": "Manufacturing",
        "projects": "Projects",
        "crm": "CRM",
        "assets": "Assets",
        "buying": "Buying",
        "selling": "Selling"
    };

    function getUserRoles() {
        try {
            return (frappe.boot && frappe.boot.user && frappe.boot.user.roles) || [];
        } catch (e) {
            return [];
        }
    }

    function isUnrestricted(roles) {
        return roles.some(function (r) {
            return UNRESTRICTED_ROLES.indexOf(r) !== -1;
        });
    }

    function getAllowedWorkspaces(roles) {
        var allowed = new Set(["Home"]);
        roles.forEach(function (role) {
            var list = ROLE_WORKSPACES[role];
            if (list) {
                list.forEach(function (w) { allowed.add(w); });
            }
        });
        return allowed;
    }

    function hideSidebarItems() {
        var roles = getUserRoles();
        if (!roles.length) return;
        if (isUnrestricted(roles)) return;

        var allowed = getAllowedWorkspaces(roles);

        document.querySelectorAll(".sidebar-item-container").forEach(function (el) {
            var link = el.querySelector("a");
            if (!link) return;
            var href = link.getAttribute("href") || "";
            var match = href.match(/^\/app\/([^\/?#]+)$/);
            if (!match) return;
            var slug = match[1];
            var workspaceName = ALL_WORKSPACES[slug];
            if (!workspaceName) return;
            if (!allowed.has(workspaceName)) {
                el.style.display = "none";
            }
        });
    }

    function run() {
        setTimeout(hideSidebarItems, 800);
        setTimeout(hideSidebarItems, 2000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }

    document.addEventListener("page-change", function () {
        setTimeout(hideSidebarItems, 600);
    });

    document.addEventListener("click", function (e) {
        var t = e.target;
        if (t && t.closest && t.closest(".sidebar-toggle-btn")) {
            setTimeout(hideSidebarItems, 300);
        }
    });
})();
