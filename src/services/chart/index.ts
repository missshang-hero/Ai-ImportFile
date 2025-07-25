import http from '../../utils/http';

//  对话交互
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chatInteraction = (data:any): Promise<string[]> =>
  http.post(`https://xxx.com/see/event/define/CREATE_CONVERSATION`,data);

// 创建会话 获取欢迎语
export const chatConversation = (data:{conversation_name:string}): Promise<string[]> =>
  http.post(`https://xxx.com/ai/chat/conversation`,data);

/**
 * 获取会话总结
 * @param data 
 * conversation_id: 会话id;
 * @returns 会话总结
 */
export const chatConversationSummary = (data:{conversation_id:string}): Promise<string[]> =>
  http.post(`https://xxx.com/ai/conversation/summary`,data);

/*
  查询会话列表
  * @param limit 查询数量
  * @returns 会话详情
*/ 
export const chatConversationList = (data:{limit:number}): Promise<string[]> =>
  http.post(`https://xxx.com/ai/chat/conversation/search`,data);
/*
  获取会话详情
  * @param conversation_id 会话id
  * @param limit 查询数量
  * @param cursor_id 游标id
  * @returns 会话详情
*/ 
export const chatConversationDetail = (data:{conversation_id:string}): Promise<string[]> =>
  http.post(`https://xxx.com/ai/chat/conversation/detail`,data);
// 删除会话
// export const chatConversationDelete = (data:{conversation_id:string}): Promise<string[]> =>
//   http.post(`https://xxx.com/ai/chat/conversation/delete`,data);
/*
  更新会话
  * @param conversation_id 会话id
  * @param conversation_name 会话名称
  * @returns 会话列表
*/ 
export const chatConversationUpdate = (data:{conversation_id:string,conversation_name:string}): Promise<string[]> =>
  http.post(`https://xxx.com/ai/chat/conversation/update`,data);
