import React from 'react';
import { FileOutlined, PictureOutlined } from '@ant-design/icons';

const fileTypeIcon = (type: string) => {
  if (type.startsWith('image/')) return <PictureOutlined style={{ color: '#1890ff' }} />;
  if (type === 'application/pdf') return <FileOutlined style={{ color: '#f5222d' }} />;
  if (type.startsWith('audio/')) return <FileOutlined style={{ color: '#8c8c8c' }} />;
  if (type.startsWith('video/')) return <FileOutlined style={{ color: '#faad14' }} />;
  if (type === 'application/zip' || type === 'application/x-zip-compressed') return <FileOutlined style={{ color: '#faad14' }} />;
  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || type === 'application/msword') return <FileOutlined style={{ color: '#1890ff' }} />;
  if (type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || type === 'application/vnd.ms-powerpoint') return <FileOutlined style={{ color: '#faad14' }} />;
  return <FileOutlined style={{ color: '#8c8c8c' }} />;
};

const formatSize = (size: number) => {
  if (size > 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  if (size > 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${size} B`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FileMessageCard = ({ files }: { files: any[] }) => (
  <div className="file-message-card">
    {files.map((file) => (
      <div key={file.uid} className="file-message-card-item">
        <span className="file-message-card-icon">{fileTypeIcon(file.type)}</span>
        <div className="file-message-card-info">
          <div className="file-message-card-name">{file.name}</div>
          <div className="file-message-card-size">{formatSize(file.size)}</div>
        </div>
      </div>
    ))}
  </div>
);

export default FileMessageCard; 