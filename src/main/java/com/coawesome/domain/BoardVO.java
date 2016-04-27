package com.coawesome.domain;

/**
 * Created by 이호세아 on 2016-04-26.
 */

        import lombok.Data;

/**
 * Created by eastflag on 2016-04-25.
 */
@Data
public class BoardVO {
    private int board_id;
    private int user_id;
    private String title;
    private String content;
    private String created;
    private String updated;
}
