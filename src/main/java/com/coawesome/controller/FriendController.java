package com.coawesome.controller;

import com.coawesome.domain.Friend;
import com.coawesome.domain.Result;
import com.coawesome.domain.User;
import com.coawesome.domain.UserResult;
import com.coawesome.persistence.FriendMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

/**
 * Created by TeasunKim on 2016-05-17.
 */
@RestController
public class FriendController {

    @Autowired
    FriendMapper friendMapper;

    //친구요청
    @RequestMapping(method = RequestMethod.POST, value = "/user/requestFriend")
    public Result requestFriend(@RequestBody Friend friend) {
        System.out.println(friend);

        friendMapper.requestFriend(friend);

        return new Result(0, "success");
    }

    //친구승낙
    @RequestMapping(method = RequestMethod.POST, value = "/user/acceptFriend")
    public Result acceptFriend(@RequestBody Friend friend) {
        System.out.println(friend);

        friendMapper.updateFriend(friend);
        friendMapper.acceptFriend(friend);

        return new Result(0, "success");
    }

    //친구삭제
    @RequestMapping(method = RequestMethod.POST, value = "/user/deleteFriend")
    public Result deleteFriend(@RequestBody Friend friend) {
        System.out.println(friend);

        friendMapper.deleteFriend(friend);

        int friendID = friend.getFriend_id();
        int userID = friend.getUser_id();
        friend.setUser_id(friendID);
        friend.setFriend_id(userID);
        friendMapper.deleteFriend(friend);
        return new Result(0, "success");
    }


    //친구신청조회
    @RequestMapping(method = RequestMethod.POST, value = "/user/checkFriendRequest")
    public ArrayList<UserResult> checkFriendRequest(@RequestBody User user) {
        System.out.println(user + "친구신청 목록");
        int user_id = user.getUser_id();
        ArrayList<UserResult> result = friendMapper.checkFriendRequest(user_id);

        return result;
    }


    //친구리스트 보기 API
    @RequestMapping(method = RequestMethod.POST, value = "/user/showfriends")
    public ArrayList<UserResult> ShowFriends(@RequestBody User user){
        System.out.println(user.getUser_id());
        int user_id = user.getUser_id();
        ArrayList<UserResult> friends = friendMapper.showFriendsById(user_id);

        return friends;
    }

    //친구 확인 여부 API
    @RequestMapping(method = RequestMethod.POST, value ="/user/checkfriends")
    public Result FrinedsCheck(@RequestBody Friend friend) {
        String check = friendMapper.FriendsCheck(friend);
        System.out.println(friend.getUser_id() + "<user   friend> " + friend.getFriend_id());
        return new Result(0, check);
    }
}
