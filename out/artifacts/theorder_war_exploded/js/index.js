var room, date; //传递给后端的具体数据
var week = 0; //标注当前查看的周
var rooms = ["221", "208", "502B", "411", "106"];
var dates; //获取后台的所有天数时间
$(document).ready(function() {
    week = 0;
    setTable();
    buttons();
    getOrder(week);
    $("#jq22-btn-reg").click(function(){
        var applicant = $("#applicant").val();
        var meetingName = $("#meetingName").val();
        var tel = $("#tel").val();
        var starH = $("#starH").val();
        var starM = $("#starM").val();
        var endH = $("#endH").val();
        var endM = $("#endM").val();
        var code = $("#code").val();
        var remarks = $("#remarks").val();
        // alert(applicant+":"+meetingName+":"+tel+":"+starH+":"+starM+":"+endH+":"+endM+":"+code+":"+remarks+":"+room+":"+date)
        if(applicant.length==0||meetingName.length==0||tel.length==0||starM.length==0||starH.length==0||endM.length==0||endH.length==0||code.length==0||remarks.length==0||date.length==0){
            alert("请完善信息")
        }else{
            $.ajax({
                type: 'post',
                url: 'room_reservation/form.do',
                data: {
                    status:0,
                    code:code,
                    room:room,
                    date:date,
                    time:starH+":"+starM+"-"+endH+":"+endM,
                    applicant:applicant,
                    tel:tel,
                    meetingName:meetingName,
                    remarks:remarks
                },
                dataType: 'json',
                success: function (data) {
                    if(data.status == 0){
                        alert("提交成功")
                        window.location.reload();
                    }else if(data.status == 1){
                        alert("请检查时间是否冲突")
                        changeCode()
                    }else{
                        alert("验证码错误");
                        changeCode()
                    }
                }
            })
        }
    })
    $("#u297").click(function (){
        if(week!=0){
            cleanE(week);
            week--;

        }
    })
    $("#u299").click(function (){
        if(week!=2){
            cleanP(week);
            week++;

        }
    })
    $("#sign").click(function () {
        $.ajax({
            type: 'post',
            url: 'room_reservation/getName',
            data: {},
            dataType: 'json',
            success:function(data){
                if(data.status==0){
                    window.location.href="admin.html";
                }else{
                    window.location.href="login.html";
                }
            }
        })
    })
    $("#home").click()
})
function cleanP(week) {
    $.ajax({
        type: 'post',
        url: 'room_reservation/week.do',
        data: {
            week:week
        },
        dataType: 'json',
        success: function(data) {
            if(data.status == 0){
                for(let i=0; i<data.data.size; i++){
                    let day = data.date.indexOf(data.data.list[i].date);
                    let kr = "#room"+data.data.list[i].room+"day"+day;
                    $(kr).html("");
                }
            }
            let kk;
            if((week+1)==2){
                kk="第三周";
            }else{
                kk="下一周"
            }
            $(".position5").text(kk);
            getOrder(week+1);
        }
    })
}
function cleanE(week) {
    $.ajax({
        type: 'post',
        url: 'room_reservation/week.do',
        data: {
            week:week
        },
        dataType: 'json',
        success: function(data) {
            if(data.status == 0){
                for(let i=0; i<data.data.size; i++){
                    let day = data.date.indexOf(data.data.list[i].date);
                    let kr = "#room"+data.data.list[i].room+"day"+day;
                    $(kr).html("");
                }
            }
            let kk;
            if((week-1)==0){
                kk="本周";
            }else{
                kk="下一周"
            }
            $(".position5").text(kk);
            getOrder((week-1));
        }
    })
}


function getOrder(week) {
    $.ajax({
        type: 'post',
        url: 'room_reservation/week.do',
        data: {
            week:week
        },
        dataType: 'json',
        success: function(data) {
            if(data.status == 0){
                for(let i=0; i<7; i++){
                    let kr = "#day" + (i+1);
                    $(kr).text(data.week[i]);
                }
                dates = data.date;
                for(let i=0; i<data.data.size; i++){
                    let day = data.date.indexOf(data.data.list[i].date);
                    let kr = "#room"+data.data.list[i].room+"day"+day;
                    let color_
                    if(data.data.list[i].status==0){
                        color_ = "color_yellow";
                    }else if(data.data.list[i].status==1){
                        color_ = "color_green";
                    }else if(data.data.list[i].status==2){
                        color_ = "color_red";
                    }
                    $(kr).append("<span style=\"font-size:16px; display:inline-block;\" class=\""+color_+"\">"+data.data.list[i].applicant+" "+data.data.list[i].time+" "+data.data.list[i].tel+" </span>")
                }
            }
        }
    })
}

function setTable() {
    for (let i = 10; i < 60; i++) {
        let tr = '<option value=\"' + i + '\">' + i + '</option>';
        $("#starM").append(tr);
        $("#endM").append(tr);
    }
}

function setRoomAndDate(theRoom, theDate) {
    room = rooms[theRoom];
    date = dates[theDate];
}

function buttons() {
    $("#click00").click(function() {
        setRoomAndDate(0, 0);
    })
    $("#click01").click(function() {
        setRoomAndDate(0, 1);
    })
    $("#click02").click(function() {
        setRoomAndDate(0, 2);
    })
    $("#click03").click(function() {
        setRoomAndDate(0, 3);
    })
    $("#click04").click(function() {
        setRoomAndDate(0, 4);
    })
    $("#click05").click(function() {
        setRoomAndDate(0, 5);
    })
    $("#click06").click(function() {
        setRoomAndDate(0, 6);
    })
    $("#click10").click(function() {
        setRoomAndDate(1, 0);
    })
    $("#click11").click(function() {
        setRoomAndDate(1, 1);
    })
    $("#click12").click(function() {
        setRoomAndDate(1, 2);
    })
    $("#click13").click(function() {
        setRoomAndDate(1, 3);
    })
    $("#click14").click(function() {
        setRoomAndDate(1, 4);
    })
    $("#click15").click(function() {
        setRoomAndDate(1, 5);
    })
    $("#click16").click(function() {
        setRoomAndDate(1, 6);
    })
    $("#click20").click(function() {
        setRoomAndDate(2, 0);
    })
    $("#click21").click(function() {
        setRoomAndDate(2, 1);
    })
    $("#click22").click(function() {
        setRoomAndDate(2, 2);
    })
    $("#click23").click(function() {
        setRoomAndDate(2, 3);
    })
    $("#click24").click(function() {
        setRoomAndDate(2, 4);
    })
    $("#click25").click(function() {
        setRoomAndDate(2, 5);
    })
    $("#click26").click(function() {
        setRoomAndDate(2, 6);
    })
    $("#click30").click(function() {
        setRoomAndDate(3, 0);
    })
    $("#click31").click(function() {
        setRoomAndDate(3, 1);
    })
    $("#click32").click(function() {
        setRoomAndDate(3, 2);
    })
    $("#click33").click(function() {
        setRoomAndDate(3, 3);
    })
    $("#click34").click(function() {
        setRoomAndDate(3, 4);
    })
    $("#click35").click(function() {
        setRoomAndDate(3, 5);
    })
    $("#click36").click(function() {
        setRoomAndDate(3, 6);
    })
    $("#click40").click(function() {
        setRoomAndDate(4, 0);
    })
    $("#click41").click(function() {
        setRoomAndDate(4, 1);
    })
    $("#click42").click(function() {
        setRoomAndDate(4, 2);
    })
    $("#click43").click(function() {
        setRoomAndDate(4, 3);
    })
    $("#click44").click(function() {
        setRoomAndDate(4, 4);
    })
    $("#click45").click(function() {
        setRoomAndDate(4, 5);
    })
    $("#click46").click(function() {
        setRoomAndDate(4, 6);
    })

}
function changeCode() {
    $("#verifyCode-img").attr("src","room_reservation/validateCode?time="+new Date().getTime());
}