package servlet;

import cn.dsna.util.images.ValidateCode;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

/**
 * 验证码
 */

@WebServlet("/room_reservation/validateCode")
public class validateCode extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        response.setContentType("image/jpeg");
        //禁止图像缓存。
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Access-Control-Allow-Origin","*");
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials","true");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        //180高，40宽，5个数字，50干扰线
        ValidateCode verifyCode = new ValidateCode(180,40,5,50);
        verifyCode.write(response.getOutputStream());
        String code = verifyCode.getCode();
        //将验证码保存在session中
        session.setAttribute("code", code);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
