package server.stocksyncbackend.controller.purches;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import server.stocksyncbackend.service.purches.CreateNewGRNService;

@RestController
@RequestMapping("/api/grn")
@RequiredArgsConstructor
public class CreateNewGRNController {

    private final CreateNewGRNService createNewGRNService;

    @GetMapping
    public String testGRN(){
        return "GRN works";
    }


}
