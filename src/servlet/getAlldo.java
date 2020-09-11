package servlet;

import MySQL.SQL;
import Utils.OtherUtils;
import bean.User;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/room_reservation/getAll.do")
public class getAlldo extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        OtherUtils.setRequestAndResponse(request,response);
        HashMap<String, Object> map = new HashMap<>();

        User loginUser = new User();
        if(OtherUtils.haveCookies(request)){
            OtherUtils.getCookies(loginUser,request);
            if(SQL.login(loginUser)){

                HashMap<String, Object> data = new HashMap<>();
                int size=0;

                List<Map<String, Object>> list = new ArrayList<>();

                List<Map<String, Object>> arr = SQL.getAllOrder();
                if(!arr.isEmpty()) {
                    for (Map<String, Object> order : arr) {
                        size++;
//                            order.remove("meetingName");
//                            order.remove("remarks");
//                            order.remove("timeStamp");
//                            order.remove("applicant");
//                            order.remove("tel");
//                            order.remove("status");
                        list.add(order);
                    }
                }

                data.put("size",size);
                data.put("list",list);
                map.put("data",data);
                map.put("status",0);
            }else{
                map.put("status",1);
                map.put("msg","权限不足无法查看");
            }
        }else {
            map.put("status",1);
            map.put("msg","权限不足无法查看");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getWriter(),map);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
