$(document).ready(function() {
    $.ajax({
        type: 'post',
        url: 'room_reservation/getName',
        data: {},
        dataType: 'json',
        success: function(data) {
            if (data.status == 0) {
                console.log(data);
                $("#admin").html(data.msg);
            } else {
                window.location.href = "login.html";
            }
        }
    })
    $.ajax({
        type: 'post',
        url: 'room_reservation/is_reviewed.do',
        data: {
            status: 0
        },
        dataType: 'json',
        success: function(data) {
            $("#boddy").html("");
            for (let i = 0; i < data.data.size; i++) {
                let stu;
                // if(data.data.list[i].status==0){
                stu = "未审核";
                // }
                let tr = "<tr onclick=\"showMore(" + data.data.list[i].id + ")\" data-toggle=\"modal\" data-target=\"#myModal2\"><td>" + (i + 1) + "</td><td>" + data.data.list[i].applicant + "</td><td>" + data.data.list[i].room + "</td><td>" + data.data.list[i].time + "</td><td>" + data.data.list[i].date + "</td><td>" + data.data.list[i].remarks + "</td><td>" + stu + "</td><td><div class=\"PublicTableBtnIcon Color3Btn \" onclick=\"agree(" + data.data.list[i].id + ")\"><span>同意</span></div><div class=\"PublicTableBtnIcon Color5Btn \" onclick=\"deny(" + data.data.list[i].id + ")\"><span>驳回</span></div><div class=\"PublicTableBtnIcon Color4Btn \" onclick=\"dele(" + data.data.list[i].id + ")\"><span>取消</span></div></td></tr>"
                $("#boddy").append(tr);
            }
        }
    })
    $("#s1").click(function() {
        $("#s1").attr("class", "Select");
        $("#s2").attr("class", "");
        $("#s3").attr("class", "");
        $(".InquireTableBox").css("display", "block");
        $("#boddy").html("");
        $(".InquireTableBox2").css("display", "none");

        $.ajax({
            type: 'post',
            url: 'room_reservation/is_reviewed.do',
            data: {
                status: 0
            },
            dataType: 'json',
            success: function(data) {
                $("#boddy").html("");
                for (let i = 0; i < data.data.size; i++) {
                    let stu;
                    // if(data.data.list[i].status==0){
                    stu = "未审核";
                    // }
                    let tr = "<tr onclick=\"showMore(" + data.data.list[i].id + ")\" data-toggle=\"modal\" data-target=\"#myModal2\"><td>" + (i + 1) + "</td><td>" + data.data.list[i].applicant + "</td><td>" + data.data.list[i].room + "</td><td>" + data.data.list[i].time + "</td><td>" + data.data.list[i].date + "</td><td>" + data.data.list[i].remarks + "</td><td>" + stu + "</td><td><div class=\"PublicTableBtnIcon Color3Btn \" onclick=\"agree(" + data.data.list[i].id + ")\"><span>同意</span></div><div class=\"PublicTableBtnIcon Color5Btn \" onclick=\"deny(" + data.data.list[i].id + ")\"><span>驳回</span></div><div class=\"PublicTableBtnIcon Color4Btn \" onclick=\"dele(" + data.data.list[i].id + ")\"><span>取消</span></div></td></tr>"
                    $("#boddy").append(tr);
                }
            }
        })
    })
    $("#s2").click(function() {
        $("#s1").attr("class", "");
        $("#s2").attr("class", "Select");
        $("#s3").attr("class", "");
        $(".InquireTableBox").css("display", "block");
        $("#boddy").html("");
        $(".InquireTableBox2").css("display", "none");
        $.ajax({
            type: 'post',
            url: 'room_reservation/getAll.do',
            data: {},
            dataType: 'json',
            success: function(data) {
                $("#boddy").html("");
                for (let i = 0; i < data.data.size; i++) {
                    let stu;
                    if (data.data.list[i].status == 0) {
                        stu = "未审核";
                    } else if (data.data.list[i].status == 1) {
                        stu = "已通过";
                    } else if (data.data.list[i].status == 2) {
                        stu = "已驳回";
                    }
                    let tr = "<tr onclick=\"showMore(" + data.data.list[i].id + ")\" data-toggle=\"modal\" data-target=\"#myModal2\"><td>" + (i + 1) + "</td><td>" + data.data.list[i].applicant + "</td><td>" + data.data.list[i].room + "</td><td>" + data.data.list[i].time + "</td><td>" + data.data.list[i].date + "</td><td>" + data.data.list[i].remarks + "</td><td>" + stu + "</td><td><div class=\"PublicTableBtnIcon Color3Btn \" onclick=\"agree(" + data.data.list[i].id + ")\"><span>同意</span></div><div class=\"PublicTableBtnIcon Color5Btn \" onclick=\"deny(" + data.data.list[i].id + ")\"><span>驳回</span></div><div class=\"PublicTableBtnIcon Color4Btn \" onclick=\"dele(" + data.data.list[i].id + ")\"><span>取消</span></div></td></tr>"
                    $("#boddy").append(tr);
                }
            }
        })
    })
    $("#s3").click(function() {
        $("#s1").attr("class", "");
        $("#s2").attr("class", "");
        $("#s3").attr("class", "Select");
        $(".InquireTableBox").css("display", "none");
        $(".InquireTableBox2").css("display", "block");

    })
    $("#bttn").click(function() {
        var pwd = $("#npwd").val();
        var pwd2 = $("#npwd2").val();
        if (pwd == "") {
            alert("新密码不能为空");
        } else if (pwd == pwd2) {
            $.ajax({
                type: 'post',
                url: '/room_reservation/change_pwd.do',
                data: {
                    npwd: pwd
                },
                dataType: 'json',
                success: function(data) {
                    if (data.status == 0) {
                        $.ajax({
                            type: 'post',
                            url: 'remove',
                            data: {},
                            dataType: 'json',
                            success: function(data) {}
                        })
                        window.location.href = "login.html"
                    } else {
                        alert("修改失败")
                        window.location.href = "login.html"
                    }
                }
            })
        } else {
            alert("请确保两次密码相同");
        }
    })
    $(".out").click(function() {
        $.ajax({
            type: 'post',
            url: 'remove',
            data: {},
            dataType: 'json',
            success: function(data) {}
        })
        window.location.href = "login.html"
    })
    $("#chaxun").click(function() {
        $.ajax({
            type: 'post',
            url: 'mohu',
            data: {
                data: $("#selectID").val()
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if (data.status == 0) {
                    $("#boddy").html("")
                    for(let i=0; i<data.data.length; i++){
                        let stu;
                        if (data.data[i].status == 0) {
                            stu = "未审核";
                        } else if (data.data[i].status == 1) {
                            stu = "已通过";
                        } else if (data.data[i].status == 2) {
                            stu = "已驳回";
                        }

                        let tr = "<tr onclick=\"showMore(" + data.data[i].id + ")\" data-toggle=\"modal\" data-target=\"#myModal2\"><td>" + i + "</td><td>" + data.data[i].applicant + "</td><td>" + data.data[i].room + "</td><td>" + data.data[i].time + "</td><td>" + data.data[i].date + "</td><td>" + data.data[i].remarks + "</td><td>" + stu + "</td><td><div class=\"PublicTableBtnIcon Color3Btn \" onclick=\"agree(" + data.data[i].id + ")\"><span>同意</span></div><div class=\"PublicTableBtnIcon Color5Btn \" onclick=\"deny(" + data.data[i].id + ")\"><span>驳回</span></div><div class=\"PublicTableBtnIcon Color4Btn \" onclick=\"dele(" + data.data[i].id + ")\"><span>取消</span></div></td></tr>"
                        $("#boddy").append(tr);
                    }
                } else {
                    alert("查询失败");
                }

            }
        })
    })
    $("#home").click(function() {
        window.location.href = "index.html"
    })
})

function agree(id) {
    window.location.reload();
    $.ajax({
        type: 'post',
        url: 'room_reservation/change_state.do',
        data: {
            id: id,
            status: 1
        },
        dataType: 'json',
        success: function(data) {
            if (data.status == 0) {
                window.location.reload();
            }
        }
    })
}

function deny(id) {
    window.location.reload();
    $.ajax({
        type: 'post',
        url: 'room_reservation/change_state.do',
        data: {
            id: id,
            status: 2
        },
        dataType: 'json',
        success: function(data) {
            if (data.status == 0) {
                window.location.reload();
            }
        }
    })
}

function dele(id) {
    window.location.reload();
    $.ajax({
        type: 'post',
        url: 'room_reservation/change_state.do',
        data: {
            id: id,
            status: 3
        },
        dataType: 'json',
        success: function(data) {
            if (data.status == 0) {
                window.location.reload();
            }
        }
    })
}

function showMore(id) {
    $.ajax({
        type: 'post',
        url: 'room_reservation/form_detail.do',
        data: {
            id: id
        },
        dataType: 'json',
        success: function(data) {
            if (data.status == 0) {
                $("#room").val(data.data.room);
                $("#applicant").val(data.data.applicant);
                $("#time").val(data.data.time);
                $("#tel").val(data.data.tel);
                $("#date").val(data.data.date);
                $("#remarks").val(data.data.remarks);
                if (data.data.status == 0) {
                    $("#status").val("未审核");
                } else if (data.data.status == 1) {
                    $("#status").val("已通过");
                } else if (data.data.status == 2) {
                    $("#status").val("已驳回");
                }

                showCon();
            }
        }
    })
}

function showCon() {
    $(".cov").show();
}

function closeCon() {
    $(".cov").hide();
}