
var titre_pres ;



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
	
	




