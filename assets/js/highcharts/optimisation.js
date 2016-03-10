/**
 * Created by Amine on 01/02/2016.
 */

var url;
var port;
var projectDirectory;
var api;

$.getJSON("conf.json", function (data) {
    url = data["url"];
    port = data["port"];
    projectDirectory = data["projectDirectory"];
    api = data["api"];
});

angular	.module("appOptimisation", [])
    .controller	( "optimisationController", ['$scope', '$interval', '$timeout', '$http'
    , function($scope,$interval,$timeout,$http,$httpProvider)
    {
        var date = new Date();
        var weekDebut = date.setDate(date.getDate() - 7);
        var weekFin = date.setDate(date.getDate());
        $('.dateDebut').on('changeDate', function () {
            $('.datepicker').hide();

        });

        $('.dateFin').on('changeDate', function () {
            $('.datepicker').hide();

        });
        $('.dateDebut').datepicker("setDate", new Date(weekDebut));
        $('.dateFin').datepicker("setDate", new Date());
        $scope.PApparenteMax;
        $scope.PApparenteMoy;
        $scope.NbPApparenteDepasse;
        $scope.PApparenteDepasse
        $scope.date;
        $scope.pApparenteSouscrite;
        $scope.PApparenteOptimal;
        $scope.LancerAnalyse = function (){

            $scope.pApparenteSouscriteAnalyse = $scope.pApparenteSouscrite;
            $scope.date = $('#groupDebutPuissance').datepicker("getDate");
            $scope.dateDebut = $scope.date.getFullYear() +"-"+($scope.date.getMonth()+1) +"-" + $scope.date.getDate();
            $scope.date = $('#groupFinPuissance').datepicker("getDate");
            $scope.dateFin = $scope.date.getFullYear() +"-"+($scope.date.getMonth()+1) +"-" + $scope.date.getDate();
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api +"/MaxPApparente?date1="+$scope.dateDebut+"&date2="+$scope.dateFin,
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {

                    if (data.length !== 0) {
                        $scope.PApparenteMax = Math.round(data[0].MaxPapparente*10)/10
                        $scope.CalculPapparenteOPtimale();
                    } else {
                        $scope.PApparenteMax = 0;
                    }
                }
            });
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api + "/MoyPApparente?date1="+$scope.dateDebut+"&date2="+$scope.dateFin,
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {


                    if (data.length !== 0) {
                        $scope.PApparenteMoy = Math.round(data[0].MoyPApparente*10)/10
                    } else {
                        $scope.PApparenteMoy = 0;
                    }
                }
            });
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api + "/NbPApparenteDepasse?date1="+$scope.dateDebut+"&date2="+$scope.dateFin+"&pApparenteMax="+$scope.pApparenteSouscrite,
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {

                    if (data.length !== 0) {
                        $scope.NbPApparenteDepasse = data[0].NbPApparenteDepasse
                    } else {
                        $scope.NbPApparenteDepasse = 0;
                    }
                }
            });
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api + "/SelectAllPApparenteDepasse?date1="+$scope.dateDebut+"&date2="+$scope.dateFin+"&pApparenteMax="+$scope.pApparenteSouscrite,
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {

                    if (data.length !== 0) {
                        $scope.PApparenteDepasse = data
                    } else {
                        $scope.PApparenteDepasse = null;
                    }
                }
            });

            //$scope.CalculerConsommation()
            //$scope.AjouterTarif()
        }

        //$interval($scope.LancerAnalyse, 1000);
        $scope.SelectPSouscrite = function (){

            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api + "/SelectAttribut/optioncompteur?attribut=PApparenteSouscrite",
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {

                    if (data.length !== 0) {
                        $scope.pApparenteSouscrite = data[0].PApparenteSouscrite
                    } else {
                        $scope.pApparenteSouscrite = null;
                    }
                }
            });

        }

        $scope.ModifierMaximum = function (){
            if(!isNaN($scope.PSous))
            {
                $scope.pApparenteSouscrite = $scope.PSous
            }

        }
        $scope.CalculPapparenteOPtimale = function (){
            $scope.PApparenteOptimal = Math.floor($scope.PApparenteMax) +1;

        }

        $scope.CalculerConsommation = function (){
            $scope.waitAnalyseTarif = true;
            $scope.diffEnergie =0;
            $scope.coutEnergieConsommee =0;
            $scope.energies = [];
            $scope.plages;
            $scope.date = $('#groupDebutTarif').datepicker("getDate");
            $scope.dateDebut = $scope.date.getFullYear() +"-"+($scope.date.getMonth()+1) +"-" + $scope.date.getDate();
            $scope.date = $('#groupFinTarif').datepicker("getDate");
            $scope.dateFin = $scope.date.getFullYear() +"-"+($scope.date.getMonth()+1) +"-" + $scope.date.getDate();
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api + "/SelectTarifJour",
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {
                    $scope.plages = data;
                    $scope.coutEnergieCourante = 0;
                    $scope.diffEnergieCourante = 0;
                    for(i=0;i<data.length;i++) {
                        if ($scope.plages[i] != null) {
                            $scope.heureDebut = $scope.plages[i].HeureDebut;
                            $scope.heureFin = $scope.plages[i].HeureFin;
                            $scope.jour = $scope.plages[i].Jour;
                            $scope.tarif = $scope.plages[i].Tarif;
                            $.ajax({
                                type: "GET",
                                url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectDiffEnergieByDayAndHour?heureDebut=" + $scope.heureDebut + "&heureFin=" + $scope.heureFin + "&jour=" + $scope.jour + "&dateDebut=" + $scope.dateDebut + "&dateFin=" + $scope.dateFin,
                                cache: false,
                                async: false,
                                dataType: 'json',
                                success: function (data2) {

                                    for (j = 0; j < data2.length; j++) {
                                        if (data2[j] != null) {
                                            $scope.coutEnergieCourante += parseInt(data2[j].EnergieConsommee) * parseFloat($scope.tarif);
                                            $scope.coutEnergieConsommee += parseInt(data2[j].EnergieConsommee) * parseFloat($scope.tarif);
                                            $scope.diffEnergieCourante += parseInt(data2[j].EnergieConsommee);
                                            $scope.diffEnergie += parseInt(data2[j].EnergieConsommee);
                                        }
                                    }
                                }
                            });
                            $scope.coutEnergieCourante = Math.round($scope.coutEnergieCourante * 100) / 100;
                            $scope.energies.push([$scope.heureDebut, $scope.heureFin, $scope.ConvertirChiffreEnJour($scope.jour), $scope.tarif, $scope.diffEnergieCourante, $scope.coutEnergieCourante]);
                            $scope.coutEnergieCourante = 0;
                            $scope.diffEnergieCourante = 0;
                        }
                    }


                }
            });
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectTarifSemaine",
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {
                    $scope.plages = data;
                    $scope.coutEnergieCourante = 0;
                    $scope.diffEnergieCourante = 0;
                    for(i=0;i<data.length;i++)
                    {
                        $scope.heureDebut = $scope.plages[i].HeureDebut;
                        $scope.heureFin = $scope.plages[i].HeureFin;

                        $scope.tarif = $scope.plages[i].Tarif;
                        var listeJours = $scope.ConvertirJourEnChiffre("Semaine");
                        for (d=0;d<listeJours.length;d++)
                        {
                            $scope.jour = listeJours[d];
                            $.ajax({
                                type: "GET",
                                url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectDiffEnergieByDayAndHour?heureDebut="+$scope.heureDebut+"&heureFin="+$scope.heureFin+"&jour="+$scope.jour+"&dateDebut="+$scope.dateDebut+"&dateFin="+$scope.dateFin,
                                cache: false,
                                async: false,
                                dataType: 'json',
                                success: function (data2) {

                                    for (j=0; j<data2.length ; j++) {
                                        if (data2[j] !=null)
                                        {
                                            $scope.coutEnergieCourante +=  parseInt(data2[j].EnergieConsommee)* parseFloat($scope.tarif);
                                            $scope.coutEnergieConsommee +=  parseInt(data2[j].EnergieConsommee)* parseFloat($scope.tarif);
                                            $scope.diffEnergieCourante += parseInt(data2[j].EnergieConsommee);
                                            $scope.diffEnergie += parseInt(data2[j].EnergieConsommee);
                                        }
                                    }
                                }
                            });
                        }
                        $scope.coutEnergieCourante = Math.round($scope.coutEnergieCourante*100)/100;
                        $scope.energies.push([$scope.heureDebut,$scope.heureFin,"Semaine",$scope.tarif,$scope.diffEnergieCourante,$scope.coutEnergieCourante]);
                        $scope.coutEnergieCourante = 0;
                        $scope.diffEnergieCourante = 0;
                    }


                }
            });
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectTarifWeekEnd",
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {
                    $scope.plages = data;
                    $scope.coutEnergieCourante = 0;
                    $scope.diffEnergieCourante = 0;
                    for(i=0;i<data.length;i++) {
                        if ($scope.plages[i] != null) {
                            $scope.heureDebut = $scope.plages[i].HeureDebut;
                            $scope.heureFin = $scope.plages[i].HeureFin;
                            $scope.tarif = $scope.plages[i].Tarif;
                            var listeJours = $scope.ConvertirJourEnChiffre("WeekEnd");
                            for (d = 0; d < listeJours.length; d++) {

                                $scope.jour = listeJours[d];
                                $.ajax({
                                    type: "GET",
                                    url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectDiffEnergieByDayAndHour?heureDebut=" + $scope.heureDebut + "&heureFin=" + $scope.heureFin + "&jour=" + $scope.jour + "&dateDebut=" + $scope.dateDebut + "&dateFin=" + $scope.dateFin,
                                    cache: false,
                                    async: false,
                                    dataType: 'json',
                                    success: function (data2) {

                                        for (j = 0; j < data2.length; j++) {
                                            if (data2[j] != null) {
                                                $scope.coutEnergieCourante += parseInt(data2[j].EnergieConsommee) * parseFloat($scope.tarif);
                                                $scope.coutEnergieConsommee += parseInt(data2[j].EnergieConsommee) * parseFloat($scope.tarif);
                                                $scope.diffEnergieCourante += parseInt(data2[j].EnergieConsommee);
                                                $scope.diffEnergie += parseInt(data2[j].EnergieConsommee);
                                            }
                                        }
                                    }
                                });
                            }
                            $scope.coutEnergieCourante = Math.round($scope.coutEnergieCourante * 100) / 100;
                            $scope.energies.push([$scope.heureDebut, $scope.heureFin, "WeekEnd", $scope.tarif, $scope.diffEnergieCourante, $scope.coutEnergieCourante]);
                            $scope.coutEnergieCourante = 0;
                            $scope.diffEnergieCourante = 0;
                        }
                    }

                }
            });
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectTarifSemaineEntiere",
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {
                    $scope.plages = data;
                    $scope.coutEnergieCourante = 0;
                    $scope.diffEnergieCourante = 0;
                    for(i=0;i<data.length;i++) {
                        if ($scope.plages[i] != null) {
                            $scope.heureDebut = $scope.plages[i].HeureDebut;
                            $scope.heureFin = $scope.plages[i].HeureFin;
                            $scope.tarif = $scope.plages[i].Tarif;
                            var listeJours = $scope.ConvertirJourEnChiffre("Tous les jours");
                            for (d = 0; d < listeJours.length; d++) {
                                $scope.jour = listeJours[d];
                                $.ajax({
                                    type: "GET",
                                    url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectDiffEnergieByDayAndHour?heureDebut=" + $scope.heureDebut + "&heureFin=" + $scope.heureFin + "&jour=" + $scope.jour + "&dateDebut=" + $scope.dateDebut + "&dateFin=" + $scope.dateFin,
                                    cache: false,
                                    async: false,
                                    dataType: 'json',
                                    success: function (data2) {

                                        for (j = 0; j < data2.length; j++) {
                                            if (data2[j] != null) {
                                                $scope.coutEnergieCourante += parseInt(data2[j].EnergieConsommee) * parseFloat($scope.tarif);
                                                $scope.coutEnergieConsommee += parseInt(data2[j].EnergieConsommee) * parseFloat($scope.tarif);
                                                $scope.diffEnergieCourante += parseInt(data2[j].EnergieConsommee);
                                                $scope.diffEnergie += parseInt(data2[j].EnergieConsommee);
                                            }
                                        }
                                    }
                                });
                            }
                            $scope.coutEnergieCourante = Math.round($scope.coutEnergieCourante * 100) / 100;
                            $scope.energies.push([$scope.heureDebut, $scope.heureFin, "Tous les jours", $scope.tarif, $scope.diffEnergieCourante, $scope.coutEnergieCourante]);
                            $scope.coutEnergieCourante = 0;
                            $scope.diffEnergieCourante = 0;
                        }
                    }

                }
            });
            for  (k=0;k<$scope.energies.length;k++)
            {
                if ($scope.diffEnergie>0)
                {
                    $scope.energies[k][6] = (Math.round($scope.energies[k][4]/$scope.diffEnergie*1000)/10);
                }
                else
                {
                    $scope.energies[k][6]= 0;
                }
            }
            $scope.coutEnergieConsommee = Math.round($scope.coutEnergieConsommee*100)/100;
            $scope.waitAnalyseTarif = false;
        }

        $scope.AjouterTarif = function (){
            var popupErreur = false;
            var testFormatDate = true;
            var testFormatTarif = true;
            var testDebutSupFin = true;
            var testValideJour = true;
            var testPlageExistante = true;
            var tabHeureDebut = [];
            var tabHeureFin = [];
            $scope.AfficherErreur = false;
            $scope.ErreurInsertionPlage = "";
            tabHeureDebut = [];
            tabHeureFin = [];
            var testValideJour = ($scope.JourPlage!='' && $scope.JourPlage!= null);
            var testFormatTarif = !isNaN($scope.TarifPlage)  ;
            popupErreur = $scope.HeureDebutPlage == '' || $scope.HeureDebutPlage == null || $scope.HeureFinPlage == '' || $scope.HeureFinPlage == null || $scope.JourPlage =='' || $scope.JourPlage ==null || $scope.TarifPlage =='' || $scope.TarifPlage == null;

            if (!popupErreur )
            {
                var tabHeureDebut = $scope.HeureDebutPlage.split(':');
                var tabHeureFin = $scope.HeureFinPlage.split(':');
                testFormatDate = tabHeureDebut.length==2 && !isNaN(tabHeureDebut[0]) && tabHeureDebut[0].length ==2 && !isNaN(tabHeureDebut[1]) && tabHeureDebut[1].length ==2 &&  parseInt(tabHeureDebut[0])>=0 && parseInt(tabHeureDebut[0]) <24 && parseInt(tabHeureDebut[1])>=0 && parseInt(tabHeureDebut[1]) <60 ;
                testFormatDate &= tabHeureFin.length==2 && !isNaN(tabHeureFin[0]) && tabHeureFin[0].length ==2 &&  !isNaN(tabHeureFin[1]) && tabHeureFin[1].length ==2 && parseInt(tabHeureFin[0])>=0 && parseInt(tabHeureFin[0]) <24 && parseInt(tabHeureFin[1])>=0 && parseInt(tabHeureFin[1]) <60 ;
            }
            //alert(tabHeureDebut.length)



            if (!popupErreur )
            {
                if (!testFormatDate )
                {
                    $scope.ErreurInsertionPlage = "Saisie invalide! Format de la date non respecté, la date doit être au format 'HH:MM' .";
                    popupErreur = true;
                }
                else
                {
                    var testDebutSupFin = (parseInt(tabHeureDebut[0])< parseInt(tabHeureFin[0])) || (parseInt(tabHeureDebut[0])==parseInt(tabHeureFin[0]) && parseInt(tabHeureDebut[1])<=parseInt(tabHeureFin[1]));
                    if (!testDebutSupFin  && $scope.JourPlage != 'Tous les jours' )
                    {
                        $scope.ErreurInsertionPlage = "Saisie invalide! La date de fin est inférieure à la date de début.";
                        popupErreur = true;
                    }
                }
            }
//        	if (!testValideJour && !popupErreur)
//        	{
//        		alert("Saisie invalide! Format du jour non respecté.")
//        		popupErreur = true;
//        	}
            if (!testFormatTarif && !popupErreur)
            {
                $scope.ErreurInsertionPlage = "Saisie invalide! Format du tarif non respecté.";
                popupErreur = true;
            }
            if (!popupErreur )
            {
                listeJours = $scope.ConvertirJourEnChiffre($scope.JourPlage);

                for (i=0;i<listeJours.length;i++)
                {
                    if (!testDebutSupFin)
                    {
                        jour1 = listeJours[i];
                        jour2 = listeJours[(i+1)%7];
                        HeureDebutJ1 = $scope.HeureDebutPlage;
                        HeureFinJ1 = '00:00';
                        HeureDebutJ2 = '00:00';
                        HeureFinJ2 = $scope.HeureFinPlage;
                        $.ajax({
                            type: "GET",
                            url: url + ":" + port + "/" + projectDirectory + "/" + api +"/IsTarifExist?heureDebut="+HeureDebutJ1+"&heureFin="+HeureFinJ2+"&jour="+jour2,
                            cache: false,
                            async: false,
                            dataType: 'json',
                            success: function (data) {
                                if (data!= null && data.length >0 && data[0] != null)
                                {
                                    testPlageExistante &= (parseInt(data[0].nbPlages)==0);

                                }
                            }
                        });
                        $.ajax({
                            type: "GET",
                            url: url + ":" + port + "/" + projectDirectory + "/" + api +"/IsTarifExist?heureDebut="+HeureDebutJ2+"&heureFin="+HeureFinJ2+"&jour="+jour2,
                            cache: false,
                            async: false,
                            dataType: 'json',
                            success: function (data) {
                                if (data!= null && data.length >0 && data[0] != null)
                                {
                                    testPlageExistante &= (parseInt(data[0].nbPlages)==0);

                                }
                            }
                        });

                    }
                    else
                    {
                        $scope.jour = listeJours[i];
                        $.ajax({
                            type: "GET",
                            url: url + ":" + port + "/" + projectDirectory + "/" + api +"/IsTarifExist?heureDebut="+$scope.HeureDebutPlage+"&heureFin="+$scope.HeureFinPlage+"&jour="+$scope.jour,
                            cache: false,
                            async: false,
                            dataType: 'json',
                            success: function (data) {
                                if (data!= null && data.length >0 && data[0] != null)
                                {
                                    testPlageExistante &= (parseInt(data[0].nbPlages)==0);

                                }
                            }
                        });
                    }

                }
            }
            if (!testPlageExistante && !popupErreur)
            {
                $scope.ErreurInsertionPlage = "Saisie invalide! La plage est déjà existante.";
                popupErreur = true;
            }



            if(!popupErreur)
            {

                for (i=0;i<listeJours.length;i++)
                {
                    if (!testDebutSupFin)
                    {
                        jour1 = listeJours[i];
                        jour2 = listeJours[(i+1)%7];
                        HeureDebutJ1 = $scope.HeureDebutPlage;
                        HeureFinJ1 = '23:59';
                        HeureDebutJ2 = '00:00';
                        HeureFinJ2 = $scope.HeureFinPlage;
                        $.ajax({
                            type: "POST",
                            async: false,
                            url: url + ":" + port + "/" + projectDirectory + "/" + api +"/insertTarif",
                            data: "heureDebut="+HeureDebutJ1+"&heureFin="+HeureFinJ1+"&jour="+jour1+"&tarif="+$scope.TarifPlage,
                            success: function (data) {
                            }
                        });
                        $.ajax({
                            type: "POST",
                            async: false,
                            url: url + ":" + port + "/" + projectDirectory + "/" + api +"/insertTarif",
                            data: "heureDebut="+HeureDebutJ2+"&heureFin="+HeureFinJ2+"&jour="+jour2+"&tarif="+$scope.TarifPlage,
                            success: function (data) {
                            }
                        });

                    }
                    else
                    {
                        $scope.jour = listeJours[i];

                        $.ajax({
                            type: "POST",
                            async: false,
                            url: url + ":" + port + "/" + projectDirectory + "/" + api +"/insertTarif",
                            data: "heureDebut="+$scope.HeureDebutPlage+"&heureFin="+$scope.HeureFinPlage+"&jour="+$scope.jour+"&tarif="+$scope.TarifPlage,
                            success: function (data) {
                            }
                        });
                    }
                }
                $scope.HeureDebutPlage = '';
                $scope.HeureFinPlage = '';
                $scope.JourPlage = '';
                $scope.TarifPlage = '';
                $scope.AfficherPlagesHoraires();
            }
            $scope.AfficherErreur = ($scope.ErreurInsertionPlage!="");

            //?heureDebut="+$scope.DateDebutConso+"&heureFin="+$scope.DateFinConso+"&jour="+$scope.jour+"&tarif="+$scope.tarif



        }
        $scope.MasquerErreur = function (){
            $scope.AfficherErreur = false;
        }
        $scope.AfficherPlagesHoraires = function (){

            $scope.diffEnergie =0;
            $scope.coutEnergieConsommee =0;
            $scope.plages;
            $scope.listePlagesJour = null;
            $scope.listePlagesSemaine = null;
            $scope.listePlagesWeekEnd = null;
            $scope.listePlagesSemaineEntiere = null;
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectTarifJour",
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {
                    if (data!= null && data.length >0 && data[0] != null)
                    {
                        $scope.listePlagesJour = data;
                    }
                }
            });
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectTarifSemaine",
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {
                    if (data!= null && data.length >0 && data[0] != null)
                    {
                        $scope.listePlagesSemaine = data;
                    }
                }
            });
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectTarifWeekEnd",
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {
                    if (data!= null && data.length >0 && data[0] != null)
                    {
                        $scope.listePlagesWeekEnd = data;
                    }
                }
            });
            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectTarifSemaineEntiere",
                cache: false,
                async: false,
                dataType: 'json',
                success: function (data) {
                    if (data!= null && data.length >0 && data[0] != null)
                    {
                        $scope.listePlagesSemaineEntiere = data;
                    }
                }
            });
        }

        $scope.ConvertirJourEnChiffre = function (jour){
            jourChiffre = [];
            switch (jour) {

                case 'Lundi' :
                    jourChiffre.push('0');
                    break;
                case 'Mardi' :
                    jourChiffre.push('1');
                    break;
                case 'Mercredi' :
                    jourChiffre.push('2');
                    break;
                case 'Jeudi' :
                    jourChiffre.push('3');
                    break;
                case 'Vendredi':
                    jourChiffre.push('4');
                    break;
                case 'Samedi' :
                    jourChiffre.push('5');
                    break;
                case 'Dimanche' :
                    jourChiffre.push('6');
                    break;
                case 'Tous les jours' :
                    jourChiffre.push('0','1','2','3','4','5','6');
                    break;
                case 'Semaine' :
                    jourChiffre.push('0','1','2','3','4');
                    break;
                case 'WeekEnd' :
                    jourChiffre.push('5','6');
                    break;



            }
            return jourChiffre;

        }


        $scope.ConvertirChiffreEnJour = function (jourChiffre){
            jour = '';
            switch (jourChiffre) {

                case '0' :
                    jour = 'Lundi';
                    break;
                case '1' :
                    jour = 'Mardi';
                    break;
                case '2' :
                    jour = 'Mercredi';
                    break;
                case '3' :
                    jour = 'Jeudi';
                    break;
                case '4':
                    jour = 'Vendredi';
                    break;
                case '5' :
                    jour = 'Samedi';
                    break;
                case '6' :
                    jour = 'Dimanche';
                    break;



            }
            return jour;

        }
        $scope.SupprimerTarif = function (plage,type){
            listeJours = [];
            if (type=='Jour')
            {
                listeJours.push(plage.Jour)
            }
            else
            {
                listeJours = $scope.ConvertirJourEnChiffre(type);
            }
            //$scope.Donnees[1] = "heureFin="+$scope.DateFinConso;
            //$scope.Donnees[2] = "jour="+$scope.jour;
            //$scope.Donnees[3] = "tarif="+$scope.tarif;
            for (i=0;i<listeJours.length;i++)
            {
                $scope.jour = listeJours[i];
                $.ajax({
                    type: "POST",
                    cache : false,
                    async: false,
                    url: url + ":" + port + "/" + projectDirectory + "/" + api +"/deleteTarif",
                    data: "heureDebut="+plage.HeureDebut+"&heureFin="+plage.HeureFin+"&jour="+$scope.jour,
                    success: function (data) {
                    }
                });
            }
            $scope.AfficherPlagesHoraires();

        }



    }]);