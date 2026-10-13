"""
WeiraLynk seed configuration for rehab centres.

Called from the command line:
    bench --site <site> execute weiralynk.setup.seed.setup_rehab
"""

import frappe

REHAB_ROLES = [
    "Nurse",
    "Psychiatric Nurse",
    "Psychiatrist",
    "Therapist",
    "Receptionist",
    "Pharmacist",
    "Kitchen Staff",
    "Accountant",
    "Manager",
    "Security Staff",
    "Director",
]

SERVICE_UNIT_TYPES = [
    {"service_unit_type": "Facility", "allow_appointments": 1, "allow_overlap": 1},
    {"service_unit_type": "Ward", "allow_appointments": 1, "allow_overlap": 1},
    {"service_unit_type": "Room", "allow_appointments": 1, "allow_overlap": 0},
    {"service_unit_type": "Bed", "inpatient_occupancy": 1, "is_billable": 1},
]

WAREHOUSES = ["Pharmacy", "Kitchen", "General Store"]

ITEM_GROUPS = [
    "Medications",
    "Food and Beverages",
    "Kitchen Supplies",
    "Medical Supplies",
    "General Supplies",
]

UOMS = [
    {"uom_name": "Tablet"},
    {"uom_name": "Strip"},
    {"uom_name": "Bottle"},
    {"uom_name": "Sachet"},
    {"uom_name": "Vial"},
    {"uom_name": "Pack"},
    {"uom_name": "Box"},
]

THERAPY_TYPES = [
    "Individual Counseling",
    "Group Therapy",
    "Family Session",
    "Psychiatric Evaluation",
    "Cognitive Behavioral Therapy",
    "Detox Support",
    "Relapse Prevention",
    "Occupational Therapy",
]


def setup_rehab():
    """Full seed for a rehab centre."""
    print("=== WeiraLynk Rehab Seed ===")
    company = frappe.defaults.get_user_default("Company") or frappe.get_all("Company", limit=1)[0].name
    print(f"Using company: {company}")

    create_roles()
    create_service_unit_types()
    create_warehouses(company)
    create_item_groups()
    create_uoms()
    create_therapy_types()
    apply_branding()
    create_default_admin()

    frappe.db.commit()
    print("=== Rehab seed complete ===")


def create_roles():
    for role_name in REHAB_ROLES:
        if not frappe.db.exists("Role", role_name):
            frappe.get_doc({
                "doctype": "Role",
                "role_name": role_name,
                "desk_access": 1,
            }).insert(ignore_permissions=True)
            print(f"  + Role: {role_name}")
        else:
            print(f"  = Role exists: {role_name}")


def create_service_unit_types():
    for sut in SERVICE_UNIT_TYPES:
        name = sut["service_unit_type"]
        if not frappe.db.exists("Healthcare Service Unit Type", name):
            doc = frappe.get_doc({
                "doctype": "Healthcare Service Unit Type",
                **sut
            })
            doc.insert(ignore_permissions=True)
            print(f"  + Service Unit Type: {name}")
        else:
            print(f"  = Service Unit Type exists: {name}")


def create_warehouses(company):
    for wh_name in WAREHOUSES:
        full_name = f"{wh_name} - {frappe.get_cached_value('Company', company, 'abbr')}"
        if not frappe.db.exists("Warehouse", full_name):
            frappe.get_doc({
                "doctype": "Warehouse",
                "warehouse_name": wh_name,
                "company": company,
                "is_group": 0,
            }).insert(ignore_permissions=True)
            print(f"  + Warehouse: {wh_name}")
        else:
            print(f"  = Warehouse exists: {wh_name}")


def create_item_groups():
    parent = "All Item Groups"
    for ig_name in ITEM_GROUPS:
        if not frappe.db.exists("Item Group", ig_name):
            frappe.get_doc({
                "doctype": "Item Group",
                "item_group_name": ig_name,
                "parent_item_group": parent,
                "is_group": 1,
            }).insert(ignore_permissions=True)
            print(f"  + Item Group: {ig_name}")
        else:
            print(f"  = Item Group exists: {ig_name}")


def create_uoms():
    for uom in UOMS:
        name = uom["uom_name"]
        if not frappe.db.exists("UOM", name):
            frappe.get_doc({
                "doctype": "UOM",
                "uom_name": name,
                "enabled": 1,
            }).insert(ignore_permissions=True)
            print(f"  + UOM: {name}")
        else:
            print(f"  = UOM exists: {name}")


def create_therapy_types():
    for tt in THERAPY_TYPES:
        if not frappe.db.exists("Therapy Type", tt):
            frappe.get_doc({
                "doctype": "Therapy Type",
                "therapy_type": tt,
            }).insert(ignore_permissions=True)
            print(f"  + Therapy Type: {tt}")
        else:
            print(f"  = Therapy Type exists: {tt}")


def apply_branding():
    """Set app name and footer to WeiraLynk."""
    try:
        settings = frappe.get_doc("Website Settings")
        settings.app_name = "WeiraLynk"
        settings.footer_powered_by = "Powered by WeiraLynk"
        settings.save(ignore_permissions=True)
        print("  + Branding: WeiraLynk applied")
    except Exception as e:
        print(f"  ! Branding error: {e}")


def create_default_admin():
    """Create a facility admin user with standard credentials."""
    email = "admin@weiralynk.local"
    if frappe.db.exists("User", email):
        print(f"  = Admin user exists: {email}")
        return

    user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": "Facility",
        "last_name": "Admin",
        "send_welcome_email": 0,
        "roles": [{"role": "System Manager"}],
    })
    user.insert(ignore_permissions=True)
    user.new_password = "ChangeMe123!"
    user.save(ignore_permissions=True)
    print(f"  + Admin user created: {email} / ChangeMe123!")
