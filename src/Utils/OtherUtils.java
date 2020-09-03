package Utils;

import bean.Order;
import bean.Request;
import bean.User;
import bean.hasCodeRequest;
import org.apache.commons.beanutils.BeanUtils;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.*;

public class OtherUtils {
    /**
     * 设置标题头
     * @param request
     * @param response
     */
    public static void setRequestAndResponse(HttpServletRequest request, HttpServletResponse response){
        try {
            request.setCharacterEncoding("utf-8");
        } catch (UnsupportedEncodingException e) {
        }
        response.setCharacterEncoding("utf-8");
        response.setHeader("content-type","text/html;charset=utf-8");
        response.setHeader("Access-Control-Allow-Origin","*");
        response.setContentType("text/html;charset=utf-8");
    }

    /**
     * 直接拿取request
     * @param t
     * @param request
     * @param <T>
     */
    public static <T> void getRequest(T t, HttpServletRequest request) throws IOException, ServletException {

        Map<String,String[]> requestMap = request.getParameterMap();
        try {
            BeanUtils.populate(t,requestMap);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取今后7天时间字符串
     * @return
     */
    public static List<String> getTimes(){
        List<String> list = new ArrayList<String>();
        SimpleDateFormat sdf = new SimpleDateFormat();// 格式化时间
        sdf.applyPattern("yyyy-MM-dd");// a为am/pm的标记
        Date date = new Date();// 获取当前时间
        //System.out.println("现在时间：" + sdf.format(date)); // 输出已经格式化的现在时间（24小时制）
        list.add(sdf.format(date));
        for(int i=0; i<6; i++){
            Calendar calendar = new GregorianCalendar();
            calendar.setTime(date);
            calendar.add(calendar.DATE,1); //把日期往后增加一天,整数  往后推,负数往前移动
            date=calendar.getTime(); //这个时间就是日期往后推一天的结果
            list.add(sdf.format(date));
        }
        return list;
    }

    /**
     * 获取request的json字符串
     * @param request
     * @return
     * @throws IOException
     */
    public static String getJsonString(HttpServletRequest request) throws IOException {
        StringBuffer sb = new StringBuffer();
        BufferedReader br = new BufferedReader(
                new InputStreamReader((ServletInputStream) request.getInputStream(), "utf-8"));
        String temp;
        while ((temp = br.readLine()) != null) {
            sb.append(temp);
        }
        br.close();
        return sb.toString();
    }

    public static hasCodeRequest jsonToRequest(String json){
        JSONObject jsonObject2 = new JSONObject(json);
        JSONObject jsonObject = jsonObject2.getJSONObject("data");
        return new hasCodeRequest(jsonObject2.getInt("status"),new Order(jsonObject.getString("room"),jsonObject.getString("date"),jsonObject.getString("time"),jsonObject.getString("applicant"),jsonObject.getString("tel"),jsonObject.getString("meetingName"),jsonObject.getString("remarks"),0),jsonObject2.getString("code"));
    }

    public static void addCookie(User user, HttpServletResponse response){

        Cookie cookieId = new Cookie("ow",user.getCipherText());
        cookieId.setMaxAge(7*24*60*60);
        cookieId.setPath("/");
        response.addCookie(cookieId);
    }

    public static void getCookies(User user, HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        for (Cookie c: cookies) {
            String name = c.getName();
            if(name.equals("ow")){
                user.setAccount(User.cipherTextToUser(c.getValue()).getAccount());
                user.setPwd(User.cipherTextToUser(c.getValue()).getPwd());
            }
        }
    }

    public static boolean haveCookies(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        if(cookies!=null){
            for (Cookie c: cookies) {
                String name = c.getName();
                if(name.equals("ow")){
                    return true;
                }
            }
        }
        return false;
    }

}
