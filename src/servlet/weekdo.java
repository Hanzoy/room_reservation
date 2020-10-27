package servlet;

import MySQL.SQL;
import Utils.OtherUtils;
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

@WebServlet("/room_reservation/week.do")
public class weekdo extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        OtherUtils.setRequestAndResponse(request,response);
        HashMap<String, Object> map = new HashMap<>();

        HashMap<String, Object> data = new HashMap<>();
        int size=0;
        String week = request.getParameter("week");
        if(week==null){
            week = "0";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        List<String> Days = new ArrayList<>();

        List<String> weeks = OtherUtils.getTimes(week,Days);


        //=====================
        List<Map<String, Object>> allOrder = SQL.getAllOrder();
        if(allOrder == null){
            map.put("std", "数据库连接错误");
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.writeValue(response.getWriter(),map);
        }
        //=====================

        for(String day: Days){
            List<Map<String, Object>> arr = SQL.getOrderByDate(day);
            if(arr!=null&&(!arr.isEmpty())) {
                for (Map<String, Object> order : arr) {
                    size++;
                    order.remove("meetingName");
                    order.remove("remarks");
                    order.remove("timeStamp");
                    list.add(order);
                }
            }
        }
        data.put("size",size);
        data.put("list",list);
        map.put("data",data);
        map.put("status",0);
        map.put("week", weeks);
        map.put("date", Days);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getWriter(),map);

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
