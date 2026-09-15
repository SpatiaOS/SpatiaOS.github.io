import cadquery as cq

    # ==============================================================================
    # Parameters
    # ==============================================================================

    # Base solid dimensions (arc-based rounded mounting plate)
    base_length = 150.0  # Overall length of the base
    base_width = 65.0  # Width of the base
    base_thickness = 12.0  # Thickness of the base plate
    base_corner_radius = 24.0  # Radius for curved/arc-based corner outlines

    # Added Section 1: Shallow circular projection from reference surface
    section1_x = -45.0
    section1_y = 0.0
    section1_radius = 22.0
    section1_depth = 8.0  # Shallow projection depth

    # Added Section 2: Intermediate deeper circular extension
    section2_x = 0.0
    section2_y = 0.0
    section2_radius = 18.0
    section2_depth = 24.0  # Deeper projection depth

    # Added Section 3: Deepest circular extension
    section3_x = 45.0
    section3_y = 0.0
    section3_radius = 15.0
    section3_depth = 40.0  # Deepest projection depth

    # ==============================================================================
    # Modeling
    # ==============================================================================

    # 1. Create the base solid with arc-based rounded contours
    # The reference side for subsequent features is the top face (Z = base_thickness)
    base_solid = (
        cq.Workplane("XY")
        .box(base_length, base_width, base_thickness)
        .edges("|Z")
        .fillet(base_corner_radius)
        .translate((0, 0, base_thickness / 2.0))
    )

    # 2. Create the shallow added section (solid circular boss)
    shallow_section = (
        cq.Workplane("XY", origin=(section1_x, section1_y, base_thickness))
        .circle(section1_radius)
        .extrude(section1_depth)
    )

    # 3. Create the second added section (deeper solid extension)
    deep_section_1 = (
        cq.Workplane("XY", origin=(section2_x, section2_y, base_thickness))
        .circle(section2_radius)
        .extrude(section2_depth)
    )

    # 4. Create the third added section (tallest deeper solid extension)
    deep_section_2 = (
        cq.Workplane("XY", origin=(section3_x, section3_y, base_thickness))
        .circle(section3_radius)
        .extrude(section3_depth)
    )

    # 5. Join all sections additively into a single unified solid.
    # Note: No cut features, recesses, inner loops, or openings are present;
    # all features are completely solid attached material.
    result = (
        base_solid.union(shallow_section)
        .union(deep_section_1)
        .union(deep_section_2)
    )