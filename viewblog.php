<?php
    session_start();
    try {
        $dbh = new PDO("mysql:host=localhost;dbname=project", "root", NULL);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $dbh->prepare("SELECT blogtext FROM users WHERE username = :username");
        $stmt->bindParam(':username', $_GET['u']);
        $stmt->execute();
        $row = $stmt->fetch();
        $blogtext = $row["blogtext"];
        print $blogtext;
        
    } catch (PDOException $e) {
        exit($e->getMessage());
    }
   
?> 