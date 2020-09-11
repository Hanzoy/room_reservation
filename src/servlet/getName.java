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

@WebServlet("/room_reservation/getName")
public class getName extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        OtherUtils.setRequestAndResponse(request,response);
        HashMap<String, Object> map = new HashMap<>();

        User loginUser = new User();
        if(OtherUtils.haveCookies(request)){
            OtherUtils.getCookies(loginUser,request);
            if(SQL.login(loginUser)){
                map.put("status",0);
                map.put("msg",loginUser.getAccount());
            }
        }else{
            map.put("status",1);
            map.put("msg","无cookie");
        }

        OtherUtils.addCookie(loginUser,response);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getWriter(),map);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
