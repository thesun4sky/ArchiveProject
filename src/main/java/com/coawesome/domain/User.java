package com.coawesome.domain;

/**
 * Created by 이호세아 on 2016-04-26.
 */

        import lombok.Data;

/**
 * Created by eastflag on 2016-04-25.
 */
@Data
public class User {
    private int user_id;
    private int friend_id;
    private String login_id;
    private String password;
    private String name;
    private String sex;
    private int born;
    private String email;
    private String user_img;
    private String background_img;
    private String updated_time;
}
