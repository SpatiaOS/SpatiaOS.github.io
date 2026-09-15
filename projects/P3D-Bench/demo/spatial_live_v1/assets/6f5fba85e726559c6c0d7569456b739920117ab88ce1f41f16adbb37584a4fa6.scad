// =============================================================
// Scissor assembly : two blade halves + slotted pivot fastener
// Planar layout, thin direction along X, blades down, loops up
// =============================================================
$fn = 120;

// ---- main dimensions (mm) ----
thick_loop   = 7.0;    // finger-loop thickness (X direction)
thick_plate  = 2.0;    // blade plate thickness at pivot (bore length)
hole_d       = 1.583;  // pivot bore diameter
boss_r       = 2.654;  // pivot boss radius

// slotted knob fastener
shaft_r      = 0.876;
shaft_len    = 4.0;
head_t       = 1.0;
head_r_big   = 2.66;
head_r_small = 2.56;
slot_w       = 0.9;
slot_depth   = 0.55;

// splay angles (deg) about the pivot
handle_splay = 12;     // handle/loop lean
blade_splay  = 4;      // blade lean (opposite sense -> crossing tips)

// ---- helpers ----
module ellipse(rx, ry) { scale([rx, ry]) circle(r = 1); }

// one scissor half: loop ring + neck (thick) and tapered blade plate (thin)
module blade_half(handle_ang, blade_ang,
                  loop_cy, loop_al, loop_aw, loop_il, loop_iw,
                  neck_top, blade_len, bend) {
    // handle : elliptical finger-loop ring plus neck, tilted outward
    rotate([0, 0, handle_ang])
        linear_extrude(height = thick_loop, center = true)
            union() {
                translate([0, loop_cy])
                    difference() {
                        ellipse(loop_aw, loop_al);   // outer loop
                        ellipse(loop_iw, loop_il);   // loop opening
                    }
                // neck connecting loop band down to the pivot region
                polygon([[-3.2, 3], [3.2, 3],
                         [5.6, neck_top], [-5.6, neck_top]]);
            }

    // blade : long tapered plate with pivot boss and bore
    rotate([0, 0, blade_ang])
        linear_extrude(height = thick_plate, center = true)
            difference() {
                union() {
                    polygon([[-bend,          -blade_len],
                             [ 0.5,           -blade_len + 10],
                             [ 3.2,           -60],
                             [ 4.6,           -20],
                             [ 5.0,            8],
                             [-5.0,            8],
                             [-4.6,           -20],
                             [-4.4,           -60],
                             [-bend - 0.5,    -blade_len + 10]]);
                    circle(r = boss_r);          // short pivot boss
                }
                circle(d = hole_d);              // pivot bore
            }
}

// slotted knob fastener : shaft + two disc heads, slot in top head
module fastener() {
    difference() {
        union() {
            cylinder(h = shaft_len, r = shaft_r, center = true);
            translate([0, 0,  shaft_len/2 - head_t/2])
                cylinder(h = head_t, r1 = head_r_big - 0.15, r2 = head_r_big, center = true);
            translate([0, 0, -(shaft_len/2 - head_t/2)])
                cylinder(h = head_t, r1 = head_r_small, r2 = head_r_small - 0.15, center = true);
        }
        // screw slot across outer face of large head
        translate([-slot_w/2, -(head_r_big + 1), shaft_len/2 - slot_depth])
            cube([slot_w, 2*(head_r_big + 1), slot_depth + 0.2]);
    }
}

// ---- assembly (pivot at origin, both plates share z in [-1, 1]) ----
rotate([0, 90, 0])                 // lay the common plane normal along X
union() {
    // half A : large loop, splayed right, blade crossing to the left
    color("gainsboro")
        blade_half(handle_ang = -handle_splay, blade_ang = -blade_splay,
                   loop_cy = 37, loop_al = 17, loop_aw = 23,
                   loop_il = 11, loop_iw = 16,
                   neck_top = 23, blade_len = 100, bend = 2);

    // half B : small loop, splayed left, blade crossing to the right
    color("lightgray")
        blade_half(handle_ang =  handle_splay, blade_ang =  blade_splay,
                   loop_cy = 43, loop_al = 11, loop_aw = 13,
                   loop_il = 5.5, loop_iw = 7,
                   neck_top = 35, blade_len = 107, bend = 2);

    // pivot fastener through both bores
    color("dimgray") fastener();
}