import cadquery as cq

# ==============================================
# High-rise Building Parameters (units: meters)
# ==============================================
# Plinth (solid ground level base)
plinth_height = 4.0
plinth_x_min = -2.0
plinth_x_max = 20.0
plinth_y_min = -17.0
plinth_y_max = 1.0
plinth_chamfer = 5.0

# Small service podium (back left of base)
podium_x_min = plinth_x_min
podium_x_max = 6.0
podium_y_min = plinth_y_min
podium_y_max = -10.0
podium_wall_h = 6.0
podium_parapet_h = 1.0
podium_wall_t = 0.2
vent_r = 0.08
vent_h = 2.0

# Tower sections
floor_h = 3.0
# Front section (with balconies, shorter)
front_x0 = 0.0
front_x1 = 14.0
front_y0 = -12.0
front_y1 = 0.0
front_num_floors = 18
front_top_z = plinth_height + front_num_floors * floor_h
# Rear section (taller, rises above front section)
rear_x0 = 10.0
rear_x1 = 18.0
rear_y0 = -15.0
rear_y1 = -8.0
rear_num_floors = 22
rear_top_z = plinth_height + rear_num_floors * floor_h

# Balcony details
balcony_proj = 1.8
balcony_thick = 0.3
balcony_margin = 0.2

# Window details
win_recess = 0.15
# Front right facade (2x2 windows per floor)
frt_win_w = 1.6
frt_win_h = 1.1
frt_facade_y_start = rear_y1
frt_facade_y_end = front_y1
frt_facade_length = frt_facade_y_end - frt_facade_y_start
frt_win_margin = (frt_facade_length - 2 * frt_win_w) / 3
frt_win_sill = 0.5
frt_win_gap_v = 0.3
# Rear right facade (long horizontal windows)
rr_win_margin = 1.0
rr_win_h = 1.5
rr_win_sill = 0.9
rr_facade_length = abs(rear_y1 - rear_y0)
# Front facade recesses (behind balconies)
front_opening_margin = 0.5
front_opening_h = 2.4

# Left face vertical fins
num_fins = 4
fin_w = 0.2
fin_proj = 0.2
fin_h = front_top_z - plinth_height
fin_spacing = abs(front_y1 - front_y0) / (num_fins + 1)

# Roof terrace (on top of front section)
terrace_thick = 0.4
terrace_overhang_left = 1.5
terrace_overhang_front = 1.0
terrace_x0 = front_x0 - terrace_overhang_left
terrace_x1 = front_x1
terrace_y0 = front_y0
terrace_y1 = front_y1 + terrace_overhang_front

# Crown structure (top of rear section)
crown_h = 6.0
crown_parapet_h = 1.2
crown_wall_t = 0.2
crown_overhang_right = 0.5
crown_overhang_back = 0.5
crown_overhang_front = 10.0
crown_x0 = rear_x0
crown_x1 = rear_x1 + crown_overhang_right
crown_y0 = rear_y0 - crown_overhang_back
crown_y1 = rear_y1 + crown_overhang_front
crown_chamfer = 5.0
crown_base_z = rear_top_z
crown_top_z = crown_base_z + crown_h

# ----------------------------------------------
# Step 1: Build plinth base with chamfered corner
# ----------------------------------------------
plinth_points = [
    (plinth_x_min, plinth_y_min),
    (plinth_x_max, plinth_y_min),
    (plinth_x_max, plinth_y_max - plinth_chamfer),
    (plinth_x_max - plinth_chamfer, plinth_y_max),
    (plinth_x_min, plinth_y_max),
]
plinth = (
    cq.Workplane("XY")
    .polyline(plinth_points)
    .close()
    .extrude(plinth_height)
)

# ----------------------------------------------
# Step 2: Build back left service podium
# ----------------------------------------------
# Lower solid podium
podium_lower = (
    cq.Workplane("XY")
    .rect(podium_x_max - podium_x_min, podium_y_max - podium_y_min)
    .extrude(podium_wall_h)
    .translate(((podium_x_min + podium_x_max) / 2, (podium_y_min + podium_y_max) / 2, 0))
)
# Parapet walls around roof (shelled hollow top)
podium_parapet = (
    cq.Workplane("XY")
    .rect(podium_x_max - podium_x_min, podium_y_max - podium_y_min)
    .extrude(podium_parapet_h)
    .translate(((podium_x_min + podium_x_max) / 2, (podium_y_min + podium_y_max) / 2, podium_wall_h))
    .faces(">Z")
    .shell(-podium_wall_t)
)
# Roof vent pipes
vent1 = cq.Workplane("XY", origin=(1.0, -13.0, podium_wall_h)).circle(vent_r).extrude(vent_h)
vent2 = cq.Workplane("XY", origin=(3.0, -15.0, podium_wall_h)).circle(vent_r).extrude(vent_h)
# Combine podium parts
podium = podium_lower.union(podium_parapet).union(vent1).union(vent2)

# ----------------------------------------------
# Step 3: Build main tower (front + rear sections)
# ----------------------------------------------
# Front section (shorter, with balconies)
front_section = (
    cq.Workplane("XY")
    .rect(front_x1 - front_x0, front_y1 - front_y0)
    .extrude(front_num_floors * floor_h)
    .translate(((front_x0 + front_x1) / 2, (front_y0 + front_y1) / 2, plinth_height))
)
# Rear section (taller, rises above front)
rear_section = (
    cq.Workplane("XY")
    .rect(rear_x1 - rear_x0, rear_y1 - rear_y0)
    .extrude(rear_num_floors * floor_h)
    .translate(((rear_x0 + rear_x1) / 2, (rear_y0 + rear_y1) / 2, plinth_height))
)
tower = front_section.union(rear_section)

# ----------------------------------------------
# Step 4: Add vertical fins to left tower face
# ----------------------------------------------
fins = cq.Workplane("XY")
for i in range(num_fins):
    fin_y = front_y0 + fin_spacing * (i + 1)
    fin = (
        cq.Workplane("XY")
        .rect(fin_proj, fin_w)
        .extrude(fin_h)
        .translate((front_x0 - fin_proj / 2, fin_y, plinth_height))
    )
    fins = fins.union(fin)
tower = tower.union(fins)

# ----------------------------------------------
# Step 5: Add projecting balconies to front facade
# ----------------------------------------------
balconies = cq.Workplane("XY")
for i in range(front_num_floors):
    z_floor = plinth_height + i * floor_h
    balcony = (
        cq.Workplane("XY")
        .rect(front_x1 - front_x0 - 2 * balcony_margin, balcony_proj)
        .extrude(balcony_thick)
        .translate((
            (front_x0 + front_x1) / 2,
            front_y1 + balcony_proj / 2,
            z_floor
        ))
    )
    balconies = balconies.union(balcony)
tower = tower.union(balconies)

# ----------------------------------------------
# Step 6: Cut recessed windows into facades
# ----------------------------------------------
# Front facade deep openings behind balconies
for i in range(front_num_floors):
    z_floor = plinth_height + i * floor_h
    opening = (
        cq.Workplane("XY")
        .rect(front_x1 - front_x0 - 2 * front_opening_margin, win_recess)
        .extrude(front_opening_h)
        .translate((
            (front_x0 + front_x1) / 2,
            front_y1 - win_recess / 2,
            z_floor + (floor_h - front_opening_h) / 2
        ))
    )
    tower = tower.cut(opening)

# Front right facade: 2x2 grid windows per floor
for i in range(front_num_floors):
    z_floor = plinth_height + i * floor_h
    for j in range(2):
        y_win_start = frt_facade_y_start + frt_win_margin * (j + 1) + j * frt_win_w
        for k in range(2):
            z_win_start = z_floor + frt_win_sill + k * (frt_win_h + frt_win_gap_v)
            window = (
                cq.Workplane("YZ", origin=(front_x1, 0, 0))
                .rect(frt_win_w, frt_win_h)
                .translate((0, y_win_start + frt_win_w / 2, z_win_start + frt_win_h / 2))
                .extrude(-win_recess)
            )
            tower = tower.cut(window)

# Rear right facade: long horizontal band windows per floor
rr_win_w = rr_facade_length - 2 * rr_win_margin
for i in range(rear_num_floors):
    z_floor = plinth_height + i * floor_h
    window = (
        cq.Workplane("YZ", origin=(rear_x1, 0, 0))
        .rect(rr_win_w, rr_win_h)
        .translate((0, (rear_y0 + rear_y1) / 2, z_floor + rr_win_sill + rr_win_h / 2))
        .extrude(-win_recess)
    )
    tower = tower.cut(window)

# ----------------------------------------------
# Step 7: Add roof terrace slab on front section
# ----------------------------------------------
roof_terrace = (
    cq.Workplane("XY")
    .rect(terrace_x1 - terrace_x0, terrace_y1 - terrace_y0)
    .extrude(terrace_thick)
    .translate(((terrace_x0 + terrace_x1) / 2, (terrace_y0 + terrace_y1) / 2, front_top_z))
)

# ----------------------------------------------
# Step 8: Build upper crown structure
# ----------------------------------------------
crown_points = [
    (crown_x0, crown_y0),
    (crown_x1, crown_y0),
    (crown_x1, crown_y1 - crown_chamfer),
    (crown_x1 - crown_chamfer, crown_y1),
    (crown_x0, crown_y1),
]
# Main solid crown block
crown_main = (
    cq.Workplane("XY")
    .polyline(crown_points)
    .close()
    .extrude(crown_h - crown_parapet_h)
    .translate((0, 0, crown_base_z))
)
# Parapet around crown roof (shelled hollow top)
crown_parapet = (
    cq.Workplane("XY")
    .polyline(crown_points)
    .close()
    .extrude(crown_parapet_h)
    .translate((0, 0, crown_base_z + crown_h - crown_parapet_h))
    .faces(">Z")
    .shell(-crown_wall_t)
)
crown = crown_main.union(crown_parapet)

# ----------------------------------------------
# Combine all components into final model
# ----------------------------------------------
result = (
    plinth
    .union(podium)
    .union(tower)
    .union(roof_terrace)
    .union(crown)
)