import cadquery as cq
import math

# =============================================================================
# Parameters – Standard 120 mm axial cooling fan
# =============================================================================

# Overall frame
FAN_SIZE = 120.0          # Width/depth of the square frame
FAN_HEIGHT = 25.0         # Total thickness of the fan assembly
CORNER_RADIUS = 5.0       # Outer corner fillet radius

# Mounting holes
MOUNT_SPACING = 105.0     # Center-to-center distance of opposite mounting holes
MOUNT_HOLE_DIA = 4.2      # Diameter of through-hole in each corner

# Frame airflow opening
FRAME_INNER_DIA = 111.0   # Inner circular cutout for the impeller

# Central hub
HUB_DIA = 40.0            # Outer diameter of the rotor hub
HUB_HEIGHT = FAN_HEIGHT   # Hub extends through the full fan thickness

# Impeller blades
BLADE_COUNT = 7
BLADE_SPAN = 36.0                 # Radial length of each blade
BLADE_CHORD_ROOT = 16.0           # Chord length at the hub
BLADE_CHORD_TIP = 22.0            # Chord length at the blade tip
BLADE_SWEEP = 8.0                 # Tangential offset of the tip (forward/backward sweep)
BLADE_THICKNESS = 1.5             # Physical thickness of the blade plate
BLADE_PITCH = 22.0                # Pitch angle relative to the plane of rotation (degrees)

# Derived geometry
R_HUB = HUB_DIA / 2.0
R_BLADE_START = R_HUB + 0.5       # Small clearance from hub surface


# =============================================================================
# Frame – Square base with rounded corners, central bore, and mounting holes
# =============================================================================

# Outer profile: square extruded to full height, then fillet the vertical corners
frame = (
    cq.Workplane("XY")
    .rect(FAN_SIZE, FAN_SIZE)
    .extrude(FAN_HEIGHT)
    .edges("|Z")
    .fillet(CORNER_RADIUS)
)

# Remove the central circular opening for airflow
frame = frame.cut(cq.Workplane("XY").circle(FRAME_INNER_DIA / 2.0).extrude(FAN_HEIGHT))

# Drill the four corner mounting holes through the entire frame
mount_points = [
    ( MOUNT_SPACING / 2.0,  MOUNT_SPACING / 2.0),
    ( MOUNT_SPACING / 2.0, -MOUNT_SPACING / 2.0),
    (-MOUNT_SPACING / 2.0,  MOUNT_SPACING / 2.0),
    (-MOUNT_SPACING / 2.0, -MOUNT_SPACING / 2.0),
]
frame = (
    frame.faces(">Z")
    .workplane()
    .pushPoints(mount_points)
    .circle(MOUNT_HOLE_DIA / 2.0)
    .cutThruAll()
)


# =============================================================================
# Rotor – Central hub plus pitched, swept blades arranged radially
# =============================================================================

# Start with the hub cylinder
rotor = cq.Workplane("XY").circle(R_HUB).extrude(HUB_HEIGHT)

for i in range(BLADE_COUNT):
    azimuth = i * 360.0 / BLADE_COUNT

    # Define the blade planform in local blade coordinates:
    #   X  -> radial direction (span)
    #   Y  -> tangential direction (chord)
    half_root = BLADE_CHORD_ROOT / 2.0
    half_tip  = BLADE_CHORD_TIP  / 2.0

    planform_pts = [
        (-BLADE_SPAN / 2.0, -half_root),                     # root leading edge
        (-BLADE_SPAN / 2.0,  half_root),                     # root trailing edge
        ( BLADE_SPAN / 2.0,  half_tip + BLADE_SWEEP),        # tip trailing edge
        ( BLADE_SPAN / 2.0, -half_tip + BLADE_SWEEP),       # tip leading edge
    ]

    # Extrude the thin planform to create a solid blade plate
    blade = (
        cq.Workplane("XY")
        .polyline(planform_pts)
        .close()
        .extrude(BLADE_THICKNESS)
    )

    # Apply pitch by rotating around the local tangential (Y) axis
    blade = blade.rotate((0, 0, 0), (0, 1, 0), BLADE_PITCH)

    # Position the blade so its inner edge sits just outside the hub and it is
    # centered vertically within the frame height.
    tx = R_BLADE_START + (BLADE_SPAN / 2.0) * math.cos(math.radians(BLADE_PITCH))
    tz = FAN_HEIGHT / 2.0
    blade = blade.translate((tx, 0, tz))

    # Rotate the blade to its azimuthal position around the fan axis
    blade = blade.rotate((0, 0, 0), (0, 0, 1), azimuth)

    # Merge with the rotor
    rotor = rotor.union(blade)


# =============================================================================
# Final assembly
# =============================================================================
result = frame.union(rotor)