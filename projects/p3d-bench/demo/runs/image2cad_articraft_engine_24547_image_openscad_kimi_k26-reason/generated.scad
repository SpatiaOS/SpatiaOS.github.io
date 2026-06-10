// OpenSCAD model of a small horizontal steam engine / stationary engine
// Based on typical proportions of a single-cylinder oscillating or slide-valve engine

$fn = 60;

// ============================================================
// GENERAL PARAMETERS
// ============================================================
base_h = 5;           // Base plate thickness
shaft_z = 18;         // Crankshaft center height above base
cyl_z = 23;           // Cylinder center height above base

// ============================================================
// BASE PLATE
// ============================================================
base_l = 100;         // Overall length (X)
base_w = 65;          // Overall width (Y)
base_r = 3;           // Corner rounding radius

// ============================================================
// CYLINDER & PISTON
// ============================================================
cyl_d = 18;           // Barrel diameter
cyl_barrel_l = 26;    // Barrel length (excluding heads)
cyl_x = -24;          // Barrel center X
cyl_y = -8;           // Barrel center Y (offset toward front to align with crank)
fin_count = 18;       // Number of cooling fins / decorative rings
fin_d = 21;           // Fin outer diameter
fin_t = 0.8;          // Fin thickness
fin_pitch = 1.4;      // Center-to-center fin spacing

cyl_head_d = 22;      // Cylinder head flange diameter
cyl_head_t = 3;       // Cylinder head thickness

chim_d = 4;           // Chimney / steam pipe diameter
chim_h = 8;           // Chimney height
chim_x = cyl_x - 6;   // Chimney X position on barrel

drain_d = 3;          // Drain pipe diameter
drain_h = 4;          // Drain pipe length
drain_x = cyl_x - cyl_barrel_l/2 + 2; // Under the dome end

piston_rod_d = 4;     // Piston rod diameter

// Crosshead
cross_x = 8;          // Crosshead center X
cross_y = cyl_y;      // Aligned with cylinder
cross_z = cyl_z;      // Same height as cylinder
cross_l = 6;          // Crosshead length (X)
cross_w = 8;          // Crosshead width (Y)
cross_h = 6;          // Crosshead height (Z)

// Crosshead guide
guide_x = 10;         // Guide frame center X
guide_l = 20;         // Guide frame length (X)

// ============================================================
// CRANKSHAFT & CONNECTING ROD
// ============================================================
shaft_x = 20;         // Crankshaft X position
shaft_d = 5;          // Shaft diameter

crank_y = -8;         // Crank disk Y position (between front flywheel and pedestal)
crank_r = 7;          // Crank throw radius
crank_angle = -45;    // Crank pin angle (degrees)
crank_pin_d = 4;      // Crank pin diameter
crank_pin_l = 6;      // Crank pin length (along Y)
crank_disk_d = 14;    // Crank disk diameter
crank_disk_t = 3;     // Crank disk thickness

// Derived crank pin coordinates
crank_pin_x = shaft_x + crank_r * cos(crank_angle);
crank_pin_z = shaft_z + crank_r * sin(crank_angle);

// Connecting rod
rod_t = 4;            // Rod thickness (Y)
rod_big_d = 10;       // Big end diameter
rod_small_d = 6;      // Small end diameter
wrist_pin_d = 3;      // Wrist pin hole diameter

// ============================================================
// MAIN BEARING PEDESTAL
// ============================================================
ped_x = shaft_x;      // Pedestal centered on shaft
ped_w = 14;           // Pedestal width (X)
ped_d = 14;           // Pedestal depth (Y)

// ============================================================
// FLYWHEELS
// ============================================================
fw_d = 42;            // Flywheel diameter
fw_t = 5;             // Flywheel thickness (Y)
fw_rim_t = 3;         // Rim thickness (radial)
fw_hub_d = 10;        // Hub diameter
fw_hub_l = 4;         // Hub protrusion length
fw_hole_d = 9;        // Lightening hole diameter
fw_hole_n = 5;        // Number of lightening holes
fw_hole_r = 12;       // Pitch radius for lightening holes

fw1_y = -18;          // Front flywheel Y center
fw2_y = 18;           // Back flywheel Y center

shaft_l = 55;         // Total shaft length (including hubs clearance)

// ============================================================
// MODULES
// ============================================================

// Rounded rectangular base plate
module rounded_base() {
    linear_extrude(height = base_h)
    hull() {
        translate([-base_l/2 + base_r, -base_w/2 + base_r]) circle(r = base_r);
        translate([ base_l/2 - base_r, -base_w/2 + base_r]) circle(r = base_r);
        translate([-base_l/2 + base_r,  base_w/2 - base_r]) circle(r = base_r);
        translate([ base_l/2 - base_r,  base_w/2 - base_r]) circle(r = base_r);
    }
}

// Support block under the cylinder
module cylinder_support() {
    support_h = cyl_z - cyl_d/2 - base_h;
    translate([cyl_x, cyl_y, base_h + support_h/2])
        cube([cyl_barrel_l + 4, 18, support_h], center = true);
}

// Cylinder assembly: barrel with fins, domed end, head, chimney, drain, piston rod
module engine_cylinder() {
    // Support pedestal
    cylinder_support();

    // Barrel and fins
    translate([cyl_x, cyl_y, cyl_z])
    rotate([0, 90, 0]) {
        union() {
            cylinder(d = cyl_d, h = cyl_barrel_l, center = true);
            for (i = [0 : fin_count-1]) {
                translate([(i - (fin_count-1)/2) * fin_pitch, 0, 0])
                    cylinder(d = fin_d, h = fin_t, center = true);
            }
        }
    }

    // Domed left end cap
    translate([cyl_x - cyl_barrel_l/2, cyl_y, cyl_z])
        sphere(d = cyl_d);

    // Right cylinder head flange
    translate([cyl_x + cyl_barrel_l/2 + cyl_head_t/2, cyl_y, cyl_z])
    difference() {
        cylinder(d = cyl_head_d, h = cyl_head_t, center = true);
        cylinder(d = piston_rod_d + 0.5, h = cyl_head_t + 1, center = true);
    }

    // Chimney / steam pipe on top
    translate([chim_x, cyl_y, cyl_z + cyl_d/2 + chim_h/2])
        cylinder(d = chim_d, h = chim_h, center = true);

    // Drain pipe underneath dome
    translate([drain_x, cyl_y, cyl_z - cyl_d/2 - drain_h/2])
        cylinder(d = drain_d, h = drain_h, center = true);

    // Piston rod from head to crosshead
    rod_start_x = cyl_x + cyl_barrel_l/2 + cyl_head_t;
    rod_end_x   = cross_x - cross_l/2;
    rod_mid_x   = (rod_start_x + rod_end_x) / 2;
    rod_len     = rod_end_x - rod_start_x;

    translate([rod_mid_x, cyl_y, cyl_z])
    rotate([0, 90, 0])
        cylinder(d = piston_rod_d, h = rod_len, center = true);
}

// Crosshead and its sliding guide frame
module crosshead_guide() {
    // Crosshead block
    translate([cross_x, cross_y, cross_z])
        cube([cross_l, cross_w, cross_h], center = true);

    // Guide rails and top bridge
    difference() {
        union() {
            // Two vertical side rails
            for (yy = [-1, 1])
                translate([guide_x, cross_y + yy*(cross_w/2 + 2), base_h + (cross_z + 2 - base_h)/2])
                    cube([guide_l, 3, cross_z + 2 - base_h], center = true);

            // Top bar
            translate([guide_x + 2, cross_y, cross_z + 2])
                cube([guide_l - 4, cross_w + 8, 3], center = true);
        }
        // Slot for crosshead movement
        translate([guide_x, cross_y, cross_z])
            cube([guide_l + 2, cross_w + 2, cross_h + 4], center = true);
    }
}

// Main bearing pedestal with rounded arch top
module main_bearing() {
    difference() {
        union() {
            // Rectangular block up to shaft center
            translate([ped_x, 0, (base_h + shaft_z)/2])
                cube([ped_w, ped_d, shaft_z - base_h], center = true);

            // Semicircular arch on top
            translate([ped_x, 0, shaft_z])
            rotate([90, 0, 0])
                cylinder(d = ped_w, h = ped_d, center = true);
        }
        // Shaft bore
        translate([ped_x, 0, shaft_z])
        rotate([90, 0, 0])
            cylinder(d = shaft_d + 0.5, h = ped_d + 2, center = true);
    }

    // Bearing cap / oiler detail on top
    translate([ped_x, 0, shaft_z + ped_w/2 + 2])
        cube([6, 6, 4], center = true);
    translate([ped_x, 0, shaft_z + ped_w/2 + 5])
        cylinder(d = 3, h = 3, center = true, $fn = 6);
}

// Crank disk and crank pin
module crank_disk() {
    // Disk web
    translate([shaft_x, crank_y, shaft_z])
    rotate([90, 0, 0])
        cylinder(d = crank_disk_d, h = crank_disk_t, center = true);

    // Crank pin (parallel to shaft)
    translate([crank_pin_x, crank_y, crank_pin_z])
    rotate([90, 0, 0])
        cylinder(d = crank_pin_d, h = crank_pin_l, center = true);
}

// Connecting rod with big-end and small-end holes
module connecting_rod() {
    translate([0, crank_y, 0])
    linear_extrude(height = rod_t, center = true)
    difference() {
        hull() {
            translate([cross_x, cross_z]) circle(d = rod_small_d);
            translate([crank_pin_x, crank_pin_z]) circle(d = rod_big_d);
        }
        // Small end hole (wrist pin)
        translate([cross_x, cross_z]) circle(d = wrist_pin_d + 0.5);
        // Big end hole (crank pin)
        translate([crank_pin_x, crank_pin_z]) circle(d = crank_pin_d + 0.5);
    }
}

// Flywheel with rim, web, lightening holes and hub
module flywheel(y_pos, side) {
    // side: -1 = front (outer face toward -Y), +1 = back
    translate([shaft_x, y_pos, shaft_z])
    rotate([90, 0, 0])
    linear_extrude(height = fw_t, center = true)
    difference() {
        union() {
            // Rim (annulus)
            difference() {
                circle(d = fw_d);
                circle(d = fw_d - fw_rim_t*2);
            }
            // Web disk inside rim
            circle(d = fw_d - fw_rim_t*2);
        }
        // Shaft hole
        circle(d = shaft_d + 0.5);
        // Lightening holes
        for (i = [0 : fw_hole_n-1])
            rotate([0, 0, i * 360/fw_hole_n])
                translate([fw_hole_r, 0])
                    circle(d = fw_hole_d);
    }

    // Hub protrusion on outer face
    translate([shaft_x, y_pos + side*(fw_t/2 + fw_hub_l/2), shaft_z])
    rotate([90, 0, 0])
        cylinder(d = fw_hub_d, h = fw_hub_l, center = true);

    // Tiny set-screw / pin detail on front hub
    if (side == -1) {
        translate([shaft_x, y_pos - fw_t/2 - fw_hub_l - 1, shaft_z])
        rotate([90, 0, 0])
            cylinder(d = 2, h = 3, center = true);
    }
}

// Crankshaft running through both flywheels and bearing
module crankshaft() {
    translate([shaft_x, 0, shaft_z])
    rotate([90, 0, 0])
        cylinder(d = shaft_d, h = shaft_l, center = true);
}

// ============================================================
// MAIN ASSEMBLY
// ============================================================
union() {
    // Base
    rounded_base();

    // Cylinder group (left side)
    engine_cylinder();

    // Crosshead and guide
    crosshead_guide();

    // Main bearing pedestal (center)
    main_bearing();

    // Crankshaft and flywheels
    crankshaft();
    flywheel(fw1_y, -1);
    flywheel(fw2_y,  1);

    // Crank disk and connecting rod
    crank_disk();
    connecting_rod();
}