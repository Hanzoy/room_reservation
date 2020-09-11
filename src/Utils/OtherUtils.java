package Utils;

import bean.Order;
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
     * ���ñ���ͷ
     *
     * @param request
     * @param response
     */
    public static void setRequestAndResponse(HttpServletRequest request, HttpServletResponse response) {
        try {
            request.setCharacterEncoding("utf-8");
        } catch (UnsupportedEncodingException e) {
        }
        response.setCharacterEncoding("utf-8");
        response.setHeader("content-type", "text/html;charset=utf-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setContentType("text/html;charset=utf-8");
    }

    /**
     * ֱ����ȡrequest
     *
     * @param t
     * @param request
     * @param <T>
     */
    public static <T> void getRequest(T t, HttpServletRequest request) throws IOException, ServletException {

        Map<String, String[]> requestMap = request.getParameterMap();
        try {
            BeanUtils.populate(t, requestMap);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    /**
     * ��ȡ���7��ʱ���ַ���
     *
     * @return
     */
    public static List<String> getTimes() {
        List<String> list = new ArrayList<String>();
        SimpleDateFormat sdf = new SimpleDateFormat();// ��ʽ��ʱ��
        sdf.applyPattern("yyyy-MM-dd");// aΪam/pm�ı��
        Date date = new Date();// ��ȡ��ǰʱ��
        //System.out.println("����ʱ�䣺" + sdf.format(date)); // ����Ѿ���ʽ��������ʱ�䣨24Сʱ�ƣ�
        list.add(sdf.format(date));
        for (int i = 0; i < 6; i++) {
            Calendar calendar = new GregorianCalendar();
            calendar.setTime(date);
            calendar.add(calendar.DATE, 1); //��������������һ��,����  ������,������ǰ�ƶ�
            date = calendar.getTime(); //���ʱ���������������һ��Ľ��
            list.add(sdf.format(date));
        }
        return list;
    }
    public static List<String> getMoreTimes(int n) {
        List<String> list = new ArrayList<String>();
        SimpleDateFormat sdf = new SimpleDateFormat();// ��ʽ��ʱ��
        sdf.applyPattern("yyyy-MM-dd");// aΪam/pm�ı��
        Date date = new Date();// ��ȡ��ǰʱ��
        //System.out.println("����ʱ�䣺" + sdf.format(date)); // ����Ѿ���ʽ��������ʱ�䣨24Сʱ�ƣ�
        list.add(sdf.format(date));
        for (int i = 0; i < n; i++) {
            Calendar calendar = new GregorianCalendar();
            calendar.setTime(date);
            calendar.add(calendar.DATE, 1); //��������������һ��,����  ������,������ǰ�ƶ�
            date = calendar.getTime(); //���ʱ���������������һ��Ľ��
            list.add(sdf.format(date));
        }
        return list;
    }

    /**
     * ��ȡrequest��json�ַ���
     *
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

    public static hasCodeRequest jsonToRequest(String json) {
        JSONObject jsonObject2 = new JSONObject(json);
        JSONObject jsonObject = jsonObject2.getJSONObject("data");
        return new hasCodeRequest(jsonObject2.getInt("status"), new Order(jsonObject.getString("room"), jsonObject.getString("date"), jsonObject.getString("time"), jsonObject.getString("applicant"), jsonObject.getString("tel"), jsonObject.getString("meetingName"), jsonObject.getString("remarks"), 0), jsonObject2.getString("code"));
    }

    public static void addCookie(User user, HttpServletResponse response) {

        Cookie cookieId = new Cookie("ow", user.getCipherText());
        cookieId.setMaxAge(7 * 24 * 60 * 60);
        cookieId.setPath("/");
        response.addCookie(cookieId);
    }

    public static void removeCookie(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        for (Cookie c : cookies) {
            c.setMaxAge(0);
            c.setPath("/");
            response.addCookie(c);
        }
    }

    public static void getCookies(User user, HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        for (Cookie c : cookies) {
            String name = c.getName();
            if (name.equals("ow")) {
                user.setAccount(User.cipherTextToUser(c.getValue()).getAccount());
                user.setPwd(User.cipherTextToUser(c.getValue()).getPwd());
            }
        }
    }

    public static boolean haveCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                String name = c.getName();
                if (name.equals("ow")) {
                    return true;
                }
            }
        }
        return false;
    }

    public static List<String> getWeek() {
        List<String> list1 = new ArrayList<String>();
        List<String> list2 = new ArrayList<String>();
        SimpleDateFormat sdf1 = new SimpleDateFormat();// ��ʽ��ʱ��
        sdf1.applyPattern("E(MM-dd)");
        SimpleDateFormat sdf2 = new SimpleDateFormat();// ��ʽ��ʱ��
        sdf2.applyPattern("E");
        Date theDate = new Date();
        boolean flag;
        flag = (sdf2.format(theDate).equals("Mon") || sdf2.format(theDate).equals("星期一"));
        for (int i = 0; i < 7; i++) {
            if (flag) {
                list1.add(sdf1.format(theDate));
                Calendar calendar = new GregorianCalendar();
                calendar.setTime(theDate);
                calendar.add(calendar.DATE, 1); //��������������һ��,����  ������,������ǰ�ƶ�
                theDate = calendar.getTime(); //���ʱ���������������һ��Ľ��
            } else {

                list2.add(sdf1.format(theDate));
                Calendar calendar = new GregorianCalendar();
                calendar.setTime(theDate);
                calendar.add(calendar.DATE, 1); //��������������һ��,����  ������,������ǰ�ƶ�
                theDate = calendar.getTime(); //���ʱ���������������һ��Ľ��
                flag = (sdf2.format(theDate).equals("Mon") || sdf2.format(theDate).equals("星期一"));
            }
        }
        list1.addAll(list2);
        return list1;
    }

    public static List<String> getDate() {
        List<String> list1 = new ArrayList<String>();
        List<String> list2 = new ArrayList<String>();
        SimpleDateFormat sdf1 = new SimpleDateFormat();// ��ʽ��ʱ��
        sdf1.applyPattern("yyyy-MM-dd");
        SimpleDateFormat sdf2 = new SimpleDateFormat();// ��ʽ��ʱ��
        sdf2.applyPattern("E");
        Date theDate = new Date();
        boolean flag;
        flag = (sdf2.format(theDate).equals("Mon") || sdf2.format(theDate).equals("星期一"));
        for (int i = 0; i < 7; i++) {
            if (flag) {
                list1.add(sdf1.format(theDate));
                Calendar calendar = new GregorianCalendar();
                calendar.setTime(theDate);
                calendar.add(calendar.DATE, 1); //��������������һ��,����  ������,������ǰ�ƶ�
                theDate = calendar.getTime(); //���ʱ���������������һ��Ľ��
            } else {

                list2.add(sdf1.format(theDate));
                Calendar calendar = new GregorianCalendar();
                calendar.setTime(theDate);
                calendar.add(calendar.DATE, 1); //��������������һ��,����  ������,������ǰ�ƶ�
                theDate = calendar.getTime(); //���ʱ���������������һ��Ľ��
                flag = (sdf2.format(theDate).equals("Mon") || sdf2.format(theDate).equals("星期一"));
            }
        }
        list1.addAll(list2);
        return list1;
    }
    /*public static List<String> getWeek(){
        List<String> list1 = new ArrayList<String>();
        SimpleDateFormat sdf1 = new SimpleDateFormat();// ��ʽ��ʱ��
        sdf1.applyPattern("E(MM-dd)");

        Date theDate = new Date();
        for(int i=0; i<7; i++){
                list1.add(sdf1.format(theDate));
                Calendar calendar = new GregorianCalendar();
                calendar.setTime(theDate);
                calendar.add(calendar.DATE,1); //��������������һ��,����  ������,������ǰ�ƶ�
                theDate=calendar.getTime(); //���ʱ���������������һ��Ľ��
        }
        return list1;
    }*/

    public static List<String> getTimes(String week, List<String> li) {
        List<String> list = new ArrayList<String>();
        SimpleDateFormat sdf = new SimpleDateFormat();
        SimpleDateFormat sdf2 = new SimpleDateFormat();
        SimpleDateFormat sdf3 = new SimpleDateFormat();
        sdf.applyPattern("MM-dd");
        sdf2.applyPattern("E");
        sdf3.applyPattern("yyyy-MM-dd");
        Date date = new Date();
        //System.out.println("����ʱ�䣺" + sdf.format(date)); // ����Ѿ���ʽ��������ʱ�䣨24Сʱ�ƣ�
        if (week.equals("0")) {
            while (!(sdf2.format(date).equals("Mon") || sdf2.format(date).equals("星期一"))) {
                Calendar calendar = new GregorianCalendar();
                calendar.setTime(date);
                calendar.add(calendar.DATE, -1); //把日期往后增加一天,整数  往后推,负数往前移动
                date = calendar.getTime(); //这个时间就是日期往后推一天的结果
            }
            for (int i = 0; i < 7; i++) {
                list.add(sdf.format(date));
                li.add(sdf3.format(date));
                Calendar calendar = new GregorianCalendar();
                calendar.setTime(date);
                calendar.add(calendar.DATE, 1); //把日期往后增加一天,整数  往后推,负数往前移动
                date = calendar.getTime(); //这个时间就是日期往后推一天的结果
            }
        } else if (week.equals("1")) {
            Calendar calendar = new GregorianCalendar();
            calendar.setTime(date);
            calendar.add(calendar.DATE, 1); //把日期往后增加一天,整数  往后推,负数往前移动
            date = calendar.getTime(); //这个时间就是日期往后推一天的结果
            while (!(sdf2.format(date).equals("Mon") || sdf2.format(date).equals("星期一"))) {
                calendar.setTime(date);
                calendar.add(calendar.DATE, 1); //把日期往后增加一天,整数  往后推,负数往前移动
                date = calendar.getTime(); //这个时间就是日期往后推一天的结果
            }
            list.add(sdf.format(date));
            li.add(sdf3.format(date));
            for (int i = 0; i < 6; i++) {
                calendar.setTime(date);
                calendar.add(calendar.DATE, 1); //把日期往后增加一天,整数  往后推,负数往前移动
                date = calendar.getTime(); //这个时间就是日期往后推一天的结果
                list.add(sdf.format(date));
                li.add(sdf3.format(date));
            }
        } else {
            Calendar calendar = new GregorianCalendar();
            for (int i = 0; i < 8; i++) {
                calendar.setTime(date);
                calendar.add(calendar.DATE, 1); //把日期往后增加一天,整数  往后推,负数往前移动
                date = calendar.getTime(); //这个时间就是日期往后推一天的结果
            }
            while (!(sdf2.format(date).equals("Mon") || sdf2.format(date).equals("星期一"))) {
                calendar.setTime(date);
                calendar.add(calendar.DATE, 1); //把日期往后增加一天,整数  往后推,负数往前移动
                date = calendar.getTime(); //这个时间就是日期往后推一天的结果
            }
            list.add(sdf.format(date));
            li.add(sdf3.format(date));
            for (int i = 0; i < 6; i++) {
                calendar.setTime(date);
                calendar.add(calendar.DATE, 1); //把日期往后增加一天,整数  往后推,负数往前移动
                date = calendar.getTime(); //这个时间就是日期往后推一天的结果
                list.add(sdf.format(date));
                li.add(sdf3.format(date));
            }

        }return list;
    }
}
