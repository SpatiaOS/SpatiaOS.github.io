// ==============================================
// Parametric Skyscraper Model
// Matches the reference isometric drawing
// ==============================================
// Overall dimensions
tower_w = 28;           // Main tower width (X axis)
tower_d = 22;           // Main tower depth (Y axis)
plinth_h = 8;           // Height of solid base plinth
floor_h = 3.8;          // Height per residential floor
num_floors = 22;        // Number of floors above plinth
balcony_w = 11;         // Width of balcony section on front facade
balcony_proj = 2.2;     // How far balconies project forward from wall
balcony_slab_t = 0.6;   // Thickness of balcony floor slabs
balcony_rail_h = 0.8;   // Height of balcony front railing
window_recess = 0.5;    // Depth windows are recessed into walls
win_frame_t = 0.4;      // Thickness of window frame mullions
plinth_extend_x = 3;    // Plinth extension on right side
plinth_extend_y = 2;    // Plinth extension on front side
plinth_chamfer = 5;     // Size of 45deg chamfer on plinth corner
roof_slab_t = 1.2;      // Thickness of main roof slab
penthouse_h = 7;        // Height of upper penthouse parapet
penthouse_setback = 3;  // Setback of penthouse from tower edges
tri_pent_size = 6;      // Size of triangular penthouse roof feature
annex_w = 16;           // Width of side annex building
annex_d = 13;           // Depth of side annex building
annex_h = 15;           // Total height of annex
annex_parapet_h = 1.2;  // Height of parapet wall on annex roof
antenna_h = 5;          // Height of roof antennas
antenna_r = 0.15;       // Radius of antenna rods
num_fins = 5;           // Number of vertical fins on left edge
$fn = 24;               // Resolution for curved geometry

// Calculated heights
main_wall_h = plinth_h + num_floors * floor_h;
main_roof_z = main_wall_h + roof_slab_t;
penthouse_z = main_roof_z + penthouse_h;

// ==============================================
// Plinth (solid chamfered base)
// ==============================================
color("lightgray") linear_extrude(height=plinth_h)
polygon(points=[
    [0, 0],
    [tower_w + plinth_extend_x, 0],
    [tower_w + plinth_extend_x, tower_d + plinth_extend_y - plinth_chamfer],
    [tower_w + plinth_extend_x - plinth_chamfer, tower_d + plinth_extend_y],
    [0, tower_d + plinth_extend_y]
]);

// ==============================================
// Main tower structural wall
// ==============================================
color("lightgray")
translate([0, 0, plinth_h])
    cube([tower_w, tower_d, main_wall_h - plinth_h]);

// ==============================================
// Vertical fins on left tower edge
// ==============================================
color("lightgray")
for (i = [0:num_fins-1]) {
    y_pos = i * (tower_d / (num_fins-1));
    translate([-0.3, y_pos - 0.15, plinth_h])
        cube([0.3, 0.3, main_wall_h - plinth_h]);
}

// ==============================================
// Facade windows (dark recessed glazing)
// ==============================================
color("darkgray")
for (floor_i = [0:num_floors-1]) {
    z_base = plinth_h + floor_i * floor_h;

    // 1. Dark glazing behind balconies (front left)
    translate([win_frame_t, tower_d - window_recess, z_base + balcony_slab_t])
        cube([balcony_w - 2*win_frame_t, window_recess, floor_h - balcony_slab_t - win_frame_t]);

    // 2. Grid windows (front right: 3 columns x 2 rows per floor)
    grid_section_w = tower_w - balcony_w;
    col_w = grid_section_w / 3;
    row_h = floor_h / 2;
    for (col = [0:2]) {
        for (row = [0:1]) {
            x_pos = balcony_w + col * col_w + win_frame_t;
            z_pos = z_base + row * row_h + win_frame_t;
            translate([x_pos, tower_d - window_recess, z_pos])
                cube([col_w - 2*win_frame_t, window_recess, row_h - 2*win_frame_t]);
        }
    }

    // 3. Long horizontal windows (right side face: 2 per floor)
    win_h = (floor_h - win_frame_t*3)/2;
    for (row = [0:1]) {
        z_pos = z_base + win_frame_t + row*(win_h + win_frame_t);
        translate([tower_w, win_frame_t, z_pos])
            cube([window_recess, tower_d - 2*win_frame_t, win_h]);
    }
}

// ==============================================
// Projecting balconies on front facade
// ==============================================
color("lightgray")
for (floor_i = [0:num_floors-1]) {
    z_base = plinth_h + floor_i * floor_h;
    // Balcony floor slab
    translate([0, tower_d, z_base])
        cube([balcony_w, balcony_proj, balcony_slab_t]);
    // Balcony front railing
    translate([0, tower_d + balcony_proj - win_frame_t, z_base + balcony_slab_t])
        cube([balcony_w, win_frame_t, balcony_rail_h]);
}

// ==============================================
// Main roof slab
// ==============================================
color("gray")
translate([0, 0, main_wall_h])
    cube([tower_w, tower_d, roof_slab_t]);

// ==============================================
// Upper penthouse/parapet level
// ==============================================
color("lightgray") {
    // Rectangular main penthouse section
    translate([penthouse_setback, penthouse_setback, main_roof_z])
        cube([
            tower_w - 2*penthouse_setback,
            tower_d - 2*penthouse_setback,
            penthouse_h
        ]);
    // Triangular front feature
    translate([0, 0, main_roof_z])
    linear_extrude(height=penthouse_h)
    polygon(points=[
        [penthouse_setback, tower_d - penthouse_setback],
        [penthouse_setback + tri_pent_size, tower_d - penthouse_setback],
        [penthouse_setback + tri_pent_size/2, tower_d - penthouse_setback + tri_pent_size]
    ]);
}

// ==============================================
// Side annex building
// ==============================================
// Main annex structure
color("lightgray")
translate([-annex_w, tower_d - annex_d, 0])
    cube([annex_w, annex_d, annex_h - annex_parapet_h]);

// Annex roof parapet
color("lightgray")
difference() {
    translate([-annex_w, tower_d - annex_d, annex_h - annex_parapet_h])
        cube([annex_w, annex_d, annex_parapet_h]);
    translate([-annex_w + win_frame_t, tower_d - annex_d + win_frame_t, annex_h - annex_parapet_h])
        cube([annex_w - 2*win_frame_t, annex_d - 2*win_frame_t, annex_parapet_h + 1]);
}

// Roof antennas on annex
color("darkgray") {
    translate([-annex_w/3, tower_d - annex_d/3, annex_h])
        cylinder(h=antenna_h, r=antenna_r);
    translate([-annex_w*2/3, tower_d - annex_d/2, annex_h])
        cylinder(h=antenna_h, r=antenna_r);
}

// Rotate to match reference isometric view orientation
rotate([0,0,0])
children();