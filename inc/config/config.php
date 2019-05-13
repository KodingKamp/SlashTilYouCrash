<?php

define('DSN', 'mysql:host=localhost; dbname=game');
define('DB_USER', 'root');
define('DB_PASS', '');

$db_options = array(
    PDO::ATTR_PERSISTENT => true,
);