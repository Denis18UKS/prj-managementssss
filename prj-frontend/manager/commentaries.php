<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Главная</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="../styles/user.css">
    <link rel="stylesheet" href="../styles/commentaries.css">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" defer></script>
    <script src="../scripts/logout.js" defer></script>
    <script src="../scripts/commentaries.js" defer></script>
</head>

<body>
    <?php include 'manager-sidebar.php'; ?>

    <div class="container">
        <div class="projects">
            <h2 class="comment__header-title">Комментарии</h2>
            <div id="commentList" class="comment__list"></div>
        </div>
    </div>
</body>

</html>