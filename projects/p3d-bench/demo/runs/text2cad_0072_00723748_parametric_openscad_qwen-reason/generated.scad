// Parameters
$fn = 80;

base_len = 0.703125;
base_wid = 0.75;
base_ht = 0.013125;

base_hole_r = 0.0328;
base_hole_x = 0.075;
base_hole_y = 0.6562;

block_len = 0.646875;
block_wid = 0.50625;
block_ht = 0.645;
block_x = 0.0563;
block_y = 0.0844;

collar_out_r = 0.0656;
collar_in_r = 0.0328;
collar_ht = 0.0375;
collar_x = 0.2062;
collar_y1 = 0.1968;
collar_y2 = 0.4781;

rec_len = 0.473437;
rec_wid = 0.39375;
rec_x = 0.1734;
rec_y = 0.1406;
rec_depth = 0.0037;

collar_cut_r = 0.0328;
collar_cut_y1 = 0.1969;
collar_cut_y2 = 0.4781;

// Derived Z levels
top_base = base_ht;
top_block = top_base + block_ht;
top_collar = top_block + collar_ht;
cut_bottom = top_block - rec_depth;
collar_cut_h = collar_ht + rec_depth;

// Base plate module
module base_plate() {
    cube([base_len, base_wid, base_ht]);
}

// Main block module
module main_block() {
    translate([block_x, block_y, top_base])
        cube([block_len, block_wid, block_ht]);
}

// Annular collar module
module annular_collar(cx, cy) {
    translate([cx, cy, top_block])
        difference() {
            cylinder(h=collar_ht, r=collar_out_r);
            cylinder(h=collar_ht + 0.01, r=collar_in_r);
        }
}

// Subtractive cuts module
model_cuts() {
    // Base through-hole
    translate([base_hole_x, base_hole_y, -0.001])
        cylinder(h=base_ht + 0.002, r=base_hole_r);

    // Combined shallow rectangular recesses
    translate([rec_x, rec_y, cut_bottom])
        cube([rec_len, rec_wid, rec_depth + 0.001]);

    // Collar center openings
    for (cy = [collar_cut_y1, collar_cut_y2]) {
        translate([collar_x, cy, cut_bottom])
            cylinder(h=collar_cut_h + 0.001, r=collar_cut_r);
    }
}

// Final assembly
difference() {
    union() {
        base_plate();
        main_block();
        annular_collar(collar_x, collar_y1);
        annular_collar(collar_x, collar_y2);
    }
    model_cuts();
}