package bean;

public class Request {
    int status;
    Order data;

    @Override
    public String toString() {
        return "Request{" +
                "status=" + status +
                ", data=" + data +
                '}';
    }

    public Request(int status, Order data) {
        this.status = status;
        this.data = data;
    }

    public Request() {
    }

    public int getStatus() {
        return status;
    }

    public Order getData() {
        return data;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setData(Order data) {
        this.data = data;
    }
}
