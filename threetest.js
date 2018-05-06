'use strict';
console.debug = function(){/* NOP */};
console.info = function(){/* NOP */};
//console.log = function(){/* NOP */};
console.warn = function(){/* NOP */};
//console.error = function(){/* NOP */};


var i;
var j;
var scene;
var camera;
var renderer;
var t = 0;

var width = window.innerWidth;
var height = window.innerHeight;
var plane_width = 2000;



//scene ステージ
scene = new THREE.Scene();

//renderer 実際に描画を行う
renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(width,height);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('stage').appendChild(renderer.domElement);

//camera
camera = new THREE.PerspectiveCamera(45, width / height,1,10000);
camera.position.set(1500,0,0);
camera.lookAt(scene.position);
//controlを追加し、マウスによるカメラコントロールを追加
var controls = new THREE.OrbitControls(camera, renderer.domElement);

//点光源
// light
var light = new THREE.DirectionalLight( 0xffffff,0.5 );
light.position.set(0, 1000, 0 );
light.castShadow = true;
light.shadow.camera.near = 0;
light.shadow.camera.far = 10000;
light.shadow.camera.top = plane_width;
light.shadow.camera.bottom = -plane_width;
light.shadow.camera.left = plane_width;
light.shadow.camera.right = -plane_width;
light.shadow.mapSize.width = plane_width;
light.shadow.mapSize.height = plane_width;
//scene.add( light );

// 環境光を追加
var ambient = new THREE.AmbientLight(0xafafaf);
scene.add(ambient);

// 影
renderer.shadowMapEnabled = true; 

// fog
scene.fog = new THREE.FogExp2(0x0A0A0A, 0.0006);

//mesh 物体
// - geometry 形状
// - material　材質

//地面
var planeGeometry = new THREE.PlaneBufferGeometry(plane_width,plane_width);
var planeMaterial = new THREE.MeshPhongMaterial({color:"#666",side:THREE.DoubleSide});
var plane = new THREE.Mesh(planeGeometry,planeMaterial);
plane.position.set(0,0,0); // 位置を調整 rotate,scale
plane.rotation.x = 90 * Math.PI / 180;// 初期状態だと縦になっているので、横になるように回転
plane.receiveShadow = true;
//scene.add(plane);

var object= new THREE.Object3D();

var frame = {};
var geometry = new THREE.IcosahedronGeometry( 1,1 )
var material = new THREE.MeshPhongMaterial({ 
	color: 0x00FFFF,
	wireframe: true,
	transparent: true,
	opacity:0.05
});
frame.mesh = new THREE.Mesh(geometry, material);
frame.mesh.position.set(0,0,0);
frame.mesh.castShadow = true;
//object.add(frame.mesh);


var plate_num = 1;
var p= new Array(plate_num);
for(i=0;i<plate_num;i++){
	//object生成
	p[i] = {};
	p[i].object= new THREE.Object3D();
	p[i].height=500;
	p[i].width =600;
	p[i].plate = new THREE.Object3D();

	//canvas
	p[i].canvas = document.createElement('canvas');
	p[i].canvas.width = 600; 
	p[i].canvas.height =500;
	var ctx = p[i].canvas.getContext('2d');
	ctx.fillStyle = '#FFFFFF';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = "150px sans-serif";
	ctx.fillText("ne-03",p[i].width/2,p[i].height/2);
	ctx.font = "30px sans-serif";

	//texture
	p[i].texture = new THREE.Texture(p[i].canvas);
	p[i].texture.needsUpdate = true;

	p[i].x = 0;
	p[i].y = 0;
	p[i].z = 0;
	p[i].mesh = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(p[i].width,p[i].height),
		new THREE.MeshPhongMaterial({
			//color: 0x00FFFF ,
			color: 0x00FFFF ,
			transparent:true,
			map: p[i].texture,
			opacity:0.9999,
			side:THREE.DoubleSide,
		})
	);
	p[i].mesh.rotation.y = 90 * Math.PI / 180;

	p[i].back = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(p[i].width,p[i].height),
		new THREE.MeshPhongMaterial({
			//color: 0x00FFFF ,
			color: 0x0066FF ,
			transparent:true,
			opacity:0.2,
			side:THREE.DoubleSide,
		})
	);
	p[i].back.rotation.y = 90 * Math.PI / 180;

	p[i].frame_material = new THREE.LineBasicMaterial( { 
		linewidth: 1,
		transparent:true,
		opacity:0.5,
		color: 0x00FFFF 
	} );
    p[i].frame_geometry = new THREE.Geometry();
    p[i].frame_geometry.vertices.push(new THREE.Vector3(0, p[i].height/2, p[i].width/2));
    p[i].frame_geometry.vertices.push(new THREE.Vector3(0, p[i].height/2,-p[i].width/2));
    p[i].frame_geometry.vertices.push(new THREE.Vector3(0,-p[i].height/2,-p[i].width/2));
    p[i].frame_geometry.vertices.push(new THREE.Vector3(0,-p[i].height/2, p[i].width/2));
    p[i].frame_geometry.vertices.push(new THREE.Vector3(0, p[i].height/2, p[i].width/2));
	p[i].frame_mesh = new THREE.Line( p[i].frame_geometry, p[i].frame_material );

	p[i].move_start = 0;

	p[i].plate.add(p[i].mesh);
	p[i].plate.add(p[i].back);
	p[i].plate.add(p[i].frame_mesh);
	p[i].object.add(p[i].plate);

	//object.add(p[i].object);
}

var disk_num = 3;
var d= new Array(disk_num);
for(i=0;i<disk_num;i++){
	d[i] = {};
	d[i].object= new THREE.Object3D();
	
	//半径、輪の幅、輪の分割、円の分割、弧の角。
	d[i].frame_geometry = new THREE.TorusGeometry( 1, 0.001, 20, 128, Math.PI * 2);
	d[i].frame_material = new THREE.MeshPhongMaterial({ color: 0xFF8800, wireframe:false });
	d[i].frame_mesh = new THREE.Line( d[i].frame_geometry, d[i].frame_material );
	d[i].frame_mesh.rotation.y = 90 * Math.PI / 180;


	d[i].object.add(d[i].frame_mesh);

	object.add(d[i].object);
}

var line_num = 36;
var l= new Array(line_num);
for(i=0;i<line_num;i++){
	l[i] = {};
	l[i].object= new THREE.Object3D();

	l[i].frame_material = new THREE.LineBasicMaterial( { 
		linewidth: 1,
		transparent:true,
		opacity:1.0,
		color: 0x66FF66 
	} );
    l[i].frame_geometry = new THREE.Geometry();
    l[i].frame_geometry.vertices.push(new THREE.Vector3(0, 0.0, 0.0));
    l[i].frame_geometry.vertices.push(new THREE.Vector3(0, 1.0, 0.0));
    l[i].frame_mesh = new THREE.Line( l[i].frame_geometry, l[i].frame_material );


	l[i].object.add(l[i].frame_mesh);

	object.add(l[i].object);
}

for(i=12;i<line_num;i++){
	l[i].frame_material.color.r = 1.0;
	l[i].frame_material.color.g = 1.0;
	l[i].frame_material.color.b = 0.0;
}
for(i=24;i<line_num;i++){
	l[i].frame_material.color.r = 1.0;
	l[i].frame_material.color.g = 0.3;
	l[i].frame_material.color.b = 0.0;
}


function Drawline(line,s,e,ease){
	var length = Math.sqrt( (s[0]-e[0]) * (s[0]-e[0]) + (s[1]-e[1]) * (s[1]-e[1]) + (s[2]-e[2]) * (s[2]-e[2]));
	var vec = [e[0]-s[0],e[1]-s[1],e[2]-s[2]];
	line.object.scale.set(1.0,length * ease,1.0);
	line.object.position.set(s[0],s[1],s[2]);
	quat(line.object,vec);
}
scene.add(object);

var point_num = 30;
var point = new Array(point_num);
for(i=0;i<point_num;i++)point[i] = [0.0,0.0,0.0];
var po = 300; 
point[0] = [  po,  po, -po];
point[1] = [ -po,  po, -po];
point[2] = [ -po,  po,  po];
point[3] = [  po,  po,  po];
point[4] = [  po, -po, -po];
point[5] = [ -po, -po, -po];
point[6] = [ -po, -po,  po];
point[7] = [  po, -po,  po];


var timer_num = 3;
var start_time = new Array(timer_num);
for(i=0;i<timer_num;i++)start_time[i] = [0];
var move_flag = 0;
var state = 0;

function move(){
	Drawline(l[0],point[0],point[1],1);
	Drawline(l[1],point[5],point[6],1);
	Drawline(l[2],point[2],point[3],1);
	Drawline(l[3],point[7],point[4],1);
	Drawline(l[4],point[1],point[5],1);
	Drawline(l[5],point[6],point[2],1);
	Drawline(l[6],point[3],point[7],1);
	Drawline(l[7],point[4],point[0],1);
	Drawline(l[8],point[5],point[4],1);
	Drawline(l[9],point[2],point[1],1);
	Drawline(l[10],point[7],point[6],1);
	Drawline(l[11],point[0],point[3],1);
}


function update(){
	//object.rotation.x += 0.005;
}

let dir = 1;
$('#po').on('change', function(){
	if($('#po').prop("checked")) dir = 1;
	else dir = -1; 
	console.log(dir)
});

// let output = document.getElementById("output");
// output.innerHTML = "onon"
window.addEventListener('deviceorientation', function(e) {
    let str   = '';
    let alpha = dir * e.alpha;
    let beta  = - dir * e.beta;
    let gamma = dir * e.gamma;
    if (alpha) {
	 		//object.rotation.x = alpha * Math.PI / 180;
	 		object.rotation.z = beta * Math.PI / 180;
	 		object.rotation.y = gamma * Math.PI / 180;
 		}

    str  = 'alpha = ' + alpha + '\n';
    str += 'beta = '  + beta + '\n';
    str += 'gamma = ' + gamma + '\n';
    // output.innerHTML = str;

}, false);

function render() {
	requestAnimationFrame(render);
	move();
	update();

	renderer.render(scene, camera);
	controls.update();
}
render();