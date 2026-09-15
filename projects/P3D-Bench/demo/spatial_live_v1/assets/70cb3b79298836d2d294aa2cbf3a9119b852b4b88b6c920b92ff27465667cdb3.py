import cadquery as cq
import math

# ==============================================================================
# Parameters
# ==============================================================================

# Fastener dimensions
pivot_bore_diam = 1.583
pivot_bore_rad = pivot_bore_diam / 2.0  # ~0.7915 mm
fastener_shaft_rad = 0.82              # Fits tightly inside bore (~0.88 mm in description)
fastener_shaft_len = 4.4               # Spans both blade hubs
fastener_head_front_rad = 2.66         # Front slotted head radius (bbox 5.32 mm)
fastener_head_rear_rad = 2.56          # Rear flanged head radius
fastener_head_thick = 1.0              # Thickness of each head
slot_width = 0.75                      # Width of screw slot
slot_depth = 0.55                      # Depth of screw slot
slot_angle = 75.0                      # Slot angle in degrees

# Blade dimensions
blade_thick = 2.2                      # Thickness at shearing / pivot region (~2.0 mm)
handle_thick = 6.8                     # Total molded handle thickness (~7.0 mm)
recess_depth = 0.6                     # Depth of ergonomic grip recess channel

# Overlap for robust CAD boolean operations (avoids coplanar face issues)
eps = 0.02

# ==============================================================================
# Part 1: Fastener (Slotted Knob Fastener)
# ==============================================================================

# Central cylindrical pin
fastener_shaft = (
    cq.Workplane("XY")
    .workplane(offset=-blade_thick)
    .circle(fastener_shaft_rad)
    .extrude(fastener_shaft_len)
)

# Front disc head (with chamfered edge)
fastener_front_head = (
    cq.Workplane("XY")
    .workplane(offset=blade_thick)
    .circle(fastener_head_front_rad)
    .extrude(fastener_head_thick)
)
try:
    fastener_front_head = fastener_front_head.edges(">Z").chamfer(0.2)
except Exception:
    pass

# Screw slot across the front head
slot_cutter = (
    cq.Workplane("XY")
    .workplane(offset=blade_thick + fastener_head_thick - slot_depth)
    .transformed(rotate=(0, 0, slot_angle))
    .rect(slot_width, fastener_head_front_rad * 2.5)
    .extrude(slot_depth + 0.2)
)
fastener_front_head = fastener_front_head.cut(slot_cutter)

# Rear disc head (slightly smaller diameter)
fastener_rear_head = (
    cq.Workplane("XY")
    .workplane(offset=-blade_thick - fastener_head_thick)
    .circle(fastener_head_rear_rad)
    .extrude(fastener_head_thick)
)
try:
    fastener_rear_head = fastener_rear_head.edges("<Z").chamfer(0.2)
except Exception:
    pass

# Combine fastener components
fastener = fastener_shaft.union(fastener_front_head).union(fastener_rear_head)

# ==============================================================================
# Part 2: Front Blade Half (Tall Finger Loop + Left Blade)
# ==============================================================================

# --- Blade & Pivot Region ---
# Outer profile of the front blade, hub, and lower shank
front_blade_profile = [
    (4.5, 14.0),
    (-1.5, 14.0),
    (-3.8, 7.0),
    (-5.2, 0.0),
    (-6.2, -15.0),
    (-8.2, -35.0),
    (-10.0, -55.0),
    (-11.5, -75.0),
    (-12.0, -87.5),
    (-11.2, -89.0),
    (-10.2, -88.5),
    (-8.0, -65.0),
    (-5.5, -42.0),
    (-3.0, -22.0),
    (-0.8, -10.0),
    (0.2, -3.5),
    (2.8, -1.8),
    (4.5, 0.0),
]

front_blade_body = (
    cq.Workplane("XY")
    .workplane(offset=-eps)
    .polyline(front_blade_profile)
    .close()
    .extrude(blade_thick + eps)
)

# Pivot through-hole
pivot_hole_cutter_front = (
    cq.Workplane("XY")
    .workplane(offset=-1.0)
    .circle(pivot_bore_rad)
    .extrude(blade_thick + 2.0)
)
front_blade_body = front_blade_body.cut(pivot_hole_cutter_front)

# Ground bevel along the cutting edge
# A wedge cut removing material from the outer face (+Z) toward the shearing edge
bevel_cutter_front = (
    cq.Workplane("XZ")
    .polyline([
        (0.2, 0.35),
        (8.0, 0.35),
        (8.0, blade_thick + 1.0),
        (-3.0, blade_thick + 1.0),
        (-3.0, blade_thick),
    ])
    .close()
    .extrude(100.0, both=True)
    .translate((-5.0, -46.0, 0))
    .rotate((0, 0, 0), (0, 0, 1), -6.8)
)
front_blade_body = front_blade_body.cut(bevel_cutter_front)

# --- Finger Loop Handle ---
# Outer profile of the elongated finger loop
finger_outer_pts = [
    (1.5, 14.0),
    (4.5, 14.0),
    (8.5, 19.0),
    (13.0, 26.0),
    (16.5, 36.0),
    (18.0, 48.0),
    (17.0, 58.0),
    (14.0, 66.0),
    (9.0, 69.8),
    (4.5, 69.2),
    (1.0, 66.0),
    (-0.8, 58.0),
    (-1.2, 48.0),
    (-0.5, 36.0),
    (0.5, 24.0),
]

# Inner finger hole profile
finger_inner_pts = [
    (4.5, 35.0),
    (6.5, 32.5),
    (9.0, 35.0),
    (11.5, 42.0),
    (11.8, 50.0),
    (10.5, 56.0),
    (8.5, 60.5),
    (6.0, 58.0),
    (4.0, 52.0),
    (3.8, 43.0),
]

# Solid handle body
finger_handle_solid = (
    cq.Workplane("XY")
    .polyline(finger_outer_pts)
    .close()
    .extrude(handle_thick)
)

# Finger through-hole
finger_hole_cutter = (
    cq.Workplane("XY")
    .workplane(offset=-1.0)
    .polyline(finger_inner_pts)
    .close()
    .extrude(handle_thick + 2.0)
)
finger_handle = finger_handle_solid.cut(finger_hole_cutter)

# Recessed ergonomic grip channel around the finger hole
recess_outer_front = [
    (2.5, 19.0),
    (6.0, 23.0),
    (10.5, 29.0),
    (14.2, 38.0),
    (15.5, 48.0),
    (14.5, 57.0),
    (12.0, 64.0),
    (8.0, 67.0),
    (4.5, 66.5),
    (1.8, 63.0),
    (0.5, 56.0),
    (0.5, 48.0),
    (1.0, 37.0),
    (1.8, 26.0),
]
recess_inner_front = [
    (3.2, 34.0),
    (6.5, 30.5),
    (10.5, 33.5),
    (13.2, 42.0),
    (13.5, 51.0),
    (11.8, 58.5),
    (8.2, 62.5),
    (4.5, 59.8),
    (2.5, 51.5),
    (2.5, 42.0),
]

recess_pocket_front = (
    cq.Workplane("XY")
    .workplane(offset=handle_thick - recess_depth)
    .polyline(recess_outer_front)
    .close()
    .extrude(recess_depth + 0.1)
)
recess_island_front = (
    cq.Workplane("XY")
    .workplane(offset=handle_thick - recess_depth)
    .polyline(recess_inner_front)
    .close()
    .extrude(recess_depth)
).cut(finger_hole_cutter)

finger_handle = finger_handle.cut(recess_pocket_front).union(recess_island_front)

# Fillet handle outer contours for molded plastic appearance
try:
    finger_handle = finger_handle.edges("|Z").fillet(0.8)
except Exception:
    pass

# Union blade and handle into front blade half
blade_front = front_blade_body.union(finger_handle)

# ==============================================================================
# Part 3: Back Blade Half (Thumb Loop + Right Blade)
# ==============================================================================

# --- Blade & Pivot Region ---
# Outer profile of the back blade, hub, and lower shank
back_blade_profile = [
    (-1.5, 14.0),
    (-7.5, 14.0),
    (-6.2, 7.0),
    (-4.8, 0.0),
    (-2.5, -3.0),
    (-1.2, -6.0),
    (-0.5, -20.0),
    (-0.2, -45.0),
    (+0.5, -70.0),
    (+1.5, -91.0),   # Sharp pointed tip
    (+2.2, -88.0),
    (+3.5, -70.0),
    (+5.2, -50.0),
    (+6.8, -30.0),
    (+7.5, -12.0),
    (+6.5, 0.0),
    (+5.0, 7.0),
    (+2.0, 11.0),
]

back_blade_body = (
    cq.Workplane("XY")
    .workplane(offset=-blade_thick)
    .polyline(back_blade_profile)
    .close()
    .extrude(blade_thick + eps)
)

# Pivot through-hole
pivot_hole_cutter_back = (
    cq.Workplane("XY")
    .workplane(offset=-blade_thick - 1.0)
    .circle(pivot_bore_rad)
    .extrude(blade_thick + 2.0)
)
back_blade_body = back_blade_body.cut(pivot_hole_cutter_back)

# Ground bevel on the back face (-Z) of the right blade
bevel_cutter_back = (
    cq.Workplane("XZ")
    .polyline([
        (-0.2, -0.35),
        (-8.0, -0.35),
        (-8.0, -blade_thick - 1.0),
        (+3.0, -blade_thick - 1.0),
        (+3.0, -blade_thick),
    ])
    .close()
    .extrude(100.0, both=True)
    .translate((0.15, -48.0, 0))
    .rotate((0, 0, 0), (0, 0, 1), 1.8)
)
back_blade_body = back_blade_body.cut(bevel_cutter_back)

# --- Thumb Loop Handle ---
# Outer profile of the angled thumb loop
thumb_outer_pts = [
    (-1.5, 14.0),
    (-7.5, 14.0),
    (-13.0, 17.5),
    (-19.0, 22.0),
    (-25.0, 27.5),
    (-30.5, 34.0),
    (-33.5, 41.0),
    (-33.0, 48.0),
    (-29.0, 54.5),
    (-23.5, 57.0),
    (-18.0, 54.5),
    (-14.5, 48.0),
    (-12.0, 39.0),
    (-8.5, 30.0),
    (-4.5, 22.0),
]

# Inner thumb hole profile
thumb_inner_pts = [
    (-22.0, 34.0),
    (-17.5, 38.5),
    (-17.5, 44.5),
    (-21.5, 48.5),
    (-26.0, 47.0),
    (-27.0, 41.5),
    (-25.0, 35.5),
]

# Solid handle body
thumb_handle_solid = (
    cq.Workplane("XY")
    .workplane(offset=-handle_thick)
    .polyline(thumb_outer_pts)
    .close()
    .extrude(handle_thick)
)

# Thumb through-hole
thumb_hole_cutter = (
    cq.Workplane("XY")
    .workplane(offset=-handle_thick - 1.0)
    .polyline(thumb_inner_pts)
    .close()
    .extrude(handle_thick + 2.0)
)
thumb_handle = thumb_handle_solid.cut(thumb_hole_cutter)

# Recessed ergonomic grip channel visible on the front face of the thumb loop
recess_outer_back = [
    (-5.5, 23.0),
    (-9.5, 30.0),
    (-13.0, 38.0),
    (-16.0, 47.0),
    (-20.0, 52.5),
    (-24.5, 54.0),
    (-28.5, 51.5),
    (-31.5, 46.0),
    (-31.5, 40.5),
    (-29.0, 34.0),
    (-23.5, 28.5),
    (-18.0, 23.5),
    (-12.5, 19.5),
]
recess_inner_back = [
    (-22.0, 32.0),
    (-16.0, 38.0),
    (-16.0, 45.5),
    (-21.0, 50.5),
    (-27.0, 48.5),
    (-28.5, 42.0),
    (-26.0, 34.0),
]

recess_pocket_back = (
    cq.Workplane("XY")
    .workplane(offset=-recess_depth)
    .polyline(recess_outer_back)
    .close()
    .extrude(recess_depth + 0.1)
)
recess_island_back = (
    cq.Workplane("XY")
    .workplane(offset=-recess_depth)
    .polyline(recess_inner_back)
    .close()
    .extrude(recess_depth)
).cut(thumb_hole_cutter)

thumb_handle = thumb_handle.cut(recess_pocket_back).union(recess_island_back)

# Fillet handle outer contours
try:
    thumb_handle = thumb_handle.edges("|Z").fillet(0.8)
except Exception:
    pass

# Union blade and handle into back blade half
blade_back = back_blade_body.union(thumb_handle)

# ==============================================================================
# Final Assembly
# ==============================================================================

# Union all 3 components into a single unified scissor assembly
result = blade_front.union(blade_back).union(fastener)