// ============================================================
//  Bracket : rounded base plate + hollow sleeve + stepped arm
//            + triangular stiffening rib
//  All dimensions in millimetres
// ============================================================

$fn  = 120;
eps  = 0.001;                 // overlap / clean-cut allowance

// ---------------- Main base (first reference body) ----------
base_len   = 0.341352;        // overall length  (X)
base_w     = 0.199422;        // overall width   (Y)
base_h     = 0.065;           // extrusion depth (Z)
base_cx    = 0.2416;          // circle centre from left edge
base_cy    = 0.0997;          // circle centre from front edge
base_ro    = 0.0997;          // outer radius of rounded end
base_ri    = 0.0434;          // inner (through) radius

// ---------------- Tall hollow sleeve ------------------------
sleeve_cx  = -0.0834;         // centre offset from left reference
sleeve_cy  =  0.0998;         // centre offset from front reference
sleeve_ro  =  0.1301;         // outer radius (span 0.2602)
sleeve_ri  =  0.0867;         // inner radius (through bore)
sleeve_h   =  0.2601;         // upward reach from base datum

// ---------------- Projecting arm (stepped tier) -------------
arm_x0     = -0.4086;         // left edge offset
arm_len    =  0.325145;       // length  (X)
arm_y0     = -0.0303;         // front edge offset
arm_w      =  0.260116;       // width   (Y)
arm_z0     =  0.065;          // lower band removed up to here
arm_z1     =  0.130058;       // top of arm from base datum

// ---------------- Triangular web / rib ----------------------
rib_x0     = 0.0466;          // rib start (sleeve outer face)
rib_run    = 0.108382;        // plan run toward the base
rib_t      = 0.0217;          // material thickness (Y)
rib_y_back = 0.0998;          // back face of the rib
rib_z0     = 0.065;           // sits on the base top face
rib_rise   = 0.195087;        // vertical rise (to sleeve top 0.2601)

// ============================================================
//  MODULES
// ============================================================

// Rounded "D" shaped base plate with the annular boss profile
module base_plate() {
    linear_extrude(height = base_h)
        union() {
            // straight portion of the plate
            square([base_cx, base_w]);
            // rounded (annular) end
            translate([base_cx, base_cy]) circle(r = base_ro);
        }
}

// Tall hollow sleeve (annular cylinder, concentric bore)
module sleeve() {
    translate([sleeve_cx, sleeve_cy, 0])
        cylinder(h = sleeve_h, r = sleeve_ro);
}

// Projecting straight-sided arm, already trimmed to the
// raised stepped tier (lower band 0 .. arm_z0 removed)
module arm() {
    translate([arm_x0, arm_y0, arm_z0])
        cube([arm_len, arm_w, arm_z1 - arm_z0]);
}

// Narrow triangular web between sleeve wall and base top face
module rib() {
    translate([0, rib_y_back, 0])
        rotate([90, 0, 0])
            linear_extrude(height = rib_t)
                polygon(points = [
                    [rib_x0,           rib_z0],
                    [rib_x0 + rib_run, rib_z0],
                    [rib_x0,           rib_z0 + rib_rise]
                ]);
}

// ============================================================
//  ASSEMBLY : solids united, then bores cut through
// ============================================================
module bracket() {
    difference() {
        union() {
            base_plate();     // step 1 : base slab
            sleeve();         // step 2 : tall hollow sleeve
            arm();            // step 3 : stepped arm tier
            rib();            // step 4 : triangular web
        }

        // step 5 : sleeve through bore
        translate([sleeve_cx, sleeve_cy, -eps])
            cylinder(h = sleeve_h + 2*eps, r = sleeve_ri);

        // step 6 : small through hole in the base annulus
        translate([base_cx, base_cy, -eps])
            cylinder(h = base_h + 2*eps, r = base_ri);
    }
}

bracket();