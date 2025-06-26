<?php
$conn= new PDO('mysql:host=localhost;dbname=soporte_tecnico', 'root', '');




if(!$conn){

    die("Coneccion failed:" . $conn->errorInfo());



}//echo "Connection Successfull";

?>                                  
