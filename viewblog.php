<?php
    session_start();

    try {
        $dbh = new PDO("mysql:host=localhost;dbname=project", "root", NULL);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $dbh->prepare("SELECT username, blogtext FROM users ORDER BY username");
        $stmt->execute();
        $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
    } catch (PDOException $e) {
        exit($e->getMessage());
    }

    $response = array('result' => 'success', 'size' => 0);
    foreach($row as $row) {
        $response[] = $row["username"];
        $response['size'] = $response['size'] + 1; 
    }
    print(json_encode($response)); 
?> 