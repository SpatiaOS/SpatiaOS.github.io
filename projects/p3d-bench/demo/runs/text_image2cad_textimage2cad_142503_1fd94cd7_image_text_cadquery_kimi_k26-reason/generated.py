import cadquery as cq
import math

# =============================================================================
# Parameters
# =============================================================================
# Pedestal
pedestal_height = 130.0
base_radius = 28.0
flare_radius = 30.0
shoulder_radius = 28.0
neck_radius = 20.0
top_radius = 20.0
shoulder_z = 95.0

# Crown ring
crown_id = 36.88
crown_id_radius = crown_id / 2.0          # 18.44
crown_od_radius = 25.0
crown_base_h = 10.0
crown_tooth_h = 10.0
crown_z = shoulder_z                      # sits on the shoulder per the image

# Bearing balls
ball_r = 3.0
ball_count = 10

# Main curved arms
arm_thick = 7.5

# Keys
key_size = 7.5

# Decorative strips
strip_thick = 1.0

# Clips
clip_thick = 2.0

# =============================================================================
# Pedestal body (revolved profile)
# =============================================================================
pedestal = (
    cq.Workplane("XZ")
    .moveTo(base_radius, 0.0)
    .spline([
        (flare_radius, 5.0),
        (26.0, 15.0),
        (22.0, 35.0),
        (20.0, 60.0),
        (19.0, 80.0),
        (shoulder_radius, 95.0),
        (neck_radius, 110.0),
        (top_radius, pedestal_height),
    ])
    .lineTo(0.0, pedestal_height)
    .lineTo(0.0, 0.0)
    .close()
    .revolve(360.0)
)

# Embossed text on the tapered body
t1 = cq.Workplane("XZ", origin=(0.0, 21.0, 55.0)).text("Premier", 6.0, -1.0)
t2 = cq.Workplane("XZ", origin=(0.0, 21.0, 48.0)).text("League", 6.0, -1.0)
pedestal = pedestal.cut(t1).cut(t2)

# =============================================================================
# Serrated crown ring
# =============================================================================
crown_base = (
    cq.Workplane("XY", origin=(0.0, 0.0, crown_z))
    .circle(crown_od_radius)
    .circle(crown_id_radius)
    .extrude(crown_base_h)
)

# Single tooth (triangular prism on ring wall)
tooth_wp = (
    cq.Workplane("YZ", origin=(crown_od_radius, 0.0, crown_z + crown_base_h))
    .moveTo(-4.0, 0.0)
    .lineTo(4.0, 0.0)
    .lineTo(0.0, crown_tooth_h)
    .close()
    .extrude(-(crown_od_radius - crown_id_radius))
)
tooth_solid = tooth_wp.val()

# Array 10 teeth
crown = crown_base
for i in range(ball_count):
    ang = i * 360.0 / ball_count
    t = tooth_solid.rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), ang)
    crown = crown.union(t)

# =============================================================================
# Bearing balls
# =============================================================================
balls = None
for i in range(ball_count):
    a = math.radians(i * 360.0 / ball_count)
    x = crown_od_radius * math.cos(a)
    y = crown_od_radius * math.sin(a)
    b = (
        cq.Workplane("XY")
        .sphere(ball_r)
        .translate((x, y, crown_z + crown_base_h + crown_tooth_h + ball_r))
    )
    if balls is None:
        balls = b
    else:
        balls = balls.union(b)

# =============================================================================
# Main curved arms (mirrored pair)
# =============================================================================
# Right arm – S-curved strip with semicircular rounded bottom tip
arm_r = (
    cq.Workplane("XZ")
    .moveTo(30.0, 10.0)
    .spline([(55.0, 40.0), (50.0, 75.0), (35.0, 105.0), (30.0, 130.0)])
    .lineTo(20.0, 130.0)
    .spline([(22.0, 105.0), (38.0, 75.0), (42.0, 40.0), (20.0, 10.0)])
    .threePointArc((25.0, 5.0), (30.0, 10.0))
    .close()
    .extrude(arm_thick)
    .translate((0.0, -arm_thick / 2.0, 0.0))
)

# Left arm – mirrored geometry
arm_l = (
    cq.Workplane("XZ")
    .moveTo(-30.0, 10.0)
    .spline([(-55.0, 40.0), (-50.0, 75.0), (-35.0, 105.0), (-30.0, 130.0)])
    .lineTo(-20.0, 130.0)
    .spline([(-22.0, 105.0), (-38.0, 75.0), (-42.0, 40.0), (-20.0, 10.0)])
    .threePointArc((-25.0, 5.0), (-30.0, 10.0))
    .close()
    .extrude(arm_thick)
    .translate((0.0, -arm_thick / 2.0, 0.0))
)

# =============================================================================
# Keys bridging handles to body
# =============================================================================
# Parallel key (right side)
key_r = cq.Workplane("XY").box(32.0, key_size, key_size).translate((34.0, 0.0, 70.0))
# Conforming key (left side) – approximated as prismatic bar
key_l = cq.Workplane("XY").box(28.0, key_size, key_size).translate((-32.0, 0.0, 90.0))

# =============================================================================
# Clips (C-shaped hooks)
# =============================================================================
clip_shape = (
    cq.Workplane("XY")
    .moveTo(0.0, -8.0)
    .threePointArc((4.0, -4.0), (4.0, 0.0))
    .lineTo(4.0, 10.0)
    .threePointArc((0.0, 14.0), (-4.0, 10.0))
    .lineTo(-4.0, 0.0)
    .threePointArc((-4.0, -4.0), (0.0, -8.0))
    .close()
    .extrude(clip_thick)
)
clip_r = clip_shape.translate((24.0, 0.0, 100.0))
clip_l = clip_shape.translate((-24.0, 0.0, 100.0))

# =============================================================================
# Four thin decorative S-curved strips
# =============================================================================
def make_strip(y_off, outer_pts, inner_pts):
    s = (
        cq.Workplane("XZ")
        .moveTo(outer_pts[0][0], outer_pts[0][1])
        .spline(outer_pts[1:])
        .lineTo(inner_pts[-1][0], inner_pts[-1][1])
        .spline(inner_pts[-2::-1])
        .close()
        .extrude(strip_thick)
        .translate((0.0, y_off - strip_thick / 2.0, 0.0))
    )
    return s

# Right outer
s1 = make_strip(5.0,
    [(33.0, 5.0), (60.0, 35.0), (54.0, 65.0), (40.0, 95.0), (34.0, 125.0)],
    [(29.0, 5.0), (56.0, 35.0), (50.0, 65.0), (36.0, 95.0), (30.0, 125.0)])
# Right inner
s2 = make_strip(-5.0,
    [(25.0, 5.0), (48.0, 35.0), (42.0, 65.0), (28.0, 95.0), (22.0, 125.0)],
    [(21.0, 5.0), (44.0, 35.0), (38.0, 65.0), (24.0, 95.0), (18.0, 125.0)])
# Left outer
s3 = make_strip(5.0,
    [(-33.0, 5.0), (-60.0, 35.0), (-54.0, 65.0), (-40.0, 95.0), (-34.0, 125.0)],
    [(-29.0, 5.0), (-56.0, 35.0), (-50.0, 65.0), (-36.0, 95.0), (-30.0, 125.0)])
# Left inner
s4 = make_strip(-5.0,
    [(-25.0, 5.0), (-48.0, 35.0), (-42.0, 65.0), (-28.0, 95.0), (-22.0, 125.0)],
    [(-21.0, 5.0), (-44.0, 35.0), (-38.0, 65.0), (-24.0, 95.0), (-18.0, 125.0)])

# =============================================================================
# Union into final assembly
# =============================================================================
result = (
    pedestal
    .union(crown)
    .union(balls)
    .union(arm_r)
    .union(arm_l)
    .union(key_r)
    .union(key_l)
    .union(clip_r)
    .union(clip_l)
    .union(s1)
    .union(s2)
    .union(s3)
    .union(s4)
)