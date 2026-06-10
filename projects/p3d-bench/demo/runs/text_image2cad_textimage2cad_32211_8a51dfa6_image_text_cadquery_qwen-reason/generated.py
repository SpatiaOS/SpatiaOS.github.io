import cadquery as cq
import math

# Parameters
# Gear dimensions
large_gear_outer_radius = 75.0
large_gear_bore_radius = 33.87
large_gear_face_width = 40.0
large_gear_cone_angle_deg = 45.0  # Pitch angle
large_gear_num_teeth = 32
large_gear_tooth_height = 12.0
large_gear_tooth_width = 8.0

small_gear_outer_radius = 45.0
small_gear_bore_radius = 14.4
small_gear_face_width = 30.0
small_gear_cone_angle_deg = 45.0 # Approximate for visual meshing
small_gear_num_teeth = 16
small_gear_tooth_height = 8.0
small_gear_tooth_width = 5.0

# Shaft dimensions
large_shaft_radius = 33.87
large_shaft_len_1 = 175.0
large_shaft_len_2 = 100.0
small_shaft_radius = 14.4
small_shaft_len = 120.0

# Assembly positions (Spider layout: Right gear meshes with Top and Bottom gears)
# Right Gear (Large) on X-axis
right_gear_pos = (60.0, 0.0, 0.0)
# Top Gear (Small) on Z-axis (Upper Left in view)
top_gear_pos = (-40.0, 0.0, 60.0)
# Bottom Gear (Large) on Z-axis (Center/Bottom in view)
bottom_gear_pos = (0.0, 0.0, -60.0)

def make_bevel_gear(outer_radius, bore_radius, face_width, cone_angle_deg, num_teeth, tooth_height, tooth_width):
    """
    Creates an approximate bevel gear.
    """
    cone_angle_rad = math.radians(cone_angle_deg)
    
    # Calculate cone height based on face width and angle
    # face_width is along the slant. height = face_width * cos(angle)
    # But for simplicity, we'll define the frustum height directly.
    # Let's assume the gear body is a frustum.
    # Inner radius (at small end) approx bore_radius + hub thickness
    # Outer radius (at large end) = outer_radius
    
    # Base Frustum (Hub + Cone body)
    # We create a cone and cut the bore.
    # To make it look like a gear, we add teeth on the outer surface.
    
    # 1. Create the base cone/frustum
    # Using a loft from inner circle to outer circle
    # Height of the gear body
    body_height = face_width * math.cos(cone_angle_rad)
    
    # Inner radius of the frustum (at the back of the teeth)
    # This is roughly bore_radius + some hub material
    inner_frustum_radius = bore_radius + 10.0 
    
    # Create the main body
    # We use a cone for the toothed part
    # r1 (top), r2 (bottom), h
    # Let's orient it along Z for now
    # Top (small end) radius: inner_frustum_radius
    # Bottom (large end) radius: outer_radius
    # Height: body_height
    
    # Actually, standard bevel gear:
    # Apex at origin.
    # Gear extends from r1 to r2 along the cone surface.
    # Let's simplify: Create a cylinder, taper it, add teeth.
    
    # Base solid: Frustum
    base_solid = cq.Solid.makeCone(inner_frustum_radius, outer_radius, body_height)
    
    # 2. Create Teeth
    # Create a single tooth profile
    # A wedge shape
    tooth_depth = face_width * 0.8 # Teeth don't cover full face width usually, but for simplicity
    
    # Create a tooth on the XY plane, then rotate it to the cone surface
    # Tooth is a box
    tooth_profile = (
        cq.Workplane("XY")
        .rect(tooth_width, tooth_height)
        .extrude(tooth_depth)
    )
    
    # Move tooth to the outer radius and tilt it to match cone angle
    # The tooth should be on the surface of the cone.
    # Cone surface angle is cone_angle_deg from vertical (Z).
    # So we rotate the tooth by (90 - cone_angle_deg) around Y?
    # No, if cone is along Z, surface is at angle.
    # Let's place the tooth at the outer edge.
    
    # Transform tooth to be on the "side" of the frustum
    # Move to X = outer_radius
    # Rotate around Y by (90 - cone_angle_deg) so it points "out" along the cone surface?
    # Actually, bevel gear teeth point towards the apex.
    # So the tooth should be angled.
    
    # Simplified tooth placement:
    # Just array boxes around the outside.
    
    gear_with_teeth = base_solid
    
    # Create a workplane for the tooth
    # We place the tooth at the outer radius, angled.
    # Position: (outer_radius, 0, body_height/2) ?
    # Let's just create a ring of teeth.
    
    # Tooth solid
    tooth_solid = (
        cq.Workplane("YZ") # Profile in YZ
        .rect(tooth_width, tooth_height) # Width (tangential), Height (radial)
        .extrude(face_width * 0.9) # Depth (axial along cone)
    )
    
    # This creates a block. We need to rotate it to form a wedge.
    # Let's use polarArray on a workplane.
    
    # Better approach for teeth:
    # Create a wedge for one tooth.
    # Angle per tooth = 360 / num_teeth
    tooth_angle = 360.0 / num_teeth
    
    # Create a single tooth wedge
    # Use a polygon or rotated box
    # Let's use a box and rotate it to approximate a wedge
    single_tooth = (
        cq.Workplane("XY")
        .box(tooth_width, tooth_height * 2, face_width) # Tangential, Radial, Axial
        .translate((0, outer_radius - tooth_height/2, body_height/2))
    )
    
    # This is getting complex to get perfect bevel teeth without a library.
    # I will use a simpler "cog" approximation:
    # Create a cylinder, add rectangular teeth around the circumference.
    # Then taper the whole thing? No, boolean operations on tapered solids are hard.
    
    # Revised Strategy:
    # 1. Create the cone body.
    # 2. Create a "tooth" that is a wedge.
    # 3. Polar array the wedge.
    # 4. Union.
    
    # Wedge tooth
    # Base width (outer), Top width (inner - smaller)
    # Height (radial)
    # Depth (axial)
    
    # Let's just use the `gear` module if available? No, standard CadQuery.
    # I'll stick to the "box on cone" approximation.
    
    # Base
    base = cq.Workplane("XY").circle(outer_radius).workplane(offset=body_height).circle(inner_frustum_radius).loft()
    
    # Teeth
    # Create one tooth
    # A wedge pointing to center
    tooth_h = tooth_height
    tooth_w_outer = tooth_width
    tooth_w_inner = tooth_width * 0.6 # Tapered
    tooth_d = face_width * 0.8
    
    # Create a wedge using a polygon extrusion?
    # Polygon in XZ plane (Radial-Axial)
    # Points: (inner_r, 0), (outer_r, 0), (outer_r, tooth_h), (inner_r, tooth_h * 0.5)
    # No, teeth are on the surface.
    
    # Simplest visual approximation:
    # Array of boxes on the surface.
    teeth_list = []
    for i in range(num_teeth):
        angle = i * (360.0 / num_teeth)
        # Create a box
        # Position it on the surface
        # Surface is at radius R(z).
        # Let's place it at the middle of the face width.
        
        # Box dimensions
        # Tangential width
        w = tooth_width
        # Radial height
        h = tooth_height
        # Axial depth
        d = face_width * 0.5
        
        # Position
        # At angle `angle`, radius `outer_radius - h/2`, height `body_height/2`
        # But the surface is slanted.
        
        # Let's just place a box at the outer edge, tilted.
        tooth = (
            cq.Workplane("XY")
            .box(w, h, d)
            .translate((0, outer_radius - h/2, body_height/2))
            .rotate((0,0,0), (0,1,0), -cone_angle_deg) # Tilt to match cone
            .rotate((0,0,0), (0,0,1), angle) # Rotate around Z
        )
        teeth_list.append(tooth)
        
    # Union teeth
    teeth_solid = teeth_list[0]
    for t in teeth_list[1:]:
        teeth_solid = teeth_solid.union(t)
        
    # Combine base and teeth
    # The base is a frustum. The teeth are boxes.
    # We need to union them.
    # Note: `base` is a Solid, `teeth_solid` is a Workplane/Solid.
    
    result_gear = base.union(teeth_solid)
    
    # Cut the bore
    # Bore is a cylinder through the center
    # Length needs to be sufficient
    bore_len = body_height + 50.0
    bore = (
        cq.Workplane("XY")
        .circle(bore_radius)
        .extrude(bore_len)
        .translate((0, 0, -20)) # Center it
    )
    
    final_gear = result_gear.cut(bore)
    
    return final_gear

# --- Create Parts ---

# 1. Large Gear (Used for Right and Center)
# Note: The text says they are identical parts (mirror pair).
# We create one base geometry.
large_gear_body = make_bevel_gear(
    outer_radius=large_gear_outer_radius,
    bore_radius=large_gear_bore_radius,
    face_width=large_gear_face_width,
    cone_angle_deg=large_gear_cone_angle_deg,
    num_teeth=large_gear_num_teeth,
    tooth_height=large_gear_tooth_height,
    tooth_width=large_gear_tooth_width
)

# 2. Small Gear (Used for Top/Left)
small_gear_body = make_bevel_gear(
    outer_radius=small_gear_outer_radius,
    bore_radius=small_gear_bore_radius,
    face_width=small_gear_face_width,
    cone_angle_deg=small_gear_cone_angle_deg,
    num_teeth=small_gear_num_teeth,
    tooth_height=small_gear_tooth_height,
    tooth_width=small_gear_tooth_width
)

# 3. Shafts
# Shaft 1 (Long, for Right Gear)
shaft_1 = (
    cq.Workplane("XY")
    .circle(large_shaft_radius)
    .extrude(large_shaft_len_1)
)

# Shaft 2 (Short, for Center Gear)
shaft_2 = (
    cq.Workplane("XY")
    .circle(large_shaft_radius)
    .extrude(large_shaft_len_2)
)

# Shaft 3 (Medium, for Small Gear)
shaft_3 = (
    cq.Workplane("XY")
    .circle(small_shaft_radius)
    .extrude(small_shaft_len)
)

# --- Assemble ---

# Assembly 1: Right Gear (Large) + Shaft 1
# Position: Right side. Axis X.
# Gear body at positive X. Shaft points negative X (Left).
# The gear body created is along Z. We need to rotate it to X.
# Rotate -90 deg around Y to align Z to X.
right_gear_asm = (
    large_gear_body
    .rotate((0,0,0), (0,1,0), -90)
    .translate(right_gear_pos)
)

# Shaft 1 needs to align with gear bore (now X axis).
# Shaft is along Z. Rotate -90 around Y.
# Position: The shaft should protrude from the "back" of the gear.
# In the image, the right gear shaft points Left (-X).
# The gear body is at X=60.
# So shaft should be at X < 60.
# Shaft length 175.
# Place shaft such that it overlaps the bore.
shaft_1_aligned = (
    shaft_1
    .rotate((0,0,0), (0,1,0), -90)
    .translate((right_gear_pos[0] - large_shaft_len_1 * 0.4, 0, 0)) # Overlap
)
# Union
right_assembly = right_gear_asm.union(shaft_1_aligned)


# Assembly 2: Center Gear (Large) + Shaft 2
# Position: Bottom Center. Axis Z (Vertical).
# Gear body at negative Z (below origin). Shaft points negative Z (Down).
# The gear body is along Z (positive).
# We need to flip it or move it.
# Let's place the gear body such that its "back" is at Z=0 and it extends to -Z.
# Or just translate.
# Image: Center gear is at bottom. Shaft points down.
# So Gear is at Z < 0. Shaft extends further down.
# Wait, "protruding axially from its hub".
# If shaft points down, and gear is above it...
# Let's assume Gear is at Z=-60. Shaft extends from Z=-60 to Z=-160.
# Gear body (created along +Z) needs to be flipped?
# No, bevel gear is symmetric-ish.
# Let's just place it.
center_gear_asm = (
    large_gear_body
    .translate((0, 0, -large_gear_face_width)) # Move down so "front" is near origin
    .translate((0, 0, -60)) # Move to position
)
# Actually, let's just rotate 180 around X to point down?
# If I rotate 180 around X, Z becomes -Z.
center_gear_asm = (
    large_gear_body
    .rotate((0,0,0), (1,0,0), 180)
    .translate(bottom_gear_pos)
)

# Shaft 2 (Points Down, -Z)
# Shaft is along +Z.
# We need it to point -Z. Rotate 180 around X.
# Position: Overlap with gear.
shaft_2_aligned = (
    shaft_2
    .rotate((0,0,0), (1,0,0), 180)
    .translate((0, 0, bottom_gear_pos[2] + large_shaft_len_2 * 0.3))
)
center_assembly = center_gear_asm.union(shaft_2_aligned)


# Assembly 3: Top Gear (Small) + Shaft 3
# Position: Upper Left. Axis Z (Vertical).
# Gear body at positive Z. Shaft points positive Z (Up).
# This matches the created geometry (along +Z).
top_gear_asm = (
    small_gear_body
    .translate(top_gear_pos)
)

# Shaft 3 (Points Up, +Z)
# Shaft is along +Z.
# Position: Overlap with gear (protruding from top).
shaft_3_aligned = (
    shaft_3
    .translate((0, 0, top_gear_pos[2] + small_gear_face_width * 0.5))
)
top_assembly = top_gear_asm.union(shaft_3_aligned)

# --- Final Result ---
# Combine all assemblies
result = right_assembly.union(center_assembly).union(top_assembly)

# Show/Export
# result.show()