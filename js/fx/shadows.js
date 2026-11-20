/* Snowduck - fx/shadows */
// ---------- real shadows
scene.traverse(o=>{if(o.isMesh&&o!==water&&!o.userData.nofx)o.castShadow=o.receiveShadow=true});cloudG.traverse(o=>{o.castShadow=o.receiveShadow=false});blob.castShadow=blob.receiveShadow=false;
