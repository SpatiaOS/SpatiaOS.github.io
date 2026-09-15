// ============================================================
// Hand-cranked ring-gear demonstrator (image interpretation)
//  - wedge pedestal with mounting feet
//  - large vertical internal (ring) gear behind the pedestal
//  - stepped hub + shaft carrying two crank handles
//  - sun / planet gears, carrier, pointer and link inside ring
// ============================================================

$fn = 48;

/* ring gear */
ring_r_out  = 75;            // rim outer radius
ring_r_root = 62;            // internal tooth root radius
ring_w      = 12;            // rim width along axis
ring_teeth  = 60;
ring_td     = 4;             // radial tooth height
ring_tw     = 4.5;           // tangential tooth width
ring_c      = [42, 0, 110];  // ring axis centre (axis = X)

/* stand (wedge profile in X-Z) */
stand_w   = 50;
stand_pts = [[-70,0],[35,0],[35,86],[-4,100]];
foot_w=16; foot_d=12; foot_h=5; foot_hole=5;
slope_b = atan2(-100,66);    // front slope-face normal angle

/* hub & shaft */
hub_z=110; hub_r=11; hub_len=62; shaft_r=4;

/* cranks */
crank_t=5; crank_r=6;
handle_r=5.5; handle_l=30;
long_len=120; long_tilt=20; long_x=-56;
short_len=84; short_tilt=4; short_x=-44;

/* inner gears (planet meshes sun + ring) */
gear_x=39;
sun_r=12; sun_n=12;
pla_r=10; pla_n=10;
big_r=22; big_n=22;

metal=[0.72,0.73,0.76];

// ---------------- parts ----------------

module spur_gear(r,n,th,td,tw){           // axis = Z
  union(){
    cylinder(r=r,h=th,center=true);
    for(i=[0:n-1])
      rotate([0,0,i*360/n])
        translate([r+td/2-0.4,0,0])
          cube([td,tw,th],center=true);
  }
}

module ring_gear(){                        // axis = Z
  union(){
    difference(){
      cylinder(r=ring_r_out,h=ring_w,center=true,$fn=180);
      cylinder(r=ring_r_root,h=ring_w+2,center=true,$fn=180);
    }
    for(i=[0:ring_teeth-1])
      rotate([0,0,i*360/ring_teeth])
        translate([ring_r_root-ring_td/2+0.4,0,0])
          cube([ring_td,ring_tw,ring_w],center=true);
  }
}

module foot(x,y){
  translate([x,y,foot_h/2])
    difference(){
      cube([foot_w,foot_d,foot_h],center=true);
      cylinder(d=foot_hole,h=foot_h+2,center=true);
    }
}

module stand(){
  // wedge body (profile extruded along Y)
  rotate([90,0,0])
    translate([0,0,-stand_w/2])
      linear_extrude(height=stand_w)
        polygon(stand_pts);
  // feet
  fy=stand_w/2+foot_d/2-2;
  foot(-56, fy); foot(-56,-fy);
  foot( 26, fy); foot( 26,-fy);
  // bearing block under hub barrel
  translate([8,0,94]) cube([30,16,14],center=true);
  // bracket tying pedestal back to ring rim
  translate([36,0,40]) cube([16,20,14],center=true);
  // stud + square washer on the slope
  translate([-36,-14,51]) rotate([0,slope_b,0]){
    translate([0,0,1]) cube([10,10,3],center=true);
    translate([0,0,5]) cylinder(r=4,h=10,center=true);
  }
  // diamond-head bolt lower on the slope
  translate([-53,12,26]) rotate([0,slope_b,0]) rotate([0,0,45])
    cube([9,9,3.5],center=true);
}

module hub(){
  translate([0,0,hub_z]) rotate([0,90,0]){
    cylinder(r=hub_r,h=hub_len,center=true);                 // barrel
    translate([0,0,-hub_len/2+4]) cylinder(r=13.5,h=8,center=true);
    translate([0,0,-hub_len/2-3]) cylinder(r=9,h=6,center=true);
    translate([0,0,-hub_len/2-8]) cylinder(r=6,h=6,center=true);
    translate([0,0,-46]) cylinder(r=shaft_r,h=28,center=true); // shaft
    translate([0,0,-59]) cylinder(r=5,h=3,center=true);        // end cap
    for(a=[0,120,240])                                          // face bolts
      translate([8*cos(a),8*sin(a),-hub_len/2-1.5])
        cylinder(r=2,h=3,center=true);
  }
}

module crank_arm(len,tilt){               // pivot at origin, bar in Y-Z
  rotate([tilt,0,0]){
    difference(){
      hull(){
        rotate([0,90,0]) cylinder(r=crank_r,h=crank_t,center=true);
        translate([0,0,len]) rotate([0,90,0])
          cylinder(r=crank_r,h=crank_t,center=true);
      }
      rotate([0,90,0]) cylinder(r=2.2,h=crank_t+2,center=true);
    }
    translate([-crank_t/2-2,0,len]){      // grip toward -X
      rotate([0,90,0]) cylinder(r=7,h=4,center=true);
      translate([-handle_l/2,0,0]) rotate([0,90,0])
        cylinder(r=handle_r,h=handle_l,center=true);
    }
  }
}

module gear_cluster(){
  translate([gear_x+4.5,0,hub_z])         // carrier plate
    hull(){
      rotate([0,90,0]) cylinder(r=6,h=3,center=true);
      translate([0,0, 22]) rotate([0,90,0]) cylinder(r=6,h=3,center=true);
      translate([0,0,-34]) rotate([0,90,0]) cylinder(r=6,h=3,center=true);
    }
  translate([gear_x,0,hub_z])    rotate([0,90,0]) spur_gear(sun_r,sun_n,6,3,4);
  translate([gear_x,0,hub_z+22]) rotate([0,90,0]) spur_gear(pla_r,pla_n,6,2.5,3.5);
  translate([gear_x,0,hub_z-34]) rotate([0,90,0]) spur_gear(big_r,big_n,6,3,4.5);
}

module pointer(){                          // needle with top loop
  translate([gear_x-7,0,hub_z]){
    hull(){
      rotate([0,90,0]) cylinder(r=2,h=3,center=true);
      translate([0,4,42]) rotate([0,90,0]) cylinder(r=2,h=3,center=true);
    }
    translate([0,4,44]) rotate([0,90,0])
      difference(){
        cylinder(r=5,h=3,center=true);
        cylinder(r=3,h=4,center=true);
      }
  }
}

module link(){                             // small connecting rod
  translate([gear_x+8,0,0]){
    hull(){
      translate([0, 9,62]) rotate([0,90,0]) cylinder(r=3.5,h=4,center=true);
      translate([0,-9,48]) rotate([0,90,0]) cylinder(r=3.5,h=4,center=true);
    }
    translate([0, 9,62]) rotate([0,90,0]) cylinder(r=2,h=9,center=true);
    translate([0,-9,48]) rotate([0,90,0]) cylinder(r=2,h=9,center=true);
  }
}

// ---------------- assembly ----------------
color(metal){
  stand();
  hub();
  translate(ring_c) rotate([0,90,0]) ring_gear();
  gear_cluster();
  pointer();
  link();
  translate([long_x ,0,hub_z]) crank_arm(long_len ,long_tilt);
  translate([short_x,0,hub_z]) crank_arm(short_len,short_tilt);
}