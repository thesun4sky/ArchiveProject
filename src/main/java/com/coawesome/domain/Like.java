package com.coawesome.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by TeasunKim on 2016-05-12.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Like {
        int user_id;
        int board_id;
}
