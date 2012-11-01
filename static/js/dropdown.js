/**
 * Hangle the toogle of dropdown menus.
 */

document.addEventListener("DOMContentLoaded", function () {
    var dps = document.querySelectorAll('.dropdown');

    for (var i=0, dp; dp = dps[i]; i++){
        var btn = dp.previousSibling;
        btn.addEventListener("click", toogleDropdown.bind(btn) );
    }
});


/**
 * Toggle the state of a dropdown button
 */
function toogleDropdown() {
    console.log('toogling button '+ this);
    var state = this.getAttribute('aria-selected');
    if (state == "true"){
        this.setAttribute('aria-selected', false);
    }else{
        this.setAttribute('aria-selected', true);
    }
}