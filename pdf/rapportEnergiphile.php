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



// HTML content
$html = '<div style="text-align:center; color: #33CC33"><h1> Energie consommée</h1></div>';
$pdf->writeHTML($html, true, false, true, false, '');



$pdf->ImageSVG($file='img/imgEnergie.svg', $x=25, $y=70, $w='', $link='', $h='', $palign='', $border=1, $fitonpage=false);

$pdf->lastPage();


//add new page
$pdf->AddPage();


$html = '<div style="text-align:center; color: #33CC33"><h1> Intensité soutirée</h1></div>';
$pdf->writeHTML($html, true, false, true, false, '');
$pdf->ImageSVG($file='img/imgIntensite.svg', $x=25, $y=70, $w='', $link='', $h='', $palign='', $border=1, $fitonpage=false);
//end of page
$pdf->lastPage();

$pdf->AddPage();


$html = '<div style="text-align:center; color: #33CC33"><h1> Tension soutirée</h1></div>';
$pdf->writeHTML($html, true, false, true, false, '');
$pdf->ImageSVG($file='img/imgTension.svg', $x=25, $y=70, $w='', $link='', $h='', $palign='', $border=1, $fitonpage=false);

$pdf->lastPage();

$pdf->AddPage();


$html = '<div style="text-align:center; color: #33CC33"><h1> Puissance apparente</h1></div>';
$pdf->writeHTML($html, true, false, true, false, '');
$pdf->ImageSVG($file='img/imgPapparente.svg', $x=25, $y=70, $w='', $link='', $h='', $palign='', $border=1, $fitonpage=false);

$pdf->lastPage();

$pdf->AddPage();


$html = '<div style="text-align:center; color: #33CC33"><h1> Puissance réactive</h1></div>';
$pdf->writeHTML($html, true, false, true, false, '');
$pdf->ImageSVG($file='img/imgPreactive.svg', $x=25, $y=70, $w='', $link='', $h='', $palign='', $border=1, $fitonpage=false);

$pdf->lastPage();

//Close and output PDF document
$pdf->Output('Recapitulatif consommation.pdf', 'D');

//============================================================+
// END OF FILE
//============================================================+