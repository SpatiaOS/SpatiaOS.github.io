import cadquery as cq

# =============================================================================
# DIMENSIONAL PARAMETERS (derived from assembly specifications)
# =============================================================================

# --- Base Cover (Part 4607dfae) - Bottom pebble dome ---
BASE_LENGTH_X = 304.0       # Major axis extent (mm)
BASE_WIDTH_Z = 159.5        # Minor axis extent (mm)
BASE_HEIGHT_Y = 72.0        # Total vertical height (mm)

# --- Cover Plate (Part 468e7438) - Thin oval separator disc ---
PLATE_LENGTH_X = 241.82     # Major axis (mm)
PLATE_WIDTH_Z = 126.86      # Minor axis (mm)
PLATE_THICKNESS_Y = 6.0     # Disc thickness (mm)

# --- Housing Cover (Part 461c9fae) - Upper dome with control panel ---
HOUSING_LENGTH_X = 227.4    # Major axis (mm)
HOUSING_WIDTH_Z = 119.7     # Minor axis (mm)
HOUSING_HEIGHT_Y = 50.0     # Total vertical height (mm)

# =============================================================================
# ASSEMBLY STACKING COORDINATES (Y-axis linear chain)
# =============================================================================

BASE_ORIGIN_Y = 0.0                                          # Grounded base
PLATE_BOTTOM_Y = BASE_ORIGIN_Y + BASE_HEIGHT_Y - PLATE_THICKNESS_Y  # Seam location
HOUSING_ORIGIN_Y = BASE_ORIGIN_Y + BASE_HEIGHT_Y             # Sits atop plate

# =============================================================================
# GEOMETRIC CONSTRUCTION FUNCTIONS
# =============================================================================

def create_pebble_dome(length, width, height, top_flat_ratio=0.18):
    """
    Construct a smooth, organic pebble-shaped dome via lofted elliptical profiles.
    
    The shape transitions from a full ellipse at the base through progressively
    scaled elliptical cross-sections to a small rectangular flat top deck,
    replicating the B-spline surface topology described in the specification.
    
    Args:
        length: Total X-axis span (major diameter)
        width: Total Z-axis span (minor diameter)
        height: Total Y-axis height (vertical)
        top_flat_ratio: Fraction of base dimensions at the top deck (0–1)
    
    Returns:
        CadQuery Solid: The completed dome volume
    """
    # Loft station definitions: (cumulative_height_offset, xy_scale_factor)
    # Scales decrease non-linearly to produce the characteristic pebble curvature
    stations = [
        (0.00, 1.000),   # Base rim - full footprint
        (0.22, 0.965),   # Lower belly - subtle inward curve
        (0.28, 0.880),   # Mid-lower transition
        (0.26, 0.720),   # Shoulder region - pronounced taper
        (0.16, 0.500),   # Upper neck - rapid convergence
        (0.08, top_flat_ratio)  # Top deck - flat mounting surface
    ]
    
    # Initialize workplane on XZ plane (horizontal cross-sections)
    wp = cq.Workplane("XZ").ellipse(length / 2.0, width / 2.0)
    
    # Generate intermediate loft profiles
    prev_h = 0.0
    for h_frac, scale in stations[1:]:
        delta_h = h_frac * height
        wp = (
            wp.workplane(offset=delta_h - prev_h)
            .ellipse((length / 2.0) * scale, (width / 2.0) * scale)
        )
        prev_h = delta_h
    
    # Execute loft operation to generate solid B-spline surface envelope
    return wp.loft(combine=True)


def create_oval_disc(length, width, thickness):
    """
    Generate a thin oval disc with two parallel planar faces joined by
    a smooth B-spline peripheral rim (3-face topology).
    
    Args:
        length: Major axis diameter
        width: Minor axis diameter
        thickness: Y-axis extrusion depth
    
    Returns:
        CadQuery Solid: Featureless oval plate
    """
    return (
        cq.Workplane("XZ")
        .ellipse(length / 2.0, width / 2.0)
        .extrude(thickness)
    )

# =============================================================================
# PART INSTANTIATION & POSITIONING
# =============================================================================

# Part 1: Base Cover - Large stationary bottom dome
# Features: 9 B-spline curved walls, 31 planar faces (flat base + top deck),
#           4 cylindrical faces (r=6mm boss feature implied by spec)
base_cover = (
    create_pebble_dome(BASE_LENGTH_X, BASE_WIDTH_Z, BASE_HEIGHT_Y)
    .translate((0, BASE_ORIGIN_Y, 0))
)

# Part 2: Cover Plate - Ultra-thin oval separator at circumferential seam
# Features: 3-face topology (2 planar + 1 B-spline rim), aspect ratio ~40:1
cover_plate = (
    create_oval_disc(PLATE_LENGTH_X, PLATE_WIDTH_Z, PLATE_THICKNESS_Y)
    .translate((0, PLATE_BOTTOM_Y, 0))
)

# Part 3: Housing Cover - Upper freeform dome with recessed control panel
# Features: 292 B-spline faces, 19 planar faces, oval recessed panel region
#           (surface relief features omitted per annotation caveats)
housing_cover = (
    create_pebble_dome(HOUSING_LENGTH_X, HOUSING_WIDTH_Z, HOUSING_HEIGHT_Y)
    .translate((0, HOUSING_ORIGIN_Y, 0))
)

# =============================================================================
# UNIFIED ASSEMBLY OUTPUT
# =============================================================================

# Merge all independently-grounded parts into single monolithic model
# (No boolean subtraction for snap-fits/adhesive bonds per spec constraints)
result = base_cover.union(cover_plate).union(housing_cover)