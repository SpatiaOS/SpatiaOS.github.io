import cadquery as cq
import math

# =============================================================================
# Parameters
# =============================================================================

# Central hub (vertical axis is Y)
R_HUB_LOWER = 13.5
R_HUB_UPPER = 9.39
H_HUB_LOWER = 15.0
H_HUB_CONE  = 10.0
H_HUB_UPPER = 10.0
Y_CONE      = H_HUB_LOWER
Y_UPPER     = Y_CONE + H_HUB_CONE
Y_TOP       = Y_UPPER + H_HUB_UPPER

# Eye lug on crown of hub
EYE_THICK   = 5.0
EYE_R       = 5.07
EYE_LEN     = 10.0
EYE_BORE    = 5.0

# Lower mounting lugs (8x, around lower cylinder)
N_LOWER_LUGS   = 8
LOWER_LUG_T    = 1.47
LOWER_LUG_W    = 8.48
LOWER_LUG_H    = 7.48
LOWER_LUG_HOLE = 2.8
Y_LOWER_LUGS   = Y_CONE - 3.0

# Upper lugs (8x alternating around upper cylinder)
N_UPPER_LUGS   = 8
UPPER_LUG_T    = 1.47
UPPER_LUG_W    = 9.0
UPPER_LUG_H    = 9.0
D_TAB_HOLE     = 1.28
UPPER_ML_HOLE  = 2.48
Y_UPPER_LUGS   = Y_UPPER + H_HUB_UPPER / 2.0 - 2.0

# Jaw arms (4x, two mirrored pairs approximated by one lofted shape)
JAW_T          = 6.0
JAW_PIVOT_DIA  = 3.6
JAW_MID_DIA    = 3.6

# Hollow barrels (4x)
BARREL_LEN  = 28.0
BARREL_OD   = 6.76
BARREL_WALL = 0.7
BARREL_ID   = BARREL_OD - 2.0 * BARREL_WALL

# Follower rods (4x)
FOLLOWER_LEN     = 30.0
FOLLOWER_R_HEAD  = 2.53
FOLLOWER_R_STEM  = 0.54

# =============================================================================
# Central hub body
# =============================================================================

hub_lower = cq.Workplane("XZ").circle(R_HUB_LOWER).extrude(H_HUB_LOWER)
hub_cone  = (cq.Workplane("XZ", origin=(0.0, Y_CONE, 0.0))
             .circle(R_HUB_LOWER)
             .workplane(offset=H_HUB_CONE)
             .circle(R_HUB_UPPER)
             .loft(combine=False))
hub_upper = cq.Workplane("XZ", origin=(0.0, Y_UPPER, 0.0)).circle(R_HUB_UPPER).extrude(H_HUB_UPPER)
hub = hub_lower.union(hub_cone).union(hub_upper)

# Eye lug – rectangular base with semicircular end and through-bore
lug_base = (cq.Workplane("YZ", origin=(0.0, Y_TOP, -EYE_R * 2.0))
            .moveTo(0.0, 0.0)
            .lineTo(EYE_LEN, 0.0)
            .lineTo(EYE_LEN, EYE_R * 2.0)
            .lineTo(0.0, EYE_R * 2.0)
            .close()
            .extrude(EYE_THICK / 2.0, both=True))
lug_round = (cq.Workplane("YZ", origin=(0.0, Y_TOP + EYE_LEN, 0.0))
             .circle(EYE_R)
             .extrude(EYE_THICK / 2.0, both=True))
eye_lug = lug_base.union(lug_round)
eye_lug = eye_lug.faces(">X").workplane().hole(EYE_BORE)
hub = hub.union(eye_lug)

# =============================================================================
# Mounting lugs on lower cylinder (8x)
# =============================================================================

lower_lug_proto = (cq.Workplane("YZ", origin=(R_HUB_LOWER,
                                               Y_LOWER_LUGS - LOWER_LUG_H / 2.0,
                                               -LOWER_LUG_W / 2.0))
                   .rect(LOWER_LUG_H, LOWER_LUG_W)
                   .extrude(LOWER_LUG_T)
                   .faces(">X").workplane().hole(LOWER_LUG_HOLE))

for i in range(N_LOWER_LUGS):
    ang = i * 360.0 / N_LOWER_LUGS
    hub = hub.union(lower_lug_proto.rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), ang))

# =============================================================================
# Upper lugs – 4 D-tabs + 4 mounting lugs alternating (8x total)
# =============================================================================

d_tab_proto = (cq.Workplane("YZ", origin=(R_HUB_UPPER,
                                           Y_UPPER_LUGS - UPPER_LUG_H / 2.0,
                                           -UPPER_LUG_W / 2.0))
               .rect(UPPER_LUG_H, UPPER_LUG_W)
               .extrude(UPPER_LUG_T)
               .faces(">X").workplane().hole(D_TAB_HOLE))

uml_proto = (cq.Workplane("YZ", origin=(R_HUB_UPPER,
                                        Y_UPPER_LUGS - UPPER_LUG_H / 2.0,
                                        -UPPER_LUG_W / 2.0))
             .rect(UPPER_LUG_H, UPPER_LUG_W)
             .extrude(UPPER_LUG_T)
             .faces(">X").workplane().hole(UPPER_ML_HOLE))

for i in range(N_UPPER_LUGS):
    ang = i * 45.0
    proto = d_tab_proto if (i % 2 == 0) else uml_proto
    hub = hub.union(proto.rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), ang))

# =============================================================================
# Jaw arm prototype (lofted tapered plate with stiffening rib)
# =============================================================================

jaw = (cq.Workplane("XZ")
       .moveTo(16.0, 0.0).rect(10.0, JAW_T)
       .workplane(offset=-18.0).moveTo(24.0, 0.0).rect(14.0, JAW_T)
       .workplane(offset=-18.0).moveTo(32.0, 0.0).rect(16.0, JAW_T)
       .workplane(offset=-18.0).moveTo(38.0, 0.0).rect(12.0, JAW_T)
       .workplane(offset=-18.0).moveTo(36.0, 0.0).rect(6.0, JAW_T)
       .loft())

# Pivot hole (through thickness, along Z / tangential)
pivot_hole = (cq.Workplane("XY")
              .circle(JAW_PIVOT_DIA / 2.0)
              .extrude(JAW_T + 2.0, both=True)
              .translate((16.0, 0.0, 0.0)))
jaw = jaw.cut(pivot_hole)

# Mid-body hole (orthogonal, along X / radial)
mid_hole = (cq.Workplane("YZ")
            .circle(JAW_MID_DIA / 2.0)
            .extrude(20.0, both=True)
            .translate((28.0, -36.0, 0.0)))
jaw = jaw.cut(mid_hole)

# Longitudinal stiffening ribs on broad faces
rib = (cq.Workplane("XY", origin=(26.0, -36.0, JAW_T / 2.0))
       .rect(16.0, 72.0)
       .extrude(2.0))
jaw = jaw.union(rib)
rib_back = (cq.Workplane("XY", origin=(26.0, -36.0, -JAW_T / 2.0 - 2.0))
            .rect(16.0, 72.0)
            .extrude(2.0))
jaw = jaw.union(rib_back)

# Thin curved support arm behind each jaw
support = (cq.Workplane("XZ")
           .moveTo(15.0, -4.0).rect(3.0, 1.5)
           .workplane(offset=-20.0).moveTo(24.0, -4.0).rect(4.0, 1.5)
           .workplane(offset=-20.0).moveTo(32.0, -4.0).rect(4.0, 1.5)
           .workplane(offset=-20.0).moveTo(36.0, -4.0).rect(3.0, 1.5)
           .loft())
jaw = jaw.union(support)

# =============================================================================
# Barrel prototype (hollow tube with domed end and side boss)
# =============================================================================

barrel = (cq.Workplane("XY")
          .circle(BARREL_OD / 2.0)
          .circle(BARREL_ID / 2.0)
          .extrude(BARREL_LEN))
barrel = barrel.union(cq.Workplane("XY", origin=(0.0, BARREL_LEN, 0.0))
                      .sphere(BARREL_OD / 2.0))
boss = (cq.Workplane("XZ", origin=(0.0, 4.0, BARREL_OD / 2.0))
        .circle(1.2)
        .extrude(2.0, both=True))
barrel = barrel.union(boss)

# =============================================================================
# Follower rod prototype (mushroom head + stem + transverse end boss)
# =============================================================================

follower = (cq.Workplane("XZ")
            .circle(FOLLOWER_R_HEAD)
            .extrude(2.0, both=True)
            .faces(">Y").workplane()
            .circle(FOLLOWER_R_STEM)
            .extrude(FOLLOWER_LEN)
            .faces(">Y").workplane()
            .circle(1.5)
            .extrude(2.5, both=True))

# =============================================================================
# Assemble 4-fold symmetric components
# =============================================================================

assembly = hub

for i in range(4):
    ang = i * 90.0
    ang_rad = math.radians(ang)

    # Jaw arm
    j = jaw.rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), ang)
    assembly = assembly.union(j)

    # Barrel – tilted outward from upper hub
    b = barrel.rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), -30.0)
    b = b.rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), ang)
    b = b.translate((9.0 * math.cos(ang_rad), 28.0, 9.0 * math.sin(ang_rad)))
    assembly = assembly.union(b)

    # Follower rod – steeper angle from lower hub region
    f = follower.rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), -55.0)
    f = f.rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), ang)
    f = f.translate((12.0 * math.cos(ang_rad), 10.0, 12.0 * math.sin(ang_rad)))
    assembly = assembly.union(f)

    # Pivot pin at jaw top (fills the 3.6 mm hole)
    pin_pivot = (cq.Workplane("XY")
                 .circle(JAW_PIVOT_DIA / 2.0)
                 .extrude(JAW_T + 4.0, both=True)
                 .rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), ang)
                 .translate((16.0 * math.cos(ang_rad), 0.0, 16.0 * math.sin(ang_rad))))
    assembly = assembly.union(pin_pivot)

    # Mid-body pin (fills the orthogonal 3.6 mm hole)
    pin_mid = (cq.Workplane("YZ")
               .circle(JAW_MID_DIA / 2.0)
               .extrude(12.0, both=True)
               .rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), ang)
               .translate((28.0 * math.cos(ang_rad), -36.0, 28.0 * math.sin(ang_rad))))
    assembly = assembly.union(pin_mid)

# =============================================================================
# Final result
# =============================================================================

result = assembly