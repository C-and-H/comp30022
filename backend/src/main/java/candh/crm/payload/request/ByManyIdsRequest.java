package candh.crm.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

public class ByManyIdsRequest
{
    @NotBlank
    private String[] ids;
}
