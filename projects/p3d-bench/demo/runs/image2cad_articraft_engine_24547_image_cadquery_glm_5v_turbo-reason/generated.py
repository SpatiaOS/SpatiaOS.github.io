import cadquery as cq
import math

# =============================================================================
# Steam Engine Model Parameters
# =============================================================================

# Base parameters
base_length = 120.0
base_width = 70.0
base_height = 12.0
base_fillet = 3.0

# Cylinder parameters (left side)
cylinder_length = 65.0
cylinder_diameter = 35.0
cylinder_fin_count = 25
cylinder_fin_thickness = 1.5
cylinder_fin_spacing = 2.0

# Flywheel parameters
flywheel_outer_diameter = 58.0
flywheel_inner_diameter = 48.0
flywheel_thickness = 9.0
flywheel_hub_diameter = 16.0
flywheel_hole_diameter = 14.0
flywheel_hole_count = 5

# Shaft parameters
main_shaft_diameter = 10.0
front_shaft_length = 15.0
crank_pin_diameter = 6.0

# Positioning
front_wheel_offset = 35.0
rear_wheel_offset = 75.0
cylinder_center_height = base_height + 28.0
wheel_center_height = base_height + 32.0

# Small parts
valve_stem_diameter = 8.0
valve_stem_height = 12.0
valve_knob_diameter = 14.0
valve_knob_height = 8.0


def create_base():
    """Create the engine base plate with filleted edges"""
    base = (
        cq.Workplane("XY")
        .box(base_length, base_width, base_height)
        .edges("|Z")
        .fillet(base_fillet)
    )
    return base


def create_cylinder():
    """Create the finned cylinder assembly"""
    # Main cylinder body
    cylinder_body = (
        cq.Workplane("XZ")
        .workplane(offset=-cylinder_length/2)
        .circle(cylinder_diameter/2)
        .extrude(cylinder_length)
    )
    
    # Add cooling fins using loft/revolve approach for better geometry
    fins = None
    total_fin_width = cylinder_fin_thickness * cylinder_fin_count + \
                      cylinder_fin_spacing * (cylinder_fin_count - 1)
    start_z = -total_fin_width / 2
    
    for i in range(cylinder_fin_count):
        z_pos = start_z + i * (cylinder_fin_thickness + cylinder_fin_spacing)
        fin = (
            cq.Workplane("XZ")
            .workplane(offset=z_pos)
            .circle(cylinder_diameter/2 + 1.5)
            .circle(cylinder_diameter/2)
            .extrude(cylinder_fin_thickness)
        )
        if fins is None:
            fins = fin
        else:
            fins = fins.union(fin)
    
    # Combine cylinder body with fins
    cylinder = cylinder_body.union(fins)
    
    # Add end cap (smooth part near wheels)
    end_cap = (
        cq.Workplane("XZ")
        .workplane(offset=cylinder_length/2 - 8)
        .circle(cylinder_diameter/2 + 0.5)
        .extrude(10)
    )
    cylinder = cylinder.union(end_cap)
    
    # Add valve stem on top
    valve_stem = (
        cq.Workplane("XY")
        .workplane(offset=cylinder_center_height + cylinder_diameter/2)
        .circle(valve_stem_diameter/2)
        .extrude(valve_stem_height)
    )
    
    # Add valve knob - using safer approach without problematic fillet
    valve_knob = (
        cq.Workplane("XY")
        .workplane(offset=cylinder_center_height + cylinder_diameter/2 + valve_stem_height)
        .circle(valve_knob_diameter/2)
        .extrude(valve_knob_height)
    )
    # Apply fillet only to top circular edge if exists
    try:
        valve_knob = valve_knob.edges(">Z").fillet(2.0)
    except:
        pass  # Skip fillet if no suitable edges found
    
    cylinder = cylinder.union(valve_stem).union(valve_knob)
    
    # Position cylinder
    cylinder = cylinder.translate((
        -base_length/2 + cylinder_length/2 + 5,
        0,
        cylinder_center_height
    ))
    
    return cylinder


def create_flywheel():
    """Create a single flywheel with spokes"""
    # Outer ring
    wheel = (
        cq.Workplane("XY")
        .circle(flywheel_outer_diameter/2)
        .extrude(flywheel_thickness)
    )
    
    # Inner hub
    hub = (
        cq.Workplane("XY")
        .workplane(offset=-0.5)
        .circle(flywheel_hub_diameter/2)
        .extrude(flywheel_thickness + 1)
    )
    wheel = wheel.union(hub)
    
    # Cut spoke holes in a pattern
    hole_radius = flywheel_inner_diameter/2
    for i in range(flywheel_hole_count):
        angle = i * (360 / flywheel_hole_count)
        x = hole_radius * math.cos(math.radians(angle))
        y = hole_radius * math.sin(math.radians(angle))
        
        hole = (
            cq.Workplane("XY")
            .workplane(offset=-1)
            .transformed(offset=(x, y, 0))
            .circle(flywheel_hole_diameter/2)
            .extrude(flywheel_thickness + 2)
        )
        wheel = wheel.cut(hole)
    
    # Center hole for shaft
    center_hole = (
        cq.Workplane("XY")
        .workplane(offset=-1)
        .circle(main_shaft_diameter/2 + 0.5)
        .extrude(flywheel_thickness + 2)
    )
    wheel = wheel.cut(center_hole)
    
    return wheel


def create_shafts_and_crank():
    """Create the main shaft, crank pin, and connecting rod assembly"""
    parts = []
    
    # Front shaft extension
    front_shaft = (
        cq.Workplane("XY")
        .workplane(offset=wheel_center_height)
        .circle(main_shaft_diameter/2)
        .extrude(front_shaft_length)
    )
    parts.append(front_shaft.translate((front_wheel_offset, 0, 0)))
    
    # Main shaft connecting both wheels
    main_shaft = (
        cq.Workplane("XY")
        .workplane(offset=wheel_center_height)
        .circle(main_shaft_diameter/2)
        .extrude(rear_wheel_offset - front_wheel_offset)
    )
    parts.append(main_shaft.translate((front_wheel_offset, 0, 0)))
    
    # Crank disk (eccentric)
    crank_disk = (
        cq.Workplane("YZ")
        .workplane(offset=front_wheel_offset + 20)
        .circle(12)
        .extrude(8, both=True)
    )
    parts.append(crank_disk.translate((0, 0, wheel_center_height)))
    
    # Crank pin
    crank_pin = (
        cq.Workplane("YZ")
        .workplane(offset=front_wheel_offset + 20 + 6)
        .circle(crank_pin_diameter/2)
        .extrude(15)
    )
    parts.append(crank_pin.translate((0, 0, wheel_center_height - 5)))
    
    # Connecting rod (simplified as rectangular link)
    conn_rod = (
        cq.Workplane("XZ")
        .workplane(offset=front_wheel_offset + 27)
        .rect(8, 20)
        .extrude(6, both=True)
    )
    parts.append(conn_rod.translate((0, 0, wheel_center_height - 18)))
    
    # Crosshead guide (small block) - removed problematic fillet
    crosshead = (
        cq.Workplane("XZ")
        .workplane(offset=front_wheel_offset + 40)
        .rect(12, 16)
        .extrude(10, both=True)
    )
    parts.append(crosshead.translate((0, 0, wheel_center_height - 22)))
    
    # Piston rod connection
    piston_rod = (
        cq.Workplane("XZ")
        .workplane(offset=front_wheel_offset + 45)
        .circle(5)
        .extrude(25)
    )
    parts.append(piston_rod.translate((0, 0, wheel_center_height - 34)))
    
    return parts


def assemble_engine():
    """Assemble all components into final model"""
    # Start with base
    result = create_base()
    
    # Add cylinder
    cylinder = create_cylinder()
    result = result.union(cylinder)
    
    # Create and position front flywheel
    front_wheel = create_flywheel()
    front_wheel = front_wheel.translate((front_wheel_offset, 0, wheel_center_height))
    result = result.union(front_wheel)
    
    # Create and position rear flywheel
    rear_wheel = create_flywheel()
    rear_wheel = rear_wheel.translate((rear_wheel_offset, 0, wheel_center_height))
    result = result.union(rear_wheel)
    
    # Add shafts and crank mechanism
    shaft_parts = create_shafts_and_crank()
    for part in shaft_parts:
        result = result.union(part)
    
    # Add bearing blocks (supports for shafts)
    def create_bearing_block(x_pos):
        height = wheel_center_height - base_height + 5
        return (
            cq.Workplane("XY")
            .workplane(offset=base_height)
            .transformed(offset=(x_pos, 0, 0))
            .rect(14, 24)
            .extrude(height)
        )
    
    front_bearing = create_bearing_block(front_wheel_offset - 5)
    rear_bearing = create_bearing_block(rear_wheel_offset + 5)
    result = result.union(front_bearing).union(rear_bearing)
    
    return result


# Generate the final model
result = assemble_engine()