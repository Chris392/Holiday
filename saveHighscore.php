

<?php

include "functions.php";

$points = $_POST['score'];

$addquery = "INSERT INTO scores VALUES (?,?)";

$getTop5query = "SELECT * FROM scores ORDER BY points DESC LIMIT 5";

$sth = $dbh->prepare($addquery);

$executed = $sth->execute(array('anonymous', $points));


$sth = $dbh->prepare($getTop5query);
$sth->execute();
$data = $sth->fetchAll();

echo json_encode($data);
?>

