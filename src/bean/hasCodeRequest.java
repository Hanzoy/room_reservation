package bean;

public class hasCodeRequest extends Request{
    private String code;

    public hasCodeRequest() {
    }

    public hasCodeRequest(int status, Order data, String code) {
        super(status, data);
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
