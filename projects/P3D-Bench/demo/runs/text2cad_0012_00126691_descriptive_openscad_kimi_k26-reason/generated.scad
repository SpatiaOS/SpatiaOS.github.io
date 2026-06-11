// Resolution for curved surfaces
$fn = 100;

// --- Base slab dimensions ---
base_w        = 80;   // Overall width
base_d        = 60;   // Overall depth
base_h        = 2;    // Thin slab thickness

// --- Rear raised block ---
rear_d        = 40;   // Depth of rear raised portion
rear_h        = 8;    // Height added above base

// --- Narrow side strips (shallow added material) ---
strip_w       = 6;    // Width of each side strip
strip_h       = 2;    // Shallow rise above rear block

// --- Transverse thin web (aligned continuation reaching deeper) ---
web_t         = 1.5;  // Thickness (front-to-back)
web_z_bottom  = -4;   // How far below base it reaches
web_z_top     = base_h + rear_h; // Top flush with rear block shoulder
hole_d        = 12;   // Diameter of real internal opening
hole_z        = 4;    // Vertical center of hole (above base, inside web)

// --- Derived positions ---
rear_y        = base_d - rear_d;          // Front edge of rear block (the shoulder)
web_y         = rear_y - web_t;           // Web sits immediately in front of shoulder

// Base slab
module base_slab() {
    cube([base_w, base_d, base_h]);
}

// Larger rear raised portion
module rear_block() {
    translate([0, rear_y, base_h])
        cube([base_w, rear_d, rear_h]);
}

// Narrow raised strip along one side of rear block
module side_strip(x_pos) {
    translate([x_pos, rear_y, base_h + rear_h])
        cube([strip_w, rear_d, strip_h]);
}

// Very thin transverse web with real internal opening
module transverse_web() {
    difference() {
        // Solid thin plate spanning full width, reaching deeper than base
        translate([0, web_y, web_z_bottom])
            cube([base_w, web_t, web_z_top - web_z_bottom]);
        
        // Real internal opening (cylinder axis along web thickness)
        translate([base_w / 2, web_y + web_t / 2, hole_z])
            rotate([90, 0, 0])
            cylinder(d = hole_d, h = web_t + 1, center = true);
    }
}

// Assembly: all material added to base slab
union() {
    base_slab();
    rear_block();
    side_strip(0);                      // Left strip
    side_strip(base_w - strip_w);       // Right strip
    transverse_web();                   // Thin web at shoulder with hole
}