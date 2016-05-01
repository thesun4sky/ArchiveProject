package com.coawesome;

import com.coawesome.domain.User;
import org.junit.Test;

/**
 * Created by TeaSun on 2016-04-30.
 */
public class LombokTest {
  @Test
  public void test1(){
    User user = new User();
    user.setName("Teasun");
    user.setLogin_id("123xodid");

    System.out.print(user);
  }

}
