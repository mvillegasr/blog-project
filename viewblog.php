<?php
    session_start();
    try {
        $dbh = new PDO("mysql:host=localhost;dbname=project", "root", NULL);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $dbh->prepare("SELECT * FROM users");
        $stmt->execute();
        $row = $stmt->fetch();
        $username = $row["username"];
        $blogtext = $row["blogtext"];
        
    } catch (PDOException $e) {
        exit($e->getMessage());
    }

    $response = array('result' => 'success', 'username' => $username, 'blogtext' => $blogtext);
    print(json_encode($response)); 
?> 