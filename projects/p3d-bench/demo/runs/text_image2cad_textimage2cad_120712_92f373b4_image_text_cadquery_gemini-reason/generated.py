import cadquery as cq
import math

# ==========================================
# Parameters
# ==========================================

# Base Cover
bc_rx = 303.9 / 2
bc_ry = 159.5 / 2
bc_h = 72.0

# Cover Plate (Middle Ring)
cp_rx = 241.82 / 2
cp_ry = 126.86 / 2
cp_h = 6.0

# Housing Cover (Top Dome)
hc_rx = 227.4 / 2
hc_ry = 119.7 / 2
hc_h = 50.0

# ==========================================
# Helper Functions
# ==========================================

def make_truncated_ellipsoid(rx_bottom, ry_bottom, rx_top, height, num_slices=20):
    """Creates a truncated ellipsoid dome by lofting multiple elliptical profiles."""
    # Calculate the full Z-radius (C) of the ellipsoid based on the truncation
    C = height / math.sqrt(1 - (rx_top / rx_bottom)**2)
    
    wp = cq.Workplane("XY")
    for i in range(num_slices + 1):
        z = height * (i / num_slices)
        val = max(0, 1 - (z / C)**2)
        r_x = rx_bottom * math.sqrt(val)
        r_y = ry_bottom * math.sqrt(val)
        
        offset = height / num_slices if i > 0 else 0
        wp = wp.workplane(offset=offset).ellipse(r_x, r_y)
        
    return wp.loft()

def make_half_ellipsoid(rx, ry, height, num_slices=20):
    """Creates a half ellipsoid dome by lofting multiple elliptical profiles."""
    wp = cq.Workplane("XY")
    for i in range(num_slices + 1):
        z = height * (i / num_slices)
        if i == num_slices:
            # Use a tiny ellipse at the tip to avoid degenerate geometry issues in OpenCASCADE
            r_x, r_y = 0.01, 0.01
        else:
            val = max(0, 1 - (z / height)**2)
            r_x = rx * math.sqrt(val)
            r_y = ry * math.sqrt(val)
            
        offset = height / num_slices if i > 0 else 0
        wp = wp.workplane(offset=offset).ellipse(r_x, r_y)
        
    return wp.loft()

# ==========================================
# 1. Base Cover
# ==========================================
# Generate the lower truncated dome
base_cover = make_truncated_ellipsoid(bc_rx, bc_ry, cp_rx, bc_h, num_slices=20)

# Add small circular boss on the top deck (internal locating feature)
boss = cq.Workplane("XY").workplane(offset=bc_h).circle(6.0).extrude(8.0)
base_cover = base_cover.union(boss)

# ==========================================
# 2. Cover Plate
# ==========================================
# Modeled as an extruded thin oval disc, sitting flush on the base cover
cover_plate = (
    cq.Workplane("XY").workplane(offset=bc_h)
    .ellipse(cp_rx, cp_ry)
    .extrude(cp_h)
)

# ==========================================
# 3. Housing Cover
# ==========================================
# Create a half-ellipsoid for the top dome
housing_cover = make_half_ellipsoid(hc_rx, hc_ry, hc_h, num_slices=20)

# Translate to sit on top of the cover plate (creates the stepped seam)
housing_cover = housing_cover.translate((0, 0, bc_h + cp_h))

# Create the oval recessed panel on the top surface
recess_depth = 4.0
recess_cut = (
    cq.Workplane("XY").workplane(offset=bc_h + cp_h + hc_h + 1.0)
    .ellipse(40, 20)
    .extrude(-(recess_depth + 1.0))
)
housing_cover = housing_cover.cut(recess_cut)

# Add embossed relief symbols (dots and cross pattern) inside the flat recess
button_z = bc_h + cp_h + hc_h - recess_depth
dots_wp = cq.Workplane("XY").workplane(offset=button_z)

# 5 small circular-edge dot features (e.g., battery/status indicator)
dot_pts = [(i*6 - 12, -8) for i in range(5)]
dots = dots_wp.pushPoints(dot_pts).circle(1.0).extrude(0.5)

# Cross pattern of relief symbols (e.g., media controls)
cross_pts = [(0, 4), (0, 12), (-4, 8), (4, 8), (0, 8)]
cross = dots_wp.pushPoints(cross_pts).circle(1.5).extrude(0.5)

housing_cover = housing_cover.union(dots).union(cross)

# ==========================================
# Assembly
# ==========================================
# Combine all parts into a single unified model
result = base_cover.union(cover_plate).union(housing_cover)