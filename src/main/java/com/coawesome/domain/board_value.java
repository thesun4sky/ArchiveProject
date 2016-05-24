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
public class board_value {
    private int value_id;
    private int board_id;
    private int pos1;
    private int pos2;
    private int pos3;
    private int pos4;
    private int pos5;
    private int neg1;
    private int neg2;
    private int neg3;
    private int neg4;
    private int neg5;
}
