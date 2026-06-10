import cadquery as cq
import math

# Parameters
pedestal_base_radius = 30.0
pedestal_shoulder_radius = 34.0
pedestal_neck_radius = 16.0
pedestal_height = 130.0

crown_height = 20.0
crown_inner_radius = 18.44
crown_outer_radius = 26.0
crown_teeth_count = 10

sphere_radius = 3.0

# 1. Pedestal Body
# Define profile in XZ plane using spline for smooth transitions (replacing fillet on wire)
pedestal_profile = (
    cq.Workplane("XZ")
    .moveTo(0, 0)
    .lineTo(pedestal_base_radius, 0)
    .lineTo(pedestal_base_radius, 15)
    .spline([
        (pedestal_base_radius, 15), # Start of spline (connects to line)
        (pedestal_base_radius - 2, 35),
        (pedestal_shoulder_radius, 65),
        (pedestal_neck_radius + 5, 95),
        (pedestal_neck_radius, 115),
        (pedestal_neck_radius, pedestal_height)
    ])
    .lineTo(0, pedestal_height)
    .close()
)

# Revolve to create the solid pedestal
pedestal = pedestal_profile.revolve()

# 2. Serrated Crown Ring
crown_points = []
angle_step = 360.0 / crown_teeth_count
for i in range(crown_teeth_count):
    angle = i * angle_step
    # Outer point (tooth tip)
    x_out = crown_outer_radius * math.cos(math.radians(angle))
    y_out = crown_outer_radius * math.sin(math.radians(angle))
    crown_points.append((x_out, y_out))
    
    # Inner point (valley)
    angle_valley = angle + angle_step / 2.0
    r_valley = crown_inner_radius + 2.0 
    x_in = r_valley * math.cos(math.radians(angle_valley))
    y_in = r_valley * math.sin(math.radians(angle_valley))
    crown_points.append((x_in, y_in))

# Create outer solid
crown_solid = cq.Workplane("XY").polyline(crown_points).close().extrude(crown_height)
# Create inner hole solid
crown_hole = cq.Workplane("XY").circle(crown_inner_radius).extrude(crown_height)
# Cut hole and position
crown = crown_solid.cut(crown_hole).translate((0, 0, pedestal_height))

# 3. Bearing Balls
spheres = (
    cq.Workplane("XY")
    .pushPoints([
        (crown_outer_radius * math.cos(math.radians(i * angle_step)), 
         crown_outer_radius * math.sin(math.radians(i * angle_step))) 
        for i in range(crown_teeth_count)
    ])
    .sphere(sphere_radius)
    .translate((0, 0, pedestal_height + crown_height))
)

# 4. Handles
def make_handle(sign):
    # Top bar (bridging body and handle)
    top_bar_z = 100
    top_bar_x_start = pedestal_neck_radius + 2
    top_bar_x_end = 45
    
    top_bar = (
        cq.Workplane("XY")
        .box(top_bar_x_end - top_bar_x_start, 7.5, 7.5, centered=(False, True, True))
        .translate((top_bar_x_start, 0, top_bar_z))
    )
    
    # Curved Arm Path
    start_x = top_bar_x_end
    start_z = top_bar_z
    
    arm_path_pts = [
        (start_x, start_z),
        (start_x + 5, start_z - 10),
        (start_x + 10, start_z - 40),
        (start_x + 5, start_z - 80),
        (start_x - 5, start_z - 110)
    ]
    # Apply sign for left/right
    arm_path_pts = [(p[0] * sign, p[1]) for p in arm_path_pts]
    
    path_wire = cq.Workplane("XZ").spline(arm_path_pts).val()
    
    # Profile for the arm
    start_point = arm_path_pts[0]
    v = (arm_path_pts[1][0] - arm_path_pts[0][0], 0, arm_path_pts[1][1] - arm_path_pts[0][1])
    origin = (start_point[0], 0, start_point[1])
    normal = cq.Vector(v[0], v[1], v[2]).normalized()
    x_dir = cq.Vector(0, 1, 0) # Width direction (Y)
    plane = cq.Plane(origin, x_dir, normal)
    wp = cq.Workplane(plane)
    arm_profile = wp.rect(8, 4) # Width 8, Thickness 4
    
    main_arm = arm_profile.sweep(path_wire, transition='round')
    
    # Secondary strip (thinner, parallel)
    strip_pts = [
        (start_x - 2, start_z + 5),
        (start_x + 3, start_z - 5),
        (start_x + 8, start_z - 35),
        (start_x + 3, start_z - 75),
        (start_x - 7, start_z - 105)
    ]
    strip_pts = [(p[0] * sign, p[1]) for p in strip_pts]
    strip_path = cq.Workplane("XZ").spline(strip_pts).val()
    
    v_strip = (strip_pts[1][0] - strip_pts[0][0], 0, strip_pts[1][1] - strip_pts[0][1])
    origin_strip = (strip_pts[0][0], 0, strip_pts[0][1])
    normal_strip = cq.Vector(v_strip[0], v_strip[1], v_strip[2]).normalized()
    plane_strip = cq.Plane(origin_strip, x_dir, normal_strip)
    wp_strip = cq.Workplane(plane_strip)
    strip_prof = wp_strip.rect(6, 2)
    
    secondary_strip = strip_prof.sweep(strip_path, transition='round')
    
    # Clip (C-shaped hook)
    clip_c = (
        cq.Workplane("XZ")
        .moveTo((top_bar_x_start + 5) * sign, top_bar_z - 5)
        .lineTo((top_bar_x_start + 11) * sign, top_bar_z - 5)
        .lineTo((top_bar_x_start + 11) * sign, top_bar_z - 10)
        .lineTo((top_bar_x_start + 6) * sign, top_bar_z - 10)
        .lineTo((top_bar_x_start + 6) * sign, top_bar_z - 20)
        .lineTo((top_bar_x_start + 11) * sign, top_bar_z - 20)
        .lineTo((top_bar_x_start + 11) * sign, top_bar_z - 25)
        .lineTo((top_bar_x_start + 5) * sign, top_bar_z - 25)
        .close()
        .extrude(2)
    )
    
    handle_asm = top_bar.union(main_arm).union(secondary_strip).union(clip_c)
    return handle_asm

handle_right = make_handle(1)
handle_left = make_handle(-1)

# Final Assembly
result = (
    pedestal
    .union(crown)
    .union(spheres)
    .union(handle_right)
    .union(handle_left)
)