import cadquery as cq

# --- Parameters ---
# Overall dimensions
size = 120.0
thickness = 25.0
corner_radius = 5.0

# Frame features
flange_thk = 2.5
shroud_id = 114.0
shroud_od = 118.0
hole_dist = 105.0
hole_dia = 4.5

# Rotor features
num_blades = 7
hub_r = 20.0
hub_h = 20.0

# Blade loft profiles (Root, Mid, Tip)
root_r = hub_r
mid_r = 38.0
tip_r = 56.0

root_chord = 25.0
mid_chord = 35.0
tip_chord = 42.0

root_angle = 55.0  # Steep angle at root for air pressure
mid_angle = 35.0
tip_angle = 20.0   # Shallower angle at tip for airflow

mid_sweep = -8.0   # Backward sweep to reduce noise
tip_sweep = -20.0

blade_thk = 1.5

# --- 1. Base Flange Profile ---
# Create a generic square flange with central bore and mounting holes
flange_profile = (
    cq.Workplane("XY")
    .box(size, size, flange_thk)
    .edges("|Z").fillet(corner_radius)
    .faces(">Z").workplane()
    .circle(shroud_id / 2).cutThruAll()
    .faces(">Z").workplane()
    .rect(hole_dist, hole_dist, forConstruction=True)
    .vertices().circle(hole_dia / 2).cutThruAll()
)

# Position top and bottom flanges
top_flange = flange_profile.translate((0, 0, thickness / 2 - flange_thk / 2))
bottom_flange = flange_profile.translate((0, 0, -thickness / 2 + flange_thk / 2))

# --- 2. Frame Details (Recessed Corners) ---
# Create a tool to cut shallow triangular recesses into the flange corners
recess_depth = 1.0
# Both box and cylinder are centered at Z=0 to ensure proper boolean cut
recess_box = cq.Workplane("XY").box(size - 6, size - 6, recess_depth).edges("|Z").fillet(corner_radius - 1)
recess_cyl = cq.Workplane("XY").cylinder(recess_depth, shroud_od / 2 + 1.5)
recess_tool = recess_box.cut(recess_cyl)

# Apply recesses to the outer faces
top_flange = top_flange.cut(recess_tool.translate((0, 0, thickness / 2 - recess_depth / 2)))
bottom_flange = bottom_flange.cut(recess_tool.translate((0, 0, -thickness / 2 + recess_depth / 2)))

# --- 3. Shroud and Corner Posts ---
shroud_height = thickness - 2 * flange_thk

# Central cylindrical wall
shroud = (
    cq.Workplane("XY", origin=(0, 0, -shroud_height / 2))
    .circle(shroud_od / 2).circle(shroud_id / 2)
    .extrude(shroud_height)
)

# Small cylindrical pillars at the extreme corners
post_offset = size / 2 - corner_radius / 2 - 1.5
posts = (
    cq.Workplane("XY", origin=(0, 0, -shroud_height / 2))
    .rect(post_offset * 2, post_offset * 2, forConstruction=True)
    .vertices().circle(2.5)
    .extrude(shroud_height)
)

# --- 4. Stator Struts ---
# Cross struts on the back to hold the motor hub
stator_w = 4.0
stator_d = 3.0
stators = (
    cq.Workplane("XY", origin=(0, 0, -thickness / 2))
    .rect(shroud_od, stator_w).extrude(stator_d)
    .union(
        cq.Workplane("XY", origin=(0, 0, -thickness / 2))
        .rect(stator_w, shroud_od).extrude(stator_d)
    )
)

# Combine all stationary frame components
frame = top_flange.union(bottom_flange).union(shroud).union(posts).union(stators)

# Cut small alignment notches into the outer edges
notch_x = cq.Workplane("XY").pushPoints([(size/2, 0), (-size/2, 0)]).box(3, 6, thickness + 2)
notch_y = cq.Workplane("XY").pushPoints([(0, size/2), (0, -size/2)]).box(6, 3, thickness + 2)
frame = frame.cut(notch_x).cut(notch_y)

# --- 5. Rotor Hub ---
# Central dome with a slight sticker recess on top
hub = (
    cq.Workplane("XY", origin=(0, 0, -hub_h / 2))
    .circle(hub_r).extrude(hub_h)
    .edges(">Z").fillet(3)
    .faces(">Z").workplane()
    .circle(hub_r - 4).cutBlind(-0.5)
)

# --- 6. Swept Fan Blades ---
# Define profiles on the YZ plane (extending along X axis)
# Global X = Local Z (Normal), Global Y = Local X, Global Z = Local Y

# Root profile
w1 = cq.Workplane("YZ").workplane(offset=root_r).transformed(rotate=(0, 0, root_angle)).rect(root_chord, blade_thk).val()

# Mid profile (swept backward)
w2 = cq.Workplane("YZ").workplane(offset=mid_r).transformed(offset=(mid_sweep, 0, 0), rotate=(0, 0, mid_angle)).rect(mid_chord, blade_thk).val()

# Tip profile (swept further backward)
w3 = cq.Workplane("YZ").workplane(offset=tip_r).transformed(offset=(tip_sweep, 0, 0), rotate=(0, 0, tip_angle)).rect(tip_chord, blade_thk).val()

# Loft the profiles into a single blade solid using cq.Solid.makeLoft to avoid stack issues
blade_solid = cq.Solid.makeLoft([w1, w2, w3])
blade = cq.Workplane("XY").add(blade_solid)

# Polar array the blades around the hub
rotor = hub
for i in range(num_blades):
    rotated_blade = blade.rotate((0, 0, 0), (0, 0, 1), i * (360.0 / num_blades))
    rotor = rotor.union(rotated_blade)

# --- 7. Final Assembly ---
result = frame.union(rotor)