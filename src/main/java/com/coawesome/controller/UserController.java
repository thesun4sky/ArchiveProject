package com.coawesome.controller;


import com.coawesome.config.SendSimpleMail;
import com.coawesome.domain.*;
import com.coawesome.persistence.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import java.util.ArrayList;
import java.util.Date;
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
        if (found_pass == null) {
            System.out.println("해당하는 password 없음");
            return new Result(0, "false");
        } else {
            System.out.println(found_pass);
            return new Result(0, found_pass);
        }
    }

    //비밀번호 보내기
    @RequestMapping(method = RequestMethod.POST, value = "/user/sendEmail")
    public Result sendEmail(@RequestBody User user) throws MessagingException {
        String Email = user.getEmail();
        String found_pass = user.getPassword();

            SendSimpleMail mail = new SendSimpleMail();
            mail.sendmail(found_pass, Email);

            return new Result(0,"success");
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
        else{
//            new ChatClient().start(userInfo.getUser_id());
            return new LoginResult(userInfo.getUser_id(), userInfo.getName(), userInfo.getUpdated_time());
        }
    }

    //로그아웃
    @RequestMapping(method = RequestMethod.POST, value = "/user/logOut")
    public void LogOut() {
        System.out.printf("로그아웃 동작");
        System.exit(0);
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
        if(userMapper.boardEmpty(user)==0)   userProfile.setPosNeg(-1);
        else userProfile.setPosNeg(userMapper.userPosNeg(user));

        String message ="";

        if(userProfile.getPosNeg()==-1) message = "문화생활 새내기 입니다.";
        else {
            switch (userProfile.getCatagory()) {
                case 1:
                    message += "영화를 ";
                    break;
                case 2:
                    message += "연극을 ";
                    break;
                case 3:
                    message += "콘서트를 ";
                    break;
                case 4:
                    message += "드라마를 ";
                    break;
                case 5:
                    message += "전시회를 ";
                    break;
                case 6:
                    message += "음식을 ";
                    break;
                case 7:
                    message += "여행을 ";
                    break;
                case 8:
                    message += "음악을 ";
                    break;
            }
            message += "가장 좋아하는 ";
            if (userProfile.getPosNeg() == 0) message += "날카로운 비평가 입니다.";
            else message += "해피바이러스 전도사 입니다.";
        }
        userProfile.setMessage(message);
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
//        System.out.println("checkedTime : " + map.get("checkedTime") + "currentTime : " + map.get("currentTime"));
        ArrayList<HashMap> notification = userMapper.notification(map);
//        System.out.println("알람 나올 것들: " + notification);
        if(notification == null || notification.isEmpty()){
            return null;
        }
        return notification;
    }

    //친구 추천(내친구가아니고, 나의 카테고리 최대항목과 같은 게시글을 많이 가지고있는 유저)
    @RequestMapping(method = RequestMethod.POST, value = "/user/findCategoryFriend")
    public UserResult findCategoryFriend(@RequestBody User user) {
        UserResult RecomandedFriend = userMapper.findCategoryFriend(user);
        if(RecomandedFriend == null){
            RecomandedFriend = userMapper.findAnyFriend(user);
        }
        System.out.println("recomand friend : " + RecomandedFriend);
        return RecomandedFriend;
    }

    //채팅 내용 저장
    @RequestMapping(method = RequestMethod.POST, value = "/user/sendChat")
    public Result sendChatMessage(@RequestBody ChatVO chatData) {
        chatData.setDate(new Date());
        System.out.println(chatData);
        userMapper.sendChatMassage(chatData);
        return new Result(0,"success");
    }
    //채팅 내용 불러오기
    @RequestMapping(method = RequestMethod.POST, value = "/user/getChat")
    public ArrayList<ChatVO> getChatMessage(@RequestBody ChatVO chatData) {
        System.out.println(chatData);
        return userMapper.getChatMassage(chatData);
    }

}
