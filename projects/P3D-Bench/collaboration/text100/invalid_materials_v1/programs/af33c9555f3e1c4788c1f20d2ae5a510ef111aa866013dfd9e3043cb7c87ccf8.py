import cadquery as cq
import math

# ==============================================================================
# Model Parameters
# ==============================================================================

# Base circular disk
base_radius = 0.375           # Bounded by 0.75 x 0.75 envelope, centered at (0, 0)
base_height = 0.0221          # Thickness/extrusion depth of the base disk (0.022059)

# Upper concentric tier
tier_radius = 0.3485          # Footprint 0.697059 x 0.697059 (inset 0.0265 from base)
tier_height = 0.0882          # Height/extrusion depth of the raised tier (0.088235)
tier_top_z = 0.1103           # Total stack height (base_height + tier_height)

# Curved slot openings (5 equally spaced arc slots through the raised tier only)
num_slots = 5
slot_r_outer = 0.2647         # Outer radius (fits envelope: 0.375 - 0.1103 = 0.2647)
slot_width = 0.0882           # Radial thickness of slot opening
slot_r_inner = slot_r_outer - slot_width  # Inner radius (~0.1765)
slot_span_angle = 50.0        # Angular span of each arc slot in degrees
slot_start_angle = -90.0      # Aligned with front (-Y) inset of 0.1103

# Central through-hole
hole_radius = 0.0441          # Radius of the central through-hole (diameter 0.0882)


# ==============================================================================
# Helper Functions
# ==============================================================================

def get_arc_slot_points(r_inner, r_outer, span_deg, center_deg):
    """
    Computes key control points for a smooth, arc-sided slot with semicircular
    end caps centered at center_deg.
    """
    r_mid = (r_inner + r_outer) / 2.0
    r_cap = (r_outer - r_inner) / 2.0
    half_span = span_deg / 2.0

    a1 = math.radians(center_deg - half_span)
    a2 = math.radians(center_deg + half_span)
    amid = math.radians(center_deg)

    # 1. Inner arc: from a1 to a2 at r_inner
    p1 = (r_inner * math.cos(a1), r_inner * math.sin(a1))
    p1_mid = (r_inner * math.cos(amid), r_inner * math.sin(amid))
    p2 = (r_inner * math.cos(a2), r_inner * math.sin(a2))

    # 2. Semicircular end cap at a2 (from p2 to p3, bulging outward)
    c2 = (r_mid * math.cos(a2), r_mid * math.sin(a2))
    t2 = (-math.sin(a2), math.cos(a2))
    cap2_mid = (c2[0] + r_cap * t2[0], c2[1] + r_cap * t2[1])
    p3 = (r_outer * math.cos(a2), r_outer * math.sin(a2))

    # 3. Outer arc: from a2 to a1 at r_outer
    p3_mid = (r_outer * math.cos(amid), r_outer * math.sin(amid))
    p4 = (r_outer * math.cos(a1), r_outer * math.sin(a1))

    # 4. Semicircular end cap at a1 (from p4 to p1, bulging outward)
    c1 = (r_mid * math.cos(a1), r_mid * math.sin(a1))
    t1 = (math.sin(a1), -math.cos(a1))
    cap1_mid = (c1[0] + r_cap * t1[0], c1[1] + r_cap * t1[1])

    return p1, p1_mid, p2, cap2_mid, p3, p3_mid, p4, cap1_mid


# ==============================================================================
# Model Construction
# ==============================================================================

# Step 1: Create the lower circular base disk
base = (
    cq.Workplane("XY")
    .circle(base_radius)
    .extrude(base_height)
)

# Step 2: Create the concentric raised circular tier
tier = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .circle(tier_radius)
    .extrude(tier_height)
)

# Step 3: Cut the 5 curved arc-slot openings through the raised tier only
# Cutting the tier prior to union ensures the base below remains completely intact.
for i in range(num_slots):
    angle = slot_start_angle + i * (360.0 / num_slots)
    p1, p1_mid, p2, cap2_mid, p3, p3_mid, p4, cap1_mid = get_arc_slot_points(
        slot_r_inner, slot_r_outer, slot_span_angle, angle
    )

    slot_cutter = (
        cq.Workplane("XY")
        .workplane(offset=base_height - 0.001)
        .moveTo(p1[0], p1[1])
        .threePointsArc(p1_mid, p2)
        .threePointsArc(cap2_mid, p3)
        .threePointsArc(p3_mid, p4)
        .threePointsArc(cap1_mid, p1)
        .close()
        .extrude(tier_height + 0.002)
    )
    tier = tier.cut(slot_cutter)

# Step 4: Union the solid base disk with the slotted raised tier
result = base.union(tier)

# Step 5: Cut the central circular through-hole through the full stack
result = (
    result.faces(">Z")
    .workplane()
    .circle(hole_radius)
    .cutThruAll()
)