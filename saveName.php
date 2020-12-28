<?php
include "functions.php";

$name = $_POST['name'];
$score = $_POST['score'];

$updatenamequery = "UPDATE scores SET name = ? WHERE points = ? AND name = 'anonymous'";

$sth = $dbh->prepare($updatenamequery);

$executed = $sth->execute(array($name, $score));

if(isset($executed)){
    echo "true";
}else{
    echo "error";
}

?>