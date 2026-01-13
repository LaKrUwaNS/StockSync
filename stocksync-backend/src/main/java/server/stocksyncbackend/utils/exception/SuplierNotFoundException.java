package server.stocksyncbackend.utils.exception;

public class SuplierNotFoundException extends RuntimeException {
    public SuplierNotFoundException(String message) {
        super(message);
    }
}
