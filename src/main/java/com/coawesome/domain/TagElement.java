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
@NoArgsConstructor
@AllArgsConstructor
public class TagElement {
    private int user_id;
    private int board_id;
    private int catagory;
    private String tag;
    private String tag_img;
    private String stored_file_name;
    private String background_img;
}
