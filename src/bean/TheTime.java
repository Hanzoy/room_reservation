package bean;

public class TheTime {
    private int startHour;
    private int startMinute;
    private int endHour;
    private int endMinute;

    public TheTime(String time){
        startHour = new Integer(time.substring(0,2));
        startMinute = new Integer(time.substring(3,5));
        endHour = new Integer(time.substring(6,8));
        endMinute = new Integer(time.substring(9,11));
    }
    public boolean check(TheTime time){
        return ((time.endHour*60+time.endMinute)<=(this.startHour*60+this.startMinute))||((this.endHour*60+this.endMinute)<=(time.startHour*60+time.startMinute));
    }
    public boolean checkMe(){
        return (endMinute+endHour*60)>(startMinute+startHour*60);
    }

    @Override
    public String toString() {
        return "TheTime{" +
                "startHour=" + startHour +
                ", startMinute=" + startMinute +
                ", endHour=" + endHour +
                ", endMinute=" + endMinute +
                '}';
    }
}
