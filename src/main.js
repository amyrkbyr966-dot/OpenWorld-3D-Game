import * as THREE from 'three';
// OpenWorld 3D — procedural open world: terrain, trees, buildings, day/night, player controller
const scene=new THREE.Scene(); scene.fog=new THREE.Fog(0x87ceeb,40,220);
const camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,0.1,500);
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; document.body.appendChild(renderer.domElement);
const sun=new THREE.DirectionalLight(0xffffff,1.2); sun.castShadow=true; scene.add(sun); scene.add(new THREE.AmbientLight(0xffffff,0.35));
const groundGeo=new THREE.PlaneGeometry(400,400,80,80); const pos=groundGeo.attributes.position;
for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i); pos.setZ(i, Math.sin(x*0.05)*Math.cos(y*0.05)*2);}
groundGeo.computeVertexNormals();
const ground=new THREE.Mesh(groundGeo,new THREE.MeshStandardMaterial({color:0x3a7d44})); ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
function tree(x,z){const g=new THREE.Group();const t=new THREE.Mesh(new THREE.CylinderGeometry(.2,.3,2),new THREE.MeshStandardMaterial({color:0x6b4423}));t.position.y=1;const l=new THREE.Mesh(new THREE.ConeGeometry(1.4,3.5),new THREE.MeshStandardMaterial({color:0x1e6b2e}));l.position.y=3.5;l.castShadow=true;g.add(t,l);g.position.set(x,0,z);scene.add(g);}
function building(x,z,w,h,d){const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color:0x9aa0a6}));b.position.set(x,h/2,z);b.castShadow=true;scene.add(b);}
for(let i=0;i<180;i++) tree((Math.random()-0.5)*360,(Math.random()-0.5)*360);
for(let i=0;i<40;i++) building((Math.random()-0.5)*300,(Math.random()-0.5)*300,4+Math.random()*6,6+Math.random()*18,4+Math.random()*6);
const player=new THREE.Mesh(new THREE.CapsuleGeometry(.5,1),new THREE.MeshStandardMaterial({color:0xff5533})); player.position.set(0,1.5,10); player.castShadow=true; scene.add(player);
const keys={}; addEventListener('keydown',e=>keys[e.code]=true); addEventListener('keyup',e=>keys[e.code]=false);
let vy=0,t=0; const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate); const dt=Math.min(clock.getDelta(),0.05); t+=dt*0.02;
 sun.position.set(Math.cos(t)*80,Math.sin(t)*60+20,40); sun.intensity=Math.max(.2,Math.sin(t)); scene.background=new THREE.Color().setHSL(.58,.5,Math.max(.15,Math.sin(t)*.5+.3));
 const sp=(keys.ShiftLeft?14:7)*dt; if(keys.KeyW)player.position.z-=sp; if(keys.KeyS)player.position.z+=sp; if(keys.KeyA)player.position.x-=sp; if(keys.KeyD)player.position.x+=sp;
 if(keys.Space&&player.position.y<=1.5)vy=8; vy-=20*dt; player.position.y=Math.max(1.5,player.position.y+vy*dt);
 camera.position.set(player.position.x,player.position.y+6,player.position.z+12); camera.lookAt(player.position); renderer.render(scene,camera);}
animate();
