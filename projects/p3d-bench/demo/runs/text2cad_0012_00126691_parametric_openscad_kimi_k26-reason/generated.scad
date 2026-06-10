// Parameters
base_len   = 0.5;       
base_wid   = 0.75;      
base_hgt   = 0.016667;  

// First feature (stepped rear block)
feat1_y_off   = 0.25;      // offset from front edge
feat1_y_size  = 0.5;       // Y footprint (flush to back)
shoulder_z    = 0.2334;    // common shoulder / top datum
pad_depth     = 0.1;       // shallow upper-pad depth from shoulder
deep_depth    = 0.2167;    // deeper continuation depth from shoulder
deep_width    = 0.4917;    // inferred: flush left, inset from right by strip width

// Narrow edge strips
strip_w = 0.0083;
strip_d = 0.5;
strip_h = 0.0083;

// Thin transverse feature
trans_y_off  = 0.24922;
trans_y_size = 0.250819;
trans_thick  = 0.0021;
trans_reach  = 0.335265;
trans_z      = trans_reach - trans_thick;   // bottom Z of transverse slab

// Internal void wall thickness for transverse feature
wall_thick = 0.0083;

$fn = 100;

// Main reference slab
module base_slab() {
    cube([base_len, base_wid, base_hgt]);
}

// Stepped rear feature: shallow pad + deeper continuation, both measured from shoulder
module stepped_feature() {
    // Shallow upper pad: full 0.5 x 0.5 footprint
    translate([0, feat1_y_off, shoulder_z - pad_depth])
        cube([base_len, feat1_y_size, pad_depth]);
    
    // Deeper continuation: contained within pad, shares left/front/back edges
    translate([0, feat1_y_off, base_hgt])
        cube([deep_width, feat1_y_size, shoulder_z - base_hgt]);
}

// Narrow rectangular edge strips on the shoulder of the rear region
module edge_strips() {
    // Left strip, flush to left edge
    translate([0, feat1_y_off, shoulder_z])
        cube([strip_w, strip_d, strip_h]);
    
    // Right strip, flush to right edge
    translate([base_len - strip_w, feat1_y_off, shoulder_z])
        cube([strip_w, strip_d, strip_h]);
}

// Transverse thin solid with preserved closed internal profile as through void
module transverse_feature() {
    difference() {
        // Outer solid
        translate([0, trans_y_off, trans_z])
            cube([base_len, trans_y_size, trans_thick]);
        
        // Open void: closed internal profile inset by wall thickness on all sides
        translate([wall_thick, trans_y_off + wall_thick, trans_z - 0.005])
            cube([base_len - 2*wall_thick, trans_y_size - 2*wall_thick, trans_thick + 0.01]);
    }
}

// Assembly
union() {
    base_slab();
    stepped_feature();
    edge_strips();
    transverse_feature();
}