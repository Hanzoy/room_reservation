package servlet;

import MySQL.SQL;
import Utils.OtherUtils;
import bean.Order;
import bean.TheTime;
import bean.hasCodeRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ����ҳ��
 */
@WebServlet("/room_reservation/form.do")
public class formdo extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        OtherUtils.setRequestAndResponse(request,response);
        HashMap<String, Object> map = new HashMap<>();

        HttpSession session = request.getSession();
        Object code = session.getAttribute("code");
        Order order = new Order();

        OtherUtils.getRequest(order,request);
        if(request.getParameter("code").equalsIgnoreCase((String)code)){
            List<Map<String, Object>> timeList = SQL.getTimeByRoomAndDate(order.getRoom(), order.getDate());
            boolean flag;
            TheTime theTime = new TheTime(order.getTime());
            flag = theTime.checkMe();
            if(timeList!=null){
                for(Map<String, Object> timeMap : timeList){
                    if(!theTime.check(new TheTime((String)timeMap.get("time")))){
                        flag = false;
                        break;
                    }
                }
            }
            if(flag){
                SQL.insertOrder(order);
                map.put("status",0);
                map.put("msg","提交成功");
            }else{
                map.put("status",1);
                map.put("msg","提交失败");
            }
        }else{
            map.put("status",2);
            map.put("msg","验证码错误");
        }



            //request


//            List<Map<String, Object>> timeList = SQL.getTimeByRoomAndDate(theRequest.getData().getRoom(), theRequest.getData().getDate());
//
//            boolean flag;
//            TheTime theTime = new TheTime(theRequest.getData().getTime());
//            flag = theTime.checkMe();
//            if(timeList!=null){
//                for(Map<String, Object> timeMap : timeList){
//                    if(!theTime.check(new TheTime((String)timeMap.get("time")))){
//                        flag = false;
//                        break;
//                    }
//                }
//            }
//            if(flag){
//                SQL.insertOrder(theRequest.getData());
//                map.put("status",0);
//                map.put("msg","�ύ�ɹ�");
//            }else{
//                map.put("status",1);
//                map.put("msg","�ύʧ��");
//            }
//        }else {
//            map.put("status",2);
//            map.put("msg","��֤�����");
//        }


        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getWriter(),map);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
