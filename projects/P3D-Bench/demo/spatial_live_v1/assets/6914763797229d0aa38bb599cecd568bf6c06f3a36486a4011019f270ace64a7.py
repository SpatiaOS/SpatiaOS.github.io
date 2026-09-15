import cadquery as cq

# ---------------------- Design Parameters ----------------------
shaft_dia = 20.0
yoke_hub_len = 30.0
yoke_hub_dia = 26.0
ear_len = 15.0
ear_thick = 8.0
ear_gap = 14.0
ear_width = 22.0
trunnion_dia = 8.0
trunnion_len = 9.0
center_cube = 12.0
serrated_body_len = 45.0
serrated_body_dia = 25.0
boot_len = 35.0
boot_od = 26.0
left_stub_len = 90.0
right_stub_len = 70.0
bore_dia = 20.0
stub_hole_dia = 6.0
loc_pin_dia = 1.0
loc_pin_len = 29.0
left_bend_angle = 12  # degrees around Z axis at left U-joint
right_bend_angle = 8  # degrees around Z axis at right U-joint
mid_shaft_len = 80.0

# ---------------------- Helper Functions ----------------------
def make_shaft(length, dia):
    """Create solid cylindrical shaft along X axis, spanning X=0 to X=length, centered on Y/Z axes."""
    return cq.Workplane("YZ").circle(dia / 2).extrude(length)

def make_yoke(hub_len=yoke_hub_len, hub_dia=yoke_hub_dia, ear_len=ear_len, ear_thick=ear_thick,
              ear_gap=ear_gap, ear_width=ear_width, hole_dia=trunnion_dia, bore_dia=bore_dia,
              ear_dir=1, ear_axis="Z"):
    """
    U-joint yoke with hub aligned to X axis.
    ear_dir: +1 = ears extend from +X (right) hub end, bore enters from -X (left)
             -1 = ears extend from -X (left) hub end, bore enters from +X (right)
    ear_axis: "Z" = ears spaced vertically (Z axis), cross pins along Z
              "Y" = ears spaced horizontally (Y axis), cross pins along Y
    """
    # Create central cylindrical hub along X
    yoke = cq.Workplane("YZ").circle(hub_dia / 2).extrude(hub_len)
    ear_offset = ear_gap / 2 + ear_thick / 2

    # Set ear positions and dimensions based on axis orientation
    if ear_axis == "Z":
        push_pts = [(0, ear_offset), (0, -ear_offset)]
        ear_rect = (ear_width, ear_thick)
    else:
        push_pts = [(ear_offset, 0), (-ear_offset, 0)]
        ear_rect = (ear_thick, ear_width)

    # Add fork ears to the correct hub end
    if ear_dir == 1:
        yoke = (
            yoke.faces(">X").workplane()
            .pushPoints(push_pts)
            .rect(*ear_rect)
            .extrude(ear_len)
        )
        yoke = yoke.faces("<X").workplane().hole(bore_dia)
    else:
        yoke = (
            yoke.faces("<X").workplane()
            .pushPoints(push_pts)
            .rect(*ear_rect)
            .extrude(-ear_len)
        )
        yoke = yoke.faces(">X").workplane().hole(bore_dia)

    # Drill cross pin holes through both fork ears
    if ear_axis == "Z":
        yoke = yoke.faces(">Z").workplane(centerOption="CenterOfBoundBox").hole(hole_dia)
    else:
        yoke = yoke.faces(">Y").workplane(centerOption="CenterOfBoundBox").hole(hole_dia)

    return yoke

def make_cross(center_size=center_cube, trunnion_dia=trunnion_dia, trunnion_len=trunnion_len):
    """Universal joint spider/cross centered at origin, with trunnions along Y and Z axes."""
    cross = cq.Workplane("XY").box(center_size, center_size, center_size)
    # Y-axis trunnions
    cross = cross.faces(">Y").workplane().circle(trunnion_dia/2).extrude(trunnion_len)
    cross = cross.faces("<Y").workplane().circle(trunnion_dia/2).extrude(trunnion_len)
    # Z-axis trunnions
    cross = cross.faces(">Z").workplane().circle(trunnion_dia/2).extrude(trunnion_len)
    cross = cross.faces("<Z").workplane().circle(trunnion_dia/2).extrude(trunnion_len)
    return cross

# ---------------------- Build Individual Components ----------------------
# Left input stub shaft with radial retention hole 10mm from outer end
left_stub = make_shaft(left_stub_len, shaft_dia)
left_hole_cutter = cq.Workplane("XY", origin=(10, 0, -shaft_dia/2 - 2)).circle(stub_hole_dia/2).extrude(shaft_dia + 4)
left_stub = left_stub.cut(left_hole_cutter)

# Right output stub shaft with radial retention hole 10mm from outer end
right_stub = make_shaft(right_stub_len, shaft_dia)
right_hole_cutter = cq.Workplane("XY", origin=(right_stub_len - 10, 0, -shaft_dia/2 - 2)).circle(stub_hole_dia/2).extrude(shaft_dia + 4)
right_stub = right_stub.cut(right_hole_cutter)

# All U-joint yokes
left_yoke = make_yoke(ear_dir=1, ear_axis="Z")
serrated_fork = make_yoke(ear_dir=-1, ear_axis="Y")
right_inner_yoke = make_yoke(ear_dir=1, ear_axis="Y")
right_outer_yoke = make_yoke(ear_dir=-1, ear_axis="Z")

# U-joint cross spiders
left_cross = make_cross()
right_cross = make_cross()

# Serrated angle adjustment clamp joint
serrated_body = (
    cq.Workplane("YZ", origin=(yoke_hub_len, 0, 0))
    .circle(serrated_body_dia/2)
    .extrude(serrated_body_len)
)
serrated_joint = serrated_fork.union(serrated_body)
serrated_joint = serrated_joint.faces(">X").workplane().hole(bore_dia)  # Through bore for slip shaft

# Black rubber dust boot covering slip joint
black_boot = make_shaft(boot_len, boot_od)

# Small pinch/locating pin for serrated clamp
loc_pin = (
    cq.Workplane("XZ", origin=(yoke_hub_len + serrated_body_len/2, 0, 0))
    .circle(loc_pin_dia/2)
    .extrude(loc_pin_len)
    .translate((0, -(serrated_body_dia/2 + 2), 0))
)

# Middle slip shaft (telescoping into serrated joint)
middle_shaft = make_shaft(mid_shaft_len, shaft_dia)

# ---------------------- Assemble Components ----------------------
# Left subassembly: stub shaft + first U-joint yoke (25mm press fit)
left_group = left_stub.union(left_yoke.translate((left_stub_len - 25, 0, 0)))
left_cross_x = (left_stub_len - 25) + yoke_hub_len + ear_len/2
left_cross = left_cross.translate((left_cross_x, 0, 0))

# Position serrated angle joint, align fork ears to left cross
serrated_x = left_cross_x + ear_len/2
serrated_joint = serrated_joint.translate((serrated_x, 0, 0))
loc_pin = loc_pin.translate((serrated_x, 0, 0))

# Position middle slip shaft (25mm engagement into serrated clamp)
slip_engagement = 25
serrated_end_x = serrated_x + yoke_hub_len + serrated_body_len
mid_shaft_x = serrated_end_x - slip_engagement
middle_shaft = middle_shaft.translate((mid_shaft_x, 0, 0))

# Position rubber boot over slip joint gap
boot_x = serrated_end_x - boot_len + 10
black_boot = black_boot.translate((boot_x, 0, 0))

# Right inner yoke mounted to middle shaft (20mm press fit)
yoke_engagement = 20
mid_shaft_end_x = mid_shaft_x + mid_shaft_len
right_inner_yoke_x = mid_shaft_end_x - yoke_engagement
right_inner_yoke = right_inner_yoke.translate((right_inner_yoke_x, 0, 0))

# Align right cross to inner yoke ear midpoint
right_cross_x = right_inner_yoke_x + yoke_hub_len + ear_len/2
right_cross = right_cross.translate((right_cross_x, 0, 0))

# Right subassembly: outer U-joint yoke + output stub (20mm press fit)
right_outer_yoke_x = right_cross_x + ear_len/2
right_stub_x = right_outer_yoke_x + yoke_hub_len
right_group = right_outer_yoke.translate((right_outer_yoke_x, 0, 0)).union(right_stub.translate((right_stub_x, 0, 0)))

# ---------------------- Articulate Universal Joints ----------------------
# Rotate end groups around their cross pivot axes (aligned to trunnion axes)
left_group = left_group.rotate((left_cross_x, 0, 0), (left_cross_x, 0, 1), left_bend_angle)
right_group = right_group.rotate((right_cross_x, 0, 0), (right_cross_x, 0, 1), -right_bend_angle)

# ---------------------- Final Assembly ----------------------
result = (
    cq.Workplane("YZ")
    .union(left_group)
    .union(left_cross)
    .union(serrated_joint)
    .union(loc_pin)
    .union(black_boot)
    .union(middle_shaft)
    .union(right_inner_yoke)
    .union(right_cross)
    .union(right_group)
)

# Rotate assembly to match reference diagonal view orientation
result = result.rotate((0, 0, 0), (0, 0, 1), -22)
result = result.rotate((0, 0, 0), (0, 1, 0), 8)