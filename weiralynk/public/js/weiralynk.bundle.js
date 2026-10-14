/*
 * WeiraLynk UI - Role-based sidebar filtering
 * Complete configuration for rehabilitation centres and mental health facilities.
 */

(function () {
    "use strict";

    var ROLE_WORKSPACES = {
        "Nurse":              ["Home", "Healthcare", "Stock"],
        "Psychiatric Nurse":  ["Home", "Healthcare", "Stock"],
        "Psychiatrist":       ["Home", "Healthcare", "Stock"],
        "Therapist":          ["Home", "Healthcare"],
        "Receptionist":       ["Home", "Healthcare", "Accounting"],
        "Pharmacist":         ["Home", "Stock", "Accounting", "Buying"],
        "Kitchen Staff":      ["Home", "Stock"],
        "Accountant":         ["Home", "Accounting", "Stock", "Buying", "HR", "Payroll", "Loans", "Assets"],
        "Manager":            ["Home", "Accounting", "Stock", "HR", "Buying", "Users", "Healthcare", "Payroll", "Assets", "Loans"],
        "Director":           ["Home", "Accounting", "Stock", "HR", "Buying", "Assets", "Users", "Healthcare", "Payroll", "Loans", "Mpesa", "ERPNext Settings"],
        "Facility Admin":     ["Home", "Accounting", "Stock", "HR", "Buying", "Assets", "Users", "Healthcare", "Payroll", "Loans", "Mpesa", "ERPNext Settings"],
        "Security Staff":     ["Home"]
    };

    var UNRESTRICTED_ROLES = ["System Manager", "Administrator"];

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
            var labelEl = el.querySelector(".sidebar-item-label");
            if (!labelEl) return;
            var label = (labelEl.textContent || "").trim();
            label = label.replace(/^[\s\u25B8\u25BE\u203A\u02C4\u02C5]+/, "").trim();
            if (!label) return;

            var isWorkspaceLink = el.querySelector("a[href^='/app/']");
            if (!isWorkspaceLink) return;

            if (!allowed.has(label)) {
                el.style.display = "none";
            }
        });
    }

    function run() {
        setTimeout(hideSidebarItems, 600);
        setTimeout(hideSidebarItems, 1500);
        setTimeout(hideSidebarItems, 3000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }

    document.addEventListener("page-change", function () {
        setTimeout(hideSidebarItems, 500);
        setTimeout(hideSidebarItems, 1500);
    });

    document.addEventListener("click", function (e) {
        var t = e.target;
        if (t && t.closest && t.closest(".sidebar-toggle-btn")) {
            setTimeout(hideSidebarItems, 300);
            setTimeout(hideSidebarItems, 800);
        }
    });
})();
