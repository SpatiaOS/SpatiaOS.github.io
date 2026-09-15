import cadquery as cq
import math

# --------------------------
# Parametric Model Definition
# --------------------------
# Coordinate System (matches reference isometric view):
# Y axis: Shaft axis, +Y = back (towards winch drum, upper-right in view), -Y = front (towards cranks, lower-left in view)
# X axis: Horizontal, +X = right, -X = left in model space
# Z axis: Vertical, +Z = up, -Z = down
# Origin (0,0,0): Shaft center, front face of stand at crank exit point
# Shaft passes through origin along Y axis.

# --- Stand / Base Parameters ---
stand_plate_thick = 10        # Thickness of main triangular stand plate (along Y)
stand_hub_dia = 50            # Diameter of cast shaft hub on stand
stand_hub_length = 15         # Length of hub along Y axis
crossbar_size = 20            # Square cross section of foot crossbar
crossbar_length = 70          # Length of crossbar along Y axis
crossbar_pos_x = 95           # X position of foot crossbar (under drum)
crossbar_pos_z = -110         # Z position of crossbar (below shaft)
foot_pad_size = 25            # Square size of foot pads
foot_pad_height = 8           # Height of foot pads (down from crossbar)
detail_pin_dia = 8            # Diameter of small locking/release pin on hub
detail_pin_length = 30        # Length of detail pin (front of hub)
detail_pin_offset_x = 0       # X offset of detail pin from shaft (straight down)
detail_pin_offset_z = -30     # Z offset of detail pin from shaft
center_pin_dia = 8            # Radial locating pin on planet carrier hub
center_pin_length = 10        # Length of radial pin (sticking up from hub)

# --- Main Shaft Parameters ---
main_shaft_dia = 30
shaft_length_front = 75       # Shaft length in front of stand (-Y direction)
shaft_length_back = 90        # Shaft length behind stand (+Y direction, into drum)

# --- Crank Parameters ---
crank_angle_deg = 135         # Angle of crank arms CCW from +X axis (points up-left, matches reference)
crank_arm_section = 12        # Square cross section of crank arms
crank_handle_dia = 12         # Diameter of handle grips
# Short double-ended crank (closer to stand)
crank1_radius = 80
crank1_y_pos = -25
crank1_handle_length = 50
crank1_opposite_radius = 40   # Opposite arm length (down-right direction)
crank1_opposite_angle = -45   # Angle for opposite handle
crank1_opposite_handle_length = 30
# Long single-ended crank (further from stand, longer reach)
crank2_radius = 150
crank2_y_pos = -60
crank2_handle_length = 50

# --- Winch Drum Parameters ---
drum_outer_dia = 180
drum_ring_root_dia = 153      # Internal gear root diameter (corrected for proper mesh)
drum_width = 35               # Drum width along Y axis
drum_center_y = 60            # Y position of drum center behind stand
tooth_depth = 3               # Radial height of gear teeth (visual representation)
tooth_width = 3               # Circumferential width of gear teeth (visual representation)

# --- Planetary Gearset Parameters ---
sun_gear_pitch_dia = 60
planet_gear_pitch_dia = 45
gear_face_width = 25          # Width of gears along Y axis
planet_center_radius = (sun_gear_pitch_dia + planet_gear_pitch_dia)/2  # Center distance from main shaft to planets
carrier_hub_dia = 40
carrier_arm_width = 12
carrier_thick = 8
carrier_center_y = 25         # Y position of planet carrier between stand and drum
planet_pin_dia = 10
planet_pin_length = 45        # Length of planet support pins (corrected to not protrude through drum)

# --------------------------
# Helper Geometry Functions
# --------------------------
def create_external_gear(pitch_dia: float, tooth_depth: float, tooth_width: float, face_width: float) -> cq.Workplane:
    """Create a simple visual spur gear with rectangular teeth, axis along Y, centered at origin."""
    root_dia = pitch_dia - tooth_depth  # Total tooth height = tooth_depth, centered on pitch circle
    # Start with gear core blank
    gear = cq.Workplane("XZ").circle(root_dia / 2).extrude(face_width / 2, both=True)
    # Calculate number of teeth (matched for proper planetary tooth count ratio)
    num_teeth = int(round(math.pi * pitch_dia / (2 * tooth_width)))
    # Create single tooth prototype, positioned at +Z (top), centered on pitch radius
    tooth = (
        cq.Workplane("XZ")
        .rect(tooth_width, tooth_depth)
        .extrude(face_width / 2, both=True)
        .translate((0, 0, pitch_dia/2))
    )
    # Pattern teeth around gear axis
    for i in range(num_teeth):
        angle = 360 / num_teeth * i
        gear = gear.union(tooth.rotate((0,0,0), (0,1,0), angle))
    return gear

def create_drum(drum_od: float, ring_root_dia: float, tooth_depth: float, tooth_width: float, drum_width: float) -> cq.Workplane:
    """Create winch drum with internal ring gear, axis along Y, centered at origin."""
    # Start with solid outer drum cylinder
    drum = cq.Workplane("XZ").circle(drum_od / 2).extrude(drum_width / 2, both=True)
    # Bore out interior for ring gear
    drum = drum.faces("<Y").workplane().circle(ring_root_dia / 2).cutThruAll()
    # Calculate number of internal teeth
    ring_pitch_dia = ring_root_dia - tooth_depth
    num_teeth = int(round(math.pi * ring_pitch_dia / (2 * tooth_width)))
    # Create single internal tooth prototype, centered on pitch radius
    tooth = (
        cq.Workplane("XZ")
        .rect(tooth_width, tooth_depth)
        .extrude(drum_width / 2, both=True)
        .translate((0, 0, ring_pitch_dia/2))
    )
    # Pattern teeth around interior
    for i in range(num_teeth):
        angle = 360 / num_teeth * i
        drum = drum.union(tooth.rotate((0,0,0), (0,1,0), angle))
    return drum

def create_planet_carrier(hub_dia: float, outer_rad: float, arm_width: float, thick: float, pin_rad: float, pin_dia: float, pin_length: float) -> cq.Workplane:
    """Create 4-spoked planet carrier with mounting pins, axis along Y, centered at origin. Pins extend in +Y direction."""
    # Central mounting hub
    carrier = cq.Workplane("XZ").circle(hub_dia / 2).extrude(thick / 2, both=True)
    # Create single radial arm prototype (pointing +Z up)
    arm = (
        cq.Workplane("XZ")
        .rect(arm_width, outer_rad - hub_dia/2)
        .extrude(thick / 2, both=True)
        .translate((0, 0, hub_dia/2 + (outer_rad - hub_dia/2)/2))
    )
    # Add four arms at 90 degree intervals
    for angle in [0, 90, 180, 270]:
        carrier = carrier.union(arm.rotate((0,0,0), (0,1,0), angle))
    # Create single planet pin prototype
    pin = (
        cq.Workplane("XZ")
        .circle(pin_dia / 2)
        .extrude(pin_length, both=False)
        .translate((0, thick/2, 0))  # Start at +Y face of carrier
    )
    # Add pins and retaining cross pins
    for angle in [0, 90, 180, 270]:
        rad = math.radians(angle)
        x = pin_rad * math.sin(rad)
        z = pin_rad * math.cos(rad)
        # Add planet pin
        carrier = carrier.union(pin.translate((x, 0, z)))
        # Add cross pin detail (retaining pin at end of planet pin, rotated to correct orientation)
        cy = thick/2 + pin_length - 2
        cross_pin = (
            cq.Workplane("XZ")
            .rect(4, 20)
            .extrude(4, both=True)
            .translate((x, cy, z))
            .rotate((x, cy, z), (x, cy + 1, z), angle + 90)
        )
        carrier = carrier.union(cross_pin)
    return carrier

# --------------------------
# Build Assembly Components
# --------------------------
# Main input shaft
main_shaft = (
    cq.Workplane("XZ", origin=(0, -shaft_length_front, 0))
    .circle(main_shaft_dia / 2)
    .extrude(shaft_length_front + shaft_length_back)
)

# --- Stand Assembly ---
# Triangular front plate
stand_plate = (
    cq.Workplane("XZ", origin=(0,0,0))
    .moveTo(0, 0)                   # Apex at shaft center
    .lineTo(90, -120)               # Front bottom corner
    .lineTo(110, -100)              # Rear bottom corner
    .close()
    .extrude(stand_plate_thick)     # Extrude +Y towards drum
)
# Shaft hub with bore for shaft
stand_hub = (
    cq.Workplane("XZ", origin=(0, -5, 0))
    .circle(stand_hub_dia / 2)
    .extrude(stand_hub_length)
    .circle(main_shaft_dia / 2)
    .cutThruAll()
)
# Foot crossbar
crossbar = (
    cq.Workplane("XY", origin=(crossbar_pos_x, -30, crossbar_pos_z))
    .box(crossbar_size, crossbar_length, crossbar_size)
)
# Calculate foot positions
front_foot_y = -30 - crossbar_length / 2
rear_foot_y = -30 + crossbar_length / 2
foot_z_pos = crossbar_pos_z - crossbar_size/2 - foot_pad_height/2
front_foot = (
    cq.Workplane("XY", origin=(crossbar_pos_x, front_foot_y, foot_z_pos))
    .box(foot_pad_size, foot_pad_size, foot_pad_height)
)
rear_foot = (
    cq.Workplane("XY", origin=(crossbar_pos_x, rear_foot_y, foot_z_pos))
    .box(foot_pad_size, foot_pad_size, foot_pad_height)
)
# Small ratchet release pin
detail_pin = (
    cq.Workplane("XZ", origin=(detail_pin_offset_x, -detail_pin_length, detail_pin_offset_z))
    .circle(detail_pin_dia / 2)
    .extrude(detail_pin_length)
)
# Radial pin sticking up from carrier hub
center_pin = (
    cq.Workplane("XY", origin=(0, carrier_center_y, carrier_hub_dia/2))
    .circle(center_pin_dia / 2)
    .extrude(center_pin_length, both=False)
)

# --- Crank Assembly ---
crank_angle_rad = math.radians(crank_angle_deg)
# Short inner double-ended crank (passes through shaft, two handles)
crank1_arm = (
    cq.Workplane("XZ", origin=(0, crank1_y_pos, 0))
    .box(crank1_radius + crank1_opposite_radius, crank_arm_section, crank_arm_section, centered=(False, True, True))
    .translate((-crank1_opposite_radius, 0, 0))
    .rotate((0, crank1_y_pos, 0), (0, crank1_y_pos + 1, 0), -crank_angle_deg)
)
c1_x = crank1_radius * math.cos(crank_angle_rad)
c1_z = crank1_radius * math.sin(crank_angle_rad)
crank1_handle = (
    cq.Workplane("XZ", origin=(c1_x, crank1_y_pos - crank1_handle_length, c1_z))
    .circle(crank_handle_dia / 2)
    .extrude(crank1_handle_length)
)
# Opposite down-right handle on short crank
c1_opp_angle_rad = math.radians(crank1_opposite_angle)
c1_opp_x = crank1_opposite_radius * math.cos(c1_opp_angle_rad)
c1_opp_z = crank1_opposite_radius * math.sin(c1_opp_angle_rad)
crank1_opposite_handle = (
    cq.Workplane("XZ", origin=(c1_opp_x, crank1_y_pos - crank1_opposite_handle_length, c1_opp_z))
    .circle(crank_handle_dia / 2)
    .extrude(crank1_opposite_handle_length)
)
# Long outer single-ended crank
crank2_arm = (
    cq.Workplane("XZ", origin=(0, crank2_y_pos, 0))
    .box(crank2_radius, crank_arm_section, crank_arm_section, centered=(False, True, True))
    .rotate((0, crank2_y_pos, 0), (0, crank2_y_pos + 1, 0), -crank_angle_deg)
)
c2_x = crank2_radius * math.cos(crank_angle_rad)
c2_z = crank2_radius * math.sin(crank_angle_rad)
crank2_handle = (
    cq.Workplane("XZ", origin=(c2_x, crank2_y_pos - crank2_handle_length, c2_z))
    .circle(crank_handle_dia / 2)
    .extrude(crank2_handle_length)
)

# --- Drum & Gear Assembly ---
# Winch drum with internal ring gear
drum = create_drum(drum_outer_dia, drum_ring_root_dia, tooth_depth, tooth_width, drum_width).translate((0, drum_center_y, 0))
# Central sun gear (fixed to input shaft)
sun_gear = create_external_gear(sun_gear_pitch_dia, tooth_depth, tooth_width, gear_face_width).translate((0, drum_center_y, 0))
# Planet gears (4 total, positioned around sun gear)
planet_gear_proto = create_external_gear(planet_gear_pitch_dia, tooth_depth, tooth_width, gear_face_width)
planets = None
for angle in [0, 90, 180, 270]:
    rad = math.radians(angle)
    px = planet_center_radius * math.sin(rad)
    pz = planet_center_radius * math.cos(rad)
    planet = planet_gear_proto.translate((px, drum_center_y, pz))
    if planets is None:
        planets = planet
    else:
        planets = planets.union(planet)
planet_carrier = create_planet_carrier(
    carrier_hub_dia, planet_center_radius + 10, carrier_arm_width,
    carrier_thick, planet_center_radius, planet_pin_dia, planet_pin_length
).translate((0, carrier_center_y, 0))

# --------------------------
# Final Assembly
# --------------------------
result = (
    cq.Assembly(name="hand_winch")
    .add(main_shaft, name="main_shaft", color=cq.Color(0.7,0.7,0.7))
    .add(stand_plate, name="stand_plate", color=cq.Color(0.65,0.65,0.68))
    .add(stand_hub, name="stand_hub", color=cq.Color(0.6,0.6,0.62))
    .add(crossbar, name="crossbar", color=cq.Color(0.6,0.6,0.62))
    .add(front_foot, name="front_foot", color=cq.Color(0.55,0.55,0.57))
    .add(rear_foot, name="rear_foot", color=cq.Color(0.55,0.55,0.57))
    .add(detail_pin, name="detail_pin", color=cq.Color(0.5,0.5,0.52))
    .add(center_pin, name="center_pin", color=cq.Color(0.6,0.6,0.62))
    .add(crank1_arm, name="crank1_arm", color=cq.Color(0.62,0.62,0.64))
    .add(crank1_handle, name="crank1_handle", color=cq.Color(0.6,0.6,0.62))
    .add(crank1_opposite_handle, name="crank1_opposite_handle", color=cq.Color(0.6,0.6,0.62))
    .add(crank2_arm, name="crank2_arm", color=cq.Color(0.62,0.62,0.64))
    .add(crank2_handle, name="crank2_handle", color=cq.Color(0.6,0.6,0.62))
    .add(drum, name="drum", color=cq.Color(0.68,0.68,0.7))
    .add(sun_gear, name="sun_gear", color=cq.Color(0.63,0.63,0.65))
    .add(planets, name="planets", color=cq.Color(0.61,0.61,0.63))
    .add(planet_carrier, name="planet_carrier", color=cq.Color(0.6,0.6,0.62))
)

# Convert assembly to solid compound for export/viewing
result = result.toCompound()