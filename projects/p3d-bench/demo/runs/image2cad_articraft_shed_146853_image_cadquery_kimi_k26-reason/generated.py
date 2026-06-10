import cadquery as cq
from math import tan, radians, cos, sin, sqrt

# =============================================================================
# Parameters
# =============================================================================

# Overall building dimensions
building_width = 4000.0       # Length of front/back gable walls (X direction)
building_depth = 3000.0       # Length of side walls (Y direction)
wall_height = 2200.0          # Height of side walls to top plate

# Framing lumber
stud_width = 50.0             # Stud width in wall plane
stud_depth = 100.0            # Wall thickness (stud depth)
plate_height = 50.0           # Bottom / top plate height
stud_spacing = 600.0          # On-center spacing of studs

# Roof
roof_pitch = 30.0             # Roof pitch in degrees
rafter_width = 50.0           # Rafter width (along ridge / Y direction)
rafter_depth = 100.0          # Rafter thickness (perpendicular to slope)
ridge_width = 100.0           # Ridge beam vertical dimension
ridge_depth = 100.0           # Ridge beam horizontal dimension (along Y)
overhang = 300.0              # Horizontal roof overhang at eaves and gables

# Door (double door on front gable wall)
door_width = 1600.0
door_height = 2000.0
door_offset = 600.0           # Distance from left corner to left side of door
door_thickness = 40.0
header_height = 100.0         # Header above door

# Sheathing
sheathing_thick = 20.0        # Wall and roof sheathing thickness

# =============================================================================
# Derived values
# =============================================================================

pitch_rad = radians(roof_pitch)
rafter_run = building_width / 2.0
rafter_rise = rafter_run * tan(pitch_rad)
rafter_length = sqrt(rafter_run ** 2 + rafter_rise ** 2)
stud_height = wall_height - 2.0 * plate_height  # Studs between plates
roof_slope_len = rafter_length + overhang / cos(pitch_rad)

# Mid-point of each roof half (along slope) for rafter / sheathing placement
x_mid = (building_width / 2.0 - overhang) / 2.0
z_mid = wall_height + rafter_rise / 2.0 - overhang * tan(pitch_rad) / 2.0

# =============================================================================
# Helper to place a centered box
# =============================================================================

def make_box(w, d, h, x, y, z):
    """Return a box centered at (x,y,z)."""
    return cq.Workplane("XY").box(w, d, h).translate((x, y, z))

# =============================================================================
# Build list of all solids
# =============================================================================

solids = []

# -----------------------------------------------------------------------------
# Bottom plates (four walls)
# -----------------------------------------------------------------------------
solids.append(make_box(building_width, stud_depth, plate_height,
                      building_width / 2.0, 0.0, plate_height / 2.0))
solids.append(make_box(building_width, stud_depth, plate_height,
                      building_width / 2.0, building_depth, plate_height / 2.0))
solids.append(make_box(stud_depth, building_depth, plate_height,
                      0.0, building_depth / 2.0, plate_height / 2.0))
solids.append(make_box(stud_depth, building_depth, plate_height,
                      building_width, building_depth / 2.0, plate_height / 2.0))

# -----------------------------------------------------------------------------
# Top plates (side walls only; gable ends use continuous studs to peak)
# -----------------------------------------------------------------------------
solids.append(make_box(building_width, stud_depth, plate_height,
                      building_width / 2.0, 0.0, wall_height - plate_height / 2.0))
solids.append(make_box(building_width, stud_depth, plate_height,
                      building_width / 2.0, building_depth, wall_height - plate_height / 2.0))
solids.append(make_box(stud_depth, building_depth, plate_height,
                      0.0, building_depth / 2.0, wall_height - plate_height / 2.0))
solids.append(make_box(stud_depth, building_depth, plate_height,
                      building_width, building_depth / 2.0, wall_height - plate_height / 2.0))

# -----------------------------------------------------------------------------
# Side wall studs (left and right rectangular walls)
# -----------------------------------------------------------------------------
n_side = int(building_depth / stud_spacing) + 1
for i in range(n_side + 1):
    y = i * stud_spacing
    if y > building_depth:
        y = building_depth
    solids.append(make_box(stud_depth, stud_width, stud_height,
                          0.0, y, wall_height / 2.0))
    solids.append(make_box(stud_depth, stud_width, stud_height,
                          building_width, y, wall_height / 2.0))
    if y >= building_depth:
        break

# -----------------------------------------------------------------------------
# Gable end wall studs (front and back)
# -----------------------------------------------------------------------------
def gable_height_at_x(x):
    """Total wall height at position x for the gable end (triangle)."""
    dist_from_edge = building_width / 2.0 - abs(x - building_width / 2.0)
    return wall_height + dist_from_edge * tan(pitch_rad)

n_gable = int(building_width / stud_spacing) + 1
for i in range(n_gable + 1):
    x = i * stud_spacing
    if x > building_width:
        x = building_width
    h = gable_height_at_x(x) - plate_height
    z = plate_height + h / 2.0
    # Back wall
    solids.append(make_box(stud_width, stud_depth, h, x, building_depth, z))
    # Front wall: skip the door opening, frame separately below
    if not (door_offset - stud_width / 2.0 < x < door_offset + door_width + stud_width / 2.0):
        solids.append(make_box(stud_width, stud_depth, h, x, 0.0, z))
    if x >= building_width:
        break

# -----------------------------------------------------------------------------
# Door framing (front wall)
# -----------------------------------------------------------------------------
# Jack studs
jack_h = door_height - plate_height
solids.append(make_box(stud_width, stud_depth, jack_h,
                      door_offset, 0.0, plate_height + jack_h / 2.0))
solids.append(make_box(stud_width, stud_depth, jack_h,
                      door_offset + door_width, 0.0, plate_height + jack_h / 2.0))

# Header
solids.append(make_box(door_width + 2.0 * stud_width, stud_depth, header_height,
                      door_offset + door_width / 2.0, 0.0,
                      door_height + header_height / 2.0))

# Cripple studs above header
n_crip = max(1, int(door_width / stud_spacing))
for i in range(n_crip + 1):
    x = door_offset + i * (door_width / n_crip)
    if x > door_offset + door_width:
        x = door_offset + door_width
    top_h = gable_height_at_x(x)
    cripple_h = top_h - (door_height + header_height)
    if cripple_h > 10.0:
        solids.append(make_box(stud_width, stud_depth, cripple_h,
                              x, 0.0,
                              door_height + header_height + cripple_h / 2.0))
    if x >= door_offset + door_width:
        break

# -----------------------------------------------------------------------------
# Roof rafters
# -----------------------------------------------------------------------------
n_rafters = int(building_depth / stud_spacing) + 1
for i in range(n_rafters):
    y = i * stud_spacing
    if y > building_depth:
        y = building_depth
    # Left rafter
    r = cq.Workplane("XY").box(roof_slope_len, rafter_width, rafter_depth)
    r = r.rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), roof_pitch)
    r = r.translate((x_mid, y, z_mid))
    solids.append(r)
    # Right rafter
    r2 = cq.Workplane("XY").box(roof_slope_len, rafter_width, rafter_depth)
    r2 = r2.rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), -roof_pitch)
    r2 = r2.translate((building_width - x_mid, y, z_mid))
    solids.append(r2)
    if y >= building_depth:
        break

# -----------------------------------------------------------------------------
# Ridge beam
# -----------------------------------------------------------------------------
ridge_length = building_depth + 2.0 * overhang
solids.append(make_box(ridge_depth, ridge_length, ridge_width,
                      building_width / 2.0, building_depth / 2.0,
                      wall_height + rafter_rise + ridge_width / 2.0))

# -----------------------------------------------------------------------------
# Wall sheathing
# -----------------------------------------------------------------------------
# Front wall (gable shape) – extrude profile, rotate to vertical, cut door
front_pts = [
    (0.0, 0.0),
    (building_width, 0.0),
    (building_width, wall_height),
    (building_width / 2.0, wall_height + rafter_rise),
    (0.0, wall_height)
]
front_sheath = (cq.Workplane("XY")
                .polyline(front_pts).close()
                .extrude(sheathing_thick)
                .rotate((0.0, 0.0, 0.0), (1.0, 0.0, 0.0), 90.0)
                .translate((0.0, -stud_depth / 2.0, 0.0)))
# Cut door opening
door_cut = make_box(door_width, sheathing_thick * 3.0,
                    door_height + header_height,
                    door_offset + door_width / 2.0,
                    -stud_depth / 2.0,
                    (door_height + header_height) / 2.0)
front_sheath = front_sheath.cut(door_cut)
solids.append(front_sheath)

# Back wall (same gable shape, no door)
back_sheath = (cq.Workplane("XY")
               .polyline(front_pts).close()
               .extrude(sheathing_thick)
               .rotate((0.0, 0.0, 0.0), (1.0, 0.0, 0.0), 90.0)
               .translate((0.0, building_depth + stud_depth / 2.0, 0.0)))
solids.append(back_sheath)

# Side walls (simple rectangles)
solids.append(make_box(sheathing_thick, building_depth, wall_height,
                      -stud_depth / 2.0 - sheathing_thick / 2.0,
                      building_depth / 2.0, wall_height / 2.0))
solids.append(make_box(sheathing_thick, building_depth, wall_height,
                      building_width + stud_depth / 2.0 + sheathing_thick / 2.0,
                      building_depth / 2.0, wall_height / 2.0))

# -----------------------------------------------------------------------------
# Roof sheathing (two sloped planes)
# -----------------------------------------------------------------------------
roof_wid = building_depth + 2.0 * overhang
normal_offset = rafter_depth / 2.0 + sheathing_thick / 2.0
nx = -sin(pitch_rad)
nz = cos(pitch_rad)

# Left side
rs = cq.Workplane("XY").box(roof_slope_len, roof_wid, sheathing_thick)
rs = rs.rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), roof_pitch)
rs = rs.translate((x_mid + normal_offset * nx,
                   building_depth / 2.0,
                   z_mid + normal_offset * nz))
solids.append(rs)

# Right side
rs2 = cq.Workplane("XY").box(roof_slope_len, roof_wid, sheathing_thick)
rs2 = rs2.rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), -roof_pitch)
rs2 = rs2.translate((building_width - x_mid + normal_offset * sin(pitch_rad),
                     building_depth / 2.0,
                     z_mid + normal_offset * nz))
solids.append(rs2)

# -----------------------------------------------------------------------------
# Door panels (double doors)
# -----------------------------------------------------------------------------
door_half = (door_width - 20.0) / 2.0  # 20 mm gap between leaves
solids.append(make_box(door_half, door_thickness, door_height,
                      door_offset + door_half / 2.0,
                      -stud_depth / 2.0 - door_thickness / 2.0,
                      plate_height + door_height / 2.0))
solids.append(make_box(door_half, door_thickness, door_height,
                      door_offset + door_width - door_half / 2.0,
                      -stud_depth / 2.0 - door_thickness / 2.0,
                      plate_height + door_height / 2.0))

# =============================================================================
# Union everything into a single result
# =============================================================================

result = solids[0]
for solid in solids[1:]:
    result = result.union(solid)