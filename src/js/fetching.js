



$(document).ready(function(){
    console.log("fetchingjs");
    console.log($(".sendtrend"));
    $(".sendtrend").submit(function(e) { //устанавливаем событие отправки для формы с id=form
        e.preventDefault();
        var form_data = $(this).serialize(); //собераем все данные из формы
        console.log(form_data);
        $.ajax({
            type: "POST", //Метод отправки
            dataType: 'json', // тип ожидаемых данных в ответе
            url: "core/trends.php", //путь до php фаила отправителя
            data: form_data,
            success: function(otvet) {
                //alert(otvet);
                console.log(otvet);

                if (otvet == 'Письмо отправлено. Через 5 секунд мы вернем вас назад!') {
                    $(".call-back-form").trigger("reset");
                    alert("Спасибо!", "Ваше письмо успешно отправлено!");
                }
                else {
                    alert("Ошибка", "Заполните ВСЕ поля");
                }
            }
        });
    });
});