package com.coawesome.controller;

import com.coawesome.domain.*;
import com.coawesome.persistence.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by TeasunKim on 2016-05-17.
 */
@RestController
public class UserController {

    @Autowired
    private UserMapper userMapper;

    @Resource(name="fileUtils")
    private FileUtils fileUtils;
    //회원가입
    @RequestMapping(method = RequestMethod.POST, value = "/user/join")
    public Result addUser(@RequestBody User user) {
        System.out.println("user: " + user);

        userMapper.addUser(user);
        user.setUser_id(userMapper.getUserid(user));
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


    //아이디 중복 확인
    @RequestMapping(method = RequestMethod.POST, value = "/user/checkID")
    public Result checkID(@RequestBody User user) {
        String found_id = userMapper.checkID(user);
        System.out.println("아이디 중복 체크 id: " + user.getLogin_id() + "<< input id ,  found_id  >>" + found_id);
        if(user.getLogin_id().equals(found_id)){
            System.out.println("아이디 있음. 사용 불가 1");
            return new Result(1, "false");
        }
        else{
            System.out.println("아이디 없음. 사용 가능 0");
        return new Result(0, found_id);}
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
    public LoginResult Login(@RequestBody User user) {
        System.out.println("try to login user: " + user);

        User userInfo = userMapper.Login(user);
        String input_password = user.getPassword();
        String user_pw = userInfo.getPassword();
        System.out.println(user_pw + " : " +  user.getPassword());
        if(!user_pw.equals(input_password)) {
            return new LoginResult(0, "fales", "");
        }
        return new LoginResult(userInfo.getUser_id(), userInfo.getName(), userInfo.getUpdated_time());
    }

    //updatedTime 기준 알람 받기
    @RequestMapping(method = RequestMethod.POST, value = "/user/fullAlert")
    public ArrayList<HashMap> alert(@RequestBody HashMap map)  {
        System.out.println("checkedTime : " + map.get("checkedTime") + "currentTime : " + map.get("currentTime"));
        ArrayList<HashMap> notification = userMapper.notification(map);
//        System.out.println("알람 나올 것들: " + notification);
        if(notification == null || notification.isEmpty()){
            return null;
        }
        return notification;
    }






    //프로필사진등록
    @RequestMapping(method = RequestMethod.POST, value = "/user/insertUserImage")
    public Result insertUserImage(@RequestParam("file") MultipartFile file, User user) throws Exception {
        System.out.println("이미지 삽입 user: " + user);

        ImageVO image = fileUtils.parseInsertFileInfoForUser(file,user);
        userMapper.insertUserImage(image); //친구리스트에 자기자신 추가


        return new Result(0, "success");
    }

    //프로필불러오기
    @RequestMapping(method = RequestMethod.POST, value = "/user/loadProfile")
    public UserResult loadProfile(@RequestBody User user) {

        UserResult userProfile = userMapper.loadProfile(user);
        System.out.println("Load Profile : " + userProfile);
        return userProfile;
    }




    //유저 클라우드 단어 불러오기
    @RequestMapping(method = RequestMethod.POST, value = "/user/getUserWords")
    public ArrayList<CloudVO> getUserWords(@RequestBody User user) {

        ArrayList<CloudVO> userWords = userMapper.getUserWords(user);
        System.out.println("get user tags : " + userWords);
        return userWords;
    }





    //유저 카테고리 값 가져오기
    @RequestMapping(method = RequestMethod.POST, value = "/user/getUserValue")
    public int[] getUserValue(@RequestBody User user) {
        String userid =  user.getLogin_id();
        System.out.println("get value of tag : " + userid);
        int[] numbers = {0,0,0,0,0,0,0,0 };
        ArrayList<Catagory> UserCatagory = new ArrayList<>();
        UserCatagory = userMapper.getUserValueByCategory(user);
        int size = UserCatagory.size();
        for(int i=0, j=0; i < 8 ; i++){
            if(UserCatagory.get(j).getCatagory()-1 == i) {
                numbers[i] = UserCatagory.get(j).getCnt();
                if(j < size-1) j++;
            }
        }
        System.out.println("user category value : " + numbers);
        return numbers;
    }


    //시간 업데이트
    @RequestMapping(method = RequestMethod.POST, value="user/updateTime")
    public Result updateUserTime(@RequestBody User user){
        System.out.println("update time :" + user.getUpdated_time());
        userMapper.updateUserTime(user);
        return new Result(0, "success");
    }

    //사용자 검색
    @RequestMapping(method = RequestMethod.GET, value = "/user/findUser/{name}")
    public ArrayList<UserResult> findUser(@PathVariable("name") String name)  {
        System.out.println("try to find name: " + name);

        ArrayList<UserResult> find_User = userMapper.findUser(name);
        if(find_User == null){
            System.out.println("해당하는 사용자없음");
            return new ArrayList<>();
        }
        System.out.println(find_User);
        return find_User;
    }

    //notification
    @RequestMapping(method = RequestMethod.POST, value = "/user/notification")
    public ArrayList<HashMap> Notification(@RequestBody HashMap map)  {
        System.out.println("checkedTime : " + map.get("checkedTime") + "currentTime : " + map.get("currentTime"));
        ArrayList<HashMap> notification = userMapper.notification(map);
//        System.out.println("알람 나올 것들: " + notification);
        if(notification == null || notification.isEmpty()){
            return null;
        }
        return notification;
    }

}
