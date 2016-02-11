$(document).ready(function(){
    var i=1;
    $("#add_row").click(function(){
        $('#addr'+i).html("<td><input name='heureDebut"+i+"' type='text' placeholder='Entrez heure debut' class='form-control input-md'  /></td>" +
            "<td><input name='heureFin"+i+"' type='text' placeholder='Entrez heure fin' class='form-control input-md'  /> </td>" +
            "<td><select  name='jour"+i+"'  class='form-control select-md' ></td>" +
            "<td><input  name='tarif"+i+"' type='text' placeholder='Entrez tarif'  class='form-control input-md'></td>");

        $('#tab_logic').append('<tr id="addr'+(i+1)+'"></tr>');
        i++;
    });
    $("#delete_row").click(function(){
        if(i>1){
            $("#addr"+(i-1)).html('');
            i--;
        }
    });

});