const listEl=document.getElementById('studentList');
const result=document.getElementById('result');
const saveBtn=document.getElementById('saveList');
const pickBtn=document.getElementById('pickRandom');
const groupsBtn=document.getElementById('makeGroups');
const groupSizeEl=document.getElementById('groupSize');

function getStudents(){
  return listEl.value.split('\n').map(s=>s.trim()).filter(s=>s);
}
function saveList(){
  localStorage.setItem('students',listEl.value);
}
function loadList(){
  listEl.value=localStorage.getItem('students')||'';
}
function pickRandom(){
  let s=getStudents();
  if(!s.length){result.textContent="Aucun élève";return;}
  let r=s[Math.floor(Math.random()*s.length)];
  result.textContent="Élève tiré au sort : "+r;
}
function makeGroups(){
  let s=getStudents();
  let size=parseInt(groupSizeEl.value);
  if(!s.length||!size){result.textContent="Entrez des élèves et une taille";return;}
  // mélange
  s.sort(()=>Math.random()-0.5);
  let out="";
  for(let i=0;i<s.length;i+=size){
    out+="Groupe "+(i/size+1)+": "+s.slice(i,i+size).join(', ')+"\n";
  }
  result.textContent=out;
}
saveBtn.onclick=()=>{saveList();alert('Liste sauvegardée !')};
pickBtn.onclick=pickRandom;
groupsBtn.onclick=makeGroups;
loadList();