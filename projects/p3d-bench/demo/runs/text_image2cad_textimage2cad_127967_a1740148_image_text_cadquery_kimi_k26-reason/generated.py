import cadquery as cq
import math

# =============================================================================
# PARAMETERS
# =============================================================================

# --- housing_cap (base) ---
base_or = 150.0
base_ir = 130.0
base_h = 104.0
base_recess = 20.0
base_boss_r = 15.0
base_boss_h = 20.0
base_lug_count = 12
base_lug_r_out = 195.0
base_lug_w = 40.0
base_lug_h = 60.0

# --- lever_arm_with_bevel_gear ---
lev_r1 = 125.0
lev_r2 = 90.0
lev_r3 = 68.5
lev_h1 = 20.0
lev_h2 = 30.0
lev_h3 = 30.0
lev_arm_len = 80.0
lev_arm_w = 80.0
lev_arm_t = 60.0
lev_hub_r = 30.0
lev_hub_h = 60.0
lev_bore_r = 15.0
lev_geeth_teeth = 24
lev_geeth_r = 50.0
lev_geeth_w = 8.0
lev_geeth_h = 10.0

# --- spacer rings (12x) ---
spacer_or = 3.0
spacer_ir = 1.6
spacer_h = 3.0
spacer_count = 12
spacer_orbit_r = 120.0

# --- connecting_arm ---
conn_len = 442.5
conn_w = 120.0
conn_t = 62.0
conn_hub_r = 30.0
conn_hub_h = 80.0
conn_bore_r = 15.0
conn_flange_r = 45.0
conn_flange_t = 10.0
conn_flange_holes = 13
conn_flange_hole_r = 3.0
conn_flange_orbit_r = 25.0
conn_lug_count = 3

# --- joint_housing ---
jh_head_w = 94.0
jh_head_d = 132.5
jh_head_h = 100.0
jh_arm_or = 31.0
jh_arm_ir = 22.0
jh_arm_len = 120.0
jh_pin_r = 15.0
jh_pin_depth = 20.0
jh_flange_holes = 12

# --- multi_bore_housing ---
mbh_len = 173.1
mbh_w = 80.0
mbh_h = 76.2
mbh_cross_r = 85.0
mbh_long_r = 35.4
mbh_boss_r = 15.0
mbh_boss_h = 20.0

# --- scroll_housing ---
scroll_r = 35.0
scroll_h = 55.4
scroll_hole_r = 1.5

# --- gripper_jaw (2x) ---
jaw_w = 19.5
jaw_d = 70.9
jaw_h = 126.9
jaw_pivot_r = 15.0
jaw_slot_w = 8.0
jaw_slot_len = 40.0

# --- knob_plug ---
knob_dome_r = 41.25
knob_shank_r = 20.0
knob_shank_h = 24.0
knob_sq = 50.0
knob_h = 60.0

# --- assembly positions ---
shoulder_x = lev_r2 + lev_arm_len
shoulder_z = base_h - base_recess + lev_h1 + lev_hub_h / 2.0
target_dx = 350.0
target_dz = 240.0

# =============================================================================
# BASE
# =============================================================================
base = cq.Workplane("XY").circle(base_or).extrude(base_h)
base = base.faces(">Z").workplane().circle(base_ir).cutBlind(-base_recess)
base = base.faces(">Z").workplane().circle(base_boss_r).extrude(base_boss_h)

lug_shape = (cq.Workplane("XY")
             .box(base_lug_r_out - base_or, base_lug_w, base_lug_h)
             .translate(((base_or + base_lug_r_out) / 2.0, 0, base_lug_h / 2.0)))
lugs = (cq.Workplane("XY")
        .polarArray(radius=0, startAngle=0, angle=360, count=base_lug_count)
        .eachpoint(lambda loc: lug_shape.val().located(loc)))
base = base.union(lugs)

# =============================================================================
# LEVER ARM WITH BEVEL GEAR
# =============================================================================
lev = (cq.Workplane("XY")
       .circle(lev_r1).extrude(lev_h1)
       .faces(">Z").workplane().circle(lev_r2).extrude(lev_h2)
       .faces(">Z").workplane().circle(lev_r3).extrude(lev_h3))

tooth = (cq.Workplane("XY")
         .box(lev_geeth_w, lev_geeth_h, 6.0)
         .translate((lev_geeth_r, 0, 0)))
teeth = (cq.Workplane("XY")
         .polarArray(radius=0, startAngle=0, angle=360, count=lev_geeth_teeth)
         .eachpoint(lambda loc: tooth.val().located(loc)))
lev = lev.union(teeth.translate((0, 0, lev_h1 + lev_h2 + lev_h3)))

arm_web = (cq.Workplane("XY")
           .box(lev_arm_len, lev_arm_w, lev_arm_t)
           .translate((lev_r2 + lev_arm_len / 2.0, 0, lev_h1 + lev_arm_t / 2.0)))
hub = (cq.Workplane("XY")
       .circle(lev_hub_r).extrude(lev_hub_h)
       .translate((lev_r2 + lev_arm_len, 0, lev_h1 + lev_hub_h / 2.0)))
hub = hub.cut(cq.Workplane("XZ").circle(lev_bore_r).extrude(lev_hub_h * 2)
              .translate((lev_r2 + lev_arm_len, 0, lev_h1)))
lev = lev.union(arm_web).union(hub)

lev = lev.cut(cq.Workplane("XZ").circle(lev_bore_r).extrude(200, both=True)
              .translate((0, 0, lev_h1 + lev_h2 / 2.0)))
lev = lev.faces(">Z").workplane().circle(lev_bore_r).cutBlind(-jh_pin_depth)
lev = lev.translate((0, 0, base_h - base_recess))

# =============================================================================
# SPACERS
# =============================================================================
spacer_shape = (cq.Workplane("XY")
                .circle(spacer_or).extrude(spacer_h)
                .faces(">Z").workplane().circle(spacer_ir).cutThruAll()
                .val())
spacers = (cq.Workplane("XY")
           .polarArray(radius=spacer_orbit_r, startAngle=0, angle=360, count=spacer_count)
           .eachpoint(lambda loc: spacer_shape.located(loc)))
spacers = spacers.translate((0, 0, base_h - base_recess + lev_h1 / 2.0))

# =============================================================================
# CONNECTING ARM
# =============================================================================
conn = cq.Workplane("XY").box(conn_len, conn_w, conn_t).translate((conn_len / 2.0, 0, 0))

hub_prof = cq.Workplane("XY").circle(conn_hub_r).extrude(conn_hub_h, both=True)
hub_prof = hub_prof.cut(cq.Workplane("XZ").circle(conn_bore_r).extrude(conn_hub_h * 2))
conn = conn.union(hub_prof)
conn = conn.union(hub_prof.translate((conn_len, 0, 0)))

flange = cq.Workplane("XY").circle(conn_flange_r).extrude(conn_flange_t)
flange = (flange.faces(">Z").workplane()
          .polarArray(radius=conn_flange_orbit_r, startAngle=0, angle=360, count=conn_flange_holes)
          .circle(conn_flange_hole_r).cutThruAll())
conn = conn.union(flange.translate((conn_len, 0, conn_t / 2.0)))

lug_s = cq.Workplane("XY").box(20, 30, 8)
for i in range(conn_lug_count):
    lx = (i + 1) * conn_len / (conn_lug_count + 1)
    conn = conn.union(lug_s.translate((lx, 0, conn_t / 2.0 + 4.0)))

angle = math.degrees(math.atan2(-target_dz, target_dx))
conn = conn.rotate((0, 0, 0), (0, 1, 0), angle)
conn = conn.translate((shoulder_x, 0, shoulder_z))

rad = math.radians(angle)
elbow_x = shoulder_x + conn_len * math.cos(rad)
elbow_z = shoulder_z - conn_len * math.sin(rad)

# =============================================================================
# JOINT HOUSING
# =============================================================================
jh = cq.Workplane("XY").box(jh_head_w, jh_head_d, jh_head_h)
jh = jh.edges("|Z").chamfer(10.0)

arm_tube = (cq.Workplane("XY")
            .circle(jh_arm_or).extrude(jh_arm_len)
            .cut(cq.Workplane("XY").circle(jh_arm_ir).extrude(jh_arm_len)))
jh = jh.union(arm_tube.translate((jh_head_w / 2.0 + jh_arm_len / 2.0, 0, 0)))

jh = jh.cut(cq.Workplane("XZ").circle(jh_pin_r).extrude(200, both=True))
jh = jh.faces(">Z").workplane().circle(jh_pin_r).cutBlind(-jh_pin_depth)

bolt_flange = cq.Workplane("XY").circle(jh_arm_or + 8).extrude(8)
bolt_flange = (bolt_flange.faces(">Z").workplane()
               .polarArray(radius=jh_arm_or + 4, startAngle=0, angle=360, count=jh_flange_holes)
               .circle(1.5).cutThruAll())
jh = jh.union(bolt_flange.translate((jh_head_w / 2.0, 0, -jh_head_h / 2.0)))

jh = jh.translate((elbow_x, 0, elbow_z))

# =============================================================================
# KNOB PLUG
# =============================================================================
knob = cq.Workplane("XY").circle(knob_dome_r).extrude(knob_h)
knob = knob.union(cq.Workplane("XY").circle(knob_shank_r).extrude(knob_shank_h).translate((0, 0, -knob_shank_h)))
knob = knob.union(cq.Workplane("XY").box(knob_sq, knob_sq, 30).translate((0, 0, -knob_shank_h - 30)))
knob = knob.translate((elbow_x, 0, elbow_z + jh_head_h / 2.0))

# =============================================================================
# MULTI-BORE HOUSING
# =============================================================================
mbh = cq.Workplane("XY").box(mbh_len, mbh_w, mbh_h)
mbh = mbh.edges().fillet(10.0)
mbh = mbh.cut(cq.Workplane("XZ").circle(mbh_cross_r).extrude(mbh_w * 2))
mbh = mbh.cut(cq.Workplane("YZ").circle(mbh_long_r).extrude(mbh_len * 2))

boss = cq.Workplane("XY").circle(mbh_boss_r).extrude(mbh_boss_h)
mbh = mbh.union(boss.translate((-mbh_len / 2.0 - mbh_boss_h / 2.0, 0, 0)))

mbh_x = elbow_x + jh_head_w / 2.0 + jh_arm_len - 20.0 + mbh_len / 2.0
mbh = mbh.translate((mbh_x, 0, elbow_z))

# =============================================================================
# SCROLL HOUSING
# =============================================================================
scroll = cq.Workplane("XY").circle(scroll_r).extrude(scroll_h)
scroll = scroll.union(cq.Workplane("XY").box(50, 70, 40).translate((-25, 0, 20)))

mh = cq.Workplane("XY").circle(scroll_hole_r).extrude(scroll_h)
scroll = scroll.cut(mh.translate((20, 20, 0)))
scroll = scroll.cut(mh.translate((20, -20, 0)))
scroll = scroll.cut(mh.translate((-10, 20, 0)))
scroll = scroll.cut(mh.translate((-10, -20, 0)))

scroll = scroll.translate((mbh_x + mbh_len / 2.0 + scroll_r, 0, elbow_z))

# =============================================================================
# GRIPPER JAWS
# =============================================================================
def make_jaw():
    j = cq.Workplane("XY").box(jaw_w, jaw_d * 0.6, jaw_h * 0.5).translate((0, -jaw_d * 0.15, -jaw_h * 0.25))
    j2 = (cq.Workplane("XY").box(jaw_w, jaw_d * 0.5, jaw_h * 0.6)
          .translate((0, jaw_d * 0.25, jaw_h * 0.2))
          .rotate((0, 0, 0), (1, 0, 0), 25))
    j = j.union(j2)
    pivot = cq.Workplane("YZ").circle(jaw_pivot_r).extrude(jaw_w, both=True)
    j = j.union(pivot.translate((0, -jaw_d * 0.3, 0)))
    slot = cq.Workplane("XY").slot2D(jaw_slot_len, jaw_slot_w).extrude(jaw_w * 2).rotate((0, 0, 0), (1, 0, 0), 90)
    j = j.cut(slot)
    for i in range(8):
        t = cq.Workplane("XY").box(4, 2, 2).translate((jaw_w / 2.0, jaw_d * 0.4, -jaw_h * 0.3 + i * 12))
        j = j.union(t)
    return j

gripper_x = mbh_x + mbh_len / 2.0 + scroll_r + 25.0
jaw1 = make_jaw().rotate((0, 0, 0), (1, 0, 0), 18).translate((gripper_x, 14, elbow_z))
jaw2 = make_jaw().rotate((0, 0, 0), (1, 0, 0), -18).translate((gripper_x, -14, elbow_z))

# =============================================================================
# UNIFIED MODEL
# =============================================================================
result = (base
          .union(lev)
          .union(spacers)
          .union(conn)
          .union(jh)
          .union(knob)
          .union(mbh)
          .union(scroll)
          .union(jaw1)
          .union(jaw2))