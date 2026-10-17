"""Original procedurally modelled 'Clouds Above' art study for Daily Pause.

No external photographs, stock art, source textures, models or image generators.
Blender native shaders, authored terrain and lighting only.
This is a development art candidate, not a completed/approved production image.
"""
import bpy,math,random,json,os
from mathutils import Vector
from mathutils.noise import noise_vector,noise as sample_noise

RNG=random.Random(20261015)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

S=bpy.context.scene
S.render.engine='BLENDER_EEVEE'
S.eevee.taa_render_samples=48
S.eevee.use_gtao=True
S.eevee.gtao_distance=3
S.eevee.use_soft_shadows=True
S.eevee.use_volumetric_shadows=True
S.eevee.volumetric_samples=48
S.eevee.volumetric_tile_size='8'
S.render.resolution_x=1920
S.render.resolution_y=1260
S.render.resolution_percentage=100
S.render.image_settings.file_format="PNG"
S.render.film_transparent=False
S.render.filepath=os.path.abspath("art-review/original-3d/palette-cloud-original-v1.png")
S.view_settings.view_transform="Filmic"
S.view_settings.look="Medium High Contrast"
S.view_settings.exposure=.35
S.view_settings.gamma=1

world=bpy.data.worlds.new("Natural high altitude sky")
S.world=world
world.use_nodes=True
nodes=world.node_tree.nodes
nodes.clear()
bg=nodes.new("ShaderNodeBackground");out=nodes.new("ShaderNodeOutputWorld")
sky=nodes.new("ShaderNodeTexSky")
sky.sky_type='NISHITA';sky.sun_elevation=.12;sky.sun_rotation=2.1
sky.air_density=1.8;sky.dust_density=4.2;sky.ozone_density=1.0
world.node_tree.links.new(sky.outputs["Color"],bg.inputs["Color"])
bg.inputs["Strength"].default_value=.67
world.node_tree.links.new(bg.outputs["Background"],out.inputs["Surface"])

def material(name,color,rough=.75,noise_scale=2,bump_strength=.0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 bsdf=m.node_tree.nodes.get("Principled BSDF")
 bsdf.inputs["Base Color"].default_value=(*color,1)
 bsdf.inputs["Roughness"].default_value=rough
 if bump_strength:
  tex=m.node_tree.nodes.new("ShaderNodeTexNoise");tex.inputs["Scale"].default_value=noise_scale
  tex.inputs["Detail"].default_value=4
  tex.inputs["Roughness"].default_value=.65
  bump=m.node_tree.nodes.new("ShaderNodeBump")
  bump.inputs["Strength"].default_value=bump_strength
  bump.inputs["Distance"].default_value=.45
  m.node_tree.links.new(tex.outputs["Fac"],bump.inputs["Height"])
  m.node_tree.links.new(bump.outputs["Normal"],bsdf.inputs["Normal"])
 return m

def volume_cloud(name,density=.04,noise_scale=1.3):
 m=bpy.data.materials.new(name);m.use_nodes=True
 ns=m.node_tree.nodes;ns.clear()
 out=ns.new("ShaderNodeOutputMaterial")
 pv=ns.new("ShaderNodeVolumePrincipled")
 pv.inputs["Color"].default_value=(.96,.95,.91,1)
 pv.inputs["Density"].default_value=density
 pv.inputs["Anisotropy"].default_value=.6
 tex=ns.new("ShaderNodeTexNoise");tex.noise_dimensions="3D"
 tex.inputs["Scale"].default_value=noise_scale
 tex.inputs["Detail"].default_value=3
 tex.inputs["Roughness"].default_value=.67
 ramp=ns.new("ShaderNodeValToRGB")
 ramp.color_ramp.elements[0].position=.28
 ramp.color_ramp.elements[0].color=(0,0,0,1)
 ramp.color_ramp.elements[1].position=.72
 ramp.color_ramp.elements[1].color=(.3,.3,.3,1)
 mult=ns.new("ShaderNodeMath");mult.operation='MULTIPLY';mult.inputs[1].default_value=density*8
 links=m.node_tree.links
 links.new(tex.outputs["Fac"],ramp.inputs["Fac"])
 links.new(ramp.outputs["Color"],mult.inputs[0])
 links.new(mult.outputs["Value"],pv.inputs["Density"])
 links.new(pv.outputs["Volume"],out.inputs["Volume"])
 return m

# Mountains: independently sculpted, noisy continuous ridges behind the clouds.
stone=material("blue grey textured granite",(.31,.38,.44),.87,1.6,.38)
snow=material("chalky glacier snow",(.85,.86,.83),.92,3,.10)
olive=material("mossy rock",(.27,.32,.27),.96,3,.40)
def terrain_height(x,y):
 far=max(0,(y-18)/72)
 ridge=11.0*far+14*far*far
 peak=abs(math.sin(x*.16+y*.052))+abs(math.sin(x*.067-y*.14))*.54
 n=sample_noise(Vector((x*.06,y*.05,9)))*4.8
 fine=sample_noise(Vector((x*.19,y*.20,17)))*1.35
 return 3.2+ridge*(.60+.45*peak)+n*far+fine*far

verts=[];faces=[];mx=100;my=70
for iy in range(my+1):
 y=19+iy*1.28
 for ix in range(mx+1):
  x=-69+ix*1.38
  verts.append((x,y,terrain_height(x,y)))
for iy in range(my):
 for ix in range(mx):
  a=iy*(mx+1)+ix
  faces.append((a,a+1,a+mx+2,a+mx+1))
mesh=bpy.data.meshes.new("deep ridge geography")
mesh.from_pydata(verts,[],faces);mesh.update()
mountains=bpy.data.objects.new("continuous sculpted alpine mountains",mesh)
bpy.context.collection.objects.link(mountains)
mountains.data.materials.append(stone)
for f in mountains.data.polygons:
  z=sum(mesh.vertices[i].co.z for i in f.vertices)/len(f.vertices)
  if z>19.5 and RNG.random()<.70:f.material_index=1
  elif z<11 and RNG.random()<.16:f.material_index=2
  f.use_smooth=True
mountains.data.materials.append(snow)
mountains.data.materials.append(olive)

# Actual cloud volumes, not flat SVG gradients or repeating vector circles.
cloud_mat=volume_cloud("rising illuminated fog",.075,1.0)
banks=[]
for n in range(125):
 x=RNG.uniform(-62,62);y=RNG.uniform(-17,58)
 # Gently rolling high-altitude billows span foreground, midground and distance.
 z=RNG.uniform(1.0,5.5)+3.5*math.cos(x*.05+y*.06)
 size=RNG.uniform(4.6,10.8)*(1.0 if y<25 else 1.18)
 bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=10,location=(x,y,z))
 ob=bpy.context.object;ob.name="independent volume billow %03d"%n
 ob.scale=(size*1.55,size*.76,size*.42)
 # Smooth volume boundaries by varying scale and overlap, avoiding 2D sprites.
 ob.data.materials.append(cloud_mat)
 for poly in ob.data.polygons:poly.use_smooth=True
 banks.append(ob)

# Perspective: near cloud bank illuminated from behind, horizon framed by ridges.
bpy.ops.object.camera_add(location=(0,-23,16.4))
camera=bpy.context.object
direction=Vector((0,35,11.8))-camera.location
camera.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
camera.data.type='PERSP'
camera.data.lens=38
S.camera=camera

bpy.ops.object.light_add(type='SUN', location=(-28,-18,55))
sun=bpy.context.object
sun.data.energy=2.1
sun.data.color=(1,.82,.65)
sun.rotation_euler=(Vector((5,32,4))-sun.location).to_track_quat('-Z','Y').to_euler()
sun.data.angle=.09

bpy.ops.object.light_add(type='AREA', location=(28,-7,27))
fill=bpy.context.object
fill.data.energy=3500
fill.data.color=(.80,.83,1.0)
fill.data.shape='DISK'
fill.data.size=65
fill.rotation_euler=(Vector((0,20,4))-fill.location).to_track_quat('-Z','Y').to_euler()

S.camera.data.dof.use_dof=False
bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath("art-review/original-3d/palette-cloud-source.blend"))
bpy.ops.render.render(write_still=True)
print("PROCEDURAL_ORIGINAL",S.render.filepath,flush=True)
