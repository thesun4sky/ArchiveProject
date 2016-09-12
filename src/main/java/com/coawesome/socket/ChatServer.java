package com.coawesome.socket;

/**
 * Created by Hosea on 2016-07-13.
 */

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;

public class ChatServer {
    private HashMap<String, DataOutputStream> clients;
    private ServerSocket serverSocket;

    public static void main(String[] args) {
//        new ChatServer().start();//TODO 서버 가동시 스타트
    }

    public ChatServer() {
        clients = new HashMap<String, DataOutputStream>();

        // 여러 스레드에서 접근할 것이므로 동기화
        Collections.synchronizedMap(clients);
    }

    public void start() {
        try {
            Socket socket;

            // 리스너 소켓 생성
            serverSocket = new ServerSocket(7777);
            System.out.println("서버가 시작되었습니다.");

            // 클라이언트와 연결되면
            while (true) {
                // 통신 소켓을 생성하고 스레드 생성(소켓은 1:1로만 연결된다)
                socket = serverSocket.accept();
                ServerReceiver receiver = new ServerReceiver(socket);
                receiver.start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    class ServerReceiver extends Thread {
        Socket socket;
        DataInputStream input;
        DataOutputStream output;

        public ServerReceiver(Socket socket) {
            this.socket = socket;
            try {
                input = new DataInputStream(socket.getInputStream());
                output = new DataOutputStream(socket.getOutputStream());
            } catch (IOException e) {
            }
        }

        @Override
        public void run() {
            String name = "";
            try {
                // 클라이언트가 서버에 접속하면 대화방에 알린다.
                name = input.readUTF();
                sendToAll("#" + name + "[" + socket.getInetAddress() + ":"
                        + socket.getPort() + "]" + "님이 대화방에 접속하였습니다.");

                clients.put(name, output);
                System.out.println(name + "[" + socket.getInetAddress() + ":"
                        + socket.getPort() + "]" + "님이 대화방에 접속하였습니다.");
                System.out.println("현재 " + clients.size() + "명이 대화방에 접속 중입니다.");

                // 메세지 전송
                while (input != null) {
                    sendToAll(input.readUTF());
                }
            } catch (IOException e) {
            } finally {
                // 접속이 종료되면
                clients.remove(name);
                sendToAll("#" + name + "[" + socket.getInetAddress() + ":"
                        + socket.getPort() + "]" + "님이 대화방에서 나갔습니다.");
                System.out.println(name + "[" + socket.getInetAddress() + ":"
                        + socket.getPort() + "]" + "님이 대화방에서 나갔습니다.");
                System.out.println("현재 " + clients.size() + "명이 대화방에 접속 중입니다.");
            }
        }

        public void sendToAll(String message) {
            Iterator<String> it = clients.keySet().iterator();

            while (it.hasNext()) {
                try {
                    DataOutputStream dos = clients.get(it.next());
                    dos.writeUTF(message);
                } catch (Exception e) {
                }
            }
        }
    }
}