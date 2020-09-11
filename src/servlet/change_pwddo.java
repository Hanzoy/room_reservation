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

@WebServlet("/room_reservation/change_pwd.do")
public class change_pwddo extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        OtherUtils.setRequestAndResponse(request,response);
        HashMap<String, Object> map = new HashMap<>();

        User loginUser = new User();
        if(OtherUtils.haveCookies(request)){
            OtherUtils.getCookies(loginUser,request);
            String oldPwd = loginUser.getPwd();
            if(SQL.login(loginUser)&&oldPwd.equals(loginUser.getPwd())){
                String newOld = request.getParameter("npwd");
                SQL.upUserPwd(loginUser.getAccount(),newOld);
                map.put("status",0);
                map.put("msg","修改成功");
            }else{
                map.put("status",1);
                map.put("msg","修改失败");
            }
        }else {
            map.put("status",1);
            map.put("msg","修改失败");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getWriter(),map);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
