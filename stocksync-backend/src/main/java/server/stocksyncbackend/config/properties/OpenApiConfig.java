package server.stocksyncbackend.config.properties;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI(){
        final String SecuritySchemeName = "bearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("Stock Sync API")
                        .description("Stock Sync API")
                        .version("1.0")
                )
                .addSecurityItem(new SecurityRequirement().addList(SecuritySchemeName))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes(SecuritySchemeName ,
                                new SecurityScheme()
                                        .name(SecuritySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                ));
    }
}
