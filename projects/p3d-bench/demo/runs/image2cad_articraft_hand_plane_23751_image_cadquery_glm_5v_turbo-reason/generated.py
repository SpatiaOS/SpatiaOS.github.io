import cadquery as cq

# =============================================================================
# Parameters for the Precision Tool Base Assembly
# =============================================================================

# Main base dimensions
base_length = 100.0
base_width = 60.0
base_thickness = 8.0
base_fillet = 5.0

# Spherical knob parameters
knob_diameter = 22.0
knob_pedestal_diameter = 16.0
knob_pedestal_height = 6.0
left_knob_x = -35.0
right_knob_x = 35.0
knob_y_offset = 18.0

# Central mechanism parameters
central_post_height = 28.0
central_post_diameter = 10.0
threaded_rod_height = 20.0
threaded_rod_diameter = 6.0
nut_diameter = 14.0
nut_thickness = 4.0
washer_diameter = 16.0
washer_thickness = 2.0

# Side adjustment knob
side_knob_diameter = 12.0
side_knob_length = 10.0
side_knob_x = 15.0
side_knob_y = -8.0

# Front post
front_post_height = 25.0
front_post_diameter = 8.0
front_post_x = -15.0
front_post_y = -12.0

# Bridge/arch parameters
bridge_width = 20.0
bridge_height = 15.0
bridge_thickness = 6.0

# =============================================================================
# Helper Functions
# =============================================================================

def create_spherical_knob(x, y, z):
    """Create a spherical knob on a pedestal at given position"""
    # Create pedestal
    pedestal = (
        cq.Workplane("XY")
        .workplane(offset=z)
        .center(x, y)
        .circle(knob_pedestal_diameter / 2)
        .extrude(knob_pedestal_height)
    )
    # Add sphere on top
    sphere_z = z + knob_pedestal_height + (knob_diameter / 2) * 0.7  # Partial embed
    sphere = (
        cq.Workplane("XY")
        .workplane(offset=sphere_z)
        .center(x, y)
        .sphere(knob_diameter / 2)
    )
    return pedestal.union(sphere)

def create_threaded_nut(x, y, z):
    """Create a hexagonal nut representation"""
    return (
        cq.Workplane("XY")
        .workplane(offset=z)
        .center(x, y)
        .polygon(6, nut_diameter / 2)
        .extrude(nut_thickness)
    )

def create_washer(x, y, z):
    """Create a flat washer"""
    return (
        cq.Workplane("XY")
        .workplane(offset=z)
        .center(x, y)
        .circle(washer_diameter / 2)
        .extrude(washer_thickness)
    )

# =============================================================================
# Main Model Construction
# =============================================================================

# Create custom base profile with organic curved shape
base_profile = (
    cq.Workplane("XY")
    .moveTo(-base_length/2 + 10, -base_width/2)
    .lineTo(base_length/2 - 10, -base_width/2)
    .threePointArc((base_length/2, -base_width/3), (base_length/2 - 5, 0))
    .lineTo(base_length/2 - 10, base_width/2 - 5)
    .lineTo(-base_length/2 + 10, base_width/2 - 5)
    .threePointArc((-base_length/2, base_width/3), (-base_length/2 + 5, 0))
    .close()
    .extrude(base_thickness)
    .edges("|Z").fillet(3.0)
)

# Add recessed areas on the base surface
base_with_recesses = (
    base_profile
    .faces(">Z")
    .workplane()
    # Left recess
    .moveTo(left_knob_x, 0)
    .rect(25, 30)
    .cutBlind(-2.0)
    # Right recess  
    .moveTo(right_knob_x, 0)
    .rect(25, 30)
    .cutBlind(-2.0)
)

# Build complete assembly starting from base
result = base_with_recesses

# Add left spherical knob
result = result.union(
    create_spherical_knob(left_knob_x, knob_y_offset, base_thickness)
)

# Add right spherical knob
result = result.union(
    create_spherical_knob(right_knob_x, knob_y_offset, base_thickness)
)

# Add front vertical post
result = result.union(
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .center(front_post_x, front_post_y)
    .circle(front_post_diameter / 2)
    .extrude(front_post_height)
)

# Add central mechanism components
center_x = 5.0
center_y = -5.0

# Central post (lower part)
result = result.union(
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .center(center_x, center_y)
    .circle(central_post_diameter / 2)
    .extrude(central_post_height * 0.4)
)

# Threaded rod (upper part)
rod_base_z = base_thickness + central_post_height * 0.4
result = result.union(
    cq.Workplane("XY")
    .workplane(offset=rod_base_z)
    .center(center_x, center_y)
    .circle(threaded_rod_diameter / 2)
    .extrude(threaded_rod_height)
)

# Washer under nut
result = result.union(
    create_washer(center_x, center_y, 
                  rod_base_z + threaded_rod_height - washer_thickness)
)

# Hex nut on top
result = result.union(
    create_threaded_nut(center_x, center_y,
                        rod_base_z + threaded_rod_height)
)

# Side adjustment knob (thumb screw style)
side_knob = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + 12)
    .center(side_knob_x, side_knob_y)
    .circle(side_knob_diameter / 2)
    .extrude(side_knob_length)
)
result = result.union(side_knob)

# Add connecting bridge/arch between left and center sections
bridge_center_x = (left_knob_x + center_x) / 2
bridge = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .center(bridge_center_x, -2)
    .rect(bridge_width, bridge_thickness)
    .extrude(bridge_height)
    .edges(">Y or <Y").fillet(2.0)
)
result = result.union(bridge)

# Add mounting holes on the base
hole_positions = [
    (-25, -15),
    (25, -15),
    (0, -20),
]

for hx, hy in hole_positions:
    result = (
        result
        .faces(">Z")
        .workplane()
        .center(hx, hy)
        .circle(3.0)
        .cutThruAll()
    )
    # Add counterbore for some holes
    if abs(hx) > 10:
        result = (
            result
            .faces(">Z")
            .workplane()
            .center(hx, hy)
            .circle(5.0)
            .cutBlind(-3.0)
        )

# Final cleanup - fillet sharp external edges
result = result.edges("<Z").fillet(1.5)