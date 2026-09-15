// =====================================================================
//  Steering-shaft assembly (reconstructed)
//  Chain: splined pin - UJ yoke - [knuckle A] - serrated angle joint
//         - splined shaft yoke - [knuckle B] - UJ yoke - splined pin
// =====================================================================
$fn = 96;

/* ------------------ parameters (mm) ------------------ */
bend_a      = 6;      // articulation at knuckle A (about Y)
bend_b      = 8;      // articulation at knuckle B (about Y)
twist_b     = 12;     // roll of end link at knuckle B
tilt        = 10;     // overall chain slope

journal_r   = 10;     // coupling-pin journal
journal_l   = 53.5;
spl_len     = 21.5;   // coupling-pin spline
spl_n       = 36;
spl_root    = 8.1;
spl_tip     = 9.5;
spl_w       = 1.2;

hub_r       = 13.5;   // yoke hub
hub_len     = 28;
yoke_off    = 46;     // hub face -> cross centre
earR_l      = 9.5;    // main clevis ear
earR_s      = 8.75;   // secondary clevis ear
earD_l      = 14.75;  // main ear offset
earD_s      = 13.5;   // secondary ear offset

tru_r       = 4;      // spider trunnions
truY        = 21;
barrel_r    = 7.5;

serr_n      = 38;     // serrated sleeve
serr_root   = 7.7;
serr_tip    = 8.85;
serr_len    = 40;
sj_r        = 11;     // serrated-joint body radius

shank_r     = 11.08;  // splined shaft yoke
shank_len   = 66;
sock_len    = 30;
sock_maj    = 8.95;
sock_notch  = 7.35;

/* ------------------ 2D tooth profiles ------------------ */
// external spline / serration
module ext_spline2d(n, rb, tip, w) {
  union() {
    circle(r = rb);
    for (i = [0 : n-1])
      rotate([0, 0, i*360/n])
        translate([rb-0.6, 0]) square([tip-rb+0.6, w], center=true);
  }
}
// internal splined bore profile
module int_spline2d(n, rmaj, rnotch, w) {
  difference() {
    circle(r = rmaj);
    for (i = [0 : n-1])
      rotate([0, 0, i*360/n])
        translate([rnotch, 0]) square([rmaj-rnotch+1, w], center=true);
  }
}

/* ------------------ splined coupling pin ------------------ */
// origin at outer journal tip, runs toward -X
module splined_pin() {
  difference() {
    union() {
      rotate([0,-90,0]) linear_extrude(journal_l) circle(r = journal_r);
      rotate([0,-90,0]) translate([0,0,journal_l])
        linear_extrude(spl_len) ext_spline2d(spl_n, spl_root, spl_tip, spl_w);
    }
    translate([-8,0,0])  rotate([90,0,0]) cylinder(h=26, r=3, center=true); // radial retention holes
    translate([-14,0,0]) cylinder(h=26, r=3, center=true);
  }
}

/* ------------------ cross (spider) elements ------------------ */
module cross_y() {
  rotate([90,0,0]) {
    cylinder(h = 2*truY, r = tru_r, center=true);
    for (s=[-1,1]) translate([0,0,s*truY]) sphere(r=tru_r);
  }
}
module cross_z(tl) {
  cylinder(h = 2*tl, r = tru_r, center=true);
  for (s=[-1,1]) translate([0,0,s*tl]) sphere(r=tru_r);
}
module cross_barrel() {
  rotate([0,90,0]) cylinder(h=12, r=barrel_r, center=true);
}

/* ------------------ universal-joint yoke ------------------ */
// cross centre at origin, splined hub bore opens toward -X
module uj_yoke(longY = true) {
  difference() {
    union() {
      translate([-yoke_off,0,0]) rotate([0,90,0]) cylinder(h=hub_len, r=hub_r);
      hull() {                                        // hub-to-clevis web
        translate([-22,0,0]) rotate([0,90,0]) cylinder(h=2, r=13);
        translate([-9,0,0])  rotate([0,90,0]) cylinder(h=2, r=10.5);
      }
      if (longY) {                                    // main clevis on Y, secondary on Z
        for (s=[-1,1]) {
          translate([-7, s*earD_l, 0]) cube([14, 8.5, 19], center=true);
          translate([0,  s*earD_l, 0]) rotate([90,0,0]) cylinder(h=8.5, r=earR_l, center=true);
          translate([-5, 0, s*earD_s]) cube([10, 17.5, 5], center=true);
          translate([0,  0, s*earD_s]) cylinder(h=8.5, r=earR_s, center=true);
        }
      } else {                                        // main clevis on Z, secondary on Y
        for (s=[-1,1]) {
          translate([-7, 0, s*earD_l]) cube([14, 19, 8.5], center=true);
          translate([0,  0, s*earD_l]) cylinder(h=8.5, r=earR_l, center=true);
          translate([-5, s*earD_s, 0]) cube([10, 5, 17.5], center=true);
          translate([0,  s*earD_s, 0]) rotate([90,0,0]) cylinder(h=8.5, r=earR_s, center=true);
        }
      }
    }
    // splined hub bore with countersunk entry
    translate([-yoke_off,0,0]) rotate([0,90,0]) cylinder(h=3, r1=12.5, r2=9.9);
    translate([-yoke_off+3,0,0]) rotate([0,90,0])
      linear_extrude(24) int_spline2d(spl_n, 9.9, 7.9, 1.45);
    // trunnion bores
    if (longY) {
      for (s=[-1,1]) translate([0, s*earD_l, 0]) rotate([90,0,0]) cylinder(h=13, r=4.15, center=true);
      for (s=[-1,1]) translate([0, 0, s*earD_s]) cylinder(h=13, r=4.75, center=true);
    } else {
      for (s=[-1,1]) translate([0, 0, s*earD_l]) cylinder(h=13, r=4.15, center=true);
      for (s=[-1,1]) translate([0, s*earD_s, 0]) rotate([90,0,0]) cylinder(h=13, r=4.75, center=true);
    }
  }
}

/* ------------------ serrated angle joint ------------------ */
// cross centre at origin; clevis fork, body, clevis lug, serrated sleeve (+X)
module serrated_joint() {
  difference() {
    union() {
      for (s=[-1,1]) {                                        // semi-circular fork (Z pair)
        translate([3, 0, s*11]) cube([12, 11, 6], center=true);
        translate([0, 0, s*earD_s]) cylinder(h=8.5, r=earR_s, center=true);
      }
      translate([4,0,0]) rotate([0,90,0]) cylinder(h=26, r=sj_r);   // body
      translate([14,0,8]) cube([14, 21, 24]);                       // rectangular clevis lug
      translate([30,0,0]) rotate([0,90,0])                          // external serrated sleeve
        linear_extrude(serr_len) ext_spline2d(serr_n, serr_root, serr_tip, 1.15);
    }
    for (s=[-1,1]) translate([0,0,s*earD_s]) cylinder(h=13, r=4.15, center=true);
    // countersunk through-hole in clevis web
    translate([21,0,20]) rotate([90,0,0]) cylinder(h=30, r=9.75, center=true);
    translate([21, 10.5, 20]) rotate([90,0,0])  cylinder(h=3, r1=13, r2=9.75);
    translate([21,-10.5,20]) rotate([-90,0,0]) cylinder(h=3, r1=13, r2=9.75);
  }
}

/* ------------------ splined shaft yoke ------------------ */
// internal splined socket receives the serrated sleeve; Y clevis at far end
module shaft_yoke(x0 = 62) {
  xc = x0 + sock_len + shank_len + 20;                 // cross-2 centre
  difference() {
    union() {
      translate([x0,0,0]) rotate([0,90,0]) cylinder(h=sock_len, r=shank_r);
      translate([x0+sock_len,0,0]) rotate([0,90,0]) cylinder(h=shank_len, r=shank_r);
      translate([x0+sock_len+shank_len,0,0]) rotate([0,90,0]) cylinder(h=8, r=10.5);
      for (s=[-1,1]) {
        translate([xc-14, s*earD_l, 0]) cube([14, 8.5, 19], center=true);
        translate([xc, s*earD_l, 0]) rotate([90,0,0]) cylinder(h=8.5, r=earR_l, center=true);
      }
    }
    translate([x0,0,0]) rotate([0,90,0])               // blind internal serrated socket
      linear_extrude(22) int_spline2d(serr_n, sock_maj, sock_notch, 1.45);
    for (s=[-1,1]) translate([xc, s*earD_l, 0]) rotate([90,0,0]) cylinder(h=13, r=4.15, center=true);
  }
}

/* ------------------ slender locating pin ------------------ */
// wedge-like section (two flats + arc), rests on the clevis flat
module locating_pin(l = 36) {
  rotate([0,90,0]) linear_extrude(l, center=true)
    intersection() { circle(r=1.1); translate([0.3,0.3]) square([2.2,2.2]); }
}

/* ------------------ assembly ------------------ */
module assembly() {
  // segment 1 : pin 1 + yoke 1 (knuckle A at x=96)
  scale([-1,1,1]) splined_pin();
  translate([96,0,0]) uj_yoke(true);
  translate([96,0,0]) cross_y();
  translate([96,0,0]) cross_barrel();

  // knuckle A bend
  translate([96,0,0]) rotate([0, bend_a, 0]) {
    serrated_joint();
    cross_z(19.5);
    shaft_yoke(62);
    translate([24, 7, 33]) locating_pin(36);
    translate([178,0,0]) cross_y();                    // cross-2 Y trunnions

    // knuckle B bend + roll of end link
    translate([178,0,0]) rotate([0, bend_b, 0]) rotate([twist_b, 0, 0]) {
      scale([-1,1,1]) uj_yoke(false);
      translate([95,0,0]) splined_pin();
      cross_z(21);
      cross_barrel();
    }
  }
}

// pose : chain along -X with downward articulation
rotate([0,0,180]) rotate([0, tilt, 0]) assembly();