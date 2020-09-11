$(document).ready(function () {
    $("#bttn").click(function () {
        var account = $("#inname").val();
        var pwd = $("#inPassword").val();
        console.log(account+pwd);
        $.ajax({
            type: 'post',
            url: 'room_reservation/login.do',
            data: {
                account:account,
                pwd: pwd},
            dataType: 'json',
            success: function (data) {
                if (data.status == 0) {
                    window.location.href="admin.html"
                } else {
                    $("#inputPassword3").val("");
                    $("#warning").css("display", "block");
                }
            }
        })
    })

})
