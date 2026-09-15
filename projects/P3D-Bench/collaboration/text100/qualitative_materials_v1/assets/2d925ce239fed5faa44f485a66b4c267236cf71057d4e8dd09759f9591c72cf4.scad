// ============================================================
// Low rectangular open web plate with stiffening ribs
// and two tall solid side walls along the long edges
// ============================================================

// ---------- Global parameters ----------
plate_len    = 120;   // overall length (X)
plate_wid    = 60;    // overall width  (Y)
web_thk      = 4;     // thickness (height) of the thin open web
frame_w      = 6;     // width of the perimeter rib
rib_w        = 4;     // width of internal cross / diagonal ribs

cells_x      = 4;     // web cells along X
cells_y      = 2;     // web cells along Y

hub_d        = 18;    // outer diameter of the circular hubs
hole_d       = 10;    // diameter of the circular through openings

wall_thk     = 7;     // thickness of each long side wall
wall_h       = 18;    // height of the side walls (from the same base plane)

$fn = 64;

// Derived cell pitch
cell_x = plate_len / cells_x;
cell_y = plate_wid / cells_y;

// ---------- Helper: straight rib between two 2D points ----------
module rib(p1, p2, w) {
    hull() {
        translate(p1) circle(d = w, $fn = 24);
        translate(p2) circle(d = w, $fn = 24);
    }
}

// ---------- 2D profile of the open web ----------
module web_profile() {
    difference() {
        union() {
            // Perimeter frame
            difference() {
                square([plate_len, plate_wid]);
                translate([frame_w, frame_w])
                    square([plate_len - 2*frame_w, plate_wid - 2*frame_w]);
            }

            // Internal cross ribs (grid lines along Y)
            for (i = [1 : cells_x - 1])
                rib([i*cell_x, 0], [i*cell_x, plate_wid], rib_w);

            // Internal cross ribs (grid lines along X)
            for (j = [1 : cells_y - 1])
                rib([0, j*cell_y], [plate_len, j*cell_y], rib_w);

            // Diagonal ribs + circular hubs inside every cell
            for (i = [0 : cells_x - 1], j = [0 : cells_y - 1]) {
                x0 = i*cell_x;      x1 = (i+1)*cell_x;
                y0 = j*cell_y;      y1 = (j+1)*cell_y;

                rib([x0, y0], [x1, y1], rib_w);   // diagonal "/"
                rib([x0, y1], [x1, y0], rib_w);   // diagonal "\"

                // Hub at cell centre
                translate([(x0+x1)/2, (y0+y1)/2])
                    circle(d = hub_d);
            }
        }

        // Circular through openings at each hub centre
        for (i = [0 : cells_x - 1], j = [0 : cells_y - 1])
            translate([(i+0.5)*cell_x, (j+0.5)*cell_y])
                circle(d = hole_d);
    }
}

// ---------- Thin open web body ----------
module web_body() {
    linear_extrude(height = web_thk)
        web_profile();
}

// ---------- Tall solid side walls on the two long edges ----------
module side_walls() {
    // Wall at y = 0
    cube([plate_len, wall_thk, wall_h]);
    // Wall at y = plate_wid
    translate([0, plate_wid - wall_thk, 0])
        cube([plate_len, wall_thk, wall_h]);
}

// ---------- Final assembly (stepped depth: web shallow, walls tall) ----------
module open_web_plate() {
    union() {
        web_body();     // shallow perforated web
        side_walls();   // added solid material, rising above the web
    }
}

open_web_plate();