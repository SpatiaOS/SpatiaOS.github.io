// Stepped cylindrical part with internal bores and annular recesses

// --- Solid body parameters ---
upper_r = 0.1875;       // Upper section radius
upper_h = 0.5625;      // Upper section height from shoulder (z=0 to z=+0.5625)
lower_r = 0.1875;       // Lower section radius
lower_h = 0.5625;      // Lower section height from shoulder (z=-0.5625 to z=0)

// --- Positive side bore parameters ---
pos_bore_r1 = 0.0975;      // Large bore radius
pos_bore_reach1 = 0.9375;  // Reach depth from top surface
pos_bore_r2 = 0.0534;      // Small bore radius
pos_bore_reach2 = 0.9375;  // Reach depth from top surface

// --- Negative side bore parameters ---
neg_bore_r = 0.0562;       // Central bore radius
neg_bore_reach = 0.375;    // Reach depth from bottom surface

// --- Negative side annular recess parameters ---
recess1_ri = 0.0562;       // Recess 1 inner radius
recess1_ro = 0.1162;       // Recess 1 outer radius
recess1_depth = 0.0562;    // Recess 1 depth from bottom surface

recess2_ri = 0.0562;       // Recess 2 inner radius
recess2_ro = 0.075;        // Recess 2 outer radius
recess2_depth = 0.0562;    // Recess 2 depth from bottom surface

$fn = 100;
eps = 0.001; // Small overlap for clean boolean operations

difference() {
    // Main solid body: two attached circular sections sharing shoulder at z=0
    union() {
        // Upper section: z=0 to z=upper_h
        cylinder(r=upper_r, h=upper_h);
        // Lower section: z=-lower_h to z=0
        translate([0, 0, -lower_h])
            cylinder(r=lower_r, h=lower_h);
    }

    // Positive side: large bore (r=0.0975, depth 0.9375 from top)
    // Extends from z=upper_h down to z=upper_h - pos_bore_reach1
    translate([0, 0, upper_h - pos_bore_reach1 - eps])
        cylinder(r=pos_bore_r1, h=pos_bore_reach1 + 2*eps);

    // Positive side: small bore (r=0.0534, depth 0.9375 from top)
    translate([0, 0, upper_h - pos_bore_reach2 - eps])
        cylinder(r=pos_bore_r2, h=pos_bore_reach2 + 2*eps);

    // Negative side: central bore (r=0.0562, depth 0.375 from bottom)
    // Extends from z=-lower_h upward by neg_bore_reach
    translate([0, 0, -lower_h - eps])
        cylinder(r=neg_bore_r, h=neg_bore_reach + 2*eps);

    // Negative side: annular recess 1 (ring between r=0.0562 and r=0.1162)
    translate([0, 0, -lower_h - eps])
        difference() {
            cylinder(r=recess1_ro, h=recess1_depth + 2*eps);
            cylinder(r=recess1_ri, h=recess1_depth + 2*eps);
        }

    // Negative side: annular recess 2 (ring between r=0.0562 and r=0.075)
    translate([0, 0, -lower_h - eps])
        difference() {
            cylinder(r=recess2_ro, h=recess2_depth + 2*eps);
            cylinder(r=recess2_ri, h=recess2_depth + 2*eps);
        }
}