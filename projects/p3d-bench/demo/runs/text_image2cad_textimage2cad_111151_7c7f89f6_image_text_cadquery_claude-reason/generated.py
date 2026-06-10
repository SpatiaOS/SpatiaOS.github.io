import cadquery as cq

# ====================== PARAMETERS ======================
# Legs
LEG_SIZE = 25.0            # square cross-section side
LEG_HEIGHT = 93.0          # leg height
LEG_FLARE = 6.0            # extra width at base
LEG_FLARE_H = 15.0         # height of flared portion

# Seat platform
SEAT_W = 100.0             # width (X)
SEAT_D = 80.0              # depth (Y)
SEAT_T = 10.0              # thickness (Z)

# Backrest panel
BACK_W = SEAT_W            # width matches seat
BACK_H = 195.0             # height above seat top
BACK_T = 5.0               # thickness (Y)

# Side arm features (semicircular raised edges)
ARM_R = 42.0               # semicircle radius
ARM_T = 8.0                # arm thickness in X direction

# Leaf motif on backrest
LEAF_W = 65.0              # leaf width
LEAF_H = 160.0             # leaf height
LEAF_RAISED = 1.5          # raised depth from backrest face
LEAF_Z_OFFSET = 15.0       # offset above seat top

# Diamond cutouts
DIAM_SEAT = 12.0           # diamond size on seat
DIAM_BACK = 7.0            # diamond size on backrest
DIAM_SPACING = 10.0        # spacing between backrest diamonds

# ====================== DERIVED VALUES ======================
Z_SEAT = LEG_HEIGHT
Z_TOP = Z_SEAT + SEAT_T
BACK_Y = SEAT_D / 2 - BACK_T / 2
FRONT_Y = BACK_Y - BACK_T / 2

LEG_X = SEAT_W / 2 - LEG_SIZE / 2 - 3
LEG_Y = SEAT_D / 2 - LEG_SIZE / 2 - 3

# ====================== BUILD LEGS ======================
# Four legs with flared bases at seat corners
legs = None
for sx in [-1, 1]:
    for sy in [-1, 1]:
        x, y = sx * LEG_X, sy * LEG_Y

        # Main rectangular column
        col = (cq.Workplane("XY")
               .center(x, y)
               .rect(LEG_SIZE, LEG_SIZE)
               .extrude(LEG_HEIGHT))

        # Flared base: tapers from wider bottom to column width
        flare = (cq.Workplane("XY")
                 .rect(LEG_SIZE + LEG_FLARE, LEG_SIZE + LEG_FLARE)
                 .workplane(offset=LEG_FLARE_H)
                 .rect(LEG_SIZE, LEG_SIZE)
                 .loft()
                 .translate((x, y, 0)))

        leg = col.union(flare)
        legs = leg if legs is None else legs.union(leg)

# ====================== BUILD SEAT ======================
seat = (cq.Workplane("XY")
        .workplane(offset=Z_SEAT)
        .rect(SEAT_W, SEAT_D)
        .extrude(SEAT_T))

# ====================== BUILD BACKREST ======================
backrest = (cq.Workplane("XY")
            .workplane(offset=Z_TOP)
            .center(0, BACK_Y)
            .rect(BACK_W, BACK_T)
            .extrude(BACK_H))

# ====================== COMBINE BASE STRUCTURE ======================
result = legs.union(seat).union(backrest)

# ====================== SIDE ARM FEATURES ======================
# Semicircular half-cylinder arms on left and right seat edges
for side in [-1, 1]:
    x_pos = side * SEAT_W / 2

    # Full cylinder in YZ plane (axis along X) centered at seat edge
    cyl = (cq.Workplane("YZ")
           .center(0, Z_TOP)
           .circle(ARM_R)
           .extrude(ARM_T * 3, both=True)
           .translate((x_pos, 0, 0)))

    # Clip: keep only the upper half within a narrow X strip
    clip = (cq.Workplane("XY")
            .workplane(offset=Z_TOP)
            .center(x_pos, 0)
            .rect(ARM_T, ARM_R * 2 + 2)
            .extrude(ARM_R + 5))

    arm = cyl.intersect(clip)
    result = result.union(arm)

# ====================== LEAF MOTIF ON BACKREST ======================
# Raised teardrop / leaf shape on the front face of the backrest
leaf_z = Z_TOP + LEAF_Z_OFFSET

leaf = (cq.Workplane("XZ")
        .workplane(offset=FRONT_Y + 0.5)
        .center(0, leaf_z)
        .moveTo(0, 0)
        .threePointArc((-LEAF_W / 2, LEAF_H * 0.55), (0, LEAF_H))
        .threePointArc((LEAF_W / 2, LEAF_H * 0.55), (0, 0))
        .close()
        .extrude(-LEAF_RAISED - 0.5))

result = result.union(leaf)

# ====================== DIAMOND CUTOUTS ON SEAT ======================
# Two diamond-shaped through-cuts on the seat surface
for dx, dy in [(-14, -8), (14, -8)]:
    d_cut = (cq.Workplane("XY")
             .transformed(offset=(dx, dy, Z_SEAT - 1), rotate=(0, 0, 45))
             .rect(DIAM_SEAT, DIAM_SEAT)
             .extrude(SEAT_T + 2))
    result = result.cut(d_cut)

# ====================== DIAMOND CUTOUTS ON BACKREST ======================
# Four diamond-shaped through-cuts arranged in a cross pattern
cluster_z = leaf_z + LEAF_H * 0.45

for ddx, ddz in [(0, DIAM_SPACING), (0, -DIAM_SPACING),
                  (-DIAM_SPACING, 0), (DIAM_SPACING, 0)]:
    d_cut = (cq.Workplane("XZ")
             .transformed(
                 offset=(ddx, cluster_z + ddz, BACK_Y),
                 rotate=(0, 0, 45))
             .rect(DIAM_BACK, DIAM_BACK)
             .extrude(BACK_T + 4, both=True))
    result = result.cut(d_cut)