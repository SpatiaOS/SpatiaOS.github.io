import cadquery as cq

# ==========================================
# Parameters
# ==========================================
tv_width = 120.0
tv_height = 75.0
tv_depth = 50.0

bulge_width = 60.0
bulge_height = 50.0
bulge_depth = 20.0

# Front face layout parameters
front_margin = 2.0
screen_width = 76.0
screen_height = 67.0
control_width = 30.0
control_height = 67.0

# Calculated centers for front features
screen_cx = -17.0
control_cx = 40.0

# ==========================================
# Modeling
# ==========================================

# 1. Main Body
body = cq.Workplane("XY").box(tv_width, tv_depth, tv_height)

# 2. Front Face Recess (creates the outer rim)
# The front face is at Y = -25. XZ plane normal is +Y.
front_recess = (cq.Workplane("XZ", origin=(0, -tv_depth/2, 0))
                .rect(tv_width - 2*front_margin, tv_height - 2*front_margin)
                .extrude(2)) # Extrude 2mm into the body
body = body.cut(front_recess)

# Inner front plane is now at Y = -23

# 3. Screen Bezel and Screen
# Cut sloped bezel using loft
screen_cut = (cq.Workplane("XZ", origin=(screen_cx, -tv_depth/2 + 2, 0))
              .rect(screen_width, screen_height)
              .workplane(offset=10) # 10mm deep into the body
              .rect(screen_width - 12, screen_height - 12)
              .loft())
body = body.cut(screen_cut)

# Add the screen surface
screen_y_offset = -tv_depth/2 + 12 # Y position of the screen inner face
screen = (cq.Workplane("XZ", origin=(screen_cx, screen_y_offset, 0))
          .rect(screen_width - 12.5, screen_height - 12.5) # slightly smaller to fit
          .extrude(-2)) # Extrude outwards towards the front

# Fillet screen front edges to make it look slightly curved/bulging
screen = screen.edges("<Y").fillet(1.5)
body = body.union(screen)

# 4. Control Panel
# Cut control panel main recess
cp_recess = (cq.Workplane("XZ", origin=(control_cx, -tv_depth/2 + 2, 0))
             .rect(control_width, control_height)
             .extrude(2)) # Cut 2mm deeper
body = body.cut(cp_recess)

# Plane for features inside the control panel
cp_plane = cq.Workplane("XZ", origin=(0, -tv_depth/2 + 4, 0))

# Speaker grille recess
speaker_height = 32.0
speaker_cy = -16.0
speaker_recess = (cp_plane
                  .center(control_cx, speaker_cy)
                  .rect(control_width - 4, speaker_height)
                  .extrude(2))
body = body.cut(speaker_recess)

# Speaker grille horizontal lines
speaker_plane = cq.Workplane("XZ", origin=(0, -tv_depth/2 + 6, 0))
for i in range(9):
    z_pos = -4 - i * 3.0
    line = (speaker_plane
            .center(control_cx, z_pos)
            .rect(control_width - 6, 1.5)
            .extrude(-1)) # Extrude out from the recess
    body = body.union(line)

# Top display/slot on control panel
top_slot = (cp_plane
            .center(control_cx, 28)
            .rect(20, 4)
            .extrude(-1))
body = body.union(top_slot)

# Grid of buttons
for row in range(5):
    for col in range(2):
        bx = control_cx - 6 + col * 12
        by = 20 - row * 4
        btn = (cp_plane
               .center(bx, by)
               .rect(10, 2.5)
               .extrude(-1.5))
        body = body.union(btn)

# 5. Back Bulge (CRT tube casing)
bulge = (cq.Workplane("XY", origin=(0, tv_depth/2 + bulge_depth/2, 0))
         .box(bulge_width, bulge_depth, bulge_height))
bulge = bulge.edges("|Z").fillet(5) # Fillet the vertical edges
body = body.union(bulge)

# Top vent/groove detail
top_groove = (cq.Workplane("XY", origin=(0, 10, tv_height/2))
              .rect(90, 8)
              .extrude(-2))
body = body.cut(top_groove)

# 6. Antennas
ant_base_y = tv_depth/2 - 8
ant_base_z = tv_height/2

# Antenna Base Block
ant_base = (cq.Workplane("XY", origin=(0, ant_base_y, ant_base_z + 2))
            .box(30, 8, 4))
body = body.union(ant_base)

# Left Antenna (Telescopic, tilted back and left)
base_l = (cq.Workplane("XY", origin=(-10, ant_base_y, ant_base_z + 4))
          .transformed(rotate=cq.Vector(-20, -35, 0)))
ant_l1 = base_l.circle(0.8).extrude(40)
ant_l2 = base_l.workplane(offset=40).circle(0.5).extrude(60)
tip_l = base_l.workplane(offset=100).circle(1.5).extrude(3)
body = body.union(ant_l1).union(ant_l2).union(tip_l)

# Right Antenna (Telescopic, tilted back and right)
base_r = (cq.Workplane("XY", origin=(10, ant_base_y, ant_base_z + 4))
          .transformed(rotate=cq.Vector(-30, 40, 0)))
ant_r1 = base_r.circle(0.8).extrude(50)
ant_r2 = base_r.workplane(offset=50).circle(0.5).extrude(60)
tip_r = base_r.workplane(offset=110).circle(1.5).extrude(3)
body = body.union(ant_r1).union(ant_r2).union(tip_r)

# Export final result
result = body