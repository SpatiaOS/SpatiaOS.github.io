import cadquery as cq

# ==========================================
# Parameters
# ==========================================
body_thickness = 45.0
neck_length = 450.0
neck_width = 45.0
neck_thickness = 15.0
fretboard_thickness = 5.0
hardware_z = body_thickness

# ==========================================
# 1. Main Body
# ==========================================
# Define the right half of the body profile using control points
body_pts_right = [
    (0, -200),     # Bottom center
    (40, -198),    # Flatten bottom for smooth mirroring
    (150, -170),   # Lower bout curve
    (200, -60),    # Lower bout max width
    (160, 40),     # Curve towards waist
    (110, 90),     # Waist minimum width
    (150, 160),    # Upper bout max width
    (110, 240),    # Horn outer curve
    (70, 190),     # Cutaway inner trough
    (30, 218),     # Curve towards neck joint
    (0, 220)       # Top center (neck joint)
]

# Mirror points for the left side to ensure perfect symmetry
body_pts_left = [(-x, y) for x, y in reversed(body_pts_right[1:-1])]
body_all_pts = body_pts_right + body_pts_left

# Create the body solid using a closed spline
body = (cq.Workplane("XY")
        .moveTo(body_all_pts[0][0], body_all_pts[0][1])
        .spline(body_all_pts[1:])
        .close()
        .extrude(body_thickness)
        )

# ==========================================
# 2. F-Holes
# ==========================================
def make_f_hole(x_offset, y_offset, angle):
    """Creates a stylized F-hole solid for boolean cutting."""
    # Top circle
    part1 = (cq.Workplane("XY")
             .workplane(offset=-10)
             .transformed(offset=(x_offset, y_offset, 0), rotate=(0, 0, angle))
             .circle(7).extrude(body_thickness + 20))
    # Bottom circle
    part2 = (cq.Workplane("XY")
             .workplane(offset=-10)
             .transformed(offset=(x_offset, y_offset, 0), rotate=(0, 0, angle))
             .center(0, -70)
             .circle(7).extrude(body_thickness + 20))
    # Connecting slot
    part3 = (cq.Workplane("XY")
             .workplane(offset=-10)
             .transformed(offset=(x_offset, y_offset, 0), rotate=(0, 0, angle))
             .center(0, -35)
             .rect(4, 70).extrude(body_thickness + 20))
    
    return part1.union(part2).union(part3)

# Cut right and left F-holes
f_hole_right = make_f_hole(130, -20, 15)
f_hole_left = make_f_hole(-130, -20, -15)
body = body.cut(f_hole_right).cut(f_hole_left)

# ==========================================
# 3. Neck & Fretboard
# ==========================================
# Neck profile with a chamfered back for a rounded feel
neck = (cq.Workplane("XY")
        .workplane(offset=body_thickness - neck_thickness)
        .center(0, 220 + neck_length/2)
        .box(neck_width, neck_length, neck_thickness)
        .edges("<Z and |Y").chamfer(5)
        )

# Fretboard sitting on top of the neck
fretboard = (cq.Workplane("XY")
             .workplane(offset=body_thickness)
             .center(0, 220 + neck_length/2)
             .box(neck_width + 4, neck_length, fretboard_thickness)
             )

# Frets (22 frets spaced along the fretboard)
fret_y_positions = [220 + i * (neck_length/23) for i in range(1, 23)]
frets = (cq.Workplane("XY")
         .workplane(offset=body_thickness + fretboard_thickness)
         .pushPoints([(0, y) for y in fret_y_positions])
         .box(neck_width + 4, 2, 1)
         )

# ==========================================
# 4. Headstock & Tuners
# ==========================================
# Classic "open book" headstock shape
headstock_pts = [
    (0, 670), (25, 670), (35, 700), (40, 740), 
    (45, 770), (25, 800), (10, 790), (0, 795)
]
hs_left = [(-x, y) for x, y in reversed(headstock_pts[1:-1])]
hs_all_pts = headstock_pts + hs_left

headstock = (cq.Workplane("XY")
             .workplane(offset=body_thickness - neck_thickness)
             .moveTo(hs_all_pts[0][0], hs_all_pts[0][1])
             .polyline(hs_all_pts[1:])
             .close()
             .extrude(12)
             )

# Tuning pegs
tuner_pts = [
    (38, 700), (42, 735), (45, 770),
    (-38, 700), (-42, 735), (-45, 770)
]
tuners = (cq.Workplane("XY")
          .workplane(offset=body_thickness - 3)
          .pushPoints(tuner_pts)
          .circle(5).extrude(15)
          )

# ==========================================
# 5. Hardware & Electronics
# ==========================================
# Pickups
pickup_bridge = cq.Workplane("XY").workplane(offset=hardware_z).pushPoints([(0, 30)]).rect(70, 35).extrude(10)
pickup_neck = cq.Workplane("XY").workplane(offset=hardware_z).pushPoints([(0, 140)]).rect(70, 35).extrude(10)

# Bridge and Tailpiece
bridge = cq.Workplane("XY").workplane(offset=hardware_z).pushPoints([(0, -10)]).rect(80, 12).extrude(12)
tailpiece = cq.Workplane("XY").workplane(offset=hardware_z).pushPoints([(0, -50)]).rect(90, 16).extrude(10)

# Control Knobs (4 knobs on lower bout)
knob_pts = [(100, -100), (140, -90), (110, -140), (150, -130)]
knobs = (cq.Workplane("XY")
         .workplane(offset=hardware_z)
         .pushPoints(knob_pts)
         .circle(12).extrude(10)
         .faces(">Z").edges().chamfer(2)
         )

# Pickup Selector Switch
switch_base = (cq.Workplane("XY")
               .workplane(offset=hardware_z)
               .pushPoints([(-120, 120)])
               .circle(8).extrude(4)
               )
switch_tip = (cq.Workplane("XY")
              .workplane(offset=hardware_z + 4)
              .pushPoints([(-120, 120)])
              .circle(3).extrude(8)
              )
switch = switch_base.union(switch_tip)

# ==========================================
# 6. Pickguard
# ==========================================
pg_pts = [
    (35, 180), (90, 150), (95, 80), (80, 20), (45, 20), (35, 80)
]
pickguard = (cq.Workplane("XY")
             .workplane(offset=hardware_z + 8) # Floating slightly above body
             .moveTo(pg_pts[0][0], pg_pts[0][1])
             .spline(pg_pts[1:])
             .close()
             .extrude(2)
             )

# ==========================================
# Assembly
# ==========================================
# Combine all parts into the final result
result = (body
          .union(neck)
          .union(fretboard)
          .union(frets)
          .union(headstock)
          .union(tuners)
          .union(pickup_bridge)
          .union(pickup_neck)
          .union(bridge)
          .union(tailpiece)
          .union(knobs)
          .union(switch)
          .union(pickguard)
          )