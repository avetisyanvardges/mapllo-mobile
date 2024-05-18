import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChat, getChatMessages, getChats } from "../../configs/api";
import { initChat, updateChatMessages, updateChats } from "../../slices/chatReducer";

export let currentChatId

export const setCurrentChatId = (id) => {
    currentChatId = id
}

export const ChatUpdater = ({ notification }) => {
    const chats = useSelector(state => state.chats.chats) || []
    const [allChatsUpdated, setAllChatsUpdated] = useState(false)
    const [startTs, setStartTs] = useState(new Date().getTime())
    const [lastMessages, setLastMessages] = useState()
    const dispatch = useDispatch()
    const profileId = useSelector(state => state.auth.id)

    useEffect(() => {
        updateChatsComponent()
    }, [])

    const updateChatsComponent = async () => {
        try {
            const response = await getChats()
            const chats = response.data
            console.log('fetched chats', chats.length)
            const awaits = chats.map(chat => updateChatWithMessages(chat))
            for (a of awaits) {
                await a
            }
            console.log('all chats updated')
            setAllChatsUpdated(true)

        } catch (error) {
            console.error("Failed to fetch chats: ", error);
        }
    }

    const updateChatWithMessages = async (chat) => {
        if (chats && Object.keys(chats).includes(chat.id)) {
            return
        }
        const response = await getChat(chat.id, null, 20, false)
        const messages = response.data
        console.log('fetched chats messages', chat.id)
        chat.messages = messages
        dispatch(initChat(chat))
        console.log('chat updated', chat.id, 'messages', messages.length)
    }

    const lastTs = () => {
        return lastMessages ? (new Date(lastMessages[lastMessages.length - 1].chatMessage.createdAt).getTime()) : startTs
    }

    useEffect(() => {
        if (allChatsUpdated) {
            const updateAllChatMessages = async () => {
                const limit = 1000;
                try {
                    const response = await getChatMessages(lastTs(), limit)
                    const messages = response.data.messages.filter(m => !lastMessages || !lastMessages.map(lm => lm.chatMessage.id).includes(m.chatMessage.id))
                    console.log('updater: fetched messages', messages.length)
                    if (messages.length > 0) {
                        const chatIds = messages.map(m => m.chatMessage.chatId)
                        let updatedChats = chats
                        if (!allKeysExist(chats, chatIds)) {
                            console.log('updater: there is a message from unknown chat, recollecting chats')
                            const chatsResponse = await getChats()
                            const collectedChats = chatsResponse.data
                            const awaits = collectedChats.map(chat => updateChatWithMessages(chat))
                            for (a of awaits) {
                                await a
                            }
                            updatedChats = collectedChats.reduce((acc, obj) => {
                                acc[obj.id] = obj;
                                return acc;
                            }, {});
                        }
                        console.log("updater: adding new messages", messages[0].chatMessage.sender, profileId);
                        setLastMessages(messages)
                        const messagesToNotify = messages.filter(m => m.chatMessage.sender !== profileId && m.chatMessage.chatId !== currentChatId)
                        messagesToNotify.forEach(m => notification.add(updatedChats[m.chatMessage.chatId], m))
                        dispatch(updateChatMessages({messages}));
                    }
                } catch (error) {
                    console.error("updater: Failed to fetch chat messages: ", error);
                }
            };

            const interval = setInterval(updateAllChatMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [allChatsUpdated, lastMessages]);

    const allKeysExist = (dict, keys) => {
        // Convert the Set to an Array and use `every` to check existence of each key
        return keys.every(key => key in dict);
    };
}