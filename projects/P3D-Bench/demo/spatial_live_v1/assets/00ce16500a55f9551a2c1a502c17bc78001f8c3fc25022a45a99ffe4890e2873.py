import math
import cadquery as cq

# ==============================================================================
# PARAMETERS - Architectural High-Rise Residential Tower
# ==============================================================================
# Scale: 1 unit = 1 meter

# Floor Heights & Counts
H_PODIUM = 4.2          # Ground podium height
H_FLOOR = 2.6           # Typical residential floor height
N_TYPICAL = 18          # Number of typical residential floors with balconies
N_PENTHOUSE = 2         # Additional stepped penthouse floors
H_TOWER = N_TYPICAL * H_FLOOR          # Height of typical section (46.8m)
H_PENTHOUSE = N_PENTHOUSE * H_FLOOR    # Height of penthouse section (5.2m)
Z_ROOF_MAIN = H_PODIUM + H_TOWER       # Main roof level (51.0m)
Z_ROOF_TOP = Z_ROOF_MAIN + H_PENTHOUSE # Penthouse roof level (56.2m)

# Footprint Coordinates (Counter-Clockwise in XY plane)
# Origin (0,0) is at the corner between the balcony facade and Facet 1
PT_BALC_END = (-8.0, 1.4)
PT_BALC_REC = (0.0, 1.4)
PT_CORNER_0 = (0.0, 0.0)
PT_FACET_1_END = (3.6, 2.7)
PT_FACET_2_END = (4.2, 8.7)
PT_REAR_APEX = (0.5, 11.0)
PT_REAR_LEFT = (-5.5, 8.5)

# Container for all solid model components
components = []

# ==============================================================================
# 1. PODIUM & BASE
# ==============================================================================
# Main podium footprint extending slightly past the tower perimeter
podium_pts = [
    (-8.2, -0.2),
    (0.0, -0.2),
    (3.9, 2.5),
    (4.6, 8.7),
    (0.5, 11.3),
    (-5.7, 8.7),
    (-8.2, 1.4),
]

podium = (
    cq.Workplane("XY")
    .polyline(podium_pts)
    .close()
    .extrude(H_PODIUM)
)
components.append(podium)

# Ground floor storefront / entrance feature on Facet 1
len_f1 = math.hypot(3.6, 2.7)
ang_f1 = math.degrees(math.atan2(2.7, 3.6))
ux_f1 = 3.6 / len_f1
uy_f1 = 2.7 / len_f1
nx_f1 = uy_f1
ny_f1 = -ux_f1

# Entrance portal surround and recessed glazed opening
p_ent = (2.2 * ux_f1 + 0.06 * nx_f1, 2.2 * uy_f1 + 0.06 * ny_f1, 1.6)
portal = (
    cq.Workplane("XY")
    .box(2.2, 0.12, 2.8)
    .rotate((0, 0, 0), (0, 0, 1), ang_f1)
    .translate(p_ent)
)
portal_door = (
    cq.Workplane("XY")
    .box(1.8, 0.16, 2.4)
    .rotate((0, 0, 0), (0, 0, 1), ang_f1)
    .translate((p_ent[0] + 0.02 * nx_f1, p_ent[1] + 0.02 * ny_f1, 1.4))
)
components.extend([portal, portal_door])

# Low courtyard/terrace annex on the back-left
terrace_base = (
    cq.Workplane("XY")
    .box(4.8, 6.0, 3.0)
    .translate((-10.6, 5.5, 1.5))
)
components.append(terrace_base)

# Parapet walls around the low courtyard terrace (Z = 3.0 to 3.85)
t_wall_left = (
    cq.Workplane("XY")
    .box(0.2, 6.0, 0.85)
    .translate((-12.9, 5.5, 3.425))
)
t_wall_front = (
    cq.Workplane("XY")
    .box(4.8, 0.2, 0.85)
    .translate((-10.6, 2.6, 3.425))
)
t_wall_back = (
    cq.Workplane("XY")
    .box(4.8, 0.2, 0.85)
    .translate((-10.6, 8.4, 3.425))
)
components.extend([t_wall_left, t_wall_front, t_wall_back])

# ==============================================================================
# 2. MAIN TOWER CORE
# ==============================================================================
# Core prism from top of podium to typical roof level
tower_pts = [
    PT_BALC_END,
    PT_BALC_REC,
    PT_CORNER_0,
    PT_FACET_1_END,
    PT_FACET_2_END,
    PT_REAR_APEX,
    PT_REAR_LEFT,
]

tower_core = (
    cq.Workplane("XY")
    .workplane(offset=H_PODIUM)
    .polyline(tower_pts)
    .close()
    .extrude(H_TOWER)
)
components.append(tower_core)

# ==============================================================================
# 3. BALCONY STACK (Front-Left Facade)
# ==============================================================================
# Stack of 18 typical floors with floor slabs, railings, divider, and openings
balc_w = 8.0
balc_d = 1.4
slab_th = 0.22

for i in range(N_TYPICAL):
    zf = H_PODIUM + i * H_FLOOR

    # Balcony projecting floor slab
    slab = (
        cq.Workplane("XY")
        .box(balc_w, balc_d, slab_th)
        .translate((-balc_w / 2.0, balc_d / 2.0, zf + slab_th / 2.0))
    )
    components.append(slab)

    # Front balcony railings (divided into two bays)
    rail_l = (
        cq.Workplane("XY")
        .box(3.7, 0.08, 0.85)
        .translate((-5.95, 0.04, zf + slab_th + 0.85 / 2.0))
    )
    rail_r = (
        cq.Workplane("XY")
        .box(3.7, 0.08, 0.85)
        .translate((-2.05, 0.04, zf + slab_th + 0.85 / 2.0))
    )
    # Center dividing wall between balcony units
    divider = (
        cq.Workplane("XY")
        .box(0.16, balc_d, H_FLOOR - slab_th)
        .translate((-4.0, balc_d / 2.0, zf + slab_th + (H_FLOOR - slab_th) / 2.0))
    )
    # Left end wall of balcony
    end_wall_l = (
        cq.Workplane("XY")
        .box(0.16, balc_d, H_FLOOR - slab_th)
        .translate((-7.92, balc_d / 2.0, zf + slab_th + (H_FLOOR - slab_th) / 2.0))
    )
    # Right end wall / return to Facet 1
    end_wall_r = (
        cq.Workplane("XY")
        .box(0.16, balc_d, H_FLOOR - slab_th)
        .translate((-0.08, balc_d / 2.0, zf + slab_th + (H_FLOOR - slab_th) / 2.0))
    )
    components.extend([rail_l, rail_r, divider, end_wall_l, end_wall_r])

    # Recessed dark door / glazing voids in the balcony shadow box
    door_l = (
        cq.Workplane("XY")
        .box(2.6, 0.06, 1.9)
        .translate((-5.95, balc_d - 0.03, zf + slab_th + 0.95))
    )
    door_r = (
        cq.Workplane("XY")
        .box(2.6, 0.06, 1.9)
        .translate((-2.05, balc_d - 0.03, zf + slab_th + 0.95))
    )
    components.extend([door_l, door_r])

# Vertical architectural fins on the left corner of the balconies
fin_h = H_TOWER + 0.8
fin_1 = (
    cq.Workplane("XY")
    .box(0.10, 0.25, fin_h)
    .translate((-8.08, 0.05, H_PODIUM + fin_h / 2.0))
)
fin_2 = (
    cq.Workplane("XY")
    .box(0.10, 0.25, fin_h)
    .translate((-8.18, 0.55, H_PODIUM + fin_h / 2.0))
)
fin_3 = (
    cq.Workplane("XY")
    .box(0.10, 0.25, fin_h)
    .translate((-8.18, 1.05, H_PODIUM + fin_h / 2.0))
)
components.extend([fin_1, fin_2, fin_3])

# ==============================================================================
# 4. FACET 1: MULTI-PANE GRID WINDOWS (Center-Right Facade)
# ==============================================================================
# Two columns of 3x3 multi-pane windows per typical floor
s_col1 = 1.25
s_col2 = 2.85
pos_col1 = (s_col1 * ux_f1, s_col1 * uy_f1)
pos_col2 = (s_col2 * ux_f1, s_col2 * uy_f1)

w_frame_w = 1.10
w_frame_h = 1.35

for i in range(N_TYPICAL):
    zc = H_PODIUM + i * H_FLOOR + 1.35

    for col_pos in [pos_col1, pos_col2]:
        px = col_pos[0] + 0.05 * nx_f1
        py = col_pos[1] + 0.05 * ny_f1

        # Outer window frame
        w_frame = (
            cq.Workplane("XY")
            .box(w_frame_w, 0.10, w_frame_h)
            .rotate((0, 0, 0), (0, 0, 1), ang_f1)
            .translate((px, py, zc))
        )
        # Recessed glass pane
        w_glass = (
            cq.Workplane("XY")
            .box(w_frame_w - 0.1, 0.04, w_frame_h - 0.1)
            .rotate((0, 0, 0), (0, 0, 1), ang_f1)
            .translate((px + 0.02 * nx_f1, py + 0.02 * ny_f1, zc))
        )
        # Mullions (creating 3x3 panes)
        m_h1 = (
            cq.Workplane("XY")
            .box(w_frame_w - 0.1, 0.05, 0.04)
            .rotate((0, 0, 0), (0, 0, 1), ang_f1)
            .translate((px + 0.03 * nx_f1, py + 0.03 * ny_f1, zc - 0.24))
        )
        m_h2 = (
            cq.Workplane("XY")
            .box(w_frame_w - 0.1, 0.05, 0.04)
            .rotate((0, 0, 0), (0, 0, 1), ang_f1)
            .translate((px + 0.03 * nx_f1, py + 0.03 * ny_f1, zc + 0.24))
        )
        m_v1 = (
            cq.Workplane("XY")
            .box(0.04, 0.05, w_frame_h - 0.1)
            .rotate((0, 0, 0), (0, 0, 1), ang_f1)
            .translate((
                px - 0.22 * ux_f1 + 0.03 * nx_f1,
                py - 0.22 * uy_f1 + 0.03 * ny_f1,
                zc
            ))
        )
        m_v2 = (
            cq.Workplane("XY")
            .box(0.04, 0.05, w_frame_h - 0.1)
            .rotate((0, 0, 0), (0, 0, 1), ang_f1)
            .translate((
                px + 0.22 * ux_f1 + 0.03 * nx_f1,
                py + 0.22 * uy_f1 + 0.03 * ny_f1,
                zc
            ))
        )
        components.extend([w_frame, w_glass, m_h1, m_h2, m_v1, m_v2])

# ==============================================================================
# 5. FACET 2: RIBBON WINDOWS (Far Right Facade)
# ==============================================================================
# Runs for all 18 typical floors PLUS 2 penthouse floors
dx_f2 = PT_FACET_2_END[0] - PT_FACET_1_END[0]
dy_f2 = PT_FACET_2_END[1] - PT_FACET_1_END[1]
len_f2 = math.hypot(dx_f2, dy_f2)
ang_f2 = math.degrees(math.atan2(dy_f2, dx_f2))
ux_f2 = dx_f2 / len_f2
uy_f2 = dy_f2 / len_f2
nx_f2 = uy_f2
ny_f2 = -ux_f2

s_ribbon = len_f2 / 2.0
pos_ribbon = (
    PT_FACET_1_END[0] + s_ribbon * ux_f2,
    PT_FACET_1_END[1] + s_ribbon * uy_f2,
)

ribbon_w = 4.2
ribbon_h = 1.1

for i in range(N_TYPICAL + N_PENTHOUSE):
    zc = H_PODIUM + i * H_FLOOR + 1.30
    px = pos_ribbon[0] + 0.05 * nx_f2
    py = pos_ribbon[1] + 0.05 * ny_f2

    # Ribbon window frame
    r_frame = (
        cq.Workplane("XY")
        .box(ribbon_w, 0.10, ribbon_h)
        .rotate((0, 0, 0), (0, 0, 1), ang_f2)
        .translate((px, py, zc))
    )
    # Recessed horizontal glass band
    r_glass = (
        cq.Workplane("XY")
        .box(ribbon_w - 0.1, 0.04, ribbon_h - 0.1)
        .rotate((0, 0, 0), (0, 0, 1), ang_f2)
        .translate((px + 0.02 * nx_f2, py + 0.02 * ny_f2, zc))
    )
    # Vertical mullions dividing the ribbon into 4 panes
    m_r1 = (
        cq.Workplane("XY")
        .box(0.04, 0.05, ribbon_h - 0.1)
        .rotate((0, 0, 0), (0, 0, 1), ang_f2)
        .translate((
            px - 1.05 * ux_f2 + 0.03 * nx_f2,
            py - 1.05 * uy_f2 + 0.03 * ny_f2,
            zc
        ))
    )
    m_r2 = (
        cq.Workplane("XY")
        .box(0.04, 0.05, ribbon_h - 0.1)
        .rotate((0, 0, 0), (0, 0, 1), ang_f2)
        .translate((
            px + 0.0 * ux_f2 + 0.03 * nx_f2,
            py + 0.0 * uy_f2 + 0.03 * ny_f2,
            zc
        ))
    )
    m_r3 = (
        cq.Workplane("XY")
        .box(0.04, 0.05, ribbon_h - 0.1)
        .rotate((0, 0, 0), (0, 0, 1), ang_f2)
        .translate((
            px + 1.05 * ux_f2 + 0.03 * nx_f2,
            py + 1.05 * uy_f2 + 0.03 * ny_f2,
            zc
        ))
    )
    components.extend([r_frame, r_glass, m_r1, m_r2, m_r3])

# ==============================================================================
# 6. MAIN ROOF TERRACE & PARAPET (Over Balcony Stack)
# ==============================================================================
# Terrace roof slab over the balcony stack
roof_slab = (
    cq.Workplane("XY")
    .box(balc_w, balc_d, slab_th)
    .translate((-balc_w / 2.0, balc_d / 2.0, Z_ROOF_MAIN + slab_th / 2.0))
)
# Parapet walls around the main roof terrace
roof_parapet_front = (
    cq.Workplane("XY")
    .box(balc_w, 0.20, 0.9)
    .translate((-balc_w / 2.0, 0.10, Z_ROOF_MAIN + slab_th + 0.45))
)
roof_parapet_left = (
    cq.Workplane("XY")
    .box(0.20, balc_d, 0.9)
    .translate((-balc_w + 0.10, balc_d / 2.0, Z_ROOF_MAIN + slab_th + 0.45))
)
components.extend([roof_slab, roof_parapet_front, roof_parapet_left])

# ==============================================================================
# 7. PENTHOUSE STRUCTURE (Stepped Upper Floors)
# ==============================================================================
# Penthouse mass steps back from the front balcony edge
penthouse_pts = [
    (-5.2, 2.0),
    (0.0, 2.0),
    PT_FACET_1_END,
    PT_FACET_2_END,
    PT_REAR_APEX,
    PT_REAR_LEFT,
]

penthouse_mass = (
    cq.Workplane("XY")
    .workplane(offset=Z_ROOF_MAIN)
    .polyline(penthouse_pts)
    .close()
    .extrude(H_PENTHOUSE)
)
components.append(penthouse_mass)

# Parapet wall on the setback terrace in front of the penthouse
parapet_setback = (
    cq.Workplane("XY")
    .box(5.2, 0.20, 0.9)
    .translate((-2.6, 1.9, Z_ROOF_MAIN + 0.45))
)
components.append(parapet_setback)

# ==============================================================================
# 8. ROOFTOP CROWN (Triangular Penthouse & Mechanical Bulkheads)
# ==============================================================================
# Distinctive triangular mechanical tower on the left with perimeter parapet
tri_crown_pts = [
    (-4.8, 2.2),
    (0.2, 2.2),
    (-2.3, 7.2),
]

tri_crown_outer = (
    cq.Workplane("XY")
    .workplane(offset=Z_ROOF_TOP)
    .polyline(tri_crown_pts)
    .close()
    .extrude(2.2)
)
tri_crown_inner = (
    cq.Workplane("XY")
    .workplane(offset=Z_ROOF_TOP + 0.8)
    .polyline([
        (-4.2, 2.5),
        (-0.3, 2.5),
        (-2.3, 6.5),
    ])
    .close()
    .extrude(2.0)
)
tri_crown = tri_crown_outer.cut(tri_crown_inner)
components.append(tri_crown)

# Adjacent angled rooftop bulkhead on the right with perimeter parapet
adj_roof_pts = [
    (0.2, 2.2),
    PT_FACET_1_END,
    PT_FACET_2_END,
    PT_REAR_APEX,
    (-2.3, 7.2),
]

adj_crown_outer = (
    cq.Workplane("XY")
    .workplane(offset=Z_ROOF_TOP)
    .polyline(adj_roof_pts)
    .close()
    .extrude(1.5)
)
adj_crown_inner = (
    cq.Workplane("XY")
    .workplane(offset=Z_ROOF_TOP + 0.6)
    .polyline([
        (0.5, 2.6),
        (3.3, 3.0),
        (3.8, 8.4),
        (0.6, 10.4),
        (-2.0, 7.1),
    ])
    .close()
    .extrude(1.6)
)
adj_crown = adj_crown_outer.cut(adj_crown_inner)
components.append(adj_crown)

# ==============================================================================
# COMBINE ALL COMPONENTS INTO FINAL MODEL
# ==============================================================================
all_solids = []
for c in components:
    for obj in c.vals():
        all_solids.append(obj)

final_compound = cq.Compound.makeCompound(all_solids)
result = cq.Workplane("XY").newObject([final_compound])