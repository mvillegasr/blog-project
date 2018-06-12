<?php
    session_start();

    $request = json_decode(file_get_contents("php://input"), true);
    
    $username = $request['clickeduser'];

    try {
        $dbh = new PDO("mysql:host=localhost;dbname=project", "root", NULL);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $dbh->prepare("SELECT blogtext FROM users WHERE username=:username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $row = $stmt->fetch();
        
    } catch (PDOException $e) {
        exit($e->getMessage());
    }

    $response = array('result' => 'success', 'blog' => $row['blogtext']);
    
    print(json_encode($response)); 
?> 