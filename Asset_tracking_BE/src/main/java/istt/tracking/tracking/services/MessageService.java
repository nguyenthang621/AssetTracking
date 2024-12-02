package istt.tracking.tracking.services;

import java.util.List;

import org.springframework.stereotype.Service;

import istt.tracking.tracking.entity.Message;
import istt.tracking.tracking.repository.MessageRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository = null;


    public List<Message> getMessages(String room) {
        return messageRepository.findAllByRoom(room);
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }
}