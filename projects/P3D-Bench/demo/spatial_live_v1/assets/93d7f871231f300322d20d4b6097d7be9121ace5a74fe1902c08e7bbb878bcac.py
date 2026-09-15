import cadquery as cq
import math

# ============================================================================
# High-rise residential tower — interpretation of the reference image
#   * slender ~24 storey tower with a square plan, one corner chamfered 45 deg
#   * continuous stack of projecting balconies on the chamfered corner
#   * recessed two-pane (mullioned) windows on every facade
#   * thin protruding slab bands marking each floor line
#   * battered (sloped-wall) podium at the base + small annex block
#   * set-back penthouse level crowned by an angular hip roof
# ============================================================================

# ------------------------------- parameters ---------------------------------
# tower plan
tower_width = 30.0          # X size of main tower
tower_depth = 30.0          # Y size of main tower
corner_chamfer = 8.0        # 45 deg cut on the (-X,-Y) corner (balcony corner)

# vertical layout
num_floors = 24
floor_height = 3.2
tower_height = num_floors * floor_height

# podium
podium_height = 6.0
podium_bottom_out = 3.2     # footprint offset at ground
podium_top_out = 2.0        # footprint offset at podium top (sloped walls)

# facade
window_width = 3.0
window_height = 1.9
window_recess = 0.35
window_sill = 0.80          # sill height above each floor
windows_per_face = 2
mullion_gap = 0.15          # vertical mullion splitting each window
band_thk = 0.30             # floor band thickness
band_out = 0.18             # floor band projection beyond facade

# balconies (chamfered corner)
balcony_width = 5.0
balcony_depth = 1.6
balcony_slab_thk = 0.25
balcony_rail_height = 1.10
balcony_rail_thk = 0.15

# penthouse + roof crown
penthouse_inset = 2.5
penthouse_height = 4.0
roof_height = 5.0
roof_overhang = 0.8
roof_ridge_length = 16.0
roof_ridge_width = 2.5
parapet_height = 0.9
parapet_thk = 0.25

# annex block beside the base
annex_width = 13.0
annex_depth = 12.0
annex_height = 5.0
annex_cy = -5.0
annex_overlap = 1.0         # overlap into podium for a solid union

# derived constants
hw = tower_width / 2.0
hd = tower_depth / 2.0
s45 = math.sin(math.radians(45.0))
n_x, n_y = -s45, -s45       # outward normal of the chamfer face
t_x, t_y = s45, -s45        # tangent along the chamfer face

# ------------------------------- helpers ------------------------------------
def footprint_points(half_w, half_d, cham):
    """CCW pentagon: rectangle with the (-X,-Y) corner cut at 45 deg."""
    return [
        (-half_w + cham, -half_d),
        ( half_w,        -half_d),
        ( half_w,         half_d),
        (-half_w,         half_d),
        (-half_w, -half_d + cham),
    ]

def centered_box(sx, sy, sz, cx, cy, cz):
    """Axis-aligned box solid centred on (cx, cy, cz)."""
    return cq.Solid.makeBox(sx, sy, sz).translate(
        (cx - sx / 2.0, cy - sy / 2.0, cz - sz / 2.0))

def rotated_box(sx, sy, sz, angle_deg, cx, cy, cz):
    """Box solid spun about Z, then centred on (cx, cy, cz)."""
    return (cq.Solid.makeBox(sx, sy, sz)
            .translate((-sx / 2.0, -sy / 2.0, -sz / 2.0))
            .rotate((0, 0, 0), (0, 0, 1), angle_deg)
            .translate((cx, cy, cz)))

def spread(start, end, n):
    """n evenly spaced centre points inside [start, end]."""
    step = (end - start) / float(n)
    return [start + step * (i + 0.5) for i in range(n)]

def add_floor_windows(cutters, zc, half_w, half_d, cham):
    """Append recessed two-pane window cutters for one storey."""
    m = 1.0                                   # margin from facade ends
    depth = window_recess + 0.20              # cutter depth (overcut)
    pane_w = (window_width - mullion_gap) / 2.0
    pane_off = (window_width + mullion_gap) / 4.0

    def pair(face, fixed, u):
        for du in (-pane_off, pane_off):
            uu = u + du
            if face == "S":      # y = -half_d, inward = +Y
                cutters.append(centered_box(pane_w, depth, window_height,
                                            uu, fixed - 0.1 + depth / 2.0, zc))
            elif face == "N":    # y = +half_d, inward = -Y
                cutters.append(centered_box(pane_w, depth, window_height,
                                            uu, fixed + 0.1 - depth / 2.0, zc))
            elif face == "E":    # x = +half_w, inward = -X
                cutters.append(centered_box(depth, pane_w, window_height,
                                            fixed + 0.1 - depth / 2.0, uu, zc))
            elif face == "W":    # x = -half_w, inward = +X
                cutters.append(centered_box(depth, pane_w, window_height,
                                            fixed - 0.1 + depth / 2.0, uu, zc))

    for u in spread(-half_w + cham + m, half_w - m, windows_per_face):
        pair("S", -half_d, u)
    for u in spread(-half_w + m, half_w - m, windows_per_face):
        pair("N", half_d, u)
    for u in spread(-half_d + m, half_d - m, windows_per_face):
        pair("E", half_w, u)
    for u in spread(-half_d + cham + m, half_d - m, windows_per_face):
        pair("W", -half_w, u)

    # window strip on the chamfer face (sits behind the balcony)
    mx, my = -half_w + cham / 2.0, -half_d + cham / 2.0
    off = 0.1 - depth / 2.0                   # inward along the face normal
    cutters.append(rotated_box(2.2, depth, window_height + 0.3, 135.0,
                               mx + n_x * off, my + n_y * off, zc))

def make_balcony(z_floor):
    """Slab + front/side parapets projecting from the chamfer face."""
    parts = []
    mx, my = -hw + corner_chamfer / 2.0, -hd + corner_chamfer / 2.0

    # floor slab (top flush with the interior floor level)
    scx = mx + n_x * balcony_depth / 2.0
    scy = my + n_y * balcony_depth / 2.0
    parts.append(rotated_box(balcony_width, balcony_depth, balcony_slab_thk,
                             135.0, scx, scy, z_floor - balcony_slab_thk / 2.0))
    # front parapet
    fcx = mx + n_x * (balcony_depth - balcony_rail_thk / 2.0)
    fcy = my + n_y * (balcony_depth - balcony_rail_thk / 2.0)
    parts.append(rotated_box(balcony_width, balcony_rail_thk,
                             balcony_rail_height, 135.0, fcx, fcy,
                             z_floor + balcony_rail_height / 2.0))
    # side parapets
    side_off = balcony_width / 2.0 - balcony_rail_thk / 2.0
    for s in (-1.0, 1.0):
        parts.append(rotated_box(balcony_rail_thk, balcony_depth,
                                 balcony_rail_height, 135.0,
                                 scx + t_x * s * side_off,
                                 scy + t_y * s * side_off,
                                 z_floor + balcony_rail_height / 2.0))
    return parts

def make_floor_band(z):
    """Thin protruding slab ring marking one floor line."""
    return (cq.Workplane("XY", origin=(0, 0, z - band_thk / 2.0))
            .polyline(footprint_points(hw + band_out, hd + band_out,
                                       corner_chamfer + band_out))
            .close()
            .extrude(band_thk)
            .val())

# ------------------------------- main tower ---------------------------------
tower = (cq.Workplane("XY")
         .polyline(footprint_points(hw, hd, corner_chamfer))
         .close()
         .extrude(tower_height)
         .val())

# first storey fully above the podium
start_floor = int(math.ceil(podium_height / floor_height))

# cut all window recesses in one boolean (compound of cutters = fast)
window_cutters = []
for i in range(start_floor, num_floors):
    z_base = i * floor_height
    add_floor_windows(window_cutters,
                      z_base + window_sill + window_height / 2.0,
                      hw, hd, corner_chamfer)
tower = tower.cut(cq.Compound.makeCompound(window_cutters))

# add floor bands and the balcony stack in one fuse
add_ons = []
for i in range(start_floor, num_floors):
    z_base = i * floor_height
    add_ons.append(make_floor_band(z_base))
    add_ons.extend(make_balcony(z_base))
tower = tower.fuse(*add_ons)

# ------------------------------- podium -------------------------------------
# lofted between two offset footprints -> slightly sloped (battered) walls
podium = (cq.Workplane("XY")
          .polyline(footprint_points(hw + podium_bottom_out,
                                     hd + podium_bottom_out,
                                     corner_chamfer + podium_bottom_out))
          .close()
          .workplane(offset=podium_height)
          .polyline(footprint_points(hw + podium_top_out,
                                     hd + podium_top_out,
                                     corner_chamfer + podium_top_out))
          .close()
          .loft(ruled=True, combine=True)
          .val())

# --------------------------- roof edge parapet ------------------------------
parapet = (cq.Workplane("XY", origin=(0, 0, tower_height))
           .polyline(footprint_points(hw, hd, corner_chamfer))
           .close()
           .extrude(parapet_height)
           .val())
parapet = parapet.cut(
    (cq.Workplane("XY", origin=(0, 0, tower_height - 0.1))
     .polyline(footprint_points(hw - parapet_thk, hd - parapet_thk,
                                corner_chamfer - parapet_thk))
     .close()
     .extrude(parapet_height + 0.2)
     .val()))

# --------------------------- penthouse + roof crown -------------------------
ph_hw = hw - penthouse_inset
ph_hd = hd - penthouse_inset
ph_ch = corner_chamfer - penthouse_inset

penthouse = (cq.Workplane("XY", origin=(0, 0, tower_height))
             .polyline(footprint_points(ph_hw, ph_hd, ph_ch))
             .close()
             .extrude(penthouse_height)
             .val())
ph_cutters = []
add_floor_windows(ph_cutters, tower_height + penthouse_height / 2.0,
                  ph_hw, ph_hd, ph_ch)
penthouse = penthouse.cut(cq.Compound.makeCompound(ph_cutters))

# angular hip roof with a short ridge (lofted pentagon -> rectangle)
roof = (cq.Workplane("XY", origin=(0, 0, tower_height + penthouse_height))
        .polyline(footprint_points(ph_hw + roof_overhang,
                                   ph_hd + roof_overhang,
                                   ph_ch + roof_overhang))
        .close()
        .workplane(offset=roof_height)
        .rect(roof_ridge_length, roof_ridge_width)
        .loft(ruled=True, combine=True)
        .val())

# ------------------------------- annex block --------------------------------
annex_cx = -(hw + podium_top_out) - annex_width / 2.0 + annex_overlap
annex = centered_box(annex_width, annex_depth, annex_height,
                     annex_cx, annex_cy, annex_height / 2.0)

# annex roof parapet
ap_h, ap_t = 0.7, 0.15
annex_parts = [annex]
annex_parts.append(centered_box(annex_width, ap_t, ap_h, annex_cx,
                                annex_cy - annex_depth / 2 + ap_t / 2,
                                annex_height + ap_h / 2))
annex_parts.append(centered_box(annex_width, ap_t, ap_h, annex_cx,
                                annex_cy + annex_depth / 2 - ap_t / 2,
                                annex_height + ap_h / 2))
annex_parts.append(centered_box(ap_t, annex_depth, ap_h,
                                annex_cx - annex_width / 2 + ap_t / 2,
                                annex_cy, annex_height + ap_h / 2))
annex_parts.append(centered_box(ap_t, annex_depth, ap_h,
                                annex_cx + annex_width / 2 - ap_t / 2,
                                annex_cy, annex_height + ap_h / 2))

# small glazed hip skylight on the annex roof
skylight = (cq.Workplane("XY", origin=(annex_cx, annex_cy, annex_height))
            .rect(5.0, 4.0)
            .workplane(offset=1.2)
            .rect(2.5, 1.6)
            .loft(ruled=True, combine=True)
            .val())
annex_parts.append(skylight)

# thin antenna / vent pipe visible on the annex roof
annex_parts.append(cq.Solid.makeCylinder(0.08, 2.5)
                   .translate((annex_cx + 3.0, annex_cy - 2.0, annex_height)))

annex_all = annex_parts[0].fuse(*annex_parts[1:])

# simple window openings in the annex facades
a_cut = []
d = window_recess + 0.2
for u in spread(-annex_width / 2 + 1.5, annex_width / 2 - 1.5, 3):
    a_cut.append(centered_box(1.8, d, 1.8, annex_cx + u,
                              annex_cy - annex_depth / 2 - 0.1 + d / 2, 2.4))
for u in spread(-annex_depth / 2 + 1.5, annex_depth / 2 - 1.5, 2):
    a_cut.append(centered_box(d, 1.8, 1.8,
                              annex_cx - annex_width / 2 - 0.1 + d / 2,
                              annex_cy + u, 2.4))
annex_all = annex_all.cut(cq.Compound.makeCompound(a_cut))

# ------------------------------- assembly -----------------------------------
final_solid = tower.fuse(podium, parapet, penthouse, roof, annex_all)
result = cq.Workplane("XY").add(final_solid)