import math
import cadquery as cq

# ==============================================================================
# Model Parameters
# ==============================================================================

# Central solid parameters
r_center = 20.0       # Radius of the central round solid (mm)
h_center = 12.0       # Height of the central solid (mm) - shallower than surrounding tiers

# Middle tier parameters (surrounding curved sections)
r_mid = 45.0          # Outer radius of the surrounding curved sections (mm)
h_mid = 24.0          # Height of the surrounding curved sections (mm)

# Outer tier parameters (outer arc sections)
r_outer = 70.0        # Outer radius of the outer arc sections (mm)

# Heights for each outer arc section:
# Demonstrates varying stepped reaches where some sections extend higher than
# the surrounding curved sections (36mm and 48mm vs 24mm) while others remain lower (18mm)
h_outer_list = [36.0, 18.0, 48.0, 18.0]

# Radial pattern parameters
num_sectors = 4       # Number of segmented sectors around the perimeter
gap_angle = 12.0      # Angular gap between adjacent curved sections (degrees)

# Calculate angular span for each sector
sector_span = 360.0 / num_sectors - gap_angle


# ==============================================================================
# Helper Functions
# ==============================================================================

def create_annular_sector(r_in, r_out, a1_deg, a2_deg, height):
    """
    Creates an arc-shaped solid section (annular sector) rising from the
    common underside datum (z = 0) to the specified height.

    Parameters:
        r_in (float): Inner radius of the sector
        r_out (float): Outer radius of the sector
        a1_deg (float): Start angle in degrees
        a2_deg (float): End angle in degrees
        height (float): Extrusion height along +Z from z=0
    """
    a1 = math.radians(a1_deg)
    a2 = math.radians(a2_deg)
    a_mid = (a1 + a2) / 2.0

    # Define boundary points in the XY plane
    p1 = (r_in * math.cos(a1), r_in * math.sin(a1))
    p2 = (r_out * math.cos(a1), r_out * math.sin(a1))
    p_mid_out = (r_out * math.cos(a_mid), r_out * math.sin(a_mid))
    p3 = (r_out * math.cos(a2), r_out * math.sin(a2))
    p4 = (r_in * math.cos(a2), r_in * math.sin(a2))
    p_mid_in = (r_in * math.cos(a_mid), r_in * math.sin(a_mid))

    # Build the 2D closed wire and extrude upward from z = 0
    sector_solid = (
        cq.Workplane("XY")
        .moveTo(p4[0], p4[1])
        .threePointsArc(p_mid_in, p1)      # Inner circular arc
        .lineTo(p2[0], p2[1])              # Radial start edge
        .threePointsArc(p_mid_out, p3)     # Outer circular arc
        .close()                           # Radial end edge back to p4
        .extrude(height)
    )
    return sector_solid


# ==============================================================================
# Model Construction
# ==============================================================================

# Step 1: Create the smaller central round solid rising from datum z = 0
result = (
    cq.Workplane("XY")
    .circle(r_center)
    .extrude(h_center)
)

# Step 2: Add surrounding curved sections and outer arc sections
# Each section is extruded from the common base datum (z = 0) rather than stacked
for i in range(num_sectors):
    # Determine the angular boundary for this sector quadrant
    a_start = i * (360.0 / num_sectors) + gap_angle / 2.0
    a_end = a_start + sector_span

    # Surrounding curved section (middle tier)
    mid_sector = create_annular_sector(
        r_in=r_center,
        r_out=r_mid,
        a1_deg=a_start,
        a2_deg=a_end,
        height=h_mid
    )

    # Outer arc section (outer tier with variable heights)
    outer_sector = create_annular_sector(
        r_in=r_mid,
        r_out=r_outer,
        a1_deg=a_start,
        a2_deg=a_end,
        height=h_outer_list[i]
    )

    # Combine middle and outer sectors for this branch, then union to the central hub
    sector_petal = mid_sector.union(outer_sector)
    result = result.union(sector_petal)