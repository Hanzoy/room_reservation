package bean;

public class Order {
    private String room;
    private String date;
    private String time;
    private String applicant;
    private String tel;
    private String meetingName;
    private String remarks;
    private int status = 0;

    public Order() {
    }

    public Order(String room, String date, String time, String applicant, String tel, String meetingName, String remarks, int status) {
        this.room = room;
        this.date = date;
        this.time = time;
        this.applicant = applicant;
        this.tel = tel;
        this.meetingName = meetingName;
        this.remarks = remarks;
        this.status = status;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public void setApplicant(String applicant) {
        this.applicant = applicant;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public void setMeetingName(String meetingName) {
        this.meetingName = meetingName;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getRoom() {
        return room;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public String getApplicant() {
        return applicant;
    }

    public String getTel() {
        return tel;
    }

    public String getMeetingName() {
        return meetingName;
    }

    public String getRemarks() {
        return remarks;
    }

    public int getStatus() {
        return status;
    }

    @Override
    public String toString() {
        return "Order{" +
                "room='" + room + '\'' +
                ", date='" + date + '\'' +
                ", time='" + time + '\'' +
                ", applicant='" + applicant + '\'' +
                ", tel='" + tel + '\'' +
                ", meetingName='" + meetingName + '\'' +
                ", remarks='" + remarks + '\'' +
                ", status=" + status +
                '}';
    }
}
