package com.coawesome.domain;

import lombok.Data;

/**
 * Created by TeaSun on 2016-05-04.
 */
@Data
public class Email {
  private String subject;
  private String content;
  private String receiver;
}
