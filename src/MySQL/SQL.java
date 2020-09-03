package MySQL;

import bean.Order;
import bean.User;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class SQL {
    public static JdbcTemplate jdbcTemplate;
    static{
        jdbcTemplate = new JdbcTemplate(JDBCUtils.getDataSource());
    }
    public static void insertOrder(Order order){
        String sql = "insert into theOrder(room,date,time,applicant,tel,meetingName,remarks,status) values(?,?,?,?,?,?,?,?)";
        jdbcTemplate.update(sql,order.getRoom(),order.getDate(),order.getTime(),order.getApplicant(),order.getTel(),order.getMeetingName(),order.getRemarks(),order.getStatus());
    }


    public static List<Map<String,Object>> getOrderByDate(String date){
        try {
            String sql = "select * from theOrder where date = ?";
            List<Map<String, Object>> arr = jdbcTemplate.queryForList(sql,date);
            return arr;
        }catch (DataAccessException e){
            return null;
        }
    }

    public static List<Map<String, Object>> getTimeByRoomAndDate(String room,String date){
        try {
            String sql = "select time from theOrder where room = ? AND date = ? AND (status = 0 OR status = 1 )";
            List<Map<String, Object>> arr = jdbcTemplate.queryForList(sql,room,date);
            return arr;
        }catch (DataAccessException e){
            return null;
        }
    }

    public static boolean login(User loginUser){
        try{
            String sql = "select * from user where account = ? AND pwd = ?";
            User user = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class),loginUser.getAccount(),loginUser.getPwd());
            if(user!=null) return true;
            else return false;
        }catch (DataAccessException e){
            return false;
        }
    }

    public static List<Map<String,Object>> getOrderByDateAndStatus(String date, int status){
        try {
            String sql = "select * from theOrder where date = ? AND status = ?";
            List<Map<String, Object>> arr = jdbcTemplate.queryForList(sql,date,status);
            return arr;
        }catch (DataAccessException e){
            return null;
        }
    }

    public static Map<String,Object> getOrderById(int id){
        try{
            String sql = "select * FROM theOrder where id = ?";
            Map<String,Object> map = jdbcTemplate.queryForMap(sql,id);
            return map;
        }catch (DataAccessException e){
            return null;
        }
    }

    public static boolean upDataStatusById(int id,int status) throws DataAccessException {
        Map<String,Object> map = null;
        try{
            String sql = "select * FROM theOrder where id = ?";
            map = jdbcTemplate.queryForMap(sql,id);
        }catch (DataAccessException e){
            map = null;
        }
        if(map == null){
            return false;
        }else {
            String sql = "update theOrder set status = ? where id = ?";
            jdbcTemplate.update(sql,status,id);
            return true;
        }
    }
}
