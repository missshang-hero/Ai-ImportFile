import { Attachments, Sender } from '@ant-design/x';
import { CloudUploadOutlined } from '@ant-design/icons';
import type { Conversation } from '@ant-design/x/es/conversations';
import { useEffect, useRef, useState } from 'react';
import './styles/index.less';
import type { CopilotProps } from './types';
import ChatHeader from './components/ChatHeader';
import ChatList from './components/ChatList';
import ChatSender from './components/chatSender';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import { chatConversation, chatConversationSummary, chatInteraction } from '@/services/chart';
import { useRequest } from 'ahooks';
import { batchDownloadSigns, fileUpload, getUploadSign } from '@/services/oss';

const MOCK_SESSION_LIST = [
  {
    key: '5',
    label: 'New session',
    group: '今天',
  },
  {
    key: '4',
    label: 'What has Ant Design X upgraded?',
    group: '今天',
  },
  {
    key: '3',
    label: 'New AGI Hybrid Interface',
    group: '今天',
  },
  {
    key: '2',
    label: 'How to quickly install and import components?',
    group: '昨天',
  },
  {
    key: '1',
    label: 'What is Ant Design X?',
    group: '昨天',
  },
];
const MOCK_SUGGESTIONS = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    // icon: <OpenAIFilled />,
    icon: null,
    children: [
      { label: 'About React', value: 'react' },
      { label: 'About Ant Design', value: 'antd' },
    ],
  },
];
const MOCK_QUESTIONS = [
  '早上好?',
  '中午好?',
  '晚上好',
];
const AGENT_PLACEHOLDER = 'Generating content, please wait...';



const Copilot = (props: CopilotProps) => {
  const { copilotOpen, setCopilotOpen } = props;
  const abortController = useRef<AbortController | null>(null);

  // ==================== State ====================
  // 消息历史记录，key为会话id，value为消息数组
  const [title, setTitle] = useState('小班助手-智能导入花名册');
   
  const [messageHistory, setMessageHistory] = useState<Record<string, ChatMsg[]>>({});

  // 会话列表，初始为MOCK_SESSION_LIST
  const [sessionList, setSessionList] = useState<Conversation[]>(MOCK_SESSION_LIST);
  // 当前会话的key
  const [curSession, setCurSession] = useState(sessionList[0].key);

  // 附件上传弹窗开关
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);

  // 输入框内容
  const [inputValue, setInputValue] = useState('');

  // 控制确认框和快捷操作的显示
  const [showConfirmBox] = useState(true);
  const [showQuickActions] = useState(true);

  // 示例回调
  const handleConfirmError = () => { alert('点击了数据错误'); };
  const handleConfirmSuccess = () => { alert('点击了处理无误'); };
  const handleDownloadTemplate = () => { alert('下载表格'); };
  const handleDownloadResult = () => { alert('下载结果'); };
  /* 初始化创建对话 获取欢迎语 */
  const { run: runGetChatConversation, data:chatConversationData } = useRequest(chatConversation, {
    manual: true,
    onSuccess: (res) => {
      console.log(res,'res');
    }
  })

   //
   const { run: runGetChatConversationSummary} = useRequest(chatConversationSummary, {
    manual: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (res: any) => {
      setTitle(res.title)
      console.log(res,'res');
    }
  })
 

  // ==================== Runtime ====================
  // 用XRequest实现交互
  // const request = XRequest({
  //   baseURL: '/api', // 可根据实际后端接口调整
  //   fetch: async (params: any) => {
  //     const res = await chatInteraction(params);
  //     return new Response(JSON.stringify(res));
  //   },
  // });

  // useXChat用于管理消息流、请求、消息变换等
  type ChatMsg = {
    id: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message: { content?: string; role: string; type?: string; files?: UploadFile<any>[] };
    status?: string;
  };
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  // ==================== Event ====================
  // 用户提交消息事件
  const handleUserSubmit = async (val: string) => {
    let fileArr=[]
    
    
    // 先插入用户文本消息
    let nextMsgs: ChatMsg[] = [
      ...messages,
      {
        id: Date.now() + Math.random(),
        message: { content: val, role: 'user' },
        status: 'success',
      },
    ];
    // 如有文件，插入文件消息
    if (files.length > 0) {
       fileArr = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        files.map(async (file:any) => {
          const key = await file?.object_key;
          return { file_key: key,  file_name: file?.name };
        })
      );
      // 获取url
      // const res = await batchDownloadSigns(files.map((file:any) => ({object_key:file.object_key})))
      // console.log(res,'res');
      nextMsgs = [
        ...nextMsgs,
        {
          id: Date.now() + Math.random(),
          message: { type: 'file', files: [...fileArr], role: 'user' },
          status: 'success',
        },
      ];
      setFiles([]);
    }
    setMessages(nextMsgs);
    // AI回复
    try {
      const data = await chatInteraction({ content: val, role: 'user' });
      setMessages([
        ...nextMsgs,
        {
          id: Date.now() + Math.random(),
          message: { content: Array.isArray(data) ? data.join('') : data, role: 'assistant' },
          status: 'success',
        },
      ]);
    } catch {
      setMessages([
        ...nextMsgs,
        {
          id: Date.now() + Math.random(),
          message: { content: 'Request failed, please try again!', role: 'assistant' },
          status: 'error',
        },
      ]);
    }
    // 如果当前会话标题为New session，则用输入内容前20字符替换
    if (sessionList.find((i) => i.key === curSession)?.label === 'New session') {
      setSessionList(
        sessionList.map((i) => (i.key !== curSession ? i : { ...i, label: val?.slice(0, 20) })),
      );
    }
  };

    // 文件上传到OSS
  async function uploadFileToOSS(file: File) {
    const suffix = file?.name?.slice(file?.name?.lastIndexOf('.') + 1);
    const { data } = await getUploadSign({
      file_suffix: suffix,
      file_name: file?.name,
      content_type: file?.type,
    });
    console.log(data,'data');
    const formData = new FormData();
    formData.append('key', data?.object_key);
    formData.append('OSSAccessKeyId', data?.access_id);
    formData.append('policy', data?.policy);
    formData.append('Signature', data?.signature);
    formData.append('success_action_status', '200');
    formData.append('x-oss-meta-file-name', file.name);
    formData.append('x-oss-content-type', file.type);
    formData.append('file', file);
    // await fileUpload({host:data.host,formData})    
    await fetch(data.host, { method: 'POST', body: formData });
    
    // console.log(res,'res');
    return data?.object_key;
  }

  // 粘贴文件事件，自动上传到附件
  const onPasteFile = (_: File, filesList: FileList | UploadFile[]) => {
    
    let uploadFiles: UploadFile[] = [];
    if (filesList instanceof FileList) {
      uploadFiles = Array.from(filesList).map((file) => {
        const rcFile = file as RcFile;
        rcFile.uid = `${Date.now()}-${file.name}`;
        const object_key = uploadFileToOSS(file)
        return {
          uid: rcFile.uid,
          name: rcFile.name,
          status: 'done',
          originFileObj: rcFile,
          size: rcFile.size,
          type: rcFile.type,
          lastModified: rcFile.lastModified,
          lastModifiedDate: new Date(file.lastModified),
          percent: 100,
          object_key: object_key,
        };
      });
    } else {
      uploadFiles = filesList as UploadFile[];
    }
    setFiles([...files, ...uploadFiles]);
    setAttachmentsOpen(true);
    
  };

  // ==================== Nodes ====================
  // 附件上传头部区域
  const sendHeader = (
    <Sender.Header
      title="Upload File"
      styles={{ content: { padding: 0 } }}
      open={attachmentsOpen}
      onOpenChange={setAttachmentsOpen}
      forceRender
    >
      <Attachments
        beforeUpload={() => {
          
        }}
        items={files}
        onChange={({ fileList }) => {
          console.log(fileList,'fileList');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fileList.forEach((file:any) => {
            if (!file.object_key) {
              const object_key = uploadFileToOSS(file)
              file.object_key = object_key
            }
          })
          setFiles(fileList)
        }}
        placeholder={(type) =>
          type === 'drop'
            ? { title: 'Drop file here' }
            : {
                icon: <CloudUploadOutlined />, 
                title: 'Upload files',
                description: 'Click or drag files to this area to upload',
              }
        }
      />
    </Sender.Header>
  );

  useEffect(() => {
    // 初始化创建对话 获取欢迎语
    // runGetChatConversation({conversation_name:'test'})
  }, [])
  useEffect(() => {
    // 消息变化时，记录到当前会话的历史
    if (messages?.length) {
      setMessageHistory((prev) => ({
        ...prev,
        [curSession]: messages,
      }));
    }
  }, [messages]);

  return (
    <div className="copilotChat" style={{ width: copilotOpen ? 600 : 0 }}>
      {/** 对话区 - header */}
      <ChatHeader
        title={title}
        sessionList={sessionList}
        curSession={curSession}
        setSessionList={setSessionList}
        setCurSession={setCurSession}
        setMessages={setMessages}
        setCopilotOpen={setCopilotOpen}
        messages={messages}
        abortController={abortController}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messageHistory={messageHistory as Record<string, any[]>}
      />

      {/** 对话区 - 消息列表 */}
      <ChatList
        messages={messages}
        welcomeCardData={chatConversationData}
        MOCK_QUESTIONS={MOCK_QUESTIONS}
        handleUserSubmit={handleUserSubmit}
        AGENT_PLACEHOLDER={AGENT_PLACEHOLDER}
        showConfirmBox={showConfirmBox}
        showQuickActions={showQuickActions}
        onConfirmError={handleConfirmError}
        onConfirmSuccess={handleConfirmSuccess}
        onDownloadTemplate={handleDownloadTemplate}
        onDownloadResult={handleDownloadResult}
      />

      {/** 对话区 - 输入框 */}
      <ChatSender
        inputValue={inputValue}
        setInputValue={setInputValue}
        loading={false}
        handleUserSubmit={handleUserSubmit}
        abortController={abortController}
        sendHeader={sendHeader}
        MOCK_SUGGESTIONS={MOCK_SUGGESTIONS}
        attachmentsOpen={attachmentsOpen}
        setAttachmentsOpen={setAttachmentsOpen}
        onPasteFile={onPasteFile}
      />
    </div>
  );
};

const XiaopinChart = () => {
  // ==================== State =================
  // Copilot对话区开关
  const [copilotOpen, setCopilotOpen] = useState(true);

  // ==================== Render =================
  return (
    <div className="copilotWrapper">
      {/** 右侧对话区 */}
      <Copilot copilotOpen={copilotOpen} setCopilotOpen={setCopilotOpen} />
    </div>
  );
};

export default XiaopinChart;