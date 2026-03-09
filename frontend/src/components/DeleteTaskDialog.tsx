type DeleteTaskDialogProps = {
  idSuffix: string;
  taskTitle: string;
  confirming: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
};

export function DeleteTaskDialog({ idSuffix, taskTitle, confirming, onConfirm, onCancel }: DeleteTaskDialogProps) {
  const titleId = `delete-dialog-title-${idSuffix}`;
  const bodyId = `delete-dialog-body-${idSuffix}`;

  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={bodyId}>
      <h4 id={titleId}>タスクを削除しますか？</h4>
      <p id={bodyId}>
        <strong>{taskTitle}</strong> を完全に削除します。この操作は元に戻せません。
      </p>
      <button type="button" onClick={onCancel} disabled={confirming}>
        キャンセル
      </button>
      <button type="button" onClick={() => void onConfirm()} disabled={confirming} autoFocus>
        {confirming ? '削除中…' : '削除する'}
      </button>
    </div>
  );
}
