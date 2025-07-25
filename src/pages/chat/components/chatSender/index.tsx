import { Button } from 'antd';
// import { ScheduleOutlined, ProductOutlined, AppstoreAddOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Suggestion, Sender } from '@ant-design/x';
import React from 'react';
import type { ChatSenderProps } from '../../types';
import { PaperClipOutlined } from '@ant-design/icons';


const ChatSender: React.FC<ChatSenderProps> = ({
  inputValue,
  setInputValue,
  loading,
  handleUserSubmit,
  abortController,
  sendHeader,
  MOCK_SUGGESTIONS,
  attachmentsOpen,
  setAttachmentsOpen,
  onPasteFile,
}) => {
  return (
    <div className="chatSend">
      {/* <div className="sendAction">
        <Button
          icon={<ScheduleOutlined />}
          onClick={() => handleUserSubmit('早饭吃什么?')}
        >
          早饭吃什么?
        </Button>
        <Button
          icon={<ProductOutlined />}
          onClick={() => handleUserSubmit('午饭吃什么?')}
        >
          午饭吃什么?
        </Button>
        <Button icon={<AppstoreAddOutlined />}>晚饭吃什么</Button>
      </div> */}
      <Suggestion items={MOCK_SUGGESTIONS} onSelect={(itemVal) => setInputValue(`[${itemVal}]:`)}>
        {({ onTrigger, onKeyDown }) => (
          <Sender
            loading={loading}
            value={inputValue}
            onChange={(v) => {
              onTrigger(v === '/');
              setInputValue(v);
            }}
            onSubmit={() => {
              handleUserSubmit(inputValue);
              setInputValue('');
            }}
            onCancel={() => {
              abortController.current?.abort();
            }}
            allowSpeech
            placeholder="Ask or input / use skills"
            onKeyDown={onKeyDown}
            header={sendHeader}
            prefix={
              <Button
                type="text"
                icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
                onClick={() => setAttachmentsOpen(!attachmentsOpen)}
              />
            }
            onPasteFile={onPasteFile}
            actions={(_, info) => {
              const { SendButton, LoadingButton, SpeechButton } = info.components;
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <SpeechButton className="speechButton" />
                  {loading ? <LoadingButton type="default" /> : <SendButton type="primary" />}
                </div>
              );
            }}
          />
        )}
      </Suggestion>
    </div>
  );
};

export default ChatSender; 