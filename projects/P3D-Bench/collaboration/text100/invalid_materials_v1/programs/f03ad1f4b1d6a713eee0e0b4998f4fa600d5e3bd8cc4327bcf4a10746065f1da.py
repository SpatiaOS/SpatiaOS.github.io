import cadquery as cq

    # ==============================================================================
    # Parameters
    # ==============================================================================

    # Base reference solid (origin reference at its front-left-bottom corner)
    base_length = 0.053571      # Footprint dimension along X
    base_width = 0.357143       # Footprint dimension along Y
    base_height = 0.357143      # Extrusion height along Z

    # Solid 1: Arc-and-line outlined section
    solid1_width = 0.7143       # Bounding footprint X dimension
    solid1_length = 0.4956      # Bounding footprint Y dimension
    solid1_height = 0.0536      # Extrusion height from datum
    solid1_x_offset = -0.3214   # Offset from base left edge
    solid1_y_offset = -0.25     # Offset from base front edge

    # Solid 2: Second upper-side solid section
    solid2_width = 0.0536       # Footprint X dimension (aligned to base)
    solid2_length = 0.252       # Footprint Y dimension
    solid2_height = 0.3036      # Extrusion height from datum
    solid2_x_offset = 0.0       # Aligned with base left edge
    solid2_y_offset = -0.25     # Offset from base front edge

    # Solid 3: Deepest upper-side solid section
    solid3_width = 0.7143       # Footprint X dimension
    solid3_length = 0.1429      # Footprint Y dimension
    solid3_height = 0.4286      # Extrusion height from datum
    solid3_x_offset = -0.3214   # Offset from base left edge
    solid3_y_offset = -0.3929   # Offset from base front edge

    # ==============================================================================
    # Modeling Steps
    # ==============================================================================

    # 1. Base Solid: Narrow rectangular reference solid extending along Z
    base = (
        cq.Workplane("XY")
        .polyline([
            (0.0, 0.0),
            (base_length, 0.0),
            (base_length, base_width),
            (0.0, base_width),
        ])
        .close()
        .extrude(base_height)
    )

    # 2. Solid 1: Curved arc-and-line section
    # Semicircular profile at the back end capping a rectangular body
    s1_x_min = solid1_x_offset
    s1_x_max = solid1_x_offset + solid1_width
    s1_y_min = solid1_y_offset
    s1_y_max = solid1_y_offset + solid1_length

    s1_radius = (s1_x_max - s1_x_min) / 2.0
    s1_x_mid = (s1_x_min + s1_x_max) / 2.0
    s1_y_tangent = s1_y_max - s1_radius

    solid1 = (
        cq.Workplane("XY")
        .moveTo(s1_x_min, s1_y_min)
        .lineTo(s1_x_max, s1_y_min)
        .lineTo(s1_x_max, s1_y_tangent)
        .threePointsArc((s1_x_mid, s1_y_max), (s1_x_min, s1_y_tangent))
        .close()
        .extrude(solid1_height)
    )

    # 3. Solid 2: Mid-height rectangular rib aligned with base X edges
    s2_x_min = solid2_x_offset
    s2_x_max = solid2_x_offset + solid2_width
    s2_y_min = solid2_y_offset
    s2_y_max = solid2_y_offset + solid2_length

    solid2 = (
        cq.Workplane("XY")
        .polyline([
            (s2_x_min, s2_y_min),
            (s2_x_max, s2_y_min),
            (s2_x_max, s2_y_max),
            (s2_x_min, s2_y_max),
        ])
        .close()
        .extrude(solid2_height)
    )

    # 4. Solid 3: Deepest rectangular head block
    s3_x_min = solid3_x_offset
    s3_x_max = solid3_x_offset + solid3_width
    s3_y_min = solid3_y_offset
    s3_y_max = solid3_y_offset + solid3_length

    solid3 = (
        cq.Workplane("XY")
        .polyline([
            (s3_x_min, s3_y_min),
            (s3_x_max, s3_y_min),
            (s3_x_max, s3_y_max),
            (s3_x_min, s3_y_max),
        ])
        .close()
        .extrude(solid3_height)
    )

    # 5. Union all additive sections together
    result = base.union(solid1).union(solid2).union(solid3)