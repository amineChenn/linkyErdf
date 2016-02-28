

$(function () {

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() -1 );
    $('.dateEndAvanceePeriod').datepicker("setDate", new Date());
    $('.dateStartAvanceePeriod').datepicker("setDate", yesterday);

    $('#dateStartAvancee').on('changeDate', function () {
        $('.datepicker').hide();

    });

    $('#dateEndAvancee').on('changeDate', function () {
        $('.datepicker').hide();

    });

});

function getAjax (dateFin,dateDebut) {
    return $.ajax({
        type: "GET",
        url: "http://localhost/projetERDF/api.php/SelectSumPapparente?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
        }
    }).responseText;
}

function getPuissanceApparente() {

    var sum=[];
    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    if (dateEnd<dateStart) {
        document.getElementById("#errorMessageDate").style.display = 'block';
        $(".alert").delay(4000).slideUp(500, function() {
            document.getElementById("#errorMessageDate").style.display = "none";
        });
        $('#dateEndAvancee').datepicker({
            startDate: $('#dateStartAvancee').datepicker("getDate")
        });
        console.log("la date de fin doit etre avant la date de debut");
    }
    else {
        if (dateStart != null && dateEnd != null) {

            var daysOfYear = [];
            console.log("DATE START = ", dateStart);
            console.log("DATE END = ", dateEnd);
            for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                daysOfYear.push(new Date(d));
            }
            //var test = daysOfYear[0];
            //console.log(test.getDate());
            for(var t=0 ; t < daysOfYear.length; t++){
                var selectedDate = daysOfYear[t];
                var day = selectedDate.getDate();
                var month = selectedDate.getMonth() + 1; //Months are zero based
                var year = selectedDate.getFullYear();
                var constDateFin = year + "-" + month + "-" + day+ " 00:00:00";
                var constDateDebut = year + "-" + month + "-" + day + " 23:59:59";

                console.log("Date debut", constDateDebut);
                console.log("Date Fin", constDateFin);

                var sumPapparente = getAjax(constDateFin,constDateDebut);
                sumPapparente = JSON.parse(sumPapparente);
                console.log("reponse : ",sumPapparente[0]);
                if(sumPapparente[0].SumPapparente == null){
                    sumPapparente[0].SumPapparente = '0';
                }
                console.log(sum.push(parseFloat(sumPapparente[0].SumPapparente)));

            }


        }
    }
    return sum;
}
function newPuissanceChart() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");

    if (dateStart != null && dateEnd != null) {
        var curr_d = dateStart.getDate();
        var curr_m = dateStart.getMonth() + 1; //Months are zero based
        var curr_y = dateStart.getFullYear();
        var dateS = curr_d + "/" + curr_m + "/" + curr_y;

        var curr_date = dateEnd.getDate() + 1;
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        var dateE = curr_date + "/" + curr_month + "/" + curr_year;
    }
    chart = new Highcharts.Chart({
        chart: { renderTo: 'apparenteEnergiphile' },

        title: {
            text: "Puissance apparente entre "+dateS+ " et "+ dateE ,
            x: -20 //center
        },

        xAxis: {
            title: {
                text: 'Dates'
            },
            categories: (function(){
                var b = [], te =[], fin=[];

                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    b.push(new Date(d));
                }

                for (i = 0; i < b.length; i += 1) {
                    console.log("length", b.length);
                    var selectedDate = b[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    te = year + "/" + month + "/" + day;
                    fin.push(te);
                }
                return fin;
            })

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
                color: '#808050'
            }]
        },
        tooltip: {
            valueSuffix: ' Watt'
        },
        series : [{
            name : 'Puissance apparente ',
            data : (function () {
                // generate an array of random data
                var data = [],  i, sum = getPuissanceApparente(), dateOfYear = [];
                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    dateOfYear.push(new Date(d));
                }
                for (i = 0; i < dateOfYear.length; i += 1) {
                    console.log("length", dateOfYear.length);
                    var selectedDate = dateOfYear[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    var constDateFin = year + "/" + month + "/" + day;
                    console.log("tteessttttt", constDateFin);
                    data.push([
                        constDateFin,
                        sum[i]
                    ]);
                    console.log("ddaaatte", data);
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
        url: 'pdf/energiphileSvgPapparente.php',
        data: {papparente  : svg} //le code "texte" du svg


    });
}


function actualiserGraphique() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    elems = document.getElementById("divi");


    if (dateStart != null && dateEnd != null) {
        var curr_date = dateStart.getDate();
        var curr_month = dateStart.getMonth() + 1; //Months are zero based
        var curr_year = dateStart.getFullYear();
        dateStart =  curr_date+ "/" + curr_month + "/" + curr_year;

        var curr_date = dateEnd.getDate() + 1;
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        dateEnd = curr_date + "/" + curr_month + "/" + curr_year;

        $('.dateDebut').html(dateStart);
        $('.dateFin').html(dateEnd);
    }
    console.log(dateStart);
    console.log(dateEnd);


    elems.style.display = 'block';
}


function getAjaxReactive (dateFin,dateDebut) {
    return $.ajax({
        type: "GET",
        url: "http://localhost/projetERDF/api.php/SelectSumPreactive?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
        }
    }).responseText;
}

function getPuissanceReactive() {

    var sum=[];
    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    if (dateEnd<dateStart) {
        document.getElementById("#errorMessageDate").style.display = 'block';
        $(".alert").delay(4000).slideUp(500, function() {
            document.getElementById("#errorMessageDate").style.display = "none";
        });
        $('#dateEndAvancee').datepicker({
            startDate: $('#dateStartAvancee').datepicker("getDate")
        });
        console.log("la date de fin doit etre avant la date de debut");
    }
    else {
        if (dateStart != null && dateEnd != null) {

            var daysOfYear = [];
            console.log("DATE START = ", dateStart);
            console.log("DATE END = ", dateEnd);
            for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                daysOfYear.push(new Date(d));
            }
            //var test = daysOfYear[0];
            //console.log(test.getDate());
            for(var t=0 ; t < daysOfYear.length; t++){
                var selectedDate = daysOfYear[t];
                var day = selectedDate.getDate();
                var month = selectedDate.getMonth() + 1; //Months are zero based
                var year = selectedDate.getFullYear();
                var constDateFin = year + "-" + month + "-" + day+ " 00:00:00";
                var constDateDebut = year + "-" + month + "-" + day + " 23:59:59";

                console.log("Date debut", constDateDebut);
                console.log("Date Fin", constDateFin);

                var sumPreactive = getAjaxReactive(constDateFin,constDateDebut);
                sumPreactive = JSON.parse(sumPreactive);
                console.log("reponse : ",sumPreactive[0]);
                if(sumPreactive[0].SumPreactive == null){
                    sumPreactive[0].SumPreactive = '0';
                }
                console.log(sum.push(parseFloat(sumPreactive[0].SumPreactive)));

            }


        }
    }
    return sum;
}
function newPreactiveChart() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");

    if (dateStart != null && dateEnd != null) {
        var curr_d = dateStart.getDate();
        var curr_m = dateStart.getMonth() + 1; //Months are zero based
        var curr_y = dateStart.getFullYear();
        var dateS = curr_d + "/" + curr_m + "/" + curr_y;

        var curr_date = dateEnd.getDate() + 1;
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        var dateE = curr_date + "/" + curr_month + "/" + curr_year;
    }
    chart = new Highcharts.Chart({
        chart: { renderTo: 'reactiveEnergiphile' },

        title: {
            text: "Puissance reactive entre "+dateS+ " et "+ dateE ,
            x: -20 //center
        },

        xAxis: {
            title: {
                text: 'Dates'
            },
            categories: (function(){
                var b = [], te =[], fin=[];

                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    b.push(new Date(d));
                }

                for (i = 0; i < b.length; i += 1) {
                    console.log("length", b.length);
                    var selectedDate = b[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    te = year + "/" + month + "/" + day;
                    fin.push(te);
                }
                return fin;
            })

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
                color: '#808050'
            }]
        },
        tooltip: {
            valueSuffix: ' Watt'
        },
        series : [{
            name : 'Puissance reactive ',
            data : (function () {
                // generate an array of random data
                var data = [],  i, sum = getPuissanceReactive(), dateOfYear = [];
                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    dateOfYear.push(new Date(d));
                }
                for (i = 0; i < dateOfYear.length; i += 1) {
                    console.log("length", dateOfYear.length);
                    var selectedDate = dateOfYear[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    var constDateFin = year + "/" + month + "/" + day;
                    console.log("tteessttttt reactivee", constDateFin);
                    data.push([
                        constDateFin,
                        sum[i]
                    ]);
                    console.log("ddaaatte reactivee", data);
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
        url: 'pdf/energiphileSvgPreactive.php',
        data: {preactive  : svg} //le code "texte" du svg


    });
}

function getAjaxIntensite (dateFin,dateDebut) {
    return $.ajax({
        type: "GET",
        url: "http://localhost/projetERDF/api.php/SelectSumIntensite?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
        }
    }).responseText;
}

function getIntensite() {

    var sum=[];
    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    if (dateEnd<dateStart) {
        document.getElementById("#errorMessageDate").style.display = 'block';
        $(".alert").delay(4000).slideUp(500, function() {
            document.getElementById("#errorMessageDate").style.display = "none";
        });
        $('#dateEndAvancee').datepicker({
            startDate: $('#dateStartAvancee').datepicker("getDate")
        });
        console.log("la date de fin doit etre avant la date de debut");
    }
    else {
        if (dateStart != null && dateEnd != null) {

            var daysOfYear = [];
            console.log("DATE START = ", dateStart);
            console.log("DATE END = ", dateEnd);
            for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                daysOfYear.push(new Date(d));
            }
            //var test = daysOfYear[0];
            //console.log(test.getDate());
            for(var t=0 ; t < daysOfYear.length; t++){
                var selectedDate = daysOfYear[t];
                var day = selectedDate.getDate();
                var month = selectedDate.getMonth() + 1; //Months are zero based
                var year = selectedDate.getFullYear();
                var constDateFin = year + "-" + month + "-" + day+ " 00:00:00";
                var constDateDebut = year + "-" + month + "-" + day + " 23:59:59";

                console.log("Date debut", constDateDebut);
                console.log("Date Fin", constDateFin);

                var sumIntensite = getAjaxIntensite(constDateFin,constDateDebut);
                sumIntensite = JSON.parse(sumIntensite);
                console.log("reponse intensite : ",sumIntensite[0]);
                if(sumIntensite[0].SumIntensite == null){
                    sumIntensite[0].SumIntensite = '0';
                }
                console.log(sum.push(parseFloat(sumIntensite[0].SumIntensite)));

            }


        }
    }
    return sum;
}
function newIntensiteChart() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");

    if (dateStart != null && dateEnd != null) {
        var curr_d = dateStart.getDate();
        var curr_m = dateStart.getMonth() + 1; //Months are zero based
        var curr_y = dateStart.getFullYear();
        var dateS = curr_d + "/" + curr_m + "/" + curr_y;

        var curr_date = dateEnd.getDate() + 1;
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        var dateE = curr_date + "/" + curr_month + "/" + curr_year;
    }
    chart = new Highcharts.Chart({
        chart: { renderTo: 'intensiteEnergiphile' },

        title: {
            text: "Intensite soutiree entre "+dateS+ " et "+ dateE ,
            x: -20 //center
        },

        xAxis: {
            title: {
                text: 'Dates'
            },
            categories: (function(){
                var b = [], te =[], fin=[];

                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    b.push(new Date(d));
                }

                for (i = 0; i < b.length; i += 1) {
                    console.log("length", b.length);
                    var selectedDate = b[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    te = year + "/" + month + "/" + day;
                    fin.push(te);
                }
                return fin;
            })

        },
        exporting: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'Ampere'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808050'
            }]
        },
        tooltip: {
            valueSuffix: ' Ampere'
        },
        series : [{
            name : 'Intensite ',
            data : (function () {
                // generate an array of random data
                var data = [],  i, sum = getIntensite(), dateOfYear = [];
                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    dateOfYear.push(new Date(d));
                }
                for (i = 0; i < dateOfYear.length; i += 1) {
                    console.log("length", dateOfYear.length);
                    var selectedDate = dateOfYear[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    var constDateFin = year + "/" + month + "/" + day;
                    console.log("tteessttttt reactivee", constDateFin);
                    data.push([
                        constDateFin,
                        sum[i]
                    ]);
                    console.log("ddaaatte reactivee", data);
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
        url: 'pdf/energiphileSvgIntensite.php',
        data: {intensite  : svg} //le code "texte" du svg


    });
}

function getAjaxTension (dateFin,dateDebut) {
    return $.ajax({
        type: "GET",
        url: "http://localhost/projetERDF/api.php/SelectSumTension?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
        }
    }).responseText;
}

function getTension() {

    var sum=[];
    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    if (dateEnd<dateStart) {
        document.getElementById("#errorMessageDate").style.display = 'block';
        $(".alert").delay(4000).slideUp(500, function() {
            document.getElementById("#errorMessageDate").style.display = "none";
        });
        $('#dateEndAvancee').datepicker({
            startDate: $('#dateStartAvancee').datepicker("getDate")
        });
        console.log("la date de fin doit etre avant la date de debut");
    }
    else {
        if (dateStart != null && dateEnd != null) {

            var daysOfYear = [];
            console.log("DATE START = ", dateStart);
            console.log("DATE END = ", dateEnd);
            for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                daysOfYear.push(new Date(d));
            }
            //var test = daysOfYear[0];
            //console.log(test.getDate());
            for(var t=0 ; t < daysOfYear.length; t++){
                var selectedDate = daysOfYear[t];
                var day = selectedDate.getDate();
                var month = selectedDate.getMonth() + 1; //Months are zero based
                var year = selectedDate.getFullYear();
                var constDateFin = year + "-" + month + "-" + day+ " 00:00:00";
                var constDateDebut = year + "-" + month + "-" + day + " 23:59:59";

                console.log("Date debut", constDateDebut);
                console.log("Date Fin", constDateFin);

                var sumTension = getAjaxTension(constDateFin,constDateDebut);
                sumTension = JSON.parse(sumTension);
                console.log("reponse intensite : ",sumTension[0]);
                if(sumTension[0].SumTension == null){
                    sumTension[0].SumTension = '0';
                }
                console.log(sum.push(parseFloat(sumTension[0].SumTension)));

            }


        }
    }
    return sum;
}
function newTensionChart() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");

    if (dateStart != null && dateEnd != null) {
        var curr_d = dateStart.getDate();
        var curr_m = dateStart.getMonth() + 1; //Months are zero based
        var curr_y = dateStart.getFullYear();
        var dateS = curr_d + "/" + curr_m + "/" + curr_y;

        var curr_date = dateEnd.getDate() + 1;
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        var dateE = curr_date + "/" + curr_month + "/" + curr_year;
    }
    chart = new Highcharts.Chart({
        chart: { renderTo: 'tensionEnergiphile' },

        title: {
            text: "Tension soutiree entre "+dateS+ " et "+ dateE ,
            x: -20 //center
        },

        xAxis: {
            title: {
                text: 'Dates'
            },
            categories: (function(){
                var b = [], te =[], fin=[];

                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    b.push(new Date(d));
                }

                for (i = 0; i < b.length; i += 1) {
                    console.log("length", b.length);
                    var selectedDate = b[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    te = year + "/" + month + "/" + day;
                    fin.push(te);
                }
                return fin;
            })

        },
        exporting: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'Volt'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808050'
            }]
        },
        tooltip: {
            valueSuffix: ' Volt'
        },
        series : [{
            name : 'Tension ',
            data : (function () {
                // generate an array of random data
                var data = [],  i, sum = getTension(), dateOfYear = [];
                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    dateOfYear.push(new Date(d));
                }
                for (i = 0; i < dateOfYear.length; i += 1) {
                    console.log("length", dateOfYear.length);
                    var selectedDate = dateOfYear[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    var constDateFin = year + "/" + month + "/" + day;
                    console.log("tteessttttt reactivee", constDateFin);
                    data.push([
                        constDateFin,
                        sum[i]
                    ]);
                    console.log("ddaaatte reactivee", data);
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
        url: 'pdf/energiphileSvgTension.php',
        data: {tension  : svg} //le code "texte" du svg


    });
}

function getEnergieConsomme(dateFin, dateDebut) {
    return $.ajax({
        type: "GET",
        url: "http://localhost/projetERDF/api.php/EnergieConsommee?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
            console.log("energieConsommee :"+data);
        }
    }).responseText;
}

function getEnergieTotalConsommee() {

    var sum=[];
    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    if (dateEnd<dateStart) {
        document.getElementById("#errorMessageDate").style.display = 'block';
        $(".alert").delay(4000).slideUp(500, function() {
            document.getElementById("#errorMessageDate").style.display = "none";
        });
        $('#dateEndAvancee').datepicker({
            startDate: $('#dateStartAvancee').datepicker("getDate")
        });
        console.log("la date de fin doit etre avant la date de debut");
    }
    else {
        //TODO query


        if (dateStart != null && dateEnd != null) {

            var daysOfYear = [];
            console.log("DATE START = ", dateStart);
            console.log("DATE END = ", dateEnd);
            for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                daysOfYear.push(new Date(d));
            }
            //var test = daysOfYear[0];
            //console.log(test.getDate());
            for(var t=0 ; t < daysOfYear.length; t++){
                var selectedDate = daysOfYear[t];
                var day = selectedDate.getDate();
                var month = selectedDate.getMonth() + 1; //Months are zero based
                var year = selectedDate.getFullYear();
                var constDateFin = year + "-" + month + "-" + day+ " 00:00:00";
                var constDateDebut = year + "-" + month + "-" + day + " 23:59:59";

                console.log("Date debut", constDateDebut);
                console.log("Date Fin", constDateFin);

                var energieConsommee = getEnergieConsomme(constDateFin,constDateDebut);
                energieConsommee = JSON.parse(energieConsommee);
                console.log("reponse : ",energieConsommee[0]);
                if(energieConsommee[0].EnergieConsommee == null){
                    energieConsommee[0].EnergieConsommee = '0';
                }
                console.log(sum.push(parseFloat(energieConsommee[0].EnergieConsommee)));

            }


        }
    }
    console.log("energie consommeeeee", sum);
    return sum;
}

function newChartEnergie() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");

    if (dateStart != null && dateEnd != null) {
        var curr_d = dateStart.getDate();
        var curr_m = dateStart.getMonth() + 1; //Months are zero based
        var curr_y = dateStart.getFullYear();
        var dateS = curr_d + "/" + curr_m + "/" + curr_y;

        var curr_date = dateEnd.getDate() + 1;
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        var dateE = curr_date + "/" + curr_month + "/" + curr_year;
    }
    chart = new Highcharts.Chart({
        chart: {renderTo: 'energiphileEnergie'},

        title: {
            text: "Energie consommee entre " + dateS + " et " + dateE,
            x: -20 //center
        },

        xAxis: {
            title: {
                text: 'Dates'
            },
            categories: (function () {
                var b = [], te = [], fin = [];

                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    b.push(new Date(d));
                }

                for (i = 0; i < b.length; i += 1) {
                    console.log("length", b.length);
                    var selectedDate = b[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    te = year + "/" + month + "/" + day;
                    fin.push(te);
                }
                return fin;
            })

        },
        exporting: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'KWH'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808050'
            }]
        },
        tooltip: {
            valueSuffix: ' KWH'
        },
        series: [{
            name: 'Energie active ',
            data: (function () {
                // generate an array of random data
                var data = [], i, sum = getEnergieTotalConsommee(), dateOfYear = [];
                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    dateOfYear.push(new Date(d));
                }
                for (i = 0; i < dateOfYear.length; i += 1) {
                    console.log("length", dateOfYear.length);
                    var selectedDate = dateOfYear[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    var constDateFin = year + "/" + month + "/" + day;
                    console.log("tteessttttt energiee", constDateFin);
                    data.push([
                        constDateFin,
                        (Math.round(sum[i]*1000)/1000)
                    ]);
                    console.log("ddaaatte", data);
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
        url: 'pdf/energiphileSvgEnergie.php',
        data: {energie: svg} //le code "texte" du svg


    });
}