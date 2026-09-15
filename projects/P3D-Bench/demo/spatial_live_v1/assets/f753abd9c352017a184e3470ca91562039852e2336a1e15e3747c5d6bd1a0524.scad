// ---------------- Parameters ----------------
floor_h  = 3.2;                 // storey height
floors   = 18;                  // number of tower floors
podium_h = 6;                   // podium base height
tower_h  = podium_h + floors*floor_h;
W  = 44; D = 20; CH = 8;        // plan width, depth, corner chamfer
balc_proj = 2.2; balc_t = 0.7;  // balcony projection / slab thickness
win_h = 2.0;                    // window band height
$fn = 32;

// plan polygon (chamfered rectangle)
plan = [[0,0],[W-CH,0],[W,CH],[W,D],[0,D]];
// roof crown outlines
tri_o  = [[3,3],[26,3],[3,17]];
rect_o = [[28,4],[W-2,4],[W-2,D-2],[28,D-2]];

// parapet ring helper
module ring(pts, t, h) {
    difference() {
        linear_extrude(h) polygon(pts);
        translate([0,0,-0.5]) linear_extrude(h+1) offset(delta=-t) polygon(pts);
    }
}

// recessed glazing bands on front, right and chamfered faces
module facade_cuts() {
    for (i=[0:floors-1]) {
        z = podium_h + i*floor_h;
        translate([4,-0.6,z+0.9]) cube([28,1.1,win_h]);                 // front glass
        translate([W-0.5,2,z+0.8]) cube([0.6,D-4,win_h]);               // right glass
        translate([W-CH,0,0]) rotate([0,0,45])
            translate([1,-0.1,z+0.8]) cube([CH*1.414-2,0.6,win_h]);     // chamfer glass
    }
}

// window mullion / frame grids on right and chamfered faces
module frames() {
    for (i=[0:floors-1]) {
        z = podium_h + i*floor_h;
        for (y=[2:3:D-2]) translate([W-0.5,y,z+0.8]) cube([0.5,0.5,win_h]);
        translate([W-0.5,2,z+0.8+win_h/2]) cube([0.5,D-4,0.35]);
        translate([W-CH,0,0]) rotate([0,0,45]) {
            for (x=[1:3:CH*1.414-2]) translate([x,0,z+0.8]) cube([0.5,0.5,win_h]);
            translate([1,0,z+0.8+win_h/2]) cube([CH*1.414-2,0.5,0.35]);
        }
    }
}

// projecting balcony slabs, railings and dividers on front face
module balconies() {
    for (i=[0:floors-1]) {
        z = podium_h + i*floor_h;
        translate([3,-balc_proj,z]) cube([30,balc_proj,balc_t]);
        translate([3,-balc_proj,z+balc_t]) cube([30,0.5,1.1]);
        for (x=[3:6:33])
            translate([x,-balc_proj,z+balc_t]) cube([0.4,balc_proj,floor_h-balc_t-0.2]);
    }
}

// ---------------- Main model ----------------
difference() {
    union() {
        linear_extrude(tower_h) polygon(plan);                       // tower core
        linear_extrude(podium_h) offset(delta=2.5) polygon(plan);    // podium base
        translate([0,0,tower_h]) linear_extrude(0.8) offset(delta=0.8) polygon(plan); // roof plate
        translate([0,0,tower_h+0.8]) {                               // roof crown parapets
            ring(tri_o,1.5,2.4);
            ring(rect_o,1.5,1.8);
        }
        translate([-16,4,0]) cube([16,12,9]);                        // low annex block
        balconies();
        for (y=[3,9,15])                                             // left edge fins
            translate([-0.5,y,podium_h]) cube([0.5,1.2,floors*floor_h]);
    }
    facade_cuts();
    translate([-14.5,5.5,1.5]) cube([13,9,9]);                       // annex courtyard void
}
frames();