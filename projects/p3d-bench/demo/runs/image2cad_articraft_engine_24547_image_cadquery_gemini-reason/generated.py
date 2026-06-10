import cadquery as cq

# --- Parameters ---
# Base & Pedestal
base_len = 160.0
base_wid = 80.0
base_h = 6.0
pedestal_h = 28.0

# Cylinder
cyl_r = 16.0
cyl_l = 65.0
cyl_x = -20.0  # X-offset for cylinder assembly
cyl_z = base_h + pedestal_h + 18.0  # Axis height (Z = 52.0)

# Cooling Fins
fin_n = 22
fin_r = 21.0
fin_t = 1.0
fin_space = 1.5

# Crankshaft & Support
crank_x = 35.0
crank_throw = 14.0
shaft_r = 4.0
support_gap = 16.0
support_w = 14.0

# Flywheel
fw_r = 44.0
fw_t = 12.0
fw_rim = 6.0
fw_web_t = 4.0
fw_hole_r = 11.0
fw_y = 40.0

# --- 1. Base Assembly ---
# Main base plate with rounded corners and chamfered top
base_plate = (
    cq.Workplane("XY")
    .workplane(offset=base_h / 2)
    .box(base_len, base_wid, base_h)
    .edges("|Z").fillet(8)
    .edges(">Z").chamfer(1)
)

# Tapered pedestal supporting the engine components
pedestal = (
    cq.Workplane("XY")
    .workplane(offset=base_h)
    .rect(base_len - 20, base_wid - 20)
    .workplane(offset=pedestal_h)
    .rect(base_len - 50, base_wid - 35)
    .loft()
)
base = base_plate.union(pedestal)

# --- 2. Cylinder Assembly ---
# Block connecting the cylinder to the pedestal
cyl_support = (
    cq.Workplane("XY")
    .workplane(offset=base_h + pedestal_h + 8)
    .center(cyl_x - 5, 0)
    .box(35, 32, 16)
)

# Main cylinder body
cylinder = (
    cq.Workplane("YZ")
    .workplane(offset=cyl_x + 15)
    .center(0, cyl_z)
    .circle(cyl_r)
    .extrude(-cyl_l)
)

# Cylinder base flange
cyl_flange = (
    cq.Workplane("YZ")
    .workplane(offset=cyl_x + 15)
    .center(0, cyl_z)
    .circle(cyl_r + 3)
    .extrude(-4)
)
cylinder = cylinder.union(cyl_flange)

# Generate cooling fins along the cylinder
fin_start = cyl_x + 5
for i in range(fin_n):
    fin_pos = fin_start - i * (fin_t + fin_space)
    fin = (
        cq.Workplane("YZ")
        .workplane(offset=fin_pos)
        .center(0, cyl_z)
        .circle(fin_r)
        .extrude(-fin_t)
    )
    cylinder = cylinder.union(fin)

# Cylinder head
cyl_head_x = fin_start - fin_n * (fin_t + fin_space) - 2
cyl_head = (
    cq.Workplane("YZ")
    .workplane(offset=cyl_head_x)
    .center(0, cyl_z)
    .circle(cyl_r)
    .extrude(-5)
)
cylinder = cylinder.union(cyl_head)

# Cylinder head bolts and center rod
head_screws = (
    cq.Workplane("YZ")
    .workplane(offset=cyl_head_x - 5)
    .center(0, cyl_z)
    .polarArray(11, 0, 360, 6)
    .circle(1.5)
    .extrude(2)
)
head_rod = (
    cq.Workplane("YZ")
    .workplane(offset=cyl_head_x - 5)
    .center(0, cyl_z)
    .circle(2)
    .extrude(-12)
)
cylinder = cylinder.union(head_screws).union(head_rod)

# Top exhaust/intake port
port = (
    cq.Workplane("XY")
    .workplane(offset=cyl_z + cyl_r - 2)
    .center(cyl_x + 5, 0)
    .circle(4.5)
    .extrude(14)
)
port_cap = (
    cq.Workplane("XY")
    .workplane(offset=cyl_z + cyl_r + 12)
    .center(cyl_x + 5, 0)
    .circle(6.5)
    .extrude(4)
)
cylinder = cylinder.union(port).union(port_cap)

# --- 3. Crankshaft Support ---
support_base_z = base_h + pedestal_h
support_h = 25.0

# Main support block with center cutout for the crank web
crank_support = (
    cq.Workplane("XY")
    .workplane(offset=support_base_z + support_h / 2)
    .center(crank_x, 0)
    .box(28, support_gap + 2 * support_w, support_h)
)
cutout = (
    cq.Workplane("XY")
    .workplane(offset=support_base_z + support_h / 2 + 2)
    .center(crank_x, 0)
    .box(35, support_gap, support_h)
)
crank_support = crank_support.cut(cutout)

# Hole for the main crankshaft
shaft_hole = (
    cq.Workplane("YZ")
    .workplane(offset=crank_x)
    .center(0, cyl_z)
    .circle(shaft_r + 0.5)
    .extrude(40, both=True)
)
crank_support = crank_support.cut(shaft_hole)

# Top bearing caps
cap_z = support_base_z + support_h + 2.5
cap = (
    cq.Workplane("XY")
    .workplane(offset=cap_z)
    .center(crank_x, 0)
    .box(28, support_gap + 2 * support_w, 5)
)
cap_cutout = (
    cq.Workplane("XY")
    .workplane(offset=cap_z)
    .center(crank_x, 0)
    .box(35, support_gap, 6)
)
cap = cap.cut(cap_cutout)
crank_support = crank_support.union(cap)

# Bearing cap bolts
cap_screws = (
    cq.Workplane("XY")
    .workplane(offset=cap_z + 2.5)
    .center(crank_x, 0)
    .rect(18, support_gap + support_w, forConstruction=True)
    .vertices()
    .circle(1.5)
    .extrude(-6)
)
crank_support = crank_support.union(cap_screws)

# --- 4. Crankshaft & Connecting Rod ---
# Main shaft passing through supports and flywheels
shaft = (
    cq.Workplane("YZ")
    .workplane(offset=crank_x)
    .center(0, cyl_z)
    .circle(shaft_r)
    .extrude(fw_y + fw_t, both=True)
)

# Offset crank pin
crank_pin_x = crank_x - crank_throw
crank_pin = (
    cq.Workplane("YZ")
    .workplane(offset=crank_pin_x)
    .center(0, cyl_z)
    .circle(shaft_r)
    .extrude(support_gap - 2, both=True)
)

# Crank webs connecting main shaft to crank pin
web_len = crank_throw + 14
web_center_x = (crank_x + crank_pin_x) / 2
web1 = (
    cq.Workplane("XZ")
    .workplane(offset=support_gap / 2 - 2)
    .center(web_center_x, cyl_z)
    .box(web_len, 14, 4)
)
web2 = (
    cq.Workplane("XZ")
    .workplane(offset=-(support_gap / 2 - 2))
    .center(web_center_x, cyl_z)
    .box(web_len, 14, 4)
)

# Connecting rod from cylinder to crank pin
con_rod_start = cyl_x + 15
con_rod = (
    cq.Workplane("YZ")
    .workplane(offset=con_rod_start)
    .center(0, cyl_z)
    .circle(4.5)
    .extrude(crank_pin_x - con_rod_start)
)

# Connecting rod big end (wraps around crank pin)
con_rod_head = (
    cq.Workplane("XZ")
    .workplane(offset=-6)
    .center(crank_pin_x, cyl_z)
    .circle(7)
    .extrude(12)
)
con_rod = con_rod.union(con_rod_head)

crank_assembly = shaft.union(crank_pin).union(web1).union(web2).union(con_rod)

# --- 5. Flywheels ---
def create_flywheel():
    # Solid disk base
    fw = (
        cq.Workplane("XZ")
        .workplane(offset=-fw_t / 2)
        .circle(fw_r)
        .extrude(fw_t)
    )
    # Inner recess to form the thick outer rim
    cutout_r = fw_r - fw_rim
    cutout = (
        cq.Workplane("XZ")
        .workplane(offset=-fw_t / 2 - 1)
        .circle(cutout_r)
        .extrude(fw_t + 2)
    )
    # Central hub
    hub = (
        cq.Workplane("XZ")
        .workplane(offset=-fw_t / 2 - 3)
        .circle(10)
        .extrude(fw_t + 6)
    )
    # Thin inner web connecting hub to rim
    web = (
        cq.Workplane("XZ")
        .workplane(offset=-fw_web_t / 2)
        .circle(cutout_r)
        .extrude(fw_web_t)
    )
    fw = fw.cut(cutout).union(hub).union(web)
    
    # 5 circular cutouts in the web
    holes = (
        cq.Workplane("XZ")
        .workplane(offset=-fw_t)
        .polarArray(23, 0, 360, 5)
        .circle(fw_hole_r)
        .extrude(fw_t * 2)
    )
    fw = fw.cut(holes)
    return fw

flywheel1 = create_flywheel().translate((crank_x, fw_y, cyl_z))
flywheel2 = create_flywheel().translate((crank_x, -fw_y, cyl_z))

# --- Final Assembly ---
result = (
    base
    .union(cyl_support)
    .union(cylinder)
    .union(crank_support)
    .union(crank_assembly)
    .union(flywheel1)
    .union(flywheel2)
)