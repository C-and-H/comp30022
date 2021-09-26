package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class SketchySearchRequest
{
    @NotNull
    private String searchKey;
}
