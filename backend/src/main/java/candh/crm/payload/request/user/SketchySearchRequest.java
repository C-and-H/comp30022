package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class SketchySearchRequest
{
    @NotBlank
    private String id;
    private String searchKey;
}
