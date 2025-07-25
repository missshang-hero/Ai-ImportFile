import {
  CloseOutlined,
  CommentOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import { Button, Popover, Space, message } from 'antd';
import dayjs from 'dayjs';
import type { ChatHeaderProps } from '../../types';



const ChatHeader = <T,>({
  title,
  sessionList,
  curSession,
  setSessionList,
  setCurSession,
  setMessages,
  setCopilotOpen,
  messages,
  abortController,
  messageHistory,
}: ChatHeaderProps<T>) => {
  return (
    <div className="chatHeader">
      <div className="headerTitle">{title}</div>
      <Space size={0}>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={() => {
            if (messages?.length) {
              const timeNow = dayjs().valueOf().toString();
              abortController.current?.abort();
              // 终止请求后异步切换会话，规避时序问题
              setTimeout(() => {
                setSessionList([
                  { key: timeNow, label: 'New session', group: '今天' },
                  ...sessionList,
                ]);
                setCurSession(timeNow);
                setMessages([] as T[]); // 保证类型安全
              }, 100);
            } else {
              message.error('It is now a new conversation.');
            }
          }}
          className="headerButton"
        />
        <Popover
          placement="bottom"
          styles={{ body: { padding: 0, maxHeight: 600 } }}
          content={
            <Conversations
              items={sessionList?.map((i) =>
                i.key === curSession ? { ...i, label: `[current] ${i.label}` } : i,
              )}
              activeKey={curSession}
              groupable
              onActiveChange={async (val) => {
                abortController.current?.abort();
                // 终止请求后异步切换会话，规避时序问题
                setTimeout(() => {
                  setCurSession(val);
                  setMessages((messageHistory?.[val] || []) as T[]);
                }, 100);
              }}
              styles={{ item: { padding: '0 8px' } }}
              className="conversations"
            />
          }
        >
          <Button type="text" icon={<CommentOutlined />} className="headerButton" />
        </Popover>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => setCopilotOpen(false)}
          className="headerButton"
        />
      </Space>
    </div>
  );
};

export default ChatHeader; 