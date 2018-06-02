<?php
    session_start();
    
    $request = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($_SESSION['username'])) {
        exit();
    }
    
    $username = $_SESSION['username'];
    $blogtext = $request['blogText'];
    
    try {
        $dbh = new PDO("mysql:host=localhost;dbname=project", "root", NULL);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $dbh->prepare("UPDATE users SET blogtext =:blogtext WHERE username=:username");
        $stmt->bindParam(':blogtext', $blogtext);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $stmt = $dbh->prepare('SELECT blogtext FROM users WHERE username=:username');
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            $response = array('error' => 'Something unknown has happened.');
            print(json_encode($response));
            exit();
        }
        $row = $stmt->fetch();
    } catch (PDOException $e) {
        $response = array('result' => 'error', 'msg' => $e->getMessage());
        print(json_encode($response));
        exit();
    }
    
    $blogText = $row["blogtext"];
    
    $response = array('result' => 'success', 'blogText' => $blogText);
    print(json_encode($response)); 
?>