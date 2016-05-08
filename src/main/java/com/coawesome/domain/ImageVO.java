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
public class ImageVO {
    private int id;
    private int board_id;
    private String original_file_name;
    private String stored_file_name;
    private long file_size;
    private String created_date;
    private int creator_id;
}
