<?php
    session_start();
    try {
        $dbh = new PDO("mysql:host=localhost;dbname=project", "root", NULL);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $dbh->prepare("SELECT username FROM users");
        $stmt->execute();
        $row = $stmt->fetch();
        $username = $row["username"];
        
    } catch (PDOException $e) {
        exit($e->getMessage());
    }

    $response = array('result' => 'success', 'username' => $username);
    print(json_encode($response)); 
?> 