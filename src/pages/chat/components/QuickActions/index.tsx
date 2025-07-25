import React from 'react';
import { Button } from 'antd';

interface QuickActionsProps {
  show: boolean;
  onDownloadTemplate?: () => void;
  onDownloadResult?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  show,
  onDownloadTemplate,
  onDownloadResult,
}) => {
  if (!show) return null;
  return (
    <div className="quick-actions">
      <div className="quick-actions-title">
        <div className="quick-actions-title-text">快捷操作</div>
      </div>
      <div className="quick-actions-btns">
        <Button
          type="link"
          block
          className="quick-actions-btn"
          onClick={onDownloadTemplate}
        >
          有员工信息不完整，点击下载表格
        </Button>
        <Button
          type="link"
          block
          className="quick-actions-btn"
          onClick={onDownloadResult}
        >
          点击下载添加结果
        </Button>
      </div>
    </div>
  );
};

export default QuickActions; 