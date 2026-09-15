// Mixed-use tower: parking stack, gridded facade, chamfered podium, gable crown
$fn = 24;
eps = 0.06;

// --- overall (1 unit = 1 m) ---
tw = 16.0;
td = 16.5;
pod_h = 6.6;
fl_h = 3.05;
n_park = 13;
n_upper = 4;
blank_h = 4.2;
slab = 0.32;
wall = 0.42;

park_w = 7.4;
park_d = 11.2;

pod_ext = 5.0;
annex_w = 6.4;
annex_d = 8.6;
annex_h = 6.8;
annex_y = 3.2;

cant_h = 3.55;
gable_h = 8.2;
gable_d = 7.0;
overhang = 1.35;

win_w = 1.42;
win_h = 1.78;
sill = 0.68;
mull = 0.12;
inset = 0.48;
n_cols_side = 4;
n_cols_front = 3;

fin_t = 0.22;
bal_d = 2.35;
bal_w = 5.4;
bal_y = 2.15;

// --- derived ---
z_park0 = pod_h;
z_park_top = pod_h + n_park * fl_h;
z_upper_top = z_park_top + n_upper * fl_h;
z_roof = z_upper_top + blank_h;
open_h = fl_h - slab;

module window_pair(ax, ay, h) {
    h1 = (h - mull) / 2;
    cube([ax, ay, h1]);
    translate([0, 0, h1 + mull]) cube([ax, ay, h1]);
}

module podium() {
    linear_extrude(height = pod_h)
        polygon([
            [0, 0],
            [tw + 0.9, 0],
            [tw + pod_ext, 5.8],
            [tw + pod_ext, td],
            [0, td]
        ]);
}

module annex() {
    translate([-annex_w, annex_y, 0]) {
        cube([annex_w + eps, annex_d, annex_h]);
        translate([0, 0, annex_h - eps])
            difference() {
                cube([annex_w, annex_d, 2.9]);
                translate([wall, wall, -eps])
                    cube([annex_w - wall * 2, annex_d - wall * 2, 3.2]);
            }
        translate([0, annex_d - wall, annex_h])
            cube([wall, wall, 1.6]);
    }
}

module parking() {
    difference() {
        translate([0, 0, z_park0])
            cube([park_w, park_d, n_park * fl_h]);
        for (i = [0 : n_park - 1])
            translate([-eps, -eps, z_park0 + i * fl_h + slab])
                cube([park_w + 2 * eps, park_d - wall + eps, open_h + 0.03]);
    }
}

module residential() {
    translate([park_w - eps, 0, z_park0])
        cube([tw - park_w + eps, td, z_roof - z_park0]);
}

module back_core() {
    translate([0, park_d - wall, z_park0])
        cube([park_w + eps, td - park_d + wall, n_park * fl_h + cant_h]);
}

module cantilever() {
    translate([0, -overhang, z_park_top - eps])
        cube([park_w + 0.55, park_d + overhang, cant_h + eps]);
}

module crown_gable() {
    translate([0.15, -overhang + 0.15, z_park_top + cant_h - eps])
        translate([0, gable_d, 0])
            rotate([90, 0, 0])
                linear_extrude(height = gable_d)
                    polygon([[0, 0], [park_w - 0.2, 0], [(park_w - 0.2) / 2, gable_h]]);
}

module fins() {
    h = z_park_top + cant_h;
    translate([-0.12, -0.38, 0]) cube([fin_t, 1.35, h]);
    translate([0.58, -0.38, 0]) cube([fin_t, 1.35, h]);
}

module balconies() {
    for (i = [0 : n_park - 1])
        translate([park_w - bal_d, bal_y, z_park0 + i * fl_h])
            cube([bal_d + 0.2, bal_w, slab]);
}

module parapet() {
    t = 0.32;
    h = 1.15;
    x0 = park_w;
    w = tw - park_w;
    translate([x0, 0, z_roof - eps]) {
        cube([w, t, h]);
        translate([0, td - t, 0]) cube([w, t, h]);
        translate([w - t, 0, 0]) cube([t, td, h]);
        cube([t, td, h]);
    }
    translate([x0 - 0.25, -0.25, z_roof + h - 0.28])
        cube([w + 0.5, td + 0.5, 0.28]);
}

module window_cutouts() {
    bay_s = td / n_cols_side;
    for (c = [0 : n_cols_side - 1]) {
        y = c * bay_s + (bay_s - win_w) / 2;
        for (r = [0 : n_park - 1]) {
            z = z_park0 + r * fl_h + sill;
            translate([tw - inset, y, z])
                window_pair(inset + eps, win_w, win_h);
        }
        for (r = [0 : n_upper - 1]) {
            z = z_park_top + r * fl_h + sill;
            translate([tw - inset, y, z])
                window_pair(inset + eps, win_w, win_h);
        }
    }
    fw = tw - park_w;
    bay_f = fw / n_cols_front;
    for (c = [0 : n_cols_front - 1]) {
        x = park_w + c * bay_f + (bay_f - win_w) / 2;
        for (r = [0 : n_park - 1]) {
            z = z_park0 + r * fl_h + sill;
            translate([x, -eps, z])
                window_pair(win_w, inset + eps, win_h);
        }
        for (r = [0 : n_upper - 1]) {
            z = z_park_top + r * fl_h + sill;
            translate([x, -eps, z])
                window_pair(win_w, inset + eps, win_h);
        }
    }
}

difference() {
    union() {
        podium();
        annex();
        parking();
        residential();
        back_core();
        cantilever();
        crown_gable();
        fins();
        balconies();
        parapet();
    }
    window_cutouts();
}