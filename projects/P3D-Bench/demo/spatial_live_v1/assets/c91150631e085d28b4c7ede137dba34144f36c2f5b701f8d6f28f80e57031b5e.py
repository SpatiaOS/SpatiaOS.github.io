import cadquery as cq
import math

# ==============================================================================
# Parameters
# ==============================================================================

# Overall Dimensions
shaft_length = 438.0        # Total envelope length along Y (mm)
shaft_diameter = 6.0        # Backbone rod diameter (mm)
shaft_radius = shaft_diameter / 2.0
x_shaft = 42.0              # Offset of shaft from piston cylinder axis (mm)

# Bushing (part 6f8276e8)
bushing_od = 8.0            # Outer diameter (mm)
bushing_id = 6.0            # Inner bore diameter (mm)
bushing_length = 5.0        # Length along shaft (mm)

# Disc Bosses / Crankpins (part of shaft_bar_with_disc_bosses)
disc_diameter = 30.0        # Outer diameter (mm)
disc_radius = disc_diameter / 2.0
disc_thickness = 14.0       # Thickness along Y (mm)
r_crank = 20.0              # Crank throw / offset from shaft center (mm)

# Cylinder Layout along Y axis (mm)
# Flat-plane 180° layout: Cylinders 1 & 4 at TDC (+Z), 2 & 3 at BDC (-Z)
cyl_y_positions = [75.0, 171.0, 267.0, 363.0]
crank_z_positions = [r_crank, -r_crank, -r_crank, r_crank]

# Connecting Rod (part 6f8201ae)
rod_length = 88.0           # Center-to-center length (mm)
big_end_od = 40.0           # Outer diameter of big end (mm)
big_end_id = 30.0           # Bore diameter of big end (mm)
big_end_thickness = 10.0    # Thickness of big end (mm)
small_end_od = 20.0         # Outer diameter of small end (mm)
small_end_id = 12.0         # Bore diameter for wrist pin (mm)
small_end_thickness = 16.0  # Thickness of small end (mm)

# Piston (part 6f80c918)
piston_od = 50.0            # Outer diameter (mm)
piston_radius = piston_od / 2.0
piston_height = 40.0        # Total height (mm)
wrist_pin_diameter = 12.0   # Transverse wrist-pin bore diameter (mm)
skirt_bore_diameter = 40.0  # Hollow skirt bore diameter (mm)
crown_pocket_diameter = 30.0# Blind pocket beneath crown (mm)

# Spacer Ring (part 6f825008)
spacer_od = 54.56           # Outer diameter (mm)
spacer_id = 50.0            # Inner diameter (mm)
spacer_height = 5.0         # Axial height (mm)


# ==============================================================================
# Helper Modeling Functions
# ==============================================================================

def create_shaft_bar():
    """Creates the 438 mm shaft with integral bracket arms and disc bosses."""
    # Backbone rod spanning the full 438 mm
    rod = (
        cq.Workplane(cq.Plane(origin=(x_shaft, 0, 0), xDir=(1, 0, 0), normal=(0, 1, 0)))
        .circle(shaft_radius)
        .extrude(shaft_length)
    )
    shaft_components = [rod]

    for y_pos, z_crank in zip(cyl_y_positions, crank_z_positions):
        # 30 mm disc boss (14 mm thick)
        disc = (
            cq.Workplane(cq.Plane(origin=(0, y_pos - disc_thickness / 2.0, z_crank),
                                  xDir=(1, 0, 0), normal=(0, 1, 0)))
            .circle(disc_radius)
            .extrude(disc_thickness)
        )

        # Narrow rectangular slot on the front face of each disc
        angle_rad = math.atan2(z_crank, -x_shaft)
        angle_deg = math.degrees(angle_rad)
        slot = (
            cq.Workplane(cq.Plane(origin=(0, y_pos - disc_thickness / 2.0, z_crank),
                                  xDir=(1, 0, 0), normal=(0, 1, 0)))
            .transformed(rotate=cq.Vector(0, 0, angle_deg))
            .rect(22.0, 5.0)
            .extrude(2.0)
        )
        disc = disc.cut(slot)
        shaft_components.append(disc)

        # Rectangular bracket arm connecting backbone rod to disc boss
        dx = -x_shaft
        dz = z_crank
        dist = math.hypot(dx, dz)
        half_w = 4.0
        nx = -dz / dist * half_w
        nz = dx / dist * half_w

        arm_pts = [
            (x_shaft + nx, 0.0 + nz),
            (0.0 + nx, z_crank + nz),
            (0.0 - nx, z_crank - nz),
            (x_shaft - nx, 0.0 - nz),
        ]

        arm = (
            cq.Workplane(cq.Plane(origin=(0, y_pos - disc_thickness / 2.0, 0),
                                  xDir=(1, 0, 0), normal=(0, 1, 0)))
            .polyline(arm_pts)
            .close()
            .extrude(6.0)
        )
        shaft_components.append(arm)

    # Union into single solid part
    shaft_solid = shaft_components[0]
    for comp in shaft_components[1:]:
        shaft_solid = shaft_solid.union(comp)

    return shaft_solid


def create_bushing():
    """Creates the hollow cylindrical bushing at the front tip of the shaft."""
    bushing = (
        cq.Workplane(cq.Plane(origin=(x_shaft, 0, 0), xDir=(1, 0, 0), normal=(0, 1, 0)))
        .circle(bushing_od / 2.0)
        .circle(bushing_id / 2.0)
        .extrude(bushing_length)
    )
    return bushing


def create_connecting_rod(y_center, z_crank, z_pin):
    """Creates an I-beam profiled connecting rod between crank disc and piston pin."""
    # Big-end eye outer cylinder
    big_cyl = (
        cq.Workplane(cq.Plane(origin=(0, y_center - big_end_thickness / 2.0, z_crank),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .circle(big_end_od / 2.0)
        .extrude(big_end_thickness)
    )

    # Small-end eye outer cylinder
    small_cyl = (
        cq.Workplane(cq.Plane(origin=(0, y_center - small_end_thickness / 2.0, z_pin),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .circle(small_end_od / 2.0)
        .extrude(small_end_thickness)
    )

    # Tapered shank body
    z_shank_bot = z_crank + 14.0
    z_shank_top = z_pin - 6.0
    shank_pts = [
        (-7.5, z_shank_bot),
        (7.5, z_shank_bot),
        (5.5, z_shank_top),
        (-5.5, z_shank_top),
    ]
    shank = (
        cq.Workplane(cq.Plane(origin=(0, y_center - 4.0, 0),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .polyline(shank_pts)
        .close()
        .extrude(8.0)
    )

    rod = big_cyl.union(small_cyl).union(shank)

    # Cut big-end bore (30 mm diameter)
    big_bore = (
        cq.Workplane(cq.Plane(origin=(0, y_center - big_end_thickness / 2.0 - 1.0, z_crank),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .circle(big_end_id / 2.0)
        .extrude(big_end_thickness + 2.0)
    )
    rod = rod.cut(big_bore)

    # Cut small-end bore (12 mm diameter)
    small_bore = (
        cq.Workplane(cq.Plane(origin=(0, y_center - small_end_thickness / 2.0 - 1.0, z_pin),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .circle(small_end_id / 2.0)
        .extrude(small_end_thickness + 2.0)
    )
    rod = rod.cut(small_bore)

    # I-beam recess on front and back faces
    recess_len = z_shank_top - z_shank_bot - 14.0
    z_mid = (z_shank_bot + z_shank_top) / 2.0

    rec_front = (
        cq.Workplane(cq.Plane(origin=(0, y_center + 2.5, z_mid),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .rect(6.0, recess_len)
        .extrude(2.0)
    )
    rec_back = (
        cq.Workplane(cq.Plane(origin=(0, y_center - 4.5, z_mid),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .rect(6.0, recess_len)
        .extrude(2.0)
    )
    rod = rod.cut(rec_front).cut(rec_back)

    return rod


def create_piston(y_center, z_pin):
    """Creates a squat reciprocating piston with ring groove, hollow skirt, and pin bore."""
    z_skirt = z_pin - piston_height / 2.0
    z_crown = z_pin + piston_height / 2.0

    # Solid barrel
    piston = (
        cq.Workplane(cq.Plane(origin=(0, y_center, z_skirt),
                              xDir=(1, 0, 0), normal=(0, 0, 1)))
        .circle(piston_radius)
        .extrude(piston_height)
    )

    # 40 mm skirt bore
    skirt_bore = (
        cq.Workplane(cq.Plane(origin=(0, y_center, z_skirt - 1.0),
                              xDir=(1, 0, 0), normal=(0, 0, 1)))
        .circle(skirt_bore_diameter / 2.0)
        .extrude(31.0)
    )
    piston = piston.cut(skirt_bore)

    # 30 mm blind pocket beneath crown
    crown_pocket = (
        cq.Workplane(cq.Plane(origin=(0, y_center, z_pin + 10.0),
                              xDir=(1, 0, 0), normal=(0, 0, 1)))
        .circle(crown_pocket_diameter / 2.0)
        .extrude(5.0)
    )
    piston = piston.cut(crown_pocket)

    # Circumferential ring groove
    ring_groove = (
        cq.Workplane(cq.Plane(origin=(0, y_center, z_crown - 8.0),
                              xDir=(1, 0, 0), normal=(0, 0, 1)))
        .circle(piston_radius + 0.5)
        .circle(piston_radius - 2.0)
        .extrude(2.0)
    )
    piston = piston.cut(ring_groove)

    # Slipper skirt bottom arches
    skirt_cut_front = (
        cq.Workplane(cq.Plane(origin=(0, y_center - 25.0, z_skirt),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .circle(18.0)
        .extrude(10.0)
    )
    skirt_cut_back = (
        cq.Workplane(cq.Plane(origin=(0, y_center + 15.0, z_skirt),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .circle(18.0)
        .extrude(10.0)
    )
    piston = piston.cut(skirt_cut_front).cut(skirt_cut_back)

    # Wrist pin side pocket recesses
    pocket_front = (
        cq.Workplane(cq.Plane(origin=(0, y_center - 25.0, z_pin),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .rect(18.0, 14.0)
        .extrude(4.0)
    )
    pocket_back = (
        cq.Workplane(cq.Plane(origin=(0, y_center + 21.0, z_pin),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .rect(18.0, 14.0)
        .extrude(4.0)
    )
    piston = piston.cut(pocket_front).cut(pocket_back)

    # Transverse 12 mm wrist-pin through bore
    pin_bore = (
        cq.Workplane(cq.Plane(origin=(0, y_center - 26.0, z_pin),
                              xDir=(1, 0, 0), normal=(0, 1, 0)))
        .circle(wrist_pin_diameter / 2.0)
        .extrude(52.0)
    )
    piston = piston.cut(pin_bore)

    return piston


def create_spacer_ring(y_center, z_crown):
    """Creates the thin annular spacer ring seated at the crown of the piston."""
    ring = (
        cq.Workplane(cq.Plane(origin=(0, y_center, z_crown - spacer_height),
                              xDir=(1, 0, 0), normal=(0, 0, 1)))
        .circle(spacer_od / 2.0)
        .circle(spacer_id / 2.0)
        .extrude(spacer_height)
    )
    return ring


# ==============================================================================
# Assembly Construction
# ==============================================================================

# Build all 14 part instances
all_assembly_parts = []

# 1. Shaft bar with disc bosses (1 instance)
shaft_bar = create_shaft_bar()
all_assembly_parts.append(shaft_bar)

# 2. Bushing (1 instance)
bushing = create_bushing()
all_assembly_parts.append(bushing)

# 3, 4, 5. Connecting rods (x4), Pistons (x4), Spacer rings (x4)
for y_cyl, z_crk in zip(cyl_y_positions, crank_z_positions):
    z_pin = z_crk + rod_length
    z_crown = z_pin + piston_height / 2.0

    rod = create_connecting_rod(y_cyl, z_crk, z_pin)
    pst = create_piston(y_cyl, z_pin)
    spc = create_spacer_ring(y_cyl, z_crown)

    all_assembly_parts.extend([rod, pst, spc])

# Combine all components into a unified CadQuery Workplane model
result = cq.Workplane("XY")
for part in all_assembly_parts:
    result = result.add(part)