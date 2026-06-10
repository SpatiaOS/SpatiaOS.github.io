// ===== Parameters =====
base_length      = 0.75;     // X dimension of slot base
base_width       = 0.45;     // Y dimension of slot base
base_height      = 0.05625;  // Slot base thickness (shoulder datum at top)

// Common central axis (slot is rounded with radius = base_width/2)
cx = base_length/2;          // 0.375
cy = base_width/2;           // 0.225

// Outer annular collar
collar_or        = 0.225;
collar_ir        = 0.1875;
collar_h         = 0.1687;

// Middle annular section
mid_or           = 0.0937;
mid_ir           = 0.0562;
mid_h            = 0.0937;

// Inner solid cylinder
inner_r          = 0.0562;
inner_h          = 0.075;

$fn = 120;

// ===== Modules =====

// Rounded slot base footprint (2D)
module slot_profile(L, W) {
    hull() {
        translate([ W/2,        W/2, 0]) circle(r = W/2);
        translate([ L - W/2,    W/2, 0]) circle(r = W/2);
    }
}

// Slot base solid
module slot_base() {
    linear_extrude(height = base_height)
        slot_profile(base_length, base_width);
}

// Annular ring extruded to a given height
module ring(or, ir, h) {
    linear_extrude(height = h)
        difference() {
            circle(r = or);
            circle(r = ir);
        }
}

// ===== Assembly =====

union() {
    // Step 1: Rounded slot-like base
    slot_base();

    // Step 2: Outer annular collar (OR 0.225, IR 0.1875), reaches 0.1687 from shoulder
    translate([cx, cy, base_height])
        ring(collar_or, collar_ir, collar_h);

    // Step 3: Middle annular section (OR 0.0937, IR 0.0562), reaches 0.0937 from shoulder
    translate([cx, cy, base_height])
        ring(mid_or, mid_ir, mid_h);

    // Step 4: Inner solid cylinder (R 0.0562), reaches 0.075 from shoulder
    translate([cx, cy, base_height])
        cylinder(h = inner_h, r = inner_r);
}