package com.coawesome.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by TeasunKim on 2016-05-07.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Friend {
    private int user_id;
    private int friend_id;
}
