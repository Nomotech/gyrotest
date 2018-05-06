
//マウス--------------------------------------------------------------------------------------
//keycode
var key = new Array(300);
var oldkey = new Array(300);
var keydown = new Array(300);
var targetList = [];   
document.onmousemove = function(e) {
    var rect = e.target.getBoundingClientRect();
    // マウス位置(2D)
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;
    
    // マウス位置(3D)
    mouseX = (mouseX/width) *2 - 1;
    mouseY =-(mouseY/height)*2 + 1;
    
    // マウスベクトル
    var pos = new THREE.Vector3(mouseX, mouseY, 1);
    //var pos = new THREE.Vector3(1,1,1);
    // pos はスクリーン座標系なので, オブジェクトの座標系に変換
    pos.unproject(camera);

    // 始点, 向きベクトルを渡してレイを作成
    var ray = new THREE.Raycaster(camera.position, pos.sub(camera.position).normalize());
    // 交差判定
    var obj = ray.intersectObjects(targetList);
    
    if (obj.length > 0) {
      //card[obj[0].object.name].card.scale.set(0.00000001,0.0000001,0.0000001);
        forcuscard_m = obj[0].object.name;
        //console.log(forcuscard);
    }
    if(obj.length==0)forcuscard_m = -1;
    // /console.log(obj);
};

document.onmousedown = function(e) {  
};

document.onmouseup = function (e){
  if(!e) e = window.event; // レガシー

  var rect = e.target.getBoundingClientRect();
    // マウス位置(2D)
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;
    
    // マウス位置(3D)
    mouseX = (mouseX/width) *2 - 1;
    mouseY =-(mouseY/height)*2 + 1;
    
    // マウスベクトル
    var pos = new THREE.Vector3(mouseX, mouseY, 1);
    // pos はスクリーン座標系なので, オブジェクトの座標系に変換
    pos.unproject(camera);
    
    // 始点, 向きベクトルを渡してレイを作成
    var ray = new THREE.Raycaster(camera.position, pos.sub(camera.position).normalize());
    // 交差判定
    var obj = ray.intersectObjects(targetList);
    
};

document.addEventListener("wheel" , function (e){
  var rect = e.target.getBoundingClientRect();
  // マウス位置(2D)
  var mouseX = e.clientX - rect.left;
  var mouseY = e.clientY - rect.top;
  
  // マウス位置(3D)
  mouseX = (mouseX/width) *2 - 1;
  mouseY =-(mouseY/height)*2 + 1;
  
  // マウスベクトル
  var pos = new THREE.Vector3(mouseX, mouseY, 1);
  // pos はスクリーン座標系なので, オブジェクトの座標系に変換
  pos.unproject(camera);
  pos.sub(camera.position).normalize();
});

//キーボード-----------------------------------------------------------------------------------
document.onkeydown = function (e){
  if(!e)e = window.event;
  //console.log(e);
  oldkey[e.keyCode] = key[e.keyCode];
  key[e.keyCode] = 1;
}
document.onkeyup = function (e){
  if(!e)e = window.event;
  key[e.keyCode] = 0;
}

//クォータニオン-------------------------------------------------------------------------------
function QuaternionRotation(theta, u, v){ //(回転角, 回転軸, 座標ベクトル)
  var P = new quat4.create([v[0],v[1],v[2],0]);
  var Q = new quat4.create([-u[0]*Math.sin(theta/2), -u[1]*Math.sin(theta/2), -u[2]*Math.sin(theta/2), Math.cos(theta/2)]);
  var R = new quat4.create([u[0]*Math.sin(theta/2), u[1]*Math.sin(theta/2), u[2]*Math.sin(theta/2), Math.cos(theta/2)]);
  var S0 = quat4.multiply(P,Q, quat4.create());
  var S =  quat4.multiply(R,S0,quat4.create());  
  var V = [S[0],S[1],S[2]];
  //console.log(V);
  return V;
}


function quat_angle(v){
  var up = new THREE.Vector3(0, 1, 0);
  var v_vec = new THREE.Vector3(v[0],v[1],v[2]);
  var dot = up.dot(v_vec.normalize());//v_vecと射影ベクトルとの内積
  var rad = 90 * Math.PI / 180 - Math.acos(dot);//内積から角度を

  var dir = new THREE.Vector3();
  //「上」方向と法線ベクトルとの外積を計算。正規化。
  dir.crossVectors(up, v_vec).normalize();

  //クォータニオンオブジェクトを生成
  var q = new THREE.Quaternion();
  //計算した回転軸と角度を元にクォータニオンをセットアップ
  q.setFromAxisAngle(dir, rad);
  //適用したいオブジェクトに回転を適用
  //mesh.rotation.setFromQuaternion(q);  
  return q;

}
function quat(obj,v){
  var up = new THREE.Vector3(0, 1, 0);
  var v_vec = new THREE.Vector3(v[0],v[1],v[2]);
  var dot = up.dot(v_vec.normalize());//v_vecと射影ベクトルとの内積
  var rad = Math.acos(dot);//内積から角度を

  var dir = new THREE.Vector3();
  //「上」方向と法線ベクトルとの外積を計算。正規化。
  dir.crossVectors(up, v_vec).normalize();
  if(!dir.x&!dir.y&!dir.z)dir = new THREE.Vector3(1.0,0.0,0.0)
  //クォータニオンオブジェクトを生成
  //console.log(dir);
  var q = new THREE.Quaternion();
  //計算した回転軸と角度を元にクォータニオンをセットアップ
  q.setFromAxisAngle(dir, rad);
  //適用したいオブジェクトに回転を適用
  obj.rotation.setFromQuaternion(q);  
}

