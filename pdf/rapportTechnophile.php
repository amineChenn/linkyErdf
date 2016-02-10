<?php

// create new PDF document
include_once('tcpdf/tcpdf.php');
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, false, 'ISO-8859-1', false);

// set document information
$pdf->SetCreator('TCPDF');
$pdf->SetAuthor('ERDF');
$pdf->SetTitle('Suivi de consommation Technophile');
$pdf->SetSubject('Suivi de consommation');

// set default header data
$pdf->SetHeaderData('linky.jpg', 30, 'Suivi de consommation', "Récapitulatif\nwww.geg.fr", array(2,64,128));

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);


// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
    require_once(dirname(__FILE__).'/lang/eng.php');
    $pdf->setLanguageArray($l);
}

// set font

$pdf->SetFont('helvetica', '', 10);

// add a page
$pdf->AddPage();

//Variables
$dateDebutEnergie = '27/01/2016';
$dateFinEnergie = '20/03/2016';


// HTML content
$html = '<div style="text-align:center; color: #33CC33"><h1> Energie consommée entre '.$dateDebutEnergie.' et '.$dateFinEnergie.'</h1></div>';
$pdf->writeHTML($html, true, false, true, false, '');

//Variables
$heurePleinesEnergie = 10;
$heureCreusesEnergie = 200;


$html = '<div style="color: #0075b0">Heures pleines : '.$heurePleinesEnergie.' Wh / Heures creuses : '.$heureCreusesEnergie.' Wh</div>';
$pdf->writeHTML($html, true, false, true, false, '');

//SVG image
$pdf->ImageSVG($file='img/img.svg', $x=25, $y=70, $w='', $link='', $h='', $palign='', $border=1, $fitonpage=false);

//end of page
$pdf->lastPage();

//add new page
$pdf->AddPage();

//variables
$dateDebutPuissance = '27/01/2016';
$dateFinPuissance = '20/03/2016';

$html = '<div style="text-align:center; color: #33CC33"><h1> Puissance consommée entre '.$dateDebutPuissance.' et '.$dateFinPuissance.'</h1></div>';
$pdf->writeHTML($html, true, false, true, false, '');

//Veriables
$heurePleinesPuissance = 10;
$heureCreusesPuissance = 200;

$html = '<div style="color: #0075b0">Heure pleine : '.$heureCreusesPuissance.' Wh / Heure creuse : '.$heurePleinesPuissance.' Wh<</div>';
$pdf->writeHTML($html, true, false, true, false, '');

$pdf->ImageSVG($file='img/img.svg', $x=25, $y=70, $w='', $link='', $h='', $palign='', $border=1, $fitonpage=false);

$pdf->lastPage();
$pdf->AddPage();
$html = '<div class="col-md-12" style="font-size: 14px;">
                    <div style="text-align:center; color: #33CC33"> <h1>Explications sur le projet</h1></div>
                    <div style="text-align: justify"></div> Taillé sur le patron des gens de tous les vieux soldats, que la lettre du docteur.
                    Arrêter le service et pour rendre sa bonne humeur ; elle me vient dans l\'esprit en creusant ce sujet passionnant.
                    Contente-toi de ce que devaient surtout craindre les deux familles.
                    Onze ans passés depuis notre départ de cinq jours j\'atteignis la surface comme un seul homme de qui on n\'ait rien dit ?
                    Logique pour son temps, son argent, il est chargé d\'opérer sur le platonisme.
                    Remarque que je lui inspirais.
                    Content d\'avoir l\'oreille du guichetier ; mais celui-ci, sans me parler elle me prend les mains, calmez-vous, je vous distrairai, moi.
                    Vu le contexte, pèse lourd.
                    Vainqueur des nations les entraînaient, pour de l\'amour, au fond nous avons tous décollé à la même heure demain.
                    Ignores-tu donc, mon chéri. Stupéfaite, elle s\'avança près de la pelouse.
                    Assise près de lui sur le plancher une douzaine de bouteilles pareilles, du pain frais, du miel jaune et blanc, ne pouvait être qu\'un homme galant ?
                    Borgne et boiteux, c\'était notre ami le sénateur ? Allongé dans un fauteuil antique, j\'attends, moi...
                    Voyez-vous cette lumière parmi les arbres. Diverses variétés du poirier se greffent même plus ou moins bizarres.</div><br> <br>
                </div>';
$pdf->writeHTML($html, true, false, true, false, '');



$pdf->lastPage();
//Close and output PDF document
$pdf->Output('Recapitulatif consommation.pdf', 'D');

//============================================================+
// END OF FILE
//============================================================+