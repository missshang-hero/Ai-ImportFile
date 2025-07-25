import React from 'react';
import { Button } from 'antd';

interface ConfirmBoxProps {
  show: boolean;
  onError: () => void;
  onSuccess: () => void;
  errorText?: string;
  successText?: string;
}

const ConfirmBox: React.FC<ConfirmBoxProps> = ({
  show,
  onError,
  onSuccess,
  errorText = '数据错误',
  successText = '处理无误',
}) => {
  if (!show) return null;
  return (
    <div className="confirm-box">
      <Button
        danger
        onClick={onError}
        className="confirm-btn confirm-btn-error"
      >
        {errorText}
      </Button>
      <Button
        type="primary"
        onClick={onSuccess}
        className="confirm-btn confirm-btn-success"
      >
        {successText}
      </Button>
    </div>
  );
};

export default ConfirmBox; 