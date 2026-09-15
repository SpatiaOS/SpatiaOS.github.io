import cadquery as cq
import math

# ---------------------- Design Parameters ----------------------
# Main shaft (along X axis)
shaft_diameter = 6.0
shaft_length = 438.0
throw_distance = 20.0        # Center distance from main shaft to crank pin
crank_pin_diameter = 30.0
crank_pin_thickness = 14.0   # Thickness along Y axis (assembly normal direction)
web_thickness = crank_pin_thickness
web_slot_width = 3.0
web_width = 8.0
x_positions = [75, 177, 279, 381]  # Spaced evenly along 438mm shaft
crank_angles = [math.radians(-75), math.radians(-45), math.radians(-15), math.radians(15)]
conrod_angle_offset = math.radians(100)  # Angle between crank web and conrod centerline

# Connecting rod (in X-Z plane, thickness along Y)
conrod_big_end_id = crank_pin_diameter
conrod_big_end_od = 45.0
conrod_small_end_id = 12.0
conrod_small_end_od = 38.0   # Clearance fit in 40mm piston skirt
conrod_length = 85.0         # Center-to-center length between eyes
conrod_insertion_depth = 20.9
conrod_thickness = crank_pin_thickness
conrod_slot_width = 4.0

# Piston (axis along Z direction, moving in X-Z plane)
piston_diameter = 50.0
piston_length = 40.0
ring_groove_depth = 2.0
ring_groove_width = 2.0
ring_groove_offset = 3.0
skirt_bore_diameter = 40.0
skirt_bore_depth = 25.0
crown_wall_thickness = 5.0
wrist_pin_diameter = 12.0
wrist_pin_location = conrod_insertion_depth / 2

# Spacer ring (annulus in X-Y plane, thickness along Z)
spacer_id = piston_diameter
spacer_od = 54.56
spacer_thickness = 5.0
spacer_offset = ring_groove_offset + ring_groove_width + 1.0

# End bushing
bushing_od = 8.0
bushing_id = shaft_diameter
bushing_length = 5.0

# ---------------------- Helper Function: Create Piston-Conrod Subassembly ----------------------
def create_piston_rod():
    """Build piston, spacer, and connecting rod as a single unit, aligned along +Z axis with big end at origin"""
    # Big end ring (fits on crank pin, axis along Y)
    big_end = (
        cq.Workplane("XZ")
        .circle(conrod_big_end_od / 2)
        .circle(conrod_big_end_id / 2)
        .extrude(conrod_thickness / 2, both=True)
    )

    # Small end ring (wrist pin end, axis along Y)
    small_end = (
        cq.Workplane("XZ")
        .center(0, conrod_length)
        .circle(conrod_small_end_od / 2)
        .circle(conrod_small_end_id / 2)
        .extrude(conrod_thickness / 2, both=True)
    )

    # Tapered side rails forming central I-beam slot
    right_rail_points = [
        (conrod_slot_width/2, 0),
        (conrod_big_end_od/2, 0),
        (conrod_small_end_od/2, conrod_length),
        (conrod_slot_width/2, conrod_length)
    ]
    left_rail_points = [
        (-conrod_slot_width/2, 0),
        (-conrod_big_end_od/2, 0),
        (-conrod_small_end_od/2, conrod_length),
        (-conrod_slot_width/2, conrod_length)
    ]
    right_rail = cq.Workplane("XZ").polyline(right_rail_points).close().extrude(conrod_thickness/2, both=True)
    left_rail = cq.Workplane("XZ").polyline(left_rail_points).close().extrude(conrod_thickness/2, both=True)

    # Insertion spigot into piston skirt
    spigot = (
        cq.Workplane("XY")
        .center(0, conrod_length)
        .circle(conrod_small_end_od / 2)
        .extrude(conrod_insertion_depth)
    )
    # Wrist pin hole through spigot
    spigot = spigot.cut(
        cq.Workplane("XZ", origin=(0, conrod_length + conrod_insertion_depth/2, 0))
        .circle(wrist_pin_diameter/2)
        .extrude(conrod_thickness/2, both=True)
    )

    # Combine conrod components
    conrod = big_end.union(small_end).union(right_rail).union(left_rail).union(spigot)

    # Piston body (axis along +Z, skirt end at conrod small end location)
    piston = (
        cq.Workplane("XY", origin=(0, conrod_length, 0))
        .circle(piston_diameter / 2)
        .extrude(piston_length)
    )

    # Cut circumferential ring groove near crown
    groove_z = conrod_length + piston_length - ring_groove_offset - ring_groove_width/2
    ring_groove_cut = (
        cq.Workplane("XY", origin=(0, groove_z, 0))
        .circle((piston_diameter - 2*ring_groove_depth)/2)
        .extrude(ring_groove_width)
    )
    piston = piston.cut(ring_groove_cut)

    # Add spacer ring on piston barrel
    spacer_z = groove_z - spacer_thickness - ring_groove_width/2
    spacer = (
        cq.Workplane("XY", origin=(0, spacer_z + spacer_thickness/2, 0))
        .circle(spacer_od/2)
        .circle(spacer_id/2)
        .extrude(spacer_thickness)
    )
    piston = piston.union(spacer)

    # Cut internal stepped bore: skirt bore + crown pocket
    skirt_bore = (
        cq.Workplane("XY", origin=(0, conrod_length, 0))
        .circle(skirt_bore_diameter/2)
        .extrude(skirt_bore_depth)
    )
    pocket_start_z = conrod_length + skirt_bore_depth
    crown_pocket = (
        cq.Workplane("XY", origin=(0, pocket_start_z, 0))
        .circle((crown_pocket_diameter := 30.0)/2)
        .extrude(piston_length - skirt_bore_depth - crown_wall_thickness)
    )
    piston = piston.cut(skirt_bore).cut(crown_pocket)

    # Cut transverse wrist pin bore (full 50mm span along Y)
    wrist_pin_z = conrod_length + wrist_pin_location
    wrist_pin_cut = (
        cq.Workplane("XZ", origin=(0, wrist_pin_z, 0))
        .circle(wrist_pin_diameter/2)
        .extrude(piston_diameter/2, both=True)
    )
    piston = piston.cut(wrist_pin_cut)

    return conrod.union(piston)

# ---------------------- Build Base Shaft & Bushing ----------------------
# Main straight shaft along X axis
result = cq.Workplane("YZ").circle(shaft_diameter/2).extrude(shaft_length)

# Add end bushing at x=0
bushing = (
    cq.Workplane("YZ", origin=(-bushing_length, 0, 0))
    .circle(bushing_od/2)
    .circle(bushing_id/2)
    .extrude(bushing_length)
)
result = result.union(bushing)

# ---------------------- Add Crank Webs, Pins, and Piston Assemblies ----------------------
shaft_rad = shaft_diameter / 2
pin_rad = crank_pin_diameter / 2
rod_assembly = create_piston_rod()

for x0, theta in zip(x_positions, crank_angles):
    # Calculate crank pin center position in Y-Z plane (offset from shaft axis)
    pin_y = throw_distance * math.sin(theta)
    pin_z = throw_distance * math.cos(theta)

    # Build crank web (bracket arms with central slot)
    web_length = throw_distance - shaft_rad - pin_rad
    web_center_x = 0  # Web is in Y-Z plane at x0, along theta direction
    # Web side rails, oriented along throw direction
    rail1 = (
        cq.Workplane("XZ", origin=(x0, 0, 0))
        .transformed(rotate=(math.degrees(theta), 0, 0))
        .center(shaft_rad + web_length/2, web_width/2 - (web_width - web_slot_width)/4)
        .rect(web_length, (web_width - web_slot_width)/2)
        .extrude(web_thickness/2, both=True)
    )
    rail2 = (
        cq.Workplane("XZ", origin=(x0, 0, 0))
        .transformed(rotate=(math.degrees(theta), 0, 0))
        .center(shaft_rad + web_length/2, -web_width/2 + (web_width - web_slot_width)/4)
        .rect(web_length, (web_width - web_slot_width)/2)
        .extrude(web_thickness/2, both=True)
    )
    # Crank pin (disc boss, along Y axis)
    crank_pin = (
        cq.Workplane("XZ", origin=(x0, pin_y, pin_z))
        .circle(pin_rad)
        .extrude(crank_pin_thickness/2, both=True)
    )
    result = result.union(rail1).union(rail2).union(crank_pin)

    # Position and rotate piston-conrod assembly on crank pin
    rod_angle = theta + conrod_angle_offset
    placed_rod = (
        rod_assembly
        .rotate((0,0,0), (1,0,0), math.degrees(rod_angle))
        .translate((x0, pin_y, pin_z))
    )
    result = result.union(placed_rod)