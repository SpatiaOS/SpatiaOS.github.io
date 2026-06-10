import cadquery as cq
import math

# =============================================================================
# Wheel Loader Parameters
# =============================================================================

# --- Overall ---
SCALE = 1.0

# --- Wheels ---
WHEEL_DIAMETER = 50.0
WHEEL_WIDTH = 14.0
WHEEL_RADIUS = WHEEL_DIAMETER / 2.0
WHEEL_TREAD_SIDES = 16          # Polygon facets for knobby tire look
WHEEL_RIM_DIA = 28.0
WHEEL_HUB_DIA = 10.0
TRACK_WIDTH = 50.0              # Center-to-center of left/right wheels

# --- Chassis / Body ---
BODY_LENGTH = 88.0
BODY_WIDTH = 44.0
BODY_HEIGHT = 34.0
BODY_BOTTOM_Z = WHEEL_RADIUS - 8.0
BODY_FRONT_X = -22.0

# --- Cab ---
CAB_LENGTH = 30.0
CAB_WIDTH = 30.0
CAB_HEIGHT = 36.0
CAB_POS_X = 24.0                # Center X of cab
CAB_ROOF_FILLET = 3.0

# --- Bucket ---
BUCKET_WIDTH = 82.0
BUCKET_DEPTH = 30.0             # Bottom length (back to front)
BUCKET_BACK_HEIGHT = 20.0
BUCKET_FRONT_HEIGHT = 36.0
BUCKET_THICKNESS = 2.5
BUCKET_POS_X = -72.0            # Center X of bucket back wall
BUCKET_BOTTOM_Z = 3.0
BUCKET_TOP_INSET = 8.0          # How much the front face leans back at top

# --- Lift Arms ---
ARM_LENGTH = 58.0
ARM_WIDTH = 6.0
ARM_THICKNESS = 9.0
ARM_Z = 48.0
ARM_Y = BODY_WIDTH / 2.0 + 1.5

# --- Exhaust ---
EXHAUST_DIA = 4.5
EXHAUST_HEIGHT = 16.0
EXHAUST_POS_X = 46.0
EXHAUST_POS_Y = 14.0

# --- Axles ---
FRONT_AXLE_X = -46.0
REAR_AXLE_X = 34.0


# =============================================================================
# Helper: Wheel with faceted tire tread
# =============================================================================
def make_wheel():
    """Create a single wheel with polygonal tire, rim, and hub."""
    # Tire: polygon outer edge gives a block-tread appearance
    tire = cq.Workplane("XZ").polygon(nSides=WHEEL_TREAD_SIDES, diameter=WHEEL_DIAMETER).extrude(WHEEL_WIDTH)
    # Cut out rim area
    rim_hole = cq.Workplane("XZ").circle(WHEEL_RIM_DIA / 2).extrude(WHEEL_WIDTH + 1)
    tire = tire.cut(rim_hole)

    # Rim disc (slightly inset)
    rim = (
        cq.Workplane("XZ")
        .circle(WHEEL_RIM_DIA / 2 + 1)
        .extrude(WHEEL_WIDTH - 4)
        .translate((0, 2, 0))
    )

    # Central hub with axle hole
    hub = cq.Workplane("XZ").circle(WHEEL_HUB_DIA / 2 + 2).extrude(WHEEL_WIDTH + 4)
    hub_hole = cq.Workplane("XZ").circle(WHEEL_HUB_DIA / 2).extrude(WHEEL_WIDTH + 5)
    hub = hub.cut(hub_hole)

    return tire.union(rim).union(hub)


# =============================================================================
# 1. Main Body / Chassis
# =============================================================================
body = (
    cq.Workplane("XY")
    .box(BODY_LENGTH, BODY_WIDTH, BODY_HEIGHT)
    .translate((BODY_FRONT_X + BODY_LENGTH / 2, 0, BODY_BOTTOM_Z + BODY_HEIGHT / 2))
    .edges("|Z")
    .fillet(2.0)
)

# =============================================================================
# 2. Operator Cab
# =============================================================================
cab = (
    cq.Workplane("XY")
    .box(CAB_LENGTH, CAB_WIDTH, CAB_HEIGHT)
    .translate((CAB_POS_X, 0, BODY_BOTTOM_Z + BODY_HEIGHT + CAB_HEIGHT / 2))
    .edges("|Z")
    .fillet(CAB_ROOF_FILLET)
)

# Front window cutout
front_window = (
    cq.Workplane("YZ")
    .rect(18, 16)
    .extrude(2)
    .translate((CAB_POS_X - CAB_LENGTH / 2 - 1, 0, BODY_BOTTOM_Z + BODY_HEIGHT + CAB_HEIGHT / 2 + 6))
)
cab = cab.cut(front_window)

# Side window cutouts
side_window = (
    cq.Workplane("XZ")
    .rect(14, 12)
    .extrude(2)
    .translate((CAB_POS_X + 2, CAB_WIDTH / 2 + 1, BODY_BOTTOM_Z + BODY_HEIGHT + CAB_HEIGHT / 2 + 6))
)
cab = cab.cut(side_window)
cab = cab.cut(side_window.translate((0, -CAB_WIDTH - 2, 0)))

# Small beacon / air intake on cab roof
cab_roof_detail = (
    cq.Workplane("XY")
    .circle(3.0)
    .extrude(5)
    .translate((CAB_POS_X - 8, 0, BODY_BOTTOM_Z + BODY_HEIGHT + CAB_HEIGHT + 1))
)
cab = cab.union(cab_roof_detail)

# =============================================================================
# 3. Front Bucket (open-top scoop built from plates)
# =============================================================================
# Local coordinates: back wall at x=0, bottom at z=0, centered on Y axis.

# Bottom plate
bucket_bottom = (
    cq.Workplane("XY")
    .box(BUCKET_DEPTH, BUCKET_WIDTH, BUCKET_THICKNESS)
    .translate((BUCKET_DEPTH / 2, 0, BUCKET_THICKNESS / 2))
)

# Back plate (short vertical wall at x=0)
bucket_back = (
    cq.Workplane("XY")
    .box(BUCKET_THICKNESS, BUCKET_WIDTH, BUCKET_BACK_HEIGHT)
    .translate((BUCKET_THICKNESS / 2, 0, BUCKET_BACK_HEIGHT / 2))
)

# Front plate (tall slanted wall)
slant_len = math.sqrt(BUCKET_TOP_INSET**2 + BUCKET_FRONT_HEIGHT**2)
front_angle = math.degrees(math.atan2(-BUCKET_TOP_INSET, BUCKET_FRONT_HEIGHT))
bucket_front = (
    cq.Workplane("XY")
    .box(BUCKET_THICKNESS, BUCKET_WIDTH, slant_len)
    .rotate((0, 0, -slant_len / 2), (0, 1, -slant_len / 2), front_angle)
    .translate((BUCKET_DEPTH, 0, slant_len / 2))
)

# Side plates (trapezoidal, left and right)
side_profile = [
    (0, 0),
    (BUCKET_DEPTH, 0),
    (BUCKET_DEPTH - BUCKET_TOP_INSET, BUCKET_FRONT_HEIGHT),
    (0, BUCKET_BACK_HEIGHT),
]
bucket_side_left = (
    cq.Workplane("XZ")
    .polyline(side_profile)
    .close()
    .extrude(BUCKET_THICKNESS)
    .translate((0, BUCKET_WIDTH / 2 - BUCKET_THICKNESS, 0))
)
bucket_side_right = bucket_side_left.translate((0, -BUCKET_WIDTH + BUCKET_THICKNESS, 0))

# Assemble bucket and position it in front of the vehicle
bucket = (
    bucket_bottom
    .union(bucket_back)
    .union(bucket_front)
    .union(bucket_side_left)
    .union(bucket_side_right)
    .translate((BUCKET_POS_X, 0, BUCKET_BOTTOM_Z))
)

# =============================================================================
# 4. Lift Arms (side links)
# =============================================================================
# Left arm: thick beam from body side to bucket top-back corner
arm_left = (
    cq.Workplane("XY")
    .box(ARM_LENGTH, ARM_WIDTH, ARM_THICKNESS)
    .rotate((0, 0, 0), (0, 1, 0), -10)          # pitch front end upward
    .translate((-40, ARM_Y, ARM_Z))
)

# Right arm (mirror across centerline)
arm_right = arm_left.translate((0, -2 * ARM_Y, 0))

# Small brackets on bucket where arms attach
bracket_left = (
    cq.Workplane("XY")
    .box(8, ARM_WIDTH + 2, 12)
    .translate((BUCKET_POS_X + 10, ARM_Y, BUCKET_BOTTOM_Z + BUCKET_BACK_HEIGHT - 6))
)
bracket_right = bracket_left.translate((0, -2 * ARM_Y, 0))

# =============================================================================
# 5. Wheels (4x)
# =============================================================================
wheel_fl = make_wheel().translate((FRONT_AXLE_X, TRACK_WIDTH / 2, WHEEL_RADIUS))
wheel_fr = make_wheel().translate((FRONT_AXLE_X, -TRACK_WIDTH / 2 - WHEEL_WIDTH, WHEEL_RADIUS))
wheel_rl = make_wheel().translate((REAR_AXLE_X, TRACK_WIDTH / 2, WHEEL_RADIUS))
wheel_rr = make_wheel().translate((REAR_AXLE_X, -TRACK_WIDTH / 2 - WHEEL_WIDTH, WHEEL_RADIUS))

# =============================================================================
# 6. Exhaust Stack
# =============================================================================
exhaust = (
    cq.Workplane("XY")
    .circle(EXHAUST_DIA / 2)
    .extrude(EXHAUST_HEIGHT)
    .translate((EXHAUST_POS_X, EXHAUST_POS_Y, BODY_BOTTOM_Z + BODY_HEIGHT))
)

# Exhaust cap (rain flap / larger top)
exhaust_cap = (
    cq.Workplane("XY")
    .circle(EXHAUST_DIA / 2 + 1)
    .extrude(2)
    .translate((EXHAUST_POS_X, EXHAUST_POS_Y, BODY_BOTTOM_Z + BODY_HEIGHT + EXHAUST_HEIGHT))
)
exhaust = exhaust.union(exhaust_cap)

# =============================================================================
# 7. Side Steps / Ladder (left side only, visible in iso view)
# =============================================================================
step = cq.Workplane("XY").box(10, 2, 1).translate((CAB_POS_X - 8, BODY_WIDTH / 2 + 1, BODY_BOTTOM_Z + 6))
steps = step.union(step.translate((-4, 0, 10))).union(step.translate((-8, 0, 20)))

# =============================================================================
# 8. Final Assembly
# =============================================================================
result = (
    body
    .union(cab)
    .union(bucket)
    .union(wheel_fl)
    .union(wheel_fr)
    .union(wheel_rl)
    .union(wheel_rr)
    .union(arm_left)
    .union(arm_right)
    .union(bracket_left)
    .union(bracket_right)
    .union(exhaust)
    .union(steps)
)