import cadquery as cq

# =============================================================================
# Parameters
# =============================================================================

# Small bevel gear (upper-left position)
SMALL_OD = 120.0
SMALL_BLANK_THICK = 20.0
SMALL_HUB_DIA = 45.0
SMALL_HUB_LEN = 30.0
SMALL_BORE_DIA = 28.8
SMALL_TEETH = 24
SMALL_TOOTH_GAP = 2.5
SMALL_PIN_R = 14.4
SMALL_PIN_LEN = 120.0

# Large bevel gear (two identical instances)
LARGE_OD = 200.0
LARGE_BLANK_THICK = 25.0
LARGE_HUB_DIA = 90.0
LARGE_HUB_LEN = 12.0
LARGE_BORE_DIA = 67.748
LARGE_TEETH = 40
LARGE_TOOTH_GAP = 3.0
LARGE_PIN_R = 33.87

# Large gear pins (one long, one short)
CENTER_PIN_LEN = 175.0
RIGHT_PIN_LEN = 100.0

# Front-face center positions in global space
SMALL_POS = (-40.0, 0.0, 50.0)
CENTER_POS = (-40.0, -90.0, 0.0)
RIGHT_POS = (90.0, 0.0, 0.0)


# =============================================================================
# Helpers
# =============================================================================

def make_bevel_gear(od, blank_thick, hub_dia, hub_len, bore_dia, teeth, gap):
    """
    Approximate straight bevel gear:
    - 45-degree conical blank (frustum)
    - radial rectangular cuts to form straight teeth
    - cylindrical hub with coaxial bore
    """
    r_back = od / 2.0
    r_front = r_back - blank_thick          # 45-degree cone half-angle

    # Tapered blank: front face at Z=0, back face at Z=blank_thick
    blank = (cq.Workplane("XY")
             .circle(r_front)
             .extrude(blank_thick, taper=45))

    # Coaxial bore drilled from the back face through the blank
    blank = (blank.faces(">Z")
             .workplane()
             .hole(bore_dia))

    # Tooth-gap cutter: thin radial box that spans the blank height
    cut_height = blank_thick - 0.5           # leave a thin continuous back face
    cutter = (cq.Workplane("XY")
              .box(r_back + 10.0, gap, cut_height)
              .translate((r_back / 2.0 + 5.0, 0.0, cut_height / 2.0)))

    # Polar array of cutters around the gear axis
    cutters = None
    for i in range(teeth):
        angle = i * 360.0 / teeth
        c = cutter.rotate((0, 0, 0), (0, 0, 1), angle)
        cutters = c if cutters is None else cutters.union(c)

    blank = blank.cut(cutters)

    # Cylindrical hub tube attached to the back face
    hub = (cq.Workplane("XY")
           .workplane(offset=blank_thick)
           .circle(hub_dia / 2.0)
           .circle(bore_dia / 2.0)
           .extrude(hub_len))

    return blank.union(hub)


def make_pin(radius, length):
    """Solid cylindrical pin/shaft protruding from the gear front face."""
    return (cq.Workplane("XY")
            .workplane(offset=-5.0)
            .circle(radius)
            .extrude(length))


# =============================================================================
# Build local sub-assemblies
# =============================================================================

# Small gear + pin
small_gear = make_bevel_gear(SMALL_OD, SMALL_BLANK_THICK, SMALL_HUB_DIA,
                             SMALL_HUB_LEN, SMALL_BORE_DIA, SMALL_TEETH,
                             SMALL_TOOTH_GAP)
small_pin = make_pin(SMALL_PIN_R, SMALL_PIN_LEN)
small_assy = small_gear.union(small_pin)

# Center large gear + long pin
center_gear = make_bevel_gear(LARGE_OD, LARGE_BLANK_THICK, LARGE_HUB_DIA,
                              LARGE_HUB_LEN, LARGE_BORE_DIA, LARGE_TEETH,
                              LARGE_TOOTH_GAP)
center_pin = make_pin(LARGE_PIN_R, CENTER_PIN_LEN)
center_assy = center_gear.union(center_pin)

# Right large gear + short pin
right_gear = make_bevel_gear(LARGE_OD, LARGE_BLANK_THICK, LARGE_HUB_DIA,
                             LARGE_HUB_LEN, LARGE_BORE_DIA, LARGE_TEETH,
                             LARGE_TOOTH_GAP)
right_pin = make_pin(LARGE_PIN_R, RIGHT_PIN_LEN)
right_assy = right_gear.union(right_pin)


# =============================================================================
# Orient and position in global space
# =============================================================================

# Small gear: axis points in +Z
small_assy = small_assy.translate(SMALL_POS)

# Center gear: local Z rotated to global -Y (+90° about X)
center_assy = center_assy.rotate((0, 0, 0), (1, 0, 0), 90).translate(CENTER_POS)

# Right gear: local Z rotated to global +X (+90° about Y)
right_assy = right_assy.rotate((0, 0, 0), (0, 1, 0), 90).translate(RIGHT_POS)


# =============================================================================
# Final unified model
# =============================================================================
result = small_assy.union(center_assy).union(right_assy)