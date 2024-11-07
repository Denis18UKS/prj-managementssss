$(document).ready(function () {
    // Загрузка комментариев с сервера
    function loadComments() {
        $.ajax({
            url: 'http://prj-backend/comments',
            method: 'GET',
            success: function (data) {
                displayComments(data);
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при загрузке комментариев:', error);
            }
        });
    }

    // Функция отображения комментариев
    function displayComments(comments) {
        const commentsContainer = $('#commentList');
        commentsContainer.empty();

        comments.forEach(function (comment) {
            const taskTitle = comment.task ? comment.task.title : 'Неизвестная задача';
            const createdDate = new Date(comment.created_at).toLocaleDateString("ru-RU", {
                year: "numeric", month: "long", day: "numeric"
            });


            const commentCard = `
                <div class="comment-card">
                    <h3>Задача: ${taskTitle}</h3>
                    <p>Комментарий: ${comment.comment}</p>
                    <p>Создан: ${createdDate}</p>
                </div>
            `;
            commentsContainer.append(commentCard);
        });
    }

    // Инициализация
    loadComments();
});
