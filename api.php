<?php

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));


$time = time();
// connect to the mysql database
$link = mysqli_connect('localhost', 'root', '', 'Projeterdf_bdd');
mysqli_set_charset($link,'utf8');

// retrieve the table and key from the path
$typeAppel = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));



// create SQL based on HTTP method
switch ($method) {
	case 'GET':

	switch ($typeAppel) {
		case 'SelectAll' :
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			switch ($method) {
	    		case 'GET':
	        $sql = "select * from `$table`"; break;
	//     		case 'POST':
	//         $sql = "insert into `$table` set $set"; break;
			}
			break;
		case 'SelectById' :
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$key = $_GET['id'];
			switch ($method) {
				case 'GET':
					$sql = "select * from `$table`".($key?" WHERE id=$key":''); break;
	// 			case 'PUT':
	// 				$sql = "update `$table` set $set where id=$key"; break;
	// 			case 'POST':
	// 				$sql = "insert into `$table` set $set"; break;
	// 			case 'DELETE':
	// 				$sql = "delete `$table` where id=$key"; break;
			}
			break;
		case 'SelectAttribut':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$attribut = $_GET['attribut'];
			$sql = "select `$attribut` from `$table`";break;
		case 'SelectAttributById':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$attribut = $_GET['attribut'];
			$key = $_GET['id'];
			$sql = "select `$attribut` from `$table` WHERE id=$key";break;
		case 'SelectAttribut':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$attribut = $_GET['attribut'];
			$sql = "select `$attribut` from `$table`";break;
		case 'SelectLastRow':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$sql = "select * from `$table` where Date = (Select max(Date) from `$table`)";break;
		case 'SelectLastRangeData':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$sql = "SELECT * FROM `$table` where Date between  (Select max(Date) from `$table`) - 86399 and (Select max(Date) from `$table`)";break;
		case 'SelectByDate':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select * from `$table`  WHERE Date >= '$date1' AND Date <='$date2'";break;
		case 'SelectByDateAndHourAtNight':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$heureDebut = $_GET['heureDebut'];
			$heureFin = $_GET['heureFin'];
			$sql = "select sum(Energie) as energie from `$table`  WHERE Date >= '$date1' AND Date <= '$date2' and (TIME(Date) between  '$heureDebut' and '00:00:00' or time(DAte) Between '00:00:00' and '$heureFin')";break;
		case 'SelectByDateAndHourAtDay':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$heureDebut = $_GET['heureDebut'];
			$heureFin = $_GET['heureFin'];
			$sql = "select sum(Energie) as energie from `$table`  WHERE Date >= '$date1' AND Date <= '$date2' and (TIME(Date) between  '$heureDebut' and '$heureFin')";break;
		case 'SelectByDateOnWeek':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select sum(Energie) as energie from `$table`  WHERE Date >= '$date1' AND Date <='$date2' AND WEEKDAY(Date) in (0,1,2,3,4) ";break;
		case 'SelectByDateOnWeekEnd':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select sum(Energie) as energie from `$table`  WHERE Date >= '$date1' AND Date <='$date2' AND WEEKDAY(Date) in (5,6) ";break;
		case 'SelectByDayOfWeekAtNight':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$dayOfWeek = $_GET['dayOfWeek'];
			$sql = "select sum(Energie) as energie from `$table`  WHERE Date >= '$date1' AND Date <= '$date2' and (TIME(Date) between  '21:00:00' and '00:00:00' or time(DAte) Between '00:00:00' and '06:00:00') AND WEEKDAY(Date) = '$dayOfWeek' ";break;
		case 'SelectByDayOfWeekAtDay':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$dayOfWeek = $_GET['dayOfWeek'];
			$sql = "select sum(Energie) as energie from `$table`  WHERE Date >= '$date1' AND Date <= '$date2' and (TIME(Date) between  '06:00:00' and '21:00:00') AND WEEKDAY(Date) = '$dayOfWeek' ";break;
		case 'SelectByDateOnWinter':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select sum(Energie) as energie from `$table`  WHERE Date >= '$date1' AND Date <='$date2' AND MONTH(Date) in (1,2,3)  ";break;
		case 'SelectByDateOnSpring':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select sum(Energie) as energie from `$table`  WHERE Date >= '$date1' AND Date <='$date2' AND MONTH(Date) in (4,5,6)  ";break;
		case 'SelectByDateOnSummer':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select sum(Energie) as energie from `$table`  WHERE Date >= '$date1' AND Date <='$date2' AND MONTH(Date) in (7,8,9)  ";break;
		case 'SelectByDateOnAutumn':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select sum(Energie) as energie from `$table`  WHERE Date >= '$date1' AND Date <='$date2' AND MONTH(Date) in (10,11,12)  ";break;
		case 'SelectByDateInf':
			$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
			$date = $_GET['date'];
			$sql = "select * from `$table`  WHERE Date >= '$date' ";break;
		case 'MaxPApparente':
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select max(Papparente) MaxPapparente from `values`  WHERE Date >= '$date1' AND Date <='$date2'";break;
		case 'NbPApparenteDepasse':
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$pApparenteMax = $_GET['pApparenteMax'];
			$sql = "select count(Papparente) NbPApparenteDepasse from `values`  WHERE Date >= '$date1' AND Date <='$date2' AND Papparente> '$pApparenteMax'";break;
		case 'SelectAllPApparenteDepasse':
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$pApparenteMax = $_GET['pApparenteMax'];
			$sql = "select Date,Papparente  from `values`  WHERE Date >= '$date1' AND Date <='$date2' AND Papparente> '$pApparenteMax'";break;
		case 'MoyPApparente':
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select avg(Papparente) MoyPApparente from `values`  WHERE Date >= '$date1' AND Date <='$date2'";break;
		case 'SelectDiffEnergieByDayAndHour':
			$jour = $_GET['jour'];
			$heureDebut = $_GET['heureDebut'];
			$heureFin = $_GET['heureFin'];
			$dateDebut = $_GET['dateDebut'];
			$dateFin = $_GET['dateFin'];
			$sql = "select  Max(Energie)-Min(Energie)  EnergieConsommee FROM `values`   WHERE  TIME(Date) >= '$heureDebut' AND TIME(Date) <= '$heureFin' AND Date >= '$dateDebut' AND Date <='$dateFin' AND   WEEKDAY(Date) ='$jour' group by YEARWEEK(Date) ";break;
		case 'SelectYears':
			$sql = "select distinct Year(`Date`) Annee FROM `values`";break;
		// TIME(Date) >= '$heureDebut' AND TIME(Date) <= '$heureFin' AND Date >= '$dateDebut' AND Date <='$dateFin' AND
		case 'SelectAllTarifsOrderBy':
			$sql = "select * FROM `tarifs` order BY `Jour`,`HeureDebut`";break;

		case 'SelectTarifJour':
			$sql = "SELECT * from `tarifs` where (`HeureDebut` not in(Select `HeureDebut` FROM `tarifs` group by `HeureDebut`,`HeureFin` having (count(*) = 2 AND MAX(`Jour`)= 6 AND MIN(`Jour`) =5))
                            OR `HeureFin` not in(Select `HeureFin` FROM `tarifs` group by `HeureDebut`,`HeureFin` having (count(*) = 2 AND MAX(`Jour`)= 6 AND MIN(`Jour`) =5))
                            OR `Jour` not in (5,6) )
                            AND ( `HeureDebut` not in( Select `HeureDebut` FROM `tarifs` group by `HeureDebut`,`HeureFin` having (count(*) = 5 AND MAX(`Jour`)= 4 AND MIN(`Jour`) =0))
                            OR `HeureFin` not in( Select `HeureFin` FROM `tarifs` group by `HeureDebut`,`HeureFin` having (count(*) = 5 AND MAX(`Jour`)= 4 AND MIN(`Jour`) =0))
                            		OR `Jour` not in(0,1,2,3,4) )
                            AND	(`HeureDebut` not in   (Select `HeureDebut` FROM `tarifs` group by `HeureDebut`,`HeureFin` having (count(*) =7 AND MAX(`Jour`)= 6 AND MIN(`Jour`) =0))
                            OR `HeureFin` not in   (Select `HeureFin` FROM `tarifs` group by `HeureDebut`,`HeureFin` having (count(*) =7 AND MAX(`Jour`)= 6 AND MIN(`Jour`) =0)))
                   order BY `Jour`,`HeureDebut`";break;
		case 'SelectTarifSemaine':
			$sql = "select * FROM `tarifs` group by `HeureDebut`,`HeureFin` having (count(*) = 5 ANd Max(`Jour`) = 4 And Min(`Jour`) =0) order BY `Jour`,`HeureDebut`";break;
		case 'SelectTarifWeekEnd':
			$sql = "select * FROM `tarifs` group by `HeureDebut`,`HeureFin` having (count(*) = 2 ANd Max(`Jour`) = 6 And Min(`Jour`) =5) order BY `Jour`,`HeureDebut`";break;
		case 'SelectTarifSemaineEntiere':
			$sql = "select * FROM `tarifs` group by `HeureDebut`,`HeureFin` having (count(*) = 7 ANd Max(`Jour`) = 6 And Min(`Jour`) =0) order BY `Jour`,`HeureDebut`";break;

		case 'IsTarifExist':
			$heureDebut = $_GET['heureDebut'];
			$heureFin = $_GET['heureFin'];
			$jour = $_GET['jour'];
			$sql = "select count(*) nbPlages from `tarifs` where (( '$heureDebut' > HeureDebut And '$heureDebut' < HeureFin) Or ('$heureFin' > HeureDebut  And '$heureFin' < HeureFin ) or ('$heureDebut' < HeureDebut And '$heureFin' > HeureFin ) ) And (Jour ='$jour')";break;

		case 'SelectMonths':
			$year= $_GET['Annee'];
			$sql = "select distinct MONTH(`Date`) as Mois FROM `values` where Year(`Date`)= ".$year;break;
		case 'SelectSumPapparente':
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select sum(Papparente) SumPapparente from `values`  WHERE Date >= '$date1' AND Date <='$date2'";break;
		case 'SelectSumPreactive':
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select sum(Preactive) SumPreactive from `values`  WHERE Date >= '$date1' AND Date <='$date2'";break;
		case 'SelectSumIntensite':
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select sum(Intensite) SumIntensite from `values`  WHERE Date >= '$date1' AND Date <='$date2'";break;
		case 'SelectSumTension':
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select sum(Tension) SumTension from `values`  WHERE Date >= '$date1' AND Date <='$date2'";break;
		case 'EnergieConsommee':
			$date1 = $_GET['date1'];
			$date2 = $_GET['date2'];
			$sql = "select max(Energie)-min(Energie) EnergieConsommee from `values`  WHERE Date >= '$date1' AND Date <='$date2'";break;

	}
	break;
	case 'POST':
		switch ($typeAppel) {
			case 'insertTarif':
				$heureDebut = $_POST['heureDebut'];
				$heureFin = $_POST['heureFin'];
				$jour = $_POST['jour'];
				$tarif = $_POST['tarif'];
				$sql = "insert into `tarifs` values ('$heureDebut','$heureFin','$jour','$tarif')";break;
			case 'deleteTarif':
				$heureDebut = $_POST['heureDebut'];
				$heureFin = $_POST['heureFin'];
				$jour = $_POST['jour'];
				$sql = "delete from `tarifs` where HeureDebut = '$heureDebut' And HeureFin = '$heureFin' And Jour = $jour";break;
		}
		break;


}

// excecute SQL statement
$result = mysqli_query($link,$sql);

// die if SQL statement failed
if (!$result) {
    http_response_code(404);
    die(mysqli_error($link));
}

// print results, insert id or affected row count
    if ($method == 'GET') {
         echo '[';
		if (mysqli_num_rows($result)>0){
	        for ($i = 0; $i < mysqli_num_rows($result); $i++) {

	            echo ($i > 0 ? ',' : '') . json_encode(mysqli_fetch_object($result));

	        }
       	}
       	else{
       		echo  json_encode(mysqli_fetch_object($result));
       	}
        echo ']';
    } elseif ($method == 'POST') {
        echo mysqli_insert_id($link);
    } else {
        echo mysqli_affected_rows($link);
    }

// close mysql connection
mysqli_close($link);