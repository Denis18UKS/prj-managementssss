<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Авторизация</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/sign.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src='scripts/login.js' defer></script>
</head>

<body>
    <div class="container">
        <section class="sign-in">

            <form class="form" id="login" action="" method="post">
                <h1 class="title">Авторизация</h1>
                <div class="form__item">
                    <label for="email">Email</label>
                    <input name="email" type="email" id="email" placeholder="Введите email" required>
                </div>
                <div class="form__item">
                    <label for="password">Пароль</label>
                    <input name="password" type="password" id="password" placeholder="Введите пароль" required>
                </div>
                <button type="submit" class="form__btn">Авторизоваться</button>
            </form>


            <div class="background__img sign-in">
                <div class="blur">
                    <div class="blur__stars">
                        <img src="images/star.png" alt="">
                        <img src="images/star.png" alt="">
                        <img src="images/star.png" alt="">
                        <img src="images/star.png" alt="">
                        <img src="images/star.png" alt="">
                    </div>
                    <p class="blur__text">Инструмент для управления панелью управления значительно упростил наше
                        управление задачами. Назначение, отслеживание и выполнение задач никогда не было так легко!
                    </p>
                    <div class="blur__author">Кэтрин Мёрфи</div>
                    <div class="blur__position">Координатор по маркетингу</div>
                </div>
            </div>
        </section>
    </div>
</body>

</html>