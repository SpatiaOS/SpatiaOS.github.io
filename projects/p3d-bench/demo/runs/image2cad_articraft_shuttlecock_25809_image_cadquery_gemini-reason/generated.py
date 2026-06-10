import cadquery as cq
import math

# ==========================================
# Parameters
# ==========================================

# Cork (Base) Dimensions
cork_radius = 12.0
cork_length = 15.0

# Skirt (Feathers) Dimensions
skirt_base_radius = 13.0
skirt_top_radius = 33.0
skirt_height = 50.0
skirt_thickness = 1.0

# Pattern & Structural Details
num_segments = 16
rib_width = 1.2
rib_thickness = 1.5

# Calculated Values
cone_angle_rad = math.atan2(skirt_top_radius - skirt_base_radius, skirt_height)
cone_angle_deg = math.degrees(cone_angle_rad)
skirt_slant_length = math.sqrt((skirt_top_radius - skirt_base_radius)**2 + skirt_height**2)

# ==========================================
# Modeling
# ==========================================

# 1. Create the Cork (Base)
# Revolve a profile to create the hemispherical bottom and cylindrical top
cork_profile = (
    cq.Workplane("XZ")
    .moveTo(0, 0)
    .lineTo(cork_radius, 0)
    .lineTo(cork_radius, -6)
    .threePointArc((cork_radius * 0.7, -12.5), (0, -14))
    .lineTo(0, 0)
    .close()
)
cork = cork_profile.revolve(360, (0, 0, 0), (0, 1, 0)).val()


# 2. Create the Skirt Blank (Conical Shell)
# Revolve a slanted trapezoid to create the thin shell
skirt_profile = (
    cq.Workplane("XZ")
    .moveTo(skirt_base_radius, 0)
    .lineTo(skirt_top_radius, skirt_height)
    .lineTo(skirt_top_radius - skirt_thickness, skirt_height)
    .lineTo(skirt_base_radius - skirt_thickness, 0)
    .close()
)
skirt = skirt_profile.revolve(360, (0, 0, 0), (0, 1, 0)).val()


# 3. Define the Tangent Workplane for Cutouts
# Create a workplane that lies flat on the surface of the cone at angle 0
# Local X becomes Global Y, Local Y becomes slant direction, Local Z is normal pointing OUT
wp_tangent = (
    cq.Workplane("YZ")
    .transformed(offset=(skirt_base_radius, 0, 0), rotate=(cone_angle_deg, 0, 0))
)

# 4. Create the Cutting Tools for ONE Segment
# Row 1: Small circular holes near the base
pts_r1 = [(dx, 6) for dx in [-2, -1, 0, 1, 2]]
c1 = wp_tangent.pushPoints(pts_r1).circle(0.4).extrude(-5).val()

# Row 2: Slanted rectangular slots
slanted_cuts = None
for dx in [-3, -1.5, 0, 1.5, 3]:
    # Rotate each slot locally by -30 degrees
    slot = wp_tangent.center(dx, 16).transformed(rotate=(0, 0, -30)).rect(0.6, 3).extrude(-5).val()
    slanted_cuts = slot if slanted_cuts is None else slanted_cuts.fuse(slot)

# Row 3: Larger circular holes
pts_r3 = [(dx, 26) for dx in [-4, -2, 0, 2, 4]]
c3 = wp_tangent.pushPoints(pts_r3).circle(0.8).extrude(-5).val()

# Row 4: Vertical slots
pts_r4 = [(dx, 36) for dx in [-4.5, -1.5, 1.5, 4.5]]
c4 = wp_tangent.pushPoints(pts_r4).rect(1.0, 5).extrude(-5).val()

# Row 5: Vertical slots near the top
pts_r5 = [(dx, 46) for dx in [-5, -1.6, 1.6, 5]]
c5 = wp_tangent.pushPoints(pts_r5).rect(1.0, 5).extrude(-5).val()

# Combine all segment cuts into a single solid tool
segment_cutter_solid = c1.fuse(slanted_cuts).fuse(c3).fuse(c4).fuse(c5)

# 5. Create the Scallop Cutter for the top edge
# A cylinder placed horizontally at the top edge to cut a U-shaped notch
scallop_cutter_solid = (
    cq.Workplane("XZ")
    .transformed(offset=(skirt_top_radius, skirt_height, 0))
    .cylinder(height=20, radius=6)
    .val()
)

# 6. Create the Rib (Stem) Solid
# A thin rectangular extrusion along the cone surface, offset by half a segment angle
rib_solid = (
    wp_tangent.center(0, skirt_slant_length / 2)
    .rect(rib_width, skirt_slant_length)
    .extrude(rib_thickness)
    .val()
)
# Rotate it so it sits between the patterned segments
rib_solid = rib_solid.rotate((0, 0, 0), (0, 0, 1), 360 / num_segments / 2)


# 7. Apply Patterns and Ribs in a Polar Array
all_cutters = None
all_ribs = None

for i in range(num_segments):
    angle = i * 360 / num_segments
    
    # Rotate cutting tools
    rot_pattern = segment_cutter_solid.rotate((0, 0, 0), (0, 0, 1), angle)
    rot_scallop = scallop_cutter_solid.rotate((0, 0, 0), (0, 0, 1), angle)
    combined_cutter = rot_pattern.fuse(rot_scallop)
    
    all_cutters = combined_cutter if all_cutters is None else all_cutters.fuse(combined_cutter)
    
    # Rotate ribs
    rot_rib = rib_solid.rotate((0, 0, 0), (0, 0, 1), angle)
    all_ribs = rot_rib if all_ribs is None else all_ribs.fuse(rot_rib)

# Execute the boolean operations
skirt = skirt.cut(all_cutters)
skirt = skirt.fuse(all_ribs)


# 8. Add Horizontal Binding Rings
# Thin rings wrapping around the skirt to simulate structural strings
band_z_positions = [5, 20, 35]
all_bands = None

for z in band_z_positions:
    r = skirt_base_radius + (skirt_top_radius - skirt_base_radius) * (z / skirt_height)
    band = (
        cq.Workplane("XY")
        .transformed(offset=(0, 0, z))
        .circle(r + 0.6)
        .circle(r - 0.2)
        .extrude(0.8)
        .val()
    )
    all_bands = band if all_bands is None else all_bands.fuse(band)

skirt = skirt.fuse(all_bands)


# 9. Final Assembly
# Combine the cork base and the finished skirt
final_solid = cork.fuse(skirt)

# Wrap the final solid back into a Workplane object for standard output
result = cq.Workplane("XY").add(final_solid)