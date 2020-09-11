let getDate;
$(document).ready(function(){
    $.ajax({
        type: 'post',
        url: 'room_reservation/weeklist.do',
        data: {
        
        },
        dataType: 'json',
        success: function (data) {
            for(let i=0; i<7; i++){
                let tr = '<li>'+data.week[i]+'</li>'
                $(".mmp").append(tr)
            }
            getDate = data.date
            setTable()
            for(let i=0; i<data.data.size; i++){
                let color;
                if(data.data.list[i].status == 0){
                    color = "yellow"
                }else if(data.data.list[i].status == 1){
                    color = "green"
                }else{
                    color = "red"
                }
                let tr = '<h6 class=\"'+color+'\">'+data.data.list[i].applicant+" "+data.data.list[i].time+'</h6>'
                let k = "#"+data.data.list[i].room+data.data.list[i].date+""
                $(k).append(tr)
            }
        }
    })
    $(".back_home").click(function(){
        $(".home").css("display","block");
        $(".post_page").css("display","none");
    })
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
        var room = $("#post_room").text();
        var date = $("#post_day").text();
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
    $("#sign").click(function () {
        window.location.href="login.html"
    })
})
var room = ["221","208","502B","411","106"]
function setTable(){
    for(let i=0; i<5; i++){
        for(let j=0; j<7; j++){
            let tr = '<li>'+room[i]+'<div class=\"popup\"><span><h3>'+room[i]+' 申请记录</h3><a id=\"'+room[i]+getDate[j]+'\"></a><button class=\"btn btn-default\" href=\"#\" role=\"button\" onclick=\"clickUp('+'\''+room[i]+'\''+','+'\''+getDate[j]+'\''+')\">申请使用</button></span></li>'
            $(".rss").append(tr);
        }
    }
    for(let i=10; i<60; i++){
        let tr = '<option value=\"'+i+'\">'+i+'</option>';
        $("#starM").append(tr);
        $("#endM").append(tr);
    }
}
function clickUp(room,date){
    $(".home").css("display","none");
    $(".post_page").css("display","block");
    $("#post_room").text(room);
    $("#post_day").text(date);
}
function changeCode() {
    $("#verifyCode-img").attr("src","room_reservation/validateCode?time="+new Date().getTime());
}
