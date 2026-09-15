import cadquery as cq
from cadquery import Vector
import math

# ---------------------------------------------------------------
# Parameters (estimated from the image proportions)
# Interpretation: a hand-cranked geared winch / planetary gear
# demonstration model:
#   - triangular stand plate on two ground rails
#   - horizontal axle with rope drum and cranked handle arms
#   - large internal (ring) gear fixed to the rear rail
#   - spoked sun gear on the axle + one planet pinion meshing both
# ---------------------------------------------------------------

# Global layout
axle_height = 105.0          # height of the main horizontal axis above ground
plate_thk   = 10.0           # thickness of triangular stand plate (Y direction)

# Ground rails
rail_len    = 140.0
rail_h      = 15.0
front_rail_w = 30.0
rear_rail_w  = 20.0

# Triangular stand plate
plate_base_half = 60.0
plate_top_half  = 15.0

# Drum / axle / crank hub
drum_r      = 16.0
drum_len    = 55.0
hub_r       = 11.0
hub_len     = 15.0
axle_r      = 6.0
bore_r      = 6.0
bore_depth  = 10.0

# Ring gear (internal teeth)
ring_outer_r = 92.0
ring_root_r  = 84.0          # internal tooth root
ring_tip_r   = 76.0          # internal tooth tip
ring_width   = 30.0
ring_teeth   = 40
ring_y0      = 15.0          # start position along axle (Y)

# Sun gear (spoked, external teeth)
sun_root_r  = 36.0
sun_tip_r   = 44.0
sun_rim_in  = 28.0
sun_hub_r   = 10.0
sun_width   = 15.0
sun_teeth   = 20
sun_y0      = 22.0

# Planet pinion
planet_root_r = 16.0
planet_tip_r  = 24.0
planet_width  = 15.0
planet_teeth  = 10
center_dist   = 60.0         # sun-planet centre distance

# Lever / crank arms (angles measured in XZ plane from +X toward +Z)
arm_sec      = 10.0          # square cross-section of arms
arm1_ang, arm1_len = 125.0, 190.0
arm2_ang, arm2_len = 97.0, 120.0
crank_ang, crank_len = -15.0, 55.0
grip_r, grip_len = 8.0, 42.0
crank_grip_r, crank_grip_len = 7.0, 32.0
arm_y0 = -70.0               # front face plane of the crank hub

# ---------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------
def box_solid(dx, dy, dz, base):
    """Axis-aligned box from a base corner."""
    return cq.Workplane("XY").add(cq.Solid.makeBox(dx, dy, dz, Vector(*base)))

def cyl_solid(r, h, base, direction):
    """Cylinder from base point along direction."""
    return cq.Workplane("XY").add(
        cq.Solid.makeCylinder(r, h, Vector(*base), Vector(*direction)))

def polar_boxes(count, dx, dy, dz, radius_start, height):
    """Ring of radial tooth boxes arrayed about the Z axis."""
    teeth = None
    for i in range(count):
        b = box_solid(dx, dy, dz, (radius_start, -dy / 2.0, 0))
        b = b.rotate((0, 0, 0), (0, 0, 1), i * 360.0 / count)
        teeth = b if teeth is None else teeth.union(b)
    return teeth

def to_axle_plane(wp, y0):
    """Rotate a gear built in XY (axis Z) so its axis lies along Y, then lift."""
    return wp.rotate((0, 0, 0), (1, 0, 0), -90).translate((0, y0, axle_height))

# ---------------------------------------------------------------
# Frame: ground rails + triangular stand plate
# ---------------------------------------------------------------
front_rail = box_solid(rail_len, front_rail_w, rail_h,
                       (-rail_len / 2, -10.0, 0))
rear_rail = box_solid(rail_len, rear_rail_w, rail_h,
                      (-rail_len / 2, 20.0, 0))

# Plate drawn in XY (local +Y becomes -Z after rotation), then flipped upright
plate = (cq.Workplane("XY")
         .polyline([(-plate_base_half, 0), (plate_base_half, 0),
                    (plate_top_half, -axle_height), (-plate_top_half, -axle_height)])
         .close().extrude(plate_thk)
         .rotate((0, 0, 0), (1, 0, 0), -90))

# ---------------------------------------------------------------
# Drum, hub and axle along Y
# ---------------------------------------------------------------
drum = cyl_solid(drum_r, drum_len, (0, -drum_len, axle_height), (0, 1, 0))
crank_hub = cyl_solid(hub_r, hub_len, (0, arm_y0, axle_height), (0, 1, 0))
axle = cyl_solid(axle_r, 100.0, (0, -60.0, axle_height), (0, 1, 0))
bore = cyl_solid(bore_r, bore_depth, (0, arm_y0, axle_height), (0, 1, 0))

# ---------------------------------------------------------------
# Ring gear: rim tube + inward-pointing teeth
# ---------------------------------------------------------------
ring = (cq.Workplane("XY")
        .circle(ring_outer_r).circle(ring_root_r).extrude(ring_width))
ring = ring.union(polar_boxes(ring_teeth, ring_root_r - ring_tip_r, 5.0,
                              ring_width, ring_tip_r, ring_width))
ring = to_axle_plane(ring, ring_y0)

# ---------------------------------------------------------------
# Sun gear: hub + rim + external teeth + four spokes
# ---------------------------------------------------------------
sun = (cq.Workplane("XY").circle(sun_hub_r).extrude(sun_width))
sun = sun.union(cq.Workplane("XY")
                .circle(sun_root_r).circle(sun_rim_in).extrude(sun_width))
sun = sun.union(polar_boxes(sun_teeth, sun_tip_r - sun_root_r, 5.0,
                            sun_width, sun_root_r, sun_width))
for k in range(4):  # radial spokes
    spoke = box_solid(sun_rim_in + 4.0, 8.0, sun_width, (0, -4.0, 0))
    spoke = spoke.rotate((0, 0, 0), (0, 0, 1), 45.0 + k * 90.0)
    sun = sun.union(spoke)
sun = to_axle_plane(sun, sun_y0)

# ---------------------------------------------------------------
# Planet pinion meshing sun and ring (placed at +X of the axis)
# ---------------------------------------------------------------
planet = (cq.Workplane("XY").circle(planet_root_r).extrude(planet_width))
planet = planet.union(polar_boxes(planet_teeth, planet_tip_r - planet_root_r,
                                  4.0, planet_width, planet_root_r, planet_width))
planet = planet.translate((center_dist, 0, 0))
planet = to_axle_plane(planet, sun_y0)

# ---------------------------------------------------------------
# Crank / lever arms with cylindrical hand grips
# ---------------------------------------------------------------
def lever(angle_deg, length, grip_radius, grip_length):
    """Radial arm from the crank hub with a grip pointing toward the operator."""
    a = math.radians(angle_deg)
    arm = box_solid(length, arm_sec, arm_sec, (0, arm_y0, axle_height - arm_sec / 2))
    arm = arm.rotate((0, 0, axle_height), (0, 1, axle_height), -angle_deg)
    ex = length * math.cos(a)
    ez = axle_height + length * math.sin(a)
    grip = cyl_solid(grip_radius, grip_length, (ex, arm_y0, ez), (0, -1, 0))
    return arm.union(grip)

arm1 = lever(arm1_ang, arm1_len, grip_r, grip_len)
arm2 = lever(arm2_ang, arm2_len, grip_r, grip_len - 6.0)
crank_arm = lever(crank_ang, crank_len, crank_grip_r, crank_grip_len)

# ---------------------------------------------------------------
# Assemble everything (sequential unions, no intermediate list)
# then cut the hollow bore in the crank hub
# ---------------------------------------------------------------
result = plate
result = result.union(front_rail)
result = result.union(rear_rail)
result = result.union(plate)
result = result.union(drum)
result = result.union(crank_hub)
result = result.union(axle)
result = result.union(ring)
result = result.union(sun)
result = result.union(planet)
result = result.union(arm1)
result = result.union(arm2)
result = result.union(crank_arm)
result = result.cut(bore)