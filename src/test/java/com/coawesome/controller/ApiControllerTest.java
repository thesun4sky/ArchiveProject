package com.coawesome.controller;

import com.coawesome.domain.User;
import org.junit.Test;

/**
 * Created by TeaSun on 2016-05-02.
 */
public class ApiControllerTest {
  @Test
  public void findID() throws Exception {

    User user = new User();
    user.setName("Teasun");
    user.setLogin_id("123xodid");

    System.out.print(user);
  }

}
