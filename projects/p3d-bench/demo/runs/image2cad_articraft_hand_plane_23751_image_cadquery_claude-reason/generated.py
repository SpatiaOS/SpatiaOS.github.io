import cadquery as cq

# ============================================================
# Dual Ball Trailer Hitch Mount - Parametric Model
# Swivel platform with two different-sized hitch balls
# and central locking/pivot mechanism
# ============================================================

# --- Base Plate Parameters ---
plate_length = 200.0          # Total length of base plate
plate_width = 115.0           # Maximum width of base plate
plate_thickness = 12.0        # Plate thickness
plate_fillet = 4.0            # Fillet radius on vertical edges
cutout_radius = 42.0          # Radius of curved side cutouts
cutout_depth = 24.0           # How deep cutouts go into plate width

# --- Ball Mount Parameters ---
ball1_dia = 50.8              # Left ball diameter (2 inch)
ball2_dia = 44.45             # Right ball diameter (1-7/8 inch)
neck_dia = 25.0               # Ball shank diameter
neck_height = 20.0            # Ball shank height
collar_dia = 42.0             # Base collar diameter
collar_height = 7.0           # Base collar height
ball_spacing = 140.0          # Center-to-center distance

# --- Central Swivel Mechanism ---
swivel_base_dia = 55.0        # Lower cylinder diameter
swivel_base_height = 16.0     # Lower cylinder height
swivel_disc_dia = 48.0        # Upper disc diameter
swivel_disc_height = 5.0      # Upper disc height
bolt_dia = 12.0               # Center bolt shaft diameter
bolt_height = 22.0            # Bolt shaft exposed height
washer_dia = 30.0             # Washer outer diameter
washer_height = 4.0           # Washer thickness
knob_dia = 22.0               # Top nut/knob diameter
knob_height = 12.0            # Top nut height

# --- Accessories ---
pin_dia = 8.0                 # Alignment pin diameter
pin_height = 28.0             # Pin height above plate
thumb_screw_dia = 7.0         # Side thumb screw shaft diameter
thumb_screw_head_dia = 13.0   # Thumb screw head diameter
thumb_screw_length = 14.0     # Thumb screw shaft length
thumb_screw_head_len = 8.0    # Thumb screw head length
mount_hole_dia = 11.0         # Mounting hole diameter

# ============================================================
# Step 1: Base plate with bowtie/dogbone profile
# ============================================================

# Start with solid rectangular plate
plate = (
    cq.Workplane("XY")
    .box(plate_length, plate_width, plate_thickness,
         centered=(True, True, False))
)

# Cut curved notches from front and back edges to create
# the characteristic narrowed middle section
cy = plate_width / 2 + cutout_radius - cutout_depth

front_cutout = (
    cq.Workplane("XY")
    .transformed(offset=(0, cy, 0))
    .circle(cutout_radius)
    .extrude(plate_thickness + 2)
)

back_cutout = (
    cq.Workplane("XY")
    .transformed(offset=(0, -cy, 0))
    .circle(cutout_radius)
    .extrude(plate_thickness + 2)
)

plate = plate.cut(front_cutout).cut(back_cutout)

# Round vertical edges and add top chamfer
plate = plate.edges("|Z").fillet(plate_fillet)
plate = plate.edges(">Z").chamfer(1.0)

# ============================================================
# Step 2: Mounting holes through the plate
# ============================================================
plate = (
    plate
    .faces(">Z")
    .workplane()
    .pushPoints([(35, 0), (50, 0), (42, -14)])
    .circle(mount_hole_dia / 2)
    .cutThruAll()
)

# ============================================================
# Step 3: Left ball mount (larger 2" hitch ball)
# ============================================================
bx1 = -ball_spacing / 2

# Raised platform pad under the ball mount
left_pad = (
    cq.Workplane("XY")
    .transformed(offset=(bx1, 0, plate_thickness))
    .circle(collar_dia / 2 + 5)
    .extrude(3.0)
)

# Base collar cylinder
left_collar = (
    cq.Workplane("XY")
    .transformed(offset=(bx1, 0, plate_thickness + 3.0))
    .circle(collar_dia / 2)
    .extrude(collar_height)
)

# Neck/shank
left_neck = (
    cq.Workplane("XY")
    .transformed(offset=(bx1, 0, plate_thickness + 3.0 + collar_height))
    .circle(neck_dia / 2)
    .extrude(neck_height)
)

# Spherical hitch ball
ball_z1 = plate_thickness + 3.0 + collar_height + neck_height + ball1_dia * 0.22
left_ball = (
    cq.Workplane("XY")
    .sphere(ball1_dia / 2)
    .translate((bx1, 0, ball_z1))
)

# ============================================================
# Step 4: Right ball mount (smaller 1-7/8" hitch ball)
# ============================================================
bx2 = ball_spacing / 2

right_pad = (
    cq.Workplane("XY")
    .transformed(offset=(bx2, 0, plate_thickness))
    .circle(collar_dia / 2 + 5)
    .extrude(3.0)
)

right_collar = (
    cq.Workplane("XY")
    .transformed(offset=(bx2, 0, plate_thickness + 3.0))
    .circle(collar_dia / 2)
    .extrude(collar_height)
)

right_neck = (
    cq.Workplane("XY")
    .transformed(offset=(bx2, 0, plate_thickness + 3.0 + collar_height))
    .circle(neck_dia / 2)
    .extrude(neck_height)
)

ball_z2 = plate_thickness + 3.0 + collar_height + neck_height + ball2_dia * 0.22
right_ball = (
    cq.Workplane("XY")
    .sphere(ball2_dia / 2)
    .translate((bx2, 0, ball_z2))
)

# ============================================================
# Step 5: Central swivel/locking mechanism
# ============================================================

# Lower cylindrical swivel base
swivel_base = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, plate_thickness))
    .circle(swivel_base_dia / 2)
    .extrude(swivel_base_height)
)

# Upper disc/flange
zd = plate_thickness + swivel_base_height
swivel_disc = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, zd))
    .circle(swivel_disc_dia / 2)
    .extrude(swivel_disc_height)
)

# Threaded bolt shaft
zb = zd + swivel_disc_height
bolt_shaft = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, zb))
    .circle(bolt_dia / 2)
    .extrude(bolt_height)
)

# Flat washer
zw = zb + bolt_height
bolt_washer = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, zw))
    .circle(washer_dia / 2)
    .extrude(washer_height)
)

# Hexagonal nut/knob on top
zk = zw + washer_height
top_knob = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, zk))
    .polygon(6, knob_dia)
    .extrude(knob_height)
)

# ============================================================
# Step 6: Alignment/locking pin near swivel
# ============================================================
pin = (
    cq.Workplane("XY")
    .transformed(offset=(-24, 16, plate_thickness))
    .circle(pin_dia / 2)
    .extrude(pin_height)
)

# ============================================================
# Step 7: Side thumb screw on swivel (horizontal)
# Extruded along Y-axis using XZ workplane
# ============================================================
screw_z = plate_thickness + swivel_base_height + swivel_disc_height * 0.5

# Screw shaft - extends outward from swivel disc
screw_shaft = (
    cq.Workplane("XZ")
    .transformed(offset=(18, screw_z, swivel_disc_dia / 2))
    .circle(thumb_screw_dia / 2)
    .extrude(thumb_screw_length)
)

# Screw knurled head
screw_head = (
    cq.Workplane("XZ")
    .transformed(offset=(18, screw_z,
                         swivel_disc_dia / 2 + thumb_screw_length))
    .circle(thumb_screw_head_dia / 2)
    .extrude(thumb_screw_head_len)
)

# ============================================================
# Step 8: Assemble all components
# ============================================================
result = (
    plate
    # Left ball mount
    .union(left_pad)
    .union(left_collar)
    .union(left_neck)
    .union(left_ball)
    # Right ball mount
    .union(right_pad)
    .union(right_collar)
    .union(right_neck)
    .union(right_ball)
    # Central swivel mechanism
    .union(swivel_base)
    .union(swivel_disc)
    .union(bolt_shaft)
    .union(bolt_washer)
    .union(top_knob)
    # Accessories
    .union(pin)
    .union(screw_shaft)
    .union(screw_head)
)