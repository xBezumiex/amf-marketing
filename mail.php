<?php
if( isset($_POST['sendmessage']) ){
    $to = $subject = $message = '';
    $to = 'amediafactor@gmail.com';
    $subject = 'Email subject';
    $message .= 'Name: ' . $_POST['name'] . "\n\n";
    $message .= 'Email: ' . $_POST['email'] . "\n\n";
    $message .= 'Message: ' . $_POST['message'] . "\n\n";
    @mail($to, $subject, $message);
    header('Location: ' . $_SERVER['HTTP_REFERER']);
	
	$f = fopen("leads.xls", "a+");
		fwrite($f," <tr>");    
		fwrite($f," <td>$message</td><td>$date / $time</td>");   
		fwrite($f," <td>$refferer</td>");    
		fwrite($f," </tr>");  
		fwrite($f,"\n ");    
		fclose($f);
    exit();
}
