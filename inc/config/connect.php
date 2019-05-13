<?php

require('config.php');

try {
    $db = new PDO(DSN, DB_USER, DB_PASS, $db_options);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo 'Successfully connected to the Game Database.';
} catch(PDOException $e) {
    echo 'An error has occured connecting to the database. ' . $e->getMessage();
}