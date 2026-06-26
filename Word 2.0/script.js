const editor=document.getElementById("editor");

function cmd(command,value=null){
document.execCommand(command,false,value);
editor.focus();
}

document.getElementById("fontName").onchange=e=>{
cmd("fontName",e.target.value);
}

document.getElementById("fontSize").onchange=e=>{

let size=e.target.value;

document.execCommand("fontSize",false,7);

let fonts=editor.getElementsByTagName("font");

for(let i=0;i<fonts.length;i++){

if(fonts[i].size=="7")
fonts[i].removeAttribute("size"),
fonts[i].style.fontSize=size+"px";

}

}

document.getElementById("textColor").onchange=e=>{
cmd("foreColor",e.target.value);
}

document.getElementById("highlight").onchange=e=>{
cmd("hiliteColor",e.target.value);
}

document.getElementById("undo").onclick=()=>cmd("undo");

document.getElementById("redo").onclick=()=>cmd("redo");

// Export JSON

document.getElementById("exportJson").onclick=()=>{

let data={

content:editor.innerHTML

};

let blob=new Blob([JSON.stringify(data,null,4)],{

type:"application/json"

});

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="document.json";

a.click();

}

// Import JSON

document.getElementById("importJson").onchange=e=>{

let file=e.target.files[0];

let reader=new FileReader();

reader.onload=()=>{

let data=JSON.parse(reader.result);

editor.innerHTML=data.content;

}

reader.readAsText(file);

}

// Export PDF

document.getElementById("exportPdf").onclick=()=>{

const {jsPDF}=window.jspdf;

let pdf=new jsPDF();

let text=editor.innerText;

let lines=pdf.splitTextToSize(text,180);

pdf.text(lines,10,10);

pdf.save("document.pdf");

}