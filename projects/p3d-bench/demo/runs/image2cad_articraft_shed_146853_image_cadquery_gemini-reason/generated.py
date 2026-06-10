import cadquery as cq
import math

# --- Parameters ---
shed_width = 120.0
shed_depth = 160.0
wall_height = 80.0
base_height = 4.0
wall_thick = 4.0
top_plate_h = 2.0

roof_pitch_height = 40.0
overhang_x = 10.0
truss_thick = 2.0
truss_width = 4.0
num_trusses = 11

door_w = 60.0
door_h = 70.0

# --- Base ---
# Main floor base
base = cq.Workplane("XY").box(shed_width, shed_depth, base_height).translate((0, 0, base_height/2))

# --- Walls ---
walls = cq.Workplane("XY")

# Left Wall with vertical grooves for siding detail
left_wall = cq.Workplane("XY").box(wall_thick, shed_depth, wall_height).translate((-shed_width/2 + wall_thick/2, 0, base_height + wall_height/2))
for y in range(-int(shed_depth/2)+8, int(shed_depth/2), 16):
    groove = cq.Workplane("XY").box(1, 1, wall_height).translate((-shed_width/2 + 0.5, y, base_height + wall_height/2))
    left_wall = left_wall.cut(groove)
walls = walls.union(left_wall)

# Right Wall with vertical grooves
right_wall = cq.Workplane("XY").box(wall_thick, shed_depth, wall_height).translate((shed_width/2 - wall_thick/2, 0, base_height + wall_height/2))
for y in range(-int(shed_depth/2)+8, int(shed_depth/2), 16):
    groove = cq.Workplane("XY").box(1, 1, wall_height).translate((shed_width/2 - 0.5, y, base_height + wall_height/2))
    right_wall = right_wall.cut(groove)
walls = walls.union(right_wall)

# Back Wall with vertical grooves
back_wall = cq.Workplane("XY").box(shed_width - 2*wall_thick, wall_thick, wall_height).translate((0, shed_depth/2 - wall_thick/2, base_height + wall_height/2))
for x in range(-int(shed_width/2)+16, int(shed_width/2), 16):
    groove = cq.Workplane("XY").box(1, 1, wall_height).translate((x, shed_depth/2 - 0.5, base_height + wall_height/2))
    back_wall = back_wall.cut(groove)
walls = walls.union(back_wall)

# Front Wall (split for doors)
front_left_w = (shed_width - 2*wall_thick - door_w) / 2
front_left = cq.Workplane("XY").box(front_left_w, wall_thick, wall_height).translate((-shed_width/2 + wall_thick + front_left_w/2, -shed_depth/2 + wall_thick/2, base_height + wall_height/2))
groove = cq.Workplane("XY").box(1, 1, wall_height).translate((-48, -shed_depth/2 + 0.5, base_height + wall_height/2))
front_left = front_left.cut(groove)
walls = walls.union(front_left)

front_right = cq.Workplane("XY").box(front_left_w, wall_thick, wall_height).translate((shed_width/2 - wall_thick - front_left_w/2, -shed_depth/2 + wall_thick/2, base_height + wall_height/2))
groove = cq.Workplane("XY").box(1, 1, wall_height).translate((48, -shed_depth/2 + 0.5, base_height + wall_height/2))
front_right = front_right.cut(groove)
walls = walls.union(front_right)

# Header above doors
header_h = wall_height - door_h
header = cq.Workplane("XY").box(door_w, wall_thick, header_h).translate((0, -shed_depth/2 + wall_thick/2, base_height + door_h + header_h/2))
walls = walls.union(header)

# --- Top Plates ---
# Perimeter framing sitting on top of the walls
top_plate_z = base_height + wall_height + top_plate_h/2
tp = cq.Workplane("XY")
tp = tp.union(cq.Workplane("XY").box(wall_thick, shed_depth, top_plate_h).translate((-shed_width/2 + wall_thick/2, 0, top_plate_z)))
tp = tp.union(cq.Workplane("XY").box(wall_thick, shed_depth, top_plate_h).translate((shed_width/2 - wall_thick/2, 0, top_plate_z)))
tp = tp.union(cq.Workplane("XY").box(shed_width - 2*wall_thick, wall_thick, top_plate_h).translate((0, shed_depth/2 - wall_thick/2, top_plate_z)))
tp = tp.union(cq.Workplane("XY").box(shed_width - 2*wall_thick, wall_thick, top_plate_h).translate((0, -shed_depth/2 + wall_thick/2, top_plate_z)))
walls = walls.union(tp)

# --- Bottom Trim ---
# Trim boards wrapping around the base
trim_h = 6
trim_t = 1
trim_z = base_height + trim_h/2
trim = cq.Workplane("XY")
trim = trim.union(cq.Workplane("XY").box(trim_t, shed_depth+2*trim_t, trim_h).translate((-shed_width/2 - trim_t/2, 0, trim_z)))
trim = trim.union(cq.Workplane("XY").box(trim_t, shed_depth+2*trim_t, trim_h).translate((shed_width/2 + trim_t/2, 0, trim_z)))
trim = trim.union(cq.Workplane("XY").box(shed_width, trim_t, trim_h).translate((0, shed_depth/2 + trim_t/2, trim_z)))
trim = trim.union(cq.Workplane("XY").box(front_left_w + wall_thick, trim_t, trim_h).translate((-shed_width/2 + (front_left_w + wall_thick)/2, -shed_depth/2 - trim_t/2, trim_z)))
trim = trim.union(cq.Workplane("XY").box(front_left_w + wall_thick, trim_t, trim_h).translate((shed_width/2 - (front_left_w + wall_thick)/2, -shed_depth/2 - trim_t/2, trim_z)))

# --- Doors ---
door_thick = 2
d_w = door_w / 2 - 1
d_h = door_h - 1
d_z = base_height + d_h/2 + 0.5
door_center_y = -shed_depth/2 + wall_thick/2
door_front_y = door_center_y - door_thick/2

left_door = cq.Workplane("XY").box(d_w, door_thick, d_h).translate((-door_w/4, door_center_y, d_z))
right_door = cq.Workplane("XY").box(d_w, door_thick, d_h).translate((door_w/4, door_center_y, d_z))

# Cut recessed panels into doors
panel_w = d_w - 8
panel_h = d_h - 8
left_panel = cq.Workplane("XY").box(panel_w, 1, panel_h).translate((-door_w/4, door_front_y + 0.5, d_z))
left_door = left_door.cut(left_panel)
right_panel = cq.Workplane("XY").box(panel_w, 1, panel_h).translate((door_w/4, door_front_y + 0.5, d_z))
right_door = right_door.cut(right_panel)

# Add hinges
hinge = cq.Workplane("XY").box(2, 1, 4)
for hz in [base_height + 15, base_height + d_h/2, base_height + d_h - 15]:
    left_door = left_door.union(hinge.translate((-door_w/2 + 1, door_front_y - 0.5, hz)))
    right_door = right_door.union(hinge.translate((door_w/2 - 1, door_front_y - 0.5, hz)))

doors = left_door.union(right_door)

# --- Roof Trusses ---
def make_beam_pts(p1, p2, w):
    """Generates the 4 corner points of a rectangular beam between p1 and p2."""
    dx = p2[0] - p1[0]
    dz = p2[1] - p1[1]
    length = math.hypot(dx, dz)
    if length == 0: return []
    nx = -dz / length
    nz = dx / length
    return [
        (p1[0] + nx*w/2, p1[1] + nz*w/2),
        (p1[0] - nx*w/2, p1[1] - nz*w/2),
        (p2[0] - nx*w/2, p2[1] - nz*w/2),
        (p2[0] + nx*w/2, p2[1] + nz*w/2)
    ]

span = shed_width
h = roof_pitch_height
ox = overhang_x
oz = overhang_x * (h / (span/2))
w = truss_width

# Define key points for truss geometry
p_peak = (0, h)
p_left_wall = (-span/2, w/2)
p_right_wall = (span/2, w/2)
p_left_end = (-span/2 - ox, -oz)
p_right_end = (span/2 + ox, -oz)

beam_lines = [
    (p_left_end, p_peak),        # Left rafter
    (p_right_end, p_peak),       # Right rafter
    (p_left_wall, p_right_wall), # Bottom chord
    ((0, w), (0, h - w/2)),      # King post
    ((0, w), (-span/4, h/2)),    # Left diagonal
    ((0, w), (span/4, h/2))      # Right diagonal
]

# Build a single truss profile
first = True
for p1, p2 in beam_lines:
    pts = make_beam_pts(p1, p2, w)
    if not pts: continue
    beam = cq.Workplane("XZ").polyline(pts).close().extrude(truss_thick)
    if first:
        truss_base = beam
        first = False
    else:
        truss_base = truss_base.union(beam)

# Distribute trusses along the length of the shed
trusses = cq.Workplane("XY")
truss_spacing = (shed_depth - truss_thick) / (num_trusses - 1)
truss_base_z = base_height + wall_height + top_plate_h

for i in range(num_trusses):
    y_pos = -shed_depth/2 + truss_thick/2 + i * truss_spacing
    t_moved = truss_base.translate((0, y_pos, truss_base_z))
    if i == 0:
        trusses = t_moved
    else:
        trusses = trusses.union(t_moved)

# --- Roof Purlins ---
num_purlins = 5
purlin_w = 3
purlin_t = 1.5
roof_angle = math.degrees(math.atan2(h, span/2))
rad = math.radians(roof_angle)
nx = -math.sin(rad)
nz = math.cos(rad)

purlins = cq.Workplane("XY")
for i in range(num_purlins):
    t_val = i / (num_purlins - 1)
    
    # Left side purlins
    px = (-span/2 - ox) * (1 - t_val) + 0 * t_val
    pz = (-oz) * (1 - t_val) + h * t_val
    cx = px + nx * (w/2 + purlin_t/2)
    cz = pz + nz * (w/2 + purlin_t/2)
    
    p_l = cq.Workplane("XY").box(purlin_w, shed_depth, purlin_t)
    p_l = p_l.rotate((0,0,0), (0,1,0), roof_angle).translate((cx, 0, cz + truss_base_z))
    purlins = purlins.union(p_l)

    # Right side purlins
    px_r = (span/2 + ox) * (1 - t_val) + 0 * t_val
    nx_r = math.sin(rad)
    cx_r = px_r + nx_r * (w/2 + purlin_t/2)
    
    p_r = cq.Workplane("XY").box(purlin_w, shed_depth, purlin_t)
    p_r = p_r.rotate((0,0,0), (0,1,0), -roof_angle).translate((cx_r, 0, cz + truss_base_z))
    purlins = purlins.union(p_r)

# --- Roof Panel ---
# Solid panel covering the front left section of the roof
panel_length = math.hypot(span/2 + ox, h + oz) + 2
panel_depth = 3 * truss_spacing + truss_thick
panel_t = 1.0

px_center = (-span/2 - ox) / 2
pz_center = (-oz + h) / 2
cx_panel = px_center + nx * (w/2 + purlin_t + panel_t/2)
cz_panel = pz_center + nz * (w/2 + purlin_t + panel_t/2)
y_panel = -shed_depth/2 + panel_depth/2

roof_panel = cq.Workplane("XY").box(panel_length, panel_depth, panel_t)
roof_panel = roof_panel.rotate((0,0,0), (0,1,0), roof_angle).translate((cx_panel, y_panel, cz_panel + truss_base_z))

# --- Final Assembly ---
result = (base
          .union(walls)
          .union(trim)
          .union(doors)
          .union(trusses)
          .union(purlins)
          .union(roof_panel)
          )