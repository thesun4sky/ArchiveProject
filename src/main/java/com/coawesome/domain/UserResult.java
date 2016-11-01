package com.coawesome.domain;

/**
 * Created by 이호세아 on 2016-04-26.
 */

        import lombok.AllArgsConstructor;
        import lombok.Data;
        import lombok.NoArgsConstructor;

/**
 * Created by eastflag on 2016-04-25.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResult {
    private int user_id;
    private String login_id;
    private String name;
    private String sex;
    private int born;
    private String email;
    private String user_img;
    private String background_img;
    private int status;
    private String updated_time;
    private int catagory;
    private int PosNeg;
    private String message;
}
