/* eslint-disable @typescript-eslint/no-explicit-any */
import {Prompts } from '@ant-design/x';
import React from 'react';
import FileMessageCard from '../FileMessageCard';
import ConfirmBox from '../ConfirmBox';
import QuickActions from '../QuickActions';
import type { ChatListProps } from '../../types';
// import type { MessageInfo } from '@ant-design/x'; // @ant-design/x未导出该类型
// import type { BubbleDataType } from '../types';
import WelcomeCard from '../WelcomeCard';


const ChatList: React.FC<ChatListProps> = (props) => {
  const {
    messages = [],
    MOCK_QUESTIONS,
    handleUserSubmit,
    showConfirmBox,
    showQuickActions,
    onConfirmError,
    onConfirmSuccess,
    onDownloadTemplate,
    onDownloadResult,
    welcomeCardData,
  } = props;

  return (
    <div className="chatList">
      {messages.length > 0 ? (
        <>
          {messages.map((msg: any, idx: number) => {
            // 只有role为'user'的消息和文件右对齐，其余都左对齐
            const isUser = msg?.message?.role === 'user';
            if (msg.message?.type === 'file') {
              return (
                <div key={msg.id || idx} className={isUser ? 'chatMsg-user' : 'chatMsg-assistant'}>
                  <FileMessageCard files={msg.message.files || []} />
                </div>
              );
            }
            // 确认框
            if (msg.type === 'ConfirmBox') {
              return (
                <div className="chatMsg-assistant">
                  <ConfirmBox
                    show={!!showConfirmBox}
                    onError={onConfirmError || (() => {})}
                    onSuccess={onConfirmSuccess || (() => {})}
                  />
                </div>
              );
            }
            // 快捷操作
            if (msg.type === 'QuickActions') {
              return (
                <div className="chatMsg-assistant">
                  <QuickActions
                    show={!!showQuickActions}
                    onDownloadTemplate={onDownloadTemplate}
                    onDownloadResult={onDownloadResult}
                  />
                </div>
              );
            }
            // 普通文本消息
            return (
              <div
                key={msg.id || idx}
                className={isUser ? 'chatMsg-user' : 'chatMsg-assistant'}
              >
                <div className="chatMsg-bubble">
                  {msg.message?.content || ''}
                </div>
              </div>
            );
          })}
          {/* 回复类操作区也应左对齐 */}
          {/* <div className="chatMsg-assistant">
            <ConfirmBox
              show={!!showConfirmBox}
              onError={onConfirmError || (() => {})}
              onSuccess={onConfirmSuccess || (() => {})}
            />
          </div>
          <div className="chatMsg-assistant">
            <QuickActions
              show={!!showQuickActions}
              onDownloadTemplate={onDownloadTemplate}
              onDownloadResult={onDownloadResult}
            />
          </div> */}
        </>
      ) : (
        <>
          <WelcomeCard
            description={welcomeCardData?.content || "我可以把员工信息自动整理，并录入人力系统\n待整理的信息可以是：文字、图片、表格\n发给我试一下吧！"}
            imgUrl={welcomeCardData?.img_url || "https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"}
          />
          <Prompts
            vertical
            title="I can help："
            items={MOCK_QUESTIONS?.map((i) => ({ key: i, description: i }))}
            onItemClick={(info) => handleUserSubmit?.(info?.data?.description as string)}
            style={{ marginInline: 16 }}
            styles={{ title: { fontSize: 14 } }}
          />
        </>
      )}
    </div>
  );
};

export default ChatList; 