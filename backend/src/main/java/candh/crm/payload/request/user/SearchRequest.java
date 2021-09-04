package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchRequest
{
    private String searchKey;

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }

    public String getSearchKey() {
        return this.searchKey;
    }
}
