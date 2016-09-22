package com.coawesome.config;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;


public class SendSimpleMail {
    public void sendmail(String password , String email) throws MessagingException {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
        ctx.register(MailConfig.class);
        ctx.refresh();
        JavaMailSenderImpl mailSender = ctx.getBean(JavaMailSenderImpl.class);
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mailMsg = new MimeMessageHelper(mimeMessage);
        mailMsg.setFrom("leemsmail1@gmail.com");
        mailMsg.setTo(email);
        mailMsg.setSubject("Archive 비밀번호 입니다.");
        mailMsg.setText(password);
        mailSender.send(mimeMessage);
        System.out.println("---Done---");
    }
}