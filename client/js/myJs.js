
var titre_pres ;
var content;



function notEmpty(elem, helperMsg){
	var monElement = document.getElementById("Title_Prs") ;
	
	if(elem.value.length == 0){
		alert(helperMsg);
		elem.focus();
		return false;
	}
	else{
		$('#Titre').modal('hide')
		titre_pres = elem.value ;
		monElement.innerHTML = titre_pres;
		//alert(titre_pres);
		return true;
	}
}

function sizeUp(elem){
	var monElement = document.getElementById(elem) ;
	//alert (monElement.style.fontSize);
	monElement.style.fontSize = "24px";
	}

function valider(elem){ 
	content=elem;
	DeleteBorder();
	var monElement = document.getElementById(elem) ;
	monElement.style.border = "3px solid #049CDB";

	}
	
function DeleteBorder(){ 
	document.getElementById("content1").style.border ="3px solid #999";
	document.getElementById("content2").style.border ="3px solid #999";
	document.getElementById("content3").style.border ="3px solid #999";
	document.getElementById("content4").style.border ="3px solid #999";
	document.getElementById("content5").style.border ="3px solid #999";
}

function alerte() {
	if (content=='content0'){
		alert("Please Select a template");
	}
	else
		$('#ModalContent').modal('hide')
}



