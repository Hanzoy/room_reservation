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

/**
 * 修改表单状态
 */

@WebServlet("/room_reservation/change_state.do")
public class change_statedo extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        OtherUtils.setRequestAndResponse(request,response);
        HashMap<String, Object> map = new HashMap<>();

        User loginUser = new User();
        if(OtherUtils.haveCookies(request)){
            OtherUtils.getCookies(loginUser,request);
            if(SQL.login(loginUser)){
                String id = request.getParameter("id");
                String status = request.getParameter("status");
                boolean flag = SQL.upDataStatusById(new Integer(id), new Integer(status));
                if(flag){
                    map.put("status",0);
                    map.put("msg","修改成功");
                }else{
                    map.put("status",1);
                    map.put("msg","修改失败");
                }
            }else{
                map.put("status",2);
                map.put("msg","权限不足无法修改");
            }
        }else {
            map.put("status",2);
            map.put("msg","权限不足无法修改");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getWriter(),map);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
}
