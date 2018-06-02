<?php
    session_start();
    
    $request = json_decode(file_get_contents("php://input"), true);
    
    $username = $request['username'];
    $password = $request['password'];
    
    if (is_null($username) || is_null($password)) {
        $response = array('result' => 'error', 'msg' => 'invalid request');
        print(json_encode($response));
        exit();
    }
    
    try {
        $dbh = new PDO("mysql:host=localhost;dbname=project", "root", NULL);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $dbh->prepare("SELECT password, blogtext FROM users WHERE username=:username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            $response = array('result' => 'failure');
            print(json_encode($response));
            exit();
        }
        $row = $stmt->fetch();
        $actual_password = $row["password"];
        if ($password != $actual_password) {
            $response = array('result' => 'failure');
            print(json_encode($response));
            exit();
        }
    } catch (PDOException $e) {
        $response = array('result' => 'error', 'msg' => $e->getMessage());
        print(json_encode($response));
        exit();
    }
    
    $_SESSION['username'] = $username;
    
    $blogText = $row["blogtext"];
    
    $response = array('result' => 'success', 'blogText' => $blogText);
    print(json_encode($response)); 
?>