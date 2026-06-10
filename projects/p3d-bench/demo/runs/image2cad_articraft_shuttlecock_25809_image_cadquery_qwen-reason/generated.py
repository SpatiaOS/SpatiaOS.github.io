import cadquery as cq
import math

# Parameters
# Geometry
side_width = 60.0       # Width of one hexagonal face
drum_length = 200.0     # Total length of the drum
sheet_thickness = 2.0   # Thickness of the sheet metal
rib_width = 4.0         # Width of the longitudinal ribs
rib_height = 3.0        # Height of the longitudinal ribs (sticking out)
ring_thickness = 4.0    # Thickness of circumferential rings (along Z axis)
ring_radial_height = 6.0 # Radial thickness of circumferential rings

# Calculated dimensions
# For a regular hexagon with side 's':
apothem = side_width * math.sqrt(3) / 2
circumradius = side_width

# 1. Create the base panel (one face of the hexagon)
# Panel is in YZ plane, centered at Y=0, Z=0.
# Translated to X = apothem so it forms one face of the hexagon.
base_panel = (
    cq.Workplane("YZ")
    .rect(side_width, drum_length)
    .extrude(sheet_thickness)
    .translate((apothem, 0, 0))
)

# 2. Add perforations (holes) to the panel
# We work on the outer face (>X)
perforated_panel = base_panel

# Zone 1: Near open end (Z < -50) - Longitudinal slots (vertical in YZ view)
# rarray(y_spacing, z_spacing, y_count, z_count)
perforated_panel = (
    perforated_panel
    .faces(">X")
    .workplane()
    .rarray(10, 12, 5, 4, center=(0, -75))
    .rect(2, 8) # Width 2 (Y), Height 8 (Z)
    .cutThruAll()
)

# Zone 2: Middle-Left (Z -50 to 0) - Circular holes
perforated_panel = (
    perforated_panel
    .faces(">X")
    .workplane()
    .rarray(10, 12, 5, 4, center=(0, -25))
    .circle(2.5)
    .cutThruAll()
)

# Zone 3: Middle-Right (Z 0 to 50) - Circumferential slots (horizontal in YZ view)
perforated_panel = (
    perforated_panel
    .faces(">X")
    .workplane()
    .rarray(10, 12, 5, 4, center=(0, 25))
    .rect(8, 2) # Width 8 (Y), Height 2 (Z)
    .cutThruAll()
)

# Zone 4: Near domed end (Z > 50) - Dense vertical slots
perforated_panel = (
    perforated_panel
    .faces(">X")
    .workplane()
    .rarray(8, 10, 6, 4, center=(0, 75))
    .rect(2, 6)
    .cutThruAll()
)

# 3. Add Longitudinal Ribs to the panel edges
# Ribs are placed at the edges of the panel (Y = +/- side_width/2)
# They extend radially outward (+X)

# Right edge rib (Y = side_width/2)
rib_right = (
    cq.Workplane("YZ")
    .rect(rib_width, drum_length)
    .extrude(sheet_thickness + rib_height)
    .translate((apothem, side_width/2, 0))
)

# Left edge rib (Y = -side_width/2)
rib_left = (
    cq.Workplane("YZ")
    .rect(rib_width, drum_length)
    .extrude(sheet_thickness + rib_height)
    .translate((apothem, -side_width/2, 0))
)

# Union ribs with panel
panel_with_ribs = perforated_panel.union(rib_right).union(rib_left)

# 4. Assemble the hexagonal tube
# Rotate the panel 6 times around the Z axis (drum axis)
tube = panel_with_ribs
for i in range(1, 6):
    angle = i * 60
    rotated_panel = panel_with_ribs.rotate((0, 0, 0), (0, 0, 1), angle)
    tube = tube.union(rotated_panel)

# 5. Add Circumferential Rings (Hexagonal bands)
# These rings sit on top of the longitudinal ribs.
ring_inner_radius = circumradius + rib_height + 1
ring_outer_radius = ring_inner_radius + ring_radial_height

def create_hex_ring(z_pos):
    # Create a hexagonal ring profile in XY plane and extrude along Z
    outer_hex = cq.Workplane("XY").polygon(6, ring_outer_radius).extrude(ring_thickness)
    inner_hex = cq.Workplane("XY").polygon(6, ring_inner_radius).extrude(ring_thickness + 1) # Slightly taller to ensure cut
    ring = outer_hex.cut(inner_hex)
    return ring.translate((0, 0, z_pos))

# Place rings at intervals along the drum
ring1 = create_hex_ring(-60)
ring2 = create_hex_ring(0)
ring3 = create_hex_ring(60)
ring4 = create_hex_ring(90) # Near the dome

tube_with_rings = tube.union(ring1).union(ring2).union(ring3).union(ring4)

# 6. Create the Domed End Cap
# The cap covers the end at Z = drum_length/2 = 100.
cap_radius = ring_outer_radius + 2

# Create a dome profile in XZ plane
# Profile: From (0,0) to (R,0) then arc to (0,R) then close to (0,0)
# This creates a quarter circle in the first quadrant.
cap_profile = (
    cq.Workplane("XZ")
    .moveTo(0, 0)
    .lineTo(cap_radius, 0)
    # Arc from (R,0) to (0,R) passing through (R/sqrt(2), R/sqrt(2))
    .threePointArc(
        (cap_radius * math.cos(math.pi/4), cap_radius * math.sin(math.pi/4)), 
        (0, cap_radius)
    )
    .close()
)

# Revolve around Z axis to create the hemisphere
# Axis is from (0,0,0) to (0,0,1) which is the global Z axis.
cap = cap_profile.revolve(axisStart=(0, 0, 0), axisEnd=(0, 0, 1))

# Position cap at the end of the drum
# The drum is centered at Z=0, so it goes from -100 to 100.
# The cap base is at Z=0 (in local coords), so translate to Z=100.
cap = cap.translate((0, 0, drum_length / 2))

# 7. Final Assembly
result = tube_with_rings.union(cap)