package com.coawesome.domain;

/**
 * Created by 이호세아 on 2016-04-26.
 */

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

/**
 * Created by eastflag on 2016-04-25.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardVO {
    private int board_id;
    private int user_id;
    private int public_level;
    private int likes_num;
    private int favorite_num;
    private String tag1;
    private String tag2;
    private String tag3;
    private String line1;
    private int line1_x;
    private int line1_y;
    private String line2;
    private int line2_x;
    private int line2_y;
    private int word_table_id;
    private String created;
    private ArrayList<Reply> list;
    private int catagory;
    private ArrayList<String> words;
}
