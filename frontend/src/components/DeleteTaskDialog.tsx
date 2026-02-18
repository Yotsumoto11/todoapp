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
      <h4 id={titleId}>Delete task?</h4>
      <p id={bodyId}>
        This will permanently delete <strong>{taskTitle}</strong>.
      </p>
      <button type="button" onClick={onCancel} disabled={confirming}>
        Cancel
      </button>
      <button type="button" onClick={() => void onConfirm()} disabled={confirming} autoFocus>
        {confirming ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  );
}
