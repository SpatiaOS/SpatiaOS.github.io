import cadquery as cq

# --- Parameters ---
# Wall Mount & Arm
base_dia = 160.0
base_thick = 10.0
cone_length = 40.0
arm_dia = 36.0
arm_length = 120.0

# Hinge Joint
hinge_width = 36.0
hinge_gap = 16.0
hinge_length = 30.0
pin_dia = 8.0

# Motor Housing
motor_dia = 90.0
motor_length = 80.0
mount_width = 15.5
mount_length = 36.0
mount_height = 30.0

# Fan Guard (Wire Cage)
guard_dia = 240.0
guard_depth = 35.0
wire_thick = 2.0

# Fan Blades
hub_dia = 36.0
hub_length = 20.0
blade_length = 105.0
blade_width = 30.0
blade_pitch = 25.0
num_blades = 5

# --- Modeling ---

# 1. Wall Mount and Support Arm
# Built along the Z-axis, with the wall at the XY plane (Z=0)
mount_base = (
    cq.Workplane("XY")
    .circle(base_dia/2)
    .extrude(base_thick)
    .edges(">Z")
    .chamfer(2)
)

mount_cone = (
    cq.Workplane("XY")
    .workplane(offset=base_thick)
    .circle(base_dia/2 - 2)
    .workplane(offset=cone_length)
    .circle(arm_dia/2)
    .loft()
)

arm_total_z = base_thick + cone_length + arm_length
arm = (
    cq.Workplane("XY")
    .workplane(offset=base_thick + cone_length)
    .circle(arm_dia/2)
    .extrude(arm_length)
)

# Decorative ring on the arm where wire guides attach
wire_z_pos = arm_total_z - 40
arm_ring = (
    cq.Workplane("XY")
    .workplane(offset=wire_z_pos - 5)
    .circle(arm_dia/2 + 1.5)
    .extrude(10)
)

# U-Bracket at the end of the arm
u_base = cq.Workplane("XY").workplane(offset=arm_total_z).rect(hinge_width, hinge_width).extrude(10)
u_arms_solid = cq.Workplane("XY").workplane(offset=arm_total_z + 10).rect(hinge_width, hinge_width).extrude(hinge_length)
u_cutout = cq.Workplane("XY").workplane(offset=arm_total_z + 10).rect(hinge_gap, hinge_width + 2).extrude(hinge_length)
u_arms = u_arms_solid.cut(u_cutout)

bracket = u_base.union(u_arms)
# Cut the hinge pin hole through the arms along the X-axis
bracket = bracket.faces(">X").workplane().center(0, 0).hole(pin_dia)

wall_part = mount_base.union(mount_cone).union(arm).union(arm_ring).union(bracket)


# 2. Motor and Fan Assembly
# Built centered around its hinge mount, then positioned later
motor_mount = cq.Workplane("XY").box(mount_width, mount_length, mount_height)
motor_mount = motor_mount.faces(">X").workplane().center(0, 0).hole(pin_dia)

# Offset motor body to the side (-X direction) so the mount is on its surface
motor_offset_x = -(motor_dia/2 + mount_width/2)
motor_z_start = -20
motor_z_end = motor_z_start + motor_length

motor_body = (
    cq.Workplane("XY")
    .transformed(offset=(motor_offset_x, 0, motor_z_start))
    .circle(motor_dia/2)
    .extrude(motor_length)
)

# Top details: Switch box and button
switch_box = (
    cq.Workplane("XY")
    .transformed(offset=(motor_offset_x, 0, motor_z_start))
    .rect(20, 30)
    .extrude(-6)
)
switch_btn = (
    cq.Workplane("XY")
    .transformed(offset=(motor_offset_x, -5, motor_z_start - 6))
    .rect(8, 12)
    .extrude(-3)
)

# Top details: Ventilation slots
for i in range(-4, 5):
    vent_len = 65 - abs(i) * 10
    if vent_len > 10:
        vent = (
            cq.Workplane("XY")
            .transformed(offset=(motor_offset_x, i * 7, motor_z_start))
            .rect(vent_len, 3)
            .extrude(8)
        )
        motor_body = motor_body.cut(vent)

# Fan Guard (Wireframe approximation)
guard_z_start = motor_z_end
guard_z_end_pos = guard_z_start + guard_depth

# Concentric rings for the front and back of the guard
rings = cq.Workplane("XY")
# Front rings
for r in [40, 70, 100, 120]:
    ring = cq.Workplane("XY").transformed(offset=(motor_offset_x, 0, guard_z_end_pos)).circle(r).circle(r - wire_thick).extrude(wire_thick)
    rings = rings.union(ring)
# Back rings
for r in [50, 80, 110, 120]:
    ring = cq.Workplane("XY").transformed(offset=(motor_offset_x, 0, guard_z_start)).circle(r).circle(r - wire_thick).extrude(wire_thick)
    rings = rings.union(ring)

# Radial struts forming the cage
strut = (
    cq.Workplane("XY")
    .transformed(offset=(motor_offset_x, 0, guard_z_start))
    .rect(wire_thick, guard_dia)
    .extrude(guard_depth + wire_thick)
)
struts = strut
for i in range(1, 18): # 18 rotations of 10 degrees = 36 radial spokes
    struts = struts.union(strut.rotate((motor_offset_x, 0, 0), (motor_offset_x, 0, 1), i * 10))

# Clear out the center of the struts for the motor/hub
inner_cutout = cq.Workplane("XY").transformed(offset=(motor_offset_x, 0, guard_z_start - 5)).circle(hub_dia/2 + 5).extrude(guard_depth + 20)
struts = struts.cut(inner_cutout)
guard = rings.union(struts)

# Fan Hub and Blades
hub_z = guard_z_start + 5
hub = cq.Workplane("XY").transformed(offset=(motor_offset_x, 0, hub_z)).circle(hub_dia/2).extrude(hub_length)

blade_z = hub_z + hub_length/2
single_blade = (
    cq.Workplane("XY")
    .box(blade_length, blade_width, 2)
    .translate((blade_length/2 + hub_dia/2 - 5, 0, 0))
    .rotate((0, 0, 0), (1, 0, 0), blade_pitch) # Pitch the blade
    .translate((motor_offset_x, 0, blade_z))
)

blades = single_blade
for i in range(1, num_blades):
    blades = blades.union(single_blade.rotate((motor_offset_x, 0, 0), (motor_offset_x, 0, 1), i * (360 / num_blades)))

# Combine motor assembly parts
fan_assembly = motor_mount.union(motor_body).union(switch_box).union(switch_btn).union(guard).union(hub).union(blades)


# 3. Final Assembly and Positioning
# The hinge pin location on the arm
pin_z = arm_total_z + 10 + hinge_length/2

# Rotate the fan assembly to tilt it downwards, then move it into the U-bracket
tilt_angle = -25
placed_fan = fan_assembly.rotate((0, 0, 0), (1, 0, 0), tilt_angle).translate((0, 0, pin_z))

# Hinge hardware (Bolt head and Nut)
hex_nut = cq.Workplane("YZ").workplane(offset=hinge_width/2 + 1).center(pin_z, 0).polygon(6, 14).extrude(4)
bolt_head = cq.Workplane("YZ").workplane(offset=-hinge_width/2 - 1).center(pin_z, 0).circle(6).extrude(-4)

# Wire guides/stand-offs on the arm
wire_left = (
    cq.Workplane("XY")
    .transformed(offset=(-arm_dia/2, 0, wire_z_pos), rotate=(0, -45, 0))
    .circle(1.5)
    .extrude(70)
)
wire_right = (
    cq.Workplane("XY")
    .transformed(offset=(arm_dia/2, 0, wire_z_pos), rotate=(0, 45, 0))
    .circle(1.5)
    .extrude(70)
)

# Combine everything into the final result
result = wall_part.union(placed_fan).union(hex_nut).union(bolt_head).union(wire_left).union(wire_right)