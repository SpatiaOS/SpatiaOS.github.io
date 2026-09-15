// Parameters: sixteen-storey tower with balconies and a taller rear wing
tower_width = 68;
tower_depth = 50;
floor_height = 12;
front_floors = 16;
rear_floors = 17;
base_height = 18;
rear_setback = 30;
rear_left_inset = 3;

base_margin = 2;
base_right_extension = 8;
base_corner_bevel = 6;
base_front_clearance = 1.2;
panel_seam_width = 0.55;
panel_seam_depth = 0.45;
base_panel_margin = 2;

balcony_left_margin = 3.5;
balcony_width = 39.5;
balcony_depth = 4.2;
balcony_opening_height = 9.5;
balcony_sill = 1.3;
balcony_projection = 3.2;
slab_projection = 1;
slab_thickness = 1.1;
glass_bank_width = 29.5;
glass_frame_depth = 0.7;
opaque_panel_height = 3.3;
opaque_panel_depth = 0.65;
balcony_wall_thickness = 1;
balcony_wall_height = 3.5;
rail_thickness = 0.38;
rail_depth = 0.6;
rail_first_height = 2.1;
rail_spacing = 1;
rail_count = 3;
rail_post_width = 0.65;
rail_front_offset = 0.45;

front_pier_width = 22.5;
front_pier_projection = 1.2;
front_window_width = 16.8;
front_window_height = 8.1;
front_window_sill = 2.1;
front_window_columns = 3;
front_window_rows = 2;

side_window_bays = 3;
side_window_margin = 4;
side_window_gap = 2.2;
side_window_height = 8.2;
side_window_sill = 2;
side_window_columns = 2;
rear_window_bays = 3;
rear_window_margin = 4;
rear_window_gap = 3;

window_recess = 1.7;
frame_width = 0.65;
mullion_width = 0.48;
frame_projection = 0.22;
glass_thickness = 0.22;
floor_band_height = 0.7;
floor_band_projection = 0.45;
floor_band_offset = 0.5;

fin_count = 4;
fin_spacing = 2.8;
fin_width = 0.85;
fin_projection = 1.1;
fin_start_height = 2;
fin_front_margin = 0.8;
left_slot_width = 1.4;
left_slot_depth = 0.85;
left_slot_sill = 1;
left_slot_height = 10;

canopy_side_overhang = 1.5;
canopy_front_overhang = 4;
canopy_rear_overlap = 3;
canopy_rear_inset = 3;
canopy_edge_thickness = 1.3;
canopy_rise = 10.2;

roof_parapet_height = 7;
roof_parapet_thickness = 1.3;
roof_surface_thickness = 0.3;
penthouse_width = 49;
penthouse_depth = 28;
penthouse_front_offset = -8;
penthouse_top_offset = 0.5;
penthouse_rim = 1.2;
penthouse_roof_recess = 0.8;

annex_extension = 27;
annex_overlap = 4;
annex_depth = 32;
annex_front = -4;
annex_height = 23;
annex_parapet_height = 4;
annex_wall = 1.3;
annex_hatch_width = 11;
annex_hatch_depth = 12;
annex_hatch_height = 0.7;

wall_color = [0.72, 0.73, 0.75];
trim_color = [0.82, 0.83, 0.84];
glass_color = [0.16, 0.18, 0.20];
roof_color = [0.48, 0.49, 0.51];

eps = 0.03;
$fn = 48;

// Derived dimensions
left_x = -tower_width / 2;
right_x = tower_width / 2;
front_y = -tower_depth / 2;
back_y = tower_depth / 2;
rear_front_y = front_y + rear_setback;
rear_left_x = left_x + rear_left_inset;
rear_width = right_x - rear_left_x;

front_roof_z = base_height + front_floors * floor_height;
rear_roof_z = base_height + rear_floors * floor_height;
pier_x = right_x - front_pier_width;
pier_y = front_y - front_pier_projection;

balcony_x = left_x + balcony_left_margin;
balcony_back_y = front_y + balcony_depth;
balcony_end_x = balcony_x + balcony_width;
glass_end_x = balcony_x + glass_bank_width;
rail_top = rail_first_height + (rail_count - 1) * rail_spacing;
front_window_x = pier_x + (front_pier_width - front_window_width) / 2;

side_window_width =
    (tower_depth - 2 * side_window_margin
     - (side_window_bays - 1) * side_window_gap) / side_window_bays;
rear_window_width =
    (rear_width - 2 * rear_window_margin
     - (rear_window_bays - 1) * rear_window_gap) / rear_window_bays;

base_left = left_x - base_margin;
base_right = right_x + base_right_extension;
base_front = front_y - balcony_projection - base_front_clearance;
base_back = back_y + base_margin;

annex_left = left_x - annex_extension;
annex_width = annex_extension + annex_overlap;
annex_roof_z = annex_height - annex_parapet_height;

penthouse_x = rear_left_x;
penthouse_y = rear_front_y + penthouse_front_offset;
penthouse_top_z =
    rear_roof_z + roof_parapet_height - penthouse_top_offset;

// Recessed window; local facade faces toward negative Y
module window_unit(w, h, columns, rows, depth, cut = false) {
    if (cut) {
        translate([0, -eps, 0])
            cube([w, depth + eps, h]);
    } else {
        color(glass_color)
            translate([0, depth - glass_thickness, 0])
                cube([w, glass_thickness + eps, h]);

        color(trim_color) {
            for (x = [-frame_width, w])
                translate([x, -frame_projection, -frame_width])
                    cube([frame_width,
                          depth + frame_projection + eps,
                          h + 2 * frame_width]);

            for (z = [-frame_width, h])
                translate([-frame_width, -frame_projection, z])
                    cube([w + 2 * frame_width,
                          depth + frame_projection + eps,
                          frame_width]);

            if (columns > 1)
                for (i = [1 : columns - 1])
                    translate([i * w / columns - mullion_width / 2,
                               -frame_projection, 0])
                        cube([mullion_width,
                              depth + frame_projection + eps, h]);

            if (rows > 1)
                for (i = [1 : rows - 1])
                    translate([0, -frame_projection,
                               i * h / rows - mullion_width / 2])
                        cube([w, depth + frame_projection + eps,
                              mullion_width]);
        }
    }
}

// Repeated front, side and rear windows
module facade_windows(cut = false) {
    for (f = [0 : front_floors - 1])
        translate([front_window_x, pier_y,
                   base_height + f * floor_height + front_window_sill])
            window_unit(front_window_width, front_window_height,
                        front_window_columns, front_window_rows,
                        window_recess, cut);

    for (f = [0 : rear_floors - 1])
        for (b = [0 : side_window_bays - 1])
            let(y = front_y + side_window_margin
                    + b * (side_window_width + side_window_gap))
                if (f < front_floors || y >= rear_front_y)
                    translate([right_x, y,
                               base_height + f * floor_height
                               + side_window_sill])
                        rotate([0, 0, 90])
                            window_unit(side_window_width,
                                        side_window_height,
                                        side_window_columns, 1,
                                        window_recess, cut);

    for (f = [0 : rear_floors - 1])
        for (b = [0 : rear_window_bays - 1])
            let(x = rear_left_x + rear_window_margin
                    + b * (rear_window_width + rear_window_gap))
                translate([x + rear_window_width, back_y,
                           base_height + f * floor_height
                           + side_window_sill])
                    rotate([0, 0, 180])
                        window_unit(rear_window_width,
                                    side_window_height, 2, 1,
                                    window_recess, cut);
}

// Balcony niches and narrow left-side reveals
module tower_recesses() {
    for (f = [0 : front_floors - 1]) {
        z = base_height + f * floor_height;

        translate([balcony_x, front_y - eps, z + balcony_sill])
            cube([balcony_width, balcony_depth + eps,
                  balcony_opening_height]);

        for (i = [0 : fin_count - 2])
            translate([left_x - eps,
                       front_y + fin_front_margin + fin_width
                       + i * fin_spacing,
                       z + left_slot_sill])
                cube([left_slot_depth + eps,
                      left_slot_width, left_slot_height]);
    }
}

// Intersecting tower masses
module tower_shell() {
    color(wall_color)
        difference() {
            union() {
                translate([left_x, front_y, base_height - eps])
                    cube([tower_width, tower_depth,
                          front_roof_z - base_height + eps]);

                translate([rear_left_x, rear_front_y, base_height - eps])
                    cube([rear_width, back_y - rear_front_y,
                          rear_roof_z - base_height + eps]);

                translate([pier_x, pier_y, base_height - eps])
                    cube([front_pier_width,
                          front_pier_projection + eps,
                          front_roof_z - base_height + eps]);
            }

            tower_recesses();
            facade_windows(true);
        }
}

// Glazed balcony bank, projecting slabs and solid end returns
module balcony_level(z) {
    translate([balcony_x, balcony_back_y - glass_frame_depth,
               z + balcony_sill])
        window_unit(glass_bank_width, balcony_opening_height,
                    2, 2, glass_frame_depth);

    color(trim_color) {
        translate([balcony_x, front_y - slab_projection, z - eps])
            cube([balcony_width,
                  balcony_depth + slab_projection + eps,
                  slab_thickness + eps]);

        translate([glass_end_x - eps,
                   front_y - balcony_projection, z - eps])
            cube([balcony_end_x - glass_end_x + eps,
                  balcony_depth + balcony_projection + eps,
                  slab_thickness + eps]);

        translate([glass_end_x - eps,
                   front_y - balcony_projection,
                   z + slab_thickness - eps])
            cube([balcony_end_x - glass_end_x + eps,
                  balcony_wall_thickness,
                  balcony_wall_height]);

        translate([balcony_end_x - balcony_wall_thickness,
                   front_y - balcony_projection,
                   z + slab_thickness - eps])
            cube([balcony_wall_thickness,
                  balcony_depth + balcony_projection + eps,
                  balcony_wall_height]);

        translate([balcony_x,
                   balcony_back_y - opaque_panel_depth,
                   z + balcony_sill + balcony_opening_height
                   - opaque_panel_height])
            cube([glass_bank_width / 2,
                  opaque_panel_depth + eps,
                  opaque_panel_height]);

        for (i = [0 : rail_count - 1])
            translate([balcony_x,
                       front_y - rail_front_offset - rail_depth / 2,
                       z + rail_first_height + i * rail_spacing])
                cube([glass_bank_width, rail_depth, rail_thickness]);

        for (i = [0 : 2])
            translate([balcony_x
                       + i * (glass_bank_width - rail_post_width) / 2,
                       front_y - rail_front_offset - rail_depth / 2,
                       z + slab_thickness - eps])
                cube([rail_post_width, rail_depth,
                      rail_top + rail_thickness - slab_thickness + eps]);
    }
}

// Continuous corner fins and horizontal side bands
module facade_trim() {
    color(trim_color) {
        for (i = [0 : fin_count - 1])
            translate([left_x - fin_projection,
                       front_y + fin_front_margin + i * fin_spacing,
                       fin_start_height])
                cube([fin_projection + eps, fin_width,
                      front_roof_z - fin_start_height]);

        for (f = [0 : rear_floors - 1])
            let(y0 = f < front_floors ? front_y : rear_front_y,
                z = base_height + f * floor_height + floor_band_offset) {
                translate([right_x - eps, y0, z])
                    cube([floor_band_projection + eps,
                          back_y - y0, floor_band_height]);

                translate([rear_left_x, back_y - eps, z])
                    cube([rear_width, floor_band_projection + eps,
                          floor_band_height]);
            }
    }
}

// Chamfered podium with shallow panel joints
module podium() {
    color(wall_color)
        difference() {
            linear_extrude(height = base_height)
                polygon([
                    [base_left, base_front],
                    [base_right - base_corner_bevel, base_front],
                    [base_right, base_front + base_corner_bevel],
                    [base_right, base_back],
                    [base_left, base_back]
                ]);

            for (x = [pier_x, right_x - base_panel_margin])
                translate([x, base_front - eps, base_panel_margin])
                    cube([panel_seam_width, panel_seam_depth + eps,
                          base_height - 2 * base_panel_margin]);

            translate([base_left - eps, base_front - eps,
                       base_height - panel_seam_width])
                cube([base_right - base_left + 2 * eps,
                      panel_seam_depth + eps, panel_seam_width]);

            translate([base_right - panel_seam_depth,
                       base_front + base_corner_bevel + base_panel_margin,
                       base_panel_margin])
                cube([panel_seam_depth + eps,
                      base_back - base_front - base_corner_bevel
                      - 2 * base_panel_margin,
                      base_height - 2 * base_panel_margin]);
        }
}

// Low attached wing with a recessed flat roof
module annex() {
    color(wall_color)
        difference() {
            translate([annex_left, annex_front, 0])
                cube([annex_width, annex_depth, annex_height]);

            translate([annex_left + annex_wall,
                       annex_front + annex_wall, annex_roof_z])
                cube([annex_width - 2 * annex_wall,
                      annex_depth - 2 * annex_wall,
                      annex_parapet_height + eps]);

            translate([annex_left - eps, annex_front - eps,
                       annex_roof_z - panel_seam_width])
                cube([annex_width + 2 * eps,
                      panel_seam_depth + eps, panel_seam_width]);
        }

    color(roof_color)
        translate([annex_left + annex_wall,
                   annex_front + annex_wall,
                   annex_roof_z - roof_surface_thickness])
            cube([annex_width - 2 * annex_wall,
                  annex_depth - 2 * annex_wall,
                  roof_surface_thickness + eps]);

    color(trim_color)
        translate([annex_left + (annex_width - annex_hatch_width) / 2,
                   annex_front + (annex_depth - annex_hatch_depth) / 2,
                   annex_roof_z - eps])
            cube([annex_hatch_width, annex_hatch_depth,
                  annex_hatch_height + eps]);
}

// Sloping, overhanging front roof
module canopy() {
    color(roof_color)
        hull() {
            translate([left_x - canopy_side_overhang,
                       front_y - canopy_front_overhang,
                       front_roof_z - eps])
                cube([tower_width + 2 * canopy_side_overhang,
                      eps, canopy_edge_thickness + eps]);

            translate([left_x + canopy_rear_inset,
                       rear_front_y + canopy_rear_overlap - eps,
                       front_roof_z - eps])
                cube([tower_width - 2 * canopy_rear_inset,
                      eps, canopy_edge_thickness + canopy_rise + eps]);
        }
}

// Rear roof deck and perimeter parapet
module rear_roof() {
    color(roof_color)
        translate([rear_left_x, rear_front_y,
                   rear_roof_z - roof_surface_thickness])
            cube([rear_width, back_y - rear_front_y,
                  roof_surface_thickness + eps]);

    color(trim_color)
        difference() {
            translate([rear_left_x, rear_front_y, rear_roof_z - eps])
                cube([rear_width, back_y - rear_front_y,
                      roof_parapet_height + eps]);

            translate([rear_left_x + roof_parapet_thickness,
                       rear_front_y + roof_parapet_thickness,
                       rear_roof_z - 2 * eps])
                cube([rear_width - 2 * roof_parapet_thickness,
                      back_y - rear_front_y - 2 * roof_parapet_thickness,
                      roof_parapet_height + 3 * eps]);
        }
}

// Triangular rooftop penthouse with an inset roof panel
module penthouse_profile(inset = 0) {
    offset(delta = -inset)
        polygon([
            [penthouse_x, penthouse_y],
            [penthouse_x + penthouse_width, penthouse_y],
            [penthouse_x, penthouse_y + penthouse_depth]
        ]);
}

module penthouse() {
    color(trim_color)
        difference() {
            translate([0, 0, front_roof_z - eps])
                linear_extrude(height =
                    penthouse_top_z - front_roof_z + eps)
                    penthouse_profile();

            translate([0, 0,
                       penthouse_top_z - penthouse_roof_recess])
                linear_extrude(height = penthouse_roof_recess + eps)
                    penthouse_profile(penthouse_rim);
        }

    color(roof_color)
        translate([0, 0, penthouse_top_z - penthouse_roof_recess
                          - roof_surface_thickness])
            linear_extrude(height = roof_surface_thickness + eps)
                penthouse_profile(penthouse_rim);
}

// Main model
union() {
    podium();
    annex();
    tower_shell();
    facade_windows();

    for (f = [0 : front_floors - 1])
        balcony_level(base_height + f * floor_height);

    facade_trim();
    canopy();
    rear_roof();
    penthouse();
}