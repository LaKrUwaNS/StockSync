package server.stocksyncbackend.utils.exception;

public class UnacceptedOrderException extends RuntimeException {
    public UnacceptedOrderException(String message) {
        super(message);
    }
}
