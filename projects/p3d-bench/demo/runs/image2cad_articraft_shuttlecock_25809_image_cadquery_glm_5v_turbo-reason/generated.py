import cadquery as cq
import math

# =============================================================================
# PARAMETERS - Vegetable Steamer Basket / Colander
# =============================================================================

# Overall dimensions (mm)
total_height = 130.0           # Total height of the basket
top_major_diameter = 160.0     # Outer diameter at wide end (tip of petals)
top_minor_diameter = 125.0     # Inner diameter at base of scallops
bottom_diameter = 75.0         # Diameter at narrow end
wall_thickness = 2.5           # Material thickness

# Scalloped rim configuration
num_scallops = 10              # Number of petal-shaped scallops
scallop_depth = 17.0           # Radial depth of each scallop

# Bottom closure details
flange_outer_dia = 85.0        # Flange outer diameter
flange_height = 8.0            # Flange axial height
dome_radius = 38.0             # Radius of hemispherical end cap

# Perforation pattern parameters
rect_slot_length = 15.0        # Length of rectangular drain slots
rect_slot_width = 2.8          # Width of rectangular slots
circular_hole_dia = 7.5        # Diameter of round holes
diagonal_slit_length = 12.0    # Length of diagonal slits
slit_width = 1.8               # Width of diagonal slits

# Pattern distribution
num_circumferential_units = 16 # Repeat units around circumference
num_axial_rows = 10            # Rows from top to bottom
pattern_start_offset = 12.0    # Distance from top edge to start of holes
pattern_end_offset = 20.0      # Distance from bottom flange to end of holes


def create_scalloped_profile():
    """
    Creates the 2D profile for the scalloped (petal-shaped) opening.
    Returns a list of points defining the wavy circular edge.
    """
    points = []
    radius_major = top_major_diameter / 2
    radius_minor = top_minor_diameter / 2
    
    segments_per_scallop = 24
    total_segments = num_scallops * segments_per_scallop
    
    for i in range(total_segments + 1):
        angle = (i / total_segments) * 360
        
        phase = (i / segments_per_scallop) * 2 * math.pi
        r_variation = (radius_major - radius_minor) * (0.5 + 0.5 * math.cos(phase))
        r = radius_minor + r_variation
        
        x = r * math.cos(math.radians(angle))
        y = r * math.sin(math.radians(angle))
        points.append((x, y))
    
    return points


def create_basket_body():
    """
    Creates the main conical frustum body with wall thickness.
    Uses loft between two circles to create the taper.
    """
    r_top = top_minor_diameter / 2
    r_bottom = bottom_diameter / 2
    cone_h = total_height - flange_height
    
    # Create solid conical frustum
    body = (
        cq.Workplane("XY")
        .circle(r_top)
        .workplane(offset=cone_h)
        .circle(r_bottom)
        .loft(combine=True)
    )
    
    # Shell it to create hollow basket (open at top Z=0)
    body = body.shell(wall_thickness, kind="arc")
    
    return body


def add_scalloped_rim(body):
    """
    Cuts the scalloped pattern into the top of the basket.
    """
    profile_points = create_scalloped_profile()
    
    cutter = (
        cq.Workplane("XY")
        .polyline(profile_points)
        .close()
        .extrude(-total_height * 1.5)
    )
    
    result = body.cut(cutter)
    return result


def add_bottom_closure(body):
    """
    Adds the reinforced flange and domed end cap at the narrow end.
    """
    z_base = total_height - flange_height
    
    # Create flange (annular ring)
    flange = (
        cq.Workplane("XY")
        .workplane(offset=z_base)
        .circle(flange_outer_dia / 2)
        .circle(bottom_diameter / 2)
        .extrude(flange_height)
    )
    
    # Create dome cap (hemisphere)
    dome_center_z = z_base + flange_height
    dome = (
        cq.Workplane("XY")
        .workplane(offset=dome_center_z)
        .sphere(dome_radius)
    )
    
    result = body.union(flange).union(dome)
    return result


def add_perforations(body):
    """
    Adds perforation pattern to the basket surface.
    Includes rectangular slots, circular holes, and diagonal slits.
    """
    pattern_height = total_height - flange_height - pattern_start_offset - pattern_end_offset
    result = body
    
    r_top = top_minor_diameter / 2
    r_bottom = bottom_diameter / 2
    cone_height = total_height - flange_height
    
    for row in range(num_axial_rows):
        t = (row + 0.5) / num_axial_rows
        z_pos = pattern_start_offset + t * pattern_height
        
        local_radius = r_top - (r_top - r_bottom) * (z_pos / cone_height)
        circumference = 2 * math.pi * local_radius
        base_count = max(4, int(circumference / (rect_slot_length * 1.8)))
        
        for i in range(base_count):
            angle = (i / base_count) * 360
            
            x = local_radius * math.cos(math.radians(angle))
            y = local_radius * math.sin(math.radians(angle))
            
            feature_type = (row + i) % 3
            
            if feature_type == 0:
                feature = (
                    cq.Workplane("XY")
                    .workplane(offset=z_pos, origin=(x, y, 0))
                    .transformed(rotate=(0, 0, angle + 90))
                    .rect(rect_slot_length, rect_slot_width)
                    .extrude(-wall_thickness * 3, combine=False)
                )
            elif feature_type == 1:
                feature = (
                    cq.Workplane("XY")
                    .workplane(offset=z_pos, origin=(x, y, 0))
                    .circle(circular_hole_dia / 2)
                    .extrude(-wall_thickness * 3, combine=False)
                )
            else:
                feature = (
                    cq.Workplane("XY")
                    .workplane(offset=z_pos, origin=(x, y, 0))
                    .transformed(rotate=(0, 0, angle + 45))
                    .rect(diagonal_slit_length, slit_width)
                    .extrude(-wall_thickness * 3, combine=False)
                )
            
            result = result.cut(feature)
    
    return result


def add_structural_ribs(body):
    """
    Adds longitudinal reinforcement ribs running from top to bottom.
    Fixed version using proper lofting between rectangular profiles.
    """
    num_ribs = num_scallops
    result = body
    
    r_top = top_major_diameter / 2
    r_bottom = bottom_diameter / 2
    rib_width = 4.0
    rib_protrusion = 1.5
    cone_h = total_height - flange_height
    
    for i in range(num_ribs):
        angle = (i / num_ribs) * 360
        angle_rad = math.radians(angle)
        
        # Calculate positions along the conical surface
        x_top = r_top * math.cos(angle_rad)
        y_top = r_top * math.sin(angle_rad)
        
        x_bot = r_bottom * math.cos(angle_rad)
        y_bot = r_bottom * math.sin(angle_rad)
        
        # Create rib by lofting between two rectangular profiles
        # Each profile is centered on the surface and oriented radially outward
        try:
            rib = (
                cq.Workplane("XY")
                .workplane(origin=(x_top, y_top, 0))
                .transformed(rotate=(0, 0, angle + 90))
                .rect(rib_width, rib_protrusion)
                # Move to bottom position maintaining orientation
                .workplane(
                    offset=cone_h,
                    origin=(x_bot - x_top, y_bot - y_top, cone_h)
                )
                .rect(rib_width, rib_protrusion)
                .loft(combine=True, ruled=True)
            )
            result = result.union(rib)
        except Exception as e:
            # Fallback: create rib as simple extrusion if loft fails
            mid_x = (x_top + x_bot) / 2
            mid_y = (y_top + y_bot) / 2
            mid_z = cone_h / 2
            
            rib = (
                cq.Workplane("XY")
                .workplane(origin=(mid_x, mid_y, mid_z))
                .transformed(rotate=(0, 0, angle + 90), offset=(0, r_top/2, 0))
                .box(rib_width, rib_protrusion, cone_h * 0.9, centered=(True, True, True))
            )
            result = result.union(rib)
    
    return result


# =============================================================================
# MAIN MODEL CONSTRUCTION
# =============================================================================

# Step 1: Create the main conical body (hollow shell)
basket = create_basket_body()

# Step 2: Apply the scalloped cut to the top opening
basket = add_scalloped_rim(basket)

# Step 3: Add the bottom flange and dome closure
basket = add_bottom_closure(basket)

# Step 4: Add the perforation pattern (drainage holes)
basket = add_perforations(basket)

# Step 5: Add structural ribs for stiffness
basket = add_structural_ribs(basket)

# Final result
result = basket
result