import cadquery as cq

# Parameters
# Dimensions derived from text description and image proportions
# Overall assembly: ~260 x 128 x 115 mm
# Using a faceted/low-poly style to match the rendered image and avoid B-spline complexity errors

# 1. Body (Torso)
# Modeled as a loft between 3 polygonal profiles to give a faceted/sculptural look
# Rear profile (Tail end)
p_rear_pts = [
    (0, 40), (35, 25), (35, -25), (0, -40), (-35, -25), (-35, 25)
]
p_rear_wire = cq.Workplane("YZ").polyline(p_rear_pts).close().vals()[0]

# Mid profile (Arched back) - Larger, shifted up
p_mid_pts = [
    (0, 55), (45, 30), (45, -30), (0, -45), (-45, -30), (-45, 30)
]
p_mid_wire = cq.Workplane("YZ").polyline(p_mid_pts).close().translate((0, 0, 15)).vals()[0]

# Front profile (Neck) - Smaller
p_front_pts = [
    (0, 30), (25, 15), (25, -15), (0, -30), (-25, -15), (-25, 15)
]
p_front_wire = cq.Workplane("YZ").polyline(p_front_pts).close().translate((0, 0, 5)).vals()[0]

# Positions along X axis
x_rear = -50
x_mid = 0
x_front = 50

p_rear_wire = p_rear_wire.translate((x_rear, 0, 0))
p_mid_wire = p_mid_wire.translate((x_mid, 0, 0))
p_front_wire = p_front_wire.translate((x_front, 0, 0))

# Create lofted solid
body_solid = cq.Solid.makeLoft([p_rear_wire, p_mid_wire, p_front_wire])
body = cq.Workplane("XY").newObject([body_solid])

# 2. Tail
# Path for the tail: starts at rear body, curves up and left
tail_path_pts = [
    (x_rear, -20),       # Start at rear body bottom
    (x_rear - 40, -30),  # Curve down/back
    (x_rear - 80, -10),  # Curve up
    (x_rear - 110, 30),  # Curve up more
    (x_rear - 120, 60)   # Tip
]
tail_path = cq.Workplane("XZ").spline(tail_path_pts).val()

# Profile for tail (Circle) - Smooth tail contrasts with faceted body
tail = (
    cq.Workplane("YZ", origin=(x_rear, 0, -20))
    .circle(4)
    .sweep(tail_path)
)

# 3. Head
# Positioned at the front of the body
head_x = x_front
head_z = 5

# Head Loft - Faceted
# Rear of head (Neck connection)
h_rear_pts = [
    (0, 25), (20, 15), (20, -15), (0, -25), (-20, -15), (-20, 15)
]
h_rear_wire = cq.Workplane("YZ").polyline(h_rear_pts).close().translate((head_x, 0, head_z)).vals()[0]

# Front of head (Snout tip) - Pointed
h_front_pts = [
    (0, 10), (10, 5), (10, -5), (0, -10), (-5, -5), (-5, 5)
]
h_front_wire = cq.Workplane("YZ").polyline(h_front_pts).close().translate((head_x + 50, 0, head_z - 5)).vals()[0]

head_solid = cq.Solid.makeLoft([h_rear_wire, h_front_wire])
head = cq.Workplane("XY").newObject([head_solid])

# Ears - Triangular prisms
# Left Ear
ear_l_pts = [(0,0), (15, 25), (25, 0)]
ear_l = (
    cq.Workplane("XY")
    .polyline(ear_l_pts).close()
    .extrude(6)
    .translate((head_x + 15, -15, head_z + 20))
    .rotate((0,0,0), (1,0,0), -30) # Tilt back
    .rotate((0,0,0), (0,1,0), -20) # Tilt out
)
# Right Ear
ear_r = ear_l.mirror("XZ")

# Nose - Small cylinder
nose = (
    cq.Workplane("XY")
    .circle(2.5)
    .extrude(3)
    .translate((head_x + 50, 0, head_z - 5))
    .rotate((0,0,0), (0,1,0), -10)
)

# Eyes - Indentations (Cut)
# Using small boxes to create faceted eye sockets
eye_cut_l = (
    cq.Workplane("XY")
    .box(4, 4, 4)
    .translate((head_x + 25, -18, head_z + 10))
    .rotate((0,0,0), (0,1,0), -10)
)
eye_cut_r = eye_cut_l.mirror("XZ")

# 4. Legs
# Modeled as faceted limbs (boxes) to match the low-poly image style
# Removed fillets to prevent BRep errors (radius too large for box dimensions) and match sharp edges in image

# Rear Leg (Left) - Large, bent
# Thigh
rear_thigh = (
    cq.Workplane("XY")
    .box(30, 20, 60)
    .translate((x_rear + 20, 30, -20))
    .rotate((0,0,0), (0,1,0), 30) # Angle back
)
# Calf
rear_calf = (
    cq.Workplane("XY")
    .box(20, 18, 50)
    .translate((x_rear - 10, 30, -40))
    .rotate((0,0,0), (0,1,0), -40) # Angle down/back
)
# Foot
rear_foot = (
    cq.Workplane("XY")
    .box(40, 15, 10)
    .translate((x_rear - 40, 30, -60))
)

# Front Leg (Left) - Smaller, reaching
# Arm
front_arm = (
    cq.Workplane("XY")
    .box(20, 15, 50)
    .translate((x_front - 10, 20, -10))
    .rotate((0,0,0), (0,1,0), -30) # Angle forward/down
)
# Forearm
front_forearm = (
    cq.Workplane("XY")
    .box(15, 12, 40)
    .translate((x_front + 15, 20, -30))
    .rotate((0,0,0), (0,1,0), -60) # Angle down
)
# Paw
front_paw = (
    cq.Workplane("XY")
    .box(25, 10, 8)
    .translate((x_front + 35, 20, -50))
)

# Mirror legs for right side
# Combine left leg parts first
rear_leg_l = rear_thigh.union(rear_calf).union(rear_foot)
front_leg_l = front_arm.union(front_forearm).union(front_paw)

rear_leg_r = rear_leg_l.mirror("XZ")
front_leg_r = front_leg_l.mirror("XZ")

# 5. Assembly
# Union all parts
assembly = (
    body
    .union(tail)
    .union(head)
    .union(ear_l)
    .union(ear_r)
    .union(nose)
    .union(rear_leg_l)
    .union(rear_leg_r)
    .union(front_leg_l)
    .union(front_leg_r)
)

# Cut eye indentations
result = assembly.cut(eye_cut_l).cut(eye_cut_r)