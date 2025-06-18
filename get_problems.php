<?php
 require('connCesar.php');//Incluimos el archivo de conexion a la base de datos
header('Content-Type:application/json'); // indicamos que devolvemos el json


try{
    //Esta línea le dice a PDO que lance excepciones (throw Exception) si ocurre un error. 
    //Es fundamental para que el bloque try...
    //catch funcione correctamente y puedas capturar errores con claridad.
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);






        //cONSULTA PARA OBTENER LOS DATOS DE LOS ESTUDIANTES
    $stmt=$conn->query('SELECT * FROM problems');


    //fETCH ALL ASOCIATIVO
    $problems=$stmt->fetchAll(PDO::FETCH_ASSOC);

    //CONVERTIR A JSON Y DEVOLVER
    echo json_encode($problems);









} catch (PDOException $e) {
//en caso de error, devoler mensaje error en json

echo json_encode(['error'=>$e->getMessage()]);


}







?>