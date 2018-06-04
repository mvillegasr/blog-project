<?php
	session_start();

	$request = json_decode(file_get_contents("php://input"), true);
    
    $username = $request['username'];
    $password = $request['password'];

	try {
		$dbh = new PDO("mysql:host=localhost;dbname=project", "root", NULL);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $dbh->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
		$stmt->bindParam(":username", $username);
		$stmt->bindParam(":password", $password);
		$stmt->execute();
		$stmt = $dbh->prepare("SELECT blogtext FROM users WHERE username = :username");
		$stmt->bindParam(":username", $username);
		$row = $stmt->fetch();
	} catch (PDOException $e) {
		exit($e->getMessage());
	}
    
	$_SESSION['username'] = $username;

	$blogtext = $row["blogtext"];

    $response = array('result' => 'success', 'blogtext' => $blogtext);
    print(json_encode($response)); 
?>