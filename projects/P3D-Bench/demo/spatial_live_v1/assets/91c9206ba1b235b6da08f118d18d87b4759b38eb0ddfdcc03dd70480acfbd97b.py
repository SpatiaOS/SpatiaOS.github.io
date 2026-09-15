import cadquery as cq
import math

# ----------------------------------------------------------------------
# PARAMETERS (estimated from image proportions)
# ----------------------------------------------------------------------
floor_height = 3.0          # height of one storey
num_floors = 18             # number of tower storeys
tower_height = floor_height * num_floors

# Tower plan (wedge shape: rectangle + triangular wing), CCW points
plan_pts = [(0.0, 0.0), (26.0, 0.0), (26.0, 14.0), (0.0, 30.0)]

# Facade feature parameters
balc_x0, balc_x1 = 9.0, 19.0        # balcony bay width on front facade (y=0)
balc_depth = 1.2                    # balcony recess depth into wall
balc_proj = 1.0                     # balcony slab / railing projection
win_depth = 0.3                     # window recess depth
parapet_h_rect = 3.0                # parapet height over rectangular roof
parapet_h_tri = 2.2                 # parapet height over triangular roof
parapet_t = 1.0                     # parapet wall thickness
plinth_h = 3.5                      # base plinth height
podium_h = 7.0                      # low side podium height

# ----------------------------------------------------------------------
# HELPERS
# ----------------------------------------------------------------------
def box_between(x0, y0, z0, x1, y1, z1):
    """Axis-aligned box from corner (x0,y0,z0) to (x1,y1,z1)."""
    return (cq.Workplane("XY")
            .box(x1 - x0, y1 - y0, z1 - z0, centered=False)
            .translate((x0, y0, z0)).val())

def prism(pts, z0, z1):
    """Extrude a closed polygon from z0 to z1."""
    return (cq.Workplane("XY", origin=(0, 0, z0))
            .polyline(pts).close()
            .extrude(z1 - z0).val())

def ring(pts, z0, z1, inset):
    """Parapet ring: outer polygon prism minus inward-offset polygon prism.

    Built with two independent workplane chains so that pending wires
    are consumed correctly (offset2D pops the original wire)."""
    outer = (cq.Workplane("XY", origin=(0, 0, z0))
             .polyline(pts).close()
             .extrude(z1 - z0))
    inner = (cq.Workplane("XY", origin=(0, 0, z0))
             .polyline(pts).close()
             .offset2D(-inset)
             .extrude(z1 - z0))
    return outer.cut(inner).val()

# ----------------------------------------------------------------------
# MAIN TOWER SHAFT + BASE PLINTH
# ----------------------------------------------------------------------
adds = []   # solids to fuse
cuts = []   # solids to subtract

tower = prism(plan_pts, 0.0, tower_height)

# Slightly larger plinth at ground level
plinth = (cq.Workplane("XY")
          .polyline(plan_pts).close()
          .offset2D(0.8)
          .extrude(plinth_h).val())
adds.append(plinth)

# Angled pedestal block at right base (as in image)
adds.append(prism([(26.0, 0.5), (31.0, 2.5), (31.0, 10.0), (26.0, 13.5)], 0.0, 4.0))

# ----------------------------------------------------------------------
# PODIUM (low open-top annex on the left side)
# ----------------------------------------------------------------------
adds.append(box_between(-12.0, 6.0, 0.0, 0.0, 20.0, podium_h))
cuts.append(box_between(-11.0, 7.0, podium_h - 1.5, -1.0, 19.0, podium_h + 0.5))

# ----------------------------------------------------------------------
# FLOOR-BY-FLOOR FACADE FEATURES
# ----------------------------------------------------------------------
# Slanted facade (hypotenuse) direction for band windows
p_a, p_b = (26.0, 14.0), (0.0, 30.0)
face_vec = (p_b[0] - p_a[0], p_b[1] - p_a[1])
face_len = math.hypot(*face_vec)
theta = math.degrees(math.atan2(face_vec[1], face_vec[0]))
u = (face_vec[0] / face_len, face_vec[1] / face_len)          # along face
n = (u[1], -u[0])                                             # outward normal
mid = ((p_a[0] + p_b[0]) / 2.0, (p_a[1] + p_b[1]) / 2.0)      # face midpoint

for i in range(1, num_floors):
    z = i * floor_height

    # --- Front facade (y=0): recessed balcony + projecting slab/fins ---
    cuts.append(box_between(balc_x0, -0.5, z + 0.35, balc_x1, balc_depth, z + 2.7))
    adds.append(box_between(balc_x0, -balc_proj, z, balc_x1, 0.0, z + 0.35))       # slab
    adds.append(box_between(balc_x0, -balc_proj, z, balc_x1, -balc_proj + 0.15, z + 1.1))  # railing
    adds.append(box_between(balc_x0 - 0.5, -balc_proj, z, balc_x0, 0.5, z + floor_height))  # fin L
    adds.append(box_between(balc_x1, -balc_proj, z, balc_x1 + 0.5, 0.5, z + floor_height))  # fin R

    # --- Right facade (x=26): grid of punched windows (3 cols x 2 rows) ---
    for cy in (3.5, 7.0, 10.5):
        for rz in (0.8, 1.9):
            cuts.append(box_between(26.0 - win_depth, cy - 0.9, z + rz,
                                    26.0 + 0.2, cy + 0.9, z + rz + 1.0))

    # --- Slanted facade: continuous horizontal ribbon window ---
    band = (cq.Workplane("XY")
            .box(face_len - 6.0, 0.5, 1.4)
            .rotate((0, 0, 0), (0, 0, 1), theta)
            .translate((mid[0] - n[0] * 0.05, mid[1] - n[1] * 0.05, z + 1.5))
            .val())
    cuts.append(band)

# --- Vertical corner fins on left and front-left edges (full height) ---
for fy in (4.0, 10.0, 16.0, 22.0, 27.0):
    adds.append(box_between(-0.4, fy - 0.4, 0.0, 0.1, fy + 0.4, tower_height))
for fx in (2.0, 5.0):
    adds.append(box_between(fx - 0.3, -0.3, 0.0, fx + 0.3, 0.1, tower_height))

# ----------------------------------------------------------------------
# ROOF: recessed deck + rectangular and triangular parapet rings
# ----------------------------------------------------------------------
roof_deck_cut = (cq.Workplane("XY", origin=(0, 0, tower_height - 0.6))
                 .polyline(plan_pts).close()
                 .offset2D(-parapet_t)
                 .extrude(1.0).val())
cuts.append(roof_deck_cut)

rect_pts = [(0.0, 0.0), (26.0, 0.0), (26.0, 14.0), (0.0, 14.0)]
tri_pts = [(0.0, 14.0), (26.0, 14.0), (0.0, 30.0)]
adds.append(ring(rect_pts, tower_height, tower_height + parapet_h_rect, parapet_t))
adds.append(ring(tri_pts, tower_height, tower_height + parapet_h_tri, parapet_t))

# ----------------------------------------------------------------------
# BOOLEAN ASSEMBLY
# ----------------------------------------------------------------------
result = cq.Workplane("XY").add(tower)
result = result.union(cq.Workplane("XY").add(adds))
result = result.cut(cq.Workplane("XY").add(cuts))