// ------------------------------------------------------------------
// Parametric channel tray with annular posts
// ------------------------------------------------------------------
// Dimensions (mm)
base_L      = 100;   // base plate length  (X)
base_W      = 60;    // base plate width   (Y)
base_T      = 5;     // base plate thickness

wall_T      = 6;     // long side-wall thickness
wall_H      = 25;    // side-wall height above base top (tallest build)

tab_L       = 12;    // end tab thickness along X
tab_H       = 15;    // end tab height above base top (lower step)

post_OD     = 14;    // annular post outer diameter
post_ID     = 6;     // annular post center hole diameter
post_H      = 18;    // post height above base top
post_n      = 4;     // number of posts in the row
post_pitch  = 20;    // post spacing along X
post_x0     = -30;   // X of first post

$fn = 64;

// ------------------------------------------------------------------
// Base plate : flat rectangular slab, top face at z = base_T
// ------------------------------------------------------------------
module base_plate() {
    translate([0, 0, base_T/2])
        cube([base_L, base_W, base_T], center = true);
}

// ------------------------------------------------------------------
// Long side walls : two raised walls leaving an open channel
// ------------------------------------------------------------------
module side_walls() {
    for (s = [-1, 1]) {
        translate([0, s*(base_W/2 - wall_T/2), (base_T + wall_H)/2])
            cube([base_L, wall_T, base_T + wall_H], center = true);
    }
}

// ------------------------------------------------------------------
// End tab : short rectangular addition inside the wall outline,
//           reaching only the lower step height
// ------------------------------------------------------------------
module end_tab() {
    inner_W = base_W - 2*wall_T;                 // fits between the walls
    translate([base_L/2 - tab_L/2, 0, (base_T + tab_H)/2])
        cube([tab_L, inner_W, base_T + tab_H], center = true);
}

// ------------------------------------------------------------------
// Annular posts : ring solids with a real central opening that does
//                 NOT pierce the base (hole spans only post height)
// ------------------------------------------------------------------
module posts() {
    for (i = [0 : post_n - 1]) {
        translate([post_x0 + i*post_pitch, 0, base_T])
            difference() {
                cylinder(h = post_H, d = post_OD);            // ring body
                translate([0, 0, -0.01])                      // keeps base solid
                    cylinder(h = post_H + 0.1, d = post_ID);  // central hole
            }
    }
}

// ------------------------------------------------------------------
// Assembly
// ------------------------------------------------------------------
union() {
    base_plate();
    side_walls();
    end_tab();
    posts();
}