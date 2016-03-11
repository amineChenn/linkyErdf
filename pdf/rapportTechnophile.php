<?php

// create new PDF document
include_once('tcpdf/tcpdf.php');
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT,true, 'UTF-8', false);

// set document information
$pdf->SetCreator('TCPDF');
$pdf->SetAuthor('ERDF');
$pdf->SetTitle('Suivi de consommation Technophile');
$pdf->SetSubject('Suivi de consommation');

// set default header data
$pdf->SetHeaderData('linky.jpg', 30, 'Suivi de consommation', "Recapitulatif\nwww.erdf.fr", array(2,64,128));

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



// HTML content
$html = '<div style="text-align:center; color: #33CC33"><h1> Puissance consomm�e</h1></div>';
$pdf->writeHTML($html, true, false, true, false, '');

//Variables
$heurePleinesEnergie = 10;
$heureCreusesEnergie = 200;


//SVG image
$pdf->ImageSVG($file='img/img.svg', $x=25, $y=70, $w='', $link='', $h='', $palign='', $border=1, $fitonpage=false);

//end of page
$pdf->lastPage();

//add new page
$pdf->AddPage();


$html = '<div style="text-align:center; color: #33CC33"><h1> Energie consomm�e</h1></div>';
$pdf->writeHTML($html, true, false, true, false, '');


$pdf->ImageSVG($file='img/imgTechnophile2.svg', $x=25, $y=70, $w='', $link='', $h='', $palign='', $border=1, $fitonpage=false);

$pdf->lastPage();
$pdf->AddPage();
$html = '<div class="col-md-12" style="font-size: 14px;">
                    <div style="text-align:center; color: #33CC33"> <h1>Explications sur le projet</h1></div>
                    <div style="text-align:center; color: #33CC33"> <h3>Qui sommes-nous ?</h3></div>
                    <div style="text-align: justify">Nous sommes un groupe d’étudiant en formation M2 Miage, option énergie.
                    Dans le cadre de nos études, nous avons réalisé ce projet de Septembre 2015 à Mars 2016.</div>
                    <div style="text-align:center; color: #33CC33"> <h3>Qui nous a soutenus et accompagné ?</h3></div>
                    <div style="text-align: justify">
                    Les enseignants et le personnel administratif de l’UFR IM2AG de l’Université Grenoble Alpes.<br>

                    Le FabLab du campus universitaire de Saint Martin D’Hères.<br>

                    La société ERDF pour nous avoir prêté un compteur Linky.<br>

                    La société Respawnsive.<br>
                    </div>

                    <div style="text-align:center; color: #33CC33"> <h3>Informations techniques</h3></div>
                    <div style="text-align: justify">
                    Le projet s’est déroulé en quatre grandes étapes, en parallèle de nos études en alternance (trois semaines au travail, une semaine en cours) :
                    <ul>
                    <li>analyse du contexte et des besoins, rédaction du cahier des charges</li>
                    <li>établissement des spécifications et des maquettes</li>
                    <li>deux semaines de développement</li>
                    <li>recette et soutenance du projet</li>
                    </ul>

                    Du 1er au 12 février 2016, nous avons travaillé à temps plein sur le développement du projet. Ces deux semaines ont été planifiées en détails. Nous avions prévus du temps pour créer un simulateur de Linky, et également pour essayer de décoder la trame. Ces efforts ont payé, car c’est à la fin de la première journée que nous avons réussi à décoder la trame.

                    Voici à quoi ressemble une trame de Linky :<br>

                                   <i> ADSC 041067011188 2<br>
                                    VTIC 01 I<br>
                                    DATE e100730004737 ^<br>
                                    NGTF BASE < <br>
                                    LTARF BASE F <br>
                                    EAST 000001045 Y<br>
                                    EASF01 000001045 ,<br>
                                    EASF02 000000000 #<br>
                                    EASF03 000000000 $<br>
                                    EASF04 000000000 %<br>
                                    EASF05 000000000 &<br>
                                    EASF06 000000000 ‘<br>
                                    EASF07 000000000 (<br>
                                    EASF08 000000000 )<br>
                                    EASF09 000000000 *<br>
                                    EASF10 000000000 «<br>
                                    EASD01 000001045 *<br>
                                    EASD02 000000000 !<br>
                                    EASD03 000000000 «<br>
                                    EASD04 000000000 #<br>
                                    IRMS1 000 .<br>
                                    URMS1 242 B<br>
                                    PREF 00 ?<br>
                                    PCOUP 00 Y<br>
                                    SINST1 00000 $<br>
                                    SMAXN e100729021208 00141 =<br>
                                    SMAXN-1 e100728200134 00167 _<br>
                                    CCASN e100730003000 00000 F<br>
                                    CCASN-1 e100730000000 00000 !<br>
                                    UMOY1 E100730004000 241 !<br>
                                    STGE 000B0021 :<br>
                                    #<br>
                                    <br>
                    </i>
                    </div>
                    <div  style="text-align: justify"></div>

Nous décodons toute cette trame grâce à la documentation technique d\'ERDF. Puis nous calculons les valeurs énergétiques avant de les stocker en base de données. Une fois stockées, ce site web permet d\'afficher ces données sous forme de graphes pour une meilleure visualisation.

C\'est au cours du reste des deux semaines de développement que nous nous sommes organisés avec une équipe « web », qui s’est occupée de toute la partie Restitution, une équipe « back end », qui s’est occupée de la partie Acquisition.

Ce projet étant open source, l\'ensemble du code source est disponible ici : <a
                                href="https://github.com/achNorsys/linkyErdf"
                                target="_blank" style="color: #0b97c4">https://github.com/achNorsys/linkyErdf </a>
</div>
                </div>';
$pdf->writeHTML($html, true, false, true, false, '');



$pdf->lastPage();
//Close and output PDF document
$pdf->Output('Recapitulatif consommation.pdf', 'D');

//============================================================+
// END OF FILE
//============================================================+