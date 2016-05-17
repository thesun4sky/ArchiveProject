package com.coawesome.controller;

import com.coawesome.domain.Result;
import com.coawesome.domain.User;
import com.coawesome.persistence.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by TeasunKim on 2016-05-17.
 */
@RestController
public class UserController {

    @Autowired
    private UserMapper userMapper;

    //회원가입
    @RequestMapping(method = RequestMethod.POST, value = "/user/join")
    public Result addUser(@RequestBody User user) {
        System.out.println("user: " + user);

        userMapper.addUser(user);
        userMapper.initFriend(user); //친구리스트에 자기자신 추가

        return new Result(0, "success");
    }



    //아이디 찾기
    @RequestMapping(method = RequestMethod.POST, value = "/user/findID")
    public Result findID(@RequestBody User user) {
        System.out.println("try to find id: " + user);

        String found_id = userMapper.findID(user);
        if(found_id == null){
            System.out.println("해당하는 ID없음");
            return new Result(0, "false");
        }
        System.out.println(found_id);
        return new Result(0, found_id);
    }


    //비밀번호 찾기
    @RequestMapping(method = RequestMethod.POST, value = "/user/findPASS")
    public Result findPASS(@RequestBody User user) {
        System.out.println("try to find pass: " + user);

        String found_pass = userMapper.findPASS(user);
        if(found_pass == null){
            System.out.println("해당하는 password 없음");
            return new Result(0, "false");
        }
        System.out.println(found_pass);
        return new Result(0, found_pass);
    }

    //로그인
    @RequestMapping(method = RequestMethod.POST, value = "/user/login")
    public Result Login(@RequestBody User user) {
        System.out.println("try to login user: " + user);

        String password = userMapper.Login(user);
        String input_password = user.getPassword();
        System.out.println(password + " : " +  user.getPassword());
        if(!password.equals(input_password)) {
            return new Result(0, "fales");
        }
        return new Result(0, user.getLogin_id());
    }

}
