# room_reservation
会议室预定后端
# 计算机学院会议室预约系统_接口文档

## 首页

1. 预约list

   /tjut_sece/room_reservation/weeklist.do

   > request

   ```
   date		//"2020-09-10"   //可传可不传
   ```

   > response

   success

   ```json
   {
     "status":0,
     "data":{
       "size":2
       "list":[
       {
       "id":1,
       "room":"7-221",
       "date":"2020-09-10",
       "time":"18:00-20:00",
       "applicant":"苏栖淼",
       "tel":"18822034402",
       "status":0,
     },
     {
       "id":2,
       "room":"7-115",
       "date":"2020-09-12",
       "time":"12:00-22:00",
       "applicant":"苏栖淼",
       "tel":"18822034232",
       "status":1,
     }
       ]
     }
   }
   ```

   > 约定：status 0-未审核 1-提交申请已通过 2-申请未通过

   fail

   ```json
   {
     "status":1,
     "msg":"加载失败"
   }
   ```

## 申请页面

1. 申请list

   /tjut_sece/room_reservation/form.do

   > request

   ```json
   {
     "status":0,
     "code":6666,		//这个是验证码  验证码/tjut_sece/room_reservation/validateCode
     "data":{
       "room":"7-221",
       "date":"2020-09-10",
       "time":"18:00-20:00",
       "applicant":"苏栖淼",
       "tel":"18822034402",
       "meetingName":"上天大会",
       "remarks":"有重要人物参加"  
     }
   }
   ```

   > response

   success

   ```json
   {
     "status":0,
     "msg":"提交成功"
   }
   ```

   fail

   ```json
   {
     "status":1,
     "msg":"提交失败"
   }
   {
     "status":2,
     "msg":"验证码错误"
   }
   ```

## 管理员页面

1. 管理员登录

   /tjut_sece/room_reservation/login.do

   > request

   ```json
   account
   pwd
   ```

   > response

   success

   ```json
   {
     "status":0,
     "msg":"登录成功"
   }
   ```

   fail

   ```json
   {
     "status":1,
     "msg":"账号或密码错误"
   }
   ```

2. 审核/未审核list

   /tjut_sece/room_reservation/is_reviewed.do

   > request

   ```json
   status(deafult=0)
   ```

   > response

   success

   ```json
   {
     "status":0,
     "data":{
       "size":2,
       "list":[
         {
           "id":1,
           "room":"7-221",
           "date":"2020-09-10",
           "time":"18:00-20:00""
     },
         {
           "id":2
           "room":"7-233"
           "date":"2020-09-12",
           "time":"18:00-20:03"
         }
       ]
     }
   }
   ```

   fail

   ```json
   {
     "status":1,
     "msg":"权限不足无法查看"
   }
   ```

3. 申请详细list

   /tjut_sece/room_reservation/form_detail.do

   > request

   ```json
   id
   ```

   > response

   success

   ```json
   {
     "status":0,
     "data":{
       "id":1,
       "room":"7-221",
       "date":"2020-09-10",
       "time":"18:00-20:00",
       "applicant":"苏栖淼",
       "tel":"18822034402",
       "meetingName":"上天大会",
       "remarks":"有重要人物参加",
       "timeStamp":"2020-09-10-22:11:23",
       "status":1
     }
   }
   ```

   fail

   ```json
   {
     "status":1,
     "msg":"加载失败"
   }
   {//新增加的
     "status":2,
     "msg":"权限不足无法查看"
   }
   ```

4. 管理员修改状态

/tjut_sece/room_reservation/change_state.do

> request

```json
id
status
```

> response

success

```json
{
  "status":0,
  "msg":"修改成功"
}
```

fail

```json
{
  "status":1,
  "msg":"修改失败"
}
{
  "status":2,
  "msg":"权限不足无法修改"
}
```



