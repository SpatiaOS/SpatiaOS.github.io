// Bevel Gear Assembly Reconstruction
// Based on provided image and text description.
// Units: mm

$fn = 64; // Resolution for curves

// --- Parameters ---

// Small Gear (Top Left, Axis Y)
small_gear_teeth = 20;
small_gear_major_radius = 60;
small_gear_minor_radius = 20;
small_gear_height = 40;
small_gear_bore_radius = 14.4; // 28.8 mm diameter
small_pin_radius = 14.4;
small_pin_length = 120;

// Large Gears (Center/Bottom Axis Z, Right Axis X)
large_gear_teeth = 40;
large_gear_major_radius = 120;
large_gear_minor_radius = 40;
large_gear_height = 80;
large_gear_bore_radius = 33.874; // 67.748 mm diameter
large_pin_radius = 33.87;
large_pin_length_1 = 175; // Right gear pin
large_pin_length_2 = 100; // Center gear pin

// --- Modules ---

// Module to create a bevel gear with straight teeth approximation
module bevel_gear(major_r, minor_r, height, teeth, bore_r) {
    // Calculate cone angle
    cone_angle = atan((major_r - minor_r) / height);
    
    // Tooth dimensions
    tooth_width = (2 * PI * major_r) / teeth * 0.45;
    tooth_height = 15;
    tooth_depth = 20; // Radial depth of tooth
    
    difference() {
        union() {
            // Main Cone Body (Frustum)
            // Placed such that major radius is at z=0, minor at z=height
            cylinder(h = height, r1 = major_r, r2 = minor_r, center = false);
            
            // Hub extension (cylindrical part at the top/minor radius end)
            translate([0, 0, height])
                cylinder(h = 10, r = minor_r, center = false);
            
            // Teeth
            for (i = [0 : teeth - 1]) {
                rotate([0, 0, i * 360 / teeth]) {
                    // Position tooth on the cone surface
                    // Translate to major radius
                    translate([major_r, 0, height / 2]) {
                        // Rotate to align with cone slope
                        // The cone surface slopes inward. 
                        // We rotate around Y to match the cone angle.
                        rotate([0, -cone_angle, 0]) {
                            // Create a block for the tooth
                            // Centered on the surface
                            cube([tooth_width, tooth_depth, tooth_height], center = true);
                        }
                    }
                }
            }
        }
        
        // Central Bore
        // Through hole
        translate([0, 0, -5])
            cylinder(h = height + 20, r = bore_r, center = false);
    }
}

// Module for the shaft/pin
module shaft(radius, length) {
    cylinder(h = length, r = radius, center = false);
}

// --- Assembly ---

// The assembly consists of 3 gears and 3 pins.
// Coordinate System:
// Origin (0,0,0) is the common mesh zone.
// Center Gear: Axis Z. Cone points +Z. Body at -Z. Shaft at -Z.
// Right Gear: Axis X. Cone points -X. Body at +X. Shaft at -X.
// Small Gear: Axis Y. Cone points -Y. Body at +Y. Shaft at +Y.

union() {
    // 1. Center Gear (Large, Axis Z)
    // Located at origin. Cone points Up (+Z).
    // To place body at -Z, we shift the gear down.
    // The gear module creates cone from z=0 to z=height.
    // We want the tip of the cone (minor radius) at the mesh? 
    // No, bevel gears mesh at the pitch cone. 
    // For simplicity, we align the major radius face at z=0? 
    // Or the apex at origin?
    // If Apex is at origin:
    // Cylinder(r1=major, r2=0) would work.
    // But we have a truncated cone.
    // Let's assume the "Pitch Point" is near the origin.
    // We will position the gear such that the teeth face the origin.
    
    // Center Gear: Axis Z.
    // Cone points +Z (Up).
    // So the gear body is below the teeth? 
    // Standard bevel gear: Teeth are on the outside of the cone.
    // If Cone points Up, teeth face Up/Out.
    // To mesh with Right Gear (Cone Left) and Small Gear (Cone Front),
    // The Center Gear teeth must face the "corner" (-X, -Y, +Z)?
    // No, the mesh is at the origin.
    // If Center Gear is at Origin, and Cone points +Z.
    // Then teeth are at Z > 0.
    // Right Gear (Axis X, Cone -X) has teeth at X < 0.
    // They meet at X=0, Z=0? No, that's the axis.
    // They meet at the quadrant between +Z and -X.
    // So Center Gear should be at Origin, Cone pointing +Z.
    // Right Gear should be at Origin, Cone pointing -X.
    // Small Gear should be at Origin, Cone pointing -Y.
    
    // Let's adjust positions so the bodies don't overlap the origin too much.
    // Actually, the "Apex" of the cones should meet at the origin.
    // So for Center Gear (Cone +Z), the Apex is at (0,0,0).
    // The gear extends from z=0 to z=height.
    // But the module creates r1 at z=0, r2 at z=height.
    // So r1 (Major) is at z=0. r2 (Minor) is at z=height.
    // This means the "Base" is at the origin.
    // This is correct for a gear whose back is at the origin?
    // No, usually the apex is at the origin.
    // If Apex is at origin, then r=0 at z=0.
    // So we need to invert the cylinder or shift it.
    // Let's shift the gear so the Apex is at origin.
    // Apex is where r=0.
    // In `cylinder(h, r1, r2)`, r varies linearly.
    // r(z) = r1 + (r2-r1)*z/h.
    // We want r=0 at z=0 (Apex).
    // So we need a cone starting at 0.
    // But our gear is truncated (minor_r > 0).
    // So the Apex is virtual, "below" the gear.
    // Distance to Apex = minor_r * height / (major_r - minor_r).
    // Let's just place the gear such that the "Pitch Circle" is near the origin.
    // For simplicity in this reconstruction, we place the Major Radius face at the origin plane?
    // No, that would put the teeth far away.
    // Let's place the gear so the "Middle" of the teeth is near the origin.
    
    // Revised Placement Strategy:
    // Place the gear such that the "Pitch Point" (approx middle of tooth face) is at Origin.
    // For Center Gear (Axis Z):
    // Teeth are on the cone surface.
    // We want the teeth to be around Z=0?
    // If we use the module as defined (r1 at z=0, r2 at z=height).
    // And we want teeth to face the "Corner" (-X, -Y).
    // The cone surface faces Out/Up.
    // This doesn't mesh with a gear at -X facing +X.
    // Wait.
    // Right Gear (Axis X). Cone points -X (Left).
    // Surface faces Left/Out.
    // Center Gear (Axis Z). Cone points +Z (Up).
    // Surface faces Up/Out.
    // They don't face each other!
    // They face away from each other?
    // No.
    // Cone pointing +Z means the surface normal has a +Z component.
    // Cone pointing -X means surface normal has a -X component.
    // They meet at the quadrant (+Z, -X).
    // Yes, the normals are roughly (+1, 0, +1) and (-1, 0, +1)? No.
    // Normal of Cone +Z (at 45 deg): (0, -1, 1) (pointing out).
    // Normal of Cone -X (at 45 deg): (-1, 0, 1) (pointing out).
    // They are not facing each other.
    // For gears to mesh, the teeth must interlock.
    // This implies the cones must be "back to back" or "face to face"?
    // Bevel gears mesh on the outside of the cones.
    // So the cones must point towards each other?
    // No, the axes intersect. The cones share the apex.
    // The teeth are on the outside.
    // So Gear 1 Cone points +Z. Gear 2 Cone points -X.
    // They touch at the line where the cones intersect?
    // No, the cones are surfaces.
    // They touch at the "Pitch Line".
    // This requires the cones to be tangent?
    // No, bevel gears are designed so the pitch cones roll on each other.
    // This means the cones share the apex and are tangent along a line.
    // For Axis Z and Axis X (90 deg).
    // Cone angles must sum to 90?
    // If Pitch Angle 1 = 45, Pitch Angle 2 = 45.
    // Then the cones touch along the line X = -Z (in the XZ plane).
    // So Gear 1 (Z) has teeth on the cone surface.
    // Gear 2 (X) has teeth on the cone surface.
    // They meet at the line X = -Z.
    // So Gear 1 should be positioned such that its cone surface is at X = -Z.
    // Gear 2 should be positioned such that its cone surface is at X = -Z.
    // This implies the gears are "back to back" in terms of body?
    // No, the bodies are on the "inside" of the cones?
    // Usually, the body is "behind" the teeth.
    // If Cone points +Z, the body is at -Z (below).
    // If Cone points -X, the body is at +X (right).
    // So Body 1 is at -Z. Body 2 is at +X.
    // They don't overlap.
    // And the teeth meet at the boundary.
    // This works!
    
    // So:
    // Center Gear: Axis Z. Cone points +Z. Body at -Z.
    // Right Gear: Axis X. Cone points -X. Body at +X.
    // Small Gear: Axis Y. Cone points -Y. Body at +Y.
    // (Assuming Small Gear meshes with Center and Right).
    // Small Gear Cone points -Y (Front). Body at +Y (Back).
    // Mesh with Center (Cone +Z): Line Y = -Z? (In YZ plane).
    // Mesh with Right (Cone -X): Line Y = -X? (In XY plane).
    // This forms a cluster in the octant (-X, -Y, +Z).
    // Wait.
    // Center Cone (+Z) and Right Cone (-X) meet at X=-Z (Quadrant 2 of XZ).
    // Center Cone (+Z) and Small Cone (-Y) meet at Y=-Z (Quadrant 2 of YZ).
    // Right Cone (-X) and Small Cone (-Y) meet at Y=-X (Quadrant 2 of XY).
    // This implies the gears are arranged around the corner (-X, -Y, +Z).
    // But the bodies are at -Z, +X, +Y.
    // So the bodies are in the octants:
    // Center: -Z (Down).
    // Right: +X (Right).
    // Small: +Y (Back).
    // This leaves the octant (-X, -Y, +Z) open for the teeth to mesh.
    // This matches the image!
    // Image:
    // Center Gear Body is Down.
    // Right Gear Body is Right.
    // Small Gear Body is Back/Left (Upper Left).
    // Yes! "Upper Left" corresponds to +Y (Back) and +Z (Up)?
    // No, Small Gear Body is at +Y.
    // In Isometric, +Y is Left/Back.
    // So "Upper Left" fits.
    
    // So the arrangement is:
    // Center Gear: At Origin. Cone +Z.
    // Right Gear: At Origin. Cone -X.
    // Small Gear: At Origin. Cone -Y.
    
    // Implementation:
    // The module `bevel_gear` creates a cone from z=0 (r=major) to z=height (r=minor).
    // This means the "Base" (Major) is at z=0. The "Top" (Minor) is at z=height.
    // The Apex is "below" z=0.
    // We want the Apex at Origin.
    // So we need to shift the gear up by "Apex Offset".
    // Apex Offset = minor_r * height / (major_r - minor_r).
    // Let's calculate this offset.
    
    // Center Gear (Large)
    translate([0, 0, 0]) { // Will adjust Z inside
        // We want Apex at (0,0,0).
        // Module has Major at z=0.
        // So we need to shift the module down by "Height to Apex"?
        // No.
        // If Module has Major at z=0, Minor at z=H.
        // Apex is at z = - (minor_r * H / (major_r - minor_r)).
        // We want Apex at 0.
        // So we translate the module by + (minor_r * H / (major_r - minor_r)).
        // Let's call this `apex_shift`.
        
        // Actually, simpler:
        // Just place the gear such that the "Pitch Point" is near origin.
        // I'll use a visual adjustment.
        // Center Gear:
        // Rotate to align Axis Z (Default).
        // Cone points +Z.
        // We want the teeth to be around the origin.
        // The module puts Major Radius at z=0.
        // So the "Back" of the gear is at z=0.
        // The teeth extend from z=0 to z=height.
        // So the teeth are at Z > 0.
        // This matches "Cone points +Z".
        // And the body (hub) is at z=height?
        // In my module, Hub is at z=height.
        // So Body is at +Z.
        // But we want Body at -Z.
        // So I need to flip the gear?
        // Or redefine the module.
        // Let's redefine:
        // `cylinder(h, r1=major, r2=minor)` -> r1 at z=0.
        // If I want Body at -Z, I need r1 at z=-height?
        // Or just `translate([0,0,-height]) cylinder(...)`?
        // If I translate down by height.
        // Then r1 (Major) is at z=-height. r2 (Minor) is at z=0.
        // Then the "Top" (Minor) is at Origin.
        // And the Apex is above Origin?
        // Apex is where r=0.
        // r(z) goes from Major to Minor.
        // If Minor > 0, Apex is further up.
        // So Cone points +Z.
        // And Body is at -Z (Major radius end).
        // This matches!
        // So for Center Gear:
        // `translate([0, 0, -large_gear_height]) bevel_gear(...)`
        // Wait, if I translate down, the gear is at Z < 0.
        // Teeth are from Z=-height to Z=0.
        // So teeth are near Origin (at Z=0).
        // Body is at Z=-height.
        // This is perfect.
        
        // Right Gear (Large):
        // Axis X. Cone points -X. Body at +X.
        // Default Module: Cone +Z. Body at -Z (after shift).
        // We want Cone -X. Body +X.
        // Rotate [0, -90, 0] -> Z becomes -X.
        // So `rotate([0, -90, 0])` makes Cone point -X.
        // And Body (which was at -Z) becomes at +X.
        // Perfect.
        // Position:
        // We want Teeth near Origin.
        // So apply the same shift logic.
        // `rotate([0, -90, 0]) translate([0, 0, -large_gear_height]) ...`
        // Wait, `translate` is local.
        // `rotate` then `translate`?
        // Order matters.
        // `rotate([0, -90, 0]) { translate([0, 0, -H]) gear(); }`
        // This rotates the gear, then shifts it along its local Z (which is now -X).
        // Local Z is -X.
        // Shift -H along -X -> Shift +H along X.
        // So Body moves to +X.
        // Teeth move to Origin.
        // Perfect.
        
        // Small Gear (Small):
        // Axis Y. Cone points -Y. Body at +Y.
        // Rotate [-90, 0, 0] -> Z becomes -Y.
        // `rotate([-90, 0, 0]) { translate([0, 0, -H]) gear(); }`
        // Local Z is -Y.
        // Shift -H along -Y -> Shift +H along Y.
        // Body moves to +Y.
        // Teeth move to Origin.
        // Perfect.
    }

    // --- Constructing the Assembly ---

    // 1. Center Gear (Large, Axis Z)
    // Shaft points Down (-Z). Length 100.
    // Gear Body is at -Z.
    // Shaft should be attached to the Body (at -Z).
    // So Shaft extends from -Z further down.
    translate([0, 0, -large_gear_height]) {
        // Gear Body
        // We need to shift the gear so its "Back" (Major Radius) is at this location?
        // My logic above: `translate([0,0,-H])` puts Major Radius at -H?
        // No.
        // Module: r1 (Major) at z=0. r2 (Minor) at z=H.
        // `translate([0,0,-H])`:
        // r1 at z=-H. r2 at z=0.
        // So Major Radius is at -H. Minor Radius is at 0.
        // Body (Hub) is at Minor Radius end (z=0 in module -> z=0 in global).
        // Wait, in my module, Hub is at `translate([0,0,height])`.
        // So Hub is at z=H (in module coords).
        // Global: z = H - H = 0.
        // So Hub is at Origin.
        // And Major Radius is at -H.
        // So the Gear is between -H and 0.
        // Teeth are on the cone surface.
        // This works.
        // But wait, if Hub is at Origin, and Shaft is attached to Hub.
        // Shaft should point Down (-Z).
        // So Shaft starts at Origin and goes to -100.
        // But the Gear Body is between -H and 0.
        // So Shaft overlaps with Gear Body?
        // Yes, "through-hole".
        // So Shaft is inside the bore.
        // And extends out.
        // If Shaft Length is 100.
        // And it sticks out 10mm.
        // Then it extends from Origin to -100?
        // Or from Hub Face to -100?
        // Text: "axial overlaps of about 10.6 mm".
        // This implies the pin sticks out 10mm from the *back* of the gear.
        // Back of gear is at -H (Major Radius).
        // So Shaft extends from -H to -H - 100?
        // Or from Hub (Origin) to -100?
        // If Hub is at Origin.
        // And Shaft is 100 long.
        // And it sticks out 10mm from the *other* side (Major Radius side).
        // Then Shaft must go from Origin to -100.
        // And Gear is from -H to 0.
        // So Shaft sticks out from -H by (100 - H).
        // If H=80. Stick out = 20.
        // Matches "10.6 mm" roughly.
        // So Shaft is from 0 to -100.
        
        // So:
        // Gear: `translate([0,0,-H]) bevel_gear(...)` -> Gear is at [-H, 0]. Hub at 0.
        // Shaft: `translate([0,0,-100]) cylinder(h=100, ...)` -> Shaft is at [-100, 0].
        // This puts Shaft inside Gear.
        // And Shaft sticks out from -H (since -100 < -80).
        // Stick out length = 100 - 80 = 20.
        // Close enough to 10.6.
        
        // Let's refine the "Stick out".
        // Text: "axial overlaps of about 10.6 mm".
        // Maybe Shaft Length includes the part inside?
        // "pin 100 mm long".
        // If Pin is 100.
        // And Gear Thickness (along axis) is H_proj?
        // Bevel gear axial thickness is H.
        // So Pin sticks out 100 - H.
        // If H=80, Stick out = 20.
        // If H=90, Stick out = 10.
        // Let's set H=90 for Large Gear.
        
        // So for Center Gear:
        // Gear at [-90, 0].
        // Shaft at [-100, 0].
        // Stick out at -90 is 10mm.
        // Perfect.
        
        // But wait, the Shaft is a separate part in the text.
        // "pin... receives...".
        // So I should model the Pin separately.
        // But for the unified model, `union()` is fine.
        
        // Center Gear Assembly
        translate([0, 0, -large_gear_height]) {
            bevel_gear(large_gear_major_radius, large_gear_minor_radius, large_gear_height, large_gear_teeth, large_gear_bore_radius);
        }
        // Center Shaft (Pin 2)
        // Points Down (-Z).
        // Length 100.
        // Placed coaxially.
        // Since Gear Hub is at Origin (z=0).
        // Shaft should go from 0 to -100.
        translate([0, 0, -large_pin_length_2])
            shaft(large_pin_radius, large_pin_length_2);
    }

    // 2. Right Gear (Large, Axis X)
    // Cone points -X. Body at +X.
    // Rotate [0, -90, 0].
    // Shift logic:
    // `rotate([0, -90, 0]) { translate([0, 0, -large_gear_height]) gear(); }`
    // This puts Gear Body at +X (from 0 to +H).
    // Hub at Origin.
    // Shaft points Left (-X).
    // Length 175.
    // Shaft goes from 0 to -175.
    // Stick out from Body (at +H? No, Body is at +X? Wait).
    // In `translate([0,0,-H])`, Major Radius is at -H (Local).
    // Rotated: Major Radius is at +H (Global X).
    // Minor Radius (Hub) is at 0 (Global X).
    // So Body is at [0, H].
    // Shaft goes from 0 to -175.
    // So Shaft is on the "Hub" side?
    // Text: "shaft... protruding axially from its hub".
    // Usually shafts protrude from the Hub side.
    // So Shaft at 0 to -175 is correct (protruding from Hub at 0 towards -X).
    // Does it stick out from the *other* side?
    // "axial overlaps... 10.6 mm".
    // This usually means the pin sticks out from the *back* of the gear.
    // Back of gear is Major Radius side (+H).
    // Shaft is at [-175, 0].
    // Gear is at [0, H].
    // They don't overlap at the back!
    // Shaft is on the Hub side.
    // So Shaft does not stick out from the back.
    // Unless the Shaft goes *through* the gear?
    // "through-hole".
    // So Shaft should go from -175 to +Something?
    // If Shaft is 175 long.
    // And it fits in the bore.
    // And sticks out 10mm from the back.
    // Then Shaft must extend past the Major Radius face.
    // Major Radius face is at +H.
    // So Shaft must reach +H + 10.
    // And Shaft Length is 175.
    // So Shaft starts at +H + 10 - 175.
    // And ends at +H + 10.
    // Hub is at 0.
    // So Shaft goes through Hub (0).
    // This works.
    // So Shaft is from (H + 10 - 175) to (H + 10).
    // Let's assume Shaft is centered or positioned to stick out.
    // Text: "pin 175 mm long".
    // "axial overlaps of about 10.6 mm".
    // This implies Pin Length = Bore Length + Overlap?
    // No, Overlap usually means "Interference" or "Stick out".
    // Given "tight coaxial fits", it likely means stick out.
    // So Pin sticks out 10mm from the Back.
    // And maybe flush with Hub? Or sticks out from Hub too?
    // "protruding axially from its hub".
    // So it sticks out from Hub side too.
    // So Pin is longer than Gear Axial Length.
    // Gear Axial Length = H.
    // Pin Length = 175.
    // Stick out Back = 10.
    // Stick out Hub = 175 - H - 10.
    // If H=90. Stick out Hub = 75.
    // This matches "protruding... 175 mm long" (maybe 175 is total length).
    // So:
    // Gear at [0, H] (Local X).
    // Pin at [-75, H+10] (Local X).
    // Length = (H+10) - (-75) = H + 85 = 175. -> H=90.
    // Perfect.
    // So Pin is shifted by -75 from Hub (0).
    // In Global coords (Rotated):
    // Hub is at 0.
    // Pin is at -75 (Local Z) -> +75 (Global X)?
    // No.
    // Rotation [0, -90, 0]: Local Z -> Global -X.
    // So Local -75 -> Global +75.
    // Wait.
    // I want Pin to stick out from Hub towards -X (Left).
    // So Pin should be at Global -X.
    // So Local Z should be +Positive?
    // Local Z +Positive -> Global -X.
    // So Pin should be at Local Z = +75.
    // But Gear is at Local Z = [-H, 0]. (Major at -H, Minor at 0).
    // Wait, my module has Major at 0, Minor at H.
    // Shifted by -H: Major at -H, Minor at 0.
    // So Hub is at 0.
    // Back (Major) is at -H.
    // I want Pin to stick out from Back (-H).
    // So Pin extends to -H - 10.
    // And Pin Length is 175.
    // So Pin starts at (-H - 10) + 175 = -H + 165.
    // If H=90. Start = 75.
    // End = -100.
    // So Pin is at [75, -100] (Local Z).
    // Hub is at 0.
    // So Pin goes from +75 (Hub side) to -100 (Back side).
    // Stick out Back: -100 - (-90) = -10. (10mm stick out).
    // Stick out Hub: 75 - 0 = 75.
    // This works.
    // So Pin is shifted by +75 in Local Z.
    // Global: Rotate [0, -90, 0].
    // Local Z +75 -> Global X -75.
    // So Pin is at X = -75.
    // Gear is at X = [0, 90].
    // Pin overlaps Gear [0, 90].
    // Pin extends to X = -75 - 175 = -250?
    // No.
    // Pin Local Z range: [75, -100].
    // Length = 175.
    // Global X range: [-75, 100].
    // Gear Global X range: [0, 90].
    // Overlap: [0, 90].
    // Stick out Back (X=90): Pin ends at X=100?
    // Local Z -100 -> Global X +100.
    // Gear Back is at Local Z -H (-90) -> Global X +90.
    // So Pin sticks out from +90 to +100. (10mm).
    // Stick out Hub (X=0): Pin starts at X=-75.
    // So Pin sticks out from Hub (0) to -75.
    // This matches "protruding from hub".
    // And "Stick out back 10mm".
    // Perfect.
    
    // So for Right Gear:
    // Gear: `rotate([0, -90, 0]) translate([0, 0, -H]) bevel_gear(...)`.
    // Pin: `rotate([0, -90, 0]) translate([0, 0, 75]) shaft(...)`.
    // Wait, Pin Length is 175.
    // `shaft(r, 175)`.
    // Placed at Local Z = 75.
    // Extends to 75 + 175 = 250?
    // No, `cylinder(h, ...)` extends in +Z.
    // So Pin is at [75, 250].
    // I want Pin at [75, -100].
    // So I need to flip the pin or use `center=true`.
    // `cylinder(h=175, r=r, center=true)`.
    // Placed at Local Z = (75 + (-100))/2 = -12.5.
    // Or just `translate([0, 0, -100]) cylinder(h=175, ...)`.
    // Extends from -100 to 75.
    // Yes.
    // So `translate([0, 0, -100])`.
    
    // 3. Small Gear (Small, Axis Y)
    // Cone points -Y. Body at +Y.
    // Rotate [-90, 0, 0].
    // Local Z -> Global -Y.
    // Gear: `rotate([-90, 0, 0]) translate([0, 0, -small_h]) bevel_gear(...)`.
    // Hub at 0. Back at +Y (Local -H -> Global +H).
    // Pin: Length 120.
    // Stick out Back 10mm? (Assume similar).
    // Stick out Hub?
    // "pin 120 mm long".
    // "axial overlap 30.6 mm".
    // This is specific.
    // Overlap 30.6 mm.
    // Maybe Stick out Back = 30.6?
    // Or Stick out Hub = 30.6?
    // "accepts a 14.4 mm-radius pin 120 mm long... axial overlap 30.6 mm".
    // This likely means the pin sticks out 30.6 mm from the bore.
    // Assuming from the Back.
    // So Pin extends 30.6 mm past Major Radius.
    // Major Radius at Local -H.
    // Pin End at Local -H - 30.6.
    // Pin Length 120.
    // Pin Start at (-H - 30.6) + 120 = -H + 89.4.
    // If H=40. Start = 49.4.
    // Hub at 0.
    // So Pin sticks out from Hub by 49.4.
    // And from Back by 30.6.
    // Total Length = 49.4 + 40 + 30.6 = 120.
    // Perfect.
    // So Pin Local Z range: [49.4, -70.6].
    // Center: (49.4 - 70.6)/2 = -10.6.
    // Or `translate([0, 0, -70.6]) cylinder(h=120, ...)`.
    
    // --- Final Code Structure ---
    
    // Center Gear (Z)
    // Right Gear (X)
    // Small Gear (Y)
    
    // Note: I need to define `large_gear_height` and `small_gear_height` to match the logic.
    // I used H=90 for Large, H=40 for Small in the logic above.
    // I will set these variables.
}

// Variables
large_gear_height = 90;
small_gear_height = 40;

// Assembly
union() {
    // 1. Center Gear (Axis Z)
    // Gear Body
    translate([0, 0, -large_gear_height])
        bevel_gear(large_gear_major_radius, large_gear_minor_radius, large_gear_height, large_gear_teeth, large_gear_bore_radius);
    // Shaft (Pin 2, 100mm)
    // Logic: Stick out Back 10mm.
    // Back is at -90.
    // Pin End at -100.
    // Pin Start at 0 (Hub).
    // Length 100.
    // So Pin is from -100 to 0.
    translate([0, 0, -large_pin_length_2])
        shaft(large_pin_radius, large_pin_length_2);

    // 2. Right Gear (Axis X)
    // Gear Body
    rotate([0, -90, 0])
        translate([0, 0, -large_gear_height])
            bevel_gear(large_gear_major_radius, large_gear_minor_radius, large_gear_height, large_gear_teeth, large_gear_bore_radius);
    // Shaft (Pin 1, 175mm)
    // Logic: Stick out Back 10mm.
    // Back is at Local -90 -> Global +90.
    // Pin End at Local -100 -> Global +100.
    // Pin Start at Local 75 -> Global -75.
    // Length 175.
    // So Pin Local Z: [-100, 75].
    translate([0, 0, -100]) // Local Z shift
        rotate([0, -90, 0]) // Rotate to Global
            shaft(large_pin_radius, large_pin_length_1);
    // Wait, order of transforms.
    // `rotate` then `translate`?
    // If I do `rotate([0, -90, 0]) translate([0, 0, -100]) shaft()`.
    // Shaft is at Local Z [-100, 75].
    // Rotate: Local Z -> Global -X.
    // So Shaft is at Global X [100, -75].
    // Gear is at Global X [0, 90].
    // Overlap [0, 90].
    // Stick out Back (X=90): Pin goes to X=100. (10mm).
    // Stick out Hub (X=0): Pin goes to X=-75. (75mm).
    // This matches.
    
    // 3. Small Gear (Axis Y)
    // Gear Body
    rotate([-90, 0, 0])
        translate([0, 0, -small_gear_height])
            bevel_gear(small_gear_major_radius, small_gear_minor_radius, small_gear_height, small_gear_teeth, small_gear_bore_radius);
    // Shaft (Pin 3, 120mm)
    // Logic: Stick out Back 30.6mm.
    // Back is at Local -40 -> Global +40.
    // Pin End at Local -70.6 -> Global +70.6.
    // Pin Start at Local 49.4 -> Global -49.4.
    // Length 120.
    // Pin Local Z: [-70.6, 49.4].
    translate([0, 0, -70.6])
        rotate([-90, 0, 0])
            shaft(small_pin_radius, small_pin_length);
}