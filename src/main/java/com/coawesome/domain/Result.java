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
public class Result {
    private int result;
    private String msg;
}
