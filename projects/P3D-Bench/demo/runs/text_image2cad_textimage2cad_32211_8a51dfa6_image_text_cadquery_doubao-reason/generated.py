import cadquery as cq
import math

# --------------------------
# Parameter Definitions
# --------------------------
# Pin Dimensions (from part descriptions)
small_pin_r = 14.4
small_pin_length = 120.0
large_pin_r = 33.87
large_pin_right_length = 175.0
large_pin_down_length = 100.0

# Small Bevel Gear Parameters
small_gear_bore_dia = 2 * small_pin_r
small_gear_bore_length = 30.0
small_gear_hub_dia = small_gear_bore_dia + 22.0
small_gear_pitch_dia = 120.0
small_gear_outer_dia = 132.0
small_gear_face_width = 25.0
small_gear_num_teeth = 32
small_gear_pitch_angle = math.radians(26.565)  # Matches 2:1 ratio with large gears

# Large Bevel Gear Parameters (identical pair)
large_gear_bore_dia = 2 * large_pin_r
large_gear_bore_length = 10.0
large_gear_hub_dia = large_gear_bore_dia + 28.0
large_gear_pitch_dia = 240.0
large_gear_outer_dia = 254.0
large_gear_face_width = 35.0
large_gear_num_teeth = 64
large_gear_pitch_angle = math.radians(63.435)  # Complementary to small gear for right angle mesh
tooth_depth = 5.0

# --------------------------
# Helper Function to Create Straight Bevel Gear
# --------------------------
def create_bevel_gear(axis, pitch_angle, pitch_dia, outer_dia, face_width, num_teeth, bore_dia, bore_length, hub_dia):
    # Create gear blank via revolve
    blank_profile = (
        cq.Workplane("XZ")
        # Hub profile
        .moveTo(0, -bore_length)
        .hLine(hub_dia/2)
        .vLine(bore_length - face_width * math.cos(pitch_angle))
        # Conical face profile
        .lineTo(pitch_dia/2 - face_width * math.sin(pitch_angle), 0)
        .lineTo(outer_dia/2, -face_width * math.cos(pitch_angle))
        .lineTo(large_gear_hub_dia/2, -face_width * math.cos(pitch_angle))
        .lineTo(large_gear_hub_dia/2, -bore_length)
        .close()
    )
    gear = blank_profile.revolve(360, (0,0,0), (0,1,0))
    
    # Cut center bore
    gear = gear.faces("<Z").circle(bore_dia/2).cutBlind(bore_length)
    
    # Cut teeth gaps around the perimeter
    tooth_angle = 360 / num_teeth
    for i in range(num_teeth):
        gap = (
            cq.Workplane("XY")
            .polygon(6, tooth_depth * 2.2)
            .rotate((0,0,0), (0,0,1), i * tooth_angle + tooth_angle/4)
            .translate((pitch_dia/2, 0, 0))
            .extrude(-face_width * 1.2, taper=math.degrees(pitch_angle))
        )
        gear = gear.cut(gap)
    
    # Rotate to specified axis
    if axis == "X":
        gear = gear.rotate((0,0,0), (0,1,0), 90)
    elif axis == "Y":
        gear = gear.rotate((0,0,0), (1,0,0), -90)
    return gear

# --------------------------
# Build All Components
# --------------------------
# Small gear (Z axis, upper left)
small_gear = create_bevel_gear(
    axis="Z",
    pitch_angle=small_gear_pitch_angle,
    pitch_dia=small_gear_pitch_dia,
    outer_dia=small_gear_outer_dia,
    face_width=small_gear_face_width,
    num_teeth=small_gear_num_teeth,
    bore_dia=small_gear_bore_dia,
    bore_length=small_gear_bore_length,
    hub_dia=small_gear_hub_dia
).translate((-15, 100, 0))  # Position to match assembly layout

# Small gear pin
small_pin = (
    cq.Workplane("XY", origin=(-15, 100, -0.6))  # 0.6mm protrusion inside gear for 30.6mm overlap
    .circle(small_pin_r)
    .extrude(small_pin_length)
)

# Large gear 1 (X axis, right side)
large_gear_right = create_bevel_gear(
    axis="X",
    pitch_angle=large_gear_pitch_angle,
    pitch_dia=large_gear_pitch_dia,
    outer_dia=large_gear_outer_dia,
    face_width=large_gear_face_width,
    num_teeth=large_gear_num_teeth,
    bore_dia=large_gear_bore_dia,
    bore_length=large_gear_bore_length,
    hub_dia=large_gear_hub_dia
).translate((0, 20, 0))

# Right large gear pin
large_pin_right = (
    cq.Workplane("YZ", origin=(-0.6, 20, 0))  # 0.6mm protrusion inside gear for 10.6mm overlap
    .circle(large_pin_r)
    .extrude(large_pin_right_length)
)

# Large gear 2 (Y axis, lower center)
large_gear_down = create_bevel_gear(
    axis="Y",
    pitch_angle=large_gear_pitch_angle,
    pitch_dia=large_gear_pitch_dia,
    outer_dia=large_gear_outer_dia,
    face_width=large_gear_face_width,
    num_teeth=large_gear_num_teeth,
    bore_dia=large_gear_bore_dia,
    bore_length=large_gear_bore_length,
    hub_dia=large_gear_hub_dia
).translate((0, 0, 0))

# Down large gear pin
large_pin_down = (
    cq.Workplane("XZ", origin=(0, 0.6, 0))  # 0.6mm protrusion inside gear for 10.6mm overlap
    .circle(large_pin_r)
    .extrude(-large_pin_down_length)
)

# Combine all parts into single unified model
result = small_gear + small_pin + large_gear_right + large_pin_right + large_gear_down + large_pin_down