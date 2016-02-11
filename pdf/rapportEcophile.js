

$(function() {

    $.ajax({
        type: "GET",
        url: "http://localhost/api.php/SelectYears",
        cache: false,
        async: true,
        dataType: 'json',
        success: function(data){

            var listItems= '<option value ="">Annee</option>';
            var jsonData = data;
            for (var i = 0; i < jsonData.length; i++){

                listItems+= "<option value='" + jsonData[i].Annee + "'>" + jsonData[i].Annee + "</option>";
            }
            $("#annee").html(listItems);


        }
    })

});
function getMonth(){
    $.ajax({
        type: 'GET',
        url: "http://localhost/api.php/SelectMonths?Annee="+$('#annee').val(),
        cache: false,
        async: true,
        dataType: 'json',
        success: function(data){
            var list= "";
            var jsonDatas = data;
            console.log($('#annee').val());
            console.log(jsonDatas[0].Mois);

            for (var i = 0; i < jsonDatas.length; i++){
                switch (jsonDatas[i].Mois) {
                    case '1' :
                        jsonDatas[i].Mois = 'Janvier';
                        break;
                    case '2' :
                        jsonDatas[i].Mois = 'Fevrier';
                        break;
                    case '3' :
                        jsonDatas[i].Mois = 'Mars';
                        break;
                    case '4':
                        jsonDatas[i].Mois = 'Avril';
                        break;
                    case '5' :
                        jsonDatas[i].Mois = 'Mai';
                        break;
                    case '6' :
                        jsonDatas[i].Mois = 'Juin';
                        break;
                    case '7' :
                        jsonDatas[i].Mois = 'Juillet';
                        break;
                    case '8' :
                        jsonDatas[i].Mois = 'Aout';
                        break;
                    case '9' :
                        jsonDatas[i].Mois = 'Septembre';
                        break;
                    case '10' :
                        jsonDatas[i].Mois = 'Octobre';
                        break;
                    case '11' :
                        jsonDatas[i].Mois = 'Novembre';
                        break;
                    case '12' :
                        jsonDatas[i].Mois = 'Decembre';
                        break;
                    default :
                        jsonDatas[i].Mois = 'vide'


                }
                list+= "<option value='" + jsonDatas[i].Mois + "'>" + jsonDatas[i].Mois + "</option>";

            }
            $("#mois").html(list);


        }
    });

}

function actualiserGraphique() {
    annee = document.getElementById("annee").value;
    mois = document.getElementById("mois").value;
    var energie = getEnergieTotalConsommee();
    var energiePrecedent = getEnergieConsommeeMoisPrecedent();

    if (annee != "" && mois != "") {
        elems = document.getElementById("divi");
        $('.year').html(annee);
        $('.month').html(mois);
        if(energie < 0){
            $('.energie').html(-((Math.round(energie*1000)/1000))+ " Wh en moins");
        }
        else {
            $('.energie').html((Math.round(energie*1000)/1000) + " Wh en plus");
        }
        $('.precedent').html((Math.round(energiePrecedent*1000)/1000));

        if (elems.style.display = 'none') {
            elems.style.display = 'block';
        }
    }
}

function getAjax (dateFin,dateDebut) {
    return $.ajax({
        type: "GET",
        url: "http://localhost/api.php/SelectSumPapparente?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
        }
    }).responseText;
}

function getMonthDataChart() {
    var sum = [];
    var somme = [];
            annee = document.getElementById("annee").value;
            mois = document.getElementById("mois").value;
            switch (mois) {

                case 'Janvier' :
                    mois = '1';
                    break;
                case 'Fevrier' :
                    mois = '2';
                    break;
                case 'Mars' :
                    mois = '3';
                    break;
                case 'Avril':
                    mois = '4';
                    break;
                case 'Mai' :
                    mois = '5';
                    break;
                case 'Juin' :
                    mois = '6';
                    break;
                case 'Juillet' :
                    mois = '7';
                    break;
                case 'Aout' :
                    mois = '8';
                    break;
                case 'Septembre' :
                    mois = '9';
                    break;
                case 'Octobre' :
                    mois = '10';
                    break;
                case 'Novembre' :
                    mois = '11';
                    break;
                case 'Decembre' :
                    mois = '12';
                    break;
                default :
                    mois = '0';
                    break;


            }
            var i;
            for( i = 0; i < 31; i += 1){
                var day = annee +"-"+mois+"-"+(i+1);
                var dateFin = day+" 00:00:00";
                console.log("dateFin   "+dateFin);
                //var dateDebut = dateYear+"-"+dateMonth+"-"+dateDay+" 23:59:59";
                var dateDebut = day+" 23:59:59";
                console.log("dateDebut  "+dateDebut);
                var sumPapparente = getAjax(dateFin,dateDebut);
                sumPapparente = JSON.parse(sumPapparente);
                console.log("reponse : ",sumPapparente[0]);
                if(sumPapparente[0].SumPapparente == null){
                    sumPapparente[0].SumPapparente = '0';
                }

                sum.push(parseInt(sumPapparente[0].SumPapparente));
            }
            console.log(sum);
    return sum;

}

function getDataChart() {
    var somme = [];
    var date = new Date();
    var dateDay = date.getDate();
    var dateYear = date.getFullYear();
    var dateMonth = date.getMonth()+1;
    var i;
    for( i = 0; i < 31; i += 1){
        var dateFin = dateYear+"-"+dateMonth+"-"+(i+1)+" 00:00:00";
        console.log("dateFin   "+dateFin);
        //var dateDebut = dateYear+"-"+dateMonth+"-"+dateDay+" 23:59:59";
        var dateDebut = dateYear+"-"+dateMonth+"-"+(i+1)+" 23:59:59";
        console.log("dateDebut  "+dateDebut);
        var sumPapparente = getAjax(dateFin,dateDebut);
        sumPapparente = JSON.parse(sumPapparente);
        console.log("reponse : ",sumPapparente[0]);
        if(sumPapparente[0].SumPapparente == null){
            sumPapparente[0].SumPapparente = '0';
        }

        somme.push(parseInt(sumPapparente[0].SumPapparente));
    }
    console.log(somme);
    return somme;

}

function newChart() {

    var date = new Date();

    chart = new Highcharts.Chart({
        chart: { renderTo: 'ecophile' },
        title: {
            text: "Comparaison consommation au mois "+ document.getElementById("mois").value +" "+document.getElementById("annee").value,
            x: -20 //center
        },

        xAxis: {
            title: {
                text: 'Jours'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        exporting: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'Watt'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' Watt'
        },
        series : [{
            name : 'Puissance apparente '+document.getElementById("mois").value,
            data : (function () {
                // generate an array of random data
                var data = [],  i, sum = getMonthDataChart();
                for (i = 0; i < 31; i += 1) {
                    data.push([
                        i+1,
                        sum[i]
                    ]);
                }
                return data;
            }())
            },
            {   name : 'Puissance apparente du actuel',
                data : (function () {
                    // generate an array of random data
                    var data = [], i, somme = getDataChart();
                    for (i = 0; i < 31; i += 1) {
                        data.push([
                            i+1,
                            somme[i]
                        ]);
                    }
                    return data;
                }())
            }]

    });

    //on prend la charte, on la transforme en svg
    var svg = chart.getSVG();

    //et on la balance sur le serveur
    $.ajax({
        type: 'POST',
        url: 'pdf/rapportEcophileSvg.php',
        data: {test  : svg} //le code "texte" du svg


    });
}

function getEnergieConsomme(dateFin, dateDebut) {
    return $.ajax({
        type: "GET",
        url: "http://localhost/api.php/EnergieConsommee?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
            console.log("energieConsommee :"+data);
        }
    }).responseText;
  }

function getEnergieConsommeeActuel(){

    var date = new Date();
    var dateDay = date.getDate();
    var dateYear = date.getFullYear();
    var dateMonth = date.getMonth()+1;

    var dateDebut= dateYear+"-"+dateMonth+"-"+1+" 00:00:00";
    var dateFin = dateYear+"-"+dateMonth+"-"+dateDay+" 23:59:59";


    var energieConsomme = JSON.parse(getEnergieConsomme(dateDebut, dateFin));

    console.log("reponse : ",energieConsomme[0]);

    if(energieConsomme[0].EnergieConsommee == null){
        energieConsomme[0].EnergieConsommee = '0';
    }
    var energie = energieConsomme[0].EnergieConsommee;


    console.log("energie :", energie);

    return energie;
}

function getEnergieConsommeeMoisPrecedent(){

    annee = document.getElementById("annee").value;
    mois = document.getElementById("mois").value;
    switch (mois) {

        case 'Janvier' :
            mois = '1';
            break;
        case 'Fevrier' :
            mois = '2';
            break;
        case 'Mars' :
            mois = '3';
            break;
        case 'Avril':
            mois = '4';
            break;
        case 'Mai' :
            mois = '5';
            break;
        case 'Juin' :
            mois = '6';
            break;
        case 'Juillet' :
            mois = '7';
            break;
        case 'Aout' :
            mois = '8';
            break;
        case 'Septembre' :
            mois = '9';
            break;
        case 'Octobre' :
            mois = '10';
            break;
        case 'Novembre' :
            mois = '11';
            break;
        case 'Decembre' :
            mois = '12';
            break;
        default :
            mois = '0';
            break;


    }
    jour = new Date(Date.parse(((mois%12)+1).toString() + "/01/" + annee)-86400000).getDate();


    var dateDebut= annee+"-"+mois+"-"+1+" 00:00:00";
    var dateFin = annee+"-"+mois+"-"+jour+" 23:59:59";

    switch (mois) {
        case '1' :
            mois = 'Janvier';
            break;
        case '2' :
            mois = 'Fevrier';
            break;
        case '3' :
            mois = 'Mars';
            break;
        case '4':
            mois = 'Avril';
            break;
        case '5' :
            mois = 'Mai';
            break;
        case '6' :
            mois = 'Juin';
            break;
        case '7' :
            mois = 'Juillet';
            break;
        case '8' :
            mois = 'Aout';
            break;
        case '9' :
            mois = 'Septembre';
            break;
        case '10' :
            mois = 'Octobre';
            break;
        case '11' :
            mois = 'Novembre';
            break;
        case '12' :
            mois = 'Decembre';
            break;
        default :
            mois = 'vide'


    }
    var energieConsomme = JSON.parse(getEnergieConsomme(dateDebut, dateFin));

    console.log("reponse : ",energieConsomme[0]);

    if(energieConsomme[0].EnergieConsommee == null){
        energieConsomme[0].EnergieConsommee = '0';
    }
    var energie = energieConsomme[0].EnergieConsommee;


    console.log("energie :", energie);

    return energie;
}

function getEnergieTotalConsommee(){

    console.log(getEnergieConsommeeActuel() - getEnergieConsommeeMoisPrecedent());

    return getEnergieConsommeeActuel() - getEnergieConsommeeMoisPrecedent();
}

function screenShot() {

    html2canvas($("#divi"), {
        onrendered: function(canvas) {

            var img = canvas.toDataURL("pdf/img/image.png");
            var output = encodeURIComponent(img);

            var Parameters = "image=" + output;
            $.ajax({
                type: "POST",
                url: 'pdf/rapportEcophileSvg.php',
                data: Parameters,
                success : function(data)
                {
                    console.log("screenshot done");
                }
            })

        }
    });
}