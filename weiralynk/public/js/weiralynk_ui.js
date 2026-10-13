/*
 * WeiraLynk UI — Role-based sidebar filtering
 * Hides workspaces that are not relevant to the logged-in user's role.
 */

(function () {
    "use strict";

    // Which workspaces each role can see
    const ROLE_WORKSPACES = {
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
        "Security Staff": ["Home"],
    };

    // Everyone with these roles sees everything
    const UNRESTRICTED_ROLES = ["System Manager", "Administrator"];

    // Workspaces to always hide from non-admins (cosmetic clutter)
    const ALWAYS_HIDE = [
        "Quality",
        "Support",
        "Website",
        "Tools",
        "Integrations",
        "Build",
        "Payroll",
        "Manufacturing",
        "Projects",
        "CRM",
        "Assets",
        "Buying",
        "Selling",
    ];

    function getUserRoles() {
        try {
            return (frappe.boot && frappe.boot.user && frappe.boot.user.roles) || [];
        } catch (e) {
            return [];
        }
    }

    function isUnrestricted(roles) {
        return roles.some((r) => UNRESTRICTED_ROLES.includes(r));
    }

    function getAllowedWorkspaces(roles) {
        const allowed = new Set(["Home"]);
        roles.forEach((role) => {
            const list = ROLE_WORKSPACES[role];
            if (list) {
                list.forEach((w) => allowed.add(w));
            }
        });
        return allowed;
    }

    function hideSidebarItems() {
        const roles = getUserRoles();
        if (!roles.length) return;
        if (isUnrestricted(roles)) return;

        const allowed = getAllowedWorkspaces(roles);

        // Frappe v15 sidebar items
        document.querySelectorAll(".sidebar-item-container").forEach((el) => {
            const labelEl = el.querySelector(".sidebar-item-label");
            if (!labelEl) return;
            const label = labelEl.textContent.trim();
            const normalized = label.replace(/^[^\w]+/, "").trim();

            if (ALWAYS_HIDE.includes(normalized)) {
                el.style.display = "none";
                return;
            }

            // Only apply the allowed-list rule to workspace links
            const href = el.querySelector("a")?.getAttribute("href") || "";
            if (href.includes("/app/") && href.split("/app/")[1]) {
                const slug = href.split("/app/")[1].split("/")[0];
                // If the slug matches a top-level workspace not in allowed, hide it
                const isTopLevel = !slug.includes("-");
                if (isTopLevel && !allowed.has(capitalize(slug))) {
                    el.style.display = "none";
                }
            }
        });

        // Hide dropdown entries under Stock, Accounting, HR that are not in allowed
        hideDropdowns(allowed);
    }

    function hideDropdowns() {
        // No-op placeholder — hooks can be added later
    }

    function capitalize(s) {
        return s
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    }

    // Run on every page load
    $(document).ready(function () {
        setTimeout(hideSidebarItems, 1200);
    });

    // Run when the route changes
    $(document).on("page-change", function () {
        setTimeout(hideSidebarItems, 800);
    });

    // Re-run when the sidebar collapses/expands
    document.addEventListener("click", function (e) {
        if (e.target && e.target.classList && e.target.classList.contains("sidebar-toggle-btn")) {
            setTimeout(hideSidebarItems, 300);
        }
    });
})();
