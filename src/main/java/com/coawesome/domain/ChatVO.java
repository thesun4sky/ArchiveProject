package com.coawesome.domain;

/**
 * Created by 이호세아 on 2016-04-26.
 */

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * Created by eastflag on 2016-04-25.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatVO {
    private String chatName;
    private String message;
    private String user_name;
    private Date date;
}
