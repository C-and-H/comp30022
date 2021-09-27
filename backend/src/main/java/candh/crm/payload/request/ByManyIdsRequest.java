package candh.crm.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Getter
@Setter

public class ByManyIdsRequest
{
    @NotBlank
    private List<String> ids;
}
