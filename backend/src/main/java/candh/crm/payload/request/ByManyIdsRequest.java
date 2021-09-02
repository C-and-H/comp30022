package candh.crm.payload.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

public class ByManyIdsRequest
{
    private List<String> ids;
}
