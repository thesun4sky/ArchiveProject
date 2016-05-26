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
public class CloudVO {
    private String text;
    private int weight = 8;
}
