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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/mohu")
public class mohu extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        OtherUtils.setRequestAndResponse(request,response);
        HashMap<String, Object> map = new HashMap<>();

        User loginUser = new User();
        if(OtherUtils.haveCookies(request)){
            OtherUtils.getCookies(loginUser,request);
            if(SQL.login(loginUser)){
                boolean flag = true;
                String data = request.getParameter("data");
                if(data == null){
                    flag = false;
                }else{
                    List<Map<String, Object>> order = SQL.getOrderByAny(data);
                    if(order == null){
                        flag = false;
                    }else {
                        map.put("status",0);
                        map.put("data",order);
                    }
                }
                if(!flag){
                    map.put("status",1);
                    map.put("msg","加载失败");
                }
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
