// Parameters
$fn = 32;
eps = 0.00005;

// Main body
body_x = 0.702127;
body_y = 0.524964;
body_z = 0.2103; // formed height, nominal 0.210295

// Top shallow recess
top_x_size = 0.667793;
top_y_size = 0.490631;
top_left_inset = 0.0171;
top_right_inset = 0.0172;
top_front_inset = 0.0172;
top_back_inset = 0.0172;
top_z0 = 0.1888;
top_z1 = body_z;

// Middle continuation cut
mid_x_size = 0.650626;
mid_y_size = 0.46488;
mid_left_inset = 0.0257;
mid_right_inset = 0.0258;
mid_front_inset = 0.03;
mid_back_inset = 0.0301;
mid_z0 = 0.0729;
mid_z1 = 0.1888;

// Lower offset pocket
low_x_size = 0.567882;
low_y_size = 0.447713;
low_left_inset = 0.0999;
low_right_inset = 0.0343;
low_front_inset = 0.0386;
low_back_inset = 0.0387;
low_z0 = 0.0215;
low_z1 = 0.073;

// Added side projection
proj_x_size = 0.130618;
proj_y_size = 0.463588;
proj_left_overhang = 0.0479;
proj_right_clearance = 0.6194;
proj_front_inset = 0.03;
proj_back_inset = 0.0314;
proj_z0 = 0.073;
proj_z1 = 0.0876;

// Side recess cut
side_cut_depth = 0.0343;
side_cut_y_size = 0.367372; // nominal 0.3674
side_cut_front_inset = 0.0546;
side_cut_back_inset = 0.103;
side_cut_z0 = 0.0876;
side_cut_z1 = 0.1889;

// Rounded-dimension placement helper
function balanced_start(total, size, lead, trail) =
    (lead + (total - trail - size)) / 2;

// Derived positions
top_x0 = balanced_start(body_x, top_x_size, top_left_inset, top_right_inset);
top_y0 = balanced_start(body_y, top_y_size, top_front_inset, top_back_inset);

mid_x0 = balanced_start(body_x, mid_x_size, mid_left_inset, mid_right_inset);
mid_y0 = balanced_start(body_y, mid_y_size, mid_front_inset, mid_back_inset);

low_x0 = balanced_start(body_x, low_x_size, low_left_inset, low_right_inset);
low_y0 = balanced_start(body_y, low_y_size, low_front_inset, low_back_inset);

proj_x0 = balanced_start(body_x, proj_x_size, -proj_left_overhang, proj_right_clearance);
proj_y0 = balanced_start(body_y, proj_y_size, proj_front_inset, proj_back_inset);

side_cut_y0 = balanced_start(body_y, side_cut_y_size, side_cut_front_inset, side_cut_back_inset);

// Basic box from lower-front-left corner
module box_at(p, s) {
    translate(p)
        cube(s, center=false);
}

// Main rectangular solid
module main_body() {
    box_at([0, 0, 0], [body_x, body_y, body_z]);
}

// Top recess cutter
module top_recess_cut() {
    box_at(
        [top_x0, top_y0, top_z0],
        [top_x_size, top_y_size, top_z1 - top_z0 + eps]
    );
}

// Middle continuation cutter
module middle_cut() {
    box_at(
        [mid_x0, mid_y0, mid_z0],
        [mid_x_size, mid_y_size, mid_z1 - mid_z0 + eps]
    );
}

// Lower pocket cutter
module lower_pocket_cut() {
    box_at(
        [low_x0, low_y0, low_z0],
        [low_x_size, low_y_size, low_z1 - low_z0 + eps]
    );
}

// Added lower side projection
module side_projection() {
    box_at(
        [proj_x0, proj_y0, proj_z0],
        [proj_x_size, proj_y_size, proj_z1 - proj_z0]
    );
}

// Left-edge side recess cutter
module side_recess_cut() {
    box_at(
        [-eps, side_cut_y0, side_cut_z0],
        [side_cut_depth + eps, side_cut_y_size, side_cut_z1 - side_cut_z0 + eps]
    );
}

// Body with stepped top pocket stack
module pocketed_body() {
    difference() {
        main_body();
        top_recess_cut();
        middle_cut();
        lower_pocket_cut();
    }
}

// Final model
module model() {
    difference() {
        union() {
            pocketed_body();
            side_projection();
        }
        side_recess_cut();
    }
}

model();