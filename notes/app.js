const addBtn=document.getElementById('addStudent');
const studentInput=document.getElementById('studentName');
const tbody=document.querySelector('#notesTable tbody');
const classAverageEl=document.getElementById('classAverage');
const exportBtn=document.getElementById('exportCSV');

function updateAverages(){
  let rows=[...tbody.querySelectorAll('tr')];
  let total=0,count=0;
  rows.forEach(row=>{
    let notes=row.querySelector('.notes').value.split(',').map(x=>parseFloat(x)).filter(x=>!isNaN(x));
    let avg=0;
    if(notes.length){avg=notes.reduce((a,b)=>a+b,0)/notes.length;}
    row.querySelector('.avg').textContent=avg?avg.toFixed(2):'-';
    if(notes.length){total+=avg;count++;}
  });
  classAverageEl.textContent='Moyenne de la classe : '+(count?(total/count).toFixed(2):'-');
}

addBtn.onclick=()=>{
  let name=studentInput.value.trim();
  if(!name) return;
  let tr=document.createElement('tr');
  tr.innerHTML=`<td>${name}</td><td><input class="notes" placeholder="Ex: 12,15,9"></td><td class="avg">-</td>`;
  tbody.appendChild(tr);
  studentInput.value='';
  tr.querySelector('.notes').addEventListener('input',updateAverages);
  updateAverages();
};

exportBtn.onclick=()=>{
  let csv="Élève;Notes;Moyenne\n";
  [...tbody.querySelectorAll('tr')].forEach(row=>{
    let name=row.cells[0].textContent;
    let notes=row.querySelector('.notes').value;
    let avg=row.querySelector('.avg').textContent;
    csv+=`${name};${notes};${avg}\n`;
  });
  let blob=new Blob([csv],{type:'text/csv'});
  let url=URL.createObjectURL(blob);
  let a=document.createElement('a');
  a.href=url;a.download='notes.csv';a.click();
  URL.revokeObjectURL(url);
};